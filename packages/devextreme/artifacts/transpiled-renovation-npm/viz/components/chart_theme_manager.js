"use strict";

exports.ThemeManager = void 0;
var _common = require("../../core/utils/common");
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _base_theme_manager = require("../core/base_theme_manager");
var _utils = require("../core/utils");
const ThemeManager = exports.ThemeManager = _base_theme_manager.BaseThemeManager.inherit(function () {
  const ctor = function (params) {
    const that = this;
    that.callBase.apply(that, arguments);
    const options = params.options || {};
    that._userOptions = options;
    that._mergeAxisTitleOptions = [];
    that._multiPieColors = {};

    // This is required because chart calls "_getOption" during "_init" stage
    // TODO: Remove it when chart stops doing that
    that._callback = _common.noop;
  };
  const dispose = function () {
    const that = this;
    that.palette && that.palette.dispose();
    that.palette = that._userOptions = that._mergedSettings = that._multiPieColors = null;
    return that.callBase.apply(that, arguments);
  };
  const resetPalette = function () {
    this.palette.reset();
    this._multiPieColors = {};
  };
  const processTitleOptions = function (options) {
    return (0, _type.isString)(options) ? {
      text: options
    } : options;
  };
  const processAxisOptions = function (axisOptions) {
    if (!axisOptions) {
      return {};
    }
    axisOptions = (0, _extend.extend)(true, {}, axisOptions);
    axisOptions.title = processTitleOptions(axisOptions.title);
    if (axisOptions.type === 'logarithmic' && axisOptions.logarithmBase <= 0 || axisOptions.logarithmBase && !(0, _type.isNumeric)(axisOptions.logarithmBase)) {
      axisOptions.logarithmBase = undefined;
      axisOptions.logarithmBaseError = true;
    }
    if (axisOptions.label) {
      if (axisOptions.label.alignment) {
        axisOptions.label['userAlignment'] = true;
      }
    }
    return axisOptions;
  };
  const applyParticularAxisOptions = function (name, userOptions, rotated) {
    const theme = this._theme;
    const position = !(rotated ^ name === 'valueAxis') ? 'horizontalAxis' : 'verticalAxis';
    const processedUserOptions = processAxisOptions(userOptions);
    const commonAxisSettings = processAxisOptions(this._userOptions['commonAxisSettings']);
    const mergeOptions = (0, _extend.extend)(true, {}, theme.commonAxisSettings, theme[position], theme[name], commonAxisSettings, processedUserOptions);
    mergeOptions.workWeek = processedUserOptions.workWeek || theme[name].workWeek;
    mergeOptions.forceUserTickInterval |= (0, _type.isDefined)(processedUserOptions.tickInterval) && !(0, _type.isDefined)(processedUserOptions.axisDivisionFactor);
    return mergeOptions;
  };
  const mergeOptions = function (name, userOptions) {
    userOptions = userOptions || this._userOptions[name];
    const theme = this._theme[name];
    let result = this._mergedSettings[name];
    if (result) {
      return result;
    }
    if ((0, _type.isPlainObject)(theme) && (0, _type.isPlainObject)(userOptions)) {
      result = (0, _extend.extend)(true, {}, theme, userOptions);
    } else {
      result = (0, _type.isDefined)(userOptions) ? userOptions : theme;
    }
    this._mergedSettings[name] = result;
    return result;
  };
  const applyParticularTheme = {
    base: mergeOptions,
    argumentAxis: applyParticularAxisOptions,
    valueAxisRangeSelector: function () {
      return mergeOptions.call(this, 'valueAxis');
    },
    valueAxis: applyParticularAxisOptions,
    series: function (name, userOptions, seriesCount) {
      const that = this;
      const theme = that._theme;
      let userCommonSettings = that._userOptions.commonSeriesSettings || {};
      const themeCommonSettings = theme.commonSeriesSettings;
      const widgetType = that._themeSection.split('.').slice(-1)[0];
      const type = (0, _utils.normalizeEnum)(userOptions.type || userCommonSettings.type || themeCommonSettings.type || widgetType === 'pie' && theme.type); // userCommonSettings.type && themeCommonSettings.type deprecated in 15.2 in pie
      const palette = that.palette;
      const isBar = ~type.indexOf('bar');
      const isLine = ~type.indexOf('line');
      const isArea = ~type.indexOf('area');
      const isBubble = type === 'bubble';
      let mainSeriesColor;
      const resolveLabelsOverlapping = that.getOptions('resolveLabelsOverlapping');
      const containerBackgroundColor = that.getOptions('containerBackgroundColor');
      const seriesTemplate = applyParticularTheme.seriesTemplate.call(this);
      let seriesVisibility;
      if (isBar || isBubble) {
        userOptions = (0, _extend.extend)(true, {}, userCommonSettings, userCommonSettings[type], userOptions);
        seriesVisibility = userOptions.visible;
        userCommonSettings = {
          type: {}
        };
        (0, _extend.extend)(true, userOptions, userOptions.point);
        userOptions.visible = seriesVisibility;
      }
      const settings = (0, _extend.extend)(true, {
        aggregation: {}
      }, themeCommonSettings, themeCommonSettings[type], userCommonSettings, userCommonSettings[type], userOptions);
      settings.aggregation.enabled = widgetType === 'chart' && !!settings.aggregation.enabled;
      settings.type = type;
      settings.widgetType = widgetType;
      settings.containerBackgroundColor = containerBackgroundColor;
      if (widgetType !== 'pie') {
        mainSeriesColor = (0, _utils.extractColor)(settings.color, true) || palette.getNextColor(seriesCount);
      } else {
        mainSeriesColor = function (argument, index, count) {
          const cat = `${argument}-${index}`;
          if (!that._multiPieColors[cat]) {
            that._multiPieColors[cat] = palette.getNextColor(count);
          }
          return that._multiPieColors[cat];
        };
      }
      settings.mainSeriesColor = mainSeriesColor;
      settings.resolveLabelsOverlapping = resolveLabelsOverlapping;
      if (settings.label && (isLine || isArea && type !== 'rangearea' || type === 'scatter')) {
        settings.label.position = 'outside';
      }
      if (seriesTemplate) {
        settings.nameField = seriesTemplate.nameField;
      }
      return settings;
    },
    animation: function (name) {
      let userOptions = this._userOptions[name];
      userOptions = (0, _type.isPlainObject)(userOptions) ? userOptions : (0, _type.isDefined)(userOptions) ? {
        enabled: !!userOptions
      } : {};
      return mergeOptions.call(this, name, userOptions);
    },
    seriesTemplate() {
      const value = mergeOptions.call(this, 'seriesTemplate');
      if (value) {
        value.nameField = value.nameField || 'series';
      }
      return value;
    },
    zoomAndPan() {
      function parseOption(option) {
        option = (0, _utils.normalizeEnum)(option);
        const pan = option === 'pan' || option === 'both';
        const zoom = option === 'zoom' || option === 'both';
        return {
          pan: pan,
          zoom: zoom,
          none: !pan && !zoom
        };
      }
      const options = mergeOptions.call(this, 'zoomAndPan');
      return {
        valueAxis: parseOption(options.valueAxis),
        argumentAxis: parseOption(options.argumentAxis),
        dragToZoom: !!options.dragToZoom,
        dragBoxStyle: {
          class: 'dxc-shutter',
          fill: options.dragBoxStyle.color,
          opacity: options.dragBoxStyle.opacity
        },
        panKey: options.panKey,
        allowMouseWheel: !!options.allowMouseWheel,
        allowTouchGestures: !!options.allowTouchGestures
      };
    }
  };
  return {
    _themeSection: 'chart',
    ctor: ctor,
    dispose: dispose,
    resetPalette: resetPalette,
    getOptions: function (name) {
      return (applyParticularTheme[name] || applyParticularTheme.base).apply(this, arguments);
    },
    refresh: function () {
      this._mergedSettings = {};
      return this.callBase.apply(this, arguments);
    },
    _initializeTheme: function () {
      const that = this;
      that.callBase.apply(that, arguments);
      that.updatePalette();
    },
    resetOptions: function (name) {
      this._mergedSettings[name] = null;
    },
    update: function (options) {
      this._userOptions = options;
    },
    updatePalette: function () {
      const that = this;
      that.palette = that.createPalette(that.getOptions('palette'), {
        useHighlight: true,
        extensionMode: that.getOptions('paletteExtensionMode')
      });
    }
  };
}());