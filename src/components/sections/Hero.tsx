import { useEffect, useRef, useState } from "react";
import { HERO } from "../../content/copy";
import { HeroField } from "./hero/HeroField";
import { AgentGraph } from "./hero/AgentGraph";
import { ScrambleText } from "../ui/ScrambleText";
import { MagneticLink } from "../ui/Magnetic";
import { PhotoFrame } from "../ui/PhotoFrame";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "../../lib/gsap";

/** The "boot" beat: types out the plan line character by character before
 * the headline resolves — a brief, legible stand-in for a loading screen
 * that never blocks first paint. */
function useBootLine(text: string) {
  const [printed, setPrinted] = useState("");
  const [done, setDone] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setPrinted(text);
      setDone(true);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setPrinted(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 24);
    return () => window.clearInterval(id);
  }, [text, prefersReducedMotion]);

  return { printed, done };
}

export function Hero() {
  const { printed, done } = useBootLine(HERO.planLine);
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
      className="relative mx-auto max-w-[1240px] px-[clamp(18px,5vw,64px)] pt-[clamp(96px,12vw,140px)] pb-[clamp(56px,8vw,110px)]"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-[120%]">
        <HeroField />
      </div>

      <div className="flex flex-wrap items-start gap-[clamp(28px,5vw,64px)]">
        <div className="min-w-[min(100%,320px)] flex-[1_1_380px]">
          <div className="mb-6 flex items-center gap-3.5">
            <PhotoFrame shape="circle" className="h-[104px] w-[104px] shrink-0" />
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

          <h1 className="font-display mb-[22px] text-[clamp(38px,7vw,80px)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance">
            {done && (
              <>
                <ScrambleText text={HERO.headline} trigger="mount" />{" "}
                <span style={{ color: "var(--accent)" }}>
                  <ScrambleText text={HERO.headlineAccent} trigger="mount" delayMs={280} />
                </span>
              </>
            )}
          </h1>

          <p
            className="mb-[30px] max-w-[46ch] text-[clamp(15px,1.6vw,17.5px)] leading-[1.6] font-light text-pretty"
            style={{ color: "var(--color-ink-dim)" }}
          >
            {HERO.subline}
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
              className="inline-flex items-center rounded-full border border-white/10 px-[18px] py-[11px] text-[13.5px]"
              style={{ color: "var(--color-ink-dim)" }}
            >
              Say hi
            </MagneticLink>
          </div>
        </div>

        <div className="min-w-[min(100%,300px)] flex-[1_1_480px] self-center">
          <AgentGraph />
          <div className="mt-3.5 text-center font-mono text-[10.5px]" style={{ color: "var(--color-ink-faint)" }}>
            [graph: how a thing gets built]
          </div>
        </div>
      </div>

      <div className="mt-[clamp(30px,4.5vw,54px)] font-mono text-[11px] tracking-[.08em]" style={{ color: "var(--color-ink-faint)" }}>
        scroll to explore ↓
      </div>
    </header>
  );
}
