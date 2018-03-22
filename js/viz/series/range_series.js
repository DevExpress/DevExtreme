"use strict";

// there are rangebar, rangearea
var extend = require("../../core/utils/extend").extend,
    _extend = extend,
    _isDefined = require("../../core/utils/type").isDefined,
    _map = require("../core/utils").map,
    _noop = require("../../core/utils/common").noop,

    scatterSeries = require("./scatter_series").chart,
    barSeries = require("./bar_series").chart.bar,
    areaSeries = require("./area_series").chart.area;

exports.chart = {};

var baseRangeSeries = {

    areErrorBarsVisible: _noop,
    _createErrorBarGroup: _noop,

    _checkData: function(data) {
        return _isDefined(data.argument) && data.value !== undefined && data.minValue !== undefined;
    },

    getValueRangeInitialValue: scatterSeries.getValueRangeInitialValue,

    _getPointDataSelector: function(data) {
        const valueFields = this.getValueFields();
        const val1Field = valueFields[0];
        const val2Field = valueFields[1];
        const tagField = this.getTagField();
        const argumentField = this.getArgumentField();

        return (data) => {
            return {
                tag: data[tagField],
                minValue: data[val1Field],
                value: data[val2Field],
                argument: data[argumentField],
                data: data
            };
        };
    },

    _defaultAggregator: "range",

    _aggregators: {
        range({ intervalStart, data }, series) {
            if(!data.length) {
                return;
            }
            var result = {},
                valueFields = series.getValueFields(),
                val1Field = valueFields[0],
                val2Field = valueFields[1];

            result[val1Field] = -Infinity;
            result[val2Field] = Infinity;

            result = data.reduce((result, item) => {
                var minValue = Math.min(item[val1Field], item[val2Field]);
                var maxValue = Math.max(item[val1Field], item[val2Field]);

                if(item[val1Field] === null || item[val2Field] === null) {
                    return result;
                }

                result[val1Field] = Math.min(result[val1Field], minValue);
                result[val2Field] = Math.max(result[val2Field], maxValue);

                return result;
            });

            result[series.getArgumentField()] = intervalStart;

            return result;
        }
    },

    getValueFields: function() {
        return [this._options.rangeValue1Field || "val1", this._options.rangeValue2Field || "val2"];
    }
};

exports.chart["rangebar"] = _extend({}, barSeries, baseRangeSeries);

exports.chart["rangearea"] = _extend({}, areaSeries, {
    _drawPoint: function(options) {
        var point = options.point;

        if(point.isInVisibleArea()) {
            point.clearVisibility();
            point.draw(this._renderer, options.groups);
            this._drawnPoints.push(point);
            if(!point.visibleTopMarker) {
                point.hideMarker("top");
            }
            if(!point.visibleBottomMarker) {
                point.hideMarker("bottom");
            }
        } else {
            point.setInvisibility();
        }
    },

    _prepareSegment: function(points, orderedPoints, rotated) {
        var processedPoints = this._processSinglePointsAreaSegment(points, rotated),
            processedMinPointsCoords = _map(processedPoints, function(pt) { return pt.getCoords(true); }),
            orderedMinPoints = orderedPoints && orderedPoints.map(function(p) { return p.getCoords(true); });

        return {
            line: processedPoints,
            orderedLine: orderedPoints,
            bottomLine: processedMinPointsCoords,
            orderedBottomLine: orderedMinPoints,
            area: _map(processedPoints, function(pt) { return pt.getCoords(); }).concat(processedMinPointsCoords.slice().reverse()),
            orderedArea: orderedPoints && orderedPoints.map(function(pt) { return pt.getCoords(); }).concat(orderedMinPoints.slice().reverse()),
            singlePointSegment: processedPoints !== points
        };
    },

    _getDefaultSegment: function(segment) {
        var defaultSegment = areaSeries._getDefaultSegment.call(this, segment);
        defaultSegment.bottomLine = defaultSegment.line;
        return defaultSegment;
    },

    _removeElement: function(element) {
        areaSeries._removeElement.call(this, element);
        element.bottomLine && element.bottomLine.remove();
    },

    _drawElement: function(segment, group) {
        var that = this,
            drawnElement = areaSeries._drawElement.call(that, segment, group);
        drawnElement.bottomLine = that._bordersGroup && that._createBorderElement(segment.bottomLine, { "stroke-width": that._styles.normal.border["stroke-width"] }).append(that._bordersGroup);

        return drawnElement;
    },

    _applyStyle: function(style) {
        var that = this,
            elementsGroup = that._elementsGroup,
            bordersGroup = that._bordersGroup;

        elementsGroup && elementsGroup.smartAttr(style.elements);
        bordersGroup && bordersGroup.attr(style.border);
        (that._graphics || []).forEach(function(graphic) {
            graphic.line && graphic.line.attr({ "stroke-width": style.border["stroke-width"] });
            graphic.bottomLine && graphic.bottomLine.attr({ "stroke-width": style.border["stroke-width"] });
        });
    },

    _updateElement: function(element, segment, animate, complete) {
        var bottomLineParams = segment.orderedBottomLine ? { points: segment.orderedBottomLine } : { points: segment.bottomLine },
            bottomBorderElement = element.bottomLine;

        areaSeries._updateElement.call(this, element, segment, animate, function() {
            bottomBorderElement && bottomBorderElement.attr({ points: segment.bottomLine });
            complete && complete();
        });

        if(bottomBorderElement) {
            animate ? bottomBorderElement.animate(bottomLineParams) : bottomBorderElement.attr(bottomLineParams);
        }
    }
}, baseRangeSeries);
