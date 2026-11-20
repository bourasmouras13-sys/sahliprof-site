import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { countUsers, getSession } from "@/lib/auth";
import { getDict, getLang } from "@/lib/i18n";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default async function SignInPage() {
  const session = await getSession();
  if (session?.user) redirect("/admin");

  const [lang, users] = await Promise.all([getLang(), countUsers()]);
  const t = getDict(lang);
  const mode = users === 0 ? "setup" : "sign-in";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-3xl text-wood-dark">{mode === "setup" ? t.createAccount : t.signIn}</h1>
        <p className="text-muted">{mode === "setup" ? t.setupHint : t.signInHint}</p>
      </div>
      <AuthForm
        mode={mode}
        t={{
          email: t.email,
          password: t.password,
          name: t.name,
          submit: mode === "setup" ? t.createAccount : t.signIn,
          error: t.authError,
        }}
      />
    </div>
  );
}
