"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** "lines" slides each line up from a mask, "words" does it word by word, "fade" lifts the block */
  mode?: "lines" | "words" | "fade";
  delay?: number;
  id?: string;
};

export default function Reveal({ children, as: Tag = "div", className = "", mode = "lines", delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      const scrollTrigger = { trigger: el, start: "top 88%", once: true };

      if (mode === "fade") {
        gsap.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", delay, scrollTrigger });
        return;
      }

      SplitText.create(el, {
        type: mode === "lines" ? "lines" : "words,lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.from(mode === "lines" ? self.lines : self.words, {
            yPercent: 120,
            rotate: 2,
            duration: 1.15,
            ease: "expo.out",
            stagger: mode === "lines" ? 0.08 : 0.03,
            delay,
            scrollTrigger,
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={`invisible ${className}`}>
      {children}
    </Tag>
  );
}
