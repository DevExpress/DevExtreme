"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStartViewDate = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _base = require("./base");
var _month = require("./month");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalCount) => {
  const firstViewDate = _date.default.getFirstMonthDate((0, _month.getViewStartByOptions)(startDate, currentDate, intervalCount, _date.default.getFirstMonthDate(startDate)));
  return (0, _base.setOptionHour)(firstViewDate, startDayHour);
};
exports.calculateStartViewDate = calculateStartViewDate;