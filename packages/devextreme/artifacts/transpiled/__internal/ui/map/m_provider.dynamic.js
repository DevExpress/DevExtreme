"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _m_provider = _interopRequireDefault(require("./m_provider"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  abstract
} = _m_provider.default;
const DynamicProvider = _m_provider.default.inherit({
  _geocodeLocation(location) {
    return new Promise(resolve => {
      const cache = this._geocodedLocations;
      const cachedLocation = cache[location];
      if (cachedLocation) {
        resolve(cachedLocation);
      } else {
        this._geocodeLocationImpl(location).then(geocodedLocation => {
          cache[location] = geocodedLocation;
          resolve(geocodedLocation);
        });
      }
    });
  },
  _renderImpl() {
    return this._load().then(() => this._init()).then(() => Promise.all([this.updateMapType(), this._areBoundsSet() ? this.updateBounds() : this.updateCenter()])).then(() => {
      this._attachHandlers();
      // NOTE: setTimeout is needed by providers to correctly initialize bounds
      return new Promise(resolve => {
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
    return Promise.all((0, _iterator.map)(options, options => this._addMarker(options))).then(markerObjects => {
      this._fitBounds();
      return [false, (0, _iterator.map)(markerObjects, markerObject => markerObject.marker)];
    });
  },
  _addMarker(options) {
    return this._renderMarker(options).then(markerObject => {
      this._markers.push((0, _extend.extend)({
        options
      }, markerObject));
      this._fireMarkerAddedAction({
        options,
        originalMarker: markerObject.marker
      });
      return markerObject;
    });
  },
  _renderMarker: abstract,
  removeMarkers(markersOptionsToRemove) {
    const that = this;
    (0, _iterator.each)(markersOptionsToRemove, (_, markerOptionToRemove) => {
      that._removeMarker(markerOptionToRemove);
    });
    return Promise.resolve();
  },
  _removeMarker(markersOptionToRemove) {
    const that = this;
    (0, _iterator.each)(this._markers, (markerIndex, markerObject) => {
      if (markerObject.options !== markersOptionToRemove) {
        return true;
      }
      that._destroyMarker(markerObject);
      that._markers.splice(markerIndex, 1);
      that._fireMarkerRemovedAction({
        options: markerObject.options
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
    return Promise.all((0, _iterator.map)(options, options => this._addRoute(options))).then(routeObjects => {
      this._fitBounds();
      return [false, (0, _iterator.map)(routeObjects, routeObject => routeObject.instance)];
    });
  },
  _addRoute(options) {
    return this._renderRoute(options).then(routeObject => {
      this._routes.push((0, _extend.extend)({
        options
      }, routeObject));
      this._fireRouteAddedAction({
        options,
        originalRoute: routeObject.instance
      });
      return routeObject;
    });
  },
  _renderRoute: abstract,
  removeRoutes(options) {
    const that = this;
    (0, _iterator.each)(options, (routeIndex, options) => {
      that._removeRoute(options);
    });
    return Promise.resolve();
  },
  _removeRoute(options) {
    const that = this;
    (0, _iterator.each)(this._routes, (routeIndex, routeObject) => {
      if (routeObject.options !== options) {
        return true;
      }
      that._destroyRoute(routeObject);
      that._routes.splice(routeIndex, 1);
      that._fireRouteRemovedAction({
        options
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
    (0, _iterator.each)(this._markers, (_, markerObject) => {
      that._extendBounds(markerObject.location);
    });
    (0, _iterator.each)(this._routes, (_, routeObject) => {
      routeObject.northEast && that._extendBounds(routeObject.northEast);
      routeObject.southWest && that._extendBounds(routeObject.southWest);
    });
  },
  _clearBounds() {
    this._bounds = null;
  },
  _extendBounds: abstract
});
var _default = exports.default = DynamicProvider;