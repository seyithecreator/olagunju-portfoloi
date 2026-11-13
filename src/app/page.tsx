import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionIcon } from "@/components/section-icon";
import { getProjects } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

function displayDate(value: string | null) {
  if (!value) return "";
  return new Date(value + (value.length === 10 ? "T00:00:00Z" : "")).toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" });
}

export default async function Home() {
  const projects = await getProjects();
  const supabase = await createClient();
  const [
    { data: paths },
    { data: experiences },
    { data: skills },
    { data: certificates },
  ] = await Promise.all([
    supabase.from("portfolio_sections").select("title,slug,description,sort_order,icon_name").eq("visible", true).order("sort_order", { ascending: true }),
    supabase.from("experiences").select("id,title,organization,category,description,start_date,end_date,is_current,current").order("start_date", { ascending: false }),
    supabase.from("skills").select("id,name,category,level,proficiency_label,description,sort_order").eq("visible", true).order("sort_order", { ascending: true }),
    supabase.from("certificates").select("id,name,issuer,issue_date,expiry_date,credential_id,credential_url,description,sort_order").eq("visible", true).order("issue_date", { ascending: false }),
  ]);

  return (
    <main>
      <header className="wrap site-header">
        <Link href="/" className="pixel brand-mark" aria-label="Olagunju Oluwaseyi home">O/</Link>
        <nav className="site-nav site-nav-desktop" aria-label="Main navigation">
          <a href="#work">Work</a><a href="#disciplines">Disciplines</a><a href="#experience">Experience</a><a href="#about">About</a><a href="#contact">Contact</a>
        </nav>
        <details className="mobile-nav"><summary aria-label="Open navigation menu"><span className="mobile-nav-label">MENU</span><span className="mobile-nav-lines"><i/><i/></span></summary><nav aria-label="Mobile main navigation"><a href="#work">Work <ArrowUpRight size={13} strokeWidth={1.8}/></a><a href="#disciplines">Disciplines <ArrowUpRight size={13} strokeWidth={1.8}/></a><a href="#experience">Experience <ArrowUpRight size={13} strokeWidth={1.8}/></a><a href="#about">About <ArrowUpRight size={13} strokeWidth={1.8}/></a><a href="#contact">Contact <ArrowUpRight size={13} strokeWidth={1.8}/></a></nav></details>
      </header>

      <section className="wrap hero">
        <div className="reveal">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Independent professional portfolio / Nigeria</div>
          <h1 className="pixel hero-title">BUILDING<br /><span className="neon-text">SECURE SYSTEMS.</span><br />SOLVING REAL PROBLEMS.</h1>
          <p className="muted hero-copy">I'm Olagunju Oluwaseyi — a technology-focused builder working across cybersecurity, IT systems, cloud and web development. I enjoy turning complex ideas into practical, clear solutions.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <a className="button" href="#work">Explore selected work <ArrowUpRight size={14} /></a>
            <a className="button" href="#contact">Get in touch <ArrowUpRight size={14} /></a>
          </div>
        </div>
        <div className="hero-art reveal reveal-delay-2" aria-hidden="true">
          <div className="hero-orbit" />
          <div className="pixel hero-symbol">O/</div>
          <div className="hero-caption"><span className="eyebrow">Systems / Security / Innovation</span><span className="eyebrow">LAG · NG</span></div>
        </div>
      </section>

      <section id="disciplines" className="rule">
        <div className="wrap section-pad">
          <div className="eyebrow" style={{ marginBottom: 22 }}>01 / Areas of practice</div>
          <div className="discipline-grid">
            {(paths ?? []).map((p, i) => (
              <Link key={p.slug} href={"/work/" + p.slug} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
                  <SectionIcon name={p.icon_name} size={26} strokeWidth={1.5} />
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")} / {String(paths?.length ?? 0).padStart(2, "0")}</span>
                </div>
                <h2 className="pixel card-title">{p.title}</h2><p className="card-copy">{p.description}</p>
                <div className="eyebrow discipline-card-action" style={{ marginTop: 24 }}>Explore area <ArrowUpRight size={13} strokeWidth={1.8}/></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="rule">
        <div className="wrap section-pad">
          <div className="section-heading"><div><div className="eyebrow">02 / Selected projects</div><h2 className="pixel section-title">RECENT WORK<span className="neon-text">.</span></h2></div><span className="muted" style={{ fontSize: 12 }}>{projects.length} published</span></div>
          {projects.length === 0 ? <div className="rule" style={{ padding: "28px 0", color: "#a0aaa2", fontSize: 13, lineHeight: 1.8 }}>Projects published through the CMS will appear here. Start by adding your first project in the admin dashboard.</div> :
            <div className="project-grid">{projects.slice(0, 6).map((p) => (
              <Link className="card" href={`/projects/${p.slug}`} key={p.id}>
                {p.cover_image ? <img src={p.cover_image} alt={`${p.title} project preview`} loading="lazy" style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block", marginBottom: 20, border: "1px solid #333" }} /> : <div aria-hidden="true" style={{ width: "100%", aspectRatio: "16 / 9", marginBottom: 20, border: "1px solid #333", background: "linear-gradient(135deg, rgba(166,255,117,.09), rgba(20,28,22,.8))", display: "grid", placeItems: "center" }}><span className="pixel neon-text" style={{ fontSize: 28 }}>O/</span></div>}
                <div className="eyebrow">{p.category}</div><h3 className="pixel card-title" style={{ marginTop: 24 }}>{p.title}</h3><p className="card-copy">{p.summary}</p>
                <span className="eyebrow project-card-action" style={{ display: "flex", marginTop: 24 }}>View project <ArrowUpRight size={13} strokeWidth={1.8}/></span>
              </Link>
            ))}</div>}
        </div>
      </section>

      {experiences && experiences.length > 0 && <section id="experience" className="rule">
        <div className="wrap section-pad">
          <div className="eyebrow">03 / Professional journey</div><h2 className="pixel section-title">EXPERIENCE<span className="neon-text">.</span></h2>
          <div style={{ display: "grid", gap: 14, marginTop: 26 }}>
            {experiences.map((item) => <article key={item.id} className="card" style={{ minHeight: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div><h3 className="pixel" style={{ fontSize: 20, margin: 0 }}>{item.title}</h3><p className="muted" style={{ margin: "8px 0 0" }}>{item.organization}</p></div>
                <span className="eyebrow">{displayDate(item.start_date)} – {(item.is_current || item.current) ? "Present" : displayDate(item.end_date)}</span>
              </div>
              <p className="muted" style={{ fontSize: 11, margin: "14px 0 0" }}>{item.category}</p>
              {item.description && <p className="card-copy" style={{ whiteSpace: "pre-wrap", maxWidth: 900 }}>{item.description}</p>}
            </article>)}
          </div>
        </div>
      </section>}

      {skills && skills.length > 0 && <section id="skills" className="rule">
        <div className="wrap section-pad">
          <div className="eyebrow">04 / Capabilities</div><h2 className="pixel section-title">SKILLS & TOOLS<span className="neon-text">.</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, marginTop: 26 }}>
            {skills.map((skill) => <article key={skill.id} className="card" style={{ minHeight: 0, padding: 18 }}>
              <h3 className="pixel" style={{ fontSize: 16, margin: 0 }}>{skill.name}</h3>
              <p className="eyebrow" style={{ margin: "10px 0 0" }}>{skill.category}{(skill.level || skill.proficiency_label) ? " / " + (skill.level || skill.proficiency_label) : ""}</p>
              {skill.description && <p className="card-copy">{skill.description}</p>}
            </article>)}
          </div>
        </div>
      </section>}

      {certificates && certificates.length > 0 && <section id="certifications" className="rule">
        <div className="wrap section-pad">
          <div className="eyebrow">05 / Learning & credentials</div><h2 className="pixel section-title">CERTIFICATIONS<span className="neon-text">.</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginTop: 26 }}>
            {certificates.map((certificate) => <article key={certificate.id} className="card" style={{ minHeight: 0 }}>
              <h3 className="pixel" style={{ fontSize: 17, margin: 0 }}>{certificate.name}</h3><p className="muted" style={{ margin: "10px 0" }}>{certificate.issuer}</p>
              <p className="eyebrow">{certificate.issue_date ? "Issued " + displayDate(certificate.issue_date) : "Certificate"}</p>
              {certificate.description && <p className="card-copy">{certificate.description}</p>}
              {certificate.credential_url && <a className="button" href={certificate.credential_url} target="_blank" rel="noreferrer" style={{ marginTop: 12 }}>View credential <ArrowUpRight size={13}/></a>}
            </article>)}
          </div>
        </div>
      </section>}

      <section id="about" className="rule">
        <div className="wrap about-grid">
          <div><div className="eyebrow">06 / About</div><h2 className="pixel" style={{ fontSize: 38, lineHeight: 1.1, marginTop: 16 }}>CURIOUS BY<br /><span className="neon-text">DESIGN.</span></h2></div>
          <div><p className="about-copy">I focus on building useful technology, understanding how systems work and solving practical problems. My work spans cybersecurity, software and web development, IT systems and cloud learning. I document projects, practical labs and the process behind each result — with clear distinctions between professional experience, personal projects and training.</p><p className="muted" style={{ fontSize: 12, lineHeight: 1.9 }}>I also bring a creative approach to technical work: clear visual communication, thoughtful presentation and the ability to make complex ideas easier to understand.</p></div>
        </div>
      </section>

      <footer id="contact" className="rule">
        <div className="wrap site-footer">
          <div><div className="pixel" style={{ fontSize: 22 }}>OLAGUNJU OLUWASEYI<span className="neon-text">.</span></div><p className="muted" style={{ fontSize: 12 }}>Technology. Cybersecurity. Problem-solving.</p></div>
          <div className="footer-links"><a href="mailto:hello@example.com">Email <ArrowUpRight size={13} strokeWidth={1.8}/></a><a href="https://github.com/seyithecreator" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} strokeWidth={1.8}/></a></div>
          <div className="eyebrow" style={{ width: "100%", color: "#829087" }}>© {new Date().getFullYear()} / Built to evolve</div>
        </div>
      </footer>
    </main>
  );
}
