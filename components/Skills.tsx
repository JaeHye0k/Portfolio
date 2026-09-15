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
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-3 print:grid-cols-3">
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
