import type { MapLocation } from '@js/ui/map';

import type { MapEngineTileLayerOptions } from './provider.dynamic.osm.engine';
import { SUBDOMAIN_PLACEHOLDER } from './provider.dynamic.osm.engine';

export type Options = Record<string, unknown>;
export type Coordinate = [number, number];
export type Extent = [number, number, number, number];

export const GEOGRAPHIC_PROJECTION = 'EPSG:4326';
export const DEFAULT_VIEW_PROJECTION = 'EPSG:3857';

export type ControlLike = object;

export interface InteractionLike {
  getActive: () => boolean;
  setActive: (active: boolean) => void;
}

export interface CollectionLike<T> {
  forEach: (callback: (item: T) => void) => void;
}

export interface ViewLike {
  calculateExtent: () => Extent;
  fit: (extent: Extent) => void;
  getCenter: () => Coordinate | undefined;
  getProjection: () => unknown;
  getZoom: () => number | undefined;
  setCenter: (center: Coordinate) => void;
  setZoom: (zoom: number) => void;
}

export interface TileLayerLike {
  setSource: (source: unknown) => void;
}

export interface MapLike {
  addControl: (control: ControlLike) => void;
  addLayer: (layer: unknown) => void;
  getInteractions: () => CollectionLike<InteractionLike>;
  getView: () => ViewLike;
  on: (type: string, listener: (event: unknown) => void) => void;
  removeControl: (control: ControlLike) => void;
  removeLayer: (layer: unknown) => void;
  setTarget: (target?: Element) => void;
  un: (type: string, listener: (event: unknown) => void) => void;
  updateSize: () => void;
}

export interface OpenLayersApi {
  Map: new (options: Options) => MapLike;
  View: new (options: Options) => ViewLike;
  control: {
    Zoom: new () => ControlLike;
    defaults: {
      defaults: (options?: Options) => unknown;
    };
  };
  interaction: {
    defaults: {
      defaults: (options?: Options) => unknown;
    };
  };
  layer: {
    Tile: new (options: Options) => TileLayerLike;
  };
  proj: {
    getUserProjection: () => unknown | null;
    toLonLat: (coordinate: Coordinate, projection?: unknown) => Coordinate;
    transform: (coordinate: Coordinate, source: unknown, destination: unknown) => Coordinate;
    transformExtent: (extent: Extent, source: unknown, destination: unknown) => Extent;
  };
  source: {
    ImageTile: new (options: Options) => unknown;
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value) && (typeof value === 'object' || typeof value === 'function')
);

const hasFunction = (value: unknown, property: string): boolean => (
  isRecord(value) && typeof value[property] === 'function'
);

export const isOpenLayersApi = (api: unknown): api is OpenLayersApi => {
  if (!isRecord(api)) {
    return false;
  }

  return typeof api.Map === 'function'
    && typeof api.View === 'function'
    && isRecord(api.control)
    && hasFunction(api.control, 'Zoom')
    && isRecord(api.control.defaults)
    && hasFunction(api.control.defaults, 'defaults')
    && isRecord(api.interaction)
    && isRecord(api.interaction.defaults)
    && hasFunction(api.interaction.defaults, 'defaults')
    && hasFunction(api.layer, 'Tile')
    && hasFunction(api.proj, 'getUserProjection')
    && hasFunction(api.proj, 'toLonLat')
    && hasFunction(api.proj, 'transform')
    && hasFunction(api.proj, 'transformExtent')
    && hasFunction(api.source, 'ImageTile');
};

export const getCoordinateProjection = (
  api: OpenLayersApi,
  viewProjection: unknown,
): unknown => api.proj.getUserProjection() ?? viewProjection;

export const areCoordinatesEqual = (
  first: Coordinate | undefined,
  second: Coordinate,
): boolean => first?.[0] === second[0] && first[1] === second[1];

export const toCoordinate = (
  api: OpenLayersApi,
  location: MapLocation,
  viewProjection: unknown,
): Coordinate => api.proj.transform(
  [location.lng, location.lat],
  GEOGRAPHIC_PROJECTION,
  getCoordinateProjection(api, viewProjection),
);

export const toLocation = (
  api: OpenLayersApi,
  coordinate: Coordinate,
  viewProjection: unknown,
): MapLocation => {
  const [lng, lat] = api.proj.toLonLat(
    coordinate,
    getCoordinateProjection(api, viewProjection),
  );

  return { lat, lng };
};

export const createTileUrlList = (
  url: string,
  subdomains: MapEngineTileLayerOptions['subdomains'],
): string[] => {
  const values = Array.isArray(subdomains) ? subdomains : [...(subdomains ?? '')];

  return values.map((value) => url.split(SUBDOMAIN_PLACEHOLDER).join(value));
};
