"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  processRecords as initialRecords,
  processStats,
  systemLoadBars,
  type ProcessRecord,
  type ProcessStatus,
} from "@/data/processes";
import { useUIStore } from "@/stores/ui-store";
import { ProcessLogsModal } from "@/components/process-logs-modal";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  ProcessStatus,
  {
    label: string;
    dotClass: string;
    bgClass: string;
    textClass: string;
    icon?: React.ElementType;
  }
> = {
  in_progress: {
    label: "EN PROGRESO",
    dotClass: "bg-teal-dark animate-pulse",
    bgClass: "bg-teal/10",
    textClass: "text-teal-dark",
  },
  completed: {
    label: "COMPLETADO",
    bgClass: "bg-green-50",
    textClass: "text-green-700",
    icon: CheckCircle2,
    dotClass: "",
  },
  error: {
    label: "ERROR",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
    icon: AlertCircle,
    dotClass: "",
  },
  pending: {
    label: "PENDIENTE",
    bgClass: "bg-surface-high",
    textClass: "text-on-surface-variant",
    icon: Clock,
    dotClass: "",
  },
};

const progressBarColors: Record<ProcessStatus, { track: string; bar: string }> =
  {
    in_progress: { track: "bg-surface-high", bar: "bg-teal-dark" },
    completed: { track: "bg-green-100", bar: "bg-green-500" },
    error: { track: "bg-red-100", bar: "bg-red-500" },
    pending: { track: "bg-surface-low", bar: "bg-outline-variant" },
  };

function StatusBadge({ status }: { status: ProcessStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold",
        config.bgClass,
        config.textClass
      )}
    >
      {Icon ? (
        <Icon className="size-3.5" />
      ) : (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
      )}
      {config.label}
    </span>
  );
}

