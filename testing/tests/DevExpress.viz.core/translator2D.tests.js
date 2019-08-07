import $ from "jquery";
import translator2DModule from "viz/translators/translator2d";
import { adjust } from "core/utils/math";

function prepareScaleBreaks(array, breakSize) {
    var breaks = [],
        lastBreak,
        i;
    for(i = 0; i < array.length; i++) {
        lastBreak = breaks[breaks.length - 1];
        if(lastBreak) {
            breaks.push({
                from: array[i].from,
                to: array[i].to,
                cumulativeWidth: !array[i].gapSize ? breakSize + lastBreak.cumulativeWidth : lastBreak.cumulativeWidth
            });
        } else {
            breaks.push({
                from: array[i].from,
                to: array[i].to,
                cumulativeWidth: !array[i].gapSize ? breakSize : 0
            });
        }
    }
    return breaks;
}

function createTranslatorWithScaleBreaks(options) {
    var breakSize = options.breakSize || 20,
        breaks = prepareScaleBreaks(options.breaks || [{ from: 150, to: 200 }, { from: 350, to: 370 }, { from: 590, to: 650 }], breakSize);
    return this.createTranslator({ min: options.min || 100, max: options.max || 700, breaks: breaks, invert: options.invert }, null, { breaksSize: breakSize });
}

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
    createTranslator: function(range, canvas, options) {
        return this._createTranslator($.extend({ axisType: 'continuous', dataType: 'numeric' }, range),
            canvas || { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 }, $.extend({}, { isHorizontal: true, breaksSize: 0 }, options));
    }
};

var getObjectData = function(object) {
    var propertyName,
        result = {};
    for(propertyName in object) {
        if(typeof object[propertyName] !== 'function') {
            if(typeof object[propertyName] === 'number') {
                result[propertyName] = Number(object[propertyName].toFixed(7));
            } else {
                result[propertyName] = object[propertyName];
            }
        }
    }
    return result;
};

QUnit.module('Life cycle', environment);

QUnit.test('Create vertical translator', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { min: 0, minVisible: 10, max: 100, maxVisible: 90, interval: 20, axisType: 'continuous', dataType: 'numeric', invert: true });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
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

QUnit.test('Create vertical translator with paddings', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({ startPadding: 50, endPadding: 50 }, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.equal(translator._canvasOptions.startPoint, 60);
    assert.equal(translator._canvasOptions.endPoint, 290);
    assert.equal(translator._canvasOptions.invert, false);

    assert.equal(translator._canvasOptions.canvasLength, 230);
});

QUnit.test('Create horizontal translator', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, optionsHorizontal);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { min: 0, minVisible: 10, max: 100, maxVisible: 90, interval: 20, axisType: 'continuous', dataType: 'numeric', invert: true });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
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

QUnit.test('Create horizontal translator with paddings', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({ startPadding: 50, endPadding: 50 }, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: true });

    assert.equal(translator._canvasOptions.startPoint, 120);
    assert.equal(translator._canvasOptions.endPoint, 530);
    assert.equal(translator._canvasOptions.invert, true);

    assert.equal(translator._canvasOptions.canvasLength, 410);
});

QUnit.test('Create numeric translator', function(assert) {
    var range = $.extend({}, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { min: 0, minVisible: 0, max: 100, maxVisible: 100, interval: 20, axisType: 'continuous', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 100, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 100, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 100, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 100, 'range max visible is correct');

    assert.equal(translator.translate(100), 325);
    assert.equal(translator.to(100), 325);
    assert.equal(translator.to(null), null);
    assert.equal(translator.to(12), null);
});

QUnit.test('Create horizontal numeric translator when business range delta = 0, Min = max = minVisible = maxVisible = 0 (T696532)', function(assert) {
    var range = {
            min: 0,
            max: 0,
            interval: 0,
            axisType: 'continuous',
            dataType: 'numeric'
        },
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { shiftZeroValue: true });

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 0, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 0, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 0, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 0, 'range max visible is correct');

    assert.equal(translator.translate(0), 70);
    assert.equal(translator.to(0), 70);
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 100, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 50, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 50, 'range max visible is correct');
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, -10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 10, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 0, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 0, 'range max visible is correct');
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 100, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 10, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 10, 'range max visible is correct');
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin, 10, 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax, 100, 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible, 100, 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible, 100, 'range max visible is correct');
});

