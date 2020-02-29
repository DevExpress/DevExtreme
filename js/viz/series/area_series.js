// there are area, steparea, stackedarea, fullstackedarea, splinearea
const objectUtils = require('../../core/utils/object');
const extend = require('../../core/utils/extend').extend;
const scatterSeries = require('./scatter_series').chart;
const lineSeries = require('./line_series');
const chartLineSeries = lineSeries.chart.line;
const polarLineSeries = lineSeries.polar.line;
const _map = require('../core/utils').map;
const _extend = extend;
const calculateBezierPoints = lineSeries.chart['spline']._calculateBezierPoints;

exports.chart = {};
exports.polar = {};

const baseAreaMethods = {

    _createBorderElement: chartLineSeries._createMainElement,

    _createLegendState: function(styleOptions, defaultColor) {
        return {
            fill: styleOptions.color || defaultColor,
            opacity: styleOptions.opacity,
            hatching: styleOptions.hatching
        };
    },

    getValueRangeInitialValue: function() {
        if(this.valueAxisType !== 'logarithmic' && this.valueType !== 'datetime' && this.showZero !== false) {
            return 0;
        } else {
            return scatterSeries.getValueRangeInitialValue.call(this);
        }
    },

    _getDefaultSegment: function(segment) {
        const defaultSegment = chartLineSeries._getDefaultSegment(segment);
        defaultSegment.area = defaultSegment.line.concat(defaultSegment.line.slice().reverse());
        return defaultSegment;
    },

    _updateElement: function(element, segment, animate, complete) {
        const lineParams = { points: segment.line };
        const areaParams = { points: segment.area };
        const borderElement = element.line;
        if(animate) {
            borderElement && borderElement.animate(lineParams);
            element.area.animate(areaParams, {}, complete);
        } else {
            borderElement && borderElement.attr(lineParams);
            element.area.attr(areaParams);
        }
    },

    _removeElement: function(element) {
        element.line && element.line.remove();
        element.area.remove();
    },

    _drawElement: function(segment) {
        return {
            line: this._bordersGroup && this._createBorderElement(segment.line, { 'stroke-width': this._styles.normal.border['stroke-width'] }).append(this._bordersGroup),
            area: this._createMainElement(segment.area).append(this._elementsGroup)
        };
    },

    _applyStyle: function(style) {
        const that = this;

        that._elementsGroup && that._elementsGroup.smartAttr(style.elements);
        that._bordersGroup && that._bordersGroup.attr(style.border);
        (that._graphics || []).forEach(function(graphic) {
            graphic.line && graphic.line.attr({ 'stroke-width': style.border['stroke-width'] }).sharp();
        });
    },

    _parseStyle: function(options, defaultColor, defaultBorderColor) {
        const borderOptions = options.border || {};
        const borderStyle = chartLineSeries._parseLineOptions(borderOptions, defaultBorderColor);

        borderStyle.stroke = (borderOptions.visible && borderStyle['stroke-width']) ? borderStyle.stroke : 'none';
        borderStyle['stroke-width'] = borderStyle['stroke-width'] || 1;

        return {
            border: borderStyle,
            elements: {
                stroke: 'none',
                fill: options.color || defaultColor,
                hatching: options.hatching,
                opacity: options.opacity
            }
        };
    },

    _areBordersVisible: function() {
        const options = this._options;
        return options.border.visible || options.hoverStyle.border.visible || options.selectionStyle.border.visible;
    },

    _createMainElement: function(points, settings) {
        return this._renderer.path(points, 'area').attr(settings);
    },

    _getTrackerSettings: function(segment) {
        return { 'stroke-width': segment.singlePointSegment ? this._defaultTrackerWidth : 0 };
    },

    _getMainPointsFromSegment: function(segment) {
        return segment.area;
    }
};

function createAreaPoints(points) {
    return _map(points, function(pt) {
        return pt.getCoords();
    }).concat(_map(points.slice().reverse(), function(pt) {
        return pt.getCoords(true);
    }));
}

