var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    vizMocks = require('../../helpers/vizMocks.js'),
    axisModule = require('viz/axes/base_axis'),
    labelModule = require('viz/series/points/label'),
    layoutElementModule = require('viz/core/layout_element'),
    layoutManagerModule = require('viz/chart_components/layout_manager');

var canvasTemplate = {
        width: 1000,
        height: 400,
        top: 10,
        bottom: 20,
        left: 30,
        right: 40
    },
    canvas,
    Axis = vizMocks.stubClass(axisModule.Axis),
    LayoutElement = vizMocks.stubClass(layoutElementModule.LayoutElement);

var environment = {
    beforeEach: function() {
        this.canvas = {
            left: 0, right: 10, width: 110,
            top: 0, bottom: 10, height: 110
        };
        this.commonBBox = { height: 20, width: 20 };
    },
    afterEach: function() {
    },
    createLayoutManager: function(options) {
        var layoutManager = new layoutManagerModule.LayoutManager();
        layoutManager.setOptions(options || { width: 10, height: 10 });
        return layoutManager;
    },
    createLayoutElement: function(bBox) {
        var that = this,
            options = $.extend({}, this.commonBBox, bBox),
            layoutElement = new LayoutElement(options),
            empty = $.extend({}, options, { width: 0, height: 0 });

        layoutElement.stub('getLayoutOptions').returns(options);
        layoutElement.probeDraw = sinon.stub();
        layoutElement.stub('position').returnsThis();
        layoutElement.draw = sinon.spy(function() {
            if(!that.checkLayoutElementVisibility(layoutElement)) {
                layoutElement.getLayoutOptions.returns(empty);
            }
        });

        return layoutElement;
    },
    checkLayoutElementVisibility: function(layoutElement) {
        var layoutOptions = layoutElement.ctorArgs[0];

        return layoutElement.draw.lastCall.args[0] >= layoutOptions.width
                && layoutElement.draw.lastCall.args[1] >= layoutOptions.height;
    },
    getLayoutTargets: function() {
        return [{ canvas: this.canvas }];
    },
    createAxis: function() {
        var axis = new Axis();
        axis.stub('getBoundingRect').returns({ height: 0, width: 0 });
        return axis;
    }
};

function setupCanvas() {
    canvas = $.extend(true, {}, canvasTemplate);
}
function createLayoutManager(options) {
    var layoutManager = new layoutManagerModule.LayoutManager(options);
    layoutManager.setOptions(options || { width: 160, height: 160 });
    return layoutManager;
}

function getStubSeries(type, innerRadius, points) {
    var stubSeries = new vizMocks.Series();


    stubSeries.type = type;

    stubSeries.stub('getVisiblePoints').returns(points || [createFakePointsWithStubLabels({}, true, false)]);
    stubSeries.correctLabelRadius = sinon.stub();
    stubSeries.setVisibleArea = sinon.stub();
    stubSeries.innerRadius = innerRadius;
    return [stubSeries];
}

function getNStubSeries(type, innerRadius, arrPoints) {
    var stubSeries = [];
    for(var i = 0; i < arrPoints.length; i++) {
        stubSeries = stubSeries.concat(getStubSeries(type, innerRadius, arrPoints[i]));
    }
    return stubSeries;
}

function createFakePointsWithStubLabels(bBox, isVisible, hasText, options) {
    var stubLabel = sinon.createStubInstance(labelModule.Label),
        fakePoint = {
            _label: stubLabel,
        };

    stubLabel.getBoundingRect.returns(bBox || {});
    stubLabel.isVisible.returns(hasText);
    stubLabel.getLayoutOptions.returns({ position: options && options.position || 'outside' });

    return fakePoint;
}

function checkLayout(assert, layout, canvas, inner, outer) {
    assert.strictEqual(layout.centerX, Math.floor((canvas.width - canvas.left - canvas.right) / 2 + canvas.left), 'centerX');
    assert.strictEqual(layout.centerY, Math.floor((canvas.height - canvas.top - canvas.bottom) / 2 + canvas.top), 'centerY');
    assert.strictEqual(layout.radiusInner, inner, 'radiusInner');
    assert.strictEqual(layout.radiusOuter, outer, 'radiusOuter');
}

QUnit.module('Lifecycle', environment);

QUnit.test('create layout manager', function(assert) {
    assert.ok(this.createLayoutManager() instanceof layoutManagerModule.LayoutManager);
});

