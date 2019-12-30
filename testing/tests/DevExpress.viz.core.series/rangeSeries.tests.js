import $ from 'jquery';
import * as vizMocks from '../../helpers/vizMocks.js';
import pointModule from 'viz/series/points/base_point';
import SeriesModule from 'viz/series/base_series';
const Series = SeriesModule.Series;
import { MockAxis, insertMockFactory, restoreMockFactory } from '../../helpers/chartMocks.js';
import { noop } from 'core/utils/common';

const originalPoint = pointModule.Point;
let seriesType;

const createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    const renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
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
        valueErrorBar: {},
        hoverStyle: { hatching: 'h-hatching' },
        selectionStyle: { hatching: 's-hatching' },
        hoverMode: 'excludePoints',
        selectionMode: 'excludePoints',
        widgetType: 'chart'
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
        eventTrigger: noop,
        eventPipe: noop,
        incidentOccurred: noop
    }, renderSettings);

    renderer.stub('g').reset();
    return new Series(renderSettings, options);
};

const environment = {
    beforeEach: function() {
        insertMockFactory();
        this.renderer = new vizMocks.Renderer();
        this.seriesGroup = this.renderer.g();
        this.data = [{ arg: 1, val1: 10, val2: 10 }, { arg: 2, val1: 20, val2: 20 }, { arg: 3, val1: 30, val2: 30 }, { arg: 4, val1: 40 }];
        this.points = [[1, 10], [2, 20], [3, 30], [4, 40]];
        this.areaPoints = this.points.concat([[4, 0], [3, 0], [2, 0], [1, 0]]);
    },

    afterEach: restoreMockFactory
};

const createPoint = function() {
    const stub = sinon.createStubInstance(pointModule.Point);
    stub.argument = 1;
    stub.hasValue.returns(true);
    stub.isInVisibleArea.returns(true);
    stub.getCoords.returns({ x: 0, y: 0 });
    stub.getDefaultCoords.returns({ x: 0, y: 0 });
    return stub;
};
const mockPoints = [createPoint(), createPoint(), createPoint(), createPoint()];
const environmentWithSinonStubPoint = {
    beforeEach: function() {
        environment.beforeEach.call(this);
        let mockPointIndex = 0;
        this.createPoint = sinon.stub(pointModule, 'Point', function(params, data) {
            const stub = mockPoints[mockPointIndex++];
            stub.argument = 1;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            stub.hasCoords.returns(true);
            stub.draw.reset();
            stub.animate.reset();
            stub.getCoords
                .returns({ x: data.argument, y: data.value })
                .withArgs(true).returns({ x: data.argument, y: data.minValue });
            stub.x = data.argument;
            stub.y = data.value;
            stub.index = data.index;
            return stub;
        });
    },
    afterEach: environment.afterEach
};

