"use client";

import { Languages } from "lucide-react";
import { useTransition } from "react";
import { setLang } from "@/app/actions";
import type { Lang } from "@/lib/i18n";

export function LangToggle({ lang, label }: { lang: Lang; label: string }) {
  const [pending, startTransition] = useTransition();
  const next: Lang = lang === "ar" ? "fr" : "ar";

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setLang(next))}
      lang={next}
      className="flex items-center gap-1.5 rounded-full bg-wood-dark px-4 py-2 text-sm font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <Languages className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
