/* global currentTest, createTestContainer */

const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');
const translator2DModule = require('viz/translators/translator2d');
const tooltipModule = require('viz/core/tooltip');
const BaseWidget = require('__internal/viz/core/m_base_widget').default;

require('viz/bullet');

$('<div>')
    .attr('id', 'container')
    .css({ width: 250, height: 30 })
    .appendTo('#qunit-fixture');

let StubTranslator;
const StubTooltip = vizMocks.Tooltip;

QUnit.begin(function() {
    StubTranslator = vizMocks.stubClass(translator2DModule.Translator2D, {
        getCanvasVisibleArea: function() { return {}; }
    });

    translator2DModule.Translator2D = sinon.spy(function() {
        return currentTest().translators.pop();
    });
});

QUnit.testStart(function() {
    translator2DModule.Translator2D.reset();
});

rendererModule.Renderer = sinon.spy(function(parameters) {
    currentTest().renderer = new vizMocks.Renderer(parameters);
    return currentTest().renderer;
});

tooltipModule.DEBUG_set_tooltip(sinon.spy(function() {
    return currentTest().tooltip;
}));

const environment = {
    beforeEach: function() {
        this.$container = $(createTestContainer('#container'));
        this.resetTranslators();
        this.tooltip = new StubTooltip();
    },
    afterEach: function() {
        this.$container.remove();
    },
    resetTranslators: function() {
        this.translatorX = new StubTranslator();
        this.translatorY = new StubTranslator();
        this.translators = [this.translatorY, this.translatorX];
    },
    createBullet: function(options, container) {
        container = container || this.$container;
        return container.dxBullet(options).dxBullet('instance');
    }
};


QUnit.module('Canvas', environment);

QUnit.test('Create canvas when size option is defined', function(assert) {
    const options = {
        size: {
            width: 250,
            height: 30
        }
    };

    this.createBullet(options);

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;
    assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 2, bottom: 2, left: 1, right: 1 }, 'Canvas object is correct');
    assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 2, bottom: 2, left: 1, right: 1 }, 'Canvas object is correct');
    assert.equal(this.renderer.resize.callCount, 1, 'Resize call count'); // renderer for sparkline and tooltip
    assert.deepEqual(this.renderer.resize.firstCall.args, [250, 30], 'Pass canvas width and height to renderer');
});

QUnit.test('Create canvas when margin option is defined', function(assert) {
    const options = {
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        size: {
            width: 250,
            height: 30
        },
        margin: {
            top: 1,
            bottom: 2,
            left: 3,
            right: 4
        }
    };

    this.createBullet(options);

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;
    assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 1, bottom: 2, left: 3, right: 4 }, 'Canvas object is correct');
    assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 1, bottom: 2, left: 3, right: 4 }, 'Canvas object is correct');
    assert.equal(this.renderer.resize.callCount, 1);
    assert.deepEqual(this.renderer.stub('resize').firstCall.args, [250, 30], 'Pass canvas width and height to renderer');
});

QUnit.test('Create canvas when container size is defined', function(assert) {
    this.createBullet({});

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;
    assert.deepEqual(argTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 2, bottom: 2, left: 1, right: 1 }, 'Canvas object is correct');
    assert.deepEqual(valTranslator.update.lastCall.args[1], { width: 250, height: 30, top: 2, bottom: 2, left: 1, right: 1 }, 'Canvas object is correct');
    assert.equal(this.renderer.stub('resize').callCount, 1);
    assert.deepEqual(this.renderer.stub('resize').firstCall.args, [250, 30], 'Pass canvas width and height to renderer');
});

QUnit.module('Range', environment);

QUnit.test('startScaleValue > endScaleValue. Arg translator must be inverted', function(assert) {
    this.createBullet({
        startScaleValue: 10,
        endScaleValue: 1
    });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;

    assert.strictEqual(argTranslator.update.lastCall.args[0].invert, true, 'Arg translator inverted');
});

QUnit.test('startScaleValue > endScaleValue. Arg translator must not be inverted', function(assert) {
    this.createBullet({
        startScaleValue: 1,
        endScaleValue: 10
    });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;

    assert.strictEqual(argTranslator.update.lastCall.args[0].invert, undefined, 'Arg translator inverted');
});

