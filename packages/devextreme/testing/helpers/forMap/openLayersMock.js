/* global window */

(() => {
    const api = {};
    class MockView {
        constructor(options) {
            this.center = options.center;
            this.zoom = options.zoom;
            api.viewCenter = options.center;
            api.viewOptions = options;
            api.viewZoom = options.zoom;
        }
        setCenter(center) {
            this.center = center;
            api.viewCenter = center;
            api.viewCenterSetCount += 1;
        }
        setZoom(zoom) {
            this.zoom = zoom;
            api.viewZoom = zoom;
        }
    }
    class MockMap {
        constructor(options) {
            this.options = options;
            this.view = options.view;
            api.mapCreated = true;
            api.mapInstance = this;
            api.mapOptions = options;
        }
        addLayer(layer) {
            api.tileLayer = layer;
            api.addedTileLayers.push(layer);
        }
        getView() {
            return this.view;
        }
        removeLayer(layer) {
            api.removedLayers.push(layer);
        }
        setTarget(target) {
            this.target = target;
            api.mapTarget = target;
        }
        updateSize() {
            api.mapResized = true;
        }
    }
    class MockImageTile {
        constructor(options) {
            if(api.throwOnTileSource) {
                throw new Error('Tile source creation failed');
            }
            this.options = options;
            api.tileSourceOptions = options;
        }
    }
    class MockTileLayer {
        constructor(options) {
            this.source = options.source;
            api.tileLayerOptions = options;
        }
        setSource(source) {
            this.source = source;
            api.tileSourceChanges.push(source);
        }
    }
    Object.assign(api, {
        Map: MockMap,
        View: MockView,
        control: {
            defaults: {
                defaults(options) {
                    api.controlOptions = options;
                    return [];
                }
            }
        },
        interaction: {
            defaults: {
                defaults(options) {
                    api.interactionOptions = options;
                    return [];
                }
            }
        },
        layer: {
            Tile: MockTileLayer
        },
        proj: {
            fromLonLat(coordinate) {
                api.projectedCoordinates.push([...coordinate]);
                return coordinate;
            }
        },
        source: {
            ImageTile: MockImageTile
        }
    });
    window.ol = api;
})();
