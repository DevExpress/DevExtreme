var $ = require("jquery"),
    pointerMock = require("../../helpers/pointerMock.js");
    // vizMocks = require("../../helpers/vizMocks.js"),
    // translator2DModule = require("viz/translators/translator2d"),
    // eventsConsts = require("viz/components/consts").events;
    // StubTranslator = vizMocks.stubClass($.extend(translator2DModule.Translator2D.prototype, {
    //     zoom: function() { },
    //     getMinScale: function() { }
    // })),
    // axisModule = require("viz/axes/base_axis"),
    // Crosshair = require("viz/chart_components/crosshair").Crosshair,
    // trackers = require("viz/chart_components/tracker"),
    // MockAxis = require("../../helpers/chartMocks.js").MockAxis;

require("viz/chart");

var environment = {
    beforeEach: function() {
        this.tooltipHiddenSpy = sinon.spy();
    },
    createChart: function(options) {
        var chart = $("#chart").dxChart($.extend(true, {
            size: {
                width: 800,
                height: 600
            },
            animation: { enabled: false },
            dataSource: new Array(11).fill(0).map(function(_, i) { return { arg: i, val: Math.abs(5 - i) }; }),
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false },
                point: { visible: false },
                tick: { visible: false },
                visible: false
            },
            commonSeriesSettings: { point: { visible: false }, label: { visible: false } },
            series: [{}],
            legend: { visible: false }
        }, options)).dxChart("instance");

        this.pointer = pointerMock(chart._renderer.root.element).start();
        this.trackerStopHandling = sinon.stub(chart._tracker, "stopCurrentHandling");

        return chart;
    },
    afterEach: function() {
        this.trackerStopHandling && this.trackerStopHandling.restore();
    }
};

QUnit.testStart(function() {
    $("#qunit-fixture").addClass("qunit-fixture-visible").html("<div id='chart'></div>");
});

// TODO animation enabled/disabled
// TODO chart rendering time > threshold
// TODO cancel events

QUnit.module("Panning", environment);

QUnit.test("Argument pan right by 1", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(100, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });
});

QUnit.test("Argument pan right out of the data", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(1000, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 0, endValue: 4 });
});

QUnit.test("Value pan bottom by 1", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            valueAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 4
                }
            },
            zoomAndPan: {
                valueAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 200, y: 100 }).dragStart().drag(200, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2, endValue: 4 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 5 });
});

QUnit.test("Argument and value", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            valueAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 4
                }
            },
            zoomAndPan: {
                valueAxis: "pan",
                argumentAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 150, y: 100 }).dragStart().drag(50, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 4 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 3, endValue: 5 });
});

QUnit.test("Argument and value. Rotated", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            rotated: true,
            argumentAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 4
                }
            },
            valueAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                valueAxis: "pan",
                argumentAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 150, y: 100 }).dragStart().drag(50, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2, endValue: 4 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 5 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 2, endValue: 6 });
});

QUnit.test("Argument and value. Multiple panes", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            size: {
                height: 610
            },
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            valueAxis: [
                { name: "v1", visualRange: { startValue: 2, endValue: 4 } },
                { name: "v2", visualRange: { startValue: 1, endValue: 3 } },
                { name: "v3", visualRange: { startValue: 2, endValue: 4 } }
            ],
            panes: [
                { name: "p1" },
                { name: "p2" }
            ],
            series: [
                { pane: "p1", axis: "v1" },
                { pane: "p1", axis: "v2" },
                { pane: "p2", axis: "v3" }
            ],
            zoomAndPan: {
                valueAxis: "pan",
                argumentAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis1 = chart.getValueAxis("v1");
    var valueAxis2 = chart.getValueAxis("v2");

    // act
    this.pointer.start({ x: 150, y: 100 }).dragStart().drag(50, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 4 });

    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 1, endValue: 3 });

    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 3, endValue: 5 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 1, endValue: 3 });
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 2, endValue: 4 });
});

QUnit.test("Multiple panes. Check argument axes visual ranges", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            size: {
                height: 610
            },
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            panes: [
                { name: "p1" },
                { name: "p2" }
            ],
            series: [
                { pane: "p1" },
                { pane: "p2" }
            ],
            zoomAndPan: {
                argumentAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    // act
    this.pointer.start({ x: 150, y: 100 }).dragStart().drag(50, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 2, endValue: 6 });
    });
});

