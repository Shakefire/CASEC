"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Table from "@/components/tables/Table";
import StatusBadge from "@/components/dashboard/StatusBadge";
import PrivateRoute from "@/components/PrivateRoute";
import { events } from "@/lib/data";

export default function AdminEventsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
      render: (row: typeof events[0]) => <span className="font-medium text-slate-800">{row.title}</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (row: typeof events[0]) => <span className="text-slate-600">{row.date}</span>,
    },
    {
      key: "location",
      header: "Location",
      render: (row: typeof events[0]) => <span className="text-slate-600">{row.location}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: typeof events[0]) => (
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors">
            ✏️ Edit
          </button>
          <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-red-200 rounded text-red-600 hover:bg-red-50 transition-colors">
            🗑️ Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin" pageTitle="Manage Events" userName="Admin">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">{events.length} total events</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2e4a] text-white text-sm rounded hover:bg-[#14253d] transition-colors">
            ➕ Add Event
          </button>
        </div>

        <Table columns={columns} data={events} emptyMessage="No events found. Click 'Add Event' to get started." />
      </DashboardLayout>
    </PrivateRoute>
  );
}
