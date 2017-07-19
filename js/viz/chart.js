"use strict";

var $ = require("../core/renderer"),
    commonUtils = require("../core/utils/common"),
    _extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    registerComponent = require("../core/component_registrator"),
    vizUtils = require("./core/utils"),
    overlapping = require("./chart_components/base_chart").overlapping,
    LayoutManagerModule = require("./chart_components/layout_manager"),
    multiAxesSynchronizer = require("./chart_components/multi_axes_synchronizer"),
    AdvancedChart = require("./chart_components/advanced_chart").AdvancedChart,
    scrollBarModule = require("./chart_components/scroll_bar"),
    crosshairModule = require("./chart_components/crosshair"),
    DEFAULT_PANE_NAME = "default",
    DEFAULT_PANES = [{
        name: DEFAULT_PANE_NAME,
        border: {}
    }],

    _map = vizUtils.map,
    _each = $.each,
    _isArray = Array.isArray,
    _isDefined = commonUtils.isDefined;

function getFirstAxisNameForPane(axes, paneName, defaultPane) {
    var result;
    for(var i = 0; i < axes.length; i++) {
        if(axes[i].pane === paneName || (axes[i].pane === undefined && paneName === defaultPane)) {
            result = axes[i].name;
            break;
        }
    }
    if(!result) {
        result = axes[0].name;
    }
    return result;
}

function hideGridsOnNonFirstValueAxisForPane(valAxes, paneName, synchronizeMultiAxes) {
    var axesForPane = [],
        firstShownAxis;
    _each(valAxes, function(_, axis) {
        if(axis.pane === paneName) {
            axesForPane.push(axis);
        }
    });
    if(axesForPane.length > 1 && synchronizeMultiAxes) {
        _each(axesForPane, function(_, axis) {
            var gridOpt = axis.getOptions().grid,
                minorGridOpt = axis.getOptions().minorGrid;
            if(firstShownAxis && gridOpt && gridOpt.visible) {
                gridOpt.visible = false;
                minorGridOpt && (minorGridOpt.visible = false);
            } else {
                firstShownAxis = firstShownAxis ? firstShownAxis : gridOpt && gridOpt.visible;
            }
        });
    }
}

function findAxisOptions(valueAxes, valueAxesOptions, axisName) {
    var result,
        axInd;

    for(axInd = 0; axInd < valueAxesOptions.length; axInd++) {
        if(valueAxesOptions[axInd].name === axisName) {
            result = valueAxesOptions[axInd];
            result.priority = axInd;
            break;
        }
    }
    if(!result) {
        for(axInd = 0; axInd < valueAxes.length; axInd++) {
            if(valueAxes[axInd].name === axisName) {
                result = valueAxes[axInd].getOptions();
                result.priority = valueAxes[axInd].priority;
                break;
            }
        }
    }

    return result;
}

function findAxis(paneName, axisName, axes) {
    var axis,
        i;
    for(i = 0; i < axes.length; i++) {
        axis = axes[i];
        if(axis.name === axisName && axis.pane === paneName) {
            return axis;
        }
    }
    if(paneName) {
        return findAxis(undefined, axisName, axes);
    }
}

function applyClipSettings(clipRects, settings) {
    _each(clipRects || [], function(_, c) {
        c && c.attr(settings);
    });
}

function compareAxes(a, b) {
    return a.priority - b.priority;
}

//checks if pane with provided name exists in this panes array
function doesPaneExist(panes, paneName) {
    var found = false;
    _each(panes, function(_, pane) {
        if(pane.name === paneName) {
            found = true;
            return false;
        }
    });
    return found;
}

//'var' because JSHint throws W021 error
var prepareSegmentRectPoints = function(left, top, width, height, borderOptions) {
    var maxSW = ~~((width < height ? width : height) / 2),
        sw = borderOptions.width || 0,
        newSW = sw < maxSW ? sw : maxSW;

    left = left + newSW / 2;
    top = top + newSW / 2;
    width = width - newSW;
    height = height - newSW;

    var right = left + width,
        bottom = top + height,
        points = [],
        segments = [],
        segmentSequence,
        visiblyOpt = 0,
        prevSegmentVisibility = 0;
    var allSegment = {
        top: [[left, top], [right, top]],
        right: [[right, top], [right, bottom]],
        bottom: [[right, bottom], [left, bottom]],
        left: [[left, bottom], [left, top]]
    };
    _each(allSegment, function(seg) {
        var visibility = !!borderOptions[seg];
        visiblyOpt = visiblyOpt * 2 + (~~visibility);
    });
    switch(visiblyOpt) {
        case 13:
        case 9:
            segmentSequence = ["left", "top", "right", "bottom"];
            break;
        case 11:
            segmentSequence = ["bottom", "left", "top", "right"];
            break;
        default:
            segmentSequence = ["top", "right", "bottom", "left"];
    }

    _each(segmentSequence, function(_, seg) {
        var segmentVisibility = !!borderOptions[seg];

        if(!prevSegmentVisibility && segments.length) {
            points.push(segments);
            segments = [];
        }

        if(segmentVisibility) {
            _each(allSegment[seg].slice(prevSegmentVisibility), function(_, segment) {
                segments = segments.concat(segment);
            });
        }
        prevSegmentVisibility = ~~segmentVisibility;
    });
    segments.length && points.push(segments);

    points.length === 1 && (points = points[0]);

    return { points: points, pathType: visiblyOpt === 15 ? "area" : "line" };
};

