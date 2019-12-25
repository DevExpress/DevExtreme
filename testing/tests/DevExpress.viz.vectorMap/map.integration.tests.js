var $ = require('jquery'),
    simpleProjection = require('viz/vector_map/projection').projection({
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
    var onCenterChanged = sinon.spy(),
        onZoomFactorChanged = sinon.spy();

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
    var onCenterChanged = sinon.spy(),
        onZoomFactorChanged = sinon.spy();

    var map = $('#container').dxVectorMap({
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
