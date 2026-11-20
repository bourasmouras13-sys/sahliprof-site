"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

type Labels = { email: string; password: string; name: string; submit: string; error: string };

const inputClass =
  "rounded-xl border border-border bg-paper px-3 py-2.5 text-base text-foreground outline-none focus:border-wood";

export function AuthForm({ mode, t }: { mode: "setup" | "sign-in"; t: Labels }) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const result =
      mode === "setup"
        ? await authClient.signUp.email({ email, password, name: String(form.get("name") || "Mourad Sahli") })
        : await authClient.signIn.email({ email, password });

    setPending(false);
    if (result.error) {
      setError(true);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="wood-tile rounded-3xl p-1.5 shadow-md">
      <div className="flex flex-col gap-4 rounded-[1.25rem] bg-paper p-6">
        {mode === "setup" && (
          <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
            {t.name}
            <input name="name" autoComplete="name" defaultValue="Mourad Sahli" className={inputClass} />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
          {t.email}
          <input name="email" type="email" required autoComplete="email" dir="ltr" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
          {t.password}
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "setup" ? "new-password" : "current-password"}
            dir="ltr"
            className={inputClass}
          />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {t.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-wood-dark px-5 py-3 font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "…" : t.submit}
        </button>
      </div>
    </form>
  );
}
