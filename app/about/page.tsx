import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="adire" style={{ minHeight: "calc(100vh - 145px)", padding: "4rem 1rem 5rem" }}>
        <section className="container" style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
          <p className="eyebrow">Our story</p>
          <h1 className="serif" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 400, lineHeight: 1.1 }}>
            Imo ni oro<br /><em style={{ color: "var(--gold-light)", fontSize: "0.55em" }}>Knowledge is wealth</em>
          </h1>
          <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.9 }}>
            Àṣà was founded to give African artists, especially those rooted in Yoruba tradition, a dignified space to share and sell their work with the world. The word Àṣà means culture or tradition in Yoruba.
          </p>
          <p className="muted" style={{ fontSize: "1.05rem", lineHeight: 1.9 }}>
            From the bold geometric patterns of adire cloth, to the sacred bronze castings of Ile-Ife, to contemporary voices reimagining tradition, this gallery celebrates it all.
          </p>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: "2.2rem" }}>
            {[
              ["Original works", "Every piece is verified original art from the artist."],
              ["Direct contact", "Buyers connect directly with Àṣà for purchase support."],
              ["Global reach", "Artists in Lagos, London, Accra and beyond."]
            ].map(([title, description]) => (
              <article className="panel" key={title} style={{ padding: "1rem" }}>
                <h2 className="serif" style={{ fontSize: "1.1rem", fontWeight: 400 }}>{title}</h2>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.7 }}>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
