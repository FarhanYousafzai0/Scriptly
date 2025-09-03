import { Conversation } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// GET /api/conversations - list all conversations
export async function GET() {
  try {
    await connectDB();
    const conversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST /api/conversations - create a new conversation
export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { title = "Untitled" } = body;
    
    // Input validation
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title must be a non-empty string" },
        { status: 400 }
      );
    }
    
    const conversation = await Conversation.create({
      title: title.trim(),
    });
    
    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
} 