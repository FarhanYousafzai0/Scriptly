"use client";
import { useState } from "react";
import Button from "@/components/ui/CustomButton";
import Input from "@/components/ui/CustomInput";
import { Textarea } from "@/components/ui/CustomInput";

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
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Prompt</h3>
        <p className="text-gray-600">Save your favorite prompts for quick access</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt-title" className="block text-sm font-medium text-gray-700 mb-2">
            Prompt Title
          </label>
          <Input 
            id="prompt-title"
            placeholder="Enter a descriptive title..." 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="prompt-content" className="block text-sm font-medium text-gray-700 mb-2">
            Prompt Content
          </label>
          <Textarea 
            id="prompt-content"
            placeholder="Enter your prompt content here..." 
            value={content} 
            onChange={e => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            rows={6}
          />
        </div>
      </div>

      <Button 
        onClick={save} 
        disabled={loading || !title.trim() || !content.trim()}
        className="w-full"
        size="lg"
      >
        {loading ? "Saving Prompt..." : "Save Prompt"}
      </Button>
    </div>
  );
}
