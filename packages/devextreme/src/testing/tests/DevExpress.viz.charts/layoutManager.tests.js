const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const labelModule = require('viz/series/points/label');
const layoutManagerModule = require('viz/chart_components/layout_manager');
const layoutElementModule = require('viz/core/layout_element');

const canvasTemplate = {
    width: 1000,
    height: 400,
    top: 10,
    bottom: 20,
    left: 30,
    right: 40
};
let canvas;
const LayoutElement = vizMocks.stubClass(layoutElementModule.LayoutElement);

const environment = {
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
        const layoutManager = new layoutManagerModule.LayoutManager();
        layoutManager.setOptions(options || { width: 10, height: 10 });
        return layoutManager;
    },
    createLayoutElement: function(opt) {
        const options = $.extend({}, this.commonBBox, opt);
        const layoutElement = new LayoutElement(options);

        layoutElement.stub('getLayoutOptions').returns(options);
        layoutElement.stub('position').returnsThis();

        return layoutElement;
    },
};

function setupCanvas() {
    canvas = $.extend(true, {}, canvasTemplate);
}
function createLayoutManager(options) {
    const layoutManager = new layoutManagerModule.LayoutManager(options);
    layoutManager.setOptions(options || { width: 160, height: 160 });
    return layoutManager;
}

function getStubSeries(type, innerRadius, points) {
    const stubSeries = new vizMocks.Series();


    stubSeries.type = type;

    stubSeries.stub('getVisiblePoints').returns(points || [createFakePointsWithStubLabels({}, true, false)]);
    stubSeries.correctLabelRadius = sinon.stub();
    stubSeries.setVisibleArea = sinon.stub();
    stubSeries.innerRadius = innerRadius;
    return [stubSeries];
}

function getNStubSeries(type, innerRadius, arrPoints) {
    let stubSeries = [];
    for(let i = 0; i < arrPoints.length; i++) {
        stubSeries = stubSeries.concat(getStubSeries(type, innerRadius, arrPoints[i]));
    }
    return stubSeries;
}

function createFakePointsWithStubLabels(bBox, isVisible, hasText, options) {
    const stubLabel = sinon.createStubInstance(labelModule.Label);
    const fakePoint = {
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
    const series = getStubSeries('pie');
    const layoutManager = createLayoutManager();
    const inner = 0;
    const outer = (canvas.height - canvas.top - canvas.bottom) / 2;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple pie. RadiusOuter equal width of canvas', function(assert) {
    const series = getStubSeries('pie');
    const layoutManager = createLayoutManager();
    const inner = 0;
    const outer = (canvasTemplate.height - canvas.left - canvas.right) / 2;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple pie - vertical canvas. width and height odd ', function(assert) {
    const series = getStubSeries('doughnut');
    const layoutManager = createLayoutManager();
    const inner = 111;
    const outer = 223;

    canvas.width = 517;
    canvas.height = 517;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius is not number', function(assert) {
    const series = getStubSeries('donut', 'str');
    const layoutManager = createLayoutManager();
    const inner = 82;
    const outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Simple donut - innerRadius is valid number', function(assert) {
    const series = getStubSeries('donut', '0.7');
    const layoutManager = createLayoutManager();
    const inner = 115;
    const outer = 165;

    canvas.width = canvasTemplate.height;
    canvas.height = canvasTemplate.width;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('simple pie with diameter', function(assert) {
    const series = getStubSeries('pie');
    const layoutManager = createLayoutManager({ piePercentage: 0.4 });
    const inner = 0;
    const outer = 80;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('simple donut with diameter', function(assert) {
    const series = getStubSeries('donut');
    const layoutManager = createLayoutManager({ piePercentage: 0.4 });
    const inner = 40;
    const outer = 80;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.module('PieChart. Calculate radius charts with labels', {
    beforeEach: setupCanvas
});

QUnit.test('Nearest label topLeft', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 350, y: 100, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.6 });
    const inner = 0;
    const outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label topRight', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 650, y: 100, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 146;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label topCenter', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 490, y: 0, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 155;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label CenterLeft', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 300, y: 190, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 155;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label CenterRight', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 650, y: 190, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.6 });
    const inner = 0;
    const outer = 125;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomLeft', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 350, y: 300, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.6 });
    const inner = 0;
    const outer = 141;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomRight', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.6 });
    const inner = 0;
    const outer = 142;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomCenter', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.6 });
    const inner = 0;
    const outer = 125;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Calculate of nearest label', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, true, true),
        CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.6 });
    const inner = 0;
    const outer = 125;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Calculate of visible point with label with text', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 570, y: 350, width: 10, height: 10 }, false, true),
        CFPWSL({ x: 490, y: 350, width: 10, height: 10 }, true, false),
        CFPWSL({ x: 490, y: 0, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 142;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('Nearest label BottomLeft label closer then 0.7 R', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points = [CFPWSL({ x: 450, y: 190, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 129;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series), canvas, inner, outer);
});

QUnit.test('piePercentage was not set && hideLabels was set', function(assert) {
    const points = [createFakePointsWithStubLabels({ x: 450, y: 190, width: 10, height: 10 }, true, true)];
    const series = getStubSeries('pie', null, points);
    const layoutManager = createLayoutManager({});
    const inner = 0;
    const outer = 185;

    checkLayout(assert, layoutManager.applyPieChartSeriesLayout(canvas, series, true), canvas, inner, outer);
});

QUnit.module('Multi series pie', {
    beforeEach: setupCanvas
});

QUnit.test('2 series, labels are fit in canvas', function(assert) {
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2]);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 129;

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 60, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 65, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2]);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 80;

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 40, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2]);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 129;

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 60, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 65, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2]);
    const layoutManager = createLayoutManager({ piePercentage: 0.5 });
    const inner = 0;
    const outer = 75;

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true, { position: 'inside' })];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2]);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 129;

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true, { position: 'inside' })];
    const points3 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2, points3]);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 129;

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 30, height: 10 }, true, true, { position: 'inside' })];
    const points3 = [CFPWSL({ x: 400, y: 300, width: 50, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2, points3]);
    const layoutManager = createLayoutManager({ minPiePercentage: 0.7 });
    const inner = 0;
    const outer = 80;

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 15, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 10, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2]);
    const layoutManager = createLayoutManager({});

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
    const CFPWSL = createFakePointsWithStubLabels;
    const points1 = [CFPWSL({ x: 400, y: 300, width: 30, height: 10 }, true, true)];
    const points2 = [CFPWSL({ x: 400, y: 300, width: 35, height: 10 }, true, true)];
    const series = getNStubSeries('pie', null, [points1, points2]);
    const layoutManager = createLayoutManager({});

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
    const series = getStubSeries('pie');
    const layoutManager = createLayoutManager();

    assert.deepEqual(layoutManager.applyEqualPieChartLayout(series, { x: 100, y: 200, radius: 300 }), {
        centerX: 100,
        centerY: 200,
        radiusInner: 0,
        radiusOuter: 300
    });
});

