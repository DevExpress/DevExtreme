/* global currentTest */

const vizMocks = require('../../helpers/vizMocks.js');
const linearIndicatorsModule = require('viz/gauges/linear_indicators');
const Translator1D = require('viz/translators/translator1d').Translator1D;

let rangeBar;
let renderer;
let owner;
let tracker;
let options;

QUnit.module('LinearRangeBar', {
    beforeEach: function() {
        renderer = new vizMocks.Renderer();
        owner = renderer.g();
        tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        rangeBar = new linearIndicatorsModule['rangebar']({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        options = {
            size: 12,
            color: 'black',
            backgroundColor: 'white',
            containerBackgroundColor: 'grey',
            space: 3,
            text: {
                indent: 9,
                format: {
                    type: 'fixedPoint',
                    precision: 1
                },
                font: {
                    family: 'Font'
                }
            },
            baseValue: 50,
            currentValue: 25
        };
        const baseCreateText = renderer.stub('text');
        renderer.text = sinon.spy(function() {
            const text = baseCreateText.apply(this, arguments);
            text.getBBox = sinon.spy(function() { return { x: -20, y: -10, width: 40, height: 16 }; });
            return text;
        });
    }
});

function render() {
    rangeBar.render(options).resize(currentTest().layout);
}

QUnit.test('measure - without text', function(assert) {
    delete options.text.indent;

    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 88, max: 100, indent: undefined }, 'horizontal, top');

    options.verticalOrientation = 'bottom';
    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 100, max: 112, indent: undefined }, 'horizontal, bottom');

    options.vertical = true;
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 188, max: 200, indent: undefined }, 'vertical, left');

    options.horizontalOrientation = 'right';
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 200, max: 212, indent: undefined }, 'vertical, right');
});

QUnit.test('measure - with text, positive indent', function(assert) {
    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 88, max: 125, indent: 20 }, 'horizontal, top');

    options.verticalOrientation = 'bottom';
    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 100, max: 137, indent: 20 }, 'horizontal, bottom');

    options.vertical = true;
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 188, max: 249, indent: 8 }, 'vertical, left');

    options.horizontalOrientation = 'right';
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 200, max: 261, indent: 8 }, 'vertical, right');
});

QUnit.test('measure - with text, negative indent', function(assert) {
    options.text.indent = -9;

    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 63, max: 100, indent: 20 }, 'horizontal, top');

    options.verticalOrientation = 'bottom';
    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 75, max: 112, indent: 20 }, 'horizontal, bottom');

    options.vertical = true;
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 139, max: 200, indent: 8 }, 'vertical, left');

    options.horizontalOrientation = 'right';
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 151, max: 212, indent: 8 }, 'vertical, right');
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    options.size = String(options.size);
    options.text.indent = String(options.text.indent);
    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 88, max: 125, indent: 20 }, 'horizontal, top');

    options.verticalOrientation = 'bottom';
    assert.deepEqual(rangeBar.render(options).measure({ y: 100 }), { min: 100, max: 137, indent: 20 }, 'horizontal, bottom');

    options.vertical = true;
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 188, max: 249, indent: 8 }, 'vertical, left');

    options.horizontalOrientation = 'right';
    assert.deepEqual(rangeBar.render(options).measure({ x: 200 }), { min: 200, max: 261, indent: 8 }, 'vertical, right');
});

