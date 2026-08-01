import { useRef } from "react";
import { NOTEBOOK } from "../../content/copy";
import { SectionIndex } from "../layout/SectionIndex";
import { SectionKicker } from "../layout/SectionKicker";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Notebook() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { y: 16, stagger: 0.07 });

  return (
    <section
      id="notebook"
      ref={ref}
      className="relative mx-auto max-w-[920px] overflow-clip px-[clamp(18px,5vw,64px)] py-[clamp(48px,7vw,96px)]"
    >
      <SectionIndex word="NOTES" />
      <SectionKicker title="Notebook" status="[running: beliefs]" />

      <p data-reveal className="mb-[clamp(26px,4vw,40px)] text-[15.5px] font-light" style={{ color: "var(--color-ink-dim)" }}>
        {NOTEBOOK.intro}
      </p>

      <div className="flex flex-col">
        {NOTEBOOK.entries.map((entry, i) => (
          <div
            key={entry.index}
            data-reveal
            className="flex gap-[clamp(16px,3vw,28px)] py-[18px]"
            style={{
              borderTop: "1px solid var(--color-line)",
              borderBottom: i === NOTEBOOK.entries.length - 1 ? "1px solid var(--color-line)" : undefined,
            }}
          >
            <span className="pt-[3px] font-mono text-[12px]" style={{ color: "var(--accent)" }}>
              {entry.index}
            </span>
            <p className="text-[clamp(15.5px,1.7vw,18px)] leading-[1.6] text-pretty" style={{ color: "var(--color-ink)" }}>
              {entry.text}
              {i === NOTEBOOK.entries.length - 1 && (
                <span className="blink-caret ml-1.5 inline-block w-[7px]" style={{ color: "var(--accent)" }}>
                  ▌
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
