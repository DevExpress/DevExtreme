var noop = require("core/utils/common").noop,
    themeManagerModule = require("viz/range_selector/theme_manager"),
    ThemeManager = themeManagerModule.ThemeManager,
    themeModule = require("viz/themes");

QUnit.module("ThemeManager");

QUnit.test("ThemeManager class is declared", function(assert) {
    assert.ok(ThemeManager);
});

QUnit.test("default theme", function(assert) {
    // arrange
    var themeManager = new ThemeManager(undefined);
    themeManager.setCallback(noop);
    themeManager.setTheme();
    // act
    var theme = themeManager.theme();
    // assert
    assert.ok(theme);
    assert.equal(theme.containerBackgroundColor, "#ffffff");
    assert.equal(theme.scale.tick.color, '#000000');
    assert.equal(theme.scale.tick.opacity, 0.17);
    assert.equal(theme.sliderMarker.font.size, 11);
});

QUnit.test("default theme fonts", function(assert) {
    // arrange
    var themeManager = new ThemeManager(undefined);
    themeManager.setCallback(noop);
    themeManager.setTheme();
    // act
    var theme = themeManager.theme();
    // assert
    assert.equal(theme.scale.label.font.size, 11);
    assert.equal(theme.scale.label.font.family, "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif");
    assert.equal(theme.sliderMarker.font.size, 11);
    assert.equal(theme.sliderMarker.font.family, "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana, sans-serif");

    assert.deepEqual(theme.loadingIndicator.font, themeModule.themes["generic.light"].font);
});
