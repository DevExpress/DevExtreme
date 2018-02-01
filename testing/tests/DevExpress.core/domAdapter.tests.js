"use strict";

var domAdapter = require("core/dom_adapter");

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
