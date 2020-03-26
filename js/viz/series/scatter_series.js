const _extend = require('../../core/utils/extend').extend;
const inArray = require('../../core/utils/array').inArray;
const _each = require('../../core/utils/iterator').each;
const rangeCalculator = require('./helpers/range_data_calculator');
const typeUtils = require('../../core/utils/type');
const vizUtils = require('../core/utils');

const _noop = require('../../core/utils/common').noop;
const _isDefined = typeUtils.isDefined;
const _isString = typeUtils.isString;
const _map = vizUtils.map;
const _normalizeEnum = vizUtils.normalizeEnum;
const math = Math;
const _abs = math.abs;
const _sqrt = math.sqrt;
const _max = math.max;

const DEFAULT_TRACKER_WIDTH = 12;
const DEFAULT_DURATION = 400;

const HIGH_ERROR = 'highError';
const LOW_ERROR = 'lowError';

const VARIANCE = 'variance';
const STANDARD_DEVIATION = 'stddeviation';
const STANDARD_ERROR = 'stderror';
const PERCENT = 'percent';
const FIXED = 'fixed';
const UNDEFINED = 'undefined';

const DISCRETE = 'discrete';
const LOGARITHMIC = 'logarithmic';
const DATETIME = 'datetime';

exports.chart = {};
exports.polar = {};

function sum(array) {
    let result = 0;
    _each(array, function(_, value) {
        result += value;
    });
    return result;
}

function isErrorBarTypeCorrect(type) {
    // TODO why UNDEFINED is here
    // return inArray(type, [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR, UNDEFINED]) !== -1;
    return inArray(type, [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR]) !== -1;
}

function variance(array, expectedValue) {
    return sum(_map(array, function(value) {
        return (value - expectedValue) * (value - expectedValue);
    })) / array.length;
}

function calculateAvgErrorBars(result, data, series) {
    const errorBarsOptions = series.getOptions().valueErrorBar;
    const valueField = series.getValueFields()[0];
    const lowValueField = errorBarsOptions.lowValueField || LOW_ERROR;
    const highValueField = errorBarsOptions.highValueField || HIGH_ERROR;

    if(series.areErrorBarsVisible() && errorBarsOptions.type === undefined) {
        const fusionData = data.reduce(function(result, item) {
            if(_isDefined(item[lowValueField])) {
                result[0] += item[valueField] - item[lowValueField];
                result[1]++;
            }
            if(_isDefined(item[highValueField])) {
                result[2] += item[highValueField] - item[valueField];
                result[3]++;
            }

            return result;
        }, [0, 0, 0, 0]);

        if(fusionData[1]) {
            result[lowValueField] = result[valueField] - fusionData[0] / fusionData[1];
        }
        if(fusionData[2]) {
            result[highValueField] = result[valueField] + fusionData[2] / fusionData[3];
        }
    }

    return result;
}
function calculateSumErrorBars(result, data, series) {
    const errorBarsOptions = series.getOptions().valueErrorBar;
    const lowValueField = errorBarsOptions.lowValueField || LOW_ERROR;
    const highValueField = errorBarsOptions.highValueField || HIGH_ERROR;

    if(series.areErrorBarsVisible() && errorBarsOptions.type === undefined) {
        result[lowValueField] = 0;
        result[highValueField] = 0;
        result = data.reduce(function(result, item) {
            result[lowValueField] += item[lowValueField];
            result[highValueField] += item[highValueField];

            return result;
        }, result);
    }

    return result;
}

function getMinMaxAggregator(compare) {
    return ({ intervalStart, data }, series) => {
        const valueField = series.getValueFields()[0];
        let targetData = data[0];

        targetData = data.reduce((result, item) => {
            const value = item[valueField];
            if(result[valueField] === null) {
                result = item;
            }
            if(value !== null && compare(value, result[valueField])) {
                return item;
            }
            return result;
        }, targetData);

        return _extend({}, targetData, {
            [series.getArgumentField()]: intervalStart
        });
    };
}

