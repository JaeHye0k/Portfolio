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
