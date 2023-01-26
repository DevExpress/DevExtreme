const dxSankey = require('viz/sankey');

QUnit.module('Plugins');

QUnit.test('All plugins are included', function(assert) {
    const plugins = dxSankey.prototype._plugins;
    const names = ['data_source', 'export', 'title', 'tracker', 'loading_indicator', 'tooltip'];

    plugins.forEach(function(plugin, index) {
        assert.equal(plugin.name, names[index], 'plugin: ' + names[index]);
    });
});
