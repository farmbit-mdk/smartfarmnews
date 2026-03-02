import ArticleCard from '@/src/components/ArticleCard';
import Link from 'next/link';

// ── Mock 데이터 (API 연결 전 임시) ────────────────────────────────
const FEATURED_ARTICLE = {
  id: 1,
  title: '아시아 스마트팜 시장, 2030년까지 연 12% 성장 전망',
  excerpt:
    'GrowAsia 보고서에 따르면 동남아시아 정밀농업 투자가 급증하며 베트남·인도네시아·태국이 핵심 성장 거점으로 부상하고 있다.',
  category: 'AgTech',
  region: 'sea',
  date: '2026-03-02',
  slug: 'asia-smartfarm-market-2030',
};

const NEWS_ARTICLES = [
  {
    id: 2,
    title: 'K-AgTech 스타트업, 동남아 3개국 동시 진출 성공',
    excerpt: '국내 스마트팜 솔루션 기업 그린랩스가 베트남·태국·인도네시아 시장에 통합 플랫폼을 론칭했다.',
    category: 'K-AgTech',
    region: 'korea',
    date: '2026-03-02',
    slug: 'k-agtech-sea-expansion',
  },
  {
    id: 3,
    title: 'e27 리포트: SEA 애그리테크 스타트업 펀딩 현황',
    excerpt: '2025년 동남아 농업기술 스타트업에 유입된 VC 투자액이 전년 대비 34% 증가했다.',
    category: 'investment',
    region: 'sea',
    date: '2026-03-01',
    slug: 'sea-agtech-funding-2025',
  },
  {
    id: 4,
    title: '수직농장 기술, 중동·동남아 확산 가속화',
    excerpt: '에너지 효율 개선과 LED 비용 하락으로 도시 수직농장의 수익성이 개선되며 글로벌 확장세가 이어진다.',
    category: 'FoodTech',
    region: 'global',
    date: '2026-03-01',
    slug: 'vertical-farm-mena-sea',
  },
  {
    id: 5,
    title: '농식품부, K-AgTech 글로벌화 지원 100억 추가 편성',
    excerpt: '정부가 스마트팜 수출 컨소시엄 구성을 위한 예산을 확대하고 현지화 R&D 지원을 강화한다.',
    category: '정책',
    region: 'korea',
    date: '2026-02-28',
    slug: 'mafra-agtech-global-support',
  },
  {
    id: 6,
    title: 'GrowAsia 2026 서밋: ASEAN 농업 혁신 로드맵 공개',
    excerpt: 'ASEAN 농업장관 회의에서 디지털 전환과 청년 농업인 육성 중심의 5개년 계획이 제시됐다.',
    category: 'AgTech',
    region: 'sea',
    date: '2026-02-27',
    slug: 'growasia-2026-summit',
  },
  {
    id: 7,
    title: '인도네시아 팜 오일 AI 모니터링 도입 확대',
    excerpt: '위성·드론 데이터를 결합한 지속가능성 추적 플랫폼이 수마트라 농장 3만 헥타르에 적용된다.',
    category: 'AgTech',
    region: 'indonesia',
    date: '2026-02-26',
    slug: 'indonesia-palm-ai-monitoring',
  },
];

const SEA_ARTICLES = NEWS_ARTICLES.filter((a) =>
  ['sea', 'vietnam', 'indonesia', 'thailand'].includes(a.region ?? ''),
);

