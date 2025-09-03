import { agentPresets } from "@/lib/agentPresets";
import { NextResponse } from "next/server";


export const runtime = "nodejs";

// GET /api/agents  -> list all presets for UI dropdowns
export async function GET() {
  const list = Object.entries(agentPresets).map(([id, p]) => ({
    id,
    label: id                       // you can prettify on the client
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, s => s.toUpperCase()),
    model: p.model,
    temperature: p.temperature,
    top_p: p.top_p,
    presence_penalty: p.presence_penalty,
    max_tokens: p.max_tokens,
    reasoning_effort: p.reasoning_effort ?? null,
    system_preview: p.system?.slice(0, 140) || "" // show a short preview in UI
  }));

  return NextResponse.json(list);
}
