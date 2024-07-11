"use strict";

exports.default = void 0;
var _type = require("../../core/utils/type");
var _date = _interopRequireDefault(require("../../core/utils/date"));
var _math = require("../../core/utils/math");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const floor = Math.floor;
var _default = exports.default = {
  _intervalize: function (value, interval) {
    if (!(0, _type.isDefined)(value)) {
      return undefined;
    }
    if (this._businessRange.dataType === 'datetime') {
      if ((0, _type.isNumeric)(value)) {
        value = new Date(value);
      } else {
        value = new Date(value.getTime());
      }
      value = _date.default.correctDateWithUnitBeginning(value, interval, null, this._options.firstDayOfWeek);
    } else {
      value = (0, _math.adjust)(floor((0, _math.adjust)(value / interval)) * interval, interval);
    }
    return value;
  },
  translate: function (bp, direction, skipRound, interval) {
    const that = this;
    const specialValue = that.translateSpecialCase(bp);
    if ((0, _type.isDefined)(specialValue)) {
      return Math.round(specialValue);
    }
    interval = interval || that._options.interval;

    // TODO B253861
    if (!that.isValid(bp, interval)) {
      return null;
    }
    return that.to(bp, direction, skipRound, interval);
  },
  getInterval: function () {
    return Math.round(this._canvasOptions.ratioOfCanvasRange * (this._businessRange.interval || Math.abs(this._canvasOptions.rangeMax - this._canvasOptions.rangeMin)));
  },
  zoom: function () {},
  getMinScale: function () {},
  getScale: function () {},
  _parse: function (value) {
    return this._businessRange.dataType === 'datetime' ? new Date(value) : Number(value);
  },
  fromValue: function (value) {
    return this._parse(value);
  },
  toValue: function (value) {
    return this._parse(value);
  },
  isValid: function (value, interval) {
    const that = this;
    const co = that._canvasOptions;
    let rangeMin = co.rangeMin;
    let rangeMax = co.rangeMax;
    interval = interval || that._options.interval;
    if (value === null || isNaN(value)) {
      return false;
    }
    value = that._businessRange.dataType === 'datetime' && (0, _type.isNumeric)(value) ? new Date(value) : value;
    if (interval !== that._options.interval) {
      rangeMin = that._intervalize(rangeMin, interval);
      rangeMax = that._intervalize(rangeMax, interval);
    }
    if (value.valueOf() < rangeMin || value.valueOf() >= _date.default.addInterval(rangeMax, interval)) {
      return false;
    }
    return true;
  },
  to: function (bp, direction, skipRound, interval) {
    const that = this;
    interval = interval || that._options.interval;
    const v1 = that._intervalize(bp, interval);
    const v2 = _date.default.addInterval(v1, interval);
    let res = that._to(v1, skipRound);
    const p2 = that._to(v2, skipRound);
    if (!direction) {
      res = floor((res + p2) / 2);
    } else if (direction > 0) {
      res = p2;
    }
    return res;
  },
  _to: function (value, skipRound) {
    const co = this._canvasOptions;
    const rMin = co.rangeMinVisible;
    const rMax = co.rangeMaxVisible;
    let offset = value - rMin;
    if (value < rMin) {
      offset = 0;
    } else if (value > rMax) {
      offset = _date.default.addInterval(rMax, this._options.interval) - rMin;
    }
    const projectedValue = this._calculateProjection(offset * this._canvasOptions.ratioOfCanvasRange);
    return this._conversionValue(projectedValue, skipRound);
  },
  from: function (position, direction) {
    const that = this;
    const origInterval = that._options.interval;
    let interval = origInterval;
    const co = that._canvasOptions;
    const rMin = co.rangeMinVisible;
    const rMax = co.rangeMaxVisible;
    let value;
    if (that._businessRange.dataType === 'datetime') {
      interval = _date.default.dateToMilliseconds(origInterval);
    }
    value = that._calculateUnProjection((position - that._canvasOptions.startPoint) / that._canvasOptions.ratioOfCanvasRange);
    value = that._intervalize(_date.default.addInterval(value, interval / 2, direction > 0), origInterval);
    if (value < rMin) {
      value = rMin;
    } else if (value > rMax) {
      value = rMax;
    }
    return value;
  },
  _add: function () {
    return NaN;
  },
  isValueProlonged: true
};
module.exports = exports.default;
module.exports.default = exports.default;