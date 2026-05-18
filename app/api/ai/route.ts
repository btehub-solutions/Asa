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

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply:
        "The AI coach is wired up, but OPENAI_API_KEY is not configured yet. Once the key is added in Vercel, I can answer using the live Àṣà catalogue."
    });
  }

  const artworks = await listPublishedArtworks();
  const catalog = artworks.map((art) =>
    `Title: ${art.title}; Artist: ${art.artist_name}; Price: ${formatPrice(art.price)}; Medium: ${art.medium}; Categories: ${art.categories.join(", ")}; Cultural roots: ${art.cultural_roots ?? "N/A"}`
  ).join("\n");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content:
            `You are the AI Art Coach for Àṣà, a curated African art marketplace celebrating Yoruba culture and artistic heritage. Be warm, accurate, culturally respectful, and concise. Recommend works only from this catalogue when asked about available pieces:\n${catalog || "No artworks are currently published."}`
        },
        ...parsed.data.messages
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json({ reply: "I’m having trouble connecting right now. Please try again in a moment." });
  }

  const data = await response.json();
  const reply = data.output_text ?? data.output?.[0]?.content?.[0]?.text ?? "I’m not sure how to answer that yet.";
  return NextResponse.json({ reply });
}
