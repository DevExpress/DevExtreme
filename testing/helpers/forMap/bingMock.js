/* global jQuery */

var Microsoft = window.Microsoft = {};

Microsoft.Maps = {
    MapTypeId: {
        'aerial': 1,
        'auto': 2,
        'birdseye': 3,
        'collinsBart': 4,
        'mercator': 5,
        'ordnanceSurvey': 6,
        'road': 7
    },
    Directions: {
        DirectionsManager: function(map) {
            var waypoints = [];

            Microsoft.directionsMapSpecified = map instanceof Microsoft.Maps.Map;
            Microsoft.directionsInstance = (Microsoft.directionsInstance || 0) + 1;

            this.addWaypoint = function(waypoint, index) {
                waypoints.push(waypoint);
                Microsoft.lastDirectionPoints = [waypoints[0].getLocation(), waypoints[waypoints.length - 1].getLocation()];
            };
            this.calculateDirections = function() {};// ()
            this.clearDisplay = function() {};// ()
            this.dispose = function() {
                Microsoft.directionRemoved = true;
            };
            this.getAllWaypoints = function() {};// ()
            this.getMap = function() {};// ()
            this.getNearbyMajorRoads = function() {};// (location:Location, callback:function, errorCallback:function, userData:object)
            this.getRenderOptions = function() {};// ()
            this.getRequestOptions = function() {};// ()
            this.getRouteResult = function() {};// ()
            this.removeWaypoint = function() {};// (waypoint:Waypoint) or removeWaypoints(index:number)
            this.resetDirections = function() {};// (options:ResetDirectionsOptions)
            this.reverseGeocode = function() {};// (location:Location, callback:function, errorCallback:function, userData:object)
            this.setMapView = function() {};// ()
            this.setRenderOptions = function(options) {
                Microsoft.directionsOptions = Microsoft.directionsOptions || {};
                Microsoft.directionsOptions.drivingPolylineOptions = options.drivingPolylineOptions;
                Microsoft.directionsOptions.walkingPolylineOptions = options.walkingPolylineOptions;
            };
            this.setRequestOptions = function(options) {
                Microsoft.directionsOptions = Microsoft.directionsOptions || {};
                Microsoft.directionsOptions.routeMode = options.routeMode;
            };
        },
        RouteMode: {
            driving: 1,
            walking: 2
        },
        Waypoint: function(options) {
            this.clear = function() {};// ()
            this.dispose = function() {};// ()
            this.getAddress = function() {};// ()
            this.getBusinessDetails = function() {};// ()
            this.getDisambiguationContainer = function() {};// ()
            this.getDisambiguationResult = function() {};// ()
            this.getLocation = function() {
                return options.location;
            };// ()
            this.getPushpin = function() {};// ()
            this.getShortAddress = function() {};// ()
            this.isExactLocation = function() {};// ()
            this.isViapoint = function() {};// ()
            this.setOptions = function() {};// (options:WaypointOptions)
        }
    },
    Events: {
        addHandler: function(_, name, callback) {
            switch(name) {
                case 'tiledownloadcomplete':
                    Microsoft.mapInitialized = true;
                    setTimeout(callback);
                    return 'tiledownloadcompleteHandler';
                case 'click':
                    Microsoft.clickActionCallback = callback;
                    return 'clickHandler';
                case 'directionsUpdated':
                    if(Microsoft.abortDirectionsUpdate) {
                        return;
                    }

                    var lastDirectionPoints = Microsoft.lastDirectionPoints;
                    setTimeout(function() {
                        callback({
                            routeSummary: [{
                                northEast: lastDirectionPoints[0],
                                southWest: lastDirectionPoints[1]
                            }]
                        });
                    });
                    return 'directionsUpdatedHandler';
                case 'directionsError':
                    if(!Microsoft.abortDirectionsUpdate) {
                        return;
                    }

                    setTimeout(function() {
                        callback({
                            responseCode: 1, message: 'Directions error'
                        });
                    });
                    return 'directionsErrorHandler';
                case 'viewchange':
                    Microsoft.viewChangeCallback = callback;
                    return 'viewchangeHandler';
                case 'viewchangeend':
                    Microsoft.viewChangeEndCallback = callback;
                    return 'viewchangeendHandler';
            }
        },
        addThrottledHandler: function() {}, // (target:object, eventName:string, handler:function, throttleInterval:number)
        hasHandler: function() {}, // (target:object, eventName:string)
        invoke: function(_, handler) {
            switch(handler) {
                case 'viewchange':
                    Microsoft.viewChangeCallback();
                    break;
            }
        },
        removeHandler: function(handler) {
            switch(handler) {
                case 'tiledownloadcompleteHandler':
                    Microsoft['tiledownloadcompleteHandlerRemoved'] = true;
                    break;
                case 'clickHandler':
                    Microsoft.clickHandlerRemoved = true;
                    break;
                case 'directionsUpdatedHandler':
                case 'directionsErrorHandler':
                    Microsoft.directionsUpdatedHandlerRemoved = true;
                    Microsoft.directionsErrorHandlerRemoved = true;
                    break;
                case 'viewchangeHandler':
                    Microsoft['viewchangeHandlerRemoved'] = true;
                    break;
                case 'viewchangeendHandler':
                    Microsoft['viewchangeendHandlerRemoved'] = true;
                    break;
            }
        }
    },
    loadModule: function(module, options) {
        if(options.callback) {
            options.callback();
        }
    },
    Map: function(node, options) {
        if(options) {
            Microsoft.optionsSpecified = true;
            Microsoft.options = jQuery.extend(Microsoft.options || {}, options);
        }

        this.entities = new Microsoft.Maps.EntityCollection();
        this.blur = function() {};// ()
        this.dispose = function() {};// ()
        this.focus = function() {};// ()
        this.getBounds = function() {
            if(Microsoft.boundsValue) {
                return Microsoft.boundsValue;
            } else {
                return new Microsoft.Maps.LocationRect();
            }
        };
        this.getCenter = function() {
            if(Microsoft.centerValue) {
                return new Microsoft.Maps.Location(Microsoft.centerValue[0], Microsoft.centerValue[1]);
            } else {
                return new Microsoft.Maps.Location(0, 0);
            }
        };
        this.getCopyrights = function() {};// (callback:function)
        this.getCredentials = function() {};// (callback:function)
        this.getHeading = function() {};// ()
        this.getHeight = function() {};// ()
        this.getImageryId = function() {};// ()
        this.getMapTypeId = function() {};// ()
        this.getMetersPerPixel = function() {};// ()
        this.getMode = function() {};// ()
        this.getModeLayer = function() {};// ()
        this.getOptions = function() {};// ()
        this.getPageX = function() {};// ()
        this.getPageY = function() {};// ()
        this.getRootElement = function() {};// ()
        this.getTargetBounds = function() {};// ()
        this.getTargetCenter = function() {};// ()
        this.getTargetHeading = function() {};// ()
        this.getTargetMetersPerPixel = function() {};// ()
        this.getTargetZoom = function() {};// ()
        this.getUserLayer = function() {};// ()
        this.getViewportX = function() {};// ()
        this.getViewportY = function() {};// ()
        this.getWidth = function() {};// ()
        this.getZoom = function() {
            return Microsoft.zoomValue;
        };
        this.getZoomRange = function() {};// ()
        this.isDownloadingTiles = function() {};// ()
        this.isMercator = function() {};// ()
        this.isRotationEnabled = function() {};// ()
        this.setMapType = function() {};// (mapTypeId:string)
        this.setOptions = function(options) {
            Microsoft.assignedOptions = jQuery.extend(Microsoft.assignedOptions || {}, options);
        };
        this.setView = function(options) {
            if(options.animate) {
                throw new Error('Animation turned should be turned off');
            }
            Microsoft.assignedOptions = jQuery.extend(Microsoft.assignedOptions || {}, options);
            if(options.bounds) {
                Microsoft.boundFittedCount = (Microsoft.boundFittedCount || 0) + 1;
                if(Microsoft.fitBoundsCallback) {
                    Microsoft.fitBoundsCallback();
                }
            }
        };
        this.tryLocationToPixel = function() {};// (location:Location |Location[], reference?:PixelReference)
        this.tryPixelToLocation = function(point) {
            return new Microsoft.Maps.Location(point.x, point.y);
        };
    },
    LabelOverlay: {
        visible: 'visible',
        hidden: 'hidden'
    },
    Location: function(latitude, longitude, altitude, altitudeReference) {
        this.altitude = altitude;
        this.altitudeReference = altitudeReference;
        this.latitude = latitude || 0;
        this.longitude = longitude || 0;
    },
    LocationRect: function(location) {
        this.points = [location];
        this.clone = function() {
            var clone = new Microsoft.Maps.LocationRect();
            clone.points = this.points;
            return clone;
        };

        Microsoft.locationRectInstances = Microsoft.locationRectInstances || [];
        Microsoft.locationRectInstances.push(this);
    },
    Pushpin: function(location, options) {
        Microsoft.pushpinLocation = location;
        Microsoft.pushpinInstance = (Microsoft.pushpinInstance || 0) + 1;
        Microsoft.pushpinOptions = options;

        this.getAnchor = function() {};// ()
        this.getIcon = function() {
            return options.icon;
        };
        this.getHeight = function() {};// ()
        this.getLocation = function() {};// ()
        this.getText = function() {};// ()
        this.getTextOffset = function() {};// ()
        this.getTypeName = function() {};// ()
        this.getVisible = function() {};// ()
        this.getWidth = function() {};// ()
        this.getZIndex = function() {};// ()
        this.setLocation = function() {};// (location:Location)
        this.setOptions = function() {};// (options:PushpinOptions)
        this.toString = function() {};// ()
    },
    Color: {
        a: 0,
        fromHex: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            this.r = parseInt(result[1], 16);
            this.g = parseInt(result[2], 16);
            this.b = parseInt(result[3], 16);
        }
    },
    Polyline: function(locations, options) {
        this.getLocations = function() {};// ()
        this.getStrokeColor = function() {};// ()
        this.getStrokeDashArray = function() {};// ()
        this.getStrokeThickness = function() {};// ()
        this.getVisible = function() {};// ()
        this.setLocations = function() {};// (locations:Location[])
        this.setOptions = function() {};// (options:PolylineOptions)
        this.toString = function() {};// ()
    },
    EntityCollection: function(options) {
        this.clear = function() {};// ()
        this.get = function() {};// (index:number)
        this.getLength = function() {};// ()
        this.getVisible = function() {};// ()
        this.getZIndex = function() {};// ()
        this.indexOf = function() {};// (entity:Entity*)
        this.insert = function() {};// (entity:Entity*, index:number)
        this.pop = function() {};// ()
        this.push = function(entity) {
            if(entity instanceof Microsoft.Maps.Pushpin) {
                Microsoft.pushpinAddedToMap = true;
            }
            if(entity instanceof Microsoft.Maps.Infobox) {
                Microsoft.infoboxAddedToMap = true;
            }
        };
        this.remove = function(entity) {
            if(entity instanceof Microsoft.Maps.Pushpin) {
                Microsoft.pushpinRemoved = true;
            }
        };
        this.removeAt = function() {};// (index:number)
        this.setOptions = function() {};// (options:EntityCollectionOptions)
        this.toString = function() {};// ()
    },
    Infobox: function(location, options) {
        Microsoft.infoboxLocation = location;
        Microsoft.infoboxOptions = {};
        Microsoft.infoboxOptions.description = options.description;
        Microsoft.infoboxOptions.visible = options.visible;

        this.open = function() {};
        this.close = function() {};
        this.setMap = function(map) {
            if(!map) {
                Microsoft.infoboxRemoved = true;
            } else {
                Microsoft.infoboxAddedToMap = true;
            }
        };
        this.getContent = function() {};
        this.getPosition = function() {};
        this.setContent = function() {};
        this.setOptions = function(options) {
            if(options.visible) {
                Microsoft.infoboxOpened = true;
            }
        };
        this.setPosition = function() {};
    },
    Search: {
        SearchManager: function(options) {
            this.geocode = function(options) {
                Microsoft.geocodeCalled = (Microsoft.geocodeCalled || 0) + 1;
                var results = [];
                if(options.where !== '') {
                    results.push({
                        name: options.where,
                        location: { latitude: -1.12345, longitude: -1.12345 }
                    });
                }

                if(options.callback) {
                    options.callback({ results: results });
                }
            };
        }
    },
    Point: function(x, y) {
        this.x = x;
        this.y = y;
    },
    MouseEventArgs: function(x, y) {
        this.targetType = 'map';
        this.target = new Microsoft.Maps.Map();
        this.getX = function() {
            return x;
        };
        this.getY = function() {
            return y;
        };
        this.location = { latitude: x, longitude: y };
    }
};

Microsoft.Maps.LocationRect.prototype = {
    getNorthwest: function() {
        return this.points[0] || new Microsoft.Maps.Location();
    },
    getSoutheast: function() {
        return this.points[0] || new Microsoft.Maps.Location();
    }
};
Microsoft.Maps.LocationRect.fromLocations = function() {
    var locationRect = new Microsoft.Maps.LocationRect();
    locationRect.points = [];
    locationRect.points.push.apply(locationRect.points, arguments);
    return locationRect;
};
