"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const words = ["Kuzhina", "Garderoba", "Dhoma gjumi", "Sallone", "Dhoma fëmijësh", "Zyra", "Montim mobiljesh"];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {words.map((w, i) => (
        <span key={w} className="flex items-center">
          <span className={`px-6 font-serif text-[clamp(2.2rem,8vw,4.5rem)] leading-none font-medium tracking-tight whitespace-nowrap ${i % 2 ? "italic text-oak-deep" : ""}`}>
            {w}
          </span>
          <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-copper" aria-hidden>
            <path d="M10 0 12.5 7.5 20 10 12.5 12.5 10 20 7.5 12.5 0 10 7.5 7.5Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

// Runs on its own, speeds up and leans with the scroll
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const track = root.current!.querySelector(".track")!;
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
      const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const v = self.getVelocity();
          const dir = self.direction;
          gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 300, 5)), duration: 0.2, overwrite: true });
          skew(gsap.utils.clamp(-8, 8, -v / 250));
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" });
        },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-hidden border-y border-line bg-paper py-7 md:py-10" aria-label="Çfarë punojmë">
      <div className="track flex w-max will-change-transform">
        <Row />
        <Row />
      </div>
    </div>
  );
}
