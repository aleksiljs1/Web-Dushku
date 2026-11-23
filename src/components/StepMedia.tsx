import Image from "next/image";
import InViewVideo from "./InViewVideo";
import type { StepMedia as Media } from "@/src/content/schema";

// A picture or video under a process step, in one of three frames:
// "chat"  - a client's message with a screenshot attached (the idea),
// "phone" - a portrait video in a phone outline (the 3D walkthrough),
// "plain" - a rounded photo or video.

function Visual({ media, sizes }: { media: Media; sizes: string }) {
  return media.type === "video" ? (
    <InViewVideo src={media.src} poster={media.poster} label={media.alt || media.caption} controls={media.frame === "phone" ? "side" : "corner"} />
  ) : (
    <Image src={media.src} alt={media.alt} fill sizes={sizes} className="object-cover" />
  );
}

export default function StepMedia({ media }: { media: Media }) {
  if (media.frame === "chat") {
    return (
      <div className="mt-6 w-full max-w-[19rem] rounded-[1.75rem] border border-line bg-sand/70 p-3 shadow-[0_18px_40px_-24px_rgba(42,29,20,.5)]">
        <p className="mb-3 text-center text-[0.7rem] font-semibold tracking-[0.18em] text-ink-mute uppercase">Shembull mesazhi</p>
        <div className="ml-6 rounded-2xl rounded-tr-md bg-paper p-1.5 shadow-sm">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-linen [&_img]:object-[50%_55%]">
            <Visual media={media} sizes="260px" />
          </div>
          {media.caption && <p className="px-2 pt-2 text-[0.92rem] leading-snug">{media.caption}</p>}
          <p className="px-2 pt-0.5 pb-0.5 text-right text-[0.7rem] text-ink-mute">11:48 ✓✓</p>
        </div>
        {media.reply && (
          <div className="mt-2 mr-6 rounded-2xl rounded-tl-md bg-walnut px-3.5 py-2.5 text-[0.92rem] leading-snug text-paper">
            {media.reply}
          </div>
        )}
      </div>
    );
  }

  if (media.frame === "phone") {
    return (
      <figure className="mt-6 w-full max-w-[15.5rem]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border-[6px] border-ink bg-ink shadow-[0_24px_50px_-24px_rgba(42,29,20,.7)]">
          <Visual media={media} sizes="240px" />
        </div>
        {media.caption && <figcaption className="mt-3 text-sm text-ink-mute">{media.caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="mt-6 w-full max-w-md">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-sand">
        <Visual media={media} sizes="(min-width: 1024px) 28rem, 90vw" />
      </div>
      {media.caption && <figcaption className="mt-3 text-sm text-ink-mute">{media.caption}</figcaption>}
    </figure>
  );
}
