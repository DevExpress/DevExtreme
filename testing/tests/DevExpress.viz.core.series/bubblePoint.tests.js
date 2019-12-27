import * as vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import labelModule from 'viz/series/points/label';
import { MockTranslator } from '../../helpers/chartMocks.js';
import tooltipModule from 'viz/core/tooltip';

const originalLabel = labelModule.Label;

const createPoint = function(series, data, options) {
    options = options || {};
    options.type = options.type || 'bubble';
    return new pointModule.Point(series, data, options);
};

QUnit.module('Draw point. Bubble', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();

        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11 }
            }),
            val: new MockTranslator({
                translate: { 1: 50, 2: 33, 3: 10, 4: 5 }
            })
        };
        this.group = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            visible: true,
            type: 'bubble',
            styles: { normal: { opacity: 0.4, style: 'normal' }, hover: { opacity: 0.4, style: 'hover' }, selection: { opacity: 0.4, style: 'selection' } },
            label: {
                visible: false
            }
        };
        this.series = {
            name: 'series',
            areLabelsVisible: function() { return false; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 600, minY: 0, maxY: 600 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Marker', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);

    point.correctCoordinates(4);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, [0, 0, 2]);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('smartAttr').firstCall.args[0], {
        opacity: 0.4,
        style: 'normal',
        translateX: 11,
        translateY: 33
    });

    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
    assert.deepEqual(point.graphic.data.lastCall.args, [{ 'chart-data-point': point }]);
});

QUnit.test('Update marker', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);

    point.correctCoordinates(4);
    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.styles.normal.fill = 'red';
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].fill, 'red');
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
});

QUnit.test('Update marker location', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);

    point.correctCoordinates(4);
    point.translate();
    point.draw(this.renderer, this.groups);

    point.x = 10;
    point.y = 20;
    point.bubbleSize = 30;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].translateX, 10);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].translateY, 20);
    assert.deepEqual(point.graphic.stub('attr').lastCall.args[0].r, 30);
    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
});

QUnit.test('Marker with animationEnabled', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);

    point.correctCoordinates(4);
    point.translate();
    point.draw(this.renderer, this.groups, true);

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, [0, 0, 0]);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        opacity: 0.4,
        style: 'normal',
        translateX: 11,
        translateY: 33
    });

    assert.equal(point.graphic.stub('append').firstCall.args[0], this.group);
});

QUnit.test('animate', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);
    const complete = sinon.stub();

    point.correctCoordinates(4);
    point.translate();
    point.draw(this.renderer, this.groups, true);

    point.animate(complete, { translateX: 11, translateY: 33, r: 2 });

    assert.ok(point.graphic);
    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').firstCall.args, [0, 0, 0]);
    assert.equal(point.graphic, this.renderer.stub('circle').firstCall.returnValue);

    assert.deepEqual(point.graphic.stub('attr').firstCall.args[0], {
        opacity: 0.4,
        style: 'normal',
        translateX: 11,
        translateY: 33
    });

    assert.deepEqual(point.graphic.stub('animate').lastCall.args[0], {
        r: 2,
        translateX: 11,
        translateY: 33
    });
    assert.ok(point.graphic.stub('animate').lastCall.args[2]);

    point.graphic.stub('animate').lastCall.args[2]();
    assert.ok(complete.calledOnce);
});

QUnit.test('animate without graphic', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);
    const complete = sinon.spy();

    point.correctCoordinates(4);
    point.translate();

    point.animate(complete);

    assert.ok(!point.graphic);
    assert.ok(complete.calledOnce);
});

QUnit.test('pass diameter to correctCoordinates', function(assert) {
    // arrange
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);
    const diameter = 10;

    // act
    point.correctCoordinates(diameter);
    // assert
    assert.strictEqual(point.bubbleSize, diameter / 2);
});

QUnit.module('Tooltip', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.data = {
            value: 10,
            argument: 1,
            size: 20
        };
        this.options = {
            widgetType: 'chart',
            visible: true,
            label: {},
            styles: { normal: {} }
        };
        const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, {
            formatValue: function(value, specialFormat) {
                return value || value === 0 ? value + ':' + specialFormat : value || '';
            }
        });
        this.tooltip = new StubTooltip();
        this.series = {
            name: 'series',
            areLabelsVisible: function() { return false; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Get tooltip coordinates, height less than min bubble height. Location is center', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 250;
    point.draw(this.renderer, this.groups);
    point.graphic.getBBox = function() { return { height: 10 }; };

    const cc = point.getTooltipParams('center');

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 250);
    assert.equal(cc.offset, 5);
});

QUnit.test('Get tooltip coordinates. Location is edge', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 250;
    point.draw(this.renderer, this.groups);
    point.graphic.getBBox = function() { return { height: 24 }; };

    const cc = point.getTooltipParams('edge');

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 250);
    assert.equal(cc.offset, 12);
});

