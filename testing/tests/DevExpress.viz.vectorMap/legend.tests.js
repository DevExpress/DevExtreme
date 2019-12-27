const $ = require('jquery');
const noop = require('core/utils/common').noop;
const vizMocks = require('../../helpers/vizMocks.js');
const coreLegendModule = require('viz/components/legend');
const legendModule = require('viz/vector_map/legend');
const ThemeManager = vizMocks.stubClass(require('viz/components/chart_theme_manager').ThemeManager);

QUnit.module('Legend', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.container = new vizMocks.Element();
        this.addItem = sinon.stub();
        this.removeItem = sinon.stub();
        this.bind = sinon.spy();
        this.unbind = sinon.spy();
        this.notifyDirty = sinon.spy();
        this.notifyReady = sinon.spy();
        this.themeManager = new ThemeManager();

        this.themeManager.stub('theme').withArgs('legend').returns({
            title: {}
        });
        this.legend = new legendModule._TESTS_Legend({
            renderer: this.renderer,
            container: this.container,
            layoutControl: {
                addItem: this.addItem,
                removeItem: this.removeItem
            },
            dataExchanger: {
                bind: this.bind,
                unbind: this.unbind
            },
            notifyDirty: this.notifyDirty,
            notifyReady: this.notifyReady,
            themeManager: this.themeManager,
            widget: {
                _getTemplate: function(f) {
                    this.template = {
                        render: function(arg) {
                            return f(arg.model, arg.container);
                        }
                    };
                    return this.template;
                }
            }
        });
        this.updateLayout = this.legend.updateLayout = sinon.spy($.proxy(function() {
            this.legend.draw(50, 50);
        }, this));
        this.options = {
            visible: true,
            margin: 8,
            markerSize: 14,
            font: {
                color: '#7F7F7F',
                family: 'Helvetica',
                size: 14
            },
            border: {
                visible: false
            },
            title: {},
            position: 'outside',
            paddingLeftRight: 10,
            paddingTopBottom: 10,
            columnItemSpacing: 8,
            rowItemSpacing: 8,
            hoverMode: 'includePoints',

            source: { layer: 'test-source', grouping: 'test-field' }
        };
    },

    afterEach: function() {
        this.legend.dispose();
    },

    updateData: function(values, partition, color) {
        this.bind.lastCall.args[2]({ partition: partition || [], values: values, defaultColor: color });
    }
});

QUnit.test('instance type', function(assert) {
    assert.ok(this.legend instanceof legendModule._TESTS_Legend);
    assert.ok(this.legend instanceof coreLegendModule.Legend);
});

QUnit.test('creation', function(assert) {
    const root = this.renderer.g.lastCall.returnValue;
    assert.deepEqual(root.attr.lastCall.args, [{ 'class': 'dxm-legend' }], 'settings');
    assert.deepEqual(root.linkOn.lastCall.args, [this.container, { name: 'legend', after: 'legend-base' }], 'root is linked to container');
    assert.deepEqual(root.linkAppend.lastCall.args, [], 'root is appended');
    assert.deepEqual(this.addItem.lastCall.args, [this.legend], 'added to layout');
});

QUnit.test('disposing', function(assert) {
    this.legend.dispose();
    this.legend.dispose = noop; // To prevent exception on teardown

    assert.deepEqual(this.removeItem.lastCall.args, [this.legend], 'removed from layout');
    assert.strictEqual(this.unbind.lastCall, null, 'unbind');
    assert.deepEqual(this.renderer.g.lastCall.returnValue.linkRemove.lastCall.args, [], 'root is removed');
    assert.deepEqual(this.renderer.g.lastCall.returnValue.linkOff.lastCall.args, [], 'root is unlinked');
});

QUnit.test('disposing / with unbinding', function(assert) {
    this.legend.setOptions(this.options).dispose();
    this.legend.dispose = noop; // To prevent exception on teardown

    assert.deepEqual(this.removeItem.lastCall.args, [this.legend], 'removed from layout');
    assert.deepEqual(this.unbind.lastCall.args, ['test-source', 'test-field', this.bind.lastCall.args[2]], 'unbind');
});

QUnit.test('setOptions', function(assert) {
    this.legend.setOptions(this.options);

    assert.deepEqual(this.bind.lastCall.args, ['test-source', 'test-field', this.bind.lastCall.args[2]], 'bind');
    assert.deepEqual(this.updateLayout.lastCall.args, [], 'layout');
});

