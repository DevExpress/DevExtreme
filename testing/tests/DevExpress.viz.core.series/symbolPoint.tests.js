import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import labelModule from 'viz/series/points/label';
import { MockTranslator, MockAxis } from '../../helpers/chartMocks.js';
import tooltipModule from 'viz/core/tooltip';
import { states as statesConsts } from 'viz/components/consts';

const originalLabel = labelModule.Label;

const createPoint = function(series, data, options) {
    options = options || {};
    options.type = options.type || 'line';
    return new pointModule.Point(series, data, options);
};

const environment = {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();

        this.data = {
            value: 15,
            argument: 25
        };

        this.label = sinon.createStubInstance(labelModule.Label);
        this.label.isVisible = sinon.spy(function() {
            return !this.draw.calledWith(false);
        });

        this.labelFactory = labelModule.Label = sinon.spy(function() {
            return that.label;
        });
        this.options = {
            widgetType: 'chart',
            visible: true,
            styles: {
                normal: {
                    r: 0
                }
            },
            label: {
                alignment: 'center',
                visible: true,
                horizontalOffset: 0,
                verticalOffset: 0,
                background: {
                    fill: 'none'
                },
                attributes: {}
            }
        };
        this.label.getLayoutOptions.returns(this.options.label);
        this.label.getBoundingRect.returns({ height: 10, width: 20 });
        this.series = {
            name: 'series',
            _labelsGroup: {},
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return true; },
            _visibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 },
            getVisibleArea: function() { return this._visibleArea; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    },
    afterEach: function() {
        labelModule.Label = originalLabel;
    }
};
const translateXData = { 'canvas_position_default': 'x0', 1: 'x1', 2: 'x2', 3: 'x3', 4: 'x4', 5: 'x5' };
const translateYData = { 'canvas_position_default': 'y0', 1: 'y1', 2: 'y2', 3: 'y3', 4: 'y4', 5: 'y5' };

function getTranslators(translateX, translateY) {
    return {
        arg: new MockTranslator({
            translate: translateX
        }),
        val: new MockTranslator({
            translate: translateY
        })
    };
}

QUnit.module('Point coordinates translation', {
    beforeEach: function() {
        const that = this;
        this.opt = {
            widgetType: 'chart',
            options: {
                label: { visible: false }
            },
            styles: {},
            label: { visible: false }
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 700, minY: 0, maxY: 700 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    },
    setContinuousTranslators: function() {
        this.translators = getTranslators(translateXData, translateYData);
    },
    setHorizontalCategoryTranslators: function() {
        this.translators = getTranslators({ cat1: 'xcat1', cat2: 'xcat2', cat3: 'xcat3', cat4: 'xcat4', cat5: 'xcat5' }, translateYData);
    },
    setVerticalCategoryTranslators: function() {
        this.translators = getTranslators(translateXData, { cat1: 'ycat1', cat2: 'ycat2', cat3: 'ycat3', cat4: 'ycat4', cat5: 'ycat5', 'canvas_position_default': 'default' });
    }
});

QUnit.test('Continuous', function(assert) {
    this.setContinuousTranslators();
    const point = createPoint(this.series, { argument: 1, value: 5 }, this.opt);
    point.translate();

    assert.equal(point.x, 'x1', 'Point x should be correct');
    assert.equal(point.y, 'y5', 'Point y should be correct');
    assert.equal(point.minY, 'y0', 'Point min y should be correct');
    assert.equal(point.vx, point.x, 'crosshair x Coord');
    assert.equal(point.vy, point.y, 'crosshair y Coord');
});

QUnit.test('getCrosshairData', function(assert) {
    this.setContinuousTranslators();
    this.series.axis = 'valueAxisName';
    const point = createPoint(this.series, { argument: 1, value: 5 }, this.opt);
    point.translate();

    assert.equal(point.vx, point.x, 'crosshair x Coord');
    assert.equal(point.vy, point.y, 'crosshair y Coord');

    assert.deepEqual(point.getCrosshairData(), { x: point.vx, y: point.vy, xValue: point.argument, yValue: point.value, axis: 'valueAxisName' });
});

QUnit.test('getCrosshairData. Rotated', function(assert) {
    this.setContinuousTranslators();
    this.series.axis = 'valueAxisName';
    this.opt.rotated = true;
    const point = createPoint(this.series, { argument: 1, value: 5 }, this.opt);
    point.translate();

    assert.equal(point.vx, point.x, 'crosshair x Coord');
    assert.equal(point.vy, point.y, 'crosshair y Coord');

    assert.deepEqual(point.getCrosshairData(), { x: point.vx, y: point.vy, xValue: point.value, yValue: point.argument, axis: 'valueAxisName' });
});

QUnit.test('getCrosshairData if value was changed directly (T698924)', function(assert) {
    this.setContinuousTranslators();
    this.series.axis = 'valueAxisName';
    const point = createPoint(this.series, { argument: 1, value: 3 }, this.opt);
    point.value = 5;
    point.translate();

    assert.equal(point.vx, point.x, 'crosshair x Coord');
    assert.equal(point.vy, point.y, 'crosshair y Coord');

    assert.deepEqual(point.getCrosshairData(), { x: point.vx, y: point.vy, xValue: point.argument, yValue: 3, axis: 'valueAxisName' });
});

QUnit.test('Category', function(assert) {
    this.setHorizontalCategoryTranslators();
    const point = createPoint(this.series, { argument: 'cat2', value: 4 }, this.opt);

    point.translate();

    assert.equal(point.x, 'xcat2', 'Point x should be correct');
    assert.equal(point.y, 'y4', 'Point y should be correct');
    assert.equal(point.minY, 'y0', 'Point min y should be correct');
});

QUnit.test('Continuous. Rotated', function(assert) {
    this.setContinuousTranslators();
    this.opt.rotated = true;
    const point = createPoint(this.series, { argument: 2, value: 3 }, this.opt);

    point.translate();

    assert.equal(point.x, 'y3', 'Point x should be correct');
    assert.equal(point.y, 'x2', 'Point y should be correct');
    assert.equal(point.minX, 'y0', 'Point min x should be correct');
    assert.equal(point.vx, point.x, 'crosshair x Coord');
    assert.equal(point.vy, point.y, 'crosshair y Coord');
});

QUnit.test('Category. Rotated', function(assert) {
    this.setVerticalCategoryTranslators();
    this.opt.rotated = true;
    const point = createPoint(this.series, { argument: 2, value: 'cat5' }, this.opt);

    point.translate();

    assert.equal(point.x, 'ycat5', 'Point x should be correct');
    assert.equal(point.y, 'x2', 'Point y should be correct');
    assert.equal(point.minX, 'default', 'Point min x should be correct');
});

QUnit.test('Null value', function(assert) {
    this.setVerticalCategoryTranslators();
    this.opt.rotated = true;
    const point = createPoint(this.series, { argument: 'cat5', value: null }, this.opt);

    point.translate();

    assert.ok(!point.x, 'Point x should be undefined');
    assert.ok(!point.y, 'Point y should be undefined');
});

QUnit.test('create point with index', function(assert) {

    const point = createPoint(this.series, { argument: 'cat5', value: 10, index: 'index' }, this.opt);

    assert.strictEqual(point.index, 'index');
});

QUnit.module('Correct value', {
    beforeEach: function() {
        const that = this;
        this.options = {
            widgetType: 'chart',
            label: { visible: false },
            styles: {}
        };
        this.validateUnit = v => v;
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getValueAxis: function() { return { validateUnit: that.validateUnit }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.data = {
            argument: 1,
            value: 10
        };
    }
});

QUnit.test('Point has value - do correction', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.correctValue(14);

    assert.equal(point.value, 24);
    assert.equal(point.properValue, 24);
    assert.equal(point.minValue, 14);

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, 10);
});

QUnit.test('Point has no value - do not correct', function(assert) {
    this.data.value = null;
    const point = createPoint(this.series, this.data, this.options);

    point.correctValue(-4);

    assert.equal(point.value, null);
    assert.equal(point.properValue, null);
    assert.equal(point.minValue, 'canvas_position_default');

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, null);
});

QUnit.test('Point has datetime value - do correction', function(assert) {
    this.validateUnit = v => new Date(v);
    const point = createPoint(this.series, { argument: 1, value: new Date(10000) }, this.options);

    point.correctValue(new Date(20000));

    assert.equal(point.value.getTime(), 30000);
    assert.equal(point.properValue.getTime(), 30000);
    assert.equal(point.minValue.getTime(), 20000);

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue.getTime(), 10000);
});

QUnit.test('Reset correction', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.correctValue(12);
    // act
    point.resetCorrection();
    // assert
    assert.equal(point.value, 10);
    assert.equal(point.properValue, 10);
    assert.equal(point.minValue, 'canvas_position_default');

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, 10);
});

QUnit.test('setPercentValue, point with no value - calculate percent only', function(assert) {
    this.data.value = null;
    const point = createPoint(this.series, this.data, this.options);

    point.setPercentValue(40, 30);

    assert.equal(point.value, null);
    assert.equal(point.properValue, null);
    assert.equal(point.minValue, 'canvas_position_default');

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, null);
    assert.equal(point._label._data.percent, 0);
    assert.equal(point._label._data.total, 30);
});

