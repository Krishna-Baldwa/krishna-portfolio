import { useRef } from "react";
import { BROADCAST } from "../../content/copy";
import { SectionIndex } from "../layout/SectionIndex";
import { SectionKicker } from "../layout/SectionKicker";
import { MagneticLink } from "../ui/Magnetic";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Broadcast() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { y: 18 });

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
        className="mb-[clamp(26px,4vw,40px)] max-w-[66ch] text-[clamp(15px,1.55vw,16.5px)] leading-[1.7] font-light text-pretty"
        style={{ color: "var(--color-ink-dim)" }}
      >
        {BROADCAST.copy}
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[clamp(12px,1.6vw,18px)]">
        {BROADCAST.posts.map((post, i) => (
          <a
            key={post.id}
            data-reveal
            data-cursor-hover
            href={BROADCAST.handleUrl}
            target="_blank"
            rel="noopener"
            className="group flex aspect-[4/5] flex-col justify-between rounded-2xl p-4 transition-colors"
            style={{ border: "1px solid var(--color-line)", background: "var(--color-canvas-raised)" }}
          >
            <span className="font-mono text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-[15px] leading-snug font-medium text-pretty">
              {post.caption}
            </span>
            <span className="font-mono text-[11px]" style={{ color: "var(--accent)" }}>
              {BROADCAST.handle} ↗
            </span>
          </a>
        ))}
      </div>

      <div data-reveal className="mt-[22px]">
        <MagneticLink href={BROADCAST.handleUrl} target="_blank" rel="noopener" className="text-[14px]" style={{ color: "var(--accent)" }}>
          Follow along → instagram.com/inthe_blur
        </MagneticLink>
      </div>
    </section>
  );
}
