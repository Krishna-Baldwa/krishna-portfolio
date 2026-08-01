import type { Project } from "../../../types/content";

const STATUS_LABEL: Record<Project["status"], string> = {
  shipped: "shipped",
  archived: "archived",
  paused: "paused",
};

interface BuildRowProps {
  project: Project;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function BuildRow({ project, index, isOpen, onToggle }: BuildRowProps) {
  const isActive = project.status === "shipped";
  const panelId = `build-panel-${project.id}`;

  return (
    <div data-reveal style={{ borderTop: "1px solid var(--color-line)" }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        data-cursor-hover
        className="flex w-full items-center gap-3 py-5 text-left md:gap-5"
      >
        <span className="w-5 shrink-0 font-mono text-[11px]" style={{ color: "var(--color-ink-faint)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        <span
          className="hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] sm:inline-flex"
          style={{
            border: `1px solid ${isActive ? "var(--accent-line)" : "#ffffff24"}`,
            color: isActive ? "var(--color-ink)" : "#8f8981",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: isActive ? "var(--accent)" : "var(--color-ink-faint)" }}
          />
          {STATUS_LABEL[project.status]}
        </span>

        <span className="font-display flex-1 truncate text-[clamp(16px,2.2vw,21px)] font-semibold tracking-[-0.01em]">
          {project.title}
        </span>

        <span
          className="hidden shrink-0 font-mono text-[11px] md:inline"
          style={{ color: "var(--color-ink-faint)" }}
        >
          [{project.tag}]
        </span>

        <span
          className="ml-1 shrink-0 text-[18px] leading-none font-light transition-transform duration-300"
          style={{ color: "var(--accent)", transform: isOpen ? "rotate(45deg)" : "none" }}
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div
        id={panelId}
        className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3.5 py-1.5 pr-8 pb-6 pl-8 md:pl-[52px]">
            <span
              className="font-mono text-[11px] sm:hidden"
              style={{ color: "var(--color-ink-faint)" }}
            >
              [{project.tag}]
            </span>
            <p className="text-[14.5px] leading-[1.65] font-light" style={{ color: "var(--color-ink-dim)" }}>
              {project.story}
            </p>
            <p className="text-[13.5px] leading-[1.55]" style={{ color: "var(--color-ink)" }}>
              <span className="font-mono text-[11px]" style={{ color: "var(--accent)" }}>
                learned&nbsp;→&nbsp;
              </span>
              {project.learned}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
