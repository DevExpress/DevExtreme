/* global Microsoft */

import $ from 'jquery';
import testing from './utils.js';
import BingProvider from 'ui/map/provider.dynamic.bing';
import ajaxMock from '../../../helpers/ajaxMock.js';
import errors from 'ui/widget/ui.errors';

import 'ui/map';

const LOCATIONS = testing.LOCATIONS;
const MARKERS = testing.MARKERS;
const ROUTES = testing.ROUTES;

const prepareTestingBingProvider = function(abortDirectionsUpdate) {
    window.geocodedLocation = new Microsoft.Maps.Location(-1.12345, -1.12345);
    window.geocodedWithErrorLocation = new Microsoft.Maps.Location();

    window.Microsoft.geocodeCalled = 0;

    window.Microsoft.pushpinRemoved = false;
    window.Microsoft.infoboxRemoved = false;
    window.Microsoft.directionRemoved = false;

    window.Microsoft.assignedOptions = null;

    window.Microsoft.pushpinInstance = 0;
    window.Microsoft.directionsInstance = 0;
    window.Microsoft.boundFittedCount = 0;

    window.Microsoft.abortDirectionsUpdate = !!abortDirectionsUpdate;
};

QUnit.module('bing provider', {
    beforeEach: function() {
        const fakeURL = 'fakeBingUrl';
        this.abortDirectionsUpdate = false;

        BingProvider.remapConstant(fakeURL);
        BingProvider.prototype._geocodedLocations = {};

        $.ajaxSetup({ jsonp: false });

        ajaxMock.setup({
            url: fakeURL,
            callback: function() {
                $.getScript('../../testing/helpers/forMap/bingMock.js')
                    .done(function() {
                        prepareTestingBingProvider(this.abortDirectionsUpdate);
                        if(window._bingScriptReady) {
                            window._bingScriptReady();
                        }
                    }.bind(this));
            }.bind(this)
        });

        if(window.Microsoft) {
            prepareTestingBingProvider();
        }
    },
    afterEach: function() {
        ajaxMock.clear();
    }
});

QUnit.test('map initialize without loaded map', function(assert) {
    const done = assert.async();

    if(window.Microsoft) {
        delete window.Microsoft.Maps;
    }

    const d1 = $.Deferred();
    const d2 = $.Deferred();

    $('<div>').appendTo($('#map')).dxMap({
        provider: 'bing',
        onReady: $.proxy(function(e) {
            assert.ok(window.Microsoft.Maps, 'map loaded');

            d1.resolve();
        }, this)
    });

    $('<div>').appendTo($('#map')).dxMap({
        provider: 'bing',
        onReady: $.proxy(function(e) {
            assert.ok(window.Microsoft.Maps, 'map loaded');

            d2.resolve();
        }, this)
    });

    $.when(d1, d2).done(function() {
        done();
    });
});

QUnit.test('map ready action', function(assert) {
    const done = assert.async();

    $('#map').dxMap({
        provider: 'bing',
        onReady: function(e) {
            assert.ok(true, 'map ready');
            assert.equal(window.Microsoft.optionsSpecified, true, 'map options specified');
            assert.ok(window.Microsoft.options.credentials, 'map credentials specified');
            assert.ok(e.originalMap instanceof Microsoft.Maps.Map, 'map instance specified');

            done();
        }
    });
});

QUnit.test('dimensions: width', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        width: 300,
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.assignedOptions.width, 400, 'width specified correctly');

            done();
        });

        map.option('width', 400);
    });
});

QUnit.test('dimensions: height', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        height: 300,
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.assignedOptions.height, 400, 'height specified correctly');

            done();
        });

        map.option('height', 400);
    });
});

