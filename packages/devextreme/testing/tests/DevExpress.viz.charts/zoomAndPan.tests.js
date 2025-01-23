import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';

import 'viz/chart';

const CHART_SVG_SELECTOR = 'svg.dxc.dxc-chart';
const TOOLTIP_CLASS = 'dxc-tooltip';

const dataSource = (() => {
    const arr = [];
    for(let i = 0; i < 11; i++) {
        arr.push({ arg: i, val: Math.abs(5 - i) });
    }
    return arr;
})();
const environment = {
    beforeEach: function() {
        this.tooltipHiddenSpy = sinon.spy();
        this.clock = sinon.useFakeTimers();
    },
    createChart: function(options) {
        const chart = $('#chart').dxChart($.extend(true, {}, {
            size: {
                width: 800,
                height: 600
            },
            animation: { enabled: false },
            dataSource: dataSource,
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false },
                tick: { visible: false },
                visible: false
            },
            commonSeriesSettings: { point: { visible: false }, label: { visible: false } },
            series: [{}],
            legend: { visible: false }
        }, options)).dxChart('instance');

        this.pointer = pointerMock(chart._renderer.root.element).start();
        this.trackerStopHandling = sinon.stub(chart._tracker, 'stopCurrentHandling');

        return chart;
    },
    afterEach: function() {
        this.trackerStopHandling && this.trackerStopHandling.restore();
        this.clock.restore();
    }
};

QUnit.testStart(function() {
    $('#qunit-fixture').addClass('qunit-fixture-visible').html('<div id=\'chart\'></div>');
});

// TODO fallback
// TODO cancel events

QUnit.module('Panning', environment);

QUnit.test('Argument pan right by 1', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan'
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
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'pan');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxdragstart');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6 });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'pan');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxdragend');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -1);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);
});

QUnit.test('Argument pan right by 2 (discrete axis)', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            type: 'discrete',
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan'
        },
        series: [{ type: 'bar' }],
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -2);
});

QUnit.test('Argument pan right out of the data', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan'
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -3);
});

QUnit.test('Value pan bottom by 1', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 2,
                endValue: 4
            }
        },
        zoomAndPan: {
            valueAxis: 'pan'
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 1);
});

QUnit.test('Argument and value', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            valueAxis: 'pan',
            argumentAxis: 'pan'
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -1);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 3, endValue: 5 });
    assert.equal(onZoomEnd.getCall(1).args[0].shift, 1);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 1);
});

QUnit.test('Argument and value. Multiple axis chart with empty axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        valueAxis: [{
            visualRange: {
                startValue: 2,
                endValue: 4
            }
        }, {
            name: 'axis2'
        }],
        zoomAndPan: {
            valueAxis: 'pan',
            argumentAxis: 'pan'
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -1);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 3, endValue: 5 });
    assert.equal(onZoomEnd.getCall(1).args[0].shift, 1);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 1);
});

QUnit.test('Argument and value. Rotated', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            valueAxis: 'pan',
            argumentAxis: 'pan'
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 1);

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 3, endValue: 7 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 2, endValue: 6 });
    assert.equal(onZoomEnd.getCall(1).args[0].shift, -1);
});

QUnit.test('Argument and value. Multiple panes', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            { name: 'v1', visualRange: { startValue: 2, endValue: 4 } },
            { name: 'v2', visualRange: { startValue: 1, endValue: 3 } },
            { name: 'v3', visualRange: { startValue: 2, endValue: 4 } }
        ],
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        zoomAndPan: {
            valueAxis: 'pan',
            argumentAxis: 'pan'
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');

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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -1);

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 3, endValue: 5 });
    assert.equal(onZoomEnd.getCall(1).args[0].shift, 1);

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 1, endValue: 3 });
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 2, endValue: 4 });
    assert.equal(onZoomEnd.getCall(2).args[0].shift, 1);
});

QUnit.test('Multiple panes. Check argument axes visual ranges', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1' },
            { pane: 'p2' }
        ],
        zoomAndPan: {
            argumentAxis: 'pan'
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

QUnit.module('Wheel zooming', environment);

QUnit.test('[T684665] Chart - zooming-out with multiple value axes leads to wrong axes synchronization', function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: 'both',
            argumentAxis: 'none',
            dragToZoom: true
        },
        size: {
            height: 500
        },
        scrollBar: { visible: true },
        valueAxis: [
            { name: 'a1' },
            { name: 'a2' }
        ],
        panes: [
            { name: 'p2' }
        ],
        dataSource: Array.apply(null, Array(100)).map((_, i) => ({ arg: i, val1: Math.sin(i * 2), val2: Math.sin(i * 3 + 10) / 3 })),
        series: [
            { pane: 'p2', axis: 'a1', valueField: 'val1' },
            { pane: 'p2', axis: 'a2', valueField: 'val2' }
        ],
        commonAxisSettings: {
            label: { visible: true }
        }
    });

    // act
    this.pointer.start({ x: 10, y: 100 });
    this.pointer.wheel(100);
    this.pointer.wheel(-100);

    const mainValue = 0;
    const valueAxes = [chart.getValueAxis('a1'), chart.getValueAxis('a2')];
    const labelsCoords = valueAxes.map((axis) => {
        let tick = {};
        for(let i = 0; i < axis._majorTicks.length; i++) {
            if(axis._majorTicks[i].value === mainValue) {
                tick = axis._majorTicks[i];
                break;
            }
        }

        const coords = tick.coords || {};

        return [coords.x, coords.y];
    });

    const stubCoords = [undefined, undefined];

    assert.equal(labelsCoords.length, 2);
    assert.notDeepEqual(labelsCoords[0], stubCoords);
    assert.notDeepEqual(labelsCoords[1], stubCoords);

    assert.deepEqual(labelsCoords[0], labelsCoords[1]);
});

QUnit.test('Reject zoom-in by minVisualRangeLength option', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 6.9,
                endValue: 7.3
            },
            minVisualRangeLength: 0.5
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'none',
            allowMouseWheel: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const visualRange = argumentAxis.visualRange();

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, visualRange);
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxmousewheel');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, visualRange);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, visualRange);
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxmousewheel');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);
});

QUnit.test('Allow zoom-out by minVisualRangeLength option', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 6.5,
                endValue: 7.3
            },
            minVisualRangeLength: 1
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'none',
            allowMouseWheel: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const visualRange = argumentAxis.visualRange();

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(-10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, visualRange);
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxmousewheel');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, visualRange);
    assert.roughEqual(onZoomEnd.getCall(0).args[0].range.startValue, 6.477, 0.005);
    assert.roughEqual(onZoomEnd.getCall(0).args[0].range.endValue, 7.366, 0.005);
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxmousewheel');
    assert.roughEqual(onZoomEnd.getCall(0).args[0].shift, 0.02, 0.005);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 0.9);
});

QUnit.test('T741577. Reset initial whole range after dataSource is changed', function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: 'zoom',
            allowMouseWheel: true
        }
    });

    chart.option('dataSource', [{ arg: 1, val: 1 }, { arg: 2, val: 2 }]);

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(-10);
    assert.deepEqual(chart.getValueAxis().visualRange(), {
        startValue: 1,
        endValue: 2
    });
});

QUnit.test('Zoom-in argument axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 2.9,
                endValue: 7.3
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'none',
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
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxmousewheel');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2.9, endValue: 7.3 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxmousewheel');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -0.1);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1.1);
});

QUnit.test('Zoom-out argument axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3.1,
                endValue: 6.7
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'none',
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0.1);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 0.9);
});