QUnit.test('setPercentValue, point with value - calculate percent only', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.setPercentValue(40, 30);

    assert.equal(point.value, 10);
    assert.equal(point.properValue, 10);
    assert.equal(point.minValue, 'canvas_position_default');

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, 10);
    assert.equal(point._label._data.percent, 0.25);
    assert.equal(point._label._data.total, 30);
});

QUnit.test('setPercentValue, point with value, after correction - calculate percent only', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.correctValue(10);
    point.setPercentValue(50, 30);

    assert.equal(point.value, 20);
    assert.equal(point.properValue, 20);
    assert.equal(point.minValue, 10);

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, 10);
    assert.equal(point._label._data.percent, 0.2);
    assert.equal(point._label._data.total, 30);
});

QUnit.test('setPercentValue when series is fullStacked and has value', function(assert) {
    this.series.isFullStackedSeries = function() { return true; };
    const point = createPoint(this.series, this.data, this.options);

    point.setPercentValue(40, 30);

    assert.equal(point.value, 0.25);
    assert.equal(point.properValue, 0.25);
    assert.equal(point.minValue, 'canvas_position_default');

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, 10);
    assert.equal(point._label._data.percent, 0.25);
    assert.equal(point._label._data.total, 30);
});

QUnit.test('setPercentValue when series is fullStacked with left hole', function(assert) {
    this.series.isFullStackedSeries = function() { return true; };
    const point = createPoint(this.series, this.data, this.options);
    point.correctValue(10);
    point.setHole(5, 'left');

    point.setPercentValue(40, 30, 20, 20);

    assert.equal(point.value, 0.5);
    assert.equal(point.properValue, 0.5);
    assert.equal(point.minValue, 0.25);

    assert.strictEqual(point.leftHole, 0.75);
    assert.strictEqual(point.minLeftHole, 0.25);

    assert.strictEqual(point.rightHole, undefined);
    assert.strictEqual(point.minRightHole, undefined);
});

QUnit.test('setPercentValue when series is fullStacked with right hole', function(assert) {
    this.series.isFullStackedSeries = function() { return true; };
    const point = createPoint(this.series, this.data, this.options);
    point.correctValue(10);
    point.setHole(5, 'right');

    point.setPercentValue(40, 30, 20, 20);

    assert.equal(point.value, 0.5);
    assert.equal(point.properValue, 0.5);
    assert.equal(point.minValue, 0.25);

    assert.strictEqual(point.leftHole, undefined);
    assert.strictEqual(point.minLeftHole, undefined);

    assert.strictEqual(point.rightHole, 0.75);
    assert.strictEqual(point.minRightHole, 0.25);
});

QUnit.test('setPercentValue when series is fullStacked with right&left holes', function(assert) {
    this.series.isFullStackedSeries = function() { return true; };
    const point = createPoint(this.series, this.data, this.options);
    point.correctValue(10);
    point.setHole(5, 'right');
    point.setHole(10, 'left');

    point.setPercentValue(40, 30, 20, 20);

    assert.equal(point.value, 0.5);
    assert.equal(point.properValue, 0.5);
    assert.equal(point.minValue, 0.25);

    assert.strictEqual(point.leftHole, 0.5);
    assert.strictEqual(point.minLeftHole, 0);

    assert.strictEqual(point.rightHole, 0.75);
    assert.strictEqual(point.minRightHole, 0.25);
});

QUnit.test('Reset value to zero', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.resetValue();

    assert.equal(point.value, 0);
    assert.equal(point.properValue, 0);
    assert.equal(point.minValue, 0);

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, 0);
});

QUnit.test('Send reset value to label', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point._label.setDataField = sinon.spy();

    point.resetValue();

    assert.deepEqual(point._label.setDataField.lastCall.args, ['value', 0]);
});

QUnit.test('Do not reset NULL value', function(assert) {
    this.data.value = null;
    const point = createPoint(this.series, this.data, this.options);

    point.resetValue();

    assert.equal(point.value, null);
    assert.equal(point.properValue, null);
    assert.equal(point.minValue, 'canvas_position_default');

    assert.equal(point.argument, 1);
    assert.equal(point.initialValue, null);
});

QUnit.test('Do not translate after NULL value reset', function(assert) {
    this.data.value = null;
    const point = createPoint(this.series, this.data, this.options);
    point.translate();

    point.resetValue();

    assert.equal(point.y, undefined);
    assert.equal(point.minY, undefined);
});

QUnit.test('Do not send reset NULL value to label', function(assert) {
    this.data.value = null;
    const point = createPoint(this.series, this.data, this.options);
    point._label.setDataField = sinon.spy();

    point.resetValue();

    assert.equal(point._label.setDataField.called, false);
});

QUnit.module('HasValue method', {
    beforeEach: function() {
        this.opt = {
            widgetType: 'chart',
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series1',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    }
});

QUnit.test('Positive', function(assert) {
    const point = createPoint(this.series, { argument: 12, value: 5 }, this.opt);
    const result = point.hasValue();

    assert.strictEqual(result, true);

});

QUnit.test('Negative', function(assert) {
    const point = createPoint(this.series, { argument: 39, value: null }, this.opt);
    const result = point.hasValue();

    assert.strictEqual(result, false);
});

QUnit.module('Check object in visible area', {
    beforeEach: function() {
        const that = this;
        this.options = {
            widgetType: 'chart',
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 210 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.data = { argument: 1, value: 1 };

        this.translators = {
            arg: new MockTranslator({
                translate: { '-4': 96, 0: 100, 10: 110, 6: 106, 14: 114, 24: 124, 'canvas_position_default': 100 }
            }),
            val: new MockTranslator({
                translate: { '-4': 196, 0: 200, 10: 210, 6: 206, 14: 214, 24: 224, 'canvas_position_default': 200 }
            })
        };
    }
});

QUnit.test('Object is in visible area', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(10, 20, 30, 40);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Object is abroad on left', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(-50, 20, 30, 40);

    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is abroad on right', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(120, 20, 30, 40);

    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is abroad on top', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(10, -70, 30, 40);

    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is abroad on bottom', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(10, 230, 30, 40);

    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is visible, width and height are undefined', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(10, 210);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Object is not visible, width and height are defined', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(10, 210, 10, 10);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is not visible, width and height are defined, on top', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(10, -10, 10, 10);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is visible, height is zero', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(10, 210, 10, 0);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Object is visible, width and height are undefined, rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(100, 10);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Object is not visible, width and height are defined, rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(210, 10, 10, 10);

    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is not visible, width and height are defined, rotated, on left', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);

    point._calculateVisibility(-10, 10, 10, 10);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(!isInVisibleArea);
});

QUnit.test('Object is visible, width is zero, rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point._calculateVisibility(100, 10, 0, 10);
    const isInVisibleArea = point.isInVisibleArea();

    assert.ok(isInVisibleArea);
});

QUnit.test('Point is visible. Series visible. Point inside visible area', function(assert) {
    this.options.rotated = true;
    this.series.isVisible = function() { return true; };
    const point = createPoint(this.series, this.data, this.options);
    point._calculateVisibility(100, 10, 0, 10);
    const isVisible = point.isVisible();

    assert.ok(isVisible);
});

QUnit.test('Point is visible. Series visible. Point outside visible area', function(assert) {
    this.options.rotated = true;
    this.series.isVisible = function() { return true; };
    const point = createPoint(this.series, this.data, this.options);
    point._calculateVisibility(-10, 10, 10, 10);
    const isVisible = point.isVisible();


    assert.ok(!isVisible);
});

QUnit.test('Point is visible. Series no visible. Point inside visible area', function(assert) {
    this.options.rotated = true;
    this.series.isVisible = function() { return false; };
    const point = createPoint(this.series, this.data, this.options);
    point._calculateVisibility(100, 10, 0, 10);
    const isVisible = point.isVisible();


    assert.ok(!isVisible);
});

QUnit.test('Point is visible. Series no visible. Point outside visible area', function(assert) {
    this.options.rotated = true;
    this.series.isVisible = function() { return false; };
    const point = createPoint(this.series, this.data, this.options);
    point._calculateVisibility(-10, 10, 10, 10);
    const isVisible = point.isVisible();


    assert.ok(!isVisible);
});

QUnit.module('Draw point', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.errorBarGroup = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            visible: true,
            styles: { normal: { r: 6, style: 'selection' }, hover: { r: 6, style: 'selection' }, selection: { style: 'selection' } },
            label: { visible: false }
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 2100 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.translators = {
            arg: new MockTranslator({
                translate: { 'null': 0, 1: 11, 2: 12, 3: 13, 4: 14 }
            }),
            val: new MockTranslator({
                translate: { 'null': 0, 1: 22, 2: 23, 3: 24, 4: 25 }
            })
        };
        this.groups = {
            markers: this.group,
            errorBars: this.errorBarGroup
        };
    }
});

QUnit.test('Circle', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);

    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        translateX: 11,
        translateY: 22,
        r: 6,
        style: 'selection'
    });

    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
});

