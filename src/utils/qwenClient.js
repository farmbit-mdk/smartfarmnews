/**
 * qwenClient.js
 * OpenRouter Qwen 통합 클라이언트
 *
 * - OpenAI SDK 호환 (OpenRouter base URL 사용)
 * - 작업(task)별 모델·토큰·temperature 자동 선택
 * - Free 모델 일일 한도 관리 (1,000 req/day)
 * - Rate limit 초과 시 Pro 모델 자동 폴백
 * - 실행마다 agent_logs에 비용 기록 (qwenCostTracker)
 */

import OpenAI from 'openai';
import { config } from '../config/env.js';
import { trackUsage, calcCost } from './qwenCostTracker.js';

// ── OpenRouter 클라이언트 초기화 ────────────────────────────────────
const openRouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey:  config.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'https://smartfarmnews.com',
    'X-Title':      'SmartFarmNews',
  },
});

// ── 모델 상수 ──────────────────────────────────────────────────────
export const QWEN_MODELS = {
  FREE:         config.QWEN_MODEL_FREE,    // 번역·요약·분류·파싱 (현재: qwen-2.5-7b-instruct)
  PRO:          config.QWEN_MODEL_PRO,     // 논평·다국어 번역·SEO·설명 (현재: qwen-2.5-7b-instruct)
  REASON:       config.QWEN_MODEL_REASON,  // 인사이트 기사·심층 분석 (현재: qwen-2.5-7b-instruct)
  CODER:        config.QWEN_MODEL_CODER,   // 개발 시에만 사용 (현재: qwen-2.5-7b-instruct)
  GEMINI_FLASH: 'google/gemini-2.5-flash', // 심층 분석 아티클 생성
};

// ── 작업 → 모델 매핑 ────────────────────────────────────────────────
const TASK_MODEL_MAP = {
  // Free tier
  translate_ko:   QWEN_MODELS.FREE,
  summarize:      QWEN_MODELS.FREE,
  classify:       QWEN_MODELS.FREE,
  tag_extract:    QWEN_MODELS.FREE,
  parse_data:     QWEN_MODELS.FREE,
  parse_auction:  QWEN_MODELS.FREE,
  event_summary:  QWEN_MODELS.FREE,

  // Pro tier (현재 FREE 모델과 동일 — 고품질 모델로 교체 시 .env만 수정)
  analyze_ko:     QWEN_MODELS.GEMINI_FLASH,  // 심층 분석 아티클 — Gemini 2.5 Flash
  commentary:     QWEN_MODELS.PRO,
  translate_zh:   QWEN_MODELS.PRO,
  translate_vi:   QWEN_MODELS.PRO,
  translate_en:   QWEN_MODELS.PRO,
  seo_meta:       QWEN_MODELS.PRO,
  description_gen: QWEN_MODELS.PRO,

  // Reason tier (현재 FREE 모델과 동일 — 심층 분석용 모델로 교체 시 .env만 수정)
  insight_article: QWEN_MODELS.REASON,
  deep_analysis:   QWEN_MODELS.REASON,
  paper_insight:   QWEN_MODELS.REASON,
};

// ── 작업별 토큰·temperature 설정 ────────────────────────────────────
const TASK_CONFIG = {
  translate_ko:    { maxTokens: 300,  temperature: 0.1 },
  analyze_ko:      { maxTokens: 2000, temperature: 0.3 },
  summarize:       { maxTokens: 200,  temperature: 0.2 },
  classify:        { maxTokens: 50,   temperature: 0.0 },
  tag_extract:     { maxTokens: 60,   temperature: 0.0 },
  parse_data:      { maxTokens: 300,  temperature: 0.0 },
  parse_auction:   { maxTokens: 300,  temperature: 0.0 },
  commentary:      { maxTokens: 120,  temperature: 0.5 },
  translate_zh:    { maxTokens: 600,  temperature: 0.1 },
  translate_vi:    { maxTokens: 600,  temperature: 0.1 },
  translate_en:    { maxTokens: 600,  temperature: 0.1 },
  seo_meta:        { maxTokens: 150,  temperature: 0.3 },
  description_gen: { maxTokens: 200,  temperature: 0.3 },
  event_summary:   { maxTokens: 300,  temperature: 0.2 },
  insight_article: { maxTokens: 1000, temperature: 0.4 },
  deep_analysis:   { maxTokens: 1500, temperature: 0.4 },
  paper_insight:   { maxTokens: 800,  temperature: 0.3 },
};

// ── Free 모델 일일 사용량 추적 (in-memory) ─────────────────────────
// 운영 환경에서는 Redis로 관리 권장 (서버 재시작 시 초기화됨)
const _freeUsage = { date: '', count: 0 };

function getFreeUsage() {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  if (_freeUsage.date !== today) {
    _freeUsage.date  = today;
    _freeUsage.count = 0;
  }
  return _freeUsage;
}

