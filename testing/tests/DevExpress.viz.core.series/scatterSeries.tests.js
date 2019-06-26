import $ from "jquery";
import vizMocks from "../../helpers/vizMocks.js";
import { noop } from "core/utils/common";
import pointModule from "viz/series/points/base_point";
import labelModule from "viz/series/points/label";
import SeriesModule from "viz/series/base_series";
const Series = SeriesModule.Series;
import { insertMockFactory, MockAxis, restoreMockFactory } from "../../helpers/chartMocks.js";

var createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    var renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
        containerBackgroundColor: "containerColor",
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
            displayMode: "auto"
        },
        hoverStyle: {},
        selectionStyle: {},
        hoverMode: "excludePoints",
        selectionMode: "excludePoints",
        widgetType: "chart"
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
        markerTrackerGroup: renderer.g(),
        trackersGroup: renderer.g(),
        valueAxis: new MockAxis({ renderer: renderer }),
        argumentAxis: new MockAxis({ renderer: renderer })
    }, renderSettings);

    renderer.stub("g").reset();
    return new Series(renderSettings, options);
};

var createPoint = function() {
    var stub = sinon.createStubInstance(pointModule.Point);
    stub.argument = 1;
    stub.hasValue.returns(true);
    stub.hasCoords.returns(true);
    stub.isInVisibleArea.returns(true);
    stub.getCenterCoord.returns({ x: "center_x", y: "center_y" });
    stub._label = sinon.createStubInstance(labelModule.Label);
    return stub;
};

var mockPoints = [createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint(), createPoint()];

function resetStub(stub) {
    $.each(stub, function(_, stubFunc) {
        stubFunc && stubFunc.reset && stubFunc.reset();
    });
}

var environment = {
    beforeEach: function() {
        insertMockFactory();
        var mockPointIndex = 0;
        this.renderer = new vizMocks.Renderer();
        this.seriesGroup = this.renderer.g();
        this.data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }];
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data) {
            var stub = mockPoints[mockPointIndex++];
            data = data || {};
            stub.argument = data.argument || 1;
            stub.value = data.value || 11;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            resetStub(stub);
            resetStub(stub._label);

            stub._label.getVisibility = sinon.stub();
            return stub;
        });
    },
    afterEach: function() {
        this.createPoint.restore();
        restoreMockFactory();
    }
};

