"use strict";

var $ = require("jquery"),
    errors = require("viz/core/errors_warnings"),
    translator2DModule = require("viz/translators/translator2d"),
    tickManagerModule = require("viz/axes/base_tick_manager"),
    dxErrors = errors.ERROR_MESSAGES,
    Axis = require("viz/axes/base_axis").Axis,
    vizMocks = require("../../helpers/vizMocks.js"),
    StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {}),
    StubTickManager = vizMocks.stubClass(tickManagerModule.TickManager, {});

var environment = {
    beforeEach: function() {
        var that = this;
        this.renderer = new vizMocks.Renderer();

        this.tickManager = new StubTickManager();
        this.tickManager.stub("getOptions").returns({});

        tickManagerModule.TickManager = sinon.spy(function() {
            return that.tickManager;
        });

        this.translator = new StubTranslator();
        this.translator.stub("getBusinessRange").returns({ addRange: sinon.stub() });

        this.translator.stub("translateSpecialCase").withArgs("canvas_position_start").returns(0);
        this.translator.stub("translateSpecialCase").withArgs("canvas_position_end").returns(100);
        this.translator.stub("translateSpecialCase").withArgs("canvas_position_left").returns(0);
        this.translator.stub("translateSpecialCase").withArgs("canvas_position_right").returns(100);
        this.translator.stub("translateSpecialCase").withArgs("canvas_position_top").returns(0);
        this.translator.stub("translateSpecialCase").withArgs("canvas_position_bottom").returns(100);
        this.translator.stub("translateSpecialCase").withArgs("canvas_position_center").returns(50);

        this.additionalTranslator = new StubTranslator();
        this.additionalTranslator.stub("getBusinessRange").returns({ addRange: sinon.stub() });

        this.additionalTranslator.stub("translateSpecialCase").withArgs("canvas_position_start").returns(0);
        this.additionalTranslator.stub("translateSpecialCase").withArgs("canvas_position_end").returns(100);
        this.additionalTranslator.stub("translateSpecialCase").withArgs("canvas_position_bottom").returns(10);
        this.additionalTranslator.stub("translateSpecialCase").withArgs("canvas_position_left").returns(20);
        this.additionalTranslator.stub("translateSpecialCase").withArgs("canvas_position_top").returns(30);
        this.additionalTranslator.stub("translateSpecialCase").withArgs("canvas_position_right").returns(40);
        this.additionalTranslator.stub("translateSpecialCase").withArgs("canvas_position_center").returns(50);
    },
    createAxis: function(options) {
        this.axis = new Axis($.extend(true, {
            renderer: this.renderer,
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g(),
            axisType: "xyAxes",
            drawingType: "linear"
        }, options));
    },
    afterEach: function() {
        this.axis.dispose();
        this.axis = null;
        tickManagerModule.TickManager.reset();
        this.renderer.dispose();
        this.renderer = null;
        this.translator = null;
        this.additionalTranslator = null;

    },
    updateOptions: function(options) {
        this.axis.updateOptions($.extend(true, {
            label: {
                visible: true, indentFromAxis: 10, overlappingBehavior: { mode: "ignore" }
            },
            isHorizontal: options.isHorizontal !== undefined ? options.isHorizontal : true,
            grid: {},
            minorGrid: {},
            tick: {},
            minorTick: {},
            title: {},
            marker: {}
        }, options));
    }
};

QUnit.module("XY linear axis. Get range data", environment);

QUnit.test("Stick. Value margins enabled = true", function(assert) {
    //arrange
    this.createAxis();
    this.updateOptions({ valueMarginsEnabled: true });

    this.translator.stub("getBusinessRange").returns({ min: 0, max: 100, addRange: sinon.stub() });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    var rangeData = this.axis.getRangeData();

    //assert
    assert.equal(rangeData.stick, false, "Stick");
});

QUnit.test("Stick. Value margins enabled = false", function(assert) {
    //arrange
    this.createAxis();
    this.updateOptions({ valueMarginsEnabled: false });

    this.translator.stub("getBusinessRange").returns({ min: 0, max: 100, addRange: sinon.stub() });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    var rangeData = this.axis.getRangeData();

    //assert
    assert.equal(rangeData.stick, true, "Stick");
});

QUnit.module("XY linear axis. Get bounding rect", environment);

QUnit.test("Horizontal placeholder. Bottom position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200 });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 }); //elements group
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 12, width: 120, height: 4 }); //line group

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 12, width: 120, height: 200 }, "Bounding rect");
});

QUnit.test("Horizontal placeholder. Bottom position. Without elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200 });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true }); //title group

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 0, y: 10, width: 0, height: 200, isEmpty: true }, "Bounding rect");
});

QUnit.test("Horizontal placeholder. Top position. Without elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200, position: "top" });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true }); //title group

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 0, y: 30, width: 0, height: 200, isEmpty: true }, "Bounding rect");
});

QUnit.test("Horizontal placeholder. Top position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200, position: "top" });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 30, width: 120, height: 4 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 20, width: 120, height: 200 }, "Bounding rect");
});

QUnit.test("Horizontal axis. Top position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ position: "top" });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 30, width: 120, height: 4 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 20, width: 120, height: 14 }, "Bounding rect");
});

QUnit.test("Horizontal axis. Bottom position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ position: "bottom" });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 30, width: 120, height: 4 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 30, width: 120, height: 30 }, "Bounding rect");
});

QUnit.test("Horizontal axis. Bottom position. Without line", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({});
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 10, width: 120, height: 50 }, "Bounding rect");
});

QUnit.test("Vertical placeholder. Left position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200, isHorizontal: false });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 68, y: 30, width: 4, height: 40 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 20, width: 200, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical placeholder. Left position. Without elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200, isHorizontal: false });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 20, y: 0, width: 200, height: 0, isEmpty: true }, "Bounding rect");
});

QUnit.test("Vertical placeholder. Right position. Without elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200, position: "right", isHorizontal: false });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 40, y: 0, width: 200, height: 0, isEmpty: true }, "Bounding rect");
});

QUnit.test("Vertical placeholder. Left position. Without line", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ isHorizontal: false });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 20, width: 10, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical placeholder. Right position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ placeholderSize: 200, position: "right", isHorizontal: false });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 57, y: 20, width: 4, height: 40 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 57, y: 20, width: 200, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical placeholder. Right position. Without line", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({ position: "right", isHorizontal: false });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 40, y: 20, width: 90, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical axis with title. Left position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "left",
        title: {
            text: "some text"
        },
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 50, y: 20, width: 20, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 20, y: 2, width: 50, height: 4 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 50, y: 12, width: 20, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 50, y: 20, width: 20, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical axis with title. Right position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "right",
        title: {
            text: "some text"
        },
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 50, y: 20, width: 20, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 1, y: 2, width: 3, height: 4 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 12, width: 20, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 1, y: 20, width: 119, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical axis with title. Right position. Without axis elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "right",
        title: {
            text: "some text"
        },
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 1, y: 2, width: 3, height: 4 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 12, width: 20, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 1, y: 0, width: 119, height: 0, isEmpty: true }, "Bounding rect");
});

