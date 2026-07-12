/* global L */

import $ from 'jquery';
import { MARKERS, ROUTES } from './utils.js';
// eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap provider identifier
import OsmProvider from '__internal/ui/map/provider.dynamic.osm';
import errors from 'ui/widget/ui.errors';

import 'ui/map';

let leafletMock;

const prepareTestingOsmProvider = () => {
    L.mapCreated = false;
    L.mapDisposed = false;
    L.mapResized = false;
    L.mapOptions = null;
    L.setViewArgs = null;
    L.setZoomArg = null;
    L.fitBoundsArg = null;
    L.fitBoundsOptions = null;
    L.fitBoundsCallback = null;
    L.addedMarkers = [];
    L.removedMarkers = [];
    // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
    L.addedPolylines = [];
    // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
    L.removedPolylines = [];
    L.addedTileLayers = [];
    L.removedLayers = [];
    L.addedEvents = [];
    L.removedEvents = [];
    L.tileLayerUrl = null;
    L.tileLayerOptions = null;
    L.zoomControlAdded = false;
    L.popupOpened = false;
    L.markerClickCallback = null;
    L.mapClickCallback = null;
    L.mapMoveEndCallback = null;
    L.mapZoomEndCallback = null;
    L.mockZoom = null;
    L.mockCenter = null;
    L.mockBounds = null;
    L.mapInstance = null;
    L.markerElement = null;
    L.iconOptions = null;
    L.boundPopup = null;
    L.popupOptions = null;
    L.popupContent = null;
    L.popupUpdateCount = 0;
};

const moduleConfig = {
    beforeEach: function(assert) {
        const setup = () => {
            window.L = leafletMock;
            prepareTestingOsmProvider();

            this.geocodedLatLng = { lat: 10, lng: 20 };
            this.routePolylineCoords = [[20, 10], [30, 20], [40, 30]];

            // User-supplied callbacks (replicate what end users must provide)
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            this.osmGeocodeLocation = () => Promise.resolve(this.geocodedLatLng);
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            this.osmGetRoute = () => Promise.resolve(this.routePolylineCoords);
        };

        if(leafletMock) {
            setup();
            return;
        }

        const done = assert.async();
        $.getScript({
            url: '../../packages/devextreme/testing/helpers/forMap/leafletMock.js',
            scriptAttrs: { nonce: 'qunit-test' },
        }).done(() => {
            leafletMock = window.L;
            setup();
            done();
        }).fail((_request, _status, error) => {
            assert.ok(false, `failed to load Leaflet mock: ${error}`);
            done();
        });
    },
    afterEach: function() {
        window.L = leafletMock;
    }
};


QUnit.module('OSM: real Leaflet integration', () => {
    // TODO: Enable after agreeing on real-Leaflet smoke coverage, or remove before merge.
    QUnit.skip('initializes with real Leaflet and local service substitutes', function(assert) {
        const done = assert.async();
        const $map = $('<div>').css({ width: 400, height: 300 }).appendTo('#qunit-fixture');
        const realLeaflet = window.realLeaflet;

        const map = $map.dxMap({
            provider: 'osm',
            providerConfig: {
                mapEngine: realLeaflet,
                tileServer: {
                    url: '/packages/devextreme/testing/content/LightBlueSky.jpg',
                    attribution: 'Local test tiles',
                },
                geocodeLocation: () => Promise.resolve({ lat: 40.74, lng: -73.98 }),
                getRoute: ({ locations }) => Promise.resolve(locations.map(({ lat, lng }) => [lat, lng])),
            },
            center: 'New York',
            zoom: 10,
            markers: [{ location: { lat: 40.74, lng: -73.98 }, tooltip: 'Marker' }],
            routes: [{ locations: [[40.74, -73.98], [40.75, -73.97]] }],
            onReady: ({ originalMap }) => {
                assert.ok(realLeaflet && realLeaflet.map, 'real Leaflet is provided by the test host');
                assert.ok(originalMap instanceof realLeaflet.Map, 'originalMap is a real Leaflet map');
                assert.strictEqual($map.find('.leaflet-container').length, 1, 'Leaflet initializes the map container');
                assert.deepEqual(
                    { lat: originalMap.getCenter().lat, lng: originalMap.getCenter().lng },
                    { lat: 40.745, lng: -73.975 },
                    'local route participates in auto-adjusting the viewport'
                );

                map.dispose();
                done();
            },
        }).dxMap('instance');
    });
});


