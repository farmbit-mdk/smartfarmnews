import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '박람회 · 이벤트 - AgTech 컨퍼런스 일정',
  description: '아시아 AgTech·FoodTech 박람회, 컨퍼런스, 서밋 일정을 한눈에 확인하세요.',
};

// ── Mock 데이터 ───────────────────────────────────────────────────
type EventFormat = 'offline' | 'online' | 'hybrid';
type EventRegion = 'sea' | 'korea' | 'global' | 'japan';

interface AgEvent {
  id: number;
  titleKo: string;
  titleEn: string;
  location: string;
  country: string;
  region: EventRegion;
  startDate: string;
  endDate: string;
  format: EventFormat;
  website: string;
  category: string;
  status: 'upcoming' | 'ongoing';
}

const EVENTS: AgEvent[] = [
  { id: 1,  titleKo: '스마트팜 엑스포 서울 2026',       titleEn: 'SmartFarm Expo Seoul 2026',           location: '코엑스, 서울',         country: '한국',      region: 'korea',  startDate: '2026-03-25', endDate: '2026-03-27', format: 'offline', website: '#', category: '박람회',   status: 'upcoming' },
  { id: 2,  titleKo: 'Korea AgTech Week 2026',          titleEn: 'Korea AgTech Week 2026',               location: '온라인',               country: '한국',      region: 'korea',  startDate: '2026-03-30', endDate: '2026-04-01', format: 'online',  website: '#', category: '컨퍼런스', status: 'upcoming' },
  { id: 3,  titleKo: 'AgriTech Asia Summit 방콕',       titleEn: 'AgriTech Asia Summit Bangkok',         location: 'BITEC, 방콕',          country: '태국',      region: 'sea',    startDate: '2026-04-15', endDate: '2026-04-17', format: 'hybrid',  website: '#', category: '서밋',     status: 'upcoming' },
  { id: 4,  titleKo: '스마트농업·첨단원예 국제 심포지엄', titleEn: 'Int\'l Smart Farming Symposium',      location: 'aT센터, 서울',         country: '한국',      region: 'korea',  startDate: '2026-04-22', endDate: '2026-04-23', format: 'offline', website: '#', category: '심포지엄', status: 'upcoming' },
  { id: 5,  titleKo: 'GrowAsia 2026',                   titleEn: 'GrowAsia 2026',                        location: 'Suntec, 싱가포르',     country: '싱가포르',  region: 'sea',    startDate: '2026-05-12', endDate: '2026-05-14', format: 'offline', website: '#', category: '박람회',   status: 'upcoming' },
  { id: 6,  titleKo: 'FoodTech Forum 도쿄',             titleEn: 'FoodTech Forum Tokyo',                 location: '도쿄 빅사이트',        country: '일본',      region: 'japan',  startDate: '2026-05-20', endDate: '2026-05-21', format: 'offline', website: '#', category: '포럼',     status: 'upcoming' },
  { id: 7,  titleKo: 'ASEAN 농업 혁신 컨퍼런스',        titleEn: 'ASEAN Agriculture Innovation Conf.',  location: 'JCC, 자카르타',        country: '인도네시아', region: 'sea',   startDate: '2026-06-08', endDate: '2026-06-10', format: 'offline', website: '#', category: '컨퍼런스', status: 'upcoming' },
  { id: 8,  titleKo: '글로벌 수직농장 서밋',             titleEn: 'Global Vertical Farm Summit',          location: '암스테르담',           country: '네덜란드',  region: 'global', startDate: '2026-06-24', endDate: '2026-06-25', format: 'hybrid',  website: '#', category: '서밋',     status: 'upcoming' },
  { id: 9,  titleKo: '세계식품박람회 (SIAL)',            titleEn: 'SIAL Asia 2026',                       location: 'Marina Bay, 싱가포르', country: '싱가포르',  region: 'sea',    startDate: '2026-07-14', endDate: '2026-07-16', format: 'offline', website: '#', category: '박람회',   status: 'upcoming' },
  { id: 10, titleKo: 'K-FoodTech 글로벌 쇼케이스',      titleEn: 'K-FoodTech Global Showcase',           location: 'KINTEX, 고양',         country: '한국',      region: 'korea',  startDate: '2026-08-05', endDate: '2026-08-07', format: 'offline', website: '#', category: '박람회',   status: 'upcoming' },
];

const FORMAT_STYLE: Record<EventFormat, { label: string; color: string; bg: string }> = {
  offline: { label: '현장',     color: '#4ADE80', bg: '#4ADE8022' },
  online:  { label: '온라인',   color: '#22D3EE', bg: '#22D3EE22' },
  hybrid:  { label: '온·오프',  color: '#F59E0B', bg: '#F59E0B22' },
};