QUnit.test('Create datetime translator', function(assert) {
    var range = $.extend({}, datetimeRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { min: new Date(2012, 9, 1), max: new Date(2012, 9, 2), minVisible: new Date(2012, 9, 1), maxVisible: new Date(2012, 9, 2), interval: new Date(2012, 9, 2) - new Date(2012, 9, 1), axisType: 'continuous', dataType: 'datetime' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
    assert.ok($.isFunction(translator.getInterval));
});

QUnit.test('Create datetime translator when business range delta = 0. min = minVisible = maxVisible = max', function(assert) {
    var range = {
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max visible is correct');
});

QUnit.test('Create datetime translator when business range delta = 0. min < minVisible = maxVisible < max', function(assert) {
    var range = {
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(1990, 1, 1).valueOf(), 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2010, 1, 1).valueOf(), 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max visible is correct');
});

QUnit.test('Create datetime translator when business range delta = 0. min = minVisible = maxVisible < max', function(assert) {
    var range = {
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2010, 1, 1).valueOf(), 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max visible is correct');
});

QUnit.test('Create datetime translator when business range delta = 0. min < minVisible = maxVisible = max', function(assert) {
    var range = {
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

    translator = this.createTranslator(range, canvas);

    assert.ok(translator);
    assert.equal(translator._canvasOptions.rangeMin.valueOf(), new Date(1990, 1, 1).valueOf(), 'range min is correct');
    assert.equal(translator._canvasOptions.rangeMax.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max is correct');
    assert.equal(translator._canvasOptions.rangeMinVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range min visible is correct');
    assert.equal(translator._canvasOptions.rangeMaxVisible.valueOf(), new Date(2000, 1, 1).valueOf(), 'range max visible is correct');
});

QUnit.test('Create discrete translator (Stick = false, invert = false)', function(assert) {
    var range = $.extend({}, discreteRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, $.extend({ stick: false }, optionsHorizontal));

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { categories: ['First', 'Second', 'Third', 'Fourth'], axisType: 'discrete', dataType: 'string' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
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
    var range = $.extend({ invert: true }, discreteRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, $.extend({ stick: true }, optionsHorizontal));

    assert.equal(translator._canvasOptions.interval, 170);
    assert.deepEqual(translator._categoriesToPoints, {
        'First': 0,
        'Second': 1,
        'Third': 2,
        'Fourth': 3
    });
});

QUnit.test('Create discrete translator (Stick = true, addSpiderCategory = true)', function(assert) {
    var canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(discreteRange, canvas, $.extend({ stick: false }, optionsHorizontal));

    assert.equal(translator._canvasOptions.interval, 127.5);
    assert.deepEqual(translator._categoriesToPoints, {
        'First': 0,
        'Second': 1,
        'Third': 2,
        'Fourth': 3
    });
});

QUnit.test('Create logarithmic translator', function(assert) {
    var range = $.extend({ minVisible: 100, maxVisible: 1000 }, logarithmicRange),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { min: 10, minVisible: 100, max: 10000, maxVisible: 1000, interval: 1, base: 10, axisType: 'logarithmic', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
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
    var range = $.extend({}, logarithmicRange, { min: 10, max: 10, minVisible: 10, maxVisible: 10 }),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { min: 10, minVisible: 10, max: 10, maxVisible: 10, interval: 1, base: 10, axisType: 'logarithmic', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
    assert.ok($.isFunction(translator.getInterval));

    assert.equal(translator._canvasOptions.rangeMaxVisible, 1);
    assert.equal(translator._canvasOptions.rangeMinVisible, 1);
    assert.equal(translator._canvasOptions.rangeMin, 1);
    assert.equal(translator._canvasOptions.rangeMax, 1);
    assert.equal(translator._canvasOptions.base, 10);

    assert.roughEqual(translator._canvasOptions.rangeDoubleError, 0.0001, 0.000001);
    assert.equal(translator._canvasOptions.ratioOfCanvasRange, Infinity);
});

QUnit.test('Create logarithmic translator. Base = 2', function(assert) {
    var range = $.extend({}, logarithmicRange, { min: 2, max: 32, minVisible: 4, maxVisible: 16, base: 2 }),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.ok(translator);
    assert.deepEqual(translator._canvas, { width: 610, height: 400, left: 70, top: 10, right: 30, bottom: 60 });
    assert.deepEqual(getObjectData(translator._businessRange), { min: 2, minVisible: 4, max: 32, maxVisible: 16, interval: 1, base: 2, axisType: 'logarithmic', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
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

    // act
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
    assert.deepEqual(getObjectData(translator._businessRange), { min: -1000, minVisible: -600, maxVisible: -90, max: -10, invert: false, axisType: 'continuous', dataType: 'numeric' });

    assert.ok($.isFunction(translator.translate));
    assert.ok($.isFunction(translator.from));
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
    assert.ok($.isFunction(translator.from));
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
    assert.deepEqual(getObjectData(range), { min: 0, minVisible: 10, max: 100, maxVisible: 90, interval: 20, axisType: 'continuous', dataType: 'numeric', invert: true });
});

QUnit.test('Get canvas visible area', function(assert) {
    var visibleArea,
        canvas = $.extend({}, canvasTemplate),
        translator = new translator2DModule.Translator2D($.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange), canvas, optionsHorizontal);

    visibleArea = translator.getCanvasVisibleArea();

    assert.ok(visibleArea);
    assert.deepEqual(visibleArea, { min: 70, max: 580 });
});

QUnit.module('Dummy translator, range is empty', environment);

QUnit.test('Horizontal translator. Translate', function(assert) {
    var translator = this.createTranslator({}, { width: 1000, left: 100, right: 200, height: 20, top: 2, bottom: 4 });

    assert.equal(translator.translate(100.4), 200);
    assert.equal(translator.translate(200.6), 301);
    assert.equal(translator.translate(1000), 800);
});

QUnit.test('Vertical translator. Translate', function(assert) {
    var translator = this.createTranslator({}, { height: 1000, top: 100, bottom: 200, width: 20, left: 2, right: 4 }, { isHorizontal: false });

    assert.equal(translator.translate(100.4), 200);
    assert.equal(translator.translate(200.6), 301);
    assert.equal(translator.translate(1000), 800);
});

QUnit.test('Horizontal translator with conversionValue. Translate', function(assert) {
    var translator = this.createTranslator({}, { width: 1000, left: 100, right: 200, height: 20, top: 2, bottom: 4 }, { conversionValue: true });

    assert.equal(translator.translate(100.4), 200.4);
    assert.equal(translator.translate(200.6), 300.6);
    assert.equal(translator.translate(1000), 800);
});

QUnit.test('Horizontal translator. From', function(assert) {
    var translator = this.createTranslator({}, { width: 1000, left: 100, right: 200, height: 20, top: 2, bottom: 4 });

    assert.equal(translator.from(200), 100);
    assert.equal(translator.from(300), 200);
});

QUnit.test('Vertical translator. From', function(assert) {
    var translator = this.createTranslator({}, { left: 100, top: 200 }, { isHorizontal: false });

    assert.equal(translator.from(300), 100);
    assert.equal(translator.from(400), 200);
});

QUnit.module('Numeric translator', environment);

QUnit.test('Translate. Positive values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700 });

    assert.equal(translator.translate(100), 300, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(1000), 2100, 'BP more than min');
    assert.equal(translator.translate(300), 700, 'BP inside range');
    assert.equal(translator.translate(200), 500, 'BP on the min');
    assert.equal(translator.translate(700), 1500, 'BP on the max');
    assert.equal(translator.translate(200 - 1e-8), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(700 + 1e-8), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Positive values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, invert: true });

    assert.equal(translator.translate(100), 1700, 'BP less than min');
    assert.equal(translator.translate(1000), -100, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(300), 1300, 'BP inside range');
    assert.equal(translator.translate(200), 1500, 'BP on the min');
    assert.equal(translator.translate(700), 500, 'BP on the max');
    assert.equal(translator.translate(200 - 1e-8), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(700 + 1e-8), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Negative values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200 });

    assert.equal(translator.translate(-1000), -100, 'BP less than min');
    assert.equal(translator.translate(-100), 1700, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(-600), 700, 'BP inside range');
    assert.equal(translator.translate(-700), 500, 'BP on the min');
    assert.equal(translator.translate(-200), 1500, 'BP on the max');
    assert.equal(translator.translate(-700 - 1e-8), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(-200 + 1e-8), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Negative values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200, invert: true });

    assert.equal(translator.translate(-1000), 2100, 'BP less than min');
    assert.equal(translator.translate(-100), 300, 'BP more than min');
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
        { isHorizontal: true, breaksSize: 0, conversionValue: function(value) { return value; } });

    assert.equal(translator.translate(322.33), 744.66, 'value should not be rounded');
});

QUnit.test("translate. conversion is not a function", function(assert) {
    var translator = this._createTranslator($.extend({ axisType: 'continuous', dataType: 'numeric', interval: 1, invert: false }, { min: 200, max: 700 }),
        { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
        { isHorizontal: true, breaksSize: 0, conversionValue: "" });

    assert.equal(translator.translate(322.33), 745, 'value should rounded');
});

QUnit.test('from. Positive values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700 });

    assert.equal(translator.from(300), 100, 'Coord less than min');
    assert.equal(translator.from(1800), 850, 'Coord more than min');
    assert.equal(translator.from(500), 200, 'Coord on the min');
    assert.equal(translator.from(1500), 700, 'Coord on the max');
    assert.equal(translator.from(1000), 450, 'Coord inside range');
});

QUnit.test('from. Positive values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, invert: true });

    assert.equal(translator.from(300), 800, 'Coord less than min');
    assert.equal(translator.from(1800), 50, 'Coord more than min');
    assert.equal(translator.from(500), 700, 'Coord on the min');
    assert.equal(translator.from(1500), 200, 'Coord on the max');
    assert.equal(translator.from(1000), 450, 'Coord inside range');
});

QUnit.test('from. Negative values. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200 });

    assert.equal(translator.from(300), -800, 'Coord less than min');
    assert.equal(translator.from(1800), -50, 'Coord more than min');
    assert.equal(translator.from(500), -700, 'Coord on the min');
    assert.equal(translator.from(1500), -200, 'Coord on the max');
    assert.equal(translator.from(1000), -450, 'Coord inside range');
});

QUnit.test('from. Negative values. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: -700, max: -200, invert: true });

    assert.equal(translator.from(300), -100, 'Coord less than min');
    assert.equal(translator.from(1800), -850, 'Coord more than min');
    assert.equal(translator.from(500), -200, 'Coord on the min');
    assert.equal(translator.from(1500), -700, 'Coord on the max');
    assert.equal(translator.from(1000), -450, 'Coord inside range');
});

QUnit.test('Translate. Scale breaks is empty array', function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, { min: 200, max: 700, breaks: [] });

    assert.equal(translator.translate(300), 700, 'BP inside range');
    assert.equal(translator.translate(200), 500, 'BP on the min');
    assert.equal(translator.translate(700), 1500, 'BP on the max');
});

QUnit.test('Translate. Update translator with business range with empty scale breaks', function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: 200, max: 700
    });

    translator.updateBusinessRange({ min: 200, max: 700, breaks: [] });

    assert.strictEqual(translator.translate(450), 1000);
});

QUnit.test("Translate. Scale breaks. Values out of the breaks and should be traslated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.translate(100), 500);
    assert.strictEqual(translator.translate(149), 598);
    assert.strictEqual(translator.translate(200), 620);
    assert.strictEqual(translator.translate(300), 820);
    assert.strictEqual(translator.translate(450), 1100);
    assert.strictEqual(translator.translate(700), 1500);
});

QUnit.test("Translate. Scale breaks. Values inside the breaks and shouldn't be translated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.translate(150), null);
    assert.strictEqual(translator.translate(160), null);
    assert.strictEqual(translator.translate(360), null);
    assert.strictEqual(translator.translate(620), null);
});

QUnit.test("Translate. Scale breaks. Inverted axis", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        invert: true
    });

    assert.strictEqual(translator.translate(100), 1500);
    assert.strictEqual(translator.translate(450), 900);
    assert.strictEqual(translator.translate(700), 500);
});

QUnit.test("Translate. Scale breaks. Values on the breaks and should be translated to right side of break if direction>0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.translate(150, 1), 600);
});

QUnit.test("Translate. Scale breaks. Values on the breaks and should be translated to left side of break if direction<0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.translate(150, -1), 620);
});

QUnit.test("from. Scale breaks. Values not on the breaks and should be untranslated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.from(500), 100);
    assert.strictEqual(translator.from(820), 300);
    assert.strictEqual(translator.from(1100), 450);
    assert.strictEqual(translator.from(1500), 700);
});

QUnit.test("from. Scale breaks. Values on the breaks and should not be untranslated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.from(610), null);
    assert.strictEqual(translator.from(1390), null);
});

QUnit.test("from. Scale breaks. Values on the breaks and should be untranslated to left side of break if direction<0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.from(610, -1), 150);
    assert.strictEqual(translator.from(1390, -1), 590);
});

QUnit.test("from. Scale breaks. Values on the breaks and should be untranslated to right side of break if direction>0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    assert.strictEqual(translator.from(610, 1), 200);
    assert.strictEqual(translator.from(1390, 1), 650);
});

