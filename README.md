# Mobileri Dushku

Faqja e Mobileri Dushku: mobilje me porosi dhe montim mobiljesh. Një faqe e vetme në shqip, e menduar para së gjithash për telefon.

## Teknologjia

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP 3 (ScrollTrigger, SplitText, DrawSVG) dhe Lenis për scroll-in e butë.

## Nisja

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint
```

## Ku ndryshohet çfarë

- `src/content/site.ts`: emri, telefoni, WhatsApp, vendndodhja dhe lidhjet e menusë. **Telefoni dhe WhatsApp janë ende placeholder (TODO).**
- `src/components/`: çdo seksion i faqes (Hero, Services, Assembly, Process, Materials, Why, Contact, Footer).
- `app/globals.css`: ngjyrat (lini, lisi, arra, bakri) dhe teksturat e drurit.
- `app/opengraph-image.tsx`: imazhi që shfaqet kur lidhja ndahet në WhatsApp, Facebook etj.

Animacionet respektojnë `prefers-reduced-motion`: kush e ka të aktivizuar e sheh faqen të plotë, pa lëvizje.
