"use strict";

var $ = require("jquery"),
    errors = require("viz/core/errors_warnings"),
    translator2DModule = require("viz/translators/translator2d"),
    tickGeneratorModule = require("viz/axes/tick_generator"),
    dxErrors = errors.ERROR_MESSAGES,
    Axis = require("viz/axes/base_axis").Axis,
    vizMocks = require("../../helpers/vizMocks.js"),
    StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {
        updateBusinessRange: function(range) {
            this.getBusinessRange.returns(range);
        }
    });

var environment = {
    beforeEach: function() {
        this.zeroMarginCanvas = {
            width: 110,
            height: 110,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            originalTop: 0,
            originalBottom: 0,
            originalLeft: 0,
            originalRight: 0
        };

        this.canvas = {
            width: 140,
            height: 110,
            top: 30,
            bottom: 40,
            left: 10,
            right: 50,
            originalTop: 0,
            originalBottom: 0,
            originalLeft: 0,
            originalRight: 0
        };

        var that = this;
        sinon.stub(translator2DModule, "Translator2D", function() {
            return that.translator;
        });
        this.renderer = new vizMocks.Renderer();

        this.tickGenerator = sinon.stub(tickGeneratorModule, "tickGenerator", function() {
            return function() {
                return {
                    ticks: that.generatedTicks || [],
                    minorTicks: that.generatedMinorTicks || [],
                    tickInterval: that.generatedTickInterval,
                    breaks: arguments[7]
                };
            };
        });

        this.translator = new StubTranslator();
        this.translator.stub("getBusinessRange").returns({ });
        this.translator.stub("getCanvasVisibleArea").returns({ min: 10, max: 90 }); // for horizontal only
    },
    createAxis: function(options) {
        var stripsGroup = this.renderer.g(),
            labelAxesGroup = this.renderer.g(),
            constantLinesGroup = this.renderer.g(),
            axesContainerGroup = this.renderer.g(),
            gridGroup = this.renderer.g(),
            scaleBreaksGroup = this.renderer.g();

        this.renderer.g.reset();

        this.axis = new Axis($.extend(true, {
            renderer: this.renderer,
            stripsGroup: stripsGroup,
            labelAxesGroup: labelAxesGroup,
            constantLinesGroup: constantLinesGroup,
            axesContainerGroup: axesContainerGroup,
            scaleBreaksGroup: scaleBreaksGroup,
            gridGroup: gridGroup,
            axisType: "xyAxes",
            drawingType: "linear",
            isArgumentAxis: true
        }, options));
    },
    createAxisWithBreaks: function(options, group) {
        var scaleBreaksGroup = this.renderer.g();
        this.createAxis({
            scaleBreaksGroup: group || scaleBreaksGroup,
            widgetClass: "widget",
            axisClass: "axis"
        });
        this.updateOptions($.extend({
            isHorizontal: false,
            containerColor: "#ffffff",
            breaks: [{ startValue: 10, endValue: 20 }],
            breakStyle: {
                color: "black",
                line: "waved",
                width: 10
            }
        }, options));
        this.axis.setBusinessRange({ min: 0, max: 30 });
        this.axis.draw(this.zeroMarginCanvas);
    },
    afterEach: function() {
        translator2DModule.Translator2D.restore();
        this.axis.dispose();
        this.axis = null;
        this.tickGenerator.restore();
        this.renderer.dispose();
        this.renderer = null;
        this.translator = null;
    },
    updateOptions: function(options) {
        this.axis.updateOptions($.extend(true, {
            crosshairMargin: 0,
            label: {
                visible: false, indentFromAxis: 10, overlappingBehavior: "ignore"
            },
            isHorizontal: options.isHorizontal !== undefined ? options.isHorizontal : true,
            grid: {},
            minorGrid: {},
            tick: {},
            minorTick: {},
            title: {},
            marker: {}
        }, options));
        this.axis.validate();
        this.axis.setBusinessRange({ min: 0, max: 30 });
    }
};

QUnit.module("Check groups creation and appending", environment);

QUnit.test("Create groups and append them to groups from options", function(assert) {
    // arrange
    var renderer = this.renderer,
        stripsGroup = this.renderer.g(),
        labelAxesGroup = this.renderer.g(),
        constantLinesGroup = this.renderer.g(),
        axesContainerGroup = this.renderer.g(),
        gridGroup = this.renderer.g();

    this.createAxis({
        axesContainerGroup: axesContainerGroup,
        stripsGroup: stripsGroup,
        labelAxesGroup: labelAxesGroup,
        constantLinesGroup: constantLinesGroup,
        gridGroup: gridGroup
    });
    this.updateOptions({
        isHorizontal: true
    });

    // act
    this.axis.draw(this.canvas);

    // assert
    var g = renderer.g;
    assert.deepEqual(g.getCall(0).returnValue.append.getCall(0).args[0], axesContainerGroup, "_axisGroup");
    assert.deepEqual(g.getCall(1).returnValue.append.getCall(0).args[0], stripsGroup, "_axisStripGroup");
    assert.deepEqual(g.getCall(2).returnValue.append.getCall(0).args[0], gridGroup, "_axisGridGroup");
    assert.deepEqual(g.getCall(3).returnValue.append.getCall(0).args[0], g.getCall(0).returnValue, "_axisElementsGroup");
    assert.deepEqual(g.getCall(4).returnValue.append.getCall(0).args[0], g.getCall(0).returnValue, "_axisLineGroup");
    assert.deepEqual(g.getCall(5).returnValue.append.getCall(0).args[0], g.getCall(0).returnValue, "_axisTitleGroup");
    assert.deepEqual(g.getCall(6).returnValue.append.getCall(0).args[0], constantLinesGroup, "_axisConstantLineGroups.insideGroup");
    assert.deepEqual(g.getCall(7).returnValue.append.getCall(0).args[0], constantLinesGroup, "_axisConstantLineGroups.outsideGroup1");
    assert.deepEqual(g.getCall(8).returnValue.append.getCall(0).args[0], constantLinesGroup, "_axisConstantLineGroups.outsideGroup2");
    assert.deepEqual(g.getCall(9).returnValue.append.getCall(0).args[0], labelAxesGroup, "_axisStripLabelGroup");
});

QUnit.test("Some groups are not passed - created groups are not appended", function(assert) {
    // arrange
    var renderer = this.renderer,
        axesContainerGroup = this.renderer.g();

    this.createAxis({
        axesContainerGroup: axesContainerGroup,
        stripsGroup: null,
        labelAxesGroup: null,
        constantLinesGroup: null,
        gridGroup: null
    });
    this.updateOptions({
        isHorizontal: true
    });

    // act
    this.axis.draw(this.canvas);

    // assert
    var g = renderer.g;
    assert.deepEqual(g.getCall(0).returnValue.stub("append").getCall(0).args[0], axesContainerGroup, "_axisGroup");
    assert.deepEqual(g.getCall(1).returnValue.stub("append").callCount, 0, "_axisStripGroup");
    assert.deepEqual(g.getCall(2).returnValue.stub("append").callCount, 0, "_axisGridGroup");
    assert.deepEqual(g.getCall(3).returnValue.stub("append").getCall(0).args[0], g.getCall(0).returnValue, "_axisElementsGroup");
    assert.deepEqual(g.getCall(4).returnValue.stub("append").getCall(0).args[0], g.getCall(0).returnValue, "_axisLineGroup");
    assert.deepEqual(g.getCall(5).returnValue.stub("append").getCall(0).args[0], g.getCall(0).returnValue, "_axisTitleGroup");
    assert.deepEqual(g.getCall(6).returnValue.stub("append").callCount, 0, "_axisConstantLineGroups.insideGroup");
    assert.deepEqual(g.getCall(7).returnValue.stub("append").callCount, 0, "_axisConstantLineGroups.outsideGroup1");
    assert.deepEqual(g.getCall(8).returnValue.stub("append").callCount, 0, "_axisConstantLineGroups.outsideGroup2");
    assert.deepEqual(g.getCall(9).returnValue.stub("append").callCount, 0, "_axisStripLabelGroup");
});

QUnit.module("XY linear axis. Draw. Check axis line", environment);

QUnit.test("Horizontal top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.path.callCount, 1, "Path call count");
    assert.deepEqual(renderer.path.lastCall.args, [[], "line"], "Path points");
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [10, 30, 90, 30] });
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(1).args[0], { "stroke-width": 4, "stroke-opacity": 0.3, "stroke": "#123456" }, "Path style");
    assert.deepEqual(renderer.path.lastCall.returnValue.sharp.lastCall.args[0], "v", "Path sharp params");
    assert.deepEqual(renderer.path.lastCall.returnValue.append.lastCall.args, [renderer.g.getCall(4).returnValue]);
});

QUnit.test("Horizontal bottom", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [10, 70, 90, 70] }, "Path points");
});

QUnit.test("Vertical left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [10, 70, 10, 30] }, "Path points");
    assert.deepEqual(renderer.path.lastCall.returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Vertical right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [90, 70, 90, 30] }, "Path points");
});

QUnit.module("XY linear axis. Draw. Check axis line. Inverted", environment);

QUnit.test("Horizontal top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });
    this.axis.setBusinessRange({ invert: true });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [90, 30, 10, 30] });
});

QUnit.test("Horizontal bottom", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });
    this.axis.setBusinessRange({ invert: true });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [90, 70, 10, 70] }, "Path points");
});

QUnit.test("Vertical left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });
    this.axis.setBusinessRange({ invert: true });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [10, 30, 10, 70] }, "Path points");
    assert.deepEqual(renderer.path.lastCall.returnValue.sharp.lastCall.args[0], "h", "Path sharp params");
});

QUnit.test("Vertical right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });
    this.axis.setBusinessRange({ invert: true });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.getCall(0).args[0], { points: [90, 30, 90, 70] }, "Path points");
});

QUnit.module("XY linear axis. Draw. Check tick marks", environment);

QUnit.test("Horizontal top", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        group = this.renderer.g.getCall(4).returnValue;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[], "line"]);
    assert.deepEqual(path.getCall(1).args, [[], "line"]);
    assert.deepEqual(path.getCall(2).args, [[], "line"]);
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(0).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(path.getCall(1).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(path.getCall(2).returnValue.append.getCall(0).args[0], group);

    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 30 - 5, 30, 30 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [50, 30 - 5, 50, 30 + 5] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [70, 30 - 5, 70, 30 + 5] });
});

QUnit.test("Horizontal bottom", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [50, 70 - 5, 50, 70 + 5] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.test("Vertical left", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [10 - 5, 40, 10 + 5, 40] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [10 - 5, 50, 10 + 5, 50] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [10 - 5, 60, 10 + 5, 60] });
});

QUnit.test("Vertical right", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [90 - 5, 40, 90 + 5, 40] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [90 - 5, 50, 90 + 5, 50] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [90 - 5, 60, 90 + 5, 60] });
});

QUnit.test("Horizontal, tickOrientation top", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        tickOrientation: "top",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 30 - 10, 30, 30] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [50, 30 - 10, 50, 30] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [70, 30 - 10, 70, 30] });
});

QUnit.test("Horizontal, tickOrientation bottom", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        tickOrientation: "bottom",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 30, 30, 30 + 10] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [50, 30, 50, 30 + 10] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [70, 30, 70, 30 + 10] });
});

QUnit.test("Vertical, tickOrientation left", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        tickOrientation: "left",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [10 - 10, 30, 10, 30] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [10 - 10, 50, 10, 50] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [10 - 10, 70, 10, 70] });
});

QUnit.test("Vertical, tickOrientation right", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        tickOrientation: "right",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [10, 30, 10 + 10, 30] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [10, 50, 10 + 10, 50] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [10, 70, 10 + 10, 70] });
});

QUnit.test("Do not draw minor ticks if minorTick.visible = false but calculateMinors = true", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        minorTick: {
            visible: false
        },
        calculateMinors: true
    });

    this.generatedMinorTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.equal(this.renderer.stub("path").callCount, 0);
});

QUnit.test("Horizontal top, minor tick marks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedMinorTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 30 - 5, 30, 30 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [50, 30 - 5, 50, 30 + 5] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [70, 30 - 5, 70, 30 + 5] });
});

QUnit.test("Categories. DiscreteAxisDivisionMode - betweenLabels. Do not draw last tick mark", function(assert) {
    // arrange
    var categories = ["a", "b", "c", "d"];
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "top",
        categories: categories,
        discreteAxisDivisionMode: "betweenLabels",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ categories: categories });

    this.generatedTicks = categories;

    categories.forEach(function(cat, i) {
        this.translator.stub("translate").withArgs(cat).returns(10 + (i + 1) * 20);
    }.bind(this));

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 30 - 5, 30, 30 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [50, 30 - 5, 50, 30 + 5] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [70, 30 - 5, 70, 30 + 5] });
});

QUnit.test("Categories. DiscreteAxisDivisionMode - crossLabels. Draw all grid lines", function(assert) {
    // arrange
    var categories = ["a", "b", "c", "d"];
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "top",
        categories: categories,
        discreteAxisDivisionMode: "crossLabels",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ categories: categories });

    this.generatedTicks = categories;

    categories.forEach(function(cat, i) {
        this.translator.stub("translate").withArgs(cat).returns(10 + (i + 1) * 20 - 10);
    }.bind(this));

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 4);
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [20, 30 - 5, 20, 30 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [40, 30 - 5, 40, 30 + 5] });
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [60, 30 - 5, 60, 30 + 5] });
    assert.deepEqual(path.getCall(3).returnValue.attr.getCall(1).args[0], { points: [80, 30 - 5, 80, 30 + 5] });
});

QUnit.test("Check calls to translator. Major ticks. Non categories", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        tick: {
            visible: true
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.deepEqual(this.translator.translate.callCount, 6); // 3 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, [1, 1, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, [2, 1, false]);
    assert.deepEqual(this.translator.translate.getCall(4).args, [3, 1, false]);
});

QUnit.test("Check calls to translator. Minor ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        minorTick: {
            visible: true
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.deepEqual(this.translator.translate.callCount, 6); // 3 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, [1, 1, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, [2, 1, false]);
    assert.deepEqual(this.translator.translate.getCall(4).args, [3, 1, false]);
});

QUnit.test("Check calls to translator. Major ticks. Categories, discreteAxisDivisionMode betweenLabels", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "bottom",
        discreteAxisDivisionMode: "betweenLabels",
        categories: ["a", "b", "c"],
        tick: {
            visible: true
        }
    });

    this.generatedTicks = ["a", "b", "c"];

    this.translator.stub("translate").withArgs("a").returns(30);
    this.translator.stub("translate").withArgs("b").returns(50);
    this.translator.stub("translate").withArgs("c").returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.deepEqual(this.translator.translate.callCount, 6); // 3 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["a", 1, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["b", 1, false]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c", 1, false]);
});

QUnit.test("Check calls to translator. Major ticks. Categories, discreteAxisDivisionMode crossLabels", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "bottom",
        discreteAxisDivisionMode: "crossLabels",
        categories: ["a", "b", "c"],
        tick: {
            visible: true
        }
    });

    this.generatedTicks = ["a", "b", "c"];

    this.translator.stub("translate").withArgs("a").returns(30);
    this.translator.stub("translate").withArgs("b").returns(50);
    this.translator.stub("translate").withArgs("c").returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.deepEqual(this.translator.translate.callCount, 6); // 3 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, ["a", 0, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["b", 0, false]);
    assert.deepEqual(this.translator.translate.getCall(4).args, ["c", 0, false]);
});

QUnit.test("Horizontal. Ticks (major and minor) are outside canvas (on zoom) - do not draw outside tick marks", function(assert) {
    // arrange
    this.translator.stub("getCanvasVisibleArea").returns({ min: 10, max: 90 });
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        tick: {
            visible: true
        },
        minorTick: {
            visible: true
        }
    });

    this.generatedTicks = [1, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(2);
    this.translator.stub("translate").withArgs(2).returns(7);
    this.translator.stub("translate").withArgs(4).returns(93);
    this.translator.stub("translate").withArgs(5).returns(98);

    // act
    this.axis.draw(this.canvas);

    assert.strictEqual(this.renderer.stub("path").callCount, 0);
});

QUnit.test("Vertical. Ticks (major and minor) are outside canvas (on zoom) - do not draw outside tick marks", function(assert) {
    // arrange
    this.translator.stub("getCanvasVisibleArea").returns({ min: 30, max: 70 });
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        tick: {
            visible: true
        },
        minorTick: {
            visible: true
        }
    });

    this.generatedTicks = [1, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(80);
    this.translator.stub("translate").withArgs(5).returns(90);

    // act
    this.axis.draw(this.canvas);

    assert.strictEqual(this.renderer.stub("path").callCount, 0);
});

QUnit.module("XY linear axis. Draw. Check tick marks. Boundary ticks", environment);

QUnit.test("showCustomBoundaryTicks true, majorTicks not on bounds - render boundary ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });
    this.generatedTicks = [1.5, 2, 2.5];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 5);
    assert.deepEqual(path.getCall(3).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(4).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(3).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] });
    assert.deepEqual(path.getCall(4).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.test("Tick visible false, but showCustomBoundaryTicks true - render boundary ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: false,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });
    this.generatedTicks = [1.5, 2, 2.5];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.test("No ticks, showCustomBoundaryTicks true - render boundary ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });
    this.generatedTicks = [];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.test("Boundary ticks, discrete axis, betweenLabels - render boundary categories", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        categories: ["a", "b", "c", "d", "e"],
        tick: {
            visible: false,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: "a", max: "e" });
    this.generatedTicks = ["b", "c", "d"];

    this.translator.stub("translate").withArgs("a").returns(10);
    this.translator.stub("translate").withArgs("b").returns(30);
    this.translator.stub("translate").withArgs("c").returns(50);
    this.translator.stub("translate").withArgs("d").returns(70);
    this.translator.stub("translate").withArgs("e").returns(90);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] }); // b
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] }); // d
});

