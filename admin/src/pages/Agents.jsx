import { useState, useEffect, useCallback } from 'react';
import { getAgentStatus, getAgentLogs, getAgentCost, getQwenStats, runAgent } from '../lib/api';

const AGENT_NAMES = ['news', 'insights', 'market', 'events'];

function StatusBadge({ status }) {
  const map = {
    success: 'bg-green-100 text-green-700',
    running: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
    partial: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

export default function Agents() {
  const [agentStatus, setAgentStatus] = useState([]);
  const [logs, setLogs] = useState([]);
  const [cost, setCost] = useState(null);
  const [qwenStats, setQwenStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState(null);
  const [runMessage, setRunMessage] = useState('');

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([getAgentStatus(), getAgentLogs({ limit: 30 }), getAgentCost(), getQwenStats()])
      .then(([s, l, c, q]) => {
        setAgentStatus(s.data);
        setLogs(l.data);
        setCost(c.data);
        setQwenStats(q.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleRun(name) {
    if (name !== 'news') {
      setRunMessage(`"${name}" 에이전트는 Phase 2에서 활성화됩니다.`);
      setTimeout(() => setRunMessage(''), 3000);
      return;
    }
    setRunningAgent(name);
    setRunMessage('');
    try {
      const { data } = await runAgent(name);
      setRunMessage(data.message);
      setTimeout(() => fetchAll(), 2000);
    } catch (err) {
      setRunMessage(err.response?.data?.error ?? '실행 실패');
    } finally {
      setRunningAgent(null);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {runMessage && (
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-sm">{runMessage}</div>
      )}

      {/* Agent Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {AGENT_NAMES.map((name) => {
          const s = agentStatus.find((a) => a.agent_name === name);
          return (
            <div key={name} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 capitalize">{name} Agent</h4>
                {s ? <StatusBadge status={s.status} /> : <span className="text-xs text-gray-400">미실행</span>}
              </div>
              {s && (
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>생성: {s.items_created ?? 0}건</p>
                  <p>비용: ${(s.cost_usd ?? 0).toFixed(4)}</p>
                  <p>{new Date(s.executed_at).toLocaleString('ko-KR')}</p>
                </div>
              )}
              <button
                onClick={() => handleRun(name)}
                disabled={runningAgent === name}
                className="w-full py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {runningAgent === name ? '실행 중...' : '수동 실행'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cost */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">💰 이번달 Qwen 비용</h3>
          {cost ? (
            <div className="space-y-2 text-sm">
              {Object.entries(cost).map(([key, val]) => (
                <div key={key} className="flex justify-between text-gray-600">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium">
                    {typeof val === 'number'
                      ? key.toLowerCase().includes('cost')
                        ? `$${val.toFixed(4)}`
                        : val.toLocaleString()
                      : String(val)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">데이터 없음</p>
          )}
        </div>

        {/* Qwen Daily Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">📊 오늘 모델별 사용량</h3>
          {qwenStats?.byModel?.length ? (
            <div className="space-y-3">
              {qwenStats.byModel.map((m) => (
                <div key={m.model} className="text-sm">
                  <div className="flex justify-between text-gray-700 font-medium">
                    <span className="truncate max-w-xs">{m.model}</span>
                    <span>${(m.cost_usd ?? 0).toFixed(4)}</span>
                  </div>
                  <p className="text-xs text-gray-400">{m.requests}건 · {(m.tokens ?? 0).toLocaleString()} tokens</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">오늘 사용 기록 없음</p>
          )}
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">📋 실행 로그</h3>
          <button onClick={fetchAll} className="text-xs text-green-600 hover:underline">
            새로고침
          </button>
        </div>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-400">로그 없음</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-200">
                <tr className="text-left">
                  <th className="py-2 pr-4 font-medium text-gray-600">에이전트</th>
                  <th className="py-2 pr-4 font-medium text-gray-600">작업</th>
                  <th className="py-2 pr-4 font-medium text-gray-600">모델</th>
                  <th className="py-2 pr-4 font-medium text-gray-600">상태</th>
                  <th className="py-2 pr-4 font-medium text-gray-600">생성</th>
                  <th className="py-2 pr-4 font-medium text-gray-600">비용</th>
                  <th className="py-2 font-medium text-gray-600">시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((l, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 text-gray-700 capitalize">{l.agent_name}</td>
                    <td className="py-2 pr-4 text-gray-500">{l.task_type}</td>
                    <td className="py-2 pr-4 text-gray-400 truncate max-w-[120px]">{l.model}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="py-2 pr-4 text-gray-500">{l.items_created ?? 0}</td>
                    <td className="py-2 pr-4 text-gray-500">${(l.cost_usd ?? 0).toFixed(4)}</td>
                    <td className="py-2 text-gray-400">
                      {new Date(l.executed_at).toLocaleString('ko-KR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
