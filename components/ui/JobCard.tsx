import { MapPin, Building2, Calendar, ArrowUpRight } from "lucide-react";

interface JobCardProps {
  opportunity: any;
  onClick?: () => void;
}

export default function JobCard({ opportunity, onClick }: JobCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl p-5 hover:border-[#097969]/30 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={18} className="text-[#097969]" />
      </div>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#097969]/5 flex items-center justify-center text-[#097969] group-hover:bg-[#097969] group-hover:text-white transition-all">
          <Building2 size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#097969] transition-colors truncate">
            {opportunity.title}
          </h3>
          <p className="text-sm font-semibold text-[#097969]/80 mb-2 truncate">
            {opportunity.postedByName || "Confidential Company"}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
            {opportunity.location && (
              <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                <MapPin size={12} /> {opportunity.location}
              </span>
            )}
            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded capitalize">
              {opportunity.type}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar size={12} /> {new Date(opportunity.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
