/* eslint-disable @typescript-eslint/no-misused-promises */
import { getWindow } from '@js/core/utils/window';
import type {
  MapLocation,
  MapType,
  OsmTileServerConfig as TileServerConfig,
} from '@js/ui/map';
import errors from '@js/ui/widget/ui.errors';

import type {
  LocationOption,
  MarkerObject,
  MarkerOptions,
  RouteOptions,
} from './provider.dynamic';
import DynamicProvider from './provider.dynamic';
import type {
  MapEngine,
  MapEngineBounds,
  MapEngineClickEvent,
  MapEngineMap,
  MapEngineMarker,
  MapEngineTileLayerOptions,
  MapEngineViewState,
} from './provider.dynamic.osm.engine';
import {
  getRegisteredMapEngine,
  SUBDOMAIN_PLACEHOLDER,
} from './provider.dynamic.osm.engine';
import { createOpenLayersEngine } from './provider.dynamic.osm.openlayers';

const DEFAULT_MAX_ZOOM = 19;
const DEFAULT_SUBDOMAINS = 'abc';
const LOCATION_EPSILON = 1e-10;
const FULL_CIRCLE_DEGREES = 360;
const HALF_CIRCLE_DEGREES = 180;
const STALE_OPERATION = Symbol('stale operation');

const getDefaultLocation = (): MapLocation => ({ lat: 0, lng: 0 });

const getLocationOptionKey = (location?: LocationOption | null): string => {
  if (typeof location === 'string') {
    return `string:${location}`;
  }
  if (Array.isArray(location)) {
    return `array:${location[0]},${location[1]}`;
  }
  if (location) {
    return `object:${location.lat},${location.lng}`;
  }

  return String(location);
};

const normalizeLongitude = (longitude: number): number => {
  if (longitude >= -HALF_CIRCLE_DEGREES && longitude <= HALF_CIRCLE_DEGREES) {
    return longitude;
  }

  const shifted = longitude + HALF_CIRCLE_DEGREES;
  const positive = (shifted % FULL_CIRCLE_DEGREES) + FULL_CIRCLE_DEGREES;

  return (positive % FULL_CIRCLE_DEGREES) - HALF_CIRCLE_DEGREES;
};

const createBounds = (locations: MapLocation[]): MapEngineBounds | undefined => {
  if (!locations.length) {
    return undefined;
  }

  const longitudes: number[] = [];
  let north = locations[0].lat;
  let south = locations[0].lat;

  locations.forEach(({ lat, lng }) => {
    longitudes.push(normalizeLongitude(lng));
    north = Math.max(north, lat);
    south = Math.min(south, lat);
  });
  longitudes.sort((first, second) => first - second);
  let largestGap = -1;
  let westIndex = 0;

  longitudes.forEach((longitude, index) => {
    const nextLongitude = index === longitudes.length - 1
      ? longitudes[0] + FULL_CIRCLE_DEGREES
      : longitudes[index + 1];
    const gap = nextLongitude - longitude;

    if (gap > largestGap) {
      largestGap = gap;
      westIndex = (index + 1) % longitudes.length;
    }
  });

  return {
    northEast: {
      lat: north,
      lng: longitudes[(westIndex + longitudes.length - 1) % longitudes.length],
    },
    southWest: {
      lat: south,
      lng: longitudes[westIndex],
    },
  };
};

interface EngineMarkerObject extends MarkerObject {
  engineMarker: MapEngineMarker;
  location: MapLocation;
}

const areLocationsEqual = (
  first: MapLocation | null,
  second: MapLocation,
): boolean => first !== null
  && Math.abs(first.lat - second.lat) < LOCATION_EPSILON
  && Math.abs(first.lng - second.lng) < LOCATION_EPSILON;

class OsmProvider extends DynamicProvider {
  _engine?: MapEngine;

  _engineMap?: MapEngineMap;

  _currentTileType?: MapType;

