"use strict";

var $ = require("jquery"),
    devices = require("core/devices"),
    DataSource = require("data/data_source/data_source").DataSource;

require("viz/chart");
require("viz/polar_chart");

QUnit.testStart(function() {
    var markup =
        '<div class="tooltipInteraction">\
            <div class="parentContainer">\
                <div id="chart" class="chart"></div>\
            </div>\
            <div class="newParentContainer">\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Tooltip behavior on target scroll", {
    beforeEach: function() {
        this.tooltipHiddenSpy = sinon.spy();
    },
    createChart: function() {
        $(".tooltipInteraction .chart").dxChart({
            animation: { enabled: false },
            dataSource: [{ arg: 1, val: 1 }],
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false },
                point: { visible: false },
                tick: { visible: false },
                visible: false
            },
            series: [{ point: { visible: false }, label: { visible: false } }],
            legend: { visible: false },
            tooltip: { enabled: true },
            onTooltipHidden: this.tooltipHiddenSpy
        });
    },
    showTooltip: function() {
        $(".tooltipInteraction .chart").dxChart("instance").getAllSeries()[0].getAllPoints()[0].showTooltip();
    }
});

QUnit.test("tooltip should be hidden on any target's parent scroll", function(assert) {
    this.createChart();
    this.showTooltip();

    // act
    $(".tooltipInteraction .parentContainer").triggerHandler("scroll");

    assert.equal(this.tooltipHiddenSpy.calledOnce, true);
});

QUnit.test("tooltip should be hidden on window scroll event on desktop", function(assert) {
    var originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: "generic" });
        this.createChart();
        this.showTooltip();

        // act
        $(window).triggerHandler("scroll");

        assert.equal(this.tooltipHiddenSpy.calledOnce, true);
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test("tooltip should not be hidden on window scroll event on mobile devices", function(assert) {
    var originalPlatform = devices.real().platform;

    try {
        devices.real({ platform: "ios" });

        this.createChart();
        this.showTooltip();

        // act
        $(window).triggerHandler("scroll");

        assert.equal(this.tooltipHiddenSpy.called, false);
    } finally {
        devices.real({ platform: originalPlatform });
    }
});

QUnit.test("tooltip should not be hidden if target parent was changed (scroll on previous parent)", function(assert) {
    this.createChart();

    var $chart = $(".parentContainer .chart").detach();
    $chart.appendTo(".tooltipInteraction .newParentContainer");
    $chart.dxChart("instance").render({ force: true });
    this.showTooltip();

    // act
    $(".tooltipInteraction .parentContainer").triggerHandler("scroll");

    assert.equal(this.tooltipHiddenSpy.calledOnce, false);
});

QUnit.test("tooltip should be hidden if target parent was changed (scroll on new parent)", function(assert) {
    this.createChart();

    var $chart = $(".parentContainer .chart").detach();
    $chart.appendTo(".tooltipInteraction .newParentContainer");
    $chart.dxChart("instance").render({ force: true });
    this.showTooltip();

    // act
    $(".tooltipInteraction .newParentContainer").triggerHandler("scroll");

    assert.equal(this.tooltipHiddenSpy.calledOnce, true);
});

QUnit.test("target scroll subscriptions should be unsubscribed for current chart", function(assert) {
    this.createChart();
    var chart = $("<div></div>").appendTo(".parentContainer").dxChart({}).dxChart("instance");
    this.showTooltip();

    // act
    chart.dispose();
    $(".tooltipInteraction .parentContainer").triggerHandler("scroll");

    assert.equal(this.tooltipHiddenSpy.calledOnce, true);
});

QUnit.module("Misc");

// T351032
// The exact conditions - one of changed options is any requiring "_reinit", other is "dataSource" -
// so "_dataSourceChangedHandler" is called during "_reinit".
// The new data source should cause incident - so "incidentOccurred" event is triggered during "_dataSourceChangedHandler".
// During incident processing "beginUpdate" must be called somehow.
// In the customer's issue it is somehow accomplished by actions code. In the test (for simplicity) it is done manually.
// On "beginUpdate" chart comes to invalid state and later crashes on "endUpdate".
QUnit.test("There should be no crash when chart updating is began after option is changed and ended some time later", function(assert) {
    var chart = $("#chart").dxChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: {},
        onIncidentOccurred: function(e) {
            chart.beginUpdate();
            chart.option("dataSource", []);
        }
    }).dxChart("instance");

    chart.option({
        dataSource: [{ arg: 1, v: 1 }],
        argumentAxis: {}
    });
    chart.endUpdate();

    assert.ok(true, "there should be no exceptions");
});