QUnit.test('setOptions / reset', function(assert) {
    this.legend.setOptions(this.options);
    this.options.source = { layer: 'test-source-2', grouping: 'test-field-2' };

    this.legend.setOptions(this.options);

    assert.deepEqual(this.unbind.lastCall.args, ['test-source', 'test-field', this.bind.lastCall.args[2]], 'unbind');
    assert.deepEqual(this.bind.lastCall.args, ['test-source-2', 'test-field-2', this.bind.lastCall.args[2]], 'bind');
});

QUnit.test('data callback', function(assert) {
    this.legend.setOptions(this.options);

    this.updateData([1, 2, 3]);

    assert.strictEqual(this.renderer.rect.callCount, 3, 'items');
    assert.deepEqual(this.updateLayout.lastCall.args, [], 'layout');
});

QUnit.test('Pass default layer color for markers', function(assert) {
    this.legend.setOptions(this.options);

    this.updateData([1, 2], [], 'default color');

    assert.strictEqual(this.renderer.rect.getCall(0).returnValue.attr.getCall(0).args[0].fill, 'default color');
    assert.strictEqual(this.renderer.rect.getCall(1).returnValue.attr.getCall(0).args[0].fill, 'default color');
});

QUnit.test('customizeText format object', function(assert) {
    const spy = this.options.customizeText = sinon.spy();
    this.legend.setOptions(this.options);

    this.updateData([10, 20, 30], [1, 2, 3, 4]);

    assert.strictEqual(spy.callCount, 3, 'call count');
    assert.deepEqual(spy.getCall(0).args, [{ start: 1, end: 2, index: 0, visible: true, 'test-field': 10, marker: { size: 14, state: 'normal', opacity: 1 }, states: { normal: { fill: undefined, state: 'normal', opacity: 1 }, selection: undefined, hover: undefined }, size: 14 }], 'item 1');
    assert.deepEqual(spy.getCall(1).args, [{ start: 2, end: 3, index: 1, visible: true, 'test-field': 20, marker: { size: 14, state: 'normal', opacity: 1 }, states: { normal: { fill: undefined, state: 'normal', opacity: 1 }, selection: undefined, hover: undefined }, size: 14 }], 'item 2');
    assert.deepEqual(spy.getCall(2).args, [{ start: 3, end: 4, index: 2, visible: true, 'test-field': 30, marker: { size: 14, state: 'normal', opacity: 1 }, states: { normal: { fill: undefined, state: 'normal', opacity: 1 }, selection: undefined, hover: undefined }, size: 14 }], 'item 3');
});

QUnit.test('default marker shapes', function(assert) {
    this.legend.setOptions(this.options);

    this.updateData([1, 2, 3]);

    assert.strictEqual(this.renderer.stub('rect').callCount, 3);
});

QUnit.test('circle marker shapes', function(assert) {
    this.options.markerShape = 'circle';
    this.legend.setOptions(this.options);

    this.updateData([1, 2, 3]);

    assert.strictEqual(this.renderer.circle.callCount, 3);
});

QUnit.test('resize', function(assert) {
    this.legend.setOptions(this.options);
    this.updateData([1, 2, 3]);

    this.legend.resize({ width: 300, height: 100 });

    assert.strictEqual(this.renderer.g.callCount, 18, 'redrawn');
    assert.strictEqual(this.notifyDirty.callCount, 1, 'notify dirty');
    assert.strictEqual(this.notifyReady.callCount, 1, 'notify ready');
});

QUnit.test('resize / hide', function(assert) {
    this.legend.setOptions(this.options);
    this.updateData([1, 2, 3]);

    this.legend.resize(null);

    assert.strictEqual(this.renderer.g.firstCall.returnValue.children.length, 0, 'elements are cleared');
    assert.strictEqual(this.notifyDirty.callCount, 1, 'notify dirty');
    assert.strictEqual(this.notifyReady.callCount, 1, 'notify ready');
});

QUnit.test('resize / when size is not set', function(assert) {
    this.legend.resize({ width: 100, height: 50 });
    assert.ok(true, 'no errors');
});

var StubLegend = vizMocks.stubClass(legendModule._TESTS_Legend, null, {
    $constructor: function() {
        StubLegend.items.push(this);
    }
});

QUnit.module('LegendsControl', {
    beforeEach: function() {
        legendModule._TESTS_stubLegendType(StubLegend);
        StubLegend.items = [];
        this.theme = sinon.stub();
        this.parameters = {
            container: new vizMocks.Element(),
            themeManager: { theme: this.theme },
            layoutControl: {
                suspend: sinon.spy(),
                resume: sinon.spy()
            }
        };
        this.legendsControl = new legendModule.LegendsControl(this.parameters);
    },

    afterEach: function() {
        legendModule._TESTS_restoreLegendType();
        this.legendsControl.dispose();
    }
});

QUnit.test('instance type', function(assert) {
    assert.ok(this.legendsControl instanceof legendModule.LegendsControl);
});

