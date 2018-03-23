"use strict";

var _extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    _each = require("../../core/utils/iterator").each,
    rangeCalculator = require("./helpers/range_data_calculator"),
    typeUtils = require("../../core/utils/type"),
    vizUtils = require("../core/utils"),

    _noop = require("../../core/utils/common").noop,
    _isDefined = typeUtils.isDefined,
    _isString = typeUtils.isString,
    _map = vizUtils.map,
    _normalizeEnum = vizUtils.normalizeEnum,
    math = Math,
    _abs = math.abs,
    _sqrt = math.sqrt,
    _max = math.max,

    DEFAULT_TRACKER_WIDTH = 12,
    DEFAULT_DURATION = 400,

    HIGH_ERROR = "highError",
    LOW_ERROR = "lowError",

    VARIANCE = "variance",
    STANDARD_DEVIATION = "stddeviation",
    STANDARD_ERROR = "stderror",
    PERCENT = "percent",
    FIXED = "fixed",
    UNDEFINED = "undefined",

    DISCRETE = "discrete",
    LOGARITHMIC = "logarithmic",
    DATETIME = "datetime";

exports.chart = {};
exports.polar = {};

function sum(array) {
    var result = 0;
    _each(array, function(_, value) {
        result += value;
    });
    return result;
}

function isErrorBarTypeCorrect(type) {
    // TODO why UNDEFINED is here
    // return inArray(type, [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR, UNDEFINED]) !== -1;
    return inArray(type, [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR]) !== -1;
}

function variance(array, expectedValue) {
    return sum(_map(array, function(value) {
        return (value - expectedValue) * (value - expectedValue);
    })) / array.length;
}

function calculateAvgErrorBars(result, data, series) {
    var errorBarsOptions = series.getOptions().valueErrorBar,
        valueField = series.getValueFields()[0],
        lowValueField = errorBarsOptions.lowValueField || LOW_ERROR,
        highValueField = errorBarsOptions.highValueField || HIGH_ERROR;

    if(series.areErrorBarsVisible() && errorBarsOptions.type === undefined) {
        var fusionData = data.reduce(function(result, item) {
            if(_isDefined(item[lowValueField])) {
                result[0] += item[valueField] - item[lowValueField];
                result[1]++;
            }
            if(_isDefined(item[highValueField])) {
                result[2] += item[highValueField] - item[valueField];
                result[3]++;
            }

            return result;
        }, [0, 0, 0, 0]);

        if(fusionData[1]) {
            result[lowValueField] = result[valueField] - fusionData[0] / fusionData[1];
        }
        if(fusionData[2]) {
            result[highValueField] = result[valueField] + fusionData[2] / fusionData[3];
        }
    }

    return result;
}
function calculateSumErrorBars(result, data, series) {
    var errorBarsOptions = series.getOptions().valueErrorBar,
        lowValueField = errorBarsOptions.lowValueField || LOW_ERROR,
        highValueField = errorBarsOptions.highValueField || HIGH_ERROR;

    if(series.areErrorBarsVisible() && errorBarsOptions.type === undefined) {
        result[lowValueField] = 0;
        result[highValueField] = 0;
        result = data.reduce(function(result, item) {
            result[lowValueField] += item[lowValueField];
            result[highValueField] += item[highValueField];

            return result;
        }, result);
    }

    return result;
}

