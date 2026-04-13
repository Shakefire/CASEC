import { Briefcase, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/FormField";

export default function StudentJobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Career Opportunities</h2>
          <p className="text-sm text-gray-500">Explore jobs, internships, and scholarships tailored for you.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input placeholder="Search roles, companies, or keywords..." className="pl-10" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="grid gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
            <Briefcase size={24} className="text-gray-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">No listings found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">Opportunities posted by employers will appear here once you've integrated the search logic.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
