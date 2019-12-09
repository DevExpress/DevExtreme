import { noop } from "../core/utils/common";
import { extend as _extend } from "../core/utils/extend";
import { inArray } from "../core/utils/array";
import { each as _each } from "../core/utils/iterator";
import registerComponent from "../core/component_registrator";
import {
    map as _map, getLog, getCategoriesInfo,
    updatePanesCanvases, convertVisualRangeObject, PANE_PADDING,
    normalizePanesHeight,
    checkElementHasPropertyFromStyleSheet,
    rangesAreEqual
} from "./core/utils";
import { type } from "../core/utils/type";
import { getPrecision } from "../core/utils/math";
import { overlapping } from "./chart_components/base_chart";
import LayoutManagerModule from "./chart_components/layout_manager";
import multiAxesSynchronizer from "./chart_components/multi_axes_synchronizer";
import { AdvancedChart } from "./chart_components/advanced_chart";
import scrollBarModule from "./chart_components/scroll_bar";
import crosshairModule from "./chart_components/crosshair";
import rangeCalculator from "./series/helpers/range_data_calculator";
import rangeModule from "./translators/range";
const DEFAULT_PANE_NAME = "default";
const VISUAL_RANGE = "VISUAL_RANGE";
const DEFAULT_PANES = [{
    name: DEFAULT_PANE_NAME,
    border: {}
}];

const _isArray = Array.isArray;
import { isDefined as _isDefined } from "../core/utils/type";

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

function changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility) {
    var gridOpt = axis.getOptions().grid,
        minorGridOpt = axis.getOptions().minorGrid;

    gridOpt.visible = gridVisibility;
    minorGridOpt && (minorGridOpt.visible = minorGridVisibility);
}

