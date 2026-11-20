import { BookOpen, LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { Dict, Lang } from "@/lib/i18n";
import { LangToggle } from "./lang-toggle";

export function SiteHeader({ lang, t }: { lang: Lang; t: Dict }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-cream/60 px-4 py-4 sm:px-10">
      <Link href="/" className="flex items-center gap-3">
        <span className="wood-tile flex size-11 items-center justify-center rounded-xl text-paper shadow-inner">
          <BookOpen className="size-6" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-display text-xl text-wood-dark sm:text-2xl">mouradsahli.taalim</span>
          <span className="text-xs text-muted">{t.siteName}</span>
        </span>
      </Link>
      <nav className="flex items-center gap-2" aria-label="Navigation">
        <LangToggle lang={lang} label={t.langSwitch} />
        <Link
          href="/admin"
          className="flex items-center gap-1.5 rounded-full border border-border bg-paper px-3 py-2 text-sm text-wood-dark transition-colors hover:bg-cream"
        >
          <LockKeyhole className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t.admin}</span>
          <span className="sr-only sm:hidden">{t.admin}</span>
        </Link>
      </nav>
    </header>
  );
}
