"use client";

import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveLesson } from "@/app/actions";
import type { Lesson } from "@/lib/db/schema";
import type { Lang } from "@/lib/i18n";

const inputClass =
  "rounded-xl border border-border bg-paper px-3 py-2 text-base text-foreground outline-none focus:border-wood";

const L = {
  fr: {
    week: "Numéro de semaine",
    title: "Titre du cours",
    description: "Description (facultatif)",
    lessonFile: "Fichier du cours (PDF, PPT, PPTX, DOC)",
    mapFile: "Image de la carte mentale (PNG, JPG)",
    current: "Fichier actuel :",
    keep: "Laisser vide pour garder le fichier actuel.",
    removeFile: "Retirer ce fichier",
    save: "Enregistrer",
    uploading: "Envoi des fichiers…",
    saved: "Enregistré avec succès.",
    errors: {
      duplicate: "Cette semaine existe déjà pour ce niveau et cette matière.",
      title: "Le titre est obligatoire.",
      week: "Numéro de semaine invalide.",
      generic: "Une erreur est survenue. Réessayez.",
    } as Record<string, string>,
  },
  ar: {
    week: "رقم الأسبوع",
    title: "عنوان الدرس",
    description: "وصف (اختياري)",
    lessonFile: "ملف الدرس (PDF، PPT، PPTX، DOC)",
    mapFile: "صورة الخريطة الذهنية (PNG، JPG)",
    current: "الملف الحالي:",
    keep: "اتركه فارغا للاحتفاظ بالملف الحالي.",
    removeFile: "إزالة هذا الملف",
    save: "حفظ",
    uploading: "جار رفع الملفات…",
    saved: "تم الحفظ بنجاح.",
    errors: {
      duplicate: "هذا الأسبوع موجود مسبقا لهذا المستوى وهذه المادة.",
      title: "العنوان إجباري.",
      week: "رقم الأسبوع غير صالح.",
      generic: "حدث خطأ. حاول مرة أخرى.",
    } as Record<string, string>,
  },
};

function safeName(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(-120);
}

export function LessonForm({
  lesson,
  level,
  subject,
  defaultWeek,
  lang,
  onDone,
}: {
  lesson?: Lesson;
  level: number;
  subject: string;
  defaultWeek: number;
  lang: Lang;
  onDone?: () => void;
}) {
  const t = L[lang];
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "busy" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [keepLesson, setKeepLesson] = useState(Boolean(lesson?.lessonUrl));
  const [keepMap, setKeepMap] = useState(Boolean(lesson?.mapUrl));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    setStatus("busy");
    setError("");

    try {
      const folder = `cours/${level}AEP/${subject}`;
      const lessonFile = form.get("lessonFile") as File | null;
      const mapFile = form.get("mapFile") as File | null;

      let lessonUrl = keepLesson ? (lesson?.lessonUrl ?? null) : null;
      let lessonName = keepLesson ? (lesson?.lessonName ?? null) : null;
      let mapUrl = keepMap ? (lesson?.mapUrl ?? null) : null;

      if (lessonFile && lessonFile.size > 0) {
        const blob = await upload(`${folder}/${safeName(lessonFile.name)}`, lessonFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        lessonUrl = blob.url;
        lessonName = lessonFile.name;
      }
      if (mapFile && mapFile.size > 0) {
        const blob = await upload(`${folder}/cartes/${safeName(mapFile.name)}`, mapFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        mapUrl = blob.url;
      }

      const result = await saveLesson({
        id: lesson?.id,
        level,
        subject,
        week: Number(form.get("week")),
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        lessonUrl,
        lessonName,
        mapUrl,
      });

      if (!result.ok) {
        setStatus("error");
        setError(t.errors[result.error ?? ""] ?? t.errors.generic);
        return;
      }
      setStatus("saved");
      if (!lesson) formEl.reset();
      router.refresh();
      onDone?.();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setError(t.errors.generic);
    }
  }

  return (
    <form onSubmit={onSubmit} className="wood-tile rounded-3xl p-1.5 shadow-md">
      <div className="flex flex-col gap-4 rounded-[1.25rem] bg-paper p-5">
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
            {t.week}
            <input
              name="week"
              type="number"
              min={1}
              max={52}
              required
              defaultValue={defaultWeek}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
            {t.title}
            <input name="title" required maxLength={200} defaultValue={lesson?.title} className={inputClass} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
          {t.description}
          <textarea
            name="description"
            rows={2}
            maxLength={2000}
            defaultValue={lesson?.description ?? ""}
            className={inputClass}
          />
        </label>

        <fieldset className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
          <label className="flex flex-col gap-1">
            {t.lessonFile}
            <input
              name="lessonFile"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              className="rounded-xl border border-dashed border-border bg-cream/40 p-2 text-sm file:me-3 file:rounded-full file:border-0 file:bg-wood-dark file:px-4 file:py-1.5 file:text-paper"
            />
          </label>
          {keepLesson && lesson?.lessonUrl && (
            <p className="flex flex-wrap items-center gap-2 text-xs font-normal text-muted">
              {t.current} {lesson.lessonName} · {t.keep}
              <button type="button" onClick={() => setKeepLesson(false)} className="text-red-700 underline">
                {t.removeFile}
              </button>
            </p>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-1 text-sm font-medium text-wood-dark">
          <label className="flex flex-col gap-1">
            {t.mapFile}
            <input
              name="mapFile"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="rounded-xl border border-dashed border-border bg-cream/40 p-2 text-sm file:me-3 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-1.5 file:text-paper"
            />
          </label>
          {keepMap && lesson?.mapUrl && (
            <p className="flex flex-wrap items-center gap-2 text-xs font-normal text-muted">
              {t.current} ✓ · {t.keep}
              <button type="button" onClick={() => setKeepMap(false)} className="text-red-700 underline">
                {t.removeFile}
              </button>
            </p>
          )}
        </fieldset>

        <div aria-live="polite" className="text-sm">
          {status === "busy" && <p className="text-muted">{t.uploading}</p>}
          {status === "saved" && <p className="text-accent">{t.saved}</p>}
          {status === "error" && <p className="text-red-700">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={status === "busy"}
          className="rounded-full bg-wood-dark px-5 py-3 font-semibold text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "busy" ? t.uploading : t.save}
        </button>
      </div>
    </form>
  );
}
