import { Lightbulb } from "lucide-react";
import { modules } from "@/data/modules";
import { ModuleCard } from "@/components/module-card";

export default async function LauncherPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const { module: moduleId } = await searchParams;
  const selectedId = moduleId ?? "cobranzas";
  const selectedModule = modules.find((m) => m.id === selectedId) ?? modules[1];

  return (
    <>
      {/* Content Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-heading font-extrabold tracking-tight text-navy mb-2">
          Módulo de {selectedModule.name}
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg">
          Seleccione un ejecutable para gestionar los procesos del módulo.
        </p>
      </header>

      {/* Executables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedModule.executables.map((exec) => (
          <ModuleCard key={exec.id} executable={exec} />
        ))}
      </div>

      {/* Contextual Tip */}
      <div className="mt-16 bg-navy/5 p-6 rounded-lg border border-navy/10 flex items-center gap-4">
        <Lightbulb className="size-5 text-navy shrink-0" />
        <p className="text-navy text-sm font-medium">
          Tip: Puedes usar{" "}
          <kbd className="bg-card px-2 py-0.5 rounded shadow-sm text-xs">
            Ctrl + K
          </kbd>{" "}
          para buscar ejecutables en otros módulos rápidamente.
        </p>
      </div>
    </>
  );
}
