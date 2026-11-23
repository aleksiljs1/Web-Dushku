"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Emph from "./Emph";
import { prefersReducedMotion } from "@/src/lib/motion";
import type { Content } from "@/src/content/schema";

gsap.registerPlugin(ScrollTrigger);

// Five stages, matching the `step` numbers on the parts below
const STAGES = 5;

// Each part: where it sits when assembled, and where it floats when exploded.
// `step` is the stage it flies home in.
type Part = { id: string; step: number; x: number; y: number; r: number; el: React.ReactNode };

const wood = "#c08a55";
const woodDark = "#9a6638";
const edge = { stroke: "#2a1d14", strokeWidth: 2, strokeLinejoin: "round" as const };

const parts: Part[] = [
  { id: "back", step: 0, x: 0, y: -60, r: 0, el: <rect x="62" y="46" width="176" height="232" fill="#e3c9a0" {...edge} /> },
  { id: "left", step: 1, x: -120, y: -10, r: -24, el: <rect x="44" y="40" width="18" height="246" rx="2" fill={woodDark} {...edge} /> },
  { id: "right", step: 1, x: 120, y: 10, r: 24, el: <rect x="238" y="40" width="18" height="246" rx="2" fill={woodDark} {...edge} /> },
  { id: "top", step: 1, x: 30, y: -110, r: 10, el: <rect x="34" y="26" width="232" height="16" rx="4" fill={wood} {...edge} /> },
  { id: "bottom", step: 1, x: -30, y: 70, r: -8, el: <rect x="62" y="270" width="176" height="16" fill={wood} {...edge} /> },
  { id: "shelf1", step: 2, x: -150, y: 40, r: 30, el: <rect x="62" y="118" width="176" height="10" fill={wood} {...edge} /> },
  { id: "shelf2", step: 2, x: 150, y: -30, r: -30, el: <rect x="62" y="196" width="176" height="10" fill={wood} {...edge} /> },
  { id: "leg1", step: 2, x: -80, y: 40, r: -60, el: <path d="M58 286 h16 l-3 34 h-10 z" fill="#2a1d14" /> },
  { id: "leg2", step: 2, x: 80, y: 40, r: 60, el: <path d="M226 286 h16 l-4 34 h-9 z" fill="#2a1d14" /> },
  {
    id: "doorL",
    step: 3,
    x: -170,
    y: -40,
    r: -16,
    el: (
      <g>
        <rect x="64" y="48" width="85" height="220" rx="3" fill="#d39a63" {...edge} />
        <rect x="74" y="60" width="65" height="196" rx="2" fill="none" stroke="#9a6638" strokeWidth="1.5" />
      </g>
    ),
  },
  {
    id: "doorR",
    step: 3,
    x: 170,
    y: 40,
    r: 16,
    el: (
      <g>
        <rect x="151" y="48" width="85" height="220" rx="3" fill="#d39a63" {...edge} />
        <rect x="161" y="60" width="65" height="196" rx="2" fill="none" stroke="#9a6638" strokeWidth="1.5" />
      </g>
    ),
  },
  { id: "handleL", step: 4, x: -40, y: -80, r: 90, el: <rect x="136" y="140" width="6" height="40" rx="3" fill="#d8b46a" {...edge} strokeWidth={1.2} /> },
  { id: "handleR", step: 4, x: 40, y: -80, r: -90, el: <rect x="158" y="140" width="6" height="40" rx="3" fill="#d8b46a" {...edge} strokeWidth={1.2} /> },
  {
    id: "vase",
    step: 4,
    x: 0,
    y: -90,
    r: 0,
    el: (
      <g>
        <path d="M130 26 q-6 -18 4 -30 h32 q10 12 4 30 z" fill="#b4582b" {...edge} strokeWidth={1.5} />
        <path d="M150 -4 C140 -26 146 -44 160 -54 C160 -36 156 -18 150 -4 Z" fill="#7d8b5a" />
        <path d="M150 -4 C156 -24 170 -34 182 -36 C176 -20 164 -10 150 -4 Z" fill="#94a26c" />
      </g>
    ),
  },
];