QUnit.test('zoom value axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 0.9,
                endValue: 4.2
            }
        },
        zoomAndPan: {
            argumentAxis: 'none',
            valueAxis: 'zoom',
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
    const zoomEndRange = onZoomEnd.getCall(0).args[0].range;
    assert.roughEqual(zoomEndRange.startValue, 1, 0.1);
    assert.roughEqual(zoomEndRange.endValue, 4, 0.1);
    assert.roughEqual(onZoomEnd.getCall(0).args[0].shift, -0.05, 0.01);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1.1);
});

QUnit.test('zoom both axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();

    this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 0.9,
                endValue: 4.2
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowMouseWheel: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 200, y: 400 }).wheel(10);

    assert.equal(onZoomEnd.callCount, 2);

    assert.roughEqual(onZoomEnd.getCall(0).args[0].shift, -0.23, 0.05);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1.1);
    assert.roughEqual(onZoomEnd.getCall(1).args[0].shift, -0.05, 0.05);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 1.1);
});

QUnit.module('Wheel zooming. Multiple panes', environment);

QUnit.test('Multiaxes, zoom axes only in one pane', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        size: {
            height: 610
        },
        zoomAndPan: {
            argumentAxis: 'none',
            valueAxis: 'zoom',
            allowMouseWheel: true
        },
        commonAxisSettings: {
            valueMarginsEnabled: false,
            endOnTick: false
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        valueAxis: [
            { name: 'v1', visualRange: { startValue: 0.9, endValue: 4.2 } },
            { name: 'v2', visualRange: { startValue: 1.8, endValue: 8.4 } },
            { name: 'v3', visualRange: { startValue: 0.9, endValue: 4.2 } }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');

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
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 2, endValue: 8 }, 'axis 2 onZoomEnd range');
});

QUnit.test('tooltip should be shown after hovering over the zoomed chart (T1197697)', function(assert) {
    const chart = $('#chart').dxChart({
        title: 'Chart',
        zoomAndPan: {
            allowMouseWheel: true,
            dragToZoom: true,
            argumentAxis: 'both'
        },
        tooltip: { enabled: true, shared: true, location: 'center' },
        panes: [{ name: 'pane1', height: 500.0 }],
        commonSeriesSettings: {
            type: 'stepline',
            argumentField: 'Argument',
            point: { visible: true, size: 100 }
        },
        series: [
            {
                name: 'series1',
                valueField: 'Value1',
                color: 'rgb(255,0,0)',
                pane: 'pane1',
            },
            {
                name: 'series2',
                valueField: 'Value2',
                color: 'rgb(0,0,255)',
                pane: 'pane1',
            }
        ],
        dataSource: [
            {
                Argument: new Date(2023, 9, 26, 15, 17, 22, 753),
                Value1: 24.866858415709277,
                Value2: 1.1074397718102855,
                Value3: 0.46701067987224587
            },
            {
                Argument: new Date(2023, 9, 26, 15, 32, 22, 753),
                Value1: 77.16041220219824,
                Value2: 6.575188937864819,
                Value3: 0.43278260130099144
            },
            {
                Argument: new Date(2023, 9, 26, 15, 47, 22, 753),
                Value1: 35.408376360036605,
                Value2: 9.438622761256351,
                Value3: 0.10126645355544353
            },
        ],
    }).dxChart('instance');

    const $chartElement = $(chart.$element().find(CHART_SVG_SELECTOR));
    const pointer = pointerMock($chartElement[0]).start();

    pointer.start({ x: 100, y: 200 }).wheel(150);
    $chartElement.trigger($.Event('dxpointermove', { pointerType: 'mouse', pageX: 54, pageY: 541 }));

    const tooltip = $(`.${TOOLTIP_CLASS}`)[0];

    assert.ok(tooltip);
});

QUnit.test('Multiaxes, zoom axes only in one pane. Rotated', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        rotated: true,
        size: {
            width: 810
        },
        zoomAndPan: {
            argumentAxis: 'none',
            valueAxis: 'zoom',
            allowMouseWheel: true
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        valueAxis: [
            { name: 'v1', visualRange: { startValue: 2.9, endValue: 7.3 } },
            { name: 'v2', visualRange: { startValue: 2.9, endValue: 7.3 } },
            { name: 'v3', visualRange: { startValue: 5.8, endValue: 14.6 } }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        synchronizeMultiAxes: false,
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const valueAxis3 = chart.getValueAxis('v3');

    // act
    this.pointer.start({ x: 100, y: 200 }).wheel(10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, valueAxis3);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 5.8, endValue: 14.6 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, valueAxis3);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 5.8, endValue: 14.6 });
    const zoomEndRange = onZoomEnd.getCall(0).args[0].range;
    assert.roughEqual(zoomEndRange.startValue, 6, 0.1);
    assert.roughEqual(zoomEndRange.endValue, 14, 0.1);
});

QUnit.test('Multiple panes. Check argument axes visual ranges', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 2.9,
                endValue: 7.3
            }
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1' },
            { pane: 'p2' }
        ],
        zoomAndPan: {
            argumentAxis: 'zoom',
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

QUnit.test('Multiple panes. Cancel argument mousewheel zooming on zoomStart', function(assert) {
    const chart = this.createChart({
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
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1' },
            { pane: 'p2' }
        ],
        zoomAndPan: {
            argumentAxis: 'both'
        },
        onZoomStart(e) {
            e.cancel = true;
        }
    });

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 });
    });
});

QUnit.module('Wheel zooming. Mouse on axis', environment);

QUnit.test('Mouse over value axis - zoom only value axes in one pane axes', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        size: {
            height: 610
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowMouseWheel: true
        },
        commonAxisSettings: {
            valueMarginsEnabled: false,
            endOnTick: false
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        valueAxis: [
            { name: 'v1', visualRange: { startValue: 0.9, endValue: 4.2 }, placeholderSize: 100 },
            { name: 'v2', visualRange: { startValue: 1.8, endValue: 8.4 }, placeholderSize: 100 },
            { name: 'v3', visualRange: { startValue: 0.9, endValue: 4.2 }, placeholderSize: 100 }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');

    // act
    this.pointer.start({ x: 75, y: 200 }).wheel(10);

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

QUnit.test('Mouse over argument axis - zoom only argument axes', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        size: {
            width: 900,
            height: 700
        },
        commonAxisSettings: {
            placeholderSize: 100
        },
        argumentAxis: {
            visualRange: {
                startValue: 2.9,
                endValue: 7.3
            }
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1' },
            { pane: 'p2' }
        ],
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowMouseWheel: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 300, y: 650 }).wheel(10);

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 });
    });
});

QUnit.test('Mouse not on axes nor panes - do not zoom any axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    this.createChart({
        size: {
            height: 710,
            width: 900
        },
        commonAxisSettings: {
            placeholderSize: 100
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowMouseWheel: true
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        valueAxis: [
            { name: 'v1', visualRange: { startValue: 0.9, endValue: 4.2 } },
            { name: 'v2', visualRange: { startValue: 1.8, endValue: 8.4 } },
            { name: 'v3', visualRange: { startValue: 0.9, endValue: 4.2 } }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 50, y: 650 }).wheel(10);

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.module('Shutter zoom. Test zooming', environment);

QUnit.test('Zoom argument axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 2,
                endValue: 10
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
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
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxdragend');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 4, endValue: 8 });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxdragend');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 2);
});

