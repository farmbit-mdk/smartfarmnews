import { useState, useEffect, useCallback } from 'react';
import { getEquipment, updateEquipmentStatus, getInquiries, updateInquiryStatus } from '../lib/api';

const TABS = ['equipment', 'inquiries'];
const TAB_LABELS = { equipment: '매물 목록', inquiries: '문의 관리' };

const EQUIP_STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  sold: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
};

const INQUIRY_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-600',
};

export default function Market() {
  const [tab, setTab] = useState('equipment');
  const [equipment, setEquipment] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    if (tab === 'equipment') {
      getEquipment({ limit: 50 })
        .then(({ data }) => setEquipment(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      getInquiries({ limit: 50 })
        .then(({ data }) => setInquiries(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [tab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleEquipmentStatus(id, status) {
    try {
      await updateEquipmentStatus(id, status);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error ?? '오류');
    }
  }

  async function handleInquiryStatus(id, status) {
    try {
      await updateInquiryStatus(id, status);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error ?? '오류');
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              tab === t ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Equipment Table */}
      {tab === 'equipment' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>
          ) : equipment.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">매물 없음</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">제목</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">카테고리</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">가격</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">출처</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">상태</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-32">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {equipment.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 line-clamp-1">{e.title_ko}</p>
                      <p className="text-xs text-gray-400">{e.brand} {e.model} {e.year && `(${e.year})`}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{e.category}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {e.price_krw ? `${e.price_krw.toLocaleString()}원` : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{e.source}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${EQUIP_STATUS_COLORS[e.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => handleEquipmentStatus(e.id, ev.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none"
                      >
                        <option value="active">active</option>
                        <option value="pending">pending</option>
                        <option value="sold">sold</option>
                        <option value="inactive">inactive</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Inquiries Table */}
      {tab === 'inquiries' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>
          ) : inquiries.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400">문의 없음</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">매물</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">연락처</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">메시지</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">상태</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">날짜</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-32">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((i) => (
                  <tr key={i.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 line-clamp-1">{i.equipment_title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{i.name}</p>
                      <p className="text-xs text-gray-400">{i.phone ?? i.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <p className="line-clamp-2">{i.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${INQUIRY_STATUS_COLORS[i.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {i.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(i.created_at).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={i.status}
                        onChange={(ev) => handleInquiryStatus(i.id, ev.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none"
                      >
                        <option value="pending">pending</option>
                        <option value="contacted">contacted</option>
                        <option value="closed">closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
