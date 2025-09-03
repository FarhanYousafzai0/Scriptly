import { Prompt } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // needed if you're using Mongo in this route

// GET /api/prompts
export async function GET() {
  await connectDB();
  try {
    const items = await Prompt.find().sort({ createdAt: -1 }).limit(10).lean();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/prompts
export async function POST(req) {
  await connectDB();
  try {
    const data = await req.json();                 
    const title = (data.title || "").trim();
    const content = (data.content || "").trim();
    const tags = Array.isArray(data.tags) ? data.tags : [];

    if (!title || !content) {
      return NextResponse.json(
        { error: "Both title and content are required." },
        { status: 400 }
      );
    }

    const item = await Prompt.create({ title, content, tags });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
