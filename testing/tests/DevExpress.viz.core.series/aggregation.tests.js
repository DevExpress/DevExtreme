"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    Series = require("viz/series/base_series").Series,
    pointModule = require("viz/series/points/base_point"),
    originalPoint = pointModule.Point;

/* global insertMockFactory, MockTranslator */
require("../../helpers/chartMocks.js");


require("viz/chart");

function checkResult(assert, result, fusionPoints, num) {
    assert.equal(result.length, num);
    for(var index = 0; index < num; index++) {
        var pointData = result[index];
        assert.strictEqual(pointData.argument, fusionPoints[index].arg, index + " argument");
        assert.strictEqual(pointData.value, fusionPoints[index].val, index + " value");
    }
}

var createSeries = function(options, renderSettings) {
    renderSettings = renderSettings || {};
    var renderer = renderSettings.renderer = renderSettings.renderer || new vizMocks.Renderer();

    options = $.extend(true, {
        widgetType: "chart",
        containerBackgroundColor: "containerColor",
        type: "scatter",
        argumentField: "arg",
        valueField: "val",
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
        hoverStyle: {},
        selectionStyle: {},
        reduction: {},
        hoverMode: "excludePoints",
        selectionMode: "excludePoints"
    }, options);

    renderSettings = $.extend({
        labelsGroup: renderer.g(),
        seriesGroup: renderer.g(),
    }, renderSettings);

    return new Series(renderSettings, options);
};

QUnit.module("One Value. Fusion function.", {
    beforeEach: function() {
        insertMockFactory();
        this.renderer = new vizMocks.Renderer();
        this.translator = new MockTranslator({
            translateX: { "First": 10, "Second": 20, "Third": 30, "Fourth": 40, "canvas_position_default": "defaultX" },
            translateY: { 1: 100, 2: 200, 3: 300, 4: 400, "canvas_position_default": "defaultY" },
            getCanvasVisibleArea: { minX: 0, maxX: 700, minY: 0, maxY: 500 },

        });
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            return { argument: data.argument, value: data.value, series: series };
        });
        this.series = createSeries({});
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("Fusion three  points", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, { value: 1 }), this.createPoint(this.series, { value: 2 }), this.createPoint(this.series, { value: 3 })];
    this.createPoint.reset();

    //act
    result = this.series._fusionPoints(points, tick);

    assert.ok(result);
    assert.equal(result.argument, tick);
    assert.equal(result.value, 2);
});

QUnit.test("Fusion two  points", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, { value: 1 }), this.createPoint(this.series, { value: 2 })];
    this.createPoint.reset();

    //act
    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.equal(result.value, 2);
});

QUnit.test("Fusion many points", function(assert) {
    var result,
        tick = 4,
        points = [this.createPoint(this.series, { value: 2 }), this.createPoint(this.series, { value: 2 }), this.createPoint(this.series, { value: 100 }), this.createPoint(this.series, { value: 2 }),
            this.createPoint(this.series, { value: 2 }), this.createPoint(this.series, { value: 4 })];
    this.createPoint.reset();

    //act
    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.equal(result.value, 2);
});

QUnit.test("Fusion many points. With null ", function(assert) {
    var result,
        tick = 3,
        points = [this.createPoint(this.series, { value: 2 }), this.createPoint(this.series, { value: null }), this.createPoint(this.series, { value: null }), this.createPoint(this.series, { value: 2 }),
            this.createPoint(this.series, { value: null }), this.createPoint(this.series, { value: 4 })];
    this.createPoint.reset();

    //act
    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.equal(result.value, 2);
});

QUnit.test("Fusion many points. Only null ", function(assert) {
    var result,
        tick = 2,
        points = [this.createPoint(this.series, { value: null }), this.createPoint(this.series, { value: null }), this.createPoint(this.series, { value: null }), this.createPoint(this.series, { value: null })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, null);
});

QUnit.test("Fusion many points. Result zero", function(assert) {
    var result,
        tick = 2,
        points = [this.createPoint(this.series, { value: -1 }), this.createPoint(this.series, { value: 1 }), this.createPoint(this.series, { value: null }), this.createPoint(this.series, { value: 0 })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 0);
});

