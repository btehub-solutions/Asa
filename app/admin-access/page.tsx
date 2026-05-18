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
      <main className="adire" style={{ minHeight: "calc(100vh - 145px)", padding: "5rem 1rem" }}>
        <form action={login} className="panel wood-frame" style={{ margin: "0 auto", maxWidth: 460, padding: "2rem", position: "relative", zIndex: 1 }}>
          <LockKeyhole color="var(--gold)" size={34} />
          <p className="eyebrow" style={{ marginTop: "1.2rem" }}>Protected Admin</p>
          <h1 className="serif" style={{ fontSize: "2.1rem", fontWeight: 400, margin: "0.5rem 0" }}>Sign in to Àṣà Admin</h1>
          <p className="muted" style={{ lineHeight: 1.7 }}>Enter the admin upload token to access dashboard tools.</p>
          <div className="field">
            <label htmlFor="admin_token">Admin Token</label>
            <input className="input" id="admin_token" name="admin_token" type="password" required />
          </div>
          {error ? <p style={{ color: "#ffb4a8" }}>{error}</p> : null}
          <button className="btn btn-primary" disabled={loading} style={{ width: "100%", marginTop: "1rem" }}>
            {loading ? "Checking..." : "Enter Dashboard"}
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
