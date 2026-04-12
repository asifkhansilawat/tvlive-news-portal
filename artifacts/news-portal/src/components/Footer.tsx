import React from "react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-12 border-t-4 border-primary">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-black text-white tracking-tight font-hindi flex items-center gap-1 mb-4">
              दैनिक<span className="text-primary">भास्कर</span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6 font-sans">
              India's leading Hindi news portal delivering breaking news, national politics, sports, and entertainment.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">EPaper</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 inline-block">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@bhaskar.example.com</li>
              <li>Phone: +91 123 456 7890</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Dainik Bhaskar Replica. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
