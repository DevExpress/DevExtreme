const $ = require('jquery');
const themeModule = require('viz/themes');
const BaseThemeManager = require('viz/core/base_theme_manager').BaseThemeManager;
const currentTheme = themeModule.currentTheme();
const paletteModule = require('viz/palette');

themeModule.registerTheme({
    name: 'custom',
    chart: {
        isCustomTheme: true,
        legend: {
            visible: true,
            padding: 10,
            markerSize: 25,
            borderWidth: 1
        }
    }
});

themeModule.registerTheme({
    name: 'custom-default-palette',
    defaultPalette: 'some-default-palette'
});

themeModule.registerTheme({
    name: 'custom-default-gradient-palette',
    defaultPalette: ['#000000', '#100000']
});

const environment = {
    beforeEach: function() {
        themeModule.currentTheme(currentTheme);
        this.themeManager = new BaseThemeManager({ fontFields: [] });
        this.callback = sinon.spy();
        this.themeManager.setCallback(this.callback);
        this.createPalette = sinon.stub(paletteModule, 'createPalette');
        this.getDiscretePalette = sinon.stub(paletteModule, 'getDiscretePalette');
        this.getAccentColor = sinon.stub(paletteModule, 'getAccentColor');
    },

    afterEach: function() {
        this.themeManager.dispose();
        this.createPalette.restore();
        this.getDiscretePalette.restore();
        this.getAccentColor.restore();
    }
};

QUnit.module('Common', environment);

QUnit.test('set theme', function(assert) {
    this.themeManager.setTheme('custom');

    assert.strictEqual(this.themeManager.themeName(), 'custom', 'theme');
    assert.deepEqual(this.callback.lastCall.args, [], 'callback');
});

QUnit.test('set unknown theme', function(assert) {
    this.themeManager.setTheme('some-theme');

    assert.strictEqual(this.themeManager.themeName(), currentTheme, 'theme');
    assert.deepEqual(this.callback.lastCall.args, [], 'callback');
});

QUnit.test('refresh', function(assert) {
    this.themeManager.setTheme().refresh();

    assert.strictEqual(this.themeManager.themeName(), currentTheme, 'theme');
    assert.strictEqual(this.callback.callCount, 2, 'callback');
});

QUnit.test('refresh when current theme is changed and theme is set', function(assert) {
    this.themeManager.setTheme('custom');
    themeModule.currentTheme('generic.dark');
    this.themeManager.refresh();

    assert.strictEqual(this.themeManager.themeName(), 'custom', 'theme');
    assert.strictEqual(this.callback.callCount, 2, 'callback');
});

QUnit.test('refresh when current theme is changed and theme is not set', function(assert) {
    this.themeManager.setTheme('some-theme');
    themeModule.currentTheme('generic.dark');
    this.themeManager.refresh();

    assert.strictEqual(this.themeManager.themeName(), 'generic.dark', 'theme');
    assert.strictEqual(this.callback.callCount, 2, 'callback');
});

QUnit.module('Cache', {
    cache: themeModule.widgetsCache,

    create: function() {
        return new BaseThemeManager({});
    }
});

QUnit.test('Adding and removing', function(assert) {
    const item = this.create();
    let k;
    $.each(this.cache, function(i) {
        k = i;
        return false;
    });
    assert.strictEqual(this.cache[k], item);
    item.dispose();
    assert.strictEqual(this.cache[k], undefined);
});

QUnit.module('Themes', environment);

QUnit.test('default theme', function(assert) {
    // act
    this.themeManager.setTheme();
    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'generic.light');
    assert.ok(theme);
    assert.equal(theme.name, 'generic.light');
    assert.ok(theme.font);
    assert.ok(theme.rangeSelector);
    assert.ok(theme.gauge);
    assert.ok(theme.chart);
});

QUnit.test('default theme with groupName', function(assert) {
    // act
    this.themeManager._themeSection = 'rangeSelector';
    this.themeManager.setTheme('generic');
    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'generic.light');
    assert.ok(theme);
    assert.ok(theme.sliderMarker);
    assert.ok(theme.scale);
    assert.ok(theme.chart);
});

QUnit.test('default theme with complex groupName', function(assert) {
    // act
    this.themeManager._themeSection = 'rangeSelector.scale';
    this.themeManager.setTheme('generic.light');
    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'generic.light');
    assert.ok(theme);
    assert.ok(theme.tick);
    assert.ok(theme.marker);
});

QUnit.test('customize default theme', function(assert) {
    // act
    this.themeManager.setTheme({
        chart: {
            legend: {
                borderWidth: 1
            }
        }
    });
    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'generic.light');
    assert.ok(theme);
    assert.equal(theme.name, 'generic.light');
    assert.equal(theme.chart.legend.borderWidth, 1);
    assert.ok(theme.chart.legend.visible);
});

QUnit.test('customize theme with groupName', function(assert) {
    // act
    this.themeManager._themeSection = 'chart';
    this.themeManager.setTheme({
        legend: {
            borderWidth: 1
        }
    });
    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'generic.light');
    assert.ok(theme);
    assert.equal(theme.legend.borderWidth, 1);
    assert.ok(theme.legend.visible);
});

