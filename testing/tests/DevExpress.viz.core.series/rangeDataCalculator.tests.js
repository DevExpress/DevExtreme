"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    Series = require("viz/series/base_series").Series;

/* global insertMockFactory */
require("../../helpers/chartMocks.js");


require("viz/chart");

insertMockFactory();

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

    assert.ok(series, "Series should be created");
    assert.ok(series._rangeData, "Range data should be created");
    assert.ok($.isEmptyObject(series._rangeData.arg), "Range data should be empty");
    assert.ok($.isEmptyObject(series._rangeData.val), "Range data should be empty");
});

QUnit.test("Range for dataSource with one point", function(assert) {
    var series = createSeries({ type: "line" });

    series.updateData([{ arg: 0, val: 0 }]);

    assert.ok(series, "Series should be created");
    assert.ok(series._rangeData, "Range data should be created");

    var rangeData = series._rangeData;
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
    rangeData = series._rangeData;

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
    var data = getOriginalData([{ arg: 2, val: 11 }, { arg: 2, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }]),
        rangeData,
        series = createSeries({ type: "line", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Stackedline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "stackedline", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Fullstackedline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "fullstackedline", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("StackedSpline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "stackedspline", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Fullstackedspline", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "fullstackedspline", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Area", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "area", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Steparea", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "steparea", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Stackedarea", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "stackedarea", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Fullstackedarea", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "fullstackedarea", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Stackedsplinearea", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "stackedsplinearea", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Fullstackedsplinearea", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "fullstackedarea", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Splinearea", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "splinearea", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Bar", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "bar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Stackedbar", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "stackedbar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Fullstackedbar", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "fullstackedbar", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Bubble", function(assert) {
    var data = [{ arg: 2, val: 11, size: 1 }, { arg: 5, val: 22, size: 1 }, { arg: 13, val: 3, size: 1 }, { arg: 20, val: 15, size: 1 }],
        rangeData,
        series = createSeries({ type: "bubble", argumentAxisType: "continuous" });

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 2, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 20, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 3, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 22, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Pie", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "pie", argumentAxisType: "continuous", mainSeriesColor: function() { } }, null, "pie");

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.minArg, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.maxArg, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.minIntervalArg, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Doughnut", function(assert) {
    var data = [{ arg: 2, val: 11 }, { arg: 5, val: 22 }, { arg: 13, val: 3 }, { arg: 20, val: 15 }],
        rangeData,
        series = createSeries({ type: "doughnut", argumentAxisType: "continuous", mainSeriesColor: function() { } }, null, "pie");

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.minArg, undefined, "Min arg should be correct");
    assert.strictEqual(rangeData.maxArg, undefined, "Max arg should be correct");
    assert.strictEqual(rangeData.minIntervalArg, undefined, "Min interval arg should be correct");

    assert.strictEqual(rangeData.min, undefined, "Min val should be correct");
    assert.strictEqual(rangeData.max, undefined, "Max val should be correct");
    assert.strictEqual(rangeData.interval, undefined, "Min val interval should be correct");
});

QUnit.module("Process range data on updating. Range series");

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, val1: 11, val2: 110 }, { arg: 2, val1: 22, val2: 100 }, { arg: 3, val1: 3, val2: 4 }, { arg: 4, val1: 15, val2: 115 }],
        rangeData,
        series = createSeries({ type: "rangebar", argumentAxisType: "continuous", mainSeriesColor: function() { } });

    series.updateData(data);
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [110, 11, 100, 22, 15, 3, 115, 15], "Categories val should be correct");
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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

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
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.module("Process range data on updating. Financial series", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "stock",
            argumentAxisType: "continuous",
            highValueField: "h",
            lowValueField: "l",
            openValueField: "o",
            closeValueField: "c",
            reduction: {
                level: "open"
            }
        };
    }
});

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, h: 11, l: 110, o: 20, c: 30 }, { arg: 2, h: 22, l: 100, o: 30, c: 40 }, { arg: 3, h: 3, l: 4, o: 3, c: 4 }, { arg: 4, h: 15, l: 115, o: 20, c: 30 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series._rangeData;

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
        data = [{ arg: 1, h: date1, l: date2, o: date1, c: date2 }, { arg: 2, h: date3, l: date4, o: date3, c: date4 }, { arg: 3, h: date5, l: date6, o: date5, c: date6 }, { arg: 4, h: date7, l: date8, o: date7, c: date8 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series._rangeData;

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
    var data = [{ arg: 1, h: 11, l: 110, o: 11, c: 110 }, { arg: 2, h: 22, l: 100, o: 22, c: 100 }, { arg: 3, h: 3, l: 4, o: 3, c: 4 }, { arg: 4, h: 15, l: 115, o: 15, c: 115 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [11, 110, 22, 100, 3, 4, 15, 115], "Categories val should be correct");
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
        data = [{ arg: 1, h: date1, l: date2, o: date1, c: date2 }, { arg: 2, h: date3, l: date4, o: date3, c: date4 }, { arg: 3, h: date5, l: date6, o: date5, c: date6 }, { arg: 4, h: date7, l: date8, o: date7, c: date8 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date1, date2, date3, date4, date5, date6, date7, date8], "Categories val should be correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "1", h: "11", l: "110", o: "11", c: "110" }, { arg: "2", h: "22", l: "100", o: "22", c: "100" }, { arg: "3", h: "3", l: "4", o: "3", c: "4" }, { arg: "4", h: "15", l: "115", o: "15", c: "115" }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["11", "110", "22", "100", "3", "4", "15", "115"], "Categories val should be correct");
});

QUnit.module("Process range data on updating. Financial series. With null values", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "stock",
            argumentAxisType: "continuous",
            reduction: {
                level: "open"
            },
            highValueField: "h",
            lowValueField: "l",
            openValueField: "o",
            closeValueField: "c"
        };
    }
});

