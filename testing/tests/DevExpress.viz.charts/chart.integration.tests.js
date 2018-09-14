var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    executeAsyncMock = require("../../helpers/executeAsyncMock.js"),
    rendererModule = require("viz/core/renderers/renderer"),
    legendModule = require("viz/components/legend"),
    titleModule = require("viz/core/title"),
    dxChart = require("viz/chart"),
    dxPieChart = require("viz/pie_chart"),
    dxPolarChart = require("viz/polar_chart"),
    baseChartModule = require("viz/chart_components/base_chart"),
    setupSeriesFamily = require("../../helpers/chartMocks.js").setupSeriesFamily;

setupSeriesFamily();
QUnit.testStart(function() {
    var markup =
        '<div id="container"></div>\
        <div id="containerForCheckingGroups" style="height: 150px"></div>\
        <div id="chartContainer" style="width: 300px; height: 150px;"></div>';

    $("#qunit-fixture").html(markup);
});

var chartContainerCounter = 1,
    containerName,
    executeAsyncMock = DevExpress.testing.executeAsyncMock,
    moduleSetup = {
        beforeEach: function() {
            containerName = "chartContainer" + chartContainerCounter;
            this.$container = $('<div id="" + containerName + "" style="width: 600px;height:400px;"></div>');
            $("#container").append(this.$container);
            chartContainerCounter++;
            executeAsyncMock.setup();
        },
        afterEach: function() {
            // terrible hack to remove our DOM elements which became global variables
            // http://stackoverflow.com/questions/3434278/ie-chrome-are-dom-tree-elements-global-variables-here
            this.$container.remove();
            if(QUnit.config["noglobals"]) {
                $("#" + containerName).remove();
                executeAsyncMock.teardown();
            }
        },
        createPolarChart: function(options) {
            return this.createChartCore(options, dxPolarChart);
        },
        createPieChart: function(options) {
            return this.createChartCore(options, dxPieChart);
        },
        createChart: function(options) {
            return this.createChartCore(options, dxChart);
        },
        createChartCore: function(options, chartType) {
            var chart;
            var mergedOptions = $.extend(true,
                {},
                options);

            chart = new chartType(this.$container, mergedOptions);
            return chart;
        }
    };

function createChartInstance(options, chartContainer) {
    return chartContainer.dxChart(options).dxChart("instance");
}

QUnit.module("dxChart", moduleSetup);

QUnit.test("T244164", function(assert) {
    var chart = this.createChart({});
    chart.option({
        argumentAxis: {
            inverted: true
        },
        size: {
            width: 801,
            height: 300
        }
    });
    assert.ok(true);
});

QUnit.test("MultiAxis with title and inverted axis", function(assert) {
    var categories = ["first", "second", "third", "fourth", "fifth"],
        rotated = true;

    this.$container.css({ width: "1000px", height: "600px" });

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        rotated: rotated,
        commonPaneSettings: {
            border: {
                visible: true
            }
        },
        commonSeriesSettings: {
            point: { visible: true, size: 10, symbol: "cross", hoverStyle: { size: 20, border: { width: 10 } }, color: "blue" }
        },
        argumentAxis: {
            categories: categories, grid: { visible: true }, label: { rotationAngle: 10, font: { size: 30, color: "blue" } },
            tick: { color: "red", visible: true },
            title: {
                text: "title test<br/>test test test<br/> test"
            },
        },
        dataSource: [
                { arg: "first", val: 400, val1: 5, val2: 1 },
                { arg: "second", val: 200, val1: 4, val2: 2 },
                { arg: "third", val: 900, val1: 3, val2: 3 },
                { arg: "fourth", val: 100, val1: 2, val2: 2 },
                { arg: "fifth", val: 340, val1: 0, val2: 0 }],
        series: [{
            axis: "axis2"
        }, {
            axis: "axis1",
            valueField: "val1"
        },
        {
            axis: "axis3",
            type: "splinearea",
            valueField: "val2"
        }
        ],
        valueAxis: [{
            axisDivisionFactor: 50,
            visible: true, // B231173
            min: 0,
            tickInterval: 50,
            name: "axis2",
            max: 1200,
            position: "left",
            title: { text: "title very long <br/> test <br/> test", margin: 0 },
            grid: {
                visible: true
            },
            label: {
                font: {
                    color: "brown"
                }
            }
        }, {
            axisDivisionFactor: 50,
            visible: true, // B231173
            name: "axis1",
            min: 0,
            max: 5,
            inverted: true, // B231235
            grid: {
                visible: true
            },
            label: {
                font: {
                    color: "green"
                }
            }
        }, {
            axisDivisionFactor: 50,
            visible: true, // B231173
            name: "axis3",
            min: 0,
            max: 11,
            grid: {
                visible: true
            },
            title: "title", // B231060
            label: {
                font: {
                    color: "green"
                }
            }
        }],
        legend: { visible: true, rowCount: 2 },

        tooltip: {
            enabled: true,
            arrowLength: 15
        }
    });

    assert.ok(chart);
    // B231181
    assert.deepEqual(chart._valueAxes[1].getTicksValues().majorTicksValues, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6], "second value axis tick values");
    assert.deepEqual(chart._valueAxes[2].getTicksValues().majorTicksValues, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], "third value axis tick values");
});

QUnit.test("Problem with two axis and range", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: new Date(2011, 10, 10),
            val: 4
        }, {
            arg: new Date(2011, 11, 10),
            val: 8
        }],
        valueAxis: [{ "label": {}, "placeholderSize": 40, axisDivisionFactor: 30 }, { "position": "right", "placeholderSize": 10, axisDivisionFactor: 30 }],
        series: { type: "bar" }
    });

    assert.ok(chart);

    chart.option("size", { width: 900 });

    assert.deepEqual(chart._valueAxes[0].getTicksValues().majorTicksValues, [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8], "main value axis tick values");
});

QUnit.test("Set visualRange via arguments", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 8
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        series: { type: "line" }
    });

    chart.getArgumentAxis().visualRange(2.5);

    assert.deepEqual(chart._argumentAxes[0].getViewport(), { startValue: 2.5, endValue: undefined });
});

