export interface PolicyRecord {
  id: string;
  policyNumber: string;
  client: string;
  issueDate: string;
  amount: number;
  errorReason?: string;
  inconsistencyReason?: string;
}

/** Records returned by the search — all are candidates for selection */
export const policyRecords: PolicyRecord[] = [
  { id: "CN-8829", policyNumber: "PO-2024-9981", client: "Mariana Rodríguez", issueDate: "12 Ene 2024", amount: 1240.0 },
  { id: "CN-8830", policyNumber: "PO-2024-8872", client: "Inversiones Delta S.A.", issueDate: "05 Ene 2024", amount: 4890.5 },
  { id: "CN-8831", policyNumber: "PO-2023-1120", client: "Roberto Sánchez", issueDate: "28 Dic 2023", amount: 850.0 },
  { id: "CN-8832", policyNumber: "PO-2024-5512", client: "Lucía Villalba", issueDate: "15 Feb 2024", amount: 2100.0 },
  { id: "CN-8833", policyNumber: "PO-2024-3301", client: "Transportes Norte S.R.L.", issueDate: "20 Ene 2024", amount: 7650.0 },
  { id: "CN-8834", policyNumber: "PO-2023-9902", client: "Ana María Gutiérrez", issueDate: "10 Nov 2023", amount: 560.0 },
  { id: "CN-8835", policyNumber: "PO-2024-1105", client: "Constructora Alpes", issueDate: "02 Feb 2024", amount: 12300.0 },
  { id: "CN-8836", policyNumber: "PO-2024-7780", client: "Pedro Castillo M.", issueDate: "18 Feb 2024", amount: 980.0 },
  { id: "CN-8837", policyNumber: "PO-2023-6543", client: "Farmacia Central S.A.", issueDate: "05 Sep 2023", amount: 3200.0 },
  { id: "CN-8838", policyNumber: "PO-2024-2290", client: "Jorge Ramírez Torres", issueDate: "22 Ene 2024", amount: 1890.0 },
  { id: "CN-8839", policyNumber: "PO-2023-8810", client: "Mónica Herrera", issueDate: "14 Oct 2023", amount: 670.0 },
  { id: "CN-8840", policyNumber: "PO-2024-0098", client: "Hotel Panorama", issueDate: "30 Ene 2024", amount: 15400.0 },
];

export const months = [
  "Enero 2024",
  "Febrero 2024",
  "Marzo 2024",
  "Abril 2024",
];

export const errorReasons = [
  "Póliza vinculada a siniestro activo #SN-4412",
  "Coaseguro pendiente de confirmación por reasegurador",
  "Deuda en mora superior a 90 días — requiere revisión manual",
  "Beneficiario principal no verificado por compliance",
  "Duplicidad de registro detectada en el sistema core",
  "Timeout en validación con el servicio de la SBS",
];

export const inconsistencyReasons = [
  "Inconsistencia en datos del asegurado principal",
  "Monto de prima no coincide con tabla de primas vigente",
  "Fecha de emisión fuera del rango permitido para el producto",
  "Código de agente no corresponde a la sucursal registrada",
];
