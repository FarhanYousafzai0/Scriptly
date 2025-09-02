export async function callOpenRouter(messages, model = "openai/gpt-4o-mini", stream = true) {
    return fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "",
        "X-Title": process.env.OPENROUTER_APP_TITLE || "IdeaForge",
      },
      body: JSON.stringify({ model, messages, stream }),
    });
  }
  