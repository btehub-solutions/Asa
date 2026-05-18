import Link from "next/link";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { JoinApplication } from "@/lib/types";

export const revalidate = 0;

export default async function ApplicationsPage() {
  let applications: JoinApplication[] = [];

  if (hasSupabaseConfig()) {
    const supabase = supabaseAdmin();
    // Using any to bypass strict typing on the dynamic insert signature in types,
    // though select usually works fine if Database types are generated properly.
    const { data } = await (supabase as any)
      .from("join_applications")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (data) {
      applications = data as JoinApplication[];
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ padding: "3.5rem 0 5rem", minHeight: "calc(100vh - 145px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--border)", marginBottom: "2rem", paddingBottom: "1.2rem" }}>
          <div>
            <p className="eyebrow">Àṣà Admin</p>
            <h1 className="serif" style={{ fontSize: "2.4rem", fontWeight: 400, margin: "0.6rem 0" }}>Artist Applications</h1>
          </div>
          <Link href="/admin" className="btn btn-ghost">← Back to Dashboard</Link>
        </div>

        {applications.length === 0 ? (
          <div className="adire panel wood-frame" style={{ padding: "4rem 1rem", textAlign: "center" }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 className="serif" style={{ fontWeight: 400, fontSize: "1.7rem", color: "var(--cream)" }}>No applications yet</h3>
              <p className="muted" style={{ marginTop: "0.5rem" }}>When artists apply, they will appear here.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {applications.map((app) => (
              <div key={app.id} className="panel wood-frame" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div>
                    <h2 className="serif" style={{ fontSize: "1.6rem", fontWeight: 400, margin: 0, color: "var(--cream)" }}>{app.name}</h2>
                    <p className="muted" style={{ margin: "0.2rem 0 1.2rem", fontSize: 13 }}>
                      Applied on {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <a href={`mailto:${app.email}`} className="btn btn-primary" style={{ minHeight: 36, paddingInline: 18 }}>
                    Contact Artist
                  </a>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.2rem", marginBottom: "1.5rem" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Email</strong>
                    <span style={{ fontSize: 14 }}>{app.email}</span>
                  </div>
                  {app.phone && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Phone</strong>
                      <span style={{ fontSize: 14 }}>{app.phone}</span>
                    </div>
                  )}
                  {app.location && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Location</strong>
                      <span style={{ fontSize: 14 }}>{app.location}</span>
                    </div>
                  )}
                  {app.style && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Art Style</strong>
                      <span style={{ fontSize: 14 }}>{app.style}</span>
                    </div>
                  )}
                  {app.instagram && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Instagram</strong>
                      <a href={app.instagram.startsWith("http") ? app.instagram : `https://instagram.com/${app.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--gold-light)", textDecoration: "underline" }}>{app.instagram}</a>
                    </div>
                  )}
                  {app.website && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Website / Portfolio</strong>
                      <a href={app.website.startsWith("http") ? app.website : `https://${app.website}`} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--gold-light)", textDecoration: "underline" }}>{app.website}</a>
                    </div>
                  )}
                  {app.commission && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)" }}>Commission Offer</strong>
                      <span style={{ fontSize: 14 }}>{app.commission}</span>
                    </div>
                  )}
                </div>

                <div style={{ background: "rgba(28, 15, 5, 0.4)", padding: "1.2rem", borderRadius: 6, border: "1px solid var(--border)" }}>
                  <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.6rem" }}>Message</strong>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--muted)" }}>{app.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
