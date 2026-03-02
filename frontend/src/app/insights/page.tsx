import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '인사이트 - 전문 AgTech 분석 리포트',
  description: '스마트팜·AgTech·FoodTech 전문 분석 리포트. AI 생성 인사이트와 전문가 논평.',
};

// ── Mock 데이터 ───────────────────────────────────────────────────
type InsightTier = 'premium' | 'free';

interface Insight {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  region: string;
  readTime: number;
  date: string;
  tier: InsightTier;
  slug: string;
  keyPoints: string[];
}

const INSIGHTS: Insight[] = [
  {
    id: 1,
    title: '2026 동남아 스마트팜 투자 지도: 베트남·인도네시아·태국 비교 분석',
    excerpt: 'GrowAsia 데이터를 기반으로 3개국 정밀농업 투자 흐름과 정책 환경, 진입 전략을 심층 분석합니다.',
    category: 'Market Analysis',
    region: 'SEA',
    readTime: 12,
    date: '2026-03-01',
    tier: 'premium',
    slug: 'sea-smartfarm-investment-map-2026',
    keyPoints: ['베트남 2025 VC 투자 340M USD', '인도네시아 팜오일 디지털화 가속', '태국 드론 규제 완화 효과'],
  },
  {
    id: 2,
    title: 'K-AgTech 글로벌화 전략 분석: 성공 사례와 실패 패턴',
    excerpt: '한국 농업기술 기업의 해외 진출 사례 20건을 분석해 성공 요인과 반복되는 실패 패턴을 도출합니다.',
    category: 'Strategy',
    region: '한국',
    readTime: 15,
    date: '2026-02-24',
    tier: 'premium',
    slug: 'k-agtech-global-strategy-analysis',
    keyPoints: ['현지화가 핵심', '정부 지원 활용 전략', '파트너십 모델 비교'],
  },
  {
    id: 3,
    title: '수직농장 경제성 분석 리포트: 2030년 손익분기점 시나리오',
    excerpt: '에너지 비용·LED 기술 개선·수요 증가를 변수로 한 수직농장 수익성 Monte Carlo 시뮬레이션 결과를 공개합니다.',
    category: 'Financial',
    region: 'Global',
    readTime: 20,
    date: '2026-02-17',
    tier: 'premium',
    slug: 'vertical-farm-economics-2030',
    keyPoints: ['LED 비용 2028년 추가 40% 하락 전망', '도시 면적 프리미엄 효과', '탄소 크레딧 수익화 가능성'],
  },
  {
    id: 4,
    title: '동남아 농업 디지털 전환 현황: ASEAN 5개국 스코어카드',
    excerpt: '정책·인프라·스타트업 생태계·농가 수용성 4개 지표로 ASEAN 주요국 디지털 농업 전환 수준을 평가합니다.',
    category: 'Research',
    region: 'SEA',
    readTime: 8,
    date: '2026-02-10',
    tier: 'free',
    slug: 'asean-digital-agri-scorecard',
    keyPoints: ['태국 1위, 필리핀 최하위', '인프라 격차가 최대 장벽', '모바일 퍼스트 전략의 중요성'],
  },
  {
    id: 5,
    title: 'AI 작황 예측 모델 정확도 비교: Qwen vs GPT vs Gemini',
    excerpt: '국내 주요 작물 5종에 대한 AI 모델별 수확량 예측 정확도를 실측 데이터와 비교 검증한 결과를 정리합니다.',
    category: 'Technology',
    region: '한국',
    readTime: 10,
    date: '2026-02-03',
    tier: 'free',
    slug: 'ai-crop-prediction-model-comparison',
    keyPoints: ['Qwen 72B, 벼·딸기에서 최고 정확도', '파인튜닝이 범용 모델 격차 해소', '비용 대비 성능 분석'],
  },
  {
    id: 6,
    title: 'FoodTech 유니콘 지도 2026: 아시아 식품기술 생태계 전망',
    excerpt: '아시아 FoodTech 스타트업 200개사를 분석해 유니콘 후보군과 M&A 타겟을 선별합니다.',
    category: 'Market Analysis',
    region: 'Global',
    readTime: 14,
    date: '2026-01-27',
    tier: 'premium',
    slug: 'foodtech-unicorn-map-2026',
    keyPoints: ['대체단백질 상위 10개사', '배양육 기업 IPO 타임라인', '아시아 VC 집중 투자 분야'],
  },
];

