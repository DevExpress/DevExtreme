"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    Series = require("viz/series/base_series").Series;

require("../../helpers/chartMocks.js");

require("viz/chart");

function getOriginalData(data) {
    return $.map(data, function(item) {
        var newItem = {};
        $.each(item, function(key, value) {
            newItem[key] = value;
            newItem["original" + key] = value;
        });
        return newItem;
    });
}

var createSeries = function(options, renderSettings, widgetType) {
    renderSettings = renderSettings || {};
    renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();
    renderSettings.argumentAxis = renderSettings.argumentAxis || {
        getViewport: function() {

        }
    };
    options = $.extend(true, {
        visible: true,
        border: { visible: false },
        type: "mockType", argumentField: "arg", valueField: "val",
        hoverStyle: { border: { visible: false } }, selectionStyle: { border: { visible: false } },
        point: { selectionStyle: {}, hoverStyle: {} },
        label: { visible: false, font: {}, connector: {}, border: {} },
        widgetType: widgetType || "chart",
        valueErrorBar: { displayMode: 'auto' }
    }, options);

    var series = new Series(renderSettings, options);
    series.updateDataType(series.getOptions());
    return series;
};


QUnit.module("Process range data on updating");

QUnit.test("Range for empty dataSource", function(assert) {
    var series = createSeries({ type: "line" });

    series.updateData([]);

    var rangeData = series.getRangeData();

    assert.ok(series, "Series should be created");

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, undefined, "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, undefined, "Categories val should be correct");
});

QUnit.test("Range for dataSource with one point", function(assert) {
    var series = createSeries({ type: "line" });
    series.updateData([{ arg: 0, val: 0 }]);

    assert.ok(series, "Series should be created");

    var rangeData = series.getRangeData();
    assert.strictEqual(rangeData.arg.min, 0, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 0, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 0, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 0, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.module("Process range data on updating. Simple");

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous" });

    series.updateData(data);

    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Numeric. Date with same arguments", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 11 }, { arg: 2, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }, { arg: 20, val: 15 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 7, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Data with valueErrorBar (lowError < highError)", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 11, highError: 27, lowError: 20 }, { arg: 5, val: 22, highError: 25, lowError: 20 },
        { arg: 13, val: 10, highError: 3, lowError: 5 }, { arg: 20, val: 15, highError: 1, lowError: 8 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous", valueErrorBar: { displayMode: "auto", highValueField: "highError", lowValueField: "lowError" } });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.val.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.val.max, 27, "Max arg should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories arg should be undefined");
});

QUnit.test("Data with valueErrorBar (lowError > highError)", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 11, highError: 20, lowError: 27 }, { arg: 5, val: 22, highError: 25, lowError: 20 },
        { arg: 13, val: 10, highError: 3, lowError: 5 }, { arg: 20, val: 15, highError: 10, lowError: 8 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous", valueErrorBar: { displayMode: "auto", highValueField: "highError", lowValueField: "lowError" } });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.val.min, 3, "Min arg should be correct");
    assert.strictEqual(rangeData.val.max, 27, "Max arg should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories arg should be undefined");
});

QUnit.test("Data with valueErrorBar. low mode", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 11, highError: 3, lowError: 2 }, { arg: 5, val: 22, highError: 40, lowError: 1 },
                { arg: 13, val: 3, highError: 5, lowError: 4 }, { arg: 20, val: 15, highError: 6, lowError: 6 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous", valueErrorBar: { displayMode: "low", highValueField: "highError", lowValueField: "lowError" } });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.val.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max arg should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories arg should be undefined");
});

QUnit.test("Data with valueErrorBar. high mode", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 11, highError: 3, lowError: 2 }, { arg: 5, val: 22, highError: 40, lowError: 1 },
                { arg: 13, val: 3, highError: 5, lowError: 4 }, { arg: 20, val: 15, highError: 6, lowError: 6 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous", valueErrorBar: { displayMode: "high", highValueField: "highError", lowValueField: "lowError" } });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.val.min, 3, "Min arg should be correct");
    assert.strictEqual(rangeData.val.max, 40, "Max arg should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories arg should be undefined");
});

QUnit.test("Data with valueErrorBar. none mode", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 11, highError: 3, lowError: 2 }, { arg: 5, val: 22, highError: 40, lowError: 1 },
                { arg: 13, val: 3, highError: 5, lowError: 4 }, { arg: 20, val: 15, highError: 6, lowError: 6 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous", valueErrorBar: { displayMode: "none", highValueField: "highError", lowValueField: "lowError" } });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.val.min, 3, "Min arg should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max arg should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories arg should be undefined");
});

