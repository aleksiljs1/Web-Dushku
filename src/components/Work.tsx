"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import Emph from "./Emph";
import InViewVideo from "./InViewVideo";
import { ArrowIcon, TikTokIcon } from "./icons";
import { prefersReducedMotion } from "@/src/lib/motion";
import type { Content, GalleryItem } from "@/src/content/schema";

gsap.registerPlugin(ScrollTrigger);

type Props = { work: Content["work"]; contact: Content["contact"] };

function Tile({ item, featured }: { item: GalleryItem; featured: boolean }) {
  return (
    <figure
      className={`work-tile group relative overflow-hidden rounded-[1.5rem] bg-sand md:rounded-[2rem] ${
        featured ? "aspect-[4/3]" : "aspect-[3/4] lg:aspect-auto lg:h-full lg:min-h-[14rem]"
      }`}
    >
      {item.type === "video" ? (
        <InViewVideo src={item.src} poster={item.poster} label={item.alt || item.caption} />
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={featured ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 21vw, 50vw"}
          className="work-img object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}
      {item.caption && (
        <figcaption
          className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent text-paper ${
            featured ? "px-5 pt-16 pb-4 text-[0.95rem] md:px-7 md:pb-6 md:text-base" : "px-3.5 pt-12 pb-3 text-[0.8rem] leading-snug md:px-4 md:text-sm"
          }`}
        >
          {item.caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function Work({ work, contact }: Props) {
  const root = useRef<HTMLElement>(null);
  const items = work.items.filter((i) => i.visible && i.src);
  const [first, ...rest] = items;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      // Photos open like a cabinet door: a clip that widens as they arrive
      q(".work-tile").forEach((tile, i) => {
        gsap.fromTo(
          tile,
          { clipPath: "inset(12% 8% 12% 8% round 2rem)", y: 40 },
          {
            clipPath: "inset(0% 0% 0% 0% round 2rem)",
            y: 0,
            duration: 1.3,
            delay: i === 0 ? 0 : 0.08 * i,
            ease: "expo.out",
            scrollTrigger: { trigger: tile, start: "top 88%", once: true },
          },
        );
      });
      const img = q(".work-tile .work-img")[0];
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.12 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }
    },
    { scope: root, dependencies: [items.length] },
  );

  if (!first) return null;

  return (
    <section ref={root} id="punimet" className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-36">
      <div className="mb-10 md:mb-14 md:flex md:items-end md:justify-between md:gap-10">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-copper uppercase">{work.eyebrow}</p>
          <Reveal as="h2" className="max-w-3xl font-serif text-[clamp(2.4rem,8.5vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.025em]">
            <Emph text={work.title} />
          </Reveal>
        </div>
        <Reveal as="p" mode="fade" className="mt-5 max-w-sm text-lg leading-relaxed text-ink-soft md:mt-0">
          {work.intro}
        </Reveal>
      </div>

      <div className="grid gap-3 md:gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7 lg:self-start">
          <Tile item={first} featured />
        </div>
        {rest.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:col-span-5 lg:auto-rows-fr lg:grid-cols-2">
            {rest.map((item) => (
              <Tile key={item.id} item={item} featured={false} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-ink-soft">{work.note}</p>
        {contact.tiktok && (
          <a
            href={contact.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-ink/20 bg-paper/60 py-2.5 pr-5 pl-2.5 font-semibold transition-colors hover:border-ink/50 md:self-auto"
          >
            <span className="grid size-8 place-items-center rounded-full bg-ink text-paper">
              <TikTokIcon className="size-4" />
            </span>
            {work.tiktokCta}
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </section>
  );
}