QUnit.module("Wheel zooming", environment);

QUnit.test("Zoom-in argument axis", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2.9,
                    endValue: 7.3
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2.9, endValue: 7.3 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2.9, endValue: 7.3 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
});

QUnit.test("Zoom-out argument axis", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3.1,
                    endValue: 6.7
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(-10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3.1, endValue: 6.7 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3.1, endValue: 6.7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
});

QUnit.test("With shift pressed - zoom value axis", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            valueAxis: {
                visualRange: {
                    startValue: 0.9,
                    endValue: 4.2
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 200, y: 400 }).wheel(10, true);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 0.9, endValue: 4.2 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 0.9, endValue: 4.2 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 4 });
});

QUnit.module("Wheel zooming. Multiple panes", environment);

QUnit.test("Multiaxes, zoom axes only in one pane", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            size: {
                height: 610
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowMouseWheel: true
            },
            panes: [
                { name: "p1" },
                { name: "p2" }
            ],
            valueAxis: [
                { name: "v1", visualRange: { startValue: 0.9, endValue: 4.2 } },
                { name: "v2", visualRange: { startValue: 1.8, endValue: 8.4 } },
                { name: "v3", visualRange: { startValue: 0.9, endValue: 4.2 } }
            ],
            series: [
                { pane: "p1", axis: "v1" },
                { pane: "p1", axis: "v2" },
                { pane: "p2", axis: "v3" }
            ],
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var valueAxis1 = chart.getValueAxis("v1");
    var valueAxis2 = chart.getValueAxis("v2");

    // act
    this.pointer.start({ x: 300, y: 200 }).wheel(10, true);

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 0.9, endValue: 4.2 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 1.8, endValue: 8.4 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 0.9, endValue: 4.2 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 4 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 1.8, endValue: 8.4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 2, endValue: 8 });
});

QUnit.test("Multiaxes, zoom axes only in one pane. Rotated", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            rotated: true,
            size: {
                width: 810
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowMouseWheel: true
            },
            panes: [
                { name: "p1" },
                { name: "p2" }
            ],
            valueAxis: [
                { name: "v1", visualRange: { startValue: 2.9, endValue: 7.3 } },
                { name: "v2", visualRange: { startValue: 2.9, endValue: 7.3 } },
                { name: "v3", visualRange: { startValue: 5.8, endValue: 14.6 } }
            ],
            series: [
                { pane: "p1", axis: "v1" },
                { pane: "p1", axis: "v2" },
                { pane: "p2", axis: "v3" }
            ],
            synchronizeMultiAxes: false,
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var valueAxis3 = chart.getValueAxis("v3");

    // act
    this.pointer.start({ x: 100, y: 200 }).wheel(10, true);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis3);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 5.8, endValue: 14.6 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis3);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 5.8, endValue: 14.6 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 6, endValue: 14 });
});

QUnit.test("Multiple panes. Check argument axes visual ranges", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2.9,
                    endValue: 7.3
                }
            },
            panes: [
                { name: "p1" },
                { name: "p2" }
            ],
            series: [
                { pane: "p1" },
                { pane: "p2" }
            ],
            zoomAndPan: {
                argumentAxis: "zoom",
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 });
    });
});

QUnit.module("Shutter zoom. Test zooming", environment);

QUnit.test("Zoom argument axis", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 10
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                dragToZoom: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250 }).dragStart().drag(400, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2, endValue: 10 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 4, endValue: 8 });
});

QUnit.test("Zoom value axis", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            valueAxis: {
                visualRange: {
                    startValue: 0,
                    endValue: 5
                }
            },
            zoomAndPan: {
                valueAxis: "zoom",
                dragToZoom: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 0, endValue: 5 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 0, endValue: 5 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 4 });
});

QUnit.test("Zoom argument and value axis", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 10
                }
            },
            valueAxis: {
                visualRange: {
                    startValue: 0,
                    endValue: 5
                }
            },
            zoomAndPan: {
                valueAxis: "zoom",
                argumentAxis: "zoom",
                dragToZoom: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240).dragEnd();

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2, endValue: 10 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 5 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 4, endValue: 8 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 5 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 2, endValue: 4 });
});

