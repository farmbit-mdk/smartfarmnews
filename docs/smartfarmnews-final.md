# SmartFarmNews.com 최종 개발 기획서

> **도메인**: smartfarmnews.com
> **버전**: v3.0 (통합 최종본)
> **작성일**: 2026-03-02
> **운영 규모**: 2인 팀 + AI Agent 자동화
> **AI 전략**: OpenRouter Qwen 기반 (월 $0.09~$0.50 목표)

---

## 0. 문서 개요 및 변경 이력

| 버전 | 주요 변경 | 작성일 |
|------|-----------|--------|
| v1.0 | 초기 기획 (GPT-4o 기반, 월 $216) | 2026-03-02 |
| v2.0 | AI 모델 전략 변경 (Qwen, 월 $0.09) | 2026-03-02 |
| **v3.0** | **두 기획서 통합, 구현 세부사항 확정** | 2026-03-02 |

---

## 1. 프로젝트 개요

### 1.1 서비스 정의

SmartFarmNews.com은 **애그테크(AgTech) · 푸드테크(FoodTech) 전문 미디어 + 중고농기계 해외 중개 마켓플레이스**다.

- 글로벌 농업 뉴스 번역·논평, 논문 기반 인사이트, 박람회 정보를 자동 생성·발행
- 온비드(onbid.co.kr) 농기계 공매를 수집·다국어 번역하여 해외 바이어에게 연결
- 2인 팀 + 4개 AI Agent로 운영 (풀 자동화)

### 1.2 핵심 목표

| 목표 | 지표 |
|------|------|
| AI 자동화 미디어 포지셔닝 | 일 30~50건 뉴스 자동 발행 |
| 직접 수익 모델 | 중고농기계 해외 중개 수수료 |
| 비용 효율화 | AI 비용 월 $0.50 이하 유지 |
| 글로벌 확장 | 한국어 + 영어 + 중국어 + 베트남어 |

### 1.3 기술 스택 (확정)

| 레이어 | 기술 | 비고 |
|--------|------|------|
| 서버 OS | Ubuntu 22.04 LTS | |
| 백엔드 | Node.js + Express.js | ESM 모듈 |
| DB | PostgreSQL | |
| 프론트엔드 | Next.js (SSG/ISR) | |
| 어드민 | React 18 + Vite | shadcn/ui + Tailwind |
| AI 오케스트레이션 | LangGraph / CrewAI | |
| 작업 큐 | BullMQ + Redis | |
| 프로세스 관리 | PM2 | |
| 웹서버 | Nginx (리버스 프록시) | |
| **AI 모델** | **OpenRouter Qwen** | **GPT-4o 제거** |
| 번역 보조 | DeepL API | 선택적 사용 (고품질 필요 시) |
| 크롤링 | Playwright | |

> **변경 확정**: 기존 v1.0의 OpenAI GPT-4o를 OpenRouter Qwen으로 전면 교체.
> DeepL API는 제거하지 않고 **선택적 사용**으로 전환 (Qwen 번역 품질 검증 후 결정).

---

## 2. 메인 메뉴 구조

```
smartfarmnews.com
├── 📰 News       /news        글로벌 농업 뉴스 번역 · 논평
├── 🔬 Insights   /insights    논문 기반 테크 인사이트
├── 🚜 Market     /market      중고농기계 해외 중개 마켓
└── 📅 Events     /events      글로벌 · 국내 박람회 정보
```

---

## 3. 메뉴별 상세 기획

### 3.1 📰 News

**개념**: 글로벌 농업·푸드테크 뉴스를 매일 AI가 번역·요약하고 에디터 논평을 추가하여 제공

#### 콘텐츠 소스

| 소스 | URL | 분류 |
|------|-----|------|
| HortiDaily | https://www.hortidaily.com | AgTech (원예) |
| AgFunderNews | https://agfundernews.com | 투자·스타트업 |
| FreshPlaza | https://www.freshplaza.com | 신선농산물 |
| AgTechNavigator | https://agtechnavigator.com | AgTech 전반 |
| FoodNavigator | https://www.foodnavigator.com | FoodTech |
| The Spoon | https://thespoon.tech | 푸드테크 |
| DigitalFoodLab | https://digitalfoodlab.com | 푸드테크 |
| 농민신문 | https://www.nongmin.com | 국내 농업 |
| 농사로(농촌진흥청) | https://www.nongsaro.go.kr | 국내 정책 |

#### 태그 체계
`#AgTech` `#FoodTech` `#Investment` `#Policy` `#K-Food` `#Startup` `#SmartFarm` `#Drone` `#VerticalFarm` `#Precision`

#### 콘텐츠 포맷
```
[원문 제목 + 출처 링크]
[AI 번역 본문 (300~500자)]
[핵심 요약 3줄]
[에디터 논평 1~2줄]
[원문 바로가기 버튼]
```

#### AI 처리 흐름 (Qwen 적용)

