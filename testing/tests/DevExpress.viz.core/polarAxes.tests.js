"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    translator2DModule = require("viz/translators/translator2d"),
    tickManagerModule = require("viz/axes/base_tick_manager"),
    rangeModule = require("viz/translators/range"),
    Axis = require("viz/axes/base_axis").Axis;

var TickManagerStubCtor = new vizMocks.ObjectPool(tickManagerModule.TickManager),
    TranslatorStubCtor = new vizMocks.ObjectPool(translator2DModule.Translator2D),
    RangeStubCtor = new vizMocks.ObjectPool(rangeModule.Range);

function createStubTickManager() {
    var tickManager = new TickManagerStubCtor();
    tickManager.getBoundaryTicks.returns([]);
    tickManager.getOptions.returns({
        labelOptions: {
            label: {
                overlappingBehavior: {},
                visible: true,
                alignment: "center",
                font: {
                    size: 12,
                    color: "black"
                },
                opacity: 1,
                style: {}
            }
        }
    });

    return tickManager;
}


function getStub2DTranslatorWithSettings() {
    var translator = sinon.createStubInstance(translator2DModule.Translator2D); translator.getBusinessRange.returns({ arg: { minVisible: 0, maxVisible: 10 }, val: { minVisible: 0, maxVisible: 10 } });
    return translator;
}

var environment = {
    beforeEach: function() {
        var that = this;

        TranslatorStubCtor.resetIndex();
        RangeStubCtor.resetIndex();
        TickManagerStubCtor.resetIndex();

        this.renderer = new vizMocks.Renderer();

        this.tickManager = createStubTickManager();
        this.tickManager.getMaxLabelParams = sinon.stub();
        this.tickManager.getMaxLabelParams.returns({ width: 20, height: 10 });

        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        this.options = {
            isHorizontal: true,
            width: 1,
            color: "red",
            opacity: 1,
            visible: false,
            tick: { color: "red", width: 1, visible: false, opacity: 1, length: 8 },
            label: {
                overlappingBehavior: {},
                visible: true,
                alignment: "center",
                font: { size: 12, color: "black" },
                opacity: 1,
                style: {}
            },
            axisDivisionFactor: 30,
            stripStyle: {},
            constantLineStyle: {},
            position: "left",
            discreteAxisDivisionMode: "crossLabels"
        };
        this.renderSettings = {
            stripsGroup: this.renderer.g(),
            labelAxesGroup: this.renderer.g(),
            constantLinesGroup: this.renderer.g(),
            axesContainerGroup: this.renderer.g(),
            gridGroup: this.renderer.g(),
            renderer: this.renderer,
            axisType: "xyAxes",
            drawingType: "linear"
        };
        this.range = new RangeStubCtor();

    },
    afterEach: function() {
        this.createTickManager.restore();
    },
    createSimpleAxis: function(options) {
        options = $.extend(true, this.options, options);
        var axis;

        this.range.categories = options.categories;
        this.range.minVisible = options.min;
        this.range.maxVisible = options.max;

        axis = this.createAxis(this.renderSettings, options);

        this.translator.getBusinessRange.returns(this.range);
        axis.setTranslator(this.translator, this.orthogonalTranslator);

        return axis;
    },
    createAxis: function(renderSettings, options) {
        var axis = new Axis(renderSettings);
        axis.updateOptions(options);

        return axis;
    },
    createDrawnAxis: function(opt) {
        var axis = this.createSimpleAxis(opt);
        axis.validate();
        axis.draw();
        axis.drawGrids();
        return axis;
    }
};

QUnit.module("Ticks skipping. Polar axes", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;
        that.tickManager.getTicks.returns(["c1", "c2", "c3", "c4"]);
        that.tickManager.getOptions.returns({ labelOptions: { visible: false, alignment: "center", overlappingBehavior: {} } });
        that.tickManager.checkBoundedTicksOverlapping = sinon.stub().returns({});
        this.createTickManager.restore();
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        this.translator = getStub2DTranslatorWithSettings();
        this.orthogonalTranslator = getStub2DTranslatorWithSettings();

        this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([0, 90]);
        this.translator.getRadius = this.orthogonalTranslator.getRadius = sinon.stub().returns(20);
        this.translator.getCenter = this.orthogonalTranslator.getCenter = sinon.stub().returns({ x: 10, y: 20 });
    }
}));



QUnit.test("Linear axis. axisDivisionMode is betweenLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: false
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 1]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 1]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 1]);

    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_start"]);
});

QUnit.test("Linear axis. axisDivisionMode is betweenLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 1]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 1]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 1]);

    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_start"]);
});

QUnit.test("Linear axis. axisDivisionMode is crossLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: false
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 0]);


    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_start"]);
});

QUnit.test("Linear axis. axisDivisionMode is crossLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "linear";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 0]);

    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_start"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_start"]);
});

QUnit.test("Circular axis. axisDivisionMode is betweenLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: false,
        visible: false
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", -1]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", -1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", -1]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", -1]);

    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_bottom"]);
});

QUnit.test("Circular axis. axisDivisionMode is betweenLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", -1]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", -1]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", -1]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", -1]);

    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_bottom"]);
});

QUnit.test("Circular axis. axisDivisionMode is crossLabels, valueMarginsEnabled false", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: false
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 0]);

    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_bottom"]);
});