QUnit.test('Create range when all value options are defined', function(assert) {
    this.createBullet({ value: 10, target: 20, startScaleValue: 0, endScaleValue: 30 });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.equal(argTranslator.update.lastCall.args[0].min, 0, 'Min arg should be like startScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].max, 30, 'Max arg should be like endScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].axisType, 'continuous', 'Arg AxisType provided');
    assert.equal(argTranslator.update.lastCall.args[0].dataType, 'numeric', 'Arg DataType provided');

    assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'Min val should have value 0');
    assert.equal(valTranslator.update.lastCall.args[0].max, 1, 'Max val should have value 1');
    assert.equal(valTranslator.update.lastCall.args[0].axisType, 'continuous', 'Val AxisType provided');
    assert.equal(valTranslator.update.lastCall.args[0].dataType, 'numeric', 'Val DataType provided');
});

QUnit.test('Create range without min level', function(assert) {
    this.createBullet({ value: 10, target: 20, endScaleValue: 30 });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.equal(argTranslator.update.lastCall.args[0].min, 0, 'Min arg should be like startScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].max, 30, 'Max arg should be like endScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].axisType, 'continuous', 'Arg AxisType provided');
    assert.equal(argTranslator.update.lastCall.args[0].dataType, 'numeric', 'Arg DataType provided');

    assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'Min val should have value 0');
    assert.equal(valTranslator.update.lastCall.args[0].max, 1, 'Max val should have value 1');
    assert.equal(valTranslator.update.lastCall.args[0].axisType, 'continuous', 'Val AxisType provided');
    assert.equal(valTranslator.update.lastCall.args[0].dataType, 'numeric', 'Val DataType provided');
});

QUnit.test('Create range without max level when target > value', function(assert) {
    this.createBullet({ value: 10, target: 20 });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.equal(argTranslator.update.lastCall.args[0].min, 0, 'Min arg should be like startScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].max, 20, 'Max arg should be like target');
    assert.equal(argTranslator.update.lastCall.args[0].axisType, 'continuous', 'Arg AxisType provided');
    assert.equal(argTranslator.update.lastCall.args[0].dataType, 'numeric', 'Arg DataType provided');

    assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'Min val should have value 0');
    assert.equal(valTranslator.update.lastCall.args[0].max, 1, 'Max val should have value 1');
    assert.equal(valTranslator.update.lastCall.args[0].axisType, 'continuous', 'Val AxisType provided');
    assert.equal(valTranslator.update.lastCall.args[0].dataType, 'numeric', 'Val DataType provided');
});

QUnit.test('Create range without max level when value > target', function(assert) {
    this.createBullet({ value: 20, target: 10 });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.equal(argTranslator.update.lastCall.args[0].min, 0, 'Min arg should be like startScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].max, 20, 'Max arg should be like target');
    assert.equal(argTranslator.update.lastCall.args[0].axisType, 'continuous', 'Arg AxisType provided');
    assert.equal(argTranslator.update.lastCall.args[0].dataType, 'numeric', 'Arg DataType provided');

    assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'Min val should have value 0');
    assert.equal(valTranslator.update.lastCall.args[0].max, 1, 'Max val should have value 1');
    assert.equal(valTranslator.update.lastCall.args[0].axisType, 'continuous', 'Val AxisType provided');
    assert.equal(valTranslator.update.lastCall.args[0].dataType, 'numeric', 'Val DataType provided');
});

QUnit.test('Create range without value', function(assert) {
    this.createBullet({ target: 20, endScaleValue: 30 });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.equal(argTranslator.update.lastCall.args[0].min, 0, 'Min arg should be like startScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].max, 30, 'Max arg should be like endScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].axisType, 'continuous', 'Arg AxisType provided');
    assert.equal(argTranslator.update.lastCall.args[0].dataType, 'numeric', 'Arg DataType provided');

    assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'Min val should have value 0');
    assert.equal(valTranslator.update.lastCall.args[0].max, 1, 'Max val should have value 1');
    assert.equal(valTranslator.update.lastCall.args[0].axisType, 'continuous', 'Val AxisType provided');
    assert.equal(valTranslator.update.lastCall.args[0].dataType, 'numeric', 'Val DataType provided');
});

QUnit.test('Create range without target', function(assert) {
    this.createBullet({ value: 10, endScaleValue: 30 });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.equal(argTranslator.update.lastCall.args[0].min, 0, 'Min arg should be like startScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].max, 30, 'Max arg should be like endScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].axisType, 'continuous', 'Arg AxisType provided');
    assert.equal(argTranslator.update.lastCall.args[0].dataType, 'numeric', 'Arg DataType provided');

    assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'Min val should have value 0');
    assert.equal(valTranslator.update.lastCall.args[0].max, 1, 'Max val should have value 1');
    assert.equal(valTranslator.update.lastCall.args[0].axisType, 'continuous', 'Val AxisType provided');
    assert.equal(valTranslator.update.lastCall.args[0].dataType, 'numeric', 'Val DataType provided');
});

