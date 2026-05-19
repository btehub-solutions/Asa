import Link from "next/link";
import { LayoutList, Upload, Users, WandSparkles } from "lucide-react";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AdminDashboardPage() {
  return (
    <>
      <SiteHeader />
      <main className="container" style={{ padding: "3.5rem 0 5rem" }}>
        <p className="eyebrow">Àṣà Admin</p>
        <h1 className="serif" style={{ fontSize: "2.6rem", fontWeight: 400, margin: "0.6rem 0" }}>Dashboard</h1>
        <p className="muted" style={{ maxWidth: 680, lineHeight: 1.8 }}>Manage the curated consignment workflow, publish new artworks, and prepare artist stories for collectors.</p>
        <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginTop: "2rem" }}>
          <AdminCard href="/admin/upload" icon={<Upload size={24} />} title="Upload New Artwork" text="Add artist information, artwork images, cultural storytelling, and publication status." />
          <AdminCard href="/admin/artworks" icon={<LayoutList size={24} />} title="Artwork Inventory" text="View, edit, mark as sold, publish, unpublish, or delete existing artworks." />
          <AdminCard href="/admin/applications" icon={<Users size={24} />} title="Artist Applications" text="Review applications, read artist messages, and contact potential partners." />
          <AdminCard href="/ask-ai" icon={<WandSparkles size={24} />} title="Atọ́ka (AI Coach)" text="Preview the collector-facing AI art guide." />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function AdminCard({ href, icon, title, text }: { href: string; icon: ReactNode; title: string; text: string }) {
  return (
    <Link className="admin-nav-card" href={href}>
      <span className="admin-nav-card-icon">{icon}</span>
      <h2 className="serif admin-nav-card-title">{title}</h2>
      <p className="admin-nav-card-text">{text}</p>
      <span className="admin-nav-card-arrow">Open →</span>
    </Link>
  );
}
