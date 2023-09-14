const vizMocks = require('../../helpers/vizMocks.js');
const circularIndicatorsModule = require('viz/gauges/circular_indicators');
const Translator1D = require('viz/translators/translator1d').Translator1D;

QUnit.module('RectangleNeedle', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 180, 0);
        this.needle = new circularIndicatorsModule['rectangleneedle']({ renderer: this.renderer, translator: translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
        };
        this.options = {
            indentFromCenter: 9,
            width: 4,
            color: 'black',
            containerBackgroundColor: 'green',
            spindleSize: 12,
            spindleGapSize: 8,
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.needle.render({ indentFromCenter: 10 }).measure({ radius: 100 }), { max: 100 });
    assert.deepEqual(this.needle.render({ indentFromCenter: -10 }).measure({ radius: 100 }), { max: 100, inverseHorizontalOffset: 10, inverseVerticalOffset: 10 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.needle.render({ indentFromCenter: '10' }).measure({ radius: 100 }), { max: 100 });
    assert.deepEqual(this.needle.render({ indentFromCenter: '-10' }).measure({ radius: 100 }), { max: 100, inverseHorizontalOffset: 10, inverseVerticalOffset: 10 });
});

QUnit.test('render', function(assert) {
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { points: [198, 91, 198, 20, 202, 20, 202, 91], type: 'area' }, '_element settings');

    assert.ok(this.needle._spindleOuter, '_spindleOuter');
    assert.ok(this.needle._spindleInner, '_spindleInner');
    assert.strictEqual(this.needle._spindleOuter.parent, this.needle._rootElement, '_spindleOuter parent');
    assert.strictEqual(this.needle._spindleInner.parent, this.needle._rootElement, '_spindleInner parent');
    assert.deepEqual(this.needle._spindleOuter._stored_settings, { cx: 200, cy: 100, r: 6, 'class': 'dxg-spindle-border' }, '_spindleOuter settings');
    assert.deepEqual(this.needle._spindleInner._stored_settings, { cx: 200, cy: 100, r: 4, fill: 'green', 'class': 'dxg-spindle-hole' }, '_spindleInner settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [190, 20, 190, 91, 210, 91, 210, 20], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.needle._rootElement.rotate.firstCall.args, [-45, 200, 100], 'rotation');
    assert.deepEqual(this.needle._trackerElement.rotate.firstCall.args, [-45, 200, 100], 'trackerElement rotation');
});

QUnit.test('not valid width (not rendered)', function(assert) {
    this.options.width = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('not valid indentFromCenter (not rendered)', function(assert) {
    this.options.indentFromCenter = 90;
    assert.ok(!this.needle.render(this.options).resize(this.layout).visible);
});

QUnit.test('not valid radius (not rendered)', function(assert) {
    assert.ok(!this.needle.render(this.options).resize({ radius: -1 }).visible);
});

QUnit.test('getTooltipParameters', function(assert) {
    const x = 200 + Math.cos(Math.PI * 0.75) * 44.5;
    const y = 100 - Math.sin(Math.PI * 0.75) * 44.5;
    assert.deepEqual(this.needle.render(this.options).resize(this.layout).getTooltipParameters(), { x: x, y: y, offset: 2, color: 'black', value: 25 });
});

QUnit.test('render. when offset is defined', function(assert) {
    this.options.offset = 10;

    this.needle.render(this.options).resize(this.layout);

    assert.deepEqual(this.needle._element._stored_settings, { points: [198, 91, 198, 30, 202, 30, 202, 91], type: 'area' }, '_element settings');
});

QUnit.test('Dicrease offsets and spindle size if radius is less than beginAdaptingAtRadius', function(assert) {
    this.options.beginAdaptingAtRadius = 160;
    this.options.offset = 10;

    this.needle.render(this.options).resize(this.layout);

    assert.deepEqual(this.needle._element._stored_settings, { points: [198, 96, 198, 25, 202, 25, 202, 96], type: 'area' }, '_element settings');
    assert.deepEqual(this.needle._spindleOuter._stored_settings, { cx: 200, cy: 100, r: 3, 'class': 'dxg-spindle-border' }, '_spindleOuter settings');
    assert.deepEqual(this.needle._spindleInner._stored_settings, { cx: 200, cy: 100, r: 2, fill: 'green', 'class': 'dxg-spindle-hole' }, '_spindleInner settings');

    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [190, 25, 190, 96, 210, 96, 210, 25], type: 'area' }, '_tracker settings');
});

QUnit.test('Do not dicrease offsets and spindle size if radius is greater than beginAdaptingAtRadius', function(assert) {
    this.options.beginAdaptingAtRadius = 60;

    this.needle.render(this.options).resize(this.layout);

    assert.deepEqual(this.needle._element._stored_settings, { points: [198, 91, 198, 20, 202, 20, 202, 91], type: 'area' }, '_element settings');
    assert.deepEqual(this.needle._spindleOuter._stored_settings, { cx: 200, cy: 100, r: 6, 'class': 'dxg-spindle-border' }, '_spindleOuter settings');
    assert.deepEqual(this.needle._spindleInner._stored_settings, { cx: 200, cy: 100, r: 4, fill: 'green', 'class': 'dxg-spindle-hole' }, '_spindleInner settings');
});

