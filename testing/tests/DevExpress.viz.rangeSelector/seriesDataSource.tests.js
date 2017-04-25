"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    seriesDataSourceModule = require("viz/range_selector/series_data_source"),
    SeriesDataSource = seriesDataSourceModule.SeriesDataSource,
    ThemeManager = require("viz/components/chart_theme_manager").ThemeManager;

/* global setupSeriesFamily */
require("../../helpers/chartMocks.js");

QUnit.module("SeriesDataSource");

QUnit.test("SeriesDataSource class is declared", function(assert) {
    assert.ok(SeriesDataSource);
});

QUnit.test("one series", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                    { x: 10, y1: 0 },
                    { x: 15, y1: 6 },
                    { x: 20, y1: 8 },
                    { x: 30, y1: 10 },
                    { x: 50, y1: 16 },
                    { x: 150, y1: 12 },
                    { x: 180, y1: 8 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area",
                rotated: true
            },
            series: {
                rotated: true,
                argumentField: "x",
                valueField: "y1"
            }
        },
        renderer: new vizMocks.Renderer()
    });
    var series = seriesDataSource.getSeries();
    //assert
    assert.equal(series.length, 1);
    assert.equal(series[0].type, "area");
    var points = series[0].getPoints();
    assert.equal(points.length, 7);
    assert.equal(points[0].argument, 10);
    assert.equal(points[0].value, 0);
    assert.equal(points[1].argument, 15);
    assert.equal(points[1].value, 6);
    assert.equal(points[6].argument, 180);
    assert.equal(points[6].value, 8);
    assert.ok(!series[0].getOptions().rotated);//B235735
});

QUnit.test("B235735", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ x: 10, y1: 0 }],
        chart: {
            commonSeriesSettings: {
                type: "area",
                rotated: true
            },
            series: {
                argumentField: "x",
                valueField: "y1"
            }
        },
        renderer: new vizMocks.Renderer()
    });
    var series = seriesDataSource.getSeries();
    assert.ok(!series[0].getOptions().rotated);//B235735
});

QUnit.test("theme manager", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ x: 10, y1: 0 }],
        chart: {
            commonSeriesSettings: {
                type: "area",
                rotated: true
            },
            series: {
                argumentField: "x",
                valueField: "y1"
            }
        },
        renderer: new vizMocks.Renderer()
    });

    assert.ok(seriesDataSource.getThemeManager() instanceof ThemeManager);
});

//B253717
QUnit.test("datetime in chart valueAxis", function(assert) {
    //arrange
    var range,
        seriesDataSource = new SeriesDataSource({
            dataSource: [
                { y: new Date(1980, 5, 17), x: new Date(1980, 5, 18) },
                { y: new Date(1980, 6, 17), x: new Date(1980, 6, 18) }
            ],
            chart: {
                topIndent: 0.1,
                bottomIndent: 0.2,
                series: {
                    type: "bar",
                    argumentField: "x",
                    valueField: "y",
                },
                valueAxis: { valueType: "datetime" },
            },
            renderer: new vizMocks.Renderer()
        });

    //act
    range = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(range.val.min.toUTCString(), (new Date(1980, 5, 11)).toUTCString());
    assert.strictEqual(range.val.max.toUTCString(), (new Date(1980, 6, 20)).toUTCString());
});

QUnit.test("seriesDateSource with categories", function(assert) {
    //arrange/act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                { x: 10, y1: 3, y2: 5 },
                { x: 50, y1: 16, y2: 1 }
        ],
        incidentOccurred: $.noop,
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            series: [{
                argumentField: "x",
                valueField: "y1"
            }, {
                type: "line",
                argumentField: "x",
                valueField: "y2"
            }
            ]
        },
        renderer: new vizMocks.Renderer(),
        categories: ["a1", "a2", "a3"]
    });

    //assert
    assert.deepEqual(seriesDataSource._series[0].argumentAxisType, "discrete");
    assert.deepEqual(seriesDataSource._series[1].argumentAxisType, "discrete");
});

