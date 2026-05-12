import { differenceInMilliseconds, getDay, getHours, parseISO } from "date-fns";
import type { Expense, Platform, Trip, TripDraft, WorkSession } from "@/types/domain";

export type TripMetrics = {
  kmTotales: number;
  kmViaje: number;
  tiempoTotalMs: number;
  tiempoEsperaMs: number;
  comision: number;
  impuestos: number;
  gananciaNeta: number;
  valorPorKm: number;
  valorPorHora: number;
};

export type ReportMetrics = {
  dineroBruto: number;
  dineroNeto: number;
  propinas: number;
  gastos: number;
  utilidadReal: number;
  kmRecorridos: number;
  tiempoConectadoMs: number;
  tiempoPausadoMs: number;
  tiempoEfectivoMs: number;
  tiempoMuertoMs: number;
  mejoresHoras: number[];
  peoresHoras: number[];
  mejoresDias: number[];
  mejoresPlataformas: string[];
};

export function calculateTripMetrics(draft: TripDraft, platform: Platform): TripMetrics {
  const kmInicial = draft.kmInicial ?? 0;
  const kmRecogida = draft.kmRecogida ?? kmInicial;
  const kmFinal = draft.kmFinal ?? kmRecogida;
  const kmTotales = Math.max(0, kmFinal - kmInicial);
  const kmViaje = Math.max(0, kmFinal - kmRecogida);
  const start = draft.horaInicio ? parseISO(draft.horaInicio) : new Date();
  const pickup = draft.horaRecogida ? parseISO(draft.horaRecogida) : start;
  const end = draft.horaFinal ? parseISO(draft.horaFinal) : pickup;
  const tiempoTotalMs = Math.max(0, differenceInMilliseconds(end, start));
  const tiempoEsperaMs = Math.max(0, differenceInMilliseconds(pickup, start));
  const comision = draft.libreComision ? 0 : draft.valorViaje * platform.commissionRate;
  const impuestos = draft.libreComision ? 0 : comision * platform.taxRate;
  const gananciaNeta = draft.valorViaje - comision - impuestos + draft.propina;
  const hours = tiempoTotalMs / 3_600_000;

  return {
    kmTotales,
    kmViaje,
    tiempoTotalMs,
    tiempoEsperaMs,
    comision,
    impuestos,
    gananciaNeta,
    valorPorKm: kmTotales > 0 ? gananciaNeta / kmTotales : 0,
    valorPorHora: hours > 0 ? gananciaNeta / hours : 0
  };
}

export function calculateWorkSessionTimes(session?: WorkSession): Pick<ReportMetrics, "tiempoConectadoMs" | "tiempoPausadoMs" | "tiempoEfectivoMs"> {
  if (!session) return { tiempoConectadoMs: 0, tiempoPausadoMs: 0, tiempoEfectivoMs: 0 };
  const end = session.endedAt ? parseISO(session.endedAt) : new Date();
  const tiempoConectadoMs = Math.max(0, differenceInMilliseconds(end, parseISO(session.startedAt)));
  const tiempoPausadoMs = session.pauses.reduce((total, pause) => {
    const pauseEnd = pause.endedAt ? parseISO(pause.endedAt) : new Date();
    return total + Math.max(0, differenceInMilliseconds(pauseEnd, parseISO(pause.startedAt)));
  }, 0);
  return { tiempoConectadoMs, tiempoPausadoMs, tiempoEfectivoMs: Math.max(0, tiempoConectadoMs - tiempoPausadoMs) };
}

export function calculateDeadTime(trips: Trip[]): number {
  const orderedTrips = [...trips].sort((a, b) => parseISO(a.horaInicio).getTime() - parseISO(b.horaInicio).getTime());
  return orderedTrips.slice(1).reduce((total, trip, index) => {
    const previous = orderedTrips[index];
    return total + Math.max(0, differenceInMilliseconds(parseISO(trip.horaInicio), parseISO(previous.horaFinal)));
  }, 0);
}

export function calculateReport(trips: Trip[], expenses: Expense[], sessions: WorkSession[], platforms: Platform[]): ReportMetrics {
  const dineroBruto = trips.reduce((total, trip) => total + trip.valorViaje, 0);
  const dineroNeto = trips.reduce((total, trip) => total + trip.gananciaNeta, 0);
  const propinas = trips.reduce((total, trip) => total + trip.propina, 0);
  const gastos = expenses.reduce((total, expense) => total + expense.value, 0);
  const kmRecorridos = trips.reduce((total, trip) => total + Math.max(0, trip.kmFinal - trip.kmInicial), 0);
  const sessionTimes = sessions.reduce(
    (acc, session) => {
      const times = calculateWorkSessionTimes(session);
      return {
        tiempoConectadoMs: acc.tiempoConectadoMs + times.tiempoConectadoMs,
        tiempoPausadoMs: acc.tiempoPausadoMs + times.tiempoPausadoMs,
        tiempoEfectivoMs: acc.tiempoEfectivoMs + times.tiempoEfectivoMs
      };
    },
    { tiempoConectadoMs: 0, tiempoPausadoMs: 0, tiempoEfectivoMs: 0 }
  );

  const byHour = new Map<number, number>();
  const byDay = new Map<number, number>();
  const byPlatform = new Map<string, number>();
  trips.forEach((trip) => {
    const date = parseISO(trip.horaInicio);
    byHour.set(getHours(date), (byHour.get(getHours(date)) ?? 0) + trip.gananciaNeta);
    byDay.set(getDay(date), (byDay.get(getDay(date)) ?? 0) + trip.gananciaNeta);
    byPlatform.set(trip.platformId, (byPlatform.get(trip.platformId) ?? 0) + trip.gananciaNeta);
  });

  const sortedHours = [...byHour.entries()].sort((a, b) => b[1] - a[1]).map(([hour]) => hour);
  const platformNames = [...byPlatform.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([platformId]) => platforms.find((platform) => platform.id === platformId)?.name ?? platformId);

  return {
    dineroBruto,
    dineroNeto,
    propinas,
    gastos,
    utilidadReal: dineroNeto - gastos,
    kmRecorridos,
    ...sessionTimes,
    tiempoMuertoMs: calculateDeadTime(trips),
    mejoresHoras: sortedHours.slice(0, 3),
    peoresHoras: sortedHours.slice(-3).reverse(),
    mejoresDias: [...byDay.entries()].sort((a, b) => b[1] - a[1]).map(([day]) => day).slice(0, 3),
    mejoresPlataformas: platformNames.slice(0, 3)
  };
}
