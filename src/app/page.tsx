import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionIcon } from "@/components/section-icon";
import { getProjects } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const projects = await getProjects();
  const supabase = await createClient();
  const { data: paths } = await supabase.from("portfolio_sections").select("title,slug,description,sort_order,icon_name").eq("visible", true).order("sort_order", { ascending: true });
  return (
    <main>
      <header className="wrap site-header">
        <Link href="/" className="pixel brand-mark" aria-label="Olagunju Oluwaseyi home">O/</Link>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#work">Work</a><a href="#disciplines">Disciplines</a><a href="#about">About</a><a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="wrap hero">
        <div className="reveal">
          <div className="eyebrow" style={{ marginBottom: 24 }}>Independent professional portfolio / Nigeria</div>
          <h1 className="pixel hero-title">BUILDING<br /><span className="neon-text">SECURE SYSTEMS.</span><br />MAKING STORIES.</h1>
          <p className="muted hero-copy">I'm Olagunju Oluwaseyi — a technology learner and practitioner with interests across cybersecurity, IT systems, web development and visual production.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
            <a className="button" href="#work">Explore selected work <ArrowUpRight size={14} /></a>
            <a className="button" href="#contact">Get in touch <ArrowUpRight size={14} /></a>
          </div>
        </div>
        <div className="hero-art reveal reveal-delay-2" aria-hidden="true">
          <div className="hero-orbit" />
          <div className="pixel hero-symbol">O/</div>
          <div className="hero-caption">
            <span className="eyebrow">Systems / Security / Stories</span>
            <span className="eyebrow">LAG · NG</span>
          </div>
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
                <h2 className="pixel card-title">{p.title}</h2>
                <p className="card-copy">{p.description}</p>
                <div className="eyebrow" style={{ marginTop: 24 }}>Explore area ↗</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="rule">
        <div className="wrap section-pad">
          <div className="section-heading">
            <div><div className="eyebrow">02 / Selected projects</div><h2 className="pixel section-title">RECENT WORK<span className="neon-text">.</span></h2></div>
            <span className="muted" style={{ fontSize: 12 }}>{projects.length} published</span>
          </div>
          {projects.length === 0 ? (
            <div className="rule" style={{ padding: "28px 0", color: "#a0aaa2", fontSize: 13, lineHeight: 1.8 }}>
              Projects published through the CMS will appear here. Start by adding your first project in the admin dashboard.
            </div>
          ) : (
            <div className="project-grid">
              {projects.slice(0, 6).map((p) => (
                <Link className="card" href={`/projects/${p.slug}`} key={p.id}>
                  <div className="eyebrow">{p.category}</div>
                  <h3 className="pixel card-title" style={{ marginTop: 24 }}>{p.title}</h3>
                  <p className="card-copy">{p.summary}</p>
                  <span className="eyebrow" style={{ display: "block", marginTop: 24 }}>View project ↗</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" className="rule">
        <div className="wrap about-grid">
          <div><div className="eyebrow">03 / About</div><h2 className="pixel" style={{ fontSize: 38, lineHeight: 1.1, marginTop: 16 }}>CURIOUS BY<br /><span className="neon-text">DESIGN.</span></h2></div>
          <div>
            <p className="about-copy">I bring together technical problem-solving and hands-on production experience. This portfolio documents projects, practical learning, work contributions and the process behind them — with clear distinctions between professional experience, personal projects and training labs.</p>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.9 }}>Every project is part of a bigger process: exploring ideas, learning by building, solving practical problems and sharing what the work teaches me.</p>
          </div>
        </div>
      </section>

      <footer id="contact" className="rule">
        <div className="wrap site-footer">
          <div><div className="pixel" style={{ fontSize: 22 }}>OLAGUNJU OLUWASEYI<span className="neon-text">.</span></div><p className="muted" style={{ fontSize: 12 }}>Technology. Security. Production.</p></div>
          <div className="footer-links"><a href="mailto:hello@example.com">Email ↗</a><a href="https://github.com/seyithecreator" target="_blank" rel="noreferrer">GitHub ↗</a></div>
          <div className="eyebrow" style={{ width: "100%", color: "#829087" }}>© {new Date().getFullYear()} / Built to evolve</div>
        </div>
      </footer>
    </main>
  );
}
