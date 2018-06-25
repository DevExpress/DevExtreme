"use strict";

var extend = require("../core/utils/extend").extend,
    each = require("../core/utils/iterator").each,
    vizUtils = require("./core/utils"),
    uiThemes = require("../ui/themes"),
    themes = {},
    themesMapping = {},
    themesSchemeMapping = {},
    _extend = extend,
    _each = each,
    _normalizeEnum = vizUtils.normalizeEnum,
    currentThemeName = null,
    defaultTheme,
    nextCacheUid = 0,
    widgetsCache = {};

function getTheme(themeName) {
    var name = _normalizeEnum(themeName);
    return themes[name] || themes[themesMapping[name] || currentTheme()];
}

function findThemeNameByName(name, scheme) {
    return themesMapping[name + '.' + scheme] || themesSchemeMapping[name + '.' + scheme] || themesMapping[name];
}

function findThemeNameByPlatform(platform, version, scheme) {
    return findThemeNameByName(platform + version, scheme) || findThemeNameByName(platform, scheme);
}

function currentTheme(themeName, colorScheme) {
    if(!arguments.length) {
        return currentThemeName || findThemeNameByName(uiThemes.current()) || defaultTheme;
    }

    var scheme = _normalizeEnum(colorScheme);
    currentThemeName = (themeName && themeName.platform ? findThemeNameByPlatform(_normalizeEnum(themeName.platform), themeName.version, scheme) : findThemeNameByName(_normalizeEnum(themeName), scheme)) || currentThemeName;
    // For chaining only
    return this;
}

function getThemeInfo(themeName, splitter) {
    var k = themeName.indexOf(splitter);
    return k > 0 ? { name: themeName.substring(0, k), scheme: themeName.substring(k + 1) } : null;
}

function registerThemeName(themeName, targetThemeName) {
    var themeInfo = getThemeInfo(themeName, '.') || { name: themeName },
        name = themeInfo.name,
        scheme = themeInfo.scheme;
    if(scheme) {
        themesMapping[name] = themesMapping[name] || targetThemeName;
        themesMapping[name + '.' + scheme] = targetThemeName;
    } else {
        themesMapping[name] = targetThemeName;
    }
}

function registerTheme(theme, baseThemeName) {
    var themeName = _normalizeEnum(theme && theme.name);
    if(themeName) {
        theme.isDefault && (defaultTheme = themeName);
        registerThemeName(themeName, themeName);
        themes[themeName] = _extend(true, {}, getTheme(baseThemeName), patchTheme(theme));
    }
}

function registerThemeAlias(alias, theme) {
    registerThemeName(_normalizeEnum(alias), _normalizeEnum(theme));
}

function registerThemeSchemeAlias(from, to) {
    themesSchemeMapping[from] = to;
}

function mergeScalar(target, field, source, sourceValue) {
    var _value = source ? source[field] : sourceValue;
    if(_value !== undefined && target[field] === undefined) {
        target[field] = _value;
    }
}

function mergeObject(target, field, source, sourceValue) {
    var _value = source ? source[field] : sourceValue;
    if(_value !== undefined) {
        target[field] = _extend(true, {}, _value, target[field]);
    }
}

