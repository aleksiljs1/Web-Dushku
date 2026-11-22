"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { site, telHref, whatsappHref } from "@/src/content/site";
import { prefersReducedMotion } from "@/src/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const needs = ["Mobilim me porosi", "Montim mobiljesh", "Diçka tjetër"];

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [need, setNeed] = useState(needs[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // The section rises over the one before it like a drawer sliding out
      gsap.fromTo(
        q(".drawer")[0],
        { clipPath: "inset(8% 4% 0% 4% round 2.5rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
        },
      );
      gsap.set(q(".contact-in"), { autoAlpha: 0 });
      ScrollTrigger.batch(q(".contact-in"), {
        start: "top 92%",
        once: true,
        onEnter: (els) => gsap.fromTo(els, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07, ease: "expo.out" }),
      });
    },
    { scope: root },
  );

  const text = [
    `Përshëndetje ${site.name}!`,
    name.trim() && `Jam ${name.trim()}.`,
    `Më intereson: ${need.toLowerCase()}.`,
    message.trim(),
  ]
    .filter(Boolean)
    .join("\n");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      document.getElementById("c-name")?.focus();
      return;
    }
    window.open(whatsappHref(text), "_blank", "noopener,noreferrer");
  }

  return (
    <section ref={root} id="kontakt" className="relative">
      <div className="drawer relative overflow-hidden bg-walnut text-paper">
        <div className="wood-grain pointer-events-none absolute inset-0 opacity-25" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-24 md:px-8 md:py-36 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-copper-soft uppercase">Kontakt</p>
            <Reveal as="h2" mode="words" className="font-serif text-[clamp(2.8rem,11vw,6rem)] leading-[0.98] font-medium tracking-[-0.03em]">
              Le ta bëjmë realitet.
            </Reveal>
            <Reveal as="p" mode="fade" className="mt-6 max-w-md text-lg leading-relaxed text-paper/75">
              Na tregoni çfarë ju duhet. Ju përgjigjemi me pyetjet e duhura dhe një ofertë të qartë.
            </Reveal>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href={telHref} className="contact-in flex items-center gap-4 rounded-2xl bg-paper px-5 py-4 text-ink transition-transform hover:-translate-y-0.5">
                <span className="grid size-11 place-items-center rounded-full bg-ink text-paper">
                  <PhoneIcon />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-wider text-ink-mute uppercase">Telefon</span>
                  <span className="block text-lg font-semibold tabular-nums">{site.phoneDisplay}</span>
                </span>
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-in flex items-center gap-4 rounded-2xl border border-paper/20 px-5 py-4 transition-colors hover:bg-paper/10"
              >
                <span className="grid size-11 place-items-center rounded-full bg-[#25d366] text-white">
                  <WhatsAppIcon />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-wider text-paper/60 uppercase">WhatsApp</span>
                  <span className="block text-lg font-semibold">Na shkruani</span>
                </span>
              </a>
            </div>
            <p className="contact-in mt-6 text-paper/60">📍 {site.location}</p>
          </div>

          <form onSubmit={onSubmit} noValidate className="contact-form rounded-[2rem] bg-paper p-6 text-ink shadow-2xl shadow-black/20 md:p-9">
            <p className="contact-in font-serif text-2xl font-medium">Dërgoni një mesazh</p>
            <p className="contact-in mt-1 text-sm text-ink-mute">Hapet në WhatsApp me mesazhin gati. Ju vetëm shtypni “Dërgo”.</p>

            <label htmlFor="c-name" className="contact-in mt-7 block text-sm font-semibold">
              Emri juaj
            </label>
            <input
              id="c-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(false);
              }}
              autoComplete="name"
              aria-invalid={error}
              aria-describedby={error ? "c-name-err" : undefined}
              className={`contact-in mt-2 w-full scroll-mt-28 rounded-xl border bg-linen px-4 py-3.5 text-base outline-none transition-colors focus:border-copper ${
                error ? "border-copper" : "border-line"
              }`}
              placeholder="p.sh. Arben"
            />
            {error && (
              <p id="c-name-err" className="mt-2 text-sm font-medium text-copper">
                Ju lutem shkruani emrin tuaj.
              </p>
            )}

            <fieldset className="contact-in mt-6">
              <legend className="text-sm font-semibold">Çfarë ju duhet?</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {needs.map((n) => (
                  <label
                    key={n}
                    className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-copper ${
                      need === n ? "border-ink bg-ink text-paper" : "border-line bg-linen hover:border-ink/40"
                    }`}
                  >
                    <input type="radio" name="need" value={n} checked={need === n} onChange={() => setNeed(n)} className="sr-only" />
                    {n}
                  </label>
                ))}
              </div>
            </fieldset>

            <label htmlFor="c-msg" className="contact-in mt-6 block text-sm font-semibold">
              Mesazhi <span className="font-normal text-ink-mute">(opsional)</span>
            </label>
            <textarea
              id="c-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="contact-in mt-2 w-full resize-none rounded-xl border border-line bg-linen px-4 py-3.5 text-base outline-none transition-colors focus:border-copper"
              placeholder="p.sh. Një garderobë 2.4 m për dhomën e gjumit, me dyer rrëshqitëse."
            />

            <button
              type="submit"
              className="contact-in mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#1f9e50] px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-[#1a8744]"
            >
              <WhatsAppIcon /> Vazhdoni në WhatsApp
            </button>
            <p className="contact-in mt-3 text-center text-sm text-ink-mute">
              Preferoni të flisni?{" "}
              <a href={telHref} className="font-semibold text-ink underline decoration-copper underline-offset-4">
                Na telefononi
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
