/* global L */
/* eslint-disable spellcheck/spell-checker -- Leaflet/geo domain terms in tests (e.g. Polylines) */

import $ from 'jquery';
import { MARKERS, ROUTES } from './utils.js';
import OSMProvider from '__internal/ui/map/provider.dynamic.osm';
import ajaxMock from '../../../helpers/ajaxMock.js';
import errors from 'ui/widget/ui.errors';

import 'ui/map';

const prepareTestingOSMProvider = () => {
    L.mapCreated = false;
    L.mapDisposed = false;
    L.mapResized = false;
    L.mapOptions = null;
    L.setViewArgs = null;
    L.setZoomArg = null;
    L.fitBoundsArg = null;
    L.addedMarkers = [];
    L.removedMarkers = [];
    L.addedPolylines = [];
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
    L.boundPopup = null;
    L.popupContent = null;
};

const moduleConfig = {
    beforeEach: function() {
        const fakeURL = '/fakeLeafletUrl';
        let leafletMockCreated = false;

        OSMProvider.remapConstant(fakeURL);

        ajaxMock.setup({
            url: fakeURL,
            callback: () => {
                if(!leafletMockCreated) {
                    leafletMockCreated = true;

                    $.getScript({
                        url: '../../packages/devextreme/testing/helpers/forMap/leafletMock.js',
                        scriptAttrs: { nonce: 'qunit-test' },
                    }).done(() => {
                        prepareTestingOSMProvider();
                    });
                }
            },
        });

        if(window.L) {
            prepareTestingOSMProvider();
        }

        this.geocodedLatLng = { lat: 10, lng: 20 };
        this.routePolylineCoords = [[20, 10], [30, 20], [40, 30]];

        // User-supplied callbacks (replicate what end users must provide)
        this.osmGeocodeLocation = () => Promise.resolve(this.geocodedLatLng);
        this.osmGetRoute = () => Promise.resolve(this.routePolylineCoords);
    },
    afterEach: function() {
        ajaxMock.clear();
    }
};


QUnit.module('OSM: map loading', moduleConfig, () => {
    QUnit.test('map initializes with pre-loaded Leaflet', function(assert) {
        const done = assert.async();

        $.getScript({
            url: '../../packages/devextreme/testing/helpers/forMap/leafletMock.js',
            scriptAttrs: { nonce: 'qunit-test' }
        }).done(function() {
            window.L.map.customFlag = true;

            setTimeout(function() {
                $('#map').dxMap({ provider: 'osm' });

                setTimeout(() => {
                    assert.ok(window.L, 'Leaflet was not re-loaded');
                    done();
                }, 50);
            });
        });
    });

    QUnit.test('map initializes when Leaflet is not yet loaded', function(assert) {
        const done = assert.async();

        if(window.L) {
            delete window.L;
        }

        const d1 = $.Deferred();
        const d2 = $.Deferred();

        $('<div>').appendTo($('#map')).dxMap({
            provider: 'osm',
            onReady: () => { d1.resolve(); }
        });

        $('<div>').appendTo($('#map')).dxMap({
            provider: 'osm',
            onReady: () => { d2.resolve(); }
        });

        $.when(d1, d2).done(() => {
            assert.ok(window.L, 'Leaflet loaded for both maps');
            done();
        });
    });

    QUnit.test('onReady fires with originalMap being L.map instance', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            onReady: (e) => {
                assert.ok(L.mapCreated, 'L.map was called');
                assert.ok(e.originalMap, 'originalMap is provided');
                done();
            }
        });
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
            providerConfig: { tileServer: { url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png', subdomains: '1234' } },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
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
                assert.strictEqual(clickFired, 1, 'onClick fired');
                assert.strictEqual(L.popupOpened, true, 'popup opened on first click');
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
});


QUnit.module('OSM: routes', moduleConfig, () => {
    QUnit.test('route is added on init via osmGetRoute callback', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            providerConfig: { getRoute: this.osmGetRoute },
            routes: [ROUTES[0]],
            onReady: () => {
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
            providerConfig: { getRoute: this.osmGetRoute },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.option('onUpdated', () => {
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
            providerConfig: { getRoute: this.osmGetRoute },
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.addRoute(ROUTES[0]).done((instance) => {
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
            providerConfig: { getRoute: this.osmGetRoute },
            routes: [ROUTES[0]],
            onReady: () => { d.resolve(); }
        }).dxMap('instance');

        d.done(() => {
            map.removeRoute(0).done(() => {
                assert.strictEqual(L.removedPolylines.length, 1, 'polyline removed');
                done();
            });
        });
    });

    QUnit.test('route color, weight, opacity are applied', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
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
                mode: 'walking',
            }],
            onReady: () => {
                assert.ok(capturedParams, 'callback was called');
                assert.strictEqual(capturedParams.mode, 'walking', 'mode passed to callback');
                assert.deepEqual(capturedParams.locations, [{ lat: 10, lng: 20 }, { lat: 30, lng: 40 }], 'locations passed to callback');
                done();
            }
        });
    });

    QUnit.test('straight-line polyline is drawn when osmGetRoute is not provided', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'osm',
            routes: [ROUTES[0]],
            onReady: () => {
                assert.strictEqual(L.addedPolylines.length, 1, 'straight-line polyline added');
                done();
            }
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
                assert.strictEqual(L.addedPolylines.length, 1, 'fallback polyline added');
                assert.ok(errorStub.withArgs('W1006').calledOnce, 'W1006 warning logged');

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
