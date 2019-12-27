import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import Color from 'color';
import pointModule from 'viz/series/points/base_point';
import SeriesModule from 'viz/series/base_series';
const Series = SeriesModule.Series;
import { MockAxis, MockTranslator } from '../../helpers/chartMocks.js';

const createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    const renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
        widgetType: 'chart',
        containerBackgroundColor: 'containerColor',
        visible: true,
        label: {
            visible: true,
            border: {},
            connector: {},
            font: {}
        },
        border: {
            visible: true
        },
        point: {
            hoverStyle: {},
            selectionStyle: {}
        },
        valueErrorBar: {
            displayMode: 'none'
        },
        hoverStyle: { hatching: 'h-hatching' },
        selectionStyle: { hatching: 's-hatching' },
        hoverMode: 'excludePoints',
        selectionMode: 'excludePoints'
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
    }, renderSettings);

    renderer.stub('g').reset();
    return new Series(renderSettings, options);
};

const createPoint = function() {
    const stub = sinon.createStubInstance(pointModule.Point);
    stub.argument = 1;
    stub.hasValue.returns(true);
    stub.hasCoords.returns(true);
    stub.isInVisibleArea.returns(true);

    stub._options = {};// see T243839
    return stub;
};

const mockPoints = [createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint()];

const environment = {
    beforeEach: function() {
        let mockPointIndex = 0;
        this.renderer = new vizMocks.Renderer();
        this.seriesGroup = this.renderer.g();
        this.data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }];
        this.createPoint = sinon.stub(pointModule, 'Point', function() {
            const stub = mockPoints[mockPointIndex++];
            stub.argument = 1;
            stub.getMarkerCoords.returns({ x: 1, y: 2, width: 20, height: 10 });
            stub.hasValue.returns(true);
            stub.hasCoords.returns(true);
            stub.isInVisibleArea.returns(true);
            stub.draw.reset();
            stub.animate.reset();
            return stub;
        });
    },
    afterEach: function() {
        this.createPoint.restore();
    },
    createAxisWithTranslator: function() {
        const valAxis = new MockAxis({ renderer: this.renderer });
        const argAxis = new MockAxis({ renderer: this.renderer });

        valAxis.getTranslator = sinon.spy(function() {
            return new MockTranslator({
                translate: { 1: 100, 2: 200, 3: 300, 4: 400, 'canvas_position_default': 'defaultY' }
            });
        });
        argAxis.getTranslator = sinon.spy(function() {
            return new MockTranslator({
                translate: { 'First': 10, 'Second': 20, 'Third': 30, 'Fourth': 40, 'canvas_position_default': 'defaultX' }
            });
        });

        return {
            argAxis: argAxis,
            valAxis: valAxis
        };
    }
};


const checkTwoGroups = function(assert, series) {
    const parentGroup = series._group;
    const renderer = series._renderer;
    const labelsGroup = series._extGroups.labelsGroup;
    assert.ok(parentGroup, 'series created without group');

    assert.equal(renderer.stub('g').callCount, 3);
    assert.equal(renderer.stub('g').getCall(0).returnValue.stub('attr').firstCall.args[0]['class'], 'dxc-series');
    assert.equal(renderer.stub('g').getCall(1).returnValue.stub('attr').firstCall.args[0]['class'], 'dxc-markers');
    assert.equal(renderer.stub('g').getCall(2).returnValue.stub('attr').firstCall.args[0]['class'], 'dxc-labels');

    assert.equal(series._markersGroup.stub('append').lastCall.args[0], parentGroup);
    assert.equal(series._labelsGroup.stub('append').lastCall.args[0], labelsGroup);
};

QUnit.module('Bar series. Draw', {
    beforeEach: environment.beforeEach,
    afterEach: environment.afterEach,
    createSeries: function(options) {
        const axis = environment.createAxisWithTranslator.apply(this, arguments);

        return createSeries(options, {
            renderer: this.renderer,
            argumentAxis: axis.argAxis,
            valueAxis: axis.valAxis
        });
    }
});

const checkGroups = checkTwoGroups;
const seriesType = 'bar';

