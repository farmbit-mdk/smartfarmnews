# SmartFarmNews.com — 마스터 기획서 v4.0

> **도메인**: smartfarmnews.com
> **버전**: v4.0 (최종 통합본)
> **작성일**: 2026-03-02
> **포지셔닝**: *"Asia's AgTech & FoodTech Intelligence Platform"*
> **운영 규모**: 2인 팀 + AI Agent 자동화
> **언어 전략**: **국문(KO) + 영문(EN) 동시 운영** → 동남아 언어 단계적 확장

---

## 1. 프로젝트 개요

### 1.1 한 줄 정의

> 한국과 동남아를 잇는 **AI 자동화 기반 애그테크·푸드테크 전문 미디어 + B2B 마켓플레이스**

### 1.2 핵심 목표

| # | 목표 | 지표 |
|---|------|------|
| 1 | 국내+동남아 AgTech 전문 미디어 1위 | MAU 10만명 (12개월) |
| 2 | 2인 팀으로 AI 완전 자동화 운영 | 일 50건+ 콘텐츠 자동 발행 |
| 3 | 중고농기계 동남아 수출 중개 수익 | 월 수익 $2,000+ (12개월) |
| 4 | KO/EN 이중 언어 → 동남아 언어 확장 기반 마련 | VI/TH/ID Phase 2 준비 |

### 1.3 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| **서버 OS** | Linux (Ubuntu 22.04 LTS) | |
| **백엔드** | Node.js + Express.js | API 서버 |
| **데이터베이스** | PostgreSQL | 메인 DB |
| **프론트엔드** | Next.js (App Router, SSG/ISR) | SEO 최적화 |
| **어드민** | React + Vite + shadcn/ui | 관리자 대시보드 |
| **AI 모델** | OpenRouter Qwen (전 작업) | 월 $1~3 |
| **작업 큐** | BullMQ + Redis | Agent 스케줄링 |
| **프로세스 관리** | PM2 | 서버 운영 |
| **웹서버** | Nginx | 리버스 프록시 |
| **크롤링** | Playwright | 동적 페이지 |
| **인사이트 도구** | Google NotebookLM | 논문 분석 |

---

## 2. 시장 근거

### 2.1 핵심 시장 데이터

| 지표 | 수치 |
|------|------|
| 동남아 농업 시장 규모 (2025) | **$1,530억+** |
| 글로벌 AgTech 플랫폼 시장 (2024→2033) | $190억 → **$922억** (CAGR 19%) |
| APAC AgriFoodTech 누적 투자 (2014~) | **$870억+** |
| K-스마트팜 수출액 (2023) | **$2.96억** (전년比 2배↑) |
| 동남아 농업 종사자 | **1억 명+** |

### 2.2 경쟁 공백 (블루오션)

```
글로벌 AgTech 미디어 현황:
  AgFunderNews  → 영어, 미국/유럽 중심, APAC 커버 부족
  HortiDaily    → 영어, 유럽 원예 특화
  The Spoon     → 영어, 푸드테크, 미국 중심
  e27           → 영어, SEA IT 스타트업 (농업 전문 아님)

공백: 동남아 특화 AgTech 전문 미디어 = 사실상 없음 ✅
SmartFarmNews 포지션 = 이 공백 선점
```

### 2.3 핵심 타겟 독자

| 페르소나 | 설명 | 사용 언어 |
|---------|------|---------|
| 국내 AgTech 종사자 | 스마트팜 기업, 연구자, 정책 담당자 | **KO** |
| K-AgTech 수출 담당자 | 동남아 진출 국내 기업 해외사업팀 | **KO + EN** |
| 동남아 AgTech 창업자 | VN/ID/TH 스타트업 대표·직원 | **EN** |
| 동남아 농업 투자자 | VC, 농업 펀드, ADB 관련 기관 | **EN** |
| 글로벌 농기계 바이어 | 동남아 농기계 딜러, 수입상 | **EN** |

---

## 3. 메인 메뉴 구조 (최종 확정)

> **초기 운영**: KO + EN 2개 언어
> **Phase 2**: 베트남어(VI) 추가
> **Phase 3**: 태국어(TH) + 인도네시아어(ID) 추가

```
smartfarmnews.com
│
├── 📰 News        /news        글로벌+동남아 AgTech 뉴스
├── 🔬 Insights    /insights    심층 분석·논문 인사이트·리포트
├── 🚜 Market      /market      중고농기계 동남아 수출 마켓
└── 📅 Events      /events      아시아·글로벌 박람회·컨퍼런스

[언어 토글]: KO ↔ EN  (헤더 우측 상단)
[구독 버튼]: Newsletter 구독 CTA
```

---

## 4. 메뉴별 상세 기획

### 4.1 📰 News

**개념**: 글로벌 + 동남아 AgTech/FoodTech 뉴스를 AI가 수집·번역·논평하여 KO/EN으로 매일 발행

