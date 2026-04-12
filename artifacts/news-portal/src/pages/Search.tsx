import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useGetArticles, getGetArticlesQueryKey } from "@workspace/api-client-react";
import { Search as SearchIcon, Clock } from "lucide-react";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Search() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [search, setSearch] = useState(initialQ);

  const { data, isLoading } = useGetArticles(
    { search, limit: 20 },
    { query: { enabled: !!search, queryKey: getGetArticlesQueryKey({ search, limit: 20 }) } }
  );

  const articles = data?.articles || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(query);
    setLocation(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black font-hindi text-gray-900 mb-4">Khabar Khoje</h1>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Koi khabar ya topic likhiye..."
            className="flex-1 h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-lg font-hindi"
            data-testid="input-search"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
            data-testid="button-search-submit"
          >
            <SearchIcon size={20} /> Khoje
          </button>
        </form>
      </div>

      {search && (
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-bold text-gray-900">"{search}"</span> ke liye{" "}
            {isLoading ? "khoj raha hai..." : `${data?.total ?? 0} results mile`}
          </p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white rounded-lg border">
              <div className="w-24 h-16 bg-gray-200 rounded shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && search && articles.length === 0 && (
        <div className="text-center py-16">
          <SearchIcon size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-hindi text-lg">Koi khabar nahi mili</p>
          <p className="text-gray-400 text-sm mt-2">Dusra topic try kariye</p>
        </div>
      )}

      <div className="space-y-4">
        {articles.map(article => (
          <Link key={article.id} href={`/article/${article.id}`} className="flex gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-all group" data-testid={`card-article-${article.id}`}>
            {article.imageUrl && (
              <div className="shrink-0 w-28 h-20 rounded overflow-hidden">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {article.categoryName && (
                  <span className="text-xs font-bold text-primary font-hindi">{article.categoryName}</span>
                )}
              </div>
              <h2 className="font-bold text-gray-900 group-hover:text-primary transition-colors font-hindi line-clamp-2">{article.title}</h2>
              {article.summary && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{article.summary}</p>}
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Clock size={11} />{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
