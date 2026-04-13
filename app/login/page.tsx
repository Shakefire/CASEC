"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, ArrowLeft, LogIn, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // Start "Verifying" animation phase
      setIsVerifying(true);
      
      // Artificial delay for UX "verification" feel (optional)
      await new Promise(resolve => setTimeout(resolve, 800));

      const role = data.user?.user_metadata?.role;

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "employer") {
        router.push("/employer");
      } else {
        router.push("/student");
      }
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
      setIsLoading(false);
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#097969] via-[#065f52] to-[#034a3f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Verification Overlay */}
      {isVerifying && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#097969]/90 backdrop-blur-sm transition-all duration-500 animate-in fade-in">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-white/20 border-t-white animate-spin" />
            <ShieldCheck className="absolute inset-0 m-auto h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-white tracking-wide">Verifying Identity</h2>
          <p className="mt-2 text-[#a8e6cf] animate-pulse">Securing your session...</p>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 relative z-10 transition-transform duration-500">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#097969] rounded-full mb-4 shadow-lg shadow-[#097969]/20">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CASEC account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all disabled:opacity-50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#097969] focus:border-[#097969] outline-none transition-all disabled:opacity-50"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center group cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-[#097969] focus:ring-[#097969] cursor-pointer" />
              <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-[#097969] hover:text-[#065f52] font-semibold transition-colors">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 animate-shake">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full bg-[#097969] text-white py-3 px-4 rounded-lg hover:bg-[#065f52] focus:ring-2 focus:ring-[#097969] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg hover:shadow-[#097969]/30 active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </span>
            ) : (
              "Secure Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#097969] hover:text-[#065f52] font-bold transition-colors">
              Join CASEC
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#097969] transition-all font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}