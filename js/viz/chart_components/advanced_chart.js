var extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    iteratorModule = require("../../core/utils/iterator"),
    rangeModule = require("../translators/range"),
    DEFAULT_AXIS_NAME = "defaultAxisName",
    axisModule = require("../axes/base_axis"),
    seriesFamilyModule = require("../core/series_family"),
    BaseChart = require("./base_chart").BaseChart,
    crosshairModule = require("./crosshair"),

    _isArray = Array.isArray,
    _isDefined = require("../../core/utils/type").isDefined,
    _each = iteratorModule.each,
    _reverseEach = iteratorModule.reverseEach,
    _noop = require("../../core/utils/common").noop,
    _extend = extend,
    vizUtils = require("../core/utils"),
    type = require("../../core/utils/type").type,
    convertVisualRangeObject = vizUtils.convertVisualRangeObject,
    rangesAreEqual = vizUtils.rangesAreEqual,
    _map = vizUtils.map,
    mergeMarginOptions = vizUtils.mergeMarginOptions,

    FONT = "font",
    COMMON_AXIS_SETTINGS = "commonAxisSettings",
    DEFAULT_PANE_NAME = 'default',
    VISUAL_RANGE = "VISUAL_RANGE";

function prepareAxis(axisOptions) {
    return _isArray(axisOptions) ? axisOptions.length === 0 ? [{}] : axisOptions : [axisOptions];
}

function processBubbleMargin(opt, bubbleSize) {
    if(opt.processBubbleSize) {
        opt.size = bubbleSize;
    }
    return opt;
}

function estimateBubbleSize(size, panesCount, maxSize, rotated) {
    var width = rotated ? size.width / panesCount : size.width,
        height = rotated ? size.height : size.height / panesCount;

    return Math.min(width, height) * maxSize;
}

function setAxisVisualRangeByOption(arg, axis, isDirectOption, index) {
    let options;
    let visualRange;

    if(isDirectOption) {
        visualRange = arg.value;
        options = {
            skipEventRising: true
        };

        const pathElements = arg.fullName.split(".");
        const destElem = pathElements[pathElements.length - 1];
        if(destElem === "endValue" || destElem === "startValue") {
            options = {
                allowPartialUpdate: true
            };
            visualRange = {
                [destElem]: arg.value
            };
        }
    } else {
        visualRange = (_isDefined(index) ? arg.value[index] : arg.value).visualRange;
    }
    axis.visualRange(visualRange, options);
}

