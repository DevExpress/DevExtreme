"use strict";

var $ = require("jquery"),
    domAdapter = require("core/dom_adapter");

QUnit.module("main", {
    beforeEach: function() {
        $("#qunit-fixture").empty();
        var markup = '<div id="container"></div>';
        $("#qunit-fixture").html(markup);
    }
});

QUnit.test("registerActionExecutor/unregisterActionExecutor simple", function(assert) {
    var $container = $("#container");
    var target = document.createElement("span");

    domAdapter.insertElement($container[0], target);

    assert.ok($container.children().length === 1);
});

