import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-black/80 via-slate-900/80 to-black/80 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-cyan-400 transition-all duration-300 group">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/40 to-lime-500/40 backdrop-blur-xl group-hover:from-cyan-500/60 group-hover:to-lime-500/60 transition-all border border-cyan-400/50 group-hover:border-cyan-300 shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-cyan-400" />
          </div>
          DORK-X
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-lime-400 group-hover:w-full transition-all duration-300 shadow-lg shadow-cyan-400/50"></span>
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium relative group">
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-lime-400 group-hover:w-full transition-all duration-300 shadow-lg shadow-cyan-400/50"></span>
          </Link>
          <Link href="/categories" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium relative group">
            Categories
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-lime-400 group-hover:w-full transition-all duration-300 shadow-lg shadow-cyan-400/50"></span>
          </Link>
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm font-medium relative group">
            API Docs
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-lime-400 group-hover:w-full transition-all duration-300 shadow-lg shadow-cyan-400/50"></span>
          </a>
        </div>
      </div>
    </nav>
  );
}