function isFreeModel(model) {
  return model === QWEN_MODELS.FREE || model === QWEN_MODELS.REASON;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── 핵심 API 호출 함수 ──────────────────────────────────────────────

/**
 * Qwen 모델 호출
 *
 * @param {string} taskType           - TASK_MODEL_MAP의 키 (모델·설정 자동 결정)
 * @param {string} systemPrompt       - 시스템 프롬프트 (PROMPTS.* 사용 권장)
 * @param {string} userContent        - 처리할 실제 텍스트
 * @param {object} [options]
 * @param {string} [options.model]    - 모델 강제 지정 (기본: taskType 기반)
 * @param {number} [options.maxTokens]
 * @param {number} [options.temperature]
 * @param {string} [options.agentName] - 로그용 에이전트 이름
 * @returns {Promise<string>}          - AI 응답 텍스트
 */
export async function callQwen(taskType, systemPrompt, userContent, options = {}) {
  const model       = options.model       ?? TASK_MODEL_MAP[taskType] ?? QWEN_MODELS.FREE;
  const taskCfg     = TASK_CONFIG[taskType] ?? { maxTokens: 500, temperature: 0.3 };
  const maxTokens   = options.maxTokens   ?? taskCfg.maxTokens;
  const temperature = options.temperature ?? taskCfg.temperature;
  const agentName   = options.agentName   ?? 'unknown';

  // Free 모델 일일 한도 체크 → 초과 시 Pro 폴백
  if (isFreeModel(model)) {
    const usage = getFreeUsage();
    if (usage.count >= config.QWEN_FREE_DAILY_LIMIT) {
      console.warn(
        `[Qwen] Free daily limit (${config.QWEN_FREE_DAILY_LIMIT}) reached. Falling back to PRO for: ${taskType}`,
      );
      return callQwen(taskType, systemPrompt, userContent, { ...options, model: QWEN_MODELS.PRO });
    }
  }

  // Rate limit 딜레이
  await sleep(isFreeModel(model) ? config.QWEN_FREE_DELAY_MS : config.QWEN_PRO_DELAY_MS);

  const startedAt = Date.now();

  try {
    const response = await openRouter.chat.completions.create({
      model,
      max_tokens:  maxTokens,
      temperature,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userContent  },
      ],
    });

    const usage   = response.usage;
    const text    = response.choices[0]?.message?.content?.trim() ?? '';
    const durationMs = Date.now() - startedAt;

    // Free 모델 사용량 증가
    if (isFreeModel(model)) getFreeUsage().count += 1;

    await trackUsage({
      agentName,
      taskType,
      model,
      status:           'success',
      promptTokens:     usage?.prompt_tokens     ?? 0,
      completionTokens: usage?.completion_tokens ?? 0,
      tokensUsed:       usage?.total_tokens      ?? 0,
      durationMs,
    });

    return text;

  } catch (err) {
    const durationMs = Date.now() - startedAt;
    const isRateLimit = err?.status === 429 || String(err?.message).toLowerCase().includes('rate limit');

    // Rate limit 초과 + Free 모델 → Pro 자동 폴백
    if (isRateLimit && isFreeModel(model)) {
      console.warn(`[Qwen] Rate limit on free model. Falling back to PRO for: ${taskType}`);
      return callQwen(taskType, systemPrompt, userContent, { ...options, model: QWEN_MODELS.PRO });
    }

    await trackUsage({
      agentName, taskType, model,
      status:    'failed',
      tokensUsed: 0,
      durationMs,
      error:     err.message,
    });

    throw err;
  }
}

// ── 배치 처리 헬퍼 ──────────────────────────────────────────────────

/**
 * 여러 항목을 순차 처리 (Rate limit 준수)
 * 개별 실패는 결과에 기록하고 계속 진행
 *
 * @param {T[]} items                                     - 처리할 항목 배열
 * @param {(item: T, index: number) => Promise<R>} handler - 항목별 처리 함수
 * @returns {Promise<Array<{success: boolean, data?: R, error?: string}>>}
 */
export async function processSequentially(items, handler) {
  const results = [];
  for (let i = 0; i < items.length; i++) {
    try {
      const data = await handler(items[i], i);
      results.push({ success: true, data });
    } catch (err) {
      console.error(`[Qwen] processSequentially error at index ${i}:`, err.message);
      results.push({ success: false, error: err.message });
    }
  }
  return results;
}

/**
 * 현재 Free 모델 일일 사용량 조회 (모니터링용)
 * @returns {{ date: string, count: number, remaining: number }}
 */
export function getFreeUsageStatus() {
  const usage = getFreeUsage();
  return {
    date:      usage.date,
    count:     usage.count,
    remaining: Math.max(0, config.QWEN_FREE_DAILY_LIMIT - usage.count),
    limit:     config.QWEN_FREE_DAILY_LIMIT,
  };
}
