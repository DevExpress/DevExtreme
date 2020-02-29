// there are pie, doughnut
const noop = require('../../core/utils/common').noop;
const each = require('../../core/utils/iterator').each;
const scatterSeries = require('./scatter_series');
const vizUtils = require('../core/utils');
const extend = require('../../core/utils/extend').extend;

const chartScatterSeries = scatterSeries.chart;
const barSeries = require('./bar_series').chart.bar;

const _extend = extend;
const _each = each;
const _noop = noop;

const _map = vizUtils.map;

const _isFinite = isFinite;
const _max = Math.max;

const ANIMATION_DURATION = 0.7;
const INSIDE = 'inside';

exports.pie = _extend({}, barSeries, {
    _setGroupsSettings: function() {
        chartScatterSeries._setGroupsSettings.apply(this, arguments);
        this._labelsGroup.attr({ 'pointer-events': null });
    },

    _createErrorBarGroup: _noop,

    _drawPoint: function(options) {
        const point = options.point;
        const legendCallback = this._legendCallback;

        chartScatterSeries._drawPoint.call(this, options);
        !point.isVisible() && point.setInvisibility();
        point.isSelected() && legendCallback();
    },

    _getOldPoint: function(data, oldPointsByArgument, index) {
        const point = (this._points || [])[index];
        if(point) {
            oldPointsByArgument[point.argument.valueOf()] = oldPointsByArgument[point.argument.valueOf()].filter(p => p !== point);
        }
        return point;
    },

    adjustLabels: function(moveLabelsFromCenter) {
        return (this._points || []).reduce((r, p) => {
            if(p._label.isVisible()) {
                p.setLabelTrackerData();
                r = p.applyWordWrap(moveLabelsFromCenter) || r;
                p.updateLabelCoord(moveLabelsFromCenter);
                return r;
            }
        }, false);
    },

    _applyElementsClipRect: _noop,

    getColor: _noop,

    areErrorBarsVisible: _noop,

    drawLabelsWOPoints: function() {
        const that = this;

        if(that._options.label.position === INSIDE) {
            return false;
        }

        that._labelsGroup.append(that._extGroups.labelsGroup);
        (that._points || []).forEach(function(point) {
            point.drawLabel();
        });

        return true;
    },

    getPointsCount: function() {
        return this._data.filter(d => this._checkData(d)).length;
    },

    setMaxPointsCount: function(count) {
        this._pointsCount = count;
    },

    _getCreatingPointOptions: function(data, dataIndex) {
        return this._getPointOptions(data, dataIndex);
    },

    _updateOptions: function(options) {
        this.labelSpace = 0;
        this.innerRadius = this.type === 'pie' ? 0 : options.innerRadius;
    },

    _checkData: function(data, skippedFields) {
        const base = barSeries._checkData.call(this, data, skippedFields, { value: this.getValueFields()[0] });
        return this._options.paintNullPoints ? base : base && data.value !== null;
    },

    _createGroups: chartScatterSeries._createGroups,

    _setMarkerGroupSettings: function() {
        this._markersGroup.attr({ 'class': 'dxc-markers' });
    },

    _getMainColor(data, point) {
        const pointsByArg = this.getPointsByArg(data.argument);
        const argumentIndex = point ? pointsByArg.indexOf(point) : pointsByArg.length;

        return this._options.mainSeriesColor(data.argument, argumentIndex, this._pointsCount);
    },

    _getPointOptions: function(data) {
        return this._parsePointOptions(this._preparePointOptions(), this._options.label, data);
    },

    _getRangeData: function() {
        return this._rangeData;
    },

    _createPointStyles: function(pointOptions, data, point) {
        const that = this;
        const mainColor = pointOptions.color || that._getMainColor(data, point);

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
        const minSegmentSize = this._options.minSegmentSize;
        let totalMinSegmentSize = 0;
        let totalNotMinValues = 0;

        total = total || points.length;

        _each(points, function(_, point) {
            if(point.isVisible()) {
                if(point.normalInitialValue < minSegmentSize * total / 360) {
                    totalMinSegmentSize += minSegmentSize;
                } else {
                    totalNotMinValues += point.normalInitialValue;
                }
            }
        });

        return totalMinSegmentSize < 360 ? minSegmentSize * totalNotMinValues / (360 - totalMinSegmentSize) : 0;
    },

    _applyArrangeCorrection: function(points, minShownValue, total) {
        const options = this._options;
        const isClockWise = options.segmentsDirection !== 'anticlockwise';
        const shiftedAngle = _isFinite(options.startAngle) ? vizUtils.normalizeAngle(options.startAngle) : 0;
        const minSegmentSize = options.minSegmentSize;
        let percent;
        let correction = 0;
        let zeroTotalCorrection = 0;

        if(total === 0) {
            total = points.filter(function(el) { return el.isVisible(); }).length;
            zeroTotalCorrection = 1;
        }

        _each(isClockWise ? points : points.concat([]).reverse(), function(_, point) {
            const val = point.isVisible() ? zeroTotalCorrection || point.normalInitialValue : 0;
            let updatedZeroValue;

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
        const points = this.getPointsByArg(point.argument);
        points.splice(points.indexOf(point), 1); // T485210
        point.dispose();
    },

    arrangePoints: function() {
        const that = this;
        const originalPoints = that._points || [];
        const minSegmentSize = that._options.minSegmentSize;
        let minShownValue;
        let total;
        let isAllPointsNegative = true;
        let points;
        let i = 0;
        const len = originalPoints.length;
        let maxValue;

        while(i < len && isAllPointsNegative) {
            isAllPointsNegative = originalPoints[i].value <= 0;
            i++;
        }

        points = that._points = _map(originalPoints, function(point) {
            if(point.value === null || (!isAllPointsNegative && point.value < 0)) {
                that._removePoint(point);
                return null;
            } else {
                return point;
            }
        });

        maxValue = points.reduce(function(max, p) {
            return _max(max, Math.abs(p.initialValue));
        }, 0);
        points.forEach(function(p) {
            p.normalInitialValue = p.initialValue / (maxValue !== 0 ? maxValue : 1);
        });

        total = points.reduce(function(total, point) {
            return total + (point.isVisible() ? point.normalInitialValue : 0);
        }, 0);
        if(minSegmentSize) {
            minShownValue = this._getArrangeMinShownValue(points, total);
        }
        that._applyArrangeCorrection(points, minShownValue, total);
    },

    correctPosition: function(correction, canvas) {
        ///#DEBUG
        const debug = require('../../core/utils/console').debug;
        debug.assert(correction, 'correction was not passed');
        debug.assertParam(correction.centerX, 'correction.centerX was not passed');
        debug.assertParam(correction.centerY, 'correction.centerY was not passed');
        debug.assertParam(correction.radiusInner, 'correction.radiusInner was not passed');
        debug.assertParam(correction.radiusOuter, 'correction.radiusOuter was not passed');
        debug.assertParam(canvas, 'correction.canvas was not passed');
        ///#ENDDEBUG
        _each(this._points, function(_, point) {
            point.correctPosition(correction);
        });
        this.setVisibleArea(canvas);
    },

    correctRadius: function(correction) {
        this._points.forEach(function(point) {
            point.correctRadius(correction);
        });
    },

    correctLabelRadius: function(labelRadius) {
        this._points.forEach(function(point) {
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
        const that = this;
        const points = that._points;
        const pointsCount = points && (points.length);
        const completeFunc = function() {
            that._animateComplete();
        };
        let animatePoint;

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
        const pointsByArg = this.getPointsByArg(arg);
        return pointsByArg[argumentIndex] && [pointsByArg[argumentIndex]] || [];
    }
});

exports.doughnut = exports.donut = exports.pie;
