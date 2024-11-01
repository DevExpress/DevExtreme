import $ from 'jquery';
import vizMocks from '../../helpers/vizMocks.js';
import pointerMock from '../../helpers/pointerMock.js';
import { events as eventsConsts } from 'viz/components/consts';
import axisModule from 'viz/axes/base_axis';
import { Crosshair } from 'viz/chart_components/crosshair';
import trackers from 'viz/chart_components/tracker';
import { MockAxis } from '../../helpers/chartMocks.js';
import holdEvent from 'common/core/events/hold';
import errors from 'core/errors';

function getEvent(type, params) {
    $.Event(type, params);
    return new $.Event(type, $.extend({
        pointers: [],
        pageY: 50,
        pageX: 50
    }, params));
}

const createLegend = function() {
    const legend = new vizMocks.Legend();
    legend.stub('coordsIn').returns(false);
    legend.stub('getItemByCoord').returns(false);


    legend.stub('getOptions').returns({
        hoverMode: 'includepoints'
    });

    return legend;
};

const createSeries = function() {
    const series = new vizMocks.Series();

    series.setHoverState = sinon.spy(function(_, hoverMode) {
        series.lastHoverMode = hoverMode;
    });

    series.stub('getOptions').returns({
        hoverMode: 'excludePoints'
    });
    series.stub('getPoints').returns([]);
    series.stub('getNeighborPoint').returns(null);
    series.stub('getPointByCoord').returns(null);
    series.stub('getPoints').returns([]);
    series.stub('hover');
    return series;
};

const createPoint = function(series, argument) {
    const point = new vizMocks.Point();
    point.stub('getTooltipFormatObject').returns({ valueText: 'pointValue' });

    point.stub('isVisible').returns(true);
    point.stub('getMarkerVisibility').returns(true);

    point.stub('getCrosshairData').withArgs(97, 45).returns({ x: 90, y: 40, xValue: 10, yValue: 20 });
    point.stub('getCrosshairData').returns({});
    point.stub('getPointRadius').returns(4);
    series && series.stub('getPointsByKeys').withArgs(argument).returns([point]);
    point.stub('getTooltipParams').withArgs('tooltipLocation').returns({ x: 200, y: 100 });
    point.stub('getOptions').returns({
        hoverMode: 'onlyPoint'
    });
    point.series = series;
    point.argument = argument;
    point.index = 0;
    return point;
};

const createTooltip = function() {
    const tooltip = new vizMocks.Tooltip();

    tooltip.stub('show').returns(true);
    tooltip.stub('isEnabled').returns(true);
    tooltip.stub('getLocation').returns('tooltipLocation');
    return tooltip;
};

const createAxis = function(translator) {
    const Stub = vizMocks.stubClass(axisModule.Axis);
    const axis = new Stub();

    axis._translator = translator;
    axis.getTranslator = function() {
        return translator;
    };
    axis.getOptions = function() { return { hoverMode: 'allargumentpoints' }; };

    axis.stub('getZoomStartEventArg').returns({ mockArg: true });
    axis.stub('getZoomBounds').returns({ mockWholeRange: true });

    return axis;
};

const createCrosshair = function(startPoint, endPoint) {
    const subCrosshair = vizMocks.stubClass(Crosshair);
    const crosshair = new subCrosshair();

    crosshair.stub('hide');
    crosshair.stub('show');

    return crosshair;
};

function strictEqualForAllFields(assert, instance, etalon, message) {
    let key;
    let keysInInstance = 0;
    let keysInEtalon = 0;
    let allKeysIsValid = true;

    for(key in etalon) {
        keysInEtalon++;
        if(instance[key] !== etalon[key]) {
            allKeysIsValid = false;
            break;
        }
    }

    assert.pushResult({
        result: allKeysIsValid,
        actual: instance,
        expected: etalon,
        message: message
    });

    for(key in instance) {
        keysInInstance++;
    }
    assert.equal(keysInInstance, keysInEtalon, 'keys count');
}

const chartEnvironment = {
    beforeEach() {
        const that = this;

        that.clock = sinon.useFakeTimers();
        that.renderer = new vizMocks.Renderer();
        that.renderer.draw();
        that.series = createSeries();
        that.legend = createLegend();
        that.point = createPoint(that.series);

        that.axis = sinon.stub({
            getOptions: function() { },
            coordsIn: function() { }
        });
        that.axis.getOptions.returns({
            hoverMode: 'allargumentpoints'
        });
        that.axis.coordsIn.returns(false);

        that.seriesGroup = this.renderer.g();
        that.seriesGroup.element['chart-data-series'] = this.series;
        that.pointElement = this.renderer.g();
        that.pointElement.element['chart-data-point'] = this.point;

        that.canvases = [{
            left: 10,
            right: 100,
            top: 15,
            bottom: 150
        }];

        that.options = {
            seriesGroup: that.seriesGroup,
            tooltipEnabled: that,
            argumentAxis: that.axis,
            tooltip: createTooltip(),
            legend: that.legend,
            canvases: that.canvases,
            series: [that.series],
            crosshair: createCrosshair(),
            renderer: that.renderer,
            stickyHovering: true,
            mainCanvas: {
                left: 0,
                right: 300,
                top: 0,
                bottom: 400
            },
            eventTrigger: sinon.stub(),
            chart: {
                getStackedPoints: sinon.spy(function() { return 'points_by_stack_name'; })
            }
        };
    },

    afterEach() {
        this.clock.restore();

        this.tracker.dispose && this.tracker.dispose();
        this.seriesGroup.remove();
        this.pointElement.remove();
        this.renderer.dispose();
        this.renderer = null;
        this.series = null;
        this.point = null;
        this.legend = null;
        this.axis = null;

        this.seriesGroup = null;
        this.pointElement = null;
        this.canvases = null;
        this.options = null;
        this.tracker = null;
    },

    createTracker(options) {
        const tracker = createTracker('dxChart', options);
        options.tooltip.stub('hide').reset();
        return tracker;
    },

    updateTracker(series) {
        this.tracker.updateSeries(series);
        this.tracker.update(this.options);
    }
};

QUnit.module('Root events', $.extend({}, chartEnvironment, {
    beforeEach() {
        chartEnvironment.beforeEach.call(this);
        this.tracker = this.createTracker(this.options);
        this.logStub = sinon.stub(errors, 'log');
    },
    afterEach() {
        chartEnvironment.afterEach.call(this);
        this.logStub.restore();
    }
}));

QUnit.test('Subscriptions on init', function(assert) {
    const rootElement = this.renderer.root;
    const events = $._data(rootElement.element, 'events') || {};
    const holdEvents = events[holdEvent.name] || [];

    assert.ok(this.tracker);
    assert.strictEqual(rootElement.on.callCount, 3, 'root subscription');
    assert.strictEqual(rootElement.on.getCall(0).args[0], 'dxpointerdown.dxChartTracker dxpointermove.dxChartTracker', 'pointer events');
    assert.strictEqual(rootElement.on.getCall(1).args[0], 'dxpointerup.dxChartTracker', 'pointer up event');
    assert.strictEqual(rootElement.on.getCall(2).args[0], 'dxclick.dxChartTracker', 'click event');
    assert.strictEqual(holdEvents.length, 0, 'dxhold event handler is not exists'); // T880908 - Don't use dxhold event
});

QUnit.test('dxpointermove without series over', function(assert) {
    this.series.stub('getNeighborPoint').returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 102, pageY: 40 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 2, pageY: 5 }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.series.stub('hover').called, 'showHoverState was not called');
    assert.ok(!this.series.stub('hoverPoint').called, 'hover point was not called');
    assert.ok(!this.series.stub('clearPointHover').called);
    assert.ok(!this.options.crosshair.show.called, 'crosshair showing was not called');
});

QUnit.test('dxpointermove without series over when shared tooltip', function(assert) {
    // Arrange
    const series2 = createSeries();
    const point2 = createPoint(series2);

    this.series.stub('getNeighborPoint').withArgs(97, 45).returns(this.point);

    series2.stub('getNeighborPoint').withArgs(97, 45).returns(point2);
    this.point.stub('getCrosshairData').withArgs(97, 45).returns({ x: 90, y: 30, xValue: 10, yValue: 20 });
    point2.stub('getCrosshairData').withArgs(97, 45).returns({ x: 90, y: 10, xValue: 30, yValue: 40 });

    this.options.tooltip.stub('isShared').returns(true);
    this.updateTracker([this.series, series2]);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, pointerType: 'mouse' }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 102, pageY: 40, pointerType: 'mouse' }));

    // Assert
    assert.ok(!series2.stub('hover').called);
    assert.ok(!point2.stub('hover').called);
    assert.ok(!this.series.stub('hover').called);

    assert.strictEqual(this.point.hover.callCount, 1);

    assert.deepEqual(this.options.chart.getStackedPoints.getCall(0).args, [this.point]);
    assert.deepEqual(this.point.getTooltipFormatObject.getCall(0).args, [this.options.tooltip, 'points_by_stack_name']);

    const showTooltip = this.options.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.equal(showTooltip.lastCall.args[0], this.point.getTooltipFormatObject.getCall(0).returnValue);
    assert.deepEqual(showTooltip.lastCall.args[1], { x: 200 + 3, y: 100 + 5 });
    assert.deepEqual(showTooltip.lastCall.args[2], { target: this.point });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.ok(this.options.crosshair.show.calledOnce, 'crosshair[0] moved');
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 97, y: 45 });
});

