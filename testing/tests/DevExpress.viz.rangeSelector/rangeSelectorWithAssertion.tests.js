"use strict";

var $ = require("jquery"),
    errors = require("core/errors");

require("viz/range_selector/range_selector");

QUnit.testStart(function() {
    var markup =
        '<div id="container" style="width: 300px; height: 150px"></div>';

    $("#qunit-fixture").html(markup);
});

//DEPRECATED 16_2 start
QUnit.module("selectedRange", function(hook) {
    hook.beforeEach(function() {
        this.rangeSelector = $("#container").dxRangeSelector({
            scale: { startValue: 1, endValue: 11 }
        }).dxRangeSelector("instance");
    });

    QUnit.test("selectedRange on widget starting", function(assert) {
        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 1, endValue: 11 });
    });

    QUnit.test("setSelectedRange", function(assert) {
        this.rangeSelector.setSelectedRange({ startValue: 5, endValue: 7 });
        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 5, endValue: 7 });
    });

    QUnit.test("range when selectedRange is changed", function(assert) {
        this.rangeSelector.option("selectedRange", { startValue: 3, endValue: 7 });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 3, endValue: 7 });
    });

    QUnit.test("range when selectedRange and scale are changed", function(assert) {
        this.rangeSelector.option("selectedRange", { startValue: 3, endValue: 7 });
        this.rangeSelector.option("scale", { startValue: 1, endValue: 11 });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 3, endValue: 7 });
    });

    //B234562
    QUnit.test("range after resize", function(assert) {
        this.rangeSelector.option("selectedRange", { startValue: 4, endValue: 5 });
        this.rangeSelector.option("size", { width: 100, height: 300 });
        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 4, endValue: 5 });
    });

    //T173590
    QUnit.test("range with discrete data", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            scale: {
                categories: ["1q", "2q", "3q", "4q"]
            },
            selectedRange: { startValue: "2q", endValue: "3q" },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: "2q", endValue: "3q" });
        assert.strictEqual(spy.callCount, 0, "no incidents");
    });

    QUnit.test("range on setSelectedRange and update scale", function(assert) {
        this.rangeSelector.option({ selectedRange: { startValue: 2, endValue: 3 } });
        this.rangeSelector.setSelectedRange({ startValue: 4, endValue: 8 });
        this.rangeSelector.option({ scale: { startValue: 1, endValue: 10 } });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 4, endValue: 8 });
    });

    QUnit.test("Reset selected range", function(assert) {
        this.rangeSelector.option("selectedRange", { startValue: 3, endValue: 6 });
        this.rangeSelector.resetSelectedRange();
        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 1, endValue: 11 });
    });

    QUnit.test("parse custom selected range", function(assert) {
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: "numeric"
            },
            selectedRange: {
                startValue: "3",
                endValue: "5"
            },
            chart: {
                series: [
                    { argumentField: "x", valueField: "y1" },
                    { argumentField: "x", valueField: "y2" }
                ]
            }
        });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 3, endValue: 5 });
    });

    QUnit.test("parse custom selected range with invalid values", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            scale: {
                valueType: "numeric",
            },
            selectedRange: {
                startValue: "a",
                endValue: "b"
            },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 1, endValue: 11 });
        assert.deepEqual(spy.getCall(0).args[0].target.id, "E2203");
        assert.deepEqual(spy.getCall(0).args[0].target.text, "The range you are trying to set is invalid");
    });

    QUnit.test("parse custom selected range valueType='datetime'", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: "datetime",
            },
            selectedRange: {
                startValue: 2,
                endValue: 5
            },
            chart: {
                series: [
                    { argumentField: "x", valueField: "y1" },
                    { argumentField: "x", valueField: "y2" }
                ]
            },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: new Date(2), endValue: new Date(5) });
    });

    QUnit.test("parse custom selected range valueType='datetime', one value specified", function(assert) {
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: "numeric",
            },
            selectedRange: {
                endValue: 5
            },
            chart: {
                series: [
                    { argumentField: "x", valueField: "y1" },
                    { argumentField: "x", valueField: "y2" }
                ]
            }
        });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 1, endValue: 5 });
    });

    QUnit.test("parse custom selected range, with dataSource, invalid value", function(assert) {
        var spy = sinon.spy();
        this.rangeSelector.option({
            dataSource: this.dataSource,
            scale: {
                valueType: "numeric",
            },
            selectedRange: {
                startValue: "a",
                endValue: "b"
            },
            chart: {
                series: [
                    { argumentField: "x", valueField: "y1" },
                    { argumentField: "x", valueField: "y2" }
                ]
            },
            onIncidentOccurred: spy
        });

        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 1, endValue: 11 });
        assert.deepEqual(spy.getCall(0).args[0].target.id, "E2203");
        assert.deepEqual(spy.getCall(0).args[0].target.text, "The range you are trying to set is invalid");
    });

    QUnit.test("Warnings should not occurs when dataSource is update", function(assert) {
        errors.log = sinon.stub();
        var widget = $("#container").dxRangeSelector({
            dataSource: [{ arg: 10, val: 1 }, { arg: 20, val: 2 }],
            value: [15, 17],
            chart: {
                series: {}
            },
        }).dxRangeSelector("instance");

        widget.option("dataSource", [{ arg: 10, val: 1 }, { arg: 20, val: 2 }]);

        assert.equal(errors.log.callCount, 0);
    });
});

