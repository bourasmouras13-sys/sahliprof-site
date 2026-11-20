"use client";

import { FileText, ImageIcon, Pencil, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "@/app/actions";
import type { Lesson } from "@/lib/db/schema";
import type { Lang } from "@/lib/i18n";
import { LessonForm } from "./lesson-form";

export function AdminLessonRow({ lesson, lang }: { lesson: Lesson; lang: Lang }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const isAr = lang === "ar";

  return (
    <li className="rounded-2xl border border-border bg-paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-accent">
            {isAr ? `الأسبوع ${lesson.week}` : `Semaine ${lesson.week}`}
          </span>
          <span className="font-semibold text-foreground">{lesson.title}</span>
          <span className="flex gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <FileText className="size-3.5" aria-hidden="true" />
              {lesson.lessonUrl ? lesson.lessonName ?? "OK" : "—"}
            </span>
            <span className="flex items-center gap-1">
              <ImageIcon className="size-3.5" aria-hidden="true" />
              {lesson.mapUrl ? "OK" : "—"}
            </span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-wood-dark hover:bg-cream"
          >
            {editing ? <X className="size-4" aria-hidden="true" /> : <Pencil className="size-4" aria-hidden="true" />}
            {editing ? (isAr ? "إغلاق" : "Fermer") : isAr ? "تعديل" : "Modifier"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm(isAr ? "حذف هذا الأسبوع؟" : "Supprimer cette semaine ?")) {
                startTransition(() => deleteLesson(lesson.id));
              }
            }}
            className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            {isAr ? "حذف" : "Supprimer"}
          </button>
        </div>
      </div>
      {editing && (
        <div className="mt-4">
          <LessonForm
            lesson={lesson}
            level={lesson.level}
            subject={lesson.subject}
            defaultWeek={lesson.week}
            lang={lang}
            onDone={() => setEditing(false)}
          />
        </div>
      )}
    </li>
  );
}