QUnit.test("Data with valueErrorBar. invalid mode", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 11, highError: 27, lowError: 20 }, { arg: 5, val: 22, highError: 25, lowError: 20 },
        { arg: 13, val: 10, highError: 3, lowError: 5 }, { arg: 20, val: 15, highError: 1, lowError: 8 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous", valueErrorBar: { displayMode: "invalidMode", highValueField: "highError", lowValueField: "lowError" } });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.val.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.val.max, 27, "Max arg should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories arg should be undefined");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date6 = new Date(2000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = getOriginalData([{ arg: date4, val: date5 }, { arg: date3, val: date6 }, { arg: date2, val: date7 }, { arg: date1, val: date8 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, date1, "Min arg should be correct");
    assert.deepEqual(rangeData.arg.max, date4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1000, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.deepEqual(rangeData.val.min, date5, "Min val should be correct");
    assert.deepEqual(rangeData.val.max, date8, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Numeric. Categories", function(assert) {
    var data = getOriginalData([{ arg: 13, val: 2 }, { arg: 5, val: 3 }, { arg: 20, val: 4 }, { arg: 2, val: 1 }]),
        options = { type: "line", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [13, 5, 20, 2], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [2, 3, 4, 1], "Categories val should be correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date6 = new Date(6000),
        date7 = new Date(7000),
        date8 = new Date(8000),
        data = getOriginalData([{ arg: date4, val: date8 }, { arg: date3, val: date7 }, { arg: date2, val: date6 }, { arg: date1, val: date5 }]),
        options = { type: "line", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [date4, date3, date2, date1], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date8, date7, date6, date5], "Categories val should be correct");
});

QUnit.test("String.", function(assert) {
    var data = getOriginalData([{ arg: "13", val: "6" }, { arg: "5", val: "3" }, { arg: "20", val: "7" }, { arg: "2", val: "1" }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "discrete", valueAxisType: "discrete" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["13", "5", "20", "2"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["6", "3", "7", "1"], "Categories val should be correct");
});

QUnit.module("Process range data on updating. Simple. With null values");

QUnit.test("Numeric.", function(assert) {
    var data = getOriginalData([{ arg: 2, val: 7 }, { arg: 5, val: 16 }, { arg: 20, val: null }, { arg: 13, val: 11 }]),
        rangeData,
        series = createSeries({ type: "line" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 7, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 16, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date11 = new Date(11000),
        date13 = new Date(13000),
        date14 = new Date(14000),
        data = getOriginalData([{ arg: date4, val: date11 }, { arg: date3, val: date13 }, { arg: date2, val: null }, { arg: date1, val: date14 }]),
        rangeData,
        series = createSeries({ type: "line" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, date1, "Min arg should be correct");
    assert.deepEqual(rangeData.arg.max, date4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1000, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.deepEqual(rangeData.val.min, date11, "Min val should be correct");
    assert.deepEqual(rangeData.val.max, date14, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Numeric. Categories", function(assert) {
    var data = getOriginalData([{ arg: 13, val: 11 }, { arg: 5, val: 16 }, { arg: 20, val: null }, { arg: 2, val: 7 }]),
        options = { type: "line", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be correct");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [13, 5, 20, 2], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [11, 16, 7], "Categories val should be correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date11 = new Date(11000),
        date13 = new Date(13000),
        date14 = new Date(14000),
        data = [{ arg: date4, val: date13 }, { arg: date3, val: date11 }, { arg: date2, val: null }, { arg: date1, val: date14 }],
        options = { type: "line", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [date4, date3, date2, date1], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date13, date11, date14], "Categories val should be correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "13", val: "11" }, { arg: "5", val: "16" }, { arg: "20", val: null }, { arg: "2", val: "7" }],
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "discrete", valueAxisType: "discrete" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be correct");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["13", "5", "20", "2"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["11", "16", "7"], "Categories val should be correct");
});

QUnit.module("Process range data on updating. Simple. For each types");

QUnit.test("Line", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Scatter", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "scatter", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Spline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "spline", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Stepline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "stepline", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.module("Process range data on updating. Range series");

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "continuous", mainSeriesColor: function() { } });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date6 = new Date(2000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.deepEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.deepEqual(rangeData.val.min, date5, "Min val should be correct");
    assert.deepEqual(rangeData.val.max, date8, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Numeric. Categories", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 15 }, { arg: 4, val1: 15, val2: 115 }],
        options = { type: "rangebar", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [110, 11, 100, 22, 15, 3, 115], "Categories val should be correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date6 = new Date(6000),
        date7 = new Date(7000),
        date8 = new Date(8000),
        data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }],
        options = { type: "rangebar", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date2, date1, date4, date3, date6, date5, date8, date7], "Categories val should be correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "1", val1: "11", val2: "110" }, { arg: "2", val1: "22", val2: "100" }, { arg: "3", val1: "3", val2: "4" }, { arg: "4", val1: "15", val2: "115" }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "discrete", valueAxisType: "discrete" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["110", "11", "100", "22", "4", "3", "115", "15"], "Categories val should be correct");
});

QUnit.module("Process range data on updating. Range series. With null values");

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: null, val2: 22 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: null, val2: 115 }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 110, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: null, val2: date4 }, { arg: 3, val1: date5, val2: null }, { arg: 4, val1: date7, val2: date8 }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.deepEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.deepEqual(rangeData.val.min, date5, "Min val should be correct");
    assert.deepEqual(rangeData.val.max, date8, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Numeric. Categories", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: null }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: null, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        options = { type: "rangebar", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [100, 22, 115, 15], "Categories val should be correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date6 = new Date(6000),
        date7 = new Date(7000),
        date8 = new Date(8000),
        data = [{ arg: 1, val1: date1, val2: null }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: null, val2: date6 }, { arg: 4, val1: date7, val2: date8 }],
        options = { type: "rangebar", argumentAxisType: "discrete", valueAxisType: "discrete" },
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date4, date3, date8, date7], "Categories val should be correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "1", val1: null, val2: "110" }, { arg: "2", val1: "22", val2: "100" }, { arg: "3", val1: "3", val2: null }, { arg: "4", val1: "15", val2: "115" }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "discrete", valueAxisType: "discrete" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["100", "22", "115", "15"], "Categories val should be correct");
});

QUnit.module("Process range data on updating. Range series. For each types");

QUnit.test("Rangebar", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Rangearea", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.module("Get range data. Simple", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "line",
            visible: true,
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Get range data for one point", function(assert) {
    var data = [{ arg: 2, val: 11 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "argumentAxisType", argumentType: "argumentType", valueAxisType: "valueAxisType", valueType: "valueType" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 2, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");
    assert.strictEqual(rangeData.arg.axisType, "argumentAxisType");
    assert.strictEqual(rangeData.arg.dataType, "argumentType");
    assert.strictEqual(rangeData.arg.isValueRange, undefined);

    assert.strictEqual(rangeData.val.min, 11, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 11, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");
    assert.strictEqual(rangeData.val.axisType, "valueAxisType");
    assert.strictEqual(rangeData.val.dataType, "valueType");
});

QUnit.test("Labels are visible", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous", label: { visible: true } }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, true, "Max space correction is correct");
});

QUnit.test("Labels are visible and inside", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous", label: { visible: true, position: "inside" } }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date6 = new Date(2000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = [{ arg: date4, val: date5 }, { arg: date3, val: date6 }, { arg: date2, val: date7 }, { arg: date1, val: date8 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, date1, "Min arg should be correct");
    assert.deepEqual(rangeData.arg.max, date4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1000, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categoriesX, undefined, "Categories x should be undefined");

    assert.deepEqual(rangeData.val.min, date5, "Min val should be correct");
    assert.deepEqual(rangeData.val.max, date8, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Numeric. Categories", function(assert) {
    var data = [{ arg: 13, val: 2 }, { arg: 5, val: 3 }, { arg: 20, val: 4 }, { arg: 2, val: 1 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [13, 5, 20, 2], "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [2, 3, 4, 1], "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date6 = new Date(6000),
        date7 = new Date(7000),
        date8 = new Date(8000),
        data = [{ arg: date4, val: date8 }, { arg: date3, val: date7 }, { arg: date2, val: date6 }, { arg: date1, val: date5 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [date4, date3, date2, date1], "Categories x should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date8, date7, date6, date5], "Categories y should be correct");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "13", val: "6" }, { arg: "5", val: "3" }, { arg: "20", val: "7" }, { arg: "2", val: "1" }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["13", "5", "20", "2"], "Categories x should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["6", "3", "7", "1"], "Categories y should be correct");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Simple. For each types", {
    beforeEach: function() {
        this.defaultOptions = {
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Line", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "line", argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Scatter", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "scatter", argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Spline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "spline", argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stepline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stepline", argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedline", argumentAxisType: "continuous" }));

    series.updateData(data);

    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedspline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedspline", argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedline, update data", function(assert) {
    var data1 = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        data2 = [{ arg: 2, val: 1 }, { arg: 5, val: 2 }, { arg: 13, val: 3 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedline", argumentAxisType: "continuous" }));

    series.updateData(data1);
    series.getRangeData();

    series.updateData(data2);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 13, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 1, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 3, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Bubble", function(assert) {
    var data = [{ arg: 2, val: 11, size: 1 }, { arg: 5, val: 22, size: 1 }, { arg: 13, val: 3, size: 1 }, { arg: 20, val: 15, size: 1 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "bubble", argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Bar/area", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "bar",
            argumentAxisType: "discrete",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Positive points", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries(this.defaultOptions),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Positive points. With labels", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { label: { visible: true } })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, true, "Max space correction is correct");
});

QUnit.test("Negative points", function(assert) {
    var data = [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        series = createSeries(this.defaultOptions),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, -10, "Min y should be correct");
    assert.equal(rangeData.val.max, 0, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Negative points. With labels", function(assert) {
    var data = [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { label: { visible: true } })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, -10, "Min y should be correct");
    assert.equal(rangeData.val.max, 0, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, true, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Positive and negative points", function(assert) {
    var data = [{ arg: "1", val: -4 }, { arg: "2", val: 10 }, { arg: "3", val: -7 }, { arg: "4", val: 3 }],
        series = createSeries(this.defaultOptions),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, -7, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Positive and negative points. With labels", function(assert) {
    var data = [{ arg: "1", val: -4 }, { arg: "2", val: 10 }, { arg: "3", val: -7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { label: { visible: true } })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, -7, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, true, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, true, "Max space correction is correct");
});

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, val: 4 }, { arg: 2, val: 10 }, { arg: 3, val: 7 }, { arg: 4, val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min x should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max x should be correct");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Datetime", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date6 = new Date(2000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = [{ arg: date4, val: date5 }, { arg: date3, val: date6 }, { arg: date2, val: date7 }, { arg: date1, val: date8 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { valueType: "datetime", argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, date1, "Min x should be correct");
    assert.deepEqual(rangeData.arg.max, date4, "Max x should be correct");
    assert.strictEqual(rangeData.arg.interval, 1000, "Interval x should be correct");
    assert.equal(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.deepEqual(rangeData.val.min, date5, "Min y should be correct");
    assert.deepEqual(rangeData.val.max, date8, "Max y should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Interval y should be undefined");
    assert.equal(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("showZero === undefined", function(assert) {
    var options = $.extend({}, true, this.defaultOptions, { label: { visible: true } }),
        data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }],
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.strictEqual(rangeData.val.min, 0, "minY");
});

QUnit.test("showZero === false", function(assert) {
    var options = $.extend({}, true, this.defaultOptions, { label: { visible: true } }),
        data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }],
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    series.updateDataType({ showZero: false });
    rangeData = series.getRangeData();

    assert.strictEqual(rangeData.val.min, 10, "minY");
});

QUnit.test("logarithmic axis", function(assert) {
    var options = $.extend({}, true, this.defaultOptions, { label: { visible: false }, valueAxisType: "logarithmic", argumentAxisType: "continuous" }),
        data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }],
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, 1, "Min x should be correct");
    assert.deepEqual(rangeData.arg.max, 5, "Max x should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Interval x should be correct");
    assert.equal(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.deepEqual(rangeData.val.min, 10, "Min y should be correct");
    assert.deepEqual(rangeData.val.max, 50, "Max y should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Interval y should be undefined");
    assert.equal(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Bar/area. For each types", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "bar",
            argumentAxisType: "discrete",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Bar", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries(this.defaultOptions),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.strictEqual(rangeData.arg.stick, false, "Stick should be false");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedbar", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedbar" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.strictEqual(rangeData.arg.stick, false, "Stick should be false");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedbar, update data", function(assert) {
    var data1 = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        data2 = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedbar", argumentAxisType: "continuous" })),
        rangeData;

    series.updateData(data1);
    series.getRangeData();

    series.updateData(data2);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, "1", "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, "3", "Max x should be undefined");
    assert.strictEqual(rangeData.arg.stick, false, "Stick should be false");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Fullstackedbar", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "fullstackedbar" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.strictEqual(rangeData.arg.stick, false, "Stick should be false");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, true, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Area", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "area" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedarea", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedarea" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedsplinearea", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedsplinearea" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedarea, update data", function(assert) {
    var data1 = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        data2 = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedarea", argumentAxisType: "continuous" })),
        rangeData;

    series.updateData(data1);
    series.getRangeData();

    series.updateData(data2);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, "1", "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, "3", "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Stackedarea, rearrange series family", function(assert) {
    var data1 = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stackedarea", argumentAxisType: "continuous" })),
        rangeData;

    series.updateData(data1);
    series.getRangeData();

    $.each(series.getPoints(), function(_, p) {
        p.value -= 2;
    });
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, "1", "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, "4", "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 8, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Steparea", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "steparea" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Splinearea", function(assert) {
    var data = [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "splinearea" })),
        rangeData;

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
    assert.equal(rangeData.val.min, 0, "Min y should be correct");
    assert.equal(rangeData.val.max, 10, "Max y should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Fullstacked series", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "fullstackedline",
            argumentAxisType: "discrete",
            visible: true,
            label: {
                visible: false,
                position: "outside"
            }
        };
    },

    testGetRange: function(assert, seriesType, data, labelVisibility, min, max, minCorrected, maxCorrected) {
        var series = createSeries($.extend(true, {}, this.defaultOptions, { type: seriesType, label: { visible: labelVisibility } })),
            rangeData;

        series.updateData(data);

        //act
        rangeData = series.getRangeData();

        //assert
        assert.ok(rangeData, "Range data should be created");
        assert.strictEqual(rangeData.arg.min, undefined, "Min x should be undefined");
        assert.strictEqual(rangeData.arg.max, undefined, "Max x should be undefined");
        assert.equal(rangeData.val.min, min, "Min y should be correct");
        assert.equal(rangeData.val.max, max, "Max y should be correct");

        assert.equal(rangeData.val.percentStick, true, "Percent stick is correct");
        assert.equal(rangeData.val.minSpaceCorrection, minCorrected, "Min space correction is correct");
        assert.equal(rangeData.val.maxSpaceCorrection, maxCorrected, "Max space correction is correct");
    },

    testGetRangeWithDataUpdate: function(assert, seriesType, data1, data2, min, max, minArg, maxArg) {
        var series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous", type: seriesType })),
            rangeData;

        series.updateData(data1);
        series.getRangeData();
        series.updateData(data2);
        //act
        rangeData = series.getRangeData();

        //assert
        assert.ok(rangeData, "Range data should be created");
        assert.strictEqual(rangeData.arg.min, minArg, "Min x should be undefined");
        assert.strictEqual(rangeData.arg.max, maxArg, "Max x should be undefined");
        assert.equal(rangeData.val.min, min, "Min y should be correct");
        assert.equal(rangeData.val.max, max, "Max y should be correct");

        assert.equal(rangeData.val.percentStick, true, "Percent stick is correct");
        assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
        assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
    }
});

QUnit.test("Fullstacked Line", function(assert) {
    this.testGetRange(assert,
        "fullstackedline",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Line. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedline",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        true,
        0,
        10,
        undefined,
        true);
});

QUnit.test("Fullstacked Line. Negative points", function(assert) {
    this.testGetRange(assert,
        "fullstackedline",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Line. Negative points. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedline",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        true,
        -10,
        0,
        true,
        undefined);
});

QUnit.test("Fullstacked Line. Update Data", function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        "fullstackedline",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        [{ arg: "1", val: 4 }, { arg: "2", val: 3 }, { arg: "3", val: 7 }],
        0,
        7,
        "1",
        "3");
});

QUnit.test("Fullstacked Spline", function(assert) {
    this.testGetRange(assert,
        "fullstackedspline",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Spline. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedspline",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        true,
        0,
        10,
        undefined,
        true);
});

QUnit.test("Fullstacked Spline. Negative points", function(assert) {
    this.testGetRange(assert,
        "fullstackedspline",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Spline. Negative points. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedspline",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        true,
        -10,
        0,
        true,
        undefined);
});

QUnit.test("Fullstacked Spline", function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        "fullstackedspline",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        [{ arg: "1", val: 4 }, { arg: "2", val: 3 }, { arg: "3", val: 7 }],
        0,
        7,
        "1",
        "3");
});

QUnit.test("Fullstacked Area", function(assert) {
    this.testGetRange(assert,
        "fullstackedarea",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Area. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedarea",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        true,
        0,
        10,
        undefined,
        true);
});

QUnit.test("Fullstacked Area. Negative points", function(assert) {
    this.testGetRange(assert,
        "fullstackedarea",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Area. Negative points. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedarea",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        true,
        -10,
        0,
        true,
        undefined);
});

QUnit.test("Fullstacked Area", function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        "fullstackedarea",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        [{ arg: "1", val: 4 }, { arg: "2", val: 3 }, { arg: "3", val: 7 }],
        0,
        7,
        "1",
        "3");
});

QUnit.test("Fullstacked SplineArea", function(assert) {
    this.testGetRange(assert,
        "fullstackedsplinearea",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test("Fullstacked SplineArea. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedsplinearea",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        true,
        0,
        10,
        undefined,
        true);
});

QUnit.test("Fullstacked SplineArea. Negative points", function(assert) {
    this.testGetRange(assert,
        "fullstackedsplinearea",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test("Fullstacked SplineArea. Negative points. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedsplinearea",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        true,
        -10,
        0,
        true,
        undefined);
});

QUnit.test("Fullstacked SplineArea", function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        "fullstackedsplinearea",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        [{ arg: "1", val: 4 }, { arg: "2", val: 3 }, { arg: "3", val: 7 }],
        0,
        7,
        "1",
        "3");
});

QUnit.test("Fullstacked Bar", function(assert) {
    this.testGetRange(assert,
        "fullstackedbar",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        false,
        0,
        10,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Bar. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedbar",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        true,
        0,
        10,
        undefined,
        true);
});

QUnit.test("Fullstacked Bar. Negative points", function(assert) {
    this.testGetRange(assert,
        "fullstackedbar",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        false,
        -10,
        0,
        undefined,
        undefined);
});

QUnit.test("Fullstacked Bar. Negative points. With labels", function(assert) {
    this.testGetRange(assert,
        "fullstackedbar",
        [{ arg: "1", val: -4 }, { arg: "2", val: -10 }, { arg: "3", val: -7 }, { arg: "4", val: -3 }],
        true,
        -10,
        0,
        true,
        undefined);
});

QUnit.test("Fullstacked Bar", function(assert) {
    this.testGetRangeWithDataUpdate(assert,
        "fullstackedbar",
        [{ arg: "1", val: 4 }, { arg: "2", val: 10 }, { arg: "3", val: 7 }, { arg: "4", val: 3 }],
        [{ arg: "1", val: 4 }, { arg: "2", val: 3 }, { arg: "3", val: 7 }],
        0,
        7,
        "1",
        "3");
});

QUnit.module("Get range data. Range series", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "rangearea",
            argumentAxisType: "discrete",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Labels are visible", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous", label: { visible: true } }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, true, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, true, "Max space correction is correct");
});

