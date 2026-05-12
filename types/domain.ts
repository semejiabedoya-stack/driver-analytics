export type PlatformColor = `#${string}`;

export type Platform = {
  id: string;
  userId?: string;
  name: string;
  color: PlatformColor;
  commissionRate: number;
  taxRate: number;
  createdAt: string;
};

export type GpsPoint = {
  latitude: number;
  longitude: number;
};

export type Trip = {
  id: string;
  platformId: string;
  userId?: string;
  valorViaje: number;
  propina: number;
  comision: number;
  impuestos: number;
  libreComision: boolean;
  horaInicio: string;
  horaRecogida: string;
  horaFinal: string;
  kmInicial: number;
  kmRecogida: number;
  kmFinal: number;
  latitudInicio: number;
  longitudInicio: number;
  latitudRecogida: number;
  longitudRecogida: number;
  latitudFinal: number;
  longitudFinal: number;
  gananciaNeta: number;
  createdAt: string;
};

export type TripDraft = {
  platformId: string;
  valorViaje: number;
  propina: number;
  libreComision: boolean;
  horaInicio?: string;
  horaRecogida?: string;
  horaFinal?: string;
  kmInicial?: number;
  kmRecogida?: number;
  kmFinal?: number;
  gpsInicio?: GpsPoint;
  gpsRecogida?: GpsPoint;
  gpsFinal?: GpsPoint;
};

export type ExpenseCategory =
  | "gasolina"
  | "comida"
  | "peajes"
  | "lavado"
  | "parqueadero"
  | "mantenimiento"
  | "otros";

export type Expense = {
  id: string;
  userId?: string;
  value: number;
  category: ExpenseCategory;
  description?: string;
  createdAt: string;
};

export type WorkSessionStatus = "idle" | "running" | "paused" | "finished";

export type Pause = {
  id: string;
  sessionId: string;
  startedAt: string;
  endedAt?: string;
};

export type WorkSession = {
  id: string;
  userId?: string;
  startedAt: string;
  endedAt?: string;
  status: WorkSessionStatus;
  pauses: Pause[];
};

export type Goal = {
  id: string;
  userId?: string;
  date: string;
  value: number;
};

export type ReportFilter = {
  period: "day" | "week" | "month" | "custom";
  platformId: string;
  from?: string;
  to?: string;
};

export type HeatPoint = [number, number, number];
