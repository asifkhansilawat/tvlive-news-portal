import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  FileText, 
  Tags, 
  LogOut,
  Menu,
  X,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-[100dvh] flex bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-gray-300 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl text-white">
            <span className="text-primary">Bhaskar</span> Admin
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2 mt-4">Menu</div>
          
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link href="/admin/articles" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <FileText size={18} />
            <span>Articles</span>
          </Link>
          
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Tags size={18} />
            <span>Categories</span>
          </Link>
          
          <Link href="/admin/epapers" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors">
            <Newspaper size={18} />
            <span>ePaper</span>
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center px-4 md:px-8 border-b bg-white md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </Button>
          <span className="ml-4 font-semibold">Admin Panel</span>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
