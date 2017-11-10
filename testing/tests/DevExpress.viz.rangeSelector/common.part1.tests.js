"use strict";

var $ = require("jquery"),
    trackerModule = require("viz/range_selector/tracker"),
    dataSourceModule = require("data/data_source/data_source"),
    seriesDataSourceModule = require("viz/range_selector/series_data_source"),
    commons = require("./rangeSelectorParts/commons.js");

QUnit.module("Basic", commons.environment);

QUnit.test("Renderer", function(assert) {
    this.createWidget();

    assert.deepEqual(this.renderer.root.css.lastCall.args, [{ "-ms-touch-action": "pan-y", "touch-action": "pan-y" }], "root settings");
});

//B219560
QUnit.test("startValue equals endValue", function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 1
        }
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, undefined, "start value");
    assert.strictEqual(options.endValue, undefined, "end value");
});

//T282809
QUnit.test("one category", function(assert) {
    this.createWidget({
        scale: {
            categories: ["q1"]
        }
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, "q1", "start value");
    assert.strictEqual(options.endValue, "q1", "end value");
});

QUnit.test("deprecated options", function(assert) {
    this.createWidget({
        scale: {
            tickInterval: "tick-interval",
            minorTick: { visible: true },
            showMinorTicks: "show-minor-ticks"
        }
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.deepEqual(options.tickInterval, "tick-interval", "tickInterval");
    assert.strictEqual(options.minorTick.visible, "show-minor-ticks", "minorTick.visible");
});

QUnit.test("default selected range", function(assert) {
    this.createWidget({
        scale: {
            startValue: 2,
            endValue: 50,
            majorTickInterval: 2
        }
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 2);
    assert.strictEqual(options.endValue, 50);
    assert.strictEqual(options.majorTickInterval, 2);
});

QUnit.test("format when majorTickInterval is not defined", function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2010, 2, 23),
            endValue: new Date(2010, 5, 10),
            majorTickInterval: null,
            marker: {
                visible: true
            }
        }
    });

    assert.strictEqual(this.axis.updateOptions.lastCall.args[0].label.format, "day", "date time format");
});

//T152860
QUnit.test("no format value with empty data", function(assert) {
    this.createWidget({
        scale: {
            label: {
                format: {
                    format: "monthYear",
                    dateType: "full"
                }
            },
            minorTickInterval: "month",
            majorTickInterval: "month",
        },
        sliderMarker: {
            format: {
                format: "monthYear",
                dateType: "full"
            }
        }
    });

    var range = this.axis.setBusinessRange.lastCall.args[0];
    assert.strictEqual(range.min, 0, "min");
    assert.strictEqual(range.max, 10, "max");
});

QUnit.test("rangeSelector info callback on small tick interval", function(assert) {
    this.createWidget({
        scale: {
            startValue: 0,
            endValue: 10000,
            majorTickInterval: 1
        }
    });

    assert.equal(this.axis.updateOptions.lastCall.args[0].tickInterval, 1000);
});

QUnit.test("initialize with numeric inverted scale", function(assert) {
    this.createWidget({
        scale: {
            startValue: 50,
            endValue: 2,
            majorTickInterval: 2
        }
    });

    var range = this.axis.setBusinessRange.lastCall.args[0];
    assert.ok(range.invert, "invert");
    assert.equal(range.min, 2, "min");
    assert.equal(range.max, 50, "max");
});

QUnit.test("initialize with dateTime inverted scale", function(assert) {
    this.createWidget({
        scale: {
            startValue: new Date(2012, 1, 1),
            endValue: new Date(2010, 5, 1)
        }
    });

    var range = this.axis.setBusinessRange.lastCall.args[0];
    assert.ok(range.invert, "invert");
    assert.deepEqual(range.min, new Date(2010, 5, 1), "min");
    assert.deepEqual(range.max, new Date(2012, 1, 1), "max");
});

QUnit.test("initialize with logarithmic axis", function(assert) {
    this.createWidget({
        scale: {
            startValue: 1,
            endValue: 10,
            type: "logarithmic",
            logarithmBase: 10
        }
    });

    var range = this.axis.setBusinessRange.lastCall.args[0];
    assert.equal(range.min, 1, "min");
    assert.equal(range.max, 10, "max");
    assert.equal(range.axisType, "logarithmic", "axisType");
    assert.equal(range.base, 10, "base");
});

