"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function saveSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) redirect("/admin/login");

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    redirect("/admin/settings?error=" + encodeURIComponent("Could not verify administrator access: " + adminError.message));
  }
  if (!admin) redirect("/admin");

  const payload = {
    id: 1,
    display_name: String(formData.get("display_name") || ""),
    headline: String(formData.get("headline") || ""),
    bio: String(formData.get("bio") || ""),
    email: String(formData.get("email") || ""),
    github_url: String(formData.get("github_url") || ""),
    linkedin_url: String(formData.get("linkedin_url") || ""),
  };

  const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "id" });

  if (error) {
    redirect("/admin/settings?error=" + encodeURIComponent("Settings could not be saved: " + error.message));
  }

  redirect("/admin/settings?saved=1");
}