QUnit.test("Boundary ticks, discrete axis, visible categories, crossLabels - do not render boundary categories", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        categories: ["a", "b", "c", "d", "e"],
        discreteAxisDivisionMode: "crossLabels",
        tick: {
            visible: false,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: "a", max: "e" });
    this.generatedTicks = ["b", "c", "d"];

    // act
    this.axis.draw(this.canvas);

    assert.equal(this.renderer.stub("path").callCount, 0);
});

QUnit.test("Boundary ticks, discrete axis, no ticks - do not render boundary ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        categories: ["a", "b", "c", "d", "e"],
        tick: {
            visible: false,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: "a", max: "e" });
    this.generatedTicks = [];

    // act
    this.axis.draw(this.canvas);

    assert.equal(this.renderer.stub("path").callCount, 0);
});

QUnit.test("Check calls to translator. Boundary ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.deepEqual(this.translator.translate.callCount, 4); // 2 for labels
    assert.deepEqual(this.translator.translate.getCall(0).args, [1, -1, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, [3, 1, false]);
});

QUnit.test("showCustomBoundaryTicks true, first majorTick on bound - do not render first boundary tick", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });
    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.test("showCustomBoundaryTicks true, last majorTick on bound - do not render last boundary tick", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });
    this.generatedTicks = [2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(2).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] });
});

QUnit.test("showCustomBoundaryTicks true, customBoundTicks - render first two customBoundTicks ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        customBoundTicks: [1, 3, 5],
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(0).args[0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(0).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.test("showCustomBoundaryTicks true, customBoundTicks, double drawing, second with no data - no boundary ticks should render. T615270", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        customBoundTicks: [1, 3, 5],
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    this.axis.draw(this.canvas);

    this.updateOptions({
        customBoundTicks: [undefined]
    });
    this.axis.setBusinessRange({ min: undefined, max: undefined });
    this.translator.stub("translate").reset();
    this.renderer.path.reset();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(this.renderer.path.callCount, 0);
});

QUnit.test("showCustomBoundaryTicks true, range inside ticks (endOnTick = true) - do not render boundary ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        endOnTick: true,
        tick: {
            visible: false,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1.5, max: 3.5 });
    this.generatedTicks = [1, 2, 3, 4];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.strictEqual(this.renderer.stub("path").callCount, 0);
});

QUnit.test("Boundary points coincide with minor ticks - remove minor ticks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.9,
            width: 5,
            length: 10
        },
        minorTick: {
            visible: true,
            opacity: 0.1
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 5 });
    this.generatedMinorTicks = [1, 2, 3, 4, 5];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(5).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 5);
    assert.strictEqual(path.getCall(0).returnValue.attr.getCall(0).args[0]["stroke-opacity"], 0.1);
    assert.strictEqual(path.getCall(1).returnValue.attr.getCall(0).args[0]["stroke-opacity"], 0.1);
    assert.strictEqual(path.getCall(2).returnValue.attr.getCall(0).args[0]["stroke-opacity"], 0.1);
    assert.strictEqual(path.getCall(3).returnValue.attr.getCall(0).args[0]["stroke-opacity"], 0.9);
    assert.strictEqual(path.getCall(4).returnValue.attr.getCall(0).args[0]["stroke-opacity"], 0.9);
    assert.deepEqual(path.getCall(3).returnValue.attr.getCall(1).args[0], { points: [30, 70 - 5, 30, 70 + 5] });
    assert.deepEqual(path.getCall(4).returnValue.attr.getCall(1).args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.module("XY linear axis. Draw. Check tick labels", environment);

QUnit.test("Horizontal top. Alignment left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var group = this.renderer.g.getCall(3).returnValue;

    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["1"]);
    assert.deepEqual(renderer.text.getCall(1).args, ["2"]);

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 40, y: 30 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 60, y: 30 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 40 - 1, translateY: 30 - 10 - 6 - 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 60 - 3, translateY: 30 - 10 - 8 - 4 }, "Text args");

    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(renderer.text.getCall(1).returnValue.append.getCall(0).args[0], group);
});

QUnit.test("Horizontal top. Alignment center", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "center"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 40, y: 30 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 60, y: 30 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 40 - 1 - 12 / 2, translateY: 30 - 10 - 6 - 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 60 - 3 - 14 / 2, translateY: 30 - 10 - 8 - 4 }, "Text args");
});

QUnit.test("Horizontal top. Alignment right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "right"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 40, y: 30 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 60, y: 30 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 40 - 1 - 12, translateY: 30 - 10 - 6 - 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 60 - 3 - 14, translateY: 30 - 10 - 8 - 4 }, "Text args");
});

QUnit.test("Horizontal Bottom. Alignment left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 40, y: 70 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 60, y: 70 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 40 - 1, translateY: 70 + 10 - 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 60 - 3, translateY: 70 + 10 - 4 }, "Text args");
});

QUnit.test("Vertical left. Alignment left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 10, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 10, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - 14 - 1, translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - 14 - 3, translateY: 60 - 4 - 8 / 2 }, "Text args");
});

QUnit.test("Vertical left. Alignment center", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "center"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 10, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 10, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - 14 / 2 - (1 + 12 / 2), translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - 14 / 2 - (3 + 14 / 2), translateY: 60 - 4 - 8 / 2 }, "Text args");
});

QUnit.test("Vertical left. Alignment right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "right"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 10, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 10, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - (1 + 12), translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - (3 + 14), translateY: 60 - 4 - 8 / 2 }, "Text args");
});

QUnit.test("Vertical right. Alignment left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 90, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 90, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 - 1, translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 - 3, translateY: 60 - 4 - 8 / 2 }, "Text args");
});

QUnit.test("Vertical right. Alignment center", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();

    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "center",
            userAlignment: true
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 90, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 90, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 + 14 / 2 - (1 + 12 / 2), translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 + 14 / 2 - (3 + 14 / 2), translateY: 60 - 4 - 8 / 2 }, "Text args");
});

QUnit.test("Vertical right. Alignment right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "right",
            userAlignment: true
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 90, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 90, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 + 14 - (1 + 12), translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 + 14 - (3 + 14), translateY: 60 - 4 - 8 / 2 }, "Text args");
});

// TODO do we need it? All options should be set
QUnit.test("Horizontal top. Alignment not set - render as center", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: undefined
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 40, y: 30 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 60, y: 30 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 40 - 1 - 12 / 2, translateY: 30 - 10 - 6 - 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 60 - 3 - 14 / 2, translateY: 30 - 10 - 8 - 4 }, "Text args");
});

// TODO do we need it? All options should be set
QUnit.test("Vertical left. Alignment not set - render as right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: undefined
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 10, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 10, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - (1 + 12), translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 10 - 10 - (3 + 14), translateY: 60 - 4 - 8 / 2 }, "Text args");
});

// TODO do we need it? All options should be set
QUnit.test("Vertical right. Alignment not set - render as left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: undefined
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { x: 90, y: 40 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(1).args[0], { x: 90, y: 60 });

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 - 1, translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.getCall(2).args[0], { translateX: 90 + 10 - 3, translateY: 60 - 4 - 8 / 2 }, "Text args");
});

QUnit.test("Labels with hints", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left",
            customizeHint: function() {
                return this.valueText;
            }
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.setTitle.lastCall.args[0], "1", "Text hint");
    assert.deepEqual(renderer.text.getCall(1).returnValue.setTitle.lastCall.args[0], "2", "Text hint");
});

QUnit.test("Labels with hints. Empty hints are not applied", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left",
            customizeHint: function() {
                return this.value === 1 ? undefined : "";
            }
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.getCall(0).returnValue.stub("setTitle").callCount, 0);
    assert.equal(renderer.text.getCall(1).returnValue.stub("setTitle").callCount, 0);
});

QUnit.test("Labels with hints. Check callback's param", function(assert) {
    // arrange
    var hintSpy = sinon.spy();
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left",
            customizeHint: hintSpy
        }
    });

    this.axis.setBusinessRange({ min: -1, max: 4 });

    this.generatedTicks = [1];

    this.translator.stub("translate").withArgs(1).returns(40);

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(hintSpy.callCount, 1);
    assert.deepEqual(hintSpy.getCall(0).args, [{
        value: 1,
        valueText: "1",
        min: -1,
        max: 4
    }]);

    assert.deepEqual(hintSpy.getCall(0).thisValue, {
        value: 1,
        valueText: "1",
        min: -1,
        max: 4
    });
});

QUnit.test("Stub data. Do not draw labels", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [1];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.axis.setBusinessRange({ stubData: true });

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(this.renderer.stub("text").callCount, 0);
});

QUnit.test("Store data in label", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [123, 345];

    this.translator.stub("translate").withArgs(123).returns(40);
    this.translator.stub("translate").withArgs(345).returns(80);

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(this.renderer.text.getCall(0).returnValue.data.getCall(0).args, ["chart-data-argument", 123]);
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.data.getCall(0).args, ["chart-data-argument", 345]);
});

QUnit.test("Check styles", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left",
            opacity: 0.34,
            font: {
                color: "#123456",
                size: 10,
                weight: 200,
                family: "Tahoma2"
            }
        }
    });

    this.generatedTicks = [1];

    this.translator.stub("translate").withArgs(1).returns(40);

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args, [{ opacity: 0.34, align: "center" }], "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args, [{
        fill: "#123456",
        "font-family": "Tahoma2",
        "font-size": 10,
        "font-weight": 200
    }], "css");
});

QUnit.test("Without text, all variations. Do not draw labels", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left",
            customizeText: function() {
                switch(this.value) {
                    case 1:
                        return null;
                    case 2:
                        return undefined;
                    case 3:
                        return "";
                    case 1:
                        return "      ";
                }
            }
        }
    });

    this.generatedTicks = [1, 2, 3, 4, 5];

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.test("Text is 0. Draw label", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [0];
    this.translator.stub("translate").withArgs(0).returns(40);

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["0"]);
});

QUnit.test("Check calls to translator", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        label: {
            visible: true
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    assert.deepEqual(this.translator.translate.callCount, 6);
    assert.deepEqual(this.translator.translate.getCall(1).args, [1, undefined, false]);
    assert.deepEqual(this.translator.translate.getCall(3).args, [2, undefined, false]);
    assert.deepEqual(this.translator.translate.getCall(5).args, [3, undefined, false]);
});

QUnit.test("Labels are outside canvas (on zoom) - do not draw outside labels", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [1];

    this.translator.stub("translate").withArgs(1).returns(2);

    // act
    this.axis.draw(this.canvas);

    assert.equal(this.renderer.stub("text").callCount, 0);
});

QUnit.module("XY linear axis. Draw. Check constant lines", environment);

QUnit.test("Horizontal axis.", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            value: 2,
            dashStyle: "dotdash",
            color: "#222222",
            width: 4,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            value: 3,
            dashStyle: "dash",
            color: "#333333",
            width: 5,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    var insideGroup = this.renderer.g.getCall(6).returnValue;
    assert.equal(renderer.path.callCount, 3, "path");
    assert.deepEqual(renderer.path.getCall(0).args, [[40, 30, 40, 70], "line"], "args");
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.getCall(0).args[0], { dashStyle: "dot", stroke: "#111111", "stroke-width": 3 }, "attr");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.getCall(0).args[0], "h", "sharp");
    assert.deepEqual(renderer.path.getCall(0).returnValue.append.getCall(0).args[0], insideGroup);

    assert.deepEqual(renderer.path.getCall(1).args, [[60, 30, 60, 70], "line"], "args");
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.getCall(0).args[0], { dashStyle: "dash", stroke: "#333333", "stroke-width": 5 }, "attr");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.getCall(0).args[0], "h", "sharp");
    assert.deepEqual(renderer.path.getCall(1).returnValue.append.getCall(0).args[0], insideGroup);

    assert.deepEqual(renderer.path.getCall(2).args, [[50, 30, 50, 70], "line"], "args");
    assert.deepEqual(renderer.path.getCall(2).returnValue.attr.getCall(0).args[0], { dashStyle: "dotdash", stroke: "#222222", "stroke-width": 4 }, "attr");
    assert.deepEqual(renderer.path.getCall(2).returnValue.sharp.getCall(0).args[0], "h", "sharp");
    assert.deepEqual(renderer.path.getCall(2).returnValue.append.getCall(0).args[0], insideGroup);
});

QUnit.test("Vertical axis. Only outside constant lines are rendered", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside"
            }
        }, {
            value: 2,
            dashStyle: "dotdash",
            color: "#222222",
            width: 4,
            label: {
                position: "inside"
            }
        }, {
            value: 3,
            dashStyle: "dash",
            color: "#333333",
            width: 5,
            label: {
                position: "outside"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.path.callCount, 3, "path");
    assert.deepEqual(renderer.path.getCall(0).args, [[10, 40, 90, 40], "line"], "args");
    assert.deepEqual(renderer.path.getCall(0).returnValue.sharp.getCall(0).args[0], "v", "sharp");

    assert.deepEqual(renderer.path.getCall(1).args, [[10, 60, 90, 60], "line"], "args");
    assert.deepEqual(renderer.path.getCall(1).returnValue.sharp.getCall(0).args[0], "v", "sharp");

    assert.deepEqual(renderer.path.getCall(2).args, [[10, 50, 90, 50], "line"], "args");
    assert.deepEqual(renderer.path.getCall(2).returnValue.sharp.getCall(0).args[0], "v", "sharp");
});

QUnit.test("Horizontal axis. Value is out of range", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: -1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test1"
            }
        }]
    });

    this.translator.stub("translate").withArgs(-1).returns(null);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("path").callCount, 0);
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.test("Vertical axis. Value is out of range", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: -1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test1"
            }
        }]
    });

    this.translator.stub("translate").withArgs(-1).returns(null);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("path").callCount, 0);
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.test("Horizontal axis. Constant line value is out of canvas bounds", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test1"
            }
        }, {
            value: 2,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test2"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(5);
    this.translator.stub("translate").withArgs(1).returns(95);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("path").callCount, 0);
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.test("Vertical axis. Translated value is out of canvas bounds", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test1"
            }
        }, {
            value: 2,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test2"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(5);
    this.translator.stub("translate").withArgs(1).returns(95);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("path").callCount, 0);
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.test("Horizontal axis. Value is not specified", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test1"
            }
        }]
    });

    this.translator.stub("translate").withArgs(-1).returns(null);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("path").callCount, 0);
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.test("With stub data", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                visible: true,
                text: "test1"
            }
        }]
    });

    this.axis.setBusinessRange({
        stubData: true
    });
    this.translator.stub("translate").withArgs(1).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("path").callCount, 0);
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.module("XY linear axis. Draw. Check constant line (outside) labels", environment);

QUnit.test("Vertical axis. Horizontal alignment - left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "center",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "center",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var leftGroup = this.renderer.g.getCall(7).returnValue;
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 10, 40], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#333333",
        "font-family": "Tahoma1",
        "font-size": 13,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 - 6 - (1 + 12), translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], leftGroup);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 10, 60], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.css.getCall(0).args[0], {
        fill: "#444444",
        "font-family": "Tahoma2",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 10 - 8 - (3 + 14), translateY: 60 - 4 - 8 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.append.getCall(0).args[0], leftGroup);
});

QUnit.test("Vertical axis. Horizontal alignment - right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "outside",
                horizontalAlignment: "right",
                verticalAlignment: "center",
                visible: true,
                text: "test1"
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "outside",
                horizontalAlignment: "right",
                verticalAlignment: "center",
                visible: true,
                text: "test2"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var rightGroup = this.renderer.g.getCall(8).returnValue;
    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 90, 40], "args");
    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 90, 60], "args");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 90 + 6 - 1, translateY: 40 - 2 - 6 / 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 90 + 8 - 3, translateY: 60 - 4 - 8 / 2 }, "Text args");

    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], rightGroup);
    assert.deepEqual(renderer.text.getCall(1).returnValue.append.getCall(0).args[0], rightGroup);
});

QUnit.test("Horizontal axis. Vertical alignment - top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "outside",
                horizontalAlignment: "center",
                verticalAlignment: "top",
                visible: true,
                text: "test1"
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "outside",
                horizontalAlignment: "center",
                verticalAlignment: "top",
                visible: true,
                text: "test2"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var topGroup = this.renderer.g.getCall(7).returnValue;
    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 40, 30], "args");
    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60, 30], "args");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 40 - 1 - 12 / 2, translateY: 30 - 5 - 6 - 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 60 - 3 - 14 / 2, translateY: 30 - 7 - 8 - 4 }, "Text args");

    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], topGroup);
    assert.deepEqual(renderer.text.getCall(1).returnValue.append.getCall(0).args[0], topGroup);
});

QUnit.test("Horizontal axis. Vertical alignment - bottom", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "outside",
                horizontalAlignment: "center",
                verticalAlignment: "bottom",
                visible: true,
                text: "test1"
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "outside",
                horizontalAlignment: "center",
                verticalAlignment: "bottom",
                visible: true,
                text: "test2"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var bottomGroup = this.renderer.g.getCall(8).returnValue;
    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 40, 70], "args");
    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60, 70], "args");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 40 - 1 - 12 / 2, translateY: 70 + 5 - 2 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 60 - 3 - 14 / 2, translateY: 70 + 7 - 4 }, "Text args");

    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], bottomGroup);
    assert.deepEqual(renderer.text.getCall(1).returnValue.append.getCall(0).args[0], bottomGroup);
});

