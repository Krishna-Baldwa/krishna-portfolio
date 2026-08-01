import { useRef } from "react";
import { LIFE } from "../../content/copy";
import { SectionIndex } from "../layout/SectionIndex";
import { SectionKicker } from "../layout/SectionKicker";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Life() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { y: 14, stagger: 0.05 });

  return (
    <section
      id="life"
      ref={ref}
      className="relative mx-auto max-w-[1100px] overflow-clip px-[clamp(18px,5vw,64px)] py-[clamp(48px,7vw,96px)]"
    >
      <SectionIndex word="LIFE" />
      <SectionKicker title="10 things about me" status="[context: state]" />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-x-[clamp(20px,3vw,44px)] gap-y-2.5">
        {LIFE.facts.map((fact, i) => (
          <div key={fact.slice(0, 20)} data-reveal className="flex gap-3.5 py-2.5 text-[14.5px] leading-[1.6] font-light" style={{ color: "var(--color-ink-dim)" }}>
            <span className="pt-[2px] font-mono text-[11.5px]" style={{ color: "var(--accent)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-pretty">{fact}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
