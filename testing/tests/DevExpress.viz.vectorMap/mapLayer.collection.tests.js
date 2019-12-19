var noop = require('core/utils/common').noop,
    vizMocks = require('../../helpers/vizMocks.js'),
    mapLayerModule = require('viz/vector_map/map_layer'),
    DeferredModule = require('core/utils/deferred'),
    StubMapLayer;

QUnit.module('Basic', {
    beforeEach: function() {
        var that = this;
        that.readyCallbacks = [];
        StubMapLayer = vizMocks.stubClass(mapLayerModule._TESTS_MapLayer, null, {
            $constructor: function() {
                this.proxy = { name: arguments[2] };
                StubMapLayer.items.push(this);
                var readyCallback = new DeferredModule.Deferred();
                that.readyCallbacks.push(readyCallback);
                this.getDataReadyCallback = function() {
                    return readyCallback;
                };
            }
        });
        StubMapLayer.items = [];
        mapLayerModule._TESTS_stub_MapLayer(StubMapLayer);

        this.params = {
            renderer: new vizMocks.Renderer(),
            dataKey: 'data-key',
            tracker: {
                on: sinon.spy(function() { return noop; }),
                reset: sinon.spy()
            },
            eventTrigger: sinon.spy(),
            dataReady: sinon.spy()
        };
        this.target = new mapLayerModule.MapLayerCollection(this.params);
    },

    afterEach: function() {
        this.target.dispose();
    }
});

QUnit.test('Construct', function(assert) {
    var renderer = this.params.renderer,
        container = renderer.g.lastCall.returnValue,
        id = renderer.clipRect.lastCall.returnValue.id;

    assert.deepEqual(renderer.clipRect.lastCall.args, [], 'clip rect is created');
    assert.deepEqual(renderer.rect.lastCall.args, [], 'background is created');
    assert.deepEqual(renderer.rect.lastCall.returnValue.attr.lastCall.args, [{ 'class': 'dxm-background' }], 'background settings');
    assert.deepEqual(renderer.rect.lastCall.returnValue.data.lastCall.args, ['data-key', { name: 'background' }], 'background data');
    assert.deepEqual(renderer.g.lastCall.args, [], 'container is created');
    assert.deepEqual(container.attr.lastCall.args, [{ 'class': 'dxm-layers', 'clip-path': id }], 'container settings');
    assert.deepEqual(container.append.lastCall.args, [renderer.root], 'container is appended to container');
    assert.deepEqual(container.enableLinks.lastCall.args, [], 'links are enabled');
    var trackerHandlers = this.params.tracker.on.lastCall.args[0];
    assert.strictEqual(typeof trackerHandlers['click'], 'function', 'tracker.click');
    assert.strictEqual(typeof trackerHandlers['hover-on'], 'function', 'tracker.hover-on');
    assert.strictEqual(typeof trackerHandlers['hover-off'], 'function', 'tracker.hover-off');
});

QUnit.test('Destruct', function(assert) {
    this.target.dispose();
    this.target.dispose = noop;

    assert.deepEqual(this.params.renderer.clipRect.lastCall.returnValue.dispose.lastCall.args, [], 'clip rect is disposed');
});

QUnit.test('Set rect', function(assert) {
    this.target.setBackgroundOptions({ borderWidth: 5 });

    this.target.setRect([10, 20, 400, 300]);

    assert.deepEqual(this.params.renderer.rect.lastCall.returnValue.attr.lastCall.args, [{ x: 10, y: 20, width: 400, height: 300 }], 'background');
    assert.deepEqual(this.params.renderer.clipRect.lastCall.returnValue.attr.lastCall.args, [{ x: 15, y: 25, width: 390, height: 290 }], 'clip rect');
});

QUnit.test('Set background options', function(assert) {
    this.target.setRect([20, 30, 200, 100]);

    this.target.setBackgroundOptions({ borderWidth: 3, borderColor: 'green', color: 'red' });

    assert.deepEqual(this.params.renderer.rect.lastCall.returnValue.attr.lastCall.args, [{ stroke: 'green', 'stroke-width': 3, fill: 'red' }], 'background');
    assert.deepEqual(this.params.renderer.clipRect.lastCall.returnValue.attr.lastCall.args, [{ x: 23, y: 33, width: 194, height: 94 }], 'clip rect');
});

QUnit.test('Click layer', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.params.tracker.on.lastCall.args[0]['click']({
        x: 10, y: 20,
        $event: { tag: 'event' },
        data: { name: 'layer-1', index: 'test-index' }
    });

    assert.deepEqual(StubMapLayer.items[0].raiseClick.lastCall.args, ['test-index', { tag: 'event', x: 7, y: 15 }], 'click');
});

QUnit.test('Click background', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.params.tracker.on.lastCall.args[0]['click']({
        x: 10, y: 20,
        $event: { tag: 'event' },
        data: { name: 'background' }
    });

    assert.deepEqual(this.params.eventTrigger.lastCall.args, ['click', { event: { tag: 'event', x: 7, y: 15 } }], 'click');
});

QUnit.test('Hover on layer', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.params.tracker.on.lastCall.args[0]['hover-on']({
        data: { name: 'layer-2', index: 'test-index' }
    });

    assert.deepEqual(StubMapLayer.items[1].hoverItem.lastCall.args, ['test-index', true], 'hover');
});

QUnit.test('Hover on not layer', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.params.tracker.on.lastCall.args[0]['hover-on']({
        data: { name: 'test', index: 'test-index' }
    });

    assert.ok(true, 'no errors');
});

QUnit.test('Hover off layer', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.params.tracker.on.lastCall.args[0]['hover-off']({
        data: { name: 'layer-2', index: 'test-index' }
    });

    assert.deepEqual(StubMapLayer.items[1].hoverItem.lastCall.args, ['test-index', false], 'hover');
});

QUnit.test('Hover off not layer', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.params.tracker.on.lastCall.args[0]['hover-off']({
        data: { name: 'test', index: 'test-index' }
    });

    assert.ok(true, 'no errors');
});

// T657155
QUnit.test('Items collection should be empty after updating to empty array', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.target.setOptions([]);

    assert.strictEqual(this.target.items().length, 0);
});

// T660942
QUnit.test('Update hovered layer', function(assert) {
    this.target.setOptions([{ name: 'layer-2' }]);
    this.params.tracker.reset.reset();

    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    assert.strictEqual(this.params.tracker.reset.callCount, 1);
});

QUnit.test('Data is not ready', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    assert.strictEqual(this.params.dataReady.callCount, 0);
});

QUnit.test('Data is ready', function(assert) {
    this.target.setOptions([{ name: 'layer-1' }, { name: 'layer-2' }]);

    this.readyCallbacks.forEach(rc => rc.resolve());

    assert.strictEqual(this.params.dataReady.callCount, 1);
});
