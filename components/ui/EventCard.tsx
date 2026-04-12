import { Event } from "@/lib/data";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{event.location}</p>
        </div>
        <div className="text-sm text-[#097969] font-semibold">{event.date}</div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{event.description}</p>
    </div>
  );
}
