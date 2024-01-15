import { extend } from '../core/utils/extend';
import { normalizeEnum } from './core/utils';
import { current as getCurrentTheme } from '../ui/themes';
import { isEmptyObject } from '../core/utils/type';
import lightThemes from '../__internal/viz/core/themes/generic/light/index';
import carmineThemes from '../__internal/viz/core/themes/generic/carmine';
import darkThemes from '../__internal/viz/core/themes/generic/dark';
import contrastThemes from '../__internal/viz/core/themes/generic/contrast';
import darkMoonThemes from '../__internal/viz/core/themes/generic/darkmoon';
import darkVioletThemes from '../__internal/viz/core/themes/generic/darkviolet';
import greenMistThemes from '../__internal/viz/core/themes/generic/greenmist';
import softBlueThemes from '../__internal/viz/core/themes/generic/softblue';
import materialThemes from '../__internal/viz/core/themes/material/index';
import fluentThemes from '../__internal/viz/core/themes/fluent/index';

const themes = {};
const themesMapping = {};
const themesSchemeMapping = {};
const _extend = extend;
let currentThemeName = null;
let defaultTheme;
let nextCacheUid = 0;
const widgetsCache = {};

export function getTheme(themeName) {
    const name = normalizeEnum(themeName);
    return themes[name] || themes[themesMapping[name] || currentTheme()];
}

function findThemeNameByName(name, scheme) {
    const fullThemeKey = `${name}.${scheme}`;

    return themesMapping[fullThemeKey] || themesSchemeMapping[fullThemeKey] || themesMapping[name];
}

function findThemeNameByPlatform(platform, version, scheme) {
    return findThemeNameByName(platform + version, scheme) || findThemeNameByName(platform, scheme);
}

export function currentTheme(themeName, colorScheme) {
    if(!arguments.length) {
        return currentThemeName || findThemeNameByName(getCurrentTheme()) || defaultTheme;
    }

    const scheme = normalizeEnum(colorScheme);
    currentThemeName = (themeName?.platform ? findThemeNameByPlatform(normalizeEnum(themeName.platform), themeName.version, scheme) : findThemeNameByName(normalizeEnum(themeName), scheme)) || currentThemeName;
    // For chaining only
    return this;
}

function getThemeInfo(themeName, splitter) {
    const k = themeName.indexOf(splitter);
    return k > 0 ? { name: themeName.substring(0, k), scheme: themeName.substring(k + 1) } : null;
}

function registerThemeName(themeName, targetThemeName) {
    const themeInfo = getThemeInfo(themeName, '.') || { name: themeName };
    const name = themeInfo.name;
    const scheme = themeInfo.scheme;
    if(scheme) {
        const fullThemeKey = `${name}.${scheme}`;

        themesMapping[name] = themesMapping[name] || targetThemeName;
        themesMapping[fullThemeKey] = targetThemeName;
    } else {
        themesMapping[name] = targetThemeName;
    }
}

export function registerTheme(theme, baseThemeName) {
    const themeName = normalizeEnum(theme && theme.name);
    if(themeName) {
        theme.isDefault && (defaultTheme = themeName);
        registerThemeName(themeName, themeName);
        themes[themeName] = _extend(true, {}, getTheme(baseThemeName), patchTheme(theme));
    }
}

export function registerThemeSchemeAlias(from, to) {
    themesSchemeMapping[from] = to;
}

function mergeScalar(target, field, source, sourceValue) {
    const _value = source?.[field] ?? sourceValue;
    if(_value !== undefined && target[field] === undefined) {
        target[field] = _value;
    }
}

function mergeObject(target, field, source, sourceValue) {
    const _value = source?.[field] ?? sourceValue;
    if(_value !== undefined) {
        target[field] = _extend(true, {}, _value, target[field]);
    }
}

