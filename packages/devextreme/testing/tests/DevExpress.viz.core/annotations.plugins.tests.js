import $ from 'jquery';
import { __test_utils, plugins } from 'viz/core/annotations';
import rendererModule from 'viz/core/renderers/renderer';
import TooltipModule from 'viz/core/tooltip';
import vizMocks from '../../helpers/vizMocks.js';
import pointerMock from '../../helpers/pointerMock.js';
import eventsEngine from 'common/core/events/core/events_engine';
import { getDocument } from 'core/dom_adapter';
import devices from '__internal/core/m_devices';

import 'viz/chart';
import 'viz/polar_chart';
import 'viz/pie_chart';

const checkCoords = (assert, chart, annotation, expected, canvas, testCase) => {
    const coords = chart._getAnnotationCoords(annotation);
    if(expected.x !== undefined) {
        assert.roughEqual(coords.x, expected.x, 0.6, `x is correct for case: ${testCase}`);
    } else {
        assert.equal(coords.x, expected.x, `x is correct for case: ${testCase}`);
    }

    if(expected.y !== undefined) {
        assert.roughEqual(coords.y, expected.y, 0.6, `y is correct for case: ${testCase}`);
    } else {
        assert.equal(coords.y, expected.y, `y is correct for case: ${testCase}`);
    }

    if(canvas) {
        assert.deepEqual(coords.canvas, canvas, `canvas is correct for case: ${testCase}`);
    }
};

