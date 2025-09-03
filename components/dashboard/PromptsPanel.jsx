"use client";
import { useState } from "react";
import PromptSave from "@/components/PromptSave";
import PromptList from "@/components/PromtList";
import { usePromptContext } from "@/app/(dashboard)/dashboard/page";

export default function PromptsPanel() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { usePromptFunction } = usePromptContext();

  function handleSaved() {
    // bump a key to re-fetch PromptList
    setRefreshKey((k) => k + 1);
  }

  function handleUsePrompt(promptContent) {
    // This function will be called by the PromptList component
    if (usePromptFunction) {
      usePromptFunction(promptContent);
    }
  }

  return (
    <div className="space-y-8">
      <PromptSave onSaved={handleSaved} />
      <PromptList refreshKey={refreshKey} onUse={handleUsePrompt} />
    </div>
  );
}