QUnit.test('Get tooltip coordinates, height more than min bubble height. Location is center', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 250;
    point.draw(this.renderer, this.groups);
    point.graphic.getBBox = function() { return { height: 30 }; };

    const cc = point.getTooltipParams('center');

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 250);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip format object', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.percent = 100;
    const cc = point.getTooltipFormatObject(this.tooltip);

    assert.equal(cc.argument, 1);
    assert.equal(cc.argumentText, '1:argument');
    assert.equal(cc.size, 20);
    assert.equal(cc.sizeText, '20:undefined');
    assert.equal(cc.value, 10);
    assert.equal(cc.valueText, '10:undefined');
    assert.equal(cc.seriesName, 'series');
    assert.equal(cc.point, point);
    assert.equal(cc.originalArgument, 1);
    assert.equal(cc.originalValue, 10);
});

QUnit.module('Draw Label', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.renderer.bBoxTemplate = { x: 40, y: 40, height: 10, width: 20 };
        this.group = this.renderer.g();
        this.translators = {
            x: new MockTranslator({
                translate: { 1: 11 },
            }),
            y: new MockTranslator({
                translate: { 1: 50, 2: 33, 3: 10, 4: 5 },
            })
        };
        this.data = {
            value: 15,
            argument: 25,
            size: 30
        };
        this.options = {
            widgetType: 'chart',
            styles: {
                normal: {}
            },
            label: {
                visible: true,
                attributes: {},
                horizontalOffset: 0,
                verticalOffset: 0,
                background: {
                    fill: 'none',
                    'stroke-width': 0,
                    stroke: 'none'
                }
            }
        };
        this.series = {
            name: 'series',
            options: {},
            areLabelsVisible: function() { return true; },
            isFullStackedSeries: function() {
                return false;
            },
            getLabelVisibility: function() { return true; },
            _visibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 },
            getVisibleArea: function() { return this._visibleArea; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.label = sinon.createStubInstance(labelModule.Label);
        this.labelFactory = labelModule.Label = sinon.spy(function() {
            return that.label;
        });
        this.label.getLayoutOptions.returns(this.options.label);
        this.label.getBoundingRect.returns({ height: 10, width: 20 });
    },
    afterEach: function() {
        labelModule.Label = originalLabel;
    }
});

QUnit.test('Get label format object', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const result = point._getLabelFormatObject();

    assert.equal(result.value, 15);
    assert.equal(result.argument, 25);
    assert.equal(result.size, 30);
    assert.equal(result.originalArgument, 25);
    assert.equal(result.originalValue, 15);
    assert.deepEqual(result.point, point);
    assert.equal(result.seriesName, 'series');
});

QUnit.test('Value = null', function(assert) {
    this.data.value = null;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 33;
    point.y = 22;
    point.bubbleSize = 20;

    point._drawLabel(this.renderer, this.group);

    assert.ok(!point._label._insideGroup);
});

QUnit.test('Get graphic bbox', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 33;
    point.y = 22;
    point.bubbleSize = 20;

    const bBox = point._getGraphicBBox();

    assert.equal(bBox.x, 13);
    assert.equal(bBox.y, 2);
    assert.equal(bBox.width, 40);
    assert.equal(bBox.height, 40);
});

QUnit.test('Draw label outside', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const label = point._label;

    point.x = 33;
    point.y = 52;
    point.bubbleSize = 20;

    point.correctLabelPosition(label);

    assert.ok(label);
    assert.ok(label.shift.calledOnce);
    assert.equal(label.shift.firstCall.args[0], 23);
    assert.equal(label.shift.firstCall.args[1], 12);
});

QUnit.test('Draw label when position is invalid', function(assert) {
    this.options.label.position = 'abc';
    const point = createPoint(this.series, this.data, this.options);
    const label = point._label;

    point.x = 33;
    point.y = 52;
    point.bubbleSize = 20;

    point.correctLabelPosition(label);

    assert.ok(label);
    assert.ok(label.shift.calledOnce);
    assert.equal(label.shift.firstCall.args[0], 23);
    assert.equal(label.shift.firstCall.args[1], 12);
});

QUnit.test('Draw label inside', function(assert) {
    this.options.label.position = 'inside';
    const point = createPoint(this.series, this.data, this.options);
    const label = point._label;

    point.x = 33;
    point.y = 25;
    point.bubbleSize = 20;

    point.correctLabelPosition(label);

    assert.ok(label);
    assert.ok(label.shift.calledOnce);
    assert.equal(label.shift.firstCall.args[0], 23);
    assert.equal(label.shift.firstCall.args[1], 20);
});

QUnit.module('get point radius', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();

        this.group = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            visible: true,
            type: 'bubble',
            styles: { normal: { opacity: 0.4, style: 'normal' }, hover: { opacity: 0.4, style: 'hover' }, selection: { opacity: 0.4, style: 'selection' } },
            label: {
                visible: false
            }
        };
        this.series = {
            name: 'series',
            areLabelsVisible: function() { return false; },
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('get radius', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 2, size: 3 }, this.options);
    assert.equal(point.getPointRadius(), 0);
});