QUnit.test('dxpointermove without series over when shared tooltip. another series', function(assert) {
    // Arrange
    const series2 = createSeries();
    const point2 = createPoint(series2);

    this.series.stub('getNeighborPoint').withArgs(97, 45).returns(this.point);
    series2.stub('getNeighborPoint').withArgs(97, 45).returns(point2);
    this.point.stub('getCrosshairData').withArgs(97, 45).returns({ x: 90, y: 10, xValue: 10, yValue: 20 });
    point2.stub('getCrosshairData').withArgs(97, 45).returns({ x: 90, y: 30, xValue: 30, yValue: 40 });

    this.options.tooltip.stub('isShared').returns(true);
    this.updateTracker([this.series, series2]);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, pointerType: 'mouse' }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 102, pageY: 40, pointerType: 'mouse' }));

    // Assert
    assert.ok(!this.series.stub('hover').called);
    assert.ok(!this.point.stub('hover').called);
    assert.ok(!series2.stub('hover').called);

    assert.deepEqual(this.options.chart.getStackedPoints.getCall(0).args, [point2]);
    assert.deepEqual(point2.getTooltipFormatObject.getCall(0).args, [this.options.tooltip, 'points_by_stack_name']);
    assert.strictEqual(point2.hover.callCount, 1);

    const showTooltip = this.options.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.equal(showTooltip.lastCall.args[0], point2.getTooltipFormatObject.getCall(0).returnValue);
    assert.deepEqual(showTooltip.lastCall.args[1], { x: 200 + 3, y: 100 + 5 });
    assert.deepEqual(showTooltip.lastCall.args[2], { target: point2 });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.ok(this.options.crosshair.show.calledOnce, 'crosshair[0] moved');
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: point2, x: 97, y: 45 });
});

QUnit.test('dxpointermove without series over when shared tooltip, series has two points', function(assert) {
    // Arrange
    const series2 = createSeries();
    const point2 = createPoint(series2);
    const point1 = createPoint(series2);

    this.series.stub('getNeighborPoint').returns(this.point);
    series2.stub('getNeighborPoint').withArgs(97, 25).returns(point2);
    series2.stub('getNeighborPoint').withArgs(97, 75).returns(point1);

    this.point.stub('getCrosshairData').returns({ x: 90, y: 80, xValue: 10, yValue: 20 });
    point2.stub('getCrosshairData').returns({ x: 90, y: 30, xValue: 30, yValue: 40 });

    this.options.tooltip.stub('isShared').returns(true);
    this.updateTracker([this.series, series2]);

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 30, pointerType: 'mouse' }));
    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 80, pointerType: 'mouse' }));

    // Assert
    assert.ok(!this.series.stub('hover').called);
    assert.ok(!this.point.stub('hover').called);
    assert.ok(!series2.stub('hover').called);

    assert.strictEqual(point2.hover.callCount, 1);
    assert.strictEqual(point1.hover.callCount, 1);

    const showTooltip = this.options.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 2, 'tooltip showing was calling twice');
    assert.equal(showTooltip.lastCall.args[0], point1.getTooltipFormatObject.getCall(0).returnValue);
    assert.deepEqual(showTooltip.lastCall.args[1], { x: 200 + 3, y: 100 + 5 });
    assert.deepEqual(showTooltip.lastCall.args[2], { target: point1 });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.deepEqual(this.options.chart.getStackedPoints.getCall(1).args, [point1]);
    assert.deepEqual(point1.getTooltipFormatObject.getCall(0).args, [this.options.tooltip, 'points_by_stack_name']);
});

QUnit.test('dxpointermove on series', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // Assert
    assert.ok(this.series.hover.calledOnce);

    assert.equal(this.options.chart.getStackedPoints.callCount, 0);
    assert.deepEqual(this.point.getTooltipFormatObject.getCall(0).args, [this.options.tooltip, undefined]);

    const showTooltip = this.options.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.equal(showTooltip.lastCall.args[0], this.point.getTooltipFormatObject.getCall(0).returnValue);
    assert.deepEqual(showTooltip.lastCall.args[1], { x: 200 + 3, y: 100 + 5 });
    assert.deepEqual(showTooltip.lastCall.args[2], { target: this.point });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.ok(this.options.crosshair.show.calledOnce, 'crosshair[0] moved');
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 97, y: 45 });
});

QUnit.test('move tooltip on one series', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // Assert
    assert.equal(this.options.tooltip.stub('show').callCount, 1, 'tooltip showing');
    assert.equal(this.options.tooltip.stub('hide').callCount, 0, 'tooltip hiding');
});

QUnit.test('move on series between two point', function(assert) {
    // arrange
    const point1 = createPoint(this.series);

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    this.series.getNeighborPoint.withArgs(92, 45).returns(this.point);
    this.point.stub('getCrosshairData').withArgs(92, 45).returns({ x: 92, y: 45, xValue: 10, yValue: 20 });

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 95, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));

    // Assert
    assert.ok(this.series.hover.calledOnce);
    assert.deepEqual(this.series.stub('updateHover').getCall(0).args, [97, 45], 'updateHover args, first time');
    assert.deepEqual(this.series.stub('updateHover').getCall(1).args, [92, 45], 'updateHover args, second time');

    assert.ok(!this.point.stub('hover').called);

    const showTooltip = this.options.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.deepEqual(showTooltip.lastCall.args[0], point1.getTooltipFormatObject());
    assert.deepEqual(showTooltip.lastCall.args[1], { x: 200 + 3, y: 100 + 5 });
    assert.deepEqual(showTooltip.lastCall.args[2], { target: this.point });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.equal(this.options.crosshair.show.callCount, 2, 'crosshair[0] moved');
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 92, y: 45 });
});

QUnit.test('dxpointermove on series, mouse out of the chart', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(document).trigger(getEvent('dxpointermove', { pageX: 500, pageY: 500 }));

    // Assert
    assert.strictEqual(this.series.clearHover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));

    assert.equal(this.options.tooltip.stub('show').callCount, 1, 'tooltip showing');

    assert.ok(this.options.crosshair.show.calledOnce, 'crosshair show');
    strictEqualForAllFields(assert, this.options.crosshair.show.lastCall.args[0], { point: this.point, x: 97, y: 45 });
    assert.equal(this.options.crosshair.hide.callCount, 1, 'crosshair hide');
});

QUnit.test('Mouseout from chart after dxpointermove on series. Curson on the interactive tooltip', function(assert) {
    this.options.tooltip.stub('isEnabled').returns(true);
    this.options.tooltip.stub('isCursorOnTooltip').returns(true);
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(document).trigger(getEvent('dxpointermove', { pageX: 500, pageY: 500 }));

    // assert
    assert.ok(this.options.tooltip.show.calledOnce);
    assert.ok(!this.options.tooltip.stub('hide').called);
    assert.ok(this.options.tooltip.stub('isEnabled').called);
    assert.deepEqual(this.options.tooltip.stub('isCursorOnTooltip').args[0], [500, 500]);
});

QUnit.test('Mouseout from chart after dxpointermove on series. Tooltip is not enabled', function(assert) {
    this.options.tooltip.stub('isEnabled').returns(false);
    this.options.tooltip.stub('isCursorOnTooltip').returns(false);
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(document).trigger(getEvent('dxpointermove', { pageX: 500, pageY: 500 }));

    // assert
    assert.ok(!this.options.tooltip.show.called);
    assert.ok(!this.options.tooltip.stub('hide').called);
    assert.equal(this.options.tooltip.stub('isEnabled').callCount, 3);
    assert.ok(!this.options.tooltip.stub('isCursorOnTooltip').called);
    assert.equal(this.series.clearHover.callCount, 1, 'series was unhover');
});

QUnit.test('dxpointermove over point', function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));

    // assert
    assert.ok(!this.series.hover.called, 'series was not hoveres');
    assert.ok(this.point.hover.calledOnce, 'point hovered');
    assert.equal(this.options.tooltip.stub('show').callCount, 1, 'tooltip show');
});

QUnit.test('dxpointermove over invisible point', function(assert) {
    this.point.stub('getMarkerVisibility').returns(false);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));

    assert.ok(!this.point.hover.called, 'point was not hovered');
});

QUnit.test('dxpointermove over point. move crosshair on point', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.point.stub('getCrosshairData').returns({ x: 80, y: 30, xValue: 10, yValue: 20 });
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 50, target: this.pointElement.element }));

    // assert
    assert.equal(this.options.crosshair.show.callCount, 2);
    strictEqualForAllFields(assert, this.options.crosshair.show.getCall(0).args[0], { point: this.point, x: 97, y: 45 });
    strictEqualForAllFields(assert, this.options.crosshair.show.getCall(1).args[0], { point: this.point, x: 77, y: 45 });
    assert.equal(this.options.crosshair.hide.callCount, 0);
});

QUnit.test('move crosshair, point is invisible', function(assert) {
    // arrange
    this.point.stub('isVisible').returns(false);
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 2, pageY: 1, target: this.pointElement.element }));

    // assert
    assert.equal(this.options.crosshair.show.callCount, 0);
});

QUnit.test('dxpointermove over point but out of a canvas (point on the border)', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 2, pageY: 1, target: this.pointElement.element }));

    // assert
    assert.ok(this.point.hover.calledOnce, 'point hovered');
    assert.equal(this.options.tooltip.stub('show').callCount, 1, 'tooltip showing');
});

QUnit.test('mouseover on series - mouseout from series', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(99, 40).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 102, pageY: 45, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.clearHover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
    assert.ok(this.point.hover.calledOnce, 'point hovered');
});

QUnit.test('mouseover on series - mouseout from series. Invisible points', function(assert) {
    // arrange
    this.point.stub('getMarkerVisibility').returns(false);
    this.series.getNeighborPoint.withArgs(99, 40).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 102, pageY: 45, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.point.hover.called, 'point hovered');
});

QUnit.test('no pointClick on invisible point', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.point.stub('getMarkerVisibility').returns(false);
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    // assert
    assert.ok(!this.options.eventTrigger.withArgs('pointClick').called);
});

QUnit.test('no pointClick on invisible point. Rising click by series', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.point.stub('getMarkerVisibility').returns(false);
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    // assert
    assert.ok(this.options.eventTrigger.withArgs('seriesClick').called);
});

QUnit.test('mouse out from series before hover', function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 102, pageY: 45 }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.stub('hover').callCount, 0, 'setHoverState');
});