QUnit.test("Set visualRange via array", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var visualRangeChanged = sinon.spy();

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        series: { type: "line" },
        onOptionChanged: visualRangeChanged
    });

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([3, 6]);

    assert.deepEqual(chart._argumentAxes[0].getViewport(), { startValue: 3, endValue: 6 });
    assert.deepEqual(chart._valueAxes[0].visualRange(), { startValue: 5.6, endValue: 7.1 });
    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { startValue: 3, endValue: 6 });
});

QUnit.test("Set visualRange for indexed valueAxis (check onOptionChanged fired)", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var visualRangeChanged = sinon.spy();

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        series: { type: "line" },
        onOptionChanged: visualRangeChanged,
        valueAxis: [{}]
    });

    assert.ok(chart);

    visualRangeChanged.reset();
    chart.getValueAxis().visualRange([3, 6]);

    assert.deepEqual(visualRangeChanged.lastCall.args[0].value, { startValue: 3, endValue: 6 });
    assert.deepEqual(chart.option("valueAxis[0].visualRange"), { startValue: 3, endValue: 6 });
});

QUnit.test("Set visualRange for multi axis (exists single option collection for value axes)", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var visualRangeChanged = sinon.spy();

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: 4,
            val2: 2
        }, {
            arg: 2,
            val1: 5,
            val2: 3
        }, {
            arg: 5,
            val1: 7,
            val2: 1
        }, {
            arg: 8,
            val1: 4,
            val2: 5
        }, {
            arg: 11,
            val1: 8,
            val2: 4
        }],
        series: [{ type: "line", valueField: "val1" }, { type: "line", valueField: "val2", axis: "axis1" }],
        onOptionChanged: visualRangeChanged,
        valueAxis: { valueMarginsEnabled: false }
    });

    assert.ok(chart);

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([2, 8]);

    assert.equal(visualRangeChanged.callCount, 2);
    assert.deepEqual(chart.option("valueAxis.visualRange"), { startValue: 4, endValue: 7 });
});

QUnit.test("Set visualRange for multi axis/pane (exists option collection for each value axis)", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var visualRangeChanged = sinon.spy();

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: -10,
            val2: 20
        }, {
            arg: 2,
            val1: 5,
            val2: 3
        }, {
            arg: 5,
            val1: 7,
            val2: 25
        }, {
            arg: 8,
            val1: 3,
            val2: 5
        }, {
            arg: 11,
            val1: 20,
            val2: -10
        }],
        panes: [{ name: "p1" }, { name: "p2" }],
        series: [{ type: "line", valueField: "val1", pane: "p1" }, { type: "line", valueField: "val2", pane: "p2" }],
        onOptionChanged: visualRangeChanged,
        valueAxis: [{ pane: "p1" }, { pane: "p2" }]
    });

    assert.ok(chart);

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([1.5, 10]);

    assert.equal(visualRangeChanged.callCount, 3);
    assert.deepEqual(chart.option("valueAxis[0].visualRange"), { startValue: -5, endValue: 15 });
    assert.deepEqual(chart.option("valueAxis[1].visualRange"), { startValue: -10, endValue: 30 });
});

QUnit.test("Pass visualRange array if options is set using array", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var visualRangeChanged = sinon.spy();

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        adjustOnZoom: false,
        dataSource: [{
            arg: 1,
            val: 4
        }, {
            arg: 2,
            val: 5
        }, {
            arg: 5,
            val: 7
        }, {
            arg: 8,
            val: 3
        }, {
            arg: 11,
            val: 8
        }],
        argumentAxis: {
            visualRange: [1, 10]
        },
        series: { type: "line" },
        onOptionChanged: visualRangeChanged
    });

    visualRangeChanged.reset();
    chart.getArgumentAxis().visualRange([3, 6]);

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, [3, 6]);
});

QUnit.test("Set visualRange for multi axis/pane (check option method and adjustOnZoom)", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var visualRangeChanged = sinon.spy();

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: -10,
            val2: 20
        }, {
            arg: 2,
            val1: 5,
            val2: 3
        }, {
            arg: 5,
            val1: 7,
            val2: 25
        }, {
            arg: 8,
            val1: 3,
            val2: 5
        }, {
            arg: 11,
            val1: 20,
            val2: -10
        }],
        panes: [{ name: "p1" }, { name: "p2" }],
        series: [{ type: "line", valueField: "val1", pane: "p1" }, { type: "line", valueField: "val2", pane: "p2" }],
        onOptionChanged: visualRangeChanged,
        valueAxis: [{ pane: "p1" }, { pane: "p2" }]
    });

    chart.getArgumentAxis().visualRange([1.5, 10]);
    chart.option("valueAxis[0].visualRange", [5, 10]);
    chart.getArgumentAxis().visualRange([4, 6]);

    assert.deepEqual(chart.option("valueAxis[0].visualRange"), [5, 10]);
    assert.deepEqual(chart.option("valueAxis[1].visualRange"), { startValue: 16, endValue: 26 });
});

QUnit.test("Set argument visual range using option", function(assert) {
    var chart = this.createChart({
        dataSource: [{
            arg: 0,
            val: 0,
        }, {
            arg: 2,
            val: 10,
        }],
        series: {}
    });

    chart.option("argumentAxis.visualRange", { startValue: 2, endValue: 10 });

    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 2, endValue: 10 });
});

QUnit.test("Using the single section of axis options for some panes (check customVisualRange merging)", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var visualRangeChanged = sinon.spy();
    var panes = [{ name: "p1" }];

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: 1,
            val1: -10,
            val2: 20
        }, {
            arg: 2,
            val1: 5,
            val2: 3
        }, {
            arg: 5,
            val1: 7,
            val2: 25
        }, {
            arg: 8,
            val1: 3,
            val2: 5
        }, {
            arg: 11,
            val1: 20,
            val2: -10
        }],
        panes: panes,
        series: [{ type: "line", valueField: "val1", pane: "p1", axis: "ax1" }, { type: "line", valueField: "val2", pane: "p2", axis: "ax1" }],
        onOptionChanged: visualRangeChanged,
        valueAxis: { name: "ax1" }
    });

    chart.getArgumentAxis().visualRange([4, 6]);
    panes.push({ name: "p2" });
    chart.option("panes", panes);

    assert.deepEqual(chart.option("valueAxis.visualRange"), chart.getValueAxis().visualRange());
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 4, endValue: 6 }, "argument visual range");
    assert.deepEqual(chart._valueAxes[0].visualRange(), { startValue: 5.6, endValue: 7.2 });
    assert.deepEqual(chart._valueAxes[1].visualRange(), { startValue: 16, endValue: 26 });
});

