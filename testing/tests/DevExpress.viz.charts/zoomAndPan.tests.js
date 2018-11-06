import $ from "jquery";
import pointerMock from "../../helpers/pointerMock.js";

import "viz/chart";

const dataSource = (() => {
    let arr = [];
    for(let i = 0; i < 11; i++) {
        arr.push({ arg: i, val: Math.abs(5 - i) });
    }
    return arr;
})();
const environment = {
    beforeEach: function() {
        this.tooltipHiddenSpy = sinon.spy();
    },
    createChart: function(options) {
        const chart = $("#chart").dxChart($.extend(true, {
            size: {
                width: 800,
                height: 600
            },
            animation: { enabled: false },
            dataSource: dataSource,
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

// TODO fallback
// TODO cancel events

QUnit.module("Panning", environment);

QUnit.test("Argument pan right by 1", function(assert) {
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();

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

QUnit.test("Argument pan right by 2 (discrete axis)", function(assert) {
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                type: "discrete",
                visualRange: {
                    startValue: 3,
                    endValue: 7
                }
            },
            zoomAndPan: {
                argumentAxis: "pan"
            },
            series: [{ type: "bar" }],
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(30).drag(30).drag(30).drag(30).drag(30).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7, categories: [3, 4, 5, 6, 7] });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7, categories: [3, 4, 5, 6, 7] });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 5, categories: [1, 2, 3, 4, 5] });
});

QUnit.test("Argument pan right out of the data", function(assert) {
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();

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
    const onZoomStart = sinon.spy(),
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

    const valueAxis = chart.getValueAxis();

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
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

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
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

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
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis("v1");
    const valueAxis2 = chart.getValueAxis("v2");

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
    const onZoomStart = sinon.spy(),
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
    const onZoomStart = sinon.spy(),
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
                valueAxis: "none",
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();

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
    const onZoomStart = sinon.spy(),
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
                valueAxis: "none",
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();

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

QUnit.test("zoom value axis", function(assert) {
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            valueAxis: {
                visualRange: {
                    startValue: 0.9,
                    endValue: 4.2
                }
            },
            zoomAndPan: {
                argumentAxis: "none",
                valueAxis: "zoom",
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 200, y: 400 }).wheel(10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 0.9, endValue: 4.2 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 0.9, endValue: 4.2 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 4 });
});

QUnit.test("zoom both axis", function(assert) {
    const onZoomStart = sinon.spy(),
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

    const valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 200, y: 400 }).wheel(10);

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis);
    assert.equal(onZoomEnd.getCall(1).args[0].axis, chart.getArgumentAxis());
});

QUnit.module("Wheel zooming. Multiple panes", environment);

QUnit.test("Multiaxes, zoom axes only in one pane", function(assert) {
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            size: {
                height: 610
            },
            zoomAndPan: {
                argumentAxis: "none",
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

    const valueAxis1 = chart.getValueAxis("v1");
    const valueAxis2 = chart.getValueAxis("v2");

    // act
    this.pointer.start({ x: 300, y: 200 }).wheel(10);

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
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            rotated: true,
            size: {
                width: 810
            },
            zoomAndPan: {
                argumentAxis: "none",
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

    const valueAxis3 = chart.getValueAxis("v3");

    // act
    this.pointer.start({ x: 100, y: 200 }).wheel(10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis3);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 5.8, endValue: 14.6 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis3);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 5.8, endValue: 14.6 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 6, endValue: 14 });
});

