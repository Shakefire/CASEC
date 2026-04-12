"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PrivateRoute from "@/components/PrivateRoute";
import Table from "@/components/tables/Table";
import Modal from "@/components/forms/Modal";
import ConfirmDialog from "@/components/forms/ConfirmDialog";
import { FormField, Input, Select } from "@/components/forms/FormField";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Toast from "@/components/Toast";
import { users as usersData, User } from "@/lib/data";

const roleOptions: User["role"][] = ["student", "employer", "admin"];
const statusOptions: User["status"][] = ["active", "inactive"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(usersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    role: "student" as User["role"],
    status: "active" as User["status"],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const openCreateModal = () => {
    setFormValues({ name: "", email: "", role: "student", status: "active" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formValues.name) errors.name = "Name is required.";
    if (!formValues.email) errors.email = "Email is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = () => {
    if (!validateForm()) return;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
      status: formValues.status,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [newUser, ...prev]);
    setNotification({ message: "User created successfully.", type: "success" });
    setIsModalOpen(false);
  };

  const handleRoleChange = (userId: string, role: User["role"]) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
    setNotification({ message: "Role updated successfully.", type: "success" });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        return { ...user, status: user.status === "active" ? "inactive" : "active" };
      })
    );
    setNotification({ message: "User status updated successfully.", type: "success" });
  };

  const handleDeleteUser = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
    setNotification({ message: "User deleted successfully.", type: "success" });
    setDeleteTarget(null);
  };

  const columns = useMemo(
    () => [
      { key: "name", header: "Name", render: (row: User) => <span className="font-medium text-slate-800">{row.name}</span> },
      { key: "email", header: "Email", render: (row: User) => <span className="text-slate-600">{row.email}</span> },
      {
        key: "role",
        header: "Role",
        render: (row: User) => (
          <select
            value={row.role}
            onChange={(e) => handleRoleChange(row.id, e.target.value as User["role"])}
            className="rounded border border-slate-300 px-2 py-1 text-sm text-slate-700 focus:border-[#097969] focus:ring-1 focus:ring-[#097969] outline-none"
          >
            {roleOptions.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
              </option>
            ))}
          </select>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row: User) => <StatusBadge status={row.status} />,
      },
      { key: "joinedAt", header: "Created At", render: (row: User) => <span>{row.joinedAt}</span> },
      {
        key: "actions",
        header: "Actions",
        render: (row: User) => (
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleToggleStatus(row.id)} className="text-sm px-3 py-2 bg-slate-100 rounded text-slate-700 hover:bg-slate-200 transition-colors">
              {row.status === "active" ? "Suspend" : "Activate"}
            </button>
            <button onClick={() => setDeleteTarget(row)} className="text-sm px-3 py-2 bg-red-50 rounded text-red-700 hover:bg-red-100 transition-colors">
              Delete
            </button>
          </div>
        ),
      },
    ],
    [users]
  );

  return (
    <PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin" pageTitle="Manage Users" pageSubtitle="Administer platform users and roles" userName="Admin">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">{users.length} users in the system</p>
            <h2 className="text-2xl font-semibold text-slate-900">User Management</h2>
          </div>
          <button onClick={openCreateModal} className="inline-flex items-center justify-center rounded bg-[#097969] px-4 py-2 text-sm font-semibold text-white hover:bg-[#065f52] transition-colors">
            + Add User
          </button>
        </div>

        <Table columns={columns} data={users} emptyMessage="No users found." />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create User" size="md">
          <div className="space-y-4">
            <FormField label="Name" required error={formErrors.name}>
              <Input value={formValues.name} onChange={(e) => setFormValues((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" />
            </FormField>
            <FormField label="Email" required error={formErrors.email}>
              <Input type="email" value={formValues.email} onChange={(e) => setFormValues((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email address" />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Role" required>
                <Select value={formValues.role} onChange={(e) => setFormValues((prev) => ({ ...prev, role: e.target.value as User["role"] }))}>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}> {option.charAt(0).toUpperCase() + option.slice(1)} </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Status" required>
                <Select value={formValues.status} onChange={(e) => setFormValues((prev) => ({ ...prev, status: e.target.value as User["status"] }))}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}> {option === "active" ? "Active" : "Suspended"} </option>
                  ))}
                </Select>
              </FormField>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreateUser} className="px-4 py-2 rounded bg-[#097969] text-white hover:bg-[#065f52] transition-colors">
                Create User
              </button>
            </div>
          </div>
        </Modal>

        <ConfirmDialog
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmLabel="Delete"
          danger
        />

        {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      </DashboardLayout>
    </PrivateRoute>
  );
}
