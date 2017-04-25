"use strict";

var $ = require("jquery"),
    symbolPoint = require("./symbol_point"),
    barPoint = require("./bar_point"),

    _isNumeric = $.isNumeric,
    _extend = $.extend,

    _math = Math,
    _abs = _math.abs,
    _min = _math.min,
    _max = _math.max,
    _round = _math.round,

    DEFAULT_FINANCIAL_TRACKER_MARGIN = 2;

module.exports = _extend({}, barPoint, {
    _getContinuousPoints: function(minValueName, maxValueName) {
        var that = this,
            x = that.x,
            createPoint = that._options.rotated ? function(x, y) { return [y, x]; } : function(x, y) { return [x, y]; },
            width = that.width,
            min = that[minValueName],
            max = that[maxValueName],
            points;

        if(min === max) {
            points = [].concat(createPoint(x, that.highY)).
                concat(createPoint(x, that.lowY)).
                concat(createPoint(x, that.closeY)).
                concat(createPoint(x - width / 2, that.closeY)).
                concat(createPoint(x + width / 2, that.closeY)).
                concat(createPoint(x, that.closeY));
        } else {
            points = [].concat(createPoint(x, that.highY)).
                concat(createPoint(x, max)).
                concat(createPoint(x + width / 2, max)).
                concat(createPoint(x + width / 2, min)).
                concat(createPoint(x, min)).
                concat(createPoint(x, that.lowY)).
                concat(createPoint(x, min)).
                concat(createPoint(x - width / 2, min)).
                concat(createPoint(x - width / 2, max)).
                concat(createPoint(x, max));
        }

        return points;
    },

    _getCategoryPoints: function(y) {
        var that = this,
            x = that.x,
            createPoint = that._options.rotated ? function(x, y) { return [y, x]; } : function(x, y) { return [x, y]; };

        return [].concat(createPoint(x, that.highY)).
            concat(createPoint(x, that.lowY)).
            concat(createPoint(x, y)).
            concat(createPoint(x - that.width / 2, y)).
            concat(createPoint(x + that.width / 2, y)).
            concat(createPoint(x, y));
    },

    _getPoints: function() {
        var that = this,
            points,
            minValueName,
            maxValueName,
            openValue = that.openValue,
            closeValue = that.closeValue;

        if(_isNumeric(openValue) && _isNumeric(closeValue)) {
            minValueName = openValue > closeValue ? "closeY" : "openY";
            maxValueName = openValue > closeValue ? "openY" : "closeY";
            points = that._getContinuousPoints(minValueName, maxValueName);
        } else {
            if(openValue === closeValue) {
                points = [that.x, that.highY, that.x, that.lowY];
            } else {
                points = that._getCategoryPoints(_isNumeric(openValue) ? that.openY : that.closeY);
            }
        }

        return points;
    },

    getColor: function() {
        var that = this;
        return that._isReduction ? that._options.reduction.color : that._styles.normal.stroke || that.series.getColor();
    },

    _drawMarkerInGroup: function(group, attributes, renderer) {
        var that = this;
        that.graphic = renderer.path(that._getPoints(), "area").attr({ "stroke-linecap": "square" }).attr(attributes).data({ "chart-data-point": that }).sharp().append(group);
    },

    _fillStyle: function() {
        var that = this,
            styles = that._options.styles;
        if(that._isReduction && that._isPositive) {
            that._styles = styles.reductionPositive;
        } else if(that._isReduction) {
            that._styles = styles.reduction;
        } else if(that._isPositive) {
            that._styles = styles.positive;
        } else {
            that._styles = styles;
        }
    },

    _getMinTrackerWidth: function() {
        return 2 + 2 * this._styles.normal['stroke-width'];
    },

    correctCoordinates: function(correctOptions) {
        var minWidth = this._getMinTrackerWidth(),
            maxWidth = 10,
            width = correctOptions.width;
        width = width < minWidth ? minWidth : (width > maxWidth ? maxWidth : width);

        this.width = width + width % 2;
        this.xCorrection = correctOptions.offset;
    },

    _getMarkerGroup: function(group) {
        var that = this,
            markerGroup;

        if(that._isReduction && that._isPositive) {
            markerGroup = group.reductionPositiveMarkersGroup;
        } else if(that._isReduction) {
            markerGroup = group.reductionMarkersGroup;
        } else if(that._isPositive) {
            markerGroup = group.defaultPositiveMarkersGroup;
        } else {
            markerGroup = group.defaultMarkersGroup;
        }

        return markerGroup;
    },

    _drawMarker: function(renderer, group) {
        this._drawMarkerInGroup(this._getMarkerGroup(group), this._getStyle(), renderer);
    },

    _getSettingsForTracker: function() {
        var that = this,
            highY = that.highY,
            lowY = that.lowY,
            rotated = that._options.rotated,
            x,
            y,
            width,
            height;

        if(highY === lowY) {
            highY = rotated ? highY + DEFAULT_FINANCIAL_TRACKER_MARGIN : highY - DEFAULT_FINANCIAL_TRACKER_MARGIN;
            lowY = rotated ? lowY - DEFAULT_FINANCIAL_TRACKER_MARGIN : lowY + DEFAULT_FINANCIAL_TRACKER_MARGIN;
        }

        if(rotated) {
            x = _min(lowY, highY);
            y = that.x - that.width / 2;
            width = _abs(lowY - highY);
            height = that.width;
        } else {
            x = that.x - that.width / 2;
            y = _min(lowY, highY);
            width = that.width;
            height = _abs(lowY - highY);
        }

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    },

    _getGraphicBBox: function() {
        var that = this,
            rotated = that._options.rotated,
            x = that.x,
            width = that.width,
            lowY = that.lowY,
            highY = that.highY;

        return {
            x: !rotated ? x - _round(width / 2) : lowY,
            y: !rotated ? highY : x - _round(width / 2),
            width: !rotated ? width : highY - lowY,
            height: !rotated ? lowY - highY : width
        };
    },

    getTooltipParams: function(location) {
        var that = this;
        if(that.graphic) {
            var x,
                y,
                min,
                max,
                minValue = _min(that.lowY, that.highY),
                maxValue = _max(that.lowY, that.highY),
                visibleAreaX = that.translators.x.getCanvasVisibleArea(),
                visibleAreaY = that.translators.y.getCanvasVisibleArea(),
                edgeLocation = location === 'edge';

            if(!that._options.rotated) {
                min = _max(visibleAreaY.min, minValue);
                max = _min(visibleAreaY.max, maxValue);
                x = that.x;
                y = edgeLocation ? min : min + (max - min) / 2;
            } else {
                min = _max(visibleAreaX.min, minValue);
                max = _min(visibleAreaX.max, maxValue);
                y = that.x;
                x = edgeLocation ? max : min + (max - min) / 2;
            }

            return { x: x, y: y, offset: 0 };
        }
    },

    hasValue: function() {
        return this.highValue !== null && this.lowValue !== null;
    },

    _translate: function() {
        var that = this,
            rotated = that._options.rotated,
            translators = that.translators,
            argTranslator = rotated ? translators.y : translators.x,
            valTranslator = rotated ? translators.x : translators.y,
            centerValue;

        that.vx = that.vy = that.x = argTranslator.translate(that.argument) + (that.xCorrection || 0);
        that.openY = that.openValue !== null ? valTranslator.translate(that.openValue) : null;
        that.highY = valTranslator.translate(that.highValue);
        that.lowY = valTranslator.translate(that.lowValue);
        that.closeY = that.closeValue !== null ? valTranslator.translate(that.closeValue) : null;

        centerValue = _min(that.lowY, that.highY) + _abs(that.lowY - that.highY) / 2;
        that._calculateVisibility(!rotated ? that.x : centerValue, !rotated ? centerValue : that.x);
    },

    getCrosshairData: function(x, y) {
        var that = this,
            rotated = that._options.rotated,
            origY = rotated ? x : y,
            yValue,
            argument = that.argument,
            coords,
            coord = "low";

        if(_abs(that.lowY - origY) < _abs(that.closeY - origY)) {
            yValue = that.lowY;
        } else {
            yValue = that.closeY;
            coord = "close";
        }

        if(_abs(yValue - origY) >= _abs(that.openY - origY)) {
            yValue = that.openY;
            coord = "open";
        }

        if(_abs(yValue - origY) >= _abs(that.highY - origY)) {
            yValue = that.highY;
            coord = "high";
        }

        if(rotated) {
            coords = {
                y: that.vy,
                x: yValue,
                xValue: that[coord + "Value"],
                yValue: argument
            };
        } else {
            coords = {
                x: that.vx,
                y: yValue,
                xValue: argument,
                yValue: that[coord + "Value"]
            };
        }

        coords.axis = that.series.axis;

        return coords;
    },

    _updateData: function(data) {
        var that = this,
            label = that._label,
            reductionColor = this._options.reduction.color;

        that.value = that.initialValue = data.reductionValue;
        that.originalValue = data.value;

        that.lowValue = that.originalLowValue = data.lowValue;

        that.highValue = that.originalHighValue = data.highValue;

        that.openValue = that.originalOpenValue = data.openValue;

        that.closeValue = that.originalCloseValue = data.closeValue;

        that._isPositive = data.openValue < data.closeValue;
        that._isReduction = data.isReduction;

        if(that._isReduction) {
            label.setColor(reductionColor);
        }
    },

    _updateMarker: function(animationEnabled, style, group) {
        var that = this,
            graphic = that.graphic;

        graphic.attr({ points: that._getPoints() }).smartAttr(style).sharp();
        group && graphic.append(that._getMarkerGroup(group));
    },


    _getLabelFormatObject: function() {
        var that = this;
        return {
            openValue: that.openValue,
            highValue: that.highValue,
            lowValue: that.lowValue,
            closeValue: that.closeValue,
            reductionValue: that.initialValue,
            argument: that.initialArgument,
            value: that.initialValue,
            seriesName: that.series.name,
            originalOpenValue: that.originalOpenValue,
            originalCloseValue: that.originalCloseValue,
            originalLowValue: that.originalLowValue,
            originalHighValue: that.originalHighValue,
            originalArgument: that.originalArgument,
            point: that
        };
    },

    _getFormatObject: function(tooltip) {
        var that = this,
            highValue = tooltip.formatValue(that.highValue),
            openValue = tooltip.formatValue(that.openValue),
            closeValue = tooltip.formatValue(that.closeValue),
            lowValue = tooltip.formatValue(that.lowValue),
            symbolMethods = symbolPoint,
            formatObject = symbolMethods._getFormatObject.call(that, tooltip);

        return _extend({}, formatObject, {
            valueText: "h: " + highValue + (openValue !== "" ? " o: " + openValue : "") + (closeValue !== "" ? " c: " + closeValue : "") + " l: " + lowValue,
            highValueText: highValue,
            openValueText: openValue,
            closeValueText: closeValue,
            lowValueText: lowValue
        });
    }
});