QUnit.test('Correct zooming by minVisualRangeLength option', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 6.5,
                endValue: 8
            },
            minVisualRangeLength: 1
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            dragToZoom: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const visualRange = argumentAxis.visualRange();

    // act
    this.pointer.start({ x: 300, y: 250 }).dragStart().drag(400, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, visualRange);
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxdragend');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, visualRange);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 7.0625, endValue: 8.0625 });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxdragend');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0.3125);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1.5);
});

QUnit.test('Zoom value axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 0,
                endValue: 5
            }
        },
        zoomAndPan: {
            valueAxis: 'zoom',
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
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0.5);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 2.5);
});

QUnit.test('Zoom argument and value axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            valueAxis: 'zoom',
            argumentAxis: 'zoom',
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

QUnit.test('Zoom argument axis. Argument axis has too small zoom area', function(assert) {
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: 'zoom',
            argumentAxis: 'zoom',
            dragToZoom: true
        },
        onZoomEnd: onZoomEnd
    });

    const valueAxis = chart.getValueAxis();

    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(5, 240).dragEnd();

    assert.strictEqual(onZoomEnd.callCount, 1);
    assert.strictEqual(onZoomEnd.getCall(0).args[0].axis, valueAxis, 'zoom end for value axis');
});

QUnit.test('Zoom value axis. Value axis has too small zoom area', function(assert) {
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            valueAxis: 'zoom',
            argumentAxis: 'zoom',
            dragToZoom: true
        },
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 5).dragEnd();

    assert.strictEqual(onZoomEnd.callCount, 1);
    assert.strictEqual(onZoomEnd.getCall(0).args[0].axis, argumentAxis, 'zoom end for argument axis');
});

QUnit.test('Multiaxes, zoom axes only in one pane. Rotated', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        rotated: true,
        size: {
            width: 810
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            dragToZoom: true
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        argumentAxis: {
            visualRange: { startValue: 2, endValue: 8 }
        },
        valueAxis: [
            { name: 'v1', visualRange: { startValue: 0, endValue: 4 } },
            { name: 'v2', visualRange: { startValue: 2, endValue: 10 } },
            { name: 'v3', visualRange: { startValue: 4, endValue: 5 } }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        synchronizeMultiAxes: false,
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');

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

QUnit.test('Multiple panes. Check argument axes visual ranges', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            argumentAxis: 'zoom',
            dragToZoom: true
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1' },
            { pane: 'p2' }
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

QUnit.test('Multiple panes. Cancel zooming on zoomStart', function(assert) {
    const chart = this.createChart({
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
            argumentAxis: 'zoom',
            dragToZoom: true
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1' },
            { pane: 'p2' }
        ],
        onZoomStart(e) {
            e.cancel = true;
        }
    });

    // act
    this.pointer.start({ x: 200, y: 250 }).dragStart().drag(400, 50).dragEnd();

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 2, endValue: 10 });
    });
});

QUnit.module('Shutter zoom. Test shutter rendering', environment);

QUnit.test('Zoom argument axis', function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            argumentAxis: 'zoom',
            dragToZoom: true,
            dragBoxStyle: {
                color: '#121212',
                opacity: 0.32
            }
        }
    });
    const rects = chart._renderer.root.element.getElementsByTagName('rect');
    assert.equal(rects.length, 4);
    // act
    this.pointer.start({ x: 200, y: 250 }).dragStart();
    // assert
    assert.equal(rects.length, 5);

    let rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute('x'), '0');
    assert.equal(rect.getAttribute('y'), '0');
    assert.equal(rect.getAttribute('width'), '0');
    assert.equal(rect.getAttribute('height'), '0');
    assert.equal(rect.getAttribute('fill'), '#121212');
    assert.equal(rect.getAttribute('opacity'), '0.32');

    // act
    this.pointer.drag(400, 50);
    // assert
    rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute('x'), '200');
    assert.equal(rect.getAttribute('y'), '0');
    assert.equal(rect.getAttribute('width'), '400');
    assert.equal(rect.getAttribute('height'), '600');

    // act
    this.pointer.dragEnd();
    // assert
    assert.equal(chart._renderer.root.element.getElementsByTagName('rect').length, 4);
});

QUnit.test('Zoom value axis', function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: 'zoom',
            dragToZoom: true
        }
    });

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240);
    // assert
    const rects = chart._renderer.root.element.getElementsByTagName('rect');
    const rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute('x'), '0');
    assert.equal(rect.getAttribute('y'), '120');
    assert.equal(rect.getAttribute('width'), '800');
    assert.equal(rect.getAttribute('height'), '240');
});

QUnit.test('Zoom argument and value axis', function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: 'zoom',
            argumentAxis: 'zoom',
            dragToZoom: true
        }
    });

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240);

    // assert
    const rects = chart._renderer.root.element.getElementsByTagName('rect');
    const rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute('x'), '200');
    assert.equal(rect.getAttribute('y'), '120');
    assert.equal(rect.getAttribute('width'), '400');
    assert.equal(rect.getAttribute('height'), '240');
});

QUnit.test('Zoom value axis, multiple panes, rotated', function(assert) {
    const chart = this.createChart({
        rotated: true,
        zoomAndPan: {
            valueAxis: 'zoom',
            dragToZoom: true
        },
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1' },
            { pane: 'p2' }
        ]
    });

    // act
    this.pointer.start({ x: 100, y: 120 }).dragStart().drag(200, 240);
    // assert
    const rects = chart._renderer.root.element.getElementsByTagName('rect');
    const rect = rects[rects.length - 1];
    assert.equal(rect.getAttribute('x'), '100');
    assert.equal(rect.getAttribute('y'), '0');
    assert.equal(rect.getAttribute('width'), '200');
    assert.equal(rect.getAttribute('height'), '600');
});

QUnit.module('Shutter zoom and drag combination', environment);

QUnit.test('Without panKey pressed drag action zooms chart', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 2,
                endValue: 10
            }
        },
        zoomAndPan: {
            argumentAxis: 'both',
            dragToZoom: true,
            panKey: 'shift'
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
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxdragend');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 4, endValue: 8 });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxdragend');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 2);
});

QUnit.test('With panKey pressed drag action zooms chart', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 2,
                endValue: 10
            }
        },
        zoomAndPan: {
            argumentAxis: 'both',
            dragToZoom: true,
            panKey: 'shift'
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
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'pan');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxdragstart');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 2, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 0, endValue: 8 });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'pan');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxdragend');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -2);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);
});

QUnit.module('Touch devices', environment);

