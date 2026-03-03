-- Migration 002: articles slug 컬럼 추가
-- 적용: psql -U sfn_user -d smartfarmnews -f src/db/migrations/002_add_slug.sql
-- 목적: slug 기반 URL 지원 및 단건 조회 엔드포인트 활성화
--
-- NOTE: schema.sql(v4.0)에 이미 slug VARCHAR(600) UNIQUE가 포함되어 있다.
--       이 마이그레이션은 schema.sql 적용 이전에 생성된 기존 DB를 위한 것이다.
--       IF NOT EXISTS로 멱등하게 적용 가능.

BEGIN;

-- ── 1. slug 컬럼 추가 ──────────────────────────────────────────────
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS slug VARCHAR(600);

-- ── 2. UNIQUE 제약조건 (없으면 추가) ──────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conrelid = 'articles'::regclass
      AND  conname  = 'articles_slug_key'
  ) THEN
    ALTER TABLE articles ADD CONSTRAINT articles_slug_key UNIQUE (slug);
  END IF;
END$$;

-- ── 3. 인덱스 (slug 기반 단건 조회 최적화) ───────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)
  WHERE slug IS NOT NULL;

COMMIT;
