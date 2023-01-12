const vizMocks = require('../../helpers/vizMocks.js');
const linearIndicatorsModule = require('viz/gauges/linear_indicators');
const Translator1D = require('viz/translators/translator1d').Translator1D;

QUnit.module('RectangleNeedle', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        this.needle = new linearIndicatorsModule.rectangle({ renderer: this.renderer, translator: translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        this.options = {
            length: 80,
            width: 4,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.needle.render({ length: 20 }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(this.needle.render({ length: 30, vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.needle.render({ length: '20' }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(this.needle.render({ length: '30', vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

QUnit.test('render - horizontal', function(assert) {
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { points: [298, 140, 298, 60, 302, 60, 302, 140], type: 'area' }, '_element settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [290, 140, 290, 60, 310, 60, 310, 140], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(this.needle._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(this.needle._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical', function(assert) {
    this.options.vertical = true;
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { points: [160, 302, 160, 298, 240, 298, 240, 302], type: 'area' }, '_element settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [160, 310, 160, 290, 240, 290, 240, 310], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(this.needle._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(this.needle._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    this.options.length = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    this.options.width = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('getTooltipParameters - horizontal', function(assert) {
    assert.deepEqual(this.needle.render(this.options).resize(this.layout).getTooltipParameters(), { x: 325, y: 100, offset: 2, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical', function(assert) {
    this.needle.render(this.options).vertical = true;
    assert.deepEqual(this.needle.resize(this.layout).getTooltipParameters(), { x: 200, y: 325, offset: 2, color: 'black', value: 25 });
});

QUnit.module('RhombusNeedle', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        this.needle = new linearIndicatorsModule.rhombus({ renderer: this.renderer, translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        this.options = {
            length: 80,
            width: 4,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.needle.render({ length: 20 }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(this.needle.render({ length: 30, vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

//  B254470
QUnit.test('measure (string-line numbers)', function(assert) {
    assert.deepEqual(this.needle.render({ length: '20' }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(this.needle.render({ length: '30', vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

QUnit.test('render - horizontal', function(assert) {
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { points: [298, 100, 300, 60, 302, 100, 300, 140], type: 'area' }, '_element settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [290, 140, 290, 60, 310, 60, 310, 140], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(this.needle._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(this.needle._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical', function(assert) {
    this.options.vertical = true;
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { points: [160, 300, 200, 298, 240, 300, 200, 302], type: 'area' }, '_element settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [160, 310, 160, 290, 240, 290, 240, 310], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(this.needle._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(this.needle._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    this.options.length = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    this.options.width = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('getTooltipParameters - horizontal', function(assert) {
    assert.deepEqual(this.needle.render(this.options).resize(this.layout).getTooltipParameters(), { x: 325, y: 100, offset: 2, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical', function(assert) {
    this.needle.render(this.options).vertical = true;
    assert.deepEqual(this.needle.resize(this.layout).getTooltipParameters(), { x: 200, y: 325, offset: 2, color: 'black', value: 25 });
});

QUnit.module('CircleNeedle', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        this.needle = new linearIndicatorsModule.circle({ renderer: this.renderer, translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        this.options = {
            length: 80,
            width: 4,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.needle.render({ length: 20 }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(this.needle.render({ length: 30, vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.needle.render({ length: '20' }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(this.needle.render({ length: '30', vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

QUnit.test('render - horizontal', function(assert) {
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { cx: 300, cy: 100, r: 40 }, '_element settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [290, 140, 290, 60, 310, 60, 310, 140], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(this.needle._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(this.needle._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical', function(assert) {
    this.options.vertical = true;
    this.needle.render(this.options).resize(this.layout);

    assert.strictEqual(this.needle._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.needle._owner, this.owner, '_owner');

    assert.ok(this.needle._rootElement, '_rootElement');
    assert.deepEqual(this.needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.needle._element, '_element');
    assert.strictEqual(this.needle._element.parent, this.needle._rootElement, '_element parent');
    assert.deepEqual(this.needle._element._stored_settings, { cx: 200, cy: 300, r: 40 }, '_element settings');

    assert.ok(this.needle._trackerElement, '_trackerElement');
    assert.deepEqual(this.needle._trackerElement._stored_settings, { points: [160, 310, 160, 290, 240, 290, 240, 310], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(this.needle._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(this.needle._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    this.options.length = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    this.options.width = -1;
    assert.ok(!this.needle.render(this.options).enabled);
});

QUnit.test('getTooltipParameters - horizontal', function(assert) {
    assert.deepEqual(this.needle.render(this.options).resize(this.layout).getTooltipParameters(), { x: 325, y: 100, offset: 2, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical', function(assert) {
    this.needle.render(this.options).vertical = true;
    assert.deepEqual(this.needle.resize(this.layout).getTooltipParameters(), { x: 200, y: 325, offset: 2, color: 'black', value: 25 });
});