var checkTwoGroups = function(assert, series) {
        var parentGroup = series._group,
            renderer = series._renderer,
            labelsGroup = series._extGroups.labelsGroup;
        assert.ok(parentGroup, "series created without group");

        assert.equal(renderer.stub("g").callCount, 3);
        assert.equal(renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
        assert.equal(renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
        assert.equal(renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");

        assert.equal(parentGroup.children.length, 1, "groups in series group");
        assert.equal(parentGroup.children[0], series._markersGroup);
        assert.equal(labelsGroup.children.length, 1);
        assert.equal(labelsGroup.children[0], series._labelsGroup);
    },
    seriesType = "scatter";

(function ScatterSeries() {

    QUnit.module("Points creation", environment);

    QUnit.test("Creation simple point", function(assert) {
        var series = createSeries({ type: "line", label: { visible: false } }),
            data = [{ arg: 1, val: 3 }],
            points;

        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.ok(points, "Points should be created");
        assert.equal(points.length, 1, "Series should have one point");
        assert.equal(this.createPoint.firstCall.args[0], series, "series should be correct");
        assert.equal(this.createPoint.firstCall.args[1].argument, 1, "Argument should be correct");
        assert.equal(this.createPoint.firstCall.args[1].value, 3, "Value should be correct");
    });

    QUnit.test("Point should have correct index", function(assert) {
        var series = createSeries({ type: "scatter", label: { visible: false } }),
            data = [{ arg: 1, val: 10 }, { arg: 2, val: undefined }, { arg: 3, val: 20 }];

        series.updateData(data);
        series.createPoints();

        assert.ok(series.getAllPoints(), "Series points should be created");
        assert.equal(series.getAllPoints().length, 2, "Series should have 1 point");

        assert.equal(this.createPoint.getCall(0).args[1].index, 0, "index");
        assert.equal(this.createPoint.getCall(0).args[1].argument, 1, "argument");

        assert.equal(this.createPoint.getCall(1).args[1].index, 1, "index");
        assert.equal(this.createPoint.getCall(1).args[1].argument, 3, "argument");
    });

    QUnit.test("IncidentOccurred. Data without value field", function(assert) {
        const data = [{ arg: 1 }, { arg: 2 }];
        const incidentOccurred = sinon.spy();
        const options = { type: "scatter", argumentField: "arg", valueField: "val", label: { visible: false } };
        const series = createSeries(options, {
            incidentOccurred: incidentOccurred
        });

        series.updateData(data);
        series.createPoints();

        assert.strictEqual(incidentOccurred.callCount, 1);
        assert.strictEqual(incidentOccurred.lastCall.args[0], "W2002");
    });

    QUnit.module("Series with valueErrorBar", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [
                { arg: "A", val: 2, lowErrorValue: 0, highErrorValue: 1 },
                { arg: "B", val: 4, lowErrorValue: 0, highErrorValue: 1 },
                { arg: "C", val: 4, lowErrorValue: 0, highErrorValue: 1 },
                { arg: "D", val: 4, lowErrorValue: 0, highErrorValue: 1 },
                { arg: "E", val: 5, lowErrorValue: 0, highErrorValue: 1 },
                { arg: "F", val: 5, lowErrorValue: 0, highErrorValue: 1 },
                { arg: "G", val: 7, lowErrorValue: 0, highErrorValue: 1 },
                { arg: "I", val: 9, lowErrorValue: 0, highErrorValue: 1 }
            ];
            this.options = {
                type: "scatter",
                valueErrorBar: {
                    lowValueField: "lowErrorValue",
                    highValueField: "highErrorValue"
                }
            };
        },
        afterEach: function() {
            environment.afterEach.call(this);
        }

    });

    QUnit.test("Creation simple point with valueErrorBar", function(assert) {
        var series = createSeries(this.options),
            data = [{ arg: 1, val: 2, lowErrorValue: 0, highErrorValue: 4, "originallowErrorValue": 0, "originalhighErrorValue": 4 }],
            points;

        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.equal(points.length, 1, "created one point");
        assert.equal(this.createPoint.firstCall.args[1].lowError, 0, "lowError passed to point");
        assert.equal(this.createPoint.firstCall.args[1].highError, 4, "highError passed to point");
    });

    QUnit.test("Creation simple point with valueErrorBar. discrete data", function(assert) {
        var series = createSeries(this.options),
            data = [{ arg: 1, val: "q2", lowErrorValue: 0, highErrorValue: 4 }],
            points;

        series.updateDataType({ valueAxisType: "discrete" });
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.equal(points.length, 1, "created one point");
        assert.equal(this.createPoint.firstCall.args[1].lowError, undefined, "lowError passed to point");
        assert.equal(this.createPoint.firstCall.args[1].highError, undefined, "highError passed to point");
    });

    QUnit.test("Creation simple point with valueErrorBar. logarithmic data", function(assert) {
        var series = createSeries(this.options),
            data = [{ arg: 1, val: 5, lowErrorValue: 0, highErrorValue: 4 }],
            points;

        series.updateDataType({ valueAxisType: "logarithmic" });
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.equal(points.length, 1, "created one point");
        assert.equal(this.createPoint.firstCall.args[1].lowError, undefined, "lowError passed to point");
        assert.equal(this.createPoint.firstCall.args[1].highError, undefined, "highError passed to point");
    });

    QUnit.test("Creation simple point with valueErrorBar. datetime data", function(assert) {
        var series = createSeries(this.options),
            data = [{ arg: 1, val: new Date(2011, 1, 1), lowErrorValue: new Date(2011, 0, 31), highErrorValue: new Date(2011, 1, 10) }],
            points;

        series.updateDataType({ valueType: "datetime" });
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.equal(points.length, 1, "created one point");
        assert.equal(this.createPoint.firstCall.args[1].lowError, undefined, "lowError passed to point");
        assert.equal(this.createPoint.firstCall.args[1].highError, undefined, "highError passed to point");
    });

    QUnit.test("Creation simple point with valueErrorBar and custom lowValueField & highValueField", function(assert) {
        var series = createSeries({ type: "line", valueErrorBar: { lowValueField: "customLow", highValueField: "customHigh" } }),
            data = [{ arg: 1, val: 2, customLow: 0, customHigh: 4, "originalcustomLow": 0, "originalcustomHigh": 4 }],
            points;

        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.equal(points.length, 1, "created one point");
        assert.equal(this.createPoint.firstCall.args[1].lowError, 0, "lowError passed to point");
        assert.equal(this.createPoint.firstCall.args[1].highError, 4, "highError passed to point");
    });

    QUnit.test("Create series with fixed valueErrorBar value", function(assert) {
        this.options.valueErrorBar.value = 2;
        this.options.valueErrorBar.type = "fixed";
        var series = createSeries(this.options);

        series.updateData(this.data.slice(0, 3));
        series.createPoints();

        assert.strictEqual(this.createPoint.callCount, 3);

        assert.strictEqual(this.createPoint.getCall(0).args[1].highError, 4, "point0 highError");
        assert.strictEqual(this.createPoint.getCall(0).args[1].lowError, 0, "point0 lowError");

        assert.strictEqual(this.createPoint.getCall(1).args[1].highError, 6, "point1 highError");
        assert.strictEqual(this.createPoint.getCall(1).args[1].lowError, 2, "point1 lowError");

        assert.strictEqual(this.createPoint.getCall(2).args[1].highError, 6, "point2 highError");
        assert.strictEqual(this.createPoint.getCall(2).args[1].lowError, 2, "point2 lowError");
    });

    QUnit.test("Create series with fixed valueErrorBar value (without set type)", function(assert) {
        this.options.valueErrorBar.value = 2;
        var series = createSeries(this.options);

        series.updateData(this.data.slice(0, 3));
        series.createPoints();

        assert.strictEqual(this.createPoint.callCount, 3);

        assert.strictEqual(this.createPoint.getCall(0).args[1].highError, 1, "point0 highError");
        assert.strictEqual(this.createPoint.getCall(0).args[1].lowError, 0, "point0 lowError");

        assert.strictEqual(this.createPoint.getCall(1).args[1].highError, 1, "point1 highError");
        assert.strictEqual(this.createPoint.getCall(1).args[1].lowError, 0, "point1 lowError");

        assert.strictEqual(this.createPoint.getCall(2).args[1].highError, 1, "point2 highError");
        assert.strictEqual(this.createPoint.getCall(2).args[1].lowError, 0, "point2 lowError");
    });

    QUnit.test("Create series with percent valueErrorBar value", function(assert) {
        this.options.valueErrorBar.value = 10;
        this.options.valueErrorBar.type = "percent";
        var series = createSeries(this.options);

        series.updateData(this.data.slice(0, 3));
        series.createPoints();

        assert.strictEqual(this.createPoint.callCount, 3);

        assert.strictEqual(this.createPoint.getCall(0).args[1].highError, 2.2, "point0 highError");
        assert.strictEqual(this.createPoint.getCall(0).args[1].lowError, 1.8, "point0 lowError");

        assert.strictEqual(this.createPoint.getCall(1).args[1].highError, 4.4, "point1 highError");
        assert.strictEqual(this.createPoint.getCall(1).args[1].lowError, 3.6, "point1 lowError");

        assert.strictEqual(this.createPoint.getCall(2).args[1].highError, 4.4, "point2 highError");
        assert.strictEqual(this.createPoint.getCall(2).args[1].lowError, 3.6, "point2 lowError");
    });

    QUnit.test("Create series with 'stdDeviation' valueErrorBar value", function(assert) {
        this.options.valueErrorBar.type = "sTdDeviation";
        this.options.valueErrorBar.value = 2;
        var series = createSeries(this.options);

        series.updateData(this.data);
        series.createPoints();

        assert.strictEqual(this.createPoint.callCount, 8);

        $.each(this.createPoint.getCalls(), function(i, call) {
            assert.strictEqual(call.args[1].highError, 9, "point" + i + " highError");
            assert.strictEqual(call.args[1].lowError, 1, "point" + i + " lowError");
        });
    });

    QUnit.test("Create series with 'variance' valueErrorBar value", function(assert) {
        this.options.valueErrorBar.type = "Variance";
        this.options.valueErrorBar.value = 2;
        var that = this,
            series = createSeries(this.options);

        series.updateData(this.data);
        series.createPoints();

        assert.strictEqual(this.createPoint.callCount, 8);

        $.each(this.createPoint.getCalls(), function(i, call) {
            assert.strictEqual(call.args[1].highError, that.data[i].val + 8, "point" + i + " highError");
            assert.strictEqual(call.args[1].lowError, that.data[i].val - 8, "point" + i + " lowError");
        });
    });

    QUnit.test("Create series with 'standardError' valueErrorBar value", function(assert) {
        this.options.valueErrorBar.type = "stdError";
        this.options.valueErrorBar.value = 2;
        var that = this,
            series = createSeries(this.options);

        series.updateData(this.data);

        series.createPoints();

        assert.strictEqual(this.createPoint.callCount, 8);

        $.each(this.createPoint.getCalls(), function(i, call) {
            assert.strictEqual(call.args[1].highError.toFixed(2), (that.data[i].val + 1.41).toFixed(2), "point" + i + " highError");
            assert.strictEqual(call.args[1].lowError.toFixed(2), (that.data[i].val - 1.41).toFixed(2), "point" + i + " lowError");
        });
    });

    QUnit.test("Create series with unknown valueErrorBar type", function(assert) {
        this.options.valueErrorBar.type = "a";
        this.options.valueErrorBar.value = 10;
        var series = createSeries(this.options);

        series.updateData(this.data);
        series.createPoints();

        assert.strictEqual(this.createPoint.callCount, 8);

        $.each(this.createPoint.getCalls(), function(i, call) {
            assert.strictEqual(call.args[1].highError, 1, "point" + i + " highError");
            assert.strictEqual(call.args[1].lowError, 0, "point" + i + " lowError");
        });
    });

    QUnit.module("Scatter series. Draw", environment);

    var checkGroups = checkTwoGroups;

    QUnit.test("Draw without data", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, {
            renderer: this.renderer,
            seriesGroup: this.seriesGroup
        });
        // act
        series.draw(false);
        // assert

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data without animation", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, {
            renderer: this.renderer,
            seriesGroup: this.seriesGroup
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
        assert.strictEqual(series._markersGroup._stored_settings.opacity, 1);
        $.each(series._points, function(i, p) {
            assert.equal(p.animate.callCount, 0, i + " point draw without animate");
        });
    });

    QUnit.test("Draw simple data with animation", function(assert) {
        var series = createSeries({
                type: seriesType,
                point: { visible: false }
            }, {
                renderer: this.renderer,
                seriesGroup: this.seriesGroup
            }),
            complete = noop;
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
            assert.equal(p.animate.callCount, 1, i + " point draw with animate");
            assert.equal(p.animate.firstCall.args.length, 2, "call with params");
            if(i !== series._points.length - 1) {
                assert.equal(p.animate.firstCall.args[0], undefined);
            } else {
                complete = p.animate.firstCall.args[0];
                assert.ok(complete, "complete function");
            }
            assert.deepEqual(p.animate.firstCall.args[1], { translateX: i + 1, translateY: (i + 1) * 10 });
        });
        complete();
        assert.deepEqual(series._labelsGroup.stub("animate").lastCall.args[0], { opacity: 1 });
        assert.deepEqual(series._labelsGroup.stub("animate").lastCall.args[1], { duration: 400 });
    });

    QUnit.test("Draw simple data with animation. Point out visible area", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false }
        }, {
            renderer: this.renderer,
            seriesGroup: this.seriesGroup
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series._points[2].isInVisibleArea.returns(false);
        // act
        series.draw(true);
        // assert
        assert.ok(!series.getPointByPos(2).animate.called);
        assert.ok(series.getPointByPos(0).animate.called);
        assert.ok(series.getPointByPos(1).animate.called);
        assert.ok(series.getPointByPos(3).animate.called);
    });

    QUnit.test("Draw series when errorBars enabled. forceClipping is false.", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            valueErrorBar: {
                displayMode: "all",
                type: "stdError",
                color: "red",
                lineWidth: 3,
                opacity: 0.7
            }
        }, {
            renderer: this.renderer,
            seriesGroup: this.seriesGroup
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.setClippingParams("clipId", "wideClipId", false);

        // act
        series.draw(false);
        // assert

        assert.equal(this.renderer.stub("g").callCount, 4);
        assert.equal(this.renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
        assert.equal(this.renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
        assert.equal(this.renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");
        assert.equal(this.renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-error-bars");

        var parentGroup = this.renderer.stub("g").getCall(0).returnValue,
            errorBarGroup = this.renderer.stub("g").getCall(3).returnValue;

        assert.equal(parentGroup.children.length, 2, "groups in series group");
        assert.equal(parentGroup.children[0], this.renderer.stub("g").getCall(1).returnValue);
        assert.equal(parentGroup.children[1], this.renderer.stub("g").getCall(3).returnValue);


        assert.deepEqual(errorBarGroup.attr.lastCall.args, [{
            "class": "dxc-error-bars",
            "clip-path": "wideClipId",
            "opacity": 0.7,
            "sharp": true,
            "stroke": "red",
            "stroke-linecap": "square",
            "stroke-width": 3
        }]);

        $.each(series._points, function(i, p) {
            assert.equal(p.draw.lastCall.args[1].errorBars, errorBarGroup, "correct errorBar group pass to point " + i);
            assert.equal(p.animate.callCount, 0, i + " point draw without animate");
        });
    });

    QUnit.test("Create error bar group when series is animated", function(assert) {
        var series = createSeries({
                type: seriesType,
                point: { visible: false },
                valueErrorBar: {
                    displayMode: "all",
                    lowValueField: "fieldName",
                    color: "red",
                    lineWidth: 3,
                    opacity: 0.7
                }
            }, {
                renderer: this.renderer,
                seriesGroup: this.seriesGroup
            }),
            completeAnimation,
            points;
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.setClippingParams("clipId", "wideClipId", false);

        // act
        series.draw(true);
        // assert

        assert.equal(this.renderer.stub("g").callCount, 4);
        assert.equal(this.renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
        assert.equal(this.renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
        assert.equal(this.renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");
        assert.equal(this.renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-error-bars");

        var parentGroup = this.renderer.stub("g").getCall(0).returnValue,
            errorBarGroup = this.renderer.stub("g").getCall(3).returnValue;

        assert.equal(parentGroup.children.length, 2, "groups in series group");
        assert.equal(parentGroup.children[0], this.renderer.stub("g").getCall(1).returnValue);
        assert.equal(parentGroup.children[1], this.renderer.stub("g").getCall(3).returnValue);


        assert.deepEqual(errorBarGroup.attr.lastCall.args, [{
            "class": "dxc-error-bars",
            "clip-path": "wideClipId",
            "opacity": 0.001,
            "sharp": true,
            "stroke": "red",
            "stroke-linecap": "square",
            "stroke-width": 3
        }]);

        points = series.getPoints();

        $.each(points, function(i, p) {
            assert.equal(p.draw.lastCall.args[1].errorBars, errorBarGroup, "correct errorBar group pass to point " + i);
            assert.equal(p.animate.callCount, 1, i + " point draw without animate");
        });
        assert.ok(!errorBarGroup.animate.called);
        completeAnimation = points[points.length - 1].animate.lastCall.args[0];
        completeAnimation();

        assert.deepEqual(errorBarGroup.animate.lastCall.args, [{
            opacity: 0.7
        }, { duration: 400 }]);
    });

    QUnit.test("Create error bar group when series is animated. ErrorBars opacity is undefined", function(assert) {
        var series = createSeries({
                type: seriesType,
                point: { visible: false },
                valueErrorBar: {
                    displayMode: "all",
                    lowValueField: "fieldName",
                    color: "red",
                    lineWidth: 3,
                    opacity: undefined
                }
            }, {
                renderer: this.renderer,
                seriesGroup: this.seriesGroup
            }),
            completeAnimation,
            points;
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.setClippingParams("clipId", "wideClipId", false);

        // act
        series.draw(true);
        // assert

        assert.equal(this.renderer.stub("g").callCount, 4);
        assert.equal(this.renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
        assert.equal(this.renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
        assert.equal(this.renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");
        assert.equal(this.renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-error-bars");

        var parentGroup = this.renderer.stub("g").getCall(0).returnValue,
            errorBarGroup = this.renderer.stub("g").getCall(3).returnValue;

        assert.equal(parentGroup.children.length, 2, "groups in series group");
        assert.equal(parentGroup.children[0], this.renderer.stub("g").getCall(1).returnValue);
        assert.equal(parentGroup.children[1], this.renderer.stub("g").getCall(3).returnValue);


        assert.deepEqual(errorBarGroup.attr.lastCall.args, [{
            "class": "dxc-error-bars",
            "clip-path": "wideClipId",
            "opacity": 0.001,
            "sharp": true,
            "stroke": "red",
            "stroke-linecap": "square",
            "stroke-width": 3
        }]);

        points = series.getPoints();

        $.each(points, function(i, p) {
            assert.equal(p.draw.lastCall.args[1].errorBars, errorBarGroup, "correct errorBar group pass to point " + i);
            assert.equal(p.animate.callCount, 1, i + " point draw without animate");
        });
        assert.ok(!errorBarGroup.animate.called);
        completeAnimation = points[points.length - 1].animate.lastCall.args[0];
        completeAnimation();

        assert.deepEqual(errorBarGroup.animate.lastCall.args, [{
            opacity: 1
        }, { duration: 400 }]);
    });

    QUnit.test("Create errorBars group when highErrorField is defined", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            valueErrorBar: {
                displayMode: "all",
                highValueField: "fieldName",
                color: "red",
                lineWidth: 3,
                opacity: 0.7
            }
        }, {
            renderer: this.renderer,
            seriesGroup: this.seriesGroup
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.setClippingParams("clipId", "wideClipId", false);

        // act
        series.draw(false);
        // assert

        assert.equal(this.renderer.stub("g").callCount, 4);
        assert.equal(this.renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
        assert.equal(this.renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
        assert.equal(this.renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");
        assert.equal(this.renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-error-bars");

        var parentGroup = this.renderer.stub("g").getCall(0).returnValue,
            errorBarGroup = this.renderer.stub("g").getCall(3).returnValue;

        assert.equal(parentGroup.children.length, 2, "groups in series group");
        assert.equal(parentGroup.children[0], this.renderer.stub("g").getCall(1).returnValue);
        assert.equal(parentGroup.children[1], this.renderer.stub("g").getCall(3).returnValue);


        assert.deepEqual(errorBarGroup.attr.lastCall.args, [{
            "class": "dxc-error-bars",
            "clip-path": "wideClipId",
            "opacity": 0.7,
            "sharp": true,
            "stroke": "red",
            "stroke-linecap": "square",
            "stroke-width": 3
        }]);

        $.each(series._points, function(i, p) {
            assert.equal(p.draw.lastCall.args[1].errorBars, errorBarGroup, "correct errorBar group pass to point " + i);
            assert.equal(p.animate.callCount, 0, i + " point draw without animate");
        });
    });


    QUnit.test("Draw series when errorBars enabled. forceClipping is true", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            valueErrorBar: {
                displayMode: "all",
                type: "fixed",
                color: "red",
                lineWidth: 3,
                opacity: undefined
            }
        }, {
            renderer: this.renderer,
            seriesGroup: this.seriesGroup
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });

        series.setClippingParams("clipId", "wideClipId", true);

        // act
        series.draw(false);
        // assert

        assert.equal(this.renderer.stub("g").callCount, 4);
        assert.equal(this.renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
        assert.equal(this.renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
        assert.equal(this.renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");
        assert.equal(this.renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-error-bars");

        var parentGroup = this.renderer.stub("g").getCall(0).returnValue,
            errorBarGroup = this.renderer.stub("g").getCall(3).returnValue;

        assert.equal(parentGroup.children.length, 2, "groups in series group");
        assert.equal(parentGroup.children[0], this.renderer.stub("g").getCall(1).returnValue);
        assert.equal(parentGroup.children[1], this.renderer.stub("g").getCall(3).returnValue);


        assert.deepEqual(errorBarGroup.attr.lastCall.args, [{
            "class": "dxc-error-bars",
            "clip-path": "clipId",
            "opacity": 1,
            "sharp": true,
            "stroke": "red",
            "stroke-linecap": "square",
            "stroke-width": 3
        }]);

        $.each(series._points, function(i, p) {
            assert.equal(p.draw.lastCall.args[1].errorBars, errorBarGroup, "correct errorBar group pass to point " + i);
            assert.equal(p.animate.callCount, 0, i + " point draw without animate");
        });
    });

    QUnit.test("Draw series when errorBars enabled and valueAxis type not supported for errorBars", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: { visible: false },
            valueErrorBar: {
                displayMode: "all",
                type: "stdError",
                color: "red",
                lineWidth: 3,
                opacity: 0.7
            }
        }, {
            renderer: this.renderer,
            seriesGroup: this.seriesGroup
        });
        series.updateData(this.data);
        series.createPoints();
        $.each(series._points, function(i, pt) {
            pt.x = pt.argument;
            pt.y = pt.value;
        });
        series.updateDataType({ valueAxisType: "discrete" });
        series.setClippingParams("clipId", "wideClipId", true);

        // act
        series.draw(false);
        // assert

        checkGroups(assert, series);

        $.each(series._points, function(i, p) {
            assert.equal(p.draw.lastCall.args[1].errorBars, undefined, "correct errorBar group pass to point " + i);
            assert.equal(p.animate.callCount, 0, i + " point draw without animate");
        });
    });


    QUnit.module("Scatter. Points animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.series = createSeries({
                type: seriesType,
                point: { visible: true }
            }, {
                renderer: this.renderer
            });
            this.series.updateData(this.data);
            this.series.createPoints();
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Draw without animation", function(assert) {
        var series = this.series;
        // act
        series.draw(false);
        // assert
        $.each(series._points, function(i, p) {
            assert.ok(p.draw.calledOnce);
            assert.equal(p.draw.firstCall.args[0], series._renderer, "renderer pass to point " + i);
            assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, "markers group pass to point " + i);
            assert.equal(p.draw.firstCall.args[2], false, "animation should be disabled " + i);
        });
    });

    QUnit.test("Draw with animation", function(assert) {
        var series = this.series;
        // act
        series.draw(true);
        // assert
        $.each(series._points, function(i, p) {
            assert.ok(p.draw.calledOnce);
            assert.equal(p.draw.firstCall.args[0], series._renderer, "renderer pass to point " + i);
            assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, "markers group pass to point " + i);
            assert.equal(p.draw.firstCall.args[3], true, "animation should be enabled " + i);
        });
    });

    QUnit.module("Scatter. Preparing point styles", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Radius when border is invisible", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                size: 6,
                border: {
                    visible: false,
                    width: 2
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.equal(this.createPoint.firstCall.args[2].styles.normal.r, 3);
    });

    QUnit.test("Radius when border is visible and width is 0", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                size: 6,
                border: {
                    visible: true,
                    width: 0
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.equal(this.createPoint.firstCall.args[2].styles.normal.r, 3);
    });

    QUnit.test("Radius when border is visible and width is not 0", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                size: 6,
                border: {
                    visible: true,
                    width: 2
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.equal(this.createPoint.firstCall.args[2].styles.normal.r, 4);
    });

    QUnit.test("Style in points", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(this.createPoint.firstCall.args[2].styles, {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                r: 2.5,
                "stroke-width": "n-b-width",
                opacity: undefined
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("hover and selection point size inherit normal size", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                size: 5,
                hoverStyle: {
                    border: {
                        visible: false,
                    }
                },
                selectionStyle: {
                    border: {
                        visible: true,
                        width: 2
                    }
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        var pointStyles = this.createPoint.firstCall.args[2].styles;

        assert.strictEqual(pointStyles.hover.r, 2.5, "hover style without border");
        assert.strictEqual(pointStyles.selection.r, 3.5, "selection style with border");
    });

    QUnit.test("Label style", function(assert) {
        var series = createSeries({
            type: seriesType,
            label: {
                visible: true,
                connector: {
                    color: 'connector-color',
                    width: 'connector-width',
                    visible: true
                },
                backgroundColor: 'label-background-color',
                border: {
                    visible: true,
                    width: 'background-width'
                },
                font: {
                    color: 'font-color',
                    size: 'font-size',
                    weight: 'font-weight',
                    cursor: "font-cursor",
                    family: "font-family"
                }
            },
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(this.createPoint.firstCall.args[2].label, {
            "attributes": {
                "font": {
                    "color": "font-color",
                    "size": "font-size",
                    "weight": "font-weight",
                    "family": "font-family",
                    "cursor": "font-cursor"
                }
            },
            "background": {
                "fill": "label-background-color",
                "stroke-width": "background-width"
            },
            "connector": {
                "stroke": "connector-color",
                "stroke-width": "connector-width"
            },
            "visible": true
        });
    });

    QUnit.test("Style in point group", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                visible: true,
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();
        series.draw(false);

        assert.deepEqual(series._markersGroup._stored_settings, {
            "class": "dxc-markers",
            fill: "n-color",
            r: 2.5,
            opacity: 1,
            "clip-path": null,
            stroke: "n-b-color",
            "stroke-width": "n-b-width",
            visibility: "visible"
        });
    });

    QUnit.test("All options defined", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                visible: true,
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": "n-b-width",
                visibility: "visible"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("without borders", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                visible: true,
                color: "n-color",
                size: 5,
                border: {
                    visible: false,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: false,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: false,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": 0
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": 0,
                visibility: "visible"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": 0
            }
        });
    });

    QUnit.test("Define only point.color", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                visible: true,
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    width: "n-b-width"
                },
                hoverStyle: {
                    size: 2,
                    border: {
                        visible: true,
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    size: 4,
                    border: {
                        visible: true,
                        width: "s-b-width"
                    }
                }
            }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "containerColor",
                r: 1,
                stroke: "n-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-color",
                "stroke-width": "n-b-width",
                visibility: "visible"
            },
            selection: {
                fill: "containerColor",
                r: 2,
                stroke: "n-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("Define only series color", function(assert) {
        var series = createSeries({
            type: seriesType,
            mainSeriesColor: "seriesColor",
            point: {
                visible: true,
                size: 5,
                border: {
                    visible: true,
                    width: "n-b-width"
                },
                hoverStyle: {
                    size: 2,
                    border: {
                        visible: true,
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    size: 4,
                    border: {
                        visible: true,
                        width: "s-b-width"
                    }
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual((series._getPointOptions().styles), {
            hover: {
                fill: "containerColor",
                r: 1,
                stroke: "seriesColor",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "seriesColor",
                r: 2.5,
                stroke: "seriesColor",
                "stroke-width": "n-b-width",
                visibility: "visible"
            },
            selection: {
                fill: "containerColor",
                r: 2,
                stroke: "seriesColor",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.module("Scatter. Customize point", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("customizePoint object", function(assert) {
        var spy = sinon.spy(),
            series = createSeries({
                type: seriesType,
                customizePoint: spy,
                name: "seriesName"
            });
        series.updateData(this.data);
        series.createPoints();

        assert.ok(series);
        assert.equal(spy.callCount, 2);

        var expectedArg = {
            argument: "arg1",
            value: "val1",
            seriesName: "seriesName",
            tag: "tag1",
            index: 0,
            series: series,
            data: this.data[0]
        };

        assert.deepEqual(spy.firstCall.args, [expectedArg]);
        assert.deepEqual(spy.firstCall.thisValue, expectedArg);

        expectedArg = {
            argument: "arg2",
            value: "val2",
            seriesName: "seriesName",
            tag: "tag2",
            index: 1,
            series: series,
            data: this.data[1]
        };
        assert.deepEqual(spy.secondCall.args, [expectedArg]);
        assert.deepEqual(spy.secondCall.thisValue, expectedArg);
    });

    QUnit.test("Without result", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            },
            customizePoint: function() { }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series._getPointOptions().styles, {
            hover: {
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": "s-b-width"
            }
        });

        assert.strictEqual(series.getAllPoints()[0].updateOptions.callCount, 0);
    });

    QUnit.test("Empty object result", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                color: "n-color",
                size: 5,
                border: {
                    visible: true,
                    color: "n-b-color",
                    width: "n-b-width"
                },
                hoverStyle: {
                    color: "h-color",
                    size: 2,
                    border: {
                        visible: true,
                        color: "h-b-color",
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    color: "s-color",
                    size: 4,
                    border: {
                        visible: true,
                        color: "s-b-color",
                        width: "s-b-width"
                    }
                }
            },
            customizePoint: function() { return {}; }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.strictEqual(series.getAllPoints()[0].updateOptions.callCount, 0);
    });

    QUnit.test("customize point color. all", function(assert) {
        var series = createSeries({
            type: seriesType,
            customizePoint: function() {
                return {
                    color: "n-color",
                    size: 5,
                    border: {
                        visible: true,
                        color: "n-b-color",
                        width: "n-b-width"
                    },
                    hoverStyle: {
                        color: "h-color",
                        size: 2,
                        border: {
                            visible: true,
                            color: "h-b-color",
                            width: "h-b-width"
                        }
                    },
                    selectionStyle: {
                        color: "s-color",
                        size: 4,
                        border: {
                            visible: true,
                            color: "s-b-color",
                            width: "s-b-width"
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
                fill: "h-color",
                r: 1,
                stroke: "h-b-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-b-color",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "s-color",
                r: 2,
                stroke: "s-b-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("customize only point.color", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                size: 5,
                border: {
                    visible: true,
                    width: "n-b-width"
                },
                hoverStyle: {
                    size: 2,
                    border: {
                        visible: true,
                        width: "h-b-width"
                    }
                },
                selectionStyle: {
                    size: 4,
                    border: {
                        visible: true,
                        width: "s-b-width"
                    }
                }
            },
            customizePoint: function() {
                return { color: "n-color" };
            }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series.getAllPoints()[0].updateOptions.lastCall.args[0].styles, {
            usePointCustomOptions: true,
            useLabelCustomOptions: undefined,
            hover: {
                fill: "containerColor",
                r: 1,
                stroke: "n-color",
                "stroke-width": "h-b-width"
            },
            normal: {
                fill: "n-color",
                r: 2.5,
                stroke: "n-color",
                "stroke-width": "n-b-width",
                visibility: "hidden"
            },
            selection: {
                fill: "containerColor",
                r: 2,
                stroke: "n-color",
                "stroke-width": "s-b-width"
            }
        });
    });

    QUnit.test("Point options merging", function(assert) {
        var series = createSeries({
            type: seriesType,
            point: {
                size: 6,
                color: "normalColor",
                border: {
                    width: 3,
                    color: "black"
                },
                selectionStyle: {
                    size: 10,
                    border: {
                        visible: true,
                        width: 10
                    }
                },

                hoverStyle: {
                    size: 8,
                    border: {
                        visible: true,
                        width: 8
                    }
                },

                image: {
                    height: 10,
                    url: {
                        rangeMin: "url1"
                    }
                }
            },
            customizePoint: function() {
                return {
                    border: {
                        width: 2,
                        visible: true
                    },
                    selectionStyle: {
                        color: "selectionColor",
                        border: {
                            color: "selectionBorderColor"
                        }
                    },
                    hoverStyle: {
                        color: "hoverColor",
                        border: {
                            color: "hoverBorderColor"
                        }
                    },
                    image: {
                        width: 15,
                        url: {
                            rangeMax: "url2"
                        }
                    },
                    hoverMode: "none"
                };
            },
            name: "seriesName"
        });

        series.updateData(this.data);
        series.createPoints();

        var pointOptions = series.getAllPoints()[0].updateOptions.lastCall.args[0];

        assert.deepEqual(pointOptions.styles.normal, {
            r: 4,
            fill: "normalColor",
            stroke: "black",
            "stroke-width": 2,
            visibility: "hidden"
        }, "parsed normal style");

        assert.deepEqual(pointOptions.styles.selection, {
            r: 10,
            stroke: "selectionBorderColor",
            "stroke-width": 10,
            fill: "selectionColor"
        }, "parseSelectionStyle");

        assert.deepEqual(pointOptions.styles.hover, {
            r: 8,
            stroke: "hoverBorderColor",
            "stroke-width": 8,
            fill: "hoverColor"
        }, "parseHoverStyle");

        assert.deepEqual(pointOptions.image, {
            width: 15,
            height: 10,
            url: {
                rangeMax: "url2",
                rangeMin: "url1"
            }
        });
    });

    QUnit.module("Scatter. Label styles", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Label options in point", function(assert) {
        var series = createSeries({
            type: seriesType,
            label: {
                visible: true,
                showForZeroValues: false,
                threshold: 100,
                alignment: "left",
                rotationAngle: 45,
                font: {
                    color: "#345678",
                    family: "Verdana",
                    weight: 300,
                    size: 18,
                    opacity: 0.9
                },
                horizontalOffset: 5,
                verticalOffset: 8,
                radialOffset: 7,
                format: { type: "currency", precision: 3 },
                argumentFormat: { type: "percent", precision: 1 },
                customizeText: function() {
                    return "Test format";
                },
                border: {
                    visible: true,
                    width: 3,
                    color: "#678901",
                    dashStyle: "dash"
                },
                backgroundColor: "black",
                position: "inside",
                connector: {
                    visible: true,
                    width: 5,
                    color: "red"
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();


        var labels = this.createPoint.firstCall.args[2].label;
        assert.ok(labels);
        assert.ok(labels.visible);
        assert.ok(!labels.showForZeroValues);
        assert.equal(labels.attributes.font.color, "#345678", "label font color");
        assert.equal(labels.alignment, "left");
        assert.equal(labels.attributes.font.family, "Verdana", "label font family");
        assert.equal(labels.attributes.font.weight, 300, "label font weight");
        assert.equal(labels.attributes.font.size, 18, "label font size");
        assert.equal(labels.attributes.font.opacity, 0.9, "label font opacity");
        assert.equal(labels.rotationAngle, 45);
        assert.equal(labels.horizontalOffset, 5);
        assert.equal(labels.verticalOffset, 8);
        assert.equal(labels.radialOffset, 7);
        assert.ok(labels.format);
        var formatResult = labels.customizeText();
        assert.equal(formatResult, "Test format");
        assert.deepEqual(labels.format, { type: "currency", precision: 3 });
        assert.deepEqual(labels.argumentFormat, { type: "percent", precision: 1 });
        assert.equal(labels.position, "inside");
        assert.equal(labels.connector["stroke-width"], 5);
        assert.equal(labels.connector.stroke, "red");

        var background = labels.background;
        assert.ok(background);
        assert.equal(background.fill, "black");
        assert.equal(background["stroke-width"], 3);
        assert.equal(background.dashStyle, "dash");
        assert.equal(background.stroke, "#678901");
    });

    QUnit.test("Parse label options", function(assert) {
        var series = createSeries({
            type: seriesType,
            label: {
                visible: true,
                showForZeroValues: false,
                threshold: 100,
                alignment: "left",
                rotationAngle: 45,
                font: {
                    color: "#345678",
                    family: "Verdana",
                    weight: 300,
                    size: 18,
                    opacity: 0.9
                },
                horizontalOffset: 5,
                verticalOffset: 8,
                radialOffset: 7,
                format: { type: "currency", precision: 3 },
                argumentFormat: { type: "percent", precision: 1 },
                customizeText: function() {
                    return "Test format";
                },
                border: {
                    visible: true,
                    width: 3,
                    color: "#678901",
                    dashStyle: "dash"
                },
                backgroundColor: "black",
                position: "inside",
                connector: {
                    visible: true,
                    width: 5,
                    color: "red"
                }
            }
        });

        series.updateData(this.data);
        series.createPoints();


        var labels = series._getPointOptions().label;
        assert.ok(labels);
        assert.ok(labels.visible);
        assert.ok(!labels.showForZeroValues);
        assert.equal(labels.attributes.font.color, "#345678", "label font color");
        assert.equal(labels.alignment, "left");
        assert.equal(labels.attributes.font.family, "Verdana", "label font family");
        assert.equal(labels.attributes.font.weight, 300, "label font weight");
        assert.equal(labels.attributes.font.size, 18, "label font size");
        assert.equal(labels.attributes.font.opacity, 0.9, "label font opacity");
        assert.equal(labels.rotationAngle, 45);
        assert.equal(labels.horizontalOffset, 5);
        assert.equal(labels.verticalOffset, 8);
        assert.equal(labels.radialOffset, 7);
        assert.ok(labels.format);
        var formatResult = labels.customizeText();
        assert.equal(formatResult, "Test format");
        assert.deepEqual(labels.format, { type: "currency", precision: 3 });
        assert.deepEqual(labels.argumentFormat, { type: "percent", precision: 1 });
        assert.equal(labels.position, "inside");
        assert.equal(labels.connector["stroke-width"], 5);
        assert.equal(labels.connector.stroke, "red");

        var background = labels.background;
        assert.ok(background);
        assert.equal(background.fill, "black");
        assert.equal(background["stroke-width"], 3);
        assert.equal(background.dashStyle, "dash");
        assert.equal(background.stroke, "#678901");
    });

    QUnit.test("Labels without background, color of label is specify", function(assert) {
        var series = createSeries({
            type: seriesType,
            label: {
                visible: true,
                font: {
                    color: "#123456"
                },
                backgroundColor: "none"
            }
        }, this.renderer);
        series.updateData(this.data);
        series.createPoints();

        var labelStyle = series._getPointOptions().label;
        assert.equal(labelStyle.attributes.font.color, "#123456");
        assert.equal(labelStyle.background.fill, "none");
    });

    QUnit.test("Labels without background, position = outside", function(assert) {
        var series = createSeries({
            type: seriesType,
            mainSeriesColor: "#567345",
            label: {
                visible: true,
                position: "outside",
                font: {
                    color: "#ffffff"
                },
                backgroundColor: "none"
            }
        }, this.renderer);
        series.updateData(this.data);
        series.createPoints();

        var labelStyle = series._getPointOptions().label;
        assert.equal(labelStyle.attributes.font.color, "#567345");
        assert.equal(labelStyle.background.fill, "none");
    });

    QUnit.test("Labels without background, position = inside", function(assert) {
        var series = createSeries({
            type: seriesType,
            mainSeriesColor: "#567345",
            label: {
                position: "inside",
                font: {
                    color: "#123456"
                },
                visible: true,
                backgroundColor: "none"
            }
        });
        series.updateData(this.data);
        series.createPoints();

        var labelStyle = series._getPointOptions().label;
        assert.equal(labelStyle.attributes.font.color, "#123456");
        assert.equal(labelStyle.background.fill, "none");
    });

    QUnit.test("Non-acceptable Label format", function(assert) {
        var series = createSeries({
            type: seriesType
        });
        series.updateData(this.data);
        series.createPoints();

        var labels = series._getPointOptions().label;
        assert.equal(labels.customizeText, undefined);
    });


    QUnit.module("Scatter. Customize Label", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Customize label callback params", function(assert) {
        var spy = sinon.spy(),
            series = createSeries({
                type: seriesType,
                customizeLabel: spy,
                name: "seriesName"
            });
        series.updateData(this.data);
        series.createPoints();

        assert.ok(series);
        assert.equal(spy.callCount, 2);

        var expectedArg = {
            argument: "arg1",
            value: "val1",
            seriesName: "seriesName",
            tag: "tag1",
            index: 0,
            series: series,
            data: this.data[0]
        };

        assert.deepEqual(spy.firstCall.args, [expectedArg]);
        assert.deepEqual(spy.firstCall.thisValue, expectedArg);

        expectedArg = {
            argument: "arg2",
            value: "val2",
            seriesName: "seriesName",
            tag: "tag2",
            index: 1,
            series: series,
            data: this.data[1]
        };

        assert.deepEqual(spy.secondCall.args, [expectedArg]);
        assert.deepEqual(spy.secondCall.thisValue, expectedArg);
    });

    QUnit.test("customize label without result", function(assert) {
        var series = createSeries({
            type: seriesType,
            label: {
                visible: true,
                showForZeroValues: false,
                threshold: 100,
                alignment: "left",
                rotationAngle: 45,
                font: {
                    color: "#345678",
                    family: "Verdana",
                    weight: 300,
                    size: 18,
                    opacity: 0.9
                },
                horizontalOffset: 5,
                verticalOffset: 8,
                radialOffset: 7,
                format: "currency",
                precision: 3,
                argumentFormat: "percent",
                argumentPrecision: 1,
                customizeText: function() {
                    return "Test format";
                },
                border: {
                    visible: true,
                    width: 3,
                    color: "#678901",
                    dashStyle: "dash"
                },
                backgroundColor: "black",
                position: "inside",
                connector: {
                    visible: true,
                    width: 5,
                    color: "red"
                }
            },
            customizeLabel: function() { }
        });

        series.updateData(this.data);
        series.createPoints();

        var labels = this.createPoint.firstCall.args[2].label;
        assert.ok(labels);
        assert.ok(labels.visible);
        assert.ok(!labels.showForZeroValues);
        assert.equal(labels.attributes.font.color, "#345678", "label font color");
        assert.equal(labels.alignment, "left");
        assert.equal(labels.attributes.font.family, "Verdana", "label font family");
        assert.equal(labels.attributes.font.weight, 300, "label font weight");
        assert.equal(labels.attributes.font.size, 18, "label font size");
        assert.equal(labels.attributes.font.opacity, 0.9, "label font opacity");
        assert.equal(labels.rotationAngle, 45);
        assert.equal(labels.horizontalOffset, 5);
        assert.equal(labels.verticalOffset, 8);
        assert.equal(labels.radialOffset, 7);
        assert.ok(labels.format);
        var formatResult = labels.customizeText();
        assert.equal(formatResult, "Test format");
        assert.equal(labels.position, "inside");
        assert.equal(labels.connector["stroke-width"], 5);
        assert.equal(labels.connector.stroke, "red");

        var background = labels.background;
        assert.ok(background);
        assert.equal(background.fill, "black");
        assert.equal(background["stroke-width"], 3);
        assert.equal(background.dashStyle, "dash");
        assert.equal(background.stroke, "#678901");
    });

    QUnit.test("empty object result", function(assert) {
        var series = createSeries({
            type: seriesType,
            label: {
                visible: true,
                showForZeroValues: false,
                threshold: 100,
                alignment: "left",
                rotationAngle: 45,
                font: {
                    color: "#345678",
                    family: "Verdana",
                    weight: 300,
                    size: 18,
                    opacity: 0.9
                },
                horizontalOffset: 5,
                verticalOffset: 8,
                radialOffset: 7,
                format: "currency",
                precision: 3,
                argumentFormat: "percent",
                argumentPrecision: 1,
                customizeText: function() {
                    return "Test format";
                },
                border: {
                    visible: true,
                    width: 3,
                    color: "#678901",
                    dashStyle: "dash"
                },
                backgroundColor: "black",
                position: "inside",
                connector: {
                    visible: true,
                    width: 5,
                    color: "red"
                }
            },
            customizeLabel: function() { return {}; }
        });

        series.updateData(this.data);
        series.createPoints();

        var labels = this.createPoint.firstCall.args[2].label;
        assert.ok(labels);
        assert.ok(labels.visible);
        assert.ok(!labels.showForZeroValues);
        assert.equal(labels.attributes.font.color, "#345678", "label font color");
        assert.equal(labels.alignment, "left");
        assert.equal(labels.attributes.font.family, "Verdana", "label font family");
        assert.equal(labels.attributes.font.weight, 300, "label font weight");
        assert.equal(labels.attributes.font.size, 18, "label font size");
        assert.equal(labels.attributes.font.opacity, 0.9, "label font opacity");
        assert.equal(labels.rotationAngle, 45);
        assert.equal(labels.horizontalOffset, 5);
        assert.equal(labels.verticalOffset, 8);
        assert.equal(labels.radialOffset, 7);
        assert.ok(labels.format);
        var formatResult = labels.customizeText();
        assert.equal(formatResult, "Test format");
        assert.equal(labels.position, "inside");
        assert.equal(labels.connector["stroke-width"], 5);
        assert.equal(labels.connector.stroke, "red");

        var background = labels.background;
        assert.ok(background);
        assert.equal(background.fill, "black");
        assert.equal(background["stroke-width"], 3);
        assert.equal(background.dashStyle, "dash");
        assert.equal(background.stroke, "#678901");
    });

    QUnit.test("with result", function(assert) {
        var series = createSeries({
            type: seriesType,
            label: {
                visible: true,
                showForZeroValues: false,
                threshold: 100,
                alignment: "left",
                rotationAngle: 45,
                font: {
                    color: "#345678",
                    family: "Verdana",
                    weight: 300,
                    size: 18,
                    opacity: 0.9
                },
                horizontalOffset: 5,
                verticalOffset: 8,
                radialOffset: 7,
                format: "currency",
                precision: 3,
                argumentFormat: "percent",
                argumentPrecision: 1,
                customizeText: function() {
                    return "Test format";
                },
                border: {
                    visible: true,
                    width: 3,
                    color: "#678901",
                    dashStyle: "dash"
                },
                backgroundColor: "black",
                position: "inside",
                connector: {
                    visible: true,
                    width: 5,
                    color: "red"
                }
            },
            customizeLabel: function() {
                return {
                    visible: false,
                    showForZeroValues: false,
                    threshold: 100,
                    alignment: "left",
                    rotationAngle: 45,
                    font: {
                        weight: 400
                    },
                    horizontalOffset: 10,
                    verticalOffset: 8,
                    border: {
                        visible: true,
                        width: 3,
                        color: "red",
                        dashStyle: "dash"
                    },
                    position: "outside",
                    connector: {
                        visible: false,
                        width: 5,
                        color: "black"
                    },
                    customizeText: function() {
                        return "Label is customized";
                    }
                };
            }
        });

        series.updateData(this.data);
        series.createPoints();

        var labels = series.getAllPoints()[0].updateOptions.lastCall.args[0].label;
        assert.ok(labels);

        assert.deepEqual(labels.attributes, {
            "font": {
                "color": "#345678",
                "family": "Verdana",
                "opacity": 0.9,
                "size": 18,
                "weight": 400
            }
        });

        assert.deepEqual(labels.background, {
            "dashStyle": "dash",
            "fill": "black",
            "stroke": "red",
            "stroke-width": 3
        });

        assert.deepEqual(labels.connector, {
            "stroke": "none",
            "stroke-width": 0
        });

        assert.ok(!labels.visible);
        assert.ok(!labels.showForZeroValues);
        assert.equal(labels.rotationAngle, 45);
        assert.equal(labels.horizontalOffset, 10);
        assert.equal(labels.verticalOffset, 8);
        assert.equal(labels.radialOffset, 7);
        assert.ok(labels.format);
        var formatResult = labels.customizeText();
        assert.equal(formatResult, "Label is customized");
    });

    QUnit.test("Customize label and point", function(assert) {
        var series = createSeries({
            type: seriesType,
            mainSeriesColor: "#567345",
            customizePoint: function() {
                if(this.index === 0) {
                    return { color: "#123456" };
                }
            },

            customizeLabel: function() {
                if(this.index === 0) {
                    return { visible: false };
                }
            },
            label: {
                visible: true,
                position: "outside",
                font: {
                    color: "#ffffff"
                },
                backgroundColor: "none"
            }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.equal(series.getAllPoints()[0].updateOptions.lastCall.args[0].label.visible, false);
        assert.equal(series.getAllPoints()[0].updateOptions.lastCall.args[0].label.attributes.font.color, "#123456");
        assert.equal(series.getAllPoints()[0].updateOptions.lastCall.args[0].label.background.fill, "none");

        assert.equal(this.createPoint.secondCall.args[2].label.visible, true);
        assert.equal(this.createPoint.secondCall.args[2].label.attributes.font.color, "#567345");
        assert.equal(this.createPoint.secondCall.args[2].label.background.fill, "none");

        assert.strictEqual(series.getAllPoints()[1].updateOptions.callCount, 0);
    });

    QUnit.module("Scatter. API", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("getValueFields default", function(assert) {
        var series = createSeries({
            type: seriesType
        });

        assert.deepEqual(series.getValueFields(), ["val"]);
    });

    QUnit.test("getValueFields", function(assert) {
        var series = createSeries({
            type: seriesType,
            valueField: "customValueField"
        });

        assert.deepEqual(series.getValueFields(), ["customValueField"]);
    });

    QUnit.test("getValueFields defaults when valueErrorBar is visible", function(assert) {
        var series = createSeries({
            type: seriesType
        });

        assert.deepEqual(series.getValueFields(), ["val"]);
    });

    QUnit.test("getValueFields defaults when valueErrorBar is visible & set error fields", function(assert) {
        var series = createSeries({
            type: seriesType,
            valueErrorBar: {
                lowValueField: "someLowErrorField",
                highValueField: "someHighErrorField"
            }
        });

        assert.deepEqual(series.getValueFields(), ["val", "someLowErrorField", "someHighErrorField"]);
    });

    QUnit.test("getArgumentField default", function(assert) {
        var series = createSeries({
            type: seriesType
        });

        assert.deepEqual(series.getArgumentField(), "arg");
    });

    QUnit.test("getArgumentField", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "customArgumentField"
        });

        assert.deepEqual(series.getArgumentField(), "customArgumentField");
    });

    QUnit.test("areErrorBarsVisible", function(assert) {
        function checkVisibility(options, valueType, valueAxisType, expected, comment) {
            var series = createSeries({
                type: seriesType,
                valueErrorBar: options
            });
            valueType && series.updateDataType({ valueType: valueType });
            valueAxisType && series.updateDataType({ valueAxisType: valueAxisType });

            assert.strictEqual(series.areErrorBarsVisible(), expected, comment);
        }

        checkVisibility({ type: "fixed", displayMode: "all" }, undefined, undefined, true, "fixed, displayMode all");
        checkVisibility({ type: "percent", displayMode: "all" }, undefined, undefined, true, "percent, displayMode all");
        checkVisibility({ type: "stdError", displayMode: "all" }, undefined, undefined, true, "stdError, displayMode all");
        checkVisibility({ type: "stdDeviation", displayMode: "all" }, undefined, undefined, true, "stdDeviation, displayMode all");
        checkVisibility({ type: "Variance", displayMode: "all" }, undefined, undefined, true, "Variance, displayMode all");
        checkVisibility({ type: "unknown", displayMode: "all" }, undefined, undefined, false, "unknown, displayMode all");
        checkVisibility({ type: "unknown", lowValueField: "field", displayMode: "all" }, undefined, undefined, true, "unknown, displayMode all, lowValueField defined");
        checkVisibility({ type: "unknown", highValueField: "field", displayMode: "all" }, undefined, undefined, true, "unknown, displayMode all, highValueField defined");
        checkVisibility({ type: "fixed", displayMode: "none" }, undefined, undefined, false, "fixed, displayMode none");
        checkVisibility({ type: "fixed", displayMode: "all" }, undefined, "discrete", false, "fixed, displayMode all");
        checkVisibility({ type: "fixed", displayMode: "all" }, undefined, "logarithmic", false, "fixed, displayMode all");
        checkVisibility({ type: "fixed", displayMode: "all" }, "datetime", undefined, false, "fixed, displayMode all");
    });

    QUnit.test("getPointCenterByArg. no existing argument", function(assert) {
        var series = createSeries({
            type: seriesType
        });

        series.updateData([{ arg: 1, val: 1 }]);
        series.createPoints();

        assert.strictEqual(series.getAllPoints()[0].getCenterCoord.callCount, 0);
        assert.strictEqual(series.getPointCenterByArg(2), undefined);
    });

    QUnit.test("getPointCenterByArg. existing argument", function(assert) {
        var series = createSeries({
            type: seriesType
        });

        series.updateData([{ arg: 1, val: 1 }]);
        series.createPoints();

        var centerCoord = series.getPointCenterByArg(1);

        assert.strictEqual(series.getAllPoints()[0].getCenterCoord.callCount, 1);
        assert.deepEqual(centerCoord, series.getAllPoints()[0].getCenterCoord.firstCall.returnValue);
        assert.deepEqual(centerCoord, { x: "center_x", y: "center_y" });
    });

    QUnit.module("Check visible area", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            var data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
            this.series = createSeries({
                rotated: false,
                type: seriesType,
            });
            this.series.getValueAxis().getVisibleArea.returns([0, 500]);
            this.series.getArgumentAxis().getVisibleArea.returns([10, 530]);
            this.series.updateData(data);
            this.series.createPoints();
            this.series.draw();
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Visible area, not rotated", function(assert) {
        assert.deepEqual(this.series.getVisibleArea(), { maxX: 530, minX: 10, maxY: 500, minY: 0 });
    });

    QUnit.test("Visible area, rotated", function(assert) {
        this.series.updateOptions($.extend(true, {}, this.series.getOptions(), { rotated: true }));
        this.series.draw();
        assert.deepEqual(this.series.getVisibleArea(), { maxX: 500, minX: 0, maxY: 530, minY: 10 });
    });
})();

(function getPointByCoord() {
    QUnit.module("Get point by Coord", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.options = { type: seriesType };
            this.data = [{ arg: 10, val: 100 }, { arg: 20, val: 200 }, { arg: 30, val: 300 }, { arg: 40, val: 400 }];
        },
        afterEach: environment.afterEach,
        createSeries: function() {
            var series = createSeries(this.options);

            series.updateData(this.data);
            series.createPoints();

            $.each(series.getPoints(), function(_, p) {
                p.vx = p.argument;
                p.vy = p.value;
                p.x = p.argument;
                p.y = p.value;
            });

            series.getVisiblePoints = function() {
                return series.getPoints();
            };

            return series;

        }
    });

    QUnit.test("getNeighborPoint", function(assert) {
        var series = this.createSeries();
        series.drawTrackers();

        assert.equal(series.getNeighborPoint(5, 200), series.getPointsByArg(10)[0], "x coord left of first point");

        assert.equal(series.getNeighborPoint(10, 100), series.getPointsByArg(10)[0], "coords on point");
        assert.equal(series.getNeighborPoint(10, 200), series.getPointsByArg(10)[0], "x coord on point");

        assert.equal(series.getNeighborPoint(14, 100), series.getPointsByArg(10)[0], "coords between points");
        assert.equal(series.getNeighborPoint(14, 200), series.getPointsByArg(10)[0], "x coord between point");

        assert.equal(series.getNeighborPoint(16, 100), series.getPointsByArg(20)[0], "coords between points");
        assert.equal(series.getNeighborPoint(16, 200), series.getPointsByArg(20)[0], "x coord between point");

        assert.equal(series.getNeighborPoint(15, 100), series.getPointsByArg(20)[0], "coords middle between points");
        assert.equal(series.getNeighborPoint(15, 200), series.getPointsByArg(20)[0], "x coord  middle between point");

        assert.equal(series.getNeighborPoint(45, 200), series.getPointsByArg(40)[0], "x coord right of last point");
    });

    QUnit.test("getNeighborPoint when Tracker not drawn", function(assert) {
        var series = this.createSeries({ type: seriesType });

        assert.equal(series.getPoints()[0].x, 10);
        assert.equal(series.getPoints()[0].y, 100);

        assert.equal(series.getNeighborPoint(5, 200), null);
        assert.equal(series.getNeighborPoint(10, 100), null);

    });

    QUnit.test("getNeighborPoint when few point has equal coord", function(assert) {
        this.data[2].arg = 20;
        this.data[3].arg = 20;
        var series = this.createSeries();
        series.drawTrackers();

        assert.equal(series.getPoints()[0].x, 10);
        assert.equal(series.getPoints()[0].y, 100);

        assert.equal(series.getNeighborPoint(5, 200), series.getPointsByArg(10)[0], "x coord left of first point");

        assert.equal(series.getNeighborPoint(10, 100), series.getPointsByArg(10)[0], "coords on point");
        assert.equal(series.getNeighborPoint(10, 200), series.getPointsByArg(10)[0], "x coord on point");

        assert.equal(series.getNeighborPoint(14, 100), series.getPointsByArg(10)[0], "coords between points");
        assert.equal(series.getNeighborPoint(14, 200), series.getPointsByArg(10)[0], "x coord between point");

        assert.equal(series.getNeighborPoint(16, 0), series.getPointsByArg(20)[0]);
        assert.equal(series.getNeighborPoint(16, 100), series.getPointsByArg(20)[0]);

        assert.equal(series.getNeighborPoint(16, 200), series.getPointsByArg(20)[0]);

        assert.equal(series.getNeighborPoint(16, 200), series.getPointsByArg(20)[0]);
        assert.equal(series.getNeighborPoint(16, 220), series.getPointsByArg(20)[0]);
        assert.equal(series.getNeighborPoint(16, 270), series.getPointsByArg(20)[1]);

        assert.equal(series.getNeighborPoint(16, 300), series.getPointsByArg(20)[1]);
        assert.equal(series.getNeighborPoint(16, 400), series.getPointsByArg(20)[2], "a");
        assert.equal(series.getNeighborPoint(16, 500), series.getPointsByArg(20)[2], "b");

    });

    QUnit.test("getNeighborPoint when point coords non integer", function(assert) {
        var series = createSeries({ type: seriesType });
        series.updateData(this.data);
        series.createPoints();
        $.each(series.getPoints(), function(_, p) {
            p.vx = p.argument + 0.5;
            p.vy = p.value + 0.5;
        });
        series.getVisiblePoints = function() {
            return series.getPoints();
        };
        series.drawTrackers();

        assert.equal(series.getNeighborPoint(5, 200), series.getPointsByArg(10)[0], "x coord left of first point");

        assert.equal(series.getNeighborPoint(10, 100), series.getPointsByArg(10)[0], "coords on point");
        assert.equal(series.getNeighborPoint(10, 200), series.getPointsByArg(10)[0], "x coord on point");

        assert.equal(series.getNeighborPoint(14, 100), series.getPointsByArg(10)[0], "coords between points");
        assert.equal(series.getNeighborPoint(14, 200), series.getPointsByArg(10)[0], "x coord between point");

        assert.equal(series.getNeighborPoint(16, 100), series.getPointsByArg(20)[0], "coords between points");
        assert.equal(series.getNeighborPoint(16, 200), series.getPointsByArg(20)[0], "x coord between point");

        assert.equal(series.getNeighborPoint(15, 100), series.getPointsByArg(20)[0], "coords middle between points");
        assert.equal(series.getNeighborPoint(15, 200), series.getPointsByArg(20)[0], "x coord  middle between point");

        assert.equal(series.getNeighborPoint(45, 200), series.getPointsByArg(40)[0], "x coord right of last point");
    });

    QUnit.test("getNeighborPoint rotated", function(assert) {
        this.options.rotated = true;
        var series = this.createSeries();
        $.each(series.getPoints(), function(_, p) {
            p.vx = p.value;
            p.vy = p.argument;
        });
        series.drawTrackers();

        assert.equal(series.getNeighborPoint(200, 5), series.getPointsByArg(10)[0], "x coord top of first point");

        assert.equal(series.getNeighborPoint(100, 10), series.getPointsByArg(10)[0], "coords on point");
        assert.equal(series.getNeighborPoint(200, 10), series.getPointsByArg(10)[0], "x coord on point");

        assert.equal(series.getNeighborPoint(100, 14), series.getPointsByArg(10)[0], "coords between points");
        assert.equal(series.getNeighborPoint(200, 14), series.getPointsByArg(10)[0], "x coord between point");

        assert.equal(series.getNeighborPoint(100, 16), series.getPointsByArg(20)[0], "coords between points");
        assert.equal(series.getNeighborPoint(200, 16), series.getPointsByArg(20)[0], "x coord between point");

        assert.equal(series.getNeighborPoint(100, 15), series.getPointsByArg(20)[0], "coords middle between points");
        assert.equal(series.getNeighborPoint(200, 15), series.getPointsByArg(20)[0], "x coord  middle between point");

        assert.equal(series.getNeighborPoint(200, 45), series.getPointsByArg(40)[0], "x coord right of last point");
    });

    QUnit.test("getNeighborPoint without point", function(assert) {
        this.data = [];
        var series = this.createSeries();
        series.drawTrackers();

        assert.equal(series.getNeighborPoint(5, 200), undefined);
        assert.equal(series.getNeighborPoint(10, 100), undefined);
    });

    QUnit.test("getPointByCoord", function(assert) {
        var series = this.createSeries();
        series.drawTrackers();

        series.getPointsByArg(10)[0].coordsIn.withArgs(10, 100).returns(true);
        series.getPointsByArg(10)[0].coordsIn.withArgs(10, 200).returns(false);

        series.getPointsByArg(20)[0].coordsIn.returns(false);

        assert.equal(series.getPoints()[0].x, 10);
        assert.equal(series.getPoints()[0].y, 100);

        assert.equal(series.getPointByCoord(10, 100), series.getPointsByArg(10)[0]);
        assert.equal(series.getPointByCoord(10, 200), null);

        assert.equal(series.getPointByCoord(20, 200), null);
    });

    QUnit.test("getPointByCoord. getNeighborPoint. invisible series", function(assert) {
        this.options.visibilityChanged = noop;
        var series = this.createSeries();
        series.drawTrackers();

        series.getPointsByArg(10)[0].coordsIn.withArgs(10, 100).returns(true);

        series.hide();

        assert.equal(series.getPointByCoord(10, 100), null);
        assert.equal(series.getNeighborPoint(10, 100), null);
    });

    QUnit.module("Polar series", environment);

    QUnit.test("createPolarSeries", function(assert) {
        var series = createSeries({ type: seriesType, widgetType: "polar" });
        assert.ok(series.isUpdated);
    });

    QUnit.test("getVisibleArea", function(assert) {
        var series = createSeries({ type: seriesType, widgetType: "polar" });
        series.getValueAxis().getCanvas = sinon.stub().returns({ left: 1, right: 10, top: 15, bottom: 20, width: 300, height: 200 });
        series.draw();

        assert.deepEqual(series.getVisibleArea(), { minX: 1, maxX: 290, minY: 15, maxY: 180 });
    });

    QUnit.module("Get point by Coord. Polar series", environment);

    QUnit.test("getNeighborPoint", function(assert) {
        var series = createSeries({ type: seriesType, widgetType: "polar" }, {
            valueAxis: {
                getCenter: function() {
                    return { x: 100, y: 100 };
                },
                getCanvas: function() {
                    return { left: 0, right: 0, width: 200, top: 0, bottom: 0, height: 300 };
                }
            }
        });
        series.updateData(this.data);
        series.createPoints();
        series.getVisiblePoints = function() {
            return series.getPoints();
        };
        series.draw();

        var points = series.getAllPoints();
        points[0].vx = 0;
        points[1].vx = 90;
        points[2].vx = 180;
        points[3].vx = 270;

        $.each(points, function(_, point) {
            point.vy = 10;
        });

        series.drawTrackers();

        assert.equal(series.getNeighborPoint(200, 100), series.getPointByPos(0));
        assert.equal(series.getNeighborPoint(100, 200), series.getPointByPos(1));
        assert.equal(series.getNeighborPoint(0, 100), series.getPointByPos(2));
        assert.equal(series.getNeighborPoint(100, 0), series.getPointByPos(3));
    });

    QUnit.test("getNeighborPoint. between points", function(assert) {
        var series = createSeries({ type: seriesType, widgetType: "polar" }, {
            valueAxis: {
                getCenter: function() {
                    return { x: 100, y: 100 };
                },
                getCanvas: function() {
                    return { left: 0, right: 0, width: 200, top: 0, bottom: 0, height: 300 };
                }
            }
        });
        series.updateData(this.data);
        series.createPoints();
        series.getVisiblePoints = function() {
            return series.getPoints();
        };
        series.draw();

        var points = series.getAllPoints();
        points[0].vx = 0;
        points[1].vx = 90;
        points[2].vx = 180;
        points[3].vx = 270;

        $.each(points, function(_, point) {
            point.vy = 10;
        });

        series.drawTrackers();

        assert.equal(series.getNeighborPoint(150, 150), series.getPointByPos(1));
        assert.equal(series.getNeighborPoint(50, 150), series.getPointByPos(2));
        assert.equal(series.getNeighborPoint(50, 50), series.getPointByPos(3));
        assert.equal(series.getNeighborPoint(150, 50), series.getPointByPos(0));
    });

    QUnit.test("Visible false", function(assert) {
        assert.expect(0);
        var series = createSeries({ type: seriesType, widgetType: "polar", visible: false });
        series.updateData(this.data);
        series.createPoints();
        series.draw();
        series.drawTrackers();
    });

    QUnit.module("Legend Styles", environment);

    QUnit.test("Default style", function(assert) {
        var series = createSeries({
            type: seriesType,
            color: "n-color",
            hoverStyle: {
                color: "h-color",
                hatching: { direction: "none", opacity: 0 }
            },
            selectionStyle: {
                color: "s-color",
                hatching: { direction: "none", opacity: 0 }
            }
        });

        assert.deepEqual(series.getLegendStyles(), {
            "hover": {
                "fill": "h-color",
                "hatching": { direction: "right", opacity: 0 }
            },
            "normal": {
                "fill": "n-color",
                hatching: undefined
            },
            "selection": {
                "fill": "s-color",
                "hatching": { direction: "right", opacity: 0 }
            }
        });
    });
})();

QUnit.module("getMarginOptions", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.data = [{ arg: "arg1", val: "val1", tag: "tag1" }, { arg: "arg2", val: "val2", tag: "tag2" }];
    },
    afterEach: environment.afterEach
});

QUnit.test("Return point size", function(assert) {
    var series = createSeries({
        type: seriesType,
        point: {
            visible: true,
            size: 6
        }
    });

    assert.deepEqual(series.getMarginOptions(), {
        size: 6,
        percentStick: false,
        sizePointNormalState: 6
    });
});

QUnit.test("getMarginOptions when point is invisible", function(assert) {
    var series = createSeries({
        type: seriesType,
        point: {
            visible: false,
            size: 6
        }
    });

    assert.deepEqual(series.getMarginOptions(), {
        size: 0,
        percentStick: false,
        sizePointNormalState: 2
    });
});

QUnit.test("Add max border width", function(assert) {
    var series = createSeries({
        type: seriesType,
        point: {
            visible: true,
            size: 6,
            border: {
                visible: true,
                width: 10
            },
            hoverStyle: {
                border: {
                    visible: true,
                    width: 10
                }
            },
            selectionStyle: {
                border: {
                    visible: true,
                    width: 12
                }
            }
        }
    });

    assert.deepEqual(series.getMarginOptions(), {
        size: 30,
        percentStick: false,
        sizePointNormalState: 26
    });
});

QUnit.test("Polar point. getMarginOptions returns point size", function(assert) {
    var series = createSeries({
        type: seriesType,
        widgetType: "polar",
        point: {
            visible: true,
            size: 6
        }
    });
    assert.deepEqual(series.getMarginOptions(), {
        size: 6,
        percentStick: false,
        sizePointNormalState: 6
    });
});