QUnit.test('[T684665] Chart - zooming-out with multiple value axes leads to wrong axes synchronization', function(assert) {
    const chart = this.createChart({
        zoomAndPan: {
            valueAxis: 'both',
            argumentAxis: 'none',
            dragToZoom: true
        },
        scrollBar: { visible: true },
        valueAxis: [
            { name: 'a1' },
            { name: 'a2' }
        ],
        panes: [
            { name: 'p2' }
        ],
        dataSource: Array.apply(null, Array(100)).map((_, i) => ({ arg: i, val1: Math.sin(i * 2), val2: Math.sin(i * 3 + 10) / 3 })),
        series: [
            { pane: 'p2', axis: 'a1', valueField: 'val1' },
            { pane: 'p2', axis: 'a2', valueField: 'val2' }
        ],
        commonAxisSettings: {
            label: { visible: true }
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 100, pageY: 100 }, { pointerId: 2, pageX: 150, pageY: 150 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 100, pageY: 100 }, { pointerId: 2, pageX: 200, pageY: 200 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    const mainValue = 0;
    const valueAxes = [chart.getValueAxis('a1'), chart.getValueAxis('a2')];
    const labelsCoords = valueAxes.map((axis) => {
        let tick = {};
        for(let i = 0; i < axis._majorTicks.length; i++) {
            if(axis._majorTicks[i].value === mainValue) {
                tick = axis._majorTicks[i];
                break;
            }
        }

        const coords = tick.coords || {};

        return [coords.x, coords.y];
    });

    const stubCoords = [undefined, undefined];

    assert.equal(labelsCoords.length, 2);
    assert.notDeepEqual(labelsCoords[0], stubCoords);
    assert.notDeepEqual(labelsCoords[1], stubCoords);

    assert.deepEqual(labelsCoords[0], labelsCoords[1]);
});

QUnit.test('Drag by touch pans chart, even if dragToZoom = true', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            valueAxis: 'both',
            argumentAxis: 'both',
            allowTouchGestures: true,
            dragToZoom: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 150, y: 100, pointerType: 'touch' }).dragStart().drag(50, 200).dragEnd();

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 });
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'pan');

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

QUnit.test('Reject pinch zoom-in both axes', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3.5,
                endValue: 3.51
            }
        },
        valueAxis: {
            visualRange: {
                startValue: 1.99,
                endValue: 2
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();
    const argVisualRange = argumentAxis.visualRange();
    const valVisualRange = valueAxis.visualRange();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, argVisualRange);
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxpinchstart');

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, valVisualRange);

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, argVisualRange);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, argVisualRange);
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxpinchend');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, valVisualRange);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, valVisualRange);
    assert.equal(onZoomEnd.getCall(1).args[0].shift, 0);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 1);
});

QUnit.test('Pinch zoom-in both axes', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 0, endValue: 10 });
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxpinchstart');

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 5 });

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 0, endValue: 10 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 0, endValue: 5 });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'zoom');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxpinchend');

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 5 });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 2.5, endValue: 5 });
    assert.equal(onZoomEnd.getCall(1).args[0].shift, 1.25);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 2);
});

QUnit.test('Pinch zoom-out both axes', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: { startValue: 0, endValue: 5 }
        },
        valueAxis: {
            visualRange: { startValue: 2.5, endValue: 5 }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

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
    assert.equal(onZoomEnd.getCall(1).args[0].shift, -1.25);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 0.5);
});

QUnit.test('Pinch zoom-in argument axis from some point', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: { startValue: 1, endValue: 9 }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'none',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 200, pageY: 200 }, { pointerId: 2, pageX: 400, pageY: 200 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 100, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9 });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9 });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2.5, endValue: 6.5 });
});

QUnit.test('Pinch zoom-in/zoom-out argument axis from some point (discrete axis)', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            type: 'discrete',
            visualRange: { startValue: 1, endValue: 9 }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'none',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 150, pageY: 200 }, { pointerId: 2, pageX: 400, pageY: 200 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 100, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9, categories: [1, 2, 3, 4, 5, 6, 7, 8, 9] });

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9, categories: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 7, categories: [2, 3, 4, 5, 6, 7] });
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -1);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1.5);

    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 100, pageY: 200 }, { pointerId: 2, pageX: 500, pageY: 200 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 200, pageY: 200 }, { pointerId: 2, pageX: 400, pageY: 200 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 7, categories: [2, 3, 4, 5, 6, 7] });
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1, endValue: 9, categories: [1, 2, 3, 4, 5, 6, 7, 8, 9] });
    assert.equal(onZoomEnd.getCall(1).args[0].shift, 1);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 0.67);
});

QUnit.module('ScrollBar', environment);

QUnit.test('Scrollbar pans only argument axis', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            type: 'discrete',
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan',
            valueAxis: 'pan'
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxc-scroll-start', { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event('dxc-scroll-move', { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event('dxc-scroll-end'));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7, categories: [3, 4, 5, 6, 7] });
    assert.equal(onZoomStart.getCall(0).args[0].actionType, 'pan');
    assert.equal(onZoomStart.getCall(0).args[0].event.type, 'dxc-scroll-start');

    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7, categories: [3, 4, 5, 6, 7] });
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 2, endValue: 6, categories: [2, 3, 4, 5, 6] });
    assert.equal(onZoomEnd.getCall(0).args[0].actionType, 'pan');
    assert.equal(onZoomEnd.getCall(0).args[0].event.type, 'dxc-scroll-end');
    assert.equal(onZoomEnd.getCall(0).args[0].shift, -1);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);
});

QUnit.test('Scrollbar does not pan argument axis if it can not be panned', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        scrollBar: {
            visible: true
        },
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'pan'
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const scrollBarElement = $(chart._scrollBar._scroll.element);
    const scrollBarOffset = scrollBarElement.offset();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxc-scroll-start', { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event('dxc-scroll-move', { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event('dxc-scroll-end'));

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
    assert.deepEqual(scrollBarElement.offset(), scrollBarOffset);
});

QUnit.module('Check visualRange changing strategy choosing', environment);

QUnit.test('Drag. Small chart rendering time on start and big time in the middle', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            { name: 'v1', visualRange: { startValue: 2, endValue: 4 } },
            { name: 'v2', visualRange: { startValue: 1, endValue: 3 } },
            { name: 'v3', visualRange: { startValue: 2, endValue: 4 } }
        ],
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        zoomAndPan: {
            valueAxis: 'pan',
            argumentAxis: 'pan'
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');

    // act
    // drag start
    this.pointer.start({ x: 150, y: 100 }).dragStart();

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 }, 'Arg axis zoomStart');

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 4 }, 'Val1 axis zoomStart');

    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 1, endValue: 3 }, 'Val2 axis zoomStart');

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, 'Arg axis visualRange after dragStart');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, 'Val1 axis visualRange after dragStart');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, 'Val2 axis visualRange after dragStart');

    // act
    // drag1
    onZoomStart.resetHistory();
    this.pointer.drag(50, 50);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 2, endValue: 6 }, 'Arg axis visualRange after drag1');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 3, endValue: 5 }, 'Val1 axis visualRange after drag1');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 2, endValue: 4 }, 'Val2 axis visualRange after drag1');

    // act
    // drag2
    chart._lastRenderingTime = 1000;
    this.pointer.drag(200, -300);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 5 }, 'Arg axis visualRange after drag2');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1, endValue: 3 }, 'Val1 axis visualRange after drag2');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 0, endValue: 2 }, 'Val2 axis visualRange after drag2');


    // act
    // drag end
    this.pointer.dragEnd();

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 }, 'Arg axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 5 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 }, 'Val1 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1, endValue: 3 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 1, endValue: 3 }, 'Val2 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 0, endValue: 2 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 5 }, 'Arg axis visualRange after dragEnd');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1, endValue: 3 }, 'Val1 axis visualRange after dragEnd');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 0, endValue: 2 }, 'Val2 axis visualRange after dragEnd');
});

