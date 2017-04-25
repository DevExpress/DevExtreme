"use strict";

var $ = require("jquery"),
    errors = require("../core/errors"),
    seriesConsts = require("./components/consts"),
    vizUtils = require("./core/utils"),
    commonUtils = require("../core/utils/common"),
    rangeModule = require("./translators/range"),
    registerComponent = require("../core/component_registrator"),
    baseChartModule = require("./chart_components/base_chart"),
    BaseChart = baseChartModule.BaseChart,
    overlapping = baseChartModule.overlapping,
    seriesSpacing = seriesConsts.pieSeriesSpacing,
    translator1DModule = require("./translators/translator1d"),
    OPTIONS_FOR_REFRESH_SERIES = ["startAngle", "innerRadius", "segmentsDirection", "type"],
    _extend = $.extend,
    _each = $.each,
    _noop = $.noop,
    _getVerticallyShiftedAngularCoords = require("./core/utils").getVerticallyShiftedAngularCoords,

    states = seriesConsts.states, NORMAL_STATE = states.normalMark,
    LEGEND_ACTIONS = [states.resetItem, states.applyHover, states.applySelected, states.applySelected];

function getLegendItemAction(points) {
    var state = NORMAL_STATE;

    points.forEach(function(point) {
        state = state | point.fullState;
    });
    return LEGEND_ACTIONS[state];
}

function correctPercentValue(value) {
    if(commonUtils.isNumber(value)) {
        if(value > 1) {
            value = 1;
        } else if(value < 0) {
            value = 0;
        }
    } else {
        value = undefined;
    }
    return value;
}

