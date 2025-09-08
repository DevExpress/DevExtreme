/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import Class from '@js/core/class';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isString as _isString } from '@js/core/utils/type';

import {
  createPalette as getPalette,
  getAccentColor as accentColor,
  getDiscretePalette,
  getGradientPalette,
} from '../palette';
import { addCacheItem, getTheme, removeCacheItem } from '../themes';
import { parseScalar as _parseScalar } from './utils';

const _getTheme = getTheme;
const _addCacheItem = addCacheItem;
const _removeCacheItem = removeCacheItem;
const _extend = extend;
const _each = each;

function getThemePart(theme, path) {
  let _theme = theme;
  path && _each(path.split('.'), (_, pathItem) => (_theme = _theme[pathItem]));
  return _theme;
}

export const BaseThemeManager = Class.inherit({ // TODO: test hack
  ctor(options) {
    this._themeSection = options.themeSection;
    this._fontFields = options.fontFields || [];
    _addCacheItem(this);
  },

  dispose() {
    const that = this;
    _removeCacheItem(that);
    that._callback = that._theme = that._font = null;
    return that;
  },

  // TODO: Move it to constructor when charts theme managers's constructor is removed
  setCallback(callback) {
    this._callback = callback;
    return this;
  },

  setTheme(theme, rtl) {
    this._current = theme;
    this._rtl = rtl;
    return this.refresh();
  },

  // Officially we do not support objects as "theme" option value - we should stop doing it in code
  refresh() {
    const that = this;
    const current = that._current || {};
    let theme = _getTheme(current.name || current);
    that._themeName = theme.name;
    that._defaultPalette = theme.defaultPalette;
    that._font = _extend({}, theme.font, current.font);
    that._themeSection && _each(that._themeSection.split('.'), (_, path) => {
      theme = _extend(true, {}, theme[path]);
    });
    that._theme = _extend(true, {}, theme, _isString(current) ? {} : current);
    that._initializeTheme();
    if (_parseScalar(that._rtl, that._theme.rtlEnabled)) {
      _extend(true, that._theme, that._theme._rtl);
    }
    that._callback();
    return that;
  },

  theme(path) {
    return getThemePart(this._theme, path);
  },

  themeName() {
    return this._themeName;
  },

  // TODO: May be we need some single method for all palettes?

  createPalette(palette, options) {
    return getPalette(palette, options, this._defaultPalette);
  },

  createDiscretePalette(palette, count) {
    return getDiscretePalette(palette, count, this._defaultPalette);
  },

  createGradientPalette(palette) {
    return getGradientPalette(palette, this._defaultPalette);
  },

  getAccentColor(palette) {
    return accentColor(palette, this._defaultPalette);
  },

  _initializeTheme() {
    const that = this;
    _each(that._fontFields || [], (_, path) => {
      that._initializeFont(getThemePart(that._theme, path));
    });
  },

  _initializeFont(font) {
    _extend(font, this._font, _extend({}, font));
  },
});
