import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const requestedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const slugKey = (value: string) => value.trim().toLowerCase().replace(/[-_\\s]+/g, " ");
  const { data: publishedProjects, error } = await supabase.from("projects").select("*").eq("status", "published");
  if (error) console.error("Project detail lookup failed:", error.message);
  const p = (publishedProjects ?? []).find((project: any) =>
    slugKey(project.slug) === slugKey(requestedSlug) || slugKey(project.title) === slugKey(requestedSlug)
  );
  if (!p) notFound();

  return (
    <main className="wrap project-detail">
      <Link href={`/work/${p.category}`} className="career-back-link">
        <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" />
        <span>Back to {p.category}</span>
      </Link>

      <header className="project-detail-header">
        <div className="eyebrow">Project / {p.category}</div>
        <h1 className="pixel project-detail-title">{p.title}</h1>
        <p className="project-detail-summary">{p.summary}</p>
        {p.tags?.length > 0 && (
          <div className="project-detail-tags">
            {p.tags.map((tag: string) => <span className="status" key={tag}>{tag}</span>)}
          </div>
        )}
      </header>

      {p.video_url && (
        <section className="project-media-grid has-one-media" aria-label="Project demo video">
          <figure className="project-media-card project-video-card">
            <figcaption className="project-media-heading">
              <span><Play size={15} aria-hidden="true" /> Demo walkthrough</span>
              <span className="eyebrow">01 / VIDEO</span>
            </figcaption>
            <div className="project-media-frame project-video-frame">
              <video
                src={p.video_url}
                controls
                autoPlay
                muted
                playsInline
                preload="auto"
              />
            </div>
          </figure>
        </section>
      )}

      <article className="project-detail-body">{p.body || p.summary}</article>

      {(p.repo_url || p.live_url) && (
        <section className="project-detail-actions" aria-label="Project links">
          <div>
            <div className="eyebrow">Explore further</div>
            <p className="muted">View the source or open the live project.</p>
          </div>
          <div className="project-detail-buttons">
            {p.repo_url && <a className="button" href={p.repo_url} target="_blank" rel="noreferrer">Repository <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" /></a>}
            {p.live_url && <a className="button" href={p.live_url} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden="true" /></a>}
          </div>
        </section>
      )}
    </main>
  );
}
