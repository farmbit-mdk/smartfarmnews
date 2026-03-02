/**
 * pm2.config.js
 * PM2 프로세스 매니저 설정
 *
 * 주요 명령어:
 *   pm2 start  pm2.config.js --env production   # 전체 시작
 *   pm2 reload pm2.config.js --env production   # 무중단 재시작
 *   pm2 stop   all                              # 전체 중지
 *   pm2 logs   sfn-api                          # 실시간 로그
 *   pm2 monit                                   # 리소스 모니터
 *   pm2 save && pm2 startup                     # 서버 재부팅 후 자동 실행 등록
 *
 * Note: "type": "module" 프로젝트에서 PM2 5.3+ 필요
 *       로그 디렉토리: logs/ (사전 생성 필요)
 */

export default {
  apps: [

    // ────────────────────────────────────────────────────────────────
    // 1. Backend API  (Express, port 3000)
    //    Nginx → localhost:3000 리버스 프록시
    // ────────────────────────────────────────────────────────────────
    {
      name:               'sfn-api',
      script:             './src/server.js',

      instances:          1,
      exec_mode:          'fork',

      watch:              false,
      autorestart:        true,
      restart_delay:      5_000,       // 재시작 전 5초 대기
      max_restarts:       10,          // 10회 연속 크래시 시 중단
      kill_timeout:       12_000,      // server.js graceful shutdown 10초 + 여유 2초

      max_memory_restart: '512M',

      error_file:         './logs/api.error.log',
      out_file:           './logs/api.out.log',
      log_date_format:    'YYYY-MM-DD HH:mm:ss',
      merge_logs:         true,

      env: {
        NODE_ENV: 'development',
        PORT:      3000,
        TZ:        'Asia/Seoul',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT:      3000,
        TZ:        'Asia/Seoul',
      },
    },

    // ────────────────────────────────────────────────────────────────
    // 2. AI Agent Orchestrator  (node-cron + BullMQ)
    //    스케줄:
    //      News Agent    — 매 2시간  (0 */2 * * *)
    //      Insights Agent — 06:00 KST (0 6 * * *)
    //      Market Agent   — 09:00 KST (0 9 * * *)
    //      Events Agent   — 월·목 10:00 (0 10 * * 1,4)
    //
    //    ※ 반드시 instances: 1 유지 (중복 실행 → 중복 DB 저장 방지)
    // ────────────────────────────────────────────────────────────────
    {
      name:               'sfn-orchestrator',
      script:             './src/agents/orchestrator.js',

      instances:          1,           // 단일 인스턴스 필수
      exec_mode:          'fork',

      watch:              false,
      autorestart:        true,
      restart_delay:      10_000,      // 크래시 후 10초 대기 (OpenRouter 연결 안정화)
      max_restarts:       5,
      kill_timeout:       30_000,      // 진행 중인 Qwen 호출 완료 대기 (최대 30초)

      max_memory_restart: '300M',

      error_file:         './logs/orchestrator.error.log',
      out_file:           './logs/orchestrator.out.log',
      log_date_format:    'YYYY-MM-DD HH:mm:ss',
      merge_logs:         true,

      env: {
        NODE_ENV: 'development',
        TZ:        'Asia/Seoul',
      },
      env_production: {
        NODE_ENV: 'production',
        TZ:        'Asia/Seoul',
      },
    },

    // ────────────────────────────────────────────────────────────────
    // 3. Next.js 공개 사이트  (port 3001)
    //    frontend/ 디렉토리 구현 완료 후 주석 해제
    //    사전 조건: cd frontend && npm run build
    // ────────────────────────────────────────────────────────────────
    // {
    //   name:               'sfn-frontend',
    //   script:             './node_modules/.bin/next',
    //   args:               'start --port 3001',
    //   cwd:                './frontend',
    //
    //   instances:          1,
    //   exec_mode:          'fork',
    //   watch:              false,
    //   autorestart:        true,
    //   restart_delay:      5_000,
    //   max_memory_restart: '512M',
    //   kill_timeout:       10_000,
    //
    //   error_file:         '../logs/frontend.error.log',
    //   out_file:           '../logs/frontend.out.log',
    //   log_date_format:    'YYYY-MM-DD HH:mm:ss',
    //   merge_logs:         true,
    //
    //   env_production: {
    //     NODE_ENV: 'production',
    //     PORT:      3001,
    //     TZ:        'Asia/Seoul',
    //   },
    // },

  ],
};
