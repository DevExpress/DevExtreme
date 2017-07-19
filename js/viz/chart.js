"use strict";

var $ = require("../core/renderer"),
    commonUtils = require("../core/utils/common"),
    extend = require("../core/utils/extend").extend,
    inArray = require("../core/utils/array").inArray,
    registerComponent = require("../core/component_registrator"),
    vizUtils = require("./core/utils"),
    overlapping = require("./chart_components/base_chart").overlapping,
    translatorsModule = require("./translators/translator2d"),
    rangeModule = require("./translators/range"),
    LayoutManagerModule = require("./chart_components/layout_manager"),
    multiAxesSynchronizer = require("./chart_components/multi_axes_synchronizer"),
    AdvancedChart = require("./chart_components/advanced_chart").AdvancedChart,
    scrollBarModule = require("./chart_components/scroll_bar"),
    crosshairModule = require("./chart_components/crosshair"),
    MAX_ADJUSTMENT_ATTEMPTS = 5,
    DEFAULT_PANE_NAME = "default",
    DEFAULT_PANES = [{
        name: DEFAULT_PANE_NAME,
        border: {}
    }],


    _map = vizUtils.map,
    _each = $.each,
    _extend = extend,
    _isArray = Array.isArray,
    _isDefined = require("../core/utils/type").isDefined;

