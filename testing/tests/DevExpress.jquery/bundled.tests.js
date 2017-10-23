"use strict";

define(function(require) {
    var $ = require("jquery");

    require("/artifacts/js/dx.mobile.debug.js");

    var noJQuery = QUnit.urlParams["nojquery"];

    QUnit.module("jquery integration");

    QUnit.test("renderer uses correct strategy", function(assert) {
        var node = document.createElement("div");
        var element = new DevExpress.ui.dxButton(node).element();

        assert[noJQuery ? "notOk" : "ok"](element instanceof window.jQuery);
    });

    QUnit.test("$.fn plugins works with both strategies", function(assert) {
        var $element = $("<div>");

        assert.equal(typeof $element.dxButton, "function");
    });
});