QUnit.test('mouse move over series after hover series', function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 99, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.stub('clearHover').callCount, 0);
    assert.deepEqual(this.series.updateHover.lastCall.args, [96, 45]);
});

QUnit.test('mouse move over series cross point after hover series', function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element, pointerType: 'mouse' }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 99, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));

    // assert
    assert.strictEqual(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.stub('clearHover').callCount, 0);
    assert.strictEqual(this.series.stub('hoverPoint').callCount, 0, 'point not hovered');
});

QUnit.test('mouse move over series then mouse move on point', function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.clearHover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
    assert.ok(this.point.hover.calledOnce, 'point hovered');
});

QUnit.test('mouse move over series and point', function(assert) {
    // arrange
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    // assert
    assert.strictEqual(this.series.stub('hover').callCount, 0, 'series not hovered');
    assert.ok(this.point.hover.calledOnce, 'point hovered');
});

QUnit.test('mouseout from canvas after dxpointermove on point', function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 2, pageY: 5, pointerType: 'mouse' }));

    // assert
    assert.strictEqual(this.point.clearHover.callCount, 1, 'point unhovered');
    assert.ok(this.point.clearHover.calledAfter(this.point.hover));
    assert.ok(this.options.tooltip.stub('hide').called, 'tooltip hide');
});

QUnit.test('mouseout from point', function(assert) {
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 75 }));

    assert.strictEqual(this.point.stub('clearHover').callCount, 0);
});

QUnit.test('mouseout from series to point another series', function(assert) {
    const series2 = createSeries();
    const point = createPoint(series2);
    const pointElement = this.renderer.g();

    pointElement.element['chart-data-point'] = point;

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 47, pageY: 50, target: pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    assert.strictEqual(this.point.stub('clearHover').callCount, 0);
    assert.strictEqual(point.hover.callCount, 1);

    delete pointElement.element['chart-data-point'];
    $(pointElement.element).remove();
});

QUnit.test('Mouseout from canvas after dxpointermove on series. Tooltip disabled', function(assert) {
    // arrange
    this.options.tooltip.isEnabled.returns(false);
    this.tracker.update(this.options);
    this.options.tooltip.stub('hide').reset();

    // act
    $(this.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.point);

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 2, pageY: 5 }));

    // assert
    assert.ok(this.options.tooltip.show.calledOnce);
    assert.ok(!this.options.tooltip.stub('hide').called);
});

QUnit.test('mouseout from canvas after dxpointermove on series some times. Check canvas calculation', function(assert) {
    // arrange
    const that = this;
    this.series.getNeighborPoint.returns(this.point);

    // assert
    $(this.renderer.root.element).on('dxpointermove', function(e) {
        const testSettings = (e.test || {});
        that.clock.tick(that.tracker.__trackerDelay);
        switch(testSettings.action) {
            case 'hover':
                assert.ok(that.series.hover.calledOnce, 'series hover: ' + testSettings.name);
                break;
            case 'unhover':
                assert.ok(that.point.clearHover.calledOnce, 'point unhover: ' + testSettings.name);
                break;

            case 'pointHover':
                assert.ok(that.series.clearHover.calledOnce, 'series unhover: ' + testSettings.name);
                assert.strictEqual(that.point.hover.callCount, 1, 'point hovered: ' + testSettings.name);
        }

        that.series.stub('hover').reset();
        that.point.stub('hover').reset();
        that.point.stub('clearHover').reset();
        that.series.stub('clearHover').reset();
    });

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: 'hover',
            name: 'left side begin'
        }, pointerType: 'mouse'
    }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 14, pageY: 40, test: {
            action: 'pointHover',
            name: 'left in'
        }, pointerType: 'mouse'
    }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 12, pageY: 40, test: {
            action: 'unhover',
            name: 'left out'
        }, pointerType: 'mouse'
    }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: 'hover',
            name: 'top side begin'
        }, pointerType: 'mouse'
    }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 20, test: {
            action: 'pointHover',
            name: 'top in'
        }, pointerType: 'mouse'
    }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 19, test: {
            action: 'unhover',
            name: 'top out'
        }, pointerType: 'mouse'
    }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: 'hover',
            name: 'right side begin'
        }, pointerType: 'mouse'
    }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 103, pageY: 40, test: {
            action: 'pointHover',
            name: 'right in'
        }, pointerType: 'mouse'
    }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 104, pageY: 40, test: {
            action: 'unhover',
            name: 'right out'
        }, pointerType: 'mouse'
    }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 50, target: this.seriesGroup.element, test: {
            action: 'hover',
            name: 'bottom side begin'
        }, pointerType: 'mouse'
    }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 155, test: {
            action: 'pointHover',
            name: 'bottom in'
        }, pointerType: 'mouse'
    }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', {
        pageX: 100, pageY: 156, test: {
            action: 'unhover',
            name: 'bottom out'
        }, pointerType: 'mouse'
    }));
    // teardown
    $(this.renderer.root.element).off();
});

QUnit.test('dxpointermove when there are two series', function(assert) {
    // arrange
    const series2 = createSeries();
    const pointSeries2 = createPoint(series2);
    const series2Element = this.renderer.g();

    series2Element.element['chart-data-series'] = series2;

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    series2.getNeighborPoint.withArgs(77, 35).returns(pointSeries2);
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 40, target: series2Element.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    delete series2Element.element['chart-data-series'];
    $(series2Element.element).remove();

    // assert
    assert.strictEqual(this.series.hover.callCount, 1);
    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
    assert.strictEqual(series2.hover.callCount, 1);
    assert.ok(this.options.tooltip.stub('show').calledTwice, 'tooltip showing');
});

QUnit.test('dxpointermove from point one series to point other series', function(assert) {
    // arrange
    const series2 = createSeries();
    const pointSeries2 = createPoint(series2);
    const point2Element = this.renderer.g();

    point2Element.element['chart-data-point'] = pointSeries2;

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    series2.getNeighborPoint.withArgs(77, 35).returns(pointSeries2);
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 40, target: point2Element.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    delete point2Element.element['chart-data-point'];
    $(point2Element.element).remove();

    // assert
    assert.strictEqual(this.series.stub('clearHover').callCount, 0);
    assert.strictEqual(pointSeries2.hover.callCount, 1);
    assert.ok(this.options.tooltip.stub('show').calledTwice);
});

QUnit.test('dxpointermove from point one series to other series', function(assert) {
    // arrange
    const series2 = createSeries();
    const series2Element = this.renderer.g();

    series2Element.element['chart-data-series'] = series2;

    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 40, target: series2Element.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.point.stub('clearHover').callCount, 1);
    assert.strictEqual(series2.hover.callCount, 1);
});

QUnit.test('touch without series over', function(assert) {
    // arrange
    this.series.stub('getNeighborPoint').returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 100, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 102, pageY: 40 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 2, pageY: 5 }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.series.stub('hover').called, 'series not hovered');
    assert.ok(!this.series.stub('hoverPoint').called, 'point not hovered');
    assert.ok(!this.options.crosshair.show.called, 'crosshair showing');
});

QUnit.test('touch over point', function(assert) {
    // arrange
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 100, pageY: 50, target: this.pointElement.element, pointerType: 'touch' }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.series.hover.called, 'series was not hoveres');
    assert.ok(this.point.hover.calledOnce, 'point hovered');
    assert.equal(this.options.tooltip.stub('show').callCount, 1, 'tooltip show');
});

QUnit.test('dxpointerdown on point not on touch - do not hover point', function(assert) {
    // arrange
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 100, pageY: 50, target: this.pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.ok(!this.series.hover.called);
    assert.ok(!this.point.hover.called);
    assert.ok(!this.options.tooltip.stub('show').called);
});

QUnit.test('click on canvas', function(assert) {
    $(this.renderer.root.element).trigger(getEvent('dxclick', { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxclick', { pageX: 102, pageY: 40 }));
    $(this.renderer.root.element).trigger(getEvent('dxclick', { pageX: 2, pageY: 5 }));

    assert.ok(!this.options.eventTrigger.withArgs('pointClick').called);
    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').called);
});

QUnit.test('dxpointermove on series, click', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs('pointClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('pointClick').lastCall.args[1], { target: this.point, event: clickEvent });
    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').calledOnce);

    this.options.eventTrigger.withArgs('pointClick').lastCall.args[2]();

    assert.ok(this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('seriesClick').lastCall.args[1], { target: this.point.series, event: clickEvent }, 'series event arg');
});

QUnit.test('dxpointermove on series, click, pointClick with cancel (DEPRECATED) seriesClick', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs('pointClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('pointClick').lastCall.args[1], { target: this.point, event: clickEvent });
    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    clickEvent.cancel = true;
    this.options.eventTrigger.withArgs('pointClick').lastCall.args[2]();

    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').called);
    assert.deepEqual(errors.log.lastCall.args, [
        'W0003',
        'pointClick handler argument',
        'event.cancel',
        '22.1',
        'Use the \'cancel\' field instead'
    ], 'args of the log method');
});

QUnit.test('dxpointermove on series, click, pointClick with cancel seriesClick', function(assert) {
    this.options.eventTrigger = sinon.spy((eventName, eventArgs) => {
        if(eventName === 'pointClick') {
            eventArgs.cancel = true;
        }
    });
    this.tracker = this.createTracker(this.options, this.canvases);
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs('pointClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('pointClick').lastCall.args[1], {
        cancel: true,
        target: this.point,
        event: clickEvent
    });
    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    this.options.eventTrigger.withArgs('pointClick').lastCall.args[2]();

    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').called);
});

QUnit.test('dxpointermove on series, click far from point ', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(null);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(!this.options.eventTrigger.withArgs('pointClick').called);
    assert.ok(this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('seriesClick').lastCall.args[1], { target: this.point.series, event: clickEvent }, 'series event arg');
});

QUnit.test('stop propagation event after dispose series on pointClick', function(assert) {
    const series = this.series;
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === 'pointClick') {
            series.getOptions.returns(null); // emulate disposing
            complete();
        } else if(eventName === 'seriesClick') {
            assert.ok(false, 'unexpected seriesClick');
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.tracker);
});

