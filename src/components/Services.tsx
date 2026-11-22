"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import Wardrobe from "./Wardrobe";
import { ArrowIcon } from "./icons";
import { prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const custom = ["Kuzhina", "Garderoba", "Dhoma gjumi", "Sallone", "Dhoma fëmijësh", "Zyra & dyqane"];
const assembly = ["Mobilje të blera gati", "Kuzhina & garderoba", "Çmontim dhe rimontim", "Rregullim dyersh e sirtarësh"];

function Tools() {
  // Allen key turning a screw home, with a spirit level settling under it
  return (
    <svg viewBox="0 0 300 260" className="mx-auto w-[86%] max-w-[320px]" aria-hidden>
      <rect x="20" y="150" width="260" height="34" rx="8" fill="#c08a55" />
      <rect x="20" y="150" width="260" height="34" rx="8" fill="url(#grainLines)" opacity="0.35" />
      <defs>
        <pattern id="grainLines" width="60" height="34" patternUnits="userSpaceOnUse">
          <path d="M0 8 Q30 4 60 9 M0 20 Q30 26 60 19 M0 29 Q30 27 60 30" stroke="#5b3a22" strokeWidth="1" fill="none" />
        </pattern>
      </defs>
      {/* screw */}
      <g className="screw">
        <rect x="143" y="104" width="14" height="46" rx="2" fill="#8a8f96" />
        <path d="M143 112h14M143 120h14M143 128h14M143 136h14M143 144h14" stroke="#5f646b" strokeWidth="2" />
        <rect x="136" y="98" width="28" height="9" rx="3" fill="#a9aeb5" />
      </g>
      {/* allen key */}
      <g className="key">
        <path d="M150 98 V40 Q150 28 162 28 H238" stroke="#2a1d14" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M150 98 V40 Q150 28 162 28 H238" stroke="#4a3a2e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
      </g>
      {/* spirit level */}
      <rect x="50" y="206" width="200" height="30" rx="8" fill="#e2b03f" />
      <rect x="120" y="212" width="60" height="18" rx="9" fill="#dfeccb" stroke="#2a1d14" strokeWidth="2" />
      <path d="M142 212v18M158 212v18" stroke="#2a1d14" strokeWidth="1.5" />
      <circle className="bubble" cx="150" cy="221" r="6" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        gsap.set(q(".door-l"), { rotateY: -62 });
        gsap.set(q(".door-r"), { rotateY: 62 });
        return;
      }

      // Doors swing open as the wardrobe card scrolls through
      const wardrobe = q(".card-custom")[0];
      gsap
        .timeline({ scrollTrigger: { trigger: wardrobe, start: "top 75%", end: "center 40%", scrub: 1 } })
        .to(q(".door-l"), { rotateY: -100, ease: "power2.inOut" }, 0)
        .to(q(".door-r"), { rotateY: 100, ease: "power2.inOut" }, 0.08);

      // Screw goes in, level finds center
      const tools = q(".card-assembly")[0];
      gsap
        .timeline({ scrollTrigger: { trigger: tools, start: "top 75%", end: "center 40%", scrub: 1 } })
        .fromTo(q(".key"), { rotate: -40, svgOrigin: "150 98" }, { rotate: 680, svgOrigin: "150 98", ease: "none" }, 0)
        .fromTo(q(".key"), { y: -26 }, { y: 0, ease: "none" }, 0)
        .fromTo(q(".screw"), { y: -26 }, { y: 0, ease: "none" }, 0)
        .fromTo(q(".bubble"), { attr: { cx: 196 } }, { attr: { cx: 150 }, ease: "elastic.out(1,0.4)" }, 0.1);

      q(".svc-card").forEach((card) => {
        gsap.from(card, {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
        });
        gsap.from(card.querySelectorAll(".chip"), {
          y: 14,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 60%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="sherbimet" className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
      <div className="mb-12 md:mb-20 md:flex md:items-end md:justify-between md:gap-10">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-copper uppercase">Shërbimet</p>
          <Reveal as="h2" className="max-w-2xl font-serif text-[clamp(2.4rem,8.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.025em]">
            Dy shërbime, i njëjti kujdes për çdo detaj.
          </Reveal>
        </div>
        <Reveal as="p" mode="fade" className="mt-5 max-w-sm text-lg leading-relaxed text-ink-soft md:mt-0">
          Nga ideja e parë deri te vida e fundit, punojmë me ju hap pas hapi.
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <article className="svc-card card-custom group relative overflow-hidden rounded-[2rem] bg-paper p-6 shadow-[0_1px_0_var(--line)] md:p-10">
          <div className="relative -mx-6 -mt-6 mb-8 bg-gradient-to-b from-sand to-paper px-6 pt-10 pb-8 md:-mx-10 md:-mt-10 md:px-10">
            <span className="absolute top-5 left-6 font-serif text-sm text-ink-mute italic md:left-10">01</span>
            <Wardrobe />
          </div>
          <h3 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">Mobilim me porosi</h3>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
            Ju na tregoni si e ëndërroni. Ne e projektojmë, e masim dhe e prodhojmë sipas hapësirës suaj. Asgjë e gatshme: gjithçka
            e menduar për ju.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {custom.map((c) => (
              <li key={c} className="chip rounded-full border border-line bg-linen px-3.5 py-1.5 text-sm text-ink-soft">
                {c}
              </li>
            ))}
          </ul>
          <a href="#kontakt" className="mt-8 inline-flex items-center gap-2 font-semibold text-copper">
            Na tregoni idenë tuaj <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </article>

        <article className="svc-card card-assembly group relative overflow-hidden rounded-[2rem] bg-ink p-6 text-paper md:p-10">
          <div className="relative -mx-6 -mt-6 mb-8 bg-gradient-to-b from-walnut to-ink px-6 pt-10 pb-6 md:-mx-10 md:-mt-10 md:px-10">
            <span className="absolute top-5 left-6 font-serif text-sm text-paper/60 italic md:left-10">02</span>
            <Tools />
          </div>
          <h3 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">Montim mobiljesh</h3>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-paper/75">
            Keni blerë mobilje, por s&apos;keni kohë apo vegla? I montojmë shpejt, pastër dhe me kujdes, që gjithçka të qëndrojë
            drejt për vite me radhë.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {assembly.map((c) => (
              <li key={c} className="chip rounded-full border border-paper/15 bg-paper/5 px-3.5 py-1.5 text-sm text-paper/80">
                {c}
              </li>
            ))}
          </ul>
          <a href="#montimi" className="mt-8 inline-flex items-center gap-2 font-semibold text-copper-soft">
            Shihni si punojmë <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        </article>
      </div>
    </section>
  );
}
