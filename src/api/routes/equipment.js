/**
 * Public Equipment API
 * GET  /api/equipment              목록 (category, is_auction, price_min/max, page, limit)
 * GET  /api/equipment/auctions     진행 중 공매
 * GET  /api/equipment/price-stats  기종별 가격 통계
 * GET  /api/equipment/:id          매물 상세
 * POST /api/equipment/:id/inquiry  구매 문의
 * POST /api/equipment/alerts       공매 알림 구독
 */

import { Router } from 'express';
import { query }  from '../../config/database.js';

const router = Router();

// ── 진행 중 공매 (/:id보다 먼저 선언) ────────────────────────────
router.get('/auctions', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows } = await query(
      `SELECT e.*, a.auction_id, a.current_price, a.end_at, a.bid_count
       FROM   equipment e
       JOIN   auction_data a ON a.equipment_id = e.id
       WHERE  e.status = 'active' AND a.status = 'active'
       ORDER  BY a.end_at ASC
       LIMIT  $1 OFFSET $2`,
      [Number(limit), offset],
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── 가격 통계 ─────────────────────────────────────────────────────
router.get('/price-stats', async (req, res, next) => {
  try {
    const { category } = req.query;
    const params = [];
    let where = '';

    if (category) {
      params.push(category);
      where = 'WHERE category = $1';
    }

    const { rows } = await query(
      `SELECT * FROM equipment_price_stats ${where} ORDER BY category, brand, model`,
      params,
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── 공매 알림 구독 ────────────────────────────────────────────────
router.post('/alerts', async (req, res, next) => {
  try {
    const { email, category, brand, max_price_krw } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    await query(
      `INSERT INTO auction_alerts (email, category, brand, max_price_krw)
       VALUES ($1, $2, $3, $4)`,
      [email, category ?? null, brand ?? null, max_price_krw ?? null],
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── 목록 조회 ─────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      is_auction,
      price_min,
      price_max,
      page  = 1,
      limit = 20,
    } = req.query;

    const conditions = ["status = 'active'"];
    const params     = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (is_auction !== undefined) {
      params.push(is_auction === 'true');
      conditions.push(`is_auction = $${params.length}`);
    }
    if (price_min) {
      params.push(Number(price_min));
      conditions.push(`price_krw >= $${params.length}`);
    }
    if (price_max) {
      params.push(Number(price_max));
      conditions.push(`price_krw <= $${params.length}`);
    }

    const where  = conditions.join(' AND ');
    const offset = (Number(page) - 1) * Number(limit);

    params.push(Number(limit), offset);

    const { rows } = await query(
      `SELECT id, title_ko, title_en, title_zh, title_vi,
              category, brand, model, year, condition,
              price_krw, price_usd, location,
              images, source, is_auction, auction_end_at, status
       FROM   equipment
       WHERE  ${where}
       ORDER  BY created_at DESC
       LIMIT  $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS total FROM equipment WHERE ${where}`,
      params.slice(0, -2),
    );

    res.json({ data: rows, total: countRows[0].total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// ── 매물 상세 ─────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM equipment WHERE id = $1 AND status = 'active'`,
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 구매 문의 ─────────────────────────────────────────────────────
router.post('/:id/inquiry', async (req, res, next) => {
  try {
    const { name, email, phone, country, message } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    await query(
      `INSERT INTO equipment_inquiries
         (equipment_id, name, email, phone, country, message)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [req.params.id, name, email, phone ?? null, country ?? null, message ?? null],
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
