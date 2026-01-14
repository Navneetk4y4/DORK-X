export default function Footer() {
  return (
    <footer className="backdrop-blur-md bg-gradient-to-r from-black/80 via-slate-900/80 to-black/80 border-t border-cyan-500/30 py-12 shadow-lg shadow-cyan-500/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">About DORK-X</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              DORK-X is an automated OSINT reconnaissance platform for authorized security testing and educational purposes.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Resources</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="/" className="hover:text-cyan-400 transition-colors duration-300">Home</a></li>
              <li><a href="/dashboard" className="hover:text-cyan-400 transition-colors duration-300">Dashboard</a></li>
              <li><a href="/categories" className="hover:text-cyan-400 transition-colors duration-300">Dork Categories</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors duration-300">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Legal</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Only use on authorized targets. Unauthorized access is illegal. Always obtain written permission.
            </p>
          </div>
        </div>
        <div className="border-t border-cyan-500/30 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © 2026 DORK-X. Educational and authorized security testing tool.
          </p>
        </div>
      </div>
    </footer>
  );
}
