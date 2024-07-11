"use strict";

exports.BaseThemeManager = void 0;
var _class = _interopRequireDefault(require("../../core/class"));
var _extend2 = require("../../core/utils/extend");
var _type = require("../../core/utils/type");
var _iterator = require("../../core/utils/iterator");
var _palette = require("../palette");
var _utils = require("./utils");
var _themes = require("../themes");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const _getTheme = _themes.getTheme;
const _addCacheItem = _themes.addCacheItem;
const _removeCacheItem = _themes.removeCacheItem;
const _extend = _extend2.extend;
const _each = _iterator.each;
function getThemePart(theme, path) {
  let _theme = theme;
  path && _each(path.split('.'), function (_, pathItem) {
    return _theme = _theme[pathItem];
  });
  return _theme;
}
const BaseThemeManager = exports.BaseThemeManager = _class.default.inherit({
  // TODO: test hack
  ctor: function (options) {
    this._themeSection = options.themeSection;
    this._fontFields = options.fontFields || [];
    _addCacheItem(this);
  },
  dispose: function () {
    const that = this;
    _removeCacheItem(that);
    that._callback = that._theme = that._font = null;
    return that;
  },
  // TODO: Move it to constructor when charts theme managers's constructor is removed
  setCallback: function (callback) {
    this._callback = callback;
    return this;
  },
  setTheme: function (theme, rtl) {
    this._current = theme;
    this._rtl = rtl;
    return this.refresh();
  },
  // Officially we do not support objects as "theme" option value - we should stop doing it in code
  refresh: function () {
    const that = this;
    const current = that._current || {};
    let theme = _getTheme(current.name || current);
    that._themeName = theme.name;
    that._defaultPalette = theme.defaultPalette;
    that._font = _extend({}, theme.font, current.font);
    that._themeSection && _each(that._themeSection.split('.'), function (_, path) {
      theme = _extend(true, {}, theme[path]);
    });
    that._theme = _extend(true, {}, theme, (0, _type.isString)(current) ? {} : current);
    that._initializeTheme();
    if ((0, _utils.parseScalar)(that._rtl, that._theme.rtlEnabled)) {
      _extend(true, that._theme, that._theme._rtl);
    }
    that._callback();
    return that;
  },
  theme: function (path) {
    return getThemePart(this._theme, path);
  },
  themeName: function () {
    return this._themeName;
  },
  // TODO: May be we need some single method for all palettes?

  createPalette: function (palette, options) {
    return (0, _palette.createPalette)(palette, options, this._defaultPalette);
  },
  createDiscretePalette: function (palette, count) {
    return (0, _palette.getDiscretePalette)(palette, count, this._defaultPalette);
  },
  createGradientPalette: function (palette) {
    return (0, _palette.getGradientPalette)(palette, this._defaultPalette);
  },
  getAccentColor: function (palette) {
    return (0, _palette.getAccentColor)(palette, this._defaultPalette);
  },
  _initializeTheme: function () {
    const that = this;
    _each(that._fontFields || [], function (_, path) {
      that._initializeFont(getThemePart(that._theme, path));
    });
  },
  _initializeFont: function (font) {
    _extend(font, this._font, _extend({}, font));
  }
});