#### 콘텐츠 소스

**글로벌 소스 (기존)**

| 소스 | URL | 분야 |
|------|-----|------|
| HortiDaily | hortidaily.com | 원예·수직농업 |
| AgFunderNews | agfundernews.com | 투자·스타트업 |
| FreshPlaza | freshplaza.com | 신선농산물 |
| The Spoon | thespoon.tech | 푸드테크 |
| FoodNavigator | foodnavigator.com | 식품 규제·트렌드 |

**동남아/아시아 소스 (신규)**

| 소스 | URL | 분야 |
|------|-----|------|
| e27 | e27.co | SEA 스타트업 |
| TechCollective SEA | techcollectivesea.com | SEA 농업기술 |
| GrowAsia | growasia.org | ASEAN 농업 혁신 |
| Agro Spectrum Asia | agrospectrumasia.com | 아시아 농업 시장 |
| 농식품부 보도자료 | mafra.go.kr | K-AgTech 글로벌화 |

#### 서브 태그
`#SmartFarm` `#FoodTech` `#VerticalFarm` `#Drone` `#Investment` `#SEA` `#K-AgTech` `#Policy` `#Vietnam` `#Indonesia` `#Thailand`

#### KO/EN 운영 방식

```
영어 원문 기사
    ↓
[EN 버전]                    [KO 버전]
AI 에디터 논평 (EN)          AI 한국어 번역 + 논평 (KO)
/news/[slug]                 /ko/news/[slug]
```

#### 발행 스케줄
- 매일 07:00 KST 자동 발행 (전일 수집분)
- 주 1회 (월요일) 주간 뉴스레터 발송 (EN/KO 각각)

#### URL 구조
```
/news                    → EN 뉴스 목록
/ko/news                 → KO 뉴스 목록
/news/[slug]             → EN 기사 상세
/ko/news/[slug]          → KO 기사 상세
/news?tag=sea            → 동남아 뉴스 필터
/news?tag=k-agtech       → K-AgTech 필터
```

---

### 4.2 🔬 Insights

**개념**: 글로벌 논문·리포트를 NotebookLM으로 분석하여 KO/EN 인사이트 기사 생성. 동남아 국가별 심층 리포트 포함.

#### 콘텐츠 유형

| 유형 | 설명 | 언어 | 주기 |
|------|------|------|------|
| **Tech Deep Dive** | 수직농업·드론·정밀농업 기술 분석 | EN/KO | 주 2~3회 |
| **Paper Insight** | 논문 기반 인사이트 (NotebookLM) | EN/KO | 주 2~3회 |
| **Country Report** | 동남아 국가별 AgTech 현황 분석 | EN/KO | 월 1회 |
| **Investment Watch** | 동남아 AgTech 투자 딜 트래킹 | EN | 주 1회 |
| **K-AgTech Global** | K-AgTech 기업 동남아 진출 사례 | KO/EN | 주 1~2회 |

#### NotebookLM 워크플로우

```
① 논문/리포트 자동 수집
   arXiv, MDPI, KREI, ADB Reports, ISEAS, ASEAN 문서
         ↓
② NotebookLM 업로드
         ↓
③ 핵심 인사이트 3가지 추출 + FAQ 요약
         ↓
④ Qwen3-235B → EN 기사 초안 (800~1,200자)
         ↓
⑤ Qwen-Pro 72B → KO 번역
         ↓
⑥ SEO 메타 생성 (제목/설명)
         ↓
⑦ 에디터 검토 (10~15분) → 발행
```

#### 유료화 구조 (Phase 2 이후)

```
🔓 Free
   - 뉴스 전체
   - 인사이트 요약 (도입부만)

💎 Premium ($29/월 or $199/년)
   - 인사이트 전문 열람
   - 국가별 Monthly Report PDF
   - 투자 딜 데이터베이스
   - 주간 인텔리전스 뉴스레터

🏢 Enterprise ($299/월)
   - 커스텀 리포트 요청
   - K-AgTech ↔ 동남아 기업 매칭
   - 광고/PR 패키지
```

#### URL 구조
```
/insights                  → EN 인사이트 목록
/ko/insights               → KO 인사이트 목록
/insights/[slug]           → EN 인사이트 상세
/insights/reports          → 국가별 리포트 목록
/insights/reports/vietnam  → 베트남 AgTech 리포트
```

---

### 4.3 🚜 Market

**개념**: 한국 중고농기계(공매+민간 매물)를 동남아 바이어에게 연결하는 B2B 수출 마켓플레이스

#### 타겟 바이어 (국가별)

