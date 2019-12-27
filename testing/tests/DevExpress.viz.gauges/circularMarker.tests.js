const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const circularIndicatorsModule = require('viz/gauges/circular_indicators');
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
        const translator = new Translator1D(0, 100, 180, 0);
        marker = new circularIndicatorsModule['trianglemarker']({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
        };
        options = {
            length: 12,
            width: 8,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(marker.render({ length: 10 }).measure({ radius: 100 }), { min: 100, max: 110 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(marker.render({ length: '10' }).measure({ radius: 100 }), { min: 100, max: 110 });
});

QUnit.test('render', function(assert) {
    marker.render(options).resize(this.layout);

    assert.strictEqual(marker._renderer, renderer, '_renderer');
    assert.strictEqual(marker._owner, owner, '_owner');

    assert.ok(marker._rootElement, '_rootElement');
    assert.deepEqual(marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(marker._element, '_element');
    assert.strictEqual(marker._element.parent, marker._rootElement, '_element parent');
    assert.deepEqual(marker._element._stored_settings, { points: [200, 20, 196, 8, 204, 8], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');

    assert.ok(marker._trackerElement, '_trackerElement');
    assert.deepEqual(marker._trackerElement._stored_settings, { points: [190, 4, 190, 24, 210, 24, 210, 4], type: 'area' }, '_tracker settings');

    assert.deepEqual(marker._rootElement.rotate.firstCall.args, [-45, 200, 100], 'rotation');
    assert.deepEqual(marker._trackerElement.rotate.firstCall.args, [-45, 200, 100], 'trackerElement rotation');
});

QUnit.test('render - with background', function(assert) {
    options.space = 1;
    options.containerBackgroundColor = 'white';
    marker.render(options).resize(this.layout);
    assert.deepEqual(marker._element._stored_settings, { points: [200, 20, 196, 8, 204, 8], stroke: 'white', 'stroke-width': 1, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(marker._element.sharp.lastCall.calledAfter(marker._element.attr.lastCall), '_element is sharped');
});

QUnit.test('render - background size is limited', function(assert) {
    options.space = 5;
    options.containerBackgroundColor = 'white';
    marker.render(options).resize(this.layout);
    assert.deepEqual(marker._element._stored_settings, { points: [200, 20, 196, 8, 204, 8], stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
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

QUnit.test('not valid radius (not rendered)', function(assert) {
    assert.ok(!marker.render(options).measure({ radius: 0 }).visible);
});

QUnit.test('getTooltipParameters', function(assert) {
    const x = 200 + Math.cos(Math.PI * 0.75) * 86;
    const y = 100 - Math.sin(Math.PI * 0.75) * 86;
    assert.deepEqual(marker.render(options).resize(this.layout).getTooltipParameters(), { x: x, y: y, offset: 6, color: 'black', value: 25 });
});

QUnit.module('TextCloudMarker', {
    beforeEach: function() {
        renderer = new vizMocks.Renderer();
        owner = renderer.g();
        tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 180, 0);
        marker = new circularIndicatorsModule['textcloud']({ renderer: renderer, translator: translator, owner: owner, tracker: tracker, className: 'root-class', notifiers: { dirty: noop, ready: noop, changed: noop } });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
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
                font: { color: 'fontColor', size: 'fontSize' }
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

QUnit.test('measure', function(assert) {
    assert.deepEqual(marker.render(options).measure({ radius: 80 }), {
        min: 80,
        max: 80,
        horizontalOffset: 59,
        inverseHorizontalOffset: 59,
        verticalOffset: 27,
        inverseVerticalOffset: 27
    });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    options.arrowLength = String(options.arrowLength);
    options.horizontalOffset = String(options.horizontalOffset);
    options.verticalOffset = String(options.verticalOffset);
    assert.deepEqual(marker.render(options).measure({ radius: 80 }), {
        min: 80,
        max: 80,
        horizontalOffset: 59,
        inverseHorizontalOffset: 59,
        verticalOffset: 27,
        inverseVerticalOffset: 27
    });
});

QUnit.test('render', function(assert) {
    const tc = getTextCloudInfo({
        x: 200 + 80 * Math.cos(Math.PI * 3 / 4),
        y: 100 - 80 * Math.sin(Math.PI * 3 / 4),
        textWidth: 40,
        textHeight: 16,
        tailLength: 3,
        horMargin: 8,
        verMargin: 4,
        type: 'right-bottom'
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
    assert.deepEqual(marker._text._stored_styles, { fill: 'fontColor', 'font-size': 'fontSize' }, '_text font styles');
});

// T346511
QUnit.test('change value when container is invisible', function(assert) {
    marker.render(options).resize(this.layout);
    marker._text.getBBox = function() { return { x: 0, y: 0, width: 0, height: 0 }; };

    marker.value(30);

    assert.strictEqual(marker._text._stored_settings.x, 129, 'text x');
    assert.strictEqual(marker._text._stored_settings.y, 22, 'text y');
});

QUnit.test('_getTextCloudOptions - 1 quarter', function(assert) {
    marker._actualPosition = 72;
    marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(0.4 * Math.PI),
        y: 90 - 40 * Math.sin(0.4 * Math.PI),
        type: 'bottom-left'
    });
});

QUnit.test('_getTextCloudOptions - 2 quarter', function(assert) {
    marker._actualPosition = 126;
    marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(0.7 * Math.PI),
        y: 90 - 40 * Math.sin(0.7 * Math.PI),
        type: 'right-bottom'
    });
});

QUnit.test('_getTextCloudOptions - 3 quarter', function(assert) {
    marker._actualPosition = 234;
    marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(1.3 * Math.PI),
        y: 90 - 40 * Math.sin(1.3 * Math.PI),
        type: 'top-right'
    });
});

QUnit.test('_getTextCloudOptions - 4 quarter', function(assert) {
    marker._actualPosition = 324;
    marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(1.8 * Math.PI),
        y: 90 - 40 * Math.sin(1.8 * Math.PI),
        type: 'left-top'
    });
});

QUnit.test('not valid radius (not rendered)', function(assert) {
    options.radius = -1;
    assert.ok(!marker.render(options).resize({ radius: -1 }).visible);
});