//T153827
QUnit.test("correct sliders place holder size by values", function(assert) {
    this.createWidget({
        scale: {
            startValue: 0,
            endValue: 500000,
            minorTickInterval: 2000
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 0, top: 0, width: 299, height: 24, right: 0, bottom: 0 });
});

//T153827
QUnit.test("correct sliders place holder size by values (with set placeholderSize)", function(assert) {
    this.createWidget({
        sliderMarker: {
            placeholderSize: {
                width: 10
            }
        },
        scale: {
            startValue: 0,
            endValue: 500000,
            minorTickInterval: 2000
        }
    });

    assert.deepEqual(this.rangeView.update.lastCall.args[2], { left: 10, top: 0, width: 290, height: 24, right: 0, bottom: 0 });
});

QUnit.test("Tracker creation", function(assert) {
    var spy = sinon.spy(trackerModule, "Tracker");
    this.createWidget();

    assert.deepEqual(spy.lastCall.args, [{ renderer: this.renderer, controller: this.slidersController }]);
});

QUnit.test("Tracker options", function(assert) {
    this.translator.stub("isEmptyValueRange").returns(false);
    this.createWidget({
        behavior: {
            moveSelectedRangeByClick: "value-1",
            manualRangeSelectionEnabled: "value-2"
        }
    });

    assert.deepEqual(this.tracker.update.lastCall.args, [true, {
        moveSelectedRangeByClick: "value-1",
        manualRangeSelectionEnabled: "value-2"
    }]);
});

QUnit.module("Disabled", commons.environment);

QUnit.test("Create without disabled state", function(assert) {
    this.createWidget();

    assert.deepEqual(this.renderer.root.stub("attr").lastCall.args, [{
        "pointer-events": null,
        filter: null
    }]);
});

QUnit.test("Create with disabled state", function(assert) {
    sinon.stub(this.renderer, "getGrayScaleFilter").returns({ id: "grayScaleFilterRef" });
    this.createWidget({
        disabled: true
    });

    assert.deepEqual(this.renderer.root.stub("attr").lastCall.args, [{
        "pointer-events": "none",
        filter: "grayScaleFilterRef"
    }]);
});

QUnit.test("Set disabled state, initially not disabled", function(assert) {
    sinon.stub(this.renderer, "getGrayScaleFilter").returns({ id: "grayScaleFilterRef" });
    var rs = this.createWidget();

    rs.option({
        disabled: true
    });

    assert.deepEqual(this.renderer.root.stub("attr").lastCall.args, [{
        "pointer-events": "none",
        filter: "grayScaleFilterRef"
    }]);
});

QUnit.test("Reset disabled state, initially disabled", function(assert) {
    sinon.stub(this.renderer, "getGrayScaleFilter").returns({ id: "grayScaleFilterRef" });
    var rs = this.createWidget({
        disabled: true
    });

    rs.option({
        disabled: false
    });

    assert.deepEqual(this.renderer.root.stub("attr").lastCall.args, [{
        "pointer-events": null,
        filter: null
    }]);
});


QUnit.module("DataSource", commons.environment);

QUnit.test("Creation", function(assert) {
    this.seriesDataSource.stub("getBoundRange").returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    var widget = this.createWidget({ dataSource: [1, 2, 3] }),
        ds = widget.getDataSource();

    assert.ok(ds instanceof dataSourceModule.DataSource);
    assert.deepEqual(ds.items(), [1, 2, 3]);
});

QUnit.module("isReady", $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        this.seriesDataSource.stub("isShowChart").returns(true);
        this.seriesDataSource.stub("getBoundRange").returns({
            arg: new commons.StubRange(),
            val: new commons.StubRange()
        });
    }
}));

QUnit.test("dataSource is not loaded", function(assert) {
    var ds = new dataSourceModule.DataSource();
    ds.isLoaded = sinon.stub().returns(false);
    var rangeSelector = this.createWidget({ dataSource: ds });

    assert.strictEqual(rangeSelector.isReady(), false, "ready state");
    assert.ok(!this.renderer.stub("onEndAnimation").called, "end animation");
});

