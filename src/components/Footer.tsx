import Logo from "./Logo";
import { SocialIcon } from "./icons";
import { navLinks, socialLinks, splitName, telHref, whatsappHref } from "@/src/content/site";
import type { Content } from "@/src/content/schema";

type Props = { brand: Content["brand"]; contact: Content["contact"]; nav: Content["nav"]; footer: Content["footer"] };

export default function Footer({ brand, contact, nav: navText, footer }: Props) {
  const nav = navLinks(navText);
  const social = socialLinks(contact);
  return (
    <footer className="relative overflow-hidden bg-ink pt-16 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-paper lg:pb-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo name={brand.name} />
            <p className="mt-4 max-w-xs font-serif text-xl leading-snug text-paper/80 italic">{brand.tagline}</p>
            <p className="mt-4 text-sm tracking-wide text-paper/55">{brand.services}</p>
            <p className="mt-1 text-sm tracking-wide text-paper/55">{brand.categories}</p>
            {social.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-paper/50 uppercase">{footer.followLabel}</p>
                <ul className="flex gap-2">
                  {social.map((s) => (
                    <li key={s.key}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${brand.name} në ${s.label}`}
                        className="grid size-11 place-items-center rounded-full border border-paper/20 text-paper/85 transition-colors hover:bg-paper/10 hover:text-paper"
                      >
                        <SocialIcon name={s.key} className="size-5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <nav aria-label={footer.pageLabel}>
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-paper/50 uppercase">{footer.pageLabel}</p>
            <ul className="grid grid-cols-2 gap-x-4 md:grid-cols-1">
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="block py-1.5 text-paper/80 transition-colors hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-paper/50 uppercase">{footer.contactLabel}</p>
            <a href={telHref(contact)} className="block py-1.5 text-paper/80 tabular-nums hover:text-paper">
              {contact.phoneDisplay}
            </a>
            <a href={whatsappHref(contact)} target="_blank" rel="noopener noreferrer" className="block py-1.5 text-paper/80 hover:text-paper">
              WhatsApp
            </a>
            <p className="py-1.5 text-paper/60">{contact.location}</p>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-14 bg-gradient-to-b from-oak/50 to-transparent bg-clip-text font-serif text-[31vw] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap text-transparent md:text-[17.5vw] xl:text-[15rem]"
        >
          {splitName(brand.name)[1]}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 pt-6 text-sm text-paper/55">
          <p>
            © {new Date().getFullYear()} {brand.name}
          </p>
          <a href="#top" className="rounded-full border border-paper/20 px-4 py-2 text-paper/80 transition-colors hover:bg-paper/10">
            {footer.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
