"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    tickManagerModule = require("viz/axes/base_tick_manager"),
    translator2DModule = require("viz/translators/translator2d"),
    rangeModule = require("viz/translators/range"),
    Axis = require("viz/axes/base_axis").Axis;

var TickManagerStubCtor = vizMocks.stubClass(tickManagerModule.TickManager),
    TranslatorStubCtor = vizMocks.stubClass(translator2DModule.Translator2D),
    RangeStubCtor = vizMocks.stubClass(rangeModule.Range);

function create2DTranslator(options) {
    var translator = new TranslatorStubCtor();
    translator.stub("translateSpecialCase");

    translator.stub("getBusinessRange").returns({});
    translator.stub("getVisibleCategories").returns();

    return translator;
}

function createStubTickManager() {
    var tickManager = new TickManagerStubCtor();
    tickManager.stub("getOptions").returns({
        labelOptions: {
            label: {
                visible: true,
                alignment: "center",
                font: {
                    size: 12,
                    color: "black"
                },
                overlappingBehavior: {
                    mode: "ignore"
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

            this.renderer = new vizMocks.Renderer();

            this.tickManager = createStubTickManager();
            this.tickManager.getMaxLabelParams = sinon.stub();
            this.tickManager.getMaxLabelParams.returns({ width: 20, height: 10 });

            that.createTickManager = sinon.spy(tickManagerModule, "TickManager", function() {
                return that.tickManager;
            });

            this.options = {
                isHorizontal: true,
                valueMarginsEnabled: true,
                marker: {
                    visible: true,
                    separatorHeight: 33,
                    textLeftIndent: 7,
                    textTopIndent: 11,
                    topIndent: 10,
                    color: "black",
                    width: 1,
                    opacity: 1,
                    label: {
                        font: {
                            size: 12,
                            color: "green"
                        }
                    }
                },
                width: 1,
                color: "red",
                opacity: 1,
                visible: false,
                tick: { color: "red", width: 1, visible: false, opacity: 1 },
                label: {
                    visible: true,
                    alignment: "center",
                    font: { size: 12, color: "black" },
                    opacity: 1,
                    style: {},
                    overlappingBehavior: {
                        mode: "ignore"
                    }
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
            this.css = require("viz/core/utils").patchFontOptions(this.options.marker.label.font);
        },
        afterEach: function() {
            this.createTickManager.restore();
        },
        createAxis: function(renderSettings, options) {
            var axis = new Axis(renderSettings);
            axis.updateOptions(options);

            return axis;
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
        createDrawnAxis: function(opt) {
            var axis = this.createSimpleAxis(opt);
            axis.validate();
            axis.draw();
            axis.drawGrids();
            return axis;
        }
    },
    environment2DTranslator = $.extend({}, environment, {
        beforeEach: function() {
            environment.beforeEach.apply(this, arguments);
            this.translator = create2DTranslator();
            this.orthogonalTranslator = create2DTranslator();

            this.options.position = "bottom";
            this.options.label = {
                overlappingBehavior: {
                    mode: "ignore"
                },
                alignment: "center",
                indentFromAxis: 10,
                format: ""
            };
            this.options.isHorizontal = false;
        }
    });

QUnit.module("Ticks skipping. Normal axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;

        that.tickManager.stub("getTicks").returns(["c1", "c2", "c3", "c4"]);
        that.tickManager.getOptions.returns({ labelOptions: { visible: false, alignment: "center", overlappingBehavior: { mode: "ignore" } } });
        this.createTickManager.restore();
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        this.translator = getStub2DTranslatorWithSettings();
        this.orthogonalTranslator = getStub2DTranslatorWithSettings();
        this.options.drawingType = "linear";
        this.options.axisType = "xyAxes";
        this.options.categories = ["c1", "c2", "c3", "c4"];
    }
}));

QUnit.test("axisDivisionMode is betweenLabels", function(assert) {
    this.createDrawnAxis({
        discreteAxisDivisionMode: "betweenLabels"
    });

    assert.equal(this.translator.translate.callCount, 3);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 1, false]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 1, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 1, false]);
});

QUnit.test("axisDivisionMode is crossLabels", function(assert) {
    this.createDrawnAxis({
        discreteAxisDivisionMode: "crossLabels"
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 0, false]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 0, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 0, false]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 0, false]);
});

QUnit.test("doesn't have categories", function(assert) {
    this.options.categories = [];
    this.createDrawnAxis({
        categories: [],
        discreteAxisDivisionMode: "betweenLabels"
    });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, ["c1", 1, false]);
    assert.deepEqual(this.translator.translate.getCall(1).args, ["c2", 1, false]);
    assert.deepEqual(this.translator.translate.getCall(2).args, ["c3", 1, false]);
    assert.deepEqual(this.translator.translate.getCall(3).args, ["c4", 1, false]);
});

QUnit.test("Change visible markers when axis type is discrete", function(assert) {
    this.createSimpleAxis({ type: "discrete" });

    //assert
    assert.strictEqual(this.tickManager.update.lastCall.args[2].isMarkersVisible, false);
});