QUnit.test('stack name of staked bar', function(assert) {
    const series = this.createSeries({
        type: 'stackedbar',
        point: {
            visible: false
        }
    });

    assert.equal(series.getStackName(), 'axis_default_stack_default');
});

QUnit.test('stack name of staked bar with custom axis and stack', function(assert) {
    const series = this.createSeries({
        type: 'stackedbar',
        axis: 'axisName',
        stack: 'stackName',
        point: {
            visible: false
        }
    });

    assert.equal(series.getStackName(), 'axis_axisName_stack_stackName');
});

QUnit.test('stack name of fullstacked bar', function(assert) {
    const series = this.createSeries({
        type: 'fullstackedbar',
        point: {
            visible: false
        }
    });

    assert.equal(series.getStackName(), 'axis_default_stack_default');
});

QUnit.test('Creation with stack parameter', function(assert) {
    const series = this.createSeries({
        type: 'fullstackedbar',
        stack: 'super',
        point: {
            visible: false
        }
    });

    assert.equal(series.getStackName(), 'axis_default_stack_super');
});

QUnit.test('Draw without data', function(assert) {
    const series = this.createSeries({
        type: seriesType,
        point: { visible: false }
    });
    // act
    series.draw(false);
    // assert

    checkGroups(assert, series);
});

QUnit.test('Draw simple data without animation', function(assert) {
    const series = this.createSeries({
        type: seriesType,
        point: { visible: false }
    });
    series.updateData(this.data);
    series.createPoints();
    $.each(series._points, function(i, pt) {
        pt.x = pt.argument;
        pt.y = pt.value;
    });
    // act
    series.draw(false);
    // assert
    checkGroups(assert, series);

    assert.deepEqual(series._markersGroup._stored_settings.scaleX, 1);
    assert.deepEqual(series._markersGroup._stored_settings.scaleY, 1);
    assert.equal(series._markersGroup._stored_settings.translateX, 0);
    assert.equal(series._markersGroup._stored_settings.translateY, 0);

    $.each(series._points, function(i, p) {
        assert.equal(p.animate.callCount, 0, i + ' point draw without animate');
    });

});

QUnit.test('Draw simple data with animation. first draw', function(assert) {
    const series = this.createSeries({
        type: seriesType,
        point: { visible: false }
    });
    let complete;
    series.updateData(this.data);
    series.createPoints();
    $.each(series._points, function(i, pt) {
        pt.x = pt.argument;
        pt.y = pt.value;
    });
    // act

    series.draw(true);
    // assert
    checkGroups(assert, series);

    assert.equal(series._labelsGroup._stored_settings.opacity, 0.001);
    $.each(series._points, function(i, p) {
        assert.equal(p.animate.callCount, 0, i + ' point draw with animate');
    });

    assert.deepEqual(series._markersGroup._stored_settings.scaleX, 1);
    assert.deepEqual(series._markersGroup._stored_settings.scaleY, 0.001);
    assert.deepEqual(series._markersGroup._stored_settings.translateY, 'defaultY');

    assert.deepEqual(series._markersGroup.stub('animate').lastCall.args[0], {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
    });

    complete = series._markersGroup.stub('animate').lastCall.args[2];
    assert.ok(complete);
    complete();
    assert.deepEqual(series._labelsGroup.stub('animate').lastCall.args[1], { duration: 400 });

    assert.equal(series._labelsGroup.stub('animate').lastCall.args[0].opacity, 1);
    assert.deepEqual(series._labelsGroup.stub('animate').lastCall.args[1], { duration: 400 });

});

QUnit.test('Draw simple data with animation. draw after draw without data', function(assert) {
    const series = this.createSeries({
        type: seriesType,
        point: { visible: false }
    });
    let complete;
    series.draw(true);
    series.updateData(this.data);
    series.createPoints();
    $.each(series._points, function(i, pt) {
        pt.x = pt.argument;
        pt.y = pt.value;
    });
    // act
    series.draw(true);
    // assert
    checkGroups(assert, series);

    assert.equal(series._labelsGroup._stored_settings.opacity, 0.001);
    $.each(series._points, function(i, p) {
        assert.equal(p.animate.callCount, 0, i + ' point draw with animate');
    });

    assert.deepEqual(series._markersGroup._stored_settings.scaleX, 1);
    assert.deepEqual(series._markersGroup._stored_settings.scaleY, 0.001);
    assert.deepEqual(series._markersGroup._stored_settings.translateY, 'defaultY');

    assert.deepEqual(series._markersGroup.stub('animate').lastCall.args[0], {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
    });

    complete = series._markersGroup.stub('animate').lastCall.args[2];
    assert.ok(complete);
    complete();
    assert.deepEqual(series._labelsGroup.stub('animate').lastCall.args[1], { duration: 400 });

    assert.equal(series._labelsGroup.stub('animate').lastCall.args[0].opacity, 1);
    assert.deepEqual(series._labelsGroup.stub('animate').lastCall.args[1], { duration: 400 });

});

