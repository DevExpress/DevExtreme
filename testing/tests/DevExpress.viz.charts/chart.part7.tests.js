"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    commons = require("./chartParts/commons.js"),
    errors = require("viz/core/errors_warnings"),
    seriesModule = require("viz/series/base_series"),
    dxErrors = errors.ERROR_MESSAGES,
    dataValidatorModule = require("viz/components/data_validator");

/* global MockSeries, seriesMockData, categories */
require("../../helpers/chartMocks.js");


$('<div id="chartContainer">').appendTo("#qunit-fixture");

(function seriesCreationTests() {
    QUnit.module("dxChart simple series creation", $.extend({}, commons.environment, {
        beforeEach: function() {
            commons.environment.beforeEach.call(this);
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
            commons.environment.afterEach.call(this);
        }
    }));

    QUnit.test("Apply chart theme", function(assert) {
        seriesMockData.series.push(new MockSeries({}), new MockSeries({}));
        this.themeManager.getOptions.withArgs("series").resetBehavior();
        this.themeManager.getOptions.withArgs("series").returns({
            fromTheme: true,
            type: "line"
        });
        //act
        var chart = this.createChart({
            series: [{}, {}]
        });

        assert.ok(chart.series[0].options.fromTheme);
    });

    QUnit.test("dxChart with single named series do not loose its name", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);

        //act
        var chart = this.createChart({
            dateSource: [{ arg: "First", val: 1 }, { arg: "2", val: 2 }, { arg: "3", val: 3 }, { arg: "4", val: 4 }, { arg: "Last", val: 5 }],
            series: {
                name: "Custom name",
                type: "line"
            }
        });

        //assert
        assert.ok(chart.series, "dxChart has series");
        assert.equal(chart.series.length, 1, "There should be single series");
        assert.equal(chart.series[0], stubSeries, "Series is stub series object");
        assert.equal(chart.series[0].options.name, "Custom name");
        assert.equal(chart.series[0].index, 0);
    });


    QUnit.test("dxChart with single series, series type is specified as number in option series", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});

        seriesMockData.series.push(stubSeries);
        seriesModule.Series = function() { return { isUpdated: false }; };
        //act
        var chart = this.createChart({
            series: {
                type: 100
            }
        });

        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 0);
    });

    QUnit.test("dxChart with single series, series type is unknown in option series", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);
        seriesModule.Series = function() { return { isUpdated: false }; };

        //act
        var chart = this.createChart({
            series: {
                type: "unknown",
            }
        });
        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 0);
    });

    QUnit.test("dxChart with two Series request default type", function(assert) {
        //arrange
        var stubSeries1 = new MockSeries({}),
            stubSeries2 = new MockSeries({});
        seriesMockData.series.push(stubSeries1);
        seriesMockData.series.push(stubSeries2);
        //act
        var chart = this.createChart({
            valueAxis: {
                categories: (categories.slice(0).push("additionalVal"))
            },
            argumentAxis: {
                categories: categories
            },
            dataSource: [{ arg: "First", val: 1 }, { arg: "2", val: 2 }, { arg: "3", val: 3 }, { arg: "4", val: 4 }, { arg: "Last", val: 5 }],
            series: [{
                type: "line"
            }, {
                type: "line"
            }]
        });
        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 2);
        assert.equal(chart.series[0], stubSeries1);
        assert.equal(chart.series[1], stubSeries2);
        assert.equal(chart.series[0].index, 0);
        assert.equal(chart.series[1].index, 1);
        assert.equal(seriesMockData.args[0].length, 2);
        assert.equal(seriesMockData.args[0][0].renderer, chart._renderer, "Renderer passed");
        assert.equal(seriesMockData.args[0][0].seriesGroup, chart._seriesGroup, "seriesGroup passed");
        assert.equal(seriesMockData.args[0][0].labelsGroup, chart._labelsGroup, "labelsGroup passed");
        assert.ok(seriesMockData.args[0][1], "Options passed");
        assert.equal(seriesMockData.args[1].length, 2);
        assert.equal(seriesMockData.args[1][0].renderer, chart._renderer, "Renderer passed");
        assert.equal(seriesMockData.args[1][0].seriesGroup, chart._seriesGroup, "seriesGroup passed");
        assert.equal(seriesMockData.args[1][0].labelsGroup, chart._labelsGroup, "labelsGroup passed");
        assert.ok(seriesMockData.args[1][1], "Options passed");
    });

    QUnit.test("dxChart with two Series request default type visibilityChanged", function(assert) {
        //arrange
        var stubSeries1 = new MockSeries({}),
            stubSeries2 = new MockSeries({});
        seriesMockData.series.push(stubSeries1);
        seriesMockData.series.push(stubSeries2);
        //act
        var chart = this.createChart({
                valueAxis: {
                    categories: (categories.slice(0).push("additionalVal"))
                },
                argumentAxis: {
                    categories: categories
                },
                dataSource: [{ arg: "First", val: 1 }, { arg: "2", val: 2 }, { arg: "3", val: 3 }, { arg: "4", val: 4 }, { arg: "Last", val: 5 }],
                series: [{
                    type: "line"
                }]
            }),
            processSeriesFamilySpy = sinon.spy(chart, "_processSeriesFamilies"),
            populateBusinessRangeSpy = sinon.spy(chart, "_populateBusinessRange"),
            renderSpy = sinon.spy(chart, "_doRender");
        chart._renderer.stopAllAnimations.reset();

        //assert
        assert.ok(chart.series);

        assert.ok(seriesMockData.args[0][1].visibilityChanged, "Options passed");
        seriesMockData.args[0][1].visibilityChanged();
        assert.ok(processSeriesFamilySpy.calledOnce);
        assert.ok(populateBusinessRangeSpy.calledOnce);
        assert.ok(renderSpy.calledOnce);
        assert.deepEqual(renderSpy.lastCall.args[0], { force: true });
        assert.ok(renderSpy.calledAfter(populateBusinessRangeSpy));
        assert.ok(populateBusinessRangeSpy.calledAfter(processSeriesFamilySpy));
        assert.ok(chart._renderer.stopAllAnimations.withArgs(true).calledTwice);
    });

    QUnit.test("dxChart with single series request default type without category Axis", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);
        //act
        var chart = this.createChart({
            series: { type: "line" }
        });
        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], stubSeries);
        assert.equal(chart.series[0].index, 0);
        assert.equal(seriesMockData.args[0].length, 2);
        assert.equal(seriesMockData.args[0][0].renderer, chart._renderer, "Renderer passed");
        assert.equal(seriesMockData.args[0][0].seriesGroup, chart._seriesGroup, "seriesGroup passed");
        assert.equal(seriesMockData.args[0][0].labelsGroup, chart._labelsGroup, "labelsGroup passed");
    });

    QUnit.test("Series index", function(assert) {
        //arrange
        var stubSeries1 = new MockSeries({}),
            stubSeries2 = new MockSeries({ isUpdated: false }),
            stubSeries3 = new MockSeries({});

        seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);


        //act
        var chart = this.createChart({
            valueAxis: {
                categories: (categories.slice(0).push("additionalVal"))
            },
            argumentAxis: {
                categories: categories
            },
            dataSource: [{ arg: "First", val: 1 }, { arg: "2", val: 2 }, { arg: "3", val: 3 }, { arg: "4", val: 4 }, { arg: "Last", val: 5 }],
            series: [{
                type: "line",
                pane: "unknownPane"
            }, {
                type: "line"
            },
            { type: "unknownType" },
            { type: "line" }
            ]
        });
        //assert
        assert.ok(chart.series);

        assert.equal(chart.series.length, 2);
        assert.equal(chart.series[0], stubSeries1);
        assert.equal(chart.series[1], stubSeries3);
        assert.equal(chart.series[0].index, 0);
        assert.equal(chart.series[1].index, 1);
    });

    QUnit.test("dxChart with single series request - rotated", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);
        //act
        var chart = this.createChart({
            rotated: true,
            argumentAxis: {
                categories: categories
            },
            valueAxis: {
                categories: (categories.slice(0).push("additionalVal"))
            },
            series: {
                type: "line"
            }
        });
        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], stubSeries);
        assert.equal(chart.series[0].index, 0);
        assert.equal(seriesMockData.args[0].length, 2);
        assert.equal(seriesMockData.args[0][0].renderer, chart._renderer, "Renderer passed");
        assert.equal(seriesMockData.args[0][0].seriesGroup, chart._seriesGroup, "seriesGroup passed");
        assert.equal(seriesMockData.args[0][0].labelsGroup, chart._labelsGroup, "labelsGroup passed");
        assert.ok(seriesMockData.args[0][1], "Options passed");
        assert.ok(seriesMockData.args[0][1].rotated, "Rotated");
    });

    QUnit.test("dxChart with single series request with data coming from Data Source", function(assert) {
        //arrange
        var stubSeries = new MockSeries({ argumentField: "arg" });
        seriesMockData.series.push(stubSeries);
        var data = [{ arg: 1, val: 1 }, { arg: 2, val: 2 }, { arg: 3, val: 3 }, { arg: 4, val: 4 }, { arg: 5, val: 5 }];
        //act
        var chart = this.createChart({
            dataSource: data,
            series: {
                type: "bar"
            }
        });
        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], stubSeries);
        assert.equal(seriesMockData.args[0].length, 2);
        assert.deepEqual(chart.series[0].reinitializedData, data);

    });

    QUnit.test("Theme was applied to single series", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);
        //act
        var chart = this.createChart({
            argumentAxis: {
                categories: categories
            },
            series: {
                type: "line"
            }
        });
        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 1);
        assert.equal(chart.series[0], stubSeries);
        assert.equal(seriesMockData.args[0].length, 2);
        assert.ok(seriesMockData.args[0][1], "Options passed");
    });

    QUnit.test("dxChart with two Series which belongs to different panes (with default pane)", function(assert) {
        //arrange
        var stubSeries1 = new MockSeries({}),
            stubSeries2 = new MockSeries({});
        seriesMockData.series.push(stubSeries1);
        seriesMockData.series.push(stubSeries2);
        //act
        var chart = this.createChart({
            argumentAxis: {
                categories: categories
            },
            panes: [{
                name: "top"
            }, {
                name: "bottom"
            }],
            series: [{
                pane: "top",
                type: "line"
            }, {
                type: "line"
            }]
        });
        //assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 2);
        assert.equal(chart.series[0], stubSeries1);
        assert.equal(chart.series[1], stubSeries2);
        assert.equal(chart.series[0].pane, "top", "First series pane (explicit)");
        assert.equal(chart.series[1].pane, "bottom", "First series pane (implicit, from default)");
    });

    QUnit.test("dxChart with two value axis with different names", function(assert) {
        //arrange
        var stubSeries1 = new MockSeries({}),
            stubSeries2 = new MockSeries({});
        seriesMockData.series.push(stubSeries1);
        seriesMockData.series.push(stubSeries2);
        //act
        var chart = this.createChart({
            argumentAxis: {
                categories: categories
            },
            panes: [{
                name: "pane1"
            }],
            series: [{
                pane: "pane1",
                axis: "axis2",
                type: "line"
            }, {
                pane: "pane1",
                axis: "axis1",
                type: "line"

            }],
            valueAxis: [{
                name: "axis2",
                pane: "pane1",
                maxPadding: 0.3,
                grid: {
                    visible: true
                }
            }, {
                name: "axis1",
                pane: "pane1",
                maxPadding: 0.3,
                min: 0,
                max: 30,
                grid: {
                    visible: true
                }
            }]
        });


        //assert

        assert.ok(chart.series);
        var verticalAxes = chart._valueAxes;
        assert.equal(verticalAxes[0].getOptions().name, "axis2");
        assert.equal(verticalAxes[1].getOptions().name, "axis1");

    });

    QUnit.test("dxChart with two panes and argument axis has default position", function(assert) {

        //act
        var chart = this.createChart({
            argumentAxis: {
                title: "Title",
                categories: categories
            },
            panes: [{
                name: "top"
            },
            {
                name: "bottom"
            }
            ]
        });

        //assert
        assert.ok(chart._argumentAxes);
        var horizontalAxes = chart._argumentAxes;
        assert.equal(horizontalAxes.length, 2);
        assert.equal(horizontalAxes[0].pane, "top");
        assert.equal(horizontalAxes[1].pane, "bottom");

        var axisOptions = chart._argumentAxes[0].getOptions();

        assert.strictEqual(axisOptions.visible, false);
        assert.strictEqual(axisOptions.tick.visible, false);
        assert.strictEqual(axisOptions.label.visible, false);
        assert.strictEqual(axisOptions.minorTick.visible, false);
        assert.deepEqual(axisOptions.title, {});

        axisOptions = chart._argumentAxes[1].getOptions();

        assert.strictEqual(axisOptions.visible, undefined);
        assert.deepEqual(axisOptions.tick, {});
        assert.deepEqual(axisOptions.label, {});
        assert.deepEqual(axisOptions.minorTick, {});
        assert.equal(axisOptions.title, "Title");
    });

    QUnit.test("dxChart with two panes and argument axis has top position", function(assert) {
        //act
        var chart = this.createChart({
            argumentAxis: {
                title: "Title",
                categories: categories,
                position: "top"
            },
            panes: [{
                name: "top"
            },
            {
                name: "bottom"
            }
            ]
        });

        //assert
        assert.ok(chart._argumentAxes);
        var horizontalAxes = chart._argumentAxes;
        assert.equal(horizontalAxes.length, 2);
        assert.equal(horizontalAxes[0].pane, "top");
        assert.equal(horizontalAxes[1].pane, "bottom");

        var axisOptions = chart._argumentAxes[1].getOptions();

        assert.strictEqual(axisOptions.visible, false);
        assert.strictEqual(axisOptions.tick.visible, false);
        assert.strictEqual(axisOptions.label.visible, false);
        assert.strictEqual(axisOptions.minorTick.visible, false);
        assert.deepEqual(axisOptions.title, {});

        axisOptions = chart._argumentAxes[0].getOptions();

        assert.strictEqual(axisOptions.visible, undefined);
        assert.deepEqual(axisOptions.tick, {});
        assert.deepEqual(axisOptions.label, {});
        assert.deepEqual(axisOptions.minorTick, {});
        assert.equal(axisOptions.title, "Title");

    });

    QUnit.test("dxChart with two panes and argument axis has invalid position", function(assert) {
        //act
        var chart = this.createChart({
            argumentAxis: {
                title: "Title",
                categories: categories,
                position: "left"
            },
            panes: [{
                name: "top"
            },
            {
                name: "bottom"
            }
            ]
        });

        //assert
        assert.ok(chart._argumentAxes);
        var horizontalAxes = chart._argumentAxes;
        assert.equal(horizontalAxes.length, 2);
        assert.equal(horizontalAxes[0].pane, "top");
        assert.equal(horizontalAxes[1].pane, "bottom");

        var axisOptions = chart._argumentAxes[0].getOptions();

        assert.strictEqual(axisOptions.visible, false);
        assert.strictEqual(axisOptions.tick.visible, false);
        assert.strictEqual(axisOptions.label.visible, false);
        assert.strictEqual(axisOptions.minorTick.visible, false);
        assert.deepEqual(axisOptions.title, {});

        axisOptions = chart._argumentAxes[1].getOptions();

        assert.strictEqual(axisOptions.visible, undefined);
        assert.deepEqual(axisOptions.tick, {});
        assert.deepEqual(axisOptions.label, {});
        assert.deepEqual(axisOptions.minorTick, {});
        assert.equal(axisOptions.title, "Title");
    });

    QUnit.test("Rotated chart with two panes and argument axis has default position", function(assert) {
        //act
        var chart = this.createChart({
            rotated: true,
            argumentAxis: {
                categories: categories,
                title: "Title"
            },
            panes: [{
                name: "top"
            },
            {
                name: "bottom"
            }
            ]
        });

        //assert
        assert.ok(chart._argumentAxes);
        var verticalAxes = chart._argumentAxes;
        assert.equal(verticalAxes.length, 2);
        assert.equal(verticalAxes[0].pane, "bottom");
        assert.equal(verticalAxes[1].pane, "top");

        var axisOptions = chart._argumentAxes[1].getOptions();

        assert.strictEqual(axisOptions.visible, false);
        assert.strictEqual(axisOptions.tick.visible, false);
        assert.strictEqual(axisOptions.label.visible, false);
        assert.strictEqual(axisOptions.minorTick.visible, false);
        assert.deepEqual(axisOptions.title, {});

        axisOptions = chart._argumentAxes[0].getOptions();

        assert.strictEqual(axisOptions.visible, undefined);
        assert.deepEqual(axisOptions.tick, {});
        assert.deepEqual(axisOptions.label, {});
        assert.deepEqual(axisOptions.minorTick, {});
        assert.equal(axisOptions.title, "Title");

    });

    QUnit.test("Rotated chart with two panes and argument axis has right position", function(assert) {
        //act
        var chart = this.createChart({
            rotated: true,
            argumentAxis: {
                categories: categories,
                position: "right",
                title: "Title"
            },
            panes: [{
                name: "top"
            },
            {
                name: "bottom"
            }
            ]
        });

        //assert
        assert.ok(chart._argumentAxes);
        var verticalAxes = chart._argumentAxes;
        assert.equal(verticalAxes.length, 2);
        assert.equal(verticalAxes[0].pane, "bottom");
        assert.equal(verticalAxes[1].pane, "top");

        var axisOptions = chart._argumentAxes[0].getOptions();

        assert.strictEqual(axisOptions.visible, false);
        assert.strictEqual(axisOptions.tick.visible, false);
        assert.strictEqual(axisOptions.label.visible, false);
        assert.strictEqual(axisOptions.minorTick.visible, false);
        assert.deepEqual(axisOptions.title, {});

        axisOptions = chart._argumentAxes[1].getOptions();

        assert.strictEqual(axisOptions.visible, undefined);
        assert.deepEqual(axisOptions.tick, {});
        assert.deepEqual(axisOptions.label, {});
        assert.deepEqual(axisOptions.minorTick, {});
        assert.equal(axisOptions.title, "Title");

    });

    QUnit.test("Rotated chart with two panes and argument axis has invalid position", function(assert) {
        //arrange
        var stubSeries1 = new MockSeries({}),
            stubSeries2 = new MockSeries({});
        seriesMockData.series.push(stubSeries1);
        seriesMockData.series.push(stubSeries2);
        //act
        var chart = this.createChart({
            rotated: true,
            argumentAxis: {
                categories: categories,
                title: "Title",
                position: "top"
            },
            panes: [{
                name: "top"
            },
            {
                name: "bottom"
            }
            ]
        });

        //assert
        assert.ok(chart._argumentAxes);
        var verticalAxes = chart._argumentAxes;
        assert.equal(verticalAxes.length, 2);
        assert.equal(verticalAxes[0].pane, "bottom");
        assert.equal(verticalAxes[1].pane, "top");

        var axisOptions = chart._argumentAxes[1].getOptions();

        assert.strictEqual(axisOptions.visible, false);
        assert.strictEqual(axisOptions.tick.visible, false);
        assert.strictEqual(axisOptions.label.visible, false);
        assert.strictEqual(axisOptions.minorTick.visible, false);
        assert.deepEqual(axisOptions.title, {});

        axisOptions = chart._argumentAxes[0].getOptions();

        assert.strictEqual(axisOptions.visible, undefined);
        assert.deepEqual(axisOptions.tick, {});
        assert.deepEqual(axisOptions.label, {});
        assert.deepEqual(axisOptions.minorTick, {});
        assert.equal(axisOptions.title, "Title");
    });

    QUnit.test("Pass seriesFamily translators", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);
        //act
        var chart = this.createChart({
            dateSource: [{ arg: "First", val: 1 }, { arg: "2", val: 2 }, { arg: "3", val: 3 }, { arg: "4", val: 4 }, { arg: "Last", val: 5 }],
            series: {
                name: "Custom name",
                type: "line"
            }
        });
        //assert
        var tr = chart.translators.default.defaultAxisName0,
            translators = {
                arg: tr.arg,
                val: tr.val,
                axesTrans: {
                    defaultAxisName0: {
                        arg: tr.arg,
                        val: tr.val
                    }
                }
            };
        assert.ok(chart.series, "dxChart has series");
        assert.ok(chart.seriesFamilies[0].adjustSeriesValues.called);
        assert.ok(chart.seriesFamilies[0].updateSeriesValues.called);

        assert.deepEqual(chart.seriesFamilies[0].updateSeriesValues.args[0][0], translators);

        assert.ok(chart.seriesFamilies[0].adjustSeriesDimensions.called);
        assert.deepEqual(chart.seriesFamilies[0].adjustSeriesDimensions.args[0][0], translators);
    });

    QUnit.test("Pass seriesFamily translators, rotated", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);

        //act
        var chart = this.createChart({
            rotated: true,
            dateSource: [{ arg: "First", val: 1 }, { arg: "2", val: 2 }, { arg: "3", val: 3 }, { arg: "4", val: 4 }, { arg: "Last", val: 5 }],
            series: {
                name: "Custom name",
                type: "line"
            }
        });
        //assert
        var tr = chart.translators.default.defaultAxisName0,
            translators = {
                arg: tr.arg,
                val: tr.val,
                axesTrans: {
                    defaultAxisName0: {
                        arg: tr.arg,
                        val: tr.val
                    }
                }
            };
        assert.ok(chart.series, "dxChart has series");
        assert.ok(chart.seriesFamilies[0].adjustSeriesValues.called);
        assert.ok(chart.seriesFamilies[0].updateSeriesValues.called);

        assert.deepEqual(chart.seriesFamilies[0].updateSeriesValues.args[0][0], translators);
        assert.ok(chart.seriesFamilies[0].adjustSeriesDimensions.called);
        assert.deepEqual(chart.seriesFamilies[0].adjustSeriesDimensions.args[0][0], translators);
    });

    QUnit.test("tracker repaired tooltip. after series rendering", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});
        seriesMockData.series.push(stubSeries);

        //act
        this.createChart({
            dataSource: [{ arg: "First", val: 1 }, { arg: "2", val: 2 }],
            series: [{
                type: "line"
            }]
        });

        assert.ok(commons.getTrackerStub().repairTooltip.calledOnce, "repairTooltip called once");
    });

    QUnit.module("dxChart seriesTemplates creation", $.extend({}, commons.environment, {
        beforeEach: function() {
            executeAsyncMock.setup();
            commons.environment.beforeEach.call(this);
        },
        afterEach: function() {
            executeAsyncMock.teardown();
            commons.environment.afterEach.call(this);
        },
        mockValidateData: function() {
            this.validateData = sinon.stub(dataValidatorModule, "validateData", function(data) {
                return { x: data || [] };
            });
        },
    }));

    QUnit.test("SeriesTemplate. Default nameField", function(assert) {
        var stubSeries1 = new MockSeries({
            name: "first", range: { minX: 15, maxX: 80, minY: -1, maxY: 10 }, valueField: "y",
            argumentField: "x",
            tagField: "tag"
        });
        var stubSeries2 = new MockSeries({
            name: "second", range: { minX: 15, maxX: 80, minY: -1, maxY: 10 }, valueField: "y",
            argumentField: "x",
            tagField: "tag"
        });
        var stubSeries3 = new MockSeries({
            name: "third", range: { minX: 15, maxX: 80, minY: -1, maxY: 10 }, valueField: "y",
            argumentField: "x",
            tagField: "tag"
        });

        seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);

        var chart = this.createChart({
            commonSeriesSettings: {
                valueField: "y",
                argumentField: "x",
                tagField: "tag"
            },
            dataSource: [{ series: "s1", x: 1, y: 1, tag: "a" }, { series: "s2", x: 2, y: 2, tag: "b" }, { series: "s3", x: 3, y: 3, tag: "c" }],
            seriesTemplate: { customizeSeries: function(sName) { return { type: "spline-" + sName }; } }
        });
        //Assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 3);
        assert.equal(chart.series[0].getOptions().name, "first");
        assert.equal(chart.series[0].type, "spline-s1");

        assert.equal(chart.series[0].reinitializedData[0]["yfirst"], 1);
        assert.equal(chart.series[0].reinitializedData[1]["ysecond"], 2);
        assert.equal(chart.series[0].reinitializedData[2]["ythird"], 3);
        assert.equal(chart.series[0].reinitializedData[0]["tagfirst"], "a");
        assert.equal(chart.series[0].reinitializedData[1]["tagsecond"], "b");
        assert.equal(chart.series[0].reinitializedData[2]["tagthird"], "c");
        assert.ok(chart.series[0].updatedFields);
        assert.equal(chart.series[1].getOptions().name, "second");
        assert.equal(chart.series[1].type, "spline-s2");
        assert.equal(chart.series[1].reinitializedData[0]["yfirst"], 1);
        assert.equal(chart.series[1].reinitializedData[1]["ysecond"], 2);
        assert.equal(chart.series[1].reinitializedData[2]["ythird"], 3);
        assert.equal(chart.series[1].reinitializedData[0]["tagfirst"], "a");
        assert.equal(chart.series[1].reinitializedData[1]["tagsecond"], "b");
        assert.equal(chart.series[1].reinitializedData[2]["tagthird"], "c");
        assert.ok(chart.series[1].updatedFields);
        assert.equal(chart.series[2].getOptions().name, "third");
        assert.equal(chart.series[2].type, "spline-s3");
        assert.equal(chart.series[2].reinitializedData[0]["yfirst"], 1);
        assert.equal(chart.series[2].reinitializedData[1]["ysecond"], 2);
        assert.equal(chart.series[2].reinitializedData[2]["ythird"], 3);
        assert.equal(chart.series[2].reinitializedData[0]["tagfirst"], "a");
        assert.equal(chart.series[2].reinitializedData[1]["tagsecond"], "b");
        assert.equal(chart.series[2].reinitializedData[2]["tagthird"], "c");
        assert.ok(chart.series[2].updatedFields);
    });

    QUnit.test("SeriesTemplate. Custom nameField. Series ignored", function(assert) {
        var stubSeries1 = new MockSeries({ range: { minX: 15, maxX: 80, minY: -1, maxY: 10 } });
        var stubSeries2 = new MockSeries({ range: { minX: 15, maxX: 80, minY: -1, maxY: 10 } });
        var stubSeries3 = new MockSeries({ range: { minX: 15, maxX: 80, minY: -1, maxY: 10 } });

        seriesMockData.series.push(stubSeries1, stubSeries2, stubSeries3);

        var chart = this.createChart({
            dataSource: [{ series1: "s1", x: 1, y: 1 }, { series1: "s2", x: 2, y: 2 }, { series1: "s3", x: 3, y: 3 }],
            seriesTemplate: { nameField: "series1", customizeSeries: function(sName) { return { type: "spline-" + sName }; } },
            series: [{}, {}]
        });
        //Assert
        assert.ok(chart.series);
        assert.equal(chart.series.length, 3);
        assert.equal(chart.series[0].options.name, "s1");
        assert.equal(chart.series[0].type, "spline-s1");
        assert.equal(chart.series[1].options.name, "s2");
        assert.equal(chart.series[1].type, "spline-s2");
        assert.equal(chart.series[2].options.name, "s3");
        assert.equal(chart.series[2].type, "spline-s3");
    });
})();

