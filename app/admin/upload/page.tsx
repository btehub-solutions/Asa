"use client";

import { ImagePlus, Save, Upload, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
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

  const [currentStep, setCurrentStep] = useState(1);
  const [intentStatus, setIntentStatus] = useState("Draft");

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  function toggleCategory(category: string) {
    setCategories((items) => items.includes(category) ? items.filter((item) => item !== category) : [...items, category]);
  }

  function updatePreview(name: string, file?: File) {
    setPreviews((items) => {
      if (items[name]) URL.revokeObjectURL(items[name]);
      return { ...items, [name]: file ? URL.createObjectURL(file) : null };
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;

    if (submitter?.name === "intent_status") {
      formData.set("intent_status", submitter.value);
    } else {
      formData.set("intent_status", intentStatus);
    }

    const image = formData.get("image");
    if (!(image instanceof File) || image.size === 0) {
      setMessage("Please select a main artwork image.");
      setStatus("error");
      setCurrentStep(1); // Jump back to step 1
      return;
    }

    if (categories.length === 0) {
      setMessage("Please select at least one category.");
      setStatus("error");
      setCurrentStep(3); // Jump back to step 3
      return;
    }

    const finalCategories = categories.includes("Others") && others.trim()
      ? [...categories.filter((category) => category !== "Others"), `Others: ${others.trim()}`]
      : categories;

    setStatus("loading");
    setMessage("");
    formData.set("categories", JSON.stringify(finalCategories));

    try {
      const res = await fetch("/api/artworks", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage(data.error ?? "Upload failed.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setMessage("Artwork saved.");
      formElement.reset();
      setCategories([]);
      setOthers("");
      setCurrentStep(1);
      setPreviews((items) => {
        Object.values(items).forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
        return {};
      });
    } catch {
      setMessage("Upload failed. Please check your connection and try again.");
      setStatus("error");
    } finally {
      if (status === "loading") setStatus("idle");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="adire" style={{ padding: "2rem 1rem 4rem" }}>
        <div className="container" style={{ maxWidth: 740, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "1.2rem" }}>
            <Link href="/admin" className="btn btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: "auto", padding: "0.45rem 0.9rem", fontSize: 13, border: "1px solid var(--border)", borderRadius: 20 }}>
              <ArrowLeft size={14} /> Back to Portal
            </Link>
          </div>
          <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            <p className="eyebrow" style={{ fontSize: "0.75rem" }}>Admin Upload</p>
            <h1 className="serif" style={{ fontSize: "2.5rem", fontWeight: 400, lineHeight: 1.1, margin: "0.5rem 0" }}>Add Artwork</h1>
            <p className="muted" style={{ lineHeight: 1.7, margin: 0 }}>Follow the steps to publish a clean, premium listing.</p>
          </div>

          <div className="wizard-header panel wood-frame" style={{ padding: "1.2rem 1.5rem", marginBottom: "1.8rem" }}>
            <div className={`wizard-step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="wizard-step-dot">1</div>
              <span className="wizard-step-label">The Artwork</span>
              <div className="wizard-line"></div>
            </div>
            <div className={`wizard-step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="wizard-step-dot">2</div>
              <span className="wizard-step-label">The Artist</span>
              <div className="wizard-line"></div>
            </div>
            <div className={`wizard-step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="wizard-step-dot">3</div>
              <span className="wizard-step-label">Publishing</span>
              <div className="wizard-line"></div>
            </div>
          </div>

          <form onSubmit={submit} className="panel wood-frame" style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)", display: "grid", gap: "1.8rem" }}>
            
            {/* Step 1: The Artwork */}
            <div style={{ display: currentStep === 1 ? "grid" : "none", gap: "1.8rem" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <h2 className="serif" style={{ margin: 0, fontSize: "1.5rem", color: "var(--gold)" }}>Artwork Details</h2>
                <p className="muted" style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>Provide the core information and upload a high-quality image.</p>
              </div>
              
              <ImageField name="image" label="Main Artwork Image" required preview={previews.image} onPreview={updatePreview} />
              
              <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.4rem" }}>
                <Field name="title" label="Artwork Title" required>
                  <input className="input input-premium" id="title" name="title" required />
                </Field>
                <div className="responsive-two-col">
                  <Field name="medium" label="Medium" required>
                    <input className="input input-premium" id="medium" name="medium" required placeholder="Oil, adire, bronze..." />
                  </Field>
                  <Field name="price" label="Price (USD)">
                    <input className="input input-premium" id="price" name="price" type="number" min="0" step="0.01" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Step 2: About the Artist */}
            <div style={{ display: currentStep === 2 ? "grid" : "none", gap: "1.8rem" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <h2 className="serif" style={{ margin: 0, fontSize: "1.5rem", color: "var(--gold)" }}>About the Artist</h2>
                <p className="muted" style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>Who created this piece? Share their story and inspiration.</p>
              </div>
              
              <Field name="artist_name" label="Artist Name" required>
                <input className="input input-premium" id="artist_name" name="artist_name" required />
              </Field>

              <ImageField name="artist_image" label="Artist Photo" preview={previews.artist_image} onPreview={updatePreview} />
              
              <Field name="artist_quote" label="Artist Profile Quote">
                <input className="input input-premium" id="artist_quote" name="artist_quote" placeholder="A personal philosophical quote from the artist..." />
              </Field>

              <Field name="artist_bio" label="Artist Bio">
                <textarea className="input input-premium" id="artist_bio" name="artist_bio" rows={4} placeholder="A brief biography describing the artist's roots, achievements, and vision." />
              </Field>
              
              <Field name="piece_story" label="Short Story / Description">
                <textarea className="input input-premium" id="piece_story" name="piece_story" rows={6} placeholder="A short note about the work, inspiration, or meaning." />
              </Field>
            </div>

            {/* Step 3: Categorization & Status */}
            <div style={{ display: currentStep === 3 ? "grid" : "none", gap: "1.8rem" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <h2 className="serif" style={{ margin: 0, fontSize: "1.5rem", color: "var(--gold)" }}>Categorization & Status</h2>
                <p className="muted" style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>Organize the artwork and set its marketplace availability.</p>
              </div>

              <div className="field">
                <label>Category *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {CATEGORIES.map((category) => {
                    const active = categories.includes(category);
                    return (
                      <button key={category} type="button" aria-pressed={active} onClick={() => toggleCategory(category)} style={{ background: active ? "var(--gold)" : "var(--panel-2)", border: `1px solid ${active ? "var(--gold-light)" : "var(--border)"}`, borderRadius: 999, color: active ? "var(--bg)" : "var(--muted)", cursor: "pointer", padding: "0.6rem 1rem", fontSize: "0.85rem", transition: "all 200ms ease", boxShadow: active ? "0 4px 14px rgba(193, 123, 47, 0.25)" : "none" }}>
                        {category}
                      </button>
                    );
                  })}
                </div>
                {categories.includes("Others") ? <input className="input input-premium" style={{ marginTop: "0.8rem" }} value={others} onChange={(event) => setOthers(event.target.value)} placeholder="Describe the category" /> : null}
              </div>

              <div className="responsive-two-col" style={{ marginTop: "0.5rem" }}>
                <Field name="availability" label="Availability">
                  <select className="input input-premium" id="availability" name="availability" defaultValue="For Sale">
                    {AVAILABILITY.map((value) => <option key={value}>{value}</option>)}
                  </select>
                </Field>
                <Field name="publication_status" label="Status">
                  <select className="input input-premium" id="publication_status" name="publication_status" defaultValue="Draft">
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </Field>
              </div>
            </div>

            {message ? <p aria-live="polite" style={{ color: status === "error" ? "#ffb4a8" : "var(--gold-light)", margin: 0, padding: "0.85rem 1rem", background: status === "error" ? "rgba(139, 26, 26, 0.2)" : "rgba(193, 123, 47, 0.1)", borderRadius: "6px", border: `1px solid ${status === "error" ? "rgba(139, 26, 26, 0.4)" : "rgba(193, 123, 47, 0.3)"}` }}>{message}</p> : null}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "1.8rem", marginTop: "0.5rem" }}>
              {currentStep > 1 ? (
                <button type="button" className="btn btn-ghost" onClick={prevStep}><ArrowLeft size={16} /> Back</button>
              ) : <div></div>}

              {currentStep < 3 ? (
                <button type="button" className="btn btn-primary" onClick={nextStep} style={{ paddingLeft: "2rem", paddingRight: "1.5rem" }}>Next Step <ArrowRight size={16} /></button>
              ) : (
                <div style={{ display: "flex", gap: 12 }}>
                  <button className="btn btn-ghost" type="submit" name="intent_status" value="Draft" onClick={() => setIntentStatus("Draft")} disabled={status === "loading"}>
                    {status === "loading" && intentStatus === "Draft" ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} 
                    {status === "loading" && intentStatus === "Draft" ? "Saving..." : "Save Draft"}
                  </button>
                  <button className="btn btn-primary bronze-glow" type="submit" name="intent_status" value="Published" onClick={() => setIntentStatus("Published")} disabled={status === "loading"} style={{ border: "1px solid var(--gold-light)" }}>
                    {status === "loading" && intentStatus === "Published" ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} 
                    {status === "loading" && intentStatus === "Published" ? "Publishing..." : "Publish Now"}
                  </button>
                </div>
              )}
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
    <label className="panel wood-frame dropzone" style={{ alignItems: "center", background: "var(--panel-2)", cursor: "pointer", display: "grid", justifyItems: "center", minHeight: 200, overflow: "hidden", padding: "1.8rem", textAlign: "center", borderRadius: "8px" }}>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={`${label} preview`} style={{ maxHeight: 260, objectFit: "contain", borderRadius: "4px" }} />
      ) : (
        <>
          <ImagePlus className="dropzone-icon" color="var(--gold)" size={38} style={{ marginBottom: "0.8rem" }} />
          <span style={{ fontSize: "1.05rem", color: "var(--cream)", marginBottom: "0.3rem" }}>Upload {label}</span>
          <span className="muted" style={{ fontSize: "0.8rem", letterSpacing: "0.05em" }}>{required ? "REQUIRED IMAGE" : "OPTIONAL IMAGE"}</span>
        </>
      )}
      <input style={{ border: 0, clip: "rect(0 0 0 0)", height: "1px", margin: "-1px", overflow: "hidden", padding: 0, position: "absolute", width: "1px" }} name={name} type="file" accept="image/*" onChange={(event) => onPreview(name, event.target.files?.[0])} />
    </label>
  );
}
