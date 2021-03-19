const themes = require('ui/themes');

QUnit.module('themes');

// T968400
QUnit.test('init theme', function(assert) {
    assert.strictEqual(themes.current(), null, 'theme is null');
    assert.ok(themes.isPendingThemeLoaded(), 'theme is loaded');
});

QUnit.test('theme change should throw error', function(assert) {
    try {
        themes.current('generic.light');
    } catch(e) {
        assert.strictEqual(e.message.indexOf('E0021'), 0, 'E0021 is thrown');
    }
});
