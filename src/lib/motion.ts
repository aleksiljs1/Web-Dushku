import type Lenis from "lenis";

// Shared handle on the smooth scroller so the menu can pause it.
let instance: Lenis | null = null;

export const lenisStore = {
  set(l: Lenis | null) {
    instance = l;
  },
  get() {
    return instance;
  },
};

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
