import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', icon: '📊', label: '대시보드' },
  { to: '/articles', icon: '📰', label: '기사 관리' },
  { to: '/market', icon: '🚜', label: '매물 관리' },
  { to: '/agents', icon: '🤖', label: 'AI 에이전트' },
  { to: '/sources', icon: '📡', label: '소스 관리' },
  { to: '/subscribers', icon: '📧', label: '구독자' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-4 py-5 border-b border-gray-700">
        <h1 className="text-sm font-bold text-green-400">SmartFarmNews</h1>
        <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-green-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-gray-700 text-xs text-gray-500">
        AI Cost &lt; $0.50/mo target
      </div>
    </aside>
  );
}