  _calculatedLocations = new Map<string, MapLocation>();

  _pendingLocationCalculations = new Map<string, Promise<MapLocation>>();

  _boundLocations: MapLocation[] = [];

  _generation = 0;

  render(markers: MarkerOptions[], routes: RouteOptions[]): Promise<unknown> {
    const generation = this._generation;

    return super.render(markers, routes).then(
      (result) => (generation === this._generation ? result : false),
      (error) => {
        if (generation !== this._generation) {
          return false;
        }

        throw error;
      },
    );
  }

  _loadImpl(): Promise<void> {
    const window = getWindow() as Window & { ol?: unknown };
    const engine = getRegisteredMapEngine() ?? createOpenLayersEngine(window.ol);

    if (!engine) {
      return Promise.reject(errors.Error('E1069'));
    }

    this._engine = engine;

    return Promise.resolve();
  }

  _init(): Promise<void> {
    const optionCenter = this._getLatLng(this._option('center'));
    const center = optionCenter
      && Number.isFinite(optionCenter.lat)
      && Number.isFinite(optionCenter.lng)
      ? optionCenter
      : getDefaultLocation();
    const engineMap = this._engine?.createMap(this._$container[0], {
      center,
      zoom: this._option('zoom') ?? 1,
    });

    if (!engineMap) {
      return Promise.reject(errors.Error('E1069'));
    }

    this._engineMap = engineMap;
    this._map = engineMap.originalMap;
    engineMap.setControls(Boolean(this._option('controls')));
    engineMap.setFocus(
      Boolean(this._option('focusStateEnabled')),
      this._option('tabIndex') ?? 0,
    );
    engineMap.setDisabled(Boolean(this._option('disabled')));

    return Promise.resolve();
  }

  _resolveTileConfig(type: MapType): TileServerConfig | undefined {
    const option = this._option('providerConfig')?.tileServer;
    const resolved = typeof option === 'function' ? option(type) : option;

    if (!resolved) {
      return undefined;
    }

    return typeof resolved === 'string' ? { url: resolved } : resolved;
  }

  _resolveTileLayerOptions(type: MapType): MapEngineTileLayerOptions | undefined {
    const config = this._resolveTileConfig(type);

    if (!config?.url) {
      errors.log('W1030');
      return undefined;
    }

    if (!config.attribution) {
      errors.log('W1032');
    }

    const result: MapEngineTileLayerOptions = {
      maxZoom: config.maxZoom ?? DEFAULT_MAX_ZOOM,
      url: config.url,
    };

    if (config.attribution !== undefined) {
      result.attribution = config.attribution;
    }

    if (config.url.includes(SUBDOMAIN_PLACEHOLDER)) {
      result.subdomains = config.subdomains?.length ? config.subdomains : DEFAULT_SUBDOMAINS;
    }

    return result;
  }

  _resolveLocation(location?: LocationOption | null): Promise<MapLocation> {
    const resolvedLocation = this._getLatLng(location);

    if (resolvedLocation
      && Number.isFinite(resolvedLocation.lat)
      && Number.isFinite(resolvedLocation.lng)) {
      return Promise.resolve(resolvedLocation);
    }

    return typeof location === 'string'
      ? this._calculateLocation(location)
      : Promise.resolve(getDefaultLocation());
  }

