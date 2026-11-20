"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      className="flex items-center gap-2 rounded-full border border-border bg-paper px-4 py-2 text-wood-dark hover:bg-cream"
    >
      <LogOut className="size-4 rtl:rotate-180" aria-hidden="true" />
      {label}
    </button>
  );
}
