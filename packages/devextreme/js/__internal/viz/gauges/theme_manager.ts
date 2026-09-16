import { extend } from '@js/core/utils/extend';
import type { BaseThemeManagerOptions } from '@ts/viz/core/base_theme_manager';
import { BaseThemeManager } from '@ts/viz/core/base_theme_manager';

export interface GaugeThemeManagerOptions extends BaseThemeManagerOptions {
  subTheme?: string;
}

class ThemeManager extends BaseThemeManager {
  _subTheme?: string;

  constructor(options: GaugeThemeManagerOptions) {
    super(options);
    this._subTheme = options.subTheme;
  }

  _initializeTheme(): void {
    if (this._subTheme) {
      const subTheme = extend(true, {}, this._theme[this._subTheme], this._theme);
      extend(true, this._theme, subTheme);
    }
    super._initializeTheme();
  }
}

export default { ThemeManager };
