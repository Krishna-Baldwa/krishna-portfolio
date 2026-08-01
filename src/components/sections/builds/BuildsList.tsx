import { useRef, useState } from "react";
import { PROJECTS } from "../../../content/projects";
import { BuildRow } from "./BuildRow";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

export function BuildsList() {
  const ref = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(PROJECTS[0]?.id ?? null);

  useScrollReveal(ref, { y: 16, stagger: 0.06 });

  return (
    <div ref={ref} className="mx-auto max-w-[880px]">
      {PROJECTS.map((project, i) => (
        <BuildRow
          key={project.id}
          project={project}
          index={i}
          isOpen={openId === project.id}
          onToggle={() => setOpenId((current) => (current === project.id ? null : project.id))}
        />
      ))}
      <div style={{ borderTop: "1px solid var(--color-line)" }} />
    </div>
  );
}