| 국가 | 관심 기종 | 이유 |
|------|---------|------|
| 🇻🇳 베트남 | 트랙터, 이앙기, 수확기 | 쌀농사 기계화 급성장 |
| 🇮🇩 인도네시아 | 트랙터, 드론, 스프레이어 | 대규모 팜 운영 |
| 🇹🇭 태국 | 콤바인, 트랙터 | 수출농업 고도화 |
| 🇵🇭 필리핀 | 이앙기, 드론방제기 | 쌀·사탕수수 |
| 🇲🇲 미얀마 | 경운기, 소형트랙터 | 기초 기계화 초기 |

#### 데이터 소스

| 소스 | 유형 | 운영 |
|------|------|------|
| 온비드 | 공공 경매 | Agent 자동 크롤링 |
| 민간 중고 사이트 | 민간 매물 | Agent 수집 |
| 직접 등록 | 판매자 업로드 | 자체 폼 |

#### 핵심 기능

| 기능 | KO | EN | 비고 |
|------|----|----|------|
| 매물 목록/상세 | ✅ | ✅ | 이중 언어 |
| 공매 큐레이션 | ✅ | ✅ | 온비드 자동 수집 |
| 가격 통계 | ✅ | ✅ | 기종별 낙찰가 히스토리 |
| 구매 문의 | ✅ | ✅ | 이메일+카카오 |
| 공매 알림 | ✅ | ✅ | 관심 기종 등록 |
| 다국어 매물 설명 | - | EN (기본) | VI/TH는 Phase 2 |

#### 수익 모델

```
매칭 수수료:      거래 성사 시 2~5%
프리미엄 리스팅:  바이어 노출 우선 $50~200/건
바이어 DB 구독:   동남아 딜러 연락처 $99/월 (Enterprise)
```

#### URL 구조
```
/market                    → 매물 목록 (EN 메인)
/ko/market                 → 매물 목록 (KO)
/market/[id]               → 매물 상세
/market/auctions           → 진행 중 공매
/market/price-stats        → 기종별 가격 통계
/market/register           → 매물 직접 등록
```

---

### 4.4 📅 Events

**개념**: 아시아·동남아 중심으로 글로벌 농업·푸드테크 박람회·컨퍼런스 정보 제공

#### 주요 이벤트 목록

**동남아/아시아 핵심 (우선)**

| 이벤트 | 국가 | 시기 | 특징 |
|--------|------|------|------|
| **Agritechnica Asia** | VN/TH 교차 | 격년 | 동남아 최대 농기계 전시 |
| **Growtech Vietnam** | 🇻🇳 호치민 | 연 1회 | B2B 농업기술 |
| **Agri Vietnam** | 🇻🇳 | 연 1회 | 스마트팜 트렌드 |
| **HortEx Vietnam** | 🇻🇳 | 연 1회 | 원예·수직농장 |
| **IDMA Indonesia** | 🇮🇩 자카르타 | 연 1회 | 농기계·아그리비즈 |
| **Asia-Pacific Agri-Food Summit** | 🇸🇬 싱가포르 | 연 1회 | 투자·스타트업 |
| **Grow Asia Innovators Gathering** | ASEAN 순환 | 연 1회 | ASEAN 스타트업 |

**글로벌 (유지)**

| 이벤트 | 국가 | 시기 |
|--------|------|------|
| Fruit Logistica | 🇩🇪 베를린 | 2월 |
| GreenTech Amsterdam | 🇳🇱 | 6월 |
| AgriTechnica | 🇩🇪 하노버 | 격년 11월 |
| World Agri-Tech Summit | 🇺🇸 | 연 1회 |
| KIEMSTA | 🇰🇷 천안 | 격년 |
| Seoul Food | 🇰🇷 서울 | 연 1회 |

#### URL 구조
```
/events                    → 이벤트 캘린더 (EN)
/ko/events                 → 이벤트 캘린더 (KO)
/events/[slug]             → 이벤트 상세
/events?region=sea         → 동남아 필터
/events?region=global      → 글로벌 필터
```

---

## 5. 언어 전략

### 5.1 초기 운영: KO + EN (Phase 1)

```
EN (영문) ───────────────────────────────────────────────
  - 모든 콘텐츠의 영문 버전 제공
  - 글로벌/동남아 독자 타겟
  - SEO: 영어 키워드 최적화
  - URL: /news, /insights, /market, /events

KO (국문) ───────────────────────────────────────────────
  - 모든 콘텐츠의 한국어 버전 제공
  - 국내 독자 + K-AgTech 기업 타겟
  - SEO: 한국어 키워드 최적화
  - URL: /ko/news, /ko/insights, /ko/market, /ko/events

[헤더 언어 토글]: EN | KO
→ 선택 언어 쿠키 저장 (재방문 시 유지)
```

### 5.2 단계별 언어 확장 로드맵

```
Phase 1 (0~6개월)   EN + KO        ← 현재 목표
Phase 2 (6~12개월)  + VI (베트남어) ← 동남아 현장 기반 확보 후
Phase 3 (12~18개월) + TH + ID      ← 트래픽 검증 후 확장
```

