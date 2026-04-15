import { Event } from "@/lib/data";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Extract day and month from date like "2024-07-05" or "July 5, 2024"
  // For now, let's assume a simplified display or try to parse
  const dateParts = event.date.split(" ");
  const month = dateParts[0]?.substring(0, 3);
  const day = dateParts[1]?.replace(",", "");

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border border-gray-100">
          <span className="text-sm font-black text-[#1a2e4a] leading-none">{day || "20"}</span>
          <span className="text-[10px] font-bold text-[#097969] uppercase mt-0.5">{month || "Jul"}</span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-[#1a2e4a] group-hover:text-[#097969] transition-colors mb-3 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <MapPin size={16} className="text-[#097969]" />
          <span className="truncate">{event.location}</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
          {event.description}
        </p>
        
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 text-[#097969] font-bold text-sm hover:underline"
        >
          Learn More <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