(function RangeSeries() {
    QUnit.module('creation', environmentWithSinonStubPoint);

    QUnit.test('Creation range point', function(assert) {
        const series = createSeries({
            type: 'rangearea', rangeValue1Field: 'val1', rangeValue2Field: 'val2', label: {
                visible: false
            }
        });
        const data = [{ arg: 1, val1: 3, val2: 4 }];
        let points;
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.ok(points, 'Points should be created');
        assert.equal(points.length, 1, 'Series should have one point');
        assert.equal(this.createPoint.firstCall.args[0], series, 'Series should be correct');
        assert.equal(this.createPoint.firstCall.args[1].argument, 1, 'Argument should be correct');
        assert.equal(this.createPoint.firstCall.args[1].value, 4, 'Value should be correct');
        assert.equal(this.createPoint.firstCall.args[1].minValue, 3, 'Min value should be correct');
    });

    QUnit.test('IncidentOccurred. Data without range fields', function(assert) {
        const data = [{ arg: 1 }, { arg: 2 }];
        const incidentOccurred = sinon.spy();
        const options = { type: 'rangearea', argumentField: 'arg', rangeValue1Field: 'val1', rangeValue2Field: 'val2', label: { visible: false } };
        const series = createSeries(options, {
            incidentOccurred: incidentOccurred
        });

        series.updateData(data);
        series.createPoints();

        assert.strictEqual(incidentOccurred.callCount, 2);
        assert.strictEqual(incidentOccurred.lastCall.args[0], 'W2002');
    });

    QUnit.test('Null values, ignoreEmptyPoints false', function(assert) {
        const series = createSeries({
            type: 'rangearea', rangeValue1Field: 'val1', rangeValue2Field: 'val2', label: {
                visible: false
            }
        });
        const data = [{ arg: 1, val1: 3, val2: 4 }, { arg: 2, val1: null, val2: null }];
        let points;
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.ok(points, 'Points should be created');
        assert.equal(points.length, 2, 'Series should have one point');
        assert.equal(this.createPoint.getCall(0).args[1].argument, 1, 'Argument should be correct');
        assert.equal(this.createPoint.getCall(0).args[1].value, 4, 'Value should be correct');
        assert.equal(this.createPoint.getCall(0).args[1].minValue, 3, 'Min value should be correct');

        assert.equal(this.createPoint.getCall(1).args[1].argument, 2, 'Argument should be correct');
        assert.equal(this.createPoint.getCall(1).args[1].value, null, 'Value should be correct');
        assert.equal(this.createPoint.getCall(1).args[1].minValue, null, 'Min value should be correct');
    });

    QUnit.test('Null values, ignoreEmptyPoints true', function(assert) {
        const series = createSeries({
            type: 'rangearea', rangeValue1Field: 'val1', rangeValue2Field: 'val2',
            ignoreEmptyPoints: true,
            label: {
                visible: false
            }
        });
        const data = [{ arg: 1, val1: 3, val2: 4 }, { arg: 2, val1: null, val2: null }];
        let points;
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.ok(points, 'Points should be created');
        assert.equal(points.length, 1, 'Series should have one point');
        assert.equal(this.createPoint.getCall(0).args[1].argument, 1, 'Argument should be correct');
        assert.equal(this.createPoint.getCall(0).args[1].value, 4, 'Value should be correct');
        assert.equal(this.createPoint.getCall(0).args[1].minValue, 3, 'Min value should be correct');
    });

    QUnit.module('RangeSeries. API', {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.createPoint = sinon.stub(pointModule, 'Point', function() {
                const stub = sinon.createStubInstance(originalPoint);
                stub.argument = 1;
                stub.hasValue.returns(true);
                stub.isInVisibleArea.returns(true);
                return stub;
            });
        },
        afterEach() {
            this.createPoint.restore();
            environment.afterEach.call(this);
        }
    });

    seriesType = 'rangebar';

    QUnit.test('getValueFields default', function(assert) {
        const series = createSeries({
            type: seriesType
        });

        assert.deepEqual(series.getValueFields(), ['val1', 'val2']);
    });

    QUnit.test('getValueFields', function(assert) {
        const series = createSeries({
            type: seriesType,
            valueField: 'customValueField',
            rangeValue1Field: 'customValue1Field',
            rangeValue2Field: 'customValue2Field',
        });

        assert.deepEqual(series.getValueFields(), ['customValue1Field', 'customValue2Field']);
    });

    QUnit.test('getArgumentField default', function(assert) {
        const series = createSeries({
            type: seriesType
        });

        assert.deepEqual(series.getArgumentField(), 'arg');
    });

    QUnit.test('getArgumentField', function(assert) {
        const series = createSeries({
            type: seriesType,
            argumentField: 'customArgumentField'
        });

        assert.deepEqual(series.getArgumentField(), 'customArgumentField');
    });

    QUnit.test('areErrorBarsVisible', function(assert) {
        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'fixed',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'fixed, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'percent',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'percent, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'stdError',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'stdError, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'stdDeviation',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'stdDeviation, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'Variance',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'Variance, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'unknown',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'unknown, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'unknown',
                lowValueField: 'field',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'unknown, displayMode all, lowValueField defined');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'unknown',
                highValueField: 'field',
                displayMode: 'all'
            }
        }).areErrorBarsVisible(), 'unknown, displayMode all, highValueField defined');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'fixed',
                displayMode: 'none'
            }
        }).areErrorBarsVisible(), 'fixed, displayMode none');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'fixed',
                displayMode: 'all'
            }
        }).updateDataType({ valueAxisType: 'discrete' }).areErrorBarsVisible(), 'fixed, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'fixed',
                displayMode: 'all'
            }
        }).updateDataType({ valueAxisType: 'logarithmic' }).areErrorBarsVisible(), 'fixed, displayMode all');

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: 'fixed',
                displayMode: 'all'
            }
        }).updateDataType({ valueType: 'datetime' }).areErrorBarsVisible(), 'fixed, displayMode all');

    });

    QUnit.module('Null points', {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.options = {
                type: 'rangearea'
            };
            this.createPoint = sinon.stub(pointModule, 'Point', function() {
                const stub = sinon.createStubInstance(originalPoint);
                stub.argument = 1;
                stub.hasValue.returns(true);
                stub.isInVisibleArea.returns(true);
                return stub;
            });
        },
        afterEach: function() {
            environment.afterEach.call(this);
            this.createPoint.restore();
        }
    });

    QUnit.test('Argument is undefined', function(assert) {
        const data = [{ arg: undefined, val1: 1, val2: 1 }];
        const series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test('Argument is null', function(assert) {
        const data = [{ arg: null, val1: 1, val2: 1 }];
        const series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test('Value is undefined', function(assert) {
        const data = [{ arg: 1, val1: undefined, val2: 1 }];
        const series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test('Value is null', function(assert) {
        const data = [{ arg: 1, val1: null, val2: 1 }];
        const series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 1);
    });

    QUnit.test('minValue is undefined', function(assert) {
        const data = [{ arg: 1, val1: 1, val2: undefined }];
        const series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test('minValue is null', function(assert) {
        const data = [{ arg: 1, val1: 1, val2: null }];
        const series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 1);
    });

    QUnit.module('Draw elements. Range area series', {
        beforeEach: environment.beforeEach,
        afterEach: environment.afterEach,
        createSeries: function(options) {
            return createSeries(options, {
                renderer: this.renderer,
                argumentAxis: new MockAxis({ renderer: this.renderer }),
                valueAxis: new MockAxis({ renderer: this.renderer })
            });
        }
    });

    seriesType = 'rangearea';

    QUnit.test('Draw without data', function(assert) {
        const series = this.createSeries({
            type: seriesType,
            point: { visible: false }
        });
        // act
        series.draw(false);
        // assert
        assert.equal(this.renderer.stub('path').callCount, 0);
    });

    QUnit.test('Draw simple data without animation', function(assert) {
        const series = this.createSeries({
            type: seriesType,
            point: { visible: false },
            border: {
                visible: true
            }
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
            pt.visibleTopMarker = true;
            pt.visibleBottomMarker = true;
        });
        // act
        series.draw(false);
        // assert
        assert.equal(this.renderer.stub('path').callCount, 3);
        assert.equal(this.renderer.stub('path').getCall(0).args[1], 'line');
        assert.equal(this.renderer.stub('path').getCall(1).args[1], 'area');
        assert.equal(this.renderer.stub('path').getCall(2).args[1], 'line');
    });

    QUnit.test('Update simple data without animation', function(assert) {
        const series = this.createSeries({
            type: seriesType,
            border: {
                visible: true,
                width: 1
            },
            point: { visible: false }
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
            pt.visibleTopMarker = true;
            pt.visibleBottomMarker = true;
        });
        series.draw(false);
        // act
        series.updateData([{ arg: 1, val1: 2, val2: 4 }, { arg: 2, val1: 1, val2: 2 }]);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
            pt.visibleTopMarker = true;
            pt.visibleBottomMarker = true;
        });

        series.draw(false);
        // assert
        assert.equal(this.renderer.stub('path').callCount, 3);

        let element = this.renderer.stub('path').getCall(0).returnValue;
        let elementPoints = element._stored_settings.points;
        const bottomElement = this.renderer.stub('path').getCall(2).returnValue;
        const bottomElementPoints = bottomElement._stored_settings.points;

        assert.equal(element.stub('append').lastCall.args[0], series._bordersGroup);
        assert.equal(bottomElement.stub('append').lastCall.args[0], series._bordersGroup);

        assert.deepEqual(elementPoints.length, 2, 'path element points');
        assert.equal(elementPoints[0].x, 1);
        assert.equal(elementPoints[0].y, 4);
        assert.equal(elementPoints[1].x, 2);
        assert.equal(elementPoints[1].y, 2);

        assert.deepEqual(bottomElementPoints.length, 2, 'path element points');
        assert.equal(bottomElementPoints[0].x, 1);
        assert.equal(bottomElementPoints[0].y, 0);
        assert.equal(bottomElementPoints[1].x, 2);
        assert.equal(bottomElementPoints[1].y, 0);

        element = this.renderer.stub('path').getCall(1).returnValue;
        elementPoints = element._stored_settings.points;

        assert.equal(element.stub('append').lastCall.args[0], series._elementsGroup);

        assert.deepEqual(elementPoints.length, 4, 'area elements point');
        assert.equal(elementPoints[0].x, 1);
        assert.equal(elementPoints[0].y, 4);
        assert.equal(elementPoints[1].x, 2);
        assert.equal(elementPoints[1].y, 2);
        assert.equal(elementPoints[2].x, 2);
        assert.equal(elementPoints[2].y, 0);
        assert.equal(elementPoints[3].x, 1);
        assert.equal(elementPoints[3].y, 0);
    });

    QUnit.test('Draw simple data with animation', function(assert) {
        const renderer = this.renderer;
        const series = this.createSeries({
            type: seriesType,
            point: { visible: false },
            border: {
                visible: true,
                width: 1
            }
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series.getPoints(), function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
            pt.visibleTopMarker = true;
            pt.visibleBottomMarker = true;
            sinon.spy(pt, 'draw');
        });
        // act
        series.draw(true);
        // assert
        assert.equal(this.renderer.stub('path').callCount, 3);

        const element = this.renderer.stub('path').getCall(0).returnValue;
        const animatePoints = element.stub('animate').lastCall.args[0].points;
        const bottomElement = this.renderer.stub('path').getCall(2).returnValue;
        const bottomAnimatePoints = bottomElement.stub('animate').lastCall.args[0].points;

        assert.equal(animatePoints.length, 3);
        assert.equal(animatePoints[0].x, 1);
        assert.equal(animatePoints[0].y, 10);
        assert.equal(animatePoints[1].x, 2);
        assert.equal(animatePoints[1].y, 20);
        assert.equal(animatePoints[2].x, 3);
        assert.equal(animatePoints[2].y, 30);

        assert.equal(bottomAnimatePoints.length, 3);
        assert.equal(bottomAnimatePoints[0].x, 1);
        assert.equal(bottomAnimatePoints[0].y, 0);
        assert.equal(bottomAnimatePoints[1].x, 2);
        assert.equal(bottomAnimatePoints[1].y, 0);
        assert.equal(bottomAnimatePoints[2].x, 3);
        assert.equal(bottomAnimatePoints[2].y, 0);


        $.each(series.getPoints(), function(i, pt) {
            assert.deepEqual(pt.draw.lastCall.args.length, 2);
            assert.equal(pt.draw.lastCall.args[0], renderer);
            assert.equal(pt.draw.lastCall.args[1].markers, renderer.g.getCall(3).returnValue);
        });
    });

    QUnit.test('Draw data with null values. Remove segment', function(assert) {
        const series = this.createSeries({
            type: seriesType,
            point: { visible: false },
            border: {
                visible: true,
                width: 2
            }
        });

        series.updateData([{ arg: 1, val1: 2, val2: 4 }, { arg: 2, val1: 1, val2: 2 }, { arg: 3, val1: null, val2: 2 }, { arg: 4, val1: 1, val2: 2 }, { arg: 5, val1: 1, val2: 2 }]);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
            pt.visibleTopMarker = true;
            pt.visibleBottomMarker = true;
        });
        series.draw(true);

        const element1 = this.renderer.stub('path').getCall(0).returnValue;
        const element2 = this.renderer.stub('path').getCall(1).returnValue;
        const element3 = this.renderer.stub('path').getCall(2).returnValue;
        const element4 = this.renderer.stub('path').getCall(3).returnValue;
        const element5 = this.renderer.stub('path').getCall(4).returnValue;
        const element6 = this.renderer.stub('path').getCall(5).returnValue;

        // act
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
            pt.minY = 0;
            pt.visibleTopMarker = true;
            pt.visibleBottomMarker = true;
        });
        series.draw(true);
        // assert
        assert.equal(this.renderer.stub('path').callCount, 6);
        assert.equal(this.renderer.stub('path').getCall(0).args[1], 'line');
        assert.equal(this.renderer.stub('path').getCall(1).args[1], 'area');
        assert.equal(this.renderer.stub('path').getCall(2).args[1], 'line');
        assert.equal(this.renderer.stub('path').getCall(3).args[1], 'line');
        assert.equal(this.renderer.stub('path').getCall(4).args[1], 'area');
        assert.equal(this.renderer.stub('path').getCall(5).args[1], 'line');

        assert.equal(element1.stub('append').lastCall.args[0], series._bordersGroup);
        assert.equal(element2.stub('append').lastCall.args[0], series._elementsGroup);
        assert.equal(element3.stub('append').lastCall.args[0], series._bordersGroup);
        assert.equal(element4.stub('append').lastCall.args[0], series._bordersGroup);
        assert.equal(element5.stub('append').lastCall.args[0], series._elementsGroup);
        assert.equal(element6.stub('append').lastCall.args[0], series._bordersGroup);

        assert.ok(element4.stub('remove').called, 'second element should be removed');
        assert.ok(element5.stub('remove').called, 'second element should be removed');
        assert.ok(element6.stub('remove').called, 'second element should be removed');
    });

    QUnit.module('Styles. Range area series', {
        beforeEach: function() {
            environmentWithSinonStubPoint.beforeEach.call(this);
            this.options = {
                type: seriesType,
                border: {
                    width: 'b-n width',
                    color: 'b-n color',
                    dashStyle: 'b-n dashStyle',
                    opacity: 'unexpected',
                    visible: true
                },
                opacity: 'n opacity',
                color: 'n color',
                selectionStyle: {
                    border: {
                        width: 'b-s width',
                        color: 'b-s color',
                        dashStyle: 'b-s dashStyle',
                        opacity: 'unexpected',
                        visible: false
                    },
                    opacity: 's opacity',
                    color: 's color'
                },
                hoverStyle: {
                    border: {
                        width: 'b-h width',
                        color: 'b-h color',
                        dashStyle: 'b-h dashStyle',
                        opacity: 'unexpected',
                        visible: true
                    },
                    opacity: 'h opacity',
                    color: 'h color'
                }
            };
        },
        afterEach: environmentWithSinonStubPoint.afterEach,
        createSeries: function(options) {
            return createSeries(options, {
                renderer: this.renderer,
                argumentAxis: new MockAxis({ renderer: this.renderer }),
                valueAxis: new MockAxis({ renderer: this.renderer })
            });
        }
    });

    QUnit.test('First draw - Normal State', function(assert) {
        const series = this.createSeries(this.options);
        series.updateData(this.data);
        series.createPoints();

        series.draw();

        assert.deepEqual(series._elementsGroup._stored_settings, {
            'class': 'dxc-elements',
            'clip-path': undefined,
            'fill': 'n color',
            'opacity': 'n opacity',
            'stroke': 'none'
        });

        assert.deepEqual(series._bordersGroup._stored_settings, {
            'class': 'dxc-borders',
            'clip-path': undefined,
            'dashStyle': 'b-n dashStyle',
            'stroke': 'b-n color',
            'stroke-width': 'b-n width'
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings['stroke-width'], 'b-n width');
        });
    });

    QUnit.test('Apply hover state', function(assert) {
        const series = this.createSeries(this.options);
        series.updateData(this.data);
        series.createPoints();

        series.draw();

        series.hover();

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            'fill': 'h color',
            'opacity': 'h opacity',
            'stroke': 'none',
            hatching: 'h-hatching'
        });

        assert.deepEqual(series._bordersGroup.attr.lastCall.args[0], {
            'dashStyle': 'b-h dashStyle',
            'stroke': 'b-h color',
            'stroke-width': 'b-h width'
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings['stroke-width'], 'b-h width');
        });
    });

    QUnit.test('Apply normal state after hover', function(assert) {
        const series = this.createSeries(this.options);
        series.updateData(this.data);
        series.createPoints();

        series.draw();

        series.hover();
        series.clearHover();

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            'fill': 'n color',
            'opacity': 'n opacity',
            'stroke': 'none',
            hatching: undefined
        });

        assert.deepEqual(series._bordersGroup.attr.lastCall.args[0], {
            'dashStyle': 'b-n dashStyle',
            'stroke': 'b-n color',
            'stroke-width': 'b-n width'
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings['stroke-width'], 'b-n width');
        });
    });

    QUnit.test('Apply selection state', function(assert) {
        const series = this.createSeries(this.options);
        series.updateData(this.data);
        series.createPoints();

        series.draw();

        series.select();

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            'fill': 's color',
            'opacity': 's opacity',
            'stroke': 'none',
            hatching: 's-hatching'
        });

        assert.deepEqual(series._bordersGroup.attr.lastCall.args[0], {
            'dashStyle': 'b-s dashStyle',
            'stroke': 'none',
            'stroke-width': 'b-s width'
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings['stroke-width'], 'b-s width');
        });
    });

    QUnit.test('Select series before drawing', function(assert) {
        const series = this.createSeries(this.options);
        series.updateData(this.data);
        series.createPoints();

        series.select();

        series.draw(undefined, undefined, noop);

        assert.deepEqual(series._elementsGroup.smartAttr.lastCall.args[0], {
            'fill': 's color',
            'opacity': 's opacity',
            'stroke': 'none',
            hatching: 's-hatching'
        });

        assert.deepEqual(series._bordersGroup.attr.lastCall.args[0], {
            'dashStyle': 'b-s dashStyle',
            'stroke': 'none',
            'stroke-width': 'b-s width'
        });

        $.each(series._bordersGroup.children, function(_, path) {
            assert.equal(path._stored_settings['stroke-width'], 'b-s width');
        });
    });
})();

