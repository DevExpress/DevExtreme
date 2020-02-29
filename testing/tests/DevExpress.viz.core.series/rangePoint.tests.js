import $ from 'jquery';
import * as vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import labelModule from 'viz/series/points/label';
import { MockTranslator, MockAxis } from '../../helpers/chartMocks.js';
import tooltipModule from 'viz/core/tooltip';

const originalLabel = labelModule.Label;

const createPoint = function(series, data, options) {
    options = options || {};
    options.type = options.type || 'rangearea';
    const point = new pointModule.Point(series, data, options);
    point._getLabelCoordOfPosition = sinon.spy(point._getLabelCoordOfPosition);// check internal behavior
    return point;
};

function getMockAxisFunction(renderer, getTranslator, visibleArea) {
    const axis = new MockAxis({ renderer: renderer || new vizMocks.Renderer({}) });

    axis.getTranslator = getTranslator;
    if(visibleArea) {
        axis.getVisibleArea.returns(visibleArea);
    }
    return () => axis;
}

const environment = {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.renderer.bBoxTemplate = { x: 40, y: 40, height: 10, width: 20 };
        this.group = this.renderer.g();

        const translateYData = { 1: 0, 2: 80, 3: 200, 4: 300, 5: 400, 6: 480, 7: 600, 'canvas_position_default': 100 };
        const translateXData = { 1: 350, 2: 325, 3: 290, 4: 250, 5: 225, 6: 150, 'canvas_position_default': 300 };

        this.translators = {
            arg: new MockTranslator({
                translate: translateXData,
                failOnWrongData: true
            }),
            val: new MockTranslator({
                translate: translateYData,
                failOnWrongData: true
            })
        };
        this.data = {
            value: 15,
            minValue: 10,
            argument: 25
        };
        this.options = {
            widgetType: 'chart',
            type: 'rangearea',
            styles: {
                normal: {
                    r: 6
                }
            },
            label: {
                visible: true,
                horizontalOffset: 0,
                verticalOffset: 0,
                background: {
                    fill: 'none'
                },
                attributes: {}
            }
        };
        this.labelFactory = labelModule.Label = sinon.spy(function() {
            const label = sinon.createStubInstance(originalLabel);
            label.getLayoutOptions.returns(that.options.label);
            label.getBoundingRect.returns({ height: 10, width: 20 });
            return label;
        });
        this.series = {
            name: 'series',
            _labelsGroup: {},
            isFullStackedSeries: function() { return false; },
            _options: {},
            getLabelVisibility: function() { return true; },
            _visibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 },
            getVisibleArea: function() { return this._visibleArea; },
            getValueAxis: getMockAxisFunction(this.renderer, () => this.translators.val),
            getArgumentAxis: getMockAxisFunction(this.renderer, () => this.translators.arg),
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    },
    afterEach: function() {
        labelModule.Label = originalLabel;
    }
};

QUnit.module('Translation. Rangearea', {
    beforeEach: function() {
        const that = this;
        this.opt = {
            widgetType: 'chart',
            styles: {},
            label: { visible: false }
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() {
                return false;
            },
            getLabelVisibility: function() {
                return false;
            },
            getValueAxis: getMockAxisFunction(this.renderer, () => that.continuousTranslators.val),
            getArgumentAxis: getMockAxisFunction(this.renderer, () => that.continuousTranslators.arg),
            getVisibleArea: function() { return { minX: 0, maxX: 100, minY: 0, maxY: 210 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        const translateXData = { 1: 110, 2: 220, 3: 330, 4: 440, 5: 550, 'default': 70 };
        const translateYData = { 1: 111, 2: 222, 3: 333, 4: 444, 5: 555, 'default': 600 };

        this.continuousTranslators = {
            arg: new MockTranslator({
                translate: translateXData
            }),
            val: new MockTranslator({
                translate: translateYData
            })
        };
    }
});

QUnit.test('Width and height, not rotated', function(assert) {
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 'default' }, this.opt);

    pt.translate();

    assert.equal(pt.x, 110);
    assert.equal(pt.y, 555);

    assert.equal(pt.height, 45);
    assert.equal(pt.width, 0);

    assert.equal(pt.minY, 600);
});

QUnit.test('getCoords returns false if minValue coord is null', function(assert) {
    this.continuousTranslators.val = new MockTranslator({
        translate: { 1: null, 5: 10 }
    });
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(!pt.hasCoords());
});

QUnit.test('getCoords returns false if minValue coord is null, rotated', function(assert) {
    this.opt.rotated = true;

    this.continuousTranslators.val = new MockTranslator({
        translate: { 1: null, 5: 10 }
    });
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(!pt.hasCoords());
});

QUnit.test('getCoords returns false if value coord is null', function(assert) {
    this.continuousTranslators.val = new MockTranslator({
        translate: { 1: 1, 5: null }
    });
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(!pt.hasCoords());
});

QUnit.test('getCoords returns true if point has argument, value and min value coords', function(assert) {
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(pt.hasCoords());
});

QUnit.test('RangeBar. getCoords returns false if minValue coord is null', function(assert) {
    this.opt.type = 'rangebar';

    this.continuousTranslators.val = new MockTranslator({
        translate: { 1: null, 5: 10 }
    });

    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(!pt.hasCoords());
});

QUnit.test('RangeBar. getCoords returns false if minValue coord is null, rotated', function(assert) {
    this.opt.rotated = true;
    this.opt.type = 'rangebar';

    this.continuousTranslators.val = new MockTranslator({
        translate: { 1: null, 5: 10 }
    });
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(!pt.hasCoords());
});

QUnit.test('RangeBar. getCoords returns false if argument coord is null', function(assert) {
    this.opt.type = 'rangebar';
    this.continuousTranslators.arg = new MockTranslator({
        translate: { 1: null }
    });
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(!pt.hasCoords());
});

QUnit.test('RangeBar. getCoords returns false if value coord is null', function(assert) {
    this.opt.type = 'rangebar';
    this.continuousTranslators.val = new MockTranslator({
        translate: { 1: 1, 5: null }
    });
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(!pt.hasCoords());
});

QUnit.test('RangeBar. getCoords returns true if point has argument, value and minValue coords', function(assert) {
    this.opt.type = 'rangebar';
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);

    pt.translate();

    assert.ok(pt.hasCoords());
});

QUnit.test('getCrosshair data', function(assert) {
    this.series.axis = 'valueAxisName';
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 'default' }, this.opt);

    pt.translate();

    assert.equal(pt.x, 110);
    assert.equal(pt.y, 555);
    assert.equal(pt.minY, 600);

    assert.deepEqual(pt.getCrosshairData(80, 550), {
        x: 110,
        y: 555,
        xValue: 1,
        yValue: 5,
        axis: 'valueAxisName'
    });

    assert.deepEqual(pt.getCrosshairData(80, 570), {
        x: 110,
        y: 555,
        xValue: 1,
        yValue: 5,
        axis: 'valueAxisName'
    });

    assert.deepEqual(pt.getCrosshairData(80, 590), {
        x: 110,
        y: 600,
        xValue: 1,
        yValue: 'default',
        axis: 'valueAxisName'
    });
    assert.deepEqual(pt.getCrosshairData(80, 800), {
        x: 110,
        y: 600,
        xValue: 1,
        yValue: 'default',
        axis: 'valueAxisName'
    });

});

QUnit.test('Width and height, not rotated, null values', function(assert) {
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 1 }, this.opt);
    pt.initialValue = pt.value = null;

    pt.translate();

    assert.ok(!pt.x);
    assert.ok(!pt.y);
});

QUnit.test('Width and height, rotated', function(assert) {
    this.opt.rotated = true;

    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 'default' }, this.opt);
    pt.translate();

    assert.equal(pt.x, 555);
    assert.equal(pt.y, 110);

    assert.equal(pt.height, 0);
    assert.equal(pt.width, 45);

    assert.equal(pt.minX, 600);
});

QUnit.test('getCrosshair data. rotated', function(assert) {
    this.opt.rotated = true;
    this.series.axis = 'valueAxisName';
    const pt = createPoint(this.series, { argument: 1, value: 5, minValue: 'default' }, this.opt);

    pt.translate();

    assert.equal(pt.y, 110);
    assert.equal(pt.x, 555);
    assert.equal(pt.minX, 600);

    assert.equal(pt.height, 0);
    assert.equal(pt.width, 45);

    assert.deepEqual(pt.getCrosshairData(80, 100), {
        y: 110,
        x: 555,
        yValue: 1,
        xValue: 5,
        axis: 'valueAxisName'
    });

    assert.deepEqual(pt.getCrosshairData(300, 100), {
        y: 110,
        x: 555,
        yValue: 1,
        xValue: 5,
        axis: 'valueAxisName'
    });

    assert.deepEqual(pt.getCrosshairData(400, 100), {
        y: 110,
        x: 555,
        yValue: 1,
        xValue: 5,
        axis: 'valueAxisName'
    });
    assert.deepEqual(pt.getCrosshairData(600, 100), {
        y: 110,
        x: 600,
        yValue: 1,
        xValue: 'default',
        axis: 'valueAxisName'
    });
});

QUnit.module('Draw Point', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            visible: true,
            styles: { normal: { r: 6 }, hover: { r: 6 }, selection: { r: 6 } },
            label: { visible: false }
        };
        this.series = {
            name: 'series',
            _options: {},
            isFullStackedSeries: function() {
                return false;
            },
            getLabelVisibility: function() {
                return false;
            },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 600, minY: 0, maxY: 800 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11, 2: 33 }
            }),
            val: new MockTranslator({
                translate: { 1: 22, 2: 44 }
            })
        };
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Marker (symbol is circle), not rotated', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.translate();
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 22);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 44);

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.deepEqual(this.renderer.stub('circle').getCall(1).args, []);

    assert.equal(point.graphic.topMarker, this.renderer.stub('circle').getCall(0).returnValue);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('circle').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 22 });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 44 });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is circle), not rotated, animation Enabled', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.translate();
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;

    point.draw(this.renderer, this.groups, true, true);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 22);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 44);

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.deepEqual(this.renderer.stub('circle').getCall(1).args, []);

    assert.equal(point.graphic.topMarker, this.renderer.stub('circle').getCall(0).returnValue);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('circle').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 22 });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 44 });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker is not visible', function(assert) {
    this.options.symbol = 'circle';
    this.options.visible = false;
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = false;
    point.visibleBottomMarker = false;
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(!point.graphic);
});

