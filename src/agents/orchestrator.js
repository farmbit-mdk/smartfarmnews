/**
 * orchestrator.js
 * BullMQ 기반 AI Agent 스케줄러 + 워커
 *
 * PM2 'sfn-orchestrator' 프로세스로 단독 실행 (instances: 1 필수)
 *
 * 스케줄 (TZ=Asia/Seoul):
 *   news-agent      — 매 2시간      (0 */2 * * *)
 *   insights-agent  — 매일 06:00    (0 6 * * *)    ← Phase 2
 *   market-agent    — 매일 09:00    (0 9 * * *)    ← Phase 2
 *   events-agent    — 월·목 10:00   (0 10 * * 1,4) ← Phase 2
 *
 * 아키텍처:
 *   Orchestrator → BullMQ Queue → Worker → AgentFn()
 *   반복 작업은 Redis에 저장되므로 프로세스 재시작 후에도 스케줄 유지
 */

import IORedis     from 'ioredis';
import { Queue, Worker } from 'bullmq';

import { config }      from '../config/env.js';
import { runNewsAgent } from './newsAgent.js';

// ── Phase 2 에이전트 스텁 ────────────────────────────────────────
// 구현 시 각 파일로 분리 후 import 교체
async function runInsightsAgent() {
  console.log('[InsightsAgent] Phase 2 예정 — Qwen3-Reason 기반 논문 인사이트 생성');
}

async function runMarketAgent() {
  console.log('[MarketAgent] Phase 2 예정 — 온비드 공매 크롤링 + 다국어 번역');
}

async function runEventsAgent() {
  console.log('[EventsAgent] Phase 2 예정 — 글로벌·국내 박람회 정보 수집');
}

// ── Agent 스케줄 정의 ────────────────────────────────────────────
/**
 * @typedef {object} AgentSchedule
 * @property {string}   name         - BullMQ 큐 이름
 * @property {string}   cron         - cron 표현식 (Asia/Seoul 기준)
 * @property {Function} run          - 실행할 에이전트 함수
 * @property {boolean}  runOnStart   - 오케스트레이터 시작 시 즉시 1회 실행 여부
 * @property {number}   concurrency  - 동시 실행 수 (Rate limit 준수: 항상 1)
 */

/** @type {AgentSchedule[]} */
const AGENT_SCHEDULE = [
  {
    name:        'news-agent',
    cron:        '0 */2 * * *',   // 매 2시간
    run:         runNewsAgent,
    runOnStart:  true,            // 시작 시 즉시 수집 (기사 공백 방지)
    concurrency: 1,
  },
  {
    name:        'insights-agent',
    cron:        '0 6 * * *',     // 매일 06:00 KST
    run:         runInsightsAgent,
    runOnStart:  false,
    concurrency: 1,
  },
  {
    name:        'market-agent',
    cron:        '0 9 * * *',     // 매일 09:00 KST
    run:         runMarketAgent,
    runOnStart:  false,
    concurrency: 1,
  },
  {
    name:        'events-agent',
    cron:        '0 10 * * 1,4',  // 월요일·목요일 10:00 KST
    run:         runEventsAgent,
    runOnStart:  false,
    concurrency: 1,
  },
];

// ── Redis 연결 ────────────────────────────────────────────────────
const redis = new IORedis({
  host:                 config.REDIS_HOST,
  port:                 config.REDIS_PORT,
  ...(config.REDIS_PASSWORD && { password: config.REDIS_PASSWORD }),
  maxRetriesPerRequest: null,  // BullMQ Worker 필수
  enableReadyCheck:     false, // BullMQ 권장
  lazyConnect:          true,
});

redis.on('connect', () => console.log('[Redis] Connected'));
redis.on('error',   (err) => console.error('[Redis] Error:', err.message));

// ── 상태 관리 ─────────────────────────────────────────────────────
/** @type {Worker[]} */
const activeWorkers = [];

/** @type {Queue[]} */
const activeQueues = [];

// ── 시작 ─────────────────────────────────────────────────────────

