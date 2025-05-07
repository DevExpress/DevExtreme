const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const loadingIndicatorModule = require('viz/core/loading_indicator');
const titleModule = require('viz/core/title');
const projectionEnginesModule = require('viz/vector_map/projection');
const controlBarModule = require('viz/vector_map/control_bar/control_bar');
const legendModule = require('viz/vector_map/legend');
const tooltipModule = require('viz/core/tooltip');
const tooltipViewerModule = require('viz/vector_map/tooltip_viewer');
const DataSource = require('common/data/data_source/data_source').DataSource;
const exportMenuModule = require('viz/core/export'); // TODO maybe if you test layer - you should create exact layer?
const rendererModule = require('viz/core/renderers/renderer');

require('viz/vector_map/vector_map');

$('#qunit-fixture').append('<div id="container"></div>');

$('#container').css({
    width: '1200px',
    height: '600px'
});

titleModule.DEBUG_set_title(vizMocks.stubClass(titleModule.Title, { }));
tooltipModule.DEBUG_set_tooltip(vizMocks.stubClass(tooltipModule.Tooltip));
exportMenuModule.DEBUG_set_ExportMenu(vizMocks.stubClass(exportMenuModule.ExportMenu)); // TODO maybe if you test layer - you should create exact layer?
loadingIndicatorModule.DEBUG_set_LoadingIndicator(vizMocks.stubClass(loadingIndicatorModule.LoadingIndicator));
controlBarModule.ControlBar = vizMocks.stubClass(controlBarModule.ControlBar);
legendModule.LegendsControl = vizMocks.stubClass(legendModule.LegendsControl);
tooltipViewerModule.TooltipViewer = vizMocks.stubClass(tooltipViewerModule.TooltipViewer);

const simpleProjection = projectionEnginesModule.projection({
    aspectRatio: 4 / 3,

    to: function(coordinates) {
        return [
            (coordinates[0] - 200) / 200,
            (coordinates[1] - 150) / 150
        ];
    },

    from: function(coordinates) {
        return [
            (coordinates[0] + 1) * 200,
            (coordinates[1] + 1) * 150
        ];
    }
});

const createData = function(featureType, items) {
    return {
        type: 'FeatureCollection',
        features: $.map(items, function(item) {
            return {
                type: 'Feature',
                geometry: {
                    type: featureType,
                    coordinates: item.coordinates ? item.coordinates : item
                },
                properties: item.properties || {}
            };
        })
    };
};

const environment = {
    beforeEach: function() {
        const renderer = this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = function() { return renderer; };
    },

    createLayer: function(options) {
        return $('#container').dxVectorMap({
            projection: simpleProjection,
            layers: options
        }).dxVectorMap('instance').getLayers()[0];
    },

    getArea: function(index) {
        return this.renderer.path.getCall(0 + index).returnValue;
    },

    getLine: function(index) {
        return this.renderer.path.getCall(0 + index).returnValue;
    },

    getMarker: function(index) {
        return this.renderer.g.getCall(3 + index).returnValue;
    },

    getLabel: function(index) {
        return this.renderer.text.getCall(index).returnValue;
    }
};

QUnit.module('Elements positioning', environment);

QUnit.test('Areas (Polygon)', function(assert) {
    this.createLayer({
        dataSource: createData('Polygon', [
            [
                [[100, 50], [200, 50], [200, 200], [100, 200]]
            ],
            [
                [[200, 100], [400, 0], [400, 300]],
                [[0, 0], [0, 300], [400, 300], [400, 0]]
            ],
            []
        ])
    });

    assert.strictEqual(this.getArea(0).attr.getCall(1).args[0]['class'], 'dxm-area', 'type');
    assert.deepEqual(this.getArea(0).attr.getCall(0).args, [{
        points: [
            [400, 500, 600, 500, 600, 200, 400, 200]
        ]
    }], 'area 1 (simple)');
    assert.deepEqual(this.getArea(1).attr.getCall(0).args, [{
        points: [
            [600, 400, 1000, 600, 1000, 0],
            [200, 600, 200, 0, 1000, 0, 1000, 600]
        ]
    }], 'area 2 (complex)');
    assert.deepEqual(this.getArea(2).attr.getCall(0).args, [{
        points: []
    }], 'area 3 (degenerate)');
});

