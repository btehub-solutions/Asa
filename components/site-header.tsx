"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/categories", label: "Categories" },
  { href: "/ask-ai", label: "Ask Atoka" },
  { href: "/join", label: "Join" },
  { href: "/about", label: "About" }
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

  return (
    <header className="kente-top" style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", borderBottom: "1px solid var(--border)", paddingTop: 5 }}>
      <div className="container" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center" }}>
          <span className="serif" style={{ display: "block", color: "var(--gold)", fontSize: 30, lineHeight: 1 }}>Àṣà</span>
        </Link>
        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "var(--muted)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link className="btn btn-primary" href="/admin" style={{ minHeight: 38, paddingInline: 14 }}>
              Admin
            </Link>
          ) : null}
        </nav>
        <button
          className="mobile-menu-button btn btn-ghost"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          style={{ minHeight: 40, padding: "0.55rem 0.7rem" }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {menuOpen ? (
        <nav className="mobile-nav container" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link href="/admin" onClick={() => setMenuOpen(false)}>
              Admin
            </Link>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
