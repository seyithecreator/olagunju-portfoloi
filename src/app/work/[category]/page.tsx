import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { SectionIcon } from "@/components/section-icon";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const supabase = await createClient();
  const { data: section } = await supabase.from("portfolio_sections").select("title,slug,description,icon_name,visible").eq("slug", category).maybeSingle();
  if (!section || !section.visible) notFound();
  const projects = await getProjects(category);

  return (
    <main>
      <header className="wrap site-header">
        <Link href="/" className="pixel brand-mark" aria-label="Olagunju Oluwaseyi home">O/</Link>
        <nav className="site-nav site-nav-desktop" aria-label="Main navigation">
          <Link href="/#work">Work</Link><Link href="/#disciplines">Disciplines</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link>
        </nav>
        <details className="mobile-nav"><summary aria-label="Open navigation menu"><span className="mobile-nav-label">MENU</span><span className="mobile-nav-lines"><i/><i/></span></summary><nav aria-label="Mobile main navigation"><Link href="/#work">Work <span>↗</span></Link><Link href="/#disciplines">Disciplines <span>↗</span></Link><Link href="/#about">About <span>↗</span></Link><Link href="/#contact">Contact <span>↗</span></Link></nav></details>
      </header>
      <section className="wrap career-hero">
        <div className="career-hero-copy">
          <Link href="/#disciplines" className="career-back-link">← All disciplines</Link>
          <div className="eyebrow career-kicker">Portfolio / Area of practice</div>
          <h1 className="pixel career-title">{section.title}<span className="neon-text">.</span></h1>
          <p className="career-description">{section.description || "A collection of projects, practical work and ongoing learning in this area."}</p>
          <a className="button career-cta" href="#career-work">Explore this work <ArrowUpRight size={14}/></a>
        </div>
        <div className="career-icon-stage" aria-hidden="true">
          <div className="career-icon-orbit career-icon-orbit-one"/><div className="career-icon-orbit career-icon-orbit-two"/><div className="career-icon-glow"/>
          <SectionIcon name={section.icon_name} size={94} strokeWidth={1.15} className="career-main-icon"/>
          <span className="career-icon-caption">AREA / {section.slug.toUpperCase()}</span>
        </div>
      </section>
      <section id="career-work" className="rule">
        <div className="wrap section-pad">
          <div className="section-heading">
            <div><div className="eyebrow">01 / Selected work</div><h2 className="pixel section-title">PROJECTS<span className="neon-text">.</span></h2></div>
            <span className="muted" style={{fontSize:12}}>{projects.length} {projects.length === 1 ? "project" : "projects"}</span>
          </div>
          {projects.length === 0 ? <div className="career-empty"><div className="career-empty-mark" aria-hidden="true"><SectionIcon name={section.icon_name} size={24}/></div><h3 className="pixel">MORE WORK IN PROGRESS</h3><p className="muted">Projects in this area will appear here as they are ready to share.</p><Link className="button" href="/#disciplines">Explore other disciplines <ArrowUpRight size={14}/></Link></div> :
            <div className="project-grid">{projects.map(p=><Link key={p.id} href={"/projects/"+p.slug} className="card career-project-card"><div className="eyebrow">{p.category}</div><h2 className="pixel card-title" style={{marginTop:22}}>{p.title}</h2><p className="card-copy">{p.summary}</p><span className="eyebrow career-project-link">Read case study <ArrowUpRight size={13}/></span></Link>)}</div>}
        </div>
      </section>
      <footer className="rule"><div className="wrap site-footer"><div><Link href="/" className="pixel" style={{fontSize:22}}>OLAGUNJU OLUWASEYI<span className="neon-text">.</span></Link><p className="muted" style={{fontSize:12}}>Technology. Security. Production.</p></div><div className="footer-links"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></div><div className="eyebrow" style={{width:"100%",color:"#829087"}}>© {new Date().getFullYear()} / Built to evolve</div></div></footer>
    </main>
  );
}