QUnit.test('Drag. Big chart rendering time on start and small time in the middle', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
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
            { name: 'v1', visualRange: { startValue: 2, endValue: 4 } },
            { name: 'v2', visualRange: { startValue: 1, endValue: 3 } },
            { name: 'v3', visualRange: { startValue: 2, endValue: 4 } }
        ],
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        zoomAndPan: {
            valueAxis: 'pan',
            argumentAxis: 'pan'
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');
    chart._lastRenderingTime = 1000;

    // act
    // drag start
    this.pointer.start({ x: 150, y: 100 }).dragStart();

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 3, endValue: 7 }, 'Arg axis zoomStart');

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 2, endValue: 4 }, 'Val1 axis zoomStart');

    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 1, endValue: 3 }, 'Val2 axis zoomStart');

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, 'Arg axis visualRange after dragStart');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, 'Val1 axis visualRange after dragStart');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, 'Val2 axis visualRange after dragStart');

    // act
    // drag1
    onZoomStart.resetHistory();
    this.pointer.drag(50, 50);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, 'Arg axis visualRange after drag1');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, 'Val1 axis visualRange after drag1');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, 'Val2 axis visualRange after drag1');

    // act
    // drag2
    chart._lastRenderingTime = 10;
    this.pointer.drag(200, -300);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, 'Arg axis visualRange after drag2');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 2, endValue: 4 }, 'Val1 axis visualRange after drag2');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 1, endValue: 3 }, 'Val2 axis visualRange after drag2');


    // act
    // drag end
    this.pointer.dragEnd();

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 3, endValue: 7 }, 'Arg axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 1, endValue: 5 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 2, endValue: 4 }, 'Val1 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1, endValue: 3 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 1, endValue: 3 }, 'Val2 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 0, endValue: 2 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 5 }, 'Arg axis visualRange after dragEnd');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1, endValue: 3 }, 'Val1 axis visualRange after dragEnd');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 0, endValue: 2 }, 'Val2 axis visualRange after dragEnd');
});

QUnit.test('Pinch zoom. Small chart rendering time on start and big time in the middle', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        size: {
            height: 610
        },
        argumentAxis: {
            visualRange: { startValue: 1, endValue: 9 }
        },
        valueAxis: [
            { name: 'v1', visualRange: { startValue: 0, endValue: 6 } },
            { name: 'v2', visualRange: { startValue: 10, endValue: 16 }, wholeRange: { startValue: 0, endValue: 20 } },
            { name: 'v3', visualRange: { startValue: 2, endValue: 4 } }
        ],
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        zoomAndPan: {
            valueAxis: 'zoom',
            argumentAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');
    const $root = $(chart._renderer.root.element);

    // act
    // pinch start
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 300, pageY: 150 }, { pointerId: 2, pageX: 500, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9 }, 'Arg axis zoomStart');

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 6 }, 'Val1 axis zoomStart');
    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 10, endValue: 16 }, 'Val2 axis zoomStart');

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, 'Arg axis visualRange after pinchStart');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, 'Val1 axis visualRange after pinchStart');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, 'Val2 axis visualRange after pinchStart');

    // act
    // pinch1
    onZoomStart.resetHistory();
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 150 }, { pointerId: 2, pageX: 800, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 4, endValue: 6 }, 'Arg axis visualRange after pinch1');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 3 - 0.75, endValue: 3 + 0.75 }, 'Val1 axis visualRange after pinch1');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 13 - 0.75, endValue: 13 + 0.75 }, 'Val2 axis visualRange after pinch1');

    // act
    // pinch2
    chart._lastRenderingTime = 1000;
    onZoomStart.resetHistory();
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 200, pageY: 150 }, { pointerId: 2, pageX: 600, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, 'Arg axis visualRange after pinch2');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1.5, endValue: 4.5 }, 'Val1 axis visualRange after pinch2');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 11.5, endValue: 14.5 }, 'Val2 axis visualRange after pinch2');

    // act
    // pinch end
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9 }, 'Arg axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 6 }, 'Val1 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1.5, endValue: 4.5 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 10, endValue: 16 }, 'Val2 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 11.5, endValue: 14.5 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, 'Arg axis visualRange after pinchEnd');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1.5, endValue: 4.5 }, 'Val1 axis visualRange after pinchEnd');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 11.5, endValue: 14.5 }, 'Val2 axis visualRange after pinchEnd');
});

QUnit.test('Pinch zoom. Big chart rendering time on start and small time in the middle', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        size: {
            height: 610
        },
        argumentAxis: {
            visualRange: { startValue: 1, endValue: 9 }
        },
        valueAxis: [
            { name: 'v1', visualRange: { startValue: 0, endValue: 6 } },
            { name: 'v2', visualRange: { startValue: 10, endValue: 16 } },
            { name: 'v3', visualRange: { startValue: 2, endValue: 4 } }
        ],
        panes: [
            { name: 'p1' },
            { name: 'p2' }
        ],
        series: [
            { pane: 'p1', axis: 'v1' },
            { pane: 'p1', axis: 'v2' },
            { pane: 'p2', axis: 'v3' }
        ],
        zoomAndPan: {
            valueAxis: 'zoom',
            argumentAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis1 = chart.getValueAxis('v1');
    const valueAxis2 = chart.getValueAxis('v2');
    const $root = $(chart._renderer.root.element);

    chart._lastRenderingTime = 1000;
    // act
    // pinch start
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 300, pageY: 150 }, { pointerId: 2, pageX: 500, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 3);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, { startValue: 1, endValue: 9 }, 'Arg axis zoomStart');

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, { startValue: 0, endValue: 6 }, 'Val1 axis zoomStart');
    assert.equal(onZoomStart.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomStart.getCall(2).args[0].range, { startValue: 10, endValue: 16 }, 'Val2 axis zoomStart');

    assert.equal(onZoomEnd.callCount, 0);
    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, 'Arg axis visualRange after pinchStart');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, 'Val1 axis visualRange after pinchStart');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, 'Val2 axis visualRange after pinchStart');

    // act
    // pinch1
    onZoomStart.resetHistory();
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 150 }, { pointerId: 2, pageX: 800, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, 'Arg axis visualRange after pinch1');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, 'Val1 axis visualRange after pinch1');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, 'Val2 axis visualRange after pinch1');

    // act
    // pinch2
    chart._lastRenderingTime = 10;
    onZoomStart.resetHistory();
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 200, pageY: 150 }, { pointerId: 2, pageX: 600, pageY: 150 }] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 1, endValue: 9 }, 'Arg axis visualRange after pinch2');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 0, endValue: 6 }, 'Val1 axis visualRange after pinch2');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 10, endValue: 16 }, 'Val2 axis visualRange after pinch2');

    // act
    // pinch end
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 3);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: 1, endValue: 9 }, 'Arg axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: 3, endValue: 7 });

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis1);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, { startValue: 0, endValue: 6 }, 'Val1 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, { startValue: 1.5, endValue: 4.5 });

    assert.equal(onZoomEnd.getCall(2).args[0].axis, valueAxis2);
    assert.deepEqual(onZoomEnd.getCall(2).args[0].previousRange, { startValue: 10, endValue: 16 }, 'Val2 axis zoomEnd');
    assert.deepEqual(onZoomEnd.getCall(2).args[0].range, { startValue: 11.5, endValue: 14.5 });

    chart._argumentAxes.forEach(axis => {
        assert.deepEqual(axis.visualRange(), { startValue: 3, endValue: 7 }, 'Arg axis visualRange after pinchEnd');
    });
    assert.deepEqual(valueAxis1.visualRange(), { startValue: 1.5, endValue: 4.5 }, 'Val1 axis visualRange after pinchEnd');
    assert.deepEqual(valueAxis2.visualRange(), { startValue: 11.5, endValue: 14.5 }, 'Val2 axis visualRange after pinchEnd');
});

