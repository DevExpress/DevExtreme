import $ from 'jquery';

// eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap provider identifier
import OsmProvider from '__internal/ui/map/provider.dynamic.osm';
import { createOpenLayersEngine } from '__internal/ui/map/provider.dynamic.osm.openlayers';
import errors from 'ui/widget/ui.errors';

import 'ui/map';

let openLayersMock;
const resetOpenLayersMock = () => {
    Object.assign(openLayersMock, {
        addedTileLayers: [],
        controlOptions: null,
        interactionOptions: null,
        mapCreated: false,
        mapInstance: null,
        mapOptions: null,
        mapResized: false,
        mapTarget: null,
        projectedCoordinates: [],
        removedLayers: [],
        throwOnTileSource: false,
        tileLayer: null,
        tileLayerOptions: null,
        tileSourceChanges: [],
        tileSourceOptions: null,
        viewCenter: null,
        viewCenterSetCount: 0,
        viewOptions: null,
        viewZoom: null
    });
};
const moduleConfig = {
    beforeEach(assert) {
        const setup = () => {
            window.ol = openLayersMock;
            resetOpenLayersMock();
        };
        if(openLayersMock) {
            setup();
            return;
        }
        const done = assert.async();
        $.getScript({
            url: '../../packages/devextreme/testing/helpers/forMap/openLayersMock.js',
            scriptAttrs: {
                nonce: 'qunit-test'
            }
        }).done(() => {
            openLayersMock = window.ol;
            setup();
            done();
        }).fail((_request, _status, error) => {
            assert.ok(false, `failed to load OpenLayers mock: ${error}`);
            done();
        });
    },
    afterEach() {
        window.ol = openLayersMock;
    }
};
// eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap provider identifier
const createProvider = () => new OsmProvider({
    option: () => ({
        providerConfig: {}
    })
}, null);
QUnit.module('OSM: map loading', moduleConfig, () => {
    QUnit.test('map initializes with OpenLayers from window.ol', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: ({
                originalMap
            }) => {
                assert.ok(openLayersMock.mapCreated, 'OpenLayers creates the map');
                assert.strictEqual(originalMap, openLayersMock.mapInstance, 'originalMap is returned');
                done();
            }
        });
    });
    QUnit.test('OpenLayers map target is keyboard focusable', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const container = document.createElement('div');
        const engineMap = engine.createMap(container);
        assert.strictEqual(container.getAttribute('tabindex'), '0', 'map target is focusable');
        assert.deepEqual(openLayersMock.interactionOptions, {
            onFocusOnly: false
        }, 'pointer interactions do not require focus');
        engineMap.dispose();
        assert.strictEqual(container.getAttribute('tabindex'), null, 'added tabindex is removed on dispose');
    });
    QUnit.test('OpenLayers controls are configured for the tiles stage', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        assert.deepEqual(openLayersMock.controlOptions, {
            attribution: true,
            rotate: false,
            zoom: false
        }, 'only the attribution control remains enabled');
        engineMap.dispose();
    });
    QUnit.test('OpenLayers Shadow DOM host is keyboard focusable', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const host = document.createElement('div');
        const shadowRoot = host.attachShadow({
            mode: 'open'
        });
        const container = document.createElement('div');
        shadowRoot.appendChild(container);
        const engineMap = engine.createMap(container);
        assert.strictEqual(host.getAttribute('tabindex'), '0', 'Shadow DOM host is focusable');
        assert.strictEqual(container.getAttribute('tabindex'), null, 'nested map target does not add a second tab stop');
        engineMap.dispose();
        assert.strictEqual(host.getAttribute('tabindex'), null, 'added host tabindex is removed on dispose');
    });
    QUnit.test('existing tabindex is preserved on dispose', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const container = document.createElement('div');
        container.setAttribute('tabindex', '-1');
        const engineMap = engine.createMap(container);
        engineMap.dispose();
        assert.strictEqual(container.getAttribute('tabindex'), '-1', 'client tabindex is preserved');
    });
    QUnit.test('tabindex changed after initialization is preserved on dispose', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const container = document.createElement('div');
        const engineMap = engine.createMap(container);
        container.setAttribute('tabindex', '-1');
        engineMap.dispose();
        assert.strictEqual(container.getAttribute('tabindex'), '-1', 'updated client tabindex is preserved');
    });
    QUnit.test('engine map can be disposed more than once', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        engineMap.replaceTileLayer({
            attribution: 'Example attribution',
            maxZoom: 19,
            url: 'https://tiles.example.com/{z}/{x}/{y}.png'
        });
        const tileLayer = openLayersMock.tileLayer;
        engineMap.dispose();
        engineMap.dispose();
        assert.strictEqual(openLayersMock.removedLayers.filter(layer => layer === tileLayer).length, 1, 'tile layer is removed once');
    });
    QUnit.test('updateDimensions updates the OpenLayers map size', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        engineMap.updateDimensions();
        assert.ok(openLayersMock.mapResized, 'OpenLayers map size is updated');
        engineMap.dispose();
    });
    QUnit.test('load rejects with E1069 when OpenLayers is missing', function(assert) {
        const done = assert.async();
        const provider = createProvider();
        delete window.ol;
        provider._loadImpl().then(() => {
            assert.ok(false, 'load should reject');
            done();
        }, error => {
            assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');
            done();
        });
    });
    QUnit.test('load rejects with E1069 when the OpenLayers ImageTile API is missing', function(assert) {
        const done = assert.async();
        const provider = createProvider();
        window.ol = Object.assign({}, openLayersMock, { source: {} });
        provider._loadImpl().then(() => {
            assert.ok(false, 'load should reject');
            done();
        }, error => {
            assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');
            done();
        });
    });
    QUnit.test('dispose detaches the OpenLayers map and removes its tile layer', function(assert) {
        const done = assert.async();
        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                const tileLayer = openLayersMock.tileLayer;
                map.dispose();
                assert.strictEqual(openLayersMock.mapTarget, undefined, 'map target is cleared');
                assert.ok(openLayersMock.removedLayers.includes(tileLayer), 'tile layer is removed');
                done();
            }
        }).dxMap('instance');
    });
});
QUnit.module('OSM: tile server', moduleConfig, () => {
    QUnit.test('string tileServer creates a tile layer with defaults', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: 'https://tiles.example.com/{z}/{x}/{y}.png'
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.tileSourceOptions, {
                    attributions: '',
                    maxZoom: 19,
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png'
                }, 'tile source defaults are applied');
                assert.ok(log.calledWith('W1032'), 'missing attribution warning is logged');
                log.restore();
                done();
            }
        });
    });
    QUnit.test('tileServer config passes attribution and maxZoom', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution',
                    maxZoom: 17
                }
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.tileSourceOptions, {
                    attributions: 'Example attribution',
                    maxZoom: 17,
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png'
                }, 'tile source config is passed');
                done();
            }
        });
    });
    QUnit.test('tileServer callback receives the initial map type', function(assert) {
        const done = assert.async();
        const tileServer = sinon.spy(() => ({
            url: 'https://tiles.example.com/{z}/{x}/{y}.png',
            attribution: 'Example attribution'
        }));
        $('#map').dxMap({
            provider: 'osm',
            type: 'satellite',
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.ok(tileServer.calledOnceWithExactly('satellite'), 'map type is passed');
                done();
            }
        });
    });
    QUnit.test('tileServer callback can return a URL string', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: () => 'https://tiles.example.com/{z}/{x}/{y}.png'
            },
            onReady: () => {
                assert.strictEqual(openLayersMock.tileSourceOptions.url, 'https://tiles.example.com/{z}/{x}/{y}.png', 'URL string is used');
                assert.ok(log.calledWith('W1032'), 'missing attribution warning is logged');
                log.restore();
                done();
            }
        });
    });
    QUnit.test('tileServer callback can return null on initialization', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: () => null
            },
            onReady: () => {
                assert.ok(log.calledWith('W1030'), 'W1030 is logged');
                assert.strictEqual(openLayersMock.addedTileLayers.length, 0, 'tile layer is not created');
                log.restore();
                done();
            }
        });
    });
    QUnit.test('subdomains string is expanded for OpenLayers', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution',
                    // eslint-disable-next-line spellcheck/spell-checker -- tile server option name
                    subdomains: 'ab'
                }
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.tileSourceOptions.url, ['https://a.tiles.example.com/{z}/{x}/{y}.png', 'https://b.tiles.example.com/{z}/{x}/{y}.png'], 'subdomains are expanded');
                done();
            }
        });
    });
    QUnit.test('default subdomains are expanded for OpenLayers', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.tileSourceOptions.url, ['https://a.tiles.example.com/{z}/{x}/{y}.png', 'https://b.tiles.example.com/{z}/{x}/{y}.png', 'https://c.tiles.example.com/{z}/{x}/{y}.png'], 'default subdomains are expanded');
                done();
            }
        });
    });
    QUnit.test('empty subdomains use the default value', function(assert) {
        ['', []].forEach(value => {
            // eslint-disable-next-line spellcheck/spell-checker -- OpenStreetMap provider identifier
            const provider = new OsmProvider({
                option: () => ({
                    providerConfig: {
                        tileServer: {
                            url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png',
                            attribution: 'Example attribution',
                            // eslint-disable-next-line spellcheck/spell-checker -- tile server option name
                            subdomains: value
                        }
                    }
                })
            }, null);
            const options = provider._resolveTileLayerOptions('roadmap');
            const valueType = Array.isArray(value) ? 'array' : 'string';

            // eslint-disable-next-line spellcheck/spell-checker -- tile server option name
            assert.strictEqual(options.subdomains, 'abc', `empty ${valueType} uses default subdomains`);
        });
    });
    QUnit.test('subdomains array is expanded for OpenLayers', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution',
                    // eslint-disable-next-line spellcheck/spell-checker -- tile server option name
                    subdomains: ['first', 'second']
                }
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.tileSourceOptions.url, ['https://first.tiles.example.com/{z}/{x}/{y}.png', 'https://second.tiles.example.com/{z}/{x}/{y}.png'], 'subdomains are expanded');
                done();
            }
        });
    });
    QUnit.test('missing tileServer logs W1030 and keeps the map initialized', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        $('#map').dxMap({
            provider: 'osm',
            onReady: () => {
                assert.ok(log.calledWith('W1030'), 'W1030 is logged');
                assert.strictEqual(openLayersMock.addedTileLayers.length, 0, 'tile layer is not created');
                log.restore();
                done();
            }
        });
    });
    QUnit.test('tileServer with an empty URL logs W1030 and keeps the map initialized', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: ''
                }
            },
            onReady: () => {
                assert.ok(log.calledWith('W1030'), 'W1030 is logged');
                assert.strictEqual(openLayersMock.addedTileLayers.length, 0, 'tile layer is not created');
                log.restore();
                done();
            }
        });
    });
    QUnit.test('missing attribution logs W1032 and keeps the tile layer', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: 'https://tiles.example.com/{z}/{x}/{y}.png'
            },
            onReady: () => {
                assert.ok(log.calledWith('W1032'), 'W1032 is logged');
                assert.strictEqual(openLayersMock.addedTileLayers.length, 1, 'tile layer is created');
                log.restore();
                done();
            }
        });
    });
    QUnit.test('changing type replaces the tile source returned by the callback', function(assert) {
        const done = assert.async();
        const initialized = $.Deferred();
        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: type => ({
                    url: `https://${type}.example.com/{z}/{x}/{y}.png`,
                    attribution: 'Example attribution'
                })
            },
            onReady: () => initialized.resolve()
        }).dxMap('instance');
        initialized.done(() => {
            map.option('onUpdated', () => {
                assert.strictEqual(openLayersMock.tileSourceOptions.url, 'https://satellite.example.com/{z}/{x}/{y}.png', 'tile source is replaced');
                assert.strictEqual(openLayersMock.tileSourceChanges.length, 1, 'existing layer receives the new source');
                done();
            });
            map.option('type', 'satellite');
        });
    });
    QUnit.test('changing type preserves a fixed tile source', function(assert) {
        const done = assert.async();
        const initialized = $.Deferred();
        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => initialized.resolve()
        }).dxMap('instance');
        initialized.done(() => {
            const originalSource = openLayersMock.tileLayer.source;
            map.option('onUpdated', () => {
                assert.strictEqual(openLayersMock.tileLayer.source, originalSource, 'fixed source is preserved');
                assert.strictEqual(openLayersMock.tileSourceChanges.length, 0, 'tile layer does not receive another source');
                done();
            });
            map.option('type', 'satellite');
        });
    });
    QUnit.test('missing config for a new type preserves the current tile source', function(assert) {
        const done = assert.async();
        const initialized = $.Deferred();
        const log = sinon.stub(errors, 'log');
        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: type => type === 'roadmap' ? {
                    url: 'https://roadmap.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                } : null
            },
            onReady: () => initialized.resolve()
        }).dxMap('instance');
        initialized.done(() => {
            const originalSource = openLayersMock.tileLayer.source;
            map.option('onUpdated', () => {
                assert.strictEqual(openLayersMock.tileLayer.source, originalSource, 'current source is preserved');
                assert.ok(log.calledWith('W1030'), 'W1030 is logged');
                log.restore();
                done();
            });
            map.option('type', 'satellite');
        });
    });
    QUnit.test('tile source creation failure preserves the current source', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        const firstOptions = {
            attribution: 'Example attribution',
            maxZoom: 19,
            url: 'https://roadmap.example.com/{z}/{x}/{y}.png'
        };
        engineMap.replaceTileLayer(firstOptions);
        const originalSource = openLayersMock.tileLayer.source;
        openLayersMock.throwOnTileSource = true;
        assert.throws(() => engineMap.replaceTileLayer({
            ...firstOptions,
            url: 'https://satellite.example.com/{z}/{x}/{y}.png'
        }), /Tile source creation failed/, 'source error is propagated');
        assert.strictEqual(openLayersMock.tileLayer.source, originalSource, 'current source is preserved');
        engineMap.dispose();
    });
    QUnit.test('changing providerConfig recreates the map with the new tile server', function(assert) {
        const done = assert.async();
        const initialized = $.Deferred();
        let originalMap;
        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://first.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: e => {
                originalMap = e.originalMap;
                initialized.resolve();
            }
        }).dxMap('instance');
        initialized.done(() => {
            map.option('onReady', e => {
                assert.notStrictEqual(e.originalMap, originalMap, 'map is recreated');
                assert.strictEqual(openLayersMock.tileSourceOptions.url, 'https://second.example.com/{z}/{x}/{y}.png', 'new tile server is used');
                done();
            });
            map.option('providerConfig', {
                tileServer: {
                    url: 'https://second.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            });
        });
    });
});
QUnit.module('OSM: initial view', moduleConfig, () => {
    QUnit.test('default center, zoom, and map type are applied', function(assert) {
        const done = assert.async();
        const tileServer = sinon.spy(() => ({
            url: 'https://tiles.example.com/{z}/{x}/{y}.png',
            attribution: 'Example attribution'
        }));
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.viewCenter, [0, 0], 'default center is applied');
                assert.strictEqual(openLayersMock.viewZoom, 1, 'default zoom is applied');
                assert.ok(tileServer.calledOnceWithExactly('roadmap'), 'default map type is applied');
                done();
            }
        });
    });
    QUnit.test('center and fractional zoom are applied to the OpenLayers view', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            center: {
                lat: 40.74,
                lng: -73.98
            },
            zoom: 12.5,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                const lastProjectedCoordinate = openLayersMock.projectedCoordinates[openLayersMock.projectedCoordinates.length - 1];
                assert.ok(openLayersMock.projectedCoordinates.length > 0, 'projection API is called');
                assert.deepEqual(lastProjectedCoordinate, [-73.98, 40.74], 'longitude and latitude are passed to the projection API');
                assert.deepEqual(openLayersMock.viewCenter, [-73.98, 40.74], 'projected center is applied');
                assert.strictEqual(openLayersMock.viewZoom, 12.5, 'fractional zoom is applied');
                done();
            }
        });
    });
    QUnit.test('changing center preserves the current map zoom', function(assert) {
        const done = assert.async();
        const initialized = $.Deferred();
        const map = $('#map').dxMap({
            provider: 'osm',
            center: {
                lat: 40.74,
                lng: -73.98
            },
            zoom: 12,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => initialized.resolve()
        }).dxMap('instance');
        initialized.done(() => {
            openLayersMock.mapInstance.getView().setZoom(14);
            map.option('onUpdated', () => {
                assert.strictEqual(openLayersMock.viewZoom, 14, 'current zoom is preserved');
                done();
            });
            map.option('center', {
                lat: 40.75,
                lng: -73.97
            });
        });
    });
    QUnit.test('changing zoom applies a fractional value and preserves center', function(assert) {
        const done = assert.async();
        const initialized = $.Deferred();
        const map = $('#map').dxMap({
            provider: 'osm',
            center: {
                lat: 40.74,
                lng: -73.98
            },
            zoom: 12,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => initialized.resolve()
        }).dxMap('instance');
        initialized.done(() => {
            const center = [...openLayersMock.viewCenter];
            const centerSetCount = openLayersMock.viewCenterSetCount;
            map.option('onUpdated', () => {
                assert.strictEqual(openLayersMock.viewZoom, 12.5, 'fractional zoom is applied');
                assert.deepEqual(openLayersMock.viewCenter, center, 'center value is preserved');
                assert.strictEqual(openLayersMock.viewCenterSetCount, centerSetCount, 'center is not reapplied');
                done();
            });
            map.option('zoom', 12.5);
        });
    });
});
