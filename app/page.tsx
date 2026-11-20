import Image from "next/image";
import Link from "next/link";
import { count } from "drizzle-orm";
import { db } from "@/lib/db";
import { lessons } from "@/lib/db/schema";
import { LEVELS, getDict, getLang } from "@/lib/i18n";

export default async function HomePage() {
  const lang = await getLang();
  const t = getDict(lang);

  const rows = await db.select({ level: lessons.level, n: count() }).from(lessons).groupBy(lessons.level);
  const counts = new Map(rows.map((r) => [r.level, Number(r.n)]));

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex flex-1 flex-col gap-4 text-center md:text-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{t.siteName}</p>
          <h1 className="font-display text-3xl leading-tight text-wood-dark text-balance sm:text-4xl">{t.tagline}</h1>
          <p className="text-lg leading-relaxed text-muted text-pretty">{t.heroText}</p>
        </div>
        <div className="wood-tile w-full max-w-sm flex-1 rounded-3xl p-3 shadow-lg">
          <Image
            src="/images/hero.png"
            alt=""
            width={640}
            height={640}
            priority
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      <section aria-labelledby="levels-title" className="flex flex-col gap-6">
        <h2 id="levels-title" className="font-display text-2xl text-wood-dark">
          {t.chooseLevel}
        </h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {LEVELS.map((level) => (
            <li key={level}>
              <Link
                href={`/niveau/${level}`}
                className="wood-tile group flex h-full flex-col items-center gap-2 rounded-2xl p-1.5 shadow-md transition-transform hover:-translate-y-1"
              >
                <span className="flex w-full flex-1 flex-col items-center gap-1 rounded-xl bg-paper px-3 py-6 text-center">
                  <span className="font-display text-4xl text-wood-dark sm:text-5xl" dir="ltr">
                    {t.levelShort(level)}
                  </span>
                  <span className="font-semibold text-foreground">{t.levelLong(level)}</span>
                  <span className="mt-1 rounded-full bg-cream px-3 py-0.5 text-xs text-muted">
                    {t.lessonsCount(counts.get(level) ?? 0)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
