/**
 * Public Articles API
 * GET  /api/articles          목록 (menu_type, tag, search, sort, page, limit)
 * GET  /api/articles/:id      상세
 * GET  /api/articles/:id/related  관련 기사
 * POST /api/articles/:id/view 조회수 증가
 */

import { Router } from 'express';
import { query }  from '../../config/database.js';

const router = Router();

// ── 목록 조회 ─────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const {
      menu_type,
      tag,
      search,
      sort  = 'latest',
      page  = 1,
      limit = 20,
    } = req.query;

    const conditions = ["status = 'published'"];
    const params     = [];

    if (menu_type) {
      params.push(menu_type);
      conditions.push(`menu_type = $${params.length}`);
    }
    if (tag) {
      params.push(tag);
      conditions.push(`$${params.length} = ANY(tags)`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(title_ko ILIKE $${params.length} OR title_en ILIKE $${params.length})`);
    }

    const where  = conditions.join(' AND ');
    const order  = sort === 'popular' ? 'view_count DESC' : 'published_at DESC';
    const offset = (Number(page) - 1) * Number(limit);

    params.push(Number(limit), offset);

    const { rows } = await query(
      `SELECT id, slug, title_ko, title_en, summary, tags, source_name,
              menu_type, published_at, view_count
       FROM   articles
       WHERE  ${where}
       ORDER  BY ${order}
       LIMIT  $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS total FROM articles WHERE ${where}`,
      params.slice(0, -2),
    );

    res.json({ data: rows, total: countRows[0].total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
});

// ── 단건 조회 ─────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM articles WHERE id = $1 AND status = 'published'`,
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 관련 기사 ─────────────────────────────────────────────────────
router.get('/:id/related', async (req, res, next) => {
  try {
    const { rows: article } = await query('SELECT tags, menu_type FROM articles WHERE id=$1', [req.params.id]);
    if (!article.length) return res.status(404).json({ error: 'Not Found' });

    const { tags, menu_type } = article[0];

    const { rows } = await query(
      `SELECT id, slug, title_ko, summary, published_at
       FROM   articles
       WHERE  status = 'published'
         AND  id     != $1
         AND  menu_type = $2
         AND  tags && $3
       ORDER  BY published_at DESC
       LIMIT  5`,
      [req.params.id, menu_type, tags],
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// ── 조회수 증가 ───────────────────────────────────────────────────
router.post('/:id/view', async (req, res, next) => {
  try {
    await query('UPDATE articles SET view_count = view_count + 1 WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
