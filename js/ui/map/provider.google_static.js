var each = require('../../core/utils/iterator').each,
    eventsEngine = require('../../events/core/events_engine'),
    Promise = require('../../core/polyfills/promise'),
    Provider = require('./provider'),
    Color = require('../../color'),
    clickEvent = require('../../events/click');

var GOOGLE_STATIC_URL = 'https://maps.google.com/maps/api/staticmap?';

var GoogleStaticProvider = Provider.inherit({

    _locationToString: function(location) {
        var latLng = this._getLatLng(location);
        return latLng ? (latLng.lat + ',' + latLng.lng) : location.toString().replace(/ /g, '+');
    },

    _renderImpl: function() {
        return this._updateMap();
    },

    updateDimensions: function() {
        return this._updateMap();
    },

    updateMapType: function() {
        return this._updateMap();
    },

    updateBounds: function() {
        return Promise.resolve();
    },

    updateCenter: function() {
        return this._updateMap();
    },

    updateZoom: function() {
        return this._updateMap();
    },

    updateControls: function() {
        return Promise.resolve();
    },

    addMarkers: function(options) {
        var that = this;

        return this._updateMap().then(function(result) {
            each(options, function(_, options) {
                that._fireMarkerAddedAction({
                    options: options
                });
            });
            return result;
        });
    },

    removeMarkers: function(options) {
        var that = this;

        return this._updateMap().then(function(result) {
            each(options, function(_, options) {
                that._fireMarkerRemovedAction({
                    options: options
                });
            });
            return result;
        });
    },

    adjustViewport: function() {
        return Promise.resolve();
    },

    addRoutes: function(options) {
        var that = this;

        return this._updateMap().then(function(result) {
            each(options, function(_, options) {
                that._fireRouteAddedAction({
                    options: options
                });
            });
            return result;
        });
    },

    removeRoutes: function(options) {
        var that = this;

        return this._updateMap().then(function(result) {
            each(options, function(_, options) {
                that._fireRouteRemovedAction({
                    options: options
                });
            });
            return result;
        });
    },

    clean: function() {
        this._$container.css('backgroundImage', 'none');
        eventsEngine.off(this._$container, this._addEventNamespace(clickEvent.name));

        return Promise.resolve();
    },

    mapRendered: function() {
        return true;
    },

    _updateMap: function() {
        var key = this._keyOption('googleStatic'),
            $container = this._$container;

        var requestOptions = [
            'sensor=false',
            'size=' + Math.round($container.width()) + 'x' + Math.round($container.height()),
            'maptype=' + this._option('type'),
            'center=' + this._locationToString(this._option('center')),
            'zoom=' + this._option('zoom'),
            this._markersSubstring()
        ];
        requestOptions.push.apply(requestOptions, this._routeSubstrings());
        if(key) {
            requestOptions.push('key=' + key);
        }

        var request = GOOGLE_STATIC_URL + requestOptions.join('&');

        this._$container.css('background', 'url("' + request + '") no-repeat 0 0');

        this._attachClickEvent();

        return Promise.resolve(true);
    },

    _markersSubstring: function() {
        var that = this,
            markers = [],
            markerIcon = this._option('markerIconSrc');

        if(markerIcon) {
            markers.push('icon:' + markerIcon);
        }

        each(this._option('markers'), function(_, marker) {
            markers.push(that._locationToString(marker.location));
        });

        return 'markers=' + markers.join('|');
    },

    _routeSubstrings: function() {
        var that = this,
            routes = [];

        each(this._option('routes'), function(_, route) {
            var color = new Color(route.color || that._defaultRouteColor()).toHex().replace('#', '0x'),
                opacity = Math.round((route.opacity || that._defaultRouteOpacity()) * 255).toString(16),
                width = route.weight || that._defaultRouteWeight(),
                locations = [];
            each(route.locations, function(_, routePoint) {
                locations.push(that._locationToString(routePoint));
            });

            routes.push('path=color:' + color + opacity + '|weight:' + width + '|' + locations.join('|'));
        });

        return routes;
    },

    _attachClickEvent: function() {
        var that = this,
            eventName = this._addEventNamespace(clickEvent.name);

        eventsEngine.off(this._$container, eventName);
        eventsEngine.on(this._$container, eventName, function(e) {
            that._fireClickAction({ event: e });
        });
    }

});

///#DEBUG
GoogleStaticProvider.remapConstant = function(newValue) {
    GOOGLE_STATIC_URL = newValue;
};
///#ENDDEBUG

module.exports = GoogleStaticProvider;
