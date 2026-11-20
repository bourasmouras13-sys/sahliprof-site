import { and, asc, eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { LessonCard } from "@/components/lesson-card";
import { SubjectIcon } from "@/components/subject-icon";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { comments, lessons, type Comment } from "@/lib/db/schema";
import { getDict, getLang, isSubject, parseLevel } from "@/lib/i18n";

export default async function SubjectPage({ params }: PageProps<"/niveau/[level]/[subject]">) {
  const p = await params;
  const level = parseLevel(p.level);
  if (!level || !isSubject(p.subject)) notFound();
  const subject = p.subject;

  const [lang, session] = await Promise.all([getLang(), getSession()]);
  const t = getDict(lang);

  const list = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.level, level), eq(lessons.subject, subject)))
    .orderBy(asc(lessons.week));

  const allComments = list.length
    ? await db
        .select()
        .from(comments)
        .where(
          inArray(
            comments.lessonId,
            list.map((l) => l.id),
          ),
        )
        .orderBy(asc(comments.createdAt))
    : [];

  const byLesson = new Map<number, Comment[]>();
  for (const c of allComments) byLesson.set(c.lessonId, [...(byLesson.get(c.lessonId) ?? []), c]);

  const path = `/niveau/${level}/${subject}`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="wood-tile flex size-14 items-center justify-center rounded-2xl text-paper shadow-md">
            <SubjectIcon subject={subject} className="size-7" />
          </span>
          <div>
            <p className="text-sm text-accent">
              <span dir="ltr">{t.levelShort(level)}</span> · {t.levelLong(level)}
            </p>
            <h1 className="font-display text-3xl text-wood-dark">{t.subjects[subject]}</h1>
          </div>
        </div>
        <BackLink href={`/niveau/${level}`} label={t.back} />
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-cream/50 p-10 text-center text-muted">
          {t.noLessons}
        </p>
      ) : (
        <ol className="flex flex-col gap-6">
          {list.map((lesson) => (
            <li key={lesson.id}>
              <LessonCard
                lesson={lesson}
                comments={byLesson.get(lesson.id) ?? []}
                t={t}
                path={path}
                isAdmin={Boolean(session?.user)}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
