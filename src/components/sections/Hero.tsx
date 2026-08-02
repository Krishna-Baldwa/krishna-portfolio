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
      className="relative isolate mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-center overflow-clip px-[clamp(18px,5vw,64px)] pt-[clamp(88px,10vw,120px)] pb-[clamp(64px,9vw,120px)]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <HeroField />
      </div>

      {/* The agent graph as atmosphere, not a boxed column: oversized, faded,
          bleeding off the right edge, sitting behind the copy rather than
          beside it — a system running in the background, not a diagram to
          parse. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-1/2 right-[-10%] h-[60%] w-[48%] min-w-[420px] -translate-y-1/2 blur-3xl"
          style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent 72%)" }}
        />
        <div className="absolute top-1/2 right-[-8%] hidden w-[50%] min-w-[520px] -translate-y-1/2 lg:block">
          <AgentGraph />
        </div>
      </div>

      <div className="max-w-[640px]">
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

        <h1 className="font-display mb-[22px] text-[clamp(40px,7.5vw,88px)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance">
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

      <div
        className="absolute inset-x-0 bottom-[clamp(22px,4vw,40px)] flex items-center justify-between px-[clamp(18px,5vw,64px)] font-mono text-[11px] tracking-[.08em]"
        style={{ color: "var(--color-ink-faint)" }}
      >
        <span>scroll to explore ↓</span>
        <span className="hidden text-[10.5px] tracking-normal sm:inline">[graph: how a thing gets built]</span>
      </div>
    </header>
  );
}
