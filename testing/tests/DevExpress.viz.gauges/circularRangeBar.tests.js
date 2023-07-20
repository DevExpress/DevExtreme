/* global currentTest */

const vizMocks = require('../../helpers/vizMocks.js');
const circularIndicatorsModule = require('viz/gauges/circular_indicators');
const Translator1D = require('viz/translators/translator1d').Translator1D;

QUnit.module('CircularRangeBar', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 180, 0);
        this.rangeBar = new circularIndicatorsModule['rangebar']({ renderer: this.renderer, translator: translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
        };
        this.options = {
            size: 12,
            color: 'black',
            backgroundColor: 'white',
            containerBackgroundColor: 'grey',
            space: 3 * 80 * Math.PI / 180,
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

QUnit.test('measure', function(assert) {
    delete this.options.text.indent;
    assert.deepEqual(this.rangeBar.render(this.options).measure({ radius: 80 }), { min: 68, max: 80 });
});

QUnit.test('measure - with text', function(assert) {
    assert.deepEqual(this.rangeBar.render(this.options).measure({ radius: 80 }), { min: 68, max: 89, horizontalOffset: 40, verticalOffset: 16 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    this.options.size = String(this.options.size);
    this.options.text.indent = String(this.options.text.indent);
    assert.deepEqual(this.rangeBar.render(this.options).measure({ radius: 80 }), { min: 68, max: 89, horizontalOffset: 40, verticalOffset: 16 });
});

function checkBars(assert, angle1, angle2, spaceAngle, mainColor, backColor, spaceColor) {
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
    assert.deepEqual(this.rangeBar._backItem1._stored_settings, { 'class': 'dxg-back-bar', x: 200, y: 100, innerRadius: 68, outerRadius: 80, startAngle: angle1 + spaceAngle, endAngle: 180, fill: backColor, 'stroke-linejoin': 'round' }, '_backItem1 settings');
    assert.deepEqual(this.rangeBar._backItem2._stored_settings, { 'class': 'dxg-back-bar', x: 200, y: 100, innerRadius: 68, outerRadius: 80, startAngle: 0, endAngle: angle2 - spaceAngle, fill: backColor, 'stroke-linejoin': 'round' }, '_backItem2 settings');
    assert.deepEqual(this.rangeBar._spaceItem1._stored_settings, { 'class': 'dxg-space-bar', x: 200, y: 100, innerRadius: 68, outerRadius: 80, startAngle: angle1, endAngle: angle1 + spaceAngle, fill: spaceColor, 'stroke-linejoin': 'round' }, '_spaceItem1 settings');
    assert.deepEqual(this.rangeBar._spaceItem2._stored_settings, { 'class': 'dxg-space-bar', x: 200, y: 100, innerRadius: 68, outerRadius: 80, startAngle: angle2 - spaceAngle, endAngle: angle2, fill: spaceColor, 'stroke-linejoin': 'round' }, '_spaceItem2 settings');
    assert.deepEqual(this.rangeBar._mainItem._stored_settings, { 'class': 'dxg-main-bar', x: 200, y: 100, innerRadius: 68, outerRadius: 80, startAngle: angle2, endAngle: angle1, 'stroke-linejoin': 'round' }, '_mainItem settings');
}

QUnit.test('render', function(assert) {
    delete this.options.text.indent;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, 135, 90, 3);
});

QUnit.test('render - currentValue and baseValue are reversed', function(assert) {
    delete this.options.text.indent;
    this.options.currentValue = 75;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, 90, 45, 3);
});

QUnit.test('render - with text', function(assert) {
    render(this.rangeBar, this.options);

    checkBars.call(this, assert, 135, 90, 3);

    assert.ok(this.rangeBar._text, '_text');
    assert.strictEqual(this.rangeBar._text.parent, this.rangeBar._rootElement, '_text parent');

    assert.ok(this.rangeBar._line, '_line');
    assert.strictEqual(this.rangeBar._line.parent, this.rangeBar._rootElement, '_line parent');

    assert.deepEqual(this.rangeBar._text._stored_settings, {
        x: this.rangeBar._text._stored_settings.x,
        y: this.rangeBar._text._stored_settings.y,
        'class': 'dxg-text', align: 'center', text: '25.0'
    }, '_text settings');
    assert.deepEqual(this.rangeBar._text._stored_styles, {
        'font-family': 'Font', fill: 'black'
    }, '_text font styles');
    assert.roughEqual(this.rangeBar._text._stored_settings.x, 200 + (89 + 40 * 0.6) * Math.cos(Math.PI * 3 / 4), 1E-4, '_text x');
    assert.roughEqual(this.rangeBar._text._stored_settings.y, 100 - (89 + 16 * 0.6) * Math.sin(Math.PI * 3 / 4) + 2, 1E-4, '_text y');

    assert.deepEqual(this.rangeBar._line._stored_settings, {
        points: [200, 20, 200, 11, 202, 11, 202, 20], 'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.deepEqual(this.rangeBar._line.rotate.firstCall.args, [-45, 200, 100], '_line rotation');
    assert.equal(this.rangeBar._line.sharp.callCount, 1, '_line is sharped');
    assert.ok(this.rangeBar._line.sharp.lastCall.calledAfter(this.rangeBar._line.attr.lastCall), '_line is sharped');
});

QUnit.test('render - currentValue and baseValue are reversed, with text', function(assert) {
    this.options.currentValue = 75;
    render(this.rangeBar, this.options);

    assert.ok(this.rangeBar._text, '_text');
    assert.strictEqual(this.rangeBar._text.parent, this.rangeBar._rootElement, '_text parent');

    assert.ok(this.rangeBar._line, '_line');
    assert.strictEqual(this.rangeBar._line.parent, this.rangeBar._rootElement, '_line parent');


    assert.deepEqual(this.rangeBar._text._stored_settings, {
        x: this.rangeBar._text._stored_settings.x,
        y: this.rangeBar._text._stored_settings.y,
        'class': 'dxg-text', align: 'center', text: '75.0'
    }, '_text settings');
    assert.deepEqual(this.rangeBar._text._stored_styles, {
        'font-family': 'Font', fill: 'black'
    }, '_text font styles');
    assert.roughEqual(this.rangeBar._text._stored_settings.x, 200 + (89 + 40 * 0.6) * Math.cos(Math.PI * 1 / 4), 1E-4, '_text x');
    assert.roughEqual(this.rangeBar._text._stored_settings.y, 100 - (89 + 16 * 0.6) * Math.sin(Math.PI * 1 / 4) + 2, 1E-4, '_text y');

    assert.deepEqual(this.rangeBar._line._stored_settings, {
        points: [198, 20, 198, 11, 200, 11, 200, 20], 'class': 'dxg-main-bar',
        type: 'line',
        'stroke-linecap': 'square'
    }, '_line settings');
    assert.deepEqual(this.rangeBar._line.rotate.firstCall.args, [45, 200, 100], '_line rotation');
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
    checkBars.call(this, assert, 135, 90, 0, 'black', 'white', 'none');
});

QUnit.test('only positive space is valid - negative', function(assert) {
    this.options.space = -2;
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, 135, 90, 0, 'black', 'white', 'none');
});

QUnit.test('only positive space is valid - not a number', function(assert) {
    this.options.space = 'test';
    render(this.rangeBar, this.options);
    checkBars.call(this, assert, 135, 90, 0, 'black', 'white', 'none');
});

QUnit.test('text is visible when indent is positive - zero', function(assert) {
    this.options.text.indent = 0;
    render(this.rangeBar, this.options);
    assert.ok(!this.rangeBar._text, '_text');
    assert.ok(!this.rangeBar._line, '_line');
});

QUnit.test('text is visible when indent is positive - negative', function(assert) {
    this.options.text.indent = -1;
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
    checkBars.call(this, assert, 135, 90, 0, 'black', 'none', 'none');
});

QUnit.test('not valid size (not rendered)', function(assert) {
    this.options.size = -1;
    assert.ok(!this.rangeBar.render(this.options).enabled);
});

QUnit.test('not valid radius. min radius check', function(assert) {
    this.options.radius = 10;
    this.options.x = 10;
    this.options.y = 10;

    assert.ok(this.rangeBar.render(this.options).resize({ radius: 10 }).visible);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0].points, [10, -3,
        10, -12,
        12, -12,
        12, -3
    ]);
});

QUnit.test('getTooltipParameters', function(assert) {
    render(this.rangeBar, this.options);
    const parameters = this.rangeBar.getTooltipParameters();
    assert.strictEqual(parameters.color, 'black', 'color');
    assert.strictEqual(parameters.value, 25, 'value');
    assert.strictEqual(parameters.offset, 0, 'offset');
    assert.roughEqual(parameters.x, 171.68, 0.01, 'x');
    assert.roughEqual(parameters.y, 31.63, 0.01, 'y');
});