function ProgressBar({
  progress,
  label,
  status,
}: {
  progress: number;
  label: string;
  status: ProcessStatus;
}) {
  const colors = progressBarColors[status];
  const labelColor =
    status === "error"
      ? "text-red-700"
      : status === "completed"
        ? "text-green-700"
        : status === "pending"
          ? "text-on-surface-variant/40"
          : "text-on-surface-variant";

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex justify-between items-center text-[10px] font-bold",
          labelColor
        )}
      >
        <span>{progress}%</span>
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "w-full h-1.5 rounded-full overflow-hidden",
          colors.track
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            colors.bar
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ProcessRow({
  process,
  onViewLogs,
  onResume,
}: {
  process: ProcessRecord;
  onViewLogs: (process: ProcessRecord) => void;
  onResume: (processId: string) => void;
}) {
  return (
    <tr className="hover:bg-surface-low/50 transition-colors">
      <td className="px-6 py-5">
        <span className="font-heading font-bold text-navy">{process.id}</span>
        <p className="text-[10px] text-on-surface-variant mt-0.5">
          {process.name}
        </p>
      </td>
      <td className="px-6 py-5">
        <StatusBadge status={process.status} />
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-navy-container flex items-center justify-center text-[10px] font-bold text-white">
            {process.user.initials}
          </div>
          <span className="text-sm font-medium text-on-surface">
            {process.user.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-on-surface-variant">
        {process.date}
      </td>
      <td className="px-6 py-5 w-1/5">
        <ProgressBar
          progress={process.progress}
          label={process.progressLabel}
          status={process.status}
        />
      </td>
      {/* View Logs */}
      <td className="px-6 py-5 text-center">
        <button
          type="button"
          onClick={() => onViewLogs(process)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-navy hover:text-teal-dark bg-surface-low hover:bg-teal/10 rounded-lg transition-all cursor-pointer uppercase tracking-wider"
        >
          <Eye className="size-3.5" />
          Logs
        </button>
      </td>
      {/* Actions */}
      <td className="px-6 py-5 text-right">
        {process.status === "error" ? (
          <button
            type="button"
            className="px-3 py-1 text-[10px] font-bold text-red-700 hover:bg-red-50 rounded transition-all cursor-pointer"
          >
            REINTENTAR
          </button>
        ) : process.status === "completed" ? (
          <button
            type="button"
            onClick={() => onResume(process.id)}
            className="px-3 py-1 text-[10px] font-bold text-green-700 hover:bg-green-50 rounded transition-all cursor-pointer border border-green-200"
          >
            REANUDAR
          </button>
        ) : (
          <button
            type="button"
            className="p-2 hover:bg-surface-high rounded-lg transition-colors text-on-surface-variant cursor-pointer"
          >
            <MoreVertical className="size-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export function ProcessesPanel() {
  const router = useRouter();
  const [records, setRecords] = useState<ProcessRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logsModal, setLogsModal] = useState<ProcessRecord | null>(null);
  const { notify } = useUIStore();

  const handleResume = useCallback((processId: string) => {
    router.push(`/automatic-cancellations?processId=${encodeURIComponent(processId)}&action=resume`);
  }, [router]);

  const simulateProgress = useCallback(() => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.status !== "in_progress") return r;
        const increment = Math.floor(Math.random() * 8) + 2;
        const newProgress = Math.min(r.progress + increment, 100);
        if (newProgress >= 100) {
          return {
            ...r,
            progress: 100,
            status: "completed" as ProcessStatus,
            progressLabel: "ÉXITO",
          };
        }
        return { ...r, progress: newProgress };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(simulateProgress, 3000);
    return () => clearInterval(interval);
  }, [simulateProgress]);

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setRecords(initialRecords);
      setIsRefreshing(false);
      notify("info", "Lista actualizada", "Los procesos se han recargado");
    }, 800);
  }

  const filtered = records.filter(
    (r) =>
      searchQuery === "" ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = records.filter(
    (r) => r.status === "in_progress"
  ).length;

  return (
    <>
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl font-extrabold text-navy tracking-tight mb-2">
            Procesos en Segundo Plano
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Supervise la ejecución de tareas críticas, reportes masivos y
            actualizaciones de pólizas en tiempo real.
          </p>
        </div>
        {/* Glass Stats Card */}
        <div className="soft-glass p-6 rounded-xl border border-white/40 shadow-sm flex gap-8 items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant tracking-[0.1em] uppercase">
              Tareas Activas
            </span>
            <span className="text-3xl font-heading font-bold text-navy">
              {activeCount || processStats.activeTasks}
            </span>
          </div>
          <div className="w-px h-10 bg-outline-variant/30" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant tracking-[0.1em] uppercase">
              Tasa de Éxito
            </span>
            <span className="text-3xl font-heading font-bold text-teal-dark">
              {processStats.successRate}%
            </span>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-5" />
          <input
            type="text"
            placeholder="Buscar por ID o usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-low border-none rounded-lg focus:ring-2 focus:ring-teal/30 text-sm"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 bg-card text-on-surface text-sm font-medium rounded-lg hover:bg-surface-high transition-colors cursor-pointer"
        >
          <Filter className="size-5" />
          Filtrar
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2.5 premium-gradient text-white font-medium rounded-lg text-sm hover:opacity-90 transition-all ml-auto cursor-pointer disabled:opacity-70"
        >
          <RefreshCw
            className={cn("size-5", isRefreshing && "animate-spin")}
          />
          Actualizar Lista
        </button>
      </div>

      {/* Table */}
      <section className="bg-card rounded-xl overflow-hidden shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-low border-b border-surface-high">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  ID del Proceso
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Generado por
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider w-1/5">
                  Progreso
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">
                  Ver
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-low">
              {filtered.map((process) => (
                <ProcessRow
                  key={process.id}
                  process={process}
                  onViewLogs={setLogsModal}
                  onResume={handleResume}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="px-6 py-4 bg-surface-low flex justify-between items-center border-t border-surface-high/50">
          <span className="text-xs text-on-surface-variant font-medium">
            Mostrando {filtered.length} de {processStats.totalProcessed}{" "}
            procesos registrados
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled
              className="p-2 bg-card border border-outline-variant/30 rounded-lg text-on-surface-variant disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              className="px-4 py-2 premium-gradient text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-card border border-outline-variant/30 text-on-surface rounded-lg text-xs font-bold hover:bg-surface-low transition-all cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-card border border-outline-variant/30 text-on-surface rounded-lg text-xs font-bold hover:bg-surface-low transition-all cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              className="p-2 bg-card border border-outline-variant/30 rounded-lg text-on-surface hover:bg-surface-low transition-all cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </footer>
      </section>

      {/* Bento Grid Insights */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Load Chart */}
        <div className="md:col-span-2 soft-glass p-8 rounded-xl border border-white/50 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-navy mb-2">
              Carga del Sistema
            </h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Uso de recursos de procesamiento para tareas en segundo plano.
            </p>
          </div>
          <div className="flex items-end gap-2 h-32">
            {systemLoadBars.map((height, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t-lg transition-all duration-500",
                  height >= 90 ? "bg-teal-dark" : "bg-teal/20"
                )}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>AHORA</span>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="bg-navy-container p-8 rounded-xl flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal rounded-full blur-[80px] opacity-20 transition-all duration-700 group-hover:scale-125" />
          <div className="relative z-10">
            <BarChart3 className="size-10 text-teal mb-4" />
            <h3 className="font-heading font-bold text-xl mb-2">
              Alertas Técnicas
            </h3>
            <p className="text-sm text-blue-200/80">
              3 procesos de exportación requieren atención inmediata debido a
              tiempos de espera excedidos.
            </p>
          </div>
          <button
            type="button"
            className="relative z-10 mt-8 flex items-center justify-between w-full p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all cursor-pointer"
          >
            <span className="text-sm font-bold">Ver Diagnóstico</span>
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>

      {/* Console Logs Modal */}
      {logsModal && (
        <ProcessLogsModal
          processId={logsModal.id}
          processName={logsModal.name}
          onClose={() => setLogsModal(null)}
        />
      )}
    </>
  );
}
