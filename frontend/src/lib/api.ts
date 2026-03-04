/**
 * SmartFarmNews API client
 *
 * 백엔드 GET /api/articles 엔드포인트를 호출한다.
 * 에러·오프라인 시 빈 배열/null 반환 → 호출부에서 빈 상태 처리.
 */

import { Article } from './mockData';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// ── 백엔드 응답 row 타입 ──────────────────────────────────────────
interface ApiRow {
  id: number;
  slug: string;
  title_ko: string;
  title_en?: string;
  content_ko?: string;
  summary?: string;
  tags?: string[];
  source_name?: string;
  menu_type?: string;
  published_at?: string;
  view_count?: number;
  region?: string;
}

function normalize(row: ApiRow): Article {
  return {
    id:       row.id,
    slug:     row.slug,
    title:    row.title_ko || row.title_en || '',
    excerpt:  row.summary ?? '',
    content:  row.content_ko ?? '',
    category: row.tags?.[0] ?? row.menu_type ?? '',
    region:   row.region ?? 'global',
    date:     row.published_at?.slice(0, 10) ?? '',
  };
}

// ── 목록 조회 ─────────────────────────────────────────────────────
export async function fetchArticles(params?: {
  menu_type?: string;
  region?: string;   // 백엔드 미지원, 미래 확장용
  lang?: string;     // 백엔드 미지원, 미래 확장용
  limit?: number;
  page?: number;
}): Promise<Article[]> {
  try {
    const qs = new URLSearchParams();
    if (params?.menu_type) qs.set('menu_type', params.menu_type);
    if (params?.limit)     qs.set('limit',     String(params.limit));
    if (params?.page)      qs.set('page',      String(params.page));

    const res = await fetch(`${BASE}/api/articles?${qs}`, {
      next: { revalidate: 60 }, // ISR: 60초마다 재검증
    });
    if (!res.ok) return [];

    const json = await res.json();
    return (json.data as ApiRow[] ?? []).map(normalize);
  } catch {
    return [];
  }
}

// ── 단건 조회 (slug 기반) ─────────────────────────────────────────
export async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BASE}/api/articles/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const row: ApiRow = await res.json();
    return normalize(row);
  } catch {
    return null;
  }
}
