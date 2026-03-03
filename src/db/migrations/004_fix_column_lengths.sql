-- Migration 004: VARCHAR 컬럼을 TEXT로 변환 (길이 제한 제거)
-- 적용: psql -U sfn_user -d smartfarmnews -h localhost -f src/db/migrations/004_fix_column_lengths.sql

BEGIN;

ALTER TABLE articles ALTER COLUMN title_ko    TYPE TEXT;
ALTER TABLE articles ALTER COLUMN title_en    TYPE TEXT;
ALTER TABLE articles ALTER COLUMN source_name TYPE TEXT;

COMMIT;
