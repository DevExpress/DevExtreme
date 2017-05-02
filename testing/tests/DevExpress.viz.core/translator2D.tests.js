"use strict";

var $ = require("jquery"),
    translator2DModule = require("viz/translators/translator2d");

var canvasTemplate = {
        width: 610,
        height: 400,
        left: 70,
        top: 10,
        right: 30,
        bottom: 60
    },
    optionsHorizontal = { isHorizontal: true },
    numericRange = {
        min: 0,
        max: 100,
        interval: 20,
        axisType: 'continuous',
        dataType: 'numeric'
    },
    logarithmicRange = {
        min: 10,
        max: 10000,
        interval: 1,
        base: 10,
        axisType: 'logarithmic',
        dataType: 'numeric'
    },
    datetimeRange = {
        min: new Date(2012, 9, 1),
        max: new Date(2012, 9, 2),
        axisType: 'continuous',
        dataType: 'datetime',
        interval: new Date(2012, 9, 2) - new Date(2012, 9, 1)
    },
    discreteRange = {
        categories: ['First', 'Second', 'Third', 'Fourth'],
        axisType: 'discrete',
        dataType: 'string'
    };

var environment = {
    _createTranslator: function(range, canvas, options) {
        return new translator2DModule.Translator2D(range, canvas, options);
    },
    createTranslator: function(range) {
        return this._createTranslator($.extend({ axisType: 'continuous', dataType: 'numeric', interval: 1, invert: false }, range),
            { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
            { isHorizontal: true });
    }
};

QUnit.module('Life cycle', environment);

QUnit.test('Create vertical translator', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: 0, minVisible: 10, max: 100, maxVisible: 90, interval: 20, axisType: 'continuous', dataType: 'numeric', invert: true });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 10);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 90);

    assert.equal(translator._canvasOptions.startPoint, 10);
    assert.equal(translator._canvasOptions.endPoint, 340);
    assert.equal(translator._canvasOptions.invert, false);

    assert.equal(translator._canvasOptions.canvasLength, 330);
    assert.equal(translator._canvasOptions.rangeDoubleError, 0.01);
    assert.equal(translator._canvasOptions.ratioOfCanvasRange, 4.125);
});

QUnit.test('Create horizontal translator', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: 0, minVisible: 10, max: 100, maxVisible: 90, interval: 20, axisType: 'continuous', dataType: 'numeric', invert: true });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 10);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 90);

    assert.equal(translator._canvasOptions.startPoint, 70);
    assert.equal(translator._canvasOptions.endPoint, 580);
    assert.equal(translator._canvasOptions.invert, true);

    assert.equal(translator._canvasOptions.canvasLength, 510);
    assert.equal(translator._canvasOptions.rangeDoubleError, 0.01);
    assert.equal(translator._canvasOptions.ratioOfCanvasRange, 6.375);
});

QUnit.test('Create numeric translator', function(assert) {
    var range = $.extend({}, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: 0, minVisible: 0, max: 100, maxVisible: 100, interval: 20, axisType: 'continuous', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));
});

QUnit.test('Create numeric translator when business range delta = 0, Min = max = minVisible = maxVisible != 0', function(assert) {
    var range = {
            min: 100,
            max: 100,
            interval: 0,
            axisType: 'continuous',
            dataType: 'numeric'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 99, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 101, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 99, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 101, 'range max visible is correct');
});

QUnit.test('Create numeric translator when business range delta = 0, Min = max = minVisible = maxVisible = 0', function(assert) {
    var range = {
            min: 0,
            max: 0,
            minVisible: 0,
            maxVisible: 0,
            interval: 0,
            axisType: 'continuous',
            dataType: 'numeric'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 0, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 1, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 0, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 1, 'range max visible is correct');
});

QUnit.test('Create numeric translator when business range delta = 0, min < minVisible = maxVisible != 0 < max', function(assert) {
    var range = {
            min: 10,
            max: 100,
            minVisible: 50,
            maxVisible: 50,
            interval: 0,
            axisType: 'continuous',
            dataType: 'numeric'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 100, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 49, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 51, 'range max visible is correct');
});

QUnit.test('Create numeric translator when business range delta = 0, min < minVisible = maxVisible = 0 < max', function(assert) {
    var range = {
            min: -10,
            max: 10,
            minVisible: 0,
            maxVisible: 0,
            interval: 0,
            axisType: 'continuous',
            dataType: 'numeric'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, -10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 10, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 0, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 1, 'range max visible is correct');
});

QUnit.test('Create numeric translator when business range delta = 0, min = minVisible = maxVisible < max', function(assert) {
    var range = {
            min: 10,
            max: 100,
            minVisible: 10,
            maxVisible: 10,
            interval: 0,
            axisType: 'continuous',
            dataType: 'numeric'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 100, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 10, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 11, 'range max visible is correct');
});

QUnit.test('Create numeric translator when business range delta = 0, min < minVisible = maxVisible = max', function(assert) {
    var range = {
            min: 10,
            max: 100,
            minVisible: 100,
            maxVisible: 100,
            interval: 0,
            axisType: 'continuous',
            dataType: 'numeric'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 100, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 99, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 100, 'range max visible is correct');
});

QUnit.test('Create datetime translator', function(assert) {
    var range = $.extend({}, datetimeRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: new Date(2012, 9, 1), max: new Date(2012, 9, 2), minVisible: new Date(2012, 9, 1), maxVisible: new Date(2012, 9, 2), interval: new Date(2012, 9, 2) - new Date(2012, 9, 1), axisType: 'continuous', dataType: 'datetime' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));
});

QUnit.test('Create datetime translator when business range delta = 0. min = minVisible = maxVisible = max', function(assert) {
    var correction = 60000,
        range = {
            min: new Date(2000, 1, 1),
            max: new Date(2000, 1, 1),
            minVisible: new Date(2000, 1, 1),
            maxVisible: new Date(2000, 1, 1),
            interval: 0,
            axisType: 'continuous',
            dataType: 'datetime'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(2000, 1, 1).valueOf() - correction, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2000, 1, 1).valueOf() + correction, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf() - correction, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf() + correction, 'range max visible is correct');
});

QUnit.test('Create datetime translator when business range delta = 0. min < minVisible = maxVisible < max', function(assert) {
    var correction = 60000,
        range = {
            min: new Date(1990, 1, 1),
            max: new Date(2010, 1, 1),
            minVisible: new Date(2000, 1, 1),
            maxVisible: new Date(2000, 1, 1),
            interval: 0,
            axisType: 'continuous',
            dataType: 'datetime'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(1990, 1, 1).valueOf(), 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2010, 1, 1).valueOf(), 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf() - correction, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf() + correction, 'range max visible is correct');
});

QUnit.test('Create datetime translator when business range delta = 0. min = minVisible = maxVisible < max', function(assert) {
    var correction = 60000,
        range = {
            min: new Date(2000, 1, 1),
            max: new Date(2010, 1, 1),
            minVisible: new Date(2000, 1, 1),
            maxVisible: new Date(2000, 1, 1),
            interval: 0,
            axisType: 'continuous',
            dataType: 'datetime'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2010, 1, 1).valueOf(), 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf() + correction, 'range max visible is correct');
});