QUnit.test("Vertical axis with title. Left position. Without axis elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "left",
        title: {
            text: "some text"
        },
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 120, y: 0, width: 3, height: 4 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 80, y: 12, width: 30, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 80, y: 0, width: 43, height: 0, isEmpty: true }, "Bounding rect");
});

QUnit.test("Horizontal axis with title. Top position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "top",
        title: {
            text: "some text"
        }
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 50, y: 20, width: 20, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 1, y: 20, width: 3, height: 40 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 12, width: 20, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 50, y: 12, width: 20, height: 48 }, "Bounding rect");
});

QUnit.test("Horizontal axis with title. Bottom position", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "bottom",
        title: {
            text: "some text"
        }
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 50, y: 20, width: 20, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 1, y: 20, width: 3, height: 40 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 12, width: 20, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 50, y: 20, width: 20, height: 42 }, "Bounding rect");
});

QUnit.test("Horizontal axis with title. Bottom position. Without axis elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "bottom",
        title: {
            text: "some text"
        }
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 1, y: 20, width: 3, height: 40 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 12, width: 20, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 0, y: 20, width: 0, height: 42, isEmpty: true }, "Bounding rect");
});

QUnit.test("Horizontal axis with title. Top position. Without axis elements", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "top",
        title: {
            text: "some text"
        }
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, width: 0, height: 0, isEmpty: true });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 1, y: 20, width: 3, height: 40 });
    renderer.g.getCall(10).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 12, width: 20, height: 50 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 0, y: 12, width: 0, height: 48, isEmpty: true }, "Bounding rect");
});

QUnit.test("Horizontal axis. Bottom position. With cross hair", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        placeholderSize: 200,
        crosshairEnabled: true,
        position: "bottom"
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 12, width: 120, height: 4 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 12, width: 120, height: 200 }, "Bounding rect");
});

QUnit.test("Horizontal axis. Top position. With cross hair", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        placeholderSize: 200,
        crosshairEnabled: true,
        position: "top"
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 12, width: 120, height: 4 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 16, width: 120, height: 200 }, "Bounding rect");
});

QUnit.test("Vertical axis. Left position. With cross hair", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        placeholderSize: 200,
        crosshairEnabled: true,
        position: "left",
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 68, y: 20, width: 4, height: 40 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 2, y: 20, width: 200, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical axis. Right position. With cross hair", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        placeholderSize: 200,
        crosshairEnabled: true,
        position: "right",
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 68, y: 20, width: 4, height: 40 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 68, y: 20, width: 200, height: 40 }, "Bounding rect");
});

QUnit.test("Horizontal axis. Bottom position. With cross hair. Without placeholder", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        crosshairEnabled: true,
        position: "bottom"
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 12, width: 120, height: 4 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 12, width: 120, height: 52 }, "Bounding rect");
});

QUnit.test("Horizontal axis. Top position. With cross hair. Without placeholder", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        crosshairEnabled: true,
        position: "top"
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 12, width: 120, height: 4 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 10, y: 16, width: 120, height: 0 }, "Bounding rect");
});

QUnit.test("Vertical axis. Left position. With cross hair. Without placeholder", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        crosshairEnabled: true,
        position: "left",
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 68, y: 20, width: 4, height: 40 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 2, y: 20, width: 70, height: 40 }, "Bounding rect");
});

QUnit.test("Vertical axis. Right position. With cross hair. Without placeholder", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        crosshairEnabled: true,
        position: "right",
        isHorizontal: false
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 20, width: 120, height: 40 });
    renderer.g.getCall(9).returnValue.getBBox = sinon.stub().returns({ x: 68, y: 20, width: 4, height: 40 });

    //act
    this.axis.draw();
    var boundingRect = this.axis.getBoundingRect();

    //assert
    assert.deepEqual(boundingRect, { x: 68, y: 20, width: 70, height: 40 }, "Bounding rect");
});

QUnit.module("XY linear axis. Draw axes elements", environment);

QUnit.test("Check groups appending", function(assert) {
    //arrange
    var renderer = this.renderer;

    //act
    this.createAxis();
    var axisGroup = renderer.g.getCall(5).returnValue,
        axisElementsGroup = renderer.g.getCall(8).returnValue,
        axisLineGroup = renderer.g.getCall(9).returnValue,
        titleGroup = renderer.g.getCall(10).returnValue;

    //assert
    assert.deepEqual(titleGroup.append.lastCall.args[0], axisGroup, "Title group was appended");
    assert.deepEqual(axisLineGroup.append.lastCall.args[0], axisGroup, "Axis line group was appended");
    assert.deepEqual(axisElementsGroup.append.lastCall.args[0], axisGroup, "Elements group was appended");
});

QUnit.test("Customize text with stub data", function(assert) {
    //arrange
    var customizeStub = sinon.stub();
    this.createAxis();
    this.updateOptions({
        label: {
            customizeText: customizeStub,
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("getBusinessRange").returns({ addRange: sinon.stub, stubData: true });
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.strictEqual(customizeStub.called, false, "customizeText was not called");
});

QUnit.test("Customize text with invisible labels", function(assert) {
    //arrange
    var customizeStub = sinon.stub();
    this.createAxis();
    this.updateOptions({
        label: { customizeText: customizeStub }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("getBusinessRange").returns({ addRange: sinon.stub, stubData: true });
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.strictEqual(customizeStub.called, false, "customizeText was not called");
});

QUnit.test("Check groups clearing after second drawing", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({});
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.g.getCall(7).returnValue.clear.called, true, "clear");
    assert.strictEqual(renderer.g.getCall(8).returnValue.clear.called, true, "clear");
    assert.strictEqual(renderer.g.getCall(9).returnValue.clear.called, true, "clear");
    assert.strictEqual(renderer.g.getCall(10).returnValue.clear.called, true, "clear");
    assert.strictEqual(renderer.g.getCall(11).returnValue.clear.called, true, "clear");
    assert.strictEqual(renderer.g.getCall(12).returnValue.clear.called, true, "clear");
});

QUnit.test("Logarithm base is not valid", function(assert) {
    //arrange
    var spy = sinon.spy(),
        idError;

    this.createAxis({ incidentOccurred: spy });
    this.updateOptions({
        isHorizontal: false,
        min: 1,
        max: 100,
        type: "logarithmic",
        logarithmBaseError: true,
        logarithmBase: 10
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.ok(spy.calledOnce);

    idError = spy.firstCall.args[0];

    assert.equal(spy.firstCall.args[0], "E2104");
    assert.equal(dxErrors[idError], "Invalid logarithm base");
});

QUnit.test("Draw axis line. Horizontal", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 1, "Path call count");
    assert.deepEqual(renderer.path.lastCall.args, [[0, 10, 100, 10], "line"], "Path points");
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.lastCall.returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
});

QUnit.test("Draw axis line. Vertical", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        visible: true,
        isHorizontal: false,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });
    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 1, "Path call count");
    assert.deepEqual(renderer.path.lastCall.args, [[20, 0, 20, 100], "line"], "Path points");
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.lastCall.returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Draw boundary ticks", function(assert) {
    this.createAxis({ isHorizontal: true });
    this.updateOptions({
        visible: false,
        minorTick: {
            visible: false
        },
        showCustomBoundaryTicks: true,
        label: {
            visible: false
        },
        marker: {
            visible: false
        },
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([]);
    this.tickManager.stub("getBoundaryTicks").returns([0, 3]);

    this.translator.stub("translate").withArgs(0).returns(0);
    this.translator.stub("translate").withArgs(3).returns(3);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    this.axis.draw();

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).args, [[0, 10 - 10, 0, 10 + 10], "line"]);
    assert.deepEqual(path.getCall(1).args, [[3, 10 - 10, 3, 10 + 10], "line"]);
    assert.deepEqual(path.getCall(0).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(1).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
});

