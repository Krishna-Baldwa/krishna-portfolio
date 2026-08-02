import { useRef } from "react";
import { gsap, useGSAP } from "../../../lib/gsap";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

const NODES = [
  { x: 60, y: 110, w: 140, h: 40, label: "an idea", dim: true },
  { x: 60, y: 250, w: 140, h: 40, label: "messy data", dim: true },
  { x: 330, y: 175, w: 118, h: 38, label: "plan" },
  { x: 490, y: 90, w: 132, h: 38, label: "retrieve" },
  { x: 495, y: 260, w: 122, h: 38, label: "reason" },
  { x: 665, y: 175, w: 96, h: 38, label: "act" },
  { x: 845, y: 68, w: 200, h: 42, label: "a shipped product", out: true },
  { x: 845, y: 172, w: 200, h: 42, label: "a post", out: true },
  { x: 845, y: 276, w: 200, h: 42, label: "an insight", out: true },
];

const PATHS = [
  "M200,130 C260,130 270,185 330,185",
  "M200,270 C260,270 270,205 330,205",
  "M448,188 C468,188 468,105 490,105",
  "M448,200 C468,200 470,275 495,275",
  "M622,105 C642,105 650,188 665,188",
  "M617,278 C640,278 645,200 665,200",
  "M761,188 C800,188 805,89 845,89",
  "M761,194 L845,193",
  "M761,200 C800,200 805,297 845,297",
];

export function AgentGraph() {
  const ref = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      const paths = gsap.utils.toArray<SVGPathElement>("[data-graph-path]", ref.current);
      const nodes = gsap.utils.toArray<SVGGElement>("[data-graph-node]", ref.current);

      if (prefersReducedMotion) {
        gsap.set(paths, { opacity: 0.9 });
        gsap.set(nodes, { opacity: 1, scale: 1 });
        return;
      }

      gsap.set(nodes, { opacity: 0, scale: 0.9, transformOrigin: "center" });
      paths.forEach((p, i) => {
        const length = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDashoffset: length },
          { strokeDashoffset: 0, duration: 0.8, delay: 0.15 + i * 0.09, ease: "power2.out" },
        );
      });
      gsap.to(nodes, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.4,
        ease: "back.out(1.7)",
      });

      gsap.to("[data-graph-active]", {
        opacity: 0.45,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.3, repeat: -1 },
      });

      // The signature "loud" moment: a bright signal literally travels the
      // wiring, continuously, so the graph reads as a live system rather
      // than a static illustration.
      const pulses = gsap.utils.toArray<SVGCircleElement>("[data-graph-pulse]", ref.current);
      pulses.forEach((pulse, i) => {
        const path = paths[i % paths.length];
        gsap.to(pulse, {
          motionPath: { path, align: path },
          repeat: -1,
          duration: 2.2,
          delay: i * 0.5,
          ease: "power1.inOut",
        });
        gsap.fromTo(
          pulse,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            repeat: -1,
            repeatDelay: 1.85,
            delay: i * 0.5,
            yoyo: true,
            ease: "sine.inOut",
          },
        );
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion] },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 1080 360"
      className="block h-auto w-full overflow-visible"
      role="img"
      aria-label="Diagram: an idea and messy data flow through plan, retrieve, reason, act, into a shipped product, a post, and an insight"
    >
      <defs>
        <filter id="graph-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* The static wiring + nodes recede into atmosphere — only the
          traveling pulses below stay at full strength, so the one thing
          that reads clearly is the signal, not the diagram. */}
      <g opacity="0.4">
        <g stroke="#ffffff1c" fill="none" strokeWidth="1">
          {PATHS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g stroke="var(--accent)" fill="none" strokeWidth="1.3" strokeLinecap="round">
          {PATHS.map((d) => (
            <path key={d} d={d} data-graph-path />
          ))}
        </g>
        <g fontFamily="var(--font-body)" fontSize="13.5" textAnchor="middle">
          {NODES.filter((n) => n.dim).map((n) => (
            <g key={n.label}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} fill="#ffffff08" stroke="#ffffff1f" />
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 5} fill="#9a948b">
                {n.label}
              </text>
            </g>
          ))}
        </g>
        <g fontFamily="var(--font-mono)" fontSize="13">
          {NODES.filter((n) => !n.dim && !n.out).map((n) => (
            <g key={n.label} data-graph-node data-graph-active>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={13} fill="var(--accent-fill)" stroke="var(--accent-line)" />
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 4.5} textAnchor="middle" fill="var(--color-ink)">
                {n.label}
              </text>
            </g>
          ))}
        </g>
        <g fontFamily="var(--font-body)" fontSize="13.5" textAnchor="middle">
          {NODES.filter((n) => n.out).map((n) => (
            <g key={n.label} data-graph-node>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.h / 2} fill="var(--color-canvas-raised)" stroke="var(--accent-line)" />
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 5} fill="var(--color-ink)">
                {n.label}
              </text>
            </g>
          ))}
        </g>
      </g>
      {!prefersReducedMotion && (
        <g filter="url(#graph-glow)">
          {PATHS.map((d, i) => (
            <circle key={d} r="3.2" fill="var(--accent-hi)" opacity="0" data-graph-pulse data-graph-pulse-index={i} />
          ))}
        </g>
      )}
    </svg>
  );
}
