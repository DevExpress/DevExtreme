"use strict";

define(function(require) {
    require("/js/bundles/dx.mobile.js");

    QUnit.module("config.useJQuery");

    QUnit.test("config value useJQuery with jQuery in window", function(assert) {
        var config = DevExpress.config;
        assert.equal(config().useJQuery, !QUnit.urlParams["nojquery"]);
    });
});
