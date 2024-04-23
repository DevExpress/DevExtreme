const vizMocks = require('../../helpers/vizMocks.js');
const linearIndicatorsModule = require('viz/gauges/linear_indicators');
const getTextCloudInfo = require('viz/gauges/base_indicators').getTextCloudInfo;
const Translator1D = require('viz/translators/translator1d').Translator1D;

QUnit.module('TriangleMarker', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        this.marker = new linearIndicatorsModule['trianglemarker']({ renderer: this.renderer,
            translator: translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        this.options = {
            length: 20,
            width: 8,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.marker.render({ length: 10, width: 4 }).measure({ y: 100 }), { min: 90, max: 100 }, 'horizontal, top');
    assert.deepEqual(this.marker.render({ length: 10, width: 4, verticalOrientation: 'bottom' }).measure({ y: 100 }), { min: 100, max: 110 }, 'horizontal, bottom');
    assert.deepEqual(this.marker.render({ length: 10, width: 4, vertical: true }).measure({ x: 200 }), { min: 190, max: 200 }, 'vertical, left');
    assert.deepEqual(this.marker.render({ length: 10, width: 4, vertical: true, horizontalOrientation: 'right' }).measure({ x: 200 }), { min: 200, max: 210 }, 'vertical, right');
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.marker.render({ length: '10', width: '4' }).measure({ y: 100 }), { min: 90, max: 100 }, 'horizontal, top');
    assert.deepEqual(this.marker.render({ length: '10', width: '4', verticalOrientation: 'bottom' }).measure({ y: 100 }), { min: 100, max: 110 }, 'horizontal, bottom');
    assert.deepEqual(this.marker.render({ length: '10', width: '4', vertical: true }).measure({ x: 200 }), { min: 190, max: 200 }, 'vertical, left');
    assert.deepEqual(this.marker.render({ length: '10', width: '4', vertical: true, horizontalOrientation: 'right' }).measure({ x: 200 }), { min: 200, max: 210 }, 'vertical, right');
});