QUnit.test('Create datetime translator when business range delta = 0. min < minVisible = maxVisible = max', function(assert) {
    var correction = 60000,
        range = {
            min: new Date(1990, 1, 1),
            max: new Date(2000, 1, 1),
            minVisible: new Date(2000, 1, 1),
            maxVisible: new Date(2000, 1, 1),
            interval: 0,
            axisType: 'continuous',
            dataType: 'datetime'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(1990, 1, 1).valueOf(), 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf() - correction, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max visible is correct');
});

QUnit.test('Create discrete translator (Stick = false, invert = false)', function(assert) {
    var range = $.extend({}, discreteRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { categories: ['First', 'Second', 'Third', 'Fourth'], axisType: 'discrete', dataType: 'string' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.deepEqual(translator._categories, ['First', 'Second', 'Third', 'Fourth']);
    assert.equal(translator._canvasOptions.interval, 127.5);
    assert.deepEqual(translator._categoriesToPoints, {
        'First': 0,
        'Second': 1,
        'Third': 2,
        'Fourth': 3
    });
});

QUnit.test('Create discrete translator (Stick = true, invert = true)', function(assert) {
    var range = $.extend({ stick: true, invert: true }, discreteRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.equal(translator._canvasOptions.interval, 170);
    assert.deepEqual(translator._categoriesToPoints, {
        'First': 0,
        'Second': 1,
        'Third': 2,
        'Fourth': 3
    });
});

QUnit.test('Create discrete translator (Stick = true, addSpiderCategory = true)', function(assert) {
    var range = $.extend({ stick: true, addSpiderCategory: true }, discreteRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.equal(translator._canvasOptions.interval, 127.5);
    assert.deepEqual(translator._categoriesToPoints, {
        'First': 0,
        'Second': 1,
        'Third': 2,
        'Fourth': 3
    });
});

QUnit.test('Can create Discrete translator without categories. B253644', function(assert) {
    var range = $.extend({ stick: true, invert: true }, discreteRange),
        canvas = $.extend({}, canvasTemplate),
        translator;
    range.categories = null;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);
    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.deepEqual(translator._categories, []);
    assert.deepEqual(translator._categoriesToPoints, {});
});

QUnit.test('Create logarithmic translator', function(assert) {
    var range = $.extend({ minVisible: 100, maxVisible: 1000 }, logarithmicRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: 10, minVisible: 100, max: 10000, maxVisible: 1000, interval: 1, base: 10, axisType: 'logarithmic', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.roughEqual(translator._canvasOptions.rangeMaxVisible, 3, 0.00001);
    assert.roughEqual(translator._canvasOptions.rangeMinVisible, 2, 0.00001);
    assert.roughEqual(translator._canvasOptions.rangeMin, 1, 0.00001);
    assert.roughEqual(translator._canvasOptions.rangeMax, 4, 0.00001);
    assert.equal(translator._canvasOptions.base, 10);

    assert.roughEqual(translator._canvasOptions.rangeDoubleError, 0.0001, 0.000001);
    assert.roughEqual(translator._canvasOptions.ratioOfCanvasRange, 330, 0.00001);
});

QUnit.test('Create logarithmic translator. Min = max = minVisible = maxVisible = 1', function(assert) {
    var range = $.extend({}, logarithmicRange, { min: 1, max: 1, minVisible: 1, maxVisible: 1 }),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: 1, minVisible: 1, max: 1, maxVisible: 1, interval: 1, base: 10, axisType: 'logarithmic', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.equal(translator._canvasOptions.rangeMaxVisible, 1);
    assert.equal(translator._canvasOptions.rangeMinVisible, -1);
    assert.equal(translator._canvasOptions.rangeMin, -1);
    assert.equal(translator._canvasOptions.rangeMax, 1);
    assert.equal(translator._canvasOptions.base, 10);

    assert.roughEqual(translator._canvasOptions.rangeDoubleError, 0.0001, 0.000001);
    assert.roughEqual(translator._canvasOptions.ratioOfCanvasRange, 165, 0.00001);
});

QUnit.test('Create logarithmic translator. Base = 2', function(assert) {
    var range = $.extend({}, logarithmicRange, { min: 2, max: 32, minVisible: 4, maxVisible: 16, base: 2 }),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = new translator2DModule.Translator2D(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: 2, minVisible: 4, max: 32, maxVisible: 16, interval: 1, base: 2, axisType: 'logarithmic', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.roughEqual(translator._canvasOptions.rangeMaxVisible, 4, 0.00001);
    assert.roughEqual(translator._canvasOptions.rangeMinVisible, 2, 0.00001);
    assert.roughEqual(translator._canvasOptions.rangeMin, 1, 0.00001);
    assert.roughEqual(translator._canvasOptions.rangeMax, 5, 0.00001);
    assert.equal(translator._canvasOptions.base, 2);

    assert.roughEqual(translator._canvasOptions.rangeDoubleError, 0.0001, 0.000001);
    assert.roughEqual(translator._canvasOptions.ratioOfCanvasRange, 165, 0.00001);
});

QUnit.test('Can be reinited (recalculate canvas options)', function(assert) {
    var range = $.extend({}, numericRange, { min: -100, max: 100, invert: false }),
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    canvas.width = 600;
    canvas.left = 50;
    canvas.right = 150;

    //act
    translator.reinit();

    assert.ok(translator);
    assert.equal(translator._canvasOptions.startPoint, 50);
    assert.equal(translator._canvasOptions.endPoint, 450);
    assert.equal(translator._canvasOptions.invert, false);

    assert.equal(translator._canvasOptions.canvasLength, 400);
    assert.equal(translator._canvasOptions.rangeDoubleError, 0.01);
    assert.equal(translator._canvasOptions.ratioOfCanvasRange, 2);
});

QUnit.test('Update business range', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        newRange = { min: -1000, minVisible: -600, maxVisible: -90, max: -10, invert: false, axisType: 'continuous', dataType: 'numeric' },
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    translator.updateBusinessRange(newRange);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(translator._businessRange, { min: -1000, minVisible: -600, maxVisible: -90, max: -10, invert: false, axisType: 'continuous', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.equal(translator._canvasOptions.rangeMin, -1000);
    assert.equal(translator._canvasOptions.rangeMax, -10);
    assert.equal(translator._canvasOptions.rangeMinVisible, -600);
    assert.equal(translator._canvasOptions.rangeMaxVisible, -90);

    assert.equal(translator._canvasOptions.startPoint, 70);
    assert.equal(translator._canvasOptions.endPoint, 580);
    assert.equal(translator._canvasOptions.invert, false);

    assert.equal(translator._canvasOptions.canvasLength, 510);
    assert.equal(translator._canvasOptions.rangeDoubleError, 0.01);
    assert.equal(translator._canvasOptions.ratioOfCanvasRange, 1);
});

QUnit.test('Update canvas', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        newCanvas = { width: 333, height: 444, left: 13, right: 14, top: 15, bottom: 16 },
        translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    translator.updateCanvas(newCanvas);

    assert.deepEqual(translator._canvas, { width: 333, height: 444, left: 13, top: 15, right: 14, bottom: 16 });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.untranslate));
    assert.ok($.isFunction(translator.getInterval));

    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 10);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 90);

    assert.equal(translator._canvasOptions.startPoint, 13);
    assert.equal(translator._canvasOptions.endPoint, 319);
    assert.equal(translator._canvasOptions.invert, true);

    assert.equal(translator._canvasOptions.canvasLength, 306);
    assert.equal(translator._canvasOptions.rangeDoubleError, 0.01);
    assert.equal(translator._canvasOptions.ratioOfCanvasRange, 3.825);
});

QUnit.test('Get business range', function(assert) {
    var range,
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D($.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange), canvas, optionsHorizontal);

    range = translator.getBusinessRange();

    assert.ok(range);
    assert.deepEqual(range, { min: 0, minVisible: 10, max: 100, maxVisible: 90, interval: 20, axisType: 'continuous', dataType: 'numeric', invert: true });
});

QUnit.test('Get canvas visible area', function(assert) {
    var visibleArea,
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D($.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange), canvas, optionsHorizontal);

    visibleArea = translator.getCanvasVisibleArea();

    assert.ok(visibleArea);
    assert.deepEqual(visibleArea, { min: 70, max: 580 });
});

QUnit.module('Numeric translator', environment);

QUnit.test('Translate. Positive values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700 });

    assert.equal(translator.translate(100), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(1000), null, 'BP more than min');
    assert.equal(translator.translate(300), 700, 'BP inside range');
    assert.equal(translator.translate(200), 500, 'BP on the min');
    assert.equal(translator.translate(700), 1500, 'BP on the max');
    assert.equal(translator.translate(200 - 1e-8), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(700 + 1e-8), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Positive values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, invert: true });

    assert.equal(translator.translate(100), null, 'BP less than min');
    assert.equal(translator.translate(1000), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(300), 1300, 'BP inside range');
    assert.equal(translator.translate(200), 1500, 'BP on the min');
    assert.equal(translator.translate(700), 500, 'BP on the max');
    assert.equal(translator.translate(200 - 1e-8), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(700 + 1e-8), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Negative values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200 });

    assert.equal(translator.translate(-1000), null, 'BP less than min');
    assert.equal(translator.translate(-100), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(-600), 700, 'BP inside range');
    assert.equal(translator.translate(-700), 500, 'BP on the min');
    assert.equal(translator.translate(-200), 1500, 'BP on the max');
    assert.equal(translator.translate(-700 - 1e-8), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(-200 + 1e-8), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Negative values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200, invert: true });

    assert.equal(translator.translate(-1000), null, 'BP less than min');
    assert.equal(translator.translate(-100), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(-600), 1300, 'BP inside range');
    assert.equal(translator.translate(-700), 1500, 'BP on the min');
    assert.equal(translator.translate(-200), 500, 'BP on the max');
    assert.equal(translator.translate(-700 - 1e-8), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(-200 + 1e-8), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. not round values', function(assert) {
    var translator = this._createTranslator($.extend({ axisType: 'continuous', dataType: 'numeric', interval: 1, invert: false }, { min: 200, max: 700 }),
            { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
            { isHorizontal: true, conversionValue: function(value) { return value; } });

    assert.equal(translator.translate(322.33), 744.66, 'value should not be rounded');
});

QUnit.test("translate. conversion is not a function", function(assert) {
    var translator = this._createTranslator($.extend({ axisType: 'continuous', dataType: 'numeric', interval: 1, invert: false }, { min: 200, max: 700 }),
            { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
            { isHorizontal: true, conversionValue: "" });

    assert.equal(translator.translate(322.33), 745, 'value should rounded');
});

QUnit.test('Untranslate. Positive values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700 });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.untranslate(300, undefined, true), 100, 'Coord less than min');
    assert.equal(translator.untranslate(1800, undefined, true), 850, 'Coord more than min');
    assert.equal(translator.untranslate(500), 200, 'Coord on the min');
    assert.equal(translator.untranslate(1500), 700, 'Coord on the max');
    assert.equal(translator.untranslate(1000), 450, 'Coord inside range');
});

QUnit.test('Untranslate. Positive values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, invert: true });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.untranslate(300, undefined, true), 800, 'Coord less than min');
    assert.equal(translator.untranslate(1800, undefined, true), 50, 'Coord more than min');
    assert.equal(translator.untranslate(500), 700, 'Coord on the min');
    assert.equal(translator.untranslate(1500), 200, 'Coord on the max');
    assert.equal(translator.untranslate(1000), 450, 'Coord inside range');
});

QUnit.test('Untranslate. Negative values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200 });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.untranslate(300, undefined, true), -800, 'Coord less than min');
    assert.equal(translator.untranslate(1800, undefined, true), -50, 'Coord more than min');
    assert.equal(translator.untranslate(500), -700, 'Coord on the min');
    assert.equal(translator.untranslate(1500), -200, 'Coord on the max');
    assert.equal(translator.untranslate(1000), -450, 'Coord inside range');
});

QUnit.test('Untranslate. Negative values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200, invert: true });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.untranslate(300, undefined, true), -100, 'Coord less than min');
    assert.equal(translator.untranslate(1800, undefined, true), -850, 'Coord more than min');
    assert.equal(translator.untranslate(500), -200, 'Coord on the min');
    assert.equal(translator.untranslate(1500), -700, 'Coord on the max');
    assert.equal(translator.untranslate(1000), -450, 'Coord inside range');
});

QUnit.test('Untranslate. T176895. Range min/max are undefined', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.untranslate(300), null);
    assert.equal(translator.untranslate(1800), null);
    assert.equal(translator.untranslate(300, undefined, true), null);
    assert.equal(translator.untranslate(1800, undefined, true), null);
    assert.equal(translator.untranslate(500), null);
    assert.equal(translator.untranslate(1500), null);
    assert.equal(translator.untranslate(1000), null);
});

QUnit.test('GetInterval', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, interval: 10.55 });

    assert.equal(translator.getInterval(), 21);
});

QUnit.test('GetInterval when interval is 0', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, interval: 0 });

    assert.equal(translator.getInterval(), 1000);
});

QUnit.test("isValid", function(assert) {
    var translator = this.createTranslator({ min: 100, max: 200 });

    assert.strictEqual(translator.isValid(null), false, "null");
    assert.strictEqual(translator.isValid(undefined), false, "undefined");
    assert.strictEqual(translator.isValid({}), false, "object");
});