QUnit.module("Semidiscrete axis", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        var that = this;

        that.tickManager.stub("getTicks").returns([1, 2, 3, 4]);
        that.tickManager.getOptions.returns({ labelOptions: { visible: false, alignment: "center", overlappingBehavior: { mode: "ignore" } } });
        this.createTickManager.restore();
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        this.translator = getStub2DTranslatorWithSettings();
        this.orthogonalTranslator = getStub2DTranslatorWithSettings();
        this.options.drawingType = "linear";
        this.options.axisType = "xyAxes";
    }
}));

QUnit.test("translates coordinates with tickInterval info", function(assert) {
    this.createDrawnAxis({ type: "semidiscrete", tickInterval: 5 });

    assert.equal(this.translator.translate.callCount, 4);
    assert.deepEqual(this.translator.translate.getCall(0).args, [1, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(1).args, [2, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(2).args, [3, 0, 5]);
    assert.deepEqual(this.translator.translate.getCall(3).args, [4, 0, 5]);
});

QUnit.module("checkAlignmentConstantLineLabels", environment2DTranslator);

QUnit.test("Horizontal Axis, outside", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "outside", verticalAlignment: "center", horizontalAlignment: "left" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "top");
    assert.equal(labelOptions.horizontalAlignment, "center");
});

QUnit.test("Horizontal Axis, inside", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "inside", verticalAlignment: "center", horizontalAlignment: "center" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "center");
    assert.equal(labelOptions.horizontalAlignment, "right");
});

QUnit.test("Vertical Axis, outside", function(assert) {
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "outside", verticalAlignment: "left", horizontalAlignment: "center" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "center");
    assert.equal(labelOptions.horizontalAlignment, "right");
});

QUnit.test("Vertical Axis, inside", function(assert) {
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "inside", verticalAlignment: "center", horizontalAlignment: "center" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "top");
    assert.equal(labelOptions.horizontalAlignment, "center");
});

QUnit.test("verticalAlignment and horizontalAlignment specify wrong", function(assert) {
    this.options.isHorizontal = true;
    var axis = this.createSimpleAxis(),
        labelOptions = { position: "outside", verticalAlignment: "ToP", horizontalAlignment: "CeNtEr" };

    axis._checkAlignmentConstantLineLabels(labelOptions);

    assert.equal(labelOptions.verticalAlignment, "top");
    assert.equal(labelOptions.horizontalAlignment, "center");
});

QUnit.test("horizontalAlignment = center", function(assert) {
    this.translator.stub("translate").withArgs(20).returns(2);
    var bBox = [{ x: 3, y: 20, width: 40, height: 10 }],
        bBoxesPointer = 0,
        axis = this.createSimpleAxis({
            constantLines: [{
                value: 20,
                paddingTopBottom: 0,
                label: {
                    visible: true,
                    position: "inside",
                    horizontalAlignment: "center"
                }
            }]
        }),
        defaultBBox = this.renderer.bBoxTemplate;

    axis.validate();

    this.renderer.bBoxTemplate = function() {
        return bBox[bBoxesPointer++] || defaultBBox;
    };
    axis.draw();

    assert.deepEqual(this.renderer.text.lastCall.returnValue.move.lastCall.args, [-12, -28]);
});

QUnit.module("Formats for constant line labels", environment2DTranslator);

QUnit.test("Currency format", function(assert) {
    var axis = this.createSimpleAxis({ label: { format: "currency" } });

    axis._drawConstantLineLabels(30, {}, 0, this.renderer.g());

    assert.equal(this.renderer.text.getCall(0).args[0], "$30");
});

QUnit.test("Percent format", function(assert) {
    var axis = this.createSimpleAxis({ label: { format: "percent" } });

    axis._drawConstantLineLabels(30, {}, 0, this.renderer.g());

    assert.equal(this.renderer.text.getCall(0).args[0], "3,000%");
});

QUnit.test("Date format with month", function(assert) {
    var axis = this.createSimpleAxis({ label: { format: "month" } });

    axis._drawConstantLineLabels(new Date(2010, 0, 10), {}, 0, this.renderer.g());

    assert.equal(this.renderer.text.getCall(0).args[0], "January");
});


QUnit.module("API methods", environment2DTranslator);

QUnit.test("axis position is top", function(assert) {
    this.options.isHorizontal = true;
    this.orthogonalTranslator.translateSpecialCase.returns(425);
    var axis = this.createDrawnAxis({ position: "top" });

    assert.deepEqual(axis.getLabelsPosition(), 415);
});

QUnit.test("axis position is bottom", function(assert) {
    this.options.isHorizontal = true;
    this.orthogonalTranslator.translateSpecialCase.returns(0);
    var axis = this.createDrawnAxis({ position: "bottom" });

    assert.deepEqual(axis.getLabelsPosition(), 10);
});

QUnit.test("axis position is left", function(assert) {
    this.translator = create2DTranslator();
    this.orthogonalTranslator = create2DTranslator();
    this.orthogonalTranslator.translateSpecialCase.returns(70);
    var axis = this.createDrawnAxis({ position: "left" });

    assert.deepEqual(axis.getLabelsPosition(), 60);
});

QUnit.test("axis position is right", function(assert) {
    this.translator = create2DTranslator();
    this.orthogonalTranslator = create2DTranslator();
    this.orthogonalTranslator.translateSpecialCase.returns(570);
    var axis = this.createDrawnAxis({ position: "right" });

    assert.deepEqual(axis.getLabelsPosition(), 580);
});

