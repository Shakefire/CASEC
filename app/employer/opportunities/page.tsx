"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  deadline: string;
  status: string;
  created_at: string;
}

interface OppForm {
  title: string;
  description: string;
  type: string;
  deadline: string;
}

const emptyForm: OppForm = { title: "", description: "", type: "job", deadline: "" };

export default function EmployerOpportunitiesPage() {
  const [data, setData] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<OppForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [errors, setErrors] = useState<Partial<OppForm>>({});

  useEffect(() => {
    fetchMyOpportunities();
  }, []);

  async function fetchMyOpportunities() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: opps, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("posted_by", user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching opportunities:", error);
    } else {
      setData(opps || []);
    }
    setLoading(false);
  }

  function openEdit(opp: Opportunity) {
    setEditTarget(opp);
    setForm({
      title: opp.title,
      description: opp.description,
      type: opp.type,
      deadline: opp.deadline,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e: Partial<OppForm> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.deadline) e.deadline = "Deadline is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate() || !editTarget) return;

    const { error } = await supabase
      .from("opportunities")
      .update({
        title: form.title,
        description: form.description,
        type: form.type,
        deadline: form.deadline,
      })
      .eq("id", editTarget.id);

    if (error) {
      alert("Failed to update: " + error.message);
    } else {
      fetchMyOpportunities();
      setModalOpen(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    const { error } = await supabase
      .from("opportunities")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      fetchMyOpportunities();
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (row: Opportunity) => <span className="font-medium text-gray-800">{row.title}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (row: Opportunity) => <StatusBadge status={row.type} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row: Opportunity) => <StatusBadge status={row.status} />,
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (row: Opportunity) => <span className="text-gray-600">{row.deadline}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Opportunity) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row)}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-red-200 rounded text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Opportunities</h2>
        <Link
          href="/employer/post"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2e4a] text-white text-sm rounded hover:bg-[#14253d] transition-colors"
        >
          <Plus size={16} /> Post New Opportunity
        </Link>
      </div>

      <Table<Opportunity>
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="You have not posted any opportunities yet."
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Opportunity">
        <FormField label="Title" required error={errors.title}>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            hasError={!!errors.title}
          />
        </FormField>
        <FormField label="Type" required>
          <Select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          >
            <option value="job">Job</option>
            <option value="internship">Internship</option>
            <option value="scholarship">Scholarship</option>
          </Select>
        </FormField>
        <FormField label="Deadline" required error={errors.deadline}>
          <Input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            hasError={!!errors.deadline}
          />
        </FormField>
        <FormField label="Description" required error={errors.description}>
          <Textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            hasError={!!errors.description}
          />
        </FormField>
        <div className="flex items-center justify-end gap-2 pt-4">
          <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleSave} className="px-5 py-2 text-sm bg-[#1a2e4a] text-white rounded hover:bg-[#14253d] transition-colors">
            Save Changes
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Opportunity"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
