"use client";

import { Send } from "lucide-react";
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
      <main className="container" style={{ maxWidth: 820, padding: "3rem 0 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p className="eyebrow">Powered by AI</p>
          <h1 className="serif" style={{ fontWeight: 400, fontSize: "2.3rem", margin: "0.6rem 0" }}>Atọ́ka</h1>
          <p className="muted">Ask anything about the collection, Yoruba culture, or personalised recommendations.</p>
        </div>
        <section className="panel" style={{ display: "flex", flexDirection: "column", height: 540, overflow: "hidden" }} aria-label="AI art coach chat">
          <div aria-live="polite" style={{ flex: 1, overflowY: "auto", padding: "1.2rem", display: "grid", alignContent: "start", gap: 14 }}>
            {messages.map((message, index) => (
              <div key={index} style={{ display: "flex", justifyContent: message.role === "user" ? "end" : "start" }}>
                <p style={{
                  background: message.role === "user" ? "var(--gold)" : "var(--panel-2)",
                  border: message.role === "assistant" ? "1px solid var(--border)" : "none",
                  borderRadius: message.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  color: message.role === "user" ? "var(--bg)" : "var(--cream)",
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: "80%",
                  padding: "0.75rem 0.95rem",
                  whiteSpace: "pre-wrap"
                }}>{message.content}</p>
              </div>
            ))}
            {loading ? <p className="muted">Thinking...</p> : null}
            <div ref={bottomRef} />
          </div>
          <div style={{ borderTop: "1px solid var(--border)", display: "flex", gap: 10, padding: "0.9rem" }}>
            <input
              aria-label="Message Atọ́ka"
              className="input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="Ask about art, culture, or recommendations..."
            />
            <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()} aria-label="Send"><Send size={16} aria-hidden="true" /></button>
          </div>
        </section>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "1rem" }}>
          {suggestions.map((suggestion) => (
            <button key={suggestion} className="btn btn-ghost" style={{ minHeight: 34, padding: "0.45rem 0.7rem", letterSpacing: 0, textTransform: "none" }} onClick={() => setInput(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