// TODO: Font initialization should be done here
function patchTheme(theme) {
    theme = _extend(true, {
        loadingIndicator: { font: {} },
        "export": { font: {} },
        legend: { font: {}, border: {} },
        title: { font: {} },
        tooltip: { font: {} },
        "chart:common": {},
        "chart:common:axis": { grid: {}, minorGrid: {}, tick: {}, minorTick: {}, title: { font: {} }, label: { font: {} } },
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

    mergeScalar(theme.loadingIndicator, "backgroundColor", theme);
    mergeScalar(theme.chart.commonSeriesSettings.candlestick, "innerColor", null, theme.backgroundColor);
    mergeScalar(theme.map.background, "color", null, theme.backgroundColor);
    mergeScalar(theme.title.font, "color", null, theme.primaryTitleColor);
    mergeObject(theme.title, "subtitle", null, theme.title);
    mergeScalar(theme.legend.font, "color", null, theme.secondaryTitleColor);
    mergeScalar(theme.legend.border, "color", null, theme.axisColor);
    patchAxes(theme);
    _each(["chart", "pie", "polar", "gauge", "barGauge", "map", "treeMap", "funnel", "rangeSelector", "sparkline", "bullet", "sankey"], function(_, section) {
        mergeScalar(theme[section], "redrawOnResize", theme);
        mergeScalar(theme[section], "containerBackgroundColor", null, theme.backgroundColor);
        mergeObject(theme[section], "tooltip", theme);
    });
    _each(["chart", "pie", "polar", "gauge", "barGauge", "map", "treeMap", "funnel", "rangeSelector", "sankey"], function(_, section) {
        mergeObject(theme[section], "loadingIndicator", theme);
        mergeObject(theme[section], "export", theme);
        mergeObject(theme[section], "legend", theme);
        mergeObject(theme[section], "title", theme);
    });

    _each(["chart", "pie", "polar"], function(_, section) {
        mergeObject(theme, section, null, theme["chart:common"]);
    });
    _each(["chart", "polar"], function(_, section) {
        theme[section] = theme[section] || {};
        mergeObject(theme[section], "commonAxisSettings", null, theme["chart:common:axis"]);
    });
    mergeObject(theme.rangeSelector.chart, "commonSeriesSettings", theme.chart);
    mergeObject(theme.rangeSelector.chart, "dataPrepareSettings", theme.chart);

    mergeScalar(theme.treeMap.group.border, "color", null, theme.axisColor);
    mergeScalar(theme.treeMap.tile.selectionStyle.border, "color", null, theme.primaryTitleColor);
    mergeScalar(theme.treeMap.group.selectionStyle.border, "color", null, theme.primaryTitleColor);

    mergeScalar(theme.map.legend, "backgroundColor", theme);
    patchMapLayers(theme);

    return theme;
}

function patchAxes(theme) {
    var commonAxisSettings = theme["chart:common:axis"],
        colorFieldName = "color";
    _each([commonAxisSettings, commonAxisSettings.grid, commonAxisSettings.minorGrid, commonAxisSettings.tick, commonAxisSettings.minorTick], function(_, obj) {
        mergeScalar(obj, colorFieldName, null, theme.axisColor);
    });
    mergeScalar(commonAxisSettings.title.font, colorFieldName, null, theme.secondaryTitleColor);
    mergeScalar(commonAxisSettings.label.font, colorFieldName, null, theme.axisLabelColor);
    mergeScalar(theme.gauge.scale.label.font, colorFieldName, null, theme.axisLabelColor);
    mergeScalar(theme.gauge.scale.tick, colorFieldName, null, theme.backgroundColor);
    mergeScalar(theme.gauge.scale.minorTick, colorFieldName, null, theme.backgroundColor);
    mergeScalar(theme.rangeSelector.scale.label.font, colorFieldName, null, theme.axisLabelColor);
}

function patchMapLayers(theme) {
    var map = theme.map;
    _each(["area", "line", "marker"], function(_, section) {
        mergeObject(map, "layer:" + section, null, map.layer);
    });
    _each(["dot", "bubble", "pie", "image"], function(_, section) {
        mergeObject(map, "layer:marker:" + section, null, map["layer:marker"]);
    });
}

function addCacheItem(target) {
    var cacheUid = ++nextCacheUid;
    target._cache = cacheUid;
    widgetsCache[cacheUid] = target;
}

function removeCacheItem(target) {
    delete widgetsCache[target._cache];
}

function refreshTheme() {
    _each(widgetsCache, function() {
        this.refresh();
    });
    // For chaining only
    return this;
}

_extend(exports, {
    currentTheme: currentTheme,
    registerTheme: registerTheme,
    getTheme: getTheme,
    registerThemeAlias: registerThemeAlias,
    registerThemeSchemeAlias: registerThemeSchemeAlias,
    refreshTheme: refreshTheme,
    addCacheItem: addCacheItem,
    removeCacheItem: removeCacheItem
});

///#DEBUG
_extend(exports, {
    themes: themes,
    themesMapping: themesMapping,
    themesSchemeMapping: themesSchemeMapping,
    widgetsCache: widgetsCache,
    resetCurrentTheme: function() {
        currentThemeName = null;
    }
});
///#ENDDEBUG