QUnit.test("Draw boundary ticks when they are categories", function(assert) {
    var categories = ["a", "b"];
    this.createAxis({ isHorizontal: true });
    this.updateOptions({
        visible: false,
        minorTick: {
            visible: false
        },
        showCustomBoundaryTicks: true,
        categories: categories,
        label: {
            visible: false
        },
        marker: {
            visible: false
        },
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns(categories);
    this.tickManager.stub("getBoundaryTicks").returns([]);
    this.translator.stub("getVisibleCategories").returns(categories);
    this.translator.stub("translate").withArgs("a").returns(0);
    this.translator.stub("translate").withArgs("b").returns(3);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[0, 10 - 10, 0, 10 + 10], "line"]);
    assert.deepEqual(path.getCall(1).args, [[0, 10 - 10, 0, 10 + 10], "line"]);
    assert.deepEqual(path.getCall(2).args, [[3, 10 - 10, 3, 10 + 10], "line"]);
});

QUnit.test("Draw boundary ticks when they are categories with 0 length", function(assert) {
    var categories = [];
    this.createAxis({ isHorizontal: true });
    this.updateOptions({
        visible: false,
        minorTick: {
            visible: false
        },
        showCustomBoundaryTicks: true,
        categories: categories,
        label: {
            visible: false
        },
        marker: {
            visible: false
        },
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns(categories);
    this.translator.stub("getVisibleCategories").returns(categories);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    assert.equal(this.renderer.stub("path").callCount, 0, "no boundary ticks");
});

QUnit.test("Draw boundary ticks when they are categories with discreteAxisDivisionMode = crossLabels", function(assert) {
    var categories = ["a", "b"];
    this.createAxis({ isHorizontal: true });
    this.updateOptions({
        visible: false,
        minorTick: {
            visible: false
        },
        showCustomBoundaryTicks: true,
        categories: categories,
        discreteAxisDivisionMode: "crossLabels",
        label: {
            visible: false
        },
        marker: {
            visible: false
        },
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns(categories);
    this.tickManager.stub("getBoundaryTicks").returns([]);
    this.translator.stub("getVisibleCategories").returns(categories);
    this.translator.stub("translate").withArgs("a").returns(0);
    this.translator.stub("translate").withArgs("b").returns(3);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    this.axis.draw();

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).args, [[0, 10 - 10, 0, 10 + 10], "line"]);
    assert.deepEqual(path.getCall(1).args, [[3, 10 - 10, 3, 10 + 10], "line"]);
});

QUnit.test("Draw ticks. Horizontal. Orientation = middle", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[25, 0, 25, 20], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[40, 0, 40, 20], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Draw ticks. Horizontal. Orientation = top", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        tickOrientation: "top",
        tick: {
            visible: true,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[25, -10, 25, 10], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).args, [[40, -10, 40, 10], "line"], "Path points");
});

QUnit.test("Draw ticks. Horizontal. Orientation = bottom", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        tickOrientation: "bottom",
        tick: {
            visible: true,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[25, 10, 25, 30], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).args, [[40, 10, 40, 30], "line"], "Path points");
});

//DEPRECATED IN 15_2
QUnit.test("Draw ticks. With withoutPath", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    sinon.stub(this.axis, "getMajorTicks").returns([{ value: 1, withoutPath: true }, { value: 2 }]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[25, 0, 25, 20], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 0, "stroke": "none", "stroke-opacity": 0 }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[40, 0, 40, 20], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Draw ticks. Horizontal. Continuous with decimated ticks", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([1, 3]);

    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(35);
    this.translator.stub("translate").withArgs(3).returns(45);
    this.translator.stub("translate").withArgs(4).returns(55);

    this.axis.setTranslator(this.translator, this.additionalTranslator);
    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");
    assert.deepEqual(renderer.path.getCall(0).args, [[25, 0, 25, 20], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).args, [[45, 0, 45, 20], "line"], "Path points");
});

QUnit.test("Draw ticks. Horizontal. Categories. Cross labels", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        discreteAxisDivisionMode: "crossLabels",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        }
    });
    this.tickManager.stub("getTicks").returns(["a", "b"]);
    this.translator.stub("translate").withArgs("a", 0).returns(25);
    this.translator.stub("translate").withArgs("b", 0).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[25, 6, 25, 14], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[40, 6, 40, 14], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Draw ticks. Horizontal. Categories. Between labels", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        discreteAxisDivisionMode: "betweenLabels",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        }
    });
    this.tickManager.stub("getTicks").returns(["a", "b"]);
    this.translator.stub("translate").withArgs("a", 1).returns(25);
    this.translator.stub("translate").withArgs("b", 1).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[25, 6, 25, 14], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[40, 6, 40, 14], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Draw ticks. Vertical. Orientation = center", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[10, 25, 30, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[10, 40, 30, 40], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
});

QUnit.test("Draw ticks. Vertical. Orientation = left", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        tickOrientation: "left",
        tick: {
            visible: true,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 25, 20, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).args, [[0, 40, 20, 40], "line"], "Path points");
});

QUnit.test("Draw ticks. Vertical. Orientation = right", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        tickOrientation: "right",
        tick: {
            visible: true,
            length: 20
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[20, 25, 40, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).args, [[20, 40, 40, 40], "line"], "Path points");
});

QUnit.test("Draw ticks. Vertical. Categories. Cross labels", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        discreteAxisDivisionMode: "crossLabels",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        },
        isHorizontal: false
    });
    this.tickManager.stub("getTicks").returns(["a", "b"]);
    this.translator.stub("translate").withArgs("a", 0).returns(25);
    this.translator.stub("translate").withArgs("b", 0).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[16, 25, 24, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[16, 40, 24, 40], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
});

QUnit.test("Draw ticks. Vertical. Categories. Between labels", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        type: "discrete",
        discreteAxisDivisionMode: "betweenLabels",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        }
    });
    this.tickManager.stub("getTicks").returns(["a", "b"]);
    this.translator.stub("translate").withArgs("a", 1).returns(25);
    this.translator.stub("translate").withArgs("b", 1).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[16, 25, 24, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[16, 40, 24, 40], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
});

QUnit.test("Draw minor ticks. Horizontal", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 20
        }
    });
    this.tickManager.stub("getMinorTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[25, 0, 25, 20], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[40, 0, 40, 20], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Draw minor ticks. Vertical", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        }
    });
    this.tickManager.stub("getMinorTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[16, 25, 24, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[16, 40, 24, 40], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 5, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
});

QUnit.module("XY linear axis. Draw grids", environment);

QUnit.test("Check grid group appending", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids();

    //assert
    assert.strictEqual(renderer.g.getCall(7).returnValue.append.called, true, "Grid group was appended");
});

