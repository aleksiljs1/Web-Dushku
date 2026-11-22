"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const reasons = [
  {
    title: "Me masë, deri në milimetër",
    body: "Çdo mobilje bëhet për hapësirën tuaj, që të shfrytëzohet çdo cep.",
    icon: <path d="M3 17 17 3l4 4L7 21H3zM13 7l4 4M10 10l2 2M7 13l2 2" />,
  },
  {
    title: "Ju vendosni çdo detaj",
    body: "Forma, ngjyra, materiali, dorezat. Mobilja është juaja, ashtu siç e keni ëndërruar.",
    icon: <path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-2 0-1.4-1.2-1.6-1.2-3 0-1.1.9-2 2-2H17a4 4 0 0 0 4-4c0-3.9-4-7-9-7ZM7.5 11.5h.01M10 7.5h.01M15 7.5h.01" />,
  },
  {
    title: "Montim i pastër",
    body: "Punojmë me kujdes në shtëpinë tuaj dhe largohemi duke e lënë gjithçka në rregull.",
    icon: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  },
  {
    title: "Fjala jonë mbahet",
    body: "Çmimi dhe afati bisedohen që në fillim, pa surpriza në fund.",
    icon: <path d="M8 12.5 11 15.5 16.5 9M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />,
  },
];

export default function Why() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      gsap.from(q(".reason"), {
        y: 50,
        autoAlpha: 0,
        rotate: (i) => (i % 2 ? 2 : -2),
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: q(".reasons")[0], start: "top 80%", once: true },
      });
      gsap.from(q(".reason-icon path"), {
        drawSVG: 0,
        duration: 1.4,
        ease: "power2.inOut",
        stagger: 0.15,
        scrollTrigger: { trigger: q(".reasons")[0], start: "top 75%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-copper uppercase">Pse ne</p>
        <Reveal as="h2" className="font-serif text-[clamp(2.4rem,8.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.025em]">
          Mobilje që ndihen <em className="text-oak-deep">si në shtëpi</em> që ditën e parë.
        </Reveal>
      </div>
      <div className="reasons mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
        {reasons.map((r) => (
          <div key={r.title} className="reason rounded-[1.75rem] border border-line bg-paper p-7">
            <span className="grid size-12 place-items-center rounded-2xl bg-sand text-walnut">
              <svg viewBox="0 0 24 24" className="reason-icon size-6" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {r.icon}
              </svg>
            </span>
            <h3 className="mt-6 font-serif text-xl font-medium tracking-tight">{r.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