QUnit.test('type', function(assert) {
    const done = assert.async();
    const d1 = $.Deferred();
    const d2 = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        type: 'hybrid',
        onReady: function() {
            assert.equal(window.Microsoft.assignedOptions.mapTypeId, Microsoft.Maps.MapTypeId.aerial, 'type specified correctly');
            assert.equal(window.Microsoft.assignedOptions.labelOverlay, Microsoft.Maps.LabelOverlay.visible, 'overlay set correctly');
            d1.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d1.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.assignedOptions.mapTypeId, Microsoft.Maps.MapTypeId.road, 'type changed');
            assert.equal(window.Microsoft.assignedOptions.labelOverlay, Microsoft.Maps.LabelOverlay.visible, 'overlay set correctly');

            d2.resolve();
        });

        map.option('type', 'roadmap');
    });

    d2.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.assignedOptions.mapTypeId, Microsoft.Maps.MapTypeId.aerial, 'type changed');
            assert.equal(window.Microsoft.assignedOptions.labelOverlay, Microsoft.Maps.LabelOverlay.hidden, 'overlay set correctly');

            done();
        });

        map.option('type', 'satellite');
    });
});

QUnit.test('center', function(assert) {
    const done = assert.async();
    const d1 = $.Deferred();
    const d2 = $.Deferred();
    const d3 = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        center: LOCATIONS[0],
        onReady: function() {
            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode used');
            assert.deepEqual(window.Microsoft.assignedOptions.center, window.geocodedLocation, 'center specified correctly');
            d1.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d1.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode not used');
            assert.deepEqual(window.Microsoft.assignedOptions.center, new Microsoft.Maps.Location(LOCATIONS[1].lat, LOCATIONS[1].lng), 'center changed');

            d2.resolve();
        });

        map.option('center', LOCATIONS[1]);
    });

    d2.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode not used');
            assert.deepEqual(window.Microsoft.assignedOptions.center, new Microsoft.Maps.Location(LOCATIONS[2][0], LOCATIONS[2][1]), 'center changed');

            d3.resolve();
        });

        map.option('center', LOCATIONS[2]);
    });

    d3.done(function() {
        map.option('onUpdated', function() {
            const coords = LOCATIONS[3].split(',');
            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode not used');
            assert.deepEqual(window.Microsoft.assignedOptions.center, new Microsoft.Maps.Location(parseFloat(coords[0]), parseFloat(coords[1])), 'center changed');

            done();
        });

        map.option('center', LOCATIONS[3]);
    });
});

QUnit.test('center with geocode error', function(assert) {
    const done = assert.async();
    const d1 = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        center: '',
        onReady: function() {
            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode not used');
            assert.deepEqual(window.Microsoft.assignedOptions.center, window.geocodedWithErrorLocation, 'center changed');

            d1.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d1.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.geocodeCalled, 2, 'geocode used');
            assert.deepEqual(window.Microsoft.assignedOptions.center, window.geocodedLocation, 'center changed');

            done();
        });

        map.option('center', LOCATIONS[0]);
    });
});

QUnit.test('\'center\' option is null', function(assert) {
    const done = assert.async();
    const d1 = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        center: null,
        onReady: function() {
            assert.deepEqual(window.Microsoft.assignedOptions.center, window.geocodedWithErrorLocation, 'center changed');

            d1.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d1.done(function() {
        map.option('onUpdated', function() {
            assert.deepEqual(window.Microsoft.assignedOptions.center, window.geocodedLocation, 'center changed');
            done();
        });

        map.option('center', LOCATIONS[0]);
    });
});

QUnit.test('geocode should be called once for equal locations', function(assert) {
    const done = assert.async();
    const d1 = $.Deferred();
    const d2 = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        center: LOCATIONS[0],
        onReady: function() {
            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode used');

            d1.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d1.done(function() {
        map.option('onUpdated', function() {
            d2.resolve();
        });

        map.option('center', LOCATIONS[1]);
    });

    d2.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode not used');

            done();
        });

        map.option('center', LOCATIONS[0]);
    });
});

QUnit.test('center changing from map', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        center: LOCATIONS[0],
        onReady: function() {
            window.Microsoft.centerValue = [5, 10];
            window.Microsoft.viewChangeCallback();
            assert.deepEqual(map.option('center'), { lat: 5, lng: 10 }, 'center changed correctly');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onReady', function() {
            assert.equal(window.Microsoft['viewchangeHandlerRemoved'], true, 'viewchange removed');

            done();
        });

        map.repaint();
    });
});