| 단계 | 작업 | 모델 | 비용 |
|------|------|------|------|
| 1 | EN→KO 번역 | Qwen-Free | $0 |
| 2 | 3줄 요약 | Qwen-Free | $0 |
| 3 | 태그 분류 | Qwen-Free | $0 |
| 4 | 에디터 논평 | Qwen-Pro 72B | ~$0.01/일 |

#### 발행 스케줄
- 매일 07:00 KST 자동 발행 (전날 수집 기사)
- 주 1회 월요일 08:00 주간 뉴스레터 발송

#### URL 구조
```
/news                       전체 뉴스 목록
/news/[slug]                개별 기사 상세
/news?tag=agtech            태그 필터
/news?source=hortidaily     소스 필터
```

---

### 3.2 🔬 Insights

**개념**: 농업·푸드테크 관련 학술 논문과 리포트를 수집하여 Qwen3-235B 기반 인사이트 기사 생성
(기존 NotebookLM → Qwen3-Reason으로 대체. NotebookLM은 추후 오디오 오버뷰 전용으로만 선택 사용)

#### 논문·리포트 수집 소스

| 소스 | 분류 |
|------|------|
| arXiv (cs.AI, q-bio) | AI·바이오 농업 논문 |
| PubMed | 농업 과학 논문 |
| MDPI (Agronomy, Foods) | 오픈액세스 농업 저널 |
| KREI (한국농촌경제연구원) | 국내 농업 경제 리포트 |
| ResearchGate | 종합 학술 논문 |
| McKinsey / BCG AgTech Reports | 산업 리포트 |

#### 콘텐츠 생성 워크플로우

```
① 논문 PDF/초록 자동 수집 (크롤러)
        ↓
② 분류 및 중복 제거 (Agent)
        ↓
③ Qwen-Free: 핵심 인사이트 3개 추출
        ↓
④ Qwen3-Reason (무료): 인사이트 기사 초안 작성
   구조: 헤드라인 → 리드문 → 본문(600자) → 결론
        ↓
⑤ Qwen-Pro 72B: SEO 메타 제목/설명 생성
        ↓
⑥ DB 저장 (status: draft)
        ↓
⑦ 에디터 최종 검토 (10~15분) → 발행
```

#### AI 처리 비용

| 단계 | 모델 | 비용 |
|------|------|------|
| 핵심 포인트 추출 | Qwen-Free | $0 |
| 인사이트 기사 초안 | Qwen3-Reason (free) | $0 |
| SEO 메타 생성 | Qwen-Pro 72B | ~$0.002/일 |

#### 발행 스케줄
- 주 3~5회 발행 (매일 06:00 KST 수집 → 오전 에디터 검토 후 발행)

#### URL 구조
```
/insights                   인사이트 목록
/insights/[slug]            개별 인사이트 상세
/insights?topic=vertical-farming
```

---

### 3.3 🚜 Market

**개념**: 온비드 농기계 공매를 수집·다국어 번역하여 해외 바이어에게 연결하는 중개 플랫폼

#### 데이터 소스

| 소스 | 유형 | URL |
|------|------|-----|
| 온비드 | 공공 경매 | https://www.onbid.co.kr |
| 농기계 민간 중고 사이트 | 민간 매물 | 추후 확정 |
| 직접 등록 | 판매자 업로드 | 자체 폼 |

#### 주요 카테고리
트랙터 / 콤바인 / 이앙기 / 드론 / 스마트팜 시설 / 기타

#### 핵심 기능

| 기능 | 설명 |
|------|------|
| 공매 큐레이션 | 온비드 농기계 공매 자동 수집 및 정리 |
| 다국어 번역 | KR/EN/ZH/VI (Qwen 모델 — ZH는 GPT-4o 능가) |
| 가격 통계 | 기종별 낙찰가 히스토리 |
| 해외 바이어 매칭 | 이메일·카카오 알림으로 구매 문의 연결 |
| 경매 알림 | 관심 기종 등록 → 신규 공매 등록 시 알림 |

#### AI 처리 흐름

| 단계 | 작업 | 모델 | 비용 |
|------|------|------|------|
| 1 | 공매 데이터 파싱 | Qwen-Free | $0 |
| 2 | EN 번역 | Qwen-Pro 72B | ~$0.005/일 |
| 3 | ZH 번역 | Qwen-Pro 72B | ~$0.005/일 |
| 4 | VI 번역 | Qwen-Pro 72B | ~$0.005/일 |
| 5 | 바이어용 설명 생성 | Qwen-Free | $0 |

> ZH(중국어) 번역은 Qwen의 강점 — GPT-4o 대비 동급 이상 품질

#### URL 구조
```
/market                     매물 목록 전체
/market/[id]                매물 상세
/market/auctions            진행 중 공매 목록
/market/auctions/[id]       공매 상세
/market/price-stats         기종별 가격 통계
/market/register            매물 직접 등록
```

---

### 3.4 📅 Events

**개념**: 농업·푸드테크 글로벌·국내 박람회·컨퍼런스 정보를 캘린더 형식으로 제공

