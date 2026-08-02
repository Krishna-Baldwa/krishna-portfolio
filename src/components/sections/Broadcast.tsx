import { useRef } from "react";
import { BROADCAST } from "../../content/copy";
import { SectionIndex } from "../layout/SectionIndex";
import { SectionKicker } from "../layout/SectionKicker";
import { MagneticLink } from "../ui/Magnetic";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Broadcast() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { y: 18, scrub: true });

  return (
    <section
      id="broadcast"
      ref={ref}
      className="relative mx-auto max-w-[1240px] overflow-clip px-[clamp(18px,5vw,64px)] py-[clamp(48px,7vw,96px)]"
    >
      <SectionIndex word="BLUR" />
      <SectionKicker title={BROADCAST.heading} status="[publishing: @inthe_blur]" />

      <p
        data-reveal
        className="mb-[clamp(30px,4.5vw,44px)] max-w-[66ch] text-[clamp(15px,1.55vw,16.5px)] leading-[1.7] font-light text-pretty"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {BROADCAST.copy}
      </p>

      <div data-reveal className="grid grid-cols-1 md:grid-cols-2 md:gap-x-[clamp(24px,3vw,48px)]" style={{ borderTop: "1px solid var(--color-line)" }}>
        {BROADCAST.posts.map((post, i) => (
          <a
            key={post.id}
            data-cursor-hover
            href={BROADCAST.handleUrl}
            target="_blank"
            rel="noopener"
            className="group flex items-baseline gap-3.5 py-[18px]"
            style={{ borderBottom: "1px solid var(--color-line)" }}
          >
            <span className="shrink-0 font-mono text-[11.5px]" style={{ color: "var(--accent)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display flex-1 text-[clamp(15.5px,1.85vw,18.5px)] leading-snug font-medium text-pretty transition-colors">
              {post.caption}
            </span>
            <span
              className="shrink-0 font-mono text-[11px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color: "var(--color-ink-faint)" }}
            >
              watch ↗
            </span>
          </a>
        ))}
      </div>

      <div data-reveal className="mt-[clamp(28px,4vw,40px)]">
        <MagneticLink href={BROADCAST.handleUrl} target="_blank" rel="noopener" className="text-[14px]" style={{ color: "var(--accent)" }}>
          Follow along → instagram.com/inthe_blur
        </MagneticLink>
      </div>
    </section>
  );
}