QUnit.test('no stop propagation event after dispose tracker on pointClick, if series not disposed', function(assert) {
    const that = this;
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    let seriesClicked = false;

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === 'pointClick') {
            that.tracker.dispose();
            complete();
        } else if(eventName === 'seriesClick') {
            seriesClicked = true;
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);
    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(seriesClicked);
});

QUnit.test('dxpointermove on series, mouseout from series but in point tracker radius, click', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 90, pageY: 50, pointerType: 'mouse' });
    this.series.getPointByCoord.withArgs(87, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 50, pointerType: 'mouse' }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs('pointClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('pointClick').lastCall.args[1], { target: this.point, event: clickEvent });
    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').calledOnce);

    this.options.eventTrigger.withArgs('pointClick').lastCall.args[2]();

    assert.ok(this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('seriesClick').lastCall.args[1], { target: this.point.series, event: clickEvent }, 'series event arg');
});

QUnit.test('On touch devices on click get series from clicked target, not sticked series. T514138', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 90, pageY: 50, target: this.seriesGroup.element, pointerType: 'touch' });
    const series2 = createSeries();
    const series2Element = this.renderer.g();

    series2Element.element['chart-data-series'] = series2;
    this.options.series = [this.series, series2];

    this.tracker.update(this.options);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 100, pageY: 50, target: series2Element.element, pointerType: 'touch' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('seriesClick').lastCall.args[1], { target: this.point.series, event: clickEvent }, 'series event arg');
});

QUnit.test('dxpointermove on series, mouseout from series click', function(assert) {
    const clickEvent = getEvent('dxclick', { pageX: 90, pageY: 50 });
    this.series.getPointByCoord.withArgs(87, 45).returns(null);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 50 }));
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(!this.options.eventTrigger.withArgs('pointClick').called);
    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').called);
});

QUnit.test('click on series', function(assert) {
    const rootElement = this.renderer.root.element = $('<div>').appendTo(document.body);
    rootElement.get(0)['chart-data-series'] = this.series;
    this.tracker = this.createTracker(this.options, this.canvases);

    const mouse = pointerMock(rootElement);

    mouse
        .start()
        .down();
    this.clock.tick(250);
    mouse
        .wait(10)
        .up();

    this.clock.tick(0);

    assert.ok(this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    rootElement.remove();
});

QUnit.test('hold on series', function(assert) {
    const rootElement = this.renderer.root.element = $('<div>').appendTo(document.body);
    rootElement.get(0)['chart-data-series'] = this.series;
    this.tracker = this.createTracker(this.options, this.canvases);

    const mouse = pointerMock(rootElement);

    mouse
        .start()
        .down();
    this.clock.tick(300);
    mouse
        .wait(300)
        .up();

    this.clock.tick(0);
    assert.ok(this.tracker._isHolding);
    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').called);

    delete rootElement.get(0)['chart-data-series'];
    rootElement.remove();
});

QUnit.test('mouseover on legend item', function(assert) {
    // arrange
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub('hover').calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ['includepoints']);
});

QUnit.test('mouseover on legend item. ExcludePoints mode', function(assert) {
    // arrange
    this.legend.getOptions.returns({ hoverMode: 'excludepoints' });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub('hover').calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ['excludepoints']);
});

QUnit.test('mouseover on legend item. none mode', function(assert) {
    // arrange
    this.legend.getOptions.returns({ hoverMode: 'none' });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub('hover').calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ['none']);
});

QUnit.test('mouseover on legend item. not valid mode', function(assert) {
    // arrange
    this.legend.getOptions.returns({ hoverMode: 'allargumentpoints' });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    // assert
    assert.ok(this.series.stub('hover').calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ['includepoints']);
});

QUnit.test('mouseout from legend in canvas', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(87, 45).returns(this.point);
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 50 }));

    // assert
    assert.equal(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.clearHover.callCount, 1);
});

QUnit.test('mousemove from point to legend', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0 });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 60, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.equal(this.options.tooltip.stub('hide').callCount, 1);
});

QUnit.test('mouseout from legend out canvas', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 5, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 1);
    assert.strictEqual(this.series.clearHover.callCount, 1);
});

QUnit.test('mouseout from legend item', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 50 }));

    assert.ok(this.series.clearHover.calledAfter(this.series.hover));
});

QUnit.test('mouse move on legend when series is hovered', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 60, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 2);
    assert.equal(this.series.hover.getCall(0).args[0], undefined);
    assert.equal(this.series.hover.getCall(1).args[0], 'includepoints');
});

QUnit.test('touch on legend item', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 100, pageY: 50 }));

    assert.ok(this.series.stub('hover').calledOnce);
    assert.deepEqual(this.series.hover.lastCall.args, ['includepoints']);
});

QUnit.test('move pointer on legend item hovered series', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.series.stub('isHovered').returns(true);
    this.series.lastHoverMode = 'includepoints';
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 0);
});

QUnit.test('hover series to legend hover mode', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.series.lastHoverMode = 'includepoints_1';
    this.series.stub('isHovered').returns(true);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.equal(this.series.hover.callCount, 1);
});

QUnit.test('legendClick', function(assert) {
    const event = getEvent('dxclick', { pageX: 100, pageY: 50 });
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs('legendClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('legendClick').lastCall.args[1], { target: this.series, event: event });

    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').calledOnce);

    this.options.eventTrigger.withArgs('legendClick').lastCall.args[2]();

    assert.ok(this.options.eventTrigger.withArgs('seriesClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('seriesClick').lastCall.args[1], { target: this.series, event: event }, 'series event arg');
});

QUnit.test('click on legend with chancel (DEPRECATED) in legendClick handler', function(assert) {
    const event = getEvent('dxclick', { pageX: 100, pageY: 50 });

    this.tracker = this.createTracker(this.options, this.canvases);
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs('legendClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('legendClick').lastCall.args[1], { target: this.series, event: event });

    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').calledOnce);

    event.cancel = true;
    this.options.eventTrigger.withArgs('legendClick').lastCall.args[2]();


    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').called);
    assert.deepEqual(errors.log.lastCall.args, [
        'W0003',
        'legendClick handler argument',
        'event.cancel',
        '22.1',
        'Use the \'cancel\' field instead'
    ], 'args of the log method');
});

QUnit.test('click on legend with chancel in legendClick handler', function(assert) {
    this.options.eventTrigger = sinon.spy((eventName, eventArgs) => {
        if(eventName === 'legendClick') {
            eventArgs.cancel = true;
        }
    });
    const event = getEvent('dxclick', { pageX: 100, pageY: 50 });

    this.tracker = this.createTracker(this.options, this.canvases);
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs('legendClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('legendClick').lastCall.args[1], {
        target: this.series,
        event: event,
        cancel: true
    });

    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').calledOnce);

    this.options.eventTrigger.withArgs('legendClick').lastCall.args[2]();

    assert.ok(!this.options.eventTrigger.withArgs('seriesClick').called);
});

QUnit.test('stop propagation event after dispose series on legendClick', function(assert) {
    const series = this.series;
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50 });

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === 'legendClick') {
            series.getOptions.returns(null); // emulate series disposing
            complete();
        } else if(eventName === 'seriesClick') {
            assert.ok(false, 'unexpected seriesClick');
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(this.tracker);
});

QUnit.test('no stop propagation event after dispose tracker on legendClick, if series not disposed', function(assert) {
    const that = this;
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50 });
    let seriesClicked = false;

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0
    });

    this.options.eventTrigger = function(eventName, event, complete) {
        if(eventName === 'legendClick') {
            that.tracker.dispose();
            complete();
        } else if(eventName === 'seriesClick') {
            seriesClicked = true;
        }
    };

    this.tracker = this.createTracker(this.options, this.canvases, this.tooltip);

    // Act
    $(this.renderer.root.element).trigger(clickEvent);

    assert.ok(seriesClicked);
});

QUnit.test('click on argument axis between element', function(assert) {
    const event = getEvent('dxclick', { pageX: 100, pageY: 50 });

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    $(this.renderer.root.element).trigger(event);

    assert.ok(!this.options.eventTrigger.withArgs('argumentAxisClick').called);
});

QUnit.test('click on argument axis element. Axis hoverMode is \'none\'', function(assert) {
    const target = this.renderer.g();
    target.element['chart-data-argument'] = 'argument1';
    this.axis.getOptions.returns({ hoverMode: 'none' });
    this.tracker.update(this.options);

    const event = getEvent('dxclick', { pageX: 100, pageY: 50, target: target.element });
    this.axis.coordsIn.withArgs(97, 45).returns(true);

    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs('argumentAxisClick').calledOnce);
    assert.deepEqual(this.options.eventTrigger.withArgs('argumentAxisClick').lastCall.args[1], { argument: 'argument1', event: event });
});

QUnit.test('click on argument axis. Parent of target has data', function(assert) {
    const parent = this.renderer.g();
    const target = this.renderer.g();

    parent.element.appendChild(target.element);

    parent.element['chart-data-argument'] = 'argument1';
    this.tracker.update(this.options);

    const event = getEvent('dxclick', { pageX: 100, pageY: 50, target: target.element });
    this.axis.coordsIn.withArgs(97, 45).returns(true);

    $(this.renderer.root.element).trigger(event);

    assert.deepEqual(this.options.eventTrigger.withArgs('argumentAxisClick').lastCall.args[1], { argument: 'argument1', event: event });
});

