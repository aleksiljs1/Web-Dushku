import { z } from "zod";
import { defaults } from "./defaults";

// Everything the page shows, as one typed document. The admin panel edits a
// JSON copy of it; whatever is stored is merged over `defaults` field by field,
// so a missing or broken field quietly falls back to the original text.

const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

/** Only our own files or our Blob store: never javascript:, data: or other hosts. */
export function isSafeMediaSrc(src: string) {
  if (src === "") return true;
  if (/^\/(media|uploads)\/[\w.\-/]+$/.test(src) && !src.includes("..")) return true;
  return BLOB_HOST.test(src) && !/\s/.test(src);
}

const str = (def: string, max = 600) => z.string().trim().max(max).catch(def);
const longStr = (def: string) => str(def, 2000);
const media = (def = "") => z.string().trim().max(600).refine(isSafeMediaSrc).catch(def);
const url = (def: string) =>
  z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https:\/\/[^\s"'<>]+$/.test(v))
    .catch(def);
const digits = (def: string) =>
  z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d+]/g, ""))
    .pipe(z.string().max(20))
    .catch(def);
const list = (def: string[], maxItems = 30) => z.array(z.string().trim().min(1).max(120)).max(maxItems).catch(def);

/** Arrays the layout depends on (icons, colours): keep the length, fill gaps from defaults. */
function fixed<T extends z.ZodType>(item: T, def: z.infer<T>[]) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((arr) => def.map((d, i) => (i < arr.length ? (item.catch(d).parse(arr[i]) as z.infer<T>) : d)));
}

const newId = () => Math.random().toString(36).slice(2, 10);

const d = defaults;

const brand = z
  .object({
    name: str(d.brand.name, 60),
    tagline: str(d.brand.tagline, 200),
    description: str(d.brand.description, 400),
    services: str(d.brand.services, 120),
    categories: str(d.brand.categories, 120),
  })
  .catch(d.brand);

const contact = z
  .object({
    phoneDisplay: str(d.contact.phoneDisplay, 40),
    phone: digits(d.contact.phone),
    whatsapp: digits(d.contact.whatsapp).transform((v) => v.replace(/\+/g, "")),
    location: str(d.contact.location, 120),
    tiktok: url(d.contact.tiktok),
    instagram: url(d.contact.instagram),
    facebook: url(d.contact.facebook),
  })
  .catch(d.contact);

const nav = z
  .object({
    services: str(d.nav.services, 30),
    work: str(d.nav.work, 30),
    assembly: str(d.nav.assembly, 30),
    process: str(d.nav.process, 30),
    materials: str(d.nav.materials, 30),
    contact: str(d.nav.contact, 30),
  })
  .catch(d.nav);

const ui = z
  .object({
    callShort: str(d.ui.callShort, 40),
    callLong: str(d.ui.callLong, 40),
    whatsapp: str(d.ui.whatsapp, 40),
    menu: str(d.ui.menu, 30),
  })
  .catch(d.ui);

const hero = z
  .object({
    badge: str(d.hero.badge, 80),
    headline: str(d.hero.headline, 160),
    text: longStr(d.hero.text),
    ctaPrimary: str(d.hero.ctaPrimary, 40),
    ctaCall: str(d.hero.ctaCall, 40),
    measureNote: str(d.hero.measureNote, 120),
  })
  .catch(d.hero);

const card = (def: (typeof d.services)["custom"]) =>
  z
    .object({
      title: str(def.title, 80),
      kicker: str(def.kicker, 80),
      text: longStr(def.text),
      chips: list(def.chips, 12),
      link: str(def.link, 60),
    })
    .catch(def);

const services = z
  .object({
    eyebrow: str(d.services.eyebrow, 60),
    title: str(d.services.title, 160),
    intro: longStr(d.services.intro),
    custom: card(d.services.custom),
    assembly: card(d.services.assembly),
  })
  .catch(d.services);

const titleText = z.object({ title: str("", 100), text: str("", 400) });

const assembly = z
  .object({
    eyebrow: str(d.assembly.eyebrow, 60),
    title: str(d.assembly.title, 160),
    steps: fixed(titleText, d.assembly.steps),
  })
  .catch(d.assembly);

export const galleryItemSchema = z.object({
  id: z.string().trim().min(1).max(40).catch(newId),
  type: z.enum(["image", "video"]).catch("image"),
  src: media(""),
  poster: media(""),
  caption: str("", 200),
  alt: str("", 300),
  visible: z.boolean().catch(true),
});

