"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="kente-top site-header">
        <div className="container site-header-container" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link href="/" aria-label="Àṣà home" style={{ display: "flex", alignItems: "center" }}>
            <span className="serif" style={{ display: "block", color: "var(--gold)", fontSize: 30, lineHeight: 1 }}>Àṣà</span>
          </Link>
          <nav aria-label="Primary navigation" className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 24 }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="desktop-nav-link">
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
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((value) => !value)}
            style={{ minHeight: 40, padding: "0.55rem 0.7rem" }}
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`mobile-overlay-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="mobile-overlay-inner">
          <div className="mobile-overlay-header">
            <span className="serif" style={{ color: "var(--gold)", fontSize: 28, lineHeight: 1 }}>Àṣà</span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              style={{ background: "none", border: "none", color: "var(--cream)", cursor: "pointer", padding: 4 }}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <nav className="mobile-overlay-links" aria-label="Mobile navigation">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="mobile-overlay-link"
                style={{ animationDelay: `${index * 60}ms` }}
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
