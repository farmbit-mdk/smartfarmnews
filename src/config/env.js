import 'dotenv/config';

const required = [
  'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD',
  'OPENROUTER_API_KEY',
  'JWT_SECRET',
  'REDIS_HOST', 'REDIS_PORT',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const config = {
  // 서버
  PORT: parseInt(process.env.PORT ?? '3000', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  isProd: process.env.NODE_ENV === 'production',

  // PostgreSQL
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT, 10),
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,

  // OpenRouter
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  QWEN_MODEL_FREE:   process.env.QWEN_MODEL_FREE   ?? 'qwen/qwen-2.5-7b-instruct',
  QWEN_MODEL_PRO:    process.env.QWEN_MODEL_PRO    ?? 'qwen/qwen-2.5-7b-instruct',
  QWEN_MODEL_REASON: process.env.QWEN_MODEL_REASON ?? 'qwen/qwen-2.5-7b-instruct',
  QWEN_MODEL_CODER:  process.env.QWEN_MODEL_CODER  ?? 'qwen/qwen-2.5-7b-instruct',

  // Rate limit
  QWEN_FREE_DELAY_MS:    parseInt(process.env.QWEN_FREE_DELAY_MS    ?? '3000', 10),
  QWEN_PRO_DELAY_MS:     parseInt(process.env.QWEN_PRO_DELAY_MS     ?? '500',  10),
  QWEN_FREE_DAILY_LIMIT: parseInt(process.env.QWEN_FREE_DAILY_LIMIT ?? '1000', 10),

  // 비용 알림
  MONTHLY_BUDGET_USD: parseFloat(process.env.MONTHLY_BUDGET_USD ?? '5'),
  COST_ALERT_EMAIL:   process.env.COST_ALERT_EMAIL ?? '',

  // JWT
  JWT_SECRET:     process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',

  // 어드민
  ADMIN_EMAIL:    process.env.ADMIN_EMAIL    ?? '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? '',

  // Redis
  REDIS_HOST:     process.env.REDIS_HOST,
  REDIS_PORT:     parseInt(process.env.REDIS_PORT, 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD ?? undefined,

  // SMTP
  SMTP_HOST: process.env.SMTP_HOST ?? '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT ?? '587', 10),
  SMTP_USER: process.env.SMTP_USER ?? '',
  SMTP_PASS: process.env.SMTP_PASS ?? '',

  // 선택적
  KAKAO_API_KEY:  process.env.KAKAO_API_KEY  ?? '',
  DEEPL_API_KEY:  process.env.DEEPL_API_KEY  ?? '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? '',
};