QUnit.module('Pie series', {
    beforeEach: setupCanvas
});

QUnit.test('Simple pie. RadiusOuter equal height of canvas', function(assert) {
    var series = getStubSeries('pie'),
        layoutManager = createLayoutManager(),
        inner = 0,
        outer = (canvas.height - canvas.top - canvas.bottom) / 2;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple pie. RadiusOuter equal width of canvas', function(assert) {
    var series = getStubSeries('pie'),
        layoutManager = createLayoutManager(),
        inner = 0,
        outer = (canvasTemplate.height - canvas.left - canvas.right) / 2;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple pie - vertical canvas. width and height odd ', function(assert) {
    var series = getStubSeries('doughnut'),
        layoutManager = createLayoutManager(),
        inner = 111,
        outer = 223;

    canvas.width = 517;
    canvas.height = 517;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius less then 0.2', function(assert) {
    var series = getStubSeries('donut', 0),
        layoutManager = createLayoutManager(),
        inner = 33,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius more then 0.8', function(assert) {
    var series = getStubSeries('donut', 10),
        layoutManager = createLayoutManager(),
        inner = 132,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius is not number', function(assert) {
    var series = getStubSeries('donut', 'str'),
        layoutManager = createLayoutManager(),
        inner = 82,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius is valid number', function(assert) {
    var series = getStubSeries('donut', '0.7'),
        layoutManager = createLayoutManager(),
        inner = 115,
        outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('simple pie with diameter', function(assert) {
    var series = getStubSeries('pie'),
        layoutManager = createLayoutManager({ piePercentage: 0.4 }),
        inner = 0,
        outer = 80;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('simple donut with diameter', function(assert) {
    var series = getStubSeries('donut'),
        layoutManager = createLayoutManager({ piePercentage: 0.4 }),
        inner = 40,
        outer = 80;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.module('PieChart. Calculate radius charts with labels', {
    beforeEach: setupCanvas
});

QUnit.test('Nearest label topLeft', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 350, y: 100, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.6 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label topRight', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 650, y: 100, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 146;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label topCenter', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 490, y: 0, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 155;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label CenterLeft', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 300, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 155;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label CenterRight', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 650, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.6 }),
        inner = 0,
        outer = 125;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomLeft', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 350, y: 300, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.6 }),
        inner = 0,
        outer = 141;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomRight', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.6 }),
        inner = 0,
        outer = 142;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomCenter', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.6 }),
        inner = 0,
        outer = 125;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Calculate of nearest label', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, true, true),
            CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.6 }),
        inner = 0,
        outer = 125;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Calculate of visible point with label with text', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, false, true),
            CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, false),
            CFPWSL({ x: 490, y: 0, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 142;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomLeft label closer then 0.7 R', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points = [CFPWSL({ x: 450, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('piePercentage was not set && hideLabels was set', function(assert) {
    var points = [createFakePointsWithStubLabels({ x: 450, y: 190, width: 10, height: 10 }, true, true)],
        series = getStubSeries('pie', null, points),
        layoutManager = createLayoutManager({}),
        inner = 0,
        outer = 185;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series, true), canvas, inner, outer);
});

QUnit.module('Multi series pie', {
    beforeEach: setupCanvas
});

QUnit.test('2 series, labels are fit in canvas', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 159);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 320,
        right: 330,
        top: 10,
        width: 1000
    });

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 184);
    assert.equal(series[1].setVisibleArea.callCount, 1);
    assert.deepEqual(series[1].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 300,
        right: 310,
        top: 10,
        width: 1000
    });
});

QUnit.test('2 series, labels are not fit in canvas', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 60, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 65, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 80;

    canvas.width = 300;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 110);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 32,
        right: 42,
        top: 10,
        width: 300
    });

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 112);
    assert.equal(series[1].setVisibleArea.callCount, 1);
    assert.deepEqual(series[1].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 30,
        right: 40,
        top: 10,
        width: 300
    });
});

QUnit.test('2 series, labels are not fit in canvas, check margins', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 40, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    canvas.width = 569;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 159);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 75,
        right: 85,
        top: 10,
        width: 569
    });

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 159 + 45);
    assert.equal(series[1].setVisibleArea.callCount, 1);
    assert.deepEqual(series[1].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 30,
        right: 40,
        top: 10,
        width: 569
    });
});

