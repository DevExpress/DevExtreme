"use strict";

window.DevExpress = window.DevExpress || {};
window.DevExpress.config = {
    useJQuery: false
};

define(function(require) {
    var config = require("core/config");

    QUnit.module("predefined config");

    QUnit.test("Get default value from DevExpress.config object", function(assert) {
        var originalConfig = config();

        try {
            assert.strictEqual(originalConfig.useJQuery, false);
        } finally {
            config(originalConfig);
        }
    });

});
