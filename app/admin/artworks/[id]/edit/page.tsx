"use client";

import { Save, Upload, ImagePlus, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState, useRef } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AVAILABILITY, CATEGORIES, PUBLICATION_STATUS } from "@/lib/categories";
import type { Artwork } from "@/lib/types";

type PreviewMap = Record<string, string | null>;

export default function EditArtworkPage({ params }: { params: Promise<{ id: string }> }) {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [others, setOthers] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState<PreviewMap>({});
  const [id, setId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4>(1);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      fetch(`/api/admin/artworks/${resolvedId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.artwork) {
            setArtwork(data.artwork);
            setCategories(data.artwork.categories ?? []);
            
            // Extract other category if needed
            const otherCat = data.artwork.categories?.find((c: string) => c.startsWith("Others:"));
            if (otherCat) {
              setOthers(otherCat.replace("Others: ", ""));
              setCategories((items) => [...items.filter((c) => !c.startsWith("Others:")), "Others"]);
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setMessage("Could not load artwork.");
          setStatus("error");
          setLoading(false);
        });
    });
  }, [params]);

  function toggleCategory(category: string) {
    setCategories((items) => items.includes(category) ? items.filter((c) => c !== category) : [...items, category]);
  }

  function updatePreview(name: string, file?: File) {
    setPreviews((items) => {
      if (items[name]) URL.revokeObjectURL(items[name]);
      return { ...items, [name]: file ? URL.createObjectURL(file) : null };
    });
  }

  const validateAndNext = (targetTab: 1 | 2 | 3 | 4) => {
    if (!formRef.current) return;
    
    // Simple verification based on activeTab
    let isValid = true;
    
    if (activeTab === 1) {
      const artistName = formRef.current.querySelector<HTMLInputElement>("#artist_name");
      if (artistName && !artistName.checkValidity()) {
        artistName.reportValidity();
        isValid = false;
      }
    } else if (activeTab === 2) {
      const title = formRef.current.querySelector<HTMLInputElement>("#title");
      const medium = formRef.current.querySelector<HTMLInputElement>("#medium");
      if (title && !title.checkValidity()) {
        title.reportValidity();
        isValid = false;
      } else if (medium && !medium.checkValidity()) {
        medium.reportValidity();
        isValid = false;
      }
    }

    if (isValid) {
      setActiveTab(targetTab);
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (submitter?.name === "intent_status") {
      formData.set("publication_status", submitter.value);
    }

    const finalCategories = categories.includes("Others") && others.trim()
      ? [...categories.filter((c) => c !== "Others"), `Others: ${others.trim()}`]
      : categories;

    setStatus("loading");
    setMessage("");
    formData.set("categories", JSON.stringify(finalCategories));

    try {
      const res = await fetch(`/api/artworks/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error ?? "Update failed.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage("Masterpiece updated successfully.");
      setArtwork(data.artwork);
      setPreviews((items) => {
        Object.values(items).forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
        return {};
      });
      // Return to first tab
      setActiveTab(1);
    } catch {
      setMessage("Update failed. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="container" style={{ padding: "8rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div className="typing-dots" style={{ marginBottom: "1rem" }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="muted" style={{ fontSize: "1rem", letterSpacing: "0.05em" }}>LOADING CATALOG FILE...</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!artwork) {
    return (
      <>
        <SiteHeader />
        <main className="container" style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
          <h2 className="serif text-gold-gradient" style={{ fontSize: "2rem", marginBottom: "1rem" }}>Artwork Registry Not Found</h2>
          <p className="muted" style={{ fontSize: "1.05rem" }}>The catalog key could not find a matching record.</p>
          <Link className="btn btn-primary" href="/admin/artworks" style={{ marginTop: "1.5rem", display: "inline-flex" }}>← Back to Inventory</Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const tagsValue = Array.isArray(artwork.tags) ? artwork.tags.join(", ") : "";

  return (
    <>
      <SiteHeader />
      <main className="adire animate-fade-in-up" style={{ padding: "4rem 1.5rem 6rem" }}>
        <div className="container" style={{ maxWidth: 1100, position: "relative", zIndex: 1 }}>
          
          {/* Header navigation bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link className="btn" href="/admin/artworks" style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--cream)", padding: "0.5rem 1.2rem" }}>
                ← Inventory
              </Link>
              <span className="muted" style={{ fontSize: "0.95rem" }}>Catalog Reference: <strong className="text-gold-gradient serif">{artwork.title}</strong></span>
            </div>
            {artwork.publication_status === "Published" && (
              <a href={`/artwork/${artwork.slug}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: "0.5rem 1.4rem", fontSize: "0.85rem", letterSpacing: "0.08em" }}>
                View in Gallery
              </a>
            )}
          </div>

          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "3rem", alignItems: "start" }}>
            
            {/* Left Curation Preview Aside */}
            <aside className="glass-premium museum-frame" style={{ padding: "2.2rem", position: "sticky", top: 96, borderRadius: "4px" }}>
              <div className="museum-frame" style={{ overflow: "hidden", borderRadius: "2px", marginBottom: "1.5rem", background: "var(--dark)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={previews.image ?? artwork.image_url} 
                  alt={artwork.title} 
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} 
                />
              </div>
              <p className="eyebrow" style={{ color: "var(--gold)" }}>CURATING MASTERPIECE</p>
              <h1 className="serif text-gold-gradient" style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.2, margin: "0.5rem 0" }}>{artwork.title}</h1>
              <p className="muted" style={{ fontSize: "0.95rem", marginBottom: "1.5rem" }}>by {artwork.artist_name}</p>
              
              <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(193, 123, 47, 0.3), transparent)", margin: "1.5rem 0" }} />
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span className="muted">Medium:</span>
                  <span style={{ color: "var(--cream)" }}>{artwork.medium}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span className="muted">Dimensions:</span>
                  <span style={{ color: "var(--cream)" }}>{artwork.dimensions ?? "N/A"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span className="muted">Valuation:</span>
                  <span style={{ color: "var(--gold)", fontWeight: 600 }}>{artwork.price ? `$${artwork.price.toLocaleString()}` : "Contact Concierge"}</span>
                </div>
              </div>
            </aside>

            {/* Right Editing wizard form */}
            <div className="glass-premium museum-frame" style={{ borderRadius: "4px", padding: "2.5rem 3rem" }}>
              
              {/* Wizard Tabs Selector */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", borderBottom: "1px solid rgba(193,123,47,0.15)", paddingBottom: "1.5rem", flexWrap: "wrap" }}>
                {[
                  { id: 1, label: "01 Artist Info" },
                  { id: 2, label: "02 Specs" },
                  { id: 3, label: "03 Narrative" },
                  { id: 4, label: "04 Commercial" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => validateAndNext(tab.id as 1 | 2 | 3 | 4)}
                    className="btn"
                    style={{
                      flex: 1,
                      minWidth: 100,
                      background: activeTab === tab.id ? "var(--gold)" : "rgba(193, 123, 47, 0.03)",
                      color: activeTab === tab.id ? "var(--dark)" : "var(--cream)",
                      border: `1px solid ${activeTab === tab.id ? "var(--gold)" : "rgba(193, 123, 47, 0.2)"}`,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      padding: "0.6rem 0.5rem",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form ref={formRef} onSubmit={submit}>

                {/* TAB 1: ARTIST INFORMATION */}
                <div style={{ display: activeTab === 1 ? "flex" : "none", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in-up">
                  <div>
                    <h3 className="serif text-gold-gradient" style={{ fontSize: "1.8rem", fontWeight: 400, margin: 0 }}>Artist Profile</h3>
                    <p className="muted" style={{ margin: "0.25rem 0 1.5rem 0", fontSize: "0.95rem" }}>Update biographical catalogs and artistic origins.</p>
                  </div>
                  
                  <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                    <Field name="artist_name" label="Artist Full Name *" required full>
                      <input className="input" id="artist_name" name="artist_name" defaultValue={artwork.artist_name} required style={{ width: "100%" }} />
                    </Field>
                    <Field name="nationality" label="Nationality">
                      <input className="input" id="nationality" name="nationality" defaultValue={artwork.nationality ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="city_base" label="City / Base">
                      <input className="input" id="city_base" name="city_base" defaultValue={artwork.city_base ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="year_active" label="Year Active">
                      <input className="input" id="year_active" name="year_active" defaultValue={artwork.year_active ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="cultural_roots" label="Cultural Roots" full>
                      <input className="input" id="cultural_roots" name="cultural_roots" defaultValue={artwork.cultural_roots ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="artist_quote" label="Artist Quote" full>
                      <input className="input" id="artist_quote" name="artist_quote" defaultValue={artwork.artist_quote ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="artist_bio" label="Artist Bio" full>
                      <textarea className="input" id="artist_bio" name="artist_bio" rows={4} defaultValue={artwork.artist_bio ?? ""} style={{ width: "100%", resize: "vertical" }} />
                    </Field>
                    <Field name="artist_story" label="Artist Story" full>
                      <textarea className="input" id="artist_story" name="artist_story" rows={4} defaultValue={artwork.artist_story ?? ""} style={{ width: "100%", resize: "vertical" }} />
                    </Field>
                  </div>

                  <button
                    type="button"
                    onClick={() => validateAndNext(2)}
                    className="btn btn-primary"
                    style={{ marginTop: "1.5rem", alignSelf: "flex-end", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    Continue to Specs <ChevronRight size={16} />
                  </button>
                </div>

                {/* TAB 2: ARTWORK DETAILS */}
                <div style={{ display: activeTab === 2 ? "flex" : "none", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in-up">
                  <div>
                    <h3 className="serif text-gold-gradient" style={{ fontSize: "1.8rem", fontWeight: 400, margin: 0 }}>Physical Specs</h3>
                    <p className="muted" style={{ margin: "0.25rem 0 1.5rem 0", fontSize: "0.95rem" }}>Update images, valuations, and listing characteristics.</p>
                  </div>

                  <ImageField name="image" label="Replace Main Image (optional)" preview={previews.image} onPreview={updatePreview} />
                  
                  <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                    <Field name="title" label="Title *" required full>
                      <input className="input" id="title" name="title" defaultValue={artwork.title} required style={{ width: "100%" }} />
                    </Field>
                    <Field name="medium" label="Medium *" required>
                      <input className="input" id="medium" name="medium" defaultValue={artwork.medium} required style={{ width: "100%" }} />
                    </Field>
                    <Field name="year_created" label="Year Created">
                      <input className="input" id="year_created" name="year_created" defaultValue={artwork.year_created ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="dimensions" label="Dimensions">
                      <input className="input" id="dimensions" name="dimensions" defaultValue={artwork.dimensions ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="price" label="Price (USD)">
                      <input className="input" id="price" name="price" type="number" min={0} step="0.01" defaultValue={artwork.price ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="availability" label="Availability">
                      <select className="input" id="availability" name="availability" defaultValue={artwork.availability} style={{ width: "100%" }}>
                        {AVAILABILITY.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </Field>
                  </div>

                  <div className="field">
                    <label style={{ color: "var(--cream)", fontSize: "0.9rem", display: "block", marginBottom: "0.6rem" }}>Exhibition Classifications</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {CATEGORIES.map((category) => {
                        const active = categories.includes(category);
                        return (
                          <button 
                            key={category} 
                            type="button" 
                            aria-pressed={active} 
                            onClick={() => toggleCategory(category)}
                            style={{ 
                              background: active ? "var(--gold)" : "rgba(193,123,47,0.05)", 
                              border: `1px solid ${active ? "var(--gold)" : "rgba(193,123,47,0.2)"}`, 
                              borderRadius: 999, 
                              color: active ? "var(--dark)" : "var(--muted)", 
                              cursor: "pointer", 
                              padding: "0.45rem 0.9rem",
                              fontSize: "0.85rem",
                              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                            }}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                    {categories.includes("Others") && (
                      <input 
                        className="input" 
                        value={others} 
                        onChange={(e) => setOthers(e.target.value)} 
                        placeholder="Describe the specific category" 
                        style={{ marginTop: 10, width: "100%" }} 
                      />
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(1)}
                      className="btn"
                      style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => validateAndNext(3)}
                      className="btn btn-primary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      Continue to Narrative <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* TAB 3: CULTURAL NARRATIVE */}
                <div style={{ display: activeTab === 3 ? "flex" : "none", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in-up">
                  <div>
                    <h3 className="serif text-gold-gradient" style={{ fontSize: "1.8rem", fontWeight: 400, margin: 0 }}>Cultural Stories</h3>
                    <p className="muted" style={{ margin: "0.25rem 0 1.5rem 0", fontSize: "0.95rem" }}>Biographical details about Yoruba values or deep folklore.</p>
                  </div>

                  {[
                    ["cultural_significance", "Cultural Significance & Provenance", artwork.cultural_significance],
                    ["piece_story", "The Story Behind This Piece", artwork.piece_story],
                    ["yoruba_connection", "Yoruba Connection or Deeper Meaning", artwork.yoruba_connection],
                    ["tags", "Search Meta-Tags (comma-separated)", tagsValue],
                  ].map(([name, label, value]) => (
                    <Field key={name as string} name={name as string} label={label as string} full>
                      <textarea className="input" id={name as string} name={name as string} rows={name === "tags" ? 2 : 4} defaultValue={value as string ?? ""} style={{ width: "100%", resize: "vertical" }} />
                    </Field>
                  ))}

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(2)}
                      className="btn"
                      style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => validateAndNext(4)}
                      className="btn btn-primary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      Continue to Commercials <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* TAB 4: COMMERCIAL CONTROLS */}
                <div style={{ display: activeTab === 4 ? "flex" : "none", flexDirection: "column", gap: "1.5rem" }} className="animate-fade-in-up">
                  <div>
                    <h3 className="serif text-gold-gradient" style={{ fontSize: "1.8rem", fontWeight: 400, margin: 0 }}>Commercial Details</h3>
                    <p className="muted" style={{ margin: "0.25rem 0 1.5rem 0", fontSize: "0.95rem" }}>Internal database controls, notes, and direct actions.</p>
                  </div>

                  <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                    <Field name="commission_rate" label="Commission Rate (%)">
                      <input className="input" id="commission_rate" name="commission_rate" type="number" min={0} max={100} defaultValue={artwork.commission_rate ?? ""} style={{ width: "100%" }} />
                    </Field>
                    <Field name="publication_status" label="Status">
                      <select className="input" id="publication_status" name="publication_status" defaultValue={artwork.publication_status} style={{ width: "100%" }}>
                        {PUBLICATION_STATUS.map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </Field>
                  </div>
                  
                  <Field name="admin_notes" label="Private Curation / Valuation Notes" full>
                    <textarea className="input" id="admin_notes" name="admin_notes" rows={4} defaultValue={artwork.admin_notes ?? ""} style={{ width: "100%", resize: "vertical" }} />
                  </Field>

                  {message ? (
                    <p aria-live="polite" style={{ color: status === "error" ? "#ffb4a8" : "var(--gold)", textAlign: "center", fontSize: "0.95rem", margin: "1rem 0" }} className={status === "error" ? "animate-shake" : ""}>
                      {status === "error" ? `⚠️ ${message}` : `✓ ${message}`}
                    </p>
                  ) : null}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", borderTop: "1px solid rgba(193,123,47,0.15)", paddingTop: "1.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(3)}
                      className="btn"
                      style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                    
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <button className="btn" name="intent_status" value="Draft" disabled={status === "loading"} style={{ border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--cream)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <Save size={15} /> Save Draft
                      </button>
                      <button className="btn btn-primary" name="intent_status" value="Published" disabled={status === "loading"} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <Upload size={15} /> {status === "loading" ? "Saving..." : "Save & Publish"}
                      </button>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Field({ name, label, required, full, children }: { name: string; label: string; required?: boolean; full?: boolean; children: ReactNode }) {
  return (
    <div className="field" style={{ gridColumn: full ? "1 / -1" : undefined, width: "100%" }}>
      <label htmlFor={name} style={{ color: "var(--cream)", fontSize: "0.85rem", letterSpacing: "0.03em", marginBottom: "0.4rem", display: "block" }}>
        {label}{required ? " *" : ""}
      </label>
      {children}
    </div>
  );
}

function ImageField({ name, label, preview, onPreview }: { name: string; label: string; preview?: string | null; onPreview: (name: string, file?: File) => void }) {
  return (
    <label className="panel" style={{ 
      alignItems: "center", 
      background: "rgba(193, 123, 47, 0.03)", 
      border: "1px dashed rgba(193, 123, 47, 0.3)", 
      borderRadius: "4px",
      cursor: "pointer", 
      display: "grid", 
      justifyItems: "center", 
      minHeight: 140, 
      overflow: "hidden", 
      padding: "1.5rem", 
      textAlign: "center",
      transition: "all 0.3s ease",
      position: "relative"
    }}>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="preview" style={{ maxHeight: 180, objectFit: "contain", borderRadius: "2px" }} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ImagePlus color="var(--gold)" size={24} style={{ marginBottom: "0.5rem" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--cream)", fontWeight: 500 }}>{label}</span>
          <span className="muted" style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>JPEG, PNG, or WEBP up to 5MB</span>
        </div>
      )}
      <input hidden name={name} type="file" accept="image/*" onChange={(e) => onPreview(name, e.target.files?.[0])} />
    </label>
  );
}