function checkFields(data, fieldsToCheck, skippedFields) {
    let allFieldsIsValid = true;

    for(const field in fieldsToCheck) {
        const isArgument = field === 'argument';
        if((isArgument || field === 'size') ? !_isDefined(data[field]) : data[field] === undefined) {
            const selector = fieldsToCheck[field];
            if(!isArgument) {
                skippedFields[selector] = (skippedFields[selector] || 0) + 1;
            }
            allFieldsIsValid = false;
        }
    }
    return allFieldsIsValid;
}

const baseScatterMethods = {
    _defaultDuration: DEFAULT_DURATION,

    _defaultTrackerWidth: DEFAULT_TRACKER_WIDTH,

    _applyStyle: _noop,

    _updateOptions: _noop,

    _parseStyle: _noop,

    _prepareSegment: _noop,

    _drawSegment: _noop,

    _appendInGroup: function() {
        this._group.append(this._extGroups.seriesGroup);
    },

    _createLegendState: function(styleOptions, defaultColor) {
        return {
            fill: styleOptions.color || defaultColor,
            hatching: styleOptions.hatching ? _extend({}, styleOptions.hatching, { direction: 'right' }) : undefined
        };
    },

    _applyElementsClipRect: function(settings) {
        settings['clip-path'] = this._paneClipRectID;
    },

    _applyMarkerClipRect: function(settings) {
        settings['clip-path'] = this._forceClipping ? this._paneClipRectID : null;
    },

    _createGroup: function(groupName, parent, target, settings) {
        const group = parent[groupName] = parent[groupName] || this._renderer.g();
        target && group.append(target);
        settings && group.attr(settings);
    },

    _applyClearingSettings: function(settings) {
        settings.opacity = null;
        settings.scale = null;
        if(this._options.rotated) {
            settings.translateX = null;
        } else {
            settings.translateY = null;
        }
    },

    _createGroups: function() {
        const that = this;
        that._createGroup('_markersGroup', that, that._group);
        that._createGroup('_labelsGroup', that);
    },

    _setMarkerGroupSettings: function() {
        const that = this;
        const settings = that._createPointStyles(that._getMarkerGroupOptions()).normal;
        settings['class'] = 'dxc-markers';
        settings.opacity = 1; // T172577
        that._applyMarkerClipRect(settings);
        that._markersGroup.attr(settings);
    },

    getVisibleArea: function() {
        return this._visibleArea;
    },

    areErrorBarsVisible: function() {
        const errorBarOptions = this._options.valueErrorBar;
        return errorBarOptions && this._errorBarsEnabled() && errorBarOptions.displayMode !== 'none' && (isErrorBarTypeCorrect(_normalizeEnum(errorBarOptions.type)) || (_isDefined(errorBarOptions.lowValueField) || _isDefined(errorBarOptions.highValueField)));
    },

    groupPointsByCoords(rotated) {
        const cat = [];

        _each(this.getVisiblePoints(), function(_, p) {
            const pointCoord = parseInt(rotated ? p.vy : p.vx);
            if(!cat[pointCoord]) {
                cat[pointCoord] = p;
            } else {
                Array.isArray(cat[pointCoord]) ? cat[pointCoord].push(p) : (cat[pointCoord] = [cat[pointCoord], p]);
            }
        });

        return cat;
    },

    _createErrorBarGroup: function(animationEnabled) {
        const that = this;
        const errorBarOptions = that._options.valueErrorBar;
        let settings;

        if(that.areErrorBarsVisible()) {
            settings = {
                'class': 'dxc-error-bars',
                stroke: errorBarOptions.color,
                'stroke-width': errorBarOptions.lineWidth,
                opacity: animationEnabled ? 0.001 : errorBarOptions.opacity || 1,
                'stroke-linecap': 'square',
                sharp: true,
                'clip-path': that._forceClipping ? that._paneClipRectID : that._widePaneClipRectID
            };
            that._createGroup('_errorBarGroup', that, that._group, settings);
        }
    },

    _setGroupsSettings: function(animationEnabled) {
        const that = this;
        that._setMarkerGroupSettings();
        that._setLabelGroupSettings(animationEnabled);
        that._createErrorBarGroup(animationEnabled);
    },

    _getCreatingPointOptions: function() {
        const that = this;
        let defaultPointOptions;
        let creatingPointOptions = that._predefinedPointOptions;
        let normalStyle;
        if(!creatingPointOptions) {
            defaultPointOptions = that._getPointOptions();
            that._predefinedPointOptions = creatingPointOptions = _extend(true, { styles: {} }, defaultPointOptions);
            normalStyle = defaultPointOptions.styles && defaultPointOptions.styles.normal || {};

            creatingPointOptions.styles = creatingPointOptions.styles || {};
            creatingPointOptions.styles.normal = {
                'stroke-width': normalStyle['stroke-width'],
                r: normalStyle.r,
                opacity: normalStyle.opacity
            };
        }

        return creatingPointOptions;
    },

    _getPointOptions: function() {
        return this._parsePointOptions(this._preparePointOptions(), this._options.label);
    },

    _getOptionsForPoint: function() {
        return this._options.point;
    },

    _parsePointStyle: function(style, defaultColor, defaultBorderColor, defaultSize) {
        const border = style.border || {};
        const sizeValue = style.size !== undefined ? style.size : defaultSize;
        return {
            fill: style.color || defaultColor,
            stroke: border.color || defaultBorderColor,
            'stroke-width': border.visible ? border.width : 0,
            r: sizeValue / 2 + (border.visible && sizeValue !== 0 ? ~~(border.width / 2) || 0 : 0)
        };
    },

    _createPointStyles: function(pointOptions) {
        const that = this;
        const mainPointColor = pointOptions.color || that._options.mainSeriesColor;
        const containerColor = that._options.containerBackgroundColor;
        const normalStyle = that._parsePointStyle(pointOptions, mainPointColor, mainPointColor);

        normalStyle.visibility = pointOptions.visible ? 'visible' : 'hidden';

        return {
            normal: normalStyle,
            hover: that._parsePointStyle(pointOptions.hoverStyle, containerColor, mainPointColor, pointOptions.size),
            selection: that._parsePointStyle(pointOptions.selectionStyle, containerColor, mainPointColor, pointOptions.size)
        };
    },

    _checkData: function(data, skippedFields, fieldsToCheck) {
        fieldsToCheck = fieldsToCheck || { value: this.getValueFields()[0] };
        fieldsToCheck.argument = this.getArgumentField();
        return checkFields(data, fieldsToCheck, skippedFields || {}) && data.value === data.value;
    },

    getValueRangeInitialValue: function() {
        return undefined;
    },

    _getRangeData: function() {
        return rangeCalculator.getRangeData(this);
    },

    _getPointDataSelector: function() {
        const valueField = this.getValueFields()[0];
        const argumentField = this.getArgumentField();
        const tagField = this.getTagField();
        const areErrorBarsVisible = this.areErrorBarsVisible();
        let lowValueField;
        let highValueField;

        if(areErrorBarsVisible) {
            const errorBarOptions = this._options.valueErrorBar;
            lowValueField = errorBarOptions.lowValueField || LOW_ERROR;
            highValueField = errorBarOptions.highValueField || HIGH_ERROR;
        }

        return (data) => {
            const pointData = {
                value: this._processEmptyValue(data[valueField]),
                argument: data[argumentField],
                tag: data[tagField],
                data: data
            };

            if(areErrorBarsVisible) {
                pointData.lowError = data[lowValueField];
                pointData.highError = data[highValueField];
            }
            return pointData;
        };
    },

    _errorBarsEnabled: function() {
        return (this.valueAxisType !== DISCRETE && this.valueAxisType !== LOGARITHMIC && this.valueType !== DATETIME);
    },

    _drawPoint: function(options) {
        const point = options.point;

        if(point.isInVisibleArea()) {
            point.clearVisibility();
            point.draw(this._renderer, options.groups, options.hasAnimation, options.firstDrawing);
            this._drawnPoints.push(point);
        } else {
            point.setInvisibility();
        }
    },

    _animateComplete: function() {
        const that = this;
        const animationSettings = { duration: that._defaultDuration };

        that._labelsGroup && that._labelsGroup.animate({ opacity: 1 }, animationSettings);
        that._errorBarGroup && that._errorBarGroup.animate({ opacity: (that._options.valueErrorBar).opacity || 1 }, animationSettings);
    },

    _animate: function() {
        const that = this;
        const lastPointIndex = that._drawnPoints.length - 1;

        _each(that._drawnPoints || [], function(i, p) {
            p.animate(i === lastPointIndex ? function() { that._animateComplete(); } : undefined, { translateX: p.x, translateY: p.y });
        });
    },

    _defaultAggregator: 'avg',

    _aggregators: {
        avg({ data, intervalStart }, series) {
            if(!data.length) {
                return;
            }
            const valueField = series.getValueFields()[0];
            const aggregationResult = data.reduce((result, item) => {
                const value = item[valueField];
                if(_isDefined(value)) {
                    result[0] += value;
                    result[1]++;
                } else if(value === null) {
                    result[2]++;
                }

                return result;
            }, [0, 0, 0]);

            return calculateAvgErrorBars({
                [valueField]: aggregationResult[2] === data.length ? null : aggregationResult[0] / aggregationResult[1],
                [series.getArgumentField()]: intervalStart
            }, data, series);
        },

        sum({ intervalStart, data }, series) {
            if(!data.length) {
                return;
            }

            const valueField = series.getValueFields()[0];
            const aggregationResult = data.reduce((result, item) => {
                const value = item[valueField];
                if(value !== undefined) {
                    result[0] += value;
                }
                if(value === null) {
                    result[1]++;
                } else if(value === undefined) {
                    result[2]++;
                }
                return result;
            }, [0, 0, 0]);

            let value = aggregationResult[0];

            if(aggregationResult[1] === data.length) {
                value = null;
            }

            if(aggregationResult[2] === data.length) {
                return;
            }

            return calculateSumErrorBars({
                [valueField]: value,
                [series.getArgumentField()]: intervalStart
            }, data, series);
        },

        count({ data, intervalStart }, series) {
            const valueField = series.getValueFields()[0];

            return {
                [series.getArgumentField()]: intervalStart,
                [valueField]: data.filter(i => i[valueField] !== undefined).length
            };
        },

        min: getMinMaxAggregator((a, b) => a < b),
        max: getMinMaxAggregator((a, b) => a > b)
    },

    _endUpdateData: function() {
        delete this._predefinedPointOptions;
    },

    getArgumentField: function() {
        return this._options.argumentField || 'arg';
    },

    getValueFields: function() {
        const options = this._options;
        const errorBarsOptions = options.valueErrorBar;
        const valueFields = [options.valueField || 'val'];
        let lowValueField;
        let highValueField;

        if(errorBarsOptions) {
            lowValueField = errorBarsOptions.lowValueField;
            highValueField = errorBarsOptions.highValueField;
            _isString(lowValueField) && valueFields.push(lowValueField);
            _isString(highValueField) && valueFields.push(highValueField);
        }
        return valueFields;
    },

    _calculateErrorBars: function(data) {
        if(!this.areErrorBarsVisible()) {
            return;
        }

        const that = this;
        const options = that._options;
        const errorBarsOptions = options.valueErrorBar;
        const errorBarType = _normalizeEnum(errorBarsOptions.type);
        let floatErrorValue = parseFloat(errorBarsOptions.value);
        const valueField = that.getValueFields()[0];
        let value;
        const lowValueField = errorBarsOptions.lowValueField || LOW_ERROR;
        const highValueField = errorBarsOptions.highValueField || HIGH_ERROR;
        let valueArray;
        let valueArrayLength;
        let meanValue;
        let processDataItem;
        const addSubError = function(_i, item) {
            value = item.value;
            item.lowError = value - floatErrorValue;
            item.highError = value + floatErrorValue;
        };

        switch(errorBarType) {
            case FIXED:
                processDataItem = addSubError;
                break;
            case PERCENT:
                processDataItem = function(_, item) {
                    value = item.value;
                    const error = value * floatErrorValue / 100;
                    item.lowError = value - error;
                    item.highError = value + error;
                };
                break;
            case UNDEFINED: // TODO: rework this
                processDataItem = function(_, item) {
                    item.lowError = item.data[lowValueField];
                    item.highError = item.data[highValueField];
                };
                break;
            default:
                valueArray = _map(data, function(item) { return _isDefined(item.data[valueField]) ? item.data[valueField] : null; });
                valueArrayLength = valueArray.length;
                floatErrorValue = floatErrorValue || 1;
                switch(errorBarType) {
                    case VARIANCE:
                        floatErrorValue = variance(valueArray, sum(valueArray) / valueArrayLength) * floatErrorValue;
                        processDataItem = addSubError;
                        break;
                    case STANDARD_DEVIATION:
                        meanValue = sum(valueArray) / valueArrayLength;
                        floatErrorValue = _sqrt(variance(valueArray, meanValue)) * floatErrorValue;
                        processDataItem = function(_, item) {
                            item.lowError = meanValue - floatErrorValue;
                            item.highError = meanValue + floatErrorValue;
                        };
                        break;
                    case STANDARD_ERROR:
                        floatErrorValue = _sqrt(variance(valueArray, sum(valueArray) / valueArrayLength) / valueArrayLength) * floatErrorValue;
                        processDataItem = addSubError;
                        break;
                }
        }

        processDataItem && _each(data, processDataItem);
    },

    _patchMarginOptions: function(options) {
        const pointOptions = this._getCreatingPointOptions();
        const styles = pointOptions.styles;
        const maxSize = [styles.normal, styles.hover, styles.selection]
            .reduce(function(max, style) {
                return _max(max, style.r * 2 + style['stroke-width']);
            }, 0);

        options.size = pointOptions.visible ? maxSize : 0;
        options.sizePointNormalState = pointOptions.visible ? styles.normal.r * 2 + styles.normal['stroke-width'] : 2;

        return options;
    },

    usePointsToDefineAutoHiding() {
        return true;
    }
};

