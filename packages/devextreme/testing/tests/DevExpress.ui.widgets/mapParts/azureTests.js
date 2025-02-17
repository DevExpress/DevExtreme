/* global atlas */

import $ from 'jquery';
import { MARKERS, ROUTES } from './utils.js';
import AzureProvider from '__internal/ui/map/m_provider.dynamic.azure';
import ajaxMock from '../../../helpers/ajaxMock.js';

import 'ui/map';


const MARKER_CLASS = 'dx-map-marker';

const prepareTestingAzureProvider = () => {
    atlas.mapResized = false;
    atlas.mapDisposed = false;
    atlas.addedMarkers = [];
    atlas.removedMarkers = [];
    atlas.addedPopups = [];
    atlas.addedLayers = [];
    atlas.removedLayers = [];
    atlas.addedSources = [];
    atlas.removedSources = [];
    atlas.addEvents = [];
    atlas.removeEvents = [];
    atlas.popupOpened = false;
};

const moduleConfig = {
    beforeEach: function() {
        const fakeURL = '/fakeAzureUrl';

        AzureProvider.remapConstant(fakeURL);
        AzureProvider.prototype._geocodedLocations = {};

        ajaxMock.setup({
            url: fakeURL,
            callback: () => {
                $.getScript({
                    url: '../../packages/devextreme/testing/helpers/forMap/azureMock.js',
                    scriptAttrs: { nonce: 'qunit-test' }
                }).done(() => {
                    prepareTestingAzureProvider();
                });
            },
            responseText: {
                success: true,
                routes: [{
                    legs: [{
                        points: [
                            { latitude: 10, longitude: 10 },
                            { latitude: 20, longitude: 20 },
                            { latitude: 30, longitude: 30 },
                        ],
                    }],
                }],
                features: [{
                    geometry: {
                        coordinates: [77, 77],
                    },
                }],
            },
        });

        if(window.atlas) {
            prepareTestingAzureProvider();
        }

        this.geocodedCoordinates = [77, 77];
        this.routeCoordinates = [[10, 10], [20, 20], [30, 30]];
    },
    afterEach: function() {
        ajaxMock.clear();
    }
};

QUnit.module('map loading', moduleConfig, () => {
    QUnit.test('map initialize with loaded map', function(assert) {
        const done = assert.async();

        $.getScript({
            url: '../../packages/devextreme/testing/helpers/forMap/azureMock.js',
            scriptAttrs: { nonce: 'qunit-test' }
        }).done(function() {
            window.atlas.Map.customFlag = true;

            setTimeout(function() {
                $('#map').dxMap({
                    provider: 'azure',
                    onReady: $.proxy(() => {
                        assert.ok(window.atlas.Map.customFlag, 'map loaded without getting script');

                        done();
                    }, this)
                });
            });
        });
    });

    QUnit.test('map initialize without loaded map', function(assert) {
        const done = assert.async();

        if(window.atlas) {
            delete window.atlas;
        }

        const mapReadyDeferred1 = $.Deferred();
        const mapReadyDeferred2 = $.Deferred();

        $('<div>').appendTo($('#map')).dxMap({
            provider: 'azure',
            onReady: $.proxy((e) => {
                assert.ok(window.atlas, 'map loaded');

                mapReadyDeferred1.resolve();
            }, this)
        });

        $('<div>').appendTo($('#map')).dxMap({
            provider: 'azure',
            onReady: $.proxy((e) => {
                assert.ok(window.atlas, 'map loaded');

                mapReadyDeferred2.resolve();
            }, this)
        });

        $.when(mapReadyDeferred1, mapReadyDeferred2).done(function() {
            done();
        });
    });

    QUnit.test('map ready action', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            onReady: (e) => {
                assert.ok(true, 'map ready');
                assert.strictEqual(atlas.optionsSpecified, true, 'map options specified');
                assert.ok(e.originalMap instanceof atlas.Map, 'map instance specified');

                done();
            }
        });
    });
});

