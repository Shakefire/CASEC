import React from "react";

export default function StatCard({
  label,
  value,
  icon,
  note,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  note?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{label}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      {note && <p className="text-xs text-gray-500">{note}</p>}
    </div>
  );
}
