const $ = require('jquery');
const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const mapLayerModule = require('viz/vector_map/map_layer');
const selectStrategy = mapLayerModule._TESTS_selectStrategy;

const emptyStrategy = selectStrategy({}, createData(0));
const areaStrategyPolygon = selectStrategy({ type: 'area' }, createData(1));
const areaStrategyMultiPolygon = selectStrategy({ type: 'area' }, createData(1, [[[[1]]]]));
const lineStrategyLineString = selectStrategy({ type: 'line' }, createData(1));
const lineStrategyMultiLineString = selectStrategy({ type: 'line' }, createData(1, [[[1]]]));
const pointDotStrategy = selectStrategy({ type: 'marker', elementType: 'dot' }, createData(1));
const pointBubbleStrategy = selectStrategy({ type: 'marker', elementType: 'bubble' }, createData(1));
const pointPieStrategy = selectStrategy({ type: 'marker', elementType: 'pie' }, createData(1));
const pointImageStrategy = selectStrategy({ type: 'marker', elementType: 'image' }, createData(1));

const performGrouping = mapLayerModule._TESTS_performGrouping;
const groupByColor = mapLayerModule._TESTS_groupByColor;
const groupBySize = mapLayerModule._TESTS_groupBySize;
let stubPerformGrouping;
let stubGroupByColor;
let stubGroupBySize;

QUnit.begin(function() {
    stubPerformGrouping = sinon.spy();
    stubGroupByColor = sinon.spy();
    stubGroupBySize = sinon.spy();
    mapLayerModule._TESTS_stub_performGrouping(stubPerformGrouping);
    mapLayerModule._TESTS_stub_groupByColor(stubGroupByColor);
    mapLayerModule._TESTS_stub_groupBySize(stubGroupBySize);
});

function createData(count_, sample) {
    return {
        count: function() {
            return count_;
        },

        geometry: function() {
            return { coordinates: sample || [] };
        },

        item: noop
    };
}

QUnit.module('Basic');

QUnit.test('Selecting', function(assert) {
    assert.deepEqual(selectStrategy({ type: 'area' }, createData(0)), emptyStrategy, 'empty data 1');
    assert.deepEqual(selectStrategy({ type: 'line' }, createData(0)), emptyStrategy, 'empty data 2');
    assert.deepEqual(selectStrategy({ type: 'marker' }, createData(0)), emptyStrategy, 'empty data 3');

    assert.deepEqual(selectStrategy({}, createData(1, [1])), pointDotStrategy, 'guess kind by data 1');
    assert.deepEqual(selectStrategy({}, createData(1, [[1]])), lineStrategyLineString, 'guess kind by data 2');
    assert.deepEqual(selectStrategy({}, createData(1, [[[1]]])), areaStrategyPolygon, 'guess kind by data 3');

    assert.deepEqual(selectStrategy({ type: 'area' }, createData(1), []), areaStrategyPolygon, 'kind is defined 1');
    assert.deepEqual(selectStrategy({ type: 'line' }, createData(1), []), lineStrategyLineString, 'kind is defined 2');
    assert.deepEqual(selectStrategy({ type: 'marker' }, createData(1)), pointDotStrategy, 'kind is defined 3');

    assert.deepEqual(selectStrategy({}, createData(1, [[[1, 2]]])), areaStrategyPolygon, 'area polygon strategy');
    assert.deepEqual(selectStrategy({}, createData(1, [[[[1, 2]]]])), areaStrategyMultiPolygon, 'area mutlipolygon strategy');

    assert.deepEqual(selectStrategy({}, createData(1, [[1, 2]])), lineStrategyLineString, 'line linestring strategy');
    assert.deepEqual(selectStrategy({ type: 'line' }, createData(1, [[[1, 2]]])), lineStrategyMultiLineString, 'line multilinestring strategy');

    assert.deepEqual(selectStrategy({ elementType: 'dot' }, createData(1, [1])), pointDotStrategy, 'dot strategy');
    assert.deepEqual(selectStrategy({ elementType: 'bubble' }, createData(1, [1])), pointBubbleStrategy, 'bubble strategy');
    assert.deepEqual(selectStrategy({ elementType: 'pie' }, createData(1, [1])), pointPieStrategy, 'pie strategy');
    assert.deepEqual(selectStrategy({ elementType: 'image' }, createData(1, [1])), pointImageStrategy, 'image strategy');
});

// QUnit.test("Project", function (assert) {
//    var projection = {
//        project: function (coordinates) {
//            return coordinates + "-proj";
//        }
//    };
//
//    assert.deepEqual(areaStrategyPolygon.project(projection, [
//        ["p1", "p2"],
//        ["p3", "p4", "p5"],
//        ["p6"]
//    ]), [
//        ["p1-proj", "p2-proj"],
//        ["p3-proj", "p4-proj", "p5-proj"],
//        ["p6-proj"]
//    ], "area polygon");
//    assert.deepEqual(areaStrategyMultiPolygon.project(projection, [
//        [
//            ["p1", "p2"],
//            ["p3"]
//        ],
//        [
//            ["p4", "p5", "p6"]
//        ]
//    ]), [
//        ["p1-proj", "p2-proj"],
//        ["p3-proj"],
//        ["p4-proj", "p5-proj", "p6-proj"]
//    ], "area multipolygon");
//    assert.deepEqual(lineStrategyLineString.project(projection, [
//        "p1", "p2", "p3"
//    ]), [
//        ["p1-proj", "p2-proj", "p3-proj"]
//    ], "line linestring");
//    assert.deepEqual(lineStrategyMultiLineString.project(projection, [
//        ["p1", "p2"],
//        ["p3", "p4", "p5"],
//        ["p6"]
//    ]), [
//        ["p1-proj", "p2-proj"],
//        ["p3-proj", "p4-proj", "p5-proj"],
//        ["p6-proj"]
//    ], "line multilinestring");
//    assert.deepEqual(pointDotStrategy.project(projection, ["p"]), "p-proj", "point");
// });

// QUnit.test("Project area label", function (assert) {
//    var data = areaStrategyPolygon.projectLabel([
//        [[10, 20], [10, 40], [30, 40], [40, 20]],
//        [[30, 50], [30, 60], [40, 70], [50, 20]]
//    ]);
//
//    assert.roughEqual(data[0][0], 20.3333, 0.0001, "coordinate 0");
//    assert.roughEqual(data[0][1], 28.6666, 0.0001, "coordinate 1");
//    assert.roughEqual(data[1][0], 22.3607, 0.0001, "size 0");
//    assert.roughEqual(data[1][1], 22.3607, 0.0001, "size 1");
// });

// QUnit.test("Project line label", function (assert) {
//    var data = lineStrategyLineString.projectLabel([
//        [[10, 20], [10, 40], [30, 40], [40, 20], [50, 20]],
//        [[30, 50], [30, 60], [40, 70]]
//    ]);
//
//    assert.roughEqual(data[0][0], 26.1803, 0.0001, "coordinate 0");
//    assert.roughEqual(data[0][1], 40, 0.0001, "coordinate 1");
//    assert.roughEqual(data[1][0], 40, 0.0001, "size 0");
//    assert.roughEqual(data[1][1], 20, 0.0001, "size 1");
//    assert.roughEqual(data[2], 72.3607, 0.0001, "length");
// });

