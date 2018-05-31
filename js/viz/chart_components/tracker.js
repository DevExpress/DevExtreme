"use strict";

var $ = require("../../core/renderer"),
    window = require("../../core/utils/window").getWindow(),
    domAdapter = require("../../core/dom_adapter"),
    eventsEngine = require("../../events/core/events_engine"),
    clickEvent = require("../../events/click"),
    extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    consts = require("../components/consts"),
    eventsConsts = consts.events,

    vizUtils = require("../core/utils"),
    pointerEvents = require("../../events/pointer"),
    wheelEvent = require("../../events/core/wheel"),
    holdEvent = require("../../events/hold"),
    addNamespace = require("../../events/utils").addNamespace,
    devices = require("../../core/devices"),
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
    ZOOM_START = "zoomStart",
    POINT_DATA = "chart-data-point",
    SERIES_DATA = "chart-data-series",
    ARG_DATA = "chart-data-argument",
    DELAY = 100,
    TOUCHSTART_TIMEOUT = 500,
    SCROLL_THRESHOLD = 10,

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

    update: function(options) {
        this._prepare();
    },

    updateSeries: function(series) {
        var that = this;

        if(that._storedSeries !== series) {
            that._storedSeries = series || [];
            that._clean();
        } else {
            that._hideTooltip(that.pointAtShownTooltip);
            that._clearHover();
            that.clearSelection();
        }
    },

    setCanvases: function(mainCanvas, paneCanvases) {
        this._mainCanvas = mainCanvas;
        this._canvases = paneCanvases;
    },

    repairTooltip: function() {
        var point = this.pointAtShownTooltip;
        if(point && !point.isVisible()) {
            this._hideTooltip(point, true);
        } else {
            this._showTooltip(point);
        }
    },

    _prepare: function() {
        this._toggleParentsScrollSubscription(true);
    },

    _toggleParentsScrollSubscription: function(subscribe) {
        var that = this,
            $parents = $(that._renderer.root.element).parents(),
            scrollEvents = addNamespace("scroll", EVENT_NS);

        if(devices.real().platform === "generic") {
            $parents = $parents.add(window);
        }

        eventsEngine.off($().add(that._$prevRootParents), scrollEvents);

        if(subscribe) {
            eventsEngine.on($parents, scrollEvents, function() {
                that._pointerOut();
            });
            that._$prevRootParents = $parents;
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

    clearSelection: function() {
        this._storedSeries.forEach(function(series) {
            series.clearSelection();
            series.getPoints().forEach(function(point) {
                point.clearSelection();
            });
        });
    },

    _clean: function() {
        var that = this;
        that.hoveredPoint = that.hoveredSeries = that._hoveredArgumentPoints = null;
        that._hideTooltip(that.pointAtShownTooltip);
    },

    _clearHover: function() {
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

    _pointerOut: function() {
        this._clearHover();
        this._tooltip.isEnabled() && this._hideTooltip(this.pointAtShownTooltip);
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
            that._clearHover();
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

        that._enableOutHandler();
        if(that._checkGestureEvents(e, canvas, rootOffset)) {
            return;
        }

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
            if(series !== that.hoveredSeries) {
                that._setTimeout(function() {
                    that._setHoveredSeries(series);
                    that._setStuckSeries(e, series, x, y);
                    that._pointerComplete(point, x, y);
                }, series);
                return;
            }
        } else if(point) {
            if(that.hoveredSeries) {
                that._setTimeout(function() {
                    that._pointerOnPoint(point, x, y, e);
                }, point);
            } else {
                that._pointerOnPoint(point, x, y, e);
            }
            return;
        } else if(that._setStuckSeries(e, undefined, x, y)) {
            series = that._stuckSeries;
            point = series.getNeighborPoint(x, y);
            that._releaseHoveredSeries();
            point && that._setHoveredPoint(point);
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

            if(point) {
                that._pointClick(point, e);
            } else {
                getData(e, SERIES_DATA) && that._eventTrigger(SERIES_CLICK, { target: series, event: e });
            }
        }
    },

    dispose: function() {
        var that = this;
        that._disableOutHandler();
        that._toggleParentsScrollSubscription();
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
        that._zoomingMode = _normalizeEnum(options.zoomingMode);
        that._scrollingMode = _normalizeEnum(options.scrollingMode);
        baseTrackerPrototype.update.call(this, options);
        that._argumentAxis = options.argumentAxis || {};
        that._axisHoverEnabled = that._argumentAxis && _normalizeEnum(that._argumentAxis.getOptions().hoverMode) === ALL_ARGUMENT_POINTS_MODE;
        that._chart = options.chart;
        that._rotated = options.rotated;
        that._crosshair = options.crosshair;
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

    _prepare: function() {
        var that = this,
            root = that._renderer.root,
            touchScrollingEnabled = that._scrollingMode === "all" || that._scrollingMode === "touch",
            touchZoomingEnabled = that._zoomingMode === "all" || that._zoomingMode === "touch",
            cssValue = ((!touchScrollingEnabled ? "pan-x pan-y " : "") + (!touchZoomingEnabled ? "pinch-zoom" : "")) || "none",
            rootStyles = { "touch-action": cssValue, "-ms-touch-action": cssValue },
            wheelZoomingEnabled = that._zoomingMode === "all" || that._zoomingMode === "mouse";

        root.off(addNamespace([wheelEvent.name, "dxc-scroll-start", "dxc-scroll-move"], EVENT_NS));

        baseTrackerPrototype._prepare.call(that);

        if(!that._gestureEndHandler) {
            that._gestureEndHandler = function() {
                // Check is added because callback can be triggered after unsubscribing which is done during tracker disposing
                // That occurs for example when container is removed on swipe end (T235643)
                that._gestureEnd && that._gestureEnd();     // T235643
            };

            eventsEngine.on(domAdapter.getDocument(), addNamespace(pointerEvents.up, EVENT_NS), that._gestureEndHandler);
        }
        wheelZoomingEnabled && root.on(addNamespace(wheelEvent.name, EVENT_NS), function(e) {
            var rootOffset = that._renderer.getRootOffset(),
                x = that._rotated ? e.pageY - rootOffset.top : e.pageX - rootOffset.left,
                translator = that._argumentAxis.getTranslator(),
                scale = translator.getMinScale(e.delta > 0),
                translate = x - x * scale,
                zoom = translator.zoom(-translate, scale);
            that._pointerOut();

            that._eventTrigger(ZOOM_START);
            that._chart.zoomArgument(zoom.min, zoom.max, true);

            e.preventDefault();
            e.stopPropagation();    // T249548
        });

        root.on(addNamespace("dxc-scroll-start", EVENT_NS), function(e) {
            that._startScroll = true;
            that._gestureStart(that._getGestureParams(e, { left: 0, top: 0 }));
        }).on(addNamespace("dxc-scroll-move", EVENT_NS), function(e) {
            that._gestureChange(that._getGestureParams(e, { left: 0, top: 0 })) && e.preventDefault();
        });

        root.css(rootStyles);
    },

    _getGestureParams: function(e, offset) {
        var that = this,
            x1, x2,
            touches = e.pointers.length,
            left, right,
            eventCoordField = that._rotated ? "pageY" : "pageX";

        offset = that._rotated ? offset.top : offset.left;
        if(touches === 2) {
            x1 = e.pointers[0][eventCoordField] - offset;
            x2 = e.pointers[1][eventCoordField] - offset;
        } else if(touches === 1) {
            x1 = x2 = e.pointers[0][eventCoordField] - offset;
        }
        left = Math.min(x1, x2);
        right = Math.max(x1, x2);

        return {
            center: left + (right - left) / 2,
            distance: right - left,
            touches: touches,
            scale: 1,
            pointerType: e.pointerType
        };

    },

    _gestureStart: function(gestureParams) {
        var that = this;
        that._startGesture = that._startGesture || gestureParams;

        if(that._startGesture.touches !== gestureParams.touches) {
            that._startGesture = gestureParams;
        }
    },

    _gestureChange: function(gestureParams) {
        var that = this,
            startGesture = that._startGesture,
            gestureChanged = false,
            scrollingEnabled = that._scrollingMode === "all" || (that._scrollingMode !== "none" && that._scrollingMode === gestureParams.pointerType),
            zoomingEnabled = that._zoomingMode === "all" || that._zoomingMode === "touch";

        if(!startGesture) {
            return gestureChanged;
        }
        if(startGesture.touches === 1 && Math.abs(startGesture.center - gestureParams.center) < SCROLL_THRESHOLD) {
            that._gestureStart(gestureParams);
            return gestureChanged;
        }

        if(startGesture.touches === 2 && zoomingEnabled) {
            gestureChanged = true;
            startGesture.scale = gestureParams.distance / startGesture.distance;
            startGesture.scroll = gestureParams.center - startGesture.center + (startGesture.center - startGesture.center * startGesture.scale);
        } else if(startGesture.touches === 1 && scrollingEnabled) {
            gestureChanged = true;
            startGesture.scroll = (gestureParams.center - startGesture.center);
        }

        if(gestureChanged) {
            if(that._startScroll) {
                that._eventTrigger(ZOOM_START);
                that._startScroll = false;
            }

            startGesture.changed = gestureChanged;
            that._chart._transformArgument(startGesture.scroll, startGesture.scale);
        }
        return gestureChanged;
    },

    _gestureEnd: function() {
        var that = this,
            startGesture = that._startGesture,
            zoom,
            renderer = that._renderer;
        that._startGesture = null;
        that._startScroll = false;

        function complete() {
            that._chart.zoomArgument(zoom.min, zoom.max, true);
        }

        if(startGesture && startGesture.changed) {
            zoom = that._argumentAxis._translator.zoom(-startGesture.scroll, startGesture.scale);

            if(renderer.animationEnabled() && (-startGesture.scroll !== zoom.translate || startGesture.scale !== zoom.scale)) {
                var translateDelta = -(startGesture.scroll + zoom.translate),
                    scaleDelta = startGesture.scale - zoom.scale;

                renderer.root.animate({ _: 0 }, {
                    step: function(pos) {
                        var translateValue = -(startGesture.scroll) - translateDelta * pos,
                            scaleValue = startGesture.scale - scaleDelta * pos;

                        that._chart._transformArgument(-translateValue, scaleValue);
                    }, complete: complete,
                    duration: 250
                });
            } else {
                complete();
            }
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

    _checkGestureEvents: function(e, canvas, rootOffset) {
        var that = this;

        if(e.type === pointerEvents.down) {
            if(canvas) {
                that._startScroll = true;
                that._gestureStart(that._getGestureParams(e, rootOffset));
            }
        } else if(that._startGesture && canvas) {
            if(that._gestureChange(that._getGestureParams(e, rootOffset))) {
                that._pointerOut();
                e.preventDefault();
                return true;
            }
        }
    },

    _handleStartScrollTimeout(e) {
        const that = this;
        if(that._gestureStartTimeStamp && that._startGesture.touches === 1 && e.timeStamp - that._gestureStartTimeStamp < TOUCHSTART_TIMEOUT && that._startGesture.distance >= SCROLL_THRESHOLD) {
            that._stopEvent(e);
            that._pointerOut();
            that._startGesture.changed = false;
            that._startScroll = false;
        }
        that._gestureStartTimeStamp = e.timeStamp;
    },

    _handleScrollGesture: function(e) {
        var that = this,
            scale = that._startGesture.scale,
            scroll = that._startGesture.scroll,
            touches = that._startGesture.touches;

        that._pointerOut();
        if(that._argumentAxis.getTranslator().checkGestureEventsForScaleEdges(SCROLL_THRESHOLD, scale, scroll, touches, that._argumentAxis._zoomArgs)) {
            that._chart._transformArgument(that._startGesture.scroll, that._startGesture.scale);
            that._stopEvent(e);
        } else {
            that._startGesture.changed = false;
        }
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
        baseTrackerPrototype._pointerOut.call(that);
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
        eventsEngine.off(domAdapter.getDocument(), DOT_EVENT_NS, this._gestureEndHandler);
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

        that._storedSeries.forEach(function(s) {
            points.push.apply(points, s.getPointsByKeys(item.argument, item.id));
        });

        that._eventTrigger(LEGEND_CLICK, { target: item.argument, points: points, event: e });
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
            that._clearHover();
        }
    },

    _getArgumentHoverMode: function() {
        return correctHoverMode(this._legend);
    },
    _hoverArgumentAxis: _noop,
    _setStuckSeries: _noop,
    _getCanvas: _noop,
    _checkGestureEvents: _noop,
    _notifyLegendOnHoverArgument: true
});

exports.ChartTracker = ChartTracker;
exports.PieTracker = PieTracker;
