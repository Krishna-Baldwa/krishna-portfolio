import { useRef } from "react";
import { CONNECT } from "../../content/copy";
import { MagneticLink } from "../ui/Magnetic";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export function Connect() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref, { y: 16 });

  return (
    <footer
      id="connect"
      ref={ref}
      className="relative mx-auto max-w-[1240px] px-[clamp(18px,5vw,64px)] pt-[clamp(56px,8vw,110px)] pb-10"
    >
      <div data-reveal className="mx-auto max-w-[560px] text-center">
        <div className="mb-[18px] font-mono text-[11.5px]" style={{ color: "var(--color-ink-faint)" }}>
          contact.send({"{"} via: "instagram" {"}"})
        </div>
        <h2 className="font-display mb-4 text-[clamp(30px,5vw,52px)] font-semibold tracking-[-0.035em]">
          {CONNECT.heading.replace(/\.$/, "")}
          <span style={{ color: "var(--accent)" }}>.</span>
        </h2>
        <p className="mb-[30px] text-[clamp(15px,1.6vw,16.5px)] leading-[1.7] font-light text-pretty" style={{ color: "var(--color-ink-dim)" }}>
          {CONNECT.copy}
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {CONNECT.links.map((link, i) => (
            <MagneticLink
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener"}
              className="inline-flex items-center rounded-full px-[18px] py-[10px] text-[13.5px]"
              style={
                i === 0
                  ? { border: "1px solid var(--accent-line)", background: "var(--accent-fill)", color: "var(--color-ink)" }
                  : { border: "1px solid #ffffff1a", color: "var(--color-ink-dim)" }
              }
            >
              {link.label}
            </MagneticLink>
          ))}
        </div>
      </div>

      <div
        data-reveal
        className="mt-[clamp(48px,7vw,80px)] flex flex-wrap justify-between gap-2.5 pt-[22px] text-[12.5px]"
        style={{ borderTop: "1px solid var(--color-line)", color: "var(--color-ink-faint)" }}
      >
        <span>© 2026 Krishna Baldwa</span>
        <span className="font-mono text-[11px]">{CONNECT.footerNote}</span>
      </div>
    </footer>
  );
}
