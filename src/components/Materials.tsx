"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "@/src/lib/motion";

const finishes = [
  { name: "Arrë", note: "E ngrohtë dhe e thellë", body: "#6b4429", front: "#7a4e2c", handle: "#d8b46a" },
  { name: "Lis", note: "Natyrale, me fije të dukshme", body: "#b98552", front: "#c79562", handle: "#2a1d14" },
  { name: "Ah", note: "E çelur dhe e qetë", body: "#d9b183", front: "#e2bf93", handle: "#5b3a22" },
  { name: "E bardhë mat", note: "E pastër, moderne", body: "#e9e4da", front: "#f4f0e8", handle: "#b48a4a" },
  { name: "Antracit", note: "Elegante dhe e fortë", body: "#3a3a3c", front: "#47474a", handle: "#c9a36a" },
  { name: "Gjelbër ulliri", note: "Për pak guxim", body: "#5d6646", front: "#6b7552", handle: "#e0c08a" },
];

export default function Materials() {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  function pick(i: number) {
    if (i === current) return;
    setCurrent(i);
    const f = finishes[i];
    const d = prefersReducedMotion() ? 0 : 0.8;
    const q = gsap.utils.selector(root);
    gsap.to(q(".sb-body"), { fill: f.body, duration: d, ease: "power2.inOut" });
    gsap.to(q(".sb-front"), { fill: f.front, duration: d, ease: "power2.inOut", stagger: 0.08 });
    gsap.to(q(".sb-handle"), { fill: f.handle, duration: d, ease: "power2.inOut" });
    if (d) {
      gsap.fromTo(q(".sb-wipe"), { xPercent: -120 }, { xPercent: 220, duration: 0.9, ease: "power2.inOut" });
      gsap.fromTo(q(".sb-art"), { y: 0 }, { y: -8, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" });
    }
  }

  const f = finishes[current];

  return (
    <section ref={root} id="materialet" className="relative overflow-hidden bg-ink py-24 text-paper md:py-36">
      <div className="wood-grain pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-copper-soft uppercase">Materialet</p>
          <Reveal as="h2" className="font-serif text-[clamp(2.4rem,8.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.025em]">
            Zgjidhni ngjyrën. Ne kujdesemi për pjesën tjetër.
          </Reveal>
          <Reveal as="p" mode="fade" className="mt-6 text-lg leading-relaxed text-paper/70">
            Provojeni vetë: prekni një ngjyrë dhe shihni si ndryshon komoja. Këto janë vetëm disa shembuj. Bashkë zgjedhim materialin,
            ngjyrën dhe dorezat që ju pëlqejnë.
          </Reveal>
        </div>

        <div className="mt-12 grid items-center gap-5 lg:mt-16 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div className="relative rounded-[2rem] bg-gradient-to-b from-paper/[0.07] to-transparent px-4 pt-10 pb-4 md:px-10 md:pb-6">
            {/* sideboard */}
            <svg viewBox="0 0 360 240" className="sb-art mx-auto w-full max-w-[560px]" role="img" aria-label={`Komo në ngjyrën ${f.name}`}>
              <defs>
                <clipPath id="sbClip">
                  <rect x="24" y="40" width="312" height="140" rx="8" />
                </clipPath>
                <pattern id="sbGrain" width="120" height="140" patternUnits="userSpaceOnUse">
                  <path d="M0 18 Q60 10 120 20 M0 46 Q60 56 120 44 M0 78 Q60 70 120 82 M0 108 Q60 118 120 104 M0 130 Q60 126 120 134" stroke="#000" strokeWidth="1" fill="none" opacity="0.12" />
                </pattern>
              </defs>
              {/* wall shadow and floor */}
              <ellipse cx="180" cy="226" rx="150" ry="8" fill="#000" opacity="0.35" />
              {/* vase and lamp on top */}
              <path d="M70 40 q-8 -22 2 -34 h20 q10 12 2 34 z" fill="#b4582b" />
              <path d="M82 6 C74 -14 78 -28 90 -36 C90 -20 88 -6 82 6 Z" fill="#94a26c" />
              <rect x="248" y="8" width="44" height="32" rx="4" fill="#f4eee4" opacity="0.9" />
              <rect x="262" y="16" width="16" height="16" rx="2" fill="#c08a55" />
              {/* body */}
              <rect className="sb-body" x="24" y="40" width="312" height="140" rx="8" fill={finishes[0].body} />
              <g clipPath="url(#sbClip)">
                <rect className="sb-front" x="34" y="50" width="96" height="120" rx="4" fill={finishes[0].front} />
                <rect className="sb-front" x="132" y="50" width="96" height="120" rx="4" fill={finishes[0].front} />
                <rect className="sb-front" x="230" y="50" width="96" height="57" rx="4" fill={finishes[0].front} />
                <rect className="sb-front" x="230" y="113" width="96" height="57" rx="4" fill={finishes[0].front} />
                <rect x="24" y="40" width="312" height="140" fill="url(#sbGrain)" />
                <rect className="sb-wipe" x="0" y="20" width="60" height="180" fill="#fff" opacity="0.18" transform="skewX(-18)" />
              </g>
              {/* handles */}
              <rect className="sb-handle" x="118" y="92" width="4" height="36" rx="2" fill={finishes[0].handle} />
              <rect className="sb-handle" x="140" y="92" width="4" height="36" rx="2" fill={finishes[0].handle} />
              <rect className="sb-handle" x="262" y="74" width="32" height="4" rx="2" fill={finishes[0].handle} />
              <rect className="sb-handle" x="262" y="137" width="32" height="4" rx="2" fill={finishes[0].handle} />
              {/* legs */}
              <path d="M48 180 l-8 40 h6 l12 -40 z M312 180 l8 40 h-6 l-12 -40 z" fill="#1c130c" />
            </svg>
            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-paper/10 pt-4">
              <p className="font-serif text-2xl" aria-live="polite">
                {f.name}
              </p>
              <p className="text-sm text-paper/60">{f.note}</p>
            </div>
          </div>

          <div role="radiogroup" aria-label="Ngjyra e mobiljes" className="grid grid-cols-6 gap-2 sm:gap-3 lg:grid-cols-3 lg:gap-4">
            {finishes.map((fin, i) => (
              <button
                key={fin.name}
                type="button"
                role="radio"
                aria-checked={i === current}
                onClick={() => pick(i)}
                className={`group flex flex-col items-center gap-2.5 rounded-xl border p-1.5 text-center transition-colors sm:rounded-2xl sm:p-3 ${
                  i === current ? "border-copper-soft bg-paper/10" : "border-paper/10 hover:border-paper/30"
                }`}
              >
                <span
                  className="wood-grain relative aspect-square w-full rounded-xl shadow-inner transition-transform duration-300 group-hover:scale-[1.04]"
                  style={{ backgroundColor: fin.front }}
                >
                  {i === current && (
                    <span className="absolute inset-0 m-auto grid size-6 place-items-center rounded-full bg-paper text-ink lg:inset-auto lg:top-2 lg:right-2 lg:m-0">
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden>
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    </span>
                  )}
                </span>
                <span className="sr-only text-sm font-medium text-paper/85 lg:not-sr-only">{fin.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
