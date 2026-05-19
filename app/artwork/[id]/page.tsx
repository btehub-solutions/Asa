import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/format";
import { cookies } from "next/headers";
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
        <Link href="/" className="eyebrow" style={{ display: "inline-block", marginBottom: "1.5rem", color: "var(--muted)" }}>Back to gallery</Link>
        <div className="artwork-layout">
          <div>
            <div className="panel adire artwork-image-wrapper">
              <Image src={art.image_url} alt={art.title} width={1100} height={1300} priority className="artwork-image" />
            </div>
            {art.extra_image_urls.length ? (
              <div className="artwork-thumbnail-gallery">
                {art.extra_image_urls.map((image) => (
                  <Image key={image} src={image} alt="" width={180} height={180} className="artwork-thumbnail" />
                ))}
              </div>
            ) : null}
          </div>
          <section>
            <p className="eyebrow">Artwork</p>
            <h1 className="serif artwork-title">{art.title}</h1>
            <p className="muted artwork-artist">by {art.artist_name}</p>
            {art.artist_quote ? (
              <blockquote className="serif artwork-quote">
                “{art.artist_quote}”
              </blockquote>
            ) : null}
            <div className="artwork-details-list">
              {[
                ["Medium", art.medium],
                ["Year", art.year_created],
                ["Dimensions", art.dimensions],
                ["Availability", art.availability]
              ].filter((item) => item[1]).map(([label, value]) => (
                <p key={label} style={{ margin: 0, display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span className="eyebrow" style={{ color: "var(--muted)" }}>{label}</span>
                  <span>{value}</span>
                </p>
              ))}
              <p style={{ margin: 0, display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="eyebrow" style={{ color: "var(--muted)" }}>Price</span>
                <span className="serif" style={{ color: "var(--gold-light)", fontSize: "1.45rem" }}>{formatPrice(art.price)}</span>
              </p>
            </div>
            <div className="artwork-tags">
              {art.categories.map((category) => (
                <span key={category} style={{ border: "1px solid var(--border)", borderRadius: 999, color: "var(--gold)", fontSize: 12, padding: "0.28rem 0.7rem" }}>{category}</span>
              ))}
            </div>
            {art.cultural_significance ? <InfoBlock title="Cultural Significance" text={art.cultural_significance} /> : null}
            {art.yoruba_connection ? <InfoBlock title="Yoruba Connection" text={art.yoruba_connection} /> : null}
            {art.availability !== "Sold" && art.price != null ? (
              <div className="panel kente-top mobile-no-panel" style={{ marginTop: "1.5rem", padding: "1.5rem" }}>
                <p className="eyebrow" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", marginBottom: "0.6rem" }}>Acquire this piece</p>
                <p className="muted" style={{ lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Contact the Àṣà team to reserve this artwork or propose a private offer.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.8rem" }}>
                  <a href={`mailto:hello@asa.com?subject=Inquiry: ${art.title}`} className="btn btn-primary" style={{ width: "100%" }}>Inquire to Buy</a>
                  <a href={`mailto:hello@asa.com?subject=Offer: ${art.title}`} className="btn btn-ghost" style={{ width: "100%", background: "var(--panel-2)" }}>Make an Offer</a>
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