//utilities used in axes rendering
function accumulate(field, src1, src2, auxSpacing) {
    var val1 = src1[field] || 0,
        val2 = src2[field] || 0;
    return val1 + val2 + (val1 && val2 ? auxSpacing : 0);
}

function pickMax(field, src1, src2) {
    return pickMaxValue(src1[field], src2[field]);
}

function pickMaxValue(val1, val2) {
    return Math.max(val1 || 0, val2 || 0);
}

function getAxisMargins(axis) {
    return axis.getMargins();
}

function getHorizontalAxesMargins(axes, getMarginsFunc) {
    return axes.reduce(function(margins, axis) {
        var axisMargins = getMarginsFunc(axis),
            paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {},
            spacing = axis.getMultipleAxesSpacing();

        paneMargins.top = accumulate("top", paneMargins, axisMargins, spacing);
        paneMargins.bottom = accumulate("bottom", paneMargins, axisMargins, spacing);
        paneMargins.left = pickMax("left", paneMargins, axisMargins);
        paneMargins.right = pickMax("right", paneMargins, axisMargins);

        margins.top = pickMax("top", paneMargins, margins);
        margins.bottom = pickMax("bottom", paneMargins, margins);
        margins.left = pickMax("left", paneMargins, margins);
        margins.right = pickMax("right", paneMargins, margins);

        return margins;
    }, { panes: {} });
}

function getVerticalAxesMargins(axes) {
    return axes.reduce(function(margins, axis) {
        var axisMargins = axis.getMargins(),
            paneMargins = margins.panes[axis.pane] = margins.panes[axis.pane] || {},
            spacing = axis.getMultipleAxesSpacing();

        paneMargins.top = pickMax("top", paneMargins, axisMargins);
        paneMargins.bottom = pickMax("bottom", paneMargins, axisMargins);
        paneMargins.left = accumulate("left", paneMargins, axisMargins, spacing);
        paneMargins.right = accumulate("right", paneMargins, axisMargins, spacing);

        margins.top = pickMax("top", paneMargins, margins);
        margins.bottom = pickMax("bottom", paneMargins, margins);
        margins.left = pickMax("left", paneMargins, margins);
        margins.right = pickMax("right", paneMargins, margins);

        return margins;
    }, { panes: {} });
}

function performActionOnAxes(axes, action, actionArgument1, actionArgument2) {
    axes.forEach(function(axis) {
        axis[action](actionArgument1 && actionArgument1[axis.pane], actionArgument2 && actionArgument2[axis.pane]);
    });
}

function shrinkCanvases(isRotated, canvases, verticalMargins, horizontalMargins) {
    function getMargin(side, margins, pane) {
        var m = (isRotated ? ["left", "right"] : ["top", "bottom"]).indexOf(side) === -1 ? margins : (margins.panes[pane] || {});
        return m[side];
    }

    function getMaxMargin(side, margins1, margins2, pane) {
        return pickMaxValue(getMargin(side, margins1, pane), getMargin(side, margins2, pane));
    }

    for(var pane in canvases) {
        canvases[pane].top = canvases[pane].originalTop + getMaxMargin("top", verticalMargins, horizontalMargins, pane);
        canvases[pane].bottom = canvases[pane].originalBottom + getMaxMargin("bottom", verticalMargins, horizontalMargins, pane);
        canvases[pane].left = canvases[pane].originalLeft + getMaxMargin("left", verticalMargins, horizontalMargins, pane);
        canvases[pane].right = canvases[pane].originalRight + getMaxMargin("right", verticalMargins, horizontalMargins, pane);
    }

    return canvases;
}

function drawAxesWithTicks(axes, condition, canvases, panesBorderOptions) {
    if(condition) {
        performActionOnAxes(axes, "createTicks", canvases);
        multiAxesSynchronizer.synchronize(axes);
    }
    performActionOnAxes(axes, "draw", !condition && canvases, panesBorderOptions);
}

