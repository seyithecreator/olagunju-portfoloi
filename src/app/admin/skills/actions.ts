"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function adminClient() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/admin/login");
  const { data: admin, error } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error) redirect("/admin/skills?error=" + encodeURIComponent("Administrator check failed: " + error.message));
  if (!admin) redirect("/admin");
  return supabase;
}

export async function saveSkill(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    level: String(formData.get("level") || "").trim(),
  };
  if (!payload.name || !payload.category) redirect("/admin/skills?error=" + encodeURIComponent("Skill name and career path are required."));
  const result = id
    ? await supabase.from("skills").update(payload).eq("id", id)
    : await supabase.from("skills").insert(payload);
  if (result.error) redirect("/admin/skills?error=" + encodeURIComponent(result.error.message));
  redirect("/admin/skills?saved=1");
}

export async function deleteSkill(formData: FormData) {
  const supabase = await adminClient();
  const { error } = await supabase.from("skills").delete().eq("id", String(formData.get("id") || ""));
  if (error) redirect("/admin/skills?error=" + encodeURIComponent(error.message));
  redirect("/admin/skills?saved=1");
}
