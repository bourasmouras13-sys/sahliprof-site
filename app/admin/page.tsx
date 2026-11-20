import { and, asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLessonRow } from "@/components/admin-lesson-row";
import { LessonForm } from "@/components/lesson-form";
import { SignOutButton } from "@/components/sign-out-button";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { LEVELS, SUBJECTS, getDict, getLang, isSubject, parseLevel } from "@/lib/i18n";

export const metadata: Metadata = { title: "Espace professeur", robots: { index: false } };

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const session = await getSession();
  if (!session?.user) redirect("/connexion");

  const sp = await searchParams;
  const level = parseLevel(String(sp.niveau ?? "1")) ?? 1;
  const subjectParam = String(sp.matiere ?? "arabe");
  const subject = isSubject(subjectParam) ? subjectParam : "arabe";

  const lang = await getLang();
  const t = getDict(lang);

  const list = await db
    .select()
    .from(lessons)
    .where(and(eq(lessons.level, level), eq(lessons.subject, subject)))
    .orderBy(asc(lessons.week));

  const nextWeek = list.length ? Math.max(...list.map((l) => l.week)) + 1 : 1;
  const isAr = lang === "ar";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-wood-dark">{t.admin}</h1>
          <p className="text-muted">{session.user.email}</p>
        </div>
        <SignOutButton label={t.signOut} />
      </div>

      <section className="flex flex-col gap-3" aria-label={t.chooseLevel}>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((l) => (
            <Link
              key={l}
              href={`/admin?niveau=${l}&matiere=${subject}`}
              aria-current={l === level ? "page" : undefined}
              dir="ltr"
              className={`rounded-full px-4 py-2 font-display transition-colors ${
                l === level ? "bg-wood-dark text-paper" : "border border-border bg-paper text-wood-dark hover:bg-cream"
              }`}
            >
              {t.levelShort(l)}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <Link
              key={s}
              href={`/admin?niveau=${level}&matiere=${s}`}
              aria-current={s === subject ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                s === subject ? "bg-accent text-paper" : "border border-border bg-paper text-wood-dark hover:bg-cream"
              }`}
            >
              {t.subjects[s]}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl text-wood-dark">
            {isAr ? "إضافة أسبوع جديد" : "Ajouter une semaine"}
          </h2>
          <LessonForm key={`${level}-${subject}-${nextWeek}`} level={level} subject={subject} defaultWeek={nextWeek} lang={lang} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl text-wood-dark">
            {t.weeks} – <span dir="ltr">{t.levelShort(level)}</span> · {t.subjects[subject]}
          </h2>
          {list.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-cream/50 p-8 text-center text-muted">
              {t.noLessons}
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {list.map((lesson) => (
                <AdminLessonRow key={lesson.id} lesson={lesson} lang={lang} />
              ))}
            </ul>
          )}
          <Link href={`/niveau/${level}/${subject}`} className="text-sm text-wood-dark underline underline-offset-4">
            {isAr ? "عرض الصفحة كما يراها الزوار" : "Voir la page publique"}
          </Link>
        </section>
      </div>
    </div>
  );
}