QUnit.test("Multiaxes, zoom axes only in one pane. Rotated", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            rotated: true,
            size: {
                width: 810
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                dragToZoom: true
            },
            panes: [
                { name: "p1" },
                { name: "p2" }
            ],
            argumentAxis: {
                visualRange: { startValue: 2, endValue: 8 }
            },
            valueAxis: [
                { name: "v1", visualRange: { startValue: 0, endValue: 4 } },
                { name: "v2", visualRange: { startValue: 2, endValue: 10 } },
                { name: "v3", visualRange: { startValue: 4, endValue: 5 } }
            ],
            series: [
                { pane: "p1", axis: "v1" },
                { pane: "p1", axis: "v2" },
                { pane: "p2", axis: "v3" }
            ],
            synchronizeMultiAxes: false,
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis1 = chart.getValueAxis("v1");
    var valueAxis2 = chart.getValueAxis("v2");

    // act
    this.pointer.start({ x: 510, y: 200 }).dragStart().drag(200, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2, endValue: 8 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 4 });

    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 2, endValue: 10 });

    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 8 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 4, endValue: 6 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1, endValue: 3 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 4, endValue: 8 });
});

QUnit.test("Multiple panes. Check argument axes visual ranges", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            size: {
                height: 610
            },
            argumentAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 10
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                dragToZoom: true
            },
            panes: [
                { name: "p1" },
                { name: "p2" }
            ],
            series: [
                { pane: "p1" },
                { pane: "p2" }
            ],
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    // act
    this.pointer.start({ x: 200, y: 250 }).dragStart().drag(400, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 4, endValue: 8 });
    });
});

QUnit.module("Shutter zoom. Test shutter rendering", environment);

QUnit.test("Zoom argument axis", function(assert) {
    var rect,
        chart = this.createChart({
            zoomAndPan: {
                argumentAxis: "zoom",
                dragToZoom: true,
                dragBoxStyle: {
                    color: "#121212",
                    opacity: 0.32
                }
            }
        });

    assert.equal(chart._renderer.root.element.getElementsByClassName("dxc-shutter").length, 0);
    // act
    this.pointer.start({ x: 200, y: 250 }).dragStart();
    // assert
    assert.equal(chart._renderer.root.element.getElementsByClassName("dxc-shutter").length, 1);

    rect = chart._renderer.root.element.getElementsByClassName("dxc-shutter")[0];
    assert.equal(rect.getAttribute("x"), "0");
    assert.equal(rect.getAttribute("y"), "0");
    assert.equal(rect.getAttribute("width"), "0");
    assert.equal(rect.getAttribute("height"), "0");
    assert.equal(rect.getAttribute("fill"), "#121212");
    assert.equal(rect.getAttribute("opacity"), "0.32");

    // act
    this.pointer.drag(400, 50);
    // assert
    rect = chart._renderer.root.element.getElementsByClassName("dxc-shutter")[0];
    assert.equal(rect.getAttribute("x"), "200");
    assert.equal(rect.getAttribute("y"), "0");
    assert.equal(rect.getAttribute("width"), "400");
    assert.equal(rect.getAttribute("height"), "600");

    // act
    this.pointer.dragEnd();
    // assert
    assert.equal(chart._renderer.root.element.getElementsByClassName("dxc-shutter").length, 0);
});

QUnit.test("Zoom value axis", function(assert) {
    var chart = this.createChart({
        zoomAndPan: {
            valueAxis: "zoom",
            dragToZoom: true
        }
    });

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240);
    // assert
    var rect = chart._renderer.root.element.getElementsByClassName("dxc-shutter")[0];
    assert.equal(rect.getAttribute("x"), "0");
    assert.equal(rect.getAttribute("y"), "120");
    assert.equal(rect.getAttribute("width"), "800");
    assert.equal(rect.getAttribute("height"), "240");
});

QUnit.test("Zoom argument and value axis", function(assert) {
    var chart = this.createChart({
        zoomAndPan: {
            valueAxis: "zoom",
            argumentAxis: "zoom",
            dragToZoom: true
        }
    });

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240);

    // assert
    var rect = chart._renderer.root.element.getElementsByClassName("dxc-shutter")[0];
    assert.equal(rect.getAttribute("x"), "200");
    assert.equal(rect.getAttribute("y"), "120");
    assert.equal(rect.getAttribute("width"), "400");
    assert.equal(rect.getAttribute("height"), "240");
});

