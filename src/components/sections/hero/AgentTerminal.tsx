import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

type LineRole = "task" | "agent" | "tool" | "done";

interface ScriptLine {
  role: LineRole;
  text: string;
}

// Three fake sessions, each tied to a real build (stock agent, enterprise
// copilot, @inthe_blur) so the loop reads as "this is what she actually
// builds," not a generic agent demo.
const SCRIPTS: ScriptLine[][] = [
  [
    { role: "task", text: "> task: review portfolio positions" },
    { role: "agent", text: "[agent] tool_call: get_holdings()" },
    { role: "tool", text: "[tool] 200 OK · 8 positions" },
    { role: "agent", text: "[agent] reasoning: hold NVDA — earnings in 12 days" },
    { role: "agent", text: "[agent] tool_call: notify(\"hold NVDA\")" },
    { role: "done", text: "✓ recommendation sent to telegram" },
  ],
  [
    { role: "task", text: "> task: summarize brand sentiment, Q3" },
    { role: "agent", text: "[agent] spawning sub-agent: retrieval" },
    { role: "tool", text: "[tool] 200 OK · 42k mentions indexed" },
    { role: "agent", text: "[agent] spawning sub-agent: synthesis" },
    { role: "agent", text: "[agent] reasoning: sentiment +6% vs Q2" },
    { role: "done", text: "✓ report ready for brand team" },
  ],
  [
    { role: "task", text: "> task: draft this week's @inthe_blur post" },
    { role: "agent", text: "[agent] tool_call: fetch_trending(\"agentic ai\")" },
    { role: "tool", text: "[tool] 200 OK · 3 topics found" },
    { role: "agent", text: "[agent] reasoning: \"RAG explainer\" tests best" },
    { role: "agent", text: "[agent] tool_call: draft_script()" },
    { role: "done", text: "✓ script ready — recording tonight" },
  ],
];

const ROLE_COLOR: Record<LineRole, string> = {
  task: "var(--color-ink)",
  agent: "var(--accent)",
  tool: "var(--color-ink-faint)",
  done: "var(--accent-hi)",
};

const TYPE_MS = 16;
const LINE_PAUSE_MS = 260;
const SCENARIO_PAUSE_MS = 1500;
const MAX_VISIBLE_LINES = 7;

/** Drives one line at a time onto a rolling buffer, char-by-char, then
 * pauses and moves to the next scripted session — a small looping proof
 * that this is what she actually builds, running quietly beside her name. */
function useAgentTrace(prefersReducedMotion: boolean) {
  const [lines, setLines] = useState<ScriptLine[]>(() =>
    prefersReducedMotion ? SCRIPTS[0] : [],
  );
  const [partial, setPartial] = useState("");
  const timeoutRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let scenario = 0;
    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      const script = SCRIPTS[scenario];
      const line = script[lineIndex];

      if (charIndex <= line.text.length) {
        setPartial(line.text.slice(0, charIndex));
        charIndex++;
        timeoutRef.current = window.setTimeout(step, TYPE_MS);
        return;
      }

      setLines((prev) => [...prev, line].slice(-MAX_VISIBLE_LINES));
      setPartial("");
      charIndex = 0;
      lineIndex++;

      if (lineIndex >= script.length) {
        timeoutRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setLines([]);
          scenario = (scenario + 1) % SCRIPTS.length;
          lineIndex = 0;
          step();
        }, SCENARIO_PAUSE_MS);
        return;
      }

      timeoutRef.current = window.setTimeout(step, LINE_PAUSE_MS);
    };

    timeoutRef.current = window.setTimeout(step, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutRef.current);
    };
  }, [prefersReducedMotion]);

  return { lines, partial };
}

export function AgentTerminal() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { lines, partial } = useAgentTrace(prefersReducedMotion);

  return (
    <div className="rounded-2xl p-5" style={{ border: "1px solid var(--color-line)", background: "var(--color-canvas-raised)" }}>
      <div className="mb-4 flex items-center justify-between font-mono text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
        <span>[agent_trace]</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          running
        </span>
      </div>

      <div className="flex h-[168px] flex-col justify-end gap-[7px] overflow-hidden font-mono text-[12px] leading-[1.5]">
        {lines.map((line, i) => (
          <div
            key={`${line.text}-${i}`}
            className="text-pretty"
            style={{ color: ROLE_COLOR[line.role], opacity: 0.4 + (0.6 * (i + 1)) / MAX_VISIBLE_LINES }}
          >
            {line.text}
          </div>
        ))}
        {!prefersReducedMotion && (
          <div className="text-pretty" style={{ color: "var(--color-ink)" }}>
            {partial}
            <span className="blink-caret ml-0.5 inline-block w-[6px]" style={{ color: "var(--accent)" }}>
              ▌
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
