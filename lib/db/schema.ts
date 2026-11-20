import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  level: integer("level").notNull(),
  subject: text("subject").notNull(),
  week: integer("week").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  lessonUrl: text("lessonUrl"),
  lessonName: text("lessonName"),
  mapUrl: text("mapUrl"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  lessonId: integer("lessonId").notNull(),
  authorName: text("authorName").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type Lesson = typeof lessons.$inferSelect;
export type Comment = typeof comments.$inferSelect;
