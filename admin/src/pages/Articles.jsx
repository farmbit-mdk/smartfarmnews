import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getArticles, publishArticle, archiveArticle, deleteArticle } from '../lib/api';

const STATUS_LABELS = { draft: '초안', published: '발행', archived: '보관' };
const STATUS_COLORS = {
  draft: 'bg-yellow-100 text-yellow-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-gray-100 text-gray-600',
};

export default function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const status = searchParams.get('status') ?? '';
  const page = Number(searchParams.get('page') ?? 1);

  const fetchArticles = useCallback(() => {
    setLoading(true);
    getArticles({ status: status || undefined, page, limit: 20 })
      .then(({ data }) => {
        setArticles(data.data);
        setTotal(data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status, page]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }

  async function handleAction(id, action) {
    setActionLoading(id + action);
    try {
      if (action === 'publish') await publishArticle(id);
      else if (action === 'archive') await archiveArticle(id);
      else if (action === 'delete') {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await deleteArticle(id);
      }
      fetchArticles();
    } catch (err) {
      alert(err.response?.data?.error ?? '오류가 발생했습니다.');
    } finally {
      setActionLoading(null);
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">상태 필터:</span>
        {['', 'draft', 'published', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter('status', s)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              status === s
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s ? STATUS_LABELS[s] : '전체'}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">총 {total}건</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>
        ) : articles.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400">기사 없음</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">제목</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">타입</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">상태</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">날짜</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-40">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/articles/${a.id}`}
                      className="font-medium text-gray-800 hover:text-green-600 line-clamp-1"
                    >
                      {a.title_ko}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{a.source_name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{a.menu_type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[a.status]}`}>
                      {STATUS_LABELS[a.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(a.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/articles/${a.id}`}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        편집
                      </Link>
                      {a.status === 'draft' && (
                        <button
                          onClick={() => handleAction(a.id, 'publish')}
                          disabled={actionLoading === a.id + 'publish'}
                          className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 disabled:opacity-50"
                        >
                          발행
                        </button>
                      )}
                      {a.status === 'published' && (
                        <button
                          onClick={() => handleAction(a.id, 'archive')}
                          disabled={actionLoading === a.id + 'archive'}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                        >
                          보관
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(a.id, 'delete')}
                        disabled={actionLoading === a.id + 'delete'}
                        className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilter('page', p)}
              className={`w-8 h-8 rounded text-sm ${
                page === p ? 'bg-green-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