QUnit.test("argument categories", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                    { arg: "a1", val: 2 },
                    { arg: "a2", val: 2 }
        ],
        chart: {
            series: [{}]
        },
        renderer: new vizMocks.Renderer()
    });

    assert.deepEqual(seriesDataSource.argCategories, ["a1", "a2"]);
});

QUnit.test("several series", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                { x: 10, y1: 3, y2: 5 },
                { x: 50, y1: 16, y2: 1 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            series: [{
                argumentField: "x",
                valueField: "y1"
            }, {
                type: "line",
                argumentField: "x",
                valueField: "y2"
            }
            ]
        },
        renderer: new vizMocks.Renderer()
    });
    var series = seriesDataSource.getSeries();
    //assert
    assert.equal(series.length, 2);
    var points = series[0].getPoints();
    assert.equal(series[0].type, "area");
    assert.equal(points.length, 2);
    assert.equal(points[0].argument, 10);
    assert.equal(points[0].value, 3);
    assert.equal(points[1].argument, 50);
    assert.equal(points[1].value, 16);
    assert.equal(series[1].type, "line");
    points = series[1].getPoints();
    assert.equal(points.length, 2);
    assert.equal(points[0].argument, 10);
    assert.equal(points[0].value, 5);
    assert.equal(points[1].argument, 50);
    assert.equal(points[1].value, 1);
});

QUnit.test("several series. Set valueType", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                { x: 10, y1: 3, y2: 5 },
                { x: 50, y1: 16, y2: 1 }
        ],
        chart: {
            commonSeriesSettings: { type: "bar", argumentField: "x" },
            series: [{ valueField: "y1" }, { valueField: "y2" }],
            valueAxis: { valueType: "numeric" }
        },
        renderer: new vizMocks.Renderer()
    });
    var series = seriesDataSource.getSeries();
    //assert
    assert.equal(series.length, 2);
    assert.equal(series[0].valueType, "numeric");
    assert.equal(series[1].valueType, "numeric");
});

QUnit.test("series theme", function(assert) {

    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                { x: 10, y1: 3, y2: 5 },
                { x: 50, y1: 16, y2: 1 }
        ],
        chart: {
            series: [{
                type: "area",
                argumentField: "x",
                valueField: "y1"
            }, {
                argumentField: "x",
                valueField: "y2"
            }],
            theme: {
                name: "default",
                commonSeriesSettings: {
                    type: "line"
                }
            }
        },
        renderer: new vizMocks.Renderer()
    });

    var series = seriesDataSource.getSeries();
    //assert
    assert.equal(series.length, 2);
    assert.equal(series[0].type, "area");
    assert.equal(series[1].type, "line");
});

QUnit.test("getBoundRange with topIndent, bottomIndent", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            topIndent: 0.2,
            bottomIndent: 0.1,
            series: {

            }
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.val.min, -20);
    assert.equal(boundRange.val.max, 240);
    assert.equal(boundRange.val.minVisible, undefined);
    assert.equal(boundRange.val.maxVisible, undefined);
});

QUnit.test("getBoundRange with topIndent>1, bottomIndent<0", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            topIndent: 1.2,
            bottomIndent: -0.1,
            series: {

            }
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.val.min, 0);
    assert.equal(boundRange.val.max, 200);
    assert.equal(boundRange.val.minVisible, undefined);
    assert.equal(boundRange.val.maxVisible, undefined);
});

QUnit.test("getBoundRange if no series", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            topIndent: 0.2,
            bottomIndent: 0.1,
            series: []
        },
        incidentOccurred: $.noop
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.val.min, undefined);
    assert.strictEqual(boundRange.val.max, undefined);
});

QUnit.test("getBoundRange with topIndent, bottomIndent, valueAxis min", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            topIndent: 0.2,
            bottomIndent: 0.1,
            valueAxis: {
                min: 100
            },
            series: {

            }
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.val.min, -20);
    assert.strictEqual(boundRange.val.max, 240);
    assert.strictEqual(boundRange.val.minVisible, 90);
    assert.strictEqual(boundRange.val.maxVisible, undefined);
});