QUnit.test("Horizontal", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true,
            color: "#123456",
            width: 4,
            opacity: 0.3
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids();

    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[25, 0, 25, 100], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[40, 0, 40, 100], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Categories. DiscreteAxisDivisionMode - betweenLabels", function(assert) {
    var that = this,
        renderer = this.renderer,
        categories = ["a", "b", "c", "d", "e", "f", "g"];

    this.createAxis();
    this.updateOptions({
        categories: categories,
        grid: {
            visible: true
        }
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: categories
    });

    this.tickManager.stub("getTicks").returns(categories);
    $.each(categories, function(i, e) {
        that.translator.stub("translate").withArgs(e).returns(0);
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids();

    //assert
    assert.equal(renderer.path.callCount, 6, "Path call count");
});

QUnit.test("Vertical", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        grid: {
            visible: true,
            color: "#123456",
            width: 4,
            opacity: 0.3
        }
    });
    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids();

    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[0, 25, 100, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[0, 40, 100, 40], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
});

QUnit.test("Vertical. Categories. DiscreteAxisDivisionMode - crossLabels", function(assert) {
    var that = this,
        renderer = this.renderer,
        categories = ["a", "b", "c", "d", "e", "f", "g"];

    this.createAxis({ isHorizontal: false });
    this.updateOptions({
        discreteAxisDivisionMode: "crossLabels",
        categories: categories,
        grid: {
            visible: true
        }
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: categories
    });

    this.tickManager.stub("getTicks").returns(categories);
    $.each(categories, function(i, e) {
        that.translator.stub("translate").withArgs(e).returns(0);
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids();

    //assert
    assert.equal(renderer.path.callCount, 7, "Path call count");
});

QUnit.test("Horizontal axis. Invisible borders", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: false, left: true, right: true });

    //assert
    assert.equal(renderer.path.callCount, 3, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [0, 0, 0, 100], "points of first grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [50, 0, 50, 100], "points of second grid");
    assert.deepEqual(renderer.path.getCall(2).args[0], [100, 0, 100, 100], "points of third grid");
});

QUnit.test("Horizontal axis. Left and right borders are visible", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, left: true, right: true });

    //assert
    assert.equal(renderer.path.callCount, 1, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [50, 0, 50, 100], "points of second grid");
});

QUnit.test("Horizontal axis. Left and right borders are visible. Difference between grid and border is more than 3 px", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(4);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(96);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, left: true, right: true });

    //assert
    assert.equal(renderer.path.callCount, 3, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [4, 0, 4, 100], "points of first grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [50, 0, 50, 100], "points of second grid");
    assert.deepEqual(renderer.path.getCall(2).args[0], [96, 0, 96, 100], "points of third grid");
});

QUnit.test("Horizontal axis. Only left border is visible", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, left: true, right: false });

    //assert
    assert.equal(renderer.path.callCount, 2, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [50, 0, 50, 100], "points of second grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [100, 0, 100, 100], "points of third grid");
});

QUnit.test("Horizontal axis. Only right border is visible", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, left: false, right: true });

    //assert
    assert.equal(renderer.path.callCount, 2, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [0, 0, 0, 100], "points of first grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [50, 0, 50, 100], "points of second grid");
});

QUnit.test("Horizontal. Categories. DiscreteAxisDivisionMode - betweenLabels. Visible borders ", function(assert) {
    var that = this,
        renderer = this.renderer,
        categories = ["a", "b", "c", "d", "e", "f", "g"];

    this.createAxis({ isHorizontal: true });
    this.updateOptions({
        discreteAxisDivisionMode: "betweenLabels",
        categories: categories,
        grid: {
            visible: true
        }
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: categories
    });

    this.tickManager.stub("getTicks").returns(categories);
    $.each(categories, function(i, e) {
        that.translator.stub("translate").withArgs(e).returns(5 * (i + 1));
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, left: true, right: true });

    //assert
    assert.equal(renderer.path.callCount, 6, "Path call count");
});

QUnit.test("Horizontal. Categories. DiscreteAxisDivisionMode - crossLabels. Visible borders ", function(assert) {
    var that = this,
        renderer = this.renderer,
        categories = ["a", "b", "c", "d", "e", "f", "g"];

    this.createAxis({ isHorizontal: true });
    this.updateOptions({
        discreteAxisDivisionMode: "crossLabels",
        categories: categories,
        grid: {
            visible: true
        }
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: categories
    });

    this.tickManager.stub("getTicks").returns(categories);
    $.each(categories, function(i, e) {
        that.translator.stub("translate").withArgs(e).returns(5 * (i + 1));
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, left: true, right: true });

    //assert
    assert.equal(renderer.path.callCount, 7, "Path call count");
});

QUnit.test("Horizontal. Categories. Visible borders. Custom grid position", function(assert) {
    var that = this,
        renderer = this.renderer,
        points = [0, 10, 20, 30, 40, 97],
        categories = ["a", "b", "c", "d", "e", "f", "g"];

    this.createAxis({ isHorizontal: true });
    this.updateOptions({
        categories: categories,
        grid: {
            visible: true
        }
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: categories
    });

    this.tickManager.stub("getTicks").returns(categories);
    $.each(categories, function(i, e) {
        that.translator.stub("translate").withArgs(e).returns(points[i]);
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, left: true, right: true });

    //assert
    assert.equal(renderer.path.callCount, 4, "Path call count");
});

QUnit.test("Vertical axis. Invisible borders", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        grid: {
            visible: true
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: false, top: true, bottom: true });

    //assert
    assert.equal(renderer.path.callCount, 3, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [0, 0, 100, 0], "points of first grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [0, 50, 100, 50], "points of second grid");
    assert.deepEqual(renderer.path.getCall(2).args[0], [0, 100, 100, 100], "points of third grid");
});

QUnit.test("Vertical axis. Top and bottom borders are visible", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        },
        isHorizontal: false
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, top: true, bottom: true });

    //assert
    assert.equal(renderer.path.callCount, 1, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [0, 50, 100, 50], "points of second grid");
});

QUnit.test("Vertical axis. Top and bottom borders are visible. Difference between grid and border is more than 3 px", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        },
        isHorizontal: false
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(4);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(96);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, top: true, bottom: true });

    //assert
    assert.equal(renderer.path.callCount, 3, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [0, 4, 100, 4], "points of first grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [0, 50, 100, 50], "points of second grid");
    assert.deepEqual(renderer.path.getCall(2).args[0], [0, 96, 100, 96], "points of third grid");
});

QUnit.test("Vertical axis. Only top border is visible", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        },
        isHorizontal: false
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, top: true, bottom: false });

    //assert
    assert.equal(renderer.path.callCount, 2, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [0, 50, 100, 50], "points of second grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [0, 100, 100, 100], "points of third grid");
});

QUnit.test("Vertical axis. Only bottom border is visible", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        grid: {
            visible: true
        },
        isHorizontal: false
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3]);

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids({ visible: true, top: false, bottom: true });

    //assert
    assert.equal(renderer.path.callCount, 2, "number of rendered lines");

    assert.deepEqual(renderer.path.getCall(0).args[0], [0, 0, 100, 0], "points of first grid");
    assert.deepEqual(renderer.path.getCall(1).args[0], [0, 50, 100, 50], "points of second grid");
});