QUnit.test('2 series, diameter is set, labels are not fit in canvas', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 60, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 65, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ piePercentage: 0.5 }),
        inner = 0,
        outer = 75;

    canvas.width = 300;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 105);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 35,
        right: 45,
        top: 10,
        width: 300
    });

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 110);
    assert.equal(series[1].setVisibleArea.callCount, 1);
    assert.deepEqual(series[1].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 30,
        right: 40,
        top: 10,
        width: 300
    });
});

QUnit.test('2 series, first series has lables inside', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true, { position: 'inside' })],
        points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 0);
    assert.equal(series[0].setVisibleArea.callCount, 0);

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 159);
    assert.equal(series[1].setVisibleArea.callCount, 1);
    assert.deepEqual(series[1].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 325,
        right: 335,
        top: 10,
        width: 1000
    });
});

QUnit.test('3 series, labels one of the series have inside position', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true, { position: 'inside' })],
        points3 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2, points3]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 159);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 325,
        right: 335,
        top: 10,
        width: 1000
    });

    assert.equal(series[1].correctLabelRadius.callCount, 0);
    assert.equal(series[1].setVisibleArea.callCount, 0);

    assert.equal(series[2].correctLabelRadius.callCount, 1);
    assert.equal(series[2].correctLabelRadius.args[0][0], 179);
    assert.equal(series[2].setVisibleArea.callCount, 1);
    assert.deepEqual(series[2].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 305,
        right: 315,
        top: 10,
        width: 1000
    });
});

QUnit.test('3 series, labels one of the series have inside position, not fit in canvas', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 30, height: 10 }, true, true, { position: 'inside' })],
        points3 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2, points3]),
        layoutManager = createLayoutManager({ minPiePercentage: 0.7 }),
        inner = 0,
        outer = 80;

    canvas.width = 300;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 110);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 32,
        right: 42,
        top: 10,
        width: 300
    });

    assert.equal(series[1].correctLabelRadius.callCount, 0);
    assert.equal(series[1].setVisibleArea.callCount, 0);

    assert.equal(series[2].correctLabelRadius.callCount, 1);
    assert.equal(series[2].correctLabelRadius.args[0][0], 112);
    assert.equal(series[2].setVisibleArea.callCount, 1);
    assert.deepEqual(series[2].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 30,
        right: 40,
        top: 10,
        width: 300
    });
});

QUnit.test('correctPieLabelRadius', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({});

    layoutManager.correctPieLabelRadius(series, { radiusOuter: 129, centerX: 500 }, canvas);

    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 159);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 326,
        right: 326,
        top: 10,
        width: 1000
    });

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 184);
    assert.equal(series[1].setVisibleArea.callCount, 1);
    assert.deepEqual(series[1].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 306,
        right: 306,
        top: 10,
        width: 1000
    });
});

QUnit.test('correctPieLabelRadius when labels are not fit in canvas', function(assert) {
    var CFPWSL = createFakePointsWithStubLabels,
        points1 = [CFPWSL({ x: 400, y: 300, width: 30, height: 10 }, true, true)],
        points2 = [CFPWSL({ x: 400, y: 300, width: 35, height: 10 }, true, true)],
        series = getNStubSeries('pie', null, [points1, points2]),
        layoutManager = createLayoutManager({});

    canvas.width = 300;

    layoutManager.correctPieLabelRadius(series, { radiusOuter: 80, centerX: 150 }, canvas);

    assert.equal(series[0].correctLabelRadius.callCount, 1);
    assert.equal(series[0].correctLabelRadius.args[0][0], 110);
    assert.equal(series[0].setVisibleArea.callCount, 1);
    assert.deepEqual(series[0].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 35,
        right: 35,
        top: 10,
        width: 300
    });

    assert.equal(series[1].correctLabelRadius.callCount, 1);
    assert.equal(series[1].correctLabelRadius.args[0][0], 115);
    assert.equal(series[1].setVisibleArea.callCount, 1);
    assert.deepEqual(series[1].setVisibleArea.args[0][0], {
        bottom: 20,
        height: 400,
        left: 30,
        right: 30,
        top: 10,
        width: 300
    });
});

QUnit.module('Layout for equal pie charts', {
    beforeEach: setupCanvas
});

