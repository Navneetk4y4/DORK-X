export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">About DORK-X</h3>
            <p className="text-gray-400 text-sm">
              DORK-X is an automated OSINT reconnaissance platform for authorized security testing and educational purposes.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/categories" className="hover:text-white transition">Dork Categories</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <p className="text-gray-400 text-sm">
              Only use on authorized targets. Unauthorized access is illegal. Always obtain written permission.
            </p>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © 2026 DORK-X. Educational and authorized security testing tool.
          </p>
        </div>
      </div>
    </footer>
  );
}
