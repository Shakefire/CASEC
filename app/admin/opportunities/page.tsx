"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import { useOpportunitiesManagement } from "@/lib/hooks/useDashboard";
import { useAuth } from "@/lib/auth";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  deadline: string;
  status: string;
  posted_by: string;
  posted_by_name: string;
  location: string;
  salary: string;
  requirements: string[];
  skills: string[];
  eligibility: string[];
  application_instructions: string;
  created_at: string;
}

interface OppForm {
  title: string;
  description: string;
  posted_by_name: string;
  location: string;
  salary: string;
  requirements: string;
  skills: string;
  eligibility: string;
  application_instructions: string;
  type: string;
  deadline: string;
  status: string;
}

const emptyForm: OppForm = {
  title: "",
  description: "",
  posted_by_name: "",
  location: "",
  salary: "",
  requirements: "",
  skills: "",
  eligibility: "",
  application_instructions: "",
  type: "job",
  deadline: "",
  status: "active",
};

export default function AdminOpportunitiesPage() {
  const { user } = useAuth();
  const { data: opportunities = [], isLoading: loading, refetch } = useOpportunitiesManagement();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<OppForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [errors, setErrors] = useState<Partial<OppForm>>({});
  const [submitting, setSubmitting] = useState(false);

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(opp: Opportunity) {
    setEditTarget(opp);
    setForm({
      title: opp.title,
      description: opp.description,
      posted_by_name: opp.posted_by_name || "",
      location: opp.location || "",
      salary: (opp as any).salary || "",
      requirements: opp.requirements ? opp.requirements.join("\n") : "",
      skills: (opp as any).skills ? (opp as any).skills.join("\n") : "",
      eligibility: opp.eligibility ? opp.eligibility.join("\n") : "",
      application_instructions: (opp as any).application_instructions || "",
      type: opp.type,
      deadline: opp.deadline,
      status: opp.status || "active",
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

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        posted_by_name: form.posted_by_name,
        location: form.location,
        salary: form.salary,
        requirements: form.requirements ? String(form.requirements).split("\n").map(r => r.trim()).filter(Boolean) : [],
        skills: form.skills ? String(form.skills).split("\n").map(s => s.trim()).filter(Boolean) : [],
        eligibility: form.eligibility ? String(form.eligibility).split("\n").map(r => r.trim()).filter(Boolean) : [],
        application_instructions: form.application_instructions,
        type: form.type,
        deadline: form.deadline,
        status: form.status,
      };

      if (!editTarget && user) {
        payload.posted_by = user.id;
      }

      if (editTarget) {
        const { error } = await supabase.from("opportunities").update(payload).eq("id", editTarget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("opportunities").insert([payload]);
        if (error) throw error;
      }

      await refetch();
      setModalOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("opportunities").delete().eq("id", deleteTarget.id);
    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      await refetch();
      setDeleteTarget(null);
    }
  }

  const columns = [
    { key: "title", header: "Title", render: (row: Opportunity) => <span className="font-medium text-gray-800">{row.title}</span> },
    { key: "type", header: "Type", render: (row: Opportunity) => <StatusBadge status={row.type} /> },
    { key: "deadline", header: "Deadline", render: (row: Opportunity) => <span className="text-gray-600">{row.deadline}</span> },
    { key: "status", header: "Status", render: (row: Opportunity) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (row: Opportunity) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="text-xs px-2.5 py-1.5 border rounded border-gray-300 hover:bg-gray-50"><Pencil size={13} /></button>
          <button onClick={() => setDeleteTarget(row)} className="text-xs px-2.5 py-1.5 border rounded border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={13} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Opportunities</h1>
          <p className="text-sm text-gray-500">Manage jobs and internship listings</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1a2e4a] text-white rounded hover:bg-[#122035]"><Plus size={18} /> Add Opportunity</button>
      </div>

      <Table data={opportunities} columns={columns} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Opportunity" : "Add New Opportunity"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Title" error={errors.title}><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
            <FormField label="Company"><Input value={form.posted_by_name} onChange={(e) => setForm({ ...form, posted_by_name: e.target.value })} /></FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
            <FormField label="Salary"><Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></FormField>
            <FormField label="Deadline"><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></FormField>
          </div>
          <FormField label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-[#1a2e4a] text-white rounded">
              {submitting ? "Saving..." : "Save Opportunity"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Opportunity" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
}