function getFirstAxisNameForPane(axes, paneName) {
    var result;
    for(var i = 0; i < axes.length; i++) {
        if(axes[i].pane === paneName) {
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

function getPaneForAxis(paneAxis, axisNameWithoutPane) {
    var result;
    _each(paneAxis, function(paneName, pane) {
        _each(pane, function(axisName) {
            if(axisNameWithoutPane === axisName) {
                result = paneName;
                return false;
            }
        });
    });
    return result;
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
}

function applyClipSettings(clipRects, settings) {
    _each(clipRects || [], function(_, c) {
        c && c.attr(settings);
    });
}

function reinitTranslators(translators) {
    _each(translators, function(_, axisTrans) {
        _each(axisTrans, function(_, translator) {
            translator.arg.reinit();
            translator.val.reinit();
        });
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

    _groupSeries: function() {
        var that = this,
            panes = that.panes,
            valAxes = that._valueAxes,
            paneList = _map(panes, function(pane) { return pane.name; }),
            series = that.series,
            paneAxis = that.paneAxis,
            synchronizeMultiAxes = that._themeManager.getOptions("synchronizeMultiAxes"),
            groupedSeries = that._groupsData = { groups: [] };

        _each(series, function(i, particularSeries) {
            particularSeries.axis = particularSeries.axis || getFirstAxisNameForPane(valAxes, particularSeries.pane);
            if(particularSeries.axis) {
                paneAxis[particularSeries.pane] = paneAxis[particularSeries.pane] || {};
                paneAxis[particularSeries.pane][particularSeries.axis] = true;
            }
        });

        _each(valAxes, function(_, axis) {
            if(axis.name && axis.pane && (inArray(axis.pane, paneList) !== -1)) {
                paneAxis[axis.pane] = paneAxis[axis.pane] || {};
                paneAxis[axis.pane][axis.name] = true;
            }
        });

        that._correctValueAxes();

        _each(paneAxis, function(paneName, pane) {
            hideGridsOnNonFirstValueAxisForPane(valAxes, paneName, synchronizeMultiAxes);
            _each(pane, function(axisName) {
                var group = { series: [] };
                _each(series, function(_, particularSeries) {
                    if(particularSeries.pane === paneName && particularSeries.axis === axisName) {
                        group.series.push(particularSeries);
                    }
                });
                groupedSeries.groups.push(group);
                group.valueAxis = findAxis(paneName, axisName, valAxes);
                group.valueOptions = group.valueAxis.getOptions();
            });
        });
        groupedSeries.argumentAxes = that._argumentAxes;
        groupedSeries.argumentOptions = groupedSeries.argumentAxes[0].getOptions();
    },

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

    _correctValueAxes: function() {
        var that = this,
            rotated = that._isRotated(),
            valueAxisOptions = that.option("valueAxis") || {},
            valueAxesOptions = _isArray(valueAxisOptions) ? valueAxisOptions : [valueAxisOptions],
            valueAxes = that._valueAxes || [],
            defaultAxisName = valueAxes[0].name,
            paneAxis = that.paneAxis,
            neededAxis = {};

        _each(valueAxes, function(_, axis) {
            var pane;
            if(!axis.pane) {
                pane = getPaneForAxis(paneAxis, axis.name);
                if(!pane) {
                    pane = that.defaultPane;
                    (paneAxis[pane] = paneAxis[pane] || {})[axis.name] = true;
                }
                axis.setPane(pane);
            }
        });
        _each(that.panes, function(_, pane) {
            var name = pane.name;
            if(!paneAxis[name]) {
                paneAxis[name] = {};
                paneAxis[name][defaultAxisName] = true;
            }
        });
        _each(paneAxis, function(paneName, axisNames) {
            _each(axisNames, function(axisName) {
                var axisOptions;
                neededAxis[axisName + "-" + paneName] = true;
                if(!findAxis(paneName, axisName, valueAxes)) {
                    axisOptions = findAxisOptions(valueAxes, valueAxesOptions, axisName);
                    if(!axisOptions) {
                        that._incidentOccurred("W2102", [axisName]);
                        axisOptions = {
                            name: axisName,
                            priority: valueAxes.length
                        };
                    }
                    valueAxes.push(that._createAxis("valueAxis", axisOptions, { pane: paneName, name: axisName }, rotated));
                }
            });
        });
        that._valueAxes = commonUtils.grep(valueAxes, function(elem) {
            return !!neededAxis[elem.name + "-" + elem.pane];
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

    _createTranslator: function(range, canvas, options) {
        return new translatorsModule.Translator2D(range, canvas, options);
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
            useAggregation = that._options.useAggregation;

        that._createPanesBackground();
        that._appendAxesGroups();

        that._transformed && that._resetTransform();

        that._createTranslators(drawOptions);

        if(useAggregation) {
            _each(that.series, function(_, series) {
                series.resamplePoints(that._getTranslator(series.pane, series.axis).arg, that._zoomMinArg, that._zoomMaxArg);
            });
        }

        if(useAggregation || _isDefined(that._zoomMinArg) || _isDefined(that._zoomMaxArg)) {
            that._populateBusinessRange({
                adjustOnZoom: that._themeManager.getOptions("adjustOnZoom"),
                minArg: that._zoomMinArg,
                maxArg: that._zoomMaxArg,
                notApplyMargins: that._notApplyMargins
            });
            that._updateTranslators();
        }

        return panesBorderOptions;
    },

    _isLegendInside: function() {
        return this._legend && this._legend.getPosition() === "inside";
    },

    _renderAxes: function(drawOptions, panesBorderOptions, rotated, adjustUnits) {
        if(drawOptions && drawOptions.recreateCanvas) {
            vizUtils.updatePanesCanvases(this.panes, this._canvas, rotated);
        }

        this._drawAxes(panesBorderOptions, drawOptions, adjustUnits);
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
                undefined,
                { horizontalAxes: [], verticalAxes: [] }//T350392
            );
        }
    },

    _prepareTranslators: function(series, _, rotated) {
        var tr = this._getTranslator(series.pane, series.axis),
            translators = {};

        translators[rotated ? "x" : "y"] = tr.val;
        translators[rotated ? "y" : "x"] = tr.arg;

        return translators;
    },

    _applyExtraSettings: function(series) {
        var that = this,
            paneIndex = that._getPaneIndex(series.pane),
            panesClipRects = that._panesClipRects,
            wideClipRect = panesClipRects.wide[paneIndex];
        series.setClippingParams(panesClipRects.base[paneIndex].id, wideClipRect && wideClipRect.id, that._getPaneBorderVisibility(paneIndex));
    },

    _createTranslators: function(drawOptions) {
        var that = this,
            rotated = that._isRotated(),
            translators;

        if(!drawOptions.recreateCanvas) {
            return;
        }

        that.translators = translators = {};

        vizUtils.updatePanesCanvases(that.panes, that._canvas, rotated);

        //val translator
        _each(that.paneAxis, function(paneName, pane) { //valueAxes
            translators[paneName] = translators[paneName] || {};

            _each(pane, function(axisName) {
                var translator = that._createTranslator(new rangeModule.Range(that._getBusinessRange(paneName, axisName).val), that._getCanvasForPane(paneName), { isHorizontal: !!rotated });
                translator.pane = paneName;
                translator.axis = axisName;
                translators[paneName][axisName] = { val: translator };
            });
        });

        //arg translator
        _each(that._argumentAxes, function(_, axis) { //argumentAxes
            var translator = that._createTranslator(new rangeModule.Range(that._getBusinessRange(axis.pane).arg), that._getCanvasForPane(axis.pane), { isHorizontal: !rotated });
            _each(translators[axis.pane], function(valAxis, paneAxisTranslator) {
                paneAxisTranslator.arg = translator;
            });
        });
    },

    _updateTranslators: function() {
        var that = this;

        _each(that.translators, function(pane, axisTrans) {
            _each(axisTrans, function(axis, translator) {
                translator.arg.updateBusinessRange(new rangeModule.Range(that._getBusinessRange(pane).arg));
                delete translator.arg._originalBusinessRange;

                translator.val.updateBusinessRange(new rangeModule.Range(that._getBusinessRange(pane, axis).val));
                delete translator.val._originalBusinessRange;
            });
        });
    },

    _getAxesForTransform: function(rotated) {
        return {
            verticalAxes: !rotated ? this._getValueAxes() : this._getArgumentAxes(),
            horizontalAxes: !rotated ? this._getArgumentAxes() : this._getValueAxes()
        };
    },

    _getAxisDrawingMethods: function(drawOptions, preparedOptions, isRotated) {
        var that = this;
        return function(adjustUnits) {
            that._renderAxes(drawOptions, preparedOptions, isRotated, adjustUnits);
        };
    },

    _reinitTranslators: function() {
        var that = this;

        //update argument axes
        _each(that._argumentAxes, function(_, axis) {
            var translator = that._getTranslator(axis.pane);
            if(translator) {
                translator.arg.reinit();
                axis.setTranslator(translator.arg, translator.val);
            }
        });

        //update value axes
        _each(that._valueAxes, function(_, axis) {
            var translator = that._getTranslator(axis.pane, axis.name);
            if(translator) {
                translator.val.reinit();
                axis.setTranslator(translator.val, translator.arg);
            }
        });
    },

    _saveBusinessRange: function() {
        var savedBusinessRange = this._savedBusinessRange;
        $.each(this.translators, function(name, pane) {
            savedBusinessRange[name] = {};
            $.each(pane, function(axisName, translator) {
                savedBusinessRange[name][axisName] = {};
                savedBusinessRange[name][axisName]["arg"] = extend(true, {}, translator.arg.getBusinessRange());
                savedBusinessRange[name][axisName]["val"] = extend(true, {}, translator.val.getBusinessRange());
            });
        });
    },

    _restoreOriginalBusinessRange: function() {
        var savedBusinessRange = this._savedBusinessRange;
        $.each(this.translators, function(name, pane) {
            $.each(pane, function(axisName, translator) {
                translator.arg.updateBusinessRange(extend(true, {}, savedBusinessRange[name][axisName]["arg"]));
                translator.val.updateBusinessRange(extend(true, {}, savedBusinessRange[name][axisName]["val"]));
            });
        });
    },

    _prepareAxesAndDraw: function(drawAxes, drawStaticAxisElements, drawOptions) {
        var that = this,
            i = 0,
            layoutManager = that.layoutManager,
            rotated = that._isRotated(),
            adjustmentCounter = 0,
            synchronizeMultiAxes = that._themeManager.getOptions("synchronizeMultiAxes"),
            layoutTargets = that._getLayoutTargets(),
            verticalAxes = rotated ? that._argumentAxes : that._valueAxes,
            horizontalAxes = rotated ? that._valueAxes : that._argumentAxes,
            hElements = horizontalAxes,
            vElements = verticalAxes;

        if(that._scrollBar) {
            that._scrollBar.setPane(layoutTargets);
            if(rotated) {
                vElements = [that._scrollBar].concat(vElements);
            } else {
                hElements = hElements.concat([that._scrollBar]);
            }
        }

        do {
            for(i = 0; i < that._argumentAxes.length; i++) {
                that._argumentAxes[i].resetTicks();
            }
            for(i = 0; i < that._valueAxes.length; i++) {
                that._valueAxes[i].resetTicks();
            }

            if(synchronizeMultiAxes) {
                multiAxesSynchronizer.synchronize(that._valueAxes);
            }

            //horizontal axes
            drawAxes(horizontalAxes);
            layoutManager.requireAxesRedraw = false;
            if(drawOptions.adjustAxes) {
                layoutManager.applyHorizontalAxesLayout(hElements, layoutTargets, rotated);
                !layoutManager.stopDrawAxes && reinitTranslators(that.translators);
            }

            //vertical axes
            drawAxes(verticalAxes);
            if(drawOptions.adjustAxes && !layoutManager.stopDrawAxes) {
                layoutManager.applyVerticalAxesLayout(vElements, layoutTargets, rotated);
                !layoutManager.stopDrawAxes && reinitTranslators(that.translators);
            }
            adjustmentCounter = adjustmentCounter + 1;
        } while(!layoutManager.stopDrawAxes && layoutManager.requireAxesRedraw && adjustmentCounter < MAX_ADJUSTMENT_ATTEMPTS);

        drawStaticAxisElements(verticalAxes);
        drawStaticAxisElements(horizontalAxes);
        that._scrollBar && that._scrollBar.applyLayout();
        ///#DEBUG
        that.__axisAdjustmentsCount = adjustmentCounter;
        ///#ENDDEBUG
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

    _getTranslator: function(paneName, axisName) {
        var paneTrans = this.translators[paneName],
            foundTranslator = null;

        if(!paneTrans) {
            return foundTranslator;
        }

        foundTranslator = paneTrans[axisName];

        if(!foundTranslator) {
            _each(paneTrans, function(axis, trans) {
                foundTranslator = trans;
                return false;
            });
            foundTranslator = _extend({ axesTrans: paneTrans }, foundTranslator);
        }

        return foundTranslator;
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
        that._notApplyMargins = gesturesUsed;

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
            range,
            isDiscrete,
            categories;

        if(!translator) {
            return {
                minVisible: this._zoomMinArg,
                maxVisible: this._zoomMaxArg
            };
        }
        range = translator.getBusinessRange();
        isDiscrete = range.axisType === "discrete";
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
