var noop = require('core/utils/common').noop,
    themeModule = require('viz/themes'),
    ThemeManager = require('viz/gauges/theme_manager').ThemeManager;

QUnit.module('ThemeManager', {
    createThemeManager: function() {
        return new ThemeManager({ themeSection: 'gauge' });
    }
});

QUnit.test('Theme - generic', function(assert) {
    var themeManager = this.createThemeManager();
    themeManager.setCallback(noop);
    themeManager.setTheme();
    var theme = themeManager.theme();
    assert.strictEqual(themeManager.themeName(), 'generic.light', 'theme name');
    assert.ok(theme.title, 'title');
    assert.ok(theme.export, 'export');
    assert.ok(theme.indicator, 'indicator');
    assert.ok(theme.tooltip, 'tooltip');
    assert.ok(theme.scale, 'scale');
    assert.ok(theme.rangeContainer, 'rangeContainer');
    assert.ok(theme.valueIndicators, 'valueIndicators');
    assert.ok(theme._circular, '_circular');
    assert.ok(theme._linear, '_linear');
});

QUnit.test('Theme - generic-dark', function(assert) {
    var themeManager = this.createThemeManager();
    themeManager.setCallback(noop);
    themeManager.setTheme('generic.dark');
    var theme = themeManager.theme();
    assert.strictEqual(themeManager.themeName(), 'generic.dark', 'theme name');
    assert.ok(theme.title, 'title');
    assert.ok(theme.export, 'export');
    assert.ok(theme.indicator, 'indicator');
    assert.ok(theme.tooltip, 'tooltip');
    assert.ok(theme.scale, 'scale');
    assert.ok(theme.rangeContainer, 'rangeContainer');
    assert.ok(theme.valueIndicators, 'valueIndicators');
    assert.ok(theme._circular, '_circular');
    assert.ok(theme._linear, '_linear');
});

QUnit.test('Subtheme', function(assert) {
    themeModule.registerTheme({
        name: 'my-theme',
        gauge: {
            valueIndicator: {
                _default: {
                    offset: 100
                }
            }
        }
    });
    var themeManager = this.createThemeManager();
    themeManager.setCallback(noop);
    themeManager._subTheme = '#circular';
    themeManager.setTheme('my-theme');
    var theme = themeManager.theme();
    assert.strictEqual(theme.valueIndicator._default.offset, 100);
});
