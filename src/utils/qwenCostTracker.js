/**
 * qwenCostTracker.js
 * OpenRouter Qwen 모델별 토큰 사용량 및 비용 추적
 * agent_logs 테이블에 기록 + 월 예산 초과 알림
 */

import { query } from '../config/database.js';
import { config } from '../config/env.js';

// ── 모델별 요금표 (단위: $/1K tokens) ─────────────────────────────
const PRICING = {
  'qwen/qwen-2.5-7b-instruct:free':   { in: 0,         out: 0         },
  'qwen/qwen-2.5-72b-instruct':        { in: 0.000130,  out: 0.000390  },
  'qwen/qwen3-235b-a22b:free':         { in: 0,         out: 0         },
  'qwen/qwen-2.5-coder-32b-instruct':  { in: 0.000070,  out: 0.000210  },
};

/**
 * 토큰 수와 모델로 비용(USD) 계산
 * @param {string} model
 * @param {number} promptTokens
 * @param {number} completionTokens
 * @returns {number} cost in USD
 */
export function calcCost(model, promptTokens = 0, completionTokens = 0) {
  const pricing = PRICING[model] ?? { in: 0, out: 0 };
  return (promptTokens / 1000) * pricing.in + (completionTokens / 1000) * pricing.out;
}

/**
 * agent_logs 테이블에 실행 기록 저장
 * DB 오류는 로그만 출력하고 상위로 전파하지 않음 (비용 추적 실패가 Agent 실행을 막지 않도록)
 *
 * @param {object} data
 * @param {string} [data.agentName]        - 'news' | 'insights' | 'market' | 'events' | 'unknown'
 * @param {string} data.taskType           - 'translate_ko' | 'commentary' | ...
 * @param {string} data.model              - 실제 사용 모델 ID
 * @param {'success'|'failed'|'partial'} data.status
 * @param {number} [data.promptTokens]
 * @param {number} [data.completionTokens]
 * @param {number} [data.tokensUsed]       - 합계 (promptTokens + completionTokens)
 * @param {number} [data.itemsProcessed]
 * @param {number} [data.itemsCreated]
 * @param {number} [data.durationMs]
 * @param {string} [data.error]
 */
export async function trackUsage(data) {
  const {
    agentName     = 'unknown',
    taskType      = '',
    model         = '',
    status        = 'success',
    promptTokens     = 0,
    completionTokens = 0,
    tokensUsed    = promptTokens + completionTokens,
    itemsProcessed = 0,
    itemsCreated   = 0,
    durationMs     = 0,
    error          = null,
  } = data;

  const costUsd = calcCost(model, promptTokens, completionTokens);

  try {
    await query(
      `INSERT INTO agent_logs
         (agent_name, task_type, model, status,
          items_processed, items_created,
          tokens_used, cost_usd, error_message, duration_ms)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [agentName, taskType, model, status,
       itemsProcessed, itemsCreated,
       tokensUsed, costUsd.toFixed(6), error, durationMs],
    );
  } catch (dbErr) {
    console.error('[CostTracker] Failed to write agent_log:', dbErr.message);
  }

  // 월 예산 초과 여부 확인 (비동기, 알림만)
  checkBudgetAlert().catch(() => {});

  return costUsd;
}

/**
 * 이번 달 집계 조회
 * @returns {Promise<{ totalCostUsd: number, byModel: object, byAgent: object, totalTokens: number }>}
 */
export async function getMonthlyStats() {
  const { rows } = await query(`
    SELECT
      COALESCE(SUM(cost_usd), 0)::float          AS total_cost_usd,
      COALESCE(SUM(tokens_used), 0)::int          AS total_tokens,
      json_object_agg(model, model_cost)          AS by_model,
      json_object_agg(agent_name, agent_cost)     AS by_agent
    FROM (
      SELECT
        model,
        agent_name,
        SUM(cost_usd)::float    AS model_cost,
        SUM(cost_usd)::float    AS agent_cost,
        SUM(tokens_used)::int   AS tokens_used
      FROM agent_logs
      WHERE executed_at >= date_trunc('month', NOW())
      GROUP BY model, agent_name
    ) t
  `);

  return rows[0] ?? { totalCostUsd: 0, byModel: {}, byAgent: {}, totalTokens: 0 };
}

/**
 * 오늘 집계 조회
 * @returns {Promise<{ totalCostUsd: number, freeRequests: number, proRequests: number }>}
 */
export async function getDailyStats() {
  const { rows } = await query(`
    SELECT
      COALESCE(SUM(cost_usd), 0)::float  AS total_cost_usd,
      COUNT(*)::int                       AS total_requests,
      SUM(CASE WHEN cost_usd = 0 THEN 1 ELSE 0 END)::int AS free_requests,
      SUM(CASE WHEN cost_usd > 0 THEN 1 ELSE 0 END)::int AS pro_requests,
      COALESCE(SUM(tokens_used), 0)::int  AS total_tokens
    FROM agent_logs
    WHERE executed_at >= date_trunc('day', NOW())
      AND status = 'success'
  `);

  return rows[0] ?? { totalCostUsd: 0, totalRequests: 0, freeRequests: 0, proRequests: 0, totalTokens: 0 };
}

/**
 * 이번 달 누적 비용이 예산을 초과하면 콘솔 경고 (이메일 알림은 Phase 2)
 */
async function checkBudgetAlert() {
  const { rows } = await query(`
    SELECT COALESCE(SUM(cost_usd), 0)::float AS total
    FROM agent_logs
    WHERE executed_at >= date_trunc('month', NOW())
  `);

  const total = rows[0]?.total ?? 0;
  const budget = config.MONTHLY_BUDGET_USD;

  if (total >= budget) {
    console.warn(
      `[CostTracker] ⚠️  Monthly budget exceeded! $${total.toFixed(4)} / $${budget} (${config.COST_ALERT_EMAIL})`,
    );
  } else if (total >= budget * 0.8) {
    console.warn(
      `[CostTracker] ⚠️  Monthly budget 80% used: $${total.toFixed(4)} / $${budget}`,
    );
  }
}