QUnit.test("from. Scale breaks. Inverted axis. Values on the breaks and should be untranslated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        invert: true
    });

    assert.strictEqual(translator.from(500), 700);
    assert.strictEqual(translator.from(600), 650);
    assert.strictEqual(translator.from(700), 550);
    assert.strictEqual(translator.from(820), 490);
    assert.strictEqual(translator.from(1180), 300);
    assert.strictEqual(translator.from(1500), 100);
});

QUnit.test("from. Scale breaks. Inverted axis. Values in the breaks and should not be untranslated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        invert: true
    });

    assert.strictEqual(translator.from(1062), null);
    assert.strictEqual(translator.from(1382), null);
});

QUnit.test('GetInterval', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, interval: 10.55 });

    assert.equal(translator.getInterval(), 21);
});

QUnit.test('GetInterval when interval is 0', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 700, interval: 0 });

    assert.equal(translator.getInterval(), 1000);
});

QUnit.test('GetInterval when interval is 0, because max is equal min', function(assert) {
    var translator = this.createTranslator({ min: 200, max: 200, interval: 0 });

    assert.equal(translator.getInterval(), 1000);
});

QUnit.test("isValid", function(assert) {
    var translator = this.createTranslator({ min: 100, max: 200 });

    assert.strictEqual(translator.isValid(null), false, "null");
    assert.strictEqual(translator.isValid(undefined), false, "undefined");
    assert.strictEqual(translator.isValid({}), false, "object");
});


QUnit.test("Default positioin when 0 is in break", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, { min: -200, max: 700, breaks: [{ from: -100, to: 100 }] });

    assert.equal(translator.translate("canvas_position_default"), 640, 'BP inside range');
});

QUnit.module('Datetime translator', {
    beforeEach: function() {
        this.createTranslator = function(range, _, options) {
            return new translator2DModule.Translator2D($.extend({ axisType: 'continuous', dataType: 'datetime', interval: 1, invert: false }, range),
                { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
                $.extend({}, { isHorizontal: true, breaksSize: 0 }, options));
        };
    }
});

QUnit.test('Translate. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2) });

    assert.equal(translator.translate(new Date(2012, 7, 1)), -30500, 'BP less than min');
    assert.equal(translator.translate(new Date(2012, 9, 1)), 30500, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2012, 8, 1, 12)), 1000, 'BP inside range');
    assert.equal(translator.translate(new Date(2012, 8, 1)), 500, 'BP on the min');
    assert.equal(translator.translate(new Date(2012, 8, 2)), 1500, 'BP on the max');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 1).valueOf() - 1e2)), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 2).valueOf() + 1e2)), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2), invert: true });

    assert.equal(translator.translate(new Date(2012, 7, 1)), 32500, 'BP less than min');
    assert.equal(translator.translate(new Date(2012, 9, 1)), -28500, 'BP more than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2012, 8, 1, 12)), 1000, 'BP inside range');
    assert.equal(translator.translate(new Date(2012, 8, 1)), 1500, 'BP on the min');
    assert.equal(translator.translate(new Date(2012, 8, 2)), 500, 'BP on the max');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 1).valueOf() - 1e2)), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(new Date(new Date(2012, 8, 2).valueOf() + 1e2)), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('from. Invert = false', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2) });

    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.deepEqual(translator.from(300), new Date(2012, 7, 31, 19, 12), 'Coord less than min');
    assert.deepEqual(translator.from(1800), new Date(2012, 8, 2, 7, 12), 'Coord more than min');
    assert.deepEqual(translator.from(500), new Date(2012, 8, 1), 'Coord on the min');
    assert.deepEqual(translator.from(1500), new Date(2012, 8, 2), 'Coord on the max');
    assert.deepEqual(translator.from(1000), new Date(2012, 8, 1, 12), 'Coord inside range');
});

QUnit.test('from. Invert = true', function(assert) {
    var translator = this.createTranslator({ min: new Date(2012, 8, 1), max: new Date(2012, 8, 2), invert: true });

    assert.deepEqual(translator.from(1800), new Date(2012, 7, 31, 16, 48), 'Coord more than max');
    assert.deepEqual(translator.from(300), new Date(2012, 8, 2, 4, 48), 'Coord less than min');
    assert.deepEqual(translator.from(500), new Date(2012, 8, 2), 'Coord on the min');
    assert.deepEqual(translator.from(1500), new Date(2012, 8, 1), 'Coord on the max');
    assert.deepEqual(translator.from(1000), new Date(2012, 8, 1, 12), 'Coord inside range');
});

QUnit.test("from. With scale breaks. Values not in the breaks and translated. Mix scale breaks and gaps(weekends)", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: new Date(2012, 8, 1), max: new Date(2012, 8, 2),
        breaks: [
            { from: new Date(2012, 8, 1, 10), to: new Date(2012, 8, 1, 11) },
            { from: new Date(2012, 8, 1, 20), to: new Date(2012, 8, 1, 21), gapSize: "some size" },
            { from: new Date(2012, 8, 1, 22), to: new Date(2012, 8, 1, 23) }
        ]
    });

    assert.deepEqual(translator.from(500), new Date(2012, 8, 1));
    assert.deepEqual(translator.from(1160), new Date(2012, 8, 1, 15));
    assert.deepEqual(translator.from(1400), new Date(2012, 8, 1, 21, 15));
    assert.deepEqual(translator.from(1500), new Date(2012, 8, 2));
});

QUnit.test("from. With scale breaks. Value in the scale break and shouldn't translated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: new Date(2012, 8, 1), max: new Date(2012, 8, 2),
        breaks: [{ from: new Date(2012, 8, 1, 10), to: new Date(2012, 8, 1, 11) }, { from: new Date(2012, 8, 1, 20), to: new Date(2012, 8, 1, 21) }]
    });

    assert.deepEqual(translator.from(950), null);
});

QUnit.test("from. Scale breaks. Values in the breaks and should be untranslated to left side of break if direction<0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: new Date(2012, 8, 1), max: new Date(2012, 8, 2),
        breaks: [{ from: new Date(2012, 8, 1, 10), to: new Date(2012, 8, 1, 11) }, { from: new Date(2012, 8, 1, 20), to: new Date(2012, 8, 1, 21) }]
    });

    assert.deepEqual(translator.from(950, -1), new Date(2012, 8, 1, 10));
});

QUnit.test("from. Scale breaks. Values in the breaks and should be untranslated to right side of break if direction>0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: new Date(2012, 8, 1), max: new Date(2012, 8, 2),
        breaks: [{ from: new Date(2012, 8, 1, 10), to: new Date(2012, 8, 1, 11) }, { from: new Date(2012, 8, 1, 20), to: new Date(2012, 8, 1, 21) }]
    });

    assert.deepEqual(translator.from(950, 1), new Date(2012, 8, 1, 11));
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
        this.createTranslator = function(range, _, options) {
            return new translator2DModule.Translator2D($.extend({ axisType: 'logarithmic', dataType: 'numeric', interval: 1, invert: false, base: 10 }, range),
                { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
                $.extend({}, { isHorizontal: true, breaksSize: 0 }, options));
        };
    }
});

QUnit.test('Translate. Big numbers. Invert = false', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 100, max: 10000 });

    assert.equal(translator.translate(10), 0, 'BP less than min');
    assert.equal(translator.translate(100000), 2000, 'BP more than min');
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

    assert.equal(translator.translate(10), 2000, 'BP less than min');
    assert.equal(translator.translate(100000), 0, 'BP more than min');
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

    assert.equal(translator.translate(0.00001), 0, 'BP less than min');
    assert.equal(translator.translate(0.1), 2000, 'BP more than min');
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

    assert.equal(translator.translate(0.00001), 2000, 'BP less than min');
    assert.equal(translator.translate(0.1), 0, 'BP more than min');
    assert.equal(translator.translate(0.001), 1000, 'BP inside range');
    assert.equal(translator.translate(0.0001), 1500, 'BP on the min');
    assert.equal(translator.translate(0.01), 500, 'BP on the max');
    assert.equal(translator.translate(0.0001 - doubleDelta * 0.0001), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(0.01 + doubleDelta * 0.01), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('from. Big numbers. Invert = false', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 100, max: 10000 });

    assert.equal(translator.from(0), 10, 'Coord less than min');
    assert.equal(translator.from(2000), 100000, 'Coord more than max');
    assert.roughEqual(translator.from(500), 100, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 10000, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 1000, doubleDelta, 'Coord inside range');
});

QUnit.test('from. Big numbers. Invert = true', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 100, max: 10000, invert: true });

    assert.equal(translator.from(0), 100000, 'Coord less than min');
    assert.equal(translator.from(2000), 10, 'Coord more than min');
    assert.roughEqual(translator.from(500), 10000, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 100, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 1000, doubleDelta, 'Coord inside range');
});

QUnit.test('from. Small numbers. Invert = false', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 0.0001, max: 0.01 });

    assert.roughEqual(translator.from(2000), 0.1, doubleDelta * 0.01, 'Coord less than min');
    assert.roughEqual(translator.from(0), 0.00001, doubleDelta * 0.01, 'Coord more than min');
    assert.roughEqual(translator.from(500), 0.0001, doubleDelta * 0.0001, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 0.01, doubleDelta * 0.01, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 0.001, doubleDelta * 0.001, 'Coord inside range');
});

