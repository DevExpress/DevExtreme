"use strict";

var Button = require("ui/button");
var CheckBox = require("ui/check_box");

QUnit.module("Scripts loading");

QUnit.test("Button", function(assert) {
    assert.ok(Button);
});

QUnit.test("CheckBox", function(assert) {
    assert.ok(CheckBox);
});

QUnit.module("Widget creation", {
    beforeEach: function() {
        var fixture = document.getElementById("qunit-fixture");
        this.element = document.createElement("div");
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

QUnit.test("Button", function(assert) {
    this.instance = new Button(this.element);
    assert.ok(this.instance);
});

