"use client";

import { createContext, useContext, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { logout, resetContent, saveContent } from "./actions";
import type { Content } from "@/src/content/schema";
import { ALLOWED_TYPES, IMAGE_TYPES, MAX_UPLOAD_BYTES, VIDEO_TYPES, extFor, isVideoSrc, slugify } from "@/src/lib/media-rules";

type Path = (string | number)[];

function getIn(obj: unknown, path: Path): unknown {
  return path.reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string | number, unknown>)[k]), obj);
}

function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [k, ...rest] = path;
  const copy = (Array.isArray(obj) ? [...obj] : { ...(obj as object) }) as Record<string | number, unknown>;
  copy[k] = setIn(copy[k], rest, value);
  return copy as T;
}

type Ctx = { content: Content; set: (path: Path, value: unknown) => void; blob: boolean };
const EditorCtx = createContext<Ctx | null>(null);
const useEditor = () => useContext(EditorCtx)!;

const newId = () => Math.random().toString(36).slice(2, 10);

// ---------- uploads ----------

async function uploadFile(file: File, blob: boolean, onProgress: (pct: number) => void): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Lejohen vetëm foto (JPG, PNG, WebP, AVIF) ose video (MP4, WebM, MOV).");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`Skedari është më i madh se ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
  const pathname = `uploads/${slugify(file.name)}.${extFor(file.type)}`;

  if (blob) {
    const res = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      contentType: file.type,
      multipart: file.size > 8 * 1024 * 1024,
      onUploadProgress: (e) => onProgress(Math.round(e.percentage)),
    });
    return res.url;
  }

  // Local development: send it to our own route
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const body = new FormData();
    body.append("file", file);
    xhr.open("POST", "/api/admin/upload-local");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && json.url) resolve(json.url);
        else reject(new Error(json.error ?? "Ngarkimi dështoi."));
      } catch {
        reject(new Error("Ngarkimi dështoi."));
      }
    };
    xhr.onerror = () => reject(new Error("Lidhja dështoi gjatë ngarkimit."));
    xhr.send(body);
  });
}

// ---------- fields ----------

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base outline-none transition-colors focus:border-copper";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-mute">{hint}</span>}
    </label>
  );
}

function T({ p, label, hint, area }: { p: Path; label: string; hint?: string; area?: boolean }) {
  const { content, set } = useEditor();
  const value = String(getIn(content, p) ?? "");
  return (
    <Field label={label} hint={hint}>
      {area ? (
        <textarea value={value} onChange={(e) => set(p, e.target.value)} rows={3} className={`${inputCls} resize-y`} />
      ) : (
        <input value={value} onChange={(e) => set(p, e.target.value)} className={inputCls} />
      )}
    </Field>
  );
}

function L({ p, label }: { p: Path; label: string }) {
  const { content, set } = useEditor();
  const value = (getIn(content, p) as string[] | undefined) ?? [];
  const [text, setText] = useState(value.join("\n"));
  return (
    <Field label={label} hint="Një për rresht.">
      <textarea
        value={text}
        rows={Math.min(8, Math.max(3, value.length + 1))}
        onChange={(e) => {
          setText(e.target.value);
          set(
            p,
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
          );
        }}
        className={`${inputCls} resize-y`}
      />
    </Field>
  );
}

