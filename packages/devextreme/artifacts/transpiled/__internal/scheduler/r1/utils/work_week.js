"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStartViewDate = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _base = require("./base");
var _week = require("./week");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const MONDAY_INDEX = 1;
const DAYS_IN_WEEK = 7;
const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration, firstDayOfWeek) => {
  const viewStart = (0, _base.getViewStartByOptions)(startDate, currentDate, intervalDuration, (0, _week.getValidStartDate)(startDate, firstDayOfWeek));
  const firstViewDate = _date.default.getFirstWeekDate(viewStart, firstDayOfWeek);
  if ((0, _base.isDataOnWeekend)(firstViewDate)) {
    const currentDay = firstViewDate.getDay();
    const distance = (MONDAY_INDEX + DAYS_IN_WEEK - currentDay) % 7;
    firstViewDate.setDate(firstViewDate.getDate() + distance);
  }
  return (0, _base.setOptionHour)(firstViewDate, startDayHour);
};
exports.calculateStartViewDate = calculateStartViewDate;