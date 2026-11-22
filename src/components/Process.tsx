"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { title: "Na tregoni idenë", body: "Një telefonatë, një mesazh ose një foto e asaj që ju pëlqen. Na tregoni çfarë keni në mendje." },
  { title: "Matje dhe projekt", body: "Masim hapësirën dhe ju tregojmë si do të duket mobilja, para se të presim qoftë edhe një dërrasë." },
  { title: "Prodhim me kujdes", body: "E punojmë në punishte me materialet, ngjyrat dhe dorezat që zgjidhni bashkë me ne." },
  { title: "Montim dhe dorëzim", body: "E sjellim, e montojmë dhe e lëmë vendin të pastër. Ju vetëm e gëzoni." },
];

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        gsap.set(q(".rail-fill"), { scaleY: 1 });
        gsap.set(q(".step-dot"), { backgroundColor: "var(--copper)", color: "var(--paper)" });
        return;
      }

      // The rail fills with the scroll; each step lights up as the fill reaches it
      gsap.fromTo(
        q(".rail-fill"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".steps")[0], start: "top 65%", end: "bottom 65%", scrub: true } },
      );

      q(".step").forEach((step) => {
        const dot = step.querySelector(".step-dot");
        const body = step.querySelectorAll(".step-text > *");
        gsap
          .timeline({ scrollTrigger: { trigger: step, start: "top 65%", toggleActions: "play none none reverse" } })
          .to(dot, { backgroundColor: "var(--copper)", color: "var(--paper)", borderColor: "var(--copper)", scale: 1.12, duration: 0.4, ease: "back.out(3)" })
          .to(dot, { scale: 1, duration: 0.3 })
          .fromTo(body, { autoAlpha: 0.25, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.08, ease: "expo.out" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="procesi" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-copper uppercase">Si punojmë</p>
          <Reveal as="h2" className="font-serif text-[clamp(2.4rem,8.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.025em]">
            Nga ëndrra te shtëpia juaj, në katër hapa.
          </Reveal>
          <Reveal as="p" mode="fade" className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Një person kontakti nga fillimi deri në fund. Gjithmonë e dini ku jemi dhe çfarë vjen më pas.
          </Reveal>
        </div>

        <div className="steps relative">
          <div className="absolute top-2 bottom-2 left-[1.45rem] w-px bg-line" aria-hidden />
          <div className="rail-fill absolute top-2 bottom-2 left-[1.45rem] w-px origin-top bg-copper" aria-hidden />
          <ol>
          {steps.map((s, i) => (
            <li key={s.title} className="step relative flex gap-6 pb-14 last:pb-0 md:gap-8">
              <span className="step-dot relative z-10 grid size-12 shrink-0 place-items-center rounded-full border border-line bg-paper font-serif text-lg italic tabular-nums">
                {i + 1}
              </span>
              <div className="step-text pt-1.5">
                <h3 className="font-serif text-2xl font-medium tracking-tight md:text-3xl">{s.title}</h3>
                <p className="mt-2 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
