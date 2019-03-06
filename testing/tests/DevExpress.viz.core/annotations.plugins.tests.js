import $ from "jquery";
import { __test_utils } from "viz/core/annotations";
import rendererModule from "viz/core/renderers/renderer";
import vizMocks from "../../helpers/vizMocks.js";

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

QUnit.module("Coordinates calculation", function() {
    QUnit.module("Chart plugin", {
        chart() {
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
                }
            }).dxChart("instance");
        }
    });

    QUnit.test("Check coords. x, y - use directly", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ x: 100, y: 200 });

        assert.deepEqual(coords, { x: 100, y: 200 });
    });

    QUnit.test("Check coords. argument, value - translate", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ argument: 50, value: 110 });

        assert.deepEqual(coords, { x: 50, y: 90 });
    });

    QUnit.test("Check coords. argument, value of named axis - translate using correct axes", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ argument: 50, value: 210, axis: "a2" });

        assert.deepEqual(coords, { x: 50, y: 90 });
    });

    QUnit.test("Check coords. x, argument, value - translate value and use x directly", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ x: 10, argument: 50, value: 110 });

        assert.deepEqual(coords, { x: 10, y: 90 });
    });

    QUnit.test("Check coords. y, argument, value - translate arument and use y directly", function(assert) {
        const coords = this.chart()._getAnnotationCoords({ y: 10, argument: 50, value: 110 });

        assert.deepEqual(coords, { x: 50, y: 10 });
    });

    QUnit.test("Return null/undefined values if they cannot be calculated", function(assert) {
        const testCase = (options, message) => {
            const { x, y } = this.chart()._getAnnotationCoords(options);

            assert.ok(x === null || x === undefined || y === null || y === undefined, message);
        };

        testCase({}, "No coords at all");
        testCase({ x: 0, value: "wrong_value" }, "Can't translate value");
        testCase({ y: 0, argument: "wrong_argument" }, "Can't translate argument");
        testCase({ x: 0, value: 100, axis: "wrong_axis" }, "Can't value axis");
    });
});

QUnit.module("Lifecycle", environment, function() {
    QUnit.module("Chart plugin", {
        beforeEach() {
            this.onDrawn = sinon.spy();
        },
        chart(annotations) {
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
                annotations
            }).dxChart("instance");
        },
        getAnnotationsGroup() {
            return this.renderer.g.getCalls().map(g => g.returnValue).filter(g => {
                const attr = g.stub("attr").getCall(0);
                return attr && attr.args[0].class === "dxc-annotations";
            })[0];
        }
    });

    QUnit.test("Do not create annotation if no options or items passed", function(assert) {
        const test = (annotationOptions, message) => {
            this.chart(annotationOptions);

            assert.equal(this.createAnnotationStub.callCount, 0, message);
        };

        test(undefined, "No options");
        test({ some: "options" }, "No items");
    });

    QUnit.test("Create annotation with given options", function(assert) {
        const annotationOptions = {
            some: "options",
            items: [
                { x: 100, y: 200, },
                { value: 1, argument: 2 }
            ]
        };
        this.chart(annotationOptions);

        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.strictEqual(this.createAnnotationStub.getCall(0).args[0].some, annotationOptions.some);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[0].items, annotationOptions.items);
    });

    QUnit.test("Pass widget instance and group to annotations.draw method", function(assert) {
        const annotationOptions = {
            some: "options",
            items: [
                { x: 100, y: 200, },
                { value: 1, argument: 2 }
            ]
        };
        const chart = this.chart(annotationOptions);

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [chart, this.getAnnotationsGroup()]);
    });

    QUnit.test("Draw annotations before onDrawn event", function(assert) {
        const annotationOptions = {
            some: "options",
            items: [
                { x: 100, y: 200, },
                { value: 1, argument: 2 }
            ]
        };
        this.chart(annotationOptions);

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.ok(annotation.draw.lastCall.calledBefore(this.onDrawn.lastCall));
    });

    QUnit.test("Change options - recreate annotations, clear group, draw new annotations", function(assert) {
        const annotationOptions = {
            some: "options",
            items: [
                { x: 100, y: 200, },
                { value: 1, argument: 2 }
            ]
        };
        const chart = this.chart(annotationOptions);
        this.createAnnotationStub.getCall(0).returnValue[0].draw.reset();
        this.createAnnotationStub.reset();

        const newAnnotationOptions = {
            some: "otherOptions",
            items: [
                { some: "newItem" }
            ]
        };
        chart.option({ annotations: newAnnotationOptions });

        // assert
        assert.equal(this.createAnnotationStub.callCount, 1);
        assert.strictEqual(this.createAnnotationStub.getCall(0).args[0].some, newAnnotationOptions.some);
        assert.deepEqual(this.createAnnotationStub.getCall(0).args[0].items, newAnnotationOptions.items);

        const annotationsGroup = this.getAnnotationsGroup();

        const annotation = this.createAnnotationStub.getCall(0).returnValue[0];
        assert.equal(annotation.draw.callCount, 1);
        assert.deepEqual(annotation.draw.getCall(0).args, [chart, annotationsGroup]);
        assert.ok(annotation.draw.lastCall.calledAfter(annotationsGroup.clear.lastCall));
    });
});
