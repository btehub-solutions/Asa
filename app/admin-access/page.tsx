"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AdminAccessPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(formData: FormData) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", { method: "POST", body: formData });
    if (!res.ok) {
      setError("Invalid admin token.");
      setLoading(false);
      return;
    }

    const next = new URLSearchParams(window.location.search).get("next");
    router.push(next || "/admin");
    router.refresh();
  }

  return (
    <>
      <SiteHeader />
      <main className="adire" style={{ 
        minHeight: "calc(100vh - 145px)", 
        padding: "6rem 1rem", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        position: "relative"
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(193, 123, 47, 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none"
        }} />

        <form 
          action={login} 
          className={`glass-premium museum-frame animate-fade-in-up ${error ? "animate-shake" : ""}`} 
          style={{ 
            margin: "0 auto", 
            maxWidth: 460, 
            padding: "3.5rem 3rem", 
            position: "relative", 
            zIndex: 1,
            borderRadius: "4px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          {/* Glowing Vault Keyhole Motif */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(193, 123, 47, 0.08)",
            border: "1px solid rgba(193, 123, 47, 0.3)",
            display: "grid",
            placeItems: "center",
            marginBottom: "1.75rem",
            boxShadow: "0 0 20px rgba(193, 123, 47, 0.15)"
          }}>
            <LockKeyhole color="var(--gold)" size={32} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />
          </div>

          <p className="eyebrow" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>SECURE VAULT ACCESS</p>
          <h1 className="serif text-gold-gradient" style={{ fontSize: "2.2rem", fontWeight: 400, margin: "0.5rem 0 1rem", lineHeight: 1.2 }}>
            Àṣà Administrator
          </h1>
          <p className="muted" style={{ lineHeight: 1.6, fontSize: "0.95rem", marginBottom: "2rem" }}>
            Identify your keys. Please submit the digital curation key to unlock the master console.
          </p>

          <div className="field" style={{ width: "100%", textAlign: "left", marginBottom: "1.5rem" }}>
            <label htmlFor="admin_token" style={{ color: "var(--cream)", fontSize: "0.85rem", letterSpacing: "0.05em", marginBottom: "0.5rem", display: "block" }}>
              ADMINISTRATION KEY
            </label>
            <input 
              className="input" 
              id="admin_token" 
              name="admin_token" 
              type="password" 
              required 
              placeholder="••••••••••••••••"
              style={{ 
                width: "100%", 
                textAlign: "center", 
                letterSpacing: "0.3em", 
                fontSize: "1.1rem",
                padding: "0.75rem"
              }} 
            />
          </div>

          {error ? (
            <p style={{ color: "#ffb4a8", margin: "0 0 1.25rem 0", fontSize: "0.88rem" }} className="animate-shake">
              ⚠️ {error}
            </p>
          ) : null}

          <button 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ width: "100%", padding: "0.8rem", letterSpacing: "0.08em" }}
          >
            {loading ? "Decrypting Console..." : "Unlock Dashboard"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}

