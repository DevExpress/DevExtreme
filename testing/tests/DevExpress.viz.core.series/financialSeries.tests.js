import $ from "jquery";
import * as vizMocks from "../../helpers/vizMocks.js";
import pointModule from "viz/series/points/base_point";
import SeriesModule from "viz/series/base_series";
const Series = SeriesModule.Series;
import { MockAxis, insertMockFactory, restoreMockFactory } from "../../helpers/chartMocks.js";

var createPoint = function() {
    var stub = sinon.createStubInstance(pointModule.Point);
    stub.argument = 1;
    stub.hasValue.returns(true);
    stub.hasCoords.returns(true);
    stub.isInVisibleArea.returns(true);

    stub._options = {};// see T243839
    return stub;
};
var mockPoints = [createPoint(), createPoint(), createPoint(), createPoint(), createPoint()];

var environment = {
    beforeEach: function() {
        insertMockFactory();
        var mockPointIndex = 0;
        this.renderer = new vizMocks.Renderer();
        this.seriesGroup = this.renderer.g();
        this.data = [
            { date: "arg1", high: "high1", low: "low1", open: "open1", close: "close1" }
        ];
        this.createPoint = sinon.stub(pointModule, "Point", function() {
            var stub = mockPoints[mockPointIndex++];
            stub.argument = 1;
            stub.hasValue.returns(true);
            stub.isInVisibleArea.returns(true);
            stub.draw.reset();
            stub.animate.reset();
            return stub;
        });
    },
    afterEach: function() {
        this.createPoint.restore();
        restoreMockFactory();
    }
};

var createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    var renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
        containerBackgroundColor: "containerColor",
        label: {
            visible: true,
            border: {},
            connector: {},
            font: {}
        },
        visible: true,
        border: {
            visible: true
        },
        point: {
            hoverStyle: {},
            selectionStyle: {}
        },
        valueErrorBar: {},
        hoverStyle: { hatching: "h-hatching" },
        selectionStyle: { hatching: "s-hatching" },
        hoverMode: "excludePoints",
        selectionMode: "excludePoints",
        reduction: {},
        widgetType: "chart"
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
        incidentOccurred: $.noop
    }, renderSettings);

    renderer.stub("g").reset();
    return new Series(renderSettings, options);
};

