const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const mapLayerModule = require('viz/vector_map/map_layer');
const tooltipViewerModule = require('viz/vector_map/tooltip_viewer');
let StubMapLayerCollection;

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
    const trackerHandlers = this.tracker.on.lastCall.args[0];
    assert.strictEqual(typeof trackerHandlers['focus-on'], 'function', 'focus-on');
    assert.strictEqual(typeof trackerHandlers['focus-off'], 'function', 'focus-off');
    assert.strictEqual(typeof trackerHandlers['focus-move'], 'function', 'focus-move');
});

QUnit.test('Focus-on - tooltip is shown', function(assert) {
    const done = sinon.spy();
    const proxy = { tag: 'proxy' };
    const layer = {
        getProxy: sinon.stub().withArgs('test-index').returns(proxy)
    };
    this.tooltip.stub('isEnabled').returns(true);
    this.tooltip.stub('show').returns(true);
    this.layerCollection.stub('byName').withArgs('test-layer').returns(layer);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.equal(this.tooltip.show.lastCall.args[0], proxy);
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 10, y: 20, offset: 12 });
    assert.deepEqual(this.tooltip.show.lastCall.args[2], { target: proxy });
    assert.equal(this.tooltip.show.lastCall.args[3], undefined);
    assert.equal(typeof this.tooltip.show.lastCall.args[4], 'function');

    assert.deepEqual(done.lastCall.args, [true], 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of tooltip.show', function(assert) {
    const done = sinon.spy();
    const proxy = { tag: 'proxy' };
    const layer = {
        getProxy: sinon.stub().withArgs('test-index').returns(proxy)
    };
    this.tooltip.stub('isEnabled').returns(true);
    this.tooltip.stub('show').returns(false);
    this.layerCollection.stub('byName').withArgs('test-layer').returns(layer);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.equal(this.tooltip.show.lastCall.args[0], proxy);
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 10, y: 20, offset: 12 });
    assert.deepEqual(this.tooltip.show.lastCall.args[2], { target: proxy });
    assert.equal(this.tooltip.show.lastCall.args[3], undefined);
    assert.equal(typeof this.tooltip.show.lastCall.args[4], 'function');

    assert.ok(!done.called, 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of index', function(assert) {
    const done = sinon.spy();
    const layer = {
        getProxy: sinon.stub()
    };
    this.tooltip.stub('isEnabled').returns(true);
    this.layerCollection.stub('byName').withArgs('test-layer').returns(layer);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.strictEqual(this.tooltip.stub('show').lastCall, null, 'show');
    assert.strictEqual(this.tooltip.stub('move').lastCall, null, 'move');
    assert.ok(!done.called, 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of name', function(assert) {
    const done = sinon.spy();
    this.tooltip.stub('isEnabled').returns(true);
    this.layerCollection.stub('byName');

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.strictEqual(this.tooltip.stub('show').lastCall, null, 'show');
    assert.strictEqual(this.tooltip.stub('move').lastCall, null, 'move');
    assert.ok(!done.called, 'callback');
});

QUnit.test('Focus-on - tooltips is shown, async render', function(assert) {
    const done = sinon.spy();
    const proxy = { tag: 'proxy' };
    const layer = {
        getProxy: sinon.stub().withArgs('test-index').returns(proxy)
    };
    this.tooltip.stub('isEnabled').returns(true);
    this.tooltip.stub('show').returns(false);
    this.layerCollection.stub('byName').withArgs('test-layer').returns(layer);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.ok(!done.called, 'callback');
    this.tooltip.show.lastCall.args[4](true);
    assert.deepEqual(done.lastCall.args, [true], 'callback');
});

QUnit.test('Focus-on - tooltip is not shown because of tooltip.isEnabled', function(assert) {
    const done = sinon.spy();
    this.tooltip.stub('isEnabled').returns(false);

    this.trigger('focus-on', { x: 10, y: 20, data: { name: 'test-layer', index: 'test-index' }, done: done });

    assert.strictEqual(this.tooltip.stub('show').lastCall, null, 'show');
    assert.strictEqual(this.tooltip.stub('move').lastCall, null, 'move');
    assert.ok(!done.called, 'callback');
});

QUnit.test('Focus-move', function(assert) {
    this.trigger('focus-move', { x: 20, y: 30 });

    assert.deepEqual(this.tooltip.move.lastCall.args, [20, 30, 12], 'move');
});

QUnit.test('Focus-off', function(assert) {
    this.trigger('focus-off');

    assert.deepEqual(this.tooltip.hide.lastCall.args, [], 'hide');
});
