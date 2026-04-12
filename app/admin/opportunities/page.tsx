"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PrivateRoute from "@/components/PrivateRoute";
import Table from "@/components/tables/Table";
import Modal from "@/components/forms/Modal";
import ConfirmDialog from "@/components/forms/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/forms/FormField";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Toast from "@/components/Toast";

type AdminOpportunity = {
  id: string;
  title: string;
  description: string;
  company: string;
  type: "job" | "internship" | "event";
  location: string;
  deadline: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const initialOpportunities: AdminOpportunity[] = [
  {
    id: "opp-admin-001",
    title: "Graduate Software Engineer",
    description: "Work with our product engineering team on scalable solutions.",
    company: "TechBridge Solutions",
    type: "job",
    location: "Lagos",
    deadline: "2025-08-15",
    status: "pending",
    createdAt: "2025-06-01",
  },
  {
    id: "opp-admin-002",
    title: "Summer Internship – Finance Analyst",
    description: "3-month internship for finance students with hands-on project experience.",
    company: "Zenith Bank",
    type: "internship",
    location: "Lagos",
    deadline: "2025-07-01",
    status: "approved",
    createdAt: "2025-05-15",
  },
  {
    id: "opp-admin-003",
    title: "Career Fair Employer Showcase",
    description: "Networking event for career development and employer engagement.",
    company: "CASEC Events",
    type: "event",
    location: "OnlineUniversity",
    deadline: "2025-07-20",
    status: "rejected",
    createdAt: "2025-05-25",
  },
];

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<AdminOpportunity[]>(initialOpportunities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<AdminOpportunity | null>(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    company: "",
    type: "job",
    location: "",
    deadline: "",
    status: "pending",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const statusOptions = ["pending", "approved", "rejected"] as const;
  const typeOptions = ["job", "internship", "event"] as const;

  const handleOpenCreate = () => {
    setSelectedOpportunity(null);
    setFormValues({ title: "", description: "", company: "", type: "job", location: "", deadline: "", status: "pending" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (opportunity: AdminOpportunity) => {
    setSelectedOpportunity(opportunity);
    setFormValues({
      title: opportunity.title,
      description: opportunity.description,
      company: opportunity.company,
      type: opportunity.type,
      location: opportunity.location,
      deadline: opportunity.deadline,
      status: opportunity.status,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (opportunity: AdminOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedOpportunity) return;
    setOpportunities((prev) => prev.filter((item) => item.id !== selectedOpportunity.id));
    setNotification({ message: "Opportunity deleted successfully.", type: "success" });
    setSelectedOpportunity(null);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formValues.title) errors.title = "Title is required.";
    if (!formValues.company) errors.company = "Company is required.";
    if (!formValues.description) errors.description = "Description is required.";
    if (!formValues.location) errors.location = "Location is required.";
    if (!formValues.deadline) errors.deadline = "Deadline is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    if (selectedOpportunity) {
      setOpportunities((prev) =>
        prev.map((item) =>
          item.id === selectedOpportunity.id
            ? { ...item, ...formValues, status: formValues.status as AdminOpportunity["status"], type: formValues.type as AdminOpportunity["type"] }
            : item
        )
      );
      setNotification({ message: "Opportunity updated successfully.", type: "success" });
    } else {
      const newOpportunity: AdminOpportunity = {
        id: `opp-admin-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        title: formValues.title,
        description: formValues.description,
        company: formValues.company,
        type: formValues.type as AdminOpportunity["type"],
        location: formValues.location,
        deadline: formValues.deadline,
        status: formValues.status as AdminOpportunity["status"],
      };
      setOpportunities((prev) => [newOpportunity, ...prev]);
      setNotification({ message: "Opportunity created successfully.", type: "success" });
    }

    setIsModalOpen(false);
  };

  const handleStatusUpdate = (id: string, status: AdminOpportunity["status"]) => {
    setOpportunities((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    setNotification({ message: `Opportunity marked ${status}.`, type: "success" });
  };

  const columns = useMemo(
    () => [
      { key: "title", header: "Title", render: (row: AdminOpportunity) => <span className="font-medium text-slate-800">{row.title}</span> },
      { key: "company", header: "Company", render: (row: AdminOpportunity) => <span className="text-slate-600">{row.company}</span> },
      {
        key: "type",
        header: "Type",
        render: (row: AdminOpportunity) => <StatusBadge status={row.type} />,
      },
      {
        key: "status",
        header: "Status",
        render: (row: AdminOpportunity) => <StatusBadge status={row.status} />,
      },
      { key: "createdAt", header: "Created At", render: (row: AdminOpportunity) => <span>{row.createdAt}</span> },
      {
        key: "actions",
        header: "Actions",
        render: (row: AdminOpportunity) => (
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleEdit(row)} className="text-sm px-3 py-2 bg-slate-100 rounded text-slate-700 hover:bg-slate-200 transition-colors">
              Edit
            </button>
            <button onClick={() => handleDelete(row)} className="text-sm px-3 py-2 bg-red-50 rounded text-red-700 hover:bg-red-100 transition-colors">
              Delete
            </button>
            {row.status !== "approved" && (
              <button onClick={() => handleStatusUpdate(row.id, "approved")} className="text-sm px-3 py-2 bg-emerald-50 rounded text-emerald-700 hover:bg-emerald-100 transition-colors">
                Approve
              </button>
            )}
            {row.status !== "rejected" && (
              <button onClick={() => handleStatusUpdate(row.id, "rejected")} className="text-sm px-3 py-2 bg-red-50 rounded text-red-700 hover:bg-red-100 transition-colors">
                Reject
              </button>
            )}
          </div>
        ),
      },
    ],
    [opportunities]
  );

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin" pageTitle="Manage Opportunities" pageSubtitle="Create, review and publish career opportunities" userName="Admin">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">{opportunities.length} opportunities found</p>
            <h2 className="text-2xl font-semibold text-slate-900">Opportunities Management</h2>
          </div>
          <button onClick={handleOpenCreate} className="inline-flex items-center justify-center rounded bg-[#097969] px-4 py-2 text-sm font-semibold text-white hover:bg-[#065f52] transition-colors">
            + Add Opportunity
          </button>
        </div>

        <Table columns={columns} data={opportunities} emptyMessage="No opportunities available." />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedOpportunity ? "Edit Opportunity" : "Add Opportunity"} size="lg">
          <div className="space-y-4">
            <FormField label="Title" required error={formErrors.title}>
              <Input value={formValues.title} onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))} placeholder="Enter title" />
            </FormField>
            <FormField label="Company" required error={formErrors.company}>
              <Input value={formValues.company} onChange={(e) => setFormValues((prev) => ({ ...prev, company: e.target.value }))} placeholder="Enter company name" />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Type" required>
                <Select value={formValues.type} onChange={(e) => setFormValues((prev) => ({ ...prev, type: e.target.value as AdminOpportunity["type"] }))}>
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Status" required>
                <Select value={formValues.status} onChange={(e) => setFormValues((prev) => ({ ...prev, status: e.target.value as AdminOpportunity["status"] }))}>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="Location" required error={formErrors.location}>
              <Input value={formValues.location} onChange={(e) => setFormValues((prev) => ({ ...prev, location: e.target.value }))} placeholder="Enter location" />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Deadline" required error={formErrors.deadline}>
                <Input type="date" value={formValues.deadline} onChange={(e) => setFormValues((prev) => ({ ...prev, deadline: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Description" required error={formErrors.description}>
              <Textarea value={formValues.description} onChange={(e) => setFormValues((prev) => ({ ...prev, description: e.target.value }))} placeholder="Enter opportunity description" rows={5} />
            </FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 rounded bg-[#097969] text-white hover:bg-[#065f52] transition-colors">
                {selectedOpportunity ? "Update Opportunity" : "Create Opportunity"}
              </button>
            </div>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Opportunity"
          message="Are you sure you want to delete this opportunity? This action cannot be undone."
          confirmLabel="Delete"
          danger
        />

        {notification && (
          <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
        )}
      </DashboardLayout>
    </PrivateRoute>
  );
}
