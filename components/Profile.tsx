import { CircleUserRound } from "lucide-react";
import Section from "@/components/Section";
import { profile } from "@/data/profile";

export default function Profile() {
  return (
    <Section title="Profile" icon={CircleUserRound}>
      <div className="flex flex-col gap-2.5">
        {profile.paragraphs.map((text) => (
          <p key={text} className="[text-wrap:pretty]">
            {text}
          </p>
        ))}
      </div>
    </Section>
  );
}
