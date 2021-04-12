const vizMocks = require('../../helpers/vizMocks.js');
const linearIndicatorsModule = require('viz/gauges/linear_indicators');
const getTextCloudInfo = require('viz/gauges/base_indicators').getTextCloudInfo;
const Translator1D = require('viz/translators/translator1d').Translator1D;

let marker;
let renderer;
let owner;
let tracker;
let options;

QUnit.module('TriangleMarker', {
    beforeEach: function() {
        renderer = new vizMocks.Renderer();
        owner = renderer.g();
        tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        marker = new linearIndicatorsModule['trianglemarker']({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        options = {
            length: 20,
            width: 8,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(marker.render({ length: 10, width: 4 }).measure({ y: 100 }), { min: 90, max: 100, indent: 2 }, 'horizontal, top');
    assert.deepEqual(marker.render({ length: 10, width: 4, verticalOrientation: 'bottom' }).measure({ y: 100 }), { min: 100, max: 110, indent: 2 }, 'horizontal, bottom');
    assert.deepEqual(marker.render({ length: 10, width: 4, vertical: true }).measure({ x: 200 }), { min: 190, max: 200, indent: 2 }, 'vertical, left');
    assert.deepEqual(marker.render({ length: 10, width: 4, vertical: true, horizontalOrientation: 'right' }).measure({ x: 200 }), { min: 200, max: 210, indent: 2 }, 'vertical, right');
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(marker.render({ length: '10', width: '4' }).measure({ y: 100 }), { min: 90, max: 100, indent: 2 }, 'horizontal, top');
    assert.deepEqual(marker.render({ length: '10', width: '4', verticalOrientation: 'bottom' }).measure({ y: 100 }), { min: 100, max: 110, indent: 2 }, 'horizontal, bottom');
    assert.deepEqual(marker.render({ length: '10', width: '4', vertical: true }).measure({ x: 200 }), { min: 190, max: 200, indent: 2 }, 'vertical, left');
    assert.deepEqual(marker.render({ length: '10', width: '4', vertical: true, horizontalOrientation: 'right' }).measure({ x: 200 }), { min: 200, max: 210, indent: 2 }, 'vertical, right');
});

QUnit.test('render - horizontal, top', function(assert) {
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._element, '_element');
    assert.strictEqual(marker._element.parent, marker._rootElement, '_element parent');
    assert.deepEqual(marker._element._stored_settings, { points: [300, 100, 296, 80, 304, 80], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');

    assert.ok(marker._trackerElement, '_trackerElement');
    assert.deepEqual(marker._trackerElement._stored_settings, { points: [290, 100, 290, 80, 310, 80, 310, 100], type: 'area' }, '_tracker settings');

    assert.deepEqual(marker._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(marker._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - horizontal, bottom', function(assert) {
    options.verticalOrientation = 'bottom';
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._element, '_element');
    assert.strictEqual(marker._element.parent, marker._rootElement, '_element parent');
    assert.deepEqual(marker._element._stored_settings, { points: [300, 100, 296, 120, 304, 120], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');

    assert.ok(marker._trackerElement, '_trackerElement');
    assert.deepEqual(marker._trackerElement._stored_settings, { points: [290, 100, 290, 120, 310, 120, 310, 100], type: 'area' }, '_tracker settings');

    assert.deepEqual(marker._rootElement.move.firstCall.args, [25, 0], 'movement');
    assert.deepEqual(marker._trackerElement.move.firstCall.args, [25, 0], 'trackerElement movement');
});

QUnit.test('render - vertical, left', function(assert) {
    options.vertical = true;
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._element, '_element');
    assert.strictEqual(marker._element.parent, marker._rootElement, '_element parent');
    assert.deepEqual(marker._element._stored_settings, { points: [200, 300, 180, 296, 180, 304], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');

    assert.ok(marker._trackerElement, '_trackerElement');
    assert.deepEqual(marker._trackerElement._stored_settings, { points: [200, 310, 180, 310, 180, 290, 200, 290], type: 'area' }, '_tracker settings');

    assert.deepEqual(marker._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(marker._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('render - vertical, right', function(assert) {
    options.vertical = true;
    options.horizontalOrientation = 'right';
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._element, '_element');
    assert.strictEqual(marker._element.parent, marker._rootElement, '_element parent');
    assert.deepEqual(marker._element._stored_settings, { points: [200, 300, 220, 296, 220, 304], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');

    assert.ok(marker._trackerElement, '_trackerElement');
    assert.deepEqual(marker._trackerElement._stored_settings, { points: [200, 310, 220, 310, 220, 290, 200, 290], type: 'area' }, '_tracker settings');

    assert.deepEqual(marker._rootElement.move.firstCall.args, [0, 25], 'movement');
    assert.deepEqual(marker._trackerElement.move.firstCall.args, [0, 25], 'trackerElement movement');
});

QUnit.test('render - with background', function(assert) {
    options.space = 1;
    options.containerBackgroundColor = 'white';
    marker.render(options).resize(this.layout);

    assert.deepEqual(marker._element._stored_settings, { points: [300, 100, 296, 80, 304, 80], stroke: 'white', 'stroke-width': 1, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');
});

QUnit.test('render - background size is limited', function(assert) {
    options.space = 5;
    options.containerBackgroundColor = 'white';
    marker.render(options).resize(this.layout);

    assert.deepEqual(marker._element._stored_settings, { points: [300, 100, 296, 80, 304, 80], stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');
});

QUnit.test('not valid length (not rendered)', function(assert) {
    options.length = 0;
    assert.ok(!marker.render(options).enabled);
});

QUnit.test('not valid width (not rendered)', function(assert) {
    options.width = -2;
    assert.ok(!marker.render(options).enabled);
});

QUnit.test('getTooltipParameters - horizontal, top', function(assert) {
    assert.deepEqual(marker.render(options).resize(this.layout).getTooltipParameters(), { x: 325, y: 90, offset: 10, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - horizontal, bottom', function(assert) {
    options.verticalOrientation = 'bottom';
    assert.deepEqual(marker.render(options).resize(this.layout).getTooltipParameters(), { x: 325, y: 110, offset: 10, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical, left', function(assert) {
    options.vertical = true;
    assert.deepEqual(marker.render(options).resize(this.layout).getTooltipParameters(), { x: 190, y: 325, offset: 10, color: 'black', value: 25 });
});

QUnit.test('getTooltipParameters - vertical, right', function(assert) {
    options.vertical = true;
    options.horizontalOrientation = 'right';
    assert.deepEqual(marker.render(options).resize(this.layout).getTooltipParameters(), { x: 210, y: 325, offset: 10, color: 'black', value: 25 });
});

QUnit.module('TextCloudMarker', {
    beforeEach: function() {
        renderer = new vizMocks.Renderer();
        owner = renderer.g();
        tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 300, 400);
        marker = new linearIndicatorsModule['textcloud']({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100
        };
        options = {
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
        const baseCreateText = renderer.stub('text');
        renderer.text = sinon.spy(function() {
            const text = baseCreateText.apply(this, arguments);
            text.getBBox = sinon.spy(function() { return { x: -20, y: -10, width: 40, height: 16 }; });
            return text;
        });
    }
});

//  B254470
QUnit.test('measure', function(assert) {
    options.arrowLength = String(options.arrowLength);
    options.horizontalOffset = String(options.horizontalOffset);
    options.verticalOffset = String(options.verticalOffset);

    assert.deepEqual(marker.render(options).measure({ y: 100 }), { min: 73, max: 100, indent: 0 }, 'horizontal, top');

    options.verticalOrientation = 'bottom';
    assert.deepEqual(marker.render(options).measure({ y: 100 }), { min: 100, max: 127, indent: 0 }, 'horizontal, bottom');

    options.vertical = true;
    assert.deepEqual(marker.render(options).measure({ x: 200 }), { min: 141, max: 200, indent: 0 }, 'vertical, left');

    options.horizontalOrientation = 'right';
    assert.deepEqual(marker.render(options).measure({ x: 200 }), { min: 200, max: 259, indent: 0 }, 'vertical, right');
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(marker.render(options).measure({ y: 100 }), { min: 73, max: 100, indent: 0 }, 'horizontal, top');

    options.verticalOrientation = 'bottom';
    assert.deepEqual(marker.render(options).measure({ y: 100 }), { min: 100, max: 127, indent: 0 }, 'horizontal, bottom');

    options.vertical = true;
    assert.deepEqual(marker.render(options).measure({ x: 200 }), { min: 141, max: 200, indent: 0 }, 'vertical, left');

    options.horizontalOrientation = 'right';
    assert.deepEqual(marker.render(options).measure({ x: 200 }), { min: 200, max: 259, indent: 0 }, 'vertical, right');
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

    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');
    assert.ok(marker._cloud, '_cloud');
    assert.strictEqual(marker._cloud.parent, marker._rootElement, '_cloud parent');
    assert.deepEqual(marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(marker._text, '_text');
    assert.strictEqual(marker._text.parent, marker._rootElement, '_text parent');
    assert.deepEqual(marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
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

    options.verticalOrientation = 'bottom';
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._cloud, '_cloud');
    assert.strictEqual(marker._cloud.parent, marker._rootElement, '_cloud parent');
    assert.deepEqual(marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(marker._text, '_text');
    assert.strictEqual(marker._text.parent, marker._rootElement, '_text parent');
    assert.deepEqual(marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
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

    options.vertical = true;
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._cloud, '_cloud');
    assert.strictEqual(marker._cloud.parent, marker._rootElement, '_cloud parent');
    assert.deepEqual(marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(marker._text, '_text');
    assert.strictEqual(marker._text.parent, marker._rootElement, '_text parent');
    assert.deepEqual(marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
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

    options.vertical = true;
    options.horizontalOrientation = 'right';
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._cloud, '_cloud');
    assert.strictEqual(marker._cloud.parent, marker._rootElement, '_cloud parent');
    assert.deepEqual(marker._cloud._stored_settings, { points: tc.points, type: 'area' }, '_cloud settings');

    assert.ok(marker._text, '_text');
    assert.strictEqual(marker._text.parent, marker._rootElement, '_text parent');
    assert.deepEqual(marker._text._stored_settings, { x: tc.cx, y: tc.cy + 2, align: 'center', text: '25.0' }, '_text settings');
    assert.deepEqual(marker._text._stored_styles, { fill: 'someColor', 'font-size': 'someSize' }, '_text font style');
});

QUnit.test('_getTextCloudOptions - horizontal, top', function(assert) {
    marker._options = { y: 90 };
    marker._actualPosition = 100;
    marker._inverted = false;

    assert.deepEqual(marker._getTextCloudOptions(), { x: 100, y: 90, type: 'right-bottom' });
});

QUnit.test('_getTextCloudOptions - horizontal, bottom', function(assert) {
    marker._options = { y: 90 };
    marker._actualPosition = 100;
    marker._inverted = true;

    assert.deepEqual(marker._getTextCloudOptions(), { x: 100, y: 90, type: 'right-top' });
});

QUnit.test('_getTextCloudOptions - vertical, left', function(assert) {
    marker._options = { x: 90 };
    marker._actualPosition = 100;
    marker.vertical = true;
    marker._inverted = false;

    assert.deepEqual(marker._getTextCloudOptions(), { x: 90, y: 100, type: 'top-right' });
});

QUnit.test('_getTextCloudOptions - vertical, left', function(assert) {
    marker._options = { x: 90 };
    marker._actualPosition = 100;
    marker.vertical = true;
    marker._inverted = true;

    assert.deepEqual(marker._getTextCloudOptions(), { x: 90, y: 100, type: 'top-left' });
});