QUnit.test("Numeric", function(assert) {
    var data = [{ arg: 1, h: 11, l: 110, o: 11, c: 110 }, { arg: 2, h: 22, l: null, o: 22, c: 22 }, { arg: 3, h: 3, l: 4, o: 3, c: 4 }, { arg: 4, h: null, l: 115, o: 115, c: 115 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");
    assert.strictEqual(rangeData.arg.categories, undefined, "Categories arg should be undefined");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 110, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
    assert.strictEqual(rangeData.val.categories, undefined, "Categories val should be undefined");
});

QUnit.test("Datetime.", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date4 = new Date(4000),
        date5 = new Date(1000),
        date7 = new Date(3000),
        date8 = new Date(4000),
        data = [{ arg: 1, h: date1, l: date2, o: date1, c: date2 }, { arg: 2, h: null, l: date4, o: date4, c: date4 }, { arg: 3, h: date5, l: null, o: date5, c: null }, { arg: 4, h: date7, l: date8, o: date7, c: date8 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series._rangeData;

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
    var data = [{ arg: 1, h: 11, l: null, o: 11, c: 11 }, { arg: 2, h: 22, l: 100, o: 22, c: 100 }, { arg: 3, h: null, l: 4, o: 4, c: 4 }, { arg: 4, h: 15, l: 115, o: 15, c: 115 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [22, 100, 15, 115], "Categories val should be correct");
});

QUnit.test("Datetime. Categories", function(assert) {
    var date1 = new Date(1000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date6 = new Date(6000),
        date7 = new Date(7000),
        date8 = new Date(8000),
        data = [{ arg: 1, h: date1, l: null, o: date1, c: date1 }, { arg: 2, h: date3, l: date4, o: date3, c: date4 }, { arg: 3, h: null, l: date6, o: date6, c: date6 }, { arg: 4, h: date7, l: date8, o: date7, c: date8 }],
        options = $.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }),
        rangeData,
        series = createSeries(options);

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, [1, 2, 3, 4], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, [date3, date4, date7, date8], "Categories val should be correct");
});

QUnit.test("String.", function(assert) {
    var data = [{ arg: "1", h: null, l: "110", o: "110", c: "110" }, { arg: "2", h: "22", l: "100", o: "22", c: "100" }, { arg: "3", h: "3", l: null, o: "3", c: "3" }, { arg: "4", h: "15", l: "115", o: "15", c: "115" }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete", valueAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData);
    assert.strictEqual(rangeData.arg.min, undefined, "Min arg should be undefined");
    assert.strictEqual(rangeData.arg.max, undefined, "Max arg should be undefined");
    assert.strictEqual(rangeData.arg.interval, undefined, "Min arg interval should be undefined");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4"], "Categories arg should be correct");

    assert.strictEqual(rangeData.val.min, undefined, "Min val should be undefined");
    assert.strictEqual(rangeData.val.max, undefined, "Max val should be undefined");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be undefined");
    assert.deepEqual(rangeData.val.categories, ["22", "100", "15", "115"], "Categories val should be correct");
});

QUnit.module("Process range data on updating. Financial series. For each types", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "stock",
            argumentAxisType: "continuous",
            reduction: {
                level: "open"
            },
            highValueField: "h",
            lowValueField: "l",
            openValueField: "o",
            closeValueField: "c"
        };
    }
});

