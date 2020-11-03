const $ = require('jquery');
const common = require('./commonParts/common.js');
const createFunnel = common.createFunnel;
const environment = common.environment;
const vizMocks = require('../../helpers/vizMocks.js');
const tooltipModule = require('viz/core/tooltip');
const funnelTooltip = require('viz/funnel/tooltip');
const dxFunnel = require('viz/funnel/funnel');
const tooltipOrig = tooltipModule.Tooltip;

dxFunnel.addPlugin(funnelTooltip.plugin);


const tooltipEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        const that = this;

        environment.beforeEach.apply(this, arguments);

        common.stubAlgorithm.getFigures.returns([[0, 0, 1, 0, 0, 1, 1, 1]]);
        common.stubAlgorithm.normalizeValues.returns([0.2, 0.5, 0.3]);

        $('#test-container').css({
            width: 800,
            height: 600
        });
        this.renderer.offsetTemplate = { left: 40, top: 30 };
        this.tooltip = new vizMocks.Tooltip();
        this.tooltip.stub('isEnabled').returns(true);
        this.tooltip.stub('show').returns(true);
        this.tooltip.stub('formatValue').returns('formatted');

        tooltipModule.DEBUG_set_tooltip(sinon.spy(function() {
            return that.tooltip;
        }));
    },
    afterEach: function() {
        environment.afterEach.call(this);
        tooltipModule.DEBUG_set_tooltip(tooltipOrig);
    }
});

QUnit.module('Tooltip', tooltipEnvironment);

QUnit.test('Show tooltip', function(assert) {
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });
    const testItem = widget.getAllItems()[0];

    this.tooltip.stub('formatValue').withArgs(0.2, 'percent').returns('percent-formatted');

    testItem.showTooltip();

    assert.deepEqual(this.tooltip.show.lastCall.args[0], {
        value: 1,
        valueText: 'formatted',
        percent: 0.2,
        percentText: 'percent-formatted',
        item: testItem
    }, 'show arg0');
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 0, y: 0, offset: 0 }, 'show arg1');
    assert.deepEqual(this.tooltip.move.lastCall.args, [440, 330, 0], 'move');
    assert.equal(this.tooltip.formatValue.args[0][0], 1);
});

QUnit.test('Show tooltip, async render', function(assert) {
    this.tooltip.stub('show').returns(undefined);
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });
    const testItem = widget.getAllItems()[0];

    this.tooltip.stub('formatValue').withArgs(0.2, 'percent').returns('percent-formatted');

    testItem.showTooltip();

    assert.equal(this.tooltip.hide.callCount, 1);

    this.tooltip.show.lastCall.args[4](true);
    assert.equal(this.tooltip.move.callCount, 1);
});

QUnit.test('Show tooltip with passed coords', function(assert) {
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });

    widget.getAllItems()[0].showTooltip([100, 200]);

    assert.deepEqual(this.tooltip.move.lastCall.args, [100, 200, 0], 'move');
});

QUnit.test('Only move tooltip if it shown on item', function(assert) {
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });

    widget.getAllItems()[0].showTooltip();

    this.tooltip.show.reset();

    widget.getAllItems()[0].showTooltip([100, 100]);

    assert.ok(!this.tooltip.show.called);
    assert.deepEqual(this.tooltip.move.lastCall.args, [100, 100, 0], 'move');
});

QUnit.test('Show tooltip on different items', function(assert) {
    common.stubAlgorithm.getFigures.returns([[1], [1]]);
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }, { value: 2 }]
    });
    const testItem = widget.getAllItems()[1];

    widget.getAllItems()[0].showTooltip();

    this.tooltip.stub('formatValue').withArgs(0.5, 'percent').returns('percent-formatted');

    this.tooltip.show.reset();

    testItem.showTooltip([100, 100]);

    assert.deepEqual(this.tooltip.show.lastCall.args[0], {
        value: 1,
        valueText: 'formatted',
        percentText: 'percent-formatted',
        percent: 0.5,
        item: testItem
    }, 'show arg0');
    assert.deepEqual(this.tooltip.show.lastCall.args[1], { x: 0, y: 0, offset: 0 }, 'show arg1');
    assert.deepEqual(this.tooltip.move.lastCall.args, [100, 100, 0], 'move');
});

QUnit.test('Hide tooltip', function(assert) {
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });

    widget.getAllItems()[0].showTooltip();

    widget.hideTooltip();

    assert.ok(this.tooltip.hide.called);
});

QUnit.test('Tooltip is hidden when data source is updated', function(assert) {
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });

    widget.getAllItems()[0].showTooltip();

    widget.option({
        dataSource: [{ value: 2 }]
    });

    assert.ok(this.tooltip.hide.called);
});

QUnit.test('Recalculate coords on resize', function(assert) {
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });

    widget.getAllItems()[0].showTooltip();

    widget.option({
        size: {
            width: 300,
            height: 200
        }
    });

    assert.deepEqual(this.tooltip.move.lastCall.args, [190, 130, 0], 'move');
    assert.ok(!this.tooltip.hide.called);
});

QUnit.test('Customize tooltip', function(assert) {
    const widget = createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }]
    });

    widget.getAllItems()[0].showTooltip();

    assert.equal(this.tooltip.update.args[0][0].customizeTooltip({ valueText: 'value', item: { argument: 'argument' } }).text, 'argument value');
});
