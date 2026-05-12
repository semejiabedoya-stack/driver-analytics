"use client";

import { Fragment, useEffect, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { Card } from "@/components/ui/Card";
import type { Platform, Trip } from "@/types/domain";
import { formatCurrency } from "@/utils/format";

type MapModuleProps = {
  trips: Trip[];
  platforms: Platform[];
};

export function MapModule({ trips, platforms }: MapModuleProps) {
  const center = useMemo<[number, number]>(() => {
    const trip = trips[0];
    return trip ? [trip.latitudInicio, trip.longitudInicio] : [10.391, -75.479];
  }, [trips]);
  const heatPoints = trips.flatMap((trip) => [
    [trip.latitudInicio, trip.longitudInicio, Math.max(0.2, trip.gananciaNeta / 100000)] as [number, number, number],
    [trip.latitudRecogida, trip.longitudRecogida, Math.max(0.2, trip.gananciaNeta / 100000)] as [number, number, number],
    [trip.latitudFinal, trip.longitudFinal, Math.max(0.2, trip.gananciaNeta / 100000)] as [number, number, number]
  ]);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Mapa y heatmap inteligente</h2>
          <p className="text-sm text-slate-400">Inicio, recogida, finalizacion y zonas rentables.</p>
        </div>
      </div>
      <MapContainer center={center} zoom={13} scrollWheelZoom className="z-0">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatLayer points={heatPoints} />
        {trips.slice(0, 30).map((trip) => {
          const platform = platforms.find((item) => item.id === trip.platformId) ?? platforms[0];
          const positions: [number, number][] = [
            [trip.latitudInicio, trip.longitudInicio],
            [trip.latitudRecogida, trip.longitudRecogida],
            [trip.latitudFinal, trip.longitudFinal]
          ];
          return (
            <Fragment key={trip.id}>
              <Polyline positions={positions} pathOptions={{ color: platform.color, weight: 4 }} />
              {positions.map((position, index) => (
                <CircleMarker key={`${trip.id}-${index}`} center={position} radius={8} pathOptions={{ color: platform.color, fillOpacity: 0.85 }}>
                  <Popup>{platform.name} · {formatCurrency(trip.gananciaNeta)}</Popup>
                </CircleMarker>
              ))}
            </Fragment>
          );
        })}
      </MapContainer>
    </Card>
  );
}

function HeatLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    const layer = L.heatLayer(points, {
      radius: 28,
      blur: 18,
      gradient: { 0.2: "#22c55e", 0.45: "#facc15", 0.7: "#f97316", 1: "#ef4444" }
    }).addTo(map);
    return () => {
      layer.remove();
    };
  }, [map, points]);

  return null;
}
