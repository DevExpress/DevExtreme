"use strict";

var Button = require("ui/button");
var serverSideDOMAdapterPatch = require("../../helpers/serverSideDOMAdapterPatch.js");

serverSideDOMAdapterPatch.set();

QUnit.module("Widget creation");

QUnit.test("Button", function(assert) {
    var element = document.createElement("div");
    var instance = new Button(element);
    assert.ok(instance);
});
