"use client";

import type { Platform } from "@/types/domain";

type PlatformSelectorProps = {
  platforms: Platform[];
  selectedPlatformId: string;
  onSelect: (platformId: string) => void;
};

export function PlatformSelector({ platforms, selectedPlatformId, onSelect }: PlatformSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {platforms.map((platform) => {
        const isSelected = platform.id === selectedPlatformId;
        return (
          <button
            key={platform.id}
            className="min-h-16 rounded-2xl border px-4 text-left font-black text-white transition active:scale-[.98]"
            style={{
              borderColor: isSelected ? platform.color : "rgba(255,255,255,.1)",
              background: isSelected ? platform.color : "rgba(255,255,255,.06)"
            }}
            onClick={() => onSelect(platform.id)}
          >
            {platform.name}
            <span className="mt-1 block text-xs font-semibold opacity-80">
              Comision {Math.round(platform.commissionRate * 100)}% · Imp {Math.round(platform.taxRate * 100)}%
            </span>
          </button>
        );
      })}
    </div>
  );
}
