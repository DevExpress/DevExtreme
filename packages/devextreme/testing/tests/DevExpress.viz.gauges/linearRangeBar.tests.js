/* global currentTest */

const vizMocks = require('../../helpers/vizMocks.js');
const linearIndicatorsModule = require('viz/gauges/linear_indicators');
const Translator1D = require('viz/translators/translator1d').Translator1D;

QUnit.module('LinearRangeBar', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        this.rangeBar = new linearIndicatorsModule['rangebar']({ renderer: this.renderer, translator: translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        this.options = {
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
        const baseCreateText = this.renderer.stub('text');
        this.renderer.text = sinon.spy(function() {
            const text = baseCreateText.apply(this, arguments);
            text.getBBox = sinon.spy(function() { return { x: -20, y: -10, width: 40, height: 16 }; });
            return text;
        });
    }
});

function render(rangeBar, options) {
    rangeBar.render(options).resize(currentTest().layout);
}

QUnit.test('measure - without text', function(assert) {
    delete this.options.text.indent;

    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 88, max: 100, indent: undefined }, 'horizontal, top');

    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 100, max: 112, indent: undefined }, 'horizontal, bottom');

    this.options.vertical = true;
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 188, max: 200, indent: undefined }, 'vertical, left');

    this.options.horizontalOrientation = 'right';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 200, max: 212, indent: undefined }, 'vertical, right');
});

QUnit.test('measure - with text, positive indent', function(assert) {
    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 88, max: 125, indent: 20 }, 'horizontal, top');

    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 100, max: 137, indent: 20 }, 'horizontal, bottom');

    this.options.vertical = true;
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 188, max: 249, indent: 8 }, 'vertical, left');

    this.options.horizontalOrientation = 'right';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 200, max: 261, indent: 8 }, 'vertical, right');
});

QUnit.test('measure - with text, negative indent', function(assert) {
    this.options.text.indent = -9;

    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 63, max: 100, indent: 20 }, 'horizontal, top');

    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 75, max: 112, indent: 20 }, 'horizontal, bottom');

    this.options.vertical = true;
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 139, max: 200, indent: 8 }, 'vertical, left');

    this.options.horizontalOrientation = 'right';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 151, max: 212, indent: 8 }, 'vertical, right');
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    this.options.size = String(this.options.size);
    this.options.text.indent = String(this.options.text.indent);
    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 88, max: 125, indent: 20 }, 'horizontal, top');

    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ y: 100 }), { min: 100, max: 137, indent: 20 }, 'horizontal, bottom');

    this.options.vertical = true;
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 188, max: 249, indent: 8 }, 'vertical, left');

    this.options.horizontalOrientation = 'right';
    assert.deepEqual(this.rangeBar.render(this.options).measure({ x: 200 }), { min: 200, max: 261, indent: 8 }, 'vertical, right');
});

function checkBars(assert, vertical, a1, a2, p1, p2, p3, p4, space, mainColor, backColor, spaceColor) {
    assert.strictEqual(this.rangeBar._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.rangeBar._owner, this.owner, '_owner');

    assert.ok(this.rangeBar._backItem1, '_backItem1');
    assert.ok(this.rangeBar._backItem2, '_backItem2');
    assert.ok(this.rangeBar._spaceItem1, '_spaceItem1');
    assert.ok(this.rangeBar._spaceItem2, '_spaceItem2');
    assert.ok(this.rangeBar._mainItem, '_mainItem');

    assert.strictEqual(this.rangeBar._backItem1.parent, this.rangeBar._rootElement, '_backItem1 parent');
    assert.strictEqual(this.rangeBar._backItem2.parent, this.rangeBar._rootElement, '_backItem2 parent');
    assert.strictEqual(this.rangeBar._spaceItem1.parent, this.rangeBar._rootElement, '_spaceItem1 parent');
    assert.strictEqual(this.rangeBar._spaceItem2.parent, this.rangeBar._rootElement, '_spaceItem2 parent');
    assert.strictEqual(this.rangeBar._mainItem.parent, this.rangeBar._rootElement, '_mainItem parent');

    mainColor = mainColor || this.options.color;
    backColor = backColor || this.options.backgroundColor;
    spaceColor = spaceColor || this.options.containerBackgroundColor;

    assert.deepEqual(this.rangeBar._rootElement._stored_settings, { 'class': 'root-class', fill: mainColor }, 'root group settings');
    assert.deepEqual(this.rangeBar._backItem1._stored_settings, {
        points: vertical ? [a1, p1, a1, p2 - space, a2, p2 - space, a2, p1] : [p1, a1, p1, a2, p2 - space, a2, p2 - space, a1],
        'class': 'dxg-back-bar', fill: backColor,
        type: 'area'
    }, '_backItem1 settings');
    assert.deepEqual(this.rangeBar._backItem2._stored_settings, {
        points: vertical ? [a1, p3 + space, a1, p4, a2, p4, a2, p3 + space] : [p3 + space, a1, p3 + space, a2, p4, a2, p4, a1],
        'class': 'dxg-back-bar', fill: backColor,
        type: 'area'
    }, '_backItem2 settings');
    assert.deepEqual(this.rangeBar._spaceItem1._stored_settings, {
        points: vertical ? [a1, p2 - space, a1, p2, a2, p2, a2, p2 - space] : [p2 - space, a1, p2 - space, a2, p2, a2, p2, a1],
        'class': 'dxg-space-bar', fill: spaceColor,
        type: 'area'
    }, '_spaceItem1 settings');
    assert.deepEqual(this.rangeBar._spaceItem2._stored_settings, {
        points: vertical ? [a1, p3, a1, p3 + space, a2, p3 + space, a2, p3] : [p3, a1, p3, a2, p3 + space, a2, p3 + space, a1],
        'class': 'dxg-space-bar', fill: spaceColor,
        type: 'area'
    }, '_spaceItem2 settings');
    assert.deepEqual(this.rangeBar._mainItem._stored_settings, {
        points: vertical ? [a1, p2, a1, p3, a2, p3, a2, p2] : [p2, a1, p2, a2, p3, a2, p3, a1],
        'class': 'dxg-main-bar',
        type: 'area'
    }, '_mainItem settings');
}

