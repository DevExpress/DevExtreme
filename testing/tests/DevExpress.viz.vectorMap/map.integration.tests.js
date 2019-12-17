const $ = require('jquery');
const simpleProjection = require('viz/vector_map/projection').projection({
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

require('viz/vector_map/vector_map');

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
                        coordinates: item.coordinates ? item.coordinates : item
                    },
                    properties: item.properties || {}
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
                        coordinates: item.coordinates ? item.coordinates : item
                    },
                    properties: item.properties || {}
                };
            })
        };
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
