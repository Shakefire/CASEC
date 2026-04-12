"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

interface DashboardLayoutProps {
  role: "admin" | "employer" | "student";
  pageTitle: string;
  pageSubtitle?: string;
  userName?: string;
  children: React.ReactNode;
}

export default function DashboardLayout({
  role,
  pageTitle,
  pageSubtitle,
  userName,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar title={pageTitle} subtitle={pageSubtitle} onMenuClick={() => setSidebarOpen(true)} userName={userName} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
