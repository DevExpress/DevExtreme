var seriesNS = {},
    typeUtils = require("../../core/utils/type"),
    _extend = require("../../core/utils/extend").extend,
    _each = require("../../core/utils/iterator").each,
    pointModule = require("./points/base_point"),
    _isDefined = typeUtils.isDefined,
    vizUtils = require("../core/utils"),
    _isEmptyObject = typeUtils.isEmptyObject,
    _normalizeEnum = vizUtils.normalizeEnum,
    _noop = require("../../core/utils/common").noop,
    states = require("../components/consts").states,

    rangeCalculator = require("./helpers/range_data_calculator"),

    scatterSeries = require("./scatter_series"),
    lineSeries = require("./line_series"),
    areaSeries = require("./area_series"),
    barSeries = require("./bar_series"),
    rangeSeries = require("./range_series"),
    bubbleSeries = require("./bubble_series"),
    pieSeries = require("./pie_series"),
    financialSeries = require("./financial_series"),
    stackedSeries = require("./stacked_series"),

    DISCRETE = "discrete",
    SELECTED_STATE = states.selectedMark,
    HOVER_STATE = states.hoverMark,
    HOVER = states.hover,
    NORMAL = states.normal,
    SELECTION = states.selection,
    APPLY_SELECTED = states.applySelected,
    APPLY_HOVER = states.applyHover,
    RESET_ITEM = states.resetItem,
    NONE_MODE = "none",
    INCLUDE_POINTS = "includepoints",
    NEAREST_POINT = "nearestpoint",
    SERIES_SELECTION_CHANGED = "seriesSelectionChanged",
    POINT_SELECTION_CHANGED = "pointSelectionChanged",
    SERIES_HOVER_CHANGED = "seriesHoverChanged",
    POINT_HOVER_CHANGED = "pointHoverChanged",
    ALL_SERIES_POINTS = "allseriespoints",
    ALL_ARGUMENT_POINTS = "allargumentpoints",
    POINT_HOVER = "pointHover",
    CLEAR_POINT_HOVER = "clearPointHover",
    SERIES_SELECT = "seriesSelect",
    POINT_SELECT = "pointSelect",
    POINT_DESELECT = "pointDeselect",
    getEmptyBusinessRange = function() {
        return { arg: {}, val: {} };
    };

function triggerEvent(element, event, point) {
    element && element.trigger(event, point);
}

seriesNS.mixins = {
    chart: {},
    pie: {},
    polar: {}
};

seriesNS.mixins.chart.scatter = scatterSeries.chart;
seriesNS.mixins.polar.scatter = scatterSeries.polar;

_extend(seriesNS.mixins.pie, pieSeries);
_extend(seriesNS.mixins.chart, lineSeries.chart, areaSeries.chart, barSeries.chart, rangeSeries.chart,
    bubbleSeries.chart, financialSeries, stackedSeries.chart);
_extend(seriesNS.mixins.polar, lineSeries.polar, areaSeries.polar, barSeries.polar, rangeSeries.polar, bubbleSeries.polar, stackedSeries.polar);

function includePointsMode(mode) {
    mode = _normalizeEnum(mode);

    return mode === INCLUDE_POINTS || mode === ALL_SERIES_POINTS;
}

function getLabelOptions(labelOptions, defaultColor) {
    var opt = labelOptions || {},
        labelFont = _extend({}, opt.font) || {},
        labelBorder = opt.border || {},
        labelConnector = opt.connector || {},
        backgroundAttr = {
            fill: opt.backgroundColor || defaultColor,
            "stroke-width": labelBorder.visible ? labelBorder.width || 0 : 0,
            stroke: labelBorder.visible && labelBorder.width ? labelBorder.color : "none",
            dashStyle: labelBorder.dashStyle
        },
        connectorAttr = {
            stroke: labelConnector.visible && labelConnector.width ? labelConnector.color || defaultColor : "none",
            "stroke-width": labelConnector.visible ? labelConnector.width || 0 : 0
        };

    labelFont.color = (opt.backgroundColor === "none" && _normalizeEnum(labelFont.color) === "#ffffff" && opt.position !== "inside") ? defaultColor : labelFont.color;

    return {
        alignment: opt.alignment,
        format: opt.format,
        argumentFormat: opt.argumentFormat,
        customizeText: typeUtils.isFunction(opt.customizeText) ? opt.customizeText : undefined,
        attributes: { font: labelFont },
        visible: labelFont.size !== 0 ? opt.visible : false,
        showForZeroValues: opt.showForZeroValues,
        horizontalOffset: opt.horizontalOffset,
        verticalOffset: opt.verticalOffset,
        radialOffset: opt.radialOffset,
        background: backgroundAttr,
        position: opt.position,
        connector: connectorAttr,
        rotationAngle: opt.rotationAngle,
        wordWrap: opt.wordWrap,
        textOverflow: opt.textOverflow,
        cssClass: opt.cssClass
    };
}

