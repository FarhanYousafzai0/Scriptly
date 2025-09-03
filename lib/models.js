import mongoose from "mongoose";

// Prompt Schema
const PromptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Conversation Schema
const ConversationSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Untitled" },
  },
  { timestamps: true }
);

// Message Schema
const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      index: true,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Prompt =
  mongoose.models.Prompt || mongoose.model("Prompt", PromptSchema);
export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
export const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
