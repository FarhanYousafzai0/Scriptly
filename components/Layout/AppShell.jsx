export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="bg-white border-r border-gray-200 p-6 space-y-8">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">Scriptly</div>
            <p className="text-sm text-gray-600">AI-Powered Content Creation</p>
          </div>
          
          <nav className="space-y-2">
            <a 
              className="block px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all duration-200" 
              href="/"
            >
              🏠 Home
            </a>
            <a 
              className="block px-4 py-3 text-sm font-medium text-gray-900 bg-gray-100 rounded-xl" 
              href="/dashboard"
            >
              💬 Dashboard
            </a>
          </nav>

          <div className="pt-8 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">AI Agents Available</div>
            <div className="space-y-1 text-xs text-gray-600">
              <div>• Script Writer</div>
              <div>• Ad Copywriter</div>
              <div>• Blog Writer</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
  