QUnit.module("XY linear axis. Draw. Constant line (inside) labels", environment);

QUnit.test("Vertical axis. Horizontal alignment - left. Vertical alignment - top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var insideGroup = this.renderer.g.getCall(6).returnValue;
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 10, 40], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#333333",
        "font-family": "Tahoma1",
        "font-size": 13,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 + 6 - 1, translateY: 40 - 5 - 2 - 6 }, "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], insideGroup);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 10, 60], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.css.getCall(0).args[0], {
        fill: "#444444",
        "font-family": "Tahoma2",
        "font-size": 15,
        "font-weight": 700
    }, "css");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 10 + 8 - 3, translateY: 60 - 7 - 4 - 8 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.append.getCall(0).args[0], insideGroup);
});

QUnit.test("Vertical axis. Horizontal alignment - center. Vertical alignment - top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "center",
                verticalAlignment: "top",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "inside",
                horizontalAlignment: "center",
                verticalAlignment: "top",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 + (90 - 10) / 2 - 1 - 12 / 2, translateY: 40 - 5 - 2 - 6 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 10 + (90 - 10) / 2 - 3 - 14 / 2, translateY: 60 - 7 - 4 - 8 }, "Text args");
});

QUnit.test("Vertical axis. Horizontal alignment - right. Vertical alignment - top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "right",
                verticalAlignment: "top",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "inside",
                horizontalAlignment: "right",
                verticalAlignment: "top",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 90, 40], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 90 - 6 - 1 - 12, translateY: 40 - 5 - 2 - 6 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 90, 60], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 90 - 8 - 3 - 14, translateY: 60 - 7 - 4 - 8 }, "Text args");
});

QUnit.test("Vertical axis. Vertical alignment - bottom", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "bottom",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0].translateY, 40 + 5 - 2, "Text args");
});

QUnit.test("Horizontal axis. Vertical alignment - top. Horizontal alignment - left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 40, 30], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 40 - 6 - 1 - 12, translateY: 30 + 5 - 2 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60, 30], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 60 - 8 - 3 - 14, translateY: 30 + 7 - 4 }, "Text args");
});

QUnit.test("Horizontal axis. Vertical alignment - center. Horizontal alignment - left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "center",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "center",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 40, 70], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 40 - 6 - 1 - 12, translateY: 30 + (70 - 30) / 2 - 2 - 6 / 2 }, "Text args");

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60, 70], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 60 - 8 - 3 - 14, translateY: 30 + (70 - 30) / 2 - 4 - 8 / 2 }, "Text args");
});

QUnit.test("Horizontal axis. Vertical alignment - bottom. Horizontal alignment - left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "bottom",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "bottom",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 40 - 6 - 1 - 12, translateY: 70 - 5 - 2 - 6 }, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 60 - 8 - 3 - 14, translateY: 70 - 7 - 4 - 8 }, "Text args");
});

QUnit.test("Horizontal axis. Horizontal alignment - right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                position: "inside",
                horizontalAlignment: "right",
                verticalAlignment: "bottom",
                visible: true,
                text: "test1",
                font: {
                    size: 13,
                    color: "#333333",
                    weight: 700,
                    family: "Tahoma1"
                }
            }
        }, {
            value: 2,
            dashStyle: "dash",
            color: "#222222",
            width: 5,
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                position: "inside",
                horizontalAlignment: "right",
                verticalAlignment: "bottom",
                visible: true,
                text: "test2",
                font: {
                    size: 15,
                    color: "#444444",
                    weight: 700,
                    family: "Tahoma2"
                }
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0].translateX, 40 + 6 - 1, "Text args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0].translateX, 60 + 8 - 3, "Text args");
});

QUnit.module("XY linear axis. Draw. Title", environment);

QUnit.test("Horizontal top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        title: {
            margin: 5,
            text: "Title text",
            opacity: 0.34,
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 12, height: 6 };

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 1, "Text call count");

    assert.deepEqual(renderer.text.getCall(0).args, ["Title text", 50, 30]);
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.firstCall.args[0], { opacity: 0.34, align: "center" });
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { translateY: 30 - 5 - (2 + 6) }, "Text args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.lastCall.args[0], {
        "fill": "#123456",
        "font-weight": 200,
        "font-size": 10,
        "font-family": "Tahoma"
    }, "Text css");

    var group = this.renderer.g.getCall(5).returnValue;
    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], group);
});

QUnit.test("Horizontal bottom", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        title: {
            margin: 5,
            text: "Title text",
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 12, height: 6 };

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["Title text", 50, 70]);
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { translateY: 70 + 5 - 2 }, "Text args");
});

QUnit.test("Vertical left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        title: {
            margin: 5,
            text: "Title text",
            opacity: 0.33,
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.renderer.bBoxTemplate = { x: 2, y: 1, width: 6, height: 12 };

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["Title text", 10, 50]);
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { opacity: 0.33, rotate: 270, align: "center" });
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], {
        translateX: 10 - 5 - (2 + 6)
    }, "Text args");
});

QUnit.test("Vertical right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        title: {
            margin: 5,
            text: "Title text",
            opacity: 0.33,
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.renderer.bBoxTemplate = { x: 2, y: 1, width: 6, height: 12 };

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["Title text", 90, 50]);
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { opacity: 0.33, rotate: 90, align: "center" });
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], {
        translateX: 90 + 5 - 2
    }, "Text args");
});

QUnit.test("Text is not specified", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        title: {
            margin: 5,
            text: "",
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 12, height: 6 };

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("text").callCount, 0);
});

QUnit.test("Horizontal. Inverted", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        title: {
            margin: 5,
            text: "Title text",
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });
    this.axis.setBusinessRange({ invert: true });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 12, height: 6 };

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["Title text", 50, 70]);
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], { translateY: 70 + 5 - 2 }, "Text args");
});

QUnit.test("Vertical. Inverted", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        title: {
            margin: 5,
            text: "Title text",
            opacity: 0.33,
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });
    this.axis.setBusinessRange({ invert: true });

    this.renderer.bBoxTemplate = { x: 2, y: 1, width: 6, height: 12 };

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["Title text", 10, 50]);
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(0).args[0], { opacity: 0.33, rotate: 270, align: "center" });
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.getCall(1).args[0], {
        translateX: 10 - 5 - (2 + 6)
    }, "Text args");
});

QUnit.module("XY linear axis. Draw. Date marker", environment);

QUnit.test("Full markers", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 0, 0, 0),
        date1 = new Date(2011, 5, 26, 0, 0, 0),
        date2 = new Date(2011, 5, 26, 23, 59, 59),
        date01 = new Date(2011, 5, 25, 0, 0, 0),
        date02 = new Date(2011, 5, 26, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date01).returns(10);
    this.translator.stub("translate").withArgs(date02).returns(50);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        text = this.renderer.text,
        group = this.renderer.g.getCall(3).returnValue;

    assert.equal(path.callCount, 4);
    assert.deepEqual(path.getCall(0).args, [[10, 80, 10, 113], "line"], "Marker line");
    assert.deepEqual(path.getCall(0).returnValue.attr.firstCall.args[0], { "stroke-width": 2, stroke: "black", "stroke-opacity": 0.1, sharp: "h" });
    assert.deepEqual(path.getCall(0).returnValue.append.firstCall.args[0], group);

    assert.deepEqual(path.getCall(1).args, [[50, 80, 50, 113], "line"], "Marker line");
    assert.deepEqual(path.getCall(1).returnValue.attr.firstCall.args[0], { "stroke-width": 2, stroke: "black", "stroke-opacity": 0.1, sharp: "h" });
    assert.deepEqual(path.getCall(1).returnValue.append.firstCall.args[0], group);

    assert.equal(text.callCount, 2);
    assert.deepEqual(text.getCall(0).args, ["25", 10, 80], "Marker text");
    assert.deepEqual(text.getCall(0).returnValue.css.lastCall.args[0], { fill: "green", "font-size": 12 });
    assert.deepEqual(text.getCall(0).returnValue.append.firstCall.args[0], group);
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 + 5 + 2 - 1, translateY: 80 + 11 - 2 });

    assert.deepEqual(text.getCall(1).args, ["Sunday, 26", 50, 80], "Marker text");
    assert.deepEqual(text.getCall(1).returnValue.css.lastCall.args[0], { fill: "green", "font-size": 12 });
    assert.deepEqual(text.getCall(1).returnValue.append.firstCall.args[0], group);
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 50 + 5 + 2 - 3, translateY: 80 + 11 - 4 });

    assert.deepEqual(path.getCall(2).args, [[10, 80, 10, 113, 50, 113, 50, 80, 10, 80], "area"], "Marker tracker");
    assert.deepEqual(path.getCall(2).returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "grey", fill: "grey", opacity: 0.0001 });
    assert.deepEqual(path.getCall(2).returnValue.append.firstCall.args[0], group);

    assert.deepEqual(path.getCall(3).args, [[50, 80, 50, 113, 90, 113, 90, 80, 50, 80], "area"], "Marker tracker");
    assert.deepEqual(path.getCall(3).returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "grey", fill: "grey", opacity: 0.0001 });
    assert.deepEqual(path.getCall(3).returnValue.append.firstCall.args[0], group);
});

QUnit.test("Full markers. Inverted", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 0, 0, 0),
        date1 = new Date(2011, 5, 26, 0, 0, 0),
        date2 = new Date(2011, 5, 26, 23, 59, 59),
        date01 = new Date(2011, 5, 25, 0, 0, 0),
        date02 = new Date(2011, 5, 26, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: true });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(90);
    this.translator.stub("translate").withArgs(date01).returns(90);
    this.translator.stub("translate").withArgs(date02).returns(50);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        text = this.renderer.text;

    assert.equal(path.callCount, 4);
    assert.deepEqual(path.getCall(0).args, [[90, 80, 90, 113], "line"], "Marker line");

    assert.deepEqual(path.getCall(1).args, [[50, 80, 50, 113], "line"], "Marker line");

    assert.equal(text.callCount, 2);
    assert.deepEqual(text.getCall(0).args, ["25", 90, 80], "Marker text");
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 90 - 5 - 2 - 1 - 12, translateY: 80 + 11 - 2 });

    assert.deepEqual(text.getCall(1).args, ["Sunday, 26", 50, 80], "Marker text");
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 50 - 5 - 2 - 3 - 14, translateY: 80 + 11 - 4 });

    assert.deepEqual(path.getCall(2).args, [[90, 80, 90, 113, 50, 113, 50, 80, 90, 80], "area"], "Marker tracker");
    assert.deepEqual(path.getCall(3).args, [[50, 80, 50, 113, 10, 113, 10, 80, 50, 80], "area"], "Marker tracker");
});

QUnit.test("First marker without line", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123),
        date01 = new Date(2011, 5, 26, 0, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(0);
    this.translator.stub("translate").withArgs(date01).returns(20);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        text = this.renderer.text,
        group = this.renderer.g.getCall(3).returnValue;

    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[20, 80, 20, 113], "line"]);

    assert.equal(text.callCount, 2);
    assert.deepEqual(text.getCall(0).args, ["Sunday, 26", 20, 80]);
    assert.deepEqual(text.getCall(0).returnValue.css.lastCall.args[0], { fill: "green", "font-size": 12 });
    assert.deepEqual(text.getCall(0).returnValue.append.firstCall.args[0], group);
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 20 + 5 + 2 - 3, translateY: 80 + 11 - 4 });

    assert.deepEqual(text.getCall(1).args, ["Saturday, 25", 0, 80]);
    assert.deepEqual(text.getCall(1).returnValue.css.lastCall.args[0], { fill: "green", "font-size": 12 });
    assert.deepEqual(text.getCall(1).returnValue.append.firstCall.args[0], group);
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 0 + 5 + 2 - 1, translateY: 80 + 11 - 2 });

    assert.deepEqual(path.getCall(1).args, [[0, 80, 0, 113, 20, 113, 20, 80, 0, 80], "area"]);
    assert.deepEqual(path.getCall(2).args, [[20, 80, 20, 113, 90, 113, 90, 80, 20, 80], "area"]);
});

QUnit.test("First marker without line and label", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123),
        date01 = new Date(2011, 5, 26, 0, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(0);
    this.translator.stub("translate").withArgs(date01).returns(20);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 22, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        text = this.renderer.text;

    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[20, 80, 20, 113], "line"]);

    assert.deepEqual(text.getCall(1).args, ["Saturday, 25", 0, 80]);
    assert.strictEqual(text.getCall(1).returnValue.stub("attr").callCount, 0);
    assert.strictEqual(text.getCall(1).returnValue.dispose.callCount, 1);

    assert.deepEqual(path.getCall(1).args, [[0, 80, 0, 113, 20, 113, 20, 80, 0, 80], "area"]);
    assert.deepEqual(path.getCall(2).args, [[20, 80, 20, 113, 90, 113, 90, 80, 20, 80], "area"]);

    assert.deepEqual(path.getCall(1).returnValue.setTitle.args[0][0], "Saturday, 25");
    assert.strictEqual(path.getCall(2).returnValue.stub("setTitle").called, false);
});

QUnit.test("First marker without line and label, inverted", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123),
        date01 = new Date(2011, 5, 26, 0, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: true });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(90);
    this.translator.stub("translate").withArgs(date01).returns(80);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 22, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        text = this.renderer.text;

    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[80, 80, 80, 113], "line"]);

    assert.deepEqual(text.getCall(1).args, ["Saturday, 25", 90, 80]);
    assert.strictEqual(text.getCall(1).returnValue.stub("attr").callCount, 0);
    assert.strictEqual(text.getCall(1).returnValue.dispose.callCount, 1);

    assert.deepEqual(path.getCall(1).args, [[90, 80, 90, 113, 80, 113, 80, 80, 90, 80], "area"]);
    assert.deepEqual(path.getCall(2).args, [[80, 80, 80, 113, 10, 113, 10, 80, 80, 80], "area"]);

    assert.deepEqual(path.getCall(1).returnValue.setTitle.args[0][0], "Saturday, 25");
    assert.strictEqual(path.getCall(2).returnValue.stub("setTitle").called, false);
});

QUnit.test("Last marker without label", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 0, 0, 0),
        date1 = new Date(2011, 5, 26, 0, 0, 0),
        date2 = new Date(2011, 5, 26, 23, 59, 59),
        date01 = new Date(2011, 5, 25, 0, 0, 0),
        date02 = new Date(2011, 5, 26, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date01).returns(10);
    this.translator.stub("translate").withArgs(date02).returns(80);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var text = this.renderer.text;
    assert.deepEqual(text.getCall(1).args, ["Sunday, 26", 80, 80], "Marker text");
    assert.strictEqual(text.getCall(1).returnValue.stub("attr").callCount, 0);
    assert.strictEqual(text.getCall(1).returnValue.dispose.callCount, 1);

    assert.strictEqual(this.renderer.path.getCall(2).returnValue.stub("setTitle").called, false);
    assert.deepEqual(this.renderer.path.getCall(3).returnValue.setTitle.args[0][0], "Sunday, 26");
});

QUnit.test("Last marker without label, inverted", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 0, 0, 0),
        date1 = new Date(2011, 5, 26, 0, 0, 0),
        date2 = new Date(2011, 5, 26, 23, 59, 59),
        date01 = new Date(2011, 5, 25, 0, 0, 0),
        date02 = new Date(2011, 5, 26, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: true });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(90);
    this.translator.stub("translate").withArgs(date01).returns(90);
    this.translator.stub("translate").withArgs(date02).returns(20);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var text = this.renderer.text;
    assert.deepEqual(text.getCall(1).args, ["Sunday, 26", 20, 80], "Marker text");
    assert.strictEqual(text.getCall(1).returnValue.stub("attr").callCount, 0);
    assert.strictEqual(text.getCall(1).returnValue.dispose.callCount, 1);

    assert.strictEqual(this.renderer.path.getCall(2).returnValue.stub("setTitle").called, false);
    assert.deepEqual(this.renderer.path.getCall(3).returnValue.setTitle.args[0][0], "Sunday, 26");
});

QUnit.test("Second marker is too wide, draw without label and line", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 0, 0, 0),
        date2 = new Date(2011, 5, 27, 23, 59, 59),
        date01 = new Date(2011, 5, 25, 0, 0, 0),
        date02 = new Date(2011, 5, 26, 0, 0, 0),
        date03 = new Date(2011, 5, 27, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date01).returns(10);
    this.translator.stub("translate").withArgs(date02).returns(30);
    this.translator.stub("translate").withArgs(date03).returns(50);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 22, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        text = this.renderer.text;

    assert.equal(path.callCount, 5);
    assert.deepEqual(path.getCall(0).args, [[10, 80, 10, 113], "line"], "Marker line");
    assert.deepEqual(path.getCall(1).args, [[30, 80, 30, 113], "line"], "Marker line");
    assert.deepEqual(path.getCall(2).args, [[50, 80, 50, 113], "line"], "Marker line");

    assert.strictEqual(path.getCall(1).returnValue.dispose.callCount, 1);

    assert.equal(text.callCount, 3);
    assert.deepEqual(text.getCall(0).args, ["25", 10, 80], "Marker text");

    assert.deepEqual(text.getCall(1).args, ["Sunday, 26", 30, 80], "Marker text");
    assert.strictEqual(text.getCall(1).returnValue.stub("attr").callCount, 0);
    assert.strictEqual(text.getCall(1).returnValue.dispose.callCount, 1);

    assert.deepEqual(text.getCall(2).args, ["Monday, 27", 50, 80], "Marker text");

    assert.deepEqual(path.getCall(3).args, [[10, 80, 10, 113, 50, 113, 50, 80, 10, 80], "area"], "Marker tracker");
    assert.deepEqual(path.getCall(4).args, [[50, 80, 50, 113, 90, 113, 90, 80, 50, 80], "area"], "Marker tracker");
});