QUnit.test('Marker (symbol is square), not rotated', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);
    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 22, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 44, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is polygon), not rotated', function(assert) {
    this.options.symbol = 'polygon';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 22, points: [-6, 0, 0, -6, 6, 0, 0, 6, -6, 0] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 44, points: [-6, 0, 0, -6, 6, 0, 0, 6, -6, 0] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is triangle), not rotated', function(assert) {
    this.options.symbol = 'triangle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 22, points: [-6, -6, 6, -6, 0, 6, -6, -6] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 44, points: [-6, -6, 6, -6, 0, 6, -6, -6] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is cross), not rotated', function(assert) {
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);
    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 22, points: [-6, -3, -3, -6, 0, -3, 3, -6, 6, -3, 3, 0, 6, 3, 3, 6, 0, 3, -3, 6, -6, 3, -3, 0] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], { r: 6, translateX: 11, translateY: 44, points: [-6, -3, -3, -6, 0, -3, 3, -6, 6, -3, 3, 0, 6, 3, 3, 6, 0, 3, -3, 6, -6, 3, -3, 0] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, not rotated. Top marker', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMaxPoint: 'test-url'
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.topMarker, this.renderer.stub('image').getCall(0).returnValue);

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('circle').getCall(0).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { translateX: 11, translateY: 22, visibility: undefined });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 44 });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, not rotated. Bottom marker', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMinPoint: 'test-url'
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.equal(point.graphic.topMarker, this.renderer.stub('circle').getCall(0).returnValue);

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('image').getCall(0).returnValue);

    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { translateX: 11, translateY: 44, visibility: undefined });
    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 22 });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, not rotated. Both markers', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMaxPoint: 'test-url',
            rangeMinPoint: 'test-url-2'
        },
        width: {
            rangeMaxPoint: 10,
            rangeMinPoint: 30
        },
        height: {
            rangeMaxPoint: 20,
            rangeMinPoint: 40
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('image').callCount, 2);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-5, -10, 10, 20, 'test-url', 'center']);
    assert.equal(point.graphic.topMarker, this.renderer.stub('image').getCall(0).returnValue);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 22);

    assert.deepEqual(this.renderer.stub('image').getCall(1).args, [-15, -20, 30, 40, 'test-url-2', 'center']);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('image').getCall(1).returnValue);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 44);

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, not rotated. Image is url', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = 'test-url';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('image').callCount, 2);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.topMarker, this.renderer.stub('image').getCall(0).returnValue);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 22);

    assert.deepEqual(this.renderer.stub('image').getCall(1).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('image').getCall(1).returnValue);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 44);

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is circle), rotated', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.deepEqual(this.renderer.stub('circle').getCall(1).args, []);

    assert.equal(point.graphic.topMarker, this.renderer.stub('circle').getCall(0).returnValue);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('circle').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 44, translateY: 11 });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 22, translateY: 11 });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is square), rotated', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 44, translateY: 11, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 22, translateY: 11, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is polygon), rotated', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'polygon';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 44, translateY: 11, points: [-6, 0, 0, -6, 6, 0, 0, 6, -6, 0] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 22, translateY: 11, points: [-6, 0, 0, -6, 6, 0, 0, 6, -6, 0] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is triangle), rotated', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'triangle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);
    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 44, translateY: 11, points: [-6, -6, 6, -6, 0, 6, -6, -6] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 22, translateY: 11, points: [-6, -6, 6, -6, 0, 6, -6, -6] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker (symbol is cross), rotated', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'cross';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 44, translateY: 11, points: [-6, -3, -3, -6, 0, -3, 3, -6, 6, -3, 3, 0, 6, 3, 3, 6, 0, 3, -3, 6, -6, 3, -3, 0] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 22, translateY: 11, points: [-6, -3, -3, -6, 0, -3, 3, -6, 6, -3, 3, 0, 6, 3, 3, 6, 0, 3, -3, 6, -6, 3, -3, 0] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, rotated. Top marker', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMaxPoint: 'test-url'
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.topMarker, this.renderer.stub('image').getCall(0).returnValue);

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('circle').getCall(0).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { translateX: 44, translateY: 11, visibility: undefined });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 22, translateY: 11 });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, rotated. Bottom marker', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMinPoint: 'test-url'
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('circle').callCount, 1);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.equal(point.graphic.topMarker, this.renderer.stub('circle').getCall(0).returnValue);

    assert.equal(this.renderer.stub('image').callCount, 1);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('image').getCall(0).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 44, translateY: 11 });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { translateX: 22, translateY: 11, visibility: undefined });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, rotated. Both markers', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMaxPoint: 'test-url',
            rangeMinPoint: 'test-url-2'
        },
        width: {
            rangeMaxPoint: 10,
            rangeMinPoint: 30
        },
        height: {
            rangeMaxPoint: 20,
            rangeMinPoint: 40
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('image').callCount, 2);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-5, -10, 10, 20, 'test-url', 'center']);
    assert.equal(point.graphic.topMarker, this.renderer.stub('image').getCall(0).returnValue);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 44);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 11);

    assert.deepEqual(this.renderer.stub('image').getCall(1).args, [-15, -20, 30, 40, 'test-url-2', 'center']);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('image').getCall(1).returnValue);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 22);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 11);

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Marker with image, rotated. Image is url', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'circle';
    this.options.image = 'test-url';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();

    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('image').callCount, 2);
    assert.deepEqual(this.renderer.stub('image').getCall(0).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.topMarker, this.renderer.stub('image').getCall(0).returnValue);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 44);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 11);

    assert.deepEqual(this.renderer.stub('image').getCall(1).args, [-10, -10, 20, 20, 'test-url', 'center']);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('image').getCall(1).returnValue);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 22);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 11);

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('get bounding rect, rangearea', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(point.getBoundingRect(), undefined);
});

QUnit.test('get bounding rect, rangebar', function(assert) {
    this.options.type = 'rangebar';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.strictEqual(point.getBoundingRect(), undefined);
});

QUnit.module('Update Point', {
    beforeEach: function() {
        const that = this;
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.options = {
            widgetType: 'chart',
            visible: true,
            styles: { normal: { r: 6 }, hover: { r: 6 }, selection: { r: 6 } },
            label: { visible: false }
        };
        this.series = {
            name: 'series',
            _options: {},
            isFullStackedSeries: function() {
                return false;
            },
            getLabelVisibility: function() {
                return false;
            },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 0, maxX: 600, minY: 0, maxY: 800 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11, 2: 33 }
            }),
            val: new MockTranslator({
                translate: { 1: 22, 2: 44 }
            })
        };
        this.groups = {
            markers: this.group
        };
    }
});

QUnit.test('Circle to non-circle', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { symbol: 'square' });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'path');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'path');

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.deepEqual(this.renderer.stub('circle').getCall(1).args, []);
    assert.notEqual(point.graphic.topMarker, this.renderer.stub('circle').getCall(0).returnValue);
    assert.notEqual(point.graphic.bottomMarker, this.renderer.stub('circle').getCall(1).returnValue, 'ddd');

    assert.deepEqual(this.renderer.stub('circle').getCall(0).returnValue.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 22 });
    assert.deepEqual(this.renderer.stub('circle').getCall(1).returnValue.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 44 });

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);
    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 22, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 44, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Non-circle to circle', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { symbol: 'circle' });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.ok(point.graphic.bottomMarker);
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.notEqual(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.notEqual(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);

    assert.deepEqual(this.renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 22, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });
    assert.deepEqual(this.renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 44, points: [-6, -6, 6, -6, 6, 6, -6, 6, -6, -6] });

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.deepEqual(this.renderer.stub('circle').getCall(0).args, []);
    assert.deepEqual(this.renderer.stub('circle').getCall(1).args, []);
    assert.equal(point.graphic.topMarker, this.renderer.stub('circle').getCall(0).returnValue);
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('circle').getCall(1).returnValue);
    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 22 });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], { r: 6, translateX: 11, translateY: 44 });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Update radius', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.styles.normal.r = 10;
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.equal(point.graphic.topMarker._stored_settings.r, 10);
    assert.ok(point.graphic.bottomMarker);
    assert.equal(point.graphic.bottomMarker._stored_settings.r, 10);

    assert.equal(point.graphic.topMarker._stored_settings.translateX, 44);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 22);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 11);

    assert.equal(this.renderer.stub('path').callCount, 2);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(0).args[1], 'area');
    assert.equal(point.graphic.topMarker, this.renderer.stub('path').getCall(0).returnValue);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[0], []);
    assert.deepEqual(this.renderer.stub('path').getCall(1).args[1], 'area');
    assert.equal(point.graphic.bottomMarker, this.renderer.stub('path').getCall(1).returnValue);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], { r: 10, translateX: 44, translateY: 11, points: [-10, -10, 10, -10, 10, 10, -10, 10, -10, -10] });
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], { r: 10, translateX: 22, translateY: 11, points: [-10, -10, 10, -10, 10, 10, -10, 10, -10, -10] });

    assert.equal(point.graphic.topMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(point.graphic.bottomMarker.stub('append').lastCall.args[0], this.group.children[0]);
    assert.equal(this.group.children[0].children.length, 2);
});

QUnit.test('Update fill', function(assert) {
    this.options.rotated = true;
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { styles: { normal: { fill: 'red' } } });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);

    assert.equal(point.graphic.topMarker._stored_settings.translateX, 44);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 22);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 11);
});

QUnit.test('Update location', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    point.x = 10;
    point.minY = 20;
    point.y = 30;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 10);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 20);
    assert.ok(point.graphic.bottomMarker);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 10);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 42);
});

QUnit.test('Update location when one of marker is invisible', function(assert) {
    this.options.symbol = 'square';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = false;
    point.translate();
    point.draw(this.renderer, this.groups);

    point.x = 10;
    point.minY = 20;
    point.y = 30;
    point.draw(this.renderer, this.groups);

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 10);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 20);

    assert.equal(this.group.children.length, 1);
    assert.equal(point.graphic.children.length, 1);
});

QUnit.test('Non-image to image. Top marker', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { image: { url: { rangeMaxPoint: 'test' } } });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('circle').callCount, 3);
    assert.equal(this.renderer.stub('image').callCount, 1);
});

QUnit.test('Non-image to image. Bottom marker', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { image: { url: { rangeMinPoint: 'test' } } });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('circle').callCount, 3);
    assert.equal(this.renderer.stub('image').callCount, 1);
});

QUnit.test('Non-image to image. Both markers (image is object)', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { image: { url: { rangeMinPoint: 'test', rangeMaxPoint: 'test' } } });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.equal(this.renderer.stub('image').callCount, 2);
});

QUnit.test('Non-image to image. Both markers (image is url)', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options, { image: 'test' });
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.equal(this.renderer.stub('image').callCount, 2);
});