(function API() {

    QUnit.module("API", $.extend({}, commons.environment, {
        beforeEach: function() {
            commons.environment.beforeEach.call(this);
            this.clock = sinon.useFakeTimers();

            var stubSeries1 = new MockSeries({
                    name: "First series",
                }),
                stubSeries2 = new MockSeries({
                    name: "Second series"
                });
            seriesMockData.series.push(stubSeries1);
            seriesMockData.series.push(stubSeries2);

        },
        afterEach: function() {
            this.clock.restore();
            commons.environment.afterEach.call(this);
        }
    }));

    QUnit.test("dxChart - clear selection", function(assert) {
        //arrange
        var chart = this.createChart({
            series: {
                type: "line"
            }
        });
        //act
        chart.clearSelection();
        //assert
        assert.ok(commons.getTrackerStub().stub("clearSelection"), "Selection should be cleared through tracker");
    });

    QUnit.test("dxChart - get all series", function(assert) {
        //arrange
        var chart = this.createChart({
            series: [{
                name: "First series",
                type: "line"
            }, {
                name: "Second series",
                type: "line"
            }]
        });
        //act
        var allSeries = chart.getAllSeries();
        //assert
        assert.ok(allSeries, "Result is defined");
        assert.strictEqual(allSeries.length, 2, "Both series should be returned");
        assert.equal(allSeries[0].name, "First series");
        assert.equal(allSeries[1].name, "Second series");
    });

    QUnit.test("dxChart - get series by name", function(assert) {
        //arrange
        var chart = this.createChart({
            series: [
                {
                    name: "First series",
                    type: "line"
                },
                {
                    name: "Second series",
                    type: "line"
                }]
        });
        //act
        var series = chart.getSeriesByName("First series");
        //assert
        assert.ok(series, "Result is defined");
        assert.equal(series.name, "First series");
    });

    QUnit.test("dxChart - get non-existing series by name", function(assert) {
        //arrange
        var chart = this.createChart({
            series: [
                {
                    name: "First series",
                    type: "line"
                },
                {
                    name: "Second series",
                    type: "line"
                }]
        });
        //act
        var series = chart.getSeriesByName("Six series");
        //assert
        assert.ok(!series, "Result does not exists");
    });

    QUnit.test("dxChart - get series by pos", function(assert) {
        //arrange
        var chart = this.createChart({
            series: [
                {
                    name: "First series",
                    type: "line"
                },
                {
                    name: "Second series",
                    type: "line"
                }]
        });
        //act
        var series = chart.getSeriesByPos(1);
        //assert
        assert.ok(series, "Result is defined");
        assert.equal(series.name, "Second series");
    });

    QUnit.test("dxChart - get non-existing series by pos", function(assert) {
        //arrange
        var chart = this.createChart({
            series: [
                {
                    name: "First series",
                    type: "line"
                },
                {
                    name: "Second series",
                    type: "line"
                }]
        });
        //act
        var series = chart.getSeriesByPos(10);
        //assert
        assert.ok(!series, "Result does not exists");
    });

    QUnit.test("dxChart - clear tooltip", function(assert) {
        var chart = this.createChart({});

        chart.hideTooltip();

        assert.ok(commons.getTrackerStub().stub("_hideTooltip"), "tracker hide tooltip was called");
    });

    QUnit.test("dxChart - render", function(assert) {
        //arrange
        var chart = commons.createChartInstance({}, this.$container),
            renderCalled = false,
            drawOptions = null;

        //hack internal _render implementation
        chart._doRender = function(options) {
            renderCalled = true;
            drawOptions = options;
        };
        //act
        chart.render({
            force: true,
            animate: true,
            unsupportedOption: 100500
        });
        //assert
        assert.ok(renderCalled, "Rendering internal function should be called");
        assert.deepEqual(drawOptions, {
            force: true,
            animate: true,
            unsupportedOption: 100500
        }, "All options should be passed");
    });

    QUnit.test("Multiple rendering", function(assert) {
        var drawnCounter = 0,
            chart = this.createChart({
                series: [
                    {
                        name: "First series",
                        type: "line"
                    },
                    {
                        name: "Second series",
                        type: "line"
                    }],
                onDrawn: function() {
                    drawnCounter++;
                }
            });
        //act
        chart.render({ force: true });
        chart.render({ force: true });
        chart.render({ force: true });
        chart.render({ force: true });

        //assert
        assert.equal(drawnCounter, 5);
    });
})();

