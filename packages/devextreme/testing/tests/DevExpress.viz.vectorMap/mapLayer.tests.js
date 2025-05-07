const $ = require('jquery');
const noop = require('core/utils/common').noop;
const mapLayerModule = require('viz/vector_map/map_layer');
const trackerModule = require('viz/vector_map/tracker');
const dataExchangerModule = require('viz/vector_map/data_exchanger');
let StubProjection;
let StubThemeManager;
let StubDataExchanger;
let StubTracker;
let stubSelectStrategy;
let StubMapLayerElement;
let StubProxy;
const projectionModule = require('viz/vector_map/projection.main');
const DataSource = require('common/data/data_source/data_source').DataSource;
const baseThemeManagerModule = require('viz/core/base_theme_manager');
const vizMocks = require('../../helpers/vizMocks.js');

QUnit.begin(function() {
    StubProjection = vizMocks.stubClass(projectionModule.Projection, {
        on: function() {
            return sinon.spy();
        }
    });
    StubThemeManager = vizMocks.stubClass(baseThemeManagerModule.BaseThemeManager, {
        theme: function() {
            return { label: {} };
        }
    });
    StubDataExchanger = vizMocks.stubClass(dataExchangerModule.DataExchanger);
    StubTracker = vizMocks.stubClass(trackerModule.Tracker);

    stubSelectStrategy = sinon.spy(function() {
        return {
            setup: sinon.spy(),
            reset: sinon.spy(),
            arrange: sinon.spy(),
            updateGrouping: sinon.spy(),
            type: 'test-type',
            elementType: 'test-element-type',
            fullType: 'test-full-type',
            getDefaultColor: sinon.stub()
        };
    });
    mapLayerModule._TESTS_stub_selectStrategy(stubSelectStrategy);

    StubMapLayerElement = vizMocks.stubClass(mapLayerModule._TESTS_MapLayerElement, null, {
        $constructor: function() {
            StubMapLayerElement.items.push(this);
            this.proxy = new StubProxy();
        }
    });
    mapLayerModule._TESTS_stub_MapLayerElement(StubMapLayerElement);

    StubProxy = vizMocks.stubClass(mapLayerModule._TESTS_createProxy());
});

QUnit.testStart(function() {
    stubSelectStrategy.resetHistory();
    StubMapLayerElement.items = [];
});

const baseEnvironment = {
    beforeEach: function() {
        this.widget = { tag: 'widget' };
        this.renderer = new vizMocks.Renderer();
        this.projection = new StubProjection();
        this.themeManager = new StubThemeManager();
        this.dataExchanger = new StubDataExchanger();
        this.tracker = new StubTracker();
        this.notifyDirty = sinon.spy();
        this.notifyReady = sinon.spy();
        this.eventTrigger = sinon.spy();
        this.container = new vizMocks.Element();
        this.layer = new mapLayerModule._TESTS_MapLayer({
            widget: this.widget,
            renderer: this.renderer,
            projection: this.projection,
            themeManager: this.themeManager,
            dataExchanger: this.dataExchanger,
            tracker: this.tracker,
            eventTrigger: this.eventTrigger,
            notifyDirty: this.notifyDirty,
            notifyReady: this.notifyReady,
            dataKey: 'test-data-key'
        }, this.container, 'test-layer', 4);
        this.context = this.layer.TESTS_getContext();
    },

    afterEach: function() {
        this.layer.dispose();
    }
};

QUnit.module('Basic', baseEnvironment);

QUnit.test('Construct', function(assert) {
    assert.strictEqual(this.projection.on.lastCall.args.length, 1, 'projection callbacks');
    assert.strictEqual(typeof this.projection.on.lastCall.args[0].engine, 'function', 'project callback');
    assert.strictEqual(typeof this.projection.on.lastCall.args[0].screen, 'function', 'transform callback');
    assert.strictEqual(typeof this.projection.on.lastCall.args[0].center, 'function', 'center callback');
    assert.strictEqual(typeof this.projection.on.lastCall.args[0].zoom, 'function', 'zoom callback');

    const root = this.renderer.g.firstCall.returnValue;
    assert.deepEqual(this.renderer.g.firstCall.args, [], 'root is created');
    assert.deepEqual(root.attr.lastCall.args, [{ 'class': 'dxm-layer' }], 'root settings');
    assert.deepEqual(root.linkOn.lastCall.args, [this.container, 'test-layer'], 'root is linked');
    assert.deepEqual(root.linkAppend.lastCall.args, [], 'root is appended');

    assert.ok(this.layer.proxy.name, 'proxy');

    // Only few context fields are checked - those of scalar type
    // Those of complex type will cause AV errors if missed
    assert.strictEqual(this.context.root, root, 'context root');
    assert.strictEqual(this.context.name, 'test-layer', 'context name');
    assert.strictEqual(this.context.dataKey, 'test-data-key', 'context dataKey');
});

