export default function MarketingPage() {
  return (
    <div className="min-h-screen grid place-items-center p-8">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">IdeaForge</h1>
        <p className="text-muted-foreground">An AI copilot for creators. Generate ideas, scripts, and more.</p>
        <a href="/dashboard" className="inline-block px-4 py-2 rounded-md bg-black text-white">
          Open Dashboard
        </a>
      </div>
    </div>
  );
}
