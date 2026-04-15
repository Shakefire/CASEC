"use client";

import { CalendarDays, Loader2 } from "lucide-react";
import { useEvents } from "@/lib/hooks/useDashboard";
import EventCard from "@/components/ui/EventCard";

export default function StudentEventsPage() {
  const { data: events = [], isLoading } = useEvents(false, 50);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
        <p className="text-sm text-gray-500">Stay informed about career workshops, webinars, and networking sessions.</p>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#097969]" size={32} />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center space-y-3 min-h-[300px]">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              <CalendarDays size={24} className="text-gray-300" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">No events scheduled</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">Check back later for upcoming career-building events and workshops.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
