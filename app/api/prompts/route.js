import { Prompt } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // needed if you're using Mongo in this route

// GET /api/prompts
export async function GET() {
  try {
    await connectDB();
    const items = await Prompt.find().sort({ createdAt: -1 }).limit(10).lean();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

// POST /api/prompts
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    // Input validation
    const title = (data.title || "").trim();
    const content = (data.content || "").trim();
    const tags = Array.isArray(data.tags) ? data.tags.filter(tag => typeof tag === "string" && tag.trim().length > 0) : [];

    if (!title || title.length === 0) {
      return NextResponse.json(
        { error: "Title is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (!content || content.length === 0) {
      return NextResponse.json(
        { error: "Content is required and cannot be empty." },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: "Title must be less than 200 characters." },
        { status: 400 }
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { error: "Content must be less than 10,000 characters." },
        { status: 400 }
      );
    }

    const item = await Prompt.create({ title, content, tags });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json({ error: "Failed to create prompt" }, { status: 500 });
  }
}
