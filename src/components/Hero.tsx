"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import Armchair from "./Armchair";
import { ArrowDownIcon, PhoneIcon } from "./icons";
import { telHref } from "@/src/content/site";
import { prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const planks = ["#9a6638", "#c08a55", "#5b3a22", "#b47a45", "#7a4e2c", "#d39a63"];
const ticks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const intro = document.getElementById("intro");
      const title = q(".hero-title")[0] as HTMLElement;

      // Reduced motion: show everything as it will end up
      if (prefersReducedMotion()) {
        intro?.remove();
        gsap.set([title, ...q(".hero-in"), ...q(".fill")], { autoAlpha: 1, opacity: 1 });
        gsap.set(q(".tape-strip"), { scaleX: 1 });
        return;
      }

      // The plank curtain plays once per visit
      let seen = false;
      try {
        seen = sessionStorage.getItem("intro") === "1";
        sessionStorage.setItem("intro", "1");
      } catch {}

      const split = SplitText.create(title, { type: "words,chars", mask: "words" });
      gsap.set(title, { autoAlpha: 1 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      if (intro && !seen) {
        tl.from("#intro .intro-word", { yPercent: 110, duration: 0.9, stagger: 0.08 })
          .to("#intro .intro-word", { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.05 }, "+=0.25")
          .to("#intro .plank", { yPercent: -101, duration: 0.9, ease: "expo.inOut", stagger: 0.06 }, "-=0.2")
          .add(() => intro.remove());
      } else {
        intro?.remove();
      }

      tl.from(split.chars, { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.018 }, intro && !seen ? "-=0.55" : 0.1)
        .add(() => split.revert())
        .fromTo(q(".hero-in"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, "<0.35")
        .from(q(".hero-art .draw"), { drawSVG: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.03 }, "<")
        .to(q(".hero-art .fill"), { opacity: 1, duration: 0.9, ease: "power2.out", stagger: 0.04 }, "-=0.9")
        .from(q(".hero-art .throw"), { y: -30, rotate: -12, duration: 0.8, ease: "back.out(2)" }, "<")
        .fromTo(q(".tape-strip"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "power4.inOut" }, "-=1.2")
        .from(q(".tape-case"), { rotate: -540, duration: 1.6, ease: "power4.inOut" }, "<")
        .add(() => {
          const counter = q(".tape-count")[0];
          const n = { v: 0 };
          gsap.to(n, {
            v: 240,
            duration: 1.4,
            ease: "power3.out",
            onUpdate: () => (counter.textContent = String(Math.round(n.v))),
          });
        }, "<0.2");

      // Lamp breathes, plant sways, a little forever
      gsap.to(q(".lamp-glow"), { opacity: 0.65, duration: 2.4, delay: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(q(".plant"), { rotate: 3, transformOrigin: "50% 100%", duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });

      // Parallax on the way out
      gsap.to(q(".hero-art"), {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".hero-blob"), {
        rotate: 25,
        scale: 1.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hero" className="relative overflow-hidden pt-[calc(env(safe-area-inset-top)+5.5rem)] pb-10 md:pt-[calc(env(safe-area-inset-top)+8rem)] md:pb-24">
      {/* Opening curtain of wood planks */}
      <div id="intro" aria-hidden className="fixed inset-0 z-[80] flex">
        {planks.map((c, i) => (
          <div key={c} className="plank wood-grain relative h-full flex-1" style={{ backgroundColor: c, backgroundPositionX: `${i * 70}px` }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="flex gap-3 overflow-hidden font-serif text-5xl font-semibold text-paper md:text-7xl">
            <span className="intro-word inline-block">Mobileri</span>
            <span className="intro-word inline-block text-birch italic">Dushku</span>
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div>
          <p className="hero-in invisible mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/70 py-2 pr-4 pl-2.5 text-[0.8rem] font-semibold tracking-wide text-ink-soft">
            <span className="grid size-5 place-items-center rounded-full bg-oak/25">
              <span className="size-2 rounded-full bg-copper" />
            </span>
            Mobilje me porosi · Montim
          </p>

          <h1 className="hero-title invisible font-serif text-[clamp(2.75rem,11.5vw,5.6rem)] leading-[0.98] font-medium tracking-[-0.03em] text-balance">
            Mobilojmë sipas <em className="text-oak-deep">dëshirës</em> dhe <em className="text-copper">ëndrrave</em> tuaja.
          </h1>

          <p className="hero-in invisible mt-6 max-w-xl text-[1.08rem] leading-relaxed text-ink-soft md:text-xl">
            Mobilje të projektuara dhe të prodhuara me masë për shtëpinë apo biznesin tuaj, dhe montim i kujdesshëm, deri te vida e fundit.
          </p>

          <div className="hero-in invisible mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#kontakt"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 text-base font-semibold text-paper transition-colors hover:bg-walnut"
            >
              Kërkoni një ofertë
              <span className="grid size-7 place-items-center rounded-full bg-copper transition-transform group-hover:rotate-[-45deg]">
                <ArrowDownIcon className="size-3.5 -rotate-90" />
              </span>
            </a>
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-ink/20 bg-paper/60 px-7 py-4 text-base font-semibold transition-colors hover:border-ink/50"
            >
              <PhoneIcon className="size-4" /> Telefononi tani
            </a>
          </div>
        </div>

        <div className="hero-art relative">
          <div className="hero-blob absolute inset-[6%_4%_14%] -z-10 rounded-[46%_54%_42%_58%/52%_44%_56%_48%] bg-gradient-to-br from-birch/70 via-sand to-copper-soft/60" />
          <Armchair className="w-full" />

          {/* Tape measure unrolling under the drawing */}
          <div className="mt-2 flex items-center gap-0" aria-hidden>
            <div className="tape-case relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-walnut shadow-lg shadow-walnut/30">
              <div className="grid size-8 place-items-center rounded-full border-[3px] border-birch/80">
                <div className="size-2 rounded-full bg-birch" />
              </div>
            </div>
            <div className="tape-strip relative -ml-1 h-8 flex-1 origin-left overflow-hidden rounded-r-sm bg-[#e2b03f] shadow-sm" style={{ transform: "scaleX(0)" }}>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(42,29,20,.75)_0_1px,transparent_1px_6px)] [mask-image:linear-gradient(to_bottom,black_35%,transparent_35%)]" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(42,29,20,.9)_0_1.5px,transparent_1.5px_30px)] [mask-image:linear-gradient(to_bottom,black_60%,transparent_60%)]" />
              <div className="absolute inset-x-0 bottom-0.5 flex">
                {ticks.map((t) => (
                  <span key={t} className="w-[30px] shrink-0 pl-0.5 text-[8px] leading-none font-bold text-ink/80 tabular-nums">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="hero-in invisible mt-4 flex items-baseline gap-2 text-sm text-ink-soft">
            <span className="shrink-0 font-serif text-3xl font-semibold whitespace-nowrap text-ink tabular-nums">
              <span className="tape-count">240</span>
              <span className="text-lg"> cm</span>
            </span>
            · çdo mobilje, me masat e hapësirës suaj
          </p>
        </div>
      </div>

      <a href="#sherbimet" aria-label="Shkoni te shërbimet" className="hero-in invisible absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.2em] text-ink-mute uppercase md:flex">
        Zbuloni
        <span className="grid h-10 w-6 justify-center rounded-full border border-ink/25 pt-2">
          <span className="block h-2 w-1 animate-bounce rounded-full bg-ink/60" />
        </span>
      </a>
    </section>
  );
}