QUnit.test('Dispose', function(assert) {
    this.context.labelRoot = new vizMocks.Element();
    this.context.str.reset = sinon.spy();
    this.context.grouping = { g1: 1, g2: 2 };
    this.layer.dispose();
    this.layer.dispose = noop; // To prevent failure on `afterEach`

    assert.deepEqual(this.projection.on.lastCall.returnValue.lastCall.args, [], 'projection callbacks');

    assert.deepEqual(this.context.root.linkOff.lastCall.args, [], 'root is unlinked');
    assert.deepEqual(this.context.root.linkRemove.lastCall.args, [], 'root is removed');

    assert.deepEqual(this.context.labelRoot.linkOff.lastCall.args, [], 'label root is unlinked');
    assert.deepEqual(this.context.labelRoot.linkRemove.lastCall.args, [], 'label root is removed');

    assert.deepEqual(this.context.str.reset.lastCall.args, [this.context], 'context is reset');

    assert.deepEqual(this.dataExchanger.set.getCall(0).args, ['test-layer', 'g1', null], 'grouping is reset 1');
    assert.deepEqual(this.dataExchanger.set.getCall(1).args, ['test-layer', 'g2', null], 'grouping is reset 2');
});

QUnit.test('dataSource creation', function(assert) {
    this.layer.setOptions({ dataSource: [{}] });

    assert.ok(this.layer.getDataSource(), 'getDataSource method is work');
    assert.ok(this.layer.getDataSource() instanceof DataSource);
    assert.deepEqual(this.layer.getDataSource().items(), [{}], 'data source items');
});

QUnit.test('dataSource disposing', function(assert) {
    this.layer.setOptions({ dataSource: [{}] });

    this.layer.dispose();
    this.layer.dispose = noop; // To prevent failure on `afterEach`

    assert.strictEqual(this.layer.getDataSource(), null);
});

QUnit.test('Set options with data', function(assert) {
    this.layer.setOptions({ dataSource: [{ test: 'test-data' }] });

    assert.deepEqual(this.layer.getDataSource().items(), [{ test: 'test-data' }], 'data source is updated');
    assert.deepEqual(this.themeManager.stub('theme').lastCall.args, ['layer:test-full-type'], 'options are updated');
    assert.deepEqual(this.notifyDirty.lastCall.args, [], 'notify dirty is called');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Set options with GeoJson data', function(assert) {
    this.layer.setOptions({ dataSource: { features: ['test-data'] } });

    assert.deepEqual(this.layer.getDataSource().items(), [{ features: ['test-data'] }], 'data source is updated');
    assert.deepEqual(this.themeManager.stub('theme').lastCall.args, ['layer:test-full-type'], 'options are updated');
    assert.deepEqual(this.notifyDirty.lastCall.args, [], 'notify dirty is called');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Set options with data when data is set', function(assert) {
    this.layer.setOptions({ dataSource: [{ test: 'test-data-1' }] });
    this.layer.setOptions({ dataSource: [{ test: 'test-data-2' }] });

    assert.deepEqual(this.layer.getDataSource().items(), [{ test: 'test-data-2' }], 'data source is updated');
});

QUnit.test('Set option with null data', function(assert) {
    this.layer.setOptions({ dataSource: null });

    assert.deepEqual(this.layer.getDataSource().items(), [], 'data source is updated');
});

QUnit.test('Set options without data', function(assert) {
    this.layer.setOptions({ tag: 'tag' });

    assert.strictEqual(this.layer.getDataSource(), null, 'data source is not updated');
    assert.strictEqual(this.themeManager.stub('theme').lastCall, null, 'options are not updated');
    assert.strictEqual(this.notifyDirty.lastCall, null, 'notify dirty is not called');
    assert.strictEqual(this.notifyReady.lastCall, null, 'notify ready is not called');
});