exports.chart = _extend({}, baseScatterMethods, {
    drawTrackers: function() {
        const that = this;
        let trackers;
        let trackersGroup;
        const segments = that._segments || [];
        const rotated = that._options.rotated;

        if(!that.isVisible()) {
            return;
        }

        if(segments.length) {
            trackers = that._trackers = that._trackers || [];
            trackersGroup = that._trackersGroup = (that._trackersGroup || that._renderer.g().attr({
                fill: 'gray',
                opacity: 0.001,
                stroke: 'gray',
                'class': 'dxc-trackers'
            })).attr({ 'clip-path': this._paneClipRectID || null }).append(that._group);

            _each(segments, function(i, segment) {
                if(!trackers[i]) {
                    trackers[i] = that._drawTrackerElement(segment).data({ 'chart-data-series': that }).append(trackersGroup);
                } else {
                    that._updateTrackerElement(segment, trackers[i]);
                }
            });
        }

        that._trackersTranslator = that.groupPointsByCoords(rotated);
    },

    checkAxisVisibleAreaCoord(isArgument, coord) {
        const axis = isArgument ? this.getArgumentAxis() : this.getValueAxis();
        const visibleArea = axis.getVisibleArea();

        return _isDefined(coord) && visibleArea[0] <= coord && visibleArea[1] >= coord;
    },

    checkSeriesViewportCoord(axis, coord) {
        return true;
    },

    getSeriesPairCoord(coord, isArgument) {
        let oppositeCoord = null;
        const isOpposite = !isArgument && !this._options.rotated || isArgument && this._options.rotated;
        const coordName = !isOpposite ? 'vx' : 'vy';
        const oppositeCoordName = !isOpposite ? 'vy' : 'vx';
        const points = this.getVisiblePoints();

        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            const tmpCoord = p[coordName] === coord ? p[oppositeCoordName] : undefined;

            if(this.checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
                oppositeCoord = tmpCoord;
                break;
            }
        }

        return oppositeCoord;
    },

    getNearestPointsByCoord(coord, isArgument) {
        const that = this;
        const rotated = that.getOptions().rotated;
        const isOpposite = !isArgument && !rotated || isArgument && rotated;
        const coordName = isOpposite ? 'vy' : 'vx';
        const points = that.getVisiblePoints();
        const allPoints = that.getPoints();
        const nearestPoints = [];

        if(that.isVisible() && allPoints.length > 0) {
            if(allPoints.length > 1) {
                that.findNeighborPointsByCoord(coord, coordName, points.slice(0), allPoints, (point, nextPoint) => {
                    nearestPoints.push([point, nextPoint]);
                });
            } else {
                if(allPoints[0][coordName] === coord) {
                    nearestPoints.push([allPoints[0], allPoints[0]]);
                }
            }
        }

        return nearestPoints;
    },

    findNeighborPointsByCoord(coord, coordName, points, allPoints, pushNeighborPoints) {
        let searchPoints = allPoints;

        if(points.length > 0) {
            points.splice(0, 0, allPoints[allPoints.indexOf(points[0]) - 1]);
            points.splice(points.length, 0, allPoints[allPoints.indexOf(points[points.length - 1]) + 1]);
            searchPoints = points;
        }

        searchPoints.forEach((p, i) => {
            const np = searchPoints[i + 1];
            if(p && np && (p[coordName] <= coord && np[coordName] >= coord || p[coordName] >= coord && np[coordName] <= coord)) {
                pushNeighborPoints(p, np);
            }
        });
    },

    getNeighborPoint: function(x, y) {
        let pCoord = this._options.rotated ? y : x;
        let nCoord = pCoord;
        const cat = this._trackersTranslator;
        let point = null;
        let minDistance;
        const oppositeCoord = this._options.rotated ? x : y;
        const oppositeCoordName = this._options.rotated ? 'vx' : 'vy';

        if(this.isVisible() && cat) {
            point = cat[pCoord];
            do {
                point = cat[nCoord] || cat[pCoord];
                pCoord--;
                nCoord++;
            } while((pCoord >= 0 || nCoord < cat.length) && !point);

            if(Array.isArray(point)) {
                minDistance = _abs(point[0][oppositeCoordName] - oppositeCoord);
                _each(point, function(i, p) {
                    const distance = _abs(p[oppositeCoordName] - oppositeCoord);
                    if(minDistance >= distance) {
                        minDistance = distance;
                        point = p;
                    }
                });
            }
        }

        return point;
    },

    _applyVisibleArea: function() {
        const that = this;
        const rotated = that._options.rotated;
        const visibleX = (rotated ? that.getValueAxis() : that.getArgumentAxis()).getVisibleArea();
        const visibleY = (rotated ? that.getArgumentAxis() : that.getValueAxis()).getVisibleArea();

        that._visibleArea = {
            minX: visibleX[0],
            maxX: visibleX[1],
            minY: visibleY[0],
            maxY: visibleY[1]
        };
    },

    getPointCenterByArg(arg) {
        const point = this.getPointsByArg(arg)[0];
        return point ? point.getCenterCoord() : undefined;
    }
});

