import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import NewsTicker from "./NewsTicker";

interface NewsLayoutProps {
  children: ReactNode;
}

export default function NewsLayout({ children }: NewsLayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-hindi">
      <NewsTicker />
      <Navbar />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