QUnit.test('getTooltipParameters when dicresed offsets', function(assert) {
    const x = 200 + Math.cos(Math.PI * 0.75) * 42;
    const y = 100 - Math.sin(Math.PI * 0.75) * 42;
    this.options.beginAdaptingAtRadius = 160;

    assert.deepEqual(this.needle.render(this.options).resize(this.layout).getTooltipParameters(), { x: x, y: y, offset: 2, color: 'black', value: 25 });
});

QUnit.test('not valid (offsets too big)', function(assert) {
    this.options.offset = 40;
    this.options.indentFromCenter = 40;
    assert.ok(!this.needle.render(this.options).resize(this.layout).visible);
});

QUnit.test('valid (offsets is dicreased if beginAdaptingAtRadius is set)', function(assert) {
    this.options.offset = 40;
    this.options.indentFromCenter = 40;
    this.options.beginAdaptingAtRadius = 160;
    assert.ok(this.needle.render(this.options).resize(this.layout).visible);
});

QUnit.module('TriangleNeedle', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 180, 0);
        this.needle = new circularIndicatorsModule['triangleneedle']({ renderer: this.renderer, translator,
            owner: this.owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
        };
        this.options = {
            indentFromCenter: 9,
            width: 4,
            color: 'black',
            containerBackgroundColor: 'red',
            spindleSize: 10,
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.needle.render({ indentFromCenter: 10 }).measure({ radius: 100 }), { max: 100 });
    assert.deepEqual(this.needle.render({ indentFromCenter: -10 }).measure({ radius: 100 }), { max: 100, inverseHorizontalOffset: 10, inverseVerticalOffset: 10 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.needle.render({ indentFromCenter: '10' }).measure({ radius: 100 }), { max: 100 });
    assert.deepEqual(this.needle.render({ indentFromCenter: '-10' }).measure({ radius: 100 }), { max: 100, inverseHorizontalOffset: 10, inverseVerticalOffset: 10 });
});

QUnit.test('render', function(assert) {
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { points: [198, 91, 200, 20, 202, 91], type: 'area' }, '_element settings');

    assert.ok(this.needle._spindleOuter, '_spindleOuter');
    assert.ok(this.needle._spindleInner, '_spindleInner');
    assert.strictEqual(this.needle._spindleOuter.parent, this.needle._rootElement, '_spindleOuter parent');
    assert.strictEqual(this.needle._spindleInner.parent, this.needle._rootElement, '_spindleInner parent');
    assert.deepEqual(this.needle._spindleOuter._stored_settings, { cx: 200, cy: 100, r: 5, 'class': 'dxg-spindle-border' }, '_spindleOuter settings');
    assert.deepEqual(this.needle._spindleInner._stored_settings, { cx: 200, cy: 100, r: 0, fill: 'red', 'class': 'dxg-spindle-hole' }, '_spindleInner settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [190, 20, 190, 91, 210, 91, 210, 20], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.needle._rootElement.rotate.firstCall.args, [-45, 200, 100], 'rotation');
    assert.deepEqual(this.needle._trackerElement.rotate.firstCall.args, [-45, 200, 100], 'trackerElement rotation');
});