QUnit.test("Labels are visible and inside", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous", label: { visible: true, position: "inside" } }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date6 = new Date(2000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.deepEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.deepEqual(rangeData.val.min, date5, "Min val should be correct");
    assert.deepEqual(rangeData.val.max, date8, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Numeric. Categories", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 15 }, { arg: 4, val1: 15, val2: 115 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [110, 11, 100, 22, 15, 3, 115], "Categories val should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date6 = new Date(6000),
        date7 = new Date(7000),
        date8 = new Date(8000),
        data = [{ arg: 1, val1: date1, val2: date2 }, { arg: 2, val1: date3, val2: date4 }, { arg: 3, val1: date5, val2: date6 }, { arg: 4, val1: date7, val2: date8 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date2, date1, date4, date3, date6, date5, date8, date7], "Categories val should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "1", val1: "11", val2: "110" }, { arg: "2", val1: "22", val2: "100" }, { arg: "3", val1: "3", val2: "4" }, { arg: "4", val1: "15", val2: "115" }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }));


    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["110", "11", "100", "22", "4", "3", "115", "15"], "Categories val should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Range series. For each types", {
    beforeEach: function() {
        this.defaultOptions = {
            argumentAxisType: "continuous",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Rangebar", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "rangebar" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Rangearea", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "rangearea" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Financial series", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "stock",
            highValueField: "h",
            lowValueField: "l",
            openValueField: "o",
            closeValueField: "c",
            reduction: {
                level: "open"
            },
            argumentAxisType: "discrete",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Labels are visible", function(assert) {
    var data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous", label: { visible: true } }));

    series.updateData(data);

    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, true, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, true, "Max space correction is correct");
});

QUnit.test("Labels are visible and inside", function(assert) {
    var data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous", label: { visible: true, position: "inside" } }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories x should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories y should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date6 = new Date(2000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = [{ arg: 1, l: date1, h: date2, o: date1, c: date2 }, { arg: 2, l: date3, h: date4, o: date3, c: date4 }, { arg: 3, l: date5, h: date6, o: date5, c: date6 }, { arg: 4, l: date7, h: date8, o: date7, c: date8 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "continuous" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.deepEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min arg interval should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.deepEqual(rangeData.val.min, date5, "Min val should be correct");
    assert.deepEqual(rangeData.val.max, date8, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Numeric. Categories", function(assert) {
    var data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [110, 11, 100, 22, 4, 3, 115, 15], "Categories val should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date6 = new Date(6000),
        date7 = new Date(7000),
        date8 = new Date(8000),
        data = [{ arg: 1, l: date1, h: date2, o: date1, c: date2 }, { arg: 2, l: date3, h: date4, o: date3, c: date4 }, { arg: 3, l: date5, h: date6, o: date5, c: date6 }, { arg: 4, l: date7, h: date8, o: date7, c: date8 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date2, date1, date4, date3, date6, date5, date8, date7], "Categories val should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "1", l: "11", h: "110", o: "11", c: "110" }, { arg: "2", l: "22", h: "100", o: "22", c: "100" }, { arg: "3", l: "3", h: "4", o: "3", c: "4" }, { arg: "4", l: "15", h: "115", o: "15", c: "115" }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }));


    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["110", "11", "100", "22", "4", "3", "115", "15"], "Categories val should be correct");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Financial series. For each types", {
    beforeEach: function() {
        this.defaultOptions = {
            argumentAxisType: "continuous",
            reduction: {
                level: "open"
            },
            highValueField: "h",
            lowValueField: "l",
            openValueField: "o",
            closeValueField: "c",
            label: {
                visible: false,
                position: "outside"
            }
        };

    }
});

QUnit.test("Stock", function(assert) {
    var data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "stock" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.test("Candlestick", function(assert) {
    var data = [{ arg: 1, l: 11, h: 110, o: 11, c: 110 }, { arg: 2, l: 22, h: 100, o: 22, c: 100 }, { arg: 3, l: 3, h: 4, o: 3, c: 4 }, { arg: 4, l: 15, h: 115, o: 15, c: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "candlestick" }));

    series.updateData(data);
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");

    assert.equal(rangeData.val.percentStick, undefined, "Percent stick is correct");
    assert.equal(rangeData.val.minSpaceCorrection, undefined, "Min space correction is correct");
    assert.equal(rangeData.val.maxSpaceCorrection, undefined, "Max space correction is correct");
});

QUnit.module("Get range data. Pie series", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "pie",
            argumentAxisType: "discrete",
            label: {
                visible: false,
                position: "outside"
            },
            mainSeriesColor: function() { },
            widgetType: "pie"
        };
    }
});

QUnit.test("Positive points", function(assert) {
    var data = [{ arg: "1", val: 11 }, { arg: "2", val: 22 }, { arg: "3", val: 3 }, { arg: "4", val: 15 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.ok(rangeData, "Range data should be created");
    assert.deepEqual(rangeData, { val: { min: 0, max: 51 } });
});

QUnit.test("Positive and negative points", function(assert) {
    var data = [{ arg: "1", val: -11 }, { arg: "2", val: 22 }, { arg: "3", val: -3 }, { arg: "4", val: 15 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: 37 } });
});

QUnit.test("Negative points", function(assert) {
    var data = [{ arg: "1", val: -11 }, { arg: "2", val: -22 }, { arg: "3", val: -3 }, { arg: "4", val: -15 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: -51 } });
});

QUnit.module("Get range data. Pie series. For each types", {
    beforeEach: function() {
        this.defaultOptions = {
            argumentAxisType: "discrete",
            label: {
                visible: false,
                position: "outside"
            },
            mainSeriesColor: function() { }
        };
    }
});

QUnit.test("Pie", function(assert) {
    var data = [{ arg: "1", val: 11 }, { arg: "2", val: 22 }, { arg: "3", val: 3 }, { arg: "4", val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "pie" }), null, "pie");

    series.updateData(data);
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: 51 } });
});