QUnit.test("Minor grids. Horizontal", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        minorGrid: {
            visible: true,
            color: "#123456",
            width: 4,
            opacity: 0.3
        }
    });
    this.tickManager.stub("getMinorTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids();

    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[25, 0, 25, 100], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[40, 0, 40, 100], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Minor grids. Vertical", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        minorGrid: {
            visible: true,
            color: "#123456",
            width: 4,
            opacity: 0.3
        }
    });
    this.tickManager.stub("getMinorTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();
    this.axis.drawGrids();

    assert.equal(renderer.path.callCount, 2, "Path call count");

    assert.deepEqual(renderer.path.getCall(0).args, [[0, 25, 100, 25], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");

    assert.deepEqual(renderer.path.getCall(1).args, [[0, 40, 100, 40], "line"], "Path points");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
});

QUnit.module("XY linear axis. Draw labels", environment);

QUnit.test("Custom options", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        label: {
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma"
            }
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 10, 25], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: -19, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.lastCall.args[0], {
        "fill": "#123456",
        "font-family": "Tahoma",
        "font-size": 10,
        "font-weight": 200
    }, "Text css");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 10, 40], "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: -19, y: 73 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.css.lastCall.args[0], {
        "fill": "#123456",
        "font-family": "Tahoma",
        "font-size": 10,
        "font-weight": 200
    }, "Text css");
});

QUnit.test("With hints", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        label: {
            visible: true,
            indentFromAxis: 10,
            customizeHint: function() {
                return this.valueText;
            },
            overlappingBehavior: {},
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma"
            }
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);

    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.setTitle.lastCall.args[0], "1", "Text hint");
    assert.deepEqual(renderer.text.getCall(1).returnValue.setTitle.lastCall.args[0], "2", "Text hint");
});

QUnit.test("With stubData", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        label: {
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma"
            }
        }
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        stubData: true
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("text").called, false, "text");
});

QUnit.test("Without text. Empty text", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        label: {
            visible: true,
            overlappingBehavior: {},
            indentFromAxis: 10,
            customizeText: function() {
                if(this.valueText === "1") {
                    return "";
                } else {
                    return "     ";
                }
            },
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma"
            }
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);

    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("text").called, false, "text");
});

QUnit.test("Without text. Null text and undefined", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        label: {
            visible: true,
            overlappingBehavior: {},
            indentFromAxis: 10,
            customizeText: function() {
                if(this.valueText === "1") {
                    return null;
                } else {
                    return undefined;
                }
            },
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma"
            }
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);

    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("text").called, false, "text");
});

QUnit.test("Text = 0", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        label: {
            overlappingBehavior: {},
            visible: true,
            indentFromAxis: 10,
            customizeText: function() {
                return 0;
            },
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma"
            }
        }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);

    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args[0], 0, "Text args");
    assert.deepEqual(renderer.text.getCall(1).args[0], 0, "Text args");
});

QUnit.test("With bounded ticks", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        label: {
            visible: true,
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma"
            }
        }
    });

    sinon.stub(this.axis, "getMajorTicks").returns([{ value: 1, withoutLabel: true }, { value: 2 }]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 1);
    assert.deepEqual(renderer.text.getCall(0).args[0], "2", "Text args");
});

QUnit.test("Horizontal axis. Position - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);

    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 25, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 40, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text args");
});

QUnit.test("Horizontal axis. Position - bottom. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 25, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 40, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text args");
});

QUnit.test("Horizontal axis. Position - top", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 25, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 40, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text args");
});

QUnit.test("Horizontal axis. Position - top. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 25, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 40, 20], "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text args");
});

QUnit.test("Vertical axis. Position - left", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 10, 25], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: -19, y: 43 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 10, 40], "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: -19, y: 73 }, "Text args");
});

QUnit.test("Vertical axis. Position - left. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 10, 25], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: -29, y: 43 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 10, 40], "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: -29, y: 73 }, "Text args");
});

QUnit.test("Vertical axis. Position - right", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 50, 25], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 1, y: 43 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 50, 40], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 1, y: 43 }, "Text args");
});

QUnit.test("Vertical axis. Position - right. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1", 50, 25], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 11, y: 43 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["2", 50, 40], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 11, y: 43 }, "Text args");
});

QUnit.test("T248202. One bbox", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2, 3, 4, 5, 6]);
    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(3).returns(30);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(5).returns(50);
    this.translator.stub("translate").withArgs(6).returns(60);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 6, "Text call count");
    assert.equal(renderer.g.getCall(8).returnValue.getBBox.callCount, 2);//adjust and bounding rect
});

QUnit.test("Horizontal axis. Position - bottom. Labels alignment - left", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - bottom. Labels alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - bottom. Labels alignment - right", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 38 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - bottom. Labels alignment - left. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - bottom. Labels alignment - center. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - bottom. Labels alignment - right. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "bottom",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 48 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - top. Labels alignment - left", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - top. Labels alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - top. Labels alignment - right", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 28 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - top. Labels alignment - left. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - top. Labels alignment - center. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text attr");
});

QUnit.test("Horizontal axis. Position - top. Labels alignment - right. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        position: "top",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { top: 10, bottom: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: undefined, y: 18 }, "Text attr");
});

QUnit.test("Vertical axis. Position - left. Labels alignment - left", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: {}
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: -19, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: -19, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - left. Labels alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: { visible: true, indentFromAxis: 10, alignment: "center", overlappingBehavior: {} }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 1, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 1, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - left. Labels alignment - right", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: { visible: true, indentFromAxis: 10, alignment: "right", overlappingBehavior: {} }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 21, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 21, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - left. Labels alignment - left. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: { visible: true, indentFromAxis: 10, alignment: "left", overlappingBehavior: {} }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: -29, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: -29, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - left. Labels alignment - center. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: { visible: true, indentFromAxis: 10, alignment: "center", overlappingBehavior: {} }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: -9, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: -9, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - left. Labels alignment - right. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: { visible: true, indentFromAxis: 10, alignment: "right", overlappingBehavior: {} }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 11, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 11, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - right. Labels alignment - left", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: { visible: true, indentFromAxis: 10, alignment: "left", overlappingBehavior: {} }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 1, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 1, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - right. Labels alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: { visible: true, indentFromAxis: 10, alignment: "center", overlappingBehavior: {}, userAlignment: true }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 21, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 21, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - right. Labels alignment - right", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: { visible: true, indentFromAxis: 10, alignment: "right", overlappingBehavior: {}, userAlignment: true }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 41, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 41, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - right. Labels alignment - left. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: { visible: true, indentFromAxis: 10, alignment: "left", overlappingBehavior: {}, userAlignment: true }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 11, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 11, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - right. Labels alignment - center. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: { visible: true, indentFromAxis: 10, alignment: "center", overlappingBehavior: {}, userAlignment: true }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 31, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 31, y: 73 }, "Text attr");
});

QUnit.test("Vertical axis. Position - right. Labels alignment - right. With padding", function(assert) {
    //arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: { visible: true, indentFromAxis: 10, alignment: "right", overlappingBehavior: {}, userAlignment: true }
    });

    this.tickManager.stub("getTicks").returns([1, 2]);
    this.translator.stub("translate").withArgs(1).returns(25);
    this.translator.stub("translate").withArgs(2).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.padding = { left: 10, right: 10 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 51, y: 43 }, "Text attr");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 51, y: 73 }, "Text attr");
});

