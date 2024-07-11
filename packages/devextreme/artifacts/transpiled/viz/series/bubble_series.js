"use strict";

exports.chart = void 0;
var _line_series = require("./line_series");
var _scatter_series = require("./scatter_series");
var _area_series = require("./area_series");
var _bar_series = require("./bar_series");
var _extend2 = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _common = require("../../core/utils/common");
const lineSeries = _line_series.chart.line;
const areaSeries = _area_series.chart.area;
const chartBarSeries = _bar_series.chart.bar;
const polarBarSeries = _bar_series.polar.bar;
const _extend = _extend2.extend;
const _each = _iterator.each;
const _noop = _common.noop;
const chart = exports.chart = {};
chart.bubble = _extend({}, _scatter_series.chart, {
  _calculateErrorBars: _noop,
  _getMainColor: chartBarSeries._getMainColor,
  _createPointStyles: chartBarSeries._createPointStyles,
  _updatePointsVisibility: chartBarSeries._updatePointsVisibility,
  _getOptionsForPoint: chartBarSeries._getOptionsForPoint,
  _applyMarkerClipRect: lineSeries._applyElementsClipRect,
  _parsePointStyle: polarBarSeries._parsePointStyle,
  _createLegendState: areaSeries._createLegendState,
  _getColorId: areaSeries._getColorId,
  _setMarkerGroupSettings: polarBarSeries._setMarkerGroupSettings,
  areErrorBarsVisible: _noop,
  _createErrorBarGroup: _noop,
  _checkData: function (data, skippedFields) {
    return _scatter_series.chart._checkData.call(this, data, skippedFields, {
      value: this.getValueFields()[0],
      size: this.getSizeField()
    });
  },
  _getPointDataSelector: function (data, options) {
    const sizeField = this.getSizeField();
    const baseGetter = _scatter_series.chart._getPointDataSelector.call(this);
    return data => {
      const pointData = baseGetter(data);
      pointData.size = data[sizeField];
      return pointData;
    };
  },
  _aggregators: {
    avg(_ref, series) {
      let {
        data,
        intervalStart,
        intervalEnd
      } = _ref;
      if (!data.length) {
        return;
      }
      const valueField = series.getValueFields()[0];
      const sizeField = series.getSizeField();
      const aggregate = data.reduce((result, item) => {
        result[0] += item[valueField];
        result[1] += item[sizeField];
        result[2]++;
        return result;
      }, [0, 0, 0]);
      return {
        [valueField]: aggregate[0] / aggregate[2],
        [sizeField]: aggregate[1] / aggregate[2],
        [series.getArgumentField()]: series._getIntervalCenter(intervalStart, intervalEnd)
      };
    }
  },
  getValueFields: function () {
    return [this._options.valueField || 'val'];
  },
  getSizeField: function () {
    return this._options.sizeField || 'size';
  },
  _animate: function () {
    const that = this;
    const lastPointIndex = that._drawnPoints.length - 1;
    const labelsGroup = that._labelsGroup;
    const labelAnimFunc = function () {
      labelsGroup && labelsGroup.animate({
        opacity: 1
      }, {
        duration: that._defaultDuration
      });
    };
    _each(that._drawnPoints || [], function (i, p) {
      p.animate(i === lastPointIndex ? labelAnimFunc : undefined, {
        r: p.bubbleSize,
        translateX: p.x,
        translateY: p.y
      });
    });
  },
  _patchMarginOptions: function (options) {
    options.processBubbleSize = true;
    return options;
  }
});