QUnit.test("Second marker is too wide, draw without label and line, inverted", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 0, 0, 0),
        date2 = new Date(2011, 5, 27, 23, 59, 59),
        date01 = new Date(2011, 5, 25, 0, 0, 0),
        date02 = new Date(2011, 5, 26, 0, 0, 0),
        date03 = new Date(2011, 5, 27, 0, 0, 0);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: true });

    this.generatedTicks = [date0, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(90);
    this.translator.stub("translate").withArgs(date01).returns(90);
    this.translator.stub("translate").withArgs(date02).returns(70);
    this.translator.stub("translate").withArgs(date03).returns(50);

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 22, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        text = this.renderer.text;

    assert.equal(path.callCount, 5);
    assert.deepEqual(path.getCall(0).args, [[90, 80, 90, 113], "line"], "Marker line");
    assert.deepEqual(path.getCall(1).args, [[70, 80, 70, 113], "line"], "Marker line");
    assert.deepEqual(path.getCall(2).args, [[50, 80, 50, 113], "line"], "Marker line");

    assert.strictEqual(path.getCall(1).returnValue.dispose.callCount, 1);

    assert.equal(text.callCount, 3);
    assert.deepEqual(text.getCall(0).args, ["25", 90, 80], "Marker text");

    assert.deepEqual(text.getCall(1).args, ["Sunday, 26", 70, 80], "Marker text");
    assert.strictEqual(text.getCall(1).returnValue.stub("attr").callCount, 0);
    assert.strictEqual(text.getCall(1).returnValue.dispose.callCount, 1);

    assert.deepEqual(text.getCall(2).args, ["Monday, 27", 50, 80], "Marker text");

    assert.deepEqual(path.getCall(3).args, [[90, 80, 90, 113, 50, 113, 50, 80, 90, 80], "area"], "Marker tracker");
    assert.deepEqual(path.getCall(4).args, [[50, 80, 50, 113, 10, 113, 10, 80, 50, 80], "area"], "Marker tracker");
});

QUnit.test("T402810. Do not render markers if there is only one on start of scale", function(assert) {
    // arrange
    var date0 = new Date(2011, 2, 1),
        date1 = new Date(2011, 2, 15),
        date2 = new Date(2011, 2, 31),
        date01 = new Date(2011, 2, 1);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });
    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "day";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);
    this.translator.stub("translate").withArgs(date01).returns(10);

    this.axis.draw(this.canvas);

    // assert
    assert.equal(this.renderer.stub("text").callCount, 0);
    assert.equal(this.renderer.stub("path").callCount, 0);
});

QUnit.test("T402810. Render 2 markers if there is only one in the middle of scale", function(assert) {
    // arrange
    var date0 = new Date(2011, 1, 15),
        date1 = new Date(2011, 2, 1),
        date2 = new Date(2011, 2, 15),
        date01 = new Date(2011, 2, 1);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });
    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "day";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);
    this.translator.stub("translate").withArgs(date01).returns(10);

    this.axis.draw(this.canvas);

    // assert
    assert.equal(this.renderer.text.callCount, 2);
    assert.equal(this.renderer.text.getCall(0).args[0], "March");
    assert.equal(this.renderer.text.getCall(1).args[0], "February");
    assert.equal(this.renderer.path.callCount, 3);
});

QUnit.test("Draw date marker with customizeText", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                customizeText: function() { return "custom text - " + this.valueText; },
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    this.axis.draw(this.canvas);

    // assert
    assert.equal(this.renderer.text.firstCall.args[0], "custom text - Sunday, 26");
    assert.equal(this.renderer.text.lastCall.args[0], "custom text - Saturday, 25");
});

QUnit.test("Do not draw date marker when axis type is discrete", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        type: "discrete",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.notOk(this.renderer.text.called);
    assert.notOk(this.renderer.path.called);
});

QUnit.test("Date marker with millisecond delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 1, 21, 33, 988),
        date1 = new Date(2011, 5, 25, 1, 21, 33, 999),
        date2 = new Date(2011, 5, 25, 1, 21, 34, 2);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                format: "longTime",
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "millisecond";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "1:21:34 AM");
    assert.equal(texts.lastCall.args[0], "1:21:33 AM");
});

QUnit.test("Date marker with second delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 1, 21, 33, 123),
        date1 = new Date(2011, 5, 25, 1, 22, 3, 122),
        date2 = new Date(2011, 5, 25, 1, 22, 23, 582);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                format: "longTime",
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "second";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.lastCall.args[0], "1:21:33 AM");
    assert.equal(texts.firstCall.args[0], "1:22:00 AM");
});

QUnit.test("Date marker with minute delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 1, 59, 33, 123),
        date1 = new Date(2011, 5, 25, 2, 2, 33, 122),
        date2 = new Date(2011, 5, 25, 2, 3, 33, 582);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "minute";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.lastCall.args[0], "1:59 AM");
    assert.equal(texts.firstCall.args[0], "2:00 AM");
});

QUnit.test("Date marker with hour delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "Sunday, 26");
    assert.equal(texts.lastCall.args[0], "Saturday, 25");
});

QUnit.test("Date marker with day delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 30, 1, 21, 33, 123),
        date1 = new Date(2011, 6, 1, 2, 22, 34, 122),
        date2 = new Date(2011, 6, 2, 2, 22, 34, 122);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "day";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "July");
    assert.equal(texts.lastCall.args[0], "June");
});

QUnit.test("Date marker with week delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 30),
        date1 = new Date(2011, 6, 7),
        date2 = new Date(2011, 6, 14);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "week";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "July");
    assert.equal(texts.lastCall.args[0], "June");
});

QUnit.test("Date marker with month delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 11, 25, 1, 21, 33),
        date1 = new Date(2012, 2, 25, 1, 21, 33),
        date2 = new Date(2012, 3, 25, 1, 21, 33);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                format: "shortDateShortTime",
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "month";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "1/1/2012, 12:00 AM");
    assert.equal(texts.lastCall.args[0], "12/25/2011, 1:21 AM");
});

QUnit.test("Date marker with quarter delta", function(assert) {
    // arrange
    var date0 = new Date(2011, 11, 25, 1, 21, 33, 123),
        date1 = new Date(2012, 4, 25, 1, 21, 33, 123),
        date2 = new Date(2012, 11, 25, 1, 21, 33, 123);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                format: "shortDate",
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "quarter";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "1/1/2012");
    assert.equal(texts.lastCall.args[0], "12/25/2011");
});

QUnit.test("Date marker with day delta and month boundary tick", function(assert) {
    // arrange
    var date0 = new Date(2011, 5, 25),
        date1 = new Date(2011, 6, 1),
        date2 = new Date(2011, 6, 18);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "day";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    // act
    this.axis.draw(this.canvas);

    // assert
    var texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "July");
    assert.equal(texts.lastCall.args[0], "June");
});

QUnit.test("T448590. If tickInterval is 'year' and markers are visible set marker format to 'year'", function(assert) {
    // arrange
    var date0 = new Date(2010, 0, 1),
        date1 = new Date(2011, 0, 1),
        date2 = new Date(2012, 0, 1);

    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        marker: {
            visible: true,
            separatorHeight: 33,
            textLeftIndent: 5,
            textTopIndent: 11,
            topIndent: 10,
            color: "black",
            width: 2,
            opacity: 0.1,
            label: {
                font: {
                    size: 12,
                    color: "green"
                }
            }
        }
    });

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedTickInterval = "year";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    this.axis.draw(this.canvas);

    // assert
    assert.equal(this.renderer.text.callCount, 3);
    assert.equal(this.renderer.text.getCall(0).args[0], "2010");
    assert.equal(this.renderer.text.getCall(1).args[0], "2011");
    assert.equal(this.renderer.text.getCall(2).args[0], "2012");
});

QUnit.module("XY linear axis. Draw. All elements together, check their layout", environment);

QUnit.test("Horizontal bottom. With date markers, last marker without label", function(assert) {
    // Right order
    // line, ticks
    // constant line labels
    // tick labels
    // marker
    // title

    // arrange
    var date0 = new Date(2011, 5, 25, 21, 0, 0),
        date1 = new Date(2011, 5, 26, 21, 0, 0),
        date2 = new Date(2011, 5, 27, 21, 0, 0),
        date0m = new Date(2011, 5, 26, 3, 0, 0),
        date1m = new Date(2011, 5, 27, 3, 0, 0),
        date01 = new Date(2011, 5, 26, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0);

    var renderer = this.renderer;
    this.createAxis({ isArgumentAxis: true });
    this.updateOptions({
        isHorizontal: true,
        argumentType: "datetime",
        position: "bottom",
        visible: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        },
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        },
        constantLines: [{
            value: date01,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }, {
            value: date02,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }],
        label: {
            visible: true,
            indentFromAxis: 11,
            alignment: "left"
        },
        marker: {
            visible: true,
            topIndent: 12,
            textLeftIndent: 5,
            textTopIndent: 5,
            separatorHeight: 33,
            width: 1,
            label: {}
        },
        title: {
            margin: 13,
            text: "Title text"
        }
    });
    this.axis.validate();

    this.axis.setBusinessRange({ min: date0, max: date2, invert: false });

    this.generatedTicks = [date0, date1, date2];
    this.generatedMinorTicks = [date0m, date1m];
    this.generatedTickInterval = "hour";

    this.translator.stub("translate").withArgs(date0).returns(10);
    this.translator.stub("translate").withArgs(date1).returns(50);
    this.translator.stub("translate").withArgs(date2).returns(90);

    this.translator.stub("translate").withArgs(date0m).returns(30);
    this.translator.stub("translate").withArgs(date1m).returns(70);

    this.translator.stub("translate").withArgs(date01).returns(20);
    this.translator.stub("translate").withArgs(date02).returns(80);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 0, y: 0, width: 10, height: 10 },  // title
                { x: 0, y: 0, width: 10, height: 10 }, // tick label
                { x: 0, y: 0, width: 10, height: 11 }, // tick label
                { x: 0, y: 0, width: 10, height: 12 }, // tick label
                { x: 0, y: 0, width: 10, height: 8 }, // constant line label
                { x: 0, y: 0, width: 10, height: 9 }, // constant line label
                { x: 0, y: 0, width: 10, height: 13 }, // marker label
                { x: 0, y: 0, width: 10, height: 14 }, // marker label
                { x: 0, y: 0, width: 10, height: 15 } // marker label
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var path = renderer.path,
        text = renderer.text;

    assert.equal(text.callCount, 9);
    assert.equal(path.callCount, 13);

    assert.deepEqual(text.getCall(4).returnValue.attr.lastCall.args[0], { translateX: 20 - 0 - 10 / 2, translateY: 70 + 9 }, "constant line label");
    assert.deepEqual(text.getCall(5).returnValue.attr.lastCall.args[0], { translateX: 80 - 0 - 10 / 2, translateY: 70 + 9 }, "constant line label");

    var offset = 9 + 9; // constantLine.paddingTopBottom + bbox
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 10 - 0, translateY: 70 + offset + 11 }, "Tick label");
    assert.deepEqual(text.getCall(2).returnValue.attr.lastCall.args[0], { translateX: 50 - 0, translateY: 70 + offset + 11 }, "Tick label");
    assert.deepEqual(text.getCall(3).returnValue.attr.lastCall.args[0], { translateX: 90 - 0, translateY: 70 + offset + 11 }, "Tick label");

    offset = 9 + 9 + 11 + 12; // constantLine.paddingTopBottom + bbox + label.indentFromAxis + bbox
    assert.deepEqual(path.getCall(8).returnValue.attr.lastCall.args[0], { translateY: offset }, "date marker line");
    assert.deepEqual(path.getCall(9).returnValue.attr.lastCall.args[0], { translateY: offset }, "date marker line");
    assert.deepEqual(path.getCall(10).args, [[10, 82 + offset, 10, 115 + offset, 20, 115 + offset, 20, 82 + offset, 10, 82 + offset], "area"], "date marker tracker");
    assert.deepEqual(path.getCall(11).args, [[20, 82 + offset, 20, 115 + offset, 80, 115 + offset, 80, 82 + offset, 20, 82 + offset], "area"], "date marker tracker");
    assert.deepEqual(path.getCall(12).args, [[80, 82 + offset, 80, 115 + offset, 90, 115 + offset, 90, 82 + offset, 80, 82 + offset], "area"], "date marker tracker");

    assert.deepEqual(text.getCall(6).returnValue.attr.lastCall.args[0], { translateX: 20 + 5 + 1 - 0, translateY: 70 + offset + 12 + 5 }, "date marker label");
    assert.deepEqual(text.getCall(7).returnValue.stub("attr").callCount, 0, "date marker label");
    assert.deepEqual(text.getCall(8).returnValue.stub("attr").callCount, 0, "date marker label");

    offset = 9 + 9 + 11 + 12 + 12 + 33; // constantLine.paddingTopBottom + bbox + label.indentFromAxis + bbox + marker.topIndent + separatorHeight
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateY: 70 + offset + 13 }, "Title");
});

QUnit.test("Horizontal top", function(assert) {
    // Right order
    // line, ticks
    // constant line labels
    // tick labels
    // title

    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        visible: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        },
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        },
        constantLines: [{
            value: 2,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }, {
            value: 4,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }],
        label: {
            visible: true,
            indentFromAxis: 11,
            alignment: "left"
        },
        title: {
            margin: 13,
            text: "Title text"
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 5, invert: false });

    this.generatedTicks = [1, 3, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(3).returns(50);
    this.translator.stub("translate").withArgs(5).returns(90);

    this.translator.stub("translate").withArgs(2).returns(30);
    this.translator.stub("translate").withArgs(4).returns(70);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 0, y: 0, width: 10, height: 10 },  // title
                { x: 0, y: 0, width: 10, height: 10 }, // tick label
                { x: 0, y: 0, width: 10, height: 11 }, // tick label
                { x: 0, y: 0, width: 10, height: 12 }, // tick label
                { x: 0, y: 0, width: 10, height: 8 }, // constant line label
                { x: 0, y: 0, width: 10, height: 9 } // constant line label
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var path = renderer.path,
        text = renderer.text;

    assert.equal(text.callCount, 6);
    assert.equal(path.callCount, 8);

    assert.deepEqual(text.getCall(4).returnValue.attr.lastCall.args[0], { translateX: 30 - 0 - 10 / 2, translateY: 30 - 9 - 8 }, "constant line label");
    assert.deepEqual(text.getCall(5).returnValue.attr.lastCall.args[0], { translateX: 70 - 0 - 10 / 2, translateY: 30 - 9 - 9 }, "constant line label");

    var offset = 9 + 9; // constantLine.paddingTopBottom + bbox
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 10 - 0, translateY: 30 - offset - 11 - 10 }, "Tick label");
    assert.deepEqual(text.getCall(2).returnValue.attr.lastCall.args[0], { translateX: 50 - 0, translateY: 30 - offset - 11 - 11 }, "Tick label");
    assert.deepEqual(text.getCall(3).returnValue.attr.lastCall.args[0], { translateX: 90 - 0, translateY: 30 - offset - 11 - 12 }, "Tick label");

    offset = 9 + 9 + 11 + 12; // constantLine.paddingTopBottom + bbox + label.indentFromAxis + bbox
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateY: 30 - offset - 13 - 10 }, "Title");
});

QUnit.test("Vertical left", function(assert) {
    // Right order
    // line, ticks
    // constant line labels
    // tick labels
    // title

    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        visible: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        },
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        },
        constantLines: [{
            value: 2,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test1",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            value: 4,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test2",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }],
        label: {
            visible: true,
            indentFromAxis: 11,
            alignment: "left"
        },
        title: {
            margin: 13,
            text: "Title text"
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 5, invert: false });

    this.generatedTicks = [1, 3, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(50);
    this.translator.stub("translate").withArgs(5).returns(70);

    this.translator.stub("translate").withArgs(2).returns(40);
    this.translator.stub("translate").withArgs(4).returns(60);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 0, y: 0, width: 14, height: 10 },  // title
                { x: 0, y: 0, width: 11, height: 10 }, // tick label
                { x: 0, y: 0, width: 12, height: 10 }, // tick label
                { x: 0, y: 0, width: 13, height: 10 }, // tick label
                { x: 0, y: 0, width: 8, height: 10 }, // constant line label
                { x: 0, y: 0, width: 9, height: 10 } // constant line label
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var path = renderer.path,
        text = renderer.text;

    assert.equal(text.callCount, 6);
    assert.equal(path.callCount, 8);

    assert.deepEqual(text.getCall(4).returnValue.attr.lastCall.args[0], { translateX: 10 - 10 - 8, translateY: 40 - 10 / 2 }, "constant line label");
    assert.deepEqual(text.getCall(5).returnValue.attr.lastCall.args[0], { translateX: 10 - 10 - 9, translateY: 60 - 10 / 2 }, "constant line label");

    var offset = 10 + 9; // constantLine.paddingLeftRight + bbox
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 10 - 11 - offset - 13, translateY: 30 - 10 / 2 }, "Tick label");
    assert.deepEqual(text.getCall(2).returnValue.attr.lastCall.args[0], { translateX: 10 - 11 - offset - 13, translateY: 50 - 10 / 2 }, "Tick label");
    assert.deepEqual(text.getCall(3).returnValue.attr.lastCall.args[0], { translateX: 10 - 11 - offset - 13, translateY: 70 - 10 / 2 }, "Tick label");

    offset = 10 + 9 + 11 + 13; // constantLine.paddingLeftRight + bbox + label.indentFromAxis + bbox
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 - 13 - offset - 14 }, "Title");
});

