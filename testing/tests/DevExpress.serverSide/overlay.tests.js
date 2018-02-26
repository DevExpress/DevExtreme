"use strict";

var $ = require("jquery");

require("common.css!");
require("ui/overlay");

QUnit.testStart(function() {
    var markup = '<div id="overlay"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("default options");

QUnit.test("height and width are 'auto' on SSR", function(assert) {
    var overlay = $("#overlay").dxOverlay().dxOverlay("instance");

    assert.equal(overlay.option("height"), "auto", "height is 'auto'");
    assert.equal(overlay.option("width"), "auto", "width is 'auto'");
});

