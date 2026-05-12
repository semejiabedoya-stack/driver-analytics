"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { SelectField } from "@/components/ui/Field";
import { useAppStore } from "@/store/appStore";
import { formatCurrency, formatDateTime, formatDuration, formatNumber } from "@/utils/format";
import { calculateTripMetrics } from "@/utils/calculations";

type HistoryModuleProps = {
  accent: string;
};

export function HistoryModule({ accent }: HistoryModuleProps) {
  const trips = useAppStore((state) => state.trips);
  const platforms = useAppStore((state) => state.platforms);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);

  const filteredTrips = useMemo(
    () =>
      trips.filter((trip) => {
        const platformMatch = platformFilter === "all" || trip.platformId === platformFilter;
        const freeMatch = !freeOnly || trip.libreComision;
        return platformMatch && freeMatch;
      }),
    [freeOnly, platformFilter, trips]
  );

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <SelectField label="Plataforma" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)}>
            <option value="all">Todas</option>
            {platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}
          </SelectField>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 text-sm font-semibold">
            <input className="h-5 w-5 accent-emerald-400" type="checkbox" checked={freeOnly} onChange={(event) => setFreeOnly(event.target.checked)} />
            Viajes libres comision
          </label>
        </div>
      </Card>
      <div className="grid gap-3">
        {filteredTrips.map((trip) => {
          const platform = platforms.find((item) => item.id === trip.platformId) ?? platforms[0];
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
            <Card key={trip.id}>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: platform.color }}>{platform.name}</span>
                  <h3 className="mt-3 text-xl font-black">{formatCurrency(trip.gananciaNeta)}</h3>
                  <p className="text-sm text-slate-400">{formatDateTime(trip.horaInicio)} · {formatDuration(metrics.tiempoTotalMs)}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-slate-300">
                  <span>Valor<br /><strong className="text-white">{formatCurrency(trip.valorViaje)}</strong></span>
                  <span>Km<br /><strong className="text-white">{formatNumber(metrics.kmTotales)}</strong></span>
                  <span>Neto<br /><strong className="text-white">{formatCurrency(trip.gananciaNeta)}</strong></span>
                </div>
              </div>
            </Card>
          );
        })}
        {filteredTrips.length === 0 ? <Card><p className="text-slate-400">Todavia no hay viajes con estos filtros.</p></Card> : null}
      </div>
    </div>
  );
}