QUnit.module("RangeValue. Fusion function", {
    beforeEach: function() {
        insertMockFactory();
        this.renderer = new vizMocks.Renderer();
        this.translator = new MockTranslator({
            translateX: { "First": 10, "Second": 20, "Third": 30, "Fourth": 40, "canvas_position_default": "defaultX" },
            translateY: { 1: 100, 2: 200, 3: 300, 4: 400, "canvas_position_default": "defaultY" },
            getCanvasVisibleArea: { minX: 0, maxX: 700, minY: 0, maxY: 500 },

        });
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            return { argument: data.argument, value: data.value, minValue: data.minValue, series: series };
        });
        this.series = createSeries({
            type: "rangearea"
        });
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("Fusion three points.", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, { minValue: 1, value: 10 }), this.createPoint(this.series, { minValue: 2, value: 20 }), this.createPoint(this.series, { minValue: 3, value: 30 })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 20);
    assert.strictEqual(result.minValue, 2);
    assert.strictEqual(result.tag, null);

});

QUnit.test("Fusion two  points.", function(assert) {
    var result,
        tick = 3,
        points = [this.createPoint(this.series, { minValue: 1, value: 10 }), this.createPoint(this.series, { minValue: 2, value: 20 })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 20);
    assert.strictEqual(result.minValue, 2);
    assert.strictEqual(result.tag, null);
});

QUnit.test("Fusion many  points.", function(assert) {
    var result,
        tick = 2,
        points = [this.createPoint(this.series, { minValue: 1, value: 10 }), this.createPoint(this.series, { minValue: 2, value: 20 }), this.createPoint(this.series, { minValue: 100, value: 1000 }),
            this.createPoint(this.series, { minValue: 2, value: 20 }), this.createPoint(this.series, { minValue: 2, value: 20 }), this.createPoint(this.series, { minValue: 4, value: 40 })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 20);
    assert.strictEqual(result.minValue, 2);
    assert.strictEqual(result.tag, null);
});

QUnit.test("Fusion many  points. With null", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, { minValue: null, value: 10 }), this.createPoint(this.series, { minValue: 2, value: null }), this.createPoint(this.series, { minValue: 100, value: 1000 }),
            this.createPoint(this.series, { minValue: 2, value: 20 }), this.createPoint(this.series, { minValue: 2, value: null }), this.createPoint(this.series, { minValue: 4, value: null })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 20);
    assert.strictEqual(result.minValue, 2);
    assert.strictEqual(result.tag, null);
});

QUnit.test("Fusion many  points. Only null", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, { minValue: null, value: null }), this.createPoint(this.series, { minValue: null, value: null }), this.createPoint(this.series, { minValue: null, value: null }),
            this.createPoint(this.series, { minValue: null, value: null }), this.createPoint(this.series, { minValue: null, value: null }), this.createPoint(this.series, { minValue: null, value: null })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.minValue, null);
    assert.strictEqual(result.tag, null);
});

QUnit.test("Fusion many  points. Skip Value", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, { minValue: 32, value: null }), this.createPoint(this.series, { minValue: 6, value: null }), this.createPoint(this.series, { minValue: 3, value: null }),
            this.createPoint(this.series, { minValue: 2, value: null }), this.createPoint(this.series, { minValue: 1, value: null }), this.createPoint(this.series, { minValue: 12, value: null })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.minValue, null);
    assert.strictEqual(result.tag, null);
});

QUnit.test("Fusion many  points. Skip min Value", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, { minValue: null, value: 3 }), this.createPoint(this.series, { minValue: null, value: 4 }), this.createPoint(this.series, { minValue: null, value: 6 }),
            this.createPoint(this.series, { minValue: null, value: 1 }), this.createPoint(this.series, { minValue: null, value: 3 }), this.createPoint(this.series, { minValue: null, value: 14 })];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, null);
    assert.strictEqual(result.minValue, null);
    assert.strictEqual(result.tag, null);
});

QUnit.module("Bubble. Fusion function", {
    beforeEach: function() {
        insertMockFactory();
        this.renderer = new vizMocks.Renderer();
        this.translator = new MockTranslator({
            translateX: { "First": 10, "Second": 20, "Third": 30, "Fourth": 40, "canvas_position_default": "defaultX" },
            translateY: { 1: 100, 2: 200, 3: 300, 4: 400, "canvas_position_default": "defaultY" },
            getCanvasVisibleArea: { minX: 0, maxX: 700, minY: 0, maxY: 500 },

        });
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            return { argument: data.argument, value: data.value, size: data.size, series: series };
        });
        this.series = createSeries({
            type: "bubble"
        });
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("fusion two points", function(assert) {
    var points = [this.createPoint(this.series, { argument: 15, value: 6, size: 7 }), this.createPoint(this.series, { argument: 30, value: 10, size: 4 })],
        tick = 4,
        result;

    this.createPoint.reset();
    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 10);
    assert.strictEqual(result.size, 7);
    assert.strictEqual(result.tag, null);
});