// QUnit.test("Transform area", function (assert) {
//    var figure = { root: new vizMocks.Element() },
//        projection = {
//            transform: function (coordinates) {
//                return coordinates + "-tr"
//            }
//        };
//
//    areaStrategyPolygon.transform(figure, projection, [
//        ["p1", "p2"],
//        ["p3"]
//    ]);
//
//    assert.deepEqual(figure.root.attr.lastCall.args, [{
//        points: [
//            ["p1-tr", "p2-tr"],
//            ["p3-tr"]
//        ]
//    }]);
// });

// QUnit.test("Transform area label", function (assert) {
//    var figure = { text: new vizMocks.Element(), size: [10, 20] },
//        projection = {
//            transform: function (coordinates) {
//                return [coordinates[0] + 10, coordinates[1] - 20];
//            },
//            getSquareSize: function (size) {
//                return [size[0] * 2, size[1] * 3];
//            }
//        };
//
//    areaStrategyPolygon.transformLabel(figure, projection, [[100, 200], [30, 30]]);
//
//    assert.deepEqual(figure.text.attr.getCall(0).args, [{ translateX: 110, translateY: 180 }], "position 1");
//    assert.deepEqual(figure.text.attr.getCall(1).args, [{ visibility: null }], "visibility 1");
//    assert.deepEqual(figure.spaceSize, [60, 90], "space 1");
//
//    areaStrategyPolygon.transformLabel(figure, projection, [[100, 200], [0.05, 0.05]]);
//
//    assert.deepEqual(figure.text.attr.getCall(3).args, [{ visibility: "hidden" }], "visibility 2");
// });

// QUnit.test("Transform line", function (assert) {
//    var figure = { root: new vizMocks.Element() },
//        projection = {
//            transform: function (coordinates) {
//                return coordinates + "-tr"
//            }
//        };
//
//    lineStrategyLineString.transform(figure, projection, [
//        ["p1", "p2"],
//        ["p3"]
//    ]);
//
//    assert.deepEqual(figure.root.attr.lastCall.args, [{
//        points: [
//            ["p1-tr", "p2-tr"],
//            ["p3-tr"]
//        ]
//    }]);
// });

// QUnit.test("Transform line label", function (assert) {
//    var figure = { text: new vizMocks.Element(), size: [10, 20] },
//        projection = {
//            transform: function (coordinates) {
//                return [coordinates[0] + 10, coordinates[1] - 20];
//            },
//            getSquareSize: function (size) {
//                return [size[0] * 2, size[1] * 3];
//            }
//        };
//
//    lineStrategyLineString.transformLabel(figure, projection, [[100, 200], [10, 20]]);
//
//    assert.deepEqual(figure.text.attr.getCall(0).args, [{ translateX: 110, translateY: 180 }], "position 1");
//    assert.deepEqual(figure.text.attr.getCall(1).args, [{ visibility: null }], "visibility 1");
//    assert.deepEqual(figure.spaceSize, [20, 60], "space 1");
//
//    lineStrategyLineString.transformLabel(figure, projection, [[100, 200], [0.05, 0.05]]);
//
//    assert.deepEqual(figure.text.attr.getCall(3).args, [{ visibility: "hidden" }], "visibility 2");
// });

// QUnit.test("Transform point", function (assert) {
//    var figure = { root: new vizMocks.Element() },
//        projection = {
//            transform: function (coordinates) {
//                return [coordinates[0] + 10, coordinates[1] - 20];
//            }
//        };
//
//    pointDotStrategy.transform(figure, projection, [100, 200]);
//
//    assert.deepEqual(figure.root.attr.lastCall.args, [{ translateX: 110, translateY: 180 }]);
// });

QUnit.test('Perform grouping', function(assert) {
    const set = sinon.spy();
    const valuesCallback = sinon.stub().returns('test-values');
    const context = {
        name: 'test-name',
        params: {
            dataExchanger: { set: set }
        },
        settings: {
            color: 'default color'
        },
        grouping: {}
    };
    const stub = sinon.stub().returns('test-data');

    performGrouping(context, [1, 2, 3, 4], 'test-field-1', 'data-field', valuesCallback);

    let callback = context.grouping['test-field-1'].callback;
    assert.deepEqual(context.grouping['test-field-1'], {
        callback: callback,
        field: 'data-field',
        partition: [1, 2, 3, 4],
        values: 'test-values'
    }, 'grouping 1');
    assert.deepEqual(valuesCallback.lastCall.args, [3], 'values callback');
    assert.deepEqual(set.lastCall.args, ['test-name', 'test-field-1', {
        partition: [1, 2, 3, 4],
        values: 'test-values',
        defaultColor: 'default color'
    }], 'data is set 1');
    assert.deepEqual(callback({ attribute: stub }, 'test-arg'), 'test-data', 'value callback');
    assert.deepEqual(stub.lastCall.args, ['test-arg'], 'attribute');

    valuesCallback.reset();
    set.reset();
    callback = sinon.spy();
    performGrouping(context, [1, 2, 3], 'test-field-2', callback, valuesCallback);

    assert.deepEqual(context.grouping['test-field-2'], {
        callback: callback,
        field: callback,
        partition: [1, 2, 3],
        values: 'test-values'
    }, 'grouping 2');
    assert.deepEqual(valuesCallback.lastCall.args, [2], 'values callback');
    assert.deepEqual(set.lastCall.args, ['test-name', 'test-field-2', {
        partition: [1, 2, 3],
        values: 'test-values',
        defaultColor: 'default color'
    }], 'data is set 2');

    valuesCallback.reset();
    set.reset();
    performGrouping(context, { tag: 'test' }, 'test-field-3', 'data-field', valuesCallback);

    assert.strictEqual(context.grouping['test-field-3'], undefined, 'grouping 3');
    assert.strictEqual(valuesCallback.lastCall, null, 'values callback is not called 3');
    assert.strictEqual(set.lastCall, null, 'data is not set 3');
});

QUnit.test('Group by color', function(assert) {
    stubPerformGrouping.reset();
    const getColor = sinon.stub();
    const createDiscretePalette = sinon.stub().returns({ getColor: getColor });
    const context = {
        params: {
            themeManager: { createDiscretePalette: createDiscretePalette }
        },
        settings: {
            colorGroups: 'test-groups',
            colorGroupingField: 'test-field',
            palette: 'test-palette'
        }
    };
    getColor.onCall(0).returns('c1');
    getColor.onCall(1).returns('c2');
    getColor.onCall(2).returns('c3');
    getColor.onCall(3).returns('c4');

    groupByColor(context);

    const callback = stubPerformGrouping.lastCall.args[4];
    assert.deepEqual(stubPerformGrouping.lastCall.args, [context, 'test-groups', 'color', 'test-field', callback], 'grouping');
    assert.deepEqual(callback(3), ['c1', 'c2', 'c3'], 'callback');
    assert.deepEqual(createDiscretePalette.lastCall.args, ['test-palette', 3], 'palette');
});

