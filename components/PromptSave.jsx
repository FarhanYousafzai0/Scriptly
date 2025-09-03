"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PromptSave({ onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function save() {
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), tags: [] }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const doc = await res.json();
      onSaved?.(doc);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error saving prompt:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="prompt-title" className="text-sm font-medium text-gray-700">
          Title
        </label>
        <Input 
          id="prompt-title"
          placeholder="Enter prompt title..." 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="prompt-content" className="text-sm font-medium text-gray-700">
          Content
        </label>
        <Textarea 
          id="prompt-content"
          placeholder="Enter prompt content..." 
          value={content} 
          onChange={e => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          rows={4}
        />
      </div>

      <Button 
        onClick={save} 
    
        disabled={loading || !title.trim() || !content.trim()}
        className="w-full  bg-black text-white "
      >
        {loading ? "Saving..." : "Save Prompt"}
      </Button>
    </div>
  );
}
