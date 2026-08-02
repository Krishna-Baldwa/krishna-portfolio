interface PhotoFrameProps {
  src?: string;
  alt?: string;
  label?: string;
  shape?: "rect" | "circle";
  className?: string;
}

/** No real photos exist yet — this renders a finished-looking placeholder
 * (gradient mesh + monogram) instead of a broken/empty box. Swap in a real
 * photo later by passing `src`; the placeholder branch just stops rendering. */
export function PhotoFrame({ src, alt = "", label = "KB", shape = "rect", className = "" }: PhotoFrameProps) {
  const radius = shape === "circle" ? "rounded-full" : "rounded-2xl";

  if (src) {
    return (
      <div className={`relative overflow-hidden ${radius} ${className}`}>
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${radius} ${className}`}
      style={{
        background:
          "radial-gradient(120% 120% at 22% 18%, var(--accent-fill), transparent 60%), linear-gradient(160deg, var(--color-canvas-raised), var(--color-canvas))",
        border: "1px solid var(--color-line)",
      }}
    >
      <span
        className="font-display select-none text-[clamp(28px,6vw,56px)] font-semibold"
        style={{ color: "var(--accent)", opacity: 0.55 }}
      >
        {label}
      </span>
    </div>
  );
}