QUnit.test('Set option with data', function(assert) {
    const reset = this.context.str.reset = sinon.spy();
    const labelRoot = this.context.labelRoot = new vizMocks.Element();
    this.context.grouping = { g1: 1, g2: 2 };

    this.layer.setOptions({
        dataSource: {
            features: [{ geometry: {} }, { geometry: {} }, { geometry: {} }]
        }
    });

    const strategy = stubSelectStrategy.lastCall.returnValue;
    assert.deepEqual(reset.lastCall.args, [this.context], 'context is reset');
    assert.deepEqual(this.dataExchanger.set.getCall(0).args, ['test-layer', 'g1', null], 'grouping is reset 1');
    assert.deepEqual(this.dataExchanger.set.getCall(1).args, ['test-layer', 'g2', null], 'grouping is reset 2');
    assert.deepEqual(this.tracker.reset.lastCall.args, [], 'tracker is reset');
    assert.deepEqual(this.context.root.clear.lastCall.args, [], 'root is cleared');
    assert.deepEqual(labelRoot.clear.lastCall.args, [], 'label root is cleared');
    assert.strictEqual(stubSelectStrategy.lastCall.args.length, 2, 'strategy is selected');
    assert.deepEqual(strategy.setup.lastCall.args, [this.context], 'context is setup');
    assert.deepEqual(this.themeManager.theme.lastCall.args, ['layer:test-full-type'], 'theme manager is called');
    assert.strictEqual(StubMapLayerElement.items.length, 3, 'handles are created');
    assert.deepEqual(strategy.arrange.lastCall.args, [this.context, StubMapLayerElement.items], 'arrangement is performed');
    assert.deepEqual(strategy.updateGrouping.lastCall.args, [this.context], 'grouping is updated');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Set options with data, load error', function(assert) {
    const reset = this.context.str.reset = sinon.spy();
    const labelRoot = this.context.labelRoot = new vizMocks.Element();
    this.context.grouping = { g1: 1, g2: 2 };

    const DataSourceMock = vizMocks.stubClass(DataSource);
    const ds = new DataSourceMock();
    ds.store = sinon.stub().returns({ _loadMode: '' });
    this.layer.setOptions({
        dataSource: ds
    });

    assert.deepEqual(ds.on.getCall(1).args[0], 'loadError');

    ds.on.getCall(1).args[1]();

    const strategy = stubSelectStrategy.lastCall.returnValue;
    assert.deepEqual(reset.lastCall.args, [this.context], 'context is reset');
    assert.deepEqual(this.dataExchanger.set.getCall(0).args, ['test-layer', 'g1', null], 'grouping is reset 1');
    assert.deepEqual(this.dataExchanger.set.getCall(1).args, ['test-layer', 'g2', null], 'grouping is reset 2');
    assert.deepEqual(this.tracker.reset.lastCall.args, [], 'tracker is reset');
    assert.deepEqual(this.context.root.clear.lastCall.args, [], 'root is cleared');
    assert.deepEqual(labelRoot.clear.lastCall.args, [], 'label root is cleared');
    assert.strictEqual(stubSelectStrategy.lastCall.args.length, 2, 'strategy is selected');
    assert.deepEqual(strategy.setup.lastCall.args, [this.context], 'context is setup');
    assert.deepEqual(this.themeManager.theme.lastCall.args, ['layer:test-full-type'], 'theme manager is called');
    assert.strictEqual(StubMapLayerElement.items.length, 0, 'handles are not created');
    assert.deepEqual(strategy.arrange.lastCall.args, [this.context, StubMapLayerElement.items], 'arrangement is performed');
    assert.deepEqual(strategy.updateGrouping.lastCall.args, [this.context], 'grouping is updated');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Set options when data is set', function(assert) {
    this.layer.setOptions({
        dataSource: {
            features: [{ geometry: {} }, { geometry: {} }, { geometry: {} }]
        }
    });
    this.context.grouping = { g1: 1, g2: 2 };
    this.tracker.reset.resetHistory();

    const strategy = stubSelectStrategy.lastCall.returnValue;
    stubSelectStrategy.resetHistory();
    strategy.reset.resetHistory();
    strategy.setup.resetHistory();
    strategy.arrange.resetHistory();
    strategy.updateGrouping.resetHistory();
    const items = StubMapLayerElement.items;
    StubMapLayerElement.items = [];
    this.context.root.clear.resetHistory();
    const labelRoot = this.context.labelRoot = new vizMocks.Element();
    this.themeManager.theme.resetHistory();

    this.layer.setOptions({ tag: 'tag' });

    assert.strictEqual(strategy.reset.lastCall, null, 'context is not reset');
    assert.deepEqual(this.dataExchanger.set.getCall(0).args, ['test-layer', 'g1', null], 'grouping is reset 1');
    assert.deepEqual(this.dataExchanger.set.getCall(1).args, ['test-layer', 'g2', null], 'grouping is reset 2');
    assert.strictEqual(this.tracker.reset.lastCall, null, 'tracker is not reset');
    assert.strictEqual(this.context.root.clear.lastCall, null, 'root is not cleared');
    assert.strictEqual(labelRoot.stub('clear').lastCall, null, 'label root is not cleared');
    assert.strictEqual(stubSelectStrategy.lastCall, null, 'strategy is not selected');
    assert.strictEqual(strategy.setup.lastCall, null, 'context is not setup');
    assert.deepEqual(this.themeManager.theme.lastCall.args, ['layer:test-full-type'], 'theme manager is called');
    assert.strictEqual(StubMapLayerElement.items.length, 0, 'handles are not created');
    assert.deepEqual(strategy.arrange.lastCall.args, [this.context, items], 'arrangement is performed');
    assert.deepEqual(strategy.updateGrouping.lastCall.args, [this.context], 'grouping is updated');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Set options when data is set and type is changed', function(assert) {
    this.layer.setOptions({
        dataSource: {
            features: [{ geometry: {} }, { geometry: {} }, { geometry: {} }]
        }
    });

    this.tracker.reset.resetHistory();
    let strategy = stubSelectStrategy.lastCall.returnValue;
    stubSelectStrategy.resetHistory();
    strategy.reset.resetHistory();
    strategy.setup.resetHistory();
    strategy.arrange.resetHistory();
    strategy.updateGrouping.resetHistory();
    StubMapLayerElement.items = [];
    this.context.root.clear.resetHistory();
    const labelRoot = this.context.labelRoot = new vizMocks.Element();
    this.themeManager.theme.resetHistory();

    this.layer.setOptions({ tag: 'tag', type: 'test-type-2' });

    assert.deepEqual(strategy.reset.lastCall.args, [this.context], 'context is reset');
    assert.deepEqual(this.tracker.reset.lastCall.args, [], 'tracker is reset');
    assert.deepEqual(this.context.root.clear.lastCall.args, [], 'root is cleared');
    assert.deepEqual(labelRoot.clear.lastCall.args, [], 'label root is cleared');
    assert.strictEqual(stubSelectStrategy.lastCall.args.length, 2, 'strategy is selected');
    strategy = stubSelectStrategy.lastCall.returnValue;
    assert.deepEqual(strategy.setup.lastCall.args, [this.context], 'context is setup');
    assert.deepEqual(this.themeManager.theme.lastCall.args, ['layer:test-full-type'], 'theme manager is called');
    assert.strictEqual(StubMapLayerElement.items.length, 3, 'handles are created');
    assert.deepEqual(strategy.arrange.lastCall.args, [this.context, StubMapLayerElement.items], 'arrangement is performed');
    assert.deepEqual(strategy.updateGrouping.lastCall.args, [this.context], 'grouping is updated');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Set options when data is set and element type is changed', function(assert) {
    this.layer.setOptions({
        dataSource: {
            features: [{ geometry: {} }, { geometry: {} }, { geometry: {} }]
        }
    });

    this.tracker.reset.resetHistory();
    let strategy = stubSelectStrategy.lastCall.returnValue;
    stubSelectStrategy.resetHistory();
    strategy.reset.resetHistory();
    strategy.setup.resetHistory();
    strategy.arrange.resetHistory();
    strategy.updateGrouping.resetHistory();
    StubMapLayerElement.items = [];
    this.context.root.clear.resetHistory();
    const labelRoot = this.context.labelRoot = new vizMocks.Element();
    this.themeManager.theme.resetHistory();

    this.layer.setOptions({ tag: 'tag', elementType: 'test-element-type-2' });

    assert.deepEqual(strategy.reset.lastCall.args, [this.context], 'context is reset');
    assert.deepEqual(this.tracker.reset.lastCall.args, [], 'tracker is reset');
    assert.deepEqual(this.context.root.clear.lastCall.args, [], 'root is cleared');
    assert.deepEqual(labelRoot.clear.lastCall.args, [], 'label root is cleared');
    assert.strictEqual(stubSelectStrategy.lastCall.args.length, 2, 'strategy is selected');
    strategy = stubSelectStrategy.lastCall.returnValue;
    assert.deepEqual(strategy.setup.lastCall.args, [this.context], 'context is setup');
    assert.deepEqual(this.themeManager.theme.lastCall.args, ['layer:test-full-type'], 'theme manager is called');
    assert.strictEqual(StubMapLayerElement.items.length, 3, 'handles are created');
    assert.deepEqual(strategy.arrange.lastCall.args, [this.context, StubMapLayerElement.items], 'arrangement is performed');
    assert.deepEqual(strategy.updateGrouping.lastCall.args, [this.context], 'grouping is updated');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Set options with same data when data is set', function(assert) {
    const ds = {
        features: [{ geometry: {} }, { geometry: {} }, { geometry: {} }]
    };
    this.layer.setOptions({
        dataSource: ds
    });
    this.context.grouping = { g1: 1, g2: 2 };
    this.tracker.reset.resetHistory();

    const strategy = stubSelectStrategy.lastCall.returnValue;
    stubSelectStrategy.resetHistory();
    strategy.reset.resetHistory();
    strategy.setup.resetHistory();
    strategy.arrange.resetHistory();
    strategy.updateGrouping.resetHistory();
    const items = StubMapLayerElement.items;
    StubMapLayerElement.items = [];
    this.context.root.clear.resetHistory();
    const labelRoot = this.context.labelRoot = new vizMocks.Element();
    this.themeManager.theme.resetHistory();

    this.layer.setOptions({ dataSource: ds });

    assert.strictEqual(strategy.reset.lastCall, null, 'context is not reset');
    assert.deepEqual(this.dataExchanger.set.getCall(0).args, ['test-layer', 'g1', null], 'grouping is reset 1');
    assert.deepEqual(this.dataExchanger.set.getCall(1).args, ['test-layer', 'g2', null], 'grouping is reset 2');
    assert.strictEqual(this.tracker.reset.lastCall, null, 'tracker is not reset');
    assert.strictEqual(this.context.root.clear.lastCall, null, 'root is not cleared');
    assert.strictEqual(labelRoot.stub('clear').lastCall, null, 'label root is not cleared');
    assert.strictEqual(stubSelectStrategy.lastCall, null, 'strategy is not selected');
    assert.strictEqual(strategy.setup.lastCall, null, 'context is not setup');
    assert.deepEqual(this.themeManager.theme.lastCall.args, ['layer:test-full-type'], 'theme manager is called');
    assert.strictEqual(StubMapLayerElement.items.length, 0, 'handles are not created');
    assert.deepEqual(strategy.arrange.lastCall.args, [this.context, items], 'arrangement is performed');
    assert.deepEqual(strategy.updateGrouping.lastCall.args, [this.context], 'grouping is updated');
    assert.deepEqual(this.notifyReady.lastCall.args, [], 'notify ready is called');
});

