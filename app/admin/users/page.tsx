"use client";

import { useState } from "react";
import { Search, Eye, FileText, ExternalLink } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/FormField";
import { useUsersManagement } from "@/lib/hooks/useDashboard";
import Link from "next/link";

interface AdminProfile {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  created_at: string;
  student_profiles?: {
    profile_completion_score: number;
    cv_url: string | null;
    department: string | null;
  }[] | null;
}

export default function AdminUsersPage() {
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data = [], isLoading } = useUsersManagement();

  const filteredUsers = (data as AdminProfile[]).filter((u) => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const name = `${u.first_name || ""} ${u.last_name || ""} ${u.company_name || ""}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const columns: Column<AdminProfile>[] = [
    {
      key: "name",
      header: "User Details",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {row.role === "employer" && row.company_name 
              ? row.company_name 
              : `${row.first_name || ""} ${row.last_name || ""}`.trim() || "N/A"}
          </span>
          <span className="text-xs text-gray-400">{row.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row) => <StatusBadge status={row.role} />,
    },
    {
      key: "completion",
      header: "Completion",
      render: (row) => {
        if (row.role !== "student") return <span className="text-gray-300">—</span>;
        const studentProfile = row.student_profiles?.[0];
        const score = studentProfile?.profile_completion_score || 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-gray-500">{score}%</span>
          </div>
        );
      },
    },
    {
      key: "cv",
      header: "CV",
      render: (row) => {
        const studentProfile = row.student_profiles?.[0];
        if (row.role !== "student" || !studentProfile?.cv_url) return <span className="text-gray-300">—</span>;
        return (
          <a 
            href={studentProfile.cv_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#097969] hover:text-[#076356]"
            title="Download CV"
          >
            <FileText size={16} />
          </a>
        );
      },
    },
    { key: "created_at", header: "Joined", render: (row) => <span className="text-xs text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/users/${row.id}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 text-gray-700 text-[10px] font-bold uppercase rounded border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Eye size={12} /> View Profile
          </Link>
        </div>
      ),
    },
  ];

  const studentCount = data.filter((u) => u.role === "student").length;
  const employerCount = data.filter((u) => u.role === "employer").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span>{data.length} total users</span>
            <span className="text-gray-300">|</span>
            <span>{studentCount} students</span>
            <span className="text-gray-300">|</span>
            <span>{employerCount} employers</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {["all", "student", "employer"].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors capitalize ${
                filterRole === r
                  ? "bg-[#1a2e4a] text-white border-[#1a2e4a]"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {r === "all" ? "All Users" : `${r}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={14} className="text-gray-400" />
        </div>
        <Input
          placeholder="Search by name, email or company..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table<AdminProfile>
        columns={columns}
        data={filteredUsers}
        loading={isLoading}
        emptyMessage="No users found matching your criteria."
      />
    </div>
  );
}