QUnit.test('Pie - inner radius is 0', function(assert) {
    var series = getStubSeries('pie'),
        layoutManager = createLayoutManager();

    assert.deepEqual(layoutManager.applyEqualPieChartLayout(series, { x: 100, y: 200, radius: 300 }), {
        centerX: 100,
        centerY: 200,
        radiusInner: 0,
        radiusOuter: 300
    });
});

QUnit.test('Donut - inner radius is calculated', function(assert) {
    var series = getStubSeries('donut', '0.5'),
        layoutManager = createLayoutManager();

    assert.deepEqual(layoutManager.applyEqualPieChartLayout(series, { x: 100, y: 200, radius: 300 }), {
        centerX: 100,
        centerY: 200,
        radiusInner: 150,
        radiusOuter: 300
    });
});

QUnit.module('check need space panes canvas');

QUnit.test('space sufficiently', function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 20, height: 300, top: 30, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.equal(updateSide, false);
});

QUnit.test('need width space', function(assert) {
    var panes = [{ canvas: { width: 200, left: 40, right: 20, height: 300, top: 30, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 0,
        width: 20
    });
});

QUnit.test('need height space', function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 20, height: 300, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 0
    });
});

QUnit.test('need both side space', function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 20
    });
});

QUnit.test('for several panes', function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } },
            { canvas: { width: 200, left: 10, right: 20, height: 300, top: 30, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 20
    });
});

QUnit.test('for several rotated panes', function(assert) {
    var panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } },
            { canvas: { width: 300, left: 145, right: 20, height: 300, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager();

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes, true);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 45
    });
});

QUnit.test('space with radius', function(assert) {
    var panes = [{ canvas: { width: 500, left: 110, right: 50, height: 500, top: 130, bottom: 40 } }],
        updateSide,
        layoutManager = createLayoutManager({ piePercentage: 0.7 });

    updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes, false, { width: 350, height: 350 });

    assert.deepEqual(updateSide, { height: 20, width: 10 });
});

QUnit.module('Layout elements', environment);

QUnit.test('draw elements. [Left Left]', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.equal(LE1.draw.callCount, 1);
    assert.equal(LE2.draw.callCount, 1);
    assert.equal(LE1.probeDraw.callCount, 1);
    assert.equal(LE2.probeDraw.callCount, 1);

    assert.deepEqual(LE1.probeDraw.getCall(0).args, [90, 100]);
    assert.deepEqual(LE2.probeDraw.getCall(0).args, [70, 100]);

    assert.deepEqual(LE1.draw.getCall(0).args, [20, 100]);
    assert.deepEqual(LE2.draw.getCall(0).args, [20, 100]);
});

QUnit.test('draw elements. [Top Top]', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.probeDraw.getCall(0).args, [100, 90]);
    assert.deepEqual(LE2.probeDraw.getCall(0).args, [100, 70]);
    assert.deepEqual(LE1.draw.getCall(0).args, [100, 20]);
    assert.deepEqual(LE2.draw.getCall(0).args, [100, 20]);
});

QUnit.test('draw elements. [Top Left]', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.probeDraw.getCall(0).args, [100, 90]);
    assert.deepEqual(LE2.probeDraw.getCall(0).args, [90, 80]);
    assert.deepEqual(LE1.draw.getCall(0).args, [80, 20]);
    assert.deepEqual(LE2.draw.getCall(0).args, [20, 80]);
});