### 5.3 Qwen 번역 품질 (언어별)

| 언어 | Qwen 품질 | 사용 모델 | 초기 적용 |
|------|----------|---------|--------|
| EN ↔ KO | ⭐⭐⭐⭐⭐ | Qwen-Free :free | ✅ Phase 1 |
| EN ↔ VI | ⭐⭐⭐⭐ | Qwen-Pro 72B | Phase 2 |
| EN ↔ TH | ⭐⭐⭐⭐ | Qwen-Pro 72B | Phase 3 |
| EN ↔ ID | ⭐⭐⭐⭐ | Qwen-Pro 72B | Phase 3 |

---

## 6. AI Agent 오케스트레이션

### 6.1 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│              Orchestrator (BullMQ + LangGraph)          │
└──────┬──────────┬──────────┬──────────┬─────────────────┘
       │          │          │          │
  ┌────▼───┐ ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
  │ News   │ │Insights│ │ Market │ │ Events │
  │ Agent  │ │ Agent  │ │ Agent  │ │ Agent  │
  └────────┘ └────────┘ └────────┘ └────────┘
       │          │          │          │
  ┌────▼──────────▼──────────▼──────────▼────┐
  │              PostgreSQL DB               │
  │   articles / equipment / events /        │
  │   subscribers / agent_logs               │
  └──────────────────────────────────────────┘
```

### 6.2 Agent별 상세

#### 🤖 News Agent
- **실행**: 매 2시간
- **역할**: 글로벌+동남아 RSS 수집 → EN/KO 번역+논평 → 발행
- **Qwen 모델**:
  - EN 논평: Qwen3-235B:free
  - KO 번역: Qwen-Free:free
  - KO 논평: Qwen-Pro 72B

```
RSS 파싱 (10개 소스)
    ↓ URL 중복 체크
본문 크롤링 (Playwright)
    ↓
EN 버전: 에디터 논평 생성 (Qwen3:free)
KO 버전: 한국어 번역 (Qwen-Free) + 논평 (Qwen-Pro)
    ↓
태그 분류 (Qwen-Free)
    ↓
articles 테이블 저장 (EN/KO 동시)
    ↓
agent_logs 기록
```

#### 🤖 Insights Agent
- **실행**: 매일 06:00 KST
- **역할**: 논문/리포트 수집 → NotebookLM → EN 기사 → KO 번역
- **Qwen 모델**:
  - 핵심 포인트 추출: Qwen-Free:free
  - EN 기사 작성: Qwen3-235B:free
  - KO 번역: Qwen-Pro 72B
  - SEO 메타: Qwen-Pro 72B

#### 🤖 Market Agent
- **실행**: 매일 09:00 KST
- **역할**: 온비드 크롤링 → EN 번역 → 바이어 알림
- **Qwen 모델**:
  - EN 매물 번역: Qwen-Pro 72B (정확도 중요)
  - 설명 생성: Qwen-Free:free
  - 가격 파싱: Rule-based (LLM 불필요)

#### 🤖 Events Agent
- **실행**: 월·목 10:00 KST
- **역할**: 글로벌/동남아 이벤트 수집 → EN/KO 요약
- **Qwen 모델**:
  - 요약: Qwen-Free:free
  - KO 번역: Qwen-Free:free

### 6.3 Agent 스케줄 + 예상 비용

| Agent | 주기 | 처리량 | 월 AI 비용 |
|-------|------|--------|----------|
| News Agent | 2시간마다 | 30~50건/일 | ~$0.01 |
| Insights Agent | 매일 06:00 | 3~5건/일 | ~$0.02 |
| Market Agent | 매일 09:00 | 10~30건/일 | ~$0.04 |
| Events Agent | 주 2회 | 5~10건/회 | ~$0.002 |
| **합계** | | **약 2,000건/월** | **~$0.07/월** |

---

## 7. OpenRouter Qwen 모델 설정

### 7.1 사용 모델 4종

| 역할 | 모델 ID | 비용 | 용도 |
|------|---------|------|------|
| **Qwen-Free** | `qwen/qwen-2.5-7b-instruct:free` | $0 | 번역·요약·분류 |
| **Qwen-Pro** | `qwen/qwen-2.5-72b-instruct` | $0.13/MTok | 논평·EN번역·SEO |
| **Qwen3-Reason** | `qwen/qwen3-235b-a22b:free` | $0 | 인사이트 기사 작성 |
| **Qwen-Coder** | `qwen/qwen-2.5-coder-32b-instruct` | $0.07/MTok | 개발 시만 사용 |

### 7.2 무료 모델 Rate Limit 관리

```
조건: OpenRouter 크레딧 $10 이상 충전
  → :free 모델 하루 1,000 req/day
  → 분당 20 req/min

