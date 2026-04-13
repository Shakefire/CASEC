"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Download, Star } from "lucide-react";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";

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
}

interface ResourceForm {
  title: string;
  file_name: string;
  file_size: string;
  category: string;
  type: string;
  description: string;
  featured: boolean;
}

const emptyForm: ResourceForm = {
  title: "",
  file_name: "",
  file_size: "",
  category: "",
  type: "",
  description: "",
  featured: false,
};

export default function AdminResourcesPage() {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [form, setForm] = useState<ResourceForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [errors, setErrors] = useState<Partial<ResourceForm>>({});

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    const { data: res, error } = await supabase
      .from("resources")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error("❌ RESOURCES FETCH ERROR: " + (error.message || error));
    } else {
      setData(res || []);
    }
    setLoading(false);
  }

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
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e: Partial<ResourceForm> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.file_name.trim()) e.file_name = "File name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const resourceData = {
      title: form.title,
      file_name: form.file_name,
      file_size: form.file_size,
      category: form.category,
      type: form.type,
      description: form.description,
      featured: form.featured,
    };

    if (editTarget) {
      const { error } = await supabase
        .from("resources")
        .update(resourceData)
        .eq("id", editTarget.id);

      if (error) {
        alert("Failed to update resource: " + error.message);
      } else {
        fetchResources();
        setModalOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("resources")
        .insert([resourceData]);

      if (error) {
        alert("Failed to create resource: " + error.message);
      } else {
        fetchResources();
        setModalOpen(false);
      }
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      alert("Failed to delete resource: " + error.message);
    } else {
      fetchResources();
      setDeleteTarget(null);
    }
  }

  async function toggleFeatured(id: string, current: boolean) {
    const { error } = await supabase
      .from("resources")
      .update({ featured: !current })
      .eq("id", id);

    if (error) {
      alert("Failed to update featured status: " + error.message);
    } else {
      fetchResources();
    }
  }

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (row: Resource) => (
        <div>
          <span className="font-medium text-gray-800">{row.title}</span>
          {row.featured && <Star size={14} className="inline ml-1 text-yellow-500 fill-current" />}
        </div>
      ),
    },
    {
      key: "file_name",
      header: "File Name",
      render: (row: Resource) => (
        <span className="text-gray-600 font-mono text-sm">{row.file_name}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row: Resource) => <StatusBadge status={row.category || "General"} />,
    },
    {
      key: "downloads",
      header: "Downloads",
      render: (row: Resource) => (
        <span className="text-gray-600">{row.downloads}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Resource) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFeatured(row.id, row.featured)}
            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border rounded transition-colors ${
              row.featured
                ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Star size={13} className={row.featured ? "fill-current" : ""} /> {row.featured ? "Unfeature" : "Feature"}
          </button>
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
          <p className="text-sm text-gray-500">{data.length} total resources in database</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2e4a] text-white text-sm rounded hover:bg-[#14253d] transition-colors"
        >
          <Plus size={16} /> Add Resource
        </button>
      </div>

      <Table<Resource>
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No resources found in Supabase. Click 'Add Resource' to get started."
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Resource" : "Add New Resource"}
      >
        <FormField label="Title" required error={errors.title}>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. CV Writing Guide"
            hasError={!!errors.title}
          />
        </FormField>
        <FormField label="File Name" required error={errors.file_name}>
          <Input
            value={form.file_name}
            onChange={(e) => setForm((f) => ({ ...f, file_name: e.target.value }))}
            placeholder="e.g. cv-guide.pdf"
            hasError={!!errors.file_name}
          />
        </FormField>
        <FormField label="File Size">
          <Input
            value={form.file_size}
            onChange={(e) => setForm((f) => ({ ...f, file_size: e.target.value }))}
            placeholder="e.g. 2.5 MB"
          />
        </FormField>
        <FormField label="Category">
          <Input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            placeholder="e.g. Career Development"
          />
        </FormField>
        <FormField label="Type">
          <Input
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            placeholder="e.g. PDF, Video, Document"
          />
        </FormField>
        <FormField label="Description">
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Describe the resource..."
          />
        </FormField>
        <FormField label="Featured">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="rounded border-gray-300"
          />
        </FormField>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-[#1a2e4a] text-white rounded hover:bg-[#14253d] transition-colors"
          >
            {editTarget ? "Save Changes" : "Add Resource"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}