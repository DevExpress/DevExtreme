import $ from "jquery";
import { __test_utils } from "viz/core/annotations";
import rendererModule from "viz/core/renderers/renderer";
import vizMocks from "../../helpers/vizMocks.js";
import TooltipModule from "viz/core/tooltip";

import "viz/chart";

const environment = {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = sinon.spy(() => this.renderer);

        this.createAnnotationStub = sinon.stub().returns([{ draw: sinon.spy() }]);
        __test_utils.stub_createAnnotations(this.createAnnotationStub);
    },
    afterEach() {
        __test_utils.restore_createAnnotations();
        rendererModule.Renderer.reset();
    }
};

QUnit.module("Coordinates calculation. Chart plugin", {
    getChartForAxisTests() {
        return $('<div>').appendTo("#qunit-fixture").dxChart({
            size: {
                width: 100,
                height: 210
            },
            legend: { visible: false },
            dataSource: [],
            series: [],
            commonAxisSettings: {
                grid: { visible: false },
                label: { visible: false }
            },
            synchronizeMultiAxes: false,
            panes: [{ name: "p1" }, { name: "p2" }],
            defaultPane: "p1",
            valueAxis: [
                { name: "a1", visualRange: [100, 200], pane: "p1" },
                { name: "a2", visualRange: [200, 300], pane: "p2", position: "right" }
            ],
            argumentAxis: {
                visualRange: [0, 100]
            }
        }).dxChart('instance');
    },
    getChartForSeriesTests(options) {
        return $('<div>').appendTo("#qunit-fixture").dxChart($.extend({
            size: {
                width: 100,
                height: 100
            },
            legend: { visible: false },
            dataSource: [],
            series: [],
            commonAxisSettings: {
                valueMarginsEnabled: false,
                grid: { visible: false },
                label: { visible: false },
                tick: { visible: false }
            },
            synchronizeMultiAxes: false,
            valueAxis: [
                { name: "a1", visualRange: [100, 200] },
                { name: "a2", visualRange: [200, 300] }
            ],
            argumentAxis: {
                visualRange: [0, 100]
            }
        }, options)).dxChart("instance");
    },
    checkCoords(assert, chart, annotation, expected) {
        const coords = chart._getAnnotationCoords(annotation);
        if(expected.x !== undefined) {
            assert.roughEqual(coords.x, expected.x, 0.6);
        } else {
            assert.equal(coords.x, expected.x);
        }

        if(expected.y !== undefined) {
            assert.roughEqual(coords.y, expected.y, 0.6);
        } else {
            assert.equal(coords.y, expected.y);
        }
    }
}, function() {
    QUnit.test("Get coordinates from axes", function(assert) {
        const chart = this.getChartForAxisTests();

        this.checkCoords(assert, chart, { argument: 50, value: 110 }, { x: 50, y: 90 });
        this.checkCoords(assert, chart, { argument: 50, value: 250, axis: "a2" }, { x: 50, y: 160 });

        this.checkCoords(assert, chart, { value: 150 }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { value: 250, axis: "a2" }, { x: 99, y: 160 });

        this.checkCoords(assert, chart, { argument: 50 }, { x: 50, y: 100 });
        this.checkCoords(assert, chart, { argument: 50, axis: "a2" }, { x: 50, y: 209 });
    });

    QUnit.test("Get coordinates from series. Line series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 100 },
                { arg: 50, val: 200 },
                { arg: 100, val: 100 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "line" }]
        });

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 60 });
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 60 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 40 });
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 40 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 40, y: 80 });
    });

    QUnit.test("Get coordinates from series. Area series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 100 },
                { arg: 50, val: 200 },
                { arg: 100, val: 100 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "area" }]
        });

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 60 });
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 60 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 40 });
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 40 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 40, y: 80 });
    });

    QUnit.test("Get coordinates from series. Stepline series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "stepline" }]
        });

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 25, y: 50 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 75, y: 0 });

        // TODO
        // this.checkCoords(assert, chart, { value: 150, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { value: 180, series: "s1" }, { x: 50, y: 20 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 25, y: 50 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 75, y: 100 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 50, y: 75 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 100, y: 25 });
    });

    QUnit.test("Get coordinates from series. Steparea series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "steparea" }]
        });

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 25, y: 50 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 75, y: 0 });

        // TODO
        // this.checkCoords(assert, chart, { value: 150, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { value: 180, series: "s1" }, { x: 50, y: 20 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 25, y: 50 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 75, y: 100 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 50, y: 75 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 100, y: 25 });
    });

    QUnit.test("Get coordinates from series. Spline series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 100 },
                { arg: 50, val: 200 },
                { arg: 100, val: 100 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "spline" }]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 15 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 15 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 85 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 85 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 85, y: 68 });
    });

    QUnit.test("Get coordinates from series. Splinearea series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 100 },
                { arg: 50, val: 200 },
                { arg: 100, val: 100 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "splinearea" }]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 15 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 15 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 85 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 85 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 85, y: 68 });
    });

    QUnit.test("Get coordinates from series. Bar series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "bar" }]
        });

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { argument: 10, series: "s1" }, { x: 10, y: 100 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 0 });

        // TODO
        // this.checkCoords(assert, chart, { value: 150, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { value: 200, series: "s1" }, { x: 50, y: 0 });
        this.checkCoords(assert, chart, { value: 160, series: "s1" }, { x: 50, y: 40 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 100 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 50, y: 100 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 100, y: 50 });
    });

    QUnit.test("Get coordinates from series. Side-by-side bar series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val1: 110, val2: 130, val3: 120 },
                { arg: 50, val1: 140, val2: 170, val3: 150 },
                { arg: 100, val1: 180, val2: 200, val3: 160 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [
                { name: "s1", valueField: "val1", type: "bar" },
                { name: "s2", valueField: "val2", type: "bar" },
                { name: "s3", valueField: "val3", type: "bar" }
            ]
        });

        this.checkCoords(assert, chart, { argument: 50, series: "s2" }, { x: 50, y: 30 });
        // TODO
        // this.checkCoords(assert, chart, { argument: 50, series: "s3" }, { x: 62, y: 50 });

        this.checkCoords(assert, chart, { value: 170, series: "s2" }, { x: 50, y: 30 });
        this.checkCoords(assert, chart, { value: 150, series: "s3" }, { x: 62, y: 50 });
    });

    QUnit.test("Get coordinates from series. Scatter series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "scatter" }]
        });

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { argument: 10, series: "s1" }, { x: 10, y: 100 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 0 });

        this.checkCoords(assert, chart, { value: 150, series: "s1" }, { x: 0, y: 50 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 100 });

        chart.option({
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 50, y: 100 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 100, y: 50 });
    });

    QUnit.test("Get coordinates from series. Bubble series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150, size: 20 },
                { arg: 50, val: 200, size: 60 },
                { arg: 100, val: 150, size: 40 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "bubble" }]
        });

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 25, y: 100 });
        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { argument: 48, series: "s1" }, { x: 48, y: 0 });

        this.checkCoords(assert, chart, { value: 150, series: "s1" }, { x: 0, y: 50 });
        this.checkCoords(assert, chart, { value: 190, series: "s1" }, { x: 50, y: 10 });
    });

    QUnit.test("Get coordinates from series. Financial series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { date: 10, low: 120, high: 180, open: 140, close: 160 },
                { date: 50, low: 140, high: 200, open: 160, close: 180 },
                { date: 90, low: 100, high: 160, open: 120, close: 140 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "candlestick" }]
        });

        this.checkCoords(assert, chart, { argument: 10, series: "s1" }, { x: 10, y: 50 });
        this.checkCoords(assert, chart, { argument: 90, series: "s1" }, { x: 90, y: 70 });
        this.checkCoords(assert, chart, { argument: 40, series: "s1" }, { x: 40, y: 100 });

        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 10, y: 60 });
    });

    QUnit.test("Get coordinates from series. Range series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val1: 110, val2: 130 },
                { arg: 50, val1: 140, val2: 170 },
                { arg: 100, val1: 180, val2: 200 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "rangeBar" }]
        });

        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 30 });
        this.checkCoords(assert, chart, { value: 160, series: "s1" }, { x: 50, y: 40 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 70 });
    });

    QUnit.test("Cases when coords can not be calculated", function(assert) {
        const chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 100 },
                { arg: 50, val: 200 },
                { arg: 100, val: 100 }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] }
            ],
            series: [{ name: "s1", type: "line" }]
        });

        this.checkCoords(assert, chart, { x: 50, y: 50, series: "s1", axis: "a2" }, { x: undefined, y: undefined });
        this.checkCoords(assert, chart, { value: 150, axis: "wrongaxis" }, { x: undefined, y: undefined });
    });
});

