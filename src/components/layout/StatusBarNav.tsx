import { useRef, useState } from "react";
import { NAV_STEPS } from "../../content/copy";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { useLenis } from "../../hooks/useLenis";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";

const THEMES = {
  violet: { accent: "#8b7bff", hi: "#a99bff", line: "#8b7bff61", fill: "#8b7bff1a", dim: "#8b7bff4d", glow: "#8b7bff29" },
  teal: { accent: "#2fd8c0", hi: "#6fe7d6", line: "#2fd8c05c", fill: "#2fd8c017", dim: "#2fd8c047", glow: "#2fd8c024" },
} as const;

type ThemeName = keyof typeof THEMES;

const SECTION_IDS = NAV_STEPS.map((step) => step.id);

export function StatusBarNav() {
  const activeId = useScrollSpy(SECTION_IDS);
  const activeIndex = Math.max(0, SECTION_IDS.indexOf(activeId));
  const active = NAV_STEPS[activeIndex] ?? NAV_STEPS[0];
  const lenis = useLenis();
  const fillRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeName>("violet");

  // Thin top-edge fill tracks overall document scroll progress — the
  // "trace" line for the whole page, distinct from any per-section motion.
  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (fillRef.current) gsap.set(fillRef.current, { scaleX: self.progress });
      },
    });
    return () => trigger.kill();
  }, []);

  const applyTheme = (name: ThemeName) => {
    const t = THEMES[name];
    const root = document.documentElement.style;
    root.setProperty("--accent", t.accent);
    root.setProperty("--accent-hi", t.hi);
    root.setProperty("--accent-line", t.line);
    root.setProperty("--accent-fill", t.fill);
    root.setProperty("--accent-dim", t.dim);
    root.setProperty("--accent-glow", t.glow);
    setTheme(name);
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
      <div className="fixed inset-x-0 top-0 z-50 h-[2px] bg-white/5">
        <div
          ref={fillRef}
          className="h-full origin-left"
          style={{ transform: "scaleX(0)", background: "linear-gradient(90deg, var(--accent), var(--accent-hi))" }}
        />
      </div>

      <nav className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-white/5 bg-[#0b0a09]/70 px-4 backdrop-blur-md md:px-8">
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

        <div className="hidden shrink-0 items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 font-mono text-[10px] sm:flex">
          {(Object.keys(THEMES) as ThemeName[]).map((name) => (
            <button
              key={name}
              onClick={() => applyTheme(name)}
              data-cursor-hover
              className="rounded-full px-2 py-1 transition-colors"
              style={{
                color: theme === name ? THEMES[name].accent : "var(--color-ink-faint)",
                background: theme === name ? THEMES[name].fill : "transparent",
                border: `1px solid ${theme === name ? THEMES[name].line : "transparent"}`,
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