QUnit.module('Coordinates calculation. Chart plugin', {
    p1Canvas: { width: 100, height: 210, top: 0, bottom: 110, left: 0, right: 0, originalTop: 0, originalBottom: 110, originalLeft: 0, originalRight: 0 },
    p2Canvas: { width: 100, height: 210, top: 110, bottom: 0, left: 0, right: 0, originalTop: 110, originalBottom: 0, originalLeft: 0, originalRight: 0 },
    getChartForSeriesTests(options) {
        return $('<div>').appendTo('#qunit-fixture').dxChart($.extend({
            size: {
                width: 100,
                height: 210
            },
            panes: [{ name: 'p1' }, { name: 'p2' }],
            defaultPane: 'p1',
            dataSource: [
                { arg: 0, val: 100 },
                { arg: 50, val: 200 },
                { arg: 100, val: 100 }
            ],
            series: [
                { name: 's1', type: 'line', axis: 'a1', pane: 'p1' },
                { name: 's2', type: 'line', axis: 'a2', pane: 'p2' }
            ],
            valueAxis: [
                { name: 'a1', visualRange: [100, 200] },
                { name: 'a2', visualRange: [100, 200], position: 'right' }
            ],
            argumentAxis: {
                visualRange: [0, 100]
            },
            legend: { visible: false },
            commonAxisSettings: {
                valueMarginsEnabled: false,
                grid: { visible: false },
                label: { visible: false },
                tick: { visible: false }
            },
            synchronizeMultiAxes: false
        }, options)).dxChart('instance');
    },
    checkCoords: checkCoords
}, function() {
    QUnit.test('Get coordinates from axes', function(assert) {
        const chart = this.getChartForSeriesTests({
            valueAxis: [
                { name: 'a1', visualRange: [100, 200] },
                { name: 'a2', visualRange: [200, 300], position: 'right' }
            ]
        });

        this.checkCoords(assert, chart, { argument: 50, value: 110 }, { x: 50, y: 90 }, this.p1Canvas, 'argument, value');
        this.checkCoords(assert, chart, { argument: 50, value: 250, axis: 'a2' }, { x: 50, y: 160 }, this.p2Canvas, 'argument, value, axis name');

        this.checkCoords(assert, chart, { value: 150 }, { x: 0, y: 50 }, this.p1Canvas, 'only value');
        this.checkCoords(assert, chart, { value: 250, axis: 'a2' }, { x: 100, y: 160 }, this.p2Canvas, 'value and axis name');

        this.checkCoords(assert, chart, { argument: 50 }, { x: 50, y: 100 }, this.p1Canvas, 'only argument');
        this.checkCoords(assert, chart, { argument: 50, axis: 'a2' }, { x: 50, y: 210 }, this.p2Canvas, 'argument and axis name');
    });

    QUnit.test('Get coordinates from axes, convert arg/val to axis types', function(assert) {
        const chart = this.getChartForSeriesTests({
            size: {
                width: 100,
                height: 100
            },
            panes: [{ name: 'p1' }],
            series: [{ }],
            dataSource: [
                { arg: new Date(2018, 1, 3), val: new Date(2018, 1, 3) }
            ],
            argumentAxis: {
                argumentType: 'datetime',
                visualRange: [new Date(2018, 1, 1), new Date(2018, 1, 3)]
            },
            valueAxis: [{
                valueType: 'datetime',
                axisType: 'discrete',
                categories: [new Date(2018, 1, 1), new Date(2018, 1, 2), new Date(2018, 1, 3), new Date(2018, 1, 4), new Date(2018, 1, 5)]
            }]
        });

        this.checkCoords(assert, chart, { argument: '2018-02-02', value: '2018-02-02' }, { x: 50, y: 75 }, undefined, 'argument and value');
    });

    QUnit.test('Get coordinates from series. Series is not visible', function(assert) {
        const chart = this.getChartForSeriesTests({
            series: [
                { name: 's1', type: 'line', axis: 'a1', pane: 'p1', visible: false }
            ] }
        );
        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 20, y: undefined }, undefined, 'series s1 is not visible');
    });

    QUnit.test('Get coordinates from series. Series is not visible. Argument axis is discrete', function(assert) {
        const chart = this.getChartForSeriesTests({
            argumentAxis: {
                type: 'discrete',
                categories: [0, 50, 100]
            },
            series: [
                { name: 's1', type: 'line', axis: 'a1', pane: 'p1', visible: false },
                { name: 's2', type: 'bar', axis: 'a1', pane: 'p1', visible: false }
            ] }
        );
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: undefined }, undefined, 'series s1 is not visible');
        this.checkCoords(assert, chart, { argument: 0, series: 's1' }, { x: 0, y: undefined }, undefined, 'series s2 is not visible');
    });

    QUnit.test('Get coordinates from series. DataSource has small count of points', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [],
        });
        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 20, y: undefined }, undefined, 'empty datasource');

        chart.option({
            dataSource: [{
                arg: 50, val: 200
            }]
        });
        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 20, y: undefined }, undefined, 'datasource with one point, is not in range');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 0 }, undefined, 'datasource with one point, in the range');
    });

    QUnit.test('T870726, annotation between two points, one of the points is out of the range', function(assert) {
        const chart = this.getChartForSeriesTests({
            valueAxis: [
                { name: 'a1', visualRange: [100, 150] },
                { name: 'a2', visualRange: [100, 200] }
            ]
        });
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: undefined }, undefined, 'annotation out of range');
        this.checkCoords(assert, chart, { argument: 15, series: 's1' }, { x: 15, y: 50 }, undefined, 'annotation in the range');
    });

    QUnit.test('Get coordinates from series. Line series', function(assert) {
        const chart = this.getChartForSeriesTests();
        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 20, y: 60 }, this.p1Canvas, 'argument & series s1');
        this.checkCoords(assert, chart, { value: 140, series: 's1' }, { x: 20, y: 60 }, this.p1Canvas, 'value & series s1');

        this.checkCoords(assert, chart, { argument: 20, series: 's2' }, { x: 20, y: 170 }, this.p2Canvas, 'argument & series s2');
        this.checkCoords(assert, chart, { value: 140, series: 's2' }, { x: 20, y: 170 }, this.p2Canvas, 'argument & series s2');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 20, y: 40 }, undefined, 'inverted, argument & series s1');
        this.checkCoords(assert, chart, { value: 140, series: 's1' }, { x: 20, y: 40 }, undefined, 'inverted, value and series s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false },
                { name: 'a2', visualRange: [100, 200] }
            ]
        });
        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 150, y: 80 }, undefined, 'rotated, argument & series s1');

        chart.option({
            size: {
                width: 100,
                height: 210
            },
            rotated: false,
        });
        this.checkCoords(assert, chart, { argument: 100, series: 's1' }, { x: 100, y: 100 }, undefined, 'annotation on last point');
    });

    QUnit.test('Get coordinates from series. Area series', function(assert) {
        const chart = this.getChartForSeriesTests();

        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 20, y: 60 }, undefined, 'argument & series s1');
        this.checkCoords(assert, chart, { value: 140, series: 's1' }, { x: 20, y: 60 }, undefined, 'value & series s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 20, y: 40 }, undefined, 'inverted, argument & series s1');
        this.checkCoords(assert, chart, { value: 140, series: 's1' }, { x: 20, y: 40 }, undefined, 'inverted, value & series s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 20, series: 's1' }, { x: 150, y: 80 }, undefined, 'rotated, argument & series s1');
    });

    QUnit.test('Get coordinates from series. Stepline series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            series: [{ name: 's1', type: 'stepline' }]
        });

        this.checkCoords(assert, chart, { argument: 25, series: 's1' }, { x: 25, y: 50 }, undefined, 'argument & series s1');
        this.checkCoords(assert, chart, { argument: 75, series: 's1' }, { x: 75, y: 0 }, undefined, 'argument & series s1');
        this.checkCoords(assert, chart, { value: 150, series: 's1' }, { x: 0, y: 50 }, undefined, 'value & series s1');
        this.checkCoords(assert, chart, { value: 180, series: 's1' }, { x: 50, y: 20 }, undefined, 'value & series s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 25, series: 's1' }, { x: 25, y: 50 }, undefined, 'inverted, argument & series s1');
        this.checkCoords(assert, chart, { argument: 75, series: 's1' }, { x: 75, y: 100 }, undefined, 'inverted, argument & series s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 25, series: 's1' }, { x: 160, y: 75 }, undefined, 'rotated, argument & s1');
        this.checkCoords(assert, chart, { argument: 75, series: 's1' }, { x: 210, y: 25 }, undefined, 'rotated, argument & s1');
    });

    QUnit.test('Get coordinates from series. Steparea series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            series: [{ name: 's1', type: 'steparea' }]
        });

        this.checkCoords(assert, chart, { argument: 25, series: 's1' }, { x: 25, y: 50 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 75, series: 's1' }, { x: 75, y: 0 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { value: 150, series: 's1' }, { x: 0, y: 50 }, undefined, 'value & s1');
        this.checkCoords(assert, chart, { value: 180, series: 's1' }, { x: 50, y: 20 }, undefined, 'value & s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 25, series: 's1' }, { x: 25, y: 50 }, undefined, 'inverted, argument & s1');
        this.checkCoords(assert, chart, { argument: 75, series: 's1' }, { x: 75, y: 100 }, undefined, 'inverted, argument & s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 25, series: 's1' }, { x: 160, y: 75 }, undefined, 'rotated, argument & s1');
        this.checkCoords(assert, chart, { argument: 75, series: 's1' }, { x: 210, y: 25 }, undefined, 'rotated, argument & s1');
    });

    QUnit.test('Get coordinates from series. Spline series', function(assert) {
        const chart = this.getChartForSeriesTests({
            series: [{ name: 's1', type: 'spline' }]
        });

        this.checkCoords(assert, chart, { argument: 32, series: 's1' }, { x: 32, y: 15 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { value: 185, series: 's1' }, { x: 32, y: 15 }, undefined, 'value & s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 32, series: 's1' }, { x: 32, y: 85 }, undefined, 'inverted, argument & s1');
        this.checkCoords(assert, chart, { value: 185, series: 's1' }, { x: 32, y: 85 }, undefined, 'inverted, value & s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 32, series: 's1' }, { x: 195, y: 68 }, undefined, 'rotated, argument & s1');
    });

    QUnit.test('Get coordinates from series. Splinearea series', function(assert) {
        const chart = this.getChartForSeriesTests({
            series: [{ name: 's1', type: 'splinearea' }]
        });

        this.checkCoords(assert, chart, { argument: 32, series: 's1' }, { x: 32, y: 15 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { value: 185, series: 's1' }, { x: 32, y: 15 }, undefined, 'value & s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 32, series: 's1' }, { x: 32, y: 85 }, undefined, 'inverted, argument & s1');
        this.checkCoords(assert, chart, { value: 185, series: 's1' }, { x: 32, y: 85 }, undefined, 'inverted, value & s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 32, series: 's1' }, { x: 195, y: 68 }, undefined, 'rotated, argument & s1');
    });

    QUnit.test('Get coordinates from series. Bar series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            series: [{ name: 's1', type: 'bar' }]
        });

        this.checkCoords(assert, chart, { argument: 0, series: 's1' }, { x: 8.5, y: 50 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 10, series: 's1' }, { x: undefined, y: undefined }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 0 }, undefined, 'argument & s1');

        // TODO
        // this.checkCoords(assert, chart, { value: 150, series: 's1' }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { value: 200, series: 's1' }, { x: 50, y: 0 }, undefined, 'value & s1');
        this.checkCoords(assert, chart, { value: 160, series: 's1' }, { x: null, y: 40 }, undefined, 'value & s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 0, series: 's1' }, { x: 8.5, y: 50 }, undefined, 'inverted, argument & s1');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 100 }, undefined, 'inverted, argument & s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 0, series: 's1' }, { x: 160, y: 91 }, undefined, 'rotated, argument & s1');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 210, y: 50 }, undefined, 'rotated, argument & s1');
    });

    QUnit.test('Get coordinates from series. Side-by-side bar series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val1: 110, val2: 130, val3: 120 },
                { arg: 50, val1: 140, val2: 170, val3: 150 },
                { arg: 100, val1: 180, val2: 200, val3: 160 }
            ],
            series: [
                { name: 's1', valueField: 'val1', type: 'bar' },
                { name: 's2', valueField: 'val2', type: 'bar' },
                { name: 's3', valueField: 'val3', type: 'bar' }
            ]
        });

        this.checkCoords(assert, chart, { argument: 50, series: 's2' }, { x: 50, y: 30 }, undefined, 'argument & s2');
        this.checkCoords(assert, chart, { argument: 50, series: 's3' }, { x: 62, y: 50 }, undefined, 'argument & s3');

        this.checkCoords(assert, chart, { value: 170, series: 's2' }, { x: 50, y: 30 }, undefined, 'value & s2');
        this.checkCoords(assert, chart, { value: 150, series: 's3' }, { x: 62, y: 50 }, undefined, 'value & s3');
    });

    QUnit.test('Get coordinates from series. Scatter series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            series: [{ name: 's1', type: 'scatter' }]
        });

        this.checkCoords(assert, chart, { argument: 0, series: 's1' }, { x: 0, y: 50 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 10, series: 's1' }, { x: undefined, y: undefined }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 0 }, undefined, 'argument & s1');

        this.checkCoords(assert, chart, { value: 150, series: 's1' }, { x: 0, y: 50 }, undefined, 'value & s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 0, series: 's1' }, { x: 0, y: 50 }, undefined, 'inverted, argument & s1');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 100 }, undefined, 'inverted, argument & s1');

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: 'a1', visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 0, series: 's1' }, { x: 160, y: 100 }, undefined, 'rotated, argument & s1');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 210, y: 50 }, undefined, 'rotated, argument & s1');
    });

    QUnit.test('Get coordinates from series. Bubble series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150, size: 20 },
                { arg: 50, val: 200, size: 60 },
                { arg: 100, val: 150, size: 40 }
            ],
            series: [{ name: 's1', type: 'bubble' }]
        });
        this.checkCoords(assert, chart, { argument: 25, series: 's1' }, { x: undefined, y: undefined }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 0 }, undefined, 'argument & s1');

        this.checkCoords(assert, chart, { value: 150, series: 's1' }, { x: 0, y: 50 }, undefined, 'value & s1');
        this.checkCoords(assert, chart, { value: 190, series: 's1' }, { x: 0, y: 10 }, undefined, 'value & s1');
    });

    QUnit.test('Get coordinates from series. Financial series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { date: 10, low: 120, high: 180, open: 140, close: 160 },
                { date: 50, low: 140, high: 200, open: 160, close: 180 },
                { date: 90, low: 100, high: 160, open: 120, close: 140 }
            ],
            series: [{ name: 's1', type: 'candlestick' }]
        });

        this.checkCoords(assert, chart, { argument: 10, series: 's1' }, { x: 10, y: 50 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 90, series: 's1' }, { x: 90, y: 70 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { argument: 40, series: 's1' }, { x: undefined, y: undefined }, undefined, 'argument & s1');

        this.checkCoords(assert, chart, { value: 140, series: 's1' }, { x: 10, y: 60 }, undefined, 'value & s1');
    });

    QUnit.test('Get coordinates from series. Range series', function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val1: 110, val2: 130 },
                { arg: 50, val1: 140, val2: 170 },
                { arg: 100, val1: 180, val2: 200 }
            ],
            series: [{ name: 's1', type: 'rangeBar' }]
        });

        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 30 }, undefined, 'argument & s1');
        this.checkCoords(assert, chart, { value: 160, series: 's1' }, { x: 50, y: 40 }, undefined, 'value & s1');

        chart.option('valueAxis[0].inverted', true);

        this.checkCoords(assert, chart, { argument: 50, series: 's1' }, { x: 50, y: 70 }, undefined, 'argument & s1');
    });

    QUnit.test('Cases when coords can not be calculated', function(assert) {
        const chart = this.getChartForSeriesTests();

        this.checkCoords(assert, chart, { x: 50, y: 50, series: 's1', axis: 'a2' }, { x: undefined, y: undefined }, undefined, 'series s1 & axis a2');
        this.checkCoords(assert, chart, { value: 150, axis: 'wrongaxis' }, { x: undefined, y: undefined }, undefined, 'wrong axis name');
    });

    QUnit.test('Can\'t convert arg/val to axis types', function(assert) {
        const chart = this.getChartForSeriesTests({
            size: {
                width: 100,
                height: 100
            },
            panes: [{ name: 'p1' }],
            series: [{ }],
            argumentAxis: {
                argumentType: 'datetime',
                visualRange: [new Date(2018, 1, 1), new Date(2018, 1, 3)]
            },
            valueAxis: [{
                valueType: 'datetime',
                axisType: 'discrete',
                categories: [new Date(2018, 1, 1), new Date(2018, 1, 2), new Date(2018, 1, 3), new Date(2018, 1, 4), new Date(2018, 1, 5)]
            }]
        });

        this.checkCoords(assert, chart, { argument: 'December', value: 'Monday' }, { x: undefined, y: undefined }, undefined, 'can\'t cpnvert');
    });

    QUnit.test('Pass offset to annotation coord object', function(assert) {
        const chart = this.getChartForSeriesTests();
        const coords = chart._getAnnotationCoords({
            offsetX: 10,
            offsetY: 20
        });
        assert.equal(coords.offsetX, 10);
        assert.equal(coords.offsetY, 20);
    });
});

