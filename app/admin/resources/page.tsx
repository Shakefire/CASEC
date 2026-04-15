"use client";

import { useState, useRef } from "react";
import { Plus, Pencil, Trash2, Star, Upload, FileText, Loader2, Link as LinkIcon } from "lucide-react";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import { useResourcesManagement, useResourceMutation, useResourceDelete, useResourceUpload } from "@/lib/hooks/useDashboard";
import { useAuth } from "@/lib/auth";

interface Resource {
  id: string;
  title: string;
  file_name: string;
  file_size: string;
  uploaded_at: string;
  uploaded_by: string;
  category: string;
  type: string;
  description: string;
  downloads: number;
  featured: boolean;
  external_url?: string;
}

interface ResourceForm {
  title: string;
  file_name: string;
  file_size: string;
  category: string;
  type: string;
  description: string;
  featured: boolean;
  external_url?: string;
}

const emptyForm: ResourceForm = {
  title: "",
  file_name: "",
  file_size: "",
  category: "Career Guide",
  type: "pdf",
  description: "",
  featured: false,
  external_url: "",
};

export default function AdminResourcesPage() {
  const { user } = useAuth();
  const { data: resources = [], isLoading: loading, refetch } = useResourcesManagement();
  const resourceMutation = useResourceMutation();
  const resourceDelete = useResourceDelete();
  const resourceUpload = useResourceUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [form, setForm] = useState<ResourceForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [errors, setErrors] = useState<Partial<ResourceForm>>({});

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(res: Resource) {
    setEditTarget(res);
    setForm({
      title: res.title,
      file_name: res.file_name,
      file_size: res.file_size,
      category: res.category,
      type: res.type,
      description: res.description,
      featured: res.featured,
      external_url: res.external_url || "",
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e: Partial<ResourceForm> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (form.type === "pdf" && !form.external_url) e.external_url = "PDF file is required.";
    if (form.type === "link" && !form.external_url) e.external_url = "External URL is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await resourceUpload.mutateAsync(file);
      setForm(prev => ({
        ...prev,
        external_url: result.url,
        file_name: result.name,
        file_size: result.size
      }));
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    }
  }

  async function handleSubmit() {
    if (!validate()) return;
    try {
      await resourceMutation.mutateAsync({
        id: editTarget?.id,
        ...form,
        uploaded_by: user?.id,
        file_name: form.file_name || (form.type === "link" ? "External Link" : "Resource"),
      });
      await refetch();
      setModalOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await resourceDelete.mutateAsync(deleteTarget.id);
      await refetch();
      setDeleteTarget(null);
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  }

  const columns = [
    { key: "title", header: "Title", render: (row: Resource) => <span>{row.title}</span> },
    { key: "category", header: "Category", render: (row: Resource) => <StatusBadge status={row.category} /> },
    { key: "type", header: "Type", render: (row: Resource) => <span>{row.type}</span> },
    {
      key: "actions",
      header: "Actions",
      render: (row: Resource) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(row)} className="p-1 text-gray-400 hover:text-blue-600"><Pencil size={16} /></button>
          <button onClick={() => setDeleteTarget(row)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Resource Library</h1>
        <button onClick={openAdd} className="bg-[#1a2e4a] text-white px-4 py-2 rounded flex items-center gap-2"><Plus size={18} /> Add Resource</button>
      </div>

      <Table data={resources} columns={columns} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Resource" : "Add New Resource"}>
        <div className="space-y-4">
          <FormField label="Title" error={errors.title}><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="Career Guide">Career Guide</option><option value="CV Template">CV Template</option></Select></FormField>
            <FormField label="Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="pdf">PDF Document</option><option value="link">External Link</option></Select></FormField>
          </div>
          {form.type === "pdf" ? (
             <button onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed p-8 rounded-xl hover:bg-gray-50">{form.file_name || "Upload PDF"}</button>
          ) : (
            <FormField label="URL"><Input value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} /></FormField>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf" />
          <div className="flex justify-end gap-3 pt-6">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2">Cancel</button>
            <button onClick={handleSubmit} disabled={resourceMutation.isPending} className="bg-[#1a2e4a] text-white px-6 py-2 rounded">Save Resource</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Resource" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
}