QUnit.module('Datetime translator', {
    beforeEach: function() {
        this.createTranslator = function(range) {
            return new translator2DModule.Translator2D($.extend({ axisType: 'continuous', dataType: 'datetime', interval: 1, invert: false }, range),
                { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
                { isHorizontal: true });
        };
    }
});

QUnit.test('Translate. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2) });

    assert.equal(translator.translate(new Date(2012, 7, 1)), null, 'BP less than min');
    assert.equal(translator.translate(new Date(2012, 9, 1)), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2012, 8, 1, 12)), 1000, 'BP inside range');
    assert.equal(translator.translate(new Date(2012, 8, 1)), 500, 'BP on the min');
    assert.equal(translator.translate(new Date(2012, 8, 2)), 1500, 'BP on the max');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 1).valueOf() - 1e2)), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 2).valueOf() + 1e2)), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2), invert: true });

    assert.equal(translator.translate(new Date(2012, 7, 1)), null, 'BP less than min');
    assert.equal(translator.translate(new Date(2012, 9, 1)), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2012, 8, 1, 12)), 1000, 'BP inside range');
    assert.equal(translator.translate(new Date(2012, 8, 1)), 1500, 'BP on the min');
    assert.equal(translator.translate(new Date(2012, 8, 2)), 500, 'BP on the max');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 1).valueOf() - 1e2)), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 2).valueOf() + 1e2)), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Untranslate. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2) });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.deepEqual(translator.untranslate(300, undefined, true), new Date(2012, 7, 31, 19, 12), 'Coord less than min');
    assert.deepEqual(translator.untranslate(1800, undefined, true), new Date(2012, 8, 2, 7, 12), 'Coord more than min');
    assert.deepEqual(translator.untranslate(500), new Date(2012, 8, 1), 'Coord on the min');
    assert.deepEqual(translator.untranslate(1500), new Date(2012, 8, 2), 'Coord on the max');
    assert.deepEqual(translator.untranslate(1000), new Date(2012, 8, 1, 12), 'Coord inside range');
});

QUnit.test('Untranslate. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2), invert: true });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.deepEqual(translator.untranslate(1800, undefined, true), new Date(2012, 7, 31, 16, 48), 'Coord less than min');
    assert.deepEqual(translator.untranslate(300, undefined, true), new Date(2012, 8, 2, 4, 48), 'Coord more than min');
    assert.deepEqual(translator.untranslate(500), new Date(2012, 8, 2), 'Coord on the min');
    assert.deepEqual(translator.untranslate(1500), new Date(2012, 8, 1), 'Coord on the max');
    assert.deepEqual(translator.untranslate(1000), new Date(2012, 8, 1, 12), 'Coord inside range');
});

QUnit.test('GetInterval', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2), interval: 1000 * 60 * 60 });

    assert.equal(translator.getInterval(), 42);
});

QUnit.test('GetInterval when interval is 0', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 3), interval: 0 });

    assert.equal(translator.getInterval(), 1000);
});

QUnit.module('Logarithmic translator', {
    beforeEach: function() {
        this.createTranslator = function(range) {
            return new translator2DModule.Translator2D($.extend({ axisType: 'logarithmic', dataType: 'numeric', interval: 1, invert: false, base: 10 }, range),
                { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
                { isHorizontal: true });
        };
    }
});

QUnit.test('Translate. Big numbers. Invert = false', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 100, max: 10000 });

    assert.equal(translator.translate(10), null, 'BP less than min');
    assert.equal(translator.translate(100000), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(1000), 1000, 'BP inside range');
    assert.equal(translator.translate(100), 500, 'BP on the min');
    assert.equal(translator.translate(10000), 1500, 'BP on the max');
    assert.equal(translator.translate(100 - doubleDelta * 100), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(10000 + doubleDelta * 10000), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Big numbers. Invert = true', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 100, max: 10000, invert: true });

    assert.equal(translator.translate(10), null, 'BP less than min');
    assert.equal(translator.translate(100000), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(1000), 1000, 'BP inside range');
    assert.equal(translator.translate(100), 1500, 'BP on the min');
    assert.equal(translator.translate(10000), 500, 'BP on the max');
    assert.equal(translator.translate(100 - doubleDelta * 100), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(10000 + doubleDelta * 10000), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Small numbers. Invert = false', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 0.0001, max: 0.01 });

    assert.equal(translator.translate(0.00001), null, 'BP less than min');
    assert.equal(translator.translate(0.1), null, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(0.001), 1000, 'BP inside range');
    assert.equal(translator.translate(0.0001), 500, 'BP on the min');
    assert.equal(translator.translate(0.01), 1500, 'BP on the max');
    assert.equal(translator.translate(0.0001 - doubleDelta * 0.0001), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(0.01 + doubleDelta * 0.01), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Small numbers. Invert = true', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 0.0001, max: 0.01, invert: true });

    assert.equal(translator.translate(0.00001), null, 'BP less than min');
    assert.equal(translator.translate(0.1), null, 'BP more than min');
    assert.equal(translator.translate(0.001), 1000, 'BP inside range');
    assert.equal(translator.translate(0.0001), 1500, 'BP on the min');
    assert.equal(translator.translate(0.01), 500, 'BP on the max');
    assert.equal(translator.translate(0.0001 - doubleDelta * 0.0001), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(0.01 + doubleDelta * 0.01), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Untranslate. Big numbers. Invert = false', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 100, max: 10000 });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.untranslate(0, undefined, true), 10, 'Coord less than min');
    assert.equal(translator.untranslate(2000, undefined, true), 100000, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 100, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 10000, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 1000, doubleDelta, 'Coord inside range');
});

QUnit.test('Untranslate. Big numbers. Invert = true', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 100, max: 10000, invert: true });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.untranslate(0, undefined, true), 100000, 'Coord less than min');
    assert.equal(translator.untranslate(2000, undefined, true), 10, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 10000, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 100, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 1000, doubleDelta, 'Coord inside range');
});

QUnit.test('Untranslate. Small numbers. Invert = false', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 0.0001, max: 0.01 });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.roughEqual(translator.untranslate(2000, undefined, true), 0.1, doubleDelta * 0.01, 'Coord less than min');
    assert.roughEqual(translator.untranslate(0, undefined, true), 0.00001, doubleDelta * 0.01, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 0.0001, doubleDelta * 0.0001, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 0.01, doubleDelta * 0.01, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 0.001, doubleDelta * 0.001, 'Coord inside range');
});

QUnit.test('Untranslate. Small numbers. Invert = true', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 0.0001, max: 0.01, invert: true });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.roughEqual(translator.untranslate(0, undefined, true), 0.1, doubleDelta * 0.01, 'Coord less than min');
    assert.roughEqual(translator.untranslate(2000, undefined, true), 0.00001, doubleDelta * 0.01, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 0.01, doubleDelta * 0.01, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 0.0001, doubleDelta * 0.0001, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 0.001, doubleDelta * 0.001, 'Coord inside range');
});

QUnit.test('GetInterval', function(assert) {
    var translator = this.createTranslator({ min: 1, max: 100000, interval: 0.5 });

    assert.equal(translator.getInterval(), 100);
});

QUnit.test('Translate. Big numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2 });

    assert.equal(translator.translate(2), null, 'BP less than min');
    assert.equal(translator.translate(32), null, 'BP more than min');
    assert.equal(translator.translate(8), 1000, 'BP inside range');
    assert.equal(translator.translate(4), 500, 'BP on the min');
    assert.equal(translator.translate(16), 1500, 'BP on the max');
    assert.equal(translator.translate(4 - doubleDelta * 4), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(16 + doubleDelta * 16), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Big numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2, invert: true });

    assert.equal(translator.translate(2), null, 'BP less than min');
    assert.equal(translator.translate(34), null, 'BP more than min');
    assert.equal(translator.translate(8), 1000, 'BP inside range');
    assert.equal(translator.translate(4), 1500, 'BP on the min');
    assert.equal(translator.translate(16), 500, 'BP on the max');
    assert.equal(translator.translate(4 - doubleDelta * 4), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(16 + doubleDelta * 16), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Small numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2 });

    assert.equal(translator.translate(0.03125), null, 'BP less than min');
    assert.equal(translator.translate(0.5), null, 'BP more than min');
    assert.equal(translator.translate(0.125), 1000, 'BP inside range');
    assert.equal(translator.translate(0.0625), 500, 'BP on the min');
    assert.equal(translator.translate(0.25), 1500, 'BP on the max');
    assert.equal(translator.translate(0.0625 - doubleDelta * 0.0625), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(0.25 + doubleDelta * 0.25), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Small numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2, invert: true });

    assert.equal(translator.translate(0.03125), null, 'BP less than min');
    assert.equal(translator.translate(0.5), null, 'BP more than min');
    assert.equal(translator.translate(0.125), 1000, 'BP inside range');
    assert.equal(translator.translate(0.0625), 1500, 'BP on the min');
    assert.equal(translator.translate(0.25), 500, 'BP on the max');
    assert.equal(translator.translate(0.0625 - doubleDelta * 0.0625), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(0.25 + doubleDelta * 0.25), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Untranslate. Big numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2 });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 4, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 16, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 8, doubleDelta, 'Coord inside range');
});

QUnit.test('Untranslate. Big numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2, invert: true });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 16, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 4, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 8, doubleDelta, 'Coord inside range');
});

QUnit.test('Untranslate. Small numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2 });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 0.0625, doubleDelta * 0.0625, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 0.25, doubleDelta * 0.25, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 0.125, doubleDelta * 0.125, 'Coord inside range');
});

QUnit.test('Untranslate. Small numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2, invert: true });

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.roughEqual(translator.untranslate(500), 0.25, doubleDelta * 0.25, 'Coord on the min');
    assert.roughEqual(translator.untranslate(1500), 0.0625, doubleDelta * 0.0625, 'Coord on the max');
    assert.roughEqual(translator.untranslate(1000), 0.125, doubleDelta * 0.125, 'Coord inside range');
});

QUnit.test('GetInterval. Base = 2', function(assert) {
    var translator = this.createTranslator({ min: 1, max: 32, base: 2, interval: 0.5 });

    assert.equal(translator.getInterval(), 100);
});

QUnit.module('Discrete translator', {
    beforeEach: function() {
        this.createTranslator = function(range, canvas) {
            canvas = canvas || { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 };
            return new translator2DModule.Translator2D($.extend({ categories: ['a1', 'a2', 'a3', 'a4', 'a5'], axisType: 'discrete', dataType: 'string', invert: false, stick: false }, range),
                canvas, { isHorizontal: true });
        };
    }
});

QUnit.test('Translate. Invert = false. Stick = false.', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 1000, 'BP inside range');
    assert.equal(translator.translate('a1'), 600, 'BP is first category');
    assert.equal(translator.translate('a5'), 1400, 'BP is last category');
});

QUnit.test('Translate. Invert = true. Stick = false.', function(assert) {
    var translator = this.createTranslator({ invert: true });

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 1000, 'BP inside range');
    assert.equal(translator.translate('a1'), 1400, 'BP is first category');
    assert.equal(translator.translate('a5'), 600, 'BP is last category');
});

QUnit.test('Translate. Invert = false. Stick = true.', function(assert) {
    var translator = this.createTranslator({ stick: true });

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 1000, 'BP inside range');
    assert.equal(translator.translate('a1'), 500, 'BP is first category');
    assert.equal(translator.translate('a5'), 1500, 'BP is last category');
});

