"use client";

import { useEffect, useState } from "react";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { telHref, whatsappHref } from "@/src/content/site";

// Thumb-reach call buttons on phones: shown after the hero, hidden over the contact section
export default function MobileBar() {
  const [pastHero, setPastHero] = useState(false);
  const [contactSeen, setContactSeen] = useState(false);
  const [footerSeen, setFooterSeen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("kontakt");
    const footer = document.querySelector("footer");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setPastHero(!e.isIntersecting);
        if (e.target === contact) setContactSeen(e.isIntersecting);
        if (e.target === footer) setFooterSeen(e.isIntersecting);
      }
    });
    [hero, contact, footer].forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const show = pastHero && !contactSeen && !footerSeen;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] transition-[translate,opacity] duration-500 lg:hidden ${
        show ? "" : "pointer-events-none translate-y-full opacity-0"
      }`}
      aria-hidden={!show}
    >
      <div className="mx-auto flex max-w-md gap-2 rounded-full border border-line bg-paper/90 p-1.5 shadow-[0_12px_40px_-12px_rgba(42,29,20,.45)] backdrop-blur-md">
        <a href={telHref} tabIndex={show ? 0 : -1} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[0.95rem] font-semibold text-paper">
          <PhoneIcon className="size-4" /> Telefononi
        </a>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={show ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f9e50] py-3.5 text-[0.95rem] font-semibold text-white"
        >
          <WhatsAppIcon className="size-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
