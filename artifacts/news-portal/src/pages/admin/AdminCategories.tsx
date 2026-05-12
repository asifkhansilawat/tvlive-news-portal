import { useState } from "react";
import { useGetCategories, useCreateCategory, getGetCategoriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Tag } from "lucide-react";

const COLORS = [
  "#e53935", "#1565c0", "#2e7d32", "#6a1b9a",
  "#e65100", "#00838f", "#4527a0", "#f9a825",
  "#c62828", "#283593", "#558b2f", "#ad1457"
];

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetCategories();
  const createCategory = useCreateCategory();
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = data?.categories || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    setSuccess(false);
    createCategory.mutate({ data: { name, color } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
        setName("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      },
      onError: (err: unknown) => {
        setError(err instanceof Error ? err.message : "Category create nahi hui. Dobara try karein.");
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm">{categories.length} categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category list */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b font-bold text-gray-900">All Categories</div>
          {isLoading ? (
            <div className="p-4 animate-pulse space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded"></div>)}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Tag size={32} className="mx-auto mb-3 opacity-30" />
              <p>No categories yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-4 px-6 py-4" data-testid={`row-category-${cat.id}`}>
                  <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: cat.color }}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 font-hindi">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.slug}</p>
                  </div>
                  <span className="text-sm font-bold px-2 py-1 rounded-full" style={{ backgroundColor: cat.color + "20", color: cat.color }}>
                    {cat.articleCount} articles
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create category form */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-bold text-gray-900 border-b pb-3 mb-5">New Category</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Khel, Politics..."
                className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none font-hindi"
                required
                data-testid="input-category-name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-6 gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-9 h-9 rounded-full transition-transform hover:scale-110 ${color === c ? "ring-4 ring-offset-2 ring-primary/50 scale-110" : ""}`}
                    style={{ backgroundColor: c }}
                    data-testid={`button-color-${c.replace("#", "")}`}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></div>
                <span className="text-sm text-gray-500">{color}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">✓ Category successfully banayi gayi!</p>
            )}

            <button
              type="submit"
              disabled={createCategory.isPending}
              className="w-full flex items-center justify-center gap-2 h-11 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              data-testid="button-create-category"
            >
              <Plus size={18} /> {createCategory.isPending ? "Creating..." : "Create Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
