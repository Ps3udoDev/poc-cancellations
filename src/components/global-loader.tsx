"use client";

import { useUIStore } from "@/stores/ui-store";
import { Loader2, CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const notificationStyles = {
  success: { icon: CheckCircle2, bg: "bg-green-50 border-green-200", text: "text-green-800", iconColor: "text-green-600" },
  error: { icon: AlertCircle, bg: "bg-red-50 border-red-200", text: "text-red-800", iconColor: "text-red-600" },
  info: { icon: Info, bg: "bg-blue-50 border-blue-200", text: "text-blue-800", iconColor: "text-blue-600" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50 border-amber-200", text: "text-amber-800", iconColor: "text-amber-600" },
};

export function GlobalLoader() {
  const { isLoading, loadingMessage, notifications, dismissNotification } =
    useUIStore();

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-sm">
          <div className="bg-card rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[280px] border border-outline-variant/10">
            <div className="relative">
              <div className="size-12 rounded-full bg-teal/10 flex items-center justify-center">
                <Loader2 className="size-6 text-teal-dark animate-spin" />
              </div>
            </div>
            <p className="text-sm font-medium text-navy text-center">
              {loadingMessage}
            </p>
            <div className="flex gap-1">
              <span className="size-1.5 rounded-full bg-teal-dark animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 rounded-full bg-teal-dark animate-bounce [animation-delay:150ms]" />
              <span className="size-1.5 rounded-full bg-teal-dark animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-6 z-[90] flex flex-col gap-3 w-96">
          {notifications.map((n) => {
            const style = notificationStyles[n.type];
            const Icon = style.icon;
            return (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-right duration-300",
                  style.bg
                )}
              >
                <Icon className={cn("size-5 shrink-0 mt-0.5", style.iconColor)} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold", style.text)}>
                    {n.title}
                  </p>
                  {n.message && (
                    <p className={cn("text-xs mt-0.5 opacity-80", style.text)}>
                      {n.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismissNotification(n.id)}
                  className={cn("shrink-0 opacity-50 hover:opacity-100 cursor-pointer", style.text)}
                >
                  <X className="size-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
