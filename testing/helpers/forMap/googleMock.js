/* global jQuery */
(() => {
    const google = window.google = {
        maps: {
            event: {
                trigger: function(_, name) {
                    switch(name) {
                        case 'resize':
                            google.mapResized = true;
                            break;
                        case 'bounds_changed':
                            google.boundsChangedCallback();
                            break;
                        case 'click':
                            google.clickActionCallback();
                            break;
                    }
                },
                addListener: function(_, name, callback) {
                    switch(name) {
                        case 'idle':
                            google.mapInitialized = true;
                            setTimeout(callback);
                            return 'idleHandler';
                        case 'click':
                            google.clickActionCallback = callback;
                            return 'clickHandler';
                        case 'bounds_changed':
                            google.boundsChangedCallback = callback;
                            return 'bounds_changedHandler';
                    }
                },
                removeListener: function(listener) {
                    switch(listener) {
                        case 'idleHandler':
                            google.idleHandlerRemoved = true;
                            break;
                        case 'clickHandler':
                            google.clickHandlerRemoved = true;
                            break;
                        case 'bounds_changedHandler':
                            google.boundsChangedHandlerRemoved = true;
                            break;
                        case 'domClick':
                            google.domClickHandlerRemoved = true;
                            break;
                    }
                },
                addDomListener: function(_, name, callback) {
                    switch(name) {
                        case 'click':
                            google.domClickActionCallback = callback;
                            return 'domClick';
                    }
                }
            },
            MapTypeId: {
                HYBRID: 1,
                ROADMAP: 2,
                SATELLITE: 3,
                TERRAIN: 4
            },
            TravelMode: {
                BICYCLING: 1,
                DRIVING: 2,
                TRANSIT: 3,
                WALKING: 4
            },
            DirectionsStatus: {
                INVALID_REQUEST: 1,
                MAX_WAYPOINTS_EXCEEDED: 2,
                NOT_FOUND: 3,
                OK: 4,
                OVER_QUERY_LIMIT: 5,
                REQUEST_DENIED: 6,
                UNKNOWN_ERROR: 7,
                ZERO_RESULTS: 8
            },
            GeocoderStatus: {
                ERROR: 1,
                INVALID_REQUEST: 2,
                OK: 3,
                OVER_QUERY_LIMIT: 4,
                REQUEST_DENIED: 5,
                UNKNOWN_ERROR: 6,
                ZERO_RESULTS: 7
            },
            Map: function(node, options) {
                if(options) {
                    google.optionsSpecified = true;
                    google.options = {};
                    google.options.mapTypeId = options.mapTypeId;
                    google.options.zoom = options.zoom;
                    google.options.disableDefaultUI = options.disableDefaultUI;
                    google.options.center = options.center;
                }

                this.fitBounds = function(bounds) {
                    google.fittedBounds = bounds;
                    google.boundsFittedCount = (google.boundsFittedCount || 0) + 1;
                    if(google.fitBoundsCallback) {
                        google.fitBoundsCallback();
                    }
                };
                this.get = function(option) {
                    return google[option];
                };
                this.getBounds = function() {
                    if(!google.boundsValue) {
                        return new google.maps.LatLngBounds();
                    }
                    return google.boundsValue;
                };
                this.getCenter = function() {
                    if(!google.centerValue) {
                        return new google.maps.LatLng(0, 0);
                    }
                    return new google.maps.LatLng(google.centerValue[0], google.centerValue[1]);
                };
                this.getDiv = function() {};
                this.getHeading = function() {};
                this.getMapTypeId = function() {};
                this.getProjection = function() {};
                this.getStreetView = function() {};
                this.getTilt = function() {};
                this.getZoom = function() {
                    return google.zoomValue;
                };
                this.panBy = function() {};
                this.panTo = function() {};
                this.panToBounds = function() {};
                this.setCenter = function(center) {
                    google.assignedCenterCount = (google.assignedCenterCount || 0) + 1;
                    google.assignedCenter = center;
                };
                this.setHeading = function() {};
                this.setMapTypeId = function(mapTypeId) {
                    google.assignedMapTypeId = mapTypeId;
                };
                this.setOptions = function(options) {
                    google.assignedOptions = {};
                    google.assignedOptions.disableDefaultUI = options.disableDefaultUI;
                    google.gestureHandling = options.gestureHandling;
                };
                this.setStreetView = function() {};
                this.setTilt = function() {};
                this.setZoom = function(zoom) {
                    google.assignedZoom = zoom;
                };
            },
            LatLng: function(x, y) {
                this.x = x || 0;
                this.y = y || 0;
                this.lat = function() { return this.x; };
                this.lng = function() { return this.y; };
            },
            Geocoder: function() {
                this.geocode = function(response, callback) {
                    google.geocodeCalled = (google.geocodeCalled || 0) + 1;
                    callback([{
                        geometry: {
                            location: new google.maps.LatLng(-1.12345, -1.12345)
                        }
                    }], response.address !== '' ? google.maps.GeocoderStatus.OK : google.maps.GeocoderStatus.ERROR);
                };
            },
            DirectionsService: function() {
                this.route = function(request, callback) {
                    google.directionDrawnByDirectionService = true;
                    google.directionTravelMode = request.travelMode;

                    const result = new google.maps.DirectionsResult();
                    const route = {
                        bounds: {
                            getNorthEast: function() {
                                return request.origin;
                            },
                            getSouthWest: function() {
                                return request.destination;
                            }
                        },
                        legs: []
                    };

                    route.legs.push([request.origin]);
                    jQuery.each(request.waypoints, function() {
                        route.legs.push([this.location]);
                    });
                    route.legs.push([request.destination]);

                    result.routes.push(route);
                    const status = google.statusCallback ? google.statusCallback() : google.maps.DirectionsStatus.OK;
                    callback(result, status);
                };
            },
            DirectionsRenderer: function(options) {
                if(options) {
                    google.directionsRendererOptionsSpecified = true;
                    google.routeInstance = (google.routeInstance || 0) + 1;
                    google.directionsRendererOptions = {};
                    google.directionsRendererOptions.polylineOptions = options.polylineOptions;
                    google.directionsRendererOptions.directionsSpecified = options.directions instanceof google.maps.DirectionsResult;
                    google.directionsRendererOptions.mapSpecified = options.map instanceof google.maps.Map;
                }

                this.getDirections = function() {};// ()
                this.getMap = function() {};// ()
                this.getPanel = function() {};// ()
                this.getRouteIndex = function() {};// ()
                this.setDirections = function() {};// (directions:DirectionsResult)
                this.setMap = function(map) {
                    if(map === null) {
                        google.routeRemoved = true;
                    }
                };
                this.setOptions = function() {};// (options:DirectionsRendererOptions)
                this.setPanel = function() {};// (panel:Node)
                this.setRouteIndex = function() {};// (routeIndex:number)
            },
            DirectionsResult: function() {
                this.routes = [];
            },
            DirectionsRoute: function() {

            },
            Marker: function(options) {
                if(options) {
                    google.markerOptionsSpecified = true;
                    google.markerInstance = (google.markerInstance || 0) + 1;
                    google.markerOptions = {};
                    google.markerOptions.mapSpecified = options.map instanceof google.maps.Map;
                    google.markerOptions.position = options.position;
                    google.markerOptions.icon = options.icon;
                }

                this.getAnimation = function() {};
                this.getClickable = function() {};
                this.getCursor = function() {};
                this.getDraggable = function() {};
                this.getFlat = function() {};
                this.getIcon = function() {
                    return options.icon;
                };
                this.getMap = function() {};
                this.getPosition = function() {};
                this.getShadow = function() {};
                this.getShape = function() {};
                this.getTitle = function() {};
                this.getVisible = function() {};
                this.getZIndex = function() {};
                this.setAnimation = function() {};
                this.setClickable = function() {};
                this.setCursor = function() {};
                this.setDraggable = function() {};
                this.setFlat = function() {};
                this.setIcon = function() {};
                this.setMap = function(map) {
                    if(map === null) {
                        google.markerRemoved = true;
                    }
                };
                this.setOptions = function() {};
                this.setPosition = function() {};
                this.setShadow = function() {};
                this.setShape = function() {};
                this.setTitle = function() {};
                this.setVisible = function() {};
                this.setZIndex = function() {};
            },
            OverlayView: function() {
                this.bindTo = function() {};
                this.getPanes = function() {
                    return {
                        overlayMouseTarget: google.overlayMouseTarget
                    };
                };
                this.getProjection = function() {
                    return {
                        fromLatLngToDivPixel: function(location) {
                            google.overlayProjectedLocation = location;

                            return {
                                x: 100,
                                y: 200
                            };
                        }
                    };
                };
                this.setMap = function(map) {
                    if(map === null) {
                        google.overlayRemoved = true;

                        this.onRemove();
                    } else {
                        google.overlayInstance = (google.overlayInstance || 0) + 1;
                        google.overlayMouseTarget = document.createElement('div');

                        this.onAdd();
                    }
                };
            },
            LatLngBounds: function(x, y) {
                google.LatLngBoundsPoints = this._points = [];

                this.extend = function(point) {
                    google.LatLngBoundsPoints.push(point);
                };

                this.contains = function() {};
                this.equals = function() {};

                this.getCenter = function() {};
                this.getNorthEast = function() {
                    return new google.maps.LatLng();
                };
                this.getSouthWest = function() {
                    return new google.maps.LatLng();
                };
                this.intersects = function() {};
                this.isEmpty = function() {};
                this.toSpan = function() {};
                this.toString = function() {};
                this.toUrlValue = function() {};
                this.union = function() {};
            },
            InfoWindow: function(options) {
                if(options) {
                    google.infoWindowOptionsSpecified = true;
                    google.infoWindowOptions = {};
                    google.infoWindowOptions.content = options.content;
                }

                this.open = function(map, marker) {
                    google.infoWindowOpened = (google.infoWindowOpened || 0) + 1;
                    google.openInfoWindowOptions = {};
                    google.openInfoWindowOptions.mapSpecified = map instanceof google.maps.Map;
                    google.openInfoWindowOptions.markerSpecified = marker instanceof google.maps.Marker;
                };
                this.close = function() {};
                this.setMap = function() {};
                this.getContent = function() {};
                this.getPosition = function() {};
                this.getZIndex = function() {};
                this.setContent = function() {};
                this.setOptions = function() {};
                this.setPosition = function() {};
                this.setZIndex = function() {};
            },
            MouseEvent: function(latLng) {
                this.stop = function() {};
                this.latLng = latLng;
            }
        }
    };
})();
