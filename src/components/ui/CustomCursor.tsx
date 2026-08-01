import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/** Magnetic dot + trailing ring cursor. Fine-pointer only (CSS also hides it
 * on coarse/touch, this just avoids doing the work there too). Hoverable
 * targets opt in via `data-cursor-hover`. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) return;

      const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

      const onMove = (e: MouseEvent) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onEnter = () => gsap.to(ring, { scale: 2.4, duration: 0.3, ease: "power3" });
      const onLeave = () => gsap.to(ring, { scale: 1, duration: 0.3, ease: "power3" });

      window.addEventListener("mousemove", onMove);
      const hoverables = Array.from(document.querySelectorAll("[data-cursor-hover]"));
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });

      return () => {
        window.removeEventListener("mousemove", onMove);
        hoverables.forEach((el) => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      };
    },
    { dependencies: [prefersReducedMotion] },
  );

  if (prefersReducedMotion) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{ width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5 }}
      />
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          width: 34,
          height: 34,
          marginLeft: -17,
          marginTop: -17,
          border: "1px solid var(--color-ink)",
          background: "transparent",
        }}
      />
    </>
  );
}