QUnit.test("Circular axis. axisDivisionMode is crossLabels, valueMarginsEnabled true", function(assert) {
    this.renderSettings.axisType = "polarAxes";
    this.renderSettings.drawingType = "circular";
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels",
        valueMarginsEnabled: true
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 0]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 0]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 0]);

    assert.deepEqual(this.orthogonalTranslator.translate.getCall(0).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(1).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(2).args, ["canvas_position_bottom"]);
    assert.deepEqual(this.orthogonalTranslator.translate.getCall(3).args, ["canvas_position_bottom"]);
});


QUnit.module("Circular axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;
        that.tickManager.getTicks.returns([0, 2000, 4000, 6000]);
        that.tickManager.getOptions.returns({ labelOptions: { visible: false, alignment: "center", overlappingBehavior: {} } });
        that.tickManager.checkBoundedTicksOverlapping = sinon.stub().returns({});
        this.createTickManager.restore();
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        this.translator = getStub2DTranslatorWithSettings();
        this.orthogonalTranslator = getStub2DTranslatorWithSettings();

        this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([0, 90]);
        this.translator.getRadius = this.orthogonalTranslator.getRadius = sinon.stub().returns(20);
        this.translator.getCenter = this.orthogonalTranslator.getCenter = sinon.stub().returns({ x: 10, y: 50 });

        this.translator.translate.returns(33 + 90);
        this.orthogonalTranslator.translate.returns(10);
        this.orthogonalTranslator.translate.withArgs("canvas_position_bottom").returns(0);

        this.translator.translate.withArgs(10).returns(10 + 90);
        this.translator.translate.withArgs(20).returns(20 + 90);

        this.renderSettings.axisType = "polarAxes";
        this.renderSettings.drawingType = "circular";
        this.options.min = 0;
        this.options.max = 5000;
        this.options.label = {
            overlappingBehavior: {},
            visible: true,
            alignment: "center",
            font: {
                size: 12,
                color: "black"
            },
            opacity: 1,
            style: {}
        };
    }
}));

QUnit.test("draw", function(assert) {
    this.createDrawnAxis({ visible: true });

    assert.equal(this.renderer.circle.callCount, 1);
    assert.equal(this.renderer.circle.getCall(0).args[0], 10);
    assert.equal(this.renderer.circle.getCall(0).args[1], 50);
    assert.equal(this.renderer.circle.getCall(0).args[2], 20);
    assert.deepEqual(this.renderer.circle.getCall(0).returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
    assert.equal(this.renderer.circle.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
    assert.ok(this.renderer.circle.getCall(0).returnValue.sharp.calledOnce);
});

QUnit.test("draw, not visible", function(assert) {
    this.createDrawnAxis();

    assert.equal(this.renderer.stub("circle").callCount, 0);
});

QUnit.test("draw ticks. Orientation = center", function(assert) {
    this.range.stick = true;
    this.createDrawnAxis({ visible: true, tick: { visible: true, length: 20 } });

    assert.equal(this.renderer.path.callCount, 4);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[20, 50, 40, 50], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });

        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created element attached to the group");
        assert.ok(this.renderer.path.getCall(i).returnValue.sharp.calledOnce);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.sharp.lastCall.args, [true]);
    }
});

QUnit.test("draw ticks. Orientation = outside", function(assert) {
    this.range.stick = true;
    this.createDrawnAxis({ visible: true, tickOrientation: "outside", tick: { visible: true, length: 20 } });

    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[30, 50, 50, 50], "line"]);
    }
});

QUnit.test("draw ticks. Orientation = inside", function(assert) {
    this.range.stick = true;
    this.createDrawnAxis({ visible: true, tickOrientation: "inside", tick: { visible: true, length: 20 } });

    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[10, 50, 30, 50], "line"]);
    }
});

QUnit.test("draw ticks, is not visible", function(assert) {
    this.createDrawnAxis();

    assert.equal(this.renderer.stub("path").callCount, 0);
});

QUnit.test("discrete axis", function(assert) {
    this.tickManager.getTicks.returns(["one", "two", "three", "four", "five"]);
    this.createDrawnAxis({ tick: { visible: true }, categories: ["one", "two", "three", "four", "five"] });

    assert.equal(this.renderer.path.callCount, 5);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[26, 50, 34, 50], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });

        assert.deepEqual(this.renderer.path.getCall(i).returnValue.rotate.firstCall.args, [33, 10, 50]);
        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created element attached to the group");
        assert.ok(this.renderer.path.getCall(i).returnValue.sharp.calledOnce);
    }

    assert.deepEqual(this.translator.translate.getCall(2).args[1], 0);
});

QUnit.test("axisDivisionMode is betweenLabels", function(assert) {
    this.tickManager.getTicks.returns(["one", "two", "three", "four", "five"]);
    this.createDrawnAxis({ categories: ["one", "two", "three", "four", "five"], discreteAxisDivisionMode: "betweenLabels", tick: { visible: true } });

    assert.deepEqual(this.translator.translate.getCall(2).args[1], -1);
});

