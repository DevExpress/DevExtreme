"use strict";

define(function(require) {
    require("/js/bundles/dx.all.js");

    QUnit.module("config.useJQuery");

    QUnit.test("config value useJQuery with jQuery in window", function(assert) {
        var config = DevExpress.config;
        assert.equal(config().useJQuery, !QUnit.urlParams["nojquery"]);
    });
});
