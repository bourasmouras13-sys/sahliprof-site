"use server";

import { del } from "@vercel/blob";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { comments, lessons } from "@/lib/db/schema";
import { isSubject } from "@/lib/i18n";

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

function isBlobUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2000) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function safeDelete(url: string | null | undefined) {
  if (!url) return;
  try {
    await del(url);
  } catch (error) {
    console.error("Blob delete failed:", error);
  }
}

export async function setLang(lang: "fr" | "ar") {
  const store = await cookies();
  store.set("lang", lang === "ar" ? "ar" : "fr", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}

export type CommentState = { ok: boolean; error?: boolean; nonce?: number };

export async function addComment(_prev: CommentState, formData: FormData): Promise<CommentState> {
  if (formData.get("website")) return { ok: true, nonce: Date.now() };

  const lessonId = Number(formData.get("lessonId"));
  const authorName = String(formData.get("authorName") ?? "").trim().slice(0, 60);
  const body = String(formData.get("body") ?? "").trim().slice(0, 1000);
  const path = String(formData.get("path") ?? "/");

  if (!Number.isInteger(lessonId) || !authorName || !body) return { ok: false, error: true };

  const [lesson] = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  if (!lesson) return { ok: false, error: true };

  await db.insert(comments).values({ lessonId, authorName, body });
  if (path.startsWith("/niveau/")) revalidatePath(path);
  return { ok: true, nonce: Date.now() };
}

export async function deleteComment(id: number, path: string) {
  await requireAdmin();
  await db.delete(comments).where(eq(comments.id, id));
  if (path.startsWith("/niveau/")) revalidatePath(path);
}

export type LessonInput = {
  id?: number;
  level: number;
  subject: string;
  week: number;
  title: string;
  description?: string;
  lessonUrl?: string | null;
  lessonName?: string | null;
  mapUrl?: string | null;
};

export async function saveLesson(input: LessonInput): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();

  const level = Number(input.level);
  const week = Number(input.week);
  const title = String(input.title ?? "").trim().slice(0, 200);
  const description = String(input.description ?? "").trim().slice(0, 2000) || null;

  if (!Number.isInteger(level) || level < 1 || level > 6) return { ok: false, error: "level" };
  if (!isSubject(input.subject)) return { ok: false, error: "subject" };
  if (!Number.isInteger(week) || week < 1 || week > 52) return { ok: false, error: "week" };
  if (!title) return { ok: false, error: "title" };

  const lessonUrl = input.lessonUrl && isBlobUrl(input.lessonUrl) ? input.lessonUrl : null;
  const lessonName = lessonUrl ? String(input.lessonName ?? "").slice(0, 200) || null : null;
  const mapUrl = input.mapUrl && isBlobUrl(input.mapUrl) ? input.mapUrl : null;

  const duplicate = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(
      and(
        eq(lessons.level, level),
        eq(lessons.subject, input.subject),
        eq(lessons.week, week),
        ...(input.id ? [ne(lessons.id, input.id)] : []),
      ),
    )
    .limit(1);
  if (duplicate.length) return { ok: false, error: "duplicate" };

  const values = { level, subject: input.subject, week, title, description, lessonUrl, lessonName, mapUrl };

  if (input.id) {
    const [existing] = await db.select().from(lessons).where(eq(lessons.id, input.id)).limit(1);
    if (!existing) return { ok: false, error: "missing" };
    await db.update(lessons).set({ ...values, updatedAt: new Date() }).where(eq(lessons.id, input.id));
    if (existing.lessonUrl && existing.lessonUrl !== lessonUrl) await safeDelete(existing.lessonUrl);
    if (existing.mapUrl && existing.mapUrl !== mapUrl) await safeDelete(existing.mapUrl);
    revalidatePath(`/niveau/${existing.level}/${existing.subject}`);
  } else {
    await db.insert(lessons).values(values);
  }

  revalidatePath(`/niveau/${level}/${input.subject}`);
  revalidatePath(`/niveau/${level}`);
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteLesson(id: number) {
  await requireAdmin();
  const [existing] = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  if (!existing) return;
  await db.delete(comments).where(eq(comments.lessonId, id));
  await db.delete(lessons).where(eq(lessons.id, id));
  await safeDelete(existing.lessonUrl);
  await safeDelete(existing.mapUrl);
  revalidatePath(`/niveau/${existing.level}/${existing.subject}`);
  revalidatePath(`/niveau/${existing.level}`);
  revalidatePath("/admin");
}
