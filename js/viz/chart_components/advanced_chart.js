"use strict";

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
    _map = vizUtils.map,
    mergeMarginOptions = vizUtils.mergeMarginOptions;

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

var AdvancedChart = BaseChart.inherit({

    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        _extend(this._deprecatedOptions, {
            "barWidth": { since: "18.1", message: "Use the 'commonSeriesSettings.barPadding' or 'series.barPadding' option instead" },
            "equalBarWidth": { since: "18.1", message: "Use the 'commonSeriesSettings.ignoreEmptyPoints' or 'series.ignoreEmptyPoints' option instead" }
        });
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

    _reinitAxes: function() {
        this.panes = this._createPanes();
        this._populateAxes();
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
        const valueAxesOptions = prepareAxis(that.option("valueAxis") || {});
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
                valueAxesPopulatedOptions.push(that._populateAxesOptions("valueAxis", axisOptions, {
                    name: name || getNextAxisName(),
                    pane: pane,
                    priority: priority,
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
            if(basis.axis && isArgumentAxes) {
                that._displayedArgumentAxisIndex = index;
            } else if(basis.options) {
                axes.push(that._createAxis(isArgumentAxes ? "argumentAxis" : "valueAxis", basis.options,
                    isArgumentAxes ? basis.options.pane !== paneWithNonVirtualAxis : undefined,
                    isArgumentAxes ? index : undefined));
            }
        });
    },

    _disposeAxis(index, isArgumentAxis) {
        const axes = isArgumentAxis ? this._argumentAxes : this._valueAxes;
        let axis = axes[index];

        if(!axis) return;

        axis.dispose();
        axes.splice(index, 1);
    },

    _prepareStackPoints: function(singleSeries, stackPoints) {
        var points = singleSeries.getPoints(),
            stackName = singleSeries.getStackName();

        _each(points, function(_, point) {
            var argument = point.argument;

            if(!stackPoints[argument]) {
                stackPoints[argument] = {};
                stackPoints[argument][null] = [];
            }
            if(stackName && !_isArray(stackPoints[argument][stackName])) {
                stackPoints[argument][stackName] = [];
                _each(stackPoints[argument][null], function(_, point) {
                    if(!point.stackName) {
                        stackPoints[argument][stackName].push(point);
                    }
                });
            }

            if(stackName) {
                stackPoints[argument][stackName].push(point);
                stackPoints[argument][null].push(point);
            } else {
                _each(stackPoints[argument], function(_, stack) {
                    stack.push(point);
                });
            }

            point.stackPoints = stackPoints[argument][stackName];
            point.stackName = stackName;
        });
    },

    _resetStackPoints: function(singleSeries) {
        _each(singleSeries.getPoints(), function(_, point) {
            point.stackPoints = null;
            point.stackName = null;
        });
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
        this._scrollBar && this._scrollBarGroup.linkAppend();   // TODO: Must be appended in the same place where removed (chart)
    },
    _getLegendTargets: function() {
        var that = this;
        return _map(that.series, function(item) {
            if(item.getOptions().showInLegend) {
                return that._getLegendOptions(item);
            }
            return null;
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

    _populateBusinessRange(useZoom) {
        const that = this;
        const rotated = that._isRotated();
        const argRange = new rangeModule.Range({ rotated: !!rotated });
        const groupsData = that._groupsData;

        that._valueAxes.forEach(valueAxis => {
            var groupRange = new rangeModule.Range({
                    rotated: !!rotated,
                    pane: valueAxis.pane,
                    axis: valueAxis.name
                }),
                groupSeries = that.series.filter(series => series.getValueAxis() === valueAxis);

            groupSeries.forEach(series => {
                var seriesRange = series.getRangeData();

                groupRange.addRange(seriesRange.val);
                argRange.addRange(seriesRange.arg);
            });

            valueAxis.setGroupSeries(groupSeries);
            valueAxis.setBusinessRange(groupRange);
        });

        that._argumentAxes.forEach(a => a.setBusinessRange(argRange, groupsData.categories));

        that._populateMarginOptions();
    },

    getArgumentAxis: function() {
        return this._argumentAxes[this._displayedArgumentAxisIndex];
    },

    getValueAxis: function(name) {
        return this._valueAxes.filter(_isDefined(name) ? a => a.name === name : a => a.pane === this.defaultPane)[0];
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
                axis.resetAutoLabelFormat();  // B239299
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

    _createAxis(typeSelector, options, virtual, index) {
        const that = this;
        const renderingSettings = _extend({
            renderer: that._renderer,
            incidentOccurred: that._incidentOccurred,
            axisClass: typeSelector === "argumentAxis" ? "arg" : "val",
            widgetClass: "dxc",
            stripsGroup: that._stripsGroup,
            labelAxesGroup: that._labelAxesGroup,
            constantLinesGroup: that._constantLinesGroup,
            scaleBreaksGroup: that._scaleBreaksGroup,
            axesContainerGroup: that._axesGroup,
            gridGroup: that._gridGroup,
            isArgumentAxis: typeSelector === "argumentAxis"
        }, that._getAxisRenderingOptions(typeSelector));
        const axis = new axisModule.Axis(renderingSettings);
        axis.updateOptions(options);

        if(!virtual && _isDefined(index)) {
            that._displayedArgumentAxisIndex = index;
        }

        return axis;
    },

    _getTrackerSettings: function() {
        return _extend(this.callBase(), {
            argumentAxis: this._argumentAxes[this._displayedArgumentAxisIndex]
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

    _legendDataField: "series",

    _adjustSeriesLabels: _noop,

    _correctValueAxes: _noop
});

exports.AdvancedChart = AdvancedChart;