SmartFarmNews 일일 처리량:
  News   40건 × 3req = 120 req
  Market 20건 × 1req =  20 req
  합계   140 req/day → 한도 이내 ✅

딜레이 설정: :free 모델 요청 간 3초 간격
```

### 7.3 비용 요약

```
월 처리량: 약 2,000건
Qwen-Free (무료):   번역·요약·분류 → $0.00
Qwen3-Reason (무료): 인사이트 기사 → $0.00
Qwen-Pro 72B (유료): 논평·EN번역   → ~$0.07
────────────────────────────────────
월 총 AI 비용: 약 $0.07~0.50
(크레딧 $10 충전으로 약 2년치 운영 가능)
```

---

## 8. PostgreSQL DB 스키마

### 8.1 테이블 목록

```
smartfarmnews DB
├── news_sources           뉴스 소스 (RSS 피드)
├── articles               기사 (News + Insights, KO+EN)
├── equipment              중고농기계 매물
├── equipment_inquiries    매물 문의
├── equipment_price_stats  기종별 가격 통계
├── auction_data           온비드 공매
├── auction_alerts         공매 알림 구독
├── events                 박람회·컨퍼런스 (KO+EN)
├── subscribers            뉴스레터 구독자
└── agent_logs             Agent 실행 로그
```

### 8.2 핵심 테이블: `articles` (KO/EN 이중 언어)

```sql
CREATE TABLE articles (
  id              SERIAL PRIMARY KEY,
  source_id       INTEGER REFERENCES news_sources(id),

  -- 영문 (EN)
  title_en        VARCHAR(500),
  content_en      TEXT,
  summary_en      TEXT,
  commentary_en   TEXT,
  seo_title_en    VARCHAR(160),
  seo_desc_en     VARCHAR(320),

  -- 국문 (KO)
  title_ko        VARCHAR(500),
  content_ko      TEXT,
  summary_ko      TEXT,
  commentary_ko   TEXT,

  -- 공통
  original_url    VARCHAR(1000),
  source_name     VARCHAR(100),
  menu_type       VARCHAR(20),   -- news | insights
  tags            TEXT[],
  region          VARCHAR(50),   -- global | sea | vietnam | indonesia ...
  is_k_agtech     BOOLEAN DEFAULT false,
  status          VARCHAR(20),   -- draft | published | archived
  published_at    TIMESTAMP,
  view_count_en   INTEGER DEFAULT 0,
  view_count_ko   INTEGER DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### 8.3 핵심 테이블: `equipment` (EN 중심)

```sql
CREATE TABLE equipment (
  id              SERIAL PRIMARY KEY,

  -- 국문
  title_ko        VARCHAR(300),
  description_ko  TEXT,

  -- 영문 (바이어용 메인)
  title_en        VARCHAR(300),
  description_en  TEXT,

  -- 스펙
  category        VARCHAR(100),  -- tractor | drone | combine ...
  brand           VARCHAR(100),
  model           VARCHAR(100),
  year            INTEGER,
  condition       VARCHAR(50),   -- good | fair | poor

  -- 가격
  price_krw       BIGINT,
  price_usd       DECIMAL(12,2),

  -- 소재지/출처
  location        VARCHAR(200),
  source          VARCHAR(50),   -- onbid | private | direct
  source_url      VARCHAR(1000),
  source_id       VARCHAR(200),

  -- 상태
  images          TEXT[],
  status          VARCHAR(20),   -- active | sold | expired
  is_auction      BOOLEAN DEFAULT false,
  auction_end_at  TIMESTAMP,

  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### 8.4 핵심 테이블: `events` (KO/EN)

```sql
CREATE TABLE events (
  id              SERIAL PRIMARY KEY,
  title_en        VARCHAR(300),
  title_ko        VARCHAR(300),
  description_en  TEXT,
  description_ko  TEXT,
  event_type      VARCHAR(50),   -- global | sea | korea
  region          VARCHAR(100),  -- sea | europe | usa | korea
  country         VARCHAR(100),
  start_date      DATE,
  end_date        DATE,
  location        VARCHAR(300),
  official_url    VARCHAR(1000),
  registration_url VARCHAR(1000),
  image_url       VARCHAR(1000),
  status          VARCHAR(20),   -- upcoming | ongoing | ended
  created_at      TIMESTAMP DEFAULT NOW()
);
```

---

## 9. REST API 설계

### 9.1 Public API (프론트엔드용)

```
# 언어 파라미터: ?lang=en|ko (기본값 en)

GET /api/articles?lang=en&menu_type=news&tag=sea&page=1&limit=20
GET /api/articles/:id?lang=en
GET /api/articles/:id/related?lang=en
POST /api/articles/:id/view

GET /api/equipment?lang=en&category=tractor&page=1&limit=20
GET /api/equipment/:id?lang=en
GET /api/equipment/auctions?lang=en
GET /api/equipment/price-stats
POST /api/equipment/:id/inquiry
POST /api/equipment/alerts

GET /api/events?lang=en&region=sea
GET /api/events/:id?lang=en

POST /api/subscribe
```

### 9.2 Admin API

```
POST   /api/admin/auth/login
GET    /api/admin/articles?lang=en|ko|all
POST   /api/admin/articles
PUT    /api/admin/articles/:id
PATCH  /api/admin/articles/:id/publish
DELETE /api/admin/articles/:id

GET    /api/admin/equipment
PUT    /api/admin/equipment/:id

GET    /api/admin/agents/status
GET    /api/admin/agents/logs
GET    /api/admin/agents/cost
POST   /api/admin/agents/:name/run

GET    /api/admin/dashboard/stats
```

---

## 10. 프로젝트 디렉터리 구조

```
smartfarmnews/
├── package.json
├── .env
├── .env.example
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
│   │   │       └── dashboard.js
│   │   ├── controllers/
│   │   │   ├── articleController.js
│   │   │   ├── equipmentController.js
│   │   │   ├── eventController.js
│   │   │   └── admin/
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
│   │   ├── qwenClient.js       ← OpenRouter Qwen 통합 클라이언트
│   │   ├── qwenPrompts.js      ← 전체 프롬프트 (EN/KO)
│   │   ├── crawler.js
│   │   ├── rssParser.js
│   │   ├── notebookLM.js
│   │   ├── emailSender.js
│   │   └── kakaoAlert.js
│   │
│   └── server.js
│
├── admin/                      ← 어드민 대시보드 (React + Vite)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api/client.js
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Articles.jsx      ← EN/KO 탭 전환
│       │   ├── ArticleEdit.jsx
│       │   ├── Market.jsx
│       │   ├── Agents.jsx
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
│           │   ├── CostMonitor.jsx  ← Qwen 비용 추적
│           │   └── RecentArticles.jsx
│           └── articles/
│               ├── ArticleList.jsx
│               ├── ArticleEditor.jsx  ← EN/KO 탭
│               └── LangToggle.jsx     ← 언어 전환 컴포넌트
│
└── frontend/                   ← 공개 사이트 (Next.js)
    ├── next.config.js
    └── src/
        ├── app/
        │   ├── layout.jsx          ← 공통 레이아웃
        │   ├── page.jsx            ← 홈 (EN)
        │   ├── news/
        │   │   ├── page.jsx        ← 뉴스 목록 (EN)
        │   │   └── [slug]/page.jsx
        │   ├── insights/
        │   ├── market/
        │   ├── events/
        │   └── ko/                 ← 한국어 라우트
        │       ├── page.jsx        ← 홈 (KO)
        │       ├── news/
        │       ├── insights/
        │       ├── market/
        │       └── events/
        └── components/
            ├── Header.jsx          ← 언어 토글 포함
            ├── Footer.jsx
            ├── LangSwitcher.jsx    ← EN/KO 전환 버튼
            └── common/
                ├── ArticleCard.jsx
                ├── EquipmentCard.jsx
                └── EventCard.jsx
```

---

## 11. UI/UX 기획

### 11.1 헤더 구조 (PC)

```
┌──────────────────────────────────────────────────────────┐
│ 🌱 SmartFarmNews   News  Insights  Market  Events        │
│                                      [EN|KO]  [Subscribe]│
└──────────────────────────────────────────────────────────┘
```

### 11.2 홈페이지 레이아웃

```
[헤더 + 네비게이션]
         ↓
[히어로: 오늘의 주요 뉴스 (EN/KO 자동 전환)]
         ↓
[최신 뉴스 그리드 3열]
  - Thumbnail / Tag / Title / 날짜 / 언어 배지
         ↓
[인사이트 추천 2열]
  - "Deep Dive" / "Country Report" 구분
         ↓
[SEA Spotlight 배너]
  - 동남아 국가별 최신 동향 카드 (VN/ID/TH/PH/MY)
         ↓
[마켓 HOT 매물 슬라이더]
  - 이미지 / 기종 / 가격 / 국가 배지
         ↓
[다가오는 이벤트 리스트]
  - 날짜 / 이벤트명 / 국가 플래그
         ↓
[뉴스레터 구독 CTA]
  "Get Weekly SEA AgTech Intelligence — Free"
         ↓
[푸터 (소셜 링크, 언어 전환, 구독)]
```

### 11.3 모바일 하단 탭

```
┌──────────────────────────────────────┐
│  🏠 Home │ 📰 News │ 🚜 Market │ 🔔  │
└──────────────────────────────────────┘
```

### 11.4 언어 전환 동작

```
URL 구조:
  EN: smartfarmnews.com/news/[slug]
  KO: smartfarmnews.com/ko/news/[slug]

헤더 [EN|KO] 클릭 시:
  → 현재 페이지의 동일 콘텐츠 반대 언어 버전으로 이동
  → 쿠키에 언어 선호도 저장 (7일)

SEO 처리:
  <link rel="alternate" hreflang="en" href="/news/[slug]" />
  <link rel="alternate" hreflang="ko" href="/ko/news/[slug]" />
```

---

## 12. 어드민 대시보드 기획

### 12.1 주요 화면

| 경로 | 화면 | 주요 기능 |
|------|------|---------|
| `/admin` | 대시보드 홈 | 통계 카드, Agent 상태, 최근 기사, Qwen 비용 |
| `/admin/articles` | 기사 관리 | EN/KO 탭 전환, 목록, 발행/보관 |
| `/admin/articles/new` | 기사 작성 | EN/KO 동시 편집, AI 초안 생성 |
| `/admin/articles/:id` | 기사 수정 | 수정, 발행, AI 재생성 |
| `/admin/market` | 마켓 관리 | 매물, 공매, 문의 처리 |
| `/admin/agents` | Agent 모니터링 | 실행 상태, 비용, 로그, 수동 실행 |
| `/admin/sources` | 뉴스소스 관리 | RSS 추가/수정/활성화 |
| `/admin/subscribers` | 구독자 관리 | 목록, 뉴스레터 발송 |

### 12.2 대시보드 홈 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  SmartFarmNews Admin              [2026-03-02] [로그아웃]│
├──────────┬──────────────────────────────────────────────┤
│          │  📊 통계 카드 4개                             │
│ Sidebar  │  [기사 총수] [매물 총수] [구독자] [월방문자]  │
│          │                                              │
│ 📰 기사  │  🤖 Agent 실행 현황                          │
│ 🚜 마켓  │  News ✅ 11:00  Insights ✅ 06:00            │
│ 🤖 Agent │  Market ✅ 09:00  Events ✅ 월10:00          │
│ 📡 소스  │  이번달 AI 비용: $0.08 / 예산 $5.00 [██░░░]  │
│ 👥 구독자│                                              │
│          │  📝 검토 대기 기사 (draft)                   │
│          │  [EN] 기사1 [발행EN] [발행KO] [수정] [삭제]  │
│          │  [KO] 기사2 [발행KO] [수정] [삭제]           │
└──────────┴──────────────────────────────────────────────┘
```

### 12.3 어드민 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 빌드 | Vite | 빠른 개발 |
| UI | React 18 | 생태계 |
| 컴포넌트 | shadcn/ui + Tailwind | 빠른 구현 |
| 상태 | React Query | API 캐싱 |
| 라우팅 | React Router v6 | SPA |
| 차트 | Recharts | 경량 |
| 에디터 | TipTap | 리치 텍스트 |
| HTTP | Axios | 인터셉터 |

---

## 13. 뉴스레터 전략

### 13.1 뉴스레터 라인업

| 뉴스레터 | 언어 | 발행 | 대상 | 내용 |
|---------|------|------|------|------|
| **SEA AgTech Weekly** | EN | 매주 월요일 | 동남아·글로벌 독자 | 주간 TOP 5 뉴스 + 인사이트 |
| **스마트팜뉴스 위클리** | KO | 매주 월요일 | 국내 독자 | 주간 TOP 5 + K-AgTech 동향 |
| **Market Alert** | EN | 신규 공매 즉시 | 농기계 바이어 | 신규 매물 + 경매 알림 |

### 13.2 구독 전환 퍼널

```
무료 뉴스레터 구독 (SEA AgTech Weekly / 스마트팜뉴스 위클리)
        ↓ 4주 후
인사이트 리포트 예고편 + 프리미엄 CTA 이메일
        ↓
Premium $29/월 전환
        ↓
Enterprise $299/월 제안 (기업 사용 시)
```

---

## 14. 수익 모델

### 14.1 수익원 구조

```
Phase 1 (0~6개월): 수익 0 → 기반 구축
  └── 마켓플레이스 첫 매칭 수수료

Phase 2 (6~12개월): 월 $500~2,000 목표
  ├── 프리미엄 구독 $29/월 (목표 50명 = $1,450/월)
  ├── 기업 광고/PR (K-AgTech 수출기업 대상)
  └── 농기계 매칭 수수료

Phase 3 (12개월+): 월 $2,000~5,000+
  ├── Enterprise 구독 $299/월
  ├── 광고 패키지 확대
  ├── 동남아 현지 이벤트 스폰서십
  └── 커스텀 리포트 서비스
```

### 14.2 단계별 KPI

| 지표 | 3개월 | 6개월 | 12개월 |
|------|-------|-------|--------|
| MAU | 5,000 | 20,000 | 80,000 |
| 뉴스레터 구독자 | 300 | 1,000 | 5,000 |
| 프리미엄 구독자 | 0 | 30 | 150 |
| 일 콘텐츠 발행 | 30건 | 50건 | 80건 |
| 마켓 매칭 | 5건/월 | 20건/월 | 50건/월 |
| 월 수익 | $0 | $500 | $2,000+ |

---

## 15. 개발 로드맵

### Phase 1 — MVP 런칭 (0~3개월)
```
인프라
  ✅ Linux 서버 세팅 + Nginx + PM2
  ✅ PostgreSQL DB 마이그레이션

백엔드
  ✅ Express API 서버 (articles, equipment, events)
  ✅ News Agent (EN/KO 자동 발행)
  ✅ Market Agent (온비드 크롤링 + EN 번역)
  ✅ OpenRouter Qwen 통합 클라이언트

프론트엔드
  ✅ Next.js 사이트 (EN 메인 + /ko 라우트)
  ✅ 헤더 언어 토글 (EN/KO)
  ✅ News, Market, Events 기본 페이지

어드민
  ✅ 어드민 대시보드 (기사 발행, Agent 모니터링)

목표: EN+KO 뉴스 자동 발행 시작
```

### Phase 2 — 성장 (3~6개월)
```
  ✅ Insights Agent (NotebookLM 연동)
  ✅ Events Agent
  ✅ 프리미엄 구독 ($29/월) 론칭
  ✅ EN/KO 뉴스레터 자동 발송
  ✅ SEO 최적화 (sitemap, hreflang, OG 태그)
  ✅ 동남아 박람회 현장 취재 시작 (베트남)

목표: 뉴스레터 구독자 1,000명, 월 수익 $500
```

### Phase 3 — 수익화 (6~12개월)
```
  ✅ 베트남어(VI) 번역 추가 (Qwen-Pro)
  ✅ Enterprise 플랜 ($299/월)
  ✅ 동남아 국가별 Country Report 유료화
  ✅ 농기계 바이어 DB 구축 (500명+)
  ✅ K-AgTech 기업 광고 패키지 출시

목표: 구독자 3,000명, 월 수익 $2,000
```

### Phase 4 — 플랫폼화 (12개월+)
```
  ✅ 태국어(TH) + 인도네시아어(ID) 추가
  ✅ 동남아 AgTech 스타트업 DB (500사+)
  ✅ 연간 "SEA AgTech Intelligence Report" 발행
  ✅ 웨비나·온라인 컨퍼런스 운영

목표: MAU 10만, 월 수익 $5,000+
```

---

## 16. 환경변수 (.env)

```bash
# ── 서버 ────────────────────────────────────────────────
PORT=3000
NODE_ENV=production
SITE_URL=https://smartfarmnews.com

# ── PostgreSQL ──────────────────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartfarmnews
DB_USER=sfn_user
DB_PASSWORD=your_db_password

# ── OpenRouter (Qwen) ───────────────────────────────────
OPENROUTER_API_KEY=sk-or-v1-xxxx

QWEN_MODEL_FREE=qwen/qwen-2.5-7b-instruct:free
QWEN_MODEL_PRO=qwen/qwen-2.5-72b-instruct
QWEN_MODEL_REASON=qwen/qwen3-235b-a22b:free

QWEN_FREE_DELAY_MS=3000
MONTHLY_BUDGET_USD=5

# ── Redis (BullMQ) ──────────────────────────────────────
REDIS_HOST=localhost
REDIS_PORT=6379

# ── JWT (어드민 인증) ───────────────────────────────────
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@smartfarmnews.com
ADMIN_PASSWORD=your_admin_password

# ── 이메일 (뉴스레터) ──────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password

# ── 카카오 (공매 알림) ─────────────────────────────────
KAKAO_API_KEY=your_kakao_key

# ── Google NotebookLM ──────────────────────────────────
NOTEBOOKLM_API_KEY=your_key

# ── OpenAI (선택 — 필요 시만) ──────────────────────────
# OPENAI_API_KEY=sk-xxxx
```

---

## 17. 핵심 차별화 요약

| 차별화 요소 | 내용 |
|-----------|------|
| **동남아 AgTech 전문 미디어** | 글로벌에서 유일한 동남아 특화 영문 AgTech 플랫폼 |
| **KO+EN 동시 운영** | 국내 독자 + 글로벌 독자 동시 공략 |
| **AI 완전 자동화** | Qwen 기반, 월 $1 이하 비용으로 일 50건 발행 |
| **중고농기계 B2B 수출** | 동남아 바이어 직접 연결, 실질적 수익 모델 |
| **현장 네트워크** | 동남아 현지 취재 + 박람회 네트워킹 (직접 경험) |
| **K-AgTech 글로벌화 허브** | 한국 AgTech 기업의 동남아 진출 인텔리전스 |

---

*문서 끝 — SmartFarmNews.com 마스터 기획서 v4.0*
*다음 단계: 클로드 코드로 백엔드 API + 어드민 대시보드 구현*
