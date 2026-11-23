import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { del, get, put } from "@vercel/blob";
import { mergeContent, type Content } from "@/src/content/schema";

// Where the edited page lives:
// - on Vercel, a JSON document in Vercel Blob (BLOB_READ_WRITE_TOKEN is set when
//   a Blob store is connected to the project);
// - locally without a token, .data/site.json (gitignored).

const BLOB_PATH = "content/site.json";
const LOCAL_FILE = path.join(process.cwd(), ".data", "site.json");

export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readStored(): Promise<unknown> {
  try {
    if (blobEnabled()) {
      // Straight from origin, so a save shows up on the very next render
      const res = await get(BLOB_PATH, { access: "public", useCache: false });
      if (!res || res.statusCode !== 200) return null;
      return JSON.parse(await new Response(res.stream).text());
    }
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException)?.code !== "ENOENT" && (err as Error)?.name !== "BlobNotFoundError") {
      console.error("[content] could not read stored content, using defaults:", (err as Error)?.message);
    }
    return null;
  }
}

/** The page content for this request: stored edits merged over the defaults. */
export const getContent = cache(async (): Promise<Content> => mergeContent(await readStored()));

export async function writeContent(content: Content) {
  const json = JSON.stringify(content, null, 2);
  if (blobEnabled()) {
    await put(BLOB_PATH, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, json, "utf8");
}

/** Forget every edit: the page goes back to the defaults in the code. */
export async function clearContent() {
  if (blobEnabled()) {
    await del(BLOB_PATH).catch(() => {});
    return;
  }
  await fs.rm(LOCAL_FILE, { force: true });
}
