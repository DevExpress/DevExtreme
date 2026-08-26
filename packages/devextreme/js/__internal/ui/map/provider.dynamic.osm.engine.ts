import type { MapLocation } from '@js/ui/map';

export interface MapEngineTileLayerOptions {
  attribution?: string;
  maxZoom: number;
  subdomains?: string | string[];
  url: string;
}

export interface MapEngineSetViewOptions {
  center?: MapLocation;
  zoom?: number;
}

export interface MapEngineMap {
  readonly originalMap: unknown;
  dispose: () => void;
  replaceTileLayer: (options: MapEngineTileLayerOptions) => void;
  setView: (options: MapEngineSetViewOptions) => void;
  updateDimensions: () => void;
}

export interface MapEngine {
  createMap: (container: Element, view?: MapEngineSetViewOptions) => MapEngineMap;
}

const registry: { mapEngine?: MapEngine } = {};

export const getRegisteredMapEngine = (): MapEngine | undefined => registry.mapEngine;

export const setRegisteredMapEngine = (engine: MapEngine | undefined): void => {
  registry.mapEngine = engine;
};
