/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Class from '@js/core/class';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';

import Provider from './m_provider';

const MAP_MARKER_CLASS = 'dx-map-marker';

class DynamicProvider extends Provider {
  _bounds?: any;

  _markers!: any[];

  _routes!: any[];

  _geocodedLocations?: any;

  _mapsLoader?: any;

  constructor(map, $container: dxElementWrapper) {
    super(map, $container);

    this._geocodedLocations = {};
  }

  _geocodeLocation(location) {
    return new Promise((resolve) => {
      const cache = this._geocodedLocations;
      const cachedLocation = cache[location];
      if (cachedLocation) {
        resolve(cachedLocation);
      } else {
        // @ts-expect-error ts-error
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
          // @ts-expect-error
          resolve();
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

  _loadImpl() {
    Class.abstract();
  }

  _init() {
    Class.abstract();
  }

  _attachHandlers() {
    Class.abstract();
  }

  addMarkers(options) {
    return Promise.all(options.map((options) => this._addMarker(options))).then((markerObjects) => {
      this._fitBounds();

      return [false, markerObjects.map((markerObject) => markerObject.marker)];
    });
  }

  _addMarker(options) {
    return this._renderMarker(options)
      // @ts-expect-error ts-error
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
  _renderMarker(options) {
    Class.abstract();
  }

  _createIconTemplate(iconSrc: string) {
    const $img = $('<img>');

    $img.attr('src', iconSrc);
    $img.attr('alt', 'Marker icon');
    $img.addClass(MAP_MARKER_CLASS);

    return $img[0];
  }

  removeMarkers(markersOptionsToRemove) {
    const that = this;

    each(markersOptionsToRemove, (_, markerOptionToRemove) => {
      that._removeMarker(markerOptionToRemove);
    });

    return Promise.resolve();
  }

  _removeMarker(markersOptionToRemove) {
    const that = this;

    each(this._markers, (markerIndex, markerObject) => {
      if (markerObject.options !== markersOptionToRemove) {
        return true;
      }

      that._destroyMarker(markerObject);

      that._markers.splice(markerIndex, 1);

      that._fireMarkerRemovedAction({
        options: markerObject.options,
      });

      return false;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _destroyMarker(marker) {
    Class.abstract();
  }

  _clearMarkers() {
    while (this._markers.length > 0) {
      this._removeMarker(this._markers[0].options);
    }
  }

  addRoutes(options) {
    return Promise.all(options.map((options) => this._addRoute(options))).then((routeObjects) => {
      this._fitBounds();

      return [false, routeObjects.map((routeObject) => routeObject.instance)];
    });
  }

  _addRoute(options) {
    // @ts-expect-error ts-error
    return this._renderRoute(options).then((routeObject) => {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _renderRoute(options) {
    Class.abstract();
  }

  removeRoutes(options) {
    const that = this;

    each(options, (routeIndex, options) => {
      that._removeRoute(options);
    });

    return Promise.resolve();
  }

  _removeRoute(options) {
    const that = this;

    each(this._routes, (routeIndex, routeObject) => {
      if (routeObject.options !== options) {
        return true;
      }

      that._destroyRoute(routeObject);

      that._routes.splice(routeIndex, 1);

      that._fireRouteRemovedAction({
        options,
      });

      return false;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _destroyRoute(routeObject) {
    Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _geocodeLocationImpl(location) {
    Class.abstract();
  }

  _clearRoutes() {
    while (this._routes.length > 0) {
      this._removeRoute(this._routes[0].options);
    }
  }

  adjustViewport() {
    return this._fitBounds();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isEventsCanceled(e): boolean {
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
  _extendBounds(location): void {
    Class.abstract();
  }
}

export default DynamicProvider;