QUnit.module('OSM: map loading', moduleConfig, () => {
    QUnit.test('map initializes with Leaflet from window.L', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            onReady: ({ originalMap }) => {
                assert.ok(L.mapCreated, 'global Leaflet created the map');
                assert.strictEqual(originalMap, L.mapInstance, 'originalMap comes from window.L');
                done();
            }
        });
    });

    QUnit.test('providerConfig.mapEngine takes priority over window.L', function(assert) {
        const done = assert.async();
        const injectedEngine = Object.create(leafletMock);
        injectedEngine.map = sinon.spy((...args) => leafletMock.map(...args));
        window.L = { map: () => { assert.ok(false, 'window.L should not create the map'); } };

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { mapEngine: injectedEngine },
            onReady: ({ originalMap }) => {
                assert.ok(injectedEngine.map.calledOnce, 'configured map engine created the map');
                assert.strictEqual(
                    originalMap,
                    injectedEngine.map.returnValues[0],
                    'configured engine map is returned'
                );
                done();
            }
        });
    });

    QUnit.test('changing providerConfig.mapEngine recreates the map with the new engine', function(assert) {
        const done = assert.async();
        const firstEngine = Object.create(leafletMock);
        const secondEngine = Object.create(leafletMock);
        let firstMap;
        let firstMapRemoveSpy;
        let readyCount = 0;

        firstEngine.map = sinon.spy((...args) => leafletMock.map(...args));
        secondEngine.map = sinon.spy((...args) => leafletMock.map(...args));

        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: { mapEngine: firstEngine },
            onReady: ({ originalMap }) => {
                readyCount++;

                if(readyCount === 1) {
                    firstMap = originalMap;
                    firstMapRemoveSpy = sinon.spy(firstMap, 'remove');

                    map.option('providerConfig.mapEngine', secondEngine);
                    return;
                }

                assert.strictEqual(readyCount, 2, 'map becomes ready after one reinitialization');
                assert.ok(firstEngine.map.calledOnce, 'first engine created the initial map');
                assert.ok(secondEngine.map.calledOnce, 'second engine created the reinitialized map');
                assert.ok(firstMapRemoveSpy.calledOnce, 'initial map is disposed');
                assert.notStrictEqual(originalMap, firstMap, 'a new map instance is returned');
                assert.strictEqual(map._provider._mapEngine, secondEngine, 'new provider uses the second engine');

                firstMapRemoveSpy.restore();
                done();
            }
        }).dxMap('instance');
    });

    QUnit.test('load rejects with E1069 when no map engine is configured or global', function(assert) {
        const done = assert.async();
        const mapWidget = { option: () => ({ providerConfig: {} }) };
        // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap provider identifier
        const provider = new OsmProvider(mapWidget, null);

        delete window.L;

        provider._loadImpl().then(
            () => {
                assert.ok(false, 'load should reject');
                done();
            },
            (error) => {
                assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');
                done();
            }
        );
    });

    QUnit.test('invalid providerConfig.mapEngine rejects instead of falling back to window.L', function(assert) {
        const done = assert.async();
        const mapWidget = { option: () => ({ providerConfig: { mapEngine: {} } }) };
        // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap provider identifier
        const provider = new OsmProvider(mapWidget, null);

        provider._loadImpl().then(
            () => {
                assert.ok(false, 'load should reject');
                done();
            },
            (error) => {
                assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');
                assert.notStrictEqual(provider._mapEngine, leafletMock, 'global engine was not used');
                done();
            }
        );
    });
});


