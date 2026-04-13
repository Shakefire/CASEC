"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";

interface RunlasForm {
  id: string;
  user_id: string;
  status: string;
  form_data: any;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function AdminRunlasPage() {
  const [data, setData] = useState<RunlasForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRunlasForms();
  }, []);

  async function fetchRunlasForms() {
    setLoading(true);
    const { data: forms, error } = await supabase
      .from("runlas_forms")
      .select(`
        *,
        profiles:user_id (
          first_name,
          last_name,
          email
        )
      `)
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("❌ RUN-LAS FETCH ERROR: " + (error.message || error));
    } else {
      setData(forms || []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("runlas_forms")
      .update({
        status,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      fetchRunlasForms();
    }
  }

  const columns = [
    {
      key: "user",
      header: "Student",
      render: (row: RunlasForm) => (
        <div>
          <span className="font-medium text-gray-800">
            {row.profiles?.first_name} {row.profiles?.last_name}
          </span>
          <p className="text-xs text-gray-500">{row.profiles?.email}</p>
        </div>
      ),
    },
    {
      key: "submitted_at",
      header: "Submitted",
      render: (row: RunlasForm) => (
        <span className="text-gray-600 text-sm">
          {new Date(row.submitted_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: RunlasForm) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: RunlasForm) => (
        <div className="flex items-center gap-2">
          {row.status === "pending" && (
            <>
              <button
                onClick={() => updateStatus(row.id, "approved")}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-green-200 rounded text-green-600 hover:bg-green-50 transition-colors"
              >
                <CheckCircle size={13} /> Approve
              </button>
              <button
                onClick={() => updateStatus(row.id, "rejected")}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-red-200 rounded text-red-600 hover:bg-red-50 transition-colors"
              >
                <XCircle size={13} /> Reject
              </button>
            </>
          )}
          {row.status !== "pending" && (
            <span className="text-xs text-gray-500">
              Reviewed {row.reviewed_at ? new Date(row.reviewed_at).toLocaleDateString() : ""}
            </span>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = data.filter(f => f.status === "pending").length;
  const approvedCount = data.filter(f => f.status === "approved").length;
  const rejectedCount = data.filter(f => f.status === "rejected").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">RUN-LAS Form Submissions</h2>
          <p className="text-sm text-gray-500">{data.length} total submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Pending Review</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">{approvedCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <div className="flex items-center gap-2">
            <XCircle size={20} className="text-red-600" />
            <span className="text-sm font-medium text-red-800">Rejected</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">{rejectedCount}</p>
        </div>
      </div>

      <Table<RunlasForm>
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No RUN-LAS form submissions found."
      />
    </div>
  );
}