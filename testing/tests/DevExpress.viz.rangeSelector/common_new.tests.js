"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    rendererModule = require("viz/core/renderers/renderer"),
    axisModule = require("viz/axes/base_axis"),
    StubAxis = vizMocks.stubClass(axisModule.Axis);

require("viz/range_selector/range_selector");

QUnit.testStart(function() {
    var markup =
        '<div id="test-container" style="width: 400px; height: 300px;"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("RangeSelector", {
    beforeEach: function() {
        this.$container = $("#test-container");
        var renderer = this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = function() { return renderer; };
    },
    afterEach: function() {
        this.$container.remove();
    }
});

// T347971
QUnit.test("Empty scale is drawn with compact height when 'dataSource' is defined and 'chart' is not", function(assert) {
    var axis = new StubAxis();
    sinon.stub(axisModule, "Axis", function() {
        return axis;
    });
    try {
        this.$container.dxRangeSelector({
            dataSource: []
        });

        var options = axis.updateOptions.lastCall.args[0];
        assert.strictEqual(options.tick.length, 12, "tick length");
        assert.strictEqual(options.minorTick.length, 12, "minor tick length");
    } finally {
        axisModule.Axis.restore();
    }
});

// T347971
QUnit.test("Empty scale is drawn with full height when 'dataSource' is not defined and 'chart' is", function(assert) {
    var axis = new StubAxis();
    sinon.stub(axisModule, "Axis", function() {
        return axis;
    });
    try {
        this.$container.dxRangeSelector({
            chart: {
                series: {}
            }
        });

        var options = axis.updateOptions.lastCall.args[0];
        assert.strictEqual(options.tick.length, 265, "tick length");
        assert.strictEqual(options.minorTick.length, 265, "minor tick length");
    } finally {
        axisModule.Axis.restore();
    }
});

// T347971
QUnit.test("There is no unexpected incident when 'chart.series' array is empty", function(assert) {
    var spy = sinon.spy();
    this.$container.dxRangeSelector({
        dataSource: [],
        chart: {
            series: []
        },
        onIncidentOccurred: spy
    });

    assert.strictEqual(spy.callCount, 0, "no incidents");
});

// T347293
QUnit.test("There is no error when 'dataSource' is an empty array and scale is discrete datetime", function(assert) {
    this.$container.dxRangeSelector({
        scale: {
            valueType: 'datetime',
            type: 'discrete'
        },
        dataSource: [],
        chart: {
            series: {}
        }
    });

    assert.deepEqual(this.$container.dxRangeSelector("instance").getValue(), [undefined, undefined]);
});

//DEPRECATED IN 17.1 START
QUnit.test("useTicksAutoArrangement is true", function(assert) {
    var axis = new StubAxis();
    sinon.stub(axisModule, "Axis", function() {
        return axis;
    });
    this.$container.dxRangeSelector({
        scale: {
            startValue: 0,
            endValue: 100,
            useTicksAutoArrangement: true
        }
    });
    assert.equal(axis.updateOptions.lastCall.args[0].label.overlappingBehavior.mode, "hide");
    axisModule.Axis.restore();
});

QUnit.test("useTicksAutoArrangement is false", function(assert) {
    var axis = new StubAxis();
    sinon.stub(axisModule, "Axis", function() {
        return axis;
    });
    this.$container.dxRangeSelector({
        scale: {
            startValue: 0,
            endValue: 100,
            useTicksAutoArrangement: false
        }
    });
    assert.equal(axis.updateOptions.lastCall.args[0].label.overlappingBehavior.mode, "none");
    axisModule.Axis.restore();
});
//DEPRECATED IN 17.1 END

QUnit.test("overlappingBehavior is set", function(assert) {
    var axis = new StubAxis();
    sinon.stub(axisModule, "Axis", function() {
        return axis;
    });
    this.$container.dxRangeSelector({
        scale: {
            startValue: 0,
            endValue: 100,
            label: { overlappingBehavior: "hide" }
        }
    });
    assert.equal(axis.updateOptions.lastCall.args[0].label.overlappingBehavior.mode, "hide");
    axisModule.Axis.restore();
});