QUnit.test('Square', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { value: 1, argument: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6],
        translateX: 11,
        translateY: 22,
        r: 6,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Polygon', function(assert) {
    this.options.symbol = 'polygon';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, 0, 0, -6, 6, 0, 0, 6, -6, 0],
        translateX: 11,
        translateY: 22,
        r: 6,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('T100386. Polygon with divisional radius', function(assert) {
    this.options.symbol = 'polygon';
    this.options.styles.normal.r = 5.2;

    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, 0, 0, -6, 6, 0, 0, 6, -6, 0],
        translateX: 11,
        translateY: 22,
        r: 5.2,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Triangle', function(assert) {
    this.options.symbol = 'triangle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, -6, 6, -6, 0, 6, -6, -6],
        translateX: 11,
        translateY: 22,
        r: 6,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('TriangleDown', function(assert) {
    this.options.symbol = 'triangleDown';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, -6, 6, -6, 0, 6, -6, -6],
        translateX: 11,
        translateY: 22,
        r: 6,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('hasCoords returns true if point has x and y', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();

    assert.ok(point.hasCoords());
});

QUnit.test('hasCoords returns false if point doesn\'t have y', function(assert) {
    this.translators.val = new MockTranslator({
        translate: { 1: null }
    });
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();

    assert.ok(!point.hasCoords());
});

QUnit.test('hasCoords returns false if point doesn\'t have x', function(assert) {
    this.translators.arg = new MockTranslator({
        translate: { 1: null }
    });
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();

    assert.ok(!point.hasCoords());
});

QUnit.test('TriangleUp', function(assert) {
    this.options.symbol = 'triangleUp';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, 6, 6, 6, 0, -6, -6, 6],
        translateX: 11,
        translateY: 22,
        r: 6,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Cross', function(assert) {
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, -3, -3, -6, 0, -3, 3, -6, 6, -3, 3, 0, 6, 3, 3, 6, 0, 3, -3, 6, -6, 3, -3, 0],
        translateX: 11,
        translateY: 22,
        r: 6,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('T100386. Cross with divisional radius', function(assert) {
    this.options.symbol = 'cross';
    this.options.styles.normal.r = 5.2;
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        points: [-6, -3, -3, -6, 0, -3, 3, -6, 6, -3, 3, 0, 6, 3, 3, 6, 0, 3, -3, 6, -6, 3, -3, 0],
        translateX: 11,
        translateY: 22,
        r: 5.2,
        style: 'selection'
    });
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.ok(point.graphic.sharp.calledOnce);
    assert.ok(point.graphic.sharp.firstCall.calledAfter(point.graphic.attr.lastCall));
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Visibility to image', function(assert) {
    this.options.image = 'test-url';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point._styles.normal.visibility = 'visible';
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'image');
    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.equal(point.graphic, this.renderer.stub('image').firstCall.returnValue);
    assert.equal(point.graphic.stub('attr').firstCall.args[0].visibility, 'visible');
});

QUnit.test('Image is string', function(assert) {
    this.options.image = 'test-url';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'image');
    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').firstCall.args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic, this.renderer.stub('image').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 11);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 22);
});

QUnit.test('Image is object', function(assert) {
    this.options.image = { url: 'test-url', width: 10, height: 30 };
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'image');
    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').firstCall.args, [-5, -15, 10, 30, 'test-url', 'center']);
    assert.equal(point.graphic, this.renderer.stub('image').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 11);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 22);
});

QUnit.test('With animation enabled', function(assert) {
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.x = 10,
    point.y = 20,
    point.defaultY = 0;
    point.visible = true;

    point.draw(this.renderer, this.groups, true);

    assert.ok(point);
    assert.ok(point.graphic);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 10);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 0);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('With animation enabled. Rotated', function(assert) {
    this.options.symbol = 'cross';
    this.options.rotated = true;
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.x = 10,
    point.y = 20,
    point.defaultX = 0;
    point.visible = true;
    point.draw(this.renderer, this.groups, true);

    assert.ok(point);
    assert.ok(point.graphic);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 0);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 20);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Draw point with selected state', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.fullState = statesConsts.selectedMark;

    point.draw(this.renderer, this.groups);

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].style, 'selection');
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

// TODO why?
QUnit.test('Draw point with hover state', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.fullState = statesConsts.hoverMark;

    point.draw(this.renderer, this.groups);

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].style, 'selection');
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Draw point without state', function(assert) {
    const point = createPoint({
        isFullStackedSeries: function() { return false; },
        getLabelVisibility: function() { return false; },
        _argumentChecker: function() { return true; },
        _valueChecker: function() { return true; }
    }, { argument: '4', value: 3 }, this.options);
    point.selectedState = false;
    point.series.setPointSelectedState = function(point) {
        point.selectedState = true;
    };
    point.hoveredState = false;
    point.series.setHoverState = function(point) {
        point.hoveredState = true;
    };
    point.state = undefined;
    point.draw(this.renderer, this.groups);

    assert.ok(!point.selectedState);
    assert.ok(!point.hoveredState);
    assert.strictEqual(point.fullState, 0);
});

QUnit.test('double drawing without animation', function(assert) {
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.x = 10,
    point.y = 20,
    point.defaultY = 0;
    point.visible = true;

    point.draw(this.renderer, this.groups, false);

    point.x = 20,
    point.y = 50,
    point.defaultY = 0;
    point.visible = true;
    // act
    point.draw(this.renderer, this.groups, false);
    // assert

    assert.ok(point);
    assert.ok(point.graphic);

    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 20);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 50);

});

QUnit.test('double drawing with animation', function(assert) {
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.x = 10,
    point.y = 20,
    point.defaultY = 0;
    point.visible = true;

    point.draw(this.renderer, this.groups, false);

    point.x = 20,
    point.y = 50,
    point.defaultY = 0;
    point.visible = true;
    // act
    point.draw(this.renderer, this.groups, true);
    // assert

    assert.ok(point);
    assert.ok(point.graphic);

    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, undefined);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, undefined);

});

QUnit.test('Animate point', function(assert) {
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);
    point.translate();

    point.draw(this.renderer, this.groups, true);

    point.animate(undefined, { translateX: point.x, translateY: point.y });

    assert.ok(point);
    assert.ok(point.graphic);

    assert.deepEqual(point.graphic.stub('animate').lastCall.args[0], {
        translateX: 11,
        translateY: 22
    });

    assert.ok(!point.graphic.stub('animate').lastCall.args[2]);
    assert.equal(point.graphic.stub('append').lastCall.args[0], this.group);

});

QUnit.test('Animate point with complete', function(assert) {
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    const stubComplete = sinon.stub();
    let complete;

    point.x = 10,
    point.y = 20,
    point.defaultY = 0;
    point.visible = true;

    point.draw(this.renderer, this.groups, true);

    point.animate(stubComplete, { translate: { x: point.x, y: point.y } });
    complete = point.graphic.stub('animate').lastCall.args[2];
    // act
    complete();
    // assert
    assert.ok(stubComplete.calledOnce);
});

QUnit.test('Draw point with errorBar', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        displayMode: 'auto',
        lineWidth: 3,
        edgeLength: 8,
        opacity: 1,
        color: 'red'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.path.callCount, 1);

    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 25, 15, 25], [11, 25, 11, 24], [15, 24, 7, 24]]);
    assert.strictEqual(this.renderer.path.lastCall.args[1], 'line');
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: 'visible'
    });

    assert.strictEqual(this.renderer.path.lastCall.returnValue.append.callCount, 1);
    assert.strictEqual(this.renderer.path.lastCall.returnValue.append.lastCall.args[0], this.errorBarGroup);
});

QUnit.test('Hide error bar', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        displayMode: 'auto',
        lineWidth: 3,
        edgeLength: 8,
        opacity: 1,
        color: 'red',

    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);
    // act
    point.setInvisibility();
    // assert
    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: 'hidden',
    });
});

QUnit.test('Draw point with errorBar when animation enabled', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        displayMode: 'auto',
        lineWidth: 3,
        edgeLength: 8,
        color: 'red',
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups, true);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.path.callCount, 1);

    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 25, 15, 25], [11, 25, 11, 24], [15, 24, 7, 24]]);
    assert.strictEqual(this.renderer.path.lastCall.args[1], 'line');
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0], {
        visibility: 'visible'
    });

    assert.strictEqual(this.renderer.path.lastCall.returnValue.append.callCount, 1);
    assert.strictEqual(this.renderer.path.lastCall.returnValue.append.lastCall.args[0], this.errorBarGroup);
});

QUnit.test('Draw only high errorBar', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red',
        displayMode: 'high'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 25, 15, 25], [11, 25, 11, 22]]);
});

QUnit.test('Draw only low errorBar. Rotated', function(assert) {
    this.options.symbol = 'circle';
    this.options.rotated = true;
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red',
        displayMode: 'low'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);


    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[24, 11, 22, 11], [24, 7, 24, 15]]);
});

QUnit.test('Draw only high errorBar when defined only highError', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);


    assert.strictEqual(this.renderer.path.callCount, 1);

    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 25, 15, 25], [11, 25, 11, 22]]);
});

QUnit.test('Draw point with errorBar. odd edgeLength', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        displayMode: 'auto',
        lineWidth: 3,
        edgeLength: 7,
        opacity: 1,
        color: 'red',

    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.path.callCount, 1);

    assert.deepEqual(this.renderer.path.lastCall.args[0], [[8, 25, 14, 25], [11, 25, 11, 24], [14, 24, 8, 24]]);
    assert.strictEqual(this.renderer.path.lastCall.args[1], 'line');
});