// ── 섹션 헤더 컴포넌트 ────────────────────────────────────────────
function SectionHeader({ title, href, badge }: { title: string; href?: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {badge && (
          <span
            className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ backgroundColor: '#22D3EE22', color: '#22D3EE', border: '1px solid #22D3EE55' }}
          >
            {badge}
          </span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-sm transition-colors duration-150 hover:opacity-80"
          style={{ color: '#0891B2' }}
        >
          전체 보기 →
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>

      {/* ── 히어로 섹션 ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #1E3040 50%, #1A1A1A 100%)' }}
      >
        {/* 배경 데코: Teal 라이트 */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 70% 50%, #0891B222 0%, transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* 헤드라인 */}
            <div className="space-y-6">
              <div>
                <span
                  className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: '#0891B222', color: '#22D3EE', border: '1px solid #0891B255' }}
                >
                  Asia&apos;s AgTech Intelligence
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                아시아 농업의<br />
                <span style={{ color: '#22D3EE' }}>미래를 읽는</span><br />
                미디어
              </h1>
              <p className="text-base leading-relaxed" style={{ color: '#9E9E9E' }}>
                AI가 매일 30~50개 AgTech·FoodTech 뉴스를 큐레이션합니다.<br />
                한국 · 동남아 · 글로벌 농업기술 인텔리전스를 한 곳에서.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/news"
                  className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#0891B2', color: '#FFFFFF' }}
                >
                  뉴스 보기
                </Link>
                <Link
                  href="/subscribe"
                  className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
                >
                  무료 구독
                </Link>
              </div>
            </div>

            {/* 피처드 기사 카드 */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#0891B2' }}>
                오늘의 주요 뉴스
              </p>
              <div
                className="rounded-2xl p-5 space-y-4"
                style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: '#0891B2', color: '#FFF' }}
                  >
                    {FEATURED_ARTICLE.category}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: '#22D3EE22', color: '#22D3EE', border: '1px solid #22D3EE55' }}
                  >
                    SEA
                  </span>
                </div>
                <h2 className="text-lg font-bold leading-snug text-white">
                  {FEATURED_ARTICLE.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#9E9E9E' }}>
                  {FEATURED_ARTICLE.excerpt}
                </p>
                <Link
                  href={`/news/${FEATURED_ARTICLE.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: '#22D3EE' }}
                >
                  전문 읽기
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M7.707 2.293a1 1 0 00-1.414 1.414L8.586 6H2a1 1 0 100 2h6.586l-2.293 2.293a1 1 0 101.414 1.414l4-4a1 1 0 000-1.414l-4-4z" />
                  </svg>
                </Link>
              </div>

              {/* 플랫폼 통계 요약 */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { value: '30+',   label: '일일 뉴스'  },
                  { value: '4',     label: '지역 언어'  },
                  { value: '$0.50', label: '월 AI비용'  },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 text-center"
                    style={{ backgroundColor: '#1E1E1E', border: '1px solid #333333' }}
                  >
                    <p className="text-xl font-bold" style={{ color: '#22D3EE' }}>{value}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9E9E9E' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 최신 뉴스 그리드 ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <SectionHeader title="최신 뉴스" href="/news" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NEWS_ARTICLES.map((article) => (
            <ArticleCard
              key={article.id}
              {...article}
              lang="ko"
            />
          ))}
        </div>
      </section>

      {/* ── SEA Focus 섹션 ────────────────────────────────────────── */}
      <section
        className="py-14"
        style={{ backgroundColor: '#242424', borderTop: '1px solid #333333', borderBottom: '1px solid #333333' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="동남아 포커스" href="/news?region=sea" badge="SEA" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SEA_ARTICLES.slice(0, 4).map((article) => (
              <ArticleCard
                key={article.id}
                {...article}
                lang="ko"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 뉴스레터 CTA ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{
            background: 'linear-gradient(135deg, #1E3040 0%, #242424 100%)',
            border: '1px solid #0891B255',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: '#0891B2' }}
          >
            Newsletter
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            매일 아침 AgTech 브리핑
          </h2>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#9E9E9E' }}>
            AI가 큐레이션한 한국·동남아·글로벌 농업기술 뉴스를<br />
            매일 아침 이메일로 받아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
            <input
              type="email"
              placeholder="이메일 주소 입력"
              className="w-full sm:flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #333333',
                color: '#FFFFFF',
              }}
            />
            <Link
              href="/subscribe"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
            >
              무료 구독
            </Link>
          </div>
          <p className="text-xs mt-4" style={{ color: '#9E9E9E' }}>
            무료 · 언제든 구독 취소 가능
          </p>
        </div>
      </section>
    </div>
  );
}
