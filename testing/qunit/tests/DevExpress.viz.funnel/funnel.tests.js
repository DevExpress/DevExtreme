const $ = require('jquery');
const dxFunnel = require('viz/funnel');

QUnit.module('Plugins');

QUnit.test('All plugins are included', function(assert) {
    const plugins = dxFunnel.prototype._plugins;
    const names = ['data_source', 'lables', 'export', 'title', 'legend', 'tracker', 'funnel-tooltip', 'tooltip', 'loading_indicator'];

    plugins.forEach(function(plugin, index) {
        assert.equal(plugin.name, names[index]);
    });
});

QUnit.module('Events');

QUnit.test('Fire tooltipHidden event on hide tooltip', function(assert) {
    const hidden = sinon.spy();
    const widget = $('#qunit-fixture').dxFunnel({
        dataSource: [{ value: 1 }, { value: 2 }],
        valueField: 'value',
        onTooltipHidden: hidden,
        tooltip: {
            enabled: true
        },
    }).dxFunnel('instance');

    widget.getAllItems()[0].showTooltip();

    widget.hideTooltip();

    assert.equal(hidden.callCount, 1);
    assert.equal(hidden.lastCall.args[0].item, widget.getAllItems()[0]);
});
