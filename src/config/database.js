import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

const pool = new Pool({
  host:     config.DB_HOST,
  port:     config.DB_PORT,
  database: config.DB_NAME,
  user:     config.DB_USER,
  password: config.DB_PASSWORD,
  max: 20,              // 최대 연결 수
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

/**
 * 단일 쿼리 실행 헬퍼
 * @param {string} text - SQL 쿼리
 * @param {any[]} [params] - 파라미터 배열
 */
export const query = (text, params) => pool.query(text, params);

/**
 * 트랜잭션 실행 헬퍼
 * @param {(client: pg.PoolClient) => Promise<T>} fn
 */
export const withTransaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export default pool;
