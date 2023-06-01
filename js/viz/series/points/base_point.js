const mixins = {};
import consts from '../../components/consts';
import symbolPoint from './symbol_point';
import barPoint from './bar_point';
import bubblePoint from './bubble_point';
import piePoint from './pie_point';
import rangeSymbolPoint from './range_symbol_point';
import rangeBarPoint from './range_bar_point';
import candlestickPoint from './candlestick_point';
import stockPoint from './stock_point';
import { polarSymbolPoint, polarBarPoint } from './polar_point';
import { normalizeEnum as _normalizeEnum } from '../../core/utils';
import { extend } from '../../../core/utils/extend';
const _extend = extend;
import { isDefined as _isDefined } from '../../../core/utils/type';
import { noop as _noop } from '../../../core/utils/common';
const statesConsts = consts.states;
const SYMBOL_POINT = 'symbolPoint';
const POLAR_SYMBOL_POINT = 'polarSymbolPoint';
const BAR_POINT = 'barPoint';
const POLAR_BAR_POINT = 'polarBarPoint';
const PIE_POINT = 'piePoint';
const SELECTED_STATE = statesConsts.selectedMark;
const HOVER_STATE = statesConsts.hoverMark;
const NORMAL_STATE = statesConsts.normalMark;
const HOVER = statesConsts.hover;
const NORMAL = statesConsts.normal;
const SELECTION = statesConsts.selection;

const pointTypes = {
    chart: {
        'scatter': SYMBOL_POINT,
        'line': SYMBOL_POINT,
        'spline': SYMBOL_POINT,
        'stepline': SYMBOL_POINT,
        'stackedline': SYMBOL_POINT,
        'fullstackedline': SYMBOL_POINT,
        'stackedspline': SYMBOL_POINT,
        'fullstackedspline': SYMBOL_POINT,
        'stackedsplinearea': SYMBOL_POINT,
        'fullstackedsplinearea': SYMBOL_POINT,
        'area': SYMBOL_POINT,
        'splinearea': SYMBOL_POINT,
        'steparea': SYMBOL_POINT,
        'stackedarea': SYMBOL_POINT,
        'fullstackedarea': SYMBOL_POINT,
        'rangearea': 'rangeSymbolPoint',
        'bar': BAR_POINT,
        'stackedbar': BAR_POINT,
        'fullstackedbar': BAR_POINT,
        'rangebar': 'rangeBarPoint',
        'bubble': 'bubblePoint',
        'stock': 'stockPoint',
        'candlestick': 'candlestickPoint'
    },
    pie: {
        'pie': PIE_POINT,
        'doughnut': PIE_POINT,
        'donut': PIE_POINT
    },
    polar: {
        'scatter': POLAR_SYMBOL_POINT,
        'line': POLAR_SYMBOL_POINT,
        'area': POLAR_SYMBOL_POINT,
        'bar': POLAR_BAR_POINT,
        'stackedbar': POLAR_BAR_POINT
    }
};

function isNoneMode(mode) {
    return _normalizeEnum(mode) === 'none';
}

export function Point(series, dataItem, options) {
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
        dashStyle: null,
        filter: null
    };
}

