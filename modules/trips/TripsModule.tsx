"use client";

import { useMemo } from "react";
import { ExpenseForm } from "@/modules/trips/ExpenseForm";
import { GoalPanel } from "@/modules/trips/GoalPanel";
import { PlatformSelector } from "@/modules/trips/PlatformSelector";
import { TripForm } from "@/modules/trips/TripForm";
import { TripTicket } from "@/modules/trips/TripTicket";
import { WorkSessionPanel } from "@/modules/trips/WorkSessionPanel";
import { useAppStore } from "@/store/appStore";

type TripsModuleProps = {
  accent: string;
};

export function TripsModule({ accent }: TripsModuleProps) {
  const platforms = useAppStore((state) => state.platforms);
  const selectedPlatformId = useAppStore((state) => state.selectedPlatformId);
  const setSelectedPlatform = useAppStore((state) => state.setSelectedPlatform);
  const trips = useAppStore((state) => state.trips);
  const platform = useMemo(() => platforms.find((item) => item.id === selectedPlatformId) ?? platforms[0], [platforms, selectedPlatformId]);
  const lastTrip = trips[0];
  const lastPlatform = lastTrip ? platforms.find((item) => item.id === lastTrip.platformId) ?? platform : platform;

  return (
    <div className="grid gap-5">
      <PlatformSelector platforms={platforms} selectedPlatformId={selectedPlatformId} onSelect={setSelectedPlatform} />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="grid gap-5">
          <WorkSessionPanel accent={accent} />
          <TripForm platform={platform} accent={accent} />
          <ExpenseForm accent={accent} />
        </div>
        <div className="grid content-start gap-5">
          <GoalPanel accent={accent} />
          {lastTrip ? <TripTicket trip={lastTrip} platform={lastPlatform} /> : null}
        </div>
      </div>
    </div>
  );
}
