import { Code, Mail, MapPin, Phone, User } from "lucide-react";
import { profile } from "@/data/profile";

const contactIconClass = "shrink-0 text-neutral-600";

export default function Header() {
  const { kicker, name, tagline, contact } = profile;
  return (
    <header className="grid grid-cols-1 gap-6 border-b-2 border-divider pb-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div>
        <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
          <Code size={13} strokeWidth={2} aria-hidden />
          {kicker}
        </div>
        <h1 className="mb-3 text-[40px] leading-[1.05] tracking-[-0.02em]">{name}</h1>
        <p className="text-[17px] font-semibold leading-[1.35] [text-wrap:pretty]">{tagline}</p>
      </div>
      <ul className="flex flex-col gap-1.5 text-[12.5px] leading-[1.5]">
        <li className="flex items-center gap-2">
          <User size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          {contact.birth}
        </li>
        <li className="flex items-center gap-2">
          <Mail size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
        <li className="flex items-center gap-2">
          <Phone size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          {contact.phone}
        </li>
        <li className="flex items-center gap-2">
          <MapPin size={16} strokeWidth={2} className={contactIconClass} aria-hidden />
          {contact.location}
        </li>
      </ul>
    </header>
  );
}