QUnit.test("Zoom value axis, multiple panes, rotated", function(assert) {
    var chart = this.createChart({
        rotated: true,
        zoomAndPan: {
            valueAxis: "zoom",
            dragToZoom: true
        },
        panes: [
            { name: "p1" },
            { name: "p2" }
        ],
        series: [
            { pane: "p1" },
            { pane: "p2" }
        ]
    });

    // act
    this.pointer.start({ x: 100, y: 120 }).dragStart().drag(200, 240);
    // assert
    var rect = chart._renderer.root.element.getElementsByClassName("dxc-shutter")[0];
    assert.equal(rect.getAttribute("x"), "100");
    assert.equal(rect.getAttribute("y"), "0");
    assert.equal(rect.getAttribute("width"), "200");
    assert.equal(rect.getAttribute("height"), "600");
});

QUnit.module("Shutter zoom and drag combination", environment);

QUnit.test("Without panKey pressed drag action zooms chart", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 10
                }
            },
            zoomAndPan: {
                argumentAxis: "both",
                dragToZoom: true,
                panKey: "shift"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250 }).dragStart().drag(400, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2, endValue: 10 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 4, endValue: 8 });
});

QUnit.test("With panKey pressed drag action zooms chart", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 10
                }
            },
            zoomAndPan: {
                argumentAxis: "both",
                dragToZoom: true,
                panKey: "shift"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250, shiftKey: true }).dragStart().drag(200, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2, endValue: 10 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 0, endValue: 8 });
});

QUnit.module("Touch devices", environment);

QUnit.test("Drag by touch pans chart, even if dragToZoom = true", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            valueAxis: {
                visualRange: {
                    startValue: 2,
                    endValue: 4
                }
            },
            zoomAndPan: {
                valueAxis: "both",
                argumentAxis: "both",
                allowGestures: true,
                dragToZoom: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 150, y: 100, pointerType: "touch" }).dragStart().drag(50, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 4 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 3, endValue: 5 });
});

QUnit.test("Pinch zoom-in both axes", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis = chart.getValueAxis();

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 0, endValue: 10 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 5 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 0, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 0, endValue: 5 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 5 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 2.5, endValue: 5 });
});

QUnit.test("Pinch zoom-out both axes", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: { startValue: 0, endValue: 5 }
            },
            valueAxis: {
                visualRange: { startValue: 2.5, endValue: 5 }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();
    var valueAxis = chart.getValueAxis();

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 0, endValue: 5 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2.5, endValue: 5 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 0, endValue: 5 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 0, endValue: 10 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2.5, endValue: 5 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 0, endValue: 5 });
});

QUnit.test("Pinch zoom-in argument axis from some point", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: { startValue: 1, endValue: 9 }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "none",
                allowGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 200, pageY: 200 }, { pointerId: 2, pageX: 400, pageY: 200 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 100, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2.5, endValue: 6.5 });
});

QUnit.module("ScrollBar", environment);

QUnit.test("Scrollbar pans only argument axis", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "pan",
                valueAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event("dxc-scroll-end"));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });
});

QUnit.test("Scrollbar does not pan argument axis if it can not be panned", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "pan"
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event("dxc-scroll-end"));

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.module("Misc", environment);

QUnit.test("Check css touch-action rule combinations", function(assert) {
    var chart = this.createChart();
    var checkRule = (function(val, arg, expected) {
        chart.option({
            zoomAndPan: {
                argumentAxis: val,
                valueAxis: arg
            }
        });
        var $root = $(chart._renderer.root.element);

        var ta = $root.css("touch-action");
        var msTa = $root.css("-ms-touch-action");

        assert.equal(ta || msTa, expected);
    }).bind(this);

    checkRule("none", "none", "auto");

    checkRule("zoom", "pan", "none");
    checkRule("pan", "zoom", "none");

    checkRule("zoom", "none", "pan-x pan-y");
    checkRule("none", "zoom", "pan-x pan-y");

    checkRule("pan", "none", "pinch-zoom");
    checkRule("none", "pan", "pinch-zoom");

    checkRule("none", "none", "auto");
});

