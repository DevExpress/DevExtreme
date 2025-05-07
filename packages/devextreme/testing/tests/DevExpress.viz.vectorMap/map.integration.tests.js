import $ from 'jquery';
import { CustomStore } from 'common/data/custom_store';
import DataSource from 'common/data/data_source';
import { projection } from 'viz/vector_map/projection';
const simpleProjection = projection({
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

import 'viz/vector_map/vector_map';

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id=\'container\'></div>');
});

QUnit.module('Tests without stub', {
    beforeEach: function() {
        this.dataSource = {
            type: 'FeatureCollection',
            features: [
                [
                    [[100, 50], [200, 50], [200, 200], [100, 200]]
                ],
                [
                    [[200, 100], [400, 0], [400, 300]],
                    [[0, 0], [0, 300], [400, 300], [400, 0]]
                ],
                []
            ].map(function(item) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: item
                    },
                    properties: {}
                };
            })
        };
    }
});

QUnit.test('VectorMap should not fire onCenterChanged and onZoomFactorChanged events on widget creation', function(assert) {
    const onCenterChanged = sinon.spy();
    const onZoomFactorChanged = sinon.spy();

    $('#container').dxVectorMap({
        projection: simpleProjection,
        layers: {
            dataSource: this.dataSource
        },
        center: [10, 10],
        zoomFactor: 3.5,
        onCenterChanged: onCenterChanged,
        onZoomFactorChanged: onZoomFactorChanged
    });

    assert.strictEqual(onCenterChanged.callCount, 0);
    assert.strictEqual(onZoomFactorChanged.callCount, 0);
});

QUnit.test('VectorMap should fire onCenterChanged and onZoomFactorChanged events on option changing', function(assert) {
    const onCenterChanged = sinon.spy();
    const onZoomFactorChanged = sinon.spy();

    const map = $('#container').dxVectorMap({
        projection: simpleProjection,
        layers: {
            dataSource: this.dataSource
        },
        zoomFactor: 3.5,
        onCenterChanged: onCenterChanged,
        onZoomFactorChanged: onZoomFactorChanged
    }).dxVectorMap('instance');

    map.option({
        center: [10, 10],
        zoomFactor: 5
    });

    assert.strictEqual(onCenterChanged.callCount, 1);
    assert.strictEqual(onZoomFactorChanged.callCount, 1);
});

QUnit.module('VectorMap bounds', {
    beforeEach: function() {
        this.dataSource = {
            type: 'FeatureCollection',
            features: [
                [
                    [[100, 50], [120, 50], [150, 20], [50, 40]]
                ],
                [
                    [[100, 10], [50, 60], [50, 30]],
                    [[-10, 0], [0, 30], [40, 30], [40, -10]]
                ],
                []
            ].map(function(item) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: item
                    },
                    properties: {}
                };
            })
        };
    }
});

QUnit.test('VectorMap should be initialized with no errors if layer has no data (T1210450)', function(assert) {
    let noErrorsOnInit = true;

    try {
        $('#container').dxVectorMap({
            layers: [{
                dataSource: [],
            }, {
                dataSource: {
                    features: [{
                        geometry: {
                            coordinates: [[[-17.26391560048284, 72.23003475989351]]],
                        },
                    }],
                },
            },
            ],
        }).dxVectorMap('instance');
    } catch(e) {
        noErrorsOnInit = false;
    } finally {
        assert.ok(noErrorsOnInit);
    }
});

QUnit.test('VectorMap should set prepared bounds from dataSource (root - FeatureCollection object)', function(assert) {
    this.dataSource['bbox'] = [0, 50, 100, 0];
    const map = $('#container').dxVectorMap({
        getBoundsFromData: true,
        layers: {
            dataSource: this.dataSource
        }
    }).dxVectorMap('instance');

    assert.deepEqual(map._projection._engine.min(), [0, 0]);
    assert.deepEqual(map._projection._engine.max(), [100, 50]);
});

QUnit.test('VectorMap should set prepared bounds from dataSource (collect from feature objects)', function(assert) {
    this.dataSource.features[0]['bbox'] = [-10, 50, 120, 0];
    this.dataSource.features[1]['bbox'] = [0, 60, 100, -10];
    const map = $('#container').dxVectorMap({
        getBoundsFromData: true,
        layers: {
            dataSource: this.dataSource
        }
    }).dxVectorMap('instance');

    assert.deepEqual(map._projection._engine.min(), [-10, -10]);
    assert.deepEqual(map._projection._engine.max(), [120, 60]);
});

QUnit.module('VectorMap custom store', {
    beforeEach: function() {
        const dataObject = {
            type: 'FeatureCollection',
            features: [
                [
                    [[100, 50], [120, 50], [150, 20], [50, 40]]
                ],
                [
                    [[100, 10], [50, 60], [50, 30]],
                    [[-10, 0], [0, 30], [40, 30], [40, -10]]
                ],
                []
            ].map(function(item) {
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: item
                    },
                    properties: {}
                };
            })
        };

        this.dataSource = {
            store: new CustomStore({
                'loadMode': 'raw',
                'load': function() {
                    const d = $.Deferred();
                    d.resolve(dataObject);
                    return d;
                }
            })
        };
    }
});

QUnit.test('Vector Map should not failed (T885056)', function(assert) {
    $('#container').dxVectorMap({
        layers: {
            dataSource: this.dataSource
        }
    });

    assert.ok(true);
});

QUnit.test('Updating map bbox after push new item to the CustomStore', function(assert) {
    const markerSource = new CustomStore({
        load: function() {
            return [{
                coordinates: [-121.2808, 38.3320],
                attributes: { text: 'Sacramento' },
                'bbox': [0, 0, -121.2808, 38.3320]
            }];
        }
    });

    const map = $('#container').dxVectorMap({
        getBoundsFromData: true,
        layers: [{
            dataSource: new DataSource({
                pushAggregationTimeout: 0,
                paginate: false,
                store: markerSource
            })
        }]
    }).dxVectorMap('instance');

    markerSource.push([{
        type: 'insert',
        data: {
            coordinates: [-180, 30.25],
            attributes: { text: 'Austin' },
            'bbox': [0, 0, -180, 30.25]
        }
    }]);

    assert.deepEqual(map._projection._engine.min(), [-180, 0]);
});
