# 이재혁 이력서 포트폴리오 사이트 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Claude Design "이재혁 이력서"(Modernist 디자인 시스템)를 Next.js 단일 페이지 사이트로 구현하고 `JaeHye0k/portfolio`에 push한다.

**Architecture:** create-next-app 기본 템플릿(App Router, Tailwind 4) 위에 Modernist 토큰을 `@theme`으로 이식한다. 콘텐츠는 `data/`의 타입이 있는 상수로 분리하고, 섹션 컴포넌트는 서버 컴포넌트, flip 상태를 가진 `ProjectCard`만 클라이언트 컴포넌트다. 반응형은 `md`(768px) 브레이크포인트, 인쇄는 `@media print`에서 flip을 해제해 A4로 출력한다.

**Tech Stack:** Next.js 16.3.x, React 19, TypeScript, Tailwind CSS 4, lucide-react, Vitest + @testing-library/react + jsdom, next/font/google (Archivo)

**Spec:** `docs/superpowers/specs/2026-09-15-resume-portfolio-design.md`

## Global Constraints

- 프로젝트 루트: `/Users/leejaehyeok/Desktop/portfolio` (이미 `git init -b main` 완료, `docs/` 커밋 1개 존재)
- 패키지 매니저: npm. `src/` 디렉터리 없음. import alias `@/*` = 프로젝트 루트
- 디자인 토큰 값은 spec 6절 그대로. hex를 컴포넌트에 직접 쓰지 않고 Tailwind 유틸리티(`bg-ground`, `text-ink`, `text-accent`, `text-neutral-600`, `border-divider`, `bg-surface`, `text-accent-400`, `text-accent-700`)만 사용
- 모서리 라운드는 flip 카드(16px)만. 그 외 `rounded-*` 금지
- 아이콘은 `lucide-react`만 사용. 기본 크기 16px, 작은 아이콘 13px, `strokeWidth={2}`
- 콘텍스트 텍스트는 `data/*.ts`에만 존재. 컴포넌트에 콘텐츠 문자열 하드코딩 금지 (섹션 제목 "Profile"/"Skills"/"Career"/"Projects"와 UI 안내문은 컴포넌트에 둠)
- 다크 모드 없음. 템플릿의 `prefers-color-scheme: dark` 블록은 제거
- 커밋 메시지: 한국어 conventional commits (`feat:`, `style:`, `chore:`, `test:`, `docs:`) + `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`
- Next 16은 학습 데이터와 다를 수 있다. 확신이 없는 API는 `node_modules/next/dist/docs/`에서 확인
- 각 태스크 완료 시 `npm run lint`와 `npm run test`가 통과해야 한다

---

### Task 1: 프로젝트 스캐폴딩과 테스트 도구

**Files:**
- Create: (create-next-app이 생성) `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, `postcss.config.mjs`, `AGENTS.md`, `public/*`
- Create: `vitest.config.ts`, `test/setup.ts`, `test/smoke.test.tsx`
- Modify: `package.json` (scripts.test 추가), `tsconfig.json` (exclude에 vitest 설정 불필요 — 그대로)

**Interfaces:**
- Produces: `npm run test` (vitest run), `npm run lint`, `npm run build`가 동작하는 프로젝트. 테스트에서 `@/` alias 사용 가능

- [ ] **Step 1: create-next-app 실행**

```bash
cd /Users/leejaehyeok/Desktop
npx -y create-next-app@latest --reset-preferences   # 이전에 저장된 src/ 등 선호 설정 초기화 (출력 후 종료됨)
npx -y create-next-app@latest portfolio --ts --tailwind --eslint --app --import-alias "@/*" --use-npm --yes
```

기존 `docs/`와 `.git`은 create-next-app이 허용하는 파일이므로 충돌하지 않는다. 이미 git 저장소이므로 create-next-app은 커밋을 만들지 않는다.
Expected: `portfolio/` 안에 `app/`, `package.json` 등이 생성되고 `npm install`이 끝난다. "Would you like..." 프롬프트가 뜨면 모두 Enter(기본값). React Compiler는 No.

- [ ] **Step 2: 생성 결과 확인**

```bash
cd /Users/leejaehyeok/Desktop/portfolio && ls && cat package.json && git status --short | head
```

Expected: `src/` 없음, `app/` 존재, dependencies에 `next` 16.x, devDependencies에 `tailwindcss` ^4, `eslint`. `.gitignore`가 생성되어 `node_modules`, `.next`가 제외됨.

- [ ] **Step 3: 스캐폴딩 커밋**

```bash
git add -A && git commit -m "chore: create-next-app 기본 템플릿으로 프로젝트 생성

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 4: 의존성 설치**

```bash
npm install lucide-react
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 5: vitest 설정 작성**

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/**/*.test.tsx", "test/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

