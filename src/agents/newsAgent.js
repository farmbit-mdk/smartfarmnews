/**
 * newsAgent.js
 * 뉴스 수집 → AI 처리 → articles 저장
 *
 * 파이프라인:
 *   1. news_sources 테이블에서 활성 소스 조회
 *   2. RSS 파싱 (9개 소스)
 *   3. URL 중복 체크 (articles.original_url)
 *   4. 본문 크롤링 (RSS 내용 부족 시 Playwright, 단일 브라우저 재사용)
 *   5. Qwen AI: EN→KO 번역 → 3줄 요약 → 태그 분류 → 에디터 논평
 *   6. articles 테이블 INSERT (status='draft')
 *   7. last_crawled_at 갱신
 *
 * 실행 주기: 매 2시간 (orchestrator에서 스케줄링)
 * 목표: 일 30~50건 초안 생성
 */

import RssParser from 'rss-parser';
import { chromium } from 'playwright';

import { callQwen, processSequentially } from '../utils/qwenClient.js';
import { PROMPTS } from '../utils/qwenPrompts.js';
import { query } from '../config/database.js';

// ── 상수 ────────────────────────────────────────────────────────────

const AGENT_NAME = 'news';

/** RSS content 가 이 길이 미만이면 Playwright 크롤링 */
const MIN_CONTENT_LENGTH = 200;

/** 크롤링 재시도 횟수 */
const CRAWL_RETRIES = 2;

/** 본문 추출 우선순위 CSS 선택자 */
const CONTENT_SELECTORS = [
  'article',
  '[class*="article-body"]',
  '[class*="post-content"]',
  '[class*="entry-content"]',
  '[class*="article-content"]',
  '.content',
  'main',
];

// ── RSS 파서 ─────────────────────────────────────────────────────────

const rssParser = new RssParser({
  timeout: 12_000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SmartFarmNewsBot/1.0; +https://smartfarmnews.com)',
  },
  customFields: {
    item: ['content:encoded', 'description'],
  },
});

// ── 메인 진입점 ──────────────────────────────────────────────────────

/**
 * News Agent 실행
 * @returns {Promise<RunResult>}
 *
 * @typedef {object} RunResult
 * @property {number} sourcesProcessed
 * @property {number} articlesCreated
 * @property {number} articlesFailed
 * @property {number} durationMs
 */
export async function runNewsAgent() {
  const startedAt = Date.now();
  console.log(`[NewsAgent] ▶ Run started at ${new Date().toISOString()}`);

  let sourcesProcessed = 0;
  let articlesCreated  = 0;
  let articlesFailed   = 0;

  // 브라우저 단일 인스턴스 (크롤링 필요한 모든 기사에서 재사용)
  let browser = null;

  try {
    const sources = await getActiveSources();
    console.log(`[NewsAgent] Sources: ${sources.length}`);

    // 브라우저 미리 실행
    browser = await chromium.launch({ headless: true });

    for (const source of sources) {
      try {
        const result = await processSource(source, browser);
        sourcesProcessed++;
        articlesCreated += result.created;
        articlesFailed  += result.failed;
      } catch (err) {
        console.error(`[NewsAgent] Source "${source.name}" failed:`, err.message);
        articlesFailed++;
      }
    }
  } finally {
    await browser?.close();
  }

  const durationMs = Date.now() - startedAt;

  console.log(
    `[NewsAgent] ■ Done — sources: ${sourcesProcessed}, ` +
    `created: ${articlesCreated}, failed: ${articlesFailed}, ` +
    `${durationMs}ms`,
  );

  return { sourcesProcessed, articlesCreated, articlesFailed, durationMs };
}

// ── 소스 단위 처리 ───────────────────────────────────────────────────

/**
 * @param {object} source - news_sources 레코드
 * @param {import('playwright').Browser} browser
 * @returns {Promise<{created: number, failed: number}>}
 */
async function processSource(source, browser) {
  // 1. RSS 파싱
  const rawItems = await fetchRssItems(source);
  if (!rawItems.length) return { created: 0, failed: 0 };

  // 2. 신규 기사만 추려내기
  const newItems = await filterNewArticles(rawItems);
  console.log(`[NewsAgent] ${source.name}: ${newItems.length}/${rawItems.length} new`);
  if (!newItems.length) return { created: 0, failed: 0 };

  // 3. 본문 크롤링 (내용 부족한 항목만)
  const itemsWithContent = await enrichWithContent(newItems, browser);

  // 4. AI 처리 + 저장 (순차, Rate limit 준수)
  const results = await processSequentially(
    itemsWithContent,
    (item) => processArticle(item, source),
  );

  // 5. 소스 마지막 크롤 시각 갱신
  await query('UPDATE news_sources SET last_crawled_at = NOW() WHERE id = $1', [source.id]);

  const created = results.filter((r) => r.success).length;
  const failed  = results.filter((r) => !r.success).length;

  return { created, failed };
}