QUnit.test('hover on argument axis. Parent of target has data', function(assert) {
    const axisElement = this.renderer.g();
    const parent = this.renderer.g();

    parent.element.appendChild(axisElement.element);

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    parent.element['chart-data-argument'] = 'argument1';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement.element }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('pointermove on axis element. Axis hoverMode is \'none\'', function(assert) {
    const axisElement = this.renderer.g();

    this.axis.getOptions.returns({ hoverMode: 'none' });
    this.tracker.update(this.options);
    this.axis.coordsIn.withArgs(97, 45).returns(true);
    axisElement.element['chart-data-argument'] = 'argument1';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement.element }));

    assert.strictEqual(this.series.stub('notify').callCount, 0);
});

QUnit.test('pointermove on axis element', function(assert) {
    const axisElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement.element['chart-data-argument'] = 'argument1';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement.element }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.ok(!this.series.notify.lastCall.args[0].notifyLegend);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('pointermove on axis element (axis element is multiline text', function(assert) {
    const axisElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement.element['chart-data-argument'] = 'argument1';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: { tagName: 'tspan', parentNode: axisElement.element } }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('pointermove from axis element1 to axis element2', function(assert) {
    const axisElement1 = this.renderer.g();
    const axisElement2 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);

    this.axis.coordsIn.withArgs(87, 45).returns(true);

    axisElement1.element['chart-data-argument'] = 'argument1';
    axisElement2.element['chart-data-argument'] = 'argument2';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement1.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 70, pageY: 50, target: axisElement2.element }));

    assert.strictEqual(this.series.stub('notify').callCount, 3);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument2');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('pointermove from axis element1 to axis element2 two series', function(assert) {
    const series2 = createSeries();
    const axisElement1 = this.renderer.g();
    const axisElement2 = this.renderer.g();

    this.options.series = [this.series, series2];

    this.tracker = this.createTracker(this.options, this.canvases);

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);
    this.axis.coordsIn.withArgs(87, 45).returns(true);
    axisElement1.element['chart-data-argument'] = 'argument1';
    axisElement2.element['chart-data-argument'] = 'argument2';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement1.element }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 70, pageY: 50, target: axisElement2.element }));

    assert.strictEqual(this.series.stub('notify').callCount, 3);
    assert.strictEqual(series2.stub('notify').callCount, 3);
    assert.strictEqual(this.series.notify.getCall(0).args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.getCall(1).args[0].action, 'clearPointHover');
    assert.ok(!this.series.notify.lastCall.args[0].notifyLegend, 'legend should not bein notified');
    assert.strictEqual(this.series.notify.getCall(2).args[0].action, 'pointHover');
});

QUnit.test('pointermove from axis element1 to axis white space', function(assert) {
    const axisElement1 = this.renderer.g();
    const axisElement2 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);
    this.axis.coordsIn.withArgs(77, 45).returns(true);

    axisElement1.element['chart-data-argument'] = 'argument1';
    axisElement2.element['chart-data-argument'] = 'argument2';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement1.element }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 50 }));

    assert.strictEqual(this.series.stub('notify').callCount, 2);
    assert.strictEqual(this.series.notify.getCall(1).args[0].action, 'clearPointHover');
});

QUnit.test('pointermove from axis element1 to out of the chart', function(assert) {
    const axisElement1 = this.renderer.g();
    const axisElement2 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);
    this.axis.coordsIn.withArgs(67, 45).returns(true);
    this.axis.coordsIn.withArgs(77, 45).returns(true);

    axisElement1.element['chart-data-argument'] = 'argument1';
    axisElement2.element['chart-data-argument'] = 'argument2';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement1.element }));

    $(document).trigger(getEvent('dxpointermove', { pageX: 500, pageY: 500 }));

    assert.strictEqual(this.series.stub('notify').callCount, 2);
    assert.strictEqual(this.series.notify.getCall(1).args[0].action, 'clearPointHover');
});

QUnit.test('pointermove from axis element to out of canvas', function(assert) {
    const axisElement1 = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement1.element['chart-data-argument'] = 'argument1';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement1.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 2, pageY: 50 }));

    assert.strictEqual(this.series.stub('notify').callCount, 2);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'clearPointHover');
});

QUnit.test('pointermove from hovered point to axis element', function(assert) {
    // arrange
    const point1 = createPoint(this.series, 'argument1');
    const axisElement1 = this.renderer.g();
    const axisElement2 = this.renderer.g();
    const pointElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement1.element['chart-data-argument'] = 'argument1';
    axisElement2.element['chart-data-argument'] = 'argument2';

    this.series.getNeighborPoint.withArgs(97, 35).returns(point1);

    pointElement.element['chart-data-point'] = point1;

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 40, target: pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement1.element }));

    delete pointElement.element['chart-data-point'];

    // assert
    assert.strictEqual(point1.clearHover.callCount, 1);
    assert.strictEqual(this.series.stub('notify').callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.ok(this.options.tooltip.stub('show').calledOnce, 'tooltip showing');
    assert.ok(this.options.tooltip.stub('hide').called, 'tooltip hiding');
    assert.ok(this.options.tooltip.stub('hide').calledAfter(this.options.tooltip.stub('show')), 'tooltip hiding after showing');
});

QUnit.test('pointermove from axis element to point', function(assert) {
    // arrange
    const point1 = createPoint(this.series, 'argument1');
    const axisElement1 = this.renderer.g();
    const axisElement2 = this.renderer.g();
    const pointElement = this.renderer.g();

    this.axis.coordsIn.withArgs(97, 45).returns(true);

    axisElement1.element['chart-data-argument'] = 'argument1';
    axisElement2.element['chart-data-argument'] = 'argument2';

    this.series.getNeighborPoint.withArgs(97, 35).returns(point1);

    pointElement.element['chart-data-point'] = point1;

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement1.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 40, target: pointElement.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    delete pointElement.element['chart-data-point'];

    // assert
    assert.strictEqual(this.series.stub('notify').callCount, 2);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'clearPointHover');
    assert.equal(this.series.stub('hover').callCount, 0, 'setHoverState');
    assert.ok(this.options.tooltip.stub('show').calledOnce, 'tooltip showing');
});

QUnit.test('without series', function(assert) {
    // arrange
    this.updateTracker(undefined);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxclick', { pageX: 80, pageY: 50 }));
    this.clock.tick(this.tracker.__trackerDelay);
    // Assert
    assert.ok(this.tracker);
});

QUnit.test('Stop current handling', function(assert) {
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);

    // act
    this.tracker.stopCurrentHandling();

    // assert
    assert.strictEqual(this.point.clearHover.callCount, 1, 'point unhovered');
    assert.ok(this.point.clearHover.calledAfter(this.point.hover));
    assert.ok(this.options.tooltip.stub('hide').called, 'tooltip hide');
    assert.equal(this.options.crosshair.hide.callCount, 1, 'crosshair hide');
});

QUnit.module('Update tracker', $.extend({}, chartEnvironment, {
    beforeEach() {
        chartEnvironment.beforeEach.call(this);
        this.tracker = this.createTracker(this.options);
    }
}));

QUnit.test('update with old series', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const series2 = createSeries();
    const series = [this.series, series2];

    this.series.stub('getPoints').returns([point]);
    series2.stub('getPoints').returns([]);

    this.updateTracker(series);
    this.options.tooltip.stub('hide').reset();
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // act
    this.tracker.updateSeries(series);

    // assert
    assert.notOk(this.series.clearHover.callCount);
    assert.strictEqual(this.options.tooltip.stub('hide').callCount, 0);
});

QUnit.test('update with old series when point is hovered', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const series = [this.series];

    this.series.getPointByCoord.returns(point);
    this.series.stub('getPoints').returns([point]);

    this.updateTracker(series);
    this.options.tooltip.stub('hide').reset();
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // act
    this.tracker.updateSeries(series, true);

    // assert
    assert.strictEqual(point.clearHover.callCount, 1);
    assert.strictEqual(this.options.tooltip.stub('hide').callCount, 2);
    assert.strictEqual(this.series.clearSelection.callCount, 1);
    assert.strictEqual(point.clearSelection.callCount, 1);
});

QUnit.test('update with old series when point is hovered. point was disposed', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const series = [this.series];

    this.series.getPointByCoord.returns(point);
    this.series.stub('getPoints').returns([point]);

    this.updateTracker(series);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);
    point.getOptions.returns(null);
    // act
    this.tracker.updateSeries(series);

    // assert
    assert.strictEqual(point.stub('clearHover').callCount, 0);
});

QUnit.test('Work after update with old series', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const series = [this.series];

    this.updateTracker(series);
    this.options.tooltip.stub('hide').reset();
    this.series.getNeighborPoint.withArgs(97, 45).returns(point);

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    this.updateTracker(series);

    this.series.getNeighborPoint.withArgs(97, 45).returns(null);

    this.series.hover.reset();
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // assert
    assert.strictEqual(this.series.hover.callCount, 1, 'setHoverState');

    const showTooltip = this.options.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.deepEqual(showTooltip.lastCall.args[0], point.getTooltipFormatObject());
    assert.deepEqual(showTooltip.lastCall.args[1], { x: 200 + 3, y: 100 + 5 });
    assert.deepEqual(showTooltip.lastCall.args[2], { target: point });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.equal(this.options.tooltip.stub('hide').callCount, 0, 'tooltip hiding');
});

QUnit.test('Emulate rendering chart in hidden container. Call UpdateSeries twice, but update only once during last updateTracker session', function(assert) {
    assert.expect(0);
    // arrange
    const series = [this.series];

    const tracker = new trackers.ChartTracker(this.options);
    tracker.updateSeries(series);

    // act
    tracker.updateSeries(series);
    tracker.update(this.options);
});

QUnit.test('update with new series', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const newSeries = createSeries();

    this.series.getNeighborPoint.returns(point);

    $(this.options.seriesGroup.element).trigger(getEvent('selectpoint'), point);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    this.options.tooltip.stub('hide').reset();
    this.options.tooltip.stub('show').reset();

    // act
    this.tracker.updateSeries([newSeries]);

    // assert
    assert.ok(this.options.tooltip.stub('hide').calledOnce, 'tooltip hiding');
});

