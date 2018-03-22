"use strict";

var lineSeries = require("./line_series").chart.line,
    scatterSeries = require("./scatter_series").chart,
    areaSeries = require("./area_series").chart.area,
    barSeries = require("./bar_series"),
    chartBarSeries = barSeries.chart.bar,
    polarBarSeries = barSeries.polar.bar,
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,

    _isDefined = require("../../core/utils/type").isDefined,
    _extend = extend,
    _each = each,
    _noop = require("../../core/utils/common").noop;

exports.chart = {};
exports.chart.bubble = _extend({}, scatterSeries, {

    getErrorBarRangeCorrector: _noop,

    _calculateErrorBars: _noop,

    _getMainColor: chartBarSeries._getMainColor,

    _createPointStyles: chartBarSeries._createPointStyles,

    _updatePointsVisibility: chartBarSeries._updatePointsVisibility,

    _getOptionsForPoint: chartBarSeries._getOptionsForPoint,

    _applyMarkerClipRect: lineSeries._applyElementsClipRect,

    _parsePointStyle: polarBarSeries._parsePointStyle,

    _createLegendState: areaSeries._createLegendState,

    _setMarkerGroupSettings: polarBarSeries._setMarkerGroupSettings,

    areErrorBarsVisible: _noop,

    _createErrorBarGroup: _noop,

    _checkData: function(data) {
        return _isDefined(data.argument) && _isDefined(data.size) && data.value !== undefined;
    },

    _getPointDataSelector: function(data, options) {
        const sizeField = this.getSizeField();
        const baseGetter = scatterSeries._getPointDataSelector.call(this);

        return (data) => {
            const pointData = baseGetter(data);
            pointData.size = data[sizeField];
            return pointData;
        };
    },

    _aggregators: {
        avg: function(aggregationInfo, series) {
            var result = {},
                valueField = series.getValueFields()[0],
                sizeField = series.getSizeField(),
                aggregate = aggregationInfo.data.reduce(function(result, item) {
                    result[0] += item[valueField];
                    result[1] += item[sizeField];
                    result[2]++;
                    return result;
                }, [0, 0, 0]);

            result[valueField] = aggregate[0] / aggregate[2];
            result[sizeField] = aggregate[1] / aggregate[2];
            result[series.getArgumentField()] = aggregationInfo.intervalStart;

            return result;
        }
    },

    getValueFields: function() {
        return [this._options.valueField || "val"];
    },

    getSizeField: function() {
        return this._options.sizeField || "size";
    },

    _animate: function() {
        var that = this,
            lastPointIndex = that._drawnPoints.length - 1,
            labelsGroup = that._labelsGroup,
            labelAnimFunc = function() {
                labelsGroup && labelsGroup.animate({ opacity: 1 }, { duration: that._defaultDuration });
            };

        _each(that._drawnPoints || [], function(i, p) {
            p.animate(i === lastPointIndex ? labelAnimFunc : undefined, { r: p.bubbleSize, translateX: p.x, translateY: p.y });
        });
    },

    _patchMarginOptions: function(options) {
        options.processBubbleSize = true;
        return options;
    }
});
