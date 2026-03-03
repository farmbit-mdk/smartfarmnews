-- Migration 006: 한국 농업 뉴스 소스 5개 추가 (RSS 활성)
-- 배경: 005에서 SEA 5개 + 한국 2개(비활성) 추가됨.
--       이번 마이그레이션은 RSS 지원 한국 소스를 추가한다.
-- 적용: psql -U sfn_user -d smartfarmnews -h localhost -f src/db/migrations/006_add_korea_sources.sql
--
-- NOTE: FoodNavigator Asia ~ Nation Thailand(SEA 5개)는 ON CONFLICT DO NOTHING으로 무시.

BEGIN;

INSERT INTO news_sources (name, url, rss_url, region, language, menu_type, is_active) VALUES
  ('FoodNavigator Asia', 'https://www.foodnavigator-asia.com', 'https://www.foodnavigator-asia.com/rss/news',     'sea',   'en', 'news', true),
  ('DealStreetAsia',     'https://dealstreetasia.com',         'https://dealstreetasia.com/feed',                'sea',   'en', 'news', true),
  ('VietnamPlus',        'https://en.vietnamplus.vn',          'https://en.vietnamplus.vn/rss/news.rss',         'sea',   'en', 'news', true),
  ('Antara News',        'https://en.antaranews.com',          'https://en.antaranews.com/rss/news.xml',         'sea',   'en', 'news', true),
  ('Nation Thailand',    'https://www.nationthailand.com',     'https://www.nationthailand.com/rss',             'sea',   'en', 'news', true),
  ('한국농촌경제신문',   'https://www.kenews.co.kr',           'https://www.kenews.co.kr/rss/allArticle.xml',    'korea', 'ko', 'news', true),
  ('한국농업신문',       'https://www.newsfarm.co.kr',         'https://www.newsfarm.co.kr/rss/allArticle.xml',  'korea', 'ko', 'news', true),
  ('농수축산신문',       'https://www.aflnews.co.kr',          'https://www.aflnews.co.kr/rss/allArticle.xml',   'korea', 'ko', 'news', true),
  ('한국농정',           'https://www.ikpnews.net',            'https://www.ikpnews.net/rss/allArticle.xml',     'korea', 'ko', 'news', true),
  ('농업인신문',         'https://www.nongupin.co.kr',         'https://www.nongupin.co.kr/rss/allArticle.xml',  'korea', 'ko', 'news', true)
ON CONFLICT (name) DO NOTHING;

COMMIT;
