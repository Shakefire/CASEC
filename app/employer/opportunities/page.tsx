"use client";

import { useState } from "react";
import { 
  Plus, Pencil, Trash2, Filter, Search, Building2, 
  MapPin, DollarSign, Calendar, Eye, Users, 
  ArrowUpRight, AlertCircle, Loader2, Sparkles, BookOpen
} from "lucide-react";
import Table, { Column } from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useOpportunitiesManagement } from "@/lib/hooks/useDashboard";
import { useQueryClient } from "@tanstack/react-query";
import ErrorState from "@/components/ui/ErrorState";

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
  applicationCount?: number;
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

export default function EmployerOpportunitiesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: opportunities = [], isLoading: loading, isError, refetch } = useOpportunitiesManagement(user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Opportunity | null>(null);
  const [form, setForm] = useState<OppForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Opportunity | null>(null);
  const [errors, setErrors] = useState<Partial<OppForm>>({});
  const [searchTerm, setSearchTerm] = useState("");

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

  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    if (!validate() || !editTarget) return;

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
        posted_by: user?.id,
        status: form.status,
      };

      const { error } = await supabase
        .from("opportunities")
        .update(payload)
        .eq("id", editTarget.id);

      if (error) {
        alert(`Failed to update: ${error.message}`);
      } else {
        queryClient.invalidateQueries({ queryKey: ["opportunities-management"] });
        if (refetch) await refetch();
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Employer submit error:", err);
    } finally {
      setSubmitting(false);
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
      queryClient.invalidateQueries({ queryKey: ["opportunities-management"] });
      if (refetch) await refetch();
      setDeleteTarget(null);
    }
  }

  const filtered = (opportunities as Opportunity[]).filter(o => 
    o.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<Opportunity>[] = [
    {
      key: "title",
      header: "Opportunity",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 leading-tight">{row.title}</span>
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{row.location || "Remote"}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Category",
      render: (row) => <StatusBadge status={row.type} />,
    },
    {
      key: "applications",
      header: "Candidates",
      render: (row) => (
        <div className="flex items-center gap-2">
           <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black border border-blue-100 flex items-center gap-1.5">
              <Users size={12} /> {row.applicationCount || 0} Applied
           </div>
        </div>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (row) => (
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
           <Calendar size={14} className="text-gray-400" />
           {new Date(row.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link 
            href="/employer/applications"
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="View Applications"
          >
            <Eye size={18} />
          </Link>
          <button
            onClick={() => openEdit(row)}
            className="p-2 text-gray-400 hover:text-[#097969] hover:bg-green-50 rounded-xl transition-all"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-8">
         <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">My Opportunities</h1>
          <p className="text-gray-500 font-medium">Manage your active listings and track candidate interest.</p>
        </div>
        <Link
          href="/employer/post"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#097969] text-white rounded-2xl font-bold hover:bg-[#076356] transition-all shadow-lg shadow-green-900/10 active:scale-95"
        >
          <Plus size={20} /> Post New Role
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search roles..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#097969]/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3">
              <Sparkles size={16} className="text-[#097969]" />
              <span className="text-sm font-black text-[#097969]">{opportunities.length} Total Roles</span>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
        <Table<Opportunity>
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="You haven't posted any roles yet."
        />
      </div>

      {/* Edit Modal (Enhanced) */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Modify Opportunity" maxWidth="max-w-4xl">
        <div className="space-y-8 p-2">
          <div className="grid grid-cols-2 gap-6">
            <FormField label="Job Title" required error={errors.title}>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                hasError={!!errors.title}
                className="rounded-2xl py-3"
              />
            </FormField>
            <FormField label="Display Company Name">
              <Input
                value={form.posted_by_name}
                onChange={(e) => setForm((f) => ({ ...f, posted_by_name: e.target.value }))}
                placeholder="Defaults to your company"
                className="rounded-2xl py-3"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <FormField label="Location">
              <Input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Lagos, Remote"
                className="rounded-2xl py-3"
              />
            </FormField>
            <FormField label="Salary Info">
              <Input
                value={form.salary}
                onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                placeholder="e.g. ₦120k / month"
                className="rounded-2xl py-3"
              />
            </FormField>
            <FormField label="Deadline" required error={errors.deadline}>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                hasError={!!errors.deadline}
                className="rounded-2xl py-3"
              />
            </FormField>
          </div>

          <FormField label="Work Description" required error={errors.description}>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              hasError={!!errors.description}
              rows={4}
              className="rounded-2xl p-4"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-6">
             <FormField label="Skills & Requirements (One per line)">
                <Textarea
                  value={form.requirements}
                  onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
                  rows={5}
                  className="rounded-2xl p-4 text-sm"
                />
             </FormField>
             <FormField label="Application Instructions">
                <Textarea
                  value={form.application_instructions}
                  onChange={(e) => setForm((f) => ({ ...f, application_instructions: e.target.value }))}
                  rows={5}
                  className="rounded-2xl p-4 text-sm"
                  placeholder="Tell students how to apply..."
                />
             </FormField>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField label="Category" required>
              <Select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="rounded-2xl h-12"
              >
                <option value="job">Full-time Job</option>
                <option value="internship">Internship</option>
                <option value="scholarship">Scholarship</option>
                <option value="competition">Competition</option>
              </Select>
            </FormField>

            <FormField label="Hiring Status" required>
              <Select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="rounded-2xl h-12"
              >
                <option value="active">Active (Open)</option>
                <option value="closed">Closed / Filled</option>
              </Select>
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
            <button
              onClick={() => setModalOpen(false)}
              className="px-8 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="px-10 py-3 bg-[#097969] text-white rounded-2xl font-bold hover:bg-[#076356] transition-all shadow-lg shadow-green-900/10 disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Opportunity"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will also remove any associated records.`}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
