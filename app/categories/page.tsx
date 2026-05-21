import { ArtworkCard } from "@/components/artwork-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPublishedArtworks } from "@/lib/artworks";
import { CATEGORIES } from "@/lib/categories";

export const revalidate = 30;

export default async function CategoriesPage() {
  const artworks = await listPublishedArtworks();

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ paddingTop: "3.2rem", paddingBottom: "5rem" }}>
        <p className="eyebrow">Browse</p>
        <h1 className="serif" style={{ fontSize: "2.4rem", fontWeight: 400, margin: "0.6rem 0" }}>Shop by Category</h1>
        <p className="muted" style={{ maxWidth: 620, lineHeight: 1.8 }}>Explore artworks by style, tradition, and medium.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10, margin: "2rem 0 3rem" }}>
          {CATEGORIES.map((category) => {
            const count = artworks.filter((art) => art.categories.includes(category)).length;
            return (
              <a key={category} href={`#${encodeURIComponent(category)}`} className="panel card-hover" style={{ padding: "0.9rem" }}>
                <strong style={{ display: "block", fontSize: 14 }}>{category}</strong>
                <span className="muted" style={{ fontSize: 12 }}>{count} work{count === 1 ? "" : "s"}</span>
              </a>
            );
          })}
        </div>
        {CATEGORIES.map((category) => {
          const categoryArt = artworks.filter((art) => art.categories.includes(category));
          if (!categoryArt.length) return null;
          return (
            <section key={category} id={encodeURIComponent(category)} style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem", marginTop: "2rem" }}>
              <h2 className="serif" style={{ fontWeight: 400, fontSize: "1.8rem" }}>{category}</h2>
              <div className="grid-cards">
                {categoryArt.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </>
  );
}