0 && QUnit.module("Old. Coordinates calculation", function() {
    QUnit.module("Chart plugin", {
        chart(options) {
            return $('<div>').appendTo("#qunit-fixture").dxChart($.extend({
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
                    { name: "a1", visualRange: [100, 200] },
                    { name: "a2", visualRange: [200, 300] }
                ],
                argumentAxis: {
                    visualRange: [0, 100]
                }
            }, options)).dxChart("instance");
        }
    });

    QUnit.test("Check coords. x, y - use directly", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ x: 100, y: 200 });

        assert.deepEqual(coords, { x: 100, y: 200 });
    });

    QUnit.test("Check coords. argument, value - translate", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ argument: 50, value: 110 });

        assert.deepEqual(coords, { x: 50, y: 89 });
    });

    QUnit.test("Check coords. argument, value of named axis - translate using correct axes", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ argument: 50, value: 210, axis: "a2" });

        assert.deepEqual(coords, { x: 50, y: 89 });
    });

    QUnit.test("Check coords. x, argument, value - translate value and use x directly", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ x: 10, argument: 50, value: 110 });

        assert.deepEqual(coords, { x: 10, y: 89 });
    });

    QUnit.test("Check coords. y, argument, value - translate arument and use y directly", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ y: 10, argument: 50, value: 110 });

        assert.deepEqual(coords, { x: 50, y: 10 });
    });

    QUnit.test("Check coords. Get y coord from axis", function(assert) {
        const testCase = (options, coords, message) => {
            const { x, y } = this.chart({
                size: {
                    width: 100,
                    height: 210
                },
                panes: [ { name: "p1" }, { name: "p2" }],
                defaultPane: "p1",
                valueAxis: [
                    { name: "a1", visualRange: [100, 200], pane: "p1" },
                    { name: "a2", visualRange: [200, 300], pane: "p2" }
                ],
            })._getAnnotationCoords(options);

            assert.deepEqual({ x, y }, coords, message);
        };

        testCase({ x: 50 }, { x: 50, y: 100 }, "Can't find by x");
        testCase({ argument: 40 }, { x: 40, y: 100 }, "Can't find by argument");
        testCase({ x: 30, value: 20 }, { x: 30, y: 180 }, "Can't find by x and value");
        testCase({ argument: 50, value: 150 }, { x: 50, y: 50 }, "Can't find by argument and value");
        testCase({ argument: 10, axis: "a2" }, { x: 10, y: 209 }, "Can't find by argument and axis");
        testCase({ x: 0, value: 250, axis: "a2" }, { x: 0, y: 160 }, "Can't find by x, value and axis");
    });

    QUnit.test("Check coords. Get x coord from axis", function(assert) {
        const testCase = (options, coords, message) => {
            const { x, y } = this.chart({
                size: {
                    width: 100,
                    height: 210
                },
                panes: [{ name: "p1" }, { name: "p2" }],
                defaultPane: "p1",
                valueAxis: [
                    { name: "a1", visualRange: [100, 200], pane: "p1" },
                    { name: "a2", visualRange: [200, 300], pane: "p2", position: "right" }
                ],
            })._getAnnotationCoords(options);

            assert.deepEqual({ x, y }, coords, message);
        };

        testCase({ y: 50 }, { x: 0, y: 50 }, "Can't find by y");
        testCase({ value: 150 }, { x: 0, y: 50 }, "Can't find by value");
        testCase({ argument: 50, y: 50 }, { x: 50, y: 50 }, "Can't find by x and argument");
        testCase({ value: 250, axis: "a2" }, { x: 99, y: 160 }, "Can't find by value and axis");
        testCase({ argument: 50, value: 270, axis: "a2" }, { x: 50, y: 140 }, "Can't find by value, argument and axis");
    });

    QUnit.test("Check coords. Get y coord from series", function(assert) {
        const testCase = (options, annotation_options, coord, type, inverted, message) => {
            const annotation_coords = this.chart($.extend({
                dataSource: [{ arg: 0, val: 100 },
                    { arg: 50, val: 200 },
                    { arg: 100, val: 100 }
                ],
                valueAxis: [
                    { name: "a1", visualRange: [100, 200], inverted }
                ],
                series: [{ name: "s1", type }]
            }, options))._getAnnotationCoords(annotation_options);

            assert.roughEqual(annotation_coords.y, coord, 1, message);
        };

        const otherSource = [{ arg: 0, val: 150 },
            { arg: 50, val: 200 },
            { arg: 100, val: 150 }
        ];

        const bubbleSource = [{ arg: 0, val: 150, size: 20 },
            { arg: 50, val: 200, size: 60 },
            { arg: 100, val: 150, size: 40 }
        ];

        const financialSource = [{ date: 10, low: 120, high: 180, open: 140, close: 160 },
            { date: 50, low: 140, high: 200, open: 160, close: 180 },
            { date: 90, low: 100, high: 160, open: 120, close: 140 }
        ];

        const someSeriesSource = [{ arg: 0, val1: 110, val2: 130, val3: 120 },
            { arg: 50, val1: 140, val2: 170, val3: 150 },
            { arg: 100, val1: 180, val2: 200, val3: 160 }
        ];

        const getSeriesOptions = (type) => {
            return [{ name: "s1", valueField: "val1", type },
                { name: "s2", valueField: "val2", type },
                { name: "s3", valueField: "val3", type }];
        };

        // line, x
        testCase({}, { x: 30, series: "s1" }, 50, "line", false, "Line. Can't find by x");
        testCase({}, { x: 70, series: "s1" }, 49, "line", true, "Line. Can't find by x (inverted)");
        testCase({ rotated: true }, { x: 50, series: "s1" }, 69, "line", false, "Line. Can't find by x (rotated)");
        testCase({ rotated: true }, { x: 50, series: "s1" }, 70, "line", true, "Line. Can't find by x (inverted, rotated)");

        // line, argument
        testCase({}, { argument: 25, series: "s1" }, 50, "line", false, "Line. Can't find by argument");
        testCase({}, { argument: 75, series: "s1" }, 50, "line", true, "Line. Can't find by argument (inverted)");

        // area, x
        testCase({}, { x: 30, series: "s1" }, 40, "area", false, "Area. Can't find by x");
        testCase({}, { x: 70, series: "s1" }, 59, "area", true, "Area. Can't find by x (inverted)");
        testCase({ rotated: true }, { x: 50, series: "s1" }, 75, "area", false, "Area. Can't find by x (rotated)");
        testCase({ rotated: true }, { x: 50, series: "s1" }, 75, "area", true, "Area. Can't find by x (inverted, rotated)");

        // area, argument
        testCase({}, { argument: 25, series: "s1" }, 50, "area", false, "Can't find by argument");
        testCase({}, { argument: 75, series: "s1" }, 50, "area", true, "Can't find by argument (inverted)");

        // stepline, x
        testCase({ dataSource: otherSource }, { x: 70, series: "s1" }, 25, "stepline", false, "Stepline. Can't find by x");
        testCase({ dataSource: otherSource }, { x: 70, series: "s1" }, 74, "stepline", true, "Stepline. Can't find by x (inverted)");
        testCase({ dataSource: otherSource, rotated: true }, { x: 50, series: "s1" }, 50, "stepline", false, "Stepline. Can't find by x (rotated)");
        testCase({ dataSource: otherSource, rotated: true }, { x: 50, series: "s1" }, 50, "stepline", true, "Stepline. Can't find by x (inverted, rotated)");

        // stepline, argument
        testCase({ dataSource: otherSource }, { argument: 25, series: "s1" }, 49, "stepline", false, "Stepline. Can't find by argument");
        testCase({ dataSource: otherSource }, { argument: 75, series: "s1" }, 74, "stepline", true, "Stepline. Can't find by argument (inverted)");

        // steparea, x
        testCase({ dataSource: otherSource }, { x: 70, series: "s1" }, 0, "steparea", false, "Steparea. Can't find by x");
        testCase({ dataSource: otherSource }, { x: 30, series: "s1" }, 50, "steparea", true, "Steparea. Can't find by x (inverted)");
        testCase({
            dataSource: otherSource,
            rotated: true,
            argumentAxis: {
                visualRange: [0, 100],
                inverted: true
            }
        }, { x: 70, series: "s1" }, 50, "steparea", false, "Steparea. Can't find by x (rotated)");
        testCase({
            dataSource: otherSource,
            rotated: true,
            argumentAxis: {
                visualRange: [0, 100],
                inverted: true
            }
        }, { x: 30, series: "s1" }, 50, "steparea", true, "Steparea. Can't find by x (inverted, rotated)");

        // steparea, argument
        testCase({ dataSource: otherSource }, { argument: 25, series: "s1" }, 50, "steparea", false, "Steparea. Can't find by argument");
        testCase({ dataSource: otherSource }, { argument: 75, series: "s1" }, 99, "steparea", true, "Steparea. Can't find by argument (inverted)");

        // spline, x
        testCase({}, { x: 75, series: "s1" }, 46, "spline", false, "Spline. Can't find by x");
        testCase({}, { x: 25, series: "s1" }, 54, "spline", true, "Spline. Can't find by x (inverted)");
        testCase({ rotated: true }, { x: 50, series: "s1" }, 76.5, "spline", false, "Spline. Can't find by x (rotated)");
        testCase({ rotated: true }, { x: 50, series: "s1" }, 77.5, "spline", true, "Spline. Can't find by x (inverted, rotated)");

        // spline, argument
        testCase({}, { argument: 40, series: "s1" }, 27.5, "spline", false, "Spline. Can't find by argument");
        testCase({}, { argument: 40, series: "s1" }, 72.5, "spline", true, "Spline. Can't find by argument (inverted)");

        // splineArea, x
        testCase({}, { x: 71, series: "s1" }, 20, "splineArea", false, "SplineArea. Can't find by x");
        testCase({}, { x: 29, series: "s1" }, 80, "splineArea", true, "SplineArea. Can't find by x (inverted)");
        testCase({ rotated: true }, { x: 71, series: "s1" }, 75.5, "splineArea", false, "SplineArea. Can't find by x (rotated)");
        testCase({ rotated: true }, { x: 29, series: "s1" }, 75.5, "splineArea", true, "SplineArea. Can't find by x (inverted, rotated)");

        // splineArea, argument
        testCase({}, { argument: 32, series: "s1" }, 15, "splineArea", false, "SplineArea. Can't find by argument");
        testCase({}, { argument: 32, series: "s1" }, 85, "splineArea", true, "SplineArea. Can't find by argument (inverted)");

        // bar, x
        testCase({ dataSource: otherSource }, { x: 75, series: "s1" }, 50, "bar", false, "Bar. Can't find by x");
        testCase({ dataSource: otherSource }, { x: 25, series: "s1" }, 50, "bar", true, "Bar. Can't find by x (inverted)");
        testCase({ dataSource: otherSource, rotated: true }, { x: 75, series: "s1" }, 50, "bar", false, "Bar. Can't find by x (rotated)");
        testCase({ dataSource: otherSource, rotated: true }, { x: 75, series: "s1" }, 81.5, "bar", true, "Bar. Can't find by x (inverted, rotated)");

        // bar, argument
        testCase({ dataSource: otherSource }, { argument: 10, series: "s1" }, 50, "bar", false, "Bar. Can't find by argument");
        testCase({ dataSource: otherSource }, { argument: 50, series: "s1" }, 99, "bar", true, "Bar. Can't find by argument (inverted)");

        // side-by-side bar, x
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { x: 75, series: "s1" }, 20, null, false, "Side-by-side Bar. Can't find by x");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { x: 18, series: "s2" }, 30, null, true, "Side-by-side Bar. Can't find by x (inverted)");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar"), rotated: true }, { x: 41, series: "s3" }, 42, null, false, "Side-by-side Bar. Can't find by x (rotated)");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar"), rotated: true }, { x: 55, series: "s1" }, 25, null, true, "Side-by-side Bar. Can't find by x (inverted, rotated)");

        // side-by-side bar, argument
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { argument: 0, series: "s2" }, 69, null, false, "Side-by-side Bar. Can't find by argument");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { argument: 60, series: "s3" }, 50, null, true, "Side-by-side Bar. Can't find by argument (inverted)");

        // scatter
        testCase({ dataSource: otherSource }, { x: 90, series: "s1" }, 49, "scatter", false, "Scatter. Can't find by x");
        testCase({ dataSource: otherSource, rotated: true }, { x: 50, series: "s1" }, 89, "scatter", false, "Scatter. Can't find by x (rotated)");
        testCase({ dataSource: otherSource }, { argument: 50, series: "s1" }, 25, "scatter", false, "Scatter. Can't find by argument");

        // bubble
        testCase({ dataSource: bubbleSource }, { x: 92, series: "s1" }, 49, "bubble", false, "Bubble. Can't find by x");
        testCase({ dataSource: bubbleSource, rotated: true }, { x: 50, series: "s1" }, 89, "bubble", false, "Bubble. Can't find by x (rotated)");
        testCase({ dataSource: bubbleSource }, { argument: 48, series: "s1" }, 25, "bubble", false, "Bubble. Can't find by argument");

        // financial, x
        testCase({ dataSource: financialSource }, { x: 50, series: "s1" }, 39, "candlestick", false, "Candlestick. Can't find by x");
        testCase({ dataSource: financialSource }, { x: 20, series: "s1" }, 49, "candlestick", true, "Candlestick. Can't find by x (inverted)");
        testCase({ dataSource: financialSource, rotated: true }, { x: 50, series: "s1" }, 84, "candlestick", false, "Candlestick. Can't find by x (rotated)");
        testCase({ dataSource: financialSource, rotated: true }, { x: 65, series: "s1" }, 15, "candlestick", true, "Candlestick. Can't find by x (inverted, rotated)");

        // financial, argument
        testCase({ dataSource: financialSource }, { argument: 10, series: "s1" }, 49, "stock", false, "Stock. Can't find by argument");
        testCase({ dataSource: financialSource }, { argument: 90, series: "s1" }, 39, "stock", true, "Stok. Can't find by argument (inverted)");

        // range, x
        testCase({ dataSource: someSeriesSource }, { x: 50, series: "s1" }, 30, "rangeArea", false, "RangeArea. Can't find by x");
        testCase({ dataSource: someSeriesSource }, { x: 20, series: "s1" }, 46, "rangeArea", true, "RangeArea. Can't find by x (inverted)");
        testCase({ dataSource: someSeriesSource, rotated: true }, { x: 50, series: "s1" }, 74, "rangeArea", false, "RangeArea. Can't find by x (rotated)");
        testCase({ dataSource: someSeriesSource, rotated: true }, { x: 40, series: "s1" }, 62.5, "rangeArea", true, "RangeArea. Can't find by x (inverted, rotated)");

        // range, argument
        testCase({ dataSource: someSeriesSource }, { argument: 10, series: "s1" }, 69, "rangeBar", false, "RangeBar. Can't find by argument");
        testCase({ dataSource: someSeriesSource }, { argument: 10, series: "s1" }, 30, "rangeBar", true, "RangeBar. Can't find by argument (inverted)");

    });

    QUnit.test("Check coords. Get x coord from series", function(assert) {
        const testCase = (options, annotation_options, coord, type, inverted, message) => {
            const annotation_coords = this.chart($.extend({
                dataSource: [{ arg: 0, val: 100 },
                    { arg: 50, val: 200 },
                    { arg: 100, val: 100 }
                ],
                valueAxis: [
                    { name: "a1", visualRange: [100, 200], inverted }
                ],
                series: [{ name: "s1", type }]
            }, options))._getAnnotationCoords(annotation_options);

            assert.roughEqual(annotation_coords.x, coord, 1, message);
        };

        const otherSource = [{ arg: 0, val: 150 },
            { arg: 50, val: 200 },
            { arg: 100, val: 150 }
        ];

        const bubbleSource = [{ arg: 0, val: 150, size: 20 },
            { arg: 50, val: 200, size: 60 },
            { arg: 100, val: 150, size: 40 }
        ];

        const financialSource = [{ date: 10, low: 120, high: 180, open: 140, close: 160 },
            { date: 50, low: 140, high: 200, open: 160, close: 180 },
            { date: 90, low: 100, high: 160, open: 120, close: 140 }
        ];

        const someSeriesSource = [{ arg: 0, val1: 110, val2: 130, val3: 120 },
            { arg: 50, val1: 140, val2: 170, val3: 150 },
            { arg: 100, val1: 180, val2: 200, val3: 160 }
        ];

        const getSeriesOptions = (type) => {
            return [{ name: "s1", valueField: "val1", type },
                { name: "s2", valueField: "val2", type },
                { name: "s3", valueField: "val3", type }];
        };

        // line, y
        testCase({}, { y: 30, series: "s1" }, 46, "line", false, "Line. Can't find by y");
        testCase({}, { y: 70, series: "s1" }, 46, "line", true, "Line. Can't find by y (inverted)");
        testCase({ rotated: true }, { y: 50, series: "s1" }, 66, "line", false, "Line. Can't find by y (rotated)");
        testCase({ rotated: true }, { y: 50, series: "s1" }, 33, "line", true, "Line. Can't find by y (inverted, rotated)");

        // line, value
        testCase({}, { value: 130, series: "s1" }, 22, "line", false, "Line. Can't find by value");
        testCase({}, { value: 180, series: "s1" }, 42, "line", true, "Line. Can't find by value (inverted)");

        // area, y
        testCase({}, { y: 30, series: "s1" }, 35, "area", false, "Area. Can't find by y");
        testCase({}, { y: 70, series: "s1" }, 35, "area", true, "Area. Can't find by y (inverted)");
        testCase({ rotated: true }, { y: 50, series: "s1" }, 99, "area", false, "Area. Can't find by y (rotated)");
        testCase({ rotated: true }, { y: 50, series: "s1" }, 0, "area", true, "Area. Can't find by y (inverted, rotated)");

        // area, value
        testCase({}, { value: 130, series: "s1" }, 15, "area", false, "Can't find by value");
        testCase({}, { value: 170, series: "s1" }, 35, "area", true, "Can't find by value (inverted)");

        // stepline, y
        testCase({ dataSource: otherSource }, { y: 30, series: "s1" }, 50, "stepline", false, "Stepline. Can't find by y");
        testCase({ dataSource: otherSource }, { y: 70, series: "s1" }, 50, "stepline", true, "Stepline. Can't find by y (inverted)");
        testCase({ dataSource: otherSource, rotated: true }, { y: 50, series: "s1" }, 66, "stepline", false, "Stepline. Can't find by y (rotated)");
        testCase({ dataSource: otherSource, rotated: true }, { y: 50, series: "s1" }, 33, "stepline", true, "Stepline. Can't find by y (inverted, rotated)");

        // stepline, value
        testCase({ dataSource: otherSource }, { value: 160, series: "s1" }, 50, "stepline", false, "Stepline. Can't find by value");
        testCase({ dataSource: otherSource }, { value: 170, series: "s1" }, 50, "stepline", true, "Stepline. Can't find by value (inverted)");

        // steparea, y
        testCase({ dataSource: otherSource }, { y: 30, series: "s1" }, 50, "steparea", false, "Steparea. Can't find by y");
        testCase({ dataSource: otherSource }, { y: 70, series: "s1" }, 50, "steparea", true, "Steparea. Can't find by y (inverted)");
        testCase({
            dataSource: otherSource,
            rotated: true,
            argumentAxis: {
                visualRange: [0, 100],
                inverted: true
            }
        }, { y: 70, series: "s1" }, 99, "steparea", false, "Steparea. Can't find by y (rotated)");
        testCase({
            dataSource: otherSource,
            rotated: true,
            argumentAxis: {
                visualRange: [0, 100],
                inverted: true
            }
        }, { y: 30, series: "s1" }, 50, "steparea", true, "Steparea. Can't find by y (inverted, rotated)");

        // steparea, value
        testCase({ dataSource: otherSource }, { value: 155, series: "s1" }, 50, "steparea", false, "Steparea. Can't find by value");
        testCase({ dataSource: otherSource }, { value: 175, series: "s1" }, 50, "steparea", true, "Steparea. Can't find by value (inverted)");

        // spline, y
        testCase({}, { y: 25, series: "s1" }, 50, "spline", false, "Spline. Can't find by y");
        testCase({}, { y: 50, series: "s1" }, 22.5, "spline", true, "Spline. Can't find by y (inverted)");
        testCase({ rotated: true }, { y: 50, series: "s1" }, 66, "spline", false, "Spline. Can't find by y (rotated)");
        testCase({ rotated: true }, { y: 50, series: "s1" }, 33, "spline", true, "Spline. Can't find by y (inverted, rotated)");

        // spline, value
        testCase({}, { value: 150, series: "s1" }, 22.5, "spline", false, "Spline. Can't find by value");
        testCase({}, { value: 200, series: "s1" }, 50, "spline", true, "Spline. Can't find by value (inverted)");

        // splineArea, y
        testCase({}, { y: 30, series: "s1" }, 24, "splineArea", false, "SplineArea. Can't find by y");
        testCase({}, { y: 70, series: "s1" }, 24, "splineArea", true, "SplineArea. Can't find by y (inverted)");
        testCase({ rotated: true }, { y: 71, series: "s1" }, 79, "splineArea", false, "SplineArea. Can't find by y (rotated)");
        testCase({ rotated: true }, { y: 29, series: "s1" }, 20, "splineArea", true, "SplineArea. Can't find by y (inverted, rotated)");

        // splineArea, value
        testCase({}, { value: 150, series: "s1" }, 15, "splineArea", false, "SplineArea. Can't find by value");
        testCase({}, { value: 190, series: "s1" }, 35.5, "splineArea", true, "SplineArea. Can't find by value (inverted)");

        // bar, y
        testCase({ dataSource: otherSource }, { y: 75, series: "s1" }, 16.5, "bar", false, "Bar. Can't find by y");
        testCase({ dataSource: otherSource }, { y: 25, series: "s1" }, 16.5, "bar", true, "Bar. Can't find by y (inverted)");
        testCase({ dataSource: otherSource, rotated: true }, { y: 75, series: "s1" }, 50, "bar", false, "Bar. Can't find by y (rotated)");
        testCase({ dataSource: otherSource, rotated: true }, { y: 90, series: "s1" }, 50, "bar", true, "Bar. Can't find by y (inverted, rotated)");

        // bar, value
        testCase({ dataSource: otherSource }, { value: 120, series: "s1" }, 16.5, "bar", false, "Bar. Can't find by value");
        testCase({ dataSource: otherSource }, { value: 190, series: "s1" }, 50, "bar", true, "Bar. Can't find by value (inverted)");

        // side-by-side bar, y
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { y: 75, series: "s1" }, 42, null, false, "Side-by-side Bar. Can't find by y");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { y: 25, series: "s2" }, 16.5, null, true, "Side-by-side Bar. Can't find by y (inverted)");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar"), rotated: true }, { y: 75, series: "s3" }, 20, null, false, "Side-by-side Bar. Can't find by y (rotated)");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar"), rotated: true }, { y: 55, series: "s1" }, 59, null, true, "Side-by-side Bar. Can't find by y (inverted, rotated)");

        // side-by-side bar, value
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { value: 120, series: "s2" }, 16.5, null, false, "Side-by-side Bar. Can't find by value");
        testCase({ dataSource: someSeriesSource, series: getSeriesOptions("bar") }, { value: 160, series: "s3" }, 90, null, true, "Side-by-side Bar. Can't find by value (inverted)");

        // scatter
        testCase({ dataSource: otherSource }, { y: 50, series: "s1" }, 10, "scatter", false, "Scatter. Can't find by y");
        testCase({ dataSource: otherSource, rotated: true }, { y: 50, series: "s1" }, 66, "scatter", false, "Scatter. Can't find by y (rotated)");
        testCase({ dataSource: otherSource }, { value: 150, series: "s1" }, 10, "scatter", false, "Scatter. Can't find by value");

        // bubble
        testCase({ dataSource: bubbleSource }, { y: 52, series: "s1" }, 10, "bubble", false, "Bubble. Can't find by y");
        testCase({ dataSource: bubbleSource, rotated: true }, { y: 50, series: "s1" }, 66, "bubble", false, "Bubble. Can't find by y (rotated)");
        testCase({ dataSource: bubbleSource }, { value: 148, series: "s1" }, 10, "bubble", false, "Bubble. Can't find by value");

        // financial, y
        testCase({ dataSource: financialSource }, { y: 30, series: "s1" }, 50, "candlestick", false, "Candlestick. Can't find by y");
        testCase({ dataSource: financialSource }, { y: 70, series: "s1" }, 50, "candlestick", true, "Candlestick. Can't find by y (inverted)");
        testCase({ dataSource: financialSource, rotated: true }, { y: 50, series: "s1" }, 56.5, "candlestick", false, "Candlestick. Can't find by y (rotated)");
        testCase({ dataSource: financialSource, rotated: true }, { y: 80, series: "s1" }, 50, "candlestick", true, "Candlestick. Can't find by y (inverted, rotated)");

        // financial, value
        testCase({ dataSource: financialSource }, { value: 130, series: "s1" }, 15, "stock", false, "Stock. Can't find by value");
        testCase({ dataSource: financialSource }, { value: 190, series: "s1" }, 50, "stock", true, "Stok. Can't find by value (inverted)");

        // range, y
        testCase({ dataSource: someSeriesSource }, { y: 50, series: "s1" }, 25, "rangeArea", false, "RangeArea. Can't find by y");
        testCase({ dataSource: someSeriesSource }, { y: 70, series: "s1" }, 51.5, "rangeArea", true, "RangeArea. Can't find by y (inverted)");
        testCase({ dataSource: someSeriesSource, rotated: true }, { y: 50, series: "s1" }, 69, "rangeArea", false, "RangeArea. Can't find by y (rotated)");
        testCase({ dataSource: someSeriesSource, rotated: true }, { y: 40, series: "s1" }, 24, "rangeArea", true, "RangeArea. Can't find by y (inverted, rotated)");

        // range, value
        testCase({ dataSource: someSeriesSource }, { value: 160, series: "s1" }, 49.5, "rangeBar", false, "RangeBar. Can't find by value");
        testCase({ dataSource: someSeriesSource }, { value: 130, series: "s1" }, 16.5, "rangeBar", true, "RangeBar. Can't find by value (inverted)");
    });

    QUnit.test("Return null/undefined values if they cannot be calculated", function(assert) {
        const testCase = (options, coords, message) => {
            const { x, y } = this.chart()._getAnnotationCoords(options);

            assert.deepEqual({ x, y }, coords, message);
        };

        testCase({}, { x: undefined, y: undefined }, "No coords at all");
        testCase({ x: 0, value: "wrong_value" }, { x: 0, y: null }, "Can't translate value");
        testCase({ y: 0, argument: "wrong_argument" }, { x: null, y: 0 }, "Can't translate argument");
        testCase({ x: 0, value: 100, axis: "wrong_axis" }, { x: 0, y: undefined }, "Can't value axis");
    });
});

