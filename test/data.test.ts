import { describe, it, expect } from "vitest";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { career } from "@/data/career";
import { projects } from "@/data/projects";

describe("data", () => {
  it("profile has name, kicker, tagline, contact and 2 paragraphs", () => {
    expect(profile.name).toBe("이재혁");
    expect(profile.kicker).toBe("Frontend Web Developer");
    expect(profile.tagline.length).toBeGreaterThan(0);
    expect(profile.contact.email).toContain("@");
    expect(profile.paragraphs).toHaveLength(2);
  });

  it("skills has 3 groups with non-empty items", () => {
    expect(skillGroups).toHaveLength(3);
    for (const group of skillGroups) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it("career has at least one item with bullets", () => {
    expect(career.length).toBeGreaterThan(0);
    expect(career[0].company).toBe("use9");
    expect(career[0].bullets.length).toBeGreaterThan(0);
  });

  it("projects are Moneed and PAD with unique ids and details", () => {
    expect(projects.map((p) => p.name)).toEqual(["Moneed", "PAD"]);
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of projects) {
      expect(p.details.length).toBeGreaterThan(0);
      expect(p.links.length).toBeGreaterThan(0);
      for (const link of p.links) expect(link).toMatch(/^https:\/\//);
    }
  });
});