QUnit.test('Create range when all value are negative', function(assert) {
    this.createBullet({ value: -10, target: -20, startScaleValue: 0, endScaleValue: -30 });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.equal(argTranslator.update.lastCall.args[0].min, -30, 'Min arg should be like endScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].max, 0, 'Max arg should be like startScaleValue');
    assert.equal(argTranslator.update.lastCall.args[0].axisType, 'continuous', 'Arg AxisType provided');
    assert.equal(argTranslator.update.lastCall.args[0].dataType, 'numeric', 'Arg DataType provided');

    assert.equal(valTranslator.update.lastCall.args[0].min, 0, 'Min val should have value 0');
    assert.equal(valTranslator.update.lastCall.args[0].max, 1, 'Max val should have value 1');
    assert.equal(valTranslator.update.lastCall.args[0].axisType, 'continuous', 'Val AxisType provided');
    assert.equal(valTranslator.update.lastCall.args[0].dataType, 'numeric', 'Val DataType provided');
});

QUnit.module('Prepare options', environment);

QUnit.test('Prepare options whe max level is undefined', function(assert) {
    const bullet = this.createBullet({ value: 10, target: 25 });

    assert.equal(bullet._allOptions.endScaleValue, 25, 'Max level should be 25');
});

QUnit.test('Prepare options whe max level < min level', function(assert) {
    const bullet = this.createBullet({ value: 10, target: 25, startScaleValue: 30, endScaleValue: 0 });

    assert.equal(bullet._allOptions.endScaleValue, 30, 'Max level should be 30');
    assert.equal(bullet._allOptions.startScaleValue, 0, 'Min level should be 0');
});

QUnit.module('Creating', environment);

QUnit.test('Create helpers', function(assert) {
    this.createBullet({});

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;

    assert.ok(argTranslator.update.lastCall.args[0], 'Arg Range should be create');
    assert.ok(valTranslator.update.lastCall.args[0], 'Val Range should be create');
    assert.ok(translator2DModule.Translator2D.firstCall.args[0], 'X Translator should be created'); // bullet._translatorX
    assert.ok(translator2DModule.Translator2D.secondCall.args[0], 'Y Translator should be created'); // bullet._translatorY
    assert.ok(this.renderer, 'Renderer should be created');
    assert.strictEqual(rendererModule.Renderer.firstCall.args[0]['cssClass'], 'dxb dxb-bullet', 'root class');
});

QUnit.test('Tooltip is not created on widget creation', function(assert) {
    const bullet = this.createBullet({});

    assert.equal(tooltipModule.Tooltip.callCount, 0);
    assert.ok(!('_tooltip' in bullet));
    assert.strictEqual(this.renderer.root.attr.callCount, 2);
    assert.deepEqual(this.renderer.root.attr.getCall(0).args, [{ 'pointer-events': 'visible' }]);
    assert.deepEqual(this.renderer.root.attr.getCall(1).args, ['pointer-events']);
});

QUnit.module('Structure', environment);

QUnit.test('Groups structure', function(assert) {
    this.createBullet({ value: 10, minScaleValue: 0, maxScaleValue: 10 });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 3, 'Root should have 3 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);
    assert.ok(renderer.stub('path').getCall(0).returnValue.sharp.calledOnce);
    assert.ok(renderer.stub('path').getCall(0).returnValue.sharp.lastCall.calledAfter(renderer.stub('path').getCall(0).returnValue.attr.lastCall));

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);
    assert.ok(renderer.stub('path').getCall(1).returnValue.sharp.calledOnce);
    assert.ok(renderer.stub('path').getCall(1).returnValue.sharp.lastCall.calledAfter(renderer.stub('path').getCall(1).returnValue.attr.lastCall));

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when zero level is not in interval', function(assert) {
    this.createBullet({ endScaleValue: 20, target: 8, value: 10, startScaleValue: 5 });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 2, 'Root should have 2 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').callCount, 0);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when zero level is not visible', function(assert) {
    this.createBullet({ endScaleValue: 20, target: 8, value: 10, startScaleValue: 5, showZeroLevel: false });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 2, 'Root should have 2 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').callCount, 0);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when target is not in interval', function(assert) {
    this.createBullet({ endScaleValue: 20, target: 30, value: 10 });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 2, 'Root should have 2 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').callCount, 0);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when target is not visible', function(assert) {
    this.createBullet({ showTarget: false, value: 10 });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 2, 'Root should have 2 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').callCount, 0);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when empty bullet', function(assert) {
    this.createBullet({});

    const renderer = this.renderer;
    assert.deepEqual(renderer.root.children, [], 'Root should have 0 children');
});