QUnit.test("Set the visualRange option by the different ways", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var dataSource = [{
        arg: 1,
        val: 4
    }, {
        arg: 2,
        val: 5
    }, {
        arg: 5,
        val: 7
    }, {
        arg: 8,
        val: 3
    }, {
        arg: 11,
        val: 8
    }];
    var visualRangeChanged = sinon.spy();

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: dataSource,
        series: { type: "line" },
        onOptionChanged: visualRangeChanged,
        argumentAxis: { visualRange: [3, 10] },
        valueAxis: { visualRange: { startValue: 4, endValue: 7 } }
    });

    assert.deepEqual(chart.option("argumentAxis.visualRange"), [3, 10]);
    assert.deepEqual(chart.option("valueAxis.visualRange"), { startValue: 4, endValue: 7 });
    assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 3, endValue: 10 });
    assert.deepEqual(chart.getValueAxis().visualRange(), { startValue: 4, endValue: 7 });

    visualRangeChanged.reset();
    chart.option("valueAxis.visualRange", [3, 6]);

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, [3, 6]);
    assert.deepEqual(chart.option("valueAxis.visualRange"), [3, 6]);
    assert.deepEqual(chart._options.valueAxis._customVisualRange, [3, 6]);

    visualRangeChanged.reset();
    chart.option("valueAxis", { visualRange: [1, 4] });

    assert.deepEqual(visualRangeChanged.firstCall.args[0].value, { visualRange: [1, 4] });
    assert.deepEqual(chart.option("valueAxis.visualRange"), [1, 4]);
    assert.deepEqual(chart._options.valueAxis._customVisualRange, [1, 4]);

    visualRangeChanged.reset();
    chart.option({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: dataSource,
        series: { type: "line" },
        onOptionChanged: visualRangeChanged,
        valueAxis: { visualRange: [2, 7] }
    });

    assert.deepEqual(visualRangeChanged.getCall(3).args[0].value, { visualRange: [2, 7] });
    assert.deepEqual(chart.option("valueAxis.visualRange"), [2, 7]);
    assert.deepEqual(chart._options.valueAxis._customVisualRange, [2, 7]);
});

QUnit.test("Set zoom in the onDone callback", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });
    var dataSource = [{
        arg: 1,
        val: 4
    }, {
        arg: 2,
        val: 5
    }, {
        arg: 5,
        val: 7
    }, {
        arg: 8,
        val: 3
    }, {
        arg: 11,
        val: 8
    }];

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: dataSource,
        series: { type: "line" },
        onDone: function(e) {
            e.component.zoomArgument(2, 5);
        }
    });

    var businessRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.deepEqual(chart.option("argumentAxis.visualRange"), { startValue: 2, endValue: 5 });
    assert.equal(businessRange.minVisible, 2);
    assert.equal(businessRange.maxVisible, 5);
});

QUnit.test("Set null visualRange", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: new Date(2010, 0, 1),
            val: 4
        }, {
            arg: new Date(2011, 0, 1),
            val: 8
        }, {
            arg: new Date(2012, 0, 1),
            val: 7
        }, {
            arg: new Date(2013, 0, 1),
            val: 3
        }, {
            arg: new Date(2014, 0, 1),
            val: 8
        }],
        series: { type: "line" },
        argumentAxis: { valueMarginsEnabled: false }
    });

    chart.getArgumentAxis().visualRange([null, null]);

    assert.deepEqual(chart._argumentAxes[0].visualRange(), {
        startValue: new Date(2010, 0, 1),
        endValue: new Date(2014, 0, 1)
    }, "visualRange is full (argument axis)");
    assert.deepEqual(chart._valueAxes[0].visualRange(), { startValue: 2.5, endValue: 8.5 }, "visualRange is full (value axis)");
});

QUnit.test("Move visual frame by visualRangeLength", function(assert) {
    this.$container.css({ width: "1000px", height: "600px" });

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: [{
            arg: new Date(2010, 0, 1),
            val: 4
        }, {
            arg: new Date(2011, 0, 1),
            val: 8
        }, {
            arg: new Date(2012, 0, 1),
            val: 7
        }, {
            arg: new Date(2013, 0, 1),
            val: 3
        }, {
            arg: new Date(2014, 0, 1),
            val: 15
        }],
        series: { type: "line" },
        argumentAxis: {
            visualRange: {
                length: { years: 2 }
            }
        },
        valueAxis: { valueMarginsEnabled: false }
    });

    // act
    chart.getArgumentAxis().visualRange({ startValue: new Date(2010, 3, 1), length: { years: 2 } });

    assert.deepEqual(chart._argumentAxes[0].visualRange(), {
        startValue: new Date(2010, 3, 1),
        endValue: new Date(2012, 2, 31)
    });
});

QUnit.test("dxChart reinitialization - series - dataSource", function(assert) {
    // arrange
    var chart = this.$container.dxChart({
        dataSource: [{ arg: "January", val1: 24, val2: 0, val3: 15 },
            { arg: "February", val1: 0, val2: 34, val3: 40 },
        ],
        series: [{
            name: "First",
            valueField: "val1"
        }, {
            name: "Second",
            valueField: "val2"
        }],
        title: "original"
    });
    // act
    chart = this.$container.dxChart({
        series: [{
            name: "Third",
            valueField: "val3"
        }],
        title: {
            text: "updated"
        }
    });

    // assert
    chart = this.$container.dxChart("instance");
    assert.equal(chart.series.length, 1, "Series number");
    assert.equal(chart._legend._data.length, 1, "Legend reinitialized");
});

QUnit.test("dxChart reinitialization - dataSource - correct axes/data types", function(assert) {
    // arrange
    var chart = this.createChart({
        dataSource: [],
        series: [{
            name: "First",
            valueField: "val1"
        }],
        title: "original"
    });
    // act
    assert.equal(chart._argumentAxes[0].getOptions().type, "continuous");
    assert.equal(chart._argumentAxes[0].getOptions().dataType, undefined);
    assert.equal(chart._valueAxes[0].getOptions().type, "continuous");
    assert.equal(chart._valueAxes[0].getOptions().dataType, undefined);

    this.$container.dxChart({
        dataSource: [{ arg: "January", val1: new Date(100000) },
            { arg: "February", val1: new Date(100000) }]
    });

    // assert
    assert.ok(chart);
    assert.equal(chart._argumentAxes[0].getOptions().type, "discrete");
    // equal(chart._argumentAxes[0].getOptions().dataType, "string");
    assert.equal(chart._valueAxes[0].getOptions().type, "continuous");
    // equal(chart._valueAxes[0].getOptions().dataType, "datetime");
});