QUnit.test('Empty strategy case (when data is empty)', function(assert) {
    this.layer.setOptions({
        dataSource: {
            features: []
        }
    });
    this.themeManager.theme = noop;

    assert.ok(true, 'no errors');
});

QUnit.test('Dispose when data is set', function(assert) {
    this.layer.setOptions({
        dataSource: {
            features: [{ geometry: {} }, { geometry: {} }, { geometry: {} }]
        }
    });

    this.layer.dispose();
    this.layer.dispose = noop; // To prevent failure on `afterEach`

    $.each(StubMapLayerElement.items, function(i, item) {
        assert.deepEqual(item.dispose.lastCall.args, [], 'disposed - ' + i);
    });
});

QUnit.test('Proxy - fields', function(assert) {
    this.layer.setOptions({
        dataSource: {
            features: [{ geometry: {} }, { geometry: {} }, { geometry: {} }]
        }
    });

    const proxy = this.layer.proxy;

    assert.strictEqual(proxy.index, 4, 'index');
    assert.strictEqual(proxy.name, 'test-layer', 'name');
    assert.strictEqual(proxy.type, 'test-type', 'type');
    assert.strictEqual(proxy.elementType, 'test-element-type', 'element type');
});

QUnit.test('Proxy - get elements', function(assert) {
    const obj = { tag: 'obj' };
    const stub = sinon.stub(this.layer, 'getProxies').returns(obj);

    assert.strictEqual(this.layer.proxy.getElements(), obj, 'return value');
    assert.deepEqual(stub.lastCall.args, [], 'inner method is called');
});