const areaSeries = exports.chart['area'] = _extend({}, chartLineSeries, baseAreaMethods, {
    _prepareSegment(points, rotated) {
        const that = this;
        const processedPoints = that._processSinglePointsAreaSegment(points, rotated);
        const areaPoints = createAreaPoints(processedPoints);
        const argAxis = that.getArgumentAxis();

        if(argAxis.getAxisPosition) {
            const argAxisPosition = argAxis.getAxisPosition();
            const axisOptions = argAxis.getOptions();
            const edgeOffset = (!rotated ? -1 : 1) * Math.round(axisOptions.width / 2);
            if(axisOptions.visible) {
                areaPoints.forEach((p, i) => {
                    if(p) {
                        const index = points.length === 1 ? 0 : (i < points.length ? i : areaPoints.length - 1 - i);
                        rotated && p.x === points[index].defaultX && p.x === argAxisPosition - argAxis.getAxisShift() && (p.x += edgeOffset);
                        !rotated && p.y === points[index].defaultY && p.y === argAxisPosition - argAxis.getAxisShift() && (p.y += edgeOffset);
                    }
                });
            }
        }

        return {
            line: processedPoints,
            area: areaPoints,
            singlePointSegment: processedPoints !== points
        };
    },
    _processSinglePointsAreaSegment: function(points, rotated) {
        if(points && points.length === 1) {
            const p = points[0];
            const p1 = objectUtils.clone(p);
            p1[rotated ? 'y' : 'x'] += 1;
            p1.argument = null;
            return [p, p1];
        }
        return points;
    }
});

exports.polar['area'] = _extend({}, polarLineSeries, baseAreaMethods, {
    _prepareSegment: function(points, rotated, lastSegment) {
        lastSegment && polarLineSeries._closeSegment.call(this, points);

        return areaSeries._prepareSegment.call(this, points);
    },
    _processSinglePointsAreaSegment: function(points) {
        return lineSeries.polar.line._prepareSegment.call(this, points).line;
    }
});

exports.chart['steparea'] = _extend({}, areaSeries, {
    _prepareSegment: function(points, rotated) {
        const stepLineSeries = lineSeries.chart['stepline'];
        points = areaSeries._processSinglePointsAreaSegment(points, rotated);
        return areaSeries._prepareSegment.call(this, stepLineSeries._calculateStepLinePoints.call(this, points), rotated);
    },

    getSeriesPairCoord: lineSeries.chart['stepline'].getSeriesPairCoord
});

exports.chart['splinearea'] = _extend({}, areaSeries, {
    _areaPointsToSplineAreaPoints: function(areaPoints) {
        const previousMiddlePoint = areaPoints[areaPoints.length / 2 - 1];
        const middlePoint = areaPoints[areaPoints.length / 2];
        areaPoints.splice(areaPoints.length / 2, 0, { x: previousMiddlePoint.x, y: previousMiddlePoint.y }, { x: middlePoint.x, y: middlePoint.y });
        ///#DEBUG
        if(previousMiddlePoint.defaultCoords) {
            areaPoints[areaPoints.length / 2].defaultCoords = true;
        }
        if(middlePoint.defaultCoords) {
            areaPoints[areaPoints.length / 2 - 1].defaultCoords = true;
        }
        ///#ENDDEBUG
    },

    _prepareSegment: function(points, rotated) {
        const processedPoints = areaSeries._processSinglePointsAreaSegment(points, rotated);
        const areaSegment = areaSeries._prepareSegment.call(this, calculateBezierPoints(processedPoints, rotated));

        this._areaPointsToSplineAreaPoints(areaSegment.area);
        areaSegment.singlePointSegment = processedPoints !== points;
        return areaSegment;
    },

    _getDefaultSegment: function(segment) {
        const areaDefaultSegment = areaSeries._getDefaultSegment(segment);
        this._areaPointsToSplineAreaPoints(areaDefaultSegment.area);
        return areaDefaultSegment;
    },

    _createMainElement: function(points, settings) {
        return this._renderer.path(points, 'bezierarea').attr(settings);
    },

    _createBorderElement: lineSeries.chart['spline']._createMainElement,

    getSeriesPairCoord: lineSeries.chart['spline'].getSeriesPairCoord,

    getNearestPointsByCoord: lineSeries.chart['spline'].getNearestPointsByCoord,

    obtainCubicBezierTCoef: lineSeries.chart['spline'].obtainCubicBezierTCoef
});