QUnit.test("dxChart reinitialization - dataSource - correct axes min max", function(assert) {
    // arrange
    var chart = this.createChart({
        dataSource: [],
        series: [{
            name: "First",
            valueField: "val1"
        }],
        title: "original"
    });

    var argAxis = chart._argumentAxes[0],
        argFunction = argAxis.setBusinessRange,
        valAxis = chart._valueAxes[0],
        valFunction = valAxis.setBusinessRange;

    argAxis.setBusinessRange = sinon.spy(function() { return argFunction.apply(argAxis, arguments); });
    valAxis.setBusinessRange = sinon.spy(function() { return valFunction.apply(valAxis, arguments); });

    // act
    this.$container.dxChart({
        dataSource: [{ arg: 223, val1: 1 },
            { arg: 445, val1: 4 }]
    });

    // assert
    assert.equal(argAxis.setBusinessRange.lastCall.args[0].min, 223);
    assert.equal(argAxis.setBusinessRange.lastCall.args[0].max, 445);
    assert.equal(valAxis.setBusinessRange.lastCall.args[0].min, 1);
    assert.equal(valAxis.setBusinessRange.lastCall.args[0].max, 4);
});

QUnit.test("dxChart with vertical axis with title", function(assert) {
    // arrange, act
    this.$container.width("300px");
    this.$container.dxChart({
        valueAxis: {
            title: "some title",
            position: "left"
        }
    });
    // assert
    assert.equal(this.$container.find(".dxc-val-title").text(), "some title");
});

QUnit.test("dxChart with horizontal axis with title", function(assert) {
    // arrange, act
    this.$container.width("300px");
    this.$container.dxChart({
        valueAxis: {
            title: "some title",
            position: "bottom"
        }
    });
    // assert
    assert.equal(this.$container.find(".dxc-val-title").text(), "some title");
});

// T353296
// must be in axis (but with real renderer)
QUnit.test("valid text in strip's labels", function(assert) {
    this.createChart({
        dataSource: [
            { "year": 1950, "europe": 546, "americas": 332, "africa": 227 },
            { "year": 2050, "europe": 650, "americas": 1231, "africa": 1937 }
        ],
        commonSeriesSettings: {
            argumentField: 'year'
        },
        series: [
            { valueField: 'europe' }
        ],
        argumentAxis: {
            strips: [
                {
                    startValue: 2013, endValue: 2060, color: 'rgb(68, 100, 213)',
                    label: { text: 'SomeValue' }
                }
            ]
        }
    });

    assert.strictEqual($($(this.$container.find(".dxc-arg-axis-labels")[0]).children()[0]).text(), "SomeValue");
});

// T485059
QUnit.test("Chart was rendered with series template & dataSource = null", function(assert) {
    var drawn = sinon.spy();

    this.createChart({
        dataSource: null,
        seriesTemplate: {
            nameField: "year"
        },
        onDrawn: drawn
    });

    assert.ok(drawn.called);
});

QUnit.test("Ticks calculation after resize", function(assert) {
    var container = this.$container.width(300).height(150),
        chart = this.createChart({
            animation: {
                enabled: false
            },
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
            series: [ { type: "bar" }],
            legend: {
                visible: false
            }
        });

    container.width(100).height(100);
    chart.render();
    container.width(300).height(150);
    chart.render();

    assert.deepEqual(chart._argumentAxes[0].getTicksValues().majorTicksValues, [1, 1.5, 2]);
});

QUnit.test("Set user's small ticksInterval (user's axisDivisionFactor undefined)", function(assert) {
    var data = [{
        arg: 1950,
        val: 2525778669
    }, {
        arg: 1980,
        val: 4449048798
    }, {
        arg: 2010,
        val: 6916183482
    }];

    this.$container.css({ width: "1000px", height: "600px" });

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: data,
        legend: {
            visible: false
        },
        series: { },
        argumentAxis: {
            tickInterval: 2,
            label: {
                format: {
                    type: "decimal"
                }
            }
        }
    });

    assert.deepEqual(chart._argumentAxes[0]._tickInterval, 2, "user's tickinterval");
});

QUnit.test("Calculate tickInterval, when user's ticksInterval and axisDivisionFactor are defined", function(assert) {
    var data = [{
        arg: 1950,
        val: 2525778669
    }, {
        arg: 1980,
        val: 4449048798
    }, {
        arg: 2010,
        val: 6916183482
    }];

    this.$container.css({ width: "1000px", height: "600px" });

    var chart = this.createChart({
        size: {
            width: 1000,
            height: 600
        },
        dataSource: data,
        legend: {
            visible: false
        },
        series: { },
        argumentAxis: {
            tickInterval: 2,
            axisDivisionFactor: 200,
            label: {
                format: {
                    type: "decimal"
                }
            }
        }
    });

    assert.deepEqual(chart._argumentAxes[0]._tickInterval, 20, "calculated tickinterval");
});

QUnit.module("B237847. Groups and classes", moduleSetup);