QUnit.test('Areas (Multipolygon)', function(assert) {
    this.createLayer({
        dataSource: createData('MultiPolygon', [
            [
                [
                    [[100, 50], [200, 50], [200, 200], [100, 200]]
                ]
            ],
            [
                [
                    [[200, 100], [400, 0], [400, 300]]
                ],
                [
                    [[0, 0], [0, 300], [400, 300], [400, 0]],
                    [[200, 100], [300, 100], [250, 200]]
                ]
            ],
            []
        ])
    });

    assert.strictEqual(this.getArea(0).attr.getCall(1).args[0]['class'], 'dxm-area', 'type');
    assert.deepEqual(this.getArea(0).attr.getCall(0).args, [{
        points: [
            [400, 500, 600, 500, 600, 200, 400, 200]
        ]
    }], 'area 1 (simple)');
    assert.deepEqual(this.getArea(1).attr.getCall(0).args, [{
        points: [
            [600, 400, 1000, 600, 1000, 0],
            [200, 600, 200, 0, 1000, 0, 1000, 600],
            [600, 400, 800, 400, 700, 200]
        ]
    }], 'area 2 (complex)');
    assert.deepEqual(this.getArea(2).attr.getCall(0).args, [{
        points: []
    }], 'area 3 (degenerate)');
});

QUnit.test('Areas (simple data source)', function(assert) {
    this.createLayer({
        dataSource: [
            {
                coordinates: [
                    [[100, 50], [200, 50], [200, 200], [100, 200]]
                ]
            },
            {
                coordinates: [
                    [[200, 100], [400, 0], [400, 300]],
                    [[0, 0], [0, 300], [400, 300], [400, 0]]
                ]
            },
            { coordinates: [] }
        ]
    });

    assert.strictEqual(this.getArea(0).attr.getCall(1).args[0]['class'], 'dxm-area', 'type');
    assert.deepEqual(this.getArea(0).attr.getCall(0).args, [{
        points: [
            [400, 500, 600, 500, 600, 200, 400, 200]
        ]
    }], 'area 1 (simple)');
    assert.deepEqual(this.getArea(1).attr.getCall(0).args, [{
        points: [
            [600, 400, 1000, 600, 1000, 0],
            [200, 600, 200, 0, 1000, 0, 1000, 600]
        ]
    }], 'area 2 (complex)');
    assert.deepEqual(this.getArea(2).attr.getCall(0).args, [{
        points: []
    }], 'area 3 (degenerate)');
});

QUnit.test('Lines (LineString)', function(assert) {
    this.createLayer({
        dataSource: createData('LineString', [
            [[100, 200], [300, 300], [400, 0]],
            []
        ])
    });

    assert.strictEqual(this.getArea(0).attr.getCall(1).args[0]['class'], 'dxm-line', 'type');
    assert.deepEqual(this.getLine(0).attr.getCall(0).args, [{
        points: [[400, 200, 800, 0, 1000, 600]]
    }], 'line 1 (common)');
    assert.deepEqual(this.getLine(1).attr.getCall(0).args, [{
        points: [[]] // TODO: Investigate
    }], 'line 2 (degenerate)');
});

QUnit.test('Lines (MultiPoint)', function(assert) {
    this.createLayer({
        dataSource: createData('MultiPoint', [
            [[100, 200], [300, 300], [400, 0]],
            []
        ])
    });

    assert.strictEqual(this.getArea(0).attr.getCall(1).args[0]['class'], 'dxm-line', 'type');
    assert.deepEqual(this.getLine(0).attr.getCall(0).args, [{
        points: [[400, 200, 800, 0, 1000, 600]]
    }], 'line 1 (common)');
    assert.deepEqual(this.getLine(1).attr.getCall(0).args, [{
        points: [[]] // TODO: Investigate
    }], 'line 2 (degenerate)');
});

