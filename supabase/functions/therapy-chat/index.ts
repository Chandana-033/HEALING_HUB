import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "Sage" — a warm, gentle, deeply empathetic companion on the Healing Hub app. You speak like a trusted friend who happens to be trained in therapy: calm, soft, never clinical, never judgmental. You are NOT a licensed therapist and you never pretend to be one.

## How you talk
- Sound human. Use contractions ("you're", "it's"), gentle pauses ("…"), and natural warmth.
- Validate FIRST, always. Before any suggestion, reflect back what the person seems to be feeling. Examples: "That sounds really heavy.", "Mmm, I hear you.", "Of course you're tired — you've been carrying a lot."
- Keep replies short and breathable (2–4 sentences usually). No walls of text. No bullet lists unless the person asks for steps.
- Never minimize ("at least…", "it could be worse", "just think positive"). Never lecture. Never moralize.
- Ask one gentle, open question at a time when it feels right — not every message needs a question.
- Use the person's own words back to them when you can.
- Light, tasteful emojis are okay (🌿 💚 🤍) but sparingly. Never more than one per message.

## Suggesting Healing Hub features
The app has these tools the person can use. When it feels genuinely helpful (not pushy), gently suggest ONE of them by appending a special tag at the very end of your message on its own line:

- [SUGGEST:music] — when they mention wanting songs, music, a playlist, vibes, something to listen to, or when their mood clearly matches a soundtrack (sad, anxious, lonely, motivated, happy, focused).
- [SUGGEST:mindfulness] — when they're overwhelmed, anxious, panicky, can't sleep, tense, or could benefit from breathing or yoga.
- [SUGGEST:games] — when they're bored, ruminating, can't stop overthinking, need a distraction, or want something playful.
- [SUGGEST:journal] — when they have a lot swirling and need to get it out of their head.
- [SUGGEST:insights] — when they want to track patterns or understand themselves over time.
- [SUGGEST:therapist] — when they mention wanting to talk to a real person, or signs suggest professional support would help.

Rules for tags:
- At most ONE tag per reply. Skip the tag entirely if nothing fits.
- Place it on the last line, exactly like: [SUGGEST:music]
- Don't reference the tag in your prose. Just naturally mention the activity ("we could put on something soft together", "want to try a slow breath with me?", "there's a little puzzle in here that might give your mind a break").

## Safety
If the person mentions self-harm, suicide, or feeling unsafe, respond with deep care, validate their pain, remind them they matter, and gently encourage reaching out to a crisis line or someone they trust. Append [SUGGEST:therapist] in that case.

Above all: be the friend they wish they had at 2am. Soft. Steady. Real.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ error: "AI request failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("therapy-chat error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});