QUnit.test('Draw simple data with animation. first draw. Rotated', function(assert) {
    const series = this.createSeries({
        type: seriesType,
        rotated: true,
        point: { visible: false }
    });
    let complete;
    series.updateData(this.data);
    series.createPoints();
    $.each(series._points, function(i, pt) {
        pt.x = pt.argument;
        pt.y = pt.value;
    });
    // act

    series.draw(true);
    // assert
    checkGroups(assert, series);

    assert.equal(series._labelsGroup._stored_settings.opacity, 0.001);
    $.each(series._points, function(i, p) {
        assert.equal(p.animate.callCount, 0, i + ' point draw with animate');
    });

    assert.deepEqual(series._markersGroup._stored_settings.scaleX, 0.001);
    assert.deepEqual(series._markersGroup._stored_settings.scaleY, 1);
    assert.deepEqual(series._markersGroup._stored_settings.translateX, 'defaultY');

    assert.deepEqual(series._markersGroup.stub('animate').lastCall.args[0], {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
    });

    complete = series._markersGroup.stub('animate').lastCall.args[2];
    assert.ok(complete);
    complete();
    assert.deepEqual(series._labelsGroup.stub('animate').lastCall.args[1], { duration: 400 });

    assert.equal(series._labelsGroup.stub('animate').lastCall.args[0].opacity, 1);
    assert.deepEqual(series._labelsGroup.stub('animate').lastCall.args[1], { duration: 400 });

});

QUnit.test('Draw simple data with animation. second draw', function(assert) {
    const series = this.createSeries({
        type: seriesType,
        point: { visible: false }
    });
    let complete;
    series.updateData(this.data);
    series.createPoints();
    $.each(series._points, function(i, pt) {
        pt.x = pt.argument;
        pt.y = pt.value;
    });
    // act

    series.draw(true);
    series.draw(true);
    // assert
    checkGroups(assert, series);

    assert.equal(series._labelsGroup._stored_settings.opacity, 0.001);
    $.each(series._points, function(i, p) {
        assert.equal(p.animate.callCount, 1, i + ' point draw with animate');
        assert.equal(p.animate.firstCall.args.length, 2, 'call with params');
        if(i !== series._points.length - 1) {
            assert.equal(p.animate.firstCall.args[0], undefined);
        } else {
            complete = p.animate.firstCall.args[0];
            assert.ok(complete, 'complete function');
        }
        assert.deepEqual(p.animate.firstCall.args[1], { height: 10, width: 20, x: 1, y: 2 });
    });
    complete();
    assert.equal(series._labelsGroup.stub('animate').lastCall.args[0].opacity, 1);
    assert.deepEqual(series._labelsGroup.stub('animate').lastCall.args[1], { duration: 400 });

    assert.deepEqual(series._markersGroup.stub('animate').lastCall.args[0], {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0
    });
});

QUnit.module('Bar. Points animation', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        const axis = environment.createAxisWithTranslator.apply(this, arguments);

        this.series = createSeries({
            type: seriesType,
            point: { visible: true }
        }, {
            renderer: this.renderer,
            argumentAxis: axis.argAxis,
            valueAxis: axis.valAxis
        });
        this.series.updateData(this.data);
        this.series.createPoints();
    },
    afterEach: environment.afterEach
});

