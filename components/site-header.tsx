"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/categories", label: "Shop by Category" },
  { href: "/ask-ai", label: "Ask AI" },
  { href: "/join", label: "Join Àṣà" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setIsAdmin(Boolean(data.isAdmin)))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <header className="kente-top" style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
      <div className="container" style={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo />
          <span>
            <span className="serif" style={{ display: "block", color: "var(--gold)", fontSize: 22, lineHeight: 1 }}>Àṣà</span>
            <span style={{ display: "block", color: "var(--muted)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase" }}>Art Marketplace</span>
          </span>
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
      </div>
    </header>
  );
}
