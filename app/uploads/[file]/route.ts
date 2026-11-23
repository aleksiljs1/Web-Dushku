import { promises as fs } from "node:fs";
import path from "node:path";

// Local development fallback: `next start` only serves files that were in
// public/ when it started, so photos uploaded from /admin afterwards are read
// from public/uploads here. On Vercel uploads live in Blob and this is unused.
const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};

export async function GET(_req: Request, ctx: RouteContext<"/uploads/[file]">) {
  const { file } = await ctx.params;
  const m = /^[a-z0-9-]+\.(jpg|png|webp|avif|mp4|webm|mov)$/.exec(file);
  if (!m || process.env.VERCEL) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(process.cwd(), "public", "uploads", file));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": TYPES[m[1]], "Cache-Control": "public, max-age=0", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
