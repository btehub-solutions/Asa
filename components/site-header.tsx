"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/categories", label: "Categories" },
  { href: "/ask-ai", label: "Ask Atọ́ka" },
  { href: "/join", label: "Join" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="kente-top" style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", borderBottom: "1px solid var(--border)", paddingTop: 5 }}>
        <div className="container" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <span className="serif" style={{ display: "block", color: "var(--gold)", fontSize: 30, lineHeight: 1 }}>Àṣà</span>
          </Link>
          <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: "var(--muted)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {link.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link className="btn btn-primary" href="/admin" style={{ minHeight: 38, paddingInline: 14 }}>Admin</Link>
            ) : null}
          </nav>
          <button
            className="mobile-menu-button btn btn-ghost"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ minHeight: 40, padding: "0.55rem 0.7rem" }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Full-screen mobile overlay menu */}
      <div className={`mobile-overlay-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-overlay-inner">
          {/* Header row */}
          <div className="mobile-overlay-header">
            <span className="serif" style={{ color: "var(--gold)", fontSize: 28, lineHeight: 1 }}>Àṣà</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              style={{ background: "none", border: "none", color: "var(--cream)", cursor: "pointer", padding: 4 }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="mobile-overlay-links">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="mobile-overlay-link"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link href="/admin" onClick={() => setMenuOpen(false)} className="mobile-overlay-link" style={{ color: "var(--gold)", animationDelay: `${links.length * 60}ms` }}>
                Admin Dashboard
              </Link>
            ) : null}
          </nav>

          {/* CTA + socials at bottom */}
          <div className="mobile-overlay-footer">
            <Link href="/gallery" className="btn btn-primary" onClick={() => setMenuOpen(false)} style={{ width: "100%", justifyContent: "center", borderRadius: 40, padding: "0.9rem 1.5rem" }}>
              Browse Gallery
            </Link>
            <p className="muted" style={{ fontSize: 11, textAlign: "center", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "1.5rem" }}>
              African Art · Curated with Purpose
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