var checkGroups = function(assert, series) {
    var parentGroup = series._group,
        renderer = series._renderer,
        labelsGroup = series._extGroups.labelsGroup;
    assert.ok(parentGroup, "series created without group");

    assert.equal(renderer.stub("g").callCount, 7);
    assert.equal(renderer.stub("g").getCall(0).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-series");
    assert.equal(renderer.stub("g").getCall(1).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-markers");
    assert.equal(renderer.stub("g").getCall(2).returnValue.stub("attr").firstCall.args[0]["class"], "dxc-labels");
    assert.equal(renderer.stub("g").getCall(3).returnValue.stub("attr").firstCall.args[0]["class"], "default-markers");
    assert.equal(renderer.stub("g").getCall(4).returnValue.stub("attr").firstCall.args[0]["class"], "reduction-markers");
    assert.equal(renderer.stub("g").getCall(5).returnValue.stub("attr").firstCall.args[0]["class"], "default-positive-markers");
    assert.equal(renderer.stub("g").getCall(6).returnValue.stub("attr").firstCall.args[0]["class"], "reduction-positive-markers");

    assert.equal(series._markersGroup.stub("append").lastCall.args[0], parentGroup);
    assert.equal(series._markersGroup.defaultMarkersGroup.stub("append").lastCall.args[0], series._markersGroup);
    assert.equal(series._markersGroup.reductionMarkersGroup.stub("append").lastCall.args[0], series._markersGroup);
    assert.equal(series._markersGroup.defaultPositiveMarkersGroup.stub("append").lastCall.args[0], series._markersGroup);
    assert.equal(series._markersGroup.reductionPositiveMarkersGroup.stub("append").lastCall.args[0], series._markersGroup);
    assert.equal(series._labelsGroup.stub("append").lastCall.args[0], labelsGroup);
};

(function StockSeries() {


    var seriesType = "stock";

    QUnit.module("Creation", environment);

    QUnit.test("Creation financial point", function(assert) {
        var series = createSeries({ type: "stock", argumentField: "arg", highValueField: "h", lowValueField: "l", openValueField: "o", closeValueField: "c", reduction: { level: "open" }, label: { visible: false } }),
            data = [{ arg: 1, h: 3, l: -10, o: 1, c: -4 }],
            points;
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.ok(points, "Points should be created");
        assert.equal(points.length, 1, "Series should have one point");
        assert.equal(this.createPoint.firstCall.args[0], series, "series should be correct");
        assert.equal(this.createPoint.firstCall.args[1].argument, 1, "Argument should be correct");
        assert.equal(this.createPoint.firstCall.args[1].highValue, 3, "High value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].lowValue, -10, "Low value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].openValue, 1, "Open value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].closeValue, -4, "Close value should be correct");
    });

    QUnit.test("Creation financial series with errorBars", function(assert) {
        var series = createSeries({
                errorBars: { lowErrorValueField: "lowErrorField", highErrorValueField: "highErrorField" }, type: "stock", argumentField: "arg",
                highValueField: "h", lowValueField: "l", openValueField: "o", closeValueField: "c", reduction: { level: "open" }, label: { visible: false }
            }),
            data = [{ arg: 1, h: 3, l: -10, o: 1, c: -4, lowErrorField: 0, highErrorField: 4 }],
            points;

        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.ok(points, "Points should be created");
        assert.equal(points.length, 1, "Series should have one point");

        assert.equal(this.createPoint.firstCall.args[0], series, "series should be correct");
        assert.equal(this.createPoint.firstCall.args[1].argument, 1, "Argument should be correct");
        assert.equal(this.createPoint.firstCall.args[1].highValue, 3, "High value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].lowValue, -10, "Low value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].openValue, 1, "Open value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].closeValue, -4, "Close value should be correct");
        assert.strictEqual(this.createPoint.firstCall.args[1].lowError, undefined, "low error not passed");
        assert.strictEqual(this.createPoint.firstCall.args[1].highError, undefined, "high error not passed");
    });

    QUnit.test("Creation financial point. Default fields", function(assert) {
        var series = createSeries({ type: "stock", reduction: { level: "open" }, label: { visible: false } }),
            data = [{ date: 1, high: 3, low: -10, open: 1, close: -4 }],
            points;

        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.ok(points, "Points should be created");
        assert.equal(points.length, 1, "Series should have one point");
        assert.equal(this.createPoint.firstCall.args[0], series, "series should be correct");
        assert.equal(this.createPoint.firstCall.args[1].argument, 1, "Argument should be correct");
        assert.equal(this.createPoint.firstCall.args[1].highValue, 3, "High value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].lowValue, -10, "Low value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].openValue, 1, "Open value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].closeValue, -4, "Close value should be correct");
    });

    QUnit.test("getMarginOptions", function(assert) {
        var series = createSeries({
            type: "stock",
            reduction: { level: "open" },
            label: { visible: false },
            width: 2,
            hoverStyle: {
                width: 3
            },
            selectionStyle: {
                width: 4
            }
        });

        assert.deepEqual(series.getMarginOptions(), {
            size: 14,
            percentStick: false,
            sizePointNormalState: 10
        });
    });

    QUnit.test("IncidentOccurred. Data without value fields", function(assert) {
        const data = [{ arg: 1 }, { arg: 2 }];
        const incidentOccurred = sinon.spy();
        const options = {
            type: "stock",
            argumentField: "arg",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            label: { visible: false }
        };
        const series = createSeries(options, {
            incidentOccurred: incidentOccurred
        });

        series.updateData(data);
        series.createPoints();

        assert.strictEqual(incidentOccurred.callCount, 4);
        assert.strictEqual(incidentOccurred.lastCall.args[0], "W2002");
    });

    QUnit.test("Creation financial point. Null values, ingoreEmptyPoints false", function(assert) {
        var series = createSeries({ type: "stock", argumentField: "arg", highValueField: "h", lowValueField: "l", openValueField: "o", closeValueField: "c", reduction: { level: "open" }, label: { visible: false } }),
            data = [{ arg: 1, h: null, l: null, o: null, c: null }],
            points;
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.equal(points.length, 1, "Series should have one point");
        assert.equal(this.createPoint.firstCall.args[1].argument, 1, "Argument should be correct");
        assert.equal(this.createPoint.firstCall.args[1].highValue, null, "High value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].lowValue, null, "Low value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].openValue, null, "Open value should be correct");
        assert.equal(this.createPoint.firstCall.args[1].closeValue, null, "Close value should be correct");
    });

    QUnit.test("Creation financial point. Null values, ingoreEmptyPoints true", function(assert) {
        var series = createSeries({ type: "stock", ignoreEmptyPoints: true, argumentField: "arg", highValueField: "h", lowValueField: "l", openValueField: "o", closeValueField: "c", reduction: { level: "open" }, label: { visible: false } }),
            data = [{ arg: 1, h: null, l: null, o: null, c: null }],
            points;
        series.updateData(data);
        series.createPoints();
        points = series.getPoints();

        assert.equal(points.length, 0);
    });

    QUnit.module("StockSeries series. Draw", {
        beforeEach: environment.beforeEach,
        afterEach: environment.afterEach,
        createSeries: function(options) {
            return createSeries(options, {
                renderer: this.renderer,
                argumentAxis: new MockAxis({ renderer: this.renderer }),
                valueAxis: new MockAxis({ renderer: this.renderer })
            });
        },
    });

    QUnit.test("Draw without data", function(assert) {
        var series = this.createSeries({
            type: seriesType,
            point: { visible: false }
        });
        // act
        series.draw(false);
        // assert

        checkGroups(assert, series);

    });

    QUnit.test("Draw simple data without animation", function(assert) {
        var series = this.createSeries({
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
        assert.ok(series._points.length, "points");
        $.each(series._points, function(i, p) {
            assert.equal(p.animate.callCount, 0, i + " point draw without animate");
        });
    });

    QUnit.test("Draw simple data with animation", function(assert) {
        var series = this.createSeries({
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
        series.draw(true);
        // assert
        checkGroups(assert, series);

        assert.ok(series._points.length, "points");
        $.each(series._points, function(i, p) {
            assert.equal(p.animate.callCount, 0, i + " point draw with animate");
        });

    });

    QUnit.test("Create groups without animation. T101152", function(assert) {
        var series = this.createSeries({
            type: seriesType,
            point: { visible: false }
        });
        // act
        series.draw(false);
        // assert

        assert.ok(series._labelsGroup);
        assert.deepEqual(series._labelsGroup._stored_settings, {
            "class": "dxc-labels",
            "clip-path": undefined,
            "pointer-events": "none",
            "opacity": null,
            "scale": null,
            "translateY": null
        });
        assert.ok(series._markersGroup);
    });


    QUnit.test("Create groups with animation. T101152", function(assert) {
        var series = this.createSeries({
            type: seriesType,
            point: { visible: false }
        });
        // act
        series.draw(true);
        // assert

        assert.ok(series._labelsGroup);
        assert.deepEqual(series._labelsGroup._stored_settings, {
            "class": "dxc-labels",
            "clip-path": undefined,
            "pointer-events": "none",
            "opacity": null,
            "scale": null,
            "translateY": null
        });
        assert.ok(series._markersGroup);
    });

    QUnit.module("StockSeries. Points animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [
                { date: "arg1", high: "high1", low: "low1", open: "open1", close: "close1" }
            ];
            this.series = createSeries({
                type: seriesType,
                point: { visible: true }
            }, {
                renderer: this.renderer,
                argumentAxis: new MockAxis({ renderer: this.renderer }),
                valueAxis: new MockAxis({ renderer: this.renderer })
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
        assert.ok(series._points.length);
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
        assert.ok(series._points.length);
        $.each(series._points, function(i, p) {
            assert.ok(p.draw.calledOnce);
            assert.equal(p.draw.firstCall.args[0], series._renderer, "renderer pass to point " + i);
            assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, "markers group pass to point " + i);
            assert.equal(p.draw.firstCall.args[2], true, "animation should be enabled " + i);
        });
    });


    QUnit.module("StockSeries Color", {
        beforeEach: function() {
            environment.beforeEach.call(this);

            this.data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: null, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }];


        },
        afterEach: environment.afterEach
    });
    var checkPointData = function(assert, pointData, isReduction, index) {
        assert.equal(pointData.isReduction, isReduction, "point" + index + " was created with incorrect reduction flag");
    };
    QUnit.test("Level is default (close)", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "red" }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.equal(series.level, "close", "calc level");
        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], false, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], true, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], false, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.test("Level is open", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "green", level: "open" }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.equal(series.level, "open");
        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], true, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], false, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], true, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.test("double updateData", function(assert) {
        var data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }],
            series = createSeries({
                type: seriesType,
                argumentField: "date",
                openValueField: "o",
                highValueField: "h",
                lowValueField: "l",
                closeValueField: "c",
                reduction: { color: "green", level: "open" }
            });
        series.updateData(data);
        series.createPoints();
        // Act
        series.updateData(data);
        series.createPoints();
        // Assert
        assert.equal(series.level, "open");

        assert.equal(series._points.length, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], true, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], false, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], true, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);

        var point = series._points;
        checkPointData(assert, point[0].update.lastCall.args[0], false, 0);
        checkPointData(assert, point[1].update.lastCall.args[0], true, 1);
        checkPointData(assert, point[2].update.lastCall.args[0], false, 2);
        checkPointData(assert, point[3].update.lastCall.args[0], true, 3);
        checkPointData(assert, point[4].update.lastCall.args[0], false, 4);
    });

    QUnit.test("Level is high", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "green", level: "high" }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.equal(series.level, "high");

        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], false, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], true, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], false, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.test("Level is low", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "green", level: "low" }
        });
        series.updateData(this.data);
        series.createPoints();
        assert.equal(series.level, "low");


        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], false, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], false, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], true, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.test("Check reduction if data source contains empty data items", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "red" }
        });

        series.updateData([{ date: 1, o: 2, h: 5, l: 0, c: 4 },
            { date: 2, o: 1, h: 7, l: 1, c: 6 },
            { date: 2.5, val: 3 },
            { date: 3, o: 5, h: 5, l: 3, c: 3 },
            { date: null, o: 5, h: 5, l: 3, c: 3 },
            { date: 4, o: 4, h: 9, l: 2, c: null },
            { date: 5, o: 4, h: 9, l: 2, c: 5 }]);
        series.createPoints();

        assert.equal(series.level, "close", "calc level");
        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], false, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], true, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], false, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.module("StockSeries. Styles", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: null, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Style in point", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width"
            },
            selectionStyle: { width: "s-width" },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(this.createPoint.getCall(0).args[2].styles, {
            hover: {
                fill: "mainSeriesColor",
                stroke: "mainSeriesColor",
                "stroke-width": "h-width"
            },
            normal: {
                "stroke-width": "n-width"
            },
            selection: {
                fill: "mainSeriesColor",
                "stroke-width": "s-width",
                stroke: "mainSeriesColor"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "mainSeriesColor",
                    "stroke-width": "h-width"
                },
                normal: {
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "mainSeriesColor"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    "stroke-width": "n-width"

                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            },
            reduction: {
                hover: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "reduction",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            }
        });
    });

    QUnit.test("Style in point groups", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width"
            },
            selectionStyle: { width: "s-width" },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        }, {
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });
        series.updateData(this.data);
        series.createPoints();
        series.draw(false);

        assert.deepEqual(series._markersGroup.defaultMarkersGroup._stored_settings, {
            "class": "default-markers",
            fill: "mainSeriesColor",
            stroke: "mainSeriesColor",
            "stroke-width": "n-width"
        });

        assert.deepEqual(series._markersGroup.defaultPositiveMarkersGroup._stored_settings, {
            "class": "default-positive-markers",
            fill: "innerColor",
            stroke: "mainSeriesColor",
            "stroke-width": "n-width"
        });

        assert.deepEqual(series._markersGroup.reductionMarkersGroup._stored_settings, {
            "class": "reduction-markers",
            fill: "reduction",
            stroke: "reduction",
            "stroke-width": "n-width"
        });

        assert.deepEqual(series._markersGroup.reductionPositiveMarkersGroup._stored_settings, {
            "class": "reduction-positive-markers",
            fill: "innerColor",
            stroke: "reduction",
            "stroke-width": "n-width"
        });
    });

    QUnit.test("Create Point styles. default colors", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width"
            },
            selectionStyle: { width: "s-width" },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series._getPointOptions().styles, {
            hover: {
                fill: "mainSeriesColor",
                stroke: "mainSeriesColor",
                "stroke-width": "h-width"
            },
            normal: {
                fill: "mainSeriesColor",
                stroke: "mainSeriesColor",
                "stroke-width": "n-width"
            },
            selection: {
                fill: "mainSeriesColor",
                "stroke-width": "s-width",
                stroke: "mainSeriesColor"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "mainSeriesColor",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "mainSeriesColor",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "mainSeriesColor"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            },
            reduction: {
                hover: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "reduction",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            }
        });
    });

    QUnit.test("Create Point styles. with defined series color", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            color: "seriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width"
            },
            selectionStyle: { width: "s-width" },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series._getPointOptions().styles, {
            hover: {
                fill: "seriesColor",
                stroke: "seriesColor",
                "stroke-width": "h-width"
            },
            normal: {
                fill: "seriesColor",
                stroke: "seriesColor",
                "stroke-width": "n-width"
            },
            selection: {
                fill: "seriesColor",
                "stroke-width": "s-width",
                stroke: "seriesColor"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "seriesColor",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "seriesColor",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "seriesColor"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            },
            reduction: {
                hover: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "reduction",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            }
        });
    });

    QUnit.test("Create Point styles. with defined series color with hatching", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            color: "seriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width",
                hatching: { hoverHatchingField: true }
            },
            selectionStyle: {
                width: "s-width",
                hatching: { selectHatchingField: true }
            },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series._getPointOptions().styles, {
            hover: {
                fill: "seriesColor",
                stroke: "seriesColor",
                "stroke-width": "h-width"
            },
            normal: {
                fill: "seriesColor",
                stroke: "seriesColor",
                "stroke-width": "n-width"
            },
            selection: {
                fill: "seriesColor",
                "stroke-width": "s-width",
                stroke: "seriesColor"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "seriesColor",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "seriesColor",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "seriesColor"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            },
            reduction: {
                hover: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "reduction",
                    "stroke-width": "s-width",
                    stroke: "reduction"
                }
            }
        });
    });

    QUnit.test("Create Point styles. with. Custom colors ", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                color: "h-color",
                width: "h-width"
            },
            selectionStyle: {
                width: "s-width",
                color: "s-color"
            },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series._getPointOptions().styles, {
            hover: {
                fill: "h-color",
                stroke: "h-color",
                "stroke-width": "h-width"
            },
            normal: {
                fill: "mainSeriesColor",
                stroke: "mainSeriesColor",
                "stroke-width": "n-width"
            },
            selection: {
                fill: "s-color",
                "stroke-width": "s-width",
                stroke: "s-color"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "h-color",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "mainSeriesColor",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "s-color"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "h-color",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "s-color"
                }
            },
            reduction: {
                hover: {
                    fill: "h-color",
                    stroke: "h-color",
                    "stroke-width": "h-width"
                },
                normal: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "s-color",
                    "stroke-width": "s-width",
                    stroke: "s-color"
                }
            }
        });


    });

    QUnit.module("StockSeries. Customize Point", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: null, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }];
        },
        afterEach: environment.afterEach
    });
    QUnit.test("Customize Point", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width"
            },
            selectionStyle: { width: "s-width" },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor",
            customizePoint: function() {
                return {
                    color: "c-n-color", width: "c-n-width",
                    hoverStyle: { color: "c-h-color", width: "c-h-width" },
                    selectionStyle: { color: "c-s-color", width: "c-s-width" }
                };
            }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series.getAllPoints()[0].updateOptions.lastCall.args[0].styles, {
            usePointCustomOptions: true,
            useLabelCustomOptions: undefined,
            hover: {
                fill: "c-h-color",
                stroke: "c-h-color",
                "stroke-width": "c-h-width"
            },
            normal: {
                fill: "c-n-color",
                "stroke-width": "c-n-width",
                stroke: "c-n-color"
            },
            selection: {
                fill: "c-s-color",
                "stroke-width": "c-s-width",
                stroke: "c-s-color"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "c-h-color",
                    "stroke-width": "c-h-width"
                },
                normal: {
                    fill: "innerColor",
                    "stroke-width": "c-n-width",
                    stroke: "c-n-color"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "c-s-width",
                    stroke: "c-s-color"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "c-h-color",
                    "stroke-width": "c-h-width"
                },
                normal: {
                    fill: "innerColor",
                    "stroke-width": "c-n-width",
                    stroke: "reduction",

                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "c-s-width",
                    stroke: "c-s-color"
                }
            },
            reduction: {
                hover: {
                    fill: "c-h-color",
                    stroke: "c-h-color",
                    "stroke-width": "c-h-width"
                },
                normal: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "c-n-width"
                },
                selection: {
                    fill: "c-s-color",
                    "stroke-width": "c-s-width",
                    stroke: "c-s-color"
                }
            }
        });
    });
    QUnit.module("Stock. API", {
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

        assert.deepEqual(series.getValueFields(), ["open", "high", "low", "close"]);
    });

    QUnit.test("getValueFields", function(assert) {
        var series = createSeries({
            type: seriesType,
            valueField: "customValueField",
            openValueField: "customOpenField",
            closeValueField: "customCloseField",
            highValueField: "customHighField",
            lowValueField: "customLowField"
        });

        assert.deepEqual(series.getValueFields(), ["customOpenField", "customHighField", "customLowField", "customCloseField"]);
    });

    QUnit.test("getArgumentField default", function(assert) {
        var series = createSeries({
            type: seriesType
        });

        assert.deepEqual(series.getArgumentField(), "date");
    });

    QUnit.test("getArgumentField", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "customArgumentField"
        });

        assert.deepEqual(series.getArgumentField(), "customArgumentField");
    });

    QUnit.test("areErrorBarsVisible", function(assert) {
        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "fixed",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "fixed, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "percent",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "percent, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "stdError",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "stdError, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "stdDeviation",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "stdDeviation, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "Variance",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "Variance, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "unknown",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "unknown, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "unknown",
                lowValueField: "field",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "unknown, displayMode all, lowValueField defined");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "unknown",
                highValueField: "field",
                displayMode: "all"
            }
        }).areErrorBarsVisible(), "unknown, displayMode all, highValueField defined");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "fixed",
                displayMode: "none"
            }
        }).areErrorBarsVisible(), "fixed, displayMode none");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "fixed",
                displayMode: "all"
            }
        }).updateDataType({ valueAxisType: "discrete" }).areErrorBarsVisible(), "fixed, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "fixed",
                displayMode: "all"
            }
        }).updateDataType({ valueAxisType: "logarithmic" }).areErrorBarsVisible(), "fixed, displayMode all");

        assert.ok(!createSeries({
            type: seriesType,
            valueErrorBar: {
                type: "fixed",
                displayMode: "all"
            }
        }).updateDataType({ valueType: "datetime" }).areErrorBarsVisible(), "fixed, displayMode all");

    });

    QUnit.module("Null points", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.options = {
                type: "stock"
            };
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Argument is undefined", function(assert) {
        var data = [{ date: undefined, open: 1, close: 1, low: 1, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Argument is null", function(assert) {
        var data = [{ date: null, open: 1, close: 1, low: 1, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Open is undefined", function(assert) {
        var data = [{ date: 1, open: undefined, close: 1, low: 1, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Open is null", function(assert) {
        var data = [{ date: 1, open: null, close: 1, low: 1, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 1);
    });

    QUnit.test("Close is undefined", function(assert) {
        var data = [{ date: 1, open: 1, close: undefined, low: 1, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Close is null", function(assert) {
        var data = [{ date: 1, open: 1, close: null, low: 1, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 1);
    });

    QUnit.test("Low is undefined", function(assert) {
        var data = [{ date: 1, open: 1, close: 1, low: undefined, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test("Low is null", function(assert) {
        var data = [{ date: 1, open: 1, close: 1, low: null, high: 1 }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 1);
    });

    QUnit.test("High is undefined", function(assert) {
        var data = [{ date: 1, open: 1, close: 1, low: 1, high: undefined }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 0);
    });

    QUnit.test("High is null", function(assert) {
        var data = [{ date: 1, open: 1, close: 1, low: 1, high: null }],
            series = createSeries(this.options);

        series.updateData(data);
        series.createPoints();

        assert.equal(series._points.length, 1);
    });

    QUnit.module("Series visibility", environment);

    QUnit.test("Hide visible series", function(assert) {
        var series = createSeries({
            type: "stock",
            argumentField: "arg",
            visible: true,
            visibilityChanged: sinon.spy(),
            point: { visible: true }
        });
        series.updateData([{ arg: 1, open: 1, close: 1, low: 1, high: 1 }, { arg: 2, open: 1, close: 1, low: 1, high: 1 }, { arg: 3, open: 1, close: 1, low: 1, high: 1 }, { arg: 4, open: 1, close: 1, low: 1, high: 1 }]);
        series.createPoints();

        series.hide();

        var points = series.getPoints();
        // see T243839
        $.each(points, function(_, point) {
            assert.ok(point._options.visible === false);
        });
    });

    QUnit.test("Show invisible series", function(assert) {
        var series = createSeries({
            type: "stock",
            argumentField: "arg",
            visible: false,
            visibilityChanged: sinon.spy(),
            point: { visible: false }
        });
        series.updateData([{ arg: 1, open: 1, close: 1, low: 1, high: 1 }, { arg: 2, open: 1, close: 1, low: 1, high: 1 }, { arg: 3, open: 1, close: 1, low: 1, high: 1 }, { arg: 4, open: 1, close: 1, low: 1, high: 1 }]);
        series.createPoints();

        series.show();

        var points = series.getPoints();
        // see T243839
        $.each(points, function(_, point) {
            assert.ok(point._options.visible === true);
        });
    });
})();

(function CandleStick() {

    var seriesType = "candlestick";

    QUnit.module("CandleStick series. Draw", {
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

    QUnit.test("Draw without data", function(assert) {
        var series = this.createSeries({
            type: seriesType,
            point: { visible: false }
        });
        // act
        series.draw(false);
        // assert

        checkGroups(assert, series);
    });

    QUnit.test("Draw simple data without animation", function(assert) {
        var series = this.createSeries({
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
        assert.ok(series._points.length, "points");
        $.each(series._points, function(i, p) {
            assert.equal(p.animate.callCount, 0, i + " point draw without animate");
        });
    });

    QUnit.test("Draw simple data with animation", function(assert) {
        var series = this.createSeries({
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
        series.draw(true);
        // assert
        checkGroups(assert, series);

        assert.ok(series._points.length, "points");
        $.each(series._points, function(i, p) {
            assert.equal(p.animate.callCount, 0, i + " point draw with animate");
        });

    });

    QUnit.module("CandleStick. Points animation", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [
                { date: "arg1", high: "high1", low: "low1", open: "open1", close: "close1" }
            ];
            this.series = createSeries({
                type: seriesType,
                point: { visible: true }
            }, {
                renderer: this.renderer,
                argumentAxis: new MockAxis({ renderer: this.renderer }),
                valueAxis: new MockAxis({ renderer: this.renderer })
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
        assert.ok(series._points.length);
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
        assert.ok(series._points.length);
        $.each(series._points, function(i, p) {
            assert.ok(p.draw.calledOnce);
            assert.equal(p.draw.firstCall.args[0], series._renderer, "renderer pass to point " + i);
            assert.equal(p.draw.firstCall.args[1].markers, series._markersGroup, "markers group pass to point " + i);
            assert.equal(p.draw.firstCall.args[2], true, "animation should be enabled " + i);
        });
    });


    QUnit.module("CandleStick Color", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: null, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }];
        },
        afterEach: environment.afterEach
    });
    var checkPointData = function(assert, pointData, isReduction, index) {
        assert.equal(pointData.isReduction, isReduction, "point" + index + " was created with incorrect reduction flag");
    };
    QUnit.test("Level is default (close)", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "red" }
        });

        series.updateData(this.data);
        series.createPoints();

        assert.equal(series.level, "close", "calc level");
        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], false, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], true, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], false, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.test("Level is open", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "green", level: "open" }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.equal(series.level, "open");
        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], true, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], false, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], true, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.test("double updateData", function(assert) {
        var data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }],
            series = createSeries({
                type: seriesType,
                argumentField: "date",
                openValueField: "o",
                highValueField: "h",
                lowValueField: "l",
                closeValueField: "c",
                reduction: { color: "green", level: "open" }
            });
        series.updateData(data);
        series.createPoints();
        // Act
        series.updateData(data);
        series.createPoints();
        // Assert
        assert.equal(series.level, "open");

        assert.equal(series._points.length, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], true, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], false, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], true, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);

        var point = series._points;
        checkPointData(assert, point[0].update.lastCall.args[0], false, 0);
        checkPointData(assert, point[1].update.lastCall.args[0], true, 1);
        checkPointData(assert, point[2].update.lastCall.args[0], false, 2);
        checkPointData(assert, point[3].update.lastCall.args[0], true, 3);
        checkPointData(assert, point[4].update.lastCall.args[0], false, 4);
    });

    QUnit.test("Level is high", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "green", level: "high" }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.equal(series.level, "high");

        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], false, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], true, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], false, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.test("Level is low", function(assert) {
        var series = createSeries({
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "green", level: "low" }
        });
        series.updateData(this.data);
        series.createPoints();
        assert.equal(series.level, "low");


        assert.equal(this.createPoint.callCount, 5);

        checkPointData(assert, this.createPoint.getCall(0).args[1], false, 0);
        checkPointData(assert, this.createPoint.getCall(1).args[1], false, 1);
        checkPointData(assert, this.createPoint.getCall(2).args[1], false, 2);
        checkPointData(assert, this.createPoint.getCall(3).args[1], true, 3);
        checkPointData(assert, this.createPoint.getCall(4).args[1], false, 4);
    });

    QUnit.module("CandleStick. Styles", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: null, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }];

        },
        afterEach: environment.afterEach
    });

    QUnit.test("Point in style", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width"
            },
            selectionStyle: { width: "s-width" },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(this.createPoint.getCall(0).args[2].styles, {
            hover: {
                fill: "mainSeriesColor",
                stroke: "mainSeriesColor",
                "stroke-width": "h-width",
                hatching: "h-hatching"
            },
            normal: {
                "stroke-width": "n-width"
            },
            selection: {
                fill: "mainSeriesColor",
                "stroke-width": "s-width",
                stroke: "mainSeriesColor",
                hatching: "s-hatching"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "mainSeriesColor",
                    "stroke-width": "h-width",
                    hatching: "h-hatching"
                },
                normal: {
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "mainSeriesColor",
                    hatching: "s-hatching"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "reduction",
                    "stroke-width": "h-width",
                    hatching: "h-hatching"
                },
                normal: {
                    "stroke-width": "n-width"

                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "s-width",
                    stroke: "reduction",
                    hatching: "s-hatching"
                }
            },
            reduction: {
                hover: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "h-width",
                    hatching: "h-hatching"
                },
                normal: {
                    "stroke-width": "n-width"
                },
                selection: {
                    fill: "reduction",
                    "stroke-width": "s-width",
                    stroke: "reduction",
                    hatching: "s-hatching"
                }
            }
        });
    });

    QUnit.test("Style in point groups", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            hoverStyle: {
                width: "h-width"
            },
            selectionStyle: { width: "s-width" },
            width: "n-width",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor"
        }, {
            renderer: this.renderer,
            argumentAxis: new MockAxis({ renderer: this.renderer }),
            valueAxis: new MockAxis({ renderer: this.renderer })
        });
        series.updateData(this.data);
        series.createPoints();
        series.draw(false);

        assert.deepEqual(series._markersGroup.defaultMarkersGroup._stored_settings, {
            "class": "default-markers",
            fill: "mainSeriesColor",
            stroke: "mainSeriesColor",
            "stroke-width": "n-width",
            hatching: undefined
        });

        assert.deepEqual(series._markersGroup.defaultPositiveMarkersGroup._stored_settings, {
            "class": "default-positive-markers",
            fill: "innerColor",
            stroke: "mainSeriesColor",
            "stroke-width": "n-width"
        });

        assert.deepEqual(series._markersGroup.reductionMarkersGroup._stored_settings, {
            "class": "reduction-markers",
            fill: "reduction",
            stroke: "reduction",
            "stroke-width": "n-width",
            hatching: undefined
        });

        assert.deepEqual(series._markersGroup.reductionPositiveMarkersGroup._stored_settings, {
            "class": "reduction-positive-markers",
            fill: "innerColor",
            stroke: "reduction",
            "stroke-width": "n-width"
        });
    });

    QUnit.test("Create Point styles. default colors", function(assert) {
        var series = createSeries({
                mainSeriesColor: "mainSeriesColor",
                type: seriesType,
                argumentField: "date",
                openValueField: "o",
                highValueField: "h",
                lowValueField: "l",
                closeValueField: "c",
                hoverStyle: {
                    width: "h-width"
                },
                selectionStyle: { width: "s-width" },
                width: "n-width",
                reduction: { color: "reduction", level: "high" },
                innerColor: "innerColor"
            }),
            styles;
        series.updateData(this.data);
        series.createPoints();

        styles = series._getPointOptions().styles;

        assert.strictEqual(styles.hover.fill, "mainSeriesColor", "hover.fill color");
        assert.strictEqual(styles.hover.stroke, "mainSeriesColor", "hover.stroke color");

        assert.strictEqual(styles.normal.fill, "mainSeriesColor", "normal.fill color");
        assert.strictEqual(styles.normal.stroke, "mainSeriesColor", "normal.stroke color");

        assert.strictEqual(styles.selection.fill, "mainSeriesColor", "selection.fill color");
        assert.strictEqual(styles.selection.stroke, "mainSeriesColor", "selection.stroke color");

        assert.strictEqual(styles.positive.hover.fill, "innerColor", "positive.hover.fill color");
        assert.strictEqual(styles.positive.hover.stroke, "mainSeriesColor", "positive.hover.stroke color");

        assert.strictEqual(styles.positive.normal.fill, "innerColor", "positive.normal.fill color");
        assert.strictEqual(styles.positive.normal.stroke, "mainSeriesColor", "positive.normal.stroke color");

        assert.strictEqual(styles.positive.selection.fill, "innerColor", "positive.selection.fill color");
        assert.strictEqual(styles.positive.selection.stroke, "mainSeriesColor", "positive.selection.stroke color");

        assert.strictEqual(styles.reductionPositive.hover.fill, "innerColor", "reductionPositive.hover.fill color");
        assert.strictEqual(styles.reductionPositive.hover.stroke, "reduction", "reductionPositive.hover.stroke color");

        assert.strictEqual(styles.reductionPositive.normal.fill, "innerColor", "reductionPositive.normal.fill color");
        assert.strictEqual(styles.reductionPositive.normal.stroke, "reduction", "reductionPositive.normal.stroke color");

        assert.strictEqual(styles.reductionPositive.selection.fill, "innerColor", "reductionPositive.selection.fill color");
        assert.strictEqual(styles.reductionPositive.selection.stroke, "reduction", "reductionPositive.selection.stroke color");

        assert.strictEqual(styles.reduction.hover.fill, "reduction", "reduction.hover.fill color");
        assert.strictEqual(styles.reduction.hover.stroke, "reduction", "reduction.hover.stroke color");

        assert.strictEqual(styles.reduction.normal.fill, "reduction", "reduction.normal.fill color");
        assert.strictEqual(styles.reduction.normal.stroke, "reduction", "reduction.normal.stroke color");

        assert.strictEqual(styles.reduction.selection.fill, "reduction", "reduction.selection.fill color");
        assert.strictEqual(styles.reduction.selection.stroke, "reduction", "reduction.selection.stroke color");
    });

    QUnit.test("Create Point styles. with defined series color", function(assert) {
        var series = createSeries({
                mainSeriesColor: "mainSeriesColor",
                color: "seriesColor",
                type: seriesType,
                argumentField: "date",
                openValueField: "o",
                highValueField: "h",
                lowValueField: "l",
                closeValueField: "c",
                reduction: { color: "reduction", level: "high" },
                innerColor: "innerColor"
            }),
            styles;

        series.updateData(this.data);
        series.createPoints();
        styles = series._getPointOptions().styles;

        assert.strictEqual(styles.hover.fill, "seriesColor", "hover.fill color");
        assert.strictEqual(styles.hover.stroke, "seriesColor", "hover.stroke color");

        assert.strictEqual(styles.normal.fill, "seriesColor", "normal.fill color");
        assert.strictEqual(styles.normal.stroke, "seriesColor", "normal.stroke color");

        assert.strictEqual(styles.selection.fill, "seriesColor", "selection.fill color");
        assert.strictEqual(styles.selection.stroke, "seriesColor", "selection.stroke color");

        assert.strictEqual(styles.positive.hover.fill, "innerColor", "positive.hover.fill color");
        assert.strictEqual(styles.positive.hover.stroke, "seriesColor", "positive.hover.stroke color");

        assert.strictEqual(styles.positive.normal.fill, "innerColor", "positive.normal.fill color");
        assert.strictEqual(styles.positive.normal.stroke, "seriesColor", "positive.normal.stroke color");

        assert.strictEqual(styles.positive.selection.fill, "innerColor", "positive.selection.fill color");
        assert.strictEqual(styles.positive.selection.stroke, "seriesColor", "positive.selection.stroke color");

        assert.strictEqual(styles.reductionPositive.hover.fill, "innerColor", "reductionPositive.hover.fill color");
        assert.strictEqual(styles.reductionPositive.hover.stroke, "reduction", "reductionPositive.hover.stroke color");

        assert.strictEqual(styles.reductionPositive.normal.fill, "innerColor", "reductionPositive.normal.fill color");
        assert.strictEqual(styles.reductionPositive.normal.stroke, "reduction", "reductionPositive.normal.stroke color");

        assert.strictEqual(styles.reductionPositive.selection.fill, "innerColor", "reductionPositive.selection.fill color");
        assert.strictEqual(styles.reductionPositive.selection.stroke, "reduction", "reductionPositive.selection.stroke color");

        assert.strictEqual(styles.reduction.hover.fill, "reduction", "reduction.hover.fill color");
        assert.strictEqual(styles.reduction.hover.stroke, "reduction", "reduction.hover.stroke color");

        assert.strictEqual(styles.reduction.normal.fill, "reduction", "reduction.normal.fill color");
        assert.strictEqual(styles.reduction.normal.stroke, "reduction", "reduction.normal.stroke color");

        assert.strictEqual(styles.reduction.selection.fill, "reduction", "reduction.selection.fill color");
        assert.strictEqual(styles.reduction.selection.stroke, "reduction", "reduction.selection.stroke color");
    });

    QUnit.test("Create Point styles. with Custom colors ", function(assert) {
        var series = createSeries({
                mainSeriesColor: "mainSeriesColor",
                type: seriesType,
                argumentField: "date",
                openValueField: "o",
                highValueField: "h",
                lowValueField: "l",
                closeValueField: "c",
                hoverStyle: {
                    color: "h-color",
                },
                selectionStyle: {
                    color: "s-color"
                },
                reduction: { color: "reduction", level: "high" },
                innerColor: "innerColor"
            }, { renderer: this.renderer }),
            styles;
        series.updateData(this.data);
        series.createPoints();

        styles = series._getPointOptions().styles;
        assert.strictEqual(styles.hover.fill, "h-color", "hover.fill color");
        assert.strictEqual(styles.hover.stroke, "h-color", "hover.stroke color");

        assert.strictEqual(styles.normal.fill, "mainSeriesColor", "normal.fill color");
        assert.strictEqual(styles.normal.stroke, "mainSeriesColor", "normal.stroke color");

        assert.strictEqual(styles.selection.fill, "s-color", "selection.fill color");
        assert.strictEqual(styles.selection.stroke, "s-color", "selection.stroke color");

        assert.strictEqual(styles.positive.hover.fill, "innerColor", "positive.hover.fill color");
        assert.strictEqual(styles.positive.hover.stroke, "h-color", "positive.hover.stroke color");

        assert.strictEqual(styles.positive.normal.fill, "innerColor", "positive.normal.fill color");
        assert.strictEqual(styles.positive.normal.stroke, "mainSeriesColor", "positive.normal.stroke color");

        assert.strictEqual(styles.positive.selection.fill, "innerColor", "positive.selection.fill color");
        assert.strictEqual(styles.positive.selection.stroke, "s-color", "positive.selection.stroke color");

        assert.strictEqual(styles.reductionPositive.hover.fill, "innerColor", "reductionPositive.hover.fill color");
        assert.strictEqual(styles.reductionPositive.hover.stroke, "h-color", "reductionPositive.hover.stroke color");

        assert.strictEqual(styles.reductionPositive.normal.fill, "innerColor", "reductionPositive.normal.fill color");
        assert.strictEqual(styles.reductionPositive.normal.stroke, "reduction", "reductionPositive.normal.stroke color");

        assert.strictEqual(styles.reductionPositive.selection.fill, "innerColor", "reductionPositive.selection.fill color");
        assert.strictEqual(styles.reductionPositive.selection.stroke, "s-color", "reductionPositive.selection.stroke color");

        assert.strictEqual(styles.reduction.hover.fill, "h-color", "reduction.hover.fill color");
        assert.strictEqual(styles.reduction.hover.stroke, "h-color", "reduction.hover.stroke color");

        assert.strictEqual(styles.reduction.normal.fill, "reduction", "reduction.normal.fill color");
        assert.strictEqual(styles.reduction.normal.stroke, "reduction", "reduction.normal.stroke color");

        assert.strictEqual(styles.reduction.selection.fill, "s-color", "reduction.selection.fill color");
        assert.strictEqual(styles.reduction.selection.stroke, "s-color", "reduction.selection.stroke color");
    });

    QUnit.module("CandleStick. Customize Point", {
        beforeEach: function() {
            environment.beforeEach.call(this);
            this.data = [{ date: 1, o: 2, h: 5, l: 0, c: 4 },
                { date: 2, o: 1, h: 7, l: 1, c: 6 },
                { date: 3, o: 5, h: 5, l: 3, c: 3 },
                { date: null, o: 5, h: 5, l: 3, c: 3 },
                { date: 4, o: 4, h: 9, l: 2, c: null },
                { date: 5, o: 4, h: 9, l: 2, c: 5 }];
        },
        afterEach: environment.afterEach
    });

    QUnit.test("Customize Point", function(assert) {
        var series = createSeries({
            mainSeriesColor: "mainSeriesColor",
            type: seriesType,
            argumentField: "date",
            openValueField: "o",
            highValueField: "h",
            lowValueField: "l",
            closeValueField: "c",
            reduction: { color: "reduction", level: "high" },
            innerColor: "innerColor",
            customizePoint: function() {
                return {
                    color: "c-n-color", width: "c-n-width",
                    hoverStyle: { color: "c-h-color", width: "c-h-width", hatching: "c-h-hatching" },
                    selectionStyle: { color: "c-s-color", width: "c-s-width", hatching: "c-s-hatching" }
                };
            }
        });
        series.updateData(this.data);
        series.createPoints();

        assert.deepEqual(series.getAllPoints()[0].updateOptions.lastCall.args[0].styles, {
            usePointCustomOptions: true,
            useLabelCustomOptions: undefined,
            hover: {
                fill: "c-h-color",
                stroke: "c-h-color",
                "stroke-width": "c-h-width",
                hatching: "c-h-hatching"
            },
            normal: {
                fill: "c-n-color",
                "stroke-width": "c-n-width",
                stroke: "c-n-color",
                hatching: undefined
            },
            selection: {
                fill: "c-s-color",
                "stroke-width": "c-s-width",
                stroke: "c-s-color",
                hatching: "c-s-hatching"
            },
            positive: {
                hover: {
                    fill: "innerColor",
                    stroke: "c-h-color",
                    "stroke-width": "c-h-width",
                    hatching: "c-h-hatching"
                },
                normal: {
                    fill: "innerColor",
                    "stroke-width": "c-n-width",
                    stroke: "c-n-color"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "c-s-width",
                    stroke: "c-s-color",
                    hatching: "c-s-hatching"
                }
            },
            reductionPositive: {
                hover: {
                    fill: "innerColor",
                    stroke: "c-h-color",
                    "stroke-width": "c-h-width",
                    hatching: "c-h-hatching"
                },
                normal: {
                    fill: "innerColor",
                    "stroke-width": "c-n-width",
                    stroke: "reduction"
                },
                selection: {
                    fill: "innerColor",
                    "stroke-width": "c-s-width",
                    stroke: "c-s-color",
                    hatching: "c-s-hatching"
                }
            },
            reduction: {
                hover: {
                    fill: "c-h-color",
                    stroke: "c-h-color",
                    "stroke-width": "c-h-width",
                    hatching: "c-h-hatching"
                },
                normal: {
                    fill: "reduction",
                    stroke: "reduction",
                    "stroke-width": "c-n-width",
                    hatching: undefined
                },
                selection: {
                    fill: "c-s-color",
                    "stroke-width": "c-s-width",
                    stroke: "c-s-color",
                    hatching: "c-s-hatching"
                }
            }
        });
    });
})();