QUnit.module("T310813", function(hook) {
    hook.beforeEach(function() {
        this.rangeSelector = $("#container").dxRangeSelector({}).dxRangeSelector("instance");
    });
    QUnit.test("refresh range after update data source", function(assert) {
        this.rangeSelector.option("dataSource", [{ arg: 0 }, { arg: 30 }]);
        var selectedRange = this.rangeSelector.getSelectedRange();

        assert.roughEqual(selectedRange.startValue, 0, 1E-8);
        assert.roughEqual(selectedRange.endValue, 30, 1E-8);
    });

    QUnit.test("set range with dataSource", function(assert) {
        this.rangeSelector.option({
            dataSource: [{ arg: 0 }, { arg: 30 }],
            selectedRange: { startValue: 5, endValue: 10 }
        });
        assert.deepEqual(this.rangeSelector.getSelectedRange(), { startValue: 5, endValue: 10 });
    });
});

QUnit.module("'onSelectedRangeChanged' event", function() {
    QUnit.test("Not triggered on widget creation", function(assert) {
        var called = false;
        $("#container").dxRangeSelector({
            scale: { startValue: 1, endValue: 9 },
            selectedRange: { startValue: 2, endValue: 3 },
            onSelectedRangeChanged: function() {
                called = true;
            }
        });

        assert.strictEqual(called, false);
    });

    QUnit.test("Triggered on widget update after widget has been created with empty data", function(assert) {
        var count = 0;
        $("#container").dxRangeSelector({
            onSelectedRangeChanged: function() {
                ++count;
            }
        });

        $("#container").dxRangeSelector({
            scale: { startValue: 1, endValue: 2 }
        });

        assert.strictEqual(count, 1);
    });

    QUnit.test("Triggered subscribed selectedRangeChanged event", function(assert) {
        var eventHandler = sinon.stub();
        $("#container").dxRangeSelector({});
        $("#container").dxRangeSelector("on", "selectedRangeChanged", eventHandler);

        $("#container").dxRangeSelector({
            scale: { startValue: 1, endValue: 2 }
        });

        assert.strictEqual(eventHandler.callCount, 1);
    });

    QUnit.test("onSelectedRangeChanged not raised on start when dataSource and selectedRange are used ", function(assert) {
        var eventHandler = sinon.stub();

        $("#container").dxRangeSelector({
            dataSource: [{ arg: 0 }, { arg: 30 }],
            selectedRange: {
                startValue: 1,
                endValue: 10
            },
            onSelectedRangeChanged: eventHandler,
            onOptionChanged: eventHandler
        });

        assert.strictEqual(eventHandler.callCount, 0);
    });

    QUnit.test("Triggered only once on axis' date marker click", function(assert) {
        var count = 0;
        $("#container").width(600).dxRangeSelector({
            scale: {
                startValue: new Date(2011, 1, 1),
                endValue: new Date(2011, 6, 1)
            },
            onSelectedRangeChanged: function() {
                ++count;
            }
        });

        $("#container .dxrs-range-selector-elements path:nth-last-child(3)").trigger("dxpointerdown");

        assert.strictEqual(count, 1);
    });

    //T467225
    QUnit.test("Triggered after several cases", function(assert) {
        var count = 0,
            range = $("#container").width(600).dxRangeSelector({
                scale: {
                    startValue: new Date(2011, 1, 1),
                    endValue: new Date(2011, 6, 1)
                },
                onSelectedRangeChanged: function() {
                    ++count;
                }
            }).dxRangeSelector("instance");

        range.setSelectedRange({ startValue: new Date(2011, 2, 1), endValue: new Date(2011, 3, 1) });
        range.option({ selectedRange: { startValue: new Date(2011, 3, 1), endValue: new Date(2011, 4, 1) } });

        assert.strictEqual(count, 2);
    });
});