function shiftAxis(side1, side2) {
    var shifts = {};
    return function(axis) {
        var shift = shifts[axis.pane] = shifts[axis.pane] || { top: 0, left: 0, bottom: 0, right: 0 },
            spacing = axis.getMultipleAxesSpacing(),
            margins = axis.getMargins();

        axis.shift(shift);

        shift[side1] = accumulate(side1, shift, margins, spacing);
        shift[side2] = accumulate(side2, shift, margins, spacing);
    };
}

function getCommonSize(side, margins) {
    var size = 0,
        pane,
        paneMargins;

    for(pane in margins.panes) {
        paneMargins = margins.panes[pane];
        size = size + (side === "height" ? (paneMargins.top + paneMargins.bottom) : (paneMargins.left + paneMargins.right));
    }

    return size;
}

function checkUsedSpace(sizeShortage, side, axes, getMarginFunc) {
    var size = 0;
    if(sizeShortage[side] > 0) {
        size = getCommonSize(side, getMarginFunc(axes, getAxisMargins));

        performActionOnAxes(axes, "hideTitle");

        sizeShortage[side] -= size - getCommonSize(side, getMarginFunc(axes, getAxisMargins));
    }
    if(sizeShortage[side] > 0) {
        performActionOnAxes(axes, "hideOuterElements");
    }
}
//utilities used in axes rendering

