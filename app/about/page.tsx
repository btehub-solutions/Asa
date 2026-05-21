import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="adire animate-fade-in-up" style={{ minHeight: "calc(100vh - 145px)", padding: "4rem 1.5rem 6rem" }}>
        
        {/* Section 1: Our Story */}
        <section className="container" style={{ position: "relative", zIndex: 1, maxWidth: 880, marginBottom: "4rem" }}>
          <p className="eyebrow" style={{ textAlign: "center", marginBottom: "0.5rem" }}>Our story</p>
          <h1 className="serif text-gold-gradient" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 400, lineHeight: 1.1, textAlign: "center", marginBottom: "2rem" }}>
            Imo ni oro<br />
            <em style={{ color: "var(--gold-light)", fontSize: "0.45em", fontStyle: "italic", display: "block", marginTop: "0.4rem" }}>
              Knowledge is wealth
            </em>
          </h1>
          
          <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
            <p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.95, marginBottom: "1.5rem" }}>
              Àṣà was founded to give African artists, especially those rooted in Yoruba tradition, a dignified space to share and sell their work with the world. The word <strong style={{ color: "var(--cream)" }}>Àṣà</strong> means culture or tradition in Yoruba.
            </p>
            <p className="muted" style={{ fontSize: "1.1rem", lineHeight: 1.95, marginBottom: "3rem" }}>
              From the bold geometric patterns of Abeokuta&apos;s adire cloth, to the sacred bronze castings of Ile-Ife, to contemporary voices reimagining tradition, this gallery celebrates it all.
            </p>
          </div>

          <div className="about-story-grid">
            {[
              ["Original works", "Every piece is verified original art from the artist."],
              ["Direct contact", "Buyers connect directly with Àṣà for purchase support."],
              ["Global reach", "Artists in Lagos, London, Accra and beyond."]
            ].map(([title, description]) => (
              <article className="panel wood-frame glass-premium" key={title} style={{ padding: "1.5rem", borderRadius: "6px" }}>
                <h2 className="serif" style={{ fontSize: "1.2rem", fontWeight: 400, color: "var(--gold-light)", marginBottom: "0.5rem" }}>{title}</h2>
                <p className="muted" style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Decorative Divider Motif */}
        <div className="container" style={{ maxWidth: 880, marginBottom: "4.5rem" }}>
          <div className="motif-divider"></div>
        </div>

        {/* Section 2: Meet the Founder */}
        <section className="container" style={{ position: "relative", zIndex: 1, maxWidth: 940 }}>
          <div className="about-founder-grid">
            
            {/* Founder Portrait Column */}
            <div>
              <div className="museum-frame glass-premium" style={{
                position: "relative",
                width: "100%",
                aspectRatio: "4/5",
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: "0 25px 50px rgba(0,0,0,0.65), 0 0 35px rgba(193, 123, 47, 0.15)",
                border: "1px solid var(--border-strong)"
              }}>
                <Image 
                  src="/images/founder.jpg" 
                  alt="Ben Sam Oladoyin" 
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                  priority
                />
              </div>
            </div>

            {/* Founder Biography Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--gold)", letterSpacing: "0.2em", marginBottom: "0.4rem" }}>
                  FOUNDER &amp; LEAD VISIONARY
                </p>
                <h2 className="serif text-gold-gradient" style={{ fontSize: "2.8rem", fontWeight: 400, margin: "0 0 0.5rem", lineHeight: 1.1 }}>
                  Ben Sam Oladoyin
                </h2>
                <p className="muted" style={{ fontSize: "1.05rem", color: "var(--cream)", fontStyle: "italic", borderBottom: "1px solid var(--border)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
                  AI/ML Engineer, Founder of BTEHub Solutions, &amp; Tech Ecosystem Advocate
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <p className="muted" style={{ fontSize: "0.98rem", lineHeight: 1.85, margin: 0 }}>
                  Ben Sam Oladoyin is a distinguished AI/ML Engineer and the Founder of <strong style={{ color: "var(--cream)" }}>BTEHub Solutions</strong>, a tech-forward brand focused on building intelligent automation systems, scalable AI solutions, and next-generation digital experiences. He has led impactful projects across AI automation, intelligent assistant systems, computer vision, and enterprise-focused AI applications.
                </p>
                <p className="muted" style={{ fontSize: "0.98rem", lineHeight: 1.85, margin: 0 }}>
                  Beyond engineering, Ben plays an active role in the Nigerian tech ecosystem. He currently oversees digital strategy at <strong style={{ color: "var(--cream)" }}>NBI Institute</strong> and serves as a Cluster Team Lead for the <strong style={{ color: "var(--cream)" }}>Ogun Tech Community</strong>, where he advocates for innovation, technical growth, and tech-driven policy development. Passionate about the future of AI in Africa, he is committed to advancing applied artificial intelligence while mentoring and empowering the next generation of African tech talent.
                </p>
              </div>

              {/* Inspiring Founder Quote Block */}
              <div className="panel wood-frame glass-premium" style={{ 
                padding: "2rem", 
                borderRadius: "6px", 
                position: "relative",
                border: "1px solid rgba(193, 123, 47, 0.25)",
                background: "linear-gradient(135deg, rgba(91, 52, 23, 0.15), rgba(36, 21, 8, 0.4))",
                marginTop: "1.5rem"
              }}>
                <span style={{ 
                  position: "absolute", 
                  top: "-15px", 
                  left: "20px", 
                  fontSize: "4.5rem", 
                  fontFamily: "Playfair Display, serif", 
                  color: "rgba(193, 123, 47, 0.25)", 
                  lineHeight: 1,
                  pointerEvents: "none"
                }}>“</span>
                <blockquote className="serif" style={{ 
                  fontWeight: 400, 
                  fontSize: "1.25rem", 
                  color: "var(--cream)", 
                  lineHeight: 1.6, 
                  margin: 0,
                  fontStyle: "italic",
                  position: "relative",
                  zIndex: 1
                }}>
                  Àṣà started the day I went to an art exhibition and I noticed a lot of artistic talent, skill, and great work, but no platform where they can show their work to the global stage. So that inspired me to be able to build a global platform where local artists will be able to reach the global market with their arts. That is what led me to build Àṣà.
                </blockquote>
              </div>
            </div>

          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
