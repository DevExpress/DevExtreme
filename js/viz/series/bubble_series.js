const lineSeries = require('./line_series').chart.line;
const scatterSeries = require('./scatter_series').chart;
const areaSeries = require('./area_series').chart.area;
const barSeries = require('./bar_series');
const chartBarSeries = barSeries.chart.bar;
const polarBarSeries = barSeries.polar.bar;
const extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;

const _extend = extend;
const _each = each;
const _noop = require('../../core/utils/common').noop;

exports.chart = {};
exports.chart.bubble = _extend({}, scatterSeries, {
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

    _checkData: function(data, skippedFields) {
        return scatterSeries._checkData.call(this, data, skippedFields, { value: this.getValueFields()[0], size: this.getSizeField() });
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
        avg({ data, intervalStart }, series) {
            if(!data.length) {
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
                [series.getArgumentField()]: intervalStart
            };
        }
    },

    getValueFields: function() {
        return [this._options.valueField || 'val'];
    },

    getSizeField: function() {
        return this._options.sizeField || 'size';
    },

    _animate: function() {
        const that = this;
        const lastPointIndex = that._drawnPoints.length - 1;
        const labelsGroup = that._labelsGroup;
        const labelAnimFunc = function() {
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
