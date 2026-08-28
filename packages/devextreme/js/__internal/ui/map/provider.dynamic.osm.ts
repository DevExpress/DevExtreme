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
  MarkerOptions,
  RouteOptions,
} from './provider.dynamic';
import DynamicProvider from './provider.dynamic';
import type {
  MapEngine,
  MapEngineBounds,
  MapEngineClickEvent,
  MapEngineMap,
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
    const engineMap = this._engine?.createMap(this._$container[0], {
      center: this._resolveLocation(this._option('center')),
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

  _resolveLocation(location?: LocationOption | null): MapLocation {
    return this._getLatLng(location) ?? { lat: 0, lng: 0 };
  }

  _attachHandlers(): void {
    this._engineMap?.attachHandlers({
      click: (event) => this._clickActionHandler(event),
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
    this._engineMap?.updateDimensions();

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
    this._engineMap?.setView({
      center: this._resolveLocation(this._option('center')),
    });

    return Promise.resolve();
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
    const bounds = this._option('bounds');
    const northEast = this._getLatLng(bounds?.northEast);
    const southWest = this._getLatLng(bounds?.southWest);

    if (northEast && southWest) {
      const engineBounds: MapEngineBounds = { northEast, southWest };
      this._engineMap?.fitBounds(engineBounds);
    }

    return Promise.resolve();
  }

  updateControls(): Promise<void> {
    this._engineMap?.setControls(Boolean(this._option('controls')));

    return Promise.resolve();
  }

  adjustViewport(): Promise<void> {
    return Promise.resolve();
  }

  addMarkers(markers: MarkerOptions[]): Promise<[boolean, unknown[]]> {
    return Promise.resolve([false, markers.map(() => undefined)]);
  }

  addRoutes(routes: RouteOptions[]): Promise<[boolean, unknown[]]> {
    return Promise.resolve([false, routes.map(() => undefined)]);
  }

  clean(): Promise<void> {
    this._engineMap?.dispose();
    this._engineMap = undefined;
    this._engine = undefined;
    this._map = undefined;

    return Promise.resolve();
  }
}

export default OsmProvider;
