# SmartFarmNews

![SmartFarmNews Logo](https://img.shields.io/badge/SmartFarmNews-AgTech%20Intelligence-22D3EE?style=for-the-badge)

**Asia AgTech & FoodTech Intelligence Platform**  
아시아 AgTech & FoodTech 전문 인텔리전스 플랫폼

---

## 🌟 프로젝트 개요

SmartFarmNews는 아시아 지역의 AgTech(농업 기술) 및 FoodTech(식품 기술) 관련 뉴스, 인사이트, 시장 데이터를 제공하는 전문 플랫폼입니다. Next.js 14 + Tailwind CSS 기반으로 제작되었으며, 다크/라이트 모드를 완벽하게 지원합니다.

### 주요 특징

✅ **데이터 사이언스 컬러 시스템** — 블룸버그/팔란티르 스타일의 전문적인 UI  
✅ **다크/라이트 모드 토글** — 사용자 선호도 저장 (localStorage)  
✅ **반응형 레이아웃** — 데스크톱/태블릿/모바일 완벽 대응  
✅ **사이언 네온 액센트** — 브랜드 아이덴티티를 강조하는 고유한 디자인  
✅ **실시간 마켓 데이터 티커** — 애니메이션 스크롤 효과  
✅ **프리미엄 인사이트 섹션** — 구독 모델 기반 콘텐츠  
✅ **최적화된 폰트 시스템** — Pretendard(한글) + Inter(영문) + JetBrains Mono(코드)

---

## 🎨 디자인 시스템

### 컬러 팔레트

| 구분 | Dark Mode | Light Mode | 용도 |
|------|-----------|------------|------|
| **배경** | `#1A1A1A` | `#F5F5F5` | 페이지 캔버스 |
| **카드** | `#242424` | `#FFFFFF` | 콘텐츠 카드 |
| **메인 액센트** | `#22D3EE` | `#0891B2` | 사이언 네온 |
| **CTA** | `#F59E0B` | `#F59E0B` | 구독 버튼 (앰버) |
| **심볼 아크** | `#0891B2` | `#0891B2` | 로고 (고정) |
| **심볼 새싹** | `#4ADE80` | `#4ADE80` | 로고 (고정) |
| **텍스트 (주)** | `#FFFFFF` | `#111111` | 헤드라인 |
| **텍스트 (보조)** | `#9E9E9E` | `#666666` | 메타 정보 |

### 타이포그래피

- **한글 헤딩**: Pretendard ExtraBold 800
- **영문 헤딩**: Inter Display Bold 700
- **본문**: Pretendard Regular 400 / Inter Regular 400
- **코드**: JetBrains Mono 500

---

## 🚀 빠른 시작

### 1. 패키지 설치

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 3. 프로덕션 빌드

```bash
npm run build
npm run start
```

---

## 📁 프로젝트 구조

```
smartfarmnews/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (ThemeProvider 적용)
│   ├── page.tsx            # 메인 랜딩 페이지
│   └── globals.css         # 글로벌 CSS + CSS 변수
├── components/
│   ├── Logo.tsx            # 로고 (틸 아크 + 그린 새싹 SVG)
│   ├── ThemeToggle.tsx     # 다크/라이트 모드 토글 버튼
│   ├── Header.tsx          # 헤더 (로고, 네비게이션, CTA)
│   ├── HeroSection.tsx     # 히어로 섹션 (메인 배너)
│   ├── ArticleCard.tsx     # 아티클 카드 (사이언 네온 보더)
│   ├── DataTicker.tsx      # 마켓 데이터 티커 (무한 스크롤)
│   ├── SeriesCards.tsx     # 시리즈 카드 (SEA Focus, K-AgTech, Insights)
│   ├── InsightsBand.tsx    # 프리미엄 인사이트 섹션
│   └── Footer.tsx          # 푸터
├── contexts/
│   └── ThemeContext.tsx    # 테마 컨텍스트 & 훅
├── tailwind.config.js      # Tailwind CSS 설정 (브랜드 컬러)
├── next.config.js          # Next.js 설정
├── tsconfig.json           # TypeScript 설정
└── package.json            # 의존성 패키지
```

---

## 🧩 컴포넌트 사용 예시

### Logo 컴포넌트

```tsx
import Logo from '@/components/Logo';

// 기본 사용
<Logo size="medium" showWordmark={true} />

// 크기 옵션: 'small' | 'medium' | 'large'
<Logo size="small" showWordmark={false} />
```

### ArticleCard 컴포넌트

```tsx
import ArticleCard from '@/components/ArticleCard';

<ArticleCard
  title="베트남 스마트팜 AI 도입률 37% 급증"
  country="🇻🇳 Vietnam"
  category="AI & Precision"
  image="https://example.com/image.jpg"
  date="2026. 03. 02"
  excerpt="2025년 하반기 기준, 메콩강 델타 지역..."
/>
```

### ThemeToggle 사용

```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

---

## 🎯 주요 기능

### 1. 다크/라이트 모드

- **자동 감지**: 시스템 설정(`prefers-color-scheme`) 우선 적용
- **수동 전환**: 헤더의 Moon/Sun 아이콘으로 토글
- **영구 저장**: `localStorage`에 사용자 선택 저장
- **CSS 변수 기반**: `data-theme="dark|light"` 속성으로 전환

### 2. 반응형 브레이크포인트

| 디바이스 | 브레이크포인트 | 그리드 컬럼 |
|---------|---------------|------------|
| Mobile | `< 768px` | 1 column |
| Tablet | `768px - 1023px` | 2 columns |
| Desktop | `≥ 1024px` | 3 columns |

### 3. 애니메이션 효과

- **Neon Glow Pulse**: 사이언 네온 테두리 애니메이션 (2s 무한)
- **Ticker Scroll**: 마켓 데이터 무한 스크롤 (30s 선형)
- **Card Hover**: 카드 호버 시 `translateY(-2px)` + 섀도우 강조

---

## 📦 현재 구현된 기능

✅ **완료된 페이지**
- [x] 랜딩 페이지 (홈)
- [x] 히어로 섹션
- [x] 아티클 그리드
- [x] 시리즈 카드 (SEA Focus, K-AgTech, Insights)
- [x] 프리미엄 인사이트 섹션
- [x] 마켓 데이터 티커
- [x] 푸터

✅ **완료된 컴포넌트**
- [x] Logo (틸 아크 + 그린 새싹 SVG)
- [x] Header (반응형 메뉴, 테마 토글)
- [x] ArticleCard (네온 보더, 썸네일)
- [x] ThemeToggle (다크/라이트 전환)
- [x] DataTicker (실시간 마켓 데이터)

✅ **완료된 시스템**
- [x] 다크/라이트 모드 완전 구현
- [x] 브랜드 컬러 시스템 (Tailwind 토큰)
- [x] CSS 변수 기반 테마 전환
- [x] 반응형 레이아웃 (Mobile/Tablet/Desktop)
- [x] 글로벌 스타일 (스크롤바, 호버 효과)

---

## 🔮 향후 개발 계획

### Phase 2: 상세 페이지
- [ ] 아티클 상세 페이지 (본문, 관련 기사, 댓글)
- [ ] 인사이트 대시보드 (데이터 차트, 분석)
- [ ] 마켓 페이지 (실시간 시세 테이블)

### Phase 3: 인터랙션
- [ ] 검색 기능 (전체 검색, 필터링)
- [ ] 북마크 / 저장 기능
- [ ] 구독 모달 (이메일 뉴스레터)

### Phase 4: 백엔드 통합
- [ ] REST API 연동 (아티클, 시장 데이터)
- [ ] CMS 통합 (콘텐츠 관리)
- [ ] 사용자 인증 (로그인, 프리미엄 구독)

---

## 🛠️ 기술 스택

| 카테고리 | 기술 |
|---------|------|
| **프레임워크** | Next.js 14 (App Router) |
| **언어** | TypeScript 5.2 |
| **스타일링** | Tailwind CSS 3.3 + CSS Variables |
| **폰트** | Pretendard, Inter, JetBrains Mono |
| **상태 관리** | React Context API (Theme) |
| **빌드** | Turbopack (Dev), Next.js Build (Prod) |

---

## 📝 브랜드 가이드라인

### 로고 사용 규칙

1. **심볼 색상은 절대 변경 금지**
   - 아크: `#0891B2` (틸)
   - 새싹: `#4ADE80` (그린)

2. **최소 크기**
   - 수평형: 160px 이상
   - 심볼 단독: 48px 이상

3. **클리어 스페이스**
   - 로고 높이 × 1 간격 유지

4. **금지 사항**
   - ❌ 색상 변경
   - ❌ 회전 / 왜곡
   - ❌ 외곽선 추가
   - ❌ 그림자 효과
   - ❌ 저대비 배경 사용

---

## 📄 라이선스

MIT License — 상업적 사용 가능

---

## 👥 기여

풀 리퀘스트와 이슈는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 문의

- **Website**: [smartfarmnews.com](https://smartfarmnews.com)
- **Email**: hello@smartfarmnews.com
- **Twitter**: [@SmartFarmNews](https://twitter.com/SmartFarmNews)

---

**Built with ❤️ by SmartFarmNews Team**  
© 2026 SmartFarmNews. All rights reserved.
