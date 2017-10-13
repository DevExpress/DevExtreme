"use strict";

SystemJS.config({
    map: {
        jquery: '/testing/helpers/noJQuery.js'
    }
});

define(function(require) {
    require("/js/bundles/dx.all.js");

    QUnit.module("config.useJQuery");

    QUnit.test("config value useJQuery should be false if jquery is not included", function(assert) {
        var config = DevExpress.config;
        assert.equal(config().useJQuery, false);
    });
});
