"use client";

import Link from "next/link";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-slate-100">
          <div className="mx-auto w-16 h-16 bg-[#e6f4ea] rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-[#097969]" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Received!</h1>
          <p className="text-sm text-slate-600 mb-6">
            Your career counselling session request is currently <span className="font-semibold text-yellow-600">pending approval</span>. 
            We've sent a confirmation email with your request details.
          </p>

          <div className="bg-slate-50 rounded-lg p-4 mb-8 border border-slate-200 flex items-center gap-4 text-left">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <Calendar className="w-5 h-5 text-[#097969]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">What happens next?</p>
              <p className="text-sm text-slate-700">You will receive another email as soon as an admin reviews and approves your slot.</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/register"
              className="w-full flex items-center justify-center gap-2 bg-[#097969] hover:bg-[#065f52] text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors"
            >
              Create Account to Track Booking
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link 
              href="/"
              className="w-full block bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-3 px-4 rounded-lg text-sm font-semibold transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
          
          <p className="mt-6 text-xs text-slate-500">
            Already have an account? <Link href="/login" className="text-[#097969] hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
