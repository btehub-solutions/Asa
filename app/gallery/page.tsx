import { GalleryClient } from "./gallery-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPublishedArtworks } from "@/lib/artworks";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Àṣà Art Marketplace",
  description: "Browse the complete collection of authentic African art, featuring traditional forms, contemporary voices, and sculptural heritage."
};

export const revalidate = 30;

export default async function GalleryPage() {
  const artworks = await listPublishedArtworks();

  return (
    <>
      <SiteHeader />
      <main className="container section-shell" style={{ minHeight: "calc(100vh - 72px - 80px)" }}>
        <div style={{ borderBottom: "1px solid var(--border)", marginBottom: "2.5rem", paddingBottom: "1.2rem" }}>
          <p className="eyebrow">Curated Collection</p>
          <h1 className="serif section-title" style={{ margin: "0.5rem 0" }}>Full Gallery</h1>
          <p className="muted" style={{ maxWidth: 620, lineHeight: 1.8 }}>
            Explore our complete collection of authentic African art, spanning traditional forms, contemporary voices, and sculptural heritage.
          </p>
        </div>
        
        <GalleryClient initialArtworks={artworks} />
      </main>
      <SiteFooter />
    </>
  );
}
