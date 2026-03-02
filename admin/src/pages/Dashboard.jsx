import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getDashboardRecent, getAgentStatus, getAgentCost } from '../lib/api';

function StatCard({ icon, label, value, sub, color = 'green' }) {
  const colors = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <span className={`text-2xl p-2 rounded-lg ${colors[color]}`}>{icon}</span>
      </div>
    </div>
  );
}

function AgentBadge({ status }) {
  const map = {
    success: 'bg-green-100 text-green-700',
    running: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [agentStatus, setAgentStatus] = useState([]);
  const [agentCost, setAgentCost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getDashboardRecent(), getAgentStatus(), getAgentCost()])
      .then(([s, r, a, c]) => {
        setStats(s.data);
        setRecent(r.data);
        setAgentStatus(a.data);
        setAgentCost(c.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📰"
          label="전체 기사"
          value={stats?.articles?.total ?? 0}
          sub={`발행 ${stats?.articles?.published ?? 0} / 초안 ${stats?.articles?.draft ?? 0}`}
          color="blue"
        />
        <StatCard
          icon="🚜"
          label="활성 매물"
          value={stats?.activeEquipment ?? 0}
          color="green"
        />
        <StatCard
          icon="📧"
          label="구독자"
          value={stats?.subscribers ?? 0}
          color="purple"
        />
        <StatCard
          icon="💰"
          label="이번달 AI 비용"
          value={`$${(stats?.monthlyAiCost ?? 0).toFixed(4)}`}
          sub="목표: $0.50/월"
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">🤖 에이전트 상태</h3>
          {agentStatus.length === 0 ? (
            <p className="text-sm text-gray-400">실행 기록 없음</p>
          ) : (
            <div className="space-y-3">
              {agentStatus.map((a) => (
                <div key={a.agent_name} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">{a.agent_name}</span>
                  <div className="flex items-center gap-3">
                    <AgentBadge status={a.status} />
                    <span className="text-gray-400 text-xs">
                      {new Date(a.executed_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Qwen Cost */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">💡 Qwen 비용 현황</h3>
          {agentCost ? (
            <div className="space-y-2 text-sm">
              {Object.entries(agentCost).map(([key, val]) => (
                <div key={key} className="flex justify-between text-gray-600">
                  <span>{key}</span>
                  <span className="font-medium">{typeof val === 'number' ? (key.includes('cost') ? `$${val.toFixed(4)}` : val.toLocaleString()) : String(val)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">데이터 없음</p>
          )}
        </div>
      </div>

      {/* Draft Articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">📝 검토 대기 기사</h3>
          <Link to="/articles?status=draft" className="text-sm text-green-600 hover:underline">
            전체 보기
          </Link>
        </div>
        {!recent?.draftArticles?.length ? (
          <p className="text-sm text-gray-400">검토 대기 기사 없음</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.draftArticles.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/articles/${a.id}`}
                    className="text-sm font-medium text-gray-800 hover:text-green-600 truncate block"
                  >
                    {a.title_ko}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {a.source_name} · {a.menu_type} ·{' '}
                    {new Date(a.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
                <Link
                  to={`/articles/${a.id}`}
                  className="ml-4 text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
                >
                  검토
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
