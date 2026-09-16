import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import {
  isDefined,
  isNumeric,
  isPlainObject,
  isString,
} from '@js/core/utils/type';
import type { BaseThemeManagerOptions, Palette, ThemeValue } from '@ts/viz/core/base_theme_manager';
import { BaseThemeManager } from '@ts/viz/core/base_theme_manager';
import { extractColor, normalizeEnum } from '@ts/viz/core/utils';

export interface ChartThemeManagerOptions extends BaseThemeManagerOptions {
  themeSection: string;
  options?: ThemeValue;
}

interface ZoomAndPanMode {
  pan: boolean;
  zoom: boolean;
  none: boolean;
}

function processTitleOptions(options: ThemeValue): ThemeValue {
  return isString(options) ? { text: options } : options;
}

function processAxisOptions(axisOptions: ThemeValue): ThemeValue {
  if (!axisOptions) {
    return {};
  }
  const processedOptions = extend(true, {}, axisOptions);
  processedOptions.title = processTitleOptions(processedOptions.title);

  if ((processedOptions.type === 'logarithmic' && processedOptions.logarithmBase <= 0)
    || (processedOptions.logarithmBase && !isNumeric(processedOptions.logarithmBase))) {
    processedOptions.logarithmBase = undefined;
    processedOptions.logarithmBaseError = true;
  }
  if (processedOptions.label) {
    if (processedOptions.label.alignment) {
      processedOptions.label.userAlignment = true;
    }
  }
  return processedOptions;
}

function getAnimationUserOptions(value: ThemeValue): ThemeValue {
  if (isPlainObject(value)) {
    return value;
  }
  return isDefined(value) ? { enabled: !!value } : {};
}

