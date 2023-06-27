import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';

import Provider from './m_provider';

abstract class DynamicProvider extends Provider {
  _geocodedLocations: any;

  _bounds: any;

  _mapsLoader?: Promise<void>;

  _markers?: any[];

  _routes?: any[];

  abstract _extendBounds(location: any): void;
  abstract _loadImpl(): Promise<void>;
  abstract _init(): Promise<any>;
  abstract _renderMarker(options: any): Promise<{ marker: any }>;
  abstract _destroyMarker(marker: any): void;
  abstract _fitBounds(): Promise<void>;
  abstract _renderRoute(options: any): Promise<any>;
  abstract _destroyRoute(route: any): void;
  abstract _attachHandlers(): void;
  abstract _geocodeLocationImpl(location: any): Promise<any>;

  _geocodeLocation(location) {
    return new Promise((resolve) => {
      const cache = this._geocodedLocations;
      const cachedLocation = cache[location];
      if (cachedLocation) {
        resolve(cachedLocation);
      } else {
        this._geocodeLocationImpl(location).then((geocodedLocation) => {
          cache[location] = geocodedLocation;
          resolve(geocodedLocation);
        });
      }
    });
  }

  _renderImpl() {
    return this._load().then(() => this._init()).then(() => Promise.all([
      this.updateMapType(),
      this._areBoundsSet() ? this.updateBounds() : this.updateCenter(),
    ])).then(() => {
      this._attachHandlers();

      // NOTE: setTimeout is needed by providers to correctly initialize bounds
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          resolve(undefined);
        });
      });
    });
  }

  _load() {
    if (!this._mapsLoader) {
      this._mapsLoader = this._loadImpl();
    }

    this._markers = [];
    this._routes = [];

    return this._mapsLoader;
  }

  addMarkers(options) {
    return Promise.all(map(options, (options) => this._addMarker(options))).then((markerObjects) => {
      this._fitBounds();

      return [false, map(markerObjects, (markerObject) => markerObject.marker)];
    });
  }

  _addMarker(options) {
    return this._renderMarker(options).then((markerObject) => {
      this._markers?.push(extend({
        options,
      }, markerObject));

      this._fireMarkerAddedAction({
        options,
        originalMarker: markerObject.marker,
      });

      return markerObject;
    });
  }

  removeMarkers(markersOptionsToRemove) {
    const that = this;

    each(markersOptionsToRemove, (_, markerOptionToRemove) => {
      that._removeMarker(markerOptionToRemove);
    });

    return Promise.resolve(undefined);
  }

  _removeMarker(markersOptionToRemove: any): void {
    each(this._markers, (markerIndex, markerObject: any) => {
      if (markerObject.options !== markersOptionToRemove) {
        return true;
      }

      this._destroyMarker(markerObject);

      this._markers?.splice(markerIndex, 1);

      this._fireMarkerRemovedAction({
        options: markerObject.options,
      });

      return false;
    });
  }

  _clearMarkers() {
    while (Number(this._markers?.length) > 0) {
      this._removeMarker(this._markers?.[0].options);
    }
  }

  addRoutes(options) {
    return Promise.all(map(options, (options) => this._addRoute(options))).then((routeObjects) => {
      this._fitBounds();

      return [false, map(routeObjects, (routeObject) => routeObject.instance)];
    });
  }

  _addRoute(options) {
    return this._renderRoute(options).then((routeObject) => {
      this._routes?.push(extend({
        options,
      }, routeObject));

      this._fireRouteAddedAction({
        options,
        originalRoute: routeObject.instance,
      });

      return routeObject;
    });
  }

  removeRoutes(options) {
    each(options, (routeIndex, options) => {
      this._removeRoute(options);
    });

    return Promise.resolve();
  }

  _removeRoute(options) {
    const that = this;

    each(this._routes, (routeIndex, routeObject: any) => {
      if (routeObject.options !== options) {
        return true;
      }

      that._destroyRoute(routeObject);

      that._routes?.splice(routeIndex, 1);

      that._fireRouteRemovedAction({
        options,
      });

      return false;
    });
  }

  _clearRoutes() {
    while (Number(this._routes?.length) > 0) {
      this._removeRoute(this._routes?.[0].options);
    }
  }

  adjustViewport() {
    return this._fitBounds();
  }

  isEventsCanceled(): boolean {
    return true;
  }

  _updateBounds() {
    this._clearBounds();

    if (!this._option('autoAdjust')) {
      return;
    }

    each(this._markers, (_, markerObject: any) => {
      this._extendBounds(markerObject.location);
    });

    each(this._routes, (_, routeObject: any) => {
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
}

export default DynamicProvider;