QUnit.test("fusion three points", function(assert) {
    var points = [this.createPoint(this.series, { argument: 15, value: 6, size: 7 }), this.createPoint(this.series, { argument: 15, value: 6, size: 12 }), this.createPoint(this.series, { argument: 30, value: 3, size: 4 })],
        tick = 4,
        result;
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 6);
    assert.strictEqual(result.size, 7);
    assert.strictEqual(result.tag, null);
});

QUnit.test("fusion many points", function(assert) {
    var points = [this.createPoint(this.series, { argument: 15, value: 6, size: 7 }), this.createPoint(this.series, { argument: 2, value: 10, size: 17 }), this.createPoint(this.series, { argument: 15, value: 6, size: 12 }), this.createPoint(this.series, { argument: 30, value: 3, size: 4 })],
        tick = 4,
        result;
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, tick);
    assert.strictEqual(result.value, 6);
    assert.strictEqual(result.size, 12);
    assert.strictEqual(result.tag, null);
});

QUnit.module("Finance. Fusion function.", {
    beforeEach: function() {
        insertMockFactory();
        this.renderer = new vizMocks.Renderer();
        this.translator = new MockTranslator({
            translateX: { "First": 10, "Second": 20, "Third": 30, "Fourth": 40, "canvas_position_default": "defaultX" },
            translateY: { 1: 100, 2: 200, 3: 300, 4: 400, "canvas_position_default": "defaultY" },
            getCanvasVisibleArea: { minX: 0, maxX: 700, minY: 0, maxY: 500 },

        });
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            var stub = sinon.createStubInstance(originalPoint);
            stub.hasValue.returns(true);
            stub.openValue = data.openValue;
            stub.closeValue = data.closeValue;
            stub.highValue = data.highValue;
            stub.lowValue = data.lowValue;
            stub.argument = data.argument;
            return stub;
        });
        this.series = createSeries({
            type: "stock"
        });
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("Fusion two points", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, {
            openValue: 1000,
            closeValue: 2000,
            highValue: 4000,
            lowValue: 500,
            _isFinancial: true
        }),
            this.createPoint(this.series, {
                openValue: 1000,
                closeValue: 5000,
                highValue: 7000,
                lowValue: 700,
                _isFinancial: true
            })],
        fusionPointOptions = {
            argument: tick,
            openValue: 1000,
            closeValue: 5000,
            highValue: 7000,
            lowValue: 500,
            reductionValue: 7000
        };
    this.createPoint.reset();
    this.series.level = "high";

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
    assert.strictEqual(result.tag, null);
});

QUnit.test("Fusion two points & ending null points", function(assert) {
    var result,
        tick = 1,
        points = [this.createPoint(this.series, {
            openValue: 1000,
            closeValue: 2000,
            highValue: 4000,
            lowValue: 500,
            _isFinancial: true
        }), this.createPoint(this.series,
            {
                openValue: 1000,
                closeValue: 5000,
                highValue: 7000,
                lowValue: 700,
                _isFinancial: true
            }), this.createPoint(this.series,
                {
                    openValue: null,
                    closeValue: null,
                    highValue: null,
                    lowValue: null,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            openValue: 1000,
            closeValue: 5000,
            highValue: 7000,
            lowValue: 500,
            options: {},
            reductionValue: 500,
            argument: tick
        };
    points[2].hasValue.returns(false);
    this.createPoint.reset();

    this.series.level = "low";

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
});

QUnit.test("Fusion two points & beginning null points", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series,
                {
                    openValue: null,
                    closeValue: null,
                    highValue: null,
                    lowValue: null,
                    _isFinancial: true
                }),
            this.createPoint(this.series, {
                openValue: 1000,
                closeValue: 2000,
                highValue: 4000,
                lowValue: 500,
                _isFinancial: true
            }), this.createPoint(this.series,
                {
                    openValue: 1000,
                    closeValue: 5000,
                    highValue: 7000,
                    lowValue: 700,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            argument: tick,
            openValue: 1000,
            closeValue: 5000,
            highValue: 7000,
            lowValue: 500,
            options: {},
            reductionValue: 5000
        };
    this.createPoint.reset();
    points[0].hasValue.returns(false);

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
});

QUnit.test("Fusion two points & centre null points", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series, {
                openValue: 1000,
                closeValue: 2000,
                highValue: 4000,
                lowValue: 500,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: null,
                    closeValue: null,
                    highValue: null,
                    lowValue: null,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: 1000,
                    closeValue: 5000,
                    highValue: 7000,
                    lowValue: 700,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            argument: tick,
            openValue: 1000,
            closeValue: 5000,
            highValue: 7000,
            lowValue: 500,
            reductionValue: 5000
        };
    this.createPoint.reset();
    points[1].hasValue.returns(false);

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
});

