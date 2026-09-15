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
