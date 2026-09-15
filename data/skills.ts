import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    label: "CORE",
    icon: "core",
    items: ["React", "Next.js", "TypeScript", "JavaScript"],
  },
  {
    label: "STATE · STYLE",
    icon: "state",
    items: ["TanStack Query", "Zustand", "Tailwind CSS"],
  },
  {
    label: "BACKEND · TOOLS",
    icon: "backend",
    items: ["Prisma ORM", "Supabase", "Git / GitHub", "Figma"],
  },
];
