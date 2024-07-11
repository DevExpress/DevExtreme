"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _class = _interopRequireDefault(require("../../../core/class"));
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _index = require("../../../events/utils/index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  abstract
} = _class.default;
const Provider = _class.default.inherit({
  _defaultRouteWeight() {
    return 5;
  },
  _defaultRouteOpacity() {
    return 0.5;
  },
  _defaultRouteColor() {
    return '#0000FF';
  },
  ctor(map, $container) {
    this._mapWidget = map;
    this._$container = $container;
  },
  render(markerOptions, routeOptions) {
    return this._renderImpl().then(() => Promise.all([this._applyFunctionIfNeeded('addMarkers', markerOptions), this._applyFunctionIfNeeded('addRoutes', routeOptions)]).then(() => true));
  },
  _renderImpl: abstract,
  updateDimensions: abstract,
  updateMapType: abstract,
  updateBounds: abstract,
  updateCenter: abstract,
  updateZoom: abstract,
  updateControls: abstract,
  updateMarkers(markerOptionsToRemove, markerOptionsToAdd) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise(resolve => this._applyFunctionIfNeeded('removeMarkers', markerOptionsToRemove).then(removeValue => {
      this._applyFunctionIfNeeded('addMarkers', markerOptionsToAdd).then(addValue => {
        resolve(addValue || removeValue);
      });
    }));
  },
  addMarkers: abstract,
  removeMarkers: abstract,
  adjustViewport: abstract,
  updateRoutes(routeOptionsToRemove, routeOptionsToAdd) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise(resolve => this._applyFunctionIfNeeded('removeRoutes', routeOptionsToRemove).then(removeValue => {
      this._applyFunctionIfNeeded('addRoutes', routeOptionsToAdd).then(addValue => {
        resolve(addValue || removeValue);
      });
    }));
  },
  addRoutes: abstract,
  removeRoutes: abstract,
  clean: abstract,
  map() {
    return this._map;
  },
  isEventsCanceled() {
    return false;
  },
  _option(name, value) {
    if (value === undefined) {
      return this._mapWidget.option(name);
    }
    this._mapWidget.setOptionSilent(name, value);
  },
  _keyOption(providerName) {
    const key = this._option('apiKey');
    return key[providerName] === undefined ? key : key[providerName];
  },
  _parseTooltipOptions(option) {
    return {
      text: option.text || option,
      visible: option.isShown || false
    };
  },
  _getLatLng(location) {
    if (typeof location === 'string') {
      const coords = (0, _iterator.map)(location.split(','), item => item.trim());
      const numericRegex = /^[-+]?[0-9]*\.?[0-9]*$/;
      if (coords.length === 2 && coords[0].match(numericRegex) && coords[1].match(numericRegex)) {
        return {
          lat: parseFloat(coords[0]),
          lng: parseFloat(coords[1])
        };
      }
    } else if (Array.isArray(location) && location.length === 2) {
      return {
        lat: location[0],
        lng: location[1]
      };
    } else if ((0, _type.isPlainObject)(location) && (0, _type.isNumeric)(location.lat) && (0, _type.isNumeric)(location.lng)) {
      return location;
    }
    return null;
  },
  _areBoundsSet() {
    return this._option('bounds.northEast') && this._option('bounds.southWest');
  },
  _addEventNamespace(name) {
    return (0, _index.addNamespace)(name, this._mapWidget.NAME);
  },
  _applyFunctionIfNeeded(fnName, array) {
    if (!array.length) {
      return Promise.resolve();
    }
    return this[fnName](array);
  },
  _fireAction(name, actionArguments) {
    this._mapWidget._createActionByOption(name)(actionArguments);
  },
  _fireClickAction(actionArguments) {
    this._fireAction('onClick', actionArguments);
  },
  _fireMarkerAddedAction(actionArguments) {
    this._fireAction('onMarkerAdded', actionArguments);
  },
  _fireMarkerRemovedAction(actionArguments) {
    this._fireAction('onMarkerRemoved', actionArguments);
  },
  _fireRouteAddedAction(actionArguments) {
    this._fireAction('onRouteAdded', actionArguments);
  },
  _fireRouteRemovedAction(actionArguments) {
    this._fireAction('onRouteRemoved', actionArguments);
  }
});
var _default = exports.default = Provider;