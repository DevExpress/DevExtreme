/* global window */

(() => {
    const api = {};
    const GEOGRAPHIC_PROJECTION = 'EPSG:4326';
    const WEB_MERCATOR_PROJECTION = 'EPSG:3857';
    const PROJECTION_SCALE = 1000;

    const transformCoordinate = (coordinate, source, destination) => {
        if(source === destination) {
            return [...coordinate];
        }
        if(source === GEOGRAPHIC_PROJECTION && destination === WEB_MERCATOR_PROJECTION) {
            return coordinate.map((value) => value * PROJECTION_SCALE);
        }
        if(source === WEB_MERCATOR_PROJECTION && destination === GEOGRAPHIC_PROJECTION) {
            return coordinate.map((value) => value / PROJECTION_SCALE);
        }

        return [...coordinate];
    };

    class MockCollection {
        constructor(items) {
            this.items = items;
        }

        forEach(callback) {
            this.items.forEach(callback);
        }

        getArray() {
            return this.items;
        }
    }

    class MockInteraction {
        constructor(active) {
            this.active = active;
        }

        getActive() {
            return this.active;
        }

        setActive(active) {
            this.active = active;
            api.interactionStateChanges.push({ interaction: this, active });
        }
    }

    class MockZoom {
        constructor() {
            api.zoomControlCreatedCount += 1;
        }
    }

    class MockView {
        constructor(options) {
            this.center = options.center;
            this.projection = options.projection || WEB_MERCATOR_PROJECTION;
            this.zoom = options.zoom;
            api.viewCenter = options.center;
            api.viewOptions = options;
            api.viewZoom = options.zoom;
        }

        calculateExtent() {
            return api.viewExtent;
        }

        fit(extent, options) {
            api.fittedExtent = extent;
            api.fitOptions = options;
        }

        getCenter() {
            return this.center;
        }

        getProjection() {
            return this.projection;
        }

        getZoom() {
            return this.zoom;
        }

        setCenter(center) {
            this.center = center;
            api.viewCenter = center;
            api.viewCenterSetCount += 1;
        }

        setZoom(zoom) {
            this.zoom = zoom;
            api.viewZoom = zoom;
            api.viewZoomSetCount += 1;
        }
    }

    class MockMap {
        constructor(options) {
            this.options = options;
            this.view = options.view;
            this.eventHandlers = {};
            api.mapCreated = true;
            api.mapInstance = this;
            api.mapOptions = options;
        }

        addControl(control) {
            api.addedControls.push(control);
        }

        addLayer(layer) {
            api.tileLayer = layer;
            api.addedTileLayers.push(layer);
        }

        getInteractions() {
            return this.options.interactions;
        }

        getView() {
            return this.view;
        }

        on(type, listener) {
            this.eventHandlers[type] = this.eventHandlers[type] || [];
            this.eventHandlers[type].push(listener);
        }

        removeControl(control) {
            api.removedControls.push(control);
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

        un(type, listener) {
            const handlers = this.eventHandlers[type] || [];
            this.eventHandlers[type] = handlers.filter((handler) => handler !== listener);
        }

        trigger(type, event) {
            (this.eventHandlers[type] || []).slice().forEach((handler) => handler(event || {}));
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
            Zoom: MockZoom,
            defaults: {
                defaults(options) {
                    api.controlOptions = options;
                    return new MockCollection([]);
                }
            }
        },
        interaction: {
            defaults: {
                defaults(options) {
                    api.interactionOptions = options;
                    api.interactions = [new MockInteraction(true), new MockInteraction(false)];
                    return new MockCollection(api.interactions);
                }
            }
        },
        layer: {
            Tile: MockTileLayer
        },
        proj: {
            getUserProjection() {
                return api.userProjection;
            },
            toLonLat(coordinate, projection) {
                const result = transformCoordinate(coordinate, projection, GEOGRAPHIC_PROJECTION);
                if(result[0] < -180 || result[0] > 180) {
                    result[0] = ((result[0] + 180) % 360 + 360) % 360 - 180;
                }

                return result;
            },
            transform(coordinate, source, destination) {
                api.transformedCoordinates.push({
                    coordinate: [...coordinate],
                    destination,
                    source
                });
                if(source === GEOGRAPHIC_PROJECTION) {
                    api.projectedCoordinates.push([...coordinate]);
                }

                return transformCoordinate(coordinate, source, destination);
            },
            transformExtent(extent, source, destination) {
                api.transformedExtents.push({
                    destination,
                    extent: [...extent],
                    source
                });
                const southWest = transformCoordinate([extent[0], extent[1]], source, destination);
                const northEast = transformCoordinate([extent[2], extent[3]], source, destination);

                return [southWest[0], southWest[1], northEast[0], northEast[1]];
            }
        },
        source: {
            ImageTile: MockImageTile
        }
    });
    window.ol = api;
})();
