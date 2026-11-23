import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { isAdmin } from "@/src/lib/admin-session";
import { ALLOWED_TYPES, MAX_UPLOAD_BYTES, extFor, slugify } from "@/src/lib/media-rules";

// Local development only: without a Blob token, uploads land in public/uploads
// (gitignored). On Vercel the filesystem is read-only, so this refuses to run.
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Nuk jeni i identifikuar." }, { status: 401 });
  }
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL) {
    return NextResponse.json({ error: "Përdorni ngarkimin me Vercel Blob." }, { status: 400 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Nuk u gjet skedari." }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Lloj skedari i palejuar." }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Skedari është shumë i madh." }, { status: 400 });

  const name = `${slugify(file.name)}-${randomBytes(4).toString("hex")}.${extFor(file.type)}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/uploads/${name}` });
}
