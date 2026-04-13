"use client";

import { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight, Search } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/FormField";

interface Profile {
  id: string;
  email: string;
  role: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  created_at: string;
}

export default function AdminUsersPage() {
  const [data, setData] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ USERS FETCH ERROR: " + (error.message || error));
    } else {
      setData(profiles || []);
    }
    setLoading(false);
  }

  const filteredUsers = data.filter((u) => {
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const name = `${u.first_name || ""} ${u.last_name || ""} ${u.company_name || ""}`.toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const columns: Column<Profile>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span className="font-medium text-gray-800">
          {row.role === "employer" && row.company_name 
            ? row.company_name 
            : `${row.first_name || ""} ${row.last_name || ""}`.trim() || "N/A"}
        </span>
      ),
    },
    { key: "email", header: "Email", render: (row) => <span className="text-gray-600">{row.email}</span> },
    {
      key: "role",
      header: "Role",
      render: (row) => <StatusBadge status={row.role} />,
    },
    { key: "created_at", header: "Joined", render: (row) => <span className="text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <button
          onClick={() => alert("User management actions coming soon")}
          className="text-xs text-gray-400 cursor-not-allowed italic"
        >
          Manage
        </button>
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

      <Table<Profile>
        columns={columns}
        data={filteredUsers}
        loading={loading}
        emptyMessage="No users found in Supabase matching your criteria."
      />
    </div>
  );
}
