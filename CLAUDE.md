# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartFarmNews.com — AgTech/FoodTech media + used Korean farm equipment marketplace.
- Automatically publishes 30–50 news articles/day via AI agents
- Aggregates onbid.co.kr farm equipment auctions with multilingual translation (KO/EN/ZH/VI)
- 2-person team + 4 AI agents, targeting AI cost < $0.50/month using OpenRouter Qwen

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express.js (ESM modules) |
| Database | PostgreSQL |
| Frontend (public) | Next.js (SSG/ISR) |
| Admin dashboard | React 18 + Vite + shadcn/ui + Tailwind |
| AI | OpenRouter Qwen (Free/Pro 72B/Reason tiers) |
| Task queue | BullMQ + Redis |
| Crawler | Playwright |
| Process manager | PM2 |
| Web server | Nginx (reverse proxy) |

## Monorepo Structure

```
smartfarmnews/
├── src/              # Node.js Express backend (ESM)
│   ├── config/       # database.js, env.js
│   ├── db/           # schema.sql, migrations/
│   ├── api/          # app.js, routes/, controllers/, middleware/
│   ├── agents/       # orchestrator.js, newsAgent.js, insightsAgent.js, marketAgent.js, eventsAgent.js
│   ├── utils/        # qwenClient.js, qwenPrompts.js, qwenCostTracker.js, crawler.js, rssParser.js
│   └── server.js
├── admin/            # React 18 + Vite admin dashboard
│   └── src/pages/    # Dashboard, Articles, ArticleEdit, Market, Agents, Sources, Subscribers
├── frontend/         # Next.js public site
│   └── src/app/      # / /news /insights /market /events (App Router)
└── docs/             # Planning documents
```

## Development Commands

### Backend
```bash
npm run dev          # Start backend with nodemon (ESM)
npm start            # Production start via PM2
npm run db:migrate   # Run SQL migrations
```

### Admin Dashboard
```bash
cd admin && npm run dev    # Vite dev server
cd admin && npm run build  # Build for production
```

### Frontend
```bash
cd frontend && npm run dev    # Next.js dev server
cd frontend && npm run build  # Static/ISR build
cd frontend && npm start      # Production server
```

## AI Client Architecture (Key Files)

All AI calls go through `src/utils/qwenClient.js` using OpenRouter's OpenAI-compatible SDK.

**Model routing** (`TASK_MODEL_MAP` in qwenClient.js):
- `QWEN_FREE` (`qwen-2.5-7b-instruct:free`) — translation, summarize, classify, parse (free, 1000 req/day)
- `QWEN_PRO` (`qwen-2.5-72b-instruct`) — commentary, multilingual translation, SEO meta (~$0.13/MTok in)
- `QWEN_REASON` (`qwen3-235b-a22b:free`) — insight articles, deep analysis (free)

Rate limit: 3000ms delay between free model requests, 500ms for Pro. Auto-fallback to Pro on rate limit.

## Agent Schedules

| Agent | Schedule | Cost/month |
|-------|----------|------------|
| News Agent | Every 2 hours | ~$0.30 |
| Insights Agent | 06:00 KST daily | ~$0.06 |
| Market Agent | 09:00 KST daily | ~$0.08 |
| Events Agent | Mon/Thu 10:00 KST | ~$0.00 |

## Database Key Tables

- `articles` — News + Insights unified (menu_type: 'news'|'insights', status: draft|published|archived)
- `equipment` — Farm machinery listings (source: onbid|private|direct)
- `auction_data` — Onbid auction records (linked to equipment)
- `agent_logs` — AI execution logs with token counts and cost_usd per task

## Environment Variables

Copy `.env.example` to `.env`. Required keys:
- `OPENROUTER_API_KEY` — OpenRouter API key ($10 credit needed to activate free model tier)
- `DB_*` — PostgreSQL connection
- `REDIS_HOST/PORT` — BullMQ queue
- `JWT_SECRET` — Admin auth
- `SMTP_*` — Newsletter email

Optional (DeepL, OpenAI, Kakao) are commented out by default.

## Public Site Routes

```
/news, /news/[slug]          Articles with tag/source filters
/insights, /insights/[slug]  Research-based insights
/market, /market/[id]        Farm equipment listings
/market/auctions             Active onbid auctions
/events, /events/[slug]      Agriculture trade fairs
```

## Admin API Pattern

All admin routes are prefixed `/api/admin/` and require JWT Bearer auth.
Agent monitoring available at `GET /api/admin/agents/cost` and `/api/admin/agents/qwen-stats`.