QUnit.test('zoom', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        zoom: 4,
        onReady: function() {
            assert.equal(window.Microsoft.options.zoom, 4, 'zoom specified correctly');
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.assignedOptions.zoom, 14, 'zoom changed');

            done();
        });

        map.option('zoom', 14);
    });
});

QUnit.test('zoom changing from map', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        zoom: 4,
        onReady: function() {
            window.Microsoft.zoomValue = 5;
            window.Microsoft.viewChangeCallback();
            assert.equal(map.option('zoom'), 5, 'zoom changed correctly');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onReady', function() {
            assert.equal(window.Microsoft['viewchangeHandlerRemoved'], true, 'viewchange removed');

            done();
        });

        map.repaint();
    });
});

QUnit.test('bounds', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    let firstPoint;
    let secondPoint;
    let thirdPoint;

    const $map = $('#map').dxMap({
        provider: 'bing',
        bounds: {
            northEast: LOCATIONS[0],
            southWest: LOCATIONS[1]
        },
        onReady: function() {
            firstPoint = window.geocodedLocation;
            secondPoint = new Microsoft.Maps.Location(LOCATIONS[1].lat, LOCATIONS[1].lng);
            thirdPoint = new Microsoft.Maps.Location(LOCATIONS[2][0], LOCATIONS[2][1]);

            assert.equal(window.Microsoft.geocodeCalled, 1, 'geocode used');
            assert.deepEqual(window.Microsoft.assignedOptions.bounds.points, [firstPoint, secondPoint], 'center changed');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.geocodeCalled, 2, 'geocode used');
            assert.deepEqual(window.Microsoft.assignedOptions.bounds.points, [firstPoint, thirdPoint], 'center changed');

            done();
        });

        map.option('bounds', {
            northEast: LOCATIONS[0] + ', USA',
            southWest: LOCATIONS[2]
        });
    });
});

QUnit.test('bounds option should take precedence over center if bounds set', function(assert) {
    const done = assert.async();

    $('#map').dxMap({
        provider: 'bing',
        bounds: {
            northEast: LOCATIONS[0],
            southWest: LOCATIONS[1]
        },
        center: LOCATIONS[0],
        onReady: function() {
            assert.notDeepEqual(window.Microsoft.assignedOptions.center, window.geocodedLocation, 'center specified correctly');

            done();
        }
    });
});

QUnit.test('bounds option should not take precedence over center if bounds not set', function(assert) {
    const done = assert.async();

    $('#map').dxMap({
        provider: 'bing',
        center: LOCATIONS[0],
        onReady: function() {
            assert.deepEqual(window.Microsoft.assignedOptions.center, window.geocodedLocation, 'center specified correctly');

            done();
        }
    });
});

QUnit.test('bounds changing from map', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        onReady: function() {
            window.Microsoft.boundsValue = {
                getNorthwest: function() {
                    return new Microsoft.Maps.Location(10, 50);
                },
                getSoutheast: function() {
                    return new Microsoft.Maps.Location(40, 20);
                }
            };
            window.Microsoft.viewChangeCallback();
            assert.deepEqual(map.option('bounds'), {
                northEast: { lat: 10, lng: 20 },
                southWest: { lat: 40, lng: 50 }
            }, 'bounds changed correctly');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onReady', function() {
            assert.equal(window.Microsoft['viewchangeHandlerRemoved'], true, 'viewchange removed');

            done();
        });

        map.repaint();
    });
});

QUnit.test('controls', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        controls: true,
        onReady: function() {
            assert.equal(window.Microsoft.options.showDashboard, true, 'controls specified correctly');
            assert.equal(window.Microsoft.options.showMapTypeSelector, true, 'controls specified correctly');
            assert.equal(window.Microsoft.options.showScalebar, true, 'controls specified correctly');
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onReady', function() {
            assert.equal(window.Microsoft.options.showDashboard, false, 'controls specified correctly');
            assert.equal(window.Microsoft.options.showMapTypeSelector, false, 'controls specified correctly');
            assert.equal(window.Microsoft.options.showScalebar, false, 'controls specified correctly');

            done();
        });

        map.option('controls', false);
    });
});