// ── RSS 파싱 ─────────────────────────────────────────────────────────

/**
 * RSS 피드에서 기사 목록 파싱
 * @param {object} source
 * @returns {Promise<RawItem[]>}
 *
 * @typedef {object} RawItem
 * @property {string}   title
 * @property {string}   url
 * @property {string}   content      - RSS에서 가져온 원문 (불충분할 수 있음)
 * @property {boolean}  needsCrawl   - Playwright 크롤링 필요 여부
 * @property {Date}     publishedAt
 * @property {string}   sourceName
 * @property {number}   sourceId
 * @property {string}   language
 */
async function fetchRssItems(source) {
  const feedUrl = source.rss_url || source.url;

  try {
    const feed = await rssParser.parseURL(feedUrl);

    return feed.items
      .filter((item) => item.link)
      .map((item) => {
        const content = (
          item['content:encoded'] ||
          item.contentSnippet     ||
          item.content            ||
          item.summary            ||
          ''
        ).trim();

        return {
          title:       item.title?.trim() || '',
          url:         item.link.trim(),
          content,
          needsCrawl:  content.length < MIN_CONTENT_LENGTH,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          sourceName:  source.name,
          sourceId:    source.id,
          language:    source.language || 'en',
        };
      });
  } catch (err) {
    console.error(`[NewsAgent] RSS parse failed "${source.name}":`, err.message);
    return [];
  }
}

// ── 중복 필터 ─────────────────────────────────────────────────────────

/**
 * articles 테이블에 이미 있는 URL 제거
 * @param {RawItem[]} items
 * @returns {Promise<RawItem[]>}
 */
async function filterNewArticles(items) {
  if (!items.length) return [];

  const urls = items.map((i) => i.url);
  const { rows } = await query(
    'SELECT original_url FROM articles WHERE original_url = ANY($1)',
    [urls],
  );

  const existing = new Set(rows.map((r) => r.original_url));
  return items.filter((item) => !existing.has(item.url));
}

// ── Playwright 크롤링 ─────────────────────────────────────────────────

/**
 * 내용 부족 항목의 본문을 크롤링으로 보완
 * 브라우저를 재사용해 오버헤드 최소화
 *
 * @param {RawItem[]} items
 * @param {import('playwright').Browser} browser
 * @returns {Promise<RawItem[]>}
 */
async function enrichWithContent(items, browser) {
  const needsCrawl = items.filter((i) => i.needsCrawl);

  if (!needsCrawl.length) return items;

  console.log(`[NewsAgent] Crawling ${needsCrawl.length} articles...`);

  // 크롤링 대상만 병렬 (최대 3 페이지 동시)
  const CONCURRENCY = 3;
  for (let i = 0; i < needsCrawl.length; i += CONCURRENCY) {
    const batch = needsCrawl.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (item) => {
        const crawled = await crawlWithRetry(item.url, browser, CRAWL_RETRIES);
        if (crawled.length >= MIN_CONTENT_LENGTH) {
          item.content    = crawled;
          item.needsCrawl = false;
        }
      }),
    );
  }

  // 크롤 후에도 내용 없는 항목 제거
  return items.filter((i) => i.content.length >= 50);
}

/**
 * Playwright 크롤링 (재시도 포함)
 * @param {string}   url
 * @param {import('playwright').Browser} browser
 * @param {number}   retries
 * @returns {Promise<string>}
 */
async function crawlWithRetry(url, browser, retries) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await crawlArticleContent(url, browser);
    } catch (err) {
      console.warn(`[NewsAgent] Crawl attempt ${attempt}/${retries} failed for ${url}: ${err.message}`);
      if (attempt === retries) return '';
    }
  }
  return '';
}

/**
 * 기사 본문 크롤링
 * @param {string}   url
 * @param {import('playwright').Browser} browser
 * @returns {Promise<string>}
 */
async function crawlArticleContent(url, browser) {
  const page = await browser.newPage();

  try {
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (compatible; SmartFarmNewsBot/1.0; +https://smartfarmnews.com)',
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 });

    const content = await page.evaluate((selectors) => {
      // 광고·사이드바·네비 제거
      for (const sel of ['nav', 'header', 'footer', '.ad', '[class*="sidebar"]', '[class*="related"]']) {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      }

      // 선택자 우선순위대로 본문 탐색
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.innerText.trim().length > 150) {
          return el.innerText.trim();
        }
      }

      // 마지막 수단: 충분히 긴 p 태그 합산
      return Array.from(document.querySelectorAll('p'))
        .map((p) => p.innerText.trim())
        .filter((t) => t.length > 40)
        .join('\n\n');
    }, CONTENT_SELECTORS);

    return content || '';
  } finally {
    await page.close();
  }
}

