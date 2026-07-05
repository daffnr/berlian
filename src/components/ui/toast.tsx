"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info";
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<Toast, "id">) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, type, duration = 4000 }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-slide-in backdrop-blur-md ${
              t.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-900 dark:bg-emerald-950/95 dark:border-emerald-800 dark:text-emerald-100"
                : t.type === "error"
                ? "bg-rose-50/95 border-rose-200 text-rose-900 dark:bg-rose-950/95 dark:border-rose-800 dark:text-rose-100"
                : "bg-blue-50/95 border-blue-200 text-blue-900 dark:bg-blue-950/95 dark:border-blue-800 dark:text-blue-100"
            }`}
          >
            <div className="mt-0.5">
              {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
              {t.type === "error" && <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
              {t.type === "info" && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold">{t.title}</h4>
              {t.description && <p className="text-xs mt-1 opacity-90">{t.description}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5"
            >
              <X className="h-4 w-4" />
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
