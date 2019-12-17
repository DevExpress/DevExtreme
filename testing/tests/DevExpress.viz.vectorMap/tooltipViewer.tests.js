var noop = require('core/utils/common').noop,
    vizMocks = require('../../helpers/vizMocks.js'),
    mapLayerModule = require('viz/vector_map/map_layer'),
    tooltipViewerModule = require('viz/vector_map/tooltip_viewer'),
    StubMapLayerCollection;

QUnit.begin(function() {
    StubMapLayerCollection = vizMocks.stubClass(mapLayerModule.MapLayerCollection);
});

QUnit.module('TooltipViewer', {
    beforeEach: function() {
        this.tracker = { on: sinon.spy(function() { return noop; }) };
        this.layerCollection = new StubMapLayerCollection();
        this.tooltip = new vizMocks.Tooltip();
        this.tooltipViewer = new tooltipViewerModule.TooltipViewer({
            tracker: this.tracker,
            layerCollection: this.layerCollection,
            tooltip: this.tooltip
        });
    },

    afterEach: function() {
        this.tooltipViewer.dispose();
    },

    trigger: function(name, arg) {
        this.tracker.on.lastCall.args[0][name](arg);
    }
});

QUnit.test('Tracker callbacks', function(assert) {
    var trackerHandlers = this.tracker.on.lastCall.args[0];
    assert.strictEqual(typeof trackerHandlers['focus-on'], 'function', 'focus-on');
    assert.strictEqual(typeof trackerHandlers['focus-off'], 'function', 'focus-off');
    assert.strictEqual(typeof trackerHandlers['focus-move'], 'function', 'focus-move');
});

QUnit.test('Focus-on - tooltip is shown', function(assert) {
    var done = sinon.spy(),
        proxy = { tag: 'proxy' },
        layer = {
            getProxy: sinon.stub().withArgs('test-index').returns(proxy)
        };
    this.tooltip.stub('isEnabled').returns(true);
    this.tooltip.stub('show').returns(true);
    this.layerCollection.stub('byName').withArgs('test-layer').returns(layer);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.deepEqual(this.tooltip.show.lastCall.args, [proxy, { x: 0, y: 0, offset: 0 }, { target: proxy }], 'show');
    assert.deepEqual(this.tooltip.move.lastCall.args, [10, 20, 12], 'move');
    assert.deepEqual(done.lastCall.args, [true], 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of tooltip.show', function(assert) {
    var done = sinon.spy(),
        proxy = { tag: 'proxy' },
        layer = {
            getProxy: sinon.stub().withArgs('test-index').returns(proxy)
        };
    this.tooltip.stub('isEnabled').returns(true);
    this.tooltip.stub('show').returns(false);
    this.layerCollection.stub('byName').withArgs('test-layer').returns(layer);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.deepEqual(this.tooltip.show.lastCall.args, [proxy, { x: 0, y: 0, offset: 0 }, { target: proxy }], 'show');
    assert.strictEqual(this.tooltip.stub('move').lastCall, null, 'move');
    assert.deepEqual(done.lastCall.args, [false], 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of index', function(assert) {
    var done = sinon.spy(),
        layer = {
            getProxy: sinon.stub()
        };
    this.tooltip.stub('isEnabled').returns(true);
    this.layerCollection.stub('byName').withArgs('test-layer').returns(layer);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.strictEqual(this.tooltip.stub('show').lastCall, null, 'show');
    assert.strictEqual(this.tooltip.stub('move').lastCall, null, 'move');
    assert.deepEqual(done.lastCall.args, [false], 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of name', function(assert) {
    var done = sinon.spy();
    this.tooltip.stub('isEnabled').returns(true);
    this.layerCollection.stub('byName');

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.strictEqual(this.tooltip.stub('show').lastCall, null, 'show');
    assert.strictEqual(this.tooltip.stub('move').lastCall, null, 'move');
    assert.deepEqual(done.lastCall.args, [false], 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of tooltip.isEnabled', function(assert) {
    var done = sinon.spy();
    this.tooltip.stub('isEnabled').returns(false);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.strictEqual(this.tooltip.stub('show').lastCall, null, 'show');
    assert.strictEqual(this.tooltip.stub('move').lastCall, null, 'move');
    assert.deepEqual(done.lastCall.args, [false], 'callback');
});

QUnit.test('Focus-move', function(assert) {
    this.trigger('focus-move', { x: 20, y: 30 });

    assert.deepEqual(this.tooltip.move.lastCall.args, [20, 30, 12], 'move');
});

QUnit.test('Focus-off', function(assert) {
    this.trigger('focus-off');

    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});
