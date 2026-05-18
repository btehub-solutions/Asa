export function SiteFooter() {
  return (
    <footer className="kente-top" style={{ background: "var(--panel)", borderTop: "1px solid var(--border)", padding: "1.6rem 1rem", textAlign: "center" }}>
      <p style={{ color: "var(--muted)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
        Àṣà Art Marketplace · Ona Ibile · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
