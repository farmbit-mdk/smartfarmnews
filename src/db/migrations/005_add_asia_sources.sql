-- Migration 005: news_sources 컬럼 추가 + 아시아 소스 7개 추가
-- 적용: psql -U sfn_user -d smartfarmnews -h localhost -f src/db/migrations/005_add_asia_sources.sql

BEGIN;

-- ── 1. news_sources 컬럼 추가 ─────────────────────────────────────
ALTER TABLE news_sources
  ADD COLUMN IF NOT EXISTS region    VARCHAR(50),
  ADD COLUMN IF NOT EXISTS menu_type VARCHAR(20) DEFAULT 'news';

-- ── 2. name UNIQUE 제약 (ON CONFLICT 사용 위해 필요) ──────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'news_sources'::regclass AND conname = 'news_sources_name_key'
  ) THEN
    ALTER TABLE news_sources ADD CONSTRAINT news_sources_name_key UNIQUE (name);
  END IF;
END$$;

-- ── 3. 아시아 신규 소스 삽입 ──────────────────────────────────────
-- NOTE: 스키마 컬럼명 language (사용자 요청의 lang 매핑)
INSERT INTO news_sources (name, url, rss_url, region, language, menu_type, is_active) VALUES
  ('FoodNavigator Asia', 'https://www.foodnavigator-asia.com', 'https://www.foodnavigator-asia.com/rss/news', 'sea',   'en', 'news', true),
  ('DealStreetAsia',     'https://dealstreetasia.com',         'https://dealstreetasia.com/feed',              'sea',   'en', 'news', true),
  ('VietnamPlus',        'https://en.vietnamplus.vn',          'https://en.vietnamplus.vn/rss/news.rss',       'sea',   'en', 'news', true),
  ('Antara News',        'https://en.antaranews.com',          'https://en.antaranews.com/rss/news.xml',       'sea',   'en', 'news', true),
  ('Nation Thailand',    'https://www.nationthailand.com',     'https://www.nationthailand.com/rss',           'sea',   'en', 'news', true),
  ('농업경제신문',        'https://www.agrienews.com',          NULL,                                           'korea', 'ko', 'news', false),
  ('한국농어민신문',      'https://www.agrinet.co.kr',          NULL,                                           'korea', 'ko', 'news', false)
ON CONFLICT (name) DO NOTHING;

COMMIT;
