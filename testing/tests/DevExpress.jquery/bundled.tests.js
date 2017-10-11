"use strict";

define(function(require) {
    if(QUnit.urlParams["nojquery"]) {
        return;
    }

    require("/js/bundles/dx.all.js");

    QUnit.module("jquery integration");

    QUnit.test("renderer uses jquery strategy", function(assert) {
        var node = document.createElement("div");
        var element = new DevExpress.ui.dxButton(node).element();

        assert.ok(element instanceof window.jQuery);
    });
});
