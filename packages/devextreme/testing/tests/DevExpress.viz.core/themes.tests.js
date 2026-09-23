import $ from 'jquery';
import themeModule from 'viz/themes';
import { getTheme as getRegisteredTheme } from '__internal/viz/themes';
import { createPalette, getGradientPalette } from '__internal/viz/palette';
import uiThemeModule from 'ui/themes';

uiThemeModule.setDefaultTimeout(0);

QUnit.moduleStart(function() {
    $.each([
        { platform: 'platform' },
        { name: 'platform1', isCustomTheme: true },
        { name: 'platform1.dark' },
        { name: 'platform2' },
        { name: 'platform2.dark' },
        { name: 'platform2.light' },
        { name: 'platform3' },
        { name: 'platform3.holo-light' },
        { name: 'platform3.holo-dark' }
    ], function(_, options) {
        themeModule.registerTheme(options);
    });

    themeModule.registerThemeSchemeAlias('platform3.light', 'platform3.holo-light');
    themeModule.registerThemeSchemeAlias('platform3.dark', 'platform3.holo-dark');
});

QUnit.testStart(function() {
    themeModule.currentTheme('generic');
});

QUnit.module('Register theme');

QUnit.test('registerTheme', function(assert) {
    themeModule.registerTheme({
        name: 'custom theme',
        isCustomTheme1: true
    });

    const theme = themeModule.getTheme('custom theme');

    assert.ok(theme);
    assert.ok(theme.isCustomTheme1);
});

QUnit.test('registerTheme based on theme', function(assert) {
    themeModule.registerTheme({
        name: 'platform',
        isCustomTheme: true
    }, 'platform');

    themeModule.registerTheme({
        name: 'custom theme 2',
        isCustomTheme2: true
    }, 'platform');

    const theme = themeModule.getTheme('custom theme 2');

    assert.ok(theme);
    assert.ok(theme.isCustomTheme);
    assert.ok(!theme.isCustomTheme1);
    assert.ok(theme.isCustomTheme2);
});

QUnit.test('registerTheme with options', function(assert) {
    const lightTheme = {
        platform: 'platform',
        version: '5',
        tone: 'light',
        name: 'platform5.light'
    };

    themeModule.registerTheme(lightTheme);

    $.each(lightTheme, function(key, value) {
        assert.equal(themeModule.getTheme('platform5.light')[key], value);
    });
});

QUnit.test('register compact theme with the same name (T925673)', function(assert) {
    const darkTheme = {
        name: 'generic.dark.compact',
        rangeSelector: { background: { color: 'test-background' } },
    };
    themeModule.registerTheme(darkTheme, 'generic.dark.compact');

    assert.deepEqual(themeModule.getTheme('generic.dark.compact').rangeSelector.background, {
        'color': 'test-background',
        'image': {
            'location': 'full'
        },
        'visible': true
    });
});