QUnit.test('Image to non-image. Top marker', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = { url: { rangeMaxPoint: 'test' } };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options);
    newOptions.image = {};
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('circle').callCount, 3);
    assert.equal(this.renderer.stub('image').callCount, 1);
});

QUnit.test('Image to non-image. Bottom marker', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = { url: { rangeMinPoint: 'test' } };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options);
    newOptions.image = {};
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('circle').callCount, 3);
    assert.equal(this.renderer.stub('image').callCount, 1);
});

QUnit.test('Image to non-image. Both markers (image is object)', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = { url: { rangeMinPoint: 'test', rangeMaxPoint: 'test' } };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options);
    newOptions.image = {};
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.equal(this.renderer.stub('image').callCount, 2);
});

QUnit.test('Image to non-image. Both markers (image is url)', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = 'test';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    const newOptions = $.extend(true, {}, this.options);
    newOptions.image = {};
    point.updateOptions(newOptions);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(this.renderer.stub('circle').callCount, 2);
    assert.equal(this.renderer.stub('image').callCount, 2);
});

QUnit.test('Update size and url of image. Top marker', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = { url: { rangeMaxPoint: 'test' } };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.image = { url: { rangeMaxPoint: 'new-test' }, width: 30, height: 40 };
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'circle');

    assert.equal(point.graphic.topMarker._stored_settings.href, 'new-test');
    assert.equal(point.graphic.topMarker._stored_settings.width, 30);
    assert.equal(point.graphic.topMarker._stored_settings.height, 40);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 22);
});

QUnit.test('Update size and url of image. Bottom marker', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = { url: { rangeMinPoint: 'test' } };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.image = { url: { rangeMinPoint: 'new-test' }, width: 30, height: 40 };
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'circle');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(point.graphic.bottomMarker._stored_settings.href, 'new-test');
    assert.equal(point.graphic.bottomMarker._stored_settings.width, 30);
    assert.equal(point.graphic.bottomMarker._stored_settings.height, 40);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 44);
});

QUnit.test('Update size and url of image. Both markers (image is object)', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = { url: { rangeMinPoint: 'test-2', rangeMaxPoint: 'test' } };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.image = {
        url: {
            rangeMinPoint: 'new-test-2',
            rangeMaxPoint: 'new-test'
        },
        width: {
            rangeMinPoint: 50,
            rangeMaxPoint: 30
        },
        height: {
            rangeMinPoint: 60,
            rangeMaxPoint: 40
        }
    };
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(point.graphic.topMarker._stored_settings.href, 'new-test');
    assert.equal(point.graphic.topMarker._stored_settings.width, 30);
    assert.equal(point.graphic.topMarker._stored_settings.height, 40);
    assert.equal(point.graphic.topMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.topMarker._stored_settings.translateY, 22);

    assert.equal(point.graphic.bottomMarker._stored_settings.href, 'new-test-2');
    assert.equal(point.graphic.bottomMarker._stored_settings.width, 50);
    assert.equal(point.graphic.bottomMarker._stored_settings.height, 60);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateX, 11);
    assert.equal(point.graphic.bottomMarker._stored_settings.translateY, 44);
});

QUnit.test('Update size and url of image. Both markers (image is url)', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = 'test';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    this.options.image = 'new-test';
    point.updateOptions(this.options);
    point.translate();
    point.draw(this.renderer, this.groups);

    assert.equal(point.graphic.topMarker.typeOfNode, 'image');
    assert.equal(point.graphic.bottomMarker.typeOfNode, 'image');

    assert.equal(point.graphic.topMarker._stored_settings.href, 'new-test');
    assert.equal(point.graphic.bottomMarker._stored_settings.href, 'new-test');
});

QUnit.test('Update markers style', function(assert) {
    this.options.symbol = 'circle';
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 1 }, this.options);
    const style = {
        fill: 'hover-style',
        stroke: 'hover-stroke',
        'stroke-width': 'hover-strokeWidth',
        r: 'hover-radius'
    };

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    point._updateMarker(undefined, style);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], $.extend(style, { translateX: 11, translateY: 22 }));
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], $.extend(style, { translateX: 11, translateY: 22 }));
});

QUnit.test('Update markers style when top marker is image', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMaxPoint: 'test'
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 1 }, this.options);
    const style = {
        fill: 'hover-style',
        stroke: 'hover-stroke',
        'stroke-width': 'hover-strokeWidth',
        r: 'hover-radius'
    };

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    point._updateMarker(undefined, style);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], {
        'height': 20,
        'href': 'test',
        'translateX': 11,
        'translateY': 22,
        'width': 20
    });

    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], $.extend(style, { translateX: 11, translateY: 22 }));
});

QUnit.test('Update markers style when bottom marker is image', function(assert) {
    this.options.symbol = 'circle';
    this.options.image = {
        url: {
            rangeMinPoint: 'test'
        }
    };
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 1 }, this.options);
    const style = {
        fill: 'hover-style',
        stroke: 'hover-stroke',
        'stroke-width': 'hover-strokeWidth',
        r: 'hover-radius'
    };

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    point._updateMarker(undefined, style);

    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0], $.extend(style, { translateX: 11, translateY: 22 }));
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0], {
        'height': 20,
        'href': 'test',
        'translateX': 11,
        'translateY': 22,
        'width': 20
    });
});

QUnit.module('Point visibility', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.data = {
            argument: 1,
            value: 1,
            minValue: 1
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
        };
        this.options = {
            widgetType: 'chart',
            visible: true,
            symbol: 'circle',
            styles: { normal: { r: 6, style: { fill: 'red', stroke: 'yellow', 'stroke-width': 2 } } },
            label: { visible: false }
        };
    },
    afterEach: environment.afterEach
});

QUnit.test('Clear marker', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    point.clearMarker();

    assert.strictEqual(point.graphic.topMarker._stored_settings.fill, null);
    assert.strictEqual(point.graphic.topMarker._stored_settings.stroke, null);

    assert.strictEqual(point.graphic.topMarker._stored_settings.visibility, undefined);
    assert.strictEqual(point.graphic.topMarker._stored_settings['stroke-width'], undefined);
    assert.strictEqual(point.graphic.topMarker._stored_settings.opacity, undefined);

    assert.strictEqual(point.graphic.bottomMarker._stored_settings.fill, null);
    assert.strictEqual(point.graphic.bottomMarker._stored_settings.stroke, null);

    assert.strictEqual(point.graphic.bottomMarker._stored_settings.visibility, undefined);
    assert.strictEqual(point.graphic.bottomMarker._stored_settings['stroke-width'], undefined);
    assert.strictEqual(point.graphic.bottomMarker._stored_settings.opacity, undefined);
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

QUnit.test('Clear visibility', function(assert) {
    this.options.styles.normal.visibility = 'visible';
    this.options.styles.useLabelCustomOptions = true;
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.draw(this.renderer, this.groups);

    point.clearVisibility();

    assert.strictEqual(point.graphic.topMarker._stored_settings.visibility, null);
    assert.strictEqual(point.graphic.bottomMarker._stored_settings.visibility, null);
});

QUnit.test('Hide marker when marker is visible', function(assert) {
    this.options.styles.normal.visibility = 'visible';
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.draw(this.renderer, this.groups);

    point.graphic.topMarker.stub('attr').reset();
    point.graphic.bottomMarker.stub('attr').reset();

    point.setInvisibility();

    assert.equal(point.graphic.topMarker.stub('attr').callCount, 2);
    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], 'visibility');
    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0].visibility, 'hidden');
    assert.deepEqual(point._topLabel.draw.lastCall.args, [false]);

    assert.equal(point.graphic.bottomMarker.stub('attr').callCount, 2);
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], 'visibility');
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0].visibility, 'hidden');
    assert.deepEqual(point._bottomLabel.draw.lastCall.args, [false]);
});

QUnit.test('Hide marker when marker has no visibility setting', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.draw(this.renderer, this.groups);

    point.graphic.topMarker.stub('attr').reset();
    point.graphic.bottomMarker.stub('attr').reset();

    point.setInvisibility();

    assert.equal(point.graphic.topMarker.stub('attr').callCount, 2);
    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], 'visibility');
    assert.deepEqual(point.graphic.topMarker.stub('attr').lastCall.args[0].visibility, 'hidden');
    assert.deepEqual(point._topLabel.draw.lastCall.args, [false]);

    assert.equal(point.graphic.bottomMarker.stub('attr').callCount, 2);
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], 'visibility');
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').lastCall.args[0].visibility, 'hidden');
    assert.deepEqual(point._bottomLabel.draw.lastCall.args, [false]);
});

QUnit.test('Hide marker when marker is hidden', function(assert) {
    this.options.styles.normal.visibility = 'hidden';
    this.options.styles.useLabelCustomOptions = true;
    this.options.label.visible = false;
    const point = createPoint(this.series, this.data, this.options);

    point.translate();
    point.visibleTopMarker = true;
    point.visibleBottomMarker = true;
    point.draw(this.renderer, this.groups);

    point.graphic.topMarker.stub('attr').reset();
    point.graphic.bottomMarker.stub('attr').reset();

    point.setInvisibility();

    assert.strictEqual(point.graphic.topMarker._stored_settings.visibility, 'hidden');
    assert.equal(point.graphic.topMarker.stub('attr').callCount, 1);
    assert.deepEqual(point.graphic.topMarker.stub('attr').firstCall.args[0], 'visibility');
    assert.deepEqual(point._topLabel.draw.lastCall.args, [false]);

    assert.strictEqual(point.graphic.bottomMarker._stored_settings.visibility, 'hidden');
    assert.equal(point.graphic.bottomMarker.stub('attr').callCount, 1);
    assert.deepEqual(point.graphic.bottomMarker.stub('attr').firstCall.args[0], 'visibility');
    assert.deepEqual(point._bottomLabel.draw.lastCall.args, [false]);
});

QUnit.test('Apply style when top marker is invisible', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = false;
    point.visibleBottomMarker = true;
    point.translate();
    point.draw(this.renderer, this.groups);

    point.applyView();

    assert.ok(point.graphic);
    assert.ok(!point.graphic.topMarker);
    assert.ok(point.graphic.bottomMarker);
});

QUnit.test('Apply style when bottom marker is invisible', function(assert) {
    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 2 }, this.options);

    point.visibleTopMarker = true;
    point.visibleBottomMarker = false;
    point.translate();
    point.draw(this.renderer, this.groups);

    point.applyView();

    assert.ok(point.graphic);
    assert.ok(point.graphic.topMarker);
    assert.ok(!point.graphic.bottomMarker);
});