function setPointHoverState(point, legendCallback) {
    point.fullState |= HOVER_STATE;
    point.applyView(legendCallback);
}

function releasePointHoverState(point, legendCallback) {
    point.fullState &= ~HOVER_STATE;
    point.applyView(legendCallback);
    point.releaseHoverState();
}

function setPointSelectedState(point, legendCallback) {
    point.fullState |= SELECTED_STATE;
    point.applyView(legendCallback);
}

function releasePointSelectedState(point, legendCallback) {
    point.fullState &= ~SELECTED_STATE;
    point.applyView(legendCallback);
}

function mergePointOptionsCore(base, extra) {
    var options = _extend({}, base, extra);
    options.border = _extend({}, base && base.border, extra && extra.border);
    return options;
}

function mergePointOptions(base, extra) {
    var options = mergePointOptionsCore(base, extra);
    options.image = _extend(true, {}, base.image, extra.image);
    options.selectionStyle = mergePointOptionsCore(base.selectionStyle, extra.selectionStyle);
    options.hoverStyle = mergePointOptionsCore(base.hoverStyle, extra.hoverStyle);
    return options;
}

function Series(settings, options) {
    var that = this;
    that.fullState = 0;
    that._extGroups = settings;
    that._renderer = settings.renderer;
    that._group = settings.renderer.g().attr({ "class": "dxc-series" });
    that._eventTrigger = settings.eventTrigger;
    that._eventPipe = settings.eventPipe;
    that._incidentOccurred = settings.incidentOccurred;

    that._legendCallback = _noop;
    that.updateOptions(options, settings);
}

function getData(pointData) {
    return pointData.data;
}

exports.Series = Series;

exports.mixins = seriesNS.mixins;

