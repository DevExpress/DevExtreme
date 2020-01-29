const $ = require('jquery');
const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const gestureHandlerModule = require('viz/vector_map/gesture_handler');
const projectionModule = require('viz/vector_map/projection.main');
let StubProjection;

QUnit.begin(function() {
    StubProjection = vizMocks.stubClass(projectionModule.Projection);
});

QUnit.module('GestureHandler', {
    beforeEach: function() {
        this.projection = new StubProjection();
        this.renderer = new vizMocks.Renderer();
        this.tracker = {
            on: sinon.stub().returns(noop)
        };
        this.gestureHandler = new gestureHandlerModule.GestureHandler({
            projection: this.projection,
            tracker: this.tracker,
            renderer: this.renderer
        });
        this.gestureHandler.setInteraction({
            centeringEnabled: true,
            zoomingEnabled: true
        });
        this.renderer.root.stub('attr').reset();
    },

    afterEach: function() {
        this.gestureHandler.dispose();
    },

    trigger: function(name, arg, _name) {
        this.tracker.on.lastCall.args[0][name]($.extend({ data: { name: _name || 'test' } }, arg));
    }
});

QUnit.test('subscription to tracker', function(assert) {
    const trackerHandlers = this.tracker.on.lastCall.args[0];
    assert.strictEqual(typeof trackerHandlers['start'], 'function', 'start');
    assert.strictEqual(typeof trackerHandlers['move'], 'function', 'move');
    assert.strictEqual(typeof trackerHandlers['end'], 'function', 'end');
    assert.strictEqual(typeof trackerHandlers['zoom'], 'function', 'zoom');
});

QUnit.test('processStart', function(assert) {
    this.trigger('start', { x: 10, y: 20 });

    assert.deepEqual(this.projection.beginMoveCenter.lastCall.args, [], 'projection');
});

QUnit.test('processStart / centering is disabled', function(assert) {
    this.gestureHandler.setInteraction({ centeringEnabled: false, zoomingEnabled: true });
    this.trigger('start', { x: 10, y: 20 });

    assert.strictEqual(this.projection.stub('beginMoveCenter').lastCall, null, 'projection');
});

QUnit.test('processStart / \'control-bar\'  event', function(assert) {
    this.trigger('start', { x: 10, y: 20 }, 'control-bar');

    assert.strictEqual(this.projection.stub('beginMoveCenter').lastCall, null, 'projection');
});

QUnit.test('processMove', function(assert) {
    this.trigger('start', { x: 10, y: 20 });
    this.trigger('move', { x: 12, y: 19 });

    assert.deepEqual(this.projection.moveCenter.lastCall.args, [[-2, 1]], 'projection');
    assert.deepEqual(this.renderer.root.attr.lastCall.args, [{ cursor: 'move' }], 'cursor');
});

QUnit.test('processMove / centering is disabled', function(assert) {
    this.gestureHandler.setInteraction({ centeringEnabled: false, zoomingEnabled: true });
    this.renderer.root.attr.reset();
    this.trigger('start', { x: 10, y: 20 });
    this.trigger('move', { x: 12, y: 19 });

    assert.strictEqual(this.projection.stub('moveCenter').lastCall, null, 'projection');
    assert.strictEqual(this.renderer.root.attr.lastCall, null, 'cursor');
});

QUnit.test('processMove / \'control-bar\' event', function(assert) {
    this.trigger('start', { x: 10, y: 20 }, 'control-bar');
    this.trigger('move', { x: 12, y: 19 });

    assert.strictEqual(this.projection.stub('moveCenter').lastCall, null, 'projection');
    assert.strictEqual(this.renderer.root.attr.lastCall, null, 'cursor');
});

QUnit.test('processEnd', function(assert) {
    this.trigger('start', { x: 10, y: 20 });
    this.trigger('end');

    assert.deepEqual(this.projection.endMoveCenter.lastCall.args, [], 'projection');
    assert.deepEqual(this.renderer.root.attr.lastCall.args, [{ cursor: 'default' }], 'cursor');
});

QUnit.test('processEnd / centering is disabled', function(assert) {
    this.gestureHandler.setInteraction({ centeringEnabled: false, zoomingEnabled: true });
    this.renderer.root.attr.reset();
    this.projection.endMoveCenter.reset();
    this.trigger('start', { x: 10, y: 20 });
    this.trigger('end');

    assert.strictEqual(this.projection.stub('endMoveCenter').lastCall, null, 'projection');
    assert.strictEqual(this.renderer.root.attr.lastCall, null, 'cursor');
});

