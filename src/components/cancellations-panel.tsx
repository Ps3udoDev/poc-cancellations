"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ListChecks,
  ShieldAlert,
  AlertCircle,
  ShieldCheck,
  FileWarning,
  Download,
  ArrowRight,
  CheckCircle2,
  FileSearch,
} from "lucide-react";
import {
  policyRecords,
  months,
  errorReasons,
  inconsistencyReasons,
  type PolicyRecord,
} from "@/data/cancellations";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

// ── Stage types ──────────────────────────────────────────────
type TabId =
  | "seleccion"
  | "cancelacion_previa"
  | "errores"
  | "cancelacion_definitiva"
  | "inconsistentes";

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: TabDef[] = [
  { id: "seleccion", label: "Selección", icon: ListChecks },
  { id: "cancelacion_previa", label: "Cancelación Previa", icon: ShieldAlert },
  { id: "errores", label: "Errores", icon: AlertCircle },
  { id: "cancelacion_definitiva", label: "Cancelación Definitiva", icon: ShieldCheck },
  { id: "inconsistentes", label: "Pólizas Inconsistentes", icon: FileWarning },
];

// ── Helpers ──────────────────────────────────────────────────
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProcessId() {
  return `#PRC-${Math.floor(9000 + Math.random() * 1000)}`;
}

// ── Sub-components ───────────────────────────────────────────
function EmptyTabState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="size-14 rounded-xl bg-surface-low flex items-center justify-center mb-4">
        <FileSearch className="size-6 text-navy/25" />
      </div>
      <p className="text-on-surface-variant/60 text-sm text-center max-w-md">
        {message}
      </p>
    </div>
  );
}

function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="size-16 rounded-xl bg-surface-low flex items-center justify-center mb-5">
        <FileSearch className="size-7 text-navy/30" />
      </div>
      <p className="text-on-surface-variant text-sm font-medium mb-1">
        No hay registros cargados
      </p>
      <p className="text-on-surface-variant/60 text-xs max-w-sm text-center">
        Utilice los filtros superiores y presione &quot;Buscar registros&quot;
        para consultar las pólizas del periodo seleccionado.
      </p>
    </div>
  );
}

const TH_CLASS =
  "px-6 py-4 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-widest";

