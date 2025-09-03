// /app/api/ai/route.js

import { callOpenRouter } from "@/lib/openrouter";
import { getLimiter } from "@/lib/rateLimiter";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/lib/models";


export const runtime = "nodejs"; 
// Node runtime required for Mongoose/MongoDB

// Fallback system instructions if no agent preset is provided
const DEFAULT_SYSTEM = `
You are ScriptSmith, a professional script doctor and story generator.
Always follow this structure unless user says otherwise:
1) One-sentence logline.
2) 10-beat outline (clear, numbered).
3) 60–90s script in cinematic style with scene headers and camera cues.
Tone: vivid, PG-13. If user prompt is vague, ask 2 short clarifying questions first.
`.trim();

export async function POST(req) {
  // 1) DB + rate limiter
  await connectDB();
  const limiter = getLimiter();

  const ip = req.headers.get("x-forwarded-for") || "anon";
  try {
    await limiter.consume(ip);
  } catch {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), { status: 429 });
  }

  // 2) Parse request
  const body = await req.json();
  const {
    // conversation & input
    conversationId,
    messages: clientMessages,   // full chat array (optional)
    userMessage,                // simple single-turn (optional)

    // agent preset id (optional)
    agent,                      // e.g., "scriptWriter", "adCopywriter"

    // overrides (optional)
    model,
    temperature,
    top_p,
    presence_penalty,
    max_tokens,
    reasoning_effort, // "low" | "medium" | "high" (reasoning models like o3-mini)
  } = body;

  // 3) Resolve preset (if any), otherwise default
  const preset = agent ? agentPresets[agent] : undefined;

  // Compose effective settings: request override > preset > defaults
  const effective = {
    system: (preset?.system || DEFAULT_SYSTEM).trim(),
    model: model ?? preset?.model ?? "openai/gpt-4o-mini",
    temperature: temperature ?? preset?.temperature ?? 0.8,
    top_p: top_p ?? preset?.top_p ?? 1,
    presence_penalty: presence_penalty ?? preset?.presence_penalty ?? 0.5,
    max_tokens: max_tokens ?? preset?.max_tokens ?? 1200,
    reasoning_effort: reasoning_effort ?? preset?.reasoning_effort, // may be undefined
  };

  // Keep max_tokens within a safe window
  const safeMaxTokens = Math.min(Math.max(Number(effective.max_tokens) || 800, 200), 4000);

  // 4) Build messages the model will see (prepend system instructions)
  const messages = [
    { role: "system", content: effective.system },
    ...(Array.isArray(clientMessages) && clientMessages.length
      ? clientMessages
      : userMessage
      ? [{ role: "user", content: String(userMessage) }]
      : []),
  ];

  if (messages.length < 2) {
    return new Response(
      JSON.stringify({ error: "Provide either messages[] or userMessage." }),
      { status: 400 }
    );
  }

  // 5) Persist user turn (if we have a conversation)
  if (conversationId) {
    const last = messages[messages.length - 1];
    if (last?.role === "user" && last.content) {
      await Message.create({ conversationId, role: "user", content: last.content });
    }
  }

  // 6) Call OpenRouter (streamed)
  const upstream = await callOpenRouter(messages, {
    model: effective.model,
    stream: true,
    temperature: effective.temperature,
    top_p: effective.top_p,
    presence_penalty: effective.presence_penalty,
    max_tokens: safeMaxTokens,
    reasoning_effort: effective.reasoning_effort,
  });

  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "Upstream error" }), { status: 500 });
  }

  // 7) Stream assistant reply to client + collect full text for DB
  const reader = upstream.body.getReader();
  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        // 8) Persist assistant turn
        if (conversationId && full) {
          await Message.create({ conversationId, role: "assistant", content: full });
        }
        controller.close();
        return;
      }

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6);
        if (payload === "[DONE]") continue;

        try {
          const json = JSON.parse(payload);
          const delta = json?.choices?.[0]?.delta?.content || "";
          if (delta) {
            full += delta;
            controller.enqueue(encoder.encode(delta));
          }
        } catch {
          // ignore keepalives / non-JSON lines
        }
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
