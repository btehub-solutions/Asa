import { NextResponse } from "next/server";
import { z } from "zod";
import { listPublishedArtworks } from "@/lib/artworks";
import { formatPrice } from "@/lib/format";

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1)
  })).min(1).max(20)
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid chat request." }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
      reply:
        "Atọ́ka is wired up, but GEMINI_API_KEY is not configured yet. Once the key is added in Vercel, I can answer using the live Àṣà catalogue."
    });
  }

  const artworks = await listPublishedArtworks();
  const catalog = artworks.map((art) =>
    `Title: ${art.title}; Artist: ${art.artist_name}; Price: ${formatPrice(art.price)}; Medium: ${art.medium}; Categories: ${art.categories.join(", ")}; Cultural roots: ${art.cultural_roots ?? "N/A"}`
  ).join("\n");

  const systemInstruction = `You are Atọ́ka, the AI Art Coach for Àṣà, a curated African art marketplace celebrating Yoruba culture and artistic heritage. Be warm, accurate, culturally respectful, and concise. Recommend works only from this catalogue when asked about available pieces:\n${catalog || "No artworks are currently published."}`;

  const contents = parsed.data.messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents
    })
  });

  if (!response.ok) {
    console.error("Gemini API Error:", await response.text());
    return NextResponse.json({ reply: "I’m having trouble connecting right now. Please try again in a moment." });
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I’m not sure how to answer that yet.";
  return NextResponse.json({ reply });
}