QUnit.test('Proxy - clear selection', function(assert) {
    const arg = { tag: 'arg' };
    const spy = sinon.spy(this.layer, 'clearSelection');

    assert.strictEqual(this.layer.proxy.clearSelection(arg), this.layer.proxy, 'return value');
    assert.deepEqual(spy.lastCall.args, [arg], 'inner method is called');
});

const environmentWithData = {
    beforeEach: function() {
        baseEnvironment.beforeEach.apply(this, arguments);
        this.data = {
            features: $.map([0, 1, 2, 3, 4], function(val) {
                return {
                    properties: 'prop-' + val,
                    geometry: 'geometry-' + val
                };
            })
        };
    },

    afterEach: baseEnvironment.afterEach,
};

QUnit.module('Elements', environmentWithData);

QUnit.test('Create', function(assert) {
    const data = this.data;
    const context = this.context;

    this.layer.setOptions({ dataSource: this.data });

    assert.strictEqual(StubMapLayerElement.items.length, data.features.length, 'count');
    $.each(StubMapLayerElement.items, function(i, item) {
        assert.deepEqual(item.ctorArgs, [context, i, data.features[i].geometry, data.features[i].properties], 'parameters - ' + i);
        assert.deepEqual(item.project.lastCall.args, [], 'project - ' + i);
        assert.deepEqual(item.draw.lastCall.args, [], 'draw - ' + i);
        assert.deepEqual(item.transform.lastCall.args, [], 'transform - ' + i);
        assert.strictEqual(item.stub('restoreSelected').lastCall, null, 'restoreSelected (not called) - ' + i);
        assert.deepEqual(item.refresh.lastCall.args, [], 'refresh - ' + i);
        assert.strictEqual(item.stub('measureLabel').lastCall, null, 'measureLabel (not called) ' + i);
        assert.strictEqual(item.stub('adjustLabel').lastCall, null, 'adjustLabel (not called) ' + i);
    });
});

QUnit.test('Create with labels', function(assert) {
    this.layer.setOptions({ label: { enabled: true }, dataSource: this.data });

    assert.strictEqual(StubMapLayerElement.items.length, this.data.features.length, 'count');
    $.each(StubMapLayerElement.items, function(i, item) {
        assert.deepEqual(item.refresh.lastCall.args, [], 'refresh - ' + i);
        assert.deepEqual(item.measureLabel.lastCall.args, [], 'measureLabel ' + i);
        assert.deepEqual(item.adjustLabel.lastCall.args, [], 'adjustLabel ' + i);
    });
});

