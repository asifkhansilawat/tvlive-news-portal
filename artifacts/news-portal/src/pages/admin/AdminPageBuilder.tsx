export default function AdminPageBuilder() {
  const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Page Builder</h1>
        <p className="text-gray-500 text-sm mt-1">
          VvvebJs drag-and-drop editor — blocks drag karke pages design karein
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">VvvebJs Block Editor</span>
          <div className="flex-1" />
          <a
            href="https://github.com/givanz/VvvebJs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            GitHub ↗
          </a>
        </div>

        {/* Iframe */}
        <iframe
          src="/vvvebjs/editor.html"
          title="VvvebJs Page Builder"
          className="w-full border-0"
          style={{ height: "calc(100vh - 220px)", minHeight: "600px" }}
          allow="same-origin"
        />
      </div>
    </div>
  );
}
