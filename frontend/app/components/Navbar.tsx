import Link from 'next/link';
import { Shield, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:text-purple-400 transition">
          <Shield className="w-6 h-6" />
          DORK-X
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white transition text-sm">
            Home
          </Link>
          <Link href="/categories" className="text-gray-300 hover:text-white transition text-sm">
            Categories
          </Link>
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition text-sm">
            API Docs
          </a>
        </div>
      </div>
    </nav>
  );
}
