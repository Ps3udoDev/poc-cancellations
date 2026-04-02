import { ChevronRight } from "lucide-react";
import { CancellationsPanel } from "@/components/cancellations-panel";

export default function AutomaticCancellationsPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 mb-6 font-medium">
        <span>Gestión Técnica</span>
        <ChevronRight className="size-3.5" />
        <span className="text-navy font-semibold">
          Cancelaciones Automáticas
        </span>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-extrabold text-navy tracking-tight mb-2">
          Panel de Cancelaciones
        </h1>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">
          Gestione el flujo de finalización de pólizas. Verifique registros
          pendientes, analice errores de procesamiento y confirme la ejecución
          masiva.
        </p>
      </div>

      <CancellationsPanel />
    </>
  );
}
