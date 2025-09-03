export async function callOpenRouter(messages, opts = {}) {
    const {
      model = "openai/gpt-4o-mini",
      stream = true,
      temperature = 0.8,
      top_p = 1,
      presence_penalty = 0.5,
      max_tokens = 1200,
      reasoning_effort,
      ...extras // <- future-proof
    } = opts;
  
    const body = {
      model,
      messages,
      stream,
      temperature,
      top_p,
      presence_penalty,
      max_tokens,
      ...(reasoning_effort ? { reasoning: { effort: reasoning_effort } } : {}),
      ...extras,
    };
  
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing");
    }
  
    return fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "",
        "X-Title": process.env.OPENROUTER_APP_TITLE || "IdeaForge",
      },
      body: JSON.stringify(body),
    });
  }
  