QUnit.test('not valid width (not rendered)', function(assert) {
    this.options.width = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('not valid indentFromCenter (not rendered)', function(assert) {
    this.options.indentFromCenter = 90;
    assert.ok(!this.needle.render(this.options).resize(this.layout).visible);
});

QUnit.test('not valid radius (not rendered)', function(assert) {
    assert.ok(!this.needle.render(this.options).resize({ radius: -1 }).visible);
});

QUnit.test('getTooltipParameters', function(assert) {
    const x = 200 + Math.cos(Math.PI * 0.75) * 44.5;
    const y = 100 - Math.sin(Math.PI * 0.75) * 44.5;
    assert.deepEqual(this.needle.render(this.options).resize(this.layout).getTooltipParameters(), { x: x, y: y, offset: 2, color: 'black', value: 25 });
});

QUnit.test('Dicrease offsets and spindle size if radius is less than beginAdaptingAtRadius', function(assert) {
    this.options.beginAdaptingAtRadius = 160;

    this.needle.render(this.options).resize(this.layout);

    assert.deepEqual(this.needle._element._stored_settings, { points: [198, 96, 200, 20, 202, 96], type: 'area' }, '_element settings');
});

QUnit.module('TwoColorRectangleNeedle', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 180, 0);
        this.needle = new circularIndicatorsModule['twocolorneedle']({ renderer: this.renderer,
            translator, owner: this.owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
        };
        this.options = {
            indentFromCenter: 9,
            width: 4,
            space: 3,
            secondFraction: 0.25,
            color: 'black',
            containerBackgroundColor: 'grey',
            secondColor: 'white',
            spindleSize: 8,
            spindleGapSize: 9,
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.needle.render({ indentFromCenter: 10 }).measure({ radius: 100 }), { max: 100 });
    assert.deepEqual(this.needle.render({ indentFromCenter: -10 }).measure({ radius: 100 }), { max: 100, inverseHorizontalOffset: 10, inverseVerticalOffset: 10 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.needle.render({ indentFromCenter: '10' }).measure({ radius: 100 }), { max: 100 });
    assert.deepEqual(this.needle.render({ indentFromCenter: '-10' }).measure({ radius: 100 }), { max: 100, inverseHorizontalOffset: 10, inverseVerticalOffset: 10 });
});

QUnit.test('render', function(assert) {
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._firstElement, '_firstElement');
    assert.strictEqual(this.needle._firstElement.parent, this.needle._rootElement, '_firstElement parent');
    assert.deepEqual(this.needle._firstElement._stored_settings, { points: [198, 91, 198, 40.75, 202, 40.75, 202, 91], type: 'area' }, '_firstElement settings');

    assert.ok(this.needle._spaceElement, '_spaceElement');
    assert.strictEqual(this.needle._spaceElement.parent, this.needle._rootElement, '_spaceElement parent');
    assert.deepEqual(this.needle._spaceElement._stored_settings, { points: [198, 40.75, 198, 37.75, 202, 37.75, 202, 40.75], fill: 'grey', 'class': 'dxg-hole', type: 'area' }, '_spaceElement settings');

    assert.ok(this.needle._secondElement, '_secondElement');
    assert.strictEqual(this.needle._secondElement.parent, this.needle._rootElement, '_secondElement parent');
    assert.deepEqual(this.needle._secondElement._stored_settings, { points: [198, 37.75, 198, 20, 202, 20, 202, 37.75], fill: 'white', 'class': 'dxg-part', type: 'area' }, '_secondElement settings');

    assert.ok(this.needle._spindleOuter, '_spindleOuter');
    assert.ok(this.needle._spindleInner, '_spindleInner');
    assert.strictEqual(this.needle._spindleOuter.parent, this.needle._rootElement, '_spindleOuter parent');
    assert.strictEqual(this.needle._spindleInner.parent, this.needle._rootElement, '_spindleInner parent');
    assert.deepEqual(this.needle._spindleOuter._stored_settings, { cx: 200, cy: 100, r: 4, 'class': 'dxg-spindle-border' }, '_spindleOuter settings');
    assert.deepEqual(this.needle._spindleInner._stored_settings, { cx: 200, cy: 100, r: 4, fill: 'grey', 'class': 'dxg-spindle-hole' }, '_spindleInner settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [190, 20, 190, 91, 210, 91, 210, 20], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.needle._rootElement.rotate.firstCall.args, [-45, 200, 100], 'rotation');
    assert.deepEqual(this.needle._trackerElement.rotate.firstCall.args, [-45, 200, 100], 'trackerElement rotation');
});

QUnit.test('not valid width (not rendered)', function(assert) {
    this.options.width = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('not valid indentFromCenter (not rendered)', function(assert) {
    this.options.indentFromCenter = 90;
    assert.ok(!this.needle.render(this.options).resize(this.layout).visible);
});

QUnit.test('not valid radius (not rendered)', function(assert) {
    this.options.radius = -1;
    assert.ok(!this.needle.render(this.options).resize({ radius: -1 }).visible);
});

// T209992
QUnit.test('marginal secondFraction', function(assert) {
    this.options.secondFraction = 0;
    this.needle.render(this.options).resize(this.layout);
    assert.deepEqual(this.needle._firstElement._stored_settings.points, [198, 91, 198, 20, 202, 20, 202, 91], '_firstElement points');
    assert.deepEqual(this.needle._secondElement._stored_settings.points, [198, 20, 198, 20, 202, 20, 202, 20], '_secondElement points');
});

//  B253863
QUnit.test('not valid secondFraction', function(assert) {
    this.options.secondFraction = 1.5;
    this.needle.render(this.options).resize(this.layout);
    assert.deepEqual(this.needle._firstElement._stored_settings.points, [198, 91, 198, 91, 202, 91, 202, 91], '_firstElement points');
    assert.deepEqual(this.needle._secondElement._stored_settings.points, [198, 91, 198, 20, 202, 20, 202, 91], '_secondElement points');
});

QUnit.test('getTooltipParameters', function(assert) {
    const x = 200 + Math.cos(Math.PI * 0.75) * 44.5;
    const y = 100 - Math.sin(Math.PI * 0.75) * 44.5;
    assert.deepEqual(this.needle.render(this.options).resize(this.layout).getTooltipParameters(), { x: x, y: y, offset: 2, color: 'black', value: 25 });
});

QUnit.test('Dicrease offsets and spindle size if radius is less than beginAdaptingAtRadius', function(assert) {
    this.options.beginAdaptingAtRadius = 160;

    this.needle.render(this.options).resize(this.layout);

    assert.deepEqual(this.needle._firstElement._stored_settings, { points: [198, 96, 198, 42, 202, 42, 202, 96], type: 'area' }, '_firstElement settings');
    assert.deepEqual(this.needle._secondElement._stored_settings, { points: [198, 39, 198, 20, 202, 20, 202, 39], fill: 'white', 'class': 'dxg-part', type: 'area' }, '_secondElement settings');
});
