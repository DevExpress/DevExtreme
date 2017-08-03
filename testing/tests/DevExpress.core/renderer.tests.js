"use strict";

var renderer = require("core/renderer");

QUnit.module("HTML");

QUnit.test("base", function(assert) {
    assert.equal(renderer("<div>").html("<div></div>").html(), "<div></div>");
    assert.equal(renderer("<div>").html("<div><p>test</p></div>").html(), "<div><p>test</p></div>");
});

QUnit.test("Nearby tags", function(assert) {
    assert.equal(renderer("<div>").html("<div>1</div><div>2</div>").html(), "<div>1</div><div>2</div>");
});

QUnit.test("Prevent evaluating of script tags ", function(assert) {
    renderer("<div>").html("<script> window.evalFromHTML = true; </script>");
    renderer("<div>").html("<div><script> window.evalFromHTML = true; </script></div>");

    assert.ok(!window.evalFromHTML);
});
