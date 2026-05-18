"use client";

import { ImagePlus, Save, Upload } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AVAILABILITY, CATEGORIES } from "@/lib/categories";

type PreviewMap = Record<string, string | null>;

export default function AdminUploadPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [others, setOthers] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState<PreviewMap>({});

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
    setMessage("Artwork saved.");
    event.currentTarget.reset();
    setCategories([]);
    setOthers("");
    setPreviews({});
  }

  return (
    <>
      <SiteHeader />
      <main className="adire" style={{ padding: "2rem 1rem 4rem" }}>
        <div className="container" style={{ maxWidth: 780, position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "1.2rem" }}>
            <p className="eyebrow">Admin Upload</p>
            <h1 className="serif" style={{ fontSize: "2.15rem", fontWeight: 400, lineHeight: 1.1, margin: "0.45rem 0" }}>Add Artwork</h1>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0 }}>Only the essentials needed to publish a clean artwork listing.</p>
          </div>

          <form onSubmit={submit} className="panel wood-frame" style={{ padding: "clamp(1rem, 3vw, 1.5rem)", display: "grid", gap: "1.2rem" }}>
            <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <ImageField name="image" label="Main Artwork Image" required preview={previews.image} onPreview={updatePreview} />
              <ImageField name="artist_image" label="Artist Photo" preview={previews.artist_image} onPreview={updatePreview} />
            </div>

            <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <Field name="artist_name" label="Artist Name" required>
                <input className="input" id="artist_name" name="artist_name" required />
              </Field>
              <Field name="title" label="Artwork Title" required>
                <input className="input" id="title" name="title" required />
              </Field>
              <Field name="medium" label="Medium" required>
                <input className="input" id="medium" name="medium" required placeholder="Oil, adire, bronze..." />
              </Field>
              <Field name="price" label="Price (USD)">
                <input className="input" id="price" name="price" type="number" min="0" step="0.01" />
              </Field>
              <Field name="availability" label="Availability">
                <select className="input" id="availability" name="availability" defaultValue="For Sale">
                  {AVAILABILITY.map((value) => <option key={value}>{value}</option>)}
                </select>
              </Field>
              <Field name="publication_status" label="Status">
                <select className="input" id="publication_status" name="publication_status" defaultValue="Draft">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </Field>
            </div>

            <div className="field">
              <label>Category *</label>
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
              {categories.includes("Others") ? <input className="input" value={others} onChange={(event) => setOthers(event.target.value)} placeholder="Describe the category" /> : null}
            </div>

            <Field name="piece_story" label="Short Story / Description">
              <textarea className="input" id="piece_story" name="piece_story" rows={4} placeholder="A short note about the work, inspiration, or meaning." />
            </Field>

            {message ? <p style={{ color: status === "error" ? "#ffb4a8" : "var(--gold-light)", margin: 0 }}>{message}</p> : null}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "end" }}>
              <button className="btn btn-ghost" name="intent_status" value="Draft" disabled={status === "loading"}><Save size={16} /> Save Draft</button>
              <button className="btn btn-primary" name="intent_status" value="Published" disabled={status === "loading"}><Upload size={16} /> Publish</button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Field({ name, label, required, children }: { name: string; label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}{required ? " *" : ""}</label>
      {children}
    </div>
  );
}

function ImageField({ name, label, required, preview, onPreview }: { name: string; label: string; required?: boolean; preview?: string | null; onPreview: (name: string, file?: File) => void }) {
  return (
    <label className="panel wood-frame" style={{ alignItems: "center", background: "var(--panel-2)", cursor: "pointer", display: "grid", justifyItems: "center", minHeight: 180, overflow: "hidden", padding: "1rem", textAlign: "center" }}>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={`${label} preview`} style={{ maxHeight: 220, objectFit: "contain" }} />
      ) : (
        <>
          <ImagePlus color="var(--gold)" size={30} />
          <span className="muted" style={{ fontSize: 13, marginTop: 8 }}>{label}{required ? " *" : ""}</span>
        </>
      )}
      <input required={required} hidden name={name} type="file" accept="image/*" onChange={(event) => onPreview(name, event.target.files?.[0])} />
    </label>
  );
}
