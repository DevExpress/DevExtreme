import Promise from '../../core/polyfills/promise';
import Class from '../../core/class';
import { map } from '../../core/utils/iterator';
import { isPlainObject, isNumeric } from '../../core/utils/type';
import { addNamespace } from '../../events/utils/index';

const abstract = Class.abstract;

const Provider = Class.inherit({

    _defaultRouteWeight: function() {
        return 5;
    },

    _defaultRouteOpacity: function() {
        return 0.5;
    },

    _defaultRouteColor: function() {
        return '#0000FF';
    },

    ctor: function(map, $container) {
        this._mapWidget = map;
        this._$container = $container;
    },

    render: function(markerOptions, routeOptions) {
        return this._renderImpl().then(function() {
            return Promise.all([
                this._applyFunctionIfNeeded('addMarkers', markerOptions),
                this._applyFunctionIfNeeded('addRoutes', routeOptions)
            ]).then(function() {
                return true;
            });
        }.bind(this));
    },

    _renderImpl: abstract,

    updateDimensions: abstract,

    updateMapType: abstract,

    updateBounds: abstract,

    updateCenter: abstract,

    updateZoom: abstract,

    updateControls: abstract,

    updateMarkers: function(markerOptionsToRemove, markerOptionsToAdd) {
        return new Promise(function(resolve) {
            return this._applyFunctionIfNeeded('removeMarkers', markerOptionsToRemove).then(function(removeValue) {
                this._applyFunctionIfNeeded('addMarkers', markerOptionsToAdd).then(function(addValue) {
                    resolve(addValue ? addValue : removeValue);
                });
            }.bind(this));
        }.bind(this));
    },

    addMarkers: abstract,

    removeMarkers: abstract,

    adjustViewport: abstract,

    updateRoutes: function(routeOptionsToRemove, routeOptionsToAdd) {
        return new Promise(function(resolve) {
            return this._applyFunctionIfNeeded('removeRoutes', routeOptionsToRemove).then(function(removeValue) {
                this._applyFunctionIfNeeded('addRoutes', routeOptionsToAdd).then(function(addValue) {
                    resolve(addValue ? addValue : removeValue);
                });
            }.bind(this));
        }.bind(this));
    },

    addRoutes: abstract,

    removeRoutes: abstract,

    clean: abstract,

    map: function() {
        return this._map;
    },

    isEventsCanceled: function() {
        return false;
    },

    _option: function(name, value) {
        if(value === undefined) {
            return this._mapWidget.option(name);
        }

        this._mapWidget.setOptionSilent(name, value);
    },

    _keyOption: function(providerName) {
        const key = this._option('apiKey');

        return key[providerName] === undefined ? key : key[providerName];
    },

    _parseTooltipOptions: function(option) {
        return {
            text: option.text || option,
            visible: option.isShown || false
        };
    },

    _getLatLng: function(location) {
        if(typeof location === 'string') {
            const coords = map(location.split(','), function(item) {
                return item.trim();
            });
            const numericRegex = /^[-+]?[0-9]*\.?[0-9]*$/;

            if(coords.length === 2 && coords[0].match(numericRegex) && coords[1].match(numericRegex)) {
                return { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };
            }
        } else if(Array.isArray(location) && location.length === 2) {
            return { lat: location[0], lng: location[1] };
        } else if(isPlainObject(location) && isNumeric(location.lat) && isNumeric(location.lng)) {
            return location;
        }

        return null;
    },

    _areBoundsSet: function() {
        return this._option('bounds.northEast') && this._option('bounds.southWest');
    },

    _addEventNamespace: function(name) {
        return addNamespace(name, this._mapWidget.NAME);
    },

    _applyFunctionIfNeeded: function(fnName, array) {
        if(!array.length) {
            return Promise.resolve();
        }

        return this[fnName](array);
    },

    _fireAction: function(name, actionArguments) {
        this._mapWidget._createActionByOption(name)(actionArguments);
    },

    _fireClickAction: function(actionArguments) {
        this._fireAction('onClick', actionArguments);
    },

    _fireMarkerAddedAction: function(actionArguments) {
        this._fireAction('onMarkerAdded', actionArguments);
    },

    _fireMarkerRemovedAction: function(actionArguments) {
        this._fireAction('onMarkerRemoved', actionArguments);
    },

    _fireRouteAddedAction: function(actionArguments) {
        this._fireAction('onRouteAdded', actionArguments);
    },

    _fireRouteRemovedAction: function(actionArguments) {
        this._fireAction('onRouteRemoved', actionArguments);
    }

});

export default Provider;