QUnit.test("dxChart groups and classes", function(assert) {
    var $container = this.$container;
    $container.dxChart({
        title: "test",
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    assert.equal($container.find(".dxc-arg-title").length, 1, "There is one arg title group");
    assert.equal($container.find(".dxc-val-title").length, 1, "There is one val title group");

    assert.equal($container.find(".dxc-background").length, 1, "There is one background group");
    assert.equal($container.find(".dxc-strips-group").length, 1, "There is one strips group");
    assert.equal($container.find(".dxc-arg-strips").length, 1, "There is one h-strips group");
    assert.equal($container.find(".dxc-val-strips").length, 1, "There is one v-strips group");
    assert.equal($container.find(".dxc-axes-group").length, 1, "There is one axes group");
    assert.equal($container.find(".dxc-arg-axis").length, 1, "There is one h-axis group");
    assert.equal($container.find(".dxc-val-axis").length, 1, "There is one v-axis group");
    assert.equal($container.find(".dxc-border").length, 1, "There is one border group");
    assert.equal($container.find(".dxc-series-group").length, 1, "There is one series group");
    assert.equal($container.find(".dxc-labels-group").length, 1, "There is one labels group");
    assert.equal($container.find(".dxc-legend").length, 1, "There is one legend group");
    assert.equal($container.find(".dxc-constant-lines-group").length, 1, "There is one constant line group");
    assert.equal($container.find(".dxc-arg-constant-lines").length, 3, "There is one h-constant-lines group");
    assert.equal($container.find(".dxc-val-constant-lines").length, 3, "There is one v-constant-lines group");
});

QUnit.test("dxChart groups and classes after redraw", function(assert) {
    var $container = this.$container;
    $container.dxChart({
        title: "test",
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    $container.dxChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal($container.find(".dxc-arg-title").length, 1, "There is one arg title group");
    assert.equal($container.find(".dxc-val-title").length, 1, "There is one val title group");
    assert.equal($container.find(".dxc-background").length, 1, "There is one background group");
    assert.equal($container.find(".dxc-strips-group").length, 1, "There is one strips group");
    assert.equal($container.find(".dxc-arg-strips").length, 1, "There is one h-strips group");
    assert.equal($container.find(".dxc-val-strips").length, 1, "There is one v-strips group");
    assert.equal($container.find(".dxc-axes-group").length, 1, "There is one axes group");
    assert.equal($container.find(".dxc-arg-axis").length, 1, "There is one h-axis group");
    assert.equal($container.find(".dxc-val-axis").length, 1, "There is one v-axis group");
    assert.equal($container.find(".dxc-border").length, 1, "There is one border group");
    assert.equal($container.find(".dxc-series-group").length, 1, "There is one series group");
    assert.equal($container.find(".dxc-labels-group").length, 1, "There is one labels group");
    assert.equal($container.find(".dxc-legend").length, 1, "There is one legend group");
    assert.equal($container.find(".dxc-constant-lines-group").length, 1, "There is one constant lines group");
    assert.equal($container.find(".dxc-arg-constant-lines").length, 3, "There is one h-constant-lines group");
    assert.equal($container.find(".dxc-val-constant-lines").length, 3, "There is one v-constant-line group");
});

QUnit.test("Pie chart groups and classes after redraw", function(assert) {
    var $container = this.$container;
    $container.dxPieChart({
        title: "test",
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    $container.dxPieChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal($container.find(".dxc-title").length, 1, "There is one title group");
    assert.equal($container.find(".dxc-series-group").length, 1, "There is one series group");
    assert.equal($container.find(".dxc-labels-group").length, 1, "There is one labels group");
    assert.equal($container.find(".dxc-legend").length, 1, "There is one legend group");
});

QUnit.test("Checking title appending", function(assert) {
    this.createChart({
        title: "test",
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    this.$container.dxChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal(this.$container.find(".dxc-arg-title").length, 1, "There is one arg title group");
    assert.equal(this.$container.find(".dxc-val-title").length, 1, "There is one val title group");
    assert.ok(this.$container.find(".dxc-title").children().length > 0, "Title group should not be empty");
});

QUnit.test("Checking title appending in pie chart", function(assert) {
    var $container = this.$container;
    $container.dxPieChart({
        title: "test",
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    $container.dxPieChart({ dataSource: [{ arg: 0, val: 3 }] });

    assert.equal($container.find(".dxc-title").length, 1, "There is one title group");
    assert.ok($container.find(".dxc-title").children().length > 0, "Title group should not be empty");
});

QUnit.module("Multistyles points", moduleSetup);

QUnit.test("Multicolor bars", function(assert) {
    var chart = this.createChart({
            size: {
                height: 400
            },
            title: {
                text: "dxChart Title"
            },
            valueAxis: {
                valueType: "numeric"
            },
            commonSeriesSettings: {
                argumentField: "year",
                type: "bar",
                point: {
                    visible: true
                },
                label: {
                    visible: true
                }
            },
            customizePoint: function() {
                var options = {};
                if(this.seriesName === "Africa") {
                    switch(this.argument) {
                        case "1949": {
                            options.color = "orangered";
                            options.hoverStyle = {
                                hatching: {
                                    direction: "right"
                                }
                            };
                            break;
                        }
                        case "1950": {
                            options.color = "deepskyblue";
                            break;
                        }
                        case "1951": {
                            options.color = "red";
                            break;
                        }
                        case "1952": {
                            options.color = "pink";
                            options.visible = false;
                            break;
                        }
                        case "1953": {
                            options.color = "orange";
                            options.hoverStyle = {
                                hatching: {
                                    direction: "left"
                                }
                            };
                            break;
                        }
                        case "1954": {
                            options.color = "green";
                            break;
                        }
                    }
                }
                return options;
            },
            series: [
                {
                    name: "Africa",
                    valueField: "Africa"
                }, {
                    name: "America",
                    valueField: "America"
                }],
            dataSource: [{
                "year": "1949",
                "Africa": 25,
                "America": 25
            }, {
                "year": "1950",
                "Africa": 36,
                "America": 25
            }, {
                "year": "1951",
                "Africa": "1d0",
                "America": 25
            }, {
                "year": "1952",
                "Africa": 44,
                "America": 25
            }, {
                "year": "1953",
                "Africa": 33,
                "America": 25
            }, {
                "year": "1954",
                "Africa": 51,
                "America": 25

            }],
            animation: { enabled: false }
        }),
        points = chart.series[1].getPoints();

    assert.equal(points[4]._options.visible, true, "Bar points always should be visible");

    assert.ok(chart);
});

QUnit.module("groups order", moduleSetup);

function checkOrder(assert, groups, order) {
    assert.strictEqual(groups.length, order.length, "count");
    for(var i = 0; i < order.length; i++) {
        assert.strictEqual($(groups[i]).attr("class"), order[i], i + "-th group must be " + order[i]);
    }
}

var VALIDATE_GROUPS = [
    "dxc-background",
    "dxc-strips-group",
    "dxc-grids-group",
    "dxc-axes-group",
    "dxc-strips-labels-group",
    "dxc-border",
    "dxc-series-group",
    "dxc-constant-lines-group",
    "dxc-scale-breaks",
    "dxc-labels-group",
    "dxc-crosshair-cursor",
    // "dxc-title",
    "dxc-legend"
];

QUnit.test("Legend inside position", function(assert) {
    var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
            series: {},
            legend: {
                position: "inside"
            },
            tooltip: {
                enabled: true
            },
            crosshair: {
                enabled: true
            }
        }),
        root = $(chart._renderer.root.element),
        groupTag = root[0].tagName.toLowerCase() === "div" ? "div" : "g",
        groups = root.find(">" + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test("Legend inside position. Zooming", function(assert) {
    var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
            series: {},
            legend: {
                position: "inside"
            },
            tooltip: {
                enabled: true
            },
            crosshair: {
                enabled: true
            }
        }),
        root,
        groupTag,
        groups;

    chart.zoomArgument(1, 2);

    root = $(chart._renderer.root.element),
    groupTag = root[0].tagName.toLowerCase() === "div" ? "div" : "g",
    groups = root.find(">" + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test("Legend outside position", function(assert) {
    var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
            series: {},
            legend: {
                position: "outside"
            },
            tooltip: {
                enabled: true
            },
            crosshair: {
                enabled: true
            }
        }),
        root = $(chart._renderer.root.element),
        groupTag = root[0].tagName.toLowerCase() === "div" ? "div" : "g",
        groups = root.find(">" + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test("Legend outside position. Zooming", function(assert) {
    var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
            series: {},
            legend: {
                position: "outside"
            },
            tooltip: {
                enabled: true
            },
            crosshair: {
                enabled: true
            }
        }),
        root,
        groupTag,
        groups;

    chart.zoomArgument(1, 2);

    root = $(chart._renderer.root.element),
    groupTag = root[0].tagName.toLowerCase() === "div" ? "div" : "g",
    groups = root.find(">" + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS);
});

QUnit.test("ScrollBar", function(assert) {
    var chart = this.createChart({
            dataSource: [{ arg: 1, val: 1 }, { arg: 2, val: 2 }],
            series: {},
            legend: {
                position: "inside"
            },
            tooltip: {
                enabled: true
            },
            crosshair: {
                enabled: true
            },
            scrollBar: {
                visible: true
            }
        }),
        root = $(chart._renderer.root.element),
        groupTag = root[0].tagName.toLowerCase() === "div" ? "div" : "g",
        groups = root.find(">" + groupTag);

    checkOrder(assert, groups, VALIDATE_GROUPS.concat("dxc-scroll-bar"));
});

QUnit.module("Private functions", {
    beforeEach: function() {
        this.$container = $("#chartContainer");
    }
});

QUnit.test("Get pane index when panes is object", function(assert) {
    var chart = createChartInstance({
            panes: {
                name: "pane-name"
            },
            series: {}
        }, this.$container),
        paneIndex = chart._getPaneIndex("pane-name");

    // assert
    assert.equal(paneIndex, 0, "Pane index should be 0");
});

QUnit.test("Get pane index when panes is array", function(assert) {
    var chart = createChartInstance({
            panes: [{
                name: "pane1"
            }, {
                name: "pane2"
            }, {
                name: "pane3"
            }]
        }, this.$container),
        paneIndex1 = chart._getPaneIndex("pane1"),
        paneIndex2 = chart._getPaneIndex("pane2"),
        paneIndex3 = chart._getPaneIndex("pane3");

    // assert
    assert.equal(paneIndex1, 0, "First pane index should be 0");
    assert.equal(paneIndex2, 1, "Second pane index should be 1");
    assert.equal(paneIndex3, 2, "Third pane index should be 2");
});

QUnit.test("Get pane border visibility when commonPaneSettings border is undefined", function(assert) {
    var chart = createChartInstance({
            panes: [{
                name: "pane1",
                border: {
                    visible: true
                }
            }, {
                name: "pane2",
                border: {
                    visible: false
                }
            }]
        }, this.$container),
        borderVisible1 = chart._getPaneBorderVisibility(0),
        borderVisible2 = chart._getPaneBorderVisibility(1);

    // assert
    assert.equal(borderVisible1, true, "First pane border should be visible");
    assert.equal(borderVisible2, false, "Second pane border should not be visible");
});

QUnit.test("Get pane border visibility when commonPaneSettings border is visible ", function(assert) {
    var chart = createChartInstance({
            commonPaneSettings: {
                border: {
                    visible: true
                }
            },
            panes: [{
                name: "pane1"
            }, {
                name: "pane2",
                border: {
                    visible: true
                }
            }, {
                name: "pane3",
                border: {
                    visible: false
                }
            }]
        }, this.$container),
        borderVisible1 = chart._getPaneBorderVisibility(0),
        borderVisible2 = chart._getPaneBorderVisibility(1),
        borderVisible3 = chart._getPaneBorderVisibility(2);

    // assert
    assert.equal(borderVisible1, true, "First pane border should be visible");
    assert.equal(borderVisible2, true, "Second pane border should be visible");
    assert.equal(borderVisible3, false, "Third pane border should not be visible");
});

QUnit.test("Get pane border visibility when commonPaneSettings border is not visible ", function(assert) {
    var chart = createChartInstance({
            commonPaneSettings: {
                border: {
                    visible: false
                }
            },
            panes: [{
                name: "pane1"
            }, {
                name: "pane2",
                border: {
                    visible: true
                }
            }, {
                name: "pane3",
                border: {
                    visible: false
                }
            }]
        }, this.$container),
        borderVisible1 = chart._getPaneBorderVisibility(0),
        borderVisible2 = chart._getPaneBorderVisibility(1),
        borderVisible3 = chart._getPaneBorderVisibility(2);

    // assert
    assert.equal(borderVisible1, false, "First pane border should not be visible");
    assert.equal(borderVisible2, true, "Second pane border should be visible");
    assert.equal(borderVisible3, false, "Third pane border should not be visible");
});

// T336349, T503616
QUnit.module("Option changing in onDrawn after zooming", {
    beforeEach: function() {
        this.legendShiftSpy = sinon.spy(legendModule.Legend.prototype, "shift");
        this.titleShiftSpy = sinon.spy(titleModule.Title.prototype, "shift");
        sinon.spy(rendererModule, "Renderer", function() {
            return new vizMocks.Renderer();
        });
    },
    afterEach: function() {
        legendModule.Legend.prototype.shift.restore();
        titleModule.Title.prototype.shift.restore();
        rendererModule.Renderer.restore();
    }
});

QUnit.test("Legend and title should have original place", function(assert) {
    // act
    var chart = createChartInstance({
        dataSource: [{ arg: 1, val: 2 }],
        series: [{
            type: "spline"
        }],
        title: "text",
        legend: {
            visible: true
        }
    }, $("#chartContainer"));
    chart.option("onDrawn", function() {
        this.option("onDrawn", null);
        this.option("series[0].type", "line");
    });
    chart.zoomArgument(0, 1);

    // assert
    assert.deepEqual(this.legendShiftSpy.getCall(0).args, this.legendShiftSpy.getCall(1).args, "the same place");
    assert.deepEqual(this.titleShiftSpy.getCall(0).args, this.titleShiftSpy.getCall(1).args, "title shift");
});

QUnit.test('T295685. Do not expand range on adaptive layout', function(assert) {
    // arrange
    var chart = createChartInstance({
        dataSource: [],
        series: [{
            name: 'First',
            valueField: 'val1'
        }],
        commonAxisSettings: {
            valueMarginsEnabled: false
        },
        title: 'original'
    }, $("#chartContainer"));
    // act
    chart.option("size", { width: 50, height: 50 });

    // assert
    assert.equal(chart._argumentAxes[0].getTranslator().getBusinessRange().min, 0, "min arg");
    assert.equal(chart._argumentAxes[0].getTranslator().getBusinessRange().max, 10, "max arg");
    assert.equal(chart._valueAxes[0].getTranslator().getBusinessRange().min, 0, "min val");
    assert.equal(chart._valueAxes[0].getTranslator().getBusinessRange().max, 10, "min val");
});

QUnit.test("Pie chart with sizeGroup, change option in between rendering steps - legend and title should have original place", function(assert) {
    var that = this,
        done = assert.async();
    // act
    var chart = $("#chartContainer").dxPieChart({
        sizeGroup: "test-group",
        dataSource: [{ arg: 1, val: 2 }],
        series: {},
        title: "text",
        legend: {
            visible: true
        },
        onDrawn: function() {
            // assert
            assert.deepEqual(that.legendShiftSpy.getCall(0).args, that.legendShiftSpy.getCall(1).args, "the same place");
            assert.deepEqual(that.titleShiftSpy.getCall(0).args, that.titleShiftSpy.getCall(1).args, "title shift");
            done();
        }
    }).dxPieChart("instance");
    chart.option("type", "donut");
});

QUnit.module("T218011 for dashboards. Private method for getting visible argument bounds", {
    beforeEach: function() {
        this.$container = $("#chartContainer");
    }
});

QUnit.test("Category", function(assert) {
    var categories = ["A", "B", "C", "D", "E"];

    // act
    var chart = createChartInstance({
        argumentAxis: {
            categories: categories
        },
        series: [{
            type: "line"
        }]
    }, this.$container);

    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: "A", maxVisible: "E" });
});

QUnit.test("Category. After zoomArgument", function(assert) {
    var categories = ["A", "B", "C", "D", "E"];

    // act
    var chart = createChartInstance({
        argumentAxis: {
            categories: categories
        },
        series: [{
            type: "line"
        }]
    }, this.$container);
    chart.zoomArgument("B", "C");
    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: "B", maxVisible: "C" });
});

QUnit.test("Numeric", function(assert) {
    // act
    var chart = createChartInstance({
        dataSource: [{ arg: 20, val: 10 }, { arg: 40, val: 11 }],
        series: {
            type: "line"
        },
        argumentAxis: {
            valueMarginsEnabled: false
        }
    }, this.$container);

    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: 20, maxVisible: 40 });
});

QUnit.test("Numeric. After zoomArgument", function(assert) {
    // act
    var chart = createChartInstance({
        dataSource: [{ arg: 20, val: 10 }, { arg: 40, val: 11 }],
        series: {
            type: "line"
        }
    }, this.$container);
    chart.zoomArgument(25, 30);
    // assert
    assert.deepEqual(chart.getVisibleArgumentBounds(), { minVisible: 25, maxVisible: 30 });
});

QUnit.module("dxPieChart", moduleSetup);

QUnit.test("Checking border hover when pie chart palette changed. B237181", function(assert) {
    var dataSource = [
        { country: "Russia", area: 12, area1: 10 },
        { country: "Canada", area: 7, area1: 10 },
        { country: "USA", area: 7, area1: 10 },
        { country: "China", area: 7, area1: 10 },
        { country: "Brazil", area: 6, area1: 10 },
        { country: "Australia", area: 5, area1: 10 },
        { country: "India", area: 2, area1: 10 },
        { country: "Others", area: 55, area1: 10 }
        ],
        chart = this.createPieChart({
            dataSource: dataSource,
            series: {
                label: {
                    visible: true
                },
                hoverStyle: {
                    hatching: { direction: "left" }
                },
                argumentField: "country",
                valueField: "area",
            },
            legend: {
                visible: false
            },
            pointClick: function(point) {
                point.select();
            }
        }),
        hoverState;

    chart.option({ palette: "Soft Pastel" });
    hoverState = chart.getAllSeries()[0].getPoints()[0].getOptions().styles.hover;
    assert.equal(hoverState.stroke, "#60a69f", "Hover color is color of series");
    assert.equal(hoverState["stroke-width"], 0, "Hover width was 0");
});

QUnit.test("Pie chart groups and classes", function(assert) {
    var $container = this.$container;
    this.createPieChart({
        title: "test",
        commonSeriesSettings: {
            label: {
                visible: true
            }
        },
        series: {},
        dataSource: [{ arg: 0, val: 2 }]
    });

    assert.equal($container.find(".dxc-title").length, 1, "There is one title group");
    assert.equal($container.find(".dxc-series-group").length, 1, "There is one series group");
    assert.equal($container.find(".dxc-labels-group").length, 1, "There is one labels group");
    assert.equal($container.find(".dxc-legend").length, 1, "There is one legend group");
});

// T412270
QUnit.test("select point after dataSource updating", function(assert) {
    // arrange
    var dataSource = [{ arg: "arg1", val: 1 }],
        chart = this.createPieChart({
            series: [{}],
            dataSource: dataSource
        });

    dataSource.push({ arg: "arg2", val: 1 });
    chart.option("dataSource", dataSource);

    chart.getAllSeries()[0].getAllPoints()[1].select();

    assert.strictEqual(chart.getAllSeries()[0].getAllPoints()[1].isSelected(), true);
});

QUnit.test("Pie chart. Show point in order in dataSource", function(assert) {
    var pie = this.createPieChart({
        series: {},
        dataSource: [
            { arg: "A", val: 11.10 },
            { arg: "B", val: 12.57 },
            { arg: "A", val: 13.51 }
        ]
    });

    var pointArguments = pie.getAllSeries()[0].getAllPoints().map(function(p) {
        return p.argument;
    });

    assert.deepEqual(pointArguments, ["A", "B", "A"]);
});

QUnit.test("getAllPoints with enabled aggregation", function(assert) {
    var chart = this.createChart({
        dataSource: [{
            arg: new Date(1994, 2, 1),
            val: 1
        }, {
            arg: new Date(1994, 3, 1),
            val: 1
        }],
        series: [{ aggregation: { enabled: true } }]
    });

    assert.strictEqual(chart.getAllSeries()[0].getAllPoints().length, 1);
});

QUnit.module("dxPolarChart", moduleSetup);

QUnit.test("Add extra ticks (endOnTick) for extend visualRange and hide overlapping labels", function(assert) {
    var data = [
        { "temperature": 11.9, "sales": 185 },
        { "temperature": 14.2, "sales": 215 },
        { "temperature": 15.2, "sales": 332 },
        { "temperature": 16.4, "sales": 325 },
        { "temperature": 17.2, "sales": 408 },
        { "temperature": 18.5, "sales": 406 },
        { "temperature": 19.4, "sales": 412 },
        { "temperature": 20.8, "sales": 469 },
        { "temperature": 22.1, "sales": 522 },
        { "temperature": 22.6, "sales": 493 },
        { "temperature": 23.4, "sales": 544 },
        { "temperature": 24.8, "sales": 614 }
    ];

    this.$container.css({ width: "1000px", height: "400px" });

    var chart = this.createPolarChart({
        dataSource: data,
        series: [{ closed: false, valueField: 'sales', argumentField: 'temperature', label: { visible: true }, type: 'line' }],
        legend: { visible: false },
        title: { text: 'Ice Cream Sales vs Temperature' },
        palette: 'Office'
    });

    assert.deepEqual(chart._argumentAxes[0].visualRange(), { startValue: 11, endValue: 25 }, "extend visualRange");
    assert.equal(chart._argumentAxes[0]._majorTicks[14].label.element.clientWidth, 0, "hidden label");
});

QUnit.module("T576725", $.extend({}, moduleSetup, {
    beforeEach: function() {
        moduleSetup.beforeEach.call(this);
        sinon.stub(baseChartModule.overlapping, "resolveLabelOverlappingInOneDirection");
    },
    afterEach: function() {
        moduleSetup.afterEach.call(this);
        baseChartModule.overlapping.resolveLabelOverlappingInOneDirection.restore();
    }
}));

QUnit.test("Overlapping of the labels should be taken into account canvas with legend and title.", function(assert) {
    // arrange
    var dataSource = [];

    for(var i = 0; i < 15; i++) {
        dataSource.push({ arg: i + "", val: i * 100 });
    }
    this.createPieChart({
        series: [{ label: { visible: true } }],
        dataSource: dataSource,
        legend: { visible: true, horizontalAlignment: "center" },
        title: "Test pie chart",
        size: { width: 400, height: 300 },
        resolveLabelOverlapping: "shift"
    });

    assert.ok(baseChartModule.overlapping.resolveLabelOverlappingInOneDirection.lastCall.args[1].top > 0);
});

QUnit.module("Series visibility changed", moduleSetup);

QUnit.test("Do not set stub data when all series were hidden", function(assert) {
    var chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
        },
        valueAxis: {
            valueMarginsEnabled: false,
        },
        dataSource: [
            { arg: 1, val: 400 },
            { arg: 2, val: 200 },
            { arg: 3, val: 900 },
            { arg: 4, val: 100 },
            { arg: 5, val: 340 }],
        series: {}
    });

    chart.getAllSeries()[0].hide();

    var argRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.equal(argRange.min, 1);
    assert.equal(argRange.max, 5);
    assert.ok(!argRange.stubData);

    var valRange = chart.getValueAxis().getTranslator().getBusinessRange();
    assert.equal(valRange.min, 100);
    assert.equal(valRange.max, 900);
    assert.ok(!valRange.stubData);
});

QUnit.test("Recalculate range data when one series is hidden", function(assert) {
    var chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
        },
        valueAxis: {
            valueMarginsEnabled: false,
        },
        dataSource: [
            { arg: 1, val: 400 },
            { arg1: 2, val1: 1 },
            { arg1: 3, val1: 10 },
            { arg: 4, val: 100 },
            { arg: 5, val: 340 }],
        series: [{}, { argumentField: "arg1", valueField: "val1" }]
    });

    chart.getAllSeries()[0].hide();

    var argRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.equal(argRange.min, 2);
    assert.equal(argRange.max, 3);

    var valRange = chart.getValueAxis().getTranslator().getBusinessRange();
    assert.equal(valRange.min, 1);
    assert.equal(valRange.max, 10);
});

QUnit.test("Recalculate argument range data from all visible series", function(assert) {
    var chart = this.createChart({
        argumentAxis: {
            valueMarginsEnabled: false,
        },
        valueAxis: {
            valueMarginsEnabled: false,
        },
        dataSource: [
            { arg: 1, val: 400 },
            { arg1: 2, val1: 1 },
            { arg1: 3, val1: 10 },
            { arg: 4, val: 100 },
            { arg: 5, val: 340 }],
        series: [{ axis: "axis1" }, { argumentField: "arg1", valueField: "val1" }]
    });

    chart.getAllSeries()[0].hide();

    var argRange = chart.getArgumentAxis().getTranslator().getBusinessRange();
    assert.equal(argRange.min, 2);
    assert.equal(argRange.max, 3);
    assert.ok(!argRange.stubData);
});
