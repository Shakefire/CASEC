"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ChevronDown, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Jobs", href: "/jobs" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Alumni Connect", href: "/alumni" },
  { label: "RUN-LAS", href: "/cv-builder" },
];

export default function Header() {
  const pathname = usePathname();
  const { role, user, signOut } = useAuth();
  const isLoggedIn = !!user;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <p className="text-[#d1fae5] text-xs">University, Nigeria</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden md:flex items-center gap-1">
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
            {isLoggedIn && role === "admin" && (
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
          </div>
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
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Logged in as</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                  </div>
                  
                  {role === 'admin' && (
                    <Link href="/admin" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Admin Dashboard
                    </Link>
                  )}
                  {role === 'employer' && (
                    <Link href="/employer" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      Employer Dashboard
                    </Link>
                  )}
                  {role === 'student' && (
                    <Link href="/student" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      My Profile
                    </Link>
                  )}

                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      signOut();
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

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b5f4f] border-t border-white/10">
          <nav className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded px-3 py-2 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-white/15 text-white font-semibold"
                    : "text-[#d1fae5] hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded px-3 py-2 text-sm transition-colors ${
                  isActive("/admin")
                    ? "bg-white/15 text-white font-semibold"
                    : "text-[#d1fae5] hover:bg-white/10 hover:text-white"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
