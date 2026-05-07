/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';

import { chart as areaChart } from './area_series';
import { chart as barChart, polar as barPolar } from './bar_series';
import { chart as lineChart } from './line_series';
import { chart as scatterSeries } from './scatter_series';
// @ts-expect-error
const lineSeries = lineChart.line;
// @ts-expect-error
const areaSeries = areaChart.area;
// @ts-expect-error
const chartBarSeries = barChart.bar;
// @ts-expect-error
const polarBarSeries = barPolar.bar;

const _extend = extend;
const _each = each;
const _noop = noop;

const chart = {};
// @ts-expect-error
chart.bubble = _extend({}, scatterSeries, {
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

  _checkData(data, skippedFields) {
    // @ts-expect-error
    return scatterSeries._checkData.call(this, data, skippedFields, { value: this.getValueFields()[0], size: this.getSizeField() });
  },

  _getPointDataSelector(data, options) {
    const sizeField = this.getSizeField();
    // @ts-expect-error
    const baseGetter = scatterSeries._getPointDataSelector.call(this);

    return (data) => {
      const pointData = baseGetter(data);
      pointData.size = data[sizeField];
      return pointData;
    };
  },

  _aggregators: {
    avg({ data, intervalStart, intervalEnd }, series) {
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
        [series.getArgumentField()]: series._getIntervalCenter(intervalStart, intervalEnd),
      };
    },
  },

  getValueFields() {
    return [this._options.valueField || 'val'];
  },

  getSizeField() {
    return this._options.sizeField || 'size';
  },

  _animate() {
    const that = this;
    const lastPointIndex = that._drawnPoints.length - 1;
    const labelsGroup = that._labelsGroup;
    const labelAnimFunc = function () {
      labelsGroup && labelsGroup.animate({ opacity: 1 }, { duration: that._defaultDuration });
    };

    _each(that._drawnPoints || [], (i, p) => {
      p.animate(i === lastPointIndex ? labelAnimFunc : undefined, { r: p.bubbleSize, translateX: p.x, translateY: p.y });
    });
  },

  _patchMarginOptions(options) {
    options.processBubbleSize = true;
    return options;
  },
});

export {
  chart,
};
