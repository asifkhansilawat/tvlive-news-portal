import { Router } from "express";
import { db, categoriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { articlesTable } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
        color: categoriesTable.color,
        articleCount: sql<number>`count(${articlesTable.id})::int`,
      })
      .from(categoriesTable)
      .leftJoin(
        articlesTable,
        eq(articlesTable.categoryId, categoriesTable.id)
      )
      .groupBy(categoriesTable.id, categoriesTable.name, categoriesTable.slug, categoriesTable.color);

    res.json({ categories });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) {
      res.status(400).json({ error: "name is required" }); return;
    }
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [category] = await db
      .insert(categoriesTable)
      .values({ name, slug, color: color || "#e53935" })
      .returning();
    res.status(201).json({ ...category, articleCount: 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
