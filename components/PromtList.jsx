"use client";
import React, { useEffect, useState } from "react";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/CustomCard";
import Button from "@/components/ui/CustomButton";

export default function PromptList({ refreshKey, onUse }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ok
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchPrompts() {
      try {
        setStatus("loading");
        setErr("");
        const res = await fetch("/api/prompts", { cache: "no-store" });
        if (!res.ok) {
          let msg = `HTTP ${res.status}`;
          try {
            const j = await res.json();
            if (j?.error) msg += `: ${j.error}`;
          } catch {}
          throw new Error(msg);
        }
        const data = await res.json();
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : []);
          setStatus("ok");
        }
      } catch (e) {
        if (!cancelled) {
          setItems([]);
          setStatus("error");
          setErr(e?.message || "Unknown error");
        }
      }
    }

    fetchPrompts();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (status === "loading") {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your prompts...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">⚠️</div>
        <p className="text-red-600 mb-4">Error loading prompts: {err}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          size="sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4 text-4xl">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No prompts yet</h3>
        <p className="text-gray-600">Create your first prompt above to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Prompts</h3>
        <p className="text-gray-600">Click on any prompt to use it in your chat</p>
      </div>
      
      <div className="grid gap-4">
        {items.map((prompt, idx) => (
          <Card key={prompt._id || idx} className="group">
            <CardHeader>
              <CardTitle className="text-xl group-hover:text-black transition-colors">
                {String(prompt.title ?? "")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {String(prompt.content ?? "")}
              </p>

              {Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag, i) => (
                    <span
                      key={`${tag}-${i}`}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {String(tag)}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Created {new Date(prompt.createdAt).toLocaleDateString()}
                </span>
                
                {onUse && (
                  <Button 
                    onClick={() => onUse(prompt.content)}
                    size="sm"
                    className="group-hover:bg-black cursor-pointer group-hover:text-white"
                  >
                    Use This Prompt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
