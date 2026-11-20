import type { Dict } from "@/lib/i18n";

export function SiteFooter({ t }: { t: Dict }) {
  return (
    <footer className="border-t border-border bg-cream/60 px-4 py-5 text-center text-sm text-muted sm:px-10">
      <p className="font-display text-wood-dark">mouradsahli.taalim</p>
      <p>{t.footer}</p>
    </footer>
  );
}