QUnit.test('Create with reset', function(assert) {
    const context = this.context;
    this.layer.setOptions({ dataSource: this.data });
    const items = StubMapLayerElement.items;
    StubMapLayerElement.items = [];
    const data = { features: this.data.features.slice(0, 3).reverse() };
    this.layer.setOptions({ dataSource: data });

    assert.strictEqual(StubMapLayerElement.items.length, data.features.length, 'count');
    $.each(items, function(i, item) {
        assert.deepEqual(item.dispose.lastCall.args, [], 'dispose - ' + i);
    });
    $.each(StubMapLayerElement.items, function(i, item) {
        assert.deepEqual(item.ctorArgs, [context, i, data.features[i].geometry, data.features[i].properties], 'parameters - ' + i);
    });
});

QUnit.test('Create with customization', function(assert) {
    const customize = sinon.spy();
    this.layer.setOptions({ customize: customize, dataSource: this.data });
    const proxies = $.map(StubMapLayerElement.items, function(item) { return item.proxy; });

    assert.deepEqual(customize.lastCall.args, [proxies], 'callback args');
    assert.strictEqual(customize.lastCall.thisValue, this.widget, 'callback context');
    $.each(StubMapLayerElement.items, function(i, item) {
        assert.ok(customize.calledBefore(item.project.lastCall), 'callback is called before item - ' + i);
    });
});

QUnit.test('Selection restoring', function(assert) {
    const context = this.context;
    this.layer.setOptions({
        customize: function() {
            $.each(StubMapLayerElement.items, function(i, item) {
                if(i % 2) {
                    context.selection.state[i] = item;
                }
            });
        },
        dataSource: this.data
    });

    $.each(StubMapLayerElement.items, function(i, item) {
        if(i % 2) {
            assert.deepEqual(item.restoreSelected.lastCall.args, [], 'item - ' + i);
        } else {
            assert.strictEqual(item.stub('restoreSelected').lastCall, null, 'item - ' + i);
        }
    });
});

QUnit.test('Update', function(assert) {
    this.layer.setOptions({ dataSource: this.data });
    $.each(StubMapLayerElement.items, function(i, item) {
        item.project.resetHistory();
        item.draw.resetHistory();
        item.transform.resetHistory();
        item.refresh.resetHistory();
    });
    this.layer.setOptions({ tag: 'option' });

    assert.strictEqual(StubMapLayerElement.items.length, this.data.features.length, 'new items are not created');
    $.each(StubMapLayerElement.items, function(i, item) {
        assert.strictEqual(item.project.lastCall, null, 'project - ' + i);
        assert.strictEqual(item.draw.lastCall, null, 'draw - ' + i);
        assert.strictEqual(item.transform.lastCall, null, 'transform - ' + i);
        assert.deepEqual(item.refresh.lastCall.args, [], 'refresh - ' + i);
    });
});

QUnit.test('Simple data source', function(assert) {
    const context = this.context;
    const data = $.map([0, 1, 2, 3, 4], function(val) {
        return { coordinates: 'coordinates-' + val, attributes: 'attributes-' + val };
    });
    this.layer.setOptions({ dataSource: data });

    assert.strictEqual(StubMapLayerElement.items.length, data.length, 'count');
    $.each(StubMapLayerElement.items, function(i, item) {
        assert.deepEqual(item.ctorArgs, [context, i, { coordinates: data[i].coordinates }, data[i].attributes], 'parameters - ' + i);
    });
});

QUnit.module('Methods and callbacks', {
    beforeEach: function() {
        environmentWithData.beforeEach.apply(this, arguments);
        this.layer.setOptions({ dataSource: this.data });
        this.items = StubMapLayerElement.items;
        $.each(this.items, function(_, item) {
            item.project.resetHistory();
            item.draw.resetHistory();
            item.transform.resetHistory();
            item.refresh.resetHistory();
        });
    },

    afterEach: environmentWithData.afterEach
});

QUnit.test('Projection.engine', function(assert) {
    this.projection.on.lastCall.args[0].engine();

    $.each(this.items, function(i, item) {
        assert.deepEqual(item.project.lastCall.args, [], 'project - ' + i);
    });
});

QUnit.test('Projection.screen', function(assert) {
    const context = this.context;
    const transform = { tag: 'transform' };
    context.labelRoot = new vizMocks.Element();
    this.projection.stub('getTransform').returns(transform);

    this.projection.on.lastCall.args[0].screen();

    assert.deepEqual(this.projection.getTransform.lastCall.args, [], 'projection is called');
    assert.deepEqual(context.root.attr.lastCall.args, [transform], 'root is transformed');
    assert.deepEqual(context.labelRoot.attr.lastCall.args, [transform], 'label root is transformed');
    $.each(this.items, function(i, item) {
        assert.deepEqual(item.transform.lastCall.args, [], 'transform - ' + i);
    });
});

QUnit.test('Projection.center', function(assert) {
    const context = this.context;
    const transform = { tag: 'transform' };
    context.labelRoot = new vizMocks.Element();
    this.projection.stub('getTransform').returns(transform);

    this.projection.on.lastCall.args[0].center();

    assert.deepEqual(this.projection.getTransform.lastCall.args, [], 'projection is called');
    assert.deepEqual(context.root.attr.lastCall.args, [transform], 'root is transformed');
    assert.deepEqual(context.labelRoot.attr.lastCall.args, [transform], 'label root is transformed');
});

