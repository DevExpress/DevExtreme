import config from "core/config";
import errors from "core/errors";
import "bundles/modules/core";

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

QUnit.test("default DevExpress.config contains 'editorStylingMode' with undefined value", function(assert) {
    assert.ok("editorStylingMode" in config());
    assert.strictEqual(config().editorStylingMode, undefined);
});

QUnit.test("deprecated fields", function(assert) {
    const originalLog = errors.log;
    const log = [];

    errors.log = (...args) => {
        log.push(args);
    };

    try {
        config({ decimalSeparator: "*" });
        config({ thousandsSeparator: "*" });

        assert.equal(log.length, 2);
        assert.strictEqual(log[0][0], "W0003");
        assert.strictEqual(log[0][1], "config");
        assert.strictEqual(log[0][2], "decimalSeparator");
        assert.strictEqual(log[0][3], "19.2");

        assert.strictEqual(log[1][0], "W0003");
        assert.strictEqual(log[1][1], "config");
        assert.strictEqual(log[1][2], "thousandsSeparator");
        assert.strictEqual(log[1][3], "19.2");
    } finally {
        errors.log = originalLog;
    }
});
