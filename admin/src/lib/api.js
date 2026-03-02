import axios from 'axios';
import { getToken, removeToken } from './auth';

const api = axios.create({
  baseURL: '/api/admin',
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: JWT 자동 주입
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 → /login 리다이렉트
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

// ── Auth ─────────────────────────────────────────────────────────
export const login = (email, password) =>
  axios.post('/api/admin/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

// ── Dashboard ─────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getDashboardRecent = () => api.get('/dashboard/recent');

// ── Articles ─────────────────────────────────────────────────────
export const getArticles = (params) => api.get('/articles', { params });
export const getArticle = (id) => api.get(`/articles/${id}`);
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data);
export const publishArticle = (id) => api.patch(`/articles/${id}/publish`);
export const archiveArticle = (id) => api.patch(`/articles/${id}/archive`);
export const deleteArticle = (id) => api.delete(`/articles/${id}`);

// ── Equipment ─────────────────────────────────────────────────────
export const getEquipment = (params) => api.get('/equipment', { params });
export const updateEquipment = (id, data) => api.put(`/equipment/${id}`, data);
export const updateEquipmentStatus = (id, status) =>
  api.patch(`/equipment/${id}/status`, { status });
export const getInquiries = (params) => api.get('/equipment/inquiries', { params });
export const updateInquiryStatus = (id, status) =>
  api.patch(`/equipment/inquiries/${id}`, { status });

// ── Agents ───────────────────────────────────────────────────────
export const getAgentStatus = () => api.get('/agents/status');
export const getAgentLogs = (params) => api.get('/agents/logs', { params });
export const getAgentCost = () => api.get('/agents/cost');
export const getQwenStats = () => api.get('/agents/qwen-stats');
export const runAgent = (name) => api.post(`/agents/${name}/run`);

// ── Sources ──────────────────────────────────────────────────────
export const getSources = () => api.get('/sources');
export const createSource = (data) => api.post('/sources', data);
export const updateSource = (id, data) => api.put(`/sources/${id}`, data);
export const toggleSource = (id) => api.patch(`/sources/${id}/toggle`);
export const deleteSource = (id) => api.delete(`/sources/${id}`);

export default api;
