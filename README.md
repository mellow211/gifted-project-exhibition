# 영재 프로젝트 디지털 연구 전시관 (Gifted Project Exhibition)

> **Digital Museum × Future Lab**
> 학생들의 질문(Question)에서 시작하여 탐구 과정(Our Journey), 실패와 개선, 그리고 성찰(Reflection)과 새로운 질문(Next Question)까지 감상할 수 있는 고품격 온라인 연구 전시관 웹 애플리케이션

---

## 🌟 핵심 특징 및 디자인 콘셉트

- **Digital Museum × Future Lab 무드**: Dark Navy (`#0B1020`), Clean White/Surface (`#F7F8FC`), Primary Accent (`#6C63FF`), Secondary Accent (`#27D3A2`) 기반의 세련된 에디토리얼 디자인
- **스토리텔링 전시 흐름 (UX Flow)**:
  1. `01 PROJECT QUESTION`: "우리는 이런 질문에서 시작했습니다" (핵심 탐구 질문)
  2. `02 WHY`: "왜 이 주제를 선택했나요?" (연구 동기 및 문제의식)
  3. `03 PROJECT STORY`: 상세 탐구 및 문제 해결 스토리
  4. `04 OUR JOURNEY`: 가설→설계→제작→실험→개선→완성 단계별 타임라인
  5. `05 PROJECT ARCHIVE`: PDF 보고서 뷰어, 발표 슬라이드, 영상 플레이어, 라이브 데모 실행
  6. `06 LEARNING & REFLECTION`: 배운 점 & 다시 탐구한다면? (Next Question)
  7. `07 VISITOR REACTION`: 👏 멋져요, 💡 아이디어, 🚀 발전 기대, ❤️ 응원 반응
  8. `08 MORE TO EXPLORE`: 동일 카테고리/태그 연관 추천 전시
- **5대 전시관 (Exhibition Halls)**:
  - `AI & DATA`: 인공지능과 데이터
  - `SOFTWARE`: 소프트웨어와 코딩
  - `ROBOT & IoT`: 로봇과 피지컬 컴퓨팅
  - `SCIENCE`: 과학 탐구
  - `CREATIVE`: 창의융합
- **스마트 검색 & 다중 필터**: 제목, 학생 표시명, 태그, 요약 실시간 검색 + 학년/과정/연도/정렬 필터
- **🎲 우연히 만나는 프로젝트**: 실제 전시장을 거닐 듯 예상치 못한 작품을 만나는 랜덤 발견 모달
- **관리자 시스템 (/admin)**:
  - 데모 모드 원클릭 로그인 & Supabase Auth 연동 지원
  - 프로젝트 등록 / 수정 / 삭제 / 공개·비공개 토글 / Featured 큐레이션 설정
  - 다단계 타임라인 프로세스 동적 편집기

---

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Database & Auth**: Supabase PostgreSQL / Hybrid Local Storage Fallback Engine
- **Deployment**: Vercel Ready

---

## 🚀 로컬 실행 방법

### 1. 의존성 설치
```bash
npm install
```

### 2. 로컬 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 3. 프로덕션 빌드 및 실행
```bash
npm run build
npm run start
```

---

## 🗄 Supabase 연동 방법 (선택 사항)

기본적으로 본 프로젝트는 **하이브리드 데이터 서비스 레이어**를 내장하고 있어 Supabase 미연동 환경에서도 8개의 풍부한 샘플 프로젝트 및 관리자 기능이 100% 정상 작동합니다.

실제 Supabase와 연동하려면:
1. Supabase 프로젝트를 생성하고 SQL Editor에서 `supabase/schema.sql` 스크립트를 실행합니다.
2. 루트 디렉토리에 `.env.local` 파일을 생성하고 키를 입력합니다:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📂 디렉토리 구조

```
/
├── app/
│   ├── layout.tsx                # 루트 레이아웃 & SEO 메타데이터
│   ├── page.tsx                  # HOME (Hero, Stats, Featured, Exhibition Halls)
│   ├── projects/
│   │   ├── page.tsx              # PROJECTS GALLERY (검색, 필터, 갤러리 그리드)
│   │   └── [slug]/page.tsx       # PROJECT DETAIL (01~08 전시 스토리텔링)
│   ├── about/page.tsx            # ABOUT (전시 철학, 탐구 사이클, 매니페스토)
│   ├── admin/page.tsx            # ADMIN (관리자 대시보드 및 프로젝트 관리)
│   └── not-found.tsx             # 404 페이지
├── components/
│   ├── common/                   # Header, Footer, Badge 등
│   ├── home/                     # HeroSection, StatsSection, FeaturedProjects, ExhibitionHall
│   ├── projects/                 # ProjectCard, ProjectFilter, SearchBar, RandomDiscovery
│   ├── project-detail/           # ProjectHero, Question, Why, Story, Timeline, Archive, Reflection, ReactionBar, RelatedProjects
│   └── admin/                    # AdminAuth, AdminDashboard, ProjectForm
├── data/
│   └── sample-projects.ts        # 8개 가상 영재 프로젝트 현실적 데이터셋
├── lib/
│   ├── supabase.ts               # Supabase 클라이언트
│   └── project-service.ts        # 데이터 CRUD & 반응 관리 서비스
├── types/
│   └── project.ts                # TypeScript 인터페이스
└── supabase/
    └── schema.sql                # Supabase PostgreSQL DDL, RLS, Storage Bucket
```
