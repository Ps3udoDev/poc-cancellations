"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { CircleUser, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const isCancellations = pathname.startsWith("/automatic-cancellations");
  const isLauncher = pathname.startsWith("/launcher");

  return (
    <header className="bg-card/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full shrink-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <Link
          href="/launcher"
          className="text-xl font-bold text-navy tracking-tighter font-heading"
        >
          Aseguradora XYZ
        </Link>

        {isCancellations && (
          <>
            <div className="h-6 w-px bg-outline-variant/30" />
            <span className="font-heading font-semibold tracking-tight text-navy">
              Cancelaciones Automáticas
            </span>
          </>
        )}

        {isLauncher && (
          <nav className="hidden md:flex gap-6 items-center h-full">
            <Link
              href="/launcher"
              className="font-heading font-semibold tracking-tight text-navy border-b-2 border-teal pb-1"
            >
              Lanzador
            </Link>
            <button
              type="button"
              className="font-heading font-semibold tracking-tight text-on-surface-variant hover:text-navy transition-colors cursor-pointer"
            >
              Ayuda
            </button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right mr-2">
          <p className="text-xs font-bold text-navy tracking-tight">
            Juan Pérez
          </p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
            Administrador
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-surface-high flex items-center justify-center hover:bg-surface-highest transition-all cursor-pointer">
          <CircleUser className="size-5 text-navy" />
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-on-surface-variant hover:text-destructive transition-colors flex items-center gap-2 font-heading font-semibold text-sm cursor-pointer"
        >
          <span>Cerrar Sesión</span>
          <LogOut className="size-4" />
        </button>
      </div>
    </header>
  );
}