QUnit.test('Work after update with new series', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const newSeries = createSeries();

    this.series.getNeighborPoint.withArgs(97, 45).returns(point);

    $(this.options.seriesGroup.element).trigger(getEvent('selectpoint'), point);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    newSeries.isNew = true;
    this.seriesGroup.element['chart-data-series'] = newSeries;


    this.tracker.updateSeries([newSeries]);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // Assert
    assert.equal(newSeries.hover.callCount, 1, 'setHoverState');
});

QUnit.test('T206518, update after hover series', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const newSeries = createSeries();

    this.series.getNeighborPoint.returns(point);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    newSeries.isNew = true;

    // act
    this.tracker.updateSeries([newSeries]);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    // assert
    assert.equal(this.series.getNeighborPoint.callCount, 1, 'getNeighborPoint');
});

QUnit.test('T206518, update before hover series', function(assert) {
    // arrange
    const point = createPoint(this.series);
    const newSeries = createSeries();

    this.series.getNeighborPoint.returns(point);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    // act
    this.tracker.updateSeries([newSeries]);
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    // assert
    assert.equal(this.series.getNeighborPoint.callCount, 1, 'getNeighborPoint');
});

QUnit.test('update axis', function(assert) {
    const axisElement = this.renderer.g();
    const axis = createAxis();

    axis.stub('coordsIn').withArgs(97, 45).returns(true);

    this.options.argumentAxis = axis;
    this.tracker.update(this.options);

    axisElement.element['chart-data-argument'] = 'argument1';

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: axisElement.element }));

    assert.ok(this.series.notify.calledOnce);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
});

QUnit.test('Disable tooltip', function(assert) {
    const point = createPoint(this.series);

    this.series.getNeighborPoint.returns(point);

    this.options.tooltip.stub('isEnabled').returns(false);

    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    assert.ok(!this.options.tooltip.stub('show').called);

});

QUnit.test('Prepared just once', function(assert) {
    const point = createPoint(this.series);
    const clickEvent = getEvent('dxclick', { pageX: 100, pageY: 50, target: this.seriesGroup.element });
    this.series.getPointByCoord.withArgs(97, 45).returns(point);

    // Act
    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(clickEvent);
    // Assert
    assert.equal(this.options.eventTrigger.withArgs('pointClick').callCount, 1);

});

QUnit.test('repairTooltip', function(assert) {
    // arrange
    const point = createPoint(this.series);

    $(this.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), point);
    this.options.tooltip.show.resetHistory();
    point.getTooltipParams.resetHistory();

    // act
    this.tracker.repairTooltip();

    // assert
    assert.ok(this.options.tooltip.show.calledOnce);
    assert.ok(point.getTooltipParams.calledOnce);
});

QUnit.test('clearHover', function(assert) {
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);

    this.tracker.clearHover();

    assert.equal(this.series.clearHover.callCount, 1);
});

QUnit.test('Can be disposed', function(assert) {
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, pointers: [], target: this.seriesGroup.element }));
    this.renderer.root.off.resetHistory();
    this.seriesGroup.off.resetHistory();

    // Act
    this.tracker.dispose();
    // Assert
    $(document).trigger(getEvent('dxpointermove'));
    $(document).trigger(getEvent('dxpointerdown', { pageX: 100, pageY: 50 }));
    $(document).trigger(getEvent('dxpointerup', { pageX: 100, pageY: 50 }));

    assert.ok(this.tracker);
    assert.strictEqual(this.renderer.root.off.callCount, 1);
    assert.strictEqual(this.renderer.root.off.lastCall.args[0], '.dxChartTracker');

    assert.strictEqual(this.seriesGroup.off.callCount, 1);
    assert.strictEqual(this.seriesGroup.off.lastCall.args[0], '.dxChartTracker');

});

QUnit.module('Chart tracker with disabled sticked mode', $.extend({}, chartEnvironment, {
    beforeEach() {
        chartEnvironment.beforeEach.call(this);
        this.options.stickyHovering = false;
        this.tracker = this.createTracker(this.options);
    }
}));

QUnit.test('dxpointermove on series', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    this.clock.tick(this.tracker.__trackerDelay);

    // Assert
    assert.equal(this.series.hover.callCount, 1);

    assert.equal(this.options.tooltip.stub('show').callCount, 0, 'tooltip show');
    assert.equal(this.options.crosshair.show.callCount, 0, 'crosshair[0] moved');

    assert.equal(this.point.stub('hover').callCount, 0);
});

QUnit.test('move on series between two point', function(assert) {
    // arrange
    this.series.getNeighborPoint.withArgs(97, 45).returns(this.point);
    this.point.stub('getCrosshairData').withArgs(92, 45).returns({ x: 92, y: 45, xValue: 10, yValue: 20 });

    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));
    this.clock.tick(this.tracker.__trackerDelay);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 95, pageY: 50, target: this.seriesGroup.element, pointerType: 'mouse' }));

    // Assert
    assert.ok(this.series.hover.calledOnce);
    assert.deepEqual(this.series.stub('updateHover').getCall(0).args, [97, 45], 'updateHover args, first time');
    assert.deepEqual(this.series.stub('updateHover').getCall(1).args, [92, 45], 'updateHover args, second time');

    assert.ok(!this.point.stub('hover').called);

    assert.equal(this.options.tooltip.stub('show').callCount, 0, 'tooltip show');

    assert.equal(this.options.crosshair.show.callCount, 0, 'crosshair[0] moved');
});

QUnit.test('dxpointermove over point', function(assert) {
    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));

    // assert
    assert.ok(!this.series.hover.called, 'series was not hoveres');
    assert.ok(this.point.hover.calledOnce, 'point hovered');
    assert.equal(this.options.tooltip.stub('show').callCount, 1, 'tooltip show');
});

QUnit.test('Mouseout from point - unhover point', function(assert) {
    this.series.getPointByCoord.withArgs(97, 45).returns(this.point);

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.pointElement.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 75 }));

    assert.strictEqual(this.point.stub('clearHover').callCount, 1);
});

QUnit.module('Root events. Pie chart', {
    beforeEach: function() {
        const that = this;

        that.clock = sinon.useFakeTimers();
        that.renderer = new vizMocks.Renderer();
        that.renderer.draw();
        that.series = createSeries();
        that.legend = createLegend();
        that.point = createPoint(that.series);

        that.seriesGroup = this.renderer.g();
        that.seriesGroup.element['chart-data-point'] = that.point;

        that.legend.stub('getOptions').returns({ hoverMode: 'allargumentpoints' });

        that.options = {
            seriesGroup: that.seriesGroup,
            tooltipEnabled: true,
            tooltip: createTooltip(),
            legend: that.legend,
            mainCanvas: {
                left: 0,
                right: 300,
                top: 0,
                bottom: 400
            },
            series: [that.series],
            renderer: that.renderer,
            eventTrigger: sinon.stub(),
            chart: {
                getStackedPoints: sinon.spy(function() { return 'points_by_stack_name'; })
            }
        };

        that.createTracker = function(options) {
            return createTracker('dxPieChart', options);
        };

        that.tracker = that.createTracker(that.options);
        that.options.tooltip.stub('hide').reset();
    },

    afterEach: function() {
        this.clock.restore();
        this.tracker.dispose && this.tracker.dispose();
        this.renderer.dispose();
        this.renderer = null;
        this.series = null;
        this.legend = null;
        this.axis = null;
        $(this.seriesGroup.element).remove();
        delete this.seriesGroup.element['chart-data-series'];
        delete this.seriesGroup.element['chart-data-point'];
        this.seriesGroup = this.canvases = this.options = this.tracker = this.point = null;
    }
});

QUnit.test('mousemove without point over', function(assert) {
    // arrange
    this.series.stub('getNeighborPoint').returns(this.point);

    // act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 102, pageY: 40 }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 2, pageY: 5 }));

    // assert
    assert.strictEqual(this.series.stub('hover').callCount, 0);
    assert.strictEqual(this.series.stub('hoverPoint').callCount, 0);
    assert.ok(!this.options.tooltip.stub('show').called);
    assert.ok(!this.series.stub('clearPointHover').called);
});

// T582760
QUnit.test('hover point after hover legend', function(assert) {
    this.legend.coordsIn.withArgs(87, 35).returns(true);
    this.legend.getItemByCoord.withArgs(87, 35).returns({ id: 0, argument: 'argument1', argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 90, pageY: 40 }));

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    assert.strictEqual(this.series.notify.callCount, 2);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'clearPointHover');
});

QUnit.test('mouseover on point', function(assert) {
    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    // Assert
    assert.strictEqual(this.series.stub('hover').callCount, 0);
    assert.ok(this.point.hover.calledOnce);
    assert.ok(!this.point.stub('clearHover').called);
    assert.ok(this.options.tooltip.stub('show').calledOnce);
    assert.ok(!this.options.tooltip.stub('hide').called);
});

QUnit.test('mousemove on point', function(assert) {
    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    // Assert
    assert.strictEqual(this.series.stub('hover').callCount, 0);
    assert.strictEqual(this.point.hover.callCount, 1);
    assert.ok(!this.series.stub('clearPointHover').called);
    assert.ok(this.options.tooltip.stub('show').calledOnce);
    assert.ok(!this.options.tooltip.stub('hide').called);
});

QUnit.test('mousemove on point. shared tooltip', function(assert) {
    this.options.tooltip.stub('isShared').returns(true);
    this.tracker.update(this.options);
    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    // Assert
    assert.strictEqual(this.series.stub('hover').callCount, 0);
    assert.strictEqual(this.point.hover.callCount, 1);
    assert.ok(!this.series.stub('clearPointHover').called);
    assert.ok(this.options.tooltip.stub('show').calledOnce);
    assert.ok(!this.options.tooltip.stub('hide').called);


    assert.deepEqual(this.options.chart.getStackedPoints.getCall(0).args, [this.point]);
    assert.deepEqual(this.point.getTooltipFormatObject.getCall(0).args, [this.options.tooltip, 'points_by_stack_name']);

    const showTooltip = this.options.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.deepEqual(showTooltip.lastCall.args[0], this.point.getTooltipFormatObject.getCall(0).returnValue);
    assert.deepEqual(showTooltip.lastCall.args[1], { x: 200 + 3, y: 100 + 5 });
    assert.deepEqual(showTooltip.lastCall.args[2], { target: this.point });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');
});