QUnit.module('basic options', moduleConfig, () => {
    ['someKey', { azure: 'someKey' }].forEach((apiKey) => {
        QUnit.test(`map credintials should be passed to a config (apiKey is a ${typeof apiKey})`, function(assert) {
            const done = assert.async();

            $('#map').dxMap({
                provider: 'azure',
                apiKey,
                onReady: () => {
                    const authOptions = {
                        authType: 'subscriptionKey',
                        subscriptionKey: 'someKey',
                    };
                    assert.deepEqual(atlas.options.authOptions, authOptions, 'map credentials are passed to config');

                    done();
                }
            });
        });
    });

    [
        {
            type: 'roadmap',
            style: 'road',
        },
        {
            type: 'hybrid',
            style: 'satellite_road_labels',
        },
        {
            type: 'satellite',
            style: 'satellite',
        }
    ].forEach(({ type, style }) => {
        QUnit.test(`map should have style=${style} when type option=${type}`, function(assert) {
            const done = assert.async();

            $('#map').dxMap({
                provider: 'azure',
                type,
                onReady: () => {
                    assert.strictEqual(atlas.options.style, style, 'style is passed correctly');

                    done();
                }
            });
        });
    });

    QUnit.test('map should change style on runtime type update', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            type: 'hybrid',
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(atlas.styleOptions.style, 'road', 'map style is updated');

                done();
            });

            map.option('type', 'roadmap');
        });
    });

    QUnit.test('map should pass zoom option', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            zoom: 10,
            onReady: () => {
                assert.strictEqual(atlas.options.zoom, 10, 'zoom is passed on init');

                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(atlas.cameraOptions.zoom, 5, 'zoom is passed on runtime');

                done();
            });

            map.option('zoom', 5);
        });
    });

    QUnit.test('center should be at [0,0] if it is not specified', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            onReady: () => {
                assert.deepEqual(atlas.cameraOptions.center, [0, 0], 'initial center is correct');

                done();
            }
        });
    });

    QUnit.test('map should pass center option', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            center: { lng: 20, lat: 10 },
            onReady: () => {
                assert.deepEqual(atlas.cameraOptions.center, [20, 10], 'center is passed on init');

                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.option('onUpdated', () => {
                assert.deepEqual(atlas.cameraOptions.center, [200, 200], 'center is passed on runtime');

                done();
            });

            map.option('center', [200, 200]);
        });
    });

    QUnit.test('center should be geocoded if adress is passed as a string', function(assert) {
        const done = assert.async();
        const center = 'Cedar Park, Texas';

        $('#map').dxMap({
            provider: 'azure',
            center,
            onReady: () => {
                assert.deepEqual(atlas.cameraOptions.center, this.geocodedCoordinates, 'center coordinates are correct');

                done();
            }
        });
    });

    QUnit.test('Previously geocoded location should be taken from cache instead of geocoding second time', function(assert) {
        const done = assert.async();
        const d1 = $.Deferred();
        const d2 = $.Deferred();
        const d3 = $.Deferred();
        const center = 'Cedar Park, Texas';

        const map = $('#map').dxMap({
            provider: 'azure',
            onReady: () => {
                d1.resolve();
            }
        }).dxMap('instance');

        const spy = sinon.spy(map._provider, '_geocodeLocationImpl');

        d1.done(() => {
            map.option('onUpdated', () => {
                assert.deepEqual(atlas.cameraOptions.center, this.geocodedCoordinates, 'center coordinated are correct');
                assert.strictEqual(spy.callCount, 1, 'geocode location function was called');

                d2.resolve();
            });

            map.option('center', center);
        });

        d2.done(() => {
            map.option('onUpdated', () => {
                assert.deepEqual(atlas.cameraOptions.center, [10, 10], 'center coordinated are updated');
                assert.strictEqual(spy.callCount, 1, 'geocode location function was not called on numbers location');

                d3.resolve();
            });

            map.option('center', [10, 10]);
        });

        d3.done(() => {
            map.option('onUpdated', () => {
                assert.deepEqual(atlas.cameraOptions.center, this.geocodedCoordinates, 'center coordinated are udated');
                assert.strictEqual(spy.callCount, 1, 'geocode location function was not called on the same string location as before');

                done();
            });

            map.option('center', center);
        });
    });

    QUnit.test('Bounds option should have more priority than center option', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            bounds: {
                northEast: [-10, -10],
                southWest: [10, 10],
            },
            center: [50, 50],
            onReady: function() {
                assert.deepEqual(atlas.cameraOptions.bounds, [10, 10, -10, -10], 'comeraOptions have bounds');
                assert.strictEqual(atlas.cameraOptions.center, undefined, 'comeraOptions do not have center');

                done();
            }
        });
    });

    ['width', 'height'].forEach((dimension) => {
        QUnit.test(`map should resize on runtime ${dimension} change`, function(assert) {
            const done = assert.async();
            const mapReadyDeferred = $.Deferred();

            const map = $('#map').dxMap({
                provider: 'azure',
                dimension: 300,
                onReady: () => {
                    assert.strictEqual(atlas.mapResized, false, 'map was not resized so far');
                    mapReadyDeferred.resolve();
                }
            }).dxMap('instance');

            mapReadyDeferred.done(() => {
                map.option('onUpdated', () => {
                    assert.strictEqual(atlas.mapResized, true, 'map was resized');

                    done();
                });

                map.option(dimension, 400);
            });
        });
    });

    QUnit.test('map should be able add and remove controls', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            controls: true,
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            assert.strictEqual(atlas.addedControls, 6, 'two copyright and four map controls are added');
            assert.strictEqual(atlas.controlOptions.position, 'top-right', 'controls position is correct');

            map.option('onUpdated', () => {
                assert.strictEqual(atlas.addedControls, 2, 'only two copyright controls remains');

                done();
            });

            map.option('controls', false);
        });
    });

    QUnit.test('map should set interactive state depending on disabled option', function(assert) {
        const done = assert.async();
        const d1 = $.Deferred();
        const d2 = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            disabled: true,
        }).dxMap('instance');


        setTimeout(() => {
            d1.resolve();
        }, 100);

        d1.done(() => {
            assert.strictEqual(atlas.options.interactive, false, 'interactive is disabled on init');

            map.option('disabled', false);

            setTimeout(() => {
                d2.resolve();
            }, 100);
        });

        d2.done(() => {
            assert.strictEqual(atlas.options.interactive, false, 'interactive is enabled on runtime');

            done();
        });
    });

    QUnit.test('Map should have click and move events', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            onReady: () => {
                assert.strictEqual(atlas.addedEvents.includes('click'), true, 'click event was added');
                assert.strictEqual(atlas.addedEvents.includes('move'), true, 'move event was added');

                done();
            }
        });
    });

    QUnit.test('Should add onClick handler with correct args', function(assert) {
        const done = assert.async();
        let clickFired = 0;

        const map = $('#map').dxMap({
            provider: 'azure',
            onClick: (e) => {
                assert.strictEqual(e.component, map, 'click event includes component instance');
                assert.strictEqual($(e.element).is($('#map')), true, 'click event includes root element');
                assert.deepEqual(e.location, { lat: 88, lng: 88 }, 'click event includes correct location');

                clickFired++;
            },
            onReady: () => {
                atlas.clickActionCallback({ type: 'click', position: [88, 88] });
                assert.strictEqual(clickFired, 1, 'click action fired');

                done();
            }
        }).dxMap('instance');
    });

    QUnit.test('Move event trigger should update map center, bounds and zoom options', function(assert) {
        const done = assert.async();

        const map = $('#map').dxMap({
            provider: 'azure',
            onReady: () => {
                atlas.moveActionCallback();

                const { center, bounds, zoom } = map.option();
                const expectedBounds = { northEast: { lat: 5, lng: 5 }, southWest: { lat: 55, lng: 55 } };

                assert.deepEqual(center, { lat: 5, lng: 5 }, 'center option was updated');
                assert.deepEqual(bounds, expectedBounds, 'bounds option was updated');
                assert.strictEqual(zoom, 5, 'zoom option was updated');

                done();
            }
        }).dxMap('instance');
    });
});


