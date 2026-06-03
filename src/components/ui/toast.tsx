"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  title?: string;
  description: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: { title?: string; description: string; type?: ToastType }) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, type = "info" }: { title?: string; description: string; type?: ToastType }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      {/* Toast Portals */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg pointer-events-auto transition-all transform duration-300 bg-card ${
              t.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-900/50"
                : t.type === "error"
                ? "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200 border-red-200 dark:border-red-900/50"
                : t.type === "warning"
                ? "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900/50"
                : "bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-900/50"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
              {t.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
              {t.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {t.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              {t.title && <h5 className="font-semibold text-sm leading-none mb-1">{t.title}</h5>}
              <p className="text-xs opacity-90">{t.description}</p>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-current opacity-70 hover:opacity-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