exports.polar = _extend({}, baseScatterMethods, {
    drawTrackers: function() {
        exports.chart.drawTrackers.call(this);
        const cat = this._trackersTranslator;
        let index;

        if(!this.isVisible()) {
            return;
        }

        _each(cat, function(i, category) {
            if(category) {
                index = i;
                return false;
            }
        });

        cat[index + 360] = cat[index];
    },

    getNeighborPoint: function(x, y) {
        const pos = vizUtils.convertXYToPolar(this.getValueAxis().getCenter(), x, y);
        return exports.chart.getNeighborPoint.call(this, pos.phi, pos.r);
    },

    _applyVisibleArea: function() {
        const that = this;
        const canvas = that.getValueAxis().getCanvas();
        that._visibleArea = {
            minX: canvas.left,
            maxX: canvas.width - canvas.right,
            minY: canvas.top,
            maxY: canvas.height - canvas.bottom
        };
    },

    getSeriesPairCoord(params, isArgument) {
        let coords = null;
        const paramName = isArgument ? 'argument' : 'radius';
        const points = this.getVisiblePoints();

        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            const tmpPoint = _isDefined(p[paramName]) && _isDefined(params[paramName]) && p[paramName].valueOf() === params[paramName].valueOf() ? { x: p.x, y: p.y } : undefined;

            if(_isDefined(tmpPoint)) {
                coords = tmpPoint;
                break;
            }
        }

        return coords;
    }
});