QUnit.test('Translate. Invert = true. Stick = true.', function(assert) {
    var translator = this.createTranslator({ invert: true, stick: true });

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 1000, 'BP inside range');
    assert.equal(translator.translate('a1'), 1500, 'BP is first category');
    assert.equal(translator.translate('a5'), 500, 'BP is last category');
});

QUnit.test('Translate. AddSpiderCategory = true. Stick = true.', function(assert) {
    var translator = this.createTranslator({ addSpiderCategory: true, stick: true });

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 900, 'BP inside range');
    assert.equal(translator.translate('a1'), 500, 'BP is first category');
    assert.equal(translator.translate('a5'), 1300, 'BP is last category');
});

QUnit.test('Untranslate. Invert = false. Stick = false.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 200,
        center = 100,
        translator = this.createTranslator({});

    assert.equal(translator.untranslate(start - 100), null, 'Coord less than min');
    assert.equal(translator.untranslate(end + 100), null, 'Coord more than min');

    assert.strictEqual(translator.untranslate(start), 'a1');

    assert.strictEqual(translator.untranslate(start + delta), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 2), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 3), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 4), 'a5');

    assert.strictEqual(translator.untranslate(start + center), 'a1');
    assert.strictEqual(translator.untranslate(start + delta + center), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 2 + center), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 3 + center), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 4 + center), 'a5');
});

QUnit.test('Untranslate. border values.', function(assert) {
    var start = 27,
        delta = 141,
        translator = this.createTranslator({ categories: ['1q', '2q', '3q', '4q', '5q', '6q', '7q'] }, { bottom: 22, height: 200, left: 27, right: 27, top: 29, width: 1041 });

    assert.strictEqual(translator.untranslate(start + delta - 1), '1q');
    assert.strictEqual(translator.untranslate(start + delta + 1), '2q');
    assert.strictEqual(translator.untranslate(start + 2 * delta - 1), '2q');
    assert.strictEqual(translator.untranslate(start + 2 * delta + 1), '3q');
    assert.strictEqual(translator.untranslate(start + 3 * delta - 1), '3q');
    assert.strictEqual(translator.untranslate(start + 3 * delta + 1), '4q');
    assert.strictEqual(translator.untranslate(start + 4 * delta - 1), '4q');
    assert.strictEqual(translator.untranslate(start + 4 * delta + 1), '5q');
    assert.strictEqual(translator.untranslate(start + 5 * delta - 1), '5q');
    assert.strictEqual(translator.untranslate(start + 5 * delta + 1), '6q');
    assert.strictEqual(translator.untranslate(start + 6 * delta - 1), '6q');
    assert.strictEqual(translator.untranslate(start + 6 * delta + 1), '7q');
});

QUnit.test('Untranslate. Invert = true. Stick = false.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 200,
        center = 100,
        translator = this.createTranslator({ invert: true });

    assert.equal(translator.untranslate(start - 100), null, 'Coord less than min');
    assert.equal(translator.untranslate(end + 100), null, 'Coord more than min');

    assert.strictEqual(translator.untranslate(start), 'a5');
    assert.strictEqual(translator.untranslate(start + delta), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 2), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 3), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 4), 'a1');

    assert.strictEqual(translator.untranslate(start + center), 'a5');
    assert.strictEqual(translator.untranslate(start + delta + center), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 2 + center), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 3 + center), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 4 + center), 'a1');
});

QUnit.test('Untranslate. Invert = false. Stick = true.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 250,
        center = 125,
        translator = this.createTranslator({ stick: true });

    assert.equal(translator.untranslate(start - 100), null, 'Coord less than min');
    assert.equal(translator.untranslate(end + 100), null, 'Coord more than min');

    assert.strictEqual(translator.untranslate(start), 'a1');
    assert.strictEqual(translator.untranslate(start + delta), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 2), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 3), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 4), 'a5');

    assert.strictEqual(translator.untranslate(start + center / 2), 'a1');
    assert.strictEqual(translator.untranslate(start + center), 'a2');
    assert.strictEqual(translator.untranslate(start + delta + center), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 2 + center), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 3 + center), 'a5');
});

QUnit.test('Untranslate. Invert = true. Stick = true.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 250,
        center = 125,
        translator = this.createTranslator({ invert: true, stick: true });

    assert.equal(translator.untranslate(start - 100), null, 'Coord less than min');
    assert.equal(translator.untranslate(end + 100), null, 'Coord more than min');

    assert.strictEqual(translator.untranslate(start), 'a5');
    assert.strictEqual(translator.untranslate(start + delta), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 2), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 3), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 4), 'a1');

    assert.strictEqual(translator.untranslate(start + center / 2), 'a5');
    assert.strictEqual(translator.untranslate(start + center), 'a4');
    assert.strictEqual(translator.untranslate(start + delta + center), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 2 + center), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 3 + center), 'a1');
});

QUnit.test('Untranslate. AddSpiderCategory = true. Stick = true.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 250,
        center = 125,
        translator = this.createTranslator({ stick: true, addSpiderCategory: true });

    assert.equal(translator.untranslate(start - 100), null, 'Coord less than min');
    assert.equal(translator.untranslate(end + 100), null, 'Coord more than min');

    assert.strictEqual(translator.untranslate(start), 'a1');
    assert.strictEqual(translator.untranslate(start + delta), 'a2');
    assert.strictEqual(translator.untranslate(start + delta * 2), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 3), 'a5');
    assert.strictEqual(translator.untranslate(start + delta * 4), 'a5');

    assert.strictEqual(translator.untranslate(start + center / 2), 'a1');
    assert.strictEqual(translator.untranslate(start + center), 'a2');
    assert.strictEqual(translator.untranslate(start + delta + center), 'a3');
    assert.strictEqual(translator.untranslate(start + delta * 2 + center), 'a4');
    assert.strictEqual(translator.untranslate(start + delta * 3 + center), 'a5');
});

QUnit.test('Untranslate. Visible categories', function(assert) {
    var start = 500,
        delta = 250,
        translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a4' });

    assert.equal(translator.untranslate(start - delta), undefined);
    assert.equal(translator.untranslate(start), 'a2');
    assert.equal(translator.untranslate(start + delta), 'a2');
    assert.equal(translator.untranslate(start + delta * 2), 'a3');
    assert.equal(translator.untranslate(start + delta * 3), 'a4');
    assert.equal(translator.untranslate(start + delta * 4), 'a4');
    assert.equal(translator.untranslate(start + delta * 5), undefined);
});

QUnit.test('GetInterval (Stick = false)', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator._canvasOptions.interval, 200);
    assert.equal(translator.getInterval(), 200);
});

QUnit.test('GetInterval (Stick = true)', function(assert) {
    var translator = this.createTranslator({ stick: true });

    assert.equal(translator._canvasOptions.interval, 250);
    assert.equal(translator.getInterval(), 250);
});

//T111250
QUnit.test('Without categories. stick = true', function(assert) {
    var translator = this.createTranslator({ categories: null, stick: true });

    assert.equal(translator._canvasOptions.interval, translator._canvasOptions.canvasLength);
});

QUnit.test('One categories. stick = true', function(assert) {
    var translator = this.createTranslator({ categories: ['a1'], stick: true });

    assert.equal(translator._canvasOptions.interval, translator._canvasOptions.canvasLength);
});

QUnit.test('discrete zooming. minVisible is not set', function(assert) {
    var translator = this.createTranslator({ maxVisible: 'a5' });

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4', 'a5']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 200);
});

QUnit.test('discrete zooming. maxVisible is not set', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2' });

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);
});

QUnit.test('discrete zooming. categories is not contains minVisible', function(assert) {
    var translator = this.createTranslator({ minVisible: 'someCategories', maxVisible: 'a2' });

    assert.deepEqual(translator.visibleCategories, translator._categories.slice(0, 2));
    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 500);
});

QUnit.test('discrete zooming. categories is not contains maxVisible', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'someCategories' });

    assert.deepEqual(translator.visibleCategories, translator._categories.slice(1));
    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);
});

QUnit.test('discrete zooming. minVisible maxVisible', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5' });

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);
});

QUnit.test('discrete zooming. translate', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a3' });

    assert.strictEqual(translator.translate('invalidCategories'), null);
    assert.strictEqual(translator.translate('a1'), 250);
    assert.strictEqual(translator.translate('a2'), 750);
    assert.strictEqual(translator.translate('a3'), 1250);
    assert.strictEqual(translator.translate('a4'), 1750);
    assert.strictEqual(translator.translate('a5'), 2250);
});

QUnit.test('discrete zooming. translate. DateTime categories', function(assert) {
    var translator = this.createTranslator({
        categories: [
            new Date(1356480000000),
            new Date(1356483600000),
            new Date(1356519600000),
            new Date(1356523200000),
            new Date(1356526800000)
        ],
        minVisible: new Date(1356483600000),
        maxVisible: new Date(1356519600000)
    });

    assert.strictEqual(translator.translate('invalidCategories'), null);
    assert.strictEqual(translator.translate(new Date(1356480000000)), 250);
    assert.strictEqual(translator.translate(new Date(1356483600000)), 750);
    assert.strictEqual(translator.translate(new Date(1356519600000)), 1250);
    assert.strictEqual(translator.translate(new Date(1356523200000)), 1750);
    assert.strictEqual(translator.translate(new Date(1356526800000)), 2250);
});

QUnit.test('discrete zooming. translate. Numeric categories', function(assert) {
    var translator = this.createTranslator({
        categories: [
            -1,
            0,
            1,
            2,
            3
        ],
        minVisible: 0,
        maxVisible: 1
    });

    assert.strictEqual(translator.translate('invalidCategories'), null);
    assert.strictEqual(translator.translate(-1), 250);
    assert.strictEqual(translator.translate(0), 750);
    assert.strictEqual(translator.translate(1), 1250);
    assert.strictEqual(translator.translate(2), 1750);
    assert.strictEqual(translator.translate(3), 2250);
});

QUnit.test('discrete zooming. invert. translate', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a3', invert: true });

    assert.strictEqual(translator.translate('a5'), -250);
    assert.strictEqual(translator.translate('a4'), 250);
    assert.strictEqual(translator.translate('a3'), 750);
    assert.strictEqual(translator.translate('a2'), 1250);
    assert.strictEqual(translator.translate('a1'), 1750);
});