QUnit.test("Vertical right", function(assert) {
    // Right order
    // line, ticks
    // constant line labels
    // tick labels
    // title

    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "right",
        visible: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 8
        },
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        },
        constantLines: [{
            value: 2,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test1",
                horizontalAlignment: "right",
                verticalAlignment: "top"
            }
        }, {
            value: 4,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test2",
                horizontalAlignment: "right",
                verticalAlignment: "top"
            }
        }],
        label: {
            visible: true,
            indentFromAxis: 11,
            alignment: "left"
        },
        title: {
            margin: 13,
            text: "Title text"
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 5, invert: false });

    this.generatedTicks = [1, 3, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(50);
    this.translator.stub("translate").withArgs(5).returns(70);

    this.translator.stub("translate").withArgs(2).returns(40);
    this.translator.stub("translate").withArgs(4).returns(60);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 0, y: 0, width: 14, height: 10 },  // title
                { x: 0, y: 0, width: 11, height: 10 }, // tick label
                { x: 0, y: 0, width: 12, height: 10 }, // tick label
                { x: 0, y: 0, width: 13, height: 10 }, // tick label
                { x: 0, y: 0, width: 8, height: 10 }, // constant line label
                { x: 0, y: 0, width: 9, height: 10 } // constant line label
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var path = renderer.path,
        text = renderer.text;

    assert.equal(text.callCount, 6);
    assert.equal(path.callCount, 8);

    assert.deepEqual(text.getCall(4).returnValue.attr.lastCall.args[0], { translateX: 90 + 10, translateY: 40 - 10 / 2 }, "constant line label");
    assert.deepEqual(text.getCall(5).returnValue.attr.lastCall.args[0], { translateX: 90 + 10, translateY: 60 - 10 / 2 }, "constant line label");

    var offset = 10 + 9; // constantLine.paddingLeftRight + bbox
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 90 + 11 + offset, translateY: 30 - 10 / 2 }, "Tick label");
    assert.deepEqual(text.getCall(2).returnValue.attr.lastCall.args[0], { translateX: 90 + 11 + offset, translateY: 50 - 10 / 2 }, "Tick label");
    assert.deepEqual(text.getCall(3).returnValue.attr.lastCall.args[0], { translateX: 90 + 11 + offset, translateY: 70 - 10 / 2 }, "Tick label");

    offset = 10 + 9 + 11 + 13; // constantLine.paddingLeftRight + bbox + label.indentFromAxis + bbox
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 90 + 13 + offset }, "Title");
});

QUnit.test("Horizontal. Constant line labels on both sides - labels on opposite do not produce offset", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        visible: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        },
        constantLines: [{
            value: 2,
            paddingTopBottom: 14,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }, {
            value: 4,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }],
        label: {
            visible: true,
            indentFromAxis: 11,
            alignment: "left"
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 5, invert: false });

    this.generatedTicks = [1, 3, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(3).returns(50);
    this.translator.stub("translate").withArgs(5).returns(90);

    this.translator.stub("translate").withArgs(2).returns(30);
    this.translator.stub("translate").withArgs(4).returns(70);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 0, y: 0, width: 10, height: 10 }, // tick label
                { x: 0, y: 0, width: 10, height: 11 }, // tick label
                { x: 0, y: 0, width: 10, height: 12 }, // tick label
                { x: 0, y: 0, width: 10, height: 15 }, // constant line label
                { x: 0, y: 0, width: 10, height: 11 } // constant line label
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var path = renderer.path,
        text = renderer.text;

    assert.equal(text.callCount, 5);
    assert.equal(path.callCount, 6);

    assert.deepEqual(text.getCall(3).returnValue.attr.lastCall.args[0], { translateX: 30 - 10 / 2, translateY: 30 - 14 - (0 + 15) }, "constant line label");
    assert.deepEqual(text.getCall(4).returnValue.attr.lastCall.args[0], { translateX: 70 - 10 / 2, translateY: 70 + 9 }, "constant line label");

    var offset = 9 + 11; // constantLine.paddingTopBottom + bbox
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 - 0, translateY: 70 + offset + 11 }, "Tick label");
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 50 - 0, translateY: 70 + offset + 11 }, "Tick label");
    assert.deepEqual(text.getCall(2).returnValue.attr.lastCall.args[0], { translateX: 90 - 0, translateY: 70 + offset + 11 }, "Tick label");
});

QUnit.test("Vertical. Constant line labels on both sides - labels on opposite do not produce offset", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        visible: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        },
        constantLines: [{
            value: 2,
            paddingTopBottom: 14,
            paddingLeftRight: 14,
            label: {
                position: "outside",
                visible: true,
                text: "test1",
                horizontalAlignment: "right",
                verticalAlignment: "top"
            }
        }, {
            value: 4,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test2",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }],
        label: {
            visible: true,
            indentFromAxis: 11,
            alignment: "right"
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 5, invert: false });

    this.generatedTicks = [1, 3, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(50);
    this.translator.stub("translate").withArgs(5).returns(70);

    this.translator.stub("translate").withArgs(2).returns(40);
    this.translator.stub("translate").withArgs(4).returns(60);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 0, y: 0, width: 10, height: 10 }, // tick label
                { x: 0, y: 0, width: 11, height: 10 }, // tick label
                { x: 0, y: 0, width: 12, height: 10 }, // tick label
                { x: 0, y: 0, width: 15, height: 10 }, // constant line label
                { x: 0, y: 0, width: 11, height: 10 } // constant line label
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var path = renderer.path,
        text = renderer.text;

    assert.equal(text.callCount, 5);
    assert.equal(path.callCount, 6);

    assert.deepEqual(text.getCall(3).returnValue.attr.lastCall.args[0], { translateX: 90 + 14, translateY: 40 - 10 / 2 }, "constant line label");
    assert.deepEqual(text.getCall(4).returnValue.attr.lastCall.args[0], { translateX: 10 - 10 - 11, translateY: 60 - 10 / 2 }, "constant line label");

    var offset = 10 + 11; // constantLine.paddingTopBottom + bbox
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 - offset - 11 - 10, translateY: 30 - 10 / 2 }, "Tick label");
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 10 - offset - 11 - 11, translateY: 50 - 10 / 2 }, "Tick label");
    assert.deepEqual(text.getCall(2).returnValue.attr.lastCall.args[0], { translateX: 10 - offset - 11 - 12, translateY: 70 - 10 / 2 }, "Tick label");
});

QUnit.test("Horizontal. All constant line labels on opposite side - do not produce offset", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        visible: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        },
        constantLines: [{
            value: 2,
            paddingTopBottom: 14,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }, {
            value: 4,
            paddingTopBottom: 9,
            paddingLeftRight: 10,
            label: {
                position: "outside",
                visible: true,
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }],
        label: {
            visible: true,
            indentFromAxis: 11,
            alignment: "left"
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 5, invert: false });

    this.generatedTicks = [1, 3, 5];
    this.generatedMinorTicks = [2, 4];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(3).returns(50);
    this.translator.stub("translate").withArgs(5).returns(90);

    this.translator.stub("translate").withArgs(2).returns(30);
    this.translator.stub("translate").withArgs(4).returns(70);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 0, y: 0, width: 10, height: 10 }, // tick label
                { x: 0, y: 0, width: 10, height: 11 }, // tick label
                { x: 0, y: 0, width: 10, height: 12 }, // tick label
                { x: 0, y: 0, width: 10, height: 15 }, // constant line label
                { x: 0, y: 0, width: 10, height: 11 } // constant line label
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    var path = renderer.path,
        text = renderer.text;

    assert.equal(text.callCount, 5);
    assert.equal(path.callCount, 6);

    assert.deepEqual(text.getCall(3).returnValue.attr.lastCall.args[0], { translateX: 30 - 10 / 2, translateY: 30 - 14 - (0 + 15) }, "constant line label");
    assert.deepEqual(text.getCall(4).returnValue.attr.lastCall.args[0], { translateX: 70 - 10 / 2, translateY: 30 - 9 - (0 + 11) }, "constant line label");

    var offset = 0; // there is o constant line labels on axis side
    assert.deepEqual(text.getCall(0).returnValue.attr.lastCall.args[0], { translateX: 10 - 0, translateY: 70 + offset + 11 }, "Tick label");
    assert.deepEqual(text.getCall(1).returnValue.attr.lastCall.args[0], { translateX: 50 - 0, translateY: 70 + offset + 11 }, "Tick label");
    assert.deepEqual(text.getCall(2).returnValue.attr.lastCall.args[0], { translateX: 90 - 0, translateY: 70 + offset + 11 }, "Tick label");
});

QUnit.module("XY linear axis. Draw. Grid lines", environment);

QUnit.test("Horizontal. Major grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        group = this.renderer.g.getCall(2).returnValue;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[30, 30, 30, 70], "line"]);
    assert.deepEqual(path.getCall(1).args, [[50, 30, 50, 70], "line"]);
    assert.deepEqual(path.getCall(2).args, [[70, 30, 70, 70], "line"]);
    assert.deepEqual(path.getCall(0).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(1).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(2).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });

    assert.deepEqual(path.getCall(0).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(path.getCall(1).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(path.getCall(2).returnValue.append.getCall(0).args[0], group);
});

QUnit.test("Horizontal. Minor grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        minorGrid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedMinorTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path,
        group = this.renderer.g.getCall(2).returnValue;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[30, 30, 30, 70], "line"]);
    assert.deepEqual(path.getCall(1).args, [[50, 30, 50, 70], "line"]);
    assert.deepEqual(path.getCall(2).args, [[70, 30, 70, 70], "line"]);
    assert.deepEqual(path.getCall(0).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(1).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });
    assert.deepEqual(path.getCall(2).returnValue.attr.args[0][0], { stroke: "#123456", "stroke-width": 5, "stroke-opacity": 0.3 });

    assert.deepEqual(path.getCall(0).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(path.getCall(1).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(path.getCall(2).returnValue.append.getCall(0).args[0], group);
});

QUnit.test("Vertical. Major grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).args, [[10, 40, 90, 40], "line"]);
    assert.deepEqual(path.getCall(1).args, [[10, 50, 90, 50], "line"]);
    assert.deepEqual(path.getCall(2).args, [[10, 60, 90, 60], "line"]);
});

QUnit.test("Vertical. Major grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        minorGrid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedMinorTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).args, [[10, 40, 90, 40], "line"]);
    assert.deepEqual(path.getCall(1).args, [[10, 50, 90, 50], "line"]);
    assert.deepEqual(path.getCall(2).args, [[10, 60, 90, 60], "line"]);
});

QUnit.test("Horizontal. Borders are not visible. Boundary grids are visible", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(2).returns(90);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
});

QUnit.test("Horizontal. Left border visible. Left grid is NOT visible", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(90);

    // act
    this.axis.draw(this.canvas, { visible: true, left: true, right: false });

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).args, [[50, 30, 50, 70], "line"]);
    assert.deepEqual(path.getCall(1).args, [[90, 30, 90, 70], "line"]);
});

QUnit.test("Horizontal. Right border visible. Right grid is NOT visible", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(90);

    // act
    this.axis.draw(this.canvas, { visible: true, left: false, right: true });

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).args, [[10, 30, 10, 70], "line"]);
    assert.deepEqual(path.getCall(1).args, [[50, 30, 50, 70], "line"]);
});

QUnit.test("Horizontal. Left and right borders are visible. Distance between grids and borders 4px - draw grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(14);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(86);

    // act
    this.axis.draw(this.canvas, { visible: true, left: true, right: true });

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[14, 30, 14, 70], "line"]);
    assert.deepEqual(path.getCall(1).args, [[50, 30, 50, 70], "line"]);
    assert.deepEqual(path.getCall(2).args, [[86, 30, 86, 70], "line"]);
});

QUnit.test("Horizontal. Left and right borders are visible. Distance between grids and borders less than 4px - do not draw boundary grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(13);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(87);

    // act
    this.axis.draw(this.canvas, { visible: true, left: true, right: true });

    var path = this.renderer.path;
    assert.equal(path.callCount, 1);
    assert.deepEqual(path.getCall(0).args, [[50, 30, 50, 70], "line"]);
});

QUnit.test("Vertical. Borders are not visible. Boundary grids are visible", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(70);

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
});

QUnit.test("Vertical. Top border visible. Top grid is NOT visible", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(10);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(90);

    // act
    this.axis.draw(this.canvas, { visible: true, top: true, bottom: false });

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).args, [[10, 50, 90, 50], "line"]);
    assert.deepEqual(path.getCall(1).args, [[10, 90, 90, 90], "line"]);
});

QUnit.test("Vertical. Bottom border visible. Bottom grid is NOT visible", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.draw(this.canvas, { visible: true, top: false, bottom: true });

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
    assert.deepEqual(path.getCall(0).args, [[10, 30, 90, 30], "line"]);
    assert.deepEqual(path.getCall(1).args, [[10, 50, 90, 50], "line"]);
});

QUnit.test("Vertical. Top and bottom borders are visible. Distance between grids and borders 4px - draw grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(34);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(66);

    // act
    this.axis.draw(this.canvas, { visible: true, top: true, bottom: true });

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[10, 34, 90, 34], "line"]);
    assert.deepEqual(path.getCall(1).args, [[10, 50, 90, 50], "line"]);
    assert.deepEqual(path.getCall(2).args, [[10, 66, 90, 66], "line"]);
});

QUnit.test("Vertical. Top and bottom borders are visible. Distance between grids and borders less than 4px - do not draw boundary grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "left",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(33);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(67);

    // act
    this.axis.draw(this.canvas, { visible: true, top: true, bottom: true });

    var path = this.renderer.path;
    assert.equal(path.callCount, 1);
    assert.deepEqual(path.getCall(0).args, [[10, 50, 90, 50], "line"]);
});

QUnit.test("Categories. DiscreteAxisDivisionMode - betweenLabels. Do not draw last grid line", function(assert) {
    // arrange
    var categories = ["a", "b", "c", "d"];
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "top",
        categories: categories,
        discreteAxisDivisionMode: "betweenLabels",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.axis.setBusinessRange({ categories: categories });

    this.generatedTicks = categories;

    categories.forEach(function(cat, i) {
        this.translator.stub("translate").withArgs(cat).returns(10 + (i + 1) * 20);
    }.bind(this));

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 3);
    assert.deepEqual(path.getCall(0).args, [[30, 30, 30, 70], "line"]);
    assert.deepEqual(path.getCall(1).args, [[50, 30, 50, 70], "line"]);
    assert.deepEqual(path.getCall(2).args, [[70, 30, 70, 70], "line"]);
});

QUnit.test("Categories. DiscreteAxisDivisionMode - crossLabels. Draw all grid lines", function(assert) {
    // arrange
    var categories = ["a", "b", "c", "d"];
    this.createAxis();
    this.updateOptions({
        type: "discrete",
        isHorizontal: true,
        position: "top",
        categories: categories,
        discreteAxisDivisionMode: "crossLabels",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.axis.setBusinessRange({ categories: categories });

    this.generatedTicks = categories;

    categories.forEach(function(cat, i) {
        this.translator.stub("translate").withArgs(cat).returns(10 + (i + 1) * 20 - 10);
    }.bind(this));

    // act
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 4);
    assert.deepEqual(path.getCall(0).args, [[20, 30, 20, 70], "line"]);
    assert.deepEqual(path.getCall(1).args, [[40, 30, 40, 70], "line"]);
    assert.deepEqual(path.getCall(2).args, [[60, 30, 60, 70], "line"]);
    assert.deepEqual(path.getCall(3).args, [[80, 30, 80, 70], "line"]);
});

QUnit.module("XY linear axis. Draw. Strips", environment);

QUnit.test("Horizontal axis. Full strips", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111"
        }, {
            startValue: 6,
            endValue: 8,
            color: "#222222"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 2);
    assert.deepEqual(renderer.rect.getCall(0).args, [20, 30, 20, 40], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#111111" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [60, 30, 30, 40], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#222222" }, "args");

    var group = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(renderer.rect.getCall(0).returnValue.append.getCall(0).args[0], group);
});

QUnit.test("Vertical axis. Full strips", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111"
        }, {
            startValue: 5,
            endValue: 8,
            color: "#222222"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(8).returns(35);
    this.translator.stub("translate").withArgs(5).returns(40);
    this.translator.stub("translate").withArgs(4).returns(50);
    this.translator.stub("translate").withArgs(2).returns(60);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 2);
    assert.deepEqual(renderer.rect.getCall(0).args, [10, 50, 80, 10], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#111111" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [10, 35, 80, 5], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#222222" }, "args");
});

QUnit.test("Horizontal axis. Strips without start/end value", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            endValue: 4,
            color: "#111111"
        }, {
            startValue: 5,
            color: "#222222"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(5).returns(50);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 2);
    assert.deepEqual(renderer.rect.getCall(0).args, [10, 30, 30, 40], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#111111" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [50, 30, 40, 40], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#222222" }, "args");
});

