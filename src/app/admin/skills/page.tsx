import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveSkill, deleteSkill } from "./actions";

export default async function SkillsPage({ searchParams }: { searchParams: Promise<{ edit?: string; message?: string }> }) {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await s.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  const sp = await searchParams;
  const { data: skills, error } = await s.from("skills").select("*").order("category").order("sort_order");
  if (error) throw new Error(error.message);
  const current = skills?.find((x) => x.id === sp.edit);
  return <main className="admin-shell">
    <aside className="admin-nav"><Link href="/admin" className="pixel">← CMS</Link><span className="eyebrow">Skills</span><Link href="/admin/projects">Projects</Link><Link href="/admin/experience">Experience</Link><Link href="/admin/settings">Settings</Link><Link href="/admin/media">Media</Link><Link href="/">View site ↗</Link></aside>
    <section className="admin-content">
      <div className="eyebrow">Content / Skills</div><h1 className="pixel" style={{ fontSize: 42 }}>SKILLS LIBRARY</h1>
      {sp.message && <p className="muted" role="status">{sp.message}</p>}
      <form action={saveSkill} style={{ border: "1px solid #333", padding: 20, maxWidth: 650, margin: "24px 0" }}>
        <h2 className="pixel" style={{ fontSize: 24 }}>{current ? "Edit skill" : "Add a skill"}</h2>
        <input type="hidden" name="id" value={current?.id ?? ""}/>
        <div className="field"><label>Skill name *</label><input name="name" defaultValue={current?.name ?? ""} required/></div>
        <div className="field"><label>Career path / category</label><select name="category" defaultValue={current?.category ?? "technology"}><option value="technology">Technology & IT</option><option value="cybersecurity">Cybersecurity</option><option value="production">Production</option><option value="general">General / Other</option></select></div>
        <div className="field"><label>Level / context (optional; e.g. Practising, Familiar)</label><input name="level" defaultValue={current?.level ?? ""}/></div>
        <div className="field"><label>Display order (lower appears first)</label><input name="sort_order" type="number" defaultValue={current?.sort_order ?? 0}/></div>
        <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="button">{current ? "Save changes" : "Add skill"}</button>{current && <Link className="button" href="/admin/skills">Cancel edit</Link>}</p>
      </form>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>{skills?.map((x) => <div key={x.id} className="card" style={{ minHeight: 0, padding: 14 }}>
        <strong>{x.name}</strong><div className="eyebrow" style={{ margin: "8px 0" }}>{x.category}{x.level ? " · " + x.level : ""}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link className="button" href={"/admin/skills?edit=" + x.id}>Edit</Link><form action={deleteSkill}><input type="hidden" name="id" value={x.id}/><button className="button">Delete</button></form></div>
      </div>)}</div>
    </section>
  </main>;
}
