"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Table from "@/components/tables/Table";
import StatusBadge from "@/components/dashboard/StatusBadge";
import PrivateRoute from "@/components/PrivateRoute";
import { resources } from "@/lib/data";

export default function AdminResourcesPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
      render: (row: typeof resources[0]) => <span className="font-medium text-slate-800">{row.title}</span>,
    },
    {
      key: "fileName",
      header: "File Name",
      render: (row: typeof resources[0]) => <span className="text-slate-600">{row.fileName}</span>,
    },
    {
      key: "fileSize",
      header: "Size",
      render: (row: typeof resources[0]) => <span className="text-slate-600">{row.fileSize}</span>,
    },
    {
      key: "uploadedAt",
      header: "Uploaded",
      render: (row: typeof resources[0]) => <span className="text-slate-600">{row.uploadedAt}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: typeof resources[0]) => (
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors">
            📥 Download
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
      <DashboardLayout role="admin" pageTitle="Manage Resources" userName="Admin">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">{resources.length} total resources</p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2e4a] text-white text-sm rounded hover:bg-[#14253d] transition-colors">
            ➕ Upload Resource
          </button>
        </div>

        <Table columns={columns} data={resources} emptyMessage="No resources found. Click 'Upload Resource' to get started." />
      </DashboardLayout>
    </PrivateRoute>
  );
}
