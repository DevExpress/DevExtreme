"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    eventUtils = require("../../events/utils"),
    BaseWidget = require("../core/base_widget"),
    legendModule = require("../components/legend"),
    dataValidatorModule = require("../components/data_validator"),
    seriesModule = require("../series/base_series"),
    chartThemeManagerModule = require("../components/chart_theme_manager"),
    LayoutManagerModule = require("./layout_manager"),
    trackerModule = require("./tracker"),
    headerBlockModule = require("./header_block"),

    REINIT_REFRESH_ACTION = "_reinit",
    REINIT_DATA_SOURCE_REFRESH_ACTION = "_updateDataSource",
    DATA_INIT_REFRESH_ACTION = "_dataInit",
    FORCE_RENDER_REFRESH_ACTION = "_forceRender",
    RESIZE_REFRESH_ACTION = "_resize",
    ACTIONS_BY_PRIORITY = [REINIT_REFRESH_ACTION, REINIT_DATA_SOURCE_REFRESH_ACTION, DATA_INIT_REFRESH_ACTION, FORCE_RENDER_REFRESH_ACTION, RESIZE_REFRESH_ACTION],

    vizUtils = require("../core/utils"),
    _noop = commonUtils.noop,
    _map = vizUtils.map,
    _each = $.each,
    _extend = extend,
    _isArray = Array.isArray,
    _isDefined = commonUtils.isDefined,
    _setCanvasValues = vizUtils.setCanvasValues,
    DEFAULT_OPACITY = 0.3,

    REFRESH_SERIES_DATA_INIT_ACTION_OPTIONS = [
        "series",
        "commonSeriesSettings",
        "containerBackgroundColor",
        "dataPrepareSettings",
        "seriesSelectionMode",
        "pointSelectionMode",
        "useAggregation",
        "synchronizeMultiAxes"
    ],

    REFRESH_SERIES_FAMILIES_ACTION_OPTIONS = [
        "equalBarWidth",
        "minBubbleSize",
        "maxBubbleSize",
        "barWidth",
        "negativesAsZeroes",
        "negativesAsZeros" //misspelling case
    ],

    FORCE_RENDER_REFRESH_ACTION_OPTIONS = [
        "adaptiveLayout",
        "crosshair",
        "resolveLabelOverlapping",
        "adjustOnZoom",
        "zoomingMode",
        "scrollingMode"
    ];

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
        var value = rollingStock.getLabels()[0].getData().value;
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

    smallestObject.rollingStock.getLabels()[0].hide();
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
        for(j = 0, jLength = rollingStocks.length; j < jLength; j++) {
            if(i !== j && checkStacksOverlapping(rollingStocks[i], rollingStocks[j], true)) {
                overlap = true;
                break;
            }
        }
        if(overlap) break;
    }
    return overlap;
}

function resolveLabelOverlappingInOneDirection(points, canvas, isRotated, shiftFunction) {
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
        rollingStocks.sort(function(a, b) { return a.getInitialPosition() - b.getInitialPosition(); });
    }

    if(!checkStackOverlap(rollingStocks)) return;
    checkHeightRollingStock(rollingStocks, stubCanvas);

    prepareOverlapStacks(rollingStocks);

    rollingStocks.reverse();
    moveRollingStock(rollingStocks, stubCanvas);
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
            root = null;
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
            label.shift(coords.x, coords.y);
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

