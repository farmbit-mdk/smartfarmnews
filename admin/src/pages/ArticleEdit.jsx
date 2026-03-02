import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticle, updateArticle, publishArticle } from '../lib/api';

export default function ArticleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getArticle(id)
      .then(({ data }) => {
        setArticle(data);
        setForm({
          title_ko: data.title_ko ?? '',
          title_en: data.title_en ?? '',
          content_ko: data.content_ko ?? '',
          content_en: data.content_en ?? '',
          summary: data.summary ?? '',
          commentary: data.commentary ?? '',
          seo_title: data.seo_title ?? '',
          seo_description: data.seo_description ?? '',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await updateArticle(id, form);
      setMessage('저장되었습니다.');
    } catch (err) {
      setMessage(err.response?.data?.error ?? '저장 실패');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!confirm('기사를 발행하시겠습니까?')) return;
    setPublishing(true);
    setMessage('');
    try {
      await updateArticle(id, form);
      await publishArticle(id);
      setMessage('발행되었습니다.');
      setArticle((prev) => ({ ...prev, status: 'published' }));
    } catch (err) {
      setMessage(err.response?.data?.error ?? '발행 실패');
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">로딩 중...</div>;
  }

  if (!article) {
    return <div className="text-center text-gray-500 mt-10">기사를 찾을 수 없습니다.</div>;
  }

  const isPublished = article.status === 'published';

  return (
    <div className="max-w-4xl space-y-6">
      {/* Status Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">상태:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {isPublished ? '발행됨' : '초안'}
          </span>
          {article.source_name && (
            <span className="text-sm text-gray-400">출처: {article.source_name}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/articles')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          >
            목록으로
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
          {!isPublished && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {publishing ? '발행 중...' : '발행'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`px-4 py-2 rounded text-sm ${message.includes('실패') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목 (한국어)</label>
            <input
              name="title_ko"
              value={form.title_ko}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목 (영어)</label>
            <input
              name="title_en"
              value={form.title_en}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">요약</label>
          <textarea
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">AI 해설</label>
          <textarea
            name="commentary"
            value={form.commentary}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">본문 (한국어)</label>
          <textarea
            name="content_ko"
            value={form.content_ko}
            onChange={handleChange}
            rows={10}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">본문 (영어)</label>
          <textarea
            name="content_en"
            value={form.content_en}
            onChange={handleChange}
            rows={10}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 제목</label>
            <input
              name="seo_title"
              value={form.seo_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SEO 설명</label>
            <input
              name="seo_description"
              value={form.seo_description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
