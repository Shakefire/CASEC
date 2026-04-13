"use client";

import { useEffect, useState } from "react";
import { Download, ChevronDown, Filter } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";

interface Application {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  status: string;
  submission_text: string | null;
  created_at: string;
  opportunities: {
    title: string;
  };
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

export default function EmployerApplicationsPage() {
  const [data, setData] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [myOpps, setMyOpps] = useState<any[]>([]);
  const [filterOpp, setFilterOpp] = useState<string>("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    // First fetch my opportunities to get their IDs
    const { data: opps } = await supabase
      .from("opportunities")
      .select("id, title")
      .eq("posted_by", user.id);
    
    setMyOpps(opps || []);
    const oppIds = opps?.map(o => o.id) || [];

    if (oppIds.length > 0) {
      const { data: apps, error } = await supabase
        .from("applications")
        .select("*, opportunities(title), profiles(first_name, last_name, email)")
        .in("opportunity_id", oppIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setData(apps as any || []);
      }
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);
    
    if (error) {
      alert("Error updating application: " + error.message);
    } else {
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  }

  const filtered = data.filter((a) => {
    const statusMatch = filterStatus === "all" || a.status === filterStatus;
    const oppMatch = filterOpp === "all" || a.opportunity_id === filterOpp;
    return statusMatch && oppMatch;
  });

  const columns: Column<Application>[] = [
    {
      key: "applicantName",
      header: "Applicant",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {row.profiles?.first_name} {row.profiles?.last_name}
          </span>
          <span className="text-xs text-gray-400">{row.profiles?.email}</span>
        </div>
      ),
    },
    {
      key: "opportunityTitle",
      header: "Applied For",
      render: (row) => (
        <span className="text-gray-600 text-xs max-w-[180px] block truncate">
          {row.opportunities?.title}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (row) => <span className="text-gray-500 text-xs">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Update Status",
      render: (row) => (
        <div className="relative inline-block w-full">
          <select
            value={row.status}
            onChange={(e) => updateStatus(row.id, e.target.value)}
            className="appearance-none border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 bg-white pr-8 focus:outline-none focus:ring-1 focus:ring-[#1a2e4a] cursor-pointer w-full"
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      ),
      className: "w-[140px]"
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
          <p className="text-sm text-gray-500">{filtered.length} applicants match your criteria</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2e4a]"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Opportunity:</span>
            <select
              value={filterOpp}
              onChange={(e) => setFilterOpp(e.target.value)}
              className="border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#1a2e4a] max-w-[150px]"
            >
              <option value="all">All Openings</option>
              {myOpps.map((o) => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Table<Application>
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No applications found matching your filters."
      />
    </div>
  );
}
