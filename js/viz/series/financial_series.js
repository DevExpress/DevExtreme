// there are stock, candlestick
var scatterSeries = require("./scatter_series").chart,
    barSeries = require("./bar_series").chart.bar,
    _extend = require("../../core/utils/extend").extend,

    _isDefined = require("../../core/utils/type").isDefined,
    _normalizeEnum = require("../core/utils").normalizeEnum,
    _noop = require("../../core/utils/common").noop,

    DEFAULT_FINANCIAL_POINT_SIZE = 10;

exports.stock = _extend({}, scatterSeries, {
    _animate: _noop,

    _applyMarkerClipRect: function(settings) {
        settings["clip-path"] = this._forceClipping ? this._paneClipRectID : this._widePaneClipRectID;
    },

    _updatePointsVisibility: barSeries._updatePointsVisibility,

    _getOptionsForPoint: barSeries._getOptionsForPoint,

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

    _checkData: function(data, skippedFields) {
        const valueFields = this.getValueFields();

        return scatterSeries._checkData.call(this, data, skippedFields, {
            openValue: valueFields[0],
            highValue: valueFields[1],
            lowValue: valueFields[2],
            closeValue: valueFields[3]
        }) &&
            data.highValue === data.highValue &&
            data.lowValue === data.lowValue;
    },

    _getPointDataSelector: function(data, options) {
        var that = this,
            level,
            valueFields = that.getValueFields(),
            argumentField = that.getArgumentField(),
            openValueField = valueFields[0],
            highValueField = valueFields[1],
            lowValueField = valueFields[2],
            closeValueField = valueFields[3];

        that.level = that._options.reduction.level;

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

        let prevLevelValue;

        return (data) => {
            const reductionValue = data[level];

            let isReduction = false;

            if(_isDefined(reductionValue)) {
                if(_isDefined(prevLevelValue)) {
                    isReduction = reductionValue < prevLevelValue;
                }
                prevLevelValue = reductionValue;
            }

            return {
                argument: data[argumentField],
                highValue: this._processEmptyValue(data[highValueField]),
                lowValue: this._processEmptyValue(data[lowValueField]),
                closeValue: this._processEmptyValue(data[closeValueField]),
                openValue: this._processEmptyValue(data[openValueField]),
                reductionValue: reductionValue,
                tag: data[that.getTagField()],
                isReduction: isReduction,
                data: data
            };
        };
    },

    _parsePointStyle: function(style, defaultColor, innerColor) {
        return {
            stroke: style.color || defaultColor,
            "stroke-width": style.width,
            fill: style.color || innerColor
        };
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
        delete this._predefinedPointOptions;
    },

    _defaultAggregator: "ohlc",

    _aggregators: {
        "ohlc": ({ intervalStart, data }, series) => {
            if(!data.length) {
                return;
            }
            var result = {},
                valueFields = series.getValueFields(),
                highValueField = valueFields[1],
                lowValueField = valueFields[2];

            result[highValueField] = -Infinity;
            result[lowValueField] = Infinity;

            result = data.reduce(function(result, item) {
                if(item[highValueField] !== null) {
                    result[highValueField] = Math.max(result[highValueField], item[highValueField]);
                }
                if(item[lowValueField] !== null) {
                    result[lowValueField] = Math.min(result[lowValueField], item[lowValueField]);
                }
                return result;
            }, result);
            result[valueFields[0]] = data[0][valueFields[0]];
            result[valueFields[3]] = data[data.length - 1][valueFields[3]];
            if(!isFinite(result[highValueField])) {
                result[highValueField] = null;
            }
            if(!isFinite(result[lowValueField])) {
                result[lowValueField] = null;
            }
            result[series.getArgumentField()] = intervalStart;

            return result;
        }
    },

    getValueFields: function() {
        var options = this._options;
        return [options.openValueField || "open", options.highValueField || "high", options.lowValueField || "low", options.closeValueField || "close"];
    },

    getArgumentField: function() {
        return this._options.argumentField || "date";
    },

    _patchMarginOptions: function(options) {
        var pointOptions = this._getCreatingPointOptions(),
            styles = pointOptions.styles,
            border = [styles.normal, styles.hover, styles.selection]
                .reduce(function(max, style) {
                    return Math.max(max, style["stroke-width"]);
                }, 0);

        options.size = DEFAULT_FINANCIAL_POINT_SIZE + border;
        options.sizePointNormalState = DEFAULT_FINANCIAL_POINT_SIZE;

        return options;
    },

    getSeriesPairCoord(coord, isArgument) {
        let oppositeCoord = null;
        const points = this.getVisiblePoints();

        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            let tmpCoord;

            if(isArgument) {
                tmpCoord = p.vx === coord ? (p.openY + p.closeY) / 2 : undefined;
            } else {
                const coords = [Math.min(p.lowY, p.highY), Math.max(p.lowY, p.highY)];
                tmpCoord = coord >= coords[0] && coord <= coords[1] ? p.vx : undefined;
            }

            if(this.checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
                oppositeCoord = tmpCoord;
                break;
            }
        }

        return oppositeCoord;
    },

    usePointsToDefineAutoHiding() {
        return false;
    }
});

exports.candlestick = _extend({}, exports.stock, {

    _parsePointStyle: function(style, defaultColor, innerColor) {
        var color = style.color || innerColor,
            base = exports.stock._parsePointStyle.call(this, style, defaultColor, color);
        base.fill = color;
        base.hatching = style.hatching;
        return base;
    }
});
