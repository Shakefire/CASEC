import StatCard from "@/components/ui/StatCard";
import { Briefcase, CalendarDays, FolderOpen, Inbox } from "lucide-react";

export default function StudentOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome to your Career Portal</h2>
        <p className="text-gray-500">Your destination for job opportunities, career events, and professional resources.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Jobs" value={0} icon={<Briefcase size={20} />} />
        <StatCard label="Upcoming Events" value={0} icon={<CalendarDays size={20} />} />
        <StatCard label="Resources" value={0} icon={<FolderOpen size={20} />} />
        <StatCard label="My Applications" value={0} icon={<Inbox size={20} />} />
      </div>

      <div className="bg-white border border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-gray-400">Dashboard widgets and personalized recommendations will appear here.</p>
      </div>
    </div>
  );
}
