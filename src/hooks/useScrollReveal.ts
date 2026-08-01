import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface ScrollRevealOptions {
  selector?: string;
  y?: number;
  stagger?: number;
  /** Continuously tie opacity/position to scroll progress across a window
   * (top 88% -> top 42% of viewport), like Story's paragraph reveal —
   * instead of a one-shot trigger that plays once and holds. */
  scrub?: boolean;
  /** Starting opacity in scrub mode. Defaults to 0.15, not fully invisible —
   * a 0→1 ramp on near-white text against a near-black background is a
   * harsh contrast pop; starting partially visible softens it noticeably. */
  fromOpacity?: number;
}

/** Generic scroll-into-view fade+rise for a container's `[data-reveal]`
 * children. Defaults to a one-shot trigger (play once, reverse on scroll
 * back up past it); pass `scrub: true` for the continuous, scroll-tied
 * variant used across Story and (per request) Notebook downward. */
export function useScrollReveal(scope: RefObject<HTMLElement | null>, options: ScrollRevealOptions = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { selector = "[data-reveal]", y = 22, stagger = 0.08, scrub = false, fromOpacity = 0.15 } = options;

  useGSAP(
    () => {
      if (!scope.current) return;
      const targets = gsap.utils.toArray<HTMLElement>(selector, scope.current);
      if (targets.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      if (scrub) {
        targets.forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: fromOpacity, y },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 88%", end: "top 42%", scrub: true },
            },
          );
        });
        return;
      }

      gsap.set(targets, { opacity: 0, y });
      targets.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: (i % 10) * stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope, dependencies: [prefersReducedMotion, selector, y, stagger, scrub, fromOpacity] },
  );
}
