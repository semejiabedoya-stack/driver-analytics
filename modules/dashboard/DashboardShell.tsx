"use client";

import { useMemo, useState } from "react";
import { TopNav } from "@/modules/dashboard/TopNav";
import { TripsModule } from "@/modules/trips/TripsModule";
import { ReportsModule } from "@/modules/reports/ReportsModule";
import { HistoryModule } from "@/modules/history/HistoryModule";
import { SettingsModule } from "@/modules/settings/SettingsModule";
import { useOnlineSync } from "@/hooks/useOnlineSync";
import { useAppStore } from "@/store/appStore";

type ViewKey = "trips" | "reports" | "history" | "settings";

export function DashboardShell() {
  const [activeView, setActiveView] = useState<ViewKey>("trips");
  const platforms = useAppStore((state) => state.platforms);
  const selectedPlatformId = useAppStore((state) => state.selectedPlatformId);
  useOnlineSync();

  const activePlatform = useMemo(
    () => platforms.find((platform) => platform.id === selectedPlatformId) ?? platforms[0],
    [platforms, selectedPlatformId]
  );

  return (
    <main className="min-h-screen pb-10 pt-24">
      <TopNav activeView={activeView} onChange={setActiveView} accent={activePlatform.color} />
      <div className="mx-auto grid max-w-6xl gap-5 px-4">
        <section>
          <p className="text-sm font-semibold uppercase text-slate-400">Driver Analytics</p>
          <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">Control inteligente de viajes</h1>
        </section>
        {activeView === "trips" ? <TripsModule accent={activePlatform.color} /> : null}
        {activeView === "reports" ? <ReportsModule accent={activePlatform.color} /> : null}
        {activeView === "history" ? <HistoryModule accent={activePlatform.color} /> : null}
        {activeView === "settings" ? <SettingsModule accent={activePlatform.color} /> : null}
      </div>
    </main>
  );
}