function checkBars(assert, vertical, a1, a2, p1, p2, p3, p4, space, mainColor, backColor, spaceColor) {
    assert.strictEqual(rangeBar._renderer, renderer, '_renderer');
    assert.strictEqual(rangeBar._owner, owner, '_owner');

    assert.ok(rangeBar._backItem1, '_backItem1');
    assert.ok(rangeBar._backItem2, '_backItem2');
    assert.ok(rangeBar._spaceItem1, '_spaceItem1');
    assert.ok(rangeBar._spaceItem2, '_spaceItem2');
    assert.ok(rangeBar._mainItem, '_mainItem');

    assert.strictEqual(rangeBar._backItem1.parent, rangeBar._rootElement, '_backItem1 parent');
    assert.strictEqual(rangeBar._backItem2.parent, rangeBar._rootElement, '_backItem2 parent');
    assert.strictEqual(rangeBar._spaceItem1.parent, rangeBar._rootElement, '_spaceItem1 parent');
    assert.strictEqual(rangeBar._spaceItem2.parent, rangeBar._rootElement, '_spaceItem2 parent');
    assert.strictEqual(rangeBar._mainItem.parent, rangeBar._rootElement, '_mainItem parent');

    mainColor = mainColor || options.color;
    backColor = backColor || options.backgroundColor;
    spaceColor = spaceColor || options.containerBackgroundColor;

    assert.deepEqual(rangeBar._rootElement._stored_settings, { 'class': 'root-class', fill: mainColor }, 'root group settings');
    assert.deepEqual(rangeBar._backItem1._stored_settings, {
        points: vertical ? [a1, p1, a1, p2 - space, a2, p2 - space, a2, p1] : [p1, a1, p1, a2, p2 - space, a2, p2 - space, a1],
        'class': 'dxg-back-bar', fill: backColor,
        type: 'area'
    }, '_backItem1 settings');
    assert.deepEqual(rangeBar._backItem2._stored_settings, {
        points: vertical ? [a1, p3 + space, a1, p4, a2, p4, a2, p3 + space] : [p3 + space, a1, p3 + space, a2, p4, a2, p4, a1],
        'class': 'dxg-back-bar', fill: backColor,
        type: 'area'
    }, '_backItem2 settings');
    assert.deepEqual(rangeBar._spaceItem1._stored_settings, {
        points: vertical ? [a1, p2 - space, a1, p2, a2, p2, a2, p2 - space] : [p2 - space, a1, p2 - space, a2, p2, a2, p2, a1],
        'class': 'dxg-space-bar', fill: spaceColor,
        type: 'area'
    }, '_spaceItem1 settings');
    assert.deepEqual(rangeBar._spaceItem2._stored_settings, {
        points: vertical ? [a1, p3, a1, p3 + space, a2, p3 + space, a2, p3] : [p3, a1, p3, a2, p3 + space, a2, p3 + space, a1],
        'class': 'dxg-space-bar', fill: spaceColor,
        type: 'area'
    }, '_spaceItem2 settings');
    assert.deepEqual(rangeBar._mainItem._stored_settings, {
        points: vertical ? [a1, p2, a1, p3, a2, p3, a2, p2] : [p2, a1, p2, a2, p3, a2, p3, a1],
        'class': 'dxg-main-bar',
        type: 'area'
    }, '_mainItem settings');
}

QUnit.test('render - horizontal, top', function(assert) {
    delete options.text.indent;
    render();
    checkBars(assert, false, 88, 100, 300, 325, 350, 400, 3);
});

QUnit.test('render - horizontal, bottom', function(assert) {
    delete options.text.indent;
    options.verticalOrientation = 'bottom';
    render();
    checkBars(assert, false, 100, 112, 300, 325, 350, 400, 3);
});

QUnit.test('render - vertical, left', function(assert) {
    delete options.text.indent;
    options.vertical = true;
    render();
    checkBars(assert, true, 188, 200, 300, 325, 350, 400, 3);
});

QUnit.test('render - vertical, right', function(assert) {
    delete options.text.indent;
    options.horizontalOrientation = 'right';
    options.vertical = true;
    render();
    checkBars(assert, true, 200, 212, 300, 325, 350, 400, 3);
});

QUnit.test('render - currentValue and baseValue are reversed', function(assert) {
    delete options.text.indent;
    options.currentValue = 75;
    render();
    checkBars(assert, false, 88, 100, 300, 350, 375, 400, 3);
});

