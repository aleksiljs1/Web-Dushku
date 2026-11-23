"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  SESSION_COOKIE,
  authConfigured,
  checkPassword,
  clearLoginFailures,
  createSessionValue,
  loginLocked,
  recordLoginFailure,
  sessionCookieOptions,
} from "@/src/lib/auth";
import { isAdmin } from "@/src/lib/admin-session";
import { clearContent, writeContent } from "@/src/lib/content-store";
import { mergeContent, type Content } from "@/src/content/schema";

export type LoginState = { error?: string };

async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!authConfigured()) {
    return { error: "Paneli nuk është konfiguruar: mungojnë ADMIN_PASSWORD ose ADMIN_SECRET (të paktën 16 shkronja)." };
  }
  const ip = await clientIp();
  if (loginLocked(ip)) return { error: "Shumë përpjekje. Provoni përsëri pas 10 minutash." };

  const password = String(formData.get("password") ?? "").slice(0, 200);
  if (!(await checkPassword(password))) {
    recordLoginFailure(ip);
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Fjalëkalimi nuk është i saktë." };
  }

  clearLoginFailures(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionValue(), sessionCookieOptions);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export type SaveResult = { ok: true; content: Content } | { ok: false; error: string };

function refreshSite() {
  // The whole public site reads this content (layout, page, link preview)
  revalidatePath("/", "layout");
}

export async function saveContent(input: unknown): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "Seanca ka skaduar. Hyni përsëri." };
  try {
    const content = mergeContent(input);
    await writeContent(content);
    refreshSite();
    return { ok: true, content };
  } catch (err) {
    console.error("[admin] save failed:", err);
    return { ok: false, error: "Ruajtja dështoi. Provoni përsëri pas pak." };
  }
}

export async function resetContent(): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, error: "Seanca ka skaduar. Hyni përsëri." };
  try {
    await clearContent();
    refreshSite();
    return { ok: true, content: mergeContent(null) };
  } catch (err) {
    console.error("[admin] reset failed:", err);
    return { ok: false, error: "Rikthimi dështoi. Provoni përsëri pas pak." };
  }
}
