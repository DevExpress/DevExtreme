"use strict";

var $ = require("jquery"),
    themeManagerModule = require("viz/components/chart_theme_manager"),
    backgroundColor = '#ffffff',
    defaultColor = '#5f8b95',
    paletteModule = require("viz/palette"),
    themeModule = require("viz/themes");

function createThemeManager(options, themeGroupName) {
    return new themeManagerModule.ThemeManager(options, themeGroupName || "chart");
}

(function series() {
    //for T249903, TODO - kill it after removing ctor of chart theme manager
    QUnit.module("Cache", {
        cache: themeModule.widgetsCache,

        create: function() {
            return createThemeManager();
        }
    });

    QUnit.test("Adding and removing", function(assert) {
        var item = this.create(),
            k;
        $.each(this.cache, function(i) {
            k = i;
            return false;
        });
        assert.strictEqual(this.cache[k], item);
        item.dispose();
        assert.strictEqual(this.cache[k], undefined);
    });

    QUnit.module("Get options - series", {
        afterEach: function() {
            paletteModule.currentPalette('default');
        }
    });

    QUnit.test('First series theme - default', function(assert) {
        //arrange
        var themeManager = createThemeManager({});
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", {
            type: "unknown"
        });
        //assert series theme
        assert.equal(theme.containerBackgroundColor, backgroundColor);
        assert.equal(theme.color, undefined);
        assert.equal(theme.mainSeriesColor, defaultColor);
        assert.equal(theme.border.width, 2);
        assert.equal(theme.border.color, undefined);
        assert.equal(theme.line.width, 2);
        assert.equal(theme.line.dashStyle, 'solid');
        assert.deepEqual(theme.point, {
            visible: true,
            symbol: 'circle',
            border: {
                visible: false,
                width: 1
            },
            size: 12,
            hoverStyle: {
                border: {
                    visible: true,
                    width: 4
                }
            },
            selectionStyle: {
                border: {
                    visible: true,
                    width: 4
                }
            },
            hoverMode: "onlyPoint",
            selectionMode: "onlyPoint"
        }, "theme.point");
        assert.deepEqual(theme.hoverStyle, {
            hatching: {
                direction: "right",
                width: 2,
                step: 6,
                opacity: 0.75
            },
            border: {
                visible: false,
                width: 3
            }
        }, "theme.hoverStyle");
        assert.deepEqual(theme.selectionStyle, {
            hatching: {
                direction: "right",
                width: 2,
                step: 6,
                opacity: 0.5
            },
            border: {
                visible: false,
                width: 3
            }
        }, "theme.selectionStyle");
        assert.deepEqual(theme.label, {
            alignment: "center",
            font: {
                color: '#ffffff',
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                weight: 400,
                size: 12,
                cursor: 'default'
            },
            horizontalOffset: 0,
            showForZeroValues: true,
            position: "outside",
            radialOffset: 0,
            rotationAngle: 0,
            verticalOffset: 0,
            visible: false,
            border: {
                visible: false,
                width: 1,
                color: '#d3d3d3',
                dashStyle: 'solid'
            },
            connector: {
                visible: false,
                width: 1
            }
        }, "theme.label");
        assert.equal(theme.widgetType, 'chart');
        assert.equal(theme.resolveLabelOverlapping, "none");
    });


    QUnit.test('First series theme - area', function(assert) {
        //arrange
        var themeManager = createThemeManager({});
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", {
            type: "area"
        });
        //assert series theme
        assert.equal(theme.containerBackgroundColor, backgroundColor);
        assert.equal(theme.color, undefined);
        assert.equal(theme.border.width, 2);
        assert.equal(theme.border.color, undefined);
        assert.equal(theme.line.width, 2);
        assert.equal(theme.line.dashStyle, 'solid');
        assert.deepEqual(theme.point, {
            visible: false,
            symbol: 'circle',
            border: {
                visible: false,
                width: 1
            },
            size: 12,
            hoverStyle: {
                border: {
                    visible: true,
                    width: 4
                }
            },
            selectionStyle: {
                border: {
                    visible: true,
                    width: 4
                }
            },
            hoverMode: "onlyPoint",
            selectionMode: "onlyPoint"
        }, "theme.point");
        assert.deepEqual(theme.hoverStyle, {
            hatching: {
                direction: "right",
                width: 2,
                step: 6,
                opacity: 0.75
            },
            border: {
                visible: false,
                width: 3
            }
        }, "theme.hoverStyle");
        assert.deepEqual(theme.selectionStyle, {
            hatching: {
                direction: "right",
                width: 2,
                step: 6,
                opacity: 0.5
            },
            border: {
                visible: false,
                width: 3
            }
        }, "theme.selectionStyle");
        assert.deepEqual(theme.label, {
            font: {
                color: '#ffffff',
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                weight: 400,
                size: 12,
                cursor: 'default'
            },
            alignment: "center",
            horizontalOffset: 0,
            position: "outside",
            radialOffset: 0,
            rotationAngle: 0,
            verticalOffset: 0,
            showForZeroValues: true,
            visible: false,
            border: {
                color: "#d3d3d3",
                visible: false,
                width: 1,
                dashStyle: 'solid'
            },
            connector: {
                visible: false,
                width: 1
            }
        }, "theme.label");
        assert.equal(theme.widgetType, 'chart');
    });

    QUnit.test('First series theme', function(assert) {
        //arrange
        var themeManager = createThemeManager({});
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", {});
        //assert series theme
        assert.equal(theme.containerBackgroundColor, backgroundColor);
        assert.equal(theme.color, undefined);
        assert.equal(theme.border.width, 2);
        assert.equal(theme.border.color, undefined);
        assert.equal(theme.line.width, 2);
        assert.equal(theme.line.dashStyle, 'solid');
        assert.deepEqual(theme.point, {
            visible: true,
            symbol: 'circle',
            border: {
                visible: false,
                width: 1
            },
            size: 12,
            hoverStyle: {
                border: {
                    visible: true,
                    width: 4
                }
            },
            selectionStyle: {
                border: {
                    visible: true,
                    width: 4
                }
            },
            hoverMode: "onlyPoint",
            selectionMode: "onlyPoint"
        }, "theme.point");
        assert.deepEqual(theme.hoverStyle, {
            hatching: {
                direction: "none",
                width: 2,
                step: 6,
                opacity: 0.75
            },
            border: {
                visible: false,
                width: 3
            },
            width: 3
        }, "theme.hoverStyle");
        assert.deepEqual(theme.selectionStyle, {
            hatching: {
                direction: "right",
                width: 2,
                step: 6,
                opacity: 0.5
            },
            border: {
                visible: false,
                width: 3
            },
            width: 3
        }, "theme.selectionStyle");
        assert.deepEqual(theme.label, {
            font: {
                color: '#ffffff',
                family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
                weight: 400,
                size: 12,
                cursor: 'default'
            },
            alignment: "center",
            horizontalOffset: 0,
            position: "outside",
            radialOffset: 0,
            rotationAngle: 0,
            verticalOffset: 0,
            visible: false,
            border: {
                visible: false,
                width: 1,
                color: '#d3d3d3',
                dashStyle: 'solid'
            },
            showForZeroValues: true,
            connector: {
                visible: false,
                width: 1
            }
        }, "theme.label");
        assert.equal(theme.widgetType, 'chart');
    });


    QUnit.test('Change theme palette from user options', function(assert) {
        //arrange
        var palette = 'Soft Pastel',
            themeManager = createThemeManager({
                palette: palette
            });
        themeManager.setTheme({});

        //act
        var theme = themeManager.getOptions("series", {});
        //assert series theme
        assert.ok(theme);
        assert.equal(theme.mainSeriesColor, '#60a69f');
        assert.ok(theme.hoverStyle);
        assert.ok(theme.point);
        assert.ok(theme.point.hoverStyle);
        assert.equal(theme.color, undefined);
        assert.equal(theme.hoverStyle.color, undefined);
        assert.equal(theme.selectionStyle.color, undefined);
        assert.equal(theme.point.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
    });

    QUnit.test('Change theme palette dynamically', function(assert) {
        //arrange
        var palette = 'Soft Pastel',
            themeManager = createThemeManager({
                palette: palette
            });
        themeManager.setTheme({});

        //act
        themeManager.updatePalette(['#ffffff']);
        //assert series theme
        var theme = themeManager.getOptions("series", {});
        assert.ok(theme);
        assert.ok(theme.hoverStyle);
        assert.ok(theme.point);
        assert.ok(theme.point.hoverStyle);
        assert.equal(theme.mainSeriesColor, '#ffffff');
        assert.equal(theme.color, undefined);
        assert.equal(theme.hoverStyle.color, undefined);
        assert.equal(theme.selectionStyle.color, undefined);
        assert.equal(theme.point.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
    });

    QUnit.test('Change theme palette dynamically to preset', function(assert) {
        //arrange
        var palette = ['red'],
            themeManager = createThemeManager({
                palette: palette
            });
        themeManager.setTheme({});
        //act
        themeManager.updatePalette('Soft Pastel');
        //assert series theme
        var theme = themeManager.getOptions("series", {});
        assert.ok(theme);
        assert.ok(theme.hoverStyle);
        assert.ok(theme.point);
        assert.ok(theme.point.hoverStyle);
        assert.equal(theme.mainSeriesColor, '#60a69f');
        assert.equal(theme.color, undefined);

        assert.equal(theme.hoverStyle.color, undefined);
        assert.equal(theme.selectionStyle.color, undefined);
        assert.equal(theme.point.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
    });

    QUnit.test('Wrong palette fall back to default', function(assert) {
        //arrange
        var palette = 'nonexisting',
            themeManager = createThemeManager({
                palette: palette
            });
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", {
        });
        //assert series theme

        assert.ok(theme);
        assert.ok(theme.hoverStyle);
        assert.ok(theme.selectionStyle);
        assert.ok(theme.point);
        assert.ok(theme.point.hoverStyle);
        assert.ok(theme.point);
        assert.equal(theme.mainSeriesColor, defaultColor);
        assert.equal(theme.color, undefined);
        assert.equal(theme.hoverStyle.color, undefined);
        assert.equal(theme.selectionStyle.color, undefined);
        assert.equal(theme.point.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
    });

    QUnit.test('Palette and Default palette', function(assert) {
        //arrange
        paletteModule.registerPalette('Custom Palette', ['#0f0f0f']);
        paletteModule.registerPalette('Default Palette', ['#f0f0f0']);
        themeModule.registerTheme({ name: 'Super Theme', defaultPalette: 'Default Palette' });

        //act
        var options = {
            theme: 'Super Theme',
            palette: 'Custom Palette'
        };
        var themeManager = createThemeManager(options);
        themeManager.setTheme(options.theme);
        var theme = themeManager.getOptions("series", {});

        //assert series theme
        assert.equal(theme.mainSeriesColor, '#0f0f0f');
    });

    QUnit.test('No Palette and Default palette', function(assert) {
        //arrange
        paletteModule.registerPalette('Custom Palette', ['#0f0f0f']);
        paletteModule.registerPalette('Default Palette', ['#f0f0f0']);
        themeModule.registerTheme({ name: 'Super Theme', defaultPalette: 'Default Palette' });

        //act
        var options = {
            theme: 'Super Theme'
        };
        var themeManager = createThemeManager(options);
        themeManager.setTheme(options.theme);
        var theme = themeManager.getOptions("series", {});

        //assert series theme
        assert.equal(theme.mainSeriesColor, '#f0f0f0');
    });

    QUnit.test('Current palette', function(assert) {
        //arrange
        paletteModule.registerPalette('Current Palette', ['#f0f0f0', '#0f0f0f', '#111111']);
        themeModule.registerTheme({ name: 'Super Theme', }, 'default');
        paletteModule.currentPalette('Current Palette');
        //act
        var options = {
            theme: 'Super Theme'
        };
        var themeManager = createThemeManager(options);
        themeManager.setTheme(options.theme);
        var theme = themeManager.getOptions("series", {});

        //assert series theme
        assert.ok(theme);
        assert.ok(theme.hoverStyle);
        assert.ok(theme.selectionStyle);
        assert.ok(theme.point);
        assert.ok(theme.point.hoverStyle);
        assert.ok(theme.point.selectionStyle);
        assert.equal(theme.mainSeriesColor, '#f0f0f0');
        assert.equal(theme.color, undefined);
        assert.equal(theme.hoverStyle.color, undefined);
        assert.equal(theme.selectionStyle.color, undefined);
        assert.equal(theme.point.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
    });

    QUnit.test('Set theme palette from user options', function(assert) {
        //arrange
        var palette = ['red', 'blue', 'green'],
            themeManager = createThemeManager({
                palette: palette
            });
        themeManager.setTheme({});

        //act
        var theme = themeManager.getOptions("series", {
        });
        //assert series theme
        assert.ok(theme);
        assert.ok(theme.hoverStyle);
        assert.ok(theme.selectionStyle);
        assert.ok(theme.point);
        assert.ok(theme.point.hoverStyle);
        assert.ok(theme.point.selectionStyle);
        assert.equal(theme.mainSeriesColor, 'red');
        assert.equal(theme.color, undefined);
        assert.equal(theme.hoverStyle.color, undefined);
        assert.equal(theme.selectionStyle.color, undefined);
        assert.equal(theme.point.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
    });

    QUnit.test('Modify custom color', function(assert) {
        //arrange
        var themeManager = createThemeManager(),
            customColor = '#777777';
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", {
            color: customColor
        });
        //assert series theme

        assert.ok(theme);
        assert.ok(theme.hoverStyle);
        assert.ok(theme.selectionStyle);
        assert.ok(theme.point);
        assert.ok(theme.point.hoverStyle);
        assert.ok(theme.point.selectionStyle);
        assert.equal(theme.mainSeriesColor, customColor);
        assert.equal(theme.color, customColor);
        assert.equal(theme.hoverStyle.color, undefined);
        assert.equal(theme.selectionStyle.color, undefined);
        assert.equal(theme.point.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
    });

    var commonSeriesThemeTemplate = {
        customTheme: true,
        border: {},
        hoverStyle: {
            border: {}
        },
        selectionStyle: {
            border: {}
        },
        point: {
            border: {},
            hoverStyle: {
                border: {}
            },
            selectionStyle: {
                border: {}
            }
        }
    };

    QUnit.test('Apply default series theme from parameters', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate)
        });
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", { color: 'customColor' });
        //assert series theme

        assert.ok(theme);
        assert.ok(theme.customTheme, 'Custom theme from parameter was applied');
    });

    QUnit.test('Apply type-specific default series theme from parameters', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: $.extend(true, {
                area: {
                    point: {
                        areaMerged: true
                    }
                }
            }, commonSeriesThemeTemplate)
        });
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", {
            type: 'area',
            color: 'customColor'
        });
        //assert series theme

        assert.ok(theme);
        assert.ok(theme.point.areaMerged, 'Params from line type specific-branch were applied');
    });

    QUnit.test('Apply type-specific default series theme from parameters (case-insensitive)', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: $.extend(true, {
                area: {
                    point: {
                        areaMerged: true
                    }
                }
            }, commonSeriesThemeTemplate)
        });
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", {
            type: 'AREa',
            color: 'customColor'
        });
        //assert series theme

        assert.ok(theme);
        assert.ok(theme.point.areaMerged, 'Params from line type specific-branch were applied');
    });

    QUnit.test('Apply user commonSeriesSetting with more priority then theme commonSeriesSetting.line', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                width: 10
            }
        });
        themeManager.setTheme({});
        themeManager._theme = {
            commonSeriesSettings: $.extend(true, {
                width: 6,
                line: {
                    width: 4
                }
            }, commonSeriesThemeTemplate)
        };
        //act
        var theme = themeManager.getOptions("series", {
            type: 'line'
        });
        //assert series theme
        assert.ok(theme);
        assert.strictEqual(theme.width, 10, 'Params from user-defined common series setting were were applied');
    });

    QUnit.test('Apply user commonSeriesSetting with more priority then theme commonSeriesSetting.line', function(assert) {
        //arrange
        var themeManager = createThemeManager({
                commonSeriesSettings: {
                    width: 10,
                    line: {
                        width: 12
                    }
                }
            }),
            mergedCommonSeriesSettings = $.extend(true, {
                width: 6,
                line: {
                    width: 4
                }
            }, commonSeriesThemeTemplate);
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: mergedCommonSeriesSettings };
        //act
        var theme = themeManager.getOptions("series", {
            type: 'line'
        });
        //assert series theme

        assert.ok(theme);
        assert.strictEqual(theme.width, 12, 'Params from user-defined common series setting were were applied');
    });

    QUnit.test('Apply user commonSeriesSetting color', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                border: { color: '#000001' },
                hoverStyle: { color: '#111112', border: { color: '#111113' } },
                selectionStyle: { color: '#111114', border: { color: '#111115' } },
                point: {
                    color: '#222221',
                    border: { color: '#222223' },
                    hoverStyle: { color: '#222224', border: { color: '#222225' } },
                    selectionStyle: { color: '#222226', border: { color: '#222227' } }
                }
            }
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", {});
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.mainSeriesColor, '#5f8b95');
        assert.equal(theme.color, undefined);
        assert.equal(theme.border.color, '#000001');
        assert.equal(theme.hoverStyle.color, '#111112');
        assert.equal(theme.hoverStyle.border.color, '#111113');
        assert.equal(theme.selectionStyle.color, '#111114');
        assert.equal(theme.selectionStyle.border.color, '#111115');
        assert.equal(theme.point.color, '#222221');
        assert.equal(theme.point.border.color, '#222223');
        assert.equal(theme.point.hoverStyle.color, '#222224');
        assert.equal(theme.point.hoverStyle.border.color, '#222225');
        assert.equal(theme.point.selectionStyle.color, '#222226');
        assert.equal(theme.point.selectionStyle.border.color, '#222227');
    });

    QUnit.test('Apply user series point color', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            containerBackgroundColor: '#111116',
            commonSeriesSettings: {
                border: { color: '#000001' },
                hoverStyle: { color: '#111112', border: { color: '#111113' } },
                selectionStyle: { color: '#111114', border: { color: '#111115' } },
                point: {
                    color: '#222221'
                }
            },
            resolveLabelOverlapping: true
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };

        //act
        var theme = themeManager.getOptions("series", {});
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.mainSeriesColor, '#5f8b95');
        assert.equal(theme.color, undefined);
        assert.equal(theme.border.color, '#000001');
        assert.equal(theme.hoverStyle.color, '#111112');
        assert.equal(theme.hoverStyle.border.color, '#111113');
        assert.equal(theme.selectionStyle.color, '#111114');
        assert.equal(theme.selectionStyle.border.color, '#111115');
        assert.equal(theme.point.color, '#222221');
        assert.equal(theme.point.border.color, undefined);
        assert.equal(theme.point.hoverStyle.color, undefined);
        assert.equal(theme.point.hoverStyle.border.color, undefined);
        assert.equal(theme.point.selectionStyle.color, undefined);
        assert.equal(theme.point.selectionStyle.border.color, undefined);
        assert.equal(theme.resolveLabelOverlapping, true);
    });

    QUnit.test("resolveLabelsOverlapping pass to series", function(assert) {
        var themeManager = createThemeManager({
            resolveLabelsOverlapping: true
        });
        themeManager.setTheme({});
        var theme = themeManager.getOptions("series", {});

        assert.ok(theme);
        assert.equal(theme.resolveLabelsOverlapping, true);
    });

    QUnit.test('Apply next series theme chart is bar. Point options are in series options field', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                color: '#000000',
                border: { color: '#000001' },
                hoverStyle: { color: '#111112', border: { color: '#111113' } },
                selectionStyle: { color: '#111114', border: { color: '#111115' } },
                visible: true,
                point: {
                    color: undefined,
                    border: { color: undefined },
                    hoverStyle: { color: undefined, border: { color: undefined } },
                    selectionStyle: { color: undefined, border: { color: undefined } },
                    visible: false
                }
            }
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };

        //act
        var theme = themeManager.getOptions("series", { type: 'bar' });
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.visible, true);
        assert.equal(theme.mainSeriesColor, '#000000', 'Theme color should be correct');
        assert.equal(theme.color, '#000000', 'Theme color should be correct');
        assert.equal(theme.border.color, '#000001', 'Theme border color should be correct');
        assert.equal(theme.hoverStyle.color, '#111112', 'Theme hover style color should be correct');
        assert.equal(theme.hoverStyle.border.color, '#111113', 'Theme hover style border color should be correct');
        assert.equal(theme.selectionStyle.color, '#111114', 'Theme selection style color should be correct');
        assert.equal(theme.selectionStyle.border.color, '#111115', 'Theme selection style border color should be correct');
        assert.equal(theme.point.color, undefined, 'Theme point color should be correct');
        assert.equal(theme.point.border.color, undefined, 'Theme point border color should be correct');
        assert.equal(theme.point.hoverStyle.color, undefined, 'Theme point hover style color should be correct');
        assert.equal(theme.point.hoverStyle.border.color, undefined, 'Theme point hover style border color should be correct');
        assert.equal(theme.point.selectionStyle.color, undefined, 'Theme point selection style color should be correct');
        assert.equal(theme.point.selectionStyle.border.color, undefined, 'Theme point selection style border color should be correct');
    });

    QUnit.test('Apply next series theme when there is bar point options', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {}
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", {
            type: 'bar',
            color: '#000000',
            border: {
                color: '#000001',
                visible: false,
                width: 1
            },
            hoverStyle: {
                color: '#111112',
                border: {
                    color: '#111113',
                    visible: false,
                    width: 2
                }
            },
            selectionStyle: {
                color: '#111114',
                border: {
                    color: '#111115',
                    visible: false,
                    width: 3
                }
            },
            point: {
                color: '#222220',
                border: {
                    color: '#222221',
                    visible: true,
                    width: 2
                },
                hoverStyle: {
                    color: '#222222',
                    border: {
                        color: '#222223',
                        visible: true,
                        width: 3
                    }
                },
                selectionStyle: {
                    color: '#222224',
                    border: {
                        color: '#222225',
                        visible: true,
                        width: 4
                    }
                }
            }
        });
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.color, '#222220', 'Theme color should be like point color');
        assert.equal(theme.border.color, '#222221', 'Theme border color should be like point border color');
        assert.equal(theme.border.visible, true, 'Theme border visible should be like point border visible');
        assert.equal(theme.border.width, 2, 'Theme border width should be like point border width');
        assert.equal(theme.hoverStyle.color, '#222222', 'Theme hover style color should be like point hover style color');
        assert.equal(theme.hoverStyle.border.color, '#222223', 'Theme hover style border color should be like point hover style border color');
        assert.equal(theme.hoverStyle.border.visible, true, 'Theme hover style border visible should be like point hover style border visible');
        assert.equal(theme.hoverStyle.border.width, 3, 'Theme hover style border width should be like point hover style border width');
        assert.equal(theme.selectionStyle.color, '#222224', 'Theme selection style color should be like point selection style color');
        assert.equal(theme.selectionStyle.border.color, '#222225', 'Theme selection style border color should be like point selection style border color');
        assert.equal(theme.selectionStyle.border.visible, true, 'Theme selection style border visible should be like point selection style border visible');
        assert.equal(theme.selectionStyle.border.width, 4, 'Theme selection style border width should be like point selection style border width');
    });

    QUnit.test('Apply next series theme when there is bubble point options', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {}
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", {
            type: 'bubble',
            color: '#000000',
            border: {
                color: '#000001',
                visible: false,
                width: 1
            },
            hoverStyle: {
                color: '#111112',
                border: {
                    color: '#111113',
                    visible: false,
                    width: 2
                }
            },
            selectionStyle: {
                color: '#111114',
                border: {
                    color: '#111115',
                    visible: false,
                    width: 3
                }
            },
            point: {
                color: '#222220',
                border: {
                    color: '#222221',
                    visible: true,
                    width: 2
                },
                hoverStyle: {
                    color: '#222222',
                    border: {
                        color: '#222223',
                        visible: true,
                        width: 3
                    }
                },
                selectionStyle: {
                    color: '#222224',
                    border: {
                        color: '#222225',
                        visible: true,
                        width: 4
                    }
                }
            }
        });
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.color, '#222220', 'Theme color should be like point color');
        assert.equal(theme.border.color, '#222221', 'Theme border color should be like point border color');
        assert.equal(theme.border.visible, true, 'Theme border visible should be like point border visible');
        assert.equal(theme.border.width, 2, 'Theme border width should be like point border width');
        assert.equal(theme.hoverStyle.color, '#222222', 'Theme hover style color should be like point hover style color');
        assert.equal(theme.hoverStyle.border.color, '#222223', 'Theme hover style border color should be like point hover style border color');
        assert.equal(theme.hoverStyle.border.visible, true, 'Theme hover style border visible should be like point hover style border visible');
        assert.equal(theme.hoverStyle.border.width, 3, 'Theme hover style border width should be like point hover style border width');
        assert.equal(theme.selectionStyle.color, '#222224', 'Theme selection style color should be like point selection style color');
        assert.equal(theme.selectionStyle.border.color, '#222225', 'Theme selection style border color should be like point selection style border color');
        assert.equal(theme.selectionStyle.border.visible, true, 'Theme selection style border visible should be like point selection style border visible');
        assert.equal(theme.selectionStyle.border.width, 4, 'Theme selection style border width should be like point selection style border width');
    });

    QUnit.test('Apply next series theme chart is bar. Point options are in common series settings field', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                color: '#000000',
                border: { color: '#000001' },
                hoverStyle: { color: '#111112', border: { color: '#111113' } },
                selectionStyle: { color: '#111114', border: { color: '#111115' } },
                point: {
                    color: undefined,
                    border: { color: undefined },
                    hoverStyle: { color: undefined, border: { color: undefined } },
                    selectionStyle: { color: undefined, border: { color: undefined } }
                }
            }
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", { type: 'bar' });
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.color, '#000000', 'Theme color should be correct');
        assert.equal(theme.border.color, '#000001', 'Theme border color should be correct');
        assert.equal(theme.hoverStyle.color, '#111112', 'Theme hover style color should be correct');
        assert.equal(theme.hoverStyle.border.color, '#111113', 'Theme hover style border color should be correct');
        assert.equal(theme.selectionStyle.color, '#111114', 'Theme selection style color should be correct');
        assert.equal(theme.selectionStyle.border.color, '#111115', 'Theme selection style border color should be correct');
        assert.equal(theme.point.color, undefined, 'Theme point color should be correct');
        assert.equal(theme.point.border.color, undefined, 'Theme point border color should be correct');
        assert.equal(theme.point.hoverStyle.color, undefined, 'Theme point hover style color should be correct');
        assert.equal(theme.point.hoverStyle.border.color, undefined, 'Theme point hover style border color should be correct');
        assert.equal(theme.point.selectionStyle.color, undefined, 'Theme point selection style color should be correct');
        assert.equal(theme.point.selectionStyle.border.color, undefined, 'Theme point selection style border color should be correct');
    });

    QUnit.test('Apply next series theme chart is bar. Point options are in common series settings point field', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                point: {
                    color: '#000000',
                    border: { color: '#000001' },
                    hoverStyle: { color: '#000002', border: { color: '#000003' } },
                    selectionStyle: { color: '#000004', border: { color: '#000005' } }
                }
            }
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", { type: 'bar' });
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.point.color, '#000000', 'Theme point color should be correct');
        assert.equal(theme.point.border.color, '#000001', 'Theme point border color should be correct');
        assert.equal(theme.point.hoverStyle.color, '#000002', 'Theme point hover style color should be correct');
        assert.equal(theme.point.hoverStyle.border.color, '#000003', 'Theme point hover style border color should be correct');
        assert.equal(theme.point.selectionStyle.color, '#000004', 'Theme point selection style color should be correct');
        assert.equal(theme.point.selectionStyle.border.color, '#000005', 'Theme point selection style border color should be correct');
    });

    QUnit.test('Apply next series theme chart is bar. Point options are in common series settings series and point field', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                color: '#111110',
                border: { color: '#111111' },
                hoverStyle: { color: '#111112', border: { color: '#111113' } },
                selectionStyle: { color: '#111114', border: { color: '#111115' } },
                point: {
                    color: '#000000',
                    border: { color: '#000001' },
                    hoverStyle: { color: '#000002', border: { color: '#000003' } },
                    selectionStyle: { color: '#000004', border: { color: '#000005' } }
                }
            }
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", { type: 'bar' });
        //assert series theme

        assert.ok(theme);
        assert.equal(theme.point.color, '#000000', 'Theme point color should be correct');
        assert.equal(theme.point.border.color, '#000001', 'Theme point border color should be correct');
        assert.equal(theme.point.hoverStyle.color, '#000002', 'Theme point hover style color should be correct');
        assert.equal(theme.point.hoverStyle.border.color, '#000003', 'Theme point hover style border color should be correct');
        assert.equal(theme.point.selectionStyle.color, '#000004', 'Theme point selection style color should be correct');
        assert.equal(theme.point.selectionStyle.border.color, '#000005', 'Theme point selection style border color should be correct');
    });

    QUnit.test('T243104. Inside label position.', function(assert) {
        var themeManager = createThemeManager({});
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };

        var lineTheme = themeManager.getOptions("series", { type: "line", label: { position: "inside" } }),
            splineTheme = themeManager.getOptions("series", { type: "spline", label: { position: "inside" } }),
            stepLineTheme = themeManager.getOptions("series", { type: "stepline", label: { position: "inside" } }),
            scatterTheme = themeManager.getOptions("series", { type: "scatter", label: { position: "inside" } }),
            stackedAreaTheme = themeManager.getOptions("series", { type: "stackedarea", label: { position: "inside" } }),
            barTheme = themeManager.getOptions("series", { type: "bar", label: { position: "inside" } }),
            rangeAreaTheme = themeManager.getOptions("series", { type: "rangearea", label: { position: "inside" } });

        assert.equal(lineTheme.label.position, 'outside');
        assert.equal(splineTheme.label.position, 'outside');
        assert.equal(stepLineTheme.label.position, 'outside');
        assert.equal(scatterTheme.label.position, 'outside');
        assert.equal(stackedAreaTheme.label.position, 'outside');
        assert.equal(barTheme.label.position, 'inside');
        assert.equal(rangeAreaTheme.label.position, 'inside');
    });

    QUnit.test('Check visible option for scatter. Series visible = true', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {}
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", {
            type: 'scatter',
            visible: true,
            point: {
                visible: false
            }
        });
        //assert series theme

        assert.ok(theme);
        assert.ok(theme.visible, "series visibility");
        assert.ok(!theme.point.visible, "point visibility");
    });

    QUnit.test('Check visible option for scatter. Series visible = false', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {}
        });
        themeManager.setTheme({});
        themeManager._theme = { commonSeriesSettings: $.extend(true, {}, commonSeriesThemeTemplate) };
        //act
        var theme = themeManager.getOptions("series", {
            type: 'scatter',
            visible: false,
            point: {
                visible: true
            }
        });
        //assert series theme

        assert.ok(theme);
        assert.ok(!theme.visible, "series visibility");
        assert.ok(theme.point.visible, "point visibility");
    });

    QUnit.test('default step highlight in palette', function(assert) {
        //arrange
        var palette = 'Soft Pastel';

        //act
        var themeManager = createThemeManager({
            palette: palette
        });
        themeManager.setTheme({});
        //assert
        assert.ok(themeManager);
        assert.equal(themeManager.palette._paletteSteps.next(), 50, 'default stepHighlight in palette');
        assert.equal(themeManager.palette._paletteSteps.next(), -50, 'default stepHighlight in palette');
        assert.equal(themeManager.palette._paletteSteps.next(), 0, 'default stepHighlight in palette');
        assert.equal(themeManager.palette._paletteSteps.next(), 50, 'default stepHighlight in palette');
    });

    QUnit.test('Theme chart manager for custom theme group', function(assert) {
        //arrange
        themeModule.registerTheme({
            name: 'RangeSelectorChartTheme',
            rangeSelector: {
                chart: {
                    test: true
                }
            }
        }, 'default');
        //act
        var options = {
            theme: 'RangeSelectorChartTheme'
        };
        var themeManager = createThemeManager(options, 'rangeSelector.chart');
        themeManager.setTheme(options.theme);
        var theme = themeManager.theme();
        //assert
        assert.ok(theme.test);
    });

})();

