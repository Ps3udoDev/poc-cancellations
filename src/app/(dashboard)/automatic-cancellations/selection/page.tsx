import { ChevronRight } from "lucide-react";
import { SelectionPanel } from "@/components/selection-panel";

export default function SelectionPage() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant/60 mb-6 font-medium">
        <span>Gestión Técnica</span>
        <ChevronRight className="size-3.5" />
        <span>Cancelaciones Automáticas</span>
        <ChevronRight className="size-3.5" />
        <span className="text-navy font-semibold">Selección de Pólizas</span>
      </div>

      <SelectionPanel />
    </>
  );
}
