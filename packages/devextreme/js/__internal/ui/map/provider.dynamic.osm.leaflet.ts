import type { PlainLocation } from './provider.dynamic';

type LeafletOptions = Record<string, unknown>;

interface LeafletHandler {
  disable: () => void;
  enable: () => void;
}

interface LeafletInteractionMap {
  boxZoom?: LeafletHandler;
  doubleClickZoom?: LeafletHandler;
  dragging?: LeafletHandler;
  keyboard?: LeafletHandler;
  scrollWheelZoom?: LeafletHandler;
  touchZoom?: LeafletHandler;
}

export interface LeafletBounds {
  extend: (location: PlainLocation) => void;
  getNorthEast: () => PlainLocation;
  getSouthWest: () => PlainLocation;
}

export interface LeafletLayer {
  addTo: (map: unknown) => LeafletLayer;
  remove: () => void;
}

export interface LeafletMarker extends LeafletLayer {
  bindPopup: (popup: LeafletPopup) => void;
  off: (event: string, handler: unknown) => void;
  on: (event: string, handler: unknown) => void;
  openPopup: () => void;
}

export interface LeafletPolyline extends LeafletLayer {
  getBounds: () => LeafletBounds;
}

export interface LeafletPopup {
  setContent: (content: string) => LeafletPopup;
}

export interface LeafletZoomControl {
  addTo: (map: unknown) => void;
  remove: () => void;
}

interface LeafletMapCreationOptions {
  center: PlainLocation;
  interactionsEnabled: boolean;
  zoom?: number;
}

interface LeafletFactoryApi {
  control: {
    zoom: () => LeafletZoomControl;
  };
  divIcon: (options: LeafletOptions) => unknown;
  icon: (options: LeafletOptions) => unknown;
  latLngBounds: (
    southWest: PlainLocation,
    northEast: PlainLocation,
  ) => LeafletBounds;
  map: (container: Element, options: LeafletOptions) => unknown;
  marker: (location: PlainLocation, options?: LeafletOptions) => LeafletMarker;
  polyline: (
    locations: [number, number][],
    options: LeafletOptions,
  ) => LeafletPolyline;
  popup: (options: LeafletOptions) => LeafletPopup;
  tileLayer: (url: string, options: LeafletOptions) => LeafletLayer;
}

export interface LeafletAdapter {
  createBounds: (
    southWest: PlainLocation,
    northEast: PlainLocation,
  ) => LeafletBounds;
  createDivIcon: (options: LeafletOptions) => unknown;
  createIcon: (options: LeafletOptions) => unknown;
  createMap: (container: Element, options: LeafletMapCreationOptions) => unknown;
  createMarker: (location: PlainLocation, options?: LeafletOptions) => LeafletMarker;
  createPolyline: (
    locations: [number, number][],
    options: LeafletOptions,
  ) => LeafletPolyline;
  createPopup: (options: LeafletOptions) => LeafletPopup;
  createTileLayer: (url: string, options: LeafletOptions) => LeafletLayer;
  createZoomControl: () => LeafletZoomControl;
  extendBounds: (
    bounds: LeafletBounds | undefined,
    location: PlainLocation,
  ) => LeafletBounds;
  setInteractionsEnabled: (map: LeafletInteractionMap, enabled: boolean) => void;
}

const FACTORY_METHODS = [
  'divIcon',
  'icon',
  'latLngBounds',
  'map',
  'marker',
  'polyline',
  'popup',
  'tileLayer',
];

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && typeof value === 'object'
);

const hasMethods = (
  candidate: Record<string, unknown>,
  methods: string[],
): boolean => methods.every((method) => typeof candidate[method] === 'function');

const isFactoryApi = (engine: unknown): engine is LeafletFactoryApi => {
  if (!isRecord(engine) || !hasMethods(engine, FACTORY_METHODS) || !isRecord(engine.control)) {
    return false;
  }

  return typeof engine.control.zoom === 'function';
};

const createMapOptions = (
  options: LeafletMapCreationOptions,
): LeafletOptions => {
  const { center, interactionsEnabled, zoom } = options;

  return {
    attributionControl: true,
    boxZoom: interactionsEnabled,
    center,
    doubleClickZoom: interactionsEnabled,
    dragging: interactionsEnabled,
    keyboard: interactionsEnabled,
    scrollWheelZoom: interactionsEnabled,
    touchZoom: interactionsEnabled,
    zoom,
    zoomControl: false,
  };
};

const extendBounds = (
  createBounds: LeafletAdapter['createBounds'],
  bounds: LeafletBounds | undefined,
  location: PlainLocation,
): LeafletBounds => {
  if (bounds) {
    bounds.extend(location);
    return bounds;
  }

  return createBounds(location, location);
};

const setInteractionsEnabled = (
  map: LeafletInteractionMap,
  enabled: boolean,
  touchZoomHandler: LeafletHandler | undefined,
): void => {
  const handlers = [
    map.dragging,
    touchZoomHandler,
    map.doubleClickZoom,
    map.scrollWheelZoom,
    map.boxZoom,
    map.keyboard,
  ];

  handlers.forEach((handler) => {
    if (enabled) {
      handler?.enable();
    } else {
      handler?.disable();
    }
  });
};

const createFactoryAdapter = (api: LeafletFactoryApi): LeafletAdapter => {
  const createBounds = (
    southWest: PlainLocation,
    northEast: PlainLocation,
  ): LeafletBounds => api.latLngBounds(southWest, northEast);

  return {
    createBounds,
    createDivIcon: (options) => api.divIcon(options),
    createIcon: (options) => api.icon(options),
    createMap: (container, options) => api.map(
      container,
      createMapOptions(options),
    ),
    createMarker: (location, options) => api.marker(location, options),
    createPolyline: (locations, options) => api.polyline(locations, options),
    createPopup: (options) => api.popup(options),
    createTileLayer: (url, options) => api.tileLayer(url, options),
    createZoomControl: () => api.control.zoom(),
    extendBounds: (bounds, location) => extendBounds(createBounds, bounds, location),
    setInteractionsEnabled: (map, enabled): void => {
      setInteractionsEnabled(map, enabled, map.touchZoom);
    },
  };
};

export const createLeafletAdapter = (engine: unknown): LeafletAdapter | undefined => {
  if (isFactoryApi(engine)) {
    return createFactoryAdapter(engine);
  }

  return undefined;
};