QUnit.test("Multiple panes. Check argument axes visual ranges", function(assert) {
    const onZoomStart = sinon.spy(),
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
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();

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
    const onZoomStart = sinon.spy(),
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

    const valueAxis = chart.getValueAxis();

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
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

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
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis("v1");
    const valueAxis2 = chart.getValueAxis("v2");

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
    const onZoomStart = sinon.spy(),
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
    const chart = this.createChart({
        zoomAndPan: {
            argumentAxis: "zoom",
            dragToZoom: true,
            dragBoxStyle: {
                color: "#121212",
                opacity: 0.32
            }
        }
    });
    let rects = chart._renderer.root.element.getElementsByTagName("rect");
    assert.equal(rects.length, 4);
    // act
    this.pointer.start({ x: 200, y: 250 }).dragStart();
    // assert
    assert.equal(rects.length, 5);

    let rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute("x"), "0");
    assert.equal(rect.getAttribute("y"), "0");
    assert.equal(rect.getAttribute("width"), "0");
    assert.equal(rect.getAttribute("height"), "0");
    assert.equal(rect.getAttribute("fill"), "#121212");
    assert.equal(rect.getAttribute("opacity"), "0.32");

    // act
    this.pointer.drag(400, 50);
    // assert
    rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute("x"), "200");
    assert.equal(rect.getAttribute("y"), "0");
    assert.equal(rect.getAttribute("width"), "400");
    assert.equal(rect.getAttribute("height"), "600");

    // act
    this.pointer.dragEnd();
    // assert
    assert.equal(chart._renderer.root.element.getElementsByTagName("rect").length, 4);
});

QUnit.test("Zoom value axis", function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: "zoom",
            dragToZoom: true
        }
    });

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240);
    // assert
    const rects = chart._renderer.root.element.getElementsByTagName("rect");
    const rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute("x"), "0");
    assert.equal(rect.getAttribute("y"), "120");
    assert.equal(rect.getAttribute("width"), "800");
    assert.equal(rect.getAttribute("height"), "240");
});

QUnit.test("Zoom argument and value axis", function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: "zoom",
            argumentAxis: "zoom",
            dragToZoom: true
        }
    });

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240);

    // assert
    const rects = chart._renderer.root.element.getElementsByTagName("rect");
    const rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute("x"), "200");
    assert.equal(rect.getAttribute("y"), "120");
    assert.equal(rect.getAttribute("width"), "400");
    assert.equal(rect.getAttribute("height"), "240");
});

QUnit.test("Zoom value axis, multiple panes, rotated", function(assert) {
    const chart = this.createChart({
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
    const rects = chart._renderer.root.element.getElementsByTagName("rect");
    const rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute("x"), "100");
    assert.equal(rect.getAttribute("y"), "0");
    assert.equal(rect.getAttribute("width"), "200");
    assert.equal(rect.getAttribute("height"), "600");
});

QUnit.module("Shutter zoom and drag combination", environment);

QUnit.test("Without panKey pressed drag action zooms chart", function(assert) {
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();

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
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();

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
    const onZoomStart = sinon.spy(),
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
                allowTouchGestures: true,
                dragToZoom: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

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
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "zoom",
                allowTouchGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

    // act
    const $root = $(chart._renderer.root.element);
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
    const onZoomStart = sinon.spy(),
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
                allowTouchGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

    // act
    const $root = $(chart._renderer.root.element);
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
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                visualRange: { startValue: 1, endValue: 9 }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "none",
                allowTouchGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();

    // act
    const $root = $(chart._renderer.root.element);
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

QUnit.test("Pinch zoom-in/zoom-out argument axis from some point (discrete axis)", function(assert) {
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                type: "discrete",
                visualRange: { startValue: 1, endValue: 9 }
            },
            zoomAndPan: {
                argumentAxis: "zoom",
                valueAxis: "none",
                allowTouchGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 150, pageY: 200 }, { pointerId: 2, pageX: 400, pageY: 200 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 100, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9, categories: [1, 2, 3, 4, 5, 6, 7, 8, 9] });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9, categories: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 7, categories: [2, 3, 4, 5, 6, 7] });

    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 100, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 200, pageY: 200 }, { pointerId: 2, pageX: 400, pageY: 200 }] }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 7, categories: [2, 3, 4, 5, 6, 7] });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1, endValue: 9, categories: [1, 2, 3, 4, 5, 6, 7, 8, 9] });

});

QUnit.module("ScrollBar", environment);

