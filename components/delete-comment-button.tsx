"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteComment } from "@/app/actions";

export function DeleteCommentButton({ id, path, label }: { id: number; path: string; label: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => deleteComment(id, path))}
      className="rounded-full p-1 text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="size-4" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
