import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/format";
import { getArtwork, getArtworkAdmin } from "@/lib/artworks";

export const dynamic = "force-dynamic";

export default async function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const cookieToken = (await cookies()).get("asa_admin")?.value;
  const isAdmin = Boolean(process.env.ADMIN_UPLOAD_TOKEN && cookieToken === process.env.ADMIN_UPLOAD_TOKEN);

  const art = isAdmin ? await getArtworkAdmin(id) : await getArtwork(id);
  if (!art) notFound();

  return (
    <>
      <SiteHeader />
      <main className="container artwork-main-container">
        <Link href="/gallery" className="eyebrow" style={{ display: "inline-block", marginBottom: "1.5rem", color: "var(--muted)" }}>Back to gallery</Link>
        <div className="artwork-layout">
          <div>
            <div className="panel adire museum-frame artwork-image-wrapper" style={{ overflow: "hidden" }}>
              <Image src={art.image_url} alt={art.title} width={1100} height={1300} priority className="artwork-image" style={{ transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
            </div>
            {art.extra_image_urls.length ? (
              <div className="artwork-thumbnail-gallery" aria-label="Additional artwork images">
                {art.extra_image_urls.map((image, index) => (
                  <Image key={image} src={image} alt={`${art.title} detail ${index + 1}`} width={180} height={180} className="artwork-thumbnail" />
                ))}
              </div>
            ) : null}
          </div>
          <section className="animate-fade-in-up">
            <p className="eyebrow" style={{ color: "var(--gold)" }}>Masterpiece</p>
            <h1 className="serif artwork-title" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", marginTop: "0.4rem" }}>{art.title}</h1>
            <p className="muted artwork-artist" style={{ fontSize: "1.1rem", marginBottom: "1.6rem" }}>by <span style={{ color: "var(--cream)" }}>{art.artist_name}</span></p>
            {art.artist_quote ? (
              <blockquote className="serif artwork-quote" style={{ borderLeft: "3px solid var(--gold)", paddingLeft: "1.2rem", color: "var(--gold-light)", fontStyle: "italic", margin: "1.5rem 0", fontSize: "1.1rem", lineHeight: 1.6 }}>
                “{art.artist_quote}”
              </blockquote>
            ) : null}
            
            {/* Museum Catalog Specifications */}
            <div className="artwork-details-list" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "1.2rem 0", margin: "1.8rem 0", display: "grid", gap: 12 }}>
              {[
                ["Medium", art.medium],
                ["Year", art.year_created],
                ["Dimensions", art.dimensions],
              ].filter((item) => item[1]).map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(193, 123, 47, 0.1)", paddingBottom: 6 }}>
                  <span className="eyebrow" style={{ color: "var(--muted)", fontSize: 10 }}>{label}</span>
                  <span style={{ fontSize: 14 }}>{value}</span>
                </div>
              ))}
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(193, 123, 47, 0.1)", paddingBottom: 6 }}>
                <span className="eyebrow" style={{ color: "var(--muted)", fontSize: 10 }}>Availability</span>
                <span style={{ 
                  background: art.availability === "For Sale" ? "rgba(76, 175, 125, 0.15)" : "rgba(255, 180, 168, 0.15)",
                  border: art.availability === "For Sale" ? "1px solid rgba(76, 175, 125, 0.35)" : "1px solid rgba(255, 180, 168, 0.35)",
                  borderRadius: 999,
                  color: art.availability === "For Sale" ? "#4caf7d" : "#ffb4a8",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  padding: "0.2rem 0.6rem",
                  textTransform: "uppercase"
                }}>
                  {art.availability}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 6 }}>
                <span className="eyebrow" style={{ color: "var(--muted)", fontSize: 10 }}>Price</span>
                <span className="serif" style={{ color: "var(--gold-light)", fontSize: "1.6rem", textShadow: "0 0 10px rgba(245, 200, 66, 0.15)" }}>{formatPrice(art.price)}</span>
              </div>
            </div>

            <div className="artwork-tags" style={{ marginBottom: "1.6rem" }}>
              {art.categories.map((category) => (
                <span key={category} className="chip" style={{ borderColor: "rgba(193, 123, 47, 0.25)", color: "var(--gold)", padding: "0.3rem 0.75rem", fontSize: 11 }}>{category}</span>
              ))}
            </div>
            {art.cultural_significance ? <InfoBlock title="Cultural Significance" text={art.cultural_significance} /> : null}
            {art.yoruba_connection ? <InfoBlock title="Yoruba Connection" text={art.yoruba_connection} /> : null}
            
            {/* VIP Concierge Acquisition Portal */}
            {art.availability !== "Sold" && art.price != null ? (
              <div className="panel kente-top glass-premium mobile-no-panel" style={{ marginTop: "2rem", padding: "1.8rem", borderRadius: 10 }}>
                <p className="eyebrow" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "0.6rem", color: "var(--gold-light)" }}>Acquire this masterpiece</p>
                <p className="muted" style={{ lineHeight: 1.7, marginBottom: "1.6rem", fontSize: 13 }}>
                  This authentic work is held in our secure collection. Connect with our curatorial team to discuss acquisitions, custom framing, and bespoke global delivery services.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.8rem" }}>
                  <a href={`mailto:hello@asa.com?subject=Acquisition Inquiry: ${art.title}`} className="btn btn-primary" style={{ width: "100%", boxShadow: "0 4px 15px rgba(193,123,47,0.35)" }}>Inquire to Buy</a>
                  <a href={`mailto:hello@asa.com?subject=Private Offer: ${art.title}`} className="btn btn-ghost" style={{ width: "100%", background: "rgba(28, 15, 5, 0.3)" }}>Propose Private Offer</a>
                </div>
              </div>
            ) : null}
          </section>
        </div>
        {(art.artist_image_url || art.artist_bio || art.artist_story || art.piece_story) ? (
          <div className="artwork-about-grid">
            {(art.artist_image_url || art.artist_bio || art.artist_story) ? (
              <ArtistProfileBlock
                artistName={art.artist_name}
                imageUrl={art.artist_image_url}
                bio={art.artist_bio}
                story={art.artist_story}
              />
            ) : null}
            {art.piece_story ? <InfoBlock title="Story Behind This Work" text={art.piece_story} /> : null}
          </div>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <section className="panel mobile-no-panel" style={{ padding: "1rem 1.1rem", marginBottom: "0.8rem" }}>
      <p className="eyebrow">{title}</p>
      <p className="muted" style={{ lineHeight: 1.8, marginBottom: 0 }}>{text}</p>
    </section>
  );
}

function ArtistProfileBlock({
  artistName,
  imageUrl,
  bio,
  story,
}: {
  artistName: string;
  imageUrl: string | null;
  bio: string | null;
  story: string | null;
}) {
  return (
    <section className="panel mobile-no-panel" style={{ display: "grid", gap: "1rem", marginBottom: "0.8rem", overflow: "hidden", padding: "1rem 1.1rem" }}>
      {imageUrl ? (
        <div className="artist-profile-img">
          <Image src={imageUrl} alt={artistName} fill sizes="(max-width: 768px) 100vw, 420px" style={{ objectFit: "cover", objectPosition: "center top" }} />
        </div>
      ) : null}
      <div>
        <p className="eyebrow">About the Artist</p>
        <h2 className="serif" style={{ color: "var(--cream)", fontSize: "1.35rem", fontWeight: 400, margin: "0 0 0.6rem" }}>{artistName}</h2>
        {bio ? <p className="muted" style={{ lineHeight: 1.8, marginBottom: story ? "0.9rem" : 0 }}>{bio}</p> : null}
        {story ? <p className="muted" style={{ lineHeight: 1.8, marginBottom: 0 }}>{story}</p> : null}
      </div>
    </section>
  );
}
