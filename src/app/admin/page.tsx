import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

const navigation = [
  { href: "/admin", label: "Overview", icon: "◈" },
  { href: "/admin/sections", label: "Career paths & sections", icon: "◫" },
  { href: "/admin/projects", label: "Projects", icon: "▧" },
  { href: "/admin/certificates", label: "Certificates", icon: "✧" },
  { href: "/admin/experience", label: "Experience", icon: "⌁" },
  { href: "/admin/skills", label: "Skills", icon: "✳" },
  { href: "/admin/media", label: "Media library", icon: "▤" },
  { href: "/admin/settings", label: "Site settings", icon: "⚙" },
];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) return <main className="wrap" style={{ padding: "70px 0", maxWidth: 700 }}>
    <div className="eyebrow">Access restricted / 403</div>
    <h1 className="pixel" style={{ fontSize: 42, margin: "16px 0" }}>NOT AUTHORIZED</h1>
    <p className="muted" style={{ lineHeight: 1.8 }}>This account is signed in but has not been granted portfolio administrator access. Add its user ID to the <code>admin_users</code> table in the Supabase SQL editor, then refresh this page.</p>
    <p style={{ fontSize: 12 }}>Signed in as {user.email}</p>
    <form action={signOut}><button className="button">Sign out</button></form>
  </main>;

  const [{ count: projects }, { count: experience }, { count: skills }, { count: certificates }] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Projects", count: projects ?? 0, href: "/admin/projects", note: "Case studies & work" },
    { label: "Experience", count: experience ?? 0, href: "/admin/experience", note: "Roles & contributions" },
    { label: "Skills", count: skills ?? 0, href: "/admin/skills", note: "Tools & capabilities" },
    { label: "Certificates", count: certificates ?? 0, href: "/admin/certificates", note: "Credentials & learning" },
  ];

  return <main className="admin-shell">
    <aside className="admin-nav">
      <Link href="/" className="pixel" style={{ fontSize: 22, color: "var(--neon)" }}>O/ CMS</Link>
      <span className="eyebrow">Portfolio workspace</span>
      <div className="admin-nav-list admin-nav-list-desktop">
        {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={item.href === "/admin" ? "page" : undefined} className={item.href === "/admin" ? "admin-active-link" : ""}>
          <span aria-hidden="true" className="admin-nav-icon">{item.icon}</span>{item.label}
        </Link>)}
      </div>
      <details className="admin-mobile-menu"><summary><span className="admin-nav-icon">☷</span> MENU <span className="admin-menu-chevron">⌄</span></summary><div className="admin-mobile-menu-links">{navigation.map((item) => <Link key={item.href} href={item.href} className={item.href === "/admin" ? "admin-active-link" : ""}><span className="admin-nav-icon">{item.icon}</span>{item.label}</Link>)}</div></details>
      <div className="admin-account">
        <span className="eyebrow">Signed in as</span>
        <span className="admin-account-email">{user.email}</span>
        <form action={signOut}><button className="button">Sign out ↗</button></form>
      </div>
    </aside>
    <section className="admin-content">
      <div className="admin-topline">
        <div><div className="eyebrow">Workspace / Overview</div><h1 className="pixel" style={{ fontSize: "clamp(32px,5vw,54px)", margin: "12px 0 8px" }}>CONTROL ROOM<span className="neon-text">.</span></h1><p className="muted" style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>Your portfolio content, organised in one place.</p></div>
        <Link className="button" href="/" target="_blank">View live portfolio ↗</Link>
      </div>
      <div className="admin-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 13, marginTop: 30 }}>
        {stats.map((item, index) => <Link href={item.href} key={item.label} className="admin-stat" style={{ animationDelay: `${index * 80}ms` }}>
          <span className="eyebrow">{item.label}</span><span className="admin-stat-number">{String(item.count).padStart(2, "0")}</span><span className="muted" style={{ fontSize: 11 }}>{item.note}</span><span className="eyebrow">Manage collection ↗</span>
        </Link>)}
      </div>
      <div className="admin-dashboard-lower" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(250px,.8fr)", gap: 14, marginTop: 22 }}>
        <div className="admin-note"><div className="eyebrow">Suggested workflow</div><h2 className="pixel" style={{ fontSize: 24, margin: "14px 0 10px" }}>MAKE IT VISIBLE.</h2><p className="muted" style={{ fontSize: 13, lineHeight: 1.85, margin: 0 }}>Create or update a project, add a clear summary and relevant links, then publish it. Review the public page after changes to make sure the content displays as expected.</p><Link className="button" href="/admin/projects" style={{ marginTop: 18 }}>Manage projects ↗</Link></div>
        <div className="card" style={{ minHeight: 0 }}><div className="eyebrow">Quick actions</div><div style={{ display: "grid", gap: 9, marginTop: 16 }}>
          <Link className="button" href="/admin/sections">＋ Manage career paths</Link>
          <Link className="button" href="/admin/projects">＋ Add a project</Link>
          <Link className="button" href="/admin/experience">＋ Add experience</Link>
          <Link className="button" href="/admin/skills">＋ Add a skill</Link>
          <Link className="button" href="/admin/media">↥ Upload media</Link>
        </div></div>
      </div>
      <p className="muted" style={{ fontSize: 11, lineHeight: 1.7, marginTop: 24 }}>Changes saved here affect your portfolio data. Keep passwords, private client information and sensitive security-lab details out of public content.</p>
    </section>
  </main>;
}
