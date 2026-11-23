// Upload rules shared by the admin form and the upload routes.

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const;
export const ALLOWED_TYPES: readonly string[] = [...IMAGE_TYPES, ...VIDEO_TYPES];

export const MAX_UPLOAD_BYTES = 60 * 1024 * 1024; // 60 MB

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export const extFor = (type: string) => EXT[type];

export const isVideoSrc = (src: string) => /\.(mp4|webm|mov)(\?|$)/i.test(src);

/** A safe, readable file name: "Kuzhina e re (1).JPG" → "kuzhina-e-re-1" */
export function slugify(name: string) {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "skedar"
  );
}
