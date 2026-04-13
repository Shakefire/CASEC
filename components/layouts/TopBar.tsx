"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  userName?: string;
}

export default function TopBar({
  title,
  subtitle,
  onMenuClick,
  userName = "Administrator",
}: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded text-gray-500 hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-900 leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 leading-tight mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-1.5 rounded text-gray-500 hover:bg-gray-100">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-2 border-l border-gray-200 ml-1 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#1a2e4a] flex items-center justify-center text-white text-xs font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm text-gray-700 font-medium">{userName}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