// ── AI 처리 + 저장 ────────────────────────────────────────────────────

/**
 * 단일 기사 AI 처리 → DB 저장
 * @param {RawItem} item
 * @param {object}  source
 */
async function processArticle(item, source) {
  const isKorean = source.language === 'ko';
  const opts     = { agentName: AGENT_NAME };

  // EN→KO 번역 (영문 소스만)
  const titleKo   = isKorean
    ? item.title
    : await callQwen('translate_ko', PROMPTS.TRANSLATE_KO, truncate(item.title, 400), opts);

  const contentKo = isKorean
    ? item.content
    : await callQwen('translate_ko', PROMPTS.TRANSLATE_KO, truncate(item.content, 2000), opts);

  // 요약·태그·논평 (한국어 기준으로 처리)
  const baseText = contentKo || item.content;

  const summary    = await callQwen('summarize',  PROMPTS.SUMMARIZE_NEWS, truncate(baseText, 1500), opts);
  const tagsRaw    = await callQwen('tag_extract', PROMPTS.CLASSIFY_TAGS,  truncate(item.title + '\n' + baseText, 800), opts);
  const commentary = await callQwen('commentary',  PROMPTS.COMMENTARY,     truncate(baseText, 1000), opts);

  const tags = parseTags(tagsRaw);
  const slug = generateSlug(titleKo || item.title, item.publishedAt);

  await saveArticle({
    sourceId:    source.id,
    sourceName:  source.name,
    slug,
    titleKo:     titleKo   || item.title,
    titleEn:     isKorean ? '' : item.title,
    contentKo,
    contentEn:   isKorean ? '' : truncate(item.content, 5000),
    summary,
    commentary,
    originalUrl: item.url,
    tags,
    publishedAt: item.publishedAt,
  });

  console.log(`[NewsAgent] ✓ ${(titleKo || item.title).substring(0, 50)}`);
}

// ── 유틸 함수 ─────────────────────────────────────────────────────────

/**
 * 텍스트 길이 제한 (토큰 절약)
 * @param {string} text
 * @param {number} maxLen
 */
function truncate(text, maxLen) {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

/**
 * Qwen 태그 응답 파싱
 * "#AgTech, #Startup, #Investment" → ['AgTech', 'Startup', 'Investment']
 * @param {string} raw
 * @returns {string[]}
 */
function parseTags(raw) {
  return (raw || '')
    .split(',')
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean)
    .slice(0, 3);
}

/**
 * URL-safe 슬러그 생성
 * 한국어 포함 시 → news-{날짜}-{랜덤4}
 * 영문 제목     → {소문자-하이픈}-{날짜}
 *
 * @param {string} title
 * @param {Date}   date
 * @returns {string}
 */
function generateSlug(title, date = new Date()) {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand    = Math.random().toString(36).slice(2, 6);

  const base = (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60);

  if (!base || /^[-\s]*$/.test(base)) {
    return `news-${dateStr}-${rand}`;
  }

  return `${base}-${dateStr}`;
}

/**
 * articles 테이블 INSERT
 * ON CONFLICT (original_url) DO NOTHING → 중복 무시
 */
async function saveArticle({
  sourceId, sourceName, slug,
  titleKo, titleEn,
  contentKo, contentEn,
  summary, commentary,
  originalUrl, tags,
  publishedAt,
}) {
  await query(
    `INSERT INTO articles
       (source_id, source_name, slug,
        title_ko, title_en,
        content_ko, content_en,
        summary, commentary,
        original_url, menu_type, tags,
        status, published_at)
     VALUES
       ($1,$2,$3,
        $4,$5,
        $6,$7,
        $8,$9,
        $10,'news',$11,
        'draft',$12)
     ON CONFLICT (original_url) DO NOTHING`,
    [
      sourceId, sourceName, slug,
      titleKo, titleEn,
      contentKo, contentEn,
      summary, commentary,
      originalUrl, tags,
      publishedAt,
    ],
  );
}

/**
 * DB에서 활성 소스 조회
 * @returns {Promise<object[]>}
 */
async function getActiveSources() {
  const { rows } = await query(
    'SELECT * FROM news_sources WHERE is_active = true ORDER BY id',
  );
  return rows;
}
