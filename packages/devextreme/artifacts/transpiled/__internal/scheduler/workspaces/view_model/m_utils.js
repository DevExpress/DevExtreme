"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alignToFirstDayOfWeek = alignToFirstDayOfWeek;
exports.alignToLastDayOfWeek = alignToLastDayOfWeek;
exports.calculateAlignedWeeksBetweenDates = calculateAlignedWeeksBetweenDates;
exports.calculateDaysBetweenDates = calculateDaysBetweenDates;
exports.getViewDataGeneratorByViewType = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _m_constants = require("../../m_constants");
var _m_view_data_generator = require("./m_view_data_generator");
var _m_view_data_generator_day = require("./m_view_data_generator_day");
var _m_view_data_generator_month = require("./m_view_data_generator_month");
var _m_view_data_generator_timeline_month = require("./m_view_data_generator_timeline_month");
var _m_view_data_generator_week = require("./m_view_data_generator_week");
var _m_view_data_generator_work_week = require("./m_view_data_generator_work_week");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-cycle

const DAYS_IN_WEEK = 7;
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const getViewDataGeneratorByViewType = viewType => {
  switch (viewType) {
    case _m_constants.VIEWS.MONTH:
      return new _m_view_data_generator_month.ViewDataGeneratorMonth();
    case _m_constants.VIEWS.TIMELINE_MONTH:
      return new _m_view_data_generator_timeline_month.ViewDataGeneratorTimelineMonth();
    case _m_constants.VIEWS.DAY:
    case _m_constants.VIEWS.TIMELINE_DAY:
      return new _m_view_data_generator_day.ViewDataGeneratorDay();
    case _m_constants.VIEWS.WEEK:
    case _m_constants.VIEWS.TIMELINE_WEEK:
      return new _m_view_data_generator_week.ViewDataGeneratorWeek();
    case _m_constants.VIEWS.WORK_WEEK:
    case _m_constants.VIEWS.TIMELINE_WORK_WEEK:
      return new _m_view_data_generator_work_week.ViewDataGeneratorWorkWeek();
    default:
      return new _m_view_data_generator.ViewDataGenerator();
  }
};
exports.getViewDataGeneratorByViewType = getViewDataGeneratorByViewType;
function alignToFirstDayOfWeek(date, firstDayOfWeek) {
  const newDate = new Date(date);
  let dayDiff = newDate.getDay() - firstDayOfWeek;
  if (dayDiff < 0) {
    dayDiff += DAYS_IN_WEEK;
  }
  newDate.setDate(newDate.getDate() - dayDiff);
  return newDate;
}
function alignToLastDayOfWeek(date, firstDayOfWeek) {
  const newDate = alignToFirstDayOfWeek(date, firstDayOfWeek);
  newDate.setDate(newDate.getDate() + DAYS_IN_WEEK - 1);
  return newDate;
}
function calculateDaysBetweenDates(fromDate, toDate) {
  const msDiff = _date.default.trimTime(toDate).getTime() - _date.default.trimTime(fromDate).getTime();
  return Math.round(msDiff / MS_IN_DAY) + 1;
}
function calculateAlignedWeeksBetweenDates(fromDate, toDate, firstDayOfWeek) {
  const alignedFromDate = alignToFirstDayOfWeek(fromDate, firstDayOfWeek);
  const alignedToDate = alignToLastDayOfWeek(toDate, firstDayOfWeek);
  const weekCount = calculateDaysBetweenDates(alignedFromDate, alignedToDate) / DAYS_IN_WEEK;
  return Math.max(weekCount, 6);
}