const work = z
  .object({
    eyebrow: str(d.work.eyebrow, 60),
    title: str(d.work.title, 160),
    intro: longStr(d.work.intro),
    note: str(d.work.note, 300),
    tiktokCta: str(d.work.tiktokCta, 80),
    items: z
      .array(z.unknown())
      .max(40)
      .catch(d.work.items)
      .transform((arr) =>
        arr
          .map((it) => galleryItemSchema.safeParse(it))
          .filter((r) => r.success)
          .map((r) => r.data)
          .filter((it) => it.src !== ""),
      ),
  })
  .catch(d.work);

export const stepMediaSchema = z.object({
  type: z.enum(["image", "video"]).catch("image"),
  frame: z.enum(["chat", "phone", "plain"]).catch("plain"),
  src: media(""),
  poster: media(""),
  alt: str("", 300),
  caption: str("", 300),
  reply: str("", 300),
});

const emptyMedia = { type: "image", frame: "plain", src: "", poster: "", alt: "", caption: "", reply: "" } as const;

const processStep = z.object({
  title: str("", 100),
  text: str("", 600),
  media: stepMediaSchema.catch({ ...emptyMedia }),
});

const process = z
  .object({
    eyebrow: str(d.process.eyebrow, 60),
    title: str(d.process.title, 160),
    intro: longStr(d.process.intro),
    steps: z
      .array(z.unknown())
      .min(1)
      .max(8)
      .catch(d.process.steps)
      .transform((arr) =>
        arr.map((s, i) => processStep.catch(d.process.steps[i] ?? { title: "", text: "", media: { ...emptyMedia } }).parse(s)),
      ),
  })
  .catch(d.process);

const materials = z
  .object({
    eyebrow: str(d.materials.eyebrow, 60),
    title: str(d.materials.title, 160),
    text: longStr(d.materials.text),
    finishes: fixed(z.object({ name: str("", 40), note: str("", 80) }), d.materials.finishes),
  })
  .catch(d.materials);

const why = z
  .object({
    eyebrow: str(d.why.eyebrow, 60),
    title: str(d.why.title, 160),
    reasons: fixed(titleText, d.why.reasons),
  })
  .catch(d.why);

const contactSection = z
  .object({
    eyebrow: str(d.contactSection.eyebrow, 60),
    title: str(d.contactSection.title, 120),
    text: longStr(d.contactSection.text),
    phoneLabel: str(d.contactSection.phoneLabel, 40),
    whatsappLabel: str(d.contactSection.whatsappLabel, 40),
    whatsappCta: str(d.contactSection.whatsappCta, 40),
    tiktokLabel: str(d.contactSection.tiktokLabel, 80),
    formTitle: str(d.contactSection.formTitle, 80),
    formHint: str(d.contactSection.formHint, 200),
    nameLabel: str(d.contactSection.nameLabel, 60),
    namePlaceholder: str(d.contactSection.namePlaceholder, 60),
    nameError: str(d.contactSection.nameError, 120),
    needLabel: str(d.contactSection.needLabel, 60),
    needs: list(d.contactSection.needs, 8),
    messageLabel: str(d.contactSection.messageLabel, 60),
    messageOptional: str(d.contactSection.messageOptional, 40),
    messagePlaceholder: str(d.contactSection.messagePlaceholder, 200),
    submit: str(d.contactSection.submit, 60),
    callPrompt: str(d.contactSection.callPrompt, 80),
    callLink: str(d.contactSection.callLink, 60),
  })
  .catch(d.contactSection);

const footer = z
  .object({
    pageLabel: str(d.footer.pageLabel, 40),
    contactLabel: str(d.footer.contactLabel, 40),
    followLabel: str(d.footer.followLabel, 40),
    backToTop: str(d.footer.backToTop, 40),
  })
  .catch(d.footer);

const marquee = z.object({ words: list(d.marquee.words, 16) }).catch(d.marquee);

export const contentSchema = z.object({
  brand,
  contact,
  nav,
  ui,
  hero,
  marquee,
  services,
  work,
  assembly,
  process,
  materials,
  why,
  contactSection,
  footer,
});

export type Content = z.infer<typeof contentSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type StepMedia = z.infer<typeof stepMediaSchema>;

/** Stored JSON (or nothing) in, a complete and safe document out. Never throws. */
export function mergeContent(stored: unknown): Content {
  const input = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  const r = contentSchema.safeParse(input);
  return r.success ? r.data : contentSchema.parse({});
}
