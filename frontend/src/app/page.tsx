import ArticleCard from '@/src/components/ArticleCard';
import Link from 'next/link';
import { fetchArticles } from '@/src/lib/api';
import { MOCK_ARTICLES } from '@/src/lib/mockData';

const SEA_REGIONS = ['sea', 'vietnam', 'indonesia', 'thailand'];

const REGION_STYLE: Record<string, { label: string; color: string }> = {
  sea:       { label: 'SEA',    color: '#22D3EE' },
  vietnam:   { label: 'VN',     color: '#22D3EE' },
  indonesia: { label: 'ID',     color: '#22D3EE' },
  thailand:  { label: 'TH',     color: '#22D3EE' },
  korea:     { label: 'KR',     color: '#4ADE80' },
  global:    { label: 'Global', color: '#9E9E9E' },
};

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

export default async function HomePage() {
  // API fetch → 실패/오프라인이면 빈 배열 반환
  const apiArticles = await fetchArticles({ menu_type: 'news', limit: 20 });
  const articles    = apiArticles.length > 0 ? apiArticles : MOCK_ARTICLES;

  const featured     = articles[0];
  const newsArticles = articles.slice(0, 6);
  const seaArticles  = articles.filter((a) => SEA_REGIONS.includes(a.region)).slice(0, 4);

  const featuredRegionStyle = REGION_STYLE[featured.region] ?? { label: featured.region.toUpperCase(), color: '#9E9E9E' };

  return (
    <div style={{ backgroundColor: '#1A1A1A' }}>

      {/* ── 히어로 섹션 ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #1E3040 50%, #1A1A1A 100%)' }}
      >
        {/* 배경 데코 */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, #0891B222 0%, transparent 70%)' }}
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
                    {featured.category}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: `${featuredRegionStyle.color}22`,
                      color: featuredRegionStyle.color,
                      border: `1px solid ${featuredRegionStyle.color}55`,
                    }}
                  >
                    {featuredRegionStyle.label}
                  </span>
                </div>
                <h2 className="text-lg font-bold leading-snug text-white">
                  {featured.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#9E9E9E' }}>
                  {featured.excerpt}
                </p>
                <Link
                  href={`/news/${featured.slug}`}
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
                  { value: '30+',   label: '일일 뉴스' },
                  { value: '4',     label: '지역 언어' },
                  { value: '$0.50', label: '월 AI비용' },
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
          {newsArticles.map((article) => (
            <ArticleCard key={article.id} {...article} lang="ko" />
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
          {seaArticles.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                alignItems: 'start',
              }}
            >
              {seaArticles.map((article) => (
                <div key={article.id} style={{ minWidth: 0 }}>
                  <ArticleCard {...article} lang="ko" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#9E9E9E' }}>동남아 기사를 불러오는 중입니다.</p>
          )}
        </div>
      </section>

      {/* ── 뉴스레터 CTA ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1E3040 0%, #242424 100%)', border: '1px solid #0891B255' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#0891B2' }}>
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
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF' }}
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