// TODO: Font initialization should be done here
function patchTheme(theme) {
    theme = _extend(true, {
        loadingIndicator: { font: {} },
        'export': { font: {} },
        legend: { font: {}, border: {} },
        title: { font: {} },
        tooltip: { font: {} },
        'chart:common': {},
        'chart:common:axis': { grid: {}, minorGrid: {}, tick: {}, minorTick: {}, title: { font: {} }, label: { font: {} } },
        'chart:common:annotation': { font: {}, border: {} },
        chart: { commonSeriesSettings: { candlestick: {} } },
        pie: {},
        polar: {},
        gauge: { scale: { tick: {}, minorTick: {}, label: { font: {} } } },
        barGauge: {},
        funnel: {},
        sankey: {},
        map: { background: {} },
        treeMap: { tile: { selectionStyle: { border: {} } }, group: { border: {}, selectionStyle: { border: {} }, label: { font: {} } } },
        rangeSelector: { scale: { tick: {}, minorTick: {}, label: { font: {} } }, chart: {} },
        sparkline: {},
        bullet: {}
    }, theme);

    mergeScalar(theme.loadingIndicator, 'backgroundColor', theme);
    mergeScalar(theme.chart.commonSeriesSettings.candlestick, 'innerColor', null, theme.backgroundColor);
    mergeScalar(theme.map.background, 'color', null, theme.backgroundColor);
    mergeScalar(theme.title.font, 'color', null, theme.primaryTitleColor);
    mergeObject(theme.title, 'subtitle', null, theme.title);
    mergeScalar(theme.legend.font, 'color', null, theme.secondaryTitleColor);
    mergeScalar(theme.legend.border, 'color', null, theme.gridColor);
    patchAxes(theme);
    ['chart', 'pie', 'polar', 'gauge', 'barGauge', 'map', 'treeMap', 'funnel', 'rangeSelector', 'sparkline', 'bullet', 'sankey'].forEach((section) => {
        mergeScalar(theme[section], 'redrawOnResize', theme);
        mergeScalar(theme[section], 'containerBackgroundColor', null, theme.backgroundColor);
        mergeObject(theme[section], 'tooltip', theme);
        mergeObject(theme[section], 'export', theme);
    });
    ['chart', 'pie', 'polar', 'gauge', 'barGauge', 'map', 'treeMap', 'funnel', 'rangeSelector', 'sankey'].forEach((section) => {
        mergeObject(theme[section], 'loadingIndicator', theme);
        mergeObject(theme[section], 'legend', theme);
        mergeObject(theme[section], 'title', theme);
    });

    ['chart', 'pie', 'polar'].forEach((section) => {
        mergeObject(theme, section, null, theme['chart:common']);
    });
    ['chart', 'polar'].forEach((section) => {
        theme[section] = theme[section] || {};
        mergeObject(theme[section], 'commonAxisSettings', null, theme['chart:common:axis']);
    });
    ['chart', 'polar', 'map', 'pie'].forEach((section) =>{
        theme[section] = theme[section] || {};
        mergeObject(theme[section], 'commonAnnotationSettings', null, theme['chart:common:annotation']);
    });
    mergeObject(theme.rangeSelector.chart, 'commonSeriesSettings', theme.chart);
    mergeObject(theme.rangeSelector.chart, 'dataPrepareSettings', theme.chart);

    mergeScalar(theme.treeMap.group.border, 'color', null, theme.gridColor);
    mergeScalar(theme.treeMap.tile.selectionStyle.border, 'color', null, theme.primaryTitleColor);
    mergeScalar(theme.treeMap.group.selectionStyle.border, 'color', null, theme.primaryTitleColor);

    mergeScalar(theme.map.legend, 'backgroundColor', theme);
    patchMapLayers(theme);

    return theme;
}

function patchAxes(theme) {
    const commonAxisSettings = theme['chart:common:axis'];
    const colorFieldName = 'color';
    [commonAxisSettings.grid, commonAxisSettings.minorGrid].forEach((obj) =>{
        mergeScalar(obj, colorFieldName, null, theme.gridColor);
    });
    [commonAxisSettings, commonAxisSettings.tick, commonAxisSettings.minorTick, commonAxisSettings.label.font].forEach((obj) =>{
        mergeScalar(obj, colorFieldName, null, theme.axisColor);
    });
    mergeScalar(commonAxisSettings.title.font, colorFieldName, null, theme.secondaryTitleColor);
    mergeScalar(theme.gauge.scale.label.font, colorFieldName, null, theme.axisColor);
    mergeScalar(theme.gauge.scale.tick, colorFieldName, null, theme.backgroundColor);
    mergeScalar(theme.gauge.scale.minorTick, colorFieldName, null, theme.backgroundColor);
    mergeScalar(theme.rangeSelector.scale.label.font, colorFieldName, null, theme.axisColor);
}

function patchMapLayers(theme) {
    const map = theme.map;
    ['area', 'line', 'marker'].forEach((section) =>{
        mergeObject(map, 'layer:' + section, null, map.layer);
    });
    ['dot', 'bubble', 'pie', 'image'].forEach((section) =>{
        mergeObject(map, 'layer:marker:' + section, null, map['layer:marker']);
    });
}

export function addCacheItem(target) {
    const cacheUid = ++nextCacheUid;
    target._cache = cacheUid;
    widgetsCache[cacheUid] = target;
}

export function removeCacheItem(target) {
    delete widgetsCache[target._cache];
}

export function refreshTheme() {
    Object.keys(widgetsCache).forEach((key) => {
        widgetsCache[key].refresh();
    });
    // For chaining only
    return this;
}

// register themes
if(isEmptyObject(themes) && isEmptyObject(themesMapping) && !defaultTheme) {
    [].concat(
        lightThemes,
        carmineThemes,
        darkThemes,
        contrastThemes,
        darkMoonThemes,
        darkVioletThemes,
        greenMistThemes,
        softBlueThemes,
        materialThemes,
        fluentThemes
    ).forEach(t => {
        registerTheme(t.theme, t.baseThemeName);
    });
}

///#DEBUG
export {
    themes,
    themesMapping,
    themesSchemeMapping,
    widgetsCache
};

export const resetCurrentTheme = function() {
    currentThemeName = null;
};
///#ENDDEBUG
