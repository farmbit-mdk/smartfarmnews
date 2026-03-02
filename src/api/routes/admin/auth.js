/**
 * Admin Auth API
 * POST /api/admin/auth/login    로그인 → JWT 발급
 * POST /api/admin/auth/refresh  토큰 갱신
 * POST /api/admin/auth/logout   로그아웃 (클라이언트 토큰 삭제 안내)
 */

import { Router } from 'express';
import jwt         from 'jsonwebtoken';

import { config }    from '../../../config/env.js';
import { adminAuth } from '../../middleware/adminAuth.js';

const router = Router();

// ── 로그인 ────────────────────────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
    }

    // MVP: .env 어드민 계정과 단순 비교 (Phase 2에서 DB 기반 계정 관리로 전환)
    const isValid =
      email    === config.ADMIN_EMAIL &&
      password === config.ADMIN_PASSWORD;

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { email, role: 'admin' };
    const token   = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    res.json({ token, expiresIn: config.JWT_EXPIRES_IN });
  } catch (err) {
    next(err);
  }
});

// ── 토큰 갱신 ─────────────────────────────────────────────────────
router.post('/refresh', adminAuth, (req, res) => {
  // 유효한 토큰으로 새 토큰 발급
  const { email, role } = req.admin;
  const token = jwt.sign({ email, role }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
  res.json({ token, expiresIn: config.JWT_EXPIRES_IN });
});

// ── 로그아웃 ──────────────────────────────────────────────────────
// Stateless JWT: 서버 측 무효화 없음 — 클라이언트가 토큰 삭제
router.post('/logout', adminAuth, (_req, res) => {
  res.json({ ok: true, message: 'Token invalidated on client side' });
});

export default router;