QUnit.test("getBoundRange with topIndent, bottomIndent, valueAxis max", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            topIndent: 0.2,
            bottomIndent: 0.1,
            valueAxis: {
                max: 100
            },
            series: {}
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.val.min, -20);
    assert.strictEqual(boundRange.val.max, 240);
    assert.strictEqual(boundRange.val.minVisible, undefined);
    assert.strictEqual(boundRange.val.maxVisible, 120);
});

//B230855
QUnit.test("getBoundRange with valueAxis min/max", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            topIndent: 0.2,
            bottomIndent: 0.1,
            valueAxis: {
                min: 20,
                max: 100
            },
            series: {}
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.val.min, -20);
    assert.strictEqual(boundRange.val.max, 240);
    assert.strictEqual(boundRange.val.minVisible, 12);
    assert.strictEqual(boundRange.val.maxVisible, 116);
});

QUnit.test("getBoundRange valueAxis inverted", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            valueAxis: {
                inverted: true
            },
            series: {}
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.ok(boundRange.val.invert);
    assert.equal(boundRange.val.min, -20);
    assert.equal(boundRange.val.max, 200);
});

QUnit.test("getBoundRange if series does not have non-stick series", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            series: [{ type: "line" }, { type: "area" }]
        },
        renderer: new vizMocks.Renderer()
    });

    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.arg.stick, undefined);
});

QUnit.test("getBoundRange if series has bar", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            series: [{ type: "stackedbar" }, { type: "area" }]
        },
        renderer: new vizMocks.Renderer()
    });

    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.arg.stick, false);
});

QUnit.test("getBoundRange if series has bubble", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            series: [{ type: "bubble" }, { type: "area" }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });

    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.arg.stick, false);
});

QUnit.test("getBoundRange if series has candlestick", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            series: [{ type: "candlestick" }, { type: "area" }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });

    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.arg.stick, false);
});

QUnit.test("getBoundRange if series has stock", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            series: [{ type: "stock" }, { type: "area" }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });

    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.strictEqual(boundRange.arg.stick, false);
});

QUnit.test("getBoundRange with topIndent, bottomIndent, valueAxis inverted", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                    { arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            topIndent: 0.2,
            bottomIndent: 0.1,
            valueAxis: {
                inverted: true
            },
            series: {}
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.ok(boundRange.val.invert);
    assert.equal(boundRange.val.min, -40);
    assert.equal(boundRange.val.max, 220);
});

QUnit.test("several series getBoundRange", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 3, arg1: 4, val1: 10 },
                        { arg: 3, val: 6, arg1: 7, val1: 5 },
                        { arg: 5, val: 12, arg1: 9, val1: 2 }],
        chart: {
            commonSeriesSettings: {
                type: "line"
            },

            series: [{}, {
                argumentField: "arg1",
                valueField: "val1"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.arg.min, 1);
    assert.equal(boundRange.arg.max, 9);
    assert.equal(boundRange.val.min, 2);
    assert.equal(boundRange.val.max, 13);
});

QUnit.test("getBoundRange for simple dataSource", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ val: 1, arg: 100 }, { val: 2, arg: 5 }, { val: 3, arg: 16 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            }
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.arg.min, 5);
    assert.equal(boundRange.arg.max, 100);
});

QUnit.test("getBoundRange for objects dataSource default dataSourceField", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                { arg: 10, y1: 3, y2: 5 },
                { arg: 50, y1: 16, y2: 1 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            }
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.arg.min, 10);
    assert.equal(boundRange.arg.max, 50);
});

QUnit.test("getBoundRange for objects dataSource with dataSourceField", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                { x: 10, y1: 3, y2: 5 },
                { x: 50, y1: 16, y2: 1 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            }
        },
        dataSourceField: "y1",
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.arg.min, 3);
    assert.equal(boundRange.arg.max, 16);
});

