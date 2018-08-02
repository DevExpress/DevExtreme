var noop = require("core/utils/common").noop,
    themeManagerModule = require("viz/vector_map/theme_manager"),
    themeModule = require("viz/themes");

themeModule.registerTheme({ name: 'theme-with-default-palette', defaultPalette: 'bright' });

QUnit.module('General', {
    beforeEach: function() {
        this.themeManager = new themeManagerModule.ThemeManager();
        this.themeManager.setCallback(noop);
    }
});

QUnit.test('instance type', function(assert) {
    assert.ok(this.themeManager instanceof themeManagerModule.ThemeManager);
});

QUnit.test('theme section', function(assert) {
    this.themeManager.setTheme();
    var theme = this.themeManager.theme();
    assert.ok(theme.background, 'background');
    assert.ok(theme["layer:area"], 'area');
    assert.ok(theme["layer:marker:dot"], 'point dot');
    assert.ok(theme["layer:marker:bubble"], 'point bubble');
    assert.ok(theme["layer:marker:pie"], 'point pie');
    assert.ok(theme["layer:marker:image"], 'point image');
    assert.ok(theme.controlBar, 'control bar');
    assert.ok(theme.tooltip, 'tooltip');
    assert.ok(theme.legend, 'legend');
    assert.ok(theme.loadingIndicator, 'loading indicator');
    assert.ok(theme.export, 'export');
});

QUnit.module('RTL support', {
    beforeEach: function() {
        themeModule.registerTheme({
            name: 'rtlTheme',
            map: {
                _rtl: {
                    someOption: {
                        rtl: true
                    }
                },
                someOption: {
                    rtl: false
                }
            }
        }, "generic");

        this.themeManager = new themeManagerModule.ThemeManager();
        this.themeManager.setCallback(noop);
    }
});

QUnit.test("Do not patch theme", function(assert) {
    // act
    this.themeManager.setTheme('rtlTheme');

    // assert
    assert.deepEqual(this.themeManager._theme.someOption, { rtl: false });
});

QUnit.test("Patch theme based on user options", function(assert) {
    // act
    this.themeManager.setTheme('rtlTheme', true);

    // assert
    assert.deepEqual(this.themeManager._theme.someOption, { rtl: true });
});

QUnit.test("Patch theme based on theme", function(assert) {
    themeModule.registerTheme({
        name: 'rtlTheme1',
        map: {
            rtlEnabled: true,
            _rtl: {
                someOption: {
                    rtl: true
                }
            },
            someOption: {
                rtl: false
            }
        }
    }, "generic");

    // act
    this.themeManager.setTheme('rtlTheme1');

    // assert
    assert.deepEqual(this.themeManager._theme.someOption, { rtl: true });
});

QUnit.test("Do not patch theme (theme is rtl, options is ltr)", function(assert) {
    themeModule.registerTheme({
        name: 'rtlTheme1',
        map: {
            rtlEnabled: true,
            _rtl: {
                someOption: {
                    rtl: true
                }
            },
            someOption: {
                rtl: false
            }
        }
    }, "generic");

    // act
    this.themeManager.setTheme('rtlTheme1', false);

    // assert
    assert.deepEqual(this.themeManager._theme.someOption, { rtl: false });
});