QUnit.test('render - horizontal, top, with text', function(assert) {
    render();

    checkBars(assert, false, 88, 100, 300, 325, 350, 400, 3);

    assert.ok(rangeBar._text, '_text');
    assert.strictEqual(rangeBar._text.parent, rangeBar._rootElement, '_text parent');

    assert.ok(rangeBar._line, '_line');
    assert.strictEqual(rangeBar._line.parent, rangeBar._rootElement, '_line parent');

    assert.deepEqual(rangeBar._text._stored_settings, { x: 325, y: 119, 'class': 'dxg-text', align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(rangeBar._line._stored_settings, {
        points: [325, 100, 325, 109, 327, 109, 327, 100],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(rangeBar._line.sharp.lastCall.calledAfter(rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - horizontal, bottom, with text', function(assert) {
    options.text.indent = -9;
    options.verticalOrientation = 'bottom';
    render();

    checkBars(assert, false, 100, 112, 300, 325, 350, 400, 3);

    assert.ok(rangeBar._text, '_text');
    assert.strictEqual(rangeBar._text.parent, rangeBar._rootElement, '_text parent');

    assert.ok(rangeBar._line, '_line');
    assert.strictEqual(rangeBar._line.parent, rangeBar._rootElement, '_line parent');

    assert.deepEqual(rangeBar._text._stored_settings, { x: 325, y: 85, 'class': 'dxg-text', align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(rangeBar._line._stored_settings, {
        points: [325, 100, 325, 91, 327, 91, 327, 100],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(rangeBar._line.sharp.lastCall.calledAfter(rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - vertical, left, with text', function(assert) {
    options.vertical = true;
    render();

    checkBars(assert, true, 188, 200, 300, 325, 350, 400, 3);

    assert.ok(rangeBar._text, '_text');
    assert.strictEqual(rangeBar._text.parent, rangeBar._rootElement, '_text parent');

    assert.ok(rangeBar._line, '_line');
    assert.strictEqual(rangeBar._line.parent, rangeBar._rootElement, '_line parent');

    assert.deepEqual(rangeBar._text._stored_settings, { x: 211, y: 327, 'class': 'dxg-text', align: 'left', text: '25.0' }, '_text settings');
    assert.deepEqual(rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(rangeBar._line._stored_settings, {
        points: [200, 325, 200, 327, 209, 327, 209, 325],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(rangeBar._line.sharp.lastCall.calledAfter(rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - vertical, right, with text', function(assert) {
    options.text.indent = -9;
    options.vertical = true;
    options.horizontalOrientation = 'right';
    render();

    checkBars(assert, true, 200, 212, 300, 325, 350, 400, 3);

    assert.ok(rangeBar._text, '_text');
    assert.strictEqual(rangeBar._text.parent, rangeBar._rootElement, '_text parent');

    assert.ok(rangeBar._line, '_line');
    assert.strictEqual(rangeBar._line.parent, rangeBar._rootElement, '_line parent');

    assert.deepEqual(rangeBar._text._stored_settings, { x: 189, y: 327, 'class': 'dxg-text', align: 'right', text: '25.0' }, '_text settings');
    assert.deepEqual(rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(rangeBar._line._stored_settings, {
        points: [200, 325, 200, 327, 191, 327, 191, 325],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(rangeBar._line.sharp.lastCall.calledAfter(rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - currentValue and baseValue are reversed, with text', function(assert) {
    options.currentValue = 75;
    render();

    checkBars(assert, false, 88, 100, 300, 350, 375, 400, 3);

    assert.ok(rangeBar._text, '_text');
    assert.strictEqual(rangeBar._text.parent, rangeBar._rootElement, '_text parent');

    assert.ok(rangeBar._line, '_line');
    assert.strictEqual(rangeBar._line.parent, rangeBar._rootElement, '_line parent');

    assert.deepEqual(rangeBar._text._stored_settings, { x: 375, y: 119, 'class': 'dxg-text', align: 'center', text: '75.0' }, '_text settings');
    assert.deepEqual(rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(rangeBar._line._stored_settings, {
        points: [373, 100, 373, 109, 375, 109, 375, 100],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(rangeBar._line.sharp.lastCall.calledAfter(rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('text color - taken from color', function(assert) {
    render();
    assert.strictEqual(rangeBar._text._stored_styles.fill, 'black');
});

QUnit.test('text color - taken from font', function(assert) {
    options.text.font.color = 'yellow';
    render();
    assert.strictEqual(rangeBar._text._stored_styles.fill, 'yellow');
});

QUnit.test('only positive space is valid - zero', function(assert) {
    options.space = 0;
    render();
    checkBars(assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'white', 'none');
});

QUnit.test('only positive space is valid - negative', function(assert) {
    options.space = -2;
    render();
    checkBars(assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'white', 'none');
});

QUnit.test('only positive space is valid - not a number', function(assert) {
    options.space = 'test';
    render();
    checkBars(assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'white', 'none');
});

QUnit.test('text is visible when indent is not zero - zero', function(assert) {
    options.text.indent = 0;
    render();
    assert.ok(!rangeBar._text, '_text');
    assert.ok(!rangeBar._line, '_line');
});

QUnit.test('text is visible when indent is positive - not a number', function(assert) {
    options.text.indent = 'test';
    render();
    assert.ok(!rangeBar._text, '_text');
    assert.ok(!rangeBar._line, '_line');
});

QUnit.test('if no background then no space', function(assert) {
    options.backgroundColor = 'none';
    render();
    checkBars(assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'none', 'none');
});

QUnit.test('not valid size (not rendered)', function(assert) {
    options.size = -1;
    render();
    assert.ok(!rangeBar._rootElement.parent);
});

QUnit.test('getTooltipParameters', function(assert) {
    render();
    const parameters = rangeBar.getTooltipParameters();
    assert.strictEqual(parameters.color, 'black', 'color');
    assert.strictEqual(parameters.value, 25, 'value');
    assert.strictEqual(parameters.offset, 0, 'offset');
    assert.roughEqual(parameters.x, 337.5, 0.01, 'x');
    assert.roughEqual(parameters.y, 94, 0.01, 'y');
});