QUnit.test('apiKey', function(assert) {
    const done = assert.async();

    $('#map').dxMap({
        provider: 'bing',
        apiKey: {
            bing: '12345'
        },
        onReady: function() {
            assert.equal(window.Microsoft.options.credentials, '12345', 'map apiKey specified correctly');

            done();
        }
    });
});

QUnit.test('markers', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        onReady: function() {
            assert.deepEqual(window.Microsoft.pushpinLocation, new Microsoft.Maps.Location(MARKERS[0].location.lat, MARKERS[0].location.lng), 'location specified correctly');
            assert.equal(window.Microsoft.pushpinAddedToMap, true, 'pushpin added to map');
            assert.equal(window.Microsoft.infoboxAddedToMap, true, 'infobox added to map');
            assert.strictEqual(window.Microsoft.pushpinOptions.width, undefined, 'pushpin width not specified');
            assert.strictEqual(window.Microsoft.pushpinOptions.height, undefined, 'pushpin height not specified');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.pushpinInstance, 3, 'markers changed');
            assert.equal(window.Microsoft.pushpinRemoved, true, 'previous marker removed');
            assert.equal(window.Microsoft.infoboxRemoved, true, 'infobox marker removed');
            assert.equal(window.Microsoft.clickHandlerRemoved, true, 'previous marker handler removed');

            done();
        });

        map.option('markers', [MARKERS[1], MARKERS[2]]);
    });
});

QUnit.test('marker`s tooltip options', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        onReady: function() {
            assert.deepEqual(window.Microsoft.infoboxLocation, new Microsoft.Maps.Location(MARKERS[0].location.lat, MARKERS[0].location.lng), 'infobox location specified');
            assert.equal(window.Microsoft.infoboxOptions.description, 'A', 'infobox description specified');
            assert.equal(window.Microsoft.infoboxOptions.visible, true, 'infobox visible on render');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.deepEqual(window.Microsoft.infoboxLocation, new Microsoft.Maps.Location(MARKERS[1].location[0], MARKERS[1].location[1]), 'infobox location specified');
            assert.equal(window.Microsoft.infoboxOptions.description, 'B', 'infobox description specified');
            assert.equal(window.Microsoft.infoboxOptions.visible, false, 'infobox invisible on render');

            done();
        });

        map.option('markers', [MARKERS[1]]);
    });
});

QUnit.test('marker integration', function(assert) {
    const done = assert.async();
    let clickFired = 0;
    const marker = {
        tooltip: 'A',
        location: [40.537102, -73.990318],
        onClick: function(e) {
            assert.deepEqual(e.location, { lat: 40.537102, lng: -73.990318 }, 'markers location set');
            clickFired++;
        }
    };

    $('#map').dxMap({
        provider: 'bing',
        markers: [marker],
        onReady: function() {
            window.Microsoft.clickActionCallback();
            assert.equal(clickFired, 1, 'click action fired');
            assert.equal(window.Microsoft.infoboxOpened, true, 'tooltip opened');

            done();
        }
    });
});

QUnit.test('marker icon', function(assert) {
    const done = assert.async();
    const d1 = $.Deferred();
    const d2 = $.Deferred();

    const markerUrl1 = 'http://example.com/1.png';
    const markerUrl2 = 'http://example.com/2.png';

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        markerIconSrc: markerUrl1,
        onReady: function() {
            assert.equal(window.Microsoft.pushpinOptions.icon, markerUrl1, 'pushpin contains custom icon url');
            d1.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d1.done(function() {
        map.addMarker([$.extend({ iconSrc: markerUrl2 }, MARKERS[1]), MARKERS[2]]).done(function(instances) {
            assert.equal(instances[0].getIcon(), markerUrl2, 'marker instance contains custom icon url');
            assert.equal(instances[1].getIcon(), markerUrl1, 'marker instance contains custom icon url');

            d2.resolve();
        });
    });

    d2.done(function() {
        map.option('markerIconSrc', markerUrl2);

        map.addMarker(MARKERS[3]).done(function(instance) {
            assert.equal(instance.getIcon(), markerUrl2, 'marker instance contains custom icon url');

            done();
        });
    });
});

QUnit.test('marker html', function(assert) {
    const done = assert.async();

    $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[5]],
        onReady: function() {
            assert.equal(window.Microsoft.pushpinOptions.htmlContent, MARKERS[5].html, 'pushpin contains custom html');
            assert.strictEqual(window.Microsoft.pushpinOptions.width, null, 'pushpin width specified');
            assert.strictEqual(window.Microsoft.pushpinOptions.height, null, 'pushpin height specified');

            done();
        }
    });
});

