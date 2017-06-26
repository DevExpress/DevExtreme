"use strict";

var $ = require("../../core/renderer"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    rangeCalculator = require("./helpers/range_data_calculator"),
    commonUtils = require("../../core/utils/common"),
    typeUtils = require("../../core/utils/type"),
    vizUtils = require("../core/utils"),

    _each = $.each,
    _extend = extend,
    _noop = commonUtils.noop,
    _isDefined = commonUtils.isDefined,
    _isString = typeUtils.isString,
    _map = vizUtils.map,
    _normalizeEnum = vizUtils.normalizeEnum,
    math = Math,
    _floor = math.floor,
    _abs = math.abs,
    _sqrt = math.sqrt,
    _min = math.min,
    _max = math.max,

    DEFAULT_SYMBOL_POINT_SIZE = 2,
    DEFAULT_TRACKER_WIDTH = 12,
    DEFAULT_DURATION = 400,

    HIGH_ERROR = "highError",
    LOW_ERROR = "lowError",
    ORIGINAL = "original",

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
    //TODO why UNDEFINED is here
    //return inArray(type, [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR, UNDEFINED]) !== -1;
    return inArray(type, [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR]) !== -1;
}

function variance(array, expectedValue) {
    return sum(_map(array, function(value) {
        return (value - expectedValue) * (value - expectedValue);
    })) / array.length;
}

var baseScatterMethods = {
    _defaultDuration: DEFAULT_DURATION,

    _defaultTrackerWidth: DEFAULT_TRACKER_WIDTH,

    _applyStyle: _noop,

    _updateOptions: _noop,

    _parseStyle: _noop,

    _prepareSegment: _noop,

    _drawSegment: _noop,

    _generateDefaultSegments: _noop,

    _prepareSeriesToDrawing: function() {
        var that = this;
        that._deleteOldAnimationMethods();
        that._disposePoints(that._oldPoints);
        that._oldPoints = null;
    },

    _appendInGroup: function() {
        this._group.append(this._extGroups.seriesGroup);
    },

    _createLegendState: function(styleOptions, defaultColor) {
        return {
            fill: styleOptions.color || defaultColor,
            hatching: styleOptions.hatching
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
        settings.opacity = 1; //T172577
        that._applyMarkerClipRect(settings);
        that._markersGroup.attr(settings);
    },

    _applyVisibleArea: function() {
        var that = this,
            visibleX = that.translators.x.getCanvasVisibleArea(),
            visibleY = that.translators.y.getCanvasVisibleArea();
        that._visibleArea = {
            minX: visibleX.min,
            maxX: visibleX.max,
            minY: visibleY.min,
            maxY: visibleY.max
        };
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

    _processRange: function(point, prevPoint, errorBarCorrector) {
        rangeCalculator.processRange(this, point, prevPoint, errorBarCorrector);
    },

    _getRangeData: function(zoomArgs, calcIntervalFunction) {
        rangeCalculator.calculateRangeData(this, zoomArgs, calcIntervalFunction);
        rangeCalculator.addLabelPaddings(this);

        return this._rangeData;
    },

    _getPointData: function(data, options) {
        var pointData = {
            value: data[options.valueField || "val"],
            argument: data[options.argumentField || "arg"],
            tag: data[options.tagField || "tag"]
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

    _clearingAnimation: function(translators, drawComplete) {
        var that = this,
            params = { opacity: 0.001 },
            options = { duration: that._defaultDuration, partitionDuration: 0.5 };

        that._labelsGroup && that._labelsGroup.animate(params, options, function() {
            that._markersGroup && that._markersGroup.animate(params, options, drawComplete);
        });
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

    _getPointSize: function() {
        return this._options.point.visible ? this._options.point.size : DEFAULT_SYMBOL_POINT_SIZE;
    },

    _calcMedianValue: function(fusionPoints, valueField) {
        var result,
            allValue = _map(fusionPoints, function(point) { return _isDefined(point[valueField]) ? point[valueField] : null; });

        allValue.sort(function(a, b) { return a - b; });

        result = allValue[_floor(allValue.length / 2)];

        return _isDefined(result) ? result : null;
    },

    _calcErrorBarValues: function(fusionPoints) {
        if(!fusionPoints.length) {
            return {};
        }

        var lowValue = fusionPoints[0].lowError,
            highValue = fusionPoints[0].highError,
            i = 1,
            length = fusionPoints.length,
            lowError,
            highError;

        for(i; i < length; i++) {
            lowError = fusionPoints[i].lowError;
            highError = fusionPoints[i].highError;
            if(_isDefined(lowError) && _isDefined(highError)) {
                lowValue = _min(lowError, lowValue);
                highValue = _max(highError, highValue);
            }
        }

        return { low: lowValue, high: highValue };
    },

    _fusionPoints: function(fusionPoints, tick, index) {
        var errorBarValues = this._calcErrorBarValues(fusionPoints);
        return {
            value: this._calcMedianValue(fusionPoints, "value"),
            argument: tick,
            tag: null,
            index: index,
            seriesName: this.name,
            lowError: errorBarValues.low,
            highError: errorBarValues.high
        };
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
                value = item[valueField];
                item[lowValueField] = value - floatErrorValue;
                item[highValueField] = value + floatErrorValue;
            };

        switch(errorBarType) {
            case FIXED:
                processDataItem = addSubError;
                break;
            case PERCENT:
                processDataItem = function(_, item) {
                    value = item[valueField];
                    var error = value * floatErrorValue / 100;
                    item[lowValueField] = value - error;
                    item[highValueField] = value + error;
                };
                break;
            case UNDEFINED: //TODO: rework this
                processDataItem = function(_, item) {
                    item[lowValueField] = item[ORIGINAL + lowValueField];
                    item[highValueField] = item[ORIGINAL + highValueField];
                };
                break;
            default:
                valueArray = _map(data, function(item) { return _isDefined(item[valueField]) ? item[valueField] : null; });
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
                            item[lowValueField] = meanValue - floatErrorValue;
                            item[highValueField] = meanValue + floatErrorValue;
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

    _beginUpdateData: function(data) {
        this._calculateErrorBars(data);
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
        var pos = this.translators.untranslate(x, y);
        return exports.chart.getNeighborPoint.call(this, pos.phi, pos.r);
    },

    _applyVisibleArea: function() {
        var that = this,
            canvas = that.translators.canvas;
        that._visibleArea = {
            minX: canvas.left,
            maxX: canvas.width - canvas.right,
            minY: canvas.top,
            maxY: canvas.height - canvas.bottom
        };
    }
});