QUnit.test("Scrollbar pans only argument axis", function(assert) {
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            argumentAxis: {
                type: "discrete",
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

    const argumentAxis = chart.getArgumentAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event("dxc-scroll-end"));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7, categories: [3, 4, 5, 6, 7] });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7, categories: [3, 4, 5, 6, 7] });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6, categories: [2, 3, 4, 5, 6] });
});

QUnit.test("Scrollbar does not pan argument axis if it can not be panned", function(assert) {
    const onZoomStart = sinon.spy(),
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
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event("dxc-scroll-end"));

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.module("Check visualRange changing strategy choosing", environment);

QUnit.test("Drag. Small chart rendering time on start and big time in the middle", function(assert) {
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis("v1");
    const valueAxis2 = chart.getValueAxis("v2");

    // act
    // drag start
    this.pointer.start({ x: 150, y: 100 }).dragStart();

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 }, "Arg axis zoomStart");

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 4 }, "Val1 axis zoomStart");

    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 1, endValue: 3 }, "Val2 axis zoomStart");

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, "Arg axis visualRange after dragStart");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, "Val1 axis visualRange after dragStart");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, "Val2 axis visualRange after dragStart");

    // act
    // drag1
    onZoomStart.reset();
    this.pointer.drag(50, 50);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 2, endValue: 6 }, "Arg axis visualRange after drag1");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 3, endValue: 5 }, "Val1 axis visualRange after drag1");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 2, endValue: 4 }, "Val2 axis visualRange after drag1");

    // act
    // drag2
    chart._lastRenderingTime = 1000;
    this.pointer.drag(200, -300);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 5 }, "Arg axis visualRange after drag2");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1, endValue: 3 }, "Val1 axis visualRange after drag2");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 0, endValue: 2 }, "Val2 axis visualRange after drag2");


    // act
    // drag end
    this.pointer.dragEnd();

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 }, "Arg axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 5 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 }, "Val1 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1, endValue: 3 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 1, endValue: 3 }, "Val2 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 0, endValue: 2 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 5 }, "Arg axis visualRange after dragEnd");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1, endValue: 3 }, "Val1 axis visualRange after dragEnd");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 0, endValue: 2 }, "Val2 axis visualRange after dragEnd");
});

QUnit.test("Drag. Big chart rendering time on start and small time in the middle", function(assert) {
    const onZoomStart = sinon.spy(),
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

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis("v1");
    const valueAxis2 = chart.getValueAxis("v2");
    chart._lastRenderingTime = 1000;

    // act
    // drag start
    this.pointer.start({ x: 150, y: 100 }).dragStart();

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 }, "Arg axis zoomStart");

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 4 }, "Val1 axis zoomStart");

    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 1, endValue: 3 }, "Val2 axis zoomStart");

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, "Arg axis visualRange after dragStart");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, "Val1 axis visualRange after dragStart");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, "Val2 axis visualRange after dragStart");

    // act
    // drag1
    onZoomStart.reset();
    this.pointer.drag(50, 50);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, "Arg axis visualRange after drag1");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, "Val1 axis visualRange after drag1");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, "Val2 axis visualRange after drag1");

    // act
    // drag2
    chart._lastRenderingTime = 10;
    this.pointer.drag(200, -300);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, "Arg axis visualRange after drag2");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, "Val1 axis visualRange after drag2");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, "Val2 axis visualRange after drag2");


    // act
    // drag end
    this.pointer.dragEnd();

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 }, "Arg axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 5 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 }, "Val1 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1, endValue: 3 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 1, endValue: 3 }, "Val2 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 0, endValue: 2 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 5 }, "Arg axis visualRange after dragEnd");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1, endValue: 3 }, "Val1 axis visualRange after dragEnd");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 0, endValue: 2 }, "Val2 axis visualRange after dragEnd");
});