QUnit.test("measure labels", function(assert) {
    var axis = this.createSimpleAxis(),
        measurements;

    measurements = axis.measureLabels();

    assert.deepEqual(measurements, {
        width: 20,
        height: 10,
        x: 1,
        y: 2
    }, "measurements");
});


QUnit.module("Date markers", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.options.argumentType = "datetime";
        this.options.label.visible = false;
        this.options.label.indentFromAxis = 10;
    },
    createAxis: function(range, majorTicks) {
        var that = this;

        that.createTickManager.restore();
        that.tickManager.stub("getTickInterval").returns(that.options.tickInterval);
        that.tickManager.stub("getOptions").returns({ labelOptions: that.options.label });
        that.tickManager.stub("getTicks").returns(majorTicks);
        this.createTickManager = sinon.stub(tickManagerModule, "TickManager", function() {
            return that.tickManager;
        });

        that.translator = create2DTranslator({});
        that.translator.getBusinessRange.returns({ minVisible: range.min, maxVisible: range.max, min: "min", max: "max", invert: range.invert, addRange: function() { } });
        that.translator.stub("translate");
        that.additionalTranslator = create2DTranslator({});
        that.additionalTranslator.stub("translateSpecialCase").returns(200);

        var axis = environment.createAxis.call(this, this.renderSettings, this.options);
        axis.setTranslator(this.translator, this.additionalTranslator);
        axis.setTicks({ majorTicks: majorTicks, minorTicks: {} });

        return axis;
    }
}));

QUnit.test("Draw date marker when axis type is discrete", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123),
        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        axis,
        texts,
        lines;

    this.options.type = "discrete";
    this.options.tickInterval = "hour";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date01).returns(20);

    //act
    axis.draw();

    //assert
    texts = this.renderer.text;
    lines = this.renderer.path;

    assert.notOk(texts.called);
    assert.notOk(lines.called);
});

QUnit.test("Draw date marker with delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123),
        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        axis,
        texts,
        lines,
        group;

    this.options.tickInterval = "hour";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date01).returns(20);

    axis.draw();
    //act

    //assert
    texts = this.renderer.text;
    lines = this.renderer.path;

    assert.equal(texts.callCount, 2);
    assert.equal(lines.callCount, 3);
    assert.equal(lines.firstCall.args[1], "line");

    assert.deepEqual(lines.firstCall.returnValue.attr.firstCall.args[0], {
        "stroke": "black",
        "stroke-opacity": 1,
        "stroke-width": 1,
        sharp: "h"
    });

    assert.equal(texts.firstCall.args[0], "Sunday, 26");
    assert.equal(texts.lastCall.args[0], "Saturday, 25");

    //x
    assert.equal(texts.firstCall.args[1], 0);
    assert.equal(texts.lastCall.args[1], 0);
    assert.equal(lines.firstCall.args[0][0], 20);
    assert.equal(lines.firstCall.args[0][2], 20);
    //y
    assert.equal(texts.firstCall.args[2], 0);
    assert.equal(texts.lastCall.args[2], 0);
    assert.equal(lines.firstCall.args[0][1], 230);
    assert.equal(lines.firstCall.args[0][3], 263);

    //moved
    assert.equal(texts.firstCall.returnValue.move.lastCall.args[0], 28);
    assert.equal(texts.firstCall.returnValue.move.lastCall.args[1], 246);

    assert.equal(texts.lastCall.returnValue.move.lastCall.args[0], 8);
    assert.equal(texts.lastCall.returnValue.move.lastCall.args[1], 246);

    //append
    group = this.renderer.g.getCall(8).returnValue;
    assert.deepEqual(lines.firstCall.returnValue.append.lastCall.args[0], group, "label group must be correct");
    assert.deepEqual(texts.firstCall.returnValue.append.lastCall.args[0], group, "label group must be correct");
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], group, "label group must be correct");

    //css
    assert.deepEqual(texts.firstCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with millisecond delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 1, 21, 33, 988),
        date1 = new Date(2011, 5, 25, 1, 21, 33, 999),
        date2 = new Date(2011, 5, 25, 1, 21, 34, 2),
        texts,
        axis;

    this.options.tickInterval = "millisecond";
    this.options.marker.label.format = "longTime";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "1:21:34 AM");
    assert.equal(texts.lastCall.args[0], "1:21:33 AM");

    //append
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], this.renderer.g.getCall(8).returnValue, "label group must be correct");

    //css
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with second delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 1, 21, 33, 123),
        date1 = new Date(2011, 5, 25, 1, 22, 3, 122),
        date2 = new Date(2011, 5, 25, 1, 22, 23, 582),
        texts,
        axis;

    this.options.tickInterval = "second";
    this.options.marker.label.format = "longTime";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.lastCall.args[0], "1:21:33 AM");
    assert.equal(texts.firstCall.args[0], "1:22:00 AM");

    //append
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], this.renderer.g.getCall(8).returnValue, "label group must be correct");

    //css
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with minute delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 1, 59, 33, 123),
        date1 = new Date(2011, 5, 25, 2, 2, 33, 122),
        date2 = new Date(2011, 5, 25, 2, 3, 33, 582),
        texts,
        axis;

    this.options.tickInterval = "minute";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.lastCall.args[0], "1:59 AM");
    assert.equal(texts.firstCall.args[0], "2:00 AM");

    //append
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], this.renderer.g.getCall(8).returnValue, "label group must be correct");

    //css
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with day delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 30, 1, 21, 33, 123),
        date1 = new Date(2011, 6, 1, 2, 22, 34, 122),
        date2 = new Date(2011, 6, 2, 2, 22, 34, 122),
        texts,
        axis,
        translateObj = [];

    this.options.tickInterval = "day";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2], translateObj);
    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "July");
    assert.equal(texts.lastCall.args[0], "June");
    //append
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], this.renderer.g.getCall(8).returnValue, "label group must be correct");

    //css
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with week delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 30),
        date1 = new Date(2011, 6, 7),
        date2 = new Date(2011, 6, 14),
        date01 = new Date(2011, 6, 1),
        texts,
        axis;

    this.options.tickInterval = "week";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date01).returns(20);

    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "July");
    assert.equal(texts.lastCall.args[0], "June");

    //append
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], this.renderer.g.getCall(8).returnValue, "label group must be correct");

    //css
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with month delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 11, 25, 1, 21, 33),
        date1 = new Date(2012, 2, 25, 1, 21, 33),
        date2 = new Date(2012, 3, 25, 1, 21, 33),
        texts,
        axis;

    this.options.tickInterval = "month";
    this.options.marker.label.format = "shortDateShortTime";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "1/1/2012, 12:00 AM");
    assert.equal(texts.lastCall.args[0], "12/25/2011, 1:21 AM");

    //append
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], this.renderer.g.getCall(8).returnValue, "label group must be correct");

    //css
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with quarter delta", function(assert) {
    //arrange
    var date0 = new Date(2011, 11, 25, 1, 21, 33, 123),
        date1 = new Date(2012, 4, 25, 1, 21, 33, 123),
        date2 = new Date(2012, 11, 25, 1, 21, 33, 123),
        date01 = new Date(2012, 3, 1, 0, 0, 0, 0),
        texts,
        axis;

    this.options.tickInterval = "quarter";
    this.options.marker.label.format = "shortdate";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date01).returns(20);

    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "1/1/2012");
    assert.equal(texts.lastCall.args[0], "12/25/2011");

    //append
    assert.deepEqual(texts.lastCall.returnValue.append.lastCall.args[0], this.renderer.g.getCall(8).returnValue, "label group must be correct");

    //css
    assert.deepEqual(texts.lastCall.returnValue.css.lastCall.args[0], this.css, "label font must be correct");
});