QUnit.module('Tooltip', {
    beforeEach: function() {
        const that = this;
        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11, 2: 33 }
            }),
            val: new MockTranslator({
                translate: { 1: 22, 2: 44 }
            })
        };
        this.data = {
            value: 10,
            argument: 1,
            minValue: 4
        };
        this.options = {
            widgetType: 'chart',
            styles: {},
            label: { visible: false }
        };
        this.series = {
            name: 'Series1',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: function() { return { getTranslator: function() { return that.translators.val; } }; },
            getArgumentAxis: function() { return { getTranslator: function() { return that.translators.arg; } }; },
            getVisibleArea: function() { return { minX: 10, maxX: 600, minY: 5, maxY: 810 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        const StubTooltip = vizMocks.stubClass(tooltipModule.Tooltip, {
            formatValue: function(value, specialFormat) {
                return value || value === 0 ? value + ':' + specialFormat : value || '';
            }
        });
        this.tooltip = new StubTooltip();
    }
});

QUnit.test('Get tooltip coordinates, not rotated', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 250;
    point.minY = 200;
    point.height = 50;

    const cc = point.getTooltipParams();

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 225);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip coordinates, not rotated. Rangebar. Location is edge', function(assert) {
    this.options.type = 'rangebar';
    const point = createPoint(this.series, this.data, this.options);

    point.x = 400;
    point.y = 200;
    point.width = 50;
    point.height = 100;

    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 425, y: 200, offset: 0 });
});

QUnit.test('Get tooltip coordinates. Rangebar. Rotated. Location is edge', function(assert) {
    this.options.type = 'rangebar';
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 400;
    point.y = 200;
    point.width = 50;
    point.height = 100;

    const cc = point.getTooltipParams('edge');

    assert.deepEqual(cc, { x: 450, y: 250, offset: 0 });
});

QUnit.test('Get tooltip coordinates. Rangebar. Not rotated. Location is center', function(assert) {
    this.options.type = 'rangebar';
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 400;
    point.y = 200;
    point.width = 50;
    point.height = 100;

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 425, y: 250, offset: 0 });
});

QUnit.test('Get tooltip coordinates. Rangebar. Rotated. Location is center', function(assert) {
    this.options.type = 'rangebar';
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);

    point.x = 400;
    point.y = 200;
    point.width = 50;
    point.height = 100;

    const cc = point.getTooltipParams('center');

    assert.deepEqual(cc, { x: 425, y: 250, offset: 0 });
});

QUnit.test('Get tooltip coordinates, not rotated, point is abroad on the top', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 250;
    point.minY = -5;
    point.height = 255;

    const cc = point.getTooltipParams();

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 127.5);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip coordinates, not rotated, point is abroad on the bottom', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = 430;
    point.y = 850;
    point.minY = 200;
    point.height = 650;

    const cc = point.getTooltipParams();

    assert.equal(cc.x, 430);
    assert.equal(cc.y, 505);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip coordinates,rotated', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point.x = 430;
    point.y = 250;
    point.minX = 200;
    point.width = 230;

    const cc = point.getTooltipParams();

    assert.equal(cc.x, 315);
    assert.equal(cc.y, 250);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip coordinates,rotated, point is abroad on the left', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point.y = 430;
    point.x = 850;
    point.minX = 200;
    point.width = 650;

    const cc = point.getTooltipParams();

    assert.equal(cc.y, 430);
    assert.equal(cc.x, 400);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip coordinates,rotated, point is abroad on the right', function(assert) {
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    point.y = 430;
    point.x = 250;
    point.minX = -5;
    point.width = 255;

    const cc = point.getTooltipParams();

    assert.equal(cc.y, 430);
    assert.equal(cc.x, 130);
    assert.equal(cc.offset, 0);
});

QUnit.test('Get tooltip Format Object. Range area', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const cc = point.getTooltipFormatObject(this.tooltip);

    assert.equal(cc.argument, 1);
    assert.equal(cc.argumentText, '1:argument');
    assert.equal(cc.valueText, '4:undefined - 10:undefined');
    assert.equal(cc.rangeValue1Text, '4:undefined');
    assert.equal(cc.rangeValue2Text, '10:undefined');
    assert.equal(cc.rangeValue1, 4);
    assert.equal(cc.rangeValue2, 10);
    assert.equal(cc.seriesName, 'Series1');
    assert.equal(cc.point, point);
    assert.equal(cc.originalArgument, 1);
    assert.equal(cc.originalMinValue, 4);
    assert.equal(cc.originalValue, 10);
});

QUnit.test('Get tooltip Format Object. Range bar', function(assert) {
    this.options.type = 'rangebar';
    const point = createPoint(this.series, this.data, this.options);
    const cc = point.getTooltipFormatObject(this.tooltip);

    assert.equal(cc.argument, 1);
    assert.equal(cc.argumentText, '1:argument');
    assert.equal(cc.valueText, '4:undefined - 10:undefined');
    assert.equal(cc.rangeValue1Text, '4:undefined');
    assert.equal(cc.rangeValue2Text, '10:undefined');
    assert.equal(cc.rangeValue1, 4);
    assert.equal(cc.rangeValue2, 10);
    assert.equal(cc.seriesName, 'Series1');
    assert.equal(cc.point, point);
    assert.equal(cc.originalArgument, 1);
    assert.equal(cc.originalMinValue, 4);
    assert.equal(cc.originalValue, 10);
});

