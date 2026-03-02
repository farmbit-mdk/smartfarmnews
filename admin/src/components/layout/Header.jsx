import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../lib/auth';
import { logout } from '../../lib/api';

export default function Header({ title }) {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // ignore
    }
    removeToken();
    navigate('/login');
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{today}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
