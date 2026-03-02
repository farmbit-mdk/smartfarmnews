import { useState, useEffect } from 'react';
import { getDashboardStats } from '../lib/api';

export default function Subscribers() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📧 구독자 현황</h3>
        {loading ? (
          <p className="text-sm text-gray-400">로딩 중...</p>
        ) : (
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800">{stats?.subscribers ?? 0}</p>
              <p className="text-sm text-gray-500 mt-1">활성 구독자</p>
            </div>
            <div className="flex-1 text-sm text-gray-500 bg-gray-50 rounded p-4">
              <p>구독자 관리 API는 향후 업데이트에서 제공될 예정입니다.</p>
              <p className="mt-2">현재 통계는 대시보드의 집계 데이터를 표시합니다.</p>
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">뉴스레터 설정</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">구독 엔드포인트</span>
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">POST /api/subscribe</code>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">구독 해제</span>
            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">GET /api/unsubscribe?token=...</code>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">SMTP 설정</span>
            <span className="text-gray-400">.env SMTP_* 환경변수</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        <strong>Phase 2 예정:</strong> 구독자 목록 조회, 세그먼트 관리, 뉴스레터 발송 이력 기능이 추가될 예정입니다.
      </div>
    </div>
  );
}
