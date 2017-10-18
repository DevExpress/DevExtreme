"use strict";

var $ = require("jquery"),
    errors = require("core/errors"),
    config = require("core/config");

require("bundles/modules/core");

QUnit.module("DevExtreme global config");

QUnit.test("get/set", function(assert) {
    var originalConfig = config();

    try {
        assert.equal(originalConfig.rtlEnabled, false);
        assert.equal(originalConfig.defaultCurrency, "USD");

        config({
            rtlEnabled: true,
            defaultCurrency: "EUR"
        });

        assert.equal(config().rtlEnabled, true);
        assert.equal(config().defaultCurrency, "EUR");

        config({
            rtlEnabled: false
        });

        assert.equal(config().rtlEnabled, false);
        assert.equal(config().defaultCurrency, "EUR");
    } finally {
        config(originalConfig);
    }
});

QUnit.test("DevExpress.rtlEnabled property is deprecated", function(assert) {
    var originalRtlEnabled = config().rtlEnabled,
        originalLog = errors.log,
        log = [],
        expectedWarning = ["W0003", "DevExpress", "rtlEnabled", "16.1", "Use the 'DevExpress.config' method instead"];

    errors.log = function() {
        log.push($.makeArray(arguments));
    };

    try {
        DevExpress.rtlEnabled = true;

        assert.equal(config().rtlEnabled, true);
        assert.equal(log.length, 1);
        assert.deepEqual(log[0], expectedWarning);

        config({
            rtlEnabled: false
        });

        assert.equal(DevExpress.rtlEnabled, false);
        assert.equal(log.length, 2);
        assert.deepEqual(log[1], expectedWarning);

    } finally {
        errors.log = originalLog;
        config({ rtlEnabled: originalRtlEnabled });
    }
});

QUnit.test("default DevExpress.config contains 'serverDecimalSeparator' with '.' value", function(assert) {
    assert.equal(config().serverDecimalSeparator, ".");
});

QUnit.test("set custom 'serverDecimalSeparator'", function(assert) {
    var originalConfig = config();
    try {
        config({ serverDecimalSeparator: "|" });
        assert.equal(config().serverDecimalSeparator, "|");
    } finally {
        config(originalConfig);
    }
});

QUnit.test("default DevExpress.config contains 'forceIsoDateParsing' with true value", function(assert) {
    assert.ok("forceIsoDateParsing" in config());
    assert.strictEqual(config().forceIsoDateParsing, true);
});

QUnit.test("default DevExpress.config contains 'useJQuery' with true value", function(assert) {
    assert.ok("useJQuery" in config());
});
