/* global google */

const $ = require('../../core/renderer');
const window = require('../../core/utils/window').getWindow();
const noop = require('../../core/utils/common').noop;
const devices = require('../../core/devices');
const Promise = require('../../core/polyfills/promise');
const extend = require('../../core/utils/extend').extend;
const map = require('../../core/utils/iterator').map;
const DynamicProvider = require('./provider.dynamic');
const errors = require('../widget/ui.errors');
const Color = require('../../color');
const ajax = require('../../core/utils/ajax');
const isDefined = require('../../core/utils/type').isDefined;

const GOOGLE_MAP_READY = '_googleScriptReady';
let GOOGLE_URL = 'https://maps.googleapis.com/maps/api/js?callback=' + GOOGLE_MAP_READY;
const INFO_WINDOW_CLASS = 'gm-style-iw';

let CustomMarker;

const initCustomMarkerClass = function() {
    CustomMarker = function(options) {
        this._position = options.position;
        this._offset = options.offset;

        this._$overlayContainer = $('<div>')
            .css({
                position: 'absolute',
                display: 'none',
                cursor: 'pointer'
            })
            .append(options.html);

        this.setMap(options.map);
    };

    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.onAdd = function() {
        const $pane = $(this.getPanes().overlayMouseTarget);
        $pane.append(this._$overlayContainer);

        this._clickListener = google.maps.event.addDomListener(this._$overlayContainer.get(0), 'click', (function(e) {
            google.maps.event.trigger(this, 'click');
            e.preventDefault();
        }).bind(this));

        this.draw();
    };

    CustomMarker.prototype.onRemove = function() {
        google.maps.event.removeListener(this._clickListener);

        this._$overlayContainer.remove();
    };

    CustomMarker.prototype.draw = function() {
        const position = this.getProjection().fromLatLngToDivPixel(this._position);

        this._$overlayContainer.css({
            left: position.x + this._offset.left,
            top: position.y + this._offset.top,
            display: 'block'
        });
    };
};


const googleMapsLoaded = function() {
    return window.google && window.google.maps;
};

let googleMapsLoader;


