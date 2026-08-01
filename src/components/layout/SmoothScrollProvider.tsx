import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { LenisContext } from "../../hooks/useLenis";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // Variable/kinetic type shifts layout after fonts swap in, which shifts
  // every ScrollTrigger's cached start/end math — refresh once fonts settle,
  // independent of whether Lenis is running.
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setLenis(null);
      return;
    }

    // Lenis and GSAP must share one rAF loop, or scrub/pin ScrollTriggers
    // desync from the visible (Lenis-smoothed) scroll position.
    const instance = new Lenis({ autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Pinning (the Builds rail) inserts a spacer that changes the
    // document's total scrollable height. ScrollTrigger recalculates its
    // own measurements on "refresh" (font load, resize, invalidateOnRefresh
    // pins recomputing), but Lenis caches its own scroll-limit separately —
    // without telling it to resize too, Lenis's limit goes stale relative to
    // the pin spacer and produces a visible jump right at the pin's
    // start/end boundary. This is the fix.
    const onRefresh = () => instance.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    setLenis(instance);

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