QUnit.test('customize custom theme', function(assert) {
    // act
    this.themeManager._themeSection = 'chart';
    this.themeManager.setTheme({
        name: 'custom',
        legend: {
            markerSize: 15,
            borderWidth: 0
        }
    });

    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'custom');
    assert.ok(theme);
    assert.ok(theme.isCustomTheme);
    assert.ok(theme.legend.visible);
    assert.equal(theme.legend.markerSize, 15);
    assert.equal(theme.legend.borderWidth, 0);
});

QUnit.test('global customized theme', function(assert) {
    // act
    themeModule.getTheme('custom').chart.isGlobalCustomized = true;

    this.themeManager._themeSection = 'chart';
    this.themeManager.setTheme('custom');
    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'custom');
    assert.ok(theme);
    assert.ok(theme.isCustomTheme);
    assert.ok(theme.isGlobalCustomized);
});

QUnit.test('theme by name', function(assert) {
    // act
    this.themeManager._themeSection = 'chart';
    this.themeManager.setTheme('custom');
    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'custom');
    assert.ok(theme);
    assert.ok(theme.isCustomTheme);
    assert.ok(theme.legend.visible);
    assert.equal(theme.legend.markerSize, 25);
    assert.equal(theme.legend.borderWidth, 1);
});

QUnit.test('initializeFont', function(assert) {
    this.themeManager.setTheme({
        testLabel: {
            font: {
                color: 'white'
            }
        }
    });

    // act
    this.themeManager._initializeFont(this.themeManager.theme().testLabel.font);

    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'generic.light');
    assert.ok(theme);
    assert.ok(theme.testLabel);
    assert.equal(theme.testLabel.font.color, 'white', 'color');
    assert.equal(theme.testLabel.font.size, 12, 'size');
    assert.equal(theme.testLabel.font.family, '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif', 'Font families');
    assert.equal(theme.testLabel.font.cursor, 'default');
});

QUnit.test('initializeFont from customized font', function(assert) {
    this.themeManager.setTheme({
        font: {
            size: 16,
            color: 'black',
            family: 'Times New Roman',
            style: 'custom'
        },
        testLabel: {
            color: 'white'
        }
    });

    // act
    this.themeManager._initializeFont(this.themeManager.theme().testLabel);

    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'generic.light');
    assert.ok(theme);
    assert.ok(theme.testLabel);
    assert.equal(theme.testLabel.color, 'white', 'color');
    assert.equal(theme.testLabel.size, 16, 'size');
    assert.equal(theme.testLabel.family, 'Times New Roman', 'family');
    assert.equal(theme.testLabel.style, 'custom', 'style');
});

QUnit.test('initializeFont from customized font with groupName', function(assert) {
    this.themeManager.setTheme({
        name: 'custom',
        font: {
            size: 16,
            color: 'black',
            family: 'Times New Roman',
            style: 'custom'
        },
        legend: {
            testLabel: {
                color: 'white'
            }
        }
    }, 'chart');

    // act
    this.themeManager._initializeFont(this.themeManager.theme().legend.testLabel);

    const theme = this.themeManager.theme();

    // assert
    assert.equal(this.themeManager.themeName(), 'custom');
    assert.ok(theme);
    assert.ok(theme.legend.testLabel);
    assert.equal(theme.legend.testLabel.color, 'white', 'color');
    assert.equal(theme.legend.testLabel.size, 16, 'size');
    assert.equal(theme.legend.testLabel.family, 'Times New Roman', 'family');
    assert.equal(theme.legend.testLabel.style, 'custom', 'style');
});

QUnit.test('theme getter', function(assert) {
    this.themeManager._themeSection = 'chart';
    this.themeManager.setTheme({
        option1: 100,
        option2: {
            option21: 'hello',
            option22: {
                option221: 200
            }
        }
    });

    assert.strictEqual(this.themeManager.theme().option1, 100, 'option1');
    assert.deepEqual(this.themeManager.theme().option2, {
        option21: 'hello',
        option22: {
            option221: 200
        }
    }, 'option2');

    assert.strictEqual(this.themeManager.theme('option1'), 100, 'option1 by name');
    assert.deepEqual(this.themeManager.theme('option2'), {
        option21: 'hello',
        option22: {
            option221: 200
        }
    }, 'option2 by name');

    assert.strictEqual(this.themeManager.theme('option2.option21'), 'hello', 'option21 by name');
    assert.deepEqual(this.themeManager.theme('option2.option22'), {
        option221: 200
    }, 'option22 by name');
    assert.strictEqual(this.themeManager.theme('option2.option22.option221'), 200, 'option221 by name');

    assert.strictEqual(this.themeManager.theme('option3'), undefined, 'option3 by name / unknown option');
    assert.strictEqual(this.themeManager.theme('option2.option23'), undefined, 'option23 by name / unknown option');
    assert.strictEqual(this.themeManager.theme('option2.option22.option222'), undefined, 'option222 by name / unknown option');
});

