import type { Font } from '@js/common/charts';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { isString } from '@js/core/utils/type';
import { parseScalar } from '@ts/viz/core/utils';
import {
  createPalette as getPalette,
  getAccentColor as accentColor,
  getDiscretePalette,
  getGradientPalette,
} from '@ts/viz/palette';
import { addCacheItem, getTheme, removeCacheItem } from '@ts/viz/themes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- description theme option tree
export type ThemeValue = any;

export interface Theme {
  [key: string]: ThemeValue;
  name?: string;
  defaultPalette?: string | string[];
  font?: Font;
  rtlEnabled?: boolean;
  _rtl?: Theme;
}

export type ThemeSetting = string | Theme;

export type Palette = ReturnType<typeof getPalette>;

export interface BaseThemeManagerOptions {
  themeSection?: string;
  fontFields?: string[];
}

function getThemePart(theme: ThemeValue, path?: string): ThemeValue {
  let themePart = theme;
  if (path) {
    each(path.split('.'), (_, pathItem) => {
      themePart = themePart[pathItem];
      return themePart !== false;
    });
  }
  return themePart;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let BaseThemeManager = class BaseThemeManager {
  _themeSection?: string;

  _fontFields: string[];

  _callback!: () => void;

  _current?: ThemeSetting;

  _rtl?: boolean;

  _themeName?: string;

  _defaultPalette?: string | string[];

  _font?: Font;

  _theme: ThemeValue;

  constructor(options: BaseThemeManagerOptions) {
    this._themeSection = options.themeSection;
    this._fontFields = options.fontFields || [];
    addCacheItem(this);
  }

  dispose(): this {
    removeCacheItem(this);
    Object.assign(this, { _font: null, _theme: null, _callback: null });
    return this;
  }

  // TODO: Move it to constructor when charts theme managers's constructor is removed
  setCallback(callback: () => void): this {
    this._callback = callback;
    return this;
  }

  setTheme(theme?: ThemeSetting, rtl?: boolean): this {
    this._current = theme;
    this._rtl = rtl;
    return this.refresh();
  }

  // Officially we do not support objects as "theme" option value - we should stop doing it in code
  refresh(): this {
    const current: ThemeSetting = this._current || {};
    const currentTheme: Theme = isString(current) ? {} : current;
    let theme: Theme = getTheme(currentTheme.name || current);
    this._themeName = theme.name;
    this._defaultPalette = theme.defaultPalette;
    this._font = extend({}, theme.font, currentTheme.font);
    if (this._themeSection) {
      each(this._themeSection.split('.'), (_, path) => {
        theme = extend(true, {}, theme[path]);
      });
    }
    this._theme = extend(true, {}, theme, currentTheme);
    this._initializeTheme();
    if (parseScalar(this._rtl, this._theme.rtlEnabled)) {
      extend(true, this._theme, this._theme._rtl);
    }
    this._callback();
    return this;
  }

  theme(path?: string): ThemeValue {
    return getThemePart(this._theme, path);
  }

  themeName(): string | undefined {
    return this._themeName;
  }

  // TODO: May be we need some single method for all palettes?

  createPalette(palette: ThemeValue, options: ThemeValue): Palette {
    return getPalette(palette, options, this._defaultPalette);
  }

  createDiscretePalette(palette: ThemeValue, count: number): ReturnType<typeof getDiscretePalette> {
    return getDiscretePalette(palette, count, this._defaultPalette);
  }

  createGradientPalette(palette: ThemeValue): ReturnType<typeof getGradientPalette> {
    return getGradientPalette(palette, this._defaultPalette);
  }

  getAccentColor(palette: ThemeValue): ReturnType<typeof accentColor> {
    return accentColor(palette, this._defaultPalette);
  }

  _initializeTheme(): void {
    each(this._fontFields || [], (_, path) => {
      this._initializeFont(getThemePart(this._theme, path));
    });
  }

  _initializeFont(font?: Font): void {
    extend(font, this._font, extend({}, font));
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_BaseThemeManager(value: typeof BaseThemeManager): void {
  BaseThemeManager = value;
}
/// #ENDDEBUG