QUnit.test('Lines (MultiLineString)', function(assert) {
    this.createLayer({
        dataSource: createData('MultiLineString', [
            [
                [[100, 50], [200, 50], [200, 200], [100, 200]]
            ],
            [
                [[200, 100], [400, 0], [400, 300]],
                [[0, 0], [0, 300], [400, 300], [400, 0]]
            ],
            []
        ])
    });

    assert.strictEqual(this.getArea(0).attr.getCall(1).args[0]['class'], 'dxm-line', 'type');
    assert.deepEqual(this.getLine(0).attr.getCall(0).args, [{
        points: [
            [400, 500, 600, 500, 600, 200, 400, 200]
        ]
    }], 'line 1 (simple)');
    assert.deepEqual(this.getLine(1).attr.getCall(0).args, [{
        points: [
            [600, 400, 1000, 600, 1000, 0],
            [200, 600, 200, 0, 1000, 0, 1000, 600]
        ]
    }], 'line 2 (complex)');
    assert.deepEqual(this.getLine(2).attr.getCall(0).args, [{
        points: []
    }], 'line 3 (degenerate)');
});

QUnit.test('Lines (simple data source)', function(assert) {
    this.createLayer({
        dataSource: [
            { coordinates: [[100, 200], [300, 300], [400, 0]] },
            { coordinates: [] }
        ]
    });

    assert.strictEqual(this.getArea(0).attr.getCall(1).args[0]['class'], 'dxm-line', 'type');
    assert.deepEqual(this.getLine(0).attr.getCall(0).args, [{
        points: [
            [400, 200, 800, 0, 1000, 600]
        ]
    }], 'line 1 (common)');
    assert.deepEqual(this.getLine(1).attr.getCall(0).args, [{
        points: [
            [] // TODO: Investigate (should be points: [])
        ]
    }], 'line 2 (degenerate)');
});

QUnit.test('Markers (Point)', function(assert) {
    this.createLayer({
        dataSource: createData('Point', [
            [0, 100],
            [200, 200],
            []
        ])
    });

    assert.strictEqual(this.getMarker(0).attr.getCall(1).args[0]['class'], 'dxm-marker', 'type');
    assert.deepEqual(this.getMarker(0).attr.getCall(0).args, [{ translateX: 200, translateY: 400 }], 'Marker 1 (common)');
    assert.deepEqual(this.getMarker(1).attr.getCall(0).args, [{ translateX: 600, translateY: 200 }], 'Marker 2 (common)');
    assert.deepEqual(this.getMarker(2).attr.getCall(0).args, [{ translateX: NaN, translateY: NaN }], 'Marker 3 (degenerate)');
});

QUnit.test('Markers (simple data source)', function(assert) {
    this.createLayer({
        dataSource: [
            { coordinates: [0, 100] },
            { coordinates: [200, 200] },
            { coordinates: [] }
        ]
    });

    assert.strictEqual(this.getMarker(0).attr.getCall(1).args[0]['class'], 'dxm-marker', 'type');
    assert.deepEqual(this.getMarker(0).attr.getCall(0).args, [{ translateX: 200, translateY: 400 }], 'Marker 1 (common)');
    assert.deepEqual(this.getMarker(1).attr.getCall(0).args, [{ translateX: 600, translateY: 200 }], 'Marker 2 (common)');
    assert.deepEqual(this.getMarker(2).attr.getCall(0).args, [{ translateX: NaN, translateY: NaN }], 'Marker 3 (degenerate)');
});

QUnit.test('Area labels', function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: -15, width: 40, height: 20 };
    this.createLayer({
        dataSource: createData('Polygon', [
            {
                coordinates: [
                    [[200, 100], [400, 100], [400, 150], [300, 200]]
                ],
                properties: { text: 'Item 1' }
            },
            {
                coordinates: [
                    [[100, 50], [100, 150], [200, 150], [200, 50], [100, 50]],
                    [[200, 200], [200, 220], [240, 220], [240, 200]]
                ],
                properties: { text: 'Item 2' }
            },
            {
                coordinates: [
                    [[100, 100], [300, 100], [100, 100]] // T344899
                ],
                properties: { text: 'Item 3' }
            },
            {
                coordinates: [], // T344899
                properties: { text: 'Item 4' }
            }
        ]),
        label: {
            enabled: true,
            dataField: 'text'
        }
    });

    assert.deepEqual(getLabelPosition(this.getLabel(0)), [853, 353], 'label 1');
    assert.deepEqual(getLabelPosition(this.getLabel(1)), [500, 400], 'label 2');
    assert.deepEqual(getLabelPosition(this.getLabel(2)), [NaN, NaN], 'label 3 (degenerate)');
    assert.deepEqual(getLabelPosition(this.getLabel(3)), [NaN, NaN], 'label 4 (degenerate)');

    function getLabelPosition(label) {
        const arg = label.attr.getCall(1).args[0];
        return [Math.round(arg.translateX), Math.round(arg.translateY)];
    }
});

