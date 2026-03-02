'use client';

import { useState } from 'react';
import Link from 'next/link';

// ── Mock 데이터 ───────────────────────────────────────────────────
type Condition = '상' | '중' | '하';
type EquipStatus = 'active' | 'sold';

interface Equipment {
  id: number;
  titleKo: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  condition: Condition;
  priceKrw: number;
  location: string;
  source: string;
  status: EquipStatus;
  isAuction: boolean;
}

const EQUIPMENT: Equipment[] = [
  { id: 1, titleKo: '존디어 9RX 600 트랙터',          category: '트랙터',   brand: 'John Deere', model: '9RX 600',    year: 2021, condition: '상', priceKrw: 250_000_000, location: '전남 나주',   source: 'private', status: 'active', isAuction: false },
  { id: 2, titleKo: 'DJI Agras T40 농업용 드론',       category: '드론',     brand: 'DJI',        model: 'Agras T40',  year: 2023, condition: '상', priceKrw:   8_500_000, location: '경기 화성',   source: 'private', status: 'active', isAuction: false },
  { id: 3, titleKo: '이세키 승용 이앙기 6조식',         category: '이앙기',   brand: '이세키',      model: 'VP-6',       year: 2019, condition: '중', priceKrw:  12_000_000, location: '충남 당진',   source: 'onbid',   status: 'active', isAuction: true  },
  { id: 4, titleKo: '구보타 콤바인 4조식',              category: '콤바인',   brand: '구보타',      model: 'ER-4',       year: 2018, condition: '중', priceKrw:  35_000_000, location: '전북 익산',   source: 'onbid',   status: 'active', isAuction: true  },
  { id: 5, titleKo: '대동 트랙터 50마력',               category: '트랙터',   brand: '대동',        model: 'DK504',      year: 2020, condition: '중', priceKrw:  45_000_000, location: '경북 안동',   source: 'direct',  status: 'active', isAuction: false },
  { id: 6, titleKo: '스마트팜 온실 제어 시스템 세트',   category: '스마트팜', brand: '그린랩스',    model: 'GreenTouch', year: 2022, condition: '상', priceKrw:  22_000_000, location: '경남 진주',   source: 'direct',  status: 'active', isAuction: false },
  { id: 7, titleKo: '얀마 승용 이앙기 2조식',           category: '이앙기',   brand: '얀마',        model: 'RR-2',       year: 2017, condition: '하', priceKrw:   2_500_000, location: '강원 철원',   source: 'private', status: 'active', isAuction: false },
  { id: 8, titleKo: '로보틱스 수확 로봇 (딸기 전용)',   category: '스마트팜', brand: 'Advanced Farm', model: 'T3',      year: 2023, condition: '상', priceKrw: 180_000_000, location: '충북 청주',   source: 'direct',  status: 'sold',   isAuction: false },
];

const CONDITION_STYLE: Record<Condition, { label: string; bg: string; color: string }> = {
  상: { label: '상태 상', bg: '#4ADE8022', color: '#4ADE80' },
  중: { label: '상태 중', bg: '#F59E0B22', color: '#F59E0B' },
  하: { label: '상태 하', bg: '#EF444422', color: '#EF4444' },
};

const SOURCE_LABEL: Record<string, string> = {
  onbid: '온비드',
  private: '개인',
  direct: '직거래',
};