QUnit.test('No draw errorBar when defined only lowError and display high only', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        displayMode: 'high',
        color: 'red'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3 }, this.options);

    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.strictEqual(this.renderer.stub('path').callCount, 0);
});

QUnit.test('Draw only low errorBar', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red',
        displayMode: 'low'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[11, 22, 11, 24], [15, 24, 7, 24]]);
});

QUnit.test('Draw only low errorBar when defined only lowError', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[11, 22, 11, 24], [15, 24, 7, 24]]);
});

QUnit.test('No draw errorBar when defined only highError and display low only', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        displayMode: 'low',
        color: 'red'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, highError: 3 }, this.options);

    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.stub('path').callCount, 0);

});

QUnit.test('No draw errorBar when displayMode is \'none\'', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        displayMode: 'NoNe',
        color: 'red'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.stub('path').callCount, 0);
});

QUnit.test('Do not draw errorBar when no errorBars options passed', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = undefined;
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.stub('path').callCount, 0);
});

QUnit.test('Draw point without errorBar', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red'
    };
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.stub('path').callCount, 0);
});

QUnit.test('Draw only highError for stdDeviation type of errorBar', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        type: 'stdDeviation',
        color: 'red',
        displayMode: 'high'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.strictEqual(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 25, 15, 25], [11, 25, 11, 24.5]]);
});

QUnit.test('Draw error bar with relative edge length', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 0.5,
        type: 'stdDeviation',
        color: 'red',
        displayMode: 'high'
    };
    this.options.styles = { normal: { r: 6, 'stroke-width': 4 }, hover: { r: 6, 'stroke-width': 10 } };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.strictEqual(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 25, 15, 25], [11, 25, 11, 24.5]]);
});

QUnit.test('Draw error bar with relative edge length. Invisible point', function(assert) {
    this.options.symbol = 'circle';
    this.options.visible = false;
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 0.5,
        type: 'stdDeviation',
        color: 'red',
        displayMode: 'high'
    };
    this.options.styles = { normal: { r: 6, 'stroke-width': 4 }, hover: { r: 6, 'stroke-width': 10 } };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.strictEqual(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[11, 25, 11, 25], [11, 25, 11, 24.5]]);
});

QUnit.test('Draw point when errorBar has no coords', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red',
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 333, highError: 400 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.stub('path').callCount, 0);
});

QUnit.test('Draw point with errorBar. Rotated', function(assert) {
    this.options.symbol = 'circle';
    this.options.rotated = true;

    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        color: 'red',
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[25, 15, 25, 7], [24, 11, 25, 11], [24, 7, 24, 15]]);
});

QUnit.module('Update point', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.errorBarGroup = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            visible: true,
            styles: { normal: { r: 6, style: 'normal' }, hover: { r: 6, style: 'hover' }, selection: { r: 6, style: 'hover' } },
            label: {}
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            isVisible: function() { return true; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 210 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.translators = {
            arg: new MockTranslator({
                translate: { 'null': 0, 1: 11, 2: 12, 13: 13, 4: 14 }
            }),
            val: new MockTranslator({
                translate: { 'null': 0, 1: 22, 2: 23, 3: 24, 4: 24 }
            })
        };
        this.groups = {
            markers: this.group,
            errorBars: this.errorBarGroup
        };
    }
});

QUnit.test('Update fill', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.styles.normal.fill = 'red';
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Update location', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    point.x = 10;
    point.y = 20;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 10);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 20);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.ok(point.graphic.sharp.called);
    assert.ok(point.graphic.sharp.lastCall.calledAfter(point.graphic.stub('attr').lastCall));
});

QUnit.test('Update radius for circle', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.styles.normal.r = 10;
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].r, 10);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.ok(point.graphic.sharp.called);
    assert.ok(point.graphic.sharp.lastCall.calledAfter(point.graphic.stub('attr').lastCall));
});

QUnit.test('Update radius for non-circle', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.styles.normal.r = 10;
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].points, [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6]);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].points, [-10, -10, 10, -10, 10, 10, -10, 10, -10, -10]);
    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
    assert.ok(point.graphic.sharp.called);
    assert.ok(point.graphic.sharp.lastCall.calledAfter(point.graphic.stub('attr').lastCall));
});

QUnit.test('Circle to non-circle', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { symbol: 'square' });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'path');

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');
    assert.equal(point.graphic, this.renderer.stub('path').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].points, [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6]);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Non-circle to circle', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { symbol: 'circle' });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[0], []);
    assert.deepEqual(this.renderer.stub('path').firstCall.args[1], 'area');

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].r, 6);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Non-image to image (image option is string)', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { image: 'image-url' });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'image');

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').firstCall.args, [-10, -10, 20, 20, 'image-url', 'center']);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 11);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 22);
    assert.equal(point.graphic, this.renderer.stub('image').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Non-image to image (image option is object with url)', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { image: { url: 'image-url' } });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'image');

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').firstCall.args, [-10, -10, 20, 20, 'image-url', 'center']);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 11);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 22);
    assert.equal(point.graphic, this.renderer.stub('image').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Image to non-image (image option is string)', function(assert) {
    this.options.image = 'image-url';
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options);
    newOptions.image = {};
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').firstCall.args, [-10, -10, 20, 20, 'image-url', 'center']);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 11);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 22);

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].r, 6);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Image to non-image (image option is string)', function(assert) {
    this.options.image = { url: 'image-url' };
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options);
    newOptions.image = {};
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').firstCall.args, [-10, -10, 20, 20, 'image-url', 'center']);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 11);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 22);

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, []);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].r, 6);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateX, 11);
    assert.equal(point.graphic.stub('attr').lastCall.args[0].translateY, 22);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('append').lastCall.args[0], this.group);
});

QUnit.test('Update size and url for image', function(assert) {
    this.options.image = { url: 'image-url' };
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.image = {
        width: 30,
        height: 40,
        url: 'new-url'
    };
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(point.graphic.typeOfNode, 'image');

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').firstCall.args, [-10, -10, 20, 20, 'image-url', 'center']);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateX, 11);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0].translateY, 22);

    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].width, 30);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].height, 40);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].href, 'new-url');
});

QUnit.test('Update markers style when top marker is image', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = 'test';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 1 }, this.options);
    const style = {
        fill: 'hover-style',
        stroke: 'hover-stroke',
        'stroke-width': 'hover-strokeWidth',
        r: 'hover-radius',
        visibility: 'visible'
    };

    point.translate();
    point.draw(this.renderer, this.groups);

    point.graphic.stub('attr').reset();
    point._updateMarker(undefined, style);

    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], {
        'height': 20,
        'href': 'test',
        'translateX': 11,
        'translateY': 22,
        'width': 20,
        'visibility': 'visible'
    });
});

QUnit.test('Update errorBars', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        lineWidth: 3,
        edgeLength: 8,
        opacity: 1,
        color: 'red',
        displayMode: 'auto'
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.errorBars = {
        color: 'black',
        width: 4,
        lineWidth: 4,
        edgeLength: 0,
        opacity: 0.5,
        displayMode: 'auto'
    };

    point.updateOptions(this.options);
    point.updateData({ argument: 1, value: 1, lowError: 1, highError: 2 });
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);

    assert.strictEqual(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 24, 15, 24], [11, 24, 11, 24], [15, 24, 7, 24]]);
    assert.strictEqual(this.renderer.path.lastCall.returnValue.attr.callCount, 2);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.firstCall.args[0], {
        visibility: 'visible'
    });
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.secondCall.args[0], {
        points: [[11, 23, 11, 23], [11, 23, 11, 22], [11, 22, 11, 22]],
        visibility: 'visible'
    });

});

QUnit.test('Update errorBars - hide errorBar', function(assert) {
    this.options.symbol = 'circle';
    this.options.errorBars = {
        displayMode: 'auto',
        lineWidth: 3,
        edgeLength: 8,
        opacity: 1,
        color: 'red',
    };
    const point = createPoint(this.series, { argument: 1, value: 1, lowError: 3, highError: 4 }, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.errorBars = {
        color: 'black',
        lineWidth: 3,
        edgeLength: 8,
        displayMode: 'none'
    };

    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.strictEqual(this.renderer.stub('path').callCount, 1);
    assert.deepEqual(this.renderer.path.lastCall.args[0], [[7, 24, 15, 24], [11, 24, 11, 24], [15, 24, 7, 24]]);
    assert.strictEqual(this.renderer.path.lastCall.returnValue.attr.callCount, 2);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.firstCall.args[0], {
        visibility: 'visible'
    });
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.secondCall.args[0], {
        visibility: 'hidden'
    });
});

QUnit.module('Point visibility', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.data = {
            argument: 1,
            value: 1
        };
        this.options = {
            widgetType: 'chart',
            visible: true,
            symbol: 'circle',
            styles: {
                normal: { r: 6, style: { fill: 'red', stroke: 'yellow', 'stroke-width': 2 } },
                selection: { r: 8 }
            },
            label: { visible: false }
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            isVisible: function() { return true; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 210 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.translators = {
            arg: new MockTranslator({
                translate: { 'null': 0, 1: 11 }
            }),
            val: new MockTranslator({
                translate: { 'null': 0, 1: 22 }
            })
        };
        this.groups = {
            markers: this.group,
            errorBars: this.errorBarGroup
        };
    }
});