QUnit.test('Groups structure when value is string', function(assert) {
    this.createBullet({ value: '10' });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 3, 'Root should have 3 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when value is incorrect string', function(assert) {
    this.createBullet({ value: 'hey' });

    const renderer = this.renderer;
    assert.deepEqual(renderer.root.children, [], 'Root should have 0 children');
});

QUnit.test('Groups structure when value is null', function(assert) {
    this.createBullet({ value: '10' });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 3, 'Root should have 3 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when target is string', function(assert) {
    this.createBullet({ target: '10' });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 3, 'Root should have 3 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when target < 0 and startScaleValue is not defined, value < 0. target < value', function(assert) {
    this.createBullet({ target: -10, endScaleValue: 20, value: -5 });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 3, 'Root should have 3 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when target < 0 and startScaleValue is not defined, value < 0. target > value', function(assert) {
    this.createBullet({ target: -10, endScaleValue: 20, value: -15 });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 3, 'Root should have 3 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when target < 0 and startScaleValue is not defined', function(assert) {
    this.createBullet({ target: -10, endScaleValue: 20 });

    const renderer = this.renderer;

    assert.equal(renderer.root.children.length, 3, 'Root should have 3 children');
    assert.equal(renderer.stub('path').callCount, 3);

    assert.equal(renderer.stub('path').getCall(0).args[1], 'line', 'zero level');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(0).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(1).args[1], 'line', 'target');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(1).returnValue.stub('append').lastCall.args[0], renderer.root);

    assert.equal(renderer.stub('path').getCall(2).args[1], 'line');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('attr').firstCall.args[0]['stroke-linecap'], 'square');
    assert.equal(renderer.stub('path').getCall(2).returnValue.stub('append').lastCall.args[0], renderer.root);
});

QUnit.test('Groups structure when minScaleValue = endScaleValue', function(assert) {
    this.createBullet({ startScaleValue: 10, endScaleValue: 10 });

    const renderer = this.renderer;
    assert.deepEqual(renderer.root.children, [], 'Root should have 0 children');
});

QUnit.module('Get params', environment);

QUnit.test('Get target params', function(assert) {
    this.translatorX.stub('translate').onCall(2).returns('x1');
    this.translatorY.stub('translate').onCall(2).returns('y1');
    this.translatorY.stub('translate').onCall(3).returns('y2');

    this.createBullet({ value: 5, target: 10, endScaleValue: 20, targetColor: '#000000', targetWidth: 2 });

    const targetElem = this.renderer.path.secondCall.returnValue;
    const creatingParams = targetElem.attr.firstCall.args;
    const drawingParams = targetElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-target', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        stroke: '#000000',
        'stroke-width': 2,
        points: ['x1', 'y1', 'x1', 'y2']
    });
    assert.deepEqual(this.translatorX.translate.getCall(2).args, [10], 'translatorX is called');
    assert.deepEqual(this.translatorY.translate.getCall(2).args, [0.02], 'translatorY is called first time');
    assert.deepEqual(this.translatorY.translate.getCall(3).args, [0.98], 'translatorY is called second time');
});

QUnit.test('Get bar value params when all values are positive', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: 5, target: 10, endScaleValue: 20, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [0], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [5], 'translatorX is called twice');
});

QUnit.test('Get bar value params when all values are positive and inverted', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: 5, target: 10, endScaleValue: 0, startScaleValue: 20, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [0], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [5], 'translatorX is called twice');
});

QUnit.test('Get bar value params when value = 0', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: 0, target: 10, endScaleValue: 20, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [0], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [0], 'translatorX is called twice');
});

QUnit.test('Get bar value params when max level > 0 and value < max level', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: 15, target: 10, endScaleValue: 10, startScaleValue: -10, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [0], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [10], 'translatorX is called twice');
});

QUnit.test('Get bar value params when min level > 0', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: 15, target: 10, endScaleValue: 20, startScaleValue: 5, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [5], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [15], 'translatorX is called twice');
});

