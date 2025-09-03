"use client";
import { useRef, useState, useEffect } from "react";
import Button from "@/components/ui/CustomButton";
import { Textarea } from "@/components/ui/CustomInput";
import AgentPicker from "../Layout/AgentPicker";

export default function ChatBox() {
  const [conversationId, setConversationId] = useState(null);
  const [agent, setAgent] = useState("scriptWriter");
  const [input, setInput] = useState("");        // <-- control the textarea
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  // If you still want an external “use this prompt” hook, expose a function on window (simple)
  useEffect(() => {
    // window.usePrompt("text") can be called from elsewhere as a quick demo
    window.usePrompt = (text) => handleUsePrompt(text);
    return () => { delete window.usePrompt; };
  }, []);

  async function ensureConversation() {
    if (conversationId) return conversationId;
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled" }),
    });
    if (!response.ok) throw new Error("Failed to create conversation");
    const conversation = await response.json();
    setConversationId(conversation._id);
    return conversation._id;
  }

  async function onSend(forcedText) {
    const text = (forcedText ?? input).trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);

    try {
      const id = await ensureConversation();
      setLog((prev) => (prev ? prev + "\n\n— — —\n\n" : "") + `You: ${text}\nAI: `);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: id, userMessage: text, agent }),
      });

      if (response.status === 429) {
        setLog((prev) => prev + "\n[Rate limit exceeded. Please wait and try again.]");
        return;
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      if (!response.body) throw new Error("No response body received");

      // Stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamed = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        streamed += chunk;
        setLog((prev) => {
          const i = prev.lastIndexOf("AI: ");
          const base = i >= 0 ? prev.slice(0, i + 4) : prev;
          return base + streamed;
        });
      }
    } catch (err) {
      setError(err.message);
      setLog((prev) => prev + `\n[Error: ${err.message}]`);
    } finally {
      setInput(""); // clear input after send
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  function handleUsePrompt(promptContent) {
    setInput(promptContent);         // <-- update controlled input
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Chat Assistant</h3>
        <p className="text-gray-600">Choose an AI agent and start creating amazing content</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select AI Agent</label>
          <AgentPicker value={agent} onChange={setAgent} />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="chat-input" className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <Textarea
            id="chat-input"
            ref={inputRef}
            placeholder="Enter your message… or click a saved prompt to insert it"
            rows={4}
            value={input}                         // <-- controlled
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}            // <-- use onKeyDown
            disabled={loading}
          />
        </div>
      </div>

      <Button
        onClick={() => onSend()}
        disabled={loading || !input.trim()}       // <-- now reacts to typing
        className="w-full"
        size="lg"
      >
        {loading ? "Generating Response..." : "Send Message"}
      </Button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Conversation History</label>
        <div className="bg-gray-50 rounded-xl p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {log || "Start a conversation by typing a message above..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