var dxPieChart = BaseChart.inherit({
    _setDeprecatedOptions: function() {
        this.callBase.apply(this, arguments);
        _extend(this._deprecatedOptions, {
            "series.innerRadius": { since: "15.2", message: "Use the 'innerRadius' option instead" },
            "series.startAngle": { since: "15.2", message: "Use the 'startAngle' option instead" },
            "series.segmentsDirection": { since: "15.2", message: "Use the 'segmentsDirection' option instead" },
            "series.type": { since: "15.2", message: "Use the 'type' option instead" }
        });
    },

    _chartType: "pie",

    _layoutManagerOptions: function() {
        return _extend(true, {}, this.callBase(), {
            piePercentage: correctPercentValue(this._themeManager.getOptions("diameter")),
            minPiePercentage: correctPercentValue(this._themeManager.getOptions("minDiameter"))
        });
    },

    _optionChangesMap: {
        diameter: "REINIT",
        minDiameter: "REINIT"
    },

    _groupSeries: function() {
        var series = this.series;

        this._groupsData = {
            groups: [{
                series: series,
                valueOptions: { valueType: "numeric" }
            }],
            argumentOptions: series[0] && series[0].getOptions()
        };
    },

    _populateBusinessRange: function() {
        var businessRanges = [],
            series = this.series,
            singleSeriesRange;

        this.businessRanges = null;
        _each(series, function(_, singleSeries) {
            var range = new rangeModule.Range();
            singleSeriesRange = singleSeries.getRangeData();
            range.addRange(singleSeriesRange.val);
            if(!range.isDefined()) {
                range.setStubData();
            }
            businessRanges.push(range);
        });
        this.businessRanges = businessRanges;
    },

    _specialProcessSeries: function() {
        _each(this.series, function(_, singleSeries) {
            singleSeries.arrangePoints();
        });
    },

    _createTranslator: function(range) {
        return (new translator1DModule.Translator1D())
            .setDomain(range.min, range.max)
            .setCodomain(360, 0);
    },

    _checkPaneName: function() {
        return true;
    },

    _processSingleSeries: function(singleSeries) {
        singleSeries.arrangePoints();
    },

    _getLegendTargets: function() {
        var that = this,
            itemsByArgument = {},
            items = [];

        that.series.forEach(function(series) {
            _each(series.pointsByArgument, function(argument, points) {
                points.forEach(function(point, index) {
                    var key = argument.valueOf().toString() + index;
                    itemsByArgument[key] = itemsByArgument[key] || [];
                    var argumentCount = itemsByArgument[key].push(point);
                    point.index = itemsByArgument[key][argumentCount - 2] ? itemsByArgument[key][argumentCount - 2].index : Object.keys(itemsByArgument).length - 1;
                    point.argumentIndex = index;
                });
            });
        });

        _each(itemsByArgument, function(_, points) {
            points.forEach(function(point, index) {
                if(index === 0) {
                    items.push(that._getLegendOptions(point));
                } else if(!items[items.length - 1].visible) {
                    items[items.length - 1].visible = point.isVisible();
                }
            });
        });

        return items;
    },

    _getAxisDrawingMethods: _noop,

    _getLayoutTargets: function() {
        return [{ canvas: this._canvas }];
    },

    _getAxesForTransform: function() {
        return { verticalAxes: [], horizontalAxes: [] };
    },

    _getLayoutSeries: function(series, drawOptions) {
        var that = this,
            layout,
            canvas = that._canvas,
            drawnLabels = false;

        layout = that.layoutManager.applyPieChartSeriesLayout(canvas, series, true);
        _each(series, function(i, singleSeries) {
            singleSeries.correctPosition(layout);
            drawnLabels = singleSeries.drawLabelsWOPoints(that._createTranslator(that.businessRanges[i])) || drawnLabels;
        });

        if(drawnLabels) {
            layout = that.layoutManager.applyPieChartSeriesLayout(canvas, series, drawOptions.hideLayoutLabels);
        }
        return layout;
    },

    _updateSeriesDimensions: function(drawOptions) {
        var that = this,
            visibleSeries = that._getVisibleSeries(),
            lengthVisibleSeries = visibleSeries.length,
            innerRad,
            delta,
            layout;

        if(lengthVisibleSeries) {
            layout = that._getLayoutSeries(visibleSeries, drawOptions);

            delta = (layout.radiusOuter - layout.radiusInner - seriesSpacing * (lengthVisibleSeries - 1)) / lengthVisibleSeries;
            innerRad = layout.radiusInner;

            that._setCenter({ x: layout.centerX, y: layout.centerY });

            _each(visibleSeries, function(_, singleSeries) {
                singleSeries.correctRadius({ radiusInner: innerRad, radiusOuter: innerRad + delta });
                innerRad += delta + seriesSpacing;
            });
        }
    },

    _prepareTranslators: function(_, i) {
        return this._createTranslator(this.businessRanges[i]);
    },

    _getLegendCallBack: function() {
        var that = this,
            legend = this._legend,
            items = this._getLegendTargets().map(function(i) {
                return i.legendData;
            });

        return function(target) {
            items.forEach(function(data) {
                var points = [],
                    callback = legend.getActionCallback({ index: data.id });

                that.series.forEach(function(series) {
                    var seriesPoints = series.getPointsByKeys(data.argument, data.argumentIndex);
                    points.push.apply(points, seriesPoints);
                });

                if(target && target.argument === data.argument && target.argumentIndex === data.argumentIndex) {
                    points.push(target);
                }

                callback(getLegendItemAction(points));
            });
        };
    },

    _adjustSeries: function() {
        _each(this.series, function(_, singleSeries) {
            singleSeries.adjustLabels();
        });
    },

    _prepareStackPoints: _noop,

    _resetStackPoints: _noop,

    _applyExtraSettings: _noop,

    _resolveLabelOverlappingShift: function() {
        var that = this,
            series = that.series,
            center = that._center;

        _each(series, function(_, singleSeries) {
            if(singleSeries.getOptions().label.position === "inside") {
                return;
            }
            var points = singleSeries.getVisiblePoints(),
                lPoints = [],
                rPoints = [];

            $.each(points, function(_, point) {
                var angle = vizUtils.normalizeAngle(point.middleAngle);
                (angle <= 90 || angle >= 270 ? rPoints : lPoints).push(point);
            });
            overlapping.resolveLabelOverlappingInOneDirection(lPoints, that._canvas, false, shiftFunction);
            overlapping.resolveLabelOverlappingInOneDirection(rPoints, that._canvas, false, shiftFunction);
        });
        function shiftFunction(box, length) {
            return _getVerticallyShiftedAngularCoords(box, -length, center);
        }
    },

    _setCenter: function(center) {
        this._center = center;
    },

    _disposeSeries: function() {
        this.callBase.apply(this, arguments);
        this._abstractSeries = null;
    },

    //DEPRECATED_15_2
    getSeries: function() {
        errors.log("W0002", "dxPieChart", "getSeries", "15.2", "Use the 'getAllSeries' method instead");
        return this.series[0];
    },

    _legendDataField: "point",

    _legendItemTextField: "argument",

    _updateLegendPosition: _noop,

    _renderTrackers: _noop,

    _trackerType: "PieTracker",

    _createScrollBar: _noop,

    _updateAxesLayout: _noop,

    _applyClipRects: _noop,

    _appendAdditionalSeriesGroups: _noop,

    _prepareToRender: _noop,

    _isLegendInside: _noop,

    _renderAxes: _noop,

    _isRotated: _noop,

    _seriesPopulatedHandlerCore: _noop,

    _reinitAxes: _noop,

    _correctAxes: _noop,

    _getExtraOptions: function() {
        var that = this;
        return {
            startAngle: that.option("startAngle"),
            innerRadius: that.option("innerRadius"),
            segmentsDirection: that.option("segmentsDirection"),
            type: that.option("type")
        };
    }
});

_each(OPTIONS_FOR_REFRESH_SERIES, function(_, name) {
    dxPieChart.prototype._optionChangesMap[name] = "REFRESH_SERIES_DATA_INIT";
});

registerComponent("dxPieChart", dxPieChart);

module.exports = dxPieChart;