QUnit.test('Donut - inner radius is calculated', function(assert) {
    const series = getStubSeries('donut', '0.5');
    const layoutManager = createLayoutManager();

    assert.deepEqual(layoutManager.applyEqualPieChartLayout(series, { x: 100, y: 200, radius: 300 }), {
        centerX: 100,
        centerY: 200,
        radiusInner: 150,
        radiusOuter: 300
    });
});

QUnit.module('check need space panes canvas');

QUnit.test('space sufficiently', function(assert) {
    const panes = [{ canvas: { width: 200, left: 10, right: 20, height: 300, top: 30, bottom: 40 } }];
    const layoutManager = createLayoutManager();

    const updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.equal(updateSide, false);
});

QUnit.test('need width space', function(assert) {
    const panes = [{ canvas: { width: 200, left: 40, right: 20, height: 300, top: 30, bottom: 40 } }];
    const layoutManager = createLayoutManager();

    const updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 0,
        width: 20
    });
});

QUnit.test('need height space', function(assert) {
    const panes = [{ canvas: { width: 200, left: 10, right: 20, height: 300, top: 130, bottom: 40 } }];
    const layoutManager = createLayoutManager();

    const updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 0
    });
});

QUnit.test('need both side space', function(assert) {
    const panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } }];
    const layoutManager = createLayoutManager();

    const updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 20
    });
});

QUnit.test('for several panes', function(assert) {
    const panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } },
        { canvas: { width: 200, left: 10, right: 20, height: 300, top: 30, bottom: 40 } }];
    const layoutManager = createLayoutManager();

    const updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 20
    });
});

QUnit.test('for several rotated panes', function(assert) {
    const panes = [{ canvas: { width: 200, left: 10, right: 50, height: 300, top: 130, bottom: 40 } },
        { canvas: { width: 300, left: 145, right: 20, height: 300, top: 130, bottom: 40 } }];
    const layoutManager = createLayoutManager();

    const updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes, true);

    assert.deepEqual(updateSide, {
        height: 30,
        width: 45
    });
});

QUnit.test('space with radius', function(assert) {
    const panes = [{ canvas: { width: 500, left: 110, right: 50, height: 500, top: 130, bottom: 40 } }];
    const layoutManager = createLayoutManager({ piePercentage: 0.7 });

    const updateSide = layoutManager.needMoreSpaceForPanesCanvas(panes, false);

    assert.deepEqual(updateSide, { height: 20, width: 10 });
});

QUnit.module('Layout legend inside', environment);

QUnit.test('position legend, vertical, bottom', function(assert) {
    const LE = this.createLayoutElement({ position: { horizontal: 'center', vertical: 'bottom' }, cutSide: 'vertical', cutLayoutSide: 'bottom' });
    const LM = this.createLayoutManager();

    LM.layoutInsideLegend(LE, this.canvas);

    assert.deepEqual(LE.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 0, y: 0, width: 100, height: 80 }),
        my: { horizontal: 'center', vertical: 'top' },
        at: { horizontal: 'center', vertical: 'bottom' },
    });
});

QUnit.test('position legend, horizontal, left', function(assert) {
    const LE = this.createLayoutElement({ position: { horizontal: 'left', vertical: 'top' }, cutSide: 'horizontal', cutLayoutSide: 'left' });
    const LM = this.createLayoutManager();

    LM.layoutInsideLegend(LE, this.canvas);

    assert.deepEqual(LE.position.getCall(0).args[0], {
        of: new layoutElementModule.WrapperLayoutElement(null, { x: 20, y: 0, width: 80, height: 100 }),
        my: { horizontal: 'right', vertical: 'top' },
        at: { horizontal: 'left', vertical: 'top' },
    });
});
