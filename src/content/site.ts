// Small helpers shared by the sections. The words themselves live in
// `defaults.ts` (and whatever the admin panel stores over them).
import type { Content } from "./schema";

export type Contact = Content["contact"];

export const telHref = (c: Contact) => `tel:${c.phone}`;

export function whatsappHref(c: Contact, text?: string) {
  const base = `https://wa.me/${c.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function navLinks(n: Content["nav"]) {
  return [
    { href: "#sherbimet", label: n.services },
    { href: "#punimet", label: n.work },
    { href: "#montimi", label: n.assembly },
    { href: "#procesi", label: n.process },
    { href: "#materialet", label: n.materials },
    { href: "#kontakt", label: n.contact },
  ];
}

/** "Mobileri Dushku" → ["Mobileri", "Dushku"]: the last word gets the accent colour. */
export function splitName(name: string): [string, string] {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return ["", parts[0] ?? ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

export function socialLinks(c: Contact) {
  return [
    { key: "tiktok", href: c.tiktok, label: "TikTok" },
    { key: "instagram", href: c.instagram, label: "Instagram" },
    { key: "facebook", href: c.facebook, label: "Facebook" },
  ].filter((s) => s.href) as { key: "tiktok" | "instagram" | "facebook"; href: string; label: string }[];
}
