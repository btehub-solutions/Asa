import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/lib/format";
import { getArtwork } from "@/lib/artworks";

export const revalidate = 30;

export default async function ArtworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const art = await getArtwork(id);
  if (!art) notFound();

  return (
    <>
      <SiteHeader />
      <main className="container" style={{ padding: "3rem 0 5rem" }}>
        <Link href="/" className="eyebrow" style={{ display: "inline-block", marginBottom: "2rem", color: "var(--muted)" }}>Back to gallery</Link>
        <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "3rem", alignItems: "start" }}>
          <div>
            <div className="panel adire" style={{ minHeight: 420, position: "relative", overflow: "hidden" }}>
              <Image src={art.image_url} alt={art.title} width={1100} height={1300} priority style={{ width: "100%", height: "auto", maxHeight: "72vh", objectFit: "contain", position: "relative", zIndex: 1, display: "block" }} />
            </div>
            {art.extra_image_urls.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))", gap: 10, marginTop: 10 }}>
                {art.extra_image_urls.map((image) => (
                  <Image key={image} src={image} alt="" width={180} height={180} style={{ aspectRatio: "1", objectFit: "cover", border: "1px solid var(--border)", borderRadius: 5 }} />
                ))}
              </div>
            ) : null}
          </div>
          <section>
            <p className="eyebrow">Artwork</p>
            <h1 className="serif" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 400, lineHeight: 1.08, margin: "0.7rem 0 0.25rem" }}>{art.title}</h1>
            <p className="muted" style={{ margin: "0 0 1.4rem", fontSize: "1.05rem" }}>by {art.artist_name}</p>
            {art.artist_quote ? (
              <blockquote className="serif" style={{ borderLeft: "3px solid var(--gold)", color: "var(--gold-light)", fontStyle: "italic", margin: "0 0 1.4rem", paddingLeft: "1rem" }}>
                “{art.artist_quote}”
              </blockquote>
            ) : null}
            <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "1rem 0", marginBottom: "1.2rem", display: "grid", gap: 12 }}>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1.2rem" }}>
              {art.categories.map((category) => (
                <span key={category} style={{ border: "1px solid var(--border)", borderRadius: 999, color: "var(--gold)", fontSize: 12, padding: "0.28rem 0.7rem" }}>{category}</span>
              ))}
            </div>
            {art.cultural_significance ? <InfoBlock title="Cultural Significance" text={art.cultural_significance} /> : null}
            {art.yoruba_connection ? <InfoBlock title="Yoruba Connection" text={art.yoruba_connection} /> : null}
            {art.availability !== "Sold" && art.price != null ? (
              <div className="panel kente-top" style={{ marginTop: "1rem", padding: "1.2rem" }}>
                <p className="eyebrow">Interested in this work?</p>
                <p className="muted" style={{ lineHeight: 1.7 }}>Contact the Àṣà team to inquire about this piece and arrange purchase.</p>
              </div>
            ) : null}
          </section>
        </div>
        {(art.artist_bio || art.piece_story) ? (
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.4rem", marginTop: "3rem" }}>
            {art.artist_bio ? <InfoBlock title="About the Artist" text={art.artist_bio} /> : null}
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
    <section className="panel" style={{ padding: "1rem 1.1rem", marginBottom: "0.8rem" }}>
      <p className="eyebrow">{title}</p>
      <p className="muted" style={{ lineHeight: 1.8, marginBottom: 0 }}>{text}</p>
    </section>
  );
}
