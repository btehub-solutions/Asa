"use client";

import { Eye, ImagePlus, Save, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AVAILABILITY, CATEGORIES, PUBLICATION_STATUS } from "@/lib/categories";

type PreviewMap = Record<string, string | null>;

const baseFields = [
  ["artist_name", "Artist Full Name", "Adunola Okafor", true],
  ["nationality", "Nationality", "Nigerian", false],
  ["city_base", "City / Base", "Abeokuta, Nigeria", false],
  ["year_active", "Year Active", "2012 to present", false],
  ["cultural_roots", "Cultural Roots / Background", "Yoruba, Abeokuta, Nigerian heritage", false]
] as const;

const artworkFields = [
  ["title", "Title of Artwork", "Omi Tutu", true],
  ["medium", "Medium / Materials", "Adire on indigo-dyed cotton", true],
  ["year_created", "Year Created", "2024", false],
  ["dimensions", "Dimensions", "120 × 100 cm", false],
  ["price", "Price (USD)", "850", false]
] as const;

export default function AdminUploadPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [others, setOthers] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState<PreviewMap>({});
  const [previewMode, setPreviewMode] = useState(false);

  function toggleCategory(category: string) {
    setCategories((items) => items.includes(category) ? items.filter((item) => item !== category) : [...items, category]);
  }

  function updatePreview(name: string, file?: File) {
    setPreviews((items) => ({ ...items, [name]: file ? URL.createObjectURL(file) : null }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    
    if (submitter?.name === "intent_status") {
      formData.set("intent_status", submitter.value);
    }

    const finalCategories = categories.includes("Others") && others.trim()
      ? [...categories.filter((category) => category !== "Others"), `Others: ${others.trim()}`]
      : categories;

    setStatus("loading");
    setMessage("");
    formData.set("categories", JSON.stringify(finalCategories));

    const res = await fetch("/api/artworks", { method: "POST", body: formData });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMessage(data.error ?? "Upload failed.");
      setStatus("error");
      return;
    }

    setStatus("success");
    setMessage("Artwork saved to Àṣà.");
  }

  return (
    <>
      <SiteHeader />
      <main className="adire" style={{ padding: "3rem 1rem 5rem" }}>
        <div className="container" style={{ maxWidth: 1080, position: "relative", zIndex: 1 }}>
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "0.82fr 1.18fr", gap: "2rem", alignItems: "start" }}>
            <aside className="panel wood-frame" style={{ padding: "1.5rem", position: "sticky", top: 96 }}>
              <p className="eyebrow">Admin Portal</p>
              <h1 className="serif" style={{ fontSize: "2.3rem", fontWeight: 400, lineHeight: 1.1, margin: "0.65rem 0" }}>Upload New Artwork to Àṣà</h1>
              <p className="muted" style={{ lineHeight: 1.8 }}>A curated consignment workflow for artist identity, artwork details, cultural meaning, and internal commercial notes.</p>
              <div className="motif-divider" />
              {["Artist Information", "Artwork Details", "Cultural & Storytelling", "Admin & Commercial"].map((item, index) => (
                <p key={item} style={{ borderBottom: "1px solid var(--border)", color: "var(--cream)", margin: 0, padding: "0.75rem 0" }}>
                  <span style={{ color: "var(--gold)", marginRight: 8 }}>0{index + 1}</span>{item}
                </p>
              ))}
            </aside>

            <form onSubmit={submit} className="panel wood-frame" style={{ padding: "clamp(1rem, 3vw, 2rem)", display: "grid", gap: "1.6rem" }}>
              <FormSection n="01" title="Artist Information" sub="Tell the artist's story with enough warmth for collectors and enough clarity for the admin team.">
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                  {baseFields.map(([name, label, placeholder, required]) => (
                    <Field key={name} name={name} label={label} required={required} full={name === "artist_name" || name === "cultural_roots"}>
                      <input className="input" id={name} name={name} placeholder={placeholder} required={required} />
                    </Field>
                  ))}
                  <ImageField name="artist_image" label="Artist Profile Image" preview={previews.artist_image} onPreview={updatePreview} />
                  <Field name="artist_quote" label="Inspirational Quote from the Artist" full>
                    <input className="input" id="artist_quote" name="artist_quote" placeholder="Art is my way of keeping the ancestors alive." />
                  </Field>
                  <Field name="artist_bio" label="Artist Short Bio / Artist Statement" full>
                    <textarea className="input" id="artist_bio" name="artist_bio" rows={5} />
                  </Field>
                  <Field name="artist_story" label="Artist's Story & Inspiration" full>
                    <textarea className="input" id="artist_story" name="artist_story" rows={5} />
                  </Field>
                </div>
              </FormSection>

              <FormSection n="02" title="Artwork Details" sub="Upload strong visuals and catalogue-quality details for the piece.">
                <ImageField name="image" label="Main Artwork Image" required preview={previews.image} onPreview={updatePreview} />
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[0, 1, 2, 3].map((index) => (
                    <ImageField key={index} name={`extra_image_${index}`} label={`Additional ${index + 1}`} compact preview={previews[`extra_image_${index}`]} onPreview={updatePreview} />
                  ))}
                </div>
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                  {artworkFields.map(([name, label, placeholder, required]) => (
                    <Field key={name} name={name} label={label} required={required} full={name === "title"}>
                      <input className="input" id={name} name={name} placeholder={placeholder} required={required} type={name === "price" ? "number" : "text"} min={name === "price" ? 0 : undefined} step={name === "price" ? "0.01" : undefined} />
                    </Field>
                  ))}
                  <Field name="availability" label="Availability Status">
                    <select className="input" id="availability" name="availability" defaultValue="For Sale">
                      {AVAILABILITY.map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="field">
                  <label>Categories *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CATEGORIES.map((category) => {
                      const active = categories.includes(category);
                      return (
                        <button key={category} type="button" onClick={() => toggleCategory(category)} style={{ background: active ? "var(--gold)" : "var(--panel-2)", border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`, borderRadius: 999, color: active ? "var(--bg)" : "var(--muted)", cursor: "pointer", padding: "0.45rem 0.75rem" }}>
                          {category}
                        </button>
                      );
                    })}
                  </div>
                  {categories.includes("Others") ? <input className="input" value={others} onChange={(event) => setOthers(event.target.value)} placeholder="Describe the other category" /> : null}
                </div>
              </FormSection>

              <FormSection n="03" title="Cultural & Storytelling" sub="Capture the symbolism, Yoruba connection, and collector-facing meaning.">
                {[
                  ["cultural_significance", "Cultural Significance & Symbolism"],
                  ["piece_story", "Story / Inspiration Behind This Specific Piece"],
                  ["yoruba_connection", "Yoruba Meaning or Connection"],
                  ["tags", "Tags / Keywords"]
                ].map(([name, label]) => (
                  <Field key={name} name={name} label={label} full>
                    <textarea className="input" id={name} name={name} rows={name === "tags" ? 2 : 5} placeholder={name === "tags" ? "adire, indigo, Yoruba, Abeokuta" : undefined} />
                  </Field>
                ))}
              </FormSection>

              <FormSection n="04" title="Admin & Commercial" sub="Internal consignment, commission, and publication controls.">
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                  <Field name="commission_rate" label="Commission Rate for this Artist (%)">
                    <input className="input" id="commission_rate" name="commission_rate" type="number" min="0" max="100" placeholder="30" />
                  </Field>
                  <Field name="publication_status" label="Status">
                    <select className="input" id="publication_status" name="publication_status" defaultValue="Draft">
                      {PUBLICATION_STATUS.map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </Field>
                </div>
                <Field name="admin_notes" label="Internal Admin Notes" full>
                  <textarea className="input" id="admin_notes" name="admin_notes" rows={5} />
                </Field>
              </FormSection>

              {previewMode ? (
                <div className="panel bronze-glow" style={{ padding: "1rem" }}>
                  <p className="eyebrow">Preview Mode</p>
                  <p className="muted" style={{ lineHeight: 1.7 }}>Preview uses the current form values in the browser. Complete the fields and upload images, then publish when ready.</p>
                </div>
              ) : null}

              {message ? <p style={{ color: status === "error" ? "#ffb4a8" : "var(--gold-light)" }}>{message}</p> : null}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "end" }}>
                <button className="btn btn-ghost" name="intent_status" value="Draft" disabled={status === "loading"}><Save size={16} /> Save as Draft</button>
                <button className="btn btn-ghost" type="button" onClick={() => setPreviewMode((value) => !value)}><Eye size={16} /> Preview Artwork Page</button>
                <button className="btn btn-primary" name="intent_status" value="Published" disabled={status === "loading"}><Upload size={16} /> Publish to Àṣà</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function FormSection({ n, title, sub, children }: { n: string; title: string; sub: string; children: ReactNode }) {
  return (
    <section style={{ borderTop: "1px solid var(--border)", paddingTop: "1.3rem" }}>
      <p className="eyebrow">Section {n}</p>
      <h2 className="serif" style={{ fontSize: "1.65rem", fontWeight: 400, margin: "0.4rem 0" }}>{title}</h2>
      <p className="muted" style={{ lineHeight: 1.7, marginTop: 0 }}>{sub}</p>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </section>
  );
}

function Field({ name, label, required, full, children }: { name: string; label: string; required?: boolean; full?: boolean; children: ReactNode }) {
  return (
    <div className="field" style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label htmlFor={name}>{label}{required ? " *" : ""}</label>
      {children}
    </div>
  );
}

function ImageField({ name, label, required, compact, preview, onPreview }: { name: string; label: string; required?: boolean; compact?: boolean; preview?: string | null; onPreview: (name: string, file?: File) => void }) {
  return (
    <label className="panel wood-frame" style={{ alignItems: "center", background: "var(--panel-2)", cursor: "pointer", display: "grid", justifyItems: "center", minHeight: compact ? 140 : 230, overflow: "hidden", padding: compact ? "0.8rem" : "1.4rem", textAlign: "center" }}>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={`${label} preview`} style={{ maxHeight: compact ? 120 : 320, objectFit: "contain" }} />
      ) : (
        <>
          <ImagePlus color="var(--gold)" size={compact ? 24 : 36} />
          <span className="muted" style={{ fontSize: compact ? 12 : 14 }}>{label}{required ? " *" : ""}</span>
        </>
      )}
      <input required={required} hidden name={name} type="file" accept="image/*" onChange={(event) => onPreview(name, event.target.files?.[0])} />
    </label>
  );
}
