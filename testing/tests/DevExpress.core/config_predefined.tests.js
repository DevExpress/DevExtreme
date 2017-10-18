"use strict";

var config = require("core/config");

QUnit.module("predefined config");

QUnit.test("Get default value from DevExpress.config object", function(assert) {
    var originalConfig = config();

    try {
        assert.strictEqual(originalConfig.useJQuery, !QUnit.urlParams["nojquery"]);
    } finally {
        config(originalConfig);
    }
});
