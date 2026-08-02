import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

type LineRole = "task" | "agent" | "tool" | "done" | "divider";

interface ScriptLine {
  role: Exclude<LineRole, "divider">;
  text: string;
}

interface LineItem {
  id: number;
  role: LineRole;
  text: string;
  exiting?: boolean;
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
  divider: "var(--color-ink-faint)",
};

// Matches quoted strings, `word(`-style function calls (lookahead so the
// paren itself stays in the base color), 3-digit status codes, and "OK" —
// classified in that priority order wherever the regex matches.
const TOKEN_PATTERN = /("[^"]*"|\b\w+(?=\()|\b\d{3}\b|\bOK\b)/g;

function highlightTokens(text: string, baseColor: string): ReactNode {
  const parts = text.split(TOKEN_PATTERN);
  return parts.map((part, i) => {
    if (!part) return null;
    const isMatch = i % 2 === 1;
    if (!isMatch) return <span key={i}>{part}</span>;

    let color = "var(--accent-hi)"; // function-call identifier, the fallback match kind
    if (/^".*"$/.test(part)) color = "var(--color-ink)";
    else if (/^\d{3}$/.test(part) || part === "OK") color = "var(--accent)";

    return (
      <span key={i} style={{ color }}>
        {part}
      </span>
    );
  });
}

const TYPE_MS = 16;
const LINE_PAUSE_MS = 260;
const PENDING_MS = 620;
const SCENARIO_PAUSE_MS = 1500;
const EXIT_MS = 250;
const MAX_VISIBLE_LINES = 11;

function toLineItem(id: number, line: ScriptLine): LineItem {
  return { id, role: line.role, text: line.text };
}

/** Drives one line at a time onto a rolling buffer, char-by-char, then
 * pauses and moves to the next scripted session — a small looping proof
 * that this is what she actually builds, running quietly beside her name.
 * Tool calls get an extra "pending" beat before their response lands, and
 * sessions are separated by a divider line instead of a hard clear, so the
 * buffer reads as one continuous log rather than resetting to blank. */
function useAgentTrace(prefersReducedMotion: boolean) {
  const [lines, setLines] = useState<LineItem[]>(() =>
    prefersReducedMotion ? SCRIPTS[0].map((line, i) => toLineItem(i, line)) : [],
  );
  const [partial, setPartial] = useState("");
  const [partialRole, setPartialRole] = useState<LineRole>("task");
  const [pending, setPending] = useState(false);
  const timeoutRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const buffer: LineItem[] = [];
    let nextId = 0;
    let scenario = 0;
    let lineIndex = 0;
    let charIndex = 0;
    let sessionCount = 1;
    let cancelled = false;

    const pushLine = (role: LineRole, text: string) => {
      const id = nextId++;
      buffer.push({ id, role, text });
      if (buffer.length > MAX_VISIBLE_LINES) {
        const evictId = buffer[0].id;
        buffer[0] = { ...buffer[0], exiting: true };
        setLines([...buffer]);
        window.setTimeout(() => {
          if (cancelled) return;
          const idx = buffer.findIndex((l) => l.id === evictId);
          if (idx !== -1) buffer.splice(idx, 1);
          setLines([...buffer]);
        }, EXIT_MS);
      } else {
        setLines([...buffer]);
      }
    };

    const step = () => {
      if (cancelled) return;
      const script = SCRIPTS[scenario];
      const line = script[lineIndex];

      if (charIndex <= line.text.length) {
        setPartial(line.text.slice(0, charIndex));
        setPartialRole(line.role);
        charIndex++;
        timeoutRef.current = window.setTimeout(step, TYPE_MS);
        return;
      }

      const awaitsToolResponse =
        line.role === "agent" && /tool_call/.test(line.text) && script[lineIndex + 1]?.role === "tool";

      pushLine(line.role, line.text);
      setPartial("");
      charIndex = 0;
      lineIndex++;

      if (lineIndex >= script.length) {
        timeoutRef.current = window.setTimeout(() => {
          if (cancelled) return;
          sessionCount++;
          pushLine("divider", `── session ${String(sessionCount).padStart(2, "0")} ──`);
          scenario = (scenario + 1) % SCRIPTS.length;
          lineIndex = 0;
          timeoutRef.current = window.setTimeout(step, LINE_PAUSE_MS);
        }, SCENARIO_PAUSE_MS);
        return;
      }

      if (awaitsToolResponse) {
        setPending(true);
        timeoutRef.current = window.setTimeout(() => {
          if (cancelled) return;
          setPending(false);
          step();
        }, PENDING_MS);
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

  return { lines, partial, partialRole, pending };
}

export function AgentTerminal() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { lines, partial, partialRole, pending } = useAgentTrace(prefersReducedMotion);

  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="terminal-glow pointer-events-none absolute -inset-10 -z-10 blur-xl"
        style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent 72%)" }}
      />

      <div className="rounded-2xl p-5" style={{ border: "1px solid var(--color-line)", background: "var(--color-canvas-raised)" }}>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f56", opacity: 0.7 }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ffbd2e", opacity: 0.7 }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#27c93f", opacity: 0.7 }} />
          </span>
          <span className="font-mono text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
            agent_session.log
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
            <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
            running
          </span>
        </div>

        <div className="flex h-[264px] flex-col justify-end gap-[7px] overflow-hidden font-mono text-[12.5px] leading-[1.55]">
          {lines.map((line, i) => (
            <div
              key={line.id}
              className={[
                "text-pretty",
                line.exiting ? "line-exit" : "line-enter",
                line.role === "divider" ? "text-center" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                color: ROLE_COLOR[line.role],
                opacity: line.exiting ? undefined : 0.4 + (0.6 * (i + 1)) / MAX_VISIBLE_LINES,
              }}
            >
              {line.role === "divider" ? line.text : highlightTokens(line.text, ROLE_COLOR[line.role])}
            </div>
          ))}

          {pending && !prefersReducedMotion && (
            <div className="flex items-center gap-1 py-[2px]">
              <span className="pending-dot h-1 w-1 rounded-full" style={{ background: "var(--color-ink-faint)", animationDelay: "0ms" }} />
              <span className="pending-dot h-1 w-1 rounded-full" style={{ background: "var(--color-ink-faint)", animationDelay: "150ms" }} />
              <span className="pending-dot h-1 w-1 rounded-full" style={{ background: "var(--color-ink-faint)", animationDelay: "300ms" }} />
            </div>
          )}

          {!prefersReducedMotion && !pending && (
            <div className="text-pretty" style={{ color: ROLE_COLOR[partialRole] }}>
              {partial}
              <span className="blink-caret ml-0.5 inline-block w-[6px]" style={{ color: "var(--accent)" }}>
                ▌
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