QUnit.module('API', {
    beforeEach: function() {
        const that = this;
        this.opt = {
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
            getVisibleArea: function() { return { minX: 0, maxX: 300, minY: 0, maxY: 300 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        sinon.spy(labelModule, 'Label');

        this.translators = {
            arg: new MockTranslator({
                translate: { 'null': 0, 1: 11, 10: 111 }
            }),
            val: new MockTranslator({
                translate: { 'null': 0, 1: 22, 10: 222 }
            })
        };
    },
    afterEach: function() {
        labelModule.Label.restore();
    }
});

QUnit.test('HasValue. Positive value', function(assert) {
    const pt = createPoint(this.series, { argument: 12, value: 5, minValue: 4 }, this.opt);

    assert.strictEqual(pt.hasValue(), true);
});

QUnit.test('HasValue. Negative value', function(assert) {
    const pt = createPoint(this.series, { argument: 12, value: null, minValue: 4 }, this.opt);

    assert.strictEqual(pt.hasValue(), false);
});

QUnit.test('getLabel. Rangearea', function(assert) {
    this.opt.type = 'rangearea';
    const pt = createPoint(this.series, { argument: 12, value: null, minValue: 4 }, this.opt);
    const labels = pt.getLabel();

    assert.equal(labels.length, 2);
    assert.equal(labels[0], labelModule.Label.returnValues[0]);
    assert.equal(labels[1], labelModule.Label.returnValues[1]);
});

QUnit.test('getLabel. Rangebar', function(assert) {
    this.opt.type = 'rangebar';
    const pt = createPoint(this.series, { argument: 12, value: null, minValue: 4 }, this.opt);
    const labels = pt.getLabel();

    assert.equal(labels.length, 2);
    assert.equal(labels[0], labelModule.Label.returnValues[0]);
    assert.equal(labels[1], labelModule.Label.returnValues[1]);
});

QUnit.test('CoordsIn. RangeArea', function(assert) {
    this.opt.type = 'rangearea';

    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 10 }, this.opt);
    point.translate(); // point.x = 11, point.y = 22; point.minY = 220

    point._storeTrackerR = function() {
        return 20;
    };
    // value marker
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
    // minValue marker
    assert.ok(point.coordsIn(11, 222), 'center');
    assert.ok(point.coordsIn(21, 222), 'right inside');
    assert.ok(point.coordsIn(31, 222), 'right side');
    assert.ok(!point.coordsIn(32, 222), 'right side out');

    assert.ok(point.coordsIn(10, 222), 'left inside');
    assert.ok(point.coordsIn(-8, 222), 'left side');
    assert.ok(!point.coordsIn(-11, 222), 'left side out');

    assert.ok(point.coordsIn(11, 232), 'bottom inside');
    assert.ok(point.coordsIn(11, 241), 'bottom side');
    assert.ok(!point.coordsIn(11, 243), 'bottom side out');

    assert.ok(point.coordsIn(11, 210), 'top inside');
    assert.ok(point.coordsIn(11, 203), 'top side');
    assert.ok(!point.coordsIn(11, 201), 'top side out');
});

QUnit.test('CoordsIn. RangeArea. Rotated', function(assert) {
    this.opt.type = 'rangearea';
    this.opt.rotated = true;

    const point = createPoint(this.series, { argument: 1, value: 1, minValue: 10 }, this.opt);
    point.translate(); // point.y = 11, point.x = 22; point.minX = 220

    point._storeTrackerR = function() {
        return 20;
    };
    // marker
    assert.ok(point.coordsIn(22, 11), 'center');
    assert.ok(point.coordsIn(22, 21), 'right inside');
    assert.ok(point.coordsIn(22, 31), 'right side');
    assert.ok(!point.coordsIn(22, 32), 'right side out');

    assert.ok(point.coordsIn(22, 10), 'left inside');
    assert.ok(point.coordsIn(22, -8), 'left side');
    assert.ok(!point.coordsIn(22, -11), 'left side out');

    assert.ok(point.coordsIn(32, 11), 'bottom inside');
    assert.ok(point.coordsIn(41, 11), 'bottom side');
    assert.ok(!point.coordsIn(43, 11), 'bottom side out');

    assert.ok(point.coordsIn(10, 11), 'top inside');
    assert.ok(point.coordsIn(3, 11), 'top side');
    assert.ok(!point.coordsIn(1, 11), 'top side out');
    // min value marker
    assert.ok(point.coordsIn(220, 11), 'center');
    assert.ok(point.coordsIn(220, 21), 'right inside');
    assert.ok(point.coordsIn(220, 31), 'right side');
    assert.ok(!point.coordsIn(220, 32), 'right side out');

    assert.ok(point.coordsIn(220, 10), 'left inside');
    assert.ok(point.coordsIn(220, -8), 'left side');
    assert.ok(!point.coordsIn(220, -11), 'left side out');

    assert.ok(point.coordsIn(232, 11), 'bottom inside');
    assert.ok(point.coordsIn(241, 11), 'bottom side');
    assert.ok(!point.coordsIn(243, 11), 'bottom side out');

    assert.ok(point.coordsIn(210, 11), 'top inside');
    assert.ok(point.coordsIn(203, 11), 'top side');
    assert.ok(!point.coordsIn(201, 11), 'top side out');
});

QUnit.module('Check points in visible area', {
    beforeEach: function() {
        this.options = {
            widgetType: 'chart',
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: getMockAxisFunction(this.renderer, () => this.translators.val, [0, 210]),
            getArgumentAxis: getMockAxisFunction(this.renderer, () => this.translators.arg, [0, 100]),
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        this.data = { argument: 1, value: 1, minValue: 1 };

        this.translators = {
            arg: new MockTranslator({
                translate: { 1: 11, 2: 33 }
            }),
            val: new MockTranslator({
                translate: { 1: 22, 2: 44 }
            })
        };
    }
});

QUnit.test('Two points are in visible area, not rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt.x = 85;
    pt.y = 43;
    pt.minY = pt.minX = 99;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(pt.visibleTopMarker);
    assert.ok(pt.visibleBottomMarker);
});

QUnit.test('Two points are not in visible area on left, not rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt.x = -30;
    pt.y = 43;
    pt.minY = pt.minX = 99;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(!isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('Two points are not in visible area on right, not rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt.x = 130;
    pt.y = 43;
    pt.minY = pt.minX = 99;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(!isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('One of the points are not in visible area on top, not rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt.x = 30;
    pt.y = -45;
    pt.minY = pt.minX = 30;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(pt.visibleBottomMarker);
});

QUnit.test('One of the points are not in visible area on bottom, not rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt.x = 30;
    pt.y = 30;
    pt.minY = pt.minX = 330;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('Points are not in visible area, but area is visible, not rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt.x = 30;
    pt.y = -30;
    pt.minY = pt.minX = 330;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('Two points are in visible area, rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt._options.rotated = true;
    pt.y = 66;
    pt.x = 85;
    pt.minX = pt.minY = 45;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(pt.visibleTopMarker);
    assert.ok(pt.visibleBottomMarker);
});

QUnit.test('Two points are not in visible area on top, rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt._options.rotated = true;
    pt.y = -40;
    pt.x = 85;
    pt.minX = pt.minY = 45;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(!isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('Two points are not in visible area on bottom, rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt._options.rotated = true;
    pt.y = 230;
    pt.x = 85;
    pt.minX = pt.minY = 45;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(!isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('One of the points are not in visible area on left, rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt._options.rotated = true;
    pt.y = 50;
    pt.x = -33;
    pt.minX = pt.minY = 50;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('One of the points are not in visible area on right, rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt._options.rotated = true;
    pt.y = 50;
    pt.x = 50;
    pt.minX = pt.minY = 443;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(pt.visibleBottomMarker);
});

QUnit.test('Points are not in visible area, but area is visible, rotated', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt._options.rotated = true;
    pt.y = 50;
    pt.x = -50;
    pt.minX = pt.minY = 443;

    const isInVisibleArea = pt.isInVisibleArea();

    assert.ok(isInVisibleArea);
    assert.ok(!pt.visibleTopMarker);
    assert.ok(!pt.visibleBottomMarker);
});

QUnit.test('Points are at the end of value axis', function(assert) {
    const pt = createPoint(this.series, this.data, this.options);
    pt.y = 0;
    pt.minY = 210;
    pt.minX = pt.x = 50;

    pt.isInVisibleArea();

    assert.ok(pt.visibleTopMarker);
    assert.ok(pt.visibleBottomMarker);
});

QUnit.module('Point translators. Rangebar', {
    beforeEach: function() {
        this.opt = {
            widgetType: 'chart',
            type: 'rangebar',
            label: { visible: false },
            styles: {}
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: getMockAxisFunction(this.renderer, () => this.translators.val),
            getArgumentAxis: getMockAxisFunction(this.renderer, () => this.translators.arg),
            getVisibleArea: function() { return { minX: 0, maxX: 800, minY: 0, maxY: 800 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
    },
    setContinuousTranslators: function() {
        const xTranslator = new MockTranslator({
            translate: { 1: 110, 2: 220, 3: 330, 4: 440, 5: 550, 'default': 70 }
        });
        const yTranslator = new MockTranslator({
            translate: { 1: 111, 2: 222, 3: 333, 4: 444, 5: 555, 'default': 600 }
        });

        this.translators = this.opt.rotated ? { arg: yTranslator, val: xTranslator } : { arg: xTranslator, val: yTranslator };
    }
});

QUnit.test('Translate when value = minValue', function(assert) {
    this.setContinuousTranslators();
    const pt = createPoint(this.series, { argument: 1, value: 5 }, this.opt);

    pt.minValue = 5;
    pt.translate();

    assert.equal(pt.x, 110);
    assert.equal(pt.y, 555);

    assert.equal(pt.height, 1);
    assert.equal(pt.width, undefined);

    assert.equal(pt.minY, 555);
});

QUnit.test('Translate when minValue = null', function(assert) {
    this.setContinuousTranslators();
    const pt = createPoint(this.series, { argument: 1, value: 5 }, this.opt);

    pt.initialMinValue = pt.minValue = null;
    pt.translate();

    assert.ok(!pt.x);
    assert.ok(!pt.y);
});

QUnit.test('Translate when value = minValue. Rotated', function(assert) {
    this.opt.rotated = true;
    this.setContinuousTranslators();
    const pt = createPoint(this.series, { argument: 1, value: 5 }, this.opt);

    pt.minValue = 5;
    pt.translate();

    assert.equal(pt.x, 550);
    assert.equal(pt.y, 111);

    assert.equal(pt.height, undefined);
    assert.equal(pt.width, 1);

    assert.equal(pt.minX, 550);
});

QUnit.module('Point coordinates translation with correction on canvas visible area.', {
    beforeEach: function() {
        this.opt = {
            widgetType: 'chart',
            type: 'rangebar',
            styles: {},
            label: { visible: false }
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: getMockAxisFunction(this.renderer, () => this.continuousTranslators.val, [200, 300]),
            getArgumentAxis: getMockAxisFunction(this.renderer, () => this.continuousTranslators.arg, [100, 500]),
            getVisibleArea: function() { return { minX: 100, maxX: 500, minY: 200, maxY: 300 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        const translateXData = { 1: 0, 2: 80, 3: 200, 4: 300, 5: 400, 6: 480, 7: 600, 'canvas_position_default': 100 };
        const translateYData = { 1: 350, 2: 325, 3: 290, 4: 250, 5: 225, 6: 150, 'canvas_position_default': 300 };

        this.continuousTranslators = {
            arg: new MockTranslator({
                translate: translateXData,
                failOnWrongData: true
            }),
            val: new MockTranslator({
                translate: translateYData,
                failOnWrongData: true
            })
        };
    }
});

QUnit.test('Point is out of boundaries on the left', function(assert) {
    const pt = createPoint(this.series, { argument: 1, value: 4, minValue: 3 }, this.opt);

    pt.width = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, false, 'inVisibleArea');
    assert.strictEqual(pt.y, 250, 'y');
    assert.strictEqual(pt.minY, 290, 'minY');
    assert.strictEqual(pt.height, 40, 'height');
    assert.strictEqual(pt.x, 0, 'x');
    assert.strictEqual(pt.width, 50, 'width');
});

QUnit.test('Point is partially out of boundaries on the left and bottom', function(assert) {
    const pt = createPoint(this.series, { argument: 2, value: 5, minValue: 2 }, this.opt);

    pt.width = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 225, 'y');
    assert.strictEqual(pt.minY, 300, 'minY');
    assert.strictEqual(pt.height, 75, 'height');
    assert.strictEqual(pt.x, 100, 'x');
    assert.strictEqual(pt.width, 30, 'width');
});

QUnit.test('Point is partially out of boundaries at the top and bottom', function(assert) {
    const pt = createPoint(this.series, { argument: 3, value: 6, minValue: 1 }, this.opt);

    pt.width = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 200, 'y');
    assert.strictEqual(pt.minY, 300, 'minY');
    assert.strictEqual(pt.height, 100, 'height');
    assert.strictEqual(pt.x, 200, 'x');
    assert.strictEqual(pt.width, 50, 'width');
});

QUnit.test('Point is partially out of boundaries at the bottom', function(assert) {
    const pt = createPoint(this.series, { argument: 4, value: 4, minValue: 1 }, this.opt);

    pt.width = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 250, 'y');
    assert.strictEqual(pt.minY, 300, 'minY');
    assert.strictEqual(pt.height, 50, 'height');
    assert.strictEqual(pt.x, 300, 'x');
    assert.strictEqual(pt.width, 50, 'width');
});

QUnit.test('Point is partially out of boundaries at the top', function(assert) {
    const pt = createPoint(this.series, { argument: 5, value: 6, minValue: 4 }, this.opt);

    pt.width = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 200, 'y');
    assert.strictEqual(pt.minY, 250, 'minY');
    assert.strictEqual(pt.height, 50, 'height');
    assert.strictEqual(pt.x, 400, 'x');
    assert.strictEqual(pt.width, 50, 'width');
});

QUnit.test('Point is partially out of boundaries on the right', function(assert) {
    const pt = createPoint(this.series, { argument: 6, value: 5, minValue: 3 }, this.opt);

    pt.width = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 225, 'y');
    assert.strictEqual(pt.minY, 290, 'minY');
    assert.strictEqual(pt.height, 65, 'height');
    assert.strictEqual(pt.x, 480, 'x');
    assert.strictEqual(pt.width, 20, 'width');
});

QUnit.test('Point is out of boundaries on the right', function(assert) {
    const pt = createPoint(this.series, { argument: 7, value: 5, minValue: 2 }, this.opt);

    pt.width = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, false, 'inVisibleArea');
    assert.strictEqual(pt.y, 225, 'y');
    assert.strictEqual(pt.minY, 300, 'minY');
    assert.strictEqual(pt.height, 75, 'height');
    assert.strictEqual(pt.x, 600, 'x');
    assert.strictEqual(pt.width, 50, 'width');
});

QUnit.module('Point coordinates translation with correction on canvas visible area. Rotated.', {
    beforeEach: function() {
        this.opt = {
            widgetType: 'chart',
            type: 'rangebar',
            styles: {},
            rotated: true,
            label: { visible: false }
        };
        this.series = {
            name: 'series',
            isFullStackedSeries: function() { return false; },
            getLabelVisibility: function() { return false; },
            getValueAxis: getMockAxisFunction(this.renderer, () => this.continuousTranslators.val, [200, 300]),
            getArgumentAxis: getMockAxisFunction(this.renderer, () => this.continuousTranslators.arg, [100, 500]),
            getVisibleArea: function() { return { minX: 200, maxX: 300, minY: 100, maxY: 500 }; },
            _argumentChecker: function() { return true; },
            _valueChecker: function() { return true; }
        };
        const translateYData = { 1: 0, 2: 80, 3: 200, 4: 300, 5: 400, 6: 480, 7: 600, 'canvas_position_default': 100 };
        const translateXData = { 1: 350, 2: 325, 3: 290, 4: 250, 5: 225, 6: 150, 'canvas_position_default': 300 };

        this.continuousTranslators = {
            val: new MockTranslator({
                translate: translateXData,
                failOnWrongData: true
            }),
            arg: new MockTranslator({
                translate: translateYData,
                failOnWrongData: true
            })
        };
    }
});

QUnit.test('Point is out of boundaries on the left', function(assert) {
    const pt = createPoint(this.series, { argument: 1, value: 4, minValue: 3 }, this.opt);

    pt.height = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, false, 'inVisibleArea');
    assert.strictEqual(pt.y, 0, 'y');
    assert.strictEqual(pt.height, 50, 'height');
    assert.strictEqual(pt.x, 250, 'x');
    assert.strictEqual(pt.minX, 290, 'minX');
    assert.strictEqual(pt.width, 40, 'width');
});

QUnit.test('Point is partially out of boundaries on the left and bottom', function(assert) {
    const pt = createPoint(this.series, { argument: 2, value: 5, minValue: 2 }, this.opt);

    pt.height = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 100, 'y');
    assert.strictEqual(pt.height, 30, 'height');
    assert.strictEqual(pt.x, 225, 'x');
    assert.strictEqual(pt.minX, 300, 'minX');
    assert.strictEqual(pt.width, 75, 'width');
});

QUnit.test('Point is partially out of boundaries at the top and bottom', function(assert) {
    const pt = createPoint(this.series, { argument: 3, value: 6, minValue: 1 }, this.opt);

    pt.height = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 200, 'y');
    assert.strictEqual(pt.height, 50, 'height');
    assert.strictEqual(pt.x, 200, 'x');
    assert.strictEqual(pt.minX, 300, 'minX');
    assert.strictEqual(pt.width, 100, 'width');
});

QUnit.test('Point is partially out of boundaries at the bottom', function(assert) {
    const pt = createPoint(this.series, { argument: 4, value: 4, minValue: 1 }, this.opt);

    pt.height = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 300, 'y');
    assert.strictEqual(pt.height, 50, 'height');
    assert.strictEqual(pt.x, 250, 'x');
    assert.strictEqual(pt.minX, 300, 'minX');
    assert.strictEqual(pt.width, 50, 'width');
});

QUnit.test('Point is partially out of boundaries at the top', function(assert) {
    const pt = createPoint(this.series, { argument: 5, value: 6, minValue: 4 }, this.opt);

    pt.height = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 400, 'y');
    assert.strictEqual(pt.height, 50, 'height');
    assert.strictEqual(pt.x, 200, 'x');
    assert.strictEqual(pt.minX, 250, 'minX');
    assert.strictEqual(pt.width, 50, 'width');
});

QUnit.test('Point is partially out of boundaries on the right', function(assert) {
    const pt = createPoint(this.series, { argument: 6, value: 5, minValue: 3 }, this.opt);

    pt.height = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, true, 'inVisibleArea');
    assert.strictEqual(pt.y, 480, 'y');
    assert.strictEqual(pt.height, 20, 'height');
    assert.strictEqual(pt.x, 225, 'x');
    assert.strictEqual(pt.minX, 290, 'minX');
    assert.strictEqual(pt.width, 65, 'width');
});

QUnit.test('Point is out of boundaries on the right', function(assert) {
    const pt = createPoint(this.series, { argument: 7, value: 5, minValue: 2 }, this.opt);

    pt.height = 50;
    pt.translate();

    assert.strictEqual(pt.inVisibleArea, false, 'inVisibleArea');
    assert.strictEqual(pt.y, 600, 'y');
    assert.strictEqual(pt.height, 50, 'height');
    assert.strictEqual(pt.x, 225, 'x');
    assert.strictEqual(pt.minX, 300, 'minX');
    assert.strictEqual(pt.width, 75, 'width');
});

QUnit.module('HasValue method. RangeBar', {
    beforeEach: function() {
        this.opt = {
            widgetType: 'chart',
            type: 'rangebar',
            label: {},
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
    const pt = createPoint(this.series, { argument: 12, value: 5, minValue: 4 }, this.opt);
    const result = pt.hasValue();

    assert.strictEqual(result, true);
});

QUnit.test('Negative. value', function(assert) {
    const pt = createPoint(this.series, { argument: 12, value: null, minValue: 4 }, this.opt);
    const result = pt.hasValue();

    assert.strictEqual(result, false);
});

QUnit.module('Draw label', environment);

// helper
function createLabels(x, y, minY) {
    const point = createPoint(this.series, this.data, this.options);

    point.x = x;
    point.y = y;
    point.minY = minY;

    point._drawLabel(this.renderer, this.group);
    return { tl: point._topLabel, bl: point._bottomLabel };
}

QUnit.test('Create label', function(assert) {
    const point = createPoint(this.series, this.data, this.options);

    assert.ok(this.labelFactory.calledTwice);

    assert.deepEqual(this.labelFactory.args[0][0], {
        renderer: point.series._renderer,
        labelsGroup: point.series._labelsGroup,
        point: point
    });

    assert.deepEqual(this.labelFactory.args[1][0], {
        renderer: point.series._renderer,
        labelsGroup: point.series._labelsGroup,
        point: point
    });
});

QUnit.test('Get label format object', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const formatObject = point._getLabelFormatObject();
    const minFormatObject = point._getLabelMinFormatObject();

    assert.equal(formatObject.value, 15);
    assert.equal(formatObject.argument, 25);
    assert.equal(formatObject.originalValue, 15);
    assert.equal(formatObject.originalArgument, 25);
    assert.equal(formatObject.seriesName, 'series');
    assert.deepEqual(formatObject.point, point);

    assert.equal(minFormatObject.value, 10);
    assert.equal(minFormatObject.argument, 25);
    assert.equal(minFormatObject.originalValue, 10);
    assert.equal(minFormatObject.originalArgument, 25);
    assert.equal(minFormatObject.seriesName, 'series');
    assert.deepEqual(minFormatObject.point, point);
});

QUnit.test('Check customize text object', function(assert) {
    this.series.seriesName = 'series';
    const pt = createPoint(this.series, this.data, this.options);

    assert.equal(pt._topLabel.setData.callCount, 1);
    assert.equal(pt._topLabel.setData.args[0][0].index, 1);
    assert.equal(pt._topLabel.setData.args[0][0].argument, 25);
    assert.equal(pt._topLabel.setData.args[0][0].value, 15);
    assert.equal(pt._topLabel.setData.args[0][0].originalArgument, 25);
    assert.equal(pt._topLabel.setData.args[0][0].originalValue, 15);
    assert.equal(pt._topLabel.setData.args[0][0].seriesName, 'series');
    assert.equal(pt._topLabel.setData.args[0][0].point, pt);

    assert.equal(pt._bottomLabel.setData.callCount, 1);
    assert.equal(pt._bottomLabel.setData.args[0][0].index, 0);
    assert.equal(pt._bottomLabel.setData.args[0][0].argument, 25);
    assert.equal(pt._bottomLabel.setData.args[0][0].value, 10);
    assert.equal(pt._bottomLabel.setData.args[0][0].originalArgument, 25);
    assert.equal(pt._bottomLabel.setData.args[0][0].originalValue, 10);
    assert.equal(pt._bottomLabel.setData.args[0][0].seriesName, 'series');
    assert.equal(pt._bottomLabel.setData.args[0][0].point, pt);
});

QUnit.test('Visible', function(assert) {
    const labels = createLabels.call(this, 33, 32, 22);

    assert.ok(labels.tl);
    assert.ok(labels.bl);
    assert.deepEqual(labels.tl.draw.lastCall.args, [true]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [true]);
});

QUnit.test('Null value and minValue', function(assert) {
    this.data.value = null;
    this.data.minValue = null;
    const labels = createLabels.call(this, 33, 32, 22);

    assert.ok(labels.tl);
    assert.ok(labels.bl);
    assert.deepEqual(labels.tl.draw.lastCall.args, [false]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [false]);
});

QUnit.test('Null value', function(assert) {
    this.data.value = null;
    const labels = createLabels.call(this, 33, 32, 22);

    assert.ok(labels.tl);
    assert.ok(labels.bl);
    assert.deepEqual(labels.tl.draw.lastCall.args, [false]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [false]);
});

QUnit.test('Null minValue', function(assert) {
    this.data.minValue = null;
    const labels = createLabels.call(this, 33, 32, 22);

    assert.ok(labels.tl);
    assert.ok(labels.bl);
    assert.deepEqual(labels.tl.draw.lastCall.args, [false]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [false]);
});

QUnit.test('Hide label on draw if it invisible', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    point.x = 33;
    point.y = 32;
    point.minY = 22;

    point._drawLabel(this.renderer, this.group);

    this.series.getLabelVisibility = function() {
        return false;
    };

    point.updateOptions(this.options);

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point._topLabel.draw.lastCall.args, [false]);
    assert.deepEqual(point._bottomLabel.draw.lastCall.args, [false]);
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
    assert.deepEqual(point.getLabels()[1].draw.lastCall.args, [true]);
});