(function chart() {

    QUnit.module("Theme Manager - pie theme");

    QUnit.test('applyPieSeriesTheme with userOptions & commonSettings & commonUserSettings. B237181', function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                pie: {
                    border: {
                        width: 15
                    }
                },
                border: {
                    width: 30,
                    color: 'gray'
                },
                selectionStyle: {
                    border: {
                        visible: false,
                        width: 3
                    }
                }
            }
        }, "pie");
        themeManager.setTheme({});
        themeManager._theme = {
            commonSeriesSettings: {
                border: {
                    visible: false
                },
                pie: {
                    border: { visible: true }
                }
            }
        };
        //act
        var theme = themeManager.getOptions("series",
            {
                type: 'pie',
                border: {
                    color: '#ffffff'
                }
            }, true);
        //assert pie theme
        assert.ok(theme, 'Theme are created');

        assert.ok(theme.border.visible, 'Border visibility was applied');
        assert.equal(theme.border.width, 15, 'Border width was applied');
        assert.equal(theme.border.color, '#ffffff', 'Border color was applied');

        assert.ok(theme.selectionStyle, 'Theme selection style are created');
        assert.ok(!theme.selectionStyle.border.visible, 'Selection border visible was applied');
        assert.equal(theme.selectionStyle.border.width, 3, 'Selection border width was applied');
    });

    QUnit.test('applyPieSeriesTheme, type - donut', function(assert) {
        //arrange
        var themeManager = createThemeManager({}, "pie");
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", { type: 'donut' }, true);
        //assert pie theme
        assert.ok(theme);
        assert.ok(!theme.border.visible);
        assert.equal(theme.border.width, 2);
        assert.equal(theme.border.color, '#ffffff');

        assert.ok(theme.hoverStyle);
        assert.ok(!theme.hoverStyle.border.visible);
        assert.equal(theme.hoverStyle.border.width, 2);

        assert.ok(theme.selectionStyle);
        assert.ok(!theme.selectionStyle.border.visible);
        assert.equal(theme.selectionStyle.border.width, 2);
    });

    QUnit.test('applyPieSeriesTheme, type - doughnut', function(assert) {
        //arrange
        var themeManager = createThemeManager({}, "pie");
        themeManager.setTheme({});
        //act
        var theme = themeManager.getOptions("series", { type: 'doughnut' }, true);
        //assert pie theme
        assert.ok(theme);
        assert.ok(!theme.border.visible);
        assert.equal(theme.border.width, 2);
        assert.equal(theme.border.color, '#ffffff');

        assert.ok(theme.hoverStyle);
        assert.ok(!theme.hoverStyle.border.visible);
        assert.equal(theme.hoverStyle.border.width, 2);

        assert.ok(theme.selectionStyle);
        assert.ok(!theme.selectionStyle.border.visible);
        assert.equal(theme.selectionStyle.border.width, 2);
    });

    QUnit.test('applyPieSeriesTheme, donut theme equal doughnut theme', function(assert) {
        //arrange
        var themeManager = createThemeManager({}, "pie");
        themeManager.setTheme({});
        //act
        var doughnutTheme = themeManager.getOptions("series", { type: 'doughnut' }, true);
        var donutTheme = themeManager.getOptions("series", { type: 'donut' }, true);

        //types have differences
        doughnutTheme.type = null;
        donutTheme.type = null;
        //private options have differences
        doughnutTheme.donut = null;
        doughnutTheme.doughnut = null;
        donutTheme.donut = null;
        donutTheme.doughnut = null;
        doughnutTheme.mainSeriesColor = null,
        donutTheme.mainSeriesColor = null;

        //assert pie theme
        assert.deepEqual(donutTheme, doughnutTheme, 'Donut theme should be equal doughnut theme');
    });

    QUnit.test("applyPieSeriesTheme, type in root", function(assert) {
        //arrange
        var themeManager = createThemeManager({
            commonSeriesSettings: {
                pie: {
                    border: {
                        width: 15
                    }
                },
                border: {
                    width: 30,
                    color: 'gray'
                },
                selectionStyle: {
                    border: {
                        visible: false,
                        width: 3
                    }
                }
            }
        }, "pie");
        themeManager.setTheme({});
        themeManager._theme = {
            type: "pie",
            commonSeriesSettings: {
                border: {
                    visible: false
                },
                pie: {
                    border: { visible: true }
                }
            }
        };
        //act
        var theme = themeManager.getOptions("series",
            {
                border: {
                    color: '#ffffff'
                }
            }, true);
        //assert pie theme
        assert.ok(theme, 'Theme are created');

        assert.ok(theme.border.visible, 'Border visibility was applied');
        assert.equal(theme.border.width, 15, 'Border width was applied');
        assert.equal(theme.border.color, '#ffffff', 'Border color was applied');

        assert.ok(theme.selectionStyle, 'Theme selection style are created');
        assert.ok(!theme.selectionStyle.border.visible, 'Selection border visible was applied');
        assert.equal(theme.selectionStyle.border.width, 3, 'Selection border width was applied');
    });

    QUnit.module("Theme Manager - pie", {
        beforeEach: function() {
            this.borderColor = themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.border.color;
            this.hoverStyleColor = themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.hoverStyle.color;
            this.hoverStyleBorderColor = themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.hoverStyle.border.color;
            this.selectionStyleColor = themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.selectionStyle.color;
            this.selectionStyleBorderColor = themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.selectionStyle.border.color;
            delete themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.border.color;
            delete themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.hoverStyle.color;
            delete themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.hoverStyle.border.color;
            delete themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.selectionStyle.color;
            delete themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.selectionStyle.border.color;
        },
        afterEach: function() {
            themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.border.color = this.borderColor;
            themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.hoverStyle.color = this.hoverStyleColor;
            themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.hoverStyle.border.color = this.hoverStyleBorderColor;
            themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.selectionStyle.color = this.selectionStyleColor;
            themeModule.themes['generic.light'].pie.commonSeriesSettings.pie.selectionStyle.border.color = this.selectionStyleBorderColor;
        }
    });

    QUnit.test('series options for pie. mainSeriesColor. resetPalette', function(assert) {
        //arrange
        var themeManager = createThemeManager({}, "pie");
        themeManager.setTheme({});
        var seriesSettings = themeManager.getOptions("series", { type: "pie" });

        //assert pie theme
        assert.strictEqual(seriesSettings.mainSeriesColor("a", 1), "#5f8b95");
        assert.strictEqual(seriesSettings.mainSeriesColor("b", 2), "#ba4d51");
        themeManager.resetPalette();

        assert.strictEqual(seriesSettings.mainSeriesColor("a", 1), "#5f8b95");
        assert.strictEqual(seriesSettings.mainSeriesColor("b", 2), "#ba4d51");
        assert.strictEqual(seriesSettings.mainSeriesColor("c", 3), "#af8a53");
    });

    QUnit.test("series options for pie. mainSeriesColor", function(assert) {
        //arrange
        var themeManager = createThemeManager({}, "pie");
        themeManager.setTheme({});
        var seriesSettings = themeManager.getOptions("series", { type: "pie" });

        //assert pie theme
        assert.strictEqual(seriesSettings.mainSeriesColor("a", 1), "#5f8b95");
        assert.strictEqual(seriesSettings.mainSeriesColor("b", 2), "#ba4d51");

        assert.strictEqual(seriesSettings.mainSeriesColor("a", 1), "#5f8b95");
        assert.strictEqual(seriesSettings.mainSeriesColor("c", 3), "#af8a53");
    });

    QUnit.module("Theme Manager - life cycle");

    QUnit.test('Disposing', function(assert) {
        var paletteDisposed,
            themeManager = createThemeManager({});
        themeManager.setTheme({});

        themeManager.palette.dispose = function() { paletteDisposed = true; };

        //act
        themeManager.dispose();

        //assert
        assert.ok(paletteDisposed);
        assert.strictEqual(themeManager.palette, null);
        assert.strictEqual(themeManager._theme, null);
        assert.strictEqual(themeManager._font, null);
        assert.strictEqual(themeManager._userOptions, null);
        assert.strictEqual(themeManager._mergedSettings, null);
    });
})();