export default function Assembly({ assembly }: { assembly: Content["assembly"] }) {
  const steps = assembly.steps.slice(0, STAGES);
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        setActive(STAGES - 1);
        return;
      }

      // Scatter the parts, then scroll brings them home stage by stage
      parts.forEach((p) => gsap.set(q(`[data-part="${p.id}"]`), { x: p.x, y: p.y, rotate: p.r, transformOrigin: "50% 50%" }));
      gsap.set(q(".screwdot"), { scale: 0, transformOrigin: "50% 50%" });

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      Array.from({ length: STAGES }, (_, s) => s).forEach((s) => {
        const ids = parts.filter((p) => p.step === s).map((p) => `[data-part="${p.id}"]`);
        tl.addLabel(`s${s}`);
        tl.to(q(ids.join(",")), { x: 0, y: 0, rotate: 0, duration: 1, stagger: 0.12 });
        if (s === 1) tl.to(q(".screwdot"), { scale: 1, duration: 0.4, stagger: 0.05, ease: "back.out(3)" }, "-=0.3");
        tl.to({}, { duration: 0.35 });
      });
      tl.to(q(".shine"), { xPercent: 260, duration: 0.8, ease: "power2.inOut" }, "-=0.2");

      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
        pin: q(".pin")[0],
        scrub: 0.8,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const idx = Math.min(STAGES - 1, Math.floor(self.progress * STAGES * 0.999));
          setActive((a) => (a === idx ? a : idx));
          const bar = q(".progress")[0] as HTMLElement | undefined;
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="montimi" className="relative bg-sand/60">
      <div className="pin relative flex min-h-[100svh] flex-col overflow-hidden pt-[calc(env(safe-area-inset-top)+4.5rem)] pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pt-24 lg:pb-8">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-4 px-5 md:px-8 lg:grid-cols-2 lg:gap-16">
          <div className="lg:order-2">
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-copper uppercase">{assembly.eyebrow}</p>
            <h2 className="font-serif text-[clamp(2rem,7.5vw,4rem)] leading-[1.02] font-medium tracking-[-0.025em]">
              <Emph text={assembly.title} />
            </h2>

            <ol className="mt-6 hidden space-y-1 lg:block">
              {steps.map((s, i) => (
                <li
                  key={i}
                  className={`flex gap-4 rounded-2xl px-4 py-3 transition-all duration-500 ${i === active ? "bg-paper shadow-sm" : "opacity-45"}`}
                >
                  <span className="font-serif text-lg text-copper italic tabular-nums">0{i + 1}</span>
                  <span>
                    <span className="block font-semibold">{s.title}</span>
                    <span className={`block overflow-hidden text-ink-soft transition-all duration-500 ${i === active ? "mt-1 max-h-20" : "max-h-0"}`}>
                      {s.text}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative lg:order-1">
            <div className="absolute inset-[8%] -z-0 rounded-full bg-paper/80 blur-2xl" />
            <svg viewBox="-40 -70 380 420" className="relative mx-auto h-[min(42svh,520px)] w-auto max-w-full overflow-visible" role="img" aria-label="Një dollap që montohet pjesë pas pjese">
              <ellipse cx="150" cy="326" rx="130" ry="10" fill="#2a1d14" opacity="0.12" />
              {parts.map((p) => (
                <g key={p.id} data-part={p.id}>
                  {p.el}
                </g>
              ))}
              {[
                [53, 34],
                [247, 34],
                [53, 278],
                [247, 278],
              ].map(([cx, cy]) => (
                <g key={`${cx}-${cy}`} className="screwdot">
                  <circle cx={cx} cy={cy} r="4" fill="#a9aeb5" stroke="#2a1d14" strokeWidth="1" />
                  <path d={`M${cx - 2.5} ${cy}h5`} stroke="#2a1d14" strokeWidth="1" />
                </g>
              ))}
              <clipPath id="cabinetClip">
                <rect x="34" y="26" width="232" height="260" rx="4" />
              </clipPath>
              <g clipPath="url(#cabinetClip)">
                <rect className="shine" x="-60" y="0" width="50" height="320" fill="#fff" opacity="0.35" transform="skewX(-20)" />
              </g>
            </svg>
          </div>
        </div>

        {/* Phone: one step at a time under the drawing */}
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:hidden" aria-live="polite">
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-2xl text-copper italic tabular-nums">0{active + 1}</span>
            <span className="text-xl font-semibold">{steps[active].title}</span>
          </div>
          <p className="mt-1 min-h-[3rem] text-ink-soft">{steps[active].text}</p>
        </div>

        <div className="mx-auto mt-4 w-full max-w-7xl px-5 md:px-8">
          <div className="flex items-center gap-3 text-xs font-semibold text-ink-mute">
            <span className="tabular-nums">0{active + 1} / 0{steps.length}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div className="progress h-full origin-left rounded-full bg-copper" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
