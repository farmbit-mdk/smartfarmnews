import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles = {
  '/dashboard': '대시보드',
  '/articles': '기사 관리',
  '/market': '매물 / 문의 관리',
  '/agents': 'AI 에이전트',
  '/sources': 'RSS 소스 관리',
  '/subscribers': '구독자 관리',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const title =
    Object.entries(pageTitles).find(([path]) => pathname.startsWith(path))?.[1] ?? '';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
