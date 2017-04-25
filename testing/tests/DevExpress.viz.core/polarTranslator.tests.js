"use strict";

var polarTranslatorModule = require("viz/translators/polar_translator"),
    PolarTranslator = polarTranslatorModule.PolarTranslator,
    translator2DModule = require("viz/translators/translator2d");

function translatedToFixed(translatedValues, precision) {
    precision = precision || 2;
    var passedX = translatedValues.x,
        passedY = translatedValues.y;

    return {
        x: passedX !== null ? parseFloat(passedX.toFixed(precision)) : passedX,
        y: passedY !== null ? parseFloat(passedY.toFixed(precision)) : passedY,
        angle: translatedValues.angle
    };
}

var environment = {
    beforeEach: function() {
        this.canvas = {
            width: 600,
            height: 500,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this.businessRangeArg = {
            min: 0,
            max: 1000,
            minVisible: 0,
            maxVisible: 1000
        };
        this.businessRangeVal = {
            min: 0,
            max: 5000,
            minVisible: 0,
            maxVisible: 5000
        };
        this.options = { startAngle: 0, endAngle: 360 };
    },
    createTranslator: function() {
        return new PolarTranslator({ arg: this.businessRangeArg, val: this.businessRangeVal }, this.canvas, this.options);
    }
};

QUnit.module('PolarTranslator', environment);

QUnit.test('Creation', function(assert) {
    var translator = this.createTranslator();

    assert.ok(translator, 'translator created');
    assert.ok(translator instanceof PolarTranslator, 'translator instance of PolarTranslator');
});

QUnit.test("translate with params", function(assert) {
    var translator = this.createTranslator();
    var coord = translator.translate(100, 500);

    assert.deepEqual(translatedToFixed(coord), { x: 315, y: 230, angle: -54 });
});

QUnit.test("translate with zero params", function(assert) {
    var translator = this.createTranslator();
    var coord = translator.translate(0, 0);

    assert.deepEqual(coord, { x: 300, y: 250, angle: -90, radius: 0 });
});

QUnit.test("translate params out of range", function(assert) {
    var translator = this.createTranslator();
    var coord = translator.translate(2000, 0);

    assert.deepEqual(coord, { x: 300, y: 250, angle: null, radius: 0 });
});

QUnit.test("translate, not rounded angle", function(assert) {
    var translator = this.createTranslator();
    var coord = translator.translate(2.29, 0);

    assert.deepEqual(coord, { x: 300, y: 250, angle: -89.1756, radius: 0 });
});

QUnit.test("min canvas on vertical", function(assert) {
    this.canvas = {
        width: 500,
        height: 600,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };
    var translator = this.createTranslator();
    var coord = translator.translate(100, 500);

    assert.deepEqual(translatedToFixed(coord), { x: 265, y: 280, angle: -54 });
});

QUnit.test("canvas left and right more than width", function(assert) {
    this.canvas = {
        width: 500,
        height: 600,
        left: 100,
        right: 500,
        top: 0,
        bottom: 0
    };
    var translator = this.createTranslator();
    assert.deepEqual(translator.translate(100, 400), { x: 50, y: 300, angle: -54, radius: 0 });
});

QUnit.test("reinit", function(assert) {
    var translator = this.createTranslator();
    //act
    assert.deepEqual(translator.translate(500, 5000), { x: 300, y: 500, angle: 90, radius: 250 });

    this.businessRangeArg.maxVisible = 500;
    this.businessRangeVal.maxVisible = 2500;
    translator.canvas.left = 50;

    translator.reinit();
    assert.deepEqual(translator.translate(250, 2500), { x: 325, y: 500, angle: 90, radius: 250 });
});

QUnit.test("getInterval", function(assert) {
    var translator = this.createTranslator();
    assert.equal(translator.getInterval(), 360);
});

QUnit.test("getValInterval", function(assert) {
    var translator = this.createTranslator();
    assert.equal(translator.getValInterval(), 250);
});

QUnit.test("getCenter", function(assert) {
    var translator = this.createTranslator();
    assert.deepEqual(translator.getCenter(), { x: 300, y: 250 });
});

QUnit.test("getBaseAngle", function(assert) {
    var translator = this.createTranslator();
    assert.equal(translator.getBaseAngle(), -90);
});

QUnit.test("getAngles", function(assert) {
    var translator = this.createTranslator();
    assert.deepEqual(translator.getAngles(), [0, 360]);
});

QUnit.test("getComponent", function(assert) {
    var translator = this.createTranslator(),
        component = translator.getComponent("arg");

    assert.ok(component instanceof translator2DModule.Translator2D);
    assert.deepEqual(component.getCenter(), { x: 300, y: 250 });
    assert.equal(component.getRadius(), 250);
    assert.deepEqual(component.getAngles(), [0, 360]);
});

QUnit.test("setCanvasDimension", function(assert) {
    var translator = this.createTranslator();

    translator.setCanvasDimension(500);

    assert.equal(translator.getValLength(), 250, "new radius");
    assert.deepEqual(translator.getCenter(), { x: 250, y: 250 }, "new center");
});

QUnit.test("setAngles", function(assert) {
    var translator = this.createTranslator(),
        argComponent = translator.getComponent("arg");

    translator.setAngles(10, 20);

    assert.deepEqual(translator.getAngles(), [10, 20], "angles");
    assert.equal(argComponent.canvasLength, 10, "arg updating");
});

QUnit.test("untranslate", function(assert) {
    var translator = this.createTranslator();

    assert.deepEqual(translator.untranslate(300, 250), { phi: 0, r: 0 });
    assert.deepEqual(translator.untranslate(400, 250), { phi: 0, r: 100 });
    assert.deepEqual(translator.untranslate(300, 150), { phi: 270, r: 100 }, "normalize angle");
    assert.deepEqual(translator.untranslate(200, 350), { phi: 135, r: 141 });
    assert.deepEqual(translator.untranslate(202, 350), { phi: 134, r: 140 });
});


QUnit.test("translate with startAngle and endAngle", function(assert) {
    this.options.startAngle = 90;
    this.options.startAngle = 108;
    var translator = this.createTranslator();

    assert.deepEqual(translator.translate(0, 0), { x: 300, y: 250, radius: 0, angle: 18 });
});

QUnit.test("Start draw from first tick for categories", function(assert) {
    this.businessRangeArg = { categories: ["a", "b", "c", "d"], axisType: "discrete", addSpiderCategory: true, stick: true };
    var translator = this.createTranslator();

    assert.deepEqual(translator.translate("a", 0), { angle: -90, radius: 0, x: 300, y: 250 });
    assert.deepEqual(translator.translate("d", 0), { angle: 180, radius: 0, x: 300, y: 250 });
    assert.deepEqual(this.businessRangeArg.categories, ["a", "b", "c", "d"]);
});

QUnit.test("Start draw from first tick for categories, last categories is null", function(assert) {
    this.businessRangeArg = { categories: ["a", "b", "c", "d"], axisType: "discrete", addSpiderCategory: true, stick: true };
    var translator = this.createTranslator();

    assert.deepEqual(translator.translate("a", 0), { angle: -90, radius: 0, x: 300, y: 250 });
    assert.deepEqual(translator.translate("d", 0), { angle: 180, radius: 0, x: 300, y: 250 });
    assert.deepEqual(this.businessRangeArg.categories, ["a", "b", "c", "d"]);
});

QUnit.test("Translate with offset", function(assert) {
    this.businessRangeArg = { categories: ["a", "b", "c", "d"], axisType: "discrete" };
    this.businessRangeVal = { categories: ["z", "y", "x", "w"], axisType: "discrete" };
    var translator = this.createTranslator();

    assert.deepEqual(translator.translate("a", "w", [-1]), { angle: -90, radius: 219, x: 300, y: 31 });
    assert.deepEqual(translator.translate("a", "w", [-1, -1]), { angle: -90, radius: 188, x: 300, y: 62 });
    assert.deepEqual(translator.translate("c", "y", [0, -1]), { angle: 135, radius: 63, x: 255, y: 295 });
});

QUnit.test("getMinBarSize", function(assert) {
    var translator = this.createTranslator();

    assert.equal(translator.getMinBarSize(5), 100);
});

//fixed
QUnit.test("getCanvasVisibleArea", function(assert) {
    var translator = this.createTranslator();

    assert.deepEqual(translator.getCanvasVisibleArea(), {});
});
