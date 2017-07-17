"use strict";

//there are pie, doughnut
var $ = require("../../core/renderer"),
    noop = require("../../core/utils/common").noop,
    scatterSeries = require("./scatter_series"),
    vizUtils = require("../core/utils"),
    extend = require("../../core/utils/extend").extend,

    chartScatterSeries = scatterSeries.chart,
    barSeries = require("./bar_series").chart.bar,

    _extend = extend,
    _each = $.each,
    _noop = noop,

    _map = vizUtils.map,

    _isFinite = isFinite,
    _max = Math.max,

    ANIMATION_DURATION = 0.7,
    INSIDE = "inside";

exports.pie = _extend({}, barSeries, {
    _setGroupsSettings: chartScatterSeries._setGroupsSettings,

    _createErrorBarGroup: _noop,

    _drawPoint: function(options) {
        var point = options.point,
            legendCallback = this._legendCallback;

        chartScatterSeries._drawPoint.call(this, options);
        !point.isVisible() && point.setInvisibility();
        point.isSelected() && legendCallback();
    },

    adjustLabels: function() {
        var that = this,
            points = that._points || [],
            maxLabelLength,
            labelsBBoxes = [];

        _each(points, function(_, point) {
            if(point._label.isVisible()) {
                point.setLabelTrackerData();
                if(point._label.getLayoutOptions().position !== INSIDE) {
                    point.setLabelEllipsis();
                    labelsBBoxes.push(point._label.getBoundingRect().width);
                }
            }
        });
        if(labelsBBoxes.length) {
            maxLabelLength = _max.apply(null, labelsBBoxes);
        }

        _each(points, function(_, point) {
            if(point._label.isVisible() && point._label.getLayoutOptions().position !== INSIDE) {
                point.setMaxLabelLength(maxLabelLength);
                point.updateLabelCoord();
            }
        });
    },

    _processRange: _noop,

    _applyElementsClipRect: _noop,

    getColor: _noop,

    areErrorBarsVisible: _noop,

    _prepareSeriesToDrawing: _noop,

    _endUpdateData: function() {
        this._arrayArguments = {};
        chartScatterSeries._prepareSeriesToDrawing.call(this);
    },

    drawLabelsWOPoints: function() {
        var that = this;

        if(that._options.label.position === INSIDE) {
            return false;
        }

        that._labelsGroup.append(that._extGroups.labelsGroup);
        (that._points || []).forEach(function(point) {
            point.drawLabel();
        });

        return true;
    },

    _getCreatingPointOptions: function(data) {
        return this._getPointOptions(data);
    },

    _updateOptions: function(options) {
        this.labelSpace = 0;
        this.innerRadius = this.type === "pie" ? 0 : options.innerRadius;
    },

    _checkData: function(data) {
        var base = barSeries._checkData(data);
        return this._options.paintNullPoints ? base : base && data.value !== null;
    },

    _createGroups: chartScatterSeries._createGroups,

    _setMarkerGroupSettings: function() {
        var that = this;
        that._markersGroup.attr({ "class": "dxc-markers" });
    },

    _getMainColor: function(data) {
        var that = this,
            arr = that._arrayArguments || {},
            argument = data.argument;

        arr[argument] = ++arr[argument] || 0;
        that._arrayArguments = arr;
        return that._options.mainSeriesColor(argument, arr[argument]);
    },

    _getPointOptions: function(data) {
        return this._parsePointOptions(this._preparePointOptions(), this._options.label, data);
    },

    _getRangeData: function() {
        return this._rangeData;
    },

    _getArrangeTotal: function(points) {
        var total = 0;
        _each(points, function(_, point) {
            if(point.isVisible()) {
                total += point.initialValue;
            }
        });
        return total;
    },

    _createPointStyles: function(pointOptions, data) {
        var that = this,
            mainColor = pointOptions.color || that._getMainColor(data);

        return {
            normal: that._parsePointStyle(pointOptions, mainColor, mainColor),
            hover: that._parsePointStyle(pointOptions.hoverStyle, mainColor, mainColor),
            selection: that._parsePointStyle(pointOptions.selectionStyle, mainColor, mainColor),
            legendStyles: {
                normal: that._createLegendState(pointOptions, mainColor),
                hover: that._createLegendState(pointOptions.hoverStyle, mainColor),
                selection: that._createLegendState(pointOptions.selectionStyle, mainColor)
            }
        };
    },

    _getArrangeMinShownValue: function(points, total) {
        var minSegmentSize = this._options.minSegmentSize,
            totalMinSegmentSize = 0,
            totalNotMinValues = 0;

        total = total || points.length;

        _each(points, function(_, point) {
            if(point.isVisible()) {
                if(point.initialValue < minSegmentSize * total / 360) {
                    totalMinSegmentSize += minSegmentSize;
                } else {
                    totalNotMinValues += point.initialValue;
                }
            }
        });

        return totalMinSegmentSize < 360 ? minSegmentSize * totalNotMinValues / (360 - totalMinSegmentSize) : 0;
    },

    _applyArrangeCorrection: function(points, minShownValue, total) {
        var options = this._options,
            isClockWise = options.segmentsDirection !== "anticlockwise",
            shiftedAngle = _isFinite(options.startAngle) ? vizUtils.normalizeAngle(options.startAngle) : 0,
            minSegmentSize = options.minSegmentSize,
            percent,
            correction = 0,
            zeroTotalCorrection = 0;

        if(total === 0) {
            total = points.filter(function(el) { return el.isVisible(); }).length;
            zeroTotalCorrection = 1;
        }

        _each(isClockWise ? points : points.concat([]).reverse(), function(_, point) {
            var val = point.isVisible() ? zeroTotalCorrection || point.initialValue : 0,
                updatedZeroValue;

            if(minSegmentSize && point.isVisible() && val < minShownValue) {
                updatedZeroValue = minShownValue;
            }
            percent = val / total;
            point.correctValue(correction, percent, zeroTotalCorrection + (updatedZeroValue || 0));
            point.shiftedAngle = shiftedAngle;
            correction = correction + (updatedZeroValue || val);
        });
        this._rangeData = { val: { min: 0, max: correction } };
    },

    _removePoint: function(point) {
        var points = this.getPointsByArg(point.argument);
        points.splice(points.indexOf(point), 1); //T485210
        point.dispose();
    },

    arrangePoints: function() {
        var that = this,
            originalPoints = that._originalPoints || [],
            minSegmentSize = that._options.minSegmentSize,
            minShownValue,
            total,
            isAllPointsNegative = true,
            points,
            i = 0,
            len = originalPoints.length;

        while(i < len && isAllPointsNegative) {
            isAllPointsNegative = originalPoints[i].value <= 0;
            i++;
        }

        points = that._originalPoints = that._points = _map(originalPoints, function(point) {
            if(point.value === null || (!isAllPointsNegative && point.value < 0)) {
                that._removePoint(point);
                return null;
            } else {
                return point;
            }
        });

        total = that._getArrangeTotal(points);
        if(minSegmentSize) {
            minShownValue = this._getArrangeMinShownValue(points, total);
        }
        that._applyArrangeCorrection(points, minShownValue, total);
    },

    correctPosition: function(correction, canvas) {
        ///#DEBUG
        var debug = require("../../core/utils/console").debug;
        debug.assert(correction, "correction was not passed");
        debug.assertParam(correction.centerX, "correction.centerX was not passed");
        debug.assertParam(correction.centerY, "correction.centerY was not passed");
        debug.assertParam(correction.radiusInner, "correction.radiusInner was not passed");
        debug.assertParam(correction.radiusOuter, "correction.radiusOuter was not passed");
        debug.assertParam(canvas, "correction.canvas was not passed");
        ///#ENDDEBUG
        _each(this._points, function(_, point) {
            point.correctPosition(correction);
        });
        this.setVisibleArea(canvas);
    },

    correctRadius: function(correction) {
        _each(this._points, function(_, point) {
            point.correctRadius(correction);
        });
    },

    correctLabelRadius: function(labelRadius) {
        _each(this._points, function(_, point) {
            point.correctLabelRadius(labelRadius);
        });
    },

    setVisibleArea: function(canvas) {
        this._visibleArea = {
            minX: canvas.left,
            maxX: canvas.width - canvas.right,
            minY: canvas.top,
            maxY: canvas.height - canvas.bottom
        };
    },

    _applyVisibleArea: _noop,

    _animate: function(firstDrawing) {
        var that = this,
            points = that._points,
            pointsCount = points && (points.length),
            completeFunc = function() {
                that._animateComplete();
            },
            animatePoint;

        if(firstDrawing) {
            animatePoint = function(p, i) {
                p.animate(i === pointsCount - 1 ? completeFunc : undefined, ANIMATION_DURATION, (1 - ANIMATION_DURATION) * i / (pointsCount - 1));
            };
        } else {
            animatePoint = function(p, i) {
                p.animate(i === pointsCount - 1 ? completeFunc : undefined);
            };
        }
        points.forEach(animatePoint);
    },

    getVisiblePoints: function() {
        return _map(this._points, function(p) { return p.isVisible() ? p : null; });
    },

    getPointsByKeys: function(arg, argumentIndex) {
        var pointsByArg = this.getPointsByArg(arg);
        return pointsByArg[argumentIndex] && [pointsByArg[argumentIndex]] || pointsByArg;
    }
});

exports.doughnut = exports.donut = exports.pie;