QUnit.test('marker html offset', function(assert) {
    const done = assert.async();
    $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[6]],
        onReady: function() {
            assert.deepEqual(window.Microsoft.pushpinOptions.anchor, new Microsoft.Maps.Point(-25, -15), 'pushpin width specified');

            done();
        }
    });
});

QUnit.test('add marker', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.addMarker(MARKERS[1]).done(function(instance) {
            assert.ok(!window.Microsoft.pushpinRemoved, 'previous markers does not removed');

            assert.deepEqual(window.Microsoft.pushpinLocation, new Microsoft.Maps.Location(MARKERS[0].location.lat, MARKERS[0].location.lng), 'marker created with correct location');
            assert.ok(instance instanceof Microsoft.Maps.Pushpin, 'marker instance returned');

            done();
        });
    });
});

QUnit.test('add marker should extend bounds', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    let firstPoint;
    let secondPoint;

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        onReady: function() {
            firstPoint = new Microsoft.Maps.Location(MARKERS[0].location.lat, MARKERS[0].location.lng);
            secondPoint = new Microsoft.Maps.Location(MARKERS[1].location[0], MARKERS[1].location[1]);

            assert.deepEqual(Microsoft.locationRectInstances.pop().points, [firstPoint], 'bound extended and fitted correctly');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.deepEqual(Microsoft.locationRectInstances.pop().points, [firstPoint, firstPoint, secondPoint], 'extended by 2 locations after changing markers');

            done();
        });

        map.addMarker(MARKERS[1]);
    });
});

QUnit.test('add marker should extend visible bounds if autoAdjust = true', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        autoAdjust: true,
        onReady: function() {
            assert.equal(window.Microsoft.boundFittedCount, 1, 'bounds fitted');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.boundFittedCount, 2, 'bounds fitted again');

            done();
        });

        map.addMarker(MARKERS[1]);
    });
});

QUnit.test('add marker should not extend visible bounds if autoAdjust = false', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        autoAdjust: false,
        onReady: function() {
            assert.equal(window.Microsoft.boundFittedCount, 0, 'bounds fitted');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.boundFittedCount, 0, 'bounds fitted again');

            done();
        });

        map.option('markers', [MARKERS[0], MARKERS[1]]);
    });
});

QUnit.test('add markers', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.addMarker([MARKERS[0], MARKERS[1]]).done(function(instances) {
            assert.ok(instances[0] instanceof Microsoft.Maps.Pushpin, 'marker instance returned');
            assert.ok(instances[1] instanceof Microsoft.Maps.Pushpin, 'marker instance returned');

            done();
        });
    });
});

QUnit.test('remove marker', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0], MARKERS[1]],
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.removeMarker(1).done(function() {
            assert.equal(window.Microsoft.pushpinRemoved, true, 'marker removed');
            assert.equal(window.Microsoft.infoboxRemoved, true, 'infobox marker removed');
            assert.equal(window.Microsoft.clickHandlerRemoved, true, 'marker handler removed');

            done();
        });
    });
});

QUnit.test('markerAdded', function(assert) {
    const done = assert.async();
    let markerAddedFired = 0;

    $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        onMarkerAdded: function(args) {
            assert.equal(args.options, MARKERS[0], 'correct options passed as parameter');
            assert.ok(args.originalMarker instanceof Microsoft.Maps.Pushpin, 'marker instance returned');
            markerAddedFired++;
        },
        onReady: function() {
            assert.equal(markerAddedFired, 1, 'markerAdded fired');

            done();
        }
    });
});

QUnit.test('markerRemoved', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    let markerRemovedFired = 0;

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        onMarkerRemoved: function(args) {
            assert.equal(args.options, MARKERS[0], 'correct options passed as parameter');
            markerRemovedFired++;
        },
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(markerRemovedFired, 1, 'markerRemoved fired');

            done();
        });

        map.option('markers', []);
    });
});

