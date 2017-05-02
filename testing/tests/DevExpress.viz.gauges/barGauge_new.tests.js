"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    rendererModule = require("viz/core/renderers/renderer"),
    titleModule = require("viz/core/title"),
    tooltipModule = require("viz/core/tooltip"),
    loadingIndicatorModule = require("viz/core/loading_indicator");

require("viz/bar_gauge");

$('<div id="test-container" style="width: 400px; height: 400px;"></div>').appendTo("#qunit-fixture");

var _LoadingIndicator = loadingIndicatorModule.LoadingIndicator;

titleModule.Title = vizMocks.Title;
tooltipModule.Tooltip = vizMocks.Tooltip;
loadingIndicatorModule.LoadingIndicator = vizMocks.LoadingIndicator;

QUnit.module("Misc", {
    beforeEach: function() {
        var renderer = this.renderer = new vizMocks.Renderer();
        rendererModule.Renderer = function() { return renderer; };
    },

    create: function(options) {
        this.widget = $("#test-container").dxBarGauge(options).dxBarGauge("instance");
        return this.widget;
    },

    bar: function(index) {
        return this.renderer.arc.getCall(3 * index + 1).returnValue;
    }
});

QUnit.test("palette", function(assert) {
    this.create({
        values: [1, 2, 3]
    });
    this.renderer.arc.reset();

    this.widget.option("palette", ["c1", "c2", "c3"]);

    assert.deepEqual(this.bar(0).attr.getCall(2).args, [{ fill: "c1" }], "bar 1 color");
    assert.deepEqual(this.bar(1).attr.getCall(2).args, [{ fill: "c2" }], "bar 2 color");
    assert.deepEqual(this.bar(2).attr.getCall(2).args, [{ fill: "c3" }], "bar 3 color");
});

QUnit.test("Animation after false resizing", function(assert) {
    this.create({ values: [1, 2] });
    this.widget.option("size", { width: 400, height: 400 });
    this.renderer.g.returnValues[4].animate.reset();

    this.widget.values([2, 3]);

    assert.strictEqual(this.renderer.g.returnValues[4].animate.callCount, 2, "animation");
});

QUnit.test("Change theme when loading indicator is shown", function(assert) {
    loadingIndicatorModule.LoadingIndicator = _LoadingIndicator;
    try {
        this.create({ values: [1, 2] });
        this.widget.showLoadingIndicator();

        this.widget.option("theme", "test");

        assert.ok(true, "no errors");
    } finally {
        loadingIndicatorModule.LoadingIndicator = vizMocks.LoadingIndicator;
    }
});
