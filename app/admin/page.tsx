import Link from "next/link";
import { LayoutList, Upload, Users, WandSparkles } from "lucide-react";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AdminDashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="container animate-fade-in-up" style={{ padding: "4rem 1.5rem 6rem", maxWidth: 960 }}>
        <div className="glass-premium museum-frame admin-console-box">
          <p className="eyebrow" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>ADMINISTRATION SYSTEM</p>
          <h1 className="serif text-gold-gradient" style={{ fontSize: "3rem", fontWeight: 400, margin: "0.5rem 0 1rem", lineHeight: 1.1 }}>
            Master Curation Portal
          </h1>
          <p className="muted" style={{ maxWidth: 680, lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "3rem" }}>
            Review pending artist consignments, catalog and launch masterworks into the exhibition database, and manage inventory provenance.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            <AdminCard 
              href="/admin/upload" 
              icon={<Upload size={22} />} 
              title="Catalog Masterpiece" 
              text="Publish new artworks, add storytelling, category classification, and provenance details." 
            />
            <AdminCard 
              href="/admin/artworks" 
              icon={<LayoutList size={22} />} 
              title="Exhibition Inventory" 
              text="Track your inventory, edit listings, mark status changes, or archival removal." 
            />
            <AdminCard 
              href="/admin/applications" 
              icon={<Users size={22} />} 
              title="Artist Registry" 
              text="Review new member onboarding applications, verify creative statements, and view credentials." 
            />
            <AdminCard 
              href="/ask-ai" 
              icon={<WandSparkles size={22} />} 
              title="Atọ́ka AI Curation" 
              text="Preview the digital salon experience from the perspective of our premium clients." 
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function AdminCard({ href, icon, title, text }: { href: string; icon: ReactNode; title: string; text: string }) {
  return (
    <Link 
      className="admin-nav-card glass-premium" 
      href={href}
      style={{
        border: "1px solid rgba(193, 123, 47, 0.2)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <span className="admin-nav-card-icon" style={{ 
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}>{icon}</span>
      <h2 className="serif admin-nav-card-title" style={{ fontSize: "1.3rem", fontWeight: 400 }}>{title}</h2>
      <p className="admin-nav-card-text" style={{ fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "1rem" }}>{text}</p>
      <span className="admin-nav-card-arrow" style={{ color: "var(--gold)" }}>Access Console →</span>
    </Link>
  );
}