QUnit.test('autoAdjust', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        autoAdjust: false,
        onReady: function() {
            assert.equal(window.Microsoft.boundFittedCount, 0, 'bounds not fitted');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.boundFittedCount, 1, 'bounds not fitted again');

            done();
        });

        map.option('autoAdjust', true);
    });
});

QUnit.test('autoAdjust should not change zoom if marker is fitted', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        autoAdjust: false,
        zoom: 5,
        onReady: function() {
            window.Microsoft.zoomValue = 5;
            window.Microsoft.fitBoundsCallback = function() {
                window.Microsoft.zoomValue = 10;
                window.Microsoft.Maps.Events.invoke(null, 'viewchange');
            };

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.boundFittedCount, 1, 'bounds fitted');
            assert.equal(map.option('zoom'), 5, 'zoom not changed');
            assert.equal(window.Microsoft.assignedOptions.zoom, 5, 'zoom returned back');

            window.Microsoft.fitBoundsCallback = null;
            done();
        });

        map.option('autoAdjust', true);
    });
});

QUnit.test('autoAdjust should change zoom if marker is not fitted', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        autoAdjust: false,
        zoom: 10,
        onReady: function() {
            window.Microsoft.zoomValue = 10;
            window.Microsoft.fitBoundsCallback = function() {
                window.Microsoft.zoomValue = 5;
                window.Microsoft.Maps.Events.invoke(null, 'viewchange');
            };

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.boundFittedCount, 1, 'bounds fitted');
            assert.equal(map.option('zoom'), 5, 'zoom not changed');

            window.Microsoft.fitBoundsCallback = null;
            done();
        });

        map.option('autoAdjust', true);
    });
});

QUnit.test('autoAdjust should not prevent zoom changing after change', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        markers: [MARKERS[0]],
        autoAdjust: false,
        zoom: 5,
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            window.Microsoft.zoomValue = 10;
            window.Microsoft.Maps.Events.invoke(null, 'viewchange');
            assert.equal(map.option('zoom'), 10, 'zoom change prevention is removed');

            done();
        });

        map.option('autoAdjust', true);
    });
});

QUnit.test('routes', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        routes: [ROUTES[0]],
        onReady: function() {
            const strokeColor = new Microsoft.Maps.Color.fromHex('#0000ff');
            strokeColor.a = ROUTES[0].opacity * 255;
            const polOpts = {
                strokeColor: strokeColor,
                strokeThickness: ROUTES[0].weight
            };

            assert.equal(window.Microsoft.directionsMapSpecified, true, 'direction drawn');
            assert.equal(window.Microsoft.directionsOptions.routeMode, Microsoft.Maps.Directions.RouteMode.walking, 'map specified correctly');
            assert.deepEqual(window.Microsoft.directionsOptions.drivingPolylineOptions, polOpts, 'line options specified correctly');
            assert.deepEqual(window.Microsoft.directionsOptions.walkingPolylineOptions, polOpts, 'line options specified correctly');
            assert.equal(window.Microsoft.directionsUpdatedHandlerRemoved, true, 'directions update handler drawn');
            assert.equal(window.Microsoft.directionsErrorHandlerRemoved, true, 'directions error handler drawn');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(window.Microsoft.directionsInstance, 2, 'routes changed');

            done();
        });

        map.addRoute(ROUTES[1]);
    });
});

QUnit.test('add route', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        routes: [ROUTES[0]],
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.addRoute(ROUTES[1]).done(function(instance) {
            assert.ok(!window.Microsoft.directionRemoved, 'previous route does not removed');

            assert.ok(instance instanceof Microsoft.Maps.Directions.DirectionsManager, 'route instance returned');

            map.removeRoute(1).done(function() {
                assert.equal(window.Microsoft.directionRemoved, true, 'route removed');

                done();
            });
        });
    });
});

