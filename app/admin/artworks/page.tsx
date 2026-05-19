"use client";

import { Archive, Edit, Tag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/format";
import type { Artwork } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  Published: "var(--gold)",
  Draft: "var(--muted)",
  Archived: "#888",
};

const AVAILABILITY_COLORS: Record<string, string> = {
  "For Sale": "#4caf7d",
  Sold: "#ffb4a8",
  "Not for Sale": "#888",
};

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchArtworks() {
    const res = await fetch("/api/admin/artworks");
    const data = await res.json().catch(() => ({}));
    setArtworks(data.artworks ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchArtworks(); }, []);

  async function markSold(id: string) {
    setActionId(id);
    await fetch(`/api/artworks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability: "Sold" }),
    });
    await fetchArtworks();
    setActionId(null);
  }

  async function confirmDelete(id: string) {
    setActionId(id);
    await fetch(`/api/artworks/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await fetchArtworks();
    setActionId(null);
  }

  async function togglePublish(artwork: Artwork) {
    setActionId(artwork.id);
    const next = artwork.publication_status === "Published" ? "Draft" : "Published";
    await fetch(`/api/artworks/${artwork.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publication_status: next }),
    });
    await fetchArtworks();
    setActionId(null);
  }

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ padding: "3rem 1rem 6rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p className="eyebrow">Admin · Manage</p>
            <h1 className="serif" style={{ fontSize: "2.4rem", fontWeight: 400, margin: "0.4rem 0 0" }}>Artwork Inventory</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link className="btn btn-ghost" href="/admin">← Dashboard</Link>
            <Link className="btn btn-primary" href="/admin/upload">+ Upload New</Link>
          </div>
        </div>

        {loading ? (
          <p className="muted" style={{ textAlign: "center", padding: "4rem 0" }}>Loading inventory...</p>
        ) : artworks.length === 0 ? (
          <div className="panel" style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <p className="muted">No artworks found. Upload your first piece to get started.</p>
            <Link className="btn btn-primary" href="/admin/upload" style={{ marginTop: "1rem", display: "inline-flex" }}>Upload Artwork</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {artworks.map((art) => (
              <div key={art.id} className="artwork-row" style={{ opacity: actionId === art.id ? 0.5 : 1, transition: "opacity 0.2s" }}>
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={art.image_url} alt={art.title} className="artwork-row-thumb" />

                {/* Details */}
                <div className="artwork-row-details">
                  <p style={{ margin: 0, fontWeight: 600, color: "var(--cream)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art.title}</p>
                  <p className="muted" style={{ margin: "2px 0 6px", fontSize: 13 }}>{art.artist_name} · {art.medium}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Badge color={STATUS_COLORS[art.publication_status]}>{art.publication_status}</Badge>
                    <Badge color={AVAILABILITY_COLORS[art.availability]}>{art.availability}</Badge>
                    <Badge color="var(--border)">{formatPrice(art.price)}</Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="artwork-row-actions">
                  <ActionBtn
                    onClick={() => markSold(art.id)}
                    disabled={art.availability === "Sold" || actionId === art.id}
                    title="Mark as Sold"
                    color="#ffb4a8"
                  >
                    <Tag size={15} /> Sold
                  </ActionBtn>
                  <ActionBtn
                    onClick={() => togglePublish(art)}
                    disabled={actionId === art.id}
                    title={art.publication_status === "Published" ? "Unpublish" : "Publish"}
                    color="var(--gold)"
                  >
                    <Archive size={15} /> {art.publication_status === "Published" ? "Unpublish" : "Publish"}
                  </ActionBtn>
                  <Link
                    href={`/admin/artworks/${art.id}/edit`}
                    className="btn btn-ghost"
                    style={{ minHeight: 34, padding: "0.4rem 0.75rem", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
                    title="Edit Artwork"
                  >
                    <Edit size={15} /> Edit
                  </Link>
                  <ActionBtn
                    onClick={() => setDeleteId(art.id)}
                    disabled={actionId === art.id}
                    title="Delete Artwork"
                    color="#ff6b6b"
                  >
                    <Trash2 size={15} />
                  </ActionBtn>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId ? (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div className="panel wood-frame" style={{ maxWidth: 420, width: "100%", padding: "2rem", textAlign: "center" }}>
              <Trash2 color="#ff6b6b" size={32} style={{ margin: "0 auto 1rem" }} />
              <h2 className="serif" style={{ fontWeight: 400, fontSize: "1.8rem", margin: "0 0 0.5rem" }}>Delete Artwork?</h2>
              <p className="muted" style={{ lineHeight: 1.7, marginBottom: "1.5rem" }}>This will permanently remove the artwork and all its images from Àṣà. This cannot be undone.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                <button
                  className="btn"
                  style={{ background: "#ff6b6b", color: "#fff", border: "none" }}
                  onClick={() => confirmDelete(deleteId)}
                  disabled={actionId === deleteId}
                >
                  {actionId === deleteId ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ background: `${color}22`, border: `1px solid ${color}55`, borderRadius: 999, color, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", padding: "0.2rem 0.6rem", textTransform: "uppercase" }}>
      {children}
    </span>
  );
}

function ActionBtn({ children, onClick, disabled, title, color }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; title?: string; color: string }) {
  return (
    <button
      className="btn btn-ghost"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{ minHeight: 34, padding: "0.4rem 0.75rem", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, color, borderColor: `${color}44` }}
    >
      {children}
    </button>
  );
}
