"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ListChecks,
  HelpCircle,
  BookOpen,
  Info,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Modificación de la Selección",
    icon: ListChecks,
    href: "/automatic-cancellations",
  },
  {
    label: "Procesos",
    icon: Zap,
    href: "/automatic-cancellations/processes",
  },
];

const bottomLinks = [
  { label: "Soporte", icon: HelpCircle, href: "#" },
  { label: "Documentación", icon: BookOpen, href: "#" },
];

export function CancellationsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-low flex flex-col shrink-0">
      <div className="px-6 pt-6 mb-4">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-4">
          Menú de Gestión
        </p>
      </div>

      <nav className="flex flex-col gap-1 pr-4">
        {menuItems.map((item) => {
          const isActive = item.href !== "#" && pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-card text-navy shadow-sm rounded-r-full"
                  : "text-on-surface-variant hover:bg-surface-high/50 hover:pl-8"
              )}
            >
              <Icon className={cn("size-5", isActive && "text-navy")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6 pt-6 pb-6 border-t border-surface-high/50">
        {bottomLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 py-2 text-on-surface-variant hover:text-navy transition-colors text-xs font-medium"
            >
              <Icon className="size-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <div className="flex items-center gap-3 text-on-surface-variant text-xs mt-3 pt-3 border-t border-surface-high/50">
          <Info className="size-3.5" />
          <span>v4.8.2-enterprise</span>
        </div>
      </div>
    </aside>
  );
}
