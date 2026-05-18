"use client";

import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const fields = [
  ["Full name", "name", "text", "Your full name", true],
  ["Email address", "email", "email", "your@email.com", true],
  ["Phone number", "phone", "tel", "+1 234 567 8900", false],
  ["City / Country", "location", "text", "Lagos, Nigeria", false],
  ["Art style / categories", "style", "text", "Adire, Contemporary, Portrait", false],
  ["Instagram handle", "instagram", "text", "@yourhandle", false],
  ["Portfolio or website", "website", "url", "https://yourportfolio.com", false],
  ["Commission expectations", "commission", "text", "30% to gallery", false]
] as const;

export default function JoinPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/join", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Could not submit the application.");
      setStatus("error");
      return;
    }

    setStatus("success");
  }

  return (
    <>
      <SiteHeader />
      {status === "success" ? (
        <main className="container" style={{ maxWidth: 620, padding: "6rem 0", textAlign: "center" }}>
          <div style={{ border: "2px solid var(--gold)", borderRadius: "50%", color: "var(--gold)", display: "grid", height: 62, margin: "0 auto 1.5rem", placeItems: "center", width: 62 }}>✓</div>
          <h1 className="serif" style={{ fontWeight: 400 }}>Application received</h1>
          <p className="muted" style={{ lineHeight: 1.8 }}>Thank you for applying to join Àṣà. Our team will reach out within 5 to 7 business days.</p>
        </main>
      ) : (
        <main className="container two-col" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "3rem", padding: "3.5rem 0 5rem", alignItems: "start" }}>
          <section className="panel adire" style={{ padding: "2rem", position: "relative" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p className="eyebrow">Artist collaboration</p>
              <h1 className="serif" style={{ fontWeight: 400, fontSize: "2.2rem" }}>Join the Àṣà family</h1>
              <p className="muted" style={{ lineHeight: 1.8 }}>We work with talented African artists on a curated consignment model. Apply, we review, agree on commission, you ship your pieces, and we handle listings and sales.</p>
              {["Apply", "Review", "Agreement", "Ship", "Sell"].map((step) => (
                <p key={step} style={{ borderTop: "1px solid var(--border)", margin: 0, padding: "0.9rem 0" }}>
                  <strong style={{ color: "var(--cream)" }}>{step}</strong>
                </p>
              ))}
            </div>
          </section>
          <form action={submit}>
            <p className="eyebrow">Application form</p>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: "2rem" }}>Tell us about yourself</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
              {fields.map(([label, name, type, placeholder, required]) => (
                <div className="field" key={name} style={{ gridColumn: name === "website" || name === "commission" ? "1 / -1" : undefined }}>
                  <label htmlFor={name}>{label}{required ? " *" : ""}</label>
                  <input className="input" id={name} name={name} type={type} placeholder={placeholder} required={required} />
                </div>
              ))}
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label htmlFor="message">Tell us about your work *</label>
                <textarea className="input" id="message" name="message" rows={5} required placeholder="Describe your art, inspiration, and why you want to collaborate with Àṣà." />
              </div>
            </div>
            {message ? <p style={{ color: "#ffb4a8" }}>{message}</p> : null}
            <button className="btn btn-primary" disabled={status === "loading"} style={{ width: "100%", marginTop: "1rem" }}>
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </main>
      )}
      <SiteFooter />
    </>
  );
}