QUnit.module('Markers', moduleConfig, () => {
    QUnit.test('Should add markers on init', function(assert) {
        const done = assert.async();
        const marker = { location: [33, 33] };
        $('#map').dxMap({
            provider: 'azure',
            markers: [marker],
            onReady: () => {
                assert.strictEqual(atlas.addedMarkers.length, 1, 'Marker is added');
                assert.strictEqual(atlas.addedMarkers[0] instanceof atlas.HtmlMarker, true, 'Marker class is correct');
                assert.deepEqual(atlas.markerOptions, { position: [33, 33] }, 'Marker options are correct');

                done();
            }
        });
    });

    QUnit.test('Should add markers on runtime', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();
        const marker = { location: [33, 33] };

        const map = $('#map').dxMap({
            provider: 'azure',
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(atlas.addedMarkers.length, 1, 'Marker is added');
                assert.strictEqual(atlas.addedMarkers[0] instanceof atlas.HtmlMarker, true, 'Marker class is correct');
                assert.deepEqual(atlas.markerOptions.position, [33, 33], 'Marker position is correct');

                done();
            });

            map.option('markers', [marker]);
        });
    });

    QUnit.test('Should create a Popup if marker include tooltip config', function(assert) {
        const done = assert.async();
        const marker = { location: [10, 20], tooltip: 'Austin, Texas' };
        $('#map').dxMap({
            provider: 'azure',
            markers: [marker],
            onReady: () => {
                const popupText = $(atlas.popupOptions.content).text();
                assert.strictEqual(atlas.addedPopups.length, 1, 'Popup is added');
                assert.strictEqual(atlas.addedPopups[0] instanceof atlas.Popup, true, 'Popup class is correct');
                assert.deepEqual(atlas.popupOptions.position, [20, 10], 'Popup position is correct');
                assert.deepEqual(popupText, marker.tooltip, 'Popup text is correct');

                done();
            }
        });
    });

    QUnit.test('It should be possible to pass a markup to marker tooltip.text option', function(assert) {
        const done = assert.async();
        const marker = { location: [10, 20], tooltip: { text: '<b>Austin</b>, Texas' } };
        $('#map').dxMap({
            provider: 'azure',
            markers: [marker],
            onReady: () => {
                const $popupContent = $(atlas.popupOptions.content);
                const $b = $popupContent.find('b');

                assert.strictEqual($b.length, 1, '<b> element is passed to Popup');
                assert.strictEqual($b.text(), 'Austin', 'text is correct');

                done();
            }
        });
    });

    [false, true].forEach((isShown) => {
        QUnit.test(`Click on marker should ${isShown ? 'hide' : 'show'} Popup if tooltip.isShown=${isShown}`, function(assert) {
            const done = assert.async();

            const marker = {
                location: [40, -80],
                tooltip: {
                    text: 'Austin, Texas',
                    isShown,
                }
            };
            $('#map').dxMap({
                provider: 'azure',
                markers: [marker],
                onReady: () => {
                    atlas.clickActionCallback();
                    assert.strictEqual(atlas.popupOpened, !isShown);

                    done();
                }
            });
        });
    });

    QUnit.test('Click on marker should trigger onClick handler', function(assert) {
        const done = assert.async();
        let clickFired = 0;

        const marker = {
            location: [40, -80],
            onClick: (e) => {
                assert.deepEqual(e.location, { lat: 40, lng: -80 }, 'click event includes correct location');
                clickFired++;
            }
        };
        $('#map').dxMap({
            provider: 'azure',
            markers: [marker],
            onReady: () => {
                atlas.clickActionCallback();
                assert.strictEqual(clickFired, 1, 'click action fired');

                done();
            }
        });
    });

    QUnit.test('Marker should have custom icon if map markerIconSrc is specified', function(assert) {
        const done = assert.async();
        const markerIconSrc = 'customMarker.png';

        $('#map').dxMap({
            provider: 'azure',
            markers: [MARKERS[0]],
            markerIconSrc,
            onReady: () => {
                const $marker = $(atlas.markerOptions.htmlContent);

                assert.strictEqual($marker.hasClass(MARKER_CLASS), true, `Marker has ${MARKER_CLASS} class`);
                assert.strictEqual($marker.attr('alt'), 'Marker icon', 'Marker has correct alt text');
                assert.strictEqual($marker.attr('src'), markerIconSrc, 'Marker has src');

                done();
            }
        });
    });

    QUnit.test('Marker should have custom icon if map marker.iconSrc is specified', function(assert) {
        const done = assert.async();
        const iconSrc = 'customMarker.png';

        $('#map').dxMap({
            provider: 'azure',
            markers: [{ iconSrc }],
            onReady: () => {
                const $marker = $(atlas.markerOptions.htmlContent);

                assert.strictEqual($marker.hasClass(MARKER_CLASS), true, `Marker has ${MARKER_CLASS} class`);
                assert.strictEqual($marker.attr('alt'), 'Marker icon', 'Marker has correct alt text');
                assert.strictEqual($marker.attr('src'), iconSrc, 'Marker has src');

                done();
            }
        });
    });

    QUnit.test('addMarker method', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            markers: [MARKERS[0]],
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.addMarker({ location: [7, 7] }).done((instance) => {
                assert.strictEqual(atlas.addedMarkers.length, 2, 'Marker is added');
                assert.strictEqual(instance instanceof atlas.HtmlMarker, true, 'Marker class is correct');
                assert.deepEqual(atlas.markerOptions.position, [7, 7], 'Marker position is correct');

                done();
            });
        });
    });

    QUnit.test('removeMarker method', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            markers: [MARKERS[0]],
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.removeMarker(0).done(() => {
                assert.strictEqual(atlas.removedMarkers.length, 1, 'Marker is removed');

                done();
            });
        });
    });

    QUnit.test('add marker should trigger onMarkerAdded', function(assert) {
        const done = assert.async();
        let markerAddedFired = false;

        $('#map').dxMap({
            provider: 'azure',
            markers: [MARKERS[0]],
            onReady: () => {
                assert.strictEqual(markerAddedFired, true, 'onMarkerAdded fired');

                done();
            },
            onMarkerAdded: ({ options, originalMarker }) => {
                markerAddedFired = true;

                assert.deepEqual(options, MARKERS[0], 'marker options are passed as arg');
                assert.strictEqual(originalMarker instanceof atlas.HtmlMarker, true, 'added marker include HtmlMarker instance');
            },
        });
    });

    QUnit.test('remove marker should trigger onMarkerRemoved', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();
        let markerRemovedFired = false;

        const map = $('#map').dxMap({
            provider: 'azure',
            markers: [MARKERS[0]],
            onReady: () => {
                mapReadyDeferred.resolve();
            },
            onMarkerRemoved: ({ options }) => {
                markerRemovedFired = true;

                assert.deepEqual(options, MARKERS[0], 'marker options are passed as arg');
            },
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.option('onUpdated', function() {
                assert.strictEqual(markerRemovedFired, true, 'onMarkerRemoved fired');

                done();
            });

            map.option('markers', []);
        });
    });

    QUnit.test('Map should move bounds to fit Markers when autoAdjust is enabled', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            autoAdjust: true,
            center: [30, 30],
            markers: [{ location: [20, 20] }],
            onReady: () => {
                const expectedBounds = [19.9999, 19.9999, 20.0001, 20.0001];

                assert.strictEqual(atlas.cameraOptions.center, undefined, 'center is no defined anymore');
                assert.deepEqual(atlas.cameraOptions.bounds.coordinates, expectedBounds, 'bounds coordinates are around Marker');

                done();
            }
        });
    });

    QUnit.test('Map should not move bounds to fit Markers when autoAdjust is disabled', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            autoAdjust: false,
            center: [30, 30],
            markers: [MARKERS[0], MARKERS[1]],
            onReady: () => {
                const expectedCameraOptions = { center: [30, 30] };
                assert.deepEqual(atlas.cameraOptions, expectedCameraOptions, 'camera was not moved to fit Markers');

                done();
            }
        });
    });
});

