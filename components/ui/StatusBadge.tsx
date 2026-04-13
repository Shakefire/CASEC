interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  active: { label: "Active", className: "bg-green-50 text-green-700 border border-green-200" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-600 border border-gray-200" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  approved: { label: "Approved", className: "bg-green-50 text-green-700 border border-green-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200" },
  shortlisted: { label: "Shortlisted", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-500 border border-gray-200" },
  job: { label: "Job", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  scholarship: { label: "Scholarship", className: "bg-purple-50 text-purple-700 border border-purple-200" },
  internship: { label: "Internship", className: "bg-teal-50 text-teal-700 border border-teal-200" },
  student: { label: "Student", className: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
  employer: { label: "Employer", className: "bg-orange-50 text-orange-700 border border-orange-200" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
