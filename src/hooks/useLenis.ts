import { createContext, useContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

/** Null under prefers-reduced-motion (no Lenis instance exists) — callers
 * should fall back to native `scrollIntoView` in that case. */
export function useLenis() {
  return useContext(LenisContext);
}