#### 주요 이벤트 (글로벌)

| 이벤트 | 지역 | 주기 |
|--------|------|------|
| Fruit Logistica | 독일 베를린 | 연 1회 (2월) |
| GreenTech Amsterdam | 네덜란드 | 연 1회 (6월) |
| EuroTier | 독일 하노버 | 격년 (11월) |
| SIMA Paris | 프랑스 파리 | 격년 |
| AgriTechnica | 독일 하노버 | 격년 |
| World Agri-Tech Summit | 미국 샌프란시스코 | 연 1회 |

#### 주요 이벤트 (국내)

| 이벤트 | 지역 | 주기 |
|--------|------|------|
| KIEMSTA (한국농기계박람회) | 천안 | 격년 |
| Seoul Food | 서울 | 연 1회 |
| FoodTech Korea | 서울 | 연 1회 |
| 스마트팜 엑스포 | 전주 등 | 연 1회 |

#### AI 처리

| 작업 | 모델 | 비용 |
|------|------|------|
| 이벤트 정보 요약 | Qwen-Free | $0 |
| KO/EN 번역 | Qwen-Free | $0 |

#### 발행 스케줄
- 주 2회 신규 업데이트 (월·목 10:00 KST)
- 이벤트 30일 전 / 7일 전 뉴스레터 알림

---

## 4. AI Agent 오케스트레이션

### 4.1 전체 아키텍처

```
┌──────────────────────────────────────────────────┐
│              Orchestrator Agent                  │
│           (BullMQ + LangGraph)                   │
└──────┬───────────┬───────────┬───────────────────┘
       │           │           │           │
  ┌────▼───┐ ┌────▼───┐ ┌────▼───┐ ┌────▼───┐
  │ News   │ │Insights│ │ Market │ │ Events │
  │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │
  └────────┘ └────────┘ └────────┘ └────────┘
       │           │           │           │
  ┌────▼───────────▼───────────▼───────────▼────┐
  │   OpenRouter API (Qwen 모델 라우팅)          │
  └─────────────────────────────────────────────┘
       │
  ┌────▼────────────────────────────────────────┐
  │            PostgreSQL DB                    │
  └─────────────────────────────────────────────┘
```

### 4.2 Agent별 실행 스케줄 및 비용

| Agent | 실행 시간 | 주기 | 예상 비용/월 |
|-------|-----------|------|-------------|
| News Agent | 매 2시간 | 12회/일 | ~$0.30 |
| Insights Agent | 06:00 KST | 1회/일 | ~$0.06 |
| Market Agent | 09:00 KST | 1회/일 | ~$0.08 |
| Events Agent | 월·목 10:00 | 2회/주 | ~$0.00 |
| **합계** | | | **~$0.09~$0.50** |

> v1.0 대비: $185~$495/월 → $0.09~$0.50/월 (99.8% 절감)

### 4.3 Qwen 모델 라우팅 전략

```
작업 난이도 판단
       │
       ├── 단순 (번역·요약·분류·파싱·이벤트 정보)
       │         → qwen/qwen-2.5-7b-instruct:free
       │           (무료, 일 1,000건 한도)
       │
       ├── 중간 (논평·다국어 번역·SEO·설명 생성)
       │         → qwen/qwen-2.5-72b-instruct
       │           ($0.13/MTok input, $0.39/MTok output)
       │
       └── 고품질 추론 (인사이트 기사·심층 분석)
                 → qwen/qwen3-235b-a22b:free
                   (무료, 추론 특화)
```

### 4.4 Rate Limit 관리

```
무료 모델 한도 (OpenRouter $10 충전 시 활성화)
  - 분당 20 req
  - 일일 1,000 req

SmartFarmNews 일일 사용량 추정:
  News   30건 × 3req(번역+요약+태그) = 90 req
  Market 30건 × 1req(파싱)          = 30 req
  합계                               = 120 req/day
  → 일일 한도 1,000건 이내 ✅

대응 설정:
  - 무료 모델 요청 간격: 3,000ms
  - 유료 모델 요청 간격: 500ms
  - Rate Limit 초과 시: Qwen-Pro 72B 자동 폴백
```

### 4.5 News Agent 상세 워크플로우

```
RSS 피드 파싱 (9개 소스)
        ↓
URL 중복 체크 (PostgreSQL)
        ↓
신규 기사 본문 크롤링 (Playwright)
        ↓
Qwen-Free → EN→KO 번역
        ↓
Qwen-Free → 3줄 요약
        ↓
Qwen-Free → 태그/카테고리 분류
        ↓
Qwen-Pro → 에디터 논평 1~2줄 생성
        ↓
articles 테이블 저장
        ↓
agent_logs 기록 (토큰 수, 비용, 소요시간)
```

### 4.6 Market Agent 상세 워크플로우

