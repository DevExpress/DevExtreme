var extend = require("../../core/utils/extend").extend,
    each = require("../../core/utils/iterator").each,
    scatterSeries = require("./scatter_series"),
    areaSeries = require("./area_series").chart.area,
    chartSeries = scatterSeries.chart,
    polarSeries = scatterSeries.polar,
    _extend = extend,
    _each = each;

exports.chart = {};
exports.polar = {};

var baseBarSeriesMethods = {
    _createLegendState: function(styleOptions, defaultColor) {
        return {
            fill: styleOptions.color || defaultColor,
            hatching: styleOptions.hatching
        };
    },

    _parsePointStyle: function(style, defaultColor, defaultBorderColor) {
        var color = style.color || defaultColor,
            base = chartSeries._parsePointStyle.call(this, style, color, defaultBorderColor);
        base.fill = color;
        base.hatching = style.hatching;
        base.dashStyle = style.border && style.border.dashStyle || "solid";
        delete base.r;

        return base;
    },

    _applyMarkerClipRect: function(settings) {
        settings["clip-path"] = null;
    },

    _setGroupsSettings: function(animationEnabled, firstDrawing) {
        var that = this,
            settings = {};
        chartSeries._setGroupsSettings.apply(that, arguments);
        if(animationEnabled && firstDrawing) {
            settings = this._getAffineCoordOptions();
        } else if(!animationEnabled) {
            settings = { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
        }
        that._markersGroup.attr(settings);
    },

    _drawPoint: function(options) {
        options.hasAnimation = options.hasAnimation && !options.firstDrawing;
        options.firstDrawing = false;
        chartSeries._drawPoint.call(this, options);
    },

    _getMainColor: function() {
        return this._options.mainSeriesColor;
    },

    _createPointStyles: function(pointOptions) {
        var that = this,
            mainColor = pointOptions.color || that._getMainColor();

        return {
            normal: that._parsePointStyle(pointOptions, mainColor, mainColor),
            hover: that._parsePointStyle(pointOptions.hoverStyle || {}, mainColor, mainColor),
            selection: that._parsePointStyle(pointOptions.selectionStyle || {}, mainColor, mainColor)
        };
    },

    _updatePointsVisibility: function() {
        var visibility = this._options.visible;
        each(this._points, function(_, point) {
            point._options.visible = visibility;
        });
    },

    _getOptionsForPoint: function() {
        return this._options;
    },

    _animate: function(firstDrawing) {
        var that = this,
            complete = function() {
                that._animateComplete();
            },
            animateFunc = function(drawnPoints, complete) {
                var lastPointIndex = drawnPoints.length - 1;
                _each(drawnPoints || [], function(i, point) {
                    point.animate(i === lastPointIndex ? complete : undefined, point.getMarkerCoords());
                });
            };
        that._animatePoints(firstDrawing, complete, animateFunc);
    },

    getValueRangeInitialValue: areaSeries.getValueRangeInitialValue,

    _patchMarginOptions: function(options) {
        options.checkInterval = true;
        return options;
    },

    _defaultAggregator: "sum",

    _defineDrawingState() {},

    usePointsToDefineAutoHiding() {
        return false;
    }
};

exports.chart.bar = _extend({}, chartSeries, baseBarSeriesMethods, {
    _getAffineCoordOptions: function() {
        var rotated = this._options.rotated,
            direction = rotated ? "X" : "Y",
            settings = {
                scaleX: rotated ? 0.001 : 1,
                scaleY: rotated ? 1 : 0.001
            };

        settings["translate" + direction] = this.getValueAxis().getTranslator().translate("canvas_position_default");

        return settings;
    },

    _animatePoints: function(firstDrawing, complete, animateFunc) {
        var that = this;
        that._markersGroup.animate({ scaleX: 1, scaleY: 1, translateY: 0, translateX: 0 }, undefined, complete);
        if(!firstDrawing) {
            animateFunc(that._drawnPoints, complete);
        }
    },

    checkSeriesViewportCoord(axis, coord) {
        if(this._points.length === 0) {
            return false;
        }
        if(axis.isArgumentAxis) {
            return true;
        }
        const translator = axis.getTranslator();
        const range = this.getViewport();
        let min = translator.translate(range.categories ? range.categories[0] : range.min);
        let max = translator.translate(range.categories ? range.categories[range.categories.length - 1] : range.max);
        const rotated = this.getOptions().rotated;
        const inverted = axis.getOptions().inverted;

        return ((rotated && !inverted || !rotated && inverted)) ? coord >= min && coord <= max : coord >= max && coord <= min;
    },

    getSeriesPairCoord(coord, isArgument) {
        let oppositeCoord = null;
        const { rotated } = this._options;
        const isOpposite = !isArgument && !rotated || isArgument && rotated;
        const coordName = isOpposite ? "vy" : "vx";
        const oppositeCoordName = isOpposite ? "vx" : "vy";
        const points = this.getPoints();

        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            let tmpCoord;

            if(isArgument) {
                tmpCoord = p.getCenterCoord()[coordName[1]] === coord ? p[oppositeCoordName] : undefined;
            } else {
                tmpCoord = p[coordName] === coord ? p[oppositeCoordName] : undefined;
            }

            if(this.checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
                oppositeCoord = tmpCoord;
                break;
            }
        }

        return oppositeCoord;
    }
});

exports.polar.bar = _extend({}, polarSeries, baseBarSeriesMethods, {
    _animatePoints: function(firstDrawing, complete, animateFunc) {
        animateFunc(this._drawnPoints, complete);
    },

    _setGroupsSettings: chartSeries._setGroupsSettings,

    _drawPoint: function(point, groups, animationEnabled) {
        chartSeries._drawPoint.call(this, point, groups, animationEnabled);
    },

    _parsePointStyle: function(style) {
        var base = baseBarSeriesMethods._parsePointStyle.apply(this, arguments);
        base.opacity = style.opacity;
        return base;
    },

    _createGroups: chartSeries._createGroups,

    _setMarkerGroupSettings: function() {
        var that = this,
            markersSettings = that._createPointStyles(that._getMarkerGroupOptions()).normal,
            groupSettings;

        markersSettings["class"] = "dxc-markers";
        that._applyMarkerClipRect(markersSettings);
        groupSettings = _extend({}, markersSettings);
        delete groupSettings.opacity; // T110796
        that._markersGroup.attr(groupSettings);
    },

    _createLegendState: areaSeries._createLegendState,
});
