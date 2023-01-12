const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const circularIndicatorsModule = require('viz/gauges/circular_indicators');
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
        const translator = new Translator1D(0, 100, 180, 0);
        this.marker = new circularIndicatorsModule['trianglemarker']({ renderer: this.renderer, translator: translator, owner: this.owner, tracker: tracker, className: 'root-class' });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
        };
        this.options = {
            length: 12,
            width: 8,
            color: 'black',
            currentValue: 25
        };
    }
});

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.marker.render({ length: 10 }).measure({ radius: 100 }), { min: 100, max: 110 });
});

//  B254470
QUnit.test('measure (string-like numbers)', function(assert) {
    assert.deepEqual(this.marker.render({ length: '10' }).measure({ radius: 100 }), { min: 100, max: 110 });
});

QUnit.test('render', function(assert) {
    this.marker.render(this.options).resize(this.layout);

    assert.strictEqual(this.marker._renderer, this.renderer, '_renderer');
    assert.strictEqual(this.marker._owner, this.owner, '_owner');

    assert.ok(this.marker._rootElement, '_rootElement');
    assert.deepEqual(this.marker._rootElement._stored_settings, { 'class': 'root-class', fill: 'black' }, '_rootElement settings');

    assert.ok(this.marker._element, '_element');
    assert.strictEqual(this.marker._element.parent, this.marker._rootElement, '_element parent');
    assert.deepEqual(this.marker._element._stored_settings, { points: [200, 20, 196, 8, 204, 8], stroke: 'none', 'stroke-width': 0, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');

    assert.ok(this.marker._trackerElement, '_trackerElement');
    assert.deepEqual(this.marker._trackerElement._stored_settings, { points: [190, 4, 190, 24, 210, 24, 210, 4], type: 'area' }, '_tracker settings');

    assert.deepEqual(this.marker._rootElement.rotate.firstCall.args, [-45, 200, 100], 'rotation');
    assert.deepEqual(this.marker._trackerElement.rotate.firstCall.args, [-45, 200, 100], 'trackerElement rotation');
});

QUnit.test('render - with background', function(assert) {
    this.options.space = 1;
    this.options.containerBackgroundColor = 'white';
    this.marker.render(this.options).resize(this.layout);
    assert.deepEqual(this.marker._element._stored_settings, { points: [200, 20, 196, 8, 204, 8], stroke: 'white', 'stroke-width': 1, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
    assert.equal(this.marker._element.sharp.callCount, 1, '_element is sharped');
    assert.ok(this.marker._element.sharp.lastCall.calledAfter(this.marker._element.attr.lastCall), '_element is sharped');
});

QUnit.test('render - background size is limited', function(assert) {
    this.options.space = 5;
    this.options.containerBackgroundColor = 'white';
    this.marker.render(this.options).resize(this.layout);
    assert.deepEqual(this.marker._element._stored_settings, { points: [200, 20, 196, 8, 204, 8], stroke: 'white', 'stroke-width': 2, 'stroke-linecap': 'square', type: 'area' }, '_element settings');
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

QUnit.test('not valid radius. min radius check', function(assert) {
    this.options.x = 10;
    this.options.y = 10;
    this.options.width = 4;
    this.options.length = 5;
    this.options.radius = 0;

    assert.ok(this.marker.render(this.options).resize({ radius: 0 }).visible);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0].points, [10, 9, 8, 4, 12, 4]);
});

QUnit.test('getTooltipParameters', function(assert) {
    const x = 200 + Math.cos(Math.PI * 0.75) * 86;
    const y = 100 - Math.sin(Math.PI * 0.75) * 86;
    assert.deepEqual(this.marker.render(this.options).resize(this.layout).getTooltipParameters(), { x: x, y: y, offset: 6, color: 'black', value: 25 });
});

QUnit.module('TextCloudMarker', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.owner = this.renderer.g();
        const tracker = {
            attach: function(arg) { this.attached = arg; },
            detach: function(arg) { this.detached = arg; }
        };
        const translator = new Translator1D(0, 100, 180, 0);
        this.marker = new circularIndicatorsModule['textcloud']({ renderer: this.renderer, translator: translator, owner: this.owner, tracker, className: 'root-class', notifiers: { dirty: noop, ready: noop, changed: noop } });
        this.layout = {
            x: 200,
            y: 100,
            radius: 80
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
                font: { color: 'fontColor', size: 'fontSize' }
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

QUnit.test('measure', function(assert) {
    assert.deepEqual(this.marker.render(this.options).measure({ radius: 80 }), {
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
    this.options.arrowLength = String(this.options.arrowLength);
    this.options.horizontalOffset = String(this.options.horizontalOffset);
    this.options.verticalOffset = String(this.options.verticalOffset);
    assert.deepEqual(this.marker.render(this.options).measure({ radius: 80 }), {
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
        cloudWidth: 56,
        cloudHeight: 24,
        tailLength: 3,
        type: 'right-bottom'
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
    assert.deepEqual(this.marker._text._stored_styles, { fill: 'fontColor', 'font-size': 'fontSize' }, '_text font styles');
});

// T346511
QUnit.test('change value when container is invisible', function(assert) {
    this.marker.render(this.options).resize(this.layout);
    this.marker._text.getBBox = function() { return { x: 0, y: 0, width: 0, height: 0 }; };

    this.marker.value(30);

    assert.strictEqual(this.marker._text._stored_settings.x, 129, 'text x');
    assert.strictEqual(this.marker._text._stored_settings.y, 22, 'text y');
});

QUnit.test('_getTextCloudOptions - 1 quarter', function(assert) {
    this.marker._actualPosition = 72;
    this.marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(this.marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(0.4 * Math.PI),
        y: 90 - 40 * Math.sin(0.4 * Math.PI),
        type: 'bottom-left'
    });
});

QUnit.test('_getTextCloudOptions - 2 quarter', function(assert) {
    this.marker._actualPosition = 126;
    this.marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(this.marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(0.7 * Math.PI),
        y: 90 - 40 * Math.sin(0.7 * Math.PI),
        type: 'right-bottom'
    });
});

QUnit.test('_getTextCloudOptions - 3 quarter', function(assert) {
    this.marker._actualPosition = 234;
    this.marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(this.marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(1.3 * Math.PI),
        y: 90 - 40 * Math.sin(1.3 * Math.PI),
        type: 'top-right'
    });
});

QUnit.test('_getTextCloudOptions - 4 quarter', function(assert) {
    this.marker._actualPosition = 324;
    this.marker._options = { x: 100, y: 90, radius: 40 };

    assert.deepEqual(this.marker._getTextCloudOptions(), {
        x: 100 + 40 * Math.cos(1.8 * Math.PI),
        y: 90 - 40 * Math.sin(1.8 * Math.PI),
        type: 'left-top'
    });
});

QUnit.test('not valid radius. min radius check', function(assert) {
    this.options.radius = -1;
    this.options.x = 10;
    this.options.y = 10;

    assert.ok(this.marker.render(this.options).resize({ radius: -1 }).visible);
    assert.deepEqual(this.renderer.path.lastCall.returnValue.attr.lastCall.args[0].points, [9, 9,
        9, -18,
        -47, -18,
        -47, 6,
        6, 6
    ]);
});