QUnit.test("several series getBoundRange with valueAxis min/max", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 3, arg1: 4, val1: 10 },
                    { arg: 3, val: 6, arg1: 7, val1: 5 },
                    { arg: 5, val: 12, arg1: 9, val1: 2 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            valueAxis: {
                min: 0,
                max: 15
            },
            series: [{}, {
                valueField: "val1",
                argumentField: "arg1"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.arg.min, 1);
    assert.equal(boundRange.arg.max, 9);
    assert.equal(boundRange.val.min, 0);
    assert.equal(boundRange.val.max, 16.5);
});

//B253591
QUnit.test("getBoundRange of Line series with equal values", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 10 },
                    { arg: 3, val: 10 },
                    { arg: 5, val: 10 }],
        chart: {
            commonSeriesSettings: {
                type: "line"
            },
            topIndent: 0.2,
            bottomIndent: 0.1,
            series: [{}]
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.arg.min, 1);
    assert.equal(boundRange.arg.max, 5);
    assert.equal(boundRange.val.min, 10);
    assert.equal(boundRange.val.max, 10);
});

QUnit.test("getBoundRange valueAxis has logarithmic type", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 0 },
                    { arg: 3, val: 200 },
                    { arg: 5, val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            valueAxis: {
                type: "logarithmic",
                logarithmBase: 2
            },
            series: {}
        },
        renderer: new vizMocks.Renderer()
    });
    var boundRange = seriesDataSource.getBoundRange();
    //assert
    assert.equal(boundRange.val.axisType, "logarithmic");
    assert.equal(boundRange.val.base, 2);
});

QUnit.test("dataSource is null or is empty", function(assert) {
    //arrange, act
    var seriesDataSource = new SeriesDataSource({
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            valueAxis: {
                min: 0,
                max: 15
            },
            series: [{
            }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });
    //assert
    assert.ok(seriesDataSource.isEmpty());

    //arrange, act
    seriesDataSource = new SeriesDataSource({
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            valueAxis: {
                min: 0,
                max: 15
            },
            series: []
        },
        incidentOccurred: $.noop
    });
    //assert
    assert.ok(seriesDataSource.isEmpty());
});

//B253068
QUnit.test("with dataSourceField", function(assert) {
    //arrange,act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ x: 10, y: 0 }, { x: 15, y: 6 }],
        dataSourceField: "x",
        chart: {
            type: "line",
            series: [{
                valueField: "y1",
                type: "line",
                argumentField: "X1"
            }, {
                valueField: "y2",
                type: "line"
            }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });
    //assert
    assert.equal(seriesDataSource._series[0].getOptions().argumentField, "X1");
    assert.equal(seriesDataSource._series[1].getOptions().argumentField, "x");
});

//B254994
QUnit.test("argumentField in commonSeriesSettings", function(assert) {
    //arrange,act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ x: 10, y: 0 }, { x: 15, y: 6 }],
        chart: {
            commonSeriesSettings: {
                argumentField: "x"
            },
            type: "line",
            series: [{
                valueField: "y1",
                type: "line",
                argumentField: "X1"
            }, {
                valueField: "y2",
                type: "line"
            }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });

    //assert
    assert.equal(seriesDataSource._series[0].getOptions().argumentField, "X1");
    assert.equal(seriesDataSource._series[1].getOptions().argumentField, "x");
});

QUnit.test("without dataSourceField, (valueField from commonSeriesSettings)", function(assert) {
    //arrange,act
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ x: 10, y: 0 }, { x: 15, y: 6 }],
        chart: {
            commonSeriesSettings: {
                argumentField: "x",
                type: "line"
            },
            series: [{
                valueField: "y1",
                argumentField: "X1"
            }, {
                valueField: "y2"
            }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });
    //assert
    assert.equal(seriesDataSource._series[0].getOptions().argumentField, "X1");
    assert.equal(seriesDataSource._series[1].getOptions().argumentField, "x");
});

