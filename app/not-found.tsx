import Link from "next/link";

export const metadata = { title: "Faqja nuk u gjet" };

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-5 pt-28 pb-16 text-center">
      {/* A chair that's lost a leg */}
      <svg viewBox="0 0 200 200" className="w-40 rotate-[-8deg]" aria-hidden>
        <rect x="50" y="30" width="100" height="70" rx="12" fill="#c08a55" stroke="#2a1d14" strokeWidth="3" />
        <rect x="40" y="100" width="120" height="22" rx="6" fill="#e3c9a0" stroke="#2a1d14" strokeWidth="3" />
        <path d="M55 122 L48 180 M145 122 L152 180 M80 122 L78 165" stroke="#2a1d14" strokeWidth="5" strokeLinecap="round" />
        <path d="M150 190 l18 -6" stroke="#b4582b" strokeWidth="5" strokeLinecap="round" />
      </svg>
      <p className="mt-8 text-xs font-semibold tracking-[0.25em] text-copper uppercase">Gabim 404</p>
      <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight md:text-6xl">Kjo faqe i ka humbur një këmbë.</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">Faqja që kërkoni nuk ekziston, ose është zhvendosur.</p>
      <Link href="/" className="mt-8 rounded-full bg-ink px-7 py-4 font-semibold text-paper transition-colors hover:bg-walnut">
        Kthehuni në faqen kryesore
      </Link>
    </section>
  );
}
