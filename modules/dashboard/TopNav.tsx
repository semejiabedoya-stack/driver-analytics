"use client";

import { BarChart3, CarFront, Clock3, Settings } from "lucide-react";

type ViewKey = "trips" | "reports" | "history" | "settings";

type TopNavProps = {
  activeView: ViewKey;
  onChange: (view: ViewKey) => void;
  accent: string;
};

const navItems = [
  { key: "trips", label: "Viajes", icon: CarFront },
  { key: "reports", label: "Reportes", icon: BarChart3 },
  { key: "history", label: "Historial", icon: Clock3 }
] satisfies Array<{ key: ViewKey; label: string; icon: typeof CarFront }>;

export function TopNav({ activeView, onChange, accent }: TopNavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-background/90 px-4 py-3 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center gap-2">
        <button
          aria-label="Driver Analytics"
          className="mr-auto grid h-11 w-11 place-items-center rounded-2xl text-white shadow-glow"
          style={{ backgroundColor: accent }}
        >
          <CarFront size={22} />
        </button>
        <div className="flex rounded-2xl border border-white/10 bg-white/[.06] p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-300 transition"
                style={isActive ? { backgroundColor: accent, color: "#fff" } : undefined}
                onClick={() => onChange(item.key)}
              >
                <Icon size={17} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
        <button
          aria-label="Configuracion"
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[.06] text-slate-100 transition hover:bg-white/10"
          onClick={() => onChange("settings")}
          style={activeView === "settings" ? { backgroundColor: accent, color: "#fff" } : undefined}
        >
          <Settings size={20} />
        </button>
      </nav>
    </header>
  );
}
