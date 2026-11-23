import { redirect } from "next/navigation";
import { isAdmin } from "@/src/lib/admin-session";
import { authConfigured } from "@/src/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "Hyrje" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-16">
      <p className="text-xs font-semibold tracking-[0.25em] text-copper uppercase">Paneli i faqes</p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight">Hyni për të ndryshuar faqen</h1>
      {!authConfigured() && (
        <p className="mt-6 rounded-2xl border border-copper/40 bg-paper p-4 text-sm text-ink-soft">
          Paneli nuk është konfiguruar ende. Vendosni <code>ADMIN_PASSWORD</code> dhe <code>ADMIN_SECRET</code> (të paktën 16 shkronja) te
          variablat e mjedisit dhe ribëni deploy.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
