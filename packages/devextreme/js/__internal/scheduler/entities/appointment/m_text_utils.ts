import dateLocalization from '@js/common/core/localization/date';
import dateUtils from '@js/core/utils/date';

export enum DateFormatType {
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  DATE = 'DATE',
}

export const createFormattedDateText = (options) => {
  const {
    startDate,
    endDate,
    allDay,
    format,
  } = options;

  const formatType = format || getFormatType(startDate, endDate, allDay);

  return formatDates(startDate, endDate, formatType);
};

export const getFormatType = (startDate, endDate, isAllDay, isDateAndTimeView?) => {
  if (isAllDay) {
    return DateFormatType.DATE;
  }
  if (isDateAndTimeView && dateUtils.sameDate(startDate, endDate)) {
    return DateFormatType.TIME;
  }
  return DateFormatType.DATETIME;
};

export const formatDates = (startDate, endDate, formatType) => {
  const dateFormat = 'monthandday';
  const timeFormat = 'shorttime';
  const isSameDate = startDate.getDate() === endDate.getDate();

  switch (formatType) {
    case DateFormatType.DATETIME:
      return [
        dateLocalization.format(startDate, dateFormat),
        ' ',
        dateLocalization.format(startDate, timeFormat),
        ' - ',
        isSameDate ? '' : `${dateLocalization.format(endDate, dateFormat)} `,
        dateLocalization.format(endDate, timeFormat),
      ].join('');
    case DateFormatType.TIME:
      return `${dateLocalization.format(startDate, timeFormat)} - ${dateLocalization.format(endDate, timeFormat)}`;
    case DateFormatType.DATE:
      return `${dateLocalization.format(startDate, dateFormat)}${isSameDate ? '' : ` - ${dateLocalization.format(endDate, dateFormat)}`}`;
    default:
      return undefined;
  }
};
