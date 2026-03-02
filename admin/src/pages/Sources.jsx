import { useState, useEffect } from 'react';
import { getSources, createSource, updateSource, toggleSource, deleteSource } from '../lib/api';

const EMPTY_FORM = { name: '', url: '', rss_url: '', category: '', language: 'en' };

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  function fetchSources() {
    setLoading(true);
    getSources()
      .then(({ data }) => setSources(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchSources();
  }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(s) {
    setForm({
      name: s.name ?? '',
      url: s.url ?? '',
      rss_url: s.rss_url ?? '',
      category: s.category ?? '',
      language: s.language ?? 'en',
    });
    setEditId(s.id);
    setShowForm(true);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await updateSource(editId, form);
      } else {
        await createSource(form);
      }
      setShowForm(false);
      fetchSources();
    } catch (err) {
      alert(err.response?.data?.error ?? '저장 실패');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id) {
    try {
      await toggleSource(id);
      fetchSources();
    } catch (err) {
      alert(err.response?.data?.error ?? '오류');
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`"${name}" 소스를 삭제하시겠습니까?`)) return;
    try {
      await deleteSource(id);
      fetchSources();
    } catch (err) {
      alert(err.response?.data?.error ?? '삭제 실패');
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">총 {sources.length}개 소스</p>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          + 소스 추가
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-green-300 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">{editId ? '소스 수정' : '새 소스 추가'}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">이름 *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">URL *</label>
                <input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  required
                  type="url"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">RSS URL</label>
                <input
                  name="rss_url"
                  value={form.rss_url}
                  onChange={handleChange}
                  type="url"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">카테고리</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="agtech, foodtech, ..."
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">언어</label>
                <select
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="en">English</option>
                  <option value="ko">한국어</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? '저장 중...' : '저장'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sources Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400">로딩 중...</div>
        ) : sources.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400">소스 없음</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">이름</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">카테고리</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">언어</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">RSS</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">상태</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-32">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sources.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-800 hover:text-green-600"
                    >
                      {s.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.category ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-500 uppercase">{s.language}</td>
                  <td className="px-4 py-3">
                    {s.rss_url ? (
                      <span className="text-green-600 text-xs">RSS</span>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(s.id)}
                      className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                        s.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {s.is_active ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
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
    </div>
  );
}
