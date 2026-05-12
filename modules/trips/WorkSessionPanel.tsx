"use client";

import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/appStore";
import { calculateWorkSessionTimes } from "@/utils/calculations";
import { formatDuration } from "@/utils/format";

type WorkSessionPanelProps = {
  accent: string;
};

export function WorkSessionPanel({ accent }: WorkSessionPanelProps) {
  const currentSession = useAppStore((state) => state.currentSession);
  const startSession = useAppStore((state) => state.startSession);
  const pauseSession = useAppStore((state) => state.pauseSession);
  const resumeSession = useAppStore((state) => state.resumeSession);
  const finishSession = useAppStore((state) => state.finishSession);
  const times = calculateWorkSessionTimes(currentSession);

  return (
    <Card>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="mr-auto">
          <p className="text-sm uppercase text-slate-400">Jornada laboral</p>
          <h2 className="text-2xl font-black text-white">{currentSession?.status === "running" ? "En linea" : currentSession?.status === "paused" ? "Pausada" : "Lista para iniciar"}</h2>
          <p className="mt-1 text-sm text-slate-400">
            Conectado {formatDuration(times.tiempoConectadoMs)} · Pausado {formatDuration(times.tiempoPausadoMs)} · Efectivo {formatDuration(times.tiempoEfectivoMs)}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Button accent={accent} onClick={startSession} disabled={Boolean(currentSession)}>
            <Play size={18} /> INICIAR JORNADA
          </Button>
          <Button variant="secondary" onClick={currentSession?.status === "paused" ? resumeSession : pauseSession} disabled={!currentSession}>
            <Pause size={18} /> {currentSession?.status === "paused" ? "REANUDAR" : "PAUSAR"}
          </Button>
          <Button variant="danger" onClick={finishSession} disabled={!currentSession}>
            <Square size={18} /> FINALIZAR
          </Button>
        </div>
      </div>
    </Card>
  );
}
