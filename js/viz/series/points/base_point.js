"use strict";

var mixins = {},
    statesConsts = require("../../components/consts").states,
    symbolPoint = require("./symbol_point"),
    barPoint = require("./bar_point"),
    bubblePoint = require("./bubble_point"),
    piePoint = require("./pie_point"),
    rangeSymbolPoint = require("./range_symbol_point"),
    rangeBarPoint = require("./range_bar_point"),
    candlestickPoint = require("./candlestick_point"),
    stockPoint = require("./stock_point"),
    polarPoints = require("./polar_point"),
    _normalizeEnum = require("../../core/utils").normalizeEnum,
    extend = require("../../../core/utils/extend").extend,
    each = require("../../../core/utils/iterator").each,
    _each = each,
    _extend = extend,
    _isDefined = require("../../../core/utils/type").isDefined,
    _noop = require("../../../core/utils/common").noop,
    SYMBOL_POINT = "symbolPoint",
    POLAR_SYMBOL_POINT = "polarSymbolPoint",
    BAR_POINT = "barPoint",
    POLAR_BAR_POINT = "polarBarPoint",
    PIE_POINT = "piePoint",
    SELECTED_STATE = statesConsts.selectedMark,
    HOVER_STATE = statesConsts.hoverMark,
    NORMAL_STATE = statesConsts.normalMark,
    HOVER = statesConsts.hover,
    NORMAL = statesConsts.normal,
    SELECTION = statesConsts.selection,

    pointTypes = {
        chart: {
            "scatter": SYMBOL_POINT,
            "line": SYMBOL_POINT,
            "spline": SYMBOL_POINT,
            "stepline": SYMBOL_POINT,
            "stackedline": SYMBOL_POINT,
            "fullstackedline": SYMBOL_POINT,
            "stackedspline": SYMBOL_POINT,
            "fullstackedspline": SYMBOL_POINT,
            "stackedsplinearea": SYMBOL_POINT,
            "fullstackedsplinearea": SYMBOL_POINT,
            "area": SYMBOL_POINT,
            "splinearea": SYMBOL_POINT,
            "steparea": SYMBOL_POINT,
            "stackedarea": SYMBOL_POINT,
            "fullstackedarea": SYMBOL_POINT,
            "rangearea": "rangeSymbolPoint",
            "bar": BAR_POINT,
            "stackedbar": BAR_POINT,
            "fullstackedbar": BAR_POINT,
            "rangebar": "rangeBarPoint",
            "bubble": "bubblePoint",
            "stock": "stockPoint",
            "candlestick": "candlestickPoint"
        },
        pie: {
            "pie": PIE_POINT,
            "doughnut": PIE_POINT,
            "donut": PIE_POINT
        },
        polar: {
            "scatter": POLAR_SYMBOL_POINT,
            "line": POLAR_SYMBOL_POINT,
            "area": POLAR_SYMBOL_POINT,
            "bar": POLAR_BAR_POINT,
            "stackedbar": POLAR_BAR_POINT
        }
    };

function isNoneMode(mode) {
    return _normalizeEnum(mode) === "none";
}

function Point(series, dataItem, options) {
    this.fullState = NORMAL_STATE;
    this.series = series;
    this.update(dataItem, options);
    this._viewCounters = {
        hover: 0,
        selection: 0
    };

    this._emptySettings = {
        fill: null,
        stroke: null,
        dashStyle: null
    };
}

exports.Point = Point;

mixins.symbolPoint = symbolPoint;
mixins.barPoint = barPoint;
mixins.bubblePoint = bubblePoint;
mixins.piePoint = piePoint;
mixins.rangeSymbolPoint = rangeSymbolPoint;
mixins.rangeBarPoint = rangeBarPoint;
mixins.candlestickPoint = candlestickPoint;
mixins.stockPoint = stockPoint;
mixins.polarSymbolPoint = polarPoints.polarSymbolPoint;
mixins.polarBarPoint = polarPoints.polarBarPoint;