QUnit.test("draw labels", function(assert) {
    this.range.stick = true;
    this.tickManager.getOptions.returns({ labelOptions: { visible: true, alignment: "center", overlappingBehavior: {} } });
    this.createDrawnAxis();

    assert.equal(this.renderer.text.callCount, 4);
    for(var i = 0; i < this.renderer.text.callCount; i++) {
        assert.equal(this.renderer.text.getCall(i).args[0], i * 2000);
        assert.equal(this.renderer.text.getCall(i).args[1], 10);
        assert.equal(this.renderer.text.getCall(i).args[2], 50);
        assert.deepEqual(this.renderer.text.getCall(i).returnValue.attr.firstCall.args[0], { align: "center", opacity: 1, rotate: 0 });
        assert.deepEqual(this.renderer.text.getCall(i).returnValue.css.firstCall.args[0], { "font-size": 12, fill: "black" });
        assert.equal(this.renderer.text.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[0]);
    }
});

QUnit.test("adjust labels", function(assert) {
    this.range.stick = true;
    this.tickManager.getOptions.returns({ labelOptions: { visible: true, alignment: "center", overlappingBehavior: {} } });
    var axis = this.createDrawnAxis();

    assert.equal(this.renderer.text.callCount, 4);
    for(var i = 0; i < this.renderer.text.callCount; i++) {
        assert.equal(Math.round(axis._majorTicks[i].label._stored_settings.x), 20);
        assert.equal(Math.round(axis._majorTicks[i].label._stored_settings.y), 96);
    }
});

QUnit.test("draw labels, is not visible", function(assert) {
    this.createDrawnAxis();

    assert.equal(this.renderer.stub("text").callCount, 0);
});

QUnit.test("coordsIn method", function(assert) {
    var axis = this.createDrawnAxis();
    assert.ok(axis.coordsIn(10, 15));
    assert.ok(!axis.coordsIn(10, 45));
});

QUnit.test("draw grid", function(assert) {
    var returnedPath;
    this.range.stick = true;
    this.createDrawnAxis({ tick: { visible: false }, grid: { visible: true, color: "black", width: 1, opacity: 1 } });

    assert.equal(this.renderer.path.callCount, 4);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        returnedPath = this.renderer.path.getCall(i).returnValue;
        assert.deepEqual(this.renderer.path.getCall(i).args, [[10, 50, 30, 50], "line"]);

        assert.deepEqual(returnedPath.attr.firstCall.args[0], {
            "stroke-width": 1,
            stroke: "black",
            "stroke-opacity": 1
        });
        assert.deepEqual(returnedPath.rotate.firstCall.args, [33, 10, 50]);
        assert.equal(returnedPath.append.firstCall.args[0], this.renderSettings.gridGroup.children[0], "Created element attached to the group");
        assert.ok(returnedPath.sharp.calledOnce);
    }
});

QUnit.test("create strips", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });
    assert.ok(this.renderer.arc.called);
    assert.deepEqual(this.renderer.arc.getCall(0).args, [10, 50, 0, 20, -20, -10]);
    assert.equal(this.renderer.arc.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.arc.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("create strips with label", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "green", label: { text: "strip label" } }], label: { visible: false } });

    assert.ok(this.renderer.arc.called);
    assert.ok(this.renderer.text.called);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["strip label", 20, 53]);
    assert.equal(this.renderer.text.getCall(0).returnValue.attr.firstCall.args[0].align, "center");
    assert.equal(this.renderer.text.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.labelAxesGroup.children[0], "Created element attached to the group");
});

QUnit.test("adjusted strip labels", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "green", label: { text: "strip label" } }], label: { visible: false } });

    assert.ok(this.renderer.arc.called);
    assert.ok(this.renderer.text.called);
    assert.equal(this.renderer.text.getCall(0).returnValue.move.firstCall.args[0], 0);
    assert.equal(this.renderer.text.getCall(0).returnValue.move.firstCall.args[1], 46);
});

QUnit.test("create constant lines", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green" }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[10, 50, 30, 50], "line"]);

    assert.deepEqual(this.renderer.path.getCall(0).returnValue.attr.firstCall.args, [{
        dashStyle: undefined,
        stroke: "green",
        "stroke-width": undefined
    }]);

    assert.deepEqual(this.renderer.path.getCall(0).returnValue.rotate.firstCall.args, [10, 10, 50]);

    assert.ok(this.renderer.path.getCall(0).returnValue.sharp.calledOnce);

    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});

QUnit.test("create constant lines with label", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: { visible: true } }], label: { visible: false } });

    assert.ok(this.renderer.path.called);
    assert.ok(this.renderer.text.called);
    assert.deepEqual(this.renderer.text.getCall(0).args, ["10", 20, 52]);
    assert.equal(this.renderer.text.getCall(0).returnValue.attr.firstCall.args[0].align, "center");
    assert.equal(this.renderer.text.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});

QUnit.test("measure labels", function(assert) {
    this.tickManager.getOptions.returns({ labelOptions: { visible: true, alignment: "center", overlappingBehavior: {} } });
    var axis = this.createDrawnAxis();
    assert.deepEqual(axis.measureLabels(), { width: 20, height: 10 });
});

QUnit.test("measure labels with indents", function(assert) {
    this.tickManager.getOptions.returns({ labelOptions: { visible: true, alignment: "center", overlappingBehavior: {} } });
    var axis = this.createDrawnAxis();
    assert.deepEqual(axis.measureLabels(true), { width: 24, height: 14 });
});

