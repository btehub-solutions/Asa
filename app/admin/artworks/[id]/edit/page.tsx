"use client";

import { Eye, Save, Upload, ImagePlus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      fetch(`/api/admin/artworks/${resolvedId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.artwork) {
            setArtwork(data.artwork);
            setCategories(data.artwork.categories ?? []);
          }
          setLoading(false);
        });
    });
  }, [params]);

  function toggleCategory(category: string) {
    setCategories((items) => items.includes(category) ? items.filter((c) => c !== category) : [...items, category]);
  }

  function updatePreview(name: string, file?: File) {
    setPreviews((items) => ({ ...items, [name]: file ? URL.createObjectURL(file) : null }));
  }

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
    setMessage("Artwork updated successfully.");
    setArtwork(data.artwork);
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="container" style={{ padding: "5rem 1rem", textAlign: "center" }}>
          <p className="muted">Loading artwork...</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  if (!artwork) {
    return (
      <>
        <SiteHeader />
        <main className="container" style={{ padding: "5rem 1rem", textAlign: "center" }}>
          <p className="muted">Artwork not found.</p>
          <Link className="btn btn-ghost" href="/admin/artworks" style={{ marginTop: "1rem", display: "inline-flex" }}>← Back to Inventory</Link>
        </main>
        <SiteFooter />
      </>
    );
  }

  const tagsValue = Array.isArray(artwork.tags) ? artwork.tags.join(", ") : "";

  return (
    <>
      <SiteHeader />
      <main className="adire" style={{ padding: "3rem 1rem 5rem" }}>
        <div className="container" style={{ maxWidth: 1080, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <Link className="btn btn-ghost" href="/admin/artworks">← Back to Inventory</Link>
            <span className="muted" style={{ fontSize: 13 }}>Editing: <strong style={{ color: "var(--cream)" }}>{artwork.title}</strong></span>
          </div>

          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "0.82fr 1.18fr", gap: "2rem", alignItems: "start" }}>
            <aside className="panel wood-frame" style={{ padding: "1.5rem", position: "sticky", top: 96 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previews.image ?? artwork.image_url} alt={artwork.title} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 8, marginBottom: "1rem" }} />
              <p className="eyebrow">Editing</p>
              <h1 className="serif" style={{ fontSize: "1.8rem", fontWeight: 400, lineHeight: 1.2, margin: "0.5rem 0" }}>{artwork.title}</h1>
              <p className="muted" style={{ fontSize: 13 }}>{artwork.artist_name}</p>
              <div className="motif-divider" />
              <p className="muted" style={{ fontSize: 12, lineHeight: 1.7 }}>Changes are saved immediately. Image updates require a new file upload — the original will be replaced.</p>
            </aside>

            <form onSubmit={submit} className="panel wood-frame" style={{ padding: "clamp(1rem, 3vw, 2rem)", display: "grid", gap: "1.6rem" }}>

              <FormSection n="01" title="Artist Information" sub="Update artist identity details.">
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                  <Field name="artist_name" label="Artist Full Name" required full>
                    <input className="input" id="artist_name" name="artist_name" defaultValue={artwork.artist_name} required />
                  </Field>
                  <Field name="nationality" label="Nationality">
                    <input className="input" id="nationality" name="nationality" defaultValue={artwork.nationality ?? ""} />
                  </Field>
                  <Field name="city_base" label="City / Base">
                    <input className="input" id="city_base" name="city_base" defaultValue={artwork.city_base ?? ""} />
                  </Field>
                  <Field name="year_active" label="Year Active">
                    <input className="input" id="year_active" name="year_active" defaultValue={artwork.year_active ?? ""} />
                  </Field>
                  <Field name="cultural_roots" label="Cultural Roots" full>
                    <input className="input" id="cultural_roots" name="cultural_roots" defaultValue={artwork.cultural_roots ?? ""} />
                  </Field>
                  <Field name="artist_quote" label="Artist Quote" full>
                    <input className="input" id="artist_quote" name="artist_quote" defaultValue={artwork.artist_quote ?? ""} />
                  </Field>
                  <Field name="artist_bio" label="Artist Bio" full>
                    <textarea className="input" id="artist_bio" name="artist_bio" rows={4} defaultValue={artwork.artist_bio ?? ""} />
                  </Field>
                  <Field name="artist_story" label="Artist Story" full>
                    <textarea className="input" id="artist_story" name="artist_story" rows={4} defaultValue={artwork.artist_story ?? ""} />
                  </Field>
                </div>
              </FormSection>

              <FormSection n="02" title="Artwork Details" sub="Update the artwork image and core details.">
                <ImageField name="image" label="Replace Main Image (optional)" preview={previews.image} onPreview={updatePreview} />
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                  <Field name="title" label="Title" required full>
                    <input className="input" id="title" name="title" defaultValue={artwork.title} required />
                  </Field>
                  <Field name="medium" label="Medium" required>
                    <input className="input" id="medium" name="medium" defaultValue={artwork.medium} required />
                  </Field>
                  <Field name="year_created" label="Year Created">
                    <input className="input" id="year_created" name="year_created" defaultValue={artwork.year_created ?? ""} />
                  </Field>
                  <Field name="dimensions" label="Dimensions">
                    <input className="input" id="dimensions" name="dimensions" defaultValue={artwork.dimensions ?? ""} />
                  </Field>
                  <Field name="price" label="Price (USD)">
                    <input className="input" id="price" name="price" type="number" min={0} step="0.01" defaultValue={artwork.price ?? ""} />
                  </Field>
                  <Field name="availability" label="Availability">
                    <select className="input" id="availability" name="availability" defaultValue={artwork.availability}>
                      {AVAILABILITY.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="field">
                  <label>Categories</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {CATEGORIES.map((category) => {
                      const active = categories.includes(category);
                      return (
                        <button key={category} type="button" onClick={() => toggleCategory(category)}
                          style={{ background: active ? "var(--gold)" : "var(--panel-2)", border: `1px solid ${active ? "var(--gold)" : "var(--border)"}`, borderRadius: 999, color: active ? "var(--bg)" : "var(--muted)", cursor: "pointer", padding: "0.45rem 0.75rem" }}>
                          {category}
                        </button>
                      );
                    })}
                  </div>
                  {categories.includes("Others") ? <input className="input" value={others} onChange={(e) => setOthers(e.target.value)} placeholder="Describe the other category" style={{ marginTop: 8 }} /> : null}
                </div>
              </FormSection>

              <FormSection n="03" title="Cultural & Storytelling" sub="Update cultural meaning and collector narrative.">
                {[
                  ["cultural_significance", "Cultural Significance", artwork.cultural_significance],
                  ["piece_story", "Story Behind This Piece", artwork.piece_story],
                  ["yoruba_connection", "Yoruba Meaning or Connection", artwork.yoruba_connection],
                  ["tags", "Tags (comma-separated)", tagsValue],
                ].map(([name, label, value]) => (
                  <Field key={name as string} name={name as string} label={label as string} full>
                    <textarea className="input" id={name as string} name={name as string} rows={name === "tags" ? 2 : 4} defaultValue={value as string ?? ""} />
                  </Field>
                ))}
              </FormSection>

              <FormSection n="04" title="Admin & Commercial" sub="Internal controls and publication settings.">
                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 14 }}>
                  <Field name="commission_rate" label="Commission Rate (%)">
                    <input className="input" id="commission_rate" name="commission_rate" type="number" min={0} max={100} defaultValue={artwork.commission_rate ?? ""} />
                  </Field>
                  <Field name="publication_status" label="Status">
                    <select className="input" id="publication_status" name="publication_status" defaultValue={artwork.publication_status}>
                      {PUBLICATION_STATUS.map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </Field>
                </div>
                <Field name="admin_notes" label="Admin Notes" full>
                  <textarea className="input" id="admin_notes" name="admin_notes" rows={4} defaultValue={artwork.admin_notes ?? ""} />
                </Field>
              </FormSection>

              {message ? <p style={{ color: status === "error" ? "#ffb4a8" : "var(--gold-light)" }}>{message}</p> : null}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "end" }}>
                <button className="btn btn-ghost" name="intent_status" value="Draft" disabled={status === "loading"}>
                  <Save size={16} /> Save as Draft
                </button>
                <button className="btn btn-ghost" type="button" onClick={() => window.open(`/artwork/${artwork.slug}`, "_blank")}>
                  <Eye size={16} /> Preview
                </button>
                <button className="btn btn-primary" name="intent_status" value="Published" disabled={status === "loading"}>
                  <Upload size={16} /> {status === "loading" ? "Saving..." : "Save & Publish"}
                </button>
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

function ImageField({ name, label, preview, onPreview }: { name: string; label: string; preview?: string | null; onPreview: (name: string, file?: File) => void }) {
  return (
    <label className="panel wood-frame" style={{ alignItems: "center", background: "var(--panel-2)", cursor: "pointer", display: "grid", justifyItems: "center", minHeight: 160, overflow: "hidden", padding: "1rem", textAlign: "center" }}>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="preview" style={{ maxHeight: 200, objectFit: "contain" }} />
      ) : (
        <>
          <ImagePlus color="var(--gold)" size={28} />
          <span className="muted" style={{ fontSize: 13, marginTop: 8 }}>{label}</span>
        </>
      )}
      <input hidden name={name} type="file" accept="image/*" onChange={(e) => onPreview(name, e.target.files?.[0])} />
    </label>
  );
}