  _calculateLocation(query: string): Promise<MapLocation> {
    const cachedLocation = this._calculatedLocations.get(query);
    if (cachedLocation) {
      return Promise.resolve(cachedLocation);
    }
    const pendingCalculation = this._pendingLocationCalculations.get(query);
    if (pendingCalculation) {
      return pendingCalculation;
    }

    const calculateLocation = this._option('providerConfig')?.calculateLocation;
    if (!calculateLocation) {
      errors.log('W1031');

      return Promise.resolve(getDefaultLocation());
    }

    const generation = this._generation;

    const calculation = Promise.resolve()
      .then(() => calculateLocation(query))
      .then((location) => {
        if (location
          && Number.isFinite(location.lat)
          && Number.isFinite(location.lng)) {
          const result = { lat: location.lat, lng: location.lng };
          if (generation === this._generation) {
            this._calculatedLocations.set(query, result);
          }

          return result;
        }

        return getDefaultLocation();
      }, () => getDefaultLocation());

    this._pendingLocationCalculations.set(query, calculation);

    return calculation.then((location) => {
      if (this._pendingLocationCalculations.get(query) === calculation) {
        this._pendingLocationCalculations.delete(query);
      }

      return location;
    });
  }

  _attachHandlers(): void {
    this._engineMap?.attachHandlers({
      click: (event) => this._clickActionHandler(event),
      markerSizeChange: () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._fitBounds();
      },
      viewChange: (view) => this._viewChangeHandler(view),
    });
  }

  _clickActionHandler(event: MapEngineClickEvent): void {
    this._fireClickAction(event);
  }

  _viewChangeHandler(view: MapEngineViewState): void {
    const { bounds, center, zoom } = view;

    if (bounds) {
      const currentBounds = this._option('bounds');
      const currentNorthEast = this._getLatLng(currentBounds?.northEast);
      const currentSouthWest = this._getLatLng(currentBounds?.southWest);
      if (!areLocationsEqual(currentNorthEast, bounds.northEast)
        || !areLocationsEqual(currentSouthWest, bounds.southWest)) {
        this._option('bounds', bounds);
      }
    }

    if (center && !areLocationsEqual(this._getLatLng(this._option('center')), center)) {
      this._option('center', center);
    }

    if (zoom !== undefined && zoom !== this._option('zoom')) {
      this._option('zoom', zoom);
    }
  }

  updateDimensions(): Promise<void> {
    if (this._engineMap?.updateDimensions()) {
      return this._fitBounds();
    }

    return Promise.resolve();
  }

  updateMapType(): Promise<void> {
    const type = this._option('type') ?? 'roadmap';

    if (type === this._currentTileType) {
      return Promise.resolve();
    }

    const tileServer = this._option('providerConfig')?.tileServer;
    if (this._currentTileType !== undefined && typeof tileServer !== 'function') {
      this._currentTileType = type;

      return Promise.resolve();
    }

    const options = this._resolveTileLayerOptions(type);
    if (options && this._engineMap) {
      this._engineMap.replaceTileLayer(options);
      this._currentTileType = type;
    }

    return Promise.resolve();
  }

  updateCenter(): Promise<void> {
    const engineMap = this._engineMap;
    const centerOption = this._option('center');
    const centerOptionKey = getLocationOptionKey(centerOption);

    return this._resolveLocation(centerOption).then((center) => {
      if (engineMap !== this._engineMap
        || centerOptionKey !== getLocationOptionKey(this._option('center'))) {
        return;
      }

      engineMap?.setView({ center });
      this._option('center', center);
    });
  }

  updateZoom(): Promise<void> {
    this._engineMap?.setView({ zoom: this._option('zoom') ?? 1 });

    return Promise.resolve();
  }

  updateDisabled(): Promise<void> {
    this._engineMap?.setDisabled(Boolean(this._option('disabled')));

    return Promise.resolve();
  }

  updateFocus(): Promise<void> {
    this._engineMap?.setFocus(
      Boolean(this._option('focusStateEnabled')),
      this._option('tabIndex') ?? 0,
    );

    return Promise.resolve();
  }

  updateBounds(): Promise<void> {
    if (!this._areBoundsSet()) {
      return Promise.resolve();
    }

    const bounds = this._option('bounds');
    const engineMap = this._engineMap;
    const northEastOption = bounds?.northEast;
    const southWestOption = bounds?.southWest;
    const northEastOptionKey = getLocationOptionKey(northEastOption);
    const southWestOptionKey = getLocationOptionKey(southWestOption);

    return Promise.all([
      this._resolveLocation(northEastOption),
      this._resolveLocation(southWestOption),
    ]).then(([northEast, southWest]) => {
      const currentBounds = this._option('bounds');
      if (engineMap === this._engineMap
        && northEastOptionKey === getLocationOptionKey(currentBounds?.northEast)
        && southWestOptionKey === getLocationOptionKey(currentBounds?.southWest)) {
        engineMap?.fitBounds({ northEast, southWest });
      }
    });
  }

  updateControls(): Promise<void> {
    this._engineMap?.setControls(Boolean(this._option('controls')));

    return Promise.resolve();
  }

  adjustViewport(): Promise<void> {
    return this._fitBounds();
  }

  _renderMarker(options: MarkerOptions): Promise<EngineMarkerObject> {
    const engineMap = this._engineMap;
    if (!engineMap) {
      return Promise.reject(errors.Error('E1069'));
    }

    return this._resolveLocation(options.location).then((location) => {
      if (engineMap !== this._engineMap) {
        return Promise.reject(STALE_OPERATION);
      }

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const iconSrc = options.iconSrc || this._option('markerIconSrc');
      const markerClickAction = options.onClick
        ? this._mapWidget._createAction(options.onClick)
        : undefined;
      const engineMarker = engineMap.addMarker({
        html: options.html,
        htmlOffset: options.htmlOffset,
        iconSrc,
        location,
        onClick: markerClickAction
          ? (): void => markerClickAction({ location })
          : undefined,
      });

      return {
        engineMarker,
        location,
        marker: engineMarker.originalMarker,
      };
    });
  }

  addMarkers(markers: MarkerOptions[]): Promise<[boolean, unknown[]]> {
    return super.addMarkers(markers).catch((error) => {
      if (error === STALE_OPERATION) {
        return [false, []];
      }

      throw error;
    });
  }

  _destroyMarker(marker: EngineMarkerObject): void {
    marker.engineMarker.dispose();
  }

  _fitBounds(): Promise<void> {
    this._updateBounds();
    this._bounds = createBounds(this._boundLocations) ?? null;

    const engineMap = this._engineMap;
    if (!engineMap || !this._bounds || !this._option('autoAdjust')) {
      return Promise.resolve();
    }

    const zoomBeforeFitting = engineMap.getZoom();
    engineMap.fitBounds(this._bounds as MapEngineBounds, { includeMarkerPadding: true });
    const zoomAfterFitting = engineMap.getZoom();

    if (zoomBeforeFitting !== undefined && zoomAfterFitting !== undefined) {
      if (zoomBeforeFitting < zoomAfterFitting) {
        engineMap.setView({ zoom: zoomBeforeFitting });
      } else {
        this._option('zoom', zoomAfterFitting);
      }
    }

    return Promise.resolve();
  }

  _extendBounds(location: unknown): void {
    const resolvedLocation = this._getLatLng(location as LocationOption);
    if (!resolvedLocation
      || !Number.isFinite(resolvedLocation.lat)
      || !Number.isFinite(resolvedLocation.lng)) {
      return;
    }

    this._boundLocations.push(resolvedLocation);
  }

  _clearBounds(): void {
    super._clearBounds();
    this._boundLocations = [];
  }

  addRoutes(routes: RouteOptions[]): Promise<[boolean, unknown[]]> {
    return Promise.resolve([false, routes.map(() => undefined)]);
  }

  clean(): Promise<void> {
    this._generation += 1;
    this._calculatedLocations.clear();
    this._pendingLocationCalculations.clear();
    if (this._engineMap) {
      this._clearMarkers();
    }
    this._engineMap?.dispose();
    this._engineMap = undefined;
    this._engine = undefined;
    this._map = undefined;

    return Promise.resolve();
  }
}

export default OsmProvider;
