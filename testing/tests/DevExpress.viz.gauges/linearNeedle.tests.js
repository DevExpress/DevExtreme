var vizMocks = require('../../helpers/vizMocks.js'),
    linearIndicatorsModule = require('viz/gauges/linear_indicators'),
    Translator1D = require('viz/translators/translator1d').Translator1D;

var needle,
    renderer,
    owner,
    tracker,
    translator,
    options;

QUnit.module('RectangleNeedle', {
    beforeEach: function() {
        renderer = new vizMocks.Renderer();
        owner = renderer.g();
        tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        var translator = new Translator1D(0, 100, 300, 400);
        needle = new linearIndicatorsModule.rectangle({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        options = {
            length: 80,
            width: 4,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(needle.render({ length: 20 }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(needle.render({ length: 30, vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(needle.render({ length: '20' }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(needle.render({ length: '30', vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

QUnit.test('render - horizontal', function(assert) {
    needle.render(options).resize(this.layout);

    assert.strictEqual(needle._renderer, renderer, '_renderer');
    assert.strictEqual(needle._owner, owner, '_owner');

    assert.ok(needle._rootElement, '_rootElement');
    assert.deepEqual(needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(needle._element, '_element');
    assert.strictEqual(needle._element.parent, needle._rootElement, '_element parent');
    assert.deepEqual(needle._element._stored_settings, { points: [298, 140, 298, 60, 302, 60, 302, 140], type: 'area' }, '_element settings');

    assert.ok(needle._trackerElement, '_trackerElement');
    assert.deepEqual(needle._trackerElement._stored_settings, { points: [290, 140, 290, 60, 310, 60, 310, 140], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(needle._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(needle._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical', function(assert) {
    options.vertical = true;
    needle.render(options).resize(this.layout);

    assert.strictEqual(needle._renderer, renderer, '_renderer');
    assert.strictEqual(needle._owner, owner, '_owner');

    assert.ok(needle._rootElement, '_rootElement');
    assert.deepEqual(needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(needle._element, '_element');
    assert.strictEqual(needle._element.parent, needle._rootElement, '_element parent');
    assert.deepEqual(needle._element._stored_settings, { points: [160, 302, 160, 298, 240, 298, 240, 302], type: 'area' }, '_element settings');

    assert.ok(needle._trackerElement, '_trackerElement');
    assert.deepEqual(needle._trackerElement._stored_settings, { points: [160, 310, 160, 290, 240, 290, 240, 310], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(needle._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(needle._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    options.length = -1;
    assert.ok(!needle.render(options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    options.width = -1;
    assert.ok(!needle.render(options).enabled);
});

QUnit.test('getTooltipParameters - horizontal', function(assert) {
    assert.deepEqual(needle.render(options).resize(this.layout).getTooltipParameters(), { x: 325, y: 100, offset: 2, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical', function(assert) {
    needle.render(options).vertical = true;
    assert.deepEqual(needle.resize(this.layout).getTooltipParameters(), { x: 200, y: 325, offset: 2, color: 'black', value: 25 });
});

QUnit.module('RhombusNeedle', {
    beforeEach: function() {
        renderer = new vizMocks.Renderer();
        owner = renderer.g();
        tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        translator = new Translator1D(0, 100, 300, 400);
        needle = new linearIndicatorsModule.rhombus({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        options = {
            length: 80,
            width: 4,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(needle.render({ length: 20 }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(needle.render({ length: 30, vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

//  B254470
QUnit.test('measure (string-line numbers)', function(assert) {
    assert.deepEqual(needle.render({ length: '20' }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(needle.render({ length: '30', vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

QUnit.test('render - horizontal', function(assert) {
    needle.render(options).resize(this.layout);

    assert.strictEqual(needle._renderer, renderer, '_renderer');
    assert.strictEqual(needle._owner, owner, '_owner');

    assert.ok(needle._rootElement, '_rootElement');
    assert.deepEqual(needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(needle._element, '_element');
    assert.strictEqual(needle._element.parent, needle._rootElement, '_element parent');
    assert.deepEqual(needle._element._stored_settings, { points: [298, 100, 300, 60, 302, 100, 300, 140], type: 'area' }, '_element settings');

    assert.ok(needle._trackerElement, '_trackerElement');
    assert.deepEqual(needle._trackerElement._stored_settings, { points: [290, 140, 290, 60, 310, 60, 310, 140], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(needle._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(needle._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical', function(assert) {
    options.vertical = true;
    needle.render(options).resize(this.layout);

    assert.strictEqual(needle._renderer, renderer, '_renderer');
    assert.strictEqual(needle._owner, owner, '_owner');

    assert.ok(needle._rootElement, '_rootElement');
    assert.deepEqual(needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(needle._element, '_element');
    assert.strictEqual(needle._element.parent, needle._rootElement, '_element parent');
    assert.deepEqual(needle._element._stored_settings, { points: [160, 300, 200, 298, 240, 300, 200, 302], type: 'area' }, '_element settings');

    assert.ok(needle._trackerElement, '_trackerElement');
    assert.deepEqual(needle._trackerElement._stored_settings, { points: [160, 310, 160, 290, 240, 290, 240, 310], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(needle._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(needle._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    options.length = -1;
    assert.ok(!needle.render(options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    options.width = -1;
    assert.ok(!needle.render(options).enabled);
});

QUnit.test('getTooltipParameters - horizontal', function(assert) {
    assert.deepEqual(needle.render(options).resize(this.layout).getTooltipParameters(), { x: 325, y: 100, offset: 2, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical', function(assert) {
    needle.render(options).vertical = true;
    assert.deepEqual(needle.resize(this.layout).getTooltipParameters(), { x: 200, y: 325, offset: 2, color: 'black', value: 25 });
});

QUnit.module('CircleNeedle', {
    beforeEach: function() {
        renderer = new vizMocks.Renderer();
        owner = renderer.g();
        tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        translator = new Translator1D(0, 100, 300, 400);
        needle = new linearIndicatorsModule.circle({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        options = {
            length: 80,
            width: 4,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(needle.render({ length: 20 }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(needle.render({ length: 30, vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(needle.render({ length: '20' }).measure({ y: 100 }), { min: 90, max: 110 });
    assert.deepEqual(needle.render({ length: '30', vertical: true }).measure({ x: 200 }), { min: 185, max: 215 });
});

QUnit.test('render - horizontal', function(assert) {
    needle.render(options).resize(this.layout);

    assert.strictEqual(needle._renderer, renderer, '_renderer');
    assert.strictEqual(needle._owner, owner, '_owner');

    assert.ok(needle._rootElement, '_rootElement');
    assert.deepEqual(needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(needle._element, '_element');
    assert.strictEqual(needle._element.parent, needle._rootElement, '_element parent');
    assert.deepEqual(needle._element._stored_settings, { cx: 300, cy: 100, r: 40 }, '_element settings');

    assert.ok(needle._trackerElement, '_trackerElement');
    assert.deepEqual(needle._trackerElement._stored_settings, { points: [290, 140, 290, 60, 310, 60, 310, 140], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(needle._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(needle._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical', function(assert) {
    options.vertical = true;
    needle.render(options).resize(this.layout);

    assert.strictEqual(needle._renderer, renderer, '_renderer');
    assert.strictEqual(needle._owner, owner, '_owner');

    assert.ok(needle._rootElement, '_rootElement');
    assert.deepEqual(needle._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(needle._element, '_element');
    assert.strictEqual(needle._element.parent, needle._rootElement, '_element parent');
    assert.deepEqual(needle._element._stored_settings, { cx: 200, cy: 300, r: 40 }, '_element settings');

    assert.ok(needle._trackerElement, '_trackerElement');
    assert.deepEqual(needle._trackerElement._stored_settings, { points: [160, 310, 160, 290, 240, 290, 240, 310], type: 'area' }, '_trackerElement settings');

    assert.deepEqual(needle._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(needle._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    options.length = -1;
    assert.ok(!needle.render(options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    options.width = -1;
    assert.ok(!needle.render(options).enabled);
});

QUnit.test('getTooltipParameters - horizontal', function(assert) {
    assert.deepEqual(needle.render(options).resize(this.layout).getTooltipParameters(), { x: 325, y: 100, offset: 2, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical', function(assert) {
    needle.render(options).vertical = true;
    assert.deepEqual(needle.resize(this.layout).getTooltipParameters(), { x: 200, y: 325, offset: 2, color: 'black', value: 25 });
});