QUnit.test("Doughnut", function(assert) {
    var data = [{ arg: "1", val: 11 }, { arg: "2", val: 22 }, { arg: "3", val: 3 }, { arg: "4", val: 15 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "doughnut" }), null, "pie");

    series.updateData(data);
    series.arrangePoints();
    rangeData = series.getRangeData();

    assert.deepEqual(rangeData, { val: { min: 0, max: 51 } });
});

QUnit.module("Zooming range data", {
    beforeEach: function() {
        var viewPort;
        this.zoom = function(min, max) {
            viewPort = { min: min, max: max };
        };
        this.argumentAxis = {
            getViewport: function() {
                return viewPort;
            }
        };
        this.defaultOptions = {
            type: "line",
            argumentAxisType: "continuous",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Set incorrect min zoom (null)", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(null, 4);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, 10, "min y");
    assert.equal(rangeData.max, 40, "max y");
});

QUnit.test("Set incorrect max zoom (undefined)", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, undefined);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, 30, "min y");
    assert.equal(rangeData.max, 60, "max y");
});

QUnit.test("Set incorrect max zoom (null)", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, null);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, 30, "min y");
    assert.equal(rangeData.max, 60, "max y");
});

QUnit.test("Set incorrect min zoom (undefined)", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(undefined, 5);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, 10, "min y");
    assert.equal(rangeData.max, 50, "max y");
});

