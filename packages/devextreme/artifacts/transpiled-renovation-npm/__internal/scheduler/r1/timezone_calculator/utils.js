"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeZoneCalculator = void 0;
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _calculator = require("./calculator");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createTimeZoneCalculator = currentTimeZone => new _calculator.TimeZoneCalculator({
  getClientOffset: date => _m_utils_time_zone.default.getClientTimezoneOffset(date),
  tryGetCommonOffset: date => _m_utils_time_zone.default.calculateTimezoneByValue(currentTimeZone, date),
  tryGetAppointmentOffset: (date, appointmentTimezone) => _m_utils_time_zone.default.calculateTimezoneByValue(appointmentTimezone, date)
});
exports.createTimeZoneCalculator = createTimeZoneCalculator;