QUnit.test("measure labels without labels", function(assert) {
    var axis = this.createDrawnAxis({ label: { visible: false } });

    assert.deepEqual(axis.measureLabels(), { width: 0, height: 0 });
});

QUnit.test("measure labels without labels, with axis, width of axis is thick", function(assert) {
    var axis = this.createDrawnAxis({ label: { visible: false }, visible: true, width: 6 });

    assert.deepEqual(axis.measureLabels(), { width: 6, height: 6 });
});

QUnit.test("measure labels without axisElementsGroup", function(assert) {
    var axis = this.createDrawnAxis({ incidentOccurred: vizMocks.incidentOccurred(), label: { visible: false } });
    axis.updateSize(true);

    assert.deepEqual(axis.measureLabels(), { width: 0, height: 0 });
});

QUnit.test("get range data, set period without originValue", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ period: 20, argumentType: "numeric" }),
        range = axis.getRangeData();

    assert.equal(range.min, 0);
    assert.equal(range.max, 20);
});

QUnit.test("get range data, set period with originValue, min & max", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ period: 20, originValue: 20, min: 50, max: 100, argumentType: "numeric" }),
        range = axis.getRangeData();

    assert.equal(range.min, 20);
    assert.equal(range.max, 40);
});

QUnit.test("get range data, set originValue, min & max", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ originValue: 10, min: 20, max: 40, argumentType: "numeric" }),
        range = axis.getRangeData();

    assert.equal(range.min, 10);
    assert.equal(range.max, undefined);
});

QUnit.test("get range data, set string originValue", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ originValue: "string", argumentType: "numeric" }),
        range = axis.getRangeData();

    assert.equal(range.min, undefined);
    assert.equal(range.max, undefined);
});

QUnit.test("get range data, set string period", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ period: "str", argumentType: "numeric" }),
        range = axis.getRangeData();

    assert.equal(range.min, undefined);
    assert.equal(range.max, undefined);
});

QUnit.test("get range data, set zero period", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ period: 0, argumentType: "numeric" }),
        range = axis.getRangeData();

    assert.equal(range.min, undefined);
    assert.equal(range.max, undefined);
});

QUnit.test("get range data, set period, argumentType is string", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ period: 20, argumentType: "string" }),
        range = axis.getRangeData();

    assert.equal(range.min, undefined);
    assert.equal(range.max, undefined);
});

QUnit.test("get range data, set period, argumentType is datetime", function(assert) {
    this.options.min = this.options.max = undefined;
    var axis = this.createDrawnAxis({ period: 20, argumentType: "datetime" }),
        range = axis.getRangeData();

    assert.equal(range.min, undefined);
    assert.equal(range.max, undefined);
});

QUnit.test("get range data, discrete argument axis", function(assert) {
    var axis = this.createDrawnAxis({ type: "discrete" });
    assert.strictEqual(axis.getRangeData().stick, false);
});

QUnit.test("get range data, continuous argument axis", function(assert) {
    var axis = this.createDrawnAxis();
    assert.strictEqual(axis.getRangeData().stick, true);
});

QUnit.test("get range data, spider web", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    var axis = this.createDrawnAxis({});
    assert.strictEqual(axis.getRangeData().stick, true);
    assert.strictEqual(axis.getRangeData().addSpiderCategory, true);
});

QUnit.test("get range data, circular axis. firstPointOnStartAngle", function(assert) {
    this.renderSettings.drawingType = "circular";
    this.options.firstPointOnStartAngle = true;
    var axis = this.createDrawnAxis({});
    assert.strictEqual(axis.getRangeData().stick, true);
    assert.strictEqual(axis.getRangeData().addSpiderCategory, true);
});

QUnit.test("getSpiderTicks. stick = true", function(assert) {
    this.range.stick = true;
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 1, 2]);
    this.tickManager.getBoundaryTicks.returns([]);

    var spiderTicks = this.createDrawnAxis({}).getSpiderTicks();

    assert.equal(spiderTicks.length, 3);
    assert.equal(spiderTicks[0].value, 0);
    assert.equal(spiderTicks[1].value, 1);
    assert.equal(spiderTicks[2].value, 2);
});

QUnit.test("getSpiderTicks. without spiderWeb", function(assert) {
    var axis = this.createDrawnAxis();

    assert.equal(axis.getSpiderTicks(), null);
});

QUnit.test("getSpiderTicks with parameters", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 1, 2]);
    this.tickManager.getBoundaryTicks.returns([]);

    var spiderTicks = this.createDrawnAxis({}).getSpiderTicks(true);

    assert.equal(spiderTicks.length, 3);
    assert.equal(spiderTicks[0].value, 0);
    assert.equal(spiderTicks[1].value, 1);
    assert.equal(spiderTicks[2].value, 2);
});

QUnit.test("draw spider web axis", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 1, 2]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ visible: true });

    assert.deepEqual(this.renderer.path.getCall(0).args[0], [{ x: 10, y: 50 }, { x: 10, y: 50 }, { x: 10, y: 50 }]);
    assert.equal(this.renderer.path.getCall(0).args[1], "area");
    assert.deepEqual(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0], { stroke: "red", "stroke-opacity": 1, "stroke-width": 1 });
    assert.ok(this.renderer.path.getCall(0).returnValue.sharp.calledOnce);
});