function setTemplateFields(data, templateData, series) {
    _each(data, function(_, data) {
        _each(series.getTemplateFields(), function(_, field) {
            data[field.templateField] = data[field.originalField];
        });
        templateData.push(data);
    });
    series.updateTemplateFieldNames();
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

function suppressCommonLayout(layout) {
    layout.forward = function(rect) { return rect; };
    layout.backward = _noop;
}

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

    _rootClassPrefix: "dxc",

    _rootClass: "dxc-chart",

    _init: function() {
        this._savedBusinessRange = {};
        this.callBase.apply(this, arguments);
    },

    _initialChanges: ["REINIT"],

    _themeDependentChanges: ["REFRESH_SERIES_REINIT"],

    _createThemeManager: function() {
        var option = this.option(),
            themeManager = new chartThemeManagerModule.ThemeManager(option, this._chartType);

        themeManager.setTheme(option.theme, option.rtlEnabled);
        return themeManager;
    },

    _initCore: function() {
        var that = this;
        suppressCommonLayout(that._layout);
        that._canvasClipRect = that._renderer.clipRect();

        that._createHtmlStructure();
        that._headerBlock = new headerBlockModule.HeaderBlock();
        that._createLegend();
        that._createTracker();
        that._needHandleRenderComplete = true;
        that.layoutManager = new LayoutManagerModule.LayoutManager();
        that._createScrollBar();

        that._$element.on("contextmenu", function(event) {
            ///#DEBUG
            that.eventType = "contextmenu";
            ///#ENDDEBUG
            if(eventUtils.isTouchEvent(event) || eventUtils.isPointerEvent(event)) {
                event.preventDefault();
            }
        }).on("MSHoldVisual", function(event) {
            ///#DEBUG
            that.eventType = "MSHoldVisual";
            ///#ENDDEBUG
            event.preventDefault();
        });
    },

    // Common functionality is overridden because Chart has its own layout logic. Nevertheless common logic should be used.
    _getLayoutItems: commonUtils.noop,

    _layoutManagerOptions: function() {
        return this._themeManager.getOptions("adaptiveLayout");
    },

    _reinit: function() {
        var that = this;
            //_skipRender = !that._initialized;

        _setCanvasValues(that._canvas);
        that._reinitAxes();
        // NOTE: T273635
        // Changing the `_initialized` flag prevents `_render` which is synchronously called from the `_updateDataSource` when data source is local and series rendering is synchronous
        // This is possible because `_render` checks the `_initialized` flag
        //if (!_skipRender) {
        that._skipRender = true;        // T273635, T351032
        //}
        that._updateDataSource();
        if(!that.series) {
            that._dataSpecificInit(false);
        }
        //if (!_skipRender) {
        that._skipRender = false;       // T273635, T351032
        //}
        that._correctAxes();
        /*_skipRender || */that._forceRender();
    },

    _correctAxes: _noop,

    _createHtmlStructure: function() {
        var that = this,
            renderer = that._renderer,
            root = renderer.root;

        that._backgroundRect = renderer.rect().attr({ fill: "gray", opacity: 0.0001 }).append(root);
        that._panesBackgroundGroup = renderer.g().attr({ "class": "dxc-background" }).append(root);

        that._stripsGroup = renderer.g().attr({ "class": "dxc-strips-group" }).linkOn(root, "strips");                         // TODO: Must be created in the same place where used (advanced chart)
        that._gridGroup = renderer.g().attr({ "class": "dxc-grids-group" }).linkOn(root, "grids");                              // TODO: Must be created in the same place where used (advanced chart)
        that._axesGroup = renderer.g().attr({ "class": "dxc-axes-group" }).linkOn(root, "axes");                                // TODO: Must be created in the same place where used (advanced chart)
        that._constantLinesGroup = renderer.g().attr({ "class": "dxc-constant-lines-group" }).linkOn(root, "constant-lines");   // TODO: Must be created in the same place where used (advanced chart)
        that._labelAxesGroup = renderer.g().attr({ "class": "dxc-strips-labels-group" }).linkOn(root, "strips-labels");         // TODO: Must be created in the same place where used (advanced chart)
        that._panesBorderGroup = renderer.g().attr({ "class": "dxc-border" }).linkOn(root, "border");                           // TODO: Must be created in the same place where used (chart)
        that._seriesGroup = renderer.g().attr({ "class": "dxc-series-group" }).linkOn(root, "series");
        that._labelsGroup = renderer.g().attr({ "class": "dxc-labels-group" }).linkOn(root, "labels");
        that._crosshairCursorGroup = renderer.g().attr({ "class": "dxc-crosshair-cursor" }).linkOn(root, "crosshair");
        that._legendGroup = renderer.g().attr({ "class": "dxc-legend", "clip-path": that._getCanvasClipRectID() }).linkOn(root, "legend");
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

        that.businessRanges = null;
        disposeObjectsInArray.call(that, "series");

        disposeObject("_headerBlock");
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

    _applySize: function() {
        //if (this._initialized) {
        //    this._resize();
        //}
        this._processRefreshData(RESIZE_REFRESH_ACTION);
    },

    //_resize: function () {
    //    if (this._updateLockCount) {//T244164
    //        this._processRefreshData(RESIZE_REFRESH_ACTION);
    //    } else {
    //        this._render(this.__renderOptions || { animate: false, isResize: true });
    //    }
    //},

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

    _doRender: function(_options) {
        var that = this,
            drawOptions,
            recreateCanvas;

        if(/*!that._initialized || */that._skipRender) return; // NOTE: Because _render can be called from _init!

        if(that._canvas.width === 0 && that._canvas.height === 0) return;

        that._resetIsReady(); //T207606
        drawOptions = that._prepareDrawOptions(_options);
        recreateCanvas = drawOptions.recreateCanvas;

        // T207665
        that.__originalCanvas = that._canvas;
        that._canvas = extend({}, that._canvas);  // NOTE: Instance of the original canvas must be preserved

        // T207665
        if(recreateCanvas) {
            that.__currentCanvas = that._canvas;
        } else {
            that._canvas = that.__currentCanvas;
        }

        ///#DEBUG
        that.DEBUG_canvas = that._canvas;
        ///#ENDDEBUG

        recreateCanvas && that._updateCanvasClipRect(that._canvas);

        that._renderer.stopAllAnimations(true);
        _setCanvasValues(that._canvas);
        that._cleanGroups();
        that._renderElements(drawOptions);
    },

    _renderElements: function(drawOptions) {
        var that = this,
            preparedOptions = that._prepareToRender(drawOptions),
            isRotated = that._isRotated(),
            isLegendInside = that._isLegendInside(),
            trackerCanvases = [],
            layoutTargets = that._getLayoutTargets(),
            dirtyCanvas = extend({}, that._canvas),
            argBusinessRange,
            zoomMinArg,
            drawElements = [],
            layoutCanvas = drawOptions.drawTitle && drawOptions.drawLegend && drawOptions.adjustAxes,
            zoomMaxArg;

        ///#DEBUG
        that.DEBUG_dirtyCanvas = dirtyCanvas;
        ///#ENDDEBUG
        if(layoutCanvas) {
            drawElements = that._getDrawElements(drawOptions, isLegendInside);
        }

        that._renderer.lock();

        that.layoutManager.setOptions(that._layoutManagerOptions());
        that.layoutManager.layoutElements(
            drawElements,
            that._canvas,
            function(sizeShortage) {
                that._renderAxes(drawOptions, preparedOptions, isRotated);
                sizeShortage && that._shrinkAxes(drawOptions, sizeShortage);
            },
            layoutTargets,
            isRotated
        );
        layoutCanvas && that._updateCanvasClipRect(dirtyCanvas);

        that._applyClipRects(preparedOptions);
        that._appendSeriesGroups();
        that._createCrosshairCursor();

        _each(layoutTargets, function() {
            var canvas = this.canvas;
            trackerCanvases.push({
                left: canvas.left,
                right: canvas.width - canvas.right,
                top: canvas.top,
                bottom: canvas.height - canvas.bottom
            });
        });

        if(that._scrollBar) {
            argBusinessRange = that._argumentAxes[0].getTranslator().getBusinessRange();
            if(argBusinessRange.axisType === "discrete" && argBusinessRange.categories && argBusinessRange.categories.length <= 1) {
                zoomMinArg = zoomMaxArg = undefined;
            } else {
                zoomMinArg = argBusinessRange.minVisible;
                zoomMaxArg = argBusinessRange.maxVisible;
            }

            that._scrollBar.init(argBusinessRange).setPosition(zoomMinArg, zoomMaxArg);
        }

        that._updateTracker(trackerCanvases);
        that._updateLegendPosition(drawOptions, isLegendInside);
        that._renderSeries(drawOptions, isRotated, isLegendInside);

        that._renderer.unlock();
    },

    _createCrosshairCursor: _noop,

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
        // T207665, T336349, T503616
        this._canvas = this.__originalCanvas;
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

        resolveLabelOverlapping !== "none" && that._resolveLabelOverlapping(resolveLabelOverlapping);
        that._adjustSeries();

        that._renderTrackers(isLegendInside);
        that._tracker.repairTooltip();

        that._drawn();
        that._renderCompleteHandler();
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
        commonUtils.isFunction(func) && func.call(this);
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
                labels = labels.concat(points[j].getLabels());
            }
        }

        for(i = 0; i < labels.length; i++) {
            currentLabel = labels[i];
            currentLabelRect = currentLabel.getBoundingRect();

            if(!currentLabel.isVisible()) {
                continue;
            }

            for(j = i + 1; j < labels.length; j++) {
                nextLabel = labels[j];
                nextLabelRect = nextLabel.getBoundingRect();
                if(checkOverlapping(currentLabelRect, nextLabelRect)) {
                    nextLabel.hide();
                }
            }
        }
    },

    _cleanGroups: function() {
        var that = this;
        that._stripsGroup.linkRemove().clear();             // TODO: Must be removed in the same place where appended (advanced chart)
        that._gridGroup.linkRemove().clear();               // TODO: Must be removed in the same place where appended (advanced chart)
        that._axesGroup.linkRemove().clear();               // TODO: Must be removed in the same place where appended (advanced chart)
        that._constantLinesGroup.linkRemove().clear();      // TODO: Must be removed in the same place where appended (advanced chart)
        that._labelAxesGroup.linkRemove().clear();          // TODO: Must be removed in the same place where appended (advanced chart)
        //that._seriesGroup.linkRemove().clear();
        that._labelsGroup.linkRemove().clear();
        that._crosshairCursorGroup.linkRemove().clear();
    },

    _createLegend: function() {
        var that = this,
            legendSettings = getLegendSettings(that._legendDataField);

        that._legend = new legendModule.Legend({
            renderer: that._renderer,
            group: that._legendGroup,
            backgroundClass: "dxc-border",
            itemGroupClass: "dxc-item",
            textField: legendSettings.textField,
            getFormatObject: legendSettings.getFormatObject
        });
    },

    _updateLegend: function() {
        var that = this,
            themeManager = that._themeManager,
            legendOptions = themeManager.getOptions("legend"),
            legendData = that._getLegendData();

        legendOptions.containerBackgroundColor = themeManager.getOptions("containerBackgroundColor");
        legendOptions._incidentOccurred = that._incidentOccurred;     // TODO: Why is `_` used?
        that._legend.update(legendData, legendOptions);
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
            drawOptions, this.__renderOptions);     // NOTE: This is to support `render` method options
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
            //this._invalidate();
        }
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
                argument: item.argument,
                id: item.index,
                argumentIndex: item.argumentIndex
            },
            getLegendStyles: item.getLegendStyles(),
            visible: item.isVisible()
        };
    },

    _disposeSeries: function() {
        var that = this;
        _each(that.series || [], function(_, series) { series.dispose(); });
        that.series = null;

        _each(that.seriesFamilies || [], function(_, family) { family.dispose(); });
        that.seriesFamilies = null;
        that._needHandleRenderComplete = true;
    },

    _optionChanged: function(arg) {
        this._themeManager.resetOptions(arg.name);
        this.callBase.apply(this, arguments);
    },

    _applyChanges: function() {
        var that = this;
        that._themeManager.update(that._options);
        that.callBase.apply(that, arguments);
        that._doRefresh();
    },

    _optionChangesMap: {
        animation: "ANIMATION",
        dataSource: "DATA_SOURCE",
        palette: "PALETTE",

        legend: "DATA_INIT",
        seriesTemplate: "DATA_INIT",

        "export": "FORCE_RENDER",

        valueAxis: "AXES_AND_PANES",
        argumentAxis: "AXES_AND_PANES",
        commonAxisSettings: "AXES_AND_PANES",
        panes: "AXES_AND_PANES",
        defaultPane: "AXES_AND_PANES",

        rotated: "ROTATED",

        customizePoint: "REFRESH_SERIES_REINIT",
        customizeLabel: "REFRESH_SERIES_REINIT",

        scrollBar: "SCROLL_BAR"
    },

    _customChangesOrder: ["ANIMATION", "REFRESH_SERIES_FAMILIES", "DATA_SOURCE", "PALETTE", "REFRESH_SERIES_DATA_INIT", "DATA_INIT",
        "FORCE_RENDER", "AXES_AND_PANES", "ROTATED", "REFRESH_SERIES_REINIT", "SCROLL_BAR", "CHART_TOOLTIP", "REINIT"],

    _change_ANIMATION: function() {
        this._renderer.updateAnimationOptions(this._getAnimationOptions());
    },

    _change_DATA_SOURCE: function() {
        this._needHandleRenderComplete = true;
        this._processRefreshData(REINIT_DATA_SOURCE_REFRESH_ACTION);
    },

    _change_PALETTE: function() {
        this._themeManager.updatePalette(this.option("palette"));
        this._refreshSeries(DATA_INIT_REFRESH_ACTION);
    },

    _change_REFRESH_SERIES_DATA_INIT: function() {
        this._refreshSeries(DATA_INIT_REFRESH_ACTION);
    },

    _change_DATA_INIT: function() {
        this._processRefreshData(DATA_INIT_REFRESH_ACTION);
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
        this._refreshSeries(REINIT_REFRESH_ACTION);
    },

    _change_ROTATED: function() {
        this._createScrollBar();
        this._refreshSeries(REINIT_REFRESH_ACTION);
    },

    _change_REFRESH_SERIES_REINIT: function() {
        this._refreshSeries(REINIT_REFRESH_ACTION);
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
        this._disposeSeries();
        this._processRefreshData(actionName);
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
        this._resetZoom();
        this._dataInit();
    },

    _dataInit: function() {
        this._dataSpecificInit(true);
    },

    _dataSpecificInit: function(needRedraw) {
        var that = this;
        that.series = that.series || that._populateSeries();
        that._repopulateSeries();
        that._seriesPopulatedHandlerCore();
        that._populateBusinessRange();
        that._tracker.updateSeries(that.series);
        that._updateLegend();
        needRedraw && that._forceRender();
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
            that._templatedSeries = vizUtils.processSeriesTemplate(seriesTemplate, data);
            that._populateSeries();
            delete that._templatedSeries;
            data = that.templateData || data;
        }

        that._groupSeries();
        parsedData = dataValidatorModule.validateData(data, that._groupsData, that._incidentOccurred, dataValidatorOptions);
        themeManager.resetPalette();

        that.series.forEach(function(singleSeries) {
            singleSeries.updateData(parsedData[singleSeries.getArgumentField()]);
            that._processSingleSeries(singleSeries);
        });

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

    _getDrawElements: function(drawOptions, legendHasInsidePosition) {
        var that = this,
            drawElements = [],
            exportOptions = that._themeManager.getOptions("export"),
            titleOptions = that._title.getLayoutOptions() || {},
            legendOptions,
            headerElements = [];

        if(that._exportMenu && exportOptions.enabled) {
            headerElements.push(that._exportMenu);
            drawElements.push(that._headerBlock);
        }

        if(drawOptions.drawTitle) {
            titleOptions.verticalAlignment !== "bottom" && headerElements.length ? headerElements.push(that._title) : drawElements.push(that._title);
        }

        if(drawOptions.drawLegend && that._legend) {
            that._legendGroup.linkAppend();
            if(!legendHasInsidePosition) {
                legendOptions = that._legend.getLayoutOptions();
                if(headerElements.length === 1 && legendOptions.verticalAlignment !== "bottom" && legendOptions.cutSide === "vertical") {
                    headerElements.push(that._legend);
                } else {
                    drawElements.push(that._legend);
                }
            }
        }

        if(headerElements.length) {
            that._headerBlock.update(headerElements, that._canvas);
        }
        return drawElements;
    },

    _resetZoom: _noop,

    _dataIsReady: function() {
        // In order to support scenario when chart is created without "dataSource" and it is considered
        // as data is being loaded the check for state of "dataSource" option is added
        return _isDefined(this.option("dataSource")) && this._dataIsLoaded();
    },

    _populateSeries: function() {
        var that = this,
            themeManager = that._themeManager,
            hasSeriesTemplate = !!themeManager.getOptions("seriesTemplate"),
            seriesOptions = hasSeriesTemplate ? that._templatedSeries : that.option("series"),
            allSeriesOptions = (_isArray(seriesOptions) ? seriesOptions : (seriesOptions ? [seriesOptions] : [])),
            extraOptions = that._getExtraOptions(),
            particularSeriesOptions,
            particularSeries,
            seriesTheme,
            data,
            i,
            seriesVisibilityChanged = function() {
                that._specialProcessSeries();
                that._populateBusinessRange();
                that._renderer.stopAllAnimations(true);
                that._updateLegend();
                that._doRender({ force: true });
            },
            eventPipe;

        that._disposeSeries();
        that.series = [];
        that.templateData = [];
        themeManager.resetPalette();
        eventPipe = function(data) {
            that.series.forEach(function(currentSeries) {
                currentSeries.notify(data);
            });
        };

        for(i = 0; i < allSeriesOptions.length; i++) {
            particularSeriesOptions = _extend(true, {}, allSeriesOptions[i], extraOptions);

            if(!particularSeriesOptions.name) {
                particularSeriesOptions.name = "Series " + (i + 1).toString();
            }

            data = particularSeriesOptions.data;
            particularSeriesOptions.data = null;

            particularSeriesOptions.rotated = that._isRotated();
            particularSeriesOptions.customizePoint = themeManager.getOptions("customizePoint");
            particularSeriesOptions.customizeLabel = themeManager.getOptions("customizeLabel");
            particularSeriesOptions.visibilityChanged = seriesVisibilityChanged;
            particularSeriesOptions.incidentOccurred = that._incidentOccurred;

            seriesTheme = themeManager.getOptions("series", particularSeriesOptions);

            if(!that._checkPaneName(seriesTheme)) {
                continue;
            }

            particularSeries = new seriesModule.Series({
                renderer: that._renderer,
                seriesGroup: that._seriesGroup,
                labelsGroup: that._labelsGroup,
                eventTrigger: that._eventTrigger,
                commonSeriesModes: that._getSelectionModes(),
                eventPipe: eventPipe,
                argumentAxis: that._getArgumentAxis(),
                valueAxis: that._getValueAxis(seriesTheme.pane, seriesTheme.axis)
            }, seriesTheme);

            if(!particularSeries.isUpdated) {
                that._incidentOccurred("E2101", [seriesTheme.type]);
            } else {
                particularSeries.index = that.series.length;
                that._processSingleSeries(particularSeries);
                that.series.push(particularSeries);
                if(hasSeriesTemplate) {
                    setTemplateFields(data, that.templateData, particularSeries);
                }
            }
        }
        return that.series;
    },

    //API
    getAllSeries: function getAllSeries() {
        return this.series.slice();
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
        return this.series[pos];
    },

    clearSelection: function clearSelection() {
        this._tracker.clearSelection();
    },

    hideTooltip: function() {
        this._tracker._hideTooltip();
    },

    render: function(renderOptions) {
        var that = this;
        that.__renderOptions = renderOptions;
        that.__forceRender = renderOptions && renderOptions.force;
        that.callBase.apply(that, arguments);
        that.__renderOptions = that.__forceRender = null;
        return that;
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
