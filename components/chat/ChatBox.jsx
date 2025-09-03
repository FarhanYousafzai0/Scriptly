"use client";
import { useRef, useState, useEffect } from "react";
import Button from "@/components/ui/CustomButton";
import { Textarea } from "@/components/ui/CustomInput";
import AgentPicker from "../Layout/AgentPicker";
import { usePromptContext } from "@/app/(dashboard)/dashboard/page";

export default function ChatBox() {
  const [conversationId, setConversationId] = useState(null);
  const [agent, setAgent] = useState("scriptWriter");
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();
  const { setUsePromptFunction } = usePromptContext();

  // Expose the handleUsePrompt function to parent component
  useEffect(() => {
    setUsePromptFunction(handleUsePrompt);
  }, [setUsePromptFunction]);

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

  const handleUsePrompt = (promptContent) => {
    if (inputRef.current) {
      inputRef.current.value = promptContent;
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Chat Assistant</h3>
        <p className="text-gray-600">Choose an AI agent and start creating amazing content</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select AI Agent
          </label>
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
            placeholder="Ask something or use a saved prompt..." 
            rows={4}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>
      </div>
      
      <Button 
        onClick={onSend} 
        disabled={loading || !inputRef.current?.value?.trim()}
        className="w-full"
        size="lg"
      >
        {loading ? "Generating Response..." : "Send Message"}
      </Button>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conversation History
        </label>
        <div className="bg-gray-50 rounded-xl p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {log || "Start a conversation by typing a message above..."}
          </pre>
        </div>
      </div>
    </div>
  );
}

