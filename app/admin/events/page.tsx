"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";
import { useEventsManagement } from "@/lib/hooks/useDashboard";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  event_type: string;
  capacity: number | null;
  organizer: string;
  status: string;
  created_at: string;
}

interface EventForm {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  event_type: string;
  capacity: string;
  organizer: string;
}

const emptyForm: EventForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  category: "Workshop",
  event_type: "full-day",
  capacity: "",
  organizer: "",
};

export default function AdminEventsPage() {
  const { data: events = [], isLoading: loading, refetch } = useEventsManagement();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [errors, setErrors] = useState<Partial<EventForm>>({});

  function openAdd() {
    setEditTarget(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(evt: Event) {
    setEditTarget(evt);
    setForm({
      title: evt.title,
      description: evt.description,
      date: evt.date,
      location: evt.location,
      category: evt.category,
      event_type: evt.event_type,
      capacity: evt.capacity?.toString() || "",
      organizer: evt.organizer,
    });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const e: Partial<EventForm> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.date) e.date = "Date is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    const eventData = {
      title: form.title,
      description: form.description,
      date: form.date,
      location: form.location,
      category: form.category,
      event_type: form.event_type,
      capacity: form.capacity ? parseInt(form.capacity) : null,
      organizer: form.organizer,
      status: "upcoming",
    };

    try {
      if (editTarget) {
        const { error } = await supabase.from("events").update(eventData).eq("id", editTarget.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert([eventData]);
        if (error) throw error;
      }
      await refetch();
      setModalOpen(false);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const { error } = await supabase.from("events").delete().eq("id", deleteTarget.id);
    if (error) {
      alert("Failed to delete event: " + error.message);
    } else {
      await refetch();
      setDeleteTarget(null);
    }
  }

  const columns = [
    { key: "title", header: "Title", render: (row: Event) => <span className="font-medium text-gray-800">{row.title}</span> },
    { key: "date", header: "Date", render: (row: Event) => <span className="text-gray-600">{new Date(row.date).toLocaleDateString()}</span> },
    { key: "location", header: "Location", render: (row: Event) => <span className="text-gray-600">{row.location}</span> },
    { key: "category", header: "Category", render: (row: Event) => <StatusBadge status={row.category} /> },
    { key: "status", header: "Status", render: (row: Event) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "Actions",
      render: (row: Event) => (
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
        <h1 className="text-xl font-bold text-gray-800">Events Management</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#1a2e4a] text-white rounded hover:bg-[#122035]"><Plus size={18} /> Add Event</button>
      </div>

      <Table data={events} columns={columns} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Event" : "Add New Event"}>
        <div className="space-y-4">
          <FormField label="Title" error={errors.title}><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Description" error={errors.description}><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" error={errors.date}><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></FormField>
            <FormField label="Location" error={errors.location}><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-[#1a2e4a] text-white rounded">Save Event</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Event" message={`Delete "${deleteTarget?.title}"?`} />
    </div>
  );
}