QUnit.test('from. Small numbers. Invert = true', function(assert) {
    var doubleDelta = 0.00002,
        translator = this.createTranslator({ min: 0.0001, max: 0.01, invert: true });

    assert.roughEqual(translator.from(0), 0.1, doubleDelta * 0.01, 'Coord less than min');
    assert.roughEqual(translator.from(2000), 0.00001, doubleDelta * 0.01, 'Coord more than min');
    assert.roughEqual(translator.from(500), 0.01, doubleDelta * 0.01, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 0.0001, doubleDelta * 0.0001, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 0.001, doubleDelta * 0.001, 'Coord inside range');
});

QUnit.test("Translate. Scale breaks. Values inside of the breaks and should be translated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: 0.0001, max: 1000000,
        breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
        breakSize: 50
    });

    assert.strictEqual(translator.translate(0.0001), 500);
    assert.strictEqual(translator.translate(1), 850);
    assert.strictEqual(translator.translate(10), 1000);
    assert.strictEqual(translator.translate(100000), 1350);
    assert.strictEqual(translator.translate(1000000), 1500);
});

QUnit.test("Translate. Scale breaks. Values out of the breaks and shouldn't be translated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: 0.0001, max: 1000000,
        breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
        breakSize: 50
    });

    assert.strictEqual(translator.translate(0.01), null);
    assert.strictEqual(translator.translate(1000), null);
});

QUnit.test("Translate. Scale breaks. Values on the breaks and should be translated to right side of break if direction>0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: 0.0001, max: 1000000,
        breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
        breakSize: 50
    });

    assert.strictEqual(translator.translate(0.01, 1), 650);
});

QUnit.test("Translate. Scale breaks. Values on the breaks and should be translated to left side of break if direction<0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: 0.0001, max: 1000000,
        breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
        breakSize: 50
    });

    assert.strictEqual(translator.translate(0.01, -1), 700);
});

QUnit.test("from. Scale breaks. Values not on the breaks and should be untranslated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
            min: 0.0001, max: 1000000,
            breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
            breakSize: 50
        }),
        doubleDelta = 0.00001;

    assert.roughEqual(translator.from(500), 0.0001, doubleDelta);
    assert.roughEqual(translator.from(850), 1, doubleDelta);
    assert.roughEqual(translator.from(1000), 10, doubleDelta);
    assert.roughEqual(translator.from(1350), 100000, doubleDelta);
    assert.roughEqual(translator.from(1500), 1000000, doubleDelta);
});

QUnit.test("from. Scale breaks. Values on the breaks and should not be untranslated", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
        min: 0.0001, max: 1000000,
        breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
        breakSize: 50
    });

    assert.strictEqual(translator.from(670), null);
    assert.strictEqual(translator.from(1170), null);
});

QUnit.test("from. Scale breaks. Values in the breaks and should be untranslated to left side of break if direction<0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
            min: 0.0001, max: 1000000,
            breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
            breakSize: 50
        }),
        doubleDelta = 0.00001;

    assert.roughEqual(translator.from(670, -1), 0.001, doubleDelta);
});

QUnit.test("from. Scale breaks. Values in the breaks and should be untranslated to right side of break if direction>0", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {
            min: 0.0001, max: 1000000,
            breaks: [{ from: 0.001, to: 0.1 }, { from: 100, to: 10000 }],
            breakSize: 50
        }),
        doubleDelta = 0.00001;

    assert.roughEqual(translator.from(670, 1), 0.1, doubleDelta);
});

QUnit.test('GetInterval', function(assert) {
    var translator = this.createTranslator({ min: 1, max: 100000, interval: 0.5 });

    assert.equal(translator.getInterval(), 100);
});

QUnit.test('Translate. Big numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2 });

    assert.equal(translator.translate(2), 0, 'BP less than min');
    assert.equal(translator.translate(32), 2000, 'BP more than min');
    assert.equal(translator.translate(8), 1000, 'BP inside range');
    assert.equal(translator.translate(4), 500, 'BP on the min');
    assert.equal(translator.translate(16), 1500, 'BP on the max');
    assert.equal(translator.translate(4 - doubleDelta * 4), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(16 + doubleDelta * 16), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Big numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2, invert: true });

    assert.equal(translator.translate(2), 2000, 'BP less than min');
    assert.equal(translator.translate(34), -44, 'BP more than min');
    assert.equal(translator.translate(8), 1000, 'BP inside range');
    assert.equal(translator.translate(4), 1500, 'BP on the min');
    assert.equal(translator.translate(16), 500, 'BP on the max');
    assert.equal(translator.translate(4 - doubleDelta * 4), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(16 + doubleDelta * 16), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Small numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2 });

    assert.equal(translator.translate(0.03125), 0, 'BP less than min');
    assert.equal(translator.translate(0.5), 2000, 'BP more than min');
    assert.equal(translator.translate(0.125), 1000, 'BP inside range');
    assert.equal(translator.translate(0.0625), 500, 'BP on the min');
    assert.equal(translator.translate(0.25), 1500, 'BP on the max');
    assert.equal(translator.translate(0.0625 - doubleDelta * 0.0625), 500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(0.25 + doubleDelta * 0.25), 1500, 'BP on the max with double error (B253861)');
});

QUnit.test('Translate. Small numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2, invert: true });

    assert.equal(translator.translate(0.03125), 2000, 'BP less than min');
    assert.equal(translator.translate(0.5), 0, 'BP more than min');
    assert.equal(translator.translate(0.125), 1000, 'BP inside range');
    assert.equal(translator.translate(0.0625), 1500, 'BP on the min');
    assert.equal(translator.translate(0.25), 500, 'BP on the max');
    assert.equal(translator.translate(0.0625 - doubleDelta * 0.0625), 1500, 'BP on the min with double error (B253861)');
    assert.equal(translator.translate(0.25 + doubleDelta * 0.25), 500, 'BP on the max with double error (B253861)');
});

QUnit.test('from. Big numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2 });

    assert.roughEqual(translator.from(-1000), 0.5, doubleDelta, 'Coord less than min');
    assert.roughEqual(translator.from(2000), 32, doubleDelta, 'Coord more than min');
    assert.roughEqual(translator.from(500), 4, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 16, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 8, doubleDelta, 'Coord inside range');
});

QUnit.test('from. Big numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 4, max: 16, base: 2, invert: true });

    assert.roughEqual(translator.from(0), 32, doubleDelta, 'Coord less than min');
    assert.roughEqual(translator.from(3000), 0.5, doubleDelta, 'Coord more than min');
    assert.roughEqual(translator.from(500), 16, doubleDelta, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 4, doubleDelta, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 8, doubleDelta, 'Coord inside range');
});

QUnit.test('from. Small numbers. Invert = false. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2 });

    assert.roughEqual(translator.from(0), 0.03125, doubleDelta * 0.03125, 'Coord less than min');
    assert.roughEqual(translator.from(2000), 0.5, doubleDelta * 0.5, 'Coord more than min');
    assert.roughEqual(translator.from(500), 0.0625, doubleDelta * 0.0625, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 0.25, doubleDelta * 0.25, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 0.125, doubleDelta * 0.125, 'Coord inside range');
});

QUnit.test('from. Small numbers. Invert = true. Base = 2', function(assert) {
    var doubleDelta = 0.0000069,
        translator = this.createTranslator({ min: 0.0625, max: 0.25, base: 2, invert: true });

    assert.roughEqual(translator.from(2000), 0.03125, doubleDelta * 0.03125, 'Coord less than min');
    assert.roughEqual(translator.from(0), 0.5, doubleDelta * 0.5, 'Coord more than min');
    assert.roughEqual(translator.from(500), 0.25, doubleDelta * 0.25, 'Coord on the min');
    assert.roughEqual(translator.from(1500), 0.0625, doubleDelta * 0.0625, 'Coord on the max');
    assert.roughEqual(translator.from(1000), 0.125, doubleDelta * 0.125, 'Coord inside range');
});

QUnit.test('GetInterval. Base = 2', function(assert) {
    var translator = this.createTranslator({ min: 1, max: 32, base: 2, interval: 0.5 });

    assert.equal(translator.getInterval(), 100);
});

QUnit.module('Discrete translator', {
    beforeEach: function() {
        this.createTranslator = function(range, canvas, options) {
            canvas = canvas || { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 };
            return new translator2DModule.Translator2D($.extend({ categories: ['a1', 'a2', 'a3', 'a4', 'a5'], axisType: 'discrete', dataType: 'string', invert: false }, range),
                canvas, $.extend({ isHorizontal: true, stick: false }, options));
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
    var translator = this.createTranslator(undefined, undefined, { stick: true });

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 1000, 'BP inside range');
    assert.equal(translator.translate('a1'), 500, 'BP is first category');
    assert.equal(translator.translate('a5'), 1500, 'BP is last category');
});

QUnit.test('Translate. Invert = true. Stick = true.', function(assert) {
    var translator = this.createTranslator({ invert: true }, undefined, { stick: true });

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 1000, 'BP inside range');
    assert.equal(translator.translate('a1'), 1500, 'BP is first category');
    assert.equal(translator.translate('a5'), 500, 'BP is last category');
});

