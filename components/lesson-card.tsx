import { Download, Maximize2, MessageCircle } from "lucide-react";
import type { Comment, Lesson } from "@/lib/db/schema";
import type { Dict } from "@/lib/i18n";
import { CommentForm } from "./comment-form";
import { DeleteCommentButton } from "./delete-comment-button";

function isImage(url: string) {
  return /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url);
}

export function LessonCard({
  lesson,
  comments,
  t,
  path,
  isAdmin,
}: {
  lesson: Lesson;
  comments: Comment[];
  t: Dict;
  path: string;
  isAdmin: boolean;
}) {
  return (
    <article className="wood-tile rounded-3xl p-1.5 shadow-md" aria-labelledby={`lesson-${lesson.id}`}>
      <div className="flex flex-col gap-5 rounded-[1.25rem] bg-paper p-5 sm:p-7">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="w-fit rounded-full bg-accent px-3 py-0.5 text-sm font-semibold text-paper">
              {t.week(lesson.week)}
            </span>
            <h2 id={`lesson-${lesson.id}`} className="font-display text-2xl text-wood-dark">
              {lesson.title}
            </h2>
            {lesson.description && <p className="leading-relaxed text-muted">{lesson.description}</p>}
          </div>
          {lesson.lessonUrl && (
            <a
              href={lesson.lessonUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={lesson.lessonName ?? true}
              className="flex items-center gap-2 rounded-full bg-wood-dark px-5 py-3 font-semibold text-paper transition-opacity hover:opacity-90"
            >
              <Download className="size-5" aria-hidden="true" />
              {t.downloadLesson}
            </a>
          )}
        </header>

        {lesson.mapUrl && (
          <figure className="flex flex-col gap-2">
            <figcaption className="font-semibold text-wood-dark">{t.mindMap}</figcaption>
            {isImage(lesson.mapUrl) ? (
              <a
                href={lesson.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-2xl border border-border bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- user-uploaded images of unknown dimensions */}
                <img
                  src={lesson.mapUrl}
                  alt={`${t.mindMap} – ${lesson.title}`}
                  loading="lazy"
                  className="max-h-[32rem] w-full object-contain"
                />
                <span className="absolute end-3 top-3 flex items-center gap-1 rounded-full bg-paper/90 px-3 py-1 text-sm text-wood-dark shadow">
                  <Maximize2 className="size-4" aria-hidden="true" />
                  {t.openMap}
                </span>
              </a>
            ) : (
              <a
                href={lesson.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-full border border-border px-4 py-2 text-wood-dark hover:bg-cream"
              >
                {t.openMap}
              </a>
            )}
          </figure>
        )}

        <details className="group rounded-2xl border border-border bg-cream/40 p-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-wood-dark">
            <MessageCircle className="size-5" aria-hidden="true" />
            {t.comments} ({comments.length})
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            {comments.length === 0 ? (
              <p className="text-sm text-muted">{t.noComments}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-xl bg-paper p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">{c.authorName}</p>
                      <div className="flex items-center gap-2">
                        <time className="text-xs text-muted" dateTime={c.createdAt.toISOString()}>
                          {c.createdAt.toLocaleDateString("fr-MA")}
                        </time>
                        {isAdmin && <DeleteCommentButton id={c.id} path={path} label={t.remove} />}
                      </div>
                    </div>
                    <p className="mt-1 whitespace-pre-line leading-relaxed text-foreground">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}
            <CommentForm lessonId={lesson.id} path={path} t={t} />
          </div>
        </details>
      </div>
    </article>
  );
}
