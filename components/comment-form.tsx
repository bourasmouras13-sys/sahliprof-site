"use client";

import { useActionState } from "react";
import { addComment, type CommentState } from "@/app/actions";
import type { Dict } from "@/lib/i18n";

type Labels = Pick<Dict, "yourName" | "yourComment" | "send" | "sending" | "commentError">;

export function CommentForm({ lessonId, path, t }: { lessonId: number; path: string; t: Labels }) {
  const [state, formAction, pending] = useActionState<CommentState, FormData>(addComment, { ok: false });

  return (
    <form key={state.nonce ?? 0} action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="path" value={path} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
        {t.yourName}
        <input
          name="authorName"
          required
          maxLength={60}
          className="rounded-xl border border-border bg-paper px-3 py-2 text-base text-foreground outline-none focus:border-wood"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
        {t.yourComment}
        <textarea
          name="body"
          required
          maxLength={1000}
          rows={3}
          className="rounded-xl border border-border bg-paper px-3 py-2 text-base text-foreground outline-none focus:border-wood"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-red-700">
          {t.commentError}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-accent px-5 py-2 font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t.sending : t.send}
      </button>
    </form>
  );
}
