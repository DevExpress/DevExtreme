import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { DxEvent } from '@js/events';
import type { RouteMode } from '@js/ui/map';

import type Map from './m_map';
import Provider from './m_provider';
import type { AzureLocation } from './m_provider.dynamic.azure';
import type { BingLocation } from './m_provider.dynamic.bing';
import type { GoogleLocation } from './m_provider.dynamic.google';

const MAP_MARKER_CLASS = 'dx-map-marker';

export type LocationOption = string | [number, number] | { lat: number; lng: number };

export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface MarkerOptions {
  iconSrc?: string;
  location?: LocationCoords;
  onClick?: () => {};
  tooltip?: string | {
    isShown?: boolean;
    text?: string;
  };
  html?: string;
  htmlOffset?: { top: number; left: number };
}

export interface MarkerObject {
  marker: unknown;
  location: unknown;
  listener?: () => void;
  handler?: () => void;
  infoBox?: unknown;
  popup?: unknown;
}

export interface RouteOptions {
  color?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locations?: any[];
  mode?: RouteMode | string;
  opacity?: number;
  weight?: number;
}

export interface RouteObject {
  instance?: unknown;
  northEast?: [number, number];
  southWest?: [number, number];
}

class DynamicProvider extends Provider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _bounds?: any;

  _markers!: (MarkerObject & { options: MarkerOptions })[];

  _routes!: (RouteObject & { options: RouteOptions })[];

  _geocodedLocations: Record<string, GoogleLocation | BingLocation | AzureLocation>;

  _mapsLoader?: Promise<void>;

  constructor(map: Map, $container: dxElementWrapper) {
    super(map, $container);

    this._geocodedLocations = {};
  }

  _geocodeLocation(
    location: string,
  ): Promise<GoogleLocation | BingLocation | AzureLocation> {
    return new Promise((resolve) => {
      const cache = this._geocodedLocations;
      const cachedLocation = cache[location];
      if (cachedLocation) {
        resolve(cachedLocation);
      } else {
        this._geocodeLocationImpl(location)
          .then((geocodedLocation) => {
            cache[location] = geocodedLocation;
            resolve(geocodedLocation);
          })
          .catch(() => {});
      }
    });
  }

  _renderImpl(): Promise<void> {
    return this._load().then(() => this._init()).then(() => Promise.all([
      this.updateMapType(),
      this._areBoundsSet() ? this.updateBounds() : this.updateCenter(),
    ])).then(() => {
      this._attachHandlers();

      // NOTE: setTimeout is needed by providers to correctly initialize bounds
      return new Promise<void>((resolve) => {
        // eslint-disable-next-line no-restricted-globals
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    });
  }

  _load(): Promise<void> {
    if (!this._mapsLoader) {
      this._mapsLoader = this._loadImpl();
    }

    this._markers = [];
    this._routes = [];

    return this._mapsLoader;
  }

  _loadImpl(): Promise<void> {
    return Promise.resolve();
  }

  _init(): Promise<void> {
    return Promise.resolve();
  }

  _attachHandlers(): void {
    Class.abstract();
  }

  addMarkers(markers: MarkerOptions[]): Promise<[boolean, unknown[]]> {
    return Promise
      .all(markers.map((options) => this._addMarker(options)))
      .then((markerObjects: MarkerObject[]) => {
        this._fitBounds();

        return [false, markerObjects.map((markerObject) => markerObject.marker)];
      });
  }

  _addMarker(options: MarkerOptions): Promise<MarkerObject> {
    return this._renderMarker(options)
      .then((markerObject) => {
        this._markers.push(extend({
          options,
        }, markerObject));

        this._fireMarkerAddedAction({
          options,
          originalMarker: markerObject.marker,
        });

        return markerObject;
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderMarker(options: MarkerOptions): Promise<MarkerObject> {
    return Promise.resolve({
      marker: {},
      location: { lat: 0, lng: 0 },
    });
  }

  _createIconTemplate(iconSrc: string): Element {
    const $img = $('<img>');

    $img.attr('src', iconSrc);
    $img.attr('alt', 'Marker icon');
    $img.addClass(MAP_MARKER_CLASS);

    return $img.get(0);
  }

  removeMarkers(markersOptionsToRemove: MarkerOptions[]): Promise<void> {
    markersOptionsToRemove.forEach((markerOptionToRemove) => {
      this._removeMarker(markerOptionToRemove);
    });

    return Promise.resolve();
  }

  _removeMarker(markersOptionToRemove: MarkerOptions): void {
    this._markers.forEach((markerObject, markerIndex) => {
      if (markerObject.options !== markersOptionToRemove) {
        return true;
      }

      this._destroyMarker(markerObject);

      this._markers.splice(markerIndex, 1);

      this._fireMarkerRemovedAction({
        options: markerObject.options,
      });

      return false;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _destroyMarker(marker: unknown): void {
    Class.abstract();
  }

  _clearMarkers(): void {
    while (this._markers.length > 0) {
      this._removeMarker(this._markers[0].options);
    }
  }

  addRoutes(routes: RouteOptions[]): Promise<[boolean, unknown[]]> {
    return Promise.all(routes.map((options) => this._addRoute(options))).then((routeObjects) => {
      this._fitBounds();

      return [false, routeObjects.map((routeObject) => routeObject.instance)];
    });
  }

  _addRoute(options: RouteOptions): Promise<RouteObject> {
    return this._renderRoute(options).then((routeObject: RouteObject) => {
      this._routes.push(extend({
        options,
      }, routeObject));

      this._fireRouteAddedAction({
        options,
        originalRoute: routeObject.instance,
      });

      return routeObject;
    });
  }

  _renderRoute(options: RouteOptions): Promise<RouteObject> {
    return Promise.resolve({
      options,
      instance: {},
      northEast: [0, 0],
      southWest: [0, 0],
    });
  }

  removeRoutes(routes: RouteOptions[] = []): Promise<void> {
    routes.forEach((routeObject) => {
      this._removeRoute(routeObject);
    });

    return Promise.resolve();
  }

  _removeRoute(options: RouteOptions): void {
    const routes = this._routes;
    routes.forEach((routeObject, routeIndex) => {
      if (routeObject.options !== options) {
        return true;
      }

      this._destroyRoute(routeObject);

      this._routes.splice(routeIndex, 1);

      this._fireRouteRemovedAction({
        options,
      });

      return false;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _destroyRoute(routeObject: RouteObject): void {
    Class.abstract();
  }

  _geocodeLocationImpl(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    location: string,
  ): Promise<GoogleLocation | BingLocation | AzureLocation> {
    return Promise.resolve([0, 0]);
  }

  _clearRoutes(): void {
    while (this._routes.length > 0) {
      this._removeRoute(this._routes[0].options);
    }
  }

  adjustViewport(): void {
    return this._fitBounds();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEventsCanceled(e: DxEvent): boolean {
    return true;
  }

  _fitBounds(): void {
    Class.abstract();
  }

  _updateBounds(): void {
    this._clearBounds();

    if (!this._option('autoAdjust')) {
      return;
    }

    this._markers.forEach((markerObject) => {
      this._extendBounds(markerObject.location);
    });

    this._routes.forEach((routeObject) => {
      if (routeObject.northEast) {
        this._extendBounds(routeObject.northEast);
      }
      if (routeObject.southWest) {
        this._extendBounds(routeObject.southWest);
      }
    });
  }

  _clearBounds(): void {
    this._bounds = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _extendBounds(location: unknown): void {
    Class.abstract();
  }
}

export default DynamicProvider;