async function start() {
  // Redis 연결 확인
  await redis.connect();
  await redis.ping();
  console.log('[Orchestrator] Redis ping OK');

  console.log(`[Orchestrator] Initializing ${AGENT_SCHEDULE.length} agents...`);

  for (const agent of AGENT_SCHEDULE) {
    const queue = new Queue(agent.name, { connection: redis });
    activeQueues.push(queue);

    // 기존 반복 작업 모두 제거 후 재등록
    // → 코드 배포 후 cron 변경 사항이 즉시 반영됨
    const existing = await queue.getRepeatableJobs();
    if (existing.length) {
      await Promise.all(existing.map((j) => queue.removeRepeatableByKey(j.key)));
      console.log(`[Orchestrator] Cleared ${existing.length} old repeatable job(s) for: ${agent.name}`);
    }

    await queue.add(
      'scheduled-run',
      { agentName: agent.name },
      {
        repeat:           { cron: agent.cron, tz: 'Asia/Seoul' },
        removeOnComplete: { count: 200 },  // 최근 200건 완료 기록 보존
        removeOnFail:     { count: 100 },  // 최근 100건 실패 기록 보존
      },
    );

    console.log(`[Orchestrator] ✓ Scheduled ${agent.name}  →  ${agent.cron} (KST)`);

    // 워커 생성
    const worker = createWorker(agent);
    activeWorkers.push(worker);

    // 시작 시 즉시 실행 (runOnStart: true인 에이전트)
    if (agent.runOnStart) {
      await queue.add(
        'immediate-run',
        { agentName: agent.name, immediate: true },
        {
          removeOnComplete: true,
          removeOnFail:     { count: 10 },
        },
      );
      console.log(`[Orchestrator] Queued immediate run: ${agent.name}`);
    }
  }

  console.log('[Orchestrator] ■ All agents ready');

  // 매시간 헬스 로그
  setInterval(logStatus, 60 * 60 * 1_000);
}

// ── 워커 생성 ─────────────────────────────────────────────────────

/**
 * @param {AgentSchedule} agent
 * @returns {Worker}
 */
function createWorker(agent) {
  const worker = new Worker(
    agent.name,
    async (job) => {
      const isImmediate = job.data?.immediate === true;
      const label = `${agent.name} job#${job.id}${isImmediate ? ' (immediate)' : ''}`;

      console.log(`[Orchestrator] ▶ ${label}`);
      const startedAt = Date.now();

      try {
        const result = await agent.run();
        const ms = Date.now() - startedAt;
        console.log(`[Orchestrator] ■ ${label} — done in ${ms}ms`);
        return result ?? null;
      } catch (err) {
        console.error(`[Orchestrator] ✗ ${label} — ${err.message}`);
        throw err;  // BullMQ가 failed 상태로 기록 + 재시도 큐에 추가
      }
    },
    {
      connection:  redis,
      concurrency: agent.concurrency,
      // 실패 시 자동 재시도: 5분 간격, 최대 3회 (BullMQ 기본 backoff)
      settings: {
        backoffStrategy: (attemptsMade) => Math.min(attemptsMade * 5 * 60_000, 30 * 60_000),
      },
    },
  );

  worker.on('failed', (job, err) => {
    console.error(
      `[Orchestrator] Job failed: ${agent.name}#${job?.id} ` +
      `(attempt ${job?.attemptsMade}) — ${err.message}`,
    );
  });

  worker.on('stalled', (jobId) => {
    console.warn(`[Orchestrator] Job stalled: ${agent.name}#${jobId}`);
  });

  return worker;
}

// ── 상태 로그 ─────────────────────────────────────────────────────

async function logStatus() {
  console.log(`[Orchestrator] ── Status ${new Date().toISOString()} ──`);

  for (const queue of activeQueues) {
    try {
      const [waiting, active, failed, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
      ]);

      console.log(
        `  ${queue.name.padEnd(18)} ` +
        `waiting=${waiting}  active=${active}  failed=${failed}  delayed=${delayed}`,
      );
    } catch {
      console.warn(`  ${queue.name}: status unavailable`);
    }
  }
}

// ── Graceful Shutdown ─────────────────────────────────────────────

async function shutdown(signal) {
  console.log(`\n[Orchestrator] ${signal} received. Shutting down...`);

  try {
    // 1. 워커 종료 (진행 중인 작업 완료 대기)
    await Promise.all(activeWorkers.map((w) => w.close()));
    console.log('[Orchestrator] Workers closed');

    // 2. 큐 종료
    await Promise.all(activeQueues.map((q) => q.close()));
    console.log('[Orchestrator] Queues closed');

    // 3. Redis 연결 종료
    await redis.quit();
    console.log('[Orchestrator] Redis disconnected');

    console.log('[Orchestrator] Shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('[Orchestrator] Error during shutdown:', err.message);
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[Orchestrator] Unhandled Rejection:', reason);
  if (config.isProd) process.exit(1);
});

// ── 실행 ─────────────────────────────────────────────────────────
await start();
