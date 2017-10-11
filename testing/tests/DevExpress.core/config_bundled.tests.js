"use strict";

define(function(require) {
    require("/js/bundles/dx.all.js");

    QUnit.module("config.useJQueryRenderer");

    QUnit.test("config value useJQueryRenderer with jQuery in window", function(assert) {
        var config = DevExpress.config;
        assert.equal(config().useJQueryRenderer, !QUnit.urlParams["nojquery"]);
    });
});
