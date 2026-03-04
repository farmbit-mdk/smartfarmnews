/**
 * Admin Articles API (JWT 필요)
 * GET    /api/admin/articles
 * GET    /api/admin/articles/:id
 * POST   /api/admin/articles
 * PUT    /api/admin/articles/:id
 * PATCH  /api/admin/articles/:id/publish
 * PATCH  /api/admin/articles/:id/archive
 * DELETE /api/admin/articles/:id
 *
 * 이미지 관리:
 * GET    /api/admin/articles/:id/image
 * POST   /api/admin/articles/:id/image        (multipart/form-data, field: image)
 * PUT    /api/admin/articles/:id/image/regenerate
 * DELETE /api/admin/articles/:id/image
 */

import { Router }  from 'express';
import multer      from 'multer';
import fs          from 'fs/promises';
import path        from 'path';
import { query }   from '../../../config/database.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import { generateArticleImage } from '../../../utils/imageGenerator.js';

const IMAGE_DIR = '/var/www/smartfarmnews/public/images';

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error('Image files only'), { status: 400 }));
  },
});

const router = Router();
router.use(adminAuth);

// ── 목록 ──────────────────────────────────────────────────────────
router.get('/', async (req, res, next) => {

  try {
    const { status, menu_type, page = 1, limit = 20 } = req.query;
    const conditions = [];
    const params     = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (menu_type) {
      params.push(menu_type);
      conditions.push(`menu_type = $${params.length}`);
    }

    const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit), offset);

    const { rows } = await query(
      `SELECT id, slug, title_ko, title_en, menu_type, status,
              source_name, tags, published_at, view_count, created_at
       FROM   articles
       ${where}
       ORDER  BY created_at DESC
       LIMIT  $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    const { rows: countRows } = await query(
      `SELECT COUNT(*)::int AS total FROM articles ${where}`,
      params.slice(0, -2),
    );

    res.json({ data: rows, total: countRows[0].total });
  } catch (err) {
    next(err);
  }
});

// ── 생성 (수동 기사 작성) ─────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const {
      title_ko, title_en, content_ko, content_en,
      summary, commentary, menu_type = 'news',
      tags = [], seo_title, seo_description,
    } = req.body;

    if (!title_ko) return res.status(400).json({ error: 'title_ko required' });

    const slug = `manual-${Date.now()}`;

    const { rows } = await query(
      `INSERT INTO articles
         (slug, title_ko, title_en, content_ko, content_en,
          summary, commentary, menu_type, tags,
          seo_title, seo_description, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'draft')
       RETURNING *`,
      [slug, title_ko, title_en ?? '', content_ko ?? '', content_en ?? '',
       summary ?? '', commentary ?? '', menu_type, tags,
       seo_title ?? '', seo_description ?? ''],
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 수정 ──────────────────────────────────────────────────────────
router.put('/:id', async (req, res, next) => {
  try {
    const {
      title_ko, title_en, content_ko, content_en,
      summary, commentary, tags, seo_title, seo_description,
    } = req.body;

    const { rows } = await query(
      `UPDATE articles
       SET title_ko        = COALESCE($1, title_ko),
           title_en        = COALESCE($2, title_en),
           content_ko      = COALESCE($3, content_ko),
           content_en      = COALESCE($4, content_en),
           summary         = COALESCE($5, summary),
           commentary      = COALESCE($6, commentary),
           tags            = COALESCE($7, tags),
           seo_title       = COALESCE($8, seo_title),
           seo_description = COALESCE($9, seo_description)
       WHERE id = $10
       RETURNING *`,
      [title_ko, title_en, content_ko, content_en,
       summary, commentary, tags, seo_title, seo_description,
       req.params.id],
    );

    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 발행 ──────────────────────────────────────────────────────────
router.patch('/:id/publish', async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE articles
       SET status = 'published', published_at = COALESCE(published_at, NOW())
       WHERE id = $1
       RETURNING id, status, published_at`,
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 보관 ──────────────────────────────────────────────────────────
router.patch('/:id/archive', async (req, res, next) => {
  try {
    const { rows } = await query(
      `UPDATE articles SET status = 'archived' WHERE id = $1 RETURNING id, status`,
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 삭제 ──────────────────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    await query('DELETE FROM articles WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── 단건 조회 ─────────────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT * FROM articles WHERE id = $1`,
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 이미지: 현재 URL 조회 ─────────────────────────────────────────
router.get('/:id/image', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, image_url FROM articles WHERE id = $1',
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── 이미지: 파일 업로드 ───────────────────────────────────────────
router.post('/:id/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const { rows } = await query(
      'SELECT slug FROM articles WHERE id = $1',
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });

    const { slug } = rows[0];
    await fs.mkdir(IMAGE_DIR, { recursive: true });

    const filePath = path.join(IMAGE_DIR, `${slug}.jpg`);
    await fs.writeFile(filePath, req.file.buffer);

    const imageUrl = `/images/${slug}.jpg`;
    await query(
      'UPDATE articles SET image_url = $1 WHERE id = $2',
      [imageUrl, req.params.id],
    );

    console.log(`[ImageAdmin] Uploaded: ${slug}.jpg`);
    res.json({ image_url: imageUrl });
  } catch (err) {
    next(err);
  }
});

// ── 이미지: AI 재생성 ─────────────────────────────────────────────
router.put('/:id/image/regenerate', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT slug, tags, title_en FROM articles WHERE id = $1',
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });

    const { slug, tags, title_en } = rows[0];
    const imageUrl = await generateArticleImage(slug, tags, title_en);

    if (!imageUrl) return res.status(500).json({ error: 'Image generation failed' });

    await query(
      'UPDATE articles SET image_url = $1 WHERE id = $2',
      [imageUrl, req.params.id],
    );

    res.json({ image_url: imageUrl });
  } catch (err) {
    next(err);
  }
});

// ── 이미지: 삭제 ──────────────────────────────────────────────────
router.delete('/:id/image', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT image_url FROM articles WHERE id = $1',
      [req.params.id],
    );
    if (!rows.length) return res.status(404).json({ error: 'Not Found' });

    const imageUrl = rows[0].image_url;
    if (imageUrl) {
      const filePath = path.join('/var/www/smartfarmnews/public', imageUrl);
      await fs.rm(filePath, { force: true });
      console.log(`[ImageAdmin] Deleted: ${path.basename(filePath)}`);
    }

    await query('UPDATE articles SET image_url = NULL WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
