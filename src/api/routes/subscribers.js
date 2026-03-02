/**
 * Public Subscribers API
 * POST   /api/subscribe          뉴스레터 구독
 * DELETE /api/subscribe/:email   구독 취소
 */

import { Router } from 'express';
import { query }  from '../../config/database.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { email, name, language = 'ko' } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    await query(
      `INSERT INTO subscribers (email, name, language)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
         SET is_active = true, unsubscribed_at = NULL, name = EXCLUDED.name`,
      [email, name ?? null, language],
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/:email', async (req, res, next) => {
  try {
    await query(
      `UPDATE subscribers
       SET is_active = false, unsubscribed_at = NOW()
       WHERE email = $1`,
      [req.params.email],
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