var baseScatterMethods = {
    _defaultDuration: DEFAULT_DURATION,

    _defaultTrackerWidth: DEFAULT_TRACKER_WIDTH,

    _applyStyle: _noop,

    _updateOptions: _noop,

    _parseStyle: _noop,

    _prepareSegment: _noop,

    _drawSegment: _noop,

    _appendInGroup: function() {
        this._group.append(this._extGroups.seriesGroup);
    },

    _createLegendState: function(styleOptions, defaultColor) {
        return {
            fill: styleOptions.color || defaultColor,
            hatching: styleOptions.hatching ? _extend({}, styleOptions.hatching, { direction: "right" }) : undefined
        };
    },

    updateTemplateFieldNames: function() {
        var that = this,
            options = that._options;

        options.valueField = that.getValueFields()[0] + that.name;
        options.tagField = that.getTagField() + that.name;
    },

    _applyElementsClipRect: function(settings) {
        settings["clip-path"] = this._paneClipRectID;
    },

    _applyMarkerClipRect: function(settings) {
        settings["clip-path"] = this._forceClipping ? this._paneClipRectID : null;
    },

    _createGroup: function(groupName, parent, target, settings) {
        var group = parent[groupName] = parent[groupName] || this._renderer.g();
        target && group.append(target);
        settings && group.attr(settings);
    },

    _applyClearingSettings: function(settings) {
        settings.opacity = null;
        settings.scale = null;
        if(this._options.rotated) {
            settings.translateX = null;
        } else {
            settings.translateY = null;
        }
    },

    _createGroups: function() {
        var that = this;
        that._createGroup("_markersGroup", that, that._group);
        that._createGroup("_labelsGroup", that);
    },

    _setMarkerGroupSettings: function() {
        var that = this,
            settings = that._createPointStyles(that._getMarkerGroupOptions()).normal;
        settings["class"] = "dxc-markers";
        settings.opacity = 1; // T172577
        that._applyMarkerClipRect(settings);
        that._markersGroup.attr(settings);
    },

    getVisibleArea: function() {
        return this._visibleArea;
    },

    areErrorBarsVisible: function() {
        var errorBarOptions = this._options.valueErrorBar;
        return errorBarOptions && this._errorBarsEnabled() && errorBarOptions.displayMode !== "none" && (isErrorBarTypeCorrect(_normalizeEnum(errorBarOptions.type)) || (_isDefined(errorBarOptions.lowValueField) || _isDefined(errorBarOptions.highValueField)));
    },

    _createErrorBarGroup: function(animationEnabled) {
        var that = this,
            errorBarOptions = that._options.valueErrorBar,
            settings;

        if(that.areErrorBarsVisible()) {
            settings = {
                "class": "dxc-error-bars",
                stroke: errorBarOptions.color,
                'stroke-width': errorBarOptions.lineWidth,
                opacity: animationEnabled ? 0.001 : errorBarOptions.opacity || 1,
                "stroke-linecap": "square",
                sharp: true,
                "clip-path": that._forceClipping ? that._paneClipRectID : that._widePaneClipRectID
            };
            that._createGroup("_errorBarGroup", that, that._group, settings);
        }
    },

    _setGroupsSettings: function(animationEnabled) {
        var that = this;
        that._setMarkerGroupSettings();
        that._setLabelGroupSettings(animationEnabled);
        that._createErrorBarGroup(animationEnabled);
    },

    _getCreatingPointOptions: function() {
        var that = this,
            defaultPointOptions,
            creatingPointOptions = that._predefinedPointOptions,
            normalStyle;
        if(!creatingPointOptions) {
            defaultPointOptions = that._getPointOptions();
            that._predefinedPointOptions = creatingPointOptions = _extend(true, { styles: {} }, defaultPointOptions);
            normalStyle = defaultPointOptions.styles && defaultPointOptions.styles.normal || {};

            creatingPointOptions.styles = creatingPointOptions.styles || {};
            creatingPointOptions.styles.normal = {
                "stroke-width": normalStyle["stroke-width"],
                r: normalStyle.r,
                opacity: normalStyle.opacity
            };
        }

        return creatingPointOptions;
    },

    _getPointOptions: function() {
        return this._parsePointOptions(this._preparePointOptions(), this._options.label);
    },

    _getOptionsForPoint: function() {
        return this._options.point;
    },

    _parsePointStyle: function(style, defaultColor, defaultBorderColor, defaultSize) {
        var border = style.border || {},
            sizeValue = style.size !== undefined ? style.size : defaultSize;
        return {
            fill: style.color || defaultColor,
            stroke: border.color || defaultBorderColor,
            "stroke-width": border.visible ? border.width : 0,
            r: sizeValue / 2 + (border.visible && sizeValue !== 0 ? ~~(border.width / 2) || 0 : 0)
        };
    },

    _createPointStyles: function(pointOptions) {
        var that = this,
            mainPointColor = pointOptions.color || that._options.mainSeriesColor,
            containerColor = that._options.containerBackgroundColor,
            normalStyle = that._parsePointStyle(pointOptions, mainPointColor, mainPointColor);

        normalStyle.visibility = pointOptions.visible ? "visible" : "hidden";

        return {
            normal: normalStyle,
            hover: that._parsePointStyle(pointOptions.hoverStyle, containerColor, mainPointColor, pointOptions.size),
            selection: that._parsePointStyle(pointOptions.selectionStyle, containerColor, mainPointColor, pointOptions.size)
        };
    },

    _checkData: function(data) {
        return _isDefined(data.argument) && data.value !== undefined;
    },

    getErrorBarRangeCorrector: function() {
        var mode,
            func;

        if(this.areErrorBarsVisible()) {
            mode = _normalizeEnum(this._options.valueErrorBar.displayMode);
            func = function(point) {
                var lowError = point.lowError,
                    highError = point.highError;
                switch(mode) {
                    case "low": return [lowError];
                    case "high": return [highError];
                    case "none": return [];
                    default: return [lowError, highError];
                }
            };
        }
        return func;
    },

    getValueRangeInitialValue: function() {
        return undefined;
    },

    _getRangeData: function() {
        return rangeCalculator.getRangeData(this);
    },

    _getPointData: function(data, options) {
        var pointData = {
            value: data[options.valueField || "val"],
            argument: data[options.argumentField || "arg"],
            tag: data[options.tagField || "tag"],
            data: data
        };

        this._fillErrorBars(data, pointData, options);
        return pointData;
    },

    _errorBarsEnabled: function() {
        return (this.valueAxisType !== DISCRETE && this.valueAxisType !== LOGARITHMIC && this.valueType !== DATETIME);
    },

    _fillErrorBars: function(data, pointData, options) {
        var errorBars = options.valueErrorBar;
        if(this.areErrorBarsVisible()) {
            pointData.lowError = data[errorBars.lowValueField || LOW_ERROR];
            pointData.highError = data[errorBars.highValueField || HIGH_ERROR];
        }
    },

    _drawPoint: function(options) {
        var point = options.point;

        if(point.isInVisibleArea()) {
            point.clearVisibility();
            point.draw(this._renderer, options.groups, options.hasAnimation, options.firstDrawing);
            this._drawnPoints.push(point);
        } else {
            point.setInvisibility();
        }
    },

    _animateComplete: function() {
        var that = this,
            animationSettings = { duration: that._defaultDuration };

        that._labelsGroup && that._labelsGroup.animate({ opacity: 1 }, animationSettings);
        that._errorBarGroup && that._errorBarGroup.animate({ opacity: (that._options.valueErrorBar).opacity || 1 }, animationSettings);
    },

    _animate: function() {
        var that = this,
            lastPointIndex = that._drawnPoints.length - 1;

        _each(that._drawnPoints || [], function(i, p) {
            p.animate(i === lastPointIndex ? function() { that._animateComplete(); } : undefined, { translateX: p.x, translateY: p.y });
        });
    },

    _defaultAggregator: "avg",

    _aggregators: {
        avg: function(aggregationInfo, series) {
            var result = {},
                valueField = series.getValueFields()[0],
                aggregate = aggregationInfo.data.reduce(function(result, item) {
                    result[0] += item[valueField];
                    result[1]++;
                    return result;
                }, [0, 0]);

            result[valueField] = aggregate[0] / aggregate[1];
            result[series.getArgumentField()] = aggregationInfo.intervalStart;

            result = calculateAvgErrorBars(result, aggregationInfo.data, series);

            return result;
        },

        sum: function(aggregationInfo, series) {
            var result = {},
                valueField = series.getValueFields()[0];

            result[valueField] = aggregationInfo.data.reduce(function(result, item) {
                result += item[valueField];
                return result;
            }, 0);

            result[series.getArgumentField()] = aggregationInfo.intervalStart;

            result = calculateSumErrorBars(result, aggregationInfo.data, series);

            return result;
        },

        count: function(aggregationInfo, series) {
            var result = {},
                valueField = series.getValueFields()[0];

            result[valueField] = aggregationInfo.data.reduce(function(result, item) {
                return ++result;
            }, 0);

            result[series.getArgumentField()] = aggregationInfo.intervalStart;

            return result;
        },

        min: function(aggregationInfo, series) {
            var result = {},
                valueField = series.getValueFields()[0],
                data = aggregationInfo.data,
                itemWithMinPoint = data[0];

            itemWithMinPoint = data.reduce(function(result, item) {
                if(item[valueField] < result[valueField]) {
                    return item;
                }
                return result;
            }, itemWithMinPoint);

            result[series.getArgumentField()] = aggregationInfo.intervalStart;

            return _extend({}, itemWithMinPoint, result);
        },

        max: function(aggregationInfo, series) {
            var result = {},
                valueField = series.getValueFields()[0],
                data = aggregationInfo.data,
                itemWithMinPoint = data[0];

            itemWithMinPoint = data.reduce(function(result, item) {
                if(item[valueField] > result[valueField]) {
                    return item;
                }
                return result;
            }, itemWithMinPoint);

            result[series.getArgumentField()] = aggregationInfo.intervalStart;

            return _extend({}, itemWithMinPoint, result);
        }
    },

    _endUpdateData: function() {
        delete this._predefinedPointOptions;
    },

    getArgumentField: function() {
        return this._options.argumentField || "arg";
    },

    getValueFields: function() {
        var options = this._options,
            errorBarsOptions = options.valueErrorBar,
            valueFields = [options.valueField || "val"],
            lowValueField,
            highValueField;

        if(errorBarsOptions) {
            lowValueField = errorBarsOptions.lowValueField;
            highValueField = errorBarsOptions.highValueField;
            _isString(lowValueField) && valueFields.push(lowValueField);
            _isString(highValueField) && valueFields.push(highValueField);
        }
        return valueFields;
    },

    _calculateErrorBars: function(data) {
        if(!this.areErrorBarsVisible()) {
            return;
        }

        var that = this,
            options = that._options,
            errorBarsOptions = options.valueErrorBar,
            errorBarType = _normalizeEnum(errorBarsOptions.type),
            floatErrorValue = parseFloat(errorBarsOptions.value),
            valueField = that.getValueFields()[0],
            value,
            lowValueField = errorBarsOptions.lowValueField || LOW_ERROR,
            highValueField = errorBarsOptions.highValueField || HIGH_ERROR,
            valueArray,
            valueArrayLength,
            meanValue,
            processDataItem,
            addSubError = function(_i, item) {
                value = item.value;
                item.lowError = value - floatErrorValue;
                item.highError = value + floatErrorValue;
            };

        switch(errorBarType) {
            case FIXED:
                processDataItem = addSubError;
                break;
            case PERCENT:
                processDataItem = function(_, item) {
                    value = item.value;
                    var error = value * floatErrorValue / 100;
                    item.lowError = value - error;
                    item.highError = value + error;
                };
                break;
            case UNDEFINED: // TODO: rework this
                processDataItem = function(_, item) {
                    item.lowError = item.data[lowValueField];
                    item.highError = item.data[highValueField];
                };
                break;
            default:
                valueArray = _map(data, function(item) { return _isDefined(item.data[valueField]) ? item.data[valueField] : null; });
                valueArrayLength = valueArray.length;
                floatErrorValue = floatErrorValue || 1;
                switch(errorBarType) {
                    case VARIANCE:
                        floatErrorValue = variance(valueArray, sum(valueArray) / valueArrayLength) * floatErrorValue;
                        processDataItem = addSubError;
                        break;
                    case STANDARD_DEVIATION:
                        meanValue = sum(valueArray) / valueArrayLength;
                        floatErrorValue = _sqrt(variance(valueArray, meanValue)) * floatErrorValue;
                        processDataItem = function(_, item) {
                            item.lowError = meanValue - floatErrorValue;
                            item.highError = meanValue + floatErrorValue;
                        };
                        break;
                    case STANDARD_ERROR:
                        floatErrorValue = _sqrt(variance(valueArray, sum(valueArray) / valueArrayLength) / valueArrayLength) * floatErrorValue;
                        processDataItem = addSubError;
                        break;
                }
        }

        processDataItem && _each(data, processDataItem);
    },

    _patchMarginOptions: function(options) {
        var pointOptions = this._getCreatingPointOptions(),
            styles = pointOptions.styles,
            maxSize = [styles.normal, styles.hover, styles.selection]
                .reduce(function(max, style) {
                    return _max(max, style.r * 2 + style["stroke-width"]);
                }, 0);

        options.size = pointOptions.visible ? maxSize : 0;
        options.sizePointNormalState = pointOptions.visible ? styles.normal.r * 2 + styles.normal["stroke-width"] : 0;

        return options;
    }
};