QUnit.test('discrete zooming. invert. untranslate', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a3', invert: true });

    assert.strictEqual(translator.untranslate(250), null);
    assert.strictEqual(translator.untranslate(750), 'a3');
    assert.strictEqual(translator.untranslate(1250), 'a2');
    assert.strictEqual(translator.untranslate(1500), 'a2');
    assert.strictEqual(translator.untranslate(1700), null);
});

QUnit.test('translate. directionOffset = -1', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.translate('a0', -1), null);
    assert.equal(translator.translate('a1', -1), 500);
    assert.equal(translator.translate('a2', -1), 700);
    assert.equal(translator.translate('a3', -1), 900);
    assert.equal(translator.translate('a4', -1), 1100);
});

QUnit.test('translate. directionOffset = 1', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.translate('a0', 1), null);
    assert.equal(translator.translate('a1', 1), 700);
    assert.equal(translator.translate('a2', 1), 900);
    assert.equal(translator.translate('a3', 1), 1100);
    assert.equal(translator.translate('a4', 1), 1300);
});

QUnit.test('translate. directionOffset = ', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.translate('a0', 0), null);
    assert.equal(translator.translate('a1', 0), 600);
    assert.equal(translator.translate('a2', 0), 800);
    assert.equal(translator.translate('a3', 0), 1000);
    assert.equal(translator.translate('a4', 0), 1200);
});

QUnit.test("translate. invert", function(assert) {
    var translator = this.createTranslator({ invert: true });

    assert.equal(translator.translate("a1", 1), 1300);
    assert.equal(translator.translate("a2", -1), 1300);
    assert.equal(translator.translate("a3", -1), 1100);
    assert.equal(translator.translate("a4", 1), 700);
});

QUnit.test('untranslate. directionOffset = -1', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.untranslate(0, -1), null);
    assert.equal(translator.untranslate(500, -1), 'a1');
    assert.equal(translator.untranslate(700, -1), 'a2');
    assert.equal(translator.untranslate(900, -1), 'a3');
    assert.equal(translator.untranslate(1100, -1), 'a4');
    assert.equal(translator.untranslate(1500, -1), 'a5');
});

QUnit.test('untranslate. directionOffset = 1', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.untranslate(0, 1), null);
    assert.equal(translator.untranslate(500, 1), 'a1');
    assert.equal(translator.untranslate(700, 1), 'a1');
    assert.equal(translator.untranslate(900, 1), 'a2');
    assert.equal(translator.untranslate(1100, 1), 'a3');
    assert.equal(translator.untranslate(1500, 1), 'a5');
});

QUnit.test('untranslate. directionOffset = 0', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.untranslate(0, 0), null);
    assert.equal(translator.untranslate(500, 0), 'a1');
    assert.equal(translator.untranslate(700, 0), 'a2');
    assert.equal(translator.untranslate(900, 0), 'a3');
    assert.equal(translator.untranslate(1100, 0), 'a4');
    assert.equal(translator.untranslate(1500, 0), 'a5');
});

QUnit.test('discrete zooming. categories is not contains minVisible', function(assert) {
    var translator = this.createTranslator({ minVisible: 'someCategories', maxVisible: 'a2' });

    assert.deepEqual(translator.visibleCategories, translator._categories.slice(0, 2));
    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 500);
});

QUnit.test('discrete zooming. categories is not contains maxVisible', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'someCategories' });

    assert.deepEqual(translator.visibleCategories, translator._categories.slice(1));
    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);
});

QUnit.test('discrete zooming. minVisible maxVisible', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5' });

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);
});

QUnit.test('discrete zooming. translate', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a3' });

    assert.strictEqual(translator.translate('invalidCategories'), null);
    assert.strictEqual(translator.translate('a1'), 250);
    assert.strictEqual(translator.translate('a2'), 750);
    assert.strictEqual(translator.translate('a3'), 1250);
    assert.strictEqual(translator.translate('a4'), 1750);
    assert.strictEqual(translator.translate('a5'), 2250);
});

QUnit.test("datetime categories with small differenses", function(assert) {
    var translator = this.createTranslator({
        categories: [new Date(2017, 1, 1, 0, 0, 0, 0), new Date(2017, 1, 1, 0, 0, 0, 10), new Date(2017, 1, 1, 0, 0, 0, 20)],
        dataType: "datetime"
    });

    assert.equal(translator.translate(new Date(2017, 1, 1, 0, 0, 0, 10)), 1000);
});

QUnit.test("'isValid' with dateTime", function(assert) {
    var translator = this.createTranslator({
        categories: [new Date(2017, 1, 1, 0, 0, 0, 10)],
        dataType: "datetime"
    });

    assert.ok(translator.isValid(new Date(2017, 1, 1, 0, 0, 0, 10)));
});

QUnit.test("isValid with undefined", function(assert) {
    var translator = this.createTranslator({
        categories: [new Date(2017, 1, 1, 0, 0, 0, 10)],
        dataType: "datetime"
    });

    assert.strictEqual(translator.isValid(undefined), false);
});

QUnit.test("'to' with datetime", function(assert) {
    var translator = this.createTranslator({
        categories: [new Date(2017, 1, 1, 0, 0, 0, 0), new Date(2017, 1, 1, 0, 0, 0, 10)],
        dataType: "datetime"
    });

    assert.equal(translator.to(new Date(2017, 1, 1, 0, 0, 0, 10), 1), 1500);
});

QUnit.module('Interval translator', {
    beforeEach: function() {
        this.createTranslator = function(range, interval) {
            var canvas = { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 };
            return new translator2DModule.Translator2D($.extend({ axisType: 'semidiscrete', dataType: 'numeric', invert: false, stick: false }, range),
                canvas, { isHorizontal: true, interval: interval || 5 });
        };
    }
});

QUnit.test('Translate undefined/null value', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 });

    assert.equal(translator.translate(undefined), null);
    assert.equal(translator.translate(null), null);
});

QUnit.test('Translate. Numeric, interval 5', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 }); //10, 15, 20, 25, 30

    assert.equal(translator.translate(6.5), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(40), null, 'BP more than max');
    assert.equal(translator.translate(24.6), 1000, 'BP inside range');
    assert.equal(translator.translate(14), 600, 'BP on the min');
    assert.equal(translator.translate(31.4), 1400, 'BP on the max');
});

QUnit.test('Translate with interval. Numeric, interval 5', function(assert) {
    var translator = this.createTranslator({ min: 5, max: 20 }); //5, 10, 15, 20

    assert.equal(translator.translate(-6.5, undefined, 10), null, 'BP less than min');
    assert.equal(translator.translate(undefined, undefined, 10), null, 'BP undefined');
    assert.equal(translator.translate(30, undefined, 10), null, 'BP more than max');
    assert.equal(translator.translate(17.5, undefined, 10), 1000, 'BP inside range');
    assert.equal(translator.translate(3, undefined, 10), 625, 'BP on the min');
    assert.equal(translator.translate(29, undefined, 10), 1375, 'BP on the max');
});

QUnit.test('Translate. Numeric, interval 0.4', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 11.6 }, 0.4);

    assert.equal(translator.translate(6.5), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(40), null, 'BP more than max');
    assert.equal(translator.translate(10.86), 1000, 'BP inside range');
    assert.equal(translator.translate(10.25), 600, 'BP on the min');
    assert.equal(translator.translate(11.71), 1400, 'BP on the max');
});

QUnit.test('Translate. Datetime, interval millisecond', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 5, 1, 0, 0, 0, 17),
        max: new Date(2015, 5, 1, 0, 0, 0, 21),
        dataType: 'datetime'
    }, "millisecond");

    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 0, 10)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 0, 22)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 0, 19)), 1000, 'BP inside range');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 0, 17)), 600, 'BP on the min');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 0, 21)), 1400, 'BP on the max');
});

QUnit.test('Translate. Datetime, interval second', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 5, 1, 0, 0, 17, 0),
        max: new Date(2015, 5, 1, 0, 0, 21, 0),
        dataType: 'datetime'
    }, "second");

    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 10, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 30, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 19, 236)), 1000, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 17, 236)), 600, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 21, 236)), 1400, 'BP on the max');//5
});

QUnit.test('Translate. Datetime, interval minute', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 5, 1, 0, 17, 0, 0),
        max: new Date(2015, 5, 1, 0, 21, 0, 0),
        dataType: 'datetime'
    }, "minute");

    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 10, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 30, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 19, 50, 236)), 1000, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 17, 50, 236)), 600, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 21, 50, 236)), 1400, 'BP on the max');//5
});

QUnit.test('Translate. Datetime, interval hour', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 5, 1, 17, 0, 0, 0),
        max: new Date(2015, 5, 1, 21, 0, 0, 0),
        dataType: 'datetime'
    }, "hour");

    assert.equal(translator.translate(new Date(2015, 5, 1, 10, 0, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 5, 1, 22, 0, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 5, 1, 19, 10, 50, 236)), 1000, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2015, 5, 1, 17, 10, 50, 236)), 600, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2015, 5, 1, 21, 10, 50, 236)), 1400, 'BP on the max');//5
});

QUnit.test('Translate. Datetime, interval day', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 5, 17, 0, 0, 0, 0),
        max: new Date(2015, 5, 21, 0, 0, 0, 0),
        dataType: 'datetime'
    }, "day");

    assert.equal(translator.translate(new Date(2015, 5, 10, 0, 0, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 5, 22, 0, 0, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 5, 19, 15, 10, 50, 236)), 1000, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2015, 5, 17, 15, 10, 50, 236)), 600, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2015, 5, 21, 15, 10, 50, 236)), 1400, 'BP on the max');//5
});

QUnit.test('Translate. Datetime, interval week', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 5, 7, 0, 0, 0, 0),
        max: new Date(2015, 6, 5, 0, 0, 0, 0),
        dataType: 'datetime'
    }, "week");

    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 6, 13, 0, 0, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 5, 25, 15, 10, 50, 236)), 1000, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2015, 5, 9, 15, 10, 50, 236)), 600, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2015, 6, 7, 15, 10, 50, 236)), 1400, 'BP on the max');//5
});

QUnit.test('Translate. Datetime, interval month', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 5, 1, 0, 0, 0, 0),
        max: new Date(2015, 9, 1, 0, 0, 0, 0),
        dataType: 'datetime'
    }, "month");

    assert.equal(translator.translate(new Date(2015, 4, 1, 0, 0, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 10, 1, 0, 0, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 7, 11, 15, 10, 50, 236)), 1000, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2015, 5, 11, 15, 10, 50, 236)), 598 /*600*/, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2015, 9, 11, 15, 10, 50, 236)), 1398 /*1400*/, 'BP on the max');//5
});

