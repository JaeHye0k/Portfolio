import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  aside?: ReactNode;
  last?: boolean;
};

export default function Section({
  title,
  icon: Icon,
  children,
  aside,
  last = false,
}: SectionProps) {
  return (
    <section
      className={`grid grid-cols-1 gap-3 py-[22px] md:grid-cols-[140px_minmax(0,1fr)] md:gap-6 print:grid-cols-[140px_minmax(0,1fr)] print:gap-6 ${
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
