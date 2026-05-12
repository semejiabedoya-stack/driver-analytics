"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Expense, Goal, Platform, Trip, TripDraft, WorkSession } from "@/types/domain";
import { DEFAULT_PLATFORMS } from "@/utils/constants";

type AppState = {
  platforms: Platform[];
  selectedPlatformId: string;
  trips: Trip[];
  expenses: Expense[];
  sessions: WorkSession[];
  currentSession?: WorkSession;
  currentTrip?: TripDraft;
  goal?: Goal;
  setSelectedPlatform: (platformId: string) => void;
  upsertPlatform: (platform: Platform) => void;
  deletePlatform: (platformId: string) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  finishSession: () => void;
  setGoal: (value: number) => void;
  startTrip: (draft: TripDraft) => void;
  updateTripDraft: (draft: Partial<TripDraft>) => void;
  completeTrip: (trip: Trip) => void;
  addExpense: (expense: Expense) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      platforms: DEFAULT_PLATFORMS,
      selectedPlatformId: "didi",
      trips: [],
      expenses: [],
      sessions: [],
      setSelectedPlatform: (platformId) => set({ selectedPlatformId: platformId }),
      upsertPlatform: (platform) =>
        set((state) => ({
          platforms: state.platforms.some((item) => item.id === platform.id)
            ? state.platforms.map((item) => (item.id === platform.id ? platform : item))
            : [...state.platforms, platform]
        })),
      deletePlatform: (platformId) => set((state) => ({ platforms: state.platforms.filter((platform) => platform.id !== platformId) })),
      startSession: () =>
        set({
          currentSession: { id: crypto.randomUUID(), startedAt: new Date().toISOString(), status: "running", pauses: [] }
        }),
      pauseSession: () =>
        set((state) => {
          if (!state.currentSession || state.currentSession.status !== "running") return state;
          return {
            currentSession: {
              ...state.currentSession,
              status: "paused",
              pauses: [...state.currentSession.pauses, { id: crypto.randomUUID(), sessionId: state.currentSession.id, startedAt: new Date().toISOString() }]
            }
          };
        }),
      resumeSession: () =>
        set((state) => {
          if (!state.currentSession || state.currentSession.status !== "paused") return state;
          const pauses = state.currentSession.pauses.map((pause, index, source) =>
            index === source.length - 1 ? { ...pause, endedAt: new Date().toISOString() } : pause
          );
          return { currentSession: { ...state.currentSession, status: "running", pauses } };
        }),
      finishSession: () =>
        set((state) => {
          if (!state.currentSession) return state;
          const finished: WorkSession = { ...state.currentSession, endedAt: new Date().toISOString(), status: "finished" };
          return { currentSession: undefined, sessions: [finished, ...state.sessions] };
        }),
      setGoal: (value) => set({ goal: { id: crypto.randomUUID(), date: new Date().toISOString(), value } }),
      startTrip: (draft) => set({ currentTrip: draft }),
      updateTripDraft: (draft) => set((state) => ({ currentTrip: state.currentTrip ? { ...state.currentTrip, ...draft } : undefined })),
      completeTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips], currentTrip: undefined })),
      addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] }))
    }),
    { name: "driver-analytics-store" }
  )
);
