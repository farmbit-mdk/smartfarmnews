import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MOCK_ARTICLES, Article } from '@/src/lib/mockData';
import { fetchArticle, fetchArticles } from '@/src/lib/api';
import ArticleCard from '@/src/components/ArticleCard';

// ── 지역 스타일 ────────────────────────────────────────────────────
const REGION_STYLE: Record<string, { label: string; color: string }> = {
  sea:       { label: 'SEA',    color: '#22D3EE' },
  vietnam:   { label: 'VN',     color: '#22D3EE' },
  indonesia: { label: 'ID',     color: '#22D3EE' },
  thailand:  { label: 'TH',     color: '#22D3EE' },
  korea:     { label: 'KR',     color: '#4ADE80' },
  global:    { label: 'Global', color: '#9E9E9E' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function buildBodyParagraphs(article: Article): string[] {
  return [
    article.excerpt,
    `전문가들은 이번 사례가 ${article.category} 분야 전반에 걸쳐 새로운 기준점을 제시할 것으로 보고 있다. 특히 데이터 기반 의사결정과 AI 통합이 가속화되면서 관련 시장의 성장세는 더욱 뚜렷해질 전망이다.`,
    `업계 관계자는 "기술적 준비와 현지 파트너십 구축이 핵심"이라며, 단기 성과보다 생태계 전체의 지속가능성을 고려한 접근이 중요하다고 강조했다. 정책적 지원과 민간 투자가 맞물리는 시점이 주요 변곡점이 될 것으로 분석된다.`,
    `향후 12개월간의 시장 흐름을 좌우할 변수로는 글로벌 공급망 안정화, 탄소 규제 강화, 그리고 스마트팜 인프라 보급 속도가 꼽힌다. SmartFarmNews는 관련 동향을 지속적으로 모니터링할 예정이다.`,
  ];
}

// ── generateStaticParams ──────────────────────────────────────────
// 빌드 타임에 API + mock slug를 합쳐 정적 페이지 생성
export async function generateStaticParams() {
  const apiArticles = await fetchArticles({ limit: 100 });
  const allSlugs = new Set([
    ...apiArticles.map((a) => a.slug),
    ...MOCK_ARTICLES.map((a) => a.slug),
  ]);
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

// ── generateMetadata ──────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article =
    (await fetchArticle(slug)) ?? MOCK_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return { title: '기사를 찾을 수 없습니다 | SmartFarmNews' };
  }
  return {
    title:       `${article.title} | SmartFarmNews`,
    description: article.excerpt,
  };
}

// ── 페이지 컴포넌트 ───────────────────────────────────────────────
export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. API에서 단건 조회, 실패 시 mock fallback
  const apiArticle = await fetchArticle(slug);
  const article    = apiArticle ?? MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
  if (!article) notFound();

  // 2. 이전/다음/관련 기사 목록 (API 우선, 실패 시 mock)
  const apiList = await fetchArticles({ limit: 100 });
  const source  = apiList.length > 0 ? apiList : MOCK_ARTICLES;

  const index      = source.findIndex((a) => a.slug === slug);
  const prevArticle = index > 0                  ? source[index - 1] : null;
  const nextArticle = index < source.length - 1  ? source[index + 1] : null;

  const related = source
    .filter((a) => a.slug !== slug && a.category === article!.category)
    .slice(0, 3);

  const paragraphs  = buildBodyParagraphs(article!);
  const regionStyle = REGION_STYLE[article!.region] ?? {
    label: article!.region.toUpperCase(),
    color: '#9E9E9E',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* ← 뉴스 목록 링크 */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: '#9E9E9E' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            뉴스 목록
          </Link>
        </div>

        {/* 본문 + 사이드바 그리드 */}
        <div className="lg:grid lg:grid-cols-[1fr_300px] gap-10">

          {/* ── 메인 콘텐츠 ─────────────────────────────────── */}
          <article className="max-w-4xl">

            {/* 배지 + 날짜 */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span
                className="px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wide"
                style={{ backgroundColor: '#0891B2', color: '#FFFFFF' }}
              >
                {article!.category}
              </span>
              <span
                className="px-2.5 py-1 rounded text-xs font-semibold"
                style={{
                  backgroundColor: `${regionStyle.color}22`,
                  color:            regionStyle.color,
                  border:          `1px solid ${regionStyle.color}55`,
                }}
              >
                {regionStyle.label}
              </span>
              <span className="text-xs ml-auto" style={{ color: '#9E9E9E' }}>
                {formatDate(article!.date)}
              </span>
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-white leading-snug mb-8">
              {article!.title}
            </h1>

            {/* 구분선 */}
            <div className="mb-8" style={{ borderTop: '1px solid #333333' }} />

            {/* 본문 단락 */}
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p key={i} className="leading-relaxed text-base" style={{ color: '#CCCCCC' }}>
                  {para}
                </p>
              ))}
            </div>

            {/* 구분선 */}
            <div className="my-10" style={{ borderTop: '1px solid #333333' }} />

            {/* 이전 / 다음 네비게이션 */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevArticle ? (
                <Link
                  href={`/news/${prevArticle.slug}`}
                  className="group flex flex-col gap-1 p-4 rounded-xl transition-colors"
                  style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
                >
                  <span className="text-xs" style={{ color: '#9E9E9E' }}>← 이전 기사</span>
                  <span
                    className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors"
                    style={{ color: '#FFFFFF' }}
                  >
                    {prevArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <Link
                  href={`/news/${nextArticle.slug}`}
                  className="group flex flex-col gap-1 p-4 rounded-xl transition-colors text-right"
                  style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
                >
                  <span className="text-xs" style={{ color: '#9E9E9E' }}>다음 기사 →</span>
                  <span
                    className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors"
                    style={{ color: '#FFFFFF' }}
                  >
                    {nextArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </article>

          {/* ── 사이드바: 관련 기사 ──────────────────────────── */}
          <aside className="mt-10 lg:mt-0">
            <div
              className="sticky top-8 rounded-xl p-5"
              style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
            >
              <h2
                className="text-sm font-semibold text-white mb-4 pb-3"
                style={{ borderBottom: '1px solid #333333' }}
              >
                관련 기사
              </h2>

              {related.length === 0 ? (
                <p className="text-xs" style={{ color: '#9E9E9E' }}>관련 기사가 없습니다.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {related.map((r) => (
                    <ArticleCard
                      key={r.id}
                      id={r.id}
                      title={r.title}
                      excerpt={r.excerpt}
                      category={r.category}
                      region={r.region}
                      date={r.date}
                      slug={r.slug}
                      lang="ko"
                    />
                  ))}
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
