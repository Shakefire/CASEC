"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import StatusBadge from "@/components/ui/StatusBadge";
import { supabase } from "@/lib/supabase";

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
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Event | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [errors, setErrors] = useState<Partial<EventForm>>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    const { data: evts, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ EVENTS FETCH ERROR: " + (error.message || error));
    } else {
      setData(evts || []);
    }
    setLoading(false);
  }

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

    if (editTarget) {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", editTarget.id);

      if (error) {
        alert("Failed to update event: " + error.message);
      } else {
        fetchEvents();
        setModalOpen(false);
      }
    } else {
      const { error } = await supabase
        .from("events")
        .insert([eventData]);

      if (error) {
        alert("Failed to create event: " + error.message);
      } else {
        fetchEvents();
        setModalOpen(false);
      }
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", deleteTarget.id);

    if (error) {
      alert("Failed to delete event: " + error.message);
    } else {
      fetchEvents();
      setDeleteTarget(null);
    }
  }

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (row: Event) => (
        <span className="font-medium text-gray-800">{row.title}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (row: Event) => (
        <span className="text-gray-600">{new Date(row.date).toLocaleDateString()}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (row: Event) => (
        <span className="text-gray-600">{row.location}</span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row: Event) => <StatusBadge status={row.category} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row: Event) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Event) => (
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Events</h2>
          <p className="text-sm text-gray-500">{data.length} total events in database</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a2e4a] text-white text-sm rounded hover:bg-[#14253d] transition-colors"
        >
          <Plus size={16} /> Add Event
        </button>
      </div>

      <Table<Event>
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="No events found in Supabase. Click 'Add Event' to get started."
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Event" : "Add New Event"}
      >
        <FormField label="Title" required error={errors.title}>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Career Fair 2025"
            hasError={!!errors.title}
          />
        </FormField>
        <FormField label="Description" required error={errors.description}>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Describe the event..."
            hasError={!!errors.description}
          />
        </FormField>
        <FormField label="Date" required error={errors.date}>
          <Input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((f) => ({ ...f, date: e.target.value }))
            }
            hasError={!!errors.date}
          />
        </FormField>
        <FormField label="Location" required error={errors.location}>
          <Input
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="e.g. RUN Main Hall, Ede"
            hasError={!!errors.location}
          />
        </FormField>
        <FormField label="Category" required>
          <Select
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            <option value="Workshop">Workshop</option>
            <option value="Networking">Networking</option>
            <option value="Training">Training</option>
            <option value="Career Fair">Career Fair</option>
          </Select>
        </FormField>
        <FormField label="Event Type" required>
          <Select
            value={form.event_type}
            onChange={(e) =>
              setForm((f) => ({ ...f, event_type: e.target.value }))
            }
          >
            <option value="full-day">Full Day</option>
            <option value="half-day">Half Day</option>
            <option value="evening">Evening</option>
            <option value="webinar">Webinar</option>
          </Select>
        </FormField>
        <FormField label="Capacity">
          <Input
            type="number"
            value={form.capacity}
            onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
            placeholder="e.g. 100"
          />
        </FormField>
        <FormField label="Organizer">
          <Input
            value={form.organizer}
            onChange={(e) => setForm((f) => ({ ...f, organizer: e.target.value }))}
            placeholder="e.g. Career Services Centre"
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
            {editTarget ? "Save Changes" : "Add Event"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}