import { useParams, Link } from "wouter";
import { useGetArticles, useGetCategories, getGetArticlesQueryKey } from "@workspace/api-client-react";
import { Clock, Eye } from "lucide-react";
import { useState } from "react";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CategoryList() {
  const { slug } = useParams<{ slug: string }>();
  const [offset, setOffset] = useState(0);
  const limit = 12;

  const { data: catData } = useGetCategories();
  const { data, isLoading } = useGetArticles(
    { category: slug, limit, offset },
    { query: { queryKey: getGetArticlesQueryKey({ category: slug, limit, offset }) } }
  );

  const category = catData?.categories?.find(c => c.slug === slug);
  const articles = data?.articles || [];
  const total = data?.total ?? 0;

  return (
    <div>
      {/* Category Header */}
      <div className="mb-8 border-b-4 pb-4" style={{ borderColor: category?.color || "#e53935" }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-8 rounded" style={{ backgroundColor: category?.color || "#e53935" }}></div>
          <h1 className="text-3xl font-black font-hindi text-gray-900" data-testid="text-category-name">
            {category?.name || slug}
          </h1>
        </div>
        <p className="text-gray-500 text-sm">{total} articles</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 font-hindi text-lg">Is category mein koi article nahi hai</p>
          <Link href="/" className="text-primary hover:underline mt-4 block">Wapas jaiye</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map(article => (
            <Link key={article.id} href={`/article/${article.id}`} className="group block bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300" data-testid={`card-article-${article.id}`}>
              {article.imageUrl ? (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-primary/30 font-hindi text-2xl">भास्कर</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors font-hindi text-sm leading-snug">
                  {article.title}
                </h2>
                {article.summary && (
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{article.summary}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={11} />{formatDate(article.publishedAt)}</span>
                  <span className="flex items-center gap-1"><Eye size={11} />{article.viewCount?.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-4 py-2 border rounded font-semibold text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
            data-testid="button-prev-page"
          >
            Pichla
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">
            Page {Math.floor(offset / limit) + 1} / {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="px-4 py-2 border rounded font-semibold text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors bg-primary text-white border-primary"
            data-testid="button-next-page"
          >
            Agla
          </button>
        </div>
      )}
    </div>
  );
}
