"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visibleIntervalMustBeDivisibleByCellDuration = exports.endDayHourMustBeGreaterThanStartDayHour = exports.cellDurationMustBeLessThanVisibleInterval = void 0;
var _index = require("./common/index");
var _index2 = require("./core/index");
const endDayHourMustBeGreaterThanStartDayHour = exports.endDayHourMustBeGreaterThanStartDayHour = (0, _index2.createValidatorRule)('endDayHourGreaterThanStartDayHour', _ref => {
  let {
    startDayHour,
    endDayHour
  } = _ref;
  return (0, _index.greaterThan)(endDayHour, startDayHour) || `endDayHour: ${endDayHour} must be greater that startDayHour: ${startDayHour}.`;
});
const visibleIntervalMustBeDivisibleByCellDuration = exports.visibleIntervalMustBeDivisibleByCellDuration = (0, _index2.createValidatorRule)('visibleIntervalMustBeDivisibleByCellDuration', _ref2 => {
  let {
    cellDuration,
    startDayHour,
    endDayHour
  } = _ref2;
  const visibleInterval = (endDayHour - startDayHour) * 60;
  return (0, _index.divisibleBy)(visibleInterval, cellDuration) || `endDayHour - startDayHour: ${visibleInterval} (minutes), must be divisible by cellDuration: ${cellDuration} (minutes).`;
});
const cellDurationMustBeLessThanVisibleInterval = exports.cellDurationMustBeLessThanVisibleInterval = (0, _index2.createValidatorRule)('cellDurationMustBeLessThanVisibleInterval', _ref3 => {
  let {
    cellDuration,
    startDayHour,
    endDayHour
  } = _ref3;
  const visibleInterval = (endDayHour - startDayHour) * 60;
  return (0, _index.lessThan)(cellDuration, visibleInterval, false) || `endDayHour - startDayHour: ${visibleInterval} (minutes), must be greater or equal the cellDuration: ${cellDuration} (minutes).`;
});