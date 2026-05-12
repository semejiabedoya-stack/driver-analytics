import "leaflet";

declare module "leaflet" {
  export type HeatLatLngTuple = [number, number, number?];

  export type HeatLayerOptions = {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  };

  export function heatLayer(latlngs: HeatLatLngTuple[], options?: HeatLayerOptions): Layer;
}
