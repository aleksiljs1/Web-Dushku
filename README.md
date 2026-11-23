# Mobilieri Dushku

Faqja e Mobilieri Dushku: mobilje me porosi (dizenjim, prodhim, montim) dhe montim mobiljesh. Një faqe e vetme në shqip, e menduar para së gjithash për telefon, me një panel `/admin` ku pronari ndryshon tekstet, fotot dhe videot.

## Teknologjia

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP 3 (ScrollTrigger, SplitText, DrawSVG), Lenis, zod dhe Vercel Blob.

## Nisja

```sh
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint
```

## Paneli i administrimit (`/admin`)

Pronari hyn te `https://<faqja>/admin` me fjalëkalimin, ndryshon çfarë do (tekste, telefon, TikTok, foto e video të galerisë, hapat e procesit) dhe shtyp **Ruaj**. Faqja përditësohet menjëherë. Butoni **Rikthe përmbajtjen fillestare** kthen gjithçka siç është në kod.

### Konfigurimi në Vercel (një herë)

1. **Krijoni një Blob store.** Në Vercel Dashboard hapni projektin → **Storage** → **Create** → **Blob**. Zgjidhni qasje **Public** (fotot duhet të shihen nga të gjithë), jepini një emër dhe **lidheni (Connect) me këtë projekt** për të gjitha mjediset. Kjo vendos vetë variablën `BLOB_READ_WRITE_TOKEN`.
2. **Vendosni variablat e panelit.** Projekti → **Settings** → **Environment Variables**:
   - `ADMIN_PASSWORD`: fjalëkalimi i pronarit.
   - `ADMIN_SECRET`: një varg i gjatë e i rastësishëm (të paktën 16 shkronja, p.sh. nga `openssl rand -hex 32`). Po ta ndryshoni, të gjitha seancat mbyllen.
3. **Ribëni deploy** (Deployments → ⋯ → **Redeploy**), që variablat e reja të hyjnë në fuqi.
4. Hapni `https://<faqja>/admin`, hyni dhe provoni një ndryshim të vogël.

Shih `.env.example` për listën e plotë.

### Si funksionon

- **Përmbajtja** është një dokument JSON (`content/site.json` në Blob). Skema dhe vlerat fillestare janë në `src/content/schema.ts` dhe `src/content/defaults.ts`. Çdo fushë që mungon ose është e pavlefshme kthehet te vlera fillestare, ndaj faqja nuk prishet kurrë nga një ruajtje e gabuar.
- **Fotot dhe videot** ngarkohen direkt nga shfletuesi në Vercel Blob (deri në 60 MB; JPG, PNG, WebP, AVIF, MP4, WebM, MOV), pa kaluar nga kufiri 4.5 MB i funksioneve. Kur një foto zëvendësohet, skedari i vjetër mbetet në Blob (mund të fshihet nga Storage në Vercel).
- **Pas ruajtjes** faqja rindërtohet me `revalidatePath("/", "layout")`; përndryshe rifreskohet vetë çdo orë.
- **Siguria:** fjalëkalimi krahasohet në kohë konstante, pas 5 gabimeve hyrja bllokohet 10 minuta, seanca është një cookie `HttpOnly`, `Secure`, `SameSite=Lax` e nënshkruar me HMAC (7 ditë). `proxy.ts` mbron `/admin` dhe `/api/admin`, dhe çdo veprim e kontrollon seancën vetë. Paneli ka `noindex`.

### Në kompjuter, pa Vercel

Pa `BLOB_READ_WRITE_TOKEN`, paneli punon njësoj: tekstet ruhen te `.data/site.json` dhe fotot te `public/uploads/` (të dyja jashtë git-it). Mjafton një `.env.local` me `ADMIN_PASSWORD` dhe `ADMIN_SECRET`.

## Ku ndryshohet çfarë (në kod)

- `src/content/defaults.ts`: të gjitha tekstet dhe fotot fillestare. **Emri i biznesit** (`brand.name`) është "Mobilieri Dushku"; si në TikTok (@mobilieri.dushku); mund të ndryshohet këtu ose nga paneli.
- `public/media/`: fotot dhe videot e klientit (shih më poshtë).
- `src/components/`: çdo seksion i faqes (Hero, Services, Work, Assembly, Process, Materials, Why, Contact, Footer).
- `app/globals.css`: ngjyrat (lini, lisi, arra, bakri) dhe teksturat e drurit.

### Mediat

- `punim-mur-librarie.jpg`: punë e tyre (mur librarie në arrë), foto kryesore te "Punimet tona".
- `video-kuzhina-garderoba.mp4` + `frame-kuzhina.jpg`: video e tyre nga TikTok, te "Punimet tona".
- `sallon-tavoline.jpg`: ambient sallon me titull neutral ("Ambiente"), nuk pretendohet si punë e tyre. Hiqet nga paneli me një klik.
- `video-projekt-3d.mp4` + `frame-projekt-3d.jpg`: projekt 3D me masa, te hapi 2 i procesit.
- `ide-pinterest-raft.jpg`: screenshot Pinterest, **jo punë e tyre**; shfaqet vetëm si "shembull mesazhi" nga një klient te hapi 1 ("Ju na sillni idenë"). Zëvendësohet nga paneli.

Animacionet dhe videot respektojnë `prefers-reduced-motion`: videot nuk nisin vetë, por presin një prekje.