function hideGridsOnNonFirstValueAxisForPane(axesForPane) {
    var axisShown = false,
        hiddenStubAxis = [],
        minorGridVisibility = axesForPane.some(function(axis) {
            var minorGridOptions = axis.getOptions().minorGrid;
            return minorGridOptions && minorGridOptions.visible;
        }),
        gridVisibility = axesForPane.some(function(axis) {
            var gridOptions = axis.getOptions().grid;
            return gridOptions && gridOptions.visible;
        });

    if(axesForPane.length > 1) {
        axesForPane.forEach(function(axis) {
            var gridOpt = axis.getOptions().grid;

            if(axisShown) {
                changeVisibilityAxisGrids(axis, false, false);
            } else if(gridOpt && gridOpt.visible) {
                if(axis.getTranslator().getBusinessRange().isEmpty()) {
                    changeVisibilityAxisGrids(axis, false, false);
                    hiddenStubAxis.push(axis);
                } else {
                    axisShown = true;
                    changeVisibilityAxisGrids(axis, gridVisibility, minorGridVisibility);
                }
            }
        });

        !axisShown && hiddenStubAxis.length && changeVisibilityAxisGrids(hiddenStubAxis[0], gridVisibility, minorGridVisibility);
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

function compareAxes(a, b) {
    return a.priority - b.priority;
}

// checks if pane with provided name exists in this panes array
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

// 'var' because JSHint throws W021 error
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

// utilities used in axes rendering
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

function performActionOnAxes(axes, action, actionArgument1, actionArgument2, actionArgument3) {
    axes.forEach(function(axis) {
        axis[action](actionArgument1 && actionArgument1[axis.pane], actionArgument2 && actionArgument2[axis.pane] || actionArgument2, actionArgument3);
    });
}

function shrinkCanvases(isRotated, canvases, sizes, verticalMargins, horizontalMargins) {
    function getMargin(side, margins, pane) {
        var m = (isRotated ? ["left", "right"] : ["top", "bottom"]).indexOf(side) === -1 ? margins : (margins.panes[pane] || {});
        return m[side];
    }

    function getMaxMargin(side, margins1, margins2, pane) {
        return pickMaxValue(getMargin(side, margins1, pane), getMargin(side, margins2, pane));
    }

    const getOriginalField = field => `original${field[0].toUpperCase()}${field.slice(1)}`;

    function shrink(canvases, paneNames, sizeField, startMargin, endMargin, oppositeMargins) {
        paneNames = paneNames.sort((p1, p2) => canvases[p2][startMargin] - canvases[p1][startMargin]);
        paneNames.forEach(pane => {
            const canvas = canvases[pane];
            oppositeMargins.forEach(margin => {
                canvas[margin] = canvas[getOriginalField(margin)] + getMaxMargin(margin, verticalMargins, horizontalMargins, pane);
            });
        });

        const firstPane = canvases[paneNames[0]];

        let emptySpace = paneNames.reduce((space, paneName) => {
            space -= getMaxMargin(startMargin, verticalMargins, horizontalMargins, paneName) + getMaxMargin(endMargin, verticalMargins, horizontalMargins, paneName);
            return space;
        }, firstPane[sizeField] - firstPane[getOriginalField(endMargin)] - canvases[paneNames[paneNames.length - 1]][getOriginalField(startMargin)]) - PANE_PADDING * (paneNames.length - 1);

        const totalCustomSpace = Object.keys(sizes).reduce((prev, key) => prev + (sizes[key].unit ? sizes[key].height : 0), 0);
        emptySpace -= totalCustomSpace;

        paneNames.reduce((offset, pane) => {
            const canvas = canvases[pane];
            const paneSize = sizes[pane];

            offset -= getMaxMargin(endMargin, verticalMargins, horizontalMargins, pane);
            canvas[endMargin] = firstPane[sizeField] - offset;
            offset -= paneSize.unit ? paneSize.height : Math.floor(emptySpace * paneSize.height);
            canvas[startMargin] = offset;
            offset -= getMaxMargin(startMargin, verticalMargins, horizontalMargins, pane) + PANE_PADDING;

            return offset;
        }, firstPane[sizeField] - firstPane[getOriginalField(endMargin)] - (emptySpace < 0 ? emptySpace : 0));
    }

    const paneNames = Object.keys(canvases);
    if(!isRotated) {
        shrink(canvases, paneNames, "height", "top", "bottom", ["left", "right"]);
    } else {
        shrink(canvases, paneNames, "width", "left", "right", ["top", "bottom"]);
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

function axisAnimationEnabled(drawOptions, series) {
    const pointsCount = series.reduce((sum, s) => sum += s.getPoints().length, 0) / series.length;

    return drawOptions.animate && pointsCount <= drawOptions.animationPointsLimit;
}

// utilities used in axes rendering

var dxChart = AdvancedChart.inherit({
    _themeSection: "chart",

    _fontFields: ["crosshair.label.font" ],

    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        _extend(this._deprecatedOptions, {
            "useAggregation": { since: "18.1", message: "Use the 'commonSeriesSettings.aggregation.enabled' or 'series.aggregation.enabled' option instead" },
            "argumentAxis.min": { since: "18.2", message: "Use the 'argumentAxis.visualRange' option instead" },
            "argumentAxis.max": { since: "18.2", message: "Use the 'argumentAxis.visualRange' option instead" },
            "valueAxis.min": { since: "18.2", message: "Use the 'valueAxis.visualRange' option instead" },
            "valueAxis.max": { since: "18.2", message: "Use the 'valueAxis.visualRange' option instead" },
            "zoomingMode": { since: "18.2", message: "Use the 'zoomAndPan' option instead" },
            "scrollingMode": { since: "18.2", message: "Use the 'zoomAndPan' option instead" }
        });
    },

    _initCore: function() {
        this.paneAxis = {};
        this.callBase();
    },

    _correctAxes: function() {
        this._correctValueAxes(true);
    },

    _getExtraOptions: noop,

    _createPanes: function() {
        var that = this,
            panes = that.option("panes"),
            panesNameCounter = 0,
            defaultPane;

        if(!panes || (_isArray(panes) && !panes.length)) {
            panes = DEFAULT_PANES;
        }

        that.callBase();

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
        return {
            isHorizontal: (typeSelector === "argumentAxis") !== rotated,
            containerColor: this._themeManager.getOptions("containerBackgroundColor")
        };
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
            rotated = that._isRotated(),
            crosshairMargins = that._getCrosshairMargins(),
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
            axis = that._createAxis(false, that._populateAxesOptions("valueAxis", axisOptions, {
                pane: paneName,
                name: axisName,
                optionPath: _isArray(valueAxisOptions) ? `valueAxis[${axisOptions.priority}]` : "valueAxis",
                crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x
            }, rotated));
            axis.applyVisualRangeSetter(that._getVisualRangeSetter());
            valueAxes.push(axis);
        }

        axis.setPane(paneName);

        return axis;
    },

    _correctValueAxes: function(needHideGrids) {
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
                that._getValueAxis(paneName); // creates an value axis if there is no one for pane
            }
            if(needHideGrids && synchronizeMultiAxes) {
                hideGridsOnNonFirstValueAxisForPane(valueAxes.filter(function(axis) {
                    return axis.pane === paneName;
                }));
            }
        });

        that._valueAxes = valueAxes.filter(function(axis) {
            if(!axis.pane) {
                axis.setPane(that.defaultPane);
            }
            return doesPaneExist(that.panes, axis.pane);
        }).sort(compareAxes);

        const defaultAxis = this.getValueAxis();

        that._valueAxes.forEach(axis => {
            const optionPath = axis.getOptions().optionPath;
            if(optionPath) {
                const axesWithSamePath = that._valueAxes.filter(a => a.getOptions().optionPath === optionPath);
                if(axesWithSamePath.length > 1) {
                    if(axesWithSamePath.some(a => a === defaultAxis)) {
                        axesWithSamePath.forEach(a => {
                            if(a !== defaultAxis) {
                                a.getOptions().optionPath = null;
                            }
                        });
                    } else {
                        axesWithSamePath.forEach((a, i) => {
                            if(i !== 0) {
                                a.getOptions().optionPath = null;
                            }
                        });
                    }
                }
            }
        });
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
        this.panes.forEach(pane => panesBorderOptions[pane.name] = _extend(true, {}, commonBorderOptions, pane.border));
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

    _prepareToRender(drawOptions) {
        const panesBorderOptions = this._createPanesBorderOptions();

        this._createPanesBackground();
        this._appendAxesGroups();

        this._adjustViewport();

        return panesBorderOptions;
    },

    _adjustViewport() {
        const that = this;
        const series = that._getVisibleSeries();
        const argumentAxis = that.getArgumentAxis();
        const useAggregation = series.some(s => s.useAggregation());
        const adjustOnZoom = that._themeManager.getOptions("adjustOnZoom");
        const alignToBounds = !argumentAxis.dataVisualRangeIsReduced();

        if(!useAggregation && !adjustOnZoom) {
            return;
        }

        that._valueAxes.forEach(axis => axis.adjust(alignToBounds));
    },

    _recreateSizeDependentObjects(isCanvasChanged) {
        const that = this,
            series = that._getVisibleSeries(),
            useAggregation = series.some(s => s.useAggregation()),
            zoomChanged = that._isZooming();

        if(!useAggregation) {
            return;
        }

        that._argumentAxes.forEach(function(axis) {
            axis.updateCanvas(that._canvas);
        });
        series.forEach(function(series) {
            if(series.useAggregation() && (isCanvasChanged || zoomChanged || !series._useAllAggregatedPoints)) {
                series.createPoints();
            }
        });
        that._processSeriesFamilies();
    },

    _isZooming() {
        const that = this;
        const argumentAxis = that.getArgumentAxis();

        if(!argumentAxis || !argumentAxis.getTranslator()) {
            return false;
        }

        const businessRange = argumentAxis.getTranslator().getBusinessRange();
        const zoomRange = argumentAxis.getViewport();
        let min = zoomRange ? zoomRange.min : 0;
        let max = zoomRange ? zoomRange.max : 0;

        if(businessRange.axisType === "logarithmic") {
            min = getLog(min, businessRange.base);
            max = getLog(max, businessRange.base);
        }
        const viewportDistance = businessRange.axisType === "discrete" ? getCategoriesInfo(businessRange.categories, min, max).categories.length : Math.abs(max - min);
        let precision = getPrecision(viewportDistance);
        precision = precision > 1 ? Math.pow(10, precision - 2) : 1;
        const zoomChanged = Math.round((that._zoomLength - viewportDistance) * precision) / precision !== 0;
        that._zoomLength = viewportDistance;

        return zoomChanged;
    },

    _handleSeriesDataUpdated: function() {
        var that = this,
            viewport = new rangeModule.Range();

        that.series.forEach(function(s) {
            viewport.addRange(s.getArgumentRange());
        });

        that._argumentAxes.forEach(function(axis) {
            axis.updateCanvas(that._canvas);
            axis.setBusinessRange(viewport, that._axesReinitialized);
        });

        that.callBase();
    },

    _isLegendInside: function() {
        return this._legend && this._legend.getPosition() === "inside";
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
                noop,
                [{ canvas: newCanvas }],
                undefined
            );
        }
    },

    _allowLegendInsidePosition() {
        return true;
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

        updatePanesCanvases(this.panes, this._canvas, this._isRotated());
    },

    _normalizePanesHeight: function() {
        normalizePanesHeight(this.panes);
    },

    _renderScaleBreaks: function() {
        this._valueAxes.concat(this._argumentAxes).forEach(function(axis) {
            axis.drawScaleBreaks();
        });
    },

    _applyPointMarkersAutoHiding() {
        const that = this;
        if(!that._themeManager.getOptions("autoHidePointMarkers")) {
            that.series.forEach(s => s.autoHidePointMarkers = false);
            return;
        }

        that.panes.forEach(pane => {
            const series = that.series.filter(s => s.pane === pane.name && s.usePointsToDefineAutoHiding());
            const argAxis = that.getArgumentAxis();
            const argVisualRange = argAxis.visualRange();
            const argTranslator = argAxis.getTranslator();
            const argAxisType = argAxis.getOptions().type;
            const argViewPortFilter = rangeCalculator.getViewPortFilter(argVisualRange || {});
            let points = [];
            const overloadedSeries = {};

            series.forEach(s => {
                const valAxis = s.getValueAxis();
                const valVisualRange = valAxis.visualRange();
                const valTranslator = valAxis.getTranslator();
                const seriesIndex = that.series.indexOf(s);
                const valViewPortFilter = rangeCalculator.getViewPortFilter(valVisualRange || {});

                overloadedSeries[seriesIndex] = {};
                series.forEach(sr => overloadedSeries[seriesIndex][that.series.indexOf(sr)] = 0);
                const seriesPoints = [];

                s.getPoints().filter(p => {
                    return p.getOptions().visible && argViewPortFilter(p.argument) &&
                        (valViewPortFilter(p.getMinValue(true)) || valViewPortFilter(p.getMaxValue(true)));
                }).forEach(p => {
                    const tp = {
                        seriesIndex: seriesIndex,
                        argument: p.argument,
                        value: p.getMaxValue(true),
                        size: p.bubbleSize || p.getOptions().size
                    };
                    if(p.getMinValue(true) !== p.getMaxValue(true)) {
                        const mp = _extend({}, tp);
                        mp.value = p.getMinValue(true);
                        mp.x = argTranslator.to(mp.argument, 1);
                        mp.y = valTranslator.to(mp.value, 1);
                        seriesPoints.push(mp);
                    }
                    tp.x = argTranslator.to(tp.argument, 1);
                    tp.y = valTranslator.to(tp.value, 1);
                    seriesPoints.push(tp);
                });

                overloadedSeries[seriesIndex].pointsCount = seriesPoints.length;
                overloadedSeries[seriesIndex].total = 0;
                overloadedSeries[seriesIndex].continuousSeries = 0;
                points = points.concat(seriesPoints);
            });

            const sortingCallback = argAxisType === "discrete" ?
                (p1, p2) => argVisualRange.categories.indexOf(p1.argument) - argVisualRange.categories.indexOf(p2.argument) :
                (p1, p2) => p1.argument - p2.argument;
            points.sort(sortingCallback);


            let isContinuousSeries = false;
            for(let i = 0; i < points.length - 1; i++) {
                const curPoint = points[i];
                const size = curPoint.size;
                if(_isDefined(curPoint.x) && _isDefined(curPoint.y)) {
                    for(let j = i + 1; j < points.length; j++) {
                        const nextPoint = points[j];
                        let next_x = _isDefined(nextPoint) ? nextPoint.x : null;
                        let next_y = _isDefined(nextPoint) ? nextPoint.y : null;

                        if(!_isDefined(next_x) || Math.abs(curPoint.x - next_x) >= size) {
                            isContinuousSeries &= j !== i + 1;
                            break;
                        } else {
                            const distance = _isDefined(next_x) && _isDefined(next_y) && Math.sqrt(Math.pow(curPoint.x - next_x, 2) + Math.pow(curPoint.y - next_y, 2));
                            if(distance && distance < size) {
                                overloadedSeries[curPoint.seriesIndex][nextPoint.seriesIndex]++;
                                overloadedSeries[curPoint.seriesIndex].total++;
                                if(!isContinuousSeries) {
                                    overloadedSeries[curPoint.seriesIndex].continuousSeries++;
                                    isContinuousSeries = true;
                                }
                            }
                        }
                    }
                }
            }

            series.forEach(s => {
                const seriesIndex = that.series.indexOf(s);
                s.autoHidePointMarkers = false;
                const tickCount = argAxis.getTicksValues().majorTicksValues.length;
                if(s.autoHidePointMarkersEnabled() && (argAxisType === "discrete" || overloadedSeries[seriesIndex].pointsCount > tickCount)) {
                    for(let index in overloadedSeries[seriesIndex]) {
                        const i = parseInt(index);
                        if(isNaN(i) || overloadedSeries[seriesIndex].total / overloadedSeries[seriesIndex].continuousSeries < 3) {
                            continue;
                        }
                        if(i === seriesIndex) {
                            if(overloadedSeries[i][i] * 2 >= overloadedSeries[i].pointsCount) {
                                s.autoHidePointMarkers = true;
                                break;
                            }
                        } else if(overloadedSeries[seriesIndex].total >= overloadedSeries[seriesIndex].pointsCount) {
                            s.autoHidePointMarkers = true;
                            break;
                        }
                    }
                }
            });
        });
    },

    _renderAxes: function(drawOptions, panesBorderOptions) {
        function calculateTitlesWidth(axes) {
            return axes.map(axis => {
                if(!axis.getTitle) return 0;

                const title = axis.getTitle();
                return title ? title.bBox.width : 0;
            });
        }
        var that = this,
            rotated = that._isRotated(),
            synchronizeMultiAxes = that._themeManager.getOptions("synchronizeMultiAxes"),
            extendedArgAxes = (that._scrollBar ? [that._scrollBar] : []).concat(that._argumentAxes),
            verticalAxes = rotated ? extendedArgAxes : that._valueAxes,
            horizontalAxes = rotated ? that._valueAxes : extendedArgAxes,
            allAxes = verticalAxes.concat(horizontalAxes);

        that._normalizePanesHeight();
        that._updatePanesCanvases(drawOptions);

        var panesCanvases = that.panes.reduce(function(canvases, pane) {
                canvases[pane.name] = _extend({}, pane.canvas);
                return canvases;
            }, {}),
            paneSizes = that.panes.reduce((sizes, pane) => {
                sizes[pane.name] = {
                    height: pane.height,
                    unit: pane.unit
                };
                return sizes;
            }, {}),
            cleanPanesCanvases = _extend(true, {}, panesCanvases);

        if(!drawOptions.adjustAxes) {
            drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
            drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
            performActionOnAxes(allAxes, "prepareAnimation");
            that._renderScaleBreaks();
            return false;
        }

        if(that._scrollBar) {
            that._scrollBar.setPane(that.panes);
        }

        var vAxesMargins = { panes: {} },
            hAxesMargins = getHorizontalAxesMargins(horizontalAxes, axis => axis.estimateMargins(panesCanvases[axis.pane]));
        panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);

        drawAxesWithTicks(verticalAxes, !rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
        vAxesMargins = getVerticalAxesMargins(verticalAxes);
        panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);

        drawAxesWithTicks(horizontalAxes, rotated && synchronizeMultiAxes, panesCanvases, panesBorderOptions);
        hAxesMargins = getHorizontalAxesMargins(horizontalAxes, getAxisMargins);
        panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);

        let oldTitlesWidth = calculateTitlesWidth(verticalAxes);

        performActionOnAxes(allAxes, "updateSize", panesCanvases, axisAnimationEnabled(drawOptions, that._getVisibleSeries()));

        horizontalAxes.forEach(shiftAxis("top", "bottom"));
        verticalAxes.forEach(shiftAxis("left", "right"));

        that._renderScaleBreaks();

        that.panes.forEach(function(pane) {
            _extend(pane.canvas, panesCanvases[pane.name]);
        });

        that._valueAxes.forEach((axis) => {
            axis.setInitRange();
        });

        verticalAxes.forEach((axis, i) => {
            if(axis.hasWrap && axis.hasWrap()) {
                const title = axis.getTitle();
                const newTitleWidth = title ? title.bBox.width : 0;
                const offset = newTitleWidth - oldTitlesWidth[i];
                if(axis.getOptions().position === "right") {
                    vAxesMargins.right += offset;
                } else {
                    vAxesMargins.left += offset;
                    that.panes.forEach(({ name }) => vAxesMargins.panes[name].left += offset);
                }

                panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, vAxesMargins, hAxesMargins);

                performActionOnAxes(allAxes, "updateSize", panesCanvases, false, false);
                oldTitlesWidth = calculateTitlesWidth(verticalAxes);
            }
        });

        return cleanPanesCanvases;
    },

    checkForMoreSpaceForPanesCanvas() {
        const that = this;
        const rotated = that._isRotated();
        const panesAreCustomSized = that.panes.filter(p => p.unit).length === that.panes.length;
        let needSpace = false;

        if(panesAreCustomSized) {
            let needHorizontalSpace = 0;
            let needVerticalSpace = 0;

            if(rotated) {
                const argAxisRightMargin = that.getArgumentAxis().getMargins().right;
                const rightPanesIndent = Math.min.apply(Math, that.panes.map(p => p.canvas.right));
                needHorizontalSpace = that._canvas.right + argAxisRightMargin - rightPanesIndent;
            } else {
                const argAxisBottomMargin = that.getArgumentAxis().getMargins().bottom;
                const bottomPanesIndent = Math.min.apply(Math, that.panes.map(p => p.canvas.bottom));
                needVerticalSpace = that._canvas.bottom + argAxisBottomMargin - bottomPanesIndent;
            }

            needSpace = needHorizontalSpace > 0 || needVerticalSpace > 0 ? { width: needHorizontalSpace, height: needVerticalSpace } : false;
            if(needVerticalSpace !== 0) {
                const realSize = that.getSize();
                const customSize = that.option("size");
                const container = that._$element[0];
                const containerHasStyledHeight = !!container.style.height || checkElementHasPropertyFromStyleSheet(container, "height");

                if(!rotated && !(customSize && customSize.height) && !containerHasStyledHeight) {
                    that._forceResize(realSize.width, realSize.height + needVerticalSpace);
                    needSpace = false;
                }
            }
        } else {
            needSpace = that.layoutManager.needMoreSpaceForPanesCanvas(that._getLayoutTargets(), rotated, pane => {
                return { width: rotated && !!pane.unit, height: !rotated && !!pane.unit };
            });
        }

        return needSpace;
    },

    _forceResize(width, height) {
        this._renderer.resize(width, height);
        this._updateSize();
        this._setContentSize();
        this._preserveOriginalCanvas();
        this._updateCanvasClipRect(this._canvas);
    },

    _shrinkAxes(sizeShortage, panesCanvases) {
        if(!sizeShortage || !panesCanvases) {
            return;
        }
        this._renderer.stopAllAnimations(true);
        const that = this;
        const rotated = that._isRotated();
        const extendedArgAxes = (that._scrollBar ? [that._scrollBar] : []).concat(that._argumentAxes);
        const verticalAxes = rotated ? extendedArgAxes : that._valueAxes;
        const horizontalAxes = rotated ? that._valueAxes : extendedArgAxes;
        const allAxes = verticalAxes.concat(horizontalAxes);

        if(sizeShortage.width || sizeShortage.height) {
            checkUsedSpace(sizeShortage, "height", horizontalAxes, getHorizontalAxesMargins);
            checkUsedSpace(sizeShortage, "width", verticalAxes, getVerticalAxesMargins);

            performActionOnAxes(allAxes, "updateSize", panesCanvases);

            const paneSizes = that.panes.reduce((sizes, pane) => {
                sizes[pane.name] = {
                    height: pane.height,
                    unit: pane.unit
                };
                return sizes;
            }, {});

            panesCanvases = shrinkCanvases(rotated, panesCanvases, paneSizes, getVerticalAxesMargins(verticalAxes), getHorizontalAxesMargins(horizontalAxes, getAxisMargins));
            performActionOnAxes(allAxes, "updateSize", panesCanvases);
            horizontalAxes.forEach(shiftAxis("top", "bottom"));
            verticalAxes.forEach(shiftAxis("left", "right"));

            that.panes.forEach(pane => _extend(pane.canvas, panesCanvases[pane.name]));
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
            argumentAxis = that.getArgumentAxis(),
            axes = !that._isRotated() ? [[argumentAxis], that._valueAxes] : [that._valueAxes, [argumentAxis]],
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
            if(!commonCanvas) { // TODO
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

    _getPaneBorderVisibility: function(paneIndex) {
        var commonPaneBorderVisible = this._themeManager.getOptions("commonPaneSettings").border.visible,
            pane = this.panes[paneIndex] || {},
            paneBorder = pane.border || {};

        return "visible" in paneBorder ? paneBorder.visible : commonPaneBorderVisible;
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

    _getTrackerSettings: function() {
        var that = this,
            themeManager = that._themeManager;
        return _extend(this.callBase(), {
            chart: that,
            rotated: that._isRotated(),
            crosshair: that._getCrosshairOptions().enabled ? that._crosshair : null,
            stickyHovering: themeManager.getOptions("stickyHovering")
        });
    },

    _resolveLabelOverlappingStack: function() {
        var that = this,
            isRotated = that._isRotated(),
            shiftDirection = isRotated ? function(box, length) { return { x: box.x - length, y: box.y }; } : function(box, length) { return { x: box.x, y: box.y - length }; };

        _each(that._getStackPoints(), function(_, stacks) {
            _each(stacks, function(_, points) {
                overlapping.resolveLabelOverlappingInOneDirection(points, that._getCommonCanvas(), isRotated, shiftDirection, (a, b) => {
                    const coordPosition = isRotated ? 1 : 0;
                    const figureCenter1 = a.labels[0].getFigureCenter()[coordPosition];
                    const figureCenter12 = b.labels[0].getFigureCenter()[coordPosition];
                    if(figureCenter1 - figureCenter12 === 0) {
                        return (a.value() - b.value()) * (a.labels[0].getPoint().series.getValueAxis().getTranslator().isInverted() ? -1 : 1);
                    }
                    return 0;
                });
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

    // API
    zoomArgument(min, max) {
        const that = this;

        if(!that._initialized || !_isDefined(min) && !_isDefined(max)) {
            return;
        }

        that.getArgumentAxis().visualRange([min, max]);
    },

    resetVisualRange() {
        const that = this;
        const axes = that._argumentAxes;
        const nonVirtualArgumentAxis = that.getArgumentAxis();

        axes.forEach(axis => {
            axis.resetVisualRange(nonVirtualArgumentAxis !== axis);
            that._applyCustomVisualRangeOption(axis);
        });
        that.callBase();
    },

    // T218011 for dashboards
    getVisibleArgumentBounds: function() {
        var translator = this._argumentAxes[0].getTranslator(),
            range = translator.getBusinessRange(),
            isDiscrete = range.axisType === "discrete",
            categories = range.categories;

        return {
            minVisible: isDiscrete ? (range.minVisible || categories[0]) : range.minVisible,
            maxVisible: isDiscrete ? (range.maxVisible || categories[categories.length - 1]) : range.maxVisible
        };
    },

    _change_FULL_RENDER() {
        this.callBase();
        if(this._changes.has(VISUAL_RANGE)) {
            this._raiseZoomEndHandlers();
        }
    },

    _getAxesForScaling() {
        return [this.getArgumentAxis()].concat(this._valueAxes);
    },

    _applyVisualRangeByVirtualAxes(axis, range) {
        const that = this;
        if(axis.isArgumentAxis) {
            if(axis !== that.getArgumentAxis()) {
                return true;
            }
            that._argumentAxes.filter(a => a !== axis).forEach(a => a.visualRange(range, { start: true, end: true }));
        }
        return false;
    },

    _raiseZoomEndHandlers() {
        this._argumentAxes.forEach(axis => axis.handleZoomEnd());
        this.callBase();
    },

    _setOptionsByReference() {
        this.callBase();

        _extend(this._optionsByReference, {
            "argumentAxis.visualRange": true
        });
    },

    option() {
        const option = this.callBase.apply(this, arguments);
        const valueAxis = this._optionSilent("valueAxis");

        if(type(valueAxis) === "array") {
            for(let i = 0; i < valueAxis.length; i++) {
                const optionPath = `valueAxis[${i}].visualRange`;
                this._optionsByReference[optionPath] = true;
            }
        }

        return option;
    },

    _notifyVisualRange() {
        const that = this;
        const argAxis = that._argumentAxes[0];
        const argumentVisualRange =
            convertVisualRangeObject(argAxis.visualRange(), !_isArray(that.option("argumentAxis.visualRange")));

        if(!argAxis.skipEventRising || !rangesAreEqual(argumentVisualRange, that.option("argumentAxis.visualRange"))) {
            that.option("argumentAxis.visualRange", argumentVisualRange);
        } else {
            argAxis.skipEventRising = null;
        }

        that.callBase();
    }
});

dxChart.addPlugin(require("./chart_components/shutter_zoom"));
dxChart.addPlugin(require("./chart_components/zoom_and_pan"));
dxChart.addPlugin(require("./core/annotations").plugins.core);
dxChart.addPlugin(require("./core/annotations").plugins.chart);

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
