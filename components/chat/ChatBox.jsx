"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AgentPicker from "@/components/AgentPicker";

export default function ChatBox() {
  const [conversationId, setConversationId] = useState(null);
  const [agent, setAgent] = useState("scriptWriter");
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  async function ensureConversation() {



    if (conversationId) return conversationId;
    const r = await fetch("/api/conversations", {
      method: "POST",
      body: JSON.stringify({ title: "Untitled" })
    });
    const c = await r.json();
    setConversationId(c._id);
    return c._id;
  }


//   On Send :
  async function onSend() {
    const text = inputRef.current?.value?.trim();
    if (!text || loading) return;
    setLoading(true);
    const id = await ensureConversation();
    setLog(prev => (prev ? prev + "\n\n— — —\n\n" : "") + `You: ${text}\nAI: `);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: id,
          userMessage: text,
          agent
        }),
      });

      if (res.status === 429) {
        setLog(prev => prev + "\n[Rate limit exceeded. Try again in a bit.]");
        setLoading(false);
        return;
      }
      if (!res.body) {
        setLog(prev => prev + "\n[No response body]");
        setLoading(false);
        return;
      }

      // stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        setLog(prev => prev + decoder.decode(value));
      }
    } catch (err) {
      setLog(prev => prev + `\n[Error: ${err?.message || "unknown"}]`);
    } finally {
      inputRef.current.value = "";
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <AgentPicker value={agent} onChange={setAgent} />
      </div>

      <Textarea ref={inputRef} placeholder="Ask something…" rows={4} />
      <Button onClick={onSend} disabled={loading}>
        {loading ? "Generating..." : "Send"}
      </Button>

      <div className="rounded-md border p-3 whitespace-pre-wrap min-h-[160px]">
        {log || "—"}
      </div>
    </div>
  );
}
