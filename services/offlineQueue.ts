const QUEUE_KEY = "driver-analytics-offline-queue";

export type OfflineAction<TPayload extends object> = {
  id: string;
  type: "trip:create" | "expense:create" | "session:update";
  payload: TPayload;
  createdAt: string;
};

export function readOfflineQueue(): OfflineAction<object>[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed.filter(isOfflineAction) : [];
}

export function enqueueOfflineAction<TPayload extends object>(action: OfflineAction<TPayload>): void {
  if (typeof window === "undefined") return;
  const queue = readOfflineQueue();
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, action]));
}

export function clearOfflineQueue(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(QUEUE_KEY);
}

function isOfflineAction(value: unknown): value is OfflineAction<object> {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && typeof record.type === "string" && typeof record.createdAt === "string" && typeof record.payload === "object";
}
