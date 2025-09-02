import { callOpenRouter } from "@/lib/openrouter";
import { getLimiter } from "@/lib/rateLimiter";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models";

export const runtime = "nodejs";



export async function POST(req) {
  await connectDB();
  const limiter = getLimiter();

  const ip = req.headers.get("x-forwarded-for") || "anon";
  try { await limiter.consume(ip); }
  catch { return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 }); }

  const { conversationId, messages, model } = await req.json();

  // Persist user message (last one assumed user)
  if (conversationId && messages?.length) {
    const last = messages[messages.length - 1];
    if (last?.role === "user") {
      await Message.create({ conversationId, role: "user", content: last.content });
    }
  }

  const upstream = await callOpenRouter(messages, model, true);
  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "Upstream error" }), { status: 500 });
  }

  // Stream back; also collect assistant text to save after
  const reader = upstream.body.getReader();
  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        // Save assistant message at end
        if (conversationId && full) {
          await Message.create({ conversationId, role: "assistant", content: full });
        }
        controller.close(); return;
      }
      const chunk = new TextDecoder().decode(value);
      // naive parse for streamed text chunks (OpenRouter SSE JSON lines)
      const lines = chunk.split("\n").filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const payload = line.slice(6);
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json?.choices?.[0]?.delta?.content || "";
            if (delta) {
              full += delta;
              controller.enqueue(encoder.encode(delta));
            }
          } catch {}
        }
      }
    }
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
