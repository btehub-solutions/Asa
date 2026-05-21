"use client";

import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Tell me about Yoruba art traditions",
  "What makes adire cloth special?",
  "Help me find art under $500",
  "What artworks are available?",
  "How do I purchase a piece?"
];

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ẹ káàbọ̀! Welcome to Àṣà. I am Atọ́ka, your AI Art Coach. I can help you explore the collection, understand cultural stories, and find art that speaks to you."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const content = input.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json().catch(() => ({}));
      setMessages((items) => [
        ...items,
        { role: "assistant", content: data.reply ?? "I’m having trouble responding right now. Please try again." }
      ]);
    } catch {
      setMessages((items) => [
        ...items,
        { role: "assistant", content: "I’m having trouble connecting right now. Please try again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ maxWidth: 820, padding: "2.5rem 0 5.5rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1.5rem", paddingLeft: "1rem" }} className="animate-fade-in-up">
          <Link href="/gallery" className="btn btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: "auto", padding: "0.45rem 0.9rem", fontSize: 13, border: "1px solid var(--border)", borderRadius: 20 }}>
            <ArrowLeft size={14} /> Back to Gallery
          </Link>
        </div>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }} className="animate-fade-in-up">
          <p className="eyebrow" style={{ color: "var(--gold)" }}>Concierge Assistant</p>
          <h1 className="serif text-gold-gradient" style={{ fontWeight: 400, fontSize: "2.8rem", margin: "0.4rem 0 0.8rem" }}>Atọ́ka</h1>
          <p className="muted" style={{ maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            Ask anything about our curated collection, Yoruba art traditions, bronze relief studies, or request a bespoke recommendations tour.
          </p>
        </div>
        
        <section className="panel glass-premium wood-frame animate-fade-in-up" style={{ display: "flex", flexDirection: "column", height: 560, overflow: "hidden", borderRadius: 12 }} aria-label="AI art coach chat">
          <div aria-live="polite" style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "grid", alignContent: "start", gap: 16 }}>
            {messages.map((message, index) => (
              <div key={index} style={{ display: "flex", justifyContent: message.role === "user" ? "end" : "start" }}>
                <p style={{
                  background: message.role === "user" ? "linear-gradient(135deg, var(--gold), var(--ember))" : "rgba(28, 15, 5, 0.65)",
                  border: message.role === "assistant" ? "1px solid var(--border)" : "none",
                  borderRadius: message.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  color: message.role === "user" ? "var(--bg)" : "var(--cream)",
                  lineHeight: 1.7,
                  margin: 0,
                  maxWidth: "80%",
                  padding: "0.8rem 1.1rem",
                  fontSize: 14,
                  whiteSpace: "pre-wrap",
                  boxShadow: message.role === "user" ? "0 4px 15px rgba(193, 123, 47, 0.25)" : "0 4px 12px rgba(0, 0, 0, 0.15)"
                }}>{message.content}</p>
              </div>
            ))}
            {loading ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center", animation: "fadeInUp 0.3s ease" }}>
                <span className="eyebrow" style={{ fontSize: 9, color: "var(--gold)", letterSpacing: "0.15em" }}>Atọ́ka is curating</span>
                <div className="typing-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>
          <div style={{ borderTop: "1px solid var(--border)", display: "flex", gap: 10, padding: "1rem", background: "rgba(28, 15, 5, 0.25)" }}>
            <input
              aria-label="Message Atọ́ka"
              className="input input-premium"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="Ask about art, culture, or recommendations..."
              style={{ background: "rgba(28, 15, 5, 0.4)", borderRadius: 8 }}
            />
            <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()} aria-label="Send" style={{ minWidth: 46, borderRadius: 8, boxShadow: "0 4px 12px rgba(193, 123, 47, 0.2)" }}><Send size={15} aria-hidden="true" /></button>
          </div>
        </section>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "1.2rem", justifyContent: "center" }} className="animate-fade-in-up">
          {suggestions.map((suggestion) => (
            <button key={suggestion} className="btn btn-ghost" style={{ minHeight: 34, padding: "0.45rem 0.9rem", letterSpacing: 0, textTransform: "none", fontSize: 12, borderRadius: 20, background: "rgba(28,15,5,0.2)" }} onClick={() => setInput(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
