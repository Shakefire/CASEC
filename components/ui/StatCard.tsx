import React from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  note?: string;
}

export default function StatCard({ label, value, icon, note }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4 flex items-start gap-4">
      <div className="w-10 h-10 bg-[#1a2e4a]/8 rounded flex items-center justify-center flex-shrink-0 text-[#1a2e4a]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-sm text-gray-600 mt-1 leading-tight">{label}</p>
        {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
      </div>
    </div>
  );
}
