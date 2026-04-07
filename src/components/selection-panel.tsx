"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Filter,
  Search,
  X,
  Building2,
  Map,
  Briefcase,
  Layers,
  FileText,
  User,
  Users,
} from "lucide-react";
import {
  regions,
  branches,
  linesOfBusiness,
  subLines,
  concepts,
} from "@/data/selection";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

// Helper components for lists with Checkbox
function CheckboxList({
  title,
  items,
  selected,
  onChange,
  icon: Icon,
}: {
  title: string;
  items: { id: string; name: string }[];
  selected: Set<string>;
  onChange: (selected: Set<string>) => void;
  icon?: React.ElementType;
}) {
  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      onChange(new Set());
    } else {
      onChange(new Set(items.map((i) => i.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  }

  return (
    <div className="bg-surface-low rounded-xl border border-surface-high overflow-hidden flex flex-col">
      <div className="p-4 border-b border-surface-high flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-on-surface-variant" />}
          <h4 className="font-bold text-sm text-navy">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">
            Todas
          </span>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected;
            }}
            onChange={toggleAll}
            className="size-4 rounded border-outline-variant text-teal-dark focus:ring-teal/30 cursor-pointer"
          />
        </div>
      </div>
      <div className="p-2 max-h-[220px] overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center justify-between p-2.5 hover:bg-surface-high/50 rounded-lg cursor-pointer transition-colors"
          >
            <span className="text-sm font-medium text-on-surface shrink-0">
              {item.name}
            </span>
            <input
              type="checkbox"
              checked={selected.has(item.id)}
              onChange={() => toggleOne(item.id)}
              className="size-4 rounded border-outline-variant text-teal-dark focus:ring-teal/30 cursor-pointer shrink-0"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export function SelectionPanel() {
  const router = useRouter();
  const { showLoader, hideLoader, notify } = useUIStore();

  const [processId] = useState(
    `#PRC-NEW-${Math.floor(9000 + Math.random() * 1000)}`
  );

  // Column 1
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set());
  const [selectedBranches, setSelectedBranches] = useState<Set<string>>(new Set());
  const [cutoffDate, setCutoffDate] = useState("");

  // Column 2
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedSubLines, setSelectedSubLines] = useState<Set<string>>(new Set());
  const [selectedConcepts, setSelectedConcepts] = useState<Set<string>>(new Set());

  // Filters
  const [insured, setInsured] = useState("");
  const [agent, setAgent] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleAccept() {
    if (!cutoffDate || !selectedLine || selectedSubLines.size === 0) {
      notify("warning", "Selección Incompleta", "Debe seleccionar Fecha de Corte, Línea de Negocio y al menos un Ramo.");
      return;
    }
    setIsModalOpen(true);
  }

  function handleConfirmGenerate() {
    setIsModalOpen(false);
    showLoader("Generando proceso de selección...");
    
    setTimeout(() => {
      hideLoader();
      notify("success", "Proceso Generado", `El proceso ${processId} se ha generado correctamente.`);
      router.push(`/automatic-cancellations?processId=${encodeURIComponent(processId)}&action=generated`);
    }, 1800);
  }

  return (
    <>
      <div className="bg-card rounded-xl shadow-ambient p-6 lg:p-8">
        <header className="mb-8 border-b border-surface-high pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-extrabold text-navy">
              Parámetros de Selección
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Configure los filtros para determinar qué pólizas entrarán en este proceso de cancelación.
            </p>
          </div>
          <div className="bg-surface-low px-5 py-3 rounded-xl border border-surface-high flex flex-col items-end">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              ID Proceso
            </span>
            <span className="text-lg font-heading font-bold text-teal-dark mt-0.5">
              {processId}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Column 1 */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-surface-high pb-2">
              <Map className="size-4 text-teal" /> Territorialidad
            </h3>
            
            <CheckboxList
              title="Regiones"
              icon={Map}
              items={regions}
              selected={selectedRegions}
              onChange={setSelectedRegions}
            />

            <CheckboxList
              title="Sucursales"
              icon={Building2}
              items={branches}
              selected={selectedBranches}
              onChange={setSelectedBranches}
            />

            <div className="pt-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Fecha de Corte
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
                <input
                  type="date"
                  value={cutoffDate}
                  onChange={(e) => setCutoffDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-low border-none rounded-xl focus:ring-2 focus:ring-teal/30 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-surface-high pb-2">
              <Layers className="size-4 text-teal" /> Clasificación Técnica
            </h3>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Línea de Negocio
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
                <select
                  value={selectedLine}
                  onChange={(e) => setSelectedLine(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-low border-none rounded-xl focus:ring-2 focus:ring-teal/30 text-sm font-medium appearance-none"
                >
                  <option value="">Seleccione línea de negocio...</option>
                  {linesOfBusiness.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <CheckboxList
              title="Ramos"
              icon={Layers}
              items={subLines}
              selected={selectedSubLines}
              onChange={setSelectedSubLines}
            />

            <CheckboxList
              title="Conceptos"
              icon={FileText}
              items={concepts}
              selected={selectedConcepts}
              onChange={setSelectedConcepts}
            />
          </div>
        </div>

        {/* Filters Below Columns */}
        <div className="mt-10 pt-8 border-t border-surface-high">
          <h3 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2 mb-6">
            <Filter className="size-4 text-teal" /> Filtros Adicionales (Opcional)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Asegurado
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  value={insured}
                  onChange={(e) => setInsured(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-low border-none rounded-xl focus:ring-2 focus:ring-teal/30 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Agente
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o Clave..."
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-low border-none rounded-xl focus:ring-2 focus:ring-teal/30 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={handleAccept}
            className="px-8 py-3.5 premium-gradient text-white font-bold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all text-sm flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="size-5" />
            Generar Selección de Pólizas
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-ambient overflow-hidden flex flex-col">
            <div className="p-6 border-b border-surface-high flex justify-between items-center bg-surface-low/30">
              <h3 className="font-heading font-extrabold text-lg text-navy flex items-center gap-2">
                <AlertCircleIcon className="size-5 text-teal" />
                Confirmar Parámetros
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-surface-high rounded-full transition-colors text-on-surface-variant cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-sm text-on-surface-variant">
                Está a punto de generar el proceso <strong>{processId}</strong> con los siguientes parámetros. 
                El sistema aplicará los días de gracia correspondientes a los ramos seleccionados.
              </p>

              <div className="bg-surface-low rounded-xl p-4 border border-surface-high space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-on-surface-variant">Regiones ({selectedRegions.size})</span>
                  <span className="font-bold text-navy">{selectedRegions.size === regions.length ? 'Todas' : 'Parcial'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-on-surface-variant">Sucursales ({selectedBranches.size})</span>
                  <span className="font-bold text-navy">{selectedBranches.size === branches.length ? 'Todas' : 'Parcial'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-on-surface-variant">Línea de Negocio</span>
                  <span className="font-bold text-navy">{linesOfBusiness.find(l => l.id === selectedLine)?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-on-surface-variant">Ramos Seleccionados</span>
                  <span className="font-bold text-teal-dark">{selectedSubLines.size}</span>
                </div>
                <div className="h-px bg-surface-high w-full my-1"></div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="font-medium text-on-surface-variant">Días de gracia calculados</span>
                  <span className="font-bold text-amber-600">En base al Ramo</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-surface-high bg-surface-low/30 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:text-navy hover:bg-surface-high rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmGenerate}
                className="px-6 py-2.5 premium-gradient text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                Confirmar y Generar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