QUnit.test('Line labels', function(assert) {
    this.createLayer({
        dataSource: createData('LineString', [
            {
                coordinates: [[100, 200], [300, 300], [400, 0]],
                properties: { text: 'Item 1' }
            },
            {
                coordinates: [], // T344899
                properties: { text: 'Item 2' }
            }
        ]),
        label: {
            enabled: true,
            dataField: 'text'
        }
    });

    assert.deepEqual(getLabelPosition(this.getLabel(0)), [842, 125], 'label 1');
    assert.deepEqual(getLabelPosition(this.getLabel(1)), [NaN, NaN], 'label 2 (degenerate)');

    function getLabelPosition(label) {
        const arg = label.attr.getCall(1).args[0];
        return [Math.round(arg.translateX), Math.round(arg.translateY)];
    }
});

QUnit.module('Layers management', {
    beforeEach: function() {
        const renderer = this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = function() { return renderer; };
    },

    createLayers: function(options) {
        return $('#container').dxVectorMap({
            layers: options
        }).dxVectorMap('instance');
    }
});

QUnit.test('Array option', function(assert) {
    const map = this.createLayers([
        { name: 'layer-a' },
        {},
        { name: 'layer-b' },
        {}
    ]);

    const layers = map.getLayers();
    assert.strictEqual(layers.length, 4, 'count');
    assert.strictEqual(layers[0].name, 'layer-a', 'layer 1 name');
    assert.strictEqual(layers[1].name, 'map-layer-1', 'layer 2 name');
    assert.strictEqual(layers[2].name, 'layer-b', 'layer 3 name');
    assert.strictEqual(layers[3].name, 'map-layer-3', 'layer 4 name');
});

QUnit.test('Object option', function(assert) {
    const map = this.createLayers({
        name: 'layer'
    });

    const layers = map.getLayers();
    assert.strictEqual(layers.length, 1, 'count');
    assert.strictEqual(layers[0].name, 'layer', 'layer 1 name');
});

QUnit.test('Empty option', function(assert) {
    const map = this.createLayers();

    assert.deepEqual(map.getLayers(), []);
});

QUnit.test('Change option - increase layers count', function(assert) {
    const map = this.createLayers([
        { name: 'layer-1' },
        { name: 'layer-2' }
    ]);

    map.option('layers', [
        {},
        {},
        { name: 'layer-3' }
    ]);

    const layers = map.getLayers();
    assert.strictEqual(layers.length, 3, 'count');
    assert.strictEqual(layers[0].name, 'map-layer-0', 'layer 1 name');
    assert.strictEqual(layers[1].name, 'map-layer-1', 'layer 2 name');
    assert.strictEqual(layers[2].name, 'layer-3', 'layer 3 name');
});

QUnit.test('Change option - decrease layers count', function(assert) {
    const map = this.createLayers([
        { name: 'layer-1' },
        { name: 'layer-2' },
        { name: 'layer-3' }
    ]);

    map.option('layers', [
        {},
        {}
    ]);

    const layers = map.getLayers();
    assert.strictEqual(layers.length, 2, 'count');
    assert.strictEqual(layers[0].name, 'map-layer-0', 'layer 1 name');
    assert.strictEqual(layers[1].name, 'map-layer-1', 'layer 2 name');
});