// T357324
QUnit.test("Three stacked spline area series (one of which has null point) should not cause crash", function(assert) {
    $(".chart").dxChart({
        dataSource: [{
            arg: 1, v1: 1, v2: 2, v3: 3
        }, {
            arg: 2, v1: 2, v2: null, v3: 1
        }],
        commonSeriesSettings: { type: "stackedSplineArea" },
        series: [{ valueField: "v1" }, { valueField: "v2" }, { valueField: "v3" }]
    });

    assert.ok(true, "there should be no exceptions");
});

// T402081
QUnit.test("number of rendering on updating dataSource", function(assert) {
    var drawn = sinon.spy(),
        data = new DataSource({
            store: []
        }),
        chart = $("#chart").dxChart({
            dataSource: data,
            series: {},
            onDrawn: drawn
        }).dxChart("instance");

    drawn.reset();

    chart.option({ dataSource: data });
    data.load();

    assert.equal(drawn.callCount, 2, "drawn only on changing dataSource & load");
});

// T600660
QUnit.test("useSpiderWeb option changing", function(assert) {
    var polar = $("#chart").dxPolarChart({
            series: [{}]
        }).dxPolarChart("instance"),
        initialSeries = polar.getAllSeries()[0];

    polar.option("useSpiderWeb", true);

    assert.ok(polar.getAllSeries()[0].getOptions().spiderWidget);
    assert.ok(initialSeries === polar.getAllSeries()[0]);
});

QUnit.module("series API", {
    beforeEach: function() {
        this.options = {
            animation: { enabled: false },
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false },
                tick: { visible: false },
                visible: false
            },
            commonSeriesSettings: {
                point: { visible: false },
                label: { visible: false }
            },
            dataSource: [
                { arg: 1, val: 1, val2: 1 },
                { arg: 2, val: 2, val2: 2 },
                { arg: 3, val: 3, val2: 3 }
            ],
            series: [{ argumentField: "arg", valueField: "val" }]
        };
    },
    createChart: function(options) {
        this.chart = $("#chart").dxChart(options || this.options).dxChart("instance");

        return this.chart;
    }
});

QUnit.test("single series. select", function(assert) {
    // arrange
    this.options.onSeriesSelectionChanged = sinon.spy();

    var chart = this.createChart(this.options);

    // act
    chart.getAllSeries()[0].select();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 1);
});

QUnit.test("single series. double select", function(assert) {
    // arrange
    this.options.onSeriesSelectionChanged = sinon.spy();

    var chart = this.createChart(this.options);

    chart.getAllSeries()[0].select();
    // act
    chart.getAllSeries()[0].select();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 1);
});

QUnit.test("single series. clear selection selected series", function(assert) {
    // arrage
    this.options.onSeriesSelectionChanged = sinon.spy();
    var chart = this.createChart(this.options);

    chart.getAllSeries()[0].select();

    // act
    chart.getAllSeries()[0].clearSelection();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 2);
});

QUnit.test("single series. clear selection not selected series", function(assert) {
    // arrage
    this.options.onSeriesSelectionChanged = sinon.spy();
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].clearSelection();

    // assert
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 0);
});

QUnit.test("select second series with single selection mode", function(assert) {
    // arrange
    this.options.series.push({ argumentField: "arg", valueField: "val2" });
    this.options.onSeriesSelectionChanged = sinon.spy();
    this.options.seriesSelectionMode = "single";
    this.createChart(this.options);

    var allSeries = this.chart.getAllSeries();

    allSeries[0].select();

    // act
    allSeries[1].select();

    // assert
    assert.strictEqual(allSeries[0].isSelected(), false);
    assert.strictEqual(allSeries[1].isSelected(), true);
    assert.equal(this.options.onSeriesSelectionChanged.callCount, 3);
});

QUnit.test("select series with two series", function(assert) {
    // arrange
    this.options.series.push({ argumentField: "arg", valueField: "val2" });
    this.options.seriesSelectionMode = "single";
    this.createChart(this.options);

    var allSeries = this.chart.getAllSeries();

    // act
    allSeries[0].select();

    // assert
    assert.strictEqual(allSeries[0].isSelected(), true);
});

