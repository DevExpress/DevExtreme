import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';

import Provider from './m_provider';

const { abstract } = Provider;

const MAP_MARKER_CLASS = 'dx-map-marker';

const DynamicProvider = Provider.inherit({
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
  },

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
  },

  _load() {
    if (!this._mapsLoader) {
      this._mapsLoader = this._loadImpl();
    }

    this._markers = [];
    this._routes = [];

    return this._mapsLoader;
  },

  _loadImpl: abstract,

  _init: abstract,

  _attachHandlers: abstract,

  addMarkers(options) {
    return Promise.all(map(options, (options) => this._addMarker(options))).then((markerObjects) => {
      this._fitBounds();

      return [false, map(markerObjects, (markerObject) => markerObject.marker)];
    });
  },

  _addMarker(options) {
    return this._renderMarker(options).then((markerObject) => {
      this._markers.push(extend({
        options,
      }, markerObject));

      this._fireMarkerAddedAction({
        options,
        originalMarker: markerObject.marker,
      });

      return markerObject;
    });
  },

  _renderMarker: abstract,

  _createIconTemplate(iconSrc: string) {
    const $img = $('<img>');

    $img.attr('src', iconSrc);
    $img.attr('alt', 'Marker icon');
    $img.addClass(MAP_MARKER_CLASS);

    return $img[0];
  },

  removeMarkers(markersOptionsToRemove) {
    const that = this;

    each(markersOptionsToRemove, (_, markerOptionToRemove) => {
      that._removeMarker(markerOptionToRemove);
    });

    return Promise.resolve();
  },

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
  },

  _destroyMarker: abstract,

  _clearMarkers() {
    while (this._markers.length > 0) {
      this._removeMarker(this._markers[0].options);
    }
  },

  addRoutes(options) {
    return Promise.all(map(options, (options) => this._addRoute(options))).then((routeObjects) => {
      this._fitBounds();

      return [false, map(routeObjects, (routeObject) => routeObject.instance)];
    });
  },

  _addRoute(options) {
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
  },

  _renderRoute: abstract,

  removeRoutes(options) {
    const that = this;

    each(options, (routeIndex, options) => {
      that._removeRoute(options);
    });

    return Promise.resolve();
  },

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
  },

  _destroyRoute: abstract,

  _clearRoutes() {
    while (this._routes.length > 0) {
      this._removeRoute(this._routes[0].options);
    }
  },

  adjustViewport() {
    return this._fitBounds();
  },

  isEventsCanceled() {
    return true;
  },

  _fitBounds: abstract,

  _updateBounds() {
    const that = this;

    this._clearBounds();

    if (!this._option('autoAdjust')) {
      return;
    }

    each(this._markers, (_, markerObject) => {
      that._extendBounds(markerObject.location);
    });

    each(this._routes, (_, routeObject) => {
      routeObject.northEast && that._extendBounds(routeObject.northEast);
      routeObject.southWest && that._extendBounds(routeObject.southWest);
    });
  },

  _clearBounds() {
    this._bounds = null;
  },

  _extendBounds: abstract,

});

export default DynamicProvider;
