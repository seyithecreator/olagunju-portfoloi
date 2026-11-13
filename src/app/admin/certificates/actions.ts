"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: admin, error } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error) redirect("/admin/certificates?error=" + encodeURIComponent("Administrator check failed: " + error.message));
  if (!admin) redirect("/admin");
  return supabase;
}

export async function saveCertificate(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || "").trim(),
    issuer: String(formData.get("issuer") || "").trim(),
    issue_date: String(formData.get("issue_date") || "") || null,
    expiry_date: String(formData.get("expiry_date") || "") || null,
    credential_id: String(formData.get("credential_id") || "").trim(),
    credential_url: String(formData.get("credential_url") || "").trim() || null,
    description: String(formData.get("description") || ""),
    visible: formData.get("visible") === "on",
  };
  if (!payload.name || !payload.issuer) redirect("/admin/certificates?error=" + encodeURIComponent("Certificate name and issuing organisation are required."));
  const result = id
    ? await supabase.from("certificates").update(payload).eq("id", id)
    : await supabase.from("certificates").insert(payload);
  if (result.error) redirect("/admin/certificates?error=" + encodeURIComponent(result.error.message));
  redirect("/admin/certificates?saved=1");
}

export async function deleteCertificate(formData: FormData) {
  const supabase = await adminClient();
  const { error } = await supabase.from("certificates").delete().eq("id", String(formData.get("id") || ""));
  if (error) redirect("/admin/certificates?error=" + encodeURIComponent(error.message));
  redirect("/admin/certificates?saved=1");
}
