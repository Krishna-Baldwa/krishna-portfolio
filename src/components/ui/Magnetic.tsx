import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

function useMagnetic(ref: RefObject<HTMLElement | null>, pull: number) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const el = ref.current;
      if (!el) return;

      const moveX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const moveY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        moveX((e.clientX - rect.left - rect.width / 2) * pull);
        moveY((e.clientY - rect.top - rect.height / 2) * (pull + 0.1));
      };
      const onLeave = () => {
        moveX(0);
        moveY(0);
      };

      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { dependencies: [prefersReducedMotion, pull] },
  );
}

interface MagneticLinkProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  pull?: number;
  href: string;
  target?: string;
  rel?: string;
}

export function MagneticLink({ children, className, style, pull = 0.35, href, target, rel }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, pull);
  return (
    <a ref={ref} href={href} target={target} rel={rel} data-cursor-hover className={className} style={style}>
      {children}
    </a>
  );
}
