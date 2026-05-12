import { createClient } from "@/lib/supabase/client";
import { enqueueOfflineAction } from "@/services/offlineQueue";
import type { Expense, Platform, Trip, WorkSession } from "@/types/domain";

export async function saveTrip(trip: Trip): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueueOfflineAction({ id: crypto.randomUUID(), type: "trip:create", payload: trip, createdAt: new Date().toISOString() });
    return;
  }
  const supabase = createClient();
  const { error } = await supabase.from("trips").insert(toTripRow(trip));
  if (error) throw error;
}

export async function loadTrips(userId: string): Promise<Trip[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("trips").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromTripRow);
}

export async function loadPlatforms(userId: string): Promise<Platform[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("platforms").select("*").eq("user_id", userId).order("name");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    name: row.name as string,
    color: row.color as `#${string}`,
    commissionRate: Number(row.commission_rate),
    taxRate: Number(row.tax_rate),
    createdAt: row.created_at as string
  }));
}

export async function saveExpense(expense: Expense): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    enqueueOfflineAction({ id: crypto.randomUUID(), type: "expense:create", payload: expense, createdAt: new Date().toISOString() });
    return;
  }
  const supabase = createClient();
  const { error } = await supabase.from("expenses").insert({
    id: expense.id,
    user_id: expense.userId,
    value: expense.value,
    category: expense.category,
    description: expense.description,
    created_at: expense.createdAt
  });
  if (error) throw error;
}

export async function saveWorkSession(session: WorkSession): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("work_sessions").upsert({
    id: session.id,
    user_id: session.userId,
    started_at: session.startedAt,
    ended_at: session.endedAt,
    status: session.status
  });
  if (error) throw error;
}

function toTripRow(trip: Trip) {
  return {
    id: trip.id,
    platform_id: trip.platformId,
    user_id: trip.userId,
    valor_viaje: trip.valorViaje,
    propina: trip.propina,
    comision: trip.comision,
    impuestos: trip.impuestos,
    libre_comision: trip.libreComision,
    hora_inicio: trip.horaInicio,
    hora_recogida: trip.horaRecogida,
    hora_final: trip.horaFinal,
    km_inicial: trip.kmInicial,
    km_recogida: trip.kmRecogida,
    km_final: trip.kmFinal,
    latitud_inicio: trip.latitudInicio,
    longitud_inicio: trip.longitudInicio,
    latitud_recogida: trip.latitudRecogida,
    longitud_recogida: trip.longitudRecogida,
    latitud_final: trip.latitudFinal,
    longitud_final: trip.longitudFinal,
    ganancia_neta: trip.gananciaNeta,
    created_at: trip.createdAt
  };
}

function fromTripRow(row: Record<string, unknown>): Trip {
  return {
    id: String(row.id),
    platformId: String(row.platform_id),
    userId: String(row.user_id),
    valorViaje: Number(row.valor_viaje),
    propina: Number(row.propina),
    comision: Number(row.comision),
    impuestos: Number(row.impuestos),
    libreComision: Boolean(row.libre_comision),
    horaInicio: String(row.hora_inicio),
    horaRecogida: String(row.hora_recogida),
    horaFinal: String(row.hora_final),
    kmInicial: Number(row.km_inicial),
    kmRecogida: Number(row.km_recogida),
    kmFinal: Number(row.km_final),
    latitudInicio: Number(row.latitud_inicio),
    longitudInicio: Number(row.longitud_inicio),
    latitudRecogida: Number(row.latitud_recogida),
    longitudRecogida: Number(row.longitud_recogida),
    latitudFinal: Number(row.latitud_final),
    longitudFinal: Number(row.longitud_final),
    gananciaNeta: Number(row.ganancia_neta),
    createdAt: String(row.created_at)
  };
}