```
온비드 농기계 카테고리 크롤링 (Playwright)
        ↓
신규 공매 항목 파싱 (Qwen-Free)
        ↓
중복 제거 (auction_id 기준)
        ↓
Qwen-Pro → EN/ZH/VI 다국어 번역
        ↓
Qwen-Free → 바이어용 매물 설명 생성
        ↓
equipment / auction_data 테이블 저장
        ↓
알림 조건 매칭 → 구독자 이메일·카카오 발송
        ↓
매일 00:00 만료 공매 상태 업데이트
        ↓
매일 01:00 가격 통계 테이블 갱신
```

---

## 5. AI 클라이언트 구현 설계

### 5.1 파일 구조

```
src/utils/
├── qwenClient.js       OpenRouter Qwen 통합 클라이언트
├── qwenPrompts.js      전체 시스템 프롬프트 관리
└── qwenCostTracker.js  토큰 사용량 및 비용 추적
```

### 5.2 모델 정의 및 작업 매핑

```javascript
// utils/qwenClient.js
export const QWEN_MODELS = {
  FREE:   'qwen/qwen-2.5-7b-instruct:free',    // 번역·요약·분류
  PRO:    'qwen/qwen-2.5-72b-instruct',          // 논평·다국어·SEO
  REASON: 'qwen/qwen3-235b-a22b:free',           // 인사이트·추론
  CODER:  'qwen/qwen-2.5-coder-32b-instruct',    // 코딩 전용 (개발 시만)
};

const TASK_MODEL_MAP = {
  // 무료 (Qwen-Free)
  translate_ko:    QWEN_MODELS.FREE,
  summarize:       QWEN_MODELS.FREE,
  classify:        QWEN_MODELS.FREE,
  parse_data:      QWEN_MODELS.FREE,
  event_summary:   QWEN_MODELS.FREE,
  tag_extract:     QWEN_MODELS.FREE,

  // 유료 (Qwen-Pro 72B)
  commentary:      QWEN_MODELS.PRO,
  translate_zh:    QWEN_MODELS.PRO,
  translate_vi:    QWEN_MODELS.PRO,
  translate_en:    QWEN_MODELS.PRO,
  seo_meta:        QWEN_MODELS.PRO,
  description_gen: QWEN_MODELS.PRO,

  // 추론 (Qwen3-Reason, 무료)
  insight_article: QWEN_MODELS.REASON,
  deep_analysis:   QWEN_MODELS.REASON,
  paper_insight:   QWEN_MODELS.REASON,
};
```

### 5.3 작업별 토큰 설정

```javascript
const TASK_CONFIG = {
  translate_ko:    { maxTokens: 600,  temperature: 0.1 },
  summarize:       { maxTokens: 200,  temperature: 0.2 },
  classify:        { maxTokens: 50,   temperature: 0.0 },
  parse_data:      { maxTokens: 300,  temperature: 0.0 },
  commentary:      { maxTokens: 120,  temperature: 0.5 },
  translate_zh:    { maxTokens: 600,  temperature: 0.1 },
  translate_vi:    { maxTokens: 600,  temperature: 0.1 },
  translate_en:    { maxTokens: 600,  temperature: 0.1 },
  seo_meta:        { maxTokens: 150,  temperature: 0.3 },
  insight_article: { maxTokens: 1000, temperature: 0.4 },
  deep_analysis:   { maxTokens: 1500, temperature: 0.4 },
  event_summary:   { maxTokens: 300,  temperature: 0.2 },
  tag_extract:     { maxTokens: 60,   temperature: 0.0 },
};
```

### 5.4 비용 추적 Pricing 테이블

```javascript
const PRICING = {
  'qwen/qwen-2.5-7b-instruct:free':  { in: 0,        out: 0        },
  'qwen/qwen-2.5-72b-instruct':       { in: 0.000130, out: 0.000390 },
  'qwen/qwen3-235b-a22b:free':        { in: 0,        out: 0        },
  'qwen/qwen-2.5-coder-32b-instruct': { in: 0.000070, out: 0.000210 },
};
```

### 5.5 시스템 프롬프트 요약 (qwenPrompts.js)

| 프롬프트 키 | 용도 | 출력 형식 |
|------------|------|-----------|
| `TRANSLATE_KO` | EN→KO 번역 | 번역문만, 300자 이내 |
| `SUMMARIZE_NEWS` | 뉴스 3줄 요약 | `• 줄1\n• 줄2\n• 줄3` |
| `COMMENTARY` | 에디터 논평 | 1~2문장, 80자 이내 |
| `CLASSIFY_TAGS` | 태그 분류 | 쉼표 구분, 최대 3개 |
| `TRANSLATE_ZH` | KO→ZH 번역 | 번역문만 |
| `TRANSLATE_VI` | KO→VI 번역 | 번역문만 |
| `TRANSLATE_EN` | KO→EN 번역 | 번역문만 |
| `DESCRIPTION_GEN` | 매물 설명 생성 | 200자 이내 한국어 |
| `PAPER_EXTRACT` | 논문 핵심 추출 | `1. [제목]: [설명]` × 3 |
| `INSIGHT_ARTICLE` | 인사이트 기사 작성 | 헤드라인→리드→본문→결론 |
| `SEO_META` | SEO 메타 생성 | `제목: []\n설명: []` |
| `EVENT_SUMMARY` | 이벤트 요약 | 200자 이내 한국어 |