QUnit.module('OSM: basic options', moduleConfig, () => {
    QUnit.test('zoom option is passed on init', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            zoom: 10,
            onReady: () => {
                assert.strictEqual(L.mapOptions.zoom, 10, 'zoom passed to L.map');
                done();
            }
        });
    });

    QUnit.test('zoom option is updated at runtime', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            zoom: 5,
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(L.setZoomArg, 8, 'setZoom called with new zoom');
                done();
            });
            map.option('zoom', 8);
        });
    });

    QUnit.test('center option is passed as lat/lng on init', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            center: { lat: 10, lng: 20 },
            onReady: () => {
                assert.deepEqual(L.mapOptions.center, { lat: 10, lng: 20 }, 'center passed to L.map');
                done();
            }
        });
    });

    QUnit.test('center option accepts an array on init', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            center: [10, 20],
            onReady: () => {
                assert.deepEqual(L.mapOptions.center, { lat: 10, lng: 20 }, 'array center is passed to L.map');
                done();
            }
        });
    });

    QUnit.test('center option accepts a numeric string without geocoding', function(assert) {
        const done = assert.async();
        const geocodeLocation = sinon.spy(() => Promise.resolve({ lat: 0, lng: 0 }));

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { geocodeLocation },
            center: '10, 20',
            onReady: () => {
                assert.deepEqual(L.mapOptions.center, { lat: 10, lng: 20 }, 'numeric string center is passed to L.map');
                assert.notOk(geocodeLocation.called, 'numeric string center is not geocoded');
                done();
            }
        });
    });

    QUnit.test('center option is updated at runtime', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            center: { lat: 0, lng: 0 },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.deepEqual(L.setViewArgs.center, { lat: 5, lng: 5 }, 'setView called with new center');
                done();
            });
            map.option('center', { lat: 5, lng: 5 });
        });
    });

    QUnit.test('string center is geocoded via osmGeocodeLocation callback', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { geocodeLocation: this.osmGeocodeLocation },
            center: 'Austin, TX',
            onReady: () => {
                assert.deepEqual(
                    L.mapOptions.center,
                    this.geocodedLatLng,
                    'center is geocoded via user-supplied callback'
                );
                done();
            }
        });
    });

    QUnit.test('osmGeocodeLocation callback receives the raw query string', function(assert) {
        const done = assert.async();
        let capturedQuery;

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { geocodeLocation: (query) => {
                capturedQuery = query;
                return Promise.resolve({ lat: 10, lng: 20 });
            } },
            center: 'Austin, TX',
            onReady: () => {
                assert.strictEqual(capturedQuery, 'Austin, TX', 'raw query string passed to callback');
                done();
            }
        });
    });

    QUnit.test('geocoded locations are cached', function(assert) {
        const done = assert.async();
        const d1 = $.Deferred();
        const d2 = $.Deferred();
        const center = 'Austin, TX';

        const map = $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { geocodeLocation: this.osmGeocodeLocation },
            onReady: () => { d1.resolve(); }
        }).dxMap('instance');

        const spy = sinon.spy(map._provider, '_geocodeLocationImpl');

        d1.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(spy.callCount, 1, 'geocoded once');
                d2.resolve();
            });
            map.option('center', center);
        });

        d2.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(spy.callCount, 1, 'not geocoded again for same string');
                spy.restore();
                done();
            });
            map.option('center', center);
        });
    });

    QUnit.test('string center resolves to (0,0) and logs W1031 when osmGeocodeLocation is not provided', function(assert) {
        const done = assert.async();
        const errorStub = sinon.stub(errors, 'log');

        $('#map').dxMap({
            provider: 'osm',
            center: 'Austin, TX',
            onReady: () => {
                assert.deepEqual(
                    L.mapOptions.center,
                    { lat: 0, lng: 0 },
                    'falls back to (0,0) with no geocoding callback'
                );
                assert.ok(errorStub.withArgs('W1031').called, 'W1031 warning logged');
                assert.strictEqual(errorStub.withArgs('W1031').firstCall.args[1], 'Austin, TX', 'the unresolved string is passed to the warning');
                errorStub.restore();
                done();
            }
        });
    });

    QUnit.test('string center resolves to (0,0) when osmGeocodeLocation rejects', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { geocodeLocation: () => Promise.reject(new Error('geocoding unavailable')) },
            center: 'Austin, TX',
            onReady: () => {
                assert.deepEqual(L.mapOptions.center, { lat: 0, lng: 0 }, 'rejected geocoding falls back to (0,0)');
                done();
            }
        });
    });

    QUnit.test('string center resolves to (0,0) when osmGeocodeLocation throws', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { geocodeLocation: () => { throw new Error('geocoding unavailable'); } },
            center: 'Austin, TX',
            onReady: () => {
                assert.deepEqual(L.mapOptions.center, { lat: 0, lng: 0 }, 'thrown geocoding error falls back to (0,0)');
                done();
            }
        });
    });

    QUnit.test('string center resolves to (0,0) for an incomplete osmGeocodeLocation result', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { geocodeLocation: () => Promise.resolve({ lat: 10 }) },
            center: 'Austin, TX',
            onReady: () => {
                assert.deepEqual(L.mapOptions.center, { lat: 0, lng: 0 }, 'incomplete geocoding falls back to (0,0)');
                done();
            }
        });
    });

    QUnit.test('bounds option takes priority over center', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            bounds: {
                northEast: { lat: 10, lng: 10 },
                southWest: { lat: -10, lng: -10 },
            },
            center: { lat: 50, lng: 50 },
            onReady: () => {
                assert.ok(L.fitBoundsArg, 'fitBounds was called instead of setView');
                assert.notOk(L.setViewArgs, 'setView was not called');
                done();
            }
        });
    });

    QUnit.test('width/height change triggers invalidateSize', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(L.mapResized, true, 'invalidateSize was called');
                done();
            });
            map.option('width', 400);
        });
    });

    QUnit.test('controls: true adds zoom control', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            controls: true,
            onReady: () => {
                assert.strictEqual(L.zoomControlAdded, true, 'zoom control added');
                done();
            }
        });
    });

    QUnit.test('controls can be toggled at runtime', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            controls: true,
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(L.zoomControlAdded, false, 'zoom control removed');
                done();
            });
            map.option('controls', false);
        });
    });

    QUnit.test('onClick fires with location and event', function(assert) {
        const done = assert.async();
        let clickFired = 0;
        const fakeEvent = new PointerEvent('click');

        $('#map').dxMap({
            provider: 'osm',
            onClick: (e) => {
                assert.deepEqual(e.location, { lat: 5, lng: 10 }, 'click location is correct');
                assert.strictEqual(e.event, fakeEvent, 'original event is passed');
                clickFired++;
            },
            onReady: () => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet event field name
                L.mapClickCallback({ latlng: { lat: 5, lng: 10 }, originalEvent: fakeEvent });
                assert.strictEqual(clickFired, 1, 'onClick fired once');
                done();
            }
        });
    });

    QUnit.test('moveend event updates center, bounds and zoom options', function(assert) {
        const done = assert.async();

        L.mockCenter = { lat: 3, lng: 7 };
        L.mockZoom = 9;
        L.mockBounds = {
            getNorthEast: () => ({ lat: 4, lng: 8 }),
            getSouthWest: () => ({ lat: 2, lng: 6 }),
        };

        const map = $('#map').dxMap({
            provider: 'osm',
            onReady: () => {
                L.mapMoveEndCallback();

                assert.deepEqual(map.option('center'), { lat: 3, lng: 7 }, 'center updated');
                assert.deepEqual(map.option('zoom'), 9, 'zoom updated');
                assert.deepEqual(map.option('bounds'), {
                    northEast: { lat: 4, lng: 8 },
                    southWest: { lat: 2, lng: 6 },
                }, 'bounds updated');

                done();
            }
        }).dxMap('instance');
    });

    QUnit.test('moveend does not write center when it has not changed', function(assert) {
        const done = assert.async();
        const center = { lat: 3, lng: 7 };

        const map = $('#map').dxMap({
            provider: 'osm',
            center,
            onReady: () => {
                const setOptionSilentSpy = sinon.spy(map, 'setOptionSilent');
                L.mockCenter = center;

                L.mapMoveEndCallback();

                assert.notOk(setOptionSilentSpy.withArgs('center').called, 'center is not written back');
                setOptionSilentSpy.restore();
                done();
            }
        }).dxMap('instance');
    });

    QUnit.test('disabled option toggles all Leaflet interaction handlers at runtime', function(assert) {
        const done = assert.async();
        const ready = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            onReady: () => { ready.resolve(); }
        }).dxMap('instance');

        ready.done(() => {
            const handlers = [
                L.mapInstance.dragging,
                L.mapInstance.touchZoom,
                L.mapInstance.doubleClickZoom,
                L.mapInstance.scrollWheelZoom,
                L.mapInstance.boxZoom,
                L.mapInstance.keyboard,
            ];
            const disableSpies = handlers.map((handler) => sinon.spy(handler, 'disable'));
            const enableSpies = handlers.map((handler) => sinon.spy(handler, 'enable'));
            const restoreSpies = () => {
                disableSpies.concat(enableSpies).forEach((spy) => { spy.restore(); });
            };

            map.option('disabled', true);

            map._lastAsyncAction.then(() => {
                assert.ok(disableSpies.every((spy) => spy.calledOnce), 'all interaction handlers are disabled');
                map.option('disabled', false);

                return map._lastAsyncAction;
            }).then(() => {
                assert.ok(enableSpies.every((spy) => spy.calledOnce), 'all interaction handlers are enabled');
                restoreSpies();
                done();
            }, (error) => {
                assert.ok(false, `updating disabled failed: ${error.message}`);
                restoreSpies();
                done();
            });
        });
    });

    QUnit.test('disabled option disables Leaflet interaction handlers on init', function(assert) {
        const done = assert.async();

        const map = $('#map').dxMap({
            provider: 'osm',
            disabled: true,
        }).dxMap('instance');

        map._lastAsyncAction.then(() => {
            [
                'dragging',
                'touchZoom',
                'doubleClickZoom',
                'scrollWheelZoom',
                'boxZoom',
                'keyboard',
            ].forEach((option) => {
                assert.strictEqual(L.mapOptions[option], false, `${option} is disabled on init`);
            });
            done();
        }, (error) => {
            assert.ok(false, `map initialization failed: ${error.message}`);
            done();
        });
    });

    QUnit.test('click and moveend/zoomend handlers are attached', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            onReady: () => {
                assert.ok(L.addedEvents.includes('click'), 'click event added');
                assert.ok(L.addedEvents.includes('moveend'), 'moveend event added');
                assert.ok(L.addedEvents.includes('zoomend'), 'zoomend event added');
                done();
            }
        });
    });
});