QUnit.test("Date marker with day delta and month boundary tick", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25),
        date1 = new Date(2011, 6, 1),
        date2 = new Date(2011, 6, 18),
        texts,
        axis;

    this.options.tickInterval = "day";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(20);
    this.translator.translate.withArgs(date2).returns(40);

    axis.draw();

    //assert
    texts = this.renderer.text;
    assert.equal(texts.callCount, 2);
    assert.equal(texts.firstCall.args[0], "July");
    assert.equal(texts.lastCall.args[0], "June");
});

QUnit.test("Draw date marker with customizeText", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 26, 2, 21, 33, 123),
        texts,
        lines,
        axis;

    this.options.tickInterval = "hour";
    this.options.marker.label.customizeText = function() { return "custom text - " + this.valueText; };
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);

    axis.draw();

    //assert
    texts = this.renderer.text;
    lines = this.renderer.path;
    assert.equal(texts.callCount, 2);
    assert.equal(lines.callCount, 3);
    assert.equal(texts.firstCall.args[0], "custom text - Sunday, 26");
    assert.equal(texts.lastCall.args[0], "custom text - Saturday, 25");
});

//B231179
QUnit.test("Draw date overlapping markers", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 27, 2, 21, 33, 123),
        date3 = new Date(2011, 5, 28, 2, 21, 33, 123),
        date4 = new Date(2011, 5, 29, 2, 21, 33, 123),
        date5 = new Date(2011, 5, 30, 2, 21, 33, 123),

        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0, 0),
        date03 = new Date(2011, 5, 28, 0, 0, 0, 0),
        date04 = new Date(2011, 5, 29, 0, 0, 0, 0),
        date05 = new Date(2011, 5, 30, 0, 0, 0, 0),
        texts,
        lines,
        axis,
        i = 0,
        disposedTexts = [],
        disposedLines = [];

    var baseCreateText = this.renderer.stub("text"),
        bBoxCount = 0,
        markersBBoxes = [{ width: 30, height: 14 }, { width: 10, height: 14 }, { width: 20, height: 14 }, { width: 90, height: 14 }, { width: 5, height: 14 }, { width: 40, height: 14 }];

    this.renderer.text = sinon.spy(function() {
        var element = baseCreateText.apply(this, arguments);
        element.getBBox = function() { return markersBBoxes[bBoxCount++]; };
        return element;
    });

    this.options.tickInterval = "hour";
    axis = this.createAxis({ min: date0, max: date5 }, [date0, date1, date2, date3, date4, date5]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date3).returns(50);
    this.translator.translate.withArgs(date4).returns(60);
    this.translator.translate.withArgs(date5).returns(70);

    this.translator.translate.withArgs(date01).returns(20);
    this.translator.translate.withArgs(date02).returns(40);
    this.translator.translate.withArgs(date03).returns(60);
    this.translator.translate.withArgs(date04).returns(80);
    this.translator.translate.withArgs(date05).returns(100);

    axis.draw();

    //assert
    texts = this.renderer.text;
    lines = this.renderer.path;

    assert.equal(texts.callCount, 6, "drawing texts");
    assert.equal(lines.callCount, 9, "drawing lines");

    for(i; i < texts.callCount; i++) {
        if(texts.getCall(i).returnValue.dispose.called) {
            disposedTexts.push(texts.getCall(i).args[0]);
        }
    }
    for(i = 0; i < lines.callCount; i++) {
        if(lines.getCall(i).returnValue.dispose.called) {
            disposedLines.push(lines.getCall(i).args[0]);
        }
    }
    assert.equal(disposedTexts.length, 3);
    assert.equal(disposedTexts[0], "Monday, 27");
    assert.equal(disposedTexts[1], "Wednesday, 29");
    assert.equal(disposedTexts[2], "Saturday, 25");
    assert.equal(disposedLines.length, 2);
});

