// Admin session: one password (ADMIN_PASSWORD), one signed cookie.
// The cookie holds an expiry time and an HMAC-SHA256 of it keyed with
// ADMIN_SECRET, so it can't be forged or extended. Web Crypto only, so the same
// code runs in proxy.ts, route handlers and server actions.

export const SESSION_COOKIE = "md_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const enc = new TextEncoder();

export function authConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD) && (process.env.ADMIN_SECRET?.length ?? 0) >= 16;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(process.env.ADMIN_SECRET ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function equalBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/** Constant-time: both sides are hashed to the same length before comparing. */
export async function checkPassword(input: string) {
  if (!authConfigured()) return false;
  const [a, b] = await Promise.all([hmac(`pw:${input}`), hmac(`pw:${process.env.ADMIN_PASSWORD}`)]);
  return equalBytes(a, b);
}

export async function createSessionValue() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  return `${exp}.${b64url(await hmac(`session:${exp}`))}`;
}

export async function verifySessionValue(value: string | undefined | null) {
  if (!value || !authConfigured()) return false;
  const [expStr, sig] = value.split(".");
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !sig || exp < Date.now() / 1000) return false;
  const expected = b64url(await hmac(`session:${exp}`));
  return equalBytes(enc.encode(expected), enc.encode(sig));
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

// A little brake on password guessing: per server instance, by IP.
const attempts = new Map<string, { fails: number; until: number }>();
const MAX_FAILS = 5;
const LOCK_MS = 10 * 60 * 1000;

export function loginLocked(ip: string) {
  const a = attempts.get(ip);
  if (!a) return false;
  if (a.until && a.until < Date.now()) {
    attempts.delete(ip);
    return false;
  }
  return a.fails >= MAX_FAILS;
}

export function recordLoginFailure(ip: string) {
  const a = attempts.get(ip) ?? { fails: 0, until: 0 };
  a.fails += 1;
  a.until = Date.now() + LOCK_MS;
  attempts.set(ip, a);
  if (attempts.size > 5000) attempts.clear();
}

export function clearLoginFailures(ip: string) {
  attempts.delete(ip);
}