QUnit.test("Vertical axis. Strips without start/end value", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            endValue: 4,
            color: "#111111"
        }, {
            startValue: 5,
            color: "#222222"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(4).returns(50);
    this.translator.stub("translate").withArgs(5).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 2);
    assert.deepEqual(renderer.rect.getCall(0).args, [10, 50, 80, 20], "points");
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0], { fill: "#111111" }, "args");

    assert.deepEqual(renderer.rect.getCall(1).args, [10, 30, 80, 10], "points");
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0], { fill: "#222222" }, "args");
});

QUnit.test("Horizontal axis. Without color", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4
        }, {
            startValue: 6,
            endValue: 8
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("rect").callCount, 0);
});

QUnit.test("Horizontal axis. Some strips out of bounds, some strips partially out of bounds", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: -3,
            endValue: -2,
            color: "red"
        }, {
            startValue: -1,
            endValue: 1,
            color: "red"
        }, {
            startValue: 9,
            endValue: 11,
            color: "red"
        }, {
            startValue: 12,
            endValue: 13,
            color: "red"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(-3).returns(null);
    this.translator.stub("translate").withArgs(-2).returns(null);
    this.translator.stub("translate").withArgs(-1).returns(null);
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(9).returns(50);
    this.translator.stub("translate").withArgs(11).returns(null);
    this.translator.stub("translate").withArgs(12).returns(null);
    this.translator.stub("translate").withArgs(13).returns(null);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 2);
    assert.deepEqual(renderer.rect.getCall(0).args, [10, 30, 20, 40], "points");
    assert.deepEqual(renderer.rect.getCall(1).args, [50, 30, 40, 40], "points");
});

QUnit.test("Vertical axis. Some strips out of bounds, some strips partially out of bounds", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: -3,
            endValue: -2,
            color: "red"
        }, {
            startValue: -1,
            endValue: 1,
            color: "red"
        }, {
            startValue: 9,
            endValue: 11,
            color: "red"
        }, {
            startValue: 12,
            endValue: 13,
            color: "red"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(-3).returns(null);
    this.translator.stub("translate").withArgs(-2).returns(null);
    this.translator.stub("translate").withArgs(-1).returns(null);
    this.translator.stub("translate").withArgs(1).returns(50);
    this.translator.stub("translate").withArgs(9).returns(40);
    this.translator.stub("translate").withArgs(11).returns(null);
    this.translator.stub("translate").withArgs(12).returns(null);
    this.translator.stub("translate").withArgs(13).returns(null);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 2);
    assert.deepEqual(renderer.rect.getCall(0).args, [10, 50, 80, 20], "points");
    assert.deepEqual(renderer.rect.getCall(1).args, [10, 30, 80, 10], "points");
});

QUnit.test("Horizontal axis. End value > start value", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 4,
            endValue: 2,
            color: "#111111"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 1);
    assert.deepEqual(renderer.rect.getCall(0).args, [20, 30, 20, 40], "points");
});

QUnit.test("Vertical axis. End value > start value", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 4,
            endValue: 2,
            color: "#111111"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(35);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(5).returns(50);
    this.translator.stub("translate").withArgs(8).returns(60);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 1);
    assert.deepEqual(renderer.rect.getCall(0).args, [10, 35, 80, 5], "points");
});

QUnit.test("Strips on categories", function(assert) {
    // arrange
    var renderer = this.renderer,
        categories = ["one", "two", "three"];
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        categories: categories,
        strips: [{
            startValue: "two",
            endValue: "three",
            color: "#111111"
        }]
    });

    this.axis.setBusinessRange({ categories: categories });
    this.translator.stub("translate").withArgs("two", -1).returns(20);
    this.translator.stub("translate").withArgs("three", 1).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 1);
    assert.deepEqual(renderer.rect.getCall(0).args, [20, 30, 20, 40], "points");
});

QUnit.test("Strips on categories, startValue > endValue", function(assert) {
    // arrange
    var renderer = this.renderer,
        categories = ["one", "two", "three"];
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        categories: categories,
        strips: [{
            startValue: "three",
            endValue: "two",
            color: "#111111"
        }]
    });

    this.axis.setBusinessRange({ categories: categories });
    this.translator.stub("translate").withArgs("two", -1).returns(20);
    this.translator.stub("translate").withArgs("three", 1).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 1);
    assert.deepEqual(renderer.rect.getCall(0).args, [20, 30, 20, 40], "points");
});

QUnit.test("Strips on categories, no such categories - strip is not drawn", function(assert) {
    // arrange
    var renderer = this.renderer,
        categories = ["one", "two", "three"];
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        categories: categories,
        strips: [{
            startValue: "some1",
            endValue: "some2",
            color: "#111111"
        }]
    });

    this.axis.setBusinessRange({ categories: categories });
    this.translator.stub("translate").withArgs("two", -1).returns(20);
    this.translator.stub("translate").withArgs("three", 1).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("rect").callCount, 0);
});

QUnit.test("Strips on categories, datetime type", function(assert) {
    // arrange
    var renderer = this.renderer,
        categories = [new Date(2017, 4, 5), new Date(2017, 4, 7)];
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        categories: categories,
        strips: [{
            startValue: new Date(2017, 4, 5),
            endValue: new Date(2017, 4, 7),
            color: "#111111"
        }]
    });

    this.axis.setBusinessRange({ categories: categories });
    this.translator.stub("translate").withArgs(new Date(2017, 4, 5), -1).returns(20);
    this.translator.stub("translate").withArgs(new Date(2017, 4, 7), 1).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.rect.callCount, 1);
    assert.deepEqual(renderer.rect.getCall(0).args, [20, 30, 20, 40], "points");
});

QUnit.test("Stub data - do not create strips", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 4,
            endValue: 2,
            color: "#111111"
        }]
    });

    this.axis.setBusinessRange({
        stubData: true,
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.stub("rect").callCount, 0);
});

QUnit.module("XY linear axis. Draw. Strip labels", environment);

QUnit.test("Styles and attributes", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test1",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                font: {
                    color: "#222222",
                    size: 15,
                    family: "Tahoma1",
                    weight: 400
                }
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test2",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                font: {
                    color: "#444444",
                    size: 17,
                    family: "Tahoma2",
                    weight: 700
                }
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };
    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args[0], "test1", "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.css.getCall(0).args[0], {
        fill: "#222222",
        "font-family": "Tahoma1",
        "font-size": 15,
        "font-weight": 400
    }, "css");

    assert.deepEqual(renderer.text.getCall(1).args[0], "test2", "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.css.getCall(0).args[0], {
        fill: "#444444",
        "font-family": "Tahoma2",
        "font-size": 17,
        "font-weight": 700
    }, "css");

    var group = this.renderer.g.getCall(9).returnValue;
    assert.deepEqual(renderer.text.getCall(0).returnValue.append.getCall(0).args[0], group);
    assert.deepEqual(renderer.text.getCall(1).returnValue.append.getCall(0).args[0], group);
});

QUnit.test("Horizontal axis. Horizontal alignment - center, Vertical alignment - top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 20 + 10, 30], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ translateX: 20 + 10 - 1 - 12 / 2, translateY: 30 + 7 - 2 }]);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60 + 15, 30], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args, [{ translateX: 60 + 15 - 3 - 14 / 2, translateY: 30 + 5 - 4 }]);
});

QUnit.test("Horizontal axis. Horizontal alignment - center, Vertical alignment - center", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "center"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "center"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 20 + 10, 50], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ translateX: 20 + 10 - 1 - 12 / 2, translateY: 30 + (70 - 30) / 2 - 2 - 6 / 2 }]);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60 + 15, 50], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args, [{ translateX: 60 + 15 - 3 - 14 / 2, translateY: 30 + (70 - 30) / 2 - 4 - 8 / 2 }]);
});

QUnit.test("Horizontal axis. Horizontal alignment - center, Vertical alignment - bottom", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 20 + 10, 70], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ translateX: 20 + 10 - 1 - 12 / 2, translateY: 70 - 7 - 2 - 6 }]);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60 + 15, 70], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args, [{ translateX: 60 + 15 - 3 - 14 / 2, translateY: 70 - 5 - 4 - 8 }]);
});

QUnit.test("Horizontal axis. Horizontal alignment - left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 20, 30], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0].translateX, 20 + 8 - 1);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 60, 30], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0].translateX, 60 + 6 - 3);
});

QUnit.test("Horizontal axis. Horizontal alignment - right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "right",
                verticalAlignment: "top"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "right",
                verticalAlignment: "top"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 40, 30], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0].translateX, 20 + 20 - 8 - 1 - 12);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 90, 30], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0].translateX, 60 + 30 - 6 - 3 - 14);
});

QUnit.test("Vertical axis. Vertical alignment - center, Horizontal alignment - left", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "left",
                verticalAlignment: "center"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(35);
    this.translator.stub("translate").withArgs(4).returns(45);
    this.translator.stub("translate").withArgs(6).returns(50);
    this.translator.stub("translate").withArgs(8).returns(70);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 10, 40], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ translateX: 10 + 8 - 1, translateY: 35 + (45 - 35) / 2 - 2 - 6 / 2 }]);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 10, 60], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args, [{ translateX: 10 + 6 - 3, translateY: 50 + (70 - 50) / 2 - 4 - 8 / 2 }]);
});

QUnit.test("Vertical axis. Vertical alignment - center, Horizontal alignment - center", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "center"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "center"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(35);
    this.translator.stub("translate").withArgs(4).returns(45);
    this.translator.stub("translate").withArgs(6).returns(50);
    this.translator.stub("translate").withArgs(8).returns(70);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 50, 40], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ translateX: 10 + (90 - 10) / 2 - 1 - 12 / 2, translateY: 35 + (45 - 35) / 2 - 2 - 6 / 2 }]);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 50, 60], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args, [{ translateX: 10 + (90 - 10) / 2 - 3 - 14 / 2, translateY: 50 + (70 - 50) / 2 - 4 - 8 / 2 }]);
});

QUnit.test("Vertical axis. Vertical alignment - center, Horizontal alignment - right", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "right",
                verticalAlignment: "center"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "right",
                verticalAlignment: "center"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(35);
    this.translator.stub("translate").withArgs(4).returns(45);
    this.translator.stub("translate").withArgs(6).returns(50);
    this.translator.stub("translate").withArgs(8).returns(70);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 90, 40], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ translateX: 90 - 8 - 1 - 12, translateY: 35 + (45 - 35) / 2 - 2 - 6 / 2 }]);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 90, 60], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args, [{ translateX: 90 - 6 - 3 - 14, translateY: 50 + (70 - 50) / 2 - 4 - 8 / 2 }]);
});

QUnit.test("Vertical axis. Vertical alignment - top", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(35);
    this.translator.stub("translate").withArgs(4).returns(45);
    this.translator.stub("translate").withArgs(6).returns(50);
    this.translator.stub("translate").withArgs(8).returns(70);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 10, 35], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0].translateY, 35 + 7 - 2);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 10, 50], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0].translateY, 50 + 5 - 4);
});

QUnit.test("Vertical axis. Vertical alignment - bottom", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "left",
                verticalAlignment: "bottom"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(35);
    this.translator.stub("translate").withArgs(4).returns(45);
    this.translator.stub("translate").withArgs(6).returns(50);
    this.translator.stub("translate").withArgs(8).returns(70);
    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 },
                { x: 3, y: 4, width: 14, height: 8 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).args, ["test1", 10, 45], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0].translateY, 45 - 7 - 2 - 6);

    assert.deepEqual(renderer.text.getCall(1).args, ["test2", 10, 70], "args");
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0].translateY, 70 - 5 - 4 - 8);
});

QUnit.test("T441890. First strip is small and without label, second without label, third with label", function(assert) {
    // arrange
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

    this.axis.setBusinessRange({
        min: 0,
        max: 100
    });

    this.translator.stub("translate").withArgs(0).returns(30);
    this.translator.stub("translate").withArgs(0.01).returns(30);
    this.translator.stub("translate").withArgs(10).returns(40);
    this.translator.stub("translate").withArgs(20).returns(50);

    this.axis.parser = function(value) {
        return value;
    };

    this.renderer.bBoxTemplate = (function() {
        var idx = 0;
        return function() {
            return [
                { x: 1, y: 2, width: 12, height: 6 }
            ][idx++];
        };
    })();

    // act
    this.axis.draw(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).args, ["test", 10, 45], "args");
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ translateX: 10 + 10 - 1, translateY: 40 + (50 - 40) / 2 - 2 - 6 / 2 }]);
});

QUnit.module("XY linear axis. Get margins", $.extend(true, {}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.createAxis();

        this.renderer.bBoxTemplate = { x: 0, y: 0, width: 0, height: 0, isEmpty: true };

        this.gridCorrectionCanvas = {
            left: 1,
            right: 1,
            top: 1,
            bottom: 1,
            width: 1000,
            height: 800
        };
    },
    afterEach: function() {
        environment.afterEach.call(this);
    }
}));

QUnit.test("Horizontal without any elements", function(assert) {
    // arrange
    this.updateOptions({
        label: {
            visible: false
        }
    });
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.top, 0, "right");
});

QUnit.test("Horizontal with labels", function(assert) {
    // arrange
    var renderer = this.renderer;

    this.updateOptions({});

    renderer.g.getCall(3).returnValue.getBBox = sinon.stub().returns({ x: -10, y: 80, width: 130, height: 40 }); // elements (labels) group
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 50, "bottom");
    assert.strictEqual(margins.left, 20, "left");
    assert.strictEqual(margins.right, 30, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Horizontal with crosshairMargin", function(assert) {
    // arrange
    var renderer = this.renderer;

    this.updateOptions({
        isHorizontal: false,
        position: "right",
        crosshairMargin: 7
    });

    renderer.g.getCall(3).returnValue.getBBox = sinon.stub().returns({ x: -10, y: 80, width: 130, height: 40 }); // elements (labels) group
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 50, "bottom");
    assert.strictEqual(margins.left, 20, "left");
    assert.strictEqual(margins.right, 37, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Horizontal with title that is less that canvas", function(assert) {
    // arrange
    var renderer = this.renderer;

    this.updateOptions({
        title: "Title text",
    });
    renderer.g.getCall(5).returnValue.getBBox = sinon.stub().returns({ x: 30, y: 90, width: 30, height: 50 });// title group
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 70, "bottom");
    assert.strictEqual(margins.top, 0, "top");

    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.left, 0, "left");
});

QUnit.test("Horizontal with title that is more that canvas", function(assert) {
    // arrange
    var renderer = this.renderer;

    this.updateOptions({
        title: "Title text",

    });
    renderer.g.getCall(5).returnValue.getBBox = sinon.stub().returns({ x: 0, y: 90, width: 100, height: 50 });// title group
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 70, "bottom");
    assert.strictEqual(margins.top, 0, "top");

    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.left, 0, "left");
});

QUnit.test("Vertical with title that is less that canvas", function(assert) {
    // arrange
    var renderer = this.renderer;

    this.updateOptions({
        title: "Title text",
        isHorizontal: false,
        position: "right"
    });
    renderer.g.getCall(5).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 35, width: 30, height: 30 });// title group
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.top, 0, "top");

    assert.strictEqual(margins.right, 40, "right");
    assert.strictEqual(margins.left, 0, "left");
});

QUnit.test("Vertical with title that is more that canvas", function(assert) {
    // arrange
    var renderer = this.renderer;

    this.updateOptions({
        title: "Title text",
        isHorizontal: false,
        position: "right"
    });
    renderer.g.getCall(5).returnValue.getBBox = sinon.stub().returns({ x: 100, y: 0, width: 30, height: 100 });// title group
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.top, 0, "top");

    assert.strictEqual(margins.right, 40, "right");
    assert.strictEqual(margins.left, 0, "left");
});

QUnit.test("Horizontal with placeholderSize", function(assert) {
    // arrange
    var renderer = this.renderer;

    this.updateOptions({
        title: "Title text",
        placeholderSize: 35
    });
    renderer.g.getCall(3).returnValue.getBBox = sinon.stub().returns({ x: -10, y: 80, width: 130, height: 40 }); // elements (labels) group
    renderer.g.getCall(5).returnValue.getBBox = sinon.stub().returns({ x: 30, y: 90, width: 30, height: 50 });// title group
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 35, "bottom");
    assert.strictEqual(margins.left, 20, "left");
    assert.strictEqual(margins.right, 30, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Axis with constant lines with ouside labels", function(assert) {
    // arrange
    this.updateOptions({
        title: "Title text",
        argumentType: "datetime",
        isHorizontal: true,
        position: "bottom",
        constantLines: [{
            value: 0,
            label: {
                text: "text",
                position: "outside",
                visible: true,
                verticalAlignment: "top"
            }
        }, {
            value: 0,
            label: {
                text: "text",
                position: "outside",
                visible: false
            }
        }, {
            value: 0,
            label: {
                text: "text",
                position: "outside",
                visible: true,
                verticalAlignment: "top"
            }
        },
        {
            value: 0,
            label: {
                text: "text",
                position: "inside",
                visible: true
            }
        },
        {
            value: 0,
            label: {
                text: "text",
                position: "outside",
                visible: true,
                verticalAlignment: "bottom"
            }
        }]
    });

    this.translator.stub("translate").returns(50);
    this.axis.parser = function() {
        return 0;
    };
    this.axis.draw(this.canvas);

    this.renderer.g.getCall(7).returnValue.getBBox = sinon.stub().returns({ x: -10, y: 20, width: 120, height: 20 });
    this.renderer.g.getCall(8).returnValue.getBBox = sinon.stub().returns({ x: 10, y: 80, width: 10, height: 30 });

    // act
    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 40, "bottom");
    assert.strictEqual(margins.left, 20, "left");
    assert.strictEqual(margins.right, 20, "right");
    assert.strictEqual(margins.top, 10, "top");
});

