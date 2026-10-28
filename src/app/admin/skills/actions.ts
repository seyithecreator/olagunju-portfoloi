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

export async function saveSkill(f: FormData) {
  const s = await auth();
  const id = String(f.get("id") || "");
  const payload = { name: String(f.get("name") || "").trim(), category: String(f.get("category") || "general"), level: String(f.get("level") || "").trim(), sort_order: Number(f.get("sort_order") || 0) };
  if (!payload.name) throw new Error("Skill name is required.");
  const result = id ? await s.from("skills").update(payload).eq("id", id) : await s.from("skills").insert(payload);
  if (result.error) throw new Error(result.error.message);
  redirect("/admin/skills?message=" + encodeURIComponent(id ? "Skill updated" : "Skill added"));
}

export async function deleteSkill(f: FormData) {
  const s = await auth();
  const { error } = await s.from("skills").delete().eq("id", String(f.get("id") || ""));
  if (error) throw new Error(error.message);
  redirect("/admin/skills?message=" + encodeURIComponent("Skill deleted"));
}
