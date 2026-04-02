import {
  Shield,
  Wallet,
  BarChart3,
  Users,
  FileText,
  Settings,
  Trash2,
  CreditCard,
  Receipt,
  UserCog,
  KeyRound,
  ScanEye,
  LayoutDashboard,
  TrendingUp,
  BookUser,
  HeartHandshake,
  FilePlus2,
  RefreshCw,
  FilePen,
  SlidersHorizontal,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface Executable {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  action: string;
}

export interface Module {
  id: string;
  name: string;
  icon: LucideIcon;
  executables: Executable[];
}

export const modules: Module[] = [
  {
    id: "seguridad",
    name: "Seguridad",
    icon: Shield,
    executables: [
      {
        id: "gestion-usuarios",
        name: "Gestión de Usuarios",
        description:
          "Administración de cuentas de usuario, asignación de perfiles y control de accesos al sistema.",
        icon: UserCog,
        href: "#",
        action: "Abrir módulo",
      },
      {
        id: "roles-permisos",
        name: "Roles y Permisos",
        description:
          "Configuración de roles institucionales y permisos granulares por funcionalidad.",
        icon: KeyRound,
        href: "#",
        action: "Configurar",
      },
      {
        id: "auditoria-accesos",
        name: "Auditoría de Accesos",
        description:
          "Registro histórico de accesos, cambios y operaciones críticas realizadas en el sistema.",
        icon: ScanEye,
        href: "#",
        action: "Ver registros",
      },
    ],
  },
  {
    id: "cobranzas",
    name: "Cobranzas",
    icon: Wallet,
    executables: [
      {
        id: "cancelaciones-automaticas",
        name: "Cancelaciones Automáticas",
        description:
          "Procesamiento masivo de bajas por falta de pago y gestión de lotes diarios.",
        icon: Trash2,
        href: "/automatic-cancellations",
        action: "Ejecutar ahora",
      },
      {
        id: "gestion-pagos",
        name: "Gestión de Pagos",
        description:
          "Conciliación bancaria, carga de cuotas y seguimiento de mora técnica.",
        icon: CreditCard,
        href: "#",
        action: "Abrir módulo",
      },
      {
        id: "liquidacion-siniestros",
        name: "Liquidación de Siniestros",
        description:
          "Cálculo de montos indemnizatorios y órdenes de pago para terceros y asegurados.",
        icon: Receipt,
        href: "#",
        action: "Gestionar liquidaciones",
      },
    ],
  },
  {
    id: "reportes",
    name: "Reportes",
    icon: BarChart3,
    executables: [
      {
        id: "dashboard-ejecutivo",
        name: "Dashboard Ejecutivo",
        description:
          "Indicadores clave de desempeño y métricas de producción en tiempo real.",
        icon: LayoutDashboard,
        href: "#",
        action: "Ver dashboard",
      },
      {
        id: "reportes-produccion",
        name: "Reportes de Producción",
        description:
          "Generación de informes periódicos de primas emitidas, cobradas y siniestralidad.",
        icon: TrendingUp,
        href: "#",
        action: "Generar reporte",
      },
    ],
  },
  {
    id: "clientes",
    name: "Clientes",
    icon: Users,
    executables: [
      {
        id: "directorio-asegurados",
        name: "Directorio de Asegurados",
        description:
          "Búsqueda y consulta del padrón completo de asegurados activos e inactivos.",
        icon: BookUser,
        href: "#",
        action: "Buscar asegurado",
      },
      {
        id: "gestion-beneficiarios",
        name: "Gestión de Beneficiarios",
        description:
          "Alta, baja y modificación de beneficiarios vinculados a pólizas vigentes.",
        icon: HeartHandshake,
        href: "#",
        action: "Gestionar",
      },
    ],
  },
  {
    id: "polizas",
    name: "Pólizas",
    icon: FileText,
    executables: [
      {
        id: "emision-polizas",
        name: "Emisión de Pólizas",
        description:
          "Proceso de cotización, emisión y activación de nuevas pólizas de seguro.",
        icon: FilePlus2,
        href: "#",
        action: "Nueva póliza",
      },
      {
        id: "renovaciones",
        name: "Renovaciones",
        description:
          "Gestión del ciclo de renovación automática y manual de pólizas próximas a vencer.",
        icon: RefreshCw,
        href: "#",
        action: "Ver renovaciones",
      },
      {
        id: "endosos",
        name: "Endosos",
        description:
          "Modificaciones contractuales sobre pólizas vigentes: cambios de suma, beneficiarios o coberturas.",
        icon: FilePen,
        href: "#",
        action: "Crear endoso",
      },
    ],
  },
  {
    id: "configuracion",
    name: "Configuración",
    icon: Settings,
    executables: [
      {
        id: "parametros-sistema",
        name: "Parámetros del Sistema",
        description:
          "Ajustes generales del sistema, tasas, períodos de gracia y reglas de negocio.",
        icon: SlidersHorizontal,
        href: "#",
        action: "Configurar",
      },
      {
        id: "catalogos",
        name: "Catálogos",
        description:
          "Administración de catálogos maestros: tipos de seguro, monedas, agentes y sucursales.",
        icon: BookOpen,
        href: "#",
        action: "Abrir catálogos",
      },
    ],
  },
];