QUnit.test('Translate. AddSpiderCategory = true. Stick = true.', function(assert) {
    var translator = this.createTranslator(undefined, undefined, { addSpiderCategory: true, stick: true });

    assert.equal(translator.translate('a0'), null, 'BP not in categories (Q522516)');
    assert.equal(translator.translate('a3'), 900, 'BP inside range');
    assert.equal(translator.translate('a1'), 500, 'BP is first category');
    assert.equal(translator.translate('a5'), 1300, 'BP is last category');
});

QUnit.test('from. Invert = false. Stick = false.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 200,
        center = 100,
        translator = this.createTranslator({});

    assert.equal(translator.from(start - 10 * delta), "a1", 'Coord less than min');
    assert.equal(translator.from(end + 10 * delta), "a5", 'Coord more than min');

    assert.strictEqual(translator.from(start), 'a1');

    assert.strictEqual(translator.from(start + delta), 'a2');
    assert.strictEqual(translator.from(start + delta * 2), 'a3');
    assert.strictEqual(translator.from(start + delta * 3), 'a4');
    assert.strictEqual(translator.from(start + delta * 4), 'a5');

    assert.strictEqual(translator.from(start + center), 'a1');
    assert.strictEqual(translator.from(start + delta + center), 'a2');
    assert.strictEqual(translator.from(start + delta * 2 + center), 'a3');
    assert.strictEqual(translator.from(start + delta * 3 + center), 'a4');
    assert.strictEqual(translator.from(start + delta * 4 + center), 'a5');
});

QUnit.test('from. border values.', function(assert) {
    var start = 27,
        delta = 141,
        translator = this.createTranslator({ categories: ['1q', '2q', '3q', '4q', '5q', '6q', '7q'] }, { bottom: 22, height: 200, left: 27, right: 27, top: 29, width: 1041 });

    assert.strictEqual(translator.from(start - 3 * delta), '1q');
    assert.strictEqual(translator.from(start + delta - 1), '1q');
    assert.strictEqual(translator.from(start + delta + 1), '2q');
    assert.strictEqual(translator.from(start + 2 * delta - 1), '2q');
    assert.strictEqual(translator.from(start + 2 * delta + 1), '3q');
    assert.strictEqual(translator.from(start + 3 * delta - 1), '3q');
    assert.strictEqual(translator.from(start + 3 * delta + 1), '4q');
    assert.strictEqual(translator.from(start + 4 * delta - 1), '4q');
    assert.strictEqual(translator.from(start + 4 * delta + 1), '5q');
    assert.strictEqual(translator.from(start + 5 * delta - 1), '5q');
    assert.strictEqual(translator.from(start + 5 * delta + 1), '6q');
    assert.strictEqual(translator.from(start + 6 * delta - 1), '6q');
    assert.strictEqual(translator.from(start + 6 * delta + 1), '7q');
    assert.strictEqual(translator.from(start + 10 * delta), '7q');
});

QUnit.test('from. Invert = true. Stick = false.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 200,
        center = 100,
        translator = this.createTranslator({ invert: true });

    assert.equal(translator.from(start - 10 * delta), "a5", 'Coord less than min');
    assert.equal(translator.from(end + 10 * delta), "a1", 'Coord more than min');

    assert.strictEqual(translator.from(start), 'a5');
    assert.strictEqual(translator.from(start + delta), 'a4');
    assert.strictEqual(translator.from(start + delta * 2), 'a3');
    assert.strictEqual(translator.from(start + delta * 3), 'a2');
    assert.strictEqual(translator.from(start + delta * 4), 'a1');

    assert.strictEqual(translator.from(start + center), 'a5');
    assert.strictEqual(translator.from(start + delta + center), 'a4');
    assert.strictEqual(translator.from(start + delta * 2 + center), 'a3');
    assert.strictEqual(translator.from(start + delta * 3 + center), 'a2');
    assert.strictEqual(translator.from(start + delta * 4 + center), 'a1');
});

QUnit.test('from. Invert = false. Stick = true.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 250,
        center = 125,
        translator = this.createTranslator(undefined, undefined, { stick: true });

    assert.equal(translator.from(start - 10 * delta), "a1", 'Coord less than min');
    assert.equal(translator.from(end + 10 * delta), "a5", 'Coord more than min');

    assert.strictEqual(translator.from(start), 'a1');
    assert.strictEqual(translator.from(start + delta), 'a2');
    assert.strictEqual(translator.from(start + delta * 2), 'a3');
    assert.strictEqual(translator.from(start + delta * 3), 'a4');
    assert.strictEqual(translator.from(start + delta * 4), 'a5');

    assert.strictEqual(translator.from(start + center / 2), 'a1');
    assert.strictEqual(translator.from(start + center), 'a2');
    assert.strictEqual(translator.from(start + delta + center), 'a3');
    assert.strictEqual(translator.from(start + delta * 2 + center), 'a4');
    assert.strictEqual(translator.from(start + delta * 3 + center), 'a5');
});

QUnit.test('from. Invert = true. Stick = true.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 250,
        center = 125,
        translator = this.createTranslator({ invert: true }, undefined, { stick: true });

    assert.equal(translator.from(start - 10 * delta), "a5", 'Coord less than min');
    assert.equal(translator.from(end + 10 * delta), "a1", 'Coord more than min');

    assert.strictEqual(translator.from(start), 'a5');
    assert.strictEqual(translator.from(start + delta), 'a4');
    assert.strictEqual(translator.from(start + delta * 2), 'a3');
    assert.strictEqual(translator.from(start + delta * 3), 'a2');
    assert.strictEqual(translator.from(start + delta * 4), 'a1');

    assert.strictEqual(translator.from(start + center / 2), 'a5');
    assert.strictEqual(translator.from(start + center), 'a4');
    assert.strictEqual(translator.from(start + delta + center), 'a3');
    assert.strictEqual(translator.from(start + delta * 2 + center), 'a2');
    assert.strictEqual(translator.from(start + delta * 3 + center), 'a1');
});

QUnit.test('from. AddSpiderCategory = true. Stick = true.', function(assert) {
    var start = 500,
        end = 1500,
        delta = 250,
        center = 125,
        translator = this.createTranslator(undefined, undefined, { addSpiderCategory: true, stick: true });

    assert.equal(translator.from(start - 10 * delta), "a1", 'Coord less than min');
    assert.equal(translator.from(end + 10 * delta), "a5", 'Coord more than max');

    assert.strictEqual(translator.from(start), 'a1');
    assert.strictEqual(translator.from(start + delta), 'a2');
    assert.strictEqual(translator.from(start + delta * 2), 'a4');
    assert.strictEqual(translator.from(start + delta * 3), 'a5');
    assert.strictEqual(translator.from(start + delta * 4), 'a5');

    assert.strictEqual(translator.from(start + center / 2), 'a1');
    assert.strictEqual(translator.from(start + center), 'a2');
    assert.strictEqual(translator.from(start + delta + center), 'a3');
    assert.strictEqual(translator.from(start + delta * 2 + center), 'a4');
    assert.strictEqual(translator.from(start + delta * 3 + center), 'a5');
});

QUnit.test('from. Visible categories', function(assert) {
    var start = 500,
        delta = 250,
        translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a4' });

    assert.equal(translator.from(start - 10 * delta), "a2");
    assert.equal(translator.from(start - delta), "a2");

    assert.equal(translator.from(start), 'a2');
    assert.equal(translator.from(start + delta), 'a2');
    assert.equal(translator.from(start + delta * 2), 'a3');
    assert.equal(translator.from(start + delta * 3), 'a4');
    assert.equal(translator.from(start + delta * 4), 'a4');

    assert.equal(translator.from(start + delta * 5), "a4");
    assert.equal(translator.from(start + delta * 10), "a4");
});

QUnit.test('GetInterval (Stick = false)', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator._canvasOptions.interval, 200);
    assert.equal(translator.getInterval(), 200);
});

QUnit.test('GetInterval (Stick = true)', function(assert) {
    var translator = this.createTranslator(undefined, undefined, { stick: true });

    assert.equal(translator._canvasOptions.interval, 250);
    assert.equal(translator.getInterval(), 250);
});

// T111250
QUnit.test('With 1 category. stick = true', function(assert) {
    var translator = this.createTranslator({ categories: ["a"] }, undefined, { stick: true });

    assert.equal(translator._canvasOptions.interval, translator._canvasOptions.canvasLength);
});