function formatKrw(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(0)}억원`;
  if (n >= 10_000)      return `${(n / 10_000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

function EquipmentCard({ eq }: { eq: Equipment }) {
  const cond = CONDITION_STYLE[eq.condition];
  const isSold = eq.status === 'sold';

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
      style={{ backgroundColor: '#242424', border: '1px solid #333333', opacity: isSold ? 0.65 : 1 }}
    >
      {/* 이미지 플레이스홀더 */}
      <div
        className="h-40 flex items-center justify-center relative"
        style={{ background: 'linear-gradient(135deg, #1E2D3D 0%, #1A3A2D 100%)' }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="4" y="28" width="40" height="12" rx="3" fill="#0891B233" stroke="#0891B2" strokeWidth="1.5" />
          <circle cx="12" cy="40" r="5" fill="#0891B244" stroke="#0891B2" strokeWidth="1.5" />
          <circle cx="36" cy="40" r="5" fill="#0891B244" stroke="#0891B2" strokeWidth="1.5" />
          <rect x="12" y="18" width="22" height="14" rx="2" fill="#4ADE8033" stroke="#4ADE80" strokeWidth="1.5" />
          <line x1="44" y1="28" x2="44" y2="36" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* 배지들 */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {eq.isAuction && (
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
            >
              공매
            </span>
          )}
          {isSold && (
            <span
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ backgroundColor: '#EF4444', color: '#FFF' }}
            >
              판매완료
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#1A1A1A88', color: '#9E9E9E' }}>
            {SOURCE_LABEL[eq.source]}
          </span>
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs mb-1" style={{ color: '#0891B2' }}>{eq.category}</p>
            <h3 className="font-semibold text-white leading-snug">{eq.titleKo}</h3>
            <p className="text-xs mt-0.5" style={{ color: '#9E9E9E' }}>
              {eq.brand} {eq.model} · {eq.year}년식
            </p>
          </div>
          <span
            className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold"
            style={{ backgroundColor: cond.bg, color: cond.color }}
          >
            {eq.condition}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold" style={{ color: '#22D3EE' }}>
              {formatKrw(eq.priceKrw)}
            </p>
            <p className="text-xs" style={{ color: '#9E9E9E' }}>📍 {eq.location}</p>
          </div>
          {!isSold && (
            <Link
              href={`/market/${eq.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#0891B222', color: '#22D3EE', border: '1px solid #0891B255' }}
            >
              자세히 보기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function InquiryTab() {
  return (
    <div className="max-w-xl space-y-6">
      {/* 설명 */}
      <div
        className="rounded-xl p-5"
        style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
      >
        <h3 className="font-semibold text-white mb-2">매물 등록 · 거래 문의</h3>
        <p className="text-sm leading-relaxed" style={{ color: '#9E9E9E' }}>
          판매하실 농기계가 있거나, 특정 기종 구매를 원하시면 문의해 주세요.
          전문 상담원이 24시간 내에 답변드립니다.
        </p>
      </div>

      {/* 폼 */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
      >
        <h3 className="font-semibold text-white">문의하기</h3>
        <div className="space-y-3">
          {[
            { label: '이름', type: 'text',  placeholder: '홍길동' },
            { label: '연락처', type: 'tel', placeholder: '010-0000-0000' },
            { label: '이메일', type: 'email', placeholder: 'name@example.com' },
          ].map(({ label, type, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-medium mb-1" style={{ color: '#9E9E9E' }}>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF' }}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#9E9E9E' }}>문의 내용</label>
            <textarea
              rows={4}
              placeholder="판매 희망 기종, 상태, 가격 또는 구매 희망 조건을 작성해 주세요."
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #333333', color: '#FFFFFF' }}
            />
          </div>
        </div>
        <button
          className="w-full py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
        >
          문의 전송
        </button>
      </div>
    </div>
  );
}

type TabKey = 'list' | 'inquiry';

export default function MarketPage() {
  const [tab, setTab] = useState<TabKey>('list');

  const activeEquipment = EQUIPMENT.filter((e) => e.status === 'active');
  const soldEquipment   = EQUIPMENT.filter((e) => e.status === 'sold');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* ── 페이지 헤더 ────────────────────────────────────── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">농기계 마켓</h1>
            <p className="text-sm" style={{ color: '#9E9E9E' }}>
              중고 농기계 직거래 플랫폼 · 온비드 공매 연동
            </p>
          </div>
          <button
            onClick={() => setTab('inquiry')}
            className="self-start sm:self-auto inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
          >
            + 매물 등록 문의
          </button>
        </div>

        {/* ── 탭 ──────────────────────────────────────────────── */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit mb-8"
          style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
        >
          {([
            { key: 'list',    label: `매물 목록 (${activeEquipment.length})` },
            { key: 'inquiry', label: '문의하기' },
          ] as { key: TabKey; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: tab === key ? '#0891B2' : 'transparent',
                color:           tab === key ? '#FFFFFF'  : '#9E9E9E',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── 탭 콘텐츠 ───────────────────────────────────────── */}
        {tab === 'list' ? (
          <>
            {/* 통계 요약 */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: '활성 매물',   value: activeEquipment.length   },
                { label: '온비드 공매', value: EQUIPMENT.filter((e) => e.isAuction && e.status === 'active').length },
                { label: '판매 완료',   value: soldEquipment.length     },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: '#242424', border: '1px solid #333333' }}
                >
                  <p className="text-2xl font-bold" style={{ color: '#22D3EE' }}>{value}</p>
                  <p className="text-xs mt-1" style={{ color: '#9E9E9E' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* 매물 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {EQUIPMENT.map((eq) => (
                <EquipmentCard key={eq.id} eq={eq} />
              ))}
            </div>
          </>
        ) : (
          <InquiryTab />
        )}
      </div>
    </div>
  );
}
