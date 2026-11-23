import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionValue } from "./auth";

/** Every admin action and route calls this itself; proxy.ts is only the first gate. */
export async function isAdmin() {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
}