QUnit.test('CustomizeLabel visibility is false, series labels are visible', function(assert) {
    this.options.styles.useLabelCustomOptions = true;
    this.options.label.visible = false;

    const point = createPoint(this.series, this.data, this.options);

    point._drawLabel(this.renderer, this.group);

    assert.deepEqual(point.getLabels()[0].draw.lastCall.args, [false]);
    assert.deepEqual(point.getLabels()[1].draw.lastCall.args, [false]);
});

QUnit.test('Value < minValue, not rotated', function(assert) {
    const labels = createLabels.call(this, 33, 54, 35);

    assert.deepEqual(labels.tl.draw.lastCall.args, [true]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [true]);
    assert.equal(labels.tl.pointPosition, 'bottom');
    assert.equal(labels.bl.pointPosition, 'top');
});

QUnit.test('Value > minValue, not rotated', function(assert) {
    const labels = createLabels.call(this, 33, 35, 54);

    assert.deepEqual(labels.tl.draw.lastCall.args, [true]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [true]);
    assert.equal(labels.tl.pointPosition, 'top');
    assert.equal(labels.bl.pointPosition, 'bottom');
});

QUnit.test('Value < minValue, rotated', function(assert) {
    this.options.rotated = true;
    const labels = createLabels.call(this, 33, 54, 35);

    assert.deepEqual(labels.tl.draw.lastCall.args, [true]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [true]);
    assert.equal(labels.tl.pointPosition, 'bottom');
    assert.equal(labels.bl.pointPosition, 'top');
});

