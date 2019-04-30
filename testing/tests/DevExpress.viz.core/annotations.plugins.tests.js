import $ from "jquery";
import { __test_utils } from "viz/core/annotations";
import rendererModule from "viz/core/renderers/renderer";
import TooltipModule from "viz/core/tooltip";
import vizMocks from "../../helpers/vizMocks.js";
import pointerMock from "../../helpers/pointerMock.js";
import eventsEngine from "events/core/events_engine";
import { getDocument } from "core/dom_adapter";
import devices from "core/devices";

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
    p1Canvas: { width: 100, height: 210, top: 0, bottom: 110, left: 0, right: 0, originalTop: 0, originalBottom: 110, originalLeft: 0, originalRight: 0 },
    p2Canvas: { width: 100, height: 210, top: 110, bottom: 0, left: 0, right: 0, originalTop: 110, originalBottom: 0, originalLeft: 0, originalRight: 0 },
    getChartForSeriesTests(options) {
        return $('<div>').appendTo("#qunit-fixture").dxChart($.extend({
            size: {
                width: 100,
                height: 210
            },
            panes: [{ name: "p1" }, { name: "p2" }],
            defaultPane: "p1",
            dataSource: [
                { arg: 0, val: 100 },
                { arg: 50, val: 200 },
                { arg: 100, val: 100 }
            ],
            series: [
                { name: "s1", type: "line", axis: "a1", pane: "p1" },
                { name: "s2", type: "line", axis: "a2", pane: "p2" }
            ],
            valueAxis: [
                { name: "a1", visualRange: [100, 200] },
                { name: "a2", visualRange: [100, 200], position: "right" }
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
        }, options)).dxChart("instance");
    },
    checkCoords(assert, chart, annotation, expected, canvas) {
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

        if(canvas) {
            assert.deepEqual(coords.canvas, canvas);
        }
    }
}, function() {
    QUnit.test("Get coordinates from axes", function(assert) {
        const chart = this.getChartForSeriesTests({
            valueAxis: [
                { name: "a1", visualRange: [100, 200] },
                { name: "a2", visualRange: [200, 300], position: "right" }
            ]
        });

        this.checkCoords(assert, chart, { argument: 50, value: 110 }, { x: 50, y: 90 }, this.p1Canvas);
        this.checkCoords(assert, chart, { argument: 50, value: 250, axis: "a2" }, { x: 50, y: 160 }, this.p2Canvas);

        this.checkCoords(assert, chart, { value: 150 }, { x: 0, y: 50 }, this.p1Canvas);
        this.checkCoords(assert, chart, { value: 250, axis: "a2" }, { x: 100, y: 160 }, this.p2Canvas);

        this.checkCoords(assert, chart, { argument: 50 }, { x: 50, y: 100 }, this.p1Canvas);
        this.checkCoords(assert, chart, { argument: 50, axis: "a2" }, { x: 50, y: 210 }, this.p2Canvas);
    });

    QUnit.test("Get coordinates from series. Line series", function(assert) {
        let chart = this.getChartForSeriesTests();
        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 60 }, this.p1Canvas);
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 60 }, this.p1Canvas);

        this.checkCoords(assert, chart, { argument: 20, series: "s2" }, { x: 20, y: 170 }, this.p2Canvas);
        this.checkCoords(assert, chart, { value: 140, series: "s2" }, { x: 20, y: 170 }, this.p2Canvas);

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 40 });
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 40 });

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false },
                { name: "a2", visualRange: [100, 200] }
            ]
        });

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 150, y: 80 });
    });

    QUnit.test("Get coordinates from series. Area series", function(assert) {
        let chart = this.getChartForSeriesTests();

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 60 });
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 60 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 20, y: 40 });
        this.checkCoords(assert, chart, { value: 140, series: "s1" }, { x: 20, y: 40 });

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 20, series: "s1" }, { x: 150, y: 80 });
    });

    QUnit.test("Get coordinates from series. Stepline series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
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
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 160, y: 75 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 210, y: 25 });
    });

    QUnit.test("Get coordinates from series. Steparea series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
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
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 25, series: "s1" }, { x: 160, y: 75 });
        this.checkCoords(assert, chart, { argument: 75, series: "s1" }, { x: 210, y: 25 });
    });

    QUnit.test("Get coordinates from series. Spline series", function(assert) {
        let chart = this.getChartForSeriesTests({
            series: [{ name: "s1", type: "spline" }]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 15 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 15 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 85 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 85 });

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 195, y: 68 });
    });

    QUnit.test("Get coordinates from series. Splinearea series", function(assert) {
        let chart = this.getChartForSeriesTests({
            series: [{ name: "s1", type: "splinearea" }]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 15 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 15 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 32, y: 85 });
        this.checkCoords(assert, chart, { value: 185, series: "s1" }, { x: 32, y: 85 });

        chart.option({
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 32, series: "s1" }, { x: 195, y: 68 });
    });

    QUnit.test("Get coordinates from series. Bar series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150 },
                { arg: 50, val: 200 },
                { arg: 100, val: 150 }
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
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 160, y: 100 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 210, y: 50 });
    });

    QUnit.test("Get coordinates from series. Side-by-side bar series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val1: 110, val2: 130, val3: 120 },
                { arg: 50, val1: 140, val2: 170, val3: 150 },
                { arg: 100, val1: 180, val2: 200, val3: 160 }
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
            size: {
                width: 210,
                height: 100
            },
            rotated: true,
            valueAxis: [
                { name: "a1", visualRange: [100, 200], inverted: false }
            ]
        });

        this.checkCoords(assert, chart, { argument: 0, series: "s1" }, { x: 160, y: 100 });
        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 210, y: 50 });
    });

    QUnit.test("Get coordinates from series. Bubble series", function(assert) {
        let chart = this.getChartForSeriesTests({
            dataSource: [
                { arg: 0, val: 150, size: 20 },
                { arg: 50, val: 200, size: 60 },
                { arg: 100, val: 150, size: 40 }
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
            series: [{ name: "s1", type: "rangeBar" }]
        });

        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 30 });
        this.checkCoords(assert, chart, { value: 160, series: "s1" }, { x: 50, y: 40 });

        chart.option("valueAxis[0].inverted", true);

        this.checkCoords(assert, chart, { argument: 50, series: "s1" }, { x: 50, y: 70 });
    });

    QUnit.test("Cases when coords can not be calculated", function(assert) {
        const chart = this.getChartForSeriesTests();

        this.checkCoords(assert, chart, { x: 50, y: 50, series: "s1", axis: "a2" }, { x: undefined, y: undefined });
        this.checkCoords(assert, chart, { value: 150, axis: "wrongaxis" }, { x: undefined, y: undefined });
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
            textOverflow: "ellipsis",
            wordWrap: "normal",
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

QUnit.module("Tooltip", {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = sinon.spy(() => this.renderer);

        TooltipModule.Tooltip = (options) => {
            this.tooltip = new vizMocks.Tooltip(options);
            this.tooltip.show = sinon.stub();
            this.tooltip.show.returns(true);
            this.tooltip.hide = sinon.spy();
            this.tooltip.move = sinon.spy();
            return this.tooltip;
        };
    },
    createChart(options) {
        const chart = $('<div>').appendTo("#qunit-fixture").dxChart($.extend(true, {
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
                { name: "a1", visualRange: [0, 100] }
            ],
            argumentAxis: {
                visualRange: [0, 100]
            },
            commonAnnotationSettings: {
                tooltipEnabled: false,
                type: "image",
                image: {
                    width: 20,
                    height: 10
                },
                paddingLeftRight: 0,
                paddingTopBottom: 0
            },
            annotations: [
                { x: 30, y: 30, name: "annotation1", description: "d1", tooltipEnabled: true, someOption: "option1" },
                { x: 70, y: 70, name: "annotation2", description: "d2", tooltipEnabled: true, someOption: "option2" }
            ]
        }, options)).dxChart("instance");

        return chart;
    }
}, function() {
    QUnit.test("Create - use chart toltip options, but remove customize callback", function(assert) {
        this.createChart({
            tooltip: {
                enabled: false,
                otherCommonOption: "option",
                customizeTooltip() { return "my tooltip"; }
            }
        });

        assert.equal(this.tooltip.ctorArgs[0].cssClass, "dxc-annotation-tooltip", "tooltip should be have right css class");
        assert.equal(this.tooltip.setRendererOptions.callCount, 1, "tooltip.setRendererOptions should be called");
        assert.equal(this.tooltip.update.callCount, 1, "tooltip.update should be called");

        assert.strictEqual(this.tooltip.update.getCall(0).args[0].enabled, false);
        assert.strictEqual(this.tooltip.update.getCall(0).args[0].otherCommonOption, "option");
        assert.strictEqual(this.tooltip.update.getCall(0).args[0].customizeTooltip, undefined);
    });

    QUnit.test("Show on pointer down", function(assert) {
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

        assert.equal(tooltip.show.getCall(0).args[0].someOption, "option1");
        assert.equal(tooltip.show.getCall(0).args[0].description, "d1");
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 23, y: 30 });
        assert.equal(tooltip.show.getCall(0).args[2].target, tooltip.show.getCall(0).args[0]);
        assert.equal(tooltip.show.getCall(0).args[3], customizeTooltip);
    });

    QUnit.test("Show on pointer move", function(assert) {
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

        assert.equal(tooltip.show.getCall(0).args[0].someOption, "option2");
        assert.equal(tooltip.show.getCall(0).args[0].description, "d2");
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 83, y: 80 });
        assert.equal(tooltip.show.getCall(0).args[2].target, tooltip.show.getCall(0).args[0]);
        assert.equal(tooltip.show.getCall(0).args[3], customizeTooltip);
    });

    QUnit.test("Show tooltip only once then move it", function(assert) {
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

    QUnit.test("Do not move tooltip if it was not shown", function(assert) {
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

    QUnit.test("Hide tooltip on pointer down outside chart", function(assert) {
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
        rootPointer.start().down(40, 40);
        eventsEngine.trigger(getDocument(), "dxpointerdown");

        const tooltip = this.tooltip;

        assert.equal(tooltip.show.callCount, 1);
        assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 30, y: 30 });

        assert.equal(tooltip.hide.callCount, 1);
        assert.ok(tooltip.hide.getCall(0).calledAfter(tooltip.show.getCall(0)));
    });

    QUnit.test("Hide tooltip on parent scroll", function(assert) {
        var originalPlatform = devices.real().platform;

        try {
            devices.real({ platform: "generic" });
            const customizeTooltip = sinon.spy();
            const chart = this.createChart({
                commonAnnotationSettings: {
                    customizeTooltip
                }
            });

            const pointer = pointerMock(chart._annotationsGroup.element).start();

            chart.hideTooltip = sinon.spy();
            chart.clearHover = sinon.spy();

            pointer.start({ x: 30, y: 30 }).down().up();
            eventsEngine.trigger($("#qunit-fixture").parent(), "scroll");

            const tooltip = this.tooltip;

            assert.equal(tooltip.show.callCount, 1);
            assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 30, y: 30 });

            assert.equal(tooltip.hide.callCount, 1);
            assert.ok(tooltip.hide.getCall(0).calledAfter(tooltip.show.getCall(0)));
        } finally {
            devices.real({ platform: originalPlatform });
        }
    });

    QUnit.test("Do not hide tooltip on parent scroll on mobile", function(assert) {
        var originalPlatform = devices.real().platform;

        try {
            devices.real({ platform: "ios" });
            const customizeTooltip = sinon.spy();
            const chart = this.createChart({
                commonAnnotationSettings: {
                    customizeTooltip
                }
            });

            const pointer = pointerMock(chart._annotationsGroup.element).start();

            chart.hideTooltip = sinon.spy();
            chart.clearHover = sinon.spy();

            pointer.start({ x: 30, y: 30 }).down().up();
            eventsEngine.trigger($("#qunit-fixture").parent(), "scroll");

            const tooltip = this.tooltip;

            assert.equal(tooltip.show.callCount, 1);
            assert.deepEqual(tooltip.show.getCall(0).args[1], { x: 30, y: 30 });

            assert.equal(tooltip.hide.callCount, 0);
        } finally {
            devices.real({ platform: originalPlatform });
        }
    });

    QUnit.test("Do not show tooltip if it is disabled", function(assert) {
        const chart = this.createChart({
            commonAnnotationSettings: {
                tooltipEnabled: true
            },
            annotations: [
                { x: 30, y: 30, name: "annotation1", description: "d1", tooltipEnabled: false },
                { x: 70, y: 70, name: "annotation2", description: "d2", tooltipEnabled: false }
            ]
        });

        const pointer = pointerMock(chart._annotationsGroup.element).start();
        pointer.start({ x: 20 + 3, y: 25 + 5 }).down();

        assert.equal(this.tooltip.show.callCount, 0);
    });

    QUnit.test("Dispose", function(assert) {
        const chart = this.createChart({
            some: "options"
        }, [
            { x: 100, y: 200, },
            { value: 1, argument: 2 }
        ]);
        const annotationsGroup = chart._annotationsGroup;
        chart.dispose();

        assert.equal(this.tooltip.dispose.callCount, 1);
        assert.equal(annotationsGroup.off.lastCall.args[0], ".annotations");
    });
});