QUnit.test("Draw date overlapping markers 1px", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 27, 2, 21, 33, 123),
        date3 = new Date(2011, 5, 28, 2, 21, 33, 123),
        date4 = new Date(2011, 5, 29, 2, 21, 33, 123),
        date5 = new Date(2011, 5, 30, 2, 21, 33, 123),
        date6 = new Date(2011, 5, 31, 2, 21, 33, 123),

        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0, 0),
        date03 = new Date(2011, 5, 28, 0, 0, 0, 0),
        date04 = new Date(2011, 5, 29, 0, 0, 0, 0),
        date05 = new Date(2011, 5, 30, 0, 0, 0, 0),
        texts,
        lines,
        axis,
        i = 0,
        disposedElements = [];

    var baseCreateText = this.renderer.stub("text"),
        bBoxCount = 0,
        markersBBoxes = [{ width: 12, height: 14 }, { width: 11, height: 14 }, { width: 11, height: 14 }, { width: 12, height: 14 }, { width: 10, height: 14 }, { width: 11, height: 14 }, { width: 11, height: 14 }];

    this.renderer.text = sinon.spy(function() {
        var element = baseCreateText.apply(this, arguments);
        element.getBBox = sinon.spy(function() { return markersBBoxes[bBoxCount++]; });
        return element;
    });

    this.options.tickInterval = "hour";
    this.options.marker.label.format = "shortDateShortTime";
    axis = this.createAxis({ min: date0, max: date6 }, [date0, date1, date2, date3, date4, date5, date6]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date3).returns(50);
    this.translator.translate.withArgs(date4).returns(60);
    this.translator.translate.withArgs(date5).returns(70);
    this.translator.translate.withArgs(date6).returns(80);

    this.translator.translate.withArgs(date01).returns(20);
    this.translator.translate.withArgs(date02).returns(40);
    this.translator.translate.withArgs(date03).returns(60);
    this.translator.translate.withArgs(date04).returns(80);
    this.translator.translate.withArgs(date05).returns(100);

    axis.draw();

    //assert
    texts = this.renderer.text;
    lines = this.renderer.path;

    assert.equal(texts.callCount, 7, "drawing texts");
    assert.equal(lines.callCount, 10, "drawing lines");

    for(i; i < texts.callCount; i++) {
        if(!texts.getCall(i).returnValue.dispose.called) {
            disposedElements.push(texts.getCall(i).args[0]);
        }
    }

    assert.equal(disposedElements.length, 4);

    assert.equal(disposedElements[0], "6/26/2011, 12:00 AM");
    assert.equal(disposedElements[1], "6/28/2011, 12:00 AM");
    assert.equal(disposedElements[2], "6/29/2011, 12:00 AM");
    assert.equal(disposedElements[3], "6/25/2011, 11:21 PM");
});

