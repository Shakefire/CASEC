"use client";

import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorState({ 
  message = "Please check your internet connection or try refreshing the page.", 
  onRetry, 
  title = "Network Connection Error" 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] border border-red-50 shadow-sm animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <WifiOff size={40} />
      </div>
      
      <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm text-center font-medium leading-relaxed mb-8">
        {message}
      </p>

      {onRetry ? (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
        >
          <RefreshCw size={18} /> Try Again
        </button>
      ) : (
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <RefreshCw size={18} /> Refresh Page
        </button>
      )}

      <div className="mt-8 flex items-center gap-2 text-xs text-gray-300 font-bold uppercase tracking-widest">
         <AlertCircle size={12} /> Diagnostic: fetch_failure_detected
      </div>
    </div>
  );
}
