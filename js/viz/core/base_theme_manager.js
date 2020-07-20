import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { isString as _isString } from '../../core/utils/type';
import { each } from '../../core/utils/iterator';
import paletteModule from '../palette';
import { parseScalar as _parseScalar } from './utils';
import themeModule from '../themes';
const _getTheme = themeModule.getTheme;
const _addCacheItem = themeModule.addCacheItem;
const _removeCacheItem = themeModule.removeCacheItem;
const _extend = extend;
const _each = each;

// register themes
import './themes/generic.light';
import './themes/generic.dark';
import './themes/generic.contrast';
import './themes/generic.carmine';
import './themes/generic.darkmoon';
import './themes/generic.softblue';
import './themes/generic.darkviolet';
import './themes/generic.greenmist';
import './themes/material';

function getThemePart(theme, path) {
    let _theme = theme;
    path && _each(path.split('.'), function(_, pathItem) {
        return (_theme = _theme[pathItem]);
    });
    return _theme;
}

export const BaseThemeManager = Class.inherit({ // TODO: test hack
    ctor: function(options) {
        this._themeSection = options.themeSection;
        this._fontFields = options.fontFields || [];
        _addCacheItem(this);
    },

    dispose: function() {
        const that = this;
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
        const that = this;
        const current = that._current || {};
        let theme = _getTheme(current.name || current);
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
        return paletteModule.createPalette(palette, options, this._defaultPalette);
    },

    createDiscretePalette: function(palette, count) {
        return paletteModule.getDiscretePalette(palette, count, this._defaultPalette);
    },

    createGradientPalette: function(palette) {
        return paletteModule.getGradientPalette(palette, this._defaultPalette);
    },

    getAccentColor: function(palette) {
        return paletteModule.getAccentColor(palette, this._defaultPalette);
    },

    _initializeTheme: function() {
        const that = this;
        _each(that._fontFields || [], function(_, path) {
            that._initializeFont(getThemePart(that._theme, path));
        });
    },

    _initializeFont: function(font) {
        _extend(font, this._font, _extend({}, font));
    }
});
