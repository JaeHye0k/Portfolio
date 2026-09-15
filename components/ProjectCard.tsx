"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import {
  Calendar,
  Check,
  Code,
  Layers,
  Link as LinkIcon,
  RefreshCw,
  RotateCcw,
  Users,
} from "lucide-react";
import type { Project } from "@/data/types";

type ProjectCardProps = { project: Project };

const metaIconClass = "shrink-0 text-neutral-600";

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
            <RefreshCw
              size={16}
              strokeWidth={2}
              className="shrink-0 text-accent print:hidden"
              aria-hidden
            />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-neutral-700">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} strokeWidth={2} className={metaIconClass} aria-hidden />
              {project.period}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={13} strokeWidth={2} className={metaIconClass} aria-hidden />
              {project.team}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Code size={13} strokeWidth={2} className={metaIconClass} aria-hidden />
              {project.role}
            </span>
          </div>
          <p className="flex-1 text-[13px] leading-[1.55] [text-wrap:pretty]">{project.intro}</p>
          <div className="flex flex-col gap-1 border-t border-divider pt-2 text-[12px] text-neutral-700">
            <span className="inline-flex items-start gap-1.5">
              <Layers size={13} strokeWidth={2} className={`mt-1 ${metaIconClass}`} aria-hidden />
              {project.stack}
            </span>
            {project.links.map((link) => (
              <span key={link} className="inline-flex items-start gap-1.5">
                <LinkIcon size={13} strokeWidth={2} className={`mt-1 ${metaIconClass}`} aria-hidden />
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
            <RotateCcw
              size={16}
              strokeWidth={2}
              className="shrink-0 text-accent-400 print:hidden"
              aria-hidden
            />
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