QUnit.test("T167450. draw spider web axis, betweenLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 1, 2]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ visible: true, discreteAxisDivisionMode: "betweenLabels" });

    assert.equal(this.translator.translate.lastCall.args[0], 2);
    assert.deepEqual(this.translator.translate.lastCall.args[1], 0, "translator should accept '0' parameter");
    assert.equal(this.orthogonalTranslator.translate.lastCall.args[0], "canvas_position_bottom");
});

QUnit.test("T167450. draw spider web axis, crossLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 1, 2]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ visible: true, discreteAxisDivisionMode: "crossLabels" });

    assert.equal(this.translator.translate.lastCall.args[0], 2);
    assert.equal(this.translator.translate.lastCall.args[1], 0);
    assert.equal(this.orthogonalTranslator.translate.lastCall.args[0], "canvas_position_bottom");
});

QUnit.test("create spider strips", function(assert) {
    this.orthogonalTranslator.translate.withArgs("canvas_position_bottom").returns(10);
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 10, 20, 30]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[19, 53.5, 20, 52, 19, 53, 18.5, 54, 10, 50], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("T167450. create spider strips, betweenLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 10, 20, 30]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }], discreteAxisDivisionMode: "betweenLabels", label: { visible: false } });

    assert.deepEqual(this.translator.translate.args[4], [10, -1], "translator should accept 'false' parameter");
    assert.deepEqual(this.translator.translate.args[5], [20, 1], "translator should accept 'false' parameter");
});

QUnit.test("T167450. create spider strips, crossLabels", function(assert) {
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 10, 20, 30]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }], discreteAxisDivisionMode: "crossLabels", label: { visible: false } });

    assert.deepEqual(this.translator.translate.args[4], [10, -1], "translator should accept 'false' parameter");
    assert.deepEqual(this.translator.translate.args[5], [20, 1], "translator should accept 'false' parameter");
});

QUnit.test("create spider strips, strips from start value", function(assert) {
    this.orthogonalTranslator.translate.withArgs("canvas_position_bottom").returns(10);
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([10, 20, 30]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[19, 53.5, 20, 52, 19, 53, 18.5, 54, 10, 50], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("create spider strips, strips to end value", function(assert) {
    this.orthogonalTranslator.translate.withArgs("canvas_position_bottom").returns(10);
    this.renderSettings.drawingType = "circularSpider";
    this.tickManager.getFullTicks.returns([0, 10, 20, 30]);
    this.tickManager.getBoundaryTicks.returns([]);
    this.createDrawnAxis({ strips: [{ startValue: 20, endValue: 30, color: "red" }] });

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[18, 55, 18, 55, 19, 53, 18, 55, 18, 55, 10, 50], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");
});

QUnit.test("check params for tickManager", function(assert) {
    var axis = this.createDrawnAxis({ showCustomBoundaryTicks: true });
    axis.setTypes("discrete", "numeric", "valueType");
    axis.validate();
    axis.getMajorTicks();
    var tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.deepEqual(args[0], { axisType: "discrete", dataType: "numeric" }, "Types are correct");
    assert.deepEqual(args[1], {
        customMinorTicks: 0,
        customTicks: [0, 2000, 4000, 6000],
        customBoundTicks: undefined,
        max: 5000,
        min: 0,
        screenDelta: 20 * 90 * Math.PI / 180
    }, "Data is correct");
    assert.equal(args[2].circularRadius, 20, "circularRadius");
    assert.equal(args[2].circularStartAngle, 0, "start angle");
    assert.equal(args[2].circularEndAngle, 90, "end angle");
    assert.deepEqual(args[2].addMinMax, { min: true }, "add min max");
    assert.deepEqual(args[2].translate(15), { x: 10, y: 50 }, "translate func");
});

QUnit.test("T170459. Check overlapping options for tickManager. Wrong behavior mode", function(assert) {
    var axis = this.createDrawnAxis({
        label: {
            overlappingBehavior: {
                mode: "rotate",
                rotationAngle: 30,
                staggeringSpace: 4
            }
        }
    });

    assert.deepEqual(axis._tickManager.update.firstCall.args[2].overlappingBehavior, { mode: "enlargeTickInterval" }, "overlapping options");
});

QUnit.test("T170459. Check overlapping options for tickManager. Behavior mode is ignore", function(assert) {
    var axis = this.createDrawnAxis({
        label: {
            overlappingBehavior: {
                mode: "ignore"
            }
        }
    });

    assert.deepEqual(axis._tickManager.update.firstCall.args[2].overlappingBehavior, { mode: "ignore" }, "overlapping options");
});

QUnit.test("T170459. Check overlapping options for tickManager. Behavior mode is enlargeTickInterval", function(assert) {
    var axis = this.createDrawnAxis({
        label: {
            overlappingBehavior: {
                mode: "enlargeTickInterval"
            }
        }
    });

    assert.deepEqual(axis._tickManager.update.firstCall.args[2].overlappingBehavior, { mode: "enlargeTickInterval" }, "overlapping options");
});

QUnit.test("Pass minStickValue and maxStickValue to tickManager", function(assert) {
    this.range.minStickValue = 10;
    this.range.maxStickValue = 100;

    var axis = this.createDrawnAxis({
        label: {
            overlappingBehavior: {
                mode: "enlargeTickInterval"
            }
        }
    });

    assert.deepEqual(axis._tickManager.update.lastCall.args[2].maxStickValue, 100, "maxStickValue passed to tickManager");
    assert.deepEqual(axis._tickManager.update.lastCall.args[2].minStickValue, 10, "minStickValue passed to tickManager");
});

QUnit.test("Screen delta is the length of an arc of the circle (45 - 225)", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([45, 225]);
    this.createDrawnAxis({ showCustomBoundaryTicks: true });

    assert.deepEqual(this.tickManager.update.lastCall.args[1].screenDelta, 20 * 180 * Math.PI / 180);
});

QUnit.test("Screen delta is the length of an arc of the circle (240 - 200)", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([240, 200]);
    this.createDrawnAxis({ showCustomBoundaryTicks: true });

    assert.deepEqual(this.tickManager.update.lastCall.args[1].screenDelta, 20 * 40 * Math.PI / 180);
});

QUnit.module("Linear Axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.createTickManager.restore();

        this.translator = getStub2DTranslatorWithSettings();
        this.orthogonalTranslator = getStub2DTranslatorWithSettings();

        this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([0, 90]);
        this.translator.getRadius = this.orthogonalTranslator.getRadius = sinon.stub().returns(20);
        this.translator.getCenter = this.orthogonalTranslator.getCenter = sinon.stub().returns({ x: 10, y: 20 });

        this.translator.translate.returns(0);
        this.translator.translate.withArgs(10).returns(10);
        this.translator.translate.withArgs(20).returns(20);
        this.orthogonalTranslator.translate.withArgs("canvas_position_start").returns(33 + 90);

        this.renderSettings.drawingType = "linear";
        this.renderSettings.axisType = "polarAxes";
        this.options.startAngle = 33 + 90;
        this.options.endAngle = 63 + 90;
        this.options.min = 0;
        this.options.max = 1000;
        this.options.label = {
            overlappingBehavior: {},
            visible: true,
            alignment: "center",
            font: {
                size: 12,
                color: "black"
            },
            opacity: 1,
            style: {}
        };
    }
}));

