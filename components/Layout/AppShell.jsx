export default function AppShell({ children }) {
    return (
      <div className="min-h-screen grid grid-cols-[240px_1fr]">
        <aside className="border-r p-4 space-y-4">
          <div className="text-lg font-semibold">IdeaForge</div>
          <nav className="space-y-2">
            <a className="block hover:underline" href="/">Home</a>
            <a className="block hover:underline" href="/dashboard">Dashboard</a>
          </nav>
        </aside>
        <main className="p-6">{children}</main>
      </div>
    );
  }
  