QUnit.test("Constant line with invisible label", function(assert) {
    // arrange
    this.updateOptions({
        title: "Title text",
        argumentType: "datetime",
        constantLines: [{
            value: 0,
            label: {
                text: "text",
                visible: false
            }
        }]
    });

    this.translator.stub("translate").returns(50);
    this.axis.parser = function() {
        return 0;
    };
    this.axis.draw(this.canvas);
    // act
    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Add correction to right margin for grid width if right is less than grid width. Horizontal axis", function(assert) {
    // arrange
    this.updateOptions({
        grid: {
            visible: true,
            width: 3
        },
        tick: {
            visible: true,
            width: 2
        },
        label: {
            visible: false
        }
    });
    // act
    this.axis.draw(this.gridCorrectionCanvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 3, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Add correction to right margin for grid width if right is less than tick width. Horizontal axis", function(assert) {
    // arrange
    this.updateOptions({
        grid: {
            visible: true,
            width: 3
        },
        label: {
            visible: false
        },
        tick: {
            visible: true,
            width: 5
        },
    });
    // act
    this.axis.draw(this.gridCorrectionCanvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 5, "right");
    assert.strictEqual(margins.top, 0, "top");
});


QUnit.test("Do not add correction to right margin for grid width if right margin is greter than grid width. Horizontal axis", function(assert) {
    // arrange
    this.updateOptions({
        grid: {
            visible: true,
            width: 3
        },
        label: {
            visible: false
        }
    });
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Add correction to top margin for grid width if top margin is less than grid width. Vertical axis", function(assert) {
    // arrange
    this.updateOptions({
        grid: {
            visible: true,
            width: 3
        },
        label: {
            visible: false
        },
        isHorizontal: false
    });
    // act
    this.axis.draw(this.gridCorrectionCanvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 3, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Do not add correction to top margin for grid width if top margin is greter than grid width. Vertical axis", function(assert) {
    // arrange
    this.updateOptions({
        grid: {
            visible: true,
            width: 3
        },
        label: {
            visible: false
        },
        isHorizontal: false
    });
    // act
    this.axis.draw(this.canvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Do not add correction to right margin for grid width if right calculated margin is greter than grid width. Horizontal axis", function(assert) {
    // arrange
    this.updateOptions({
        title: "Title text",
        grid: {
            visible: true,
            width: 3
        },
        label: {
            visible: false
        },
        isHorizontal: true
    });
    this.renderer.g.getCall(3).returnValue.getBBox = sinon.stub().returns({ x: 20, y: 80, width: 1000, height: 40 }); // elements (labels) group
    // act
    this.axis.draw(this.gridCorrectionCanvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 0, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 21, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.test("Do not add correction to top margin for grid width if calculated top margin is greter than grid width. Vertical axis", function(assert) {
    // arrange
    this.updateOptions({
        grid: {
            visible: true,
            width: 3
        },
        label: {
            visible: false
        },
        isHorizontal: false
    });

    this.renderer.g.getCall(3).returnValue.getBBox = sinon.stub().returns({ x: 20, y: 850, width: 100, height: 40 }); // elements (labels) group
    // act
    this.axis.draw(this.gridCorrectionCanvas);

    var margins = this.axis.getMargins();

    // assert
    assert.strictEqual(margins.bottom, 91, "bottom");
    assert.strictEqual(margins.left, 0, "left");
    assert.strictEqual(margins.right, 0, "right");
    assert.strictEqual(margins.top, 0, "top");
});

QUnit.module("Hide title and outer elements", environment);

QUnit.test("Axis has title - hideTitle removes title and throws incident", function(assert) {
    var spy = sinon.spy();

    this.createAxis({ incidentOccurred: spy });
    this.updateOptions({
        title: { text: "text" }
    });
    this.axis.draw(this.canvas);
    this.renderer.g.getCall(5).returnValue.clear.reset();

    this.axis.hideTitle();

    assert.ok(this.renderer.g.getCall(5).returnValue.clear.called, "title cleraed");
    assert.ok(spy.calledOnce, "incidentOccurred is called");

    var idError = spy.firstCall.args[0];

    assert.equal(idError, "W2105");
    assert.equal(spy.firstCall.args[1], "horizontal");
    assert.equal(dxErrors[idError], "The title of the \"{0}\" axis was hidden due to the container size");
});

QUnit.test("Axis has no title - hideTitle does nothing", function(assert) {
    var spy = sinon.spy();

    this.createAxis({ incidentOccurred: spy });
    this.updateOptions({});
    this.axis.parser = function(value) {
        return value;
    };
    this.axis.draw(this.canvas);
    this.renderer.g.getCall(5).returnValue.clear.reset();

    this.axis.hideTitle();

    assert.ok(!this.renderer.g.getCall(5).returnValue.clear.called, "title not cleared");
    assert.ok(!spy.calledOnce, "incidentOccurred is not called");
});

QUnit.test("Axis has labels - hideOuterElements removes labels and throws incident", function(assert) {
    var spy = sinon.spy();

    this.createAxis({ incidentOccurred: spy });
    this.updateOptions({
        title: {
            text: "text"
        },
        label: {
            visible: true
        }
    });
    this.axis.draw(this.canvas);
    this.renderer.g.getCall(3).returnValue.clear.reset();

    this.axis.hideOuterElements();

    assert.ok(this.renderer.g.getCall(3).returnValue.clear.called, "labels cleared");
    assert.ok(spy.called, "incidentOccurred is called");

    var idError = spy.firstCall.args[0];

    assert.equal(idError, "W2106");
    assert.equal(dxErrors[idError], "The labels of the \"{0}\" axis were hidden due to the container size");
});

QUnit.test("Axis has outside constantLines - hideOuterElements removes only outside labels and throws incident", function(assert) {
    var spy = sinon.spy(),
        renderer = this.renderer;

    this.createAxis({ incidentOccurred: spy });
    this.updateOptions({
        label: {
            visible: false
        },
        constantLines: [{
            value: 0,
            label: {
                text: "text1",
                position: "outside",
                visible: true,
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            value: 0,
            label: {
                text: "text2",
                position: "inside",
                visible: true,
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            value: 0,
            label: {
                text: "text3",
                position: "outside",
                visible: true,
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }]
    });
    this.translator.stub("translate").returns(50);
    this.axis.parser = function() {
        return 0;
    };

    this.axis.draw(this.canvas);

    this.axis.hideOuterElements();

    assert.equal(renderer.text.getCall(0).returnValue.remove.callCount, 1, "text1");
    assert.equal(renderer.text.getCall(1).returnValue.remove.callCount, 1, "text3");
    assert.equal(renderer.text.getCall(2).returnValue.stub("remove").callCount, 0, "text2");

    assert.ok(spy.called, "incidentOccurred is called");

    var idError = spy.firstCall.args[0];

    assert.equal(idError, "W2106");
    assert.equal(dxErrors[idError], "The labels of the \"{0}\" axis were hidden due to the container size");
});

QUnit.test("Axis has no visible labels nor outside constantLines - hideOuterElements does nothing", function(assert) {
    var spy = sinon.spy();

    this.createAxis({ incidentOccurred: spy });
    this.updateOptions({
        title: {
            text: "text",
        },
        label: {
            visible: false
        },
        constantLines: [{
            value: 0,
            label: {
                text: "text",
                position: "inside",
                visible: true
            }
        }]
    });
    this.axis.parser = function(value) {
        return value;
    };
    this.axis.draw(this.canvas);
    this.renderer.g.getCall(3).returnValue.clear.reset();

    this.axis.hideOuterElements();

    assert.ok(!this.renderer.g.getCall(3).returnValue.clear.called, "labels clearnot cleared");
    assert.ok(!spy.called, "incidentOccurred is not called");
});

QUnit.test("Axis has stubData - hideOuterElements does nothing", function(assert) {
    var spy = sinon.spy();

    this.createAxis({ incidentOccurred: spy });

    this.updateOptions({
        title: {
            text: "text"
        },
        label: {
            visible: true
        }
    });
    this.axis.setBusinessRange({ stubData: true });
    this.axis.draw(this.canvas);
    this.renderer.g.getCall(3).returnValue.clear.reset();

    this.axis.hideOuterElements();

    assert.ok(!this.renderer.g.getCall(3).returnValue.clear.called, "labels not cleared");
    assert.ok(!spy.called, "incidentOccurred is called");
});

QUnit.module("XY linear axis. Update size", environment);

QUnit.test("Update axis line points", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        visible: true,
        width: 4,
        color: "#123456",
        opacity: 0.3
    });
    this.axis.draw(this.zeroMarginCanvas);

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(renderer.path.lastCall.returnValue.attr.lastCall.args, [{ points: [10, 30, 90, 30] }]);
});

QUnit.test("Update tick mark points", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedTicks = [1, 2, 3, 4];

    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);
    this.translator.stub("translate").withArgs(4).returns(null);

    // act
    this.axis.updateSize(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(this.axis._majorTicks.length, 3);
    assert.deepEqual(path.getCall(0).returnValue.attr.lastCall.args[0], { points: [30, 30 - 5, 30, 30 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.lastCall.args[0], { points: [50, 30 - 5, 50, 30 + 5] });
    assert.deepEqual(path.getCall(2).returnValue.attr.lastCall.args[0], { points: [70, 30 - 5, 70, 30 + 5] });
});

QUnit.test("Update minor tick mark points", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        minorTick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.generatedMinorTicks = [1, 2, 3, 4];

    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);
    this.translator.stub("translate").withArgs(4).returns(null);

    // act
    this.axis.updateSize(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(this.axis._minorTicks.length, 3);
    assert.deepEqual(path.getCall(0).returnValue.attr.lastCall.args[0], { points: [30, 30 - 5, 30, 30 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.lastCall.args[0], { points: [50, 30 - 5, 50, 30 + 5] });
    assert.deepEqual(path.getCall(2).returnValue.attr.lastCall.args[0], { points: [70, 30 - 5, 70, 30 + 5] });
});

QUnit.test("Update boundary tick mark points", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 3 });

    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.updateSize(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.lastCall.args[0], { points: [30, 70 - 5, 30, 70 + 5] });
    assert.deepEqual(path.getCall(1).returnValue.attr.lastCall.args[0], { points: [70, 70 - 5, 70, 70 + 5] });
});

QUnit.test("Update boundary invalid tick mark points", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "bottom",
        showCustomBoundaryTicks: true,
        tick: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5,
            length: 10
        }
    });

    this.axis.setBusinessRange({ min: 1, max: 4 });

    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(4).returns(null);

    // act
    this.axis.updateSize(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(this.axis._boundaryTicks.length, 1);
    assert.deepEqual(path.getCall(0).returnValue.attr.lastCall.args[0], { points: [30, 70 - 5, 30, 70 + 5] });
});

QUnit.test("Update tick label coords", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        label: {
            visible: true,
            indentFromAxis: 10,
            alignment: "left"
        }
    });

    this.generatedTicks = [1, 2];

    this.axis.draw(this.zeroMarginCanvas);

    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(60);

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 40, y: 30 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 60, y: 30 });
});

QUnit.test("Update constant line points", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            value: 2,
            dashStyle: "dotdash",
            color: "#222222",
            width: 4,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }, {
            value: 3,
            dashStyle: "dash",
            color: "#333333",
            width: 5,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(10);
    this.translator.stub("translate").withArgs(3).returns(20);
    this.axis.parser = function(value) {
        return value;
    };
    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(renderer.path.getCall(0).returnValue.attr.lastCall.args[0], { points: [40, 30, 40, 70] });
    assert.deepEqual(renderer.path.getCall(1).returnValue.attr.lastCall.args[0], { points: [60, 30, 60, 70] });
    assert.deepEqual(renderer.path.getCall(2).returnValue.attr.lastCall.args[0], { points: [50, 30, 50, 70] });
});

QUnit.test("Update constant line labels coords", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        constantLines: [{
            value: 1,
            dashStyle: "dot",
            color: "#111111",
            width: 3,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test1"
            }
        }, {
            value: 2,
            dashStyle: "dotdash",
            color: "#222222",
            width: 4,
            label: {
                position: "inside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test2"
            }
        }, {
            value: 3,
            dashStyle: "dash",
            color: "#333333",
            width: 5,
            label: {
                position: "outside",
                horizontalAlignment: "left",
                verticalAlignment: "top",
                visible: true,
                text: "test3"
            }
        }]
    });

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(10);
    this.translator.stub("translate").withArgs(3).returns(20);
    this.axis.parser = function(value) {
        return value;
    };
    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(40);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(60);

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 40, y: 30 });
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args[0], { x: 60, y: 30 });
    assert.deepEqual(renderer.text.getCall(2).returnValue.attr.lastCall.args[0], { x: 50, y: 30 });
});

QUnit.test("Update title coords", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        title: {
            margin: 5,
            text: "Title text",
            opacity: 0.34,
            font: {
                color: "#123456",
                weight: 200,
                size: 10,
                family: "Tahoma"
            }
        }
    });

    this.axis.draw(this.zeroMarginCanvas);
    renderer.text.getCall(0).returnValue.restoreText = sinon.stub();

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args[0], { x: 50, y: 30 });
});

QUnit.test("Horizontal. Title does not fit to canvas - apply Ellipsis and set hint", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        title: {
            text: "Title text"
        }
    });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 100, height: 6 };

    this.axis.draw(this.zeroMarginCanvas);

    var title = renderer.text.getCall(0).returnValue;
    title.applyEllipsis = sinon.stub().returns(true);
    title.restoreText = sinon.stub();

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(title.applyEllipsis.lastCall.args, [80]);
    assert.deepEqual(title.setTitle.lastCall.args, ["Title text"]);
    assert.equal(title.restoreText.callCount, 0);
});

QUnit.test("Horizontal. Title fit to canvas - do not apply Ellipsis nor set hint", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        title: {
            text: "Title text"
        }
    });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 50, height: 6 };

    this.axis.draw(this.zeroMarginCanvas);

    var title = renderer.text.getCall(0).returnValue;
    title.applyEllipsis = sinon.stub().returns(true);
    title.restoreText = sinon.stub();

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.equal(title.applyEllipsis.callCount, 0);
    assert.equal(title.stub("setTitle").callCount, 0);
    assert.equal(title.restoreText.callCount, 1);
});

QUnit.test("Vertical. Title does not fit to canvas - apply Ellipsis and set hint", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "top",
        title: {
            text: "Title text"
        }
    });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 10, height: 100 };

    this.axis.draw(this.zeroMarginCanvas);

    var title = renderer.text.getCall(0).returnValue;
    title.applyEllipsis = sinon.stub().returns(true);
    title.restoreText = sinon.stub();

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(title.applyEllipsis.lastCall.args, [40]);
    assert.deepEqual(title.setTitle.lastCall.args, ["Title text"]);
    assert.equal(title.restoreText.callCount, 0);
});

QUnit.test("Vertical. Title fit to canvas - do not apply Ellipsis nor set hint", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        position: "top",
        title: {
            text: "Title text"
        }
    });

    this.renderer.bBoxTemplate = { x: 1, y: 2, width: 10, height: 30 };

    this.axis.draw(this.zeroMarginCanvas);

    var title = renderer.text.getCall(0).returnValue;
    title.applyEllipsis = sinon.stub().returns(true);
    title.restoreText = sinon.stub();

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.equal(title.applyEllipsis.callCount, 0);
    assert.equal(title.stub("setTitle").callCount, 0);
    assert.equal(title.restoreText.callCount, 1);
});

QUnit.test("Do not draw grid outside canvas", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(0);
    this.translator.stub("translate").withArgs(2).returns(55);
    this.translator.stub("translate").withArgs(3).returns(60);
    this.axis.draw(this.canvas);

    var path = this.renderer.path;
    assert.equal(path.callCount, 2);
});

QUnit.test("Update grid points", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(50);
    this.translator.stub("translate").withArgs(2).returns(55);
    this.translator.stub("translate").withArgs(3).returns(60);
    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.updateSize(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.lastCall.args[0], { points: [30, 30, 30, 70] });
    assert.deepEqual(path.getCall(1).returnValue.attr.lastCall.args[0], { points: [50, 30, 50, 70] });
    assert.deepEqual(path.getCall(2).returnValue.attr.lastCall.args[0], { points: [70, 30, 70, 70] });
});

QUnit.test("Update grid points, but distance between grids and borders less than 4px - update all grids", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        grid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(50);
    this.translator.stub("translate").withArgs(2).returns(55);
    this.translator.stub("translate").withArgs(3).returns(60);
    this.axis.draw(this.zeroMarginCanvas, { visible: true, left: true, right: true });
    this.translator.stub("translate").withArgs(1).returns(12);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(88);

    // act
    this.axis.updateSize(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.lastCall.args[0], { points: [12, 30, 12, 70] });
    assert.deepEqual(path.getCall(1).returnValue.attr.lastCall.args[0], { points: [50, 30, 50, 70] });
    assert.deepEqual(path.getCall(2).returnValue.attr.lastCall.args[0], { points: [88, 30, 88, 70] });
});

