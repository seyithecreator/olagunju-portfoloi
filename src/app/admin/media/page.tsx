"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "portfolio-assets";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export default function MediaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<{ name: string; size: number | null; createdAt: string | null }[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function getAuthorizedClient() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Please sign in to manage portfolio media.");
    const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
    if (adminError || !admin) throw new Error("This account is not authorized to manage portfolio media.");
    return supabase;
  }

  async function load() {
    setBusy(true);
    setMessage("");
    try {
      const supabase = await getAuthorizedClient();
      const { data, error } = await supabase.storage.from(BUCKET).list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw new Error(error.message);
      setItems((data ?? []).map((item) => ({ name: item.name, size: item.metadata?.size ?? null, createdAt: item.created_at ?? null })));
      if (!data?.length) setMessage("No files found yet. Upload a public asset to get started.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load media.");
    } finally {
      setBusy(false);
    }
  }

  async function upload() {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setMessage("This file is larger than 25 MB. Choose a smaller file.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const supabase = await getAuthorizedClient();
      const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
      const path = `${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
      if (error) throw new Error(error.message);
      setMessage("Upload complete. Use the public asset URL in a project's cover image field.");
      setFile(null);
      const picker = document.getElementById("media-file-picker") as HTMLInputElement | null;
      if (picker) picker.value = "";
      const { data, error: listError } = await supabase.storage.from(BUCKET).list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });
      if (!listError) setItems((data ?? []).map((item) => ({ name: item.name, size: item.metadata?.size ?? null, createdAt: item.created_at ?? null })));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function copyPublicUrl(name: string) {
    try {
      const supabase = await getAuthorizedClient();
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
      await navigator.clipboard.writeText(data.publicUrl);
      setMessage("Public URL copied. Paste it into the project's cover image URL field.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not copy URL.");
    }
  }

  return <main className="admin-shell">
    <aside className="admin-nav">
      <Link href="/admin" className="pixel" style={{ fontSize: 21 }}>← CMS</Link>
      <span className="eyebrow">Media library</span>
      <Link href="/admin/projects">Projects</Link><Link href="/admin/experience">Experience</Link><Link href="/admin/skills">Skills</Link><Link href="/admin/settings">Settings</Link>
      <Link href="/" style={{ marginTop: "auto" }}>View site ↗</Link>
    </aside>
    <section className="admin-content">
      <div className="eyebrow">Assets / Supabase Storage</div>
      <h1 className="pixel" style={{ fontSize: 42, margin: "14px 0" }}>MEDIA LIBRARY<span className="neon-text">.</span></h1>
      <p className="muted" style={{ lineHeight: 1.8, fontSize: 13, maxWidth: 680 }}>Upload public portfolio assets, then copy an image URL into a project's cover image field. Files in this bucket may be publicly accessible, so never upload private documents or confidential client material.</p>
      <div style={{ border: "1px solid rgba(166,255,117,.2)", background: "rgba(17,24,19,.8)", padding: 20, maxWidth: 760, margin: "24px 0", borderRadius: 7 }}>
        <div className="eyebrow">Upload asset / Max 25 MB</div>
        <div className="field"><label htmlFor="media-file-picker">Choose an image, video, or PDF</label><input id="media-file-picker" type="file" accept="image/*,video/*,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></div>
        <p className="muted" style={{ fontSize: 12, overflowWrap: "anywhere" }}>Selected: {file?.name ?? "No file selected"}{file ? ` · ${(file.size / (1024 * 1024)).toFixed(2)} MB` : ""}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="button" disabled={!file || busy} onClick={upload}>{busy ? "Working…" : "Upload file ↥"}</button>
          <button className="button" disabled={busy} onClick={load}>{busy ? "Loading…" : "Refresh library ↻"}</button>
        </div>
        {message && <p role="status" style={{ fontSize: 12, lineHeight: 1.7, marginTop: 14, color: message.toLowerCase().includes("failed") || message.toLowerCase().includes("not authorized") || message.toLowerCase().includes("sign in") ? "#ff8585" : "var(--neon)" }}>{message}</p>}
      </div>
      <div className="admin-topline"><div><div className="eyebrow">Storage / {items.length} listed</div><h2 className="pixel" style={{ fontSize: 24, margin: "10px 0" }}>STORED ASSETS</h2></div><span className="muted" style={{ fontSize: 11 }}>Bucket: {BUCKET}</span></div>
      <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
        {items.map((item) => <div key={item.name} className="card" style={{ minHeight: 0, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: "1 1 220px" }}><strong style={{ fontSize: 12, overflowWrap: "anywhere" }}>{item.name}</strong><div className="muted" style={{ fontSize: 11, marginTop: 6 }}>{item.size == null ? "Size unavailable" : `${(item.size / (1024 * 1024)).toFixed(2)} MB`}{item.createdAt ? ` · ${new Date(item.createdAt).toLocaleDateString()}` : ""}</div></div>
          <button className="button" onClick={() => copyPublicUrl(item.name)}>Copy public URL ↗</button>
        </div>)}
        {items.length === 0 && <p className="muted" style={{ fontSize: 13 }}>Select “Refresh library” to check for existing files.</p>}
      </div>
    </section>
  </main>;
}
