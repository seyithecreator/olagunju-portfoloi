"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "portfolio-assets";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export default function ProjectVideoUpload({ currentImage = "", currentVideo = "" }: { currentImage?: string; currentVideo?: string }) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [videoUrl, setVideoUrl] = useState(currentVideo);
  const [busy, setBusy] = useState<"image" | "video" | null>(null);
  const [message, setMessage] = useState("");

  async function upload(kind: "image" | "video") {
    const file = kind === "image" ? imageFile : videoFile;
    if (!file) return;
    const form = document.querySelector("form");
    const projectTitle = (form?.querySelector<HTMLInputElement>('input[name="title"]')?.value ?? "").trim();
    const projectSlug = (form?.querySelector<HTMLInputElement>('input[name="slug"]')?.value ?? "").trim();
    if (!projectTitle || !projectSlug) return setMessage("Enter the project title and slug before uploading media.");
    if (kind === "image" ? !file.type.startsWith("image/") : !file.type.startsWith("video/")) return setMessage(`Choose a valid ${kind} file.`);
    if (file.size > MAX_FILE_SIZE) return setMessage("File must be 25 MB or smaller.");

    setBusy(kind);
    setMessage("");
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Please sign in before uploading.");
      const { data: admin, error: adminError } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
      if (adminError || !admin) throw new Error("This account is not authorized to upload project media.");

      const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
      const storagePath = `projects/${projectSlug}/${kind}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file, { upsert: false, contentType: file.type });
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      const url = publicData.publicUrl;
      const { error: recordError } = await supabase.from("media_assets").insert({
        file_name: `${projectTitle} — ${file.name}`,
        storage_path: storagePath,
        public_url: url,
        mime_type: file.type,
        file_size_bytes: file.size,
        media_kind: kind,
        caption: projectTitle,
        alt_text: kind === "image" ? `Cover image for ${projectTitle}` : `Video for ${projectTitle}`
      });
      if (recordError) throw new Error(`${kind === "image" ? "Image" : "Video"} uploaded, but its Media Library record could not be saved: ${recordError.message}`);

      if (kind === "image") { setImageUrl(url); setImageFile(null); }
      else { setVideoUrl(url); setVideoFile(null); }
      setMessage(`${kind === "image" ? "Image" : "Video"} uploaded and added to the Media Library under this project name. Save the project to attach it.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `${kind} upload failed.`);
    } finally {
      setBusy(null);
    }
  }

  return <>
    <div className="field">
      <label>Upload project cover image (max 25 MB)</label>
      <input type="file" accept="image/*" onChange={event => setImageFile(event.target.files?.[0] ?? null)} />
      {imageFile && <p className="muted" style={{fontSize:12}}>{imageFile.name} · {(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>}
      <button type="button" className="button" disabled={!imageFile || !!busy} onClick={() => upload("image")}>{busy === "image" ? "Uploading…" : "Upload image to Media Library ↥"}</button>
      {imageUrl && <p className="muted" style={{fontSize:12,overflowWrap:"anywhere"}}>Cover image attached or ready to attach.</p>}
    </div>
    <div className="field">
      <label>Upload project video (max 25 MB)</label>
      <input type="file" accept="video/*" onChange={event => setVideoFile(event.target.files?.[0] ?? null)} />
      {videoFile && <p className="muted" style={{fontSize:12}}>{videoFile.name} · {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>}
      <button type="button" className="button" disabled={!videoFile || !!busy} onClick={() => upload("video")}>{busy === "video" ? "Uploading…" : "Upload video to Media Library ↥"}</button>
      {videoUrl && <p className="muted" style={{fontSize:12,overflowWrap:"anywhere"}}>Project video attached or ready to attach.</p>}
    </div>
    <input type="hidden" name="cover_image" value={imageUrl} />
    <input type="hidden" name="video_url" value={videoUrl} />
    {message && <p role="status" className="muted" style={{fontSize:12}}>{message}</p>}
  </>;
}