---

## 6. PostgreSQL DB 스키마

### 6.1 테이블 목록

```
smartfarmnews DB
├── news_sources            뉴스 소스 (RSS 피드 관리)
├── articles                기사 (News + Insights 통합)
├── equipment               중고농기계 매물
├── equipment_inquiries     매물 문의
├── equipment_price_stats   기종별 가격 통계
├── auction_data            온비드 공매 데이터
├── auction_alerts          공매 알림 구독
├── events                  박람회·컨퍼런스
├── subscribers             뉴스레터 구독자
└── agent_logs              Agent 실행 로그 (비용 추적 포함)
```

### 6.2 articles 테이블

```sql
id              SERIAL PRIMARY KEY
source_id       INTEGER REFERENCES news_sources(id)
title_ko        VARCHAR(500)
title_en        VARCHAR(500)
content_ko      TEXT
content_en      TEXT
summary         TEXT                  -- AI 3줄 요약
commentary      TEXT                  -- 에디터 논평
original_url    VARCHAR(1000)
source_name     VARCHAR(100)
menu_type       VARCHAR(20)           -- news | insights
tags            TEXT[]
seo_title       VARCHAR(100)          -- Insights용 SEO 제목
seo_description VARCHAR(200)          -- Insights용 SEO 설명
status          VARCHAR(20)           -- draft | published | archived
published_at    TIMESTAMP
view_count      INTEGER DEFAULT 0
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### 6.3 equipment 테이블

```sql
id              SERIAL PRIMARY KEY
title_ko        VARCHAR(300)
title_en        VARCHAR(300)
title_zh        VARCHAR(300)
title_vi        VARCHAR(300)
category        VARCHAR(100)          -- tractor | drone | combine ...
brand           VARCHAR(100)
model           VARCHAR(100)
year            INTEGER
condition       VARCHAR(50)
price_krw       BIGINT
price_usd       DECIMAL(12,2)
location        VARCHAR(200)
description_ko  TEXT
description_en  TEXT
description_zh  TEXT
description_vi  TEXT
images          TEXT[]
source          VARCHAR(50)           -- onbid | private | direct
source_url      VARCHAR(1000)
source_id       VARCHAR(200)          -- 온비드 공매번호 등
status          VARCHAR(20)           -- active | sold | expired
is_auction      BOOLEAN DEFAULT false
auction_end_at  TIMESTAMP
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

### 6.4 agent_logs 테이블 (비용 추적 확장)

```sql
id              SERIAL PRIMARY KEY
agent_name      VARCHAR(50)           -- news | insights | market | events
task_type       VARCHAR(50)           -- translate_ko | commentary | ...
model           VARCHAR(100)          -- 실제 사용 모델 ID
status          VARCHAR(20)           -- success | failed | partial
items_processed INTEGER DEFAULT 0
items_created   INTEGER DEFAULT 0
tokens_used     INTEGER DEFAULT 0     -- input + output 합계
cost_usd        DECIMAL(8,6)          -- 소수점 6자리 (소액 추적)
error_message   TEXT
duration_ms     INTEGER
executed_at     TIMESTAMP DEFAULT NOW()
```

> agent_logs에 `task_type`, `model` 컬럼 추가 (v1.0 대비 변경)

---

## 7. REST API 설계

### 7.1 Public API

```
# News / Insights
GET  /api/articles
     ?menu_type=news|insights
     &tag=agtech
     &search=스마트팜
     &sort=latest|popular
     &page=1&limit=20
GET  /api/articles/:id
GET  /api/articles/:id/related
POST /api/articles/:id/view

# Market
GET  /api/equipment
     ?category=tractor|drone
     &is_auction=true
     &price_min=0&price_max=50000000
     &page=1&limit=20
GET  /api/equipment/:id
GET  /api/equipment/auctions
GET  /api/equipment/price-stats
POST /api/equipment/:id/inquiry
POST /api/equipment/alerts

# Events
GET  /api/events?type=global|korea&year=2026&month=3
GET  /api/events/:id

# Subscribers
POST   /api/subscribe
DELETE /api/subscribe/:email
```

### 7.2 Admin API

```
# 인증
POST /api/admin/auth/login
POST /api/admin/auth/refresh
POST /api/admin/auth/logout

# 기사 관리
GET    /api/admin/articles
POST   /api/admin/articles
PUT    /api/admin/articles/:id
PATCH  /api/admin/articles/:id/publish
PATCH  /api/admin/articles/:id/archive
DELETE /api/admin/articles/:id

# 마켓 관리
GET    /api/admin/equipment
PUT    /api/admin/equipment/:id
PATCH  /api/admin/equipment/:id/status
GET    /api/admin/equipment/inquiries
PATCH  /api/admin/equipment/inquiries/:id

# Agent 모니터링
GET  /api/admin/agents/status
GET  /api/admin/agents/logs
GET  /api/admin/agents/cost          -- Qwen 비용 상세 포함
GET  /api/admin/agents/qwen-stats    -- 모델별 req 사용량
POST /api/admin/agents/:name/run

# 뉴스소스 관리
GET    /api/admin/sources
POST   /api/admin/sources
PUT    /api/admin/sources/:id
PATCH  /api/admin/sources/:id/toggle
DELETE /api/admin/sources/:id

# 대시보드
GET  /api/admin/dashboard/stats
GET  /api/admin/dashboard/recent
```

