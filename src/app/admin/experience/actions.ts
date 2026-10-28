"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function auth() {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await s.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) throw new Error("Administrator access required");
  return s;
}

export async function saveExperience(f: FormData) {
  const s = await auth();
  const id = String(f.get("id") || "");
  const current = f.get("current") === "on";
  const payload = {
    title: String(f.get("title") || "").trim(),
    organization: String(f.get("organization") || "").trim(),
    category: String(f.get("category") || "general"),
    description: String(f.get("description") || "").trim(),
    start_date: String(f.get("start_date") || "") || null,
    end_date: current ? null : (String(f.get("end_date") || "") || null),
    current,
  };
  if (!payload.title) throw new Error("Role or title is required.");
  const result = id ? await s.from("experiences").update(payload).eq("id", id) : await s.from("experiences").insert(payload);
  if (result.error) throw new Error(result.error.message);
  redirect("/admin/experience?message=" + encodeURIComponent(id ? "Experience updated" : "Experience added"));
}

export async function deleteExperience(f: FormData) {
  const s = await auth();
  const { error } = await s.from("experiences").delete().eq("id", String(f.get("id") || ""));
  if (error) throw new Error(error.message);
  redirect("/admin/experience?message=" + encodeURIComponent("Experience deleted"));
}
