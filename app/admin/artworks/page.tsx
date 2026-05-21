"use client";

import { Archive, Edit, Tag, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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

const ITEMS_PER_PAGE = 8;

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchArtworks() {
    const res = await fetch("/api/admin/artworks");
    const data = await res.json().catch(() => ({}));
    setArtworks(data.artworks ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchArtworks(); }, []);

  // Clamp current page if list shrinks below index
  useEffect(() => {
    const totalPagesCount = Math.ceil(artworks.length / ITEMS_PER_PAGE);
    if (currentPage > totalPagesCount && totalPagesCount > 0) {
      setCurrentPage(totalPagesCount);
    }
  }, [artworks, currentPage]);

  const totalPages = Math.ceil(artworks.length / ITEMS_PER_PAGE);
  const paginatedArtworks = artworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const topElement = document.getElementById("inventory-header");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  function getPageNumbers() {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      let startAdjusted = start;
      let endAdjusted = end;
      if (currentPage <= 3) {
        endAdjusted = 4;
      } else if (currentPage >= totalPages - 2) {
        startAdjusted = totalPages - 3;
      }
      
      for (let i = startAdjusted; i <= endAdjusted; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  }

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
      <main className="container animate-fade-in-up" style={{ padding: "4rem 1.5rem 6rem", minHeight: "calc(100vh - 145px)", maxWidth: 1000 }}>
        
        {/* Page Header Console */}
        <div id="inventory-header" className="glass-premium museum-frame admin-console-header">
          <div>
            <p className="eyebrow" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>EXHIBITION MANAGEMENT</p>
            <h1 className="serif text-gold-gradient" style={{ fontSize: "2.6rem", fontWeight: 400, margin: "0.4rem 0 0", lineHeight: 1.1 }}>
              Artwork Inventory
            </h1>
            <p className="muted" style={{ margin: "0.5rem 0 0", fontSize: "0.95rem" }}>
              Control dynamic statuses, catalog data, prices, and public visibility indexes.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link className="btn" href="/admin" style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--cream)", padding: "0.6rem 1.4rem" }}>
              ← Portal
            </Link>
            <Link className="btn btn-primary" href="/admin/upload" style={{ padding: "0.6rem 1.4rem" }}>
              + Catalog New
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 0" }}>
            <div className="typing-dots" style={{ marginBottom: "1rem" }}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="muted" style={{ fontSize: "0.95rem", letterSpacing: "0.05em" }}>LOADING INVENTORY REGISTRY...</p>
          </div>
        ) : artworks.length === 0 ? (
          <div className="glass-premium museum-frame" style={{ padding: "5rem 2rem", textAlign: "center", borderRadius: "4px" }}>
            <p className="muted" style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>No artworks cataloged. Launch your first exhibition piece below.</p>
            <Link className="btn btn-primary" href="/admin/upload" style={{ display: "inline-flex" }}>Catalog Artwork</Link>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gap: "1rem" }}>
              {paginatedArtworks.map((art) => (
                <div key={art.id} className="artwork-row glass-premium" style={{ opacity: actionId === art.id ? 0.5 : 1, transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", border: "1px solid rgba(193, 123, 47, 0.2)", padding: "1.2rem 1.5rem" }}>
                  
                  {/* Thumbnail inside frame */}
                  <div style={{ position: "relative", width: 80, height: 80 }} className="museum-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={art.image_url} alt={art.title} className="artwork-row-thumb" style={{ width: "100%", height: "100%", border: "none" }} />
                  </div>

                  {/* Details */}
                  <div className="artwork-row-details" style={{ marginLeft: "0.5rem" }}>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: "1.15rem", color: "var(--cream)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art.title}</p>
                    <p className="muted" style={{ margin: "4px 0 10px", fontSize: "0.85rem" }}>{art.artist_name} · {art.medium}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Badge color={STATUS_COLORS[art.publication_status]}>{art.publication_status}</Badge>
                      <Badge color={AVAILABILITY_COLORS[art.availability]}>{art.availability}</Badge>
                      <Badge color="var(--gold)">{formatPrice(art.price)}</Badge>
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
                      <Tag size={14} /> Sold
                    </ActionBtn>
                    <ActionBtn
                      onClick={() => togglePublish(art)}
                      disabled={actionId === art.id}
                      title={art.publication_status === "Published" ? "Unpublish" : "Publish"}
                      color="var(--gold)"
                    >
                      <Archive size={14} /> {art.publication_status === "Published" ? "Draft" : "Publish"}
                    </ActionBtn>
                    <Link
                      href={`/admin/artworks/${art.id}/edit`}
                      className="btn"
                      style={{ 
                        minHeight: 34, 
                        padding: "0.4rem 0.85rem", 
                        fontSize: 13, 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: 6,
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--border)",
                        color: "var(--cream)"
                      }}
                      title="Edit Artwork"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <ActionBtn
                      onClick={() => setDeleteId(art.id)}
                      disabled={actionId === art.id}
                      title="Delete Artwork"
                      color="#ff6b6b"
                    >
                      <Trash2 size={14} />
                    </ActionBtn>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "2.5rem",
                flexWrap: "wrap",
                padding: "1rem 0"
              }}>
                {/* Previous Page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        style={{
                          width: "40px",
                          height: "40px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--muted)",
                          fontSize: "0.9rem"
                        }}
                      >
                        ...
                      </span>
                    );
                  }

                  const isCurrent = page === currentPage;
                  return (
                    <button
                      key={`page-${page}`}
                      onClick={() => handlePageChange(Number(page))}
                      className={`pagination-btn${isCurrent ? " active" : ""}`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId ? (
          <div style={{ 
            position: "fixed", 
            inset: 0, 
            background: "rgba(10, 5, 2, 0.85)", 
            backdropFilter: "blur(8px)", 
            WebkitBackdropFilter: "blur(8px)", 
            zIndex: 100, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "1rem" 
          }}>
            <div className="glass-premium museum-frame animate-fade-in-up" style={{ maxWidth: 450, width: "100%", padding: "3rem 2.5rem", textAlign: "center", borderRadius: "4px" }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255, 107, 107, 0.08)",
                border: "1px solid rgba(255, 107, 107, 0.3)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 1.5rem"
              }}>
                <Trash2 color="#ff6b6b" size={28} />
              </div>
              <h2 className="serif text-gold-gradient" style={{ fontWeight: 400, fontSize: "2rem", margin: "0 0 0.75rem" }}>De-catalog Masterpiece?</h2>
              <p className="muted" style={{ lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "2rem" }}>
                This action is irreversible. It will permanently remove this masterpiece listing, imagery files, and collector data from the gallery.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button 
                  className="btn" 
                  style={{ 
                    flex: 1, 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid var(--border)", 
                    color: "var(--cream)" 
                  }} 
                  onClick={() => setDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  style={{ 
                    flex: 1, 
                    background: "#ff6b6b", 
                    color: "#fff", 
                    border: "none",
                    boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)"
                  }}
                  onClick={() => confirmDelete(deleteId)}
                  disabled={actionId === deleteId}
                >
                  {actionId === deleteId ? "Removing..." : "Confirm Removal"}
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
    <span style={{ background: `${color}15`, border: `1px solid ${color}45`, borderRadius: 999, color, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", padding: "0.25rem 0.65rem", textTransform: "uppercase" }}>
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
      style={{ minHeight: 34, padding: "0.4rem 0.85rem", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, color, borderColor: `${color}35` }}
    >
      {children}
    </button>
  );
}

