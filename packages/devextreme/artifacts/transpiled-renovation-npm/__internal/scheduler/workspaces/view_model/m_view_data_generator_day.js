"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDataGeneratorDay = void 0;
var _index = require("../../../scheduler/r1/utils/index");
var _m_view_data_generator = require("./m_view_data_generator");
class ViewDataGeneratorDay extends _m_view_data_generator.ViewDataGenerator {
  _calculateStartViewDate(options) {
    return _index.dayUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, this._getIntervalDuration(options.intervalCount));
  }
}
exports.ViewDataGeneratorDay = ViewDataGeneratorDay;