QUnit.test('Clear marker', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    point.clearMarker();

    assert.strictEqual(point.graphic._stored_settings.fill, null);
    assert.strictEqual(point.graphic._stored_settings.stroke, null);

    assert.strictEqual(point.graphic._stored_settings.visibility, undefined);
    assert.strictEqual(point.graphic._stored_settings['stroke-width'], undefined);
    assert.strictEqual(point.graphic._stored_settings.opacity, undefined);
});

QUnit.test('Clear visibility', function(assert) {
    this.options.styles.normal.visibility = 'visible';
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    point.graphic.stub('attr').reset();

    point.clearVisibility();

    assert.equal(point.graphic.stub('attr').callCount, 2);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], 'visibility');
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0], { visibility: null });
});

QUnit.test('Check clearing marker on customize point', function(assert) {
    this.options.styles.usePointCustomOptions = true;
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options);
    newOptions.styles.usePointCustomOptions = false;
    const spy = sinon.spy(point, 'clearMarker');
    point.updateOptions(newOptions);
    point.draw(this.renderer, this.groups);

    assert.ok(spy.calledOnce);
});

QUnit.test('Hide marker when marker is visible', function(assert) {
    this.options.styles.normal.visibility = 'visible';
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const labelSpy = sinon.spy(point._label, 'draw');
    point.graphic.stub('attr').reset();

    point.setInvisibility();

    assert.equal(point.graphic.stub('attr').callCount, 2);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], 'visibility');
    assert.strictEqual(point.graphic.stub('attr').lastCall.args[0].visibility, 'hidden');
    assert.deepEqual(labelSpy.lastCall.args, [false]);
});

QUnit.test('Hide marker when marker has no visibility setting', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const labelSpy = sinon.spy(point._label, 'draw');
    point.graphic.stub('attr').reset();

    point.setInvisibility();

    assert.equal(point.graphic.stub('attr').callCount, 2);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], 'visibility');
    assert.strictEqual(point.graphic.stub('attr').lastCall.args[0].visibility, 'hidden');
    assert.deepEqual(labelSpy.lastCall.args, [false]);
});

QUnit.test('Hide marker when marker is hidden', function(assert) {
    this.options.styles.normal.visibility = 'hidden';
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.draw(this.renderer, this.groups);

    const labelSpy = sinon.spy(point._label, 'draw');
    point.graphic.stub('attr').reset();

    point.setInvisibility();

    assert.equal(point.graphic.stub('attr').callCount, 1);
    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], 'visibility');
    assert.strictEqual(point.graphic._stored_settings.visibility, 'hidden');
    assert.deepEqual(labelSpy.lastCall.args, [false]);
});

QUnit.test('Apply style for visible point (in visible area)', function(assert) {
    this.options.styles.normal.visibility = 'visible';
    const point = createPoint(this.series, this.data, this.options);
    point.translate();

    point.draw(this.renderer, this.groups);
    point.graphic.stub('attr').reset();

    point.fullState = 0;
    point.applyView();

    assert.ok(point.graphic);

    assert.deepEqual(point.graphic.stub('attr').secondCall.args[0], { r: 6, style: { fill: 'red', stroke: 'yellow', 'stroke-width': 2 }, visibility: 'visible' });
});

QUnit.test('Apply style for invisible point (out of visible area)', function(assert) {
    this.options.styles.normal.visibility = 'visible';
    const point = createPoint(this.series, this.data, this.options);
    point.translate();
    point.inVisibleArea = false;

    point.draw(this.renderer, this.groups);
    point.graphic.stub('attr').reset();

    point.fullState = 0;
    point.applyView();

    assert.ok(point.graphic);

    assert.deepEqual(point.graphic.stub('attr').secondCall.args[0], { r: 6, style: { fill: 'red', stroke: 'yellow', 'stroke-width': 2 }, visibility: 'hidden' });
});

QUnit.test('Apply style for visible image point (in visible area)', function(assert) {
    this.options.image = 'image-url';
    this.options.styles.normal.visibility = 'visible';
    const point = createPoint(this.series, this.data, this.options);
    point.translate();

    point.draw(this.renderer, this.groups);
    point.graphic.stub('attr').reset();

    point.fullState = 0;
    point.applyView();

    assert.ok(point.graphic);

    assert.deepEqual(point.graphic.stub('attr').secondCall.args[0], { height: 20, width: 20, href: 'image-url', visibility: 'visible' });
});

QUnit.test('Apply style for invisible image point (out of visible area)', function(assert) {
    this.options.image = 'image-url';
    this.options.styles.normal.visibility = 'visible';
    const point = createPoint(this.series, this.data, this.options);
    point.translate();
    point.inVisibleArea = false;

    point.draw(this.renderer, this.groups);
    point.graphic.stub('attr').reset();

    point.fullState = 0;
    point.applyView();

    assert.ok(point.graphic);

    assert.deepEqual(point.graphic.stub('attr').secondCall.args[0], { height: 20, width: 20, href: 'image-url', visibility: 'hidden' });
});

QUnit.test('keep style after redraw', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.draw(this.renderer, this.groups);
    point.fullState = 2;
    point.applyView();
    point.draw(this.renderer, this.groups);

    assert.deepEqual(
        this.renderer.circle.getCall(0).returnValue.attr.lastCall.args[0].r,
        this.options.styles.selection.r
    );
});

QUnit.module('Tooltip', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        const axis = this.axis = new MockAxis({ renderer: this.renderer });
        this.data = {
            value: 10,
            argument: 1
        };
        this.options = {
            widgetType: 'chart',
            visible: true,
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            label: { visible: false },
            symbol: 'circle'
        };
        this.series = {
            name: 'series',
            isVisible: function() { return true; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getArgumentAxis() {
                return axis;
            },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; },
            getStackName: function() { return undefined; }
        };
        const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, {
            formatValue: function(value, specialFormat) {
                return value || value === 0 ? value + ':' + specialFormat : value || '';
            }
        });
        this.tooltip = new StubTooltip();

        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Get tooltip coordinates (this.graphic = true)', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 250;
    point.visible = true;
    point.draw(this.renderer, this.groups);

    const cc = point.getTooltipParams();

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 250);
    assert.equal(cc.offset, 5);
});

QUnit.test('Get tooltip coordinates (this.graphic = false)', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 250;

    const cc = point.getTooltipParams();

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 250);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip format object', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const formatObject = point.getTooltipFormatObject(this.tooltip);

    assert.equal(formatObject.argument, 1);
    assert.equal(formatObject.argumentText, '1:argument');
    assert.equal(formatObject.value, 10);
    assert.equal(formatObject.valueText, '10:undefined');
    assert.equal(formatObject.seriesName, 'series');
    assert.equal(formatObject.point, point);
    assert.equal(formatObject.originalArgument, 1);
    assert.equal(formatObject.originalValue, 10);
    assert.strictEqual(formatObject.lowError, undefined);
    assert.strictEqual(formatObject.highError, undefined);
});

QUnit.test('Get tooltip format object with ErrorBar', function(assert) {
    this.data.lowError = 2;
    this.data.highError = 3;

    const point = createPoint(this.series, this.data, this.options);
    const formatObject = point.getTooltipFormatObject(this.tooltip);

    assert.equal(formatObject.argument, 1);
    assert.equal(formatObject.argumentText, '1:argument');
    assert.equal(formatObject.value, 10);
    assert.equal(formatObject.valueText, '10:undefined');
    assert.equal(formatObject.seriesName, 'series');
    assert.equal(formatObject.point, point);
    assert.equal(formatObject.originalArgument, 1);
    assert.equal(formatObject.originalValue, 10);

    assert.equal(formatObject.lowErrorValue, 2);
    assert.equal(formatObject.highErrorValue, 3);
});

QUnit.test('Get tooltip format object with stackPoints without stack', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const options1 = $.extend(true, {}, this.options);
    const data1 = {
        value: 15,
        argument: 1,
        originalValue: 15,
        originalArgument: 1
    };
    const options2 = $.extend(true, {}, this.options);
    const data2 = {
        value: 20,
        argument: 1,
        originalValue: 20,
        originalArgument: 1
    };

    const stackPoints = [
        createPoint($.extend({}, this.series, { name: 'series1' }), data1, options1),
        createPoint($.extend({}, this.series, { name: 'series2' }), data2, options2)
    ].map(point => {
        point.setPercentValue(40, 30);
        point.inVisibleArea = true;
        return point;
    });

    point.setPercentValue(40, 30);
    const formatObject = point.getTooltipFormatObject(this.tooltip, stackPoints);

    assert.equal(formatObject.argument, 1);
    assert.equal(formatObject.total, 30);
    assert.equal(formatObject.argumentText, '1:argument');
    assert.equal(formatObject.totalText, '30:undefined');
    assert.ok(!formatObject.stackName);

    assert.equal(formatObject.points.length, 2);

    checkTooltipFormatObject(assert, formatObject.points[0], data1.argument, data1.value, data1.originalValue, data1.originalArgument, 'series1', 0.375, 30);
    checkTooltipFormatObject(assert, formatObject.points[1], data2.argument, data2.value, data2.originalValue, data2.originalArgument, 'series2', 0.5, 30);
});

