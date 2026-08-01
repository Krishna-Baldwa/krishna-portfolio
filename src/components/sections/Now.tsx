import { useRef } from "react";
import { NOW } from "../../content/copy";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Now() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { scrub: true });

  return (
    <section id="now" ref={ref} className="relative mx-auto max-w-[920px] px-[clamp(18px,5vw,64px)] py-[clamp(40px,6vw,80px)]">
      <div
        data-reveal
        className="rounded-2xl p-[clamp(22px,3vw,34px)]"
        style={{ border: "1px solid var(--color-line)", background: "var(--color-canvas-raised)" }}
      >
        <div className="mb-3.5 flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px]"
            style={{ border: "1px solid var(--accent-line)", color: "var(--color-ink)" }}
          >
            <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            running
          </span>
          <h2 className="font-display text-[clamp(22px,2.8vw,30px)] font-semibold tracking-[-0.03em]">{NOW.heading}</h2>
          <span className="text-[12.5px] italic" style={{ color: "var(--color-ink-faint)" }}>
            {NOW.updated}
          </span>
        </div>
        <p className="max-w-[60ch] text-[clamp(15px,1.6vw,17px)] leading-[1.7] font-light text-pretty" style={{ color: "var(--color-ink-dim)" }}>
          {NOW.copy}
        </p>
      </div>
    </section>
  );
}
