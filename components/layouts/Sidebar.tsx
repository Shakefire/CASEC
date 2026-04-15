"use client";

import React from "react";
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
  LayoutGrid,
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
  { label: "Appointments", path: "/employer/appointments", icon: <CalendarCheck size={18} /> },
  { label: "Post Opportunity", path: "/employer/post", icon: <FileText size={18} /> },
  { label: "My Opportunities", path: "/employer/opportunities", icon: <Briefcase size={18} /> },
  { label: "Applications", path: "/employer/applications", icon: <ClipboardList size={18} /> },
  { label: "Profile", path: "/employer/profile", icon: <Users size={18} /> },
];

const studentNavItems: NavItem[] = [
  { label: "Dashboard", path: "/student", icon: <LayoutDashboard size={18} /> },
  { label: "Appointments", path: "/student/appointments", icon: <CalendarCheck size={18} /> },
  { label: "Find Jobs", path: "/student/jobs", icon: <Briefcase size={18} /> },
  { label: "My Applications", path: "/student/applications", icon: <ClipboardList size={18} /> },
  { label: "Events", path: "/student/events", icon: <CalendarDays size={18} /> },
  { label: "Resources", path: "/student/resources", icon: <FolderOpen size={18} /> },
  { label: "RUN-LAS Forms", path: "/student/runlas", icon: <ClipboardList size={18} /> },
  { label: "My Profile", path: "/student/profile", icon: <Users size={18} /> },
];

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = role === "admin"
    ? adminNavItems
    : role === "employer"
      ? employerNavItems
      : studentNavItems;

  const portalTitle = role === "admin"
    ? "Admin Portal"
    : role === "employer"
      ? "Employer Portal"
      : "Student Portal";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#1a2e4a] text-white z-40 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center flex-shrink-0">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-medium uppercase tracking-wide leading-none mb-0.5">
                CASEC RUN
              </p>
              <p className="text-sm font-semibold leading-none">{portalTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/60">
            {role === "admin" ? (
              <><Users size={12} /><span>Administrator Account</span></>
            ) : role === "employer" ? (
              <><Building2 size={12} /><span>Employer Account</span></>
            ) : (
              <><GraduationCap size={12} /><span>Student Account</span></>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${isActive
                        ? "bg-white/15 text-white font-medium"
                        : "text-white/70 hover:bg-white/8 hover:text-white"
                      }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <a
            href="https://utrust.com.ng"
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