QUnit.test('Projection.zoom', function(assert) {
    const context = this.context;
    const transform = { tag: 'transform' };
    context.labelRoot = new vizMocks.Element();
    this.projection.stub('getTransform').returns(transform);

    this.projection.on.lastCall.args[0].zoom();

    assert.deepEqual(this.projection.getTransform.lastCall.args, [], 'projection is called');
    assert.deepEqual(context.root.attr.lastCall.args, [transform], 'root is transformed');
    assert.deepEqual(context.labelRoot.attr.lastCall.args, [transform], 'label root is transformed');
    $.each(this.items, function(i, item) {
        assert.deepEqual(item.transform.lastCall.args, [], 'transform - ' + i);
    });
});

QUnit.test('Apply transform on setOptions', function(assert) {
    const context = this.context;
    const transform = { tag: 'transform' };
    this.projection.stub('getTransform').returns(transform);

    this.layer.setOptions();

    assert.deepEqual(this.projection.getTransform.lastCall.args, [], 'projection is called');
    assert.deepEqual(context.root.attr.lastCall.args, [transform], 'root is transformed');
});

QUnit.test('getProxies', function(assert) {
    assert.deepEqual(this.layer.getProxies(), $.map(this.items, function(item) { return item.proxy; }));
});

QUnit.test('getProxy', function(assert) {
    assert.strictEqual(this.layer.getProxy(3), this.items[3].proxy);
});

QUnit.test('raiseClick', function(assert) {
    const event = { tag: 'event' };

    this.layer.raiseClick(2, event);

    assert.deepEqual(this.eventTrigger.lastCall.args, ['click', { target: this.items[2].proxy, event: event }]);
});

QUnit.test('hoverItem', function(assert) {
    this.layer.hoverItem(3, 'a');

    assert.deepEqual(this.items[3].setHovered.lastCall.args, ['a']);
});

QUnit.test('selectItem', function(assert) {
    this.layer.selectItem(4, 'b', 'c');

    assert.deepEqual(this.items[4].setSelected.lastCall.args, ['b', 'c']);
});

QUnit.test('clearSelection', function(assert) {
    this.context.selection.state = { '1': this.items[1], '2': this.items[2] };

    this.layer.clearSelection('a');

    assert.deepEqual(this.items[1].setSelected.lastCall.args, [false]);
    assert.deepEqual(this.items[2].setSelected.lastCall.args, [false]);
});

QUnit.module('Options', {
    beforeEach: function() {
        environmentWithData.beforeEach.apply(this, arguments);
        this.layer.setOptions({ dataSource: this.data });
    },

    afterEach: environmentWithData.afterEach
});

QUnit.test('Labels group', function(assert) {
    const context = this.context;
    const strategy = stubSelectStrategy.lastCall.returnValue;
    this.projection.stub('getTransform').returns({ tag: 'transform' });
    this.renderer.g.resetHistory();

    strategy.hasLabelsGroup = false;
    this.layer.setOptions();
    assert.strictEqual(context.hasSeparateLabel, false, 'state - 1');
    assert.strictEqual(this.renderer.g.lastCall, null, 'group is not created - 1');

    this.layer.setOptions({ label: { enabled: true } });
    assert.strictEqual(context.hasSeparateLabel, false, 'state - 2');
    assert.strictEqual(this.renderer.g.lastCall, null, 'group is not created - 2');

    strategy.hasLabelsGroup = true;
    this.layer.setOptions({ label: { enabled: true } });
    assert.strictEqual(context.hasSeparateLabel, true, 'state - 3');
    assert.deepEqual(this.renderer.g.lastCall.args, [], 'group is created - 3');
    const labelGroup = this.renderer.g.lastCall.returnValue;
    assert.deepEqual(labelGroup.attr.getCall(0).args, [{ 'class': 'dxm-layer-labels' }], 'group settings');
    assert.deepEqual(labelGroup.attr.getCall(1).args, [{ tag: 'transform' }], 'group transform');
    assert.deepEqual(labelGroup.linkOn.lastCall.args, [this.container, { name: 'test-layer-labels', after: 'test-layer' }], 'group is linked');
    assert.deepEqual(labelGroup.linkAppend.lastCall.args, [], 'group is appended');

    this.renderer.g.resetHistory();
    this.layer.setOptions({ label: { enabled: false } });
    assert.strictEqual(context.hasSeparateLabel, false, 'state - 4');
    assert.strictEqual(this.renderer.g.lastCall, null, 'group is not created - 4');
    assert.deepEqual(labelGroup.linkOff.lastCall.args, [], 'group is unlinked');
    assert.deepEqual(labelGroup.linkRemove.lastCall.args, [], 'group is removed');
});

