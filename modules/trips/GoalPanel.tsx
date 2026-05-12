"use client";

import { Target } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { useAppStore } from "@/store/appStore";
import { formatCurrency } from "@/utils/format";

type GoalPanelProps = {
  accent: string;
};

export function GoalPanel({ accent }: GoalPanelProps) {
  const goal = useAppStore((state) => state.goal);
  const trips = useAppStore((state) => state.trips);
  const setGoal = useAppStore((state) => state.setGoal);
  const earned = trips.reduce((total, trip) => total + trip.gananciaNeta, 0);
  const target = goal?.value ?? 250000;
  const percentage = Math.min(100, target > 0 ? (earned / target) * 100 : 0);

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ backgroundColor: accent }}>
          <Target size={22} />
        </span>
        <div>
          <p className="text-sm uppercase text-slate-400">Meta diaria</p>
          <h3 className="text-xl font-black">{formatCurrency(target)}</h3>
        </div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: accent }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300">
        <span>Ganado: {formatCurrency(earned)}</span>
        <span>Faltan: {formatCurrency(Math.max(0, target - earned))}</span>
      </div>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setGoal(Number(formData.get("goal") ?? target));
        }}
      >
        <Field label="Nueva meta" name="goal" type="number" inputMode="decimal" min="0" step="1000" defaultValue={target} />
        <Button type="submit" accent={accent} className="self-end">Guardar</Button>
      </form>
    </Card>
  );
}
