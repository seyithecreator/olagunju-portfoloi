import { createClient } from "@/lib/supabase/server";
export type PortfolioProject = { id: string; title: string; slug: string; category: string; summary: string; body: string | null; cover_image: string | null; repo_url: string | null; live_url: string | null; tags: string[]; featured: boolean; published_at: string | null; sort_order: number };
export async function getProjects(category?: string) {
  const supabase = await createClient();
  let query = supabase.from("projects").select("*").eq("status", "published").order("featured", {ascending:false}).order("sort_order", {ascending:true});
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) { console.error("Project query failed:", error.message); return [] as PortfolioProject[]; }
  return (data ?? []) as PortfolioProject[];
}