const GoogleProvider = DynamicProvider.inherit({

    _mapType: function(type) {
        const mapTypes = {
            hybrid: google.maps.MapTypeId.HYBRID,
            roadmap: google.maps.MapTypeId.ROADMAP,
            satellite: google.maps.MapTypeId.SATELLITE
        };
        return mapTypes[type] || mapTypes.hybrid;
    },

    _movementMode: function(type) {
        const movementTypes = {
            driving: google.maps.TravelMode.DRIVING,
            walking: google.maps.TravelMode.WALKING
        };
        return movementTypes[type] || movementTypes.driving;
    },

    _resolveLocation: function(location) {
        return new Promise(function(resolve) {
            const latLng = this._getLatLng(location);
            if(latLng) {
                resolve(new google.maps.LatLng(latLng.lat, latLng.lng));
            } else {
                this._geocodeLocation(location).then(function(geocodedLocation) {
                    resolve(geocodedLocation);
                });
            }
        }.bind(this));
    },

    _geocodedLocations: {},
    _geocodeLocationImpl: function(location) {
        return new Promise(function(resolve) {
            if(!isDefined(location)) {
                resolve(new google.maps.LatLng(0, 0));
                return;
            }

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': location }, function(results, status) {
                if(status === google.maps.GeocoderStatus.OK) {
                    resolve(results[0].geometry.location);
                } else {
                    errors.log('W1006', status);
                    resolve(new google.maps.LatLng(0, 0));
                }
            });
        });
    },

    _normalizeLocation: function(location) {
        return {
            lat: location.lat(),
            lng: location.lng()
        };
    },

    _normalizeLocationRect: function(locationRect) {
        return {
            northEast: this._normalizeLocation(locationRect.getNorthEast()),
            southWest: this._normalizeLocation(locationRect.getSouthWest())
        };
    },

    _loadImpl: function() {
        return new Promise(function(resolve) {
            if(googleMapsLoaded()) {
                resolve();
            } else {
                if(!googleMapsLoader) {
                    googleMapsLoader = this._loadMapScript();
                }

                googleMapsLoader.then(function() {
                    if(googleMapsLoaded()) {
                        resolve();
                        return;
                    }

                    this._loadMapScript().then(resolve);
                }.bind(this));
            }
        }.bind(this)).then(function() {
            initCustomMarkerClass();
        });
    },

    _loadMapScript: function() {
        return new Promise(function(resolve) {
            const key = this._keyOption('google');

            window[GOOGLE_MAP_READY] = resolve;
            ajax.sendRequest({
                url: GOOGLE_URL + (key ? ('&key=' + key) : ''),
                dataType: 'script'
            });
        }.bind(this)).then(function() {
            try {
                delete window[GOOGLE_MAP_READY];
            } catch(e) {
                window[GOOGLE_MAP_READY] = undefined;
            }
        });
    },

    _init: function() {
        return new Promise(function(resolve) {
            this._resolveLocation(this._option('center')).then(function(center) {
                const showDefaultUI = this._option('controls');

                this._map = new google.maps.Map(this._$container[0], {
                    zoom: this._option('zoom'),
                    center: center,
                    disableDefaultUI: !showDefaultUI
                });

                const listener = google.maps.event.addListener(this._map, 'idle', function() {
                    resolve(listener);
                });
            }.bind(this));
        }.bind(this)).then(function(listener) {
            google.maps.event.removeListener(listener);
        });
    },

    _attachHandlers: function() {
        this._boundsChangeListener = google.maps.event.addListener(this._map, 'bounds_changed', this._boundsChangeHandler.bind(this));
        this._clickListener = google.maps.event.addListener(this._map, 'click', this._clickActionHandler.bind(this));
    },

    _boundsChangeHandler: function() {
        const bounds = this._map.getBounds();
        this._option('bounds', this._normalizeLocationRect(bounds));

        const center = this._map.getCenter();
        this._option('center', this._normalizeLocation(center));

        if(!this._preventZoomChangeEvent) {
            this._option('zoom', this._map.getZoom());
        }
    },

    _clickActionHandler: function(e) {
        this._fireClickAction({ location: this._normalizeLocation(e.latLng) });
    },

    updateDimensions: function() {
        const center = this._option('center');
        google.maps.event.trigger(this._map, 'resize');
        this._option('center', center);

        return this.updateCenter();
    },

    updateMapType: function() {
        this._map.setMapTypeId(this._mapType(this._option('type')));

        return Promise.resolve();
    },

    updateBounds: function() {
        return Promise.all([
            this._resolveLocation(this._option('bounds.northEast')),
            this._resolveLocation(this._option('bounds.southWest'))
        ]).then(function(result) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(result[0]);
            bounds.extend(result[1]);

            this._map.fitBounds(bounds);
        }.bind(this));
    },

    updateCenter: function() {
        return this._resolveLocation(this._option('center')).then(function(center) {
            this._map.setCenter(center);
            this._option('center', this._normalizeLocation(center));
        }.bind(this));
    },

    updateZoom: function() {
        this._map.setZoom(this._option('zoom'));

        return Promise.resolve();
    },

    updateControls: function() {
        const showDefaultUI = this._option('controls');

        this._map.setOptions({
            disableDefaultUI: !showDefaultUI
        });

        return Promise.resolve();
    },

    isEventsCanceled: function(e) {
        const gestureHandling = this._map && this._map.get('gestureHandling');
        const isInfoWindowContent = $(e.target).closest(`.${INFO_WINDOW_CLASS}`).length > 0;
        if(isInfoWindowContent || devices.real().deviceType !== 'desktop' && gestureHandling === 'cooperative') {
            return false;
        }
        return this.callBase();
    },

    _renderMarker: function(options) {
        return this._resolveLocation(options.location).then(function(location) {
            let marker;
            if(options.html) {
                marker = new CustomMarker({
                    map: this._map,
                    position: location,
                    html: options.html,
                    offset: extend({
                        top: 0,
                        left: 0
                    }, options.htmlOffset)
                });
            } else {
                marker = new google.maps.Marker({
                    position: location,
                    map: this._map,
                    icon: options.iconSrc || this._option('markerIconSrc')
                });
            }

            const infoWindow = this._renderTooltip(marker, options.tooltip);
            let listener;
            if(options.onClick || options.tooltip) {
                const markerClickAction = this._mapWidget._createAction(options.onClick || noop);
                const markerNormalizedLocation = this._normalizeLocation(location);

                listener = google.maps.event.addListener(marker, 'click', function() {
                    markerClickAction({
                        location: markerNormalizedLocation
                    });

                    if(infoWindow) {
                        infoWindow.open(this._map, marker);
                    }
                }.bind(this));
            }

            return {
                location: location,
                marker: marker,
                listener: listener
            };
        }.bind(this));
    },

    _renderTooltip: function(marker, options) {
        if(!options) {
            return;
        }

        options = this._parseTooltipOptions(options);

        const infoWindow = new google.maps.InfoWindow({
            content: options.text
        });
        if(options.visible) {
            infoWindow.open(this._map, marker);
        }

        return infoWindow;
    },

    _destroyMarker: function(marker) {
        marker.marker.setMap(null);
        if(marker.listener) {
            google.maps.event.removeListener(marker.listener);
        }
    },

    _renderRoute: function(options) {
        return Promise.all(map(options.locations, function(point) {
            return this._resolveLocation(point);
        }.bind(this))).then(function(locations) {
            return new Promise(function(resolve) {
                const origin = locations.shift();
                const destination = locations.pop();
                const waypoints = map(locations, function(location) {
                    return { location: location, stopover: true };
                });

                const request = {
                    origin: origin,
                    destination: destination,
                    waypoints: waypoints,
                    optimizeWaypoints: true,
                    travelMode: this._movementMode(options.mode)
                };

                new google.maps.DirectionsService().route(request, function(response, status) {
                    if(status === google.maps.DirectionsStatus.OK) {
                        const color = new Color(options.color || this._defaultRouteColor()).toHex();
                        const directionOptions = {
                            directions: response,
                            map: this._map,
                            suppressMarkers: true,
                            preserveViewport: true,
                            polylineOptions: {
                                strokeWeight: options.weight || this._defaultRouteWeight(),
                                strokeOpacity: options.opacity || this._defaultRouteOpacity(),
                                strokeColor: color
                            }
                        };

                        const route = new google.maps.DirectionsRenderer(directionOptions);
                        const bounds = response.routes[0].bounds;

                        resolve({
                            instance: route,
                            northEast: bounds.getNorthEast(),
                            southWest: bounds.getSouthWest()
                        });
                    } else {
                        errors.log('W1006', status);
                        resolve({
                            instance: new google.maps.DirectionsRenderer({})
                        });
                    }
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },

    _destroyRoute: function(routeObject) {
        routeObject.instance.setMap(null);
    },

    _fitBounds: function() {
        this._updateBounds();

        if(this._bounds && this._option('autoAdjust')) {
            const zoomBeforeFitting = this._map.getZoom();
            this._preventZoomChangeEvent = true;

            this._map.fitBounds(this._bounds);
            this._boundsChangeHandler();

            const zoomAfterFitting = this._map.getZoom();
            if(zoomBeforeFitting < zoomAfterFitting) {
                this._map.setZoom(zoomBeforeFitting);
            } else {
                this._option('zoom', zoomAfterFitting);
            }
            delete this._preventZoomChangeEvent;
        }

        return Promise.resolve();
    },

    _extendBounds: function(location) {
        if(this._bounds) {
            this._bounds.extend(location);
        } else {
            this._bounds = new google.maps.LatLngBounds();
            this._bounds.extend(location);
        }
    },

    clean: function() {
        if(this._map) {
            google.maps.event.removeListener(this._boundsChangeListener);
            google.maps.event.removeListener(this._clickListener);

            this._clearMarkers();
            this._clearRoutes();

            delete this._map;
            this._$container.empty();
        }

        return Promise.resolve();
    }

});

///#DEBUG
GoogleProvider.remapConstant = function(newValue) {
    GOOGLE_URL = newValue;
};
///#ENDDEBUG

module.exports = GoogleProvider;
