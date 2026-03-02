-- Migration 001: v4.0 Schema Update
-- 적용: psql -U sfn_user -d smartfarmnews -f src/db/migrations/001_v4_schema_update.sql
-- 목적: 동남아 다국어 지원, 지역 필터, K-AgTech 태그, 언어별 조회수 추가

BEGIN;

-- ──────────────────────────────────────────────────────────────
-- 1. articles 테이블 컬럼 추가
-- ──────────────────────────────────────────────────────────────
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS summary_ko     TEXT,
  ADD COLUMN IF NOT EXISTS summary_en     TEXT,
  ADD COLUMN IF NOT EXISTS commentary_en  TEXT,
  ADD COLUMN IF NOT EXISTS region         VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_k_agtech    BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS seo_title_en   VARCHAR(160),
  ADD COLUMN IF NOT EXISTS seo_desc_en    VARCHAR(320),
  ADD COLUMN IF NOT EXISTS view_count_ko  INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS view_count_en  INTEGER DEFAULT 0;

-- region 인덱스 (지역별 필터링)
CREATE INDEX IF NOT EXISTS idx_articles_region     ON articles(region);
CREATE INDEX IF NOT EXISTS idx_articles_is_k_agtech ON articles(is_k_agtech) WHERE is_k_agtech = true;

-- ──────────────────────────────────────────────────────────────
-- 2. events 테이블 컬럼 추가
-- ──────────────────────────────────────────────────────────────
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS region VARCHAR(100);

-- region 인덱스 (지역별 필터링)
CREATE INDEX IF NOT EXISTS idx_events_region ON events(region);

-- ──────────────────────────────────────────────────────────────
-- 3. news_sources 동남아 소스 5개 추가
-- ──────────────────────────────────────────────────────────────
INSERT INTO news_sources (name, url, rss_url, category, language) VALUES
  ('e27',                'https://e27.co',               NULL, 'sea',      'en'),
  ('TechCollective SEA', 'https://techcollectivesea.com', NULL, 'sea',      'en'),
  ('GrowAsia',           'https://growasia.org',          NULL, 'sea',      'en'),
  ('Agro Spectrum Asia', 'https://agrospectrumasia.com',  NULL, 'sea',      'en'),
  ('농식품부',            'https://www.mafra.go.kr',       NULL, 'domestic', 'ko')
ON CONFLICT DO NOTHING;

COMMIT;
