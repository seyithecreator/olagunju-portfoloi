import Link from "next/link";
import { LayoutDashboard, Layers3, FolderKanban, Award, BriefcaseBusiness, Sparkles, Images, Settings2, ChevronDown, ArrowUpRight, type LucideIcon } from "lucide-react";

const links: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/sections", label: "Career paths & sections", Icon: Layers3 },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/certificates", label: "Certificates", Icon: Award },
  { href: "/admin/experience", label: "Experience", Icon: BriefcaseBusiness },
  { href: "/admin/skills", label: "Skills", Icon: Sparkles },
  { href: "/admin/media", label: "Media library", Icon: Images },
  { href: "/admin/settings", label: "Site settings", Icon: Settings2 },
];

export function AdminMobileMenu({ current }: { current: string }) {
  return <details className="admin-mobile-menu">
    <summary><span className="admin-menu-summary-icon"><Layers3 size={17}/></span><span>Navigate CMS</span><ChevronDown className="admin-menu-chevron" size={16}/></summary>
    <nav className="admin-mobile-menu-links" aria-label="CMS navigation">
      {links.map(({ href, label, Icon }) => <Link key={href} href={href} aria-current={href === current ? "page" : undefined} className={href === current ? "admin-active-link" : ""}>
        <Icon size={17} strokeWidth={1.7}/><span>{label}</span>{href === current ? <span className="admin-current-mark">CURRENT</span> : <ArrowUpRight size={13} className="admin-nav-arrow"/>}
      </Link>)}
    </nav>
  </details>;
}