QUnit.test("Fusion two points & centre null points", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series, {
                openValue: null,
                closeValue: null,
                highValue: null,
                lowValue: null,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: null,
                    closeValue: null,
                    highValue: null,
                    lowValue: null,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: null,
                    closeValue: null,
                    highValue: 3000,
                    lowValue: 4000,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            argument: tick,
            openValue: null,
            closeValue: null,
            highValue: 3000,
            lowValue: 4000,
            reductionValue: null
        };
    this.createPoint.reset();

    points[0].hasValue.returns(false);
    points[1].hasValue.returns(false);

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
});

QUnit.test("Fusion points, openValue in the first point is null", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series, {
                openValue: null,
                closeValue: 2000,
                highValue: 3000,
                lowValue: 700,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: 2000,
                    closeValue: 3000,
                    highValue: 4000,
                    lowValue: 1000,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: 700,
                    closeValue: 888,
                    highValue: 3000,
                    lowValue: 4000,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            argument: tick,
            openValue: null,
            closeValue: 888,
            highValue: 4000,
            lowValue: 700,
            reductionValue: 888
        };
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
    assert.strictEqual(result.isReduction, false);
});

QUnit.test("Set point reduction false", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series, {
                openValue: null,
                closeValue: 2000,
                highValue: 3000,
                lowValue: 700,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: 2000,
                    closeValue: 3000,
                    highValue: 4000,
                    lowValue: 1000,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: 700,
                    closeValue: 888,
                    highValue: 3000,
                    lowValue: 4000,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            argument: tick,
            openValue: null,
            closeValue: 888,
            highValue: 4000,
            lowValue: 700,
            reductionValue: 888
        };
    this.createPoint.reset();

    this.series._fusionPoints(points, tick);

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
    assert.strictEqual(result.isReduction, false);
});

QUnit.test("Set point reduction true", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series, {
                openValue: null,
                closeValue: 2000,
                highValue: 3000,
                lowValue: 700,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: 2000,
                    closeValue: 3000,
                    highValue: 4000,
                    lowValue: 1000,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: 700,
                    closeValue: 888,
                    highValue: 3000,
                    lowValue: 4000,
                    _isFinancial: true
                })],
        points1 = [
            this.createPoint(this.series, {
                openValue: null,
                closeValue: 2000,
                highValue: 3000,
                lowValue: 700,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: 2000,
                    closeValue: 3000,
                    highValue: 4000,
                    lowValue: 1000,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: 700,
                    closeValue: 340,
                    highValue: 3000,
                    lowValue: 4000,
                    _isFinancial: true
                })];
    this.createPoint.reset();

    this.series._fusionPoints(points, tick);

    result = this.series._fusionPoints(points1, tick);

    assert.ok(result);
    assert.strictEqual(result.isReduction, true);


});

QUnit.test("Fusion points, closeValue in the last point is null", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series, {
                openValue: 500,
                closeValue: 5000,
                highValue: 3000,
                lowValue: 700,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: 2000,
                    closeValue: 3000,
                    highValue: 4000,
                    lowValue: 1000,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: 700,
                    closeValue: null,
                    highValue: 3000,
                    lowValue: 4000,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            argument: tick,
            openValue: 500,
            closeValue: null,
            highValue: 4000,
            lowValue: 700,
            reductionValue: null
        };
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
});

QUnit.test("Fusion points, openValue in 1-st point and closeValue in last point undefined", function(assert) {
    var result,
        tick = 1,
        points = [
            this.createPoint(this.series, {
                openValue: undefined,
                closeValue: 5000,
                highValue: 3000,
                lowValue: 700,
                _isFinancial: true
            }),
            this.createPoint(this.series,
                {
                    openValue: 2000,
                    closeValue: 3000,
                    highValue: 4000,
                    lowValue: 1000,
                    _isFinancial: true
                }),
            this.createPoint(this.series,
                {
                    openValue: 700,
                    closeValue: undefined,
                    highValue: 3000,
                    lowValue: 4000,
                    _isFinancial: true
                })],
        fusionPointOptions = {
            argument: tick,
            openValue: 2000,
            closeValue: 3000,
            highValue: 4000,
            lowValue: 700,
            reductionValue: 3000
        };
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.equal(result.argument, fusionPointOptions.argument);
    assert.strictEqual(result.openValue, fusionPointOptions.openValue);
    assert.strictEqual(result.closeValue, fusionPointOptions.closeValue);
    assert.strictEqual(result.highValue, fusionPointOptions.highValue);
    assert.strictEqual(result.lowValue, fusionPointOptions.lowValue);
    assert.strictEqual(result.reductionValue, fusionPointOptions.reductionValue);
});

