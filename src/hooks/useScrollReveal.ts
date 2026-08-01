import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface ScrollRevealOptions {
  selector?: string;
  y?: number;
  stagger?: number;
}

/** Generic scroll-into-view fade+rise for a container's `[data-reveal]`
 * children, staggered. Used across sections that don't need a bespoke
 * scroll-scrubbed treatment (Hero, Story, and the Builds rail each have
 * their own hand-tuned motion instead). */
export function useScrollReveal(scope: RefObject<HTMLElement | null>, options: ScrollRevealOptions = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { selector = "[data-reveal]", y = 22, stagger = 0.08 } = options;

  useGSAP(
    () => {
      if (!scope.current) return;
      const targets = gsap.utils.toArray<HTMLElement>(selector, scope.current);
      if (targets.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(targets, { opacity: 1, y: 0 });
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
    { scope, dependencies: [prefersReducedMotion, selector, y, stagger] },
  );
}