function Sel({ p, label, options }: { p: Path; label: string; options: { value: string; label: string }[] }) {
  const { content, set } = useEditor();
  return (
    <Field label={label}>
      <select value={String(getIn(content, p) ?? "")} onChange={(e) => set(p, e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Tog({ p, label }: { p: Path; label: string }) {
  const { content, set } = useEditor();
  const on = Boolean(getIn(content, p));
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 text-sm font-semibold">
      <input type="checkbox" checked={on} onChange={(e) => set(p, e.target.checked)} className="size-5 accent-[var(--copper)]" />
      {label}
    </label>
  );
}

/** Preview, upload/replace and remove for one picture or video. */
function M({ p, label, accept, typePath }: { p: Path; label: string; accept: "image" | "video" | "any"; typePath?: Path }) {
  const { content, set, blob } = useEditor();
  const src = String(getIn(content, p) ?? "");
  const [pct, setPct] = useState<number | null>(null);
  const [error, setError] = useState("");
  const types = accept === "image" ? IMAGE_TYPES : accept === "video" ? VIDEO_TYPES : ALLOWED_TYPES;
  const video = src && isVideoSrc(src);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!(types as readonly string[]).includes(file.type)) {
      setError(accept === "image" ? "Këtu lejohen vetëm foto." : accept === "video" ? "Këtu lejohen vetëm video." : "Lloj skedari i palejuar.");
      return;
    }
    setPct(0);
    try {
      const url = await uploadFile(file, blob, setPct);
      set(p, url);
      if (typePath) set(typePath, file.type.startsWith("video/") ? "video" : "image");
    } catch (e) {
      setError((e as Error).message || "Ngarkimi dështoi.");
    } finally {
      setPct(null);
    }
  }

  return (
    <div>
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-1.5 flex gap-3 rounded-2xl border border-line bg-paper p-2.5">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-sand">
          {src ? (
            video ? (
              <video src={src} muted playsInline preload="metadata" className="size-full object-cover" />
            ) : (
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            )
          ) : (
            <span className="grid size-full place-items-center text-xs text-ink-mute">Bosh</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <p className="truncate text-xs text-ink-mute" title={src}>
            {src ? src.split("/").pop() : "Asnjë skedar"}
          </p>
          {pct !== null ? (
            <div>
              <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-copper transition-[width]" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-xs text-ink-soft">Duke ngarkuar… {pct}%</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-copper">
                {src ? "Zëvendëso" : "Ngarko"}
                <input
                  type="file"
                  accept={types.join(",")}
                  className="sr-only"
                  onChange={(e) => {
                    onFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
              {src && (
                <button type="button" onClick={() => set(p, "")} className="rounded-full border border-line px-4 py-2 text-sm font-semibold">
                  Hiq
                </button>
              )}
            </div>
          )}
          {error && <p className="text-xs font-medium text-copper">{error}</p>}
        </div>
      </div>
    </div>
  );
}

/** A list of cards that can be reordered, removed and added to. */
function Items({
  p,
  title,
  make,
  render,
  min = 0,
  max = 40,
  addLabel,
}: {
  p: Path;
  title: (i: number) => string;
  make?: () => unknown;
  render: (base: Path, i: number) => ReactNode;
  min?: number;
  max?: number;
  addLabel?: string;
}) {
  const { content, set } = useEditor();
  const items = (getIn(content, p) as unknown[]) ?? [];
  const move = (i: number, d: number) => {
    const next = [...items];
    const [it] = next.splice(i, 1);
    next.splice(i + d, 0, it);
    set(p, next);
  };
  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div key={(items[i] as { id?: string })?.id ?? i} className="rounded-2xl border border-line bg-linen/60 p-3.5">
          <div className="mb-3 flex items-center gap-2">
            <p className="mr-auto font-semibold">{title(i)}</p>
            {make && (
              <>
                <button type="button" aria-label="Lëviz lart" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-9 place-items-center rounded-full border border-line bg-paper disabled:opacity-30">
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Lëviz poshtë"
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                  className="grid size-9 place-items-center rounded-full border border-line bg-paper disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  aria-label="Fshi"
                  disabled={items.length <= min}
                  onClick={() => confirm("Ta heq këtë nga faqja?") && set(p, items.filter((__, j) => j !== i))}
                  className="grid size-9 place-items-center rounded-full border border-line bg-paper text-copper disabled:opacity-30"
                >
                  ✕
                </button>
              </>
            )}
          </div>
          <div className="space-y-3.5">{render([...p, i], i)}</div>
        </div>
      ))}
      {make && items.length < max && (
        <button type="button" onClick={() => set(p, [...items, make()])} className="w-full rounded-2xl border-2 border-dashed border-line py-3.5 font-semibold text-ink-soft">
          + {addLabel ?? "Shto"}
        </button>
      )}
    </div>
  );
}

function Section({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group rounded-[1.5rem] bg-paper shadow-[0_1px_0_var(--line)]">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-serif text-xl font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-ink-mute transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="space-y-4 border-t border-line px-5 pt-4 pb-5">{children}</div>
    </details>
  );
}

const EM_HINT = "Fjalët mes *yjeve* dalin me shkronja të pjerrëta, me ngjyrë.";

// ---------- editor ----------

export default function Editor({ initial, blob }: { initial: Content; blob: boolean }) {
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const [listKey, setListKey] = useState(0);
  const dirty = JSON.stringify(content) !== saved;
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const show = (kind: "ok" | "error", text: string) => {
    setStatus({ kind, text });
    if (statusTimer.current) clearTimeout(statusTimer.current);
    if (kind === "ok") statusTimer.current = setTimeout(() => setStatus(null), 4000);
  };

  const set = (path: Path, value: unknown) => setContent((c) => setIn(c, path, value));

  const apply = (next: Content) => {
    setContent(next);
    setSaved(JSON.stringify(next));
    setListKey((k) => k + 1); // refresh the one-per-line boxes
  };

  function save() {
    startTransition(async () => {
      const r = await saveContent(content);
      if (r.ok) {
        apply(r.content);
        show("ok", "U ruajt. Faqja u përditësua.");
      } else show("error", r.error);
    });
  }

  function reset() {
    if (!confirm("Të rikthehen të gjitha tekstet dhe fotot fillestare? Ndryshimet tuaja do të fshihen.")) return;
    startTransition(async () => {
      const r = await resetContent();
      if (r.ok) {
        apply(r.content);
        show("ok", "U rikthye përmbajtja fillestare.");
      } else show("error", r.error);
    });
  }

  const galleryItem = () => ({ id: newId(), type: "image", src: "", poster: "", caption: "", alt: "", visible: true });
  const step = () => ({ title: "Hap i ri", text: "", media: { type: "image", frame: "plain", src: "", poster: "", alt: "", caption: "", reply: "" } });

  return (
    <EditorCtx.Provider value={{ content, set, blob }}>
      <header className="sticky top-0 z-20 border-b border-line bg-linen/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <div className="mr-auto min-w-0">
            <p className="truncate font-serif text-lg font-semibold">Paneli</p>
            <p className="truncate text-xs text-ink-mute">{dirty ? "Ka ndryshime të paruajtura" : "Gjithçka e ruajtur"}</p>
          </div>
          <a href="/" target="_blank" rel="noopener" className="rounded-full border border-line bg-paper px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap">
            Shiko faqen ↗
          </a>
          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className="rounded-full bg-copper px-5 py-2.5 text-sm font-semibold text-paper disabled:opacity-50"
          >
            {pending ? "Duke ruajtur…" : "Ruaj"}
          </button>
        </div>
        {status && (
          <p role="status" className={`px-4 pb-2.5 text-center text-sm font-medium ${status.kind === "ok" ? "text-[#1f7a43]" : "text-copper"}`}>
            {status.text}
          </p>
        )}
      </header>

      <main key={listKey} className="mx-auto max-w-3xl space-y-3 px-4 pt-4 pb-28">
        {!blob && (
          <p className="rounded-2xl border border-line bg-paper p-3.5 text-sm text-ink-soft">
            Mënyra lokale: ndryshimet ruhen në <code>.data/</code> dhe fotot në <code>public/uploads/</code>. Në Vercel lidhni një Blob store.
          </p>
        )}

        <Section title="Emri dhe kontakti" open>
          <T p={["brand", "name"]} label="Emri i biznesit" hint="Fjala e fundit del me ngjyrë (p.sh. Dushku)." />
          <T p={["brand", "tagline"]} label="Slogani" />
          <T p={["brand", "description"]} label="Përshkrimi (për Google dhe lidhjet e ndara)" area />
          <T p={["brand", "services"]} label="Shërbimet në një rresht" />
          <T p={["brand", "categories"]} label="Kategoritë në një rresht" />
          <div className="grid gap-4 sm:grid-cols-2">
            <T p={["contact", "phoneDisplay"]} label="Telefoni (si shfaqet)" />
            <T p={["contact", "phone"]} label="Telefoni për thirrje" hint="Me prefiks: +355…" />
            <T p={["contact", "whatsapp"]} label="WhatsApp" hint="Vetëm shifra: 355…" />
            <T p={["contact", "location"]} label="Vendndodhja" />
          </div>
          <T p={["contact", "tiktok"]} label="TikTok" hint="Lidhja e plotë https://… Lëreni bosh për ta fshehur." />
          <T p={["contact", "instagram"]} label="Instagram" hint="Opsionale." />
          <T p={["contact", "facebook"]} label="Facebook" hint="Opsionale." />
        </Section>

        <Section title="Hyrja (lart në faqe)">
          <T p={["hero", "badge"]} label="Etiketa e vogël" />
          <T p={["hero", "headline"]} label="Titulli" hint={EM_HINT} area />
          <T p={["hero", "text"]} label="Teksti" area />
          <div className="grid gap-4 sm:grid-cols-2">
            <T p={["hero", "ctaPrimary"]} label="Butoni kryesor" />
            <T p={["hero", "ctaCall"]} label="Butoni i telefonit" />
          </div>
          <T p={["hero", "measureNote"]} label="Shënimi pranë metrit" />
          <L p={["marquee", "words"]} label="Fjalët që rrëshqasin" />
        </Section>

        <Section title="Punimet tona (foto dhe video)">
          <T p={["work", "eyebrow"]} label="Etiketa" />
          <T p={["work", "title"]} label="Titulli" hint={EM_HINT} />
          <T p={["work", "intro"]} label="Hyrja" area />
          <p className="text-sm text-ink-soft">E para del e madhe. Renditini me shigjetat.</p>
          <Items
            p={["work", "items"]}
            title={(i) => (i === 0 ? "1 · e madhe" : `${i + 1}`)}
            make={galleryItem}
            addLabel="Shto foto ose video"
            render={(b) => (
              <>
                <M p={[...b, "src"]} typePath={[...b, "type"]} label="Foto ose video" accept="any" />
                {getIn(content, [...b, "type"]) === "video" && <M p={[...b, "poster"]} label="Kopertina e videos (foto)" accept="image" />}
                <T p={[...b, "caption"]} label="Përshkrimi mbi foto" />
                <T p={[...b, "alt"]} label="Përshkrimi për lexuesit e ekranit" hint="Çfarë shihet në foto, me pak fjalë." />
                <Tog p={[...b, "visible"]} label="Shfaqe në faqe" />
              </>
            )}
          />
          <T p={["work", "note"]} label="Shënimi poshtë galerisë" area />
          <T p={["work", "tiktokCta"]} label="Butoni i TikTok" />
        </Section>

        <Section title="Shërbimet">
          <T p={["services", "eyebrow"]} label="Etiketa" />
          <T p={["services", "title"]} label="Titulli" hint={EM_HINT} />
          <T p={["services", "intro"]} label="Hyrja" area />
          {(["custom", "assembly"] as const).map((k) => (
            <div key={k} className="space-y-3.5 rounded-2xl border border-line bg-linen/60 p-3.5">
              <p className="font-semibold">{k === "custom" ? "Karta 1 · Mobilim me porosi" : "Karta 2 · Montim"}</p>
              <T p={["services", k, "kicker"]} label="Rreshti i vogël sipër" />
              <T p={["services", k, "title"]} label="Titulli" />
              <T p={["services", k, "text"]} label="Teksti" area />
              <L p={["services", k, "chips"]} label="Etiketat" />
              <T p={["services", k, "link"]} label="Lidhja" />
            </div>
          ))}
        </Section>

        <Section title="Montimi (animacioni)">
          <T p={["assembly", "eyebrow"]} label="Etiketa" />
          <T p={["assembly", "title"]} label="Titulli" hint={EM_HINT} />
          <Items
            p={["assembly", "steps"]}
            title={(i) => `Hapi ${i + 1}`}
            render={(b) => (
              <>
                <T p={[...b, "title"]} label="Titulli" />
                <T p={[...b, "text"]} label="Teksti" />
              </>
            )}
          />
        </Section>

        <Section title="Si punojmë (hapat)">
          <T p={["process", "eyebrow"]} label="Etiketa" />
          <T p={["process", "title"]} label="Titulli" hint={EM_HINT} />
          <T p={["process", "intro"]} label="Hyrja" area />
          <Items
            p={["process", "steps"]}
            title={(i) => `Hapi ${i + 1}`}
            make={step}
            min={1}
            max={8}
            addLabel="Shto hap"
            render={(b) => (
              <>
                <T p={[...b, "title"]} label="Titulli" />
                <T p={[...b, "text"]} label="Teksti" area />
                <M p={[...b, "media", "src"]} typePath={[...b, "media", "type"]} label="Foto ose video (opsionale)" accept="any" />
                {Boolean(getIn(content, [...b, "media", "src"])) && (
                  <>
                    {getIn(content, [...b, "media", "type"]) === "video" && <M p={[...b, "media", "poster"]} label="Kopertina e videos" accept="image" />}
                    <Sel
                      p={[...b, "media", "frame"]}
                      label="Si shfaqet"
                      options={[
                        { value: "plain", label: "Foto e thjeshtë" },
                        { value: "phone", label: "Në një telefon (për video vertikale)" },
                        { value: "chat", label: "Si mesazh nga klienti (screenshot)" },
                      ]}
                    />
                    <T p={[...b, "media", "caption"]} label={getIn(content, [...b, "media", "frame"]) === "chat" ? "Mesazhi i klientit" : "Përshkrimi"} />
                    {getIn(content, [...b, "media", "frame"]) === "chat" && <T p={[...b, "media", "reply"]} label="Përgjigjja jonë" />}
                    <T p={[...b, "media", "alt"]} label="Përshkrimi për lexuesit e ekranit" />
                  </>
                )}
              </>
            )}
          />
        </Section>

        <Section title="Materialet">
          <T p={["materials", "eyebrow"]} label="Etiketa" />
          <T p={["materials", "title"]} label="Titulli" hint={EM_HINT} />
          <T p={["materials", "text"]} label="Teksti" area />
          <Items
            p={["materials", "finishes"]}
            title={(i) => `Ngjyra ${i + 1}`}
            render={(b) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <T p={[...b, "name"]} label="Emri" />
                <T p={[...b, "note"]} label="Shënimi" />
              </div>
            )}
          />
        </Section>

        <Section title="Pse ne">
          <T p={["why", "eyebrow"]} label="Etiketa" />
          <T p={["why", "title"]} label="Titulli" hint={EM_HINT} />
          <Items
            p={["why", "reasons"]}
            title={(i) => `Arsyeja ${i + 1}`}
            render={(b) => (
              <>
                <T p={[...b, "title"]} label="Titulli" />
                <T p={[...b, "text"]} label="Teksti" area />
              </>
            )}
          />
        </Section>

        <Section title="Kontakti">
          <T p={["contactSection", "eyebrow"]} label="Etiketa" />
          <T p={["contactSection", "title"]} label="Titulli" />
          <T p={["contactSection", "text"]} label="Teksti" area />
          <div className="grid gap-4 sm:grid-cols-2">
            <T p={["contactSection", "phoneLabel"]} label="Etiketa e telefonit" />
            <T p={["contactSection", "whatsappLabel"]} label="Etiketa e WhatsApp" />
            <T p={["contactSection", "whatsappCta"]} label="Teksti i WhatsApp" />
            <T p={["contactSection", "tiktokLabel"]} label="Lidhja e TikTok" />
          </div>
          <p className="pt-2 font-semibold">Formulari</p>
          <T p={["contactSection", "formTitle"]} label="Titulli" />
          <T p={["contactSection", "formHint"]} label="Shpjegimi" />
          <div className="grid gap-4 sm:grid-cols-2">
            <T p={["contactSection", "nameLabel"]} label="Fusha e emrit" />
            <T p={["contactSection", "namePlaceholder"]} label="Shembulli i emrit" />
          </div>
          <T p={["contactSection", "nameError"]} label="Gabimi kur mungon emri" />
          <T p={["contactSection", "needLabel"]} label="Pyetja e zgjedhjes" />
          <L p={["contactSection", "needs"]} label="Zgjedhjet" />
          <div className="grid gap-4 sm:grid-cols-2">
            <T p={["contactSection", "messageLabel"]} label="Fusha e mesazhit" />
            <T p={["contactSection", "messageOptional"]} label="Shënimi “opsional”" />
          </div>
          <T p={["contactSection", "messagePlaceholder"]} label="Shembulli i mesazhit" />
          <T p={["contactSection", "submit"]} label="Butoni" />
          <div className="grid gap-4 sm:grid-cols-2">
            <T p={["contactSection", "callPrompt"]} label="Pyetja për telefon" />
            <T p={["contactSection", "callLink"]} label="Lidhja e telefonit" />
          </div>
        </Section>

        <Section title="Menuja, butonat dhe fundi i faqes">
          <div className="grid gap-4 sm:grid-cols-2">
            <T p={["nav", "services"]} label="Menu: Shërbimet" />
            <T p={["nav", "work"]} label="Menu: Punimet" />
            <T p={["nav", "assembly"]} label="Menu: Montimi" />
            <T p={["nav", "process"]} label="Menu: Si punojmë" />
            <T p={["nav", "materials"]} label="Menu: Materialet" />
            <T p={["nav", "contact"]} label="Menu: Kontakt" />
            <T p={["ui", "callShort"]} label="Butoni: Telefononi" />
            <T p={["ui", "callLong"]} label="Butoni: Na telefononi" />
            <T p={["ui", "whatsapp"]} label="Butoni: WhatsApp" />
            <T p={["ui", "menu"]} label="Titulli i menusë" />
            <T p={["footer", "pageLabel"]} label="Fundi: Faqja" />
            <T p={["footer", "contactLabel"]} label="Fundi: Kontakt" />
            <T p={["footer", "followLabel"]} label="Fundi: Na ndiqni" />
            <T p={["footer", "backToTop"]} label="Fundi: Lart" />
          </div>
        </Section>

        <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-between">
          <button type="button" onClick={reset} disabled={pending} className="rounded-full border border-copper/50 px-5 py-3 text-sm font-semibold text-copper">
            Rikthe përmbajtjen fillestare
          </button>
          <form action={logout}>
            <button type="submit" className="w-full rounded-full border border-line bg-paper px-5 py-3 text-sm font-semibold sm:w-auto">
              Dil
            </button>
          </form>
        </div>
      </main>
    </EditorCtx.Provider>
  );
}
