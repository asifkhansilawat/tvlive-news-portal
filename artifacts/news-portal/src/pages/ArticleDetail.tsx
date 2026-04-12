import { useParams, Link } from "wouter";
import { useGetArticle, useGetArticles, getGetArticleQueryKey } from "@workspace/api-client-react";
import { Clock, Eye, User, ArrowLeft, Share2, Facebook, Twitter } from "lucide-react";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id || "0");
  const { data: article, isLoading } = useGetArticle(articleId, {
    query: { enabled: !!articleId, queryKey: getGetArticleQueryKey(articleId) }
  });
  const { data: relatedData } = useGetArticles({ limit: 5, category: article?.categoryName?.toLowerCase() });

  const related = relatedData?.articles?.filter(a => a.id !== articleId).slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 font-hindi mb-4">Article nahi mila</h2>
        <Link href="/" className="text-primary hover:underline">Wapas jaiye</Link>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <article className="md:col-span-2" data-testid="article-detail">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Home
          </Link>
          {article.categoryName && (
            <>
              <span>/</span>
              <Link href={`/category/${article.categoryId}`} className="hover:text-primary font-hindi">
                {article.categoryName}
              </Link>
            </>
          )}
        </div>

        {/* Category badge */}
        {article.categoryName && (
          <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded mb-3 font-hindi">
            {article.categoryName}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-4 font-hindi" data-testid="text-article-title">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t border-b py-3 mb-6">
          <span className="flex items-center gap-1.5"><User size={14} />{article.author}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} />{formatDate(article.publishedAt)}</span>
          <span className="flex items-center gap-1.5"><Eye size={14} />{article.viewCount?.toLocaleString()} views</span>
        </div>

        {/* Hero image */}
        {article.imageUrl && (
          <div className="rounded-lg overflow-hidden mb-6 shadow-md">
            <img src={article.imageUrl} alt={article.title} className="w-full object-cover max-h-96" />
          </div>
        )}

        {/* Summary */}
        {article.summary && (
          <div className="bg-gray-50 border-l-4 border-primary px-4 py-3 mb-6 rounded-r-lg">
            <p className="text-gray-700 font-semibold text-sm font-hindi">{article.summary}</p>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-gray max-w-none font-hindi text-gray-800 leading-relaxed">
          {article.content?.split("\n\n").map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
        </div>

        {/* Share */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-600 flex items-center gap-1"><Share2 size={14} /> Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 transition-colors"
              data-testid="button-share-facebook"
            >
              <Facebook size={14} /> Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-sky-500 text-white px-3 py-1.5 rounded text-sm hover:bg-sky-600 transition-colors"
              data-testid="button-share-twitter"
            >
              <Twitter size={14} /> Twitter
            </a>
          </div>
        </div>
      </article>

      {/* Sidebar - Related */}
      <aside className="space-y-4">
        {related.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 font-bold font-hindi">
              Sambandhi Khabarein
            </div>
            <div className="divide-y">
              {related.map(a => (
                <Link key={a.id} href={`/article/${a.id}`} className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group" data-testid={`link-related-${a.id}`}>
                  {a.imageUrl && (
                    <div className="shrink-0 w-20 h-14 rounded overflow-hidden">
                      <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-2 text-gray-900 group-hover:text-primary transition-colors font-hindi">{a.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