QUnit.test("GetViewport without zooming", function(assert) {
    this.defaultOptions.type = "bar";

    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, undefined, "min y");
    assert.equal(rangeData.max, undefined, "max y");
});

QUnit.module("Zooming range data. Simple", {
    beforeEach: function() {
        var viewPort = {};
        this.zoom = function(min, max) {
            viewPort = { min: min, max: max };
        };
        this.argumentAxis = {
            getViewport: function() {
                return viewPort;
            }
        };
        this.defaultOptions = {
            type: "line",
            argumentAxisType: "continuous",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Numeric.", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, 4.5);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, 30, "min y");
    assert.equal(rangeData.max, 45, "max y");
});

QUnit.test("Numeric. zooming args between points.", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, 4);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, 30, "min y");
    assert.equal(rangeData.max, 40, "max y");
});

QUnit.test("Numeric. Area", function(assert) {
    this.defaultOptions.type = "area";

    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, 4.5);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, 0, "min y");
    assert.equal(rangeData.max, 45, "max y");
    //assert.strictEqual(rangeData.arg.interval, 1);
});


QUnit.test("Range data has viewport", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, 4.5);

    rangeData = series.getRangeData();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.viewport.min, 30, "min visible y");
    assert.equal(rangeData.viewport.max, 45, "max visible y");

    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");

});

