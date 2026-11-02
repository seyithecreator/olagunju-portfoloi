import { createClient } from "@/lib/supabase/server";

export type PortfolioProject = {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string | null;
  cover_image: string | null;
  repo_url: string | null;
  live_url: string | null;
  tags: string[];
  featured: boolean;
  published_at: string | null;
  sort_order: number;
};

export async function getProjects(category?: string) {
  const supabase = await createClient();

  if (category) {
    // Career assignments live in project_sections. Do not filter by the
    // legacy projects.category field: one project can belong to many careers.
    const { data, error } = await supabase
      .from("project_sections")
      .select("projects!inner(*)")
      .eq("section_slug", category)
      .eq("projects.status", "published");

    if (error) {
      console.error("Career project query failed:", error.message);
      return [] as PortfolioProject[];
    }

    const projects = (data ?? [])
      .map((row: any) => row.projects)
      .filter(Boolean) as PortfolioProject[];

    // Keep the same ordering as the all-projects query and avoid duplicates.
    return projects
      .filter((project, index, all) => all.findIndex((item) => item.id === project.id) === index)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Project query failed:", error.message);
    return [] as PortfolioProject[];
  }

  return (data ?? []) as PortfolioProject[];
}
