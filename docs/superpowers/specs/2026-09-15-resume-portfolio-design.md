# 이재혁 이력서 포트폴리오 사이트 — 설계 문서

작성일: 2026-09-15
상태: 승인됨 (구현 계획 작성 전)

## 1. 목표

Claude Design으로 만든 "이재혁 이력서" 디자인(Modernist 디자인 시스템)을 Next.js 단일 페이지 웹사이트로 구현한다.
디자인의 시각 언어(토큰, 섹션 구조, flip 카드 인터랙션)를 그대로 유지하면서 반응형과 인쇄를 지원한다.

- 저장소: https://github.com/JaeHye0k/portfolio (비어 있음, `main` 브랜치에 push)
- 로컬 경로: `~/Desktop/portfolio`
- 배포: 이 작업 범위는 GitHub push까지. 배포는 이후 Vercel에서 import.

## 2. 범위

### 포함
- 단일 페이지 `/` 에 5개 섹션: Header, Profile, Skills, Career, Projects
- 프로젝트 flip 카드 2개 (Moneed, PAD) — 클릭/키보드로 앞뒷면 전환
- 반응형 레이아웃 (데스크톱은 디자인 동일, 모바일은 세로 스택)
- 인쇄 스타일 (A4 이력서로 출력)
- 콘텐츠를 타입이 있는 데이터 파일로 분리
- Vitest + React Testing Library 테스트
- 초기 커밋 및 GitHub push

### 제외
- 프로젝트 상세 페이지, 블로그, 네비게이션 등 멀티 페이지
- 다크 모드 (Modernist는 라이트 전용)
- 디자인의 placeholder 프로젝트 3·4번
- Vercel/GitHub Pages 배포 설정
- CMS, i18n, 애널리틱스

## 3. 기술 스택

`npx create-next-app@latest` 기본값 그대로:
TypeScript, ESLint, Tailwind CSS 4, App Router, Turbopack, import alias `@/*`, `src/` 디렉터리 없음.

추가 의존성:
- `lucide-react` — 디자인이 사용한 Lucide 아이콘
- devDependencies: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`

폰트: `next/font/google`로 Archivo (400, 600, 800) 로드. 한글은 디자인과 동일하게 시스템 폰트로 fallback
(`"Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif`).

## 4. 디렉터리 구조

```
app/
  layout.tsx          # html lang="ko", 폰트 변수 적용, metadata
  page.tsx            # 섹션 조립 (서버 컴포넌트)
  globals.css         # @theme 토큰, base, flip 카드 CSS, @media print
components/
  Section.tsx         # 라벨(h2 + 아이콘) + 콘텐츠 그리드 공통 래퍼
  Header.tsx
  Profile.tsx
  Skills.tsx
  Career.tsx
  Projects.tsx        # 섹션 라벨 + 안내문 + ProjectCard 목록
  ProjectCard.tsx     # "use client" flip 카드
data/
  profile.ts
  skills.ts
  career.ts
  projects.ts
  types.ts            # Project, CareerItem, SkillGroup 등 타입
test/
  setup.ts            # jest-dom 매처 등록
  ProjectCard.test.tsx
  page.test.tsx
vitest.config.ts
docs/superpowers/specs/  # 이 문서
```

`page.tsx`와 섹션 컴포넌트는 서버 컴포넌트다. 상태가 필요한 `ProjectCard`만 클라이언트 컴포넌트다.

## 5. 데이터 모델 (`data/types.ts`)

```ts
export type Contact = { birth: string; email: string; phone: string; location: string };

export type Profile = {
  kicker: string;        // "Frontend Web Developer"
  name: string;          // "이재혁"
  tagline: string;
  contact: Contact;
  paragraphs: string[];  // Profile 섹션 단락
};

export type SkillGroup = { label: string; icon: "core" | "state" | "backend"; items: string[] };

export type CareerItem = {
  company: string; period: string; role: string;
  bullets: string[];     // use9는 TODO placeholder 텍스트로 시작
};

export type Project = {
  id: string; name: string; period: string; team: string; role: string;
  intro: string; stack: string; links: string[]; details: string[];
};
```

