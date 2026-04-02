"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import { modules } from "@/data/modules";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const searchParams = useSearchParams();
  const activeModuleId = searchParams.get("module") ?? "cobranzas";

  return (
    <aside className="w-64 bg-card flex flex-col shrink-0 border-r border-surface-highest/60">
      <div className="p-6">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">
          Módulos
        </p>
        <nav className="space-y-1">
          {modules.map((mod) => {
            const isActive = mod.id === activeModuleId;
            const Icon = mod.icon;

            return (
              <Link
                key={mod.id}
                href={`/launcher?module=${mod.id}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 font-heading font-semibold transition-colors rounded-r-none",
                  isActive
                    ? "sidebar-active"
                    : "text-on-surface-variant hover:bg-surface-low"
                )}
              >
                <Icon className="size-5" />
                <span>{mod.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-surface-highest/60">
        <div className="flex items-center gap-3 text-on-surface-variant text-xs">
          <Info className="size-3.5" />
          <span>v4.8.2-enterprise</span>
        </div>
      </div>
    </aside>
  );
}
