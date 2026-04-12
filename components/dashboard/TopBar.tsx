import { Bell, ChevronDown, Menu } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  userName?: string;
}

export default function TopBar({ title, subtitle, onMenuClick, userName = "Administrator" }: TopBarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded text-slate-500 hover:bg-slate-100">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-slate-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 leading-tight mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-1.5 rounded text-slate-500 hover:bg-slate-100">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 ml-1">
          <div className="w-7 h-7 rounded-full bg-[#1a2e4a] flex items-center justify-center text-white text-xs font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm text-slate-700 font-medium">{userName}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