var seriesTemplateDataSource = [
        { series: "2004", x: 10, y: 20 },
        { series: "2004", x: 20, y: 30 },
        { series: "2004", x: 30, y: 10 },
        { series: "2004", x: 40, y: 5 },
        { series: "2004", x: 50, y: 15 },
        { series: "2001", x: 10, y: 43 },
        { series: "2001", x: 20, y: 32 },
        { series: "2001", x: 30, y: 42 },
        { series: "2001", x: 40, y: 21 },
        { series: "2001", x: 50, y: 82 }];

QUnit.test("seriesTemplate", function(assert) {
    //arrange,act
    var seriesDataSource = new SeriesDataSource({
        dataSource: seriesTemplateDataSource,
        chart: {
            commonSeriesSettings: {
                type: "bar",
                argumentField: "x",
                valueField: "y"
            },
            seriesTemplate: {
                nameField: "series",
                customizeSeries: function() { return { type: "spline" }; }
            }
        },
        renderer: new vizMocks.Renderer()
    });
    //assert
    var series = seriesDataSource.getSeries();

    assert.equal(series.length, 2, "series length should be correct");
    assert.equal(series[0].type, "spline");
    assert.equal(series[0].getPoints().length, 5);
    assert.equal(series[1].type, "spline");
    assert.equal(series[1].getPoints().length, 5);
    checkPoints(assert, series[0], [10, 20, 30, 40, 50], [20, 30, 10, 5, 15]);
    checkPoints(assert, series[1], [10, 20, 30, 40, 50], [43, 32, 42, 21, 82]);
});

QUnit.test("seriesTemplate, incorrect nameField", function(assert) {
    //arrange,act
    var seriesDataSource = new SeriesDataSource({
        dataSource: seriesTemplateDataSource,
        chart: {
            commonSeriesSettings: {
                type: "bar",
                argumentField: "x",
                valueField: "y"
            },
            seriesTemplate: {
                nameField: "incorrectNameField",
                customizeSeries: function() { return { type: "spline" }; }
            }
        },
        renderer: new vizMocks.Renderer()
    });
    //assert
    var series = seriesDataSource.getSeries();

    assert.ok(!series.length);
});

var checkPoints = function(assert, series, argumentArray, valueArray) {
    for(var i = 0; i < series.getPoints().length; i++) {
        assert.equal(series.getPoints()[i].argument, argumentArray[i]);
        assert.equal(series.getPoints()[i].value, valueArray[i]);
    }
};

QUnit.module("SeriesDataSource seriesFamilies", { beforeEach: setupSeriesFamily });

QUnit.test("empty dataSource", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: null,
        chart: {
            commonSeriesSettings: {
                type: "area"
            }
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });

    assert.deepEqual(seriesDataSource._series, []);
    assert.deepEqual(seriesDataSource._seriesFamilies, []);
});

QUnit.test("one type for all series", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: 1, val: 3, arg1: 4, val1: 10 },
                        { arg: 3, val: 6, arg1: 7, val1: 5 },
                        { arg: 5, val: 12, arg1: 9, val1: 2 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            series: [{}, {
                valueField: "val2",
                argumentField: "arg1"
            }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });
    assert.deepEqual(seriesDataSource._series.length, 2);
    assert.deepEqual(seriesDataSource._seriesFamilies.length, 1);
    assert.equal(seriesDataSource._seriesFamilies[0].options.type, "area");
    assert.ok(seriesDataSource._seriesFamilies[0].adjustedValues);
    assert.equal(seriesDataSource._seriesFamilies[0].addedSeries.length, 1);
    assert.equal(seriesDataSource._seriesFamilies[0].addedSeries[0].length, 2);
    assert.strictEqual(seriesDataSource._seriesFamilies[0].addedSeries[0][0], seriesDataSource._series[0]);
    assert.strictEqual(seriesDataSource._seriesFamilies[0].addedSeries[0][1], seriesDataSource._series[1]);
});

