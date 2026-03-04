-- Migration 007: articles 테이블에 image_url 컬럼 추가
-- 적용: psql -U sfn_user -d smartfarmnews -h localhost -f src/db/migrations/007_add_image_url.sql

BEGIN;

ALTER TABLE articles ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

COMMIT;