`test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: package.json에 test 스크립트 추가**

`package.json`의 `scripts`에 다음을 추가한다 (기존 `dev`/`build`/`start`/`lint`는 유지):

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: 스모크 테스트 작성 (실패 확인용)**

`test/smoke.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("test toolchain", () => {
  it("renders a React element in jsdom with jest-dom matchers", () => {
    render(<h1>hello</h1>);
    expect(screen.getByRole("heading", { name: "hello" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: 테스트·린트 실행**

```bash
npm run test && npm run lint
```

Expected: 1 test passed. lint 오류 0. lint가 `vitest.config.ts`의 `__dirname`에 대해 경고하면 파일 상단에 `import { fileURLToPath } from "node:url";` 후 `const __dirname = path.dirname(fileURLToPath(import.meta.url));`로 교체한다.

- [ ] **Step 9: 커밋**

```bash
git add -A && git commit -m "chore: lucide-react, vitest 테스트 환경 추가

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: 디자인 토큰, 폰트, 레이아웃

**Files:**
- Modify: `app/globals.css` (전체 교체)
- Modify: `app/layout.tsx` (전체 교체)
- Modify: `app/page.tsx` (임시 빈 컨테이너로 교체)

**Interfaces:**
- Produces: Tailwind 유틸리티 `bg-ground`, `bg-surface`, `text-ink`, `bg-ink`, `text-ground`, `text-accent`, `text-accent-{100..900}`, `text-neutral-{100..900}`, `border-divider`, `font-heading`, `font-body`. CSS 클래스 `.container-page`(콘텐츠 컨테이너). CSS 변수 `--font-archivo`(layout에서 주입)

- [ ] **Step 1: globals.css 교체**

`app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-ground: #f3f2f2;
  --color-surface: #eae9e9;
  --color-ink: #201e1d;
  --color-accent: #ec3013;
  --color-divider: color-mix(in srgb, #201e1d 40%, transparent);

  --color-neutral-100: #f8f4f4;
  --color-neutral-200: #eae7e7;
  --color-neutral-300: #d7d3d3;
  --color-neutral-400: #bab6b6;
  --color-neutral-500: #9b9797;
  --color-neutral-600: #7d7979;
  --color-neutral-700: #605d5d;
  --color-neutral-800: #444141;
  --color-neutral-900: #2d2b2b;

  --color-accent-100: #fff2ef;
  --color-accent-200: #ffe0d9;
  --color-accent-300: #ffc4b8;
  --color-accent-400: #ff9783;
  --color-accent-500: #ff563c;
  --color-accent-600: #dd2b0f;
  --color-accent-700: #ae1800;
  --color-accent-800: #7c1405;
  --color-accent-900: #4d170e;

  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
}

@theme inline {
  --font-heading: var(--font-archivo), "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
  --font-body: var(--font-archivo), "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif;
}

@layer base {
  html {
    background: var(--color-ground);
  }
  body {
    margin: 0;
    background: var(--color-ground);
    color: var(--color-ink);
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.6;
    word-break: keep-all;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 {
    font-family: var(--font-heading);
    font-weight: 800;
    margin: 0;
  }
  p {
    margin: 0;
  }
  a {
    color: var(--color-accent-700);
    text-decoration: none;
  }
  a:hover {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  :focus {
    outline: none;
  }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  ::selection {
    background: color-mix(in srgb, var(--color-accent) 30%, transparent);
  }
}

@utility container-page {
  max-width: 880px;
  margin-inline: auto;
  padding: 24px 16px;
  @media (width >= 48rem) {
    padding: 40px 24px;
  }
}
```

- [ ] **Step 2: layout.tsx 교체**

`app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "이재혁 | Frontend Web Developer",
  description:
    "임팩트와 효율을 만드는 개발자. 필요하다면 분야를 가리지 않고 빠르게 배우고 적용합니다.",
  openGraph: {
    title: "이재혁 | Frontend Web Developer",
    description:
      "임팩트와 효율을 만드는 개발자. 필요하다면 분야를 가리지 않고 빠르게 배우고 적용합니다.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: page.tsx를 임시 컨테이너로 교체**

`app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="container-page">
      <h1 className="text-[40px] leading-[1.05] tracking-[-0.02em]">이재혁</h1>
    </main>
  );
}
```

- [ ] **Step 4: 템플릿 기본 자산 정리**

```bash
rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

- [ ] **Step 5: 빌드·린트·테스트 확인**

```bash
npm run lint && npm run test && npm run build
```

Expected: 모두 성공. build 출력에 `/` 라우트가 Static으로 표시.

- [ ] **Step 6: 개발 서버로 토큰 확인**

```bash
npm run dev -- --port 3000 &
sleep 5
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/portfolio-task2.png --window-size=1280,800 http://localhost:3000
kill %1
```

스크린샷을 Read로 열어 배경이 연회색(#f3f2f2), 제목이 Archivo 굵은 글꼴로 보이는지 확인.

- [ ] **Step 7: 커밋**

```bash
git add -A && git commit -m "style: Modernist 디자인 토큰과 Archivo 폰트, 기본 레이아웃 적용

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: 콘텍스트 데이터와 타입

**Files:**
- Create: `data/types.ts`, `data/profile.ts`, `data/skills.ts`, `data/career.ts`, `data/projects.ts`
- Test: `test/data.test.ts`

**Interfaces:**
- Produces:
  - `data/types.ts`: `Contact`, `Profile`, `SkillGroup`, `SkillIcon`, `CareerItem`, `Project`
  - `data/profile.ts`: `export const profile: Profile`
  - `data/skills.ts`: `export const skillGroups: SkillGroup[]`
  - `data/career.ts`: `export const career: CareerItem[]`
  - `data/projects.ts`: `export const projects: Project[]`

- [ ] **Step 1: 실패하는 테스트 작성**

`test/data.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { career } from "@/data/career";
import { projects } from "@/data/projects";

describe("data", () => {
  it("profile has name, kicker, tagline, contact and 2 paragraphs", () => {
    expect(profile.name).toBe("이재혁");
    expect(profile.kicker).toBe("Frontend Web Developer");
    expect(profile.tagline.length).toBeGreaterThan(0);
    expect(profile.contact.email).toContain("@");
    expect(profile.paragraphs).toHaveLength(2);
  });

  it("skills has 3 groups with non-empty items", () => {
    expect(skillGroups).toHaveLength(3);
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("career has at least one item with bullets", () => {
    expect(career.length).toBeGreaterThan(0);
    expect(career[0].company).toBe("use9");
    expect(career[0].bullets.length).toBeGreaterThan(0);
  });

  it("projects are Moneed and PAD with unique ids and details", () => {
    expect(projects.map((p) => p.name)).toEqual(["Moneed", "PAD"]);
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of projects) {
      expect(p.details.length).toBeGreaterThan(0);
      expect(p.links.length).toBeGreaterThan(0);
      for (const link of p.links) expect(link).toMatch(/^https:\/\//);
    }
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm run test
```

Expected: FAIL — `Cannot find module '@/data/profile'` 류의 오류.

- [ ] **Step 3: 타입 작성**

`data/types.ts`:

```ts
export type Contact = {
  birth: string;
  email: string;
  phone: string;
  location: string;
};

export type Profile = {
  kicker: string;
  name: string;
  tagline: string;
  contact: Contact;
  paragraphs: string[];
};

export type SkillIcon = "core" | "state" | "backend";

export type SkillGroup = {
  label: string;
  icon: SkillIcon;
  items: string[];
};

export type CareerItem = {
  company: string;
  period: string;
  role: string;
  bullets: string[];
};

export type Project = {
  id: string;
  name: string;
  period: string;
  team: string;
  role: string;
  intro: string;
  stack: string;
  links: string[];
  details: string[];
};
```

- [ ] **Step 4: profile 데이터**

`data/profile.ts`:

```ts
import type { Profile } from "./types";

export const profile: Profile = {
  kicker: "Frontend Web Developer",
  name: "이재혁",
  tagline:
    "임팩트와 효율을 만드는 개발자. 필요하다면 분야를 가리지 않고 빠르게 배우고 적용합니다.",
  contact: {
    birth: "2000. 07. 04",
    email: "ahhpc2012@gmail.com",
    phone: "010-5583-6775",
    location: "충북 청주시",
  },
  paragraphs: [
    "팀 프로젝트에서 백엔드 인력이 부족해 API 개발이 지연됐을 때, Next.js와 Prisma ORM, Supabase를 학습해 서버리스 풀스택으로 마이그레이션하여 개발 병목을 해소했습니다. 기술은 목적이 아니라 문제를 푸는 수단이라고 생각합니다.",
    "최근에는 AI를 학습과 협업 보조 도구로 활용해 생산성을 높이고 있습니다. 반복적인 PR 템플릿·커밋 메시지 작성을 자동화하여 협업 비용을 줄이고, 더 중요한 문제 해결과 코드 품질 개선에 집중합니다.",
  ],
};
```

- [ ] **Step 5: skills 데이터**

`data/skills.ts`:

```ts
import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  { label: "CORE", icon: "core", items: ["React", "Next.js", "TypeScript", "JavaScript"] },
  { label: "STATE · STYLE", icon: "state", items: ["TanStack Query", "Zustand", "Tailwind CSS"] },
  {
    label: "BACKEND · TOOLS",
    icon: "backend",
    items: ["Prisma ORM", "Supabase", "Git / GitHub", "Figma"],
  },
];
```

- [ ] **Step 6: career 데이터**

`data/career.ts`:

```ts
import type { CareerItem } from "./types";

export const career: CareerItem[] = [
  {
    company: "use9",
    period: "2026.01 ~ 현재",
    role: "프론트엔드 개발자",
    // TODO: 실제 내용으로 교체
    bullets: [
      "[주요 업무] 담당 서비스의 프론트엔드 개발 및 유지보수 — 실제 내용으로 교체해 주세요",
      "[성과] 수치로 표현 가능한 성과 1가지 — 예: 렌더링 시간 n% 단축, 배포 자동화 등",
      "[협업] 디자인·백엔드와의 협업 방식, 코드 리뷰·컨벤션 정립 등",
    ],
  },
];
```

- [ ] **Step 7: projects 데이터**

`data/projects.ts`:

```ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "moneed",
    name: "Moneed",
    period: "2025.05 ~ 진행중",
    team: "팀 프로젝트",
    role: "프론트엔드 중심 풀스택",
    intro:
      "MZ 세대를 위한 투자 정보 제공 및 커뮤니티 플랫폼. 카카오 OAuth 로그인·세션 관리 전반을 BFF 방식으로 구현하고, 한국투자증권 Open API 기반 주식 시세 조회(약 3,700개 종목)를 제공합니다.",
    stack: "Next.js · TypeScript · TanStack Query · Zustand · Tailwind CSS · Prisma ORM · Supabase",
    links: ["https://github.com/team-moneed/Moneed"],
    details: [
      "서버리스 함수의 동적 IP 문제를 Express 프록시 서버(EC2 + 탄력적 IP)로 해결, 카카오 API 허용 IP 고정",
      "웹소켓 세션 제한을 REST Polling + React Query 캐싱으로 우회해 1분 주기 시세 제공",
      "역할 중심 폴더 구조를 FSD 아키텍처로 이관하여 도메인 응집도 강화",
      "Vercel ↔ EC2 도메인 간 쿠키 전송 불가 문제를 임시 코드 → 토큰 재발급 방식으로 해결",
      "Cursor AI 크롤러로 기업 정보(소개·업종·로고) 확보, 정적 데이터는 DB / 시세는 실시간 API 분리",
    ],
  },
  {
    id: "pad",
    name: "PAD",
    period: "2025.01 ~ 2025.02",
    team: "팀 프로젝트",
    role: "프론트엔드",
    intro:
      "개발자·아티스트·디자이너를 위한 협업 및 커뮤니티 플랫폼. WebSocket 기반 1:1·그룹 실시간 채팅과 프론트엔드 인프라(EC2 + Nginx + HTTPS) 구축을 담당했습니다.",
    stack: "React · TypeScript · Zustand · TanStack Query · Tailwind CSS · Nginx · AWS EC2",
    links: ["https://github.com/NoGiveUpWeCarry/front", "https://youtu.be/sR_9lDEBUG4"],
    details: [
      "웹소켓을 이벤트 트리거로만 사용하고 React Query 캐시 동기화·낙관적 업데이트로 채팅 렌더링 지연 해소",
      "이미지 WebP 압축으로 평균 85% 용량 절감, Socket.IO 전송 한도(1MB) 문제 해결",
      "유저별 마지막 읽은 메시지 ID만 저장하는 구조로 읽음 처리의 공간·시간 복잡도 개선",
      "EC2 + Nginx 정적 서버 구성, Route 53 커스텀 도메인 + Let's Encrypt HTTPS 적용",
      "GitHub Actions CI/CD 파이프라인 구축 — 68회 자동 배포 성공, 수동 배포 휴먼 에러 제거",
    ],
  },
];
```

- [ ] **Step 8: 테스트 통과 확인**

```bash
npm run test && npm run lint
```

Expected: data.test.ts 4개 포함 모두 PASS.

- [ ] **Step 9: 커밋**

```bash
git add -A && git commit -m "feat: 이력서 콘텐츠 데이터와 타입 추가

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Section 래퍼와 정적 섹션 (Header, Profile, Skills, Career)

**Files:**
- Create: `components/Section.tsx`, `components/Header.tsx`, `components/Profile.tsx`, `components/Skills.tsx`, `components/Career.tsx`
- Modify: `app/page.tsx`
- Test: `test/page.test.tsx`

**Interfaces:**
- Consumes: Task 3의 `profile`, `skillGroups`, `career`
- Produces:
  - `Section` props: `{ title: string; icon: LucideIcon; children: ReactNode; aside?: ReactNode; last?: boolean }`
  - `Header`, `Profile`, `Skills`, `Career`: props 없음 (data를 직접 import)
  - Task 5가 `Section`을 재사용하고 `page.tsx`에 `<Projects />`를 추가한다

- [ ] **Step 1: 실패하는 테스트 작성**

`test/page.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { career } from "@/data/career";

describe("Home page", () => {
  it("renders header with name, kicker, tagline and contact", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
    expect(screen.getByText(profile.kicker)).toBeInTheDocument();
    expect(screen.getByText(profile.tagline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: profile.contact.email })).toHaveAttribute(
      "href",
      `mailto:${profile.contact.email}`,
    );
    expect(screen.getByText(profile.contact.phone)).toBeInTheDocument();
    expect(screen.getByText(profile.contact.location)).toBeInTheDocument();
  });

  it("renders Profile, Skills, Career section headings", () => {
    render(<Home />);
    for (const name of ["Profile", "Skills", "Career"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  it("renders profile paragraphs and every skill item", () => {
    render(<Home />);
    for (const p of profile.paragraphs) expect(screen.getByText(p)).toBeInTheDocument();
    for (const group of skillGroups) {
      expect(screen.getByText(group.label)).toBeInTheDocument();
      for (const item of group.items) expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("renders career company, period, role and bullets", () => {
    render(<Home />);
    for (const item of career) {
      expect(screen.getByRole("heading", { level: 3, name: item.company })).toBeInTheDocument();
      expect(screen.getByText(item.period)).toBeInTheDocument();
      expect(screen.getByText(item.role)).toBeInTheDocument();
      for (const b of item.bullets) expect(screen.getByText(b)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm run test
```

Expected: page.test.tsx의 4개 테스트 FAIL (kicker 텍스트 없음 등).

- [ ] **Step 3: Section 컴포넌트**

`components/Section.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  aside?: ReactNode;
  last?: boolean;
};

export default function Section({ title, icon: Icon, children, aside, last = false }: SectionProps) {
  return (
    <section
      className={`grid grid-cols-1 gap-3 py-[22px] md:grid-cols-[140px_minmax(0,1fr)] md:gap-6 ${
        last ? "" : "border-b-2 border-divider"
      }`}
    >
      <div className="flex flex-col gap-2 self-start">
        <h2 className="mt-1 flex items-center gap-2 text-[12px] uppercase leading-[1.4] tracking-[0.12em]">
          <Icon size={16} strokeWidth={2} className="text-accent" aria-hidden />
          {title}
        </h2>
        {aside}
      </div>
      <div>{children}</div>
    </section>
  );
}
```

- [ ] **Step 4: Header 컴포넌트**

`components/Header.tsx`:

```tsx
import { Code, Mail, MapPin, Phone, User } from "lucide-react";
import { profile } from "@/data/profile";

const contactIconClass = "text-neutral-600";

export default function Header() {
  const { kicker, name, tagline, contact } = profile;
  return (
    <header className="grid grid-cols-1 gap-6 border-b-2 border-divider pb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div>
        <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          <Code size={13} strokeWidth={2} aria-hidden />
          {kicker}
        </div>
        <h1 className="mb-3 text-[40px] leading-[1.05] tracking-[-0.02em]">{name}</h1>
        <p className="text-[17px] font-semibold leading-[1.35] [text-wrap:pretty]">{tagline}</p>
      </div>
      <ul className="flex flex-col gap-1.5 text-[12.5px] leading-[1.5]">
        <li className="flex items-center gap-2">
          <User size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          {contact.birth}
        </li>
        <li className="flex items-center gap-2">
          <Mail size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
        <li className="flex items-center gap-2">
          <Phone size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          {contact.phone}
        </li>
        <li className="flex items-center gap-2">
          <MapPin size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          {contact.location}
        </li>
      </ul>
    </header>
  );
}
```

- [ ] **Step 5: Profile 컴포넌트**

`components/Profile.tsx`:

```tsx
import { CircleUserRound } from "lucide-react";
import Section from "@/components/Section";
import { profile } from "@/data/profile";

export default function Profile() {
  return (
    <Section title="Profile" icon={CircleUserRound}>
      <div className="flex flex-col gap-2.5">
        {profile.paragraphs.map((text) => (
          <p key={text} className="[text-wrap:pretty]">
            {text}
          </p>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: Skills 컴포넌트**

`components/Skills.tsx`:

```tsx
import { Database, Grid2x2, Layers, Square, type LucideIcon } from "lucide-react";
import Section from "@/components/Section";
import { skillGroups } from "@/data/skills";
import type { SkillIcon } from "@/data/types";

const groupIcons: Record<SkillIcon, LucideIcon> = {
  core: Square,
  state: Grid2x2,
  backend: Database,
};

export default function Skills() {
  return (
    <Section title="Skills" icon={Layers}>
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-3">
        {skillGroups.map((group) => {
          const Icon = groupIcons[group.icon];
          return (
            <div key={group.label} className="border-t border-divider py-2.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-[11px] tracking-[0.06em] text-neutral-600">
                <Icon size={13} strokeWidth={2} aria-hidden />
                {group.label}
              </div>
              <ul className="font-semibold leading-[1.7]">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
```

- [ ] **Step 7: Career 컴포넌트**

`components/Career.tsx`:

```tsx
import { Briefcase, Calendar, Check, User } from "lucide-react";
import Section from "@/components/Section";
import { career } from "@/data/career";

export default function Career() {
  return (
    <Section title="Career" icon={Briefcase}>
      <div className="flex flex-col gap-6">
        {career.map((item) => (
          <article key={item.company} className="flex flex-col gap-2 break-inside-avoid">
            <h3 className="text-[20px] tracking-[-0.01em]">{item.company}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-neutral-700">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} strokeWidth={2} className="text-neutral-600" aria-hidden />
                {item.period}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User size={13} strokeWidth={2} className="text-neutral-600" aria-hidden />
                {item.role}
              </span>
            </div>
            <ul className="flex flex-col gap-1">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <Check size={16} strokeWidth={2} className="mt-1 shrink-0 text-accent" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 8: page.tsx 조립**

`app/page.tsx`:

```tsx
import Career from "@/components/Career";
import Header from "@/components/Header";
import Profile from "@/components/Profile";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main className="container-page">
      <Header />
      <Profile />
      <Skills />
      <Career />
    </main>
  );
}
```

- [ ] **Step 9: 테스트·린트 통과 확인**

```bash
npm run test && npm run lint
```

Expected: 모두 PASS. `getByText`가 중복 매치로 실패하면(예: "프론트엔드 개발자"가 여러 곳) `getAllByText(...)[0]`로 바꾸지 말고 원인을 확인한다. 이 시점에는 Projects가 없으므로 중복은 없어야 한다.

- [ ] **Step 10: 스크린샷 확인**

```bash
npm run dev -- --port 3000 &
sleep 5
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/portfolio-task4-desktop.png --window-size=1280,1400 http://localhost:3000
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/portfolio-task4-mobile.png --window-size=390,1800 http://localhost:3000
kill %1
```

두 이미지를 Read로 열어 확인: 데스크톱은 140px 라벨 열 + 콘텐츠, Skills 3열, 2px 구분선. 모바일은 1열 스택, 연락처가 이름 아래.

- [ ] **Step 11: 커밋**

```bash
git add -A && git commit -m "feat: Header, Profile, Skills, Career 섹션 구현

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: ProjectCard flip 카드와 Projects 섹션

**Files:**
- Create: `components/ProjectCard.tsx`, `components/Projects.tsx`
- Modify: `app/globals.css` (flip CSS 추가), `app/page.tsx` (Projects 추가), `test/page.test.tsx` (Projects 검증 추가)
- Test: `test/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: Task 3 `Project`, `projects`; Task 4 `Section`
- Produces: `ProjectCard` props `{ project: Project }`; `Projects` props 없음. CSS 클래스 `.flip`, `.flip-inner`, `.face`, `.face-front`, `.face-back`, `.flip.is-flipped`

- [ ] **Step 1: 실패하는 테스트 작성**

`test/ProjectCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/data/types";

const project: Project = {
  id: "demo",
  name: "Demo Project",
  period: "2025.01 ~ 2025.02",
  team: "팀 프로젝트",
  role: "프론트엔드",
  intro: "데모 소개 문장입니다.",
  stack: "Next.js · TypeScript",
  links: ["https://example.com/repo", "https://example.com/video"],
  details: ["첫 번째 성과", "두 번째 성과"],
};

describe("ProjectCard", () => {
  it("renders front content and back details", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getAllByRole("heading", { level: 3, name: project.name })).toHaveLength(2);
    expect(screen.getByText(project.period)).toBeInTheDocument();
    expect(screen.getByText(project.team)).toBeInTheDocument();
    expect(screen.getByText(project.role)).toBeInTheDocument();
    expect(screen.getByText(project.intro)).toBeInTheDocument();
    expect(screen.getByText(project.stack)).toBeInTheDocument();
    for (const link of project.links) {
      const a = screen.getByRole("link", { name: link });
      expect(a).toHaveAttribute("href", link);
      expect(a).toHaveAttribute("target", "_blank");
      expect(a).toHaveAttribute("rel", "noopener noreferrer");
    }
    for (const d of project.details) expect(screen.getByText(d)).toBeInTheDocument();
  });

  it("toggles aria-pressed on click", async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={project} />);
    const card = screen.getByRole("button", { name: /Demo Project/ });
    expect(card).toHaveAttribute("aria-pressed", "false");
    await user.click(card);
    expect(card).toHaveAttribute("aria-pressed", "true");
    expect(card).toHaveClass("is-flipped");
    await user.click(card);
    expect(card).toHaveAttribute("aria-pressed", "false");
    expect(card).not.toHaveClass("is-flipped");
  });

  it("toggles with Enter and Space when the card itself is focused", async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={project} />);
    const card = screen.getByRole("button", { name: /Demo Project/ });
    card.focus();
    await user.keyboard("{Enter}");
    expect(card).toHaveAttribute("aria-pressed", "true");
    await user.keyboard(" ");
    expect(card).toHaveAttribute("aria-pressed", "false");
  });

  it("does not toggle when a link inside is clicked", async () => {
    const user = userEvent.setup();
    render(<ProjectCard project={project} />);
    const card = screen.getByRole("button", { name: /Demo Project/ });
    const link = screen.getByRole("link", { name: project.links[0] });
    await user.click(link);
    expect(card).toHaveAttribute("aria-pressed", "false");
  });
});
```

`test/page.test.tsx`에 다음 테스트를 추가한다 (기존 import에 `import { projects } from "@/data/projects";` 추가):

```tsx
  it("renders Projects section with a flip card per project", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 2, name: "Projects" })).toBeInTheDocument();
    for (const p of projects) {
      expect(screen.getByRole("button", { name: new RegExp(p.name) })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    }
  });
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npm run test
```

Expected: ProjectCard.test.tsx FAIL (`Cannot find module '@/components/ProjectCard'`), page.test.tsx의 Projects 테스트 FAIL.

- [ ] **Step 3: flip CSS 추가**

`app/globals.css` 맨 아래에 추가:

```css
/* Flip card (Projects) */
.flip {
  perspective: 1400px;
  cursor: pointer;
  min-height: 300px;
}
.flip-inner {
  display: grid;
  min-height: 300px;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.flip.is-flipped .flip-inner {
  transform: rotateY(180deg);
}
.face {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.face-front {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
}
.flip:hover .face-front {
  border-color: var(--color-accent);
}
.face-back {
  background: var(--color-ink);
  color: var(--color-ground);
  transform: rotateY(180deg);
}
.face-back a {
  color: var(--color-accent-300);
}
@media (prefers-reduced-motion: reduce) {
  .flip-inner {
    transition: none;
  }
}
```

- [ ] **Step 4: ProjectCard 컴포넌트**

`components/ProjectCard.tsx`:

```tsx
"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Calendar, Check, Code, Layers, Link as LinkIcon, RefreshCw, RotateCcw, Users } from "lucide-react";
import type { Project } from "@/data/types";

type ProjectCardProps = { project: Project };

export default function ProjectCard({ project }: ProjectCardProps) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((v) => !v);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const stopClick = (e: MouseEvent<HTMLAnchorElement>) => e.stopPropagation();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={toggle}
      onKeyDown={onKeyDown}
      className={`flip ${flipped ? "is-flipped" : ""}`}
    >
      <div className="flip-inner">
        <div className="face face-front">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[19px] tracking-[-0.01em]">{project.name}</h3>
            <RefreshCw size={16} strokeWidth={2} className="shrink-0 text-accent print:hidden" aria-hidden />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-neutral-700">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} strokeWidth={2} className="text-neutral-600" aria-hidden />
              {project.period}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} strokeWidth={2} className="text-neutral-600" aria-hidden />
              {project.team}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Code size={13} strokeWidth={2} className="text-neutral-600" aria-hidden />
              {project.role}
            </span>
          </div>
          <p className="flex-1 text-[13px] leading-[1.55] [text-wrap:pretty]">{project.intro}</p>
          <div className="flex flex-col gap-1 border-t border-divider pt-2 text-[12px] text-neutral-700">
            <span className="inline-flex items-start gap-1.5">
              <Layers size={13} strokeWidth={2} className="mt-1 shrink-0 text-neutral-600" aria-hidden />
              {project.stack}
            </span>
            {project.links.map((link) => (
              <span key={link} className="inline-flex items-start gap-1.5">
                <LinkIcon size={13} strokeWidth={2} className="mt-1 shrink-0 text-neutral-600" aria-hidden />
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={stopClick}
                  className="break-all"
                >
                  {link}
                </a>
              </span>
            ))}
          </div>
        </div>

        <div className="face face-back">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="mb-1 text-[10px] uppercase tracking-[0.12em] text-accent-400">
                Main work · Trouble shooting
              </div>
              <h3 className="text-[19px] tracking-[-0.01em]">{project.name}</h3>
            </div>
            <RotateCcw size={16} strokeWidth={2} className="shrink-0 text-accent-400 print:hidden" aria-hidden />
          </div>
          <ul className="flex flex-1 flex-col gap-1.5 text-[13px] leading-[1.55]">
            {project.details.map((detail) => (
              <li key={detail} className="flex items-start gap-2">
                <Check size={16} strokeWidth={2} className="mt-1 shrink-0 text-accent-400" aria-hidden />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Projects 섹션**

`components/Projects.tsx`:

```tsx
import { Folder, RefreshCw } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import Section from "@/components/Section";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <Section
      title="Projects"
      icon={Folder}
      last
      aside={
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 print:hidden">
          <RefreshCw size={13} strokeWidth={2} aria-hidden />
          카드를 클릭하면 뒤집힙니다
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: page.tsx에 Projects 추가**

`app/page.tsx`의 import에 `import Projects from "@/components/Projects";`를 추가하고 `<Career />` 아래에 `<Projects />`를 넣는다:

```tsx
import Career from "@/components/Career";
import Header from "@/components/Header";
import Profile from "@/components/Profile";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main className="container-page">
      <Header />
      <Profile />
      <Skills />
      <Career />
      <Projects />
    </main>
  );
}
```

- [ ] **Step 7: 테스트·린트 통과 확인**

```bash
npm run test && npm run lint
```

Expected: 모두 PASS. 기존 page.test.tsx의 `getByText(item.role)`("프론트엔드 개발자")가 PAD의 role "프론트엔드"와 부분 일치하지 않는지 확인 — `getByText`는 기본이 완전 일치 문자열이므로 통과해야 한다. 만약 Career의 `User` 아이콘 role 텍스트와 ProjectCard의 텍스트가 정확히 같아 중복되면 테스트를 `getAllByText`로 바꾸지 말고 `within(screen.getByRole('heading',{name:'Career'}).closest('section')!)` 범위로 좁힌다.

- [ ] **Step 8: 스크린샷 확인 (앞면·뒷면)**

```bash
npm run dev -- --port 3000 &
sleep 5
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=/tmp/portfolio-task5-desktop.png --window-size=1280,2200 http://localhost:3000
kill %1
```

Read로 확인: 카드 2개가 세로 스택, surface 배경 + 1px 테두리 + 16px 라운드, 우상단 회전 아이콘, 하단에 stack·링크. 뒷면은 클릭이 필요하므로 정적 스크린샷으로는 보이지 않는다. 뒷면 확인은 Task 6의 print 스크린샷으로 대신한다.

- [ ] **Step 9: 커밋**

```bash
git add -A && git commit -m "feat: 프로젝트 flip 카드와 Projects 섹션 구현

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: 인쇄 스타일

**Files:**
- Modify: `app/globals.css` (`@media print` 추가)

**Interfaces:**
- Consumes: Task 5의 `.flip`, `.flip-inner`, `.face`, `.face-back`, Task 2의 `.container-page`

- [ ] **Step 1: print CSS 추가**

`app/globals.css` 맨 아래에 추가:

```css
@media print {
  @page {
    size: A4;
    margin: 0.7in;
  }
  html,
  body {
    background: #fff;
  }
  .container-page {
    max-width: none;
    padding: 0;
  }
  a {
    color: var(--color-accent-700);
  }
  section,
  header,
  article,
  .flip {
    break-inside: avoid;
  }
  .flip {
    perspective: none;
    cursor: default;
    min-height: 0;
  }
  .flip-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
    transform: none !important;
    transform-style: flat;
    transition: none;
  }
  .face {
    grid-area: auto;
    transform: none;
    backface-visibility: visible;
    -webkit-backface-visibility: visible;
  }
  .face-back {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

- [ ] **Step 2: 빌드·린트·테스트 확인**

```bash
npm run lint && npm run test && npm run build
```

Expected: 모두 성공.

- [ ] **Step 3: 인쇄 PDF 생성으로 확인**

```bash
npm run dev -- --port 3000 &
sleep 5
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --print-to-pdf=/tmp/portfolio-print.pdf --no-pdf-header-footer http://localhost:3000
kill %1
```

`/tmp/portfolio-print.pdf`를 Read(pages "1-3")로 열어 확인: 흰 배경, 카드마다 앞면 아래에 잉크색 뒷면이 이어서 출력, 회전 아이콘과 "카드를 클릭하면 뒤집힙니다" 안내문 없음, 페이지 중간에서 카드가 잘리지 않음.

- [ ] **Step 4: 커밋**

```bash
git add -A && git commit -m "style: A4 인쇄 스타일 추가 (flip 해제, 앞뒷면 세로 출력)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: README와 GitHub push

**Files:**
- Modify: `README.md` (전체 교체)

**Interfaces:**
- Consumes: 모든 이전 태스크의 커밋

- [ ] **Step 1: README 교체**

`README.md`:

````markdown
# 이재혁 — Frontend Web Developer 이력서

Claude Design(Modernist 디자인 시스템)으로 만든 이력서를 Next.js로 구현한 단일 페이지 사이트입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # Vitest
npm run lint
npm run build
```

## 구조

- `app/` — 레이아웃, 페이지, 전역 스타일(디자인 토큰 `@theme`, flip 카드, 인쇄)
- `components/` — Header, Profile, Skills, Career, Projects, ProjectCard, Section
- `data/` — 이력서 콘텐츠. 내용을 바꾸려면 이 폴더의 파일만 수정합니다
- `test/` — Vitest + Testing Library
- `docs/superpowers/` — 설계 문서와 구현 계획

## 인쇄

브라우저 인쇄(⌘P)로 A4 이력서 PDF를 만들 수 있습니다. 프로젝트 카드는 앞면·뒷면이 모두 출력됩니다.

## TODO

- `data/career.ts`의 use9 업무 내용 채우기
````

- [ ] **Step 2: 최종 검증**

```bash
npm run lint && npm run test && npm run build && git status --short
```

Expected: 모두 성공, working tree clean(README 변경만 남음).

- [ ] **Step 3: README 커밋**

```bash
git add README.md && git commit -m "docs: README 작성

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 4: 원격 연결 및 push**

```bash
git remote add origin https://github.com/JaeHye0k/portfolio.git
git push -u origin main
```

Expected: `main -> main`, `branch 'main' set up to track 'origin/main'`.

- [ ] **Step 5: 원격 확인**

```bash
gh repo view JaeHye0k/portfolio --json defaultBranchRef,pushedAt && gh api repos/JaeHye0k/portfolio/commits --jq '.[0].commit.message'
```

Expected: defaultBranchRef.name이 `main`, 최신 커밋 메시지가 "docs: README 작성".
