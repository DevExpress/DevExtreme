"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateStartViewDate = void 0;
var _base = require("./base");
const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration) => {
  const firstViewDate = (0, _base.getViewStartByOptions)(startDate, currentDate, intervalDuration, startDate);
  return (0, _base.setOptionHour)(firstViewDate, startDayHour);
};
exports.calculateStartViewDate = calculateStartViewDate;