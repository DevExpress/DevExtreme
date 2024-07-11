"use strict";

exports.polar = exports.chart = void 0;
var _extend2 = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _range_data_calculator = _interopRequireDefault(require("./helpers/range_data_calculator"));
var _type = require("../../core/utils/type");
var _utils = require("../core/utils");
var _common = require("../../core/utils/common");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
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
let chart = exports.chart = {};
let polar = exports.polar = {};
function sum(array) {
  let result = 0;
  (0, _iterator.each)(array, function (_, value) {
    result += value;
  });
  return result;
}
function isErrorBarTypeCorrect(type) {
  // TODO why UNDEFINED is here
  // return inArray(type, [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR, UNDEFINED]) !== -1;
  return [FIXED, PERCENT, VARIANCE, STANDARD_DEVIATION, STANDARD_ERROR].includes(type);
}
function variance(array, expectedValue) {
  return sum((0, _utils.map)(array, function (value) {
    return (value - expectedValue) * (value - expectedValue);
  })) / array.length;
}
function calculateAvgErrorBars(result, data, series) {
  const errorBarsOptions = series.getOptions().valueErrorBar;
  const valueField = series.getValueFields()[0];
  const lowValueField = errorBarsOptions.lowValueField || LOW_ERROR;
  const highValueField = errorBarsOptions.highValueField || HIGH_ERROR;
  if (series.areErrorBarsVisible() && errorBarsOptions.type === undefined) {
    const fusionData = data.reduce(function (result, item) {
      if ((0, _type.isDefined)(item[lowValueField])) {
        result[0] += item[valueField] - item[lowValueField];
        result[1]++;
      }
      if ((0, _type.isDefined)(item[highValueField])) {
        result[2] += item[highValueField] - item[valueField];
        result[3]++;
      }
      return result;
    }, [0, 0, 0, 0]);
    if (fusionData[1]) {
      result[lowValueField] = result[valueField] - fusionData[0] / fusionData[1];
    }
    if (fusionData[2]) {
      result[highValueField] = result[valueField] + fusionData[2] / fusionData[3];
    }
  }
  return result;
}
function calculateSumErrorBars(result, data, series) {
  const errorBarsOptions = series.getOptions().valueErrorBar;
  const lowValueField = errorBarsOptions.lowValueField || LOW_ERROR;
  const highValueField = errorBarsOptions.highValueField || HIGH_ERROR;
  if (series.areErrorBarsVisible() && errorBarsOptions.type === undefined) {
    result[lowValueField] = 0;
    result[highValueField] = 0;
    result = data.reduce(function (result, item) {
      result[lowValueField] += item[lowValueField];
      result[highValueField] += item[highValueField];
      return result;
    }, result);
  }
  return result;
}
function getMinMaxAggregator(compare) {
  return (_ref, series) => {
    let {
      intervalStart,
      intervalEnd,
      data
    } = _ref;
    const valueField = series.getValueFields()[0];
    let targetData = data[0];
    targetData = data.reduce((result, item) => {
      const value = item[valueField];
      if (result[valueField] === null) {
        result = item;
      }
      if (value !== null && compare(value, result[valueField])) {
        return item;
      }
      return result;
    }, targetData);
    return (0, _extend2.extend)({}, targetData, {
      [series.getArgumentField()]: series._getIntervalCenter(intervalStart, intervalEnd)
    });
  };
}
function checkFields(data, fieldsToCheck, skippedFields) {
  let allFieldsIsValid = true;
  for (const field in fieldsToCheck) {
    const isArgument = field === 'argument';
    if (isArgument || field === 'size' ? !(0, _type.isDefined)(data[field]) : data[field] === undefined) {
      const selector = fieldsToCheck[field];
      if (!isArgument) {
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
  _applyStyle: _common.noop,
  _updateOptions: _common.noop,
  _parseStyle: _common.noop,
  _prepareSegment: _common.noop,
  _drawSegment: _common.noop,
  _appendInGroup: function () {
    this._group.append(this._extGroups.seriesGroup);
  },
  _createLegendState: function (styleOptions, defaultColor) {
    return {
      fill: (0, _utils.extractColor)(styleOptions.color, true) || defaultColor,
      hatching: styleOptions.hatching ? (0, _extend2.extend)({}, styleOptions.hatching, {
        direction: 'right'
      }) : undefined
    };
  },
  _getColorId: _common.noop,
  _applyElementsClipRect: function (settings) {
    settings['clip-path'] = this._paneClipRectID;
  },
  _applyMarkerClipRect: function (settings) {
    settings['clip-path'] = this._forceClipping ? this._paneClipRectID : null;
  },
  _createGroup: function (groupName, parent, target, settings) {
    const group = parent[groupName] = parent[groupName] || this._renderer.g();
    target && group.append(target);
    settings && group.attr(settings);
  },
  _applyClearingSettings: function (settings) {
    settings.opacity = null;
    settings.scale = null;
    if (this._options.rotated) {
      settings.translateX = null;
    } else {
      settings.translateY = null;
    }
  },
  _createGroups: function () {
    const that = this;
    that._createGroup('_markersGroup', that, that._group);
    that._createGroup('_labelsGroup', that);
  },
  _setMarkerGroupSettings: function () {
    const that = this;
    const settings = that._createPointStyles(that._getMarkerGroupOptions()).normal;
    settings['class'] = 'dxc-markers';
    settings.opacity = 1; // T172577
    that._applyMarkerClipRect(settings);
    that._markersGroup.attr(settings);
  },
  getVisibleArea: function () {
    return this._visibleArea;
  },
  areErrorBarsVisible: function () {
    const errorBarOptions = this._options.valueErrorBar;
    return errorBarOptions && this._errorBarsEnabled() && errorBarOptions.displayMode !== 'none' && (isErrorBarTypeCorrect((0, _utils.normalizeEnum)(errorBarOptions.type)) || (0, _type.isDefined)(errorBarOptions.lowValueField) || (0, _type.isDefined)(errorBarOptions.highValueField));
  },
  groupPointsByCoords(rotated) {
    const cat = [];
    (0, _iterator.each)(this.getVisiblePoints(), function (_, p) {
      const pointCoord = parseInt(rotated ? p.vy : p.vx);
      if (!cat[pointCoord]) {
        cat[pointCoord] = p;
      } else {
        Array.isArray(cat[pointCoord]) ? cat[pointCoord].push(p) : cat[pointCoord] = [cat[pointCoord], p];
      }
    });
    return cat;
  },
  _createErrorBarGroup: function (animationEnabled) {
    const that = this;
    const errorBarOptions = that._options.valueErrorBar;
    let settings;
    if (that.areErrorBarsVisible()) {
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
  _setGroupsSettings: function (animationEnabled) {
    const that = this;
    that._setMarkerGroupSettings();
    that._setLabelGroupSettings(animationEnabled);
    that._createErrorBarGroup(animationEnabled);
  },
  _getCreatingPointOptions: function () {
    const that = this;
    let defaultPointOptions;
    let creatingPointOptions = that._predefinedPointOptions;
    let normalStyle;
    if (!creatingPointOptions) {
      defaultPointOptions = that._getPointOptions();
      that._predefinedPointOptions = creatingPointOptions = (0, _extend2.extend)(true, {
        styles: {}
      }, defaultPointOptions);
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
  _getPointOptions: function () {
    return this._parsePointOptions(this._preparePointOptions(), this._options.label);
  },
  _getOptionsForPoint: function () {
    return this._options.point;
  },
  _parsePointStyle: function (style, defaultColor, defaultBorderColor, defaultSize) {
    const border = style.border || {};
    const sizeValue = style.size !== undefined ? style.size : defaultSize;
    return {
      fill: (0, _utils.extractColor)(style.color, true) || defaultColor,
      stroke: border.color || defaultBorderColor,
      'stroke-width': border.visible ? border.width : 0,
      r: sizeValue / 2 + (border.visible && sizeValue !== 0 ? ~~(border.width / 2) || 0 : 0)
    };
  },
  _createPointStyles: function (pointOptions) {
    const that = this;
    const mainPointColor = (0, _utils.extractColor)(pointOptions.color, true) || that._options.mainSeriesColor;
    const containerColor = that._options.containerBackgroundColor;
    const normalStyle = that._parsePointStyle(pointOptions, mainPointColor, mainPointColor);
    normalStyle.visibility = pointOptions.visible ? 'visible' : 'hidden';
    return {
      labelColor: mainPointColor,
      normal: normalStyle,
      hover: that._parsePointStyle(pointOptions.hoverStyle, containerColor, mainPointColor, pointOptions.size),
      selection: that._parsePointStyle(pointOptions.selectionStyle, containerColor, mainPointColor, pointOptions.size)
    };
  },
  _checkData: function (data, skippedFields, fieldsToCheck) {
    fieldsToCheck = fieldsToCheck || {
      value: this.getValueFields()[0]
    };
    fieldsToCheck.argument = this.getArgumentField();
    return checkFields(data, fieldsToCheck, skippedFields || {}) && data.value === data.value;
  },
  getArgumentRangeInitialValue() {
    const points = this.getPoints();
    if (this.useAggregation() && points.length) {
      var _points$0$aggregation, _points$aggregationIn;
      return {
        min: (_points$0$aggregation = points[0].aggregationInfo) === null || _points$0$aggregation === void 0 ? void 0 : _points$0$aggregation.intervalStart,
        max: (_points$aggregationIn = points[points.length - 1].aggregationInfo) === null || _points$aggregationIn === void 0 ? void 0 : _points$aggregationIn.intervalEnd
      };
    }
    return undefined;
  },
  getValueRangeInitialValue: function () {
    return undefined;
  },
  _getRangeData: function () {
    return _range_data_calculator.default.getRangeData(this);
  },
  _getPointDataSelector: function () {
    const valueField = this.getValueFields()[0];
    const argumentField = this.getArgumentField();
    const tagField = this.getTagField();
    const areErrorBarsVisible = this.areErrorBarsVisible();
    let lowValueField;
    let highValueField;
    if (areErrorBarsVisible) {
      const errorBarOptions = this._options.valueErrorBar;
      lowValueField = errorBarOptions.lowValueField || LOW_ERROR;
      highValueField = errorBarOptions.highValueField || HIGH_ERROR;
    }
    return data => {
      const pointData = {
        value: this._processEmptyValue(data[valueField]),
        argument: data[argumentField],
        tag: data[tagField],
        data: data
      };
      if (areErrorBarsVisible) {
        pointData.lowError = data[lowValueField];
        pointData.highError = data[highValueField];
      }
      return pointData;
    };
  },
  _errorBarsEnabled: function () {
    return this.valueAxisType !== DISCRETE && this.valueAxisType !== LOGARITHMIC && this.valueType !== DATETIME;
  },
  _drawPoint: function (options) {
    const point = options.point;
    if (point.isInVisibleArea()) {
      point.clearVisibility();
      point.draw(this._renderer, options.groups, options.hasAnimation, options.firstDrawing);
      this._drawnPoints.push(point);
    } else {
      point.setInvisibility();
    }
  },
  _animateComplete: function () {
    const that = this;
    const animationSettings = {
      duration: that._defaultDuration
    };
    that._labelsGroup && that._labelsGroup.animate({
      opacity: 1
    }, animationSettings);
    that._errorBarGroup && that._errorBarGroup.animate({
      opacity: that._options.valueErrorBar.opacity || 1
    }, animationSettings);
  },
  _animate: function () {
    const that = this;
    const lastPointIndex = that._drawnPoints.length - 1;
    (0, _iterator.each)(that._drawnPoints || [], function (i, p) {
      p.animate(i === lastPointIndex ? function () {
        that._animateComplete();
      } : undefined, {
        translateX: p.x,
        translateY: p.y
      });
    });
  },
  _getIntervalCenter(intervalStart, intervalEnd) {
    const argAxis = this.getArgumentAxis();
    const axisOptions = argAxis.getOptions();
    if (argAxis.aggregatedPointBetweenTicks()) {
      return intervalStart;
    }
    return axisOptions.type !== 'discrete' ? argAxis.getVisualRangeCenter({
      minVisible: intervalStart,
      maxVisible: intervalEnd
    }, true) : intervalStart;
  },
  _defaultAggregator: 'avg',
  _aggregators: {
    avg(_ref2, series) {
      let {
        data,
        intervalStart,
        intervalEnd
      } = _ref2;
      if (!data.length) {
        return;
      }
      const valueField = series.getValueFields()[0];
      const aggregationResult = data.reduce((result, item) => {
        const value = item[valueField];
        if ((0, _type.isDefined)(value)) {
          result[0] += value;
          result[1]++;
        } else if (value === null) {
          result[2]++;
        }
        return result;
      }, [0, 0, 0]);
      return calculateAvgErrorBars({
        [valueField]: aggregationResult[2] === data.length ? null : aggregationResult[0] / aggregationResult[1],
        [series.getArgumentField()]: series._getIntervalCenter(intervalStart, intervalEnd)
      }, data, series);
    },
    sum(_ref3, series) {
      let {
        intervalStart,
        intervalEnd,
        data
      } = _ref3;
      if (!data.length) {
        return;
      }
      const valueField = series.getValueFields()[0];
      const aggregationResult = data.reduce((result, item) => {
        const value = item[valueField];
        if (value !== undefined) {
          result[0] += value;
        }
        if (value === null) {
          result[1]++;
        } else if (value === undefined) {
          result[2]++;
        }
        return result;
      }, [0, 0, 0]);
      let value = aggregationResult[0];
      if (aggregationResult[1] === data.length) {
        value = null;
      }
      if (aggregationResult[2] === data.length) {
        return;
      }
      return calculateSumErrorBars({
        [valueField]: value,
        [series.getArgumentField()]: series._getIntervalCenter(intervalStart, intervalEnd)
      }, data, series);
    },
    count(_ref4, series) {
      let {
        data,
        intervalStart,
        intervalEnd
      } = _ref4;
      const valueField = series.getValueFields()[0];
      return {
        [series.getArgumentField()]: series._getIntervalCenter(intervalStart, intervalEnd),
        [valueField]: data.filter(i => i[valueField] !== undefined).length
      };
    },
    min: getMinMaxAggregator((a, b) => a < b),
    max: getMinMaxAggregator((a, b) => a > b)
  },
  _endUpdateData: function () {
    delete this._predefinedPointOptions;
  },
  getArgumentField: function () {
    return this._options.argumentField || 'arg';
  },
  getValueFields: function () {
    const options = this._options;
    const errorBarsOptions = options.valueErrorBar;
    const valueFields = [options.valueField || 'val'];
    let lowValueField;
    let highValueField;
    if (errorBarsOptions) {
      lowValueField = errorBarsOptions.lowValueField;
      highValueField = errorBarsOptions.highValueField;
      (0, _type.isString)(lowValueField) && valueFields.push(lowValueField);
      (0, _type.isString)(highValueField) && valueFields.push(highValueField);
    }
    return valueFields;
  },
  _calculateErrorBars: function (data) {
    if (!this.areErrorBarsVisible()) {
      return;
    }
    const that = this;
    const options = that._options;
    const errorBarsOptions = options.valueErrorBar;
    const errorBarType = (0, _utils.normalizeEnum)(errorBarsOptions.type);
    let floatErrorValue = parseFloat(errorBarsOptions.value);
    const valueField = that.getValueFields()[0];
    let value;
    const lowValueField = errorBarsOptions.lowValueField || LOW_ERROR;
    const highValueField = errorBarsOptions.highValueField || HIGH_ERROR;
    let valueArray;
    let valueArrayLength;
    let meanValue;
    let processDataItem;
    const addSubError = function (_i, item) {
      value = item.value;
      item.lowError = value - floatErrorValue;
      item.highError = value + floatErrorValue;
    };
    switch (errorBarType) {
      case FIXED:
        processDataItem = addSubError;
        break;
      case PERCENT:
        processDataItem = function (_, item) {
          value = item.value;
          const error = value * floatErrorValue / 100;
          item.lowError = value - error;
          item.highError = value + error;
        };
        break;
      case UNDEFINED:
        // TODO: rework this
        processDataItem = function (_, item) {
          item.lowError = item.data[lowValueField];
          item.highError = item.data[highValueField];
        };
        break;
      default:
        valueArray = (0, _utils.map)(data, function (item) {
          return (0, _type.isDefined)(item.data[valueField]) ? item.data[valueField] : null;
        });
        valueArrayLength = valueArray.length;
        floatErrorValue = floatErrorValue || 1;
        switch (errorBarType) {
          case VARIANCE:
            floatErrorValue = variance(valueArray, sum(valueArray) / valueArrayLength) * floatErrorValue;
            processDataItem = addSubError;
            break;
          case STANDARD_DEVIATION:
            meanValue = sum(valueArray) / valueArrayLength;
            floatErrorValue = _sqrt(variance(valueArray, meanValue)) * floatErrorValue;
            processDataItem = function (_, item) {
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
    processDataItem && (0, _iterator.each)(data, processDataItem);
  },
  _patchMarginOptions: function (options) {
    const pointOptions = this._getCreatingPointOptions();
    const styles = pointOptions.styles;
    const maxSize = [styles.normal, styles.hover, styles.selection].reduce(function (max, style) {
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
exports.chart = chart = (0, _extend2.extend)({}, baseScatterMethods, {
  drawTrackers: function () {
    const that = this;
    let trackers;
    let trackersGroup;
    const segments = that._segments || [];
    const rotated = that._options.rotated;
    if (!that.isVisible()) {
      return;
    }
    if (segments.length) {
      trackers = that._trackers = that._trackers || [];
      trackersGroup = that._trackersGroup = (that._trackersGroup || that._renderer.g().attr({
        fill: 'gray',
        opacity: 0.001,
        stroke: 'gray',
        'class': 'dxc-trackers'
      })).attr({
        'clip-path': this._paneClipRectID || null
      }).append(that._group);
      (0, _iterator.each)(segments, function (i, segment) {
        if (!trackers[i]) {
          trackers[i] = that._drawTrackerElement(segment).data({
            'chart-data-series': that
          }).append(trackersGroup);
        } else {
          that._updateTrackerElement(segment, trackers[i]);
        }
      });
    }
    that._trackersTranslator = that.groupPointsByCoords(rotated);
  },
  _checkAxisVisibleAreaCoord(isArgument, coord) {
    const axis = isArgument ? this.getArgumentAxis() : this.getValueAxis();
    const visibleArea = axis.getVisibleArea();
    return (0, _type.isDefined)(coord) && visibleArea[0] <= coord && visibleArea[1] >= coord;
  },
  checkSeriesViewportCoord(axis, coord) {
    return this.getPoints().length && this.isVisible();
  },
  getSeriesPairCoord(coord, isArgument) {
    let oppositeCoord = null;
    const isOpposite = !isArgument && !this._options.rotated || isArgument && this._options.rotated;
    const coordName = !isOpposite ? 'vx' : 'vy';
    const oppositeCoordName = !isOpposite ? 'vy' : 'vx';
    const points = this.getVisiblePoints();
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const tmpCoord = p[coordName] === coord ? p[oppositeCoordName] : undefined;
      if (this._checkAxisVisibleAreaCoord(!isArgument, tmpCoord)) {
        oppositeCoord = tmpCoord;
        break;
      }
    }
    return oppositeCoord;
  },
  _getNearestPoints(point, nextPoint) {
    return [point, nextPoint];
  },
  _getBezierPoints() {
    return [];
  },
  _getNearestPointsByCoord(coord, isArgument) {
    const that = this;
    const rotated = that.getOptions().rotated;
    const isOpposite = !isArgument && !rotated || isArgument && rotated;
    const coordName = isOpposite ? 'vy' : 'vx';
    const allPoints = that.getPoints();
    const bezierPoints = that._getBezierPoints();
    const nearestPoints = [];
    if (allPoints.length > 1) {
      allPoints.forEach((point, i) => {
        const nextPoint = allPoints[i + 1];
        if (nextPoint && (point[coordName] <= coord && nextPoint[coordName] >= coord || point[coordName] >= coord && nextPoint[coordName] <= coord)) {
          nearestPoints.push(that._getNearestPoints(point, nextPoint, bezierPoints));
        }
      });
    } else {
      nearestPoints.push([allPoints[0], allPoints[0]]);
    }
    return nearestPoints;
  },
  getNeighborPoint: function (x, y) {
    let pCoord = this._options.rotated ? y : x;
    let nCoord = pCoord;
    const cat = this._trackersTranslator;
    let point = null;
    let minDistance;
    const oppositeCoord = this._options.rotated ? x : y;
    const oppositeCoordName = this._options.rotated ? 'vx' : 'vy';
    if (this.isVisible() && cat) {
      point = cat[pCoord];
      do {
        point = cat[nCoord] || cat[pCoord];
        pCoord--;
        nCoord++;
      } while ((pCoord >= 0 || nCoord < cat.length) && !point);
      if (Array.isArray(point)) {
        minDistance = _abs(point[0][oppositeCoordName] - oppositeCoord);
        (0, _iterator.each)(point, function (i, p) {
          const distance = _abs(p[oppositeCoordName] - oppositeCoord);
          if (minDistance >= distance) {
            minDistance = distance;
            point = p;
          }
        });
      }
    }
    return point;
  },
  _applyVisibleArea: function () {
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
exports.polar = polar = (0, _extend2.extend)({}, baseScatterMethods, {
  drawTrackers: function () {
    chart.drawTrackers.call(this);
    const cat = this._trackersTranslator;
    let index;
    if (!this.isVisible()) {
      return;
    }
    (0, _iterator.each)(cat, function (i, category) {
      if (category) {
        index = i;
        return false;
      }
    });
    cat[index + 360] = cat[index];
  },
  getNeighborPoint: function (x, y) {
    const pos = (0, _utils.convertXYToPolar)(this.getValueAxis().getCenter(), x, y);
    return chart.getNeighborPoint.call(this, pos.phi, pos.r);
  },
  _applyVisibleArea: function () {
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
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const tmpPoint = (0, _type.isDefined)(p[paramName]) && (0, _type.isDefined)(params[paramName]) && p[paramName].valueOf() === params[paramName].valueOf() ? {
        x: p.x,
        y: p.y
      } : undefined;
      if ((0, _type.isDefined)(tmpPoint)) {
        coords = tmpPoint;
        break;
      }
    }
    return coords;
  }
});