QUnit.test('Draw without animation', function(assert) {
    const series = this.series;
    // act
    series.draw(false);
    // assert
    $.each(series._points, function(i, p) {
        assert.ok(p.draw.calledOnce);
        assert.equal(p.draw.firstCall.args[0], series._renderer, 'renderer pass to point ' + i);
        assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, 'markers group pass to point ' + i);
        assert.equal(p.draw.firstCall.args[2], false, 'animation should be disabled ' + i);
    });
});

QUnit.test('Draw with animation', function(assert) {
    const series = this.series;
    // act
    series.draw(true);
    series.draw(true);
    // assert
    $.each(series._points, function(i, p) {
        assert.ok(p.draw.calledTwice);
        assert.equal(p.draw.firstCall.args[0], series._renderer, 'renderer pass to point ' + i);
        assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, 'markers group pass to point ' + i);
        assert.equal(p.draw.firstCall.args[2], false, 'animation should be disabled ' + i);

        assert.equal(p.draw.secondCall.args[0], series._renderer, 'renderer pass to point ' + i);
        assert.equal(p.draw.secondCall.args[1].markers, series._markersGroup, 'markers group pass to point ' + i);
        assert.equal(p.draw.secondCall.args[2], true, 'animation should be enabled ' + i);
    });
});

QUnit.test('Draw aggregated points with animation', function(assert) {
    const axis = environment.createAxisWithTranslator.apply(this, arguments);
    const series = createSeries({
        type: seriesType
    }, {
        argumentAxis: axis.argAxis,
        valueAxis: axis.valAxis
    });
    const aggregatedPoints = [this.createPoint(), this.createPoint()];

    series.updateData(this.data);
    series.createPoints();
    series.resamplePoints = function() {
        this._points = aggregatedPoints;
        this._lastPointIndex = aggregatedPoints.length - 1;
    };
    // act
    series.resamplePoints();
    series.draw(true);
    series.draw(true);
    // assert
    assert.ok(series._points.length);
    $.each(series._originalPoints, function(i, p) {
        assert.ok(!p.draw.calledOnce);
        assert.ok(!p.animate.callCount);
    });

    assert.ok(series._drawnPoints.length, 'drawn points');
    $.each(series._drawnPoints, function(i, p) {
        assert.ok(p.draw.calledTwice);
        assert.ok(p.animate.calledOnce);
        assert.equal(p.draw.firstCall.args[0], series._renderer, 'renderer pass to point ' + i);
        assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, 'markers group pass to point ' + i);
        assert.equal(p.draw.firstCall.args[2], false, 'animation should be enabled ' + i);

        assert.equal(p.draw.secondCall.args[0], series._renderer, 'renderer pass to point ' + i);
        assert.equal(p.draw.secondCall.args[1].markers, series._markersGroup, 'markers group pass to point ' + i);
        assert.equal(p.draw.secondCall.args[2], true, 'animation should be enabled ' + i);
    });
});

QUnit.module('Bar. Point styles', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.data = [{ arg: 'arg1', val: 'val1', tag: 'tag1' }, { arg: 'arg2', val: 'val2', tag: 'tag2' }];
        this.options = {
            type: seriesType,
            color: 'n-color',
            size: 'n-size',
            border: {
                visible: true,
                color: 'n-b-color',
                width: 'n-b-width',
                dashStyle: 'n-b-dashStyle'
            },
            hoverStyle: {
                color: 'h-color',
                size: 'h-size',
                border: {
                    visible: true,
                    color: 'h-b-color',
                    width: 'h-b-width',
                    dashStyle: 'h-b-dashStyle'
                }
            },
            selectionStyle: {
                color: 's-color',
                size: 's-size',
                border: {
                    visible: true,
                    color: 's-b-color',
                    width: 's-b-width',
                    dashStyle: 's-b-dashStyle'
                }
            }
        };
    },
    afterEach: environment.afterEach
});

QUnit.test('Style in point', function(assert) {
    const series = createSeries(this.options);
    series.updateData(this.data);
    series.createPoints();

    assert.deepEqual(this.createPoint.firstCall.args[2].styles, {
        hover: {
            fill: 'h-color',
            stroke: 'h-b-color',
            'stroke-width': 'h-b-width',
            dashStyle: 'h-b-dashStyle',
            hatching: 'h-hatching'
        },
        normal: {
            r: undefined,
            'stroke-width': 'n-b-width',
            opacity: undefined
        },
        selection: {
            fill: 's-color',
            stroke: 's-b-color',
            'stroke-width': 's-b-width',
            dashStyle: 's-b-dashStyle',
            hatching: 's-hatching'
        }
    });
});