QUnit.test("create", function(assert) {
    var axis = this.createSimpleAxis(this.renderer);
    assert.ok(axis);
});

QUnit.test("draw", function(assert) {
    var returnedPath;
    this.createDrawnAxis({ visible: true });

    returnedPath = this.renderer.path.getCall(0);
    assert.equal(this.renderer.path.callCount, 1);
    assert.deepEqual(returnedPath.args[0], [10, 20, 30, 20], "coords");
    assert.deepEqual(returnedPath.args[1], "line");
    assert.deepEqual(returnedPath.returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });
    assert.deepEqual(returnedPath.returnValue.rotate.firstCall.args, [-90, 10, 20]);

    assert.equal(returnedPath.returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
});

QUnit.test("draw ticks", function(assert) {
    this.createDrawnAxis({ tick: { visible: true, length: 20 } });

    assert.equal(this.renderer.path.callCount, 2);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[0, 20, 20, 20], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });

        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.sharp.lastCall.args, [true], "sharped");
    }
});

QUnit.test("discrete axis", function(assert) {
    this.createDrawnAxis({ categories: ["one", "two", "three", "four", "five"], tick: { visible: true } });

    assert.equal(this.renderer.path.callCount, 5);
    for(var i = 0; i < this.renderer.path.callCount; i++) {
        assert.deepEqual(this.renderer.path.getCall(i).args, [[6, 20, 14, 20], "line"]);
        assert.deepEqual(this.renderer.path.getCall(i).returnValue.attr.firstCall.args[0], { "stroke-width": 1, stroke: "red", "stroke-opacity": 1 });

        assert.deepEqual(this.renderer.path.getCall(i).returnValue.rotate.firstCall.args, [33 + 90, 10, 20]);
        assert.equal(this.renderer.path.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[1], "Created elements attached to the group");
    }
});

QUnit.test("create strips", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });
    assert.ok(this.renderer.arc.called);
    assert.deepEqual(this.renderer.arc.getCall(0).args, [10, 20, 10, 20, 0, 360]);
    assert.equal(this.renderer.arc.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.arc.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], "Created element attached to the group");

    assert.deepEqual(this.translator.translate.args[6], [10, -1]);
    assert.deepEqual(this.translator.translate.args[7], [20, 1]);
});

QUnit.test("create strip with label", function(assert) {
    this.createDrawnAxis({ strips: [{ startValue: 10, endValue: 20, color: "green", label: { text: "strip label" } }], label: { visible: false } });

    assert.ok(this.renderer.arc.called);
    assert.equal(this.renderer.text.callCount, 3);
    assert.deepEqual(this.renderer.text.getCall(2).args, ["strip label", 10, 5]);
    assert.equal(this.renderer.text.getCall(2).returnValue.attr.firstCall.args[0].align, "center");
    assert.equal(this.renderer.text.getCall(2).returnValue.append.firstCall.args[0], this.renderSettings.labelAxesGroup.children[0], "created element attached to the group");
});

QUnit.test("create constant line", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green" }] });

    assert.ok(this.renderer.circle.called);
    assert.deepEqual(this.renderer.circle.getCall(0).args, [10, 20, 10]);
    assert.equal(this.renderer.circle.getCall(0).returnValue.attr.firstCall.args[0].stroke, "green");
    assert.equal(this.renderer.circle.getCall(0).returnValue.attr.firstCall.args[0].dashStyle, undefined);
    assert.equal(this.renderer.circle.getCall(0).returnValue.attr.firstCall.args[0]["stroke-width"], undefined);
    assert.equal(this.renderer.circle.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0]);
});

