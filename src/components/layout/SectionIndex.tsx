import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface SectionIndexProps {
  word: string;
}

/** Oversized outlined word stamped in a section's background — systems
 * chrome, not decoration. Drifts slightly on scroll (parallax) unless
 * prefers-reduced-motion. */
export function SectionIndex({ word }: SectionIndexProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return;
      gsap.to(ref.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion] },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="section-index pointer-events-none absolute top-[-0.08em] right-0 -z-10 text-[clamp(56px,13vw,168px)] leading-none font-bold whitespace-nowrap select-none"
    >
      {word}
    </div>
  );
}