QUnit.test('Style in point group', function(assert) {
    const series = createSeries(this.options, {
        argumentAxis: new MockAxis({ renderer: this.renderer }),
        valueAxis: new MockAxis({ renderer: this.renderer })
    });
    series.updateData(this.data);
    series.createPoints();
    series.draw(false);

    assert.deepEqual(series._markersGroup._stored_settings, {
        'class': 'dxc-markers',
        fill: 'n-color',
        'clip-path': null,
        scaleX: 1,
        opacity: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
        stroke: 'n-b-color',
        'dashStyle': 'n-b-dashStyle',
        'stroke-width': 'n-b-width',
        'hatching': undefined
    });
});

QUnit.test('All options defined', function(assert) {
    const series = createSeries(this.options);
    series.updateData(this.data);
    series.createPoints();

    assert.deepEqual((series._getPointOptions().styles), {
        hover: {
            fill: 'h-color',
            stroke: 'h-b-color',
            'stroke-width': 'h-b-width',
            dashStyle: 'h-b-dashStyle',
            hatching: 'h-hatching'
        },
        normal: {
            fill: 'n-color',
            stroke: 'n-b-color',
            'stroke-width': 'n-b-width',
            dashStyle: 'n-b-dashStyle',
            hatching: undefined
        },
        selection: {
            fill: 's-color',
            stroke: 's-b-color',
            'stroke-width': 's-b-width',
            dashStyle: 's-b-dashStyle',
            hatching: 's-hatching'
        }
    });
});

QUnit.test('without borders', function(assert) {
    const series = createSeries($.extend({}, this.options, { border: { visible: false }, hoverStyle: { border: { visible: false } }, selectionStyle: { border: { visible: false } } }));
    let styles;

    series.updateData(this.data);
    series.createPoints();

    styles = series._getPointOptions().styles;

    assert.strictEqual(styles.hover['stroke-width'], 0);
    assert.strictEqual(styles.normal['stroke-width'], 0);
    assert.strictEqual(styles.selection['stroke-width'], 0);
});

QUnit.test('Define only color', function(assert) {
    const series = createSeries({
        type: seriesType,
        color: 'n-color',
        border: {
            visible: true,
        },
        hoverStyle: {
            border: {
                visible: true,
            }
        },
        selectionStyle: {
            border: {
                visible: true,
            }
        }
    });
    let styles;

    series.updateData(this.data);
    series.createPoints();
    styles = series._getPointOptions().styles;

    assert.strictEqual(styles.hover.fill, 'n-color', 'hover fill color');
    assert.strictEqual(styles.hover.stroke, 'n-color', 'hover stroke color');

    assert.strictEqual(styles.normal.fill, 'n-color', 'normal fill color');
    assert.strictEqual(styles.normal.stroke, 'n-color', 'normal stroke color');

    assert.strictEqual(styles.selection.fill, 'n-color', 'selection fill color');
    assert.strictEqual(styles.selection.stroke, 'n-color', 'selection stroke color');
});

QUnit.test('Define only series color', function(assert) {
    const series = createSeries({
        type: seriesType,
        mainSeriesColor: 'seriesColor',
        border: {
            visible: true,
        },
        hoverStyle: {
            border: {
                visible: true,
            }
        },
        selectionStyle: {
            border: {
                visible: true,
            }
        }
    });
    let styles;
    series.updateData(this.data);
    series.createPoints();

    styles = series._getPointOptions().styles;

    assert.strictEqual(styles.hover.fill, 'seriesColor', 'hover fill color');
    assert.strictEqual(styles.hover.stroke, 'seriesColor', 'hover stroke color');

    assert.strictEqual(styles.normal.fill, 'seriesColor', 'normal fill color');
    assert.strictEqual(styles.normal.stroke, 'seriesColor', 'normal stroke color');

    assert.strictEqual(styles.selection.fill, 'seriesColor', 'selection fill color');
    assert.strictEqual(styles.selection.stroke, 'seriesColor', 'selection stroke color');
});