콘텐츠 값은 디자인 파일(`이재혁 이력서.dc.html`)의 텍스트를 그대로 사용한다. 컴포넌트는 텍스트를 하드코딩하지 않는다.

`data/career.ts`의 use9 bullet 3개는 디자인의 placeholder 문구를 유지하고 `// TODO: 실제 내용으로 교체` 주석을 단다.

## 6. 디자인 토큰 (`globals.css` `@theme`)

Modernist `styles.css`의 값을 그대로 옮긴다.

| 토큰 | 값 |
| --- | --- |
| bg / surface / text | #f3f2f2 / #eae9e9 / #201e1d |
| accent | #ec3013 |
| divider | `color-mix(in srgb, #201e1d 40%, transparent)` |
| neutral 100~900 | #f8f4f4 #eae7e7 #d7d3d3 #bab6b6 #9b9797 #7d7979 #605d5d #444141 #2d2b2b |
| accent 100~900 | #fff2ef #ffe0d9 #ffc4b8 #ff9783 #ff563c #dd2b0f #ae1800 #7c1405 #4d170e |
| radius | 0 (flip 카드만 16px) |
| font heading/body | Archivo + 한글 fallback |

Tailwind 유틸리티 예: `bg-bg`, `bg-surface`, `text-text`, `text-accent`, `text-neutral-600`, `border-divider`.

base 규칙:
- `body`: bg, text, body 폰트, `word-break: keep-all`, 14px / line-height 1.6
- `h1~h3`: heading 폰트 800
- `a`: accent-700, hover 시 accent + underline (offset 3px)
- `:focus-visible`: 2px accent outline, offset 2px
- `::selection`: accent 30% tint

## 7. 컴포넌트 명세

### Section
props: `title`, `icon`(Lucide 컴포넌트), `children`, `aside?`(라벨 아래 보조 텍스트), `last?`
- 데스크톱: `grid-cols-[140px_minmax(0,1fr)] gap-6`, `py-[22px]`, 하단 2px divider (`last`면 없음)
- 모바일: 1열, 라벨이 콘텐츠 위
- h2: 12px, uppercase, tracking .12em, accent 아이콘 16px

### Header
- 좌: kicker(코드 아이콘 + "Frontend Web Developer", 11px accent 600 uppercase) → h1 40px → tagline 17px 600
- 우: 연락처 4줄 12.5px, 아이콘 neutral-600 (User, Mail, Phone, MapPin). 이메일은 `mailto:` 링크
- 데스크톱 `grid-cols-[minmax(0,1fr)_auto] items-end`, 모바일 1열. 하단 2px divider, `pb-5`

### Profile
단락 2개, `gap-2.5`, `text-wrap: pretty`

### Skills
3열 그리드 (모바일 1열). 각 열: 상단 1px divider, 라벨(11px neutral-600 tracking .06em + 13px 아이콘), 항목 600 lh 1.7

### Career
항목별: h3 20px → meta(Calendar 아이콘 기간, User 아이콘 역할) → Check 아이콘 bullet 목록

### Projects
Section의 `aside`에 "카드를 클릭하면 뒤집힙니다"(RefreshCw 아이콘). 콘텐츠는 `flex-col gap-4`의 ProjectCard 목록. 마지막 섹션이므로 하단 divider 없음.