function parseZoomAndPanOption(option: ThemeValue): ZoomAndPanMode {
  const normalizedOption = normalizeEnum(option);
  const pan = normalizedOption === 'pan' || normalizedOption === 'both';
  const zoom = normalizedOption === 'zoom' || normalizedOption === 'both';

  return {
    pan,
    zoom,
    none: !pan && !zoom,
  };
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let ThemeManager = class ThemeManager extends BaseThemeManager {
  declare _themeSection: string;

  _userOptions: ThemeValue;

  _mergeAxisTitleOptions: unknown[];

  _multiPieColors: Record<string, string>;

  _mergedSettings: ThemeValue;

  palette!: Palette;

  constructor(params: ChartThemeManagerOptions) {
    super(params);

    const options = params.options || {};
    this._userOptions = options;
    this._mergeAxisTitleOptions = [];
    this._multiPieColors = {};

    // This is required because chart calls "_getOption" during "_init" stage
    // TODO: Remove it when chart stops doing that
    this._callback = noop;
  }

  dispose(): this {
    if (this.palette) {
      this.palette.dispose();
    }
    Object.assign(this, {
      _multiPieColors: null,
      _mergedSettings: null,
      _userOptions: null,
      palette: null,
    });
    return super.dispose();
  }

  refresh(): this {
    this._mergedSettings = {};
    return super.refresh();
  }

  _initializeTheme(): void {
    super._initializeTheme();
    this.updatePalette();
  }

  getOptions(name: string, ...args: ThemeValue[]): ThemeValue {
    switch (name) {
      case 'argumentAxis':
      case 'valueAxis':
        return this._getAxisOptions(name, args[0], args[1]);
      case 'valueAxisRangeSelector':
        return this._mergeOptions('valueAxis');
      case 'series':
        return this._getSeriesOptions(args[0], args[1]);
      case 'animation':
        return this._mergeOptions(name, getAnimationUserOptions(this._userOptions[name]));
      case 'seriesTemplate':
        return this._getSeriesTemplateOptions();
      case 'zoomAndPan':
        return this._getZoomAndPanOptions();
      default:
        return this._mergeOptions(name, args[0]);
    }
  }

  resetOptions(name: string): void {
    this._mergedSettings[name] = null;
  }

  update(options: ThemeValue): void {
    this._userOptions = options;
  }

  updatePalette(): void {
    this.palette = this.createPalette(this.getOptions('palette'), {
      useHighlight: true,
      extensionMode: this.getOptions('paletteExtensionMode'),
    });
  }

  resetPalette(): void {
    this.palette.reset();
    this._multiPieColors = {};
  }

  _mergeOptions(name: string, userOptions?: ThemeValue): ThemeValue {
    const options = userOptions || this._userOptions[name];
    const theme = this._theme[name];
    let result = this._mergedSettings[name];
    if (result) {
      return result;
    }
    if (isPlainObject(theme) && isPlainObject(options)) {
      result = extend(true, {}, theme, options);
    } else {
      result = isDefined(options) ? options : theme;
    }
    this._mergedSettings[name] = result;
    return result;
  }

  _getAxisOptions(name: string, userOptions: ThemeValue, rotated?: boolean): ThemeValue {
    const theme = this._theme;
    const isValueAxis = name === 'valueAxis';
    const position = Boolean(rotated) === isValueAxis ? 'horizontalAxis' : 'verticalAxis';
    const processedUserOptions = processAxisOptions(userOptions);
    const commonAxisSettings = processAxisOptions(this._userOptions.commonAxisSettings);
    const mergeOptions = extend(
      true,
      {},
      theme.commonAxisSettings,
      theme[position],
      theme[name],
      commonAxisSettings,
      processedUserOptions,
    );

    mergeOptions.workWeek = processedUserOptions.workWeek || theme[name].workWeek;
    // eslint-disable-next-line no-bitwise
    mergeOptions.forceUserTickInterval |= Number(
      isDefined(processedUserOptions.tickInterval)
      && !isDefined(processedUserOptions.axisDivisionFactor),
    );
    return mergeOptions;
  }

  _getSeriesOptions(userOptions: ThemeValue, seriesCount: number): ThemeValue {
    const theme = this._theme;
    let userCommonSettings = this._userOptions.commonSeriesSettings || {};
    const themeCommonSettings = theme.commonSeriesSettings;
    const widgetType = this._themeSection.split('.').slice(-1)[0];
    // userCommonSettings.type && themeCommonSettings.type deprecated in 15.2 in pie
    const type = normalizeEnum(
      userOptions.type
      || userCommonSettings.type
      || themeCommonSettings.type
      || (widgetType === 'pie' && theme.type),
    );
    const { palette } = this;
    const isBar = type.includes('bar');
    const isLine = type.includes('line');
    const isArea = type.includes('area');
    const isBubble = type === 'bubble';
    const resolveLabelsOverlapping = this.getOptions('resolveLabelsOverlapping');
    const containerBackgroundColor = this.getOptions('containerBackgroundColor');
    const seriesTemplate = this._getSeriesTemplateOptions();
    let seriesOptions = userOptions;

    if (isBar || isBubble) {
      seriesOptions = extend(true, {}, userCommonSettings, userCommonSettings[type], seriesOptions);
      const seriesVisibility = seriesOptions.visible;
      userCommonSettings = { type: {} };
      extend(true, seriesOptions, seriesOptions.point);
      seriesOptions.visible = seriesVisibility;
    }

    const settings = extend(
      true,
      { aggregation: {} },
      themeCommonSettings,
      themeCommonSettings[type],
      userCommonSettings,
      userCommonSettings[type],
      seriesOptions,
    );

    settings.aggregation.enabled = widgetType === 'chart' && !!settings.aggregation.enabled;
    settings.type = type;
    settings.widgetType = widgetType;
    settings.containerBackgroundColor = containerBackgroundColor;

    const getMultiPieColor = (argument: ThemeValue, index: number, count: number): string => {
      const cat = `${argument}-${index}`;

      if (!this._multiPieColors[cat]) {
        this._multiPieColors[cat] = palette.getNextColor(count);
      }
      return this._multiPieColors[cat];
    };
    settings.mainSeriesColor = widgetType !== 'pie'
      ? extractColor(settings.color, true) || palette.getNextColor(seriesCount)
      : getMultiPieColor;
    settings.resolveLabelsOverlapping = resolveLabelsOverlapping;

    if (settings.label && (isLine || (isArea && type !== 'rangearea') || type === 'scatter')) {
      settings.label.position = 'outside';
    }

    if (seriesTemplate) {
      settings.nameField = seriesTemplate.nameField;
    }

    return settings;
  }

  _getSeriesTemplateOptions(): ThemeValue {
    const value = this._mergeOptions('seriesTemplate');
    if (value) {
      value.nameField = value.nameField || 'series';
    }
    return value;
  }

  _getZoomAndPanOptions(): ThemeValue {
    const options = this._mergeOptions('zoomAndPan');

    return {
      valueAxis: parseZoomAndPanOption(options.valueAxis),
      argumentAxis: parseZoomAndPanOption(options.argumentAxis),
      dragToZoom: !!options.dragToZoom,
      dragBoxStyle: {
        class: 'dxc-shutter',
        fill: options.dragBoxStyle.color,
        opacity: options.dragBoxStyle.opacity,
      },
      panKey: options.panKey,
      allowMouseWheel: !!options.allowMouseWheel,
      allowTouchGestures: !!options.allowTouchGestures,
    };
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_ThemeManager(value: typeof ThemeManager): void {
  ThemeManager = value;
}
/// #ENDDEBUG