QUnit.module('OSM: tile server', moduleConfig, () => {
    QUnit.test('osmTileServer as a string is used as the tile URL', function(assert) {
        const done = assert.async();
        const url = 'https://tiles.example.com/{z}/{x}/{y}.png';

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { tileServer: url },
            onReady: () => {
                assert.strictEqual(L.tileLayerUrl, url, 'string tile URL is used');
                done();
            }
        });
    });

    QUnit.test('osmTileServer as an object passes url, attribution and maxZoom', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { tileServer: {
                url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                attribution: 'My attribution',
                maxZoom: 17,
            } },
            onReady: () => {
                assert.strictEqual(L.tileLayerUrl, 'https://tiles.example.com/{z}/{x}/{y}.png', 'url used');
                assert.strictEqual(L.tileLayerOptions.attribution, 'My attribution', 'attribution passed');
                assert.strictEqual(L.tileLayerOptions.maxZoom, 17, 'maxZoom passed');
                done();
            }
        });
    });

    QUnit.test('W1032 is logged when the tile server has no attribution, and not when it does', function(assert) {
        const done = assert.async();
        const errorStub = sinon.stub(errors, 'log');

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { tileServer: 'https://tiles.example.com/{z}/{x}/{y}.png' },
            onReady: () => {
                assert.ok(errorStub.withArgs('W1032').called, 'W1032 logged when attribution is missing');
                errorStub.restore();
                done();
            }
        });
    });

    QUnit.test('W1032 is not logged when the tile server provides attribution', function(assert) {
        const done = assert.async();
        const errorStub = sinon.stub(errors, 'log');

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { tileServer: {
                url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                attribution: '© OpenStreetMap contributors',
            } },
            onReady: () => {
                assert.notOk(errorStub.withArgs('W1032').called, 'W1032 not logged when attribution is present');
                errorStub.restore();
                done();
            }
        });
    });

    QUnit.test('subdomains are passed only when the URL contains the {s} placeholder', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- Leaflet tile server option name
            providerConfig: { tileServer: { url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png', subdomains: '1234' } },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            // eslint-disable-next-line spellcheck/spell-checker -- Leaflet tile server option name
            assert.strictEqual(L.tileLayerOptions.subdomains, '1234', 'subdomains passed when {s} present');

            map.option('onUpdated', () => {
                assert.notOk('subdomains' in L.tileLayerOptions, 'subdomains omitted when {s} absent');
                done();
            });
            map.option('providerConfig.tileServer', { url: 'https://tiles.example.com/{z}/{x}/{y}.png' });
        });
    });

    QUnit.test('osmTileServer as a function resolves per map type', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            type: 'roadmap',
            providerConfig: { tileServer: (type) => `https://tiles.example.com/${type}/{z}/{x}/{y}.png` },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            assert.strictEqual(L.tileLayerUrl, 'https://tiles.example.com/roadmap/{z}/{x}/{y}.png', 'roadmap url resolved');

            map.option('onUpdated', () => {
                assert.ok(L.removedLayers.length > 0, 'old tile layer removed');
                assert.strictEqual(L.tileLayerUrl, 'https://tiles.example.com/satellite/{z}/{x}/{y}.png', 'satellite url resolved on type change');
                done();
            });
            map.option('type', 'satellite');
        });
    });

    QUnit.test('no tile layer is created and W1030 is logged when osmTileServer is not provided', function(assert) {
        const done = assert.async();
        const errorStub = sinon.stub(errors, 'log');

        $('#map').dxMap({
            provider: 'osm',
            onReady: () => {
                assert.strictEqual(L.addedTileLayers.length, 0, 'no tile layer added without a tile server');
                assert.ok(errorStub.withArgs('W1030').calledOnce, 'W1030 warning logged');
                errorStub.restore();
                done();
            }
        });
    });

    QUnit.test('tile layer is rebuilt when osmTileServer changes at runtime', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: { tileServer: 'https://a.example.com/{z}/{x}/{y}.png' },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.ok(L.removedLayers.length > 0, 'old tile layer removed');
                assert.strictEqual(L.tileLayerUrl, 'https://b.example.com/{z}/{x}/{y}.png', 'new tile URL used');
                done();
            });
            map.option('providerConfig.tileServer', 'https://b.example.com/{z}/{x}/{y}.png');
        });
    });
});