Series.prototype = {
    constructor: Series,

    _createLegendState: _noop,

    getLegendStyles: function() {
        return this._styles.legendStyles;
    },

    _createStyles: function(options) {
        var that = this,
            mainSeriesColor = options.mainSeriesColor;
        that._styles = {
            normal: that._parseStyle(options, mainSeriesColor, mainSeriesColor),
            hover: that._parseStyle(options.hoverStyle || {}, mainSeriesColor, mainSeriesColor),
            selection: that._parseStyle(options.selectionStyle || {}, mainSeriesColor, mainSeriesColor),
            legendStyles: {
                normal: that._createLegendState(options, mainSeriesColor),
                hover: that._createLegendState(options.hoverStyle || {}, mainSeriesColor),
                selection: that._createLegendState(options.selectionStyle || {}, mainSeriesColor)
            }
        };
    },

    setClippingParams: function(baseId, wideId, forceClipping) {
        this._paneClipRectID = baseId;
        this._widePaneClipRectID = wideId;
        this._forceClipping = forceClipping;
    },

    applyClip: function() {
        this._group.attr({ "clip-path": this._paneClipRectID });
    },

    resetClip: function() {
        this._group.attr({ "clip-path": null });
    },

    getTagField: function() { return this._options.tagField || "tag"; },

    getValueFields: _noop,

    getSizeField: _noop,

    getArgumentField: _noop,

    getPoints: function() {
        return this._points;
    },

    getPointsInViewPort: function() {
        return rangeCalculator.getPointsInViewPort(this);
    },

    _createPoint: function(data, index, oldPoint) {
        data.index = index;
        var that = this,
            pointsByArgument = that.pointsByArgument,
            options = that._getCreatingPointOptions(data),
            arg = data.argument.valueOf(),
            point = oldPoint,
            pointByArgument;

        if(point) {
            point.update(data, options);
        } else {
            point = new pointModule.Point(that, data, options);
            if(that.isSelected() && includePointsMode(that.lastSelectionMode)) {
                point.setView(SELECTION);
            }
        }

        pointByArgument = pointsByArgument[arg];
        if(pointByArgument) {
            pointByArgument.push(point);
        } else {
            pointsByArgument[arg] = [point];
        }

        if(point.hasValue()) {
            that.customizePoint(point, data);
        }
        return point;
    },

    getRangeData: function() {
        return this._visible ? this._getRangeData() : getEmptyBusinessRange();
    },

    getArgumentRange: function() {
        return this._visible ? rangeCalculator.getArgumentRange(this) : getEmptyBusinessRange();
    },

    getViewport: function() {
        return rangeCalculator.getViewport(this);
    },

    _deleteGroup: function(groupName) {
        var group = this[groupName];
        if(group) {
            group.dispose();
            this[groupName] = null;
        }
    },

    updateOptions(newOptions, settings) {
        const that = this;
        const widgetType = newOptions.widgetType;
        const oldType = that.type;
        const newType = newOptions.type;

        that.type = newType && _normalizeEnum(newType.toString());

        if(!that._checkType(widgetType) || that._checkPolarBarType(widgetType, newOptions)) {
            that.dispose();
            that.isUpdated = false;
            return;
        }

        if(oldType !== that.type) {
            that._firstDrawing = true;
            that._resetType(oldType, widgetType);
            that._setType(that.type, widgetType);
        } else {
            that._defineDrawingState();
        }

        that._options = newOptions;
        that._pointOptions = null;

        that.name = newOptions.name;
        that.pane = newOptions.pane;

        that.tag = newOptions.tag;

        if(settings) {
            that._seriesModes = settings.commonSeriesModes || that._seriesModes;
            that._valueAxis = settings.valueAxis || that._valueAxis;
            that.axis = that._valueAxis && that._valueAxis.name;
            that._argumentAxis = settings.argumentAxis || that._argumentAxis;
        }

        that._createStyles(newOptions);

        that._stackName = null;

        that._updateOptions(newOptions);

        that._visible = newOptions.visible;
        that.isUpdated = true;

        that.stack = newOptions.stack;
        that.barOverlapGroup = newOptions.barOverlapGroup;

        that._createGroups();

        that._processEmptyValue = newOptions.ignoreEmptyPoints ? x => x === null ? undefined : x : x => x;
    },

    _defineDrawingState() {
        this._firstDrawing = true;
    },

    _disposePoints: function(points) {
        _each(points || [], function(_, p) {
            p.dispose();
        });
    },

    updateDataType: function(settings) {
        var that = this;
        that.argumentType = settings.argumentType;
        that.valueType = settings.valueType;
        that.argumentAxisType = settings.argumentAxisType;
        that.valueAxisType = settings.valueAxisType;
        that.showZero = settings.showZero;
        return that;
    },

    getOptions: function() {
        return this._options;
    },

    _getOldPoint: function(data, oldPointsByArgument, index) {
        var arg = data.argument && data.argument.valueOf(),
            point = (oldPointsByArgument[arg] || [])[0];

        if(point) {
            oldPointsByArgument[arg].splice(0, 1);
        }

        return point;
    },

    updateData: function(data) {
        const that = this;
        const options = that._options;
        const nameField = options.nameField;

        data = data || [];

        if(data.length) {
            that._canRenderCompleteHandle = true;
        }

        const dataSelector = this._getPointDataSelector();
        let itemsWithoutArgument = 0;

        that._data = data.reduce((data, dataItem, index) => {
            const pointDataItem = dataSelector(dataItem);
            if(_isDefined(pointDataItem.argument)) {
                if((!nameField || dataItem[nameField] === options.nameFieldValue)) {
                    pointDataItem.index = index;
                    data.push(pointDataItem);
                }
            } else {
                itemsWithoutArgument++;
            }
            return data;
        }, []);

        if(itemsWithoutArgument && itemsWithoutArgument === data.length) {
            that._incidentOccurred("W2002", [that.name, that.getArgumentField()]);
        }
        that._endUpdateData();
    },

    _getData() {
        let data = this._data || [];

        if(this.useAggregation()) {
            data = this._resample(this.getArgumentAxis().getAggregationInfo(this._useAllAggregatedPoints, this.argumentAxisType !== DISCRETE ? this.getArgumentRange() : {}), data);
        }

        return data;
    },

    useAggregation: function() {
        var aggregation = this.getOptions().aggregation;

        return aggregation && aggregation.enabled;
    },

    autoHidePointMarkersEnabled: _noop,

    usePointsToDefineAutoHiding: _noop,

    createPoints(useAllAggregatedPoints) {
        this._normalizeUsingAllAggregatedPoints(useAllAggregatedPoints);
        this._createPoints();
    },

    _normalizeUsingAllAggregatedPoints: function(useAllAggregatedPoints) {
        this._useAllAggregatedPoints = this.useAggregation() && (this.argumentAxisType === DISCRETE || ((this._data || []).length > 1 && !!useAllAggregatedPoints));
    },

    _createPoints: function() {
        var that = this,
            oldPointsByArgument = that.pointsByArgument || {},
            data = that._getData(),
            points;

        that.pointsByArgument = {};

        that._calculateErrorBars(data);

        const skippedFields = {};
        points = data.reduce((points, pointDataItem) => {
            if(that._checkData(pointDataItem, skippedFields)) {
                const pointIndex = points.length;
                const oldPoint = that._getOldPoint(pointDataItem, oldPointsByArgument, pointIndex);
                const point = that._createPoint(pointDataItem, pointIndex, oldPoint);

                points.push(point);
            }
            return points;
        }, []);

        for(let field in skippedFields) {
            if(skippedFields[field] === data.length) {
                that._incidentOccurred("W2002", [that.name, field]);
            }
        }
        Object.keys(oldPointsByArgument).forEach((key) => that._disposePoints(oldPointsByArgument[key]));

        that._points = points;
    },

    _removeOldSegments: function() {
        var that = this,
            startIndex = that._segments.length;

        _each(that._graphics.splice(startIndex, that._graphics.length) || [], function(_, elem) {
            that._removeElement(elem);
        });
        if(that._trackers) {
            _each(that._trackers.splice(startIndex, that._trackers.length) || [], function(_, elem) {
                elem.remove();
            });
        }
    },

    _drawElements: function(animationEnabled, firstDrawing, translateAllPoints) {
        var that = this,
            points = that._points || [],
            closeSegment = points[0] && points[0].hasValue() && that._options.closed,
            groupForPoint = {
                markers: that._markersGroup,
                errorBars: that._errorBarGroup
            },
            segments;

        that._drawnPoints = [];
        that._graphics = that._graphics || [];
        that._segments = [];

        segments = points.reduce(function(segments, p) {
            var segment = segments[segments.length - 1];

            if(!p.translated || translateAllPoints) {
                p.translate();
                !translateAllPoints && p.setDefaultCoords();
            }
            if(p.hasValue() && p.hasCoords()) {
                translateAllPoints && that._drawPoint({ point: p, groups: groupForPoint, hasAnimation: animationEnabled, firstDrawing });
                segment.push(p);
            } else if(!p.hasValue()) {
                segment.length && segments.push([]);
            } else {
                p.setInvisibility();
            }

            return segments;
        }, [[]]);

        segments.forEach(function(segment, index) {
            if(segment.length) {
                that._drawSegment(segment, animationEnabled, index, closeSegment && index === this.length - 1);
            }
        }, segments);

        that._firstDrawing = points.length ? false : true;

        that._removeOldSegments();

        animationEnabled && that._animate(firstDrawing);
    },

    draw: function(animationEnabled, hideLayoutLabels, legendCallback) {
        var that = this,
            firstDrawing = that._firstDrawing;

        that._legendCallback = legendCallback || that._legendCallback;

        if(!that._visible) {
            animationEnabled = false;
            that._group.remove();
            return;
        }

        that._appendInGroup();

        that._applyVisibleArea();
        that._setGroupsSettings(animationEnabled, firstDrawing);

        !firstDrawing && that._drawElements(false, firstDrawing, false);
        that._drawElements(animationEnabled, firstDrawing, true);

        hideLayoutLabels && that.hideLabels();

        if(that.isSelected()) {
            that._changeStyle(that.lastSelectionMode, undefined, true);
        } else if(that.isHovered()) {
            that._changeStyle(that.lastHoverMode, undefined, true);
        }
    },

    _setLabelGroupSettings: function(animationEnabled) {
        var settings = { "class": "dxc-labels" };
        this._applyElementsClipRect(settings);
        this._applyClearingSettings(settings);
        animationEnabled && (settings.opacity = 0.001);
        this._labelsGroup.attr(settings).append(this._extGroups.labelsGroup);
    },

    _checkType: function(widgetType) {
        return !!seriesNS.mixins[widgetType][this.type];
    },

    _checkPolarBarType: function(widgetType, options) {
        return (widgetType === "polar" && options.spiderWidget && this.type.indexOf("bar") !== -1);
    },

    _resetType: function(seriesType, widgetType) {
        var methodName,
            methods;

        if(seriesType) {
            methods = seriesNS.mixins[widgetType][seriesType];
            for(methodName in methods) {
                delete this[methodName];
            }
        }
    },

    _setType: function(seriesType, widgetType) {
        var methodName,
            methods = seriesNS.mixins[widgetType][seriesType];

        for(methodName in methods) {
            this[methodName] = methods[methodName];
        }
    },

    _setPointsView: function(view, target) {
        this.getPoints().forEach(function(point) {
            if(target !== point) {
                point.setView(view);
            }
        });
    },

    _resetPointsView: function(view, target) {
        this.getPoints().forEach(function(point) {
            if(target !== point) {
                point.resetView(view);
            }
        });
    },

    _resetNearestPoint: function() {
        var that = this;
        that._nearestPoint && that._nearestPoint.series !== null && that._nearestPoint.resetView(HOVER);
        that._nearestPoint = null;
    },

    _setSelectedState: function(mode) {
        var that = this;

        that.lastSelectionMode = _normalizeEnum(mode || that._options.selectionMode);

        that.fullState = that.fullState | SELECTED_STATE;

        that._resetNearestPoint();
        that._changeStyle(that.lastSelectionMode);

        if(that.lastSelectionMode !== NONE_MODE && that.isHovered() && includePointsMode(that.lastHoverMode)) {
            that._resetPointsView(HOVER);
        }
    },

    _releaseSelectedState: function() {
        var that = this;

        that.fullState = that.fullState & ~SELECTED_STATE;

        that._changeStyle(that.lastSelectionMode, SELECTION);

        if(that.lastSelectionMode !== NONE_MODE && that.isHovered() && includePointsMode(that.lastHoverMode)) {
            that._setPointsView(HOVER);
        }
    },

    isFullStackedSeries: function() {
        return this.type.indexOf("fullstacked") === 0;
    },

    isStackedSeries: function() {
        return this.type.indexOf("stacked") === 0;
    },

    isFinancialSeries: function() {
        return this.type === "stock" || this.type === "candlestick";
    },

    _canChangeView: function() {
        return !this.isSelected() && _normalizeEnum(this._options.hoverMode) !== NONE_MODE;
    },

    _changeStyle: function(mode, resetView, skipPoints) {
        var that = this,
            state = that.fullState,
            styles = [NORMAL, HOVER, SELECTION, SELECTION];

        if(that.lastHoverMode === "none") {
            state &= ~HOVER_STATE;
        }

        if(that.lastSelectionMode === "none") {
            state &= ~SELECTED_STATE;
        }

        if(includePointsMode(mode) && !skipPoints) {
            if(!resetView) {
                that._setPointsView(styles[state]);
            } else {
                that._resetPointsView(resetView);
            }
        }

        that._legendCallback([RESET_ITEM, APPLY_HOVER, APPLY_SELECTED, APPLY_SELECTED][state]);
        that._applyStyle(that._styles[styles[state]]);
    },

    updateHover: function(x, y) {
        var that = this,
            currentNearestPoint = that._nearestPoint,
            point = that.isHovered() && that.lastHoverMode === NEAREST_POINT && that.getNeighborPoint(x, y);

        if(point !== currentNearestPoint && !(that.isSelected() && that.lastSelectionMode !== NONE_MODE)) {
            that._resetNearestPoint();
            if(point) {
                point.setView(HOVER);
                that._nearestPoint = point;
            }
        }
    },

    _getMainAxisName: function() {
        return this._options.rotated ? "X" : "Y";
    },

    areLabelsVisible: function() {
        return !_isDefined(this._options.maxLabelCount) || (this._points.length <= this._options.maxLabelCount);
    },

    getLabelVisibility: function() {
        return this.areLabelsVisible() && this._options.label && this._options.label.visible;
    },

    customizePoint: function(point, pointData) {
        var that = this,
            options = that._options,
            customizePoint = options.customizePoint,
            customizeObject,
            pointOptions,
            customLabelOptions,
            customOptions,
            customizeLabel = options.customizeLabel,
            useLabelCustomOptions,
            usePointCustomOptions;

        if(customizeLabel && customizeLabel.call) {
            customizeObject = _extend({ seriesName: that.name }, pointData);
            customizeObject.series = that;
            customLabelOptions = customizeLabel.call(customizeObject, customizeObject);
            useLabelCustomOptions = customLabelOptions && !_isEmptyObject(customLabelOptions);
            customLabelOptions = useLabelCustomOptions ? _extend(true, {}, options.label, customLabelOptions) : null;
        }

        if(customizePoint && customizePoint.call) {
            customizeObject = customizeObject || _extend({ seriesName: that.name }, pointData);
            customizeObject.series = that;
            customOptions = customizePoint.call(customizeObject, customizeObject);
            usePointCustomOptions = customOptions && !_isEmptyObject(customOptions);
        }

        if(useLabelCustomOptions || usePointCustomOptions) {
            pointOptions = that._parsePointOptions(that._preparePointOptions(customOptions), customLabelOptions || options.label, pointData, point);
            pointOptions.styles.useLabelCustomOptions = useLabelCustomOptions;
            pointOptions.styles.usePointCustomOptions = usePointCustomOptions;

            point.updateOptions(pointOptions);
        }
    },

    show: function() {
        if(!this._visible) {
            this._changeVisibility(true);
        }
    },

    hide: function() {
        if(this._visible) {
            this._changeVisibility(false);
        }
    },

    _changeVisibility: function(visibility) {
        var that = this;
        that._visible = that._options.visible = visibility;
        that._updatePointsVisibility();
        that.hidePointTooltip();
        that._options.visibilityChanged(that);
    },

    // TODO. Problem related to 'point' option for bar-like series. Revisit this code once options parsing is changed
    // see T243839, T231939
    _updatePointsVisibility: _noop,

    hideLabels: function() {
        _each(this._points, function(_, point) {
            point._label.draw(false);
        });
    },

    _parsePointOptions: function(pointOptions, labelOptions, data, point) {
        var that = this,
            options = that._options,
            styles = that._createPointStyles(pointOptions, data, point),
            parsedOptions = _extend({}, pointOptions, {
                type: options.type,
                rotated: options.rotated,
                styles: styles,
                widgetType: options.widgetType,
                visibilityChanged: options.visibilityChanged
            });

        parsedOptions.label = getLabelOptions(labelOptions, styles.normal.fill);

        if(that.areErrorBarsVisible()) {
            parsedOptions.errorBars = options.valueErrorBar;
        }

        return parsedOptions;
    },

    _preparePointOptions: function(customOptions) {
        var pointOptions = this._getOptionsForPoint();
        return customOptions ? mergePointOptions(pointOptions, customOptions) : pointOptions;
    },

    _getMarkerGroupOptions: function() {
        return _extend(false, {}, this._getOptionsForPoint(), { hoverStyle: {}, selectionStyle: {} });
    },

    _getAggregationMethod: function(isDiscrete) {
        const options = this.getOptions().aggregation;
        const method = _normalizeEnum(options.method);
        const customAggregator = method === "custom" && options.calculate;

        let aggregator;

        if(isDiscrete) {
            aggregator = ({ data }) => data[0];
        } else {
            aggregator = this._aggregators[method] || this._aggregators[this._defaultAggregator];
        }

        return customAggregator || aggregator;
    },

    _resample({ interval, ticks }, data) {
        var that = this,
            isDiscrete = that.argumentAxisType === DISCRETE || that.valueAxisType === DISCRETE,
            dataIndex = 0,
            dataSelector = this._getPointDataSelector(),
            options = that.getOptions(),
            addAggregatedData = (target, data, aggregationInfo) => {
                if(!data) {
                    return;
                }
                const processData = (d) => {
                    const pointData = d && dataSelector(d, options);
                    if(pointData && that._checkData(pointData)) {
                        pointData.aggregationInfo = aggregationInfo;
                        target.push(pointData);
                    }
                };

                if(data.length) {
                    data.forEach(processData);
                } else {
                    processData(data);
                }
            },
            aggregationMethod = this._getAggregationMethod(isDiscrete);

        if(isDiscrete) {
            return data.reduce((result, dataItem, index, data) => {
                result[1].push(dataItem);
                if(index === data.length - 1 || (index + 1) % interval === 0) {
                    const dataInInterval = result[1];
                    const aggregationInfo = {
                        aggregationInterval: interval,
                        data: dataInInterval.map(getData)
                    };
                    addAggregatedData(result[0], aggregationMethod(aggregationInfo, that));
                    result[1] = [];
                }

                return result;
            }, [[], []])[0];
        }

        const aggregatedData = [];

        for(let i = 1; i < ticks.length; i++) {
            const intervalEnd = ticks[i];
            const intervalStart = ticks[i - 1];
            const dataInInterval = [];
            while(data[dataIndex] && data[dataIndex].argument < intervalEnd) {
                if(data[dataIndex].argument >= intervalStart) {
                    dataInInterval.push(data[dataIndex]);
                }
                dataIndex++;
            }
            const aggregationInfo = {
                intervalStart,
                intervalEnd,
                aggregationInterval: interval,
                data: dataInInterval.map(getData)
            };
            addAggregatedData(aggregatedData, aggregationMethod(aggregationInfo, that), aggregationInfo);
        }

        that._endUpdateData();
        return aggregatedData;
    },

    canRenderCompleteHandle: function() {
        var result = this._canRenderCompleteHandle;
        delete this._canRenderCompleteHandle;
        return !!result;
    },

    isHovered: function() {
        return !!(this.fullState & 1);
    },

    isSelected: function() {
        return !!(this.fullState & 2);
    },

    isVisible: function() {
        return this._visible;
    },

    getAllPoints: function() {
        this._createAllAggregatedPoints();
        return (this._points || []).slice();
    },

    getPointByPos: function(pos) {
        this._createAllAggregatedPoints();
        return (this._points || [])[pos];
    },

    getVisiblePoints: function() {
        return (this._drawnPoints || []).slice();
    },

    selectPoint: function(point) {
        if(!point.isSelected()) {
            setPointSelectedState(point, this._legendCallback);
            this._eventPipe({ action: POINT_SELECT, target: point });
            this._eventTrigger(POINT_SELECTION_CHANGED, { target: point });
        }
    },

    deselectPoint: function(point) {
        if(point.isSelected()) {
            releasePointSelectedState(point, this._legendCallback);
            this._eventPipe({ action: POINT_DESELECT, target: point });
            this._eventTrigger(POINT_SELECTION_CHANGED, { target: point });
        }
    },

    hover: function(mode) {
        var that = this,
            eventTrigger = that._eventTrigger;

        if(that.isHovered()) {
            return;
        }

        that.lastHoverMode = _normalizeEnum(mode || that._options.hoverMode);

        that.fullState = that.fullState | HOVER_STATE;

        that._changeStyle(that.lastHoverMode, undefined, that.isSelected() && that.lastSelectionMode !== NONE_MODE);

        eventTrigger(SERIES_HOVER_CHANGED, { target: that });
    },

    clearHover: function() {
        var that = this,
            eventTrigger = that._eventTrigger;

        if(!that.isHovered()) {
            return;
        }

        that._resetNearestPoint();
        that.fullState = that.fullState & ~HOVER_STATE;

        that._changeStyle(that.lastHoverMode, HOVER, that.isSelected() && that.lastSelectionMode !== NONE_MODE);

        eventTrigger(SERIES_HOVER_CHANGED, { target: that });
    },

    hoverPoint: function(point) {
        var that = this;

        if(!point.isHovered()) {
            point.clearHover();
            setPointHoverState(point, that._legendCallback);
            that._canChangeView() && that._applyStyle(that._styles.hover);
            that._eventPipe({ action: POINT_HOVER, target: point });
            that._eventTrigger(POINT_HOVER_CHANGED, { target: point });
        }
    },

    clearPointHover: function() {
        var that = this;

        that.getPoints().some(function(currentPoint) {
            if(currentPoint.isHovered()) {
                releasePointHoverState(currentPoint, that._legendCallback);
                that._canChangeView() && that._applyStyle(that._styles.normal);
                that._eventPipe({ action: CLEAR_POINT_HOVER, target: currentPoint });
                that._eventTrigger(POINT_HOVER_CHANGED, { target: currentPoint });
                return true;
            }
            return false;
        });
    },

    showPointTooltip: function(point) {
        triggerEvent(this._extGroups.seriesGroup, "showpointtooltip", point);
    },

    hidePointTooltip: function(point) {
        triggerEvent(this._extGroups.seriesGroup, "hidepointtooltip", point);
    },

    select: function() {
        var that = this;

        if(!that.isSelected()) {
            that._setSelectedState(that._options.selectionMode);
            that._eventPipe({ action: SERIES_SELECT, target: that });
            that._group.toForeground();
            that._eventTrigger(SERIES_SELECTION_CHANGED, { target: that });
        }
    },

    clearSelection: function clearSelection() {
        var that = this;

        if(that.isSelected()) {
            that._releaseSelectedState();
            that._eventTrigger(SERIES_SELECTION_CHANGED, { target: that });
        }
    },

    getPointsByArg: function(arg, skipPointsCreation) {
        var that = this,
            argValue = arg.valueOf(),
            points = that.pointsByArgument[argValue];

        if(!points && !skipPointsCreation && that._createAllAggregatedPoints()) {
            points = that.pointsByArgument[argValue];
        }
        return points || [];
    },

    _createAllAggregatedPoints: function() {
        if(this.useAggregation() && !this._useAllAggregatedPoints) {
            this.createPoints(true);
            return true;
        }
        return false;
    },

    getPointsByKeys: function(arg) {
        return this.getPointsByArg(arg);
    },

    notify: function(data) {
        var that = this,
            action = data.action,
            seriesModes = that._seriesModes,
            target = data.target,
            targetOptions = target.getOptions(),
            pointHoverMode = _normalizeEnum(targetOptions.hoverMode),
            selectionModeOfPoint = _normalizeEnum(targetOptions.selectionMode);

        if(action === POINT_HOVER) {
            that._hoverPointHandler(target, pointHoverMode, data.notifyLegend);
        } else if(action === CLEAR_POINT_HOVER) {
            that._clearPointHoverHandler(target, pointHoverMode, data.notifyLegend);
        } else if(action === SERIES_SELECT) {
            (target !== that) && (seriesModes.seriesSelectionMode === "single") && that.clearSelection();
        } else if(action === POINT_SELECT) {
            if(seriesModes.pointSelectionMode === "single") {
                that.getPoints().some(function(currentPoint) {
                    if(currentPoint !== target && currentPoint.isSelected()) {
                        that.deselectPoint(currentPoint);
                        return true;
                    }
                    return false;
                });
            }
            that._selectPointHandler(target, selectionModeOfPoint);
        } else if(action === POINT_DESELECT) {
            that._deselectPointHandler(target, selectionModeOfPoint);
        }
    },

    _selectPointHandler: function(target, mode) {
        var that = this;

        if(mode === ALL_SERIES_POINTS) {
            (target.series === that) && that._setPointsView(SELECTION, target);
        } else if(mode === ALL_ARGUMENT_POINTS) {
            that.getPointsByKeys(target.argument, target.argumentIndex).forEach(function(currentPoint) {
                (currentPoint !== target) && currentPoint.setView(SELECTION);
            });
        }
    },

    _deselectPointHandler: function(target, mode) {
        if(mode === ALL_SERIES_POINTS) {
            (target.series === this) && this._resetPointsView(SELECTION, target);
        } else if(mode === ALL_ARGUMENT_POINTS) {
            this.getPointsByKeys(target.argument, target.argumentIndex).forEach(function(currentPoint) {
                (currentPoint !== target) && currentPoint.resetView(SELECTION);
            });
        }
    },

    _hoverPointHandler: function(target, mode, notifyLegend) {
        var that = this;

        if(target.series !== that && mode === ALL_ARGUMENT_POINTS) {
            that.getPointsByKeys(target.argument, target.argumentIndex).forEach(function(currentPoint) {
                currentPoint.setView(HOVER);
            });
            notifyLegend && that._legendCallback(target);
        } else if(mode === ALL_SERIES_POINTS && target.series === that) {
            that._setPointsView(HOVER, target);
        }
    },

    _clearPointHoverHandler: function(target, mode, notifyLegend) {
        var that = this;

        if(mode === ALL_ARGUMENT_POINTS) {
            (target.series !== that) && that.getPointsByKeys(target.argument, target.argumentIndex).forEach(function(currentPoint) {
                currentPoint.resetView(HOVER);
            });
            notifyLegend && that._legendCallback(target);
        } else if(mode === ALL_SERIES_POINTS && target.series === that) {
            that._resetPointsView(HOVER, target);
        }
    },

    _deletePoints: function() {
        var that = this;
        that._disposePoints(that._points);
        that._points = that._drawnPoints = null;
    },

    _deleteTrackers: function() {
        var that = this;
        _each(that._trackers || [], function(_, tracker) {
            tracker.remove();
        });
        that._trackersGroup && that._trackersGroup.dispose();
        that._trackers = that._trackersGroup = null;
    },

    dispose: function() {
        var that = this;
        that._deletePoints();
        that._group.dispose();
        that._labelsGroup && that._labelsGroup.dispose();
        that._errorBarGroup && that._errorBarGroup.dispose();

        that._deleteTrackers();

        that._group =
            that._extGroups =
            that._markersGroup =
            that._elementsGroup =
            that._bordersGroup =
            that._labelsGroup =
            that._errorBarGroup =

            that._graphics =

            that._rangeData =
            that._renderer =
            that._styles =
            that._options =
            that._pointOptions =

            that._drawnPoints =
            that.pointsByArgument =
            that._segments =
            that._prevSeries = null;
    },

    correctPosition: _noop,

    drawTrackers: _noop,

    getNeighborPoint: _noop,

    areErrorBarsVisible: _noop,

    getMarginOptions: function() {
        return this._patchMarginOptions({
            percentStick: this.isFullStackedSeries()
        });
    },

    getColor: function() {
        return this.getLegendStyles().normal.fill;
    },

    getOpacity: function() {
        return this._options.opacity;
    },

    getStackName: function() {
        return this._stackName;
    },

    getBarOverlapGroup: function() {
        return this._options.barOverlapGroup;
    },

    getPointByCoord: function(x, y) {
        var point = this.getNeighborPoint(x, y);
        return point && point.coordsIn(x, y) ? point : null;
    },

    getValueAxis: function() {
        return this._valueAxis;
    },

    getArgumentAxis: function() {
        return this._argumentAxis;
    },

    getMarkersGroup() {
        return this._markersGroup;
    },

    getRenderer() {
        return this._renderer;
    }
};