QUnit.test('Get tooltip format object with stackPoints with stack', function(assert) {
    this.series.getStackName = function() { return 'someStackName'; };
    const point = createPoint(this.series, this.data, this.options);
    const options1 = $.extend(true, {}, this.options);
    const data1 = {
        value: 15,
        argument: 1,
        originalValue: 15,
        originalArgument: 1
    };
    const options2 = $.extend(true, {}, this.options);
    const data2 = {
        value: 20,
        argument: 1,
        originalValue: 20,
        originalArgument: 1
    };

    const stackPoints = [
        createPoint($.extend({}, this.series, { name: 'series1' }), data1, options1),
        createPoint($.extend({}, this.series, { name: 'series2' }), data2, options2)
    ].map(point => {
        point.setPercentValue(40, 30);
        point.inVisibleArea = true;
        return point;
    });

    point.setPercentValue(40, 30);
    const formatObject = point.getTooltipFormatObject(this.tooltip, stackPoints);

    assert.equal(formatObject.argument, 1);
    assert.equal(formatObject.total, 30);
    assert.equal(formatObject.argumentText, '1:argument');
    assert.equal(formatObject.totalText, '30:undefined');
    assert.equal(formatObject.stackName, 'someStackName');

    assert.equal(formatObject.points.length, 2);

    checkTooltipFormatObject(assert, formatObject.points[0], data1.argument, data1.value, data1.originalValue, data1.originalArgument, 'series1', 0.375, 30);
    checkTooltipFormatObject(assert, formatObject.points[1], data2.argument, data2.value, data2.originalValue, data2.originalArgument, 'series2', 0.5, 30);
});

QUnit.test('Get tooltip format object, stacked points not visible', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const options1 = $.extend(true, {}, this.options);
    const data1 = {
        value: 15,
        argument: 1,
        originalValue: 15,
        originalArgument: 1
    };
    const options2 = $.extend(true, {}, this.options);
    const data2 = {
        value: 20,
        argument: 1,
        originalValue: 20,
        originalArgument: 1
    };

    const stackPoints = [
        createPoint($.extend({}, this.series, { name: 'series1' }), data1, options1),
        createPoint($.extend({}, this.series, { name: 'series2' }), data2, options2)
    ].map(point => {
        point.setPercentValue(40, 30);
        point.inVisibleArea = false;
        return point;
    });

    point.setPercentValue(40);

    const formatObject = point.getTooltipFormatObject(this.tooltip, stackPoints);

    assert.equal(formatObject.points.length, 0);
});

QUnit.test('Get tooltip format object, series of points no visible', function(assert) {
    this.series.isVisible = function() { return false; };
    const point = createPoint(this.series, this.data, this.options);
    const options1 = $.extend(true, {}, this.options);
    const data1 = {
        value: 15,
        argument: 1,
        originalValue: 15,
        originalArgument: 1
    };
    const options2 = $.extend(true, {}, this.options);
    const data2 = {
        value: 20,
        argument: 1,
        originalValue: 20,
        originalArgument: 1
    };

    const stackPoints = [
        createPoint($.extend({}, this.series, { name: 'series1' }), data1, options1),
        createPoint($.extend({}, this.series, { name: 'series2' }), data2, options2)
    ].map(point => {
        point.setPercentValue(40);
        point.inVisibleArea = false;
        return point;
    });
    point.setPercentValue(40);

    const formatObject = point.getTooltipFormatObject(this.tooltip, stackPoints);

    assert.equal(formatObject.points.length, 0);
});

QUnit.test('Get tooltip format object with aggreagation info', function(assert) {
    this.axis.formatRange.returns('range');
    this.data.aggregationInfo = {
        intervalStart: 5,
        intervalEnd: 10,
        aggregationInterval: 5
    };

    const formatObject = createPoint(this.series, this.data, this.options).getTooltipFormatObject(this.tooltip);

    assert.equal(formatObject.valueText, '10:undefined\nrange');
});

QUnit.test('Get tooltip format object with aggreagation info when format range resturn empty string', function(assert) {
    this.axis.formatRange.returns('');
    this.data.aggregationInfo = {
        intervalStart: 5,
        intervalEnd: 10,
        aggregationInterval: 5
    };

    const formatObject = createPoint(this.series, this.data, this.options).getTooltipFormatObject(this.tooltip);

    assert.equal(formatObject.valueText, '10:undefined');
});

const checkTooltipFormatObject = function(assert, point, argument, value, originalValue, originalArgument, seriesName, percent, total) {
    assert.equal(point.argument, argument);
    assert.equal(point.value, value);
    assert.equal(point.seriesName, seriesName);
    assert.equal(point.originalArgument, originalArgument);
    assert.equal(point.originalValue, originalValue);
    assert.equal(point.percent, percent);
    assert.equal(point.total, total);
};

QUnit.module('Get coordinates', {
    beforeEach: function() {
        this.data = {
            value: 10,
            argument: 1
        };
        this.options = {
            widgetType: 'chart',
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    }
});

QUnit.test('Non-rotated', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.x = 100;
    point.minX = 111;
    point.y = 200;
    point.minY = 222;

    const cc = point.getCoords();

    assert.equal(cc.x, 100);
    assert.equal(cc.y, 200);
});

QUnit.test('Rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point.x = 300;
    point.minX = 333;
    point.y = 400;
    point.minY = 444;

    const cc = point.getCoords();

    assert.equal(cc.x, 300);
    assert.equal(cc.y, 400);
});

QUnit.test('Min part. Non-rotated', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.x = 100;
    point.minX = 111;
    point.y = 200;
    point.minY = 222;

    const cc = point.getCoords(true);

    assert.equal(cc.x, 100);
    assert.equal(cc.y, 222);
});

QUnit.test('Min part. Rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point.x = 300;
    point.minX = 333;
    point.y = 400;
    point.minY = 444;

    const cc = point.getCoords(true);

    assert.equal(cc.x, 333);
    assert.equal(cc.y, 400);
});

QUnit.test('Min part, min === max. Non-rotated - apply offset', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.x = 100;
    point.minX = 111;
    point.y = 200;
    point.minY = 200;

    const cc = point.getCoords(true);

    assert.equal(cc.x, 100);
    assert.equal(cc.y, 201);
});

QUnit.test('Min part, min === max. Rotated - apply offset', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point.x = 300;
    point.minX = 300;
    point.y = 400;
    point.minY = 444;

    const cc = point.getCoords(true);

    assert.equal(cc.x, 299);
    assert.equal(cc.y, 400);
});

QUnit.module('Get default coordinates', {
    beforeEach: function() {
        this.data = {
            value: 10,
            argument: 1
        };
        this.options = {
            widgetType: 'chart',
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    }
});

QUnit.test('Non-rotated', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.x = 100;
    point.defaultX = 111;
    point.y = 200;
    point.defaultY = 222;

    const cc = point.getDefaultCoords();

    assert.equal(cc.x, 100);
    assert.equal(cc.y, 222);
});

QUnit.test('Rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point.x = 300;
    point.defaultX = 333;
    point.y = 400;
    point.defaultY = 444;

    const cc = point.getDefaultCoords();

    assert.equal(cc.x, 333);
    assert.equal(cc.y, 400);
});

QUnit.module('Draw label', environment);

QUnit.test('Label format object', function(assert) {
    this.data.argument = 0.12;
    this.data.value = 5;
    this.series.seriesName = 'series';
    const pt = createPoint(this.series, this.data, this.options);

    const result = pt._getLabelFormatObject();

    assert.equal(result.argument, 0.12);
    assert.equal(result.value, 5);
    assert.equal(result.originalArgument, 0.12);
    assert.equal(result.originalValue, 5);
    assert.deepEqual(result.point, pt);
    assert.equal(result.seriesName, 'series');
});

QUnit.test('Label format object percent argument', function(assert) {
    this.data.argument = 0.12;
    this.data.value = 4;
    this.series.seriesName = 'series';
    const pt = createPoint(this.series, this.data, this.options);

    pt.setPercentValue(50, 30);

    assert.ok(this.labelFactory.calledOnce);

    const label = pt._label;
    const format = label.setData.firstCall.args[0];

    assert.ok(label.setData.calledOnce);

    assert.equal(format.argument, 0.12);
    assert.equal(format.value, 4);
    assert.equal(format.originalArgument, 0.12);
    assert.equal(format.originalValue, 4);
    assert.equal(format.seriesName, 'series');
    assert.equal(format.point, pt);

    assert.ok(label.setDataField.calledTwice);
    assert.deepEqual(label.setDataField.firstCall.args, ['percent', 0.08]);
    assert.deepEqual(label.setDataField.lastCall.args, ['total', 30]);
});

QUnit.test('Label format object percent argument when value = 0 total = 0', function(assert) {
    this.data.argument = 0.12;
    this.data.value = 0;
    this.series.seriesName = 'series';
    const pt = createPoint(this.series, this.data, this.options);
    const label = pt._label;

    pt.setPercentValue(0, 0);

    assert.ok(label.setDataField.calledTwice);
    assert.deepEqual(label.setDataField.firstCall.args, ['percent', 0]);
    assert.deepEqual(label.setDataField.lastCall.args, ['total', 0]);
});

