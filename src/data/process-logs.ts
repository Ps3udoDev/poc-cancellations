export type LogLevel = "INFO" | "WARN" | "ERROR" | "SUCCESS" | "DEBUG";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

/** Pre-built log sequences keyed by process ID */
const logTemplates: Record<string, LogEntry[]> = {
  "#PRC-9021": [
    { timestamp: "14:20:01", level: "INFO", message: "Proceso iniciado por usuario Carlos Mendoza" },
    { timestamp: "14:20:01", level: "INFO", message: "Conectando al servidor de base de datos... OK" },
    { timestamp: "14:20:02", level: "INFO", message: "Cargando lote de cancelaciones FEB-24 (312 pólizas)" },
    { timestamp: "14:20:03", level: "DEBUG", message: "Query: SELECT * FROM polizas WHERE estado='PENDIENTE_CANCEL' AND mes_proceso='2024-02'" },
    { timestamp: "14:20:04", level: "INFO", message: "312 registros encontrados. Iniciando procesamiento por lotes..." },
    { timestamp: "14:20:05", level: "INFO", message: "[LOTE 1/4] Procesando pólizas PO-2024-0001 a PO-2024-0078" },
    { timestamp: "14:21:12", level: "SUCCESS", message: "[LOTE 1/4] Completado — 78 pólizas canceladas correctamente" },
    { timestamp: "14:21:13", level: "INFO", message: "[LOTE 2/4] Procesando pólizas PO-2024-0079 a PO-2024-0156" },
    { timestamp: "14:22:30", level: "SUCCESS", message: "[LOTE 2/4] Completado — 78 pólizas canceladas correctamente" },
    { timestamp: "14:22:31", level: "INFO", message: "[LOTE 3/4] Procesando pólizas PO-2024-0157 a PO-2024-0234" },
    { timestamp: "14:23:45", level: "WARN", message: "[LOTE 3/4] Póliza PO-2024-0189 tiene siniestro activo — omitida" },
    { timestamp: "14:23:58", level: "SUCCESS", message: "[LOTE 3/4] Completado — 77 canceladas, 1 omitida" },
    { timestamp: "14:23:59", level: "INFO", message: "[LOTE 4/4] Procesando pólizas PO-2024-0235 a PO-2024-0312" },
    { timestamp: "14:24:10", level: "INFO", message: "Generando asientos contables de reversión..." },
    { timestamp: "14:24:15", level: "DEBUG", message: "INSERT INTO asientos_contables (tipo, referencia, monto) VALUES ('REVERSION', ...)" },
  ],
  "#PRC-9018": [
    { timestamp: "09:15:01", level: "INFO", message: "Proceso iniciado por usuario Lucía Ferreyra" },
    { timestamp: "09:15:01", level: "INFO", message: "Conectando al módulo contable... OK" },
    { timestamp: "09:15:02", level: "INFO", message: "Cargando cancelaciones confirmadas del periodo ENE-24" },
    { timestamp: "09:15:03", level: "DEBUG", message: "Query: SELECT * FROM cancelaciones WHERE mes='2024-01' AND estado='CONFIRMADA'" },
    { timestamp: "09:15:04", level: "INFO", message: "118 registros encontrados para reversión contable" },
    { timestamp: "09:15:05", level: "INFO", message: "Generando asientos de reversión de prima..." },
    { timestamp: "09:16:20", level: "SUCCESS", message: "118 asientos de reversión creados correctamente" },
    { timestamp: "09:16:21", level: "INFO", message: "Actualizando saldos en cuentas por cobrar..." },
    { timestamp: "09:17:00", level: "SUCCESS", message: "Saldos actualizados. Diferencia neta: -$87,450.00" },
    { timestamp: "09:17:01", level: "INFO", message: "Generando reporte de conciliación..." },
    { timestamp: "09:17:30", level: "SUCCESS", message: "Reporte generado: RPT-REV-ENE24.pdf" },
    { timestamp: "09:17:31", level: "SUCCESS", message: "Proceso completado exitosamente. Tiempo total: 2m 30s" },
  ],
  "#PRC-9015": [
    { timestamp: "11:30:01", level: "INFO", message: "Proceso automático de notificación iniciado" },
    { timestamp: "11:30:02", level: "INFO", message: "Cargando lista de destinatarios (2000 clientes)" },
    { timestamp: "11:30:03", level: "DEBUG", message: "Conectando al servicio SMTP: mail.aseguradoraxyz.com:587" },
    { timestamp: "11:30:04", level: "INFO", message: "Conexión SMTP establecida. Iniciando envío masivo..." },
    { timestamp: "11:30:05", level: "INFO", message: "[CORREO] Enviando lote 1/20 (100 correos)..." },
    { timestamp: "11:31:15", level: "SUCCESS", message: "[CORREO] Lote 1/20 enviado — 98 exitosos, 2 rebotados" },
    { timestamp: "11:31:16", level: "WARN", message: "Rebote: cliente@dominioinvalido.xyz — Dominio no encontrado" },
    { timestamp: "11:31:16", level: "WARN", message: "Rebote: jperez@mailcorp.co — Buzón lleno" },
    { timestamp: "11:31:17", level: "INFO", message: "[SMS] Enviando lote 1/10 (200 mensajes)..." },
    { timestamp: "11:32:00", level: "SUCCESS", message: "[SMS] Lote 1/10 enviado — 200 exitosos" },
    { timestamp: "11:32:01", level: "INFO", message: "[CORREO] Enviando lote 2/20 (100 correos)..." },
    { timestamp: "11:33:00", level: "INFO", message: "Progreso general: 840/2000 notificaciones enviadas" },
  ],
  "#PRC-8994": [
    { timestamp: "23:58:01", level: "INFO", message: "Proceso automático de exportación XML iniciado" },
    { timestamp: "23:58:02", level: "INFO", message: "Conectando al servicio de la Superintendencia de Seguros..." },
    { timestamp: "23:58:03", level: "DEBUG", message: "URL: https://api.sbs.gob/v2/reportes/cancelaciones" },
    { timestamp: "23:58:04", level: "INFO", message: "Autenticación exitosa. Token válido hasta 00:58" },
    { timestamp: "23:58:05", level: "INFO", message: "Generando documento XML con 482 registros de cancelación" },
    { timestamp: "23:58:30", level: "INFO", message: "XML generado (2.4 MB). Iniciando carga al regulador..." },
    { timestamp: "23:58:31", level: "INFO", message: "Carga en progreso: 10%... 20%... 30%... 42%..." },
    { timestamp: "23:59:45", level: "WARN", message: "Timeout de conexión detectado. Reintentando (1/3)..." },
    { timestamp: "00:00:30", level: "WARN", message: "Timeout de conexión detectado. Reintentando (2/3)..." },
    { timestamp: "00:01:15", level: "WARN", message: "Timeout de conexión detectado. Reintentando (3/3)..." },
    { timestamp: "00:02:00", level: "ERROR", message: "ERROR: Conexión rechazada por el servidor del regulador" },
    { timestamp: "00:02:01", level: "ERROR", message: "Código de error: ETIMEDOUT — El servicio remoto no responde" },
    { timestamp: "00:02:02", level: "ERROR", message: "Proceso interrumpido en 42%. Se requiere reintento manual." },
  ],
  "#PRC-8990": [
    { timestamp: "16:45:01", level: "INFO", message: "Proceso iniciado por usuario Ana Gutiérrez" },
    { timestamp: "16:45:02", level: "INFO", message: "Cargando pólizas canceladas del periodo actual" },
    { timestamp: "16:45:03", level: "INFO", message: "28 cancelaciones confirmadas encontradas" },
    { timestamp: "16:45:04", level: "INFO", message: "Recalculando reserva IBNR (Incurridos pero no reportados)..." },
    { timestamp: "16:46:00", level: "SUCCESS", message: "Reserva IBNR ajustada: -$45,200.00" },
    { timestamp: "16:46:01", level: "INFO", message: "Recalculando reserva de primas no devengadas..." },
    { timestamp: "16:47:00", level: "SUCCESS", message: "Reserva PND ajustada: -$31,800.00" },
    { timestamp: "16:47:01", level: "SUCCESS", message: "Proceso completado. Reservas técnicas actualizadas." },
  ],
  "#PRC-9105": [
    { timestamp: "—", level: "INFO", message: "Proceso programado para 03 Abr, 2026 a las 08:00" },
    { timestamp: "—", level: "INFO", message: "Estado: EN COLA — esperando turno de ejecución" },
    { timestamp: "—", level: "DEBUG", message: "Dependencias: requiere finalización de #PRC-9021" },
  ],
  "#PRC-8985": [
    { timestamp: "08:30:01", level: "INFO", message: "Proceso iniciado por usuario Lucía Ferreyra" },
    { timestamp: "08:30:02", level: "INFO", message: "Conectando al módulo bancario... OK" },
    { timestamp: "08:30:03", level: "INFO", message: "Descargando extracto bancario del 01-31 Mar 2026" },
    { timestamp: "08:30:10", level: "INFO", message: "1,245 movimientos bancarios cargados" },
    { timestamp: "08:30:11", level: "INFO", message: "Cruzando con 482 pólizas en proceso de cancelación..." },
    { timestamp: "08:35:00", level: "WARN", message: "3 pagos recibidos para pólizas ya canceladas — marcados para revisión" },
    { timestamp: "08:36:00", level: "SUCCESS", message: "Conciliación completada. 98.7% de coincidencia." },
  ],
  "#PRC-9108": [
    { timestamp: "—", level: "INFO", message: "Proceso programado para 03 Abr, 2026 a las 10:00" },
    { timestamp: "—", level: "INFO", message: "Estado: EN COLA — pendiente de aprobación gerencial" },
    { timestamp: "—", level: "DEBUG", message: "Plantilla: CARTA_CANCEL_V3.docx" },
    { timestamp: "—", level: "DEBUG", message: "Destinatarios estimados: 28 cartas a generar" },
  ],
};

/** Get logs for a process. Returns a generic fallback if no template exists. */
export function getProcessLogs(processId: string): LogEntry[] {
  return (
    logTemplates[processId] ?? [
      { timestamp: "—", level: "INFO", message: `Logs para proceso ${processId} no disponibles.` },
    ]
  );
}
