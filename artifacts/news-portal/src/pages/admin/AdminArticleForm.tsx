import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import {
  useGetArticle, useCreateArticle, useUpdateArticle, useGetCategories,
  getGetArticleQueryKey, getGetAdminArticlesQueryKey, getGetAdminStatsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";

export default function AdminArticleForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const articleId = isEdit ? parseInt(id!) : 0;
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: categories } = useGetCategories();
  const { data: existingArticle } = useGetArticle(articleId, {
    query: { enabled: isEdit, queryKey: getGetArticleQueryKey(articleId) }
  });

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
    categoryId: "",
    author: "",
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    if (existingArticle) {
      setForm({
        title: existingArticle.title || "",
        summary: existingArticle.summary || "",
        content: existingArticle.content || "",
        imageUrl: existingArticle.imageUrl || "",
        categoryId: existingArticle.categoryId?.toString() || "",
        author: existingArticle.author || "",
        isPublished: existingArticle.isPublished ?? false,
        isFeatured: existingArticle.isFeatured ?? false,
      });
    }
  }, [existingArticle]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      summary: form.summary || undefined,
      content: form.content,
      imageUrl: form.imageUrl || undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      author: form.author,
      isPublished: form.isPublished,
      isFeatured: form.isFeatured,
    };

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: getGetAdminArticlesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
      setLocation("/admin/articles");
    };

    if (isEdit) {
      updateArticle.mutate({ id: articleId, data: payload }, { onSuccess });
    } else {
      createArticle.mutate({ data: payload }, { onSuccess });
    }
  };

  const isPending = createArticle.isPending || updateArticle.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => setLocation("/admin/articles")} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm" data-testid="button-back">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-black text-gray-900">{isEdit ? "Edit Article" : "New Article"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="font-bold text-gray-700 border-b pb-3">Article Details</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Article ka title likhiye..."
              className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none font-hindi text-lg"
              required
              data-testid="input-title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Summary</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="Short description..."
              rows={2}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-none font-hindi"
              data-testid="textarea-summary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Full article content likhiye..."
              rows={12}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none resize-y font-hindi"
              required
              data-testid="textarea-content"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="font-bold text-gray-700 border-b pb-3">Meta</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author *</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                required
                data-testid="input-author"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none bg-white"
                data-testid="select-category"
              >
                <option value="">Select category...</option>
                {categories?.categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              type="url"
              className="w-full h-11 px-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              data-testid="input-image-url"
            />
            {form.imageUrl && (
              <div className="mt-2 rounded-lg overflow-hidden h-32">
                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="w-5 h-5 accent-primary"
                data-testid="checkbox-published"
              />
              <span className="font-semibold text-sm text-gray-700 flex items-center gap-1.5">
                {form.isPublished ? <Eye size={15} className="text-green-500" /> : <EyeOff size={15} className="text-gray-400" />}
                Published
              </span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 accent-primary"
                data-testid="checkbox-featured"
              />
              <span className="font-semibold text-sm text-gray-700">Featured / Breaking</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => setLocation("/admin/articles")}
            className="px-5 py-2.5 border-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            data-testid="button-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            data-testid="button-save"
          >
            <Save size={16} /> {isPending ? "Saving..." : "Save Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