var dxChart = AdvancedChart.inherit({
    _chartType: "chart",

    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        _extend(this._deprecatedOptions, {
            "argumentAxis.label.overlappingBehavior.rotationAngle": { since: "17.1", message: "Use the 'argumentAxis.label.rotationAngle' option instead" },
            "argumentAxis.label.overlappingBehavior.staggeringSpacing": { since: "17.1", message: "Use the 'argumentAxis.label.staggeringSpacing' option instead" },
            "argumentAxis.label.overlappingBehavior.mode": { since: "17.1", message: "Use the 'overlappingBehavior' option directly" },

            "valueAxis.label.overlappingBehavior.rotationAngle": { since: "17.1", message: "Use the 'valueAxis.label.rotationAngle' option instead" },
            "valueAxis.label.overlappingBehavior.staggeringSpacing": { since: "17.1", message: "Use the 'valueAxis.label.staggeringSpacing' option instead" },
            "valueAxis.label.overlappingBehavior.mode": { since: "17.1", message: "Use the 'overlappingBehavior' option directly" },

            "commonAxisSettings.label.overlappingBehavior.rotationAngle": { since: "17.1", message: "Use the 'commonAxisSettings.label.rotationAngle' option instead" },
            "commonAxisSettings.label.overlappingBehavior.staggeringSpacing": { since: "17.1", message: "Use the 'commonAxisSettings.label.staggeringSpacing' option instead" },
            "commonAxisSettings.label.overlappingBehavior.mode": { since: "17.1", message: "Use the 'overlappingBehavior' option directly" }
        });
    },

    _initCore: function() {
        this.paneAxis = {};
        this._panesClipRects = {};
        this.callBase();
    },

    _disposeCore: function() {
        var that = this,
            disposeObjectsInArray = this._disposeObjectsInArray,
            panesClipRects = that._panesClipRects;

        that.callBase();
        disposeObjectsInArray.call(panesClipRects, "fixed");
        disposeObjectsInArray.call(panesClipRects, "base");
        disposeObjectsInArray.call(panesClipRects, "wide");
        that._panesClipRects = null;
    },

    _correctAxes: function() {
        this._correctValueAxes();
    },

    _getExtraOptions: commonUtils.noop,

    _processSingleSeries: commonUtils.noop,

    _cleanPanesClipRects: function(clipArrayName) {
        var that = this,
            clipArray = that._panesClipRects[clipArrayName];
        _each(clipArray || [], function(_, clipRect) {
            clipRect && clipRect.dispose();
        });
        that._panesClipRects[clipArrayName] = [];
    },

    _createPanes: function() {
        var that = this,
            panes = that.option("panes"),
            panesNameCounter = 0,
            defaultPane;

        if(!panes || (_isArray(panes) && !panes.length)) {
            panes = DEFAULT_PANES;
        }

        that._cleanPanesClipRects("fixed");
        that._cleanPanesClipRects("base");
        that._cleanPanesClipRects("wide");

        defaultPane = that.option("defaultPane");
        panes = _extend(true, [], _isArray(panes) ? panes : [panes]);
        _each(panes, function(_, pane) {
            pane.name = !_isDefined(pane.name) ? DEFAULT_PANE_NAME + panesNameCounter++ : pane.name;
        });

        if(_isDefined(defaultPane)) {
            if(!doesPaneExist(panes, defaultPane)) {
                that._incidentOccurred("W2101", [defaultPane]);
                defaultPane = panes[panes.length - 1].name;
            }
        } else {
            defaultPane = panes[panes.length - 1].name;
        }
        that.defaultPane = defaultPane;

        panes = that._isRotated() ? panes.reverse() : panes;

        return panes;
    },

    _getAxisRenderingOptions: function() {
        return {
            axisType: "xyAxes", drawingType: "linear"
        };
    },

    _prepareAxisOptions: function(typeSelector, userOptions, rotated) {
        return { isHorizontal: (typeSelector === "argumentAxis") !== rotated };
    },

    _checkPaneName: function(seriesTheme) {
        var paneList = _map(this.panes, function(pane) { return pane.name; });
        seriesTheme.pane = seriesTheme.pane || this.defaultPane;

        return inArray(seriesTheme.pane, paneList) !== -1;
    },

    _getValueAxis: function(paneName, axisName) {
        var that = this,
            valueAxes = that._valueAxes,
            valueAxisOptions = that.option("valueAxis") || {},
            valueAxesOptions = _isArray(valueAxisOptions) ? valueAxisOptions : [valueAxisOptions],
            axisOptions,
            axis;

        axisName = axisName || getFirstAxisNameForPane(valueAxes, paneName, that.defaultPane);

        axis = findAxis(paneName, axisName, valueAxes);
        if(!axis) {
            axisOptions = findAxisOptions(valueAxes, valueAxesOptions, axisName);
            if(!axisOptions) {
                that._incidentOccurred("W2102", [axisName]);
                axisOptions = {
                    name: axisName,
                    priority: valueAxes.length
                };
            }
            axis = that._createAxis("valueAxis", axisOptions, { pane: paneName, name: axisName }, that._isRotated());

            valueAxes.push(axis);
        }

        axis.setPane(paneName);

        return axis;
    },

    _correctValueAxes: function() {
        var that = this,
            synchronizeMultiAxes = that._themeManager.getOptions("synchronizeMultiAxes"),
            valueAxes = that._valueAxes,
            paneWithAxis = {};

        that.series.forEach(function(series) {
            var axis = series.getValueAxis();
            paneWithAxis[axis.pane] = true;
        });

        that.panes.forEach(function(pane) {
            var paneName = pane.name;
            if(!paneWithAxis[paneName]) {
                that._getValueAxis(paneName); //creates an value axis if there is no one for pane
            }
            hideGridsOnNonFirstValueAxisForPane(valueAxes, pane.name, synchronizeMultiAxes);
        });

        that._valueAxes = valueAxes.filter(function(axis) {
            if(!axis.pane) {
                axis.setPane(that.defaultPane);
            }
            return doesPaneExist(that.panes, axis.pane);
        }).sort(compareAxes);
    },

    _getSeriesForPane: function(paneName) {
        var paneSeries = [];
        _each(this.series, function(_, oneSeries) {
            if(oneSeries.pane === paneName) {
                paneSeries.push(oneSeries);
            }
        });
        return paneSeries;
    },

    _createPanesBorderOptions: function() {
        var commonBorderOptions = this._themeManager.getOptions("commonPaneSettings").border,
            panesBorderOptions = {};
        _each(this.panes, function(_, pane) {
            panesBorderOptions[pane.name] = _extend(true, {}, commonBorderOptions, pane.border);
        });
        return panesBorderOptions;
    },

    _createScrollBar: function() {
        var that = this,
            scrollBarOptions = that._themeManager.getOptions("scrollBar") || {},
            scrollBarGroup = that._scrollBarGroup;

        if(scrollBarOptions.visible) {
            scrollBarOptions.rotated = that._isRotated();
            that._scrollBar = (that._scrollBar || new scrollBarModule.ScrollBar(that._renderer, scrollBarGroup)).update(scrollBarOptions);
        } else {
            scrollBarGroup.linkRemove();
            that._scrollBar && that._scrollBar.dispose();
            that._scrollBar = null;
        }
    },

    _prepareToRender: function(drawOptions) {
        var that = this,
            panesBorderOptions = that._createPanesBorderOptions(),
            useAggregation = that._options.useAggregation,
            canvas = that._canvas,
            canvasLength = that._isRotated() ? canvas.height - canvas.top - canvas.bottom : canvas.width - canvas.left - canvas.right;

        that._createPanesBackground();
        that._appendAxesGroups();

        that._transformed && that._resetTransform();

        that._updatePanesCanvases(drawOptions);

        if(useAggregation) {
            that.series.forEach(function(series) {
                series.resamplePoints(canvasLength);
            });
        }

        if((useAggregation || _isDefined(that._zoomMinArg) || _isDefined(that._zoomMaxArg)) && that._themeManager.getOptions("adjustOnZoom")) {
            that._valueAxes.forEach(function(axis) {
                var viewport = that.series.filter(function(s) {
                    return s.getValueAxis() === axis;
                }).reduce(function(range, s) {
                    var seriesRange = s.getViewport();

                    range.min = range.min < seriesRange.min ? range.min : seriesRange.min;
                    range.max = range.max > seriesRange.max ? range.max : seriesRange.max;
                    return range;
                }, {});
                axis.zoom(viewport.min, viewport.max);
            });
        }

        return panesBorderOptions;
    },

    _isLegendInside: function() {
        return this._legend && this._legend.getPosition() === "inside";
    },

    _renderAxes: function(drawOptions, panesBorderOptions, rotated) {
        if(drawOptions && drawOptions.recreateCanvas) {
            vizUtils.updatePanesCanvases(this.panes, this._canvas, rotated);
        }

        this._drawAxes(drawOptions, panesBorderOptions);
    },

    _isRotated: function() {
        return this._themeManager.getOptions("rotated");
    },

    _getLayoutTargets: function() {
        return this.panes;
    },

    _applyClipRects: function(panesBorderOptions) {
        var that = this,
            canvasClipRectID = that._getCanvasClipRectID(),
            i;
        that._drawPanesBorders(panesBorderOptions);
        that._createClipRectsForPanes();
        for(i = 0; i < that._argumentAxes.length; i++) {
            that._argumentAxes[i].applyClipRects(that._getElementsClipRectID(that._argumentAxes[i].pane), canvasClipRectID);
        }
        for(i = 0; i < that._valueAxes.length; i++) {
            that._valueAxes[i].applyClipRects(that._getElementsClipRectID(that._valueAxes[i].pane), canvasClipRectID);
        }
        that._fillPanesBackground();
    },

    _updateLegendPosition: function(drawOptions, legendHasInsidePosition) {
        var that = this;
        if(drawOptions.drawLegend && that._legend && legendHasInsidePosition) {
            var panes = that.panes,
                newCanvas = _extend({}, panes[0].canvas),
                layoutManager = new LayoutManagerModule.LayoutManager();

            newCanvas.right = panes[panes.length - 1].canvas.right;
            newCanvas.bottom = panes[panes.length - 1].canvas.bottom;
            layoutManager.setOptions({ width: 0, height: 0 });
            layoutManager.layoutElements(
                [that._legend],
                newCanvas,
                commonUtils.noop,
                [{ canvas: newCanvas }],
                undefined
            );
        }
    },

    _applyExtraSettings: function(series) {
        var that = this,
            paneIndex = that._getPaneIndex(series.pane),
            panesClipRects = that._panesClipRects,
            wideClipRect = panesClipRects.wide[paneIndex];
        series.setClippingParams(panesClipRects.base[paneIndex].id, wideClipRect && wideClipRect.id, that._getPaneBorderVisibility(paneIndex));
    },

    _updatePanesCanvases: function(drawOptions) {
        if(!drawOptions.recreateCanvas) {
            return;
        }

        vizUtils.updatePanesCanvases(this.panes, this._canvas, this._isRotated());
    },

    _restoreOriginalBusinessRange: function() {
        this._argumentAxes.concat(this._valueAxes).forEach(function(axis) {
            axis.restoreBusinessRange();
        });
    },

    _prepareAxesAndDraw: function(drawOptions, panesBorderOptions) {
        var that = this,
            rotated = that._isRotated(),
            synchronizeMultiAxes = that._themeManager.getOptions("synchronizeMultiAxes"),
            extendedArgAxes = (that._scrollBar ? [that._scrollBar] : []).concat(that._argumentAxes),
            verticalAxes = rotated ? extendedArgAxes : that._valueAxes,
            horizontalAxes = rotated ? that._valueAxes : extendedArgAxes,
            allAxes = verticalAxes.concat(horizontalAxes);

        var panesCanvases = that.panes.reduce(function(canvases, pane) {
            canvases[pane.name] = _extend({}, pane.canvas);
            return canvases;
        }, {});


        if(!drawOptions.adjustAxes) {
            drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
            drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
            return;
        }

        if(that._scrollBar) {
            that._scrollBar.setPane(that.panes);
        }

        var vAxesMargins = { panes: {} },
            hAxesMargins = getHorizontalAxesMargins(horizontalAxes, function(axis) { return axis.estimateMargins(panesCanvases[axis.pane]); });
        panesCanvases = shrinkCanvases(rotated, panesCanvases, vAxesMargins, hAxesMargins);

        drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
        vAxesMargins = getVerticalAxesMargins(verticalAxes);
        panesCanvases = shrinkCanvases(rotated, panesCanvases, vAxesMargins, hAxesMargins);

        drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
        hAxesMargins = getHorizontalAxesMargins(horizontalAxes, getAxisMargins);
        panesCanvases = shrinkCanvases(rotated, panesCanvases, vAxesMargins, hAxesMargins);

        performActionOnAxes(allAxes, "updateSize", panesCanvases);

        horizontalAxes.forEach(shiftAxis("top", "bottom"));
        verticalAxes.forEach(shiftAxis("left", "right"));

        that.panes.forEach(function(pane) {
            _extend(pane.canvas, panesCanvases[pane.name]);
        });
    },

    _shrinkAxes: function(drawOptions, sizeShortage) {
        var that = this,
            rotated = that._isRotated(),
            extendedArgAxes = (that._scrollBar ? [that._scrollBar] : []).concat(that._argumentAxes),
            verticalAxes = rotated ? extendedArgAxes : that._valueAxes,
            horizontalAxes = rotated ? that._valueAxes : extendedArgAxes,
            allAxes = verticalAxes.concat(horizontalAxes),
            panesCanvases;

        if(sizeShortage.width || sizeShortage.height) {
            panesCanvases = that.panes.reduce(function(canvases, pane) {
                canvases[pane.name] = _extend({}, pane.canvas);
                return canvases;
            }, {});

            checkUsedSpace(sizeShortage, "height", horizontalAxes, getHorizontalAxesMargins);
            checkUsedSpace(sizeShortage, "width", verticalAxes, getVerticalAxesMargins);

            panesCanvases = shrinkCanvases(rotated, panesCanvases, getVerticalAxesMargins(verticalAxes), getHorizontalAxesMargins(horizontalAxes, getAxisMargins));
            performActionOnAxes(allAxes, "updateSize", panesCanvases);
            horizontalAxes.forEach(shiftAxis("top", "bottom"));
            verticalAxes.forEach(shiftAxis("left", "right"));

            that.panes.forEach(function(pane) {
                $.extend(pane.canvas, panesCanvases[pane.name]);
            });
        }
    },

    _getPanesParameters: function() {
        var that = this,
            panes = that.panes,
            i,
            params = [];
        for(i = 0; i < panes.length; i++) {
            if(that._getPaneBorderVisibility(i)) {
                params.push({ coords: panes[i].borderCoords, clipRect: that._panesClipRects.fixed[i] });
            }
        }
        return params;
    },

    _createCrosshairCursor: function() {
        var that = this,
            options = that._themeManager.getOptions("crosshair") || {},
            index = that._displayedArgumentAxisIndex,
            axes = !that._isRotated() ? [[that._argumentAxes[index]], that._valueAxes] : [that._valueAxes, [that._argumentAxes[index]]],
            parameters = { canvas: that._getCommonCanvas(), panes: that._getPanesParameters(), axes: axes };

        if(!options || !options.enabled) {
            return;
        }
        if(!that._crosshair) {
            that._crosshair = new crosshairModule.Crosshair(that._renderer, options, parameters, that._crosshairCursorGroup);
        } else {
            that._crosshair.update(options, parameters);
        }
        that._crosshair.render();
    },

    _getCommonCanvas: function() {
        var i,
            canvas,
            commonCanvas,
            panes = this.panes;

        for(i = 0; i < panes.length; i++) {
            canvas = panes[i].canvas;
            if(!commonCanvas) { //TODO
                commonCanvas = _extend({}, canvas);
            } else {
                commonCanvas.right = canvas.right;
                commonCanvas.bottom = canvas.bottom;
            }
        }
        return commonCanvas;
    },

    _createPanesBackground: function() {
        var that = this,
            defaultBackgroundColor = that._themeManager.getOptions("commonPaneSettings").backgroundColor,
            backgroundColor,
            renderer = that._renderer,
            rect,
            i,
            rects = [];
        that._panesBackgroundGroup.clear();

        for(i = 0; i < that.panes.length; i++) {
            backgroundColor = that.panes[i].backgroundColor || defaultBackgroundColor;
            if(!backgroundColor || backgroundColor === "none") {
                rects.push(null);
                continue;
            }
            rect = renderer.rect(0, 0, 0, 0).attr({
                fill: backgroundColor,
                "stroke-width": 0
            }).append(that._panesBackgroundGroup);
            rects.push(rect);
        }
        that.panesBackground = rects;
    },

    _fillPanesBackground: function() {
        var that = this,
            bc;

        _each(that.panes, function(i, pane) {
            bc = pane.borderCoords;

            if(that.panesBackground[i] !== null) {
                that.panesBackground[i].attr({ x: bc.left, y: bc.top, width: bc.width, height: bc.height });
            }
        });
    },

    _calcPaneBorderCoords: function(pane) {
        var canvas = pane.canvas,
            bc = pane.borderCoords = pane.borderCoords || {};

        bc.left = canvas.left;
        bc.top = canvas.top;
        bc.right = canvas.width - canvas.right;
        bc.bottom = canvas.height - canvas.bottom;
        bc.width = Math.max(bc.right - bc.left, 0);
        bc.height = Math.max(bc.bottom - bc.top, 0);
    },

    _drawPanesBorders: function(panesBorderOptions) {
        var that = this,
            rotated = that._isRotated();

        that._panesBorderGroup.linkRemove().clear();

        _each(that.panes, function(i, pane) {
            var bc,
                borderOptions = panesBorderOptions[pane.name],
                segmentRectParams,
                attr = {
                    fill: "none",
                    stroke: borderOptions.color,
                    "stroke-opacity": borderOptions.opacity,
                    "stroke-width": borderOptions.width,
                    dashStyle: borderOptions.dashStyle,
                    "stroke-linecap": "square"
                };

            that._calcPaneBorderCoords(pane, rotated);

            if(!borderOptions.visible) {
                return;
            }
            bc = pane.borderCoords;

            segmentRectParams = prepareSegmentRectPoints(bc.left, bc.top, bc.width, bc.height, borderOptions);
            that._renderer.path(segmentRectParams.points, segmentRectParams.pathType).attr(attr).append(that._panesBorderGroup);
        });

        that._panesBorderGroup.linkAppend();
    },

    _createClipRect: function(clipArray, index, left, top, width, height) {
        var that = this,
            clipRect = clipArray[index];

        if(!clipRect) {
            clipRect = that._renderer.clipRect(left, top, width, height);
            clipArray[index] = clipRect;
        } else {
            clipRect.attr({ x: left, y: top, width: width, height: height });
        }
    },

    _createClipRectsForPanes: function() {
        var that = this,
            canvas = that._canvas;

        _each(that.panes, function(i, pane) {
            var needWideClipRect = false,
                bc = pane.borderCoords,
                left = bc.left,
                top = bc.top,
                width = bc.width,
                height = bc.height,
                panesClipRects = that._panesClipRects;

            that._createClipRect(panesClipRects.fixed, i, left, top, width, height);
            that._createClipRect(panesClipRects.base, i, left, top, width, height);

            _each(that.series, function(_, series) {
                if(series.pane === pane.name && (series.isFinancialSeries() || series.areErrorBarsVisible())) {
                    needWideClipRect = true;
                }
            });

            if(needWideClipRect) {
                if(that._isRotated()) {
                    top = 0;
                    height = canvas.height;
                } else {
                    left = 0;
                    width = canvas.width;
                }
                that._createClipRect(panesClipRects.wide, i, left, top, width, height);
            } else {
                panesClipRects.wide[i] = null;
            }
        });
    },

    _getPaneIndex: function(paneName) {
        var paneIndex;

        _each(this.panes, function(index, pane) {
            if(pane.name === paneName) {
                paneIndex = index;
                return false;
            }
        });
        return paneIndex;
    },

    _getPaneBorderVisibility: function(paneIndex) {
        var commonPaneBorderVisible = this._themeManager.getOptions("commonPaneSettings").border.visible,
            pane = this.panes[paneIndex] || {},
            paneBorder = pane.border || {};

        return "visible" in paneBorder ? paneBorder.visible : commonPaneBorderVisible;
    },

    _getElementsClipRectID: function(paneName) {
        return this._panesClipRects.fixed[this._getPaneIndex(paneName)].id;
    },

    _getCanvasForPane: function(paneName) {
        var panes = this.panes,
            panesNumber = panes.length,
            i;

        for(i = 0; i < panesNumber; i++) {
            if(panes[i].name === paneName) {
                return panes[i].canvas;
            }
        }
    },

    _getBusinessRange: function(paneName, axisName) {
        var ranges = this.businessRanges || [],
            rangesNumber = ranges.length,
            foundRange,
            i;

        for(i = 0; i < rangesNumber; i++) {
            if(ranges[i].val.pane === paneName && ranges[i].val.axis === axisName) {
                foundRange = ranges[i];
                break;
            }
        }
        if(!foundRange) {
            for(i = 0; i < rangesNumber; i++) {
                if(ranges[i].val.pane === paneName) {
                    foundRange = ranges[i];
                    break;
                }
            }
        }
        return foundRange;
    },

    _transformArgument: function(translate, scale) {
        var that = this,
            rotated = that._isRotated(),
            settings,
            clipSettings,
            panesClipRects = that._panesClipRects;
        if(!that._transformed) {
            that._transformed = true;
            that._labelsGroup.remove();
            that._resetIsReady();
            _each(that.series || [], function(i, s) {
                s.applyClip();
            });
        }

        if(rotated) {
            settings = {
                translateY: translate,
                scaleY: scale
            };
            clipSettings = {
                translateY: -translate / scale,
                scaleY: 1 / scale
            };
        } else {
            settings = {
                translateX: translate,
                scaleX: scale
            };
            clipSettings = {
                translateX: -translate / scale,
                scaleX: 1 / scale
            };
        }

        applyClipSettings(panesClipRects.base, clipSettings);
        applyClipSettings(panesClipRects.wide, clipSettings);

        that._seriesGroup.attr(settings);
        that._scrollBar && that._scrollBar.transform(-translate, scale);
    },

    _resetTransform: function() {
        var that = this,
            settings = {
                translateX: 0,
                translateY: 0,
                scaleX: null,
                scaleY: null
            },
            panesClipRects = that._panesClipRects;

        applyClipSettings(panesClipRects.base, settings);
        applyClipSettings(panesClipRects.wide, settings);

        that._seriesGroup.attr(settings);
        _each(that.series || [], function(i, s) {
            s.resetClip();
        });
        that._transformed = false;
    },

    _getTrackerSettings: function() {
        var that = this,
            themeManager = that._themeManager;
        return _extend(this.callBase(), {
            chart: that,
            zoomingMode: themeManager.getOptions("zoomingMode"),
            scrollingMode: themeManager.getOptions("scrollingMode"),
            rotated: that._isRotated(),
            crosshair: that._getCrosshairOptions().enabled ? that._crosshair : null
        });
    },

    _resolveLabelOverlappingStack: function() {
        var that = this,
            isRotated = that._isRotated(),
            shiftDirection = isRotated ? function(box, length) { return { x: box.x - length, y: box.y }; } : function(box, length) { return { x: box.x, y: box.y - length }; };

        _each(that._getStackPoints(), function(_, stacks) {
            _each(stacks, function(_, points) {
                overlapping.resolveLabelOverlappingInOneDirection(points, that._getCommonCanvas(), isRotated, shiftDirection);
            });
        });
    },

    _getStackPoints: function() {
        var stackPoints = {},
            visibleSeries = this._getVisibleSeries();

        _each(visibleSeries, function(_, singleSeries) {
            var points = singleSeries.getPoints(),
                stackName = singleSeries.getStackName() || null;

            _each(points, function(_, point) {
                var argument = point.argument;

                if(!stackPoints[argument]) {
                    stackPoints[argument] = {};
                }
                if(!stackPoints[argument][stackName]) {
                    stackPoints[argument][stackName] = [];
                }
                stackPoints[argument][stackName].push(point);
            });
        });

        return stackPoints;
    },

    _getCrosshairOptions: function() {
        return this._getOption("crosshair");
    },

    //API
    zoomArgument: function(min, max, gesturesUsed) {
        var that = this,
            bounds,
            zoomArg;

        if(!_isDefined(min) && !_isDefined(max)) {
            return;
        }

        if(!gesturesUsed) {
            that._eventTrigger("zoomStart");
        }

        zoomArg = that._argumentAxes[0].zoom(min, max, gesturesUsed);
        that._zoomMinArg = zoomArg.min;
        that._zoomMaxArg = zoomArg.max;
        that._notApplyMargins = gesturesUsed; //TODO

        that._doRender({
            force: true,
            drawTitle: false,
            drawLegend: false,
            adjustAxes: false,
            animate: false
        });
        bounds = that.getVisibleArgumentBounds();
        that._eventTrigger("zoomEnd", { rangeStart: bounds.minVisible, rangeEnd: bounds.maxVisible });
    },

    _resetZoom: function() {
        var that = this;
        that._zoomMinArg = that._zoomMaxArg = that._notApplyMargins = undefined; //T190927
        that._argumentAxes[0] && that._argumentAxes[0].resetZoom();
    },

    //T218011 for dashboards
    getVisibleArgumentBounds: function() {
        var translator = this._argumentAxes[0].getTranslator(),
            range = translator.getBusinessRange(),
            isDiscrete = range.axisType === "discrete",
            categories = range.categories;

        return {
            minVisible: isDiscrete ? (range.minVisible || categories[0]) : range.minVisible,
            maxVisible: isDiscrete ? (range.maxVisible || categories[categories.length - 1]) : range.maxVisible
        };
    }
});

dxChart.addPlugin(require("./chart_components/shutter_zoom"));

registerComponent("dxChart", dxChart);
module.exports = dxChart;

///#DEBUG
module.exports._test_prepareSegmentRectPoints = function() {
    var original = prepareSegmentRectPoints.original || prepareSegmentRectPoints;
    if(arguments[0]) {
        prepareSegmentRectPoints = arguments[0];
    }
    prepareSegmentRectPoints.original = original;
    prepareSegmentRectPoints.restore = function() { prepareSegmentRectPoints = original; };
    return prepareSegmentRectPoints;
};
///#ENDDEBUG
