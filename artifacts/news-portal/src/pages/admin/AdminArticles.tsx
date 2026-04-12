import { useState } from "react";
import { Link } from "wouter";
import { useGetAdminArticles, useDeleteArticle, usePublishArticle, getGetAdminArticlesQueryKey, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Search } from "lucide-react";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminArticles() {
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAdminArticles(
    { status: status === "all" ? undefined : status, limit: 50 },
    { query: { queryKey: getGetAdminArticlesQueryKey({ status: status === "all" ? undefined : status, limit: 50 }) } }
  );

  const deleteArticle = useDeleteArticle();
  const publishArticle = usePublishArticle();

  const articles = (data?.articles || []).filter(a =>
    !search || a.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (!confirm("Article delete karna chahte hain?")) return;
    deleteArticle.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminArticlesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      }
    });
  };

  const handleTogglePublish = (id: number, isPublished: boolean, isFeatured: boolean) => {
    publishArticle.mutate({ id, data: { isPublished: !isPublished, isFeatured } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminArticlesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      }
    });
  };

  const handleToggleFeatured = (id: number, isPublished: boolean, isFeatured: boolean) => {
    publishArticle.mutate({ id, data: { isPublished, isFeatured: !isFeatured } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetAdminArticlesQueryKey() });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Articles</h1>
          <p className="text-gray-500 text-sm">{data?.total ?? 0} total articles</p>
        </div>
        <Link href="/admin/articles/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors" data-testid="button-new-article">
          <Plus size={16} /> New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${
                status === s ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-testid={`filter-${s}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full h-9 pl-9 pr-4 border rounded-lg text-sm focus:border-primary focus:outline-none"
            data-testid="input-search-articles"
          />
        </div>
      </div>

      {/* Articles table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 animate-pulse space-y-4">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded"></div>)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400">No articles found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Views</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles.map(article => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors" data-testid={`row-article-${article.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {article.imageUrl && (
                          <img src={article.imageUrl} alt="" className="w-10 h-8 object-cover rounded shrink-0" />
                        )}
                        <p className="font-medium text-gray-900 line-clamp-1 max-w-xs font-hindi text-sm">{article.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {article.categoryName && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-hindi">{article.categoryName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.author}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${article.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {article.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{article.viewCount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(article.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleFeatured(article.id, article.isPublished, article.isFeatured)}
                          title={article.isFeatured ? "Remove from featured" : "Mark as featured"}
                          className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${article.isFeatured ? "text-amber-500" : "text-gray-300"}`}
                          data-testid={`button-featured-${article.id}`}
                        >
                          {article.isFeatured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                        </button>
                        <button
                          onClick={() => handleTogglePublish(article.id, article.isPublished, article.isFeatured)}
                          title={article.isPublished ? "Unpublish" : "Publish"}
                          className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${article.isPublished ? "text-green-500" : "text-gray-300"}`}
                          data-testid={`button-publish-${article.id}`}
                        >
                          {article.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-blue-500"
                          data-testid={`button-edit-${article.id}`}
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-1.5 rounded hover:bg-red-50 transition-colors text-red-400 hover:text-red-600"
                          data-testid={`button-delete-${article.id}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