QUnit.test("Update minor grid points", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        position: "top",
        minorGrid: {
            visible: true,
            color: "#123456",
            opacity: 0.3,
            width: 5
        }
    });

    this.generatedMinorTicks = [1, 2, 3];

    this.translator.stub("translate").withArgs(1).returns(50);
    this.translator.stub("translate").withArgs(2).returns(55);
    this.translator.stub("translate").withArgs(3).returns(60);
    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(1).returns(30);
    this.translator.stub("translate").withArgs(2).returns(50);
    this.translator.stub("translate").withArgs(3).returns(70);

    // act
    this.axis.updateSize(this.canvas);

    var path = this.renderer.path;
    assert.deepEqual(path.getCall(0).returnValue.attr.lastCall.args[0], { points: [30, 30, 30, 70] });
    assert.deepEqual(path.getCall(1).returnValue.attr.lastCall.args[0], { points: [50, 30, 50, 70] });
    assert.deepEqual(path.getCall(2).returnValue.attr.lastCall.args[0], { points: [70, 30, 70, 70] });
});

QUnit.test("Update strip coords", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111"
        }, {
            startValue: 6,
            endValue: 8,
            color: "#222222"
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(1);
    this.translator.stub("translate").withArgs(4).returns(2);
    this.translator.stub("translate").withArgs(6).returns(3);
    this.translator.stub("translate").withArgs(8).returns(4);
    this.axis.parser = function(value) {
        return value;
    };
    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.deepEqual(renderer.rect.getCall(0).returnValue.attr.lastCall.args[0], { x: 20, y: 30, width: 20, height: 40 });
    assert.deepEqual(renderer.rect.getCall(1).returnValue.attr.lastCall.args[0], { x: 60, y: 30, width: 30, height: 40 });
});

QUnit.test("Update strip labels coords", function(assert) {
    // arrange
    var renderer = this.renderer;
    this.createAxis();
    this.updateOptions({
        isHorizontal: true,
        strips: [{
            startValue: 2,
            endValue: 4,
            color: "#111111",
            paddingTopBottom: 7,
            paddingLeftRight: 8,
            label: {
                text: "test1",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }, {
            startValue: 6,
            endValue: 8,
            color: "#333333",
            paddingTopBottom: 5,
            paddingLeftRight: 6,
            label: {
                text: "test2",
                horizontalAlignment: "center",
                verticalAlignment: "top"
            }
        }]
    });

    this.axis.setBusinessRange({
        min: 0,
        max: 10
    });
    this.translator.stub("translate").withArgs(2).returns(1);
    this.translator.stub("translate").withArgs(4).returns(2);
    this.translator.stub("translate").withArgs(6).returns(3);
    this.translator.stub("translate").withArgs(8).returns(4);
    this.axis.parser = function(value) {
        return value;
    };

    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(2).returns(20);
    this.translator.stub("translate").withArgs(4).returns(40);
    this.translator.stub("translate").withArgs(6).returns(60);
    this.translator.stub("translate").withArgs(8).returns(90);

    // act
    this.axis.updateSize(this.canvas);

    // assert
    assert.equal(renderer.text.callCount, 2, "text");

    assert.deepEqual(renderer.text.getCall(0).returnValue.attr.lastCall.args, [{ x: 20 + 10, y: 30 }]);
    assert.deepEqual(renderer.text.getCall(1).returnValue.attr.lastCall.args, [{ x: 60 + 15, y: 30 }]);
});

QUnit.module("Scale breaks drawing", environment);

QUnit.test("Drawing scale breaks. Value axis. Elements creation.", function(assert) {
    // arrange
    var elementsGroup,
        scaleBreaksGroup = this.renderer.g();

    this.createAxisWithBreaks({ breakStyle: {
        line: "straight",
        width: 2
    } }, scaleBreaksGroup);

    // act
    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    this.axis.updateSize(this.canvas);

    this.axis.drawScaleBreaks();

    elementsGroup = this.renderer.g.getCall(11).returnValue;

    // assert
    assert.strictEqual(this.renderer.path.callCount, 3);
    assert.strictEqual(this.renderer.path.getCall(0).returnValue.append.lastCall.args[0], elementsGroup);
    assert.strictEqual(this.renderer.path.getCall(1).returnValue.append.lastCall.args[0], elementsGroup);
    assert.strictEqual(this.renderer.path.getCall(2).returnValue.append.lastCall.args[0], elementsGroup);
});

QUnit.test("Attributes of elements. Straight break", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        breakStyle: {
            line: "straight",
            width: 2
        }
    }, this.renderer.g());

    // act
    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [10, 21, 90, 21]);
    assert.deepEqual(this.renderer.path.getCall(0).args[1], "line");

    assert.deepEqual(this.renderer.path.getCall(1).args[0], [10, 20, 90, 20]);
    assert.deepEqual(this.renderer.path.getCall(1).args[1], "line");

    assert.deepEqual(this.renderer.path.getCall(2).args[0], [ 10, 22, 90, 22]);
    assert.deepEqual(this.renderer.path.getCall(2).args[1], "line");
});

QUnit.test("Attributes of elements. Waved break", function(assert) {
    // arrange
    this.canvas.width = 40;
    this.createAxisWithBreaks({
        breakStyle: {
            line: "waved",
            width: 2
        }
    }, this.renderer.g());

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);

    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [10, 23, 16, 21, 16, 21, 22, 23, 28, 25, 28, 25, 34, 23]);
    assert.deepEqual(this.renderer.path.getCall(0).args[1], "bezier");

    assert.deepEqual(this.renderer.path.getCall(1).args[0], [10, 22, 16, 20, 16, 20, 22, 22, 28, 24, 28, 24, 34, 22]);
    assert.deepEqual(this.renderer.path.getCall(1).args[1], "bezier");

    assert.deepEqual(this.renderer.path.getCall(2).args[0], [10, 24, 16, 22, 16, 22, 22, 24, 28, 26, 28, 26, 34, 24]);
    assert.deepEqual(this.renderer.path.getCall(2).args[1], "bezier");
});

QUnit.test("Rotated chart. Straight line", function(assert) {
    this.createAxisWithBreaks({
        isHorizontal: true,
        breakStyle: {
            line: "straight",
            width: 2
        }
    });
    this.translator.stub("isInverted").returns(false);

    this.translator.stub("translate").withArgs(20).returns(20);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [18, 30, 18, 70]);
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [17, 30, 17, 70]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [19, 30, 19, 70]);
});

QUnit.test("Rotated chart. Waved break", function(assert) {
    // arrange
    this.canvas.height = 70;
    this.createAxisWithBreaks({
        isHorizontal: true,
        breakStyle: {
            line: "waved",
            width: 2
        }
    }, this.renderer.g());
    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);

    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [20, 30, 18, 36, 18, 36, 20, 42, 22, 48, 22, 48, 20, 54]);
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [19, 30, 17, 36, 17, 36, 19, 42, 21, 48, 21, 48, 19, 54]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [21, 30, 19, 36, 19, 36, 21, 42, 23, 48, 23, 48, 21, 54]);
});

QUnit.test("cliprect for breaks creation", function(assert) {
    this.createAxisWithBreaks({
        breakStyle: {
            line: "straight",
            width: 2
        }
    });

    this.translator.stub("isInverted").returns(false);

    // act
    this.translator.stub("translate").withArgs(20).returns(20);
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.clipRect.lastCall.args, [10, 30, 80, 110]);
});

QUnit.test("Apply cliprect for breaks", function(assert) {
    this.createAxisWithBreaks({
        breakStyle: {
            line: "straight",
            width: 2
        }
    }, this.renderer.g());

    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);

    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.strictEqual(this.renderer.g.getCall(10).returnValue.attr.lastCall.args[0]["clip-path"], this.renderer.clipRect.lastCall.returnValue.id);
});

QUnit.test("Apply cliprect for breaks. Rotated chart", function(assert) {
    this.createAxisWithBreaks({
        isHorizontal: true,
        breakStyle: {
            line: "straight",
            width: 2
        }
    });
    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);

    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();
    // assert
    assert.deepEqual(this.renderer.clipRect.lastCall.args, [10, 30, 140, 40]);
});

QUnit.test("Cliprect disposing", function(assert) {
    this.createAxisWithBreaks({
        isHorizontal: true,
        breakStyle: {
            line: "straight",
            width: 2
        }
    });
    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();
    // act
    this.axis.drawScaleBreaks();

    assert.strictEqual(this.renderer.clipRect.firstCall.returnValue.dispose.callCount, 1);
});

QUnit.test("Drawing scale breaks using drawScaleBreaks method", function(assert) {
    // arrange
    var elementsGroup;

    this.createAxisWithBreaks({}, this.renderer.g());

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    this.axis.draw(this.canvas);

    // act
    this.axis.drawScaleBreaks();

    elementsGroup = this.renderer.g.getCall(11).returnValue;
    // assert
    assert.strictEqual(this.renderer.path.callCount, 3);
    assert.strictEqual(this.renderer.path.getCall(0).returnValue.append.lastCall.args[0], elementsGroup);
    assert.strictEqual(this.renderer.path.getCall(1).returnValue.append.lastCall.args[0], elementsGroup);
    assert.strictEqual(this.renderer.path.getCall(2).returnValue.append.lastCall.args[0], elementsGroup);
});

QUnit.test("Drawing scale with custom canvas", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        breakStyle: {
            line: "straight",
            width: 2
        }
    }, this.renderer.g());

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    this.axis.draw(this.canvas);

    // act
    this.axis.drawScaleBreaks({
        start: 30,
        end: 90
    });
    // assert
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [30, 21, 90, 21]);
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [30, 20, 90, 20]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [ 30, 22, 90, 22]);
});

QUnit.test("Drawing scale breaks for value axis, axis is visible, position is left", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        visible: true,
        position: "left",
        breakStyle: {
            line: "straight",
            width: 2
        }
    });

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();
    // assert
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [7, 21, 90, 21]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [7, 20, 90, 20]);
    assert.deepEqual(this.renderer.path.getCall(3).args[0], [7, 22, 90, 22]);
});

QUnit.test("Drawing scale breaks for value axis, axis is visible, position is right", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        visible: true,
        position: "right",
        breakStyle: {
            line: "straight",
            width: 2
        }
    });

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [10, 21, 93, 21]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [10, 20, 93, 20]);
    assert.deepEqual(this.renderer.path.getCall(3).args[0], [10, 22, 93, 22]);
});

QUnit.test("Drawing scale breaks for value axis, chart is rotated, axis is visible, position is top", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        isHorizontal: true,
        visible: true,
        position: "top",
        breakStyle: {
            line: "straight",
            width: 2
        }
    });

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(false);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [18, 27, 18, 70]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [17, 27, 17, 70]);
    assert.deepEqual(this.renderer.path.getCall(3).args[0], [19, 27, 19, 70]);
});

QUnit.test("Drawing scale breaks for value axis, chart is rotated, axis is visible, position is bottom", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        isHorizontal: true,
        visible: true,
        position: "bottom",
        breakStyle: {
            line: "straight",
            width: 2
        }
    });

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(false);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [18, 30, 18, 73]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [17, 30, 17, 73]);
    assert.deepEqual(this.renderer.path.getCall(3).args[0], [19, 30, 19, 73]);
});

QUnit.test("Create group for breaks", function(assert) {
    var externalBreaksGroup = this.renderer.g();
    this.createAxisWithBreaks({
        breakStyle: {
            line: "straight",
            width: 2
        }
    }, externalBreaksGroup);

    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);

    // act
    this.axis.drawScaleBreaks();

    // assert
    var group = this.renderer.g.getCall(10).returnValue;
    assert.strictEqual(group.append.lastCall.args[0], externalBreaksGroup);
    assert.strictEqual(group.attr.lastCall.args[0]["class"], "widget-axis-breaks");
});

QUnit.test("Create group for breaks if shifted axis", function(assert) {
    var externalBreaksGroup = this.renderer.g();
    this.createAxisWithBreaks({
        visible: true,
        breakStyle: {
            line: "straight",
            width: 2
        }
    }, externalBreaksGroup);

    this.axis.shift({ left: -10 });

    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    var additionGroup = this.renderer.g.getCall(11).returnValue;
    assert.strictEqual(additionGroup.append.lastCall.args[0], externalBreaksGroup);
    assert.strictEqual(additionGroup.attr.lastCall.args[0]["clip-path"], this.renderer.clipRect.getCall(1).returnValue.id);
    assert.strictEqual(additionGroup.attr.lastCall.args[0]["class"], "widget-axis-breaks");
    assert.deepEqual(this.renderer.clipRect.getCall(1).args, [17, 30, 6, 110]);
});

QUnit.test("Recreate group for breaks", function(assert) {
    var externalBreaksGroup = this.renderer.g();
    this.createAxisWithBreaks({
        breakStyle: {
            line: "straight",
            width: 2
        }
    }, externalBreaksGroup);

    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);
    this.renderer.g.reset();
    this.axis.drawScaleBreaks();
    var oldGroup = this.renderer.g.getCall(0).returnValue;
    // act
    this.renderer.g.reset();
    this.axis.drawScaleBreaks();

    // assert
    assert.strictEqual(this.renderer.g.getCall(0).returnValue.append.lastCall.args[0], externalBreaksGroup);
    assert.ok(!this.renderer.g.getCall(0).returnValue.dispose.called);
    assert.ok(oldGroup.dispose.called);
});

QUnit.test("Recreate group for breaks if shifted axis", function(assert) {
    var externalBreaksGroup = this.renderer.g();
    this.createAxisWithBreaks({
        visible: true,
        breakStyle: {
            line: "straight",
            width: 2
        }
    }, externalBreaksGroup);

    this.axis.shift({ left: -10 });

    this.translator.stub("isInverted").returns(false);
    this.translator.stub("translate").withArgs(20).returns(20);
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    var oldAdditionGroup = this.renderer.g.getCall(11).returnValue;
    var oldAdditionClipRect = this.renderer.clipRect.getCall(1).returnValue;

    this.renderer.clipRect.reset();
    this.renderer.g.reset();
    // act
    this.axis.drawScaleBreaks();

    // assert
    var additionGroup = this.renderer.g.getCall(1).returnValue;
    assert.strictEqual(additionGroup.append.lastCall.args[0], externalBreaksGroup);
    assert.strictEqual(additionGroup.attr.lastCall.args[0]["clip-path"], this.renderer.clipRect.getCall(1).returnValue.id);
    assert.deepEqual(this.renderer.clipRect.getCall(1).args, [17, 30, 6, 110]);

    assert.ok(oldAdditionClipRect.dispose.called);
    assert.ok(oldAdditionGroup.dispose.called);
});

QUnit.test("The scale break shouldn't created without breaks", function(assert) {
    // arrange
    this.createAxis();
    this.updateOptions({
        isHorizontal: false,
        breakStyle: {
            color: "black",
            line: "waved",
            width: 10
        }
    });
    this.axis.setBusinessRange({ min: 0, max: 30 });
    this.axis.draw(this.zeroMarginCanvas);
    this.translator.stub("translate").withArgs(20).returns(20);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.strictEqual(this.renderer.stub("path").called, false);
});

QUnit.test("The scale break shouldn't created if break is out of the range", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        breaks: [{ startValue: 50, endValue: 60 }]
    });

    // act
    this.translator.stub("translate").withArgs(20).returns(20);
    this.axis.updateSize(this.canvas);

    // assert
    assert.strictEqual(this.renderer.stub("path").called, false);
});

QUnit.test("Datetime. Drawing user breaks with generated workday breaks. Should drawn only user scale break", function(assert) {
    this.createAxis({ scaleBreaksGroup: this.renderer.g() });
    this.axis.updateOptions({
        label: {
        },
        isHorizontal: false,
        isArgumentAxis: true,
        containerColor: "#ffffff",
        workdaysOnly: true,
        argumentType: "datetime",
        workWeek: [1, 2, 3, 4, 5],
        breaks: [{ startValue: new Date(2017, 10, 7), endValue: new Date(2017, 10, 8) }],
        breakStyle: {
            color: "black",
            line: "waved",
            width: 10
        }
    });
    this.axis.validate();
    this.axis.setBusinessRange({ min: new Date(2017, 10, 6), max: new Date(2017, 10, 15) });
    this.axis.draw(this.zeroMarginCanvas);

    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.equal(this.renderer.path.callCount, 3);
});

QUnit.test("Drawing scale breaks for shifted axis", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        visible: true,
        position: "left",
        breakStyle: {
            line: "straight",
            width: 2
        }
    });

    this.axis.shift({ left: -10 });

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    // act
    this.axis.updateSize(this.canvas);
    this.axis.drawScaleBreaks();

    // assert
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [10, 21, 90, 21]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [10, 20, 90, 20]);
    assert.deepEqual(this.renderer.path.getCall(3).args[0], [10, 22, 90, 22]);

    assert.deepEqual(this.renderer.path.getCall(4).args[0], [17, 21, 23, 21]);
    assert.deepEqual(this.renderer.path.getCall(5).args[0], [17, 20, 23, 20]);
    assert.deepEqual(this.renderer.path.getCall(6).args[0], [17, 22, 23, 22]);
});

QUnit.test("Do not draw addition break line if axis line is not visible", function(assert) {
    // arrange
    this.createAxisWithBreaks({
        visible: false,
        position: "left",
        breakStyle: {
            line: "straight",
            width: 2
        }
    });

    this.axis.shift({ left: -10 });

    this.translator.stub("translate").withArgs(20).returns(20);
    this.translator.stub("isInverted").returns(true);
    // act
    this.axis.updateSize(this.canvas);

    this.axis.drawScaleBreaks();

    // assert
    assert.equal(this.renderer.path.callCount, 3);
    assert.deepEqual(this.renderer.path.getCall(0).args[0], [10, 21, 90, 21]);
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [10, 20, 90, 20]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [10, 22, 90, 22]);
});