var AdvancedChart = BaseChart.inherit({

    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        _extend(this._deprecatedOptions, {
            "barWidth": { since: "18.1", message: "Use the 'commonSeriesSettings.barPadding' or 'series.barPadding' option instead" },
            "equalBarWidth": { since: "18.1", message: "Use the 'commonSeriesSettings.ignoreEmptyPoints' or 'series.ignoreEmptyPoints' option instead" }
        });
    },

    _fontFields: [COMMON_AXIS_SETTINGS + ".label." + FONT, COMMON_AXIS_SETTINGS + ".title." + FONT],

    _partialOptionChangesMap: {
        visualRange: VISUAL_RANGE,
        _customVisualRange: VISUAL_RANGE,
        strips: "REFRESH_AXES",
        constantLines: "REFRESH_AXES"
    },

    _partialOptionChangesPath: {
        argumentAxis: ["strips", "constantLines", "visualRange", "_customVisualRange"],
        valueAxis: ["strips", "constantLines", "visualRange", "_customVisualRange"]
    },

    _initCore() {
        this._panesClipRects = {};
        this.callBase();
    },

    _disposeCore() {
        const disposeObjectsInArray = this._disposeObjectsInArray;
        const panesClipRects = this._panesClipRects;

        this.callBase();
        disposeObjectsInArray.call(panesClipRects, "fixed");
        disposeObjectsInArray.call(panesClipRects, "base");
        disposeObjectsInArray.call(panesClipRects, "wide");
        this._panesClipRects = null;
    },

    _dispose: function() {
        var that = this,
            disposeObjectsInArray = this._disposeObjectsInArray;

        that.callBase();

        that.panes = null;
        if(that._legend) {
            that._legend.dispose();
            that._legend = null;
        }
        disposeObjectsInArray.call(that, "panesBackground");
        disposeObjectsInArray.call(that, "seriesFamilies");
        that._disposeAxes();
    },

    _createPanes: function() {
        this._cleanPanesClipRects("fixed");
        this._cleanPanesClipRects("base");
        this._cleanPanesClipRects("wide");
    },

    _cleanPanesClipRects(clipArrayName) {
        const clipArray = this._panesClipRects[clipArrayName];
        (clipArray || []).forEach(clipRect => clipRect && clipRect.dispose());
        this._panesClipRects[clipArrayName] = [];
    },

    _getElementsClipRectID(paneName) {
        const clipShape = this._panesClipRects.fixed[this._getPaneIndex(paneName)];
        return clipShape && clipShape.id;
    },

    _getPaneIndex(paneName) {
        let paneIndex;
        const name = paneName || DEFAULT_PANE_NAME;

        _each(this.panes, (index, pane) => {
            if(pane.name === name) {
                paneIndex = index;
                return false;
            }
        });
        return paneIndex;
    },

    _reinitAxes: function() {
        this.panes = this._createPanes();
        this._populateAxes();
        this._axesReinitialized = true;
    },

    _getCrosshairMargins: function() {
        var crosshairOptions = this._getCrosshairOptions() || {},
            crosshairEnabled = crosshairOptions.enabled,
            margins = crosshairModule.getMargins();

        return {
            x: crosshairEnabled && crosshairOptions.horizontalLine.visible ? margins.x : 0,
            y: crosshairEnabled && crosshairOptions.verticalLine.visible ? margins.y : 0
        };
    },

    _populateAxes() {
        const that = this;
        const panes = that.panes;
        const rotated = that._isRotated();
        const argumentAxesOptions = prepareAxis(that.option("argumentAxis") || {})[0];
        const valueAxisOption = that.option("valueAxis");
        const valueAxesOptions = prepareAxis(valueAxisOption || {});
        let argumentAxesPopulatedOptions = [];
        let valueAxesPopulatedOptions = [];
        const axisNames = [];
        let valueAxesCounter = 0;
        let paneWithNonVirtualAxis;
        const crosshairMargins = that._getCrosshairMargins();

        function getNextAxisName() {
            return DEFAULT_AXIS_NAME + valueAxesCounter++;
        }

        if(rotated) {
            paneWithNonVirtualAxis = argumentAxesOptions.position === "right" ? panes[panes.length - 1].name : panes[0].name;
        } else {
            paneWithNonVirtualAxis = argumentAxesOptions.position === "top" ? panes[0].name : panes[panes.length - 1].name;
        }

        argumentAxesPopulatedOptions = _map(panes, pane => {
            const virtual = pane.name !== paneWithNonVirtualAxis;
            return that._populateAxesOptions("argumentAxis", argumentAxesOptions,
                {
                    pane: pane.name,
                    name: null,
                    optionPath: "argumentAxis",
                    crosshairMargin: rotated ? crosshairMargins.x : crosshairMargins.y
                },
                rotated, virtual);
        });

        _each(valueAxesOptions, (priority, axisOptions) => {
            var axisPanes = [],
                name = axisOptions.name;

            if(name && inArray(name, axisNames) !== -1) {
                that._incidentOccurred("E2102");
                return;
            }
            name && axisNames.push(name);

            if(axisOptions.pane) {
                axisPanes.push(axisOptions.pane);
            }
            if(axisOptions.panes && axisOptions.panes.length) {
                axisPanes = axisPanes.concat(axisOptions.panes.slice(0));
            }
            axisPanes = vizUtils.unique(axisPanes);
            if(!axisPanes.length) {
                axisPanes.push(undefined);
            }

            _each(axisPanes, (_, pane) => {
                let optionPath = _isArray(valueAxisOption) ? `valueAxis[${priority}]` : "valueAxis";

                valueAxesPopulatedOptions.push(that._populateAxesOptions("valueAxis", axisOptions, {
                    name: name || getNextAxisName(),
                    pane,
                    priority,
                    optionPath,
                    crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x
                }, rotated));
            });
        });

        that._redesignAxes(argumentAxesPopulatedOptions, true, paneWithNonVirtualAxis);
        that._redesignAxes(valueAxesPopulatedOptions, false);
    },

    _redesignAxes(options, isArgumentAxes, paneWithNonVirtualAxis) {
        const that = this;
        const axesBasis = [];
        let axes = isArgumentAxes ? that._argumentAxes : that._valueAxes;

        _each(options, (_, opt) => {
            const curAxes = axes && axes.filter(a => a.name === opt.name &&
                (!_isDefined(opt.pane) && that.panes.some(p => p.name === a.pane) || a.pane === opt.pane));
            if(curAxes && curAxes.length > 0) {
                _each(curAxes, (_, axis) => {
                    axis.updateOptions(opt);
                    axis.validate();
                    axesBasis.push({ axis: axis });
                });
            } else {
                axesBasis.push({ options: opt });
            }
        });

        if(axes) {
            _reverseEach(axes, (index, axis) => {
                if(!axesBasis.some(basis => basis.axis && basis.axis === axis)) {
                    that._disposeAxis(index, isArgumentAxes);
                }
            });
        } else if(isArgumentAxes) {
            axes = that._argumentAxes = [];
        } else {
            axes = that._valueAxes = [];
        }

        _each(axesBasis, (index, basis) => {
            let axis = basis.axis;
            if(basis.axis && isArgumentAxes) {
                basis.axis.isVirtual = basis.axis.pane !== paneWithNonVirtualAxis;
            } else if(basis.options) {
                axis = that._createAxis(isArgumentAxes, basis.options,
                    isArgumentAxes ? basis.options.pane !== paneWithNonVirtualAxis : undefined,
                    isArgumentAxes ? index : undefined);
                axes.push(axis);
            }
            axis.applyVisualRangeSetter(that._getVisualRangeSetter());
        });
    },

    _disposeAxis(index, isArgumentAxis) {
        const axes = isArgumentAxis ? this._argumentAxes : this._valueAxes;
        let axis = axes[index];

        if(!axis) return;

        axis.dispose();
        axes.splice(index, 1);
    },

    _disposeAxes: function() {
        var that = this,
            disposeObjectsInArray = that._disposeObjectsInArray;
        disposeObjectsInArray.call(that, "_argumentAxes");
        disposeObjectsInArray.call(that, "_valueAxes");
    },

    _appendAdditionalSeriesGroups: function() {
        this._crosshairCursorGroup.linkAppend();
        // this._legendGroup.linkAppend();
        this._scrollBar && this._scrollBarGroup.linkAppend(); // TODO: Must be appended in the same place where removed (chart)
    },
    _getLegendTargets: function() {
        return (this.series || []).map(s => {
            const item = this._getLegendOptions(s);
            item.legendData.series = s;
            if(!s.getOptions().showInLegend) {
                item.legendData.visible = false;
            }
            return item;
        });
    },
    _legendItemTextField: "name",

    _seriesPopulatedHandlerCore: function() {
        this._processSeriesFamilies();
        this._processValueAxisFormat();
    },

    _renderTrackers: function() {
        var that = this,
            i;
        for(i = 0; i < that.series.length; ++i) {
            that.series[i].drawTrackers();
        }
        // TODO we don't need it
        // if (that._legend) {
        //    legendHasInsidePosition && that._legendGroup.append(that._renderer.root);
        // }
    },

    _specialProcessSeries: function() {
        this._processSeriesFamilies();
    },

    _processSeriesFamilies: function() {
        var that = this,
            types = [],
            families = [],
            paneSeries,
            themeManager = that._themeManager,
            negativesAsZeroes = themeManager.getOptions("negativesAsZeroes"),
            negativesAsZeros = themeManager.getOptions("negativesAsZeros"), // misspelling case
            familyOptions = {
                equalBarWidth: themeManager.getOptions("equalBarWidth"),
                minBubbleSize: themeManager.getOptions("minBubbleSize"),
                maxBubbleSize: themeManager.getOptions("maxBubbleSize"),
                barWidth: themeManager.getOptions("barWidth"),
                barGroupPadding: themeManager.getOptions("barGroupPadding"),
                barGroupWidth: themeManager.getOptions("barGroupWidth"),
                negativesAsZeroes: _isDefined(negativesAsZeroes) ? negativesAsZeroes : negativesAsZeros
            };

        if(that.seriesFamilies && that.seriesFamilies.length) {
            _each(that.seriesFamilies, function(_, family) {
                family.updateOptions(familyOptions);
                family.adjustSeriesValues();
            });
            return;
        }

        _each(that.series, function(_, item) {
            if(inArray(item.type, types) === -1) {
                types.push(item.type);
            }
        });

        _each(that._getLayoutTargets(), function(_, pane) {
            paneSeries = that._getSeriesForPane(pane.name);

            _each(types, function(_, type) {
                var family = new seriesFamilyModule.SeriesFamily({
                    type: type,
                    pane: pane.name,
                    equalBarWidth: familyOptions.equalBarWidth,
                    minBubbleSize: familyOptions.minBubbleSize,
                    maxBubbleSize: familyOptions.maxBubbleSize,
                    barWidth: familyOptions.barWidth,
                    barGroupPadding: familyOptions.barGroupPadding,
                    barGroupWidth: familyOptions.barGroupWidth,
                    negativesAsZeroes: familyOptions.negativesAsZeroes,
                    rotated: that._isRotated()
                });

                family.add(paneSeries);
                family.adjustSeriesValues();
                families.push(family);
            });
        });
        that.seriesFamilies = families;
    },

    _updateSeriesDimensions: function() {
        var that = this,
            i,
            seriesFamilies = that.seriesFamilies || [];

        for(i = 0; i < seriesFamilies.length; i++) {
            var family = seriesFamilies[i];

            family.updateSeriesValues();
            family.adjustSeriesDimensions();
        }
    },

    _getLegendCallBack: function(series) {
        return this._legend && this._legend.getActionCallback(series);
    },

    _appendAxesGroups: function() {
        var that = this;
        that._stripsGroup.linkAppend();
        that._gridGroup.linkAppend();
        that._axesGroup.linkAppend();
        that._constantLinesGroup.linkAppend();
        that._labelAxesGroup.linkAppend();
        that._scaleBreaksGroup.linkAppend();
    },

    _populateMarginOptions() {
        const that = this;
        const bubbleSize = estimateBubbleSize(that.getSize(), that.panes.length, that._themeManager.getOptions("maxBubbleSize"), that._isRotated());
        let argumentMarginOptions = {};

        that._valueAxes.forEach(valueAxis => {
            const groupSeries = that.series.filter(function(series) {
                return series.getValueAxis() === valueAxis;
            });
            let marginOptions = {};

            groupSeries.forEach(series => {
                if(series.isVisible()) {
                    const seriesMarginOptions = processBubbleMargin(series.getMarginOptions(), bubbleSize);

                    marginOptions = mergeMarginOptions(marginOptions, seriesMarginOptions);
                    argumentMarginOptions = mergeMarginOptions(argumentMarginOptions, seriesMarginOptions);
                }
            });

            valueAxis.setMarginOptions(marginOptions);
        });

        that._argumentAxes.forEach(a => a.setMarginOptions(argumentMarginOptions));
    },

    _populateBusinessRange(updatedAxis, keepRange) {
        const that = this;
        const rotated = that._isRotated();
        const argRange = new rangeModule.Range({ rotated: !!rotated });
        const series = that._getVisibleSeries();

        that._valueAxes.forEach(valueAxis => {
            var groupRange = new rangeModule.Range({
                    rotated: !!rotated,
                    pane: valueAxis.pane,
                    axis: valueAxis.name
                }),
                groupSeries = series.filter(series => series.getValueAxis() === valueAxis);

            groupSeries.forEach(series => {
                var seriesRange = series.getRangeData();

                groupRange.addRange(seriesRange.val);
                argRange.addRange(seriesRange.arg);
            });

            if(!updatedAxis || updatedAxis && groupSeries.length && valueAxis === updatedAxis) {
                valueAxis.setGroupSeries(groupSeries);
                valueAxis.setBusinessRange(groupRange, that._axesReinitialized || keepRange, that._argumentAxes[0]._lastVisualRangeUpdateMode);
            }
        });

        if(!updatedAxis || updatedAxis && series.length) {
            that._argumentAxes.forEach(a => a.setBusinessRange(argRange, that._axesReinitialized, undefined, that._groupsData.categories));
        }

        that._populateMarginOptions();
    },

    getArgumentAxis: function() {
        return (this._argumentAxes || []).filter(a => !a.isVirtual)[0];
    },

    getValueAxis: function(name) {
        return (this._valueAxes || []).filter(_isDefined(name) ? a => a.name === name : a => a.pane === this.defaultPane)[0];
    },

    _getGroupsData: function() {
        var that = this,
            groups = [];

        that._valueAxes.forEach(function(axis) {
            groups.push({
                series: that.series.filter(function(series) {
                    return series.getValueAxis() === axis;
                }),
                valueAxis: axis,
                valueOptions: axis.getOptions()
            });
        });

        return {
            groups: groups,
            argumentAxes: that._argumentAxes,
            argumentOptions: that._argumentAxes[0].getOptions()
        };
    },

    _groupSeries: function() {
        var that = this;
        that._correctValueAxes(false);
        that._groupsData = that._getGroupsData();
    },

    _processValueAxisFormat: function() {
        var axesWithFullStackedFormat = [];

        this.series.forEach(function(series) {
            var axis = series.getValueAxis();
            if(series.isFullStackedSeries()) {
                axis.setPercentLabelFormat();
                axesWithFullStackedFormat.push(axis);
            }
        });

        this._valueAxes.forEach(function(axis) {
            if(axesWithFullStackedFormat.indexOf(axis) === -1) {
                axis.resetAutoLabelFormat(); // B239299
            }
        });
    },

    _populateAxesOptions(typeSelector, userOptions, axisOptions, rotated, virtual) {
        const that = this;
        const preparedUserOptions = that._prepareStripsAndConstantLines(typeSelector, userOptions, rotated);
        const options = _extend(true, {}, preparedUserOptions, axisOptions, that._prepareAxisOptions(typeSelector, preparedUserOptions, rotated));
        if(virtual) {
            options.visible = options.tick.visible = options.minorTick.visible = options.label.visible = false;
            options.title = {};
        }

        return options;
    },

    _createAxis(isArgumentAxes, options, virtual, index) {
        const that = this;
        const typeSelector = isArgumentAxes ? "argumentAxis" : "valueAxis";
        const renderingSettings = _extend({
            renderer: that._renderer,
            incidentOccurred: that._incidentOccurred,
            eventTrigger: that._eventTrigger,
            axisClass: isArgumentAxes ? "arg" : "val",
            widgetClass: "dxc",
            stripsGroup: that._stripsGroup,
            labelAxesGroup: that._labelAxesGroup,
            constantLinesGroup: that._constantLinesGroup,
            scaleBreaksGroup: that._scaleBreaksGroup,
            axesContainerGroup: that._axesGroup,
            gridGroup: that._gridGroup,
            isArgumentAxis: isArgumentAxes
        }, that._getAxisRenderingOptions(typeSelector));
        const axis = new axisModule.Axis(renderingSettings);
        axis.updateOptions(options);
        axis.isVirtual = virtual;

        return axis;
    },

    _applyVisualRangeByVirtualAxes(axis, range) {
        return false;
    },

    _applyCustomVisualRangeOption(axis, range) {
        const that = this;
        if(axis.getOptions().optionPath) {
            that._parseVisualRangeOption(`${axis.getOptions().optionPath}.visualRange`, range);
        }
    },

    _getVisualRangeSetter() {
        const chart = this;
        return function(axis, { skipEventRising, range }) {
            chart._applyCustomVisualRangeOption(axis, range);
            axis.setCustomVisualRange(range);

            axis.skipEventRising = skipEventRising;

            if(!chart._applyVisualRangeByVirtualAxes(axis, range)) {
                if(chart._applyingChanges) {
                    chart._change_VISUAL_RANGE();
                } else {
                    chart._requestChange([VISUAL_RANGE]);
                }
            }
        };
    },

    _getTrackerSettings: function() {
        return _extend(this.callBase(), {
            argumentAxis: this.getArgumentAxis()
        });
    },

    _prepareStripsAndConstantLines: function(typeSelector, userOptions, rotated) {
        userOptions = this._themeManager.getOptions(typeSelector, userOptions, rotated);
        if(userOptions.strips) {
            _each(userOptions.strips, function(i) {
                userOptions.strips[i] = _extend(true, {}, userOptions.stripStyle, userOptions.strips[i]);
            });
        }
        if(userOptions.constantLines) {
            _each(userOptions.constantLines, function(i, line) {
                userOptions.constantLines[i] = _extend(true, {}, userOptions.constantLineStyle, line);
            });
        }
        return userOptions;
    },

    refresh: function() {
        this._disposeAxes();
        this.callBase();
    },

    _layoutAxes(drawAxes) {
        const that = this;
        const cleanPanesCanvases = drawAxes();

        const needSpace = that.checkForMoreSpaceForPanesCanvas();

        if(needSpace) {
            const size = this._layout.backward(this._rect, this._rect, [needSpace.width, needSpace.height]);
            needSpace.width = Math.max(0, size[0]);
            needSpace.height = Math.max(0, size[1]);
            this._canvas = this._createCanvasFromRect(this._rect);

            drawAxes(needSpace, cleanPanesCanvases);
        }
    },

    checkForMoreSpaceForPanesCanvas() {
        return this.layoutManager.needMoreSpaceForPanesCanvas(this._getLayoutTargets(), this._isRotated());
    },

    _parseVisualRangeOption(fullName, value) {
        const that = this;
        const name = fullName.split(/[.[]/)[0];
        let index = fullName.match(/\d+/g);

        index = _isDefined(index) ? parseInt(index[0]) : index;

        if(fullName.indexOf("visualRange") > 0) {
            that._setCustomVisualRange(name, index, value);
        } else if((type(value) === "object" || _isArray(value)) && name.indexOf("Axis") > 0 && JSON.stringify(value).indexOf("visualRange") > 0) {
            if(_isDefined(value.visualRange)) {
                that._setCustomVisualRange(name, index, value.visualRange);
            } else if(_isArray(value)) {
                value.forEach((a, i) => _isDefined(a.visualRange) && that._setCustomVisualRange(name, i, a.visualRange));
            }
        }
    },

    _setCustomVisualRange(axesName, index, value) {
        const that = this;
        const options = that._options.silent(axesName);

        if(!options) {
            return;
        }

        if(!_isDefined(index)) {
            options._customVisualRange = value;
        } else {
            options[index]._customVisualRange = value;
        }

        that._axesReinitialized = true;
    },

    _raiseZoomEndHandlers() {
        this._valueAxes.forEach(axis => axis.handleZoomEnd());
    },

    _setOptionsByReference() {
        this.callBase();

        _extend(this._optionsByReference, {
            "valueAxis.visualRange": true
        });
    },

    _notifyOptionChanged(option, value, previousValue) {
        this.callBase.apply(this, arguments);
        if(!this._optionChangedLocker) {
            this._parseVisualRangeOption(option, value);
        }
    },

    _notifyVisualRange() {
        const that = this;

        that._valueAxes.forEach(axis => {
            if(axis.getOptions().optionPath) {
                const path = `${axis.getOptions().optionPath}.visualRange`;
                const visualRange = convertVisualRangeObject(axis.visualRange(), !_isArray(that.option(path)));

                if(!axis.skipEventRising || !rangesAreEqual(visualRange, that.option(path))) {
                    that.option(path, visualRange);
                } else {
                    axis.skipEventRising = null;
                }
            }
        });
    },

    _notify() {
        this.callBase();
        this._axesReinitialized = false;

        if(this.option("disableTwoWayBinding") !== true) { // for dashboards T732396
            this._notifyVisualRange();
        }
    },

    _getAxesForScaling() {
        return this._valueAxes;
    },

    _getAxesByOptionPath(arg, isDirectOption, optionName) {
        const that = this;
        const sourceAxes = that._getAxesForScaling();
        let axes = [];

        if(isDirectOption) {
            let axisPath;
            if(arg.fullName) {
                axisPath = arg.fullName.slice(0, arg.fullName.indexOf("."));
            }
            axes = sourceAxes.filter(a => a.getOptions().optionPath === axisPath);
        } else {
            if(type(arg.value) === "object") {
                axes = sourceAxes.filter(a => a.getOptions().optionPath === arg.name);
            } else if(_isArray(arg.value)) {
                arg.value.forEach((v, index) => {
                    const axis = sourceAxes.filter(a => a.getOptions().optionPath === `${arg.name}[${index}]`)[0];
                    _isDefined(v[optionName]) && _isDefined(axis) && (axes[index] = axis);
                });
            }
        }

        return axes;
    },

    _optionChanged(arg) {
        const that = this;
        if(!that._optionChangedLocker) {
            const optionName = "visualRange";
            let axes;
            const isDirectOption = arg.fullName.indexOf(optionName) > 0 ? true :
                (that.getPartialChangeOptionsName(arg).indexOf(optionName) > -1 ? false : undefined);

            if(_isDefined(isDirectOption)) {
                axes = that._getAxesByOptionPath(arg, isDirectOption, optionName);

                if(axes) {
                    if(axes.length > 1 || _isArray(arg.value)) {
                        axes.forEach((a, index) => setAxisVisualRangeByOption(arg, a, isDirectOption, index));
                    } else if(axes.length === 1) {
                        setAxisVisualRangeByOption(arg, axes[0], isDirectOption);
                    }
                }
            }
        }
        that.callBase(arg);
    },

    _change_VISUAL_RANGE: function() {
        const that = this;

        that._recreateSizeDependentObjects(false);
        if(!that._changes.has("FULL_RENDER")) {
            const resizePanesOnZoom = this.option("resizePanesOnZoom");
            that._doRender({
                force: true,
                drawTitle: false,
                drawLegend: false,
                adjustAxes: _isDefined(resizePanesOnZoom) ? resizePanesOnZoom : (this.option("adjustAxesOnZoom") || false),
                animate: false
            });
            that._raiseZoomEndHandlers();
        }
    },

    // API
    resetVisualRange() {
        const that = this;

        that._valueAxes.forEach(axis => {
            axis.resetVisualRange(false); // T602156
            that._applyCustomVisualRangeOption(axis);
        });
        that._requestChange([VISUAL_RANGE]);
    },

    _legendDataField: "series",

    _adjustSeriesLabels: _noop,

    _correctValueAxes: _noop
});

exports.AdvancedChart = AdvancedChart;
