import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-paper px-4 py-2 text-sm text-wood-dark transition-colors hover:bg-cream"
    >
      <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
      {label}
    </Link>
  );
}
