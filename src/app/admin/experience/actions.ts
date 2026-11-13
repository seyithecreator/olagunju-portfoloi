"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: admin, error } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error) redirect("/admin/experience?error=" + encodeURIComponent("Administrator check failed: " + error.message));
  if (!admin) redirect("/admin");
  return supabase;
}

export async function saveExperience(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const isCurrent = formData.get("current") === "on";
  const payload = {
    title: String(formData.get("title") || "").trim(),
    organization: String(formData.get("organization") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    description: String(formData.get("description") || ""),
    start_date: String(formData.get("start_date") || "") || null,
    end_date: isCurrent ? null : (String(formData.get("end_date") || "") || null),
    current: isCurrent,
    is_current: isCurrent,
  };
  if (!payload.title || !payload.category) redirect("/admin/experience?error=" + encodeURIComponent("Role title and career path are required."));
  const result = id
    ? await supabase.from("experiences").update(payload).eq("id", id)
    : await supabase.from("experiences").insert(payload);
  if (result.error) redirect("/admin/experience?error=" + encodeURIComponent(result.error.message));
  redirect("/admin/experience?saved=1");
}

export async function deleteExperience(formData: FormData) {
  const supabase = await adminClient();
  const { error } = await supabase.from("experiences").delete().eq("id", String(formData.get("id") || ""));
  if (error) redirect("/admin/experience?error=" + encodeURIComponent(error.message));
  redirect("/admin/experience?saved=1");
}
