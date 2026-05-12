"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/Card";
import { SelectField } from "@/components/ui/Field";
import { StatCard } from "@/components/ui/StatCard";
import { useAppStore } from "@/store/appStore";
import { calculateReport } from "@/utils/calculations";
import { formatCurrency, formatDuration, formatNumber } from "@/utils/format";

const MapModule = dynamic(() => import("@/modules/maps/MapModule").then((module) => module.MapModule), {
  ssr: false,
  loading: () => <Card><p className="text-slate-400">Cargando mapas...</p></Card>
});

type ReportsModuleProps = {
  accent: string;
};

export function ReportsModule({ accent }: ReportsModuleProps) {
  const trips = useAppStore((state) => state.trips);
  const expenses = useAppStore((state) => state.expenses);
  const sessions = useAppStore((state) => state.sessions);
  const platforms = useAppStore((state) => state.platforms);
  const [platformFilter, setPlatformFilter] = useState("all");
  const filteredTrips = useMemo(() => trips.filter((trip) => platformFilter === "all" || trip.platformId === platformFilter), [platformFilter, trips]);
  const report = useMemo(() => calculateReport(filteredTrips, expenses, sessions, platforms), [expenses, filteredTrips, platforms, sessions]);
  const chartData = platforms.map((platform) => ({
    name: platform.name,
    neto: filteredTrips.filter((trip) => trip.platformId === platform.id).reduce((total, trip) => total + trip.gananciaNeta, 0)
  }));

  return (
    <div className="grid gap-5">
      <Card>
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField label="Periodo">
            <option>Dia</option>
            <option>Semana</option>
            <option>Mes</option>
            <option>Rango personalizado</option>
          </SelectField>
          <SelectField label="Plataforma" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)}>
            <option value="all">Todas</option>
            {platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}
          </SelectField>
          <SelectField label="Mapa">
            <option>Actividad</option>
            <option>Rentabilidad</option>
            <option>Tiempo muerto</option>
          </SelectField>
        </div>
      </Card>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Dinero bruto" value={formatCurrency(report.dineroBruto)} accent={accent} />
        <StatCard label="Dinero neto" value={formatCurrency(report.dineroNeto)} accent={accent} />
        <StatCard label="Propinas" value={formatCurrency(report.propinas)} accent={accent} />
        <StatCard label="Gastos" value={formatCurrency(report.gastos)} accent={accent} />
        <StatCard label="Utilidad real" value={formatCurrency(report.utilidadReal)} accent={accent} />
        <StatCard label="Km recorridos" value={formatNumber(report.kmRecorridos)} detail="Totales" accent={accent} />
        <StatCard label="Tiempo efectivo" value={formatDuration(report.tiempoEfectivoMs)} detail={`Pausado ${formatDuration(report.tiempoPausadoMs)}`} accent={accent} />
        <StatCard label="Horas muertas" value={formatDuration(report.tiempoMuertoMs)} detail="Entre viajes" accent={accent} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <Card>
          <h2 className="text-xl font-black">Rentabilidad por plataforma</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12 }} />
                <Bar dataKey="neto" fill={accent} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Analisis inteligente</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <p>Mejores horas: {report.mejoresHoras.map((hour) => `${hour}:00`).join(", ") || "Sin datos"}</p>
            <p>Peores horas: {report.peoresHoras.map((hour) => `${hour}:00`).join(", ") || "Sin datos"}</p>
            <p>Mejores dias: {report.mejoresDias.join(", ") || "Sin datos"}</p>
            <p>Mejores plataformas: {report.mejoresPlataformas.join(", ") || "Sin datos"}</p>
            <p>Bocagrande produce mas ganancias entre 6PM y 10PM cuando el heatmap concentra puntos rojos de alta utilidad.</p>
            <p>Centro muestra mas tiempo muerto si los puntos de finalizacion quedan lejos del siguiente inicio.</p>
          </div>
        </Card>
      </div>
      <MapModule trips={filteredTrips} platforms={platforms} />
    </div>
  );
}