(function RTLSupport() {
    QUnit.module('RTL support', {
        beforeEach: function() {
            themeModule.registerTheme({
                name: 'rtlTheme',
                chart: {
                    _rtl: {
                        someOption: {
                            rtl: true
                        }
                    },
                    someOption: {
                        rtl: false
                    }
                }
            }, "desktop");
        }
    });

    QUnit.test("Do not patch theme", function(assert) {
        //act
        var options = { theme: 'rtlTheme' },
            themeManager = createThemeManager(options);
        themeManager.setTheme(options.theme);

        //assert
        assert.deepEqual(themeManager.getOptions("someOption"), { rtl: false });
    });

    QUnit.test("Patch theme based on user options", function(assert) {
        //act
        var options = { theme: 'rtlTheme', rtlEnabled: true },
            themeManager = createThemeManager(options);
        themeManager.setTheme(options.theme, true);

        //assert
        assert.deepEqual(themeManager.getOptions("someOption"), { rtl: true });
    });

    QUnit.test("Patch theme based on theme", function(assert) {
        themeModule.registerTheme({
            name: 'rtlTheme1',
            chart: {
                rtlEnabled: true,
                someOption: {
                    rtl: false
                },
                _rtl: {
                    someOption: {
                        rtl: true
                    }
                }
            }
        }, "desktop");

        //act
        var options = { theme: 'rtlTheme1' },
            themeManager = createThemeManager(options);
        themeManager.setTheme(options.theme);

        //assert
        assert.deepEqual(themeManager.getOptions("someOption"), { rtl: true });
    });

    QUnit.test("Do not patch theme (theme is rtl, options is ltr)", function(assert) {
        themeModule.registerTheme({
            name: 'rtlTheme1',
            chart: {
                rtlEnabled: true,
                someOption: {
                    rtl: false
                },
                _rtl: {
                    someOption: {
                        rtl: true
                    }
                }
            }
        }, "desktop");

        //act
        var options = { theme: 'rtlTheme1', rtlEnabled: false },
            themeManager = createThemeManager(options);
        themeManager.setTheme(options.theme, false);

        //assert
        assert.deepEqual(themeManager.getOptions("someOption"), { rtl: false });
    });

    QUnit.test("Apply rtl on theme resetting", function(assert) {
        themeModule.registerTheme({
            name: 'rtlTheme1',
            chart: {
                rtlEnabled: true,
                someOption: {
                    rtl: false
                },
                _rtl: {
                    someOption: {
                        rtl: true
                    }
                }
            }
        }, "desktop");

        var themeManager = createThemeManager({ theme: 'rtlTheme' });
        themeManager.setTheme('rtlTheme1');
        //act
        themeManager.setTheme('rtlTheme1');

        //assert
        assert.deepEqual(themeManager.getOptions("someOption"), { rtl: true });
    });
}());