QUnit.test('position elements. [Top Top]', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 40, width: 100, height: 60 }),
        my: { horizontal: 'center', vertical: 'bottom' },
        at: { horizontal: 'center', vertical: 'top' },
        offset: { horizontal: 0, vertical: -20 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 40, width: 100, height: 60 }),
        my: { horizontal: 'center', vertical: 'bottom' },
        at: { horizontal: 'center', vertical: 'top' },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test('draw elements. [Left Left]', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 40, y: 0, width: 60, height: 100 }),
        my: { horizontal: 'right', vertical: 'center' },
        at: { horizontal: 'left', vertical: 'center' },
        offset: { horizontal: -20, vertical: 0 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 40, y: 0, width: 60, height: 100 }),
        my: { horizontal: 'right', vertical: 'center' },
        at: { horizontal: 'left', vertical: 'center' },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test('position elements. [Top Right]', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'right', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'right' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 20, width: 80, height: 80 }),
        my: { horizontal: 'center', vertical: 'bottom' },
        at: { horizontal: 'center', vertical: 'top' },
        offset: { horizontal: 0, vertical: 0 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 20, width: 80, height: 80 }),
        my: { horizontal: 'left', vertical: 'center' },
        at: { horizontal: 'right', vertical: 'center' },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test('position elements. [Bottom Right Bottom Right]', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'bottom' }, cutSide: 'vertical', cutLayoutSide: 'bottom' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'right', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'right' }),
        LE3 = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'bottom' }, cutSide: 'vertical', cutLayoutSide: 'bottom' }),
        LE4 = this.createLayoutElement({ position: { horizontal: 'right', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'right' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE1, LE2, LE3, LE4], this.canvas, noop, []);

    assert.deepEqual(LE1.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: 'center', vertical: 'top' },
        at: { horizontal: 'center', vertical: 'bottom' },
        offset: { horizontal: 0, vertical: 20 }
    });
    assert.deepEqual(LE2.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: 'left', vertical: 'center' },
        at: { horizontal: 'right', vertical: 'center' },
        offset: { horizontal: 20, vertical: 0 }
    });
    assert.deepEqual(LE3.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: 'center', vertical: 'top' },
        at: { horizontal: 'center', vertical: 'bottom' },
        offset: { horizontal: 0, vertical: 0 }
    });
    assert.deepEqual(LE4.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 60, height: 60 }),
        my: { horizontal: 'left', vertical: 'center' },
        at: { horizontal: 'right', vertical: 'center' },
        offset: { horizontal: 0, vertical: 0 }
    });
});

QUnit.test('draw elements. getLayoutOptions returns null', function(assert) {
    var LE1 = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LE2 = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LM = this.createLayoutManager();

    LE1.getLayoutOptions.returns(null);
    LE2.getLayoutOptions.returns(null);
    LM.layoutElements([LE1, LE2], this.canvas, noop, []);

    assert.equal(LE1.draw.callCount, 0);
    assert.equal(LE2.draw.callCount, 0);
    assert.equal(LE1.probeDraw.callCount, 0);
    assert.equal(LE2.probeDraw.callCount, 0);
});

QUnit.test('cut canvas. left', function(assert) {
    var LE = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'center' }, cutSide: 'horizontal', cutLayoutSide: 'left' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE], this.canvas, noop, []);

    assert.deepEqual(this.canvas, {
        bottom: 10,
        height: 110,
        left: 20,
        right: 10,
        top: 0,
        width: 110
    });
});

QUnit.test('cut canvas. top', function(assert) {
    var LE = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE], this.canvas, noop, []);

    assert.deepEqual(this.canvas, {
        bottom: 10,
        height: 110,
        left: 0,
        right: 10,
        top: 20,
        width: 110
    });
});

QUnit.test('draw elements."[left top]"', function(assert) {
    var LE = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'top' }, cutSide: 'vertical', cutLayoutSide: 'top' }),
        LM = this.createLayoutManager();

    LM.layoutElements([LE], this.canvas, noop, []);

    assert.deepEqual(LE.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 20, width: 100, height: 80 }),
        my: { horizontal: 'left', vertical: 'bottom' },
        at: { horizontal: 'left', vertical: 'top' },
        offset: { vertical: 0, horizontal: 0 }
    });
});

QUnit.test('call draw axis method', function(assert) {
    var LayoutManager = this.createLayoutManager(),
        spyAxisDrawer = sinon.spy();

    LayoutManager.layoutElements([], this.canvas, spyAxisDrawer, []);

    assert.ok(spyAxisDrawer.calledOnce);
    assert.deepEqual(spyAxisDrawer.getCall(0).args, []);
});

QUnit.module('Adaptive layout', environment);

QUnit.test('One vertical element', function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 90 }),
        layoutElement = this.createLayoutElement({
            position: { horizontal: 'center', vertical: 'top' },
            cutSide: 'vertical',
            cutLayoutSide: 'top'
        });

    layoutManager.layoutElements(
        [layoutElement],
        this.canvas,
        noop,
        [{ canvas: this.canvas }],
        false,
        {}
    );

    assert.ok(!this.checkLayoutElementVisibility(layoutElement));
    assert.equal(this.canvas.top, 0);
    assert.equal(this.canvas.bottom, 10);
    assert.equal(this.canvas.left, 0);
    assert.equal(this.canvas.right, 10);
});

