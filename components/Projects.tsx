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