QUnit.test("Fusion points, point empty array", function(assert) {
    var result,
        tick = 1,
        points = [];
    this.createPoint.reset();

    result = this.series._fusionPoints(points, tick);

    assert.ok(result);

    assert.deepEqual(result, {});
});


QUnit.module("Sampler points", {
    beforeEach: function() {
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            return { argument: data.argument, value: data.value, series: series, setInvisibility: sinon.stub(), hasValue: sinon.stub().returns(true), updateOptions: sinon.spy() };
        });

        this.getTranslator = function(min, max, start, end) {
            var translator = new MockTranslator({
                minVisible: min,
                maxVisible: max
            });
            translator.canvasLength = end - start;
            return translator;
        };

        this.series = createSeries({});
        this.createFusionPoints = function(options, datetime) {
            var argumentOptions = options.argument,
                valueOptions = options.values,
                i,
                points = [],
                point;

            function handleValueOption(_, _options) {
                point.val = _options.startValue + _options.interval * i;
            }

            for(i = argumentOptions.startValue; i < argumentOptions.endValue; i += argumentOptions.interval) {
                point = {};
                point.arg = datetime ? new Date(i) : i;
                $.each(valueOptions, handleValueOption);
                points.push(point);
            }
            return points;
        };
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("T382881, Series is not sorted", function(assert) {
    var points = [
            { arg: 10, val: 2 },
            { arg: 9, val: 10 },
            { arg: 1, val: 5 },
            { arg: 2, val: 8 },
            { arg: 3, val: 9 },
            { arg: 7, val: 22 },
            { arg: 8, val: 12 },
            { arg: 4, val: 18 },
            { arg: 5, val: 21 },
            { arg: 6, val: 10 }
        ],
        fusionPoints = [
            { arg: 10, val: 10 },
            { arg: 1, val: 8 },
            { arg: 3, val: 9 },
            { arg: 7, val: 22 },
            { arg: 4, val: 21 },
            { arg: 6, val: 10 }
        ];

    this.series.updateData(points);
    //Act
    this.series.resamplePoints(this.getTranslator(1, 10, 0, 10));

    //Assert
    checkResult(assert, this.series.getPoints(), fusionPoints, 6);
});

QUnit.test("10 points -> 5 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 2
            },
            values: [{
                startValue: 200,
                interval: 100
            }]
        },
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    this.series.updateData(this.createFusionPoints(options));
    var spy = sinon.spy(this.series, "_endUpdateData");

    this.series.resamplePoints(this.getTranslator(0, 9, 0, 10));

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
    assert.ok(spy.calledOnce);
});

QUnit.test("10 points -> 10 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 200,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options);

    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(0, 9, 0, 20));

    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("9 points -> 5 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 9,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 8,
                interval: 2
            },
            values: [{
                startValue: 200,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    fusionPoints[4] = { arg: points[8].arg, val: points[8].val };

    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(0, 8, 0, 10));

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("20 points -> 4 points. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 20,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 20,
                interval: 2
            },
            values: [{
                startValue: 200,
                interval: 100
            }]
        },
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    this.series.updateData(this.createFusionPoints(options)),
    this.series.resamplePoints(this.getTranslator(0, 19, 0, 20));

    checkResult(assert, this.series.getPoints(), fusionPoints, 10);
});

QUnit.test("7 points -> 3 points. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 7,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 0,
                endValue: 7,
                interval: 2
            },
            values: [{
                startValue: 200,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    fusionPoints[3] = { arg: points[6].arg, val: points[6].val };

    this.series.updateData(this.createFusionPoints(options)),
    this.series.resamplePoints(this.getTranslator(0, 6, 0, 10));

    checkResult(assert, this.series.getPoints(), fusionPoints, 4);
});

QUnit.test("9 points -> 9 points. Skip point in centre. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        fusionPoints = [],
        points = this.createFusionPoints(options);

    points.splice(3, 1);
    $.each(points, function(index, point) {
        fusionPoints.push({ arg: point.arg, val: point.val });
    });

    this.series.updateData(points),
    this.series.resamplePoints(this.getTranslator(0, 9, 0, 20));

    checkResult(assert, this.series.getPoints(), fusionPoints, 9);
});

