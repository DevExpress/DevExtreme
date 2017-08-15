"use strict";

var dxFunnel = require("viz/funnel");

QUnit.module("Plugins");

QUnit.test("All plugins are included", function(assert) {
    var plugins = dxFunnel.prototype._plugins,
        names = ["data_source", "lables", "export", "title", "legend", "tracker", "funnel-tooltip", "tooltip", "loading_indicator"];

    plugins.forEach(function(plugin, index) {
        assert.equal(plugin.name, names[index]);
    });
});