mixins.symbolPoint = symbolPoint;
mixins.barPoint = barPoint;
mixins.bubblePoint = bubblePoint;
mixins.piePoint = piePoint;
mixins.rangeSymbolPoint = rangeSymbolPoint;
mixins.rangeBarPoint = rangeBarPoint;
mixins.candlestickPoint = candlestickPoint;
mixins.stockPoint = stockPoint;
mixins.polarSymbolPoint = polarSymbolPoint;
mixins.polarBarPoint = polarBarPoint;

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
        const that = this;
        const argumentWasChanged = that.argument !== dataItem.argument;
        that.argument = that.initialArgument = that.originalArgument = dataItem.argument;
        that.tag = dataItem.tag;
        that.index = dataItem.index;

        that._dataItem = dataItem;

        that.data = dataItem.data;

        that.lowError = dataItem.lowError;
        that.highError = dataItem.highError;

        that.aggregationInfo = dataItem.aggregationInfo;

        that._updateData(dataItem, argumentWasChanged);

        !that.hasValue() && that.setInvisibility();

        that._fillStyle();
        that._updateLabelData();
    },

    deleteMarker: function() {
        const that = this;
        if(that.graphic) {
            that.graphic.dispose();
        }
        that.graphic = null;
    },

    draw: function(renderer, groups, animationEnabled, firstDrawing) {
        const that = this;
        if(that._needDeletingOnDraw || (that.series.autoHidePointMarkers && !that.isSelected())) {
            that.deleteMarker();
            that._needDeletingOnDraw = false;
        }
        if(that._needClearingOnDraw) {
            that.clearMarker();
            that._needClearingOnDraw = false;
        }

        if(!that._hasGraphic()) {
            that.getMarkerVisibility() && !that.series.autoHidePointMarkers && that._drawMarker(renderer, groups.markers, animationEnabled, firstDrawing);
        } else {
            that._updateMarker(animationEnabled, this._getStyle(), groups.markers);
        }

        that._drawLabel();

        that._drawErrorBar(renderer, groups.errorBars, animationEnabled);
        return that;
    },

    _getViewStyle: function() {
        let state = NORMAL_STATE;
        let fullState = this.fullState;
        const styles = [NORMAL, HOVER, SELECTION, SELECTION];

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
        const that = this;
        const style = that._getViewStyle();
        that._currentStyle = style;
        if(!that.graphic && that.getMarkerVisibility() && that.series.autoHidePointMarkers && (style === SELECTION || style === HOVER)) {
            that._drawMarker(that.series.getRenderer(), that.series.getMarkersGroup());
        }
        if(that.graphic) {
            if(that.series.autoHidePointMarkers && style !== SELECTION && style !== HOVER) {
                that.deleteMarker();
            } else {
                if(style === 'normal') {
                    that.clearMarker();
                } else {
                    that.graphic.toForeground();
                }
                that._updateMarker(true, that._styles[style], undefined, legendCallback);
            }
        }
    },

    setView: function(style) {
        this._viewCounters[style]++;
        this.applyView();
    },

    resetView: function(style) {
        const viewCounters = this._viewCounters;

        --viewCounters[style];
        if(viewCounters[style] < 0) { // T661080
            viewCounters[style] = 0;
        }
        this.applyView();
    },

    releaseHoverState: function() {
        const that = this;
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
        const isNewRange = ~newType.indexOf('range');
        const isOldRange = ~oldType.indexOf('range');

        return (isOldRange && !isNewRange) || (!isOldRange && isNewRange);
    },

    updateOptions: function(newOptions) {
        if(!newOptions) {
            return;
        }

        const that = this;
        const oldOptions = that._options;
        const widgetType = newOptions.widgetType;
        const oldType = oldOptions && oldOptions.type;
        const newType = newOptions.type;
        const newPointTypeMixin = pointTypes[widgetType][newType];

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
        if(this.hasValue()) {
            this._translate();
            this.translated = true;
        }
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
        for(const methodName in methods) {
            delete this[methodName];
        }
    },

    _setType: function(methods) {
        for(const methodName in methods) {
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
        const that = this;
        if(!min) {
            return { x: that.x, y: that.y };
        }

        if(!that._options.rotated) {
            return { x: that.x, y: that.minY + ((that.y - that.minY) ? 0 : 1) };
        }

        return { x: that.minX - ((that.x - that.minX) ? 0 : 1), y: that.y };
    },

    getDefaultCoords: function() {
        const that = this;
        return !that._options.rotated ? { x: that.x, y: that.defaultY } : { x: that.defaultX, y: that.y };
    },

    setDefaultCoords() {
        const coords = this.getDefaultCoords();

        this.x = coords.x;
        this.y = coords.y;
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

    isArgumentCorrect() {
        return this.series._argumentChecker(this.argument);
    },

    isValueCorrect() {
        const valueChecker = this.series._valueChecker;
        return valueChecker(this.getMinValue()) && valueChecker(this.getMaxValue());
    },

    hasValue: function() {
        return this.value !== null && this.minValue !== null && this.isArgumentCorrect() && this.isValueCorrect();
    },
    hasCoords: _noop,
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
    applyWordWrap: _noop,
    setLabelTrackerData: _noop,
    updateLabelCoord: _noop,
    drawLabel: _noop,
    correctLabelPosition: _noop,
    getMinValue: _noop,
    getMaxValue: _noop,
    _drawErrorBar: _noop,
    getMarkerVisibility: _noop,
    dispose: function() {
        const that = this;
        that.deleteMarker();
        that.deleteLabel();
        that._errorBar && this._errorBar.dispose();
        that._options = that._styles = that.series = that._errorBar = null;
    },

    getTooltipFormatObject: function(tooltip, stackPoints) {
        const that = this;
        const tooltipFormatObject = that._getFormatObject(tooltip);
        const sharedTooltipValuesArray = [];
        const tooltipStackPointsFormatObject = [];

        if(stackPoints) {
            stackPoints.forEach(point => {
                if(!point.isVisible()) return;
                const formatObject = point._getFormatObject(tooltip);
                tooltipStackPointsFormatObject.push(formatObject);
                sharedTooltipValuesArray.push(formatObject.seriesName + ': ' + formatObject.valueText);
            });

            _extend(tooltipFormatObject, {
                points: tooltipStackPointsFormatObject,
                valueText: sharedTooltipValuesArray.join('\n'),
                stackName: that.series.getStackName() || null
            });
        }

        const aggregationInfo = that.aggregationInfo;
        if(aggregationInfo) {
            const axis = that.series.getArgumentAxis();
            const rangeText = axis.formatRange(aggregationInfo.intervalStart, aggregationInfo.intervalEnd,
                aggregationInfo.aggregationInterval, tooltip.getOptions().argumentFormat);

            if(rangeText) {
                tooltipFormatObject.valueText += `\n${rangeText}`;
            }

        }
        return tooltipFormatObject;
    },

    setHole: function(holeValue, position) {
        const that = this;
        const minValue = isFinite(that.minValue) ? that.minValue : 0;
        if(_isDefined(holeValue)) {
            if(position === 'left') {
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
    },
    getCenterCoord() {
        return {
            x: this.x,
            y: this.y
        };
    }
};