QUnit.test("10 points -> 3 points. CustomTick", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 15,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        fusionPoints = [{ arg: 0, val: 200 },
            { arg: 6, val: 800 },
            { arg: 11, val: 1400 }
        ],
        points = this.createFusionPoints(options);
    points.splice(3, 3);
    points.splice(6, 2);

    this.series.updateData(points),
    this.series.resamplePoints(this.getTranslator(0, 14, 0, 9));

    checkResult(assert, this.series.getPoints(), fusionPoints, 3);
});

QUnit.test("10 points -> 10 points. All points. Datetime", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 24 * 60 * 60 * 1000 * 10,
                interval: 24 * 60 * 60 * 1000
            },
            values: [{
                startValue: 0,
                interval: 0
            }]
        },
        fusionPoints = [],

        points = this.createFusionPoints(options, true);

    $.each(points, function(index, point) {
        fusionPoints.push({ arg: point.arg, val: point.val });
    });

    this.series.updateData(points),
    this.series.resamplePoints(this.getTranslator(0, 24 * 60 * 60 * 1000 * 9, 0, 20));

    checkResult(assert, this.series.getPoints(), fusionPoints, 10);
});

QUnit.test("Customize Point without result", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        customizePointSpy = sinon.stub(),
        customizeLabelSpy = sinon.stub(),
        series = createSeries({
            type: "scatter",
            point: {
                size: 0,
                border: {
                    width: 0
                },
                hoverStyle: {
                    size: 0,
                    border: {
                        width: 0
                    }
                },
                selectionStyle: {
                    size: 0,
                    border: {
                        width: 0
                    }
                }
            },
            customizePoint: customizePointSpy,
            customizeLabel: customizeLabelSpy,
            name: "name"
        });
    series.updateData(this.createFusionPoints(options));
    this.createPoint.reset();

    series.resamplePoints(this.getTranslator(0, 9, 0, 10));

    assert.equal(this.createPoint.callCount, 5, "points");
    assert.deepEqual(this.createPoint.getCall(0).args[2].styles, {
        "hover": {
            "r": 0,
            "fill": "containerColor",
            "stroke-width": 0
        },
        "normal": {
            "r": 0,
            "stroke-width": 0,
            opacity: undefined
        },
        "selection": {
            "r": 0,
            "fill": "containerColor",
            "stroke-width": 0
        }
    });

    assert.deepEqual(this.createPoint.getCall(0).args[2].label, {
        "attributes": {
            "font": {}
        },
        "background": {
            "stroke": "none",
            "stroke-width": 0
        },
        "connector": {
            "stroke": "none",
            "stroke-width": 0
        },
        "visible": true
    });

    assert.strictEqual(series.getPoints()[0].updateOptions.callCount, 0);

    assert.ok(customizePointSpy.callCount, this.createPoint.callCount);
    assert.deepEqual(customizePointSpy.lastCall.args, [{
        seriesName: "name",
        argument: this.createPoint.lastCall.args[1].argument,
        value: this.createPoint.lastCall.args[1].value,
        index: 4,
        tag: null,
        series: series
    }]);
});

