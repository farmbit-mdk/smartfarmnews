/**
 * Admin Agents API (JWT 필요)
 * GET  /api/admin/agents/status      Agent 실행 최근 상태
 * GET  /api/admin/agents/logs        실행 로그 목록
 * GET  /api/admin/agents/cost        이번 달 Qwen 비용 집계
 * GET  /api/admin/agents/qwen-stats  오늘 모델별 req 현황
 * POST /api/admin/agents/:name/run   Agent 수동 실행
 */

import { Router } from 'express';

import { query }              from '../../../config/database.js';
import { adminAuth }          from '../../middleware/adminAuth.js';
import { getMonthlyStats, getDailyStats } from '../../../utils/qwenCostTracker.js';
import { runNewsAgent }       from '../../../agents/newsAgent.js';

const router = Router();
router.use(adminAuth);

// ── Agent 최근 실행 상태 ──────────────────────────────────────────
router.get('/status', async (req, res, next) => {
  try {
    // 각 Agent의 가장 최근 실행 1건씩
    const { rows } = await query(`
      SELECT DISTINCT ON (agent_name)
        agent_name, status, items_created, cost_usd, duration_ms, executed_at
      FROM   agent_logs
      ORDER  BY agent_name, executed_at DESC
    `);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── 실행 로그 목록 ────────────────────────────────────────────────
router.get('/logs', async (req, res, next) => {
  try {
    const { agent_name, status, page = 1, limit = 50 } = req.query;
    const conditions = [];
    const params     = [];

    if (agent_name) {
      params.push(agent_name);
      conditions.push(`agent_name = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);

    const { rows } = await query(
      `SELECT * FROM agent_logs
       ${where}
       ORDER BY executed_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── 이번 달 Qwen 비용 집계 ────────────────────────────────────────
router.get('/cost', async (req, res, next) => {
  try {
    const stats = await getMonthlyStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

// ── 오늘 Qwen 사용량 현황 ─────────────────────────────────────────
router.get('/qwen-stats', async (req, res, next) => {
  try {
    const daily = await getDailyStats();

    // 모델별 분류
    const { rows: byModel } = await query(`
      SELECT model,
             COUNT(*)::int        AS requests,
             SUM(tokens_used)::int AS tokens,
             SUM(cost_usd)::float  AS cost_usd
      FROM   agent_logs
      WHERE  executed_at >= date_trunc('day', NOW())
        AND  status = 'success'
      GROUP  BY model
      ORDER  BY cost_usd DESC
    `);

    res.json({ daily, byModel });
  } catch (err) {
    next(err);
  }
});

// ── Agent 수동 실행 ───────────────────────────────────────────────
router.post('/:name/run', async (req, res, next) => {
  try {
    const { name } = req.params;

    const agents = {
      news: runNewsAgent,
      // insights, market, events: Phase 2에서 추가
    };

    const agentFn = agents[name];
    if (!agentFn) {
      return res.status(404).json({ error: `Agent "${name}" not found`, available: Object.keys(agents) });
    }

    // 비동기 실행 (응답은 즉시 반환, 결과는 agent_logs에서 확인)
    agentFn().catch((err) => console.error(`[Admin] Manual run failed for ${name}:`, err.message));

    res.json({ ok: true, message: `Agent "${name}" started. Check /agents/logs for results.` });
  } catch (err) {
    next(err);
  }
});

export default router;