QUnit.module('Coordinates calculation. PolarChart plugin', {
    getPolarChartForSeriesTests(options) {
        return $('<div>').appendTo('#qunit-fixture').dxPolarChart($.extend({
            size: {
                width: 200,
                height: 200
            },
            dataSource: [
                { arg: 0, val: 50, val2: 200 },
                { arg: 30, val: 100, val2: 150 },
                { arg: 60, val: 150, val2: 100 },
                { arg: 90, val: 200, val2: 50 },
                { arg: 120, val: 150, val2: 100 },
                { arg: 150, val: 100, val2: 150 },
                { arg: 180, val: 50, val2: 200 },
                { arg: 210, val: 100, val2: 150 },
                { arg: 240, val: 150, val2: 100 },
                { arg: 270, val: 200, val2: 50 },
                { arg: 300, val: 150, val2: 100 },
                { arg: 330, val: 100, val2: 150 },
                { arg: 360, val: 50, val2: 200 }
            ],
            series: [
                { name: 's1', type: 'line' },
                { name: 's2', type: 'line', valueField: 'val2' }
            ],
            commonAxisSettings: {
                valueMarginsEnabled: false,
                grid: { visible: false },
                label: { visible: false },
                tick: { visible: false }
            },
            argumentAxis: {
                inverted: true,
                startAngle: 90
            },
            valueAxis: {
                visualRange: [0, 200]
            },
            legend: { visible: false }
        }, options)).dxPolarChart('instance');
    },
    checkCoords(assert, polarChart, annotation, expected) {
        const coords = polarChart._getAnnotationCoords(annotation);
        if(expected.x !== undefined) {
            assert.roughEqual(coords.x, expected.x, 1.2);
        } else {
            assert.equal(coords.x, expected.x);
        }

        if(expected.y !== undefined) {
            assert.roughEqual(coords.y, expected.y, 1.2);
        } else {
            assert.equal(coords.y, expected.y);
        }
    }
}, function() {
    QUnit.test('Get coordinates from axes', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests();

        this.checkCoords(assert, polarChart, { argument: 50, value: 100 }, { x: 135, y: 65 });
        this.checkCoords(assert, polarChart, { value: 150 }, { x: 175, y: 100 });
        this.checkCoords(assert, polarChart, { argument: 100 }, { x: 100, y: 0 });

        this.checkCoords(assert, polarChart, { angle: 45, radius: 50 }, { x: 135, y: 65 });
        this.checkCoords(assert, polarChart, { angle: 90 }, { x: 100, y: 0 });
        this.checkCoords(assert, polarChart, { radius: 50 }, { x: 150, y: 100 });

        this.checkCoords(assert, polarChart, { angle: 310, value: 100 }, { x: 132, y: 138 });
        this.checkCoords(assert, polarChart, { argument: 70, radius: 90 }, { x: 141, y: 20 });
    });

    QUnit.test('Get coordinates from axes, convert arg/val to axis types', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests({
            size: {
                width: 100,
                height: 100
            },
            series: [{ }],
            dataSource: [
                { arg: new Date(2018, 1, 1), val: new Date(2018, 1, 1) },
                { arg: new Date(2018, 1, 6), val: new Date(2018, 1, 6) }
            ],
            argumentAxis: {
                argumentType: 'datetime'
            },
            valueAxis: {
                valueType: 'datetime',
                axisType: 'discrete',
                categories: [new Date(2018, 1, 1), new Date(2018, 1, 2), new Date(2018, 1, 3), new Date(2018, 1, 4), new Date(2018, 1, 5), new Date(2018, 1, 6)]
            }
        });

        this.checkCoords(assert, polarChart, { argument: '2018-02-03', value: '2018-02-02' }, { x: 56, y: 58 });
    });

    QUnit.test('Get coordinates from series. Line series', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests({
            argumentAxis: {
                tickInterval: 30
            }
        });
        this.checkCoords(assert, polarChart, { argument: 260.2, series: 's1' }, { x: 9.5, y: 115.5 });
        this.checkCoords(assert, polarChart, { value: 100, series: 's1' }, { x: 125, y: 57 });

        this.checkCoords(assert, polarChart, { argument: 345.5, series: 's2' }, { x: 78, y: 14.88 });
        this.checkCoords(assert, polarChart, { value: 65.1, series: 's2' }, { x: 132.5, y: 94.5 });

        polarChart.option({
            valueAxis: {
                type: 'discrete'
            }
        });

        this.checkCoords(assert, polarChart, { argument: 287, series: 's1' }, { x: 28, y: 78 });
        this.checkCoords(assert, polarChart, { radius: 95, series: 's1' }, { x: 195, y: 96 });

        polarChart.option({
            valueAxis: {
                type: 'continuous',
                inverted: true
            }
        });

        this.checkCoords(assert, polarChart, { argument: 120, series: 's2' }, { x: 143, y: 125 });
        this.checkCoords(assert, polarChart, { value: 150, series: 's2' }, { x: 113, y: 78 });

        polarChart.option({
            argumentAxis: {
                inverted: true,
                startAngle: -45,
                tickInterval: 30
            },
            valueAxis: {
                visualRange: [100, 200],
                inverted: false
            }
        });

        this.checkCoords(assert, polarChart, { angle: 45, series: 's1' }, { x: 75, y: 100 });
        this.checkCoords(assert, polarChart, { radius: 25, series: 's2' }, { x: 75, y: 100 });
    });

    QUnit.test('Get coordinates from series. Area series', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests({
            series: [
                { type: 'area', name: 's1' }
            ],
            argumentAxis: {
                tickInterval: 30
            }
        });
        this.checkCoords(assert, polarChart, { argument: 260.2, series: 's1' }, { x: 9.5, y: 115.5 });
        this.checkCoords(assert, polarChart, { value: 125, series: 's1' }, { x: 145, y: 56 });

        polarChart.option({
            valueAxis: {
                type: 'discrete'
            }
        });

        this.checkCoords(assert, polarChart, { argument: 287, series: 's1' }, { x: 28, y: 78 });
        this.checkCoords(assert, polarChart, { radius: 95, series: 's1' }, { x: 195, y: 96 });

        polarChart.option({
            valueAxis: {
                type: 'continuous',
                inverted: true
            }
        });

        this.checkCoords(assert, polarChart, { argument: 315, series: 's1' }, { x: 73.5, y: 73.5 });
        this.checkCoords(assert, polarChart, { value: 159, series: 's1' }, { x: 119, y: 91 });

        polarChart.option({
            argumentAxis: {
                inverted: true,
                startAngle: -45,
                tickInterval: 30
            },
            valueAxis: {
                inverted: false,
                visualRange: [100, 200]
            }
        });

        this.checkCoords(assert, polarChart, { angle: 45, series: 's1' }, { x: 75, y: 100 });
        this.checkCoords(assert, polarChart, { radius: 25, series: 's1' }, { x: 75, y: 100 });
    });

    QUnit.test('Get coordinates from series. Scatter series', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests({
            series: [
                { type: 'scatter', name: 's1' }
            ],
            argumentAxis: {
                tickInterval: 30
            }
        });
        this.checkCoords(assert, polarChart, { argument: 330, series: 's1' }, { x: 75, y: 57 });
        this.checkCoords(assert, polarChart, { argument: 69, series: 's1' }, { x: undefined, y: undefined });
        this.checkCoords(assert, polarChart, { value: 150, series: 's1' }, { x: 165, y: 63 });
        this.checkCoords(assert, polarChart, { value: 69 }, { x: 100, y: 65 });
        this.checkCoords(assert, polarChart, { angle: 40, series: 's1' }, { x: undefined, y: undefined });

        polarChart.option('argumentAxis.type', 'discrete');

        this.checkCoords(assert, polarChart, { angle: 40, series: 's1' }, { x: 133, y: 63 });
        this.checkCoords(assert, polarChart, { angle: 287 }, { x: 4, y: 71 });
        this.checkCoords(assert, polarChart, { radius: 100, series: 's1' }, { x: 199, y: 112 });
        this.checkCoords(assert, polarChart, { radius: 80 }, { x: 100, y: 20 });
    });

    QUnit.test('Get coordinates from series. Bar series', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests({
            series: [
                { name: 's1', type: 'bar' },
                { name: 's2', type: 'bar', valueField: 'val2' }
            ],
            argumentAxis: {
                tickInterval: 30
            }
        });

        this.checkCoords(assert, polarChart, { argument: 330, series: 's2' }, { x: 69, y: 31 });
        this.checkCoords(assert, polarChart, { value: 150, series: 's1' }, { x: 161, y: 56 });
        this.checkCoords(assert, polarChart, { angle: 240, series: 's2' }, { x: 54, y: 120 });
        this.checkCoords(assert, polarChart, { radius: 50, series: 's1' }, { x: 120, y: 54 });

        polarChart.option({
            series: [
                { type: 'bar', name: 's1' }
            ]
        });

        this.checkCoords(assert, polarChart, { argument: 330, series: 's1' }, { x: 75, y: 57 });
        this.checkCoords(assert, polarChart, { argument: 69, series: 's1' }, { x: undefined, y: undefined });
        this.checkCoords(assert, polarChart, { value: 150, series: 's1' }, { x: 165, y: 62 });
        this.checkCoords(assert, polarChart, { value: 69 }, { x: 100, y: 65 });
        this.checkCoords(assert, polarChart, { angle: 40, series: 's1' }, { x: undefined, y: undefined });

        polarChart.option('argumentAxis.type', 'discrete');

        this.checkCoords(assert, polarChart, { angle: 40, series: 's1' }, { x: 133, y: 63 });
        this.checkCoords(assert, polarChart, { angle: 287 }, { x: 4, y: 71 });
        this.checkCoords(assert, polarChart, { radius: 100, series: 's1' }, { x: 199, y: 112 });
        this.checkCoords(assert, polarChart, { radius: 80 }, { x: 100, y: 20 });
    });

    QUnit.test('Get coordinates from series. Closed series', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests({
            dataSource: [
                { arg: 30, val: 100, val2: 150 },
                { arg: 90, val: 200, val2: 50 },
                { arg: 180, val: 50, val2: 200 },
                { arg: 210, val: 100, val2: 150 },
                { arg: 240, val: 150, val2: 100 },
                { arg: 330, val: 100, val2: 50 }
            ],
            argumentAxis: {
                period: 360,
                tickInterval: 30
            }
        });
        this.checkCoords(assert, polarChart, { argument: 349, series: 's1' }, { x: 90.5, y: 51 });
        this.checkCoords(assert, polarChart, { angle: 11, series: 's1' }, { x: 109.5, y: 51 });

        this.checkCoords(assert, polarChart, { argument: 20.8, series: 's2' }, { x: 124, y: 37 });
        this.checkCoords(assert, polarChart, { angle: -8, series: 's2' }, { x: 94, y: 57 });

        polarChart.option('useSpiderWeb', true);

        this.checkCoords(assert, polarChart, { angle: 350, series: 's2' }, { x: 91, y: 50 });
    });

    QUnit.test('Cases when coords can not be calculated', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests();

        this.checkCoords(assert, polarChart, { x: 50, y: 50, series: 's0' }, { x: undefined, y: undefined });
        this.checkCoords(assert, polarChart, { value: 150, series: 'wrongseries' }, { x: undefined, y: undefined });
        this.checkCoords(assert, polarChart, { argument: 170, radius: 'radius' }, { x: undefined, y: undefined });
        this.checkCoords(assert, polarChart, { angle: 'angle', radius: 'radius' }, { x: undefined, y: undefined });
        this.checkCoords(assert, polarChart, { angle: 'angle', series: 's1' }, { x: undefined, y: undefined });
        this.checkCoords(assert, polarChart, { radius: 'radius', series: 's1' }, { x: undefined, y: undefined });
    });

    QUnit.test('Can\'t convert arg/val to axis types', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests({
            series: [{ }],
            argumentAxis: {
                argumentType: 'datetime',
                visualRange: [new Date(2018, 1, 1), new Date(2018, 1, 3)]
            },
            valueAxis: [{
                valueType: 'datetime',
                axisType: 'discrete',
                categories: [new Date(2018, 1, 1), new Date(2018, 1, 2), new Date(2018, 1, 3), new Date(2018, 1, 4), new Date(2018, 1, 5)]
            }]
        });

        this.checkCoords(assert, polarChart, { argument: 'December', value: 'Monday' }, { x: undefined, y: undefined });
    });

    QUnit.test('Pass offset to annotation coord object', function(assert) {
        const polarChart = this.getPolarChartForSeriesTests();
        const coords = polarChart._getAnnotationCoords({
            offsetX: 10,
            offsetY: 20
        });
        assert.equal(coords.offsetX, 10);
        assert.equal(coords.offsetY, 20);
    });
});