QUnit.module("XY linear axis. Draw title", environment);

QUnit.test("Horizontal. Position - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "bottom",
        title: {
            margin: 0,
            text: "Title text",
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 1, "Text call count");

    assert.deepEqual(renderer.text.lastCall.args, ["Title text", 0, 0], "Text args");
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: 50, y: 10 }, "Text attrs");
    assert.deepEqual(renderer.text.lastCall.returnValue.css.lastCall.args[0], {
        "fill": "#123456",
        "font-weight": 200,
        "font-size": 10,
        "font-family": "Tahoma"
    }, "Text css");
});

QUnit.test("Horizontal. Position - top", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "top",
        title: {
            margin: 0,
            text: "Title text",
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 1, "Text call count");

    assert.deepEqual(renderer.text.lastCall.args, ["Title text", 0, 0], "Text args");
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: 50, y: -10 }, "Text attrs");
    assert.deepEqual(renderer.text.lastCall.returnValue.css.lastCall.args[0], {
        "fill": "#123456",
        "font-weight": 200,
        "font-size": 10,
        "font-family": "Tahoma"
    }, "Text css");
});

QUnit.test("Vertical. Position - left", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "left",
        title: {
            margin: 0,
            text: "Title text",
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        },
        isHorizontal: false
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 1, "Text call count");

    assert.deepEqual(renderer.text.lastCall.args, ["Title text", 0, 0], "Text args");
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: -11, y: 50, rotate: 270 }, "Text attrs");
    assert.deepEqual(renderer.text.lastCall.returnValue.css.lastCall.args[0], {
        "fill": "#123456",
        "font-weight": 200,
        "font-size": 10,
        "font-family": "Tahoma"
    }, "Text css");
});

QUnit.test("Vertical. Position - right", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "right",
        isHorizontal: false,
        title: {
            margin: 0,
            text: "Title text",
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 1, "Text call count");

    assert.deepEqual(renderer.text.lastCall.args, ["Title text", 0, 0], "Text args");
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: 33, y: 50, rotate: 90 }, "Text attrs");
    assert.deepEqual(renderer.text.lastCall.returnValue.css.lastCall.args[0], {
        "fill": "#123456",
        "font-weight": 200,
        "font-size": 10,
        "font-family": "Tahoma"
    }, "Text css");
});

QUnit.test("Text is not specified", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        title: {
            margin: 0,
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("text").called, false, "Text was not called");
});

QUnit.test("Horizontal. Position - bottom. Elements group is empty", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "right",
        title: {
            margin: 0,
            text: "Title text"
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, height: 0, width: 0, isEmpty: true });
    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: 50, y: 8 }, "Text attrs");
});

QUnit.test("Horizontal. Position - top. Elements group is empty", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        position: "top",
        title: {
            margin: 0,
            text: "Title text"
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, height: 0, width: 0, isEmpty: true });
    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: 50, y: 18 }, "Text attrs");
});

QUnit.test("Vertical. Position - left. Elements group is empty", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        title: {
            margin: 0,
            text: "Title text"
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, height: 0, width: 0, isEmpty: true });
    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: 8, y: 50, rotate: 270 }, "Text attrs");
});

QUnit.test("Vertical. Position - right. Elements group is empty", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        title: {
            margin: 0,
            text: "Title text"
        }
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 0, height: 0, width: 0, isEmpty: true });
    //act
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.lastCall.returnValue.attr.lastCall.args[0], { x: 52, y: 50, rotate: 90 }, "Text attrs");
});

QUnit.module("XY linear axis. Draw strips", environment);

QUnit.test("Draw one strip. Horizontal axis", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 0,
            endValue: 20,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(15);
    this.translator.stub("translate").withArgs(20).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [15, 0, 25, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Draw one strip. Vertical axis", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 0,
            endValue: 20,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(15);
    this.translator.stub("translate").withArgs(20).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 15, 100, 25], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Draw one strip. Without start value", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            endValue: 20,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(20).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 0, 100, 40], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Draw one strip. Without end value", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 0,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(15);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 15, 100, 85], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Draw one strip. Without color", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 0,
            endValue: 20
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(15);
    this.translator.stub("translate").withArgs(20).returns(40);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("rect").called, false, "rect");
});

