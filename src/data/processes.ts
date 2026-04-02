export type ProcessStatus = "in_progress" | "completed" | "error" | "pending";

export interface ProcessUser {
  name: string;
  initials: string;
}

export interface ProcessRecord {
  id: string;
  name: string;
  description: string;
  status: ProcessStatus;
  user: ProcessUser;
  date: string;
  progress: number;
  progressLabel: string;
}

export const processRecords: ProcessRecord[] = [
  {
    id: "#PRC-9021",
    name: "CANCELACIÓN MASIVA LOTE FEB-24",
    description: "Procesamiento de 312 pólizas pendientes de cancelación",
    status: "in_progress",
    user: { name: "Carlos Mendoza", initials: "CM" },
    date: "02 Abr, 2026 · 14:20",
    progress: 75,
    progressLabel: "LOTE 3/4",
  },
  {
    id: "#PRC-9018",
    name: "REVERSIÓN CONTABLE ENERO",
    description: "Asientos de reversión para cancelaciones del mes anterior",
    status: "completed",
    user: { name: "Lucía Ferreyra", initials: "LF" },
    date: "02 Abr, 2026 · 09:15",
    progress: 100,
    progressLabel: "ÉXITO",
  },
  {
    id: "#PRC-9015",
    name: "NOTIFICACIÓN MASIVA CLIENTES",
    description: "Envío de avisos de cancelación por correo y SMS",
    status: "in_progress",
    user: { name: "Sistema Automático", initials: "SA" },
    date: "02 Abr, 2026 · 11:30",
    progress: 42,
    progressLabel: "ENVÍO 840/2000",
  },
  {
    id: "#PRC-8994",
    name: "EXPORTACIÓN XML REGULADOR",
    description: "Reporte de cancelaciones para la Superintendencia de Seguros",
    status: "error",
    user: { name: "Sistema Automático", initials: "SA" },
    date: "01 Abr, 2026 · 23:58",
    progress: 42,
    progressLabel: "INTERRUMPIDO",
  },
  {
    id: "#PRC-8990",
    name: "RECÁLCULO RESERVAS TÉCNICAS",
    description: "Actualización de reservas por cancelaciones procesadas",
    status: "completed",
    user: { name: "Ana Gutiérrez", initials: "AG" },
    date: "01 Abr, 2026 · 16:45",
    progress: 100,
    progressLabel: "ÉXITO",
  },
  {
    id: "#PRC-9105",
    name: "VALORACIÓN DE ACTIVOS Q1",
    description: "Valoración trimestral de activos vinculados a pólizas canceladas",
    status: "pending",
    user: { name: "Roberto Salas", initials: "RS" },
    date: "03 Abr, 2026 · 08:00",
    progress: 0,
    progressLabel: "EN COLA",
  },
  {
    id: "#PRC-8985",
    name: "CONCILIACIÓN BANCARIA MARZO",
    description: "Cruce de pagos recibidos vs pólizas en proceso de cancelación",
    status: "completed",
    user: { name: "Lucía Ferreyra", initials: "LF" },
    date: "01 Abr, 2026 · 08:30",
    progress: 100,
    progressLabel: "ÉXITO",
  },
  {
    id: "#PRC-9108",
    name: "GENERACIÓN CARTAS DE CANCELACIÓN",
    description: "Documentos formales de cancelación para firma del gerente",
    status: "pending",
    user: { name: "Carlos Mendoza", initials: "CM" },
    date: "03 Abr, 2026 · 10:00",
    progress: 0,
    progressLabel: "EN COLA",
  },
];

export const processStats = {
  activeTasks: 12,
  successRate: 98.4,
  totalProcessed: 128,
};

/** Bar chart data for system load visualization */
export const systemLoadBars = [
  25, 50, 75, 83, 60, 50, 45, 83, 100, 75, 50, 25,
];