---

## 8. 프로젝트 디렉터리 구조

```
smartfarmnews/
├── package.json
├── .env.example
├── .env
├── pm2.config.js
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── db/
│   │   ├── schema.sql
│   │   └── migrations/
│   │
│   ├── api/
│   │   ├── app.js
│   │   ├── routes/
│   │   │   ├── articles.js
│   │   │   ├── equipment.js
│   │   │   ├── events.js
│   │   │   ├── subscribers.js
│   │   │   └── admin/
│   │   │       ├── auth.js
│   │   │       ├── articles.js
│   │   │       ├── equipment.js
│   │   │       ├── agents.js
│   │   │       ├── sources.js
│   │   │       └── dashboard.js
│   │   ├── controllers/
│   │   │   ├── articleController.js
│   │   │   ├── equipmentController.js
│   │   │   ├── eventController.js
│   │   │   └── admin/
│   │   │       ├── authController.js
│   │   │       ├── articleAdminController.js
│   │   │       ├── equipmentAdminController.js
│   │   │       ├── agentController.js
│   │   │       └── dashboardController.js
│   │   └── middleware/
│   │       ├── auth.js
│   │       ├── adminAuth.js
│   │       └── rateLimit.js
│   │
│   ├── agents/
│   │   ├── orchestrator.js
│   │   ├── newsAgent.js
│   │   ├── insightsAgent.js
│   │   ├── marketAgent.js
│   │   └── eventsAgent.js
│   │
│   ├── utils/
│   │   ├── qwenClient.js           ★ OpenRouter Qwen 통합 클라이언트
│   │   ├── qwenPrompts.js          ★ 시스템 프롬프트 관리
│   │   ├── qwenCostTracker.js      ★ 비용 추적
│   │   ├── crawler.js              Playwright 크롤러
│   │   ├── rssParser.js            RSS 파서
│   │   ├── emailSender.js          이메일 발송
│   │   └── kakaoAlert.js           카카오 알림
│   │
│   └── server.js
│
├── admin/                          React 18 + Vite 어드민
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Articles.jsx
│       │   ├── ArticleEdit.jsx
│       │   ├── Market.jsx
│       │   ├── Agents.jsx          ★ Qwen 비용 모니터링 포함
│       │   ├── Sources.jsx
│       │   └── Subscribers.jsx
│       └── components/
│           ├── layout/
│           │   ├── AdminLayout.jsx
│           │   ├── Sidebar.jsx
│           │   └── Header.jsx
│           ├── dashboard/
│           │   ├── StatsCards.jsx
│           │   ├── AgentStatusPanel.jsx
│           │   ├── QwenCostPanel.jsx   ★ 신규 추가
│           │   └── RecentArticles.jsx
│           ├── articles/
│           │   ├── ArticleList.jsx
│           │   ├── ArticleEditor.jsx
│           │   └── ArticleReview.jsx
│           └── market/
│               ├── EquipmentList.jsx
│               └── InquiryList.jsx
│
└── frontend/                       Next.js 공개 사이트
    ├── next.config.js
    └── src/
        └── app/
            ├── page.jsx
            ├── news/page.jsx
            ├── news/[slug]/page.jsx
            ├── insights/page.jsx
            ├── insights/[slug]/page.jsx
            ├── market/page.jsx
            ├── market/[id]/page.jsx
            ├── events/page.jsx
            └── events/[slug]/page.jsx
```

> ★ 표시: v1.0 대비 신규/변경 파일
> `gpt.js`, `translator.js`, `notebookLM.js` 제거 → `qwenClient.js` 통합

---

## 9. 어드민 대시보드

### 9.1 주요 화면 목록

| 경로 | 화면명 | 주요 기능 |
|------|--------|-----------|
| `/admin` | 대시보드 홈 | 주요 통계, Agent 상태, 최근 기사, Qwen 비용 |
| `/admin/articles` | 기사 관리 | 목록, 검색, 상태 필터 |
| `/admin/articles/new` | 기사 작성 | 에디터 |
| `/admin/articles/:id/edit` | 기사 수정 | AI 초안 검토, 발행 |
| `/admin/market` | 마켓 관리 | 매물 목록, 공매, 문의 처리 |
| `/admin/agents` | Agent 모니터링 | 실행 상태, Qwen 비용·req 현황 |
| `/admin/sources` | 뉴스소스 관리 | RSS 추가·수정·활성화 |
| `/admin/subscribers` | 구독자 관리 | 목록, 뉴스레터 발송 |