QUnit.test('Translate. Datetime, interval quarter', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 0, 1, 0, 0, 0, 0),
        max: new Date(2016, 0, 1, 0, 0, 0, 0),
        dataType: 'datetime'
    }, "quarter");

    assert.equal(translator.translate(new Date(2014, 11, 1, 0, 0, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2016, 3, 1, 0, 0, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 8, 11, 15, 10, 50, 236)), 998 /*1000*/, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2015, 1, 11, 15, 10, 50, 236)), 598 /*600*/, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2016, 2, 11, 15, 10, 50, 236)), 1400, 'BP on the max');//5
});

QUnit.test('Translate. Datetime, interval year', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2010, 0, 1, 0, 0, 0, 0),
        max: new Date(2014, 0, 1, 0, 0, 0, 0),
        dataType: 'datetime'
    }, "year");

    assert.equal(translator.translate(new Date(2009, 0, 1, 0, 0, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 0, 1, 0, 0, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2012, 5, 11, 15, 10, 50, 236)), 1000, 'BP inside range');//3
    assert.equal(translator.translate(new Date(2010, 5, 11, 15, 10, 50, 236)), 600, 'BP on the min');//1
    assert.equal(translator.translate(new Date(2014, 5, 11, 15, 10, 50, 236)), 1400, 'BP on the max');//5
});

QUnit.test('Translate. With direction', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 }); //10, 15, 20, 25, 30

    assert.equal(translator.translate(24.6, -1), 900, 'BP inside range');
    assert.equal(translator.translate(24.6, 1), 1100, 'BP inside range');

    assert.equal(translator.translate(14, -1), 500, 'BP on the min');
    assert.equal(translator.translate(14, 1), 700, 'BP on the min');

    assert.equal(translator.translate(31.4, -1), 1300, 'BP on the max');
    assert.equal(translator.translate(31.4, 1), 1500, 'BP on the max');
});

QUnit.test('Translate with interval. With direction, Numeric, interval 5', function(assert) {
    var translator = this.createTranslator({ min: 5, max: 20 }); //5, 10, 15, 20

    assert.equal(translator.translate(17.5, -1, 10), 750, 'BP inside range');
    assert.equal(translator.translate(17.5, 1, 10), 1250, 'BP inside range');

    assert.equal(translator.translate(3, -1, 10), 500, 'BP on the min');
    assert.equal(translator.translate(3, 1, 10), 750, 'BP on the min');

    assert.equal(translator.translate(29, -1, 10), 1250, 'BP on the max');
    assert.equal(translator.translate(29, 1, 10), 1500, 'BP on the max');
});

QUnit.test('Untranslate.', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 }); //10, 15, 20, 25, 30

    assert.equal(translator.untranslate(300), null, 'Coord less than min');
    assert.equal(translator.untranslate(1800), null, 'Coord more than min');
    assert.equal(translator.untranslate(300, undefined, true), 10, 'Coord less than min');
    assert.equal(translator.untranslate(1800, undefined, true), 30, 'Coord more than min');
    assert.equal(translator.untranslate(1000), 25, 'Coord inside range');
    assert.equal(translator.untranslate(1000, -1), 25, 'Coord inside range. negative offset');
    assert.equal(translator.untranslate(1000, 1), 20, 'Coord inside range. positive offset');

    assert.equal(translator.untranslate(500, -1), 10, 'Coord on the min. negative offset');
    assert.equal(translator.untranslate(500, 1), 10, 'Coord on the min. positive offset');

    assert.equal(translator.untranslate(1500, -1), 30, 'Coord on the max. negative offset');
    assert.equal(translator.untranslate(1500, 1), 30, 'Coord on the max. positive offset');

});

QUnit.test('Untranslate. T176895. Range min/max are undefined', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.untranslate(300), null);
    assert.equal(translator.untranslate(1800), null);
    assert.equal(translator.untranslate(300, undefined, true), null);
    assert.equal(translator.untranslate(1800, undefined, true), null);
    assert.equal(translator.untranslate(500), null);
    assert.equal(translator.untranslate(1500), null);
    assert.equal(translator.untranslate(1000), null);
});

QUnit.test('Untranslate. DateTime', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2013, 0, 1),
        max: new Date(2016, 0, 1),
        dataType: 'datetime'
    }, "year");

    assert.deepEqual(translator.untranslate(300, undefined, true), new Date(2013, 0, 1), 'Coord less than min');
    assert.deepEqual(translator.untranslate(1800, undefined, true), new Date(2016, 0, 1), 'Coord more than min');

    assert.deepEqual(translator.untranslate(875), new Date(2015, 0, 1), 'Coord inside range');
    assert.deepEqual(translator.untranslate(875, -1), new Date(2015, 0, 1), 'Coord inside range. negative offset');
    assert.deepEqual(translator.untranslate(875, 1), new Date(2014, 0, 1), 'Coord inside range. positive offset');

    assert.deepEqual(translator.untranslate(500, -1), new Date(2013, 0, 1), 'Coord on the min. negative offset');
    assert.deepEqual(translator.untranslate(500, 1), new Date(2013, 0, 1), 'Coord on the min. positive offset');

    assert.deepEqual(translator.untranslate(1500, -1), new Date(2016, 0, 1), 'Coord on the max. negative offset');
    assert.deepEqual(translator.untranslate(1500, 1), new Date(2016, 0, 1), 'Coord on the max. positive offset');
});

QUnit.test('GetInterval', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30, interval: 2 });

    assert.equal(translator.getInterval(), 80);
});

QUnit.test('GetInterval when interval is 0', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30, interval: 0 });

    assert.equal(translator.getInterval(), 800);
});

QUnit.test("isValid", function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 });

    assert.strictEqual(translator.isValid(null), false, "null");
    assert.strictEqual(translator.isValid(undefined), false, "undefined");
    assert.strictEqual(translator.isValid({}), false, "object");
    assert.strictEqual(translator.isValid(9), false);
    assert.strictEqual(translator.isValid(20), true);
    assert.strictEqual(translator.isValid(34), true);
    assert.strictEqual(translator.isValid(36), false);
});

QUnit.test("isValid, Interval specified", function(assert) {
    var translator = this.createTranslator({ min: 10, max: 50 });

    assert.strictEqual(translator.isValid(-1, 20), false);
    assert.strictEqual(translator.isValid(9, 20), true);
    assert.strictEqual(translator.isValid(40, 20), true);
    assert.strictEqual(translator.isValid(59, 20), true);
    assert.strictEqual(translator.isValid(61, 20), false);
});

