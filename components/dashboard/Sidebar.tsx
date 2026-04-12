"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  FolderOpen,
  ClipboardList,
  CalendarCheck,
  Users,
  Building2,
  FileText,
  X,
  GraduationCap,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: "admin" | "employer" | "student";
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const adminNavItems: NavItem[] = [
    { label: "Overview", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Opportunities", path: "/admin/opportunities", icon: <Briefcase size={18} /> },
    { label: "Events", path: "/admin/events", icon: <CalendarDays size={18} /> },
    { label: "Resources", path: "/admin/resources", icon: <FolderOpen size={18} /> },
    { label: "RUN-LAS Forms", path: "/admin/runlas", icon: <ClipboardList size={18} /> },
    { label: "Booking Requests", path: "/admin/bookings", icon: <CalendarCheck size={18} /> },
    { label: "User Management", path: "/admin/users", icon: <Users size={18} /> },
  ];

  const employerNavItems: NavItem[] = [
    { label: "Overview", path: "/employer", icon: <LayoutDashboard size={18} /> },
    { label: "Post Opportunity", path: "/employer/post", icon: <FileText size={18} /> },
    { label: "My Opportunities", path: "/employer/opportunities", icon: <Briefcase size={18} /> },
    { label: "Applications", path: "/employer/applications", icon: <ClipboardList size={18} /> },
  ];

  const navItems = role === "admin" ? adminNavItems : employerNavItems;
  const portalTitle = role === "admin" ? "Admin Portal" : "Employer Portal";

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#1a2e4a] text-white z-40 flex flex-col transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium uppercase tracking-wide leading-none mb-0.5">
                CASEC RUN
              </p>
              <p className="text-sm font-semibold leading-none">{portalTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            {role === "admin" ? <Users size={12} /> : <Building2 size={12} />}
            <span>{role === "admin" ? "Administrator Account" : "Employer Account"}</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                      active ? "bg-white/15 text-white font-medium" : "text-white/70 hover:bg-white/8 hover:text-white"
                    }`}
                    onClick={onClose}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <a
            href="https://casec.run.edu.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Back to CASEC Portal
          </a>
        </div>
      </aside>
    </>
  );
}