### 9.2 대시보드 홈 레이아웃

```
┌──────────────────────────────────────────────────────┐
│  SmartFarmNews Admin               [날짜] [로그아웃] │
├──────────┬───────────────────────────────────────────┤
│          │  📊 주요 지표 (4 카드)                    │
│ Sidebar  │  [기사수] [매물수] [구독자] [방문수]       │
│          │                                           │
│ 📰 기사  │  🤖 Agent 실행 현황                       │
│ 🚜 마켓  │  [News ✅] [Insights ✅] [Market ⏳]      │
│ 🤖 Agent │  [Events ✅]  마지막 실행: 09:00          │
│ 📡 소스  │                                           │
│ 👥 구독자│  💰 Qwen AI 비용 현황 (이번 달)           │
│          │  Free: 2,340req $0.00                     │
│          │  Pro:  180req  $0.08                      │
│          │  총계: $0.08 / 예산 $5.00 [█░░░░░] 1.6%  │
│          │                                           │
│          │  📝 검토 대기 기사 (draft)                │
│          │  [기사1] [발행] [수정] [삭제]             │
│          │  [기사2] [발행] [수정] [삭제]             │
└──────────┴───────────────────────────────────────────┘
```

---

## 10. 환경변수 (.env)

```bash
# 서버
PORT=3000
NODE_ENV=production

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartfarmnews
DB_USER=sfn_user
DB_PASSWORD=your_db_password

# ── OpenRouter (Qwen) ─────────────────────────────
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx

# Qwen 모델 ID
QWEN_MODEL_FREE=qwen/qwen-2.5-7b-instruct:free
QWEN_MODEL_PRO=qwen/qwen-2.5-72b-instruct
QWEN_MODEL_REASON=qwen/qwen3-235b-a22b:free
QWEN_MODEL_CODER=qwen/qwen-2.5-coder-32b-instruct

# Rate Limit 설정
QWEN_FREE_DELAY_MS=3000
QWEN_PRO_DELAY_MS=500
QWEN_FREE_DAILY_LIMIT=1000

# 비용 알림
MONTHLY_BUDGET_USD=5
COST_ALERT_EMAIL=admin@smartfarmnews.com

# ── DeepL (선택, 고품질 번역 필요 시) ─────────────
# DEEPL_API_KEY=your_deepl_key

# ── OpenAI (선택, 프리미엄 콘텐츠용) ──────────────
# OPENAI_API_KEY=sk-xxxxxxxx

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# 이메일 (뉴스레터)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# 카카오 (공매 알림)
KAKAO_API_KEY=your_kakao_key

# Redis (BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# 어드민
ADMIN_EMAIL=admin@smartfarmnews.com
ADMIN_PASSWORD=your_admin_password
```

---

## 11. 개발 로드맵

### Phase 1 — MVP 런칭 (0~3개월)

```
우선순위 순서:

① 인프라 셋업
   - Ubuntu 서버 + Nginx + PM2 구성
   - PostgreSQL 스키마 마이그레이션
   - Redis 설치 (BullMQ)
   - .env 설정 (OpenRouter API 키)

② AI 클라이언트 구현
   - qwenClient.js, qwenPrompts.js, qwenCostTracker.js
   - 단위 테스트: 번역·요약·논평 품질 확인 (10건 샘플)

③ News Agent 구현
   - RSS 파서 (9개 소스)
   - Playwright 크롤러
   - Qwen 번역·요약·태그·논평 파이프라인
   - articles 테이블 저장

④ Market Agent 구현
   - 온비드 Playwright 크롤러
   - Qwen 다국어 번역 (EN/ZH/VI)
   - equipment / auction_data 저장

⑤ 백엔드 API 서버
   - articles, equipment, events, subscribers 라우트
   - Admin 인증 (JWT)

⑥ 어드민 대시보드 핵심 기능
   - 기사 발행·수정
   - 마켓 관리
   - Qwen 비용 모니터링

⑦ Next.js 프론트엔드 기본 구조
   - /news, /market 페이지 우선

⑧ Nginx + PM2 배포
```

**목표**: 뉴스 자동 발행 + 마켓 매물 게시 운영 시작

---

### Phase 2 — 성장 (3~6개월)

```
- Insights Agent (Qwen3-Reason 기반)
- Events Agent 구현
- 뉴스레터 자동 발송 (주 1회)
- 카카오 알림 연동 (공매 알림)
- 한국어/영어 언어 전환 UI
- SEO 최적화 (sitemap, OG 태그, robots.txt)
- 구독자 관리 시스템
- A/B 테스트: Qwen vs DeepL 번역 품질 비교
```

**목표**: 전 메뉴 콘텐츠 자동화 완성, 구독자 1,000명

---

### Phase 3 — 수익화 (6~12개월)

