"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 rounded-[1.75rem] bg-paper p-6 shadow-[0_1px_0_var(--line)]">
      <label htmlFor="password" className="block text-sm font-semibold">
        Fjalëkalimi
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        autoFocus
        className="mt-2 w-full rounded-xl border border-line bg-linen px-4 py-3.5 text-base outline-none focus:border-copper"
      />
      {state.error && (
        <p role="alert" className="mt-3 text-sm font-medium text-copper">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-full bg-ink px-6 py-4 font-semibold text-paper transition-colors hover:bg-walnut disabled:opacity-60"
      >
        {pending ? "Duke hyrë…" : "Hyr"}
      </button>
    </form>
  );
}