QUnit.test('Get bar value params when min level < 0 and value < min level', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: -15, target: 10, endScaleValue: 20, startScaleValue: -10, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [0], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [-10], 'translatorX is called twice');
});

QUnit.test('Get bar value params when max level < 0', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: -15, target: -10, endScaleValue: -5, startScaleValue: -20, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [-5], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [-15], 'translatorX is called twice');
});

QUnit.test('Get bar value params when all values are negative', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: -10, target: -5, endScaleValue: 0, startScaleValue: -15, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [0], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [-10], 'translatorX is called twice');
});

QUnit.test('Get bar value params when all values are negative and inverted', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: -10, target: -5, endScaleValue: 0, startScaleValue: -15, color: '#FFFF00', inverted: true });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [0], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [-10], 'translatorX is called twice');
});

QUnit.test('T180366. Get bar value params when value < start scale value and end scale value', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: 20, target: 10, endScaleValue: 90, startScaleValue: 67, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [67], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [67], 'translatorX is called twice');
});

QUnit.test('T180366. Get bar value params when value > start scale value and end scale value', function(assert) {
    this.translatorX.stub('translate').onCall(0).returns('x1');
    this.translatorX.stub('translate').onCall(1).returns('x2');
    this.translatorY.stub('translate').onCall(0).returns('y2');
    this.translatorY.stub('translate').onCall(1).returns('y1');

    this.createBullet({ value: -20, target: 10, endScaleValue: -67, startScaleValue: -90, color: '#FFFF00' });

    const barElem = this.renderer.path.thirdCall.returnValue;
    const creatingParams = barElem.attr.firstCall.args;
    const drawingParams = barElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-bar-value', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        fill: '#FFFF00',
        points: ['x1', 'y1', 'x2', 'y1', 'x2', 'y2', 'x1', 'y2']
    });

    assert.deepEqual(this.translatorY.translate.getCall(0).args, [0.1], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(1).args, [0.9], 'translatorY is called twice');
    assert.deepEqual(this.translatorX.translate.getCall(0).args, [-67], 'translatorX is called once');
    assert.deepEqual(this.translatorX.translate.getCall(1).args, [-67], 'translatorX is called twice');
});

QUnit.test('Get zero level params', function(assert) {
    this.translatorX.stub('translate').onCall(3).returns('x1');
    this.translatorY.stub('translate').onCall(4).returns('y1');
    this.translatorY.stub('translate').onCall(5).returns('y2');

    this.createBullet({ value: 5, target: 10, endScaleValue: 20 });

    const zeroElem = this.renderer.path.firstCall.returnValue;
    const creatingParams = zeroElem.attr.firstCall.args;
    const drawingParams = zeroElem.attr.lastCall.args;

    assert.ok(creatingParams, 'Params should be created');
    assert.ok(drawingParams, 'Params should be created');

    assert.deepEqual(creatingParams[0], { 'class': 'dxb-zero-level', 'stroke-linecap': 'square' }, 'creating params');

    assert.deepEqual(drawingParams[0], {
        stroke: '#666666',
        points: ['x1', 'y1', 'x1', 'y2'],
        'stroke-width': 1
    });

    assert.deepEqual(this.translatorX.translate.getCall(3).args, [0], 'translatorX is called');
    assert.deepEqual(this.translatorY.translate.getCall(4).args, [0.02], 'translatorY is called once');
    assert.deepEqual(this.translatorY.translate.getCall(5).args, [0.98], 'translatorY is called twice');
});

QUnit.module('Options changed', environment);

QUnit.test('Refresh', function(assert) {
    const options = {
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8
    };
    const sparkCont = $('<div>')
        .css({
            width: '200px',
            height: '30px'
        })
        .appendTo(this.$container);

    const bullet = this.createBullet(options, sparkCont);
    sparkCont.width(300);
    sparkCont.height(40);
    this.resetTranslators();

    bullet.render();

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;
    assert.deepEqual(argTranslator.update.lastCall.args[1].width, 300, 'Canvas width should have new value');
    assert.deepEqual(valTranslator.update.lastCall.args[1].height, 40, 'Canvas height should have new value');

    assert.equal(this.renderer.stub('resize').callCount, 2);
    assert.deepEqual(this.renderer.stub('resize').lastCall.args, [300, 40], 'Pass new width and height to renderer');
});