QUnit.test("create constant lines with label", function(assert) {
    this.createDrawnAxis({ constantLines: [{ value: 10, color: "green", label: { visible: true } }], label: { visible: false } });

    assert.ok(this.renderer.circle.called);
    assert.equal(this.renderer.text.callCount, 3);
    assert.deepEqual(this.renderer.text.getCall(2).args, ["10", 10, 10]);
    assert.equal(this.renderer.text.getCall(2).returnValue.attr.firstCall.args[0].align, "center");
    assert.equal(this.renderer.text.getCall(2).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});

QUnit.test("axisDivisionMode is betweenLabels", function(assert) {
    this.createDrawnAxis({ categories: ["one", "two", "three", "four", "five"], discreteAxisDivisionMode: "betweenLabels", tick: { visible: true }, label: { overlappingBehavior: { mode: "ignore" } } });

    assert.deepEqual(this.translator.translate.getCall(0).args[1], 1);
});

QUnit.test("draw labels", function(assert) {
    this.createDrawnAxis({ label: { overlappingBehavior: { mode: "ignore" } } });

    assert.equal(this.renderer.text.callCount, 3);
    for(var i = 1; i < this.renderer.text.callCount; i++) {
        assert.equal(this.renderer.text.getCall(i).args[0], 500 * i);
        assert.equal(this.renderer.text.getCall(i).args[1], 10);
        assert.equal(this.renderer.text.getCall(i).args[2], 20);
        assert.equal(this.renderer.text.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.axesContainerGroup.children[0].children[0], "Created elements attached to the group");
    }
});

QUnit.test("adjust labels", function(assert) {
    var axis = this.createDrawnAxis({ label: { overlappingBehavior: { mode: "ignore" } } });

    assert.equal(axis._majorTicks.length, 3);//TODO fix me

    for(var i = 0; i < axis._majorTicks.length; i++) { // TODO
        assert.equal(Math.round(axis._majorTicks[i].label._stored_settings.x), 18);
        assert.equal(Math.round(axis._majorTicks[i].label._stored_settings.y), 35);
    }
});

QUnit.test("draw grid", function(assert) {
    this.createDrawnAxis({ grid: { visible: true, color: "black", width: 1, opacity: 1 }, label: { overlappingBehavior: { mode: "ignore" } } });

    assert.equal(this.renderer.circle.callCount, 3);
    for(var i = 0; i < this.renderer.circle.callCount; i++) {
        assert.equal(this.renderer.circle.getCall(i).args[0], 10);
        assert.equal(this.renderer.circle.getCall(i).args[1], 20);
        assert.equal(this.renderer.circle.getCall(i).args[2], 0);
        assert.deepEqual(this.renderer.circle.getCall(i).returnValue.attr.firstCall.args[0], {
            "stroke-width": 1,
            stroke: "black",
            "stroke-opacity": 1
        });
        assert.equal(this.renderer.circle.getCall(i).returnValue.append.firstCall.args[0], this.renderSettings.gridGroup.children[0], 'Created elements attached to the group');
        assert.ok(this.renderer.circle.getCall(i).returnValue.sharp.calledOnce);
    }
});

QUnit.test("getRangeData argumentAxis", function(assert) {
    var axis = this.createSimpleAxis({ valueMarginsEnabled: true });

    assert.strictEqual(axis.getRangeData().stick, false);
});

QUnit.test("draw spider grid", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ grid: { visible: true }, label: { overlappingBehavior: { mode: "ignore" } } });

    axis.setSpiderTicks([{ angle: -90 }, { angle: 90 }, { angle: 0 }]);
    axis.draw();
    axis.drawGrids();

    assert.equal(this.renderer.path.callCount, 3);

    $.each(this.renderer.path.getCall(2).args[0], function(_, coord) { //Fix for FF and IE
        coord.x = Math.round(coord.x);
        coord.y = Math.round(coord.y);
    });

    assert.deepEqual(this.renderer.path.getCall(0).args[0], [{ x: 10, y: 20 }, { x: 10, y: 20 }, { x: 10, y: 20 }]);
    assert.deepEqual(this.renderer.path.getCall(1).args[0], [{ x: 10, y: 20 }, { x: 10, y: 20 }, { x: 10, y: 20 }]);
    assert.deepEqual(this.renderer.path.getCall(2).args[0], [{ x: 10, y: 20 }, { x: 10, y: 20 }, { x: 10, y: 20 }]);
});

QUnit.test("grid doesn't drawn without draw static elements", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ grid: { visible: true } });

    axis.setSpiderTicks([{ angle: -90 }, { angle: 90 }, { angle: 0 }]);
    axis.draw();

    assert.ok(!this.renderer.path.celled);
});

QUnit.test("create spider strips", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ strips: [{ startValue: 10, endValue: 20, color: "red" }] });
    axis.setSpiderTicks([{ angle: -90 }, { angle: 90 }, { angle: 0 }]);
    axis.validate();
    axis.draw();

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[[{ x: 10, y: 10 }, { x: 10, y: 30 }, { x: 20, y: 20 }], [{ x: 30, y: 20 }, { x: 10, y: 40 }, { x: 10, y: 0 }]], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].fill, "red");
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.stripsGroup.children[0], 'Created element attached to the group');
});

