import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

interface QueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char?: string;
}

/** Cycles each character through random glyphs before it settles on the
 * real one — a decode/terminal effect, retriggered whenever the element
 * scrolls into view. Runs as imperative DOM text mutation (not React state)
 * since it repaints every animation frame. */
class Scrambler {
  private el: HTMLElement;
  private queue: QueueItem[] = [];
  private frame = 0;
  private frameRequest = 0;

  constructor(el: HTMLElement) {
    this.el = el;
  }

  setText(newText: string) {
    const oldText = this.el.textContent ?? "";
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] ?? "";
      const to = newText[i] ?? "";
      const start = Math.floor(Math.random() * 18);
      const end = start + Math.floor(Math.random() * 18);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.tick();
  }

  destroy() {
    cancelAnimationFrame(this.frameRequest);
  }

  private tick = () => {
    let output = "";
    let settled = 0;

    for (const item of this.queue) {
      if (this.frame >= item.end) {
        settled++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.3) {
          item.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        output += `<span style="opacity:.45">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }

    this.el.innerHTML = output;

    if (settled < this.queue.length) {
      this.frame++;
      this.frameRequest = requestAnimationFrame(this.tick);
    }
  };
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: "mount" | "inView";
  delayMs?: number;
}

export function ScrambleText({
  text,
  className,
  trigger = "inView",
  delayMs = 0,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = text;
      return;
    }

    const scrambler = new Scrambler(el);
    let timeoutId = 0;
    let observer: IntersectionObserver | undefined;

    const run = () => {
      timeoutId = window.setTimeout(() => scrambler.setText(text), delayMs);
    };

    if (trigger === "mount") {
      run();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            run();
            observer?.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(el);
    }

    return () => {
      window.clearTimeout(timeoutId);
      observer?.disconnect();
      scrambler.destroy();
    };
  }, [text, prefersReducedMotion, trigger, delayMs]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