QUnit.module('Coordinates calculation. PieChart plugin', {
    getPieChartForSeriesTests(options) {
        return $('<div>').appendTo('#qunit-fixture').dxPieChart($.extend({
            size: {
                width: 200,
                height: 200
            },
            dataSource: [
                { arg: 'Cat1', val: 50, val2: 200 },
                { arg: 'Cat2', val: 100, val2: 150 },
                { arg: 'Cat3', val: 150, val2: 100 },
                { arg: 'Cat4', val: 200, val2: 50 },
                { arg: 'Cat5', val: 150, val2: 100 }
            ],
            series: [
                { name: 's1' },
                { name: 's2', valueField: 'val2' }
            ],
            legend: { visible: false }
        }, options)).dxPieChart('instance');
    }
});

QUnit.test('Get coorinates using argument', function(assert) {
    const pieChart = this.getPieChartForSeriesTests();

    checkCoords(assert, pieChart, { argument: 'Cat3' }, { x: 86.3, y: 120 });
});

QUnit.test('Get coordinates using series and argument', function(assert) {
    const pieChart = this.getPieChartForSeriesTests();

    checkCoords(assert, pieChart, { argument: 'Cat3', series: 's2' }, { x: 62, y: 34 });
});

QUnit.test('Get coordinates using argument and location `edge`', function(assert) {
    const pieChart = this.getPieChartForSeriesTests();

    checkCoords(assert, pieChart, { argument: 'Cat3', location: 'edge' }, { x: 72.7, y: 140 });
});