QUnit.test("Do nothing if no actions allowed", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "none",
                valueAxis: "none",
                allowGestures: true,
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    // act
    var $root = $(chart._renderer.root.element);
    // drag
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(100, 50).dragEnd();
    // wheel
    this.pointer.start({ x: 200, y: 250 }).wheel(10);
    // pinch
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));
    // scroll bar
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event("dxc-scroll-end"));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test("allowGestures = false, do nothing on touch drag and pinch zoom", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy();
    this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: "both",
            allowGestures: false
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 100, y: 250, pointerType: "touch" }).dragStart().drag(100, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test("allowGestures = true, only zoom allowed, touch drag - do nothing", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy();
    this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: "zoom",
            allowGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 100, y: 250, pointerType: "touch" }).dragStart().drag(100, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.module("Prevent default behavior", environment);

QUnit.test("On pan", function(assert) {
    var preventDefault = sinon.spy(),
        stopPropagation = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "pan",
                valueAxis: "pan"
            }
        });

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxdragstart", { pageX: 100, pageY: 250, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxdrag", { offset: { x: 100, y: 50 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxdragend", { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 3);
    assert.equal(stopPropagation.callCount, 3);
    assert.equal(this.trackerStopHandling.callCount, 3);
});

// T249548
QUnit.test("On mouse wheel", function(assert) {
    var preventDefault = sinon.spy(),
        stopPropagation = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                allowMouseWheel: true
            }
        });

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxmousewheel", { d: 10, preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.equal(this.trackerStopHandling.callCount, 1);
});

QUnit.test("On pinch zoom", function(assert) {
    var preventDefault = sinon.spy(),
        stopPropagation = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowGestures: true
            }
        });

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [], preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 3);
    assert.equal(stopPropagation.callCount, 3);
    assert.equal(this.trackerStopHandling.callCount, 3);
});

QUnit.test("On ScrollBar", function(assert) {
    var preventDefault = sinon.spy(),
        stopPropagation = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "pan",
                valueAxis: "pan"
            }
        });

    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxc-scroll-end", { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 3);
    assert.equal(stopPropagation.callCount, 3);
    assert.equal(this.trackerStopHandling.callCount, 3);
});

QUnit.test("Do not prevent and stop if no actions allowed", function(assert) {
    var preventDefault = sinon.spy(),
        stopPropagation = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "none",
                valueAxis: "none",
                allowGestures: true,
                allowMouseWheel: true
            }
        });

    // act
    var $root = $(chart._renderer.root.element);
    // drag
    $root.trigger(new $.Event("dxdragstart", { pageX: 100, pageY: 250, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxdrag", { offset: { x: 100, y: 50 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxdragend", { preventDefault: preventDefault, stopPropagation: stopPropagation }));
    // wheel
    $root.trigger(new $.Event("dxmousewheel", { d: 10, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    // pinch
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    // scroll bar
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxc-scroll-end", { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    // assert
    assert.equal(preventDefault.callCount, 0);
    assert.equal(stopPropagation.callCount, 0);
    assert.equal(this.trackerStopHandling.callCount, 0);
});

QUnit.module("Deprecated options", environment);

QUnit.test("Ignore deprecated options if new options are used", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "none",
                valueAxis: "none",
                allowGestures: true,
                allowMouseWheel: true
            },
            zoomingMode: "all",
            scrollingMode: "all",
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    // act
    var $root = $(chart._renderer.root.element);
    // drag
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(100, 50).dragEnd();
    // wheel
    this.pointer.start({ x: 200, y: 250 }).wheel(10);
    // pinch
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));
    // scroll bar
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event("dxc-scroll-end"));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test("scrollingMode=all allows argument axis panning by mouse and touch", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            scrollingMode: "all",
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(100, 50).dragEnd();
    // act
    this.pointer.start({ x: 100, y: 100, pointerType: "touch" }).dragStart().drag(300, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomEnd.callCount, 2);

    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 6 });
    assert.equal(onZoomEnd.getCall(1).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 6 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 0, endValue: 4 });
});

QUnit.test("scrollingMode=mouse allows argument axis panning by mouse only", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            scrollingMode: "mouse",
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(100, 50).dragEnd();
    // act
    this.pointer.start({ x: 100, y: 100, pointerType: "touch" }).dragStart().drag(300, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);

    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });
});