// ── Main component ───────────────────────────────────────────
export function CancellationsPanel() {
  const { showLoader, hideLoader, notify } = useUIStore();

  // Search state
  const [selectedMonth, setSelectedMonth] = useState("Febrero 2024");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Tab
  const [activeTab, setActiveTab] = useState<TabId>("seleccion");

  // Records per stage
  const [seleccion, setSeleccion] = useState<PolicyRecord[]>([]);
  const [previa, setPrevia] = useState<PolicyRecord[]>([]);
  const [errores, setErrores] = useState<PolicyRecord[]>([]);
  const [definitiva, setDefinitiva] = useState<PolicyRecord[]>([]);
  const [inconsistentes, setInconsistentes] = useState<PolicyRecord[]>([]);

  // Selection checkboxes (ids selected in "seleccion" tab)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Observations textarea
  const [observations, setObservations] = useState("");

  // ── Badge counts ──
  const badgeCounts: Partial<Record<TabId, number>> = useMemo(
    () => ({
      cancelacion_previa: previa.length || undefined,
      errores: errores.length || undefined,
      cancelacion_definitiva: definitiva.length || undefined,
      inconsistentes: inconsistentes.length || undefined,
    }),
    [previa.length, errores.length, definitiva.length, inconsistentes.length]
  );

  // ── Search handler ──
  function handleSearch() {
    showLoader("Consultando pólizas del periodo...");
    setTimeout(() => {
      // Reset all stages
      const filtered = searchQuery
        ? policyRecords.filter(
            (r) =>
              r.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.id.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : policyRecords;

      setSeleccion(filtered);
      setPrevia([]);
      setErrores([]);
      setDefinitiva([]);
      setInconsistentes([]);
      setSelectedIds(new Set());
      setHasSearched(true);
      setActiveTab("seleccion");
      hideLoader();
      notify(
        "success",
        "Consulta completada",
        `Se encontraron ${filtered.length} pólizas para ${selectedMonth}`
      );
    }, 1800);
  }

  // ── Checkbox helpers ──
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === seleccion.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(seleccion.map((r) => r.id)));
    }
  }

  // ── Flow: Selección → Cancelación Previa ──
  function handleMoveToPrevia() {
    if (selectedIds.size === 0) return;
    showLoader("Procesando selección...");

    setTimeout(() => {
      const selected = seleccion.filter((r) => selectedIds.has(r.id));
      const remaining = seleccion.filter((r) => !selectedIds.has(r.id));

      setSeleccion(remaining);
      setPrevia((prev) => [...prev, ...selected]);
      setSelectedIds(new Set());
      setActiveTab("cancelacion_previa");
      hideLoader();
      notify(
        "success",
        "Selección procesada",
        `${selected.length} pólizas movidas a Cancelación Previa`
      );
    }, 1400);
  }

  // ── Flow: Cancelación Previa → Definitiva (con errores random) ──
  function handleProcessPrevia() {
    if (previa.length === 0) return;
    showLoader("Ejecutando cancelación previa...");

    setTimeout(() => {
      const newDefinitiva: PolicyRecord[] = [];
      const newErrores: PolicyRecord[] = [];
      const newInconsistentes: PolicyRecord[] = [];

      for (const record of previa) {
        const roll = Math.random();
        if (roll < 0.2) {
          // ~20% error
          newErrores.push({
            ...record,
            errorReason: pickRandom(errorReasons),
          });
        } else if (roll < 0.3) {
          // ~10% inconsistente
          newInconsistentes.push({
            ...record,
            inconsistencyReason: pickRandom(inconsistencyReasons),
          });
        } else {
          // ~70% éxito
          newDefinitiva.push(record);
        }
      }

      setPrevia([]);
      setDefinitiva((prev) => [...prev, ...newDefinitiva]);
      setErrores((prev) => [...prev, ...newErrores]);
      setInconsistentes((prev) => [...prev, ...newInconsistentes]);

      hideLoader();

      if (newErrores.length > 0 || newInconsistentes.length > 0) {
        notify(
          "warning",
          "Procesamiento completado con observaciones",
          `${newDefinitiva.length} exitosas · ${newErrores.length} errores · ${newInconsistentes.length} inconsistentes`
        );
      } else {
        notify(
          "success",
          "Cancelación previa completada",
          `${newDefinitiva.length} pólizas procesadas exitosamente`
        );
      }

      setActiveTab(
        newDefinitiva.length > 0
          ? "cancelacion_definitiva"
          : newErrores.length > 0
            ? "errores"
            : "inconsistentes"
      );
    }, 2000);
  }

  // ── Flow: Cancelación Definitiva → Generar proceso ──
  function handleGenerateProcess() {
    if (definitiva.length === 0) return;
    showLoader("Generando proceso de cancelación definitiva...");

    setTimeout(() => {
      const processId = generateProcessId();
      hideLoader();
      notify(
        "success",
        `Proceso ${processId} generado`,
        `Se creó el proceso con ${definitiva.length} pólizas. Puede consultarlo en la sección de Procesos.`
      );
    }, 1500);
  }

  // ── Render table for each tab ──
  function renderTabContent() {
    switch (activeTab) {
      case "seleccion":
        return renderSeleccion();
      case "cancelacion_previa":
        return renderSimpleTable(
          previa,
          "No hay pólizas en cancelación previa. Seleccione pólizas en la pestaña de Selección y procéselas."
        );
      case "errores":
        return renderErroresTable();
      case "cancelacion_definitiva":
        return renderSimpleTable(
          definitiva,
          "No hay pólizas en cancelación definitiva. Procese las pólizas desde Cancelación Previa."
        );
      case "inconsistentes":
        return renderInconsistentes();
    }
  }

  function renderSeleccion() {
    if (!hasSearched) return <SearchEmptyState />;
    if (seleccion.length === 0)
      return (
        <EmptyTabState message="Todas las pólizas han sido procesadas. Realice una nueva consulta si necesita más registros." />
      );

    const allSelected = selectedIds.size === seleccion.length && seleccion.length > 0;
    const someSelected = selectedIds.size > 0 && !allSelected;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-low/50">
              <th className="px-6 py-4 w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-outline-variant text-teal-dark focus:ring-teal/30 cursor-pointer"
                />
              </th>
              <th className={TH_CLASS}>Póliza</th>
              <th className={TH_CLASS}>Cliente</th>
              <th className={TH_CLASS}>Fecha Emisión</th>
              <th className={TH_CLASS}>Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {seleccion.map((r) => (
              <tr
                key={r.id}
                className={cn(
                  "transition-colors cursor-pointer",
                  selectedIds.has(r.id)
                    ? "bg-teal/5"
                    : "hover:bg-surface-low/50"
                )}
                onClick={() => toggleSelect(r.id)}
              >
                <td className="px-6 py-5">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(r.id)}
                    onChange={() => toggleSelect(r.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="size-4 rounded border-outline-variant text-teal-dark focus:ring-teal/30 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-5 text-sm font-bold text-navy">
                  {r.policyNumber}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-on-surface">
                  {r.client}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {r.issueDate}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-navy">
                  {formatCurrency(r.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderSimpleTable(records: PolicyRecord[], emptyMsg: string) {
    if (records.length === 0) return <EmptyTabState message={emptyMsg} />;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-low/50">
              <th className={TH_CLASS}>Póliza</th>
              <th className={TH_CLASS}>Cliente</th>
              <th className={TH_CLASS}>Fecha Emisión</th>
              <th className={TH_CLASS}>Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-surface-low/50 transition-colors">
                <td className="px-6 py-5 text-sm font-bold text-navy">
                  {r.policyNumber}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-on-surface">
                  {r.client}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {r.issueDate}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-navy">
                  {formatCurrency(r.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderErroresTable() {
    if (errores.length === 0)
      return (
        <EmptyTabState message="No se registraron errores. Los errores aparecerán aquí si alguna póliza falla durante el procesamiento." />
      );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-low/50">
              <th className={TH_CLASS}>Póliza</th>
              <th className={TH_CLASS}>Cliente</th>
              <th className={TH_CLASS}>Monto</th>
              <th className={TH_CLASS}>Motivo del Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-high">
            {errores.map((r) => (
              <tr key={r.id} className="hover:bg-surface-low/50 transition-colors">
                <td className="px-6 py-5 text-sm font-bold text-navy">
                  {r.policyNumber}
                </td>
                <td className="px-6 py-5 text-sm font-medium text-on-surface">
                  {r.client}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-navy">
                  {formatCurrency(r.amount)}
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 px-2.5 py-1 rounded-full font-medium">
                    <AlertCircle className="size-3" />
                    {r.errorReason}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderInconsistentes() {
    return (
      <>
        {inconsistentes.length === 0 ? (
          <EmptyTabState message="No se detectaron inconsistencias. Las pólizas con datos inconsistentes aparecerán aquí." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-low/50">
                  <th className={TH_CLASS}>Póliza</th>
                  <th className={TH_CLASS}>Cliente</th>
                  <th className={TH_CLASS}>Monto</th>
                  <th className={TH_CLASS}>Inconsistencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-high">
                {inconsistentes.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-surface-low/50 transition-colors"
                  >
                    <td className="px-6 py-5 text-sm font-bold text-navy">
                      {r.policyNumber}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-on-surface">
                      {r.client}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-navy">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                        <FileWarning className="size-3" />
                        {r.inconsistencyReason}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Observations Textarea */}
        <div className="p-6 border-t border-surface-high">
          <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
            Observaciones
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Registre aquí las observaciones sobre las pólizas inconsistentes detectadas en este lote..."
            rows={4}
            className="w-full bg-surface-low border-none rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant focus:ring-2 focus:ring-teal/20 resize-none transition-all"
          />
        </div>
      </>
    );
  }

  // ── Footer action per tab ──
  function renderFooterAction() {
    switch (activeTab) {
      case "seleccion":
        return (
          <button
            type="button"
            onClick={handleMoveToPrevia}
            disabled={selectedIds.size === 0}
            className="px-8 py-3 premium-gradient text-white font-bold text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="size-4" />
            Mover a Cancelación Previa ({selectedIds.size})
          </button>
        );
      case "cancelacion_previa":
        return (
          <button
            type="button"
            onClick={handleProcessPrevia}
            disabled={previa.length === 0}
            className="px-8 py-3 premium-gradient text-white font-bold text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="size-4" />
            Procesar Cancelación ({previa.length})
          </button>
        );
      case "cancelacion_definitiva":
        return (
          <button
            type="button"
            onClick={handleGenerateProcess}
            disabled={definitiva.length === 0}
            className="px-8 py-3 premium-gradient text-white font-bold text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="size-4" />
            Generar Proceso ({definitiva.length})
          </button>
        );
      default:
        return null;
    }
  }

  // ── Summary counts ──
  const totalLoaded =
    seleccion.length +
    previa.length +
    errores.length +
    definitiva.length +
    inconsistentes.length;
  const totalAmount = [
    ...seleccion,
    ...previa,
    ...errores,
    ...definitiva,
    ...inconsistentes,
  ].reduce((sum, r) => sum + r.amount, 0);

  return (
    <>
      {/* Filter Panel */}
      <section className="bg-surface-low rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Fecha (Rango)
            </label>
            <input
              type="date"
              className="w-full bg-card border-none rounded-lg h-11 px-4 text-sm focus:ring-2 focus:ring-teal/20 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Mes de Proceso
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-card border-none rounded-lg h-11 px-4 text-sm focus:ring-2 focus:ring-teal/20 transition-all"
            >
              {months.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              Número de Póliza
            </label>
            <input
              type="text"
              placeholder="Ej. PO-2024-9981"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border-none rounded-lg h-11 px-4 text-sm focus:ring-2 focus:ring-teal/20 transition-all placeholder:text-outline-variant"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="h-11 premium-gradient text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 cursor-pointer"
          >
            <Search className="size-4" />
            Buscar registros
          </button>
        </div>
      </section>

      {/* Tabbed Panel */}
      <div className="bg-card rounded-xl shadow-ambient overflow-hidden flex flex-col min-h-[500px]">
        {/* Tabs Header */}
        <div className="flex border-b border-surface-high px-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = badgeCounts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-5 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0",
                  isActive
                    ? "font-bold border-b-2 border-navy text-navy"
                    : "text-on-surface-variant/60 hover:text-on-surface-variant"
                )}
              >
                <Icon className="size-[18px]" />
                {tab.label}
                {count != null && count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                      tab.id === "errores"
                        ? "bg-red-50 text-red-700"
                        : tab.id === "inconsistentes"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-teal/10 text-teal-dark"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col">{renderTabContent()}</div>

        {/* Footer */}
        <div className="mt-auto border-t border-surface-high bg-surface-low/30 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                Total pólizas
              </span>
              <span className="text-2xl font-heading font-extrabold text-navy">
                {totalLoaded}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                Monto acumulado
              </span>
              <span className="text-2xl font-heading font-extrabold text-teal-dark">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={!hasSearched}
              className="px-5 py-3 border border-outline-variant text-navy font-bold text-sm rounded-lg hover:bg-surface-low transition-all cursor-pointer flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="size-4" />
              Exportar
            </button>
            {renderFooterAction()}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mt-8 flex gap-6">
        <div className="flex-1 bg-navy-container/5 border border-navy-container/10 rounded-xl p-6 flex gap-4 items-start">
          <AlertCircle className="size-5 text-navy-container shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-navy-container text-sm mb-1">
              Información de Proceso
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Las cancelaciones iniciadas en este módulo se procesarán en un
              intervalo de 15 minutos. Una vez confirmadas, el sistema generará
              los asientos contables de reversión automáticamente.
            </p>
          </div>
        </div>
        <div className="w-1/3 bg-teal/5 border border-teal/15 rounded-xl p-6 flex gap-4 items-start">
          <CheckCircle2 className="size-5 text-teal-dark shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-teal-dark text-sm mb-1">
              Cierre de Mes
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              El periodo de Febrero 2024 se encuentra abierto para operaciones
              técnicas hasta el día 28.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