QUnit.test("Initialize markers trackers", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23),
        date1 = new Date(2011, 5, 26, 0),
        date2 = new Date(2011, 5, 27, 2),
        date3 = new Date(2011, 5, 28),

        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0, 0),
        date03 = new Date(2011, 5, 28, 0, 0, 0, 0),
        axis,
        group,
        path;

    this.options.tickInterval = "hour";
    this.options.endValue = "endValue";
    axis = this.createAxis({ min: date0, max: date3 }, [date0, date1, date2, date3]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(60);
    this.translator.translate.withArgs(date3).returns(90);

    this.translator.translate.withArgs(date01).returns(10);
    this.translator.translate.withArgs(date02).returns(40);
    this.translator.translate.withArgs(date03).returns(90);

    //act
    axis.draw();
    path = this.renderer.path;
    group = this.renderer.g.getCall(8).returnValue;
    //assert
    assert.equal(path.callCount, 7);

    assert.deepEqual(path.getCall(3).args[0], [0, 230, 0, 263, 10, 263, 10, 230, 0, 230]);
    assert.deepEqual(path.getCall(3).returnValue.attr.args[0][0], {
        "stroke-width": 1,
        stroke: "grey",
        fill: "grey",
        "fill-opacity": 0.0001,
        "stroke-opacity": 0.0001
    });
    assert.deepEqual(path.getCall(3).returnValue.append.args[0][0], group);
    assert.deepEqual(path.getCall(3).returnValue.data.args[0][1], { startValue: date0, endValue: date01 });

    assert.deepEqual(path.getCall(4).args[0], [10, 230, 10, 263, 40, 263, 40, 230, 10, 230]);
    assert.deepEqual(path.getCall(4).returnValue.attr.args[0][0], {
        "stroke-width": 1,
        stroke: "grey",
        fill: "grey",
        "fill-opacity": 0.0001,
        "stroke-opacity": 0.0001
    });
    assert.deepEqual(path.getCall(4).returnValue.append.args[0][0], group);
    assert.deepEqual(path.getCall(4).returnValue.data.args[0][1], { startValue: date01, endValue: date02 });

    assert.deepEqual(path.getCall(5).args[0], [40, 230, 40, 263, 90, 263, 90, 230, 40, 230]);
    assert.deepEqual(path.getCall(5).returnValue.attr.args[0][0], {
        "stroke-width": 1,
        stroke: "grey",
        fill: "grey",
        "fill-opacity": 0.0001,
        "stroke-opacity": 0.0001
    });
    assert.deepEqual(path.getCall(5).returnValue.append.args[0][0], group);
    assert.deepEqual(path.getCall(5).returnValue.data.args[0][1], { startValue: date02, endValue: date03 });

    assert.deepEqual(path.getCall(6).args[0], [90, 230, 90, 263, 20, 263, 20, 230, 90, 230]);
    assert.deepEqual(path.getCall(6).returnValue.attr.args[0][0], {
        "stroke-width": 1,
        stroke: "grey",
        fill: "grey",
        "fill-opacity": 0.0001,
        "stroke-opacity": 0.0001
    });
    assert.deepEqual(path.getCall(6).returnValue.append.args[0][0], group);
    assert.deepEqual(path.getCall(6).returnValue.data.args[0][1], { startValue: date03, endValue: "max" });
});

//T294869
QUnit.test("Initialize markers trackers with inverted scale", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23),
        date1 = new Date(2011, 5, 26, 1),
        date2 = new Date(2011, 5, 27, 2),
        date3 = new Date(2011, 5, 28, 1),
        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0, 0),
        date03 = new Date(2011, 5, 28, 0, 0, 0, 0),
        axis,
        texts,
        path;

    this.options.tickInterval = "hour";
    this.options.endValue = "startValue";
    axis = this.createAxis({ min: date0, max: date3, invert: true }, [date0, date1, date2, date3]);

    this.translator.translate.withArgs(date0).returns(60);
    this.translator.translate.withArgs(date1).returns(45);
    this.translator.translate.withArgs(date2).returns(25);
    this.translator.translate.withArgs(date3).returns(5);

    this.translator.translate.withArgs(date01).returns(50);
    this.translator.translate.withArgs(date02).returns(30);
    this.translator.translate.withArgs(date03).returns(10);

    this.translator.stub("translateSpecialCase").returns(5);

    //act
    axis.draw();
    path = this.renderer.path;
    texts = this.renderer.text;
    //assert
    assert.equal(path.callCount, 7);
    assert.equal(texts.callCount, 4);

    assert.deepEqual(path.getCall(3).args[0], [60, 230, 60, 263, 50, 263, 50, 230, 60, 230]);
    assert.deepEqual(path.getCall(3).returnValue.data.args[0][1], { startValue: date0, endValue: date01 });

    assert.deepEqual(path.getCall(4).args[0], [50, 230, 50, 263, 30, 263, 30, 230, 50, 230]);
    assert.deepEqual(path.getCall(4).returnValue.data.args[0][1], { startValue: date01, endValue: date02 });

    assert.deepEqual(path.getCall(5).args[0], [30, 230, 30, 263, 10, 263, 10, 230, 30, 230]);
    assert.deepEqual(path.getCall(5).returnValue.data.args[0][1], { startValue: date02, endValue: date03 });

    assert.deepEqual(path.getCall(6).args[0], [10, 230, 10, 263, 5, 263, 5, 230, 10, 230]);
    assert.deepEqual(path.getCall(6).returnValue.data.args[0][1], { startValue: date03, endValue: "max" });

    //moved
    assert.deepEqual(texts.getCall(0).returnValue.move.lastCall.args, [22, 246]);
    assert.deepEqual(texts.getCall(1).returnValue.move.lastCall.args, [2, 246]);
    assert.deepEqual(texts.getCall(2).returnValue.move.lastCall.args, [-18, 246]);
    assert.deepEqual(texts.getCall(3).returnValue.move.lastCall.args, [32, 246]);
});

