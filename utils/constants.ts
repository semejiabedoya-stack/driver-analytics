import type { Platform } from "@/types/domain";

export const DEFAULT_PLATFORMS: Platform[] = [
  { id: "didi", name: "DiDi", color: "#f97316", commissionRate: 0.18, taxRate: 0.04, createdAt: new Date().toISOString() },
  { id: "indrive", name: "inDrive", color: "#22c55e", commissionRate: 0.10, taxRate: 0.03, createdAt: new Date().toISOString() },
  { id: "uber", name: "Uber", color: "#111827", commissionRate: 0.25, taxRate: 0.04, createdAt: new Date().toISOString() },
  { id: "yango", name: "Yango", color: "#ef4444", commissionRate: 0.20, taxRate: 0.04, createdAt: new Date().toISOString() }
];

export const EXPENSE_CATEGORIES = ["gasolina", "comida", "peajes", "lavado", "parqueadero", "mantenimiento", "otros"] as const;