QUnit.test('Label format object percent argument when total = 0 minValue = 0', function(assert) {
    this.data.argument = 0.12;
    this.data.value = 4;
    this.series.seriesName = 'series';
    const pt = createPoint(this.series, this.data, this.options);
    const label = pt._label;

    pt.minValue = 0;
    pt.setPercentValue(40, 30);

    assert.ok(label.setDataField.calledTwice);
    assert.deepEqual(label.setDataField.firstCall.args, ['percent', 0.1]);
    assert.deepEqual(label.setDataField.lastCall.args, ['total', 30]);
});

QUnit.test('Get graphic bbox when point is with radius', function(assert) {
    this.options.styles.normal.r = 8;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 33;
    point.y = 32;
    point._options.visible = true;

    const result = point._getGraphicBBox();

    assert.equal(result.x, 25);
    assert.equal(result.y, 24);
    assert.equal(result.width, 16);
    assert.equal(result.height, 16);
});

QUnit.test('Get graphic bbox when point is with radius and invisible', function(assert) {
    this.options.styles.normal.r = 8;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 33;
    point.y = 32;
    point._options.visible = false;

    const result = point._getGraphicBBox();

    assert.equal(result.x, 33);
    assert.equal(result.y, 32);
    assert.equal(result.width, 0);
    assert.equal(result.height, 0);
});

QUnit.test('Get graphic bbox when point is image', function(assert) {
    this.options.image = { url: 'test' };
    const point = createPoint(this.series, this.data, this.options);

    point.x = 33;
    point.y = 32;
    point._options.visible = true;

    const result = point._getGraphicBBox();

    assert.equal(result.x, 23);
    assert.equal(result.y, 22);
    assert.equal(result.width, 20);
    assert.equal(result.height, 20);
});

QUnit.test('Get graphic bbox when point is image and invisible', function(assert) {
    this.options.image = { url: 'test' };
    const point = createPoint(this.series, this.data, this.options);

    point.x = 33;
    point.y = 32;
    point._options.visible = false;

    const result = point._getGraphicBBox();

    assert.equal(result.x, 33);
    assert.equal(result.y, 32);
    assert.equal(result.width, 0);
    assert.equal(result.height, 0);
});

QUnit.test('create label', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    assert.ok(this.labelFactory.calledOnce);
    assert.deepEqual(this.labelFactory.args[0][0], {
        renderer: point.series._renderer,
        labelsGroup: point.series._labelsGroup,
        point: point
    });
});

QUnit.test('show label on draw', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._label.draw.lastCall.args, [true]);
});

QUnit.test('hide label on draw if it invisible', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point._drawLabel(this.renderer, this.group);

    this.series.getLabelVisibility = function() {
        return false;
    };
    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._label.draw.lastCall.args, [false]);
});

QUnit.test('hide label if hasValue is false', function(assert) {
    this.data.value = null;
    const point = createPoint(this.series, this.data, this.options);

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point.getLabels()[0].draw.lastCall.args, [false]);
});

QUnit.test('CustomizeLabel visibility is true, series labels are not visible', function(assert) {
    this.series.getLabelVisibility = function() {
        return false;
    };
    this.options.styles.useLabelCustomOptions = true;
    this.options.label.visible = true;

    const point = createPoint(this.series, this.data, this.options);

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point.getLabels()[0].draw.lastCall.args, [true]);
});

QUnit.test('CustomizeLabel visibility is false, series labels are visible', function(assert) {
    this.options.styles.useLabelCustomOptions = true;
    this.options.label.visible = false;

    const point = createPoint(this.series, this.data, this.options);

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point.getLabels()[0].draw.lastCall.args, [false]);
});

QUnit.module('Correct Label position', environment);
// Helper
function createCorrectionLabel(x, y, visibility, bBox) {
    const point = createPoint(this.series, this.data, this.options);
    const label = point._label;

    point.x = x;
    point.y = y;
    point.visible = visibility;
    bBox && (point._getSymbolBBox = function() { return bBox; });

    point.correctLabelPosition(label);

    return label;
}

QUnit.test('Circle symbol point', function(assert) {
    this.options.styles.normal.r = 8;
    this.options.symbol = 'circle';
    const label = createCorrectionLabel.call(this, 33, 32, true);

    assert.ok(label.shift.calledOnce);
    assert.ok(label.setOptions.calledOnce);

    assert.equal(label.shift.firstCall.args[0], 23);
    assert.equal(label.shift.firstCall.args[1], 4);

    assert.ok(label.setFigureToDrawConnector.calledOnce);
    assert.deepEqual(label.setFigureToDrawConnector.firstCall.args[0], { x: 33, y: 32, r: 8 });

    assert.deepEqual(label.setOptions.firstCall.args[0], {
        alignment: 'center',
        attributes: {},
        background: {
            fill: 'none'
        },
        horizontalOffset: 0,
        verticalOffset: 0,
        visible: true
    });
});

QUnit.test('Invisible point', function(assert) {
    this.options.styles.normal.r = 8;
    this.options.symbol = 'circle';
    this.options.visible = false;
    const label = createCorrectionLabel.call(this, 33, 32, true);

    assert.ok(label.setFigureToDrawConnector.calledOnce);
    assert.deepEqual(label.setFigureToDrawConnector.firstCall.args[0], { x: 33, y: 32, r: 0 });
});

QUnit.test('Point with radius. Left Position', function(assert) {
    this.options.label.alignment = 'left';
    this.options.styles.normal.r = 8;
    const label = createCorrectionLabel.call(this, 33, 32, true);

    assert.equal(label.shift.firstCall.args[0], 33);
    assert.equal(label.shift.firstCall.args[1], 4);
});

QUnit.test('Point with radius. Right Position', function(assert) {
    this.options.label.alignment = 'right';
    this.options.styles.normal.r = 8;
    const label = createCorrectionLabel.call(this, 33, 32, true);

    assert.equal(label.shift.firstCall.args[0], 13);
    assert.equal(label.shift.firstCall.args[1], 4);
});

QUnit.test('Point is image', function(assert) {
    this.options.image = { url: 'test' };
    const label = createCorrectionLabel.call(this, 33, 32, true);

    assert.equal(label.shift.firstCall.args[0], 23);
    assert.equal(label.shift.firstCall.args[1], 2);
});

