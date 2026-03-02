-- SmartFarmNews.com Database Schema
-- PostgreSQL
-- 적용: psql -U sfn_user -d smartfarmnews -f src/db/schema.sql

-- ──────────────────────────────────────────────────────────────
-- 1. news_sources — RSS 피드 소스 관리
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_sources (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  url             VARCHAR(1000) NOT NULL,
  rss_url         VARCHAR(1000),
  category        VARCHAR(50),          -- agtech | foodtech | domestic | investment
  language        VARCHAR(10)  DEFAULT 'en',
  is_active       BOOLEAN      DEFAULT true,
  last_crawled_at TIMESTAMP,
  created_at      TIMESTAMP    DEFAULT NOW()
);

INSERT INTO news_sources (name, url, rss_url, category, language) VALUES
  ('HortiDaily',          'https://www.hortidaily.com',          NULL, 'agtech',      'en'),
  ('AgFunderNews',         'https://agfundernews.com',            NULL, 'investment',  'en'),
  ('FreshPlaza',           'https://www.freshplaza.com',          NULL, 'agtech',      'en'),
  ('AgTechNavigator',      'https://agtechnavigator.com',         NULL, 'agtech',      'en'),
  ('FoodNavigator',        'https://www.foodnavigator.com',       NULL, 'foodtech',    'en'),
  ('The Spoon',            'https://thespoon.tech',               NULL, 'foodtech',    'en'),
  ('DigitalFoodLab',       'https://digitalfoodlab.com',          NULL, 'foodtech',    'en'),
  ('농민신문',              'https://www.nongmin.com',             NULL, 'domestic',    'ko'),
  ('농사로(농촌진흥청)',    'https://www.nongsaro.go.kr',          NULL, 'domestic',    'ko'),
  -- v4.0 동남아 소스
  ('e27',                  'https://e27.co',                      NULL, 'sea',         'en'),
  ('TechCollective SEA',   'https://techcollectivesea.com',       NULL, 'sea',         'en'),
  ('GrowAsia',             'https://growasia.org',                NULL, 'sea',         'en'),
  ('Agro Spectrum Asia',   'https://agrospectrumasia.com',        NULL, 'sea',         'en'),
  ('농식품부',              'https://www.mafra.go.kr',             NULL, 'domestic',    'ko')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- 2. articles — 기사 (News + Insights 통합)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id              SERIAL PRIMARY KEY,
  source_id       INTEGER      REFERENCES news_sources(id) ON DELETE SET NULL,
  slug            VARCHAR(600) UNIQUE,
  title_ko        VARCHAR(500),
  title_en        VARCHAR(500),
  content_ko      TEXT,
  content_en      TEXT,
  summary         TEXT,                 -- AI 3줄 요약 KO (• 줄1\n• 줄2\n• 줄3) — 하위 호환 유지
  summary_ko      TEXT,                 -- v4.0 KO 명시 요약
  summary_en      TEXT,                 -- v4.0 EN 요약
  commentary      TEXT,                 -- 에디터 논평 KO (1~2문장)
  commentary_en   TEXT,                 -- v4.0 EN 논평
  original_url    VARCHAR(1000) UNIQUE,
  source_name     VARCHAR(100),
  menu_type       VARCHAR(20)  NOT NULL CHECK (menu_type IN ('news', 'insights')),
  tags            TEXT[]       DEFAULT '{}',
  region          VARCHAR(50),          -- v4.0 global | sea | vietnam | indonesia | thailand
  is_k_agtech     BOOLEAN      DEFAULT false,  -- v4.0 K-AgTech 태그
  seo_title       VARCHAR(100),         -- KO SEO 제목
  seo_description VARCHAR(200),         -- KO SEO 설명
  seo_title_en    VARCHAR(160),         -- v4.0 EN SEO 제목
  seo_desc_en     VARCHAR(320),         -- v4.0 EN SEO 설명
  status          VARCHAR(20)  DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at    TIMESTAMP,
  view_count      INTEGER      DEFAULT 0,
  view_count_ko   INTEGER      DEFAULT 0,  -- v4.0 KO 독자 조회수
  view_count_en   INTEGER      DEFAULT 0,  -- v4.0 EN 독자 조회수
  created_at      TIMESTAMP    DEFAULT NOW(),
  updated_at      TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_status      ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_menu_type   ON articles(menu_type);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags        ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_articles_source_id   ON articles(source_id);

