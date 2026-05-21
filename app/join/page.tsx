"use client";

import { useState, useRef } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function JoinPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(formData: FormData) {
    setStatus("loading");
    setMessage("");

    const res = await fetch("/api/join", { method: "POST", body: formData });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Could not submit the application.");
      setStatus("error");
      return;
    }

    setStatus("success");
  }

  const validateAndNext = () => {
    if (!formRef.current) return;
    
    // Select all inputs in Step 1
    const inputs = formRef.current.querySelectorAll<HTMLInputElement>(
      "#name, #email, #phone, #location, #instagram, #website"
    );
    
    let isValid = true;
    for (const input of Array.from(inputs)) {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      setCurrentStep(2);
    }
  };

  return (
    <>
      <SiteHeader />
      {status === "success" ? (
        <main className="container" style={{ maxWidth: 680, padding: "7rem 1.5rem", display: "flex", justifyContent: "center" }}>
          <div className="glass-premium museum-frame animate-fade-in-up" style={{ 
            padding: "3.5rem 3rem", 
            textAlign: "center", 
            borderRadius: "4px",
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            {/* Wax Seal Visual */}
            <div style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "radial-gradient(circle, #8a1f11 30%, #520b02 90%)",
              border: "3px double var(--gold)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.2)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 2rem",
              position: "relative",
              transform: "rotate(-5deg)",
              cursor: "default"
            }}>
              {/* Wax drip edges */}
              <div style={{
                position: "absolute",
                top: -5, left: 10, right: 10, bottom: -5,
                borderRadius: "45%",
                border: "2px solid rgba(255, 215, 0, 0.15)",
                pointerEvents: "none"
              }} />
              <span className="serif" style={{ 
                color: "var(--gold)", 
                fontSize: "2.2rem", 
                fontWeight: "bold",
                textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                fontFamily: "var(--font-serif)"
              }}>À</span>
            </div>

            <p className="eyebrow" style={{ color: "var(--gold)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>MEMBERSHIP RECEIVED</p>
            <h1 className="serif text-gold-gradient" style={{ fontWeight: 400, fontSize: "2.6rem", margin: "0 0 1.5rem 0", lineHeight: 1.2 }}>
              Welcome to the Àṣà Circle
            </h1>
            
            <div style={{ 
              width: "50px", 
              height: "1px", 
              background: "linear-gradient(90deg, transparent, var(--gold), transparent)", 
              margin: "0 auto 2rem" 
            }} />

            <p className="muted" style={{ lineHeight: 1.9, fontSize: "1.05rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
              Your application has been cataloged into our private registry. Our curatorial review board will evaluate your portfolio and reach out regarding consignment opportunities within 5 to 7 business days.
            </p>

            <button 
              onClick={() => window.location.href = "/"}
              className="btn btn-primary" 
              style={{ padding: "0.8rem 2.5rem", letterSpacing: "0.08em" }}
            >
              Return to Gallery
            </button>
          </div>
        </main>
      ) : (
        <main className="container two-col animate-fade-in-up" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", padding: "4rem 0 6rem", alignItems: "stretch" }}>
          
          {/* Information & Timeline Side */}
          <section className="glass-premium museum-frame" style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRadius: "4px" }}>
            <div>
              <p className="eyebrow" style={{ color: "var(--gold)" }}>ARTIST CONSIGNMENT</p>
              <h1 className="serif text-gold-gradient" style={{ fontWeight: 400, fontSize: "2.8rem", margin: "0.5rem 0 1.5rem", lineHeight: 1.15 }}>
                Represent Your Legacy
              </h1>
              <p className="muted" style={{ lineHeight: 1.8, fontSize: "1.02rem", marginBottom: "2.5rem" }}>
                Àṣà collaborates with elite contemporary African artists to exhibit masterpieces on a global stage. We manage high-resolution presentation, collector consultations, transactions, and secure international logistics.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                {[
                  { step: "01", title: "Consignment Proposal", desc: "Submit your catalog of masterpieces." },
                  { step: "02", title: "Curator Selection", desc: "Our board reviews style, authenticity, and provenance." },
                  { step: "03", title: "Private Agreement", desc: "We align on dynamic valuations and commission structures." },
                  { step: "04", title: "Exhibition Listing", desc: "We place your work in high-resolution public & private catalogs." }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}>
                    <span className="serif" style={{ color: "var(--gold)", fontSize: "1.2rem", fontWeight: "bold", border: "1px solid rgba(193,123,47,0.3)", borderRadius: "50%", width: 34, height: 34, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      {item.step}
                    </span>
                    <div>
                      <h4 style={{ margin: "0 0 0.15rem 0", color: "var(--cream)", fontWeight: 500, fontSize: "1rem" }}>{item.title}</h4>
                      <p className="muted" style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.4 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(193,123,47,0.15)" }}>
              <p className="muted" style={{ fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
                Note: Originality and cultural heritage verification is a prerequisite for final onboarding.
              </p>
            </div>
          </section>

          {/* Form & Wizard Side */}
          <section className="glass-premium" style={{ padding: "3rem 2.5rem", borderRadius: "4px", border: "1px solid var(--border)" }}>
            
            {/* Step Progress Indicator */}
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem", borderBottom: "1px solid rgba(193, 123, 47, 0.15)", paddingBottom: "1.5rem" }}>
              <div style={{ flex: 1, display: "flex", gap: "0.75rem", alignItems: "center", cursor: currentStep === 2 ? "pointer" : "default" }} onClick={() => currentStep === 2 && setCurrentStep(1)}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  background: currentStep === 1 ? "var(--gold)" : "rgba(193, 123, 47, 0.1)",
                  color: currentStep === 1 ? "var(--dark)" : "var(--gold)",
                  border: "1px solid var(--gold)",
                  fontWeight: "bold", fontSize: "0.9rem",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                }}>1</div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: currentStep === 1 ? "var(--cream)" : "var(--muted)", fontWeight: 600 }}>Step 1</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 500, color: currentStep === 1 ? "var(--gold)" : "var(--muted)", whiteSpace: "nowrap" }}>Identity & Links</p>
                </div>
              </div>
              
              <div style={{ flex: 1, display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "grid", placeItems: "center",
                  background: currentStep === 2 ? "var(--gold)" : "rgba(193, 123, 47, 0.05)",
                  color: currentStep === 2 ? "var(--dark)" : "var(--gold)",
                  border: `1px solid ${currentStep === 2 ? "var(--gold)" : "rgba(193, 123, 47, 0.3)"}`,
                  fontWeight: "bold", fontSize: "0.9rem",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                }}>2</div>
                <div>
                  <p style={{ margin: 0, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: currentStep === 2 ? "var(--cream)" : "var(--muted)", fontWeight: 600 }}>Step 2</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 500, color: currentStep === 2 ? "var(--gold)" : "var(--muted)", whiteSpace: "nowrap" }}>Artistry & Vision</p>
                </div>
              </div>
            </div>

            <form ref={formRef} action={submit}>
              
              {/* STEP 1 FIELDS (Uses display: none when inactive so FormData is preserved) */}
              <div style={{ display: currentStep === 1 ? "flex" : "none", flexDirection: "column", gap: "1.25rem" }} className="animate-fade-in-up">
                <h3 className="serif" style={{ margin: "0 0 0.5rem 0", color: "var(--cream)", fontWeight: 400, fontSize: "1.5rem" }}>Creative Identity</h3>
                
                <div className="field">
                  <label htmlFor="name" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Full Name *</label>
                  <input className="input" id="name" name="name" type="text" placeholder="Your full name" required style={{ width: "100%" }} />
                </div>
                
                <div className="field">
                  <label htmlFor="email" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Email Address *</label>
                  <input className="input" id="email" name="email" type="email" placeholder="your@email.com" required style={{ width: "100%" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="field">
                    <label htmlFor="phone" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Phone Number</label>
                    <input className="input" id="phone" name="phone" type="tel" placeholder="+1 234 567 8900" style={{ width: "100%" }} />
                  </div>
                  <div className="field">
                    <label htmlFor="location" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>City / Country</label>
                    <input className="input" id="location" name="location" type="text" placeholder="Lagos, Nigeria" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="instagram" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Instagram Handle</label>
                  <input className="input" id="instagram" name="instagram" type="text" placeholder="@yourhandle" style={{ width: "100%" }} />
                </div>

                <div className="field">
                  <label htmlFor="website" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Portfolio or Website</label>
                  <input className="input" id="website" name="website" type="url" placeholder="https://yourportfolio.com" style={{ width: "100%" }} />
                </div>

                <button 
                  type="button" 
                  onClick={validateAndNext}
                  className="btn btn-primary" 
                  style={{ width: "100%", marginTop: "1.5rem", letterSpacing: "0.08em" }}
                >
                  Continue to Step 2
                </button>
              </div>

              {/* STEP 2 FIELDS */}
              <div style={{ display: currentStep === 2 ? "flex" : "none", flexDirection: "column", gap: "1.25rem" }} className="animate-fade-in-up">
                <h3 className="serif" style={{ margin: "0 0 0.5rem 0", color: "var(--cream)", fontWeight: 400, fontSize: "1.5rem" }}>Artistry & Vision</h3>

                <div className="field">
                  <label htmlFor="style" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Art Style / Categories</label>
                  <input className="input" id="style" name="style" type="text" placeholder="Adire, Contemporary, Painting, Sculpting" style={{ width: "100%" }} />
                </div>

                <div className="field">
                  <label htmlFor="commission" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Commission Expectations</label>
                  <input className="input" id="commission" name="commission" type="text" placeholder="e.g. 30% to gallery, flexible" style={{ width: "100%" }} />
                </div>

                <div className="field">
                  <label htmlFor="message" style={{ color: "var(--cream)", fontSize: "0.9rem", marginBottom: "0.4rem", display: "block" }}>Tell us about your work *</label>
                  <textarea 
                    className="input" 
                    id="message" 
                    name="message" 
                    rows={5} 
                    required={currentStep === 2}
                    placeholder="Describe your art, inspiration, media used, and why you want to collaborate with Àṣà." 
                    style={{ width: "100%", resize: "vertical", lineHeight: 1.5 }} 
                  />
                </div>

                {message ? (
                  <p style={{ color: "#ffb4a8", margin: "0.5rem 0", fontSize: "0.9rem", textAlign: "center" }} className="animate-shake">
                    ⚠️ {message}
                  </p>
                ) : null}

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button 
                    type="button" 
                    onClick={() => setCurrentStep(1)}
                    className="btn" 
                    style={{ 
                      flex: 1, 
                      background: "rgba(255, 255, 255, 0.05)", 
                      color: "var(--cream)", 
                      border: "1px solid var(--border)",
                      letterSpacing: "0.08em"
                    }}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={status === "loading"} 
                    style={{ flex: 2, letterSpacing: "0.08em" }}
                  >
                    {status === "loading" ? "Submitting Application..." : "Submit Application"}
                  </button>
                </div>
              </div>

            </form>
          </section>

        </main>
      )}
      <SiteFooter />
    </>
  );
}

