"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Table from "@/components/tables/Table";
import StatusBadge from "@/components/dashboard/StatusBadge";
import PrivateRoute from "@/components/PrivateRoute";
import { runLasSubmissions } from "@/lib/data";

export default function AdminRunLasPage() {
  const columns = [
    {
      key: "studentName",
      header: "Student Name",
      render: (row: typeof runLasSubmissions[0]) => <span className="font-medium text-slate-800">{row.studentName}</span>,
    },
    {
      key: "studentId",
      header: "Student ID",
      render: (row: typeof runLasSubmissions[0]) => <span className="text-slate-600">{row.studentId}</span>,
    },
    {
      key: "department",
      header: "Department",
      render: (row: typeof runLasSubmissions[0]) => <span className="text-slate-600">{row.department}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row: typeof runLasSubmissions[0]) => <StatusBadge status={row.status} />,
    },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (row: typeof runLasSubmissions[0]) => <span className="text-slate-600">{row.submittedAt}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: typeof runLasSubmissions[0]) => (
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors">
            👁️ View
          </button>
          <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-green-200 rounded text-green-600 hover:bg-green-50 transition-colors">
            ✅ Approve
          </button>
          <button className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-red-200 rounded text-red-600 hover:bg-red-50 transition-colors">
            ❌ Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin" pageTitle="RUN-LAS Forms" userName="Admin">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">{runLasSubmissions.length} total submissions</p>
        </div>

        <Table columns={columns} data={runLasSubmissions} emptyMessage="No RUN-LAS submissions found." />
      </DashboardLayout>
    </PrivateRoute>
  );
}
