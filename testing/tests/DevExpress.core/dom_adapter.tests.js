"use strict";

var domAdapter = require("core/dom_adapter"),
    isWindow = require("core/utils/type").isWindow;

QUnit.module("DOM Adapter", {
    beforeEach: function() {
        var fixture = document.getElementById("qunit-fixture");
        this.container = document.createElement("div");
        fixture.appendChild(this.container);
    }
});

QUnit.test("insertElement", function(assert) {
    var target = document.createElement("span");

    domAdapter.insertElement(this.container, target);

    assert.equal(this.container.childNodes.length, 1);
});

QUnit.test("getWindow", function(assert) {
    assert.equal(isWindow(domAdapter.getWindow()), true);
});

