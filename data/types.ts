export type Contact = {
  birth: string;
  email: string;
  phone: string;
  location: string;
};

export type Profile = {
  kicker: string;
  name: string;
  tagline: string;
  contact: Contact;
  paragraphs: string[];
};

export type SkillIcon = "core" | "state" | "backend";

export type SkillGroup = {
  label: string;
  icon: SkillIcon;
  items: string[];
};

export type CareerItem = {
  company: string;
  period: string;
  role: string;
  bullets: string[];
};

export type Project = {
  id: string;
  name: string;
  period: string;
  team: string;
  role: string;
  intro: string;
  stack: string;
  links: string[];
  details: string[];
};
