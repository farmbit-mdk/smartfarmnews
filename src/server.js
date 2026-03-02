/**
 * server.js
 * HTTP 서버 진입점
 * - DB 연결 확인 후 Listen
 * - SIGTERM / SIGINT 시 Graceful Shutdown (연결 드레인 → DB Pool 종료)
 * - unhandledRejection / uncaughtException 핸들링
 */

import app  from './api/app.js';
import pool from './config/database.js';
import { config } from './config/env.js';

// ── DB 연결 테스트 ─────────────────────────────────────────────────
try {
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
  console.log('[DB] Connection OK');
} catch (err) {
  console.error('[DB] Connection failed:', err.message);
  process.exit(1);
}

// ── HTTP 서버 시작 ─────────────────────────────────────────────────
const server = app.listen(config.PORT, () => {
  console.log(`[Server] Listening on port ${config.PORT} (${config.NODE_ENV})`);
});

// ── Graceful Shutdown ─────────────────────────────────────────────
async function shutdown(signal) {
  console.log(`\n[Server] ${signal} received. Shutting down gracefully...`);

  // 신규 연결 거부, 기존 연결 처리 완료 대기
  server.close(async () => {
    try {
      await pool.end();
      console.log('[Server] DB pool closed. Bye.');
      process.exit(0);
    } catch (err) {
      console.error('[Server] Error during shutdown:', err.message);
      process.exit(1);
    }
  });

  // 10초 내로 종료되지 않으면 강제 종료
  setTimeout(() => {
    console.error('[Server] Shutdown timeout. Forcing exit.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

// ── 예외 핸들링 ───────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled Rejection:', reason);
  // 운영 환경에서는 프로세스 종료 (PM2가 재시작)
  if (config.isProd) process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
  process.exit(1);
});
