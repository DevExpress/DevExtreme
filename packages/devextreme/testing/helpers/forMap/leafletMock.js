(() => {
    const makeLatLng = (lat, lng) => ({
        lat: typeof lat === 'object' ? lat.lat : lat,
        lng: typeof lat === 'object' ? lat.lng : lng,
    });

    const makeBounds = (sw, ne) => {
        const _sw = makeLatLng(sw.lat ?? sw[0], sw.lng ?? sw[1]);
        const _ne = makeLatLng(ne.lat ?? ne[0], ne.lng ?? ne[1]);

        const bounds = {
            _sw,
            _ne,
            extend(latLng) {
                const loc = makeLatLng(latLng.lat, latLng.lng);
                this._sw = { lat: Math.min(this._sw.lat, loc.lat), lng: Math.min(this._sw.lng, loc.lng) };
                this._ne = { lat: Math.max(this._ne.lat, loc.lat), lng: Math.max(this._ne.lng, loc.lng) };
                return this;
            },
            getNorthEast() { return this._ne; },
            getSouthWest() { return this._sw; },
        };
        return bounds;
    };

    window.L = {
        // --- Map ---
        map: function(container, options) {
            L.mapOptions = options;
            L.mapCreated = true;

            const map = {
                _center: options?.center ?? { lat: 0, lng: 0 },
                _zoom: options?.zoom ?? 1,
                _eventHandlers: {},

                on(event, handler) {
                    L.addedEvents = L.addedEvents || [];
                    L.addedEvents.push(event);
                    this._eventHandlers[event] = this._eventHandlers[event] || [];
                    this._eventHandlers[event].push(handler);

                    if(event === 'click') { L.mapClickCallback = handler; }
                    if(event === 'moveend') { L.mapMoveEndCallback = handler; }
                    if(event === 'zoomend') { L.mapZoomEndCallback = handler; }
                },
                off(event, handler) {
                    L.removedEvents = L.removedEvents || [];
                    L.removedEvents.push(event);
                    if(this._eventHandlers[event]) {
                        this._eventHandlers[event] = this._eventHandlers[event].filter(h => h !== handler);
                    }
                },
                setView(center, zoom) {
                    L.setViewArgs = { center, zoom };
                    this._center = center;
                    this._zoom = zoom ?? this._zoom;
                },
                setZoom(zoom) {
                    L.setZoomArg = zoom;
                    this._zoom = zoom;
                },
                getZoom() { return L.mockZoom ?? this._zoom; },
                getCenter() { return L.mockCenter ?? this._center; },
                getBounds() {
                    return L.mockBounds ?? makeBounds(
                        { lat: (this._center.lat ?? 0) - 1, lng: (this._center.lng ?? 0) - 1 },
                        { lat: (this._center.lat ?? 0) + 1, lng: (this._center.lng ?? 0) + 1 }
                    );
                },
                fitBounds(bounds, options) {
                    L.fitBoundsArg = bounds;
                    L.fitBoundsOptions = options;
                    if(bounds && bounds.getNorthEast) {
                        this._center = {
                            lat: (bounds.getNorthEast().lat + bounds.getSouthWest().lat) / 2,
                            lng: (bounds.getNorthEast().lng + bounds.getSouthWest().lng) / 2,
                        };
                    }
                    if(L.fitBoundsCallback) {
                        L.fitBoundsCallback();
                    }
                },
                invalidateSize() { L.mapResized = true; },
                removeLayer(layer) {
                    L.removedLayers = L.removedLayers || [];
                    L.removedLayers.push(layer);
                },
                remove() { L.mapDisposed = true; },
                zoomControl: {
                    addTo() { L.zoomControlAdded = true; },
                    remove() { L.zoomControlAdded = false; },
                },
                dragging: { enable() {}, disable() {} },
                touchZoom: { enable() {}, disable() {} },
                doubleClickZoom: { enable() {}, disable() {} },
                scrollWheelZoom: { enable() {}, disable() {} },
                boxZoom: { enable() {}, disable() {} },
                keyboard: { enable() {}, disable() {} },
                attributionControl: {},
            };

            L.mapInstance = map;
            return map;
        },

        // --- Tile Layer ---
        tileLayer: function(url, options) {
            L.tileLayerUrl = url;
            L.tileLayerOptions = options;
            const layer = {
                addTo(map) {
                    L.addedTileLayers = L.addedTileLayers || [];
                    L.addedTileLayers.push({ url, options });
                    return layer;
                },
            };
            return layer;
        },

        // --- LatLng ---
        latLng: function(lat, lng) {
            if(typeof lat === 'object' && lat !== null && !Array.isArray(lat)) {
                return makeLatLng(lat.lat, lat.lng);
            }
            return makeLatLng(lat, lng);
        },

        // --- LatLngBounds ---
        latLngBounds: function(sw, ne) {
            return makeBounds(sw, ne ?? sw);
        },

        // --- Point ---
        point: function(x, y) {
            return { x, y };
        },

        // --- Marker ---
        marker: function(latLng, options) {
            L.markerOptions = options;
            L.lastMarkerLatLng = latLng;

            const marker = {
                _latLng: latLng,
                _popup: null,
                _popupOpen: false,
                _handlers: {},
                options: options || {},

                addTo(map) {
                    L.addedMarkers = L.addedMarkers || [];
                    L.addedMarkers.push(marker);
                    return marker;
                },
                remove() {
                    L.removedMarkers = L.removedMarkers || [];
                    L.removedMarkers.push(marker);
                },
                on(event, handler) {
                    this._handlers[event] = this._handlers[event] || [];
                    this._handlers[event].push(handler);
                    if(event === 'click') {
                        L.markerClickCallback = (args) => {
                            this._handlers.click.slice().forEach((clickHandler) => { clickHandler(args); });
                        };
                    }
                    return marker;
                },
                off(event, handler) {
                    if(handler && this._handlers[event]) {
                        this._handlers[event] = this._handlers[event]
                            .filter((eventHandler) => eventHandler !== handler);
                    } else {
                        delete this._handlers[event];
                    }
                    return marker;
                },
                bindPopup(popup) {
                    this._popup = popup;
                    L.boundPopup = popup;
                    this.on('click', () => {
                        if(this.isPopupOpen()) {
                            this.closePopup();
                        } else {
                            this.openPopup();
                        }
                    });
                    return marker;
                },
                openPopup() {
                    this._popupOpen = true;
                    L.popupOpened = true;
                    return marker;
                },
                closePopup() {
                    this._popupOpen = false;
                    L.popupOpened = false;
                    return marker;
                },
                isPopupOpen() {
                    return this._popupOpen;
                },
                getElement() {
                    return L.markerElement;
                },
                getPopup() {
                    return this._popup;
                },
            };

            return marker;
        },

        // --- DivIcon ---
        divIcon: function(options) {
            L.divIconOptions = options;
            return { isDivIcon: true, options };
        },

        // --- Icon ---
        icon: function(options) {
            L.iconOptions = options;
            return { isIcon: true, options };
        },

        // --- Popup ---
        popup: function(options) {
            L.popupOptions = options;
            const popup = {
                options: { offset: L.point(0, 7), ...options },
                _content: '',
                setContent(text) {
                    this._content = text;
                    L.popupContent = text;
                    return popup;
                },
                update() {
                    L.popupUpdateCount = (L.popupUpdateCount || 0) + 1;
                    return popup;
                },
            };
            return popup;
        },

        // --- Polyline ---
        polyline: function(coords, options) {
            L.polylineCoords = coords;
            L.polylineOptions = options;

            const polyline = {
                _coords: coords,
                addTo(map) {
                    // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                    L.addedPolylines = L.addedPolylines || [];
                    // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                    L.addedPolylines.push(polyline);
                    return polyline;
                },
                remove() {
                    // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                    L.removedPolylines = L.removedPolylines || [];
                    // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                    L.removedPolylines.push(polyline);
                },
                getBounds() {
                    if(!coords || coords.length === 0) {
                        return {
                            getNorthEast: () => undefined,
                            getSouthWest: () => undefined,
                        };
                    }
                    const lats = coords.map(c => c[0]);
                    // eslint-disable-next-line spellcheck/spell-checker -- Longitude collection identifier
                    const lngs = coords.map(c => c[1]);
                    return makeBounds(
                        // eslint-disable-next-line spellcheck/spell-checker -- Longitude collection identifier
                        { lat: Math.min(...lats), lng: Math.min(...lngs) },
                        // eslint-disable-next-line spellcheck/spell-checker -- Longitude collection identifier
                        { lat: Math.max(...lats), lng: Math.max(...lngs) }
                    );
                },
            };
            return polyline;
        },

        // --- Control ---
        control: {
            zoom: function() {
                const ctrl = {
                    addTo(map) { L.zoomControlAdded = true; return ctrl; },
                    remove() { L.zoomControlAdded = false; return ctrl; },
                };
                return ctrl;
            },
        },

        // --- Icon.Default ---
        Icon: {
            Default: {
                imagePath: null,
            }
        },
    };
})();
