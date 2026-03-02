import Link from 'next/link';

type Region = 'global' | 'sea' | 'vietnam' | 'indonesia' | 'thailand' | 'korea' | string;

interface ArticleCardProps {
  id: number | string;
  title: string;
  excerpt?: string;
  category?: string;
  region?: Region;
  date?: string;
  imageUrl?: string;
  lang?: 'ko' | 'en';
  slug?: string;
}

const REGION_STYLE: Record<string, { label: string; color: string }> = {
  sea:       { label: 'SEA',    color: '#22D3EE' },
  vietnam:   { label: 'VN',     color: '#22D3EE' },
  indonesia: { label: 'ID',     color: '#22D3EE' },
  thailand:  { label: 'TH',     color: '#22D3EE' },
  korea:     { label: 'KR',     color: '#4ADE80' },
  global:    { label: 'Global', color: '#9E9E9E' },
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  category,
  region,
  date,
  imageUrl,
  lang = 'ko',
  slug,
}: ArticleCardProps) {
  const href = slug ? `/news/${slug}` : `/news/${id}`;
  const regionStyle = region ? (REGION_STYLE[region] ?? { label: region.toUpperCase(), color: '#9E9E9E' }) : null;

  return (
    <Link href={href} className="group block">
      <article
        className="h-full rounded-xl overflow-hidden transition-all duration-200"
        style={{
          backgroundColor: '#242424',
          border: '1px solid #333333',
        }}
        // hover는 Tailwind group으로 처리
      >
        {/* 썸네일 */}
        {imageUrl ? (
          <div className="relative h-44 overflow-hidden bg-sfn-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          /* 이미지 없을 때 플레이스홀더 */
          <div
            className="h-44 flex items-center justify-center"
            style={{ backgroundColor: '#1E3040' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M 5 34 A 15 15 0 0 1 35 34" stroke="#0891B2" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 11 34 A 9 9 0 0 1 29 34"  stroke="#0891B2" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 17 34 A 3 3 0 0 1 23 34"  stroke="#0891B2" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 20 34 L 20 20" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
              <path d="M 20 26 Q 14 22 13 15" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M 20 29 Q 26 25 27 18" stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="p-4 space-y-3">
          {/* 배지 행 */}
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span
                className="px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide"
                style={{ backgroundColor: '#0891B2', color: '#FFFFFF' }}
              >
                {category}
              </span>
            )}
            {regionStyle && (
              <span
                className="px-2 py-0.5 rounded text-xs font-semibold"
                style={{ backgroundColor: `${regionStyle.color}22`, color: regionStyle.color, border: `1px solid ${regionStyle.color}55` }}
              >
                {regionStyle.label}
              </span>
            )}
            {lang === 'en' && (
              <span className="px-1.5 py-0.5 rounded text-xs" style={{ color: '#9E9E9E', border: '1px solid #333333' }}>
                EN
              </span>
            )}
          </div>

          {/* 제목 */}
          <h3
            className="font-semibold leading-snug line-clamp-2 transition-colors duration-150 group-hover:text-sfn-cyan"
            style={{ color: '#FFFFFF', fontSize: '0.95rem' }}
          >
            {title}
          </h3>

          {/* 발췌 */}
          {excerpt && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#9E9E9E' }}>
              {excerpt}
            </p>
          )}

          {/* 날짜 */}
          {date && (
            <p className="text-xs" style={{ color: '#9E9E9E' }}>
              {formatDate(date)}
            </p>
          )}
        </div>

        {/* hover glow — 카드 하단 선 */}
        <div
          className="h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-b-xl"
          style={{ backgroundColor: '#22D3EE' }}
        />
      </article>
    </Link>
  );
}
