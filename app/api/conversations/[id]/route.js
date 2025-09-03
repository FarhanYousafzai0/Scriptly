import { Message } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req, { params }) {
  try {
    await connectDB();
    
    const { role, content } = await req.json();
    
    // Input validation
    if (!role || !content) {
      return NextResponse.json(
        { error: "Role and content are required" },
        { status: 400 }
      );
    }
    
    if (!["user", "assistant", "system"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be user, assistant, or system" },
        { status: 400 }
      );
    }
    
    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content must be a non-empty string" },
        { status: 400 }
      );
    }
    
    const message = await Message.create({
      role,
      content: content.trim(),
      conversationId: params.id,
    });
    
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}