[
    {
        axis: 'argument',
        zoomAndPan: {
            argumentAxis: 'both',
            valueAxis: 'none',
            allowTouchGestures: true,
        },
    },
    {
        axis: 'value',
        zoomAndPan: {
            argumentAxis: 'none',
            valueAxis: 'both',
            allowTouchGestures: true,
        },
    },
].forEach(({ axis, zoomAndPan }) => {
    QUnit.test(`${axis} axis pinch with tiny offset should still zoom on one step (T1236028)`, function(assert) {
        const onZoomStart = sinon.spy();
        const onZoomEnd = sinon.spy();
        const dataSource = [
            { arg: '1', val: '1' },
            { arg: '2', val: '2' },
            { arg: '3', val: '3' },
            { arg: '4', val: '4' },
            { arg: '5', val: '5' },
        ];

        const chart = this.createChart({
            argumentAxis: {
                argumentType: 'string',
                visualRange: {
                    startValue: '1',
                    endValue: '1',
                }
            },
            valueAxis: {
                valueType: 'string',
                visualRange: {
                    startValue: '1',
                    endValue: '1',
                }
            },
            dataSource,
            zoomAndPan,
            onZoomStart: onZoomStart,
            onZoomEnd: onZoomEnd
        });

        const targetAxis = axis === 'argument' ? chart.getArgumentAxis() : chart.getValueAxis();

        const $root = $(chart._renderer.root.element);
        $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 10, pageY: 10 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
        $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 11, pageY: 11 }, { pointerId: 2, pageX: 99, pageY: 99 }] }));
        $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

        assert.equal(onZoomEnd.getCall(0).args[0].axis, targetAxis, `${axis} axis is zoomed`);
        assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, { startValue: '1', endValue: '1', categories: ['1'] }, 'previous range is correct');
        assert.deepEqual(onZoomEnd.getCall(0).args[0].range, { startValue: '1', endValue: '3', categories: ['1', '2', '3'] }, 'new range is correct');
    });
});

QUnit.module('Misc', environment);

QUnit.test('argument axis should not restore visual range on dataSource update (T1049139)', function(assert) {
    const dataSource = [{ arg: 1960, val: 10, }, { arg: 2020, val: 20, }];
    const chart = this.createChart({
        dataSource,
        legend: {
            visible: false,
        },
        series: { type: 'bar' },
        argumentAxis: {
            visualRange: {
                length: 20
            }
        },
        zoomAndPan: {
            argumentAxis: 'both'
        }
    });

    this.pointer.start({ x: 200, y: 250 }).wheel(10);

    dataSource.push({ arg: 2030, val: 1 });
    chart.option('dataSource', dataSource);

    const visualRange = chart.getArgumentAxis().visualRange();

    assert.strictEqual(Math.floor(visualRange.startValue), 2000);
    assert.strictEqual(Math.floor(visualRange.endValue), 2018);
});

QUnit.test('value axis should not restore visual range on dataSource update (T1262610)', function(assert) {
    const dataSource = [{ arg: 2000, val: 10, }, { arg: 2010, val: 20, }];
    const chart = this.createChart({
        dataSource,
        legend: {
            visible: false,
        },
        series: { type: 'bar' },
        valueAxis: {
            visualRangeUpdateMode: 'keep',
            visualRange: {
                startValue: 5,
                endValue: 25,
            }
        },
        zoomAndPan: {
            valueAxis: 'both',
        }
    });

    this.pointer.start({ x: 200, y: 250 }).wheel(10);
    dataSource.push({ arg: 2020, val: 15 });
    chart.option('dataSource', dataSource);

    const visualRange = chart.getValueAxis().visualRange();

    assert.strictEqual(Math.floor(visualRange.startValue), 6);
    assert.strictEqual(Math.floor(visualRange.endValue), 24);
});

QUnit.test('Do nothing if no actions allowed', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        valueAxis: {
            visualRange: {
                startValue: 30,
                endValue: 70
            }
        },
        zoomAndPan: {
            argumentAxis: 'none',
            valueAxis: 'none',
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
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));
    // scroll bar
    $root.trigger(new $.Event('dxc-scroll-start', { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }] }));
    $root.trigger(new $.Event('dxc-scroll-move', { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }] }));
    $root.trigger(new $.Event('dxc-scroll-end'));

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test('allowTouchGestures = false, do nothing on touch drag and pinch zoom', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'both',
            allowTouchGestures: false
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 100, y: 250, pointerType: 'touch' }).dragStart().drag(100, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test('allowTouchGestures = true, only zoom allowed, touch drag - do nothing', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 100, y: 250, pointerType: 'touch' }).dragStart().drag(100, 50).dragEnd();

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test('Reject API zoom-in both axes', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3.5,
                endValue: 3.51
            }
        },
        valueAxis: {
            visualRange: {
                startValue: 1.99,
                endValue: 2
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();
    const argVisualRange = argumentAxis.visualRange();
    const valVisualRange = valueAxis.visualRange();

    // act
    argumentAxis.visualRange({ startValue: 3.5, endValue: 3.51 });
    valueAxis.visualRange({ startValue: 1.99, endValue: 2 });

    assert.equal(onZoomStart.callCount, 2);
    assert.equal(onZoomStart.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomStart.getCall(0).args[0].range, argVisualRange);

    assert.equal(onZoomStart.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomStart.getCall(1).args[0].range, valVisualRange);

    assert.equal(onZoomEnd.callCount, 2);
    assert.equal(onZoomEnd.getCall(0).args[0].axis, argumentAxis);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].previousRange, argVisualRange);
    assert.deepEqual(onZoomEnd.getCall(0).args[0].range, argVisualRange);
    assert.equal(onZoomEnd.getCall(0).args[0].shift, 0);
    assert.equal(onZoomEnd.getCall(0).args[0].zoomFactor, 1);

    assert.equal(onZoomEnd.getCall(1).args[0].axis, valueAxis);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].previousRange, valVisualRange);
    assert.deepEqual(onZoomEnd.getCall(1).args[0].range, valVisualRange);
    assert.equal(onZoomEnd.getCall(1).args[0].shift, 0);
    assert.equal(onZoomEnd.getCall(1).args[0].zoomFactor, 1);
});

QUnit.module('Axes with empty range', environment);

