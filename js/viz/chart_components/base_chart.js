var commonUtils = require("../../core/utils/common"),
    noop = commonUtils.noop,
    eventsEngine = require("../../events/core/events_engine"),
    typeUtils = require("../../core/utils/type"),
    iteratorModule = require("../../core/utils/iterator"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    eventUtils = require("../../events/utils"),
    BaseWidget = require("../core/base_widget"),
    coreDataUtils = require("../../core/utils/data"),
    legendModule = require("../components/legend"),
    dataValidatorModule = require("../components/data_validator"),
    seriesModule = require("../series/base_series"),
    chartThemeManagerModule = require("../components/chart_theme_manager"),
    LayoutManagerModule = require("./layout_manager"),
    trackerModule = require("./tracker"),

    REINIT_REFRESH_ACTION = "_reinit",
    REINIT_DATA_SOURCE_REFRESH_ACTION = "_updateDataSource",
    DATA_INIT_REFRESH_ACTION = "_dataInit",
    FORCE_RENDER_REFRESH_ACTION = "_forceRender",
    RESIZE_REFRESH_ACTION = "_resize",
    ACTIONS_BY_PRIORITY = [REINIT_REFRESH_ACTION, REINIT_DATA_SOURCE_REFRESH_ACTION, DATA_INIT_REFRESH_ACTION, FORCE_RENDER_REFRESH_ACTION, RESIZE_REFRESH_ACTION],

    vizUtils = require("../core/utils"),
    _map = vizUtils.map,
    _each = iteratorModule.each,
    _reverseEach = iteratorModule.reverseEach,
    _extend = extend,
    _isArray = Array.isArray,
    _isDefined = typeUtils.isDefined,
    _setCanvasValues = vizUtils.setCanvasValues,
    DEFAULT_OPACITY = 0.3,

    REFRESH_SERIES_DATA_INIT_ACTION_OPTIONS = [
        "series",
        "commonSeriesSettings",
        "dataPrepareSettings",
        "seriesSelectionMode",
        "pointSelectionMode",
        "synchronizeMultiAxes",
        "resolveLabelsOverlapping"
    ],

    REFRESH_SERIES_FAMILIES_ACTION_OPTIONS = [
        "equalBarWidth",
        "minBubbleSize",
        "maxBubbleSize",
        "barWidth",
        "barGroupPadding",
        "barGroupWidth",
        "negativesAsZeroes",
        "negativesAsZeros" // misspelling case
    ],

    FORCE_RENDER_REFRESH_ACTION_OPTIONS = [
        "adaptiveLayout",
        "crosshair",
        "resolveLabelOverlapping",
        "adjustOnZoom",
        "zoomingMode",
        "scrollingMode",
        "stickyHovering"
    ],

    FONT = "font";

function checkHeightRollingStock(rollingStocks, stubCanvas) {
    var canvasSize = stubCanvas.end - stubCanvas.start,
        size = 0;
    rollingStocks.forEach(function(rollingStock) {
        size += rollingStock.getBoundingRect().width;
    });

    while(canvasSize < size) {
        size -= findAndKillSmallValue(rollingStocks);
    }
}

function findAndKillSmallValue(rollingStocks) {
    var smallestObject,
        width;

    smallestObject = rollingStocks.reduce(function(prev, rollingStock, index) {
        if(!rollingStock) return prev;
        var value = rollingStock.value();
        return value < prev.value ? {
            value: value,
            rollingStock: rollingStock,
            index: index
        } : prev;
    }, {
        rollingStock: undefined,
        value: Infinity,
        index: undefined
    });

    smallestObject.rollingStock.getLabels()[0].draw(false);
    width = smallestObject.rollingStock.getBoundingRect().width;
    rollingStocks[smallestObject.index] = null;

    return width;
}

function checkStackOverlap(rollingStocks) {
    var i,
        j,
        iLength,
        jLength,
        overlap = false;

    for(i = 0, iLength = rollingStocks.length - 1; i < iLength; i++) {
        for(j = i + 1, jLength = rollingStocks.length; j < jLength; j++) {
            if(i !== j && checkStacksOverlapping(rollingStocks[i], rollingStocks[j], true)) {
                overlap = true;
                break;
            }
        }
        if(overlap) break;
    }
    return overlap;
}

function resolveLabelOverlappingInOneDirection(points, canvas, isRotated, shiftFunction, customSorting = () => 0) {
    var rollingStocks = [],
        stubCanvas = {
            start: isRotated ? canvas.left : canvas.top,
            end: isRotated ? canvas.width - canvas.right : canvas.height - canvas.bottom
        },
        hasStackedSeries = false;

    points.forEach(function(p) {
        if(!p) return;

        hasStackedSeries = hasStackedSeries || p.series.isStackedSeries() || p.series.isFullStackedSeries();
        p.getLabels().forEach(function(l) {
            l.isVisible() && rollingStocks.push(new RollingStock(l, isRotated, shiftFunction));
        });
    });

    if(hasStackedSeries) {
        !isRotated && rollingStocks.reverse();
    } else {
        var rollingStocksTmp = rollingStocks.slice();
        rollingStocks.sort(function(a, b) {
            return customSorting(a, b) || (a.getInitialPosition() - b.getInitialPosition()) || (rollingStocksTmp.indexOf(a) - rollingStocksTmp.indexOf(b));
        });
    }

    if(!checkStackOverlap(rollingStocks)) return false;
    checkHeightRollingStock(rollingStocks, stubCanvas);

    prepareOverlapStacks(rollingStocks);

    rollingStocks.reverse();
    moveRollingStock(rollingStocks, stubCanvas);
    return true;
}

function checkStacksOverlapping(firstRolling, secondRolling, inTwoSides) {
    if(!firstRolling || !secondRolling) return;
    var firstRect = firstRolling.getBoundingRect(),
        secondRect = secondRolling.getBoundingRect(),
        oppositeOverlapping = inTwoSides ? ((firstRect.oppositeStart <= secondRect.oppositeStart && firstRect.oppositeEnd > secondRect.oppositeStart) ||
            (secondRect.oppositeStart <= firstRect.oppositeStart && secondRect.oppositeEnd > firstRect.oppositeStart)) : true;
    return firstRect.end > secondRect.start && oppositeOverlapping;
}

function prepareOverlapStacks(rollingStocks) {
    var i,
        currentRollingStock,
        root;

    for(i = 0; i < rollingStocks.length - 1; i++) {
        currentRollingStock = root || rollingStocks[i];
        if(checkStacksOverlapping(currentRollingStock, rollingStocks[i + 1])) {
            currentRollingStock.toChain(rollingStocks[i + 1]);
            rollingStocks[i + 1] = null;
            root = currentRollingStock;
        } else {
            root = rollingStocks[i + 1] || currentRollingStock;
        }
    }
}

function moveRollingStock(rollingStocks, canvas) {
    var i, j,
        currentRollingStock,
        nextRollingStock,
        currentBBox,
        nextBBox;

    for(i = 0; i < rollingStocks.length; i++) {
        currentRollingStock = rollingStocks[i];

        if(rollingStocksIsOut(currentRollingStock, canvas)) {
            currentBBox = currentRollingStock.getBoundingRect();
            for(j = i + 1; j < rollingStocks.length; j++) {
                nextRollingStock = rollingStocks[j];

                if(!nextRollingStock) {
                    continue;
                }

                nextBBox = nextRollingStock.getBoundingRect();

                if(nextBBox.end > (currentBBox.start - (currentBBox.end - canvas.end))) {
                    nextRollingStock.toChain(currentRollingStock);
                    rollingStocks[i] = currentRollingStock = null;
                    break;
                }
            }

        }
        currentRollingStock && currentRollingStock.setRollingStockInCanvas(canvas);
    }
}

function rollingStocksIsOut(rollingStock, canvas) {
    return rollingStock && rollingStock.getBoundingRect().end > canvas.end;
}

function RollingStock(label, isRotated, shiftFunction) {
    var bBox = label.getBoundingRect(),
        x = bBox.x,
        y = bBox.y,
        endX = bBox.x + bBox.width,
        endY = bBox.y + bBox.height;

    this.labels = [label];
    this.shiftFunction = shiftFunction;

    this._bBox = {
        start: isRotated ? x : y,
        width: isRotated ? bBox.width : bBox.height,
        end: isRotated ? endX : endY,
        oppositeStart: isRotated ? y : x,
        oppositeEnd: isRotated ? endY : endX
    };
    this._initialPosition = isRotated ? bBox.x : bBox.y;

    return this;
}

RollingStock.prototype = {
    toChain: function(nextRollingStock) {
        var nextRollingStockBBox = nextRollingStock.getBoundingRect();

        nextRollingStock.shift(nextRollingStockBBox.start - this._bBox.end);

        this._changeBoxWidth(nextRollingStockBBox.width);
        this.labels = this.labels.concat(nextRollingStock.labels);
    },
    getBoundingRect: function() {
        return this._bBox;
    },
    shift: function(shiftLength) {
        var shiftFunction = this.shiftFunction;
        _each(this.labels, function(index, label) {
            var bBox = label.getBoundingRect(),
                coords = shiftFunction(bBox, shiftLength);
            if(!label.hideInsideLabel(coords)) {
                label.shift(coords.x, coords.y);
            }
        });
        this._bBox.end -= shiftLength;
        this._bBox.start -= shiftLength;
    },
    setRollingStockInCanvas: function(canvas) {
        if(this._bBox.end > canvas.end) {
            this.shift(this._bBox.end - canvas.end);
        }
    },
    getLabels: function() {
        return this.labels;
    },
    value() {
        return this.labels[0].getData().value;
    },
    getInitialPosition: function() {
        return this._initialPosition;
    },
    _changeBoxWidth: function(width) {
        this._bBox.end += width;
        this._bBox.width += width;
    }
};

function getLegendFields(name) {
    return {
        nameField: name + "Name",
        colorField: name + "Color",
        indexField: name + "Index"
    };
}

function getLegendSettings(legendDataField) {
    var formatObjectFields = getLegendFields(legendDataField);
    return {
        getFormatObject: function(data) {
            var res = {};
            res[formatObjectFields.indexField] = data.id;
            res[formatObjectFields.colorField] = data.states.normal.fill;
            res[formatObjectFields.nameField] = data.text;
            return res;
        },
        textField: formatObjectFields.nameField
    };
}

function checkOverlapping(firstRect, secondRect) {
    return ((firstRect.x <= secondRect.x && secondRect.x <= firstRect.x + firstRect.width) ||
        (firstRect.x >= secondRect.x && firstRect.x <= secondRect.x + secondRect.width)) &&
        ((firstRect.y <= secondRect.y && secondRect.y <= firstRect.y + firstRect.height) ||
            (firstRect.y >= secondRect.y && firstRect.y <= secondRect.y + secondRect.height));
}

var overlapping = {
    resolveLabelOverlappingInOneDirection: resolveLabelOverlappingInOneDirection
};

var BaseChart = BaseWidget.inherit({
    _eventsMap: {
        onSeriesClick: { name: "seriesClick" },
        onPointClick: { name: "pointClick" },
        onArgumentAxisClick: { name: "argumentAxisClick" },
        onLegendClick: { name: "legendClick" },
        onSeriesSelectionChanged: { name: "seriesSelectionChanged" },
        onPointSelectionChanged: { name: "pointSelectionChanged" },
        onSeriesHoverChanged: { name: "seriesHoverChanged" },
        onPointHoverChanged: { name: "pointHoverChanged" },
        onDone: { name: "done" },
        onZoomStart: { name: "zoomStart" },
        onZoomEnd: { name: "zoomEnd" }
    },

    _fontFields: ["legend." + FONT, "legend.title." + FONT, "legend.title.subtitle." + FONT, "commonSeriesSettings.label." + FONT],

    _rootClassPrefix: "dxc",

    _rootClass: "dxc-chart",

    _initialChanges: ["INIT"],

    _themeDependentChanges: ["REFRESH_SERIES_REINIT"],

    _getThemeManagerOptions() {
        var themeOptions = this.callBase.apply(this, arguments);

        themeOptions.options = this.option();
        return themeOptions;
    },

    _createThemeManager: function() {
        var chartOption = this.option(),
            themeManager = new chartThemeManagerModule.ThemeManager(this._getThemeManagerOptions());

        themeManager.setTheme(chartOption.theme, chartOption.rtlEnabled);
        return themeManager;
    },

    _initCore: function() {
        var that = this;
        that._canvasClipRect = that._renderer.clipRect();

        that._createHtmlStructure();
        that._createLegend();
        that._createTracker();
        that._needHandleRenderComplete = true;
        that.layoutManager = new LayoutManagerModule.LayoutManager();
        that._createScrollBar();

        eventsEngine.on(that._$element, "contextmenu", function(event) {
            ///#DEBUG
            that.eventType = "contextmenu";
            ///#ENDDEBUG
            if(eventUtils.isTouchEvent(event) || eventUtils.isPointerEvent(event)) {
                event.preventDefault();
            }
        });
        eventsEngine.on(that._$element, "MSHoldVisual", function(event) {
            ///#DEBUG
            that.eventType = "MSHoldVisual";
            ///#ENDDEBUG
            event.preventDefault();
        });
    },

    // Common functionality is overridden because Chart has its own layout logic. Nevertheless common logic should be used.
    _getLayoutItems: noop,

    _layoutManagerOptions: function() {
        return this._themeManager.getOptions("adaptiveLayout");
    },

    _reinit() {
        const that = this;

        _setCanvasValues(that._canvas);
        that._reinitAxes();

        that._requestChange([
            "DATA_SOURCE",
            "DATA_INIT",
            "CORRECT_AXIS",
            "FULL_RENDER"
        ]);
    },

    _correctAxes: noop,

    _createHtmlStructure: function() {
        var that = this,
            renderer = that._renderer,
            root = renderer.root,
            createConstantLinesGroup = function() {
                // TODO: Must be created in the same place where used (advanced chart)
                return renderer.g().attr({ "class": "dxc-constant-lines-group" }).linkOn(root, "constant-lines");
            };

        that._constantLinesGroup = {
            dispose: function() {
                this.under.dispose();
                this.above.dispose();
            },
            linkOff: function() {
                this.under.linkOff();
                this.above.linkOff();
            },
            clear: function() {
                this.under.linkRemove().clear();
                this.above.linkRemove().clear();
            },
            linkAppend: function() {
                this.under.linkAppend();
                this.above.linkAppend();
            }
        };

        that._backgroundRect = renderer.rect().attr({ fill: "gray", opacity: 0.0001 }).append(root);
        that._panesBackgroundGroup = renderer.g().attr({ "class": "dxc-background" }).append(root);

        that._stripsGroup = renderer.g().attr({ "class": "dxc-strips-group" }).linkOn(root, "strips"); // TODO: Must be created in the same place where used (advanced chart)
        that._gridGroup = renderer.g().attr({ "class": "dxc-grids-group" }).linkOn(root, "grids"); // TODO: Must be created in the same place where used (advanced chart)
        that._panesBorderGroup = renderer.g().attr({ "class": "dxc-border" }).linkOn(root, "border"); // TODO: Must be created in the same place where used (chart)
        that._axesGroup = renderer.g().attr({ "class": "dxc-axes-group" }).linkOn(root, "axes"); // TODO: Must be created in the same place where used (advanced chart)
        that._labelAxesGroup = renderer.g().attr({ "class": "dxc-strips-labels-group" }).linkOn(root, "strips-labels"); // TODO: Must be created in the same place where used (advanced chart)
        that._constantLinesGroup.under = createConstantLinesGroup();
        that._seriesGroup = renderer.g().attr({ "class": "dxc-series-group" }).linkOn(root, "series");
        that._constantLinesGroup.above = createConstantLinesGroup();
        that._scaleBreaksGroup = renderer.g().attr({ "class": "dxc-scale-breaks" }).linkOn(root, "scale-breaks");
        that._labelsGroup = renderer.g().attr({ "class": "dxc-labels-group" }).linkOn(root, "labels");
        that._crosshairCursorGroup = renderer.g().attr({ "class": "dxc-crosshair-cursor" }).linkOn(root, "crosshair");
        that._legendGroup = renderer.g().attr({ "class": "dxc-legend", "clip-path": that._getCanvasClipRectID() }).linkOn(root, "legend").linkAppend(root).enableLinks();
        that._scrollBarGroup = renderer.g().attr({ "class": "dxc-scroll-bar" }).linkOn(root, "scroll-bar");
    },

    _disposeObjectsInArray: function(propName, fieldNames) {
        _each(this[propName] || [], function(_, item) {
            if(fieldNames && item) {
                _each(fieldNames, function(_, field) {
                    item[field] && item[field].dispose();
                });
            } else {
                item && item.dispose();
            }
        });
        this[propName] = null;
    },

    _disposeCore: function() {
        var that = this,
            disposeObject = function(propName) {
                // TODO: What is the purpose of the `if` check in a private function?
                if(that[propName]) {
                    that[propName].dispose();
                    that[propName] = null;
                }
            },
            unlinkGroup = function(name) {
                that[name].linkOff();
            },
            disposeObjectsInArray = this._disposeObjectsInArray;

        that._renderer.stopAllAnimations();

        disposeObjectsInArray.call(that, "series");

        disposeObject("_tracker");
        disposeObject("_crosshair");

        that.layoutManager =
            that._userOptions =
            that._canvas =
            that._groupsData = null;

        unlinkGroup("_stripsGroup");
        unlinkGroup("_gridGroup");
        unlinkGroup("_axesGroup");

        unlinkGroup("_constantLinesGroup");

        unlinkGroup("_labelAxesGroup");
        unlinkGroup("_panesBorderGroup");
        unlinkGroup("_seriesGroup");
        unlinkGroup("_labelsGroup");
        unlinkGroup("_crosshairCursorGroup");
        unlinkGroup("_legendGroup");
        unlinkGroup("_scrollBarGroup");
        unlinkGroup("_scaleBreaksGroup");

        disposeObject("_canvasClipRect");
        disposeObject("_panesBackgroundGroup");
        disposeObject("_backgroundRect");

        disposeObject("_stripsGroup");
        disposeObject("_gridGroup");
        disposeObject("_axesGroup");

        disposeObject("_constantLinesGroup");

        disposeObject("_labelAxesGroup");
        disposeObject("_panesBorderGroup");
        disposeObject("_seriesGroup");
        disposeObject("_labelsGroup");
        disposeObject("_crosshairCursorGroup");
        disposeObject("_legendGroup");
        disposeObject("_scrollBarGroup");
        disposeObject("_scaleBreaksGroup");
    },

    _getAnimationOptions: function() {
        return this._themeManager.getOptions("animation");
    },

    _getDefaultSize: function() {
        return { width: 400, height: 400 };
    },

    // TODO: Theme manager should stop knowing about user options then this method can be removed
    _getOption: function(name) {
        return this._themeManager.getOptions(name);
    },

    _applySize: function(rect) {
        this._rect = rect.slice();

        if(!this._changes.has("FULL_RENDER")) {
            this._processRefreshData(RESIZE_REFRESH_ACTION);
        }
    },

    // _resize: function () {
    //    if (this._updateLockCount) {// T244164
    //        this._processRefreshData(RESIZE_REFRESH_ACTION);
    //    } else {
    //        this._render(this.__renderOptions || { animate: false, isResize: true });
    //    }
    // },

    _resize: function() {
        this._doRender(this.__renderOptions || { animate: false, isResize: true });
    },

    _trackerType: "ChartTracker",

    _createTracker: function() {
        var that = this;

        that._tracker = new trackerModule[that._trackerType]({
            seriesGroup: that._seriesGroup,
            renderer: that._renderer,
            tooltip: that._tooltip,
            legend: that._legend,
            eventTrigger: that._eventTrigger
        });
    },

    _getTrackerSettings: function() {
        return this._getSelectionModes();
    },

    _getSelectionModes: function() {
        var themeManager = this._themeManager;

        return {
            seriesSelectionMode: themeManager.getOptions("seriesSelectionMode"),
            pointSelectionMode: themeManager.getOptions("pointSelectionMode")
        };
    },

    _updateTracker: function(trackerCanvases) {
        var that = this;

        that._tracker.update(that._getTrackerSettings());
        that._tracker.setCanvases({
            left: 0,
            right: that._canvas.width,
            top: 0,
            bottom: that._canvas.height
        }, trackerCanvases);
    },

    _createCanvasFromRect(rect) {
        const currentCanvas = this._canvas;
        return _setCanvasValues({
            left: rect[0],
            top: rect[1],
            right: currentCanvas.width - rect[2],
            bottom: currentCanvas.height - rect[3],
            width: currentCanvas.width,
            height: currentCanvas.height
        });
    },

    _doRender: function(_options) {
        var that = this,
            drawOptions,
            recreateCanvas;

        if(that._canvas.width === 0 && that._canvas.height === 0) return;

        that._resetIsReady(); // T207606
        drawOptions = that._prepareDrawOptions(_options);
        recreateCanvas = drawOptions.recreateCanvas;

        // T207665
        that.__originalCanvas = that._canvas;
        that._canvas = extend({}, that._canvas); // NOTE: Instance of the original canvas must be preserved

        // T207665
        if(recreateCanvas) {
            that.__currentCanvas = that._canvas;
        } else {
            that._canvas = that.__currentCanvas;
        }

        ///#DEBUG
        that.DEBUG_canvas = _setCanvasValues(that._canvas);
        ///#ENDDEBUG

        recreateCanvas && that._updateCanvasClipRect(that._canvas);

        this._canvas = this._createCanvasFromRect(this._rect);

        that._renderer.stopAllAnimations(true);
        that._cleanGroups();
        const startTime = new Date();
        that._renderElements(drawOptions);

        that._lastRenderingTime = new Date() - startTime;
    },

    _layoutAxes: noop,

    _renderElements: function(drawOptions) {
        var that = this,
            preparedOptions = that._prepareToRender(drawOptions),
            isRotated = that._isRotated(),
            isLegendInside = that._isLegendInside(),
            trackerCanvases = [],
            dirtyCanvas = extend({}, that._canvas),
            argBusinessRange,
            zoomMinArg,
            zoomMaxArg;

        ///#DEBUG
        that.DEBUG_dirtyCanvas = dirtyCanvas;
        ///#ENDDEBUG

        that._renderer.lock();

        if(drawOptions.drawLegend && that._legend) {
            that._legendGroup.linkAppend();
        }

        that.layoutManager.setOptions(that._layoutManagerOptions());

        const layoutTargets = that._getLayoutTargets();

        this._layoutAxes((needSpace) => {
            const axisDrawOptions = needSpace ? extend({}, drawOptions, { animate: false }) : drawOptions;
            const canvas = that._renderAxes(axisDrawOptions, preparedOptions);
            that._shrinkAxes(needSpace, canvas);
        });


        that._applyClipRects(preparedOptions);
        that._appendSeriesGroups();
        that._createCrosshairCursor();

        layoutTargets.forEach(({ canvas }) => {
            trackerCanvases.push({
                left: canvas.left,
                right: canvas.width - canvas.right,
                top: canvas.top,
                bottom: canvas.height - canvas.bottom
            });
        });

        if(that._scrollBar) {
            argBusinessRange = that._argumentAxes[0].getTranslator().getBusinessRange();
            if(argBusinessRange.axisType === "discrete" && argBusinessRange.categories && argBusinessRange.categories.length <= 1 ||
                argBusinessRange.axisType !== "discrete" && argBusinessRange.min === argBusinessRange.max) {
                zoomMinArg = zoomMaxArg = undefined;
            } else {
                zoomMinArg = argBusinessRange.minVisible;
                zoomMaxArg = argBusinessRange.maxVisible;
            }

            that._scrollBar.init(argBusinessRange, !that._argumentAxes[0].getOptions().valueMarginsEnabled).setPosition(zoomMinArg, zoomMaxArg);
        }

        that._updateTracker(trackerCanvases);
        that._updateLegendPosition(drawOptions, isLegendInside);
        that._applyPointMarkersAutoHiding();
        that._renderSeries(drawOptions, isRotated, isLegendInside);

        that._renderer.unlock();
    },

    _createCrosshairCursor: noop,

    _appendSeriesGroups: function() {
        this._seriesGroup.linkAppend();
        this._labelsGroup.linkAppend();
        this._appendAdditionalSeriesGroups();
    },

    _renderSeries: function(drawOptions, isRotated, isLegendInside) {
        this._calculateSeriesLayout(drawOptions, isRotated);
        this._renderSeriesElements(drawOptions, isRotated, isLegendInside);
    },

    _calculateSeriesLayout: function(drawOptions, isRotated) {
        drawOptions.hideLayoutLabels = this.layoutManager.needMoreSpaceForPanesCanvas(this._getLayoutTargets(), isRotated)
            && !this._themeManager.getOptions("adaptiveLayout").keepLabels;

        this._updateSeriesDimensions(drawOptions);
    },

    _renderSeriesElements: function(drawOptions, isRotated, isLegendInside) {
        var that = this,
            i,
            series = that.series,
            singleSeries,
            seriesLength = series.length,
            resolveLabelOverlapping = that._themeManager.getOptions("resolveLabelOverlapping");

        for(i = 0; i < seriesLength; i++) {
            singleSeries = series[i];
            that._applyExtraSettings(singleSeries, drawOptions);

            singleSeries.draw(drawOptions.animate && singleSeries.getPoints().length <= drawOptions.animationPointsLimit && that._renderer.animationEnabled(),
                drawOptions.hideLayoutLabels,
                that._getLegendCallBack(singleSeries)
            );
        }

        if(resolveLabelOverlapping === "none") {
            that._adjustSeriesLabels(false);
        } else {
            that._locateLabels(resolveLabelOverlapping);
        }

        that._renderTrackers(isLegendInside);
        that._tracker.repairTooltip();

        that._clearCanvas();

        that._renderExtraElements();

        that._drawn();
        that._renderCompleteHandler();
    },

    _locateLabels(resolveLabelOverlapping) {
        this._resolveLabelOverlapping(resolveLabelOverlapping);
    },

    _renderExtraElements() {},

    _clearCanvas: function() {
        // T207665, T336349, T503616
        this._canvas = this.__originalCanvas;
    },

    _resolveLabelOverlapping: function(resolveLabelOverlapping) {
        var func;
        switch(resolveLabelOverlapping) {
            case "stack":
                func = this._resolveLabelOverlappingStack;
                break;
            case "hide":
                func = this._resolveLabelOverlappingHide;
                break;
            case "shift":
                func = this._resolveLabelOverlappingShift;
                break;
        }
        return typeUtils.isFunction(func) && func.call(this);
    },

    _getVisibleSeries: function() {
        return commonUtils.grep(this.getAllSeries(), function(series) { return series.isVisible(); });
    },

    _resolveLabelOverlappingHide: function() {
        var labels = [],
            currentLabel,
            nextLabel,
            currentLabelRect,
            nextLabelRect,
            i,
            j,
            points,
            series = this._getVisibleSeries();

        for(i = 0; i < series.length; i++) {
            points = series[i].getVisiblePoints();

            for(j = 0; j < points.length; j++) {
                labels.push.apply(labels, points[j].getLabels());
            }
        }

        for(i = 0; i < labels.length; i++) {
            currentLabel = labels[i];
            if(!currentLabel.isVisible()) {
                continue;
            }

            currentLabelRect = currentLabel.getBoundingRect();

            for(j = i + 1; j < labels.length; j++) {
                nextLabel = labels[j];
                nextLabelRect = nextLabel.getBoundingRect();
                if(checkOverlapping(currentLabelRect, nextLabelRect)) {
                    nextLabel.draw(false);
                }
            }
        }
    },

    _cleanGroups: function() {
        var that = this;
        that._stripsGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
        that._gridGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
        that._axesGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
        that._constantLinesGroup.above.clear(); // TODO: Must be removed in the same place where appended (advanced chart)
        that._labelAxesGroup.linkRemove().clear(); // TODO: Must be removed in the same place where appended (advanced chart)
        // that._seriesGroup.linkRemove().clear();
        that._labelsGroup.linkRemove().clear();
        that._crosshairCursorGroup.linkRemove().clear();
        that._scaleBreaksGroup.linkRemove().clear();
    },

    _allowLegendInsidePosition() {
        return false;
    },

    _updateLegendPosition: noop,

    _createLegend: function() {
        var that = this,
            legendSettings = getLegendSettings(that._legendDataField);

        that._legend = new legendModule.Legend({
            renderer: that._renderer,
            group: that._legendGroup,
            backgroundClass: "dxc-border",
            itemGroupClass: "dxc-item",
            titleGroupClass: "dxc-title",
            textField: legendSettings.textField,
            getFormatObject: legendSettings.getFormatObject,
            allowInsidePosition: that._allowLegendInsidePosition()
        });

        that._updateLegend();

        that._layout.add(that._legend);
    },

    _updateLegend: function() {
        var that = this,
            themeManager = that._themeManager,
            legendOptions = themeManager.getOptions("legend"),
            legendData = that._getLegendData();

        legendOptions.containerBackgroundColor = themeManager.getOptions("containerBackgroundColor");
        legendOptions._incidentOccurred = that._incidentOccurred; // TODO: Why is `_` used?
        that._legend.update(legendData, legendOptions, themeManager.theme("legend").title);
        this._change(["LAYOUT"]);
    },

    _prepareDrawOptions: function(drawOptions) {
        var animationOptions = this._getAnimationOptions(),
            options;
        options = extend({},
            {
                force: false,
                adjustAxes: true,
                drawLegend: true,
                drawTitle: true,
                animate: animationOptions.enabled,
                animationPointsLimit: animationOptions.maxPointCountSupported
            },
            drawOptions, this.__renderOptions); // NOTE: This is to support `render` method options
        if(!_isDefined(options.recreateCanvas)) {
            options.recreateCanvas = options.adjustAxes && options.drawLegend && options.drawTitle;
        }
        return options;
    },

    _processRefreshData: function(newRefreshAction) {
        var currentRefreshActionPosition = inArray(this._currentRefreshData, ACTIONS_BY_PRIORITY),
            newRefreshActionPosition = inArray(newRefreshAction, ACTIONS_BY_PRIORITY);
        if(!this._currentRefreshData || (currentRefreshActionPosition >= 0 && newRefreshActionPosition < currentRefreshActionPosition)) {
            this._currentRefreshData = newRefreshAction;
            // this._invalidate();
        }

        this._requestChange(["REFRESH"]);
    },

    _getLegendData: function() {
        return _map(this._getLegendTargets(), function(item) {
            var legendData = item.legendData,
                style = item.getLegendStyles,
                opacity = style.normal.opacity;

            if(!item.visible) {
                if(!_isDefined(opacity) || opacity > DEFAULT_OPACITY) {
                    opacity = DEFAULT_OPACITY;
                }
                legendData.textOpacity = DEFAULT_OPACITY;
            }
            legendData.states = {
                hover: style.hover,
                selection: style.selection,
                normal: _extend({}, style.normal, { opacity: opacity })
            };

            return legendData;
        });
    },

    _getLegendOptions: function(item) {
        return {
            legendData: {
                text: item[this._legendItemTextField],
                id: item.index,
                visible: true
            },
            getLegendStyles: item.getLegendStyles(),
            visible: item.isVisible()
        };
    },

    _disposeSeries(seriesIndex) {
        const that = this;
        if(that.series) {
            if(_isDefined(seriesIndex)) {
                that.series[seriesIndex].dispose();
                that.series.splice(seriesIndex, 1);
            } else {
                _each(that.series, (_, s) => s.dispose());
                that.series.length = 0;
            }
        }
        if(!that.series || !that.series.length) {
            that.series = [];
        }
    },

    _disposeSeriesFamilies() {
        const that = this;
        _each(that.seriesFamilies || [], function(_, family) { family.dispose(); });
        that.seriesFamilies = null;
        that._needHandleRenderComplete = true;
    },

    _simulateOptionChange(fullName, value, previousValue) {
        const that = this;
        const optionSetter = coreDataUtils.compileSetter(fullName);

        optionSetter(that._options, value, {
            functionsAsIs: true,
            merge: !that._getOptionsByReference()[fullName]
        });

        that._notifyOptionChanged(fullName, value, previousValue);
        that._changes.reset();
    },

    _optionChanged: function(arg) {
        this._themeManager.resetOptions(arg.name);
        this.callBase.apply(this, arguments);
    },

    _applyChanges() {
        const that = this;
        that._themeManager.update(that._options);
        that.callBase.apply(that, arguments);
    },

    _optionChangesMap: {
        animation: "ANIMATION",
        dataSource: "DATA_SOURCE",
        palette: "PALETTE",
        paletteExtensionMode: "PALETTE",

        legend: "FORCE_DATA_INIT",
        seriesTemplate: "FORCE_DATA_INIT",

        "export": "FORCE_RENDER",

        valueAxis: "AXES_AND_PANES",
        argumentAxis: "AXES_AND_PANES",
        commonAxisSettings: "AXES_AND_PANES",
        panes: "AXES_AND_PANES",
        defaultPane: "AXES_AND_PANES",
        useAggregation: "AXES_AND_PANES",
        containerBackgroundColor: "AXES_AND_PANES",

        rotated: "ROTATED",

        autoHidePointMarkers: "REFRESH_SERIES_REINIT",
        customizePoint: "REFRESH_SERIES_REINIT",
        customizeLabel: "REFRESH_SERIES_REINIT",

        scrollBar: "SCROLL_BAR"
    },

    _optionChangesOrder: ["ROTATED", "PALETTE", "REFRESH_SERIES_REINIT", "AXES_AND_PANES", "INIT", "REINIT", "DATA_SOURCE", "REFRESH_SERIES_DATA_INIT", "DATA_INIT", "FORCE_DATA_INIT", "REFRESH_AXES", "CORRECT_AXIS"],

    _customChangesOrder: ["ANIMATION", "REFRESH_SERIES_FAMILIES",
        "FORCE_RENDER", "VISUAL_RANGE", "SCROLL_BAR", "CHART_TOOLTIP", "REINIT", "REFRESH", "FULL_RENDER"],

    _change_ANIMATION: function() {
        this._renderer.updateAnimationOptions(this._getAnimationOptions());
    },

    _change_DATA_SOURCE: function() {
        this._needHandleRenderComplete = true;
        this._updateDataSource();
    },

    _change_PALETTE: function() {
        this._themeManager.updatePalette();
        this._refreshSeries("DATA_INIT");
    },

    _change_REFRESH_SERIES_DATA_INIT: function() {
        this._refreshSeries("DATA_INIT");
    },

    _change_DATA_INIT: function() {
        if((!this.series || this.needToPopulateSeries) && !this._changes.has("FORCE_DATA_INIT")) {
            this._dataInit();
        }
    },

    _change_FORCE_DATA_INIT: function() {
        this._dataInit();
    },

    _change_REFRESH_SERIES_FAMILIES: function() {
        this._processSeriesFamilies();
        this._populateBusinessRange();
        this._processRefreshData(FORCE_RENDER_REFRESH_ACTION);
    },

    _change_FORCE_RENDER: function() {
        this._processRefreshData(FORCE_RENDER_REFRESH_ACTION);
    },

    _change_AXES_AND_PANES: function() {
        this._refreshSeries("INIT");
    },

    _change_ROTATED: function() {
        this._createScrollBar();
        this._refreshSeries("INIT");
    },

    _change_REFRESH_SERIES_REINIT: function() {
        this._refreshSeries("INIT");
    },

    _change_REFRESH_AXES() {
        const that = this;

        _setCanvasValues(that._canvas);
        that._reinitAxes();

        that._requestChange([
            "CORRECT_AXIS",
            "FULL_RENDER"
        ]);
    },

    _change_SCROLL_BAR: function() {
        this._createScrollBar();
        this._processRefreshData(FORCE_RENDER_REFRESH_ACTION);
    },

    _change_CHART_TOOLTIP: function() {
        this._organizeStackPoints();
    },

    _change_REINIT: function() {
        this._processRefreshData(REINIT_REFRESH_ACTION);
    },

    _refreshSeries: function(actionName) {
        this.needToPopulateSeries = true;
        this._requestChange([actionName]);
    },

    _change_CORRECT_AXIS() {
        this._correctAxes();
    },

    _doRefresh: function() {
        var methodName = this._currentRefreshData;
        if(methodName) {
            this._currentRefreshData = null;
            this._renderer.stopAllAnimations(true);
            this[methodName]();
        }
    },

    _updateCanvasClipRect: function(canvas) {
        var that = this,
            width,
            height;

        width = Math.max(canvas.width - canvas.left - canvas.right, 0);
        height = Math.max(canvas.height - canvas.top - canvas.bottom, 0);

        that._canvasClipRect.attr({ x: canvas.left, y: canvas.top, width: width, height: height });
        that._backgroundRect.attr({ x: canvas.left, y: canvas.top, width: width, height: height });
    },

    _getCanvasClipRectID: function() {
        return this._canvasClipRect.id;
    },

    _dataSourceChangedHandler: function() {
        if(this._changes.has("INIT")) {
            this._requestChange(["DATA_INIT"]);
        } else {
            this._requestChange(["FORCE_DATA_INIT"]);
        }
    },

    _dataInit: function() {
        this._dataSpecificInit(true);
    },

    _processSingleSeries: function(singleSeries) {
        singleSeries.createPoints(false);
    },

    _handleSeriesDataUpdated() {
        if(this._getVisibleSeries().some(s => s.useAggregation())) {
            this._populateMarginOptions();
        }

        this.series.forEach(s => this._processSingleSeries(s), this);
    },

    _dataSpecificInit(needRedraw) {
        const that = this;
        if(!that.series || that.needToPopulateSeries) {
            that.series = that._populateSeries();
        }
        that._repopulateSeries();
        that._seriesPopulatedHandlerCore();
        that._populateBusinessRange();
        that._tracker.updateSeries(that.series, this._changes.has("INIT"));
        that._updateLegend();
        if(needRedraw) {
            this._requestChange(["FULL_RENDER"]);
        }
        // needRedraw && that._forceRender();
    },

    _forceRender: function() {
        this._doRender({ force: true });
    },

    _repopulateSeries: function() {
        var that = this,
            parsedData,
            themeManager = that._themeManager,
            data = that._dataSourceItems(),
            dataValidatorOptions = themeManager.getOptions("dataPrepareSettings"),
            seriesTemplate = themeManager.getOptions("seriesTemplate");

        if(seriesTemplate) {
            that._populateSeries(data);
        }

        that._groupSeries();
        parsedData = dataValidatorModule.validateData(data, that._groupsData, that._incidentOccurred, dataValidatorOptions);
        themeManager.resetPalette();

        that.series.forEach(function(singleSeries) {
            singleSeries.updateData(parsedData[singleSeries.getArgumentField()]);
        });

        that._handleSeriesDataUpdated();

        that._organizeStackPoints();
    },

    _organizeStackPoints: function() {
        var that = this,
            themeManager = that._themeManager,
            sharedTooltip = themeManager.getOptions("tooltip").shared,
            stackPoints = {};

        _each(that.series || [], function(_, singleSeries) {
            that._resetStackPoints(singleSeries);
            sharedTooltip && that._prepareStackPoints(singleSeries, stackPoints);
        });
    },

    _renderCompleteHandler: function() {
        var that = this,
            allSeriesInited = true;
        if(that._needHandleRenderComplete) {
            _each(that.series, function(_, s) {
                allSeriesInited = (allSeriesInited && s.canRenderCompleteHandle());
            });
            if(allSeriesInited) {
                that._needHandleRenderComplete = false;
                that._eventTrigger("done", { target: that });
            }
        }
    },

    _dataIsReady: function() {
        // In order to support scenario when chart is created without "dataSource" and it is considered
        // as data is being loaded the check for state of "dataSource" option is added
        return _isDefined(this.option("dataSource")) && this._dataIsLoaded();
    },

    _populateSeriesOptions(data) {
        const that = this;
        const themeManager = that._themeManager;
        const seriesTemplate = themeManager.getOptions("seriesTemplate");
        const seriesOptions = seriesTemplate ? vizUtils.processSeriesTemplate(seriesTemplate, data || []) : that.option("series");
        const allSeriesOptions = (_isArray(seriesOptions) ? seriesOptions : (seriesOptions ? [seriesOptions] : []));
        const extraOptions = that._getExtraOptions();
        let particularSeriesOptions;
        let seriesTheme;
        let seriesThemes = [];
        const seriesVisibilityChanged = (target) => {
            that._specialProcessSeries();
            that._populateBusinessRange(target && target.getValueAxis());
            that._renderer.stopAllAnimations(true);
            that._updateLegend();
            that._requestChange(["FULL_RENDER"]);
        };

        for(let i = 0; i < allSeriesOptions.length; i++) {
            particularSeriesOptions = _extend(true, {}, allSeriesOptions[i], extraOptions);

            if(!particularSeriesOptions.name) {
                particularSeriesOptions.name = "Series " + (i + 1).toString();
            }

            particularSeriesOptions.rotated = that._isRotated();
            particularSeriesOptions.customizePoint = themeManager.getOptions("customizePoint");
            particularSeriesOptions.customizeLabel = themeManager.getOptions("customizeLabel");
            particularSeriesOptions.visibilityChanged = seriesVisibilityChanged;
            particularSeriesOptions.incidentOccurred = that._incidentOccurred;

            seriesTheme = themeManager.getOptions("series", particularSeriesOptions, allSeriesOptions.length);

            if(that._checkPaneName(seriesTheme)) {
                seriesThemes.push(seriesTheme);
            }
        }

        return seriesThemes;
    },

    _populateSeries(data) {
        const that = this;
        const seriesBasis = [];
        const incidentOccurred = that._incidentOccurred;
        let seriesThemes = that._populateSeriesOptions(data);
        let particularSeries;
        let changedStateSeriesCount = 0;

        that.needToPopulateSeries = false;

        _each(seriesThemes, (_, theme) => {
            const curSeries = that.series && that.series.filter(s =>
                s.name === theme.name && seriesBasis.map(sb => sb.series).indexOf(s) === -1
            )[0];
            if(curSeries && curSeries.type === theme.type) {
                seriesBasis.push({ series: curSeries, options: theme });
            } else {
                seriesBasis.push({ options: theme });
                changedStateSeriesCount++;
            }
        });

        that._tracker.clearHover();

        _reverseEach(that.series, (index, series) => {
            if(!seriesBasis.some(s => series === s.series)) {
                that._disposeSeries(index);
                changedStateSeriesCount++;
            }
        });

        that.series = [];

        changedStateSeriesCount > 0 && that._disposeSeriesFamilies();
        that._themeManager.resetPalette();
        const eventPipe = function(data) {
            that.series.forEach(function(currentSeries) {
                currentSeries.notify(data);
            });
        };

        _each(seriesBasis, (_, basis) => {
            let seriesTheme = basis.options;
            let renderSettings = {
                commonSeriesModes: that._getSelectionModes(),
                argumentAxis: that.getArgumentAxis(),
                valueAxis: that._getValueAxis(seriesTheme.pane, seriesTheme.axis)
            };
            if(basis.series) {
                particularSeries = basis.series;
                particularSeries.updateOptions(seriesTheme, renderSettings);
            } else {
                particularSeries = new seriesModule.Series(_extend({
                    renderer: that._renderer,
                    seriesGroup: that._seriesGroup,
                    labelsGroup: that._labelsGroup,
                    eventTrigger: that._eventTrigger,
                    eventPipe: eventPipe,
                    incidentOccurred: incidentOccurred
                }, renderSettings), seriesTheme);
            }
            if(!particularSeries.isUpdated) {
                incidentOccurred("E2101", [seriesTheme.type]);
            } else {
                particularSeries.index = that.series.length;
                that.series.push(particularSeries);
            }
        });

        return that.series;
    },

    // API
    getAllSeries: function getAllSeries() {
        return (this.series || []).slice();
    },

    getSeriesByName: function getSeriesByName(name) {
        var found = null;
        _each(this.series, function(i, singleSeries) {
            if(singleSeries.name === name) {
                found = singleSeries;
                return false;
            }
        });
        return found;
    },

    getSeriesByPos: function getSeriesByPos(pos) {
        return (this.series || [])[pos];
    },

    clearSelection: function clearSelection() {
        this._tracker.clearSelection();
    },

    hideTooltip: function() {
        this._tracker._hideTooltip();
    },

    clearHover() {
        this._tracker.clearHover();
    },

    render: function(renderOptions) {
        var that = this;
        that.__renderOptions = renderOptions;
        that.__forceRender = renderOptions && renderOptions.force;
        that.callBase.apply(that, arguments);
        that.__renderOptions = that.__forceRender = null;
        return that;
    },

    refresh: function() {
        this._disposeSeries();
        this._disposeSeriesFamilies();
        this._requestChange(["CONTAINER_SIZE", "REFRESH_SERIES_REINIT"]);
    },

    _getMinSize() {
        const adaptiveLayout = this._layoutManagerOptions();
        return [adaptiveLayout.width, adaptiveLayout.height];
    },

    _change_REFRESH() {
        if(!this._changes.has("INIT")) {
            this._doRefresh();
        } else {
            this._currentRefreshData = null;
        }
    },

    _change_FULL_RENDER() {
        this._forceRender();
    },

    _change_INIT() {
        this._reinit();
    },

    _stopCurrentHandling: function() {
        this._tracker.stopCurrentHandling();
    }
});

REFRESH_SERIES_DATA_INIT_ACTION_OPTIONS.forEach(function(name) {
    BaseChart.prototype._optionChangesMap[name] = "REFRESH_SERIES_DATA_INIT";
});

FORCE_RENDER_REFRESH_ACTION_OPTIONS.forEach(function(name) {
    BaseChart.prototype._optionChangesMap[name] = "FORCE_RENDER";
});

REFRESH_SERIES_FAMILIES_ACTION_OPTIONS.forEach(function(name) {
    BaseChart.prototype._optionChangesMap[name] = "REFRESH_SERIES_FAMILIES";
});

exports.overlapping = overlapping;

exports.BaseChart = BaseChart;

// PLUGINS_SECTION
BaseChart.addPlugin(require("../core/export").plugin);
BaseChart.addPlugin(require("../core/title").plugin);
BaseChart.addPlugin(require("../core/tooltip").plugin);
BaseChart.addPlugin(require("../core/loading_indicator").plugin);
BaseChart.addPlugin(require("../core/data_source").plugin);

// These are charts specifics on using title - they cannot be omitted because of charts custom layout.
var _change_TITLE = BaseChart.prototype._change_TITLE;
BaseChart.prototype._change_TITLE = function() {
    _change_TITLE.apply(this, arguments);
    this._change(["FORCE_RENDER"]);
};

// These are charts specifics on using tooltip.
var _change_TOOLTIP = BaseChart.prototype._change_TOOLTIP;
BaseChart.prototype._change_TOOLTIP = function() {
    _change_TOOLTIP.apply(this, arguments);
    this._change(["CHART_TOOLTIP"]);
};
