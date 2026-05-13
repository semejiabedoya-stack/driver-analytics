"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, MapPin, Receipt, Route } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NumericField } from "@/components/ui/Field";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAppStore } from "@/store/appStore";
import type { Platform, Trip } from "@/types/domain";
import { calculateTripMetrics } from "@/utils/calculations";
import { formatCurrency } from "@/utils/format";

const moneySchema = z.coerce.number().min(0);
const schema = z.object({
  valorViaje: moneySchema,
  propina: moneySchema.default(0),
  kmInicial: z.coerce.number().min(0).optional(),
  kmRecogida: z.coerce.number().min(0).optional(),
  kmFinal: z.coerce.number().min(0).optional(),
  hasTip: z.boolean().default(false),
  libreComision: z.boolean().default(false)
});

type TripFormValues = z.infer<typeof schema>;

type TripFormProps = {
  platform: Platform;
  accent: string;
};

export function TripForm({ platform, accent }: TripFormProps) {
  const [step, setStep] = useState<"ready" | "started" | "picked">("ready");
  const { getCurrentPosition, isLoading, error } = useGeolocation();
  const currentTrip = useAppStore((state) => state.currentTrip);
  const startTrip = useAppStore((state) => state.startTrip);
  const updateTripDraft = useAppStore((state) => state.updateTripDraft);
  const completeTrip = useAppStore((state) => state.completeTrip);
  const form = useForm<TripFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { valorViaje: 0, propina: 0, hasTip: false, libreComision: false }
  });
  const values = form.watch();

  const preview = useMemo(
    () =>
      calculateTripMetrics(
        {
          platformId: platform.id,
          valorViaje: Number(values.valorViaje) || 0,
          propina: values.hasTip ? Number(values.propina) || 0 : 0,
          libreComision: values.libreComision
        },
        platform
      ),
    [platform, values.hasTip, values.libreComision, values.propina, values.valorViaje]
  );

  async function handleStart(formValues: TripFormValues) {
    const gps = await getCurrentPosition();
    startTrip({
      platformId: platform.id,
      valorViaje: formValues.valorViaje,
      propina: formValues.hasTip ? formValues.propina : 0,
      libreComision: formValues.libreComision,
      horaInicio: new Date().toISOString(),
      kmInicial: Number(formValues.kmInicial ?? 0),
      gpsInicio: gps
    });
    setStep("started");
  }

  async function handlePickup() {
    const gps = await getCurrentPosition();
    updateTripDraft({ horaRecogida: new Date().toISOString(), kmRecogida: Number(form.getValues("kmRecogida") ?? 0), gpsRecogida: gps });
    setStep("picked");
  }

  async function handleFinish() {
    if (!currentTrip?.horaInicio || !currentTrip.gpsInicio) return;
    const gps = await getCurrentPosition();
    const formValues = form.getValues();
    const horaInicio = currentTrip.horaInicio;
    const gpsInicio = currentTrip.gpsInicio;
    const draft = {
      ...currentTrip,
      valorViaje: formValues.valorViaje,
      propina: formValues.hasTip ? formValues.propina : 0,
      libreComision: formValues.libreComision,
      horaFinal: new Date().toISOString(),
      kmInicial: Number(formValues.kmInicial ?? currentTrip.kmInicial ?? 0),
      kmRecogida: Number(formValues.kmRecogida ?? currentTrip.kmRecogida ?? currentTrip.kmInicial ?? 0),
      kmFinal: Number(formValues.kmFinal ?? 0),
      gpsFinal: gps
    };
    const metrics = calculateTripMetrics(draft, platform);
    const trip: Trip = {
      id: crypto.randomUUID(),
      platformId: platform.id,
      valorViaje: draft.valorViaje,
      propina: draft.propina,
      comision: metrics.comision,
      impuestos: metrics.impuestos,
      libreComision: draft.libreComision,
      horaInicio,
      horaRecogida: draft.horaRecogida ?? horaInicio,
      horaFinal: draft.horaFinal,
      kmInicial: draft.kmInicial ?? 0,
      kmRecogida: draft.kmRecogida ?? draft.kmInicial ?? 0,
      kmFinal: draft.kmFinal,
      latitudInicio: gpsInicio.latitude,
      longitudInicio: gpsInicio.longitude,
      latitudRecogida: draft.gpsRecogida?.latitude ?? gpsInicio.latitude,
      longitudRecogida: draft.gpsRecogida?.longitude ?? gpsInicio.longitude,
      latitudFinal: draft.gpsFinal.latitude,
      longitudFinal: draft.gpsFinal.longitude,
      gananciaNeta: metrics.gananciaNeta,
      createdAt: new Date().toISOString()
    };
    completeTrip(trip);
    form.reset({ valorViaje: 0, propina: 0, hasTip: false, libreComision: false });
    setStep("ready");
  }

  return (
    <Card>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleStart)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase text-slate-400">Nuevo viaje</p>
            <h2 className="text-2xl font-black">Servicio {platform.name}</h2>
          </div>
          <span className="rounded-full px-3 py-1 text-sm font-black text-white" style={{ backgroundColor: accent }}>{formatCurrency(preview.gananciaNeta)}</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Controller
            control={form.control}
            name="valorViaje"
            render={({ field }) => <NumericField label="Valor viaje" mode="money" value={field.value} onValueChange={field.onChange} placeholder="Puedes ponerlo al final" />}
          />
          <Controller
            control={form.control}
            name="kmInicial"
            render={({ field }) => <NumericField label="Km inicial" value={field.value} onValueChange={field.onChange} />}
          />
          <Controller
            control={form.control}
            name="kmRecogida"
            render={({ field }) => <NumericField label="Km recogida" value={field.value} onValueChange={field.onChange} disabled={step === "ready"} />}
          />
          <Controller
            control={form.control}
            name="kmFinal"
            render={({ field }) => <NumericField label="Km final" value={field.value} onValueChange={field.onChange} disabled={step !== "picked"} />}
          />
          {values.hasTip ? (
            <Controller
              control={form.control}
              name="propina"
              render={({ field }) => <NumericField label="Propina" mode="money" value={field.value} onValueChange={field.onChange} />}
            />
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-14 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 text-sm font-semibold">
            Agregar propina
            <input className="h-5 w-5 accent-emerald-400" type="checkbox" {...form.register("hasTip")} />
          </label>
          <label className="flex min-h-14 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 text-sm font-semibold">
            Libre comision
            <input className="h-5 w-5 accent-emerald-400" type="checkbox" {...form.register("libreComision")} />
          </label>
        </div>
        {error ? <p className="text-sm text-amber-300">{error}</p> : null}
        <div className="grid gap-2 sm:grid-cols-3">
          <Button type="submit" accent={accent} disabled={step !== "ready" || isLoading}>
            <Flag size={18} /> INICIAR
          </Button>
          <Button type="button" variant="secondary" onClick={handlePickup} disabled={step !== "started" || isLoading}>
            <MapPin size={18} /> RECOGIDA
          </Button>
          <Button type="button" accent={accent} onClick={handleFinish} disabled={step !== "picked" || isLoading}>
            <Receipt size={18} /> FINALIZAR
          </Button>
        </div>
        <div className="grid gap-2 rounded-2xl bg-slate-950/60 p-4 text-sm text-slate-300 sm:grid-cols-3">
          <span><Route className="inline" size={16} /> Comision {formatCurrency(preview.comision)}</span>
          <span>Impuestos sobre comision {formatCurrency(preview.impuestos)}</span>
          <span>Neto estimado {formatCurrency(preview.gananciaNeta)}</span>
        </div>
      </form>
    </Card>
  );
}