QUnit.module('Translate special cases', {
    beforeEach: function() {
        this.createTranslator = function(range, options) {
            return new translator2DModule.Translator2D(range,
                { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
                $.extend({ isHorizontal: true }, options));
        };
    }
});

QUnit.test('Default value', function(assert) {
    var that = this;
    function checkTranslator(expected, range, options, message) {
        var translator = that.createTranslator(range, options);

        assert.strictEqual(translator.translateSpecialCase('canvas_position_default'), expected, message);
    }

    checkTranslator(500, { min: 100, max: 200, axisType: 'continuous', dataType: 'numeric' }, {}, 'Invert = false. Position = horizontal. Range is positive');
    checkTranslator(1500, { min: -200, max: -100, axisType: 'continuous', dataType: 'numeric' }, {}, 'Invert = false. Position = horizontal. Range is negative');
    checkTranslator(1000, { min: -200, max: 200, axisType: 'continuous', dataType: 'numeric' }, {}, 'Invert = false. Position = horizontal. Range includes zero');
    checkTranslator(1500, { min: 100, max: 200, invert: true, axisType: 'continuous', dataType: 'numeric' }, {}, 'Invert = true. Position = horizontal. Range is positive');
    checkTranslator(500, { min: -200, max: -100, invert: true, axisType: 'continuous', dataType: 'numeric' }, {}, 'Invert = true. Position = horizontal. Range is negative');
    checkTranslator(1000, { min: -200, max: 200, invert: true, axisType: 'continuous', dataType: 'numeric' }, {}, 'Invert = true. Position = horizontal. Range includes zero');

    checkTranslator(1500, { min: 100, max: 200, axisType: 'continuous', dataType: 'numeric' }, { isHorizontal: false }, 'Invert = false. Position = vertical. Range is positive');
    checkTranslator(500, { min: -200, max: -100, axisType: 'continuous', dataType: 'numeric' }, { isHorizontal: false }, 'Invert = false. Position = vertical. Range is negative');
    checkTranslator(1000, { min: -200, max: 200, axisType: 'continuous', dataType: 'numeric' }, { isHorizontal: false }, 'Invert = false. Position = vertical. Range includes zero');
    checkTranslator(500, { min: 100, max: 200, invert: true, axisType: 'continuous', dataType: 'numeric' }, { isHorizontal: false }, 'Invert = true. Position = vertical. Range is positive');
    checkTranslator(1500, { min: -200, max: -100, invert: true, axisType: 'continuous', dataType: 'numeric' }, { isHorizontal: false }, 'Invert = true. Position = vertical. Range is negative');
    checkTranslator(1000, { min: -200, max: 200, invert: true, axisType: 'continuous', dataType: 'numeric' }, { isHorizontal: false }, 'Invert = true. Position = vertical. Range includes zero');
});

QUnit.test('Other values', function(assert) {
    var that = this;
    function checkTranslator(value, expected, message, range, options) {
        var translator = that.createTranslator($.extend({ min: 100, max: 1000, axisType: 'continuous', dataType: 'numeric' }, range), options);
        assert.strictEqual(translator.translateSpecialCase(value), expected, message);
    }

    checkTranslator('canvas_position_start', 500, 'Start position. Range is positive. Invert = false');
    checkTranslator('canvas_position_top', 500, 'Top position. Range is positive. Invert = false');
    checkTranslator('canvas_position_left', 500, 'Left position. Range is positive. Invert = false');
    checkTranslator('canvas_position_end', 1500, 'End position. Range is positive. Invert = false');
    checkTranslator('canvas_position_bottom', 1500, 'Bottom position. Range is positive. Invert = false');
    checkTranslator('canvas_position_right', 1500, 'Right position. Range is positive. Invert = false');
    checkTranslator('canvas_position_middle', 1000, 'Middle position. Range is positive. Invert = false');
    checkTranslator('canvas_position_center', 1000, 'Center position. Range is positive. Invert = false');

    checkTranslator('canvas_position_start', 500, 'Start position. Range is negative. Invert = false', { min: -1000, max: -100 });
    checkTranslator('canvas_position_top', 500, 'Top position. Range is negative. Invert = false', { min: -1000, max: -100 });
    checkTranslator('canvas_position_left', 500, 'Left position. Range is negative. Invert = false', { min: -1000, max: -100 });
    checkTranslator('canvas_position_end', 1500, 'End position. Range is negative. Invert = false', { min: -1000, max: -100 });
    checkTranslator('canvas_position_bottom', 1500, 'Bottom position. Range is negative. Invert = false', { min: -1000, max: -100 });
    checkTranslator('canvas_position_right', 1500, 'Right position. Range is negative. Invert = false', { min: -1000, max: -100 });
    checkTranslator('canvas_position_middle', 1000, 'Middle position. Range is negative. Invert = false', { min: -1000, max: -100 });
    checkTranslator('canvas_position_center', 1000, 'Center position. Range is negative. Invert = false', { min: -1000, max: -100 });

    checkTranslator('canvas_position_start', 1500, 'Start position. Range is positive. Invert = true', { invert: true });
    checkTranslator('canvas_position_top', 500, 'Top position. Range is positive. Invert = true', { invert: true });
    checkTranslator('canvas_position_left', 500, 'Left position. Range is positive. Invert = true', { invert: true });
    checkTranslator('canvas_position_end', 500, 'End position. Range is positive. Invert = true', { invert: true });
    checkTranslator('canvas_position_bottom', 1500, 'Bottom position. Range is positive. Invert = true', { invert: true });
    checkTranslator('canvas_position_right', 1500, 'Right position. Range is positive. Invert = true', { invert: true });
    checkTranslator('canvas_position_middle', 1000, 'Middle position. Range is positive. Invert = true', { invert: true });
    checkTranslator('canvas_position_center', 1000, 'Center position. Range is positive. Invert = true', { invert: true });

    checkTranslator('canvas_position_start', 1500, 'Start position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
    checkTranslator('canvas_position_top', 500, 'Top position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
    checkTranslator('canvas_position_left', 500, 'Left position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
    checkTranslator('canvas_position_end', 500, 'End position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
    checkTranslator('canvas_position_bottom', 1500, 'Bottom position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
    checkTranslator('canvas_position_right', 1500, 'Right position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
    checkTranslator('canvas_position_middle', 1000, 'Middle position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
    checkTranslator('canvas_position_center', 1000, 'Center position. Range is negative. Invert = true', { min: -1000, max: -100, invert: true });
});

QUnit.test("other values, direction vertical", function(assert) {
    var translator = this.createTranslator({ min: 100, max: 1000, axisType: 'continuous', dataType: 'numeric', invert: undefined }, { isHorizontal: false });

    assert.strictEqual(translator.translateSpecialCase('canvas_position_start'), 1500, 'Start position. Range is positive. Invert = true');
    assert.strictEqual(translator.translateSpecialCase('canvas_position_end'), 500, 'End position. Range is positive. Invert = true');
});

QUnit.test('All translators process special cases', function(assert) {
    var that = this;
    function checkTranslator(value, expected, message, range) {
        var original = translator2DModule.Translator2D.prototype.translateSpecialCase;
        translator2DModule.Translator2D.prototype.translateSpecialCase = function(value) { return value + '_processed'; };

        try {
            var translator = that.createTranslator(range);
            assert.strictEqual(translator.translate(value), expected, message);
        } finally {
            translator2DModule.Translator2D.prototype.translateSpecialCase = original;
        }
    }

    checkTranslator('special_case', 'special_case_processed', 'Numeric translator can process special case', { min: 100, max: 1000, axisType: 'continuous', dataType: 'numeric' });
    checkTranslator('special_case', 'special_case_processed', 'Datetime translator can process special case', { min: new Date(1000), max: new Date(10000), axisType: 'continuous', dataType: 'datetime' });
    checkTranslator('special_case', 'special_case_processed', 'Logarithmic translator can process special case', { min: 1, max: 1000, axisType: 'logarithmic', dataType: 'numeric' });
    checkTranslator('special_case', 'special_case_processed', 'Discrete translator can process special case', { categories: ['a1', 'a2'], axisType: 'discrete', dataType: 'string' });
});

QUnit.module("Zooming and scrolling");

QUnit.test('scroll', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: false }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);

    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 10);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 90);

    assert.equal(translator._canvasOptions.startPoint, 70);
    assert.equal(translator._canvasOptions.endPoint, 580);

    zoom = translator.zoom(10, 1);

    assert.equal(zoom.min.toFixed(2), (10 + 10 * 80 / 510).toFixed(2), "positive scroll min");
    assert.equal(zoom.max.toFixed(2), (90 + 10 * 80 / 510).toFixed(2), "positive scroll max");

    assert.equal(zoom.translate.toFixed(2), 10.00, "positive scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "positive scroll scale");

    zoom = translator.zoom(-10, 1);
    assert.roughEqual(zoom.min.toFixed(2), (10 - 10 * 80 / 510).toFixed(2), 0.001, "negative scroll min");
    assert.roughEqual(zoom.max.toFixed(2), (90 - 10 * 80 / 510).toFixed(2), 0.001, "negative scroll max");

    assert.equal(zoom.translate.toFixed(2), -10.00, "negative scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "negative scroll scale");


    assert.deepEqual(translator.zoom(0, 1), {
        min: 10,
        max: 90,
        translate: 0,
        scale: 1
    }, "without scroll");

    zoom = translator.zoom(100, 1);

    assert.roughEqual(zoom.min.toFixed(2), 20, 0.1, "positive big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 100, 0.1, "positive big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), 10.00 / 80 * 510, 1, "positive big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "positive big scroll scale");

    zoom = translator.zoom(-100, 1);
    assert.roughEqual(zoom.min.toFixed(2), 0, 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 80, 0.1, "negative big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), -10.00 / 80 * 510, 1, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");
});

QUnit.test('scroll. Logarithmic axis', function(assert) {
    var range = $.extend({ minVisible: 100, maxVisible: 1000, invert: false }, logarithmicRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);

    assert.equal(translator._canvasOptions.rangeMin, 1);
    assert.equal(translator._canvasOptions.rangeMax, 4);
    assert.roughEqual(translator._canvasOptions.rangeMinVisible, 2, 1E-5);
    assert.roughEqual(translator._canvasOptions.rangeMaxVisible, 3, 1E-5);

    assert.equal(translator._canvasOptions.startPoint, 70);
    assert.equal(translator._canvasOptions.endPoint, 580);

    zoom = translator.zoom(10, 1);

    assert.equal(zoom.min.toFixed(2), translator.untranslate(80, undefined, true).toFixed(2), "positive scroll min");
    assert.equal(zoom.max.toFixed(2), translator.untranslate(590, undefined, true).toFixed(2), "positive scroll max");

    assert.equal(zoom.translate.toFixed(2), 10.00, "positive scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "positive scroll scale");

    zoom = translator.zoom(-10, 1);
    assert.equal(zoom.min.toFixed(2), translator.untranslate(60, undefined, true).toFixed(2), "negative scroll min");
    assert.equal(zoom.max.toFixed(2), translator.untranslate(570, undefined, true).toFixed(2), "negative scroll max");

    assert.equal(zoom.translate.toFixed(2), -10.00, "negative scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "negative scroll scale");


    zoom = translator.zoom(600, 1);

    assert.roughEqual(zoom.min.toFixed(2), translator.untranslate(580, undefined, true).toFixed(2), 0.1, "positive big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), translator.untranslate(1090, undefined, true).toFixed(2), 0.1, "positive big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), 510, 1, "positive big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "positive big scroll scale");

    zoom = translator.zoom(-600, 1);
    assert.roughEqual(zoom.min.toFixed(2), translator.untranslate(-440, undefined, true).toFixed(2), 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), translator.untranslate(70, undefined, true).toFixed(2), 0.1, 0.1, "negative big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), -510, 1, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");
});

QUnit.test('scroll. Canvas start point is zero', function(assert) {
    var range = $.extend({ invert: false }, numericRange),
        canvas = $.extend({}, canvasTemplate, { left: 0 }),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);

    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 0);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 100);

    assert.equal(translator._canvasOptions.startPoint, 0);
    assert.equal(translator._canvasOptions.endPoint, 580);

    zoom = translator.zoom(-100, 1);
    assert.roughEqual(zoom.min.toFixed(2), 0, 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 100, 0.1, "negative big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), 0, 1, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");
});

QUnit.test('scroll inverted range', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);

    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 10);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 90);

    assert.equal(translator._canvasOptions.startPoint, 70);
    assert.equal(translator._canvasOptions.endPoint, 580);

    zoom = translator.zoom(10, 1);

    assert.equal(zoom.min.toFixed(2), (90 - 10 * 80 / 510).toFixed(2), "positive scroll min");
    assert.equal(zoom.max.toFixed(2), (10 - 10 * 80 / 510).toFixed(2), "positive scroll max");

    assert.equal(zoom.translate.toFixed(2), 10.00, "positive scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "positive scroll scale");

    zoom = translator.zoom(-10, 1);
    assert.roughEqual(zoom.min.toFixed(2), (90 + 10 * 80 / 510).toFixed(2), 0.001, "negative scroll min");
    assert.roughEqual(zoom.max.toFixed(2), (10 + 10 * 80 / 510).toFixed(2), 0.001, "negative scroll max");

    assert.equal(zoom.translate.toFixed(2), -10.00, "negative scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "negative scroll scale");


    assert.deepEqual(translator.zoom(0, 1), {
        min: 90,
        max: 10,
        translate: 0,
        scale: 1
    }, "without scroll");

    zoom = translator.zoom(100, 1);

    assert.roughEqual(zoom.min.toFixed(2), 80, 0.1, "positive big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 0, 0.1, "positive big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), 10.00 / 80 * 510, 1, "positive big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "positive big scroll scale");

    zoom = translator.zoom(-100, 1);
    assert.roughEqual(zoom.min.toFixed(2), 100, 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 20, 0.1, "negative big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), -10.00 / 80 * 510, 1, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");

});

QUnit.test('scale without scroll', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: false }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 10);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 90);

    zoom = translator.zoom(0, 2);

    assert.roughEqual(zoom.min.toFixed(2), 5, 1, "zoom in min");
    assert.roughEqual(zoom.max.toFixed(2), 45, 1, "zoom in max");

    assert.roughEqual(zoom.translate.toFixed(2), 0, 0.001, "zoom in translate");
    assert.roughEqual(zoom.scale.toFixed(2), 2, 0.001, "zoom in scale");


    zoom = translator.zoom(0, 0.98);
    assert.roughEqual(zoom.min.toFixed(2), 10.22, 0.1, "zoom out min");
    assert.roughEqual(zoom.max.toFixed(2), 91.86, 0.1, "zoom out max");

    assert.roughEqual(zoom.translate.toFixed(2), 0, 0.001, "zoom out translate");
    assert.roughEqual(zoom.scale.toFixed(2), 0.98, 0.001, "zoom out scale");

    zoom = translator.zoom(0, 0.5);
    assert.roughEqual(zoom.min.toFixed(2), 0, 0.1, "big zoom out min");
    assert.roughEqual(zoom.max.toFixed(2), 100, 0.1, "big zoom ot max");
    assert.roughEqual(zoom.translate.toFixed(2), -65.20, 0.001, "big zoom in translate");
    assert.roughEqual(zoom.scale.toFixed(2), 0.8, 0.001, " big zoom in scale");
});