QUnit.test('Group by size', function(assert) {
    stubPerformGrouping.reset();
    const context = {
        settings: {
            sizeGroups: 'test-groups',
            sizeGroupingField: 'test-field',
            minSize: 10,
            maxSize: 20
        }
    };

    groupBySize(context);

    const callback = stubPerformGrouping.lastCall.args[4];
    assert.deepEqual(stubPerformGrouping.lastCall.args, [context, 'test-groups', 'size', 'test-field', callback], 'grouping');
    assert.deepEqual(callback(0), [], 'callback 0');
    assert.deepEqual(callback(1), [15], 'callback 1');
    assert.deepEqual(callback(2), [10, 20], 'callback 2');
    assert.deepEqual(callback(3), [10, 15, 20], 'callback 3');
});

QUnit.test('Group by size with callback', function(assert) {
    stubPerformGrouping.reset();
    const context = {
        settings: {
            sizeGroups: 'test-groups',
            sizeGroupingField: 'test-field',
            minSize: 10,
            maxSize: 20
        }
    };

    groupBySize(context, 'test-callback');

    const callback = stubPerformGrouping.lastCall.args[4];
    assert.deepEqual(stubPerformGrouping.lastCall.args, [context, 'test-groups', 'size', 'test-callback', callback], 'grouping');
});

QUnit.test('Find grouping index', function(assert) {
    const findGroupingIndex = mapLayerModule._TESTS_findGroupingIndex;
    const groups = [1, 2, 6, 8, 10, 14, 18, 21];

    assert.strictEqual(findGroupingIndex('test', groups), -1, 'not a number');
    assert.strictEqual(findGroupingIndex(0, groups), -1, 'less then min');
    assert.strictEqual(findGroupingIndex(30, groups), -1, 'greater then max');
    assert.strictEqual(findGroupingIndex(1, groups), 0, 'min');
    assert.strictEqual(findGroupingIndex(21, groups), 6, 'max');

    assert.strictEqual(findGroupingIndex(2, groups), 1, '2');
    assert.strictEqual(findGroupingIndex(6, groups), 2, '6');
    assert.strictEqual(findGroupingIndex(8, groups), 3, '8');
    assert.strictEqual(findGroupingIndex(10, groups), 4, '10');
    assert.strictEqual(findGroupingIndex(14, groups), 5, '14');
    assert.strictEqual(findGroupingIndex(18, groups), 6, '18');

    assert.strictEqual(findGroupingIndex(1.5, groups), 0, '1.5');
    assert.strictEqual(findGroupingIndex(4, groups), 1, '4');
    assert.strictEqual(findGroupingIndex(7, groups), 2, '7');
    assert.strictEqual(findGroupingIndex(8.4, groups), 3, '8.4');
    assert.strictEqual(findGroupingIndex(11, groups), 4, '11');
    assert.strictEqual(findGroupingIndex(17, groups), 5, '17');
    assert.strictEqual(findGroupingIndex(18.1, groups), 6, '18.1');
});

const environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.context = {
            renderer: this.renderer,
            dataKey: 'data-key'
        };
    }
};

QUnit.module('Area strategy', environment);

QUnit.test('Types', function(assert) {
    assert.strictEqual(areaStrategyPolygon.type, 'area', 'type');
    assert.strictEqual(areaStrategyPolygon.elementType, undefined, 'element type');
    assert.strictEqual(areaStrategyPolygon.fullType, 'area', 'full type');
});

QUnit.test('Draw', function(assert) {
    const figure = {};

    areaStrategyPolygon.draw(this.context, figure, 'test-data');

    assert.deepEqual(this.renderer.path.lastCall.args, [[], 'area'], 'area is created');
    assert.strictEqual(figure.root, this.renderer.path.lastCall.returnValue, 'area');
    assert.deepEqual(figure.root.data.lastCall.args, ['data-key', 'test-data'], 'data');
});

QUnit.test('Get label offset', function(assert) {
    const label1 = { size: [10, 20], spaceSize: [30, 40], text: new vizMocks.Element() };
    const label2 = { size: [30, 20], spaceSize: [30, 40], text: new vizMocks.Element() };
    const label3 = { size: [10, 40], spaceSize: [30, 40], text: new vizMocks.Element() };

    assert.deepEqual(areaStrategyPolygon.getLabelOffset(label1), [0, 0], 'offset 1');
    assert.deepEqual(label1.text.attr.lastCall.args, [{ visibility: null }], 'visibility 1');

    assert.deepEqual(areaStrategyPolygon.getLabelOffset(label2), [0, 0], 'offset 2');
    assert.deepEqual(label2.text.attr.lastCall.args, [{ visibility: 'hidden' }], 'visibility 2');

    assert.deepEqual(areaStrategyPolygon.getLabelOffset(label3), [0, 0], 'offset 3');
    assert.deepEqual(label3.text.attr.lastCall.args, [{ visibility: 'hidden' }], 'visibility 3');
});

QUnit.test('Get styles', function(assert) {
    assert.deepEqual(areaStrategyPolygon.getStyles({
        borderColor: 'c1', borderWidth: 1, color: 'c2', opacity: 'o1',
        hoveredBorderColor: 'c3', hoveredBorderWidth: 2, hoveredColor: 'c4', hoveredOpacity: 'o2',
        selectedBorderColor: 'c5', selectedBorderWidth: 3, selectedColor: 'c6', selectedOpacity: 'o3'
    }), {
        root: [
            { 'class': 'dxm-area', stroke: 'c1', 'stroke-width': 1, fill: 'c2', opacity: 'o1' },
            { 'class': 'dxm-area dxm-area-hovered', stroke: 'c3', 'stroke-width': 2, fill: 'c4', opacity: 'o2' },
            { 'class': 'dxm-area dxm-area-selected', stroke: 'c5', 'stroke-width': 3, fill: 'c6', opacity: 'o3' }
        ]
    });
});

QUnit.test('Get styles, zero values', function(assert) {
    assert.deepEqual(areaStrategyPolygon.getStyles({
        borderColor: 'c1', borderWidth: 0, color: 'c2', opacity: 0,
        hoveredBorderColor: 'c3', hoveredBorderWidth: 0, hoveredColor: 'c4', hoveredOpacity: 0,
        selectedBorderColor: 'c5', selectedBorderWidth: 0, selectedColor: 'c6', selectedOpacity: 0
    }), {
        root: [
            { 'class': 'dxm-area', stroke: 'c1', 'stroke-width': 0, fill: 'c2', opacity: 0 },
            { 'class': 'dxm-area dxm-area-hovered', stroke: 'c3', 'stroke-width': 0, fill: 'c4', opacity: 0 },
            { 'class': 'dxm-area dxm-area-selected', stroke: 'c5', 'stroke-width': 0, fill: 'c6', opacity: 0 }
        ]
    });
});

QUnit.test('Set state', function(assert) {
    const figure = { root: new vizMocks.Element() };
    const style = { tag: 'style' };

    areaStrategyPolygon.setState(figure, { root: [null, style, null] }, 1);

    assert.deepEqual(figure.root.attr.lastCall.args, [style]);
});

