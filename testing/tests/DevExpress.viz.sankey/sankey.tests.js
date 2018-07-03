"use strict";

var dxSankey = require("viz/sankey");

QUnit.module("Plugins");

QUnit.test("All plugins are included", function(assert) {
    var plugins = dxSankey.prototype._plugins,
        names = ["data_source", "export", "title", "tracker", "loading_indicator", "tooltip"];

    plugins.forEach(function(plugin, index) {
        assert.equal(plugin.name, names[index], 'plugin: ' + names[index]);
    });
});
