import type { Metadata } from 'next';
import './globals.css';
import Header from '@/src/components/Header';

export const metadata: Metadata = {
  title: {
    default:  'SmartFarmNews - Asia\'s AgTech Intelligence Platform',
    template: '%s | SmartFarmNews',
  },
  description:
    '아시아 농업기술(AgTech)·푸드테크 미디어. AI가 매일 30~50개 뉴스를 큐레이션합니다. ' +
    'Asia\'s leading AgTech & FoodTech media platform, powered by AI.',
  keywords: ['AgTech', 'FoodTech', 'SmartFarm', '스마트팜', 'SEA', 'Korea', 'Agriculture'],
  openGraph: {
    type:        'website',
    siteName:    'SmartFarmNews',
    title:       'SmartFarmNews - Asia\'s AgTech Intelligence Platform',
    description: 'AI-curated AgTech & FoodTech news for Asia',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="min-h-screen antialiased" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
        <Header />
        <main>{children}</main>

        {/* 푸터 */}
        <footer
          className="mt-20 border-t"
          style={{ borderColor: '#333333', backgroundColor: '#242424' }}
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2 md:col-span-1">
                <p className="font-bold text-lg mb-2">
                  <span className="text-white">Smart</span>
                  <span style={{ color: '#0891B2' }}>Farm</span>
                  <span className="text-white">News</span>
                </p>
                <p className="text-xs leading-relaxed" style={{ color: '#9E9E9E' }}>
                  Asia&apos;s AgTech Intelligence Platform<br />
                  AI 기반 농업기술 미디어
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9E9E9E' }}>콘텐츠</p>
                <ul className="space-y-2 text-sm" style={{ color: '#9E9E9E' }}>
                  <li><a href="/news" className="hover:text-white transition-colors">뉴스</a></li>
                  <li><a href="/insights" className="hover:text-white transition-colors">인사이트</a></li>
                  <li><a href="/market" className="hover:text-white transition-colors">마켓</a></li>
                  <li><a href="/events" className="hover:text-white transition-colors">이벤트</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9E9E9E' }}>지역</p>
                <ul className="space-y-2 text-sm" style={{ color: '#9E9E9E' }}>
                  <li><a href="/news?region=korea" className="hover:text-white transition-colors">한국</a></li>
                  <li><a href="/news?region=sea" className="hover:text-white transition-colors">동남아</a></li>
                  <li><a href="/news?region=global" className="hover:text-white transition-colors">글로벌</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9E9E9E' }}>뉴스레터</p>
                <p className="text-sm mb-3" style={{ color: '#9E9E9E' }}>매일 아침 AgTech 브리핑</p>
                <a
                  href="/subscribe"
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{ backgroundColor: '#F59E0B', color: '#1A1A1A' }}
                >
                  구독하기
                </a>
              </div>
            </div>
            <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: '#333333' }}>
              <p className="text-xs" style={{ color: '#9E9E9E' }}>
                © 2025 SmartFarmNews. All rights reserved.
              </p>
              <p className="text-xs" style={{ color: '#9E9E9E' }}>
                AI Cost: {'<'}$0.50/month · Powered by Qwen
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