QUnit.module('Bar. Customize point', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.data = [{ arg: 'arg1', val: 'val1', tag: 'tag1' }, { arg: 'arg2', val: 'val2', tag: 'tag2' }];
    },
    afterEach: environment.afterEach
});

QUnit.test('customizePoint object', function(assert) {
    const spy = sinon.spy();
    const series = createSeries({
        type: seriesType,
        customizePoint: spy,
        name: 'seriesName'
    });
    series.updateData(this.data);

    series.createPoints();

    assert.ok(series);
    assert.equal(spy.callCount, 2);

    const expectedArg = {
        argument: 'arg1',
        value: 'val1',
        seriesName: 'seriesName',
        tag: 'tag1',
        index: 0,
        series: series,
        data: this.data[0]
    };

    assert.deepEqual(spy.firstCall.args, [expectedArg]);
    assert.deepEqual(spy.firstCall.thisValue, expectedArg);
});

QUnit.test('customize point color. all', function(assert) {
    const series = createSeries({
        type: seriesType,
        customizePoint: function() {
            return {
                color: 'n-color',
                size: 'n-size',
                border: {
                    visible: true,
                    color: 'n-b-color',
                    width: 'n-b-width',
                    dashStyle: 'n-b-dashStyle'
                },
                hoverStyle: {
                    color: 'h-color',
                    size: 'h-size',
                    border: {
                        visible: true,
                        color: 'h-b-color',
                        width: 'h-b-width',
                        dashStyle: 'h-b-dashStyle'
                    }
                },
                selectionStyle: {
                    color: 's-color',
                    size: 's-size',
                    border: {
                        visible: true,
                        color: 's-b-color',
                        width: 's-b-width',
                        dashStyle: 's-b-dashStyle'
                    }
                }

            };
        }
    });
    series.updateData(this.data);
    series.createPoints();

    assert.deepEqual(series.getAllPoints()[0].updateOptions.lastCall.args[0].styles, {
        usePointCustomOptions: true,
        useLabelCustomOptions: undefined,
        hover: {
            fill: 'h-color',
            stroke: 'h-b-color',
            'stroke-width': 'h-b-width',
            dashStyle: 'h-b-dashStyle',
            hatching: 'h-hatching'
        },
        normal: {
            fill: 'n-color',
            stroke: 'n-b-color',
            'stroke-width': 'n-b-width',
            dashStyle: 'n-b-dashStyle',
            hatching: undefined
        },
        selection: {
            fill: 's-color',
            stroke: 's-b-color',
            'stroke-width': 's-b-width',
            dashStyle: 's-b-dashStyle',
            hatching: 's-hatching'
        }
    });
});

QUnit.test('customize with hatching', function(assert) {
    const series = createSeries({
        type: seriesType,
        size: 'n-size',
        border: {
            visible: true,
            width: 'n-b-width'
        },
        hoverStyle: {
            size: 'h-size',
            border: {
                visible: true,
                width: 'h-b-width'
            },
            hatching: { hoverHatchingField: true }
        },
        selectionStyle: {
            size: 's-size',
            border: {
                visible: true,
                width: 's-b-width'
            },
            hatching: { selectHatchingField: true }
        },
        customizePoint: function() {
            return { color: 'n-color' };
        }
    }, { renderer: this.renderer });

    series.updateData(this.data);

    series.createPoints();

    assert.deepEqual(series.getAllPoints()[0].updateOptions.lastCall.args[0].styles, {
        usePointCustomOptions: true,
        useLabelCustomOptions: undefined,
        hover: {
            fill: 'n-color',
            stroke: 'n-color',
            'stroke-width': 'h-b-width',
            dashStyle: 'solid',
            hatching: { hoverHatchingField: true }
        },
        normal: {
            fill: 'n-color',
            stroke: 'n-color',
            'stroke-width': 'n-b-width',
            dashStyle: 'solid',
            hatching: undefined
        },
        selection: {
            fill: 'n-color',
            stroke: 'n-color',
            'stroke-width': 's-b-width',
            dashStyle: 'solid',
            hatching: { selectHatchingField: true }
        }
    });

    assert.deepEqual(series.getAllPoints()[1].updateOptions.lastCall.args[0].styles, {
        usePointCustomOptions: true,
        useLabelCustomOptions: undefined,
        hover: {
            fill: 'n-color',
            stroke: 'n-color',
            'stroke-width': 'h-b-width',
            dashStyle: 'solid',
            hatching: { hoverHatchingField: true }
        },
        normal: {
            fill: 'n-color',
            stroke: 'n-color',
            'stroke-width': 'n-b-width',
            dashStyle: 'solid',
            hatching: undefined
        },
        selection: {
            fill: 'n-color',
            stroke: 'n-color',
            'stroke-width': 's-b-width',
            dashStyle: 'solid',
            hatching: { selectHatchingField: true }
        }
    });
});

