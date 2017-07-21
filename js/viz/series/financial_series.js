"use strict";

//there are stock, candlestick
var scatterSeries = require("./scatter_series").chart,
    barSeries = require("./bar_series").chart.bar,
    rangeCalculator = require("./helpers/range_data_calculator"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,

    _isDefined = require("../../core/utils/type").isDefined,
    _normalizeEnum = require("../core/utils").normalizeEnum,
    _extend = extend,
    _each = each,
    _noop = require("../../core/utils/common").noop,

    DEFAULT_FINANCIAL_POINT_SIZE = 10;

exports.stock = _extend({}, scatterSeries, {
    _animate: _noop,

    _applyMarkerClipRect: function(settings) {
        settings["clip-path"] = this._forceClipping ? this._paneClipRectID : this._widePaneClipRectID;
    },

    _updatePointsVisibility: barSeries._updatePointsVisibility,

    _getOptionsForPoint: barSeries._getOptionsForPoint,

    getErrorBarRangeCorrector: _noop,

    _createErrorBarGroup: _noop,

    areErrorBarsVisible: _noop,

    _createGroups: scatterSeries._createGroups,

    _setMarkerGroupSettings: function() {
        var that = this,
            markersGroup = that._markersGroup,
            styles = that._createPointStyles(that._getMarkerGroupOptions()),
            defaultStyle = _extend(styles.normal, { "class": "default-markers" }),
            defaultPositiveStyle = _extend(styles.positive.normal, { "class": "default-positive-markers" }),
            reductionStyle = _extend(styles.reduction.normal, { "class": "reduction-markers" }),
            reductionPositiveStyle = _extend(styles.reductionPositive.normal, { "class": "reduction-positive-markers" }),
            markerSettings = { "class": "dxc-markers" };

        that._applyMarkerClipRect(markerSettings);
        markersGroup.attr(markerSettings);
        that._createGroup("defaultMarkersGroup", markersGroup, markersGroup, defaultStyle);
        that._createGroup("reductionMarkersGroup", markersGroup, markersGroup, reductionStyle);
        that._createGroup("defaultPositiveMarkersGroup", markersGroup, markersGroup, defaultPositiveStyle);
        that._createGroup("reductionPositiveMarkersGroup", markersGroup, markersGroup, reductionPositiveStyle);
    },

    _setGroupsSettings: function() {
        scatterSeries._setGroupsSettings.call(this, false);
    },

    _clearingAnimation: function(drawComplete) {
        drawComplete();
    },

    _getCreatingPointOptions: function() {
        var that = this,
            defaultPointOptions,
            creatingPointOptions = that._predefinedPointOptions;

        if(!creatingPointOptions) {
            defaultPointOptions = this._getPointOptions();
            that._predefinedPointOptions = creatingPointOptions = _extend(true, { styles: {} }, defaultPointOptions);
            creatingPointOptions.styles.normal =
                    creatingPointOptions.styles.positive.normal =
                    creatingPointOptions.styles.reduction.normal =
                    creatingPointOptions.styles.reductionPositive.normal = {
                        "stroke-width": defaultPointOptions.styles && defaultPointOptions.styles.normal && defaultPointOptions.styles.normal["stroke-width"]
                    };
        }

        return creatingPointOptions;
    },

    _checkData: function(data) {
        return _isDefined(data.argument) && data.highValue !== undefined && data.lowValue !== undefined && data.openValue !== undefined && data.closeValue !== undefined;
    },

    _getPointData: function(data, options) {
        var that = this,
            level,
            openValueField = options.openValueField || "open",
            closeValueField = options.closeValueField || "close",
            highValueField = options.highValueField || "high",
            lowValueField = options.lowValueField || "low",
            reductionValue;
        that.level = options.reduction.level;
        switch(_normalizeEnum(that.level)) {
            case "open":
                level = openValueField;
                break;
            case "high":
                level = highValueField;
                break;
            case "low":
                level = lowValueField;
                break;
            default:
                level = closeValueField;
                that.level = "close";
                break;
        }
        reductionValue = data[level];

        return {
            argument: data[options.argumentField || "date"],
            highValue: data[highValueField],
            lowValue: data[lowValueField],
            closeValue: data[closeValueField],
            openValue: data[openValueField],
            reductionValue: reductionValue,
            tag: data[options.tagField || "tag"],
            isReduction: that._checkReduction(reductionValue)
        };
    },

    _parsePointStyle: function(style, defaultColor, innerColor) {
        return {
            stroke: style.color || defaultColor,
            "stroke-width": style.width,
            fill: style.color || innerColor
        };
    },

    updateTemplateFieldNames: function() {
        var that = this,
            options = that._options,
            valueFields = that.getValueFields(),
            name = that.name;

        options.openValueField = valueFields[0] + name;
        options.highValueField = valueFields[1] + name;
        options.lowValueField = valueFields[2] + name;
        options.closeValueField = valueFields[3] + name;
        options.tagField = that.getTagField() + name;
    },

    _getDefaultStyle: function(options) {
        var that = this,
            mainPointColor = options.color || that._options.mainSeriesColor;

        return {
            normal: that._parsePointStyle(options, mainPointColor, mainPointColor),
            hover: that._parsePointStyle(options.hoverStyle, mainPointColor, mainPointColor),
            selection: that._parsePointStyle(options.selectionStyle, mainPointColor, mainPointColor)
        };
    },

    _getReductionStyle: function(options) {
        var that = this,
            reductionColor = options.reduction.color;
        return {
            normal: that._parsePointStyle({ color: reductionColor, width: options.width, hatching: options.hatching }, reductionColor, reductionColor),
            hover: that._parsePointStyle(options.hoverStyle, reductionColor, reductionColor),
            selection: that._parsePointStyle(options.selectionStyle, reductionColor, reductionColor)
        };
    },

    _createPointStyles: function(pointOptions) {
        var that = this,
            innerColor = that._options.innerColor,
            styles = that._getDefaultStyle(pointOptions),
            positiveStyle,
            reductionStyle,
            reductionPositiveStyle;

        positiveStyle = _extend(true, {}, styles);
        reductionStyle = that._getReductionStyle(pointOptions);
        reductionPositiveStyle = _extend(true, {}, reductionStyle);

        positiveStyle.normal.fill = positiveStyle.hover.fill = positiveStyle.selection.fill = innerColor;
        reductionPositiveStyle.normal.fill = reductionPositiveStyle.hover.fill = reductionPositiveStyle.selection.fill = innerColor;

        styles.positive = positiveStyle;
        styles.reduction = reductionStyle;
        styles.reductionPositive = reductionPositiveStyle;

        return styles;
    },

    _endUpdateData: function() {
        delete this.prevLevelValue;
        delete this._predefinedPointOptions;
    },

    _checkReduction: function(value) {
        var that = this,
            result = false;
        if(value !== null) {
            if(_isDefined(that.prevLevelValue)) {
                result = value < that.prevLevelValue;
            }
            that.prevLevelValue = value;
        }
        return result;
    },

    _fusionPoints: function(fusionPoints, tick) {
        var fusedPointData = {},
            reductionLevel,
            highValue = -Infinity,
            lowValue = +Infinity,
            openValue,
            closeValue;
        if(!fusionPoints.length) {
            return {};
        }
        _each(fusionPoints, function(_, point) {
            if(!point.hasValue()) {
                return;
            }
            highValue = Math.max(highValue, point.highValue);
            lowValue = Math.min(lowValue, point.lowValue);
            openValue = openValue !== undefined ? openValue : point.openValue;
            closeValue = point.closeValue !== undefined ? point.closeValue : closeValue;
        });
        fusedPointData.argument = tick;
        fusedPointData.openValue = openValue;
        fusedPointData.closeValue = closeValue;
        fusedPointData.highValue = highValue;
        fusedPointData.lowValue = lowValue;
        fusedPointData.tag = null;

        switch(_normalizeEnum(this.level)) {
            case "open":
                reductionLevel = openValue;
                break;
            case "high":
                reductionLevel = highValue;
                break;
            case "low":
                reductionLevel = lowValue;
                break;
            default:
                reductionLevel = closeValue;
                break;
        }
        fusedPointData.reductionValue = reductionLevel;

        fusedPointData.isReduction = this._checkReduction(reductionLevel);

        return fusedPointData;
    },

    _getPointSize: function() {
        return DEFAULT_FINANCIAL_POINT_SIZE;
    },

    getValueFields: function() {
        var options = this._options;
        return [options.openValueField || "open", options.highValueField || "high", options.lowValueField || "low", options.closeValueField || "close"];
    },

    getArgumentField: function() {
        return this._options.argumentField || "date";
    },

    _beginUpdateData: _noop,

    _processRange: function(range) {
        rangeCalculator.addRangeSeriesLabelPaddings(this, range.val);
    }
});

exports.candlestick = _extend({}, exports.stock, {
    _beginUpdateData: barSeries._beginUpdateData,

    _parsePointStyle: function(style, defaultColor, innerColor) {
        var color = style.color || innerColor,
            base = exports.stock._parsePointStyle.call(this, style, defaultColor, color);
        base.fill = color;
        base.hatching = style.hatching;
        return base;
    }
});
