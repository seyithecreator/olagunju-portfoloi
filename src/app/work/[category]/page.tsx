import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { SectionIcon } from "@/components/section-icon";

function displayDate(value: string | null) {
  if (!value) return "";
  return new Date(value + (value.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const supabase = await createClient();
  const { data: section } = await supabase.from("portfolio_sections").select("title,slug,description,icon_name,visible").eq("slug", category).maybeSingle();
  if (!section || !section.visible) notFound();
  const [projects, { data: experiences }, { data: skills }] = await Promise.all([
    getProjects(category),
    supabase.from("experiences").select("id,title,organization,description,start_date,end_date,is_current,current").eq("category", category).order("start_date", { ascending: false }),
    supabase.from("skills").select("id,name,level,proficiency_label,description,sort_order").eq("category", category).eq("visible", true).order("sort_order", { ascending: true }),
  ]);

  return (
    <main>
      <header className="wrap site-header">
        <Link href="/" className="pixel brand-mark" aria-label="Olagunju Oluwaseyi home">O/</Link>
        <nav className="site-nav site-nav-desktop" aria-label="Main navigation"><Link href="/#work">Work</Link><Link href="/#disciplines">Disciplines</Link><Link href="/#experience">Experience</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></nav>
        <details className="mobile-nav"><summary aria-label="Open navigation menu"><span className="mobile-nav-label">MENU</span><span className="mobile-nav-lines"><i/><i/></span></summary><nav aria-label="Mobile main navigation"><Link href="/#work">Work <ArrowUpRight size={13} strokeWidth={1.8}/></Link><Link href="/#disciplines">Disciplines <ArrowUpRight size={13} strokeWidth={1.8}/></Link><Link href="/#experience">Experience <ArrowUpRight size={13} strokeWidth={1.8}/></Link><Link href="/#about">About <ArrowUpRight size={13} strokeWidth={1.8}/></Link><Link href="/#contact">Contact <ArrowUpRight size={13} strokeWidth={1.8}/></Link></nav></details>
      </header>
      <section className="wrap career-hero">
        <div className="career-hero-copy">
          <Link href="/#disciplines" className="career-back-link"><ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" /> <span>All disciplines</span></Link>
          <div className="eyebrow career-kicker">Portfolio / Area of practice</div><h1 className="pixel career-title">{section.title}<span className="neon-text">.</span></h1>
          <p className="career-description">{section.description || "A collection of projects, practical work and ongoing learning in this area."}</p>
          <a className="button career-cta" href="#career-work">Explore this work <ArrowUpRight size={14}/></a>
        </div>
        <div className="career-icon-stage" aria-hidden="true"><div className="career-icon-orbit career-icon-orbit-one"/><div className="career-icon-orbit career-icon-orbit-two"/><div className="career-icon-glow"/><SectionIcon name={section.icon_name} size={94} strokeWidth={1.15} className="career-main-icon"/><span className="career-icon-caption">AREA / {section.slug.toUpperCase()}</span></div>
      </section>
      <section id="career-work" className="rule">
        <div className="wrap section-pad">
          <div className="section-heading"><div><div className="eyebrow">01 / Selected work</div><h2 className="pixel section-title">PROJECTS<span className="neon-text">.</span></h2></div><span className="muted" style={{fontSize:12}}>{projects.length} {projects.length === 1 ? "project" : "projects"}</span></div>
          {projects.length === 0 ? <div className="career-empty"><div className="career-empty-mark" aria-hidden="true"><SectionIcon name={section.icon_name} size={24}/></div><h3 className="pixel">MORE WORK IN PROGRESS</h3><p className="muted">Projects in this area will appear here as they are ready to share.</p><Link className="button" href="/#disciplines">Explore other disciplines <ArrowUpRight size={14}/></Link></div> :
            <div className="project-grid">{projects.map(p=><Link key={p.id} href={"/projects/"+p.slug} className="card">{p.cover_image ? <img src={p.cover_image} alt={`${p.title} cover`} loading="lazy" style={{width:"100%",aspectRatio:"16 / 9",objectFit:"cover",display:"block",marginBottom:18,border:"1px solid #333"}}/> : <div aria-hidden="true" className="career-project-image-fallback" style={{width:"100%",aspectRatio:"16 / 9",display:"grid",placeItems:"center",marginBottom:18,border:"1px solid #333",background:"linear-gradient(135deg, #111a16, #090d0b)",color:"#a3ff12",fontSize:30,fontFamily:"monospace"}}>O/</div>}<div className="eyebrow">{p.category}</div><h2 className="pixel card-title" style={{marginTop:22}}>{p.title}</h2><p className="card-copy">{p.summary}</p><span className="eyebrow career-project-link">Read case study <ArrowUpRight size={13}/></span></Link>)}</div>}
        </div>
      </section>

      {experiences && experiences.length > 0 && <section className="rule"><div className="wrap section-pad"><div className="eyebrow">02 / Professional journey</div><h2 className="pixel section-title">EXPERIENCE<span className="neon-text">.</span></h2><div style={{display:"grid",gap:14,marginTop:24}}>{experiences.map(item=><article key={item.id} className="card" style={{minHeight:0}}><div style={{display:"flex",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}><div><h3 className="pixel" style={{fontSize:19,margin:0}}>{item.title}</h3><p className="muted" style={{margin:"8px 0 0"}}>{item.organization}</p></div><span className="eyebrow">{displayDate(item.start_date)} – {(item.is_current||item.current)?"Present":displayDate(item.end_date)}</span></div>{item.description&&<p className="card-copy" style={{whiteSpace:"pre-wrap"}}>{item.description}</p>}</article>)}</div></div></section>}

      {skills && skills.length > 0 && <section className="rule"><div className="wrap section-pad"><div className="eyebrow">03 / Capabilities</div><h2 className="pixel section-title">SKILLS & TOOLS<span className="neon-text">.</span></h2><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:12,marginTop:24}}>{skills.map(skill=><article key={skill.id} className="card" style={{minHeight:0,padding:18}}><h3 className="pixel" style={{fontSize:16,margin:0}}>{skill.name}</h3>{(skill.level||skill.proficiency_label)&&<p className="eyebrow" style={{margin:"10px 0 0"}}>{skill.level||skill.proficiency_label}</p>}{skill.description&&<p className="card-copy">{skill.description}</p>}</article>)}</div></div></section>}

      <footer className="rule"><div className="wrap site-footer"><div><Link href="/" className="pixel" style={{fontSize:22}}>OLAGUNJU OLUWASEYI<span className="neon-text">.</span></Link><p className="muted" style={{fontSize:12}}>Technology. Cybersecurity. Problem-solving.</p></div><div className="footer-links"><Link href="/#work">Work</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></div><div className="eyebrow" style={{width:"100%",color:"#829087"}}>© {new Date().getFullYear()} / Built to evolve</div></div></footer>
    </main>
  );
}
