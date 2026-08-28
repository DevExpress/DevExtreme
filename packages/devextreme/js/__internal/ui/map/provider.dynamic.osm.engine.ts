import type { MapLocation } from '@js/ui/map';

export const SUBDOMAIN_PLACEHOLDER = '{s}';

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

export interface MapEngineBounds {
  northEast: MapLocation;
  southWest: MapLocation;
}

export interface MapEngineViewState extends MapEngineSetViewOptions {
  bounds?: MapEngineBounds;
}

export interface MapEngineClickEvent {
  event?: Event;
  location: MapLocation;
}

export interface MapEngineEventHandlers {
  click: (event: MapEngineClickEvent) => void;
  viewChange: (view: MapEngineViewState) => void;
}

export interface MapEngineMap {
  readonly originalMap: unknown;
  attachHandlers: (handlers: MapEngineEventHandlers) => void;
  dispose: () => void;
  fitBounds: (bounds: MapEngineBounds) => void;
  replaceTileLayer: (options: MapEngineTileLayerOptions) => void;
  setControls: (visible: boolean) => void;
  setDisabled: (disabled: boolean) => void;
  setFocus: (enabled: boolean, tabIndex: number) => void;
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
