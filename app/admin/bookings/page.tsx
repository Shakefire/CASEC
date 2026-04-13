"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: string;
  user_id: string;
  type: string;
  status: string;
  details: string | null;
  created_at: string;
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

export default function AdminBookingsPage() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data: bkn, error } = await supabase
      .from("bookings")
      .select("*, profiles(first_name, last_name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ BOOKINGS FETCH ERROR: " + (error.message || error));
    } else {
      setData(bkn as any || []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id);
    
    if (error) {
      alert("Error updating booking: " + error.message);
    } else {
      fetchBookings();
    }
  }

  const filtered =
    filterStatus === "all" ? data : data.filter((b) => b.status === filterStatus);

  const columns: Column<Booking>[] = [
    {
      key: "name",
      header: "User",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {row.profiles?.first_name} {row.profiles?.last_name}
          </span>
          <span className="text-xs text-gray-400">{row.profiles?.email}</span>
        </div>
      ),
    },
    { key: "type", header: "Service Type", render: (row) => <span className="text-gray-600">{row.type}</span> },
    { key: "created_at", header: "Date", render: (row) => <span className="text-gray-600">{new Date(row.created_at).toLocaleDateString()}</span> },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) =>
        row.status === "pending" ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateStatus(row.id, "approved")}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-green-300 rounded text-green-700 hover:bg-green-50 transition-colors"
            >
              <CheckCircle size={13} /> Approve
            </button>
            <button
              onClick={() => updateStatus(row.id, "rejected")}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-red-300 rounded text-red-700 hover:bg-red-50 transition-colors"
            >
              <XCircle size={13} /> Reject
            </button>
          </div>
        ) : (
          <span className={`inline-flex items-center gap-1 text-xs ${row.status === "approved" ? "text-green-600" : "text-red-600"}`}>
            {row.status === "approved" ? <CheckCircle size={13} /> : <XCircle size={13} />}
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        ),
    },
  ];

  const pendingCount = data.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Booking Requests</h2>
          <p className="text-sm text-gray-500">Manage career guidance and resource bookings.</p>
        </div>
        
        {pendingCount > 0 && !loading && (
          <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
            <Clock size={13} />
            {pendingCount} pending approval
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors capitalize ${
              filterStatus === s
                ? "bg-[#1a2e4a] text-white border-[#1a2e4a]"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "All Bookings" : s}
          </button>
        ))}
      </div>

      <Table<Booking>
        columns={columns}
        data={filtered}
        loading={loading}
        emptyMessage="No booking requests found for the selected filter."
      />
    </div>
  );
}
