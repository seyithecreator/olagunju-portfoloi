import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = "https://olagunju-portfoloi.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [
    { data: projects, error: projectsError },
    { data: sections, error: sectionsError },
  ] = await Promise.all([
    supabase.from("projects").select("slug").eq("status", "published"),
    supabase.from("portfolio_sections").select("slug").eq("visible", true),
  ]);

  if (projectsError) {
    console.error("Sitemap project lookup failed:", projectsError.message);
  }
  if (sectionsError) {
    console.error("Sitemap section lookup failed:", sectionsError.message);
  }

  const projectUrls = (projects ?? []).map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const sectionUrls = (sections ?? []).map((section) => ({
    url: `${siteUrl}/work/${section.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...sectionUrls,
    ...projectUrls,
  ];
}
