'use client';

import { useState } from 'react';
import ArticleCard from '@/src/components/ArticleCard';

// ── Mock 데이터 ───────────────────────────────────────────────────
const ALL_ARTICLES = [
  { id: 1,  title: 'K-AgTech 스타트업, 동남아 3개국 동시 진출 성공', excerpt: '그린랩스가 베트남·태국·인도네시아 시장에 통합 스마트팜 플랫폼을 론칭, 현지 파트너사와 합작 법인을 설립했다.', category: 'K-AgTech',  region: 'korea',     date: '2026-03-02', slug: 'k-agtech-sea-expansion' },
  { id: 2,  title: 'e27 리포트: SEA 애그리테크 스타트업 펀딩 현황', excerpt: '2025년 동남아 농업기술 스타트업에 유입된 VC 투자액이 전년 대비 34% 증가한 12억 달러를 기록했다.', category: 'investment', region: 'sea',       date: '2026-03-01', slug: 'sea-agtech-funding-2025' },
  { id: 3,  title: '수직농장 기술, 중동·동남아 확산 가속화',         excerpt: '에너지 효율 개선과 LED 비용 하락으로 도시 수직농장의 수익성이 개선되며 글로벌 확장세가 이어진다.',       category: 'FoodTech',   region: 'global',    date: '2026-03-01', slug: 'vertical-farm-mena-sea' },
  { id: 4,  title: '농식품부, K-AgTech 글로벌화 지원 100억 추가 편성', excerpt: '스마트팜 수출 컨소시엄 구성을 위한 예산을 확대하고 현지화 R&D 지원을 강화한다는 계획을 발표했다.',   category: '정책',       region: 'korea',     date: '2026-02-28', slug: 'mafra-agtech-global-support' },
  { id: 5,  title: 'GrowAsia 2026 서밋: ASEAN 농업 혁신 로드맵 공개', excerpt: 'ASEAN 농업장관 회의에서 디지털 전환과 청년 농업인 육성 중심의 5개년 계획이 제시됐다.',              category: 'AgTech',    region: 'sea',       date: '2026-02-27', slug: 'growasia-2026-summit' },
  { id: 6,  title: '인도네시아 팜 오일 AI 모니터링 도입 확대',         excerpt: '위성·드론 데이터를 결합한 지속가능성 추적 플랫폼이 수마트라 농장 3만 헥타르에 적용된다.',              category: 'AgTech',    region: 'sea',       date: '2026-02-26', slug: 'indonesia-palm-ai' },
  { id: 7,  title: '미국 농무부, AI 정밀농업 보조금 5억 달러 신설',     excerpt: '바이오 기반 토양 센서와 작황 예측 모델에 집중 지원하는 연방 보조금 프로그램이 발표됐다.',              category: 'investment', region: 'global',    date: '2026-02-25', slug: 'usda-ai-precision-farming' },
  { id: 8,  title: '베트남 스마트팜 신도시, 하노이 인근 100ha 조성', excerpt: '베트남 정부와 한국 컨소시엄이 협력해 첨단 농업 복합단지를 2028년까지 완공할 예정이다.',               category: 'K-AgTech',  region: 'sea',       date: '2026-02-24', slug: 'vietnam-smartfarm-city' },
  { id: 9,  title: '스마트팜 클라우드 플랫폼 농가 보급률 30% 돌파',    excerpt: '2025년 기준 전국 온실 농가의 30.4%가 IoT 기반 환경 제어 시스템을 도입한 것으로 나타났다.',          category: 'AgTech',    region: 'korea',     date: '2026-02-23', slug: 'smartfarm-cloud-30pct' },
  { id: 10, title: 'Agro Spectrum Asia: 태국 드론 농약 살포 규제 완화', excerpt: '태국 항공부가 농업용 드론의 비가시권 비행과 자율 비행을 허용하는 새 규정을 시행했다.',                 category: 'AgTech',    region: 'sea',       date: '2026-02-22', slug: 'thailand-drone-regulation' },
  { id: 11, title: 'EU 지속가능 농업 패키지, 2030 목표 재확인',         excerpt: 'Farm to Fork 전략의 핵심 지표인 농약 사용 50% 감축 목표를 유지하기로 결정, 대체 기술 지원을 확대한다.', category: '정책',      region: 'global',    date: '2026-02-21', slug: 'eu-farm-to-fork-2030' },
  { id: 12, title: '충남 딸기 수직농장, 연간 수출 50억 달성',           excerpt: '단동 면적 대비 수익성 분석에서 노지 재배 대비 4.2배 높은 결과를 기록하며 확산 가능성이 주목된다.',    category: 'AgTech',    region: 'korea',     date: '2026-02-20', slug: 'chungnam-strawberry-export' },
];

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
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = ALL_ARTICLES.filter((a) => matchRegion(a.region, activeRegion));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
                ({ALL_ARTICLES.filter((a) => matchRegion(a.region, key)).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── 기사 그리드 ─────────────────────────────────────── */}
        {paged.length === 0 ? (
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