QUnit.test('Pan - do nothing', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    this.createChart({
        dataSource: null,
        argumentAxis: {},
        valueAxis: {},
        zoomAndPan: {
            argumentAxis: 'both',
            valueAxis: 'both'
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 100, y: 250, cancelable: true }).dragStart().drag(400, 240).dragEnd();

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test('Mouse wheel - do nothing', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    this.createChart({
        dataSource: null,
        argumentAxis: {},
        valueAxis: {},
        zoomAndPan: {
            argumentAxis: 'both',
            valueAxis: 'both',
            allowMouseWheel: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 200, y: 250 }).wheel(10);

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.test('Shutter zoom - do nothing', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    this.createChart({
        dataSource: null,
        argumentAxis: {},
        valueAxis: {},
        zoomAndPan: {
            valueAxis: 'zoom',
            argumentAxis: 'zoom',
            dragToZoom: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    this.pointer.start({ x: 200, y: 120 }).dragStart().drag(400, 240).dragEnd();

    // assert
    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
});

QUnit.module('Prevent default behavior', environment);

QUnit.test('On pan', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan',
            valueAxis: 'pan'
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxdragstart', { pageX: 100, pageY: 250, preventDefault: preventDefault }));
    $root.trigger(new $.Event('dxdrag', { offset: { x: 100, y: 50 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdragend', { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 2);
    assert.equal(stopPropagation.callCount, 2);
    assert.equal(this.trackerStopHandling.callCount, 2);
});

QUnit.test('Pan action in pane without zoom if another pane has a zoom', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        dataSource: [{
            arg: 'a1',
            val1: 4.1,
            val2: 109
        }, {
            arg: 'a2',
            val1: 10,
            val2: 104
        }],
        panes: [{
            name: 'topPane'
        }, {
            name: 'bottomPane'
        }],
        zoomAndPan: {
            valueAxis: 'both',
            allowMouseWheel: true
        },
        series: [{
            pane: 'topPane',
            valueField: 'val1'
        }, {
            valueField: 'val2'
        }],
        valueAxis: [{
            pane: 'bottomPane',
            name: 'bottomAxis'
        }, {
            visualRange: {
                startValue: 4,
                endValue: 5
            },
            pane: 'topPane',
            name: 'topAxis'
        }]
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxmousewheel', { d: 10, pageX: 0, pageY: 350, preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 0);
    assert.equal(stopPropagation.callCount, 0);
    assert.equal(this.trackerStopHandling.callCount, 0);
});

QUnit.test('Default behavior - no prevent. On panning by drag (goes to the edge)', function(assert) {
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 10
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxdragstart', { pointerType: 'touch', pageX: 100, pageY: 250 }));
    $root.trigger(new $.Event('dxdrag', { pointerType: 'touch', offset: { x: -100, y: 50 } }));
    $root.trigger(new $.Event('dxdragend', { pointerType: 'touch' }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 0);
    assert.equal($root[0].style.touchAction, '');
});

QUnit.test('Do not cancel panning if pan took place early. Pan X', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 10
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan',
            valueAxis: 'none',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    const $root = $(chart._renderer.root.element);

    $root.trigger(new $.Event('dxdragstart', { pointerType: 'touch', pageX: 100, pageY: 250, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdrag', { pointerType: 'touch', offset: { x: 10, y: 0 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdrag', { pointerType: 'touch', offset: { x: 10, y: 10 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdragend', { pointerType: 'touch', preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);
});


QUnit.test('Do not cancel panning if pan took place early. Pan Y', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 10
            }
        },

        valueAxis: {
            visualRange: {
                startValue: 1,
                endValue: 2
            }
        },
        zoomAndPan: {
            argumentAxis: 'none',
            valueAxis: 'pan',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    const $root = $(chart._renderer.root.element);

    $root.trigger(new $.Event('dxdragstart', { pointerType: 'touch', pageX: 100, pageY: 250, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdrag', { pointerType: 'touch', offset: { x: 0, y: 10 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdrag', { pointerType: 'touch', offset: { x: 10, y: 10 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdragend', { pointerType: 'touch', preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);
});

QUnit.test('On panning by drag (goes from the edge)', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 10
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxdragstart', { pointerType: 'touch', pageX: 200, pageY: 250 }));
    $root.trigger(new $.Event('dxdrag', { pointerType: 'touch', offset: { x: 100, y: 50 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdragend', { pointerType: 'touch', preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(preventDefault.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.equal(this.trackerStopHandling.callCount, 1);
});

// T249548
QUnit.test('On mouse wheel', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            allowMouseWheel: true
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxmousewheel', { d: 10, pageX: 0, pageY: 0, preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.equal(this.trackerStopHandling.callCount, 1);
});

QUnit.test('Default behavior - no prevent. On mouse wheel', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 0,
                endValue: 5
            }
        },
        zoomAndPan: {
            valueAxis: 'zoom',
            allowMouseWheel: true
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxmousewheel', { d: 10, pageX: 0, pageY: 0, preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 0);
    assert.equal(stopPropagation.callCount, 0);
    assert.equal(this.trackerStopHandling.callCount, 0);
});

QUnit.test('On pinch zoom', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            valueAxis: 'zoom',
            allowTouchGestures: true
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.equal(preventDefault.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.equal(this.trackerStopHandling.callCount, 1);
});

QUnit.test('Prevent default behavior for pinch-in zoom', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 0,
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
            argumentAxis: 'both',
            valueAxis: 'both',
            allowTouchGestures: true
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.equal(preventDefault.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.equal(this.trackerStopHandling.callCount, 1);
});

QUnit.test('Default behavior - no prevent. On pinch-out zoom', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 1,
                endValue: 9.99
            }
        },
        zoomAndPan: {
            argumentAxis: 'zoom',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [], preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(onZoomStart.callCount, 1);
    assert.equal(onZoomEnd.callCount, 1);
    assert.equal(preventDefault.callCount, 1);
    assert.equal(stopPropagation.callCount, 1);
    assert.equal(this.trackerStopHandling.callCount, 1);
});

QUnit.test('Default behavior - no prevent. On panning by drag (full visualRange)', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const onZoomStart = sinon.spy();
    const onZoomEnd = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 0.01,
                endValue: 9.99
            }
        },
        valueAxis: {
            visualRange: {
                startValue: 0.01,
                endValue: 4.99
            }
        },
        zoomAndPan: {
            argumentAxis: 'both',
            valueAxis: 'both',
            allowTouchGestures: true
        },
        onZoomStart: onZoomStart,
        onZoomEnd: onZoomEnd
    });

    // act
    const $root = $(chart._renderer.root.element);

    $root.trigger(new $.Event('dxdragstart', { pointerType: 'touch', pageX: 100, pageY: 250, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdrag', { pointerType: 'touch', offset: { x: 100, y: 50 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdragend', { pointerType: 'touch', preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(onZoomStart.callCount, 0);
    assert.equal(onZoomEnd.callCount, 0);
    assert.equal(preventDefault.callCount, 0);
    assert.equal(stopPropagation.callCount, 0);
    assert.equal(this.trackerStopHandling.callCount, 0);
});

QUnit.test('On ScrollBar', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'pan',
            valueAxis: 'pan'
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger(new $.Event('dxc-scroll-start', { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxc-scroll-move', { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxc-scroll-end', { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    assert.equal(preventDefault.callCount, 3);
    assert.equal(stopPropagation.callCount, 3);
    assert.equal(this.trackerStopHandling.callCount, 3);
});

QUnit.test('Do not prevent and stop if no actions allowed', function(assert) {
    const preventDefault = sinon.spy();
    const stopPropagation = sinon.spy();
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        zoomAndPan: {
            argumentAxis: 'none',
            valueAxis: 'none',
            allowTouchGestures: true,
            allowMouseWheel: true
        }
    });

    // act
    const $root = $(chart._renderer.root.element);
    // drag
    $root.trigger(new $.Event('dxdragstart', { pageX: 100, pageY: 250, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdrag', { offset: { x: 100, y: 50 }, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxdragend', { preventDefault: preventDefault, stopPropagation: stopPropagation }));
    // wheel
    $root.trigger(new $.Event('dxmousewheel', { d: 10, preventDefault: preventDefault, stopPropagation: stopPropagation }));
    // pinch
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 50, pageY: 50 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 0, pageY: 0 }, { pointerId: 2, pageX: 100, pageY: 100 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    // scroll bar
    $root.trigger(new $.Event('dxc-scroll-start', { pageX: 100, pointers: [{ pageX: 100, pageY: 250 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxc-scroll-move', { offset: { x: 200, y: 100 }, pointers: [{ pageX: 200, pageY: 300 }], preventDefault: preventDefault, stopPropagation: stopPropagation }));
    $root.trigger(new $.Event('dxc-scroll-end', { preventDefault: preventDefault, stopPropagation: stopPropagation }));

    // assert
    assert.equal(preventDefault.callCount, 0);
    assert.equal(stopPropagation.callCount, 0);
    assert.equal(this.trackerStopHandling.callCount, 0);
});

QUnit.module('Axes custom positioning', environment);

QUnit.test('Argument axis panning (value axis has custom position)', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        valueAxis: {
            customPosition: 5
        },
        zoomAndPan: {
            argumentAxis: 'pan'
        }
    });

    const valueAxis = chart.getValueAxis();
    const initAxisPosition = valueAxis.getAxisPosition();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(100, 50).dragEnd();
    const panAxisPosition = valueAxis.getAxisPosition();

    assert.roughEqual(initAxisPosition, 400, 2.01, 'custom position applied');
    assert.ok(initAxisPosition < panAxisPosition, 'value axis moved');
});

QUnit.test('Argument axis panning (value axis shifted by offset)', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        valueAxis: {
            offset: 100
        },
        zoomAndPan: {
            argumentAxis: 'pan'
        }
    });

    const valueAxis = chart.getValueAxis();
    const initAxisPosition = valueAxis.getAxisPosition();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(200, 50).dragEnd();
    const panAxisPosition = valueAxis.getAxisPosition();

    assert.roughEqual(panAxisPosition, 100, 2.01, 'offset applied');
    assert.equal(initAxisPosition, panAxisPosition, 'value axis is static');
});

QUnit.test('Argument axis panning - value axis adjust to predefined position', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        valueAxis: {
            customPosition: 6,
            offset: 50
        },
        zoomAndPan: {
            argumentAxis: 'pan'
        }
    });

    const valueAxis = chart.getValueAxis();
    const initAxisPosition = valueAxis.getAxisPosition();

    // act
    this.pointer.start({ x: 100, y: 250 }).dragStart().drag(300, 10).dragEnd();
    const axisPositionRight = valueAxis.getAxisPosition();

    this.pointer.start({ x: 50, y: 250 }).dragStart().drag(100, 10).dragEnd();
    const staticPositionAfterDrag = valueAxis.getAxisPosition();

    assert.ok(initAxisPosition < axisPositionRight, 'value axis moved');
    assert.equal(axisPositionRight, 800, 'value axis has predefined position');
    assert.equal(axisPositionRight, staticPositionAfterDrag, 'value axis not moved');
});

QUnit.test('Value axis panning (argument axis has custom position)', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 1,
                endValue: 4
            }
        },
        argumentAxis: {
            customPosition: 2.5
        },
        zoomAndPan: {
            valueAxis: 'pan'
        }
    });

    const argumentAxis = chart.getArgumentAxis();
    const initAxisPosition = argumentAxis.getAxisPosition();

    // act
    this.pointer.start({ x: 100, y: 100 }).dragStart().drag(10, 100).dragEnd();
    const panAxisPosition = argumentAxis.getAxisPosition();

    assert.roughEqual(initAxisPosition, 300, 2.01, 'custom position applied');
    assert.ok(initAxisPosition < panAxisPosition, 'argument axis moved');
});

QUnit.test('Value axis panning (argument axis shifted by offset)', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 1,
                endValue: 4
            }
        },
        argumentAxis: {
            offset: -200
        },
        zoomAndPan: {
            valueAxis: 'pan'
        }
    });

    const argumentAxis = chart.getArgumentAxis();
    const initAxisPosition = argumentAxis.getAxisPosition();

    // act
    this.pointer.start({ x: 100, y: 100 }).dragStart().drag(50, 100).dragEnd();
    const panAxisPosition = argumentAxis.getAxisPosition();

    assert.roughEqual(panAxisPosition, 400, 2.01, 'offset applied');
    assert.equal(initAxisPosition, panAxisPosition, 'argument axis is static');
});

QUnit.test('Value axis panning - argument axis adjust to predefined position', function(assert) {
    const chart = this.createChart({
        valueAxis: {
            visualRange: {
                startValue: 1,
                endValue: 4
            }
        },
        argumentAxis: {
            customPosition: 2,
            offset: 50
        },
        zoomAndPan: {
            valueAxis: 'pan'
        }
    });

    const argumentAxis = chart.getArgumentAxis();
    const initAxisPosition = argumentAxis.getAxisPosition();

    // act
    this.pointer.start({ x: 100, y: 100 }).dragStart().drag(10, 300).dragEnd();
    const axisPositionBottom = argumentAxis.getAxisPosition();

    this.pointer.start({ x: 100, y: 100 }).dragStart().drag(10, 100).dragEnd();
    const staticPositionAfterDrag = argumentAxis.getAxisPosition();

    assert.ok(initAxisPosition < axisPositionBottom, 'argument axis moved');
    assert.equal(axisPositionBottom, 600, 'argument axis has predefined position');
    assert.equal(axisPositionBottom, staticPositionAfterDrag, 'argument axis not moved');
});

QUnit.test('Axes zooming - wheel', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            customPosition: 2.5,
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        valueAxis: {
            customPosition: 5,
            visualRange: {
                startValue: 1,
                endValue: 4
            }
        },
        zoomAndPan: {
            argumentAxis: 'both',
            valueAxis: 'both',
            allowMouseWheel: true
        }
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

    // act
    this.pointer.start({ x: 150, y: 100 }).wheel(10);

    assert.roughEqual(argumentAxis.getAxisPosition(), 320, 2.01, 'argument axis moved - zoom in');
    assert.roughEqual(valueAxis.getAxisPosition(), 425, 2.01, 'value axis moved - zoom in');

    this.pointer.start({ x: 200, y: 200 }).wheel(-10).wheel(-10).wheel(-10);

    assert.roughEqual(argumentAxis.getAxisPosition(), 287, 2.01, 'argument axis moved - zoom out');
    assert.roughEqual(valueAxis.getAxisPosition(), 364, 2.01, 'value axis moved - zoom out');
});