QUnit.test('initializeFont via font fields', function(assert) {
    // act
    this.themeManager = new BaseThemeManager({ fontFields: ['testLabel1.font', 'testObject2.testLabel2.font'] });
    this.themeManager.setCallback(this.callback);
    this.themeManager.setTheme({
        testLabel1: {
            font: {
                color: 'white'
            }
        },
        testObject2: {
            testLabel2: {
                font: {
                    size: 20
                }
            }
        }
    });

    // assert
    assert.deepEqual(this.themeManager.theme('testLabel1.font'), {
        size: 12, cursor: 'default', weight: 400, color: 'white',
        family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif'
    }, 'font 1');
    assert.deepEqual(this.themeManager.theme('testObject2.testLabel2.font'), {
        size: 20, cursor: 'default', weight: 400, color: '#767676',
        family: '\'Segoe UI\', \'Helvetica Neue\', \'Trebuchet MS\', Verdana, sans-serif'
    }, 'font 2');
});

QUnit.module('Palettes', environment);

QUnit.test('Create palette', function(assert) {
    this.themeManager.setTheme('custom');

    const palette = this.themeManager.createPalette('paletteName', { palette: 'options' });

    assert.ok(this.createPalette.calledOnce);
    assert.ok(this.createPalette.firstCall.calledWithNew);
    assert.strictEqual(palette, this.createPalette.firstCall.returnValue);
    assert.deepEqual(this.createPalette.firstCall.args, ['paletteName', { palette: 'options' }, undefined]);
});

QUnit.test('Create discrete palette', function(assert) {
    this.themeManager.setTheme('custom');

    const palette = this.themeManager.createDiscretePalette('paletteName', 13);

    assert.ok(this.getDiscretePalette.calledOnce);
    assert.ok(this.getDiscretePalette.firstCall.calledWithNew);
    assert.strictEqual(palette, this.getDiscretePalette.firstCall.returnValue);
    assert.deepEqual(this.getDiscretePalette.firstCall.args, ['paletteName', 13, undefined]);
});

QUnit.test('Create gradient palette', function(assert) {
    this.themeManager.setTheme('custom');

    const palette = this.themeManager.createGradientPalette(['#000000', '#080000']);

    assert.strictEqual(palette.getColor(0.25), '#020000');
});

QUnit.test('Create palette. With default palette', function(assert) {
    this.themeManager.setTheme('custom-default-palette');

    const palette = this.themeManager.createPalette(undefined, { palette: 'options' });

    assert.ok(this.createPalette.calledOnce);
    assert.ok(this.createPalette.firstCall.calledWithNew);
    assert.strictEqual(palette, this.createPalette.firstCall.returnValue);
    assert.deepEqual(this.createPalette.firstCall.args, [undefined, { palette: 'options' }, 'some-default-palette']);
});

QUnit.test('Create discrete palette. With default palette', function(assert) {
    this.themeManager.setTheme('custom-default-palette');

    const palette = this.themeManager.createDiscretePalette(undefined, 13);

    assert.ok(this.getDiscretePalette.calledOnce);
    assert.ok(this.getDiscretePalette.firstCall.calledWithNew);
    assert.strictEqual(palette, this.getDiscretePalette.firstCall.returnValue);
    assert.deepEqual(this.getDiscretePalette.firstCall.args, [undefined, 13, 'some-default-palette']);
});

QUnit.test('Create gradient palette. With default palette', function(assert) {
    this.themeManager.setTheme('custom-default-gradient-palette');

    const palette = this.themeManager.createGradientPalette(undefined);

    assert.strictEqual(palette.getColor(0.25), '#040000');
});

QUnit.test('Create palette. Palette and default palette', function(assert) {
    this.themeManager.setTheme('custom-default-palette');

    const palette = this.themeManager.createPalette('paletteName', { palette: 'options' });

    assert.ok(this.createPalette.calledOnce);
    assert.ok(this.createPalette.firstCall.calledWithNew);
    assert.strictEqual(palette, this.createPalette.firstCall.returnValue);
    assert.deepEqual(this.createPalette.firstCall.args, ['paletteName', { palette: 'options' }, 'some-default-palette']);
});

QUnit.test('Create discrete palette. Palette and default palette', function(assert) {
    this.themeManager.setTheme('custom-default-palette');

    const palette = this.themeManager.createDiscretePalette('paletteName', 13);

    assert.ok(this.getDiscretePalette.calledOnce);
    assert.ok(this.getDiscretePalette.firstCall.calledWithNew);
    assert.strictEqual(palette, this.getDiscretePalette.firstCall.returnValue);
    assert.deepEqual(this.getDiscretePalette.firstCall.args, ['paletteName', 13, 'some-default-palette']);
});

QUnit.test('Get palette\'s accent color', function(assert) {
    this.getAccentColor.returns('accent color');
    this.themeManager.setTheme('custom-default-palette');

    const color = this.themeManager.getAccentColor('paletteName');

    assert.equal(color, 'accent color');
    assert.deepEqual(this.getAccentColor.lastCall.args, ['paletteName', 'some-default-palette']);
});
