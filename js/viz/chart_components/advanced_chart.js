"use strict";

var $ = require("../../core/renderer"),
    commonUtils = require("../../core/utils/common"),
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    rangeModule = require("../translators/range"),
    DEFAULT_AXIS_NAME = "defaultAxisName",
    axisModule = require("../axes/base_axis"),
    seriesFamilyModule = require("../core/series_family"),
    BaseChart = require("./base_chart").BaseChart,
    crosshairModule = require("./crosshair"),

    _isArray = Array.isArray,
    _isDefined = commonUtils.isDefined,
    _each = $.each,
    _noop = commonUtils.noop,
    _extend = extend,
    vizUtils = require("../core/utils"),
    _map = vizUtils.map;

function getCrosshairMargins(crosshairOptions) {
    crosshairOptions = crosshairOptions || {};
    var crosshairEnabled = crosshairOptions.enabled,
        margins = crosshairModule.getMargins();

    return {
        x: crosshairEnabled && crosshairOptions.horizontalLine.visible ? margins.x : 0,
        y: crosshairEnabled && crosshairOptions.verticalLine.visible ? margins.y : 0
    };
}

function prepareAxis(axisOptions) {
    return _isArray(axisOptions) ? axisOptions.length === 0 ? [{}] : axisOptions : [axisOptions];
}

var AdvancedChart = BaseChart.inherit({
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

    _populateAxes: function() {
        var that = this,
            valueAxes = [],
            argumentAxes,
            panes = that.panes,
            rotated = that._isRotated(),
            valueAxisOptions = that.option("valueAxis") || {},
            argumentOption = that.option("argumentAxis") || {},
            argumentAxesOptions = prepareAxis(argumentOption)[0],
            valueAxesOptions = prepareAxis(valueAxisOptions),
            axisNames = [],
            valueAxesCounter = 0,
            paneWithNonVirtualAxis,
            crosshairMargins = getCrosshairMargins(that._getCrosshairOptions());

        function getNextAxisName() {
            return DEFAULT_AXIS_NAME + valueAxesCounter++;
        }

        that._disposeAxes();

        if(rotated) {
            paneWithNonVirtualAxis = argumentAxesOptions.position === "right" ? panes[panes.length - 1].name : panes[0].name;
        } else {
            paneWithNonVirtualAxis = argumentAxesOptions.position === "top" ? panes[0].name : panes[panes.length - 1].name;
        }

        argumentAxes = _map(panes, function(pane, index) {
            return that._createAxis("argumentAxis", argumentAxesOptions, {
                pane: pane.name,
                crosshairMargin: rotated ? crosshairMargins.x : crosshairMargins.y
            }, rotated, pane.name !== paneWithNonVirtualAxis, index);
        });

        _each(valueAxesOptions, function(priority, axisOptions) {
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

            _each(axisPanes, function(_, pane) {
                valueAxes.push(that._createAxis("valueAxis", axisOptions, {
                    name: name || getNextAxisName(),
                    pane: pane,
                    priority: priority,
                    crosshairMargin: rotated ? crosshairMargins.y : crosshairMargins.x
                }, rotated));
            });

        });
        //that's it. For now
        that._valueAxes = valueAxes;
        that._argumentAxes = argumentAxes;
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

    _drawAxes: function(drawOptions, panesBorderOptions) {
        this._restoreOriginalBusinessRange();
        this._prepareAxesAndDraw(drawOptions, panesBorderOptions);
    },

    _restoreOriginalBusinessRange: _noop,

    _appendAdditionalSeriesGroups: function() {
        this._crosshairCursorGroup.linkAppend();
        //this._legendGroup.linkAppend();
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
        //TODO we don't need it
        //if (that._legend) {
        //    legendHasInsidePosition && that._legendGroup.append(that._renderer.root);
        //}
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
            negativesAsZeros = themeManager.getOptions("negativesAsZeros"), //misspelling case
            familyOptions = {
                equalBarWidth: themeManager.getOptions("equalBarWidth"),
                minBubbleSize: themeManager.getOptions("minBubbleSize"),
                maxBubbleSize: themeManager.getOptions("maxBubbleSize"),
                barWidth: themeManager.getOptions("barWidth"),
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
    },

    _populateBusinessRange: function() {
        var that = this,
            businessRanges = [],
            rotated = that._isRotated(),
            argAxes = that._argumentAxes,
            argRange = new rangeModule.Range({ rotated: !!rotated }),
            groupsData = that._groupsData;

        that.businessRanges = null;

        _each(argAxes, function(_, axis) {
            argRange.addRange(axis.getRangeData());
        });

        that._valueAxes.forEach(function(valueAxis) {
            var groupRange = new rangeModule.Range({
                    rotated: !!rotated,
                    pane: valueAxis.pane,
                    axis: valueAxis.name
                }),
                groupAxisRange = valueAxis.getRangeData(),
                groupSeries = that.series.filter(function(series) {
                    return series.getValueAxis() === valueAxis;
                });

            groupRange.addRange(groupAxisRange);

            groupSeries.forEach(function(series) {
                var seriesRange = series.getRangeData();

                groupRange.addRange(seriesRange.val);
                argRange.addRange(seriesRange.arg);
            });

            if(!groupRange.isDefined()) {
                groupRange.setStubData(valueAxis.getOptions().valueType);
            }

            if(valueAxis.getOptions().showZero) {
                groupRange.correctValueZeroLevel();
            }
            groupRange.checkZeroStick();

            valueAxis.setBusinessRange(groupRange);

            businessRanges.push({ val: groupRange, arg: argRange });
        });

        argRange.sortCategories(groupsData.categories);

        if(!argRange.isDefined()) {
            argRange.setStubData(argAxes[0].getOptions().argumentType);
        }


        that._argumentAxes.forEach(function(a) {
            a.setBusinessRange(argRange);
        });

        that.businessRanges = businessRanges;
    },

    _getArgumentAxis: function() {
        return this._argumentAxes[0];
    },

    _getArgumentAxes: function() {
        return this._argumentAxes;
    },

    _getValueAxes: function() {
        return this._valueAxes;
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
        that._correctValueAxes();
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
                axis.resetAutoLabelFormat();  //B239299
            }
        });
    },

    _createAxis: function(typeSelector, userOptions, axisOptions, rotated, virtual, index) {
        var that = this,
            renderingSettings = _extend({
                renderer: that._renderer,
                incidentOccurred: that._incidentOccurred,
                axisClass: typeSelector === "argumentAxis" ? "arg" : "val",
                widgetClass: "dxc",
                stripsGroup: that._stripsGroup,
                labelAxesGroup: that._labelAxesGroup,
                constantLinesGroup: that._constantLinesGroup,
                axesContainerGroup: that._axesGroup,
                gridGroup: that._gridGroup
            }, that._getAxisRenderingOptions(typeSelector)),
            axis,
            preparedUserOptions = that._prepareStripsAndConstantLines(typeSelector, userOptions, rotated),
            options = _extend(true, {}, preparedUserOptions, axisOptions, that._prepareAxisOptions(typeSelector, preparedUserOptions, rotated));

        if(virtual) {
            options.visible = options.tick.visible = options.minorTick.visible = options.label.visible = false;
            options.title = {};
        }
        axis = new axisModule.Axis(renderingSettings);
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

    _adjustSeries: _noop,

    _correctValueAxes: _noop
});

exports.AdvancedChart = AdvancedChart;
