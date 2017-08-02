"use strict";

var parseHTML = require("core/utils/htmlParser");

QUnit.module("main");

QUnit.test("base", function(assert) {
    assert.equal(parseHTML("<div></div>")[0].outerHTML, "<div></div>");
    assert.equal(parseHTML("<div><p>test</p></div>")[0].outerHTML, "<div><p>test</p></div>");
});

QUnit.test("Nearby tags", function(assert) {
    var result = parseHTML("<div>1</div><div>2</div>");

    assert.equal(result.length, 2);
    assert.equal(result[0].outerHTML, "<div>1</div>");
    assert.equal(result[1].outerHTML, "<div>2</div>");
});

QUnit.test("Prevent evaluating of script tags ", function(assert) {
    var scriptTag = "<script> window.evalFromHTML = true; </script>";
    var innerScriptTag = "<div><script> window.evalFromHTML = true; </script></div>";

    assert.ok(!parseHTML(scriptTag).length);
    assert.equal(parseHTML(innerScriptTag)[0].outerHTML, "<div></div>");
});