QUnit.test("Stock", function(assert) {
    var data = [{ arg: 1, h: 11, l: 110, o: 11, c: 110 }, { arg: 2, h: 22, l: 100, o: 22, c: 100 }, { arg: 3, h: 3, l: 4, o: 3, c: 4 }, { arg: 4, h: 15, l: 115, o: 15, c: 115 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series._rangeData;

    assert.ok(rangeData, "Range data should be created");
    assert.strictEqual(rangeData.arg.min, 1, "Min arg should be correct");
    assert.strictEqual(rangeData.arg.max, 4, "Max arg should be correct");
    assert.strictEqual(rangeData.arg.interval, 1, "Min interval arg should be correct");

    assert.strictEqual(rangeData.val.min, 3, "Min val should be correct");
    assert.strictEqual(rangeData.val.max, 115, "Max val should be correct");
    assert.strictEqual(rangeData.val.interval, undefined, "Min val interval should be correct");
});

QUnit.test("Candlestick", function(assert) {
    var data = [{ arg: 1, h: 11, l: 110, o: 11, c: 110 }, { arg: 2, h: 22, l: 100, o: 22, c: 100 }, { arg: 3, h: 3, l: 4, o: 3, c: 4 }, { arg: 4, h: 15, l: 115, o: 15, c: 115 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { type: "candlestick" }));

    series.updateData(data);
    rangeData = series._rangeData;

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

QUnit.test("B253379. Set zoom arguments wider then axis interval", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: -10,
        maxArg: 10
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, -10, "min x");
    assert.equal(rangeData.arg.max, 10, "max x");

    assert.equal(rangeData.arg.minVisible, -10, "min x");
    assert.equal(rangeData.arg.maxVisible, 10, "max x");
});

QUnit.test("Set inverted zoom arguments", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 6,
        maxArg: 3
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");

    assert.equal(rangeData.arg.minVisible, 3, "min x");
    assert.equal(rangeData.arg.maxVisible, 6, "max x");

    assert.equal(rangeData.val.maxVisible, 60);
    assert.equal(rangeData.val.minVisible, 20);

});

QUnit.test("several zooming", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.getRangeData({
        adjustOnZoom: true,
        minArg: 1,
        maxArg: 6
    });

    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 4,
        maxArg: 6
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");

    assert.equal(rangeData.arg.minVisible, 4, "min x");
    assert.equal(rangeData.arg.maxVisible, 6, "max x");

    assert.equal(rangeData.val.maxVisible, 60);
    assert.equal(rangeData.val.minVisible, 30);

});

QUnit.test("several zooming with minVal& maxVal", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.getRangeData({
        adjustOnZoom: true,
        minArg: 1,
        maxArg: 6
    });

    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 4,
        maxArg: 6,
        minVal: 0,
        maxVal: 100
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");

    assert.equal(rangeData.arg.minVisible, 4, "min x");
    assert.equal(rangeData.arg.maxVisible, 6, "max x");

    assert.equal(rangeData.val.maxVisible, 100);
    assert.equal(rangeData.val.minVisible, 0);
});