//T402810
QUnit.test("First and last markers exceed bounds - dispose only labels", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 27, 2, 21, 33, 123),
        date3 = new Date(2011, 5, 28, 2, 21, 33, 123),
        date4 = new Date(2011, 5, 29, 2, 21, 33, 123),
        date5 = new Date(2011, 5, 30, 2, 21, 33, 123),

        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0, 0),
        date03 = new Date(2011, 5, 28, 0, 0, 0, 0),
        date04 = new Date(2011, 5, 29, 0, 0, 0, 0),
        date05 = new Date(2011, 5, 30, 0, 0, 0, 0),
        texts,
        lines,
        axis,
        i = 0,
        disposedTexts = [],
        disposedLines = [];

    var baseCreateText = this.renderer.stub("text"),
        bBoxCount = 0,
        markersBBoxes = [{ width: 10, height: 14 }, { width: 10, height: 14 }, { width: 10, height: 14 }, { width: 10, height: 14 }, { width: 20, height: 14  /*Friday, 30*/ }, { width: 40, height: 14 /*Saturday, 25*/ }];

    this.renderer.text = sinon.spy(function() {
        var element = baseCreateText.apply(this, arguments);
        element.getBBox = function() { return markersBBoxes[bBoxCount++]; };
        return element;
    });

    this.options.tickInterval = "hour";
    axis = this.createAxis({ min: date0, max: date5 }, [date0, date1, date2, date3, date4, date5]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(25);
    this.translator.translate.withArgs(date2).returns(45);
    this.translator.translate.withArgs(date3).returns(65);
    this.translator.translate.withArgs(date4).returns(85);
    this.translator.translate.withArgs(date5).returns(105);

    this.translator.translate.withArgs(date01).returns(20);
    this.translator.translate.withArgs(date02).returns(40);
    this.translator.translate.withArgs(date03).returns(60);
    this.translator.translate.withArgs(date04).returns(80);
    this.translator.translate.withArgs(date05).returns(100);
    this.translator.stub("translateSpecialCase").returns(110);

    axis.draw();

    //assert
    texts = this.renderer.text;
    lines = this.renderer.path;

    assert.equal(texts.callCount, 6, "drawing texts");
    assert.equal(lines.callCount, 11, "drawing lines");

    for(i; i < texts.callCount; i++) {
        if(texts.getCall(i).returnValue.dispose.called) {
            disposedTexts.push(texts.getCall(i).args[0]);
        }
    }
    for(i; i < lines.callCount; i++) {
        if(lines.getCall(i).returnValue.dispose.called) {
            disposedLines.push(lines.getCall(i).args[0]);
        }
    }
    assert.equal(disposedTexts.length, 2);
    assert.equal(disposedTexts[0], "Thursday, 30");
    assert.equal(disposedTexts[1], "Saturday, 25");
    assert.equal(disposedLines.length, 0);
});

//T402810
QUnit.test("First and last markers exceed bounds - dispose only labels. Inverted", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 27, 2, 21, 33, 123),
        date3 = new Date(2011, 5, 28, 2, 21, 33, 123),
        date4 = new Date(2011, 5, 29, 2, 21, 33, 123),
        date5 = new Date(2011, 5, 30, 2, 21, 33, 123),

        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0, 0),
        date03 = new Date(2011, 5, 28, 0, 0, 0, 0),
        date04 = new Date(2011, 5, 29, 0, 0, 0, 0),
        date05 = new Date(2011, 5, 30, 0, 0, 0, 0),
        texts,
        lines,
        axis,
        i = 0,
        disposedTexts = [],
        disposedLines = [];

    var baseCreateText = this.renderer.stub("text"),
        bBoxCount = 0,
        markersBBoxes = [{ width: 10, height: 14 }, { width: 10, height: 14 }, { width: 10, height: 14 }, { width: 10, height: 14 }, { width: 10, height: 14 }, { width: 20, height: 14  /*Friday, 30*/ }, { width: 40, height: 14 /*Saturday, 25*/ }];

    this.renderer.text = sinon.spy(function() {
        var element = baseCreateText.apply(this, arguments);
        element.getBBox = function() { return markersBBoxes[bBoxCount++]; };
        return element;
    });

    this.options.tickInterval = "hour";
    axis = this.createAxis({ min: date0, max: date5, invert: true }, [date0, date1, date2, date3, date4, date5]);

    this.translator.translate.withArgs(date5).returns(0);
    this.translator.translate.withArgs(date4).returns(15);
    this.translator.translate.withArgs(date3).returns(35);
    this.translator.translate.withArgs(date2).returns(55);
    this.translator.translate.withArgs(date1).returns(75);
    this.translator.translate.withArgs(date0).returns(105);

    this.translator.translate.withArgs(date05).returns(20);
    this.translator.translate.withArgs(date04).returns(40);
    this.translator.translate.withArgs(date03).returns(60);
    this.translator.translate.withArgs(date02).returns(80);
    this.translator.translate.withArgs(date01).returns(100);
    this.translator.stub("translateSpecialCase").returns(0);

    axis.draw();

    //assert
    texts = this.renderer.text;
    lines = this.renderer.path;

    assert.equal(texts.callCount, 6, "drawing texts");
    assert.equal(lines.callCount, 11, "drawing lines");

    for(i; i < texts.callCount; i++) {
        if(texts.getCall(i).returnValue.dispose.called) {
            disposedTexts.push(texts.getCall(i).args[0]);
        }
    }
    for(i = 0; i < lines.callCount; i++) {
        if(lines.getCall(i).returnValue.dispose.called) {
            disposedLines.push(lines.getCall(i).args[0]);
        }
    }
    assert.equal(disposedTexts.length, 2);
    assert.equal(disposedTexts[0], "Thursday, 30");
    assert.equal(disposedTexts[1], "Saturday, 25");
    assert.equal(disposedLines.length, 0);
});

