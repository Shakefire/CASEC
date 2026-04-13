"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Search, MapPin, Filter, X, Heart, Clock, Users, BookmarkCheck, AlertCircle, Calendar, Star, Play, Image as ImageIcon, FileText } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  createdAt: string;
  category?: string;
  eventType?: string;
  capacity?: number;
  registered?: number;
  organizer?: string;
  highlights?: string[];
  isPast?: boolean;
  actualAttendance?: number;
  recordingUrl?: string;
  summary?: string;
  feedbackRating?: number;
  speakers?: string[];
  topics?: string[];
  outcomes?: string[];
  photoGallery?: string[];
}

const getEventStatus = (eventDate: string) => {
  if (!eventDate) return { status: "upcoming", label: "TBD", color: "green" };
  const today = new Date();
  const eventDateObj = new Date(eventDate);
  
  if (isNaN(eventDateObj.getTime())) {
    return { status: "upcoming", label: "TBD", color: "green" };
  }
  
  const daysUntil = Math.ceil((eventDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < 0) return { status: "past", label: "Past Event", color: "slate" };
  if (daysUntil === 0) return { status: "today", label: "Today", color: "red" };
  if (daysUntil <= 7) return { status: "soon", label: `In ${daysUntil} days`, color: "yellow" };
  return { status: "upcoming", label: "Upcoming", color: "green" };
};

const categoryColors = {
  Workshop: { bg: "#dbeafe", text: "#0284c7", icon: "📚" },
  Networking: { bg: "#dcfce7", text: "#16a34a", icon: "🤝" },
  Training: { bg: "#f3e8ff", text: "#a855f7", icon: "🎓" },
  "Career Fair": { bg: "#fee2e2", text: "#dc2626", icon: "🎪" },
};

const eventTypeLabels = {
  "full-day": "Full Day",
  "half-day": "Half Day",
  evening: "Evening",
  webinar: "Webinar",
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"upcoming" | "soon">("upcoming");
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: false });

        if (fetchError) {
          console.error("Error fetching events:", fetchError);
          setError("Failed to load events. Please try again later.");
          return;
        }

        const mapped: EventItem[] = (data || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          date: row.date,
          description: row.description,
          location: row.location,
          createdAt: row.created_at,
          category: row.category,
          eventType: row.event_type,
          capacity: row.capacity,
          registered: row.registered,
          organizer: row.organizer,
          highlights: row.highlights,
          isPast: row.is_past,
          actualAttendance: row.actual_attendance,
          recordingUrl: row.recording_url,
          summary: row.summary,
          feedbackRating: row.feedback_rating,
          speakers: row.speakers,
          topics: row.topics,
          outcomes: row.outcomes,
          photoGallery: row.photo_gallery,
        }));

        setEvents(mapped);
      } catch (err: any) {
        console.error("EventsPage: Unexpected crash:", err);
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Separate upcoming and past events
  const upcomingEvents = events.filter((evt) => !evt.isPast);
  const pastEvents = events.filter((evt) => evt.isPast);

  // Get unique values for filters
  const locations = Array.from(new Set(upcomingEvents.map((evt) => evt.location).filter(Boolean))) as string[];
  const categories = Array.from(new Set(upcomingEvents.map((evt) => evt.category).filter(Boolean))) as string[];
  const pastYears = Array.from(new Set(pastEvents.map((evt) => new Date(evt.date).getFullYear().toString()).filter(Boolean))).sort().reverse() as string[];

  // Calculate insights
  const pastInsights = {
    totalEvents: pastEvents.length,
    totalAttendees: pastEvents.reduce((sum, evt) => sum + (evt.actualAttendance || 0), 0),
    averageRating: pastEvents.length > 0 
      ? (pastEvents.reduce((sum, evt) => sum + (evt.feedbackRating || 0), 0) / pastEvents.length).toFixed(1)
      : 0,
    mostAttendedEvent: pastEvents.reduce((max, evt) => (evt.actualAttendance || 0) > (max.actualAttendance || 0) ? evt : max, pastEvents[0] || null),
  };

  // Filter and sort
  const filteredEvents = useMemo(() => {
    const sourceEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;
    
    let filtered = sourceEvents.filter((evt) => {
      const matchesSearch =
        searchQuery === "" ||
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.organizer?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === null || evt.category === selectedCategory;
      const matchesLocation = selectedLocation === null || evt.location === selectedLocation;
      const matchesEventType = selectedEventType === null || evt.eventType === selectedEventType;
      const matchesYear = selectedYear === null || new Date(evt.date).getFullYear().toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesLocation && matchesEventType && matchesYear;
    });

    // Sort
    if (activeTab === "upcoming") {
      if (sortBy === "soon") {
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } else {
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    } else {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [events, searchQuery, selectedCategory, selectedLocation, selectedEventType, selectedYear, sortBy, activeTab]);

  const toggleSaveEvent = (eventId: string) => {
    const newSaved = new Set(savedEvents);
    if (newSaved.has(eventId)) {
      newSaved.delete(eventId);
    } else {
      newSaved.add(eventId);
    }
    setSavedEvents(newSaved);
  };

  const selectedEventData = events.find((evt) => evt.id === selectedEvent);
  const eventStatus = selectedEventData ? getEventStatus(selectedEventData.date) : null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#097969] py-10 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="mt-2 text-sm text-emerald-100">Home &rsaquo; Events</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#097969]"></div>
            <p className="mt-4 text-gray-600 font-medium">Discovering latest events...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "upcoming"
                ? "border-[#097969] text-[#097969]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            📅 Upcoming Events ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "past"
                ? "border-[#097969] text-[#097969]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            📁 Past Events ({pastEvents.length})
          </button>
        </div>

        {/* Upcoming Events Tab */}
        {activeTab === "upcoming" && (
          <>
            {/* Search & Filter Bar */}
            <div className="mb-8 space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search events, organizers, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#097969] focus:ring-1 focus:ring-[#097969]"
                  />
                </div>
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Filter size={20} />
                  Filters
                </button>
              </div>

              {/* Expanded Filter Row */}
              {filterOpen && (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Location</label>
                    <select
                      value={selectedLocation || ""}
                      onChange={(e) => setSelectedLocation(e.target.value || null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                    >
                      <option value="">All Locations</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Event Type Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Event Type</label>
                    <select
                      value={selectedEventType || ""}
                      onChange={(e) => setSelectedEventType(e.target.value || null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                    >
                      <option value="">All Types</option>
                      <option value="full-day">Full Day</option>
                      <option value="half-day">Half Day</option>
                      <option value="evening">Evening</option>
                      <option value="webinar">Webinar</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "upcoming" | "soon")}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                    >
                      <option value="upcoming">Latest First</option>
                      <option value="soon">Happening Soon</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(selectedCategory || selectedLocation || selectedEventType) && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                    >
                      {selectedCategory}
                      <X size={16} />
                    </button>
                  )}
                  {selectedLocation && (
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                    >
                      {selectedLocation}
                      <X size={16} />
                    </button>
                  )}
                  {selectedEventType && (
                    <button
                      onClick={() => setSelectedEventType(null)}
                      className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                    >
                      {eventTypeLabels[selectedEventType as keyof typeof eventTypeLabels]}
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Results Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <p className="text-xs font-semibold text-[#097969] mb-1">
                  {filteredEvents.length} OF {upcomingEvents.length}
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  {filteredEvents.length === 0 ? "No events found" : "Event Listings"}
                </h2>
              </div>
            </div>

            {/* Events List */}
            {filteredEvents.length === 0 ? (
              <div className="py-16 text-center">
                <AlertCircle className="mx-auto mb-4 text-slate-400" size={48} />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No events found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedLocation(null);
                    setSelectedEventType(null);
                  }}
                  className="px-4 py-2 bg-[#097969] text-white rounded-lg hover:bg-[#065f52] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((evt) => {
                  const status = getEventStatus(evt.date);
                  const isSaved = savedEvents.has(evt.id);
                  const categoryColor = categoryColors[evt.category as keyof typeof categoryColors] || {
                    bg: "#f3f4f6",
                    text: "#374151",
                    icon: "📌",
                  };
                  const attendancePercentage = evt.capacity ? Math.round((evt.registered || 0) / evt.capacity * 100) : 0;

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt.id)}
                      className="group cursor-pointer border border-slate-200 rounded-xl p-6 hover:border-[#097969] hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        {/* Category Badge */}
                        <div className="flex-shrink-0">
                          <div
                            className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-2xl"
                            style={{ backgroundColor: categoryColor.bg }}
                          >
                            {categoryColor.icon}
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#097969] transition-colors">
                                {evt.title}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">{evt.organizer}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveEvent(evt.id);
                              }}
                              className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Heart
                                size={20}
                                className={isSaved ? "fill-red-500 text-red-500" : "text-slate-400"}
                              />
                            </button>
                          </div>

                          {/* Date, Location & Description */}
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(evt.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {evt.location}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">{evt.description}</p>

                          {/* Event Highlights */}
                          {evt.highlights && evt.highlights.length > 0 && (
                            <div className="mb-3 flex flex-wrap gap-2">
                              {evt.highlights.slice(0, 2).map((highlight, idx) => (
                                <span key={idx} className="text-xs bg-[#e6f4f1] text-[#097969] px-2 py-1 rounded">
                                  ✓ {highlight}
                                </span>
                              ))}
                              {evt.highlights.length > 2 && (
                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                  +{evt.highlights.length - 2} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Footer: Attendance, Status, Details Button */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {/* Attendance */}
                              {evt.capacity && evt.registered !== undefined && (
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                  <Users size={14} className="text-[#097969]" />
                                  <span className="text-slate-700">
                                    {evt.registered}/{evt.capacity} ({attendancePercentage}%)
                                  </span>
                                </div>
                              )}

                              {/* Event Type Tag */}
                              <span
                                className="text-xs font-semibold px-3 py-1 rounded-full"
                                style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
                              >
                                {evt.category}
                              </span>

                              {/* Status Badge */}
                              <div
                                className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                                  status.status === "upcoming"
                                    ? "bg-green-100 text-green-700"
                                    : status.status === "soon"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : status.status === "today"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                <Clock size={12} />
                                {status.label}
                              </div>
                            </div>

                            {/* Register Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt.id);
                              }}
                              className="px-4 py-2 bg-[#097969] text-white text-sm font-semibold rounded-lg hover:bg-[#065f52] transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Past Events Tab */}
        {activeTab === "past" && (
          <>
            {/* Insights Section */}
            {pastEvents.length > 0 && (
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-[#e6f4f1] to-white p-6">
                  <div className="text-3xl font-bold text-[#097969] mb-1">{pastInsights.totalEvents}</div>
                  <p className="text-sm font-semibold text-slate-600">Events Hosted</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-[#dbeafe] to-white p-6">
                  <div className="text-3xl font-bold text-blue-700 mb-1">{pastInsights.totalAttendees.toLocaleString()}</div>
                  <p className="text-sm font-semibold text-slate-600">Total Attendees</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-yellow-50 to-white p-6">
                  <div className="flex items-center gap-1">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{pastInsights.averageRating}</div>
                    <Star size={24} className="text-yellow-600 fill-yellow-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">Average Rating</p>
                </div>
                {pastInsights.mostAttendedEvent && (
                  <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-purple-50 to-white p-6">
                    <div className="text-lg font-bold text-purple-700 mb-1 line-clamp-2">{pastInsights.mostAttendedEvent.title}</div>
                    <p className="text-sm font-semibold text-slate-600">{pastInsights.mostAttendedEvent.actualAttendance} attendees</p>
                  </div>
                )}
              </div>
            )}

            {/* Search & Filter Bar for Past Events */}
            <div className="mb-8 space-y-4">
              {/* Search */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search past events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#097969] focus:ring-1 focus:ring-[#097969]"
                  />
                </div>
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Filter size={20} />
                  Filters
                </button>
              </div>

              {/* Expanded Filter Row */}
              {filterOpen && (
                <div className="grid gap-3 md:grid-cols-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  {/* Year Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Year</label>
                    <select
                      value={selectedYear || ""}
                      onChange={(e) => setSelectedYear(e.target.value || null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                    >
                      <option value="">All Years</option>
                      {pastYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Category</label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                    >
                      <option value="">All Categories</option>
                      {Array.from(new Set(pastEvents.map((evt) => evt.category).filter(Boolean))).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Organizer Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Organizer</label>
                    <select
                      value={selectedLocation || ""}
                      onChange={(e) => setSelectedLocation(e.target.value || null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#097969]"
                    >
                      <option value="">All Organizers</option>
                      {Array.from(new Set(pastEvents.map((evt) => evt.organizer).filter(Boolean))).map((org) => (
                        <option key={org} value={org}>
                          {org}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(selectedCategory || selectedYear || selectedLocation) && (
                <div className="flex flex-wrap gap-2">
                  {selectedYear && (
                    <button
                      onClick={() => setSelectedYear(null)}
                      className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                    >
                      {selectedYear}
                      <X size={16} />
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                    >
                      {selectedCategory}
                      <X size={16} />
                    </button>
                  )}
                  {selectedLocation && (
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="flex items-center gap-2 px-3 py-1 bg-[#e6f4f1] text-[#097969] rounded-full text-sm font-medium hover:bg-[#c7e9e4] transition-colors"
                    >
                      {selectedLocation}
                      <X size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Results Header */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-[#097969] mb-1">
                {filteredEvents.length} OF {pastEvents.length}
              </p>
              <h2 className="text-xl font-bold text-slate-900">Event Archive</h2>
            </div>

            {/* Past Events List */}
            {filteredEvents.length === 0 ? (
              <div className="py-16 text-center">
                <AlertCircle className="mx-auto mb-4 text-slate-400" size={48} />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No past events found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedLocation(null);
                    setSelectedYear(null);
                  }}
                  className="px-4 py-2 bg-[#097969] text-white rounded-lg hover:bg-[#065f52] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((evt) => {
                  const isSaved = savedEvents.has(evt.id);
                  const categoryColor = categoryColors[evt.category as keyof typeof categoryColors] || {
                    bg: "#f3f4f6",
                    text: "#374151",
                    icon: "📌",
                  };

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt.id)}
                      className="group cursor-pointer border border-slate-200 rounded-xl p-6 hover:border-[#097969] hover:shadow-lg transition-all duration-300 bg-slate-50/50"
                    >
                      <div className="flex gap-4">
                        {/* Category Badge - Dimmed */}
                        <div className="flex-shrink-0 opacity-75">
                          <div
                            className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-2xl"
                            style={{ backgroundColor: categoryColor.bg }}
                          >
                            {categoryColor.icon}
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-700 group-hover:text-[#097969] transition-colors">
                                {evt.title}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">{evt.organizer}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveEvent(evt.id);
                              }}
                              className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <Heart
                                size={20}
                                className={isSaved ? "fill-red-500 text-red-500" : "text-slate-300"}
                              />
                            </button>
                          </div>

                          {/* Date & Stats */}
                          <div className="flex flex-col gap-2 mb-3">
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(evt.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              {evt.actualAttendance && (
                                <span className="flex items-center gap-1">
                                  <Users size={14} />
                                  {evt.actualAttendance} attendees
                                </span>
                              )}
                              {evt.feedbackRating && (
                                <span className="flex items-center gap-1">
                                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                  {evt.feedbackRating}/5
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-slate-600 line-clamp-2 mb-3">{evt.description}</p>

                          {/* Recap Content Badges */}
                          <div className="mb-3 flex flex-wrap gap-2">
                            {evt.recordingUrl && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                                <Play size={12} /> Recording
                              </span>
                            )}
                            {evt.photoGallery && evt.photoGallery.length > 0 && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1">
                                <ImageIcon size={12} /> {evt.photoGallery.length} Photos
                              </span>
                            )}
                            {evt.summary && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                                <FileText size={12} /> Summary
                              </span>
                            )}
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                              ⚫ Completed
                            </span>
                          </div>

                          {/* Footer: CTA Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-slate-500">{evt.category}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(evt.id);
                              }}
                              className="px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                            >
                              View Recap
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </>
          )}
        </>
      )}
    </main>

      {/* Event Detail Modal */}
      {selectedEventData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSelectedEvent(null)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-200">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedEventData.title}</h2>
                  <p className="text-base font-semibold text-[#097969]">{selectedEventData.organizer}</p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">DATE</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(selectedEventData.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">LOCATION</p>
                    <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                      <MapPin size={14} />
                      {selectedEventData.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-1">EVENT TYPE</p>
                    <p className="text-sm font-semibold text-[#097969]">
                      {selectedEventData.eventType
                        ? eventTypeLabels[selectedEventData.eventType as keyof typeof eventTypeLabels]
                        : "Event"}
                    </p>
                  </div>
                  {selectedEventData.isPast && selectedEventData.actualAttendance && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">ATTENDANCE</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedEventData.actualAttendance} people</p>
                    </div>
                  )}
                  {selectedEventData.isPast && selectedEventData.feedbackRating && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">RATING</p>
                      <p className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                        {selectedEventData.feedbackRating}
                        <Star size={14} className="fill-yellow-500" />
                      </p>
                    </div>
                  )}
                  {!selectedEventData.isPast && selectedEventData.capacity && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">CAPACITY</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedEventData.capacity} people</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">ABOUT THIS EVENT</h3>
                  <p className="text-sm leading-6 text-slate-700">{selectedEventData.description}</p>
                </div>

                {/* Past Event Summary */}
                {selectedEventData.isPast && selectedEventData.summary && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">EVENT SUMMARY</h3>
                    <p className="text-sm leading-6 text-slate-700">{selectedEventData.summary}</p>
                  </div>
                )}

                {/* Speakers */}
                {selectedEventData.speakers && selectedEventData.speakers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">SPEAKERS</h3>
                    <ul className="space-y-2">
                      {selectedEventData.speakers.map((speaker, idx) => (
                        <li key={idx} className="text-sm text-slate-700">👤 {speaker}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Topics/Highlights */}
                {(selectedEventData.highlights || selectedEventData.topics) && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">
                      {selectedEventData.isPast ? "TOPICS COVERED" : "WHAT TO EXPECT"}
                    </h3>
                    <ul className="space-y-2">
                      {(selectedEventData.topics || selectedEventData.highlights || []).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-[#097969] font-bold mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Outcomes */}
                {selectedEventData.outcomes && selectedEventData.outcomes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">KEY OUTCOMES</h3>
                    <ul className="space-y-2">
                      {selectedEventData.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-[#097969] font-bold mt-0.5">📊</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex-wrap">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 min-w-[120px] px-4 py-3 border border-slate-300 rounded-lg font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toggleSaveEvent(selectedEventData.id);
                  }}
                  className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    savedEvents.has(selectedEventData.id)
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Heart size={18} fill={savedEvents.has(selectedEventData.id) ? "currentColor" : "none"} />
                  {savedEvents.has(selectedEventData.id) ? "Saved" : "Save"}
                </button>
                {!selectedEventData.isPast && (
                  <button className="flex-1 min-w-[120px] px-4 py-3 bg-[#097969] text-white rounded-lg font-semibold hover:bg-[#065f52] transition-colors">
                    Register Now
                  </button>
                )}
                {selectedEventData.isPast && selectedEventData.recordingUrl && (
                  <a
                    href={selectedEventData.recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[120px] px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={18} />
                    Watch Recording
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