QUnit.test('processEnd / \'control-bar\' event', function(assert) {
    this.trigger('start', { x: 10, y: 20 }, 'control-bar');
    this.trigger('end');

    assert.strictEqual(this.projection.stub('endMoveCenter').lastCall, null, 'projection');
    assert.strictEqual(this.renderer.root.attr.lastCall, null, 'cursor');
});

QUnit.test('processZoom - delta', function(assert) {
    this.projection.fromScreenPoint = sinon.stub().returns([30, 40]);

    this.trigger('zoom', { delta: 3, x: 10, y: 20 });

    assert.deepEqual(this.projection.changeScaledZoom.lastCall.args, [3], 'change zoom');
    assert.deepEqual(this.projection.setCenterByPoint.lastCall.args, [[30, 40], [7, 15]], 'set center');
    assert.deepEqual(this.projection.fromScreenPoint.lastCall.args, [[7, 15]], 'screen point');
});

QUnit.test('processZoom - delta / centering is disabled', function(assert) {
    this.projection.fromScreenPoint = sinon.stub().returns([30, 40]);
    this.gestureHandler.setInteraction({ centeringEnabled: false, zoomingEnabled: true });

    this.trigger('zoom', { delta: 3, x: 10, y: 20 });

    assert.deepEqual(this.projection.changeScaledZoom.lastCall.args, [3], 'change zoom');
    assert.strictEqual(this.projection.stub('setCenterByPoint').lastCall, null, 'set center');
    assert.strictEqual(this.projection.stub('fromScreenPoint').lastCall, null, 'screen point');
});

QUnit.test('processZoom - delta / zooming is disabled', function(assert) {
    this.projection.fromScreenPoint = sinon.stub().returns([30, 40]);
    this.gestureHandler.setInteraction({ centeringEnabled: true, zoomingEnabled: false });

    this.trigger('zoom', { delta: 3, x: 10, y: 20 });

    assert.strictEqual(this.projection.stub('changeScaledZoom').lastCall, null, 'change zoom');
    assert.strictEqual(this.projection.stub('setCenterByPoint').lastCall, null, 'set center');
    assert.strictEqual(this.projection.stub('fromScreenPoint').lastCall, null, 'screen point');
});

QUnit.test('processZoom - ratio', function(assert) {
    this.projection.fromScreenPoint = sinon.stub().returns([30, 40]);

    this.trigger('zoom', { ratio: 4, x: 10, y: 20 });

    assert.deepEqual(this.projection.changeScaledZoom.lastCall.args, [2], 'change zoom');
    assert.deepEqual(this.projection.setCenterByPoint.lastCall.args, [[30, 40], [7, 15]], 'set center');
    assert.deepEqual(this.projection.fromScreenPoint.lastCall.args, [[7, 15]], 'screen point');
});

QUnit.test('processZoom - ratio / centering is disabled', function(assert) {
    this.projection.fromScreenPoint = sinon.stub().returns([30, 40]);
    this.gestureHandler.setInteraction({ centeringEnabled: false, zoomingEnabled: true });

    this.trigger('zoom', { ratio: 4, x: 10, y: 20 });

    assert.deepEqual(this.projection.changeScaledZoom.lastCall.args, [2], 'change zoom');
    assert.strictEqual(this.projection.stub('setCenterByPoint').lastCall, null, 'set center');
    assert.strictEqual(this.projection.stub('fromScreenPoint').lastCall, null, 'screen point');
});

QUnit.test('processZoom - ratio / zooming is disabled', function(assert) {
    this.projection.fromScreenPoint = sinon.stub().returns([30, 40]);
    this.gestureHandler.setInteraction({ centeringEnabled: true, zoomingEnabled: false });

    this.trigger('zoom', { ratio: 4, x: 10, y: 20 });

    assert.strictEqual(this.projection.stub('changeScaledZoom').lastCall, null, 'change zoom');
    assert.strictEqual(this.projection.stub('setCenterByPoint').lastCall, null, 'set center');
    assert.strictEqual(this.projection.stub('fromScreenPoint').lastCall, null, 'screen point');
});