Point.prototype = {
    constructor: Point,

    getColor: function() {
        if(!this.hasValue() && !this._styles.usePointCustomOptions) {
            this.series.customizePoint(this, this._dataItem);
        }
        return this._styles.normal.fill || this.series.getColor();
    },

    _getStyle: function() {
        return this._styles[this._currentStyle || 'normal'];
    },

    update: function(dataItem, options) {
        this.updateOptions(options);
        this.updateData(dataItem);
    },

    updateData: function(dataItem) {
        var that = this;
        that.argument = that.initialArgument = that.originalArgument = dataItem.argument;
        that.tag = dataItem.tag;
        that.index = dataItem.index;

        this._dataItem = dataItem;

        that.lowError = dataItem.lowError;
        that.highError = dataItem.highError;

        that._updateData(dataItem);


        !that.hasValue() && that.setInvisibility();

        that._fillStyle();
        that._updateLabelData();
    },

    deleteMarker: function() {
        var that = this;
        if(that.graphic) {
            that.graphic.dispose();
        }
        that.graphic = null;
    },

    _drawErrorBar: _noop,

    draw: function(renderer, groups, animationEnabled, firstDrawing) {
        var that = this;
        if(that._needDeletingOnDraw) {
            that.deleteMarker();
            that._needDeletingOnDraw = false;
        }
        if(that._needClearingOnDraw) {
            that.clearMarker();
            that._needClearingOnDraw = false;
        }

        if(!that._hasGraphic()) {
            that._getMarkerVisibility() && that._drawMarker(renderer, groups.markers, animationEnabled, firstDrawing);
        } else {
            that._updateMarker(animationEnabled, this._getStyle(), groups.markers);
        }

        that._drawLabel();

        that._drawErrorBar(renderer, groups.errorBars, animationEnabled);
        return that;
    },

    applyStyle: function(style, callback) {
        var that = this;
        that._currentStyle = style;
        if(that.graphic) {
            if(style === "normal") {
                that.clearMarker();
            } else {
                that.graphic.toForeground();
            }
            that._updateMarker(true, that._styles[style], undefined, callback);
        }
        return that;
    },

    _getViewStyle: function() {
        var state = NORMAL_STATE,
            fullState = this.fullState,
            styles = [NORMAL, HOVER, SELECTION, SELECTION];

        if(this._viewCounters.hover) {
            state |= HOVER_STATE;
        }

        if(this._viewCounters.selection) {
            state |= SELECTED_STATE;
        }

        if(isNoneMode(this.getOptions().selectionMode)) {
            fullState &= ~SELECTED_STATE;
        }

        if(isNoneMode(this.getOptions().hoverMode)) {
            fullState &= ~HOVER_STATE;
        }

        state |= fullState;

        return styles[state];
    },

    applyView: function(legendCallback) {
        var style = this._getViewStyle();
        this.applyStyle(style, legendCallback);
    },

    setView: function(style) {
        this._viewCounters[style]++;
        this.applyView();
    },

    resetView: function(style) {
        --this._viewCounters[style];

        ///#DEBUG
        if(this._viewCounters[style] < 0) {
            var debug = require("../../../core/utils/console").debug;
            debug.assert(false, "incorrect view style couinter " + this._viewCounters[style] + " " + style);
        }
        ///#ENDDEBUG

        this.applyView();
    },

    releaseHoverState: function() {
        var that = this;
        if(that.graphic && !that.isSelected()) {
            that.graphic.toBackground();
        }
    },

    select: function() {
        this.series.selectPoint(this);
    },

    clearSelection: function() {
        this.series.deselectPoint(this);
    },

    hover: function() {
        this.series.hoverPoint(this);
    },

    clearHover: function() {
        this.series.clearPointHover();
    },

    showTooltip: function() {
        this.series.showPointTooltip(this);
    },

    hideTooltip: function() {
        this.series.hidePointTooltip(this);
    },

    _checkLabelsChanging: function(oldType, newType) {
        var isNewRange = ~newType.indexOf("range"),
            isOldRange = ~oldType.indexOf("range");

        return (isOldRange && !isNewRange) || (!isOldRange && isNewRange);
    },

    updateOptions: function(newOptions) {
        if(!newOptions) {
            return;
        }

        var that = this,
            oldOptions = that._options,
            widgetType = newOptions.widgetType,
            oldType = oldOptions && oldOptions.type,
            newType = newOptions.type,
            newPointTypeMixin = pointTypes[widgetType][newType];

        if(oldType !== newType) {
            that._needDeletingOnDraw = true;
            that._needClearingOnDraw = false;

            if(oldType) {
                that._checkLabelsChanging(oldType, newType) && that.deleteLabel();
                that._resetType(mixins[pointTypes[oldType]]);
            }
            that._setType(mixins[newPointTypeMixin]);
        } else {
            that._needDeletingOnDraw = that._checkSymbol(oldOptions, newOptions);
            that._needClearingOnDraw = that._checkCustomize(oldOptions, newOptions);
        }

        that._options = newOptions;

        that._fillStyle();
        that._updateLabelOptions(newPointTypeMixin);
    },

    translate: function() {
        this.hasValue() && this._translate();
    },

    _checkCustomize: function(oldOptions, newOptions) {
        return oldOptions.styles.usePointCustomOptions && !newOptions.styles.usePointCustomOptions;
    },

    _getCustomLabelVisibility: function() {
        return this._styles.useLabelCustomOptions ? !!this._options.label.visible : null;
    },

    getBoundingRect: function() {
        return this._getGraphicBBox();
    },

    _resetType: function(methods) {
        for(var methodName in methods) {
            delete this[methodName];
        }
    },

    _setType: function(methods) {
        for(var methodName in methods) {
            this[methodName] = methods[methodName];
        }
    },

    isInVisibleArea: function() {
        return this.inVisibleArea;
    },

    isSelected: function() {
        return !!(this.fullState & SELECTED_STATE);
    },

    isHovered: function() {
        return !!(this.fullState & HOVER_STATE);
    },

    getOptions: function() {
        return this._options;
    },

    animate: function(complete, settings, partitionDuration) {
        if(!this.graphic) {
            complete && complete();
            return;
        }
        this.graphic.animate(settings, { partitionDuration: partitionDuration }, complete);
    },

    getCoords: function(min) {
        var that = this;
        if(!min) {
            return { x: that.x, y: that.y };
        }

        if(!that._options.rotated) {
            return { x: that.x, y: that.minY };
        }

        return { x: that.minX, y: that.y };
    },

    getDefaultCoords: function() {
        var that = this;
        return !that._options.rotated ? { x: that.x, y: that.defaultY } : { x: that.defaultX, y: that.y };
    },

    _getVisibleArea: function() {
        return this.series.getVisibleArea();
    },

    _getArgTranslator: function() {
        return this.series.getArgumentAxis().getTranslator();
    },

    _getValTranslator: function() {
        return this.series.getValueAxis().getTranslator();
    },

    _calculateVisibility: function(x, y, width, height) {
        var that = this,
            visibleArea = that._getVisibleArea(),
            rotated = that._options.rotated;

        if(((visibleArea.minX) > (x + (width || 0)) || ((visibleArea.maxX) < x) ||
            ((visibleArea.minY) > (y + (height || 0))) || ((visibleArea.maxY) < y)) ||
            (rotated && _isDefined(width) && width !== 0 && (visibleArea.minX === (x + width) || visibleArea.maxX === x)) ||
        (!rotated && _isDefined(height) && height !== 0 && (visibleArea.minY === (y + height) || visibleArea.maxY === y))
            ) {
            that.inVisibleArea = false;
        } else {
            that.inVisibleArea = true;
        }
    },

    hasValue: function() {
        return this.value !== null && this.minValue !== null;
    },
    correctPosition: _noop,
    correctRadius: _noop,
    correctLabelRadius: _noop,
    getCrosshairData: _noop,
    getPointRadius: _noop,
    _populatePointShape: _noop,
    _checkSymbol: _noop,
    getMarkerCoords: _noop,
    hide: _noop,
    show: _noop,
    hideMarker: _noop,
    setInvisibility: _noop,
    clearVisibility: _noop,
    isVisible: _noop,
    resetCorrection: _noop,
    correctValue: _noop,
    resetValue: _noop,
    setPercentValue: _noop,
    correctCoordinates: _noop,
    coordsIn: _noop,
    getTooltipParams: _noop,
    setLabelEllipsis: _noop,
    setLabelTrackerData: _noop,
    updateLabelCoord: _noop,
    drawLabel: _noop,
    correctLabelPosition: _noop,
    setMaxLabelLength: _noop,
    getMinValue: _noop,
    getMaxValue: _noop,
    dispose: function() {
        var that = this;
        that.deleteMarker();
        that.deleteLabel();
        that._errorBar && this._errorBar.dispose();
        that._options = that._styles = that.series = that._errorBar = null;
    },

    getTooltipFormatObject: function(tooltip) {
        var that = this,
            tooltipFormatObject = that._getFormatObject(tooltip),
            sharedTooltipValuesArray = [],
            tooltipStackPointsFormatObject = [];

        if(that.stackPoints) {
            _each(that.stackPoints, function(_, point) {
                if(!point.isVisible()) return;
                var formatObject = point._getFormatObject(tooltip);
                tooltipStackPointsFormatObject.push(formatObject);
                sharedTooltipValuesArray.push(formatObject.seriesName + ": " + formatObject.valueText);
            });

            _extend(tooltipFormatObject, {
                points: tooltipStackPointsFormatObject,
                valueText: sharedTooltipValuesArray.join("\n"),
                stackName: that.stackPoints.stackName
            });

        }
        return tooltipFormatObject;
    },

    setHole: function(holeValue, position) {
        var that = this,
            minValue = isFinite(that.minValue) ? that.minValue : 0;
        if(_isDefined(holeValue)) {
            if(position === "left") {
                that.leftHole = that.value - holeValue;
                that.minLeftHole = minValue - holeValue;
            } else {
                that.rightHole = that.value - holeValue;
                that.minRightHole = minValue - holeValue;
            }
        }
    },
    resetHoles: function() {
        this.leftHole = null;
        this.minLeftHole = null;
        this.rightHole = null;
        this.minRightHole = null;
    },
    getLabel: function() {
        return this._label;
    },
    getLabels: function() {
        return [this._label];
    }
};
