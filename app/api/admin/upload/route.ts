import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/src/lib/admin-session";
import { ALLOWED_TYPES, MAX_UPLOAD_BYTES } from "@/src/lib/media-rules";

// Hands the browser a short-lived token so photos and videos go straight to
// Vercel Blob, around the 4.5 MB request limit of serverless functions.
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Nuk jeni i identifikuar." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Vercel Blob nuk është lidhur me projektin." }, { status: 500 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^uploads\/[a-z0-9-]+\.(jpg|png|webp|avif|mp4|webm|mov)$/.test(pathname)) {
          throw new Error("Emër skedari i pavlefshëm.");
        }
        return {
          allowedContentTypes: [...ALLOWED_TYPES],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 30 * 60 * 1000,
        };
      },
      // No onUploadCompleted: the admin form saves the returned URL itself,
      // so Vercel never needs to call back into this (protected) route.
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