(function getOptions() {
    themeModule.registerTheme({
        name: 'getOptionsTheme',
        chart: {
            firstLevelOption1: "from theme1",
            firstLevelOption2: "from theme2",
            firstLevelObject: {
                value1: "from theme1",
                value2: "from theme2"
            },
            commonSeriesSettings: {
                type: "themeType"
            },
            commonAxisSettings: {
                userCommonAxisSettings: false,
                themeCommonAxisSettings: true,
            },
            verticalAxis: {
                verticalAxisTheme: true,
                userCommonAxisSettings: false,
                myOptions: false
            },

            argumentAxisStyle: {
                argumentAxisStyleTheme: true,
                userCommonAxisSettings: false,
                myOptions: false
            },
            argumentAxis: {
                argumentAxisTheme: true,
            },
            horizontalAxis: {
                myOptions: false,
                horizontalAxisTheme: true
            },
            valueAxis: {
                valueAxisTheme: true
            }
        }
    }, "desktop");

    QUnit.module("getOptions", {
        beforeEach: function() {
            this.getOptions = function(options) {
                return $.extend(true, { theme: "getOptionsTheme" }, options);
            };
        },
        afterEach: function() {

        }
    });

    QUnit.test("getOptions", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            firstLevelOption2: "from user",
            firstLevelObject: {
                value1: "from user",
                value3: "from user3"
            }
        }));
        themeManager.setTheme("getOptionsTheme");

        assert.strictEqual(themeManager.getOptions("firstLevelOption1"), "from theme1");
        assert.strictEqual(themeManager.getOptions("firstLevelOption2"), "from user");
        assert.deepEqual(themeManager.getOptions("firstLevelObject"), {
            value1: "from user",
            value2: "from theme2",
            value3: "from user3"
        });
    });

    QUnit.test("getOptions. false", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            firstLevelOption2: false,
        }));
        themeManager.setTheme("getOptionsTheme");

        assert.strictEqual(themeManager.getOptions("firstLevelOption2"), false);
    });

    QUnit.test("setTheme after getOptions", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            firstLevelOption2: "from user",
            firstLevelObject: {
                value1: "from user",
                value3: "from user3"
            }
        }));
        themeManager.setTheme("getOptionsTheme");
        themeManager.getOptions("firstLevelOption1"), "from theme1";

        themeManager.setTheme("default");

        assert.strictEqual(themeManager.getOptions("firstLevelOption1"), undefined);
    });

    QUnit.test("Save getOptions result", function(assert) {
        var options = this.getOptions({
                firstLevelOption2: "from user",
                firstLevelObject: {
                    value1: "from user",
                    value3: "from user3"
                }
            }),
            themeManager = createThemeManager(options);
        themeManager.setTheme("getOptionsTheme");
        var result1 = themeManager.getOptions("firstLevelOption1"),
            result2 = themeManager.getOptions("firstLevelObject");

        themeManager.update({});

        assert.strictEqual(themeManager.getOptions("firstLevelOption1"), result1);
        assert.deepEqual(themeManager.getOptions("firstLevelObject"), result2);
    });

    QUnit.test("Reset saved getOptions result", function(assert) {
        var options = this.getOptions({
                firstLevelOption2: "from user",
                firstLevelObject: {
                    value1: "from user",
                    value3: "from user3"
                }
            }),
            themeManager = createThemeManager(options);
        themeManager.setTheme("getOptionsTheme");
        var result1 = themeManager.getOptions("firstLevelOption2"),
            result2 = themeManager.getOptions("firstLevelObject");
        options.firstLevelOption2 = "new value";
        themeManager.update(options);

        themeManager.resetOptions("firstLevelOption2");

        assert.ok(themeManager.getOptions("firstLevelOption2") !== result1);
        assert.deepEqual(themeManager.getOptions("firstLevelObject"), result2);

        assert.strictEqual(themeManager.getOptions("firstLevelOption2"), "new value");
    });

    QUnit.test("calculate series type from theme", function(assert) {
        var themeManager = createThemeManager(this.getOptions({}));
        themeManager.setTheme("getOptionsTheme");

        assert.strictEqual(themeManager.getOptions("series", {}).type, "themetype");
        assert.strictEqual(themeManager.getOptions("series", { type: "usertype" }).type, "usertype");

    });

    QUnit.test("calculate series type from commonSeriesSettings", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            commonSeriesSettings: {
                type: "commonType"
            }
        }));
        themeManager.setTheme("getOptionsTheme");

        assert.strictEqual(themeManager.getOptions("series", {}).type, "commontype");
        assert.strictEqual(themeManager.getOptions("series", { type: "usertype" }).type, "usertype");

    });

    QUnit.test("Process crosshair label font options", function(assert) {
        var themeManager = createThemeManager(this.getOptions({ crosshair: {} }));
        themeManager.setTheme("getOptionsTheme");

        assert.deepEqual(themeManager.getOptions("crosshair").label.font, {
            color: "#ffffff",
            cursor: "default",
            family: "'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana",
            size: 12,
            weight: 400
        });
    });

    QUnit.test("Axis options. Value Axis", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            commonAxisSettings: {
                userCommonAxisSettings: true,
                myOptions: false
            },
            verticalAxis: {
                verticalAxisUser: true,
                myOptions: false
            },
            valueAxis: {
                valueAxisStyleUser: true,
                myOptions: false
            },
            argumentAxis: {
                myOptions: false,
                argumentAxisUser: false
            },
            horizontalAxis: {
                myOptions: false,
                horizontalAxisUser: true
            }
        }));
        themeManager.setTheme("getOptionsTheme");
        var result = themeManager.getOptions("valueAxis", { myOptions: true });

        assert.ok(result.myOptions);
        assert.ok(result.userCommonAxisSettings);
        assert.ok(!result.verticalAxisUser);
        assert.ok(result.verticalAxisTheme);
        assert.ok(!result.valueAxisStyleUser);
        assert.ok(!result.argumentAxisStyleTheme);
        assert.ok(result.themeCommonAxisSettings);
        assert.ok(!result.horizontalAxisUser);
        assert.ok(!result.horizontalAxisTheme);
        assert.ok(result.valueAxisTheme);
        assert.ok(!result.argumentAxisTheme);
    });

    QUnit.test("Axis options. Value Axis.Rotated", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            commonAxisSettings: {
                userCommonAxisSettings: true,
                myOptions: false
            },
            valueAxis: {
                userOptions: true,
                myOptions: false,
            },
            verticalAxis: {
                verticalAxisUser: true,
                myOptions: false
            },
            argumentAxis: {
                myOptions: false,
                argumentAxisUser: false
            },
            horizontalAxis: {
                myOptions: false,
                horizontalAxisUser: true
            }
        }));
        themeManager.setTheme("getOptionsTheme");
        var result = themeManager.getOptions("valueAxis", { myOptions: true }, true);

        assert.ok(result.myOptions);
        assert.ok(result.userCommonAxisSettings);
        assert.ok(!result.verticalAxisUser);
        assert.ok(!result.verticalAxisTheme);
        assert.ok(!result.argumentAxisStyleTheme);
        assert.ok(result.themeCommonAxisSettings);
        assert.ok(!result.horizontalAxisUser);
        assert.ok(result.horizontalAxisTheme);
        assert.ok(result.valueAxisTheme);
        assert.ok(!result.argumentAxisTheme);
    });

    QUnit.test("Axis options. Argument Axis", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            commonAxisSettings: {
                userCommonAxisSettings: true,
                myOptions: false
            },
            valueAxis: {
                userOptions: true,
                myOptions: false,
            },
            verticalAxis: {
                verticalAxisUser: true,
                myOptions: false
            },
            argumentAxis: {
                myOptions: false,
                argumentAxisUser: false
            },
            horizontalAxis: {
                myOptions: false,
                horizontalAxisUser: true
            }
        }));
        themeManager.setTheme("getOptionsTheme");
        var result = themeManager.getOptions("argumentAxis", { myOptions: true });

        assert.ok(result.myOptions);
        assert.ok(result.userCommonAxisSettings);
        assert.ok(!result.verticalAxisUser);
        assert.ok(!result.verticalAxisTheme);
        assert.ok(result.themeCommonAxisSettings);
        assert.ok(!result.horizontalAxisUser);
        assert.ok(result.horizontalAxisTheme);
        assert.ok(result.argumentAxisTheme);
        assert.ok(!result.valueAxisTheme);
    });

    QUnit.test("Axis options. Argument Axis.Rotated", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            commonAxisSettings: {
                userCommonAxisSettings: true,
                myOptions: false
            },
            valueAxis: {
                userOptions: true,
                myOptions: false,
            },
            verticalAxis: {
                verticalAxisUser: true,
                myOptions: false
            },

            argumentAxis: {
                myOptions: false,
                argumentAxisUser: false
            },
            horizontalAxis: {
                myOptions: false,
                horizontalAxisUser: true
            }
        }));
        themeManager.setTheme("getOptionsTheme");
        var result = themeManager.getOptions("argumentAxis", { myOptions: true }, true);

        assert.ok(result.myOptions);
        assert.ok(result.userCommonAxisSettings);
        assert.ok(!result.verticalAxisUser);
        assert.ok(result.verticalAxisTheme);
        assert.ok(result.themeCommonAxisSettings);
        assert.ok(!result.horizontalAxisUser);
        assert.ok(!result.horizontalAxisTheme);
        assert.ok(result.argumentAxisTheme);
        assert.ok(!result.valueAxisTheme);
    });

    QUnit.test("Axis options. Process string", function(assert) {
        var themeManager = createThemeManager(this.getOptions({}));
        themeManager.setTheme("getOptionsTheme");
        var result = themeManager.getOptions("argumentAxis", { title: "axis" });

        assert.strictEqual(result.title.text, "axis");
    });

    QUnit.test("Axis options. Process string. commonAxisSettings", function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            commonAxisSettings: {
                title: "axis"
            }
        }));
        themeManager.setTheme("getOptionsTheme");
        var result = themeManager.getOptions("argumentAxis", {});

        assert.strictEqual(result.title.text, "axis");
    });

    QUnit.test('Invalid logarithmic type', function(assert) {
        var themeManager = createThemeManager(this.getOptions({}));
        themeManager.setTheme("getOptionsTheme");

        var doAssert = function(options, type, base, error, entity) {
            assert.equal(options.type, type, 'type of ' + entity);
            assert.equal(options.logarithmBase, base, 'logarithmicBase of ' + entity);
            assert.equal(options.logarithmBaseError, error, "error flag incorrect " + entity);
        };

        doAssert(themeManager.getOptions('argumentAxis', {
            type: 'logarithmic',
            logarithmBase: -1
        }), 'logarithmic', 10, true, 'argumentAxis');

        doAssert(themeManager.getOptions('valueAxis', {
            name: '1',
            type: 'logarithmic',
            logarithmBase: -1
        }), 'logarithmic', 10, true, 'valueAxis[0]');
        doAssert(themeManager.getOptions('valueAxis', {
            name: '2',
            type: 'logarithmic',
            logarithmBase: 2
        }), 'logarithmic', 2, undefined, 'valueAxis[1]');
        doAssert(themeManager.getOptions('valueAxis', {
            name: '3',
            type: 'logarithmic'
        }), 'logarithmic', 10, undefined, 'valueAxis[2]');
        doAssert(themeManager.getOptions('valueAxis', {
            name: '4',
            type: 'logarithmic',
            logarithmBase: 'some string'
        }), 'logarithmic', 10, true, 'valueAxis[3]');
    });

    QUnit.test('set label alignment in commonAxisSettings ', function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            commonAxisSettings: {
                label: {
                    rotationAngle: -90,
                    alignment: 'right'
                }
            }
        }));
        themeManager.setTheme("getOptionsTheme");

        //act
        var result = themeManager.getOptions("valueAxis", {});

        //assert
        assert.ok(result.label, 'Axis have option label');
        assert.ok(result.label.userAlignment, 'option label have flag userAlignment');
        assert.ok(result.label, 'Axis have option label');
        assert.ok(result.label.userAlignment, 'option label have flag userAlignment');
    });

    QUnit.test('set label alignment in axisSettings ', function(assert) {
        var themeManager = createThemeManager(this.getOptions({}));
        themeManager.setTheme("getOptionsTheme");
        //act
        var result = themeManager.getOptions("valueAxis", {
            label: {
                rotationAngle: -90,
                alignment: 'right'
            }
        });
        //assert
        assert.ok(result.label, 'Axis have option label');
        assert.ok(result.label.userAlignment, 'option label have flag userAlignment');
        assert.ok(result.label, 'Axis have option label');
        assert.ok(result.label.userAlignment, 'option label have flag userAlignment');
    });

    QUnit.test('Animation. boolean true', function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            animation: true
        }));
        themeManager.setTheme("getOptionsTheme");
        assert.deepEqual(themeManager.getOptions("animation"), {
            duration: 1000,
            easing: "easeOutCubic",
            enabled: true,
            maxPointCountSupported: 300
        });

    });

    QUnit.test('Animation. boolean false', function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            animation: false
        }));
        themeManager.setTheme("getOptionsTheme");
        assert.deepEqual(themeManager.getOptions("animation"), {
            duration: 1000,
            easing: "easeOutCubic",
            enabled: false,
            maxPointCountSupported: 300
        });

    });

    QUnit.test('Animation. undefined', function(assert) {
        var themeManager = createThemeManager(this.getOptions({
        }));
        themeManager.setTheme("getOptionsTheme");
        assert.deepEqual(themeManager.getOptions("animation"), {
            duration: 1000,
            easing: "easeOutCubic",
            enabled: true,
            maxPointCountSupported: 300
        });

    });

    QUnit.test('Animation. object', function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            animation: {
                duration: 2000,
                easing: "myeasing",
                enabled: true,
                maxPointCountSupported: 400
            }
        }));
        themeManager.setTheme("getOptionsTheme");
        assert.deepEqual(themeManager.getOptions("animation"), {
            duration: 2000,
            easing: "myeasing",
            enabled: true,
            maxPointCountSupported: 400
        });

    });

    QUnit.test('get valueAxis for rangeSelector', function(assert) {
        var themeManager = createThemeManager(this.getOptions({}));
        themeManager.setTheme("getOptionsTheme");
        assert.deepEqual(themeManager.getOptions('valueAxisRangeSelector'), {
            valueAxisTheme: true,
            grid: {
                visible: true
            }
        });
    });

    QUnit.test('get valueAxis for rangeSelector with preset values', function(assert) {
        var themeManager = createThemeManager(this.getOptions({
            valueAxis: {
                logarithmBase: 2,
                someField: 'someValue'
            }
        }));
        themeManager.setTheme("getOptionsTheme");

        assert.deepEqual(themeManager.getOptions('valueAxisRangeSelector'), {
            grid: {
                visible: true
            },
            logarithmBase: 2,
            someField: 'someValue',
            valueAxisTheme: true
        });
    });

})();
