/**
 * Admin Sources API (JWT 필요)
 * GET    /api/admin/sources
 * POST   /api/admin/sources
 * PUT    /api/admin/sources/:id
 * PATCH  /api/admin/sources/:id/toggle   활성/비활성 토글
 * DELETE /api/admin/sources/:id
 */

import { Router } from 'express';
import { query }  from '../../../config/database.js';
import { adminAuth } from '../../middleware/adminAuth.js';

const router = Router();
router.use(adminAuth);

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM news_sources ORDER BY id');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, url, rss_url, category, language = 'en' } = req.body;
    if (!name || !url) return res.status(400).json({ error: 'name and url required' });

    const { rows } = await query(
      `INSERT INTO news_sources (name, url, rss_url, category, language)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, url, rss_url ?? null, category ?? null, language],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, url, rss_url, category, language } = req.body;
    const { rows } = await query(
      `UPDATE news_sources
       SET name     = COALESCE($1, name),
           url      = COALESCE($2, url),
           rss_url  = COALESCE($3, rss_url),
           category = COALESCE($4, category),
           language = COALESCE($5, language)
       WHERE id = $6 RETURNING *`,
      [name, url, rss_url, category, language, req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE news_sources SET is_active = NOT is_active WHERE id = $1 RETURNING id, name, is_active`,
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM news_sources WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
