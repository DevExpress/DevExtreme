var domAdapter = require("../../core/dom_adapter"),
    eventsEngine = require("../../events/core/events_engine"),
    clickEvent = require("../../events/click"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    consts = require("../components/consts"),
    eventsConsts = consts.events,

    vizUtils = require("../core/utils"),
    pointerEvents = require("../../events/pointer"),
    holdEvent = require("../../events/hold"),
    addNamespace = require("../../events/utils").addNamespace,
    isDefined = require("../../core/utils/type").isDefined,
    _normalizeEnum = require("../core/utils").normalizeEnum,
    _floor = Math.floor,
    _each = each,
    _noop = require("../../core/utils/common").noop,

    HOVER_STATE = consts.states.hoverMark,
    NORMAL_STATE = consts.states.normalMark,

    EVENT_NS = "dxChartTracker",
    DOT_EVENT_NS = "." + EVENT_NS,
    POINTER_ACTION = addNamespace([pointerEvents.down, pointerEvents.move], EVENT_NS),
    LEGEND_CLICK = "legendClick",
    SERIES_CLICK = "seriesClick",
    POINT_CLICK = "pointClick",
    POINT_DATA = "chart-data-point",
    SERIES_DATA = "chart-data-series",
    ARG_DATA = "chart-data-argument",
    DELAY = 100,

    NONE_MODE = "none",
    ALL_ARGUMENT_POINTS_MODE = "allargumentpoints",
    INCLUDE_POINTS_MODE = "includepoints",
    EXLUDE_POINTS_MODE = "excludepoints",
    LEGEND_HOVER_MODES = [INCLUDE_POINTS_MODE, EXLUDE_POINTS_MODE, NONE_MODE];

function getData(event, dataKey) {
    var target = event.target;
    return (target.tagName === "tspan" ? target.parentNode : target)[dataKey];
}

function eventCanceled(event, target) {
    return event.cancel || !target.getOptions();
}

function inCanvas(canvas, x, y) {
    return (x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom);
}

function correctLegendHoverMode(mode) {
    if(LEGEND_HOVER_MODES.indexOf(mode) > -1) {
        return mode;
    } else {
        return INCLUDE_POINTS_MODE;
    }
}

function correctHoverMode(target) {
    var mode = target.getOptions().hoverMode;

    return mode === NONE_MODE ? mode : ALL_ARGUMENT_POINTS_MODE;
}

var baseTrackerPrototype = {
    ctor: function(options) {
        var that = this,
            data = { tracker: that };

        that._renderer = options.renderer;
        that._legend = options.legend;
        that._tooltip = options.tooltip;
        that._eventTrigger = options.eventTrigger;
        that._seriesGroup = options.seriesGroup;

        options.seriesGroup.off(DOT_EVENT_NS)
            .on(addNamespace(eventsConsts.showPointTooltip, EVENT_NS), data, that._showPointTooltip)
            .on(addNamespace(eventsConsts.hidePointTooltip, EVENT_NS), data, that._hidePointTooltip);

        that._renderer.root.off(DOT_EVENT_NS)
            .on(POINTER_ACTION, data, that._pointerHandler)
            .on(addNamespace(clickEvent.name, EVENT_NS), data, that._clickHandler)
            .on(addNamespace(holdEvent.name, EVENT_NS), { timeout: 300 }, _noop);
    },

    update: function() {},

    updateSeries(series, resetDecorations) {
        const that = this;
        const noHoveredSeries = !(series && series.some(s => s === that.hoveredSeries) || that._hoveredPoint && that._hoveredPoint.series);

        if(that._storedSeries !== series) {
            that._storedSeries = series || [];
        }

        if(noHoveredSeries) {
            that._clean();
            that._renderer.initHatching();
        }

        if(resetDecorations) {
            that.clearSelection();
            if(!noHoveredSeries) {
                that._hideTooltip(that.pointAtShownTooltip);
                that.clearHover();
            }
        }
    },

    setCanvases: function(mainCanvas, paneCanvases) {
        this._mainCanvas = mainCanvas;
        this._canvases = paneCanvases;
    },

    repairTooltip: function() {
        var point = this.pointAtShownTooltip;
        if(!point || !point.series || !point.isVisible()) {
            this._hideTooltip(point, true);
        } else {
            this._showTooltip(point);
        }
    },

    _setHoveredPoint: function(point) {
        if(point === this._hoveredPoint) {
            return;
        }
        this._releaseHoveredPoint();
        point.hover();
        this._hoveredPoint = point;
    },

    _releaseHoveredPoint: function() {
        if(this._hoveredPoint && this._hoveredPoint.getOptions()) {
            this._hoveredPoint.clearHover();
            this._hoveredPoint = null;
            if(this._tooltip.isEnabled()) {
                this._hideTooltip(this._hoveredPoint);
            }
        }
    },

    _setHoveredSeries: function(series, mode) {
        this._releaseHoveredSeries();
        this._releaseHoveredPoint();
        series.hover(mode);
        this.hoveredSeries = series;
    },

    _releaseHoveredSeries: function(needSetHoverView, hoveredPoint) { // hoveredPoint only for T273289
        if(this.hoveredSeries) {
            this.hoveredSeries.clearHover();
            this.hoveredSeries = null;
        }
    },

    clearSelection() {
        this._storedSeries.forEach(series => {
            if(series) {
                series.clearSelection();
                series.getPoints().forEach(point => {
                    point.clearSelection();
                });
            }
        });
    },

    _clean: function() {
        var that = this;
        that.hoveredPoint = that.hoveredSeries = that._hoveredArgumentPoints = null;
        that._hideTooltip(that.pointAtShownTooltip);
    },

    clearHover: function() {
        this._resetHoveredArgument();
        this._releaseHoveredSeries();
        this._releaseHoveredPoint();
    },

    _hideTooltip: function(point, silent) {
        var that = this;
        if(!that._tooltip || (point && that.pointAtShownTooltip !== point)) {
            return;
        }
        if(!silent && that.pointAtShownTooltip) {
            that.pointAtShownTooltip = null;
        }
        that._tooltip.hide();
    },

    _showTooltip: function(point) {
        var that = this,
            tooltipFormatObject,
            eventData;

        if(point && point.getOptions()) {
            tooltipFormatObject = point.getTooltipFormatObject(that._tooltip);
            if(!isDefined(tooltipFormatObject.valueText) && !tooltipFormatObject.points || !point.isVisible()) {
                return;
            }
            if(!that.pointAtShownTooltip || that.pointAtShownTooltip !== point) {
                eventData = { target: point };
            }

            var coords = point.getTooltipParams(that._tooltip.getLocation()),
                rootOffset = that._renderer.getRootOffset();
            coords.x += rootOffset.left;
            coords.y += rootOffset.top;
            if(!that._tooltip.show(tooltipFormatObject, coords, eventData)) {
                return;
            }
            that.pointAtShownTooltip = point;
        }
    },

    _showPointTooltip: function(event, point) {
        var that = event.data.tracker,
            pointWithTooltip = that.pointAtShownTooltip;

        if(pointWithTooltip && pointWithTooltip !== point) {
            that._hideTooltip(pointWithTooltip);
        }
        that._showTooltip(point);
    },

    _hidePointTooltip: function(event, point) {
        event.data.tracker._hideTooltip(point);
    },

    _enableOutHandler: function() {
        if(this._outHandler) {
            return;
        }
        var that = this,
            handler = function(e) {
                var rootOffset = that._renderer.getRootOffset(),
                    x = _floor(e.pageX - rootOffset.left),
                    y = _floor(e.pageY - rootOffset.top);
                if(!inCanvas(that._mainCanvas, x, y)) {
                    that._pointerOut();
                    that._disableOutHandler();
                }
            };

        eventsEngine.on(domAdapter.getDocument(), POINTER_ACTION, handler);
        this._outHandler = handler;
    },

    _disableOutHandler: function() {
        this._outHandler && eventsEngine.off(domAdapter.getDocument(), POINTER_ACTION, this._outHandler);
        this._outHandler = null;
    },

    stopCurrentHandling: function() {
        this._pointerOut(true);
    },

    _pointerOut: function(force) {
        this.clearHover();
        (force || this._tooltip.isEnabled()) && this._hideTooltip(this.pointAtShownTooltip);
    },

    _triggerLegendClick: function(eventArgs, elementClick) {
        var eventTrigger = this._eventTrigger;

        eventTrigger(LEGEND_CLICK, eventArgs, function() {
            !eventCanceled(eventArgs.event, eventArgs.target) && eventTrigger(elementClick, eventArgs);
        });
    },

    _hoverLegendItem: function(x, y) {
        var that = this,
            item = that._legend.getItemByCoord(x, y),
            series,
            legendHoverMode = correctLegendHoverMode(that._legend.getOptions().hoverMode);

        if(item) {
            series = that._storedSeries[item.id];
            if(!series.isHovered() || series.lastHoverMode !== legendHoverMode) {
                that._setHoveredSeries(series, legendHoverMode);
            }
            that._tooltip.isEnabled() && that._hideTooltip(that.pointAtShownTooltip);
        } else {
            that.clearHover();
        }
    },

    _hoverArgument: function(argument, argumentIndex) {
        var that = this,
            hoverMode = that._getArgumentHoverMode();

        if(isDefined(argument)) {
            that._releaseHoveredPoint();
            that._hoveredArgument = argument;
            that._argumentIndex = argumentIndex;
            that._notifySeries({
                action: "pointHover",
                notifyLegend: that._notifyLegendOnHoverArgument,
                target: {
                    argument: argument,
                    fullState: HOVER_STATE,
                    argumentIndex: argumentIndex,
                    getOptions: function() {
                        return { hoverMode: hoverMode };
                    }
                }
            });
        }
    },

    _resetHoveredArgument: function() {
        var that = this,
            hoverMode;

        if(isDefined(that._hoveredArgument)) {
            hoverMode = that._getArgumentHoverMode();
            that._notifySeries({
                action: "clearPointHover",
                notifyLegend: that._notifyLegendOnHoverArgument,
                target: {
                    fullState: NORMAL_STATE,
                    argumentIndex: that._argumentIndex,
                    argument: that._hoveredArgument,
                    getOptions: function() {
                        return { hoverMode: hoverMode };
                    }
                }
            });
            that._hoveredArgument = null;
        }
    },

    _notifySeries: function(data) {
        this._storedSeries.forEach(function(series) {
            series.notify(data);
        });
    },

    _pointerHandler: function(e) {
        var that = e.data.tracker,
            rootOffset = that._renderer.getRootOffset(),
            x = _floor(e.pageX - rootOffset.left),
            y = _floor(e.pageY - rootOffset.top),
            canvas = that._getCanvas(x, y),
            series = getData(e, SERIES_DATA),
            point = getData(e, POINT_DATA) || series && series.getPointByCoord(x, y);

        if(point && !point.getMarkerVisibility()) {
            point = undefined;
        }
        that._enableOutHandler();

        if(that._legend.coordsIn(x, y)) {
            that._hoverLegendItem(x, y);
            return;
        }

        if(that.hoveredSeries && that.hoveredSeries !== that._stuckSeries) {
            that._releaseHoveredSeries();
        }

        if(that._hoverArgumentAxis(x, y, e)) {
            return;
        }

        if(that._isPointerOut(canvas, point)) {
            that._pointerOut();
        }

        if(!canvas && !point) {
            return;
        }

        if(series && !point) {
            point = series.getNeighborPoint(x, y);
            if(!that._stickyHovering && point && !point.coordsIn(x, y)) {
                point = null;
            }
            if(series !== that.hoveredSeries) {
                that._setTimeout(function() {
                    that._setHoveredSeries(series);
                    that._setStuckSeries(e, series, x, y);
                    that._pointerComplete(point, x, y);
                }, series);
                return;
            }
        } else if(point) {
            if(e.type !== pointerEvents.move && e.pointerType !== "touch") {
                return;
            }
            if(that.hoveredSeries) {
                that._setTimeout(function() {
                    that._pointerOnPoint(point, x, y, e);
                }, point);
            } else {
                that._pointerOnPoint(point, x, y, e);
            }
            return;
        } else if(that._setStuckSeries(e, undefined, x, y) && that._stickyHovering) {
            series = that._stuckSeries;
            point = series.getNeighborPoint(x, y);
            that._releaseHoveredSeries();
            point && point.getMarkerVisibility() && that._setHoveredPoint(point);
        } else if(!that._stickyHovering) {
            that._pointerOut();
        }

        that._pointerComplete(point, x, y);
    },

    _pointerOnPoint: function(point, x, y) {
        this._resetHoveredArgument();
        this._setHoveredPoint(point);
        this._pointerComplete(point, x, y);
    },

    _pointerComplete: function(point) {
        this.pointAtShownTooltip !== point && this._tooltip.isEnabled() && this._showTooltip(point);
    },

    _clickHandler: function(e) {
        var that = e.data.tracker,
            rootOffset = that._renderer.getRootOffset(),
            x = _floor(e.pageX - rootOffset.left),
            y = _floor(e.pageY - rootOffset.top),
            point = getData(e, POINT_DATA),
            series = that._stuckSeries || getData(e, SERIES_DATA) || point && point.series,
            axis = that._argumentAxis;

        if(that._legend.coordsIn(x, y)) {
            var item = that._legend.getItemByCoord(x, y);
            if(item) {
                that._legendClick(item, e);
            }
        } else if(axis && axis.coordsIn(x, y)) {
            var argument = getData(e, ARG_DATA);
            if(isDefined(argument)) {
                that._eventTrigger("argumentAxisClick", { argument: argument, event: e });
            }
        } else if(series) {
            point = point || series.getPointByCoord(x, y);
            if(point && point.getMarkerVisibility()) {
                that._pointClick(point, e);
            } else {
                getData(e, SERIES_DATA) && that._eventTrigger(SERIES_CLICK, { target: series, event: e });
            }
        }
    },

    dispose: function() {
        var that = this;
        that._disableOutHandler();
        that._renderer.root.off(DOT_EVENT_NS);
        that._seriesGroup.off(DOT_EVENT_NS);
    }
};

var ChartTracker = function(options) {
    this.ctor(options);
};

extend(ChartTracker.prototype, baseTrackerPrototype, {
    _pointClick: function(point, event) {
        var that = this,
            eventTrigger = that._eventTrigger,
            series = point.series;

        eventTrigger(POINT_CLICK, { target: point, event: event }, function() {
            !eventCanceled(event, series) && eventTrigger(SERIES_CLICK, { target: series, event: event });
        });
    },
    ///#DEBUG
    __trackerDelay: DELAY,
    ///#ENDDEBUG

    update: function(options) {
        var that = this;
        baseTrackerPrototype.update.call(this, options);
        that._argumentAxis = options.argumentAxis || {};
        that._axisHoverEnabled = that._argumentAxis && _normalizeEnum(that._argumentAxis.getOptions().hoverMode) === ALL_ARGUMENT_POINTS_MODE;
        that._chart = options.chart;
        that._rotated = options.rotated;
        that._crosshair = options.crosshair;
        that._stickyHovering = options.stickyHovering;
    },

    _getCanvas: function(x, y) {
        var that = this,
            canvases = that._canvases || [];
        for(var i = 0; i < canvases.length; i++) {
            var c = canvases[i];
            if(inCanvas(c, x, y)) {
                return c;
            }
        }
        return null;
    },

    _isPointerOut: function(canvas) {
        return !canvas && this._stuckSeries;
    },

    _hideCrosshair: function() {
        this._crosshair && this._crosshair.hide();
    },

    _moveCrosshair: function(point, x, y) {
        if(point && this._crosshair && point.isVisible()) {
            this._crosshair.show({ point: point, x: x, y: y });
        }
    },

    _clean: function() {
        var that = this;
        baseTrackerPrototype._clean.call(that);
        that._resetTimer();
        that._stuckSeries = null;
    },

    _getSeriesForShared: function(x, y) {
        var that = this,
            points = [],
            point = null,
            distance = Infinity;

        if(that._tooltip.isShared() && !that.hoveredSeries) {
            _each(that._storedSeries, function(_, series) {
                var point = series.getNeighborPoint(x, y);
                point && points.push(point);
            });
            _each(points, function(_, p) {
                var coords = p.getCrosshairData(x, y),
                    d = vizUtils.getDistance(x, y, coords.x, coords.y);
                if(d < distance) {
                    point = p;
                    distance = d;
                }
            });
        }
        return point && point.series;
    },

    _setTimeout: function(callback, keeper) {
        var that = this;
        if(that._timeoutKeeper !== keeper) {
            that._resetTimer();
            that._hoverTimeout = setTimeout(function() {
                callback();
                that._timeoutKeeper = null;
            }, DELAY);
            that._timeoutKeeper = keeper;
        }
    },

    _resetTimer: function() {
        clearTimeout(this._hoverTimeout);
        this._timeoutKeeper = this._hoverTimeout = null;
    },

    _stopEvent: function(e) {
        if(!isDefined(e.cancelable) || e.cancelable) {
            e.preventDefault();
            e.stopPropagation(); // T249548
        }
    },

    _setStuckSeries: function(e, series, x, y) {
        if(e.pointerType !== "mouse") {
            this._stuckSeries = null;
        } else {
            this._stuckSeries = (series || this._stuckSeries) || this._getSeriesForShared(x, y);
        }
        return !!this._stuckSeries;
    },

    _pointerOut: function() {
        var that = this;
        that._stuckSeries = null;
        that._hideCrosshair();
        that._resetTimer();
        baseTrackerPrototype._pointerOut.apply(that, arguments);
    },

    _hoverArgumentAxis: function(x, y, e) {
        var that = this;
        that._resetHoveredArgument();
        if(that._axisHoverEnabled && that._argumentAxis.coordsIn(x, y)) {
            that._hoverArgument(getData(e, ARG_DATA));
            return true;
        }
    },

    _pointerComplete: function(point, x, y) {
        var that = this;
        that.hoveredSeries && that.hoveredSeries.updateHover(x, y);
        that._resetTimer();
        that._moveCrosshair(point, x, y);
        baseTrackerPrototype._pointerComplete.call(that, point);
    },

    _legendClick: function(item, e) {
        var series = this._storedSeries[item.id];
        this._triggerLegendClick({ target: series, event: e }, SERIES_CLICK);
    },

    _hoverLegendItem: function(x, y) {
        this._stuckSeries = null;
        this._hideCrosshair();
        baseTrackerPrototype._hoverLegendItem.call(this, x, y);
    },

    _pointerOnPoint: function(point, x, y, e) {
        this._setStuckSeries(e, point.series, x, y);
        this._releaseHoveredSeries();
        baseTrackerPrototype._pointerOnPoint.call(this, point, x, y, e);
    },

    _notifyLegendOnHoverArgument: false,

    _getArgumentHoverMode: function() {
        return correctHoverMode(this._argumentAxis);
    },

    dispose: function() {
        this._resetTimer();
        baseTrackerPrototype.dispose.call(this);
    }
});

var PieTracker = function(options) {
    this.ctor(options);
};

extend(PieTracker.prototype, baseTrackerPrototype, {
    _isPointerOut: function(_, point) {
        return !point;
    },

    _legendClick: function(item, e) {
        var that = this,
            points = [];

        that._storedSeries.forEach(s => points.push.apply(points, s.getPointsByKeys(item.argument, item.argumentIndex)));
        that._eventTrigger(LEGEND_CLICK, { target: item.argument, points, event: e });
    },

    _pointClick: function(point, e) {
        this._eventTrigger(POINT_CLICK, { target: point, event: e });
    },

    _hoverLegendItem: function(x, y) {
        var that = this,
            item = that._legend.getItemByCoord(x, y);

        that._resetHoveredArgument();
        if(item) {
            that._hoverArgument(item.argument, item.argumentIndex);
        } else {
            that.clearHover();
        }
    },

    _getArgumentHoverMode: function() {
        return correctHoverMode(this._legend);
    },
    _hoverArgumentAxis: _noop,
    _setStuckSeries: _noop,
    _getCanvas: _noop,
    _notifyLegendOnHoverArgument: true
});

exports.ChartTracker = ChartTracker;
exports.PieTracker = PieTracker;
