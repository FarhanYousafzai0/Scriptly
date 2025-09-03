"use client";
import { useState } from "react";
import PromptSave from "@/components/PromptSave";
import PromptList from "../PromtList";

export default function PromptsPanel() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSaved() {
    // bump a key to re-fetch PromptList
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Prompts</h2>
      <PromptSave onSaved={handleSaved} />
            <PromptList refreshKey={refreshKey} />
    </div>
  );
}