QUnit.test("T179635. With error bars", function(assert) {
    this.defaultOptions.valueErrorBar = {
        lowValueField: "low",
        highValueField: "high"
    };
    var data = getOriginalData([{
            arg: 1, val: 10, low: 5, high: 15
        }, {
            arg: 2, val: 20, low: 15, high: 25
        }, {
            arg: 3, val: 30, low: 25, high: 35
        }, {
            arg: 4, val: 40, low: 35, high: 45
        }, {
            arg: 5, val: 50, low: 45, high: 55
        }, {
            arg: 6, val: 60, low: 55, high: 65
        }]),
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(2, 5);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.min, 15, "min y");
    assert.equal(rangeData.max, 55, "max y");
});

QUnit.test("Datetime argument. String value.", function(assert) {
    var argDate1 = new Date(1000),
        argDate2 = new Date(2000),
        argDate3 = new Date(3000),
        argDate4 = new Date(4000),
        argDate5 = new Date(5000),
        argDate6 = new Date(6000),
        testDate = new Date(4500),
        data = [{ arg: argDate1, val: "10" }, { arg: argDate2, val: "20" }, { arg: argDate3, val: "30" }, { arg: argDate4, val: "40" }, { arg: argDate5, val: "50" }, { arg: argDate6, val: "60" }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { valueAxisType: "discrete" }), { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(argDate3, testDate);

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");

    assert.strictEqual(rangeData.min, undefined, "min Visible Y");
    assert.strictEqual(rangeData.max, undefined, "max Visible Y");
    //assert.deepEqual(rangeData.categories, ["30", "40", "50"?], "CategoriesY");
});

QUnit.test("with calcInterval", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.argumentAxis.calcInterval = function(a, b) {
        return a / b;
    };

    rangeData = series.getRangeData();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1.2);
    assert.strictEqual(rangeData.val.interval, undefined);
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.test("Discrete argument axis.", function(assert) {
    var data = [{ arg: "1", val: 10 }, { arg: "2", val: 20 }, { arg: "3", val: 30 }, { arg: "4", val: 40 }, { arg: "5", val: 50 }, { arg: "6", val: 60 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete" }), { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom("3", "4");

    rangeData = series.getViewport();

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.min, undefined, "min y");
    assert.equal(rangeData.max, undefined, "max y");
    assert.strictEqual(rangeData.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.strictEqual(rangeData.minVisible, undefined, "no min Visible Y");
    assert.strictEqual(rangeData.maxVisible, undefined, "no max Visible Y");
    assert.deepEqual(rangeData.categories, undefined, "No categories");
});

QUnit.module("Zooming range data. Bar/area", {
    beforeEach: function() {
        var viewPort = {};
        this.zoom = function(min, max) {
            viewPort = { min: min, max: max };
        };
        this.argumentAxis = {
            getViewport: function() {
                return viewPort;
            }
        };
        this.defaultOptions = {
            type: "area",
            argumentAxisType: "continuous",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Positive points", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(2, 4.5);

    rangeData = series.getViewport();

    assert.equal(rangeData.min, 0, "min Visible Y");
    assert.equal(rangeData.max, 45, "max Visible Y");
});

QUnit.test("Negative points", function(assert) {
    var data = [{ arg: 1, val: -10 }, { arg: 2, val: -20 }, { arg: 3, val: -30 }, { arg: 4, val: -40 }, { arg: 5, val: -50 }, { arg: 6, val: -60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, 4.5);

    rangeData = series.getViewport();

    assert.equal(rangeData.max, 0, "max Visible Y");
    assert.equal(rangeData.min, -45, "min Visible Y");
});

QUnit.test("ShowZero === false", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { showZero: false }), { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom(3, 4.5);
    rangeData = series.getViewport();

    assert.equal(rangeData.min, 30, "min Visible Y");
    assert.equal(rangeData.max, 45, "max Visible Y");
});

QUnit.test("Discrete data", function(assert) {
    this.defaultOptions.argumentAxisType = "discrete";
    var data = [{ arg: "1", val: 10 }, { arg: "2", val: 20 }, { arg: "3", val: 30 }, { arg: "4", val: 40 }, { arg: "5", val: 50 }, { arg: "6", val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions, { argumentAxis: this.argumentAxis });

    series.updateData(data);

    this.zoom("2", "4");

    rangeData = series.getViewport();

    assert.equal(rangeData.min, undefined, "min Y");
    assert.equal(rangeData.max, undefined, "max Y");
});