QUnit.test("Customize Point with result", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        customizePointSpy = sinon.stub(),
        customizeLabelSpy = sinon.stub(),
        series = createSeries({
            type: "scatter",
            point: {
                size: 0,
                border: {
                    width: 0
                },
                hoverStyle: {
                    size: 0,
                    border: {
                        width: 0
                    }
                },
                selectionStyle: {
                    size: 0,
                    border: {
                        width: 0
                    }
                }
            },
            customizePoint: customizePointSpy,
            customizeLabel: customizeLabelSpy,
            name: "name"
        });
    series.updateData(this.createFusionPoints(options));
    this.createPoint.reset();

    customizePointSpy.returns({ color: "customColor" });
    customizeLabelSpy.returns({ font: { size: "customSize" } });

    series.resamplePoints(this.getTranslator(0, 9, 0, 10));

    assert.equal(this.createPoint.callCount, 5);

    assert.deepEqual(series.getPoints()[0].updateOptions.lastCall.args[0].styles, {
        "usePointCustomOptions": true,
        "useLabelCustomOptions": true,
        "hover": {
            "fill": "containerColor",
            "stroke": "customColor",
            "stroke-width": 0,
            "r": 0
        },
        "normal": {
            "fill": "customColor",
            "stroke": "customColor",
            "stroke-width": 0,
            "visibility": "hidden",
            "r": 0
        },
        "selection": {
            "fill": "containerColor",
            "stroke": "customColor",
            "stroke-width": 0,
            "r": 0
        }
    });

    assert.deepEqual(series.getPoints()[0].updateOptions.lastCall.args[0].label, {
        "argumentFormat": undefined,
        "argumentPrecision": undefined,
        "attributes": {
            "font": {
                "color": undefined,
                "size": "customSize"
            }
        },
        "background": {
            "dashStyle": undefined,
            "fill": "customColor",
            "stroke": "none",
            "stroke-width": 0
        },
        "connector": {
            "stroke": "none",
            "stroke-width": 0
        },
        "customizeText": undefined,
        "format": undefined,
        "horizontalOffset": undefined,
        "percentPrecision": undefined,
        "position": undefined,
        "precision": undefined,
        "radialOffset": undefined,
        "rotationAngle": undefined,
        "showForZeroValues": undefined,
        "verticalOffset": undefined,
        "visible": true,
        "alignment": undefined,
    });

    assert.ok(customizePointSpy.callCount, this.createPoint.callCount);
    assert.deepEqual(customizePointSpy.lastCall.args, [{
        seriesName: "name",
        argument: this.createPoint.lastCall.args[1].argument,
        value: this.createPoint.lastCall.args[1].value,
        index: 4,
        tag: null,
        series: series
    }]);
});

//T172772
QUnit.test("Aggregation one point", function(assert) {
    var options = {
        argument: {
            startValue: 9,
            endValue: 10,
            interval: 1
        },
        values: [{
            startValue: 100,
            interval: 100
        }]
    };

    this.series.updateData(this.createFusionPoints(options));
    this.series.resamplePoints(this.getTranslator(0, 9, 0, 20));

    assert.deepEqual(this.series.getPoints(), this.series.getAllPoints());
});

QUnit.test("After zooming", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 100,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 1
            }]
        },
        fusionPoints = [{ arg: 0, val: 100 },
        { arg: 39, val: 142 },
        { arg: 45, val: 148 },
        { arg: 51, val: 154 },
        { arg: 57, val: 160 },
        { arg: 63, val: 166 },
        { arg: 69, val: 172 },
        { arg: 75, val: 178 },
        { arg: 81, val: 184 },
        { arg: 87, val: 187 }];

    this.series.updateData(this.createFusionPoints(options));
    this.series.resamplePoints(this.getTranslator(45, 75, 0, 10), 45, 75);

    checkResult(assert, this.series.getPoints(), fusionPoints, 10);
});

QUnit.test("After zooming, series is not sorting", function(assert) {
    var points = [{ arg: 9, val: 100 },
        { arg: 8, val: 200 },
        { arg: 0, val: 200 },
        { arg: 1, val: 300 },
        { arg: 2, val: 400 },
        { arg: 3, val: 500 },
        { arg: 4, val: 600 },
        { arg: 10, val: 700 },
        { arg: 7, val: 200 },
        { arg: 5, val: 800 },
        { arg: 6, val: 300 }],

        fusionPoints = [{ arg: 9, val: 100 },
        { arg: 0, val: 200 },
        { arg: 2, val: 400 },
        { arg: 3, val: 500 },
        { arg: 4, val: 600 },
        { arg: 10, val: 700 },
        { arg: 7, val: 200 },
        { arg: 5, val: 800 },
        { arg: 6, val: 300 }];

    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(3, 6, 0, 6), 3, 6);

    checkResult(assert, this.series.getPoints(), fusionPoints, 9);
});