QUnit.test('Two vertical elements', function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 70 }),
        layoutElement1 = this.createLayoutElement({
            position: { horizontal: 'center', vertical: 'top' },
            cutSide: 'vertical',
            cutLayoutSide: 'top'
        }),
        layoutElement2 = this.createLayoutElement({
            position: { horizontal: 'center', vertical: 'top' },
            cutSide: 'vertical',
            cutLayoutSide: 'top'
        });

    layoutManager.layoutElements(
        [layoutElement1, layoutElement2],
        this.canvas,
        noop,
        [{ canvas: this.canvas }],
        false,
        {}
    );

    assert.ok(this.checkLayoutElementVisibility(layoutElement1));
    assert.ok(!this.checkLayoutElementVisibility(layoutElement2));
    assert.equal(this.canvas.top, 20);
});

QUnit.test('One horizontal element', function(assert) {
    var layoutManager = this.createLayoutManager({ width: 90, height: 80 }),
        layoutElement = this.createLayoutElement({
            position: { horizontal: 'left', vertical: 'top' },
            cutSide: 'horizontal',
            cutLayoutSide: 'left'
        });

    layoutManager.layoutElements(
        [layoutElement],
        this.canvas,
        noop,
        [{ canvas: this.canvas }],
        false,
        {}
    );

    assert.ok(!this.checkLayoutElementVisibility(layoutElement));
});

QUnit.test('Perpendicular elements. Vertical is hidden', function(assert) {
    var layoutManager = this.createLayoutManager({ width: 80, height: 90 }),
        layoutElement1 = this.createLayoutElement({
            position: { horizontal: 'left', vertical: 'top' },
            cutSide: 'horizontal',
            cutLayoutSide: 'left',
            width: 20,
            height: 30
        }),
        layoutElement2 = this.createLayoutElement({
            position: { horizontal: 'left', vertical: 'top' },
            cutSide: 'vertical',
            cutLayoutSide: 'top',
            width: 20,
            height: 30
        });

    layoutManager.layoutElements(
        [layoutElement1, layoutElement2],
        this.canvas,
        noop,
        [{ canvas: this.canvas }],
        false,
        {}
    );

    assert.ok(this.checkLayoutElementVisibility(layoutElement1));
    assert.ok(!this.checkLayoutElementVisibility(layoutElement2));
    assert.deepEqual(layoutElement1.draw.lastCall.args, [20, 100]);
    assert.equal(this.canvas.top, 0);
    assert.equal(this.canvas.left, 20);
});

QUnit.test('Perpendicular elements. Horizontal is hidden', function(assert) {
    var layoutManager = this.createLayoutManager({ width: 90, height: 80 }),
        layoutElement1 = this.createLayoutElement({
            position: { horizontal: 'left', vertical: 'top' },
            cutSide: 'horizontal',
            cutLayoutSide: 'left',
            width: 30,
            height: 30
        }),
        layoutElement2 = this.createLayoutElement({
            position: { horizontal: 'left', vertical: 'top' },
            cutSide: 'vertical',
            cutLayoutSide: 'top',
            width: 30,
            height: 20
        });

    layoutManager.layoutElements(
        [layoutElement2, layoutElement1],
        this.canvas,
        noop,
        [{ canvas: this.canvas }],
        false,
        {}
    );

    assert.ok(!this.checkLayoutElementVisibility(layoutElement1));
    assert.ok(this.checkLayoutElementVisibility(layoutElement2));
    assert.deepEqual(layoutElement1.draw.lastCall.args, [10, 30]);
    assert.deepEqual(layoutElement2.draw.lastCall.args, [100, 20]);
    assert.equal(this.canvas.top, 20);
});

QUnit.test('Check axis drawing params', function(assert) {
    var that = this,
        layoutManager = this.createLayoutManager({ width: 100, height: 80 }),
        axesDrawer = sinon.spy(function(sizeShortage) {
            if(sizeShortage) return;
            that.canvas.left += 10;
        });

    layoutManager.layoutElements(
        [],
        this.canvas,
        axesDrawer,
        this.getLayoutTargets(),
        false
    );

    assert.ok(axesDrawer.calledTwice);
    assert.deepEqual(axesDrawer.getCall(0).args, [], 'first call');
    assert.deepEqual(axesDrawer.getCall(1).args, [{ height: 0, width: 10 }], 'second call');
});
