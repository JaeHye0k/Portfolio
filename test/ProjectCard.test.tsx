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
