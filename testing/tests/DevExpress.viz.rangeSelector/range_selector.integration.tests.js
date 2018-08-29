import $ from "jquery";
import "viz/range_selector/range_selector";

QUnit.testStart(function() {
    var markup =
        '<div id="container" style="width: 300px; height: 150px"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Value", function(hook) {
    hook.beforeEach(function() {
        this.rangeSelector = $("#container").dxRangeSelector({
            scale: {
                startValue: 1,
                endValue: 11
            }
        }).dxRangeSelector("instance");
    });

    QUnit.test("value option on widget starting", function(assert) {
        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
    });

    QUnit.test('setValue', function(assert) {
        this.rangeSelector.setValue([5, 7]);
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
    });

    QUnit.test("Range when value is changed", function(assert) {
        this.rangeSelector.option("value", [3, 7]);

        assert.deepEqual(this.rangeSelector.getValue(), [3, 7]);
    });

    QUnit.test("Reset selected range", function(assert) {
        this.rangeSelector.option("value", [3, 5]);
        this.rangeSelector.setValue([]);
        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
    });

    QUnit.test("Reset selected range. incidentOccurred is not called", function(assert) {
        var incidentOccurred = sinon.spy();
        this.rangeSelector.option({ onIncidentOccurred: incidentOccurred });
        this.rangeSelector.setValue([]);

        assert.equal(incidentOccurred.callCount, 0);
    });

    QUnit.test("range when value and scale are changed", function(assert) {
        this.rangeSelector.option("value", [3, 7]);
        this.rangeSelector.option("scale", { startValue: 1, endValue: 11 });

        assert.deepEqual(this.rangeSelector.getValue(), [3, 7]);
    });

    QUnit.test("range after resize", function(assert) {
        this.rangeSelector.option("value", [3, 5]);
        this.rangeSelector.option("size", { width: 100, height: 300 });
        assert.deepEqual(this.rangeSelector.getValue(), [3, 5]);
    });

    QUnit.test("range on setValue and update scale, value option", function(assert) {
        this.rangeSelector.option({ value: [2, 3] });
        this.rangeSelector.setValue([4, 8]);
        this.rangeSelector.option({ scale: { startValue: 1, endValue: 10 } });

        assert.deepEqual(this.rangeSelector.getValue(), [4, 8]);
    });

    QUnit.test("refresh range after update data source", function(assert) {
        this.rangeSelector.option({ dataSource: [{ arg: 0 }, { arg: 30 }], scale: { startValue: null, endValue: null } });
        var value = this.rangeSelector.getValue();

        assert.roughEqual(value[0], 0, 1E-8);
        assert.roughEqual(value[1], 30, 1E-8);
    });

    QUnit.test("set range with dataSource", function(assert) {
        this.rangeSelector.option({
            dataSource: [{ arg: 0 }, { arg: 30 }],
            value: [5, 10]
        });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 10]);
    });

    QUnit.test("set one of the value", function(assert) {
        this.rangeSelector.option({
            value: [undefined, 10]
        });
        assert.deepEqual(this.rangeSelector.getValue(), [1, 10]);
    });

    QUnit.test("parse custom value option, invalid value", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            scale: {
                valueType: "numeric",
            },
            value: ["a", "b"],
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
        assert.equal(spy.callCount, 1);
        assert.deepEqual(spy.getCall(0).args[0].target.id, "E2203");
        assert.deepEqual(spy.getCall(0).args[0].target.text, "The range you are trying to set is invalid");
    });

    QUnit.test("parse custom value option, with dataSource, valid value", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: "numeric",
            },
            value: ["2", "5"],
            chart: {
                series: [
                    { argumentField: "x", valueField: "y1" },
                    { argumentField: "x", valueField: "y2" }
                ]
            },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getValue(), [2, 5]);
        assert.ok(!spy.called);
    });

    QUnit.test("parse custom value option, with dataSource, invalid value", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: "numeric",
            },
            value: ["a", "b"],
            chart: {
                series: [
                    { argumentField: "x", valueField: "y1" },
                    { argumentField: "x", valueField: "y2" }
                ]
            },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
        assert.equal(spy.callCount, 1);
        assert.deepEqual(spy.getCall(0).args[0].target.id, "E2203");
        assert.deepEqual(spy.getCall(0).args[0].target.text, "The range you are trying to set is invalid");
    });

    QUnit.test("Warnings rising on using setValue method", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            onIncidentOccurred: spy
        });

        this.rangeSelector.setValue([1, 12]);

        assert.strictEqual(spy.getCall(0).args[0].target.id, "E2203");
    });

    QUnit.test("Set value using visualRange object", function(assert) {
        this.rangeSelector.setValue({ startValue: 5, endValue: 7 });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
        assert.deepEqual(this.rangeSelector.option("value"), [5, 7]);
    });

    QUnit.test("Set value via option using visualRange object", function(assert) {
        this.rangeSelector.option("value", { startValue: 5, endValue: 7 });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
        assert.deepEqual(this.rangeSelector.option("value"), { startValue: 5, endValue: 7 });
    });

    QUnit.test("Change value when options is set by object", function(assert) {
        this.rangeSelector.option("value", { startValue: 5, endValue: 7 });
        this.rangeSelector.setValue([8, 9]);
        assert.deepEqual(this.rangeSelector.getValue(), [8, 9]);
        assert.deepEqual(this.rangeSelector.option("value"), { startValue: 8, endValue: 9 });
    });

    QUnit.test("Set value using visualRange only length field in visualRange object", function(assert) {
        this.rangeSelector.setValue({ length: 2 });
        assert.deepEqual(this.rangeSelector.getValue(), [9, 11]);
    });

    QUnit.test("Set value using visualRange object with start and length", function(assert) {
        this.rangeSelector.setValue({ startValue: 5, length: 2 });
        assert.deepEqual(this.rangeSelector.getValue(), [5, 7]);
    });

    QUnit.test("Set value using visualRange object with end and length", function(assert) {
        this.rangeSelector.setValue({ endValue: 5, length: 2 });
        assert.deepEqual(this.rangeSelector.getValue(), [3, 5]);
    });

    QUnit.test("Set value using visualRange object with start and length. datetime", function(assert) {
        this.rangeSelector.option({
            scale: {
                startValue: new Date(2018, 0, 1),
                endValue: new Date(2024, 0, 1)
            },
            value: { length: { years: 2 } }
        });
        assert.deepEqual(this.rangeSelector.getValue(), [new Date(2022, 0, 1), new Date(2024, 0, 1)]);
    });

    QUnit.test("Set value using visualRange only length field in visualRange object. logarithmic", function(assert) {
        this.rangeSelector.option({
            value: { length: 2 },
            scale: {
                type: "logarithmic",
                startValue: 100,
                endValue: 100000
            }
        });
        assert.deepEqual(this.rangeSelector.getValue(), [1000, 100000]);
    });

    QUnit.test("Set value using visualRange only length field in visualRange object. discrete", function(assert) {
        this.rangeSelector.option({
            value: { length: 2 },
            scale: {
                type: "discrete",
                categories: ["a", "b", "c", "d"]
            }
        });
        assert.deepEqual(this.rangeSelector.getValue(), ["c", "d"]);
    });
});