QUnit.test('render - horizontal, top', function(assert) {
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._element, '_element');
    assert.strictEqual(this.marker._element.parent, this.marker._rootElement, '_element parent');
    assert.deepEqual(this.marker._element._stored_settings, { points: [300, 100, 296, 80, 304, 80], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');

    assert.ok(this.marker._trackerElement, '_trackerElement');
    assert.deepEqual(this.marker._trackerElement._stored_settings, { points: [290, 100, 290, 80, 310, 80, 310, 100], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.marker._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(this.marker._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - horizontal, bottom', function(assert) {
    this.options.verticalOrientation = 'bottom';
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._element, '_element');
    assert.strictEqual(this.marker._element.parent, this.marker._rootElement, '_element parent');
    assert.deepEqual(this.marker._element._stored_settings, { points: [300, 100, 296, 120, 304, 120], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');

    assert.ok(this.marker._trackerElement, '_trackerElement');
    assert.deepEqual(this.marker._trackerElement._stored_settings, { points: [290, 100, 290, 120, 310, 120, 310, 100], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.marker._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(this.marker._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical, left', function(assert) {
    this.options.vertical = true;
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._element, '_element');
    assert.strictEqual(this.marker._element.parent, this.marker._rootElement, '_element parent');
    assert.deepEqual(this.marker._element._stored_settings, { points: [200, 300, 180, 296, 180, 304], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');

    assert.ok(this.marker._trackerElement, '_trackerElement');
    assert.deepEqual(this.marker._trackerElement._stored_settings, { points: [200, 310, 180, 310, 180, 290, 200, 290], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.marker._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(this.marker._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('render - vertical, right', function(assert) {
    this.options.vertical = true;
    this.options.horizontalOrientation = 'right';
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._element, '_element');
    assert.strictEqual(this.marker._element.parent, this.marker._rootElement, '_element parent');
    assert.deepEqual(this.marker._element._stored_settings, { points: [200, 300, 220, 296, 220, 304], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');

    assert.ok(this.marker._trackerElement, '_trackerElement');
    assert.deepEqual(this.marker._trackerElement._stored_settings, { points: [200, 310, 220, 310, 220, 290, 200, 290], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.marker._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(this.marker._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('render - with background', function(assert) {
    this.options.space = 1;
    this.options.containerBackgroundColor = 'white';
    this.marker.render(this.options).resize(this.layout);

    assert.deepEqual(this.marker._element._stored_settings, { points: [300, 100, 296, 80, 304, 80], stroke: 'white', 'stroke-width': 1, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');
});

QUnit.test('render - background size is limited', function(assert) {
    this.options.space = 5;
    this.options.containerBackgroundColor = 'white';
    this.marker.render(this.options).resize(this.layout);

    assert.deepEqual(this.marker._element._stored_settings, { points: [300, 100, 296, 80, 304, 80], stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    this.options.length = 0;
    assert.ok(!this.marker.render(this.options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    this.options.width = -2;
    assert.ok(!this.marker.render(this.options).enabled);
});

QUnit.test('getTooltipParameters - horizontal, top', function(assert) {
    assert.deepEqual(this.marker.render(this.options).resize(this.layout).getTooltipParameters(), { x: 325, y: 90, offset: 10, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - horizontal, bottom', function(assert) {
    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(this.marker.render(this.options).resize(this.layout).getTooltipParameters(), { x: 325, y: 110, offset: 10, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical, left', function(assert) {
    this.options.vertical = true;
    assert.deepEqual(this.marker.render(this.options).resize(this.layout).getTooltipParameters(), { x: 190, y: 325, offset: 10, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical, right', function(assert) {
    this.options.vertical = true;
    this.options.horizontalOrientation = 'right';
    assert.deepEqual(this.marker.render(this.options).resize(this.layout).getTooltipParameters(), { x: 210, y: 325, offset: 10, color: 'black', value: 25 });
});

QUnit.module('TextCloudMarker', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        this.marker = new linearIndicatorsModule['textcloud']({ renderer: this.renderer, translator: translator, owner: this.owner, tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        this.options = {
            arrowLength: 3,
            horizontalOffset: 8,
            verticalOffset: 4,
            color: 'black',
            text: {
                format: {
                    type: 'fixedPoint',
                    precision: 1
                },
                font: { color: 'someColor', size: 'someSize' }
            },
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

//  B254470
QUnit.test('measure', function(assert) {
    this.options.arrowLength = String(this.options.arrowLength);
    this.options.horizontalOffset = String(this.options.horizontalOffset);
    this.options.verticalOffset = String(this.options.verticalOffset);

    assert.deepEqual(this.marker.render(this.options).measure({ y: 100 }), { min: 73, max: 100, indent: 0 }, 'horizontal, top');

    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(this.marker.render(this.options).measure({ y: 100 }), { min: 100, max: 127, indent: 0 }, 'horizontal, bottom');

    this.options.vertical = true;
    assert.deepEqual(this.marker.render(this.options).measure({ x: 200 }), { min: 141, max: 200, indent: 0 }, 'vertical, left');

    this.options.horizontalOrientation = 'right';
    assert.deepEqual(this.marker.render(this.options).measure({ x: 200 }), { min: 200, max: 259, indent: 0 }, 'vertical, right');
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.marker.render(this.options).measure({ y: 100 }), { min: 73, max: 100, indent: 0 }, 'horizontal, top');

    this.options.verticalOrientation = 'bottom';
    assert.deepEqual(this.marker.render(this.options).measure({ y: 100 }), { min: 100, max: 127, indent: 0 }, 'horizontal, bottom');

    this.options.vertical = true;
    assert.deepEqual(this.marker.render(this.options).measure({ x: 200 }), { min: 141, max: 200, indent: 0 }, 'vertical, left');

    this.options.horizontalOrientation = 'right';
    assert.deepEqual(this.marker.render(this.options).measure({ x: 200 }), { min: 200, max: 259, indent: 0 }, 'vertical, right');
});

QUnit.test('render - horizontal, top', function(assert) {
    const tc = getTextCloudInfo({
        x: 325,
        y: 100,
        tailLength: 3,
        type: 'left-bottom',
        cloudWidth: 56,
        cloudHeight: 24,
    });

    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');
    assert.ok(this.marker._cloud, '_cloud');
    assert.strictEqual(this.marker._cloud.parent, this.marker._rootElement, '_cloud parent');
    assert.deepEqual(this.marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(this.marker._text, '_text');
    assert.strictEqual(this.marker._text.parent, this.marker._rootElement, '_text parent');
    assert.deepEqual(this.marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(this.marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
});

QUnit.test('render - horizontal, bottom', function(assert) {
    const tc = getTextCloudInfo({
        x: 325,
        y: 100,
        cloudWidth: 56,
        cloudHeight: 24,
        tailLength: 3,
        type: 'left-top'
    });

    this.options.verticalOrientation = 'bottom';
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._cloud, '_cloud');
    assert.strictEqual(this.marker._cloud.parent, this.marker._rootElement, '_cloud parent');
    assert.deepEqual(this.marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(this.marker._text, '_text');
    assert.strictEqual(this.marker._text.parent, this.marker._rootElement, '_text parent');
    assert.deepEqual(this.marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(this.marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
});

QUnit.test('render - vertical, left', function(assert) {
    const tc = getTextCloudInfo({
        x: 200,
        y: 325,
        cloudWidth: 56,
        cloudHeight: 24,
        tailLength: 3,
        type: 'bottom-right'
    });

    this.options.vertical = true;
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._cloud, '_cloud');
    assert.strictEqual(this.marker._cloud.parent, this.marker._rootElement, '_cloud parent');
    assert.deepEqual(this.marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(this.marker._text, '_text');
    assert.strictEqual(this.marker._text.parent, this.marker._rootElement, '_text parent');
    assert.deepEqual(this.marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(this.marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
});

QUnit.test('render - vertical, right', function(assert) {
    const tc = getTextCloudInfo({
        x: 200,
        y: 325,
        cloudWidth: 56,
        cloudHeight: 24,
        tailLength: 3,
        type: 'bottom-left'
    });

    this.options.vertical = true;
    this.options.horizontalOrientation = 'right';
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._cloud, '_cloud');
    assert.strictEqual(this.marker._cloud.parent, this.marker._rootElement, '_cloud parent');
    assert.deepEqual(this.marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(this.marker._text, '_text');
    assert.strictEqual(this.marker._text.parent, this.marker._rootElement, '_text parent');
    assert.deepEqual(this.marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(this.marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
});

QUnit.test('_getTextCloudOptions - horizontal, top', function(assert) {
    this.marker._options = { y: 90 };
    this.marker._actualPosition = 100;
    this.marker._inverted = false;

    assert.deepEqual(this.marker._getTextCloudOptions(), { x: 100, y: 90, type: 'right-bottom' });
});

QUnit.test('_getTextCloudOptions - horizontal, bottom', function(assert) {
    this.marker._options = { y: 90 };
    this.marker._actualPosition = 100;
    this.marker._inverted = true;

    assert.deepEqual(this.marker._getTextCloudOptions(), { x: 100, y: 90, type: 'right-top' });
});

QUnit.test('_getTextCloudOptions - vertical, left', function(assert) {
    this.marker._options = { x: 90 };
    this.marker._actualPosition = 100;
    this.marker.vertical = true;
    this.marker._inverted = false;

    assert.deepEqual(this.marker._getTextCloudOptions(), { x: 90, y: 100, type: 'top-right' });
});

QUnit.test('_getTextCloudOptions - vertical, left. inverted', function(assert) {
    this.marker._options = { x: 90 };
    this.marker._actualPosition = 100;
    this.marker.vertical = true;
    this.marker._inverted = true;

    assert.deepEqual(this.marker._getTextCloudOptions(), { x: 90, y: 100, type: 'top-left' });
});
