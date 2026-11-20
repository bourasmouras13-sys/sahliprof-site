import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { SubjectIcon } from "@/components/subject-icon";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { SUBJECTS, getDict, getLang, parseLevel } from "@/lib/i18n";

export default async function LevelPage({ params }: PageProps<"/niveau/[level]">) {
  const level = parseLevel((await params).level);
  if (!level) notFound();

  const t = getDict(await getLang());
  const rows = await db
    .select({ subject: lessons.subject, n: count() })
    .from(lessons)
    .where(eq(lessons.level, level))
    .groupBy(lessons.subject);
  const counts = new Map(rows.map((r) => [r.subject, Number(r.n)]));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-lg text-accent" dir="ltr">
            {t.levelShort(level)}
          </p>
          <h1 className="font-display text-3xl text-wood-dark">{t.levelLong(level)}</h1>
        </div>
        <BackLink href="/" label={t.home} />
      </div>

      <h2 className="text-lg font-semibold text-muted">{t.chooseSubject}</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {SUBJECTS.map((subject) => (
          <li key={subject}>
            <Link
              href={`/niveau/${level}/${subject}`}
              className="wood-tile flex rounded-2xl p-1.5 shadow-md transition-transform hover:-translate-y-1"
            >
              <span className="flex w-full items-center gap-4 rounded-xl bg-paper p-5">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-cream text-wood-dark">
                  <SubjectIcon subject={subject} className="size-7" />
                </span>
                <span className="flex flex-col">
                  <span className="font-display text-xl text-wood-dark">{t.subjects[subject]}</span>
                  <span className="text-sm text-muted">{t.lessonsCount(counts.get(subject) ?? 0)}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
