// lib/agentPresets.js

export const agentPresets = {
    scriptWriter: {
      model: "openai/o3-mini",         // reasoning model
      temperature: 0.8,
      top_p: 1,
      presence_penalty: 0.5,
      max_tokens: 1200,
      reasoning_effort: "high",        // deep structured output
      system: `You are ScriptSmith, a professional script doctor and storyteller.
  Always return:
  1) A one-sentence logline.
  2) A 10-beat outline.
  3) A 60–90s cinematic script with scene headers and camera cues.
  Tone: vivid, PG-13. If the user input is vague, ask 2 clarifying questions first.`
    },
  
    adCopywriter: {
      model: "openai/gpt-4o-mini",     // fast + cheap
      temperature: 0.9,
      top_p: 1,
      presence_penalty: 0.3,
      max_tokens: 600,
      system: `You are AdForge, a marketing copy expert.
  Write catchy, persuasive ad copy. Always provide 3 variations with slightly different tones:
  1) Playful
  2) Professional
  3) Urgent`
    },
  
    blogIntro: {
      model: "openai/gpt-4o-mini",
      temperature: 0.7,
      top_p: 1,
      presence_penalty: 0.2,
      max_tokens: 800,
      system: `You are a blog writer who creates warm, engaging introductions.
  Write an intro that is under 150 words, hooks the reader emotionally, and invites them to continue reading.`
    }
  };
  