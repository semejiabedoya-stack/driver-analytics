"use client";

import { useEffect } from "react";
import { clearOfflineQueue, readOfflineQueue } from "@/services/offlineQueue";
import { saveExpense, saveTrip } from "@/services/tripService";
import type { Expense, Trip } from "@/types/domain";

export function useOnlineSync() {
  useEffect(() => {
    async function syncQueue() {
      if (!navigator.onLine) return;
      const queue = readOfflineQueue();
      if (queue.length === 0) return;
      for (const action of queue) {
        if (action.type === "trip:create") await saveTrip(action.payload as Trip);
        if (action.type === "expense:create") await saveExpense(action.payload as Expense);
      }
      clearOfflineQueue();
    }

    window.addEventListener("online", syncQueue);
    void syncQueue();
    return () => window.removeEventListener("online", syncQueue);
  }, []);
}
