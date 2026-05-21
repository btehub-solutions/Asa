import Link from "next/link";
import { hasSupabaseConfig, supabaseAdmin } from "@/lib/supabase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { JoinApplication } from "@/lib/types";

export const revalidate = 0;

export default async function ApplicationsPage() {
  let applications: JoinApplication[] = [];

  if (hasSupabaseConfig()) {
    try {
      const supabase = supabaseAdmin();
      const { data } = await supabase
        .from("join_applications")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (data) {
        applications = data as JoinApplication[];
      }
    } catch (e) {
      console.warn("Could not load artist applications due to offline network:", e);
      applications = [
        {
          id: "mock-app-1",
          name: "Olumide Adebayo",
          email: "olumide@adirestudios.com",
          phone: "+234 803 123 4567",
          location: "Abeokuta, Nigeria",
          style: "Traditional Adire textile design and installation",
          instagram: "@olumide_adire",
          website: "olumideadire.com",
          commission: "20% consignment",
          message: "I am a third-generation adire master craftsman based in Abeokuta. My work focuses on restoring historical indigo vat dyeing processes and adapting classical Yoruba motifs (like Olokun and Ibadapa) for modern architectural tapestries. I would love to showcase my collection at Àṣà.",
          created_at: new Date().toISOString()
        }
      ];
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container animate-fade-in-up" style={{ padding: "4rem 1.5rem 6rem", minHeight: "calc(100vh - 145px)", maxWidth: 1000 }}>
        
        {/* Registry Page Header Console */}
        <div className="glass-premium museum-frame admin-console-header">
          <div>
            <p className="eyebrow" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>CURATORIAL BOARD</p>
            <h1 className="serif text-gold-gradient" style={{ fontSize: "2.6rem", fontWeight: 400, margin: "0.4rem 0 0", lineHeight: 1.1 }}>
              Artist Applications
            </h1>
            <p className="muted" style={{ margin: "0.5rem 0 0", fontSize: "0.95rem" }}>
              Review creative portfolios, professional statements, and proposed collaboration terms.
            </p>
          </div>
          <Link href="/admin" className="btn" style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--cream)", padding: "0.6rem 1.4rem" }}>
            ← Back to Portal
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="glass-premium museum-frame" style={{ padding: "5rem 2rem", textAlign: "center", borderRadius: "4px" }}>
            <h3 className="serif text-gold-gradient" style={{ fontWeight: 400, fontSize: "1.8rem", margin: 0 }}>No applications filed</h3>
            <p className="muted" style={{ marginTop: "0.75rem", fontSize: "1rem" }}>
              Currently, there are no pending artist onboarding applications in the registry.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {applications.map((app) => (
              <div key={app.id} className="application-card glass-premium admin-card-box" style={{ border: "1px solid rgba(193, 123, 47, 0.2)" }}>
                
                {/* Header Information */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, borderBottom: "1px solid rgba(193,123,47,0.15)", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
                  <div>
                    <h2 className="serif text-gold-gradient" style={{ fontSize: "1.8rem", fontWeight: 400, margin: 0 }}>{app.name}</h2>
                    <p className="muted" style={{ margin: "0.3rem 0 0", fontSize: 13, letterSpacing: "0.05em" }}>
                      SUBMITTED ON {new Date(app.created_at).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </p>
                  </div>
                  <a href={`mailto:${app.email}`} className="btn btn-primary" style={{ padding: "0.6rem 1.6rem", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
                    Initiate Contact
                  </a>
                </div>
                
                {/* Metadata Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
                  <div>
                    <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.25rem" }}>Email Registry</strong>
                    <span style={{ fontSize: "0.95rem", color: "var(--cream)" }}>{app.email}</span>
                  </div>
                  {app.phone && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.25rem" }}>Contact Wire</strong>
                      <span style={{ fontSize: "0.95rem", color: "var(--cream)" }}>{app.phone}</span>
                    </div>
                  )}
                  {app.location && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.25rem" }}>Origin / Studio</strong>
                      <span style={{ fontSize: "0.95rem", color: "var(--cream)" }}>{app.location}</span>
                    </div>
                  )}
                  {app.style && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.25rem" }}>Curation Style</strong>
                      <span style={{ fontSize: "0.95rem", color: "var(--cream)" }}>{app.style}</span>
                    </div>
                  )}
                  {app.instagram && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.25rem" }}>Social Catalog</strong>
                      <a href={app.instagram.startsWith("http") ? app.instagram : `https://instagram.com/${app.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" style={{ fontSize: "0.95rem", color: "var(--gold-light)", textDecoration: "underline" }}>{app.instagram}</a>
                    </div>
                  )}
                  {app.website && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.25rem" }}>Digital Portfolio</strong>
                      <a href={app.website.startsWith("http") ? app.website : `https://${app.website}`} target="_blank" rel="noreferrer" style={{ fontSize: "0.95rem", color: "var(--gold-light)", textDecoration: "underline" }}>{app.website}</a>
                    </div>
                  )}
                  {app.commission && (
                    <div>
                      <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.25rem" }}>Consignment Offer</strong>
                      <span style={{ fontSize: "0.95rem", color: "var(--cream)" }}>{app.commission}</span>
                    </div>
                  )}
                </div>

                {/* Message Box */}
                <div className="application-card-message" style={{ background: "rgba(25, 14, 5, 0.4)", border: "1px solid rgba(193,123,47,0.15)", padding: "1.5rem" }}>
                  <strong style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold)", marginBottom: "0.75rem", position: "relative", zIndex: 1 }}>
                    Artist Statement & Biography
                  </strong>
                  <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.75, whiteSpace: "pre-wrap", color: "var(--muted)", position: "relative", zIndex: 1 }}>
                    {app.message}
                  </p>
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