(function incidentOccurred() {
    QUnit.module("incidentOccurred errors and warnings", $.extend({}, commons.environment, {
        beforeEach: function() {
            commons.environment.beforeEach.call(this);
            vizMocks.stubIncidentOccurredCreation();
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
            commons.environment.afterEach.call(this);
            vizMocks.restoreIncidentOccurredCreation();
        }
    }));

    QUnit.test("defaultPane not specified - no messages", function(assert) {
        var chart = this.createChart({
            panes: [{ name: "topPane" },
                { name: "bottomPane" }]
        });

        assert.ok(!chart._incidentOccurred.called);
    });

    QUnit.test("defaultPane specified, there is pane with given name - no messages", function(assert) {
        var chart = this.createChart({
            defaultPane: "topPane",
            panes: [{ name: "topPane" },
                { name: "bottomPane" }]
        });

        assert.ok(!chart._incidentOccurred.called);
    });

    QUnit.test("defaultPane specified, no panes with given name - W2101 message", function(assert) {
        var chart = this.createChart({
                defaultPane: "nonExistingPane",
                panes: [{ name: "topPane" },
                { name: "bottomPane" }]
            }),
            idError;

        assert.ok(chart._incidentOccurred.calledOnce);
        assert.deepEqual(chart._incidentOccurred.firstCall.args, ["W2101", ["nonExistingPane"]]);

        idError = chart._incidentOccurred.firstCall.args[0];
        assert.equal(dxErrors[idError], "The \"{0}\" pane does not exist; the last pane is used by default");
    });

    QUnit.test("dxChart with single series, series type is specified as number in option series", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});

        seriesMockData.series.push(stubSeries);
        seriesModule.Series = function() { return { isUpdated: false }; };
        //act
        var chart = this.createChart({
                series: {
                    type: 100,
                }
            }), idError;

        //assert
        assert.ok(chart._incidentOccurred.calledOnce);

        idError = chart._incidentOccurred.firstCall.args[0];

        assert.equal(chart._incidentOccurred.firstCall.args[1][0], "100");

        assert.equal(idError, "E2101");
        assert.equal(dxErrors[idError], "Unknown series type: {0}");
    });

    QUnit.test("dxChart with single series, series type is specified as datetime in option series", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});

        seriesMockData.series.push(stubSeries);
        seriesModule.Series = function() { return { isUpdated: false }; };
        //act
        var chart = this.createChart({
                series: {
                    type: new Date(2011, 1, 1)
                }
            }), idError;

        //assert
        assert.ok(chart._incidentOccurred.calledOnce);

        idError = chart._incidentOccurred.firstCall.args[0];

        assert.deepEqual(chart._incidentOccurred.firstCall.args[1][0].valueOf(), new Date(2011, 1, 1).valueOf());

        assert.equal(idError, "E2101");
        assert.equal(dxErrors[idError], "Unknown series type: {0}");
    });

    QUnit.test("dxChart with single series, series type is unknown in option series", function(assert) {
        //arrange
        var stubSeries = new MockSeries({});

        seriesMockData.series.push(stubSeries);
        seriesModule.Series = function() { return { isUpdated: false }; };

        //act
        var chart = commons.createChartInstance({
                series: {
                    type: "unknown",
                }
            }, this.$container), idError;
        //assert
        assert.ok(chart._incidentOccurred.calledOnce);

        idError = chart._incidentOccurred.firstCall.args[0];

        assert.equal(chart._incidentOccurred.firstCall.args[1][0], "unknown");

        assert.equal(idError, "E2101");
    });

    QUnit.test("Two axis with duplicate name", function(assert) {
        var chart = commons.createChartInstance({
                valueAxis: [
                { name: "axisName" },
                { name: "axisName" }
                ]
            }, this.$container),
            idError;

        assert.ok(chart._incidentOccurred.calledOnce);
        idError = chart._incidentOccurred.firstCall.args[0];
        assert.equal(idError, "E2102");
        assert.equal(dxErrors[idError], "Ambiguity occurred between two value axes with the same name");
    });

    QUnit.test("Three axis with duplicate name", function(assert) {
        var chart = this.createChart({
                argumentAxis: {
                    tick: {},
                    label: {},
                    minorTick: {}
                },
                valueAxis: [
                    {
                        name: "axisName",
                        pane: "top"
                    },
                    {
                        name: "axisName",
                        pane: "default"
                    },
                    {
                        name: "axis",
                        pane: "default"
                    }
                ],
                panes: [
                { name: "top" },
                { name: "default" }
                ]
            }),
            idError;

        assert.ok(chart._incidentOccurred.calledOnce);
        idError = chart._incidentOccurred.firstCall.args[0];
        assert.equal(idError, "E2102");
    });

    QUnit.test("Series. Series with invalid axis", function(assert) {
        //arrange
        seriesMockData.series.push(new MockSeries({}));
        //act
        var chart = commons.createChartInstance({
                series: [{
                    axis: "axis",
                    type: "line"
                }]
            }, this.$container),
            idError;
        //assert
        assert.ok(chart._incidentOccurred.calledOnce);

        idError = chart._incidentOccurred.firstCall.args[0];

        assert.equal(chart._incidentOccurred.firstCall.args[1][0], "axis");

        assert.equal(idError, "W2102");
        assert.equal(dxErrors[idError], "A value axis with the \"{0}\" name was created automatically");
    });
})();