QUnit.test("T370495, Series starts from the middle of the x-axis, 10 -> 3 points", function(assert) {
    var options = {
            argument: {
                startValue: 5,
                endValue: 10,
                interval: 0.5
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        optionsFusionPoints = {
            argument: {
                startValue: 5,
                endValue: 10,
                interval: 2
            },
            values: [{
                startValue: 200,
                interval: 100
            }]
        },
        fusionPoints = this.createFusionPoints(optionsFusionPoints);

    fusionPoints[2].val = 1050;

    this.series.updateData(this.createFusionPoints(options));
    this.series.resamplePoints(this.getTranslator(0, 9, 0, 10));

    checkResult(assert, this.series.getPoints(), fusionPoints, 3);
});

QUnit.module("Sampler points, discrete", {
    beforeEach: function() {
        this.createPoint = sinon.stub(pointModule, "Point", function(series, data, options) {
            return { argument: data.argument, value: data.value, setInvisibility: sinon.spy(), series: series, hasValue: sinon.stub() };
        });

        this.getTranslator = function(min, max, start, end, categories) {
            var translator = new MockTranslator({
                minVisible: min,
                maxVisible: max,
                categories: categories
            });
            translator.canvasLength = end - start;
            return translator;
        };
        this.series = createSeries({});
        this.series.updateDataType({ argumentAxisType: "discrete" });
        this.createFusionPoints = function(options, datetime) {
            var argumentOptions = options.argument,
                valueOptions = options.values,
                i,
                points = [],
                point;

            function handleValueOption(_, _options) {
                point.val = _options.startValue + _options.interval * i;
            }

            for(i = argumentOptions.startValue; i < argumentOptions.endValue; i += argumentOptions.interval) {
                point = {};
                point.arg = datetime ? new Date(i) : i;
                $.each(valueOptions, handleValueOption);
                points.push(point);
            }
            return points;
        };
    },

    afterEach: function() {
        this.createPoint.restore();
    }
});

QUnit.test("T382881, Series is not sorted", function(assert) {
    var points = [
            { arg: 9, val: 3 },
            { arg: 10, val: 2 },
            { arg: 1, val: 1 },
            { arg: 2, val: 4 },
            { arg: 3, val: 5 },
            { arg: 7, val: 6 },
            { arg: 8, val: 3 },
            { arg: 4, val: 4 },
            { arg: 5, val: 1 },
            { arg: 6, val: 8 }],
        fusionPoints = [{ arg: 9, val: 3 },
            { arg: 1, val: 1 },
            { arg: 3, val: 5 },
            { arg: 8, val: 3 },
            { arg: 5, val: 1 }],
        categories = $.map(points, function(item) { return item.arg; });

    this.series.updateData(points);
    //Act
    this.series.resamplePoints(this.getTranslator(1, 10, 0, 10, categories));

    //Assert
    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("10 points -> 5 points. All points", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = $.map(points, function(point, index) {
            if(index % 2 === 0) {
                return { arg: point.arg, val: point.val };
            }
        }),
        categories = $.map(points, function(item) { return item.arg; });
    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(0, 9, 0, 10, categories));

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("10 points -> 5 points. Check Invisibility", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        categories = $.map(points, function(item) { return item.arg; });
    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(0, 9, 0, 10, categories));

    $.each(this.series.getAllPoints(), function(index, point) {
        if((index % 2)) {
            assert.ok(point.setInvisibility.calledOnce);
        } else {
            assert.ok(!point.setInvisibility.called);
        }
    });
});

QUnit.test("10 points -> 5 points. All points. ValueAxisType = discrete", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        fusionPoints = $.map(points, function(point, index) {
            if(index % 2 === 0) {
                return { arg: point.arg, val: point.val };
            }
        });
    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(0, 9, 0, 10));

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("10 points -> 5 points. ValueAxisType = discrete, interval 2", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 20,
                interval: 2
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options, true),
        fusionPoints = $.map(points, function(point, index) {
            if(index % 2 === 0) {
                return { arg: point.arg, val: point.val };
            }
        });
    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(0, 19, 0, 10));

    checkResult(assert, this.series.getPoints(), fusionPoints, 5);
});

QUnit.test("10 points -> 10 points.", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options, true),
        categories = $.map(points, function(item) { return item.arg; }),
        translator = this.getTranslator(0, 9, 0, 20, categories);

    translator.canvasLength = 20;
    this.series.updateData(points);
    this.series.resamplePoints(translator);

    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("10 points -> 10 points. ValueAxisType = discrete", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options);

    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);

    this.series.resamplePoints(this.getTranslator(0, 9, 0, 20));
    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("After zooming", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        categories = $.map(points, function(item) { return item.arg; });

    this.series.updateData(points);
    this.series.resamplePoints(this.getTranslator(3, 6, 0, 10, categories), 3, 6);

    checkResult(assert, this.series.getPoints(), points, 10);
});

QUnit.test("After zooming, value axis is discrete", function(assert) {
    var options = {
            argument: {
                startValue: 0,
                endValue: 10,
                interval: 1
            },
            values: [{
                startValue: 100,
                interval: 100
            }]
        },
        points = this.createFusionPoints(options),
        categories = $.map(points, function(item) { return item.arg; });

    this.series.updateDataType({
        valueAxisType: "discrete"
    });
    this.series.updateData(points);

    this.series.resamplePoints(this.getTranslator(3, 6, 0, 20, categories), 3, 6);
    checkResult(assert, this.series.getPoints(), points, 10);
});