QUnit.test('Change size of container', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8
    });
    this.resetTranslators();

    bullet.option('size', { width: 300, height: 100 });

    assert.ok(bullet, 'bullet should be created');

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;
    const valTranslator = translator2DModule.Translator2D.getCall(1).returnValue;
    assert.deepEqual(argTranslator.update.lastCall.args[1].width, 300, 'Canvas should have new width');
    assert.deepEqual(valTranslator.update.lastCall.args[1].height, 100, 'Canvas should have new height');

    assert.equal(this.renderer.stub('resize').callCount, 2);
    assert.deepEqual(this.renderer.stub('resize').lastCall.args, [300, 100], 'Pass new width and height to renderer');
});

QUnit.test('B239673 - Tooltip does not update location after resize', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8
    });

    bullet._showTooltip();
    bullet._tooltip.hide = sinon.spy();
    this.resetTranslators();

    bullet.option('size', { width: 300, height: 100 });
    assert.ok(bullet._tooltip.hide.calledOnce, 'Tooltip should be hidden');
});

QUnit.test('Change value', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8
    });

    this.resetTranslators();

    bullet.option('value', 7);

    assert.ok(bullet, 'bullet should be created');

    assert.equal(bullet._allOptions.value, 7, 'Value should be correct');
});

QUnit.test('Change size - B239871', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8
    });
    let redrawFunctionCalled = false;

    bullet._update = function() {
        redrawFunctionCalled = true;
    };

    bullet.option('size', { width: 200, height: 150 });

    assert.ok(redrawFunctionCalled, 'Redraw function was called');
});

QUnit.test('Change size if size = 0,0 - B239871', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8,
        size: {
            width: 0,
            height: 0
        }
    });
    let redrawFunctionCalled = false;

    bullet._update = function() {
        redrawFunctionCalled = true;
    };

    bullet.option('size', { width: 200, height: 150 });

    assert.ok(redrawFunctionCalled, 'Redraw function was not called');
});

QUnit.test('Change size if size = 10,0 - B239871', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8,
        size: {
            width: 10,
            height: 0
        }
    });
    let redrawFunctionCalled = false;

    bullet._update = function() {
        redrawFunctionCalled = true;
    };

    bullet.option('size', { width: 200, height: 150 });

    assert.ok(redrawFunctionCalled, 'Redraw function was not called');
});

QUnit.test('Change size if size = 0,10 - B239871', function(assert) {
    const bullet = this.createBullet({
        value: 10,
        startScaleValue: 0,
        endScaleValue: 10,
        target: 8,
        size: {
            width: 0,
            height: 10
        }
    });
    let redrawFunctionCalled = false;

    bullet._update = function() {
        redrawFunctionCalled = true;
    };

    bullet.option('size', { width: 200, height: 150 });

    assert.ok(redrawFunctionCalled, 'Redraw function was not called');
});

QUnit.module('drawn', {
    beforeEach: function() {
        environment.beforeEach.call(this);
        sinon.stub(BaseWidget.prototype, '_drawn').callsFake(sinon.spy());
    },
    createBullet: environment.createBullet,
    resetTranslators: environment.resetTranslators,
    afterEach: function() {
        environment.afterEach.call(this);
        BaseWidget.prototype._drawn.restore();
    }
});

QUnit.test('call drawn in BaseWidget', function(assert) {
    // arrange
    this.createBullet({});

    assert.strictEqual(BaseWidget.prototype._drawn.calledOnce, true);
});

QUnit.test('drawn is called after resize', function(assert) {
    const bullet = this.createBullet({});
    this.resetTranslators();
    bullet.option('size', { width: 300 });

    assert.strictEqual(BaseWidget.prototype._drawn.calledTwice, true);
});

QUnit.module('RTL support', environment);

QUnit.test('rtlEnabled = true. EndScaleValue > startScaleValue', function(assert) {
    this.createBullet({
        startScaleValue: 1,
        endScaleValue: 10,
        rtlEnabled: true
    });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;

    assert.strictEqual(argTranslator.update.lastCall.args[0].invert, true, 'Arg translator is inverted');
});

QUnit.test('rtlEnabled = true. EndScaleValue < startScaleValue', function(assert) {
    this.createBullet({
        startScaleValue: 10,
        endScaleValue: 1,
        rtlEnabled: true
    });

    const argTranslator = translator2DModule.Translator2D.getCall(0).returnValue;

    assert.strictEqual(argTranslator.update.lastCall.args[0].invert, false, 'Arg translator is inverted');
});
