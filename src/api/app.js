/**
 * app.js
 * Express 애플리케이션 설정
 * - 미들웨어 (helmet, cors, morgan, json)
 * - Public API 라우트 마운트
 * - Admin API 라우트 마운트 (JWT 보호)
 * - 404 / 글로벌 에러 핸들러
 */

import express from 'express';
import helmet  from 'helmet';
import cors    from 'cors';
import morgan  from 'morgan';

import { config } from '../config/env.js';

// ── Public 라우트 ─────────────────────────────────────────────────
import articlesRouter    from './routes/articles.js';
import equipmentRouter   from './routes/equipment.js';
import eventsRouter      from './routes/events.js';
import subscribersRouter from './routes/subscribers.js';

// ── Admin 라우트 ──────────────────────────────────────────────────
import adminAuthRouter      from './routes/admin/auth.js';
import adminArticlesRouter  from './routes/admin/articles.js';
import adminEquipmentRouter from './routes/admin/equipment.js';
import adminAgentsRouter    from './routes/admin/agents.js';
import adminSourcesRouter   from './routes/admin/sources.js';
import adminDashboardRouter from './routes/admin/dashboard.js';

// ─────────────────────────────────────────────────────────────────

const app = express();

// ── 보안 헤더 ─────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────
app.use(cors({
  origin:      config.isProd ? ['https://smartfarmnews.com', 'https://admin.smartfarmnews.com'] : '*',
  credentials: true,
}));

// ── 요청 파싱 ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── 요청 로깅 ─────────────────────────────────────────────────────
app.use(morgan(config.isProd ? 'combined' : 'dev'));

// ── Health check ──────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Public API ────────────────────────────────────────────────────
// GET /api/articles, GET /api/articles/:id, POST /api/articles/:id/view
app.use('/api/articles',  articlesRouter);

// GET /api/equipment, GET /api/equipment/:id, GET /api/equipment/auctions
// GET /api/equipment/price-stats, POST /api/equipment/:id/inquiry, POST /api/equipment/alerts
app.use('/api/equipment', equipmentRouter);

// GET /api/events, GET /api/events/:id
app.use('/api/events',    eventsRouter);

// POST /api/subscribe, DELETE /api/subscribe/:email
app.use('/api/subscribe', subscribersRouter);

// ── Admin API (JWT 인증은 각 라우터 내부에서 adminAuth 미들웨어 적용) ──
app.use('/api/admin/auth',      adminAuthRouter);      // POST /login, /refresh, /logout
app.use('/api/admin/articles',  adminArticlesRouter);  // CRUD + publish/archive
app.use('/api/admin/equipment', adminEquipmentRouter); // 매물 관리 + 문의 처리
app.use('/api/admin/agents',    adminAgentsRouter);    // Agent 모니터링 + Qwen 비용
app.use('/api/admin/sources',   adminSourcesRouter);   // RSS 소스 관리
app.use('/api/admin/dashboard', adminDashboardRouter); // 통계 + 최근 기사

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// ── 글로벌 에러 핸들러 ────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const status  = err.status ?? err.statusCode ?? 500;
  // 500 에러는 프로덕션에서 상세 메시지 숨김
  const message = (config.isProd && status >= 500) ? 'Internal Server Error' : err.message;

  if (status >= 500) {
    console.error('[Error]', err);
  }

  res.status(status).json({ error: message });
});

export default app;