QUnit.test("Without labels. Horizontal axis", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 0,
            endValue: 20,
            color: "#123456"
        }, {
            startValue: 40,
            endValue: 60,
            color: "#456789"
        }, {
            startValue: 80,
            endValue: 100,
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(60).returns(40);

    this.translator.stub("translate").withArgs(80).returns(50);
    this.translator.stub("translate").withArgs(100).returns(60);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 3);

    assert.deepEqual(renderer.rect.getCall(0).args, [10, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [30, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");

    assert.deepEqual(renderer.rect.getCall(2).args, [50, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(2).returnValue.attr.getCall(0).args[0], { fill: "#789123" }, "args");
});

QUnit.test("Without labels. Horizontal axis", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 0,
            endValue: 20,
            color: "#123456"
        }, {
            startValue: 40,
            endValue: 60,
            color: "#456789"
        }, {
            startValue: 80,
            endValue: 100,
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(60).returns(40);

    this.translator.stub("translate").withArgs(80).returns(50);
    this.translator.stub("translate").withArgs(100).returns(60);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 3);

    assert.deepEqual(renderer.rect.getCall(0).args, [10, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [30, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");

    assert.deepEqual(renderer.rect.getCall(2).args, [50, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(2).returnValue.attr.getCall(0).args[0], { fill: "#789123" }, "args");
});

QUnit.test("Without labels. Horizontal axis. Some strips are out of visible range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: -10,
            endValue: 0,
            color: "#123456"
        }, {
            startValue: 40,
            endValue: 60,
            color: "#456789"
        }, {
            startValue: 100,
            endValue: 110,
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(-10).returns(null);
    this.translator.stub("translate").withArgs(0).returns(0);

    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(60).returns(40);

    this.translator.stub("translate").withArgs(100).returns(60);
    this.translator.stub("translate").withArgs(110).returns(null);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 2);

    assert.deepEqual(renderer.rect.getCall(0).args, [30, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [60, 0, 40, 100], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#789123" }, "args");
});

QUnit.test("Without labels. Horizontal axis. Start value of strip is out of visible range. Date", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        argumentType: "datetime",
        incidentOccurred: sinon.stub(),
        strips: [{
            startValue: "2011/1/1",
            endValue: "2011/2/5",
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: new Date(2011, 1, 1),
        maxVisible: new Date(2011, 1, 10)
    });
    this.translator.stub("translate").withArgs(new Date(2011, 0, 1)).returns(null);
    this.translator.stub("translate").withArgs(new Date(2011, 1, 5)).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate(true);
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Without labels. Horizontal axis. End value of strip is out of visible range. Date", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        argumentType: "datetime",
        incidentOccurred: sinon.stub(),
        strips: [{
            startValue: "2011/2/5",
            endValue: "2011/3/1",
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: new Date(2011, 1, 1),
        maxVisible: new Date(2011, 1, 10)
    });
    this.translator.stub("translate").withArgs(new Date(2011, 1, 5)).returns(10);
    this.translator.stub("translate").withArgs(new Date(2011, 2, 1)).returns(null);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate(true);
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [10, 0, 90, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Without labels. Vertical axis", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 0,
            endValue: 20,
            color: "#123456"
        }, {
            startValue: 40,
            endValue: 60,
            color: "#456789"
        }, {
            startValue: 80,
            endValue: 100,
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(60).returns(40);

    this.translator.stub("translate").withArgs(80).returns(50);
    this.translator.stub("translate").withArgs(100).returns(60);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 3);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 10, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [0, 30, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");

    assert.deepEqual(renderer.rect.getCall(2).args, [0, 50, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(2).returnValue.attr.getCall(0).args[0], { fill: "#789123" }, "args");
});

QUnit.test("Without labels. Vertical axis. Some strips are out of visible range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: -10,
            endValue: 0,
            color: "#123456"
        }, {
            startValue: 40,
            endValue: 60,
            color: "#456789"
        }, {
            startValue: 100,
            endValue: 110,
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(-10).returns(null);
    this.translator.stub("translate").withArgs(0).returns(null);

    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(60).returns(40);

    this.translator.stub("translate").withArgs(100).returns(60);
    this.translator.stub("translate").withArgs(110).returns(null);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 2);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 30, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [0, 60, 100, 40], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#789123" }, "args");
});

QUnit.test("Without labels. Horizontal axis. Categories", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        categories: ["a", "b", "c", "d", "e", "f", "g"],
        strips: [{
            startValue: "a",
            endValue: "b",
            color: "#123456"
        }, {
            startValue: "d",
            endValue: "e",
            color: "#456789"
        }, {
            startValue: "f",
            endValue: "g",
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d", "e", "f", "g"]
    });
    this.translator.stub("translate").withArgs("a").returns(10);
    this.translator.stub("translate").withArgs("b").returns(20);

    this.translator.stub("translate").withArgs("d").returns(30);
    this.translator.stub("translate").withArgs("e").returns(40);

    this.translator.stub("translate").withArgs("f").returns(50);
    this.translator.stub("translate").withArgs("g").returns(60);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 3);

    assert.deepEqual(renderer.rect.getCall(0).args, [10, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [30, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");

    assert.deepEqual(renderer.rect.getCall(2).args, [50, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(2).returnValue.attr.getCall(0).args[0], { fill: "#789123" }, "args");
});

QUnit.test("Without labels. Horizontal axis. Categories. Some strips are out of range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        categories: ["a", "b", "c", "d", "e", "f", "g"],
        strips: [{
            startValue: "s",
            endValue: "z",
            color: "#123456"
        }, {
            startValue: "d",
            endValue: "e",
            color: "#456789"
        }, {
            startValue: "f",
            endValue: "f",
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d", "e", "f", "g"]
    });
    this.translator.stub("translate").withArgs("d").returns(30);
    this.translator.stub("translate").withArgs("e").returns(40);

    this.translator.stub("translate").withArgs("f").returns(50);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [30, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");
});

QUnit.test("Without labels. Vertical axis. Categories", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        categories: ["a", "b", "c", "d", "e", "f", "g"],
        strips: [{
            startValue: "a",
            endValue: "b",
            color: "#123456"
        }, {
            startValue: "d",
            endValue: "e",
            color: "#456789"
        }, {
            startValue: "f",
            endValue: "g",
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d", "e", "f", "g"]
    });
    this.translator.stub("translate").withArgs("a").returns(10);
    this.translator.stub("translate").withArgs("b").returns(20);

    this.translator.stub("translate").withArgs("d").returns(30);
    this.translator.stub("translate").withArgs("e").returns(40);

    this.translator.stub("translate").withArgs("f").returns(50);
    this.translator.stub("translate").withArgs("g").returns(60);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 3);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 10, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [0, 30, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");

    assert.deepEqual(renderer.rect.getCall(2).args, [0, 50, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(2).returnValue.attr.getCall(0).args[0], { fill: "#789123" }, "args");
});

QUnit.test("Without labels. Vertical axis. Categories. Some strips are out of range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        categories: ["a", "b", "c", "d", "e", "f", "g"],
        strips: [{
            startValue: "s",
            endValue: "z",
            color: "#123456"
        }, {
            startValue: "d",
            endValue: "e",
            color: "#456789"
        }, {
            startValue: "f",
            endValue: "f",
            color: "#789123"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d", "e", "f", "g"]
    });
    this.translator.stub("translate").withArgs("d").returns(30);
    this.translator.stub("translate").withArgs("e").returns(40);

    this.translator.stub("translate").withArgs("f").returns(50);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 30, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");
});

QUnit.test("Without labels. Vertical axis. Categories. Without start value", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        categories: ["a", "b", "c", "d", "e", "f", "g"],
        strips: [{
            endValue: "d",
            color: "#456789"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d", "e", "f", "g"]
    });
    this.translator.stub("translate").withArgs("d").returns(30);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 0, 100, 30], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");
});

QUnit.test("Without labels. Vertical axis. Categories. Without end value", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        categories: ["a", "b", "c", "d", "e", "f", "g"],
        strips: [{
            startValue: "d",
            color: "#456789"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        categories: ["a", "b", "c", "d", "e", "f", "g"]
    });
    this.translator.stub("translate").withArgs("d").returns(30);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 30, 100, 70], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#456789" }, "args");
});

QUnit.test("Draw one strip without labels. Horizontal axis. Values of strip are out of visible range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: -10,
            endValue: 110,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 0, 100, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Draw one strip without labels. Vertical axis. Values of strip are out of visible range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: -10,
            endValue: 110,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 0, 100, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Draw one strip without labels. Horizontal axis. End value > start value", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 40,
            endValue: 20,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [20, 0, 10, 100], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("Draw one strip without labels. Vertical axis. End value > start value", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 40,
            endValue: 20,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.rect.callCount, 1);

    assert.deepEqual(renderer.rect.getCall(0).args, [0, 20, 100, 10], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#123456" }, "args");
});

QUnit.test("With stub data", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 40,
            endValue: 20,
            color: "#123456"
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        stubData: true,
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(40).returns(30);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("rect").called, false, "rect");
});

QUnit.test("Labels. Horizontal axis. Horizontal alignment - left. Vertical alignment - top", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                font: {
                    color: "#111111",
                    size: 15,
                    family: "Tahoma",
                    weight: 700
                }
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 1, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 30], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#111111",
        "font-family": "Tahoma",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 10], "move");
});

QUnit.test("Labels. Horizontal axis. Horizontal alignment - left. Vertical alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 50], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Labels. Horizontal axis. Horizontal alignment - left. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, -10], "move");
});

QUnit.test("Labels. Horizontal axis. Horizontal alignment - center. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 15, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "center" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [0, -10], "move");
});

QUnit.test("Labels. Horizontal axis. Horizontal alignment - right. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "right",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, -10], "move");
});

QUnit.test("Labels. Vertical axis. Horizontal alignment - left. Vertical alignment - top", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                font: {
                    color: "#111111",
                    size: 15,
                    family: "Tahoma",
                    weight: 700
                }
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.text.callCount, 1, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#111111",
        "font-family": "Tahoma",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 10], "move");
});

