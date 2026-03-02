/**
 * Admin Equipment API (JWT 필요)
 * GET    /api/admin/equipment
 * PUT    /api/admin/equipment/:id
 * PATCH  /api/admin/equipment/:id/status
 * GET    /api/admin/equipment/inquiries
 * PATCH  /api/admin/equipment/inquiries/:id
 */

import { Router } from 'express';
import { query }  from '../../../config/database.js';
import { adminAuth } from '../../middleware/adminAuth.js';

const router = Router();
router.use(adminAuth);

// ── 문의 목록 (/:id보다 먼저 선언) ───────────────────────────────
router.get('/inquiries', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const params = [];
    let where = '';

    if (status) {
      params.push(status);
      where = `WHERE i.status = $1`;
    }

    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);

    const { rows } = await query(
      `SELECT i.*, e.title_ko AS equipment_title
       FROM   equipment_inquiries i
       JOIN   equipment e ON e.id = i.equipment_id
       ${where}
       ORDER  BY i.created_at DESC
       LIMIT  $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── 문의 상태 변경 ────────────────────────────────────────────────
router.patch('/inquiries/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });

    const { rows } = await query(
      `UPDATE equipment_inquiries SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 목록 ──────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const conditions = [];
    const params     = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);

    const { rows } = await query(
      `SELECT id, title_ko, category, brand, model, year,
              price_krw, source, status, is_auction, created_at
       FROM   equipment
       ${where}
       ORDER  BY created_at DESC
       LIMIT  $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── 수정 ──────────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const fields  = ['title_ko','title_en','title_zh','title_vi','category','brand','model',
                     'year','condition','price_krw','price_usd','location',
                     'description_ko','description_en','description_zh','description_vi'];
    const updates = [];
    const params  = [];

    for (const f of fields) {
      if (req.body[f] !== undefined) {
        params.push(req.body[f]);
        updates.push(`${f} = $${params.length}`);
      }
    }

    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });

    params.push(req.params.id);
    const { rows } = await query(
      `UPDATE equipment SET ${updates.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params,
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 상태 변경 ─────────────────────────────────────────────────────
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });

    const { rows } = await query(
      `UPDATE equipment SET status = $1 WHERE id = $2 RETURNING id, status`,
      [status, req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