exports.chart = _extend({}, baseScatterMethods, {
    drawTrackers: function() {
        var that = this,
            trackers,
            trackersGroup,
            segments = that._segments || [],
            rotated = that._options.rotated,
            cat = [];

        if(!that.isVisible()) {
            return;
        }

        if(segments.length) {
            trackers = that._trackers = that._trackers || [];
            trackersGroup = that._trackersGroup = (that._trackersGroup || that._renderer.g().attr({
                fill: "gray",
                opacity: 0.001,
                stroke: "gray",
                "class": "dxc-trackers"
            })).attr({ "clip-path": this._paneClipRectID || null }).append(that._group);

            _each(segments, function(i, segment) {
                if(!trackers[i]) {
                    trackers[i] = that._drawTrackerElement(segment).data({ "chart-data-series": that }).append(trackersGroup);
                } else {
                    that._updateTrackerElement(segment, trackers[i]);
                }
            });
        }

        that._trackersTranslator = cat;
        _each(that.getVisiblePoints(), function(_, p) {
            var pointCoord = parseInt(rotated ? p.vy : p.vx);
            if(!cat[pointCoord]) {
                cat[pointCoord] = p;
            } else {
                Array.isArray(cat[pointCoord]) ? cat[pointCoord].push(p) : (cat[pointCoord] = [cat[pointCoord], p]);
            }
        });
    },

    getNeighborPoint: function(x, y) {
        var pCoord = this._options.rotated ? y : x,
            nCoord = pCoord,
            cat = this._trackersTranslator,
            point = null,
            minDistance,
            oppositeCoord = this._options.rotated ? x : y,
            oppositeCoordName = this._options.rotated ? "vx" : "vy";

        if(this.isVisible() && cat) {
            point = cat[pCoord];
            do {
                point = cat[nCoord] || cat[pCoord];
                pCoord--;
                nCoord++;
            } while((pCoord >= 0 || nCoord < cat.length) && !point);

            if(Array.isArray(point)) {
                minDistance = _abs(point[0][oppositeCoordName] - oppositeCoord);
                _each(point, function(i, p) {
                    var distance = _abs(p[oppositeCoordName] - oppositeCoord);
                    if(minDistance >= distance) {
                        minDistance = distance;
                        point = p;
                    }
                });
            }
        }

        return point;
    },

    _applyVisibleArea: function() {
        var that = this,
            rotated = that._options.rotated,
            visibleX = (rotated ? that.getValueAxis() : that.getArgumentAxis()).getTranslator().getCanvasVisibleArea(),
            visibleY = (rotated ? that.getArgumentAxis() : that.getValueAxis()).getTranslator().getCanvasVisibleArea();

        that._visibleArea = {
            minX: visibleX.min,
            maxX: visibleX.max,
            minY: visibleY.min,
            maxY: visibleY.max
        };
    }
});

exports.polar = _extend({}, baseScatterMethods, {
    drawTrackers: function() {
        exports.chart.drawTrackers.call(this);
        var cat = this._trackersTranslator,
            index;

        if(!this.isVisible()) {
            return;
        }

        _each(cat, function(i, category) {
            if(category) {
                index = i;
                return false;
            }
        });

        cat[index + 360] = cat[index];
    },

    getNeighborPoint: function(x, y) {
        var pos = vizUtils.convertXYToPolar(this.getValueAxis().getCenter(), x, y);
        return exports.chart.getNeighborPoint.call(this, pos.phi, pos.r);
    },

    _applyVisibleArea: function() {
        var that = this,
            canvas = that.getValueAxis().getCanvas();
        that._visibleArea = {
            minX: canvas.left,
            maxX: canvas.width - canvas.right,
            minY: canvas.top,
            maxY: canvas.height - canvas.bottom
        };
    }
});
