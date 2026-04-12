import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const epapersTable = pgTable("epapers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  edition: text("edition").notNull().default("Main Edition"),
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  pageCount: integer("page_count"),
  fileSize: text("file_size"),
  isPublished: boolean("is_published").notNull().default(true),
  publishDate: timestamp("publish_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEpaperSchema = createInsertSchema(epapersTable).omit({ id: true, createdAt: true });
export type InsertEpaper = z.infer<typeof insertEpaperSchema>;
export type Epaper = typeof epapersTable.$inferSelect;
