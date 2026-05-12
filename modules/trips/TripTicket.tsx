"use client";

import type { CSSProperties } from "react";
import { Card } from "@/components/ui/Card";
import type { Platform, Trip } from "@/types/domain";
import { formatCurrency, formatDateTime, formatDuration, formatNumber } from "@/utils/format";
import { calculateTripMetrics } from "@/utils/calculations";

type TripTicketProps = {
  trip: Trip;
  platform: Platform;
};

export function TripTicket({ trip, platform }: TripTicketProps) {
  const metrics = calculateTripMetrics(
    {
      platformId: trip.platformId,
      valorViaje: trip.valorViaje,
      propina: trip.propina,
      libreComision: trip.libreComision,
      horaInicio: trip.horaInicio,
      horaRecogida: trip.horaRecogida,
      horaFinal: trip.horaFinal,
      kmInicial: trip.kmInicial,
      kmRecogida: trip.kmRecogida,
      kmFinal: trip.kmFinal
    },
    platform
  );

  return (
    <Card className="border-2" style={{ borderColor: platform.color } as CSSProperties}>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black">Ticket final</h3>
        <span className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ backgroundColor: platform.color }}>{platform.name}</span>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <TicketGroup title="Informacion" rows={[["Inicio", formatDateTime(trip.horaInicio)], ["Recogida", formatDateTime(trip.horaRecogida)], ["Final", formatDateTime(trip.horaFinal)]]} />
        <TicketGroup title="Kilometraje" rows={[["Km inicial", formatNumber(trip.kmInicial)], ["Km recogida", formatNumber(trip.kmRecogida)], ["Km final", formatNumber(trip.kmFinal)], ["Km totales", formatNumber(metrics.kmTotales)], ["Km viaje", formatNumber(metrics.kmViaje)]]} />
        <TicketGroup title="Dinero" rows={[["Valor viaje", formatCurrency(trip.valorViaje)], ["Propina", formatCurrency(trip.propina)], ["Comision", formatCurrency(trip.comision)], ["Impuestos", formatCurrency(trip.impuestos)], ["Neto", formatCurrency(trip.gananciaNeta)]]} />
      </div>
      <div className="mt-4 grid gap-3 rounded-2xl bg-slate-950/60 p-4 text-sm sm:grid-cols-3">
        <strong>Valor/km: {formatCurrency(metrics.valorPorKm)}</strong>
        <strong>Valor/hora: {formatCurrency(metrics.valorPorHora)}</strong>
        <strong>Duracion: {formatDuration(metrics.tiempoTotalMs)}</strong>
      </div>
    </Card>
  );
}

function TicketGroup({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="rounded-2xl bg-slate-950/60 p-4">
      <h4 className="font-black text-white">{title}</h4>
      <dl className="mt-3 grid gap-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 text-slate-300">
            <dt>{label}</dt>
            <dd className="font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
