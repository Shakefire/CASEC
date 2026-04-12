interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

const config = {
  success: {
    className: "bg-emerald-50 text-emerald-900 border border-emerald-200",
    title: "Success",
  },
  error: {
    className: "bg-red-50 text-red-900 border border-red-200",
    title: "Error",
  },
};

export default function Toast({ message, type = "success", onClose }: ToastProps) {
  const toast = config[type];

  return (
    <div className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-xl p-4 shadow-lg ${toast.className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{message}</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-sm font-semibold">
          Close
        </button>
      </div>
    </div>
  );
}