QUnit.test('Patched properties on register theme', function(assert) {
    let theme = {
        name: 'custom theme',
        defaultPalette: 'custom palette',
        backgroundColor: 'background color',
        primaryTitleColor: 'primary title color',
        secondaryTitleColor: 'secondary title color',
        gridColor: 'grid color',
        axisColor: 'axis color',
        redrawOnResize: 'redraw on resize',
        tooltip: { some: 'tooltip settings' },
        'export': {
            some: 'export settings',
            font: {
                some: 'font settings'
            }
        },
        loadingIndicator: { some: 'loadingIndicator settings' },
        legend: { some: 'legend settings' },
        title: {
            some: 'title settings',
            subtitle: {
                some: 'subtitle settings'
            }
        },
        'chart:common:axis': { some: 'common axis settings' },
        'chart:common': { some: 'common chart settings' },
        map: {
            layer: { 'layer-tag': 1 },
            'layer:marker': { 'layer:marker-tag': 2 }
        }
    };
    themeModule.resetCurrentTheme();

    themeModule.registerTheme(theme);

    theme = themeModule.getTheme('custom theme');

    // backgroundColor
    assert.strictEqual(theme.loadingIndicator.backgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.chart.commonSeriesSettings.candlestick.innerColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.map.background.color, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.map.legend.backgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.chart.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.pie.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.polar.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.gauge.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.barGauge.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.map.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.rangeSelector.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.sparkline.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.bullet.containerBackgroundColor, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.gauge.scale.tick.color, theme.backgroundColor, 'backgroundColor');
    assert.strictEqual(theme.gauge.scale.minorTick.color, theme.backgroundColor, 'backgroundColor');

    // commonAxisSettings
    assert.deepEqual(theme.chart.commonAxisSettings, theme['chart:common:axis'], 'commonAxisSettings');
    assert.deepEqual(theme.polar.commonAxisSettings, theme['chart:common:axis'], 'commonAxisSettings');

    // primaryTitleColor
    assert.strictEqual(theme.title.font.color, theme.primaryTitleColor, 'primaryTitleColor');

    // secondaryTitleColor
    assert.strictEqual(theme.legend.font.color, theme.secondaryTitleColor, 'secondaryTitleColor');
    assert.deepEqual(theme.chart.commonAxisSettings.title.font.color, theme.secondaryTitleColor, 'secondaryTitleColor');
    assert.deepEqual(theme.polar.commonAxisSettings.title.font.color, theme.secondaryTitleColor, 'secondaryTitleColor');

    // gridColor
    assert.strictEqual(theme.legend.border.color, theme.gridColor, 'gridColor');
    assert.deepEqual(theme.chart.commonAxisSettings.grid.color, theme.gridColor, 'gridColor');
    assert.deepEqual(theme.chart.commonAxisSettings.minorGrid.color, theme.gridColor, 'gridColor');
    assert.deepEqual(theme.polar.commonAxisSettings.grid.color, theme.gridColor, 'gridColor');
    assert.deepEqual(theme.polar.commonAxisSettings.minorGrid.color, theme.gridColor, 'gridColor');

    // axisColor
    assert.deepEqual(theme.chart.commonAxisSettings.color, theme.axisColor, 'axisColor');
    assert.deepEqual(theme.chart.commonAxisSettings.tick.color, theme.axisColor, 'axisColor');
    assert.deepEqual(theme.chart.commonAxisSettings.minorTick.color, theme.axisColor, 'axisColor');
    assert.deepEqual(theme.polar.commonAxisSettings.color, theme.axisColor, 'axisColor');
    assert.deepEqual(theme.polar.commonAxisSettings.tick.color, theme.axisColor, 'axisColor');
    assert.deepEqual(theme.polar.commonAxisSettings.minorTick.color, theme.axisColor, 'axisColor');
    assert.strictEqual(theme.gauge.scale.label.font.color, theme.axisColor, 'axisColor');
    assert.strictEqual(theme.rangeSelector.scale.label.font.color, theme.axisColor, 'axisColor');
    assert.deepEqual(theme.chart.commonAxisSettings.label.font.color, theme.axisColor, 'axisColor');
    assert.deepEqual(theme.polar.commonAxisSettings.label.font.color, theme.axisColor, 'axisColor');

    // redrawOnResize
    assert.strictEqual(theme.chart.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.pie.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.polar.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.gauge.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.barGauge.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.map.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.rangeSelector.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.sparkline.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');
    assert.strictEqual(theme.bullet.redrawOnResize, theme.redrawOnResize, 'redrawOnResize');

    // tooltip
    assert.deepEqual(theme.chart.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.pie.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.polar.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.gauge.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.barGauge.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.map.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.rangeSelector.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.sparkline.tooltip, theme.tooltip, 'tooltip');
    assert.deepEqual(theme.bullet.tooltip, theme.tooltip, 'tooltip');

    // loadingIndicator
    assert.deepEqual(theme.chart.loadingIndicator, theme.loadingIndicator, 'loadingIndicator');
    assert.deepEqual(theme.pie.loadingIndicator, theme.loadingIndicator, 'loadingIndicator');
    assert.deepEqual(theme.polar.loadingIndicator, theme.loadingIndicator, 'loadingIndicator');
    assert.deepEqual(theme.gauge.loadingIndicator, theme.loadingIndicator, 'loadingIndicator');
    assert.deepEqual(theme.barGauge.loadingIndicator, theme.loadingIndicator, 'loadingIndicator');
    assert.deepEqual(theme.map.loadingIndicator, theme.loadingIndicator, 'loadingIndicator');
    assert.deepEqual(theme.rangeSelector.loadingIndicator, theme.loadingIndicator, 'loadingIndicator');

    // export
    assert.deepEqual(theme.chart.export, theme.export, 'export');
    assert.deepEqual(theme.pie.export, theme.export, 'export');
    assert.deepEqual(theme.polar.export, theme.export, 'export');
    assert.deepEqual(theme.gauge.export, theme.export, 'export');
    assert.deepEqual(theme.barGauge.export, theme.export, 'export');
    assert.deepEqual(theme.map.export, theme.export, 'export');
    assert.deepEqual(theme.rangeSelector.export, theme.export, 'export');
    assert.deepEqual(theme.sparkline.export, theme.export, 'export');
    assert.deepEqual(theme.bullet.export, theme.export, 'export');

    // legend
    assert.deepEqual(theme.chart.legend, theme.legend, 'legend');
    assert.deepEqual(theme.pie.legend, theme.legend, 'legend');
    assert.deepEqual(theme.polar.legend, theme.legend, 'legend');
    assert.deepEqual(theme.gauge.legend, theme.legend, 'legend');
    assert.deepEqual(theme.barGauge.legend, theme.legend, 'legend');
    assert.deepEqual(theme.map.legend, $.extend({}, theme.legend, { backgroundColor: theme.backgroundColor }), 'legend');
    assert.deepEqual(theme.rangeSelector.legend, theme.legend, 'legend');

    // title
    assert.deepEqual(theme.chart.title, theme.title, 'title');
    assert.deepEqual(theme.pie.title, theme.title, 'title');
    assert.deepEqual(theme.polar.title, theme.title, 'title');
    assert.deepEqual(theme.gauge.title, theme.title, 'title');
    assert.deepEqual(theme.barGauge.title, theme.title, 'title');
    assert.deepEqual(theme.map.title, theme.title, 'title');

    // common chart settings
    assert.deepEqual(theme.chart, $.extend(true, {}, theme.chart, theme['chart:common']), 'common chart settings');
    assert.deepEqual(theme.pie, $.extend(true, {}, theme.pie, theme['chart:common']), 'common chart settings');
    assert.deepEqual(theme.polar, $.extend(true, {}, theme.polar, theme['chart:common']), 'common chart settings');

    // rangeSelector commonSeriesSettings
    assert.deepEqual(theme.rangeSelector.chart.commonSeriesSettings, theme.chart.commonSeriesSettings, 'rangeSelector commonSeriesSettings');

    // rangeSelector dataPrepareSettings
    assert.deepEqual(theme.rangeSelector.chart.dataPrepareSettings, theme.chart.dataPrepareSettings, 'rangeSelector dataPrepareSettings');

    // map
    $.each(['area', 'line', 'marker:dot', 'marker:bubble', 'marker:pie', 'marker:image'], function(_, name) {
        assert.strictEqual(theme.map['layer:' + name]['layer-tag'], 1, 'map layer:' + name + ' from layer');
    });
    $.each(['dot', 'bubble', 'pie', 'image'], function(_, name) {
        assert.strictEqual(theme.map['layer:marker:' + name]['layer:marker-tag'], 2, 'map layer:marker:' + name + ' from layer:marker');
    });

    // treeMap
    assert.strictEqual(theme.treeMap.group.border.color, theme.gridColor, 'treeMap - group.border.color');
    assert.strictEqual(theme.treeMap.tile.selectionStyle.border.color, theme.primaryTitleColor, 'treeMap - tile.selectionStyle.border.color');
    assert.strictEqual(theme.treeMap.group.selectionStyle.border.color, theme.primaryTitleColor, 'treeMap - group.selectionStyle.border.color');
});

QUnit.module('Themes functions');

QUnit.test('getTheme', function(assert) {
    const theme = themeModule.getTheme('platform1');

    assert.ok(theme);
    assert.ok(theme.isCustomTheme);
});

QUnit.test('getTheme not exists', function(assert) {
    assert.strictEqual(themeModule.getTheme('not exists').name, 'generic.light');
});

QUnit.module('currentTheme method.');

QUnit.test('Get default theme', function(assert) {
    const currentTheme = themeModule.currentTheme();

    assert.strictEqual(currentTheme, 'generic.light', 'valid default theme');
});

QUnit.test('get platform with version', function(assert) {
    themeModule.currentTheme({
        platform: 'platform',
        version: '1'
    });

    assert.equal(themeModule.currentTheme(), 'platform1');
});

QUnit.test('get theme with tone', function(assert) {
    themeModule.currentTheme({
        platform: 'platform',
        version: '2'
    }, 'light');

    assert.equal(themeModule.currentTheme(), 'platform2.light');
});

QUnit.test('get theme with tone. another name', function(assert) {
    themeModule.currentTheme({
        platform: 'platform',
        version: '3'
    }, 'dark');

    assert.equal(themeModule.currentTheme(), 'platform3.holo-dark');
});

QUnit.test('not exist version', function(assert) {
    themeModule.currentTheme({
        platform: 'platform',
        version: '100'
    });

    assert.equal(themeModule.currentTheme(), 'platform');
});

QUnit.test('currentTheme return registered default theme', function(assert) {
    themeModule.resetCurrentTheme();
    themeModule.registerTheme({
        name: 'custom default theme',
        isDefault: true
    });
    const currentTheme = themeModule.currentTheme();

    assert.strictEqual(currentTheme, 'custom default theme');
});

QUnit.test('Invalid input data', function(assert) {
    themeModule.currentTheme('invalid_data');

    assert.strictEqual(themeModule.currentTheme(), 'generic.light');
});

QUnit.test('Invalid input data (with color scheme)', function(assert) {
    themeModule.currentTheme('invalid_data', 'light');

    assert.strictEqual(themeModule.currentTheme(), 'generic.light');
});

[
    'fluent.blue.light',
    'fluent.blue.light.compact',
    'fluent.blue.dark',
    'fluent.blue.dark.compact',
    'fluent.saas.light',
    'fluent.saas.light.compact',
    'fluent.saas.dark',
    'fluent.saas.dark.compact',
].forEach((theme) => {
    QUnit.test(`Fluent theme should be registered: ${theme}`, function(assert) {
        themeModule.currentTheme(theme);

        assert.strictEqual(themeModule.currentTheme(), theme);
    });
});

const PUBLISHED_FONT = 'var(--dx-viz-font-family, \'segoe ui\', -apple-system, BlinkMacSystemFont, \'avenir next\', avenir, \'segoe ui\', \'helvetica neue\', helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif)';
const PUBLISHED_BLUE = 'var(--dx-viz-blue, #0078d4)';
const PUBLISHED_DANGER = 'var(--dx-viz-danger, #c50f1f)';
const PUBLISHED_GRAY = 'var(--dx-viz-gray, #757575)';
const PUBLISHED_ORANGE = 'var(--dx-viz-orange, #f7630c)';
const PUBLISHED_SUCCESS = 'var(--dx-viz-success, #107c10)';
const PUBLISHED_WARNING = 'var(--dx-viz-warning, #f7630c)';
const PUBLISHED_TILE_BORDER = 'var(--dx-viz-tile-border, #ffffff)';
const PUBLISHED_GREEN = 'var(--dx-viz-green, #008f04)';
const PUBLISHED_PRIMARY = 'var(--dx-viz-primary, #0f6cbd)';
const PUBLISHED_RED = 'var(--dx-viz-red, #c83d3d)';
const PUBLISHED_YELLOW = 'var(--dx-viz-yellow, #eaa300)';

[
    { theme: 'fluent-next.blue.light', surface: 'var(--dx-viz-bg, #ffffff)', hovered: 'var(--dx-viz-bg-hovered, #f5f5f5)', pressed: 'var(--dx-viz-bg-active, #e1e1e1)', plate: 'var(--dx-viz-tooltip-bg, #242424)', onPlate: 'var(--dx-viz-tooltip-content, #ffffff)', ink: 'var(--dx-viz-content, #161616)', shelf: 'var(--dx-viz-bg-higher, #ebebeb)', quiet: 'var(--dx-viz-gray-subtle, #cfcfcf)', crosshair: 'var(--dx-viz-crosshair, #b33133)', marker: 'var(--dx-viz-indigo-subtle, #becefc)', secondHalf: 'var(--dx-viz-red-subtle, #f9bfb9)', mapLine: 'var(--dx-viz-orange-subtle, #f9c1aa)', mapLineSelected: 'var(--dx-viz-content-orange, #ad4100)', tileFill: 'var(--dx-viz-cyan-subtle, #acd7e6)', rangePlate: 'var(--dx-viz-purple-subtle, #d5c7f0)' },
    { theme: 'fluent-next.blue.light.compact', surface: 'var(--dx-viz-bg, #ffffff)', hovered: 'var(--dx-viz-bg-hovered, #f5f5f5)', pressed: 'var(--dx-viz-bg-active, #e1e1e1)', plate: 'var(--dx-viz-tooltip-bg, #242424)', onPlate: 'var(--dx-viz-tooltip-content, #ffffff)', ink: 'var(--dx-viz-content, #161616)', shelf: 'var(--dx-viz-bg-higher, #ebebeb)', quiet: 'var(--dx-viz-gray-subtle, #cfcfcf)', crosshair: 'var(--dx-viz-crosshair, #b33133)', marker: 'var(--dx-viz-indigo-subtle, #becefc)', secondHalf: 'var(--dx-viz-red-subtle, #f9bfb9)', mapLine: 'var(--dx-viz-orange-subtle, #f9c1aa)', mapLineSelected: 'var(--dx-viz-content-orange, #ad4100)', tileFill: 'var(--dx-viz-cyan-subtle, #acd7e6)', rangePlate: 'var(--dx-viz-purple-subtle, #d5c7f0)' },
    { theme: 'fluent-next.blue.dark', surface: 'var(--dx-viz-bg, #242424)', hovered: 'var(--dx-viz-bg-hovered, #3b3b3b)', pressed: 'var(--dx-viz-bg-active, #1d1d1d)', plate: 'var(--dx-viz-tooltip-bg, #ffffff)', onPlate: 'var(--dx-viz-tooltip-content, #161616)', ink: 'var(--dx-viz-content, #ffffff)', shelf: 'var(--dx-viz-bg-higher, #333333)', quiet: 'var(--dx-viz-gray-subtle, #4a4a4a)', crosshair: 'var(--dx-viz-crosshair, #e87e78)', marker: 'var(--dx-viz-indigo-subtle, #2e4195)', secondHalf: 'var(--dx-viz-red-subtle, #861e20)', mapLine: 'var(--dx-viz-orange-subtle, #893200)', mapLineSelected: 'var(--dx-viz-content-orange, #f57d48)', tileFill: 'var(--dx-viz-cyan-subtle, #00576d)', rangePlate: 'var(--dx-viz-purple-subtle, #563780)' },
    { theme: 'fluent-next.blue.dark.compact', surface: 'var(--dx-viz-bg, #242424)', hovered: 'var(--dx-viz-bg-hovered, #3b3b3b)', pressed: 'var(--dx-viz-bg-active, #1d1d1d)', plate: 'var(--dx-viz-tooltip-bg, #ffffff)', onPlate: 'var(--dx-viz-tooltip-content, #161616)', ink: 'var(--dx-viz-content, #ffffff)', shelf: 'var(--dx-viz-bg-higher, #333333)', quiet: 'var(--dx-viz-gray-subtle, #4a4a4a)', crosshair: 'var(--dx-viz-crosshair, #e87e78)', marker: 'var(--dx-viz-indigo-subtle, #2e4195)', secondHalf: 'var(--dx-viz-red-subtle, #861e20)', mapLine: 'var(--dx-viz-orange-subtle, #893200)', mapLineSelected: 'var(--dx-viz-content-orange, #f57d48)', tileFill: 'var(--dx-viz-cyan-subtle, #00576d)', rangePlate: 'var(--dx-viz-purple-subtle, #563780)' },
].forEach(({
    theme, surface, hovered, pressed, plate, onPlate, ink, shelf, quiet, crosshair, marker,
    secondHalf, mapLine, mapLineSelected, tileFill, rangePlate,
}) => {
    QUnit.test(`fluent-next theme should be registered: ${theme}`, function(assert) {
        themeModule.currentTheme(theme);

        assert.strictEqual(themeModule.currentTheme(), theme);
    });

    QUnit.test(`fluent-next theme should render text with the published font: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.font.family, PUBLISHED_FONT, 'font');
        assert.strictEqual(registeredTheme.title.font.family, PUBLISHED_FONT, 'title font');
        assert.strictEqual(registeredTheme.title.subtitle.font.family, PUBLISHED_FONT, 'subtitle font');
        assert.strictEqual(registeredTheme.chart.title.font.family, PUBLISHED_FONT, 'chart title font');
        assert.strictEqual(registeredTheme.gauge.title.font.family, PUBLISHED_FONT, 'gauge title font');
        assert.strictEqual(registeredTheme.title.font.size, 20, 'title font size is inherited');
        assert.strictEqual(registeredTheme.title.font.weight, 500, 'title font weight is inherited');
    });

    QUnit.test(`fluent-next theme should paint the background with the published surface: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.backgroundColor, surface, 'backgroundColor');
        assert.strictEqual(registeredTheme.chart.containerBackgroundColor, surface, 'chart container');
        assert.strictEqual(registeredTheme.gauge.containerBackgroundColor, surface, 'gauge container');
        assert.strictEqual(registeredTheme.rangeSelector.containerBackgroundColor, surface, 'rangeSelector container');
        assert.strictEqual(registeredTheme.chart.commonSeriesSettings.candlestick.innerColor, surface, 'candlestick inner color');
        assert.strictEqual(registeredTheme.gauge.scale.tick.color, surface, 'gauge tick');
        assert.strictEqual(registeredTheme.map.background.color, surface, 'map background');
        assert.strictEqual(registeredTheme.map['layer:area'].borderColor, surface, 'map area border');
        assert.strictEqual(registeredTheme.map.controlBar.color, surface, 'map control bar');
        assert.strictEqual(registeredTheme.sparkline.pointColor, surface, 'sparkline point');
        assert.strictEqual(registeredTheme.loadingIndicator.backgroundColor, surface, 'loading indicator');
        assert.strictEqual(registeredTheme.export.backgroundColor, surface, 'export background');
        assert.strictEqual(registeredTheme.chart.export.backgroundColor, surface, 'chart export background');
        assert.strictEqual(registeredTheme.export.button.default.backgroundColor, surface, 'export button background');
    });

    QUnit.test(`fluent-next theme should cut shapes out with the published surface: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.rangeSelector.sliderMarker.font.color, surface, 'rangeSelector slider marker text');
        assert.strictEqual(registeredTheme.funnel.item.border.color, surface, 'funnel item border');
    });

    QUnit.test(`fluent-next theme should light the export button with the hovered and pressed names: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.export.button.hover.backgroundColor, hovered, 'export button hover');
        assert.strictEqual(registeredTheme.export.button.focus.backgroundColor, pressed, 'export button focus');
        assert.strictEqual(registeredTheme.export.button.active.backgroundColor, pressed, 'export button active');
    });

    QUnit.test(`fluent-next theme should lift the bar gauge shelf off the surface: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.barGauge.backgroundColor, shelf, 'bar gauge shelf');
    });

    QUnit.test(`fluent-next theme should lay a tooltip and an annotation over the page, not into it: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.tooltip.color, plate, 'tooltip plate');
        assert.strictEqual(registeredTheme.tooltip.font.color, onPlate, 'tooltip text');
        assert.strictEqual(registeredTheme.chart.commonAnnotationSettings.color, plate, 'annotation plate');
        assert.strictEqual(registeredTheme.chart.commonAnnotationSettings.border.color, plate, 'annotation border');
        assert.strictEqual(registeredTheme.chart.commonAnnotationSettings.font.color, onPlate, 'annotation text');
        assert.strictEqual(registeredTheme.map.commonAnnotationSettings.font.color, onPlate, 'map annotation text');
    });

    QUnit.test(`fluent-next theme should color series with the Fluent Next palette: ${theme}`, function(assert) {
        const defaultPalette = getRegisteredTheme(theme).defaultPalette;

        const simpleSet = createPalette(undefined, {}, defaultPalette).generateColors(6);
        const indicatingSet = createPalette(undefined, { type: 'indicatingSet' }, defaultPalette).generateColors(3);
        const gradientSet = getGradientPalette(undefined, defaultPalette);

        assert.deepEqual(simpleSet, [
            PUBLISHED_BLUE,
            PUBLISHED_RED,
            PUBLISHED_GREEN,
            PUBLISHED_YELLOW,
            'var(--dx-viz-pink, #e43ba6)',
            'var(--dx-viz-purple, #865cbf)',
        ], 'simpleSet');
        assert.deepEqual(indicatingSet, [PUBLISHED_SUCCESS, PUBLISHED_WARNING, PUBLISHED_DANGER], 'indicatingSet');
        assert.deepEqual([gradientSet.getColor(0), gradientSet.getColor(1)], [
            `color-mix(in srgb, ${PUBLISHED_BLUE} 100%, ${PUBLISHED_GREEN})`,
            `color-mix(in srgb, ${PUBLISHED_BLUE} 0%, ${PUBLISHED_GREEN})`,
        ], 'gradientSet is mixed by the browser, so it follows the names it is mixed from');
    });

    QUnit.test(`fluent-next theme should let the range selector follow the accent: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.rangeSelector.selectedRangeColor, PUBLISHED_PRIMARY, 'rangeSelector selected range');
        assert.strictEqual(registeredTheme.rangeSelector.sliderMarker.color, PUBLISHED_PRIMARY, 'rangeSelector slider marker');
        assert.strictEqual(registeredTheme.rangeSelector.sliderHandle.color, PUBLISHED_PRIMARY, 'rangeSelector slider handle');
    });

    QUnit.test(`fluent-next theme should mark a range that is not allowed with the published danger: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.rangeSelector.sliderMarker.invalidRangeColor, PUBLISHED_DANGER, 'rangeSelector invalid range');
    });

    QUnit.test(`fluent-next theme should paint the shapes that are data with the published blue: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.map['layer:marker:dot'].color, PUBLISHED_BLUE, 'map dot marker');
        assert.strictEqual(registeredTheme.map['layer:marker:bubble'].color, PUBLISHED_BLUE, 'map bubble marker');
        assert.strictEqual(registeredTheme.map.legend.markerColor, PUBLISHED_BLUE, 'map legend marker');
        assert.strictEqual(registeredTheme.bullet.color, PUBLISHED_BLUE, 'bullet');
        assert.strictEqual(registeredTheme.gauge.valueIndicators.rangebar.color, PUBLISHED_BLUE, 'gauge rangebar');
        assert.strictEqual(registeredTheme.gauge.valueIndicators['textcloud'].color, PUBLISHED_BLUE, 'gauge textcloud');
        assert.strictEqual(registeredTheme.sparkline.lineColor, PUBLISHED_BLUE, 'sparkline line');
        assert.strictEqual(registeredTheme.sparkline.firstLastColor, PUBLISHED_BLUE, 'sparkline first and last point');
    });

    QUnit.test(`fluent-next theme should paint a falling value with the published red: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.chart.commonSeriesSettings.candlestick.reduction.color, PUBLISHED_RED, 'candlestick reduction');
        assert.strictEqual(registeredTheme.chart.commonSeriesSettings.stock.reduction.color, PUBLISHED_RED, 'stock reduction');
        assert.strictEqual(registeredTheme.rangeSelector.chart.commonSeriesSettings.candlestick.reduction.color, PUBLISHED_RED, 'rangeSelector candlestick reduction');
        assert.strictEqual(registeredTheme.rangeSelector.chart.commonSeriesSettings.stock.reduction.color, PUBLISHED_RED, 'rangeSelector stock reduction');
    });

    QUnit.test(`fluent-next theme should mark the extremes of a sparkline with the published yellow and red: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.sparkline.minColor, PUBLISHED_YELLOW, 'sparkline minimum');
        assert.strictEqual(registeredTheme.sparkline.maxColor, PUBLISHED_RED, 'sparkline maximum');
    });

    QUnit.test(`fluent-next theme should keep a win and a loss grey, from the published pair: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.sparkline.winColor, PUBLISHED_GRAY, 'sparkline win');
        assert.strictEqual(registeredTheme.sparkline.barPositiveColor, PUBLISHED_GRAY, 'sparkline bar above zero');
        assert.strictEqual(registeredTheme.sparkline.lossColor, quiet, 'sparkline loss');
        assert.strictEqual(registeredTheme.sparkline.barNegativeColor, quiet, 'sparkline bar below zero');
        assert.strictEqual(registeredTheme.sankey.link.color, PUBLISHED_GRAY, 'sankey link');
    });

    QUnit.test(`fluent-next theme should draw the marks that stand out with the published content: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.bullet.targetColor, ink, 'bullet target');
    });

    QUnit.test(`fluent-next theme should name the fills an application can switch on: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.treeMap.tile.color, tileFill, 'tree map tile fill');
        assert.strictEqual(registeredTheme.rangeSelector.background.color, rangePlate, 'range selector plate');
    });

    QUnit.test(`fluent-next theme should keep a mark that lies on a data colour out of the mode: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.treeMap.tile.border.color, PUBLISHED_TILE_BORDER, 'tree map tile border');
    });

    QUnit.test(`fluent-next theme should draw a map line in the published orange: ${theme}`, function(assert) {
        const line = getRegisteredTheme(theme).map['layer:line'];

        assert.strictEqual(line.color, mapLine, 'map line at rest');
        assert.strictEqual(line.hoveredColor, PUBLISHED_ORANGE, 'map line under the pointer');
        assert.strictEqual(line.selectedColor, mapLineSelected, 'map line selected');
    });

    QUnit.test(`fluent-next theme should draw the crosshair with its own published name: ${theme}`, function(assert) {
        const registeredTheme = getRegisteredTheme(theme);

        assert.strictEqual(registeredTheme.chart.crosshair.color, crosshair, 'chart crosshair');
    });

    QUnit.test(`fluent-next theme should name every gauge indicator the theme draws: ${theme}`, function(assert) {
        const { valueIndicators } = getRegisteredTheme(theme).gauge;

        assert.strictEqual(valueIndicators._default.color, quiet, 'default needle');
        assert.strictEqual(getRegisteredTheme(theme).map['layer:area'].color, quiet, 'map area fill');
        assert.strictEqual(valueIndicators['trianglemarker'].color, marker, 'triangle marker');
        assert.strictEqual(valueIndicators['twocolorneedle'].secondColor, secondHalf, 'two-colour needle');
    });
});


QUnit.module('refresh all', {
    createItem: function() {
        return {
            refresh: function() {
                this.refreshed = true;
            }
        };
    }
});

QUnit.test('added items are refresh', function(assert) {
    const item1 = this.createItem();
    const item2 = this.createItem();
    const item3 = this.createItem();
    themeModule.addCacheItem(item1);
    themeModule.addCacheItem(item2);
    themeModule.addCacheItem(item3);

    themeModule.refreshTheme();

    assert.ok(item1.refreshed, 'item 1');
    assert.ok(item2.refreshed, 'item 2');
    assert.ok(item3.refreshed, 'item 3');
});

QUnit.test('removed items are not refreshed', function(assert) {
    const item1 = this.createItem();
    const item2 = this.createItem();
    const item3 = this.createItem();
    themeModule.addCacheItem(item1);
    themeModule.addCacheItem(item2);
    themeModule.addCacheItem(item3);
    themeModule.removeCacheItem(item2);

    themeModule.refreshTheme();

    assert.ok(item1.refreshed, 'item 1');
    assert.ok(!item2.refreshed, 'item 2');
    assert.ok(item3.refreshed, 'item 3');
});

QUnit.module('Interaction with ui.themes', {
    beforeEach: function() {
        themeModule.resetCurrentTheme();
        this.$frame = $('<iframe></iframe>').appendTo('body');
        return new Promise((resolve) => uiThemeModule.initialized(resolve));
    },
    afterEach: function() {
        this.$frame.remove();
    },

    frameDoc: function() {
        return this.$frame[0].contentWindow.document;
    },
    writeToFrame: function writeToFrame(markup) {
        this.frameDoc().write(markup);
    }
});

QUnit.test('currentTheme returns theme from ui.themes', function(assert) {
    this.writeToFrame('<link rel=\'dx-theme\' href=\'style1.css\' data-theme=\'platform2\' />');
    uiThemeModule.init({ theme: 'platform2', context: this.frameDoc() });

    const currentTheme = themeModule.currentTheme();

    assert.strictEqual(currentTheme, 'platform2');
});

QUnit.test('currentTheme returns previously set theme, regardles of what ui theme is set', function(assert) {
    this.writeToFrame('<link rel=\'dx-theme\' href=\'style1.css\' data-theme=\'platform2\' />');
    uiThemeModule.init({ theme: 'platform2', context: this.frameDoc() });
    themeModule.currentTheme('generic');

    const currentTheme = themeModule.currentTheme();

    assert.strictEqual(currentTheme, 'generic.light');
});

QUnit.test('currentTheme returns default theme if ui theme returns wrong theme', function(assert) {
    this.writeToFrame('<link rel=\'dx-theme\' href=\'style1.css\' data-theme=\'some-platform2\' />');
    uiThemeModule.init({ theme: 'some-platform2', context: this.frameDoc() });
    themeModule.registerTheme({
        name: 'viz default theme',
        isDefault: true
    });

    const currentTheme = themeModule.currentTheme();

    assert.strictEqual(currentTheme, 'viz default theme');
});