(function resolveOverlapping() {
    QUnit.module("resolveLabelOverlapping. hide", $.extend({}, commons.environment, {
        beforeEach: function() {
            commons.environment.beforeEach.apply(this, arguments);
            commons.LabelCtor.resetIndex();
            this.labels = [];
        },
        afterEach: function() {
            commons.environment.afterEach.apply(this, arguments);
        },
        createFakeSeriesWithLabels: function(bBoxes, isRange) {
            var series = new MockSeries(),
                labels = this.createStubLabels(bBoxes);

            seriesMockData.series.push(series);
            if(!isRange) {
                series.getVisiblePoints = function() {
                    return $.map(labels, function(label) {
                        return { getLabels: sinon.stub().returns([label]) };
                    });
                };
            } else {
                series.getVisiblePoints = function() {
                    return [{ getLabels: sinon.stub().returns(labels) }];
                };
            }
            return series;
        },
        createStubLabels: function(bBoxes) {
            var that = this;
            $.each(bBoxes, function(_, BBox) {
                var label = new commons.LabelCtor();
                label.getBoundingRect.returns(BBox);
                label.isVisible = sinon.spy(function() {
                    return !this.hide.called;
                });
                label.shift = sinon.spy(function(x, y) {
                    var BBox = label.getBoundingRect();
                    BBox.x = x;
                    BBox.y = y;
                });
                that.labels.push(label);
            });
            return this.labels;
        }
    }));

    QUnit.test("two overlapping label", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 }, { x: 5, y: 10, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "hide",
            series: [{ type: "mockType" }]
        });
        assert.ok(!this.labels[0].hide.called);
        assert.ok(this.labels[1].hide.calledOnce);
    });

    QUnit.test("two overlapping label, series not visible", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 }, { x: 5, y: 10, width: 10, height: 10 }]);

        seriesMockData.series[0].isVisible = sinon.stub().returns(false);
        this.createChart({
            resolveLabelOverlapping: "hide",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].hide.called);
        assert.ok(!this.labels[1].hide.called);
    });

    QUnit.test("two non-overlapping label", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 }, { x: 25, y: 30, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "hide",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].hide.called);
        assert.ok(!this.labels[1].hide.called);
    });

    QUnit.test("first and third labels overlapping", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 },
                                            { x: 25, y: 30, width: 10, height: 10 },
                                            { x: 10, y: 15, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "hide",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].hide.called);
        assert.ok(!this.labels[1].hide.called);
        assert.ok(this.labels[2].hide.calledOnce);
    });

    QUnit.test("skip hidden labels", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 },
                                            { x: 35, y: 40, width: 10, height: 10 },
                                            { x: 10, y: 15, width: 10, height: 10 },
                                            { x: 17, y: 22, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "hide",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].hide.called);
        assert.ok(!this.labels[1].hide.called);
        assert.ok(this.labels[2].hide.calledOnce);
        assert.ok(!this.labels[3].hide.called);
    });

    QUnit.test("two overlapping label from two series", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 }]);
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "hide",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].hide.called);
        assert.ok(this.labels[1].hide.calledOnce);
    });

    QUnit.test("two overlapping label from rangeSeries", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 }, { x: 5, y: 10, width: 10, height: 10 }], "rangeSeries");

        this.createChart({
            resolveLabelOverlapping: "hide",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].hide.called);
        assert.ok(this.labels[1].hide.calledOnce);
    });

    QUnit.module("resolveLabelOverlapping. stack", $.extend({}, commons.environment, {
        beforeEach: function() {
            commons.environment.beforeEach.apply(this, arguments);
            commons.LabelCtor.resetIndex();
            this.labels = [];
        },
        createFakeSeriesWithLabels: function(bBoxes, seriesOptions) {
            var series = new MockSeries(seriesOptions),
                labels = this.createStubLabels(bBoxes);

            seriesMockData.series.push(series);
            series.getPoints = function() {
                return $.map(labels, function(label) {
                    return {
                        series: series,
                        getLabels: sinon.stub().returns([label]),
                        argument: label.getBoundingRect().x,
                        originalValue: label.getBoundingRect().value
                    };
                });
            };
        },
        createStubLabels: function(bBoxes) {
            var that = this,
                labels = [];
            $.each(bBoxes, function(_, BBox) {
                var label = new commons.LabelCtor();
                label.getBoundingRect.returns(BBox);
                label.isVisible = sinon.spy(function() {
                    return !this.hide.called;
                });
                label.shift = sinon.spy(function(x, y) {
                    var BBox = label.getBoundingRect();
                    BBox.x = x;
                    BBox.y = y;
                });
                labels.push(label);
            });
            that.labels = that.labels.concat(labels);
            return labels;
        },
        checkLabelPosition: function(assert, label, position) {
            $.each(position, function(index, value) {
                assert.equal(label.shift.lastCall.args[index], value);
            });
            assert.ok(!label.hide.called, "label not should be hidden");
        }
    }));

    QUnit.test("two overlapping label", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        this.checkLabelPosition(assert, this.labels[1], [5, 10]);
    });

    QUnit.test("Two non overlapping labels", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 }, { x: 5, y: 30, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(!this.labels[1].shift.called);
    });

    QUnit.test("Three overlapping labels. start", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 },
                                            { x: 5, y: 8, width: 10, height: 10 },
                                            { x: 5, y: 12, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        this.checkLabelPosition(assert, this.labels[1], [5, 10]);
        this.checkLabelPosition(assert, this.labels[2], [5, 20]);
    });

    QUnit.test("Three overlapping labels. not visible series", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 },
                                            { x: 5, y: 8, width: 10, height: 10 },
                                            { x: 5, y: 12, width: 10, height: 10 }]);

        seriesMockData.series[0].isVisible = sinon.stub().returns(false);
        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });


        assert.ok(!this.labels[0].shift.called);
        assert.ok(!this.labels[1].shift.called);
        assert.ok(!this.labels[2].shift.called);
    });

    QUnit.test("Two series with different stack", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 }], { stack: "one" });
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 }], { stack: "two" });

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }, { type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(!this.labels[1].shift.called);
    });

    QUnit.test("Two series with the same stack", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 }], { stack: "one" });
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 }], { stack: "one" });

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }, { type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(this.labels[1].shift.called);
    });

    QUnit.test("Two overlapping labels. from end canvas", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 90, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        this.checkLabelPosition(assert, this.labels[0], [5, 80]);
        this.checkLabelPosition(assert, this.labels[1], [5, 90]);
    });

    QUnit.test("Three overlapping labels. from start and end canvas", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(!this.labels[0].shift.called);
        this.checkLabelPosition(assert, this.labels[1], [5, 80]);
        this.checkLabelPosition(assert, this.labels[2], [5, 90]);
    });

    QUnit.test("Three overlapping labels. from middle and end canvas", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 20, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(!this.labels[0].shift.called);
        this.checkLabelPosition(assert, this.labels[1], [5, 80]);
        this.checkLabelPosition(assert, this.labels[2], [5, 90]);
    });

    QUnit.test("Three overlapping labels. from end canvas", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 75, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });


        this.checkLabelPosition(assert, this.labels[0], [5, 70]);
        this.checkLabelPosition(assert, this.labels[1], [5, 80]);
        this.checkLabelPosition(assert, this.labels[2], [5, 90]);
    });

    QUnit.test("Six overlapping labels.", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 10, width: 10, height: 10 },
                                            { x: 5, y: 15, width: 10, height: 10 },
                                            { x: 5, y: 40, width: 10, height: 10 },
                                            { x: 5, y: 45, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 },
                                            { x: 5, y: 90, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(!this.labels[0].shift.called);
        this.checkLabelPosition(assert, this.labels[1], [5, 20]);
        assert.ok(!this.labels[2].shift.called);
        this.checkLabelPosition(assert, this.labels[3], [5, 50]);
        this.checkLabelPosition(assert, this.labels[4], [5, 80]);
        this.checkLabelPosition(assert, this.labels[5], [5, 90]);
    });

    QUnit.test("kill labels", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 60, value: 10 },
                                            { x: 5, y: 50, width: 10, height: 60, value: 0 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(this.labels[1].hide.calledOnce);
    });

    QUnit.test("kill labels. two gaps", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 7, width: 10, height: 25, value: 10 },
                                            { x: 5, y: 26, width: 10, height: 25, value: 9 },
                                            { x: 5, y: 53, width: 10, height: 25, value: 8 },
                                            { x: 5, y: 57, width: 10, height: 25, value: 7 },
                                            { x: 5, y: 75, width: 10, height: 25, value: 6 },
                                            { x: 5, y: 85, width: 10, height: 25, value: 5 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        this.checkLabelPosition(assert, this.labels[0], [5, 0]);
        this.checkLabelPosition(assert, this.labels[1], [5, 25]);
        this.checkLabelPosition(assert, this.labels[2], [5, 50]);
        this.checkLabelPosition(assert, this.labels[3], [5, 75]);
        assert.ok(this.labels[4].hide.calledOnce);
        assert.ok(this.labels[5].hide.calledOnce);
    });

    QUnit.test("Two non overlapping labels. inverted position", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 30, width: 10, height: 10 }, { x: 5, y: 10, width: 10, height: 10 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(!this.labels[1].shift.called);
    });

    QUnit.test("T173646. overlapping labels and not shared tooltip", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }]);

        var chart = this.createChart({
            tooltip: { enabled: true, shared: false },
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });

        $.each(chart.getAllSeries()[0].getPoints(), function(_, point) {
            assert.ok(!point.stackPoints);
        });

    });

    QUnit.test("kill middle label.", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 0, width: 10, height: 40, value: 12 },
                                            { x: 5, y: 40, width: 10, height: 40, value: 6 },
                                            { x: 5, y: 60, width: 10, height: 40, value: 15 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(this.labels[1].hide.calledOnce);
        assert.ok(!this.labels[2].shift.called);
        assert.ok(!this.labels[2].hide.called, "label not should be hidden");
    });

    QUnit.test("Resolve overlapping with axis. T173627", function(assert) {
        this.layoutManager.needMoreSpaceForPanesCanvas = sinon.spy(function(panes) {
            panes[0].canvas.top = 20;
        });
        this.createFakeSeriesWithLabels([{ x: 5, y: 20, width: 10, height: 30, value: 12 },
            { x: 5, y: 40, width: 10, height: 30, value: 6 },
            { x: 5, y: 60, width: 10, height: 30, value: 15 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(this.labels[1].hide.calledOnce);
        assert.ok(!this.labels[2].shift.called);
        assert.ok(!this.labels[2].hide.called, "label not should be hidden");
    });

    //T514690
    QUnit.test("stacked bar. save series order", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 20, width: 10, height: 30, value: 12 },
            { x: 5, y: 40, width: 10, height: 30, value: 6 },
            { x: 5, y: 60, width: 10, height: 30, value: 15 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "stackedbar" }]
        });

        this.checkLabelPosition(assert, this.labels[0], [5, 120]);
        this.checkLabelPosition(assert, this.labels[1], [5, 90]);
        assert.ok(!this.labels[2].shift.called);
    });

    //T514690
    QUnit.test("full stacked bar. save series order", function(assert) {
        this.createFakeSeriesWithLabels([{ x: 5, y: 20, width: 10, height: 30, value: 12 },
            { x: 5, y: 40, width: 10, height: 30, value: 6 },
            { x: 5, y: 60, width: 10, height: 30, value: 15 }]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "fullstackedbar" }]
        });

        this.checkLabelPosition(assert, this.labels[0], [5, 120]);
        this.checkLabelPosition(assert, this.labels[1], [5, 90]);
        assert.ok(!this.labels[2].shift.called);
    });

    //T514690
    QUnit.test("stacked bar. series order. last and second label were overlapped", function(assert) {
        this.createFakeSeriesWithLabels([
            { x: 5, y: 96, width: 23, height: 24, value: 5 },
            { x: 5, y: 56, width: 23, height: 24, value: 6 },
            { x: 5, y: 71, width: 23, height: 24, value: 8 },
            { x: 5, y: 46, width: 23, height: 24, value: 8 }
        ]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "stackedbar" }]
        });

        assert.deepEqual(this.labels[0].shift.lastCall.args, [5, 119]);
        assert.deepEqual(this.labels[1].shift.lastCall.args, [5, 95]);
        assert.ok(!this.labels[2].shift.called);
        assert.ok(!this.labels[3].shift.called);
    });

    QUnit.module("resolveLabelOverlapping. stack. range series", $.extend({}, commons.environment, {
        beforeEach: function() {
            commons.environment.beforeEach.apply(this, arguments);
            commons.LabelCtor.resetIndex();
            this.labels = [];
        },
        createFakeSeriesWithLabels: function(bBoxPairs, seriesOptions) {
            var that = this,
                series = new MockSeries(seriesOptions);

            var points = $.map(bBoxPairs, function(bBoxes) {
                var labels = that.createStubLabels(bBoxes);
                that.labels = that.labels.concat(labels);

                return {
                    series: series,
                    getLabels: sinon.stub().returns([labels[0], labels[1]]),
                    argument: labels[0].getBoundingRect().x,
                    originalMinValue: labels[0].getBoundingRect().value,
                    originalValue: labels[1].getBoundingRect().value
                };
            });
            seriesMockData.series.push(series);
            series.getPoints = function() { return points; };
        },
        createStubLabels: function(bBoxes) {
            return $.map(bBoxes, function(bBox) {
                var label = new commons.LabelCtor();
                label.getBoundingRect.returns(bBox);
                label.isVisible = sinon.spy(function() {
                    return !bBox.hidden && !this.hide.called;
                });
                label.shift = sinon.spy(function(x, y) {
                    var BBox = label.getBoundingRect();
                    BBox.x = x;
                    BBox.y = y;
                });
                return label;
            });
        },
        checkLabelPosition: function(assert, label, position) {
            $.each(position, function(index, value) {
                assert.equal(label.shift.lastCall.args[index], value);
            });
            assert.ok(!label.hide.called, "label not should be hidden");
        }
    }));

    QUnit.test("Top labels are resolved together with bottom ones", function(assert) {
        this.createFakeSeriesWithLabels([
            [{ x: 5, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }],
            [{ x: 5, y: 10, width: 10, height: 10 }, { x: 5, y: 15, width: 10, height: 10 }]]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        this.checkLabelPosition(assert, this.labels[1], [5, 10]);
        this.checkLabelPosition(assert, this.labels[2], [5, 20]);
        this.checkLabelPosition(assert, this.labels[3], [5, 30]);
    });

    QUnit.test("Sort labels by position before resolve", function(assert) {
        this.createFakeSeriesWithLabels([
            [{ x: 5, y: 30, width: 10, height: 10 }, { x: 5, y: 70, width: 10, height: 10 }],
            [{ x: 5, y: 10, width: 10, height: 10 }, { x: 5, y: 40, width: 10, height: 10 }]]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }]
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(!this.labels[1].shift.called);
        assert.ok(!this.labels[2].shift.called);
        assert.ok(!this.labels[3].shift.called);
    });

    QUnit.test("Kill both top and bottom labels", function(assert) {
        this.createFakeSeriesWithLabels([
            [{ x: 5, y: 0, width: 10, height: 40, value: 5 }, { x: 5, y: 5, width: 10, height: 40, value: 15 }],
            [{ x: 5, y: 10, width: 10, height: 40, value: 20 }, { x: 5, y: 50, width: 10, height: 40, value: 25 }]]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(this.labels[0].hide.calledOnce);
        assert.ok(this.labels[1].hide.calledOnce);
        assert.ok(!this.labels[2].shift.called);
        assert.ok(!this.labels[3].shift.called);
    });

    QUnit.test("Only visible labels are taken into account when Kill small labels", function(assert) {
        this.createFakeSeriesWithLabels([
            [{ x: 5, y: 0, width: 10, height: 30, value: 5 }, { x: 5, y: 35, width: 10, height: 30, value: 15 }],
            [{ x: 5, y: 10, width: 10, height: 30, value: 20, hidden: true }, { x: 5, y: 67, width: 10, height: 30, value: 25 }]]);

        this.createChart({
            resolveLabelOverlapping: "stack",
            series: [{ type: "mockType" }],
            size: { width: 100, height: 100 }
        });

        assert.ok(!this.labels[0].shift.called);
        assert.ok(!this.labels[1].shift.called);
        assert.ok(!this.labels[2].shift.called);
        assert.ok(!this.labels[3].shift.called);
        assert.ok(!this.labels[0].hide.called);
        assert.ok(!this.labels[1].hide.called);
        assert.ok(!this.labels[2].hide.called);
        assert.ok(!this.labels[3].hide.called);
    });
})();
