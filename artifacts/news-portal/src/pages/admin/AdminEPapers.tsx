import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Plus, Trash2, Upload, X, CheckCircle, Loader2, Calendar, BookOpen, Eye, EyeOff } from "lucide-react";

interface Epaper {
  id: number;
  title: string;
  edition: string;
  fileUrl: string;
  thumbnailUrl?: string;
  pageCount?: number;
  fileSize?: string;
  isPublished: boolean;
  publishDate: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("hi-IN", {
    year: "numeric", month: "long", day: "numeric"
  });
}

function FileUploadField({
  label, accept, onUpload, value, onChange
}: {
  label: string;
  accept: string;
  onUpload: (path: string) => void;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null); setDone(false);
    try {
      const res = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!res.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await res.json();
      const up = await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!up.ok) throw new Error("Upload failed");
      onUpload(objectPath);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="URL ya upload karein..."
          className="flex-1 h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : done ? <CheckCircle size={14} className="text-green-500" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={handleFile} />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {done && <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><CheckCircle size={11} /> Uploaded</p>}
    </div>
  );
}

export default function AdminEPapers() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    edition: "Main Edition",
    fileUrl: "",
    thumbnailUrl: "",
    pageCount: "",
    fileSize: "",
    isPublished: true,
    publishDate: new Date().toISOString().split("T")[0],
  });

  const { data, isLoading } = useQuery<{ epapers: Epaper[]; total: number }>({
    queryKey: ["epapers"],
    queryFn: async () => {
      const res = await fetch("/api/epapers");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const res = await fetch("/api/epapers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          pageCount: payload.pageCount ? parseInt(payload.pageCount) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to create ePaper");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["epapers"] });
      setShowForm(false);
      setForm({ title: "", edition: "Main Edition", fileUrl: "", thumbnailUrl: "", pageCount: "", fileSize: "", isPublished: true, publishDate: new Date().toISOString().split("T")[0] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/epapers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["epapers"] }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.fileUrl) return;
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">ePaper Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload aur manage karein digital newspaper editions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus size={16} /> {showForm ? "Cancel" : "New ePaper"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="font-bold text-gray-700 border-b pb-3 flex items-center gap-2">
            <FileText size={18} className="text-primary" /> New ePaper Upload
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Dainik Bhaskar - 12 April 2026"
                  className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm font-hindi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Edition</label>
                <input
                  name="edition"
                  value={form.edition}
                  onChange={handleChange}
                  placeholder="e.g. Bhopal Edition"
                  className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>

            <FileUploadField
              label="PDF File *"
              accept=".pdf,application/pdf"
              value={form.fileUrl}
              onChange={v => setForm(p => ({ ...p, fileUrl: v }))}
              onUpload={path => setForm(p => ({ ...p, fileUrl: path }))}
            />

            <FileUploadField
              label="Thumbnail Image"
              accept="image/*"
              value={form.thumbnailUrl}
              onChange={v => setForm(p => ({ ...p, thumbnailUrl: v }))}
              onUpload={path => setForm(p => ({ ...p, thumbnailUrl: path }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Publish Date</label>
                <input
                  type="date"
                  name="publishDate"
                  value={form.publishDate}
                  onChange={handleChange}
                  className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pages</label>
                <input
                  type="number"
                  name="pageCount"
                  value={form.pageCount}
                  onChange={handleChange}
                  placeholder="16"
                  className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">File Size</label>
                <input
                  name="fileSize"
                  value={form.fileSize}
                  onChange={handleChange}
                  placeholder="e.g. 4.2 MB"
                  className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublished"
                checked={form.isPublished}
                onChange={handleChange}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-semibold text-gray-700">Published (visible on website)</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || !form.title || !form.fileUrl}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 text-sm disabled:opacity-50"
              >
                {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {createMutation.isPending ? "Uploading..." : "Publish ePaper"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <h2 className="font-bold text-gray-800">All ePapers ({data?.total ?? 0})</h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">
            <Loader2 size={32} className="animate-spin mx-auto mb-3 text-primary" />
            <p>Loading...</p>
          </div>
        ) : !data?.epapers?.length ? (
          <div className="p-12 text-center text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Koi ePaper upload nahi hua</p>
            <p className="text-sm mt-1">Upar "New ePaper" button se upload karein</p>
          </div>
        ) : (
          <div className="divide-y">
            {data.epapers.map(ep => (
              <div key={ep.id} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                  {ep.thumbnailUrl ? (
                    <img
                      src={ep.thumbnailUrl.startsWith("/objects/") ? `/api${ep.thumbnailUrl}` : ep.thumbnailUrl}
                      alt={ep.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900 truncate font-hindi">{ep.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><BookOpen size={11} /> {ep.edition}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(ep.publishDate)}</span>
                        {ep.pageCount && <span>{ep.pageCount} pages</span>}
                        {ep.fileSize && <span>{ep.fileSize}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ep.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {ep.isPublished ? "Published" : "Draft"}
                      </span>
                      <a
                        href={ep.fileUrl.startsWith("/objects/") ? `/api${ep.fileUrl}` : ep.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                      >
                        View PDF
                      </a>
                      <button
                        onClick={() => {
                          if (confirm("Is ePaper ko delete karein?")) deleteMutation.mutate(ep.id);
                        }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