QUnit.test("Pinch zoom. Small chart rendering time on start and big time in the middle", function(assert) {
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            size: {
                height: 610
            },
            argumentAxis: {
                visualRange: { startValue: 1, endValue: 9 }
            },
            valueAxis: [
                { name: "v1", visualRange: { startValue: 0, endValue: 6 } },
                { name: "v2", visualRange: { startValue: 10, endValue: 16 }, wholeRange: { startValue: 0, endValue: 20 } },
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
                valueAxis: "zoom",
                argumentAxis: "zoom",
                allowTouchGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis("v1");
    const valueAxis2 = chart.getValueAxis("v2");
    const $root = $(chart._renderer.root.element);

    // act
    // pinch start
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 300, pageY: 150 }, { pointerId: 2, pageX: 500, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9 }, "Arg axis zoomStart");

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 6 }, "Val1 axis zoomStart");
    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 10, endValue: 16 }, "Val2 axis zoomStart");

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, "Arg axis visualRange after pinchStart");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, "Val1 axis visualRange after pinchStart");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, "Val2 axis visualRange after pinchStart");

    // act
    // pinch1
    onZoomStart.reset();
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 150 }, { pointerId: 2, pageX: 800, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 4, endValue: 6 }, "Arg axis visualRange after pinch1");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 3 - 0.75, endValue: 3 + 0.75 }, "Val1 axis visualRange after pinch1");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 13 - 0.75, endValue: 13 + 0.75 }, "Val2 axis visualRange after pinch1");

    // act
    // pinch2
    chart._lastRenderingTime = 1000;
    onZoomStart.reset();
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 200, pageY: 150 }, { pointerId: 2, pageX: 600, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, "Arg axis visualRange after pinch2");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1.5, endValue: 4.5 }, "Val1 axis visualRange after pinch2");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 11.5, endValue: 14.5 }, "Val2 axis visualRange after pinch2");

    // act
    // pinch end
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9 }, "Arg axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 6 }, "Val1 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1.5, endValue: 4.5 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 10, endValue: 16 }, "Val2 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 11.5, endValue: 14.5 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, "Arg axis visualRange after pinchEnd");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1.5, endValue: 4.5 }, "Val1 axis visualRange after pinchEnd");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 11.5, endValue: 14.5 }, "Val2 axis visualRange after pinchEnd");
});

QUnit.test("Pinch zoom. Big chart rendering time on start and small time in the middle", function(assert) {
    const onZoomStart = sinon.spy(),
        onZoomEnd = sinon.spy(),
        chart = this.createChart({
            size: {
                height: 610
            },
            argumentAxis: {
                visualRange: { startValue: 1, endValue: 9 }
            },
            valueAxis: [
                { name: "v1", visualRange: { startValue: 0, endValue: 6 } },
                { name: "v2", visualRange: { startValue: 10, endValue: 16 } },
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
                valueAxis: "zoom",
                argumentAxis: "zoom",
                allowTouchGestures: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis("v1");
    const valueAxis2 = chart.getValueAxis("v2");
    const $root = $(chart._renderer.root.element);

    chart._lastRenderingTime = 1000;
    // act
    // pinch start
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 300, pageY: 150 }, { pointerId: 2, pageX: 500, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9 }, "Arg axis zoomStart");

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 6 }, "Val1 axis zoomStart");
    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 10, endValue: 16 }, "Val2 axis zoomStart");

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, "Arg axis visualRange after pinchStart");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, "Val1 axis visualRange after pinchStart");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, "Val2 axis visualRange after pinchStart");

    // act
    // pinch1
    onZoomStart.reset();
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 150 }, { pointerId: 2, pageX: 800, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, "Arg axis visualRange after pinch1");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, "Val1 axis visualRange after pinch1");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, "Val2 axis visualRange after pinch1");

    // act
    // pinch2
    chart._lastRenderingTime = 10;
    onZoomStart.reset();
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 200, pageY: 150 }, { pointerId: 2, pageX: 600, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, "Arg axis visualRange after pinch2");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, "Val1 axis visualRange after pinch2");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, "Val2 axis visualRange after pinch2");

    // act
    // pinch end
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9 }, "Arg axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 6 }, "Val1 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1.5, endValue: 4.5 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 10, endValue: 16 }, "Val2 axis zoomEnd");
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 11.5, endValue: 14.5 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, "Arg axis visualRange after pinchEnd");
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1.5, endValue: 4.5 }, "Val1 axis visualRange after pinchEnd");
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 11.5, endValue: 14.5 }, "Val2 axis visualRange after pinchEnd");
});

