/**
 * Admin Dashboard API (JWT 필요)
 * GET /api/admin/dashboard/stats   주요 집계 (기사수, 매물수, 구독자, 조회수)
 * GET /api/admin/dashboard/recent  검토 대기 기사 + 최근 Agent 실행
 */

import { Router } from 'express';
import { query }  from '../../../config/database.js';
import { adminAuth } from '../../middleware/adminAuth.js';

const router = Router();
router.use(adminAuth);

// ── 주요 통계 ─────────────────────────────────────────────────────
router.get('/stats', async (req, res, next) => {
  try {
    const [articles, equipment, subscribers, views, agentCost] = await Promise.all([
      // 기사 수 (status별)
      query(`SELECT status, COUNT(*)::int AS count FROM articles GROUP BY status`),

      // 매물 수
      query(`SELECT COUNT(*)::int AS total FROM equipment WHERE status = 'active'`),

      // 구독자 수
      query(`SELECT COUNT(*)::int AS total FROM subscribers WHERE is_active = true`),

      // 오늘 누적 조회수
      query(`SELECT COALESCE(SUM(view_count),0)::int AS total FROM articles WHERE status='published'`),

      // 이번 달 AI 비용
      query(`
        SELECT COALESCE(SUM(cost_usd),0)::float AS total_cost
        FROM   agent_logs
        WHERE  executed_at >= date_trunc('month', NOW())
      `),
    ]);

    // articles 상태별 맵핑
    const articleStats = Object.fromEntries(articles.rows.map((r) => [r.status, r.count]));

    res.json({
      articles:      { ...articleStats, total: Object.values(articleStats).reduce((a, b) => a + b, 0) },
      activeEquipment: equipment.rows[0].total,
      subscribers:     subscribers.rows[0].total,
      totalViews:      views.rows[0].total,
      monthlyAiCost:   agentCost.rows[0].total_cost,
    });
  } catch (err) {
    next(err);
  }
});

// ── 검토 대기 기사 + 최근 Agent 실행 ─────────────────────────────
router.get('/recent', async (req, res, next) => {
  try {
    const [draftArticles, agentLogs] = await Promise.all([
      // draft 기사 최근 10건
      query(`
        SELECT id, slug, title_ko, source_name, menu_type, created_at
        FROM   articles
        WHERE  status = 'draft'
        ORDER  BY created_at DESC
        LIMIT  10
      `),

      // Agent 최근 실행 20건
      query(`
        SELECT agent_name, task_type, model, status,
               items_created, cost_usd, duration_ms, executed_at
        FROM   agent_logs
        ORDER  BY executed_at DESC
        LIMIT  20
      `),
    ]);

    res.json({
      draftArticles: draftArticles.rows,
      agentLogs:     agentLogs.rows,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
