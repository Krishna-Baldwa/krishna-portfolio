import { useEffect, useRef, useState } from "react";
import { HERO } from "../../content/copy";
import { HeroField } from "./hero/HeroField";
import { AgentTerminal } from "./hero/AgentTerminal";
import { MagneticLink } from "../ui/Magnetic";
import { PhotoFrame } from "../ui/PhotoFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "../../lib/gsap";

/** A small typing detail next to the avatar — decorative only. It never
 * gates the headline: name/role/credibility render immediately on mount
 * so a fast-scanning visitor never waits on an animation to read them. */
function useBootLine(text: string) {
  const [printed, setPrinted] = useState("");
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setPrinted(text);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setPrinted(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 24);
    return () => window.clearInterval(id);
  }, [text, prefersReducedMotion]);

  return printed;
}

export function Hero() {
  const printed = useBootLine(HERO.planLine);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const el = containerRef.current;
      if (!el) return;

      const onScroll = () => {
        const y = window.scrollY;
        gsap.set(el, {
          y: y * 0.14,
          opacity: Math.max(0, 1 - y / 720),
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] },
  );

  return (
    <header
      id="top"
      ref={containerRef}
      className="relative isolate mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-center overflow-clip px-[clamp(18px,5vw,64px)] pt-[clamp(100px,12vw,148px)] pb-[clamp(64px,9vw,110px)]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <HeroField />
      </div>

      <div className="flex flex-wrap items-center gap-[clamp(32px,5vw,64px)]">
        <div className="min-w-[min(100%,320px)] max-w-[640px] flex-[1_1_460px]">
          <div className="mb-6 flex items-center gap-3.5">
            <PhotoFrame shape="circle" className="h-[88px] w-[88px] shrink-0" />
            <div className="min-h-[17px] font-mono text-[11.5px]" style={{ color: "var(--color-ink-faint)" }}>
              {printed}
              <span
                className="blink-caret ml-0.5 inline-block w-[7px]"
                style={{ color: "var(--accent)" }}
              >
                ▌
              </span>
            </div>
          </div>

          <h1 className="font-display text-[clamp(34px,5.4vw,58px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
            {HERO.name}
          </h1>
          <div
            className="font-display mt-1 mb-[18px] text-[clamp(17px,2.2vw,23px)] font-medium tracking-[-0.01em]"
            style={{ color: "var(--accent)" }}
          >
            {HERO.role}
          </div>

          <p className="mb-[18px] max-w-[58ch] font-mono text-[12.5px] leading-[1.75] text-pretty" style={{ color: "var(--color-ink-faint)" }}>
            {HERO.credibility}
          </p>

          <p
            className="mb-[30px] max-w-[46ch] text-[clamp(15px,1.6vw,17.5px)] leading-[1.6] font-light text-pretty"
            style={{ color: "var(--color-ink-dim)" }}
          >
            {HERO.tagline}
          </p>

          <div className="flex flex-wrap gap-2.5">
            <MagneticLink
              href="#builds"
              className="inline-flex items-center gap-2 rounded-full px-[18px] py-[11px] text-[13.5px]"
              style={{
                border: "1px solid var(--accent-line)",
                background: "var(--accent-fill)",
                color: "var(--color-ink)",
              }}
            >
              What I build <span style={{ color: "var(--accent)" }}>→</span>
            </MagneticLink>
            <MagneticLink
              href="#connect"
              className="inline-flex items-center rounded-full px-[18px] py-[11px] text-[13.5px]"
              style={{ border: "1px solid var(--color-line)", color: "var(--color-ink-dim)" }}
            >
              Say hi
            </MagneticLink>
          </div>
        </div>

        <aside className="w-full min-w-[min(100%,320px)] lg:w-[340px] lg:shrink-0 xl:w-[380px]">
          <AgentTerminal />
        </aside>
      </div>

      <div className="mt-[clamp(40px,6vw,72px)] font-mono text-[11px] tracking-[.08em]" style={{ color: "var(--color-ink-faint)" }}>
        scroll to explore ↓
      </div>
    </header>
  );
}