QUnit.module('Lifecycle', {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = sinon.spy(() => this.renderer);

        this.createAnnotationStub = sinon.stub().returns([{ draw: sinon.spy(), plaque: { clear: sinon.spy() } }]);
        __test_utils.stub_createAnnotations(this.createAnnotationStub);
    },
    afterEach() {
        __test_utils.restore_createAnnotations();
        rendererModule.Renderer.resetHistory();
    }
}, function() {
    QUnit.module('Chart plugin', {
        beforeEach() {
            this.onDrawn = sinon.spy();
        },
        chart(annotationSettings, annotationItems, customizeAnnotation) {
            return $('<div>').appendTo('#qunit-fixture').dxChart({
                size: {
                    width: 100,
                    height: 100
                },
                legend: { visible: false },
                dataSource: [],
                series: [],
                commonAxisSettings: {
                    grid: { visible: false },
                    label: { visible: false }
                },
                synchronizeMultiAxes: false,
                valueAxis: [
                    { name: 'a1', visualRange: [100, 200] },
                    { name: 'a2', visualRange: [200, 300] }
                ],
                argumentAxis: {
                    visualRange: [0, 100]
                },
                onDrawn: this.onDrawn,
                customizeAnnotation,
                commonAnnotationSettings: annotationSettings,
                annotations: annotationItems
            }).dxChart('instance');
        },
        getAnnotationsGroup() {
            return this.renderer.g.getCalls().map(g => g.returnValue).filter(g => {
                const attr = g.stub('attr').getCall(0);
                return attr && attr.args[0].class === 'dxc-annotations';
            })[0];
        }
    });

    QUnit.test('Do not create annotation if no items passed', function(assert) {
        this.chart({ some: 'options' });
        assert.equal(this.createAnnotationStub.callCount, 0);
    });

    QUnit.test('Create annotation with given options', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const customizeAnnotation = {
            customize: 'annotation'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const chart = this.chart(annotationOptions, items, customizeAnnotation);

        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.equal(this.createAnnotationStub.getCall(0).args[0], chart);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[1], items);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[2], {
            some: 'options',
            image: {
                width: 30,
                height: 30
            },
            font: {
                color: '#333333',
                cursor: 'default',
                family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
                size: 12,
                weight: 400
            },
            tooltipEnabled: true,

            border: {
                width: 1,
                color: '#dddddd',
                dashStyle: 'solid',
                visible: true
            },
            color: '#ffffff',
            opacity: 0.9,
            arrowLength: 14,
            arrowWidth: 14,
            paddingLeftRight: 10,
            paddingTopBottom: 10,
            textOverflow: 'ellipsis',
            wordWrap: 'normal',
            shadow: {
                opacity: 0.15,
                offsetX: 0,
                offsetY: 1,
                blur: 4,
                color: '#000000'
            },
            allowDragging: false
        });
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[3], customizeAnnotation);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[4], plugins.chart.members._pullOptions);
    });

    QUnit.test('Pass widget instance and group to annotations.draw method', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const chart = this.chart(annotationOptions, items);

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [chart, this.getAnnotationsGroup()]);
    });

    QUnit.test('Draw annotations before onDrawn event', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        this.chart(annotationOptions, items);

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.ok(annotation.draw.lastCall.calledBefore(this.onDrawn.lastCall));
    });

    QUnit.test('Change annotations option - recreate annotations, clear group, draw new annotations', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const chart = this.chart(annotationOptions, items);
        this.createAnnotationStub.getCall(0).returnValue[0].draw.resetHistory();
        this.createAnnotationStub.resetHistory();

        const newItems = [
            { some: 'newItem' }
        ];
        chart.option({ annotations: newItems });

        // assert
        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[1], newItems);
        assert.equal(this.createAnnotationStub.getCall(0).args[2].some, 'options');

        const annotationsGroup = this.getAnnotationsGroup();

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.equal(annotation.plaque.clear.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [chart, annotationsGroup]);
        assert.ok(annotation.draw.lastCall.calledAfter(annotationsGroup.clear.lastCall));
    });

    QUnit.test('Change commonAnnotationSettings option - recreate annotations, clear group, draw new annotations', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const chart = this.chart(annotationOptions, items);
        this.createAnnotationStub.getCall(0).returnValue[0].draw.resetHistory();
        this.createAnnotationStub.resetHistory();

        const newAnnotationOptions = {
            some: 'otherOptions'
        };
        chart.option({ commonAnnotationSettings: newAnnotationOptions });

        // assert
        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[1], items);
        assert.equal(this.createAnnotationStub.getCall(0).args[2].some, 'otherOptions');

        const annotationsGroup = this.getAnnotationsGroup();

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.equal(annotation.plaque.clear.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [chart, annotationsGroup]);
        assert.ok(annotation.draw.lastCall.calledAfter(annotationsGroup.clear.lastCall));
    });

    QUnit.module('PolarChart plugin', {
        beforeEach() {
            this.onDrawn = sinon.spy();
        },
        polarChart(annotationSettings, annotationItems, customizeAnnotation) {
            return $('<div>').appendTo('#qunit-fixture').dxPolarChart({
                size: {
                    width: 100,
                    height: 100
                },
                legend: { visible: false },
                dataSource: [],
                series: [],
                commonAxisSettings: {
                    grid: { visible: false },
                    label: { visible: false }
                },
                valueAxis: {},
                argumentAxis: {
                    visualRange: [0, 100]
                },
                onDrawn: this.onDrawn,
                customizeAnnotation,
                commonAnnotationSettings: annotationSettings,
                annotations: annotationItems
            }).dxPolarChart('instance');
        },
        getAnnotationsGroup() {
            return this.renderer.g.getCalls().map(g => g.returnValue).filter(g => {
                const attr = g.stub('attr').getCall(0);
                return attr && attr.args[0].class === 'dxc-annotations';
            })[0];
        }
    });

    QUnit.test('Do not create annotation if no items passed', function(assert) {
        this.polarChart({ some: 'options' });
        assert.equal(this.createAnnotationStub.callCount, 0);
    });

    QUnit.test('Create annotation with given options', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const customizeAnnotation = {
            customize: 'annotation'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 },
            { angle: 45, radius: 120 }
        ];
        const polarChart = this.polarChart(annotationOptions, items, customizeAnnotation);

        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.equal(this.createAnnotationStub.getCall(0).args[0], polarChart);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[1], items);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[2], {
            some: 'options',
            image: {
                width: 30,
                height: 30
            },
            font: {
                color: '#333333',
                cursor: 'default',
                family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif',
                size: 12,
                weight: 400
            },
            tooltipEnabled: true,

            border: {
                width: 1,
                color: '#dddddd',
                dashStyle: 'solid',
                visible: true
            },
            color: '#ffffff',
            opacity: 0.9,
            arrowLength: 14,
            arrowWidth: 14,
            paddingLeftRight: 10,
            paddingTopBottom: 10,
            textOverflow: 'ellipsis',
            wordWrap: 'normal',
            shadow: {
                opacity: 0.15,
                offsetX: 0,
                offsetY: 1,
                blur: 4,
                color: '#000000'
            },
            allowDragging: false
        });
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[3], customizeAnnotation);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[4], plugins.polarChart.members._pullOptions);
    });

    QUnit.test('Pass widget instance and group to annotations.draw method', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const polarChart = this.polarChart(annotationOptions, items);

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [polarChart, this.getAnnotationsGroup()]);
    });

    QUnit.test('Draw annotations before onDrawn event', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        this.polarChart(annotationOptions, items);

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.ok(annotation.draw.lastCall.calledBefore(this.onDrawn.lastCall));
    });

    QUnit.test('Change annotations option - recreate annotations, clear group, draw new annotations', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const polarChart = this.polarChart(annotationOptions, items);
        this.createAnnotationStub.getCall(0).returnValue[0].draw.resetHistory();
        this.createAnnotationStub.resetHistory();

        const newItems = [
            { some: 'newItem' }
        ];
        polarChart.option({ annotations: newItems });

        // assert
        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[1], newItems);
        assert.equal(this.createAnnotationStub.getCall(0).args[2].some, 'options');

        const annotationsGroup = this.getAnnotationsGroup();

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.equal(annotation.plaque.clear.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [polarChart, annotationsGroup]);
        assert.ok(annotation.draw.lastCall.calledAfter(annotationsGroup.clear.lastCall));
    });

    QUnit.test('Change commonAnnotationSettings option - recreate annotations, clear group, draw new annotations', function(assert) {
        const annotationOptions = {
            some: 'options'
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const polarChart = this.polarChart(annotationOptions, items);
        this.createAnnotationStub.getCall(0).returnValue[0].draw.resetHistory();
        this.createAnnotationStub.resetHistory();

        const newAnnotationOptions = {
            some: 'otherOptions'
        };
        polarChart.option({ commonAnnotationSettings: newAnnotationOptions });

        // assert
        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[1], items);
        assert.equal(this.createAnnotationStub.getCall(0).args[2].some, 'otherOptions');

        const annotationsGroup = this.getAnnotationsGroup();

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.equal(annotation.plaque.clear.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [polarChart, annotationsGroup]);
        assert.ok(annotation.draw.lastCall.calledAfter(annotationsGroup.clear.lastCall));
    });
});

