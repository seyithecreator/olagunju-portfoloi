"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "portfolio-assets";
const MAX_VIDEO_SIZE = 25 * 1024 * 1024;

export default function ProjectVideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file) return;
    const form = document.querySelector("form");
    const projectTitle = (form?.querySelector<HTMLInputElement>('input[name="title"]')?.value ?? "").trim();
    const projectSlug = (form?.querySelector<HTMLInputElement>('input[name="slug"]')?.value ?? "").trim();
    if (!projectTitle || !projectSlug) {
      setMessage("Enter the project title and slug before uploading its video.");
      return;
    }
    if (!file.type.startsWith("video/")) {
      setMessage("Choose a video file.");
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setMessage("Video must be 25 MB or smaller.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Please sign in before uploading.");
      const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
      if (adminError || !admin) throw new Error("This account is not authorized to upload project media.");

      const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
      const path = `projects/${projectSlug}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type });
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const url = publicData.publicUrl;
      const { error: recordError } = await supabase.from("media_assets").insert({
        file_name: `${projectTitle.trim()} — ${file.name}`,
        storage_path: path,
        public_url: url,
        mime_type: file.type,
        file_size_bytes: file.size,
        media_kind: "video",
        caption: projectTitle.trim(),
        alt_text: `Video for ${projectTitle.trim()}`
      });
      if (recordError) throw new Error(`Video uploaded, but its Media Library record could not be saved: ${recordError.message}`);
      setVideoUrl(url);
      setFile(null);
      setMessage("Video uploaded and added to the Media Library under this project name. Save the project to attach it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Video upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return <div className="field">
    <label>Upload project video (max 25 MB)</label>
    <input type="file" accept="video/*" onChange={event => setFile(event.target.files?.[0] ?? null)} />
    {file && <p className="muted" style={{fontSize:12}}>{file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB</p>}
    <button type="button" className="button" disabled={!file || busy} onClick={upload}>{busy ? "Uploading…" : "Upload video to Media Library ↥"}</button>
    <input type="hidden" name="video_url" value={videoUrl} />
    {videoUrl && <p className="muted" style={{fontSize:12,overflowWrap:"anywhere"}}>Uploaded video is ready to attach. Save this project to keep the link.</p>}
    {message && <p role="status" className="muted" style={{fontSize:12}}>{message}</p>}
  </div>;
}
