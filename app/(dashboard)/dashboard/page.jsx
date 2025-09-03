"use client";
import { createContext, useContext, useState } from "react";
import ChatBox from "@/components/chat/ChatBox";
import PromptsPanel from "@/components/dashboard/PromptsPanel";
import AppShell from "@/components/Layout/AppShell";

// Create a context for prompt usage
const PromptContext = createContext();

export function usePromptContext() {
  return useContext(PromptContext);
}

export default function DashboardPage() {
  const [usePromptFunction, setUsePromptFunction] = useState(null);

  return (
    <PromptContext.Provider value={{ usePromptFunction, setUsePromptFunction }}>
      <AppShell>
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="space-y-6">
            <ChatBox />
          </section>

          <section className="space-y-6">
            <PromptsPanel />
          </section>
        </div>
      </AppShell>
    </PromptContext.Provider>
  );
}
