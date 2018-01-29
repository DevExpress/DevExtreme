"use strict";

var Button = require("ui/button");

QUnit.module("Scripts loading");

QUnit.test("Button", function(assert) {
    assert.ok(Button);
});