-- ──────────────────────────────────────────────────────────────
-- 3. equipment — 중고농기계 매물
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS equipment (
  id              SERIAL PRIMARY KEY,
  title_ko        VARCHAR(300),
  title_en        VARCHAR(300),
  title_zh        VARCHAR(300),
  title_vi        VARCHAR(300),
  category        VARCHAR(100),         -- tractor | combine | transplanter | drone | smartfarm | other
  brand           VARCHAR(100),
  model           VARCHAR(100),
  year            INTEGER,
  condition       VARCHAR(50),          -- excellent | good | fair | poor
  price_krw       BIGINT,
  price_usd       DECIMAL(12, 2),
  location        VARCHAR(200),
  description_ko  TEXT,
  description_en  TEXT,
  description_zh  TEXT,
  description_vi  TEXT,
  images          TEXT[]       DEFAULT '{}',
  source          VARCHAR(50)  NOT NULL CHECK (source IN ('onbid', 'private', 'direct')),
  source_url      VARCHAR(1000),
  source_id       VARCHAR(200),         -- 온비드 공매번호 등 외부 ID
  status          VARCHAR(20)  DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired')),
  is_auction      BOOLEAN      DEFAULT false,
  auction_end_at  TIMESTAMP,
  created_at      TIMESTAMP    DEFAULT NOW(),
  updated_at      TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_status     ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_category   ON equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_source     ON equipment(source);
CREATE INDEX IF NOT EXISTS idx_equipment_is_auction ON equipment(is_auction);
CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_source_id ON equipment(source, source_id)
  WHERE source_id IS NOT NULL;

-- ──────────────────────────────────────────────────────────────
-- 4. equipment_inquiries — 매물 문의
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS equipment_inquiries (
  id           SERIAL PRIMARY KEY,
  equipment_id INTEGER     NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  name         VARCHAR(100),
  email        VARCHAR(200) NOT NULL,
  phone        VARCHAR(50),
  country      VARCHAR(100),
  message      TEXT,
  status       VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  created_at   TIMESTAMP   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_equipment_id ON equipment_inquiries(equipment_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status       ON equipment_inquiries(status);

-- ──────────────────────────────────────────────────────────────
-- 5. equipment_price_stats — 기종별 낙찰가 통계
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS equipment_price_stats (
  id              SERIAL PRIMARY KEY,
  category        VARCHAR(100) NOT NULL,
  brand           VARCHAR(100),
  model           VARCHAR(100),
  avg_price_krw   BIGINT,
  min_price_krw   BIGINT,
  max_price_krw   BIGINT,
  sample_count    INTEGER      DEFAULT 0,
  updated_at      TIMESTAMP    DEFAULT NOW(),
  UNIQUE (category, brand, model)
);

-- ──────────────────────────────────────────────────────────────
-- 6. auction_data — 온비드 공매 데이터
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auction_data (
  id            SERIAL PRIMARY KEY,
  equipment_id  INTEGER      REFERENCES equipment(id) ON DELETE SET NULL,
  auction_id    VARCHAR(200) UNIQUE NOT NULL,  -- 온비드 공매번호
  title         VARCHAR(500),
  start_price   BIGINT,
  current_price BIGINT,
  bid_count     INTEGER      DEFAULT 0,
  start_at      TIMESTAMP,
  end_at        TIMESTAMP,
  status        VARCHAR(20)  DEFAULT 'active' CHECK (status IN ('active', 'closed', 'cancelled')),
  result_price  BIGINT,
  source_url    VARCHAR(1000),
  raw_data      JSONB,
  created_at    TIMESTAMP    DEFAULT NOW(),
  updated_at    TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auction_status    ON auction_data(status);
CREATE INDEX IF NOT EXISTS idx_auction_end_at    ON auction_data(end_at);
CREATE INDEX IF NOT EXISTS idx_auction_equip_id  ON auction_data(equipment_id);

-- ──────────────────────────────────────────────────────────────
-- 7. auction_alerts — 공매 알림 구독
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auction_alerts (
  id             SERIAL PRIMARY KEY,
  email          VARCHAR(200) NOT NULL,
  category       VARCHAR(100),
  brand          VARCHAR(100),
  max_price_krw  BIGINT,
  is_active      BOOLEAN   DEFAULT true,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_email    ON auction_alerts(email);
CREATE INDEX IF NOT EXISTS idx_alerts_active   ON auction_alerts(is_active);

-- ──────────────────────────────────────────────────────────────
-- 8. events — 박람회 · 컨퍼런스
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(400) UNIQUE,
  title_ko        VARCHAR(300),
  title_en        VARCHAR(300),
  description_ko  TEXT,
  description_en  TEXT,
  location        VARCHAR(300),
  country         VARCHAR(100),
  type            VARCHAR(20)  DEFAULT 'global' CHECK (type IN ('global', 'korea')),
  region          VARCHAR(100),         -- v4.0 sea | europe | usa | korea
  start_date      DATE,
  end_date        DATE,
  website         VARCHAR(500),
  status          VARCHAR(20)  DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'past')),
  created_at      TIMESTAMP    DEFAULT NOW(),
  updated_at      TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_type       ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status     ON events(status);

-- ──────────────────────────────────────────────────────────────
-- 9. subscribers — 뉴스레터 구독자
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id               SERIAL PRIMARY KEY,
  email            VARCHAR(200) UNIQUE NOT NULL,
  name             VARCHAR(100),
  language         VARCHAR(10)  DEFAULT 'ko',
  is_active        BOOLEAN      DEFAULT true,
  subscribed_at    TIMESTAMP    DEFAULT NOW(),
  unsubscribed_at  TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(is_active);

-- ──────────────────────────────────────────────────────────────
-- 10. agent_logs — AI Agent 실행 로그 (비용 추적)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_logs (
  id               SERIAL PRIMARY KEY,
  agent_name       VARCHAR(50) NOT NULL,  -- news | insights | market | events
  task_type        VARCHAR(50),           -- translate_ko | commentary | translate_zh | seo_meta | ...
  model            VARCHAR(100),          -- 실제 사용 모델 ID
  status           VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
  items_processed  INTEGER     DEFAULT 0,
  items_created    INTEGER     DEFAULT 0,
  tokens_used      INTEGER     DEFAULT 0, -- input + output 합계
  cost_usd         DECIMAL(8, 6),         -- 소수점 6자리 (소액 정밀 추적)
  error_message    TEXT,
  duration_ms      INTEGER,
  executed_at      TIMESTAMP   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_name  ON agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_logs_executed_at ON agent_logs(executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_status      ON agent_logs(status);
CREATE INDEX IF NOT EXISTS idx_agent_logs_task_type   ON agent_logs(task_type);

-- ──────────────────────────────────────────────────────────────
-- updated_at 자동 갱신 트리거
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_auction_data_updated_at
  BEFORE UPDATE ON auction_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