QUnit.module("Misc", environment);

QUnit.test("Check css touch-action rule combinations", function(assert) {
    const chart = this.createChart();
    const checkRule = (function(val, arg, expected) {
        chart.option({
            zoomAndPan: {
                argumentAxis: val,
                valueAxis: arg
            }
        });
        const style = chart._renderer.root.element.getAttribute("style").replace(/:\s/g, ":");
        const taExpected = `touch-action:${expected};`;
        const msTaExpected = `-ms-touch-action:${expected};`;

        if(!expected) {
            assert.ok(style.indexOf("touch-action") === -1);
        } else {
            assert.ok(style.indexOf(taExpected) !== -1 || style.indexOf(msTaExpected) !== -1, expected);
        }
    }).bind(this);

    checkRule("none", "none", "");

    checkRule("zoom", "pan", "none");
    checkRule("pan", "zoom", "none");

    checkRule("zoom", "none", "pan-x pan-y");
    checkRule("none", "zoom", "pan-x pan-y");

    checkRule("pan", "none", "pinch-zoom");
    checkRule("none", "pan", "pinch-zoom");

    checkRule("none", "none", "");
});

QUnit.test("Do nothing if no actions allowed", function(assert) {
    const onZoomStart = sinon.spy(),
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
                allowTouchGestures: true,
                allowMouseWheel: true
            },
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

    // act
    const $root = $(chart._renderer.root.element);
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

QUnit.test("allowTouchGestures = false, do nothing on touch drag and pinch zoom", function(assert) {
    const onZoomStart = sinon.spy(),
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
            allowTouchGestures: false
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 100, y: 250, pointerType: "touch" }).dragStart().drag(100, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test("allowTouchGestures = true, only zoom allowed, touch drag - do nothing", function(assert) {
    const onZoomStart = sinon.spy(),
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
            allowTouchGestures: true
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
    const preventDefault = sinon.spy(),
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
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxdragstart", { pageX: 100, pageY: 250, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxdrag", { offset: { x: 100, y: 50 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxdragend", { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 3);
    assert.equal(stopPropagation.callCount, 3);
    assert.equal(this.trackerStopHandling.callCount, 3);
});

// T249548
QUnit.test("On mouse wheel", function(assert) {
    const preventDefault = sinon.spy(),
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
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxmousewheel", { d: 10, preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.equal(this.trackerStopHandling.callCount, 1);
});

QUnit.test("On pinch zoom", function(assert) {
    const preventDefault = sinon.spy(),
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
                allowTouchGestures: true
            }
        });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event("dxpointerdown", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event("dxpointermove", { pointerType: "touch", pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event("dxpointerup", { pointerType: "touch", pointers: [], preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 3);
    assert.equal(stopPropagation.callCount, 3);
    assert.equal(this.trackerStopHandling.callCount, 3);
});

QUnit.test("On ScrollBar", function(assert) {
    const preventDefault = sinon.spy(),
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
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event("dxc-scroll-start", { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxc-scroll-move", { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event("dxc-scroll-end", { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 3);
    assert.equal(stopPropagation.callCount, 3);
    assert.equal(this.trackerStopHandling.callCount, 3);
});

QUnit.test("Do not prevent and stop if no actions allowed", function(assert) {
    const preventDefault = sinon.spy(),
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
                allowTouchGestures: true,
                allowMouseWheel: true
            }
        });

    // act
    const $root = $(chart._renderer.root.element);
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