QUnit.module("T465345, onOptionChanged", function(hook) {
    hook.beforeEach(function() {
        this.optionChanged = sinon.spy();
        this.rangeSelector = $("#container").dxRangeSelector({
            onOptionChanged: this.optionChanged,
            scale: {
                startValue: 1,
                endValue: 11
            }
        }).dxRangeSelector("instance");
    });

    QUnit.test("Triggered when 'value' changed", function(assert) {
        this.rangeSelector.option("value", [5, 8]);

        assert.ok(this.optionChanged.called);
    });

    QUnit.test("Triggered when 'setValue' method was called", function(assert) {
        this.rangeSelector.setValue([5, 8]);

        assert.ok(this.optionChanged.called);
    });
});

QUnit.module("T413379, 'value' option", function(hook) {
    hook.beforeEach(function() {
        this.incidentOccurred = sinon.spy();
        this.rangeSelector = $("#container").dxRangeSelector({
            chart: {
                series: [{
                    argumentField: "arg",
                    valueField: "val"
                }]
            },
            dataSource: [{
                arg: 1,
                val: 1462
            }, {
                arg: 15,
                val: 1565
            }],
            scale: {
                endValue: 15,
                startValue: 1
            },
            value: [4, 5],
            onIncidentOccurred: this.incidentOccurred
        }).dxRangeSelector("instance");
    });

    QUnit.test("Reset value twice times without updating of the dataSource", function(assert) {
        this.rangeSelector.option({ value: [null, null], chart: { series: null } });
        this.rangeSelector.option({ value: [null, null], chart: { series: null } });

        assert.equal(this.incidentOccurred.callCount, 0);
    });

    QUnit.test("Reset value and dataSource", function(assert) {
        this.rangeSelector.option({ dataSource: null, value: [null, null], chart: { series: null } });
        this.rangeSelector.option({ dataSource: null, value: [null, null], chart: { series: null } });

        assert.equal(this.incidentOccurred.callCount, 0);
    });
});