QUnit.test("scrollingMode=touch allows argument axis panning by mouse and touch", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            scrollingMode: "touch",
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 100, y: 250, pointerType: "mouse" }).dragStart().drag(100, 50).dragEnd();
    // act
    this.pointer.start({ x: 100, y: 100, pointerType: "touch" }).dragStart().drag(300, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomEnd.callCount, 2);

    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 6 });
    assert.equal(onZoomEnd.getCall(1).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 6 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 0, endValue: 4 });
});

QUnit.test("scrollingMode does not allow argument axis zooming", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy();
    this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        scrollingMode: "all",
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test("zoomingMode=all allows argument axis zooming by mousewheel and touch", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2.9,
                    endValue: 7.3
                }
            },
            zoomingMode: "all",
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);
    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 300, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 200, pageY: 200 }, { pointerId: 2, pageX: 600, pageY: 200 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    // assert
    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomEnd.callCount, 2);

    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2.9, endValue: 7.3 });
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2.9, endValue: 7.3 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomStart.getCall(1).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 3, endValue: 7 });
    assert.equal(onZoomEnd.getCall(1).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 4, endValue: 6 });
});

QUnit.test("zoomingMode=mouse allows argument axis zooming by mousewheel only", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 2.9,
                    endValue: 7.3
                }
            },
            zoomingMode: "mouse",
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);
    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 300, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 200, pageY: 200 }, { pointerId: 2, pageX: 600, pageY: 200 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    // assert
    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);

    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 2.9, endValue: 7.3 });
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2.9, endValue: 7.3 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
});

QUnit.test("zoomingMode=touch allows argument axis zooming by touch only", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomingMode: "touch",
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    var argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);
    // act
    var $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 300, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 200, pageY: 200 }, { pointerId: 2, pageX: 600, pageY: 200 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    // assert
    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);

    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 4, endValue: 6 });
});

QUnit.test("zoomingMode does not allow argument axis panning", function(assert) {
    var onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy();
    this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomingMode: "all",
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(100, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

/*
* ==============
*
* ==============
*/

if(0) {

    function getEvent() {}
    QUnit.test("render axes and series each time on zooming/scrollig (via rendering timeout)", function(assert) {
        this.options.chart._lastRenderingTime = 200;
        $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
        $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
        $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 60, pointers: [{ pageX: 60, pageY: 40 }] }));
        $(document).trigger(getEvent("dxpointerup", {}));

        assert.equal(this.options.chart._transformArgument.callCount, 0);
        assert.deepEqual(this.translator.stub("zoom").lastCall.args, [-10, 1, { mockWholeRange: true }]);
        assert.equal(this.axis.visualRange.callCount, 4);
        assert.deepEqual(this.axis.visualRange.secondCall.args, [["minArg", "maxArg"], { start: true, end: true }]);
        assert.deepEqual(this.axis.visualRange.lastCall.args, [["minArg", "maxArg"], { start: true, end: true }]);
        assert.ok(this.options.eventTrigger.withArgs("zoomStart").calledOnce);
        assert.ok(this.options.eventTrigger.withArgs("zoomEnd").calledOnce);
    });

    QUnit.test("run transformArgument if rendering timeout is exceeded", function(assert) {
        this.options.chart._lastRenderingTime = 200;
        $(this.renderer.root.element).trigger(getEvent("dxpointerdown", { pageX: 30, pointers: [{ pageX: 30, pageY: 40 }] }));
        $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 50, pointers: [{ pageX: 50, pageY: 40 }] }));
        this.options.chart._lastRenderingTime = 500;
        $(this.renderer.root.element).trigger(getEvent("dxpointermove", { pageX: 60, pointers: [{ pageX: 60, pageY: 40 }] }));
        $(document).trigger(getEvent("dxpointerup", {}));

        assert.equal(this.options.chart._transformArgument.callCount, 1);
        assert.deepEqual(this.options.chart._transformArgument.lastCall.args, [10, 1]);
        assert.equal(this.axis.visualRange.callCount, 3);
        assert.deepEqual(this.axis.visualRange.secondCall.args, [["minArg", "maxArg"], { start: true, end: true }]);
        assert.deepEqual(this.axis.visualRange.lastCall.args, [["minArg", "maxArg"], { start: true, startRange: undefined }]);
        assert.ok(this.options.eventTrigger.withArgs("zoomStart").calledOnce);
        assert.equal(this.options.eventTrigger.withArgs("zoomEnd").callCount, 0);
    });


}