QUnit.test("dataSource is loaded", function(assert) {
    var ds = new dataSourceModule.DataSource();
    ds.isLoaded = sinon.stub().returns(true);
    var rangeSelector = this.createWidget({ dataSource: ds });

    assert.strictEqual(rangeSelector.isReady(), false, "ready state before end animation");
    this.renderer.onEndAnimation.lastCall.args[0]();
    assert.strictEqual(rangeSelector.isReady(), true, "ready state after end animation");
});

QUnit.module("logarithmic type", commons.environment);

QUnit.test("scale. logarithmic type", function(assert) {
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: "logarithmic",
            logarithmBase: 2
        }
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, "logarithmic");
    assert.strictEqual(options.logarithmBase, 2);
});

QUnit.test("scale. not valid logarithmBase, less than zero", function(assert) {
    var spy = sinon.spy();
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: "logarithmic",
            logarithmBase: -10
        },
        onIncidentOccurred: spy
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, "logarithmic");
    assert.strictEqual(options.logarithmBase, 10);
    assert.strictEqual(spy.getCall(0).args[0].target.id, "E2104", "incident");
});

QUnit.test("scale. not valid logarithmBase, equal zero", function(assert) {
    var spy = sinon.spy();
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: "logarithmic",
            logarithmBase: 0
        },
        onIncidentOccurred: spy
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, "logarithmic");
    assert.strictEqual(options.logarithmBase, 10);
    assert.strictEqual(spy.getCall(0).args[0].target.id, "E2104", "incident");
});

QUnit.test("scale. not valid logarithmBase, string", function(assert) {
    var spy = sinon.spy();
    this.createWidget({
        scale: {
            startValue: 0.001,
            endValue: 1000,
            type: "logarithmic",
            logarithmBase: "base"
        },
        onIncidentOccurred: spy
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.strictEqual(options.startValue, 0.001);
    assert.strictEqual(options.endValue, 1000);
    assert.strictEqual(options.type, "logarithmic");
    assert.strictEqual(options.logarithmBase, 10);
    assert.strictEqual(spy.getCall(0).args[0].target.id, "E2104", "incident");
});

QUnit.test("valueAxis. logarithmic type", function(assert) {
    var spy = sinon.spy(seriesDataSourceModule, "SeriesDataSource");
    this.seriesDataSource.stub("getBoundRange").returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.createWidget({
        dataSource: [{}],
        chart: {
            valueAxis: {
                type: "logarithmic",
                logarithmBase: 2
            }
        }
    });

    var obj = spy.lastCall.args[0].chart.valueAxis;
    assert.strictEqual(obj.type, "logarithmic", "type");
    assert.strictEqual(obj.logarithmBase, 2, "logarithmic base");
});

QUnit.test("valueAxis. not valid logarithmBase", function(assert) {
    var spy = sinon.spy(seriesDataSourceModule, "SeriesDataSource");
    this.seriesDataSource.stub("isShowChart").returns(true);
    this.seriesDataSource.stub("getBoundRange").returns({
        arg: new commons.StubRange(),
        val: new commons.StubRange()
    });
    this.seriesDataSource.getThemeManager = function() {
        var themeManager = new commons.StubThemeManager();
        themeManager.getOptions = sinon.stub().withArgs("valueAxis").returns({ logarithmBase: 2 });
        return themeManager;
    };
    var incidentOccurred = sinon.spy();
    this.createWidget({
        dataSource: [],
        chart: {
            series: {},
            valueAxis: {
                type: "logarithmic",
                logarithmBase: -2
            }
        },
        onIncidentOccurred: incidentOccurred
    });

    var obj = spy.lastCall.args[0].chart.valueAxis;
    assert.deepEqual(obj.type, "logarithmic");
    assert.deepEqual(obj.logarithmBase, 2);
    assert.strictEqual(incidentOccurred.getCall(0).args[0].target.id, "E2104", "incident");
});

QUnit.module("discrete type", commons.environment);

QUnit.test("scale. discrete type", function(assert) {
    this.createWidget({
        scale: {
            startValue: "a2",
            endValue: "a4",
            type: "discrete"
        }
    });

    var options = this.axis.updateOptions.lastCall.args[0];
    assert.equal(options.type, "discrete");
    assert.equal(options.startValue, "a2");
    assert.equal(options.endValue, "a4");
});