QUnit.module('OSM: markers', moduleConfig, () => {
    QUnit.test('marker is added on init', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [33, 33] }],
            onReady: () => {
                assert.strictEqual(L.addedMarkers.length, 1, 'one marker added');
                assert.deepEqual(L.lastMarkerLatLng, { lat: 33, lng: 33 }, 'marker at correct position');
                done();
            }
        });
    });

    QUnit.test('marker is added at runtime', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(L.addedMarkers.length, 1, 'marker added');
                assert.deepEqual(L.lastMarkerLatLng, { lat: 10, lng: 20 }, 'marker position correct');
                done();
            });
            map.option('markers', [{ location: { lat: 10, lng: 20 } }]);
        });
    });

    QUnit.test('marker uses custom icon from markerIconSrc', function(assert) {
        const done = assert.async();
        const markerIconSrc = 'customMarker.png';

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20] }],
            markerIconSrc,
            onReady: () => {
                assert.ok(L.iconOptions, 'L.icon was called');
                assert.strictEqual(L.iconOptions.iconUrl, markerIconSrc, 'custom icon URL is passed');
                done();
            }
        });
    });

    QUnit.test('marker uses custom icon from marker.iconSrc', function(assert) {
        const done = assert.async();
        const iconSrc = 'markerPin.png';

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20], iconSrc }],
            onReady: () => {
                assert.ok(L.iconOptions, 'L.icon was called');
                assert.strictEqual(L.iconOptions.iconUrl, iconSrc, 'marker iconSrc is passed');
                done();
            }
        });
    });

    QUnit.test('default marker keeps Leaflet icon anchors', function(assert) {
        const done = assert.async();
        const iconElement = document.createElement('img');
        const getBoundingClientRectSpy = sinon.spy(iconElement, 'getBoundingClientRect');

        L.markerElement = iconElement;

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20], tooltip: 'Default marker' }],
            onReady: () => {
                assert.notOk(getBoundingClientRectSpy.called, 'default icon size is not measured');
                assert.strictEqual(iconElement.style.marginLeft, '', 'default horizontal anchor is preserved');
                assert.strictEqual(iconElement.style.marginTop, '', 'default vertical anchor is preserved');
                getBoundingClientRectSpy.restore();
                done();
            }
        });
    });

    QUnit.test('custom marker uses rendered size for Leaflet icon and popup anchors', function(assert) {
        const done = assert.async();
        const iconElement = document.createElement('img');

        Object.defineProperties(iconElement, {
            complete: { configurable: true, value: true },
            naturalWidth: { configurable: true, value: 40 },
            naturalHeight: { configurable: true, value: 60 },
        });
        sinon.stub(iconElement, 'getBoundingClientRect').returns({ width: 20, height: 30 });
        L.markerElement = iconElement;

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20], iconSrc: 'customMarker.png', tooltip: 'Custom marker' }],
            onReady: () => {
                assert.strictEqual(iconElement.style.marginLeft, '-10px', 'horizontal anchor uses rendered width');
                assert.strictEqual(iconElement.style.marginTop, '-30px', 'vertical anchor uses rendered height');
                assert.deepEqual(L.iconOptions.iconSize, { x: 20, y: 30 }, 'Leaflet receives rendered icon size');
                assert.deepEqual(L.iconOptions.iconAnchor, { x: 10, y: 30 }, 'Leaflet receives bottom-center icon anchor');
                assert.deepEqual(L.iconOptions.popupAnchor, { x: 0, y: -30 }, 'popup anchor points to the icon top');
                assert.deepEqual(L.boundPopup.options.offset, { x: 0, y: 7 }, 'Leaflet default popup offset is preserved');
                done();
            }
        });
    });

    QUnit.test('custom marker updates an open popup after the icon loads', function(assert) {
        const done = assert.async();
        const iconElement = document.createElement('img');

        Object.defineProperties(iconElement, {
            complete: { configurable: true, value: false },
            naturalWidth: { configurable: true, value: 40 },
            naturalHeight: { configurable: true, value: 60 },
        });
        sinon.stub(iconElement, 'getBoundingClientRect').returns({ width: 20, height: 30 });
        L.markerElement = iconElement;

        $('#map').dxMap({
            provider: 'osm',
            markers: [{
                location: [10, 20],
                iconSrc: 'customMarker.png',
                tooltip: 'Custom marker',
            }],
            onReady: () => {
                L.addedMarkers[0].openPopup();
                iconElement.dispatchEvent(new Event('load'));

                assert.strictEqual(L.popupUpdateCount, 1, 'open popup position is updated once');
                assert.deepEqual(L.iconOptions.popupAnchor, { x: 0, y: -30 }, 'loaded icon updates popup anchor');
                done();
            }
        });
    });

    QUnit.test('custom marker removes pending image listeners on removal', function(assert) {
        const done = assert.async();
        const iconElement = document.createElement('img');
        const removeEventListenerSpy = sinon.spy(iconElement, 'removeEventListener');

        Object.defineProperty(iconElement, 'complete', { configurable: true, value: false });
        L.markerElement = iconElement;

        const map = $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20], iconSrc: 'customMarker.png' }],
            onReady: () => {
                map.removeMarker(0).done(() => {
                    assert.ok(removeEventListenerSpy.calledWith('load'), 'load listener is removed');
                    assert.ok(removeEventListenerSpy.calledWith('error'), 'error listener is removed');
                    done();
                });
            }
        }).dxMap('instance');
    });

    QUnit.test('marker uses divIcon when html option is set', function(assert) {
        const done = assert.async();
        const html = '<b>Custom</b>';

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20], html }],
            onReady: () => {
                assert.ok(L.divIconOptions, 'L.divIcon was called');
                assert.strictEqual(L.divIconOptions.html, html, 'html content is passed');
                done();
            }
        });
    });

    QUnit.test('tooltip creates a popup bound to the marker', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20], tooltip: 'Austin, TX' }],
            onReady: () => {
                assert.ok(L.boundPopup, 'popup was bound to marker');
                assert.strictEqual(L.popupContent, 'Austin, TX', 'popup has correct text');
                done();
            }
        });
    });

    QUnit.test('click on marker toggles popup and fires onClick', function(assert) {
        const done = assert.async();
        let clickFired = 0;

        $('#map').dxMap({
            provider: 'osm',
            markers: [{
                location: [10, 20],
                tooltip: 'Test',
                onClick: (e) => {
                    assert.deepEqual(e.location, { lat: 10, lng: 20 }, 'click location correct');
                    clickFired++;
                }
            }],
            onReady: () => {
                L.markerClickCallback();
                assert.strictEqual(clickFired, 1, 'onClick fired once after the first click');
                assert.strictEqual(L.popupOpened, true, 'popup opened on first click');

                L.markerClickCallback();
                assert.strictEqual(clickFired, 2, 'onClick fired once after the second click');
                assert.strictEqual(L.popupOpened, false, 'popup closed on second click');
                done();
            }
        });
    });

    QUnit.test('click on marker toggles popup without an onClick handler', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            markers: [{ location: [10, 20], tooltip: 'Test' }],
            onReady: () => {
                L.markerClickCallback();
                assert.strictEqual(L.popupOpened, true, 'popup opened on first click');

                L.markerClickCallback();
                assert.strictEqual(L.popupOpened, false, 'popup closed on second click');
                done();
            }
        });
    });

    QUnit.test('addMarker method works', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            markers: [MARKERS[0]],
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.addMarker({ location: [7, 7] }).done((instance) => {
                assert.strictEqual(L.addedMarkers.length, 2, 'second marker added');
                assert.ok(instance, 'marker instance returned');
                done();
            });
        });
    });

    QUnit.test('removeMarker method works', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            markers: [MARKERS[0]],
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.removeMarker(0).done(() => {
                assert.strictEqual(L.removedMarkers.length, 1, 'marker removed');
                done();
            });
        });
    });

    QUnit.test('onMarkerAdded fires with options and originalMarker', function(assert) {
        const done = assert.async();
        let markerAddedFired = false;

        $('#map').dxMap({
            provider: 'osm',
            markers: [MARKERS[0]],
            onReady: () => {
                assert.strictEqual(markerAddedFired, true, 'onMarkerAdded fired');
                done();
            },
            onMarkerAdded: ({ options, originalMarker }) => {
                markerAddedFired = true;
                assert.deepEqual(options, MARKERS[0], 'options are correct');
                assert.ok(originalMarker, 'originalMarker provided');
            },
        });
    });

    QUnit.test('onMarkerRemoved fires', function(assert) {
        const done = assert.async();
        const d = $.Deferred();
        let markerRemovedFired = false;

        const map = $('#map').dxMap({
            provider: 'osm',
            markers: [MARKERS[0]],
            onReady: () => { d.resolve(); },
            onMarkerRemoved: ({ options }) => {
                markerRemovedFired = true;
                assert.deepEqual(options, MARKERS[0], 'options passed on remove');
            },
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(markerRemovedFired, true, 'onMarkerRemoved fired');
                done();
            });
            map.option('markers', []);
        });
    });

    QUnit.test('autoAdjust fits bounds to markers', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: true,
            center: [30, 30],
            markers: [{ location: [20, 20] }],
            onReady: () => {
                assert.ok(L.fitBoundsArg, 'fitBounds was called');
                done();
            }
        });
    });

    QUnit.test('autoAdjust: false does not call fitBounds for markers', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            center: [30, 30],
            markers: [MARKERS[0], MARKERS[1]],
            onReady: () => {
                assert.notOk(L.fitBoundsArg, 'fitBounds not called');
                done();
            }
        });
    });

    [
        { initialZoom: 5, fittedZoom: 10, expectedZoom: 5, expectedSetZoom: 5 },
        { initialZoom: 10, fittedZoom: 5, expectedZoom: 5, expectedSetZoom: null },
    ].forEach(({ initialZoom, fittedZoom, expectedZoom, expectedSetZoom }) => {
        QUnit.test(`autoAdjust keeps zoom at ${expectedZoom} when fitBounds changes it from ${initialZoom} to ${fittedZoom}`, function(assert) {
            const done = assert.async();
            const ready = $.Deferred();

            const map = $('#map').dxMap({
                provider: 'osm',
                autoAdjust: false,
                zoom: initialZoom,
                markers: [MARKERS[0]],
                onReady: () => { ready.resolve(); }
            }).dxMap('instance');

            ready.done(() => {
                L.mockZoom = initialZoom;
                L.fitBoundsCallback = () => {
                    L.mockZoom = fittedZoom;
                    L.mapZoomEndCallback();
                };

                map.option('onUpdated', () => {
                    assert.deepEqual(L.fitBoundsOptions, { animate: false }, 'fitBounds animation is disabled');
                    assert.strictEqual(map.option('zoom'), expectedZoom, 'zoom option has the expected value');
                    assert.strictEqual(L.setZoomArg, expectedSetZoom, 'Leaflet zoom is restored only when fitBounds increases it');

                    L.mockZoom = 7;
                    L.mapZoomEndCallback();
                    assert.strictEqual(map.option('zoom'), 7, 'zoom events are processed after autoAdjust completes');

                    L.fitBoundsCallback = null;
                    done();
                });

                map.option('autoAdjust', true);
            });
        });
    });
});