QUnit.test("Set inverted zoom arguments. Datetime", function(assert) {
    var date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date6 = new Date(6000),
        data = [{ arg: date1, val: 10 }, { arg: date2, val: 20 }, { arg: date3, val: 30 }, { arg: date4, val: 40 }, { arg: date5, val: 50 }, { arg: date6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: date6,
        maxArg: date3
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, date1, "min x");
    assert.equal(rangeData.arg.max, date6, "max x");

    assert.equal(rangeData.arg.minVisible, date3, "min x");
    assert.equal(rangeData.arg.maxVisible, date6, "max x");
});

QUnit.test("Set incorrect zoom arguments", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: null,
        maxArg: 2
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");

    assert.equal(rangeData.arg.minVisible, undefined, "min x");
    assert.equal(rangeData.arg.maxVisible, undefined, "max x");
});

QUnit.test("Set incorrect zoom arguments", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: undefined,
        maxArg: 2
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");

    assert.equal(rangeData.arg.minVisible, undefined, "min x");
    assert.equal(rangeData.arg.maxVisible, undefined, "max x");
});

QUnit.test("B253694. Adjust on zoom = false", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: false,
        minArg: 3,
        maxArg: 4
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.arg.minVisible, 3, "min x");
    assert.equal(rangeData.arg.maxVisible, 4, "max x");

    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.equal(rangeData.val.minVisible, undefined, "min y");
    assert.equal(rangeData.val.maxVisible, undefined, "max y");
});

QUnit.module("Zooming range data. Simple", {
    beforeEach: function() {
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
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.arg.minVisible, 3, "min x");
    assert.equal(rangeData.arg.maxVisible, 4.5, "max x");
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.equal(rangeData.val.minVisible, 20, "min y");
    assert.equal(rangeData.val.maxVisible, 50, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
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
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.arg.minVisible, 3, "min x");
    assert.equal(rangeData.arg.maxVisible, 4.5, "max x");
    assert.equal(rangeData.val.min, 5, "min y");
    assert.equal(rangeData.val.max, 65, "max y");
    assert.equal(rangeData.val.minVisible, 15, "min y");
    assert.equal(rangeData.val.maxVisible, 50, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
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
        series = createSeries($.extend(true, {}, this.defaultOptions, { valueAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: argDate3,
        maxArg: testDate
    });

    assert.ok(rangeData, "Returned object");
    assert.deepEqual(rangeData.arg.min, argDate1, "min x");
    assert.deepEqual(rangeData.arg.max, argDate6, "max x");
    assert.strictEqual(rangeData.val.min, undefined, "min y");
    assert.strictEqual(rangeData.val.max, undefined, "max y");
    assert.strictEqual(rangeData.arg.interval, 1000);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.arg.minVisible, argDate3, "min Visible X");
    assert.equal(rangeData.arg.maxVisible, testDate, "max Visible X");
    assert.strictEqual(rangeData.val.minVisible, undefined, "min Visible Y");
    assert.strictEqual(rangeData.val.maxVisible, undefined, "max Visible Y");

    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, ["10", "20", "30", "40", "50", "60"], "CategoriesY");
});

QUnit.test("B253326. With min and max", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 1,
        maxArg: 6,
        minVal: 20,
        maxVal: 30
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.arg.minVisible, 1, "min Visible X");
    assert.equal(rangeData.arg.maxVisible, 6, "max Visible X");
    assert.equal(rangeData.val.minVisible, 20, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 30, "max Visible Y");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.test("T179635. With error bars and min/max", function(assert) {
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
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minVal: 20,
        maxVal: 40,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.arg.minVisible, 3, "min x");
    assert.equal(rangeData.arg.maxVisible, 4.5, "max x");
    assert.equal(rangeData.val.min, 5, "min y");
    assert.equal(rangeData.val.max, 65, "max y");
    assert.equal(rangeData.val.minVisible, 20, "min y");
    assert.equal(rangeData.val.maxVisible, 40, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
});

