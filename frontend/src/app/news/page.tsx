'use client';

import { useState, useEffect } from 'react';
import ArticleCard from '@/src/components/ArticleCard';
import { Article } from '@/src/lib/mockData';
import { fetchArticles } from '@/src/lib/api';

type RegionFilter = 'all' | 'korea' | 'sea' | 'global';

const REGION_TABS: { key: RegionFilter; label: string }[] = [
  { key: 'all',    label: '전체'   },
  { key: 'korea',  label: '한국'   },
  { key: 'sea',    label: '동남아' },
  { key: 'global', label: '글로벌' },
];

const SEA_REGIONS = ['sea', 'vietnam', 'indonesia', 'thailand'];

function matchRegion(articleRegion: string | undefined, filter: RegionFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'sea') return SEA_REGIONS.includes(articleRegion ?? '');
  return articleRegion === filter;
}

const PAGE_SIZE = 9;

export default function NewsPage() {
  const [articles, setArticles]         = useState<Article[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');
  const [currentPage, setCurrentPage]   = useState(1);

  useEffect(() => {
    fetchArticles({ menu_type: 'news', limit: 50 }).then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const filtered   = articles.filter((a) => matchRegion(a.region, activeRegion));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged      = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleRegionChange(region: RegionFilter) {
    setActiveRegion(region);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* ── 페이지 헤더 ─────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">최신 뉴스</h1>
          <p className="text-sm" style={{ color: '#9E9E9E' }}>
            AI가 매일 큐레이션하는 글로벌 AgTech · FoodTech 뉴스
          </p>
        </div>

        {/* ── 지역 필터 탭 ─────────────────────────────────────── */}
        <div
          className="flex items-center gap-1 mb-8 p-1 rounded-xl w-fit"
          style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
        >
          {REGION_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleRegionChange(key)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: activeRegion === key ? '#0891B2' : 'transparent',
                color:           activeRegion === key ? '#FFFFFF'  : '#9E9E9E',
              }}
            >
              {label}
              <span className="ml-2 text-xs opacity-70">
                ({articles.filter((a) => matchRegion(a.region, key)).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── 기사 그리드 ─────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-sm" style={{ color: '#9E9E9E' }}>뉴스를 불러오는 중...</p>
          </div>
        ) : paged.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p style={{ color: '#9E9E9E' }}>해당 지역의 기사가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paged.map((article) => (
              <ArticleCard key={article.id} {...article} lang="ko" />
            ))}
          </div>
        )}

        {/* ── 페이지네이션 ─────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors disabled:opacity-30"
              style={{ border: '1px solid #333333', color: '#9E9E9E', backgroundColor: '#242424' }}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: currentPage === p ? '#0891B2'  : '#242424',
                  color:           currentPage === p ? '#FFFFFF'   : '#9E9E9E',
                  border:          currentPage === p ? 'none'      : '1px solid #333333',
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors disabled:opacity-30"
              style={{ border: '1px solid #333333', color: '#9E9E9E', backgroundColor: '#242424' }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
