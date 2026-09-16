import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

export interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  addToast: (options: ToastOptions | string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const addToast = useCallback((options: ToastOptions | string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    if (typeof options === "string") {
      setToasts(prev => [...prev, { id, message: options, type }]);
    } else {
      setToasts(prev => [...prev, { id, title: options.title, message: options.message, type: options.type || "success" }]);
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: <CheckCircle2 size={16} className="text-[#16A34A] flex-shrink-0" />,
    error: <AlertCircle size={16} className="text-[#DC2626] flex-shrink-0" />,
    warning: <AlertTriangle size={16} className="text-[#D97706] flex-shrink-0" />,
    info: <Info size={16} className="text-[#2563EB] flex-shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-white shadow-lg",
    error: "border-red-200 bg-white shadow-lg",
    warning: "border-amber-200 bg-white shadow-lg",
    info: "border-blue-200 bg-white shadow-lg",
  };

  return (
    <ToastContext.Provider value={{ showToast, addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border text-[13px] font-medium text-[#111827] shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200 ${borders[toast.type]}`}
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="mt-0.5">{icons[toast.type]}</div>
              <div className="min-w-0">
                {toast.title && <div className="font-semibold text-[#111827] text-xs">{toast.title}</div>}
                <div className="text-[#4B5563] text-xs leading-relaxed">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors p-0.5 rounded-lg ml-2 flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