QUnit.test('Has labels group', function(assert) {
    assert.strictEqual(areaStrategyPolygon.hasLabelsGroup, true);
});

QUnit.test('Update grouping', function(assert) {
    stubGroupByColor.reset();

    areaStrategyPolygon.updateGrouping(this.context);

    assert.deepEqual(stubGroupByColor.lastCall.args, [this.context], 'group by color');
});

QUnit.test('GetDefaultColor - returns nothing', function(assert) {
    this.context.params = {
        themeManager: { getAccentColor: sinon.stub().returns('default color') }
    };

    const result = areaStrategyPolygon.getDefaultColor(this.context, 'test palette');

    assert.strictEqual(result, undefined);
    assert.strictEqual(this.context.params.themeManager.getAccentColor.callCount, 0);
});

QUnit.module('Line strategy', environment);

QUnit.test('Types', function(assert) {
    assert.strictEqual(lineStrategyLineString.type, 'line', 'type');
    assert.strictEqual(lineStrategyLineString.elementType, undefined, 'element type');
    assert.strictEqual(lineStrategyLineString.fullType, 'line', 'full type');
});

QUnit.test('Draw', function(assert) {
    const figure = {};

    lineStrategyLineString.draw(this.context, figure, 'test-data');

    assert.deepEqual(this.renderer.path.lastCall.args, [[], 'line'], 'area is created');
    assert.strictEqual(figure.root, this.renderer.path.lastCall.returnValue, 'area');
    assert.deepEqual(figure.root.data.lastCall.args, ['data-key', 'test-data'], 'data');
});

QUnit.test('Get label offset', function(assert) {
    const label1 = { size: [10, 20], spaceSize: [30, 40], text: new vizMocks.Element() };
    const label2 = { size: [30, 20], spaceSize: [30, 40], text: new vizMocks.Element() };
    const label3 = { size: [10, 40], spaceSize: [30, 40], text: new vizMocks.Element() };
    const label4 = { size: [30, 40], spaceSize: [30, 40], text: new vizMocks.Element() };

    assert.deepEqual(lineStrategyLineString.getLabelOffset(label1), [0, 0], 'offset 1');
    assert.deepEqual(label1.text.attr.lastCall.args, [{ visibility: null }], 'visibility 1');

    assert.deepEqual(lineStrategyLineString.getLabelOffset(label2), [0, 0], 'offset 2');
    assert.deepEqual(label2.text.attr.lastCall.args, [{ visibility: null }], 'visibility 2');

    assert.deepEqual(lineStrategyLineString.getLabelOffset(label3), [0, 0], 'offset 3');
    assert.deepEqual(label3.text.attr.lastCall.args, [{ visibility: null }], 'visibility 3');

    assert.deepEqual(lineStrategyLineString.getLabelOffset(label4), [0, 0], 'offset 4');
    assert.deepEqual(label4.text.attr.lastCall.args, [{ visibility: 'hidden' }], 'visibility 4');
});

QUnit.test('Get styles', function(assert) {
    assert.deepEqual(lineStrategyLineString.getStyles({
        color: 'c1', borderWidth: 1, opacity: 'o1',
        hoveredColor: 'c2', hoveredBorderWidth: 2, hoveredOpacity: 'o2',
        selectedColor: 'c3', selectedBorderWidth: 3, selectedOpacity: 'o3'
    }), {
        root: [
            { 'class': 'dxm-line', stroke: 'c1', 'stroke-width': 1, opacity: 'o1' },
            { 'class': 'dxm-line dxm-line-hovered', stroke: 'c2', 'stroke-width': 2, opacity: 'o2' },
            { 'class': 'dxm-line dxm-line-selected', stroke: 'c3', 'stroke-width': 3, opacity: 'o3' }
        ]
    });
});

QUnit.test('Get styles, zero values', function(assert) {
    assert.deepEqual(lineStrategyLineString.getStyles({
        color: 'c1', borderWidth: 0, opacity: 0,
        hoveredColor: 'c2', hoveredBorderWidth: 0, hoveredOpacity: 0,
        selectedColor: 'c3', selectedBorderWidth: 0, selectedOpacity: 0
    }), {
        root: [
            { 'class': 'dxm-line', stroke: 'c1', 'stroke-width': 0, opacity: 0 },
            { 'class': 'dxm-line dxm-line-hovered', stroke: 'c2', 'stroke-width': 0, opacity: 0 },
            { 'class': 'dxm-line dxm-line-selected', stroke: 'c3', 'stroke-width': 0, opacity: 0 }
        ]
    });
});

QUnit.test('Set state', function(assert) {
    const figure = { root: new vizMocks.Element() };
    const style = { tag: 'style' };

    lineStrategyLineString.setState(figure, { root: [null, style, null] }, 1);

    assert.deepEqual(figure.root.attr.lastCall.args, [style]);
});

QUnit.test('Has labels group', function(assert) {
    assert.strictEqual(lineStrategyLineString.hasLabelsGroup, true);
});

QUnit.test('Update grouping', function(assert) {
    stubGroupByColor.reset();

    lineStrategyLineString.updateGrouping(this.context);

    assert.deepEqual(stubGroupByColor.lastCall.args, [this.context], 'group by color');
});

QUnit.test('GetDefaultColor - returns nothing', function(assert) {
    this.context.params = {
        themeManager: { getAccentColor: sinon.stub().returns('default color') }
    };

    const result = lineStrategyLineString.getDefaultColor(this.context, 'test palette');

    assert.strictEqual(result, undefined);
    assert.strictEqual(this.context.params.themeManager.getAccentColor.callCount, 0);
});

QUnit.module('Point strategy', environment);

QUnit.test('Get label offset', function(assert) {
    assert.deepEqual(pointDotStrategy.getLabelOffset({ size: [20, 10] }, { size: 5 }), [15, 0]);
});

QUnit.test('Has labels group', function(assert) {
    assert.strictEqual(pointDotStrategy.hasLabelsGroup, false);
});

QUnit.test('Update grouping', function(assert) {
    stubPerformGrouping.reset();
    stubGroupByColor.reset();

    pointDotStrategy.updateGrouping(this.context);

    assert.deepEqual(stubGroupByColor.lastCall.args, [this.context], 'group by color');
    assert.deepEqual(stubGroupBySize.lastCall.args, [this.context], 'group by size');
});

QUnit.test('Get default color', function(assert) {
    const getAccentColor = sinon.stub().returns('default color');
    const context = {
        params: {
            themeManager: { getAccentColor: getAccentColor }
        }
    };

    const result = pointDotStrategy.getDefaultColor(context, 'test palette');

    assert.equal(result, 'default color');
    assert.deepEqual(context.params.themeManager.getAccentColor.lastCall.args, ['test palette']);
});

QUnit.module('Point dot strategy', environment);

QUnit.test('Types', function(assert) {
    assert.strictEqual(pointDotStrategy.type, 'marker', 'type');
    assert.strictEqual(pointDotStrategy.elementType, 'dot', 'element type');
    assert.strictEqual(pointDotStrategy.fullType, 'marker:dot', 'full type');
});

