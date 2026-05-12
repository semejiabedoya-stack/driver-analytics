import { format, intervalToDuration } from "date-fns";
import { es } from "date-fns/locale";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatNumber(value: number, fractionDigits = 1): string {
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDateTime(value: string): string {
  return format(new Date(value), "dd MMM, HH:mm", { locale: es });
}

export function formatDuration(ms: number): string {
  const safeMs = Math.max(0, ms);
  const duration = intervalToDuration({ start: 0, end: safeMs });
  const hours = duration.hours ? `${duration.hours}h ` : "";
  const minutes = duration.minutes ? `${duration.minutes}m` : "0m";
  return `${hours}${minutes}`;
}
