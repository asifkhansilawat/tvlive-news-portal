import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { useGetLatestArticles } from "@workspace/api-client-react";

export default function NewsTicker() {
  const { data } = useGetLatestArticles({ limit: 5 });
  const [activeIndex, setActiveIndex] = useState(0);
  
  const articles = data?.articles || [];

  useEffect(() => {
    if (articles.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % articles.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [articles.length]);

  if (!articles.length) return null;

  return (
    <div className="bg-slate-900 text-white text-sm h-10 flex items-center px-4 md:px-6 font-hindi w-full overflow-hidden">
      <div className="max-w-[1200px] mx-auto w-full flex items-center">
        <div className="bg-primary text-white font-bold px-3 py-1 text-xs uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          BREAKING
        </div>
        <div className="flex-1 ml-4 relative h-6 overflow-hidden">
          {articles.map((article, idx) => (
            <div 
              key={article.id}
              className={`absolute inset-0 flex items-center transition-all duration-500 ease-in-out ${
                idx === activeIndex 
                  ? "translate-y-0 opacity-100" 
                  : idx < activeIndex 
                    ? "-translate-y-full opacity-0" 
                    : "translate-y-full opacity-0"
              }`}
            >
              <Link href={`/article/${article.id}`} className="hover:underline truncate w-full">
                {article.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
