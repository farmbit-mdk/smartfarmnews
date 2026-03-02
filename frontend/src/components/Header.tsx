'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Logo from './Logo';

const NAV_ITEMS = [
  { href: '/news',     label: '뉴스'      },
  { href: '/insights', label: '인사이트'  },
  { href: '/market',   label: '마켓'      },
  { href: '/events',   label: '이벤트'    },
];

type Lang = 'KO' | 'EN';

export default function Header() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Lang>('KO');
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleLang() {
    setLang((prev) => (prev === 'KO' ? 'EN' : 'KO'));
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #333333' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* 좌: 로고 */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="md" showWordmark />
          </Link>

          {/* 중: 데스크톱 내비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative text-sm font-medium transition-colors duration-200 pb-0.5"
                  style={{ color: isActive ? '#22D3EE' : '#9E9E9E' }}
                >
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                      style={{ backgroundColor: '#22D3EE' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 우: 언어 토글 + 구독 + 햄버거 */}
          <div className="flex items-center gap-3">
            {/* EN|KO 토글 */}
            <button
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-0 rounded-full text-xs font-semibold overflow-hidden"
              style={{ border: '1px solid #333333' }}
              aria-label="언어 전환"
            >
              {(['KO', 'EN'] as Lang[]).map((l) => (
                <span
                  key={l}
                  className="px-2.5 py-1 transition-colors duration-150"
                  style={{
                    backgroundColor: lang === l ? '#0891B2' : 'transparent',
                    color:           lang === l ? '#FFFFFF' : '#9E9E9E',
                  }}
                >
                  {l}
                </span>
              ))}
            </button>

            {/* 구독 버튼 (Amber pill) */}
            <Link
              href="/subscribe"
              className="hidden sm:inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
            >
              구독하기
            </Link>

            {/* 햄버거 (모바일) */}
            <button
              className="md:hidden p-2 rounded"
              style={{ color: '#9E9E9E' }}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="메뉴 열기"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{ backgroundColor: '#242424', borderTop: '1px solid #333333' }}
        >
          <nav className="flex flex-col py-2">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 text-sm font-medium"
                  style={{ color: isActive ? '#22D3EE' : '#9E9E9E' }}
                >
                  {label}
                </Link>
              );
            })}
            <div className="flex items-center gap-3 px-6 py-3 border-t" style={{ borderColor: '#333333' }}>
              <button
                onClick={toggleLang}
                className="flex items-center gap-0 rounded-full text-xs font-semibold overflow-hidden"
                style={{ border: '1px solid #333333' }}
              >
                {(['KO', 'EN'] as Lang[]).map((l) => (
                  <span
                    key={l}
                    className="px-2.5 py-1"
                    style={{
                      backgroundColor: lang === l ? '#0891B2' : 'transparent',
                      color:           lang === l ? '#FFFFFF' : '#9E9E9E',
                    }}
                  >
                    {l}
                  </span>
                ))}
              </button>
              <Link
                href="/subscribe"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold"
                style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
              >
                구독하기
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
