/**
 * imageGenerator.js
 * AI 기사 이미지 자동 생성
 *
 * 파이프라인:
 *   1. Gemini Flash → 기사 태그/제목 기반 이미지 프롬프트 생성
 *   2. FLUX.2 Pro (OpenRouter) → 이미지 생성 → base64
 *   3. 로컬 파일 저장: /var/www/smartfarmnews/public/images/{slug}.jpg
 *
 * 반환: '/images/{slug}.jpg' (성공) | null (실패)
 */

import fs   from 'fs/promises';
import path from 'path';
import { config }    from '../config/env.js';
import { callQwen }  from './qwenClient.js';

const IMAGE_DIR  = '/var/www/smartfarmnews/public/images';
const FLUX_MODEL = 'black-forest-labs/flux.2-pro';

// ── 프롬프트 생성 시스템 메시지 ───────────────────────────────────────
const IMAGE_PROMPT_SYSTEM = `You are an AI image prompt engineer specializing in agricultural photography.
Given an article title and tags, generate a concise, vivid image prompt for photorealistic AI image generation.
Output ONLY the prompt text. No explanation, no labels. Under 80 words.
Focus on: smart farm technology, precision agriculture, Asian farming context, professional photography.`;

// ── Gemini로 이미지 프롬프트 생성 ─────────────────────────────────────
async function buildImagePrompt(tags, titleEn) {
  const tagStr  = (tags ?? []).filter(Boolean).slice(0, 3).join(', ') || 'agriculture technology';
  const title   = titleEn || 'Smart farm technology';

  const userContent = `Article title: ${title}\nTags: ${tagStr}`;
  const coreConcept = await callQwen('image_prompt', IMAGE_PROMPT_SYSTEM, userContent, {
    agentName: 'image_gen',
  });

  return (
    `Professional agricultural photography, ${coreConcept.trim()}, ` +
    `smart farm, high-tech greenhouse, Asia, cinematic lighting, photorealistic, 16:9 aspect ratio`
  );
}

// ── OpenRouter FLUX.2 Pro 이미지 생성 → base64 추출 ─────────────────
async function callFlux(prompt) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
      'Content-Type':  'application/json',
      'HTTP-Referer':  'https://smartfarmnews.com',
      'X-Title':       'SmartFarmNews',
    },
    body: JSON.stringify({
      model:      FLUX_MODEL,
      messages:   [{ role: 'user', content: prompt }],
      modalities: ['image'],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`FLUX API error ${res.status}: ${err.substring(0, 200)}`);
  }

  const json   = await res.json();
  const images = json.choices?.[0]?.message?.images;

  // images 배열에서 첫 번째 base64 추출 (data:image/png;base64,... 형식)
  if (Array.isArray(images) && images.length > 0) {
    const dataUrl = images[0];
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
      return dataUrl.split(',')[1]; // base64 부분만 반환
    }
  }

  throw new Error('No image data found in FLUX response');
}

async function fetchImageAsBase64(url) {
  const res    = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

// ── 공개 API ─────────────────────────────────────────────────────────

/**
 * 기사 이미지 생성 후 로컬 저장
 *
 * @param {string}   slug    - articles.slug
 * @param {string[]} tags    - 기사 태그 배열
 * @param {string}   titleEn - 영문 제목 (프롬프트 품질 향상)
 * @returns {Promise<string|null>} '/images/{slug}.jpg' | null
 */
export async function generateArticleImage(slug, tags, titleEn) {
  try {
    await fs.mkdir(IMAGE_DIR, { recursive: true });

    const imagePrompt = await buildImagePrompt(tags, titleEn);
    console.log(`[ImageGen] Prompt: ${imagePrompt.substring(0, 80)}...`);

    const base64   = await callFlux(imagePrompt);
    const filePath = path.join(IMAGE_DIR, `${slug}.jpg`);

    await fs.writeFile(filePath, Buffer.from(base64, 'base64'));
    console.log(`[ImageGen] ✓ Saved: ${slug}.jpg`);

    return `/images/${slug}.jpg`;
  } catch (err) {
    console.error(`[ImageGen] Failed for "${slug}":`, err.message);
    return null;
  }
}