//T402810
QUnit.test("First and last markers exceed bounds - add hint for deleted labels", function(assert) {
    //arrange
    var date0 = new Date(2011, 5, 25, 23, 21, 33, 123),
        date1 = new Date(2011, 5, 26, 1, 21, 33, 123),
        date2 = new Date(2011, 5, 27, 2, 21, 33, 123),
        date3 = new Date(2011, 5, 28, 2, 21, 33, 123),
        date4 = new Date(2011, 5, 29, 2, 21, 33, 123),
        date5 = new Date(2011, 5, 30, 2, 21, 33, 123),

        date01 = new Date(2011, 5, 26, 0, 0, 0, 0),
        date02 = new Date(2011, 5, 27, 0, 0, 0, 0),
        date03 = new Date(2011, 5, 28, 0, 0, 0, 0),
        date04 = new Date(2011, 5, 29, 0, 0, 0, 0),
        date05 = new Date(2011, 5, 30, 0, 0, 0, 0),
        path,
        axis;

    var baseCreateText = this.renderer.stub("text"),
        bBoxCount = 0,
        markersBBoxes = [{ width: 10, height: 14 }, { width: 10, height: 14 }, { width: 10, height: 14 }, { width: 10, height: 14 }, { width: 20, height: 14  /*Friday, 30*/ }, { width: 40, height: 14 /*Saturday, 25*/ }];

    this.renderer.text = sinon.spy(function() {
        var element = baseCreateText.apply(this, arguments);
        element.getBBox = function() { return markersBBoxes[bBoxCount++]; };
        return element;
    });

    this.options.tickInterval = "hour";
    axis = this.createAxis({ min: date0, max: date5 }, [date0, date1, date2, date3, date4, date5]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(30);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date3).returns(50);
    this.translator.translate.withArgs(date4).returns(60);
    this.translator.translate.withArgs(date5).returns(70);

    this.translator.translate.withArgs(date01).returns(20);
    this.translator.translate.withArgs(date02).returns(40);
    this.translator.translate.withArgs(date03).returns(60);
    this.translator.translate.withArgs(date04).returns(80);
    this.translator.translate.withArgs(date05).returns(100);
    this.translator.stub("translateSpecialCase").returns(110);

    axis.draw();

    //assert
    path = this.renderer.path;

    assert.equal(path.callCount, 11, "drawing lines");

    assert.deepEqual(path.getCall(5).returnValue.setTitle.args[0][0], "Saturday, 25");
    assert.strictEqual(path.getCall(6).returnValue.stub("setTitle").called, false);
    assert.strictEqual(path.getCall(7).returnValue.stub("setTitle").called, false);
    assert.strictEqual(path.getCall(8).returnValue.stub("setTitle").called, false);
    assert.strictEqual(path.getCall(9).returnValue.stub("setTitle").called, false);
    assert.deepEqual(path.getCall(10).returnValue.setTitle.args[0][0], "Thursday, 30");
});

//T402810
QUnit.test("Do not render markers if there is only one on start of scale", function(assert) {
    //arrange
    var date0 = new Date(2011, 2, 1),
        date1 = new Date(2011, 2, 15),
        date2 = new Date(2011, 2, 31),
        date01 = new Date(2011, 2, 1),
        axis;

    this.options.tickInterval = "day";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(20);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date01).returns(0);

    axis.draw();

    //assert
    assert.equal(this.renderer.stub("text").callCount, 0);
    assert.equal(this.renderer.stub("path").callCount, 0);
});

//T402810
QUnit.test("Render 2 markers if there is only one in the middle of scale", function(assert) {
    //arrange
    var date0 = new Date(2011, 1, 15),
        date1 = new Date(2011, 2, 1),
        date2 = new Date(2011, 2, 15),
        date01 = new Date(2011, 2, 1),
        axis;

    this.options.tickInterval = "day";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(20);
    this.translator.translate.withArgs(date2).returns(40);
    this.translator.translate.withArgs(date01).returns(0);

    axis.draw();

    //assert
    assert.equal(this.renderer.text.callCount, 2);
    assert.equal(this.renderer.text.getCall(0).args[0], "March");
    assert.equal(this.renderer.text.getCall(1).args[0], "February");
    assert.equal(this.renderer.path.callCount, 3);
});

//T448590
QUnit.test("If tickInterval is 'year' and markers are visible set marker format to 'year'", function(assert) {
    //arrange
    var date0 = new Date(2010, 0, 1),
        date1 = new Date(2011, 0, 1),
        date2 = new Date(2012, 0, 1),
        axis;

    this.options.tickInterval = "year";
    axis = this.createAxis({ min: date0, max: date2 }, [date0, date1, date2]);

    this.translator.translate.withArgs(date0).returns(0);
    this.translator.translate.withArgs(date1).returns(20);
    this.translator.translate.withArgs(date2).returns(40);

    axis.draw();

    //assert
    assert.equal(this.renderer.text.callCount, 3);
    assert.equal(this.renderer.text.getCall(0).args[0], "2010");
    assert.equal(this.renderer.text.getCall(1).args[0], "2011");
    assert.equal(this.renderer.text.getCall(2).args[0], "2012");
});
