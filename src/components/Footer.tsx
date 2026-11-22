import Logo from "./Logo";
import { nav, site, telHref, whatsappHref } from "@/src/content/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-16 pb-[calc(env(safe-area-inset-bottom)+2rem)] text-paper lg:pb-10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs font-serif text-xl leading-snug text-paper/80 italic">{site.tagline}</p>
          </div>
          <nav aria-label="Faqja">
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-paper/50 uppercase">Faqja</p>
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
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-paper/50 uppercase">Kontakt</p>
            <a href={telHref} className="block py-1.5 text-paper/80 tabular-nums hover:text-paper">
              {site.phoneDisplay}
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="block py-1.5 text-paper/80 hover:text-paper">
              WhatsApp
            </a>
            <p className="py-1.5 text-paper/60">{site.location}</p>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-14 bg-gradient-to-b from-oak/50 to-transparent bg-clip-text font-serif text-[31vw] leading-[0.8] font-semibold tracking-[-0.05em] whitespace-nowrap text-transparent md:text-[17.5vw] xl:text-[15rem]"
        >
          Dushku
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 pt-6 text-sm text-paper/55">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <a href="#top" className="rounded-full border border-paper/20 px-4 py-2 text-paper/80 transition-colors hover:bg-paper/10">
            Lart ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