QUnit.test("with calcInterval", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData(undefined, function(a, b) {
        return a / b;
    });

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

QUnit.test("B253326. With min and max. Adjust on zoom = false", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: false,
        minArg: 1,
        maxArg: 6,
        minVal: 20,
        maxVal: 30
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.arg.minVisible, 1, "min Visible X");
    assert.equal(rangeData.arg.maxVisible, 6, "max Visible X");
    assert.equal(rangeData.val.minVisible, 20, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 30, "max Visible Y");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.strictEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.test("B253326. With inverted min and max", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        minArg: 1,
        maxArg: 6,
        minVal: 30,
        maxVal: 20
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.arg.minVisible, 1, "min Visible X");
    assert.equal(rangeData.arg.maxVisible, 6, "max Visible X");
    assert.equal(rangeData.val.minVisible, 20, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 30, "max Visible Y");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.test("B253326. With min and max that were wider than value interval", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        minArg: 1,
        maxArg: 6,
        minVal: -10,
        maxVal: 100
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, -10, "min y");
    assert.equal(rangeData.val.max, 100, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.arg.minVisible, 1, "min Visible X");
    assert.equal(rangeData.arg.maxVisible, 6, "max Visible X");
    assert.equal(rangeData.val.minVisible, -10, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 100, "max Visible Y");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
});

QUnit.test("Discrete argument axis.", function(assert) {
    var data = [{ arg: "1", val: 10 }, { arg: "2", val: 20 }, { arg: "3", val: 30 }, { arg: "4", val: 40 }, { arg: "5", val: 50 }, { arg: "6", val: 60 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series.getRangeData({
        minArg: "3",
        maxArg: "4"
    });

    assert.ok(rangeData, "Returned object");
    assert.strictEqual(rangeData.arg.min, undefined);
    assert.strictEqual(rangeData.arg.max, undefined);
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.interval, undefined);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.strictEqual(rangeData.val.minVisible, undefined, "no min Visible Y");
    assert.strictEqual(rangeData.val.maxVisible, undefined, "no max Visible Y");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4", "5", "6"], "CategoriesX");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});


QUnit.module("Zooming range data. Bar/area", {
    beforeEach: function() {
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
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 0, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.val.minVisible, 0, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 50, "max Visible Y");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
});

QUnit.test("several zooming with minVal& maxVal", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.getRangeData({
        adjustOnZoom: true,
        minArg: 1,
        maxArg: 6
    });

    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 4,
        maxArg: 6,
        minVal: 10,
        maxVal: 100
    });

    assert.ok(rangeData, "Returned object");

    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");

    assert.equal(rangeData.arg.minVisible, 4, "min x");
    assert.equal(rangeData.arg.maxVisible, 6, "max x");

    assert.equal(rangeData.val.maxVisible, 100);
    assert.equal(rangeData.val.minVisible, 10);
});