QUnit.test("adjustSeriesDimensions", function(assert) {
    var seriesDataSource = new SeriesDataSource({
            dataSource: [{ arg: 1, val: 3, arg1: 4, val1: 10 },
                    { arg: 3, val: 6, arg1: 7, val1: 5 },
                    { arg: 5, val: 12, arg1: 9, val1: 2 }],
            chart: {
                commonSeriesSettings: {
                    type: "area"
                },
                series: [{
                    type: "line",
                }, {
                    valueField: "val1",
                    argumentField: "arg1"
                }]
            },
            renderer: new vizMocks.Renderer()
        }),
        translator = { x: {}, y: {} };

    $.each(seriesDataSource._series, function(_, s) {
        s.resamplePoints = function(tr) {
            this.translator = tr;
            this.pointResampled = true;
        };
    });
    $.each(seriesDataSource._seriesFamilies, function() {
        this.adjustSeriesDimensions = sinon.stub();
    });
    seriesDataSource.adjustSeriesDimensions(translator);

    assert.equal(seriesDataSource._series.length, 2);
    assert.equal(seriesDataSource._seriesFamilies.length, 2);

    assert.equal(seriesDataSource._series[0].translator, undefined);
    assert.equal(seriesDataSource._series[1].translator, undefined);

    assert.ok(!seriesDataSource._series[0].pointResampled);
    assert.ok(!seriesDataSource._series[1].pointResampled);
    assert.ok(seriesDataSource._seriesFamilies[0].adjustedValues);
    assert.ok(seriesDataSource._seriesFamilies[1].adjustedValues);
    assert.deepEqual(seriesDataSource._seriesFamilies[0].adjustSeriesDimensions.args[0][0], { arg: {}, val: {} });
    assert.deepEqual(seriesDataSource._seriesFamilies[1].adjustSeriesDimensions.args[0][0], { arg: {}, val: {} });
});

QUnit.test("adjustSeriesDimensions with aggregation", function(assert) {
    var seriesDataSource = new SeriesDataSource({
            dataSource: [{ arg: 1, val: 3, arg1: 4, val1: 10 },
                    { arg: 3, val: 6, arg1: 7, val1: 5 },
                    { arg: 5, val: 12, arg1: 9, val1: 2 }],
            chart: {
                commonSeriesSettings: {
                    type: "area"
                },
                series: [{
                    type: "line",
                }, {
                    valueField: "val1",
                    argumentField: "arg1"
                }],
                useAggregation: true
            },
            renderer: new vizMocks.Renderer()
        }),
        translator = { x: { argTranslator: true } };

    $.each(seriesDataSource._series, function(_, s) {
        s.resamplePoints = function(tr) {
            this.translator = tr;
            this.pointResampled = true;
        };
    });

    seriesDataSource.adjustSeriesDimensions(translator);

    assert.equal(seriesDataSource._series.length, 2);
    assert.equal(seriesDataSource._series[0].translator, translator.x);
    assert.equal(seriesDataSource._series[1].translator, translator.x);

    assert.ok(seriesDataSource._series[0].pointResampled);
    assert.ok(seriesDataSource._series[1].pointResampled);

    assert.equal(seriesDataSource._seriesFamilies.length, 2);
    assert.ok(seriesDataSource._seriesFamilies[0].adjustedValues);
    assert.ok(seriesDataSource._seriesFamilies[1].adjustedValues);
    assert.ok(seriesDataSource._seriesFamilies[0].adjustedDimensions);
    assert.ok(seriesDataSource._seriesFamilies[1].adjustedDimensions);
});