const REGION_COLOR: Record<EventRegion, string> = {
  sea:    '#22D3EE',
  korea:  '#4ADE80',
  global: '#9E9E9E',
  japan:  '#F59E0B',
};

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  if (s.getMonth() === e.getMonth()) {
    return `${s.toLocaleDateString('ko-KR', opts)} - ${e.getDate()}일`;
  }
  return `${s.toLocaleDateString('ko-KR', opts)} - ${e.toLocaleDateString('ko-KR', opts)}`;
}

function getMonth(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
}

// 월별 그룹화
function groupByMonth(events: AgEvent[]): [string, AgEvent[]][] {
  const groups = new Map<string, AgEvent[]>();
  for (const event of events) {
    const month = getMonth(event.startDate);
    if (!groups.has(month)) groups.set(month, []);
    groups.get(month)!.push(event);
  }
  return Array.from(groups.entries());
}

function EventCard({ event }: { event: AgEvent }) {
  const fmt    = FORMAT_STYLE[event.format];
  const rColor = REGION_COLOR[event.region];

  return (
    <article
      className="rounded-xl p-5 flex gap-4 transition-all duration-200 hover:translate-y-[-1px]"
      style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
    >
      {/* 날짜 컬럼 */}
      <div
        className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: '#0891B222', border: '1px solid #0891B255' }}
      >
        <p className="text-xs font-medium" style={{ color: '#0891B2' }}>
          {new Date(event.startDate).toLocaleDateString('ko-KR', { month: 'short' })}
        </p>
        <p className="text-xl font-bold" style={{ color: '#22D3EE' }}>
          {new Date(event.startDate).getDate()}
        </p>
      </div>

      {/* 정보 컬럼 */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* 배지 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded text-xs font-semibold"
            style={{ backgroundColor: fmt.bg, color: fmt.color, border: `1px solid ${fmt.color}55` }}
          >
            {fmt.label}
          </span>
          <span className="text-xs font-medium" style={{ color: rColor }}>
            {event.country}
          </span>
          <span className="text-xs" style={{ color: '#9E9E9E' }}>
            {event.category}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="font-semibold text-white leading-snug">{event.titleKo}</h3>

        {/* 일정 · 장소 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs" style={{ color: '#9E9E9E' }}>
          <span>📅 {formatDateRange(event.startDate, event.endDate)}</span>
          <span>📍 {event.location}</span>
        </div>

        {/* 링크 */}
        <Link
          href={event.website}
          className="inline-flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-80"
          style={{ color: '#0891B2' }}
        >
          자세히 보기 →
        </Link>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const grouped = groupByMonth(EVENTS.sort((a, b) => a.startDate.localeCompare(b.startDate)));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">

        {/* ── 페이지 헤더 ────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">박람회 · 이벤트</h1>
          <p className="text-sm" style={{ color: '#9E9E9E' }}>
            AgTech · FoodTech 글로벌 컨퍼런스, 박람회, 서밋 일정
          </p>
        </div>

        {/* ── 범례 ────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          {Object.entries(FORMAT_STYLE).map(([key, { label, color, bg }]) => (
            <span
              key={key}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: bg, color, border: `1px solid ${color}55` }}
            >
              {label}
            </span>
          ))}
          <span className="text-xs ml-2" style={{ color: '#9E9E9E' }}>
            총 {EVENTS.length}개 이벤트
          </span>
        </div>

        {/* ── 월별 이벤트 목록 ─────────────────────────────────── */}
        <div className="space-y-10">
          {grouped.map(([month, monthEvents]) => (
            <section key={month}>
              {/* 월 구분선 */}
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-base font-semibold whitespace-nowrap" style={{ color: '#0891B2' }}>
                  {month}
                </h2>
                <div className="flex-1 h-px" style={{ backgroundColor: '#333333' }} />
                <span className="text-xs whitespace-nowrap" style={{ color: '#9E9E9E' }}>
                  {monthEvents.length}개
                </span>
              </div>

              {/* 카드 목록 */}
              <div className="space-y-3">
                {monthEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── 이벤트 제보 CTA ─────────────────────────────────── */}
        <div
          className="mt-14 rounded-2xl p-8 text-center"
          style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
        >
          <h3 className="font-bold text-white mb-2">이벤트를 알고 계신가요?</h3>
          <p className="text-sm mb-5" style={{ color: '#9E9E9E' }}>
            등록되지 않은 AgTech 이벤트를 제보해 주세요. 편집팀이 검토 후 등록합니다.
          </p>
          <Link
            href="mailto:editor@smartfarmnews.com"
            className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
          >
            이벤트 제보하기
          </Link>
        </div>
      </div>
    </div>
  );
}
