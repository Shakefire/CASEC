"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/ui/JobCard";
import EventCard from "@/components/ui/EventCard";
import { Users, Monitor, CheckCircle, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useOpportunities, useEvents } from "@/lib/hooks/useDashboard";
import BookingForm from "@/components/forms/BookingForm";

const features = [
  {
    icon: Users,
    title: "Skilled Instructors",
    desc: "Learn from experienced professionals dedicated to your career development.",
  },
  {
    icon: Monitor,
    title: "Webinar Sessions",
    desc: "Participate in interactive online workshops covering various career-related topics.",
  },
  {
    icon: CheckCircle,
    title: "Projects",
    desc: "Engage in practical assignments to build real-world skills.",
  },
  {
    icon: BookOpen,
    title: "Library",
    desc: "Access a curated collection of resources to support your career journey.",
  },
];

const testimonials = [
  {
    text: "CASEC helped me land my first internship. The career counselling sessions were very practical and tailored to my goals.",
    author: "Adebayo Olanrewaju",
    dept: "Computer Science, 2024",
    initials: "AO",
  },
  {
    text: "The CV workshop and mock interviews gave me the confidence I needed. I secured a graduate trainee role weeks after graduation.",
    author: "Chidinma Okoye",
    dept: "Business Administration, 2023",
    initials: "CO",
  },
  {
    text: "The career opportunities board on the CASEC website exposed me to scholarships I would never have found on my own.",
    author: "Emmanuel Adesola",
    dept: "Engineering, 2025",
    initials: "EA",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Queries using centralized hooks
  const { data: opportunities = [], isLoading: opportunitiesLoading } = useOpportunities("active", 5);
  const { data: events = [], isLoading: eventsLoading } = useEvents(false, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Carousel Animation */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        {/* Carousel Background */}
        <style>{`
          @keyframes heroSlide1 {
            0% { opacity: 1; }
            32% { opacity: 1; }
            34% { opacity: 0; }
            66% { opacity: 0; }
            100% { opacity: 0; }
          }
          
          @keyframes heroSlide2 {
            0% { opacity: 0; }
            32% { opacity: 0; }
            34% { opacity: 1; }
            66% { opacity: 1; }
            68% { opacity: 0; }
            100% { opacity: 0; }
          }
          
          @keyframes heroSlide3 {
            0% { opacity: 0; }
            66% { opacity: 0; }
            68% { opacity: 1; }
            100% { opacity: 1; }
          }
          
          @keyframes heroZoom {
            0%, 32% { transform: scale(1); }
            34%, 66% { transform: scale(1.05); }
            68%, 100% { transform: scale(1); }
          }
          
          @keyframes textContent1 {
            0% { opacity: 0; transform: translateY(20px); }
            5%, 30% { opacity: 1; transform: translateY(0); }
            33% { opacity: 0; transform: translateY(0); }
            100% { opacity: 0; }
          }
          
          @keyframes textContent2 {
            0%, 32% { opacity: 0; pointer-events: none; transform: translateY(20px); }
            37%, 62% { opacity: 1; pointer-events: auto; transform: translateY(0); }
            65% { opacity: 0; pointer-events: auto; transform: translateY(0); }
            100% { opacity: 0; pointer-events: none; }
          }
          
          @keyframes textContent3 {
            0%, 66% { opacity: 0; pointer-events: none; transform: translateY(20px); }
            71%, 97% { opacity: 1; pointer-events: auto; transform: translateY(0); }
            100% { opacity: 0; pointer-events: none; transform: translateY(0); }
          }
          
          .hero-slide-1 {
            animation: heroSlide1 18s infinite;
          }
          
          .hero-slide-2 {
            animation: heroSlide2 18s infinite;
          }
          
          .hero-slide-3 {
            animation: heroSlide3 18s infinite;
          }
        `}</style>
        
        {/* Slide 1 */}
        <div className="hero-slide-1 absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&q=80')" }}>
          <div className="absolute inset-0 bg-[#097969]/65"></div>
          <div className="relative h-full container mx-auto px-6 flex flex-col justify-center text-white" style={{ animation: "textContent1 18s infinite" }}>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] mb-2 md:mb-3 opacity-90 uppercase">Welcome to</p>
            <h1 className="text-3xl md:text-5xl font-black mb-1 leading-tight tracking-tight">Career Services Centre</h1>
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-5 opacity-95">University, Nigeria</h2>
            <p className="text-sm md:text-base mb-6 md:mb-8 max-w-2xl opacity-80 leading-relaxed">
              Welcome to the Career Services Centre University, Nigeria, your gateway to professional success. Whether you're exploring career options, searching for internships, or preparing for life after graduation, we are here to support you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/about" className="bg-white text-[#097969] px-7 py-2.5 rounded-md font-bold hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base">Read More</Link>
              <Link href="/jobs" className="border-2 border-white text-white px-7 py-2.5 rounded-md font-bold hover:bg-white/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm md:text-base">Career Opportunities</Link>
            </div>
          </div>
        </div>

        {/* Slide 2 */}
        <div className="hero-slide-2 absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=600&fit=crop&q=80')" }}>
          <div className="absolute inset-0 bg-[#097969]/70"></div>
          <div className="relative h-full container mx-auto px-6 flex flex-col justify-center text-white" style={{ animation: "textContent2 18s infinite" }}>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] mb-2 md:mb-3 opacity-90 uppercase">Get Prepared</p>
            <h1 className="text-3xl md:text-5xl font-black mb-1 leading-tight tracking-tight">Build Your Skills &</h1>
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-5 opacity-95">Land Your Dream Job</h2>
            <p className="text-sm md:text-base mb-6 md:mb-8 max-w-2xl opacity-80 leading-relaxed">
              Access workshops, webinars, and CV guidance. Prepare for interviews with expert coaching and career counselling from industry professionals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/resources" className="bg-white text-[#097969] px-7 py-2.5 rounded-md font-bold hover:bg-gray-100 transition-all shadow-lg text-sm md:text-base">Explore Resources</Link>
              <Link href="/about" className="border-2 border-white text-white px-7 py-2.5 rounded-md font-bold hover:bg-white/10 transition-all text-sm md:text-base">Learn More</Link>
            </div>
          </div>
        </div>

        {/* Slide 3 */}
        <div className="hero-slide-3 absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=600&fit=crop&q=80')" }}>
          <div className="absolute inset-0 bg-[#097969]/65"></div>
          <div className="relative h-full container mx-auto px-6 flex flex-col justify-center text-white" style={{ animation: "textContent3 18s infinite" }}>
            <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] mb-2 md:mb-3 opacity-90 uppercase">Find Your Path</p>
            <h1 className="text-3xl md:text-5xl font-black mb-1 leading-tight tracking-tight">Internships &</h1>
            <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-5 opacity-95">Working Opportunities</h2>
            <p className="text-sm md:text-base mb-6 md:mb-8 max-w-2xl opacity-80 leading-relaxed">
              Explore career opportunities tailored to your skills and aspirations. Access scholarships, internships, and job placements from top employers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/jobs" className="bg-white text-[#097969] px-7 py-2.5 rounded-md font-bold hover:bg-gray-100 transition-all shadow-lg text-sm md:text-base">Browse Opportunities</Link>
              <Link href="/events" className="border-2 border-white text-white px-7 py-2.5 rounded-md font-bold hover:bg-white/10 transition-all text-sm md:text-base">Upcoming Events</Link>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-white opacity-100 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
          <div className="w-2 h-2 rounded-full bg-white opacity-40"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[#097969] font-bold tracking-[0.2em] text-xs mb-4 uppercase">Our Services</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a2e4a] mb-6">Our Features</h2>
            <div className="w-24 h-1.5 bg-[#097969] mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-10">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 text-center group hover:-translate-y-2">
                <div className="w-20 h-20 bg-[#097969]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-[#097969] transition-colors">
                  <f.icon className="text-[#097969] group-hover:text-white transition-colors" size={40} />
                </div>
                <h3 className="text-2xl font-black text-[#1a2e4a] mb-4">{f.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About CASEC Section - What We Offer */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Image Side */}
            <div className="lg:w-1/2 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3]">
                <img 
                  src="/images/hero-bg.jpg" 
                  alt="CASEC Building" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#097969]/40 flex flex-col items-center justify-center text-white p-8 text-center">
                  <h3 className="text-6xl font-black mb-2 tracking-tighter">CASEC</h3>
                  <p className="text-lg font-bold opacity-90 leading-tight">Career Services Centre University, Nigeria</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#097969]/10 rounded-full -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#097969]/10 rounded-full -z-10"></div>
            </div>

            {/* Content Side */}
            <div className="lg:w-1/2 space-y-8">
              <div>
                <p className="text-[#097969] font-bold tracking-[0.2em] text-xs mb-4 uppercase">About CASEC</p>
                <h2 className="text-4xl md:text-5xl font-black text-[#1a2e4a] leading-tight mb-6">
                  Welcome to Career Services Centre University, Nigeria
                </h2>
              </div>

              <div className="space-y-8">
                <div className="relative pl-6 border-l-4 border-[#097969]">
                  <h3 className="text-xl font-black text-[#1a2e4a] mb-3">Vision</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To empower students to discover and achieve their professional aspirations by providing comprehensive career development support and facilitating successful transitions into the workforce.
                  </p>
                </div>

                <div className="relative pl-6 border-l-4 border-[#097969]">
                  <h3 className="text-xl font-black text-[#1a2e4a] mb-3">Mission</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    To offer personalized career guidance, connect students with employers, and enhance students' employability through skill development, networking opportunities and resources that foster professional growth.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-2 bg-[#097969] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#076356] transition-all shadow-lg hover:-translate-y-1"
                >
                  Read More <span className="text-xl">›</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#097969] font-bold tracking-[0.2em] text-xs mb-4 uppercase">Opportunities</p>
              <h2 className="text-4xl font-black text-[#1a2e4a]">Career Opportunities</h2>
            </div>
            <Link href="/jobs" className="text-[#097969] font-bold text-sm hover:underline flex items-center gap-1">
              View All Opportunities <span className="text-lg">›</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            {opportunitiesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-[#097969]" size={32} />
              </div>
            ) : opportunities.length > 0 ? (
              opportunities.map((opp) => (
                <JobCard key={opp.id} opportunity={opp} />
              ))
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <p className="text-gray-400 font-medium">No active opportunities found at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-gray-50/30">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#097969] font-bold tracking-[0.2em] text-xs mb-4 uppercase">What's On</p>
              <h2 className="text-4xl font-black text-[#1a2e4a]">Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-[#097969] font-bold text-sm hover:underline flex items-center gap-1">
              View All Events <span className="text-lg">›</span>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {eventsLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="animate-spin text-[#097969]" size={32} />
              </div>
            ) : events.length > 0 ? (
              events.map((evt) => (
                <EventCard key={evt.id} event={evt} />
              ))
            ) : (
              <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <p className="text-gray-400 font-medium">No upcoming events scheduled.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#097969] text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-white/80 font-bold tracking-[0.2em] text-xs mb-4 uppercase">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">What Our Students Say</h2>
            <div className="w-24 h-1.5 bg-white/30 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl flex flex-col h-full shadow-2xl relative group transition-all hover:-translate-y-2 duration-500">
                {/* Quote Icon */}
                <div className="absolute -top-5 -left-5 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.437.917-4.012 3.638-4.012 5.849h4v10h-9.984z" />
                  </svg>
                </div>

                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-emerald-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-10 flex-grow italic font-medium">
                  "{t.text}"
                </p>
                
                <div className="flex items-center gap-4 pt-8 border-t border-gray-100 mt-auto">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-black text-[#1a2e4a] text-lg leading-tight">{t.author}</h4>
                    <p className="text-[#097969] text-sm font-bold mt-1 uppercase tracking-wider">{t.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-24 bg-gray-50/50 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#097969] font-bold tracking-[0.2em] text-xs mb-4 uppercase">Appointment Booking</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1a2e4a]">Schedule a Session</h2>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <BookingForm className="min-h-[600px] shadow-2xl" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
