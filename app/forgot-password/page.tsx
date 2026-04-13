"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  KeyRound, 
  ArrowLeft, 
  Loader2, 
  Mail, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Could not send reset link. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#097969] via-[#065f52] to-[#034a3f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative z-10">
        {!isSuccess ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#097969] rounded-full mb-4 shadow-lg shadow-[#097969]/20">
                <KeyRound className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-600">Enter your email and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleResetRequest} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 font-medium animate-in fade-in zoom-in duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#097969] text-white py-3 px-4 rounded-lg hover:bg-[#065f52] focus:ring-2 focus:ring-[#097969] focus:ring-offset-2 disabled:opacity-50 transition-all font-bold text-lg shadow-lg hover:shadow-[#097969]/30 active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-[#097969]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
            <p className="text-gray-600 mb-8">
              We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
              Please follow the instructions in the email to secure your account.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-[#097969] hover:text-[#065f52] font-bold text-sm transition-colors"
            >
              Didn't receive email? Try again
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#097969] font-medium transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
