import $ from 'jquery';

import OsmProvider from '__internal/ui/map/provider.dynamic.osm';
import { setRegisteredMapEngine } from '__internal/ui/map/provider.dynamic.osm.engine';
import { createOpenLayersEngine } from '__internal/ui/map/provider.dynamic.osm.openlayers';
import localization from 'localization';
import errors from 'ui/widget/ui.errors';

import 'ui/map';

let openLayersMock;
const resetOpenLayersMock = () => {
    Object.assign(openLayersMock, {
        addedControls: [],
        addedOverlays: [],
        addedTileLayers: [],
        controlOptions: null,
        fitZoom: undefined,
        fitOptions: null,
        fittedExtent: null,
        getOverlayRect: null,
        interactionOptions: null,
        interactions: [],
        interactionStateChanges: [],
        mapCreated: false,
        mapInstance: null,
        mapOptions: null,
        mapResized: false,
        mapTarget: null,
        onInteractionStateChanged: null,
        overlayOptions: [],
        overlayContainer: null,
        overlayContainerStopEvent: null,
        overlayPositionChanges: [],
        projectedCoordinates: [],
        removedControls: [],
        removedLayers: [],
        removedOverlays: [],
        throwOnTileSource: false,
        tileLayer: null,
        tileLayerOptions: null,
        tileSourceChanges: [],
        tileSourceOptions: null,
        transformedCoordinates: [],
        transformedExtents: [],
        userProjection: null,
        viewCenter: null,
        viewCenterSetCount: 0,
        viewExtent: [-74100, 40600, -73800, 40900],
        viewOptions: null,
        viewZoom: null,
        viewZoomSetCount: 0,
        zoomControlCreatedCount: 0
    });
};
const onInteractionStates = (expectedStates, callback) => {
    openLayersMock.onInteractionStateChanged = () => {
        const actualStates = openLayersMock.interactions.map(interaction => interaction.getActive());
        const stateMatches = actualStates.length === expectedStates.length && actualStates.every((state, index) => state === expectedStates[index]);
        if(stateMatches) {
            openLayersMock.onInteractionStateChanged = null;
            callback();
        }
    };
};
const moduleConfig = {
    beforeEach(assert) {
        const setup = () => {
            setRegisteredMapEngine(undefined);
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
        setRegisteredMapEngine(undefined);
        window.ol = openLayersMock;
    }
};
const createProvider = () => new OsmProvider({
    option: () => ({
        providerConfig: {}
    })
}, null);
const getOpenLayersKeyboardTarget = () => openLayersMock.mapOptions.keyboardEventTarget;
const getOpenLayersMapTarget = () => openLayersMock.mapOptions.target;
QUnit.module('OSM: map loading', moduleConfig, () => {
    QUnit.test('registered OpenLayers engine takes priority over window.ol', function(assert) {
        const done = assert.async();
        const engine = createOpenLayersEngine(openLayersMock);
        const provider = createProvider();
        setRegisteredMapEngine(engine);
        provider._loadImpl().then(() => {
            assert.strictEqual(provider._engine, engine, 'registered engine is selected');
            done();
        });
    });
    QUnit.test('map initializes with a registered OpenLayers engine when window.ol is missing', function(assert) {
        const done = assert.async();
        setRegisteredMapEngine(createOpenLayersEngine(openLayersMock));
        delete window.ol;
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
                assert.ok(openLayersMock.mapCreated, 'registered OpenLayers engine creates the map');
                assert.strictEqual(originalMap, openLayersMock.mapInstance, 'originalMap is returned');
                done();
            }
        });
    });
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
        assert.strictEqual(openLayersMock.mapOptions.keyboardEventTarget, container, 'map target receives keyboard events');
        engineMap.dispose();
        assert.strictEqual(container.getAttribute('tabindex'), null, 'added tabindex is removed on dispose');
    });
    QUnit.test('OpenLayers interactions are configured for dxMap', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        assert.deepEqual(openLayersMock.interactionOptions, {
            altShiftDragRotate: false,
            onFocusOnly: false,
            pinchRotate: false
        }, 'pointer interactions work without focus and cannot rotate the map');
        engineMap.dispose();
    });
    QUnit.test('OpenLayers controls are configured for the tiles stage', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        assert.deepEqual(openLayersMock.controlOptions, {
            attribution: true,
            rotate: false,
            zoom: false
        }, 'only the attribution control remains enabled');
        assert.strictEqual(openLayersMock.addedControls.length, 0, 'zoom control is not added by default');
        engineMap.dispose();
    });
    QUnit.test('OpenLayers map target is the keyboard target in Shadow DOM', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const host = document.createElement('div');
        const shadowRoot = host.attachShadow({
            mode: 'open'
        });
        const container = document.createElement('div');
        shadowRoot.appendChild(container);
        const engineMap = engine.createMap(container);
        assert.strictEqual(host.getAttribute('tabindex'), null, 'Shadow DOM host is unchanged');
        assert.strictEqual(container.getAttribute('tabindex'), '0', 'map target is focusable');
        assert.strictEqual(openLayersMock.mapOptions.keyboardEventTarget, container, 'map target receives keyboard events');
        engineMap.dispose();
        assert.strictEqual(container.getAttribute('tabindex'), null, 'added map target tabindex is removed on dispose');
    });
    QUnit.test('owned inert attribute is removed on dispose', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const container = document.createElement('div');
        const engineMap = engine.createMap(container);
        engineMap.setDisabled(true);
        assert.ok(container.hasAttribute('inert'), 'map target is inert while disabled');
        engineMap.dispose();
        assert.notOk(container.hasAttribute('inert'), 'owned inert attribute is removed');
    });
    QUnit.test('pre-existing inert attribute is preserved', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const container = document.createElement('div');
        container.setAttribute('inert', '');
        const engineMap = engine.createMap(container);

        engineMap.setDisabled(true);
        engineMap.setDisabled(false);
        assert.ok(container.hasAttribute('inert'), 'pre-existing inert attribute is preserved after enabling');

        engineMap.dispose();
        assert.ok(container.hasAttribute('inert'), 'pre-existing inert attribute is preserved on dispose');
    });
    QUnit.test('disabled map does not make its Shadow DOM host inert', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const host = document.createElement('div');
        const shadowRoot = host.attachShadow({
            mode: 'open'
        });
        const container = document.createElement('div');
        const sibling = document.createElement('button');
        shadowRoot.append(container, sibling);
        const engineMap = engine.createMap(container);
        engineMap.setDisabled(true);
        assert.ok(container.hasAttribute('inert'), 'map container is inert');
        assert.notOk(host.hasAttribute('inert'), 'Shadow DOM host remains interactive');
        assert.notOk(sibling.hasAttribute('inert'), 'sibling remains interactive');
        assert.strictEqual(container.getAttribute('tabindex'), null, 'owned map target tabindex is removed');
        engineMap.setDisabled(false);
        assert.notOk(container.hasAttribute('inert'), 'map container becomes interactive');
        assert.strictEqual(container.getAttribute('tabindex'), '0', 'owned map target tabindex is restored');
        engineMap.dispose();
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
    QUnit.test('map initializes after OpenLayers is loaded and repaint is called', function(assert) {
        const done = assert.async();
        delete window.ol;
        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            }
        }).dxMap('instance');

        map._lastAsyncAction.then(() => {
            assert.ok(false, 'initialization should reject');
            done();
        }, error => {
            assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');

            window.ol = openLayersMock;
            map.repaint();

            map._lastAsyncAction.then(() => {
                assert.ok(openLayersMock.mapCreated, 'OpenLayers creates the map after repaint');
                done();
            }, repaintError => {
                assert.ok(false, `repaint failed: ${repaintError.message}`);
                done();
            });
        });
    });
    QUnit.test('load rejects with E1069 when the OpenLayers ImageTile API is missing', function(assert) {
        const done = assert.async();
        const provider = createProvider();
        window.ol = Object.assign({}, openLayersMock, {
            source: {}
        });
        provider._loadImpl().then(() => {
            assert.ok(false, 'load should reject');
            done();
        }, error => {
            assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');
            done();
        });
    });
    QUnit.test('load rejects with E1069 when the OpenLayers Overlay API is missing', function(assert) {
        const done = assert.async();
        const provider = createProvider();
        window.ol = Object.assign({}, openLayersMock);
        delete window.ol.Overlay;
        provider._loadImpl().then(() => {
            assert.ok(false, 'load should reject');
            done();
        }, error => {
            assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');
            done();
        });
    });
    ['getUserProjection', 'toLonLat', 'transform', 'transformExtent'].forEach(apiName => {
        QUnit.test(`load rejects with E1069 when the OpenLayers ${apiName} API is missing`, function(assert) {
            const done = assert.async();
            const provider = createProvider();
            const projectionApi = Object.assign({}, openLayersMock.proj);
            delete projectionApi[apiName];
            window.ol = Object.assign({}, openLayersMock, {
                proj: projectionApi
            });
            provider._loadImpl().then(() => {
                assert.ok(false, 'load should reject');
                done();
            }, error => {
                assert.strictEqual(error.message, errors.Error('E1069').message, 'E1069 is returned');
                done();
            });
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
    QUnit.test('tileServer callback can return undefined on initialization', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: () => undefined
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
                    url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png?mirror={s}',
                    attribution: 'Example attribution',
                    subdomains: 'ab'
                }
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.tileSourceOptions.url, ['https://a.tiles.example.com/{z}/{x}/{y}.png?mirror=a', 'https://b.tiles.example.com/{z}/{x}/{y}.png?mirror=b'], 'all subdomain placeholders are expanded');
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
            const provider = new OsmProvider({
                option: () => ({
                    providerConfig: {
                        tileServer: {
                            url: 'https://{s}.tiles.example.com/{z}/{x}/{y}.png',
                            attribution: 'Example attribution',
                            subdomains: value
                        }
                    }
                })
            }, null);
            const options = provider._resolveTileLayerOptions('roadmap');
            const valueType = Array.isArray(value) ? 'array' : 'string';

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
                } : undefined
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
                assert.deepEqual(openLayersMock.viewCenter, [-73980, 40740], 'projected center is applied');
                assert.strictEqual(openLayersMock.viewZoom, 12.5, 'fractional zoom is applied');
                assert.strictEqual(openLayersMock.viewCenterSetCount, 0, 'initial center is not applied twice');
                assert.strictEqual(openLayersMock.viewZoomSetCount, 0, 'initial zoom is not applied twice');
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
QUnit.module('OSM: location calculation', moduleConfig, () => {
    const tileServer = {
        url: 'https://tiles.example.com/{z}/{x}/{y}.png',
        attribution: 'Example attribution'
    };
    QUnit.test('calculateLocation resolves a string center', function(assert) {
        const done = assert.async();
        const calculateLocation = sinon.spy(query => Promise.resolve({
            lat: 40.74,
            lng: -73.98
        }));
        $('#map').dxMap({
            provider: 'osm',
            center: 'New York',
            providerConfig: {
                tileServer,
                calculateLocation
            },
            onReady: () => {
                assert.ok(calculateLocation.calledOnceWithExactly('New York'), 'raw query is passed to the callback');
                assert.deepEqual(openLayersMock.viewCenter, [-73980, 40740], 'calculated center is applied');
                done();
            }
        });
    });
    QUnit.test('numeric string center does not call calculateLocation', function(assert) {
        const done = assert.async();
        const calculateLocation = sinon.spy(() => Promise.resolve({
            lat: 0,
            lng: 0
        }));
        $('#map').dxMap({
            provider: 'osm',
            center: '40.74, -73.98',
            providerConfig: {
                tileServer,
                calculateLocation
            },
            onReady: () => {
                assert.ok(calculateLocation.notCalled, 'coordinate string is resolved locally');
                assert.deepEqual(openLayersMock.viewCenter, [-73980, 40740], 'coordinate string is applied');
                done();
            }
        });
    });
    QUnit.test('missing calculateLocation logs W1031 and uses the default location', function(assert) {
        const done = assert.async();
        const log = sinon.stub(errors, 'log');
        const provider = createProvider();
        provider._resolveLocation('Unknown place').then(location => {
            assert.deepEqual(location, {
                lat: 0,
                lng: 0
            }, 'default location is returned');
            assert.ok(log.calledOnceWithExactly('W1031'), 'W1031 is logged');
            log.restore();
            done();
        });
    });
    QUnit.test('successful calculated locations are cached', function(assert) {
        const done = assert.async();
        const calculateLocation = sinon.spy(() => Promise.resolve({
            lat: 40.74,
            lng: -73.98
        }));
        const provider = new OsmProvider({
            option: () => ({
                providerConfig: {
                    calculateLocation
                }
            })
        }, null);
        provider._resolveLocation('New York').then(() => provider._resolveLocation('New York')).then(location => {
            assert.deepEqual(location, {
                lat: 40.74,
                lng: -73.98
            }, 'cached location is returned');
            assert.ok(calculateLocation.calledOnce, 'callback is called once');
            done();
        });
    });
    QUnit.test('concurrent calculations for the same location share one request', function(assert) {
        const done = assert.async();
        let resolveLocation;
        const locationPromise = new Promise(resolve => {
            resolveLocation = resolve;
        });
        const calculateLocation = sinon.spy(() => locationPromise);
        const provider = new OsmProvider({
            option: () => ({
                providerConfig: {
                    calculateLocation
                }
            })
        }, null);
        const first = provider._resolveLocation('New York');
        const second = provider._resolveLocation('New York');
        resolveLocation({
            lat: 40.74,
            lng: -73.98
        });
        Promise.all([first, second]).then(locations => {
            assert.deepEqual(locations, [{
                lat: 40.74,
                lng: -73.98
            }, {
                lat: 40.74,
                lng: -73.98
            }], 'both callers receive the calculated location');
            assert.ok(calculateLocation.calledOnce, 'callback is called once');
            done();
        });
    });
    QUnit.test('an invalid callback result is not cached', function(assert) {
        const done = assert.async();
        const calculateLocation = sinon.stub();
        calculateLocation.onFirstCall().returns(Promise.resolve(undefined));
        calculateLocation.onSecondCall().returns(Promise.resolve({
            lat: 40.74,
            lng: -73.98
        }));
        const provider = new OsmProvider({
            option: () => ({
                providerConfig: {
                    calculateLocation
                }
            })
        }, null);
        provider._resolveLocation('New York').then(firstLocation => {
            assert.deepEqual(firstLocation, {
                lat: 0,
                lng: 0
            }, 'invalid result uses the default location');
            return provider._resolveLocation('New York');
        }).then(secondLocation => {
            assert.deepEqual(secondLocation, {
                lat: 40.74,
                lng: -73.98
            }, 'callback is retried');
            assert.ok(calculateLocation.calledTwice, 'invalid result is not cached');
            done();
        });
    });
    QUnit.test('a rejected callback result is not cached', function(assert) {
        const done = assert.async();
        const calculateLocation = sinon.stub();
        calculateLocation.onFirstCall().returns(Promise.reject(new Error('service unavailable')));
        calculateLocation.onSecondCall().returns(Promise.resolve({
            lat: 40.74,
            lng: -73.98
        }));
        const provider = new OsmProvider({
            option: () => ({
                providerConfig: {
                    calculateLocation
                }
            })
        }, null);
        provider._resolveLocation('New York').then(firstLocation => {
            assert.deepEqual(firstLocation, {
                lat: 0,
                lng: 0
            }, 'rejection uses the default location');
            return provider._resolveLocation('New York');
        }).then(secondLocation => {
            assert.deepEqual(secondLocation, {
                lat: 40.74,
                lng: -73.98
            }, 'callback is retried');
            assert.ok(calculateLocation.calledTwice, 'rejected result is not cached');
            done();
        });
    });
    QUnit.test('a pending center calculation does not update a cleaned provider', function(assert) {
        const done = assert.async();
        let resolveLocation;
        const locationPromise = new Promise(resolve => {
            resolveLocation = resolve;
        });
        const setOptionSilent = sinon.spy();
        const setView = sinon.spy();
        const provider = new OsmProvider({
            option: () => ({
                center: 'New York',
                providerConfig: {
                    calculateLocation: () => locationPromise
                }
            }),
            setOptionSilent
        }, null);
        provider._engineMap = {
            dispose: sinon.spy(),
            setView
        };
        provider._markers = [];
        const update = provider.updateCenter();
        provider.clean();
        resolveLocation({
            lat: 40.74,
            lng: -73.98
        });
        update.then(() => {
            assert.ok(setView.notCalled, 'the disposed engine map is not updated');
            assert.ok(setOptionSilent.notCalled, 'the stale center is not written to the component');
            done();
        });
    });
    QUnit.test('an older center calculation does not overwrite a newer center', function(assert) {
        const done = assert.async();
        let resolveFirst;
        let resolveSecond;
        const firstLocation = new Promise(resolve => {
            resolveFirst = resolve;
        });
        const secondLocation = new Promise(resolve => {
            resolveSecond = resolve;
        });
        const options = {
            center: 'First',
            providerConfig: {
                calculateLocation: query => query === 'First' ? firstLocation : secondLocation
            }
        };
        const setView = sinon.spy();
        const setOptionSilent = sinon.spy((name, value) => {
            options[name] = value;
        });
        const provider = new OsmProvider({
            option: () => options,
            setOptionSilent
        }, null);
        provider._engineMap = {
            setView
        };
        const firstUpdate = provider.updateCenter();
        options.center = 'Second';
        resolveFirst({
            lat: 1,
            lng: 2
        });
        firstUpdate.then(() => {
            assert.ok(setView.notCalled, 'superseded center is not applied');
            assert.ok(setOptionSilent.notCalled, 'superseded center is not written to the component');
            const secondUpdate = provider.updateCenter();
            resolveSecond({
                lat: 3,
                lng: 4
            });
            return secondUpdate;
        }).then(() => {
            assert.ok(setView.calledOnceWithExactly({
                center: {
                    lat: 3,
                    lng: 4
                }
            }), 'latest center is applied');
            assert.ok(setOptionSilent.calledOnceWithExactly('center', {
                lat: 3,
                lng: 4
            }), 'latest center is written to the component');
            done();
        });
    });
    QUnit.test('older calculated bounds are not applied after the option changes', function(assert) {
        const done = assert.async();
        let resolveFirst;
        const firstLocation = new Promise(resolve => {
            resolveFirst = resolve;
        });
        const firstBounds = {
            northEast: 'First',
            southWest: [40, -74]
        };
        const options = {
            bounds: firstBounds,
            providerConfig: {
                calculateLocation: () => firstLocation
            }
        };
        const fitBounds = sinon.spy();
        const provider = new OsmProvider({
            option: () => options
        }, null);
        provider._engineMap = {
            fitBounds
        };
        const firstUpdate = provider.updateBounds();
        firstBounds.northEast = [41, -73];
        resolveFirst({
            lat: 42,
            lng: -72
        });
        firstUpdate.then(() => {
            assert.ok(fitBounds.notCalled, 'superseded bounds are not applied');
            return provider.updateBounds();
        }).then(() => {
            assert.ok(fitBounds.calledOnceWithExactly({
                northEast: {
                    lat: 41,
                    lng: -73
                },
                southWest: {
                    lat: 40,
                    lng: -74
                }
            }), 'latest bounds are applied');
            done();
        });
    });
    QUnit.test('a pending marker calculation does not add a marker after cleanup', function(assert) {
        const done = assert.async();
        let resolveLocation;
        const locationPromise = new Promise(resolve => {
            resolveLocation = resolve;
        });
        const addMarker = sinon.spy();
        const provider = new OsmProvider({
            option: () => ({
                autoAdjust: false,
                providerConfig: {
                    calculateLocation: () => locationPromise
                }
            })
        }, null);
        provider._engineMap = {
            addMarker,
            dispose: sinon.spy()
        };
        provider._markers = [];
        const add = provider.addMarkers([{
            location: 'New York'
        }]);
        provider.clean();
        resolveLocation({
            lat: 40.74,
            lng: -73.98
        });
        add.then(result => {
            assert.deepEqual(result, [false, []], 'the stale marker operation is canceled');
            assert.ok(addMarker.notCalled, 'no marker is added to the disposed engine map');
            done();
        });
    });
});
QUnit.module('OSM: markers', moduleConfig, () => {
    const tileServer = {
        url: 'https://tiles.example.com/{z}/{x}/{y}.png',
        attribution: 'Example attribution'
    };
    QUnit.test('initial marker uses an OpenLayers overlay', function(assert) {
        const done = assert.async();
        const marker = {
            location: {
                lat: 40.74,
                lng: -73.98
            }
        };
        let markerAddedEvent;
        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            markers: [marker],
            providerConfig: {
                tileServer
            },
            onMarkerAdded: e => {
                markerAddedEvent = e;
            },
            onReady: () => {
                const overlay = openLayersMock.addedOverlays[0];
                const element = overlay.options.element;
                assert.strictEqual(openLayersMock.addedOverlays.length, 1, 'one overlay is added');
                assert.deepEqual(overlay.options.position, [-73980, 40740], 'marker location is projected');
                assert.strictEqual(overlay.options.positioning, 'bottom-center', 'marker tip is anchored to its location');
                assert.strictEqual(overlay.options.stopEvent, false, 'map interactions remain available over the marker');
                assert.ok(element.classList.contains('dx-map-marker-default'), 'default marker is rendered');
                assert.strictEqual(element.style.width, '44px', 'default marker keeps a sufficiently large hit area');
                assert.strictEqual(element.style.height, '44px', 'default marker keeps a sufficiently large hit area');
                const markerSvg = element.querySelector('.dx-map-marker-default-icon');
                assert.ok(markerSvg, 'default marker SVG is rendered');
                assert.strictEqual(markerSvg.getAttribute('viewBox'), '5 2 14 20', 'existing pinmap geometry is fitted to the marker');
                assert.strictEqual(markerSvg.getAttribute('width'), '24.5', 'default marker width matches the standard marker size');
                assert.strictEqual(markerSvg.getAttribute('height'), '36.5', 'default marker height matches the standard marker size');
                const markerBody = element.querySelector('.dx-map-marker-default-body');
                const markerCenter = element.querySelector('.dx-map-marker-default-center');
                assert.ok(markerBody, 'marker body is rendered');
                assert.strictEqual(markerBody.getAttribute('fill'), '#2d7fbd', 'marker body color does not depend on the theme');
                assert.strictEqual(markerBody.getAttribute('stroke'), '#fff', 'marker outline does not depend on the theme');
                assert.strictEqual(markerBody.getAttribute('stroke-width'), '0.5', 'marker outline does not obscure its body');
                assert.ok(markerCenter, 'marker center is rendered');
                assert.strictEqual(markerCenter.getAttribute('fill'), '#fff', 'marker center does not depend on the theme');
                assert.strictEqual(markerAddedEvent.options, marker, 'marker options are passed to onMarkerAdded');
                assert.strictEqual(markerAddedEvent.originalMarker, overlay, 'OpenLayers overlay is exposed as originalMarker');
                done();
            }
        });
    });
    QUnit.test('marker iconSrc takes priority over markerIconSrc', function(assert) {
        const done = assert.async();
        const defaultLocale = localization.locale();
        const markerAriaLabel = 'Localized map marker';
        localization.loadMessages({
            'test': {
                'dxMap-markerAriaLabel': markerAriaLabel
            }
        });
        localization.locale('test');
        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            markerIconSrc: 'global-marker.png',
            markers: [{
                location: [40.74, -73.98]
            }, {
                location: [40.75, -73.97],
                iconSrc: 'local-marker.png',
                onClick: () => {}
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                try {
                    const globalIcon = openLayersMock.addedOverlays[0].options.element;
                    const localIcon = openLayersMock.addedOverlays[1].options.element;
                    assert.strictEqual(globalIcon.getAttribute('src'), 'global-marker.png', 'global marker icon is applied');
                    assert.strictEqual(globalIcon.getAttribute('alt'), '', 'non-interactive custom marker is decorative');
                    assert.strictEqual(localIcon.getAttribute('src'), 'local-marker.png', 'marker icon overrides the global icon');
                    assert.notOk(localIcon.hasAttribute('width'), 'custom marker keeps its natural width');
                    assert.notOk(localIcon.hasAttribute('height'), 'custom marker keeps its natural height');
                    assert.strictEqual(localIcon.getAttribute('alt'), '', 'interactive custom marker image is decorative');
                    assert.strictEqual(localIcon.getAttribute('aria-label'), markerAriaLabel, 'interactive custom marker has a localized accessible name');
                    assert.strictEqual(localIcon.draggable, false, 'custom marker does not start native image dragging');
                } finally {
                    localization.locale(defaultLocale);
                    done();
                }
            }
        });
    });
    QUnit.test('HTML marker and offset are passed to OpenLayers', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            markers: [{
                location: [40.74, -73.98],
                html: '<span class="custom-marker">A</span>',
                htmlOffset: {
                    left: 5,
                    top: 7
                }
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                const options = openLayersMock.addedOverlays[0].options;
                assert.strictEqual(options.element.firstElementChild.className, 'custom-marker', 'custom HTML is rendered');
                assert.deepEqual(options.offset, [5, 7], 'HTML offset is applied');
                assert.strictEqual(options.positioning, 'top-left', 'HTML offset starts at the marker location');
                done();
            }
        });
    });
    QUnit.test('marker click calls onClick with the resolved location', function(assert) {
        const done = assert.async();
        const onClick = sinon.spy();
        const onMapClick = sinon.spy();
        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            markers: [{
                location: [40.74, -73.98],
                onClick
            }],
            providerConfig: {
                tileServer
            },
            onClick: onMapClick,
            onReady: () => {
                const overlayOptions = openLayersMock.addedOverlays[0].options;
                const element = overlayOptions.element;
                const parentClick = sinon.spy();
                element.parentElement.addEventListener('click', parentClick);
                assert.strictEqual(element.getAttribute('role'), 'button', 'clickable marker has button semantics');
                assert.strictEqual(element.getAttribute('aria-label'), 'Map marker', 'clickable marker has an accessible name');
                assert.strictEqual(element.getAttribute('tabindex'), '0', 'clickable marker is keyboard-focusable');
                assert.strictEqual(overlayOptions.stopEvent, false, 'map wheel and drag interactions remain available over a clickable marker');
                element.click();
                assert.ok(onClick.calledOnce, 'marker click action is fired');
                assert.ok(parentClick.notCalled, 'marker click does not bubble to the map container');
                assert.deepEqual(onClick.firstCall.args[0].location, {
                    lat: 40.74,
                    lng: -73.98
                }, 'resolved location is passed');
                const markerPointerEvent = new PointerEvent('pointerup', {
                    bubbles: true
                });
                element.dispatchEvent(markerPointerEvent);
                openLayersMock.mapInstance.trigger('click', {
                    coordinate: [-73980, 40740],
                    originalEvent: markerPointerEvent
                });
                assert.ok(onMapClick.notCalled, 'marker pointer event does not fire the map click action');
                element.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    bubbles: true
                }));
                assert.ok(onClick.calledTwice, 'marker can be activated from the keyboard');
                done();
            }
        });
    });
    QUnit.test('clickable plain HTML marker is keyboard-accessible', function(assert) {
        const done = assert.async();
        const onClick = sinon.spy();
        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            markers: [{
                location: [40.74, -73.98],
                html: '<span>Custom marker</span>',
                onClick
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                const element = openLayersMock.addedOverlays[0].options.element;
                assert.strictEqual(element.getAttribute('role'), 'button', 'wrapper has button semantics');
                assert.strictEqual(element.getAttribute('tabindex'), '0', 'wrapper is keyboard-focusable');
                element.dispatchEvent(new KeyboardEvent('keydown', {
                    key: ' ',
                    bubbles: true,
                    repeat: true
                }));
                assert.ok(onClick.notCalled, 'repeated Space keydown does not activate the marker');
                element.dispatchEvent(new KeyboardEvent('keyup', {
                    key: ' ',
                    bubbles: true
                }));
                assert.ok(onClick.calledOnce, 'HTML marker can be activated from the keyboard');
                done();
            }
        });
    });
    QUnit.test('interactive HTML marker content does not forward keyboard commands to the map', function(assert) {
        const done = assert.async();
        const onClick = sinon.spy();
        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            markers: [{
                location: [40.74, -73.98],
                html: '<button type="button">Custom marker</button>',
                onClick
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                const keyboardTarget = getOpenLayersKeyboardTarget();
                const mapKeydown = sinon.spy();
                const button = openLayersMock.addedOverlays[0].options.element.querySelector('button');
                keyboardTarget.addEventListener('keydown', mapKeydown);
                button.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'ArrowRight',
                    bubbles: true
                }));
                assert.ok(mapKeydown.notCalled, 'the map does not receive the marker control keydown');
                button.click();
                assert.ok(onClick.calledOnce, 'the marker control keeps its click behavior');
                keyboardTarget.removeEventListener('keydown', mapKeydown);
                done();
            }
        });
    });
    QUnit.test('addMarker and removeMarker manage the OpenLayers overlay and events', function(assert) {
        const done = assert.async();
        const marker = {
            location: [40.74, -73.98]
        };
        const onMarkerAdded = sinon.spy();
        const onMarkerRemoved = sinon.spy();
        const map = $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            providerConfig: {
                tileServer
            },
            onMarkerAdded,
            onMarkerRemoved,
            onReady: () => {
                map.addMarker(marker).done(originalMarker => {
                    assert.strictEqual(originalMarker, openLayersMock.addedOverlays[0], 'addMarker returns the overlay');
                    assert.ok(onMarkerAdded.calledOnce, 'onMarkerAdded is fired');
                    map.removeMarker(marker).done(() => {
                        assert.strictEqual(openLayersMock.removedOverlays[0], originalMarker, 'overlay is removed');
                        assert.ok(onMarkerRemoved.calledOnce, 'onMarkerRemoved is fired');
                        done();
                    });
                });
            }
        }).dxMap('instance');
    });
    QUnit.test('autoAdjust fits the view to markers', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            markers: [{
                location: [40.7, -74]
            }, {
                location: [40.8, -73.9]
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.fittedExtent, [-74000, 40700, -73900, 40800], 'marker bounds are fitted');
                assert.deepEqual(openLayersMock.fitOptions.padding, [44, 22, 0, 22], 'marker size is included in fit padding');
                done();
            }
        });
    });
    QUnit.test('autoAdjust measures HTML marker padding', function(assert) {
        const done = assert.async();
        openLayersMock.getOverlayRect = () => ({
            height: 60,
            width: 80
        });
        $('#map').dxMap({
            provider: 'osm',
            markers: [{
                location: [40.7, -74],
                html: '<span>A</span>',
                htmlOffset: {
                    left: 5,
                    top: 7
                }
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.fitOptions.padding, [0, 85, 67, 0], 'HTML size and offset are included in fit padding');
                done();
            }
        });
    });
    QUnit.test('autoAdjust refits the view after a custom marker image loads', function(assert) {
        const done = assert.async();
        let imageLoaded = false;
        openLayersMock.getOverlayRect = () => imageLoaded ? {
            height: 60,
            width: 80
        } : {
            height: 0,
            width: 0
        };
        $('#map').dxMap({
            provider: 'osm',
            markers: [{
                location: [40.7, -74],
                iconSrc: 'custom-marker.png'
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.fitOptions.padding, [41, 13, 0, 13], 'fallback size is used while the image loads');
                imageLoaded = true;
                openLayersMock.addedOverlays[0].options.element.dispatchEvent(new Event('load'));
                assert.deepEqual(openLayersMock.fitOptions.padding, [60, 40, 0, 40], 'loaded image size is included in fit padding');
                done();
            }
        });
    });
    QUnit.test('HTML marker padding is measured after a hidden map becomes visible', function(assert) {
        const done = assert.async();
        const container = document.createElement('div');
        container.style.display = 'none';
        $('#qunit-fixture').append(container);
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(container);
        openLayersMock.getOverlayRect = () => container.style.display === 'none' ? {
            height: 0,
            width: 0
        } : {
            height: 60,
            width: 80
        };
        engineMap.addMarker({
            html: '<span>A</span>',
            htmlOffset: {
                left: 5,
                top: 7
            },
            location: {
                lat: 40.7,
                lng: -74
            }
        });
        engineMap.fitBounds({
            northEast: {
                lat: 40.7,
                lng: -74
            },
            southWest: {
                lat: 40.7,
                lng: -74
            }
        }, {
            includeMarkerPadding: true
        });
        assert.deepEqual(openLayersMock.fitOptions.padding, [0, 30, 48, 0], 'fallback padding is used without layout');
        container.style.display = 'block';
        const provider = new OsmProvider({
            option: () => ({
                autoAdjust: true,
                zoom: 1
            }),
            setOptionSilent: () => {}
        }, null);
        provider._engineMap = engineMap;
        provider._markers = [{
            location: {
                lat: 40.7,
                lng: -74
            },
            options: {}
        }];
        provider._routes = [];
        provider.updateDimensions().then(() => {
            assert.deepEqual(openLayersMock.fitOptions.padding, [0, 85, 67, 0], 'provider refits after layout becomes available');
            engineMap.dispose();
            done();
        });
    });
    QUnit.test('autoAdjust keeps the current zoom when fitting would zoom in', function(assert) {
        const done = assert.async();
        openLayersMock.fitZoom = 15;
        $('#map').dxMap({
            provider: 'osm',
            zoom: 12,
            markers: [{
                location: [40.7, -74]
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.strictEqual(openLayersMock.viewZoom, 12, 'zoom is restored after fitting');
                assert.strictEqual(openLayersMock.viewZoomSetCount, 1, 'zoom is restored through the view API');
                done();
            }
        });
    });
    QUnit.test('autoAdjust updates the option when fitting zooms out', function(assert) {
        const done = assert.async();
        openLayersMock.fitZoom = 8;
        const map = $('#map').dxMap({
            provider: 'osm',
            zoom: 12,
            markers: [{
                location: [40.7, -74]
            }, {
                location: [41.7, -73]
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.strictEqual(map.option('zoom'), 8, 'fitted zoom is synchronized with the component');
                done();
            }
        }).dxMap('instance');
    });
    QUnit.test('autoAdjust uses the shortest extent across the antimeridian', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            markers: [{
                location: [10, 179]
            }, {
                location: [20, -179]
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.fittedExtent, [179000, 10000, 181000, 20000], 'wrapped marker bounds are fitted');
                assert.deepEqual(openLayersMock.addedOverlays[1].options.position, [181000, 20000], 'wrapped marker is moved into the fitted world');
                openLayersMock.mapInstance.getView().setCenter([-179000, 15000]);
                assert.deepEqual(openLayersMock.addedOverlays.map(({
                    options
                }) => options.position), [[-181000, 10000], [-179000, 20000]], 'markers follow the view into an adjacent world');
                done();
            }
        });
    });
    QUnit.test('autoAdjust selects the shortest extent for three markers', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            markers: [{
                location: [10, 0]
            }, {
                location: [20, -160]
            }, {
                location: [30, 100]
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.fittedExtent, [0, 10000, 200000, 30000], 'largest circular gap is excluded from the fitted extent');
                assert.deepEqual(openLayersMock.addedOverlays.map(({
                    options
                }) => options.position), [[0, 10000], [200000, 20000], [100000, 30000]], 'all markers use the fitted world');
                done();
            }
        });
    });
    QUnit.test('autoAdjust false preserves the current view', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            autoAdjust: false,
            markers: [{
                location: [40.7, -74]
            }, {
                location: [40.8, -73.9]
            }],
            providerConfig: {
                tileServer
            },
            onReady: () => {
                assert.strictEqual(openLayersMock.fittedExtent, null, 'marker bounds are not fitted');
                done();
            }
        });
    });
});
QUnit.module('OSM: viewport and interactions', moduleConfig, () => {
    QUnit.test('focus options are applied to the OpenLayers keyboard target', function(assert) {
        const done = assert.async();
        const map = $('#map').dxMap({
            provider: 'osm',
            focusStateEnabled: false,
            tabIndex: 5,
            markers: [{
                location: [40.74, -73.98],
                onClick: () => {}
            }, {
                location: [40.75, -73.97],
                html: '<button type="button">Custom marker</button>',
                onClick: () => {}
            }],
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                const target = getOpenLayersKeyboardTarget();
                const markerElement = openLayersMock.addedOverlays[0].options.element;
                const customButton = openLayersMock.addedOverlays[1].options.element.querySelector('button');
                assert.strictEqual(target.getAttribute('tabindex'), null, 'focus is disabled on initialization');
                assert.strictEqual(markerElement.getAttribute('tabindex'), '-1', 'marker is removed from the tab order on initialization');
                assert.strictEqual(customButton.getAttribute('tabindex'), '-1', 'custom interactive content is removed from the tab order');
                map.option('onUpdated', () => {
                    assert.strictEqual(target.getAttribute('tabindex'), '5', 'configured tabIndex is applied');
                    assert.strictEqual(markerElement.getAttribute('tabindex'), '0', 'marker focus is enabled');
                    assert.strictEqual(customButton.getAttribute('tabindex'), null, 'custom interactive content returns to the tab order');
                    map.option('onUpdated', () => {
                        assert.strictEqual(target.getAttribute('tabindex'), '-1', 'runtime tabIndex is applied');
                        map.option('onUpdated', () => {
                            assert.strictEqual(target.getAttribute('tabindex'), null, 'runtime focus disabling is applied');
                            assert.strictEqual(markerElement.getAttribute('tabindex'), '-1', 'marker is removed from the tab order at runtime');
                            assert.strictEqual(customButton.getAttribute('tabindex'), '-1', 'custom interactive content leaves the tab order');
                            done();
                        });
                        map.option('focusStateEnabled', false);
                    });
                    map.option('tabIndex', -1);
                });
                map.option('focusStateEnabled', true);
            }
        }).dxMap('instance');
    });
    QUnit.test('OpenLayers view changes update center, fractional zoom, and bounds', function(assert) {
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
                const view = openLayersMock.mapInstance.getView();
                view.setCenter([-73980, 40740]);
                view.setZoom(12.5);
                const centerSetCount = openLayersMock.viewCenterSetCount;
                const zoomSetCount = openLayersMock.viewZoomSetCount;
                openLayersMock.viewExtent = [-74100, 40600, -73800, 40900];
                openLayersMock.mapInstance.trigger('moveend');
                assert.deepEqual(map.option('center'), {
                    lat: 40.74,
                    lng: -73.98
                }, 'center is synchronized');
                assert.strictEqual(map.option('zoom'), 12.5, 'fractional zoom is synchronized');
                assert.deepEqual(map.option('bounds'), {
                    northEast: {
                        lat: 40.9,
                        lng: -73.8
                    },
                    southWest: {
                        lat: 40.6,
                        lng: -74.1
                    }
                }, 'bounds are synchronized');
                assert.strictEqual(openLayersMock.viewCenterSetCount, centerSetCount, 'center is not written back to OpenLayers');
                assert.strictEqual(openLayersMock.viewZoomSetCount, zoomSetCount, 'zoom is not written back to OpenLayers');
                done();
            }
        }).dxMap('instance');
    });
    QUnit.test('OpenLayers click fires onClick with location and original event', function(assert) {
        const done = assert.async();
        const originalEvent = new PointerEvent('click');
        const map = $('#map').dxMap({
            provider: 'osm',
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onClick: event => {
                assert.strictEqual(event.component, map, 'component is passed');
                assert.deepEqual(event.location, {
                    lat: 40.74,
                    lng: -73.98
                }, 'location is normalized');
                assert.strictEqual(event.event, originalEvent, 'original event is passed');
                done();
            },
            onReady: () => {
                openLayersMock.mapInstance.trigger('click', {
                    coordinate: [-73980, 40740],
                    originalEvent
                });
            }
        }).dxMap('instance');
    });
    QUnit.test('OpenLayers click without a coordinate is ignored', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        const click = sinon.spy();
        engineMap.attachHandlers({
            click,
            viewChange: sinon.spy()
        });
        openLayersMock.mapInstance.trigger('click', {
            originalEvent: new PointerEvent('click')
        });
        assert.ok(click.notCalled, 'click handler is not called without a location');
        engineMap.dispose();
    });
    QUnit.test('OpenLayers user projection is honored for the initial view, synchronization, and bounds', function(assert) {
        const done = assert.async();
        openLayersMock.userProjection = 'EPSG:4326';
        const map = $('#map').dxMap({
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
                const view = openLayersMock.mapInstance.getView();
                assert.deepEqual(openLayersMock.viewCenter, [-73.98, 40.74], 'initial center uses the user projection');
                view.setCenter([-73.97, 40.75]);
                openLayersMock.viewExtent = [-74.1, 40.6, -73.8, 40.9];
                openLayersMock.mapInstance.trigger('moveend');
                assert.deepEqual(map.option('center'), {
                    lat: 40.75,
                    lng: -73.97
                }, 'center is synchronized from the user projection');
                assert.deepEqual(map.option('bounds'), {
                    northEast: {
                        lat: 40.9,
                        lng: -73.8
                    },
                    southWest: {
                        lat: 40.6,
                        lng: -74.1
                    }
                }, 'bounds are synchronized from the user projection');
                map.option('onUpdated', () => {
                    assert.deepEqual(openLayersMock.fittedExtent, [-74, 40.7, -73.9, 40.8], 'bounds are fitted in the user projection');
                    done();
                });
                map.option('bounds', {
                    northEast: {
                        lat: 40.8,
                        lng: -73.9
                    },
                    southWest: {
                        lat: 40.7,
                        lng: -74
                    }
                });
            }
        }).dxMap('instance');
    });
    QUnit.test('bounds crossing the antimeridian use the shorter wrapped extent', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            bounds: {
                northEast: {
                    lat: 10,
                    lng: -170
                },
                southWest: {
                    lat: -10,
                    lng: 170
                }
            },
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.fittedExtent, [170000, -10000, 190000, 10000], 'the wrapped 20 degree extent is fitted');
                done();
            }
        });
    });
    QUnit.test('OpenLayers wrapped view coordinates are normalized on synchronization', function(assert) {
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
                openLayersMock.mapInstance.getView().setCenter([190000, 0]);
                openLayersMock.viewExtent = [170000, -10000, 190000, 10000];
                openLayersMock.mapInstance.trigger('moveend');
                assert.deepEqual(map.option('center'), {
                    lat: 0,
                    lng: -170
                }, 'center longitude is normalized');
                assert.deepEqual(map.option('bounds'), {
                    northEast: {
                        lat: 10,
                        lng: -170
                    },
                    southWest: {
                        lat: -10,
                        lng: 170
                    }
                }, 'bounds preserve the antimeridian crossing');
                done();
            }
        }).dxMap('instance');
    });
    QUnit.test('controls option toggles the OpenLayers zoom control', function(assert) {
        const done = assert.async();
        const map = $('#map').dxMap({
            provider: 'osm',
            controls: true,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                assert.strictEqual(openLayersMock.addedControls.length, 1, 'zoom control is added on initialization');
                map.option('onUpdated', () => {
                    assert.strictEqual(openLayersMock.removedControls.length, 1, 'zoom control is removed');
                    map.option('onUpdated', () => {
                        assert.strictEqual(openLayersMock.addedControls.length, 2, 'zoom control is added again');
                        done();
                    });
                    map.option('controls', true);
                });
                map.option('controls', false);
            }
        }).dxMap('instance');
    });
    QUnit.test('disabled option restores the previous interaction states', function(assert) {
        const done = assert.async();
        const map = $('#map').dxMap({
            provider: 'osm',
            controls: true,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                assert.strictEqual(openLayersMock.addedControls.length, 1, 'zoom control is present');
                assert.deepEqual(openLayersMock.interactions.map(interaction => interaction.getActive()), [true, false], 'initial states are preserved');
                assert.notOk(getOpenLayersMapTarget().hasAttribute('inert'), 'map target is keyboard accessible');
                onInteractionStates([false, false], () => {
                    assert.deepEqual(openLayersMock.interactions.map(interaction => interaction.getActive()), [false, false], 'all interactions are disabled');
                    assert.ok(getOpenLayersMapTarget().hasAttribute('inert'), 'map target and controls are removed from keyboard navigation');
                    assert.strictEqual(getOpenLayersKeyboardTarget().getAttribute('tabindex'), null, 'owned keyboard target tabindex is removed');
                    onInteractionStates([true, false], () => {
                        assert.deepEqual(openLayersMock.interactions.map(interaction => interaction.getActive()), [true, false], 'previous states are restored');
                        assert.notOk(getOpenLayersMapTarget().hasAttribute('inert'), 'map target and controls return to keyboard navigation');
                        assert.strictEqual(getOpenLayersKeyboardTarget().getAttribute('tabindex'), '0', 'owned keyboard target tabindex is restored');
                        done();
                    });
                    map.option('disabled', false);
                });
                map.option('disabled', true);
            }
        }).dxMap('instance');
    });
    QUnit.test('disabled option is applied on initialization', function(assert) {
        const done = assert.async();
        onInteractionStates([false, false], () => {
            assert.strictEqual(openLayersMock.addedControls.length, 1, 'zoom control is present');
            assert.deepEqual(openLayersMock.interactions.map(interaction => interaction.getActive()), [false, false], 'all interactions are disabled');
            assert.ok(getOpenLayersMapTarget().hasAttribute('inert'), 'map target and controls are removed from keyboard navigation');
            assert.strictEqual(getOpenLayersKeyboardTarget().getAttribute('tabindex'), null, 'owned keyboard target tabindex is removed');
            map.option('onUpdated', done);
            map.option('disabled', false);
        });
        const map = $('#map').dxMap({
            provider: 'osm',
            controls: true,
            disabled: true,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            }
        }).dxMap('instance');
    });
    QUnit.test('bounds option fits the OpenLayers view on initialization and at runtime', function(assert) {
        const done = assert.async();
        const map = $('#map').dxMap({
            provider: 'osm',
            bounds: {
                northEast: {
                    lat: 40.8,
                    lng: -73.9
                },
                southWest: {
                    lat: 40.7,
                    lng: -74
                }
            },
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                assert.deepEqual(openLayersMock.fittedExtent, [-74000, 40700, -73900, 40800], 'initial bounds are fitted');
                assert.strictEqual(openLayersMock.fitOptions, undefined, 'OpenLayers selects the viewport size');
                map.option('onUpdated', () => {
                    assert.deepEqual(openLayersMock.fittedExtent, [-74100, 40600, -73800, 40900], 'runtime bounds are fitted');
                    done();
                });
                map.option('bounds', {
                    northEast: [40.9, -73.8],
                    southWest: [40.6, -74.1]
                });
            }
        }).dxMap('instance');
    });
    QUnit.test('incomplete bounds do not change the OpenLayers view', function(assert) {
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
                map.option('onUpdated', () => {
                    assert.strictEqual(openLayersMock.fittedExtent, null, 'view is not fitted without both bounds');
                    done();
                });
                map.option('bounds', {
                    northEast: {
                        lat: 40.8,
                        lng: -73.9
                    },
                    southWest: null
                });
            }
        }).dxMap('instance');
    });
    QUnit.test('RTL mode preserves viewport, overlay positioning, and keyboard behavior', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            center: {
                lat: 40.74,
                lng: -73.98
            },
            controls: true,
            markers: [{
                location: {
                    lat: 40.74,
                    lng: -73.98
                }
            }],
            rtlEnabled: true,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                assert.ok($('#map').hasClass('dx-rtl'), 'RTL mode is applied to the widget');
                assert.deepEqual(openLayersMock.viewCenter, [-73980, 40740], 'center coordinates are not mirrored');
                assert.strictEqual(openLayersMock.addedOverlays.length, 1, 'marker overlay remains available');
                assert.strictEqual(openLayersMock.overlayContainer.getAttribute('dir'), 'ltr', 'regular overlays use LTR coordinates');
                assert.strictEqual(openLayersMock.overlayContainerStopEvent.getAttribute('dir'), 'ltr', 'interactive overlays use LTR coordinates');
                assert.strictEqual(openLayersMock.addedControls.length, 1, 'zoom control remains available');
                assert.strictEqual(getOpenLayersKeyboardTarget().getAttribute('tabindex'), '0', 'map remains keyboard focusable');
                done();
            }
        });
    });
    QUnit.test('dispose detaches OpenLayers event handlers', function(assert) {
        const engine = createOpenLayersEngine(openLayersMock);
        const engineMap = engine.createMap(document.createElement('div'));
        const click = sinon.spy();
        const viewChange = sinon.spy();
        engineMap.attachHandlers({
            click,
            viewChange
        });
        engineMap.dispose();
        openLayersMock.mapInstance.trigger('click', {
            coordinate: [-73980, 40740]
        });
        openLayersMock.mapInstance.trigger('moveend');
        assert.ok(click.notCalled, 'click handler is detached');
        assert.ok(viewChange.notCalled, 'view change handler is detached');
    });
});