QUnit.test('render - horizontal, top', function(assert) {
    delete this.options.text.indent;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, false, 88, 100, 300, 325, 350, 400, 3);
});

QUnit.test('render - horizontal, bottom', function(assert) {
    delete this.options.text.indent;
    this.options.verticalOrientation = 'bottom';
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, false, 100, 112, 300, 325, 350, 400, 3);
});

QUnit.test('render - vertical, left', function(assert) {
    delete this.options.text.indent;
    this.options.vertical = true;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, true, 188, 200, 300, 325, 350, 400, 3);
});

QUnit.test('render - vertical, right', function(assert) {
    delete this.options.text.indent;
    this.options.horizontalOrientation = 'right';
    this.options.vertical = true;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, true, 200, 212, 300, 325, 350, 400, 3);
});

QUnit.test('render - currentValue and baseValue are reversed', function(assert) {
    delete this.options.text.indent;
    this.options.currentValue = 75;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, false, 88, 100, 300, 350, 375, 400, 3);
});

QUnit.test('render - horizontal, top, with text', function(assert) {
    render(this.rangeBar, this.options);

    checkBars.call(this, assert, false, 88, 100, 300, 325, 350, 400, 3);

    assert.ok(this.rangeBar._text, '_text');
    assert.strictEqual(this.rangeBar._text.parent, this.rangeBar._rootElement, '_text parent');

    assert.ok(this.rangeBar._line, '_line');
    assert.strictEqual(this.rangeBar._line.parent, this.rangeBar._rootElement, '_line parent');

    assert.deepEqual(this.rangeBar._text._stored_settings, { x: 325, y: 119, 'class': 'dxg-text', align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(this.rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(this.rangeBar._line._stored_settings, {
        points: [325, 100, 325, 109, 327, 109, 327, 100],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(this.rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(this.rangeBar._line.sharp.lastCall.calledAfter(this.rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - horizontal, bottom, with text', function(assert) {
    this.options.text.indent = -9;
    this.options.verticalOrientation = 'bottom';
    render(this.rangeBar, this.options);

    checkBars.call(this, assert, false, 100, 112, 300, 325, 350, 400, 3);

    assert.ok(this.rangeBar._text, '_text');
    assert.strictEqual(this.rangeBar._text.parent, this.rangeBar._rootElement, '_text parent');

    assert.ok(this.rangeBar._line, '_line');
    assert.strictEqual(this.rangeBar._line.parent, this.rangeBar._rootElement, '_line parent');

    assert.deepEqual(this.rangeBar._text._stored_settings, { x: 325, y: 85, 'class': 'dxg-text', align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(this.rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(this.rangeBar._line._stored_settings, {
        points: [325, 100, 325, 91, 327, 91, 327, 100],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(this.rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(this.rangeBar._line.sharp.lastCall.calledAfter(this.rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - vertical, left, with text', function(assert) {
    this.options.vertical = true;
    render(this.rangeBar, this.options);

    checkBars.call(this, assert, true, 188, 200, 300, 325, 350, 400, 3);

    assert.ok(this.rangeBar._text, '_text');
    assert.strictEqual(this.rangeBar._text.parent, this.rangeBar._rootElement, '_text parent');

    assert.ok(this.rangeBar._line, '_line');
    assert.strictEqual(this.rangeBar._line.parent, this.rangeBar._rootElement, '_line parent');

    assert.deepEqual(this.rangeBar._text._stored_settings, { x: 211, y: 327, 'class': 'dxg-text', align: 'left', text: '25.0' }, '_text settings');
    assert.deepEqual(this.rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(this.rangeBar._line._stored_settings, {
        points: [200, 325, 200, 327, 209, 327, 209, 325],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(this.rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(this.rangeBar._line.sharp.lastCall.calledAfter(this.rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - vertical, right, with text', function(assert) {
    this.options.text.indent = -9;
    this.options.vertical = true;
    this.options.horizontalOrientation = 'right';
    render(this.rangeBar, this.options);

    checkBars.call(this, assert, true, 200, 212, 300, 325, 350, 400, 3);

    assert.ok(this.rangeBar._text, '_text');
    assert.strictEqual(this.rangeBar._text.parent, this.rangeBar._rootElement, '_text parent');

    assert.ok(this.rangeBar._line, '_line');
    assert.strictEqual(this.rangeBar._line.parent, this.rangeBar._rootElement, '_line parent');

    assert.deepEqual(this.rangeBar._text._stored_settings, { x: 189, y: 327, 'class': 'dxg-text', align: 'right', text: '25.0' }, '_text settings');
    assert.deepEqual(this.rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(this.rangeBar._line._stored_settings, {
        points: [200, 325, 200, 327, 191, 327, 191, 325],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(this.rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(this.rangeBar._line.sharp.lastCall.calledAfter(this.rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - currentValue and baseValue are reversed, with text', function(assert) {
    this.options.currentValue = 75;
    render(this.rangeBar, this.options);

    checkBars.call(this, assert, false, 88, 100, 300, 350, 375, 400, 3);

    assert.ok(this.rangeBar._text, '_text');
    assert.strictEqual(this.rangeBar._text.parent, this.rangeBar._rootElement, '_text parent');

    assert.ok(this.rangeBar._line, '_line');
    assert.strictEqual(this.rangeBar._line.parent, this.rangeBar._rootElement, '_line parent');

    assert.deepEqual(this.rangeBar._text._stored_settings, { x: 375, y: 119, 'class': 'dxg-text', align: 'center', text: '75.0' }, '_text settings');
    assert.deepEqual(this.rangeBar._text._stored_styles, { 'font-family': 'Font', fill: 'black' }, '_text font style');

    assert.deepEqual(this.rangeBar._line._stored_settings, {
        points: [373, 100, 373, 109, 375, 109, 375, 100],
        'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.equal(this.rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(this.rangeBar._line.sharp.lastCall.calledAfter(this.rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('text color - taken from color', function(assert) {
    render(this.rangeBar, this.options);
    assert.strictEqual(this.rangeBar._text._stored_styles.fill, 'black');
});

QUnit.test('text color - taken from font', function(assert) {
    this.options.text.font.color = 'yellow';
    render(this.rangeBar, this.options);
    assert.strictEqual(this.rangeBar._text._stored_styles.fill, 'yellow');
});

QUnit.test('only positive space is valid - zero', function(assert) {
    this.options.space = 0;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'white', 'none');
});

QUnit.test('only positive space is valid - negative', function(assert) {
    this.options.space = -2;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'white', 'none');
});

QUnit.test('only positive space is valid - not a number', function(assert) {
    this.options.space = 'test';
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'white', 'none');
});

QUnit.test('text is visible when indent is not zero - zero', function(assert) {
    this.options.text.indent = 0;
    render(this.rangeBar, this.options);
    assert.ok(!this.rangeBar._text, '_text');
    assert.ok(!this.rangeBar._line, '_line');
});

QUnit.test('text is visible when indent is positive - not a number', function(assert) {
    this.options.text.indent = 'test';
    render(this.rangeBar, this.options);
    assert.ok(!this.rangeBar._text, '_text');
    assert.ok(!this.rangeBar._line, '_line');
});

QUnit.test('if no background then no space', function(assert) {
    this.options.backgroundColor = 'none';
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, false, 88, 100, 300, 325, 350, 400, 0, 'black', 'none', 'none');
});

QUnit.test('not valid size (not rendered)', function(assert) {
    this.options.size = -1;
    render(this.rangeBar, this.options);
    assert.ok(!this.rangeBar._rootElement.parent);
});

QUnit.test('getTooltipParameters', function(assert) {
    render(this.rangeBar, this.options);
    const parameters = this.rangeBar.getTooltipParameters();
    assert.strictEqual(parameters.color, 'black', 'color');
    assert.strictEqual(parameters.value, 25, 'value');
    assert.strictEqual(parameters.offset, 0, 'offset');
    assert.roughEqual(parameters.x, 337.5, 0.01, 'x');
    assert.roughEqual(parameters.y, 94, 0.01, 'y');
});
