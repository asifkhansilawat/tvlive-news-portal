import { Router } from "express";
import { db, epapersTable } from "@workspace/db";
import { desc, eq, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const [epapers, countResult] = await Promise.all([
      db.select().from(epapersTable).orderBy(desc(epapersTable.publishDate)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(epapersTable),
    ]);

    res.json({ epapers, total: countResult[0]?.count ?? 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, edition, fileUrl, thumbnailUrl, pageCount, fileSize, isPublished, publishDate } = req.body;
    if (!title || !fileUrl) {
      return res.status(400).json({ error: "title and fileUrl are required" });
    }

    const [epaper] = await db
      .insert(epapersTable)
      .values({
        title,
        edition: edition || "Main Edition",
        fileUrl,
        thumbnailUrl,
        pageCount,
        fileSize,
        isPublished: isPublished ?? true,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      })
      .returning();

    res.status(201).json(epaper);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    await db.delete(epapersTable).where(eq(epapersTable.id, id));
    res.json({ success: true, message: "Epaper deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
