import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Executable } from "@/data/modules";

export function ModuleCard({ executable }: { executable: Executable }) {
  const Icon = executable.icon;

  return (
    <Link
      href={executable.href}
      className="group flex flex-col items-start p-8 bg-card rounded-lg hover:shadow-lg transition-all duration-300 text-left border border-outline-variant/10 hover:border-teal/40"
    >
      <div className="size-12 rounded-lg bg-surface-low flex items-center justify-center mb-6 group-hover:bg-teal/10 transition-colors">
        <Icon className="size-5 text-navy group-hover:text-teal transition-colors" />
      </div>

      <h3 className="font-heading font-bold text-xl text-navy mb-2">
        {executable.name}
      </h3>
      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
        {executable.description}
      </p>

      <div className="mt-auto flex items-center text-teal text-sm font-bold uppercase tracking-wider">
        <span>{executable.action}</span>
        <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