QUnit.test("select second series with multiple selection mode", function(assert) {
    // arrange
    this.options.series.push({ argumentField: "arg", valueField: "val2" });
    this.options.seriesSelectionMode = "multiple";
    this.createChart(this.options);

    var allSeries = this.chart.getAllSeries();

    allSeries[0].select();

    // act
    allSeries[1].select();

    // assert
    assert.strictEqual(allSeries[0].isSelected(), true);
    assert.strictEqual(allSeries[1].isSelected(), true);
});

QUnit.test("select point", function(assert) {
    // arrange
    var pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = "single";
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();

    // assert
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), true);
    assert.equal(pointSelectionChanged.callCount, 1);
});

QUnit.test("select selected point", function(assert) {
    // arrange
    var pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = "single";
    this.createChart(this.options);
    this.chart.getAllSeries()[0].getAllPoints()[0].select();

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();

    // assert
    assert.equal(pointSelectionChanged.callCount, 1);
});

QUnit.test("clear selection of selected point", function(assert) {
    // arrange
    var pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = "single";
    this.createChart(this.options);

    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].clearSelection();

    // assert
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), false);
    assert.equal(pointSelectionChanged.callCount, 2);
});

QUnit.test("clear selection of unselected point", function(assert) {
    // arrange
    var pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = "single";
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].clearSelection();

    // assert
    assert.equal(pointSelectionChanged.callCount, 0);
});

QUnit.test("select two points. single mode", function(assert) {
    // arrange
    var pointSelectionChanged = this.options.onPointSelectionChanged = sinon.spy();

    this.options.pointSelectionMode = "single";
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    this.chart.getAllSeries()[0].getAllPoints()[1].select();

    // assert
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), false);
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[1].isSelected(), true);
    assert.equal(pointSelectionChanged.callCount, 3);
});

QUnit.test("select points in different series", function(assert) {
    this.options.series.push({ argumentField: "arg", valueField: "val2" });

    this.options.pointSelectionMode = "single";
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    this.chart.getAllSeries()[1].getAllPoints()[0].select();

    // assert
    assert.equal(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), false);
});

QUnit.test("select two points with multiple mode", function(assert) {
    // arrange
    this.options.pointSelectionMode = "multiple";
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].select();
    this.chart.getAllSeries()[0].getAllPoints()[1].select();

    // assert
    assert.equal(this.chart.getAllSeries()[0].getAllPoints()[0].isSelected(), true);
});

QUnit.test("hover", function(assert) {
    // arrange
    var hoverChanged = this.options.onSeriesHoverChanged = sinon.spy();
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].hover();

    // assert
    assert.equal(hoverChanged.callCount, 1);
});

QUnit.test("clearHover", function(assert) {
    // arrange
    var hoverChanged = this.options.onSeriesHoverChanged = sinon.spy();
    this.createChart(this.options);
    this.chart.getAllSeries()[0].hover();
    hoverChanged.reset();
    // act
    this.chart.getAllSeries()[0].clearHover();

    // assert
    assert.equal(hoverChanged.callCount, 1);
});

QUnit.test("hoverPoint", function(assert) {
    // arrange
    var pointHover = this.options.onPointHoverChanged = sinon.spy();
    this.createChart(this.options);

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].hover();

    // assert
    assert.equal(pointHover.callCount, 1);
});

QUnit.test("clearPointHover", function(assert) {
    // arrange
    var pointHover = this.options.onPointHoverChanged = sinon.spy();
    this.createChart(this.options);
    this.chart.getAllSeries()[0].getAllPoints()[0].hover();
    pointHover.reset();

    // act
    this.chart.getAllSeries()[0].getAllPoints()[0].clearHover();

    // assert
    assert.equal(pointHover.callCount, 1);
    assert.strictEqual(this.chart.getAllSeries()[0].getAllPoints()[0].isHovered(), false);
});

QUnit.test("Clean point hover after hover another point", function(assert) {
    // arrange
    var points,
        series;

    this.createChart(this.options);
    series = this.chart.getAllSeries()[0];
    points = series.getAllPoints();

    // act
    points[0].hover();
    points[1].hover();

    // assert
    assert.strictEqual(points[0].isHovered(), false);
});