QUnit.module("onValueChanged event", function(assert) {
    QUnit.test("Not triggered on widget creation", function(assert) {
        var called = false;
        $("#container").dxRangeSelector({
            scale: { startValue: 1, endValue: 9 },
            value: { startValue: 2, endValue: 3 },
            onValueChanged: function() {
                called = true;
            }
        });

        assert.strictEqual(called, false);
    });

    QUnit.test("Triggered on widget update after widget has been created with empty data", function(assert) {
        var count = 0;
        $("#container").dxRangeSelector({
            onValueChanged: function() {
                ++count;
            }
        });

        $("#container").dxRangeSelector({
            scale: { startValue: 1, endValue: 2 }
        });

        assert.strictEqual(count, 1);
    });


    QUnit.test("Triggered only once on axis' date marker click", function(assert) {
        var count = 0;
        $("#container").width(600).dxRangeSelector({
            scale: {
                startValue: new Date(2011, 1, 1),
                endValue: new Date(2011, 6, 1)
            },
            onValueChanged: function() {
                ++count;
            }
        });

        $("#container .dxrs-range-selector-elements path:nth-last-child(3)").trigger("dxpointerdown");

        assert.strictEqual(count, 1);
    });

    QUnit.test("Triggered with value and previousValue", function(assert) {
        var value, previousValue;
        $("#container").width(600).dxRangeSelector({
            scale: {
                startValue: 1,
                endValue: 11
            },
            onValueChanged: function(e) {
                value = e.value;
                previousValue = e.previousValue;
            }
        });

        $("#container").dxRangeSelector({
            value: [4, 5]
        });

        assert.deepEqual(value, [4, 5], "value");
        assert.deepEqual(previousValue, [1, 11], "previousValue");
    });

    QUnit.test("onValueChanged not raised on start when dataSource and value are used ", function(assert) {
        var eventHandler = sinon.stub();

        $("#container").dxRangeSelector({
            dataSource: [{ arg: 0 }, { arg: 30 }],
            value: [3, 10],
            onValueChanged: eventHandler,
            onOptionChanged: eventHandler
        });

        assert.strictEqual(eventHandler.callCount, 0);
    });
});

QUnit.module("Begin/end update functionality", function() {
    // T372059, T369460
    QUnit.test("Update is began during processing option change and ended some time after it", function(assert) {
        var widget = $("#container").dxRangeSelector().dxRangeSelector("instance");
        widget.option("onDrawn", function() {
            widget.option("onDrawn", null);     // Only event after "dataSource" update is required for test scenario.
            widget.beginUpdate();
        });
        widget.option("dataSource", [{ arg: 10, val: 1 }, { arg: 20, val: 2 }]);

        widget.option("value", [11, 12]);
        widget.endUpdate();

        assert.deepEqual(widget.getValue(), [11, 12]);
    });

    // "drawn" itself is not the point - the idea is that if during processing a change some option (whose corresponding change precedes the change
    // being processed) is changed then only that preceding change should be processed during next step.
    QUnit.test("Option changes are processed once when a preceding option is changed during processing succeeding option change", function(assert) {
        var widget = $("#container").dxRangeSelector().dxRangeSelector("instance"),
            count = 0;
        widget.on("drawn", function() {
            widget.option("theme", "generic.dark");
            ++count;
        });

        widget.option("scale", { startValue: 0, endValue: 10 });

        assert.strictEqual(count, 2, "one because of 'scale' and one because of 'theme'");
    });
});