QUnit.test('setOptions', function(assert) {
    const options = [{ option: 1 }, { option: 2 }, { option: 3 }];
    const theme = { theme: 'theme' };
    const parameters = this.parameters;
    this.theme.returns(theme);

    this.legendsControl.setOptions(options);

    assert.strictEqual(this.theme.callCount, 1, 'theme call count');
    assert.deepEqual(this.theme.lastCall.args, ['legend'], 'theme');
    assert.strictEqual(StubLegend.items.length, 3, 'count');
    $.each(StubLegend.items, function(i, legend) {
        assert.deepEqual(legend.ctorArgs, [parameters], 'parameters ' + i);
        assert.deepEqual(legend.setOptions.lastCall.args, [$.extend({}, theme, options[i])], 'setOptions ' + i);
    });

    assert.deepEqual(parameters.layoutControl.suspend.lastCall.args, [], 'layout is suspended');
    assert.deepEqual(parameters.layoutControl.resume.lastCall.args, [], 'layout is resumed');
    assert.ok(parameters.layoutControl.suspend.lastCall.calledBefore(StubLegend.items[0].setOptions.lastCall), 'call order');
    assert.ok(parameters.layoutControl.resume.lastCall.calledAfter(StubLegend.items[2].setOptions.lastCall), 'call order');
});

QUnit.test('setOptions / more than before', function(assert) {
    const options = [{ option: 1 }, { option: 2 }, { option: 3 }];
    const options2 = [{ option2: 1 }, { option2: 2 }, { option2: 3 }, { option2: 4 }];
    const theme = { theme: 'theme' };
    const parameters = this.parameters;
    this.theme.returns(theme);
    this.legendsControl.setOptions(options);

    this.legendsControl.setOptions(options2);

    assert.strictEqual(this.theme.callCount, 2, 'theme call count');
    assert.deepEqual(this.theme.lastCall.args, ['legend'], 'theme');
    assert.strictEqual(StubLegend.items.length, 4, 'count');
    $.each(StubLegend.items, function(i, legend) {
        assert.deepEqual(legend.ctorArgs, [parameters], 'parameters ' + i);
        assert.deepEqual(legend.setOptions.lastCall.args, [$.extend({}, theme, options2[i])], 'setOptions ' + i);
    });
    assert.strictEqual(StubLegend.items[0].setOptions.callCount, 2, 'call count 0');
    assert.strictEqual(StubLegend.items[1].setOptions.callCount, 2, 'call count 1');
    assert.strictEqual(StubLegend.items[2].setOptions.callCount, 2, 'call count 2');
    assert.strictEqual(StubLegend.items[3].setOptions.callCount, 1, 'call count 3');
});

QUnit.test('setOptions / less then before', function(assert) {
    const options = [{ option: 1 }, { option: 2 }, { option: 3 }];
    const options2 = [{ option2: 1 }, { option2: 2 }];
    const theme = { theme: 'theme' };
    const parameters = this.parameters;
    this.theme.returns(theme);
    this.legendsControl.setOptions(options, theme);

    this.legendsControl.setOptions(options2, theme);

    assert.strictEqual(this.theme.callCount, 2, 'theme call count');
    assert.deepEqual(this.theme.lastCall.args, ['legend'], 'theme');
    assert.strictEqual(StubLegend.items.length, 3, 'count');
    $.each(StubLegend.items.slice(0, 2), function(i, legend) {
        assert.deepEqual(legend.ctorArgs, [parameters], 'parameters ' + i);
        assert.deepEqual(legend.setOptions.lastCall.args, [$.extend({}, theme, options2[i])], 'setOptions ' + i);
    });
    assert.strictEqual(StubLegend.items[0].setOptions.callCount, 2, 'call count 0');
    assert.strictEqual(StubLegend.items[1].setOptions.callCount, 2, 'call count 1');
    assert.strictEqual(StubLegend.items[2].setOptions.callCount, 1, 'call count 2');
    assert.deepEqual(StubLegend.items[2].dispose.lastCall.args, [], 'dispose 2');
});

QUnit.test('init', function(assert) {
    assert.deepEqual(this.parameters.container.virtualLink.lastCall.args, ['legend-base']);
});

QUnit.test('dispose', function(assert) {
    const options = [{ option: 1 }, { option: 2 }, { option: 3 }];
    this.legendsControl.setOptions(options);

    this.legendsControl.dispose();
    this.legendsControl.dispose = noop; // To prevent exception on teardown

    $.each(StubLegend.items, function(i, legend) {
        assert.deepEqual(legend.dispose.lastCall.args, [], 'dispose ' + i);
    });
});
