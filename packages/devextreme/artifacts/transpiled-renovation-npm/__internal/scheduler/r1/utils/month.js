"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getViewStartByOptions = exports.getCellText = exports.calculateStartViewDate = exports.calculateCellIndex = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = _interopRequireDefault(require("../../../../localization/date"));
var _base = require("./base");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const calculateCellIndex = (rowIndex, columnIndex, _, columnCount) => rowIndex * columnCount + columnIndex;
exports.calculateCellIndex = calculateCellIndex;
const getViewStartByOptions = (startDate, currentDate, intervalCount, startViewDate) => {
  if (!startDate) {
    return new Date(currentDate);
  }
  let currentStartDate = new Date(startViewDate);
  const validStartViewDate = new Date(startViewDate);
  const diff = currentStartDate.getTime() <= currentDate.getTime() ? 1 : -1;
  let endDate = new Date(new Date(validStartViewDate.setMonth(validStartViewDate.getMonth() + diff * intervalCount)));
  while (!(0, _base.isDateInRange)(currentDate, currentStartDate, endDate, diff)) {
    currentStartDate = new Date(endDate);
    if (diff > 0) {
      currentStartDate.setDate(1);
    }
    endDate = new Date(new Date(endDate.setMonth(endDate.getMonth() + diff * intervalCount)));
  }
  return diff > 0 ? currentStartDate : endDate;
};
exports.getViewStartByOptions = getViewStartByOptions;
const getCellText = (date, intervalCount) => {
  if ((0, _base.isFirstCellInMonthWithIntervalCount)(date, intervalCount)) {
    const monthName = _date2.default.getMonthNames('abbreviated')[date.getMonth()];
    return [monthName, _date2.default.format(date, 'day')].join(' ');
  }
  return _date2.default.format(date, 'dd');
};
exports.getCellText = getCellText;
const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalCount, firstDayOfWeekOption) => {
  const viewStart = getViewStartByOptions(startDate, currentDate, intervalCount, _date.default.getFirstMonthDate(startDate));
  const firstMonthDate = _date.default.getFirstMonthDate(viewStart);
  const firstDayOfWeek = (0, _base.getCalculatedFirstDayOfWeek)(firstDayOfWeekOption);
  const firstViewDate = _date.default.getFirstWeekDate(firstMonthDate, firstDayOfWeek);
  return (0, _base.setOptionHour)(firstViewDate, startDayHour);
};
exports.calculateStartViewDate = calculateStartViewDate;