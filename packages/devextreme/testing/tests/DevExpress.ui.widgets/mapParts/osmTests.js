import $ from 'jquery';

import OsmProvider from '__internal/ui/map/provider.dynamic.osm';
import { setRegisteredMapEngine } from '__internal/ui/map/provider.dynamic.osm.engine';
import { createOpenLayersEngine } from '__internal/ui/map/provider.dynamic.osm.openlayers';
import errors from 'ui/widget/ui.errors';

import 'ui/map';

let openLayersMock;
const resetOpenLayersMock = () => {
    Object.assign(openLayersMock, {
        addedControls: [],
        addedTileLayers: [],
        controlOptions: null,
        fitOptions: null,
        fittedExtent: null,
        interactionOptions: null,
        interactions: [],
        interactionStateChanges: [],
        mapCreated: false,
        mapInstance: null,
        mapOptions: null,
        mapResized: false,
        mapTarget: null,
        onInteractionStateChanged: null,
        projectedCoordinates: [],
        removedControls: [],
        removedLayers: [],
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
        const stateMatches = actualStates.length === expectedStates.length
            && actualStates.every((state, index) => state === expectedStates[index]);

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
        const shadowRoot = host.attachShadow({ mode: 'open' });
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
        window.ol = Object.assign({}, openLayersMock, { source: {} });
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
            window.ol = Object.assign({}, openLayersMock, { proj: projectionApi });
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
QUnit.module('OSM: viewport and interactions', moduleConfig, () => {
    QUnit.test('focus options are applied to the OpenLayers keyboard target', function(assert) {
        const done = assert.async();
        const map = $('#map').dxMap({
            provider: 'osm',
            focusStateEnabled: false,
            tabIndex: 5,
            providerConfig: {
                tileServer: {
                    url: 'https://tiles.example.com/{z}/{x}/{y}.png',
                    attribution: 'Example attribution'
                }
            },
            onReady: () => {
                const target = getOpenLayersKeyboardTarget();
                assert.strictEqual(target.getAttribute('tabindex'), null, 'focus is disabled on initialization');
                map.option('onUpdated', () => {
                    assert.strictEqual(target.getAttribute('tabindex'), '5', 'configured tabIndex is applied');
                    map.option('onUpdated', () => {
                        assert.strictEqual(target.getAttribute('tabindex'), '-1', 'runtime tabIndex is applied');
                        map.option('onUpdated', () => {
                            assert.strictEqual(target.getAttribute('tabindex'), null, 'runtime focus disabling is applied');
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
        engineMap.attachHandlers({ click, viewChange: sinon.spy() });
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
    QUnit.test('RTL mode preserves viewport and keyboard behavior', function(assert) {
        const done = assert.async();
        $('#map').dxMap({
            provider: 'osm',
            center: {
                lat: 40.74,
                lng: -73.98
            },
            controls: true,
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
        engineMap.attachHandlers({ click, viewChange });
        engineMap.dispose();
        openLayersMock.mapInstance.trigger('click', { coordinate: [-73980, 40740] });
        openLayersMock.mapInstance.trigger('moveend');
        assert.ok(click.notCalled, 'click handler is detached');
        assert.ok(viewChange.notCalled, 'view change handler is detached');
    });
});
