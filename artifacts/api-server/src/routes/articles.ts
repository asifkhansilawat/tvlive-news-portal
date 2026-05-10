import { Router } from "express";
import { db, articlesTable, categoriesTable } from "@workspace/db";
import { eq, desc, ilike, and, sql, or } from "drizzle-orm";

const router = Router();

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .substring(0, 100) + "-" + Date.now();
}

async function getArticleWithCategory(id: number) {
  const result = await db
    .select({
      id: articlesTable.id,
      title: articlesTable.title,
      slug: articlesTable.slug,
      summary: articlesTable.summary,
      content: articlesTable.content,
      imageUrl: articlesTable.imageUrl,
      videoUrl: articlesTable.videoUrl,
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
    .where(eq(articlesTable.id, id))
    .limit(1);
  return result[0] || null;
}

router.get("/featured", async (req, res) => {
  try {
    const articles = await db
      .select({
        id: articlesTable.id,
        title: articlesTable.title,
        slug: articlesTable.slug,
        summary: articlesTable.summary,
        content: articlesTable.content,
        imageUrl: articlesTable.imageUrl,
        videoUrl: articlesTable.videoUrl,
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
      .where(and(eq(articlesTable.isPublished, true), eq(articlesTable.isFeatured, true)))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(5);

    res.json({ articles, total: articles.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const articles = await db
      .select({
        id: articlesTable.id,
        title: articlesTable.title,
        slug: articlesTable.slug,
        summary: articlesTable.summary,
        content: articlesTable.content,
        imageUrl: articlesTable.imageUrl,
        videoUrl: articlesTable.videoUrl,
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
      .where(eq(articlesTable.isPublished, true))
      .orderBy(desc(articlesTable.publishedAt))
      .limit(limit);

    res.json({ articles, total: articles.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const article = await getArticleWithCategory(id);
    if (!article) { res.status(404).json({ error: "Article not found" }); return; }

    await db
      .update(articlesTable)
      .set({ viewCount: sql`${articlesTable.viewCount} + 1` })
      .where(eq(articlesTable.id, id));

    res.json(article);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const { title, summary, content, imageUrl, videoUrl, categoryId, author, isPublished, isFeatured } = req.body;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (title !== undefined) updateData.title = title;
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (author !== undefined) updateData.author = author;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished) updateData.publishedAt = new Date();
    }
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    await db.update(articlesTable).set(updateData).where(eq(articlesTable.id, id));
    const article = await getArticleWithCategory(id);
    if (!article) { res.status(404).json({ error: "Article not found" }); return; }
    res.json(article);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    await db.delete(articlesTable).where(eq(articlesTable.id, id));
    res.json({ success: true, message: "Article deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/publish", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }

    const { isPublished, isFeatured } = req.body;
    const updateData: Record<string, unknown> = { isPublished, updatedAt: new Date() };
    if (isPublished) updateData.publishedAt = new Date();
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    await db.update(articlesTable).set(updateData).where(eq(articlesTable.id, id));
    const article = await getArticleWithCategory(id);
    if (!article) { res.status(404).json({ error: "Article not found" }); return; }
    res.json(article);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const conditions = [eq(articlesTable.isPublished, true)];

    if (category) {
      const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, category)).limit(1);
      if (cat[0]) {
        conditions.push(eq(articlesTable.categoryId, cat[0].id));
      }
    }

    if (search) {
      conditions.push(
        or(
          ilike(articlesTable.title, `%${search}%`),
          ilike(articlesTable.summary, `%${search}%`)
        )!
      );
    }

    const whereClause = and(...conditions);

    const [articles, countResult] = await Promise.all([
      db
        .select({
          id: articlesTable.id,
          title: articlesTable.title,
          slug: articlesTable.slug,
          summary: articlesTable.summary,
          content: articlesTable.content,
          imageUrl: articlesTable.imageUrl,
          videoUrl: articlesTable.videoUrl,
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
        .orderBy(desc(articlesTable.publishedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(articlesTable)
        .where(whereClause),
    ]);

    res.json({ articles, total: countResult[0]?.count ?? 0 });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, summary, content, imageUrl, videoUrl, categoryId, author, isPublished, isFeatured } = req.body;
    if (!title || !content || !author) {
      res.status(400).json({ error: "title, content, author are required" }); return;
    }

    const slug = slugify(title);
    const [inserted] = await db
      .insert(articlesTable)
      .values({
        title,
        slug,
        summary,
        content,
        imageUrl,
        videoUrl,
        categoryId: categoryId || null,
        author,
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        publishedAt: isPublished ? new Date() : null,
      })
      .returning();

    const article = await getArticleWithCategory(inserted.id);
    res.status(201).json(article);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
