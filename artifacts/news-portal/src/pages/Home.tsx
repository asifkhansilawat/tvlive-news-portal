import { Link } from "wouter";
import { useGetFeaturedArticles, useGetLatestArticles, useGetArticles, useGetCategories } from "@workspace/api-client-react";
import { Clock, Eye } from "lucide-react";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function ArticleCard({ article, size = "sm" }: { article: any; size?: "sm" | "lg" }) {
  if (size === "lg") {
    return (
      <Link href={`/article/${article.id}`} data-testid={`card-article-${article.id}`} className="group block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
        <div className="relative overflow-hidden aspect-[16/9]">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl text-primary/30 font-hindi">भास्कर</span>
            </div>
          )}
          {article.categoryName && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded font-hindi">
              {article.categoryName}
            </span>
          )}
        </div>
        <div className="p-4 bg-white">
          <h2 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 group-hover:text-primary transition-colors font-hindi">
            {article.title}
          </h2>
          {article.summary && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2 font-sans">{article.summary}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock size={12} />{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1"><Eye size={12} />{article.viewCount?.toLocaleString()}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.id}`} data-testid={`card-article-${article.id}`} className="group flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      {article.imageUrl && (
        <div className="shrink-0 w-24 h-16 overflow-hidden rounded">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900 group-hover:text-primary transition-colors font-hindi">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
          {article.categoryName && <span className="text-primary font-bold font-hindi">{article.categoryName}</span>}
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedArticles();
  const { data: latestData, isLoading: latestLoading } = useGetLatestArticles({ limit: 10 });
  const { data: categoriesData } = useGetCategories();
  const { data: allArticlesData } = useGetArticles({ limit: 12, offset: 0 });

  const featured = featuredData?.articles || [];
  const latest = latestData?.articles || [];
  const categories = categoriesData?.categories || [];
  const allArticles = allArticlesData?.articles || [];

  const heroArticle = featured[0];
  const secondaryFeatured = featured.slice(1, 3);
  const regularArticles = allArticles.filter(a => !featured.some(f => f.id === a.id));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {featuredLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          <div className="md:col-span-2 bg-gray-200 rounded-lg aspect-[16/9]"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 rounded-lg aspect-[4/3]"></div>
            <div className="bg-gray-200 rounded-lg aspect-[4/3]"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroArticle && (
            <div className="md:col-span-2">
              <ArticleCard article={heroArticle} size="lg" />
            </div>
          )}
          <div className="space-y-4">
            {secondaryFeatured.map(a => (
              <ArticleCard key={a.id} article={a} size="lg" />
            ))}
          </div>
        </div>
      )}

      {/* Main content + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Category sections */}
          {categories.slice(0, 4).map(cat => {
            const catArticles = allArticles.filter(a => a.categoryId === cat.id).slice(0, 3);
            if (!catArticles.length) return null;
            return (
              <section key={cat.id} data-testid={`section-category-${cat.id}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black font-hindi text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 rounded" style={{ backgroundColor: cat.color }}></span>
                    {cat.name}
                  </h2>
                  <Link href={`/category/${cat.slug}`} className="text-primary text-sm font-semibold hover:underline">
                    Aur dekhein &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {catArticles.map(a => <ArticleCard key={a.id} article={a} size="lg" />)}
                </div>
              </section>
            );
          })}
        </div>

        {/* Sidebar - Latest News */}
        <aside className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-primary text-white px-4 py-3 font-bold font-hindi text-lg">
              Taza Khabar
            </div>
            <div className="divide-y">
              {latestLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="p-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                latest.slice(0, 8).map(a => <ArticleCard key={a.id} article={a} size="sm" />)
              )}
            </div>
          </div>

          {/* Categories box */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-slate-800 text-white px-4 py-3 font-bold font-hindi text-lg">
              Vishay
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  data-testid={`link-category-${cat.id}`}
                  className="text-center py-2 px-3 rounded text-white text-sm font-bold font-hindi hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
