import { useEffect, useRef, useState } from "react";
import { NAV_STEPS } from "../../content/copy";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { useLenis } from "../../hooks/useLenis";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";

type ThemeMode = "dark" | "light";

// Violet is the one constant brand accent now — dark/light no longer
// varies it. This list only exists to scrub a legacy failure mode: an
// earlier build let a violet/teal accent switch set these as inline
// styles on <html>, and inline styles outlive a JS hot-reload (they're
// raw DOM mutations React never owned), so a stray teal override could
// persist in an old tab even after the switcher itself was removed.
const LEGACY_ACCENT_PROPS = ["--accent", "--accent-hi", "--accent-line", "--accent-fill", "--accent-dim", "--accent-glow"];

const SECTION_IDS = NAV_STEPS.map((step) => step.id);

export function StatusBarNav() {
  const activeId = useScrollSpy(SECTION_IDS);
  const activeIndex = Math.max(0, SECTION_IDS.indexOf(activeId));
  const active = NAV_STEPS[activeIndex] ?? NAV_STEPS[0];
  const lenis = useLenis();
  const fillRef = useRef<HTMLDivElement>(null);
  const verticalFillRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    LEGACY_ACCENT_PROPS.forEach((prop) => document.documentElement.style.removeProperty(prop));
  }, []);

  // Top-edge and left-edge fills both track overall document scroll
  // progress — the "trace" line for the whole page, distinct from any
  // per-section motion. One ScrollTrigger driving both, not two.
  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (fillRef.current) gsap.set(fillRef.current, { scaleX: self.progress });
        if (verticalFillRef.current) gsap.set(verticalFillRef.current, { scaleY: self.progress });
      },
    });
    return () => trigger.kill();
  }, []);

  const applyMode = (next: ThemeMode) => {
    document.documentElement.dataset.theme = next;
    setMode(next);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -64, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-[2px]" style={{ background: "var(--color-line)" }}>
        <div
          ref={fillRef}
          className="h-full origin-left"
          style={{ transform: "scaleX(0)", background: "linear-gradient(90deg, var(--accent), var(--accent-hi))" }}
        />
      </div>

      <div className="fixed inset-y-0 left-0 z-50 hidden w-[2px] lg:block" style={{ background: "var(--color-line)" }}>
        <div
          ref={verticalFillRef}
          className="w-full origin-top"
          style={{ transform: "scaleY(0)", height: "100%", background: "linear-gradient(180deg, var(--accent), var(--accent-hi))" }}
        />
      </div>

      <nav
        className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-3 px-4 backdrop-blur-md md:px-8"
        style={{
          borderBottom: "1px solid var(--color-line)",
          background: "color-mix(in srgb, var(--color-canvas) 70%, transparent)",
        }}
      >
        <button
          onClick={() => scrollTo("top")}
          data-cursor-hover
          className="font-display shrink-0 text-[15px] font-semibold tracking-tight"
        >
          krishna<span style={{ color: "var(--accent)" }}>.</span>
        </button>

        <div className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-[color:var(--color-ink-faint)]">
          <span>step</span>
          <span style={{ color: "var(--accent)" }}>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span>/{String(NAV_STEPS.length).padStart(2, "0")}</span>
          <span className="mx-1 hidden lg:inline">—</span>
          <span className="hidden lg:inline">{active.system}</span>
        </div>

        <div className="no-scrollbar hidden min-w-0 items-center gap-4 overflow-x-auto sm:flex">
          {NAV_STEPS.filter((s) => s.id !== "top").map((step) => (
            <button
              key={step.id}
              onClick={() => scrollTo(step.id)}
              data-cursor-hover
              className="shrink-0 font-mono text-[11px] tracking-wide whitespace-nowrap transition-colors"
              style={{ color: active.id === step.id ? "var(--accent)" : "var(--color-ink-faint)" }}
            >
              {step.label}
            </button>
          ))}
        </div>

        <div
          className="hidden shrink-0 items-center gap-1 rounded-full p-1 font-mono text-[10px] sm:flex"
          style={{ border: "1px solid var(--color-line)", background: "var(--color-canvas-raised)" }}
        >
          {(["dark", "light"] as ThemeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => applyMode(m)}
              data-cursor-hover
              className="rounded-full px-2 py-1 transition-colors"
              style={{
                color: mode === m ? "var(--accent)" : "var(--color-ink-faint)",
                background: mode === m ? "var(--accent-fill)" : "transparent",
                border: `1px solid ${mode === m ? "var(--accent-line)" : "transparent"}`,
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