QUnit.test('Hover', function(assert) {
    this.layer.setOptions();
    assert.strictEqual(this.context.hover, true, 'state - 1');

    this.layer.setOptions({ hoverEnabled: 0 });
    assert.strictEqual(this.context.hover, false, 'state - 2');

    this.layer.setOptions({ hoverEnabled: 1 });
    assert.strictEqual(this.context.hover, true, 'state - 3');
});

QUnit.test('Selection', function(assert) {
    this.layer.setOptions();
    assert.deepEqual(this.context.selection, { state: {}, single: -1 }, 'state - 1');

    this.layer.setOptions({ selectionMode: 'multiple' });
    assert.deepEqual(this.context.selection, { state: {}, single: NaN }, 'state - 2');

    this.layer.setOptions({ selectionMode: 'none' });
    assert.strictEqual(this.context.selection, null, 'state - 3');

    this.layer.setOptions({ selectionMode: 'single' });
    assert.deepEqual(this.context.selection, { state: {}, single: -1 }, 'state - 4');
});

QUnit.test('Reset selection', function(assert) {
    const items = StubMapLayerElement.items;
    this.context.selection.state = { 1: items[1], 2: items[2] };

    this.layer.setOptions();

    assert.deepEqual(items[1].resetSelected.lastCall.args, []);
    assert.deepEqual(items[2].resetSelected.lastCall.args, []);
});

QUnit.test('Merging', function(assert) {
    stubSelectStrategy.lastCall.returnValue.fullType = 'test-type-1';
    this.themeManager.theme = sinon.stub().returns({
        t1: 't1', t2: 't2',
        label: {
            t3: 't3', t4: 't4',
            font: {
                t5: 't5'
            }
        }
    });
    this.layer.setOptions({
        t2: 'T2', r1: 'r1', r2: 'r2',
        label: {
            t4: 'T4', r3: 'r3', r4: 'r4',
            font: {
                t5: 'T5', r5: 'r5'
            }
        }
    });

    assert.deepEqual(this.context.settings, {
        t1: 't1', t2: 'T2', r1: 'r1', r2: 'r2',
        label: {
            t3: 't3', t4: 'T4', r3: 'r3', r4: 'r4',
            font: {
                t5: 'T5', r5: 'r5'
            }
        }
    }, 'settings');
    assert.deepEqual(this.themeManager.theme.lastCall.args, ['layer:test-type-1'], 'theme manager is called');
});

QUnit.test('Palette', function(assert) {
    const palette = { getColor: sinon.stub() };
    palette.getColor.onCall(0).returns('A');
    palette.getColor.onCall(1).returns('B');
    palette.getColor.onCall(2).returns('C');
    palette.getColor.onCall(3).returns('D');
    this.themeManager.stub('createDiscretePalette').returns(palette);

    this.layer.setOptions({ paletteSize: 4, palette: 'test-palette' });

    assert.deepEqual(this.themeManager.createDiscretePalette.lastCall.args, ['test-palette', 4], 'palette is created');
    assert.strictEqual(palette.getColor.callCount, 4, 'color is get');
    assert.deepEqual(this.context.settings._colors, ['A', 'B', 'C', 'D'], 'colors');
});

QUnit.test('Color is not specified - take strategy\'s default color', function(assert) {
    stubSelectStrategy.lastCall.returnValue.fullType = 'test-type-1';
    stubSelectStrategy.lastCall.returnValue.getDefaultColor.returns('default color');

    this.layer.setOptions({
        palette: 'test-palette'
    });

    assert.deepEqual(this.context.settings, {
        color: 'default color',
        label: {
            font: {}
        },
        palette: 'test-palette'
    }, 'settings');
    assert.deepEqual(stubSelectStrategy.lastCall.returnValue.getDefaultColor.lastCall.args, [this.context, 'test-palette']);
});

QUnit.test('Color is specified - take specified color', function(assert) {
    stubSelectStrategy.lastCall.returnValue.fullType = 'test-type-1';
    stubSelectStrategy.lastCall.returnValue.getDefaultColor.returns('default color');

    this.layer.setOptions({
        palette: 'test-palette',
        color: 'specific color'
    });

    assert.deepEqual(this.context.settings, {
        color: 'specific color',
        label: {
            font: {}
        },
        palette: 'test-palette'
    }, 'settings');
    assert.equal(stubSelectStrategy.lastCall.returnValue.getDefaultColor.called, true);
});

QUnit.test('Color specified in theme - take theme\'s color', function(assert) {
    stubSelectStrategy.lastCall.returnValue.fullType = 'test-type-1';
    stubSelectStrategy.lastCall.returnValue.getDefaultColor.returns('default color');
    this.themeManager.theme = sinon.stub().returns({
        color: 'theme color'
    });

    this.layer.setOptions({
        palette: 'test-palette'
    });

    assert.deepEqual(this.context.settings, {
        color: 'theme color',
        label: {
            font: {}
        },
        palette: 'test-palette'
    }, 'settings');
    assert.deepEqual(stubSelectStrategy.lastCall.returnValue.getDefaultColor.lastCall.args, [this.context, 'test-palette']);
});
