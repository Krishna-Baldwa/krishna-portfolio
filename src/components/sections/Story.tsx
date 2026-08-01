import { useRef } from "react";
import { STORY } from "../../content/copy";
import { SectionIndex } from "../layout/SectionIndex";
import { SectionKicker } from "../layout/SectionKicker";
import { PhotoFrame } from "../ui/PhotoFrame";
import { gsap, useGSAP } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      const paragraphs = gsap.utils.toArray<HTMLElement>("[data-lit]", ref.current);

      if (prefersReducedMotion) {
        gsap.set(paragraphs, { opacity: 1, y: 0 });
        return;
      }

      paragraphs.forEach((p) => {
        gsap.fromTo(
          p,
          { opacity: 0.15, y: 22 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: p, start: "top 88%", end: "top 42%", scrub: true },
          },
        );
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion] },
  );

  return (
    <section
      id="story"
      ref={ref}
      className="relative mx-auto max-w-[1240px] overflow-clip px-[clamp(18px,5vw,64px)] py-[clamp(48px,7vw,96px)]"
    >
      <SectionIndex word="STORY" />
      <SectionKicker title="My story" status="[retrieving: context]" />

      <div className="flex flex-wrap items-start gap-[clamp(28px,4.5vw,60px)]">
        <div className="min-w-[min(100%,260px)] max-w-[400px] flex-[1_1_300px]">
          <PhotoFrame className="aspect-[4/5] w-full" label="KB" />
          <div className="mt-3 font-mono text-[10.5px]" style={{ color: "var(--color-ink-faint)" }}>
            [context: ichalkaranji → mumbai]
          </div>
        </div>

        <div
          className="flex min-w-[min(100%,320px)] max-w-[62ch] flex-[1_1_460px] flex-col gap-5 text-[clamp(15px,1.55vw,16.5px)] leading-[1.75] font-light"
          style={{ color: "var(--color-ink-dim)" }}
        >
          {STORY.paragraphs.map((paragraph, i) => {
            const isLast = i === STORY.paragraphs.length - 1;
            return (
              <p
                key={paragraph.slice(0, 24)}
                data-lit
                className={isLast ? "text-pretty font-normal" : "text-pretty"}
                style={isLast ? { color: "var(--color-ink)" } : undefined}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