QUnit.test('add route should extend bounds', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const points = [];

    const $map = $('#map').dxMap({
        provider: 'bing',
        routes: [ROUTES[0]],
        onReady: function() {
            points.push(new Microsoft.Maps.Location(ROUTES[0].locations[0][0], ROUTES[0].locations[0][1]),
                new Microsoft.Maps.Location(ROUTES[0].locations[2][0], ROUTES[0].locations[2][1]),
                new Microsoft.Maps.Location(ROUTES[1].locations[0].lat, ROUTES[1].locations[0].lng),
                new Microsoft.Maps.Location(ROUTES[1].locations[2][0], ROUTES[1].locations[2][1]));

            assert.deepEqual(Microsoft.locationRectInstances.pop().points, [points[0], points[0], points[1]], 'bound extended and fitted correctly');

            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.deepEqual(Microsoft.locationRectInstances.pop().points, [points[0], points[0], points[3]], 'bound extended and fitted correctly');

            done();
        });

        map.addRoute(ROUTES[1]);
    });
});

QUnit.test('add routes', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    const $map = $('#map').dxMap({
        provider: 'bing',
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.addRoute([ROUTES[0], ROUTES[1]]).done(function(instances) {
            assert.ok(instances[0] instanceof Microsoft.Maps.Directions.DirectionsManager, 'route instance returned');
            assert.ok(instances[1] instanceof Microsoft.Maps.Directions.DirectionsManager, 'route instance returned');

            done();
        });
    });
});

QUnit.test('Error on render route', function(assert) {
    const done = assert.async();
    const d = $.Deferred();
    const logStub = sinon.stub(errors, 'log');

    if(window.Microsoft) {
        window.Microsoft.abortDirectionsUpdate = true;
    } else {
        this.abortDirectionsUpdate = true;
    }

    const $map = $('#map').dxMap({
        provider: 'bing',
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.addRoute([ROUTES[0], ROUTES[1]]).done(function(instances) {
            assert.ok(instances[0] instanceof Microsoft.Maps.Directions.DirectionsManager, 'route instance returned');
            assert.ok(instances[1] instanceof Microsoft.Maps.Directions.DirectionsManager, 'route instance returned');
            assert.deepEqual(logStub.firstCall.args, ['W1006', 'RouteResponseCode: 1 - Directions error'], 'Check warning parameters');

            logStub.restore();
            done();
        });
    });
});

QUnit.test('routeAdded', function(assert) {
    const done = assert.async();
    let routeAddedFired = 0;

    $('#map').dxMap({
        provider: 'bing',
        routes: [ROUTES[0]],
        onRouteAdded: function(args) {
            assert.equal(args.options, ROUTES[0], 'correct options passed as parameter');
            assert.ok(args.originalRoute instanceof Microsoft.Maps.Directions.DirectionsManager, 'route instance returned');
            routeAddedFired++;
        },
        onReady: function() {
            assert.equal(routeAddedFired, 1, 'routeAdded fired');

            done();
        }
    });
});

QUnit.test('routeRemoved', function(assert) {
    const done = assert.async();
    const d = $.Deferred();

    let routeRemovedFired = 0;

    const $map = $('#map').dxMap({
        provider: 'bing',
        routes: [ROUTES[0]],
        onRouteRemoved: function(args) {
            assert.equal(args.options, ROUTES[0], 'correct options passed as parameter');
            routeRemovedFired++;
        },
        onReady: function() {
            d.resolve();
        }
    });
    const map = $map.dxMap('instance');

    d.done(function() {
        map.option('onUpdated', function() {
            assert.equal(routeRemovedFired, 1, 'routeRemoved fired');

            done();
        });

        map.option('routes', []);
    });
});

QUnit.test('click', function(assert) {
    const done = assert.async();
    const d = $.Deferred();
    let clicked = 0;
    let eventFired = 0;

    const $map = $('#map').dxMap({
        provider: 'bing',
        width: 400,
        height: 500,
        onClick: function(e) {
            assert.deepEqual(e.location, {
                lat: 2,
                lng: 10
            }, 'correct location passed');
            clicked++;
        },
        onReady: function() {
            d.resolve();
        }
    });

    $map.dxMap('instance').on('click', function() {
        eventFired++;
    });

    d.done(function() {
        Microsoft.clickActionCallback(new Microsoft.Maps.MouseEventArgs(2, 10));
        assert.equal(clicked, 1);
        assert.equal(eventFired, 1);
        done();
    });

});
