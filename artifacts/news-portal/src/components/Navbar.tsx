import React from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCategories } from "@workspace/api-client-react";

export default function Navbar() {
  const [, setLocation] = useLocation();
  const { data: categories } = useGetCategories();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");
    if (query) {
      setLocation(`/search?q=${encodeURIComponent(query.toString())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white text-foreground shadow-sm">
      <div className="max-w-[1200px] mx-auto">
        {/* Top bar with Logo and Search */}
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/" className="text-3xl font-black text-primary tracking-tight font-hindi flex items-center gap-1">
              दैनिक<span className="text-foreground">भास्कर</span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                name="q"
                type="search"
                placeholder="Search news..."
                className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                <Search size={18} />
              </button>
            </form>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors hidden sm:block">
              EPaper
            </Link>
          </div>
        </div>

        {/* Categories Navigation */}
        <nav className="hidden md:flex items-center gap-6 px-6 h-12 overflow-x-auto no-scrollbar bg-primary text-white font-hindi text-lg">
          <Link href="/" className="whitespace-nowrap hover:text-white/80 transition-colors font-medium">होम</Link>
          {categories?.categories?.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.slug}`} 
              className="whitespace-nowrap hover:text-white/80 transition-colors font-medium"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
