var config = require('core/config');

require('bundles/modules/core');

QUnit.module('DevExtreme global config');

QUnit.test('get/set', function(assert) {
    var originalConfig = config();

    try {
        assert.equal(originalConfig.rtlEnabled, false);
        assert.equal(originalConfig.defaultCurrency, 'USD');

        config({
            rtlEnabled: true,
            defaultCurrency: 'EUR'
        });

        assert.equal(config().rtlEnabled, true);
        assert.equal(config().defaultCurrency, 'EUR');

        config({
            rtlEnabled: false
        });

        assert.equal(config().rtlEnabled, false);
        assert.equal(config().defaultCurrency, 'EUR');
    } finally {
        config(originalConfig);
    }
});

QUnit.test('default DevExpress.config contains \'serverDecimalSeparator\' with \'.\' value', function(assert) {
    assert.equal(config().serverDecimalSeparator, '.');
});

QUnit.test('set custom \'serverDecimalSeparator\'', function(assert) {
    var originalConfig = config();
    try {
        config({ serverDecimalSeparator: '|' });
        assert.equal(config().serverDecimalSeparator, '|');
    } finally {
        config(originalConfig);
    }
});

QUnit.test('default DevExpress.config contains \'forceIsoDateParsing\' with true value', function(assert) {
    assert.ok('forceIsoDateParsing' in config());
    assert.strictEqual(config().forceIsoDateParsing, true);
});

QUnit.test('default DevExpress.config contains \'useJQuery\' with true value', function(assert) {
    assert.ok('useJQuery' in config());
});

QUnit.test('default DevExpress.config contains \'editorStylingMode\' with undefined value', function(assert) {
    assert.ok('editorStylingMode' in config());
    assert.strictEqual(config().editorStylingMode, undefined);
});