QUnit.module('OSM: routes', moduleConfig, () => {
    QUnit.test('route is added on init via osmGetRoute callback', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { getRoute: this.osmGetRoute },
            routes: [ROUTES[0]],
            onReady: () => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'polyline added');
                assert.deepEqual(L.polylineCoords, this.routePolylineCoords, 'route coordinates correct');
                done();
            }
        });
    });

    QUnit.test('route is added at runtime', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { getRoute: this.osmGetRoute },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'polyline added at runtime');
                done();
            });
            map.option('routes', [ROUTES[0]]);
        });
    });

    QUnit.test('addRoute method works', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { getRoute: this.osmGetRoute },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.addRoute(ROUTES[0]).done((instance) => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'polyline added');
                assert.ok(instance, 'route instance returned');
                done();
            });
        });
    });

    QUnit.test('removeRoute method works', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { getRoute: this.osmGetRoute },
            routes: [ROUTES[0]],
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.removeRoute(0).done(() => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.removedPolylines.length, 1, 'polyline removed');
                done();
            });
        });
    });

    QUnit.test('route color, weight, opacity are applied', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { getRoute: this.osmGetRoute },
            routes: [{
                color: 'red',
                weight: 4,
                opacity: 0.3,
                locations: [[10, 10], [20, 20]],
            }],
            onReady: () => {
                assert.strictEqual(L.polylineOptions.color, '#ff0000', 'color applied');
                assert.strictEqual(L.polylineOptions.weight, 4, 'weight applied');
                assert.strictEqual(L.polylineOptions.opacity, 0.3, 'opacity applied');
                done();
            }
        });
    });

    QUnit.test('osmGetRoute callback receives locations and mode', function(assert) {
        const done = assert.async();
        let capturedParams;

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { getRoute: (params) => {
                capturedParams = params;
                return Promise.resolve([[10, 20], [30, 40]]);
            } },
            routes: [{
                locations: [{ lat: 10, lng: 20 }, { lat: 30, lng: 40 }],
                mode: 'cycling',
            }],
            onReady: () => {
                assert.ok(capturedParams, 'callback was called');
                assert.strictEqual(capturedParams.mode, 'cycling', 'custom mode passed to callback without changes');
                assert.deepEqual(capturedParams.locations, [{ lat: 10, lng: 20 }, { lat: 30, lng: 40 }], 'locations passed to callback');
                done();
            }
        });
    });

    QUnit.test('GeoJSON LineString result is converted from longitude-latitude order', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                getRoute: () => Promise.resolve({
                    type: 'LineString',
                    coordinates: [[-73.99, 40.74], [-73.98, 40.75]],
                }),
            },
            routes: [ROUTES[0]],
            onReady: () => {
                assert.deepEqual(L.polylineCoords, [[40.74, -73.99], [40.75, -73.98]], 'coordinates converted to latitude-longitude order');
                done();
            },
        });
    });

    QUnit.test('unsupported GeoJSON result falls back to a straight polyline', function(assert) {
        const done = assert.async();
        const errorStub = sinon.stub(errors, 'log');

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                getRoute: () => Promise.resolve({
                    type: 'MultiLineString',
                    coordinates: [],
                }),
            },
            routes: [{ locations: [[10, 20], [30, 40]] }],
            onReady: () => {
                assert.deepEqual(L.polylineCoords, [[10, 20], [30, 40]], 'unsupported result is not interpreted as a route');
                assert.ok(errorStub.withArgs('W1006').calledOnce, 'W1006 warning logged');

                errorStub.restore();
                done();
            },
        });
    });

    QUnit.test('straight-line polyline is drawn when osmGetRoute is not provided', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            routes: [ROUTES[0]],
            onReady: () => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'straight-line polyline added');
                done();
            }
        });
    });

    QUnit.test('empty route locations create a route without adjusting viewport', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            routes: [{ locations: [] }],
            onReady: () => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'empty polyline added');
                assert.deepEqual(L.polylineCoords, [], 'empty coordinates passed');
                assert.notOk(L.fitBoundsArg, 'empty route does not adjust viewport');
                done();
            },
        });
    });

    QUnit.test('empty osmGetRoute result creates a route without adjusting viewport', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                getRoute: () => Promise.resolve([]),
            },
            routes: [ROUTES[0]],
            onReady: () => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'empty polyline added');
                assert.deepEqual(L.polylineCoords, [], 'empty coordinates passed');
                assert.notOk(L.fitBoundsArg, 'empty route does not adjust viewport');
                done();
            },
        });
    });

    QUnit.test('falls back to straight polyline when osmGetRoute callback rejects', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const errorStub = sinon.stub(errors, 'log');

        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: { getRoute: () => Promise.reject(new Error('routing unavailable')) },
            onReady: () => { d.resolve(); },
        }).dxMap('instance');

        d.done(() => {
            map.addRoute(ROUTES[0]).done(() => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'fallback polyline added');
                assert.ok(errorStub.withArgs('W1006').calledOnce, 'W1006 warning logged');
                assert.deepEqual(L.fitBoundsArg.getNorthEast(), { lat: 40.752946, lng: -73.987384 }, 'fallback route extends north-east autoAdjust bounds');
                assert.deepEqual(L.fitBoundsArg.getSouthWest(), { lat: 40.737102, lng: -73.990318 }, 'fallback route extends south-west autoAdjust bounds');

                errorStub.restore();
                done();
            });
        });
    });

    QUnit.test('falls back to straight polyline when osmGetRoute callback throws', function(assert) {
        const done = assert.async();
        const d = $.Deferred();
        const routingError = new Error('routing unavailable');
        const errorStub = sinon.stub(errors, 'log');

        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: { getRoute: () => { throw routingError; } },
            onReady: () => { d.resolve(); },
        }).dxMap('instance');

        d.done(() => {
            map.addRoute(ROUTES[0]).done(() => {
                // eslint-disable-next-line spellcheck/spell-checker -- Leaflet mock state identifier
                assert.strictEqual(L.addedPolylines.length, 1, 'fallback polyline added');
                assert.ok(errorStub.withArgs('W1006', routingError).calledOnce, 'W1006 warning logged with the thrown error');

                errorStub.restore();
                done();
            });
        });
    });

    QUnit.test('onRouteAdded fires with options and originalRoute', function(assert) {
        const done = assert.async();
        let routeAddedFired = false;

        $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { getRoute: this.osmGetRoute },
            routes: [ROUTES[0]],
            onReady: () => {
                assert.strictEqual(routeAddedFired, true, 'onRouteAdded fired');
                done();
            },
            onRouteAdded: ({ options, originalRoute }) => {
                routeAddedFired = true;
                assert.deepEqual(options, ROUTES[0], 'route options passed');
                assert.ok(originalRoute, 'originalRoute provided');
            },
        });
    });

    QUnit.test('onRouteRemoved fires', function(assert) {
        const done = assert.async();
        const d = $.Deferred();
        let routeRemovedFired = false;

        const map = $('#map').dxMap({
            provider: 'osm',
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap callback identifier
            providerConfig: { getRoute: this.osmGetRoute },
            routes: [ROUTES[0]],
            onReady: () => { d.resolve(); },
            onRouteRemoved: ({ options }) => {
                routeRemovedFired = true;
                assert.deepEqual(options, ROUTES[0], 'route options passed on remove');
            },
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(routeRemovedFired, true, 'onRouteRemoved fired');
                done();
            });
            map.option('routes', []);
        });
    });

    [
        { routeMode: 'driving', expectedMode: 'driving' },
        { routeMode: 'walking', expectedMode: 'walking' },
    ].forEach(({ routeMode, expectedMode }) => {
        QUnit.test(`movement mode "${routeMode}" is passed to osmGetRoute as "${expectedMode}"`, function(assert) {
            const done = assert.async();

            const map = $('#map').dxMap({
                provider: 'osm',
                onReady: () => {
                    assert.strictEqual(map._provider._movementMode(routeMode), expectedMode);
                    done();
                }
            }).dxMap('instance');
        });
    });

    QUnit.test('undefined/empty movement mode defaults to "driving"', function(assert) {
        const done = assert.async();

        const map = $('#map').dxMap({
            provider: 'osm',
            onReady: () => {
                assert.strictEqual(map._provider._movementMode(undefined), 'driving');
                assert.strictEqual(map._provider._movementMode(''), 'driving');
                done();
            }
        }).dxMap('instance');
    });
});


QUnit.module('OSM: cleanup', moduleConfig, () => {
    QUnit.test('clean() disposes map and removes event handlers', function(assert) {
        const done = assert.async();
        const d = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'osm',
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('provider', 'google'); // triggers _clean → provider.clean()
            setTimeout(() => {
                assert.strictEqual(L.mapDisposed, true, 'map.remove() called');
                assert.ok(L.removedEvents.includes('click'), 'click handler removed');
                assert.ok(L.removedEvents.includes('moveend'), 'moveend handler removed');
                assert.ok(L.removedEvents.includes('zoomend'), 'zoomend handler removed');
                done();
            }, 50);
        });
    });
});
