import { Opportunity } from "@/lib/data";

interface JobCardProps {
  opportunity: Opportunity;
}

export default function JobCard({ opportunity }: JobCardProps) {
  return (
    <a
      href="#"
      className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#097969] font-semibold">{opportunity.type}</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{opportunity.title}</h3>
        </div>
        <div className="text-sm text-slate-500">Deadline: {opportunity.deadline}</div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{opportunity.description}</p>
      <div className="mt-4 text-xs text-slate-500">Posted: {opportunity.createdAt}</div>
    </a>
  );
}