QUnit.module('Bar Series. LegendStyles', environment);

QUnit.test('default LegendStyles', function(assert) {
    const series = createSeries({
        type: seriesType,
        mainSeriesColor: 'mainSeriesColor'
    });

    assert.deepEqual(series.getLegendStyles(), {
        'hover': {
            'fill': 'mainSeriesColor',
            'hatching': 'h-hatching'
        },
        'normal': {
            'fill': 'mainSeriesColor',
            hatching: undefined
        },
        'selection': {
            'fill': 'mainSeriesColor',
            'hatching': 's-hatching'
        }
    });
});

QUnit.test('styles colors defined', function(assert) {
    const series = createSeries({
        type: seriesType,
        color: 'n-color',
        hoverStyle: {
            color: 'h-color'
        },
        selectionStyle: {
            color: 's-color'
        }
    });

    assert.deepEqual(series.getLegendStyles(), {
        'hover': {
            'fill': 'h-color',
            'hatching': 'h-hatching'
        },
        'normal': {
            'fill': 'n-color',
            hatching: undefined
        },
        'selection': {
            'fill': 's-color',
            'hatching': 's-hatching'
        }
    });
});

QUnit.module('Series visibility', environment);

QUnit.test('Hide visible series', function(assert) {
    const series = createSeries({
        type: 'bar',
        visible: true,
        visibilityChanged: sinon.spy(),
        point: { visible: true }
    });
    series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }]);
    series.createPoints();
    series.hide();

    const points = series.getPoints();
    // see T243839
    $.each(points, function(_, point) {
        assert.ok(point._options.visible === false);
    });
});

QUnit.test('Show invisible series', function(assert) {
    const series = createSeries({
        type: 'bar',
        visible: false,
        visibilityChanged: sinon.spy(),
        point: { visible: false }
    });
    series.updateData([{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }]);
    series.createPoints();
    series.show();

    const points = series.getPoints();
    // see T243839
    $.each(points, function(_, point) {
        assert.ok(point._options.visible === true);
    });
});

QUnit.module('Polar bar series', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.highlight = sinon.stub(Color.prototype, 'highlight', function() { return this.baseColor + '-highlight'; });
        this.options = {
            type: 'bar',
            widgetType: 'polar'
        };
    },
    afterEach: function() {
        environment.afterEach.call(this);
        this.highlight.restore();
    },
    createSimpleSeries: function(options) {
        const series = createSeries($.extend(true, {}, this.options, options), {
            renderer: this.renderer,
            valueAxis: {
                getCanvas: function() {
                    return { left: 0, right: 0, width: 200, top: 0, bottom: 0, height: 300 };
                }
            }
        });
        series.updateData(this.data);
        series.createPoints();
        return series;
    },
    createDrawnSeries: function(animationEnabled) {
        const series = this.createSimpleSeries.apply(this, arguments);
        series.draw(animationEnabled);
        return series;
    }
});

QUnit.test('draw series with animation', function(assert) {
    const series = this.createDrawnSeries(true);
    let complete;

    $.each(series._points, function(i, p) {
        assert.equal(p.animate.callCount, 1, i + ' point draw with animate');
        assert.equal(p.animate.firstCall.args.length, 2, 'call with params');
        if(i !== series._points.length - 1) {
            assert.equal(p.animate.firstCall.args[0], undefined);
        } else {
            complete = p.animate.firstCall.args[0];
            assert.ok(complete, 'complete function');
        }
        assert.deepEqual(p.animate.firstCall.args[1], p.getMarkerCoords());
    });
});