QUnit.module("Lifecycle", environment, function() {
    QUnit.module("Chart plugin", {
        beforeEach() {
            this.onDrawn = sinon.spy();
        },
        chart(annotationSettings, annotationItems) {
            return $('<div>').appendTo("#qunit-fixture").dxChart({
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
                    { name: "a1", visualRange: [100, 200] },
                    { name: "a2", visualRange: [200, 300] }
                ],
                argumentAxis: {
                    visualRange: [0, 100]
                },
                onDrawn: this.onDrawn,
                commonAnnotationSettings: annotationSettings,
                annotations: annotationItems
            }).dxChart("instance");
        },
        getAnnotationsGroup() {
            return this.renderer.g.getCalls().map(g => g.returnValue).filter(g => {
                const attr = g.stub("attr").getCall(0);
                return attr && attr.args[0].class === "dxc-annotations";
            })[0];
        }
    });

    QUnit.test("Do not create annotation if no items passed", function(assert) {
        this.chart({ some: "options" });
        assert.equal(this.createAnnotationStub.callCount, 0);
    });

    QUnit.test("Create annotation with given options", function(assert) {
        const annotationOptions = {
            some: "options"
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        this.chart(annotationOptions, items);

        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[0], items);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[1], {
            some: "options",
            image: {
                width: 30,
                height: 30
            },
            font: {
                color: "#333333",
                cursor: "default",
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif",
                size: 12,
                weight: 400
            },
            tooltipEnabled: true,

            border: {
                width: 1,
                color: "#dddddd",
                dashStyle: "solid",
                visible: true
            },
            color: "#ffffff",
            opacity: 0.9,
            arrowLength: 14,
            arrowWidth: 14,
            paddingLeftRight: 10,
            paddingTopBottom: 10,
            shadow: {
                opacity: 0.15,
                offsetX: 0,
                offsetY: 1,
                blur: 4,
                color: '#000000'
            }
        });
    });

    QUnit.test("Pass widget instance and group to annotations.draw method", function(assert) {
        const annotationOptions = {
            some: "options"
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

    QUnit.test("Draw annotations before onDrawn event", function(assert) {
        const annotationOptions = {
            some: "options"
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        this.chart(annotationOptions, items);

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.ok(annotation.draw.lastCall.calledBefore(this.onDrawn.lastCall));
    });

    QUnit.test("Change annotations option - recreate annotations, clear group, draw new annotations", function(assert) {
        const annotationOptions = {
            some: "options"
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const chart = this.chart(annotationOptions, items);
        this.createAnnotationStub.getCall(0).returnValue[0].draw.reset();
        this.createAnnotationStub.reset();

        const newItems = [
            { some: "newItem" }
        ];
        chart.option({ annotations: newItems });

        // assert
        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[0], newItems);
        assert.equal(this.createAnnotationStub.getCall(0).args[1].some, "options");

        const annotationsGroup = this.getAnnotationsGroup();

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [chart, annotationsGroup]);
        assert.ok(annotation.draw.lastCall.calledAfter(annotationsGroup.clear.lastCall));
    });

    QUnit.test("Change commonAnnotationSettings option - recreate annotations, clear group, draw new annotations", function(assert) {
        const annotationOptions = {
            some: "options"
        };
        const items = [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ];
        const chart = this.chart(annotationOptions, items);
        this.createAnnotationStub.getCall(0).returnValue[0].draw.reset();
        this.createAnnotationStub.reset();

        const newAnnotationOptions = {
            some: "otherOptions"
        };
        chart.option({ commonAnnotationSettings: newAnnotationOptions });

        // assert
        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[0], items);
        assert.equal(this.createAnnotationStub.getCall(0).args[1].some, "otherOptions");

        const annotationsGroup = this.getAnnotationsGroup();

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [chart, annotationsGroup]);
        assert.ok(annotation.draw.lastCall.calledAfter(annotationsGroup.clear.lastCall));
    });
});

