import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveExperience, deleteExperience } from "./actions";

export default async function ExperiencePage({ searchParams }: { searchParams: Promise<{ edit?: string; message?: string }> }) {
  const s = await createClient();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await s.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  const sp = await searchParams;
  const { data: items, error } = await s.from("experiences").select("*").order("start_date", { ascending: false });
  if (error) throw new Error(error.message);
  const current = items?.find((x) => x.id === sp.edit);
  return <main className="admin-shell">
    <aside className="admin-nav"><Link href="/admin" className="pixel">← CMS</Link><span className="eyebrow">Experience</span><Link href="/admin/projects">Projects</Link><Link href="/admin/skills">Skills</Link><Link href="/admin/settings">Settings</Link><Link href="/admin/media">Media</Link><Link href="/">View site ↗</Link></aside>
    <section className="admin-content">
      <div className="eyebrow">Content / Experience</div><h1 className="pixel" style={{ fontSize: 42 }}>EXPERIENCE</h1>
      {sp.message && <p className="muted" role="status">{sp.message}</p>}
      <p className="muted" style={{ lineHeight: 1.8, maxWidth: 720 }}>Add roles from any career path. Use the category to group each role; you can edit or remove an entry at any time.</p>
      <form action={saveExperience} style={{ border: "1px solid #333", padding: 20, maxWidth: 800, margin: "24px 0" }}>
        <h2 className="pixel" style={{ fontSize: 24 }}>{current ? "Edit experience" : "Add an experience"}</h2>
        <input type="hidden" name="id" value={current?.id ?? ""}/>
        <div className="field"><label>Role / title *</label><input name="title" defaultValue={current?.title ?? ""} required/></div>
        <div className="field"><label>Organization</label><input name="organization" defaultValue={current?.organization ?? ""}/></div>
        <div className="field"><label>Career path</label><select name="category" defaultValue={current?.category ?? "technology"}><option value="technology">Technology & IT</option><option value="cybersecurity">Cybersecurity</option><option value="production">Production</option><option value="general">General / Other</option></select></div>
        <div className="field"><label>Description</label><textarea name="description" defaultValue={current?.description ?? ""}/></div>
        <div className="field"><label>Start date</label><input type="date" name="start_date" defaultValue={current?.start_date ?? ""}/></div>
        <div className="field"><label>End date (leave blank if current)</label><input type="date" name="end_date" defaultValue={current?.end_date ?? ""} disabled={current?.current ?? false}/></div>
        <label><input type="checkbox" name="current" defaultChecked={current?.current ?? false}/> Current role</label>
        <p style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><button className="button">{current ? "Save changes" : "Add experience"}</button>{current && <Link className="button" href="/admin/experience">Cancel edit</Link>}</p>
      </form>
      <h2 className="pixel" style={{ fontSize: 24 }}>Existing entries ({items?.length ?? 0})</h2>
      <div style={{ display: "grid", gap: 8, marginTop: 14 }}>{items?.map((x) => <div key={x.id} className="card" style={{ minHeight: 0 }}>
        <strong>{x.title}</strong>{x.organization ? " — " + x.organization : ""}
        <p className="muted" style={{ fontSize: 12 }}>{x.category} · {x.start_date || "Date not set"} – {x.current ? "Present" : x.end_date || "End date not set"}</p>
        <p style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{x.description}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Link className="button" href={"/admin/experience?edit=" + x.id}>Edit</Link><form action={deleteExperience}><input type="hidden" name="id" value={x.id}/><button className="button">Delete</button></form></div>
      </div>)}</div>
    </section>
  </main>;
}
