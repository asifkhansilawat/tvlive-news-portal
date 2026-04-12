import { Link } from "wouter";
import { useGetAdminStats } from "@workspace/api-client-react";
import { FileText, BookOpen, Edit, Eye, Tag, Clock } from "lucide-react";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4" data-testid={`stat-card-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-3xl font-black text-gray-900">{value?.toLocaleString()}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>
        <Link href="/admin/articles/new" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm" data-testid="button-new-article">
          + New Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Total Articles" value={stats?.totalArticles ?? 0} icon={FileText} color="bg-primary" />
        <StatCard label="Published" value={stats?.publishedArticles ?? 0} icon={BookOpen} color="bg-green-500" />
        <StatCard label="Drafts" value={stats?.draftArticles ?? 0} icon={Edit} color="bg-amber-500" />
        <StatCard label="Categories" value={stats?.totalCategories ?? 0} icon={Tag} color="bg-purple-500" />
        <StatCard label="Total Views" value={stats?.totalViews ?? 0} icon={Eye} color="bg-blue-500" />
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-900">Recent Articles</h2>
          <Link href="/admin/articles" className="text-primary text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Author</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Views</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats?.recentArticles?.map(article => (
                <tr key={article.id} className="hover:bg-gray-50" data-testid={`row-article-${article.id}`}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1 max-w-xs font-hindi">{article.title}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                  <td className="px-6 py-4">
                    {article.categoryName && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-hindi">{article.categoryName}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${article.isPublished ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {article.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{article.viewCount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={12} />{formatDate(article.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/articles/${article.id}/edit`} className="text-primary text-sm hover:underline font-semibold" data-testid={`link-edit-${article.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
