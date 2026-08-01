import { ScrambleText } from "../ui/ScrambleText";

interface SectionKickerProps {
  title: string;
  status: string;
  as?: "h2" | "h3";
}

export function SectionKicker({ title, status, as: Tag = "h2" }: SectionKickerProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3.5 md:mb-11">
      <span className="pulse-dot h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--accent)" }} />
      <Tag className="font-display text-[clamp(24px,3.4vw,38px)] font-semibold tracking-tight">
        <ScrambleText text={title} />
      </Tag>
      <span className="font-mono text-[11.5px]" style={{ color: "var(--color-ink-faint)" }}>
        {status}
      </span>
    </div>
  );
}