QUnit.test('One categories. stick = true', function(assert) {
    var translator = this.createTranslator({ categories: ['a1'] }, undefined, { stick: true });

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

QUnit.test('discrete zooming. invert. from', function(assert) {
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a3', invert: true });

    assert.strictEqual(translator.from(250), 'a3');
    assert.strictEqual(translator.from(750), 'a3');
    assert.strictEqual(translator.from(1250), 'a2');
    assert.strictEqual(translator.from(1500), 'a2');
    assert.strictEqual(translator.from(1700), 'a2');
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

QUnit.test('from. directionOffset = -1', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.from(0, -1), 'a1');
    assert.equal(translator.from(500, -1), 'a1');
    assert.equal(translator.from(700, -1), 'a2');
    assert.equal(translator.from(900, -1), 'a3');
    assert.equal(translator.from(1100, -1), 'a4');
    assert.equal(translator.from(1500, -1), 'a5');
});

QUnit.test('from. directionOffset = 1', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.from(0, 1), 'a1');
    assert.equal(translator.from(500, 1), 'a1');
    assert.equal(translator.from(700, 1), 'a1');
    assert.equal(translator.from(900, 1), 'a2');
    assert.equal(translator.from(1100, 1), 'a3');
    assert.equal(translator.from(1500, 1), 'a5');
});

QUnit.test('from. directionOffset = 0', function(assert) {
    var translator = this.createTranslator({});

    assert.equal(translator.from(0, 0), 'a1');
    assert.equal(translator.from(500, 0), 'a1');
    assert.equal(translator.from(700, 0), 'a2');
    assert.equal(translator.from(900, 0), 'a3');
    assert.equal(translator.from(1100, 0), 'a4');
    assert.equal(translator.from(1500, 0), 'a5');
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
            return new translator2DModule.Translator2D($.extend({ axisType: 'semidiscrete', dataType: 'numeric', invert: false }, range),
                canvas, { isHorizontal: true, interval: interval || 5, stick: false });
        };
    }
});

QUnit.test('Translate undefined/null value', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 });

    assert.equal(translator.translate(undefined), null);
    assert.equal(translator.translate(null), null);
});

QUnit.test('Translate. Numeric, interval 5', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 }); // 10, 15, 20, 25, 30

    assert.equal(translator.translate(6.5), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(40), null, 'BP more than max');
    assert.equal(translator.translate(24.6), 1000, 'BP inside range');
    assert.equal(translator.translate(14), 600, 'BP on the min');
    assert.equal(translator.translate(31.4), 1400, 'BP on the max');
});

QUnit.test('Translate with interval. Numeric, interval 5', function(assert) {
    var translator = this.createTranslator({ min: 5, max: 20 }); // 5, 10, 15, 20

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
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 19, 236)), 1000, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 17, 236)), 600, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 0, 21, 236)), 1400, 'BP on the max');// 5
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
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 19, 50, 236)), 1000, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 17, 50, 236)), 600, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2015, 5, 1, 0, 21, 50, 236)), 1400, 'BP on the max');// 5
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
    assert.equal(translator.translate(new Date(2015, 5, 1, 19, 10, 50, 236)), 1000, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2015, 5, 1, 17, 10, 50, 236)), 600, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2015, 5, 1, 21, 10, 50, 236)), 1400, 'BP on the max');// 5
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
    assert.equal(translator.translate(new Date(2015, 5, 19, 15, 10, 50, 236)), 1000, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2015, 5, 17, 15, 10, 50, 236)), 600, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2015, 5, 21, 15, 10, 50, 236)), 1400, 'BP on the max');// 5
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
    assert.equal(translator.translate(new Date(2015, 5, 25, 15, 10, 50, 236)), 1000, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2015, 5, 9, 15, 10, 50, 236)), 600, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2015, 6, 7, 15, 10, 50, 236)), 1400, 'BP on the max');// 5
});

QUnit.test('Translate. Datetime, interval month', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2015, 4, 1, 0, 0, 0, 0),
        max: new Date(2015, 8, 1, 0, 0, 0, 0),
        dataType: 'datetime'
    }, "month");

    assert.equal(translator.translate(new Date(2015, 3, 1, 0, 0, 0, 0)), null, 'BP less than min');
    assert.equal(translator.translate(undefined), null, 'BP undefined');
    assert.equal(translator.translate(new Date(2015, 9, 1, 0, 0, 0, 0)), null, 'BP more than max');
    assert.equal(translator.translate(new Date(2015, 6, 11, 15, 10, 50, 236)), 1000, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2015, 4, 11, 15, 10, 50, 236)), 601 /* 600 */, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2015, 8, 11, 15, 10, 50, 236)), 1402 /* 1400 */, 'BP on the max');// 5
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
    assert.equal(translator.translate(new Date(2015, 8, 11, 15, 10, 50, 236)), 998 /* 1000 */, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2015, 1, 11, 15, 10, 50, 236)), 598 /* 600 */, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2016, 2, 11, 15, 10, 50, 236)), 1400, 'BP on the max');// 5
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
    assert.equal(translator.translate(new Date(2012, 5, 11, 15, 10, 50, 236)), 1000, 'BP inside range');// 3
    assert.equal(translator.translate(new Date(2010, 5, 11, 15, 10, 50, 236)), 600, 'BP on the min');// 1
    assert.equal(translator.translate(new Date(2014, 5, 11, 15, 10, 50, 236)), 1400, 'BP on the max');// 5
});

QUnit.test('Translate. With direction', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 }); // 10, 15, 20, 25, 30

    assert.equal(translator.translate(24.6, -1), 900, 'BP inside range');
    assert.equal(translator.translate(24.6, 1), 1100, 'BP inside range');

    assert.equal(translator.translate(14, -1), 500, 'BP on the min');
    assert.equal(translator.translate(14, 1), 700, 'BP on the min');

    assert.equal(translator.translate(31.4, -1), 1300, 'BP on the max');
    assert.equal(translator.translate(31.4, 1), 1500, 'BP on the max');
});

QUnit.test('Translate with interval. With direction, Numeric, interval 5', function(assert) {
    var translator = this.createTranslator({ min: 5, max: 20 }); // 5, 10, 15, 20

    assert.equal(translator.translate(17.5, -1, 10), 750, 'BP inside range');
    assert.equal(translator.translate(17.5, 1, 10), 1250, 'BP inside range');

    assert.equal(translator.translate(3, -1, 10), 500, 'BP on the min');
    assert.equal(translator.translate(3, 1, 10), 750, 'BP on the min');

    assert.equal(translator.translate(29, -1, 10), 1250, 'BP on the max');
    assert.equal(translator.translate(29, 1, 10), 1500, 'BP on the max');
});

QUnit.test('from.', function(assert) {
    var translator = this.createTranslator({ min: 10, max: 30 }); // 10, 15, 20, 25, 30

    assert.equal(translator.from(300), 10, 'Coord less than min');
    assert.equal(translator.from(1800), 30, 'Coord more than min');
    assert.equal(translator.from(1000), 25, 'Coord inside range');
    assert.equal(translator.from(1000, -1), 25, 'Coord inside range. negative offset');
    assert.equal(translator.from(1000, 1), 20, 'Coord inside range. positive offset');

    assert.equal(translator.from(500, -1), 10, 'Coord on the min. negative offset');
    assert.equal(translator.from(500, 1), 10, 'Coord on the min. positive offset');

    assert.equal(translator.from(1500, -1), 30, 'Coord on the max. negative offset');
    assert.equal(translator.from(1500, 1), 30, 'Coord on the max. positive offset');

});