QUnit.test("onPointhoverChanged on hover second", function(assert) {
    // arrange
    var pointHover = this.options.onPointHoverChanged = sinon.spy();

    this.createChart(this.options);
    this.chart.getAllSeries()[0].getAllPoints()[0].hover();
    pointHover.reset();
    // act
    this.chart.getAllSeries()[0].getAllPoints()[1].hover();

    // assert
    assert.strictEqual(pointHover.getCall(0).args[0].target, this.chart.getAllSeries()[0].getAllPoints()[0]);
});

QUnit.module("axis grids hidding", {
    createChart: function(options) {
        return $("#chart").dxChart(options).dxChart("instance");
    }
});

QUnit.test("hide grids for first stub axis", function(assert) {
    // act
    var chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ axis: "a1" }, { argumentField: "argumentField" }],
        valueAxis: [{
            name: "stubAxis",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }, {
            name: "a1",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });

    var stubAxis = chart.getValueAxis("stubAxis");
    var valueAxis = chart.getValueAxis("a1");

    assert.equal(stubAxis.getOptions().grid.visible, false, "first axis grid isn't visible");
    assert.equal(stubAxis.getOptions().minorGrid.visible, false, "first axis grid isn't visible");

    assert.equal(valueAxis.getOptions().grid.visible, true, "second axis grid visible");
    assert.equal(valueAxis.getOptions().minorGrid.visible, true, "second axis grid visible");
});

QUnit.test("hide grids for second axis", function(assert) {
    // act
    var chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ axis: "a1" }, { axis: "a2" }],
        valueAxis: [{
            name: "a2",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }, {
            name: "a1",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });
    var firstAxis = chart.getValueAxis("a2");
    var secondAxis = chart.getValueAxis("a1");

    assert.equal(firstAxis.getOptions().grid.visible, true, "first axis grid visible");
    assert.equal(firstAxis.getOptions().minorGrid.visible, true, "first axis grid visible");

    assert.equal(secondAxis.getOptions().grid.visible, false, "second axis grid isn't visible");
    assert.equal(secondAxis.getOptions().minorGrid.visible, false, "second axis grid isn't visible");
});

QUnit.test("T570332. Do not show minor grid when it disabled and two stub axis", function(assert) {
    // act
    var chart = this.createChart({
        series: [{ axis: "a1" }, { axis: "a2" }],
        valueAxis: [{
            name: "a2",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: false
            }
        }, {
            name: "a1",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: false
            }
        }]
    });
    var firstAxis = chart.getValueAxis("a2");
    var secondAxis = chart.getValueAxis("a1");

    assert.equal(firstAxis.getOptions().minorGrid.visible, false, "first axis minor grid isn't visible");
    assert.equal(secondAxis.getOptions().minorGrid.visible, false, "second axis minor grid isn't visible");
});

QUnit.test("T570332. Make minor grid visible for first non stub axis", function(assert) {
    // act
    var chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ axis: "a1" }, { axis: "a2" }],
        valueAxis: [{
            name: "a2",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: false
            }
        }, {
            name: "a1",
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });
    var firstAxis = chart.getValueAxis("a2");
    var secondAxis = chart.getValueAxis("a1");

    assert.equal(firstAxis.getOptions().minorGrid.visible, true, "first axis minor grid is visible");
    assert.equal(secondAxis.getOptions().minorGrid.visible, false, "second axis minor grid isn't visible");
});

QUnit.test("two stub axis", function(assert) {
    // act
    var chart = this.createChart({
        dataSource: [{ arg: 1, val: 1 }],
        series: [{ argumentField: "a1" }, { argumentField: "a1" }],
        valueAxis: [{
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }, {
            grid: {
                visible: true
            },
            minorGrid: {
                visible: true
            }
        }]
    });

    var verticalAxes = chart._valueAxes;

    assert.equal(verticalAxes.length, 2, "chart must have two value axis");
    assert.equal(verticalAxes[0].getOptions().grid.visible, true, "first axis grid visible");
    assert.equal(verticalAxes[0].getOptions().minorGrid.visible, true, "first axis grid visible");

    assert.equal(verticalAxes[1].getOptions().grid.visible, false, "second axis grid isn't visible");
    assert.equal(verticalAxes[1].getOptions().minorGrid.visible, false, "second axis grid isn't visible");
});