QUnit.module('PolarBar. Point styles', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.data = [{ arg: 'arg1', val: 'val1', tag: 'tag1' }, { arg: 'arg2', val: 'val2', tag: 'tag2' }];
        this.options = {
            type: seriesType,
            color: 'n-color',
            size: 'n-size',
            opacity: 'n-opacity',
            widgetType: 'polar',
            border: {
                visible: true,
                color: 'n-b-color',
                width: 'n-b-width'
            },
            hoverStyle: {
                color: 'h-color',
                size: 'h-size',
                border: {
                    visible: true,
                    color: 'h-b-color',
                    width: 'h-b-width'
                }
            },
            selectionStyle: {
                color: 's-color',
                size: 's-size',
                border: {
                    visible: true,
                    color: 's-b-color',
                    width: 's-b-width'
                }
            }
        };
    },
    afterEach: environment.afterEach
});

QUnit.test('Style in point', function(assert) {
    const series = createSeries(this.options);
    series.updateData(this.data);
    series.createPoints();

    assert.deepEqual(this.createPoint.firstCall.args[2].styles, {
        hover: {
            fill: 'h-color',
            stroke: 'h-b-color',
            'stroke-width': 'h-b-width',
            dashStyle: 'solid',
            hatching: 'h-hatching'
        },
        normal: {
            opacity: 'n-opacity',
            r: undefined,
            'stroke-width': 'n-b-width'
        },
        selection: {
            fill: 's-color',
            stroke: 's-b-color',
            'stroke-width': 's-b-width',
            dashStyle: 'solid',
            hatching: 's-hatching'
        }
    });
});

QUnit.test('Style in point group', function(assert) {
    const series = createSeries(this.options, {
        valueAxis: {
            getCanvas: function() {
                return { left: 0, right: 0, width: 200, top: 0, bottom: 0, height: 300 };
            }
        }
    });
    series.updateData(this.data);
    series.createPoints();
    series.draw(false);

    assert.deepEqual(series._markersGroup._stored_settings, {
        'class': 'dxc-markers',
        'clip-path': null,
        dashStyle: 'solid',
        fill: 'n-color',
        stroke: 'n-b-color',
        'stroke-width': 'n-b-width',
    });
});

QUnit.test('All options defined', function(assert) {
    this.options.border.dashStyle = 'n-b-dashStyle';
    this.options.hoverStyle.opacity = 'h-opacity';
    this.options.hoverStyle.border.dashStyle = 'h-b-dashStyle';
    this.options.selectionStyle.opacity = 's-opacity';
    this.options.selectionStyle.border.dashStyle = 's-b-dashStyle';

    const series = createSeries(this.options);
    series.updateData(this.data);
    series.createPoints();

    assert.deepEqual((series._getPointOptions().styles), {
        hover: {
            fill: 'h-color',
            stroke: 'h-b-color',
            'stroke-width': 'h-b-width',
            dashStyle: 'h-b-dashStyle',
            opacity: 'h-opacity',
            hatching: 'h-hatching'
        },
        normal: {
            fill: 'n-color',
            opacity: 'n-opacity',
            stroke: 'n-b-color',
            'stroke-width': 'n-b-width',
            dashStyle: 'n-b-dashStyle',
            hatching: undefined
        },
        selection: {
            fill: 's-color',
            stroke: 's-b-color',
            opacity: 's-opacity',
            'stroke-width': 's-b-width',
            dashStyle: 's-b-dashStyle',
            hatching: 's-hatching'
        }
    });
});

QUnit.module('getMarginOptions', {
    beforeEach: environment.beforeEach,
    afterEach: environment.afterEach,
    createSeries: function(options) {
        const axis = environment.createAxisWithTranslator.apply(this, arguments);

        return createSeries(options, {
            renderer: this.renderer,
            argumentAxis: axis.argAxis,
            valueAxis: axis.valAxis
        });
    }
});

QUnit.test('bar series', function(assert) {
    const series = createSeries({
        type: 'bar'
    });

    assert.deepEqual(series.getMarginOptions(), {
        checkInterval: true,
        percentStick: false
    });
});