const environment = {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = sinon.spy(() => this.renderer);

        TooltipModule.Tooltip = sinon.spy((options) => {
            this.tooltip = new vizMocks.Tooltip(options);
            this.tooltip.show = sinon.stub().returns(true);
            this.tooltip.hide = sinon.spy();
            this.tooltip.move = sinon.spy();
            this.tooltip.isCursorOnTooltip = sinon.stub().returns(false);
            return this.tooltip;
        });
    },
    createChart(options) {
        const chart = $('<div>').appendTo('#qunit-fixture').dxChart($.extend(true, {
            size: {
                width: 100,
                height: 100
            },
            legend: { visible: false },
            dataSource: [],
            series: [],
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false }
            },
            valueAxis: [
                { name: 'a1', visualRange: [0, 100] }
            ],
            argumentAxis: {
                visualRange: [0, 100]
            },
            commonAnnotationSettings: {
                tooltipEnabled: false,
                type: 'image',
                image: {
                    width: 20,
                    height: 10
                },
                paddingLeftRight: 0,
                paddingTopBottom: 0
            },
            annotations: [
                { x: undefined, y: undefined, name: 'annotation0', description: 'd0', tooltipEnabled: true, someOption: 'option0' },
                { x: 30, y: 30, name: 'annotation1', description: 'd1', tooltipEnabled: true, someOption: 'option1' },
                { x: 70, y: 70, name: 'annotation2', description: 'd2', tooltipEnabled: true, someOption: 'option2' }
            ]
        }, options)).dxChart('instance');

        return chart;
    }
};

