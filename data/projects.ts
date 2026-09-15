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
    stack:
      "Next.js · TypeScript · TanStack Query · Zustand · Tailwind CSS · Prisma ORM · Supabase",
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