QUnit.test('mousemove on point, async tooltip render', function(assert) {
    this.options.tooltip.stub('show').returns(undefined);
    // Act
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));

    // Assert
    assert.equal(this.tracker.pointAtShownTooltip, undefined);

    this.options.tooltip.stub('show').lastCall.args[4](true);

    assert.equal(this.tracker.pointAtShownTooltip, this.point);
});

QUnit.test('mouseout from point', function(assert) {
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    // Act

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 120, pageY: 40 }));
    // Assert
    assert.ok(!this.series.stub('hover').called);
    assert.strictEqual(this.point.stub('hover').callCount, 1);
    assert.strictEqual(this.point.stub('clearHover').callCount, 1);

    assert.ok(this.options.tooltip.stub('show').calledOnce);
    assert.ok(this.options.tooltip.stub('hide').called);
});

QUnit.test('mousemove from hovered point to other point', function(assert) {
    const point1 = createPoint(this.series);
    const element = this.renderer.g();
    this.series.stub('getPointsByArg').withArgs(point1.argument).returns([point1]);
    this.series.stub('getPointsByArg').withArgs(this.point.argument).returns([this.point]);

    element.element['chart-data-point'] = point1;
    this.legendCallback = sinon.stub();
    this.legendCallback.withArgs(point1).returns('point1LegendCallback');
    this.legendCallback.withArgs(this.point).returns('pointLegendCallback');

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50, target: this.seriesGroup.element }));
    // Act

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 120, pageY: 40, target: element.element }));

    delete element.element['chart-data-point'];
    // Assert
    assert.equal(this.point.hover.callCount, 1, 'hover point');
    assert.equal(point1.hover.callCount, 1, 'hover point');
    assert.ok(point1.hover.lastCall.calledAfter(this.point.hover.lastCall));
    assert.ok(this.point.clearHover.calledOnce);
    assert.ok(this.options.tooltip.stub('show').called, 'tooltip showing');
    assert.ok(!this.options.tooltip.stub('hide').callOnce, 'tooltip hiding');
});

QUnit.test('mouseover on legend between legend items', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns(null);

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.ok(!this.series.stub('hover').called);
    assert.ok(!this.series.stub('hoverPoint').called);
});

QUnit.test('mouseover on legend item', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: 'argument1', argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].notifyLegend, true);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.fullState, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('mouseout from legend item', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: 'argument1', argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'clearPointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].notifyLegend, true);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.fullState, 0);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('mousedown on legend item', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: 'argument1', argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(this.renderer.root.element).trigger(getEvent('dxpointerdown', { pageX: 100, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 0);
});

QUnit.test('mouseout from chart after hover point on legend', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: 'argument1', argumentIndex: 11 });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(document).trigger(getEvent('dxpointermove', { pageX: 500, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'clearPointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('mousemove from legend item to another one', function(assert) {
    this.legend.coordsIn.returns(true);

    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: 'argument1', argumentIndex: 11 });
    this.legend.getItemByCoord.withArgs(97 + 10, 45 + 10).returns({ id: 0, argument: 'argument2', argumentIndex: 12 });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 110, pageY: 60 }));

    assert.strictEqual(this.series.notify.callCount, 2);

    assert.strictEqual(this.series.notify.getCall(0).args[0].action, 'clearPointHover');
    assert.strictEqual(this.series.notify.getCall(0).args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.getCall(0).args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.getCall(0).args[0].target.getOptions().hoverMode, 'allargumentpoints');

    assert.strictEqual(this.series.notify.getCall(1).args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.getCall(1).args[0].target.argumentIndex, 12);
    assert.strictEqual(this.series.notify.getCall(1).args[0].target.argument, 'argument2');
    assert.strictEqual(this.series.notify.getCall(1).args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('mousemove on item of legend, legend hoverMode is \'none\'', function(assert) {
    this.legend.getOptions.returns({ hoverMode: 'none' });
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({
        id: 0,
        argument: 'argument1',
        argumentIndex: 11
    });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'none');
});

QUnit.test('mouseout from chart after hover point on legend. legend hoverMode is none', function(assert) {
    this.legend.getOptions.returns({ hoverMode: 'none' });
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: 'argument1' });

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    this.series.notify.reset();
    $(document).trigger(getEvent('dxpointermove', { pageX: 500, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'clearPointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].id, undefined);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'none');
});

QUnit.test('mouseover on legend item, not valid hoverMode = markpoint', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ id: 0, argument: 'argument1', argumentIndex: 11 });
    this.legend.getOptions.returns({ hoverMode: 'markpoint' });
    const point1 = createPoint(this.series);
    point1.index = 3;

    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));

    assert.strictEqual(this.series.notify.callCount, 1);
    assert.strictEqual(this.series.notify.lastCall.args[0].action, 'pointHover');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argumentIndex, 11);
    assert.strictEqual(this.series.notify.lastCall.args[0].target.argument, 'argument1');
    assert.strictEqual(this.series.notify.lastCall.args[0].target.getOptions().hoverMode, 'allargumentpoints');
});

QUnit.test('without series', function(assert) {
    this.options.series = undefined;
    this.tracker.update(this.options);
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 100, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxpointermove', { pageX: 80, pageY: 50 }));
    $(this.renderer.root.element).trigger(getEvent('dxclick', { pageX: 80, pageY: 50 }));
    // Assert
    assert.ok(this.tracker);
});

QUnit.test('point click', function(assert) {
    const event = getEvent('dxclick', { pageX: 80, pageY: 50, target: this.seriesGroup.element });
    $(this.renderer.root.element).trigger(event);

    assert.ok(this.options.eventTrigger.withArgs('pointClick').calledOnce);
    strictEqualForAllFields(assert, this.options.eventTrigger.withArgs('pointClick').lastCall.args[1], { target: this.point, event: event });
});

QUnit.test('legend item click. One series', function(assert) {
    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ argumentIndex: 0, argument: 'argument1' });
    this.series.stub('getPointsByKeys').withArgs('argument1', 0).returns([this.point]);

    const event = getEvent('dxclick', { pageX: 100, pageY: 50 });

    $(this.renderer.root.element).trigger(event);

    const legendClick = this.options.eventTrigger.withArgs('legendClick');

    // assert
    assert.ok(legendClick.calledOnce, 'legendClick');
    assert.strictEqual(legendClick.lastCall.args[1].target, 'argument1', 'argument');
    assert.deepEqual(legendClick.lastCall.args[1].points, [this.point], 'points');
    assert.strictEqual(legendClick.lastCall.args[1].event, event, 'event');
});

QUnit.test('legend item click, several series', function(assert) {
    // arrange
    const argument = 'arg';
    const extraSeries = createSeries();
    const points = ['firstPoint', 'secondPoint'];

    this.legend.coordsIn.withArgs(97, 45).returns(true);
    this.legend.getItemByCoord.withArgs(97, 45).returns({ argumentIndex: 0, argument: argument });
    this.series.stub('getPointsByKeys').withArgs(argument, 0).returns(['firstPoint']);
    extraSeries.stub('getPointsByKeys').withArgs(argument, 0).returns(['secondPoint']);

    this.options.series = [this.series, extraSeries];

    this.tracker = this.createTracker(this.options);

    const event = getEvent('dxclick', { pageX: 100, pageY: 50 });

    // act
    $(this.renderer.root.element).trigger(event);
    const legendClick = this.options.eventTrigger.withArgs('legendClick');

    // assert
    assert.ok(legendClick.calledOnce, 'legendClick');
    assert.strictEqual(legendClick.lastCall.args[1].target, argument, 'argument');
    assert.deepEqual(legendClick.lastCall.args[1].points, points, 'points');
    assert.strictEqual(legendClick.lastCall.args[1].event, event, 'event');
    assert.ok(!this.options.eventTrigger.withArgs('pointClick').called, 'pointClick');
});

QUnit.module('clean tracker on user event', {
    beforeEach: function() {
        const that = this;

        const clean = function() {
            that.point1.options = null;
            that.point2.options = null;
            that.point3.options = null;
            that.point4.options = null;
            that.series1.options = null;
            that.series2.options = null;
            that.tracker._clean();
        };

        const trackerEnvironment = this.that = createCompleteTracker({
            tooltipShown: clean,
            tooltipHidden: clean,
            events: {
                seriesClick: clean,
                pointClick: clean,
                argumentAxisClick: clean,
                seriesSelected: clean,
                pointSelected: clean,
                pointHover: clean,
                seriesHover: clean
            }
        });
        trackerEnvironment.point1.name = 'p1';
        trackerEnvironment.point2.name = 'p2';
        trackerEnvironment.point3.name = 'p3';
        trackerEnvironment.point4.name = 'p4';
        trackerEnvironment.tracker.selectedPoint = that.point4;
        trackerEnvironment.tracker.selectedSeries = that.series2;
        trackerEnvironment.tracker.hoveredPoint = that.point2;
        trackerEnvironment.tracker.hoveredSeries = that.series1;
        trackerEnvironment.tracker.pointAtShownTooltip = that.point2;
    }
});

QUnit.test('seriesClick', function(assert) {
    $(this.that.options.seriesTrackerGroup.element).trigger(getEvent('click'));
    assert.ok(this.that.tracker);
});

QUnit.test('tooltipHidden', function(assert) {
    $(this.that.options.seriesGroup.element).trigger(getEvent('hidepointtooltip'), this.that.point1);
    assert.ok(this.that.tracker);
});

