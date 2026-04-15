"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBookingMutation } from "@/lib/hooks/useDashboard";
import { useProfile } from "@/lib/hooks/useProfile";
import Link from "next/link";

interface BookingFormProps {
  onSuccess?: () => void;
  className?: string;
}

export default function BookingForm({ onSuccess, className = "" }: BookingFormProps) {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const bookingMutation = useBookingMutation();

  // Booking Form State
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("10:00");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-fill if user or profile is loaded
  useEffect(() => {
    if (profile) {
      setBookingEmail(profile.profiles.email || "");
      const fullName = `${profile.profiles.first_name || ""} ${profile.profiles.last_name || ""}`.trim();
      setBookingName(fullName);
    } else if (user) {
      setBookingEmail(user.email || "");
      const fullName = user.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() 
        : "";
      setBookingName(fullName);
    }
  }, [user, profile]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    const start_time = new Date(`${bookingDate}T${bookingTime}:00`);
    const end_time = new Date(start_time.getTime() + 60 * 60 * 1000);

    bookingMutation.mutate(
      {
        id: "create",
        type: "create",
        body: {
          full_name: bookingName,
          email: bookingEmail,
          purpose: bookingPurpose,
          details: bookingNotes,
          start_time: start_time.toISOString(),
          end_time: end_time.toISOString(),
          user_id: user?.id || null,
        }
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          if (onSuccess) onSuccess();
          // Reset form
          setBookingDate("");
          setBookingPurpose("");
          setBookingNotes("");
        },
        onError: (err: any) => {
          setBookingError(err.message || "An unexpected error occurred. Please try again.");
        }
      }
    );
  };

  if (isSuccess) {
    return (
      <div className={`text-center py-12 px-6 bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Request Sent!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for your request. We have received it and will notify you via email once it's confirmed.
        </p>

        {!user ? (
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
            <h4 className="font-bold text-gray-900 mb-2">Want to track your booking?</h4>
            <p className="text-sm text-gray-500 mb-4">Create an account to manage your appointments, access career resources, and apply for jobs.</p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 bg-[#097969] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#076356] transition-all"
            >
              Create Account <ArrowRight size={18} />
            </Link>
          </div>
        ) : null}

        <button 
          onClick={() => setIsSuccess(false)}
          className="text-[#097969] font-semibold hover:underline text-sm"
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row ${className}`}>
      <div className="md:w-1/3 bg-[#097969] p-8 text-white flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Book a Counselling Session</h2>
        <p className="opacity-90 mb-6 text-sm">Need career guidance? Book a 1-on-1 session with our career experts.</p>
        <ul className="space-y-4 text-xs opacity-80">
          <li className="flex items-center gap-2">
            <CheckCircle size={14} /> CV & Cover Letter Review
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={14} /> Interview Preparation
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={14} /> Career Path Guidance
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={14} /> Internship Support
          </li>
        </ul>
      </div>
      
      <div className="md:w-2/3 p-8">
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none text-sm"
                placeholder="Your Name"
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none text-sm"
                placeholder="your@email.com"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none text-sm"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
              <input 
                required
                type="time" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none text-sm"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Session</label>
            <select 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none text-sm"
              value={bookingPurpose}
              onChange={(e) => setBookingPurpose(e.target.value)}
            >
              <option value="">Select a purpose</option>
              <option value="CV Review">CV & Cover Letter Review</option>
              <option value="Interview Prep">Interview Preparation</option>
              <option value="Career Path">Career Path Guidance</option>
              <option value="Internship">Internship/Job Search Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none text-sm"
              rows={3}
              placeholder="Tell us more about what you'd like to discuss..."
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
            ></textarea>
          </div>

          {bookingError && (
            <p className="text-red-600 text-xs bg-red-50 p-3 rounded border border-red-100">{bookingError}</p>
          )}

          <button 
            disabled={bookingMutation.isPending}
            type="submit" 
            className="w-full bg-[#097969] text-white py-3 rounded-md font-semibold hover:bg-[#076356] transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {bookingMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Submitting...
              </>
            ) : (
              "Submit Booking Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
