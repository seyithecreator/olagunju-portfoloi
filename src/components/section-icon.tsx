import { BriefcaseBusiness, ShieldCheck, Clapperboard, Cpu, Store, Cloud, MonitorCog, Code2, GraduationCap, Palette, Wrench, Boxes, Network, Bot, FlaskConical, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "briefcase-business": BriefcaseBusiness, "shield-check": ShieldCheck, "clapperboard": Clapperboard,
  "cpu": Cpu, "store": Store, "cloud": Cloud, "monitor-cog": MonitorCog, "code-2": Code2,
  "graduation-cap": GraduationCap, "palette": Palette, "wrench": Wrench, "boxes": Boxes,
  "network": Network, "bot": Bot, "flask-conical": FlaskConical,
};

export function SectionIcon({ name, size = 24, className, strokeWidth = 1.6 }: { name?: string | null; size?: number; className?: string; strokeWidth?: number }) {
  const Icon = ICONS[(name ?? "").trim().toLowerCase()] ?? BriefcaseBusiness;
  return <Icon size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
