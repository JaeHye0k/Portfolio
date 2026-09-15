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
