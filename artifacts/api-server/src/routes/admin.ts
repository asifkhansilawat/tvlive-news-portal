import { Router } from "express";
import { db, articlesTable, categoriesTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";

const router = Router();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      res.json({ success: true, token: "admin-token-" + Date.now(), message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [totalResult, publishedResult, draftResult, categoryResult, viewResult, recentArticles] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(articlesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(articlesTable).where(eq(articlesTable.isPublished, true)),
      db.select({ count: sql<number>`count(*)::int` }).from(articlesTable).where(eq(articlesTable.isPublished, false)),
      db.select({ count: sql<number>`count(*)::int` }).from(categoriesTable),
      db.select({ total: sql<number>`coalesce(sum(${articlesTable.viewCount}), 0)::int` }).from(articlesTable),
      db
        .select({
          id: articlesTable.id,
          title: articlesTable.title,
          slug: articlesTable.slug,
          summary: articlesTable.summary,
          content: articlesTable.content,
          imageUrl: articlesTable.imageUrl,
          categoryId: articlesTable.categoryId,
          categoryName: categoriesTable.name,
          author: articlesTable.author,
          isPublished: articlesTable.isPublished,
          isFeatured: articlesTable.isFeatured,
          viewCount: articlesTable.viewCount,
          publishedAt: articlesTable.publishedAt,
          createdAt: articlesTable.createdAt,
          updatedAt: articlesTable.updatedAt,
        })
        .from(articlesTable)
        .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
        .orderBy(desc(articlesTable.createdAt))
        .limit(5),
    ]);

    res.json({
      totalArticles: totalResult[0]?.count ?? 0,
      publishedArticles: publishedResult[0]?.count ?? 0,
      draftArticles: draftResult[0]?.count ?? 0,
      totalCategories: categoryResult[0]?.count ?? 0,
      totalViews: viewResult[0]?.total ?? 0,
      recentArticles,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/articles", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string | undefined;

    let whereClause = undefined;
    if (status === "published") {
      whereClause = eq(articlesTable.isPublished, true);
    } else if (status === "draft") {
      whereClause = eq(articlesTable.isPublished, false);
    }

    const [articles, countResult] = await Promise.all([
      db
        .select({
          id: articlesTable.id,
          title: articlesTable.title,
          slug: articlesTable.slug,
          summary: articlesTable.summary,
          content: articlesTable.content,
          imageUrl: articlesTable.imageUrl,
          categoryId: articlesTable.categoryId,
          categoryName: categoriesTable.name,
          author: articlesTable.author,
          isPublished: articlesTable.isPublished,
          isFeatured: articlesTable.isFeatured,
          viewCount: articlesTable.viewCount,
          publishedAt: articlesTable.publishedAt,
          createdAt: articlesTable.createdAt,
          updatedAt: articlesTable.updatedAt,
        })
        .from(articlesTable)
        .leftJoin(categoriesTable, eq(articlesTable.categoryId, categoriesTable.id))
        .where(whereClause)
        .orderBy(desc(articlesTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(articlesTable).where(whereClause),
    ]);

    res.json({ articles, total: countResult[0]?.count ?? 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
