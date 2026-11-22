"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisStore, prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger
// and the smooth scroll stay on the same frame.
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const lenis = reduce ? null : new Lenis({ lerp: 0.1 });
    lenisStore.set(lenis);

    let tick: ((time: number) => void) | null = null;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // In-page anchors glide instead of jump, and leave room for the header
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!;
      const target = id === "#top" ? document.body : document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: id === "#top" ? 0 : -72, duration: 1.4 });
      else target.scrollIntoView();
      history.replaceState(null, "", id === "#top" ? location.pathname : id);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      lenisStore.set(null);
    };
  }, []);

  return null;
}