QUnit.module("T385539. Change selectedRange with scale options at the same time", function(hook) {
    hook.beforeEach(function() {
        this.rangeSelector = $("#container").dxRangeSelector({
            scale: {
                startValue: 1,
                endValue: 10
            },
            selectedRange: {
                startValue: 4,
                endValue: 8
            }
        }).dxRangeSelector("instance");
    });

    QUnit.test("selectedRange is set correctly", function(assert) {
        //act
        this.rangeSelector.option({
            scale: {
                startValue: 30,
                endValue: 90
            },
            selectedRange: {
                startValue: 40,
                endValue: 80
            }
        });

        assert.strictEqual(this.rangeSelector.getSelectedRange().startValue, 40);
        assert.strictEqual(this.rangeSelector.getSelectedRange().endValue, 80);
    });

    QUnit.test("onSelectedRangeChanged triggered correctly", function(assert) {
        //arrange
        var selectedRange;
        this.rangeSelector.option("onSelectedRangeChanged", function(e) { selectedRange = e; });

        //act
        this.rangeSelector.option({
            scale: {
                startValue: 30,
                endValue: 90
            },
            selectedRange: {
                startValue: 40,
                endValue: 80
            }
        });

        assert.strictEqual(selectedRange.startValue, 40);
        assert.strictEqual(selectedRange.endValue, 80);
    });

    QUnit.test("No errors fired", function(assert) {
        //arrange
        var errorsFired = [];
        this.rangeSelector.option("onIncidentOccurred", function(e) { errorsFired.push(e.target); });

        //act
        this.rangeSelector.option({
            scale: {
                startValue: 30,
                endValue: 90
            },
            selectedRange: {
                startValue: 40,
                endValue: 80
            }
        });

        assert.deepEqual(errorsFired, []);
    });
});

QUnit.module("T413379", function(hook) {
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
            selectedRange: {
                endValue: 4,
                startValue: 5
            },
            onIncidentOccurred: this.incidentOccurred
        }).dxRangeSelector("instance");
    });

    QUnit.test("Reset selectedRange twice times without updating of the dataSource", function(assert) {
        this.rangeSelector.option({ selectedRange: { startValue: null, endValue: null }, chart: { series: null } });
        this.rangeSelector.option({ selectedRange: { startValue: null, endValue: null }, chart: { series: null } });

        assert.equal(this.incidentOccurred.callCount, 0);
    });

    QUnit.test("Reset selectedRange and dataSource", function(assert) {
        this.rangeSelector.option({ dataSource: null, selectedRange: { startValue: null, endValue: null }, chart: { series: null } });
        this.rangeSelector.option({ dataSource: null, selectedRange: { startValue: null, endValue: null }, chart: { series: null } });

        assert.equal(this.incidentOccurred.callCount, 0);
    });

    QUnit.test("Reset selectedRange.startValue only", function(assert) {
        this.rangeSelector.option({ selectedRange: { startValue: null }, chart: { series: null } });
        this.rangeSelector.option({ selectedRange: { startValue: null }, chart: { series: null } });

        assert.equal(this.incidentOccurred.callCount, 0);
    });
});
//DEPRECATED 16_2 end

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
        this.rangeSelector.resetSelectedRange();
        assert.deepEqual(this.rangeSelector.getValue(), [1, 11]);
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
        assert.deepEqual(spy.getCall(0).args[0].target.id, "E2203");
        assert.deepEqual(spy.getCall(0).args[0].target.text, "The range you are trying to set is invalid");
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
