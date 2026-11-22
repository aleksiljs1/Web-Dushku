"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "./Logo";
import { ArrowIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { nav, site, telHref, whatsappHref } from "@/src/content/site";
import { lenisStore, prefersReducedMotion } from "@/src/lib/motion";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Solid background once the page moves; tuck away while scrolling down
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 400 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(() => {
    const p = panel.current!;
    tl.current = gsap
      .timeline({ paused: true })
      .set(p, { visibility: "visible" })
      .fromTo(p, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" })
      .from(p.querySelectorAll(".menu-link"), { yPercent: 110, duration: 0.8, ease: "expo.out", stagger: 0.05 }, "-=0.3")
      .from(p.querySelectorAll(".menu-fade"), { autoAlpha: 0, y: 16, duration: 0.6, ease: "power3.out", stagger: 0.06 }, "-=0.6");
  });

  // Play the panel, lock the page, wire up Escape and close on wide screens
  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    const reduce = prefersReducedMotion();
    if (open) {
      if (reduce) t.progress(1);
      else t.timeScale(1).play();
    } else if (reduce) t.progress(0);
    else t.timeScale(1.6).reverse();

    const lenis = lenisStore.get();
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      main?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      panel.current?.querySelector<HTMLElement>(".menu-link")?.focus({ preventScroll: true });
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onWide = () => mq.matches && setOpen(false);
    if (open) {
      window.addEventListener("keydown", onKey);
      mq.addEventListener("change", onWide);
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
      lenis?.start();
      document.documentElement.style.overflow = "";
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[translate,background-color,box-shadow] duration-500 ${
        hidden && !open ? "-translate-y-full" : ""
      } ${solid && !open ? "bg-linen/85 shadow-[0_1px_0_var(--line)] backdrop-blur-md" : ""}`}
    >
      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="#top" className="rounded-lg" aria-label={`${site.name}, kreu i faqes`} onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav aria-label="Kryesore" className="hidden items-center gap-1 lg:flex">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-[0.95rem] text-ink-soft transition-colors hover:bg-sand/70 hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={telHref}
            className="hidden items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-walnut sm:inline-flex"
          >
            <PhoneIcon className="size-4" /> Na telefononi
          </a>
          <a
            href={telHref}
            aria-label="Na telefononi"
            className="hidden size-11 place-items-center rounded-full border border-line bg-paper/60 min-[360px]:grid sm:hidden"
          >
            <PhoneIcon className="size-[1.1rem]" />
          </a>
          <button
            ref={button}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Mbyll menunë" : "Hap menunë"}
            className="relative grid size-11 place-items-center rounded-full bg-ink text-paper lg:hidden"
          >
            <span className={`absolute h-[1.5px] w-[18px] bg-current transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
            <span className={`absolute h-[1.5px] w-[18px] bg-current transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
          </button>
        </div>
      </div>

      <div
        id="menu"
        ref={panel}
        className="invisible fixed inset-0 z-0 flex h-dvh flex-col bg-linen px-5 pt-[calc(env(safe-area-inset-top)+5.5rem)] pb-[calc(env(safe-area-inset-bottom)+1.5rem)] lg:hidden"
        aria-hidden={!open}
      >
        <div className="wood-grain pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-[0.12]" />
        <p className="menu-fade mb-4 text-xs font-semibold tracking-[0.25em] text-ink-mute uppercase">Menu</p>
        <nav aria-label="Menu" className="flex flex-col border-t border-line">
          {nav.map((l, i) => (
            <div key={l.href} className="overflow-hidden border-b border-line">
              <a
                href={l.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="menu-link group flex items-center gap-4 py-4 [@media(max-height:680px)]:py-2.5"
              >
                <span className="w-6 text-xs text-ink-mute tabular-nums">0{i + 1}</span>
                <span className="font-serif text-[2.1rem] leading-none font-medium tracking-tight [@media(max-height:680px)]:text-[1.7rem]">
                  {l.label}
                </span>
                <ArrowIcon className="ml-auto size-5 text-oak-deep transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          ))}
        </nav>

        <div className="mt-auto grid grid-cols-2 gap-3">
          <a
            href={telHref}
            tabIndex={open ? 0 : -1}
            className="menu-fade flex items-center justify-center gap-2 rounded-2xl bg-ink py-4 font-semibold text-paper"
          >
            <PhoneIcon /> Telefononi
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="menu-fade flex items-center justify-center gap-2 rounded-2xl bg-copper py-4 font-semibold text-paper"
          >
            <WhatsAppIcon /> WhatsApp
          </a>
        </div>
        <p className="menu-fade mt-4 text-center text-sm text-ink-mute">{site.tagline}</p>
      </div>
    </header>
  );
}
