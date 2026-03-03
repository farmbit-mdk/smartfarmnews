-- Migration 003: RSS URL 실제값 설정 및 크롤링 전용 소스 비활성화
-- 적용: psql -U sfn_user -d smartfarmnews -h localhost -f src/db/migrations/003_fix_rss_urls.sql

BEGIN;

-- ── RSS 지원 소스: 실제 피드 URL 설정 ─────────────────────────────
UPDATE news_sources SET rss_url = 'https://www.hortidaily.com/rss'     WHERE name = 'HortiDaily';
UPDATE news_sources SET rss_url = 'https://agfundernews.com/feed'       WHERE name = 'AgFunderNews';
UPDATE news_sources SET rss_url = 'https://www.freshplaza.com/rss'      WHERE name = 'FreshPlaza';
UPDATE news_sources SET rss_url = 'https://thespoon.tech/feed'          WHERE name = 'The Spoon';
UPDATE news_sources SET rss_url = 'https://www.foodnavigator.com/rss'   WHERE name = 'FoodNavigator';
UPDATE news_sources SET rss_url = 'https://e27.co/feed'                 WHERE name = 'e27';
UPDATE news_sources SET rss_url = 'https://www.nongmin.com/rss'         WHERE name = '농민신문';

-- ── RSS 미지원 소스: 크롤링 대체 예정, 임시 비활성화 ───────────────
UPDATE news_sources SET is_active = false
WHERE name IN (
  'AgTechNavigator',
  'DigitalFoodLab',
  'TechCollective SEA',
  'GrowAsia',
  'Agro Spectrum Asia',
  '농사로(농촌진흥청)',
  '농식품부'
);

COMMIT;
