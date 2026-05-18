import Image from "next/image";
import Link from "next/link";
import { ArtworkCard } from "@/components/artwork-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listPublishedArtworks } from "@/lib/artworks";
import { CATEGORIES } from "@/lib/categories";

export const revalidate = 30;

const categoryFeatures = [
  ["Adire", "Indigo cloth, resist-dye pattern, textile memory"],
  ["Yoruba Cultural", "Ancestral symbols, proverbs, sacred forms"],
  ["Benin Bronze", "Royal bronze language, relief, sculptural history"],
  ["Textile Art", "Fabric, fiber, wearable cultural expression"],
  ["Sculpture", "Wood, bronze, clay, and carved presence"],
  ["Contemporary African", "Modern voices rooted in heritage"]
];

const testimonials = [
  ["Amara K.", "Collector, London", "Àṣà helped me understand the story behind the work before I bought it. That changed everything."],
  ["David O.", "Interior Curator", "The gallery feels intimate, premium, and culturally alive. It is exactly what African art commerce needs."],
  ["Sade B.", "Diaspora Collector", "I came for one piece and stayed for the artists' stories."]
];

export default async function HomePage() {
  const artworks = await listPublishedArtworks();
  const featured = artworks.slice(0, 6);
  const trending = [...artworks].sort((a, b) => (b.price ?? 0) - (a.price ?? 0)).slice(0, 3);
  const artists = uniqueArtists(artworks).slice(0, 3);
  const bronzeWorks = artworks.filter((art) =>
    art.categories.some((category) => category.toLowerCase().includes("bronze") || category.toLowerCase().includes("sculpt"))
  ).slice(0, 3);
  const storyWorks = artworks.filter((art) => art.piece_story || art.cultural_significance || art.yoruba_connection).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <section className="adire kente-top bronze-glow" style={{ borderBottom: "1px solid var(--border)", minHeight: "calc(100vh - 72px)", display: "grid", placeItems: "center", padding: "5.5rem 1rem 4.5rem" }}>
        <div className="container responsive-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "3rem", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <p className="eyebrow">Ona Ibile · Curated African Art</p>
            <h1 className="serif" style={{ fontSize: "clamp(3rem, 8vw, 6.8rem)", fontWeight: 400, lineHeight: 0.98, margin: "1rem 0" }}>
              Where Art Speaks <em style={{ color: "var(--gold)", display: "block" }}>Culture</em>
            </h1>
            <p className="muted" style={{ maxWidth: 620, fontSize: "1.12rem", lineHeight: 1.85 }}>
              A curated marketplace celebrating African art and heritage, from Ile-Ife to the world.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: "2rem" }}>
              <Link className="btn btn-primary" href="/gallery">Browse Gallery</Link>
              <Link className="btn btn-ghost" href="/ask-ai">Ask AI Coach</Link>
            </div>
          </div>
          <div className="wood-frame" style={{ border: "1px solid var(--border-strong)", borderRadius: 10, padding: 14, background: "rgba(28, 15, 5, 0.62)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 0.74fr", gap: 12 }}>
              {featured.slice(0, 3).map((art, index) => (
                <Link key={art.id} href={`/artwork/${art.slug || art.id}`} className="panel card-hover" style={{ minHeight: index === 0 ? 360 : 174, gridRow: index === 0 ? "span 2" : undefined, overflow: "hidden", position: "relative" }}>
                  <Image src={art.image_url} alt={art.title} fill sizes="420px" style={{ objectFit: "cover" }} />
                  <span style={{ background: "linear-gradient(transparent, rgba(28,15,5,0.92))", inset: 0, position: "absolute" }} />
                  <span className="serif" style={{ bottom: 16, color: "var(--cream)", fontSize: index === 0 ? 25 : 16, left: 16, position: "absolute", right: 16 }}>{art.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main>
        <section id="featured-works" className="container section-shell">
          <SectionHead eyebrow="Current Exhibition" title="Featured Works" aside={`${featured.length} work${featured.length === 1 ? "" : "s"} on view`} />
          {featured.length ? <div className="grid-cards">{featured.map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}</div> : <EmptyGallery />}
        </section>

        <section className="section-shell" style={{ background: "linear-gradient(180deg, rgba(46,26,10,0.36), transparent)" }}>
          <div className="container">
            <SectionHead eyebrow="Featured voices" title="Yoruba & African Artists" />
            <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {artists.map((artist) => <ArtistCard key={artist.name} artist={artist} />)}
            </div>
          </div>
        </section>

        <section className="container section-shell">
          <SectionHead eyebrow="Browse by tradition" title="Shop by Category" />
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {categoryFeatures.map(([name, description], index) => (
              <Link key={name} href="/categories" className="panel card-hover wood-frame" style={{ padding: "1.2rem", minHeight: 142 }}>
                <span style={{ color: "var(--gold-light)", fontSize: 22 }}>{["✣", "◈", "●", "◆", "✦", "◎"][index]}</span>
                <h3 className="serif" style={{ fontSize: "1.25rem", fontWeight: 400, margin: "0.7rem 0 0.35rem" }}>{name}</h3>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>{description}</p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.slice(0, 12).map((category) => <span className="chip" key={category}>{category}</span>)}
          </div>
        </section>

        <section className="bronze-glow section-shell">
          <div className="container responsive-grid" style={{ display: "grid", gridTemplateColumns: "0.78fr 1.22fr", gap: "2rem", alignItems: "center" }}>
            <div>
              <p className="eyebrow">Material memory</p>
              <h2 className="serif section-title">Discover Benin Bronze Art Styles</h2>
              <p className="muted" style={{ lineHeight: 1.85 }}>Explore sculptural works inspired by bronze relief, royal forms, ceremonial memory, and West African metal traditions.</p>
              <Link className="btn btn-primary" href="/categories">Browse Sculptural Works</Link>
            </div>
            <div className="grid-cards">
              {(bronzeWorks.length ? bronzeWorks : featured.slice(0, 3)).map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}
            </div>
          </div>
        </section>

        <section className="container section-shell">
          <SectionHead eyebrow="Meaning behind the work" title="Stories & Inspiration" />
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {(storyWorks.length ? storyWorks : featured.slice(0, 3)).map((art) => (
              <Link key={art.id} href={`/artwork/${art.slug || art.id}`} className="panel card-hover" style={{ padding: "1.2rem" }}>
                <p className="eyebrow">{art.cultural_roots ?? "Cultural Story"}</p>
                <h3 className="serif" style={{ fontWeight: 400, fontSize: "1.35rem" }}>{art.title}</h3>
                <p className="muted" style={{ lineHeight: 1.75 }}>{art.piece_story || art.cultural_significance || art.yoruba_connection || "A work shaped by memory, material, and cultural imagination."}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-shell">
          <SectionHead eyebrow="Collector attention" title="Trending / Popular Artworks" />
          <div className="grid-cards">{(trending.length ? trending : featured.slice(0, 3)).map((artwork) => <ArtworkCard key={artwork.id} artwork={artwork} />)}</div>
        </section>

        <section className="adire kente-top section-shell" style={{ background: "var(--panel)", textAlign: "center" }}>
          <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 760 }}>
            <p className="eyebrow">Join the Movement</p>
            <h2 className="serif section-title">Bring your work into the Àṣà gallery</h2>
            <p className="muted" style={{ lineHeight: 1.85 }}>We partner with artists through a curated consignment model that honors the work, the story, and the collector relationship.</p>
            <Link className="btn btn-primary" href="/join">Join Àṣà</Link>
          </div>
        </section>

        <section className="container section-shell">
          <SectionHead eyebrow="Collector words" title="Testimonials" />
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {testimonials.map(([name, role, quote]) => (
              <figure className="panel wood-frame" key={name} style={{ margin: 0, padding: "1.3rem" }}>
                <blockquote className="serif" style={{ color: "var(--cream)", fontSize: "1.2rem", lineHeight: 1.55, margin: 0 }}>“{quote}”</blockquote>
                <figcaption className="muted" style={{ marginTop: "1rem", fontSize: 13 }}>{name} · {role}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function SectionHead({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: string }) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, marginBottom: "1.8rem", paddingBottom: "1.2rem" }}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="serif section-title">{title}</h2>
      </div>
      {aside ? <span className="muted" style={{ fontSize: 14 }}>{aside}</span> : null}
    </div>
  );
}

function ArtistCard({ artist }: { artist: ReturnType<typeof uniqueArtists>[number] }) {
  return (
    <article className="panel card-hover wood-frame" style={{ overflow: "hidden" }}>
      <div style={{ background: "var(--panel-2)", height: 210, position: "relative" }}>
        {artist.image ? <Image src={artist.image} alt={artist.name} fill sizes="360px" style={{ objectFit: "cover" }} /> : <div className="adire" style={{ height: "100%" }} />}
      </div>
      <div style={{ padding: "1.15rem" }}>
        <p className="eyebrow">{artist.roots}</p>
        <h3 className="serif" style={{ fontSize: "1.35rem", fontWeight: 400, margin: "0.45rem 0" }}>{artist.name}</h3>
        <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>{artist.bio}</p>
        <p className="serif" style={{ color: "var(--gold-light)", fontStyle: "italic", lineHeight: 1.55 }}>“{artist.quote}”</p>
      </div>
    </article>
  );
}

function EmptyGallery() {
  return (
    <div className="adire panel" style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 className="serif" style={{ fontWeight: 400, fontSize: "1.7rem" }}>No works yet</h3>
        <p className="muted">The gallery is ready. Use Admin Upload to add the first work.</p>
      </div>
    </div>
  );
}

function uniqueArtists(artworks: Awaited<ReturnType<typeof listPublishedArtworks>>) {
  const artists = new Map<string, {
    name: string;
    image: string | null;
    bio: string;
    quote: string;
    roots: string;
  }>();

  for (const art of artworks) {
    if (!artists.has(art.artist_name)) {
      artists.set(art.artist_name, {
        name: art.artist_name,
        image: art.artist_image_url,
        bio: art.artist_bio || art.artist_story || `${art.artist_name} creates work shaped by heritage, material, and contemporary African imagination.`,
        quote: art.artist_quote || "Art keeps memory alive while making room for tomorrow.",
        roots: art.cultural_roots || art.city_base || "African heritage"
      });
    }
  }

  return Array.from(artists.values());
}
