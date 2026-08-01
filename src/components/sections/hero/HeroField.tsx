import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

/** Ambient particle field scoped to the hero viewport — accent-colored dots
 * drifting with proximity links, reading the live `--accent` custom property
 * so it stays in sync with the violet/teal trace toggle. */
export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(60, Math.max(24, Math.round((w * h) / 22000)));
    const points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1.2 + Math.random() * 1.4,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    const readAccent = (): [number, number, number] => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#8b7bff";
      const n = Number.parseInt(raw.replace("#", ""), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const [r, g, b] = readAccent();
      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        // Gentle repel around the cursor — makes the field read as reactive
        // rather than purely decorative, without a heavy physics sim.
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / 126) * 0.6;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;
        ctx.fillStyle = `rgba(${r},${g},${b},.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 8000) {
            ctx.strokeStyle = `rgba(${r},${g},${b},${((1 - d2 / 8000) * 0.18).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-50" />;
}
