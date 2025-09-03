 // client wrapper

import ChatBox from "@/components/chat/ChatBox";
import PromptsPanel from "@/components/dashboard/PromptsPanel";
import AppShell from "@/components/Layout/AppShell";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4">
          <h1 className="text-xl font-semibold">Chat</h1>
          <ChatBox />
        </section>

        {/* No function props passed from server → client */}
        <section>
          <PromptsPanel />
        </section>
      </div>
    </AppShell>
  );
}
