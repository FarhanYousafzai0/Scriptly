"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";

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
    return <div className="text-center text-muted-foreground py-8">Loading prompts…</div>;
  }
  if (status === "error") {
    return <div className="text-center text-red-600 py-8">Error loading prompts: {err}</div>;
  }
  if (!items.length) {
    return <div className="text-center text-muted-foreground py-8">No prompts found. Create one above!</div>;
  }

  return (
    <div className="grid gap-3">
      {items.map((p, idx) => (
        <Card key={p._id || idx} className="p-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{String(p.title ?? "")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {String(p.content ?? "")}
            </p>

            {Array.isArray(p.tags) && p.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {p.tags.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {String(tag)}
                  </span>
                ))}
              </div>
            )}

            {onUse && (
              <div className="pt-2">
                <button type="button" className="cursor-pointer bg-black text-white " onClick={() => onUse(p.content)}>
                  Use this prompt
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