QUnit.test('Value > minValue, rotated', function(assert) {
    this.options.rotated = true;
    const labels = createLabels.call(this, 33, 35, 54);

    assert.deepEqual(labels.tl.draw.lastCall.args, [true]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [true]);
    assert.equal(labels.tl.pointPosition, 'bottom');
    assert.equal(labels.bl.pointPosition, 'top');
});

QUnit.test('Value axis contains categories', function(assert) {
    this.series._options.valueAxisType = 'discrete';
    this.data.value = '25';
    this.data.minValue = '7';
    const labels = createLabels.call(this, 46, 90, 100);

    assert.deepEqual(labels.tl.draw.lastCall.args, [true]);
    assert.deepEqual(labels.bl.draw.lastCall.args, [true]);
    assert.equal(labels.tl.pointPosition, 'top');
    assert.equal(labels.bl.pointPosition, 'bottom');
});

QUnit.module('Draw Label. Range area', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.renderer.bBoxTemplate = { x: 0, y: 40, height: 10, width: 20 };
        this.translators.arg = new MockTranslator({
            translate: { 1: 350, 2: 325, 3: 290, 4: 250, 5: 225, 6: 150, 'canvas_position_default': 300 },
            failOnWrongData: true
        });
        this.options.visible = true;
        this.options.styles = { normal: { r: 0 }, hover: {} };
        this.options.label.position = 'outside';
    },
    afterEach: environment.afterEach
});

// helpers
const createCorrectionLabels = function(pos1, pos2, x, y, minY, minX) {
    const point = createPoint(this.series, this.data, this.options);
    const topLabel = point._topLabel;
    const bottomLabel = point._bottomLabel;

    point.x = x;
    point.y = y;
    minY && (point.minY = minY);
    minX && (point.minX = minX);
    topLabel.pointPosition = pos1;
    bottomLabel.pointPosition = pos2;

    point.correctLabelPosition(topLabel);
    point.correctLabelPosition(bottomLabel);
    return { topLabel: topLabel, bottomLabel: bottomLabel };
};

QUnit.test('Get graphic bbox. Not rotated. Not image', function(assert) {
    this.options.styles.normal.r = 5;
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point.x = 33;
    point.y = 54;
    point.minY = 100;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 28);
    assert.equal(topLabelGraphicBBox.y, 49);
    assert.equal(topLabelGraphicBBox.width, 10);
    assert.equal(topLabelGraphicBBox.height, 10);

    assert.equal(bottomLabelGraphicBBox.x, 28);
    assert.equal(bottomLabelGraphicBBox.y, 95);
    assert.equal(bottomLabelGraphicBBox.width, 10);
    assert.equal(bottomLabelGraphicBBox.height, 10);
});

QUnit.test('Get graphic bbox. Not rotated. Not image. Point is invisible', function(assert) {
    this.options.styles.normal.r = 5;
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point._options.visible = false;
    point.x = 33;
    point.y = 54;
    point.minY = 100;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 33);
    assert.equal(topLabelGraphicBBox.y, 54);
    assert.equal(topLabelGraphicBBox.width, 0);
    assert.equal(topLabelGraphicBBox.height, 0);

    assert.equal(bottomLabelGraphicBBox.x, 33);
    assert.equal(bottomLabelGraphicBBox.y, 100);
    assert.equal(bottomLabelGraphicBBox.width, 0);
    assert.equal(bottomLabelGraphicBBox.height, 0);
});

QUnit.test('Get graphic bbox. Rotated. Not image', function(assert) {
    this.options.styles.normal.r = 5;
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point.x = 33;
    point.y = 54;
    point.minX = 20;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 28);
    assert.equal(topLabelGraphicBBox.y, 49);
    assert.equal(topLabelGraphicBBox.width, 10);
    assert.equal(topLabelGraphicBBox.height, 10);

    assert.equal(bottomLabelGraphicBBox.x, 15);
    assert.equal(bottomLabelGraphicBBox.y, 49);
    assert.equal(bottomLabelGraphicBBox.width, 10);
    assert.equal(bottomLabelGraphicBBox.height, 10);
});

QUnit.test('Get graphic bbox. Rotated. Not image. Point is invisible', function(assert) {
    this.options.styles.normal.r = 5;
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point._options.visible = false;
    point.x = 33;
    point.y = 54;
    point.minX = 20;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 33);
    assert.equal(topLabelGraphicBBox.y, 54);
    assert.equal(topLabelGraphicBBox.width, 0);
    assert.equal(topLabelGraphicBBox.height, 0);

    assert.equal(bottomLabelGraphicBBox.x, 20);
    assert.equal(bottomLabelGraphicBBox.y, 54);
    assert.equal(bottomLabelGraphicBBox.width, 0);
    assert.equal(bottomLabelGraphicBBox.height, 0);
});

QUnit.test('Get graphic bbox. Not rotated. Image', function(assert) {
    this.options.styles.normal.r = 5;
    this.options.image = 'test';
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point.x = 33;
    point.y = 54;
    point.minY = 100;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 23);
    assert.equal(topLabelGraphicBBox.y, 44);
    assert.equal(topLabelGraphicBBox.width, 20);
    assert.equal(topLabelGraphicBBox.height, 20);

    assert.equal(bottomLabelGraphicBBox.x, 23);
    assert.equal(bottomLabelGraphicBBox.y, 90);
    assert.equal(bottomLabelGraphicBBox.width, 20);
    assert.equal(bottomLabelGraphicBBox.height, 20);
});

QUnit.test('Get graphic bbox. Rotated. Image', function(assert) {
    this.options.styles.normal.r = 5;
    this.options.image = 'test';
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point.x = 33;
    point.y = 54;
    point.minX = 20;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 23);
    assert.equal(topLabelGraphicBBox.y, 44);
    assert.equal(topLabelGraphicBBox.width, 20);
    assert.equal(topLabelGraphicBBox.height, 20);

    assert.equal(bottomLabelGraphicBBox.x, 10);
    assert.equal(bottomLabelGraphicBBox.y, 44);
    assert.equal(bottomLabelGraphicBBox.width, 20);
    assert.equal(bottomLabelGraphicBBox.height, 20);
});

QUnit.test('Get graphic bbox. Not rotated. Image. Point is invisible', function(assert) {
    this.options.styles.normal.r = 5;
    this.options.image = 'test';
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point._options.visible = false;
    point.x = 33;
    point.y = 54;
    point.minY = 100;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 33);
    assert.equal(topLabelGraphicBBox.y, 54);
    assert.equal(topLabelGraphicBBox.width, 0);
    assert.equal(topLabelGraphicBBox.height, 0);

    assert.equal(bottomLabelGraphicBBox.x, 33);
    assert.equal(bottomLabelGraphicBBox.y, 100);
    assert.equal(bottomLabelGraphicBBox.width, 0);
    assert.equal(bottomLabelGraphicBBox.height, 0);
});

QUnit.test('Get graphic bbox. Rotated. Image. Point is invisible', function(assert) {
    this.options.styles.normal.r = 5;
    this.options.image = 'test';
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    let bottomLabelGraphicBBox;
    let topLabelGraphicBBox;

    point._options.visible = false;
    point.x = 33;
    point.y = 54;
    point.minX = 20;

    topLabelGraphicBBox = point._getGraphicBBox('top');
    bottomLabelGraphicBBox = point._getGraphicBBox('bottom');

    assert.equal(topLabelGraphicBBox.x, 33);
    assert.equal(topLabelGraphicBBox.y, 54);
    assert.equal(topLabelGraphicBBox.width, 0);
    assert.equal(topLabelGraphicBBox.height, 0);

    assert.equal(bottomLabelGraphicBBox.x, 20);
    assert.equal(bottomLabelGraphicBBox.y, 54);
    assert.equal(bottomLabelGraphicBBox.width, 0);
    assert.equal(bottomLabelGraphicBBox.height, 0);
});

QUnit.test('Point with radius', function(assert) {
    this.options.styles.normal.r = 8;
    this.options.symbol = 'circle';
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 33, 54, 100);

    assert.ok(l.topLabel.setFigureToDrawConnector.calledOnce);
    assert.deepEqual(l.topLabel.setFigureToDrawConnector.firstCall.args[0], { x: 33, y: 54, r: 8 });
    assert.ok(l.topLabel.setFigureToDrawConnector.calledBefore(l.topLabel.shift));

    assert.ok(l.topLabel.shift.calledOnce);
    assert.equal(l.topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 54 - 10 - 10 - 8);

    assert.ok(l.bottomLabel.setFigureToDrawConnector.calledOnce);
    assert.deepEqual(l.bottomLabel.setFigureToDrawConnector.firstCall.args[0], { x: 33, y: 100, r: 8 });
    assert.ok(l.bottomLabel.setFigureToDrawConnector.calledBefore(l.bottomLabel.shift));

    assert.ok(l.bottomLabel.shift.calledOnce);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 100 + 8 + 10);
});

QUnit.test('Min point with image', function(assert) {
    this.options.image = { url: { rangeMinPoint: 'test' } };
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 33, 54, 100);

    assert.equal(l.topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 54 - 10 - 10);

    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 100 + 10 + 10);
});

QUnit.test('Max point with image', function(assert) {
    this.options.image = { url: { rangeMaxPoint: 'test' } };
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 33, 54, 100);

    assert.equal(l.topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 54 - 10 - 20);

    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 100 + 10);
});

QUnit.test('Default, not rotated', function(assert) {
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 33, 54, 100);

    assert.equal(l.topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 54 - 10 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 100 + 10);
});

QUnit.test('Default, rotated', function(assert) {
    this.options.rotated = true;
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 53, 12, null, 35);

    assert.equal(l.topLabel.shift.firstCall.args[0], 53 + 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 7);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 35 - 20 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 7);
});

QUnit.test('Value < minValue', function(assert) {
    const l = createCorrectionLabels.call(this, 'bottom', 'top', 33, 54, 35);

    assert.equal(l.topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 64);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 15);
});

QUnit.test('Default, inside, not rotated', function(assert) {
    this.options.label.position = 'inside';
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 33, 54, 100);

    assert.equal(l.topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 54 + 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 100 - 20);
});

QUnit.test('Default, inside, rotated', function(assert) {
    this.options.label.position = 'inside';
    this.options.rotated = true;
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 77, 12, null, 10);

    assert.equal(l.topLabel.shift.firstCall.args[0], 77 - 10 - 20);
    assert.equal(l.topLabel.shift.firstCall.args[1], 12 - 5);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 10 + 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 12 - 5);
});

QUnit.test('Value < minValue, inside, rotated', function(assert) {
    this.options.label.position = 'inside';
    this.options.rotated = true;
    const l = createCorrectionLabels.call(this, 'bottom', 'top', 53, 12, null, 130);

    assert.equal(l.topLabel.shift.firstCall.args[0], 53 + 10);
    assert.equal(l.topLabel.shift.firstCall.args[1], 12 - 5);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 130 - 10 - 20);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 12 - 5);
});