QUnit.module("Tooltip", function(hooks) {
    hooks.beforeEach(() => {
        environment.beforeEach.apply(this, arguments);
        TooltipModule.Tooltip = (options) => {
            this.tooltip = new vizMocks.Tooltip(options);
            this.tooltip.show = sinon.spy();

            return this.tooltip;
        };
    });

    hooks.afterEach(function() {
        environment.afterEach.apply(this, arguments);
    });

    function createChart(commonAnnotationSettings, annotations) {
        return $('<div>').appendTo("#qunit-fixture").dxChart({
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
                { name: "a1", visualRange: [100, 200] },
                { name: "a2", visualRange: [200, 300] }
            ],
            argumentAxis: {
                visualRange: [0, 100]
            },
            commonAnnotationSettings,
            annotations
        }).dxChart("instance");
    }

    QUnit.test("Create", assert => {
        createChart({
            some: "options"
        }, [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ]);

        assert.equal(this.tooltip.ctorArgs[0].cssClass, "dxc-annotation-tooltip", "tooltip should be have right css class");
        assert.equal(this.tooltip.setRendererOptions.callCount, 1, "tooltip.setRendererOptions should be called");
        assert.equal(this.tooltip.update.callCount, 1, "tooltip.update should be called");
    });

    QUnit.test("Show", assert => {
        const chart = createChart({
            some: "options"
        }, [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ]);

        const tooltipFormatObject = { format: "tooltip for annotation" };
        const customizeTooltip = () => { };
        const point = {
            getTooltipFormatObject: sinon.spy(() => tooltipFormatObject),
            getTooltipParams: sinon.spy(() => { return { x: 1, y: 1 }; }),
            options: {
                customizeTooltip,
                tooltipEnabled: true
            }
        };

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        const tooltip = this.tooltip;

        assert.equal(this.renderer.root.on.lastCall.args[0], "dxpointermove.annotations", "renderer root should be subscribe on dxpointermove");
        this.renderer.root.on.lastCall.args[1]({ target: { "annotation-data": point } });

        assert.equal(chart.hideTooltip.callCount, 1);
        assert.equal(chart.clearHover.callCount, 1);
        assert.equal(tooltip.show.callCount, 1);

        assert.equal(tooltip.show.firstCall.args[0], tooltipFormatObject);
        assert.deepEqual(tooltip.show.firstCall.args[1], { x: 4, y: 6 });
        assert.equal(tooltip.show.firstCall.args[2].target, point);
        assert.equal(tooltip.show.firstCall.args[3], customizeTooltip);
    });

    QUnit.test("Do not show tooltip if it is disabled", assert => {
        createChart({
            some: "options"
        }, [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ]);

        const tooltipFormatObject = { format: "tooltip for annotation" };
        const customizeTooltip = () => { };
        const point = {
            getTooltipFormatObject: sinon.spy(() => tooltipFormatObject),
            getTooltipParams: sinon.spy(() => { return { x: 1, y: 1 }; }),
            options: {
                customizeTooltip,
                tooltipEnabled: false
            }
        };

        const tooltip = this.tooltip;
        this.renderer.root.on.lastCall.args[1]({ target: { "annotation-data": point } });

        assert.equal(tooltip.show.callCount, 0);

    });

    QUnit.test("Hide", assert => {
        const chart = createChart({
            some: "options"
        }, [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ]);

        const tooltipFormatObject = { format: "tooltip for annotation" };
        const point = {
            getTooltipFormatObject: sinon.spy(() => tooltipFormatObject),
            getTooltipParams: sinon.spy(() => { return { x: 1, y: 1 }; })
        };

        chart.hideTooltip = sinon.spy();
        chart.clearHover = sinon.spy();

        const tooltip = this.tooltip;

        this.renderer.root.on.lastCall.args[1]({ target: { "series-data": point } });

        assert.equal(tooltip.hide.callCount, 1);

        assert.equal(chart.hideTooltip.callCount, 0);
        assert.equal(chart.clearHover.callCount, 0);

        assert.equal(tooltip.show.callCount, 0);
    });

    QUnit.test("Dispose", assert => {
        const chart = createChart({
            some: "options"
        }, [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ]);
        chart.dispose();

        assert.equal(this.tooltip.dispose.callCount, 1);
        assert.equal(this.renderer.root.off.getCall(3).args[0], "dxpointermove.annotations");
    });
});
