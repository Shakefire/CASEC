"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  UserPlus, 
  ArrowLeft, 
  Loader2, 
  GraduationCap, 
  Briefcase, 
  Mail, 
  Lock, 
  User, 
  Building2,
  CheckCircle2
} from "lucide-react";

type Role = "student" | "employer";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const displayName = role === "employer" ? companyName : `${firstName} ${lastName}`;
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            full_name: displayName,
            first_name: role === "student" ? firstName : null,
            last_name: role === "student" ? lastName : null,
            company_name: role === "employer" ? companyName : null,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Since email verification is disabled, data.session should be present immediately
      if (data.session) {
        // Create the profile row
        // Use upsert to handle cases where Auth user might already exist but profile doesn't
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user!.id,
          email: email,
          role: role,
          first_name: role === "student" ? firstName : null,
          last_name: role === "student" ? lastName : null,
          company_name: role === "employer" ? companyName : null,
        });
        
        if (profileError) {
          console.error("❌ PROFILE CREATION ERROR:", {
            message: profileError.message,
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint
          });
          // Still redirect as the auth record is valid
        }
        
        // 4. Trigger Welcome Email (Non-blocking)
        fetch("/api/emails/welcome", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: displayName,
            role: role
          })
        }).catch(err => console.error("Failed to send welcome email:", err));

        // 5. Notify Admin of New Employer (Non-blocking)
        if (role === 'employer') {
          fetch("/api/emails/admin-alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: "New Employer Registered",
              message: `A new company "${companyName}" has registered and is awaiting approval.`
            })
          }).catch(err => console.error("Failed to send admin alert:", err));
        }

        // Dashboard redirect
        router.push(`/${role}`);
        return;
      }

      // If session is null (e.g. if verification is still somehow on)
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#097969] via-[#065f52] to-[#034a3f] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-[#097969]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Created!</h1>
          <p className="text-gray-600 mb-8">
            Your account has been created successfully. You can now proceed to log in.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full bg-[#097969] text-white py-3 px-4 rounded-lg hover:bg-[#065f52] transition-all font-bold"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#097969] via-[#065f52] to-[#034a3f] flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full my-8 bg-white rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#097969] rounded-full mb-4 shadow-lg shadow-[#097969]/20">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join the CASEC Career Portal today</p>
        </div>

        {/* Role Selector */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button
            onClick={() => setRole("student")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === "student" 
                ? "bg-white text-[#097969] shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Student
          </button>
          <button
            onClick={() => setRole("employer")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === "employer" 
                ? "bg-white text-[#097969] shadow-sm" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            Employer
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {role === "employer" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">Must be at least 6 characters long.</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#097969] text-white py-3 rounded-lg hover:bg-[#065f52] focus:ring-2 focus:ring-[#097969] focus:ring-offset-2 disabled:opacity-50 transition-all font-bold text-lg shadow-lg hover:shadow-[#097969]/30 active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-[#097969] hover:text-[#065f52] font-bold transition-colors">
              Sign In
          </Link>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#097969] font-medium transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