QUnit.test('Setup', function(assert) {
    pointDotStrategy.setup(this.context);

    assert.deepEqual(this.renderer.shadowFilter.lastCall.args, ['-40%', '-40%', '180%', '200%', 0, 1, 1, '#000000', 0.2]);
    assert.strictEqual(this.context.filter, this.renderer.shadowFilter.lastCall.returnValue);
});

QUnit.test('Reset', function(assert) {
    const filter = this.context.filter = new vizMocks.Element();
    pointDotStrategy.reset(this.context);

    assert.deepEqual(filter.dispose.lastCall.args, []);
    assert.strictEqual(this.context.filter, null);
});

QUnit.test('Draw', function(assert) {
    const figure = {};

    pointDotStrategy.draw(this.context, figure, 'test-data');

    assert.deepEqual(this.renderer.g.lastCall.args, [], 'root is created');
    assert.deepEqual(this.renderer.circle.getCall(0).args, [], 'back is created');
    assert.deepEqual(this.renderer.circle.getCall(1).args, [], 'dot is created');

    assert.strictEqual(figure.root, this.renderer.g.lastCall.returnValue, 'root');
    assert.strictEqual(figure.back, this.renderer.circle.getCall(0).returnValue, 'back');
    assert.strictEqual(figure.dot, this.renderer.circle.getCall(1).returnValue, 'dot');

    assert.deepEqual(figure.back.sharp.lastCall.args, [], 'back is sharped');
    assert.deepEqual(figure.dot.sharp.lastCall.args, [], 'dot is sharped');
    assert.deepEqual(figure.back.data.lastCall.args, ['data-key', 'test-data'], 'back data');
    assert.deepEqual(figure.dot.data.lastCall.args, ['data-key', 'test-data'], 'dot data');

    assert.deepEqual(figure.back.append.lastCall.args, [figure.root], 'back is appended');
    assert.deepEqual(figure.dot.append.lastCall.args, [figure.root], 'dot is appended');
});

QUnit.test('Refresh', function(assert) {
    const figure = { dot: new vizMocks.Element() };
    this.context.filter = { id: 'test-filter' };

    pointDotStrategy.refresh(this.context, figure, null, null, { shadow: true });
    assert.deepEqual(figure.dot.attr.lastCall.args, [{ filter: 'test-filter' }]);
    pointDotStrategy.refresh(this.context, figure, null, null, { shadow: false });
    assert.deepEqual(figure.dot.attr.lastCall.args, [{ filter: null }]);
});