QUnit.module('Tooltip', environment, function() {
    QUnit.test('Create - use chart toltip options, but remove customize callback and contentTemplate', function(assert) {
        this.createChart({
            tooltip: {
                enabled: false,
                otherCommonOption: 'option',
                customizeTooltip() { return 'my tooltip'; },
                contentTemplate: a => a
            }
        });

        assert.equal(this.tooltip.ctorArgs[0].cssClass, 'dxc-annotation-tooltip', 'tooltip should be have right css class');
        assert.equal(this.tooltip.setRendererOptions.callCount, 1, 'tooltip.setRendererOptions should be called');
        assert.equal(this.tooltip.update.callCount, 1, 'tooltip.update should be called');

        assert.strictEqual(this.tooltip.update.getCall(0).args[0].enabled, false);
        assert.strictEqual(this.tooltip.update.getCall(0).args[0].otherCommonOption, 'option');
        assert.strictEqual(this.tooltip.update.getCall(0).args[0].customizeTooltip, undefined);
        assert.strictEqual(this.tooltip.update.getCall(0).args[0].contentTemplate, undefined);
    });

    QUnit.test('Show on pointer down', function(assert) {
        const customizeTooltip = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                customizeTooltip
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 20 + 3, y: 25 + 5 }).down();

        const tooltip = this.tooltip;
        assert.equal(chart.hideTooltip.callCount, 1);
        assert.equal(chart.clearHover.callCount, 1);
        assert.equal(tooltip.show.callCount, 1);

        assert.equal(tooltip.show.getCall(0).args[0].someOption, 'option1');
        assert.equal(tooltip.show.getCall(0).args[0].description, 'd1');
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 23, y: 30 });
        assert.equal(tooltip.show.getCall(0).args[2].target, tooltip.show.getCall(0).args[0]);
        assert.equal(tooltip.show.getCall(0).args[3], customizeTooltip);
    });

    QUnit.test('Show on pointer move', function(assert) {
        const customizeTooltip = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                customizeTooltip
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 80 + 3, y: 75 + 5 }).move();

        const tooltip = this.tooltip;
        assert.equal(chart.hideTooltip.callCount, 1);
        assert.equal(chart.clearHover.callCount, 1);
        assert.equal(tooltip.show.callCount, 1);

        assert.equal(tooltip.show.getCall(0).args[0].someOption, 'option2');
        assert.equal(tooltip.show.getCall(0).args[0].description, 'd2');
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 83, y: 80 });
        assert.equal(tooltip.show.getCall(0).args[2].target, tooltip.show.getCall(0).args[0]);
        assert.equal(tooltip.show.getCall(0).args[3], customizeTooltip);
    });

    QUnit.test('Show tooltip only once then move it', function(assert) {
        const customizeTooltip = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                customizeTooltip
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 70, y: 70 }).move().move(3, 3);

        const tooltip = this.tooltip;
        assert.equal(tooltip.show.callCount, 1);
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 70, y: 70 });

        assert.equal(tooltip.move.callCount, 1);
        assert.deepEqual(tooltip.move.getCall(0).args, [73, 73]);
    });

    QUnit.test('Show tooltip and not move it if the tooltip is interactive and cursor on it (T1006930)', function(assert) {
        const customizeTooltip = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                customizeTooltip
            }
        });
        this.tooltip.isCursorOnTooltip.returns(true);

        const pointer = pointerMock(chart._annotationsGroup.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 70, y: 70 }).move().move(3, 3);

        const tooltip = this.tooltip;
        assert.equal(tooltip.show.callCount, 1);
        assert.equal(tooltip.isCursorOnTooltip.callCount, 1);
        assert.equal(tooltip.move.callCount, 0);
    });

    QUnit.test('set content template for tooltip', function(assert) {
        const tooltipTemplate = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                tooltipTemplate
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 70, y: 70 }).move().move(3, 3);

        const tooltip = this.tooltip;
        assert.equal(tooltip.setTemplate.callCount, 1);
        assert.ok(tooltip.setTemplate.lastCall.calledBefore(tooltip.show.lastCall));
        assert.equal(tooltip.show.callCount, 1);
    });

    QUnit.test('Do not move tooltip if it was not shown', function(assert) {
        const customizeTooltip = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                customizeTooltip
            }
        });
        this.tooltip.show.returns(false);

        const pointer = pointerMock(chart._annotationsGroup.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 70, y: 70 }).move().move(3, 3);

        const tooltip = this.tooltip;
        assert.equal(tooltip.show.callCount, 2);
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 70, y: 70 });
        assert.deepEqual(tooltip.show.getCall(1).args[1], { x: 73, y: 73 });

        assert.equal(tooltip.move.callCount, 0);
    });

    QUnit.test('Hide tooltip on pointer down outside chart', function(assert) {
        const customizeTooltip = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                customizeTooltip
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();
        const rootPointer = pointerMock(chart._renderer.root.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 30, y: 30 }).down().up();
        rootPointer.start().down(40, 40).up();
        eventsEngine.trigger(getDocument(), 'dxpointerdown');

        const tooltip = this.tooltip;

        assert.equal(tooltip.show.callCount, 1);
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 30, y: 30 });

        assert.equal(tooltip.hide.callCount, 1);
        assert.ok(tooltip.hide.getCall(0).calledAfter(tooltip.show.getCall(0)));
    });

    QUnit.test('Not hide tooltip on pointer down outside chart if cursor on the tooltip (T1006930)', function(assert) {
        const customizeTooltip = sinon.spy();
        const chart = this.createChart({
            commonAnnotationSettings: {
                customizeTooltip
            }
        });
        this.tooltip.isCursorOnTooltip.returns(true);

        const pointer = pointerMock(chart._annotationsGroup.element).start();
        const rootPointer = pointerMock(chart._renderer.root.element).start();

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        pointer.start({ x: 30, y: 30 }).down().up();
        rootPointer.start().down(40, 40).up();
        eventsEngine.trigger(getDocument(), 'dxpointerdown');

        const tooltip = this.tooltip;

        assert.equal(tooltip.show.callCount, 1);
        assert.equal(tooltip.isCursorOnTooltip.callCount, 1);
        assert.equal(tooltip.hide.callCount, 0);
    });

    QUnit.test('Hide tooltip on container scroll', function(assert) {
        const originalPlatform = devices.real().platform;

        try {
            devices.real({ platform: 'generic' });
            const chart = this.createChart();

            const pointer = pointerMock(chart._annotationsGroup.element).start();

            chart.hideTooltip = sinon.spy();
            chart.clearHover = sinon.spy();

            pointer.start({ x: 30, y: 30 }).down().up();

            eventsEngine.trigger($('#qunit-fixture'), 'scroll');

            const tooltip = this.tooltip;

            assert.equal(tooltip.show.callCount, 1);
            assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 30, y: 30 });

            assert.equal(tooltip.hide.callCount, 1);
            assert.ok(tooltip.hide.getCall(0).calledAfter(tooltip.show.getCall(0)));
        } finally {
            devices.real({ platform: originalPlatform });
        }
    });

    QUnit.test('Do not show tooltip if it is disabled', function(assert) {
        const chart = this.createChart({
            commonAnnotationSettings: {
                tooltipEnabled: true
            },
            annotations: [
                { x: 30, y: 30, name: 'annotation1', description: 'd1', tooltipEnabled: false },
                { x: 70, y: 70, name: 'annotation2', description: 'd2', tooltipEnabled: false }
            ]
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();
        pointer.start({ x: 20 + 3, y: 25 + 5 }).down();

        assert.equal(this.tooltip.show.callCount, 0);
    });

    QUnit.test('Do not show tooltip on pointer down when dragging allowed', function(assert) {
        const chart = this.createChart({
            commonAnnotationSettings: {
                allowDragging: true
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();
        pointer.start({ x: 20 + 3, y: 25 + 5 }).down();

        assert.equal(this.tooltip.show.callCount, 0);
    });

    QUnit.test('Do not show tooltip on pointer move when dragging allowed', function(assert) {
        const chart = this.createChart({
            commonAnnotationSettings: {
                allowDragging: true
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();
        pointer.start({ x: 20 + 3, y: 25 + 5 }).down().move(3, 3);

        assert.equal(this.tooltip.show.callCount, 0);
    });

    QUnit.test('Show tooltip on pointer up when dragging allowed', function(assert) {
        const chart = this.createChart({
            commonAnnotationSettings: {
                allowDragging: true
            }
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();
        const basePointer = pointerMock($('#qunit-fixture')).start();
        pointer.start({ x: 20 + 3, y: 25 + 5 }).down().up();
        basePointer.start({ x: 20 + 3, y: 25 + 5 }).up();

        assert.equal(this.tooltip.show.callCount, 1);
    });

    QUnit.test('Dispose', function(assert) {
        const chart = this.createChart({
            some: 'options'
        }, [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ]);
        const annotationsGroup = chart._annotationsGroup;
        chart.dispose();

        assert.equal(this.tooltip.dispose.callCount, 1);
        assert.equal(annotationsGroup.off.lastCall.args[0], '.annotations');
    });
});

QUnit.module('Drag', environment, function() {
    QUnit.test('Disabled (by default)', function(assert) {
        const chart = this.createChart();

        const plaqueMove = chart._annotations.items[1].plaque._contentGroup.move;

        const pointer = pointerMock(chart._annotationsGroup.children[1].element).start();
        pointer.start({ x: 20 + 5, y: 25 + 5 }).dragStart().drag(10, 10).dragEnd();

        assert.notOk(chart._annotations.items[1].offsetX);
        assert.notOk(chart._annotations.items[1].offsetY);
        assert.notOk(chart._annotations.items[1]._dragOffsetX);
        assert.notOk(chart._annotations.items[1]._dragOffsetY);
        assert.equal(plaqueMove.callCount, 1);
    });

    QUnit.test('Simple drag', function(assert) {
        const chart = this.createChart({
            commonAnnotationSettings: {
                allowDragging: true
            },
            annotations: []
        });
        chart.option('annotations', [
            { x: 30, y: 30, name: 'annotation1', description: 'd1' },
            { argument: 70, name: 'annotation2', description: 'd2' }
        ]);

        const plaqueMove = chart._annotations.items[0].plaque._contentGroup.move;

        const pointer = pointerMock(chart._annotationsGroup.children[0].element).start();
        pointer.start({ x: 20 + 5, y: 25 + 5 }).dragStart().drag(10, 10).dragEnd();

        assert.equal(this.tooltip.show.callCount, 0);
        assert.equal(chart._annotations.items[0].offsetX, 35);
        assert.equal(chart._annotations.items[0].offsetY, 40);
        assert.equal(chart._annotations.items[0]._dragOffsetX, 5);
        assert.equal(chart._annotations.items[0]._dragOffsetY, 0);
        assert.equal((chart._annotations.items[0].plaque._cloud._stored_settings.d.match(/,/g) || []).length, 4, 'check not bounded - has no arrow');
        assert.equal((chart._annotations.items[1].plaque._cloud._stored_settings.d.match(/,/g) || []).length, 9, 'check bounded - has arrow');
        assert.deepEqual(plaqueMove.getCall(1).args, [29, 33]);
    });

    QUnit.test('Dragging with predefined offset', function(assert) {
        const chart = this.createChart({
            commonAnnotationSettings: {
                allowDragging: true,
                offsetX: 20,
                offsetY: -10
            }
        });

        const plaqueMove = chart._annotations.items[1].plaque._contentGroup.move;

        const pointer = pointerMock(chart._annotationsGroup.children[1].element).start();
        pointer.start({ x: 20 + 5, y: 25 + 5 }).dragStart().drag(10, 10).dragEnd();

        assert.equal(chart._annotations.items[1].offsetX, 55);
        assert.equal(chart._annotations.items[1].offsetY, 30);
        assert.equal(chart._annotations.items[1]._dragOffsetX, 25);
        assert.equal(chart._annotations.items[1]._dragOffsetY, -10);
        assert.deepEqual(plaqueMove.getCall(1).args, [49, 23]);
    });

    QUnit.test('Drag the annotation and pan', function(assert) {
        const chart = this.createChart({
            argumentAxis: {
                visualRange: [10, 90],
                wholeRange: [0, 100]
            },
            zoomAndPan: {
                argumentAxis: 'both'
            },
            commonAnnotationSettings: {
                allowDragging: true
            }
        });

        chart._lastRenderingTime = 10;

        const pointerAnnotation = pointerMock(chart._annotationsGroup.children[1].element).start();
        pointerAnnotation.start({ x: 20 + 5, y: 25 + 5 }).dragStart().drag(10, 10).dragEnd();

        const pointer = pointerMock(chart._renderer.root.element).start();
        pointer.start({ x: 5, y: 5 }).dragStart().drag(-15, 2).dragEnd();

        const plaqueMove = chart._annotations.items[1].plaque._contentGroup.move;

        assert.equal(chart._annotations.items[1].offsetX, 35);
        assert.equal(chart._annotations.items[1].offsetY, 40);
        assert.equal(chart._annotations.items[1]._dragOffsetX, 5);
        assert.equal(chart._annotations.items[1]._dragOffsetY, 0);
        assert.equal(plaqueMove.callCount, 1);
        assert.deepEqual(plaqueMove.getCall(0).args, [54, 63]);
        assert.deepEqual(chart.getArgumentAxis().visualRange(), { startValue: 18, endValue: 98 });
    });
});