```
- 유료 멤버십 (프리미엄 인사이트)
- 중고농기계 중개 수수료 체계 구축
- 동남아 바이어 DB 구축 (말레이시아 우선)
- 광고 시스템 (배너, 스폰서드 콘텐츠)
- 프롬프트 최적화 → 목표 월 비용 $1 이하
- 모바일 PWA
```

**목표**: 월 수익 발생, Agent 완전 자동화

---

### Phase 4 — 확장 (12개월+)

```
- 영문 서비스 독립 운영
- 동남아(말레이시아·베트남) 바이어 플랫폼
- 프리미엄 데이터 서비스 (AgTech 시장 리포트)
- AgTech 스타트업 IR 데이터 서비스
```

---

## 12. 비용 구조 총정리

### 12.1 AI 비용 (월)

```
처리량 기준:
  뉴스 900건 + 매물 900건 + 인사이트 90건 + 이벤트 60건
  총 약 2,000건/월

모델별 비용:
  Qwen-Free    (번역·요약·분류·파싱) : $0.00/월
  Qwen3-Reason (인사이트 기사)       : $0.00/월
  Qwen-Pro 72B (논평·다국어·SEO)     : $0.09/월

─────────────────────────────────
총 월 AI 비용: 약 $0.09 ~ $0.50
(v1.0 GPT-4o $216/월 대비 99.8% 절감)
─────────────────────────────────
OpenRouter 크레딧 $10 최초 충전 → 무료 모델 활성화 + 수년 운영 가능
```

### 12.2 인프라 비용 (별도)

| 항목 | 예상 비용/월 |
|------|-------------|
| VPS (Ubuntu 22.04, 4core/8GB) | $20~40 |
| 도메인 (smartfarmnews.com) | ~$1.5 |
| 이메일 발송 (SES 등) | $1~3 |
| **합계** | **$22~$45/월** |

---

## 13. 리스크 관리

| 리스크 | 발생 가능성 | 대응 방안 |
|--------|------------|-----------|
| Qwen 무료 모델 정책 변경 | 중간 | Qwen-Pro 72B 폴백 (월 $5 이내 유지) |
| OpenRouter 서비스 장애 | 낮음 | BullMQ retry (최대 3회, 5분 간격) |
| 온비드 크롤링 차단 | 중간 | User-Agent 로테이션, 요청 간격 조정 |
| 번역 품질 이슈 (VI) | 중간 | 초기 에디터 검토 강화, 추후 전문가 검수 |
| Rate Limit 초과 | 낮음 | 자동 폴백 로직 구현, 딜레이 3초 설정 |
| Qwen3-235B:free 유료 전환 | 중간 | Qwen-Pro 72B 대체 시 월 +$5 수준 |

---

## 14. 핵심 차별화 포인트

| 차별점 | 내용 |
|--------|------|
| AI 완전 자동화 | 2인 팀으로 일 30~50건 뉴스 발행 |
| 극저비용 운영 | AI 비용 월 $0.50 이하 (경쟁 서비스 대비 99% 저렴) |
| 실시간 공매 DB | 온비드 농기계 공매 단독 큐레이션 |
| 다국어 중개 | EN/ZH/VI 번역 → 글로벌 바이어 연결 (ZH는 GPT-4o 능가) |
| 논문 기반 인사이트 | Qwen3-Reason 기반, 국내 유일 |
| 한/영 이중 운영 | 글로벌 독자 + 국내 독자 동시 공략 |

---

## 15. 즉시 실행 체크리스트

### Step 1 — OpenRouter 설정 (1일 내)
```
□ openrouter.ai 계정 가입
□ API 키 발급
□ 크레딧 $10 충전 (무료 모델 일 1,000req 활성화)
□ .env 파일 OPENROUTER_API_KEY 설정
□ npm install openai  (OpenRouter는 OpenAI SDK 호환)
□ qwenClient.js, qwenPrompts.js, qwenCostTracker.js 파일 생성
```

### Step 2 — News Agent 구현 및 검증 (3~5일)
```
□ newsAgent.js Qwen 기반으로 구현
□ 번역 품질 샘플 테스트 10건 (한국어 자연스러움 확인)
□ 요약·논평 품질 확인
□ agent_logs 비용 추적 확인
□ Rate Limit 딜레이 3초 설정 확인
```

### Step 3 — 전체 Agent 전환 (1~2주)
```
□ marketAgent.js 다국어 번역 적용
□ insightsAgent.js Qwen3-Reason 적용
□ eventsAgent.js Qwen-Free 적용
□ 어드민 대시보드 Qwen 비용 모니터링 화면 추가
□ 월말 비용 리포트 이메일 자동 발송 설정
```

### Step 4 — 최적화 (1개월 후)
```
□ 프롬프트 A/B 테스트 결과 반영
□ 불필요한 Pro 모델 호출 Free로 전환
□ 토큰 수 최적화 (프롬프트 압축)
□ 월 비용 리뷰 → 목표 $0.50 이하 달성 확인
```

---

*문서 끝 — SmartFarmNews.com 최종 개발 기획서 v3.0*
*v1.0 + v2.0 통합 | 2026-03-02*
