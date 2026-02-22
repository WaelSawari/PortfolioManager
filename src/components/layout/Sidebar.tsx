"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  FileText,
  TrendingUp,
} from "lucide-react";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Building2 },
  { href: "/kpis", label: "KPIs", icon: BarChart3 },
  { href: "/lp-updates", label: "LP Updates", icon: FileText },
  { href: "/scenarios", label: "Scenarios", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col py-8 px-4">
      <div className="mb-10 px-2">
        <span className="text-xl font-bold text-indigo-600">VC Admin</span>
        <p className="text-xs text-gray-400 mt-1">Portfolio Management</p>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}