QUnit.test("several types for all series", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                    { arg: 1, val: 3, arg1: 4, val1: 10, arg2: 5, val2: 10 },
                    { arg: 3, val: 6, arg1: 7, val1: 5, arg2: 8, val2: 5 },
                    { arg: 5, val: 12, arg1: 9, val1: 2, arg2: 9, val2: 2 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            series: [{
                type: "line"
            }, {
                type: "line",
                valueField: "val1",
                argumentField: "arg1"
            },
            {
                type: "area",
                valueField: "val2",
                argumentField: "arg2"
            }]
        },
        renderer: new vizMocks.Renderer()
    });

    assert.equal(seriesDataSource._series.length, 3);
    assert.equal(seriesDataSource._seriesFamilies.length, 2);
    assert.equal(seriesDataSource._seriesFamilies[0].options.type, "line");
    assert.ok(seriesDataSource._seriesFamilies[0].adjustedValues);
    assert.equal(seriesDataSource._seriesFamilies[0].addedSeries.length, 1);
    assert.equal(seriesDataSource._seriesFamilies[0].addedSeries[0].length, 3);
    assert.equal(seriesDataSource._seriesFamilies[1].options.type, "area");
    assert.ok(seriesDataSource._seriesFamilies[1].adjustedValues);
    assert.equal(seriesDataSource._seriesFamilies[1].addedSeries.length, 1);
    assert.equal(seriesDataSource._seriesFamilies[1].addedSeries[0].length, 3);
});

QUnit.test("Calculated valueType - numeric", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
                    { arg: 1, val: 3 },
                    { arg: 3, val: 6 },
                    { arg: 5, val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });

    assert.equal(seriesDataSource.getCalculatedValueType(), "numeric");

});

QUnit.test("Calculated valueType - datetime", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
    { arg: new Date(12312), val: 3 },
                    { arg: new Date(342354), val: 6 },
                    { arg: new Date(1242312), val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });

    assert.equal(seriesDataSource.getCalculatedValueType(), "datetime");

});

QUnit.test("Calculated valueType - string", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
    { arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });

    assert.equal(seriesDataSource.getCalculatedValueType(), "string");

});

QUnit.test("seriesDataSource with bubbleSize option", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "bubble"
            },
            equalBarWidth: true,
            minBubbleSize: 1,
            maxBubbleSize: 11,
            series: [{
                type: "bubble"
            }]
        },
        incidentOccurred: $.noop,
        renderer: new vizMocks.Renderer()
    });

    assert.equal(seriesDataSource._seriesFamilies[0].options.minBubbleSize, 1);
    assert.equal(seriesDataSource._seriesFamilies[0].options.maxBubbleSize, 11);
});

QUnit.test("seriesDataSource with equalBarWidth option", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            equalBarWidth: true,
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    assert.equal(seriesDataSource._seriesFamilies[0].options.equalBarWidth, true);

});

QUnit.test("seriesDataSource with equalBarWidth option is false", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [
    { arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }
        ],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            equalBarWidth: false,
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    assert.equal(seriesDataSource._seriesFamilies[0].options.equalBarWidth, false);
});

QUnit.test("seriesDataSource with barWidth option", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            barWidth: 0.8,
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    assert.deepEqual(seriesDataSource._seriesFamilies[0].options.barWidth, 0.8);
});

QUnit.test("seriesDataSource with negativesAsZeroes option", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            negativesAsZeroes: "negativesAsZeroes-option-value",
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    assert.deepEqual(seriesDataSource._seriesFamilies[0].options.negativesAsZeroes, "negativesAsZeroes-option-value");
});

QUnit.test("seriesDataSource with negativesAsZeros (misspelled) option", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            negativesAsZeros: "negativesAsZeroes-option-value",
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    assert.deepEqual(seriesDataSource._seriesFamilies[0].options.negativesAsZeroes, "negativesAsZeroes-option-value");
});

QUnit.test("seriesDataSource with negativesAsZeroes (correct + misspelled) option", function(assert) {
    var seriesDataSource = new SeriesDataSource({
        dataSource: [{ arg: "a", val: 3 },
                    { arg: "b", val: 6 },
                    { arg: "c", val: 12 }],
        chart: {
            commonSeriesSettings: {
                type: "area"
            },
            negativesAsZeroes: "correct-option",
            negativesAsZeros: "misspelled-option",
            series: [{
                type: "line"
            }]
        },
        renderer: new vizMocks.Renderer()
    });
    assert.deepEqual(seriesDataSource._seriesFamilies[0].options.negativesAsZeroes, "correct-option");
});
