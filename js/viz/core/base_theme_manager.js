"use strict";

var Class = require("../../core/class"),
    extend = require("../../core/utils/extend").extend,
    typeUtils = require("../../core/utils/type"),
    each = require("../../core/utils/iterator").each,
    paletteModule = require("../palette"),
    _isString = typeUtils.isString,
    _parseScalar = require("./utils").parseScalar,
    themeModule = require("../themes"),
    _findTheme = themeModule.findTheme,
    _addCacheItem = themeModule.addCacheItem,
    _removeCacheItem = themeModule.removeCacheItem,
    _extend = extend,
    _each = each;

//register themes
require("./default");
require("./ios");
require("./android");
require("./win");

function getThemePart(theme, path) {
    var _theme = theme;
    path && _each(path.split('.'), function(_, pathItem) {
        return (_theme = _theme[pathItem]);
    });
    return _theme;
}

exports.BaseThemeManager = Class.inherit({//TODO: test hack
    ctor: function() {
        _addCacheItem(this);
    },

    dispose: function() {
        var that = this;
        _removeCacheItem(that);
        that._callback = that._theme = that._font = null;
        return that;
    },

    // TODO: Move it to constructor when charts theme managers's constructor is removed
    setCallback: function(callback) {
        this._callback = callback;
        return this;
    },

    setTheme: function(theme, rtl) {
        this._current = theme;
        this._rtl = rtl;
        return this.refresh();
    },

    // Officially we do not support objects as "theme" option value - we should stop doing it in code
    refresh: function() {
        var that = this,
            current = that._current || {},
            theme = _findTheme(current.name || current);
        that._themeName = theme.name;
        that._defaultPalette = theme.defaultPalette;
        that._font = _extend({}, theme.font, current.font);
        that._themeSection && _each(that._themeSection.split('.'), function(_, path) {
            theme = _extend(true, {}, theme[path]);
        });
        that._theme = _extend(true, {}, theme, _isString(current) ? {} : current);
        that._initializeTheme();
        if(_parseScalar(that._rtl, that._theme.rtlEnabled)) {
            _extend(true, that._theme, that._theme._rtl);
        }
        that._callback();
        return that;
    },

    theme: function(path) {
        return getThemePart(this._theme, path);
    },

    themeName: function() {
        return this._themeName;
    },

    // TODO: May be we need some single method for all palettes?

    createPalette: function(palette, options) {
        return new paletteModule.Palette(palette || this._defaultPalette, options);
    },

    createDiscretePalette: function(palette, count) {
        return new paletteModule.DiscretePalette(palette || this._defaultPalette, count);
    },

    createGradientPalette: function(palette) {
        return new paletteModule.GradientPalette(palette || this._defaultPalette);
    },

    _initializeTheme: function() {
        var that = this;
        _each(that._fontFields || [], function(_, path) {
            that._initializeFont(getThemePart(that._theme, path));
        });
    },

    _initializeFont: function(font) {
        _extend(font, this._font, _extend({}, font));
    }
});
