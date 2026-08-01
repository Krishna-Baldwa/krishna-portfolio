import { useEffect, useState } from "react";

const THRESHOLD_RATIO = 0.35;

/** Tracks which section id is "current" for the status-bar nav: the last
 * section (in document order) whose top has scrolled past ~35% down the
 * viewport. A direct offsetTop/scrollY comparison, recomputed on every
 * scroll event — not an IntersectionObserver band, which has to be narrow
 * to feel precise and then reliably lags behind on short sections (their
 * whole height can pass through a narrow band in one scroll motion). */
export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const update = () => {
      // At the very bottom of the page there's nowhere left to scroll, so a
      // short last section can sit fully on screen without the threshold
      // line ever reaching its offsetTop — force it active in that case
      // rather than leaving the previous section stuck highlighted.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 2) {
        const last = elements[elements.length - 1].id;
        setActiveId((prev) => (prev === last ? prev : last));
        return;
      }

      const line = window.scrollY + window.innerHeight * THRESHOLD_RATIO;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.offsetTop <= line) current = el.id;
        else break;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionIds]);

  return activeId;
}
