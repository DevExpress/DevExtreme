(() => {
    const atlas = window.atlas = {
        Map: function(_, options) {
            if(options) {
                atlas.optionsSpecified = true;
                atlas.options = options;
            }

            this.events = {
                add: (eventName, targetOrCallback, callback) => {
                    atlas.addedEvents = atlas.addedEvents || [];
                    const callbackFun = callback ?? targetOrCallback;
                    atlas.addedEvents.push(eventName);

                    if(eventName === 'click') {
                        atlas.clickActionCallback = callbackFun;
                    }

                    if(eventName === 'move') {
                        atlas.moveActionCallback = callbackFun;
                    }
                },
                remove: (eventName) => {
                    atlas.removedEvents = atlas.removedEvents || [];
                    atlas.removedEvents.push(eventName);
                },
                addOnce: () => {},
            };
            this.setCamera = (cameraOptions) => {
                window.atlas.cameraOptions = cameraOptions;
            };
            this.setStyle = (styleOptions) => {
                atlas.styleOptions = styleOptions;
            };
            this.getStyle = () => {
                return atlas.styleOption ?? { style: atlas.options.style };
            };
            this.setUserInteraction = (interactionOptions) => {
                atlas.interactionOptions = interactionOptions;
            };
            this.resize = () => {
                atlas.mapResized = true;
            };
            this.dispose = () => {
                atlas.mapDisposed = true;
            };
            this.getCamera = () => {
                return {
                    bounds: [55, 5, 5, 55],
                    center: [5, 5],
                    zoom: 5
                };
            };
            this.controls = {
                add: (controls, options) => {
                    atlas.addedControls = controls.length;
                    atlas.controlOptions = options;
                },
                remove: (controls) => {
                    atlas.addedControls = atlas.addedControls ? atlas.addedControls - controls.length : 0;
                },
                getControls: () => {
                    return new Array(atlas.addedControls ?? 0);
                }
            };
            this.layers = {
                add: (layer) => {
                    window.atlas.addedLayers = atlas.addedLayers || [];
                    window.atlas.addedLayers.push(layer);
                },
                remove: (layer) => {
                    window.atlas.removedLayers = atlas.removedLayers || [];
                    window.atlas.removedLayers.push(layer);
                }
            };
            this.sources = {
                add: (source) => {
                    window.atlas.addedSources = atlas.addedSources || [];
                    window.atlas.addedSources.push(source);
                },
                remove: (source) => {
                    window.atlas.removedSources = atlas.removedSources || [];
                    window.atlas.removedSources.push(source);
                }
            };
            this.markers = {
                add: (marker) => {
                    atlas.addedMarkers = atlas.addedMarkers || [];
                    atlas.addedMarkers.push(marker);
                },
                remove: (marker) => {
                    atlas.removedMarkers = atlas.removedMarkers || [];
                    atlas.removedMarkers.push(marker);
                }
            };
            this.popups = {
                add: (popup) => {
                    atlas.addedPopups = atlas.addedPopups || [];
                    atlas.addedPopups.push(popup);
                },
                remove: (popup) => {
                    atlas.removedPopups = atlas.removedPopups || [];
                    atlas.removedPopups.push(popup);
                }
            };
        },
        control: {
            CompassControl: function() {},
            PitchControl: function() {},
            StyleControl: function() {},
            ZoomControl: function() {},
        },
        data: {
            Feature: function(geometry, properties) {
                return {
                    geometry: geometry,
                    properties: properties
                };
            },
            LineString: function(coordinates) {
                return {
                    type: 'LineString',
                    coordinates: coordinates
                };
            },
            Position: function(longitude, latitude) {
                return [longitude, latitude];
            },
            BoundingBox: function(coordinates) {
                this.coordinates = coordinates;
            }
        },
        layer: {
            LineLayer: function(source, _, options) {
                atlas.lineLayerSource = source;
                atlas.lineLayerOptions = options;
            }
        },
        source: {
            DataSource: function() {
                this.add = (data) => {
                    atlas.addedData = data;
                };
            }
        },
        HtmlMarker: function(options) {
            atlas.markerOptions = options;
        },
        Popup: function(options) {
            atlas.popupOptions = options;

            this.open = () => {
                atlas.popupOpened = true;
            };
            this.close = () => {
                atlas.popupOpened = false;
            };
            this.isOpen = () => {
                return atlas.popupOpened === true;
            };
        },
    };

    atlas.data.BoundingBox.fromPositions = function(positions) {
        return new atlas.data.BoundingBox([
            Math.min(...positions.map(p => p[0])),
            Math.min(...positions.map(p => p[1])),
            Math.max(...positions.map(p => p[0])),
            Math.max(...positions.map(p => p[1]))
        ]);
    };

    atlas.data.BoundingBox.merge = function(box1, box2) {
        return new atlas.data.BoundingBox([
            Math.min(box1.coordinates[0], box2.coordinates[0]),
            Math.min(box1.coordinates[1], box2.coordinates[1]),
            Math.max(box1.coordinates[2], box2.coordinates[2]),
            Math.max(box1.coordinates[3], box2.coordinates[3])
        ]);
    };
})();