function InsightCard({ insight }: { insight: Insight }) {
  const isPremium = insight.tier === 'premium';

  return (
    <article
      className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 hover:translate-y-[-2px]"
      style={{
        backgroundColor: '#242424',
        border: isPremium ? '1px solid #F59E0B44' : '1px solid #333333',
      }}
    >
      {/* 배지 행 */}
      <div className="flex items-center gap-2 flex-wrap">
        {isPremium && (
          <span
            className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide"
            style={{ backgroundColor: '#F59E0B22', color: '#F59E0B', border: '1px solid #F59E0B55' }}
          >
            PREMIUM
          </span>
        )}
        <span
          className="px-2 py-0.5 rounded text-xs font-semibold"
          style={{ backgroundColor: '#0891B2', color: '#FFF' }}
        >
          {insight.category}
        </span>
        <span className="text-xs" style={{ color: '#9E9E9E' }}>
          {insight.region}
        </span>
      </div>

      {/* 제목 */}
      <h2
        className="font-bold leading-snug text-white"
        style={{ fontSize: '1.05rem' }}
      >
        {insight.title}
      </h2>

      {/* 발췌 */}
      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#9E9E9E' }}>
        {insight.excerpt}
      </p>

      {/* 핵심 포인트 */}
      <ul className="space-y-1.5">
        {insight.keyPoints.map((point, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#9E9E9E' }}>
            <span style={{ color: '#22D3EE', flexShrink: 0 }}>•</span>
            {point}
          </li>
        ))}
      </ul>

      {/* 하단: 읽기 시간 + CTA */}
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#333333' }}>
        <div className="flex items-center gap-3 text-xs" style={{ color: '#9E9E9E' }}>
          <span>⏱ {insight.readTime}분 읽기</span>
          <span>{new Date(insight.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
        </div>
        {isPremium ? (
          <Link
            href="/subscribe"
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
          >
            구독 후 읽기
          </Link>
        ) : (
          <Link
            href={`/insights/${insight.slug}`}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{ backgroundColor: '#0891B222', color: '#22D3EE', border: '1px solid #0891B255' }}
          >
            읽기 →
          </Link>
        )}
      </div>
    </article>
  );
}

export default function InsightsPage() {
  const premium = INSIGHTS.filter((i) => i.tier === 'premium');
  const free    = INSIGHTS.filter((i) => i.tier === 'free');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* ── 페이지 헤더 ───────────────────────────────────────── */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">인사이트</h1>
          <p className="text-sm" style={{ color: '#9E9E9E' }}>
            AgTech · FoodTech 전문 분석 리포트 — AI 생성 + 에디터 큐레이션
          </p>
        </div>

        {/* ── 구독 유도 배너 (PREMIUM 섹션 전) ─────────────────── */}
        <div
          className="rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #1E2D1A 0%, #1A3040 100%)', border: '1px solid #F59E0B33' }}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#F59E0B' }}>
              PREMIUM 구독
            </p>
            <p className="text-white font-bold">
              매주 3편의 심층 분석 리포트를 무제한으로 읽으세요
            </p>
            <p className="text-sm mt-1" style={{ color: '#9E9E9E' }}>
              시장 분석 · 투자 인사이트 · 기술 비교 리포트 포함
            </p>
          </div>
          <Link
            href="/subscribe"
            className="flex-shrink-0 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
          >
            무료로 시작하기
          </Link>
        </div>

        {/* ── PREMIUM 인사이트 ──────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">PREMIUM 리포트</h2>
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: '#F59E0B22', color: '#F59E0B', border: '1px solid #F59E0B55' }}
            >
              구독 전용
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {premium.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>

        {/* ── 무료 인사이트 ────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">무료 리포트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {free.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
