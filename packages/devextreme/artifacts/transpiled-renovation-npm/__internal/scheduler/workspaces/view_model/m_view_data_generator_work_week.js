"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDataGeneratorWorkWeek = void 0;
var _index = require("../../../scheduler/r1/utils/index");
var _m_view_data_generator_week = require("./m_view_data_generator_week");
class ViewDataGeneratorWorkWeek extends _m_view_data_generator_week.ViewDataGeneratorWeek {
  constructor() {
    super(...arguments);
    this.daysInInterval = 5;
    this.isWorkView = true;
  }
  isSkippedDate(date) {
    return (0, _index.isDataOnWeekend)(date);
  }
  _calculateStartViewDate(options) {
    return _index.workWeekUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, this._getIntervalDuration(options.intervalCount), this.getFirstDayOfWeek(options.firstDayOfWeek));
  }
  getFirstDayOfWeek(firstDayOfWeekOption) {
    return firstDayOfWeekOption || 0;
  }
}
exports.ViewDataGeneratorWorkWeek = ViewDataGeneratorWorkWeek;