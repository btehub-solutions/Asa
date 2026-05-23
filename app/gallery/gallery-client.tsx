"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ArtworkCard } from "@/components/artwork-card";
import { CATEGORIES } from "@/lib/categories";
import type { Artwork } from "@/lib/types";

const ITEMS_PER_PAGE = 9;

export function GalleryClient({ initialArtworks }: { initialArtworks: Artwork[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [availability, setAvailability] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Auto-reset back to page 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, availability, sortBy]);

  // Dynamic Filtering Logic
  const filteredArtworks = useMemo(() => {
    let result = [...initialArtworks];

    // Search query match
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.artist_name.toLowerCase().includes(q) ||
          (art.medium && art.medium.toLowerCase().includes(q))
      );
    }

    // Category match
    if (selectedCategory) {
      result = result.filter((art) => art.categories.includes(selectedCategory));
    }

    // Availability match
    if (availability !== "All") {
      result = result.filter((art) => art.availability === availability);
    }

    // Sorting match
    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
    }

    return result;
  }, [initialArtworks, search, selectedCategory, availability, sortBy]);

  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE);
  const paginatedArtworks = filteredArtworks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const topElement = document.getElementById("gallery-display-top");
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

  return (
    <div className="animate-fade-in-up">
      {/* Premium Visual Control Panel */}
      <div className="panel glass-premium" style={{ padding: "1.2rem", borderRadius: 10, marginBottom: "2rem", display: "grid", gap: 16 }}>
        <div style={{ display: "flex", gap: 12, width: "100%", alignItems: "center", flexWrap: "wrap" }}>
          {/* Live Search Bar */}
          <div style={{ position: "relative", flex: 1, minWidth: 260 }}>
            <Search size={16} color="var(--gold)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} aria-hidden="true" />
            <input
              type="text"
              className="input input-premium"
              placeholder="Search by masterpiece title, artist, or medium..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search masterpieces"
              style={{ paddingLeft: "2.6rem", background: "rgba(28, 15, 5, 0.4)", borderRadius: 6 }}
            />
          </div>

          {/* Action Triggers */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn ${showFilters ? "btn-primary" : "btn-ghost"}`}
              style={{ minHeight: 44, paddingInline: 16 }}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>

            {/* Quick Sort Dropdown */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <select
                className="input input-premium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ minHeight: 44, paddingLeft: "2.2rem", paddingRight: "1.8rem", width: "auto", background: "rgba(28, 15, 5, 0.4)" }}
                aria-label="Sort Artworks"
              >
                <option value="default">Default Order</option>
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ArrowUpDown size={14} color="var(--gold)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showFilters && (
          <div className="animate-fade-in-up" style={{ borderTop: "1px solid var(--border)", paddingTop: "1.2rem", display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {/* Availability Filter */}
              <div className="field">
                <label style={{ fontSize: 10, letterSpacing: "0.15em" }}>Availability Status</label>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  {["All", "For Sale", "Sold"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAvailability(opt)}
                      className={`btn ${availability === opt ? "btn-primary" : "btn-ghost"}`}
                      style={{ minHeight: 34, padding: "0.2rem 0.8rem", flex: 1, fontSize: 11 }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Select Pills */}
            <div className="field" style={{ marginTop: 4 }}>
              <label style={{ fontSize: 10, letterSpacing: "0.15em", marginBottom: 6 }}>Tradition & Category</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`btn ${selectedCategory === "" ? "btn-primary" : "btn-ghost"}`}
                  style={{ minHeight: 32, padding: "0.2rem 0.75rem", fontSize: 11, textTransform: "none", letterSpacing: "0.02em" }}
                >
                  All Traditions
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn ${selectedCategory === cat ? "btn-primary" : "btn-ghost"}`}
                    style={{ minHeight: 32, padding: "0.2rem 0.75rem", fontSize: 11, textTransform: "none", letterSpacing: "0.02em" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Counter & Results */}
      <div id="gallery-display-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.2rem" }}>
        <p className="eyebrow" style={{ color: "var(--muted)", fontSize: 11 }}>
          {totalPages > 1 ? (
            `Displaying ${Math.min(filteredArtworks.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}-${Math.min(filteredArtworks.length, currentPage * ITEMS_PER_PAGE)} of ${filteredArtworks.length} masterpiece${filteredArtworks.length === 1 ? "" : "s"}`
          ) : (
            `Displaying ${filteredArtworks.length} of ${initialArtworks.length} masterpiece${initialArtworks.length === 1 ? "" : "s"}`
          )}
        </p>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory("")}
            style={{ background: "none", border: "none", color: "var(--gold-light)", fontSize: 11, cursor: "pointer", textDecoration: "underline", padding: 0 }}
          >
            Clear category filter
          </button>
        )}
      </div>

      {paginatedArtworks.length > 0 ? (
        <>
          <div className="grid-cards">
            {paginatedArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          {/* Premium Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "3.5rem",
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
      ) : (
        <div className="adire panel wood-frame" style={{ padding: "5rem 1rem", textAlign: "center" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 className="serif" style={{ fontWeight: 400, fontSize: "1.7rem", color: "var(--cream)" }}>No Artworks Found</h3>
            <p className="muted" style={{ maxWidth: 440, margin: "0.5rem auto 0", lineHeight: 1.6 }}>
              We couldn&apos;t find any artworks matching your search or filters. Try adjusting your selections or clear filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setAvailability("All");
                setSortBy("default");
              }}
              className="btn btn-primary"
              style={{ marginTop: "1.5rem", minHeight: 38 }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
