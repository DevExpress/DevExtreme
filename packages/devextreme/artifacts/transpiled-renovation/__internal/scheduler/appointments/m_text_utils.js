"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormatType = exports.formatDates = exports.createFormattedDateText = void 0;
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _date2 = _interopRequireDefault(require("../../../localization/date"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const createFormattedDateText = options => {
  const {
    startDate,
    endDate,
    allDay,
    format
  } = options;
  const formatType = format || getFormatType(startDate, endDate, allDay);
  return formatDates(startDate, endDate, formatType);
};
exports.createFormattedDateText = createFormattedDateText;
const getFormatType = (startDate, endDate, isAllDay, isDateAndTimeView) => {
  if (isAllDay) {
    return 'DATE';
  }
  if (isDateAndTimeView && _date.default.sameDate(startDate, endDate)) {
    return 'TIME';
  }
  return 'DATETIME';
};
// @ts-expect-error
exports.getFormatType = getFormatType;
const formatDates = (startDate, endDate, formatType) => {
  const dateFormat = 'monthandday';
  const timeFormat = 'shorttime';
  const isSameDate = startDate.getDate() === endDate.getDate();
  switch (formatType) {
    case 'DATETIME':
      return [_date2.default.format(startDate, dateFormat), ' ', _date2.default.format(startDate, timeFormat), ' - ', isSameDate ? '' : `${_date2.default.format(endDate, dateFormat)} `, _date2.default.format(endDate, timeFormat)].join('');
    case 'TIME':
      return `${_date2.default.format(startDate, timeFormat)} - ${_date2.default.format(endDate, timeFormat)}`;
    case 'DATE':
      return `${_date2.default.format(startDate, dateFormat)}${isSameDate ? '' : ` - ${_date2.default.format(endDate, dateFormat)}`}`;
    default:
      break;
  }
};
exports.formatDates = formatDates;