QUnit.test('tooltipShown - tooltipHidden', function(assert) {
    $(this.that.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.that.point1);
    $(this.that.options.seriesGroup.element).trigger(getEvent('hidepointtooltip'));

    assert.ok(this.that.tracker);
});

QUnit.test('tooltip hidden on point unhover, pointHover', function(assert) {
    const that = this;
    that.that.tracker.showHoldTooltip = false;

    // act
    $(that.that.options.seriesTrackerGroup.element).trigger(getEvent('mouseover'));
    $(that.that.options.seriesTrackerGroup.element).trigger(getEvent('mousemove', { pageX: 15, pageY: 20 }));

    // act
    assert.ok(that.that.tracker);
});

QUnit.test('pointClick', function(assert) {
    $(this.that.options.markerTrackerGroup.element).trigger(getEvent('click'));
    assert.ok(this.that.tracker);
});

QUnit.test('argumentAxisClick', function(assert) {
    $(this.that.axis._axisElementsGroup.element).trigger(getEvent('click'));
    assert.ok(this.that.tracker);
});

QUnit.module('Tooltip', {
    beforeEach: function() {
        this.environment = createCompleteTracker();

        this.clock = sinon.useFakeTimers();
        this.tooltip = this.environment.options.tooltip;
        this.tracker = this.environment.tracker;
    },
    afterEach: function() {
        this.clock.restore();
        this.tracker.dispose();
        this.environment = null;
    }
});

QUnit.test('show Tooltip event. TooltipShown fired', function(assert) {
    this.tooltip.stub('hide').reset();
    this.environment.options.seriesGroup.trigger(getEvent('showpointtooltip'), this.environment.point1);

    const showTooltip = this.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.deepEqual(showTooltip.lastCall.args[0], { valueText: 'pointValue' });
    assert.deepEqual(showTooltip.lastCall.args[1], this.environment.point1.getTooltipParams.lastCall.returnValue);
    assert.deepEqual(showTooltip.lastCall.args[2], { target: this.environment.point1 });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.ok(!this.tooltip.stub('hide').called);
    assert.equal(this.tracker.pointAtShownTooltip, this.environment.point1);
});

QUnit.test('Tooltip is disabled. Show tooltip on point, stopCurrentHandling, show tooltip on same point. TooltipShown fired', function(assert) {
    this.tooltip.stub('isEnabled').returns(false);

    this.environment.options.seriesGroup.trigger(getEvent('showpointtooltip'), this.environment.point1);

    this.tracker.stopCurrentHandling();
    this.tooltip.stub('show').reset();

    this.environment.options.seriesGroup.trigger(getEvent('showpointtooltip'), this.environment.point1);

    assert.deepEqual(this.tooltip.stub('show').lastCall.args[2], { target: this.environment.point1 });
});

QUnit.test('show Tooltip event when there is tooltip on another point. TooltipHidden fired, TooltipShown fired', function(assert) {
    this.environment.options.seriesGroup.trigger(getEvent('showpointtooltip'), this.environment.point2);
    this.tooltip.stub('hide').resetHistory();
    this.tooltip.stub('show').resetHistory();

    // act
    this.environment.options.seriesGroup.trigger(getEvent('showpointtooltip'), this.environment.point1);

    assert.ok(this.tooltip.stub('hide').calledOnce);
    assert.deepEqual(this.tooltip.stub('hide').lastCall.args, [false]);

    const showTooltip = this.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.deepEqual(showTooltip.lastCall.args[0], { valueText: 'pointValue' });
    assert.deepEqual(showTooltip.lastCall.args[1], this.environment.point1.getTooltipParams.lastCall.returnValue);
    assert.deepEqual(showTooltip.lastCall.args[2], { target: this.environment.point1 });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.equal(this.tracker.pointAtShownTooltip, this.environment.point1);
});

QUnit.test('show Tooltip event when point is invisible, TooltipShown not fired', function(assert) {
    this.environment.point1.isVisible = function() { return false; };
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);

    assert.ok(!this.tooltip.stub('show').called);
});

QUnit.test('show Tooltip event without text', function(assert) {
    this.tooltip.stub('show').returns(false);

    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);

    const showTooltip = this.tooltip.stub('show');
    assert.equal(showTooltip.callCount, 1, 'tooltip showing was calling once');
    assert.deepEqual(showTooltip.lastCall.args[0], { valueText: 'pointValue' });
    assert.deepEqual(showTooltip.lastCall.args[1], this.environment.point1.getTooltipParams.lastCall.returnValue);
    assert.deepEqual(showTooltip.lastCall.args[2], { target: this.environment.point1 });
    assert.equal(showTooltip.lastCall.args[3], undefined);
    assert.equal(typeof showTooltip.lastCall.args[4], 'function');

    assert.notEqual(this.tracker.pointAtShownTooltip, this.environment.point1);
});

QUnit.test('hide Tooltip event. TooltipHidden fired', function(assert) {
    this.tooltip.stub('hide').reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);
    $(this.environment.options.seriesGroup.element).trigger(getEvent('hidepointtooltip'), this.environment.point1);

    assert.ok(this.tooltip.stub('hide').calledOnce);
    assert.deepEqual(this.tooltip.stub('hide').lastCall.args, [true]);
});

QUnit.test('tooltipShown call', function(assert) {
    this.tooltip.stub('show').reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);

    assert.equal(this.tooltip.show.callCount, 1);
    strictEqualForAllFields(assert, this.tooltip.show.lastCall.args[2], { target: this.environment.point1 });
});

QUnit.test('tooltipHidden, tooltip not shown - not call', function(assert) {
    this.tooltip.stub('hide').reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent('hidepointtooltip'), this.environment.point1);

    assert.equal(this.tooltip.hide.callCount, 0);
});

QUnit.test('tooltipHidden from chart', function(assert) {
    this.tooltip.stub('hide').reset();
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);
    $(this.environment.options.seriesGroup.element).trigger(getEvent('hidepointtooltip'));

    assert.equal(this.tooltip.hide.callCount, 1);
    assert.deepEqual(this.tooltip.hide.lastCall.args, [true]);
});

QUnit.test('repairTooltip. Point got invisible, tooltipHidden not fired', function(assert) {
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);
    this.environment.point1.isVisible = function() { return false; };
    this.tooltip.stub('hide').reset();
    this.tooltip.stub('show').reset();

    // act
    this.tracker.repairTooltip();

    assert.equal(this.tooltip.hide.callCount, 1);
    assert.deepEqual(this.tooltip.hide.lastCall.args, [false]);
    assert.equal(this.tooltip.stub('show').callCount, 0);
});

QUnit.test('repairTooltip. Point got visible after invisible, tooltipShown fired', function(assert) {
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);
    this.environment.point1.isVisible = function() { return false; };
    this.tracker.repairTooltip();
    this.environment.point1.isVisible = function() { return true; };
    this.tooltip.stub('hide').reset();
    this.tooltip.stub('show').reset();

    // act
    this.tracker.repairTooltip();

    assert.equal(this.tooltip.show.callCount, 1);
    assert.strictEqual(this.tooltip.show.lastCall.args[2].target, this.environment.point1);
    assert.equal(this.tooltip.stub('hide').callCount, 0);
});

QUnit.test('show tooltip on point. Point with tooltip is invisible', function(assert) {
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point1);
    this.environment.point1.isVisible = function() { return false; };
    this.tracker.repairTooltip();
    this.tooltip.stub('hide').reset();
    this.tooltip.stub('show').reset();

    // act
    $(this.environment.options.seriesGroup.element).trigger(getEvent('showpointtooltip'), this.environment.point2);

    assert.equal(this.tooltip.hide.callCount, 1);
    assert.deepEqual(this.tooltip.hide.lastCall.args, [false]);

    assert.equal(this.tooltip.show.callCount, 1);
    strictEqualForAllFields(assert, this.tooltip.show.lastCall.args[2], { target: this.environment.point2 });

});

// Utility functions
function createCompleteTracker(options) {
    const that = {};
    const renderer = new vizMocks.Renderer();
    const legend = new vizMocks.Legend();
    const series1 = createSeries();
    const series2 = createSeries();
    const point1 = createPoint(series1, 1);
    const point2 = createPoint(series1, 2);
    const point3 = createPoint(series2, 1);
    const point4 = createPoint(series2, 2);

    series1.stub('getPoints').returns([point1, point2]);
    series2.stub('getPoints').returns([point3, point4]);

    options = options || {};
    renderer.draw();

    that.axis = options.axis || new MockAxis({ renderer: renderer });
    that.axis.updateOptions({ hoverMode: 'allargumentpoints', mockTickValues: [1, 2, 4], argument: 1 });
    that.point1 = point1;
    that.point2 = point2;
    that.point3 = point3;
    that.point4 = point4;
    that.series1 = series1;
    that.series2 = series2;

    legend.getActionCallback = sinon.stub().returns('legend callback');
    that.options = {
        argumentAxis: that.axis,
        series: [series1, series2],
        seriesTrackerGroup: renderer.g(),
        markerTrackerGroup: renderer.g(),
        seriesGroup: renderer.g(),
        legendGroup: renderer.g(),
        tooltip: createTooltip(),
        legend: legend,
        renderer: renderer,
        eventTrigger: sinon.stub()
    };

    that.options.seriesTrackerGroup.element['chart-data-series'] = series1;
    that.options.markerTrackerGroup.element['chart-data-point'] = point1;
    that.options.seriesGroup.element['chart-data-series'] = series1;

    that.options = $.extend(true, that.options, options);

    that.tracker = createTracker('dxChart', that.options);

    that.eventsConsts = eventsConsts;
    that.tracker.__legend = legend;
    return that;
}

function createTracker(type, options) {
    const tracker = new trackers[type === 'dxPieChart' ? 'PieTracker' : 'ChartTracker'](options);
    tracker.updateSeries(options.series);
    tracker.update(options);
    tracker.setCanvases(options.mainCanvas, options.canvases);
    return tracker;
}
