"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMockAuth } from "@/lib/auth";
import { ChevronDown } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
];

export default function Header() {
  const pathname = usePathname();
  const { role, isLoggedIn, setRole, logout } = useMockAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="w-full bg-[#097969] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center">
            <span className="text-[#097969] font-black text-xs leading-none">CASEC</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Career Services Centre</p>
            <p className="text-[#d1fae5] text-xs">OnlineUniversity, Nigeria</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-white/15 text-white font-semibold"
                  : "text-[#d1fae5] hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <Link
                href="/alumni"
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  isActive("/alumni")
                    ? "bg-white/15 text-white font-semibold"
                    : "text-[#d1fae5] hover:bg-white/10 hover:text-white"
                }`}
              >
                Alumni Connect
              </Link>
              {role === "admin" && (
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    isActive("/admin")
                      ? "bg-white/15 text-white font-semibold"
                      : "text-[#d1fae5] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Admin
                </Link>
              )}
              {role === "employer" && (
                <Link
                  href="/cv-builder"
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    isActive("/cv-builder")
                      ? "bg-white/15 text-white font-semibold"
                      : "text-[#d1fae5] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  RUN-LAS
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                className="flex items-center gap-2 rounded border border-white/20 bg-white/10 text-white text-sm px-4 py-2 outline-none hover:bg-white/20 focus:bg-white/20 focus:border-white transition-colors"
              >
                {(role ? role.charAt(0).toUpperCase() + role.slice(1) : "Account")}
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setRole("student");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Switch to Student
                  </button>
                  <button
                    onClick={() => {
                      setRole("employer");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Switch to Employer
                  </button>
                  <button
                    onClick={() => {
                      setRole("admin");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Switch to Admin
                  </button>
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded border border-white/20 bg-white/10 text-white text-sm px-4 py-2 outline-none hover:bg-white/20 focus:bg-white/20 focus:border-white transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