QUnit.test('Default, inside, not rotated. Overlay corrections', function(assert) {
    this.options.label.position = 'inside';
    const point = createPoint(this.series, this.data, this.options);
    const topLabel = point._topLabel;
    const bottomLabel = point._bottomLabel;

    topLabel.getBoundingRect.returns({ width: 20, height: 10, x: 23, y: 64 });
    bottomLabel.getBoundingRect.returns({ width: 20, height: 10, x: 23, y: 34 });

    point.x = 33;
    point.y = 54;
    point.minY = 55;

    point._drawLabel(this.renderer, this.group);

    assert.ok(topLabel.shift.calledOnce);
    assert.ok(bottomLabel.shift.calledOnce);

    assert.equal(topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(topLabel.shift.firstCall.args[1], 44);
    assert.equal(bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(bottomLabel.shift.firstCall.args[1], 54);
});

QUnit.test('Default, inside, rotated. Overlay corrections', function(assert) {
    this.options.label.position = 'inside';
    this.options.rotated = true;
    const point = createPoint(this.series, this.data, this.options);
    const topLabel = point._topLabel;
    const bottomLabel = point._bottomLabel;

    point.x = 77;
    point.y = 12;
    point.minX = 65;

    topLabel.getBoundingRect.returns({ width: 20, height: 10, x: 47, y: 7 });
    bottomLabel.getBoundingRect.returns({ width: 20, height: 10, x: 75, y: 7 });

    point._drawLabel(this.renderer, this.group);

    assert.ok(topLabel.shift.calledOnce);
    assert.ok(bottomLabel.shift.calledOnce);

    assert.equal(topLabel.shift.firstCall.args[0], 71);
    assert.equal(topLabel.shift.firstCall.args[1], 12 - 5);
    assert.equal(bottomLabel.shift.firstCall.args[0], 51);
    assert.equal(bottomLabel.shift.firstCall.args[1], 12 - 5);
});

QUnit.test('Value < minValue, inside. Overlay corrections', function(assert) {
    this.options.label.position = 'inside';
    this.data.value = 1;
    this.data.minValue = 15;
    const point = createPoint(this.series, this.data, this.options);
    const topLabel = point._topLabel;
    const bottomLabel = point._bottomLabel;

    topLabel.getBoundingRect.returns({ width: 20, height: 10, x: 23, y: 34 });
    bottomLabel.getBoundingRect.returns({ width: 20, height: 10, x: 23, y: 64 });

    point.x = 33;
    point.y = 55;
    point.minY = 54;

    point._drawLabel(this.renderer, this.group);

    assert.ok(topLabel.shift.calledOnce);
    assert.ok(bottomLabel.shift.calledOnce);

    assert.equal(bottomLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(bottomLabel.shift.firstCall.args[1], 44);
    assert.equal(topLabel.shift.firstCall.args[0], 33 - 10);
    assert.equal(topLabel.shift.firstCall.args[1], 54);

});

QUnit.test('Value < minValue, inside, rotated. Overlay corrections', function(assert) {
    this.options.label.position = 'inside';
    this.options.rotated = true;
    this.data.value = 1;
    this.data.minValue = 15;
    const point = createPoint(this.series, this.data, this.options);
    const topLabel = point._topLabel;
    const bottomLabel = point._bottomLabel;

    topLabel.getBoundingRect.returns({ width: 20, height: 10, x: 63, y: 7 });
    bottomLabel.getBoundingRect.returns({ width: 20, height: 10, x: 25, y: 7 });

    point.x = 53;
    point.y = 12;
    point.minX = 55;

    point._drawLabel(this.renderer, this.group);

    assert.ok(topLabel.shift.calledOnce);
    assert.ok(bottomLabel.shift.calledOnce);

    assert.equal(topLabel.shift.firstCall.args[0], 34);
    assert.equal(topLabel.shift.firstCall.args[1], 12 - 5);
    assert.equal(bottomLabel.shift.firstCall.args[0], 54);
    assert.equal(bottomLabel.shift.firstCall.args[1], 12 - 5);
});

QUnit.test('Default, not rotated. Left alignment', function(assert) {
    this.options.label.alignment = 'left';
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 33, 54, 100);

    assert.equal(l.topLabel.shift.firstCall.args[0], 33);
    assert.equal(l.topLabel.shift.firstCall.args[1], 54 - 10 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 100 + 10);
});

QUnit.test('Default, not rotated. Right alignment', function(assert) {
    this.options.label.alignment = 'right';
    const l = createCorrectionLabels.call(this, 'top', 'bottom', 33, 54, 100);

    assert.equal(l.topLabel.shift.firstCall.args[0], 33 - 20);
    assert.equal(l.topLabel.shift.firstCall.args[1], 54 - 10 - 10);
    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33 - 20);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 100 + 10);
});

QUnit.module('Draw Label. Range bar', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.renderer.bBoxTemplate = { x: 55, y: 40, height: 10, width: 20 };
        this.translators.arg = new MockTranslator({
            translate: { 1: 350, 2: 325, 3: 290, 4: 250, 5: 225, 6: 150, 'canvas_position_default': 300 },
            failOnWrongData: true
        });
        this.series._visibleArea = { minX: 0, maxX: 110, minY: 0, maxY: 210 };
        this.options.type = 'rangebar';
        this.options.styles = { normal: { r: 0 }, hover: {} };
        this.options.label.position = 'outside';
    },
    afterEach: environment.afterEach
});

// helpers
const createCorrectionBarLabels = function(bBox, x, y, width, height, pos1, pos2) {
    this.renderer.bBoxTemplate = bBox;
    const point = createPoint(this.series, this.data, this.options);

    point.x = x;
    point.y = y;
    point.width = width;
    point.height = height;

    point._topLabel.pointPosition = pos1;
    point._bottomLabel.pointPosition = pos2;
    point.correctLabelPosition(point._topLabel);
    point.correctLabelPosition(point._bottomLabel);

    return { topLabel: point._topLabel, bottomLabel: point._bottomLabel };
};

QUnit.test('Default, not rotated', function(assert) {
    const l = createCorrectionBarLabels.call(this, { x: 33, y: 54, height: 10, width: 20 }, 33, 54, 20, 10, 'top', 'bottom');

    assert.equal(l.topLabel.shift.firstCall.args[0], 33);
    assert.equal(l.topLabel.shift.firstCall.args[1], 34);

    assert.deepEqual(l.topLabel.setFigureToDrawConnector.firstCall.args[0], { x: 33, y: 54, width: 20, height: 0 });
    assert.ok(l.topLabel.setFigureToDrawConnector.calledBefore(l.topLabel.shift));

    assert.equal(l.bottomLabel.shift.firstCall.args[0], 33);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 74);

    assert.deepEqual(l.bottomLabel.setFigureToDrawConnector.firstCall.args[0], { x: 33, y: 64, width: 20, height: 0 });
    assert.ok(l.bottomLabel.setFigureToDrawConnector.calledBefore(l.bottomLabel.shift));
});

QUnit.test('Default, rotated', function(assert) {
    this.options.rotated = true;
    const l = createCorrectionBarLabels.call(this, { x: 53, y: 12, height: 10, width: 20 }, 53, 12, 20, 10, 'top', 'bottom');

    assert.equal(l.topLabel.shift.firstCall.args[0], 83);
    assert.equal(l.topLabel.shift.firstCall.args[1], 12);

    assert.deepEqual(l.topLabel.setFigureToDrawConnector.firstCall.args[0], { x: 73, y: 12, width: 0, height: 10 });
    assert.ok(l.topLabel.setFigureToDrawConnector.calledBefore(l.topLabel.shift));

    assert.equal(l.bottomLabel.shift.firstCall.args[0], 23);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 12);

    assert.deepEqual(l.bottomLabel.setFigureToDrawConnector.firstCall.args[0], { x: 53, y: 12, width: 0, height: 10 });
    assert.ok(l.bottomLabel.setFigureToDrawConnector.calledBefore(l.bottomLabel.shift));
});

QUnit.test('Default, not rotated. Null value', function(assert) {
    this.data.minValue = null;
    const l = createCorrectionBarLabels.call(this, { x: 33, y: 54, height: 10, width: 20 }, 33, 54, 20, 10, 'bottom', 'top');

    assert.deepEqual(l.topLabel.draw.lastCall.args, [false]);
    assert.deepEqual(l.bottomLabel.draw.lastCall.args, [false]);
});

QUnit.test('Default, inside, not rotated', function(assert) {
    this.options.label.position = 'inside';
    const l = createCorrectionBarLabels.call(this, { x: 0, y: 40, height: 10, width: 20 }, 55, 40, 20, 10, 'bottom', 'top');

    assert.equal(l.topLabel.shift.firstCall.args[0], 55);
    assert.equal(l.topLabel.shift.firstCall.args[1], 30);

    assert.equal(l.bottomLabel.shift.firstCall.args[0], 55);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 50);
});

QUnit.test('Default, inside, rotated', function(assert) {
    this.options.label.position = 'inside';
    this.options.rotated = true;
    const l = createCorrectionBarLabels.call(this, { x: 53, y: 12, height: 10, width: 20 }, 53, 12, 20, 10, 'bottom', 'top');

    assert.equal(l.topLabel.shift.firstCall.args[0], 63);
    assert.equal(l.topLabel.shift.firstCall.args[1], 12);

    assert.equal(l.bottomLabel.shift.firstCall.args[0], 43);
    assert.equal(l.bottomLabel.shift.firstCall.args[1], 12);
});

QUnit.module('Update label', {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.options.label.background.fill = 'red';
    },
    afterEach: environment.afterEach
});

QUnit.test('Update label options', function(assert) {
    const point = createPoint(this.series, this.data, this.options);
    const newOptions = $.extend(true, {}, this.options);
    newOptions.label.background.fill = 'green';
    point.x = 30;
    point.y = 150;
    point.minY = 160;

    point.updateOptions(newOptions);

    assert.ok(point._topLabel.setOptions.calledTwice);
    assert.equal(point._topLabel.setOptions.firstCall.args[0].background.fill, 'red');
    assert.equal(point._topLabel.setOptions.secondCall.args[0].background.fill, 'green');
    assert.ok(point._bottomLabel.setOptions.calledTwice);
    assert.equal(point._bottomLabel.setOptions.firstCall.args[0].background.fill, 'red');
    assert.equal(point._bottomLabel.setOptions.secondCall.args[0].background.fill, 'green');
});