QUnit.test("Negative points", function(assert) {
    var data = [{ arg: 1, val: -10 }, { arg: 2, val: -20 }, { arg: 3, val: -30 }, { arg: 4, val: -40 }, { arg: 5, val: -50 }, { arg: 6, val: -60 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, -60, "min y");
    assert.equal(rangeData.val.max, 0, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.val.minVisible, -50, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 0, "max Visible Y");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.test("Logarithmic axis", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { valueAxisType: "logarithmic" }));

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.val.minVisible, 20, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 50, "max Visible Y");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.test("ShowZero === false", function(assert) {
    var data = [{ arg: 1, val: 10 }, { arg: 2, val: 20 }, { arg: 3, val: 30 }, { arg: 4, val: 40 }, { arg: 5, val: 50 }, { arg: 6, val: 60 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { showZero: false }));

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 10, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.val.minVisible, 20, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 50, "max Visible Y");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.test("Datetime argument. String value", function(assert) {
    var argDate1 = new Date(1000),
        argDate2 = new Date(2000),
        argDate3 = new Date(3000),
        argDate4 = new Date(4000),
        argDate5 = new Date(5000),
        argDate6 = new Date(6000),
        data = [{ arg: argDate1, val: "10" }, { arg: argDate2, val: "20" }, { arg: argDate3, val: "30" }, { arg: argDate4, val: "40" }, { arg: argDate5, val: "50" }, { arg: argDate6, val: "60" }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { valueAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: new Date(3000),
        maxArg: new Date(4500)
    });

    assert.ok(rangeData, "Returned object");
    assert.deepEqual(rangeData.arg.min, argDate1, "min x");
    assert.deepEqual(rangeData.arg.max, argDate6, "max x");
    assert.strictEqual(rangeData.val.min, undefined, "min y");
    assert.strictEqual(rangeData.val.max, undefined, "max y");
    assert.strictEqual(rangeData.arg.interval, 1000);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.strictEqual(rangeData.val.minVisible, undefined, "min Visible Y");
    assert.strictEqual(rangeData.val.maxVisible, undefined, "max Visible Y");

    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
    assert.deepEqual(rangeData.val.categories, ["10", "20", "30", "40", "50", "60"], "CategoriesY");
});

QUnit.test("Discrete argument axis", function(assert) {
    var data = [{ arg: "1", val: 10 }, { arg: "2", val: 20 }, { arg: "3", val: 30 }, { arg: "4", val: 40 }, { arg: "5", val: 50 }, { arg: "6", val: 60 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series.getRangeData({
        minArg: "3",
        maxArg: "4"
    });

    assert.ok(rangeData, "Returned object");
    assert.strictEqual(rangeData.arg.min, undefined);
    assert.strictEqual(rangeData.arg.max, undefined);
    assert.equal(rangeData.val.min, 0, "min y");
    assert.equal(rangeData.val.max, 60, "max y");
    assert.strictEqual(rangeData.arg.interval, undefined);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.strictEqual(rangeData.val.minVisible, undefined, "no min Visible Y");
    assert.strictEqual(rangeData.val.maxVisible, undefined, "no max Visible Y");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4", "5", "6"], "CategoriesX");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});

QUnit.module("Zooming range data. Range series", {
    beforeEach: function() {
        this.defaultOptions = {
            type: "rangearea",
            argumentAxisType: "continuous",
            label: {
                visible: false,
                position: "outside"
            }
        };
    }
});

QUnit.test("Partial range. Numeric argument. Numeric value.", function(assert) {
    var data = [{ arg: 1, val1: 10, val2: 5 }, { arg: 2, val1: 20, val2: 15 }, { arg: 3, val1: 30, val2: 65 }, { arg: 4, val1: 40, val2: 50 }, { arg: 5, val1: 50, val2: 32 }, { arg: 6, val1: 60, val2: 100 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 5, "min y");
    assert.equal(rangeData.val.max, 100, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.val.minVisible, 15, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 65, "max Visible Y");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
});

QUnit.test("several zooming", function(assert) {
    var data = [{ arg: 1, val1: 10, val2: 5 }, { arg: 2, val1: 20, val2: 15 }, { arg: 3, val1: 30, val2: 65 }, { arg: 4, val1: 40, val2: 50 }, { arg: 5, val1: 50, val2: 32 }, { arg: 6, val1: 60, val2: 100 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.getRangeData({
        adjustOnZoom: true,
        minArg: 1,
        maxArg: 6
    });


    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 5, "min y");
    assert.equal(rangeData.val.max, 100, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.val.minVisible, 15, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 65, "max Visible Y");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");

});

QUnit.test("several zooming with minVal& maxVal", function(assert) {
    var data = [{ arg: 1, val1: 10, val2: 5 }, { arg: 2, val1: 20, val2: 15 }, { arg: 3, val1: 30, val2: 65 }, { arg: 4, val1: 40, val2: 50 }, { arg: 5, val1: 50, val2: 32 }, { arg: 6, val1: 60, val2: 100 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    series.getRangeData({
        adjustOnZoom: true,
        minArg: 1,
        maxArg: 6
    });


    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: 3,
        maxArg: 4.5,
        minVal: 0,
        maxVal: 100
    });

    assert.ok(rangeData, "Returned object");
    assert.equal(rangeData.arg.min, 1, "min x");
    assert.equal(rangeData.arg.max, 6, "max x");
    assert.equal(rangeData.val.min, 0, "min y");
    assert.equal(rangeData.val.max, 100, "max y");
    assert.strictEqual(rangeData.arg.interval, 1);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.equal(rangeData.val.minVisible, 0, "min Visible Y");
    assert.equal(rangeData.val.maxVisible, 100, "max Visible Y");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
});

QUnit.test("Datetime argument. Datetime value.", function(assert) {
    var argDate1 = new Date(1000),
        argDate2 = new Date(2000),
        argDate3 = new Date(3000),
        argDate4 = new Date(4000),
        argDate5 = new Date(5000),
        argDate6 = new Date(6000),
        date1 = new Date(1000),
        date2 = new Date(2000),
        date3 = new Date(3000),
        date4 = new Date(4000),
        date5 = new Date(5000),
        date6 = new Date(6000),
        date10 = new Date(10000),
        date20 = new Date(20000),
        date30 = new Date(30000),
        date40 = new Date(40000),
        date50 = new Date(50000),
        date60 = new Date(60000),
        data = [{ arg: argDate1, val1: date1, val2: date20 }, { arg: argDate2, val1: date2, val2: date10 }, { arg: argDate3, val1: date3, val2: date30 }, { arg: argDate4, val1: date4, val2: date60 }, { arg: argDate5, val1: date5, val2: date50 }, { arg: argDate6, val1: date6, val2: date40 }],
        rangeData,
        series = createSeries(this.defaultOptions);

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: new Date(3000),
        maxArg: new Date(4500)
    });

    assert.ok(rangeData, "Returned object");
    assert.deepEqual(rangeData.arg.min, argDate1, "min x");
    assert.deepEqual(rangeData.arg.max, argDate6, "max x");
    assert.deepEqual(rangeData.val.min, date1, "min y");
    assert.deepEqual(rangeData.val.max, date60, "max y");
    assert.strictEqual(rangeData.arg.interval, 1000);
    assert.strictEqual(rangeData.val.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.deepEqual(rangeData.val.minVisible, date2, "min Visible Y");
    assert.deepEqual(rangeData.val.maxVisible, date60, "max Visible Y");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
    assert.deepEqual(rangeData.arg.categories, undefined, "No categories");
});

QUnit.test("Discrete argument axis.", function(assert) {
    var data = [{ arg: "1", val1: 10, val2: 5 }, { arg: "2", val1: 20, val2: 15 }, { arg: "3", val1: 30, val2: 65 }, { arg: "4", val1: 40, val2: 50 }, { arg: "5", val1: 50, val2: 32 }, { arg: "6", val1: 60, val2: 100 }],
        rangeData,
        series = createSeries($.extend(true, {}, this.defaultOptions, { argumentAxisType: "discrete" }));

    series.updateData(data);
    rangeData = series.getRangeData({
        adjustOnZoom: true,
        minArg: "3",
        maxArg: "4"
    });

    assert.ok(rangeData, "Returned object");
    assert.strictEqual(rangeData.arg.min, undefined);
    assert.strictEqual(rangeData.arg.max, undefined);
    assert.equal(rangeData.val.min, 5, "min y");
    assert.equal(rangeData.val.max, 100, "max y");
    assert.strictEqual(rangeData.val.interval, undefined);
    assert.strictEqual(rangeData.arg.interval, undefined);
    //should include values inside of range AND neighbour points
    assert.strictEqual(rangeData.val.minVisible, undefined, "no min Visible Y");
    assert.strictEqual(rangeData.val.maxVisible, undefined, "no max Visible Y");
    assert.deepEqual(rangeData.arg.categories, ["1", "2", "3", "4", "5", "6"], "CategoriesX");
    assert.deepEqual(rangeData.val.categories, undefined, "No categories");
});