QUnit.test('Get styles', function(assert) {
    assert.deepEqual(pointDotStrategy.getStyles({
        size: 8,
        selectedStep: 2,
        backStep: 3,

        borderColor: 'c1', borderWidth: 1, color: 'c2', opacity: 'o1',
        hoveredBorderColor: 'c3', hoveredBorderWidth: 2, hoveredColor: 'c4', hoveredOpacity: 'o2',
        selectedBorderColor: 'c5', selectedBorderWidth: 3, selectedColor: 'c6', selectedOpacity: 'o3',

        backColor: 'c7', backOpacity: 0.4
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        back: [
            { fill: 'c7', opacity: 0.4, r: 4, stroke: 'none', 'stroke-width': 0 },
            { fill: 'c7', opacity: 0.4, r: 5.5, stroke: 'none', 'stroke-width': 0 },
            { fill: 'c7', opacity: 0.4, r: 6.5, stroke: 'none', 'stroke-width': 0 }
        ],
        dot: [
            { fill: 'c2', r: 4, stroke: 'c1', 'stroke-width': 1, opacity: 'o1' },
            { fill: 'c4', r: 4, stroke: 'c3', 'stroke-width': 2, opacity: 'o2' },
            { fill: 'c6', r: 5, stroke: 'c5', 'stroke-width': 3, opacity: 'o3' }
        ]
    });
});

QUnit.test('Get styles, zero values', function(assert) {
    assert.deepEqual(pointDotStrategy.getStyles({
        size: 8,
        selectedStep: 2,
        backStep: 3,

        borderColor: 'c1', borderWidth: 0, color: 'c2', opacity: 0,
        hoveredBorderColor: 'c3', hoveredBorderWidth: 0, hoveredColor: 'c4', hoveredOpacity: 0,
        selectedBorderColor: 'c5', selectedBorderWidth: 0, selectedColor: 'c6', selectedOpacity: 0,

        backColor: 'c7', backOpacity: 0
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        back: [
            { fill: 'c7', opacity: 0, r: 4, stroke: 'none', 'stroke-width': 0 },
            { fill: 'c7', opacity: 0, r: 5.5, stroke: 'none', 'stroke-width': 0 },
            { fill: 'c7', opacity: 0, r: 6.5, stroke: 'none', 'stroke-width': 0 }
        ],
        dot: [
            { fill: 'c2', r: 4, stroke: 'c1', 'stroke-width': 0, opacity: 0 },
            { fill: 'c4', r: 4, stroke: 'c3', 'stroke-width': 0, opacity: 0 },
            { fill: 'c6', r: 5, stroke: 'c5', 'stroke-width': 0, opacity: 0 }
        ]
    });
});

QUnit.test('Set state', function(assert) {
    const figure = { root: new vizMocks.Element(), back: new vizMocks.Element(), dot: new vizMocks.Element() };
    const rootStyle = { tag: 'root' };
    const backStyle = { tag: 'back' };
    const dotStyle = { tag: 'dot' };

    pointDotStrategy.setState(figure, {
        root: [null, null, rootStyle],
        back: [null, null, backStyle],
        dot: [null, null, dotStyle]
    }, 2);

    assert.deepEqual(figure.root.attr.lastCall.args, [rootStyle], 'root');
    assert.deepEqual(figure.back.attr.lastCall.args, [backStyle], 'back');
    assert.deepEqual(figure.dot.attr.lastCall.args, [dotStyle], 'dot');
});

QUnit.module('Point bubble strategy', environment);

QUnit.test('Types', function(assert) {
    assert.strictEqual(pointBubbleStrategy.type, 'marker', 'type');
    assert.strictEqual(pointBubbleStrategy.elementType, 'bubble', 'element type');
    assert.strictEqual(pointBubbleStrategy.fullType, 'marker:bubble', 'full type');
});

QUnit.test('Draw', function(assert) {
    const figure = {};

    pointBubbleStrategy.draw(this.context, figure, 'test-data');

    assert.deepEqual(this.renderer.g.lastCall.args, [], 'root is created');
    assert.deepEqual(this.renderer.circle.lastCall.args, [], 'bubble is created');

    assert.strictEqual(figure.root, this.renderer.g.lastCall.returnValue, 'root');
    assert.strictEqual(figure.bubble, this.renderer.circle.lastCall.returnValue, 'bubble');

    assert.deepEqual(figure.bubble.sharp.lastCall.args, [], 'bubble is sharped');
    assert.deepEqual(figure.bubble.data.lastCall.args, ['data-key', 'test-data'], 'bubble data');

    assert.deepEqual(figure.bubble.append.lastCall.args, [figure.root], 'bubble is appended');
});

QUnit.test('Refresh', function(assert) {
    const figure = { bubble: new vizMocks.Element() };

    pointBubbleStrategy.refresh(this.context, figure, null, null, { size: 8 });

    assert.deepEqual(figure.bubble.attr.lastCall.args, [{ r: 4 }]);
});

QUnit.test('Get styles', function(assert) {
    assert.deepEqual(pointBubbleStrategy.getStyles({
        borderColor: 'c1', borderWidth: 1, color: 'c2', opacity: 0.1,
        hoveredBorderColor: 'c3', hoveredBorderWidth: 2, hoveredColor: 'c4', hoveredOpacity: 0.2,
        selectedBorderColor: 'c5', selectedBorderWidth: 3, selectedColor: 'c6', selectedOpacity: 0.3
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        bubble: [
            { fill: 'c2', stroke: 'c1', 'stroke-width': 1, opacity: 0.1 },
            { fill: 'c4', stroke: 'c3', 'stroke-width': 2, opacity: 0.2 },
            { fill: 'c6', stroke: 'c5', 'stroke-width': 3, opacity: 0.3 }
        ]
    });
});

QUnit.test('Get styles, zero values', function(assert) {
    assert.deepEqual(pointBubbleStrategy.getStyles({
        borderColor: 'c1', borderWidth: 0, color: 'c2', opacity: 0,
        hoveredBorderColor: 'c3', hoveredBorderWidth: 0, hoveredColor: 'c4', hoveredOpacity: 0,
        selectedBorderColor: 'c5', selectedBorderWidth: 0, selectedColor: 'c6', selectedOpacity: 0
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        bubble: [
            { fill: 'c2', stroke: 'c1', 'stroke-width': 0, opacity: 0 },
            { fill: 'c4', stroke: 'c3', 'stroke-width': 0, opacity: 0 },
            { fill: 'c6', stroke: 'c5', 'stroke-width': 0, opacity: 0 }
        ]
    });
});

QUnit.test('Set state', function(assert) {
    const figure = { root: new vizMocks.Element(), bubble: new vizMocks.Element() };
    const rootStyle = { tag: 'root' };
    const bubbleStyle = { tag: 'back' };

    pointBubbleStrategy.setState(figure, {
        root: [rootStyle, null],
        bubble: [bubbleStyle, null],
    }, 0);

    assert.deepEqual(figure.root.attr.lastCall.args, [rootStyle], 'root');
    assert.deepEqual(figure.bubble.attr.lastCall.args, [bubbleStyle], 'bubble');
});

QUnit.test('Arrange', function(assert) {
    const elements = $.map([2.3, 5, 2, 8, 4.4], function(val) {
        return {
            proxy: { attribute: sinon.stub().returns(val) },
            _settings: {}
        };
    });
    this.context.settings = { minSize: 10, maxSize: 20, dataField: 'data-field' };
    this.context.params = {
        dataExchanger: { set: sinon.spy() }
    };

    pointBubbleStrategy.arrange(this.context, elements);

    assert.strictEqual(elements[0]._settings.size, 10.5, 'size 1');
    assert.strictEqual(elements[1]._settings.size, 15, 'size 2');
    assert.strictEqual(elements[2]._settings.size, 10, 'size 3');
    assert.strictEqual(elements[3]._settings.size, 20, 'size 4');
    assert.strictEqual(elements[4]._settings.size, 14, 'size 5');
    assert.deepEqual(elements[0].proxy.attribute.lastCall.args, ['data-field'], 'attribute 1');
    assert.deepEqual(elements[1].proxy.attribute.lastCall.args, ['data-field'], 'attribute 2');
    assert.deepEqual(elements[2].proxy.attribute.lastCall.args, ['data-field'], 'attribute 3');
    assert.deepEqual(elements[3].proxy.attribute.lastCall.args, ['data-field'], 'attribute 4');
    assert.deepEqual(elements[4].proxy.attribute.lastCall.args, ['data-field'], 'attribute 5');
});

QUnit.test('Arrange / value', function(assert) {
    const elements = $.map([2.3, 5, 2, 8, 4.4], function(val) {
        return {
            proxy: {
                attribute: sinon.spy(function() {
                    return val;
                }), value: val
            },
            _settings: {}
        };
    });
    this.context.settings = { minSize: 10, maxSize: 20, dataField: 'data-field' };
    this.context.params = {
        dataExchanger: { set: sinon.spy() }
    };

    pointBubbleStrategy.arrange(this.context, elements);

    assert.strictEqual(elements[0]._settings.size, 10.5, 'size 1');
    assert.strictEqual(elements[1]._settings.size, 15, 'size 2');
    assert.strictEqual(elements[2]._settings.size, 10, 'size 3');
    assert.strictEqual(elements[3]._settings.size, 20, 'size 4');
    assert.strictEqual(elements[4]._settings.size, 14, 'size 5');
    assert.deepEqual(elements[0].proxy.attribute.lastCall.args, ['data-field'], 'attribute 1');
    assert.deepEqual(elements[1].proxy.attribute.lastCall.args, ['data-field'], 'attribute 2');
    assert.deepEqual(elements[2].proxy.attribute.lastCall.args, ['data-field'], 'attribute 3');
    assert.deepEqual(elements[3].proxy.attribute.lastCall.args, ['data-field'], 'attribute 4');
    assert.deepEqual(elements[4].proxy.attribute.lastCall.args, ['data-field'], 'attribute 5');
});

QUnit.test('Arrange with grouping', function(assert) {
    this.context.settings = { sizeGroups: [1, 2] };
    this.context.params = {
        dataExchanger: { set: sinon.spy() }
    };

    pointBubbleStrategy.arrange(this.context, []);

    assert.ok(true);
});

QUnit.test('GetDefaultColor - use theme manager to get palette\'s accent color', function(assert) {
    this.context.params = {
        themeManager: { getAccentColor: sinon.stub().returns('default color') }
    };

    const result = pointBubbleStrategy.getDefaultColor(this.context, 'test palette');

    assert.equal(result, 'default color');
    assert.deepEqual(this.context.params.themeManager.getAccentColor.lastCall.args, ['test palette']);
});

QUnit.test('Update grouping', function(assert) {
    stubGroupByColor.reset();
    stubGroupBySize.reset();
    this.context.settings = { dataField: 'data-field' };

    pointBubbleStrategy.updateGrouping(this.context);

    assert.deepEqual(stubGroupByColor.lastCall.args, [this.context], 'group by color');
    assert.deepEqual(stubGroupBySize.getCall(0).args, [this.context], 'group by size 1');
    const callback = stubGroupBySize.lastCall.args[1];
    assert.deepEqual(stubGroupBySize.getCall(1).args, [this.context, callback], 'group by size 2');

    const proxy = { attribute: sinon.stub().returns('test-1') };
    assert.strictEqual(callback(proxy), 'test-1', 'callback return value 1');
    assert.deepEqual(proxy.attribute.getCall(0).args, ['data-field'], 'data field 1');
    proxy.attribute.returns(null);
    proxy.value = 'test-2';
    assert.strictEqual(callback(proxy), null, 'callback return value 2');
    assert.deepEqual(proxy.attribute.getCall(1).args, ['data-field'], 'data field 2');
});

QUnit.module('Point pie strategy', environment);

QUnit.test('Types', function(assert) {
    assert.strictEqual(pointPieStrategy.type, 'marker', 'type');
    assert.strictEqual(pointPieStrategy.elementType, 'pie', 'element type');
    assert.strictEqual(pointPieStrategy.fullType, 'marker:pie', 'full type');
});

QUnit.test('Draw', function(assert) {
    const figure = {};

    pointPieStrategy.draw(this.context, figure, 'test-data');

    assert.deepEqual(this.renderer.g.firstCall.args, [], 'root is created');
    assert.deepEqual(this.renderer.g.lastCall.args, [], 'pie is created');
    assert.deepEqual(this.renderer.circle.lastCall.args, [], 'border is created');

    assert.strictEqual(figure.root, this.renderer.g.firstCall.returnValue, 'root');
    assert.strictEqual(figure.pie, this.renderer.g.lastCall.returnValue, 'pie');
    assert.strictEqual(figure.border, this.renderer.circle.lastCall.returnValue, 'border');

    assert.deepEqual(figure.border.sharp.lastCall.args, [], 'border is sharped');
    assert.deepEqual(figure.border.data.lastCall.args, ['data-key', 'test-data'], 'border data');

    assert.deepEqual(figure.pie.append.lastCall.args, [figure.root], 'pie is appended');
    assert.deepEqual(figure.border.append.lastCall.args, [figure.root], 'border is appended');
});

QUnit.test('Refresh', function(assert) {
    const figure = { pie: new vizMocks.Element(), border: new vizMocks.Element() };
    const stub = sinon.stub().returns([1, 2, 3]);
    this.context.settings = { dataField: 'data-field' };

    pointPieStrategy.refresh(this.context, figure, 'test-data',
        { attribute: stub },
        { _colors: ['c1', 'c2', 'c3'], size: 8 });

    assert.deepEqual(stub.lastCall.args, ['data-field'], 'attribute');
    assert.strictEqual(this.renderer.arc.callCount, 3, 'count');
    assert.deepEqual(this.renderer.arc.getCall(0).args, [0, 0, 0, 4, 90, 150], 'arc 1 is created');
    assert.deepEqual(this.renderer.arc.getCall(0).returnValue.attr.lastCall.args, [{ 'stroke-linejoin': 'round', fill: 'c1' }], 'arc 1 settings');
    assert.deepEqual(this.renderer.arc.getCall(0).returnValue.data.lastCall.args, ['data-key', 'test-data'], 'arc 1 data');
    assert.deepEqual(this.renderer.arc.getCall(1).args, [0, 0, 0, 4, 150, 270], 'arc 2 is created');
    assert.deepEqual(this.renderer.arc.getCall(1).returnValue.attr.lastCall.args, [{ 'stroke-linejoin': 'round', fill: 'c2' }], 'arc 2 settings');
    assert.deepEqual(this.renderer.arc.getCall(1).returnValue.data.lastCall.args, ['data-key', 'test-data'], 'arc 2 data');
    assert.deepEqual(this.renderer.arc.getCall(2).args, [0, 0, 0, 4, 270, 450], 'arc 3 is created');
    assert.deepEqual(this.renderer.arc.getCall(2).returnValue.attr.lastCall.args, [{ 'stroke-linejoin': 'round', fill: 'c3' }], 'arc 3 settings');
    assert.deepEqual(this.renderer.arc.getCall(2).returnValue.data.lastCall.args, ['data-key', 'test-data'], 'arc 3 data');
    assert.deepEqual(figure.border.attr.lastCall.args, [{ r: 4 }], 'border');
});

QUnit.test('Refresh / values', function(assert) {
    const figure = { pie: new vizMocks.Element(), border: new vizMocks.Element() };
    this.context.settings = { dataField: 'data-field' };

    pointPieStrategy.refresh(this.context, figure, 'test-data',
        {
            attribute: function() {
                return this.values;
            },
            values: [1, 2, 3]
        },
        { _colors: ['c1', 'c2', 'c3'], size: 8 });

    assert.strictEqual(this.renderer.arc.callCount, 3, 'count');
    assert.deepEqual(this.renderer.arc.getCall(0).args, [0, 0, 0, 4, 90, 150], 'arc 1 is created');
    assert.deepEqual(this.renderer.arc.getCall(0).returnValue.attr.lastCall.args, [{ 'stroke-linejoin': 'round', fill: 'c1' }], 'arc 1 settings');
    assert.deepEqual(this.renderer.arc.getCall(0).returnValue.data.lastCall.args, ['data-key', 'test-data'], 'arc 1 data');
    assert.deepEqual(this.renderer.arc.getCall(1).args, [0, 0, 0, 4, 150, 270], 'arc 2 is created');
    assert.deepEqual(this.renderer.arc.getCall(1).returnValue.attr.lastCall.args, [{ 'stroke-linejoin': 'round', fill: 'c2' }], 'arc 2 settings');
    assert.deepEqual(this.renderer.arc.getCall(1).returnValue.data.lastCall.args, ['data-key', 'test-data'], 'arc 2 data');
    assert.deepEqual(this.renderer.arc.getCall(2).args, [0, 0, 0, 4, 270, 450], 'arc 3 is created');
    assert.deepEqual(this.renderer.arc.getCall(2).returnValue.attr.lastCall.args, [{ 'stroke-linejoin': 'round', fill: 'c3' }], 'arc 3 settings');
    assert.deepEqual(this.renderer.arc.getCall(2).returnValue.data.lastCall.args, ['data-key', 'test-data'], 'arc 3 data');
    assert.deepEqual(figure.border.attr.lastCall.args, [{ r: 4 }], 'border');
});

QUnit.test('Get styles', function(assert) {
    assert.deepEqual(pointPieStrategy.getStyles({
        borderColor: 'c1', borderWidth: 1, opacity: 0.1,
        hoveredBorderColor: 'c2', hoveredBorderWidth: 2, hoveredOpacity: 0.2,
        selectedBorderColor: 'c3', selectedBorderWidth: 3, selectedOpacity: 0.3
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        pie: [
            { opacity: 0.1 },
            { opacity: 0.2 },
            { opacity: 0.3 }
        ],
        border: [
            { stroke: 'c1', 'stroke-width': 1 },
            { stroke: 'c2', 'stroke-width': 2 },
            { stroke: 'c3', 'stroke-width': 3 }
        ]
    });
});

QUnit.test('Get styles, zero values', function(assert) {
    assert.deepEqual(pointPieStrategy.getStyles({
        borderColor: 'c1', borderWidth: 0, opacity: 0,
        hoveredBorderColor: 'c2', hoveredBorderWidth: 0, hoveredOpacity: 0,
        selectedBorderColor: 'c3', selectedBorderWidth: 0, selectedOpacity: 0
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        pie: [
            { opacity: 0 },
            { opacity: 0 },
            { opacity: 0 }
        ],
        border: [
            { stroke: 'c1', 'stroke-width': 0 },
            { stroke: 'c2', 'stroke-width': 0 },
            { stroke: 'c3', 'stroke-width': 0 }
        ]
    });
});

QUnit.test('Set state', function(assert) {
    const figure = { root: new vizMocks.Element(), pie: new vizMocks.Element(), border: new vizMocks.Element() };
    const rootStyle = { tag: 'root' };
    const pieStyle = { tag: 'pie' };
    const borderStyle = { tag: 'border' };

    pointPieStrategy.setState(figure, {
        root: [null, rootStyle],
        pie: [null, pieStyle],
        border: [null, borderStyle]
    }, 1);

    assert.deepEqual(figure.root.attr.lastCall.args, [rootStyle], 'root');
    assert.deepEqual(figure.pie.attr.lastCall.args, [pieStyle], 'pie');
    assert.deepEqual(figure.border.attr.lastCall.args, [borderStyle], 'border');
});

QUnit.test('Arrange', function(assert) {
    const generateColors = sinon.stub();
    const createPalette = sinon.stub().returns({ generateColors: generateColors });
    const set = sinon.spy();
    this.context.name = 'test-name';
    this.context.grouping = {};
    this.context.params = {
        themeManager: { createPalette: createPalette },
        dataExchanger: { set: set }
    };

    generateColors.returns(['c1', 'c2', 'c3']);
    this.context.settings = { palette: 'test-palette' };

    pointPieStrategy.arrange(this.context, [
        { proxy: { attribute: sinon.stub().returns([1, 2]) } },
        { proxy: { attribute: sinon.stub().returns([1, 2, 3]) } },
        { proxy: { attribute: sinon.stub().returns([1]) } }
    ]);

    assert.deepEqual(createPalette.lastCall.args, ['test-palette', { useHighlight: true, extensionMode: 'alternate' }], 'palette');
    assert.strictEqual(generateColors.callCount, 1, 'generate colors');
    assert.deepEqual(this.context.settings._colors, ['c1', 'c2', 'c3'], 'colors');
    assert.deepEqual(this.context.grouping, { color: { callback: noop, field: '', partition: [], values: [] } }, 'grouping');
    assert.deepEqual(set.lastCall.args, ['test-name', 'color', { partition: [], values: ['c1', 'c2', 'c3'] }], 'data is set');
});

// T712894
QUnit.test('Refresh. All values is zero', function(assert) {
    const figure = { pie: new vizMocks.Element(), border: new vizMocks.Element() };
    this.context.settings = { dataField: 'data-field' };

    pointPieStrategy.refresh(this.context, figure, 'test-data',
        {
            attribute: function() {
                return this.values;
            },
            values: [0, 0, 0, 0]
        },
        { _colors: ['c1', 'c2', 'c3'], size: 8 });

    assert.strictEqual(this.renderer.arc.callCount, 4, 'count');
    assert.deepEqual(this.renderer.arc.getCall(0).args, [0, 0, 0, 4, 90, 180], 'arc 1 is created');
    assert.deepEqual(this.renderer.arc.getCall(1).args, [0, 0, 0, 4, 180, 270], 'arc 2 is created');
    assert.deepEqual(this.renderer.arc.getCall(2).args, [0, 0, 0, 4, 270, 360], 'arc 3 is created');
    assert.deepEqual(this.renderer.arc.getCall(3).args, [0, 0, 0, 4, 360, 450], 'arc 4 is created');
});

QUnit.module('Point image strategy', environment);

QUnit.test('Types', function(assert) {
    assert.strictEqual(pointImageStrategy.type, 'marker', 'type');
    assert.strictEqual(pointImageStrategy.elementType, 'image', 'element type');
    assert.strictEqual(pointImageStrategy.fullType, 'marker:image', 'full type');
});

QUnit.test('Draw', function(assert) {
    const figure = {};

    pointImageStrategy.draw(this.context, figure, 'test-data');

    assert.deepEqual(this.renderer.g.lastCall.args, [], 'root is created');
    assert.deepEqual(this.renderer.image.lastCall.args, [null, null, null, null, null, 'center'], 'image is created');
    assert.strictEqual(figure.root, this.renderer.g.lastCall.returnValue, 'root');
    assert.strictEqual(figure.image, this.renderer.image.lastCall.returnValue, 'image');
    assert.deepEqual(figure.image.attr.lastCall.args, [{ 'pointer-events': 'visible' }], 'image settings');// T567545
    assert.deepEqual(figure.image.data.lastCall.args, ['data-key', 'test-data'], 'image data');
    assert.deepEqual(figure.image.append.lastCall.args, [figure.root], 'image is appended');
});

QUnit.test('Refresh', function(assert) {
    const figure = { image: new vizMocks.Element() };
    const stub = sinon.stub().returns('test-url');
    this.context.settings = { dataField: 'data-field' };

    pointImageStrategy.refresh(this.context, figure, null, { attribute: stub });

    assert.deepEqual(stub.lastCall.args, ['data-field'], 'attribute');
    assert.deepEqual(figure.image.attr.lastCall.args, [{ href: 'test-url' }], 'settings');
});

QUnit.test('Refresh / url', function(assert) {
    const figure = { image: new vizMocks.Element() };
    const stub = sinon.spy(function() {
        return this.url;
    });
    this.context.settings = { dataField: 'data-field' };

    pointImageStrategy.refresh(this.context, figure, null, { attribute: stub, url: 'test-url' });

    assert.deepEqual(stub.lastCall.args, ['data-field'], 'attribute');
    assert.deepEqual(figure.image.attr.lastCall.args, [{ href: 'test-url' }], 'settings');
});

QUnit.test('Get styles', function(assert) {
    assert.deepEqual(pointImageStrategy.getStyles({
        size: 10, hoveredStep: 2, selectedStep: 8,
        opacity: 'o1',
        hoveredOpacity: 'o2',
        selectedOpacity: 'o3'
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        image: [
            { x: -5, y: -5, width: 10, height: 10, opacity: 'o1' },
            { x: -6, y: -6, width: 12, height: 12, opacity: 'o2' },
            { x: -9, y: -9, width: 18, height: 18, opacity: 'o3' }
        ]
    });
});

QUnit.test('Get styles, zero values', function(assert) {
    assert.deepEqual(pointImageStrategy.getStyles({
        size: 10, hoveredStep: 2, selectedStep: 8,
        opacity: 0,
        hoveredOpacity: 0,
        selectedOpacity: 0
    }), {
        root: [
            { 'class': 'dxm-marker' },
            { 'class': 'dxm-marker dxm-marker-hovered' },
            { 'class': 'dxm-marker dxm-marker-selected' }
        ],
        image: [
            { x: -5, y: -5, width: 10, height: 10, opacity: 0 },
            { x: -6, y: -6, width: 12, height: 12, opacity: 0 },
            { x: -9, y: -9, width: 18, height: 18, opacity: 0 }
        ]
    });
});

QUnit.test('Set state', function(assert) {
    const figure = { root: new vizMocks.Element(), image: new vizMocks.Element() };
    const rootStyle = { tag: 'root' };
    const imageStyle = { tag: 'pie' };

    pointImageStrategy.setState(figure, {
        root: [null, rootStyle],
        image: [null, imageStyle]
    }, 1);

    assert.deepEqual(figure.root.attr.lastCall.args, [rootStyle], 'root');
    assert.deepEqual(figure.image.attr.lastCall.args, [imageStyle], 'image');
});