QUnit.module('Routes', moduleConfig, () => {
    QUnit.test('Should add routes on init', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            routes: [ROUTES[0]],
            onReady: () => {
                assert.strictEqual(atlas.addedSources.length, 1, 'dataSource added');
                assert.strictEqual(atlas.addedSources[0] instanceof atlas.source.DataSource, true, 'dataSource class is correct');
                assert.strictEqual(atlas.addedLayers.length, 1, 'lineLayer added');
                assert.strictEqual(atlas.addedLayers[0] instanceof atlas.layer.LineLayer, true, 'lineLayer class is correct');
                assert.deepEqual(atlas.addedData.geometry.coordinates, this.routeCoordinates, 'Datasource have a route coordinates');

                done();
            }
        });
    });

    QUnit.test('Should add routes on runtime', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(atlas.addedSources.length, 1, 'dataSource added');
                assert.strictEqual(atlas.addedSources[0] instanceof atlas.source.DataSource, true, 'dataSource class is correct');
                assert.strictEqual(atlas.addedLayers.length, 1, 'lineLayer added');
                assert.strictEqual(atlas.addedLayers[0] instanceof atlas.layer.LineLayer, true, 'lineLayer class is correct');
                assert.deepEqual(atlas.addedData.geometry.coordinates, this.routeCoordinates, 'Datasource have a route coordinates');

                done();
            });

            map.option('routes', [ROUTES[0]]);
        });
    });

    QUnit.test('addRoute method', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.addRoute(ROUTES[0]).done(({ dataSource, lineLayer }) => {
                assert.strictEqual(atlas.addedSources.length, 1, 'dataSource added');
                assert.strictEqual(atlas.addedSources[0] instanceof atlas.source.DataSource, true, 'dataSource class is correct');
                assert.strictEqual(atlas.addedLayers.length, 1, 'lineLayer added');
                assert.strictEqual(atlas.addedLayers[0] instanceof atlas.layer.LineLayer, true, 'lineLayer class is correct');
                assert.strictEqual(dataSource instanceof atlas.source.DataSource, true, 'argument include a datasource instance');
                assert.strictEqual(lineLayer instanceof atlas.layer.LineLayer, true, 'argument include a lineLayer instance');
                assert.deepEqual(atlas.addedData.geometry.coordinates, this.routeCoordinates, 'Datasource have a route coordinates');

                done();
            });
        });
    });

    QUnit.test('removeRoute method', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();

        const map = $('#map').dxMap({
            provider: 'azure',
            routes: [ROUTES[0]],
            onReady: () => {
                mapReadyDeferred.resolve();
            }
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.removeRoute(0).done(() => {
                assert.strictEqual(atlas.removedSources.length, 1, 'dataSource was removed');
                assert.strictEqual(atlas.removedLayers.length, 1, 'lineLayer was removed');

                done();
            });
        });
    });

    QUnit.test('add route should trigger onRouteAdded', function(assert) {
        const done = assert.async();
        let routeAddedFired = false;

        $('#map').dxMap({
            provider: 'azure',
            routes: [ROUTES[0]],
            onReady: () => {

                assert.strictEqual(routeAddedFired, true, 'onRouteAdded fired');

                done();
            },
            onRouteAdded: ({ options, originalRoute }) => {
                routeAddedFired = true;

                assert.deepEqual(options, ROUTES[0], 'route options are passed as arg');
                assert.strictEqual(originalRoute.dataSource instanceof atlas.source.DataSource, true, 'added route include dataSource instance');
                assert.strictEqual(originalRoute.lineLayer instanceof atlas.layer.LineLayer, true, 'added route include lineLayer instance');
            },
        });
    });

    QUnit.test('remove route should trigger onRouteRemoved', function(assert) {
        const done = assert.async();
        const mapReadyDeferred = $.Deferred();
        let routeRemovedFired = false;

        const map = $('#map').dxMap({
            provider: 'azure',
            routes: [ROUTES[0]],
            onReady: () => {
                mapReadyDeferred.resolve();
            },
            onRouteRemoved: ({ options }) => {
                routeRemovedFired = true;

                assert.deepEqual(options, ROUTES[0], 'route options are passed as arg');
            },
        }).dxMap('instance');

        mapReadyDeferred.done(() => {
            map.option('onUpdated', function() {
                assert.strictEqual(routeRemovedFired, true, 'onRouteRemoved fired');

                done();
            });

            map.option('routes', []);
        });
    });

    QUnit.test('It should be possible to customize Route color, weight, opacity', function(assert) {
        const done = assert.async();

        $('#map').dxMap({
            provider: 'azure',
            routes: [{
                weight: 4,
                color: 'red',
                opacity: 0.3,
                locations: [[10, 10], [20, 20]],
            }],
            onReady: () => {
                assert.strictEqual(atlas.lineLayerOptions.strokeColor, '#ff0000', 'color is applied');
                assert.strictEqual(atlas.lineLayerOptions.strokeOpacity, 0.3, 'opacity is applied');
                assert.strictEqual(atlas.lineLayerOptions.strokeWidth, 4, 'weight is applied');

                done();
            }
        });
    });
});
