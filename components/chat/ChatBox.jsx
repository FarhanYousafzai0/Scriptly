"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AgentPicker from "../Layout/AgentPicker";

export default function ChatBox() {
  const [conversationId, setConversationId] = useState(null);
  const [agent, setAgent] = useState("scriptWriter");
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  async function ensureConversation() {
    if (conversationId) return conversationId;
    
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Untitled" })
      });
      
      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }
      
      const conversation = await response.json();
      setConversationId(conversation._id);
      return conversation._id;
    } catch (err) {
      console.error("Error creating conversation:", err);
      setError("Failed to create conversation. Please try again.");
      throw err;
    }
  }

  async function onSend() {
    const text = inputRef.current?.value?.trim();
    if (!text || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const id = await ensureConversation();
      setLog(prev => (prev ? prev + "\n\n— — —\n\n" : "") + `You: ${text}\nAI: `);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: id,
          userMessage: text,
          agent
        }),
      });

      if (response.status === 429) {
        setLog(prev => prev + "\n[Rate limit exceeded. Please wait a moment and try again.]");
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error("No response body received");
      }

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";
      
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        streamedContent += chunk;
        setLog(prev => {
          const base = prev.substring(0, prev.lastIndexOf("AI: ") + 4);
          return base + streamedContent;
        });
      }
    } catch (err) {
      console.error("Error in chat:", err);
      setError(err.message);
      setLog(prev => prev + `\n[Error: ${err.message}]`);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <AgentPicker value={agent} onChange={setAgent} />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="chat-input" className="text-sm font-medium text-gray-700">
          Your Message
        </label>
        <Textarea 
          id="chat-input"
          ref={inputRef} 
          placeholder="Ask something…" 
          rows={4}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="resize-none"
        />
      </div>
      
      <Button 
        onClick={onSend} 
        disabled={loading || !inputRef.current?.value?.trim()}
        className="w-full bg-black"
      >
        {loading ? "Generating..." : "Send"}
      </Button>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Conversation
        </label>
        <div className="rounded-md border p-3 whitespace-pre-wrap min-h-[160px] bg-gray-50">
          {log || "Start a conversation by typing a message above..."}
        </div>
      </div>
    </div>
  );
}