QUnit.test('Default, not rotated', function(assert) {
    const label = createCorrectionLabel.call(this, 30, 32, true, { x: 40, y: 40, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 40);
    assert.equal(label.shift.firstCall.args[1], 20);
});

QUnit.test('Not circle symbol point', function(assert) {
    this.data.value = -15;
    const label = createCorrectionLabel.call(this, 33, 32, true, { x: 40, y: 40, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 40);
    assert.equal(label.shift.firstCall.args[1], 60);

    assert.ok(label.setFigureToDrawConnector.calledOnce);
    assert.deepEqual(label.setFigureToDrawConnector.firstCall.args[0], { x: 50, y: 45, r: 10 });

    assert.ok(label.setFigureToDrawConnector.calledBefore(label.shift));
});

QUnit.test('Default, rotated fullstacked with negative value', function(assert) {
    this.series.isFullStackedSeries = function() { return true; };
    this.options.rotated = true;
    const label = createCorrectionLabel.call(this, 43, 12, true, { x: 40, y: 40, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 70);
    assert.equal(label.shift.firstCall.args[1], 40);
});

QUnit.module('Check Label position', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.series._visibleArea = { minX: 10, maxX: 100, minY: 20, maxY: 210 };
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
    }
});
// Helper
function createLabel(labelBBox) {
    const point = createPoint(this.series, this.data, this.options);
    const label = point._label;

    point._getSymbolBBox = function() { return labelBBox; };
    point.correctLabelPosition(label);

    return label;
}

QUnit.test('Draw label (area of point = minX area of series)', function(assert) {
    const label = createLabel.call(this, { x: 10, y: 40, height: 0, width: 0 });

    assert.equal(label.shift.firstCall.args[0], 10);
    assert.equal(label.shift.firstCall.args[1], 20);
});

QUnit.test('Draw label (area of point = maxX area of series)', function(assert) {
    const label = createLabel.call(this, { x: 100, y: 40, height: 0, width: 0 });

    assert.equal(label.shift.firstCall.args[0], 80);
    assert.equal(label.shift.firstCall.args[1], 20);
});

QUnit.test('Draw label, not rotated (area of label < minX area of series)', function(assert) {
    const label = createLabel.call(this, { x: 5, y: 40, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 10);
    assert.equal(label.shift.firstCall.args[1], 20);
});

QUnit.test('Draw label, not rotated (area of label > maxX area of series)', function(assert) {
    const label = createLabel.call(this, { x: 90, y: 40, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 80);
    assert.equal(label.shift.firstCall.args[1], 20);
});

QUnit.test('Draw label, not rotated (area of label < minY area of series)', function(assert) {
    const label = createLabel.call(this, { x: 50, y: 12, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 50);
    assert.equal(label.shift.firstCall.args[1], 32);
});

QUnit.test('Draw label, not rotated (area of label > maxY area of series)', function(assert) {
    const label = createLabel.call(this, { x: 50, y: 210, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 50);
    assert.equal(label.shift.firstCall.args[1], 190);
});

QUnit.test('Draw label, not rotated, point is abroad on the left', function(assert) {
    const label = createLabel.call(this, { x: 0, y: 100, height: 10, width: 4 });

    assert.equal(label.shift.firstCall.args[0], -8);
    assert.equal(label.shift.firstCall.args[1], 80);
});

QUnit.test('Draw label, not rotated, point is abroad over the right', function(assert) {
    const label = createLabel.call(this, { x: 101, y: 100, height: 10, width: 14 });

    assert.equal(label.shift.firstCall.args[0], 98);
    assert.equal(label.shift.firstCall.args[1], 80);
});

QUnit.test('Draw label, not rotated, point is abroad on the right', function(assert) {
    const label = createLabel.call(this, { x: 8, y: 100, height: 10, width: 5 });

    assert.equal(label.shift.firstCall.args[0], 10);
    assert.equal(label.shift.firstCall.args[1], 80);
});

QUnit.test('Draw label, rotated (area of label < minX area of series)', function(assert) {
    this.options.rotated = true;
    const label = createLabel.call(this, { x: 4, y: 40, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 34);
    assert.equal(label.shift.firstCall.args[1], 40);
});

QUnit.test('Draw label, rotated (area of label > maxX area of series)', function(assert) {
    this.options.rotated = true;
    const label = createLabel.call(this, { x: 80, y: 40, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 50);
    assert.equal(label.shift.firstCall.args[1], 40);
});

QUnit.test('Draw label, rotated (area of label < minY area of series)', function(assert) {
    this.options.rotated = true;
    const label = createLabel.call(this, { x: 50, y: 12, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 80);
    assert.equal(label.shift.firstCall.args[1], 20);
});

QUnit.test('Draw label, rotated (area of label > maxY area of series)', function(assert) {
    this.options.rotated = true;
    const label = createLabel.call(this, { x: 50, y: 208, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 80);
    assert.equal(label.shift.firstCall.args[1], 200);
});

QUnit.test('Draw label, rotated, point is abroad on the top', function(assert) {
    this.options.rotated = true;
    const label = createLabel.call(this, { x: 5, y: 0, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 35);
    assert.equal(label.shift.firstCall.args[1], 0);
});

QUnit.test('Draw label, rotated, point is abroad on the bottom', function(assert) {
    this.options.rotated = true;
    const label = createLabel.call(this, { x: 5, y: 0, height: 10, width: 20 });

    assert.equal(label.shift.firstCall.args[0], 35);
    assert.equal(label.shift.firstCall.args[1], 0);
});

QUnit.module('Update label', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.options.label.background.fill = 'red';
    },
    afterEach: function() {
        environment.afterEach.apply(this, arguments);
    }
});

QUnit.test('Update label options', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const newOptions = $.extend(true, {}, this.options);
    const label = point._label;

    newOptions.label.background.fill = 'green';

    point.updateOptions(newOptions);

    assert.ok(point._label.setOptions.calledTwice);

    assert.equal(label.setOptions.firstCall.args[0].background.fill, 'red');
    assert.equal(label.setOptions.secondCall.args[0].background.fill, 'green');
});

QUnit.test('Update label location', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const newData = {
        value: 10,
        argument: 20
    };
    const label = point._label;

    point.updateData(newData);

    assert.ok(label.setData.calledTwice);
    assert.equal(label.setData.firstCall.args[0].argument, 25);
    assert.equal(label.setData.firstCall.args[0].value, 15);
    assert.equal(label.setData.secondCall.args[0].argument, 20);
    assert.equal(label.setData.secondCall.args[0].value, 10);
});

QUnit.module('Calculate tracker size', {
    beforeEach: function() {
        this.realTouchDevice = ('ontouchstart' in window) || (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0);
        this.renderer = new vizMocks.Renderer();
        this.options = {
            widgetType: 'chart',
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            label: {}
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    }
});

QUnit.test('Tracker with point.r < minTrackerSize', function(assert) {
    this.options.styles.normal.r = 4;
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    if(!this.realTouchDevice) {
        assert.strictEqual(point._storeTrackerR(), 6);
    } else {
        assert.strictEqual(point._storeTrackerR(), 20);
    }
});

QUnit.test('Tracker with point.r > minTrackerSize', function(assert) {
    if(this.realTouchDevice) {
        this.options.styles.normal.r = 30;
    } else {
        this.options.styles.normal.r = 15;
    }
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    if(!this.realTouchDevice) {
        assert.strictEqual(point._storeTrackerR(), 15);
    } else {
        assert.strictEqual(point._storeTrackerR(), 30);
    }
});

QUnit.module('Tracker size calculation on MS Touch Devices', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            styles: { normal: { r: 6 }, hover: { r: 6 } },
            label: {}
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    }
});

QUnit.test('Get navigator', function(assert) {
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);

    point._storeTrackerR();

    assert.equal(point.__debug_browserNavigator, window.navigator);
});


QUnit.test('Tracker on ms devices with point.r < minTrackerSize. msPointer', function(assert) {
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.__debug_navigator = {
        msPointerEnabled: true,
        msMaxTouchPoints: 2
    };

    assert.strictEqual(point._storeTrackerR(), 20);
});

QUnit.test('Tracker on ms devices with point.r < minTrackerSize. Pointer', function(assert) {
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.__debug_navigator = {
        pointerEnabled: true,
        maxTouchPoints: 2
    };
    assert.strictEqual(point._storeTrackerR(), 20);
});

QUnit.test('Tracker on ms devices with point.r > minTrackerSize. msPointer', function(assert) {
    this.options.styles.normal.r = 30;

    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.__debug_navigator = {
        msPointerEnabled: true,
        msMaxTouchPoints: 2
    };

    assert.strictEqual(point._storeTrackerR(), 30);
});

QUnit.test('Tracker on ms devices with point.r > minTrackerSize. pointerEnabled', function(assert) {
    this.options.styles.normal.r = 30;
    const point = createPoint(this.series, { argument: '4', value: 3 }, this.options);
    point.__debug_navigator = {
        pointerEnabled: true,
        maxTouchPoints: 2
    };
    point._options.styles.normal.r = 30;
    assert.strictEqual(point._storeTrackerR(), 30);
});

QUnit.module('get point radius', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.errorBarGroup = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            symbol: 'circle',
            visible: true,
            styles: { normal: { r: 6, 'stroke-width': 4 }, hover: { r: 6, 'stroke-width': 10 } },
            label: { visible: false }
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.groups = {
            markers: this.group,
        };
    }
});

QUnit.test('get point radius', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    assert.equal(point.getPointRadius(), 8);
});

QUnit.test('get point radius. hover style', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    point.draw(this.renderer, this.groups);

    point.fullState = 1;
    point.applyView();

    assert.equal(point.getPointRadius(), 11);
});

QUnit.test('point not visible', function(assert) {
    this.options.visible = false;
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    assert.equal(point.getPointRadius(), 0);
});

QUnit.test('point is image', function(assert) {
    this.options.image = 'image';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    assert.equal(point.getPointRadius(), 0);
});

QUnit.test('symbol point is square', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    assert.equal(point.getPointRadius(), 1.4 * 6 + 2);
});

QUnit.test('symbol point is triangle', function(assert) {
    this.options.symbol = 'triangle';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    assert.equal(point.getPointRadius(), 1.4 * 6 + 2);
});

QUnit.test('symbol point is triangleDown', function(assert) {
    this.options.symbol = 'triangleDown';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    assert.equal(point.getPointRadius(), 1.4 * 6 + 2);
});

QUnit.test('symbol point is triangleUp', function(assert) {
    this.options.symbol = 'triangleUp';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    assert.equal(point.getPointRadius(), 1.4 * 6 + 2);
});

QUnit.module('API', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.options = {
            visible: true,
            widgetType: 'chart',
            styles: { normal: { r: 6, style: 'selection' }, hover: { r: 6, style: 'selection' }, selection: { style: 'selection' } },
            label: { visible: false }
        };
        this.series = {
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 210 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.translators = {
            arg: new MockTranslator({
                translate: { 'null': 0, 1: 11 }
            }),
            val: new MockTranslator({
                translate: { 'null': 0, 1: 22 }
            })
        };
    }
});

QUnit.test('coordsIn', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);
    point.translate(); // point.x = 11, point.y = 22;

    point._storeTrackerR = function() {
        return 20;
    };

    assert.ok(point.coordsIn(11, 22), 'center');
    assert.ok(point.coordsIn(21, 22), 'right inside');
    assert.ok(point.coordsIn(31, 22), 'right side');
    assert.ok(!point.coordsIn(32, 22), 'right side out');

    assert.ok(point.coordsIn(10, 22), 'left inside');
    assert.ok(point.coordsIn(-8, 22), 'left side');
    assert.ok(!point.coordsIn(-11, 22), 'left side out');

    assert.ok(point.coordsIn(11, 32), 'bottom inside');
    assert.ok(point.coordsIn(11, 41), 'bottom side');
    assert.ok(!point.coordsIn(11, 43), 'bottom side out');

    assert.ok(point.coordsIn(11, 10), 'top inside');
    assert.ok(point.coordsIn(11, 3), 'top side');
    assert.ok(!point.coordsIn(11, 1), 'top side out');
});

QUnit.test('getMarkerVisibility', function(assert) {
    this.options.visible = 'visible_value';
    const point = createPoint(this.series, { argument: 1, value: 1 }, this.options);

    assert.strictEqual(point.getMarkerVisibility(), 'visible_value');
});