QUnit.test('Change name of one layer', function(assert) {
    const map = this.createLayers([
        { name: 'layer-1' },
        { name: 'layer-2' },
        { name: 'layer-3' }
    ]);

    const oldLayers = map.getLayers();
    map.option('layers', [
        { name: 'layer-1' },
        { name: 'new_layer-2' },
        { name: 'layer-3' }
    ]);

    const updatedLayers = map.getLayers();

    updatedLayers.forEach(function(l, i) {
        assert.notStrictEqual(l, oldLayers[i]);
    });
});

QUnit.test('Layers shouldn\'t be created on updating when name not set', function(assert) {
    const map = this.createLayers([
        { color: 'some_color_1' }
    ]);

    const oldLayer = map.getLayers()[0];
    map.option('layers', [{ color: 'some_color_1' }]);

    assert.strictEqual(map.getLayers()[0], oldLayer);
});

QUnit.test('No crush on updating when on of layer in null', function(assert) {
    const map = this.createLayers([
        { color: 'some_color_1' }
    ]);

    map.option('layers', [null]);

    assert.strictEqual(map.getLayers().length, 1);
});

QUnit.test('Get layer by name', function(assert) {
    const map = this.createLayers([
        { name: 'layer-a' },
        {},
        { name: 'layer-b' }
    ]);

    const layers = map.getLayers();
    assert.strictEqual(map.getLayerByName('layer-a'), layers[0], 'layer 1');
    assert.strictEqual(map.getLayerByName('map-layer-1'), layers[1], 'layer 2');
    assert.strictEqual(map.getLayerByName('layer-b'), layers[2], 'layer 3');
    assert.strictEqual(map.getLayerByName('test'), null, 'unknown name');
});

QUnit.test('Get layer by index', function(assert) {
    const map = this.createLayers([
        {},
        {},
        {}
    ]);

    const layers = map.getLayers();
    assert.strictEqual(map.getLayerByIndex(0), layers[0], 'layer 1');
    assert.strictEqual(map.getLayerByIndex(1), layers[1], 'layer 2');
    assert.strictEqual(map.getLayerByIndex(2), layers[2], 'layer 3');
    assert.strictEqual(map.getLayerByIndex(3), null, 'not valid index');
});

QUnit.test('Change layer name', function(assert) {
    const map = this.createLayers([
        { name: 'layer-1' },
        {}
    ]);

    map.option('layers', [
        { name: 'layer-2' },
        {}
    ]);

    assert.ok(map.getLayerByName('layer-2'), 'get by new name');
    assert.ok(!map.getLayerByName('layer-1'), 'get by old name');
    const layers = map.getLayers();
    assert.strictEqual(layers.length, 2, 'count');
    assert.strictEqual(layers[0].name, 'layer-2', 'layer 1 name');
    assert.strictEqual(layers[1].name, 'map-layer-1', 'layer 2 name');
});

QUnit.test('getDataSource method', function(assert) {
    const map = this.createLayers({
        dataSource: createData('Polygon', [
            [
                [[100, 50], [200, 50], [200, 200], [100, 200]]
            ],
            [
                [[200, 100], [400, 0], [400, 300]],
                [[0, 0], [0, 300], [400, 300], [400, 0]]
            ],
            []
        ])
    });

    assert.ok(map.getLayers()[0].getDataSource() instanceof DataSource);
});

QUnit.test('Bounds calculation. polygon', function(assert) {
    const map = this.createLayers({
        dataSource: createData('Polygon', [
            [
                [[100, 50], [200, 50], [200, 200], [100, 200]]
            ],
            [
                [[200, 100], [400, 0], [400, 300]],
                [[0, 0], [0, 300], [400, 300], [400, 0]]
            ],
            []
        ])
    });

    const bounds = map.getLayers()[0].getBounds();

    assert.deepEqual(bounds, [0, 0, 400, 300]);
});

QUnit.test('Bounds calculation. multipolygon', function(assert) {
    const map = this.createLayers({
        dataSource: createData('MultiPolygon', [
            [[
                [
                    [50, 0],
                    [3, 10]
                ]
            ]]
        ])
    });

    const bounds = map.getLayers()[0].getBounds();

    assert.deepEqual(bounds, [3, 0, 50, 10]);
});