QUnit.test("Labels. Vertical axis. Horizontal alignment - left. Vertical alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 15], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Labels. Vertical axis. Horizontal alignment - left. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 20], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, -10], "move");
});

QUnit.test("Labels. Vertical axis. Horizontal alignment - center. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 50, 20], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "center" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [0, -10], "move");
});

QUnit.test("Labels. Vertical axis. Horizontal alignment - right. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "right",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 40, 20], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, -10], "move");
});

QUnit.test("First strip is small and without label, second without label, third with label. T441890", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 0,
            endValue: 0.01,
            color: "#123456"
        }, {
            startValue: 1,
            endValue: 10,
            color: "#123456"
        }, {
            startValue: 10,
            endValue: 20,
            color: "#123456",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(0).returns(0);
    this.translator.stub("translate").withArgs(0.01).returns(0);
    this.translator.stub("translate").withArgs(10).returns(10);
    this.translator.stub("translate").withArgs(20).returns(20);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 15], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.module("XY linear axis. Draw constant lines", environment);

QUnit.test("Horizontal axis. Inside. Horizontal alignment - left. Vertical alignment - top", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: 10,
            position: "inside",
            dashStyle: "dot",
            color: "#333333",
            width: 3,
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test",
                font: {
                    size: 15,
                    color: "#111111",
                    weight: 700,
                    family: "Tahoma"
                }
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 1, "path");

    assert.deepEqual(renderer.path.getCall(0).args, [[10, 100, 10, 0], "line"], "args");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], { dashStyle: "dot", stroke: "#333333", "stroke-width": 3 }, "attr");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.getCall(0).args[0], "h", "sharp");

    assert.equal(renderer.text.callCount, 1, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 30], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#111111",
        "font-family": "Tahoma",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [0, 8], "move");
});

QUnit.test("Horizontal axis. Inside. Horizontal alignment - left. Vertical alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: 10,
            position: "inside",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[10, 100, 10, 0], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 50], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [0, 8], "move");
});

QUnit.test("Horizontal axis. Inside. Horizontal alignment - left. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: 10,
            position: "inside",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[10, 100, 10, 0], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [0, 18], "move");
});

QUnit.test("Horizontal axis. Inside. Horizontal alignment - center. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: 10,
            position: "inside",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[10, 100, 10, 0], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [0, 18], "move");
});

QUnit.test("Horizontal axis. Inside. Horizontal alignment - right. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: 10,
            position: "inside",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "right",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[10, 100, 10, 0], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [0, 18], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - left. Vertical alignment - top", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            dashStyle: "dot",
            color: "#333333",
            width: 3,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test",
                font: {
                    size: 15,
                    color: "#111111",
                    weight: 700,
                    family: "Tahoma"
                }
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 1, "path");

    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], { dashStyle: "dot", stroke: "#333333", "stroke-width": 3 }, "attr");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.getCall(0).args[0], "v", "sharp");

    assert.equal(renderer.text.callCount, 1, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#111111",
        "font-family": "Tahoma",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - left. Vertical alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - left. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                position: "outside",
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - center. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                position: "outside",
                text: "test",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 40, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - right. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                position: "outside",
                text: "test",
                horizontalAlignment: "right",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 40, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Vertical axis. Inside. Horizontal alignment - left. Vertical alignment - top", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            position: "inside",
            dashStyle: "dot",
            color: "#333333",
            width: 3,
            label: {
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test",
                font: {
                    size: 15,
                    color: "#111111",
                    weight: 700,
                    family: "Tahoma"
                }
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 1, "path");

    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], { dashStyle: "dot", stroke: "#333333", "stroke-width": 3 }, "attr");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.getCall(0).args[0], "v", "sharp");

    assert.equal(renderer.text.callCount, 1, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#111111",
        "font-family": "Tahoma",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Inside. Horizontal alignment - left. Vertical alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            position: "inside",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Inside. Horizontal alignment - left. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            position: "inside",
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Inside. Horizontal alignment - center. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            position: "inside",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 50, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "center" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Inside. Horizontal alignment - right. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            position: "inside",
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                text: "test",
                horizontalAlignment: "right",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 40, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - left. Vertical alignment - top", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            dashStyle: "dot",
            color: "#333333",
            width: 3,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test",
                font: {
                    size: 15,
                    color: "#111111",
                    weight: 700,
                    family: "Tahoma"
                }
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.equal(renderer.path.callCount, 1, "path");

    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], { dashStyle: "dot", stroke: "#333333", "stroke-width": 3 }, "attr");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.getCall(0).args[0], "v", "sharp");

    assert.equal(renderer.text.callCount, 1, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#111111",
        "font-family": "Tahoma",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - left. Vertical alignment - center", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - left. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                position: "outside",
                text: "test",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 20, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "right" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [-10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - center. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            label: {
                visible: true,
                position: "outside",
                text: "test",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 40, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Vertical axis. Outside. Horizontal alignment - right. Vertical alignment - bottom", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            value: 10,
            label: {
                visible: true,
                position: "outside",
                text: "test",
                horizontalAlignment: "right",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 40, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Horizontal axis. Value is out of range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: -10
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("path").called, false, "path");
});

QUnit.test("Vertical axis. Value is out of range", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: -10
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("path").called, false, "path");
});

QUnit.test("Horizontal axis. Translated value is out of right canvas bound", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: 10
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(-100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("path").called, false, "path");
});

QUnit.test("Vertical axis. Translated value is out of top canvas bound", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(-100);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("path").called, false, "path");
});

QUnit.test("Horizontal axis. Translated value is out of left canvas bound", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        constantLines: [{
            value: 10
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(200);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("path").called, false, "path");
});

QUnit.test("Vertical axis. Translated value is out of bottom canvas bound", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(200);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("path").called, false, "path");
});

QUnit.test("Horizontal axis. Outside. With delta", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            paddingTopBottom: 10,
            paddingLeftRight: 10,
            label: {
                visible: true,
                position: "outside",
                text: "test",
                horizontalAlignment: "right",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.delta = { top: 20, bottom: 30 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");

    assert.deepEqual(renderer.text.getCall(0).args, ["test", 40, 10], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { align: "left" }, "attr");
    assert.deepEqual(renderer.text.getCall(0).returnValue.move.getCall(0).args, [10, 0], "move");
});

QUnit.test("Without text. Horizontal axis", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10,
            label: {}
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100
    });
    this.translator.stub("translate").withArgs(10).returns(10);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.delta = { top: 20, bottom: 30 };
    this.axis.draw();

    //assert
    assert.deepEqual(renderer.path.getCall(0).args, [[0, 10, 100, 10], "line"], "args");
});

QUnit.test("With stub data", function(assert) {
    //arrange
    var renderer = this.renderer;

    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 10
        }]
    });

    this.translator.stub("getBusinessRange").returns({
        addRange: sinon.stub(),
        minVisible: 0,
        maxVisible: 100,
        stubData: true
    });
    this.translator.stub("translate").withArgs(10).returns(200);

    this.axis.setTranslator(this.translator, this.additionalTranslator);

    //act
    this.axis.validate();
    this.axis.draw();

    //assert
    assert.strictEqual(renderer.stub("path").called, false, "path");
});