QUnit.test("create spider constant line", function(assert) {
    this.renderSettings.drawingType = "linearSpider";
    var axis = this.createSimpleAxis({ constantLines: [{ value: 10, color: "green" }] });
    axis.setSpiderTicks([{ angle: -90 }, { angle: 90 }, { angle: 0 }]);
    axis.validate();
    axis.draw();

    assert.ok(this.renderer.path.called);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[{ x: 10, y: 10 }, { x: 10, y: 30 }, { x: 20, y: 20 }], "area"]);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].stroke, "green");
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0].dashStyle, undefined);
    assert.equal(this.renderer.path.getCall(0).returnValue.attr.firstCall.args[0]["stroke-width"], undefined);
    assert.equal(this.renderer.path.getCall(0).returnValue.append.firstCall.args[0], this.renderSettings.constantLinesGroup.children[0], "Created element attached to the group");
});


QUnit.module("Linear Axis. Check params for linear axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;
        this.createTickManager.restore();
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });
        this.tickManager.checkBoundedTicksOverlapping = sinon.stub().returns({});

        this.translator = getStub2DTranslatorWithSettings();
        this.orthogonalTranslator = getStub2DTranslatorWithSettings();

        this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([0, 90]);
        this.translator.getRadius = this.orthogonalTranslator.getRadius = sinon.stub().returns(20);
        this.translator.getCenter = this.orthogonalTranslator.getCenter = sinon.stub().returns({ x: 10, y: 20 });

        this.translator.translate.returns(0);
        this.translator.translate.withArgs(10).returns(10);
        this.translator.translate.withArgs(20).returns(20);
        this.orthogonalTranslator.translate.withArgs("canvas_position_start").returns(33 + 90);

        this.renderSettings.drawingType = "linear";
        this.renderSettings.axisType = "polarAxes";
        this.options.min = 0;
        this.options.max = 1000;
    }
}));

QUnit.test("check params for tickManager", function(assert) {
    var axis = this.createSimpleAxis();

    axis.setTypes("discrete", "numeric", "valueType");
    axis.validate();
    axis.getMajorTicks();
    var tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.deepEqual(args[0], { axisType: "discrete", dataType: "numeric" }, "Types are correct");
    assert.deepEqual(args[1], {
        customMinorTicks: 0,
        customTicks: 0,
        customBoundTicks: undefined,
        max: 1000,
        min: 0,
        screenDelta: 20
    }, "Data is correct");
    assert.deepEqual(args[2].translate(10), 20, "translate func");
});

QUnit.test("check isHorizontal option for tickManager. Start angle is 0", function(assert) {
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(!args[2].isHorizontal);
});

QUnit.test("check isHorizontal option for tickManager. Start angle is 45", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([45, 360]);
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(!args[2].isHorizontal);
});

QUnit.test("check isHorizontal option for tickManager. Start angle is 90", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([90, 360]);
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(args[2].isHorizontal);
});

QUnit.test("check isHorizontal option for tickManager. Start angle is 135", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([135, 360]);
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(!args[2].isHorizontal);
});

QUnit.test("check isHorizontal option for tickManager. Start angle is 180", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([180, 360]);
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(!args[2].isHorizontal);
});

QUnit.test("check isHorizontal option for tickManager. Start angle is 225", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([225, 360]);
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(!args[2].isHorizontal);
});

QUnit.test("check isHorizontal option for tickManager. Start angle is -90", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([-90, 360]);
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(args[2].isHorizontal);
});

QUnit.test("check isHorizontal option for tickManager. Start angle is -45", function(assert) {
    this.translator.getAngles = this.orthogonalTranslator.getAngles = sinon.stub().returns([-45, 360]);
    var axis = this.createSimpleAxis(),
        tm = axis._tickManager,
        args = tm.update.lastCall.args;

    assert.ok(!args[2].isHorizontal);
});

QUnit.test("T170459. Check overlapping options for tickManager. Wrong behavior mode", function(assert) {
    var axis = this.createDrawnAxis({
        label: {
            overlappingBehavior: {
                mode: "rotate",
                rotationAngle: 30,
                staggeringSpace: 4
            }
        }
    });

    assert.deepEqual(axis._tickManager.update.firstCall.args[2].overlappingBehavior, { mode: "enlargeTickInterval" }, "overlapping options");
});

QUnit.test("T170459. Check overlapping options for tickManager. Behavior mode is ignore", function(assert) {
    var axis = this.createDrawnAxis({
        label: {
            overlappingBehavior: {
                mode: "ignore"
            }
        }
    });

    assert.deepEqual(axis._tickManager.update.firstCall.args[2].overlappingBehavior, { mode: "ignore" }, "overlapping options");
});

QUnit.test("T170459. Check overlapping options for tickManager. Behavior mode is enlargeTickInterval", function(assert) {
    var axis = this.createDrawnAxis({
        label: {
            overlappingBehavior: {
                mode: "enlargeTickInterval"
            }
        }
    });

    assert.deepEqual(axis._tickManager.update.firstCall.args[2].overlappingBehavior, { mode: "enlargeTickInterval" }, "overlapping options");
});
