/**
 * Public Events API
 * GET /api/events         목록 (type, year, month)
 * GET /api/events/:id     상세
 */

import { Router } from 'express';
import { query }  from '../../config/database.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { type, year, month } = req.query;
    const conditions = [];
    const params     = [];

    if (type) {
      params.push(type);
      conditions.push(`type = $${params.length}`);
    }
    if (year) {
      params.push(Number(year));
      conditions.push(`EXTRACT(YEAR FROM start_date) = $${params.length}`);
    }
    if (month) {
      params.push(Number(month));
      conditions.push(`EXTRACT(MONTH FROM start_date) = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const { rows } = await query(
      `SELECT * FROM events ${where} ORDER BY start_date ASC`,
      params,
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
