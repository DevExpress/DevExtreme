"use strict";

exports.formatRange = formatRange;
exports.smartFormatter = smartFormatter;
var _format_helper = _interopRequireDefault(require("../../format_helper"));
var _type = require("../../core/utils/type");
var _date = _interopRequireDefault(require("../../core/utils/date"));
var _math = require("../../core/utils/math");
var _utils = require("../core/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const _format = _format_helper.default.format;
const {
  abs,
  floor
} = Math;
const EXPONENTIAL = 'exponential';
const formats = ['fixedPoint', 'thousands', 'millions', 'billions', 'trillions', EXPONENTIAL];
const dateUnitIntervals = ['millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'];
const INTERVALS_MAP = {
  'week': 'day',
  'quarter': 'month',
  'shorttime': 'hour',
  'longtime': 'second'
};
function patchFirstTickDiff(differences, tickFormatIndex) {
  for (let i = tickFormatIndex; i < dateUnitIntervals.length - 1; i++) {
    const dateUnitInterval = dateUnitIntervals[i];
    if (i === tickFormatIndex) {
      setDateUnitInterval(differences, tickFormatIndex + (differences['millisecond'] ? 2 : 1));
      break;
    } else if (differences[dateUnitInterval] && differences.count > 1) {
      resetDateUnitInterval(differences, i);
      break;
    }
  }
}
function patchTickDiff(differences, tickFormatIndex) {
  let patched = false;
  for (let i = dateUnitIntervals.length - 1; i >= tickFormatIndex; i--) {
    const dateUnitInterval = dateUnitIntervals[i];
    if (differences[dateUnitInterval]) {
      if (i - tickFormatIndex > 1) {
        for (let j = 0; j <= tickFormatIndex; j++) {
          resetDateUnitInterval(differences, j);
          patched = true;
        }
        break;
      }
    }
  }
  return patched;
}
function getDatesDifferences(prevDate, curDate, nextDate, tickIntervalFormat) {
  tickIntervalFormat = INTERVALS_MAP[tickIntervalFormat] || tickIntervalFormat;
  const tickFormatIndex = dateUnitIntervals.indexOf(tickIntervalFormat);
  if (nextDate) {
    const nextDifferences = _date.default.getDatesDifferences(curDate, nextDate);
    if (nextDifferences[tickIntervalFormat]) {
      patchFirstTickDiff(nextDifferences, tickFormatIndex);
    }
    return nextDifferences;
  } else {
    const prevDifferences = _date.default.getDatesDifferences(prevDate, curDate);
    const patched = patchTickDiff(prevDifferences, tickFormatIndex);
    if (!patched && prevDifferences.count === 1) {
      setDateUnitInterval(prevDifferences, tickFormatIndex);
    }
    return prevDifferences;
  }
}
function resetDateUnitInterval(differences, intervalIndex) {
  const dateUnitInterval = dateUnitIntervals[intervalIndex];
  if (differences[dateUnitInterval]) {
    differences[dateUnitInterval] = false;
    differences.count--;
  }
}
function setDateUnitInterval(differences, intervalIndex) {
  const dateUnitInterval = dateUnitIntervals[intervalIndex];
  if (differences[dateUnitInterval] === false) {
    differences[dateUnitInterval] = true;
    differences.count++;
  }
}
function getNoZeroIndex(str) {
  return str.length - parseInt(str).toString().length;
}
function getTransitionTickIndex(ticks, value) {
  let i;
  let curDiff;
  let minDiff;
  let nearestTickIndex = 0;
  minDiff = abs(value - ticks[0]);
  for (i = 1; i < ticks.length; i++) {
    curDiff = abs(value - ticks[i]);
    if (curDiff < minDiff) {
      minDiff = curDiff;
      nearestTickIndex = i;
    }
  }
  return nearestTickIndex;
}
function splitDecimalNumber(value) {
  return value.toString().split('.');
}
function createFormat(type) {
  let formatter;
  if ((0, _type.isFunction)(type)) {
    formatter = type;
    type = null;
  }
  return {
    type,
    formatter
  };
}
function formatLogarithmicNumber(tick) {
  const log10Tick = (0, _utils.getAdjustedLog10)(abs(tick));
  let type;
  if (log10Tick > 0) {
    type = formats[floor(log10Tick / 3)] || EXPONENTIAL;
  } else {
    if (log10Tick < -4) {
      type = EXPONENTIAL;
    } else {
      return _format((0, _math.adjust)(tick));
    }
  }
  return _format(tick, {
    type,
    precision: 0
  });
}
function getDateTimeFormat(tick, _ref) {
  let {
    showTransition,
    ticks,
    tickInterval
  } = _ref;
  let typeFormat = _date.default.getDateFormatByTickInterval(tickInterval);
  let prevDateIndex;
  let nextDateIndex;
  if (showTransition && ticks.length) {
    const indexOfTick = ticks.map(Number).indexOf(+tick);
    if (ticks.length === 1 && indexOfTick === 0) {
      typeFormat = _format_helper.default.getDateFormatByTicks(ticks);
    } else {
      if (indexOfTick === -1) {
        prevDateIndex = getTransitionTickIndex(ticks, tick);
      } else {
        prevDateIndex = indexOfTick === 0 ? ticks.length - 1 : indexOfTick - 1;
        nextDateIndex = indexOfTick === 0 ? 1 : -1;
      }
      const datesDifferences = getDatesDifferences(ticks[prevDateIndex], tick, ticks[nextDateIndex], typeFormat);
      typeFormat = _format_helper.default.getDateFormatByDifferences(datesDifferences, typeFormat);
    }
  }
  return createFormat(typeFormat);
}
function getFormatExponential(tick, tickInterval) {
  const stringTick = abs(tick).toString();
  if ((0, _type.isExponential)(tick)) {
    return Math.max(abs((0, _math.getExponent)(tick) - (0, _math.getExponent)(tickInterval)), abs((0, _math.getPrecision)(tick) - (0, _math.getPrecision)(tickInterval)));
  } else {
    return abs(getNoZeroIndex(stringTick.split('.')[1]) - (0, _math.getExponent)(tickInterval) + 1);
  }
}
function getFormatWithModifier(tick, tickInterval) {
  const tickIntervalIndex = floor((0, _utils.getAdjustedLog10)(tickInterval));
  let tickIndex;
  let precision = 0;
  let actualIndex = tickIndex = floor((0, _utils.getAdjustedLog10)(abs(tick)));
  if (tickIndex - tickIntervalIndex >= 2) {
    actualIndex = tickIntervalIndex;
  }
  let indexOfFormat = floor(actualIndex / 3);
  const offset = indexOfFormat * 3;
  if (indexOfFormat < 0) {
    indexOfFormat = 0;
  }
  const typeFormat = formats[indexOfFormat] || formats[formats.length - 1];
  if (offset > 0) {
    const separatedTickInterval = splitDecimalNumber(tickInterval / Math.pow(10, offset));
    if (separatedTickInterval[1]) {
      precision = separatedTickInterval[1].length;
    }
  }
  return {
    precision,
    type: typeFormat
  };
}
function getHighDiffFormat(diff) {
  let stop = false;
  for (const i in diff) {
    if (diff[i] === true || i === 'hour' || stop) {
      diff[i] = false;
      stop = true;
    } else if (diff[i] === false) {
      diff[i] = true;
    }
  }
  return createFormat(_format_helper.default.getDateFormatByDifferences(diff));
}
function getHighAndSelfDiffFormat(diff, interval) {
  let stop = false;
  for (const i in diff) {
    if (stop) {
      diff[i] = false;
    } else if (i === interval) {
      stop = true;
    } else {
      diff[i] = true;
    }
  }
  return createFormat(_format_helper.default.getDateFormatByDifferences(diff));
}
function formatDateRange(startValue, endValue, tickInterval) {
  const diff = getDatesDifferences(startValue, endValue);
  const typeFormat = _date.default.getDateFormatByTickInterval(tickInterval);
  const diffFormatType = _format_helper.default.getDateFormatByDifferences(diff, typeFormat);
  const diffFormat = createFormat(diffFormatType);
  const values = [];
  if (tickInterval in diff) {
    const rangeFormat = getHighAndSelfDiffFormat(getDatesDifferences(startValue, endValue), tickInterval);
    const value = _format(startValue, rangeFormat);
    if (value) {
      values.push(value);
    }
  } else {
    const rangeFormat = getHighDiffFormat(getDatesDifferences(startValue, endValue));
    const highValue = _format(startValue, rangeFormat);
    if (highValue) {
      values.push(highValue);
    }
    values.push(`${_format(startValue, diffFormat)} - ${_format(endValue, diffFormat)}`);
  }
  return values.join(', ');
}
function processDateInterval(interval) {
  if ((0, _type.isObject)(interval)) {
    const dateUnits = Object.keys(interval);
    const sum = dateUnits.reduce((sum, k) => interval[k] + sum, 0);
    if (sum === 1) {
      const dateUnit = dateUnits.filter(k => interval[k] === 1)[0];
      return dateUnit.slice(0, dateUnit.length - 1);
    }
  }
  return interval;
}
function smartFormatter(tick, options) {
  let tickInterval = options.tickInterval;
  const stringTick = abs(tick).toString();
  let format = options.labelOptions.format;
  const ticks = options.ticks;
  const isLogarithmic = options.type === 'logarithmic';
  if (ticks.length === 1 && ticks.indexOf(tick) === 0 && !(0, _type.isDefined)(tickInterval)) {
    tickInterval = abs(tick) >= 1 ? 1 : (0, _math.adjust)(1 - abs(tick), tick);
  }
  if (Object.is(tick, -0)) {
    tick = 0;
  }
  if (!(0, _type.isDefined)(format) && options.type !== 'discrete' && tick && (options.logarithmBase === 10 || !isLogarithmic)) {
    if (options.dataType !== 'datetime' && (0, _type.isDefined)(tickInterval)) {
      if (ticks.length && ticks.indexOf(tick) === -1) {
        const indexOfTick = getTransitionTickIndex(ticks, tick);
        tickInterval = (0, _math.adjust)(abs(tick - ticks[indexOfTick]), tick);
      }
      if (isLogarithmic) {
        return formatLogarithmicNumber(tick);
      } else {
        let separatedTickInterval = splitDecimalNumber(tickInterval);
        if (separatedTickInterval < 2) {
          separatedTickInterval = splitDecimalNumber(tick);
        }
        if (separatedTickInterval.length > 1 && !(0, _type.isExponential)(tickInterval)) {
          format = {
            type: formats[0],
            precision: separatedTickInterval[1].length
          };
        } else {
          if ((0, _type.isExponential)(tickInterval) && (stringTick.indexOf('.') !== -1 || (0, _type.isExponential)(tick))) {
            format = {
              type: EXPONENTIAL,
              precision: getFormatExponential(tick, tickInterval)
            };
          } else {
            format = getFormatWithModifier(tick, tickInterval);
          }
        }
      }
    } else if (options.dataType === 'datetime') {
      format = getDateTimeFormat(tick, options);
    }
  }
  return _format(tick, format);
}
function formatRange(_ref2) {
  let {
    startValue,
    endValue,
    tickInterval,
    argumentFormat,
    axisOptions: {
      dataType,
      type,
      logarithmBase
    }
  } = _ref2;
  if (type === 'discrete') {
    return '';
  }
  if (dataType === 'datetime') {
    return formatDateRange(startValue, endValue, processDateInterval(tickInterval));
  }
  const formatOptions = {
    ticks: [],
    type,
    dataType,
    tickInterval,
    logarithmBase,
    labelOptions: {
      format: argumentFormat
    }
  };
  return `${smartFormatter(startValue, formatOptions)} - ${smartFormatter(endValue, formatOptions)}`;
}