QUnit.test('get scale. Numeric', function(assert) {
    var range = $.extend({}, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale(0, 100), 1, "full range");
    assert.strictEqual(translator.getScale(20, 30), 10, "some range");
    assert.strictEqual(translator.getScale(50, 50), Infinity, "single point");
});

QUnit.test('get scale. Logarithmic', function(assert) {
    var range = $.extend({}, logarithmicRange),
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale(10, 10000), 1, "full range");
    assert.strictEqual(translator.getScale(100, 10000), 1.5, "some range");
    assert.strictEqual(translator.getScale(50, 50), Infinity, "single point");
});

QUnit.test('get scale. DateTime', function(assert) {
    var range = $.extend({}, datetimeRange),
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D(range, canvas, optionsHorizontal);

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale(new Date(2012, 9, 1), new Date(2012, 9, 2)), 1, "full range");
    assert.strictEqual(translator.getScale(new Date(2012, 9, 1, 11), new Date(2012, 9, 1, 12)), 24, "some range");
    assert.strictEqual(translator.getScale(new Date(2012, 9, 1), new Date(2012, 9, 1)), Infinity, "single point");
});

QUnit.test('getMinScale', function(assert) {
    var canvas = $.extend({}, canvasTemplate);

    assert.strictEqual(new translator2DModule.Translator2D(numericRange, canvas, optionsHorizontal).getMinScale(false), 0.9, "numeric zoom out");
    assert.strictEqual(new translator2DModule.Translator2D(numericRange, canvas, optionsHorizontal).getMinScale(true), 1.1, "numeric zoom in");

    assert.strictEqual(new translator2DModule.Translator2D(datetimeRange, canvas, optionsHorizontal).getMinScale(false), 0.9, "dateTime zoom out");
    assert.strictEqual(new translator2DModule.Translator2D(datetimeRange, canvas, optionsHorizontal).getMinScale(true), 1.1, "dateTime zoom in");

    assert.strictEqual(new translator2DModule.Translator2D(logarithmicRange, canvas, optionsHorizontal).getMinScale(false), 0.9, "logarithmic zoom out");
    assert.strictEqual(new translator2DModule.Translator2D(logarithmicRange, canvas, optionsHorizontal).getMinScale(true), 1.1, "logarithmic zoom in");
});

QUnit.module('Zooming and scrolling. Discrete translator', {
    beforeEach: function() {
        this.createTranslator = function(range, options, canvas) {
            return new translator2DModule.Translator2D($.extend({ categories: ['a1', 'a2', 'a3', 'a4', 'a5'], axisType: 'discrete', dataType: 'string', invert: false, stick: false }, range),
                $.extend({ width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 }, canvas),
                $.extend({ isHorizontal: true }, options || {}));
        };
    }
});

QUnit.test('Negative scroll. Horizontal Translator. Horizontal translator', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5' }),
        zoom;

    translator.zoom(-250, 1);

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(-250, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-300, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-200, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-500, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

});

QUnit.test('Negative scroll. Horizontal Translator. Inverted', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4', invert: true }),
        zoom;

    translator.zoom(-250, 1);

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(-250, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-300, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-200, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-500, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

});

QUnit.test('Negative scroll. Vertical Translator', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4' }, { isHorizontal: false }),
        zoom;

    translator.zoom(-250, 1);

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(-250, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-300, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-200, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-500, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

});

QUnit.test('Negative scroll. Vertical Translator. Inverted', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5', invert: true }, { isHorizontal: false }),
        zoom;

    translator.zoom(-250, 1);

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);
    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(-250, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-300, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-200, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(-500, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -250);
    assert.equal(zoom.scale, 1);

});

QUnit.test('positive scroll. Horizontal Translator', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4' }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4']);

    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(250, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(300, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(200, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(500, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);
});

QUnit.test('positive scroll. Horizontal Translator. Inverted', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5', invert: true }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);

    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(250, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(300, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(200, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(500, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);
});

QUnit.test('positive scroll. Vertical Translator', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5' }, { isHorizontal: false }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);

    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(250, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(300, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(200, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(500, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);
});

QUnit.test('positive scroll. Vertical Translator. Inverted', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4', invert: true }, { isHorizontal: false }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4']);

    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(250, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(300, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(200, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);

    zoom = translator.zoom(500, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 250);
    assert.equal(zoom.scale, 1);
});

QUnit.test('positive scroll with stick=true', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4', stick: true }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4']);

    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.equal(translator._canvasOptions.interval.toFixed(2), 333.33);

    zoom = translator.zoom(250, 1);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, 333);
    assert.equal(zoom.scale, 1);
});

QUnit.test('negative scroll with stick=true', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5', stick: true }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a2', 'a3', 'a4', 'a5']);

    assert.strictEqual(translator._canvasOptions.startPointIndex, 1);
    assert.equal(translator._canvasOptions.interval.toFixed(2), 333.33);

    zoom = translator.zoom(-250, 1);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate, -333);
    assert.equal(zoom.scale, 1);
});

QUnit.test('scale', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4' }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4']);

    assert.strictEqual(translator._canvasOptions.startPointIndex, 0);
    assert.strictEqual(translator._canvasOptions.interval, 250);

    zoom = translator.zoom(0, 0.75);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -100);
    assert.equal(zoom.scale, 0.8);

    zoom = translator.zoom(0, 1.2);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a3");
    assert.equal(zoom.translate.toFixed(2), 166.67);
    assert.equal(zoom.scale.toFixed(2), 1.33);

    zoom = translator.zoom(332, 1.2);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate.toFixed(2), 500);
    assert.equal(zoom.scale.toFixed(2), 1.33);
});

QUnit.test('scale with stick=true', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4', stick: true }),
        zoom;

    translator.zoom(250, 1);

    assert.deepEqual(translator.visibleCategories, ['a1', 'a2', 'a3', 'a4']);


    zoom = translator.zoom(0, 0.75);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a5");
    assert.equal(zoom.translate, -125);
    assert.equal(zoom.scale, 0.75);

    zoom = translator.zoom(0, 1.2);
    assert.equal(zoom.min, "a1");
    assert.equal(zoom.max, "a3");
    assert.equal(zoom.translate.toFixed(2), 250);
    assert.equal(zoom.scale.toFixed(2), 1.50);

    zoom = translator.zoom(332, 1.2);
    assert.equal(zoom.min, "a2");
    assert.equal(zoom.max, "a4");
    assert.equal(zoom.translate.toFixed(2), 749.50);
    assert.equal(zoom.scale.toFixed(2), 1.5);
});

QUnit.test('getMinScale', function(assert) {

    var categories = [];

    for(var i = 0; i < 1000; i++) {
        categories.push(i + " ");
    }

    assert.equal(this.createTranslator({}).getMinScale(true).toFixed(2), 1.67, "without visibleCategories zoom in");
    assert.equal(this.createTranslator({}).getMinScale(false).toFixed(2), 0.71, "without visibleCategories zoom out");

    assert.equal(this.createTranslator({ categories: categories }).getMinScale(true).toFixed(2), 1.25, "many categories visibleCategories zoom in");
    assert.equal(this.createTranslator({ categories: categories }).getMinScale(false).toFixed(2), 0.83, "many categories visibleCategories zoom out");

    assert.equal(this.createTranslator({ minVisible: 'a1', maxVisible: 'a2' }).getMinScale(true).toFixed(2), 2.00, " visibleCategories zoom in");
    assert.equal(this.createTranslator({ minVisible: 'a1', maxVisible: 'a2' }).getMinScale(false).toFixed(2), 0.5, "visibleCategories zoom out");

    assert.equal(this.createTranslator({ minVisible: 'a2', maxVisible: 'a2' }).getMinScale(true).toFixed(2), 1, "visibleCategories zoom in");
    assert.equal(this.createTranslator({ minVisible: 'a2', maxVisible: 'a2' }).getMinScale(false).toFixed(2), 0.33, "visibleCategories zoom out");

    assert.equal(this.createTranslator({ minVisible: 'a2', maxVisible: 'a4' }).getMinScale(true).toFixed(2), 3, "visibleCategories zoom in");
    assert.equal(this.createTranslator({ minVisible: 'a2', maxVisible: 'a4' }).getMinScale(false).toFixed(2), 0.6, "visibleCategories zoom out");

});

QUnit.test('getMinScale', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a4' });

    assert.deepEqual(translator.getVisibleCategories(), ["a2", "a3", "a4"]);
});

QUnit.test('get scale. stick=true', function(assert) {
    var translator = this.createTranslator({ stick: true });

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale("a1", "a5"), 1, "full range");
    assert.strictEqual(translator.getScale("a2", "a4"), 2, "some range");
    assert.strictEqual(translator.getScale("a2", "a2"), Infinity, "single point");
});

QUnit.test('get scale. stick=false', function(assert) {
    var translator = this.createTranslator({ stick: false });

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale("a1", "a5"), 1, "full range");
    assert.strictEqual(translator.getScale("a2", "a5"), 1.25, "some range");
    assert.strictEqual(translator.getScale("a2", "a2"), 5, "single point");
});

QUnit.test("get scale, canvas without margins", function(assert) {
    var translator = this.createTranslator({ stick: true }, {}, { left: 0, right: 0 });

    assert.strictEqual(translator.getScale("a5", "a1"), 1);
});

QUnit.test("get scale, inverted", function(assert) {
    var translator = this.createTranslator({ stick: true, invert: true }, {}, { left: 0 });

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale("a1"), 1);
});

QUnit.module("getMinBarSize", environment);

QUnit.test("Simple use", function(assert) {
    var translator = this.createTranslator({ min: 10, minVisible: 10, max: 90, maxVisible: 90 });

    assert.equal(translator.getMinBarSize(50), 4);
    assert.equal(translator.getMinBarSize(100), 8);
});

QUnit.test("min bar size more visible area", function(assert) {
    var translator = this.createTranslator({ min: 10, minVisible: 10, max: 90, maxVisible: 90 });

    assert.equal(translator.getMinBarSize(1500), 80);
    assert.equal(translator.getMinBarSize(2000), 80);
});