QUnit.test('Axes zooming - pinch', function(assert) {
    const chart = this.createChart({
        argumentAxis: {
            customPosition: 2.5,
            visualRange: {
                startValue: 3,
                endValue: 7
            }
        },
        valueAxis: {
            customPosition: 5,
            visualRange: {
                startValue: 1,
                endValue: 4
            }
        },
        zoomAndPan: {
            argumentAxis: 'both',
            valueAxis: 'both',
            allowMouseWheel: true
        }
    });

    const argumentAxis = chart.getArgumentAxis();
    const valueAxis = chart.getValueAxis();

    // act
    const $root = $(chart._renderer.root.element);
    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 20, pageY: 20 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 10, pageY: 10 }, { pointerId: 2, pageX: 60, pageY: 60 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.roughEqual(argumentAxis.getAxisPosition(), 477, 2.01, 'argument axis moved - zoom in');
    assert.roughEqual(valueAxis.getAxisPosition(), 643, 2.01, 'value axis moved - zoom in');

    $root.trigger($.Event('dxpointerdown', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 10, pageY: 10 }, { pointerId: 2, pageX: 60, pageY: 60 }] }));
    $root.trigger($.Event('dxpointermove', { pointerType: 'touch', pointers: [{ pointerId: 1, pageX: 20, pageY: 20 }, { pointerId: 2, pageX: 50, pageY: 50 }] }));
    $root.trigger($.Event('dxpointerup', { pointerType: 'touch', pointers: [] }));

    assert.roughEqual(argumentAxis.getAxisPosition(), 300, 2.01, 'argument axis moved - zoom out');
    assert.roughEqual(valueAxis.getAxisPosition(), 400, 2.01, 'value axis moved - zoom out');
});