QUnit.test('from. DateTime', function(assert) {
    var translator = this.createTranslator({
        min: new Date(2013, 0, 1),
        max: new Date(2016, 0, 1),
        dataType: 'datetime'
    }, "year");

    assert.deepEqual(translator.from(300), new Date(2013, 0, 1), 'Coord less than min');
    assert.deepEqual(translator.from(1800), new Date(2016, 0, 1), 'Coord more than min');

    assert.deepEqual(translator.from(875), new Date(2015, 0, 1), 'Coord inside range');
    assert.deepEqual(translator.from(875, -1), new Date(2015, 0, 1), 'Coord inside range. negative offset');
    assert.deepEqual(translator.from(875, 1), new Date(2014, 0, 1), 'Coord inside range. positive offset');

    assert.deepEqual(translator.from(500, -1), new Date(2013, 0, 1), 'Coord on the min. negative offset');
    assert.deepEqual(translator.from(500, 1), new Date(2013, 0, 1), 'Coord on the min. positive offset');

    assert.deepEqual(translator.from(1500, -1), new Date(2016, 0, 1), 'Coord on the max. negative offset');
    assert.deepEqual(translator.from(1500, 1), new Date(2016, 0, 1), 'Coord on the max. positive offset');
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

QUnit.test("fix double errors issue", function(assert) {
    var translator = this.createTranslator({ min: 1.4, max: 1.6 });

    assert.strictEqual(translator.isValid(1.3, 0.1), false);
});

QUnit.module('Translate special cases', {
    beforeEach: function() {
        this.createTranslator = function(range, options) {
            return new translator2DModule.Translator2D(range,
                { width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 },
                $.extend({ isHorizontal: true, breaksSize: 0 }, options));
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

    checkTranslator(500, { min: 180, max: 180, axisType: 'continuous', dataType: 'numeric' }, { }, 'Invert = false. Position = horizontal. Start of the canvas is default');
    checkTranslator(1500, { min: new Date(10000), max: new Date(10000), invert: true, axisType: 'continuous', dataType: 'datetime' }, {}, 'Datetime. Invert = true. Position = horizontal. End of the canvas is default');

    checkTranslator(500, { min: 0, max: 0, axisType: 'continuous', dataType: 'numeric' }, { }, 'Invert = false. Position = horizontal. Start of the canvas is default');
    checkTranslator(1500, { min: 0, max: 0, axisType: 'continuous', dataType: 'numeric' }, { isHorizontal: false }, 'Invert = false. Position = vertical. End of the canvas is default');

    checkTranslator(1500, { min: -100, max: 0, axisType: 'continuous', dataType: 'numeric' }, { }, 'Invert = false. Position = horizontal. End of the canvas is default');
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

QUnit.test("canvas_position_start, canvas_position_end with paddings", function(assert) {
    var translator = this.createTranslator({ min: 100, max: 1000, axisType: 'continuous', dataType: 'numeric', invert: undefined }, { isHorizontal: false });
    translator.updateCanvas($.extend({ startPadding: 10, endPadding: 40 }, canvasTemplate));

    assert.strictEqual(translator.translateSpecialCase('canvas_position_start'), 340, 'Start position. Range is positive. Invert = true');
    assert.strictEqual(translator.translateSpecialCase('canvas_position_end'), 10, 'End position. Range is positive. Invert = true');
});

QUnit.test('All translators process special cases', function(assert) {
    var that = this;
    function checkTranslator(value, expected, message, range) {
        var original = translator2DModule.Translator2D.prototype.translateSpecialCase;
        translator2DModule.Translator2D.prototype.translateSpecialCase = function(value) { return parseInt(value + '500'); };

        try {
            var translator = that.createTranslator(range);
            assert.strictEqual(translator.translate(value), expected, message);
        } finally {
            translator2DModule.Translator2D.prototype.translateSpecialCase = original;
        }
    }

    checkTranslator('100', 100500, 'Numeric translator can process special case', { min: 100, max: 1000, axisType: 'continuous', dataType: 'numeric' });
    checkTranslator('100', 100500, 'Datetime translator can process special case', { min: new Date(1000), max: new Date(10000), axisType: 'continuous', dataType: 'datetime' });
    checkTranslator('100', 100500, 'Logarithmic translator can process special case', { min: 1, max: 1000, axisType: 'logarithmic', dataType: 'numeric' });
    checkTranslator('100', 100500, 'Discrete translator can process special case', { categories: ['a1', 'a2'], axisType: 'discrete', dataType: 'string' });
});

QUnit.module("Zooming and scrolling", environment);

QUnit.test('scroll', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: false }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

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

    assert.roughEqual(zoom.min.toFixed(2), (10 + 80 / 510 * 100), 0.1, "positive big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), (90 + 80 / 510 * 100), 0.1, "positive big scroll max");

    assert.equal(zoom.translate.toFixed(2), 100, "positive big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "positive big scroll scale");

    zoom = translator.zoom(-100, 1);
    assert.roughEqual(zoom.min.toFixed(2), (10 - 80 / 510 * 100), 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), (90 - 80 / 510 * 100), 0.1, "negative big scroll max");

    assert.equal(zoom.translate.toFixed(2), -100, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");
});

QUnit.test('scroll. Logarithmic axis', function(assert) {
    var range = $.extend({ minVisible: 100, maxVisible: 1000, invert: false }, logarithmicRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.ok(translator);

    assert.equal(translator._canvasOptions.rangeMin, 1);
    assert.equal(translator._canvasOptions.rangeMax, 4);
    assert.roughEqual(translator._canvasOptions.rangeMinVisible, 2, 1E-5);
    assert.roughEqual(translator._canvasOptions.rangeMaxVisible, 3, 1E-5);

    assert.equal(translator._canvasOptions.startPoint, 70);
    assert.equal(translator._canvasOptions.endPoint, 580);

    zoom = translator.zoom(10, 1);

    assert.equal(zoom.min.toFixed(2), translator.from(80).toFixed(2), "positive scroll min");
    assert.equal(zoom.max.toFixed(2), translator.from(590).toFixed(2), "positive scroll max");

    assert.equal(zoom.translate.toFixed(2), 10.00, "positive scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "positive scroll scale");

    zoom = translator.zoom(-10, 1);
    assert.equal(zoom.min.toFixed(2), translator.from(60).toFixed(2), "negative scroll min");
    assert.equal(zoom.max.toFixed(2), translator.from(570).toFixed(2), "negative scroll max");

    assert.equal(zoom.translate.toFixed(2), -10.00, "negative scroll translate");
    assert.equal(zoom.scale.toFixed(2), 1.00, "negative scroll scale");


    zoom = translator.zoom(600, 1);

    assert.roughEqual(zoom.min.toFixed(2), translator.from(670).toFixed(2), 0.1, "positive big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), translator.from(1180).toFixed(2), 0.1, "positive big scroll max");

    assert.equal(zoom.translate.toFixed(2), 600, "positive big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "positive big scroll scale");

    zoom = translator.zoom(-600, 1);
    assert.roughEqual(zoom.min.toFixed(2), translator.from(-530).toFixed(2), 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), translator.from(-20).toFixed(2), 0.1, 0.1, "negative big scroll max");

    assert.equal(zoom.translate.toFixed(2), -600, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");
});

QUnit.test('scroll. Canvas start point is zero', function(assert) {
    var range = $.extend({ invert: false }, numericRange),
        canvas = $.extend({}, canvasTemplate, { left: 0 }),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.ok(translator);

    assert.equal(translator._canvasOptions.rangeMin, 0);
    assert.equal(translator._canvasOptions.rangeMax, 100);
    assert.equal(translator._canvasOptions.rangeMinVisible, 0);
    assert.equal(translator._canvasOptions.rangeMaxVisible, 100);

    assert.equal(translator._canvasOptions.startPoint, 0);
    assert.equal(translator._canvasOptions.endPoint, 580);

    zoom = translator.zoom(-100, 1);
    assert.roughEqual(zoom.min.toFixed(2), 0 - 100 / 580 * 100, 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 100 - 100 / 580 * 100, 0.1, "negative big scroll max");

    assert.roughEqual(zoom.translate.toFixed(2), -100, 1, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");
});

QUnit.test('scroll inverted range', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: true }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

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

    assert.roughEqual(zoom.min.toFixed(2), 90 - 80 / 510 * 100, 0.1, "positive big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 10 - 80 / 510 * 100, 0.1, "positive big scroll max");

    assert.equal(zoom.translate.toFixed(2), 100, "positive big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "positive big scroll scale");

    zoom = translator.zoom(-100, 1);
    assert.roughEqual(zoom.min.toFixed(2), 90 + 80 / 510 * 100, 0.1, "negative big scroll min");
    assert.roughEqual(zoom.max.toFixed(2), 10 + 80 / 510 * 100, 0.1, "negative big scroll max");

    assert.equal(zoom.translate.toFixed(2), -100, "negative big scroll translate");
    assert.roughEqual(zoom.scale.toFixed(2), 1.00, 0.1, "negative big scroll scale");

});

QUnit.test('zoom single point range', function(assert) {
    var range = $.extend({}, numericRange, { min: 100, max: 100 }),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true });

    zoom = translator.zoom(48, 1.1);

    assert.deepEqual(zoom, {
        min: 100,
        max: 100,
        translate: 48,
        scale: 1.1
    }, "zoom point scroll");
});

QUnit.test('scroll null size visual range', function(assert) {
    var range = $.extend({}, numericRange, { minVisible: 50, maxVisible: 50 }),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true });

    zoom = translator.zoom(100, 1);

    assert.roughEqual(zoom.max, 50.196, 0.001, "scroll null size visual range");
    assert.roughEqual(zoom.min, 49.804, 0.001, "scroll null size visual range");
});

QUnit.test('scale without scroll', function(assert) {
    var range = $.extend({ minVisible: 10, maxVisible: 90, invert: false }, numericRange),
        canvas = $.extend({}, canvasTemplate),
        translator,
        zoom;

    translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

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
    assert.roughEqual(zoom.min.toFixed(2), 10 + 80 / 510 * 70, 0.1, "big zoom out min");
    assert.roughEqual(zoom.max.toFixed(2), 90 + 80 / 510 * 580, 0.1, "big zoom ot max");
    assert.equal(zoom.translate.toFixed(2), 0, "big zoom in translate");
    assert.equal(zoom.scale.toFixed(2), 0.5, " big zoom in scale");
});

QUnit.test("Scroll with whole range", function(assert) {
    const range = $.extend({ minVisible: 10, maxVisible: 110, invert: false }, numericRange);
    const canvas = { left: 0, right: 0, width: 100 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(-10, 1, { startValue: 5, endValue: 300 }), {
        min: 5,
        max: 105,
        scale: 1,
        translate: -5
    });

    assert.deepEqual(translator.zoom(10, 1, { startValue: 5, endValue: 115 }), {
        min: 15,
        max: 115,
        scale: 1,
        translate: 5
    });
});

// T702708
QUnit.test("Min/max correction by wholeRange", function(assert) {
    const range = $.extend({ minVisible: 10, maxVisible: 110, invert: false }, numericRange);
    const canvas = { left: 0, right: 0, width: 100 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(-9.6, 0.9, { startValue: 3.93, endValue: 5.5 }), {
        min: 3.93,
        max: 5.5,
        scale: 50,
        translate: -300
    });
});

// T702708
QUnit.test("Min/max correction by wholeRange. Inverted", function(assert) {
    const range = $.extend({ minVisible: 10, maxVisible: 110, invert: true }, numericRange);
    const canvas = { left: 0, right: 0, width: 100 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(-9.6, 0.9, { startValue: 3.93, endValue: 5.5 }), {
        max: 3.93,
        min: 5.5,
        scale: 100,
        translate: 10500
    });
});

QUnit.test("Scroll with whole range. inverted", function(assert) {
    const range = $.extend({ minVisible: 10, maxVisible: 110, invert: true }, numericRange);
    const canvas = { left: 0, right: 0, width: 100 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(10, 1, { startValue: 5, endValue: 300 }), {
        max: 5,
        min: 105,
        scale: 1,
        translate: 5
    });

    assert.deepEqual(translator.zoom(-10, 1, { startValue: 5, endValue: 115 }), {
        max: 15,
        min: 115,
        scale: 1,
        translate: -5
    });
});

QUnit.test("Scroll with whole range endless whole range with one side", function(assert) {
    const range = $.extend({ minVisible: 10, maxVisible: 110, invert: false }, numericRange);
    const canvas = { left: 0, right: 0, width: 100 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(-10, 1, { startValue: undefined, endValue: 300 }), {
        min: 0,
        max: 100,
        scale: 1,
        translate: -10
    });

    assert.deepEqual(translator.zoom(10, 1, { startValue: 5, endValue: undefined }), {
        min: 20,
        max: 120,
        scale: 1,
        translate: 10
    });
});

QUnit.test("Scroll with whole range endless whole range with one side. Inverted", function(assert) {
    const range = $.extend({ minVisible: 10, maxVisible: 110, invert: true }, numericRange);
    const canvas = { left: 0, right: 0, width: 100 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(10, 1, { startValue: undefined, endValue: 300 }), {
        max: 0,
        min: 100,
        scale: 1,
        translate: 10
    });

    assert.deepEqual(translator.zoom(-10, 1, { startValue: 5, endValue: undefined }), {
        max: 20,
        min: 120,
        scale: 1,
        translate: -10
    });
});

QUnit.test("Do not go out from wholeRange. number with big precision", function(assert) {
    const range = $.extend({ minVisible: 0.2152829, maxVisible: 9.96876, invert: false }, numericRange);
    const canvas = { left: 6, right: 26, width: 400, startPadding: 54, endPadding: 54 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(-2.745928338762212, 0.9739413680781759, { startValue: 10, endValue: 0 }), {
        max: 10,
        min: 0,
        scale: -0.9737828,
        translate: -372.58427
    });
});

QUnit.test("Do not go out from wholeRange. number with big precision. Inverted", function(assert) {
    const range = $.extend({ minVisible: 0.2152829, maxVisible: 9.96876, invert: true }, numericRange);
    const canvas = { left: 6, right: 26, width: 400, startPadding: 54, endPadding: 54 };

    const translator = new translator2DModule.Translator2D(range, canvas, { isHorizontal: true, breaksSize: 0 });

    assert.deepEqual(translator.zoom(-2.745928338762212, 0.9739413680781759, { startValue: 0, endValue: 10 }), {
        max: 0,
        min: 10,
        scale: 0.9739414,
        translate: -2.53746
    });
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

QUnit.test("Zoom. Min in the break after zoom", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    var zoomInfo = translator.zoom(700, 2);

    assert.equal(zoomInfo.min, 200);
    assert.equal(zoomInfo.max, 450);
});

QUnit.test("Zoom. Max in the break after zoom", function(assert) {
    var translator = createTranslatorWithScaleBreaks.call(this, {});

    var zoomInfo = translator.zoom(650, 2.3);
    assert.equal(zoomInfo.max, 350);
});

QUnit.module('Zooming and scrolling. Discrete translator', {
    beforeEach: function() {
        this.createTranslator = function(range, options, canvas) {
            return new translator2DModule.Translator2D($.extend({ categories: ['a1', 'a2', 'a3', 'a4', 'a5'], axisType: 'discrete', dataType: 'string', invert: false }, range),
                $.extend({ width: 2000, height: 2000, left: 500, top: 500, right: 500, bottom: 500 }, canvas),
                $.extend({ isHorizontal: true, stick: false }, options || {}));
        };
    },
    afterEach: function() {
        if(this.getCategoriesInfo !== undefined) {
            this.getCategoriesInfo.restore();
        }
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
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4' }, { stick: true }),
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
    var translator = this.createTranslator({ minVisible: 'a2', maxVisible: 'a5' }, { stick: true }),
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
    var translator = this.createTranslator({ minVisible: 'a1', maxVisible: 'a4' }, { stick: true }),
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

QUnit.test('get scale. stick=true', function(assert) {
    var translator = this.createTranslator(undefined, { stick: true });

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale("a1", "a5"), 1, "full range");
    assert.strictEqual(translator.getScale("a2", "a4"), 2, "some range");
    assert.strictEqual(translator.getScale("a2", "a2"), Infinity, "single point");
});

QUnit.test('get scale. stick=false', function(assert) {
    var translator = this.createTranslator(undefined, { stick: false });

    assert.strictEqual(translator.getScale(), 1, "without args");
    assert.strictEqual(translator.getScale("a1", "a5"), 1, "full range");
    assert.strictEqual(translator.getScale("a2", "a5"), 1.25, "some range");
    assert.strictEqual(translator.getScale("a2", "a2"), 5, "single point");
});

QUnit.test("get scale, canvas without margins", function(assert) {
    var translator = this.createTranslator(undefined, { stick: true }, { left: 0, right: 0 });

    assert.strictEqual(translator.getScale("a5", "a1"), 1);
});

QUnit.test("get scale, inverted", function(assert) {
    var translator = this.createTranslator({ invert: true }, { stick: true }, { left: 0 });

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

    assert.equal(translator.getMinBarSize(1500), 120);
    assert.equal(translator.getMinBarSize(2000), 160);
});

QUnit.test('Simple use (logarithmic translator)', function(assert) {
    var range = $.extend({}, logarithmicRange, { min: 1, max: 1000, minVisible: 1, maxVisible: 1000, invert: false }),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.equal(adjust(translator.getMinBarSize(110)), 10);
    assert.equal(adjust(translator.getMinBarSize(330)), 1000);
});

QUnit.test('Simple use (logarithmic translator, negative exponent)', function(assert) {
    var range = $.extend({}, logarithmicRange, { min: 0.01, max: 10, minVisible: 0.01, maxVisible: 10, invert: false }),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.equal(adjust(translator.getMinBarSize(110)), 0.1);
    assert.equal(adjust(translator.getMinBarSize(330)), 10);
});

QUnit.module("checkMinBarSize", environment);

QUnit.test('Simple use (logarithmic translator)', function(assert) {
    var range = $.extend({}, logarithmicRange, { min: 1, max: 1000, minVisible: 1, maxVisible: 1000, invert: false }),
        canvas = $.extend({}, canvasTemplate),
        translator;

    translator = this.createTranslator(range, canvas, { isHorizontal: false });

    assert.equal(adjust(translator.checkMinBarSize(5, 2, 5)), 5);
    assert.equal(adjust(translator.checkMinBarSize(5, 7, 5)), 7);
    assert.equal(adjust(translator.checkMinBarSize(5, 2, 8)), 5);
    assert.equal(adjust(translator.checkMinBarSize(5, 7, 12)), 42);
});

QUnit.module("Change translator type on the fly", environment);

QUnit.test("From discrete to continuous", function(assert) {
    var translator = this.createTranslator({ categories: [new Date(100000), new Date(200000), new Date(300000), new Date(400000), new Date(500000)], axisType: 'discrete', dataType: 'datetime' });

    assert.equal(translator.translate(new Date(200000)), 800);
    assert.equal(translator.translate(new Date(400000)), 1200);

    translator.updateBusinessRange({ axisType: 'continuous', dataType: 'numeric', min: 200, max: 700 });

    assert.equal(translator.translate(300), 700);
    assert.equal(translator.translate(200), 500);
});

