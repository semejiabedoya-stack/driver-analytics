"use client";

import { useCallback, useState } from "react";
import type { GpsPoint } from "@/types/domain";

export function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = useCallback(async (): Promise<GpsPoint> => {
    setIsLoading(true);
    setError(null);
    try {
      const point = await new Promise<GpsPoint>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("GPS no disponible en este dispositivo."));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
          () => reject(new Error("No se pudo obtener la ubicacion.")),
          { enableHighAccuracy: true, timeout: 12_000, maximumAge: 10_000 }
        );
      });
      return point;
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Error de GPS.";
      setError(message);
      return { latitude: 10.391, longitude: -75.479 };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { getCurrentPosition, isLoading, error };
}