### ProjectCard ("use client")
- 상태: `flipped: boolean`
- 루트: `role="button"`, `tabIndex=0`, `aria-pressed={flipped}`, `onClick` 토글, `onKeyDown`에서 Enter/Space 토글(기본 동작 방지)
- 카드 내부 `<a>`는 `onClick={(e) => e.stopPropagation()}`, `target="_blank" rel="noopener noreferrer"`
- 앞면: surface 배경, 1px divider 테두리(hover 시 accent), h3 19px + RefreshCw 아이콘, meta(Calendar 기간·Users 팀·Code 역할), intro 13px, 상단 1px divider 후 stack(Layers 아이콘) + 링크(Link 아이콘)
- 뒷면: 배경 text색, 글자 bg색. kicker "Main work · Trouble shooting"(10px accent-400) + h3 + RotateCcw 아이콘, details Check bullet(accent-400)
- 3D: `perspective: 1400px`, inner `transform-style: preserve-3d`, `.6s cubic-bezier(.4,0,.2,1)`, face `backface-visibility: hidden`, `min-height: 300px`, radius 16px
- `prefers-reduced-motion: reduce`이면 transition 제거

## 8. 반응형

- 컨테이너: `max-w-[880px] mx-auto px-6 py-10` (모바일 `px-4 py-6`)
- 브레이크포인트 `md`(768px) 기준으로 라벨 그리드·Header·Skills 전환
- flip 카드는 모바일에서도 동작. 뒷면 내용이 길어 `min-height`를 넘으면 카드 높이는 앞면 기준이므로, 뒷면은 `overflow: hidden`이 아닌 카드 자체 높이를 `grid`로 앞뒷면 중 큰 쪽에 맞춤 (두 face를 같은 grid cell에 겹쳐 배치)

## 9. 인쇄 (`@media print`)

- `@page { size: A4; margin: 0.7in }`
- body 배경 흰색, 컨테이너 max-width·padding 제거
- flip 해제: transform 없음, 앞면·뒷면 모두 정적 흐름으로 세로 출력 (뒷면은 앞면 아래, 잉크색 배경 유지)
- 카드·섹션에 `break-inside: avoid`
- 안내문("카드를 클릭하면 뒤집힙니다")과 RefreshCw/RotateCcw 아이콘 숨김
- 링크는 href 텍스트가 이미 표시되므로 추가 출력 없음

## 10. 메타데이터

`layout.tsx`의 `metadata`: title "이재혁 | Frontend Web Developer", description은 tagline, `lang="ko"`. Open Graph 제목·설명 동일. OG 이미지는 범위 밖.

## 11. 테스트

Vitest(jsdom) + React Testing Library.

`test/ProjectCard.test.tsx`
- 초기 `aria-pressed="false"`, 클릭 시 `"true"`, 다시 클릭 시 `"false"`
- 포커스 후 Enter, Space로 토글
- 카드 안 링크 클릭 시 토글되지 않음
- 앞면에 name/period/team/role/intro/stack/links, 뒷면에 details가 렌더됨

`test/page.test.tsx`
- `page.tsx`를 렌더하면 데이터의 이름, 섹션 제목(Profile/Skills/Career/Projects), 프로젝트 이름 2개가 존재

검증 명령: `npm run lint`, `npm run test`, `npm run build`. 추가로 개발 서버 스크린샷(데스크톱·모바일·print 에뮬레이션)을 디자인과 대조한다.

## 12. 에러 처리

정적 콘텐츠 사이트이므로 런타임 데이터 페칭이 없다. 데이터 타입 오류는 TypeScript 컴파일에서 잡힌다. 링크 배열이 비어 있어도 렌더가 깨지지 않도록 조건부 렌더링한다.

## 13. Git 흐름

1. `create-next-app` 스캐폴딩 커밋
2. 토큰·폰트·레이아웃 커밋
3. 데이터·섹션 컴포넌트 커밋
4. ProjectCard + 테스트 커밋
5. 반응형·인쇄 커밋
6. `git remote add origin https://github.com/JaeHye0k/portfolio.git` → `git push -u origin main`

커밋 메시지는 한국어 conventional commits (`feat:`, `style:`, `chore:`, `test:`).
